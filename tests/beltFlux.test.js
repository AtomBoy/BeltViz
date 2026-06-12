import { describe, it, expect } from 'vitest';
import { computeKp, computeBeltFlux } from '../src/physics/beltFlux.js';

// ─── computeKp ────────────────────────────────────────────────────────────────

describe('computeKp', () => {
  it('returns 0 for null solarWindParams', () => {
    expect(computeKp(null)).toBe(0);
  });

  it('returns 0 when solar wind is disabled', () => {
    expect(computeKp({ dst: -150, vSw: 700, nSw: 20, enabled: false })).toBe(0);
  });

  it('returns ~0 for quiet conditions (Dst = 0)', () => {
    const kp = computeKp({ dst: 0, vSw: 400, nSw: 5, enabled: true });
    expect(kp).toBeCloseTo(0, 0);
  });

  it('returns a moderate value for moderate storm (Dst = −50 nT)', () => {
    const kp = computeKp({ dst: -50, vSw: 500, nSw: 10, enabled: true });
    expect(kp).toBeGreaterThan(2);
    expect(kp).toBeLessThan(5);
  });

  it('returns a high value for severe storm (Dst = −150 nT)', () => {
    const kp = computeKp({ dst: -150, vSw: 700, nSw: 20, enabled: true });
    expect(kp).toBeGreaterThan(5);
  });

  it('is always in [0, 9]', () => {
    for (const dst of [0, -30, -100, -200]) {
      const kp = computeKp({ dst, vSw: 400, nSw: 5, enabled: true });
      expect(kp).toBeGreaterThanOrEqual(0);
      expect(kp).toBeLessThanOrEqual(9);
    }
  });

  it('increases monotonically with storm intensity', () => {
    const kpQuiet    = computeKp({ dst:    0, vSw: 400, nSw: 5,  enabled: true });
    const kpModerate = computeKp({ dst:  -80, vSw: 500, nSw: 10, enabled: true });
    const kpSevere   = computeKp({ dst: -150, vSw: 700, nSw: 20, enabled: true });
    expect(kpModerate).toBeGreaterThan(kpQuiet);
    expect(kpSevere).toBeGreaterThan(kpModerate);
  });
});

// ─── computeBeltFlux ──────────────────────────────────────────────────────────

describe('computeBeltFlux', () => {
  it('inner belt flux is ~0.65 regardless of Kp (CRAND is constant)', () => {
    expect(computeBeltFlux(0, 0).innerFlux).toBeCloseTo(0.65, 5);
    expect(computeBeltFlux(6, -150).innerFlux).toBeCloseTo(0.65, 5);
    expect(computeBeltFlux(9, -300).innerFlux).toBeCloseTo(0.65, 5);
  });

  it('outer belt flux increases monotonically with Kp', () => {
    const f0 = computeBeltFlux(0, 0).outerFlux;
    const f3 = computeBeltFlux(3, 0).outerFlux;
    const f6 = computeBeltFlux(6, 0).outerFlux;
    expect(f3).toBeGreaterThan(f0);
    expect(f6).toBeGreaterThan(f3);
  });

  it('outer belt flux is clamped to [0, 1] for all Kp', () => {
    for (const kp of [0, 3, 6, 9]) {
      const { outerFlux } = computeBeltFlux(kp, 0);
      expect(outerFlux).toBeGreaterThanOrEqual(0);
      expect(outerFlux).toBeLessThanOrEqual(1);
    }
  });

  it('outer belt flux is low (~0.1) at quiet conditions (Kp = 0)', () => {
    expect(computeBeltFlux(0, 0).outerFlux).toBeCloseTo(0.1, 2);
  });

  it('slot flux is 0 for Dst > −100 nT (slot normally empty)', () => {
    expect(computeBeltFlux(3, 0).slotFlux).toBe(0);
    expect(computeBeltFlux(5, -80).slotFlux).toBe(0);
    expect(computeBeltFlux(5, -100).slotFlux).toBe(0);
  });

  it('slot flux is positive for extreme storm (Dst < −100 nT)', () => {
    expect(computeBeltFlux(7, -150).slotFlux).toBeGreaterThan(0);
  });

  it('slot flux is capped at 0.6', () => {
    expect(computeBeltFlux(9, -300).slotFlux).toBeLessThanOrEqual(0.6);
    expect(computeBeltFlux(9, -500).slotFlux).toBeLessThanOrEqual(0.6);
  });

  it('slot flux increases with storm severity beyond −100 nT', () => {
    const f150 = computeBeltFlux(8, -150).slotFlux;
    const f200 = computeBeltFlux(8, -200).slotFlux;
    expect(f200).toBeGreaterThan(f150);
  });

  it('all flux values are finite numbers', () => {
    const { innerFlux, outerFlux, slotFlux } = computeBeltFlux(5, -100);
    expect(Number.isFinite(innerFlux)).toBe(true);
    expect(Number.isFinite(outerFlux)).toBe(true);
    expect(Number.isFinite(slotFlux)).toBe(true);
  });

  // ─── storageBeltFlux (third belt) ─────────────────────────────────────────
  // Baker et al. 2013 (Science 340:186), Shprits et al. 2013 (Nat Phys 9:699)
  // Threshold: Dst < −50 nT AND Kp ≥ 2.5

  it('storageBeltFlux is 0 at quiet conditions', () => {
    expect(computeBeltFlux(0, 0).storageBeltFlux).toBe(0);
    expect(computeBeltFlux(3, 0).storageBeltFlux).toBe(0);
  });

  it('storageBeltFlux is 0 when only Dst is below threshold (Kp = 0)', () => {
    // Dst alone is not sufficient — Kp must also be elevated
    expect(computeBeltFlux(0, -80).storageBeltFlux).toBe(0);
    expect(computeBeltFlux(0, -150).storageBeltFlux).toBe(0);
  });

  it('storageBeltFlux is 0 when only Kp is elevated (Dst = 0)', () => {
    // Kp alone is not sufficient — Dst must also be depressed
    expect(computeBeltFlux(6, 0).storageBeltFlux).toBe(0);
  });

  it('storageBeltFlux is positive during a moderate storm (Dst = −80, Kp = 4)', () => {
    // Both thresholds met: Dst < −50 and Kp > 2.5
    expect(computeBeltFlux(4, -80).storageBeltFlux).toBeGreaterThan(0);
  });

  it('storageBeltFlux approaches 1 during a severe storm (Dst = −150, Kp = 7)', () => {
    const sf = computeBeltFlux(7, -150).storageBeltFlux;
    expect(sf).toBeGreaterThan(0.8);
    expect(sf).toBeLessThanOrEqual(1.0);
  });

  it('storageBeltFlux is in [0, 1] for all conditions', () => {
    const cases = [
      [0, 0], [3, -50], [5, -80], [7, -150], [9, -300],
    ];
    for (const [kp, dst] of cases) {
      const sf = computeBeltFlux(kp, dst).storageBeltFlux;
      expect(sf).toBeGreaterThanOrEqual(0);
      expect(sf).toBeLessThanOrEqual(1);
    }
  });

  it('storageBeltFlux increases with storm severity beyond both thresholds', () => {
    const sfModerate = computeBeltFlux(4, -80).storageBeltFlux;
    const sfSevere   = computeBeltFlux(7, -150).storageBeltFlux;
    expect(sfSevere).toBeGreaterThan(sfModerate);
  });

  it('storageBeltFlux is a finite number', () => {
    expect(Number.isFinite(computeBeltFlux(5, -100).storageBeltFlux)).toBe(true);
  });
});
