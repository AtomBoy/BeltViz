#!/usr/bin/env node
/**
 * scripts/convert-satellites.js
 *
 * Converts the Space-Track 3LE file into a curated satellites.json for BeltViz.
 *
 * Usage:
 *   node scripts/convert-satellites.js                      # default: notable set
 *   node scripts/convert-satellites.js --count 2000         # larger notable set
 *   node scripts/convert-satellites.js --all                # all non-debris payloads
 *
 * Input:  public/data/Space-Track.all.3le.txt
 * Output: public/data/satellites.json
 *
 * Orbit classification uses official Space-Track definitions:
 *   LEO:   Mean Motion > 11.25 rev/day AND eccentricity < 0.25
 *   GEO:   0.99 <= Mean Motion <= 1.01 AND eccentricity < 0.01
 *   MEO:   600 min <= Period <= 800 min AND eccentricity < 0.25
 *   HEO:   eccentricity > 0.25
 *   OTHER: everything else
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const INPUT = join(ROOT, 'public', 'data', 'Space-Track.all.3le.txt');
const OUTPUT = join(ROOT, 'public', 'data', 'satellites.json');

// ─── CLI args ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const outputAll = args.includes('--all');
let maxCount = 1500;
const countIdx = args.indexOf('--count');
if (countIdx !== -1 && args[countIdx + 1]) {
  maxCount = parseInt(args[countIdx + 1], 10);
}

// ─── Debris / rocket-body filter ─────────────────────────────────────────────

const JUNK_PATTERNS = [
  'DEB', 'R/B', 'DEBRIS', 'FRAG', 'ADAPTER', 'TANK', 'SHROUD', 'AKM', 'PLF',
  '(YO)', 'TBA -', 'ROCKET', 'OBJECT', 'PAYLOAD COVER',
];

function isJunk(name) {
  const upper = name.toUpperCase();
  return JUNK_PATTERNS.some(p => upper.includes(p));
}

// ─── Orbit classification ─────────────────────────────────────────────────────

function classifyOrbit(line2) {
  const meanMotion   = parseFloat(line2.substring(52, 63));
  const eccentricity = parseFloat('0.' + line2.substring(26, 33));
  const period       = 1440 / meanMotion;

  if (isNaN(meanMotion) || isNaN(eccentricity)) return 'other';

  if (eccentricity > 0.25) return 'heo';
  if (meanMotion > 11.25 && eccentricity < 0.25) return 'leo';
  if (meanMotion >= 0.99 && meanMotion <= 1.01 && eccentricity < 0.01) return 'geo';
  if (period >= 600 && period <= 800 && eccentricity < 0.25) return 'meo';
  return 'other';
}

// ─── Notable satellite detection ─────────────────────────────────────────────

// Name substrings that make a satellite "notable" (case-insensitive).
// Longer/more specific patterns are checked first to avoid false matches.
const NOTABLE_SUBSTRINGS = [
  // ISS modules
  'ISS (ZARYA)', 'ISS (NAUKA)', 'ISS (UNITY)', 'ZARYA', 'ZVEZDA', 'TRANQUILITY',
  // Space telescopes / observatories
  'HST', 'HUBBLE',
  'CHANDRA',
  'XMM-NEWTON', 'XMM ',
  'INTEGRAL',
  'JAMES WEBB', 'JWST',
  'FERMI',
  'SWIFT',
  'NUSTAR',
  'KEPLER',
  'TESS',
  'GAIA',
  // Solar monitors
  'SOLAR ORBITER',
  'PARKER SOLAR',
  'WIND',
  'ACE',
  'DSCOVR',
  'HINODE',
  'STEREO ',
  'SOHO',
  'SDO',
  // Earth obs
  'TERRA',
  'AQUA',
  'AURA',
  'LANDSAT',
  'SENTINEL-',
  'SENTINEL ',
  'JASON ',
  'GRACE',
  'ICESAT',
  'CYGNSS',
  'RADARSAT',
  'WORLDVIEW',
  'GEOEYE',
  'PLEIADES',
  'SORCE',
  // Magnetosphere / radiation belt science
  'SWARM A', 'SWARM B', 'SWARM C',
  'MMS 1', 'MMS 2', 'MMS 3', 'MMS 4',
  'THEMIS A', 'THEMIS B', 'THEMIS C', 'THEMIS D', 'THEMIS E',
  'RBSP A', 'RBSP B',
  'ARASE',
  'CLUSTER ',
  'GEOTAIL',
  'COSMIC',
  // Weather satellites
  'GOES ',
  'NOAA ',
  'METOP',
  'DMSP ',
  'JPSS',
  'SNPP', 'NPP',
  'HIMAWARI',
  'METEOSAT',
  'INSAT',
  // Navigation constellations (all satellites — small constellations)
  'NAVSTAR',     // GPS
  'GLONASS',     // matches "COSMOS XXXX (GLONASS)"
  'GALILEO',     // matches "GALILEO-PFM", "GALILEO 5", etc.
  'BEIDOU',      // matches "BEIDOU 3M1", etc.
  'GIOVE',       // Galileo test satellites
  // Station-keeping / misc notable
  'PROBA-',
  'CALET',
  'AMS-',
];

// Megaconstellations: cap each to conserve budget.
const MEGA_CONSTELLATIONS = [
  { prefix: 'STARLINK', cap: 100 },
  { prefix: 'ONEWEB',   cap: 30  },
  { prefix: 'IRIDIUM',  cap: 25  },
  { prefix: 'ORBCOMM',  cap: 10  },
  { prefix: 'GLOBALSTAR', cap: 10 },
];

function isNotable(name) {
  const upper = name.toUpperCase();
  // Check notable substrings
  for (const sub of NOTABLE_SUBSTRINGS) {
    if (sub === 'ISS DEB') continue; // skip this entry, handled by junk filter
    if (upper.includes(sub.toUpperCase())) return true;
  }
  return false;
}

function getMegaPrefix(name) {
  const upper = name.toUpperCase();
  for (const { prefix } of MEGA_CONSTELLATIONS) {
    if (upper.startsWith(prefix)) return prefix;
  }
  return null;
}

// ─── TLE parsing ─────────────────────────────────────────────────────────────

function parseTLE(nameLine, line1, line2) {
  const name = nameLine.replace(/^0\s+/, '').trim();
  const id = parseInt(line1.substring(2, 7).trim(), 10);
  if (isNaN(id)) return null;

  const orbitClass = classifyOrbit(line2);
  const notable = isNotable(name);
  const megaPrefix = getMegaPrefix(name);

  return { id, name, orbitClass, notable, megaPrefix, line1: line1.trimEnd(), line2: line2.trimEnd() };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

if (!existsSync(INPUT)) {
  console.error(`Error: TLE file not found at ${INPUT}`);
  process.exit(1);
}

const raw = readFileSync(INPUT, 'utf8');
const lines = raw.split('\n');

// Parse all 3LE records
const all = [];
for (let i = 0; i < lines.length - 2; i += 3) {
  const nameLine = lines[i].trim();
  const line1 = lines[i + 1].trim();
  const line2 = lines[i + 2].trim();

  // Validate format
  if (!line1.startsWith('1 ') || !line2.startsWith('2 ')) {
    // Try to handle 2LE format (no name line)
    // Skip silently — the file is 3LE so this shouldn't happen
    continue;
  }

  const name = nameLine.replace(/^0\s+/, '').trim();
  if (!name || isJunk(name)) continue;

  const record = parseTLE(nameLine, line1, line2);
  if (!record) continue;

  all.push(record);
}

console.log(`Parsed ${all.length} non-debris satellites from TLE file.`);

// Count by orbit class
const classCounts = { leo: 0, meo: 0, geo: 0, heo: 0, other: 0 };
for (const s of all) classCounts[s.orbitClass]++;
console.log('Orbit class distribution:', classCounts);

let selected;

if (outputAll) {
  selected = all;
  console.log(`--all flag: including all ${selected.length} non-debris payloads.`);
} else {
  // Build curated set: notable first, then megaconstellations (capped), then fill
  const megaCounts = {};
  const notableSet = [];
  const megaSet = [];
  const otherSet = [];

  for (const sat of all) {
    if (sat.notable) {
      notableSet.push(sat);
    } else if (sat.megaPrefix) {
      const cap = MEGA_CONSTELLATIONS.find(m => m.prefix === sat.megaPrefix)?.cap ?? 10;
      megaCounts[sat.megaPrefix] = (megaCounts[sat.megaPrefix] ?? 0);
      if (megaCounts[sat.megaPrefix] < cap) {
        megaCounts[sat.megaPrefix]++;
        megaSet.push(sat);
      }
    } else {
      otherSet.push(sat);
    }
  }

  // Fill remaining budget from otherSet (one-per-name-prefix for variety)
  const remaining = maxCount - notableSet.length - megaSet.length;
  const prefixSeen = new Set();
  const filler = [];
  if (remaining > 0) {
    for (const sat of otherSet) {
      if (filler.length >= remaining) break;
      const prefix = sat.name.split(' ')[0].toUpperCase();
      if (!prefixSeen.has(prefix)) {
        prefixSeen.add(prefix);
        filler.push(sat);
      }
    }
  }

  selected = [...notableSet, ...megaSet, ...filler];

  console.log(`Notable: ${notableSet.length}, Mega-constellation capped: ${megaSet.length}, Filler: ${filler.length}`);
}

// Strip megaPrefix from output (internal use only)
const output = selected.map(({ megaPrefix: _, ...rest }) => rest);

// Sort by orbit class then NORAD ID
const classOrder = { leo: 0, meo: 1, geo: 2, heo: 3, other: 4 };
output.sort((a, b) => (classOrder[a.orbitClass] - classOrder[b.orbitClass]) || (a.id - b.id));

const result = {
  version: '1.0',
  generated: new Date().toISOString(),
  count: output.length,
  satellites: output,
};

writeFileSync(OUTPUT, JSON.stringify(result));

const fileSizeKB = Math.round(Buffer.byteLength(JSON.stringify(result)) / 1024);
console.log(`Written ${output.length} satellites to ${OUTPUT} (${fileSizeKB} KB)`);

// Spot-check some known satellites
const names = output.map(s => s.name);
for (const check of ['ISS (ZARYA)', 'HUBBLE', 'GOES', 'GPS', 'STARLINK']) {
  const found = names.filter(n => n.toUpperCase().includes(check.toUpperCase()));
  console.log(`  ${check}: ${found.length} matches (e.g. ${found.slice(0, 3).join(', ')})`);
}
