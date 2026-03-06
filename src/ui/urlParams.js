/**
 * src/ui/urlParams.js
 *
 * Bidirectional URL hash ↔ params sync.
 *
 * State is stored in the URL fragment (#key=val&...) so no server request is
 * triggered on load or navigation. Only non-default values are written, keeping
 * URLs short. Reading is safe: malformed values are ignored (NaN → skip).
 *
 * Key naming convention:
 *   - Short readable keys to keep shared URLs manageable
 *   - Nested objects (particles.*, aurora.*) flattened: pEnabled, pCount, etc.
 *   - isoLevels serialized as comma-separated active level keys: "8,10"
 */

// Default values — mirrors src/main.js `params` object.
// Used to skip writing params that haven't changed from defaults.
const DEFAULTS = {
  maxDegree:           13,
  numLatitudes:        4,
  numLongitudes:       8,
  tubeRadius:          0.008,
  showFieldLines:      true,
  autoRotate:          false,
  datetimeString:      '2025-11-06T00:00',
  showIsosurfaces:     false,
  isoMode:             'lShell',
  isoResolution:       64,
  isoOpacity:          0.2,
  showInnerBelt:       false,
  showOuterBelt:       false,
  beltOpacity:         0.15,
  clipEquatorial:      false,
  clipMeridional:      false,
  clipMeridionalAngle: 0,
  showSatellite:       false,
  satLatitude:         0,
  satLongitude:        0,
  satAltitude:         400,
  solarWindEnabled:    true,
  solarWindSpeed:      400,
  solarWindDensity:    5,
  imfBy:               0,
  imfBz:               0,
  dst:                 0,
  showMagnetopause:    false,
  // nested — particles
  pEnabled:            false,
  pShowElec:           true,
  pShowProt:           true,
  pCount:              800,
  pEnergy:             1.0,
  // nested — aurora
  aEnabled:            false,
  aOpacity:            1.0,
  // isoLevels default active set (L-shell mode defaults: L=2,4,6,10 on — matches initIsoLevels())
  isoLevels:           '2,4,6,10',
};

/**
 * Parse the current URL hash and return param overrides + isoLevels string.
 *
 * Only keys present in the hash are returned — missing keys leave params at
 * their existing defaults. Numeric values that parse as NaN are silently skipped.
 *
 * @returns {{ params: object, isoLevels: string|null }}
 */
