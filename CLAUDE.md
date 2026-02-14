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

### Rebuilding field lines

When GUI controls change parameters that affect tracing (IGRF degree, latitude bands, longitude count), `main.js:rebuildFieldLines()` disposes all old geometries and retraces from scratch. Visual-only changes (tube radius, visibility, auto-rotate) skip recomputation.

## Testing

Tests are in `tests/` using vitest. They load `public/data/igrf14coeffs.json` directly from disk via `readFileSync`. Test suites:

- `coordinates.test.js` — spherical/Cartesian roundtrips and field vector rotation
- `legendre.test.js` — polynomial values against known analytic formulas, NaN safety at poles
- `igrf.test.js` — dipole physics (pole/equator ratio, r^-3 decay), full IGRF magnitude ranges
- `fieldLineTracer.test.js` — closed field lines return to surface, altitude scaling with latitude, point continuity
