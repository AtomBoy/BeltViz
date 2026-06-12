import { computeLegendre } from './legendre.js';

/**
 * Evaluate the IGRF magnetic field at a point in spherical coordinates.
 *
 * @param {number} r     - Radial distance in km
 * @param {number} theta - Colatitude in radians (0 at north pole, pi at south)
 * @param {number} phi   - East longitude in radians [0, 2pi)
 * @param {object} coeffs - IGRF coefficients { nmax, referenceRadius, g, h }
 * @param {number} [maxDegree] - Maximum spherical harmonic degree to use (1-13)
 * @returns {number[]} [Br, Btheta, Bphi] in nanotesla
 */
// Scratch tables for cos(m*phi)/sin(m*phi) — filled per call via the
// angle-addition recurrence (2 trig calls instead of 2 per (n, m) pair).
// Single-threaded module instance, so module-level scratch is safe.
let _cosM = new Float64Array(14); // IGRF-14: m = 0..13
let _sinM = new Float64Array(14);

export function computeB(r, theta, phi, coeffs, maxDegree) {
  const a = coeffs.referenceRadius;
  const nmax = maxDegree || coeffs.nmax;
  const { g, h } = coeffs;

  const { P, dP } = computeLegendre(nmax, theta);

  const sinTheta = Math.sin(Math.max(1e-10, Math.min(Math.PI - 1e-10, theta)));

  if (nmax + 1 > _cosM.length) {
    _cosM = new Float64Array(nmax + 1);
    _sinM = new Float64Array(nmax + 1);
  }
  const cosM = _cosM;
  const sinM = _sinM;
  const cosP = Math.cos(phi);
  const sinP = Math.sin(phi);
  cosM[0] = 1;
  sinM[0] = 0;
  for (let m = 1; m <= nmax; m++) {
    cosM[m] = cosM[m - 1] * cosP - sinM[m - 1] * sinP;
    sinM[m] = sinM[m - 1] * cosP + cosM[m - 1] * sinP;
  }

  let Br = 0;
  let Bt = 0;
  let Bp = 0;

  const ar = a / r;
  let ratio = ar * ar * ar; // (a/r)^(n+2) for n=1

  for (let n = 1; n <= nmax; n++) {
    for (let m = 0; m <= n; m++) {
      const gNM = g[n][m];
      const hNM = h[n]?.[m] || 0;
      const cosMP = cosM[m];
      const sinMP = sinM[m];

      const ghCos = gNM * cosMP + hNM * sinMP;

      // Radial component: sum (n+1)(a/r)^(n+2) * [g cos(mphi) + h sin(mphi)] * P
      Br += (n + 1) * ratio * ghCos * P[n][m];

      // Theta component: -sum (a/r)^(n+2) * [g cos(mphi) + h sin(mphi)] * dP/dtheta
      Bt -= ratio * ghCos * dP[n][m];

      // Phi component: sum (a/r)^(n+2) * m * [g sin(mphi) - h cos(mphi)] * P / sin(theta)
      if (m > 0) {
        Bp += (ratio * m * (gNM * sinMP - hNM * cosMP) * P[n][m]) / sinTheta;
      }
    }
    ratio *= ar;
  }

  return [Br, Bt, Bp];
}

/**
 * Get the magnitude of the field at a point.
 */
export function computeBMagnitude(r, theta, phi, coeffs, maxDegree) {
  const [Br, Bt, Bp] = computeB(r, theta, phi, coeffs, maxDegree);
  return Math.sqrt(Br * Br + Bt * Bt + Bp * Bp);
}