export function readFromUrl() {
  const hash = window.location.hash.slice(1);
  if (!hash) return { params: {}, isoLevels: null };

  const sp = new URLSearchParams(hash);
  const out = {};

  const num  = (k) => { const v = Number(sp.get(k)); return isNaN(v) ? null : v; };
  const bool = (k) => sp.get(k) === 'true';
  const str  = (k) => sp.get(k);

  // Field lines
  if (sp.has('maxDegree'))   { const v = num('maxDegree');   if (v !== null) out.maxDegree   = v; }
  if (sp.has('numLat'))      { const v = num('numLat');      if (v !== null) out.numLatitudes = v; }
  if (sp.has('numLon'))      { const v = num('numLon');      if (v !== null) out.numLongitudes = v; }
  if (sp.has('tubeRadius'))  { const v = num('tubeRadius');  if (v !== null) out.tubeRadius  = v; }
  if (sp.has('showFL'))      out.showFieldLines = bool('showFL');
  if (sp.has('autoRotate'))  out.autoRotate     = bool('autoRotate');

  // Date/time
  if (sp.has('date'))        out.datetimeString = str('date');

  // Isosurfaces
  if (sp.has('showIso'))     out.showIsosurfaces = bool('showIso');
  if (sp.has('isoMode'))     out.isoMode        = str('isoMode');
  if (sp.has('isoRes'))      { const v = num('isoRes');      if (v !== null) out.isoResolution = v; }
  if (sp.has('isoOpacity'))  { const v = num('isoOpacity');  if (v !== null) out.isoOpacity   = v; }

  // Radiation belts
  if (sp.has('innerBelt'))   out.showInnerBelt  = bool('innerBelt');
  if (sp.has('outerBelt'))   out.showOuterBelt  = bool('outerBelt');
  if (sp.has('beltOpacity')) { const v = num('beltOpacity'); if (v !== null) out.beltOpacity  = v; }

  // Clipping
  if (sp.has('clipEq'))      out.clipEquatorial      = bool('clipEq');
  if (sp.has('clipMer'))     out.clipMeridional      = bool('clipMer');
  if (sp.has('clipAngle'))   { const v = num('clipAngle'); if (v !== null) out.clipMeridionalAngle = v; }

  // Satellite
  if (sp.has('showSat'))     out.showSatellite  = bool('showSat');
  if (sp.has('satLat'))      { const v = num('satLat');  if (v !== null) out.satLatitude  = v; }
  if (sp.has('satLon'))      { const v = num('satLon');  if (v !== null) out.satLongitude = v; }
  if (sp.has('satAlt'))      { const v = num('satAlt');  if (v !== null) out.satAltitude  = v; }

  // Solar wind
  if (sp.has('sw'))          out.solarWindEnabled = bool('sw');
  if (sp.has('vSw'))         { const v = num('vSw');  if (v !== null) out.solarWindSpeed   = v; }
  if (sp.has('nSw'))         { const v = num('nSw');  if (v !== null) out.solarWindDensity = v; }
  if (sp.has('by'))          { const v = num('by');   if (v !== null) out.imfBy            = v; }
  if (sp.has('bz'))          { const v = num('bz');   if (v !== null) out.imfBz            = v; }
  if (sp.has('dst'))         { const v = num('dst');  if (v !== null) out.dst              = v; }
  if (sp.has('showMp'))      out.showMagnetopause = bool('showMp');

  // Particles (nested)
  const particles = {};
  if (sp.has('particles'))   particles.enabled       = bool('particles');
  if (sp.has('showElec'))    particles.showElectrons = bool('showElec');
  if (sp.has('showProt'))    particles.showProtons   = bool('showProt');
  if (sp.has('pCount'))      { const v = num('pCount');  if (v !== null) particles.count     = v; }
  if (sp.has('pEnergy'))     { const v = num('pEnergy'); if (v !== null) particles.energyMeV = v; }
  if (Object.keys(particles).length) out.particles = particles;

  // Aurora (nested)
  const aurora = {};
  if (sp.has('aurora'))      aurora.enabled = bool('aurora');
  if (sp.has('auroraOp'))    { const v = num('auroraOp'); if (v !== null) aurora.opacity = v; }
  if (Object.keys(aurora).length) out.aurora = aurora;

  // isoLevels — returned separately, applied after initIsoLevels() runs
  const isoLevels = sp.has('isoLevels') ? str('isoLevels') : null;

  // Camera position — returned separately so it can be applied after controls are set up
  let camera = null;
  if (sp.has('camX') && sp.has('camY') && sp.has('camZ')) {
    const cx = num('camX'), cy = num('camY'), cz = num('camZ');
    if (cx !== null && cy !== null && cz !== null) camera = { x: cx, y: cy, z: cz };
  }

  return { params: out, isoLevels, camera };
}

/**
 * Apply isoLevels from a URL string to the current params.isoLevels object.
 * Call this AFTER initIsoLevels() has populated params.isoLevels with keys.
 *
 * @param {object} params - The main params object
 * @param {string} isoLevelsStr - Comma-separated active level keys, e.g. "8,10"
 */
export function applyIsoLevelsFromUrl(params, isoLevelsStr) {
  const active = new Set(isoLevelsStr.split(',').map(s => s.trim()).filter(Boolean));
  for (const k of Object.keys(params.isoLevels)) {
    params.isoLevels[k] = active.has(String(k));
  }
}

// ── URL write (debounced) ────────────────────────────────────────────────────

let _writeTimer = null;

/**
 * Schedule a URL hash update. Debounced to 500ms so slider drags don't
 * spam history. Uses location.replace() so the back button skips intermediate
 * slider positions and goes to the previous meaningful page.
 *
 * @param {object} params  - The main params object from main.js
 * @param {object} [camera] - THREE.Camera; if provided, position is written to URL
 */
export function scheduleUrlWrite(params, camera = null) {
  clearTimeout(_writeTimer);
  _writeTimer = setTimeout(() => _doWrite(params, camera), 500);
}

