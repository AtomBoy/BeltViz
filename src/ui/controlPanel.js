import GUI from 'lil-gui';

/**
 * Create the lil-gui control panel.
 * @param {object} params - Mutable params object
 * @param {function} onRebuild - Called when field lines need recomputation
 * @param {function} onVisualChange - Called for visual-only changes
 * @returns {GUI}
 */
export function createControlPanel(params, onRebuild, onVisualChange) {
  const gui = new GUI({ title: 'BeltViz Controls' });

  gui.add(params, 'maxDegree', 1, 13, 1).name('IGRF Degree').onChange(onRebuild);
  gui.add(params, 'numLatitudes', 1, 7, 1).name('Latitude Bands').onChange(onRebuild);
  gui.add(params, 'numLongitudes', 4, 16, 2).name('Longitudes').onChange(onRebuild);
  gui.add(params, 'tubeRadius', 0.003, 0.02, 0.001).name('Line Thickness').onChange(onVisualChange);
  gui.add(params, 'showFieldLines').name('Show Field Lines').onChange(onVisualChange);
  gui.add(params, 'autoRotate').name('Auto Rotate').onChange(onVisualChange);

  return gui;
}
