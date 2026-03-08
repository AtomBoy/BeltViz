/**
 * src/ui/satellitePanel.js
 *
 * HTML overlay panel for satellite search and selection.
 * Appears as a floating panel adjacent to the lil-gui control panel.
 *
 * Provides:
 *   - Text search input (live-filtered, 200ms debounce)
 *   - Scrollable results list with orbit class badges
 *   - Selected satellite info display
 *   - onSelect(satelliteIndex) callback when user picks a satellite
 */

import { filterSatellites, orbitClassLabel, periodFromLine2 } from './satelliteSearchState.js';

const CLASS_BADGE_COLORS = {
  leo:   '#3a6080',
  meo:   '#1a6050',
  geo:   '#706020',
  heo:   '#602060',
  other: '#404040',
};

let panelEl = null;
let resultsEl = null;
let searchInput = null;
let selectedInfoEl = null;
let isVisible = false;

let catalogSatellites = [];
let currentQuery = '';
let currentOrbitClasses = ['leo', 'meo', 'geo', 'heo'];
let currentNotableOnly = true;
let onSelectCallback = null;
let debounceTimer = null;

// ─── Styles ───────────────────────────────────────────────────────────────────

function injectStyles() {
  if (document.getElementById('sat-panel-styles')) return;
  const style = document.createElement('style');
  style.id = 'sat-panel-styles';
  style.textContent = `
    #sat-panel {
      position: fixed;
      top: 60px;
      right: 310px;        /* just left of lil-gui panel */
      width: 280px;
      background: rgba(0, 5, 20, 0.88);
      color: #c8ddf0;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      line-height: 1.5;
      border: 1px solid rgba(100, 150, 200, 0.3);
      backdrop-filter: blur(10px);
      z-index: 20;
      display: none;
      flex-direction: column;
      max-height: calc(100vh - 120px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    }
    #sat-panel.visible { display: flex; }
    #sat-panel-header {
      padding: 10px 12px 6px;
      border-bottom: 1px solid rgba(100, 150, 200, 0.2);
      flex-shrink: 0;
    }
    #sat-panel-title {
      color: #88ccff;
      font-size: 13px;
      font-weight: bold;
      margin-bottom: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    #sat-panel-close {
      cursor: pointer;
      color: #6688aa;
      font-size: 16px;
      line-height: 1;
      padding: 2px 4px;
      border-radius: 3px;
    }
    #sat-panel-close:hover { color: #c8ddf0; background: rgba(255,255,255,0.1); }
    #sat-search {
      width: 100%;
      box-sizing: border-box;
      background: rgba(0, 10, 30, 0.7);
      border: 1px solid rgba(100, 150, 200, 0.3);
      border-radius: 4px;
      color: #c8ddf0;
      font-family: 'Courier New', monospace;
      font-size: 12px;
      padding: 5px 8px;
      outline: none;
      margin-bottom: 0;
    }
    #sat-search::placeholder { color: #446688; }
    #sat-search:focus { border-color: rgba(136, 204, 255, 0.5); }
    #sat-results {
      overflow-y: auto;
      flex: 1;
      min-height: 80px;
      max-height: 300px;
      padding: 4px 0;
    }
    #sat-results::-webkit-scrollbar { width: 4px; }
    #sat-results::-webkit-scrollbar-track { background: transparent; }
    #sat-results::-webkit-scrollbar-thumb { background: rgba(100,150,200,0.3); border-radius: 2px; }
    .sat-result-row {
      padding: 5px 12px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
    }
    .sat-result-row:hover { background: rgba(100, 150, 200, 0.15); }
    .sat-result-row.selected { background: rgba(136, 204, 255, 0.15); }
    .sat-result-name {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #c8ddf0;
    }
    .sat-class-badge {
      font-size: 10px;
      padding: 1px 5px;
      border-radius: 3px;
      flex-shrink: 0;
      font-weight: bold;
      opacity: 0.9;
    }
    .sat-no-results {
      padding: 12px;
      color: #446688;
      text-align: center;
    }
    #sat-selected-info {
      border-top: 1px solid rgba(100, 150, 200, 0.2);
      padding: 10px 12px;
      flex-shrink: 0;
      font-size: 11px;
      color: #8aaabb;
    }
    #sat-selected-info .sat-info-name {
      color: #88ccff;
      font-size: 12px;
      font-weight: bold;
      margin-bottom: 4px;
    }
    #sat-selected-info .sat-info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1px;
    }
    #sat-selected-info .sat-info-label { color: #6688aa; }
    #sat-selected-info .sat-info-value { color: #aaccee; }
  `;
  document.head.appendChild(style);
}

