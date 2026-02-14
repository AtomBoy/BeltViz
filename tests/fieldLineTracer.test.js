import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import {
  traceFieldLine,
  generateSeedPoints,
} from '../src/physics/fieldLineTracer.js';
import { cartesianToSpherical } from '../src/physics/coordinates.js';

const EARTH_R = 6371.2;
let coeffs;

beforeAll(() => {
  coeffs = JSON.parse(readFileSync('public/data/igrf14coeffs.json', 'utf-8'));
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
