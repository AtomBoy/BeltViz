/**
 * Satellite position coordinate conversion.
 *
 * Converts geographic lat/lon/alt to the physics coordinate system
 * used by IGRF evaluation. Architecture ready for future satellite.js
 * (SGP4/TLE) integration.
 */

import { EARTH_RADIUS_KM } from '../utils/constants.js';

/**
 * Convert geographic position to physics coordinates.
 *
 * @param {number} latDeg - Geographic latitude in degrees (-90 to 90)
 * @param {number} lonDeg - Geographic longitude in degrees (-180 to 180)
 * @param {number} altitudeKm - Altitude above Earth's surface in km
 * @returns {{ x, y, z, r, theta, phi, altitudeKm, latDeg, lonDeg }}
 *   Cartesian (km, Y-up) and spherical (colatitude) coordinates
 */
export function geographicToPhysicsPosition(latDeg, lonDeg, altitudeKm) {
  const r = EARTH_RADIUS_KM + altitudeKm;
  const theta = (90 - latDeg) * (Math.PI / 180); // colatitude
  let phi = lonDeg * (Math.PI / 180); // east longitude
  if (phi < 0) phi += 2 * Math.PI;

  // Y-up Cartesian (matching coordinates.js convention)
  const sinT = Math.sin(theta);
  const x = r * sinT * Math.cos(phi);
  const y = r * Math.cos(theta);
  const z = r * sinT * Math.sin(phi);

  return { x, y, z, r, theta, phi, altitudeKm, latDeg, lonDeg };
}
