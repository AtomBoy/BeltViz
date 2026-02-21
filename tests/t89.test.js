import { describe, it, expect } from 'vitest';
import { t89 } from '../src/physics/t89.js';

/**
 * T89 unit tests.
 *
 * Physical properties verified:
 * - iopt/Kp range clamping
 * - North-south lobe antisymmetry (ps=0 case)
 * - Dayside northward field (CF compression)
 * - Nightside tail lobes (sunward N / antisunward S)
 * - Storm increases tail field amplitude
 * - No NaN at extreme positions
 * - Dipole tilt (ps) affects field values
 *
 * All positions in Earth radii (GSM frame: x=sunward, y=duskward, z=northward).
 */

describe('t89 - input validation', () => {
  it('clamps iopt below 1 to iopt=1', () => {
    const b0 = t89(0, 0, -8, 0, 3);
    const b1 = t89(1, 0, -8, 0, 3);
    expect(b0[0]).toBeCloseTo(b1[0], 6);
  });

  it('clamps iopt above 7 to iopt=7', () => {
    const b8 = t89(8, 0, -8, 0, 3);
    const b7 = t89(7, 0, -8, 0, 3);
    expect(b8[0]).toBeCloseTo(b7[0], 6);
  });
});

describe('t89 - north-south antisymmetry (ps=0)', () => {
  // With zero dipole tilt, the T89 field is antisymmetric in z:
  //   Bx(x, y, -z) = -Bx(x, y, z)
  //   By(x, y, -z) = -By(x, y, z)
  //   Bz(x, y, -z) =  Bz(x, y, z)
  it('Bx is antisymmetric across equatorial plane', () => {
    const [bxN] = t89(1, 0, -10, 0,  3);
    const [bxS] = t89(1, 0, -10, 0, -3);
    expect(bxN).toBeCloseTo(-bxS, 3);
  });

  it('By is antisymmetric across equatorial plane', () => {
    const [, byN] = t89(1, 0, -10, 1,  3);
    const [, byS] = t89(1, 0, -10, 1, -3);
    expect(byN).toBeCloseTo(-byS, 3);
  });

  it('Bz is symmetric across equatorial plane', () => {
    const [,, bzN] = t89(1, 0, -10, 0,  3);
    const [,, bzS] = t89(1, 0, -10, 0, -3);
    expect(bzN).toBeCloseTo(bzS, 3);
  });
});

describe('t89 - tail lobe field direction', () => {
  it('northern tail lobe has sunward Bx (Kp=0)', () => {
    // GSM (-10, 0, 3): nightside, north lobe → Bx should be positive (toward sun)
    const [bx] = t89(1, 0, -10, 0, 3);
    expect(bx).toBeGreaterThan(0);
  });

  it('southern tail lobe has anti-sunward Bx (Kp=0)', () => {
    // GSM (-10, 0, -3): nightside, south lobe → Bx should be negative
    const [bx] = t89(1, 0, -10, 0, -3);
    expect(bx).toBeLessThan(0);
  });

  it('tail field increases from Kp=0 to Kp=6', () => {
    const [bxQuiet] = t89(1, 0, -12, 0, 2);
    const [bxStorm] = t89(7, 0, -12, 0, 2);
    // Severe storm should have stronger lobe field
    expect(Math.abs(bxStorm)).toBeGreaterThan(Math.abs(bxQuiet));
  });
});

describe('t89 - dayside Chapman-Ferraro field', () => {
  it('northward field on the dayside equatorial plane (Kp=0)', () => {
    // GSM (6, 0, 0): well inside magnetopause on dayside, ps=0
    const [bx, by, bz] = t89(1, 0, 6, 0, 0);
    // CF currents produce northward (Bz > 0) enhancement
    expect(bz).toBeGreaterThan(0);
  });

  it('dayside field increases from Kp=0 to Kp=6', () => {
    const [,, bzQuiet] = t89(1, 0, 6, 0, 0);
    const [,, bzStorm] = t89(7, 0, 6, 0, 0);
    expect(Math.abs(bzStorm)).toBeGreaterThan(Math.abs(bzQuiet));
  });
});

describe('t89 - dipole tilt effect', () => {
  it('non-zero tilt changes field values', () => {
    const [bxTilt0]   = t89(1, 0,    3, 0, 0);
    const [bxTiltPos] = t89(1, 0.3,  3, 0, 0);
    // With tilt, the field should differ from zero-tilt
    expect(bxTilt0).not.toBeCloseTo(bxTiltPos, 0);
  });
});

describe('t89 - numerical safety', () => {
  it('no NaN at origin', () => {
    const [bx, by, bz] = t89(1, 0, 0, 0, 0);
    expect(Number.isNaN(bx)).toBe(false);
    expect(Number.isNaN(by)).toBe(false);
    expect(Number.isNaN(bz)).toBe(false);
  });

  it('no NaN in tail at 25 Re', () => {
    const [bx, by, bz] = t89(7, 0, -25, 0, 2);
    expect(Number.isNaN(bx)).toBe(false);
    expect(Number.isNaN(by)).toBe(false);
    expect(Number.isNaN(bz)).toBe(false);
  });

  it('no NaN at Earth surface', () => {
    for (const [x, y, z] of [[1,0,0],[0,0,1],[-1,0,0],[0,0,-1]]) {
      const [bx, by, bz] = t89(1, 0, x, y, z);
      expect(Number.isNaN(bx)).toBe(false);
      expect(Number.isNaN(by)).toBe(false);
      expect(Number.isNaN(bz)).toBe(false);
    }
  });

  it('field magnitude is physically plausible at 5 Re', () => {
    const [bx, by, bz] = t89(4, 0, 0, 0, 5);
    const mag = Math.sqrt(bx**2 + by**2 + bz**2);
    // T89 external field at 5 Re should be 0–300 nT (IGRF there is ~500 nT)
    expect(mag).toBeGreaterThan(0);
    expect(mag).toBeLessThan(300);
  });

  it('all 7 Kp levels return finite values at test point', () => {
    for (let iopt = 1; iopt <= 7; iopt++) {
      const [bx, by, bz] = t89(iopt, 0.2, -8, 1, 3);
      expect(Number.isFinite(bx)).toBe(true);
      expect(Number.isFinite(by)).toBe(true);
      expect(Number.isFinite(bz)).toBe(true);
    }
  });
});
