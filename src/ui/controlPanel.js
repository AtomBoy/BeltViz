import GUI from 'lil-gui';

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
    onSatelliteChange,
    onSolarWindChange,
    onMagnetopauseChange,
  } = callbacks;

  const gui = new GUI({ title: 'BeltViz Controls' });

  // --- Field Lines folder ---
  const fieldFolder = gui.addFolder('Field Lines');
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

  // --- Isosurfaces folder ---
  const isoFolder = gui.addFolder('Isosurfaces');
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

  // Per-level toggles
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

  // --- Radiation Belts folder ---
  const beltFolder = gui.addFolder('Radiation Belts');
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

  // --- Clipping folder ---
  const clipFolder = gui.addFolder('Clipping');
  clipFolder.add(params, 'clipEquatorial').name('Equatorial Clip').onChange(onClipChange);
  clipFolder.add(params, 'clipMeridional').name('Meridional Clip').onChange(onClipChange);
  clipFolder.add(params, 'clipMeridionalAngle', 0, 360, 1)
    .name('Meridional Angle')
    .onChange(onClipChange);
  clipFolder.close();

  // --- Satellite Probe folder ---
  const satFolder = gui.addFolder('Satellite Probe');
  satFolder.add(params, 'showSatellite').name('Show Probe').onChange(onSatelliteChange);
  satFolder.add(params, 'satLatitude', -90, 90, 0.5).name('Latitude').onChange(onSatelliteChange);
  satFolder.add(params, 'satLongitude', -180, 180, 0.5).name('Longitude').onChange(onSatelliteChange);
  satFolder.add(params, 'satAltitude', 200, 36000, 50).name('Altitude (km)').onChange(onSatelliteChange);
  satFolder.close();

  // --- Solar Wind folder ---
  const solarFolder = gui.addFolder('Solar Wind');

  const PRESETS = {
    Quiet: { vSw: 400, nSw: 5, imfBz: 0, dst: 0 },
    'Moderate Storm': { vSw: 500, nSw: 10, imfBz: -5, dst: -50 },
    'Severe Storm': { vSw: 700, nSw: 20, imfBz: -15, dst: -150 },
  };

  solarFolder.add(params, 'solarWindEnabled').name('Enable Solar Wind').onChange(onSolarWindChange);

  // Preset selector (stored as a transient key, not a real param)
  params._solarPreset = 'Quiet';
  solarFolder.add(params, '_solarPreset', Object.keys(PRESETS)).name('Preset').onChange((name) => {
    const p = PRESETS[name];
    if (!p) return;
    params.solarWindSpeed = p.vSw;
    params.solarWindDensity = p.nSw;
    params.imfBz = p.imfBz;
    params.dst = p.dst;
    // Update GUI controllers to reflect new values
    gui.controllersRecursive().forEach((c) => c.updateDisplay());
    if (params.solarWindEnabled) onSolarWindChange();
  });

  const cSpeed   = solarFolder.add(params, 'solarWindSpeed', 300, 800, 10).name('Speed (km/s)').onChange(() => {
    if (params.solarWindEnabled) onSolarWindChange();
  });
  const cDensity = solarFolder.add(params, 'solarWindDensity', 1, 30, 0.5).name('Density (cm⁻³)').onChange(() => {
    if (params.solarWindEnabled) onSolarWindChange();
  });
  const cBz      = solarFolder.add(params, 'imfBz', -20, 20, 0.5).name('IMF Bz (nT)').onChange(() => {
    if (params.solarWindEnabled) onSolarWindChange();
  });
  const cDst     = solarFolder.add(params, 'dst', -200, 50, 5).name('Dst Index (nT)').onChange(() => {
    if (params.solarWindEnabled) onSolarWindChange();
  });
  solarFolder.add(params, 'showMagnetopause').name('Show Magnetopause').onChange(onMagnetopauseChange);
  solarFolder.close();

  /**
   * Refresh only the four solar wind value sliders.
   * Called by main.js when historical data drives param changes (once per sim-hour)
   * to avoid traversing all GUI controllers every frame.
   */
  function refreshSolarWindControls() {
    cSpeed.updateDisplay();
    cDensity.updateDisplay();
    cBz.updateDisplay();
    cDst.updateDisplay();
  }

  return { gui, refreshSolarWindControls };
}
