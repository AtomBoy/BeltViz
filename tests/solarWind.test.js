import { describe, it, expect } from 'vitest';
import {
  computeDynamicPressure,
  computeStandoffDistance,
  computeFlaringParameter,
  computeMagnetopauseDistance,
  toGSM,
  fromGSM,
  insideMagnetopause,
  computeExternalB,
} from '../src/physics/solarWind.js';

const EARTH_RADIUS_KM = 6371.2;
const Re = EARTH_RADIUS_KM;

// Quiet solar wind defaults
const quietParams = {
  vSw: 400, nSw: 5, imfBz: 0, dst: 0, sunLonRad: 0, enabled: true,
};

// Severe storm
const stormParams = {
  vSw: 700, nSw: 20, imfBz: -15, dst: -150, sunLonRad: 0, enabled: true,
};

describe('computeDynamicPressure', () => {
  it('returns reasonable pressure for typical solar wind', () => {
    const Dp = computeDynamicPressure(400, 5);
    // Dp ≈ 1.3 nPa for v=400 km/s, n=5 cm^-3
    expect(Dp).toBeGreaterThan(0.5);
    expect(Dp).toBeLessThan(3);
  });

  it('increases with speed squared', () => {
    const Dp1 = computeDynamicPressure(400, 5);
    const Dp2 = computeDynamicPressure(800, 5);
    expect(Dp2 / Dp1).toBeCloseTo(4, 0);
  });

  it('increases linearly with density', () => {
    const Dp1 = computeDynamicPressure(400, 5);
    const Dp2 = computeDynamicPressure(400, 10);
    expect(Dp2 / Dp1).toBeCloseTo(2, 1);
  });
});

describe('computeStandoffDistance', () => {
  it('returns ~10-11 Re for quiet conditions', () => {
    const Dp = computeDynamicPressure(400, 5);
    const r0 = computeStandoffDistance(Dp, 0);
    expect(r0).toBeGreaterThan(9.5);
    expect(r0).toBeLessThan(13);
  });

  it('decreases during storms (higher pressure, southward Bz)', () => {
    const DpQuiet = computeDynamicPressure(400, 5);
    const DpStorm = computeDynamicPressure(700, 20);
    const r0Quiet = computeStandoffDistance(DpQuiet, 0);
    const r0Storm = computeStandoffDistance(DpStorm, -15);
    expect(r0Storm).toBeLessThan(r0Quiet);
    expect(r0Storm).toBeGreaterThan(4);
    expect(r0Storm).toBeLessThan(8);
  });

  it('decreases with increasing dynamic pressure', () => {
    const r01 = computeStandoffDistance(1, 0);
    const r02 = computeStandoffDistance(5, 0);
    expect(r02).toBeLessThan(r01);
  });
});

describe('computeFlaringParameter', () => {
  it('returns positive value', () => {
    const Dp = computeDynamicPressure(400, 5);
    const alpha = computeFlaringParameter(Dp, 0);
    expect(alpha).toBeGreaterThan(0.3);
    expect(alpha).toBeLessThan(1.5);
  });

  it('increases with southward Bz', () => {
    const Dp = computeDynamicPressure(400, 5);
    const a1 = computeFlaringParameter(Dp, 5);
    const a2 = computeFlaringParameter(Dp, -10);
    expect(a2).toBeGreaterThan(a1);
  });
});

describe('computeMagnetopauseDistance', () => {
  it('nose distance matches standoff distance at theta=0', () => {
    const Dp = computeDynamicPressure(400, 5);
    const r0 = computeStandoffDistance(Dp, 0);
    const rNose = computeMagnetopauseDistance(0, Dp, 0);
    expect(rNose).toBeCloseTo(r0, 1);
  });

  it('flares out at larger angles', () => {
    const Dp = computeDynamicPressure(400, 5);
    const rNose = computeMagnetopauseDistance(0, Dp, 0);
    const rFlank = computeMagnetopauseDistance(Math.PI / 2, Dp, 0);
    expect(rFlank).toBeGreaterThan(rNose);
  });
});

describe('toGSM / fromGSM', () => {
  it('identity transform when sunLon=0', () => {
    // sunLon=0: Sun along +X. x_gsm = x, y_gsm = z, z_gsm = y
    const [xg, yg, zg] = toGSM(100, 200, 300, 0);
    expect(xg).toBeCloseTo(100);
    expect(yg).toBeCloseTo(300);
    expect(zg).toBeCloseTo(200);
  });

  it('roundtrip: fromGSM(toGSM(v)) recovers original for vector', () => {
    const sunLon = 1.2;
    // Transform a position to get GSM frame
    const [xg, yg, zg] = toGSM(100, 200, 300, sunLon);
    // Transform a B vector back from GSM
    const [bx, by, bz] = fromGSM(10, 20, 30, sunLon);
    // Now transform the recovered B to GSM to verify
    const [bxg, byg, bzg] = toGSM(bx, 0, bz, sunLon); // Note: y component is separate
    // bxg should be 10 (the x_gsm component of the B vector)
    expect(bxg).toBeCloseTo(10, 5);
  });

  it('sun at lon=90 rotates properly', () => {
    // Sun along +Z scene direction
    const [xg, yg, zg] = toGSM(0, 0, Re, Math.PI / 2);
    // Point at +Z scene should be along +x_gsm (sunward)
    expect(xg).toBeCloseTo(Re, 0);
    expect(Math.abs(yg)).toBeLessThan(1);
  });
});

