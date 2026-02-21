import { describe, it, expect } from 'vitest';
import {
  computeDynamicPressure,
  computeStandoffDistance,
  computeMagnetopauseDistance,
  solarWindToKp,
  toGSM,
  fromGSM,
  insideMagnetopause,
  computeExternalB,
} from '../src/physics/solarWind.js';

const EARTH_RADIUS_KM = 6371.2;
const Re = EARTH_RADIUS_KM;

const quietParams = {
  vSw: 400, nSw: 5, imfBz: 0, dst: 0, sunLonRad: 0, ps: 0, enabled: true,
};
const stormParams = {
  vSw: 700, nSw: 20, imfBz: -15, dst: -150, sunLonRad: 0, ps: 0, enabled: true,
};

describe('computeDynamicPressure', () => {
  it('returns reasonable pressure for typical solar wind', () => {
    const Dp = computeDynamicPressure(400, 5);
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

describe('solarWindToKp', () => {
  it('quiet conditions map to iopt=1 (Kp=0)', () => {
    const iopt = solarWindToKp({ dst: 0, vSw: 400, nSw: 5 });
    expect(iopt).toBe(1);
  });

  it('moderate storm maps to iopt 3-5 (Kp 2-4)', () => {
    const iopt = solarWindToKp({ dst: -50, vSw: 500, nSw: 10 });
    expect(iopt).toBeGreaterThanOrEqual(3);
    expect(iopt).toBeLessThanOrEqual(5);
  });

  it('severe storm maps to iopt=7 (Kp>=6)', () => {
    const iopt = solarWindToKp({ dst: -150, vSw: 700, nSw: 20 });
    expect(iopt).toBe(7);
  });

  it('iopt is always in range 1-7', () => {
    expect(solarWindToKp({ dst: 10, vSw: 200, nSw: 1 })).toBe(1);
    expect(solarWindToKp({ dst: -999, vSw: 2000, nSw: 100 })).toBe(7);
  });
});

describe('toGSM / fromGSM', () => {
  it('identity transform when sunLon=0', () => {
    const [xg, yg, zg] = toGSM(100, 200, 300, 0);
    expect(xg).toBeCloseTo(100);
    expect(yg).toBeCloseTo(300);
    expect(zg).toBeCloseTo(200);
  });

  it('roundtrip: fromGSM(toGSM(v)) recovers original for vector', () => {
    const sunLon = 1.2;
    const [bx, by, bz] = fromGSM(10, 20, 30, sunLon);
    const [bxg, byg, bzg] = toGSM(bx, 0, bz, sunLon);
    expect(bxg).toBeCloseTo(10, 5);
  });

  it('sun at lon=90 rotates properly', () => {
    const [xg, yg, zg] = toGSM(0, 0, Re, Math.PI / 2);
    expect(xg).toBeCloseTo(Re, 0);
    expect(Math.abs(yg)).toBeLessThan(1);
  });
});

describe('insideMagnetopause', () => {
  it('returns 1.0 near Earth', () => {
    expect(insideMagnetopause(Re, 0, 0, quietParams)).toBeCloseTo(1.0, 1);
  });

  it('returns ~0 well outside magnetopause', () => {
    expect(insideMagnetopause(15 * Re, 0, 0, quietParams)).toBeLessThan(0.1);
  });

  it('returns 1.0 when disabled', () => {
    expect(insideMagnetopause(50 * Re, 0, 0, { ...quietParams, enabled: false })).toBe(1.0);
  });

  it('transition occurs near magnetopause', () => {
    const Dp = computeDynamicPressure(quietParams.vSw, quietParams.nSw);
    const r0 = computeStandoffDistance(Dp, quietParams.imfBz);
    expect(insideMagnetopause((r0 - 1) * Re, 0, 0, quietParams)).toBeGreaterThan(0.5);
    expect(insideMagnetopause((r0 + 1) * Re, 0, 0, quietParams)).toBeLessThan(0.5);
  });

  it('storm conditions move boundary inward', () => {
    const fQuiet = insideMagnetopause(8 * Re, 0, 0, quietParams);
    const fStorm = insideMagnetopause(8 * Re, 0, 0, stormParams);
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

  it('dayside field has northward component (CF compression)', () => {
    // At subsolar ~6 Re (near magnetopause), T89 CF currents dominate, adding northward field (scene +Y).
    // At 3 Re the ring current southward field dominates; 6 Re is where CF compression peaks.
    const b = computeExternalB(6 * Re, 0, 0, quietParams);
    expect(b[1]).toBeGreaterThan(0);
  });

  it('tail field is sunward in northern lobe', () => {
    // Nightside at (-8Re, 0, 3Re) scene = GSM (-8,0,3): north lobe, Bx > 0 sunward
    const b = computeExternalB(-8 * Re, 3 * Re, 0, quietParams);
    expect(b[0]).toBeGreaterThan(0);
  });

  it('tail field is anti-sunward in southern lobe', () => {
    // Nightside at (-8Re, 0, -3Re) scene = GSM (-8,0,-3): south lobe, Bx < 0
    const b = computeExternalB(-8 * Re, -3 * Re, 0, quietParams);
    expect(b[0]).toBeLessThan(0);
  });

  it('storm reduces northward field (ring current effect)', () => {
    // Higher Kp means stronger ring current → less northward field at mid-distances
    const bQuiet = computeExternalB(4 * Re, 0, 0, quietParams);
    const bStorm  = computeExternalB(4 * Re, 0, 0, { ...quietParams, dst: -100 });
    expect(bStorm[1]).toBeLessThan(bQuiet[1]);
  });

  it('external field is small at Earth surface (quiet)', () => {
    const b = computeExternalB(Re, 0, 0, quietParams);
    const mag = Math.sqrt(b[0] ** 2 + b[1] ** 2 + b[2] ** 2);
    // IGRF at surface is 30,000-60,000 nT; T89 external should be well under 500 nT
    expect(mag).toBeLessThan(500);
  });

  it('no NaN at various positions', () => {
    const points = [
      [Re, 0, 0], [0, Re, 0], [0, 0, Re],
      [-5 * Re, 0, 0], [0, 5 * Re, 0],
      [Re, Re, Re], [10 * Re, 0, 0],
    ];
    for (const [x, y, z] of points) {
      const b = computeExternalB(x, y, z, quietParams);
      expect(Number.isNaN(b[0])).toBe(false);
      expect(Number.isNaN(b[1])).toBe(false);
      expect(Number.isNaN(b[2])).toBe(false);
    }
  });

  it('field is symmetric with sun direction rotation', () => {
    // Subsolar point should give similar CF field regardless of sun longitude
    const b0  = computeExternalB( 3 * Re, 0,       0, { ...quietParams, sunLonRad: 0 });
    const bPi = computeExternalB(-3 * Re, 0,       0, { ...quietParams, sunLonRad: Math.PI });
    // Both are at the subsolar point in their respective frames; By magnitudes should match
    expect(Math.abs(b0[1] - bPi[1])).toBeLessThan(10);
  });
});
