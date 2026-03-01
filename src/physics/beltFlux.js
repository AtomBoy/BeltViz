/**
 * src/physics/beltFlux.js
 *
 * Empirical model mapping solar wind conditions (Kp, Dst) to relative particle
 * flux in the inner and outer Van Allen radiation belts.
 *
 * All functions are pure with no DOM or Three.js dependencies.
 *
 * References:
 *   - Meredith et al. (2003), JGR 108(A4), doi:10.1029/2002JA009811
 *     Relativistic electron flux at geostationary orbit scales roughly
 *     exponentially with Kp; the linear approximation here gives the same
 *     trend for visual purposes.
 *   - Baker et al. (2004), Nature 432, 878–881, doi:10.1038/nature03116
 *     Slot region (L = 2–3) fills transiently during extreme geomagnetic
 *     storms (Dst < −100 nT).
 */

const PROTON_MASS_KG = 1.6726e-27;

/**
 * Solar wind dynamic pressure (nPa).
 * Duplicated inline to avoid import coupling; identical formula as solarWind.js.
 */
function dynamicPressure(vSw, nSw) {
  return 0.5 * (nSw * 1e6) * PROTON_MASS_KG * (vSw * 1e3) ** 2 * 1e9;
}

/**
 * Continuous Kp index [0–9] derived from solar wind parameters.
 *
 * Uses the same underlying formula as solarWindToKp() in solarWind.js, but
 * returns a float rather than the integer iopt (1–7) used by the T01 model.
 * The float Kp is needed for smooth flux interpolation.
 *
 * Returns 0 when solarWindParams is null or disabled.
 *
 * @param {{ dst: number, vSw: number, nSw: number, enabled?: boolean }|null} swParams
 * @returns {number} Kp in [0, 9]
 */
export function computeKp(swParams) {
  if (!swParams?.enabled) return 0;
  const Dp        = dynamicPressure(swParams.vSw, swParams.nSw);
  const kpFromDst = Math.min(6, Math.max(0, -swParams.dst / 15));
  const kpFromDp  = Math.min(2, Math.max(0, (Dp - 2) / 1.5));
  return Math.min(9, Math.max(0, kpFromDst + 0.2 * kpFromDp));
}

/**
 * Empirical normalized flux [0–1] per belt region.
 *
 * Outer belt electrons:
 *   outerFlux = clamp(0.1 + 0.15 × Kp, 0, 1)
 *   Quiet (Kp = 0) → 0.10;  Moderate (Kp = 3) → 0.55;  Active (Kp ≥ 6) → 1.0
 *   (Linear stand-in for the exponential Kp dependence of Meredith et al. 2003.)
 *
 * Inner belt protons (CRAND source):
 *   innerFlux = 0.65  (constant — galactic cosmic ray flux varies little on the
 *   timescales of geomagnetic storms; slight solar-cycle modulation is deferred.)
 *
 * Slot region (L = 2–3):
 *   slotFlux = 0  for Dst > −100 nT  (slot normally empty)
 *   slotFlux = clamp((|Dst| − 100) / 100, 0, 0.6)  for Dst ≤ −100 nT
 *   (Baker et al. 2004: slot fills transiently during extreme storms.)
 *
 * @param {number} kp   Kp index in [0, 9]
 * @param {number} dst  Dst index in nT (negative during storms)
 * @returns {{ innerFlux: number, outerFlux: number, slotFlux: number }}
 */
export function computeBeltFlux(kp, dst) {
  const innerFlux = 0.65;
  const outerFlux = Math.min(1, Math.max(0, 0.1 + 0.15 * kp));
  const slotFlux  = dst < -100
    ? Math.min(0.6, Math.max(0, (-dst - 100) / 100))
    : 0;
  return { innerFlux, outerFlux, slotFlux };
}
