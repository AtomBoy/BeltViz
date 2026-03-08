# MagRad-CG — Magnetospheric Radiometric Cybernetic Garden

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightblue.svg)](https://creativecommons.org/licenses/by/4.0/)

Interactive 3D visualization of Earth's magnetosphere: field lines, radiation belt isosurfaces, Van Allen belt particles, aurora, historical solar wind playback, and real SGP4-propagated satellite orbits. All physics runs client-side in the browser.

For physics background, model descriptions, and citations see **[public/about.html](public/about.html)**.

---

## Quick Start

```bash
npm install
node scripts/convert-igrf.js          # generate public/data/igrf/igrf14-all.json (all epochs)
node scripts/convert-solarwind.js 2025 # generate public/data/solarwind/2025-MM.json
node scripts/convert-satellites.js    # generate public/data/satellites.json (~1,500 curated sats)
node scripts/convert-tles.js 2025     # generate public/data/tles/2025-MM.json (monthly TLEs)
npm run dev                            # http://localhost:5173
npm test             # run all 220 tests (vitest)
npm run test:watch   # watch mode
npm run build        # production build → dist/
```

---

## Tech Stack

Built using [Claude Code](https://claude.ai/code/family)

| Layer | Library |
|---|---|
| 3D rendering | [Three.js](https://threejs.org/) — TubeGeometry, MeshPhysicalMaterial, ShaderMaterial |
| SGP4 propagator | [US Space Force SGP4 WASM v9.1.1.0](https://www.space-track.org/documentation#sgp4) — official C propagator compiled to WebAssembly |
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
    satelliteSwarm.js      # ~1,500 SGP4-propagated satellites — THREE.Points per orbit class,
                           #   smooth lerp between propagation ticks, animated orbit trace
    satelliteMarker.js     # Satellite probe sphere (static environment probe)
    controls.js            # OrbitControls setup
    clippingPlanes.js      # Equatorial / meridional clip planes
  ui/
    controlPanel.js        # lil-gui panel, all parameter callbacks
    satellitePanel.js      # HTML search/select overlay for satellite catalog
    timeline.js            # Scrub bar: play/pause, 1×/60×/3600×/86400×, 8 s rebuild throttle
    infoOverlay.js         # Top-left info overlay
    environmentReadout.js  # Satellite environment readout (|B|, L-shell, region)
    urlParams.js           # Bidirectional URL hash ↔ params sync
  utils/
    constants.js           # KM_TO_SCENE, EARTH_RADIUS_KM, LATITUDE_SETS, etc.
    colors.js              # latitudeToColor() — field line hue by latitude
  main.js                  # Entry point: init, render loop, rebuild orchestration

scripts/
  convert-igrf.js          # NOAA igrf14coeffs.txt → public/data/igrf/igrf14-all.json
  convert-solarwind.js     # WGhour.d / OMNI2 → public/data/solarwind/YYYY-MM.json
  convert-satellites.js    # Space-Track 3LE snapshot → public/data/satellites.json
  convert-tles.js          # Space-Track bulk 2LE archive → public/data/tles/YYYY-MM.json

tests/                     # Vitest unit tests (220 tests, 14 files)

public/
  about.html               # User-facing physics reference (models, citations, how-to)
  lib/
    sgp4/
      Sgp4Prop.js          # Emscripten WASM wrapper (US Space Force SGP4 v9.1.1.0)
      Sgp4Prop.wasm        # WASM binary (120 KB)
  workers/
    satelliteWorker.js     # Classic Web Worker — loads WASM, handles propagate/traceOrbit messages
  data/
    igrf/
      igrf14-all.json      # Generated — IGRF-14 Gauss coefficients, all epochs 1900–2025
    WGhour.d               # Source solar wind data (Qin-Denton, not committed — large)
    solarwind/
      YYYY-MM.json         # Generated — monthly solar wind per year
    satellites.json        # Generated — curated ~1,500-satellite catalog with TLEs
    tles/
      YYYY-MM.json         # Generated — monthly TLE snapshots for timeline-accurate propagation
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

### Satellite propagation pipeline

```
Space-Track.all.3le.txt  (curated 3-line snapshot, ~1,500 sats)
    │
    ▼  scripts/convert-satellites.js
    │
    ▼
satellites.json          (catalog: id, name, orbitClass, line1, line2, notable)
    │
    ├─▶  on enable: satelliteWorker ← TleAddSatFrLines_wasm → Sgp4InitSats_wasm
    │                   (one Web Worker per session; terminate+recreate on month change)
    │
    └─▶  propagate tick: Sgp4PropDs50UtcPosVel_wasm → ECI → ECEF (GMST) → scene coords
                │  throttled: 10 s at 1×, 200 ms at 86400×
                │
                ▼  lerpPositions() every frame (smooth between ticks)
                │
                └─▶  THREE.Points per orbit class (LEO/MEO/GEO/HEO/OTHER)

Space-Track bulk 2LE archive  (tle2025.txt, ~3 GB for a full year)
    │
    ▼  scripts/convert-tles.js 2025  (streaming readline, no full load)
    │  picks TLE closest to day 15 of each month per satellite
    │
    ▼
tles/YYYY-MM.json        (lazy-loaded; worker reinitialised on month boundary)
```

Orbit classes use official Space Track definitions applied from TLE line 2:
`HEO (e > 0.25)` → `LEO (n > 11.25 rev/d)` → `GEO (n ≈ 1 rev/d, e < 0.01)` → `MEO (600–800 min period)` → `OTHER`.

### Rebuild triggers

| User action | Triggers |
|---|---|
| Solar wind param change | field lines, isosurfaces, belts, satellite, magnetopause |
| Timeline drag / pause | field lines (+ isosurfaces / belts if enabled) |
| Timeline play (every 8 s) | field lines only (long morph, no loading indicator) |
| IGRF degree / resolution change | field lines + isosurfaces + belts |
| Visual-only change (opacity, visibility) | geometry reuse, no recompute |

### Radiation belt geometry

Belt meshes are **analytic dipole toroids** built from the field-line formula (no marching cubes):

```
r(λ) = L · cos²(λ)       [Earth radii]
ρ(λ) = L · cos³(λ)       [equatorial distance]
y(λ) = L · cos²(λ) · sin(λ)  [north-south]
```

Each belt is swept azimuthally with a **D-shaped cross-section**: inner boundary at fixed `lMin`, outer boundary tapers from `lMax` at the equator to `lMin` at ±`latLimit` (the loss-cone latitude) so the tips close smoothly. Definitions:

| Belt | L range | Lat limit | Color |
|---|---|---|---|
| Inner (CRAND protons) | L = 1.2–2.0 | ±38° | warm orange |
| Outer (storm electrons) | L = 3.0–5.0 | ±28° | teal/cyan |

**Storm deformation** (`applyStormDeformation`): outer belt vertices are scaled radially by `1 − stormIntensity × 0.22 × cos(angle_from_sun)`. This compresses the dayside and stretches the nightside as the Dst index worsens.

**Dipole tilt**: the belt group and particle mesh are both rotated by the IGRF dipole quaternion so they align with the real magnetic axis rather than the geographic pole. The tilt axis is derived from IGRF degree-1 coefficients `(g₁₀, g₁₁, h₁₁)`:

```javascript
// Magnetic north axis — pointing toward the pole, not away from it.
// Using (-g11, -g10, -h11) keeps the rotation near 10° (well-conditioned).
// Using (g11, g10, h11) would point to magnetic south (~170° rotation),
// causing setFromUnitVectors(Y, near-Y-neg) to choose an arbitrary azimuthal axis.
const dipoleAxis = new THREE.Vector3(-g11, -g10, -h11).normalize();
```

### Van Allen belt particles

Four physically distinct populations are simulated as `THREE.Points` (additive blending):

| Pop | Species | Source | L range | Lifetime | Color |
|---|---|---|---|---|---|
| A | Proton (inner) | CRAND — cosmic ray neutron decay | 1.2–2.0 | 300–600 s | orange |
| B | Electron (inner) | Inward radial diffusion | 1.5–2.0 | 120 s | blue |
| C | Electron (outer) | Nightside plasma sheet, storm-driven | 3.0–4.5 | 25–45 s | blue |
| D | Proton (ring current) | Nightside plasma sheet, storm-driven | 1.5–4.5 | 35–45 s | orange |

Particle budgets use **Little's Law** (N_steady = rate × τ) so each population's share of the max-particle pool is proportional to its steady-state count. Budgets recalculate each frame from the current Dst index.

Outer belt electrons and ring current protons are injected from the **nightside** (anti-solar ± 90°) and their positions are deformed by the same storm formula as the belt meshes, keeping particles visually aligned with the belt geometry during storms.

The slot region (L = 2–3) is **empty of electrons** at Dst > −100 nT, filled only during extreme storms (Baker et al. 2004).

### URL state persistence

All simulation parameters are serialised to the **URL fragment** (`window.location.hash`) so any state can be bookmarked or shared. Only non-default values are written. The URL is debounced (500 ms) and uses `location.replace()` so slider drags do not pollute browser history.

```
http://localhost:5173/#innerBelt=true&outerBelt=true&particles=true&dst=-92&vSw=600&bz=-15
```

Key/value pairs use short readable keys (`showFL`, `isoLevels`, `dst`, `particles`, `camX/Y/Z`, …). Camera position is written as an **atomic triplet** — all three components or none — so a partial URL never leaves the camera half-restored on load. The `isoLevels` key is re-applied after `initIsoLevels()` runs during GUI setup, since that function resets the active set to defaults.

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

### Satellite catalog & TLEs

```bash
# One-time: generate the curated satellite catalog from a Space-Track 3LE snapshot
node scripts/convert-satellites.js
# Input:  public/data/Space-Track.all.3le.txt  (3-line element file)
# Output: public/data/satellites.json  (~1,500 satellites, ~240 KB)

# Per year: generate monthly TLE snapshots for timeline-accurate propagation
node scripts/convert-tles.js 2025
# Input:  public/data/tle2025.txt  (Space Track bulk 2-line archive, ~3 GB)
# Output: public/data/tles/2025-MM.json  (one file per month, ~200 KB each)
```

Monthly TLE files are lazy-loaded at runtime when the timeline crosses a month boundary, keeping the SGP4 propagation error small over long playback spans.

---

## Data Sources & References

Full citations for physics models, data sources, and software are in **[public/about.html](public/about.html)**.

---

## TODOs

- [ ] Show satellite CAD model on satellite selection (example model in `public/models/`; detail-inset panel)
- [ ] Per-population particle count allocation using Little's Law ratio to keep proton/electron balance accurate across solar wind conditions
