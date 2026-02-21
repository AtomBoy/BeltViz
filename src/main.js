import * as THREE from 'three';
import { createGlobe, createSun, createMoon } from './scene/globe.js';
import { solarPosition, lunarPosition } from './utils/astronomy.js';
import { setupLighting } from './scene/lighting.js';
import { setupControls } from './scene/controls.js';
import { buildFieldLineGroup } from './scene/fieldLines.js';
import { traceFieldLine, generateSeedPoints } from './physics/fieldLineTracer.js';
import { latitudeToColor } from './utils/colors.js';
import { createControlPanel } from './ui/controlPanel.js';
import { createInfoOverlay } from './ui/infoOverlay.js';
import { extractIsosurface } from './physics/marchingCubes.js';
import {
  buildIsosurfaceGroup,
  disposeIsosurfaceGroup,
  updateIsosurfaceOpacity,
  updateIsosurfaceClipping,
  DEFAULT_B_LEVELS,
  DEFAULT_L_LEVELS,
} from './scene/isosurfaces.js';
import {
  buildRadiationBeltGroup,
  disposeRadiationBeltGroup,
  updateBeltClipping,
  updateBeltOpacity,
  BELT_DEFINITIONS,
} from './scene/radiationBelts.js';
import { createClippingPlanes } from './scene/clippingPlanes.js';
import { createSatelliteMarker } from './scene/satelliteMarker.js';
import { geographicToPhysicsPosition } from './physics/satellitePosition.js';
import { computeMagneticEnvironment } from './physics/magneticEnvironment.js';
import { updateEnvironmentReadout, hideEnvironmentReadout } from './ui/environmentReadout.js';
import { KM_TO_SCENE } from './utils/constants.js';

// --- Params (mutable, controlled by GUI) ---
const params = {
  maxDegree: 1, // start with dipole
  numLatitudes: 4,
  numLongitudes: 8,
  tubeRadius: 0.008,
  showFieldLines: true,
  autoRotate: true,
  // Isosurface params
  showIsosurfaces: false,
  isoMode: 'lShell', // 'lShell' or 'fieldStrength'
  isoResolution: 64,
  isoOpacity: 0.2,
  isoLevels: {},
  // Radiation belt params
  showInnerBelt: false,
  showOuterBelt: false,
  beltOpacity: 0.15,
  // Clipping params
  clipEquatorial: false,
  clipMeridional: false,
  clipMeridionalAngle: 0,
  // Satellite probe params
  showSatellite: false,
  satLatitude: 0,
  satLongitude: 0,
  satAltitude: 400,
  // Solar wind params
  solarWindEnabled: false,
  solarWindSpeed: 400,
  solarWindDensity: 5,
  imfBz: 0,
  dst: 0,
  sunLongitude: 0,      // internal — computed from datetime, not a user slider
  sunDeclination: 0,    // internal — computed from datetime
  showMagnetopause: false,
  // Date & Time params
  datetimeString: (() => {
    const d = new Date();
    d.setMonth(d.getMonth() - 1);
    return d.toISOString().slice(0, 16);
  })(),
  showMoon: true,
};

/**
 * Populate isoLevels based on current mode.
 */
function initIsoLevels() {
  params.isoLevels = {};
  if (params.isoMode === 'lShell') {
    for (const level of DEFAULT_L_LEVELS) {
      params.isoLevels[level] = [2, 4, 6, 10].includes(level);
    }
  } else {
    for (const level of DEFAULT_B_LEVELS) {
      params.isoLevels[level] = [10000, 5000, 2000, 500].includes(level);
    }
  }
}
initIsoLevels();

/**
 * Build solarWindParams object from GUI params (or null if disabled).
 */
function getSolarWindParams() {
  if (!params.solarWindEnabled) return null;
  return {
    enabled: true,
    vSw: params.solarWindSpeed,
    nSw: params.solarWindDensity,
    imfBz: params.imfBz,
    dst: params.dst,
    sunLonRad: params.sunLongitude * Math.PI / 180,
    ps: params.sunDeclination * Math.PI / 180, // dipole tilt ≈ solar declination
  };
}

// Note: Scalar field grids (L-shell, |B|) always use pure IGRF — the dipole
// L-shell approximation produces artifacts with external fields (neutral sheet
// discontinuities, magnetopause boundary artifacts). Solar wind asymmetry is
// shown through field line traces and the magnetopause mesh instead.

