import * as THREE from 'three';

/**
 * Create clipping planes for isosurface cross-section views.
 *
 * @returns {{ equatorial: THREE.Plane, meridional: THREE.Plane, getActivePlanes: function }}
 */
export function createClippingPlanes() {
  // Equatorial plane: clips above y=0 (shows southern hemisphere)
  const equatorial = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

  // Meridional plane: rotatable slice at a configurable longitude
  const meridional = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);

  /**
   * Update the meridional plane normal to slice at a given longitude angle.
   * @param {number} angleDeg - Longitude in degrees (0-360)
   */
  function setMeridionalAngle(angleDeg) {
    const rad = angleDeg * (Math.PI / 180);
    meridional.normal.set(Math.cos(rad), 0, Math.sin(rad));
  }

  /**
   * Get the array of currently active clipping planes.
   * @param {boolean} useEquatorial
   * @param {boolean} useMeridional
   * @returns {THREE.Plane[]}
   */
  function getActivePlanes(useEquatorial, useMeridional) {
    const planes = [];
    if (useEquatorial) planes.push(equatorial);
    if (useMeridional) planes.push(meridional);
    return planes;
  }

  return { equatorial, meridional, setMeridionalAngle, getActivePlanes };
}
