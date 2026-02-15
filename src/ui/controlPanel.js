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
  } = callbacks;

  const gui = new GUI({ title: 'BeltViz Controls' });

  // --- Field Lines folder ---
  const fieldFolder = gui.addFolder('Field Lines');
  fieldFolder.add(params, 'maxDegree', 1, 13, 1).name('IGRF Degree').onChange(() => {
    onRebuild();
    if (params.showIsosurfaces) onIsoRebuild();
    if (params.showInnerBelt || params.showOuterBelt) onBeltRebuild();
  });
  fieldFolder.add(params, 'numLatitudes', 1, 7, 1).name('Latitude Bands').onChange(onRebuild);
  fieldFolder.add(params, 'numLongitudes', 4, 16, 2).name('Longitudes').onChange(onRebuild);
  fieldFolder.add(params, 'tubeRadius', 0.003, 0.02, 0.001).name('Line Thickness').onChange(onVisualChange);
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
  isoFolder.add(params, 'isoOpacity', 0.05, 0.5, 0.01)
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

  return gui;
}
