#!/usr/bin/env node
/**
 * convert-solarwind.js
 *
 * Builds public/data/solarwind-YYYY.json — a columnar JSON file with hourly
 * solar wind parameters used by BeltViz for historical playback and as T01 inputs.
 *
 * DATA SOURCES
 * ─────────────
 * Priority 1 — WGhour.d (local, preferred):
 *   The rweigel/QinDenton Fortran tool produces WGhour.d from OMNI2 source data.
 *   Covers 1963 to present with G1 and G2 pre-computed for Tsyganenko T01.
 *   If public/data/WGhour.d exists it is used automatically for any year.
 *   See: https://github.com/rweigel/QinDenton
 *
 * Priority 2 — Qin-Denton ISWA (network, years 1995–2019):
 *   Source: https://iswa.gsfc.nasa.gov/iswa_data_tree/composite/magnetosphere/Qin-Denton/hour/
 *   Files:  QinDenton_YYYYMMDD_hour.txt  (one per calendar day, in year/month/ subdirectories)
 *   Contains all solar wind fields AND pre-computed G1, G2 for Tsyganenko T01.
 *   Note: rbsp-ect.newmexicoconsortium.org extends to ~2022 but rate-limits aggressively.
 *
 * Priority 3 — OMNI2 (network fallback, no G1/G2):
 *   Uses NASA OMNI2 low-resolution hourly dataset.
 *   Source: https://spdf.gsfc.nasa.gov/pub/data/omni/low_res_omni/omni2_YYYY.dat
 *   G1 and G2 arrays will be all-null (T01 will run with storm-history = 0).
 *
 * Usage:
 *   node scripts/convert-solarwind.js 2024            # auto-detect source (WGhour.d preferred)
 *   node scripts/convert-solarwind.js 2024 public/data/WGhour.d  # explicit WGhour.d path
 *   node scripts/convert-solarwind.js 2019            # Qin-Denton year (ISWA/NASA if no WGhour.d)
 *   node scripts/convert-solarwind.js 2025            # OMNI2 fallback (no G1/G2, no WGhour.d)
 *   node scripts/convert-solarwind.js 2025 /tmp/omni2_2025.dat  # explicit local OMNI2 file
 *
 * Output: public/data/solarwind/YYYY-MM.json (version 2.0 format)
 *
 * Missing/fill values are preserved as null. Interpolation is handled at runtime
 * by src/physics/solarWindData.js.
 *
 * WGHOUR.D column layout (0-based after whitespace split):
 *   [0]  Year  [1] Day-of-year  [2] Hour
 *   [3]  ByIMF (nT)   [4] BzIMF (nT)
 *   [5]  V_SW (km/s)  [6] Den_P (cm⁻³)  [7] Pdyn (nPa, unused)
 *   [8]  G1           [9] G2             [10] G3 (unused)
 *   [11] 8-char status  [12] kp  [13] akp3  [14] Dst (nT)
 *   [15-20] Bz1-6   [21-26] W1-6   [27] 6-char status
 *
 * QIN-DENTON column layout (0-based after whitespace split):
 *   [0]  IsoDateTime  [1-6] Year/Month/Day/Hour/Min/Sec
 *   [7]  ByIMF (nT)   [8]  BzIMF (nT)
 *   [9]  Vsw (km/s)   [10] Den_P (cm⁻³)   [11] Pdyn (nPa)
 *   [12] G1           [13] G2              [14] G3 (unused)
 *   [15-22] status flags
 *   [23] Kp           [24] akp3            [25] Dst (nT)
 *
 * OMNI2 column layout (0-based after whitespace split):
 *   [0]  Year  [1] Day-of-year  [2] Hour
 *   [15] By GSM (nT)   [16] Bz GSM (nT)
 *   [23] Proton density (cm⁻³)   [24] Flow speed (km/s)
 *   [40] Dst index (nT)
 */

import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { get  as httpsGet }  from 'node:https';
import { get  as httpGet  }  from 'node:http';
import { URL } from 'node:url';

// Default WGhour.d path (produced by rweigel/QinDenton Fortran tool).
// If this file exists it is used automatically for any year (covers 1963–present, includes G1/G2).
const WG_DEFAULT_PATH = 'public/data/WGhour.d';

