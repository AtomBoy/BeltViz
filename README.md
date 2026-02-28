# Magnetospheric Radiometric Cybernetic Garden
## MagRad-CG

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

### Solar Wind & Magnetosphere

When enabled, external solar wind effects are computed using the **Tsyganenko T89c empirical model** (Tsyganenko 1989, updated 1992). T89c is a semi-empirical model fit to satellite data that computes the complete external magnetosphere field from a single parameterized function call. It captures all major current systems simultaneously:

- **Magnetotail current sheet** (warped, parabolic shape) — stretches nightside field lines into anti-parallel lobes
- **Ring current** (symmetric + partial) — southward field in the inner magnetosphere, enhanced during storms
- **Closure currents** — maintain divergence-free topology
- **Chapman-Ferraro + Birkeland currents** — compress the dayside field

T89c is parameterized by a single Kp index (0–6+), mapped from the solar wind inputs (speed, density, IMF Bz, Dst). The dipole tilt angle (seasonal variation) is included via the solar declination.

The **Shue 1998** magnetopause model is retained as an outer boundary: T89c computes field values everywhere, and the Shue surface provides a smooth fade to zero outside the magnetopause.

Storm presets range from quiet (Kp=0, standoff ~12 Re) to severe storm (Kp=6+, standoff ~6 Re). All field lines respond to solar wind conditions in real time. A semi-transparent magnetopause surface can be toggled on to show the boundary.

### Controls

- **IGRF Degree (1-13)**: Degree 1 shows the pure tilted dipole. Higher degrees add multipole detail — asymmetries become visible, especially in the South Atlantic region.
- **Latitude Bands / Longitudes**: Control field line density.
- **Line Thickness**: Adjust tube radius.
- **Auto Rotate**: Toggle globe rotation.
- **Solar Wind**: Enable/disable external field, select storm presets, adjust speed/density/IMF Bz/Dst/sun direction individually.
- **Show Magnetopause**: Toggle the translucent magnetopause boundary surface.
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

## Data Sources & References

- **IGRF-14 coefficients**: [NOAA NCEI](https://www.ncei.noaa.gov/products/international-geomagnetic-reference-field) / [IAGA V-MOD](https://www.ngdc.noaa.gov/IAGA/vmod/igrf.html)
- **Earth texture**: NASA Blue Marble
- **T89c external field model**: Tsyganenko N.A., "A magnetospheric magnetic field model with a warped tail current sheet", *Planet. Space Sci.*, v.37, pp.5–20, 1989. Updated 1992 with tilt-angle-dependent tail terms.
- **T89c JavaScript implementation**: Ported from the Python [geopack](https://github.com/tsssss/geopack) library by Sheng Tian, which is itself a port of Tsyganenko's original Fortran code.
- **Magnetopause model**: Shue et al. 1998, "Magnetopause location under extreme solar wind conditions", *JGR* 103(A8):17691-17700 ([doi:10.1029/98JA01103](https://doi.org/10.1029/98JA01103))
- **Magnetopause shape**: Shue et al. 1997, "A new functional form to study the solar wind control of the magnetopause size and shape", *JGR* 102(A5):9497-9511 ([doi:10.1029/97JA00196](https://doi.org/10.1029/97JA00196))

## Roadmap

- [x] IGRF-14 magnetic field lines (Phase 1)
- [x] L-shell/|B| isosurfaces, radiation belts, clipping planes, satellite probe (Phase 2)
- [x] Solar wind interaction — T89c empirical external field, Shue magnetopause (Phase 3)
- [X] Tsyganenko T96/T01 model for multi-parameter storm driving (requires 6 SW inputs vs T89c's single Kp)
- [ ] Van Allen radiation belt particle visualization
- [ ] Satellite orbit display (SGP4/TLE)
- [ ] Time-varying field animation using secular variation coefficients