// --- Latitude bands for seed points ---
const LATITUDE_SETS = [
  [55],
  [40, 65],
  [30, 50, 70],
  [25, 40, 55, 70],
  [20, 35, 50, 60, 72],
  [20, 30, 42, 54, 64, 75],
  [18, 28, 38, 48, 58, 68, 78],
  [15, 24, 33, 42, 51, 60, 69, 78],
  [14, 22, 30, 38, 46, 54, 62, 70, 78],
  [12, 20, 28, 36, 44, 52, 60, 68, 74, 80],
  [12, 19, 26, 33, 40, 47, 54, 61, 68, 74, 80],
  [10, 17, 24, 31, 38, 45, 52, 59, 66, 72, 78, 82],
];

// --- Three.js setup ---
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.localClippingEnabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000008);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.01,
  500
);
camera.position.set(0, 1.5, 4);

// --- Scene objects ---
createGlobe(scene);
const { sunLight } = setupLighting(scene);
const sun = createSun(scene);
const moon = createMoon(scene);
const controls = setupControls(camera, renderer);

// --- Clipping planes ---
const clipping = createClippingPlanes();

// --- Satellite marker ---
const satellite = createSatelliteMarker();
scene.add(satellite.mesh);

// --- Field lines ---
let fieldLineGroup = null;
let fieldLineBuildId = 0; // generation counter to cancel stale async builds
let coeffs = null;

async function loadCoefficients() {
  const response = await fetch('./data/igrf14coeffs.json');
  coeffs = await response.json();
}

/**
 * Trace field lines and build the mesh group.
 */
async function rebuildFieldLines() {
  const buildId = ++fieldLineBuildId;

  if (fieldLineGroup) {
    scene.remove(fieldLineGroup);
    fieldLineGroup.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    fieldLineGroup = null;
  }

  const latitudes = LATITUDE_SETS[params.numLatitudes - 1];
  const swActive = params.solarWindEnabled;
  const seeds = generateSeedPoints({
    latitudes,
    nLongitudes: params.numLongitudes,
    bothHemispheres: swActive,
    polarCapLatitudes: swActive ? [85, 88] : [],
  });

  const tracedLines = [];
  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    const points = traceFieldLine(seed.x, seed.y, seed.z, coeffs, {
      maxDegree: params.maxDegree,
      solarWindParams: getSolarWindParams(),
    });
    tracedLines.push({ points, lat: seed.lat, lon: seed.lon });

    if (i % 4 === 3) {
      await new Promise((r) => setTimeout(r, 0));
      // If a newer rebuild started while we yielded, abort this one
      if (buildId !== fieldLineBuildId) return;
    }
  }

  // Final check before adding to scene
  if (buildId !== fieldLineBuildId) return;

  fieldLineGroup = buildFieldLineGroup(tracedLines, latitudeToColor, {
    radius: params.tubeRadius,
  });
  fieldLineGroup.visible = params.showFieldLines;
  scene.add(fieldLineGroup);

  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'none';
}

function applyVisualChanges() {
  if (fieldLineGroup) {
    fieldLineGroup.visible = params.showFieldLines;
  }
  controls.autoRotate = params.autoRotate;
}

// --- Isosurface state ---
let isoWorker = null;
let cachedBGrid = null;
let cachedBGridMaxDegree = null;
let cachedBGridResolution = null;
let cachedLShellGrid = null;
let cachedLShellMaxDegree = null;
let cachedLShellResolution = null;
let isosurfaceGroup = null;

// --- Radiation belt state ---
let radiationBeltGroup = null;

/**
 * Grid bounds in scene coordinates.
 * 12 Earth radii = 12 scene units (since Earth radius = 1 scene unit)
 */
const GRID_EXTENT = 12;
const GRID_BOUNDS_MIN = [-GRID_EXTENT, -GRID_EXTENT, -GRID_EXTENT];
const GRID_BOUNDS_MAX = [GRID_EXTENT, GRID_EXTENT, GRID_EXTENT];

function getOrCreateWorker() {
  if (!isoWorker) {
    isoWorker = new Worker(
      new URL('./physics/scalarFieldWorker.js', import.meta.url),
      { type: 'module' }
    );
  }
  return isoWorker;
}

/**
 * Get the appropriate cached grid for the current iso mode,
 * or null if it needs to be computed.
 */
function getCachedIsoGrid(degree, res) {
  if (params.isoMode === 'lShell') {
    if (cachedLShellGrid && cachedLShellMaxDegree === degree && cachedLShellResolution === res) {
      return cachedLShellGrid;
    }
  } else {
    if (cachedBGrid && cachedBGridMaxDegree === degree && cachedBGridResolution === res) {
      return cachedBGrid;
    }
  }
  return null;
}

