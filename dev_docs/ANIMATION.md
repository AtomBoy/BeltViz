# Animation Architecture

Documents the sun and moon animation system implemented in `src/main.js`.

---

## Overview

Sun and moon positions are driven by the **Three.js AnimationMixer** using pre-computed
keyframes rather than calling `solarPosition()` / `lunarPosition()` every rAF frame.

The timeline bar (`src/ui/timeline.js`) advances simulated time and drives two callbacks:
- `lightUpdateDatetime(isoString)` — called every rAF frame; seeks keyframes to current sim time (~0.1ms)
- `updateDatetime()` — called every 2s throttle + on pause; rebuilds field lines if solar wind is active

---

## Keyframe System (`buildDayAnimation` / `applySunMoonAnimation`)

### Pre-computation (`buildDayAnimation`)

Called once per sim-day (at startup and each time the simulation crosses UTC midnight):

```
289 keyframes × 2 objects = 578 solarPosition/lunarPosition evaluations
Spacing: every 5 sim-minutes (300s)
Coverage: 0h – 24h inclusive for the UTC day containing `date`
```

For each keyframe, Cartesian XYZ is computed directly (the same formula used by
`setDirection` / `setPosition` in `globe.js`):

```js
// Sun (SUN_DIST = 120 scene units, matching globe.js createSun)
sunXYZ[i] = [ cos(dec) * cos(lon) * 120,
               sin(dec) * 120,
               cos(dec) * sin(lon) * 120 ]

// Moon (distRe varies ~55–65 Earth radii)
moonXYZ[i] = [ cos(dec) * cos(lon) * distRe,
                sin(dec) * distRe,
                cos(dec) * sin(lon) * distRe ]
```

Two `THREE.VectorKeyframeTrack('.position', times, xyz)` tracks are created, one per object.
Each is wrapped in a `THREE.AnimationClip` and a fresh `THREE.AnimationMixer` is created
targeting `sun.group` and `moon.mesh` (which is actually `moonGroup`) respectively.

### Per-frame seek (`applySunMoonAnimation`)

```js
const simSeconds = (date.getTime() - dayStart.getTime()) / 1000;
sunMixer.setTime(simSeconds);   // Three.js linearly interpolates between keyframes
moonMixer.setTime(simSeconds);
```

After the mixer updates `sun.group.position`, two derived values are computed:

1. **Directional light position** — same direction as sun sphere, at distance 5 (vs 120):
   ```js
   sunLight.position.copy(sun.group.position).multiplyScalar(5 / 120);
   ```

2. **`params.sunLongitude` / `params.sunDeclination`** — needed by the solar wind field-line
   tracer (`src/physics/solarWind.js` uses `sunLonRad`):
   ```js
   params.sunLongitude   = ((Math.atan2(p.z, p.x) * 180 / Math.PI) + 360) % 360;
   params.sunDeclination = Math.asin(p.y / 120) * 180 / Math.PI;
   ```

---

## Day-Boundary Handling

Both `lightUpdateDatetime` and `updateDatetime` detect a day change by comparing
`utcStartOfDay(simTime)` to `dayStart`. When they differ, `buildDayAnimation` rebuilds
the keyframes for the new day before calling `applySunMoonAnimation`.

At 86400× speed, the simulation completes 24 sim-hours in 24 real seconds. The day
boundary triggers a rebuild taking a few milliseconds — imperceptible.

---

## Accuracy

Linear interpolation between 5-minute keyframes introduces at most ~0.02° angular error
for the sun (which moves 0.25°/min). Moon interpolation error is slightly larger but well
below the ~2° accuracy of the Meeus Chapter 47 formula itself.

---

## Call Graph

```
rAF animate(now)
  └── timeline.tick(now)
        ├── onTimeChange(iso19)  → lightUpdateDatetime(iso)
        │     ├── [rebuild if new day] buildDayAnimation(simTime)
        │     └── applySunMoonAnimation(simTime)
        │           ├── sunMixer.setTime(s)  → sun.group.position updated by Three.js
        │           ├── sunLight.position ← sun.group.position × (5/120)
        │           ├── params.sunLongitude, sunDeclination ← sun.group.position
        │           └── moonMixer.setTime(s) → moon.mesh.position updated by Three.js
        └── [every 2s] onPause() → updateDatetime()
              ├── [rebuild if new day] buildDayAnimation(date)
              ├── applySunMoonAnimation(date)
              └── [if solarWindEnabled] rebuildFieldLines(), rebuildIsosurfaces(), ...
```

---

## Key Constants

| Constant | Value | Meaning |
|----------|-------|---------|
| `SUN_DIST` | 120 | Sun sphere distance in scene units (must match `globe.js createSun`) |
| `KF_INTERVAL_S` | 300 | Keyframe spacing: 5 sim-minutes |
| `KF_COUNT` | 289 | Keyframes per day (0h–24h inclusive) |
| `REBUILD_INTERVAL_MS` | 2000 | Throttle: full rebuild at most every 2 real seconds |

---

## What Was Removed

The following were removed during this refactor to simplify the architecture:
- `updateSunPosition()` — replaced by `applySunMoonAnimation()`
- `params.showMoon` — moon is always shown
- "Date & Time" folder in lil-gui — timeline bar is the sole datetime control
- Per-frame `solarPosition()` / `lunarPosition()` calls in `lightUpdateDatetime`
