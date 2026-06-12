/**
 * Default values for the main `params` object.
 *
 * Lives in its own pure-data module (no DOM, no Three.js) so that:
 *   - main.js can clone it as the runtime params object
 *   - tests/urlParams.test.js can verify the URL DEFAULTS table never
 *     drifts from these values (the two must agree or shared URLs break)
 *
 * Keep in sync with the DEFAULTS table in src/ui/urlParams.js — the drift
 * guard test in tests/urlParams.test.js fails loudly if they diverge.
 */
export const DEFAULT_PARAMS = {
  maxDegree: 13, // start with highest IGRF-14 degree.
  numLatitudes: 4,
  numLongitudes: 8,
  tubeRadius: 0.008,
  showFieldLines: true,
  autoRotate: false,
  // Isosurface params
  showIsosurfaces: false,
  isoMode: 'lShell', // 'lShell' or 'fieldStrength'
  isoResolution: 64,
  isoOpacity: 0.2,
  isoLevels: {},
  // Radiation belt params
  showInnerBelt: false,
  showOuterBelt: false,
  beltOpacity: 0.85,
  // Clipping params
  clipEquatorial: false,
  clipMeridional: false,
  clipMeridionalAngle: 0,
  // Solar wind params
  solarWindEnabled: true,
  solarWindSpeed: 400,
  solarWindDensity: 5,
  imfBy: 0,             // IMF By (nT GSM) — dawn-dusk field component, T01 input
  imfBz: 0,
  dst: 0,
  g1: 0,                // T01 storm-history index G1 (Qin-Denton pre-computed)
  g2: 0,                // T01 storm-history index G2 (Qin-Denton pre-computed)
  sunLongitude: 0,      // internal — computed from datetime, not a user slider
  sunDeclination: 0,    // internal — computed from datetime
  showMagnetopause: false,
  showBowShock: false,
  colorByB: false,
  // Date & Time params (internal — driven by timeline, not lil-gui)
  datetimeString: '2025-11-06T00:00',
  // Particle system
  particles: {
    enabled:       false,  // off by default — user opts in
    showElectrons: true,   // show electron population (blue, eastward drift)
    showProtons:   true,   // show proton population (orange, westward drift)
    count:         800,    // max simultaneous particles
    energyMeV:     1.0,   // representative electron energy (MeV)
  },
  // Aurora oval
  aurora: {
    enabled: false,
    opacity: 1.0,
  },
  // Satellite swarm
  satellites: {
    enabled:     false,
    showLeo:     true,
    showMeo:     true,
    showGeo:     true,
    showHeo:     true,
    showOther:   false,
    notableOnly: true,
  },
};