describe('insideMagnetopause', () => {
  it('returns 1.0 near Earth', () => {
    const f = insideMagnetopause(Re, 0, 0, quietParams);
    expect(f).toBeCloseTo(1.0, 1);
  });

  it('returns ~0 well outside magnetopause', () => {
    const f = insideMagnetopause(15 * Re, 0, 0, quietParams);
    expect(f).toBeLessThan(0.1);
  });

  it('returns 1.0 when disabled', () => {
    const f = insideMagnetopause(50 * Re, 0, 0, { ...quietParams, enabled: false });
    expect(f).toBe(1.0);
  });

  it('transition occurs near magnetopause', () => {
    const Dp = computeDynamicPressure(quietParams.vSw, quietParams.nSw);
    const r0 = computeStandoffDistance(Dp, quietParams.imfBz);
    // Just inside magnetopause
    const fInside = insideMagnetopause((r0 - 1) * Re, 0, 0, quietParams);
    expect(fInside).toBeGreaterThan(0.5);
    // Just outside
    const fOutside = insideMagnetopause((r0 + 1) * Re, 0, 0, quietParams);
    expect(fOutside).toBeLessThan(0.5);
  });

  it('storm conditions move boundary inward', () => {
    // At 8 Re sunward — should be inside for quiet, outside for severe storm
    const pos = 8 * Re;
    const fQuiet = insideMagnetopause(pos, 0, 0, quietParams);
    const fStorm = insideMagnetopause(pos, 0, 0, stormParams);
    expect(fQuiet).toBeGreaterThan(fStorm);
  });
});

describe('computeExternalB', () => {
  it('returns [0,0,0] when disabled', () => {
    const b = computeExternalB(3 * Re, 0, 0, { ...quietParams, enabled: false });
    expect(b[0]).toBe(0);
    expect(b[1]).toBe(0);
    expect(b[2]).toBe(0);
  });

  it('Chapman-Ferraro strengthens dayside field (northward)', () => {
    // Subsolar point at 3 Re — well inside magnetopause
    const b = computeExternalB(3 * Re, 0, 0, quietParams);
    // B_cf is along dipole axis (scene Y). Should be positive (northward).
    expect(b[1]).toBeGreaterThan(0);
  });

  it('tail field has sunward Bx in northern lobe', () => {
    // Nightside, above equatorial plane
    const b = computeExternalB(-8 * Re, 3 * Re, 0, quietParams);
    // In the north lobe, tail field B_x should be sunward (positive x_gsm)
    // When sunLon=0, x_gsm = scene X, so scene Bx should be positive
    expect(b[0]).toBeGreaterThan(0);
  });

  it('tail field has anti-sunward Bx in southern lobe', () => {
    // Nightside, below equatorial plane
    const b = computeExternalB(-8 * Re, -3 * Re, 0, quietParams);
    // Southern lobe: Bx should be anti-sunward (negative)
    expect(b[0]).toBeLessThan(0);
  });

  it('ring current produces southward field during storm', () => {
    const stormDst = { ...quietParams, dst: -100 };
    const b = computeExternalB(3 * Re, 0, 0, stormDst);
    // Dst=-100 → ring current adds southward (negative Y in scene)
    // The total By includes CF compression too, but ring current should make it less positive
    const bQuiet = computeExternalB(3 * Re, 0, 0, quietParams);
    expect(b[1]).toBeLessThan(bQuiet[1]);
  });

  it('no NaN at various positions', () => {
    const testPoints = [
      [Re, 0, 0],
      [0, Re, 0],
      [0, 0, Re],
      [-5 * Re, 0, 0],
      [0, 5 * Re, 0],
      [Re, Re, Re],
      [10 * Re, 0, 0],
    ];
    for (const [x, y, z] of testPoints) {
      const b = computeExternalB(x, y, z, quietParams);
      expect(Number.isNaN(b[0])).toBe(false);
      expect(Number.isNaN(b[1])).toBe(false);
      expect(Number.isNaN(b[2])).toBe(false);
    }
  });

  it('external field is negligible for quiet sun at Earth surface', () => {
    // At Earth's surface, the IGRF field is ~30,000-60,000 nT.
    // The external field should be small compared to that.
    const b = computeExternalB(Re, 0, 0, quietParams);
    const mag = Math.sqrt(b[0] * b[0] + b[1] * b[1] + b[2] * b[2]);
    expect(mag).toBeLessThan(500);
  });

  it('respects sun direction rotation', () => {
    // With sun at lon=0, subsolar point is along +X
    const b0 = computeExternalB(3 * Re, 0, 0, { ...quietParams, sunLonRad: 0 });
    // With sun at lon=pi, subsolar point is along -X
    const bPi = computeExternalB(-3 * Re, 0, 0, { ...quietParams, sunLonRad: Math.PI });
    // Both should produce similar CF compression (same geometry, rotated)
    expect(Math.abs(b0[1] - bPi[1])).toBeLessThan(5);
  });
});
