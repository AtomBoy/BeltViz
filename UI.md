# BeltViz UI Design Specification

## Overview

This document describes the target UI architecture for BeltViz after reorganization. The goal is to reduce cognitive load, surface features more intuitively, and establish a cohesive visual language — without changing any underlying physics or URL parameter keys.

**Design principle:** Group controls by *what the user is looking at*, not by how features were implemented. A user studying radiation belt dynamics should find belts, particles, and aurora together. A user exploring field topology should find field lines and isosurfaces together.

---

## Current State (for reference)

The control panel currently has **9 lil-gui folders** with no thematic grouping:

```
Field Lines          ← field topology
Isosurfaces          ← field topology
Radiation Belts      ← radiation physics
Clipping             ← viewing tool (cross-cutting)
Solar Wind           ← driver / external field
Belt Particles       ← radiation physics
Aurora               ← radiation physics (endpoint)
Satellites           ← observational layer
```

Additional UI elements:
- **Info overlay** — top-left fixed panel, always visible, contains app title + about link
- **Environment readout** — top-left fixed panel, appears below info overlay when a satellite is selected
- **Timeline** — bottom bar, full-width

Problems: Aurora is disconnected from Belt Particles. Clipping is sandwiched between unrelated sections. Three separate top-left elements compete for the same screen space. No clear visual hierarchy distinguishes sections.

---

## Proposed Control Panel Structure

Five sections, ordered by conceptual depth (from fundamental physics to observational tooling):

```
─────────────────────────────
  MAGNETOSPHERE  (open by default)
─────────────────────────────
  SOLAR WIND
─────────────────────────────
  RADIATION & AURORA
─────────────────────────────
  SATELLITES
─────────────────────────────
  CLIPPING
─────────────────────────────
```

---

### 1. MAGNETOSPHERE

**Accent color:** Cyan `#44ccee`

Contains everything describing the intrinsic magnetic field topology.

**Subfolders:**

#### Field Lines *(open by default)*
| Control | Type | Range / Options |
|---|---|---|
| IGRF Degree | slider | 1–13 |
| Latitude Bands | slider | 1–12 |
| Longitudes | slider | 4–36, step 2 |
| Line Thickness | slider | 0.003–0.04 |
| Show Field Lines | toggle | — |
| Auto Rotate | toggle | — |

#### Isosurfaces *(closed)*
| Control | Type | Range / Options |
|---|---|---|
| Show Isosurfaces | toggle | — |
| Mode | dropdown | L-shell · Field Strength |
| Resolution | dropdown | 48 · 64 · 96 |
| Opacity | slider | 0.05–0.8 |
| → Levels | subfolder | per-level visibility toggles |

**Rationale:** Field lines and isosurfaces both visualize the same IGRF magnetic field. Isosurfaces are a second representation of the same underlying data — a natural sub-topic of magnetosphere.

---

### 2. SOLAR WIND

**Accent color:** Amber `#ffaa44`

Contains all external field and space-weather driver controls.

**Flat structure (no subfolders):**

| Control | Type | Range / Options |
|---|---|---|
| Enable Solar Wind | toggle | master switch |
| Preset | dropdown | Quiet · Moderate Storm · Severe Storm |
| Speed (km/s) | slider | 300–800 |
| Density (cm⁻³) | slider | 1–30 |
| IMF By (nT) | slider | −20 to +20 |
| IMF Bz (nT) | slider | −20 to +20 |
| Dst Index (nT) | slider | −200 to +50 |
| Show Magnetopause | toggle | — |

**New addition — Kp badge:**

Display a derived Kp index badge directly beneath the section header (not a slider — read-only). Color-coded:
- Kp < 3: `#44bb66` (quiet, green)
- Kp 3–5: `#ffaa33` (moderate, amber)
- Kp > 5: `#ff4444` (storm, red)

Format: `Kp  4.7  ▐▐▐▐▌░░░░` (value + compact bar)

This gives users immediate feedback on space-weather conditions without opening the folder — visible even when collapsed via the folder header.

**Rationale:** Solar wind drives the external field, storm deformation of radiation belts, and aurora intensity. It's the primary input layer.

---

### 3. RADIATION & AURORA

**Accent color:** Soft violet `#9988ff`

All three sub-sections describe the same charged particle populations at different stages: confinement → dynamics → precipitation.

**Subfolders:**

#### Radiation Belts *(closed)*
| Control | Type | Range / Options |
|---|---|---|
| Inner Belt (L=1.2–2) | toggle | — |
| Outer Belt (L=3–6) | toggle | — |
| Opacity | slider | 0.05–0.8 |

