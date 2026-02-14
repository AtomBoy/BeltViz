/**
 * Coordinate transforms between spherical and Cartesian systems.
 *
 * Spherical: (r, theta, phi) where theta = colatitude [0, pi], phi = east longitude [0, 2pi]
 * Cartesian: Y-up convention matching Three.js:
 *   x = r * sin(theta) * cos(phi)   (through lat=0, lon=0)
 *   y = r * cos(theta)              (through north pole)
 *   z = r * sin(theta) * sin(phi)   (through lat=0, lon=90E)
 */

export function sphericalToCartesian(r, theta, phi) {
  const sinT = Math.sin(theta);
  return [
    r * sinT * Math.cos(phi),
    r * Math.cos(theta),
    r * sinT * Math.sin(phi),
  ];
}

export function cartesianToSpherical(x, y, z) {
  const r = Math.sqrt(x * x + y * y + z * z);
  const theta = Math.acos(Math.min(1, Math.max(-1, y / r))); // clamp for numerical safety
  const phi = Math.atan2(z, x);
  return [r, theta, phi < 0 ? phi + 2 * Math.PI : phi];
}

/**
 * Convert magnetic field from spherical components (Br, Btheta, Bphi)
 * to Cartesian (Bx, By, Bz) in the Y-up scene frame.
 */
export function bFieldToCartesian(Br, Bt, Bp, theta, phi) {
  const sinT = Math.sin(theta);
  const cosT = Math.cos(theta);
  const sinP = Math.sin(phi);
  const cosP = Math.cos(phi);

  // Br is radial outward, Bt is southward (increasing theta), Bp is eastward
  const Bx = Br * sinT * cosP + Bt * cosT * cosP - Bp * sinP;
  const By = Br * cosT - Bt * sinT;
  const Bz = Br * sinT * sinP + Bt * cosT * sinP + Bp * cosP;

  return [Bx, By, Bz];
}
