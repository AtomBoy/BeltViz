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
