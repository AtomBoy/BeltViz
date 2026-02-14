// IGRF reference radius in km
export const EARTH_RADIUS_KM = 6371.2;

// Scene uses unit sphere for Earth
export const EARTH_RADIUS_SCENE = 1.0;

// Conversion factor: scene = km / EARTH_RADIUS_KM
export const KM_TO_SCENE = 1.0 / EARTH_RADIUS_KM;

// Earth axial tilt in radians (23.44 degrees)
export const AXIAL_TILT = 23.44 * Math.PI / 180;
