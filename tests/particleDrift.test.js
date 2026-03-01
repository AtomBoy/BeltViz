import { describe, it, expect } from 'vitest';
import {
  ELECTRON, PROTON,
  driftRate,
  driftShellPosition,
  lossConeAngle,
  injectionRate,
  outerBeltLRange,
  lossLifetime,
  crandInjectionRate,
  innerBeltLRange,
  innerBeltLifetime,
  innerBeltElectronRate,
  innerBeltElectronLRange,
  ringCurrentLRange,
} from '../src/physics/particleDrift.js';

// ─── driftRate ────────────────────────────────────────────────────────────────

describe('driftRate - species sign', () => {
  it('electrons drift eastward (positive rate)', () => {
    expect(driftRate(4, 1, ELECTRON)).toBeGreaterThan(0);
  });

  it('protons drift westward (negative rate)', () => {
    expect(driftRate(4, 1, PROTON)).toBeLessThan(0);
  });

  it('electron and proton rates are opposite sign', () => {
    const re = driftRate(4, 1, ELECTRON);
    const rp = driftRate(4, 1, PROTON);
    expect(re * rp).toBeLessThan(0);
  });
});

describe('driftRate - L scaling', () => {
  it('rate increases with L (larger L = faster azimuthal drift)', () => {
    const rL3 = driftRate(3, 1, ELECTRON);
    const rL6 = driftRate(6, 1, ELECTRON);
    expect(rL6).toBeGreaterThan(rL3);
  });

  it('rate is proportional to L', () => {
    // T ∝ 1/(L·E) so ω ∝ L·E
    const rL4 = driftRate(4, 1, ELECTRON);
    const rL8 = driftRate(8, 1, ELECTRON);
    expect(rL8 / rL4).toBeCloseTo(2, 3);
  });
});

describe('driftRate - energy scaling', () => {
  it('rate increases with energy', () => {
    const rLow  = driftRate(4, 0.5, ELECTRON);
    const rHigh = driftRate(4, 2.0, ELECTRON);
    expect(rHigh).toBeGreaterThan(rLow);
  });

  it('rate is proportional to energy', () => {
    const r1 = driftRate(4, 1, ELECTRON);
    const r2 = driftRate(4, 2, ELECTRON);
    expect(r2 / r1).toBeCloseTo(2, 3);
  });
});

describe('driftRate - edge cases', () => {
  it('returns 0 for L = 0', () => {
    expect(driftRate(0, 1, ELECTRON)).toBe(0);
  });

  it('returns 0 for energyMeV = 0', () => {
    expect(driftRate(4, 0, ELECTRON)).toBe(0);
  });

  it('returns 0 for negative L', () => {
    expect(driftRate(-1, 1, ELECTRON)).toBe(0);
  });
});

// ─── driftShellPosition ───────────────────────────────────────────────────────

describe('driftShellPosition', () => {
  it('equatorial particle (lambdaM = 0) has y = 0', () => {
    const [, y] = driftShellPosition(4, 0.7, 0);
    expect(y).toBeCloseTo(0, 10);
  });

  it('radial distance equals L × cos²(lambdaM)', () => {
    const L = 4, phi = 0.7, lambda = 0.3;
    const [x, y, z] = driftShellPosition(L, phi, lambda);
    const r = Math.sqrt(x * x + y * y + z * z);
    const expected = L * Math.cos(lambda) ** 2;
    expect(r).toBeCloseTo(expected, 5);
  });

  it('phi = 0 places equatorial particle on +X axis', () => {
    const [x, y, z] = driftShellPosition(4, 0, 0);
    expect(x).toBeCloseTo(4, 5);
    expect(y).toBeCloseTo(0, 10);
    expect(z).toBeCloseTo(0, 10);
  });

  it('phi = π/2 places equatorial particle on −Z axis', () => {
    const [x, y, z] = driftShellPosition(4, Math.PI / 2, 0);
    expect(x).toBeCloseTo(0, 5);
    expect(y).toBeCloseTo(0, 10);
    expect(z).toBeCloseTo(-4, 5);
  });

  it('positive lambdaM gives positive y', () => {
    const [, y] = driftShellPosition(4, 0, 0.4);
    expect(y).toBeGreaterThan(0);
  });

  it('negative lambdaM gives negative y (southern hemisphere)', () => {
    const [, y] = driftShellPosition(4, 0, -0.4);
    expect(y).toBeLessThan(0);
  });
});