#### Belt Particles *(closed)*
| Control | Type | Range / Options |
|---|---|---|
| Show Particles | toggle | — |
| ● Electrons (eastward) | toggle | `#3399ff` dot label |
| ● Protons (westward) | toggle | `#ff6622` dot label |
| Max Particles | slider | 200–2000, step 100 |
| Electron Energy | dropdown | < 1 MeV · 1–3 MeV · > 3 MeV |

#### Aurora *(closed)*
| Control | Type | Range / Options |
|---|---|---|
| Show Aurora | toggle | — |
| Brightness | slider | 0.1–2.0 |

**Rationale:** The three panels form a chain:
- Radiation belts = the confinement zones
- Belt particles = the trapped populations drifting inside
- Aurora = what happens when those particles precipitate into the atmosphere

Grouping them tells the physical story. A user curious about radiation effects can find everything in one place.

---

### 4. SATELLITES

**Accent color:** Gold `#ffdd44`

Observational tooling layer, separate from the physical environment.

**Structure:**

| Control | Type |
|---|---|
| Show Satellites | toggle (master) |
| Notable Only | toggle |
| → Orbit Classes | subfolder (closed) |
| Search / Select Satellite | button |

**Orbit Classes subfolder** (moved from top level):
| Control | Color |
|---|---|
| LEO | `#c8d8f0` pale blue |
| MEO | `#44eebb` cyan |
| GEO | `#ffdd44` gold |
| HEO | `#ee66ff` magenta |
| Other | `#888888` grey |

**Rationale:** The 5 orbit class toggles are rarely changed together. Nesting them reduces clutter at the top level. The search button and master toggle remain prominent.

---

### 5. CLIPPING

**Accent color:** None / neutral `#778899`

Cross-cutting viewing tool. Kept as a standalone section because it modifies the rendering of field lines, isosurfaces, *and* radiation belts simultaneously.

**Flat structure:**

| Control | Type | Range |
|---|---|---|
| Equatorial Clip | toggle | — |
| Meridional Clip | toggle | — |
| Meridional Angle | slider | 0–360° |

**Rationale:** Clipping is not a physics concept — it's a viewport lens that works across all sections. Placing it at the bottom of the panel signals "this is a display tool" while keeping it accessible regardless of which physics section is open.

---

## Info Overlay Consolidation

### Current problems
- The info overlay (title + about link) occupies ~60px of height at top-left, always
- The environment readout appears below it when a satellite is active, pushing further down
- Two separate DOM elements with nearly identical styling (dark blur, blue border, cyan text)

### Proposed changes

#### Attribution → Footer
Replace the top-left info overlay with a single-line footer at bottom-left, overlapping the timeline marginally:

```
  MagRad-CG by AtOmOdO  ·  About & Data Sources
```

- **Position:** `fixed bottom: 68px left: 16px` (just above the timeline bar)
- **Font:** 11px, 60% opacity, no border, no background blur
- **On hover:** opacity 100%
- This frees the entire top-left region for the environment readout

#### Environment Readout → Top-Left, Standalone
The environment readout becomes the *only* top-left element. When no satellite is selected, it is hidden entirely. When active:
- **Position:** `fixed top: 16px left: 16px` (occupies the space freed by removing the info panel)
- Keeps the existing frosted-glass styling and monospace layout
- No change to data format or update logic

**Result:** The top-left region is either empty (clean 3D view) or showing only the environment readout (satellite probe mode). Never two overlapping panels.

---

## Timeline Enhancement

### Kp Index Badge

Add a small live Kp indicator to the left control section of the timeline bar, between the date display and the play button:

```
◄  Nov 6, 2025  ►   Kp 4.7  ▶  60×  Now
                    ─────
                    amber
```

**Implementation:** Read `computeKp(solarWindParams)` from `beltFlux.js` each frame and update a `<span>` in the timeline DOM. Color the background of the badge based on Kp threshold:
- `< 3` → `rgba(40, 150, 80, 0.7)` green
- `3–5` → `rgba(200, 120, 30, 0.7)` amber
- `> 5` → `rgba(180, 40, 40, 0.7)` red

**Value:** Users don't need to open the Solar Wind folder to know whether they're in a storm. The Kp badge is always visible in the timeline and provides immediate context for what they see in the scene.

---

## Visual Design Language

### Section Header Color Coding

Each section header in lil-gui gets a 3px left border via CSS injection:

```css
/* Applied via controlPanel.js style injection */
.lil-gui .magnetosphere > .title    { border-left: 3px solid #44ccee; }
.lil-gui .solar-wind > .title       { border-left: 3px solid #ffaa44; }
.lil-gui .radiation-aurora > .title { border-left: 3px solid #9988ff; }
.lil-gui .satellites > .title       { border-left: 3px solid #ffdd44; }
.lil-gui .clipping > .title         { border-left: 3px solid #445566; }
```

