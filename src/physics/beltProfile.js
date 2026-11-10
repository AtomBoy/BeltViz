/**
 * Radiation belt flux-shape model.
 *
 * A compact analytic model of the RELATIVE trapped-particle flux of each belt
 * as a function of dipole L-shell and magnetic latitude:
 *
 *   f(L, λ) = g(L) · h(λ)^k · a(r)            f ∈ [0, 1], 1 at the equatorial peak
 *
 *   g(L)  radial profile — a generalised Gaussian around the flux peak, with
 *         separate widths/steepness on the earthward and outward sides
 *   h(λ)  = B_eq / B(λ) = cos⁶λ / √(4 − 3cos²λ) along a dipole field line.
 *         For a pitch-angle distribution j ∝ sinⁿα the flux at latitude λ on a
 *         field line falls off as (B_eq/B)^(n/2) (Roederer 1970; Walt 1994),
 *         so k plays the role of n/2 — the belt's pitch-angle anisotropy.
 *   a(r)  atmospheric cutoff — particles mirroring at low altitude are lost,
 *         so flux goes smoothly to zero just above the surface.
 *
 * Iso-contours of f in a meridional plane are crescents whose flanks follow
 * the dipole field lines — the shape seen in NASA's belt cross-sections
 * (e.g. SVS 30470) and in AE8/AP8 flux maps (Vette 1991; Sawyer & Vette 1976).
 *
 * This is a SHAPE model for rendering and particle placement, not a flux
 * forecast: absolute intensities come from src/physics/beltFlux.js.
 *
 * Calibration: each belt is specified by where its equatorial profile crosses
 * two levels —
 *   FLUX_LEVELS.core (0.5): the cited high-flux core range (coreMin..coreMax)
 *   FLUX_LEVELS.halo (0.12): the outer limit of the rendered belt (haloMin..haloMax)
 * and by the magnetic latitude the core contour reaches at the peak L (coreLat).
 *
 * Pure functions, no DOM / Three.js — safe for tests and workers.
 */

const DEG = Math.PI / 180;

/** Iso-flux levels used for the rendered shells and the particle confinement. */
export const FLUX_LEVELS = Object.freeze({
  halo: 0.12, // outermost rendered contour
  core: 0.5,  // high-flux core (the cited L ranges)
  peak: 0.8,  // innermost "hot" contour
});

/** Atmospheric cutoff: flux → 0 below ATM_R0 (Re), unaffected above ATM_R1. */
export const ATM_R0 = 1.02;
export const ATM_R1 = 1.12;

/**
 * Quiet-time belt definitions (equatorial L values in Earth radii).
 *
 *   Inner belt: >10 MeV proton flux peaks near L ≈ 1.5 (Selesnick et al. 2014).
 *   Outer belt: >1 MeV electron flux peaks at L ≈ 4.0–4.5 (Reeves et al. 2013;
 *               Li & Hudson 2019).
 *   Storage ring: ultra-relativistic electrons at L ≈ 3.0–3.5
 *               (Baker et al. 2013; Shprits et al. 2013).
 */
export const BELT_PROFILES = Object.freeze({
  innerBelt: Object.freeze({
    name: 'innerBelt',
    lPeak: 1.5, coreMin: 1.3, coreMax: 1.9, haloMin: 1.12, haloMax: 2.3,
    coreLat: 35 * DEG,
  }),
  outerBelt: Object.freeze({
    name: 'outerBelt',
    lPeak: 4.0, coreMin: 3.0, coreMax: 4.8, haloMin: 2.6, haloMax: 6.0,
    coreLat: 22 * DEG,
  }),
  storageBelt: Object.freeze({
    name: 'storageBelt',
    lPeak: 3.25, coreMin: 3.0, coreMax: 3.5, haloMin: 2.85, haloMax: 3.65,
    coreLat: 18 * DEG,
  }),
});

/** Maximum Kp-driven outward expansion of the outer belt's outer edge (Re). */
const OUTER_KP_EXPANSION_MAX = 0.8;

/**
 * Outward expansion of the outer belt's outer edge with geomagnetic activity
 * (Ganushkina et al. 2011): 0 at Kp ≤ 3, +0.8 Re at Kp ≥ 7.
 */
export function outerBeltKpExpansion(kp = 0) {
  return Math.min(OUTER_KP_EXPANSION_MAX, Math.max(0, (kp - 3) / 4) * OUTER_KP_EXPANSION_MAX);
}

/** h(λ) = B_eq / B(λ) on a dipole field line. 1 at the equator, → 0 at the pole. */
export function dipoleBRatio(lambda) {
  const c2 = Math.cos(lambda) ** 2;
  return (c2 * c2 * c2) / Math.sqrt(4 - 3 * c2);
}

function smoothstep(edge0, edge1, x) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// ln(1/halo) / ln(1/core): how many "core half-widths^p" out the halo level sits.
const HALO_RATIO = Math.log(1 / FLUX_LEVELS.halo) / Math.log(1 / FLUX_LEVELS.core);

/**
 * Resolve a belt definition into the numeric shape parameters used by
 * beltFluxAt() and by the cut-face shader (which mirrors beltFluxAt in GLSL).
 *
 * Storm-time adjustments:
 *   kp           — expands the OUTER belt's outer edge (see outerBeltKpExpansion).
 *   storageFlux  — [0, 1]. When the storage ring is present the outer belt's
 *                  inner edge retreats outward (core 3.0 → 3.9, peak 4.0 → 4.5),
 *                  opening the second slot at L ≈ 3.5–3.9 that makes the ring a
 *                  distinct third belt (Baker et al. 2013).
 *
 * @param {string} name 'innerBelt' | 'outerBelt' | 'storageBelt'
 * @param {{ kp?: number, storageFlux?: number }} [conditions]
 * @returns {{ name, lPeak, coreMin, coreMax, haloMin, haloMax, coreLat,
 *             wIn, pIn, wOut, pOut, k }}
 */
