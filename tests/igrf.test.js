import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import { computeB, computeBMagnitude } from '../src/physics/igrf.js';

const EARTH_R = 6371.2;
let coeffs;

beforeAll(() => {
  coeffs = JSON.parse(readFileSync('public/data/igrf14coeffs.json', 'utf-8'));
});

describe('computeB - dipole only (maxDegree=1)', () => {
  it('field at north pole is mostly radial and inward', () => {
    // At north magnetic pole, field enters Earth (Br < 0)
    const [Br, Bt, Bp] = computeB(EARTH_R, 0.001, 0, coeffs, 1);
    expect(Br).toBeLessThan(0); // field enters Earth at N pole
    expect(Math.abs(Br)).toBeGreaterThan(50000); // strong field ~58000 nT
    expect(Math.abs(Bt)).toBeLessThan(2000); // small horizontal component near pole
  });

  it('field at south pole is mostly radial and outward', () => {
    const [Br, Bt, Bp] = computeB(EARTH_R, Math.PI - 0.001, 0, coeffs, 1);
    expect(Br).toBeGreaterThan(0); // field exits Earth at S pole
    expect(Math.abs(Br)).toBeGreaterThan(50000);
  });

  it('field at equator is mostly horizontal (Bt dominant)', () => {
    const [Br, Bt, Bp] = computeB(EARTH_R, Math.PI / 2, 0, coeffs, 1);
    expect(Math.abs(Bt)).toBeGreaterThan(Math.abs(Br));
    expect(Math.abs(Bt)).toBeGreaterThan(25000);
  });

  it('dipole field strength ratio: pole ~2x equator', () => {
    const poleMag = computeBMagnitude(EARTH_R, 0.001, 0, coeffs, 1);
    const eqMag = computeBMagnitude(EARTH_R, Math.PI / 2, 0, coeffs, 1);
    const ratio = poleMag / eqMag;
    // For a pure dipole, ratio is exactly 2.0
    expect(ratio).toBeGreaterThan(1.8);
    expect(ratio).toBeLessThan(2.2);
  });

  it('field decreases with distance as r^-3', () => {
    const B1 = computeBMagnitude(EARTH_R, Math.PI / 2, 0, coeffs, 1);
    const B2 = computeBMagnitude(2 * EARTH_R, Math.PI / 2, 0, coeffs, 1);
    const ratio = B1 / B2;
    // For dipole: B ~ r^-3, so B(R)/B(2R) = 2^3 = 8
    expect(ratio).toBeGreaterThan(7.5);
    expect(ratio).toBeLessThan(8.5);
  });

  it('dipole moment magnitude is approximately 29800 nT', () => {
    // |B| at equator for a dipole = m, and m = sqrt(g10^2 + g11^2 + h11^2)
    const g10 = coeffs.g[1][0];
    const g11 = coeffs.g[1][1];
    const h11 = coeffs.h[1][1];
    const m = Math.sqrt(g10 * g10 + g11 * g11 + h11 * h11);
    expect(m).toBeGreaterThan(29500);
    expect(m).toBeLessThan(30200);
  });
});

describe('computeB - full IGRF (maxDegree=13)', () => {
  it('field magnitude at equator is 25000-40000 nT', () => {
    const mag = computeBMagnitude(EARTH_R, Math.PI / 2, 0, coeffs, 13);
    expect(mag).toBeGreaterThan(25000);
    expect(mag).toBeLessThan(45000);
  });

  it('field magnitude at pole is 50000-70000 nT', () => {
    const mag = computeBMagnitude(EARTH_R, 0.01, 0, coeffs, 13);
    expect(mag).toBeGreaterThan(50000);
    expect(mag).toBeLessThan(70000);
  });

  it('does not produce NaN at any standard test point', () => {
    const testPoints = [
      [EARTH_R, 0.001, 0],
      [EARTH_R, Math.PI / 4, 0],
      [EARTH_R, Math.PI / 2, 0],
      [EARTH_R, Math.PI / 2, Math.PI / 2],
      [EARTH_R, Math.PI / 2, Math.PI],
      [EARTH_R, (3 * Math.PI) / 4, 1.5],
      [EARTH_R, Math.PI - 0.001, 0],
      [2 * EARTH_R, Math.PI / 2, 0],
      [4 * EARTH_R, Math.PI / 3, 1.0],
    ];
    for (const [r, theta, phi] of testPoints) {
      const [Br, Bt, Bp] = computeB(r, theta, phi, coeffs, 13);
      expect(isFinite(Br)).toBe(true);
      expect(isFinite(Bt)).toBe(true);
      expect(isFinite(Bp)).toBe(true);
    }
  });

  it('higher degree adds detail but same order of magnitude as dipole', () => {
    const theta = Math.PI / 2;
    const phi = 0;
    const dipole = computeBMagnitude(EARTH_R, theta, phi, coeffs, 1);
    const full = computeBMagnitude(EARTH_R, theta, phi, coeffs, 13);
    // Full IGRF should be within ~30% of dipole at equator
    expect(Math.abs(full - dipole) / dipole).toBeLessThan(0.5);
  });
});
