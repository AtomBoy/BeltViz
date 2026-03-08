#!/usr/bin/env node
/**
 * scripts/convert-tles.js
 *
 * Converts a Space Track bulk 2-line TLE file into monthly JSON snapshots
 * suitable for BeltViz's historical satellite propagation.
 *
 * Only satellites already in public/data/satellites.json are included —
 * this preserves the curated ~1,500-satellite set with its name/class metadata.
 *
 * For each satellite × month, the TLE whose epoch is closest to the 15th
 * of that month is selected, giving a midpoint snapshot that minimises
 * propagation error across the whole month.
 *
 * Satellites in the catalog that have no TLE for a given month keep the
 * TLE from satellites.json (or the most recently loaded monthly file).
 * The runtime falls back gracefully — only updated entries are stored.
 *
 * Usage:
 *   node scripts/convert-tles.js 2025
 *   node scripts/convert-tles.js 2025 public/data/tle2025.txt
 *
 * Output: public/data/tles/YYYY-MM.json  (one file per month)
 *
 * Output format:
 *   {
 *     "version": "1.0",
 *     "month": "2025-01",
 *     "count": 1487,
 *     "tles": {
 *       "25544": ["1 25544U ...", "2 25544  ..."],
 *       ...
 *     }
 *   }
 */

import { createReadStream, mkdirSync, writeFileSync, existsSync } from 'fs';
import { createInterface } from 'readline';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);

// ─── Args ─────────────────────────────────────────────────────────────────────

const year    = parseInt(process.argv[2], 10);
const tlePath = process.argv[3] ?? join(__dirname, '..', 'public', 'data', `tle${year}.txt`);

if (!year || isNaN(year)) {
  console.error('Usage: node scripts/convert-tles.js <year> [path/to/tle.txt]');
  process.exit(1);
}
if (!existsSync(tlePath)) {
  console.error(`TLE file not found: ${tlePath}`);
  process.exit(1);
}

// ─── Load catalog ─────────────────────────────────────────────────────────────

const catalogPath = join(__dirname, '..', 'public', 'data', 'satellites.json');
if (!existsSync(catalogPath)) {
  console.error(`Catalog not found: ${catalogPath}  (run convert-satellites.js first)`);
  process.exit(1);
}
const catalog = require(catalogPath);
const catalogIds = new Set(catalog.satellites.map(s => s.id));
console.log(`Catalog: ${catalogIds.size} satellites loaded from satellites.json`);
console.log(`Input:   ${tlePath}`);

// ─── TLE parsing helpers ───────────────────────────────────────────────────────

/** Parse NORAD catalog number from TLE line 1 (chars 2–6, 0-indexed). */
function parseNoradId(line1) {
  return parseInt(line1.substring(2, 7).trim(), 10);
}

/**
 * Parse TLE epoch from line 1 (chars 18–31) and return a JS Date.
 * Format: YYDDD.DDDDDDDD
 *   YY  — 2-digit year (< 57 → 2000s, ≥ 57 → 1900s, per TLE spec)
 *   DDD — day of year (1-based), fractional part = fraction of day
 */
function parseEpochDate(line1) {
  const raw  = line1.substring(18, 32).trim();
  const yy   = parseInt(raw.substring(0, 2), 10);
  const year = yy < 57 ? 2000 + yy : 1900 + yy;
  const dayFrac = parseFloat(raw.substring(2));
  const dayInt  = Math.floor(dayFrac);
  const ms      = Math.round((dayFrac - dayInt) * 86_400_000);
  // Day 1 = Jan 1, so offset by (dayInt - 1)
  return new Date(Date.UTC(year, 0, 1) + (dayInt - 1) * 86_400_000 + ms);
}

/** "YYYY-MM" key for a Date. */
function monthKey(date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;
}

// ─── Stream + collect ─────────────────────────────────────────────────────────

// monthBuckets: Map<"YYYY-MM", Map<noradId, { line1, line2, distFromMid }>>
const monthBuckets = new Map();

let line1Pending = null;
let totalParsed  = 0;
let totalKept    = 0;
let lineCount    = 0;

console.log('Streaming TLE file…');

const rl = createInterface({
  input: createReadStream(tlePath, { encoding: 'ascii' }),
  crlfDelay: Infinity,
});

for await (const rawLine of rl) {
  lineCount++;
  if (lineCount % 5_000_000 === 0) {
    process.stdout.write(`  ${(lineCount / 1_000_000).toFixed(0)}M lines read, ${totalKept} kept\r`);
  }

  const line = rawLine.trimEnd();
  if (!line) continue;

  if (line.startsWith('1 ') && line.length >= 69) {
    line1Pending = line;
    continue;
  }

  if (line.startsWith('2 ') && line.length >= 69 && line1Pending) {
    const line1 = line1Pending;
    const line2 = line;
    line1Pending = null;
    totalParsed++;

    const noradId = parseNoradId(line1);
    if (!catalogIds.has(noradId)) continue;

    let epochDate;
    try { epochDate = parseEpochDate(line1); } catch { continue; }

    // Only keep records within our target year
    if (epochDate.getUTCFullYear() !== year) continue;

    const mk          = monthKey(epochDate);
    const distFromMid = Math.abs(epochDate.getUTCDate() - 15);

    if (!monthBuckets.has(mk)) monthBuckets.set(mk, new Map());
    const bucket    = monthBuckets.get(mk);
    const existing  = bucket.get(noradId);

    if (!existing || distFromMid < existing.distFromMid) {
      bucket.set(noradId, { line1, line2, distFromMid });
      if (!existing) totalKept++;
    }
  } else {
    line1Pending = null; // unexpected line — reset pairing
  }
}

console.log(`\nDone streaming: ${totalParsed.toLocaleString()} pairs parsed, ${totalKept.toLocaleString()} catalog entries kept`);
console.log(`Months found: ${[...monthBuckets.keys()].sort().join(', ')}`);

// ─── Write monthly JSON files ─────────────────────────────────────────────────

const outDir = join(__dirname, '..', 'public', 'data', 'tles');
mkdirSync(outDir, { recursive: true });

for (const mk of [...monthBuckets.keys()].sort()) {
  const bucket = monthBuckets.get(mk);
  const tles   = {};
  for (const [noradId, entry] of bucket) {
    tles[String(noradId)] = [entry.line1, entry.line2];
  }
  const obj = {
    version: '1.0',
    month:   mk,
    count:   bucket.size,
    tles,
  };
  const outPath = join(outDir, `${mk}.json`);
  writeFileSync(outPath, JSON.stringify(obj));
  console.log(`  Wrote ${outPath}  (${bucket.size} satellites)`);
}

console.log('Done.');