export function resolveBeltProfile(name, conditions = {}) {
  const base = BELT_PROFILES[name];
  if (!base) throw new Error(`Unknown belt profile: ${name}`);
  let { lPeak, coreMin, coreMax, haloMin, haloMax } = base;

  if (name === 'outerBelt') {
    const expand = outerBeltKpExpansion(conditions.kp ?? 0);
    coreMax += expand;
    haloMax += expand;
    const sf = Math.max(0, Math.min(1, conditions.storageFlux ?? 0));
    coreMin += 0.9 * sf;
    haloMin += 1.15 * sf;
    lPeak   += 0.5 * sf;
    coreMax += 0.4 * sf;
  }

  const wIn  = lPeak - coreMin;
  const wOut = coreMax - lPeak;
  // Exponent chosen so the profile passes through the halo level at halo edge.
  const pIn  = Math.log(HALO_RATIO) / Math.log((lPeak - haloMin) / wIn);
  const pOut = Math.log(HALO_RATIO) / Math.log((haloMax - lPeak) / wOut);
  // Anisotropy chosen so the core contour reaches coreLat at the peak L.
  const k = Math.log(FLUX_LEVELS.core) / Math.log(dipoleBRatio(base.coreLat));

  return { name, lPeak, coreMin, coreMax, haloMin, haloMax, coreLat: base.coreLat,
           wIn, pIn, wOut, pOut, k };
}

/** Equatorial radial profile g(L) ∈ [0, 1]. */
export function beltRadialProfile(profile, L) {
  const d = L - profile.lPeak;
  const x = d < 0 ? -d / profile.wIn : d / profile.wOut;
  const p = d < 0 ? profile.pIn : profile.pOut;
  return Math.exp(-Math.LN2 * Math.pow(x, p));
}

/**
 * Relative flux at (L, λ). The shader in src/scene/radiationBelts.js mirrors
 * this function — change them together.
 *
 * @param {object} profile  from resolveBeltProfile()
 * @param {number} L        dipole L-shell (Re)
 * @param {number} lambda   magnetic latitude (rad)
 * @returns {number} [0, 1]
 */
export function beltFluxAt(profile, L, lambda) {
  if (!(L > 0)) return 0;
  const r = L * Math.cos(lambda) ** 2;
  const atm = smoothstep(ATM_R0, ATM_R1, r);
  if (atm === 0) return 0;
  return beltRadialProfile(profile, L) * Math.pow(dipoleBRatio(lambda), profile.k) * atm;
}

/**
 * Magnetic latitude at which the iso-flux contour `level` crosses the field
 * line L — the belt's half-thickness in latitude there. 0 where the equatorial
 * flux is already below `level` (outside the contour).
 *
 * @returns {number} radians, in [0, π/2)
 */
export function isoFluxLambdaMax(profile, L, level = FLUX_LEVELS.halo) {
  if (beltFluxAt(profile, L, 0) <= level) return 0;
  let lo = 0;            // f > level
  let hi = Math.PI / 2;  // f = 0
  for (let i = 0; i < 40; i++) {
    const mid = 0.5 * (lo + hi);
    if (beltFluxAt(profile, L, mid) > level) lo = mid;
    else hi = mid;
  }
  return lo;
}

/**
 * Equatorial L range enclosed by the iso-flux contour `level`.
 * @returns {{ lMin: number, lMax: number }}
 */
export function isoFluxLRange(profile, level = FLUX_LEVELS.halo) {
  const solve = (inside, outside) => {
    let a = inside;   // f > level
    let b = outside;  // f <= level
    for (let i = 0; i < 50; i++) {
      const mid = 0.5 * (a + b);
      if (beltFluxAt(profile, mid, 0) > level) a = mid;
      else b = mid;
    }
    return 0.5 * (a + b);
  };
  return { lMin: solve(profile.lPeak, 1.0), lMax: solve(profile.lPeak, 30) };
}

/**
 * Closed iso-flux contour in the meridional half-plane, as a flat array of
 * (ρ, y) pairs in Earth radii: ρ = equatorial distance, y = northward.
 * Points run from the outer tip, over the northern flank to the earthward
 * tip, and back along the southern flank.
 *
 * L is sampled with cosine spacing so the rounded tips (where the latitude
 * half-thickness grows like a square root) are well resolved.
 *
 * @param {object} profile from resolveBeltProfile()
 * @param {number} level   iso-flux level
 * @param {number} nL      samples per flank (contour has 2·nL points)
 * @returns {Float64Array} length 4·nL
 */
export function isoFluxContour(profile, level, nL = 80) {
  const { lMin, lMax } = isoFluxLRange(profile, level);
  const out = new Float64Array(4 * nL);
  const lMid = 0.5 * (lMin + lMax);
  const lHalf = 0.5 * (lMax - lMin);
  const put = (idx, L, lambda) => {
    const c = Math.cos(lambda);
    out[2 * idx] = L * c * c * c;
    out[2 * idx + 1] = L * c * c * Math.sin(lambda);
  };
  for (let i = 0; i < nL; i++) {
    // North flank: t from 0 (outer tip) toward π (earthward tip), excluding π.
    const tN = Math.PI * (i / nL);
    const LN = lMid + lHalf * Math.cos(tN);
    put(i, LN, isoFluxLambdaMax(profile, LN, level));
    // South flank: from the earthward tip back toward the outer tip, excluding it.
    const tS = Math.PI * (1 - i / nL);
    const LS = lMid + lHalf * Math.cos(tS);
    put(nL + i, LS, -isoFluxLambdaMax(profile, LS, level));
  }
  return out;
}
