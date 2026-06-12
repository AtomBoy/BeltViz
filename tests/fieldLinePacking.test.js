import { describe, it, expect } from 'vitest';
import { packTracedLines, unpackTracedLines } from '../src/physics/fieldLinePacking.js';

// Three-line fixture: varied lengths, open/closed flags, metric values
const fixture = [
  {
    points: [
      [6371.2, 0, 0, 56000],
      [12000, 500, -300, 8100.5],
      [20000, 1200, -800, 814.46],
    ],
    lat: 55,
    lon: 0,
    isOpen: false,
  },
  {
    points: [
      [-3000, -5200, 1800, 0.003],
      [-110000, 1700, 23000, 0.68],
    ],
    lat: 85,
    lon: 180,
    isOpen: true,
  },
  {
    points: [
      [100, 200, 300, 0],
      [110, 210, 310, 0.5],
      [120, 220, 320, 1],
      [130, 230, 330, 0.25],
    ],
    lat: 40,
    lon: 90,
    isOpen: false,
  },
];

describe('packTracedLines / unpackTracedLines', () => {
  it('round-trips coordinates and metrics to Float32 precision', () => {
    const lines = unpackTracedLines(packTracedLines(fixture));
    expect(lines.length).toBe(3);
    for (let i = 0; i < fixture.length; i++) {
      const { flat, count } = lines[i].points;
      expect(count).toBe(fixture[i].points.length);
      expect(lines[i].count).toBe(count);
      for (let p = 0; p < count; p++) {
        for (let c = 0; c < 4; c++) {
          expect(flat[p * 4 + c]).toBe(Math.fround(fixture[i].points[p][c]));
        }
      }
    }
  });

  it('preserves lat, lon, isOpen metadata', () => {
    const lines = unpackTracedLines(packTracedLines(fixture));
    for (let i = 0; i < fixture.length; i++) {
      expect(lines[i].lat).toBe(fixture[i].lat);
      expect(lines[i].lon).toBe(fixture[i].lon);
      expect(lines[i].isOpen).toBe(fixture[i].isOpen);
    }
  });

  it('produces monotone offsets sized lineCount + 1', () => {
    const { offsets } = packTracedLines(fixture);
    expect(offsets.length).toBe(fixture.length + 1);
    expect(offsets[0]).toBe(0);
    for (let i = 1; i < offsets.length; i++) {
      expect(offsets[i]).toBeGreaterThan(offsets[i - 1]);
    }
    expect(offsets[offsets.length - 1]).toBe(3 + 2 + 4);
  });

  it('defaults missing metric and isOpen', () => {
    const lines = unpackTracedLines(
      packTracedLines([{ points: [[1, 2, 3], [4, 5, 6]], lat: 10, lon: 20 }])
    );
    expect(lines[0].points.flat[3]).toBe(0); // missing pt[3] → 0
    expect(lines[0].isOpen).toBe(false);
  });

  it('handles empty input', () => {
    const lines = unpackTracedLines(packTracedLines([]));
    expect(lines).toEqual([]);
  });
});
