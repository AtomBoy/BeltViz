# MagRad-CG — Magnetospheric Radiometric Cybernetic Garden

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightblue.svg)](https://creativecommons.org/licenses/by/4.0/)

Interactive 3D visualization of Earth's magnetosphere: field lines, radiation belt isosurfaces, Van Allen belt particles, aurora, and historical solar wind playback. All physics runs client-side in the browser.

For physics background, model descriptions, and citations see **[public/about.html](public/about.html)**.

---

## Quick Start

```bash
npm install
node scripts/convert-igrf.js          # generate public/data/igrf/igrf14-all.json (all epochs)
node scripts/convert-solarwind.js 2025 # generate public/data/solarwind/2025-MM.json
npm run dev                            # http://localhost:5173
npm test             # run all 197 tests (vitest)
npm run test:watch   # watch mode
npm run build        # production build → dist/
```

---

## Tech Stack

Built using [Claude Code](https://claude.ai/code/family)

| Layer | Library |
|---|---|
| 3D rendering | [Three.js](https://threejs.org/) — TubeGeometry, MeshPhysicalMaterial, ShaderMaterial |
| Build / dev | [Vite](https://vitejs.dev/) |
| Control panel | [lil-gui](https://lil-gui.georgealways.com/) |
| Tests | [Vitest](https://vitest.dev/) |

---

## Project Structure

```
src/
  physics/
    igrf.js                # IGRF-14 spherical harmonic evaluation (computeB, computeBMagnitude)
    legendre.js            # Schmidt semi-normalised associated Legendre polynomials
    fieldLineTracer.js     # RK4 field-line integration; generateSeedPoints()
    fieldLineWorker.js     # Web Worker wrapper — runs traceFieldLine() off the main thread
    scalarFieldWorker.js   # Web Worker — |B| and L-shell 3D grids (64³ default); marching cubes input
    marchingCubes.js       # Marching cubes isosurface extraction from Float32Array grids
    t01.js                 # Tsyganenko T01 (2002) external field — ring current, tail, Birkeland currents
    t89.js                 # Tsyganenko T89c (legacy, kept for reference)
    solarWind.js           # computeExternalB(), insideMagnetopause() (Shue 1998), GSM transforms
    totalField.js          # computeTotalB() — IGRF + T01 + magnetopause fade
    coordinates.js         # Spherical ↔ Cartesian transforms, B-vector rotation
    magneticEnvironment.js # L-shell, belt region, SAA proximity at any point
    satellitePosition.js   # Geographic lat/lon/alt → physics Cartesian
    particleDrift.js       # Drift period (Schulz & Lanzerotti 1974), loss cone, injection rate
  scene/
    fieldLines.js          # buildFieldLineGroup() — TubeGeometry + CatmullRomCurve3
    isosurfaces.js         # buildIsosurfaceGroup() — |B| and L-shell transparent meshes
    radiationBelts.js      # buildRadiationBeltGroup() — inner/outer belt boundary meshes
    magnetopauseMesh.js    # Shue magnetopause parametric surface (lazy-imported)
    particleSystem.js      # Van Allen belt particles — THREE.Points, drift animation, storm injection
    auroraRenderer.js      # Aurora oval — torus at 67° lat, curtain ShaderMaterial, Dst-driven opacity
    satelliteMarker.js     # Satellite probe sphere
    controls.js            # OrbitControls setup
    clippingPlanes.js      # Equatorial / meridional clip planes
  ui/
    controlPanel.js        # lil-gui panel, all parameter callbacks
    timeline.js            # Scrub bar: play/pause, 1×/60×/3600×/86400×, 8 s rebuild throttle
    infoOverlay.js         # Top-left info overlay
    environmentReadout.js  # Satellite environment readout (|B|, L-shell, region)
  utils/
    constants.js           # KM_TO_SCENE, EARTH_RADIUS_KM, LATITUDE_SETS, etc.
    colors.js              # latitudeToColor() — field line hue by latitude
  main.js                  # Entry point: init, render loop, rebuild orchestration

scripts/
  convert-igrf.js          # NOAA igrf14coeffs.txt → public/data/igrf14coeffs.json
  convert-solarwind.js     # WGhour.d / OMNI2 → public/data/solarwind-YYYY.json

tests/                     # Vitest unit tests (197 tests, 13 files)

public/
  about.html               # User-facing physics reference (models, citations, how-to)
  data/
    igrf/
      igrf14-all.json      # Generated — IGRF-14 Gauss coefficients, all epochs 1900–2025
    WGhour.d               # Source solar wind data (Qin-Denton, not committed — large)
    solarwind/
      YYYY-MM.json         # Generated — monthly solar wind per year
  textures/                # Earth day map (NASA Blue Marble)
```

---

## Architecture Notes

See [CLAUDE.md](CLAUDE.md) for the full architecture reference used during development, including coordinate conventions, physics numerical details, and the rebuild pipeline.

### Two coordinate systems

- **Physics (km)**: used by everything in `src/physics/`. Earth radius = 6371.2 km. Spherical colatitude θ (0 at north pole).
- **Scene (unitless)**: used by `src/scene/`. Earth is a unit sphere. `scene = km / KM_TO_SCENE`.

### Computation pipeline

```
igrf/igrf14-all.json  (26 epochs, 1900–2025, interpolated at runtime)
      │  interpolateIgrfCoeffs(year)
      ▼
  computeB()               ← IGRF-14 spherical harmonics   (src/physics/igrf.js)
      +
  computeExternalB()       ← T01 empirical model            (src/physics/solarWind.js)
      │
      ▼
  computeTotalB()          ← combined + magnetopause fade   (src/physics/totalField.js)
      │
      ├─▶ fieldLineWorker  ── RK4 trace ──▶ TubeGeometry    (Web Worker)
      │
      └─▶ scalarFieldWorker ─ 64³ grid ──▶ marchingCubes()
                │                              │
                ├─▶ |B| isosurfaces            │
                └─▶ L-shell isosurfaces ───────┴──▶ radiation belt meshes
```

Both heavy computations (field-line tracing and scalar-field grids) run in **Web Workers** so the render loop never blocks. Field-line rebuilds use a `buildId` stale-guard so only the latest request's result is applied.

### Solar wind data pipeline

Solar wind conversion auto-detects `public/data/WGhour.d` (Qin-Denton format, 1963–present).
Without it the script falls back to ISWA Qin-Denton (≤2019) or NASA OMNI2 (any year, no G1/G2).

```
WGhour.d  (or OMNI2 / ISWA fallback)
    │
    ▼  scripts/convert-solarwind.js
    │
    ▼
solarwind/YYYY-MM.json   (columnar, version 2.0)
    │  { timestamps[], vSw[], nSw[], By[], Bz[], Dst[], G1[], G2[] }
    │
    ▼  applyDataSolarWind()  (main.js)
    │  lazy-loads current month + neighbours; linear interpolation between hours
    │
    ▼
getSolarWindParams()   →  T01 parmod + Shue magnetopause
```

### Rebuild triggers

| User action | Triggers |
|---|---|
| Solar wind param change | field lines, isosurfaces, belts, satellite, magnetopause |
| Timeline drag / pause | field lines (+ isosurfaces / belts if enabled) |
| Timeline play (every 8 s) | field lines only (long morph, no loading indicator) |
| IGRF degree / resolution change | field lines + isosurfaces + belts |
| Visual-only change (opacity, visibility) | geometry reuse, no recompute |

---

## Data Scripts

### IGRF coefficients

```bash
node scripts/convert-igrf.js                              # all epochs → public/data/igrf/igrf14-all.json
node scripts/convert-igrf.js scripts/igrf14coeffs.txt 2000.0  # single-epoch legacy file
```

Output: `public/data/igrf/igrf14-all.json` — all 26 IGRF-14 epochs (1900–2025) in one file.
At runtime the app interpolates coefficients for the current simulation year automatically.

### Solar wind data

```bash
node scripts/convert-solarwind.js 2025          # auto-detects WGhour.d
node scripts/convert-solarwind.js 2025 /path/to/WGhour.d   # explicit path
node scripts/convert-solarwind.js 2025 /path/to/omni2.dat  # OMNI2 fallback (no G1/G2)
```

Output: `public/data/solarwind/YYYY-MM.json`. The app lazy-loads per month at runtime.

---

## TODOs

- [ ] Satellite orbit display (SGP4/TLE) — source data in `public/data/Space-Track.all.3le.txt`
