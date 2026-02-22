/**
 * Create the info overlay HTML element.
 */
export function createInfoOverlay() {
  const div = document.createElement('div');
  div.id = 'info-overlay';
  div.innerHTML = `
    <h3>MagRad-CG</h3>
    <p><strong>Magnetospheric Radiometric Cybernetic Garden</strong></p>
    <p><a href="https://www.atomodo.com/">AtOmOdO</a></p>
    <p>Computed from the IGRF-14 spherical harmonic model
    using Gauss coefficients up to degree 13.</p>
    <p class="attribution">
      Data: <a href="https://www.ncei.noaa.gov/products/international-geomagnetic-reference-field" target="_blank">NOAA NCEI IGRF-14</a><br>
      Texture: NASA Blue Marble
    </p>
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
      padding: 16px 20px;
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
    #info-overlay .warm { color: #ff6644; font-size: 16px; }
    #info-overlay .cool { color: #44aaff; font-size: 16px; margin-left: 8px; }
    #info-overlay .attribution {
      margin-top: 10px;
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
