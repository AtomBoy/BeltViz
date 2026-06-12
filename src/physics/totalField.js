/**
 * Combined magnetic field: IGRF internal + solar wind external.
 *
 * When solarWindParams is null/disabled, returns pure IGRF.
 * When enabled, adds external field components and applies magnetopause confinement.
 */

import { computeB, computeBMagnitude } from './igrf.js';
import {
  sphericalToCartesian,
  bFieldToCartesian,
  bCartesianToSpherical,
} from './coordinates.js';
import { computeExternalB, insideMagnetopause } from './solarWind.js';

/**
 * Compute total magnetic field (IGRF + external) at a point.
 *
 * @param {number} r - Radial distance in km
 * @param {number} theta - Colatitude in radians
 * @param {number} phi - East longitude in radians
 * @param {object} coeffs - IGRF coefficients
 * @param {number} [maxDegree] - Maximum SH degree
 * @param {object} [solarWindParams] - Solar wind parameters (null = pure IGRF)
 * @returns {number[]} [Br, Bt, Bp] in nanotesla
 */
export function computeTotalB(r, theta, phi, coeffs, maxDegree, solarWindParams) {
  const [Br, Bt, Bp] = computeB(r, theta, phi, coeffs, maxDegree);

  if (!solarWindParams?.enabled) return [Br, Bt, Bp];

  // Convert position and IGRF field to Cartesian
  const [xKm, yKm, zKm] = sphericalToCartesian(r, theta, phi);
  const [BxIgrf, ByIgrf, BzIgrf] = bFieldToCartesian(Br, Bt, Bp, theta, phi);

  // Compute external field in Cartesian
  const [BxExt, ByExt, BzExt] = computeExternalB(xKm, yKm, zKm, solarWindParams);

  // Apply magnetopause confinement
  const fade = insideMagnetopause(xKm, yKm, zKm, solarWindParams);

  const BxTotal = (BxIgrf + BxExt) * fade;
  const ByTotal = (ByIgrf + ByExt) * fade;
  const BzTotal = (BzIgrf + BzExt) * fade;

  // Convert back to spherical components
  return bCartesianToSpherical(BxTotal, ByTotal, BzTotal, theta, phi);
}

/**
 * Compute total field magnitude.
 *
 * @param {number} r - Radial distance in km
 * @param {number} theta - Colatitude in radians
 * @param {number} phi - East longitude in radians
 * @param {object} coeffs - IGRF coefficients
 * @param {number} [maxDegree] - Maximum SH degree
 * @param {object} [solarWindParams] - Solar wind parameters
 * @returns {number} |B| in nanotesla
 */
export function computeTotalBMagnitude(r, theta, phi, coeffs, maxDegree, solarWindParams) {
  const [Br, Bt, Bp] = computeTotalB(r, theta, phi, coeffs, maxDegree, solarWindParams);
  return Math.sqrt(Br * Br + Bt * Bt + Bp * Bp);
}

/**
 * Compute total AND internal field as Cartesian components in one evaluation.
 *
 * Hot-path variant for the field line tracer: callers that need both the
 * total field (for direction) and the internal field (for the solar wind
 * influence color metric) get them from a single IGRF + external evaluation,
 * with no spherical round-trip.
 *
 * The magnetopause fade applies to the total (internal + external), matching
 * computeTotalB; the internal components are returned unfaded, matching the
 * color metric convention in fieldLineTracer.js.
 *
 * @param {number} xKm - X in km (same frame as the tracer)
 * @param {number} yKm - Y in km
 * @param {number} zKm - Z in km
 * @param {number} r - Radial distance in km (caller already has it)
 * @param {number} theta - Colatitude in radians
 * @param {number} phi - East longitude in radians
 * @param {object} coeffs - IGRF coefficients
 * @param {number} [maxDegree] - Maximum SH degree
 * @param {object} [solarWindParams] - Solar wind parameters (null = pure IGRF)
 * @param {Float64Array} out - Length-6 output: [BxTot, ByTot, BzTot, BxInt, ByInt, BzInt] in nT
 * @returns {Float64Array} out
 */
export function computeFieldCartesian(xKm, yKm, zKm, r, theta, phi, coeffs, maxDegree, solarWindParams, out) {
  const [Br, Bt, Bp] = computeB(r, theta, phi, coeffs, maxDegree);
  const [BxInt, ByInt, BzInt] = bFieldToCartesian(Br, Bt, Bp, theta, phi);
  out[3] = BxInt;
  out[4] = ByInt;
  out[5] = BzInt;

  if (!solarWindParams?.enabled) {
    out[0] = BxInt;
    out[1] = ByInt;
    out[2] = BzInt;
    return out;
  }

  const [BxExt, ByExt, BzExt] = computeExternalB(xKm, yKm, zKm, solarWindParams);
  const fade = insideMagnetopause(xKm, yKm, zKm, solarWindParams);

  out[0] = (BxInt + BxExt) * fade;
  out[1] = (ByInt + ByExt) * fade;
  out[2] = (BzInt + BzExt) * fade;
  return out;
}
