/**
 * Magnetopause surface mesh renderer.
 *
 * Generates a semi-transparent shell showing the magnetopause boundary
 * based on the Shue 1998 model. Only renders the dayside + flanks
 * (theta_sun < ~150°) since the nightside is open (magnetotail).
 */

import * as THREE from 'three';
import {
  computeDynamicPressure,
  computeMagnetopauseDistance,
  fromGSM,
} from '../physics/solarWind.js';
import { EARTH_RADIUS_KM, KM_TO_SCENE } from '../utils/constants.js';

const Re = EARTH_RADIUS_KM;

/**
 * Build a Three.js mesh for the magnetopause surface.
 *
 * @param {object} solarWindParams - { vSw, nSw, imfBz, dst, sunLonRad, enabled }
 * @returns {THREE.Mesh|null} Magnetopause mesh, or null if disabled
 */
export function buildMagnetopauseMesh(solarWindParams) {
  if (!solarWindParams?.enabled) return null;

  const { imfBz, sunLonRad } = solarWindParams;
  const Dp = computeDynamicPressure(solarWindParams.vSw, solarWindParams.nSw);

  // Sample the magnetopause surface in GSM spherical coordinates
  const nTheta = 50; // angle from Sun-Earth line (0 to ~150°)
  const nPhi = 80;   // azimuth around Sun-Earth axis
  const maxThetaSun = 2.6; // ~150°, where tail opens up

  const positions = [];
  const indices = [];

  for (let i = 0; i <= nTheta; i++) {
    const thetaSun = (i / nTheta) * maxThetaSun;
    const rMp = computeMagnetopauseDistance(thetaSun, Dp, imfBz);

    for (let j = 0; j <= nPhi; j++) {
      const phiAz = (j / nPhi) * Math.PI * 2;

      // Convert GSM spherical to GSM Cartesian
      const sinT = Math.sin(thetaSun);
      const cosT = Math.cos(thetaSun);
      const xGsm = rMp * cosT * Re;
      const yGsm = rMp * sinT * Math.cos(phiAz) * Re;
      const zGsm = rMp * sinT * Math.sin(phiAz) * Re;

      // Transform from GSM to scene coordinates
      const [sx, sy, sz] = fromGSM(xGsm, yGsm, zGsm, sunLonRad);

      // Convert from km to scene units
      positions.push(sx * KM_TO_SCENE, sy * KM_TO_SCENE, sz * KM_TO_SCENE);
    }
  }

  // Build triangle indices
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
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x4488cc,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    side: THREE.DoubleSide,
    roughness: 0.8,
    metalness: 0.0,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = -1; // Render behind everything else
  return mesh;
}
