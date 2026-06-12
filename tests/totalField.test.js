import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import {
  computeTotalB,
  computeTotalBMagnitude,
  computeFieldCartesian,
} from '../src/physics/totalField.js';
import { computeB, computeBMagnitude } from '../src/physics/igrf.js';
import {
  sphericalToCartesian,
  bFieldToCartesian,
  bCartesianToSpherical,
} from '../src/physics/coordinates.js';

const EARTH_RADIUS_KM = 6371.2;
const Re = EARTH_RADIUS_KM;

const allData = JSON.parse(readFileSync('public/data/igrf/igrf14-all.json', 'utf-8'));
const ei = allData.epochs.length - 1; // latest epoch (2025)
const coeffs = { nmax: allData.nmax, referenceRadius: allData.referenceRadius,
                 g: allData.g[ei], h: allData.h[ei] };

const quietParams = {
  vSw: 400, nSw: 5, imfBz: 0, dst: 0, sunLonRad: 0, enabled: true,
};

const stormParams = {
  vSw: 700, nSw: 20, imfBz: -15, dst: -150, sunLonRad: 0, enabled: true,
};

describe('computeTotalB', () => {
  it('matches computeB exactly when solarWindParams is null', () => {
    const theta = Math.PI / 4;
    const phi = 1.0;
    const r = 2 * Re;
    const [Br, Bt, Bp] = computeB(r, theta, phi, coeffs, 8);
    const [BrT, BtT, BpT] = computeTotalB(r, theta, phi, coeffs, 8, null);
    expect(BrT).toBeCloseTo(Br, 5);
    expect(BtT).toBeCloseTo(Bt, 5);
    expect(BpT).toBeCloseTo(Bp, 5);
  });

  it('matches computeB when solarWindParams is disabled', () => {
    const theta = Math.PI / 3;
    const phi = 2.0;
    const r = 1.5 * Re;
    const disabled = { ...quietParams, enabled: false };
    const [Br, Bt, Bp] = computeB(r, theta, phi, coeffs, 5);
    const [BrT, BtT, BpT] = computeTotalB(r, theta, phi, coeffs, 5, disabled);
    expect(BrT).toBeCloseTo(Br, 5);
    expect(BtT).toBeCloseTo(Bt, 5);
    expect(BpT).toBeCloseTo(Bp, 5);
  });

  it('subsolar field is stronger with solar wind than pure IGRF', () => {
    // Subsolar equator at 3 Re
    const theta = Math.PI / 2;
    const phi = 0;
    const r = 3 * Re;
    const bIgrf = computeBMagnitude(r, theta, phi, coeffs, 1);
    const bTotal = computeTotalBMagnitude(r, theta, phi, coeffs, 1, quietParams);
    // Chapman-Ferraro compression should enhance dayside field
    expect(bTotal).toBeGreaterThan(bIgrf * 0.9);
  });

  it('field is near zero well outside magnetopause', () => {
    // 20 Re sunward, well beyond magnetopause (~10-12 Re quiet)
    const theta = Math.PI / 2;
    const phi = 0;
    const r = 20 * Re;
    const bTotal = computeTotalBMagnitude(r, theta, phi, coeffs, 1, quietParams);
    // Should be nearly zero (magnetopause fade)
    expect(bTotal).toBeLessThan(5);
  });

  it('field is near zero outside magnetopause during storm', () => {
    // 10 Re sunward, outside storm magnetopause (~6-7 Re)
    const theta = Math.PI / 2;
    const phi = 0;
    const r = 10 * Re;
    const bTotal = computeTotalBMagnitude(r, theta, phi, coeffs, 1, stormParams);
    expect(bTotal).toBeLessThan(10);
  });

  it('no NaN at Earth surface', () => {
    const points = [
      [Re, Math.PI / 2, 0],       // equator
      [Re, 0.01, 0],              // near north pole
      [Re, Math.PI - 0.01, 0],    // near south pole
      [Re, Math.PI / 2, Math.PI], // antipodal point
    ];
    for (const [r, theta, phi] of points) {
      const [Br, Bt, Bp] = computeTotalB(r, theta, phi, coeffs, 8, quietParams);
      expect(Number.isNaN(Br)).toBe(false);
      expect(Number.isNaN(Bt)).toBe(false);
      expect(Number.isNaN(Bp)).toBe(false);
    }
  });
});

