import * as THREE from 'three';
import { createGlobe, createStarfield } from './scene/globe.js';
import { setupLighting } from './scene/lighting.js';
import { setupControls } from './scene/controls.js';
import { buildFieldLineGroup } from './scene/fieldLines.js';
import { traceFieldLine, generateSeedPoints } from './physics/fieldLineTracer.js';
import { latitudeToColor } from './utils/colors.js';
import { createControlPanel } from './ui/controlPanel.js';
import { createInfoOverlay } from './ui/infoOverlay.js';

// --- Params (mutable, controlled by GUI) ---
const params = {
  maxDegree: 1, // start with dipole
  numLatitudes: 4,
  numLongitudes: 8,
  tubeRadius: 0.008,
  showFieldLines: true,
  autoRotate: true,
};

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

// --- Field lines ---
let fieldLineGroup = null;
let coeffs = null;

async function loadCoefficients() {
  const response = await fetch('./data/igrf14coeffs.json');
  coeffs = await response.json();
}

/**
 * Trace field lines and build the mesh group.
 * Yields to the browser periodically to avoid blocking.
 */
async function rebuildFieldLines() {
  // Remove old group
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

    // Yield every 4 lines to keep the browser responsive
    if (i % 4 === 3) {
      await new Promise((r) => setTimeout(r, 0));
    }
  }

  fieldLineGroup = buildFieldLineGroup(tracedLines, latitudeToColor, {
    radius: params.tubeRadius,
  });
  fieldLineGroup.visible = params.showFieldLines;
  scene.add(fieldLineGroup);

  // Hide loading indicator
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'none';
}

function applyVisualChanges() {
  if (fieldLineGroup) {
    fieldLineGroup.visible = params.showFieldLines;
  }
  controls.autoRotate = params.autoRotate;
}

// --- UI ---
createInfoOverlay();
createControlPanel(params, () => rebuildFieldLines(), applyVisualChanges);

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
