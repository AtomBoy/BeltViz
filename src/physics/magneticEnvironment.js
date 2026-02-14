/**
 * Magnetic environment computation.
 *
 * Computes L-shell (McIlwain L parameter), radiation belt region classification,
 * and South Atlantic Anomaly proximity from IGRF field values.
 */

import { computeB, computeBMagnitude } from './igrf.js';
import { cartesianToSpherical } from './coordinates.js';
import { EARTH_RADIUS_KM } from '../utils/constants.js';

/**
 * Compute the dipole L-shell at a point using the local field direction.
 *
 * Uses the relationship: tan(λ_m) = -Br / sqrt(Bt² + Bp²)
 * where λ_m is the magnetic latitude, then L = r / (Re * cos²(λ_m)).
 *
 * This is a dipole approximation — accurate within ~10% for L < 6.
 *
 * @param {number} r - Radial distance in km
 * @param {number} theta - Colatitude in radians
 * @param {number} phi - East longitude in radians
 * @param {object} coeffs - IGRF coefficients
 * @param {number} [maxDegree] - Maximum SH degree
 * @returns {number} L-shell value (dimensionless, in Earth radii)
 */
export function computeLShell(r, theta, phi, coeffs, maxDegree) {
  const [Br, Bt, Bp] = computeB(r, theta, phi, coeffs, maxDegree);

  // Transverse field magnitude
  const Bperp = Math.sqrt(Bt * Bt + Bp * Bp);

  // Magnetic latitude from field direction
  // For a dipole: tan(λ_m) = -Br / Bperp  (factor of 2 cancels in L formula)
  // More precisely: tan(λ_m) = Br / (2 * Bperp) for dipole geometry,
  // but we use the invariant: L = r / (Re * cos²(λ_m))
  // where sin(λ_m)/cos(λ_m) = |Br| / (2*Bperp)

  if (Bperp < 1e-10) {
    // At poles, Bperp → 0, L → r/Re (approximately)
    return r / EARTH_RADIUS_KM;
  }

  const tanLambda = Math.abs(Br) / (2 * Bperp);
  const cosLambda2 = 1 / (1 + tanLambda * tanLambda);

  const L = (r / EARTH_RADIUS_KM) / cosLambda2;

  return L;
}

/**
 * Radiation belt region boundaries (in L-shell values).
 */
export const BELT_REGIONS = {
  INNER_BELT_MIN: 1.2,
  INNER_BELT_MAX: 2.0,
  SLOT_MIN: 2.0,
  SLOT_MAX: 3.0,
  OUTER_BELT_MIN: 3.0,
  OUTER_BELT_MAX: 6.0,
};

/**
 * Classify the radiation belt region for a given L-shell value.
 *
 * @param {number} lShell
 * @returns {string} One of: 'below-inner-belt', 'inner-belt', 'slot-region',
 *   'outer-belt', 'beyond-outer-belt'
 */
export function classifyRegion(lShell) {
  if (lShell < BELT_REGIONS.INNER_BELT_MIN) return 'below-inner-belt';
  if (lShell <= BELT_REGIONS.INNER_BELT_MAX) return 'inner-belt';
  if (lShell <= BELT_REGIONS.SLOT_MAX) return 'slot-region';
  if (lShell <= BELT_REGIONS.OUTER_BELT_MAX) return 'outer-belt';
  return 'beyond-outer-belt';
}

/**
 * Estimate South Atlantic Anomaly proximity.
 *
 * The SAA is the region where the actual |B| is significantly depressed
 * relative to the dipole prediction at the same point. Returns 0-1 where
 * higher values indicate stronger SAA presence.
 *
 * @param {number} r - Radial distance in km
 * @param {number} theta - Colatitude in radians
 * @param {number} phi - East longitude in radians
 * @param {object} coeffs - IGRF coefficients
 * @param {number} [maxDegree] - Maximum SH degree (should be > 1 for SAA detection)
 * @returns {number} SAA proximity 0-1
 */
export function computeSAAProximity(r, theta, phi, coeffs, maxDegree) {
  const actualB = computeBMagnitude(r, theta, phi, coeffs, maxDegree);
  const dipoleB = computeBMagnitude(r, theta, phi, coeffs, 1);

  if (dipoleB < 1e-10) return 0;

  // Depression ratio: how much weaker is the actual field vs dipole
  const depression = 1 - actualB / dipoleB;

  // SAA shows up as ~15-25% depression. Map to 0-1.
  // depression < 0.05 → 0 (no SAA)
  // depression > 0.25 → 1 (strong SAA)
  const saa = Math.max(0, Math.min(1, (depression - 0.05) / 0.2));

  return saa;
}

/**
 * Compute full magnetic environment at a point.
 *
 * @param {number} r - Radial distance in km
 * @param {number} theta - Colatitude in radians
 * @param {number} phi - East longitude in radians
 * @param {object} coeffs - IGRF coefficients
 * @param {number} [maxDegree] - Maximum SH degree
 * @returns {{ bMagnitude: number, bVector: number[], lShell: number, region: string, saaProximity: number }}
 */
export function computeMagneticEnvironment(r, theta, phi, coeffs, maxDegree) {
  const bVector = computeB(r, theta, phi, coeffs, maxDegree);
  const bMagnitude = Math.sqrt(
    bVector[0] * bVector[0] + bVector[1] * bVector[1] + bVector[2] * bVector[2]
  );
  const lShell = computeLShell(r, theta, phi, coeffs, maxDegree);
  const region = classifyRegion(lShell);
  const saaProximity = computeSAAProximity(r, theta, phi, coeffs, maxDegree);

  return { bMagnitude, bVector, lShell, region, saaProximity };
}

/**
 * Compute L-shell value from Cartesian scene coordinates.
 * Useful for the scalar field Worker to compute L-shell grids.
 *
 * @param {number} xKm - X position in km
 * @param {number} yKm - Y position in km
 * @param {number} zKm - Z position in km
 * @param {object} coeffs - IGRF coefficients
 * @param {number} [maxDegree] - Maximum SH degree
 * @returns {number} L-shell value
 */
export function computeLShellCartesian(xKm, yKm, zKm, coeffs, maxDegree) {
  const [r, theta, phi] = cartesianToSpherical(xKm, yKm, zKm);
  return computeLShell(r, theta, phi, coeffs, maxDegree);
}
