# Van Allen Radiation Belt Particle Visualization

## Overview

This document describes the design and implementation of the animated particle system
showing charged particles drifting through Earth's radiation belts. The visualization is
tied to real solar wind data (via the Dst index from WGhour.d) so that storm-time injection
and loss events are reflected in particle density and aurora brightness.

---

## Three Particle Motions

Trapped charged particles execute three nested periodic motions. Only the slowest
(azimuthal drift) is visualized directly.

| Motion   | Period (electrons at L=4) | Period (protons at L=4)  | Direction        |
|----------|--------------------------|--------------------------|------------------|
| Gyration | ~ µs–ms                  | ~ µs–ms                  | Around field line |
| Bounce   | ~ 0.1–10 s               | ~ 1–10 s                 | N–S along field line |
| Drift    | ~ 1–60 min (E-dependent) | ~ 30 min – 10 h          | Azimuthal around Earth |

**Gyration** is too fast to animate (and the gyro-radius is sub-kilometre at MeV energies).

**Bounce** is shown as a *static spread* in magnetic latitude λ_m up to the mirror point.
Each particle is placed at a fixed λ_m chosen at injection; it does not oscillate. The
visual result correctly shows particles distributed along field lines in the belt, not
crowded at the equator.

**Drift** is the primary animation. Electrons drift *eastward* (counterclockwise viewed
from north pole); protons drift *westward* (clockwise). This produces the ring current.

---

## Drift Formulas

### Bounce-averaged azimuthal drift period (dipole field)

For an isotropic pitch-angle distribution (equivalent to 90° equatorial pitch angle):

```
T_electron [hours] ≈ 1.05 / (L × E_k [MeV])   (eastward)   → ~16 min at L=4, 1 MeV
T_proton   [hours] ≈ 58.0 / (L × E_k [MeV])   (westward)   → ~29 min at L=4, 30 MeV
```

*Reference: Roederer (1970), "Dynamics of Geomagnetically Trapped Radiation", §3.4;
Schulz & Lanzerotti (1974), "Particle Diffusion in the Radiation Belts", eq. 1.30.*

Angular drift rate: `ω = ±2π / (T × 3600)` rad/s  (T in hours).

### Visual time scale

Physics drift rates are in rad/s. A `VISUAL_DRIFT_SCALE = 6.3` multiplier is
applied so that electrons at L=4, E=1 MeV complete one orbit in **~2.5 real minutes**
(physics period ~16 min, accelerated ~6× for visibility). This lets the drift be
clearly visible while still allowing individual particles to be tracked.

All other drift rates scale correctly relative to the reference case:
- L=8, E=1 MeV electrons: ~1.3 min orbit (2× as fast, since ω ∝ L).
- L=4, E=3 MeV electrons: ~50 sec orbit (3× as fast, since ω ∝ E).
- L=4, E=30 MeV protons:  ~4.6 min orbit (opposite direction).

---

## Drift Shell Position Formula

Given a particle's state `(L, φ, λ_m)`:

```
r   = L × cos²(λ_m)                    [Earth radii]
x   = r × cos(λ_m) × cos(φ)
y   = r × sin(λ_m)                     [Y = geographic north]
z   = r × cos(λ_m) × (−sin(φ))
```

φ = 0 points towards the subsolar direction (+X axis = sunward).
The magnetic equator (λ_m = 0) is in the XZ plane.

*Source: `src/physics/particleDrift.js:driftShellPosition()`*

---

## Storm Coupling (Dst-Driven Injection)

The Dst index measures the ring current intensity. More negative Dst = stronger storm =
more particles injected at lower L-shells.

| Dst range     | Injection rate | Target L-shell |
|---------------|---------------|----------------|
| ≥ −20 nT      | 1× baseline   | L = 3.5–5.5    |
| −20 to −50 nT | up to 5×      | L = 3.0–5.0    |
| −50 to −150 nT| up to 20×     | L = 2.5–4.5    |
| < −150 nT     | up to 50×     | L = 2.0–4.0    |

Dst is read from `getSolarWindAtTime()` each sim-hour during timeline playback.
Preset solar wind conditions also drive Dst:
- Quiet: Dst = 0 → slow drizzle injection
- Moderate Storm: Dst = −50 → 5× injection
- Severe Storm: Dst = −150 → 20× injection, aurora blazes

---

## Aurora Connection

Particles whose equatorial pitch angle falls below the **loss cone angle** are not
magnetically trapped — they spiral down field lines and precipitate into the upper
atmosphere at ~80–300 km altitude, producing aurora through ionisation.

### Equatorial loss cone angle (dipole)

```
sin²(α_LC) = 4 / (L³ × √(4 − 3/L))
```

The loss cone narrows with L: at L=2, α_LC ≈ 19°; at L=6, α_LC ≈ 6°.

*Reference: Lyons & Schulz (1989), "Quantitative aspects of magnetospheric physics", eq. 2.3.*

### Auroral oval location