// ─── lossConeAngle ────────────────────────────────────────────────────────────

describe('lossConeAngle', () => {
  it('result is in (0, π/2)', () => {
    for (const L of [2, 3, 4, 6, 8]) {
      const lc = lossConeAngle(L);
      expect(lc).toBeGreaterThan(0);
      expect(lc).toBeLessThan(Math.PI / 2);
    }
  });

  it('loss cone decreases with L (narrower at higher L)', () => {
    const lc3 = lossConeAngle(3);
    const lc6 = lossConeAngle(6);
    expect(lc3).toBeGreaterThan(lc6);
  });

  it('returns π/2 for L < 1', () => {
    expect(lossConeAngle(0.5)).toBeCloseTo(Math.PI / 2, 5);
  });
});

// ─── injectionRate ────────────────────────────────────────────────────────────

describe('injectionRate', () => {
  it('returns 1.0 for quiet conditions (Dst ≥ −20)', () => {
    expect(injectionRate(0)).toBe(1.0);
    expect(injectionRate(-10)).toBe(1.0);
    expect(injectionRate(-20)).toBe(1.0);
  });

  it('increases monotonically below −20 nT', () => {
    const r1 = injectionRate(-30);
    const r2 = injectionRate(-80);
    const r3 = injectionRate(-160);
    expect(r2).toBeGreaterThan(r1);
    expect(r3).toBeGreaterThan(r2);
  });

  it('reaches at least 20× for Dst = −150 nT', () => {
    expect(injectionRate(-150)).toBeGreaterThanOrEqual(20);
  });

  it('reaches at least 50× for very severe storm (Dst = −250 nT)', () => {
    expect(injectionRate(-250)).toBeGreaterThanOrEqual(50);
  });
});

// ─── outerBeltLRange ──────────────────────────────────────────────────────────

describe('outerBeltLRange', () => {
  it('lMin < lMax for all Dst values', () => {
    for (const dst of [0, -30, -80, -160]) {
      const { lMin, lMax } = outerBeltLRange(dst);
      expect(lMin).toBeLessThan(lMax);
    }
  });

  it('injection L shifts inward during storms', () => {
    const quiet = outerBeltLRange(0);
    const storm = outerBeltLRange(-150);
    expect(storm.lMax).toBeLessThanOrEqual(quiet.lMax);
    expect(storm.lMin).toBeLessThanOrEqual(quiet.lMin);
  });
});

// ─── crandInjectionRate ───────────────────────────────────────────────────────

describe('crandInjectionRate', () => {
  it('returns a positive constant', () => {
    expect(crandInjectionRate()).toBeGreaterThan(0);
  });

  it('returns the same value on every call (pure constant)', () => {
    expect(crandInjectionRate()).toBe(crandInjectionRate());
  });
});

// ─── innerBeltLRange ──────────────────────────────────────────────────────────

describe('innerBeltLRange', () => {
  it('returns lMin = 1.2 and lMax = 2.0 (constant)', () => {
    const { lMin, lMax } = innerBeltLRange();
    expect(lMin).toBeCloseTo(1.2, 5);
    expect(lMax).toBeCloseTo(2.0, 5);
  });

  it('lMin < lMax', () => {
    const { lMin, lMax } = innerBeltLRange();
    expect(lMin).toBeLessThan(lMax);
  });
});

// ─── innerBeltLifetime ────────────────────────────────────────────────────────

