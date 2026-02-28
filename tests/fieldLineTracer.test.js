import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import {
  traceFieldLine,
  generateSeedPoints,
} from '../src/physics/fieldLineTracer.js';
import { cartesianToSpherical } from '../src/physics/coordinates.js';

// Solar wind preset helpers (mirrors CLAUDE.md presets)
const SW_QUIET    = { enabled: true, vSw: 400, nSw:  5, imfBz:   0, dst:    0, sunLonRad: 0 };
const SW_MODERATE = { enabled: true, vSw: 500, nSw: 10, imfBz:  -5, dst:  -50, sunLonRad: 0 };
const SW_SEVERE   = { enabled: true, vSw: 700, nSw: 20, imfBz: -15, dst: -150, sunLonRad: 0 };

const EARTH_R = 6371.2;
let coeffs;

beforeAll(() => {
  const allData = JSON.parse(readFileSync('public/data/igrf/igrf14-all.json', 'utf-8'));
  const ei = allData.epochs.length - 1; // latest epoch (2025)
  coeffs = { nmax: allData.nmax, referenceRadius: allData.referenceRadius,
             g: allData.g[ei], h: allData.h[ei] };
});

describe('generateSeedPoints', () => {
  it('generates correct number of seed points', () => {
    const seeds = generateSeedPoints({ latitudes: [30, 60], nLongitudes: 4 });
    expect(seeds.length).toBe(8); // 2 latitudes * 4 longitudes
  });

  it('all seed points are on Earth surface', () => {
    const seeds = generateSeedPoints();
    for (const seed of seeds) {
      const r = Math.sqrt(seed.x ** 2 + seed.y ** 2 + seed.z ** 2);
      expect(Math.abs(r - EARTH_R)).toBeLessThan(1); // within 1 km
    }
  });

  it('seed points have correct latitude metadata', () => {
    const seeds = generateSeedPoints({ latitudes: [45], nLongitudes: 1 });
    expect(seeds[0].lat).toBe(45);
    expect(seeds[0].lon).toBe(0);
  });
});

