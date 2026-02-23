# Historical Solar Wind Data — Investigation Notes

Research into sourcing, packaging, and integrating historical hourly solar wind data
for BeltViz playback and future T01 support.

---

## 1. Why We Need This

Two independent motivations:

1. **Historical playback** (Phase 4): When the timeline is scrubbing through a past date,
   replace the manual solar wind sliders with the actual observed conditions for that hour.
   This makes events like the 2003 Halloween storm or the 2015 St. Patrick's Day storm
   visually reproducible.

2. **T01 model inputs** (Phase 4+): T01 requires G1 and G2 disturbance indices that are
   time-integrals of solar wind forcing over the preceding storm interval. Computing them
   requires an hourly history window — they cannot come from instantaneous slider values.

---

## 2. Data Source

### Primary: NASA OMNI Hourly Dataset

**Best option** for historical playback because it:
- Merges data from all available L1 spacecraft (DSCOVR, ACE, Wind, IMP-8) into a single
  consistent time series
- Provides **all required parameters in a single file**: vSw, nSw, By, Bz, and Dst
- Covers **1963–present** (vs. DSCOVR which only goes back to July 2016)
- Free, no API key, FTP downloadable

**Direct FTP access** (one file per year, ASCII format):
```
https://spdf.gsfc.nasa.gov/pub/data/omni/low_res_omni/omni2_YYYY.dat
```

One `.dat` file per year, ~3–4 MB uncompressed, ~800 KB gzipped. Fields are fixed-width
columns; the format spec is at:
```
https://spdf.gsfc.nasa.gov/pub/data/omni/low_res_omni/omni2.text
```

**Key columns in omni2_YYYY.dat** (1-indexed, space-separated fixed-width):
| Column | Parameter | Units | Fill value |
|--------|-----------|-------|-----------|
| 1–3 | Year, Day-of-year, Hour | | |
| 8 | IMF By (GSM) | nT | 999.9 |
| 9 | IMF Bz (GSM) | nT | 999.9 |
| 24 | Solar wind speed | km/s | 9999 |
| 25 | Proton density | cm⁻³ | 999.9 |
| 41 | Dst index | nT | 99999 |

Fill values (999.9, 9999, 99999) mark missing or bad data and must be replaced with `null`
during preprocessing.

### Fallback: NOAA SWPC Real-Time JSON API

For the **current 7-day window** only (not useful for historical playback):
```
https://services.swpc.noaa.gov/products/solar-wind/plasma-7-day.json
https://services.swpc.noaa.gov/products/solar-wind/mag-7-day.json
```

No auth needed. Provides vSw, nSw, By, Bz in JSON arrays-of-arrays. **Dst is not in this
feed** — it's a ground-based index (Kyoto World Data Center), available separately from
`https://services.swpc.noaa.gov/products/kyoto-dst.json`.

**Decision**: Use OMNI FTP for historical preprocessing; the SWPC real-time API is an option
for a future "live" mode but is out of scope for Phase 4.

---

## 3. Parameters Available vs. Required

| Parameter | Required by | OMNI col | DSCOVR RT | Notes |
|-----------|-------------|----------|-----------|-------|
| vSw (speed) | T89, T96, T01 | 24 | ✅ plasma JSON | km/s |
| nSw (density) | T89, T96, T01 | 25 | ✅ plasma JSON | cm⁻³ |
| IMF By (GSM) | T96, T01 | 8 | ✅ mag JSON | nT |
| IMF Bz (GSM) | T89, T96, T01 | 9 | ✅ mag JSON | nT |
| Dst | T89 (via Kp), T96, T01 | 41 | ❌ separate feed | nT |
| G1, G2 | T01 only | derived | — | 1-hour integrals |

**Dst note**: Dst is not measured at L1 — it's derived from ground-based magnetometers and
published separately (Kyoto WDC). It's included in the OMNI merged dataset, making OMNI the
cleanest single-source option.

**G1/G2 note**: These can be computed from a rolling 1-hour window of vSw and By values
(see Tsyganenko & Sitnov 2005 for the exact formula). Once hourly OMNI data is loaded,
G1/G2 can be computed on-the-fly during playback.

---

## 4. Data Volume

### Per-year estimates (hourly, 5 parameters)

| Format | Uncompressed | Gzipped (Vite auto) |
|--------|-------------|---------------------|
| Raw JSON (columnar) | ~440 KB | ~100 KB |
| Delta-encoded binary | ~105 KB | ~18 KB |
| Float32Array binary | ~175 KB | ~50 KB |
| OMNI source `.dat` | ~3.5 MB | ~800 KB |

**Recommended format**: Columnar JSON — same pattern as `igrf14coeffs.json`, free gzip from
Vite, simple parsing, no custom decoder needed.

One year gzipped = **~100 KB**. Five years = **~500 KB**. Negligible vs. Three.js bundle.

---

## 5. Recommended File Format

```json
{
  "version": "1.0",
  "source": "NASA OMNI Low-Res (hourly), omni2_YYYY.dat",
  "year": 2024,
  "timeStep": 3600,
  "referenceIso": "2024-01-01T00:00:00Z",
  "epochs": [1704067200, 1704070800, ...],
  "vSw": [400.5, 401.2, ...],
  "nSw": [5.1, null, ...],
  "By": [0.2, 0.1, ...],
  "Bz": [-0.5, 0.0, ...],
  "Dst": [-10, -5, ...]
}
```

