/**
 * Solar wind external magnetic field model.
 *
 * External field is computed by the Tsyganenko T89c empirical model, which
 * covers all major current systems: magnetotail, ring current, closure currents,
 * and Chapman-Ferraro + Birkeland currents. T89 is parameterized by a single
 * Kp index (0–6+) mapped from the solar wind parameters.
 *
 * The magnetopause boundary (Shue 1998) is retained as an outer confinement
 * envelope — T89 does not enforce a hard boundary cutoff.
 *
 * References:
 * - Tsyganenko N.A., Planet. Space Sci., v.37, pp.5-20, 1989 (T89 model)
 * - Shue et al. 1997, JGR 102(A5):9497-9511
 * - Shue et al. 1998, JGR 103(A8):17691-17700
 */

import { EARTH_RADIUS_KM } from '../utils/constants.js';
import { t89 } from './t89.js';

const Re = EARTH_RADIUS_KM;

// Proton mass in kg
const PROTON_MASS_KG = 1.6726219e-27;

/**
 * Compute solar wind dynamic pressure from speed and density.
 *
 * @param {number} vSw - Solar wind speed in km/s
 * @param {number} nSw - Solar wind density in cm^-3
 * @returns {number} Dynamic pressure in nPa
 */
export function computeDynamicPressure(vSw, nSw) {
  // Convert: km/s → m/s, cm^-3 → m^-3
  const v_ms = vSw * 1e3;
  const n_m3 = nSw * 1e6;
  // Dp = 0.5 * n * m_p * v^2, result in Pa, convert to nPa
  return 0.5 * n_m3 * PROTON_MASS_KG * v_ms * v_ms * 1e9;
}

/**
 * Compute magnetopause standoff distance r0 (Shue 1998).
 *
 * @param {number} Dp - Dynamic pressure in nPa
 * @param {number} imfBz - IMF Bz in nT (negative = southward)
 * @returns {number} Standoff distance in Earth radii
 */
export function computeStandoffDistance(Dp, imfBz) {
  return (10.22 + 1.29 * Math.tanh(0.184 * (imfBz + 8.14))) * Math.pow(Dp, -1 / 6.6);
}

/**
 * Compute magnetopause distance at a given angle from the Sun-Earth line.
 *
 * @param {number} thetaSun - Angle from Sun-Earth line in radians [0, pi]
 * @param {number} Dp - Dynamic pressure in nPa
 * @param {number} imfBz - IMF Bz in nT
 * @returns {number} Magnetopause distance in Earth radii
 */
export function computeMagnetopauseDistance(thetaSun, Dp, imfBz) {
  const r0 = computeStandoffDistance(Dp, imfBz);
  const alpha = (0.58 - 0.007 * imfBz) * (1 + 0.024 * Math.log(Dp));
  const cosTheta = Math.cos(Math.max(0, Math.min(Math.PI * 0.999, thetaSun)));
  return r0 * Math.pow(2 / (1 + cosTheta), alpha);
}

/**
 * Map solar wind parameters to a T89 Kp level (iopt 1-7).
 *
 * Kp is primarily driven by Dst (geomagnetic disturbance index).
 * Kp ≈ -Dst/15 maps our storm presets sensibly:
 *   Quiet  (Dst=0):    Kp=0 → iopt=1
 *   Moderate (Dst=-50): Kp≈3 → iopt=4
 *   Severe (Dst=-150):  Kp=6+ → iopt=7
 *
 * A small dynamic pressure contribution is added for high-speed streams.
 *
 * @param {object} params - { dst, vSw, nSw }
 * @returns {number} iopt (1-7)
 */
export function solarWindToKp({ dst, vSw, nSw }) {
  const Dp = computeDynamicPressure(vSw, nSw);
  const kpFromDst = Math.min(6, Math.max(0, -dst / 15));
  const kpFromDp  = Math.min(2, Math.max(0, (Dp - 2) / 1.5));
  const kp = Math.min(6, kpFromDst + 0.2 * kpFromDp);
  return Math.min(7, Math.max(1, Math.round(kp) + 1));
}

