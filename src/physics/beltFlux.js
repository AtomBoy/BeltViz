/**
 * src/physics/beltFlux.js
 *
 * Empirical model mapping solar wind conditions (Kp, Dst) to relative particle
 * flux in the inner, outer, and storage (third) Van Allen radiation belts.
 *
 * All functions are pure with no DOM or Three.js dependencies.
 *
 * References:
 *   - Meredith et al. (2003), JGR 108(A6), 1248, doi:10.1029/2002JA009764
 *     Relativistic electron flux at geostationary orbit scales roughly
 *     exponentially with Kp; the linear approximation here gives the same
 *     trend for visual purposes.
 *   - Baker et al. (2004), Nature 432, 878–881, doi:10.1038/nature03116
 *     Slot region (L = 2–3) fills transiently during extreme geomagnetic
 *     storms (Dst < −100 nT).
 *   - Baker et al. (2013), Science 340, 186–190, doi:10.1126/science.1233518
 *     Discovery of a long-lived third radiation belt ("storage ring") at
 *     L ≈ 3.0–3.5 Re during geomagnetic storms; ultra-relativistic electrons
 *     >2 MeV trapped stably because VLF scattering is suppressed there.
 *   - Shprits et al. (2013), Nature Physics 9, 699–703, doi:10.1038/nphys2760
 *     Mechanism for unusual stable trapping of ultra-relativistic electrons;
 *     ULF wave radial transport drives inward diffusion while EMIC and VLF
 *     waves are absent at these L-shells during the recovery phase.
 *   - Ganushkina et al. (2011), JGR 116, A09234, doi:10.1029/2010JA016376
 *     Observed outer belt boundary expands to L ≈ 5.5–6.0 at Kp ≥ 5–6.
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
 * Storage belt / third belt (L ≈ 2.8–3.5 Re):
 *   storageBeltFlux = dstFactor × kpFactor
 *   where dstFactor = clamp((|Dst| − 50) / 100, 0, 1)  for Dst < −50 nT
 *         kpFactor  = clamp((Kp − 2.5) / 3.5, 0, 1)
 *   (Baker et al. 2013: forms during storms with Dst < −50 nT and Kp ≥ 3;
 *    Shprits et al. 2013: ultra-relativistic electrons trapped by ULF radial
 *    diffusion while VLF scattering is absent at these L-shells.)
 *
 * @param {number} kp   Kp index in [0, 9]
 * @param {number} dst  Dst index in nT (negative during storms)
 * @returns {{ innerFlux: number, outerFlux: number, slotFlux: number, storageBeltFlux: number }}
 */
export function computeBeltFlux(kp, dst) {
  const innerFlux = 0.65;
  const outerFlux = Math.min(1, Math.max(0, 0.1 + 0.15 * kp));
  const slotFlux  = dst < -100
    ? Math.min(0.6, Math.max(0, (-dst - 100) / 100))
    : 0;

  // Third (storage) belt: dual threshold on both Dst and Kp.
  // Invisible at quiet conditions; emerges gradually above Dst=−50 nT and Kp=2.5.
  const dstFactor = dst < -50 ? Math.min(1, (-dst - 50) / 100) : 0;
  const kpFactor  = Math.min(1, Math.max(0, (kp - 2.5) / 3.5));
  const storageBeltFlux = dstFactor * kpFactor;

  return { innerFlux, outerFlux, slotFlux, storageBeltFlux };
}