`null` values represent missing/fill-value hours (pass through as `NaN` at runtime and fall
back to the previous good value or the quiet-storm default).

**Location**: `public/data/solarwind-YYYY.json`
**One file per calendar year** for incremental updates and lazy loading.

---

## 6. Preprocessing Script

### `scripts/convert-solarwind.js`

Mirrors `scripts/convert-igrf.js`:

```
USAGE:
  node scripts/convert-solarwind.js 2024
  node scripts/convert-solarwind.js 2020 2024   # batch: 2020–2024
```

**Pipeline**:
1. Fetch `https://spdf.gsfc.nasa.gov/pub/data/omni/low_res_omni/omni2_YYYY.dat`
   (or read a local copy passed as a 3rd argument)
2. Parse fixed-width columns (year/doy/hour → ISO timestamp → Unix epoch)
3. Replace fill values (999.9, 9999, 99999) with `null`
4. Transpose row-oriented records into columnar arrays
5. Write `public/data/solarwind-YYYY.json`

The OMNI format is fixed-width (no delimiter), so parsing requires column byte offsets from
the format spec at `omni2.text`. Key offsets (1-indexed character positions):
- Cols 1–4: Year (YYYY)
- Cols 6–8: Day of year
- Cols 10–11: Hour (0–23)
- By GSM: starts at col 109 (width 8)
- Bz GSM: starts at col 118 (width 8)
- Speed: starts at col 224 (width 6)
- Density: starts at col 231 (width 6)
- Dst: starts at col 327 (width 6)

*(Exact offsets should be verified against the format spec before implementation.)*

---

## 7. Runtime Integration

### New module: `src/physics/solarWindData.js`

```
loadSolarWindData(year)         → fetches + caches public/data/solarwind-YYYY.json
getSolarWindAtTime(unixSeconds) → binary search → { vSw, nSw, By, Bz, Dst } | null
isDataAvailable(year)           → boolean
```

Binary search on the `epochs` array is O(log 8760) ≈ 13 comparisons — fast enough for
every-frame lookup.

### Timeline integration

In `lightUpdateDatetime(isoString)` (already called every frame during playback):
- Extract `unixSeconds` from the current sim time
- Call `getSolarWindAtTime(unixSeconds)`
- If a data record is returned, feed it into `solarWindParams` instead of the GUI sliders

### UI changes

In `controlPanel.js`, the solar wind folder gets a new state:
- **"Manual"** (default, current behaviour) — user controls sliders
- **"Historical"** — sliders become read-only displays driven by data

Add year-selector dropdown (2016–current) and a "Data loaded" / "No data" indicator.

---

## 8. Data Download Strategy

**Bundled with the app** (recommended for Phase 4 MVP):
- The preprocessing script is run by a developer and the output JSON is committed to the repo
- Vite includes it in the build as a static asset
- One year per developer session (e.g., ship 2024 data initially)
- No runtime network dependency (works offline, no CORS issues)

**On-demand fetch** (future enhancement):
- Fetch only the year(s) the user navigates to
- Cache in IndexedDB (`localForage` or raw IDB) for subsequent sessions
- Prefetch current year on startup

---

## 9. Open Questions

1. **OMNI column offsets**: Need to verify exact byte positions from `omni2.text` before
   writing the parser. The format has evolved over the decades and some columns shift.

2. **Dst timing**: Dst is published with ~1-hour latency. For near-real-time use, the last
   few hours of Dst may be preliminary. Mark provisional values with a quality flag.

3. **G1/G2 formula**: For T01, the exact integral definitions from Tsyganenko & Sitnov (2005)
   should be coded in `solarWindData.js` as `computeG1G2(hourlyWindow)`. The window is
   typically 1 hour for G1 and the full storm period for G2 — confirm from the paper.

4. **Gap filling**: OMNI has gaps (spacecraft maneuvers, instrument outages). For playback,
   decide whether to interpolate across gaps (up to N hours) or display a "no data" notice.

5. **Future: DSCOVR real-time for "now" mode**: If the app adds a "current time" live mode,
   the SWPC 7-day JSON API would replace the OMNI static file for the most recent hours.

---

## References

- NASA OMNI Low-Resolution Data: <https://omniweb.gsfc.nasa.gov/>
- OMNI FTP archive: <https://spdf.gsfc.nasa.gov/pub/data/omni/low_res_omni/>
- OMNI format spec: <https://spdf.gsfc.nasa.gov/pub/data/omni/low_res_omni/omni2.text>
- NOAA SWPC real-time JSON: <https://services.swpc.noaa.gov/products/solar-wind/>
- Kyoto Dst index: <https://wdc.kugi.kyoto-u.ac.jp/dst_final/>
- Tsyganenko & Sitnov (2005) — T01 G1/G2 definition:
  *Magnetospheric configurations from a high-resolution data-based magnetic field model.*
  JGR, 110, A03208. DOI: 10.1029/2007JA012832
- DSCOVR Space Weather Portal: <https://www.ncei.noaa.gov/cloud-access/space-weather-portal/>
