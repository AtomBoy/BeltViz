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
 * Maximum magnetic latitude (radians) at which a particle on drift shell L
 * still lies inside the rendered belt core mesh.
 *
 * The belt meshes (radiationBelts.js) have a rounded iso-flux-style
 * cross-section: an ellipse in (L, λ_m) space,
 *   ((L − L_mid)/L_half)² + (λ/latLimit)² = 1
 * with L_mid = (lMin+lMax)/2 and L_half = (lMax−lMin)/2. Solving for λ at a
 * given L yields the latitude where the contour closes — beyond it the
 * particle would poke out of the belt:
 *   λ_max = latLimit · √(1 − ((L − L_mid)/L_half)²)
 *
 * Returns 0 for L at or outside [lMin, lMax] (the contour pinches to the
 * equator at both L extremes). Callers placing particles intentionally outside
 * the belt (e.g. storm-time slot filling below lMin) should not apply this cap.
 *
 * @param {number} L           McIlwain L-shell of the particle
 * @param {number} lMin        Belt inner L boundary (at the equator)
 * @param {number} lMax        Belt outer L boundary (at the equator)
 * @param {number} latLimitRad Belt latitude limit in radians
 * @returns {number} Maximum |magnetic latitude| in radians, in [0, latLimitRad]
 */
export function beltConfinedLambdaMax(L, lMin, lMax, latLimitRad) {
  if (lMax <= lMin) return 0;
  const f = (2 * L - (lMin + lMax)) / (lMax - lMin); // (L − L_mid) / L_half
  if (f <= -1 || f >= 1) return 0;
  return latLimitRad * Math.sqrt(1 - f * f);
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
 * outer portion of the inner belt (L = 1.5–1.9). The deep inner belt (L < 1.5)
 * is strongly proton-dominated; electron diffusion barely reaches there.
 * Upper bound matches the inner belt core mesh (radiationBelts.js BELT_DEFINITIONS).
 *
 * @returns {{ lMin: number, lMax: number }}
 */
export function innerBeltElectronLRange() {
  return { lMin: 1.5, lMax: 1.9 };
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
 * Always L = 1.3–1.9 regardless of Dst — inner belt protons do not compress
 * significantly during geomagnetic storms on the timescales we simulate.
 * Matches the inner belt core mesh (radiationBelts.js BELT_DEFINITIONS) so the
 * particle population sits inside the rendered belt.
 *
 * @returns {{ lMin: number, lMax: number }}
 */
export function innerBeltLRange() {
  return { lMin: 1.3, lMax: 1.9 };
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

// ─── Particle budget allocation (Little's Law) ────────────────────────────────

// Baseline outer belt electrons per real second at quiet conditions (Dst ≥ −20 nT).
export const BASE_INJECT_RATE = 20;

// Ring current proton base rate: ~20% of outer electron rate.
// Ring current protons coexist with outer electrons, slightly weighted lower.
export const BASE_RING_CURRENT_RATE = 4;

// Representative mean lifetimes for budget computation (Little's Law: N_steady = rate × τ).
// These are averages across each population's L-range, used only for budget allocation.
const AVG_CRAND_LIFETIME          = 450; // innerBeltLifetime midpoint at L ≈ 1.6
const AVG_INNER_ELECTRON_LIFETIME = 120; // equals INNER_ELECTRON_LIFETIME in particleSystem.js
const AVG_OUTER_ELECTRON_LIFETIME =  35; // mix: 45s (L < 4) + 25s (L ≥ 4)
const AVG_RING_PROTON_LIFETIME    =  40; // skewed lower-L vs outer electrons → slightly longer

/**
 * Compute per-population particle budget for the current solar wind conditions.
 *
 * At steady state N_i = rate_i × τ_i (Little's Law). Each population's share of
 * maxCount is proportional to this weight. Budgets always sum exactly to maxCount.
 *
 * Populations: A = CRAND protons, B = inner belt electrons,
 * C = outer belt electrons, D = ring current protons.
 *
 * When showProtons or showElectrons is false, those populations get zero budget;
 * the remaining species expand to fill the pool proportionally.
 *
 * @param {number} maxCount       Total particle pool size for this frame
 * @param {number} dst            Dst index in nT (drives outer injection rates)
 * @param {boolean} showElectrons Whether electron populations (B, C) are enabled
 * @param {boolean} showProtons   Whether proton populations (A, D) are enabled
 * @returns {{ budgetA, budgetB, budgetC, budgetD }}
 */
export function computeBudgets(maxCount, dst, showElectrons, showProtons) {
  const mult = injectionRate(dst);
  const wA = showProtons   ? crandInjectionRate()          * AVG_CRAND_LIFETIME          : 0;
  const wB = showElectrons ? innerBeltElectronRate()       * AVG_INNER_ELECTRON_LIFETIME : 0;
  const wC = showElectrons ? mult * BASE_INJECT_RATE       * AVG_OUTER_ELECTRON_LIFETIME : 0;
  const wD = showProtons   ? mult * BASE_RING_CURRENT_RATE * AVG_RING_PROTON_LIFETIME    : 0;
  const total = wA + wB + wC + wD;
  if (total === 0) return { budgetA: 0, budgetB: 0, budgetC: 0, budgetD: 0 };
  let budgetA = Math.floor(maxCount * wA / total);
  let budgetB = Math.floor(maxCount * wB / total);
  let budgetD = Math.floor(maxCount * wD / total);
  // The floor-division remainder goes to C so budgets sum exactly to maxCount —
  // unless electrons are disabled (wC = 0), in which case it must go to an
  // enabled population (otherwise a few stray electrons could be injected).
  let budgetC = 0;
  if (wC > 0) {
    budgetC = Math.max(0, maxCount - budgetA - budgetB - budgetD);
  } else {
    const rem = maxCount - budgetA - budgetB - budgetD;
    if (wA >= wB && wA >= wD) budgetA += rem;
    else if (wB >= wD) budgetB += rem;
    else budgetD += rem;
  }
  return { budgetA, budgetB, budgetC, budgetD };
}