This gives each section a distinctive color anchor without changing the font or layout.

### Typography

No font changes needed — the existing combination (sans-serif for controls, monospace for readouts) is appropriate. Improvements:

- Section folder titles: `letter-spacing: 1.5px; text-transform: uppercase; font-size: 11px`
- This differentiates sections from subfolders visually within the lil-gui hierarchy

### Default Folder States

| Section | Default state |
|---|---|
| MAGNETOSPHERE | **Open** |
| Field Lines (subfolder) | **Open** |
| Isosurfaces (subfolder) | Closed |
| SOLAR WIND | Closed |
| RADIATION & AURORA | Closed |
| SATELLITES | Closed |
| CLIPPING | Closed |

**Rationale:** A new user opening the app for the first time immediately sees field line controls — the primary visual feature. All other sections are discoverable but not overwhelming.

---

## Implementation Guide

### Files to modify

#### `src/ui/controlPanel.js`
Primary change. Restructure the folder creation code:

1. **Remove** the 9 top-level folders
2. **Create** 5 top-level folders with CSS class names for color coding:
   ```js
   const fMag = gui.addFolder('MAGNETOSPHERE');
   fMag.domElement.classList.add('magnetosphere');
   ```
3. **Move** Field Lines and Isosurfaces into `fMag` as subfolders
4. **Create** `fSW` for Solar Wind; add Kp badge element after the folder header
5. **Create** `fRad` for Radiation & Aurora; add Belt Particles and Aurora as subfolders
6. **Create** `fSat` for Satellites; nest orbit class toggles in a subfolder
7. **Create** `fClip` for Clipping; inject CSS class for neutral accent
8. **Inject** CSS for section header left borders and uppercase letter-spacing
9. **Open** only `fMag` and its Field Lines subfolder by default; close all others

No callback changes needed — all `params` keys and callback signatures stay the same.

#### `src/ui/infoOverlay.js`
Replace the existing panel with a minimal footer:
- Remove the `div` with `top: 20px; left: 20px`
- Replace with a `div` at `bottom: 68px; left: 16px`
- Remove border, background, and blur
- Keep only the title/link line, styled at low opacity
- Keep `updateInfoOverlay(dataSourceNote)` function (still called from main.js, but now updates only the data source footnote, not the title)

#### `src/ui/environmentReadout.js`
- Change `top` from `155px` to `16px` (moves up to top-left, now the sole occupant)
- No other changes to logic or format

#### `src/ui/timeline.js`
- Add a `<span id="kp-badge">` element to the left control section HTML
- Export or expose `updateKpBadge(kp)` function
- In main.js, call `updateKpBadge(computeKp(getSolarWindParams()))` from `lightUpdateDatetime()` (already runs every rAF frame)

#### `src/main.js`
- Update the `createControlPanel` call if any folder references changed
- Wire `updateKpBadge` into `lightUpdateDatetime`
- No structural changes to params, callbacks, or rebuild logic

### Files unchanged
- All `src/physics/` files
- `src/ui/satellitePanel.js`
- `src/ui/urlParams.js` (all param keys stay the same)
- `src/scene/` files
- All test files

---

## Before / After Summary

| Element | Before | After |
|---|---|---|
| Control panel sections | 9 flat folders | 5 themed sections |
| Aurora | Standalone section | Inside Radiation & Aurora |
| Belt Particles | Standalone section | Inside Radiation & Aurora |
| Clipping | Mid-panel, buried | Bottom of panel, standalone |
| Isosurfaces | Top-level section | Subfolder inside Magnetosphere |
| Top-left overlays | 2 stacked panels (title + env) | 1 (env readout only; shown when active) |
| Attribution | Always-visible top-left panel | Discreet bottom-left footer |
| Space-weather at-a-glance | Must open Solar Wind folder | Kp badge always visible in timeline |
| Default panel state | Field Lines open | Magnetosphere + Field Lines open |

---

## Open Questions / Deferred

- **Mobile layout:** The app is desktop-only. No responsive changes planned.
- **Sidebar collapse:** A full collapse/expand toggle for the entire lil-gui panel would clean up full-screen viewing. Deferred — not part of this reorganization.
- **Satellite detail inset (CLAUDE.md TODO):** When a satellite is selected, show a CAD model in the top-left and draw a detail-inset line to its orbit. This would replace the environment readout when active — compatible with this redesign.
- **Tooltip/help text:** Brief tooltips on hover for non-obvious controls (e.g., "IGRF Degree: higher values include finer-scale field features"). Not implemented; lil-gui has limited native tooltip support.
