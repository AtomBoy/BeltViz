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
export function computeB(r, theta, phi, coeffs, maxDegree) {
  const a = coeffs.referenceRadius;
  const nmax = maxDegree || coeffs.nmax;
  const { g, h } = coeffs;

  const { P, dP } = computeLegendre(nmax, theta);

  const sinTheta = Math.sin(Math.max(1e-10, Math.min(Math.PI - 1e-10, theta)));

  let Br = 0;
  let Bt = 0;
  let Bp = 0;

  for (let n = 1; n <= nmax; n++) {
    // (a/r)^(n+2)
    const ratio = Math.pow(a / r, n + 2);

    for (let m = 0; m <= n; m++) {
      const gNM = g[n][m];
      const hNM = h[n]?.[m] || 0;
      const cosMP = Math.cos(m * phi);
      const sinMP = Math.sin(m * phi);

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
