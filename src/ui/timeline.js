/**
 * Timeline control bar.
 *
 * A Cesium-inspired horizontal timeline at the bottom of the screen for
 * scrubbing and animating through time. Simpler than Cesium: flat dark
 * background, no color gradients, 6-hour major ticks only.
 *
 * Playback model:
 *   - Every rAF frame: calls onTimeChange(iso16) → lightweight sun/moon update
 *   - Every 2 real seconds: calls onPause() → full field-line rebuild (throttled)
 *   - On pause / drag end: calls onPause() → final rebuild
 */

const REBUILD_INTERVAL_MS = 8000;

function utcStartOfDay(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function formatTickLabel(date, showDate) {
  const hh = String(date.getUTCHours()).padStart(2, '0');
  const mm = String(date.getUTCMinutes()).padStart(2, '0');
  const timeStr = `${hh}:${mm}`;
  if (showDate) {
    const month = date.toLocaleDateString('en', { month: 'short', timeZone: 'UTC' });
    const day   = date.getUTCDate();
    return `${timeStr} ${month} ${day}`;
  }
  return timeStr;
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
    .tl-tick-major {
      position: absolute; top: 0; bottom: 0; width: 1px;
      background: rgba(100, 150, 200, 0.3);
      pointer-events: none;
    }
    .tl-tick-major .tl-label {
      position: absolute; bottom: 7px; left: 4px;
      font-size: 10px; color: #6688aa; white-space: nowrap;
    }
    .tl-tick-minor {
      position: absolute; top: 44%; bottom: 0; width: 1px;
      background: rgba(100, 150, 200, 0.15);
      pointer-events: none;
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
  `;
  document.head.appendChild(style);
}

/**
 * Create a timeline control bar.
 *
 * @param {object} opts
 * @param {Date|string} opts.initialTime - Starting time
 * @param {function} opts.onTimeChange       - Called every frame during play/scrub with iso16 string
 * @param {function} opts.onPause            - Called on pause and drag end (user-initiated; short morph)
 * @param {function} [opts.onPeriodicRebuild] - Called by the 8s throttle during playback (long morph).
 *                                              Defaults to onPause if not provided.
 * @returns {{ setTime(isoString): void, destroy(): void }}
 */
export function createTimeline({ initialTime, onTimeChange, onPause, onPeriodicRebuild }) {
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
      <button class="tl-btn" id="tl-prev" title="Previous day">◀</button>
      <div id="tl-clock">
        <div id="tl-date"></div>
        <div id="tl-time"></div>
      </div>
      <button class="tl-btn" id="tl-next" title="Next day">▶</button>
      <button class="tl-btn" id="tl-play" title="Play / Pause">▶</button>
      <select class="tl-select" id="tl-speed" title="Playback speed">
        <option value="1">1×</option>
        <option value="60" selected>60×</option>
        <option value="3600">3600×</option>
        <option value="86400">86400×</option>
      </select>
      <button class="tl-btn" id="tl-now" title="Jump to now">Now</button>
    </div>
    <div id="tl-bar"></div>
  `;
  document.body.appendChild(container);

  // --- Cached element references (set once; avoids per-frame querySelector) ---
  const elDate    = container.querySelector('#tl-date');
  const elTime    = container.querySelector('#tl-time');
  const elPlayBtn = container.querySelector('#tl-play');
  let   elPlayhead = null; // set by buildTicks() on first call and kept current

  // Last-written values — guard textContent writes to avoid needless DOM mutations
  let lastDateStr = '';
  let lastTimeStr = '';
  let lastPlayingIcon = ''; // '' forces first write

  // --- Tick marks ---
  function buildTicks() {
    const bar = container.querySelector('#tl-bar');
    // Remove old ticks (not the playhead)
    bar.querySelectorAll('.tl-tick-major, .tl-tick-minor').forEach(el => el.remove());

    // Major ticks every 6 hours: 0h, 6h, 12h, 18h, 24h
    for (let h = 0; h <= 24; h += 6) {
      const t = new Date(viewDate.getTime() + h * 3600_000);
      const div = document.createElement('div');
      div.className = 'tl-tick-major';
      div.style.left = (h / 24 * 100) + '%';
      const label = document.createElement('span');
      label.className = 'tl-label';
      label.textContent = formatTickLabel(t, h === 0 || h === 24);
      div.appendChild(label);
      bar.appendChild(div);
    }

    // Minor ticks every 3 hours (no label): 3h, 9h, 15h, 21h
    for (let h = 3; h < 24; h += 6) {
      const div = document.createElement('div');
      div.className = 'tl-tick-minor';
      div.style.left = (h / 24 * 100) + '%';
      bar.appendChild(div);
    }

    // Ensure playhead is last (on top); update cached ref
    elPlayhead = bar.querySelector('#tl-playhead');
    if (!elPlayhead) {
      elPlayhead = document.createElement('div');
      elPlayhead.id = 'tl-playhead';
    }
    bar.appendChild(elPlayhead);
  }

  // --- Display update ---
  function updateDisplay() {
    const dateStr = currentTime.toLocaleDateString('en', {
      month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
    });
    if (dateStr !== lastDateStr) { elDate.textContent = dateStr; lastDateStr = dateStr; }

    const timeStr = currentTime.toISOString().slice(11, 16) + ' UTC';
    if (timeStr !== lastTimeStr) { elTime.textContent = timeStr; lastTimeStr = timeStr; }

    const pct = (currentTime.getTime() - viewDate.getTime()) / 86400_000;
    if (elPlayhead) elPlayhead.style.left = Math.max(0, Math.min(1, pct)) * 100 + '%';

    const icon = playing ? '⏸' : '▶';
    if (icon !== lastPlayingIcon) { elPlayBtn.textContent = icon; lastPlayingIcon = icon; }
  }

  // tick() is called by the main render loop each frame instead of using its own rAF.
  // This guarantees time is advanced before renderer.render() in the same frame,
  // eliminating the 1-frame lag that causes jitter when two rAF loops compete.

  // --- Bar mouse interaction ---
  const bar = container.querySelector('#tl-bar');

  function seekToEvent(e) {
    const rect = bar.getBoundingClientRect();
    const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    currentTime = new Date(viewDate.getTime() + pct * 86400_000);
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
      lastRebuildMs = 0; // reset throttle so first tick after resume fires rebuild
      onPause();         // sync field lines to the paused sim time
    }
    updateDisplay();
  });

  container.querySelector('#tl-prev').addEventListener('click', () => {
    viewDate    = new Date(viewDate.getTime()    - 86400_000);
    currentTime = new Date(currentTime.getTime() - 86400_000);
    buildTicks();
    updateDisplay();
    onTimeChange(currentTime.toISOString().slice(0, 16));
    onPause();
  });

  container.querySelector('#tl-next').addEventListener('click', () => {
    viewDate    = new Date(viewDate.getTime()    + 86400_000);
    currentTime = new Date(currentTime.getTime() + 86400_000);
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

      // Auto-advance view window past midnight
      const viewEnd = viewDate.getTime() + 86400_000;
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

    /**
     * Returns the ISO sim-time that will be current `realFutureMs` real milliseconds from now.
     * When paused, returns the current sim-time (no advancement).
     * Used by rebuildFieldLines to target the sun position at morph-end so field lines
     * "arrive" aligned with the sun when the transition completes.
     */
    getSimTimeAt(realFutureMs) {
      if (!playing) return currentTime.toISOString();
      return new Date(currentTime.getTime() + speed * realFutureMs).toISOString();
    },

    destroy() {
      document.removeEventListener('mousemove', onDrag);
      document.removeEventListener('mouseup',   onDragEnd);
      container.remove();
    },
  };
}
