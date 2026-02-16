/**
 * Solar wind external magnetic field model.
 *
 * Simplified but physically-motivated model with four components:
 * 1. Magnetopause boundary (Shue 1998) — confines field inside magnetosphere
 * 2. Chapman-Ferraro compression — enhances dayside field
 * 3. Tail current sheet — stretches nightside into magnetotail
 * 4. Ring current — uniform southward field during storms (Dst)
 *
 * All computations in Cartesian km coordinates with configurable Sun direction.
 *
 * References:
 * - Shue et al. 1997, JGR 102(A5):9497-9511
 * - Shue et al. 1998, JGR 103(A8):17691-17700
 */

import { EARTH_RADIUS_KM } from '../utils/constants.js';

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
 * Compute magnetopause flaring parameter alpha (Shue 1998).
 *
 * @param {number} Dp - Dynamic pressure in nPa
 * @param {number} imfBz - IMF Bz in nT
 * @returns {number} Flaring parameter (dimensionless)
 */
export function computeFlaringParameter(Dp, imfBz) {
  return (0.58 - 0.007 * imfBz) * (1 + 0.024 * Math.log(Dp));
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
  const alpha = computeFlaringParameter(Dp, imfBz);
  const cosTheta = Math.cos(Math.max(0, Math.min(Math.PI * 0.999, thetaSun)));
  return r0 * Math.pow(2 / (1 + cosTheta), alpha);
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
  // Sun direction in scene XZ plane: [cos(lon), 0, sin(lon)]
  // x_gsm = dot(pos, sunDir) = x*cos + z*sin
  // y_gsm = dot(pos, duskDir) where duskDir = [-sin(lon), 0, cos(lon)]
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
  // Inverse rotation (transpose of the rotation matrix in toGSM)
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

  // Distance from Earth in Re
  const rRe = Math.sqrt(xKm * xKm + yKm * yKm + zKm * zKm) / Re;
  if (rRe < 0.1) return 1.0; // Near origin, always inside

  // Angle from Sun-Earth line (in GSM frame, x_gsm is sunward)
  const rGsm = Math.sqrt(xGsm * xGsm + yGsm * yGsm + zGsm * zGsm);
  const thetaSun = Math.acos(Math.max(-1, Math.min(1, xGsm / rGsm)));

  // Magnetopause distance at this angle
  const rMp = computeMagnetopauseDistance(thetaSun, Dp, imfBz);

  // Smooth transition over ~0.5 Re at boundary
  const transitionWidth = 0.5; // Re
  const distFromBoundary = rMp - rRe;
  return smoothstep(distFromBoundary, -transitionWidth, transitionWidth);
}

/**
 * Smooth step function (cubic Hermite interpolation).
 * Returns 0 when x <= edge0, 1 when x >= edge1, smooth between.
 */
function smoothstep(x, edge0, edge1) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/**
 * Compute the external magnetic field at a point in scene Cartesian coordinates.
 *
 * Sum of Chapman-Ferraro compression, tail current sheet, and ring current.
 * Result is in nT, scene Cartesian frame.
 *
 * @param {number} xKm - Scene X in km
 * @param {number} yKm - Scene Y in km
 * @param {number} zKm - Scene Z in km
 * @param {object} solarWindParams - { vSw, nSw, imfBz, dst, sunLonRad, enabled }
 * @returns {number[]} [Bx, By, Bz] external field in nT (scene frame)
 */
export function computeExternalB(xKm, yKm, zKm, solarWindParams) {
  if (!solarWindParams?.enabled) return [0, 0, 0];

  const { imfBz, dst, sunLonRad } = solarWindParams;
  const Dp = computeDynamicPressure(solarWindParams.vSw, solarWindParams.nSw);

  const [xGsm, yGsm, zGsm] = toGSM(xKm, yKm, zKm, sunLonRad);

  // Distance from Earth
  const rKm = Math.sqrt(xKm * xKm + yKm * yKm + zKm * zKm);
  const rRe = rKm / Re;

  if (rRe < 0.1) return [0, 0, 0]; // Avoid singularity near origin

  // GSM distance and angle
  const rGsm = Math.sqrt(xGsm * xGsm + yGsm * yGsm + zGsm * zGsm);
  const thetaSun = Math.acos(Math.max(-1, Math.min(1, xGsm / rGsm)));

  // === Component 1: Chapman-Ferraro compression (dayside) ===
  // The CF field is generated by magnetopause currents. It's strongest near the
  // magnetopause and negligible at Earth's surface. Modeled as growing outward
  // as (r/r0)^2, so at Earth's surface (r/r0 ≈ 0.1) the contribution is ~1%
  // of the peak, matching the image dipole fall-off behavior.
  const r0 = computeStandoffDistance(Dp, imfBz);
  const b0Cf = 30 * Math.pow(Dp / 2, 1 / 3); // nT at magnetopause nose
  const cosThetaSun = Math.cos(thetaSun);
  const rFactor = Math.min(1, (rRe / r0) * (rRe / r0)); // (r/r0)^2, capped at 1
  const cfStrength = b0Cf * rFactor * Math.max(0, cosThetaSun) * Math.max(0, cosThetaSun);
  // B_cf is along the dipole axis (GSM Z = northward)
  const bCfGsm = [0, 0, cfStrength];

  // === Component 2: Tail current sheet (nightside) ===
  const D = 3 * Re; // Current sheet half-thickness in km
  const b0Tail = 35 * Math.pow(Dp / 2, 0.5) * (1 + Math.abs(dst) / 80); // nT
  // Ramp on for nightside: f(x_gsm) approaches 1 for x_gsm << -3 Re
  const tailRamp = 0.5 * (1 - Math.tanh((xGsm / Re + 3) / 2));
  // Lobe field: Bx = B0 * tanh(z_gsm / D) pointing sunward in north lobe
  const tanhZ = Math.tanh(zGsm / D);
  const coshZ = Math.cosh(zGsm / D);
  const bTailX = b0Tail * tanhZ * tailRamp;
  // Vertical convergence: Bz contribution
  const rCyl = Math.sqrt(xGsm * xGsm + yGsm * yGsm);
  const bTailZ = (rCyl > 0.1 * Re)
    ? -b0Tail * (D / (rCyl * coshZ * coshZ)) * tailRamp
    : 0;
  const bTailGsm = [bTailX, 0, bTailZ];

  // === Component 3: Ring current (storm-time) ===
  // Uniform southward field: Dst (negative during storms) weakens the dipole
  // The 0.8 factor accounts for induced currents
  const bRingZ = dst * 0.8; // nT, negative Dst → southward (negative Z_gsm)
  const bRingGsm = [0, 0, bRingZ];

  // Sum in GSM frame
  const bExtGsm = [
    bCfGsm[0] + bTailGsm[0] + bRingGsm[0],
    bCfGsm[1] + bTailGsm[1] + bRingGsm[1],
    bCfGsm[2] + bTailGsm[2] + bRingGsm[2],
  ];

  // Transform back to scene frame
  return fromGSM(bExtGsm[0], bExtGsm[1], bExtGsm[2], sunLonRad);
}