// Last year with Qin-Denton data available on ISWA (NASA server — reliable, no SSL issues).
// rbsp-ect.newmexicoconsortium.org has data to ~2022 but rate-limits aggressively; use ISWA instead.
const QD_MAX_YEAR = 2019;
// ISWA URL structure: /iswa_data_tree/composite/magnetosphere/Qin-Denton/hour/{YYYY}/{MM}/QinDenton_{YYYYMMDD}_hour.txt
const QD_HOST = 'iswa.gsfc.nasa.gov';
const QD_PATH = '/iswa_data_tree/composite/magnetosphere/Qin-Denton/hour';

// WGhour.d column indices (0-based after whitespace split)
const WG_COL = {
  year:   0,
  doy:    1,
  hour:   2,
  by:     3,   // ByIMF (nT)
  bz:     4,   // BzIMF (nT)
  vsw:    5,   // V_SW (km/s)
  nSw:    6,   // Den_P (cm⁻³)
  g1:     8,   // G1 disturbance index for T01
  g2:     9,   // G2 disturbance index for T01
  dst:    14,  // Dst (nT)
};

// Qin-Denton column indices (0-based after whitespace split)
const QD_COL = {
  iso:  0,
  by:   7,   // ByIMF (nT)
  bz:   8,   // BzIMF (nT)
  vsw:  9,   // Solar wind speed (km/s)
  nSw:  10,  // Proton density (cm⁻³)
  g1:   12,  // G1 disturbance index for T01
  g2:   13,  // G2 disturbance index for T01
  dst:  25,  // Dst index (nT)
};

// OMNI2 column indices
const OMNI_COL = {
  year:    0,
  doy:     1,
  hour:    2,
  By:      15,
  Bz:      16,
  density: 23,
  speed:   24,
  Dst:     40,
};

// Fill (missing) values — same for both sources (OMNI-derived)
const FILL_MAG    = 999.9;   // By, Bz, density, G1, G2
const FILL_SPEED  = 9999;    // Vsw
const FILL_DST    = 99999;   // Dst

function isFill(v, fill) { return Math.abs(v - fill) < 0.5; }

// ─── HTTP helpers ────────────────────────────────────────────────────────────

function fetchUrl(urlStr) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const lib    = parsed.protocol === 'https:' ? httpsGet : httpGet;
    lib(parsed.href, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${urlStr}`));
      }
      const chunks = [];
      res.on('data',  (c) => chunks.push(c));
      res.on('end',   () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

// Download in parallel batches to avoid overwhelming the server
async function fetchBatch(urls, batchSize = 20) {
  const results = new Array(urls.length);
  for (let i = 0; i < urls.length; i += batchSize) {
    const slice   = urls.slice(i, i + batchSize);
    const fetched = await Promise.all(slice.map((u) => fetchUrl(u).catch(() => null)));
    for (let j = 0; j < fetched.length; j++) results[i + j] = fetched[j];
    process.stdout.write(`\r  Downloaded ${Math.min(i + batchSize, urls.length)} / ${urls.length} files...`);
  }
  process.stdout.write('\n');
  return results;
}

// ─── Date helpers ────────────────────────────────────────────────────────────

function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
function daysInYear(y) { return isLeap(y) ? 366 : 365; }

// year + doy (1-based) + hour → Unix seconds
function toUnix(year, doy, hour) {
  return Math.floor(Date.UTC(year, 0, 1) / 1000) + (doy - 1) * 86400 + hour * 3600;
}

// year + month (1-based) + day (1-based) → day-of-year (1-based)
function toDoy(year, month, day) {
  const monthDays = [0,31,28,31,30,31,30,31,31,30,31,30,31];
  if (isLeap(year)) monthDays[2] = 29;
  let doy = day;
  for (let m = 1; m < month; m++) doy += monthDays[m];
  return doy;
}

// YYYYMMDD string → { year, month, day }
function parseDateStr(s) {
  return { year: +s.slice(0,4), month: +s.slice(4,6), day: +s.slice(6,8) };
}

// ─── Qin-Denton path ─────────────────────────────────────────────────────────

function qdUrl(year, month, day) {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  // ISWA URL: /iswa_data_tree/composite/magnetosphere/Qin-Denton/hour/YYYY/MM/QinDenton_YYYYMMDD_hour.txt
  return `https://${QD_HOST}${QD_PATH}/${year}/${mm}/QinDenton_${year}${mm}${dd}_hour.txt`;
}

