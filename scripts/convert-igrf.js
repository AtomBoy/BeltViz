#!/usr/bin/env node
/**
 * Convert IGRF coefficient text file to JSON.
 *
 * Usage:
 *   node scripts/convert-igrf.js [input] [epoch]
 *
 * Arguments:
 *   input  - Path to the IGRF coefficients text file (default: scripts/igrf14coeffs.txt)
 *   epoch  - Desired epoch year, e.g. 2025.0 (default: latest available)
 *
 * Output:
 *   Writes public/data/igrf14coeffs.json
 *
 * Examples:
 *   node scripts/convert-igrf.js                          # latest epoch
 *   node scripts/convert-igrf.js scripts/igrf14coeffs.txt 2020.0
 *   node scripts/convert-igrf.js scripts/igrf14coeffs.txt 2000.0
 */

import { readFileSync, writeFileSync } from 'fs';

const inputPath = process.argv[2] || 'scripts/igrf14coeffs.txt';
const requestedEpoch = process.argv[3] ? parseFloat(process.argv[3]) : null;

const raw = readFileSync(inputPath, 'utf-8');
const lines = raw.split('\n');

// Parse the header to find epoch columns
let epochs = [];
let headerLine = '';
for (const line of lines) {
  if (line.startsWith('g/h') || line.startsWith('c/s')) {
    headerLine = line;
  }
}

// The header line contains epoch years and "SV" label(s)
// Parse all available epochs from the coefficient data
const dataLines = lines.filter(
  (l) => l.trim() && !l.startsWith('#') && !l.startsWith('c/s') && !l.startsWith('g/h')
);

// Determine epochs from the header: columns after "g/h n m" are epoch values
// The header format varies; parse column count from first data line
const firstData = dataLines[0].trim().split(/\s+/);
const numDataCols = firstData.length - 3; // subtract g/h, n, m

// Extract epoch labels from header
const headerParts = headerLine.trim().split(/\s+/);
// headerParts: [g/h, n, m, epoch1, epoch2, ..., epochN, SV_label]
const epochLabels = headerParts.slice(3);

// Map labels to their column indices (0-based from first data column)
// Skip SV (secular variation) labels like "2025-30" which contain a hyphen
const epochMap = {};
epochLabels.forEach((label, i) => {
  if (label.includes('-')) return; // SV range label, not an epoch
  const num = parseFloat(label);
  if (!isNaN(num)) {
    epochMap[num] = i;
    epochs.push(num);
  }
});

// Pick the epoch
let epoch;
if (requestedEpoch !== null) {
  if (!(requestedEpoch in epochMap)) {
    console.error(`Epoch ${requestedEpoch} not found. Available: ${epochs.join(', ')}`);
    process.exit(1);
  }
  epoch = requestedEpoch;
} else {
  epoch = epochs[epochs.length - 1]; // latest
}

const epochCol = epochMap[epoch];
// SV column is the last numeric column (after the last epoch)
const svCol = numDataCols - 1;

console.log(`Converting IGRF coefficients for epoch ${epoch}`);
console.log(`Available epochs: ${epochs.join(', ')}`);

const g = [];
const h = [];
const sv_g = [];
const sv_h = [];

for (const line of dataLines) {
  const parts = line.trim().split(/\s+/);
  const type = parts[0]; // g or h
  const n = parseInt(parts[1]);
  const m = parseInt(parts[2]);
  const val = parseFloat(parts[3 + epochCol]);
  const sv = parseFloat(parts[3 + svCol]);

  // Ensure arrays are large enough
  while (g.length <= n) {
    g.push([]);
    h.push([]);
    sv_g.push([]);
    sv_h.push([]);
  }
  while (g[n].length <= m) {
    g[n].push(0);
    h[n].push(0);
    sv_g[n].push(0);
    sv_h[n].push(0);
  }

  if (type === 'g') {
    g[n][m] = val;
    sv_g[n][m] = isNaN(sv) ? 0 : sv;
  } else {
    h[n][m] = val;
    sv_h[n][m] = isNaN(sv) ? 0 : sv;
  }
}

const nmax = g.length - 1;
const result = { epoch, nmax, referenceRadius: 6371.2, g, h, sv_g, sv_h };

const outPath = 'public/data/igrf14coeffs.json';
writeFileSync(outPath, JSON.stringify(result, null, 2));

console.log(`\nWrote ${outPath}`);
console.log(`  nmax = ${nmax}`);
console.log(`  g[1][0] = ${g[1][0]} (dipole axial, expected ~-29350 for 2025)`);
console.log(`  g[1][1] = ${g[1][1]} (dipole equatorial)`);
console.log(`  h[1][1] = ${h[1][1]} (dipole equatorial)`);
console.log(`  Total coefficients: ${g.flat().length + h.flat().length}`);
