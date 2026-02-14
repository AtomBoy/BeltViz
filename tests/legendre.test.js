import { describe, it, expect } from 'vitest';
import { computeLegendre } from '../src/physics/legendre.js';

const EPSILON = 1e-8;

function expectClose(actual, expected, eps = EPSILON) {
  expect(Math.abs(actual - expected)).toBeLessThan(eps);
}

describe('computeLegendre', () => {
  it('P[0][0] = 1 for any theta', () => {
    for (const theta of [0.1, 0.5, 1.0, Math.PI / 2, 2.5]) {
      const { P } = computeLegendre(0, theta);
      expectClose(P[0][0], 1);
    }
  });

  it('P[1][0] = cos(theta)', () => {
    for (const theta of [0.3, 1.0, Math.PI / 2, 2.0]) {
      const { P } = computeLegendre(1, theta);
      expectClose(P[1][0], Math.cos(theta));
    }
  });

  it('P[1][1] = sin(theta)', () => {
    for (const theta of [0.3, 1.0, Math.PI / 2, 2.0]) {
      const { P } = computeLegendre(1, theta);
      expectClose(P[1][1], Math.sin(theta));
    }
  });

  it('dP[1][0] = -sin(theta)', () => {
    for (const theta of [0.3, 1.0, Math.PI / 2]) {
      const { dP } = computeLegendre(1, theta);
      expectClose(dP[1][0], -Math.sin(theta));
    }
  });

  it('dP[1][1] = cos(theta)', () => {
    for (const theta of [0.3, 1.0, Math.PI / 2]) {
      const { dP } = computeLegendre(1, theta);
      expectClose(dP[1][1], Math.cos(theta));
    }
  });

  it('P[2][0] = (3cos^2(theta) - 1) / 2 for Schmidt semi-normalized', () => {
    // For Schmidt semi-normalized, P_2^0(x) = (3x^2 - 1)/2 (same as regular)
    for (const theta of [0.5, 1.0, Math.PI / 3]) {
      const { P } = computeLegendre(2, theta);
      const x = Math.cos(theta);
      expectClose(P[2][0], (3 * x * x - 1) / 2, 1e-6);
    }
  });

  it('produces arrays of correct dimensions for nmax=13', () => {
    const { P, dP } = computeLegendre(13, 1.0);
    expect(P.length).toBe(14); // 0 through 13
    expect(dP.length).toBe(14);
    for (let n = 0; n <= 13; n++) {
      expect(P[n].length).toBe(n + 1);
      expect(dP[n].length).toBe(n + 1);
    }
  });

  it('does not produce NaN for nmax=13', () => {
    for (const theta of [0.01, 0.5, Math.PI / 2, 2.5, Math.PI - 0.01]) {
      const { P, dP } = computeLegendre(13, theta);
      for (let n = 0; n <= 13; n++) {
        for (let m = 0; m <= n; m++) {
          expect(isNaN(P[n][m])).toBe(false);
          expect(isNaN(dP[n][m])).toBe(false);
          expect(isFinite(P[n][m])).toBe(true);
          expect(isFinite(dP[n][m])).toBe(true);
        }
      }
    }
  });

  it('handles near-pole values without NaN', () => {
    // theta very close to 0 (north pole)
    const { P: P1, dP: dP1 } = computeLegendre(13, 1e-12);
    expect(isNaN(P1[1][0])).toBe(false);
    expect(isFinite(dP1[1][0])).toBe(true);

    // theta very close to pi (south pole)
    const { P: P2, dP: dP2 } = computeLegendre(13, Math.PI - 1e-12);
    expect(isNaN(P2[1][0])).toBe(false);
    expect(isFinite(dP2[1][0])).toBe(true);
  });
});
