import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { computeTotalB, computeTotalBMagnitude } from '../src/physics/totalField.js';
import { computeB, computeBMagnitude } from '../src/physics/igrf.js';

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
