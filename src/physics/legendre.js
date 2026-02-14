/**
 * Compute Schmidt semi-normalized associated Legendre polynomials P_n^m(cos(theta))
 * and their derivatives dP_n^m / d(theta), for degrees n = 0..nmax.
 *
 * Uses the standard stable recursion relations.
 * Returns { P, dP } where P[n][m] and dP[n][m] are 2D arrays.
 */
export function computeLegendre(nmax, theta) {
  // Clamp theta away from poles to avoid division by zero
  const EPS = 1e-10;
  const t = Math.max(EPS, Math.min(Math.PI - EPS, theta));

  const cosT = Math.cos(t);
  const sinT = Math.sin(t);

  // Allocate arrays
  const P = new Array(nmax + 1);
  const dP = new Array(nmax + 1);
  for (let n = 0; n <= nmax; n++) {
    P[n] = new Float64Array(n + 1);
    dP[n] = new Float64Array(n + 1);
  }

  // Seed values
  P[0][0] = 1.0;
  dP[0][0] = 0.0;

  if (nmax === 0) return { P, dP };

  P[1][0] = cosT;
  P[1][1] = sinT;
  dP[1][0] = -sinT;
  dP[1][1] = cosT;

  // Sectoral recursion: P[n][n] from P[n-1][n-1]
  for (let n = 2; n <= nmax; n++) {
    const factor = Math.sqrt(1.0 - 1.0 / (2.0 * n));
    P[n][n] = factor * sinT * P[n - 1][n - 1];
    dP[n][n] = factor * (cosT * P[n - 1][n - 1] + sinT * dP[n - 1][n - 1]);
  }

  // Semi-sectoral: P[n][n-1] from P[n-1][n-1]
  for (let n = 2; n <= nmax; n++) {
    P[n][n - 1] = cosT * Math.sqrt(2.0 * n - 1.0) * P[n - 1][n - 1];
    dP[n][n - 1] =
      Math.sqrt(2.0 * n - 1.0) *
      (-sinT * P[n - 1][n - 1] + cosT * dP[n - 1][n - 1]);
  }

  // General recursion: P[n][m] for m < n-1 (Schmidt semi-normalized)
  for (let n = 2; n <= nmax; n++) {
    for (let m = 0; m <= n - 2; m++) {
      const n2m2 = n * n - m * m;
      const a = (2.0 * n - 1.0) / Math.sqrt(n2m2);
      const b = Math.sqrt(((n - 1.0) * (n - 1.0) - m * m) / n2m2);

      P[n][m] = a * cosT * P[n - 1][m] - b * P[n - 2][m];
      dP[n][m] = a * (-sinT * P[n - 1][m] + cosT * dP[n - 1][m]) - b * dP[n - 2][m];
    }
  }

  return { P, dP };
}
