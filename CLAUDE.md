# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (http://localhost:5173)
npm run build        # Production build to dist/
npm test             # Run all tests (vitest)
npm run test:watch   # Run tests in watch mode
npx vitest run tests/igrf.test.js   # Run a single test file
```

### IGRF coefficient conversion

The source coefficients live in `scripts/igrf14coeffs.txt` (from NOAA). To regenerate the JSON:

```bash
node scripts/convert-igrf.js                              # latest epoch (2025)
node scripts/convert-igrf.js scripts/igrf14coeffs.txt 2000.0  # specific epoch
```

Output goes to `public/data/igrf14coeffs.json`. The converter supports all epochs from 1900-2025 in 5-year steps. SV (secular variation) labels like "2025-30" are skipped by detecting the hyphen.

### Solar wind data conversion

Historical hourly solar wind data (with G1/G2 for T01) comes from `public/data/WGhour.d` — a file
produced by the [rweigel/QinDenton](https://github.com/rweigel/QinDenton) Fortran tool. It covers
1963 to present and is the preferred source. When that file is present the script uses it
automatically. To regenerate or add a year:

```bash
node scripts/convert-solarwind.js 2025          # auto-detects WGhour.d, writes public/data/solarwind-2025.json
node scripts/convert-solarwind.js 2024          # any year back to 1963
node scripts/convert-solarwind.js 2025 public/data/WGhour.d  # explicit WGhour.d path
node scripts/convert-solarwind.js 2025 /tmp/omni2_2025.dat   # explicit OMNI2 file (no G1/G2)
```

If WGhour.d is absent the script falls back to ISWA Qin-Denton (years ≤2019, network) or NASA OMNI2
(any year, network, but G1/G2 will be null). Output goes to `public/data/solarwind-YYYY.json`.
The format is columnar JSON (version 2.0) with Unix epoch timestamps and seven parameters: `vSw`
(km/s), `nSw` (cm⁻³), `By` (nT GSM), `Bz` (nT GSM), `Dst` (nT), `G1`, `G2`. Missing hours are
stored as `null`; the app interpolates at runtime. See `SOLAR_WIND_DATA.md` for the full format spec.

## Architecture

The app is a static client-side web application. No backend. All magnetic field computation runs in JavaScript in the browser.

### Two coordinate systems

**Physics coordinates** (km): Used by everything in `src/physics/`. Earth radius = 6371.2 km. Spherical coords use colatitude theta (0 at north pole, pi at south) and east longitude phi.

**Scene coordinates** (unitless): Used by everything in `src/scene/`. Earth is a unit sphere (radius = 1.0). Y-axis is up (north pole). Conversion: `scene = km / 6371.2` (see `KM_TO_SCENE` in constants.js).

### Data flow

```
igrf14coeffs.json → computeB(r,θ,φ) → traceFieldLine() → buildFieldLineGroup() → Three.js scene
     coeffs          [Br,Bt,Bp] nT      [[x,y,z]] km       TubeGeometry meshes
```

1. `src/physics/igrf.js:computeB()` evaluates the spherical harmonic expansion to get B field vector at any point. Uses `legendre.js` for Schmidt semi-normalized associated Legendre polynomials.
2. `src/physics/fieldLineTracer.js:traceFieldLine()` does RK4 integration in Cartesian coordinates, tracing both directions from a seed point until hitting Earth's surface or escaping beyond 12 Re.
3. `src/scene/fieldLines.js:buildFieldLineGroup()` converts km-space point arrays to Three.js TubeGeometry meshes with CatmullRomCurve3 smoothing.
4. `src/main.js` orchestrates everything: loads coefficients, generates seed points, traces lines, builds meshes, runs the render loop.

### Physics numerical details

- Legendre polynomials clamp theta to [1e-10, pi-1e-10] to avoid pole singularities
- `computeB` accepts a `maxDegree` parameter (1-13) to control spherical harmonic truncation. Degree 1 = pure dipole. The UI exposes this as a slider.
- Field line tracer uses 200 km step size, bidirectional tracing (positive and negative ds), terminates at r < 0.99*Re or r > 12*Re
- Seed points are placed at configurable magnetic latitudes in the northern hemisphere only; the tracer follows lines to the southern hemisphere automatically

### Rebuilding visualizations

When GUI controls change parameters that affect computation (IGRF degree, latitude bands, longitude count), `main.js:rebuildFieldLines()` disposes all old geometries and retraces from scratch. Visual-only changes (tube radius, visibility, auto-rotate) skip recomputation. The same dispose-and-rebuild pattern applies to isosurfaces.

### Isosurface pipeline (Phase 2)

```
coeffs → scalarFieldWorker (Web Worker) → Float32Array grid → marchingCubes.extractIsosurface() → isosurfaces.buildIsosurfaceGroup() → scene
              computeBMagnitude on 3D grid         cached          per isovalue level              Three.js meshes with transparency
