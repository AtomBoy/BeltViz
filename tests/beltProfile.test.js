import { describe, it, expect } from 'vitest';
import {
  FLUX_LEVELS,
  ATM_R0,
  BELT_PROFILES,
  outerBeltKpExpansion,
  dipoleBRatio,
  resolveBeltProfile,
  beltRadialProfile,
  beltFluxAt,
  isoFluxLambdaMax,
  isoFluxLRange,
  isoFluxContour,
} from '../src/physics/beltProfile.js';

const BELTS = ['innerBelt', 'outerBelt', 'storageBelt'];
const DEG = Math.PI / 180;

describe('dipoleBRatio', () => {
  it('is 1 at the equator and falls monotonically toward the pole', () => {
    expect(dipoleBRatio(0)).toBeCloseTo(1, 12);
    let prev = 1;
    for (let lat = 5; lat <= 85; lat += 5) {
      const h = dipoleBRatio(lat * DEG);
      expect(h).toBeLessThan(prev);
      prev = h;
    }
  });

  it('matches B_eq/B = cos^6 / sqrt(1 + 3 sin^2) at 30 degrees', () => {
    const lam = 30 * DEG;
    const expected = Math.cos(lam) ** 6 / Math.sqrt(1 + 3 * Math.sin(lam) ** 2);
    expect(dipoleBRatio(lam)).toBeCloseTo(expected, 12);
  });
});

describe('resolveBeltProfile - calibration', () => {
  it.each(BELTS)('%s: equatorial profile is 1 at the peak', (name) => {
    const p = resolveBeltProfile(name);
    expect(beltRadialProfile(p, p.lPeak)).toBeCloseTo(1, 12);
  });

  it.each(BELTS)('%s: crosses the core level at the cited core edges', (name) => {
    const p = resolveBeltProfile(name);
    expect(beltRadialProfile(p, p.coreMin)).toBeCloseTo(FLUX_LEVELS.core, 10);
    expect(beltRadialProfile(p, p.coreMax)).toBeCloseTo(FLUX_LEVELS.core, 10);
  });

  it.each(BELTS)('%s: crosses the halo level at the halo edges', (name) => {
    const p = resolveBeltProfile(name);
    expect(beltRadialProfile(p, p.haloMin)).toBeCloseTo(FLUX_LEVELS.halo, 10);
    expect(beltRadialProfile(p, p.haloMax)).toBeCloseTo(FLUX_LEVELS.halo, 10);
  });

  it('keeps the published core ranges', () => {
    expect(BELT_PROFILES.innerBelt).toMatchObject({ coreMin: 1.3, coreMax: 1.9, lPeak: 1.5 });
    expect(BELT_PROFILES.outerBelt).toMatchObject({ coreMin: 3.0, coreMax: 4.8 });
    expect(BELT_PROFILES.storageBelt).toMatchObject({ coreMin: 3.0, coreMax: 3.5 });
  });

  it('the core contour reaches coreLat at the peak L (outer belt, no atmosphere effect)', () => {
    const p = resolveBeltProfile('outerBelt');
    expect(isoFluxLambdaMax(p, p.lPeak, FLUX_LEVELS.core)).toBeCloseTo(22 * DEG, 5);
  });

  it('throws for an unknown belt', () => {
    expect(() => resolveBeltProfile('nope')).toThrow();
  });
});