function allDatesInYear(year) {
  const dates = [];
  const monthDays = [0,31,28,31,30,31,30,31,31,30,31,30,31];
  if (isLeap(year)) monthDays[2] = 29;
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= monthDays[m]; d++) dates.push({ year, month: m, day: d });
  }
  return dates;
}

function parseQdText(text, year) {
  const rows = [];
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const p = line.split(/\s+/);
    if (p.length < 30) continue;

    // Parse ISO datetime: 2022-01-01T00:00:00
    const isoStr = p[QD_COL.iso];
    if (!isoStr || isoStr.length < 19) continue;
    const unixMs = Date.parse(isoStr);
    if (isNaN(unixMs)) continue;
    const unixSec = Math.floor(unixMs / 1000);

    // Filter to requested year
    const rowYear = parseInt(p[1], 10);
    if (rowYear !== year) continue;

    const by   = parseFloat(p[QD_COL.by]);
    const bz   = parseFloat(p[QD_COL.bz]);
    const vsw  = parseFloat(p[QD_COL.vsw]);
    const nSw  = parseFloat(p[QD_COL.nSw]);
    const g1   = parseFloat(p[QD_COL.g1]);
    const g2   = parseFloat(p[QD_COL.g2]);
    const dst  = parseFloat(p[QD_COL.dst]);

    rows.push({
      epoch: unixSec,
      by:   isFill(by,  FILL_MAG)   ? null : Math.round(by  * 10) / 10,
      bz:   isFill(bz,  FILL_MAG)   ? null : Math.round(bz  * 10) / 10,
      vsw:  isFill(vsw, FILL_SPEED) ? null : Math.round(vsw),
      nSw:  isFill(nSw, FILL_MAG)   ? null : Math.round(nSw * 10) / 10,
      g1:   isFill(g1,  FILL_MAG)   ? null : Math.round(g1  * 100) / 100,
      g2:   isFill(g2,  FILL_MAG)   ? null : Math.round(g2  * 100) / 100,
      dst:  Math.abs(dst) >= FILL_DST ? null : Math.round(dst),
    });
  }
  return rows;
}

async function buildFromQinDenton(year) {
  console.log(`Downloading Qin-Denton hourly files for ${year}...`);
  const dates = allDatesInYear(year);
  const urls  = dates.map(({ year: y, month: m, day: d }) => qdUrl(y, m, d));
  const texts = await fetchBatch(urls, 20);

  const rowMap = new Map(); // epoch → row (dedup + sort by epoch)
  let files404 = 0;
  for (const text of texts) {
    if (!text) { files404++; continue; }
    for (const row of parseQdText(text, year)) {
      rowMap.set(row.epoch, row);
    }
  }
  if (files404 > 0) console.log(`  (${files404} daily files unavailable — nulls for those days)`);

  // Sort by epoch and flatten into columnar arrays
  const sorted = [...rowMap.entries()].sort((a, b) => a[0] - b[0]).map(([, r]) => r);

  const epochs = [], vSw = [], nSw = [], By = [], Bz = [], Dst = [], G1 = [], G2 = [];
  const nullCount = { vSw: 0, nSw: 0, By: 0, Bz: 0, Dst: 0, G1: 0, G2: 0 };

  for (const r of sorted) {
    epochs.push(r.epoch);
    vSw.push(r.vsw); if (r.vsw === null) nullCount.vSw++;
    nSw.push(r.nSw); if (r.nSw === null) nullCount.nSw++;
    By.push(r.by);   if (r.by  === null) nullCount.By++;
    Bz.push(r.bz);   if (r.bz  === null) nullCount.Bz++;
    Dst.push(r.dst);  if (r.dst  === null) nullCount.Dst++;
    G1.push(r.g1);   if (r.g1  === null) nullCount.G1++;
    G2.push(r.g2);   if (r.g2  === null) nullCount.G2++;
  }

  const expected = daysInYear(year) * 24;
  console.log(`Parsed ${sorted.length} / ${expected} expected hourly records`);
  console.log(`Null counts — vSw:${nullCount.vSw} nSw:${nullCount.nSw} By:${nullCount.By} Bz:${nullCount.Bz} Dst:${nullCount.Dst} G1:${nullCount.G1} G2:${nullCount.G2}`);

  return {
    version:      '2.0',
    sources:      ['Qin-Denton hourly (iswa.gsfc.nasa.gov — Qin et al. 2007)'],
    year,
    timeStep:     3600,
    referenceIso: new Date(epochs[0] * 1000).toISOString().slice(0, 19) + 'Z',
    epochs, vSw, nSw, By, Bz, Dst, G1, G2,
  };
}