```

- `src/physics/scalarFieldWorker.js` — Web Worker evaluating |B| on a 64^3 (or 48/96) Cartesian grid spanning -12 Re to +12 Re. Physics modules import directly (pure functions, no DOM). Grid is cached; only recomputed on `maxDegree` or `resolution` change.
- `src/physics/marchingCubes.js` — Custom marching cubes operating on cached Float32Array. Runs on main thread (~20-50ms per level). Skips cells with `Infinity` (Earth interior mask).
- `src/scene/isosurfaces.js` — Converts extracted geometry to Three.js meshes. `MeshPhysicalMaterial` with `depthWrite: false`, `transparent: true`, `side: DoubleSide`. Outer (weaker) surfaces get lower `renderOrder`.
- `src/scene/clippingPlanes.js` — Equatorial and meridional `THREE.Plane` instances applied via `material.clippingPlanes`. Requires `renderer.localClippingEnabled = true`.

### Radiation belt visualization

The Worker also computes L-shell grids (`computeLShellGrid`) using the dipole L-shell approximation. Marching cubes extracts paired isosurfaces at L-shell boundaries (inner belt: L=1.2–2, outer belt: L=3–6) rendered as colored semi-transparent shells via `src/scene/radiationBelts.js`.

### Solar wind external field (Phase 3)

Adds external magnetic field from solar wind interaction using the **Tsyganenko T89c** empirical model, producing the classic asymmetric magnetosphere (compressed dayside, stretched nightside tail).

```
computeB (IGRF internal) + computeExternalB (T89c) → computeTotalB → field lines, grids, environment
                                                        via insideMagnetopause fade
