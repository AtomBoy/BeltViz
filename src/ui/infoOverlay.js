/**
 * Create the info overlay HTML element.
 */
export function createInfoOverlay() {
  const div = document.createElement('div');
  div.id = 'info-overlay';
  div.innerHTML = `
    <h3>MagRad-CG  by <a href="https://www.atomodo.com/">AtOmOdO</a></h3>
    <p><strong>Magnetospheric Radiometric Cybernetic Garden</strong></p>
    <p class="attribution"><a href="/about.html" target="_blank">About &amp; Data Sources</a></p>
  `;
  document.body.appendChild(div);

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #info-overlay {
      position: fixed;
      top: 20px;
      left: 20px;
      background: rgba(0, 5, 20, 0.75);
      color: #c8ddf0;
      padding: 12px 15px;
      border-radius: 16px;
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 13px;
      line-height: 1.5;
      max-width: 360px;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(100, 150, 200, 0.2);
      z-index: 10;
    }
    #info-overlay h3 {
      margin: 0 0 6px 0;
      font-size: 16px;
      color: #88ccff;
      letter-spacing: 1px;
    }
    #info-overlay p { margin: 4px 0; }
    #info-overlay .legend { margin-top: 8px; }
    #info-overlay .attribution {
      font-size: 11px;
      color: #88a0b8;
    }
    #info-overlay a {
      color: #88ccff;
      text-decoration: none;
    }
    #info-overlay a:hover { text-decoration: underline; }
  `;
  document.head.appendChild(style);

  return div;
}

/**
 * Set the solar wind data source note in the info overlay.
 * Called once after the historical data file is loaded.
 * @param {string} text - e.g. 'Solar wind: NASA OMNI2 Hourly (2025)'
 */
export function setSolarWindDataNote(text) {
  const el = document.getElementById('sw-data-note');
  if (el) el.textContent = text;
}