/**
 * Transform a position from scene Cartesian (km) into GSM-like frame.
 *
 * Scene coords: Y-up (north pole). Sun direction rotated by sunLonRad in the XZ plane.
 * GSM-like: x_gsm = sunward, z_gsm = northward (Y in scene), y_gsm = duskward.
 *
 * @param {number} x - Scene X in km
 * @param {number} y - Scene Y in km (northward)
 * @param {number} z - Scene Z in km
 * @param {number} sunLonRad - Sun longitude in radians
 * @returns {number[]} [x_gsm, y_gsm, z_gsm] in km
 */
export function toGSM(x, y, z, sunLonRad) {
  const cosL = Math.cos(sunLonRad);
  const sinL = Math.sin(sunLonRad);
  const xGsm = x * cosL + z * sinL;
  const yGsm = -x * sinL + z * cosL;
  const zGsm = y; // scene Y = GSM Z (northward)
  return [xGsm, yGsm, zGsm];
}

/**
 * Transform a vector from GSM-like frame back to scene Cartesian.
 *
 * @param {number} bxGsm - GSM X component
 * @param {number} byGsm - GSM Y component
 * @param {number} bzGsm - GSM Z component
 * @param {number} sunLonRad - Sun longitude in radians
 * @returns {number[]} [Bx, By, Bz] in scene frame
 */
export function fromGSM(bxGsm, byGsm, bzGsm, sunLonRad) {
  const cosL = Math.cos(sunLonRad);
  const sinL = Math.sin(sunLonRad);
  const Bx = bxGsm * cosL - byGsm * sinL;
  const Bz = bxGsm * sinL + byGsm * cosL;
  const By = bzGsm; // GSM Z → scene Y
  return [Bx, By, Bz];
}

/**
 * Compute how far inside the magnetopause a point is.
 *
 * Returns 1.0 deep inside, 0.0 well outside, smooth transition at boundary.
 *
 * @param {number} xKm - Scene X in km
 * @param {number} yKm - Scene Y in km
 * @param {number} zKm - Scene Z in km
 * @param {object} solarWindParams - { vSw, nSw, imfBz, dst, sunLonRad, enabled }
 * @returns {number} 0 to 1
 */
export function insideMagnetopause(xKm, yKm, zKm, solarWindParams) {
  if (!solarWindParams?.enabled) return 1.0;

  const { imfBz, sunLonRad } = solarWindParams;
  const Dp = computeDynamicPressure(solarWindParams.vSw, solarWindParams.nSw);

  const [xGsm, yGsm, zGsm] = toGSM(xKm, yKm, zKm, sunLonRad);

  const rRe = Math.sqrt(xKm * xKm + yKm * yKm + zKm * zKm) / Re;
  if (rRe < 0.1) return 1.0;

  const rGsm = Math.sqrt(xGsm * xGsm + yGsm * yGsm + zGsm * zGsm);
  const thetaSun = Math.acos(Math.max(-1, Math.min(1, xGsm / rGsm)));
  const rMp = computeMagnetopauseDistance(thetaSun, Dp, imfBz);

  const transitionWidth = 0.5; // Re
  return smoothstep(rMp - rRe, -transitionWidth, transitionWidth);
}

/**
 * Smooth step function (cubic Hermite interpolation).
 */
function smoothstep(x, edge0, edge1) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Compute the external magnetic field at a point using the T89 model.
 *
 * @param {number} xKm - Scene X in km
 * @param {number} yKm - Scene Y in km
 * @param {number} zKm - Scene Z in km
 * @param {object} solarWindParams - { vSw, nSw, imfBz, dst, sunLonRad, ps, enabled }
 * @returns {number[]} [Bx, By, Bz] external field in nT (scene frame)
 */
export function computeExternalB(xKm, yKm, zKm, solarWindParams) {
  if (!solarWindParams?.enabled) return [0, 0, 0];

  const { sunLonRad, ps = 0 } = solarWindParams;
  const iopt = solarWindToKp(solarWindParams);

  // Convert scene km → GSM Earth radii (T89 expects Re)
  const [xGsm, yGsm, zGsm] = toGSM(xKm, yKm, zKm, sunLonRad);
  const xRe = xGsm / Re;
  const yRe = yGsm / Re;
  const zRe = zGsm / Re;

  // T89 external field in nT (GSM frame)
  const [bxGsm, byGsm, bzGsm] = t89(iopt, ps, xRe, yRe, zRe);

  // Transform back to scene Cartesian frame
  return fromGSM(bxGsm, byGsm, bzGsm, sunLonRad);
}
