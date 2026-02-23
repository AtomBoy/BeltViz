#!/usr/bin/env node
/**
 * convert-solarwind.js
 *
 * Downloads and converts NASA OMNI2 hourly solar wind data for one year
 * into the columnar JSON format used by BeltViz.
 *
 * Usage:
 *   node scripts/convert-solarwind.js [year]            # downloads from NASA SPDF
 *   node scripts/convert-solarwind.js [year] [file.dat] # reads local OMNI2 .dat file
 *
 * Output: public/data/solarwind-YYYY.json
 *
 * Source: NASA OMNI2 low-resolution (hourly) dataset
 *   https://spdf.gsfc.nasa.gov/pub/data/omni/low_res_omni/
 *   Format spec: https://spdf.gsfc.nasa.gov/pub/data/omni/low_res_omni/omni2.text
 *
 * Missing/fill values in the source are preserved as null in the output JSON.
 * Interpolation is handled at runtime by the app (src/physics/solarWindData.js),
 * so the app can indicate when interpolated values are being displayed.
 *
 * OMNI2 column indices (0-based, after splitting each line on whitespace):
 *   [0]  Year
 *   [1]  Day of year (1-based)
 *   [2]  Hour (0-23)
 *   [15] By GSM (nT), fill = 999.9
 *   [16] Bz GSM (nT), fill = 999.9
 *   [23] Proton density (N/cm³), fill = 999.9
 *   [24] Plasma flow speed (km/s), fill = 9999.
 *   [40] Dst index (nT), fill = 99999
 */

import { writeFileSync, readFileSync } from 'node:fs';
import { get } from 'node:https';
import { URL } from 'node:url';

// 0-based column indices after whitespace-splitting each data line
const COL = {
  year:    0,
  doy:     1,
  hour:    2,
  By:      15,  // By GSM (nT)
  Bz:      16,  // Bz GSM (nT)
  density: 23,  // Proton density (N/cm³)
  speed:   24,  // Plasma flow speed (km/s)
  Dst:     40,  // Dst index (nT)
};

// Fill (missing) values used by OMNI2
const FILL = {
  By:      999.9,
  Bz:      999.9,
  density: 999.9,
  speed:   9999,   // stored as "9999." in F6.0 format — parses to 9999
  Dst:     99999,
};

// Convert year + day-of-year (1-based) + hour (0-23) → Unix timestamp (seconds)
function toUnix(year, doy, hour) {
  return Math.floor(Date.UTC(year, 0, 1) / 1000) + (doy - 1) * 86400 + hour * 3600;
}

function isFill(value, fillValue) {
  return Math.abs(value - fillValue) < 0.5;
}

function fetchUrl(urlStr) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(urlStr);
    const options = { hostname: parsed.hostname, path: parsed.pathname + parsed.search };
    get(options, (res) => {
      // Follow redirects
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${urlStr}`));
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end',  () => resolve(Buffer.concat(chunks).toString('utf8')));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  const year      = parseInt(process.argv[2] || new Date().getUTCFullYear() - 1, 10);
  const localFile = process.argv[3] || null;

  if (isNaN(year) || year < 1963 || year > 2099) {
    console.error('Usage: node scripts/convert-solarwind.js [year] [optional-local-file.dat]');
    process.exit(1);
  }

  console.log(`Processing OMNI2 hourly solar wind data for ${year}...`);

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

  const epochs = [];
  const vSw    = [];
  const nSw    = [];
  const By     = [];
  const Bz     = [];
  const Dst    = [];

  const nullCount = { vSw: 0, nSw: 0, By: 0, Bz: 0, Dst: 0 };
  let parsed = 0;

  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim();
    if (!line) continue;

    const p = line.split(/\s+/);
    if (p.length < 55) continue;                       // malformed row
    if (parseInt(p[COL.year], 10) !== year) continue;  // skip adjacent-year rows

    const doy  = parseInt(p[COL.doy],  10);
    const hour = parseInt(p[COL.hour], 10);
    epochs.push(toUnix(year, doy, hour));

    // Speed (km/s) — round to integer, adequate for solar wind
    const speed = parseFloat(p[COL.speed]);
    if (isFill(speed, FILL.speed)) { vSw.push(null); nullCount.vSw++; }
    else vSw.push(Math.round(speed));

    // Proton density (N/cm³) — keep one decimal
    const dens = parseFloat(p[COL.density]);
    if (isFill(dens, FILL.density)) { nSw.push(null); nullCount.nSw++; }
    else nSw.push(Math.round(dens * 10) / 10);

    // By GSM (nT) — one decimal
    const by = parseFloat(p[COL.By]);
    if (isFill(by, FILL.By)) { By.push(null); nullCount.By++; }
    else By.push(Math.round(by * 10) / 10);

    // Bz GSM (nT) — one decimal
    const bz = parseFloat(p[COL.Bz]);
    if (isFill(bz, FILL.Bz)) { Bz.push(null); nullCount.Bz++; }
    else Bz.push(Math.round(bz * 10) / 10);

    // Dst index (nT) — integer
    const dstVal = parseInt(p[COL.Dst], 10);
    if (Math.abs(dstVal) >= FILL.Dst) { Dst.push(null); nullCount.Dst++; }
    else Dst.push(dstVal);

    parsed++;
  }

  if (parsed === 0) {
    console.error(`No valid rows found for year ${year}. Check the source file.`);
    process.exit(1);
  }

  // Expected ~8760 rows for a normal year, 8784 for a leap year
  const expectedRows = ((year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365) * 24;
  const gapRows = expectedRows - parsed;

  console.log(`Parsed ${parsed} / ${expectedRows} expected hourly records (${gapRows} gaps in source)`);
  console.log(`Null counts — vSw: ${nullCount.vSw}, nSw: ${nullCount.nSw}, By: ${nullCount.By}, Bz: ${nullCount.Bz}, Dst: ${nullCount.Dst}`);

  const referenceIso = new Date(epochs[0] * 1000).toISOString().slice(0, 19) + 'Z';

  const output = {
    version:      '1.0',
    source:       `NASA OMNI2 Hourly (omni2_${year}.dat)`,
    year,
    timeStep:     3600,
    referenceIso,
    epochs,
    vSw,
    nSw,
    By,
    Bz,
    Dst,
  };

  const outPath = `public/data/solarwind-${year}.json`;
  const json = JSON.stringify(output);
  writeFileSync(outPath, json);
  console.log(`Written: ${outPath} (${(json.length / 1024).toFixed(0)} KB uncompressed)`);
  console.log('Done.');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