/**
 * Request the appropriate grid from the Worker, then extract and render isosurfaces.
 */
function rebuildIsosurfaces() {
  if (!params.showIsosurfaces || !coeffs) return;

  // When mode changes, rebuild level toggles
  initIsoLevels();
  if (params._rebuildLevelToggles) params._rebuildLevelToggles();

  const res = Number(params.isoResolution);
  const degree = params.maxDegree;

  // Check if we can reuse cached grid
  if (getCachedIsoGrid(degree, res)) {
    extractAndRenderIsosurfaces();
    return;
  }

  const isLShell = params.isoMode === 'lShell';
  const workerType = isLShell ? 'computeLShellGrid' : 'computeGrid';
  const label = isLShell ? 'L-shell' : '|B|';

  showIsoLoading(true, `Computing ${label} field...`);

  const worker = getOrCreateWorker();

  worker.onmessage = (e) => {
    if (e.data.type === 'progress') {
      updateIsoProgress(e.data.percent, label);
    } else if (e.data.type === 'gridReady') {
      cachedBGrid = e.data.grid;
      cachedBGridMaxDegree = degree;
      cachedBGridResolution = e.data.resolution;
      showIsoLoading(false);
      extractAndRenderIsosurfaces();
    } else if (e.data.type === 'lshellGridReady') {
      cachedLShellGrid = e.data.grid;
      cachedLShellMaxDegree = degree;
      cachedLShellResolution = e.data.resolution;
      showIsoLoading(false);
      extractAndRenderIsosurfaces();
    }
  };

  // Use pure IGRF for scalar field grids. The dipole L-shell approximation
  // breaks down with external fields (produces artifacts at the neutral sheet
  // and magnetopause boundary). Field lines and the magnetopause mesh show
  // the solar wind asymmetry instead. See: Roederer & Lejosne 2018,
  // "Coordinates for Representing Radiation Belt Particle Flux".
  worker.postMessage({
    type: workerType,
    coeffs,
    maxDegree: degree,
    resolution: res,
    boundsMin: GRID_BOUNDS_MIN,
    boundsMax: GRID_BOUNDS_MAX,
  });
}

/**
 * Extract isosurfaces from the appropriate cached grid and render them.
 */
function extractAndRenderIsosurfaces() {
  const res = Number(params.isoResolution);
  const degree = params.maxDegree;
  const grid = getCachedIsoGrid(degree, res);

  if (!grid) return;

  if (isosurfaceGroup) {
    scene.remove(isosurfaceGroup);
    disposeIsosurfaceGroup(isosurfaceGroup);
    isosurfaceGroup = null;
  }

  if (!params.showIsosurfaces) return;

  const gridRes = params.isoMode === 'lShell' ? cachedLShellResolution : cachedBGridResolution;

  const surfaces = [];
  for (const [levelStr, enabled] of Object.entries(params.isoLevels)) {
    if (!enabled) continue;
    const level = Number(levelStr);
    const { positions, normals, indices } = extractIsosurface(
      grid,
      gridRes,
      GRID_BOUNDS_MIN,
      GRID_BOUNDS_MAX,
      level
    );
    surfaces.push({ level, positions, normals, indices });
  }

  if (surfaces.length === 0) return;

  const activePlanes = clipping.getActivePlanes(
    params.clipEquatorial,
    params.clipMeridional
  );

  isosurfaceGroup = buildIsosurfaceGroup(surfaces, {
    opacity: params.isoOpacity,
    clippingPlanes: activePlanes,
    mode: params.isoMode,
  });
  scene.add(isosurfaceGroup);
}

function applyIsoVisualChanges() {
  if (!params.showIsosurfaces) {
    if (isosurfaceGroup) {
      scene.remove(isosurfaceGroup);
      disposeIsosurfaceGroup(isosurfaceGroup);
      isosurfaceGroup = null;
    }
    return;
  }

  const res = Number(params.isoResolution);
  const degree = params.maxDegree;
  if (getCachedIsoGrid(degree, res)) {
    extractAndRenderIsosurfaces();
  }
  if (isosurfaceGroup) {
    updateIsosurfaceOpacity(isosurfaceGroup, params.isoOpacity);
  }
}

// --- Radiation Belt functions ---

/**
 * Request L-shell grid from Worker, then extract and render belt surfaces.
 */
