/**
 * src/physics/particleDrift.js
 *
 * Guiding-center drift physics for Van Allen belt particle visualization.
 *
 * Uses the bounce-averaged azimuthal drift approximation for a dipole field.
 * Reference: Roederer, "Dynamics of Geomagnetically Trapped Radiation" (1970), §3.4.
 *
 * All positions are in scene coordinates (1 unit = 1 Earth radius).
 * Coordinate system: Y-up (north pole), magnetic equator in the XZ plane.
 *
 * Drift direction convention:
 *   Electrons drift EASTWARD  → positive phi direction (counterclockwise from north)
 *   Protons   drift WESTWARD  → negative phi direction (clockwise from north)
 */

export const ELECTRON = -1;
export const PROTON   = +1;

/**
 * Bounce-averaged azimuthal drift rate (rad / sim-second) in a dipole field.
 *
 * For an isotropic pitch angle distribution the drift periods are:
 *   T_electron ≈ 1.05 / (L × E_k[MeV])  minutes  (eastward, positive)
 *   T_proton   ≈ 58.0 / (L × E_k[MeV])  minutes  (westward, negative)
 *
 * Reference: Schulz & Lanzerotti (1974), "Particle Diffusion in the Radiation Belts".
 *
 * @param {number} L          McIlwain L-shell value (≥ 1)
 * @param {number} energyMeV  Kinetic energy in MeV (> 0)
 * @param {number} species    ELECTRON (-1) or PROTON (+1)
 * @returns {number} Drift rate in rad/s (physics time). Positive = eastward.
 */
export function driftRate(L, energyMeV, species) {
  if (L <= 0 || energyMeV <= 0) return 0;
  // Formula gives period in HOURS (not minutes — see Roederer 1970 §3.4):
  //   T_electron ≈ 1.05 / (L × E_k[MeV])  hours  → ~16 min at L=4, 1 MeV
  //   T_proton   ≈ 58.0 / (L × E_k[MeV])  hours  → ~29 min at L=4, 30 MeV
  const periodHours = species === ELECTRON
    ? 1.05 / (L * energyMeV)
    : 58.0 / (L * energyMeV);
  const periodSeconds = periodHours * 3600;
  const rate = (2 * Math.PI) / periodSeconds;
  return species === ELECTRON ? rate : -rate;
}

/**
 * 3D position in scene coordinates (Re) from a particle's drift-shell state.
 *
 * Dipole field geometry:
 *   r = L × cos²(λ_m)                              [Earth radii]
 *   x = r × cos(λ_m) × cos(φ)
 *   y = r × sin(λ_m)                               [Y = geographic north]
 *   z = r × cos(λ_m) × (−sin(φ))
 *
 * @param {number} L       McIlwain L-shell
 * @param {number} phi     Azimuthal angle in rad. φ=0 points towards the subsolar direction.
 * @param {number} lambdaM Magnetic latitude in rad. λ=0 = magnetic equator.
 * @returns {[number, number, number]} [x, y, z] in scene units (Re)
 */
export function driftShellPosition(L, phi, lambdaM) {
  const cosL = Math.cos(lambdaM);
  const r    = L * cosL * cosL;
  return [
     r * cosL * Math.cos(phi),
     r * Math.sin(lambdaM),
    -r * cosL * Math.sin(phi),
  ];
}

/**
 * Equatorial loss cone half-angle (radians) in a dipole field.
 *
 * Particles with equatorial pitch angle below this threshold precipitate into
 * the atmosphere along field lines, producing aurora.
 *
 * Formula (Lyons & Schulz 1989, eq. 2.3, dipole approximation):
 *   sin²(α_LC) = 4 / (L³ × √(4 − 3/L))
 *
 * @param {number} L McIlwain L-shell (≥ 1)
 * @returns {number} Loss cone half-angle in radians
 */
export function lossConeAngle(L) {
  if (L < 1) return Math.PI / 2;
  const denom = L * L * L * Math.sqrt(Math.max(4 - 3 / L, 1e-6));
  const sinSq = Math.min(4 / denom, 1);
  return Math.asin(Math.sqrt(sinSq));
}

/**
 * Injection rate scale factor driven by Dst index.
 *
 * @param {number} dst Dst index in nT (negative during storms)
 * @returns {number} Injection multiplier (≥ 1.0)
 */
export function injectionRate(dst) {
  if (dst >= -20)  return 1.0;
  if (dst >= -50)  return 1.0 + ((-dst - 20) / 30)   * 4;    // 1× → 5×  at −50 nT
  if (dst >= -150) return 5.0 + ((-dst - 50) / 100)  * 15;   // 5× → 20× at −150 nT
  return 20.0 + ((-dst - 150) / 50) * 30;                     // 20× → 50× beyond −150 nT
}

/**
 * Target L-shell range for particle injection based on Dst.
 * During storms, high-energy particles are injected at lower L (ring current).
 *
 * @param {number} dst Dst index in nT
 * @returns {{ lMin: number, lMax: number }}
 */
export function injectionLRange(dst) {
  if (dst >= -20)  return { lMin: 3.5, lMax: 5.5 };
  if (dst >= -50)  return { lMin: 3.0, lMax: 5.0 };
  if (dst >= -150) return { lMin: 2.5, lMax: 4.5 };
  return                   { lMin: 2.0, lMax: 4.0 };
}

/**
 * Particle loss e-folding time in simulation seconds.
 * Represents wave-particle scattering and diffusion losses.
 *
 * @param {number} L McIlwain L-shell
 * @returns {number} Loss lifetime in sim-seconds
 */
export function lossLifetime(L) {
  if (L < 2) return 1800;  // inner belt: very long-lived
  if (L < 4) return  600;  // outer belt main body
  return              300;  // outer belt fringe: faster wave scattering
}
