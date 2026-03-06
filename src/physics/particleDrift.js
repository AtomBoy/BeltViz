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
 * Target L-shell range for outer belt electron injection based on Dst.
 * During storms, electrons are injected at lower L (ring current compression).
 *
 * @param {number} dst Dst index in nT
 * @returns {{ lMin: number, lMax: number }}
 */
export function outerBeltLRange(dst) {
  if (dst >= -20)  return { lMin: 3.0, lMax: 4.5 };
  if (dst >= -50)  return { lMin: 2.8, lMax: 4.5 };
  if (dst >= -150) return { lMin: 2.5, lMax: 4.5 };
  return                   { lMin: 2.0, lMax: 4.0 };
}

/**
 * Injection rate for inner belt electrons (constant slow trickle).
 *
 * Inner belt electrons originate from inward radial diffusion from the outer belt,
 * not from CRAND or storm-time injection. The population is relatively stable but
 * smaller than the proton population. Source is azimuthally uniform.
 *
 * @returns {number} Injection rate in particles/real-second (constant)
 */
export function innerBeltElectronRate() {
  return 2.0;
}

/**
 * L-shell range for inner belt electrons.
 *
 * Electrons diffuse inward from the outer belt and accumulate primarily in the
 * outer portion of the inner belt (L = 1.5–2.0). The deep inner belt (L < 1.5)
 * is strongly proton-dominated; electron diffusion barely reaches there.
 *
 * @returns {{ lMin: number, lMax: number }}
 */
export function innerBeltElectronLRange() {
  return { lMin: 1.5, lMax: 2.0 };
}

/**
 * L-shell range for ring current proton injection.
 *
 * The ring current (L = 2–6) contains protons at 10–300 keV injected from the
 * nightside plasma sheet during storms — the same mechanism as outer belt electron
 * injection but producing the dominant energy carriers of the ring current.
 * During storms the ring current compresses inward, matching the electron belt.
 *
 * @param {number} dst Dst index in nT
 * @returns {{ lMin: number, lMax: number }}
 */
export function ringCurrentLRange(dst) {
  if (dst >= -20)  return { lMin: 2.5, lMax: 4.5 };
  if (dst >= -50)  return { lMin: 2.0, lMax: 4.0 };
  if (dst >= -150) return { lMin: 1.8, lMax: 3.5 };
  return                   { lMin: 1.5, lMax: 3.0 };
}

/**
 * CRAND (Cosmic Ray Albedo Neutron Decay) inner belt proton injection rate.
 *
 * Galactic cosmic rays strike the upper atmosphere and produce neutrons, which
 * decay in flight: n → p + e⁻ + ν̄ₑ. The resulting protons are trapped in the
 * inner belt. This is a continuous, azimuthally uniform source that is
 * independent of solar wind activity (on the timescales we simulate).
 *
 * @returns {number} Injection rate in particles/real-second (constant)
 */
export function crandInjectionRate() {
  return 4.0;
}

/**
 * L-shell range for inner belt proton injection (CRAND source).
 * Always L = 1.2–2.0 regardless of Dst — inner belt protons do not compress
 * significantly during geomagnetic storms on the timescales we simulate.
 *
 * @returns {{ lMin: number, lMax: number }}
 */
export function innerBeltLRange() {
  return { lMin: 1.2, lMax: 2.0 };
}

/**
 * Visual loss lifetime (real seconds) for inner belt protons.
 *
 * Real inner belt proton lifetimes are years (very stable, CRAND-sustained).
 * We use 300–600 visual seconds to keep a visually stable inner belt that
 * contrasts clearly with the much shorter outer belt electron lifetimes (25–45 s).
 * Longer at lower L (deeper magnetic trapping), shorter near L = 2.0.
 *
 * @param {number} L McIlwain L-shell (1.2 ≤ L ≤ 2.0)
 * @returns {number} Lifetime in real-seconds
 */
export function innerBeltLifetime(L) {
  // L=1.2 → 600 s;  L=2.0 → 300 s  (linear interpolation)
  return 600 - ((L - 1.2) / 0.8) * 300;
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
