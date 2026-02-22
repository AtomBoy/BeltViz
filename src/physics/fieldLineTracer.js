import { computeB } from './igrf.js';
import { computeTotalB } from './totalField.js';
import {
  cartesianToSpherical,
  sphericalToCartesian,
  bFieldToCartesian,
} from './coordinates.js';
import { EARTH_RADIUS_KM } from '../utils/constants.js';

/**
 * Compute the unit field direction at a Cartesian point (in km).
 * Returns [dx, dy, dz] unit vector along B, or null if inside Earth.
 *
 * @param {number} x - X in km
 * @param {number} y - Y in km
 * @param {number} z - Z in km
 * @param {object} coeffs - IGRF coefficients
 * @param {number} maxDegree - Maximum SH degree
 * @param {object} [solarWindParams] - Solar wind parameters (null = pure IGRF)
 */
function fieldDirection(x, y, z, coeffs, maxDegree, solarWindParams) {
  const [r, theta, phi] = cartesianToSpherical(x, y, z);
  const [Br, Bt, Bp] = solarWindParams?.enabled
    ? computeTotalB(r, theta, phi, coeffs, maxDegree, solarWindParams)
    : computeB(r, theta, phi, coeffs, maxDegree);
  const [Bx, By, Bz] = bFieldToCartesian(Br, Bt, Bp, theta, phi);
  const mag = Math.sqrt(Bx * Bx + By * By + Bz * Bz);
  if (mag < 1e-10) return null;
  return [Bx / mag, By / mag, Bz / mag];
}

/**
 * Single RK4 step for field line tracing.
 * Returns the new position [x, y, z] after stepping ds along B.
 */