describe('traceFieldLine - dipole', () => {
  it('traces a closed field line that returns to Earth surface', () => {
    // Seed at 45 deg N latitude, lon=0
    const theta = (90 - 45) * (Math.PI / 180);
    const phi = 0;
    const sinT = Math.sin(theta);
    const cosT = Math.cos(theta);
    const x = EARTH_R * sinT * Math.cos(phi);
    const y = EARTH_R * cosT;
    const z = EARTH_R * sinT * Math.sin(phi);

    const points = traceFieldLine(x, y, z, coeffs, {
      maxDegree: 1,
      stepSize: 150,
    });

    // Should have many points (line arcs through space)
    expect(points.length).toBeGreaterThan(20);

    // First and last points should be near Earth's surface
    const rFirst = Math.sqrt(
      points[0][0] ** 2 + points[0][1] ** 2 + points[0][2] ** 2
    );
    const rLast = Math.sqrt(
      points[points.length - 1][0] ** 2 +
        points[points.length - 1][1] ** 2 +
        points[points.length - 1][2] ** 2
    );
    expect(rFirst).toBeLessThan(EARTH_R * 1.05);
    expect(rLast).toBeLessThan(EARTH_R * 1.05);
  });

  it('field line reaches maximum altitude at equatorial region', () => {
    // Seed at 60 deg N latitude
    const theta = (90 - 60) * (Math.PI / 180);
    const x = EARTH_R * Math.sin(theta);
    const y = EARTH_R * Math.cos(theta);
    const z = 0;

    const points = traceFieldLine(x, y, z, coeffs, {
      maxDegree: 1,
      stepSize: 100,
    });

    // Find maximum radius along the line
    let maxR = 0;
    for (const [px, py, pz] of points) {
      const r = Math.sqrt(px * px + py * py + pz * pz);
      if (r > maxR) maxR = r;
    }

    // For 60 deg latitude, L-shell ~ 1/cos^2(60) = 4, so max r ~ 4 * Re
    const L = maxR / EARTH_R;
    expect(L).toBeGreaterThan(2); // should extend well above surface
    expect(L).toBeLessThan(8); // but not escape to infinity
  });

  it('higher latitude seed produces field line extending further', () => {
    // Compare 30 deg vs 60 deg latitude
    const seeds = [30, 60].map((lat) => {
      const theta = (90 - lat) * (Math.PI / 180);
      return {
        x: EARTH_R * Math.sin(theta),
        y: EARTH_R * Math.cos(theta),
        z: 0,
      };
    });

    const maxRadii = seeds.map((seed) => {
      const points = traceFieldLine(seed.x, seed.y, seed.z, coeffs, {
        maxDegree: 1,
        stepSize: 100,
      });
      return Math.max(...points.map(([x, y, z]) => Math.sqrt(x * x + y * y + z * z)));
    });

    // 60 deg field line should go higher than 30 deg
    expect(maxRadii[1]).toBeGreaterThan(maxRadii[0]);
  });

  it('field line points are continuous (no large jumps)', () => {
    const theta = (90 - 45) * (Math.PI / 180);
    const x = EARTH_R * Math.sin(theta);
    const y = EARTH_R * Math.cos(theta);
    const z = 0;

    const points = traceFieldLine(x, y, z, coeffs, {
      maxDegree: 1,
      stepSize: 100,
    });

    for (let i = 1; i < points.length; i++) {
      const dx = points[i][0] - points[i - 1][0];
      const dy = points[i][1] - points[i - 1][1];
      const dz = points[i][2] - points[i - 1][2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      // Each step should be roughly the step size (100 km), not wildly different
      expect(dist).toBeLessThan(200); // no teleportation
    }
  });
});

// ---------------------------------------------------------------------------
// Solar wind field line tests — verify tracer handles all preset conditions
// ---------------------------------------------------------------------------

/**
 * Helpers
 */
function seedAtLatLon(latDeg, lonDeg) {
  const theta = (90 - latDeg) * (Math.PI / 180);
  const phi = lonDeg * (Math.PI / 180);
  return {
    x: EARTH_R * Math.sin(theta) * Math.cos(phi),
    y: EARTH_R * Math.cos(theta),
    z: EARTH_R * Math.sin(theta) * Math.sin(phi),
  };
}

function maxRadius(points) {
  let m = 0;
  for (const [x, y, z] of points) {
    const r = Math.sqrt(x * x + y * y + z * z);
    if (r > m) m = r;
  }
  return m;
}

/**
 * Return the maximum cosine-distance between consecutive step directions.
 * A value near -1 means a near-180° reversal (totally wrong).
 * A value of 0 means a 90° turn (suspicious for a smooth field).
 * We flag anything below -0.1 (>~96°) as a "backward step".
 */
function minConsecutiveDot(points) {
  let minDot = 1;
  for (let i = 1; i < points.length - 1; i++) {
    const d1x = points[i][0] - points[i - 1][0];
    const d1y = points[i][1] - points[i - 1][1];
    const d1z = points[i][2] - points[i - 1][2];
    const d2x = points[i + 1][0] - points[i][0];
    const d2y = points[i + 1][1] - points[i][1];
    const d2z = points[i + 1][2] - points[i][2];
    const m1 = Math.sqrt(d1x * d1x + d1y * d1y + d1z * d1z);
    const m2 = Math.sqrt(d2x * d2x + d2y * d2y + d2z * d2z);
    if (m1 < 1 || m2 < 1) continue; // skip degenerate near-surface steps
    const dot = (d1x * d2x + d1y * d2y + d1z * d2z) / (m1 * m2);
    if (dot < minDot) minDot = dot;
  }
  return minDot;
}

describe('traceFieldLine - solar wind continuity', () => {
  // Step size bound: adaptive max is 4× base (100 km), so max step is 400 km
  const MAX_STEP_KM = 420; // small margin for floating point

  it.each([
    ['quiet', SW_QUIET],
    ['moderate storm', SW_MODERATE],
    ['severe storm', SW_SEVERE],
  ])('%s: mid-latitude (55°N) field line has no teleportation steps', (_, sw) => {
    const { x, y, z } = seedAtLatLon(55, 0);
    const points = traceFieldLine(x, y, z, coeffs, { maxDegree: 1, solarWindParams: sw });
    for (let i = 1; i < points.length; i++) {
      const dx = points[i][0] - points[i - 1][0];
      const dy = points[i][1] - points[i - 1][1];
      const dz = points[i][2] - points[i - 1][2];
      expect(Math.sqrt(dx * dx + dy * dy + dz * dz)).toBeLessThan(MAX_STEP_KM);
    }
  });

  it.each([
    ['quiet', SW_QUIET],
    ['moderate storm', SW_MODERATE],
    ['severe storm', SW_SEVERE],
  ])('%s: high-latitude (75°N, nightside) field line has no backward steps', (_, sw) => {
    // Nightside (lon=180°) — most affected by tail stretching
    const { x, y, z } = seedAtLatLon(75, 180);
    const points = traceFieldLine(x, y, z, coeffs, { maxDegree: 1, solarWindParams: sw });
    expect(points.length).toBeGreaterThan(5);
    // No near-reversal in step direction (would indicate the "45-degree straight line" bug)
    const minDot = minConsecutiveDot(points);
    expect(minDot).toBeGreaterThan(-0.5); // no >120° turn between consecutive steps
  });
});

describe('traceFieldLine - solar wind extent', () => {
  it('quiet: 70°N closed field line returns to Earth', () => {
    const { x, y, z } = seedAtLatLon(70, 0);
    const points = traceFieldLine(x, y, z, coeffs, { maxDegree: 1, solarWindParams: SW_QUIET });
    const rEnd = Math.sqrt(
      points[points.length - 1][0] ** 2 +
      points[points.length - 1][1] ** 2 +
      points[points.length - 1][2] ** 2
    );
    // Dipole L≈8.5 at 70° — should still close in quiet conditions
    expect(rEnd).toBeLessThan(EARTH_R * 1.1);
  });

  it('severe storm: 85°N nightside polar cap field line opens into tail (>12 Re)', () => {
    // Polar cap lines in severe storm should be open — extending well into the tail.
    // With the physically-correct tail onset at -7 Re, lines extend ~13-14 Re in
    // severe conditions. 12 Re is the threshold for "clearly open/tail-connected".
    const { x, y, z } = seedAtLatLon(85, 180);
    const points = traceFieldLine(x, y, z, coeffs, {
      maxDegree: 1,
      solarWindParams: SW_SEVERE,
    });
    const rMax = maxRadius(points);
    expect(rMax).toBeGreaterThan(EARTH_R * 12);
  });

  it('severe storm: 65°N nightside field line extends further than quiet conditions', () => {
    // At 65°N, dipole L≈5.6 Re — quiet field line closes ~6 Re; severe tail stretches it much further.
    // 75°N is in the polar cap, both quiet and severe trace open to rMax — not a useful comparison.
    const seed = seedAtLatLon(65, 180);
    const quietPoints  = traceFieldLine(seed.x, seed.y, seed.z, coeffs, { maxDegree: 1, solarWindParams: SW_QUIET });
    const severePoints = traceFieldLine(seed.x, seed.y, seed.z, coeffs, { maxDegree: 1, solarWindParams: SW_SEVERE });
    // Tail stretching should push the field line further under severe conditions
    expect(maxRadius(severePoints)).toBeGreaterThan(maxRadius(quietPoints));
  });

  it('severe storm: 70°N dayside field line is compressed vs quiet (magnetopause pushes in)', () => {
    // At 70°N, dipole L≈8.5 Re — field line apex reaches close to the magnetopause.
    // Severe storm compresses the subsolar magnetopause to ~7-8 Re, so the field line
    // apex should be shorter than under quiet conditions.
    const seed = seedAtLatLon(70, 0);
    const quietPoints  = traceFieldLine(seed.x, seed.y, seed.z, coeffs, { maxDegree: 1, solarWindParams: SW_QUIET });
    const severePoints = traceFieldLine(seed.x, seed.y, seed.z, coeffs, { maxDegree: 1, solarWindParams: SW_SEVERE });
    expect(maxRadius(quietPoints)).toBeGreaterThan(maxRadius(severePoints));
  });
});