describe('resolveBeltProfile - storm-time adjustments', () => {
  it('Kp expands only the outer belt outer edge, by at most 0.8 Re', () => {
    expect(outerBeltKpExpansion(0)).toBe(0);
    expect(outerBeltKpExpansion(3)).toBe(0);
    expect(outerBeltKpExpansion(5)).toBeCloseTo(0.4, 12);
    expect(outerBeltKpExpansion(9)).toBeCloseTo(0.8, 12);

    const quiet = resolveBeltProfile('outerBelt');
    const active = resolveBeltProfile('outerBelt', { kp: 7 });
    expect(active.coreMax).toBeCloseTo(quiet.coreMax + 0.8, 12);
    expect(active.coreMin).toBe(quiet.coreMin);
    expect(resolveBeltProfile('innerBelt', { kp: 7 })).toEqual(resolveBeltProfile('innerBelt'));
  });

  it('a full storage ring opens a second slot between it and the outer belt', () => {
    const storage = resolveBeltProfile('storageBelt');
    const outer = resolveBeltProfile('outerBelt', { storageFlux: 1 });
    // Core-level gap (Baker et al. 2013: slot at L ~ 3.5-4)
    expect(outer.coreMin - storage.coreMax).toBeGreaterThan(0.3);
    // Even the faint halos do not touch
    expect(outer.haloMin).toBeGreaterThan(storage.haloMax);
    // and between them the flux of both is below the rendered threshold
    const mid = 0.5 * (storage.haloMax + outer.haloMin);
    expect(beltFluxAt(storage, mid, 0)).toBeLessThan(FLUX_LEVELS.halo);
    expect(beltFluxAt(outer, mid, 0)).toBeLessThan(FLUX_LEVELS.halo);
  });

  it.each([0, 0.25, 0.5, 0.75, 1])('profile stays well-formed at storageFlux=%s', (sf) => {
    const p = resolveBeltProfile('outerBelt', { storageFlux: sf, kp: 6 });
    expect(p.haloMin).toBeLessThan(p.coreMin);
    expect(p.coreMin).toBeLessThan(p.lPeak);
    expect(p.lPeak).toBeLessThan(p.coreMax);
    expect(p.coreMax).toBeLessThan(p.haloMax);
    expect(p.pIn).toBeGreaterThan(1);
    expect(p.pOut).toBeGreaterThan(1);
  });
});

describe('beltFluxAt', () => {
  it.each(BELTS)('%s: flux lies in [0, 1] and peaks at the equatorial peak L', (name) => {
    const p = resolveBeltProfile(name);
    expect(beltFluxAt(p, p.lPeak, 0)).toBeCloseTo(1, 6);
    for (let L = 1.05; L < 8; L += 0.13) {
      for (let lat = -80; lat <= 80; lat += 10) {
        const f = beltFluxAt(p, L, lat * DEG);
        expect(f).toBeGreaterThanOrEqual(0);
        expect(f).toBeLessThanOrEqual(1 + 1e-12);
      }
    }
  });

  it.each(BELTS)('%s: flux falls monotonically with |latitude| along a field line', (name) => {
    const p = resolveBeltProfile(name);
    let prev = beltFluxAt(p, p.lPeak, 0);
    for (let lat = 2; lat <= 88; lat += 2) {
      const f = beltFluxAt(p, p.lPeak, lat * DEG);
      expect(f).toBeLessThanOrEqual(prev + 1e-12);
      prev = f;
    }
  });

  it('is symmetric north/south', () => {
    const p = resolveBeltProfile('outerBelt');
    expect(beltFluxAt(p, 4.2, 15 * DEG)).toBeCloseTo(beltFluxAt(p, 4.2, -15 * DEG), 12);
  });

  it('is zero at and below the atmospheric cutoff radius', () => {
    const p = resolveBeltProfile('innerBelt');
    // L = 1.5 field line at the latitude where r = L cos^2(lat) = ATM_R0
    const lat = Math.acos(Math.sqrt(ATM_R0 / 1.5));
    expect(beltFluxAt(p, 1.5, lat)).toBe(0);
    expect(beltFluxAt(p, 1.5, lat + 0.05)).toBe(0);
    expect(beltFluxAt(p, 0, 0)).toBe(0);
  });

  it('inner and outer belts leave an empty slot at L = 2.4', () => {
    expect(beltFluxAt(resolveBeltProfile('innerBelt'), 2.4, 0)).toBeLessThan(FLUX_LEVELS.halo);
    expect(beltFluxAt(resolveBeltProfile('outerBelt'), 2.4, 0)).toBeLessThan(FLUX_LEVELS.halo);
  });
});