function rebuildRadiationBelts() {
  if ((!params.showInnerBelt && !params.showOuterBelt) || !coeffs) return;

  const res = Number(params.isoResolution);
  const degree = params.maxDegree;

  if (cachedLShellGrid && cachedLShellMaxDegree === degree && cachedLShellResolution === res) {
    extractAndRenderBelts();
    return;
  }

  showIsoLoading(true, 'Computing L-shell field...');

  const worker = getOrCreateWorker();

  worker.onmessage = (e) => {
    if (e.data.type === 'progress') {
      updateIsoProgress(e.data.percent, 'L-shell');
    } else if (e.data.type === 'lshellGridReady') {
      cachedLShellGrid = e.data.grid;
      cachedLShellMaxDegree = degree;
      cachedLShellResolution = e.data.resolution;
      showIsoLoading(false);
      extractAndRenderBelts();
    }
  };

  // Pure IGRF for L-shell grids — see comment in rebuildIsosurfaces().
  worker.postMessage({
    type: 'computeLShellGrid',
    coeffs,
    maxDegree: degree,
    resolution: res,
    boundsMin: GRID_BOUNDS_MIN,
    boundsMax: GRID_BOUNDS_MAX,
  });
}

/**
 * Extract radiation belt boundaries from cached L-shell grid and render.
 */
function extractAndRenderBelts() {
  if (!cachedLShellGrid) return;

  if (radiationBeltGroup) {
    scene.remove(radiationBeltGroup);
    disposeRadiationBeltGroup(radiationBeltGroup);
    radiationBeltGroup = null;
  }

  const beltSurfaces = [];

  for (const def of BELT_DEFINITIONS) {
    const showBelt =
      (def.name === 'innerBelt' && params.showInnerBelt) ||
      (def.name === 'outerBelt' && params.showOuterBelt);

    if (!showBelt) continue;

    const surfaces = [];
    const inner = extractIsosurface(
      cachedLShellGrid,
      cachedLShellResolution,
      GRID_BOUNDS_MIN,
      GRID_BOUNDS_MAX,
      def.lMin
    );
    surfaces.push(inner);

    const outer = extractIsosurface(
      cachedLShellGrid,
      cachedLShellResolution,
      GRID_BOUNDS_MIN,
      GRID_BOUNDS_MAX,
      def.lMax
    );
    surfaces.push(outer);

    beltSurfaces.push({ name: def.name, surfaces });
  }

  if (beltSurfaces.length === 0) return;

  const activePlanes = clipping.getActivePlanes(
    params.clipEquatorial,
    params.clipMeridional
  );

  radiationBeltGroup = buildRadiationBeltGroup(beltSurfaces, {
    clippingPlanes: activePlanes,
    opacity: params.beltOpacity,
  });
  scene.add(radiationBeltGroup);
}

function applyBeltVisualChanges() {
  if (!params.showInnerBelt && !params.showOuterBelt) {
    if (radiationBeltGroup) {
      scene.remove(radiationBeltGroup);
      disposeRadiationBeltGroup(radiationBeltGroup);
      radiationBeltGroup = null;
    }
    return;
  }

  if (cachedLShellGrid) {
    extractAndRenderBelts();
  }
  if (radiationBeltGroup) {
    updateBeltOpacity(radiationBeltGroup, params.beltOpacity);
  }
}

// --- Clipping ---

function applyClipChanges() {
  clipping.setMeridionalAngle(params.clipMeridionalAngle);
  const activePlanes = clipping.getActivePlanes(
    params.clipEquatorial,
    params.clipMeridional
  );

  if (isosurfaceGroup) {
    updateIsosurfaceClipping(isosurfaceGroup, activePlanes);
  }

  if (radiationBeltGroup) {
    updateBeltClipping(radiationBeltGroup, activePlanes);
  }

  if (fieldLineGroup) {
    fieldLineGroup.traverse((obj) => {
      if (obj.material) {
        obj.material.clippingPlanes = activePlanes;
        obj.material.needsUpdate = true;
      }
    });
  }
}

// --- Loading indicator ---
function showIsoLoading(show, label) {
  let el = document.getElementById('iso-loading');
  if (!el && show) {
    el = document.createElement('div');
    el.id = 'iso-loading';
    el.style.cssText =
      'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
      'color:#fff;font-family:monospace;font-size:14px;background:rgba(0,0,0,0.7);' +
      'padding:12px 24px;border-radius:8px;z-index:1000;pointer-events:none;';
    document.body.appendChild(el);
  }
  if (el) {
    el.textContent = label || 'Computing...';
    el.style.display = show ? 'block' : 'none';
  }
}

function updateIsoProgress(percent, label) {
  const el = document.getElementById('iso-loading');
  if (el) el.textContent = `Computing ${label || ''} field... ${percent}%`;
}

// --- Satellite probe ---