describe('innerBeltLifetime', () => {
  it('returns a longer lifetime at lower L (deeper trapping)', () => {
    expect(innerBeltLifetime(1.2)).toBeGreaterThan(innerBeltLifetime(2.0));
  });

  it('is always positive across the inner belt range', () => {
    for (const L of [1.2, 1.4, 1.6, 1.8, 2.0]) {
      expect(innerBeltLifetime(L)).toBeGreaterThan(0);
    }
  });

  it('is substantially longer than outer belt electron lifetimes (25–45 s)', () => {
    // Inner belt protons are long-lived CRAND particles; contrast is key visually.
    expect(innerBeltLifetime(1.5)).toBeGreaterThan(200);
  });
});

// ─── lossLifetime ─────────────────────────────────────────────────────────────

describe('lossLifetime', () => {
  it('inner belt (L < 2) has longer lifetime than outer belt', () => {
    expect(lossLifetime(1.5)).toBeGreaterThan(lossLifetime(5));
  });

  it('returns a positive number for all L values', () => {
    for (const L of [1.2, 2, 3, 4, 5, 6]) {
      expect(lossLifetime(L)).toBeGreaterThan(0);
    }
  });
});

// ─── innerBeltElectronRate ────────────────────────────────────────────────────

describe('innerBeltElectronRate', () => {
  it('returns a positive constant', () => {
    expect(innerBeltElectronRate()).toBeGreaterThan(0);
  });

  it('returns the same value on every call (pure constant)', () => {
    expect(innerBeltElectronRate()).toBe(innerBeltElectronRate());
  });

  it('is less than crandInjectionRate (electron diffusion trickle < CRAND proton rate)', () => {
    expect(innerBeltElectronRate()).toBeLessThan(crandInjectionRate());
  });
});

// ─── innerBeltElectronLRange ──────────────────────────────────────────────────

describe('innerBeltElectronLRange', () => {
  it('returns lMin = 1.5 and lMax = 2.0 (outer portion of inner belt)', () => {
    const { lMin, lMax } = innerBeltElectronLRange();
    expect(lMin).toBeCloseTo(1.5, 5);
    expect(lMax).toBeCloseTo(2.0, 5);
  });

  it('lMin < lMax', () => {
    const { lMin, lMax } = innerBeltElectronLRange();
    expect(lMin).toBeLessThan(lMax);
  });

  it('electron range is nested inside the CRAND proton range (lMin ≥ CRAND lMin)', () => {
    // CRAND protons fill L=1.2–2.0; diffusion electrons only reach L=1.5–2.0
    const { lMin: eLMin } = innerBeltElectronLRange();
    const { lMin: pLMin } = innerBeltLRange();
    expect(eLMin).toBeGreaterThanOrEqual(pLMin);
  });
});

// ─── ringCurrentLRange ────────────────────────────────────────────────────────

describe('ringCurrentLRange', () => {
  it('lMin < lMax for all Dst values', () => {
    for (const dst of [0, -30, -80, -160, -300]) {
      const { lMin, lMax } = ringCurrentLRange(dst);
      expect(lMin).toBeLessThan(lMax);
    }
  });

  it('ring current L shifts inward during storms', () => {
    const quiet  = ringCurrentLRange(0);
    const severe = ringCurrentLRange(-200);
    expect(severe.lMax).toBeLessThanOrEqual(quiet.lMax);
    expect(severe.lMin).toBeLessThanOrEqual(quiet.lMin);
  });

  it('quiet L-range extends to L ≈ 4.5 (ring current reaches mid-outer belt)', () => {
    const { lMax } = ringCurrentLRange(0);
    expect(lMax).toBeGreaterThanOrEqual(4.0);
  });

  it('severe storm compresses ring current to L < 3 (lMax < 3.5 at Dst = −200)', () => {
    const { lMax } = ringCurrentLRange(-200);
    expect(lMax).toBeLessThanOrEqual(3.5);
  });

  it('returns values in physically reasonable range (1 ≤ lMin, lMax ≤ 7)', () => {
    for (const dst of [0, -50, -100, -200]) {
      const { lMin, lMax } = ringCurrentLRange(dst);
      expect(lMin).toBeGreaterThanOrEqual(1);
      expect(lMax).toBeLessThanOrEqual(7);
    }
  });
});