Field lines at a given L-shell connect to the magnetic equator and to the Earth's surface
at a magnetic latitude λ_foot where `cos²(λ_foot) = 1/L`.

| L-shell | Foot latitude |
|---------|--------------|
| L = 4   | ~60°         |
| L = 5   | ~63°         |
| L = 6   | ~66°         |
| L = 7   | ~69°         |

The aurora oval in the visualization sits at **67° geomagnetic latitude**, corresponding
to L ≈ 6.5 — the outer edge of the outer belt where precipitation is most intense.

### Aurora brightness

Aurora opacity is driven by Dst through `auroraRenderer.update()`:
- Quiet (Dst ≥ −20): faint glow (opacity 0.12)
- Moderate (Dst = −50): moderate glow (opacity 0.30)
- Severe (Dst = −150): bright curtains (opacity 0.70)
- Extreme (Dst < −150): maximum brightness (opacity 0.85)

---

## Implementation Files

| File | Purpose |
|------|---------|
| `src/physics/particleDrift.js` | Pure physics: drift rate, position, loss cone, injection |
| `src/scene/particleSystem.js` | THREE.Points with ShaderMaterial; injection/loss/drift loop |
| `src/scene/auroraRenderer.js` | Aurora torus geometry with animated curtain shader |
| `tests/particleDrift.test.js` | Unit tests for all physics functions |

---

## Shader Notes

### Particle point sprites (`particleSystem.js`)

Particles use `THREE.Points` with a custom `ShaderMaterial`:

- **Vertex shader**: computes `gl_PointSize` inversely proportional to distance
  (`clamp(2.8 / (dist × 0.18 + 0.05), 1.5, 9.0) px`) so near particles are large and
  far particles are small — physically realistic parallax effect.
- **Fragment shader**: uses `gl_PointCoord` to draw a radial Gaussian-like glow within
  each point's square. Points outside the unit circle are discarded (`if (d > 1.0) discard`).
- **Additive blending** (`THREE.AdditiveBlending`): overlapping particles accumulate
  brightness. The ring current shows as a bright band even though individual particles are
  faint. `depthWrite: false` prevents particles from occluding each other.

### Aurora curtain shader (`auroraRenderer.js`)

- **Curtain striations**: three overlapping `sin(angle × freq + uTime × speed)` waves at
  different spatial/temporal frequencies. Using world-space longitude angle avoids UV
  seam discontinuities.
- **Altitude gradient**: `altFrac` computed from `r = length(vWorldPos)` relative to the
  tube centre radius. Fragment colour mixes green (oxygen 557.7 nm, lower altitude) →
  red (oxygen 630 nm, higher altitude).
- **Vertical fade**: `sin(altFrac × π)` peaks at mid-altitude, fading at tube edges.
- **Opacity smooth follow**: each frame, opacity moves 5% towards the target driven by Dst.
  This avoids harsh jumps when Dst changes.
- **Additive blending + `depthWrite: false`** — same rationale as particles.

---

## Tuning Guide

| Parameter | Location | Effect |
|-----------|----------|--------|
| `VISUAL_DRIFT_SCALE` | `particleSystem.js` | Orbit period at reference case (currently ~10 s) |
| `BASE_INJECT_RATE` | `particleSystem.js` | Quiet-time particles per second (currently 4) |
| `realLifetime(L)` | `particleSystem.js` | Particle longevity in real seconds |
| `TUBE_RADIUS` | `auroraRenderer.js` | Aurora band thickness (currently 0.03 Re ≈ 190 km) |
| `AURORA_LAT_DEG` | `auroraRenderer.js` | Latitude of oval (currently 67°) |
| `params.particles.count` | GUI | Max simultaneous particles (200–2000) |
| `params.aurora.opacity` | GUI | Aurora brightness multiplier |

---

## Future Extensions

1. **L* drift shells using T01**: Replace the dipole `driftShellPosition()` formula with
   Roederer L* computed by tracing drift shells in the T01 external field. This would
   correctly show the compressed dayside and stretched nightside shape.
2. **Actual pitch angle distributions**: Sample from a Gaussian centred at 90° rather than
   uniformly in λ_m. Loss-cone fraction would feed directly into aurora brightness.
3. **Wave-particle interactions**: Chorus waves scatter pitch angles near the equatorial
   plane (L ≈ 4–6), rapidly filling the loss cone during active times. Could be
   approximated by a time-varying loss rate correlated with geomagnetic activity.
4. **Phase-space density animation**: Colour particles by their energy band to visualize
   the energy spectrum of the ring current.

---

## References

- Roederer, J. G. (1970). *Dynamics of Geomagnetically Trapped Radiation*. Springer. §3.4.
- Schulz, M., & Lanzerotti, L. J. (1974). *Particle Diffusion in the Radiation Belts*. Springer.
- Lyons, L. R., & Schulz, M. (1989). *Access of Energetic Particles to Inner Magnetosphere*. AGU.
- Walt, M. (1994). *Introduction to Geomagnetically Trapped Radiation*. Cambridge. Chapters 3–5.