function updateSatelliteProbe() {
  if (!params.showSatellite || !coeffs) {
    satellite.setVisible(false);
    hideEnvironmentReadout();
    return;
  }

  const pos = geographicToPhysicsPosition(
    params.satLatitude,
    params.satLongitude,
    params.satAltitude
  );
  satellite.setPosition(pos.x, pos.y, pos.z);
  satellite.setVisible(true);

  const env = computeMagneticEnvironment(
    pos.r, pos.theta, pos.phi, coeffs, params.maxDegree, getSolarWindParams()
  );

  updateEnvironmentReadout({
    latDeg: params.satLatitude,
    lonDeg: params.satLongitude,
    altitudeKm: params.satAltitude,
    bMagnitude: env.bMagnitude,
    lShell: env.lShell,
    region: env.region,
    saaProximity: env.saaProximity,
  }, 'Satellite Probe');
}

// --- Solar wind change handler ---

function updateSunPosition() {
  const lonRad = params.sunLongitude * Math.PI / 180;
  const decRad = params.sunDeclination * Math.PI / 180;
  sun.setDirection(lonRad, decRad);
  sun.group.visible = true;
  // Move directional light to match sun direction
  const cosD = Math.cos(decRad);
  sunLight.position.set(
    cosD * Math.cos(lonRad) * 5,
    Math.sin(decRad) * 5,
    cosD * Math.sin(lonRad) * 5
  );
}

/**
 * Compute sun and moon positions from the current datetimeString and
 * update the scene. Triggers a solar wind rebuild if solar wind is active.
 */
function updateDatetime() {
  const date = new Date(params.datetimeString);
  if (isNaN(date.getTime())) return;

  // Sun position
  const sunPos = solarPosition(date);
  params.sunLongitude = (sunPos.longitudeRad * 180 / Math.PI + 360) % 360;
  params.sunDeclination = sunPos.declinationRad * 180 / Math.PI;
  updateSunPosition();

  // Moon position
  if (params.showMoon) {
    const moonPos = lunarPosition(date);
    moon.setPosition(moonPos.longitudeRad, moonPos.declinationRad, moonPos.distanceEarthRadii);
    moon.setVisible(true);
  } else {
    moon.setVisible(false);
  }

  // Rebuild field lines (and related) if solar wind uses the sun direction
  if (params.solarWindEnabled) {
    rebuildFieldLines();
    if (params.showIsosurfaces) rebuildIsosurfaces();
    if (params.showInnerBelt || params.showOuterBelt) rebuildRadiationBelts();
    if (params.showSatellite) updateSatelliteProbe();
    if (params.showMagnetopause) rebuildMagnetopause();
  }
}

function onSolarWindChange() {
  // Solar wind affects everything: field lines, isosurfaces, belts, satellite
  updateSunPosition();
  rebuildFieldLines();
  if (params.showIsosurfaces) rebuildIsosurfaces();
  if (params.showInnerBelt || params.showOuterBelt) rebuildRadiationBelts();
  if (params.showSatellite) updateSatelliteProbe();
  if (params.showMagnetopause) rebuildMagnetopause();
}

// --- Magnetopause mesh state ---
let magnetopauseGroup = null;

function rebuildMagnetopause() {
  if (magnetopauseGroup) {
    scene.remove(magnetopauseGroup);
    magnetopauseGroup.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    magnetopauseGroup = null;
  }

  if (!params.showMagnetopause || !params.solarWindEnabled) return;

  // Lazy import to avoid loading magnetopause code until needed
  import('./scene/magnetopauseMesh.js').then(({ buildMagnetopauseMesh }) => {
    magnetopauseGroup = buildMagnetopauseMesh(getSolarWindParams());
    if (magnetopauseGroup) scene.add(magnetopauseGroup);
  });
}

function onMagnetopauseChange() {
  rebuildMagnetopause();
}

// --- UI ---
createInfoOverlay();
createControlPanel(params, {
  onRebuild: () => rebuildFieldLines(),
  onVisualChange: applyVisualChanges,
  onIsoRebuild: () => rebuildIsosurfaces(),
  onIsoVisualChange: applyIsoVisualChanges,
  onClipChange: applyClipChanges,
  onBeltRebuild: () => rebuildRadiationBelts(),
  onBeltVisualChange: applyBeltVisualChanges,
  onSatelliteChange: updateSatelliteProbe,
  onSolarWindChange,
  onMagnetopauseChange,
  onDatetimeChange: updateDatetime,
});

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation loop ---
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// --- Init ---
async function init() {
  await loadCoefficients();
  updateDatetime(); // position sun and moon from default date
  await rebuildFieldLines();
  animate();
}

init();