// ─── WGhour.d path (preferred when file is present locally) ──────────────────

function parseWGText(text, year) {
  const rows = [];
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line || line.startsWith('Year')) continue; // skip header
    const p = line.split(/\s+/);
    if (p.length < 15) continue;

    const rowYear = parseInt(p[WG_COL.year], 10);
    if (isNaN(rowYear) || rowYear !== year) continue;

    const doy   = parseInt(p[WG_COL.doy],  10);
    const hour  = parseInt(p[WG_COL.hour], 10);
    if (isNaN(doy) || isNaN(hour)) continue;
    const epoch = toUnix(year, doy, hour);

    const by  = parseFloat(p[WG_COL.by]);
    const bz  = parseFloat(p[WG_COL.bz]);
    const vsw = parseFloat(p[WG_COL.vsw]);
    const nSw = parseFloat(p[WG_COL.nSw]);
    const g1  = parseFloat(p[WG_COL.g1]);
    const g2  = parseFloat(p[WG_COL.g2]);
    const dst = parseFloat(p[WG_COL.dst]);

    rows.push({
      epoch,
      by:  isFill(by,  FILL_MAG)   ? null : Math.round(by  * 10) / 10,
      bz:  isFill(bz,  FILL_MAG)   ? null : Math.round(bz  * 10) / 10,
      vsw: isFill(vsw, FILL_SPEED) ? null : Math.round(vsw),
      nSw: isFill(nSw, FILL_MAG)   ? null : Math.round(nSw * 10) / 10,
      g1:  isFill(g1,  FILL_MAG)   ? null : Math.round(g1  * 100) / 100,
      g2:  isFill(g2,  FILL_MAG)   ? null : Math.round(g2  * 100) / 100,
      dst: Math.abs(dst) >= FILL_DST ? null : Math.round(dst),
    });
  }
  return rows;
}

async function buildFromWGhour(year, wgFile) {
  console.log(`Reading ${wgFile}...`);
  const text = readFileSync(wgFile, 'utf8');
  console.log(`  File size: ${(text.length / 1024 / 1024).toFixed(1)} MB`);

  const rows = parseWGText(text, year);
  const expected = daysInYear(year) * 24;

  const epochs = [], vSw = [], nSw = [], By = [], Bz = [], Dst = [], G1 = [], G2 = [];
  const nullCount = { vSw: 0, nSw: 0, By: 0, Bz: 0, Dst: 0, G1: 0, G2: 0 };

  for (const r of rows) {
    epochs.push(r.epoch);
    vSw.push(r.vsw); if (r.vsw === null) nullCount.vSw++;
    nSw.push(r.nSw); if (r.nSw === null) nullCount.nSw++;
    By.push(r.by);   if (r.by  === null) nullCount.By++;
    Bz.push(r.bz);   if (r.bz  === null) nullCount.Bz++;
    Dst.push(r.dst);  if (r.dst  === null) nullCount.Dst++;
    G1.push(r.g1);   if (r.g1  === null) nullCount.G1++;
    G2.push(r.g2);   if (r.g2  === null) nullCount.G2++;
  }

  console.log(`Parsed ${rows.length} / ${expected} expected hourly records`);
  console.log(`Null counts — vSw:${nullCount.vSw} nSw:${nullCount.nSw} By:${nullCount.By} Bz:${nullCount.Bz} Dst:${nullCount.Dst} G1:${nullCount.G1} G2:${nullCount.G2}`);

  if (rows.length === 0) {
    throw new Error(`No records found for year ${year} in ${wgFile}. Check file coverage.`);
  }

  return {
    version:      '2.0',
    sources:      ['Qin-Denton/WGhour.d (rweigel/QinDenton from OMNI2; github.com/rweigel/QinDenton)'],
    year,
    timeStep:     3600,
    referenceIso: new Date(epochs[0] * 1000).toISOString().slice(0, 19) + 'Z',
    epochs, vSw, nSw, By, Bz, Dst, G1, G2,
  };
}