describe('computeTotalBMagnitude', () => {
  it('is consistent with vector magnitude', () => {
    const theta = Math.PI / 3;
    const phi = 1.5;
    const r = 4 * Re;
    const [Br, Bt, Bp] = computeTotalB(r, theta, phi, coeffs, 5, quietParams);
    const mag = Math.sqrt(Br * Br + Bt * Bt + Bp * Bp);
    const magFn = computeTotalBMagnitude(r, theta, phi, coeffs, 5, quietParams);
    expect(magFn).toBeCloseTo(mag, 5);
  });

  it('matches computeBMagnitude when disabled', () => {
    const theta = Math.PI / 2;
    const phi = 0;
    const r = 2 * Re;
    const bIgrf = computeBMagnitude(r, theta, phi, coeffs, 8);
    const bTotal = computeTotalBMagnitude(r, theta, phi, coeffs, 8, null);
    expect(bTotal).toBeCloseTo(bIgrf, 5);
  });
});

describe('computeFieldCartesian', () => {
  // Sample points spanning dayside, nightside, off-equator
  const samples = [
    [2.0 * Re, Math.PI / 4, 1.0],
    [3.5 * Re, Math.PI / 2, 0],
    [5.0 * Re, Math.PI / 3, Math.PI],
    [8.0 * Re, 1.2, 4.5],
  ];

  function evalAt(r, theta, phi, sw, maxDegree = 8) {
    const [xKm, yKm, zKm] = sphericalToCartesian(r, theta, phi);
    const out = new Float64Array(6);
    computeFieldCartesian(xKm, yKm, zKm, r, theta, phi, coeffs, maxDegree, sw, out);
    return out;
  }

  it.each([
    ['quiet', quietParams],
    ['storm', stormParams],
    ['disabled', null],
  ])('%s: total components match computeTotalB through bCartesianToSpherical', (_, sw) => {
    for (const [r, theta, phi] of samples) {
      const out = evalAt(r, theta, phi, sw);
      const [Br, Bt, Bp] = bCartesianToSpherical(out[0], out[1], out[2], theta, phi);
      const [BrRef, BtRef, BpRef] = computeTotalB(r, theta, phi, coeffs, 8, sw);
      expect(Br).toBeCloseTo(BrRef, 8);
      expect(Bt).toBeCloseTo(BtRef, 8);
      expect(Bp).toBeCloseTo(BpRef, 8);
    }
  });

  it.each([
    ['quiet', quietParams],
    ['storm', stormParams],
    ['disabled', null],
  ])('%s: internal components match computeB + bFieldToCartesian (unfaded)', (_, sw) => {
    for (const [r, theta, phi] of samples) {
      const out = evalAt(r, theta, phi, sw);
      const [Br, Bt, Bp] = computeB(r, theta, phi, coeffs, 8);
      const [BxRef, ByRef, BzRef] = bFieldToCartesian(Br, Bt, Bp, theta, phi);
      expect(out[3]).toBeCloseTo(BxRef, 8);
      expect(out[4]).toBeCloseTo(ByRef, 8);
      expect(out[5]).toBeCloseTo(BzRef, 8);
    }
  });

  it('disabled: total equals internal exactly', () => {
    const out = evalAt(2.5 * Re, 1.1, 2.2, null);
    expect(out[0]).toBe(out[3]);
    expect(out[1]).toBe(out[4]);
    expect(out[2]).toBe(out[5]);
  });
});
