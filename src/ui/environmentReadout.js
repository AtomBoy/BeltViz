/**
 * Environment readout overlay.
 *
 * Shows magnetic environment data (position, |B|, L-shell, region, SAA)
 * near the mouse cursor or at a fixed position for the satellite probe.
 */

const REGION_LABELS = {
  'below-inner-belt': 'Below Inner Belt',
  'inner-belt': 'Inner Belt',
  'slot-region': 'Slot Region',
  'outer-belt': 'Outer Belt',
  'beyond-outer-belt': 'Beyond Outer Belt',
};

let readoutEl = null;

function ensureReadoutElement() {
  if (readoutEl) return readoutEl;

  readoutEl = document.createElement('div');
  readoutEl.id = 'env-readout';
  readoutEl.style.display = 'none';
  document.body.appendChild(readoutEl);

  const style = document.createElement('style');
  style.textContent = `
    #env-readout {
      position: fixed;
      top: 155px;
      left: 20px;
      background: rgba(0, 5, 20, 0.8);
      color: #c8ddf0;
      padding: 12px 16px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.6;
      min-width: 240px;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(100, 150, 200, 0.25);
      z-index: 10;
      pointer-events: none;
    }
    #env-readout .label {
      color: #6688aa;
      display: inline-block;
      width: 80px;
    }
    #env-readout .value {
      color: #aaccee;
    }
    #env-readout .region-inner-belt { color: #ff8844; }
    #env-readout .region-outer-belt { color: #6666ee; }
    #env-readout .region-slot-region { color: #88aa66; }
    #env-readout .saa-active { color: #ff4444; font-weight: bold; }
    #env-readout .title {
      color: #88ccff;
      font-size: 13px;
      margin-bottom: 6px;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);

  return readoutEl;
}

/**
 * Update the environment readout display.
 *
 * @param {object} data - { latDeg, lonDeg, altitudeKm, bMagnitude, lShell, region, saaProximity }
 * @param {string} [title] - Optional title (e.g. "Satellite Probe")
 */
export function updateEnvironmentReadout(data, title) {
  const el = ensureReadoutElement();

  const latStr = `${Math.abs(data.latDeg).toFixed(1)}°${data.latDeg >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(data.lonDeg).toFixed(1)}°${data.lonDeg >= 0 ? 'E' : 'W'}`;
  const altStr = data.altitudeKm < 1000
    ? `${data.altitudeKm.toFixed(0)} km`
    : `${(data.altitudeKm / 1000).toFixed(1)}k km`;
  const bStr = data.bMagnitude.toLocaleString(undefined, { maximumFractionDigits: 0 });
  const regionLabel = REGION_LABELS[data.region] || data.region;
  const regionClass = `region-${data.region}`;
  const saaStr = data.saaProximity > 0.1
    ? `<span class="saa-active">Detected (${(data.saaProximity * 100).toFixed(0)}%)</span>`
    : 'Not detected';

  el.innerHTML = `
    <div class="title">${title || 'Environment'}</div>
    <div><span class="label">Position</span><span class="value">${latStr}, ${lonStr}, ${altStr}</span></div>
    <div><span class="label">|B|</span><span class="value">${bStr} nT</span></div>
    <div><span class="label">L-shell</span><span class="value">${data.lShell.toFixed(2)}</span></div>
    <div><span class="label">Region</span><span class="value ${regionClass}">${regionLabel}</span></div>
    <div><span class="label">SAA</span><span class="value">${saaStr}</span></div>
  `;
  el.style.display = 'block';
}

/**
 * Hide the environment readout.
 */
export function hideEnvironmentReadout() {
  if (readoutEl) readoutEl.style.display = 'none';
}
