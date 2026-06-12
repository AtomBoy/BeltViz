/**
 * Bow shock surface mesh renderer.
 *
 * The bow shock is the upstream boundary where the supersonic solar wind
 * is abruptly decelerated to sub-magnetosonic speeds. It sits ~1.3–1.4 Re
 * sunward of the magnetopause.
 *
 * Shape model: Farris & Russell (1994) scaling applied to the Shue 1998
 * magnetopause standoff. Bow shock standoff ≈ r0_mp × 1.36, with a slightly
 * more open flaring exponent (α = 0.60) than the magnetopause.
 *
 * Reference:
 *   Farris, M.H. & Russell, C.T. (1994). Determining the standoff distance of
 *   the bow shock: Mach number dependence and use of models.
 *   JGR, 99(A9):17681–17689. doi:10.1029/94JA01020
 */

import * as THREE from 'three';
import {
  computeDynamicPressure,
  computeStandoffDistance,
  fromGSM,
} from '../physics/solarWind.js';
import { EARTH_RADIUS_KM, KM_TO_SCENE } from '../utils/constants.js';

const Re = EARTH_RADIUS_KM;

// Farris & Russell (1994) standoff scaling relative to magnetopause
const BS_STANDOFF_SCALE = 1.36;
// Flaring exponent — slightly more open than the magnetopause
const BS_ALPHA = 0.60;

/**
 * Compute bow shock distance at angle thetaSun from the Sun-Earth line (radians).
 * Returns distance in Earth radii.
 */
function computeBowShockDistance(thetaSun, r0Mp) {
  const r0Bs = r0Mp * BS_STANDOFF_SCALE;
  return r0Bs * Math.pow(2 / (1 + Math.cos(thetaSun)), BS_ALPHA);
}

/**
 * Build a Three.js mesh for the bow shock surface.
 *
 * @param {object} solarWindParams - { vSw, nSw, imfBz, sunLonRad, enabled }
 * @returns {THREE.Mesh|null}
 */
export function buildBowShockMesh(solarWindParams) {
  if (!solarWindParams?.enabled) return null;

  const { imfBz, sunLonRad } = solarWindParams;
  const Dp = computeDynamicPressure(solarWindParams.vSw, solarWindParams.nSw);
  const r0Mp = computeStandoffDistance(Dp, imfBz);

  const nTheta = 50;
  const nPhi = 80;
  const maxThetaSun = 2.4; // ~138° — bow shock closes tighter than magnetopause in the tail

  const positions = [];
  const indices = [];

  for (let i = 0; i <= nTheta; i++) {
    const thetaSun = (i / nTheta) * maxThetaSun;
    const rBs = computeBowShockDistance(thetaSun, r0Mp);

    for (let j = 0; j <= nPhi; j++) {
      const phiAz = (j / nPhi) * Math.PI * 2;

      const sinT = Math.sin(thetaSun);
      const cosT = Math.cos(thetaSun);
      const xGsm = rBs * cosT * Re;
      const yGsm = rBs * sinT * Math.cos(phiAz) * Re;
      const zGsm = rBs * sinT * Math.sin(phiAz) * Re;

      const [sx, sy, sz] = fromGSM(xGsm, yGsm, zGsm, sunLonRad);
      positions.push(sx * KM_TO_SCENE, sy * KM_TO_SCENE, sz * KM_TO_SCENE);
    }
  }

  for (let i = 0; i < nTheta; i++) {
    for (let j = 0; j < nPhi; j++) {
      const a = i * (nPhi + 1) + j;
      const b = a + nPhi + 1;
      const c = a + 1;
      const d = b + 1;
      indices.push(a, b, c);
      indices.push(c, b, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0xdd8833,    // amber/orange — visually distinct from the blue magnetopause
    transparent: true,
    opacity: 0.07,
    depthWrite: false,
    side: THREE.DoubleSide,
    roughness: 0.9,
    metalness: 0.0,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = -2; // Render behind magnetopause
  return mesh;
}
