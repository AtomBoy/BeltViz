import * as THREE from 'three';
import { createGlobe, createSun, createMoon } from './scene/globe.js';
import { solarPosition, lunarPosition } from './utils/astronomy.js';
import { setupLighting } from './scene/lighting.js';
import { setupControls } from './scene/controls.js';
import { buildFieldLineGroup, createFieldLineMesh, TUBE_SEGMENTS } from './scene/fieldLines.js';
// fieldLineTracer — generateSeedPoints and traceFieldLine are now called
// inside src/physics/fieldLineWorker.js (off the main thread).
import { latitudeToColor } from './utils/colors.js';
import { createControlPanel } from './ui/controlPanel.js';
import { createInfoOverlay } from './ui/infoOverlay.js';
import { createTimeline } from './ui/timeline.js';
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
import { loadMonth, ensureMonthsForTime, getSolarWindAtTime, setOnMonthLoaded } from './physics/solarWindData.js';
import { setSolarWindDataNote } from './ui/infoOverlay.js';
import { createParticleSystem } from './scene/particleSystem.js';
import { createAuroraRenderer } from './scene/auroraRenderer.js';

// --- Params (mutable, controlled by GUI) ---
const params = {
  maxDegree: 13, // start with highest IGRF-14 degree.
  numLatitudes: 4,
  numLongitudes: 8,
  tubeRadius: 0.008,
  showFieldLines: true,
  autoRotate: false,
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
  solarWindEnabled: true,
  solarWindSpeed: 400,
  solarWindDensity: 5,
  imfBy: 0,             // IMF By (nT GSM) — dawn-dusk field component, T01 input
  imfBz: 0,
  dst: 0,
  g1: 0,                // T01 storm-history index G1 (Qin-Denton pre-computed)
  g2: 0,                // T01 storm-history index G2 (Qin-Denton pre-computed)
  sunLongitude: 0,      // internal — computed from datetime, not a user slider
  sunDeclination: 0,    // internal — computed from datetime
  showMagnetopause: false,
  // Date & Time params (internal — driven by timeline, not lil-gui)
  datetimeString: '2026-01-01T00:00',
  // Particle system
  particles: {
    enabled:   false,       // off by default — user opts in
    species:   'both',      // 'electron' | 'proton' | 'both'
    count:     800,         // max simultaneous particles
    energyMeV: 1.0,         // representative electron energy (MeV)
  },
  // Aurora oval
  aurora: {
    enabled: false,
    opacity: 1.0,
  },
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
    imfBy: params.imfBy,
    imfBz: params.imfBz,
    dst: params.dst,
    g1: params.g1,
    g2: params.g2,
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
let fieldLineBuildId = 0;      // generation counter — stale worker responses are ignored
let pendingMorphDuration = 8200; // stored when rebuild is dispatched, used when reply arrives
let fieldLineWorker = null;
let coeffs = null;

async function loadCoefficients() {
  const response = await fetch('./data/igrf14coeffs.json');
  coeffs = await response.json();
}

/**
 * Create (or reuse) the field line Web Worker.
 * The worker runs all RK4 tracing on a separate thread so the render loop
 * never stalls during rebuilds.
 */
function getOrCreateFieldLineWorker() {
  if (!fieldLineWorker) {
    fieldLineWorker = new Worker(
      new URL('./physics/fieldLineWorker.js', import.meta.url),
      { type: 'module' }
    );
    fieldLineWorker.onmessage = onFieldLineWorkerMessage;
  }
  return fieldLineWorker;
}

/**
 * Receive traced point arrays from the worker and build Three.js geometry.
 * Stale responses (buildId behind current counter) are silently discarded.
 */
function onFieldLineWorkerMessage(e) {
  const { type, buildId, tracedLines } = e.data;
  if (type !== 'fieldLinesReady') return;
  if (buildId !== fieldLineBuildId) return; // newer rebuild was requested — discard

  // Pre-filter: skip lines that would produce a degenerate mesh (< 2 points).
  const renderableLines = tracedLines.filter((l) => l.points.length >= 2);

  const sameTopology =
    fieldLineGroup !== null &&
    fieldLineGroup.children.length === renderableLines.length;

  if (sameTopology) {
    startFieldLineTransition(renderableLines, pendingMorphDuration);
  } else {
    rebuildFieldLinesFull(renderableLines);
  }

  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'none';
}

/**
 * Dispatch a field line rebuild to the worker.
 * Returns immediately — the render loop is never blocked.
 * The worker replies via onFieldLineWorkerMessage when tracing is complete.
 */
function rebuildFieldLines(morphDuration = 8200, showIndicator = true) {
  const buildId = ++fieldLineBuildId;
  pendingMorphDuration = morphDuration;

  if (showIndicator) {
    const loading = document.getElementById('loading');
    if (loading) loading.style.display = '';
  }

  // Snapshot solar wind params so all seeds use a consistent sun position
  // (params.sunLongitude changes every frame during playback).
  const swParams = getSolarWindParams();
  const swActive = params.solarWindEnabled;

  getOrCreateFieldLineWorker().postMessage({
    buildId,
    latitudes: LATITUDE_SETS[params.numLatitudes - 1],
    nLongitudes: params.numLongitudes,
    bothHemispheres: swActive,
    polarCapLatitudes: swActive ? [85, 88] : [],
    coeffs,
    maxDegree: params.maxDegree,
    solarWindParams: swParams,
  });
}

/**
 * Full dispose + rebuild of field line group.
 * Called when line count changes (topology change) or any degenerate line is found.
 */
function rebuildFieldLinesFull(tracedLines) {
  fieldLineTransition = null; // cancel any in-progress morph

  if (fieldLineGroup) {
    scene.remove(fieldLineGroup);
    fieldLineGroup.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) obj.material.dispose();
    });
    fieldLineGroup = null;
  }

  fieldLineGroup = buildFieldLineGroup(tracedLines, latitudeToColor, {
    radius: params.tubeRadius,
    tubularSegments: TUBE_SEGMENTS,
  });
  fieldLineGroup.visible = params.showFieldLines;
  scene.add(fieldLineGroup);
  applyClipChanges(); // restore any active clipping planes to new meshes
}