```

- `src/physics/t89.js` — JavaScript port of the T89c model (Tsyganenko 1989). Takes GSM position in Earth radii + Kp level (iopt 1–7) + dipole tilt (ps), returns `[bx,by,bz]` nT. 30-coefficient × 7-Kp parameter matrix. Ported from Python geopack (https://github.com/tsssss/geopack).
- `src/physics/solarWind.js` — Calls T89c for external field. Also contains: `solarWindToKp()` (maps dst/vSw/nSw → iopt 1–7), Shue 1998 magnetopause (`computeMagnetopauseDistance`), GSM transforms (`toGSM`/`fromGSM`), and `insideMagnetopause()` boundary fade. Pure physics, no DOM.
- `src/physics/totalField.js` — Thin wrapper: `computeTotalB(r,θ,φ,coeffs,maxDegree,solarWindParams)` returns IGRF+external combined, confined by magnetopause. Falls back to pure IGRF when `solarWindParams` is null/disabled.
- `src/physics/coordinates.js` — Added `bCartesianToSpherical()` inverse transform for converting Cartesian B vectors back to spherical components.
- `src/scene/magnetopauseMesh.js` — Parametric surface mesh of the Shue magnetopause boundary, lazy-loaded via dynamic import.

The `solarWindParams` object (`{ vSw, nSw, imfBz, dst, sunLonRad, ps, enabled }`) threads through: `fieldLineTracer` (via `options.solarWindParams`), `magneticEnvironment` (6th parameter). Field lines and the magnetopause mesh show solar wind asymmetry. `ps` is the dipole tilt angle (radians), approximated from solar declination.

**Important**: Scalar field grids (L-shell, |B|) always use pure IGRF — the dipole L-shell approximation (`L = r/(Re*cos²λ_m)`) breaks down with external fields, producing artifacts at the tail current neutral sheet and magnetopause boundary. This is a known limitation of McIlwain L in disturbed fields (Roederer & Lejosne 2018). The correct fix requires Roederer L* (drift shell tracing) or full Tsyganenko model — both deferred.

Storm presets: Quiet (v=400, n=5, Bz=0, Dst=0), Moderate Storm (v=500, n=10, Bz=-5, Dst=-50), Severe Storm (v=700, n=20, Bz=-15, Dst=-150).

### Satellite environment probe

- `src/physics/magneticEnvironment.js` — Computes L-shell (dipole approximation: `tan(λ_m) = |Br|/(2*Bperp)`, `L = r/(Re*cos²λ_m)`), radiation belt region classification, SAA proximity at any point. Reuses `computeB`.
- `src/physics/satellitePosition.js` — Geographic lat/lon/alt to physics coordinates (Y-up Cartesian + spherical). Ready for future satellite.js (SGP4/TLE) integration.
- `src/scene/satelliteMarker.js` — Small emissive sphere at configured position.
- `src/ui/environmentReadout.js` — Fixed-position HTML overlay (top-left, below info overlay) showing |B|, L-shell, region, SAA status. Styled to match infoOverlay.
- `src/ui/timeline.js` — Bottom-of-screen timeline bar. Play/pause, speed (1×/60×/3600×/86400×), day ◄/► navigation, draggable playhead. Calls `lightUpdateDatetime` each rAF frame (seeks Three.js keyframes), `updateDatetime` on pause/drag-end/every 2s throttle (full field-line rebuild). See `ANIMATION.md` for the full sun/moon animation architecture.

## Testing

Tests are in `tests/` using vitest. They load `public/data/igrf14coeffs.json` directly from disk via `readFileSync`. Test suites:

- `coordinates.test.js` — spherical/Cartesian roundtrips and field vector rotation
- `legendre.test.js` — polynomial values against known analytic formulas, NaN safety at poles
- `igrf.test.js` — dipole physics (pole/equator ratio, r^-3 decay), full IGRF magnitude ranges
- `fieldLineTracer.test.js` — closed field lines return to surface, altitude scaling with latitude, point continuity
- `marchingCubes.test.js` — sphere isosurface extraction, vertex positions, normals, Earth masking, empty output for out-of-range values
- `magneticEnvironment.test.js` — L-shell values at equator/latitude, region classification, SAA proximity comparison
- `t89.test.js` — T89c model: iopt clamping, N-S antisymmetry, tail lobe directions, dayside CF, dipole tilt effect, NaN safety, magnitude range
- `solarWind.test.js` — dynamic pressure, standoff distance, magnetopause geometry, GSM transforms, solarWindToKp mapping, external B behaviors, NaN safety
- `totalField.test.js` — IGRF passthrough when disabled, subsolar enhancement, magnetopause confinement
- `satellitePosition.test.js` — geographic-to-physics coordinate conversion, pole positions, altitude offsets

## Documentation & Citations

When adding a new physics model, algorithm, or data source:
- Add an entry to the **Data Sources & References** section of `README.md` with author, title, journal/source, year, and DOI or URL where available.
- If porting from a third-party library, cite both the original paper and the library used as the implementation reference.

## TODOs based on user feedback

### Imediate issues

- [X] Complete the interrupted work to show the moon and place it in the propper location and implement time-based positioning of everything. See context or ask for more detail.
- [X] The field lines had a bug where the simulation stopped before the end of longer field lines becuase they used limits that worked ok in scenarios with no solar wind. A fix was made and it appeared to work, but it turns out that it only worked in the 'Quiet' preset. Stronger solar wind conditions reveal the bug again which shows the field lines going in straight lines at 45 degree angles to the orbital plane. Revisit the previous fix that increased the limits on the field line simulation and ensure they work on very long field lines as seen in the worst-case solar wind scenarios. **Fixed by replacing the hand-crafted model with T89c (Tsyganenko 1989).**
- [ ] The field lines had a bug where they were drawn too many times during 'Sun Direction' adjustment. This was incorrect, but it looked good. Lets explore methods of drawing more field lines. It might be interesting to draw multiple lines reflecting the range of certianty in the model or expected varianace. The longer lines would vary more.
- [X] The info for the satellite is hidden under the ui. Move it to the top left. **Fixed: environmentReadout moved to top-left (top:155px) below the info overlay.**
- [X] The year (epoch) of the IGRF model that's being used should be shown in infoOverlay.js.
- [X] We were able to run the code at https://github.com/rweigel/QinDenton/tree/master and produce the file `public/data/WGhour.d`. **WGhour.d is now the preferred data source.** It covers 1963–present (current!), includes G1/G2 (required for T01), and the script auto-detects it. Sanity check confirmed: 8760/8760 records with zero nulls for 2022 and 2025; G1/G2 values physically plausible (G1 range 0–67, mean ~2.3).
- [ ] Grouping the solar wind data by year makes the data file a little large. Our web server is low bandwidth. Many users of the tool won't scroll more than a few days. Lets make monthly data files and load them as needed.
- [ ] Create an about.html page to explain what the app does and cite our data sources and the software that we have used. Much of this content will be in our .md files that we've used for planning.

### Longer term - Phase 4, 5, 6 - we're not implementing these yet but keeping them in mind

- [X] Animation over time. **Implemented via timeline bar (`src/ui/timeline.js`): play/pause, 1×/60×/3600×/86400× speed, day navigation, scrubbing. Sun/moon use Three.js AnimationMixer with pre-computed keyframes (5-min intervals, 289 per day). Field lines rebuild every 2s during playback. See `ANIMATION.md`.**
- [X] Solar wind driven by actual historical data. Hourly resoloution is probably a good start. See [https://www.ncei.noaa.gov/cloud-access/space-weather-portal/overview?sat=DSCOVR] for likely data source.
- [ ] We want to show satellites moving in orbit based on a tle file (also called a 3le file). We've used satellite-js for this before [https://www.npmjs.com/package/satellite.js/v/1.3.0]. (This is the same TODO item as the 'Satellite orbit display (SGP4/TLE)' in the README.md roadmap section.) There is a file of recent tle data in `public/data/Space-Track.all.3le.txt`. We won't want to use every record. Lets filter out the 'junk' such as debris, rocket bodies, and other less interesting bodies.
- [ ] Show satellite CAD model on satellite selection. There is an example CAD file in @public/models . When a satellite is selected, show the model in the upper left corner and draw a line to its location in orbit in the manner of a 'detail inset' figure.