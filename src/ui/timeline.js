/**
 * Timeline control bar.
 *
 * A Cesium-inspired horizontal timeline at the bottom of the screen for
 * scrubbing and animating through time. Shows one week; the window slides
 * forward one day at a time during playback.
 *
 * The scrub-area background is colored by solar wind storm intensity (Dst + IMF Bz)
 * when a getSolarWindData callback is provided — quiet conditions appear as a dark
 * blue wash; moderate storms turn amber; severe storms turn red.
 *
 * Playback model:
 *   - Every rAF frame: calls onTimeChange(iso19) → lightweight sun/moon update
 *   - Every 8 real seconds: calls onPeriodicRebuild() → full field-line rebuild (throttled)
 *   - On pause / drag end: calls onPause() → final rebuild
 */

const REBUILD_INTERVAL_MS = 8000;
const WINDOW_MS   = 7 * 86400_000; // one-week view
const WINDOW_DAYS = 7;

function utcStartOfDay(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function lerp(a, b, t) { return a + (b - a) * t; }
function lerp3(a, mid, b, t) {
  return t < 0.5 ? lerp(a, mid, t * 2) : lerp(mid, b, (t - 0.5) * 2);
}

/**
 * Map one hour of solar wind data to a canvas fill color.
 *   Quiet  (Dst ≈ 0,    Bz ≈ 0)   → dark blue,  low opacity
 *   Minor  (Dst ≈ -50,  Bz ≈ -5)  → amber,      medium opacity
 *   Severe (Dst < -100, Bz < -15) → red,         high opacity
 */
function intensityColor(sw) {
  if (!sw) return 'rgba(0,20,80,0.06)';
  const dstI = sw.Dst !== null ? Math.max(0, -sw.Dst / 150) : 0;
  const bzI  = sw.Bz  !== null ? Math.max(0, -sw.Bz  / 20)  : 0;
  const t    = Math.min(1, dstI * 0.7 + bzI * 0.3);
  const r = Math.round(lerp3(0,   180, 210, t));
  const g = Math.round(lerp3(40,  100,  20, t));
  const b = Math.round(lerp3(120,  30,  20, t));
  const a = lerp(0.06, 0.55, t).toFixed(2);
  return `rgba(${r},${g},${b},${a})`;
}

function injectStyles() {
  if (document.getElementById('timeline-styles')) return;
  const style = document.createElement('style');
  style.id = 'timeline-styles';
  style.textContent = `
    #timeline {
      position: fixed; bottom: 0; left: 0; right: 0; height: 64px;
      background: rgba(0, 5, 20, 0.88);
      backdrop-filter: blur(8px);
      border-top: 1px solid rgba(100, 150, 200, 0.2);
      display: flex; align-items: center;
      z-index: 20; color: #c8ddf0;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      user-select: none; box-sizing: border-box;
    }
    #tl-controls {
      display: flex; align-items: center; gap: 6px;
      padding: 0 12px; flex-shrink: 0; width: 230px;
    }
    #tl-clock { text-align: center; min-width: 84px; }
    #tl-date  { font-size: 11px; color: #88ccff; line-height: 1.3; }
    #tl-time  {
      font-size: 13px; font-weight: bold;
      font-family: 'Courier New', monospace; line-height: 1.3;
    }
    #tl-bar {
      flex: 1; position: relative; height: 100%; cursor: pointer;
      border-left: 1px solid rgba(100, 150, 200, 0.2);
      overflow: hidden;
    }
    #tl-sw-canvas {
      position: absolute; top: 0; left: 0;
      width: 100%; height: 100%;
      pointer-events: none; z-index: 0;
    }
    .tl-tick-major {
      position: absolute; top: 0; bottom: 0; width: 1px;
      background: rgba(100, 150, 200, 0.3);
      pointer-events: none; z-index: 1;
    }
    .tl-tick-major .tl-label {
      position: absolute; bottom: 7px; left: 4px;
      font-size: 10px; color: #6688aa; white-space: nowrap;
    }
    .tl-tick-minor {
      position: absolute; top: 44%; bottom: 0; width: 1px;
      background: rgba(100, 150, 200, 0.15);
      pointer-events: none; z-index: 1;
    }
    #tl-playhead {
      position: absolute; top: 0; bottom: 0; width: 2px;
      background: #88ccff; pointer-events: none; z-index: 2;
    }
    #tl-playhead::before {
      content: ''; position: absolute; top: 0; left: -4px;
      width: 0; height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 9px solid #88ccff;
    }
    button.tl-btn {
      background: rgba(100, 150, 200, 0.15);
      border: 1px solid rgba(100, 150, 200, 0.3);
      color: #c8ddf0; border-radius: 4px;
      padding: 3px 8px; cursor: pointer; font-size: 12px;
      flex-shrink: 0;
    }
    button.tl-btn:hover { background: rgba(100, 150, 200, 0.3); }
    select.tl-select {
      background: rgba(0, 5, 20, 0.8);
      border: 1px solid rgba(100, 150, 200, 0.3);
      color: #c8ddf0; border-radius: 4px;
      padding: 2px 4px; font-size: 12px; cursor: pointer;
      flex-shrink: 0;
    }
    #tl-legend {
      display: flex; flex-direction: column; align-items: stretch;
      justify-content: center; gap: 7px;
      padding: 0 14px; flex-shrink: 0; width: 190px;
      border-left: 1px solid rgba(100, 150, 200, 0.2);
    }
    .tl-gauge {
      display: flex; align-items: center; gap: 6px; cursor: default;
    }
    .tl-gauge-lbl {
      font-size: 10px; color: #7799bb; letter-spacing: .05em; text-transform: uppercase;
      width: 20px; flex-shrink: 0; text-align: right;
    }
    .tl-gauge-num {
      font-size: 11px; font-weight: bold; font-family: 'Courier New', monospace;
      width: 48px; flex-shrink: 0; text-align: right; transition: color 0.3s;
    }
    .tl-gauge-track {
      flex: 1; height: 5px; border-radius: 3px; position: relative;
      background: rgba(100, 150, 200, 0.12);
    }
    .tl-gauge-fill {
      position: absolute; top: 0; left: 0; height: 100%; border-radius: 3px;
      transition: width 0.4s ease, background 0.4s ease;
      min-width: 0;
    }
    .tl-gauge-marker {
      position: absolute; top: -3px; width: 2px; height: 11px; border-radius: 1px;
      background: rgba(220, 230, 255, 0.8);
      transform: translateX(-50%);
      transition: left 0.4s ease;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Create a timeline control bar.
 *
 * @param {object} opts
 * @param {Date|string} opts.initialTime         - Starting time
 * @param {function} opts.onTimeChange           - Called every frame during play/scrub with iso19 string
 * @param {function} opts.onPause                - Called on pause and drag end (user-initiated; short morph)
 * @param {function} [opts.onPeriodicRebuild]    - Called by the 8s throttle during playback (long morph).
 *                                                 Defaults to onPause if not provided.
 * @param {function} [opts.getSolarWindData]     - Optional: (unixSeconds) → {Dst, Bz, ...} | null
 *                                                 Used to color the timeline background by storm intensity.
 * @returns {{ setTime(isoString): void, getSimTimeAt(ms): string, refreshColors(): void, destroy(): void }}
 */
export function createTimeline({ initialTime, onTimeChange, onPause, onPeriodicRebuild, getSolarWindData }) {
  const _onPeriodicRebuild = onPeriodicRebuild || onPause;
  let currentTime    = new Date(initialTime);
  let viewDate       = utcStartOfDay(currentTime);
  let playing        = false;
  let speed          = 60;  // sim-seconds per real-second
  let lastRealMs     = null;
  let lastRebuildMs  = 0;
  let isDragging     = false;

  // --- Build DOM ---
  injectStyles();

  const container = document.createElement('div');
  container.id = 'timeline';
  container.innerHTML = `
    <div id="tl-controls">
      <button class="tl-btn" id="tl-prev" title="Previous week">⏮</button>
      <div id="tl-clock">
        <div id="tl-date"></div>
        <div id="tl-time"></div>
      </div>
      <button class="tl-btn" id="tl-next" title="Next week">⏭</button>
      <button class="tl-btn" id="tl-play" title="Play / Pause">▶</button>
      <select class="tl-select" id="tl-speed" title="Playback speed">
        <option value="1">1×</option>
        <option value="60" selected>60×</option>
        <option value="3600">3600×</option>
        <option value="86400">86400×</option>
      </select>
      <button class="tl-btn" id="tl-now" title="Jump to now">Now</button>
    </div>
    <div id="tl-bar" title="Timeline background color: storm intensity derived from Dst ring-current index + IMF Bz (southward field coupling). Blue = quiet, amber = moderate, red = severe."></div>
    <div id="tl-legend">
      <div class="tl-gauge" id="tl-gauge-kp"
           title="Kp index (0–9): overall geomagnetic activity level derived from solar wind speed, density, and Dst. Green (Kp &lt; 3) = quiet conditions. Amber (3–5) = moderate storm, elevated radiation belt activity. Red (&gt; 5) = severe geomagnetic storm — outer belt intensifies, aurora visible at lower latitudes.">
        <span class="tl-gauge-lbl">Kp</span>
        <span class="tl-gauge-num" id="tl-kp-val">–</span>
        <div class="tl-gauge-track">
          <div class="tl-gauge-fill" id="tl-kp-fill"></div>
          <div class="tl-gauge-marker" id="tl-kp-mk"></div>
        </div>
      </div>
      <div class="tl-gauge" id="tl-gauge-dst"
           title="Dst index (nT): disturbance storm time — measures the global ring current in the inner magnetosphere. Near 0 = quiet. −50 nT = moderate storm. −150 nT = intense storm (outer belt electrons injected, slot region fills). Background colors on the timeline reflect Dst + IMF Bz.">
        <span class="tl-gauge-lbl">Dst</span>
        <span class="tl-gauge-num" id="tl-dst-val">– nT</span>
        <div class="tl-gauge-track">
          <div class="tl-gauge-fill" id="tl-dst-fill"></div>
          <div class="tl-gauge-marker" id="tl-dst-mk"></div>
        </div>
      </div>
      <div class="tl-gauge" id="tl-gauge-bz"
           title="IMF Bz (nT): interplanetary magnetic field north–south component. Southward (negative) Bz opens the magnetopause via magnetic reconnection — the primary trigger for geomagnetic storms. +20 nT = strongly northward (protective). −20 nT = strongly southward (storm driver). Values below −5 nT are significant.">
        <span class="tl-gauge-lbl">Bz</span>
        <span class="tl-gauge-num" id="tl-bz-val">– nT</span>
        <div class="tl-gauge-track">
          <div class="tl-gauge-fill" id="tl-bz-fill"></div>
          <div class="tl-gauge-marker" id="tl-bz-mk"></div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  // --- Cached element references ---
  const elDate    = container.querySelector('#tl-date');
  const elTime    = container.querySelector('#tl-time');
  const elPlayBtn = container.querySelector('#tl-play');
  const bar       = container.querySelector('#tl-bar');
  const elKpVal   = container.querySelector('#tl-kp-val');
  const elKpFill  = container.querySelector('#tl-kp-fill');
  const elKpMk    = container.querySelector('#tl-kp-mk');
  const elDstVal  = container.querySelector('#tl-dst-val');
  const elDstFill = container.querySelector('#tl-dst-fill');
  const elDstMk   = container.querySelector('#tl-dst-mk');
  const elBzVal   = container.querySelector('#tl-bz-val');
  const elBzFill  = container.querySelector('#tl-bz-fill');
  const elBzMk    = container.querySelector('#tl-bz-mk');

  // Canvas for solar wind intensity background
  const swCanvas = document.createElement('canvas');
  swCanvas.id = 'tl-sw-canvas';
  bar.appendChild(swCanvas);

  let elPlayhead = null;

  // Last-written values — guard textContent writes to avoid needless DOM mutations
  let lastDateStr     = '';
  let lastTimeStr     = '';
  let lastPlayingIcon = '';

  // --- Solar wind intensity canvas ---
  function paintSolarWind() {
    if (!getSolarWindData) return;
    const W = bar.clientWidth;
    const H = bar.clientHeight;
    if (W === 0 || H === 0) return;
    if (swCanvas.width !== W || swCanvas.height !== H) {
      swCanvas.width  = W;
      swCanvas.height = H;
    }
    const ctx = swCanvas.getContext('2d');
    ctx.clearRect(0, 0, W, H);
    const hours = WINDOW_DAYS * 24; // 168
    for (let i = 0; i < hours; i++) {
      const unixSec = (viewDate.getTime() + i * 3600_000) / 1000;
      const sw = getSolarWindData(unixSec);
      ctx.fillStyle = intensityColor(sw);
      const x     = Math.floor(i       / hours * W);
      const nextX = Math.floor((i + 1) / hours * W);
      ctx.fillRect(x, 0, (nextX - x) || 1, H);
    }
  }

  // ResizeObserver repaints the canvas whenever the bar is laid out or resized
  const ro = new ResizeObserver(() => paintSolarWind());
  ro.observe(bar);

  // --- Tick marks ---
  function buildTicks() {
    bar.querySelectorAll('.tl-tick-major, .tl-tick-minor').forEach(el => el.remove());

    // Major ticks at day boundaries (0–7 days)
    for (let d = 0; d <= WINDOW_DAYS; d++) {
      const t = new Date(viewDate.getTime() + d * 86400_000);
      const div = document.createElement('div');
      div.className = 'tl-tick-major';
      div.style.left = (d / WINDOW_DAYS * 100) + '%';
      const label = document.createElement('span');
      label.className = 'tl-label';
      label.textContent = t.toLocaleDateString('en', { month: 'short', day: 'numeric', timeZone: 'UTC' });
      div.appendChild(label);
      bar.appendChild(div);
    }

    // Minor ticks at 12h marks (midday of each day)
    for (let d = 0; d < WINDOW_DAYS; d++) {
      const div = document.createElement('div');
      div.className = 'tl-tick-minor';
      div.style.left = ((d + 0.5) / WINDOW_DAYS * 100) + '%';
      bar.appendChild(div);
    }

    // Ensure playhead is last (on top); update cached ref
    elPlayhead = bar.querySelector('#tl-playhead');
    if (!elPlayhead) {
      elPlayhead = document.createElement('div');
      elPlayhead.id = 'tl-playhead';
    }
    bar.appendChild(elPlayhead);

    paintSolarWind();
  }

  // --- Display update ---
  function updateDisplay() {
    const dateStr = currentTime.toLocaleDateString('en', {
      month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    });
    if (dateStr !== lastDateStr) { elDate.textContent = dateStr; lastDateStr = dateStr; }

    const timeStr = currentTime.toISOString().slice(11, 16) + ' UTC';
    if (timeStr !== lastTimeStr) { elTime.textContent = timeStr; lastTimeStr = timeStr; }

    const pct = (currentTime.getTime() - viewDate.getTime()) / WINDOW_MS;
    if (elPlayhead) elPlayhead.style.left = Math.max(0, Math.min(1, pct)) * 100 + '%';

    const icon = playing ? '⏸' : '▶';
    if (icon !== lastPlayingIcon) { elPlayBtn.textContent = icon; lastPlayingIcon = icon; }
  }

  // --- Bar mouse interaction ---
  function seekToEvent(e) {
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    currentTime = new Date(viewDate.getTime() + pct * WINDOW_MS);
    updateDisplay();
    onTimeChange(currentTime.toISOString().slice(0, 16));
  }

  function onDrag(e)  { if (isDragging) seekToEvent(e); }
  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup',   onDragEnd);
    onPause();
  }

  bar.addEventListener('mousedown', (e) => {
    isDragging = true;
    seekToEvent(e);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup',   onDragEnd);
  });

  // --- Button handlers ---
  container.querySelector('#tl-play').addEventListener('click', () => {
    playing = !playing;
    if (!playing) {
      lastRebuildMs = 0;
      onPause();
    }
    updateDisplay();
  });

  container.querySelector('#tl-prev').addEventListener('click', () => {
    viewDate    = new Date(viewDate.getTime()    - WINDOW_MS);
    currentTime = new Date(currentTime.getTime() - WINDOW_MS);
    buildTicks();
    updateDisplay();
    onTimeChange(currentTime.toISOString().slice(0, 16));
    onPause();
  });

  container.querySelector('#tl-next').addEventListener('click', () => {
    viewDate    = new Date(viewDate.getTime()    + WINDOW_MS);
    currentTime = new Date(currentTime.getTime() + WINDOW_MS);
    buildTicks();
    updateDisplay();
    onTimeChange(currentTime.toISOString().slice(0, 16));
    onPause();
  });

  container.querySelector('#tl-now').addEventListener('click', () => {
    currentTime = new Date();
    viewDate    = utcStartOfDay(currentTime);
    buildTicks();
    updateDisplay();
    onTimeChange(currentTime.toISOString().slice(0, 16));
    onPause();
  });

  container.querySelector('#tl-speed').addEventListener('change', (e) => {
    speed = Number(e.target.value);
  });

  // Initial render
  buildTicks();
  updateDisplay();

  // --- Public API ---
  return {
    /**
     * Advance playback by one frame. Called by the main render loop before renderer.render()
     * so that sun/moon positions are always current when the frame is drawn.
     * @param {number} now - performance.now() timestamp from the rAF callback
     */
    tick(now) {
      if (!playing || isDragging) {
        lastRealMs = null;
        return;
      }
      if (lastRealMs === null) {
        lastRealMs = now;
        return;
      }

      const dtReal = Math.min(now - lastRealMs, 100); // cap to avoid big jumps on tab hide
      lastRealMs = now;
      currentTime = new Date(currentTime.getTime() + speed * dtReal);

      // Slide the view window forward one day when the playhead reaches the right edge
      const viewEnd = viewDate.getTime() + WINDOW_MS;
      if (currentTime.getTime() >= viewEnd) {
        viewDate = new Date(viewDate.getTime() + 86400_000);
        buildTicks();
      }

      updateDisplay();
      onTimeChange(currentTime.toISOString().slice(0, 19));

      // Throttled full rebuild every 8 real seconds (long morph — smooth continuous animation)
      if (now - lastRebuildMs >= REBUILD_INTERVAL_MS) {
        lastRebuildMs = now;
        _onPeriodicRebuild();
      }
    },

    /**
     * Set the current time from outside (e.g. lil-gui sync).
     * Does NOT fire onTimeChange or onPause callbacks.
     */
    setTime(isoString) {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return;
      currentTime = d;
      viewDate    = utcStartOfDay(currentTime);
      buildTicks();
      updateDisplay();
    },

    /** Current playback speed in sim-seconds per real-second. */
    getSpeed() { return speed; },

    /**
     * Returns the ISO sim-time that will be current `realFutureMs` real milliseconds from now.
     * When paused, returns the current sim-time (no advancement).
     */
    getSimTimeAt(realFutureMs) {
      if (!playing) return currentTime.toISOString();
      return new Date(currentTime.getTime() + speed * realFutureMs).toISOString();
    },

    /**
     * Repaint the solar wind color canvas.
     * Call after new solar wind data has been loaded so the colors reflect the data.
     */
    refreshColors() {
      paintSolarWind();
    },

    /**
     * Update the Kp and Dst gauge bars with current values.
     * @param {number} kp  - Kp index (0–9)
     * @param {number} dst - Dst index in nT (negative during storms)
     */
    updateGauges(kp, dst, bz) {
      // ── Kp gauge (0–9 scale) ──────────────────────────────────────────────
      if (elKpVal && elKpFill && elKpMk) {
        const kpSafe  = kp ?? 0;
        const kpPct   = Math.min(1, Math.max(0, kpSafe / 9)) * 100;
        const kpColor = kpSafe < 3 ? '#44aa66' : kpSafe < 5 ? '#cc8822' : '#cc3333';
        elKpVal.textContent       = kpSafe.toFixed(1);
        elKpVal.style.color       = kpColor;
        elKpFill.style.width      = kpPct + '%';
        elKpFill.style.background = kpColor;
        elKpMk.style.left         = kpPct + '%';
      }

      // ── Dst gauge (storm intensity, 0=quiet → 1 at Dst=−200) ─────────────
      if (elDstVal && elDstFill && elDstMk) {
        const dstSafe   = dst ?? 0;
        const stormFrac = Math.min(1, Math.max(0, -dstSafe / 200));
        const dstColor  = dstSafe > -50 ? '#4488aa' : dstSafe > -100 ? '#cc8822' : '#cc3333';
        elDstVal.textContent       = `${Math.round(dstSafe)} nT`;
        elDstVal.style.color       = dstColor;
        elDstFill.style.width      = (stormFrac * 100) + '%';
        elDstFill.style.background = dstColor;
        elDstMk.style.left         = (stormFrac * 100) + '%';
      }

      // ── IMF Bz gauge (southward = storm driver; fill grows as Bz goes negative) ──
      if (elBzVal && elBzFill && elBzMk) {
        const bzSafe    = bz ?? 0;
        const southFrac = Math.min(1, Math.max(0, -bzSafe / 20));
        const bzColor   = bzSafe > -5 ? '#4488aa' : bzSafe > -10 ? '#cc8822' : '#cc3333';
        elBzVal.textContent       = `${bzSafe >= 0 ? '+' : ''}${bzSafe.toFixed(1)} nT`;
        elBzVal.style.color       = bzSafe > 0 ? '#557799' : bzColor;
        elBzFill.style.width      = (southFrac * 100) + '%';
        elBzFill.style.background = bzColor;
        elBzMk.style.left         = (southFrac * 100) + '%';
      }
    },

    destroy() {
      ro.disconnect();
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup',   onDragEnd);
      container.remove();
    },
  };
}
