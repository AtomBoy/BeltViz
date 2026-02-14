# BeltViz

3D visualization of Earth's magnetic field lines computed from the IGRF-14 (International Geomagnetic Reference Field) spherical harmonic model.

## Quick Start

```bash
npm install
node scripts/convert-igrf.js   # generate coefficient JSON from NOAA data
npm run dev                     # open http://localhost:5173
```

## What It Does

BeltViz traces magnetic field lines from the IGRF-14 model and renders them on an interactive 3D globe. The IGRF model represents Earth's main magnetic field as a degree-13 spherical harmonic expansion using Gauss coefficients (g_n^m, h_n^m) published by NOAA/NCEI.

Field lines are computed entirely client-side: the app evaluates the spherical harmonic potential, computes B(r,theta,phi), and traces lines via RK4 integration from seed points on Earth's surface.

### Controls

- **IGRF Degree (1-13)**: Degree 1 shows the pure tilted dipole. Higher degrees add multipole detail — asymmetries become visible, especially in the South Atlantic region.
- **Latitude Bands / Longitudes**: Control field line density.
- **Line Thickness**: Adjust tube radius.
- **Auto Rotate**: Toggle globe rotation.
- Mouse drag to orbit, scroll to zoom.

## Tech Stack

- **Three.js** — 3D rendering (TubeGeometry for field lines, custom ShaderMaterial for atmosphere)
- **Vite** — Dev server and bundler
- **lil-gui** — Control panel
- **Vitest** — Test suite

## Project Structure

```
src/
  physics/          # IGRF evaluation, Legendre polynomials, RK4 field line tracing
  scene/            # Three.js globe, field line meshes, lighting, camera controls
  ui/               # GUI control panel and info overlay
  utils/            # Constants and color mapping
scripts/
  convert-igrf.js   # Converts NOAA coefficient text files to JSON (supports any epoch 1900-2025)
  igrf14coeffs.txt  # Source IGRF-14 coefficients from NOAA
tests/              # Vitest suite: coordinates, Legendre, IGRF field values, field line tracing
public/
  data/             # Generated igrf14coeffs.json
  textures/         # Earth day map texture
```

## Data Sources

- **IGRF-14 coefficients**: [NOAA NCEI](https://www.ncei.noaa.gov/products/international-geomagnetic-reference-field) / [IAGA V-MOD](https://www.ngdc.noaa.gov/IAGA/vmod/igrf.html)
- **Earth texture**: NASA Blue Marble

## Roadmap

- [ ] Van Allen radiation belt particle visualization
- [ ] Solar wind interaction
- [ ] Satellite orbit display
- [ ] Time-varying field animation using secular variation coefficients
