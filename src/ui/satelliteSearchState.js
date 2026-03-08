/**
 * src/ui/satelliteSearchState.js
 *
 * Pure state management for satellite search and filtering.
 * No DOM — designed to be easily testable and decoupled from rendering.
 */

/**
 * Filter a satellite catalog array based on search query, orbit class filters,
 * and notable-only toggle.
 *
 * @param {Array}    satellites   - full catalog from satellites.json
 * @param {string}   query        - case-insensitive search string (empty = no filter)
 * @param {string[]} orbitClasses - array of enabled orbit classes (e.g. ['leo','meo'])
 * @param {boolean}  notableOnly  - if true, only show satellites with notable=true
 * @returns {Array} filtered satellite objects (references to originals, not copies)
 */
export function filterSatellites(satellites, query, orbitClasses, notableOnly) {
  const q = query.trim().toLowerCase();
  const classSet = new Set(orbitClasses);

  return satellites.filter(sat => {
    // Orbit class filter
    if (!classSet.has(sat.orbitClass)) return false;
    // Notable filter
    if (notableOnly && !sat.notable) return false;
    // Text search: match name or NORAD ID
    if (q) {
      const nameMatch  = sat.name.toLowerCase().includes(q);
      const idMatch    = String(sat.id).includes(q);
      if (!nameMatch && !idMatch) return false;
    }
    return true;
  });
}

/**
 * Get the display label for an orbit class.
 * @param {string} orbitClass
 * @returns {string}
 */
export function orbitClassLabel(orbitClass) {
  const labels = {
    leo:   'LEO',
    meo:   'MEO',
    geo:   'GEO',
    heo:   'HEO',
    other: 'OTHER',
  };
  return labels[orbitClass] ?? orbitClass.toUpperCase();
}

/**
 * Find a satellite's global index by NORAD ID.
 * @param {Array}  satellites
 * @param {number} noradId
 * @returns {number} index, or -1 if not found
 */
export function findSatelliteIndex(satellites, noradId) {
  return satellites.findIndex(s => s.id === noradId);
}

/**
 * Compute the orbital period from TLE line 2 (in minutes).
 * @param {string} line2
 * @returns {number} period in minutes
 */
export function periodFromLine2(line2) {
  const meanMotion = parseFloat(line2.substring(52, 63));
  if (!isFinite(meanMotion) || meanMotion <= 0) return 0;
  return 1440 / meanMotion;
}