/**
 * Begin a vertex-morph transition from the current field line positions
 * to the newly traced positions. Reuses existing meshes to avoid a blink.
 */
function startFieldLineTransition(newTracedLines, duration = 8200) {
  const lines = [];

  for (let i = 0; i < fieldLineGroup.children.length; i++) {
    const mesh = fieldLineGroup.children[i];
    const line = newTracedLines[i];

    const targetMesh = createFieldLineMesh(line.points, {
      color: latitudeToColor(line.lat),
      radius: params.tubeRadius,
      tubularSegments: TUBE_SEGMENTS,
    });

    if (!targetMesh) {
      // Degenerate target line — fall back to full rebuild
      rebuildFieldLinesFull(newTracedLines);
      return;
    }

    lines.push({
      mesh,
      oldPos: mesh.geometry.attributes.position.array.slice(),
      newPos: targetMesh.geometry.attributes.position.array.slice(),
    });

    targetMesh.geometry.dispose();
    targetMesh.material.dispose();
  }

  fieldLineTransition = {
    startTime: performance.now(),
    duration,
    lines,
  };
}

/**
 * Per-frame lerp of field line vertex positions during a morph transition.
 * Called from animate(). No-op when no transition is active.
 */
function updateFieldLineTransition(now) {
  if (!fieldLineTransition) return;

  let t = (now - fieldLineTransition.startTime) / fieldLineTransition.duration;
  if (t > 1) t = 1;
  const s = t * t * (3 - 2 * t); // smoothstep easing

  for (const { mesh, oldPos, newPos } of fieldLineTransition.lines) {
    const arr = mesh.geometry.attributes.position.array;
    for (let j = 0; j < arr.length; j++) {
      arr[j] = oldPos[j] + s * (newPos[j] - oldPos[j]);
    }
    mesh.geometry.attributes.position.needsUpdate = true;
    mesh.geometry.computeVertexNormals();
    mesh.geometry.computeBoundingSphere();
  }

  if (t >= 1) fieldLineTransition = null;
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
let cachedLShellSolarWindEnabled = false;
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

  // Cache is only valid for pure-IGRF. Solar wind grids must recompute on every call
  // because L-shell geometry changes with real-time solar wind conditions.
  const swActive = params.solarWindEnabled;
  if (!swActive
      && cachedLShellGrid
      && cachedLShellMaxDegree === degree
      && cachedLShellResolution === res
      && !cachedLShellSolarWindEnabled) {
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
      cachedLShellSolarWindEnabled = params.solarWindEnabled;
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
    solarWindParams: swActive ? getSolarWindParams() : undefined,
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

// --- Day animation (Three.js keyframe system for sun and moon) ---

const SUN_DIST = 120;            // must match globe.js createSun SUN_DISTANCE
const KF_INTERVAL_S = 300;       // keyframe every 5 sim-minutes
const KF_COUNT = 289;            // 0h..24h inclusive (288 × 5min + endpoint)

let dayStart  = null;
let sunMixer  = null;
let moonMixer = null;
let sunAction = null;
let moonAction = null;

let fieldLineTransition = null; // null = idle; { startTime, duration, lines } = animating
let lastDataHour = null;        // Unix seconds (floor-to-hour) of last historical data pull

/**
 * Pre-compute one day's worth of sun and moon XYZ positions as keyframes
 * and wire them into new AnimationMixer instances.
 * Called once per sim-day; ~289 solarPosition / lunarPosition evaluations.
 */
function buildDayAnimation(date) {
  dayStart = new Date(date);
  dayStart.setUTCHours(0, 0, 0, 0);

  const times   = new Float32Array(KF_COUNT);
  const sunXYZ  = new Float32Array(KF_COUNT * 3);
  const moonXYZ = new Float32Array(KF_COUNT * 3);

  for (let i = 0; i < KF_COUNT; i++) {
    const tSec = i * KF_INTERVAL_S;
    times[i] = tSec;
    const d = new Date(dayStart.getTime() + tSec * 1000);

    const sp = solarPosition(d);
    const cosDs = Math.cos(sp.declinationRad);
    sunXYZ[i * 3]     = cosDs * Math.cos(sp.longitudeRad) * SUN_DIST;
    sunXYZ[i * 3 + 1] = Math.sin(sp.declinationRad) * SUN_DIST;
    sunXYZ[i * 3 + 2] = cosDs * Math.sin(sp.longitudeRad) * SUN_DIST;

    const mp = lunarPosition(d);
    const cosDm = Math.cos(mp.declinationRad);
    moonXYZ[i * 3]     = cosDm * Math.cos(mp.longitudeRad) * mp.distanceEarthRadii;
    moonXYZ[i * 3 + 1] = Math.sin(mp.declinationRad) * mp.distanceEarthRadii;
    moonXYZ[i * 3 + 2] = cosDm * Math.sin(mp.longitudeRad) * mp.distanceEarthRadii;
  }

  sunMixer?.stopAllAction();
  const sunTrack = new THREE.VectorKeyframeTrack('.position', times, sunXYZ);
  const sunClip  = new THREE.AnimationClip('sun-day', 86400, [sunTrack]);
  sunMixer  = new THREE.AnimationMixer(sun.group);
  sunAction = sunMixer.clipAction(sunClip);
  sunAction.play();

  moonMixer?.stopAllAction();
  const moonTrack = new THREE.VectorKeyframeTrack('.position', times, moonXYZ);
  const moonClip  = new THREE.AnimationClip('moon-day', 86400, [moonTrack]);
  moonMixer  = new THREE.AnimationMixer(moon.mesh);
  moonAction = moonMixer.clipAction(moonClip);
  moonAction.play();

  sun.group.visible = true;
  moon.setVisible(true);
}

/**
 * Seek both mixers to the given Date, sync the directional light,
 * and update params.sunLongitude / params.sunDeclination for solar wind traces.
 */
function applySunMoonAnimation(date) {
  const simSeconds = (date.getTime() - dayStart.getTime()) / 1000;

  sunMixer.setTime(simSeconds);
  sun.group.visible = true;

  // Directional light follows the sun sphere (same direction, closer distance)
  sunLight.position.copy(sun.group.position).multiplyScalar(5 / SUN_DIST);

  // Keep params in sync for solar wind field-line traces
  const p = sun.group.position;
  params.sunLongitude   = ((Math.atan2(p.z, p.x) * 180 / Math.PI) + 360) % 360;
  params.sunDeclination = Math.asin(p.y / SUN_DIST) * 180 / Math.PI;

  moonMixer.setTime(simSeconds);
}

// --- Solar wind change handler ---

/**
 * Position sun and moon from the current datetimeString via the keyframe system.
 * Triggers a solar wind rebuild if solar wind is active.
 */
function updateDatetime(isPeriodicUpdate = false) {
  const date = new Date(params.datetimeString);
  if (isNaN(date.getTime())) return;

  const newDay = new Date(date);
  newDay.setUTCHours(0, 0, 0, 0);
  if (!dayStart || newDay.getTime() !== dayStart.getTime()) buildDayAnimation(date);
  applySunMoonAnimation(date);

  if (params.solarWindEnabled) {
    rebuildFieldLines(isPeriodicUpdate ? 8200 : 1000, !isPeriodicUpdate);
    if (params.showIsosurfaces) rebuildIsosurfaces();
    if (params.showInnerBelt || params.showOuterBelt) rebuildRadiationBelts();
    if (params.showSatellite) updateSatelliteProbe();
    if (params.showMagnetopause) rebuildMagnetopause();
  }
}

/**
 * Apply historical solar wind params for a given Unix timestamp (seconds).
 * Clamps values to slider ranges so lil-gui stays consistent.
 * No-op when no data is available for the given time.
 */
function applyDataSolarWind(unixSeconds) {
  // Kick off background loading of the current month and its neighbors.
  // Cheap (Map lookups) when already cached; fires fetch only on first visit.
  ensureMonthsForTime(unixSeconds);

  const sw = getSolarWindAtTime(unixSeconds);
  if (!sw) return;
  if (sw.vSw !== null) params.solarWindSpeed   = Math.min(800, Math.max(300, Math.round(sw.vSw)));
  if (sw.nSw !== null) params.solarWindDensity = Math.min(30,  Math.max(1,   Math.round(sw.nSw * 10) / 10));
  if (sw.By  !== null) params.imfBy            = Math.min(20,  Math.max(-20, Math.round(sw.By  * 10) / 10));
  if (sw.Bz  !== null) params.imfBz            = Math.min(20,  Math.max(-20, Math.round(sw.Bz  * 10) / 10));
  if (sw.Dst !== null) params.dst              = Math.min(50,  Math.max(-200, Math.round(sw.Dst)));
  if (sw.G1  !== null) params.g1               = Math.max(0, sw.G1);
  if (sw.G2  !== null) params.g2               = Math.max(0, sw.G2);
  refreshSolarWindControls();
}

/**
 * Per-frame lightweight update during timeline playback.
 * Seeks the pre-computed keyframe animation to the current sim time.
 * Full updateDatetime() is called on pause and every 2s (throttled rebuild).
 */
function lightUpdateDatetime(isoString) {
  const simTime = new Date(isoString);
  if (isNaN(simTime.getTime())) return;

  params.datetimeString = isoString;

  const newDay = new Date(simTime);
  newDay.setUTCHours(0, 0, 0, 0);
  if (!dayStart || newDay.getTime() !== dayStart.getTime()) buildDayAnimation(simTime);

  applySunMoonAnimation(simTime);

  // Pull historical solar wind params once per simulated hour.
  // The floor-to-hour throttle avoids calling updateDisplay() every frame.
  const simHour = Math.floor(simTime.getTime() / 3_600_000) * 3600; // Unix seconds
  if (simHour !== lastDataHour) {
    lastDataHour = simHour;
    applyDataSolarWind(simHour);
  }
}

function onSolarWindChange() {
  // Solar wind affects everything: field lines, isosurfaces, belts, satellite
  rebuildFieldLines(1000); // sun/moon position already maintained by animation system
  if (params.showIsosurfaces) rebuildIsosurfaces();
  if (params.showInnerBelt || params.showOuterBelt) rebuildRadiationBelts();
  if (params.showSatellite) updateSatelliteProbe();
  if (params.showMagnetopause) rebuildMagnetopause();
}

// --- Magnetopause mesh state ---
let magnetopauseGroup = null;

// --- Particle system and aurora ---
let particleSystem = null;
let auroraRenderer = null;

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
let timeline; // declared before GUI so lightUpdateDatetime can reference it
const { gui, refreshSolarWindControls } = createControlPanel(params, {
  onRebuild: () => rebuildFieldLines(1000),
  onVisualChange: applyVisualChanges,
  onIsoRebuild: () => rebuildIsosurfaces(),
  onIsoVisualChange: applyIsoVisualChanges,
  onClipChange: applyClipChanges,
  onBeltRebuild: () => rebuildRadiationBelts(),
  onBeltVisualChange: applyBeltVisualChanges,
  onSatelliteChange: updateSatelliteProbe,
  onSolarWindChange,
  onMagnetopauseChange,
  // Particle / aurora changes are handled by the per-frame update() calls;
  // no expensive rebuilds are needed when the user changes these params.
  onParticleChange: () => {},
  onAuroraChange:   () => {},
});

timeline = createTimeline({
  initialTime:       new Date(params.datetimeString),
  onTimeChange:      (iso) => lightUpdateDatetime(iso),
  onPause:           ()    => { fieldLineTransition = null; updateDatetime(false); },
  onPeriodicRebuild: ()    => {
    // At 3600× and above, a field-line rebuild every 8 real seconds equals ≥ 8 hours of
    // sim time — the sun drifts so far that the asymmetric field lines look wrong before
    // the next rebuild arrives. Better to freeze the last good state and let the sun
    // position update smoothly. Rebuilds resume automatically when speed drops.
    if (timeline && timeline.getSpeed() >= 3600) return;
    updateDatetime(true);
  },
  getSolarWindData:  getSolarWindAtTime,
});

// Repaint the timeline color bar whenever a new monthly data file is loaded.
setOnMonthLoaded(() => timeline.refreshColors());

// --- Resize ---
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- Animation loop ---
let lastFrameTime = 0;

function animate(now) {
  requestAnimationFrame(animate);
  // Real-time delta (capped to avoid large jumps after tab visibility changes).
  const dt = Math.min((now - lastFrameTime) / 1000, 0.1);
  lastFrameTime = now;

  if (timeline) timeline.tick(now); // advance time before rendering to avoid 1-frame lag
  updateFieldLineTransition(now);

  if (particleSystem) particleSystem.update(dt, getSolarWindParams(), params.particles, timeline?.getSpeed() ?? 1);
  if (auroraRenderer) auroraRenderer.update(now / 1000, params.dst, params.aurora);

  controls.update();
  renderer.render(scene, camera);
}

// --- Init ---
async function init() {
  // Load January 2026 first so the default date (2026-01-01) has data immediately.
  // Neighboring months load in the background as the user navigates.
  await Promise.all([
    loadCoefficients(),
    loadMonth(2026, 1),
  ]);

  // Create particle system and aurora (after scene is ready)
  particleSystem = createParticleSystem(scene);
  auroraRenderer = createAuroraRenderer(scene);
  setSolarWindDataNote('Solar wind: Qin-Denton/WGhour.d (2026)');
  const initUnix = Math.floor(new Date(params.datetimeString).getTime() / 1000);
  applyDataSolarWind(initUnix);
  lastDataHour = Math.floor(initUnix / 3600) * 3600;
  timeline.refreshColors(); // paint the timeline's solar wind intensity background
  updateDatetime(); // position sun and moon from default date
  rebuildFieldLines(); // dispatches to worker; field lines appear when worker replies
  applyVisualChanges(); // sync params → Three.js state (autoRotate, visibility) on startup
  animate(); // render loop starts immediately — scene is interactive while field lines trace
}

init();
