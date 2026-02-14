import { computeB } from './igrf.js';
import {
  cartesianToSpherical,
  sphericalToCartesian,
  bFieldToCartesian,
} from './coordinates.js';
import { EARTH_RADIUS_KM } from '../utils/constants.js';

/**
 * Compute the unit field direction at a Cartesian point (in km).
 * Returns [dx, dy, dz] unit vector along B, or null if inside Earth.
 */
function fieldDirection(x, y, z, coeffs, maxDegree) {
  const [r, theta, phi] = cartesianToSpherical(x, y, z);
  const [Br, Bt, Bp] = computeB(r, theta, phi, coeffs, maxDegree);
  const [Bx, By, Bz] = bFieldToCartesian(Br, Bt, Bp, theta, phi);
  const mag = Math.sqrt(Bx * Bx + By * By + Bz * Bz);
  if (mag < 1e-10) return null;
  return [Bx / mag, By / mag, Bz / mag];
}

/**
 * Single RK4 step for field line tracing.
 * Returns the new position [x, y, z] after stepping ds along B.
 */
function rk4Step(x, y, z, ds, coeffs, maxDegree) {
  const k1 = fieldDirection(x, y, z, coeffs, maxDegree);
  if (!k1) return null;

  const k2 = fieldDirection(
    x + 0.5 * ds * k1[0],
    y + 0.5 * ds * k1[1],
    z + 0.5 * ds * k1[2],
    coeffs,
    maxDegree
  );
  if (!k2) return null;

  const k3 = fieldDirection(
    x + 0.5 * ds * k2[0],
    y + 0.5 * ds * k2[1],
    z + 0.5 * ds * k2[2],
    coeffs,
    maxDegree
  );
  if (!k3) return null;

  const k4 = fieldDirection(
    x + ds * k3[0],
    y + ds * k3[1],
    z + ds * k3[2],
    coeffs,
    maxDegree
  );
  if (!k4) return null;

  return [
    x + (ds / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    y + (ds / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    z + (ds / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

/**
 * Trace a field line in one direction from a starting point.
 * @param {number} startX - X in km
 * @param {number} startY - Y in km
 * @param {number} startZ - Z in km
 * @param {object} coeffs - IGRF coefficients
 * @param {object} options - { stepSize (km), maxSteps, rMin (km), rMax (km), maxDegree }
 * @returns {number[][]} Array of [x, y, z] points in km
 */
function traceHalf(startX, startY, startZ, coeffs, options = {}) {
  const ds = options.stepSize || 200;
  const maxSteps = options.maxSteps || 5000;
  const rMin = options.rMin || EARTH_RADIUS_KM * 0.99;
  const rMax = options.rMax || EARTH_RADIUS_KM * 12;
  const maxDegree = options.maxDegree;

  const points = [[startX, startY, startZ]];
  let x = startX;
  let y = startY;
  let z = startZ;

  for (let i = 0; i < maxSteps; i++) {
    const next = rk4Step(x, y, z, ds, coeffs, maxDegree);
    if (!next) break;

    [x, y, z] = next;
    const r = Math.sqrt(x * x + y * y + z * z);

    points.push([x, y, z]);

    if (r < rMin) break; // Hit Earth's surface
    if (r > rMax) break; // Escaped to space (open field line)
  }

  return points;
}

/**
 * Trace a complete field line in both directions from a seed point.
 * @returns {number[][]} Array of [x, y, z] points in km
 */
export function traceFieldLine(startX, startY, startZ, coeffs, options = {}) {
  const stepSize = options.stepSize || 200;

  const forward = traceHalf(startX, startY, startZ, coeffs, {
    ...options,
    stepSize,
  });
  const backward = traceHalf(startX, startY, startZ, coeffs, {
    ...options,
    stepSize: -stepSize,
  });

  // Concatenate: reversed backward (excluding seed) + forward
  backward.reverse();
  return [...backward, ...forward.slice(1)];
}

/**
 * Generate seed points on Earth's surface at various magnetic latitudes.
 * Returns array of { x, y, z, lat, lon } in km.
 */
export function generateSeedPoints(options = {}) {
  const latitudes = options.latitudes || [25, 40, 55, 70];
  const nLongitudes = options.nLongitudes || 8;
  const r0 = EARTH_RADIUS_KM;

  const seeds = [];
  for (const lat of latitudes) {
    for (let i = 0; i < nLongitudes; i++) {
      const lon = (360 / nLongitudes) * i;
      const theta = (90 - lat) * (Math.PI / 180); // colatitude for northern hemisphere
      const phi = lon * (Math.PI / 180);
      const [x, y, z] = sphericalToCartesian(r0, theta, phi);
      seeds.push({ x, y, z, lat, lon });
    }
  }
  return seeds;
}