function _doWrite(params, camera) {
  const sp = new URLSearchParams();
  const d  = DEFAULTS;

  const set = (k, v, def) => {
    // Normalise floats to avoid spurious precision (e.g. 0.008000000000001)
    const vs = typeof v === 'number' ? String(parseFloat(v.toPrecision(6))) : String(v);
    const ds = String(def);
    if (vs !== ds) sp.set(k, vs);
  };

  // Field lines
  set('maxDegree',  params.maxDegree,     d.maxDegree);
  set('numLat',     params.numLatitudes,  d.numLatitudes);
  set('numLon',     params.numLongitudes, d.numLongitudes);
  set('tubeRadius', params.tubeRadius,    d.tubeRadius);
  set('showFL',     params.showFieldLines, d.showFieldLines);
  set('autoRotate', params.autoRotate,    d.autoRotate);

  // Date/time
  set('date', params.datetimeString, d.datetimeString);

  // Isosurfaces
  set('showIso',   params.showIsosurfaces, d.showIsosurfaces);
  set('isoMode',   params.isoMode,         d.isoMode);
  set('isoRes',    params.isoResolution,   d.isoResolution);
  set('isoOpacity', params.isoOpacity,     d.isoOpacity);

  // isoLevels: comma-separated active keys
  if (params.isoLevels && Object.keys(params.isoLevels).length) {
    const active = Object.entries(params.isoLevels)
      .filter(([, v]) => v).map(([k]) => k).sort().join(',');
    if (active !== d.isoLevels) sp.set('isoLevels', active);
  }

  // Radiation belts
  set('innerBelt',   params.showInnerBelt, d.showInnerBelt);
  set('outerBelt',   params.showOuterBelt, d.showOuterBelt);
  set('beltOpacity', params.beltOpacity,   d.beltOpacity);

  // Clipping
  set('clipEq',    params.clipEquatorial,      d.clipEquatorial);
  set('clipMer',   params.clipMeridional,      d.clipMeridional);
  set('clipAngle', params.clipMeridionalAngle, d.clipMeridionalAngle);

  // Satellite
  set('showSat', params.showSatellite, d.showSatellite);
  set('satLat',  params.satLatitude,   d.satLatitude);
  set('satLon',  params.satLongitude,  d.satLongitude);
  set('satAlt',  params.satAltitude,   d.satAltitude);

  // Solar wind
  set('sw',     params.solarWindEnabled,  d.solarWindEnabled);
  set('vSw',    params.solarWindSpeed,    d.solarWindSpeed);
  set('nSw',    params.solarWindDensity,  d.solarWindDensity);
  set('by',     params.imfBy,             d.imfBy);
  set('bz',     params.imfBz,             d.imfBz);
  set('dst',    params.dst,               d.dst);
  set('showMp', params.showMagnetopause,  d.showMagnetopause);

  // Particles
  set('particles', params.particles.enabled,       d.pEnabled);
  set('showElec',  params.particles.showElectrons,  d.pShowElec);
  set('showProt',  params.particles.showProtons,    d.pShowProt);
  set('pCount',    params.particles.count,          d.pCount);
  set('pEnergy',   params.particles.energyMeV,      d.pEnergy);

  // Aurora
  set('aurora',   params.aurora.enabled, d.aEnabled);
  set('auroraOp', params.aurora.opacity, d.aOpacity);

  // Camera position (default: 0, 1.5, 4). Written as an atomic unit — all three
  // or none — so that a partial URL (e.g. camX=0 omitted) can never leave the
  // camera half-restored on load.
  if (camera) {
    const cx = camera.position.x, cy = camera.position.y, cz = camera.position.z;
    if (cx !== 0 || cy !== 1.5 || cz !== 4) {
      const fmt = (v) => String(parseFloat(v.toPrecision(6)));
      sp.set('camX', fmt(cx));
      sp.set('camY', fmt(cy));
      sp.set('camZ', fmt(cz));
    }
  }

  const str = sp.toString();
  // replace() avoids polluting browser history with every slider change
  window.location.replace(str ? '#' + str : window.location.pathname + window.location.search);
}