// ─── Build DOM ────────────────────────────────────────────────────────────────

function buildPanel() {
  injectStyles();

  panelEl = document.createElement('div');
  panelEl.id = 'sat-panel';

  // Header
  const header = document.createElement('div');
  header.id = 'sat-panel-header';

  const titleRow = document.createElement('div');
  titleRow.id = 'sat-panel-title';
  titleRow.innerHTML = '<span>Satellite Search</span>';
  const closeBtn = document.createElement('span');
  closeBtn.id = 'sat-panel-close';
  closeBtn.textContent = '✕';
  closeBtn.addEventListener('click', hide);
  titleRow.appendChild(closeBtn);
  header.appendChild(titleRow);

  searchInput = document.createElement('input');
  searchInput.id = 'sat-search';
  searchInput.type = 'text';
  searchInput.placeholder = 'Search name or NORAD ID…';
  searchInput.autocomplete = 'off';
  searchInput.spellcheck = false;
  searchInput.addEventListener('input', onSearchInput);
  header.appendChild(searchInput);

  panelEl.appendChild(header);

  // Results list
  resultsEl = document.createElement('div');
  resultsEl.id = 'sat-results';
  panelEl.appendChild(resultsEl);

  // Selected satellite info
  selectedInfoEl = document.createElement('div');
  selectedInfoEl.id = 'sat-selected-info';
  selectedInfoEl.style.display = 'none';
  panelEl.appendChild(selectedInfoEl);

  document.body.appendChild(panelEl);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isVisible) hide();
  });

  // Close on click outside
  document.addEventListener('mousedown', (e) => {
    if (isVisible && panelEl && !panelEl.contains(e.target)) {
      // Don't close if clicking the "Search Satellites" button in the GUI
      if (e.target.closest && e.target.closest('#sat-open-btn')) return;
      hide();
    }
  });
}

// ─── Search logic ─────────────────────────────────────────────────────────────

function onSearchInput() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentQuery = searchInput.value;
    renderResults();
  }, 200);
}

function renderResults() {
  const enabledClasses = [];
  if (currentOrbitClasses) {
    enabledClasses.push(...currentOrbitClasses);
  }

  const filtered = filterSatellites(
    catalogSatellites,
    currentQuery,
    enabledClasses,
    currentNotableOnly,
  );

  resultsEl.innerHTML = '';

  if (filtered.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'sat-no-results';
    empty.textContent = 'No satellites match.';
    resultsEl.appendChild(empty);
    return;
  }

  const MAX_DISPLAY = 80;
  const toShow = filtered.slice(0, MAX_DISPLAY);

  for (const sat of toShow) {
    const globalIndex = catalogSatellites.indexOf(sat);
    const row = document.createElement('div');
    row.className = 'sat-result-row';
    if (globalIndex === currentSelectedIndex) row.classList.add('selected');

    const nameEl = document.createElement('span');
    nameEl.className = 'sat-result-name';
    nameEl.title = sat.name;
    nameEl.textContent = sat.name;

    const badge = document.createElement('span');
    badge.className = 'sat-class-badge';
    badge.textContent = orbitClassLabel(sat.orbitClass);
    badge.style.background = CLASS_BADGE_COLORS[sat.orbitClass] ?? '#404040';
    badge.style.color = '#c8ddf0';

    row.appendChild(nameEl);
    row.appendChild(badge);
    row.addEventListener('click', () => selectSatellite(globalIndex));
    resultsEl.appendChild(row);
  }

  if (filtered.length > MAX_DISPLAY) {
    const more = document.createElement('div');
    more.className = 'sat-no-results';
    more.textContent = `… and ${filtered.length - MAX_DISPLAY} more. Refine search.`;
    resultsEl.appendChild(more);
  }
}

// ─── Selection ────────────────────────────────────────────────────────────────

let currentSelectedIndex = -1;

