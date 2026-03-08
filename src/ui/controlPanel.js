import GUI from 'lil-gui';

function injectControlPanelStyles() {
  if (document.getElementById('control-panel-styles')) return;
  const style = document.createElement('style');
  style.id = 'control-panel-styles';
  // lil-gui has .lil-gui.root > .children > .lil-gui > .title at specificity 0,5,0,
  // which zeros out border properties. Match that depth with our class added (0,6,0)
  // so our border-left wins. The typography rules (lowercase specificity 0,3,0) already
  // beat lil-gui's standard selectors and don't need the extra depth.
  style.textContent = `
    .lil-gui.root > .children > .lil-gui.section-magnetosphere > .title {
      border-left: 3px solid #44ccee;
    }
    .lil-gui.root > .children > .lil-gui.section-solar-wind > .title {
      border-left: 3px solid #ffaa44;
    }
    .lil-gui.root > .children > .lil-gui.section-radiation > .title {
      border-left: 3px solid #9988ff;
    }
    .lil-gui.root > .children > .lil-gui.section-satellites > .title {
      border-left: 3px solid #ffdd44;
    }
    .lil-gui.root > .children > .lil-gui.section-clipping > .title {
      border-left: 3px solid #445566;
    }
    .lil-gui.section-magnetosphere > .title,
    .lil-gui.section-solar-wind > .title,
    .lil-gui.section-radiation > .title,
    .lil-gui.section-satellites > .title,
    .lil-gui.section-clipping > .title {
      padding-left: 9px;
      letter-spacing: 1.5px; text-transform: uppercase; font-size: 11px;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Create the lil-gui control panel.
 * @param {object} params - Mutable params object
 * @param {object} callbacks
 * @returns {GUI}
 */
export function createControlPanel(params, callbacks) {
  const {
    onRebuild,
    onVisualChange,
    onIsoRebuild,
    onIsoVisualChange,
    onClipChange,
    onBeltRebuild,
    onBeltVisualChange,
    onSatelliteSwarmChange = () => {},
    onSatelliteSearchOpen  = () => {},
    onSolarWindChange,
    onMagnetopauseChange,
    // Particle and aurora changes are handled by per-frame update() calls in main.js.
    // These callbacks are accepted but currently unused (no-ops).
    // eslint-disable-next-line no-unused-vars
    onParticleChange = () => {},
    // eslint-disable-next-line no-unused-vars
    onAuroraChange   = () => {},
  } = callbacks;

  injectControlPanelStyles();
  const gui = new GUI({ title: 'Controls' });

  // ── MAGNETOSPHERE ────────────────────────────────────────────────────────────
  const fMag = gui.addFolder('Magnetosphere');
  fMag.domElement.classList.add('section-magnetosphere');

  // Field Lines subfolder (open by default)
  const fieldFolder = fMag.addFolder('Field Lines');
  fieldFolder.add(params, 'maxDegree', 1, 13, 1).name('IGRF Degree').onChange(() => {
    onRebuild();
    if (params.showIsosurfaces) onIsoRebuild();
    if (params.showInnerBelt || params.showOuterBelt) onBeltRebuild();
  });
  fieldFolder.add(params, 'numLatitudes', 1, 12, 1).name('Latitude Bands').onChange(onRebuild);
  fieldFolder.add(params, 'numLongitudes', 4, 36, 2).name('Longitudes').onChange(onRebuild);
  fieldFolder.add(params, 'tubeRadius', 0.003, 0.04, 0.001).name('Line Thickness').onChange(onRebuild);
  fieldFolder.add(params, 'showFieldLines').name('Show Field Lines').onChange(onVisualChange);
  fieldFolder.add(params, 'autoRotate').name('Auto Rotate').onChange(onVisualChange);

  // Isosurfaces subfolder (closed)
  const isoFolder = fMag.addFolder('Isosurfaces');
  isoFolder.add(params, 'showIsosurfaces').name('Show Isosurfaces').onChange((v) => {
    if (v) onIsoRebuild();
    else onIsoVisualChange();
  });
  isoFolder.add(params, 'isoMode', { 'L-shell (field topology)': 'lShell', 'Field Strength |B|': 'fieldStrength' })
    .name('Mode')
    .onChange(onIsoRebuild);
  isoFolder.add(params, 'isoResolution', { Low: 48, Medium: 64, High: 96 })
    .name('Resolution')
    .onChange(onIsoRebuild);
  isoFolder.add(params, 'isoOpacity', 0.05, 0.8, 0.01)
    .name('Opacity')
    .onChange(onIsoVisualChange);

  const levelsFolder = isoFolder.addFolder('Levels');
  function rebuildLevelToggles() {
    for (const c of [...levelsFolder.controllers]) {
      c.destroy();
    }
    for (const level of Object.keys(params.isoLevels)) {
      const label = params.isoMode === 'lShell'
        ? `L = ${level}`
        : `${Number(level).toLocaleString()} nT`;
      levelsFolder.add(params.isoLevels, level)
        .name(label)
        .onChange(onIsoVisualChange);
    }
  }
  rebuildLevelToggles();
  params._rebuildLevelToggles = rebuildLevelToggles;

  levelsFolder.close();
  isoFolder.close();
  // fMag and fieldFolder remain open (default lil-gui state)

  // ── SOLAR WIND ───────────────────────────────────────────────────────────────
  const fSW = gui.addFolder('Solar Wind');
  fSW.domElement.classList.add('section-solar-wind');

  const PRESETS = {
    // 'Historical Data' is a read-only sentinel — selecting it is a no-op.
    // main.js sets params._solarPreset to this key whenever applyDataSolarWind() runs.
    'Historical Data': null,
    Quiet: { vSw: 400, nSw: 5, imfBy: 0, imfBz: 0, dst: 0 },
    'Moderate Storm': { vSw: 500, nSw: 10, imfBy: 2, imfBz: -5, dst: -50 },
    'Severe Storm': { vSw: 700, nSw: 20, imfBy: 5, imfBz: -15, dst: -150 },
  };

  fSW.add(params, 'solarWindEnabled').name('Enable Solar Wind').onChange(onSolarWindChange);

  // Preset selector (stored as a transient key, not a real param).
  // Initialised to 'Historical Data'; main.js keeps it in sync via refreshSolarWindControls().
  params._solarPreset = 'Historical Data';
  const cPreset = fSW.add(params, '_solarPreset', Object.keys(PRESETS)).name('Preset').onChange((name) => {
    const p = PRESETS[name];
    if (!p) return; // 'Historical Data' selected — no values to apply
    params.solarWindSpeed = p.vSw;
    params.solarWindDensity = p.nSw;
    params.imfBy = p.imfBy;
    params.imfBz = p.imfBz;
    params.dst = p.dst;
    // Update GUI controllers to reflect new values
    gui.controllersRecursive().forEach((c) => c.updateDisplay());
    if (params.solarWindEnabled) onSolarWindChange();
  });

  const cSpeed   = fSW.add(params, 'solarWindSpeed', 300, 800, 10).name('Speed (km/s)').onChange(() => {
    if (params.solarWindEnabled) onSolarWindChange();
  });
  const cDensity = fSW.add(params, 'solarWindDensity', 1, 30, 0.5).name('Density (cm⁻³)').onChange(() => {
    if (params.solarWindEnabled) onSolarWindChange();
  });
  const cBy      = fSW.add(params, 'imfBy', -20, 20, 0.5).name('IMF By (nT)').onChange(() => {
    if (params.solarWindEnabled) onSolarWindChange();
  });
  const cBz      = fSW.add(params, 'imfBz', -20, 20, 0.5).name('IMF Bz (nT)').onChange(() => {
    if (params.solarWindEnabled) onSolarWindChange();
  });
  const cDst     = fSW.add(params, 'dst', -200, 50, 5).name('Dst Index (nT)').onChange(() => {
    if (params.solarWindEnabled) onSolarWindChange();
  });
  fSW.add(params, 'showMagnetopause').name('Show Magnetopause').onChange(onMagnetopauseChange);
  fSW.close();

  // ── RADIATION & AURORA ───────────────────────────────────────────────────────
  const fRad = gui.addFolder('Radiation & Aurora');
  fRad.domElement.classList.add('section-radiation');

  // Radiation Belts subfolder
  const beltFolder = fRad.addFolder('Radiation Belts');
  beltFolder.add(params, 'showInnerBelt').name('Inner Belt (L=1.2-2)').onChange((v) => {
    if (v) onBeltRebuild();
    else onBeltVisualChange();
  });
  beltFolder.add(params, 'showOuterBelt').name('Outer Belt (L=3-6)').onChange((v) => {
    if (v) onBeltRebuild();
    else onBeltVisualChange();
  });
  beltFolder.add(params, 'beltOpacity', 0.05, 0.8, 0.01)
    .name('Opacity')
    .onChange(onBeltVisualChange);
  beltFolder.close();

  // Belt Particles subfolder
  const particleFolder = fRad.addFolder('Belt Particles');
  particleFolder.add(params.particles, 'enabled').name('Show Particles');

  // Species checkboxes — labels double as a color legend.
  const cElec = particleFolder.add(params.particles, 'showElectrons').name('Electrons (eastward)');
  cElec.$name.innerHTML = '<span style="color:#3399ff">●</span> Electrons (eastward)';
  const cProt = particleFolder.add(params.particles, 'showProtons').name('Protons (westward)');
  cProt.$name.innerHTML = '<span style="color:#ff6622">●</span> Protons (westward)';

  particleFolder.add(params.particles, 'count', 200, 2000, 100).name('Max Particles');
  particleFolder.add(params.particles, 'energyMeV', {
    '< 1 MeV (low)':    0.3,
    '1–3 MeV (medium)': 2.0,
    '> 3 MeV (high)':   5.0,
  }).name('Electron Energy');
  particleFolder.close();

  // Aurora subfolder
  const auroraFolder = fRad.addFolder('Aurora');
  auroraFolder.add(params.aurora, 'enabled').name('Show Aurora');
  auroraFolder.add(params.aurora, 'opacity', 0.1, 2.0, 0.05).name('Brightness');
  auroraFolder.close();

  fRad.close();

  // ── SATELLITES ───────────────────────────────────────────────────────────────
  const fSat = gui.addFolder('Satellites');
  fSat.domElement.classList.add('section-satellites');

  fSat.add(params.satellites, 'enabled').name('Show Satellites').onChange(onSatelliteSwarmChange);
  fSat.add(params.satellites, 'notableOnly').name('Notable Only').onChange(onSatelliteSwarmChange);

  // Orbit class toggles nested in subfolder to reduce top-level clutter
  const orbitFolder = fSat.addFolder('Orbit Classes');
  const cLeo = orbitFolder.add(params.satellites, 'showLeo').name('LEO').onChange(onSatelliteSwarmChange);
  cLeo.$name.innerHTML = '<span style="color:#c8d8f0">●</span> LEO';
  const cMeo = orbitFolder.add(params.satellites, 'showMeo').name('MEO').onChange(onSatelliteSwarmChange);
  cMeo.$name.innerHTML = '<span style="color:#44eebb">●</span> MEO';
  const cGeo = orbitFolder.add(params.satellites, 'showGeo').name('GEO').onChange(onSatelliteSwarmChange);
  cGeo.$name.innerHTML = '<span style="color:#ffdd44">●</span> GEO';
  const cHeo = orbitFolder.add(params.satellites, 'showHeo').name('HEO').onChange(onSatelliteSwarmChange);
  cHeo.$name.innerHTML = '<span style="color:#ee66ff">●</span> HEO';
  const cOther = orbitFolder.add(params.satellites, 'showOther').name('Other').onChange(onSatelliteSwarmChange);
  cOther.$name.innerHTML = '<span style="color:#888888">●</span> Other';
  orbitFolder.close();

  // Inject a plain button to open the satellite search panel
  const searchBtn = document.createElement('button');
  searchBtn.id = 'sat-open-btn';
  searchBtn.textContent = 'Search / Select Satellite';
  searchBtn.style.cssText = [
    'width:100%', 'box-sizing:border-box', 'margin:4px 0', 'padding:5px 8px',
    'background:rgba(30,50,80,0.7)', 'color:#88ccff',
    'border:1px solid rgba(100,150,200,0.35)', 'border-radius:4px',
    'cursor:pointer', 'font-family:var(--font-family)', 'font-size:11px',
  ].join(';');
  searchBtn.addEventListener('mouseenter', () => { searchBtn.style.background = 'rgba(50,80,120,0.8)'; });
  searchBtn.addEventListener('mouseleave', () => { searchBtn.style.background = 'rgba(30,50,80,0.7)'; });
  searchBtn.addEventListener('click', onSatelliteSearchOpen);
  fSat.$children.appendChild(searchBtn);

  fSat.close();

  // ── CLIPPING ─────────────────────────────────────────────────────────────────
  // Cross-cutting viewing tool — applies to field lines, isosurfaces, and radiation
  // belts alike. Kept as a standalone section at the bottom for easy access.
  const fClip = gui.addFolder('Clipping');
  fClip.domElement.classList.add('section-clipping');
  fClip.add(params, 'clipEquatorial').name('Equatorial Clip').onChange(onClipChange);
  fClip.add(params, 'clipMeridional').name('Meridional Clip').onChange(onClipChange);
  fClip.add(params, 'clipMeridionalAngle', 0, 360, 1)
    .name('Meridional Angle')
    .onChange(onClipChange);
  fClip.close();

  /**
   * Refresh only the four solar wind value sliders.
   * Called by main.js when historical data drives param changes (once per sim-hour)
   * to avoid traversing all GUI controllers every frame.
   */
  function refreshSolarWindControls() {
    cPreset.updateDisplay();
    cSpeed.updateDisplay();
    cDensity.updateDisplay();
    cBy.updateDisplay();
    cBz.updateDisplay();
    cDst.updateDisplay();
  }

  return { gui, refreshSolarWindControls };
}
