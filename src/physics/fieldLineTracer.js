import { computeFieldCartesian } from './totalField.js';
import { cartesianToSpherical, sphericalToCartesian } from './coordinates.js';
import { EARTH_RADIUS_KM } from '../utils/constants.js';

// Scratch buffer for computeFieldCartesian — the tracer is single-threaded
// (runs in the field line worker or the main thread, never both at once
// within one module instance), so one module-level buffer is safe.
const _field = new Float64Array(6);

/**
 * Evaluate the field at a Cartesian point (in km) in a single IGRF + external
 * computation, producing both the unit direction along B and the colour metric.
 *
 * Direction: unit vector along the total field. `valid` is false when
 * |B_total| < 1e-10 nT (e.g. fully faded outside the magnetopause) — the
 * point cannot be stepped from, matching the old fieldDirection null return.
 *
 * Colour metric:
 * When solar wind is active: the solar wind influence ratio
 *   |B_external| / (|B_external| + |B_internal|)  ∈ [0, 1]
 * Near Earth the IGRF dominates → ratio ≈ 0 (blue).
 * Near the magnetopause / in the tail the T01 field becomes comparable
 * to IGRF → ratio → 1 (red), revealing dayside compression and nightside
 * stretching as a visible colour asymmetry.
 *
 * When solar wind is disabled: |B_total| (pure IGRF) in nT, which
 * spans 10–60 000 nT and colour-maps to a classic dipole strength gradient.
 * The auto-scale in fieldLines.js distinguishes the two modes by value range.
 *
 * The metric is computed even when `valid` is false (the field can fade to
 * zero outside the magnetopause while the internal field is nonzero).
 */
function evalPoint(x, y, z, coeffs, maxDegree, solarWindParams) {
  const [r, theta, phi] = cartesianToSpherical(x, y, z);
  computeFieldCartesian(x, y, z, r, theta, phi, coeffs, maxDegree, solarWindParams, _field);
  const Bx = _field[0];
  const By = _field[1];
  const Bz = _field[2];
  const mag = Math.sqrt(Bx * Bx + By * By + Bz * Bz);
  const valid = mag >= 1e-10;

  let metric;
  if (solarWindParams?.enabled) {
    const Bxi = _field[3];
    const Byi = _field[4];
    const Bzi = _field[5];
    const magInt = Math.sqrt(Bxi * Bxi + Byi * Byi + Bzi * Bzi);
    const magExt = Math.sqrt(
      (Bx - Bxi) * (Bx - Bxi) +
      (By - Byi) * (By - Byi) +
      (Bz - Bzi) * (Bz - Bzi),
    );
    metric = magInt > 0 ? magExt / (magExt + magInt) : 0;
  } else {
    metric = mag; // total == internal when solar wind is off
  }

  return {
    valid,
    ux: valid ? Bx / mag : 0,
    uy: valid ? By / mag : 0,
    uz: valid ? Bz / mag : 0,
    metric,
  };
}

/**
 * Single RK4 step for field line tracing.
 * `k1` is the (already evaluated) field at (x, y, z) — the caller carries it
 * over from the previous step's endpoint evaluation, so only k2–k4 are
 * computed here.
 * Returns the new position [x, y, z] after stepping ds along B.
 */
function rk4Step(x, y, z, ds, k1, coeffs, maxDegree, solarWindParams) {
  const k2 = evalPoint(
    x + 0.5 * ds * k1.ux,
    y + 0.5 * ds * k1.uy,
    z + 0.5 * ds * k1.uz,
    coeffs,
    maxDegree,
    solarWindParams
  );
  if (!k2.valid) return null;

  const k3 = evalPoint(
    x + 0.5 * ds * k2.ux,
    y + 0.5 * ds * k2.uy,
    z + 0.5 * ds * k2.uz,
    coeffs,
    maxDegree,
    solarWindParams
  );
  if (!k3.valid) return null;

  const k4 = evalPoint(
    x + ds * k3.ux,
    y + ds * k3.uy,
    z + ds * k3.uz,
    coeffs,
    maxDegree,
    solarWindParams
  );
  if (!k4.valid) return null;

  return [
    x + (ds / 6) * (k1.ux + 2 * k2.ux + 2 * k3.ux + k4.ux),
    y + (ds / 6) * (k1.uy + 2 * k2.uy + 2 * k3.uy + k4.uy),
    z + (ds / 6) * (k1.uz + 2 * k2.uz + 2 * k3.uz + k4.uz),
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

  // `cur` is the field evaluation at (x, y, z): it provides this point's
  // colour metric AND serves as k1 of the next RK4 step, halving the number
  // of field evaluations per step.
  let cur = evalPoint(startX, startY, startZ, coeffs, maxDegree, solarWindParams);
  const points = [[startX, startY, startZ, cur.metric]];
  let x = startX;
  let y = startY;
  let z = startZ;

  for (let i = 0; i < maxSteps; i++) {
    if (!cur.valid) break;

    const r = Math.sqrt(x * x + y * y + z * z);
    const ds = adaptiveStepSize(r, baseDs);
    const next = rk4Step(x, y, z, ds, cur, coeffs, maxDegree, solarWindParams);
    if (!next) break;

    [x, y, z] = next;
    const rNext = Math.sqrt(x * x + y * y + z * z);

    cur = evalPoint(x, y, z, coeffs, maxDegree, solarWindParams);
    points.push([x, y, z, cur.metric]);

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