function selectSatellite(globalIndex) {
  currentSelectedIndex = globalIndex;
  renderResults();

  if (globalIndex < 0 || globalIndex >= catalogSatellites.length) {
    selectedInfoEl.style.display = 'none';
    if (onSelectCallback) onSelectCallback(-1);
    return;
  }

  const sat = catalogSatellites[globalIndex];
  const period = periodFromLine2(sat.line2);
  const orbitAlt = altitudeFromMeanMotion(sat.line2);

  selectedInfoEl.style.display = 'block';
  selectedInfoEl.innerHTML = `
    <div class="sat-info-name">${escHtml(sat.name)}</div>
    <div class="sat-info-row">
      <span class="sat-info-label">NORAD ID</span>
      <span class="sat-info-value">${sat.id}</span>
    </div>
    <div class="sat-info-row">
      <span class="sat-info-label">Orbit</span>
      <span class="sat-info-value">${orbitClassLabel(sat.orbitClass)}</span>
    </div>
    ${orbitAlt > 0 ? `<div class="sat-info-row">
      <span class="sat-info-label">Altitude</span>
      <span class="sat-info-value">~${Math.round(orbitAlt)} km</span>
    </div>` : ''}
    ${period > 0 ? `<div class="sat-info-row">
      <span class="sat-info-label">Period</span>
      <span class="sat-info-value">${period.toFixed(1)} min</span>
    </div>` : ''}
  `;

  if (onSelectCallback) onSelectCallback(globalIndex);
}

/** Approximate mean altitude from TLE mean motion (circular orbit assumption). */
function altitudeFromMeanMotion(line2) {
  const n = parseFloat(line2.substring(52, 63)); // rev/day
  if (!isFinite(n) || n <= 0) return 0;
  const mu = 398600.4418; // km³/s²
  const nRad = n * 2 * Math.PI / 86400; // rad/s
  const a = Math.pow(mu / (nRad * nRad), 1 / 3); // semi-major axis km
  return Math.max(0, a - 6371.2);
}

function escHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Initialize the satellite search panel.
 *
 * @param {Array}    satellites       - catalog from satellites.json
 * @param {object}   opts
 * @param {Function} opts.onSelect    - callback(globalIndex) when satellite selected
 */
export function initSatellitePanel(satellites, opts = {}) {
  catalogSatellites = satellites;
  onSelectCallback = opts.onSelect ?? null;

  buildPanel();
  renderResults();
}

/** Show the search panel. */
export function showSatellitePanel() {
  if (!panelEl) return;
  panelEl.classList.add('visible');
  isVisible = true;
  searchInput?.focus();
}

/** Hide the search panel. */
export function hideSatellitePanel() {
  hide();
}

function hide() {
  if (!panelEl) return;
  panelEl.classList.remove('visible');
  isVisible = false;
}

/** Toggle panel visibility. */
export function toggleSatellitePanel() {
  if (isVisible) hide();
  else showSatellitePanel();
}

/**
 * Update filter state (called when lil-gui controls change).
 * @param {string[]} orbitClasses - enabled orbit classes
 * @param {boolean}  notableOnly
 */
export function updateSatelliteFilter(orbitClasses, notableOnly) {
  currentOrbitClasses = orbitClasses;
  currentNotableOnly = notableOnly;
  renderResults();
}

/**
 * Set which satellite is selected (e.g. from URL restore).
 * Does not fire onSelect callback.
 * @param {number} globalIndex
 */
export function setSatellitePanelSelection(globalIndex) {
  currentSelectedIndex = globalIndex;
  if (globalIndex >= 0 && globalIndex < catalogSatellites.length) {
    const sat = catalogSatellites[globalIndex];
    const period = periodFromLine2(sat.line2);
    const orbitAlt = altitudeFromMeanMotion(sat.line2);
    selectedInfoEl.style.display = 'block';
    selectedInfoEl.innerHTML = `
      <div class="sat-info-name">${escHtml(sat.name)}</div>
      <div class="sat-info-row"><span class="sat-info-label">NORAD ID</span><span class="sat-info-value">${sat.id}</span></div>
      <div class="sat-info-row"><span class="sat-info-label">Orbit</span><span class="sat-info-value">${orbitClassLabel(sat.orbitClass)}</span></div>
      ${orbitAlt > 0 ? `<div class="sat-info-row"><span class="sat-info-label">Altitude</span><span class="sat-info-value">~${Math.round(orbitAlt)} km</span></div>` : ''}
      ${period > 0 ? `<div class="sat-info-row"><span class="sat-info-label">Period</span><span class="sat-info-value">${period.toFixed(1)} min</span></div>` : ''}
    `;
  } else {
    selectedInfoEl.style.display = 'none';
  }
}

/** Returns true if the panel is currently visible. */
export function isSatellitePanelVisible() {
  return isVisible;
}