describe('iso-flux contours', () => {
  it.each(BELTS)('%s: isoFluxLRange brackets the peak and nests by level', (name) => {
    const p = resolveBeltProfile(name);
    const halo = isoFluxLRange(p, FLUX_LEVELS.halo);
    const core = isoFluxLRange(p, FLUX_LEVELS.core);
    const peak = isoFluxLRange(p, FLUX_LEVELS.peak);
    expect(halo.lMin).toBeLessThan(core.lMin);
    expect(core.lMin).toBeLessThan(peak.lMin);
    expect(peak.lMin).toBeLessThan(p.lPeak);
    expect(p.lPeak).toBeLessThan(peak.lMax);
    expect(peak.lMax).toBeLessThan(core.lMax);
    expect(core.lMax).toBeLessThan(halo.lMax);
    expect(core.lMin).toBeCloseTo(p.coreMin, 3);
    expect(core.lMax).toBeCloseTo(p.coreMax, 3);
  });

  it.each(BELTS)('%s: isoFluxLambdaMax lands on the requested level', (name) => {
    const p = resolveBeltProfile(name);
    for (const level of Object.values(FLUX_LEVELS)) {
      const lam = isoFluxLambdaMax(p, p.lPeak, level);
      expect(lam).toBeGreaterThan(0);
      expect(beltFluxAt(p, p.lPeak, lam)).toBeCloseTo(level, 5);
    }
  });

  it('isoFluxLambdaMax is 0 outside the contour', () => {
    const p = resolveBeltProfile('outerBelt');
    expect(isoFluxLambdaMax(p, 2.0, FLUX_LEVELS.halo)).toBe(0);
    expect(isoFluxLambdaMax(p, 7.5, FLUX_LEVELS.halo)).toBe(0);
  });

  it.each(BELTS)('%s: contour is a closed loop that stays above the surface', (name) => {
    const p = resolveBeltProfile(name);
    for (const level of Object.values(FLUX_LEVELS)) {
      const nL = 40;
      const c = isoFluxContour(p, level, nL);
      expect(c.length).toBe(4 * nL);
      let maxJump = 0;
      const n = c.length / 2;
      for (let i = 0; i < n; i++) {
        const rho = c[2 * i];
        const y = c[2 * i + 1];
        expect(Number.isFinite(rho) && Number.isFinite(y)).toBe(true);
        expect(Math.hypot(rho, y)).toBeGreaterThan(ATM_R0); // never inside the atmosphere
        const j = (i + 1) % n; // wraps: closed loop
        maxJump = Math.max(maxJump, Math.hypot(c[2 * j] - rho, c[2 * j + 1] - y));
      }
      // No gap anywhere around the loop (including the wrap-around segment).
      expect(maxJump).toBeLessThan(0.6);
    }
  });

  it('contour is mirror-symmetric about the equator', () => {
    const p = resolveBeltProfile('outerBelt');
    const nL = 30;
    const c = isoFluxContour(p, FLUX_LEVELS.core, nL);
    // North flank point i (i >= 1) mirrors south flank point nL - i.
    for (let i = 1; i < nL; i++) {
      const j = 2 * nL - i;
      expect(c[2 * j]).toBeCloseTo(c[2 * i], 10);
      expect(c[2 * j + 1]).toBeCloseTo(-c[2 * i + 1], 10);
    }
  });

  it('shells nest: every point of an inner-level contour has flux above the outer level', () => {
    const p = resolveBeltProfile('outerBelt');
    const c = isoFluxContour(p, FLUX_LEVELS.peak, 30);
    for (let i = 0; i < c.length / 2; i++) {
      const rho = c[2 * i];
      const y = c[2 * i + 1];
      const r = Math.hypot(rho, y);
      const lam = Math.asin(y / r);
      const L = r / Math.cos(lam) ** 2;
      expect(beltFluxAt(p, L, lam)).toBeGreaterThan(FLUX_LEVELS.core);
    }
  });
});
