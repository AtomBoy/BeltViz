/**
 * Web Worker: computes 3D scalar field grids from IGRF coefficients.
 *
 * Supports two grid types:
 * - 'computeGrid': |B| magnitude field (for isosurfaces)
 * - 'computeLShellGrid': L-shell scalar field (for radiation belt boundaries)
 *
 * When solarWindParams is provided and enabled, uses the combined IGRF + external
 * field model instead of pure IGRF.
 *
 * Protocol:
 *   Main → Worker: { type, coeffs, maxDegree, resolution, boundsMin, boundsMax, solarWindParams? }
 *   Worker → Main: { type: 'progress', percent }
 *   Worker → Main: { type: 'gridReady'|'lshellGridReady', grid: Float32Array, ... }
 *                   (grid is transferred, zero-copy)
 */

import { computeB, computeBMagnitude } from './igrf.js';
import { computeTotalB, computeTotalBMagnitude } from './totalField.js';
import { cartesianToSpherical } from './coordinates.js';
import { insideMagnetopause } from './solarWind.js';
import { EARTH_RADIUS_KM, KM_TO_SCENE } from '../utils/constants.js';

self.onmessage = function (e) {
  const { type } = e.data;
  const { coeffs, maxDegree, resolution, boundsMin, boundsMax, solarWindParams } = e.data;

  if (type === 'computeGrid') {
    computeGrid(coeffs, maxDegree, resolution, boundsMin, boundsMax, solarWindParams);
  } else if (type === 'computeLShellGrid') {
    computeLShellGrid(coeffs, maxDegree, resolution, boundsMin, boundsMax, solarWindParams);
  }
};

/**
 * Shared helper: convert scene grid coordinates to spherical (km).
 */
function sceneToSpherical(sx, sy, sz) {
  const xKm = sx / KM_TO_SCENE;
  const yKm = sy / KM_TO_SCENE;
  const zKm = sz / KM_TO_SCENE;
  return cartesianToSpherical(xKm, yKm, zKm);
}

function computeGrid(coeffs, maxDegree, resolution, boundsMin, boundsMax, solarWindParams) {
  const res = resolution;
  const grid = new Float32Array(res * res * res);
  const useSolarWind = solarWindParams?.enabled;

  const stepX = (boundsMax[0] - boundsMin[0]) / (res - 1);
  const stepY = (boundsMax[1] - boundsMin[1]) / (res - 1);
  const stepZ = (boundsMax[2] - boundsMin[2]) / (res - 1);

  let lastProgress = 0;

  for (let ix = 0; ix < res; ix++) {
    for (let iy = 0; iy < res; iy++) {
      for (let iz = 0; iz < res; iz++) {
        const sx = boundsMin[0] + ix * stepX;
        const sy = boundsMin[1] + iy * stepY;
        const sz = boundsMin[2] + iz * stepZ;

        const [r, theta, phi] = sceneToSpherical(sx, sy, sz);
        const idx = ix * res * res + iy * res + iz;

        if (r < EARTH_RADIUS_KM * 0.99) {
          grid[idx] = Infinity;
          continue;
        }

        grid[idx] = useSolarWind
          ? computeTotalBMagnitude(r, theta, phi, coeffs, maxDegree, solarWindParams)
          : computeBMagnitude(r, theta, phi, coeffs, maxDegree);
      }
    }

    const percent = Math.floor(((ix + 1) / res) * 100);
    if (percent >= lastProgress + 5) {
      lastProgress = percent;
      self.postMessage({ type: 'progress', percent });
    }
  }

  self.postMessage(
    { type: 'gridReady', grid, resolution: res, boundsMin, boundsMax },
    [grid.buffer]
  );
}

function computeLShellGrid(coeffs, maxDegree, resolution, boundsMin, boundsMax, solarWindParams) {
  const res = resolution;
  const grid = new Float32Array(res * res * res);
  const useSolarWind = solarWindParams?.enabled;

  const stepX = (boundsMax[0] - boundsMin[0]) / (res - 1);
  const stepY = (boundsMax[1] - boundsMin[1]) / (res - 1);
  const stepZ = (boundsMax[2] - boundsMin[2]) / (res - 1);

  let lastProgress = 0;

  for (let ix = 0; ix < res; ix++) {
    for (let iy = 0; iy < res; iy++) {
      for (let iz = 0; iz < res; iz++) {
        const sx = boundsMin[0] + ix * stepX;
        const sy = boundsMin[1] + iy * stepY;
        const sz = boundsMin[2] + iz * stepZ;

        // Compute km Cartesian coords (needed for magnetopause masking)
        const xKm = sx / KM_TO_SCENE;
        const yKm = sy / KM_TO_SCENE;
        const zKm = sz / KM_TO_SCENE;
        const [r, theta, phi] = cartesianToSpherical(xKm, yKm, zKm);
        const idx = ix * res * res + iy * res + iz;

        if (r < EARTH_RADIUS_KM * 0.99) {
          grid[idx] = Infinity;
          continue;
        }

        // Outside the magnetopause: L-shell is undefined; exclude from isosurface.
        // Under severe storms this is physically real (magnetopause shadowing at L > 5–6).
        if (useSolarWind && insideMagnetopause(xKm, yKm, zKm, solarWindParams) < 0.5) {
          grid[idx] = Infinity;
          continue;
        }

        // Compute L-shell using dipole approximation from field direction
        const [Br, Bt, Bp] = useSolarWind
          ? computeTotalB(r, theta, phi, coeffs, maxDegree, solarWindParams)
          : computeB(r, theta, phi, coeffs, maxDegree);
        const Bperp = Math.sqrt(Bt * Bt + Bp * Bp);

        if (Bperp < 1e-10) {
          // Pure IGRF: near poles, L ≈ r/Re is a reasonable approximation.
          // Solar wind: near-zero Bperp inside the magnetosphere indicates a field anomaly; exclude.
          grid[idx] = useSolarWind ? Infinity : r / EARTH_RADIUS_KM;
        } else {
          const tanLambda = Math.abs(Br) / (2 * Bperp);
          const cosLambda2 = 1 / (1 + tanLambda * tanLambda);
          const L = (r / EARTH_RADIUS_KM) / cosLambda2;
          // In the magnetotail, the dipole L formula yields unreliable values above L≈11.
          // Cap these cells so the marching cubes surface doesn't extend into the far tail.
          grid[idx] = (useSolarWind && L > 11) ? Infinity : L;
        }
      }
    }

    const percent = Math.floor(((ix + 1) / res) * 100);
    if (percent >= lastProgress + 5) {
      lastProgress = percent;
      self.postMessage({ type: 'progress', percent });
    }
  }

  self.postMessage(
    { type: 'lshellGridReady', grid, resolution: res, boundsMin, boundsMax },
    [grid.buffer]
  );
}
