import { describe, it, expect } from 'vitest';
import { t01 } from '../src/physics/t01.js';

/**
 * T01 unit tests.
 *
 * Physical properties verified:
 * - North-south antisymmetry (z → -z flips Bx and By, preserves Bz) at ps=0
 * - Dipole tilt (ps ≠ 0) breaks N-S symmetry
 * - Dst scaling: more negative Dst → stronger ring current depression
 * - G1/G2 scaling: larger G1/G2 → different tail amplitude
 * - IMF By twist: By ≠ 0 introduces By_out asymmetry
 * - NaN safety at origin and poles
 * - Magnitude is physically plausible (10–500 nT) at 3–10 Re
 *
 * All positions in Earth radii (GSM: x=sunward, y=duskward, z=northward).
 * parmod = [pdyn(nPa), dst(nT), byimf(nT), bzimf(nT), g1, g2, 0,0,0,0]
 */

const QUIET  = [2,   0, 0,  0, 0, 0, 0, 0, 0, 0];
const STORM  = [4, -80, 0, -8, 2, 1, 0, 0, 0, 0];
const SEVERE = [8,-150, 0,-15, 5, 3, 0, 0, 0, 0];

// Convenience: return magnitude
function mag(bxyz) { return Math.sqrt(bxyz[0]**2 + bxyz[1]**2 + bxyz[2]**2); }

// ── N-S antisymmetry (ps=0, By_IMF=0) ─────────────────────────────────────
describe('t01 - north-south antisymmetry (ps=0)', () => {
  // With ps=0, By_IMF=0: B(x, y, -z) = (-Bx, -By, Bz)
  const pts = [[-10, 0, 3], [6, 2, 4], [-5, 1, 2]];

  it('Bx is antisymmetric across equatorial plane', () => {
    const [bxN] = t01(QUIET, 0, -10, 0,  3);
    const [bxS] = t01(QUIET, 0, -10, 0, -3);
    expect(bxN).toBeCloseTo(-bxS, 2);
  });

  it('By is antisymmetric across equatorial plane', () => {
    const [, byN] = t01(QUIET, 0, -10, 1,  3);
    const [, byS] = t01(QUIET, 0, -10, 1, -3);
    expect(byN).toBeCloseTo(-byS, 2);
  });

  it('Bz is symmetric across equatorial plane', () => {
    const [,, bzN] = t01(QUIET, 0, -10, 0,  3);
    const [,, bzS] = t01(QUIET, 0, -10, 0, -3);
    expect(bzN).toBeCloseTo(bzS, 2);
  });

  it('antisymmetry holds at off-axis position', () => {
    const [bxN, byN, bzN] = t01(QUIET, 0, -8, 2, 3);
    const [bxS, byS, bzS] = t01(QUIET, 0, -8, 2, -3);
    expect(bxN).toBeCloseTo(-bxS, 2);
    expect(byN).toBeCloseTo(-byS, 2);
    expect(bzN).toBeCloseTo(bzS, 2);
  });
});

// ── Dipole tilt effect ─────────────────────────────────────────────────────
describe('t01 - dipole tilt effect', () => {
  it('non-zero tilt changes field values', () => {
    const [bxTilt0]   = t01(QUIET, 0,   -6, 0, 2);
    const [bxTiltPos] = t01(QUIET, 0.3, -6, 0, 2);
    expect(bxTilt0).not.toBeCloseTo(bxTiltPos, 0);
  });

  it('positive and negative tilts give different results', () => {
    const [bxPos] = t01(QUIET,  0.3, -6, 1, 2);
    const [bxNeg] = t01(QUIET, -0.3, -6, 1, 2);
    expect(bxPos).not.toBeCloseTo(bxNeg, 1);
  });
});

// ── Dst (ring current) scaling ─────────────────────────────────────────────
describe('t01 - Dst/storm scaling', () => {
  it('more negative Dst produces a stronger ring current field', () => {
    // At inner magnetosphere (4 Re equatorial), ring current dominates
    const bQuiet  = mag(t01(QUIET,  0, 0, 4, 0));
    const bStorm  = mag(t01(STORM,  0, 0, 4, 0));
    const bSevere = mag(t01(SEVERE, 0, 0, 4, 0));
    expect(bStorm).toBeGreaterThan(bQuiet);
    expect(bSevere).toBeGreaterThan(bStorm);
  });

  it('stronger storm produces stronger tail field', () => {
    const bQuiet  = mag(t01(QUIET,  0, -10, 0, 2));
    const bSevere = mag(t01(SEVERE, 0, -10, 0, 2));
    expect(bSevere).toBeGreaterThan(bQuiet);
  });
});

// ── G1/G2 scaling ─────────────────────────────────────────────────────────
describe('t01 - G1/G2 storm index scaling', () => {
  it('G2 affects tail amplitude (dxshift1)', () => {
    // At (-6, 0, 1) the tail current sheet shift from G2 is clearly visible
    const lowG2  = t01([2, -50, 0, -5, 1, 0,   0, 0, 0, 0], 0, -6, 0, 1);
    const highG2 = t01([2, -50, 0, -5, 1, 3.0, 0, 0, 0, 0], 0, -6, 0, 1);
    expect(mag(lowG2)).not.toBeCloseTo(mag(highG2), 0);
  });

  it('G2 affects Birkeland scaling', () => {
    const lowG2  = t01([2, -50, 0, -5, 0, 0,   0, 0, 0, 0], 0, 3, 2, 4);
    const highG2 = t01([2, -50, 0, -5, 0, 3.0, 0, 0, 0, 0], 0, 3, 2, 4);
    expect(mag(lowG2)).not.toBeCloseTo(mag(highG2), 0);
  });
});

