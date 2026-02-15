import * as THREE from 'three';
import { createGlobe, createStarfield } from './scene/globe.js';
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
  // Clipping params
  clipEquatorial: false,
  clipMeridional: false,
  clipMeridionalAngle: 0,
  // Satellite probe params
  showSatellite: false,
  satLatitude: 0,
  satLongitude: 0,
  satAltitude: 400,
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

// --- Latitude bands for seed points ---
const LATITUDE_SETS = [
  [55],
  [40, 65],
  [30, 50, 70],
  [25, 40, 55, 70],
  [20, 35, 50, 60, 72],
  [20, 30, 42, 54, 64, 75],
  [18, 28, 38, 48, 58, 68, 78],
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
  0.1,
  1000
);
camera.position.set(0, 1.5, 4);

// --- Scene objects ---
createGlobe(scene);
createStarfield(scene);
setupLighting(scene);
const controls = setupControls(camera, renderer);

// --- Clipping planes ---
const clipping = createClippingPlanes();

// --- Satellite marker ---
const satellite = createSatelliteMarker();
scene.add(satellite.mesh);

// --- Field lines ---
let fieldLineGroup = null;
let coeffs = null;

async function loadCoefficients() {
  const response = await fetch('./data/igrf14coeffs.json');
  coeffs = await response.json();
}

/**
 * Trace field lines and build the mesh group.
 */
async function rebuildFieldLines() {
  if (fieldLineGroup) {
    scene.remove(fieldLineGroup);
    fieldLineGroup.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
  }

  const latitudes = LATITUDE_SETS[params.numLatitudes - 1];
  const seeds = generateSeedPoints({
    latitudes,
    nLongitudes: params.numLongitudes,
  });

  const tracedLines = [];
  for (let i = 0; i < seeds.length; i++) {
    const seed = seeds[i];
    const points = traceFieldLine(seed.x, seed.y, seed.z, coeffs, {
      maxDegree: params.maxDegree,
    });
    tracedLines.push({ points, lat: seed.lat, lon: seed.lon });

    if (i % 4 === 3) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

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
    pos.r, pos.theta, pos.phi, coeffs, params.maxDegree
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
  await rebuildFieldLines();
  animate();
}

init();
