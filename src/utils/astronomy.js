/**
 * Low-precision solar and lunar position from a JavaScript Date.
 *
 * Sun: ~1 degree accuracy using simplified Meeus (Astronomical Algorithms,
 * Chapter 25 low-precision method). Adequate for a visualization tool.
 *
 * Moon: ~2 degree accuracy using the first-order lunar theory
 * (Meeus Chapter 47, principal terms). Adequate for visualization.
 *
 * All positions are returned as geographic coordinates:
 *   longitudeRad — sub-solar/sub-lunar geographic east longitude [-π, π]
 *   declinationRad — geographic latitude of the sub-point (= declination) [-π/2, π/2]
 *
 * The scene's coordinate convention (Y-up, phi = east longitude) means:
 *   x = cos(dec) * cos(lon) * distance
 *   y = sin(dec) * distance
 *   z = cos(dec) * sin(lon) * distance
 */

const TWO_PI = 2 * Math.PI;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function normalizeDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

/**
 * Convert a JavaScript Date to a Julian Date (JD).
 */
export function julianDate(date) {
  return date.getTime() / 86400000 + 2440587.5;
}

/**
 * Julian centuries from J2000.0 epoch.
 */
function julianCenturies(jd) {
  return (jd - 2451545.0) / 36525.0;
}

/**
 * Greenwich Mean Sidereal Time in degrees.
 */
function gmstDeg(jd) {
  const T = julianCenturies(jd);
  // IAU formula (degrees)
  const gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000;
  return normalizeDeg(gmst);
}

/**
 * Compute the Sun's position for a given JavaScript Date.
 *
 * @param {Date} date
 * @returns {{ declinationRad: number, longitudeRad: number }}
 *   declinationRad — sub-solar latitude (= solar declination)
 *   longitudeRad   — sub-solar geographic east longitude [-π, π]
 */
export function solarPosition(date) {
  const jd = julianDate(date);
  const T = julianCenturies(jd);

  // Geometric mean longitude of the Sun (degrees)
  const L0 = normalizeDeg(280.46646 + 36000.76983 * T + 0.0003032 * T * T);

  // Mean anomaly of the Sun (degrees)
  const M = normalizeDeg(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mrad = toRad(M);

  // Equation of center (degrees)
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.sin(3 * Mrad);

  // Sun's true ecliptic longitude (degrees)
  const sunLon = normalizeDeg(L0 + C);

  // Obliquity of the ecliptic (degrees)
  const epsilon = 23.439291111 - 0.013004167 * T - 0.0000001639 * T * T + 0.0000005036 * T * T * T;

  const sunLonRad = toRad(sunLon);
  const epsilonRad = toRad(epsilon);

  // Sun's right ascension and declination
  const sinLon = Math.sin(sunLonRad);
  const cosLon = Math.cos(sunLonRad);
  const sinEps = Math.sin(epsilonRad);
  const cosEps = Math.cos(epsilonRad);

  const ra = Math.atan2(cosEps * sinLon, cosLon); // radians [-π, π]
  const dec = Math.asin(sinEps * sinLon);          // radians

  // Geographic sub-solar longitude = RA - GMST (converted to radians)
  const gmstRad = toRad(gmstDeg(jd));
  let geoLon = ra - gmstRad;
  // Normalize to [-π, π]
  geoLon = ((geoLon + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;

  return { declinationRad: dec, longitudeRad: geoLon };
}

/**
 * Compute the Moon's position for a given JavaScript Date.
 *
 * @param {Date} date
 * @returns {{ declinationRad: number, longitudeRad: number, distanceEarthRadii: number }}
 *   declinationRad    — sub-lunar latitude (= lunar declination)
 *   longitudeRad      — sub-lunar geographic east longitude [-π, π]
 *   distanceEarthRadii — distance from Earth center in Earth radii
 */
export function lunarPosition(date) {
  const jd = julianDate(date);
  const T = julianCenturies(jd);

  // Moon's mean elements (degrees)
  const Lp = normalizeDeg(218.3165 + 481267.8813 * T);  // mean longitude
  const M  = normalizeDeg(357.5291 + 35999.0503  * T);  // Sun mean anomaly
  const Mp = normalizeDeg(134.9634 + 477198.8676 * T);  // Moon mean anomaly
  const D  = normalizeDeg(297.8502 + 445267.1115 * T);  // mean elongation
  const F  = normalizeDeg( 93.2720 + 483202.0175 * T);  // argument of latitude

  const MpR = toRad(Mp);
  const MR  = toRad(M);
  const DR  = toRad(D);
  const FR  = toRad(F);

  // Ecliptic longitude (degrees) — principal perturbations (Meeus Table 47.A)
  const dLon =
    6.2888  * Math.sin(MpR) +
    1.2740  * Math.sin(2 * DR - MpR) +
    0.6583  * Math.sin(2 * DR) +
    0.2136  * Math.sin(2 * MpR) -
    0.1851  * Math.sin(MR) -
    0.1143  * Math.sin(2 * FR) +
    0.0588  * Math.sin(2 * DR - 2 * MpR) +
    0.0572  * Math.sin(2 * DR - MR - MpR) +
    0.0533  * Math.sin(2 * DR + MpR);

  const moonLonDeg = normalizeDeg(Lp + dLon);

  // Ecliptic latitude (degrees) — principal terms
  const dLat =
    5.1282  * Math.sin(FR) +
    0.2806  * Math.sin(MpR + FR) +
    0.2777  * Math.sin(MpR - FR) +
    0.1733  * Math.sin(2 * DR - FR) -
    0.0554  * Math.sin(2 * DR - MpR + FR) -
    0.0463  * Math.sin(2 * DR - MpR - FR);

  // Distance (km) — principal terms
  const distKm =
    385001 -
    20905 * Math.cos(MpR) -
     3699 * Math.cos(2 * DR - MpR) -
     2956 * Math.cos(2 * DR) -
      570 * Math.cos(2 * MpR) +
      246 * Math.cos(2 * MpR - 2 * DR);

  const EARTH_RADIUS_KM = 6371.2;
  const distRe = distKm / EARTH_RADIUS_KM;

  // Convert ecliptic (lambda, beta) to equatorial (RA, Dec)
  const epsilon = 23.439291111 - 0.013004167 * T;
  const lambdaRad = toRad(moonLonDeg);
  const betaRad   = toRad(dLat);
  const epsRad    = toRad(epsilon);

  const sinLam = Math.sin(lambdaRad);
  const cosLam = Math.cos(lambdaRad);
  const sinBet = Math.sin(betaRad);
  const cosBet = Math.cos(betaRad);
  const sinEps = Math.sin(epsRad);
  const cosEps = Math.cos(epsRad);

  const ra  = Math.atan2(sinLam * cosEps - Math.tan(betaRad) * sinEps, cosLam);
  const dec = Math.asin(sinBet * cosEps + cosBet * sinEps * sinLam);

  // Geographic sub-lunar longitude = RA - GMST
  const gmstRad = toRad(gmstDeg(jd));
  let geoLon = ra - gmstRad;
  geoLon = ((geoLon + Math.PI) % TWO_PI + TWO_PI) % TWO_PI - Math.PI;

  return { declinationRad: dec, longitudeRad: geoLon, distanceEarthRadii: distRe };
}
