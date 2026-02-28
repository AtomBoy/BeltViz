#!/usr/bin/env node
/**
 * Convert IGRF coefficient text file to JSON.
 *
 * Usage:
 *   node scripts/convert-igrf.js                             # all epochs → public/data/igrf/igrf14-all.json
 *   node scripts/convert-igrf.js [input] [epoch]             # single epoch (for inspection)
 *
 * Arguments:
 *   input  - Path to the IGRF coefficients text file (default: scripts/igrf14coeffs.txt)
 *   epoch  - If given, write a single-epoch file to public/data/igrf14coeffs.json (legacy compat)
 *
 * Output (default — no epoch arg):
 *   public/data/igrf/igrf14-all.json   — all epochs in one file; used by the app at runtime.
 *
 * Examples:
 *   node scripts/convert-igrf.js                             # generate igrf14-all.json
 *   node scripts/convert-igrf.js scripts/igrf14coeffs.txt   # same, explicit input
 *   node scripts/convert-igrf.js scripts/igrf14coeffs.txt 2020.0  # single-epoch legacy file
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';

const inputPath = process.argv[2] || 'scripts/igrf14coeffs.txt';
const requestedEpoch = process.argv[3] ? parseFloat(process.argv[3]) : null;

const raw = readFileSync(inputPath, 'utf-8');
const lines = raw.split('\n');

// Parse the header to find epoch columns
let headerLine = '';
for (const line of lines) {
  if (line.startsWith('g/h') || line.startsWith('c/s')) {
    headerLine = line;
  }
}

const dataLines = lines.filter(
  (l) => l.trim() && !l.startsWith('#') && !l.startsWith('c/s') && !l.startsWith('g/h')
);

// Determine number of data columns and epoch labels from header
const firstData = dataLines[0].trim().split(/\s+/);
const numDataCols = firstData.length - 3; // subtract type, n, m

const headerParts = headerLine.trim().split(/\s+/);
// headerParts: [g/h, n, m, epoch1, epoch2, ..., epochN, SV_label]
const epochLabels = headerParts.slice(3);

// Map epoch labels to their 0-based column index (from first data column).
// SV range labels like "2025-30" are stored separately as the secular variation.
const epochMap = {};      // epoch number → column index
const epochs = [];        // sorted epoch numbers
let svColIndex = null;    // column index of the SV column

epochLabels.forEach((label, i) => {
  if (label.includes('-') && !label.startsWith('-')) {
    // "2025-30" style SV label — secular variation column
    svColIndex = i;
    return;
  }
  const num = parseFloat(label);
  if (!isNaN(num)) {
    epochMap[num] = i;
    epochs.push(num);
  }
});

// If SV col was not found via label, assume it's the last column
if (svColIndex === null) svColIndex = numDataCols - 1;

console.log(`Available epochs: ${epochs.join(', ')}`);
console.log(`SV column index: ${svColIndex}`);

// Determine nmax from data
const allN = dataLines.map((l) => parseInt(l.trim().split(/\s+/)[1]));
const nmax = Math.max(...allN);

// Parse all epochs at once
// epochGArrays[epochIdx][n][m] and epochHArrays[epochIdx][n][m]
const epochGArrays = epochs.map(() => {
  const arr = [];
  for (let n = 0; n <= nmax; n++) arr.push(new Array(n + 1).fill(0));
  return arr;
});
const epochHArrays = epochs.map(() => {
  const arr = [];
  for (let n = 0; n <= nmax; n++) arr.push(new Array(n + 1).fill(0));
  return arr;
});

// SV arrays for the last epoch
const sv_g = [];
const sv_h = [];
for (let n = 0; n <= nmax; n++) {
  sv_g.push(new Array(n + 1).fill(0));
  sv_h.push(new Array(n + 1).fill(0));
}

for (const line of dataLines) {
  const parts = line.trim().split(/\s+/);
  const type = parts[0];
  const n = parseInt(parts[1]);
  const m = parseInt(parts[2]);

  for (let ei = 0; ei < epochs.length; ei++) {
    const val = parseFloat(parts[3 + epochMap[epochs[ei]]]);
    if (type === 'g') epochGArrays[ei][n][m] = isNaN(val) ? 0 : val;
    else              epochHArrays[ei][n][m] = isNaN(val) ? 0 : val;
  }

  // SV
  if (svColIndex !== null) {
    const sv = parseFloat(parts[3 + svColIndex]);
    if (type === 'g') sv_g[n][m] = isNaN(sv) ? 0 : sv;
    else              sv_h[n][m] = isNaN(sv) ? 0 : sv;
  }
}

// ─── Mode: single epoch (legacy) ─────────────────────────────────────────────

if (requestedEpoch !== null) {
  if (!(requestedEpoch in epochMap)) {
    console.error(`Epoch ${requestedEpoch} not found. Available: ${epochs.join(', ')}`);
    process.exit(1);
  }
  const ei = epochs.indexOf(requestedEpoch);
  const result = {
    epoch: requestedEpoch,
    nmax,
    referenceRadius: 6371.2,
    g: epochGArrays[ei],
    h: epochHArrays[ei],
    sv_g,
    sv_h,
  };
  const outPath = 'public/data/igrf14coeffs.json';
  writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`\nWrote ${outPath} (single epoch ${requestedEpoch})`);
  console.log(`  nmax = ${nmax}`);
  console.log(`  g[1][0] = ${result.g[1][0]}`);
  process.exit(0);
}

// ─── Mode: all epochs → igrf/igrf14-all.json ─────────────────────────────────

const svEpoch = epochs[epochs.length - 1]; // SV applies beyond the last epoch

const allEpochsResult = {
  nmax,
  referenceRadius: 6371.2,
  svEpoch,
  sv_g,
  sv_h,
  epochs,
  // g[epochIndex][n][m], h[epochIndex][n][m]
  g: epochGArrays,
  h: epochHArrays,
};

mkdirSync('public/data/igrf', { recursive: true });
const allOutPath = 'public/data/igrf/igrf14-all.json';
writeFileSync(allOutPath, JSON.stringify(allEpochsResult));
const sizeKb = (JSON.stringify(allEpochsResult).length / 1024).toFixed(0);

console.log(`\nWrote ${allOutPath}`);
console.log(`  ${epochs.length} epochs, nmax = ${nmax}, size ≈ ${sizeKb} KB`);
console.log(`  Epochs: ${epochs[0]} – ${epochs[epochs.length - 1]}`);
console.log(`  SV epoch: ${svEpoch} (used for extrapolation beyond ${svEpoch})`);
console.log(`  g[1][0] @ 2025 = ${epochGArrays[epochs.length - 1][1][0]} (expected ~-29350)`);