// ─── OMNI2 path (fallback for years > QD_MAX_YEAR) ──────────────────────────

function parseOmni2Text(text, year) {
  const epochs = [], vSw = [], nSw = [], By = [], Bz = [], Dst = [];
  const nullCount = { vSw: 0, nSw: 0, By: 0, Bz: 0, Dst: 0 };
  let parsed = 0;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;
    const p = line.split(/\s+/);
    if (p.length < 55) continue;
    if (parseInt(p[OMNI_COL.year], 10) !== year) continue;

    const doy  = parseInt(p[OMNI_COL.doy],  10);
    const hour = parseInt(p[OMNI_COL.hour], 10);
    epochs.push(toUnix(year, doy, hour));

    const speed = parseFloat(p[OMNI_COL.speed]);
    if (isFill(speed, FILL_SPEED)) { vSw.push(null); nullCount.vSw++; }
    else vSw.push(Math.round(speed));

    const dens = parseFloat(p[OMNI_COL.density]);
    if (isFill(dens, FILL_MAG)) { nSw.push(null); nullCount.nSw++; }
    else nSw.push(Math.round(dens * 10) / 10);

    const by = parseFloat(p[OMNI_COL.By]);
    if (isFill(by, FILL_MAG)) { By.push(null); nullCount.By++; }
    else By.push(Math.round(by * 10) / 10);

    const bz = parseFloat(p[OMNI_COL.Bz]);
    if (isFill(bz, FILL_MAG)) { Bz.push(null); nullCount.Bz++; }
    else Bz.push(Math.round(bz * 10) / 10);

    const dstVal = parseInt(p[OMNI_COL.Dst], 10);
    if (Math.abs(dstVal) >= FILL_DST) { Dst.push(null); nullCount.Dst++; }
    else Dst.push(dstVal);

    parsed++;
  }

  return { epochs, vSw, nSw, By, Bz, Dst, parsed, nullCount };
}

async function buildFromOmni2(year, localFile) {
  let text;
  if (localFile) {
    text = readFileSync(localFile, 'utf8');
    console.log(`Read local file: ${localFile} (${(text.length / 1024).toFixed(0)} KB)`);
  } else {
    const url = `https://spdf.gsfc.nasa.gov/pub/data/omni/low_res_omni/omni2_${year}.dat`;
    console.log(`Downloading: ${url}`);
    text = await fetchUrl(url);
    console.log(`Downloaded ${(text.length / 1024).toFixed(0)} KB`);
  }

  const { epochs, vSw, nSw, By, Bz, Dst, parsed, nullCount } = parseOmni2Text(text, year);
  const expected = daysInYear(year) * 24;
  console.log(`Parsed ${parsed} / ${expected} expected hourly records`);
  console.log(`Null counts — vSw:${nullCount.vSw} nSw:${nullCount.nSw} By:${nullCount.By} Bz:${nullCount.Bz} Dst:${nullCount.Dst}`);
  console.log('Note: G1/G2 are null (Qin-Denton not available for this year). T01 will use G1=G2=0.');

  const G1 = new Array(epochs.length).fill(null);
  const G2 = new Array(epochs.length).fill(null);

  return {
    version:      '2.0',
    sources:      [`NASA OMNI2 Hourly (omni2_${year}.dat)`],
    year,
    timeStep:     3600,
    referenceIso: new Date(epochs[0] * 1000).toISOString().slice(0, 19) + 'Z',
    epochs, vSw, nSw, By, Bz, Dst, G1, G2,
  };
}