function rk4Step(x, y, z, ds, coeffs, maxDegree, solarWindParams) {
  const k1 = fieldDirection(x, y, z, coeffs, maxDegree, solarWindParams);
  if (!k1) return null;

  const k2 = fieldDirection(
    x + 0.5 * ds * k1[0],
    y + 0.5 * ds * k1[1],
    z + 0.5 * ds * k1[2],
    coeffs,
    maxDegree,
    solarWindParams
  );
  if (!k2) return null;

  const k3 = fieldDirection(
    x + 0.5 * ds * k2[0],
    y + 0.5 * ds * k2[1],
    z + 0.5 * ds * k2[2],
    coeffs,
    maxDegree,
    solarWindParams
  );
  if (!k3) return null;

  const k4 = fieldDirection(
    x + ds * k3[0],
    y + ds * k3[1],
    z + ds * k3[2],
    coeffs,
    maxDegree,
    solarWindParams
  );
  if (!k4) return null;

  return [
    x + (ds / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
    y + (ds / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
    z + (ds / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
  ];
}

/**
 * Compute adaptive step size based on distance from Earth.
 * Near Earth (r < 2 Re): use baseStep for accuracy in strong-field region.
 * Far from Earth: scale step with sqrt(r/Re) but cap at 4x baseStep
 * to maintain accuracy in the weak external field.
 *
 * @param {number} r - Distance from Earth center in km
 * @param {number} baseStep - Base step size in km (sign preserved)
 * @returns {number} Adaptive step size in km
 */
function adaptiveStepSize(r, baseStep) {
  const rRe = r / EARTH_RADIUS_KM;
  if (rRe < 2) return baseStep;
  // Scale gently with distance, cap at 4x base to keep tail accuracy
  const scale = Math.min(4, Math.sqrt(rRe / 2));
  return baseStep * scale;
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
  const baseDs = options.stepSize || 200;
  const maxSteps = options.maxSteps || 10000;
  const rMin = options.rMin || EARTH_RADIUS_KM * 0.99;
  const rMax = options.rMax || EARTH_RADIUS_KM * 25;
  const maxDegree = options.maxDegree;
  const solarWindParams = options.solarWindParams;

  const points = [[startX, startY, startZ]];
  let x = startX;
  let y = startY;
  let z = startZ;

  for (let i = 0; i < maxSteps; i++) {
    const r = Math.sqrt(x * x + y * y + z * z);
    const ds = adaptiveStepSize(r, baseDs);
    const next = rk4Step(x, y, z, ds, coeffs, maxDegree, solarWindParams);
    if (!next) break;

    [x, y, z] = next;
    const rNext = Math.sqrt(x * x + y * y + z * z);

    points.push([x, y, z]);

    if (rNext < rMin) break; // Hit Earth's surface
    if (rNext > rMax) break; // Escaped to space (open field line)
  }

  return points;
}

/**
 * Trace a complete field line in both directions from a seed point.
 * @returns {number[][]} Array of [x, y, z] points in km
 */
export function traceFieldLine(startX, startY, startZ, coeffs, options = {}) {
  const stepSize = options.stepSize || 100;

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
 *
 * @param {object} options
 * @param {number[]} options.latitudes - Latitude bands (degrees, positive = north)
 * @param {number} options.nLongitudes - Number of longitude points per band
 * @param {boolean} options.bothHemispheres - If true, also seed from southern hemisphere
 * @param {number[]} options.polarCapLatitudes - Extra high-latitude seeds for open field lines
 */
export function generateSeedPoints(options = {}) {
  const latitudes = options.latitudes || [25, 40, 55, 70];
  const nLongitudes = options.nLongitudes || 8;
  const bothHemispheres = options.bothHemispheres || false;
  const polarCapLatitudes = options.polarCapLatitudes || [];
  const r0 = EARTH_RADIUS_KM;

  const seeds = [];

  // Standard latitude bands — northern hemisphere
  for (const lat of latitudes) {
    for (let i = 0; i < nLongitudes; i++) {
      const lon = (360 / nLongitudes) * i;
      const theta = (90 - lat) * (Math.PI / 180);
      const phi = lon * (Math.PI / 180);
      const [x, y, z] = sphericalToCartesian(r0, theta, phi);
      seeds.push({ x, y, z, lat, lon });
    }
  }

  // Southern hemisphere mirrors (only the high-latitude bands that
  // produce visually distinct open field lines).
  // Cap at 8: southern lines are symmetric enough that extra longitude
  // resolution beyond 8 adds little visual information.
  if (bothHemispheres) {
    const southLats = latitudes.filter((l) => l >= 55);
    const nSouthLon = Math.min(8, Math.max(4, Math.ceil(nLongitudes / 4)));
    for (const lat of southLats) {
      for (let i = 0; i < nSouthLon; i++) {
        const lon = (360 / nSouthLon) * i;
        const theta = (90 + lat) * (Math.PI / 180); // southern colatitude
        const phi = lon * (Math.PI / 180);
        const [x, y, z] = sphericalToCartesian(r0, theta, phi);
        seeds.push({ x, y, z, lat: -lat, lon });
      }
    }
  }

  // Polar cap seeds — very high latitudes for open field lines.
  // Cap at 6: field lines are nearly axisymmetric at 85-88° so fine
  // longitude resolution is redundant and these are the most expensive traces.
  const nPolarLon = Math.min(6, Math.max(4, Math.ceil(nLongitudes / 4)));
  for (const lat of polarCapLatitudes) {
    for (let i = 0; i < nPolarLon; i++) {
      const lon = (360 / nPolarLon) * i;
      // North polar cap
      const thetaN = (90 - lat) * (Math.PI / 180);
      const phi = lon * (Math.PI / 180);
      const [xN, yN, zN] = sphericalToCartesian(r0, thetaN, phi);
      seeds.push({ x: xN, y: yN, z: zN, lat, lon });
      // South polar cap
      const thetaS = (90 + lat) * (Math.PI / 180);
      const [xS, yS, zS] = sphericalToCartesian(r0, thetaS, phi);
      seeds.push({ x: xS, y: yS, z: zS, lat: -lat, lon });
    }
  }

  return seeds;
}