// ── IMF By effect ──────────────────────────────────────────────────────────
describe('t01 - IMF By dawn-dusk asymmetry', () => {
  it('positive and negative By give different By_out in the equatorial plane', () => {
    const [, byPos] = t01([2, -30, +10, -5, 1, 0.5, 0, 0, 0, 0], 0, -6, 0, 0);
    const [, byNeg] = t01([2, -30, -10, -5, 1, 0.5, 0, 0, 0, 0], 0, -6, 0, 0);
    // By_IMF penetrates directly, so field should differ and roughly flip By
    expect(byPos).not.toBeCloseTo(byNeg, 0);
    expect(Math.sign(byPos)).not.toBe(Math.sign(byNeg));
  });

  it('By=0 gives By=0 at equatorial noon with ps=0', () => {
    // At (6, 0, 0) with ps=0 and By_IMF=0, field should have no dawn-dusk component
    const [, by] = t01([2, 0, 0, 0, 0, 0, 0, 0, 0, 0], 0, 6, 0, 0);
    expect(Math.abs(by)).toBeLessThan(1e-6);
  });
});

// ── Numerical safety ───────────────────────────────────────────────────────
describe('t01 - numerical safety', () => {
  it('no NaN at 0.5 Re (inside Earth, above origin)', () => {
    // Origin itself is singular (r=0 → divide by zero in ring current potential)
    // The tracer never reaches r=0; 0.5 Re is the practical lower bound
    const [bx, by, bz] = t01(QUIET, 0, 0.5, 0, 0);
    expect(Number.isFinite(bx)).toBe(true);
    expect(Number.isFinite(by)).toBe(true);
    expect(Number.isFinite(bz)).toBe(true);
  });

  it('no NaN in the tail at 15 Re', () => {
    const [bx, by, bz] = t01(STORM, 0, -15, 0, 1);
    expect(Number.isFinite(bx)).toBe(true);
    expect(Number.isFinite(by)).toBe(true);
    expect(Number.isFinite(bz)).toBe(true);
  });

  it('no NaN at Earth surface (1 Re)', () => {
    for (const [x, y, z] of [[1,0,0],[0,0,1],[-1,0,0],[0,0,-1]]) {
      const [bx, by, bz] = t01(QUIET, 0, x, y, z);
      expect(Number.isFinite(bx)).toBe(true);
      expect(Number.isFinite(by)).toBe(true);
      expect(Number.isFinite(bz)).toBe(true);
    }
  });

  it('no NaN on the z-axis (polar singularity)', () => {
    for (const z of [2, 4, 6, -4]) {
      const [bx, by, bz] = t01(QUIET, 0, 0, 0, z);
      expect(Number.isFinite(bx)).toBe(true);
      expect(Number.isFinite(by)).toBe(true);
      expect(Number.isFinite(bz)).toBe(true);
    }
  });

  it('finite output for storm conditions across multiple locations', () => {
    const pts = [[-8,0,2],[3,0,0],[0,4,0],[-5,3,-2],[6,0,0]];
    for (const [x, y, z] of pts) {
      const [bx, by, bz] = t01(STORM, -0.3, x, y, z);
      expect(Number.isFinite(bx)).toBe(true, `bx NaN at (${x},${y},${z})`);
      expect(Number.isFinite(by)).toBe(true, `by NaN at (${x},${y},${z})`);
      expect(Number.isFinite(bz)).toBe(true, `bz NaN at (${x},${y},${z})`);
    }
  });
});

// ── Magnitude plausibility ─────────────────────────────────────────────────
describe('t01 - field magnitude plausibility', () => {
  it('field at 4 Re (inner magnetosphere) is 10–500 nT', () => {
    const [bx, by, bz] = t01(STORM, 0, 0, 4, 0);
    const m = mag([bx, by, bz]);
    expect(m).toBeGreaterThan(10);
    expect(m).toBeLessThan(500);
  });

  it('field at 8 Re (outer magnetosphere) is 1–200 nT', () => {
    const [bx, by, bz] = t01(STORM, 0, -8, 0, 1);
    const m = mag([bx, by, bz]);
    expect(m).toBeGreaterThan(1);
    expect(m).toBeLessThan(200);
  });

  it('dayside equatorial field is northward (Bz > 0) for quiet conditions', () => {
    // Chapman-Ferraro currents on the dayside produce northward enhancement
    const [, , bz] = t01(QUIET, 0, 8, 0, 0);
    expect(bz).toBeGreaterThan(0);
  });

  it('nightside tail lobe (z>0) has sunward Bx', () => {
    const [bx] = t01(QUIET, 0, -10, 0, 3);
    expect(bx).toBeGreaterThan(0);
  });

  it('nightside tail lobe (z<0) has anti-sunward Bx', () => {
    const [bx] = t01(QUIET, 0, -10, 0, -3);
    expect(bx).toBeLessThan(0);
  });
});