// ─── Monthly file writer ──────────────────────────────────────────────────────

/**
 * Split a year's data into 12 monthly JSON files.
 *
 * Input: the full-year data object returned by buildFromXxx().
 * Output: writes public/data/solarwind/YYYY-MM.json for each month present.
 *
 * @param {object} output - { version, sources, year, timeStep, epochs, vSw, nSw, By, Bz, Dst, G1, G2 }
 */
function writeMonthlyFiles(output) {
  const { version, sources, year, timeStep, epochs, vSw, nSw, By, Bz, Dst, G1, G2 } = output;

  // Group record indices by calendar month
  const byMonth = new Map(); // month (1–12) → indices[]
  for (let i = 0; i < epochs.length; i++) {
    const month = new Date(epochs[i] * 1000).getUTCMonth() + 1;
    if (!byMonth.has(month)) byMonth.set(month, []);
    byMonth.get(month).push(i);
  }

  let totalKb = 0;
  const files = [];

  for (const month of [...byMonth.keys()].sort((a, b) => a - b)) {
    const idx = byMonth.get(month);
    const mm  = String(month).padStart(2, '0');

    const monthData = {
      version, sources, year, month, timeStep,
      referenceIso: new Date(epochs[idx[0]] * 1000).toISOString().slice(0, 19) + 'Z',
      epochs: idx.map(i => epochs[i]),
      vSw:    idx.map(i => vSw[i]),
      nSw:    idx.map(i => nSw[i]),
      By:     idx.map(i => By[i]),
      Bz:     idx.map(i => Bz[i]),
      Dst:    idx.map(i => Dst[i]),
      G1:     idx.map(i => G1[i]),
      G2:     idx.map(i => G2[i]),
    };

    const outPath = `public/data/solarwind/${year}-${mm}.json`;
    const json    = JSON.stringify(monthData);
    writeFileSync(outPath, json);
    const kb = (json.length / 1024).toFixed(0);
    totalKb += json.length / 1024;
    files.push(`  ${outPath} (${kb} KB, ${idx.length} records)`);
  }

  for (const f of files) console.log(f);
  console.log(`Total: ${totalKb.toFixed(0)} KB across ${files.length} monthly files`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

// Returns true if the given path looks like a WGhour.d file (by extension).
function isWGhourFile(path) {
  return path.endsWith('.d') || path.endsWith('.D');
}

async function main() {
  const year      = parseInt(process.argv[2] || new Date().getUTCFullYear() - 1, 10);
  const localFile = process.argv[3] || null;

  if (isNaN(year) || year < 1963 || year > 2099) {
    console.error('Usage: node scripts/convert-solarwind.js [year] [optional-local-file.d|.dat]');
    process.exit(1);
  }

  let output;

  if (localFile) {
    // Explicit local file: detect format by extension
    if (isWGhourFile(localFile)) {
      console.log(`Building solarwind/${year}-MM.json  [source: WGhour.d (${localFile})]`);
      output = await buildFromWGhour(year, localFile);
    } else {
      console.log(`Building solarwind/${year}-MM.json  [source: OMNI2 (${localFile})]`);
      output = await buildFromOmni2(year, localFile);
    }
  } else if (existsSync(WG_DEFAULT_PATH)) {
    // Auto-use local WGhour.d when available (covers 1963–present with G1/G2)
    console.log(`Building solarwind/${year}-MM.json  [source: WGhour.d (${WG_DEFAULT_PATH})]`);
    output = await buildFromWGhour(year, WG_DEFAULT_PATH);
  } else if (year <= QD_MAX_YEAR) {
    console.log(`Building solarwind/${year}-MM.json  [source: Qin-Denton (ISWA)]`);
    output = await buildFromQinDenton(year);
  } else {
    console.log(`Building solarwind/${year}-MM.json  [source: OMNI2 (NASA SPDF, no G1/G2)]`);
    output = await buildFromOmni2(year, null);
  }

  writeMonthlyFiles(output);
  console.log('Done.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
