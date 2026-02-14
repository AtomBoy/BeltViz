import { describe, it, expect, beforeAll } from 'vitest';
import { readFileSync } from 'fs';
import {
  computeLShell,
  computeMagneticEnvironment,
  computeSAAProximity,
  classifyRegion,
  computeLShellCartesian,
} from '../src/physics/magneticEnvironment.js';
import { EARTH_RADIUS_KM } from '../src/utils/constants.js';

let coeffs;

beforeAll(() => {
  coeffs = JSON.parse(readFileSync('public/data/igrf14coeffs.json', 'utf-8'));
});

describe('computeLShell', () => {
  it('L ≈ 1.0 at the equator on Earth surface', () => {
    const theta = Math.PI / 2; // equator (colatitude 90°)
    const phi = 0;
    const L = computeLShell(EARTH_RADIUS_KM, theta, phi, coeffs, 1);
    // At equator surface, L should be ~1.0 for a dipole
    expect(L).toBeGreaterThan(0.8);
    expect(L).toBeLessThan(1.3);
  });

  it('L ≈ 4.0 at magnetic latitude ~60° on surface', () => {
    // colatitude 30° = latitude 60°
    const theta = 30 * (Math.PI / 180);
    const phi = 0;
    const L = computeLShell(EARTH_RADIUS_KM, theta, phi, coeffs, 1);
    // L = 1/cos²(60°) = 1/0.25 = 4.0
    expect(L).toBeGreaterThan(3.0);
    expect(L).toBeLessThan(5.5);
  });

  it('L increases with latitude', () => {
    const phi = 0;
    const L30 = computeLShell(EARTH_RADIUS_KM, (90 - 30) * Math.PI / 180, phi, coeffs, 1);
    const L45 = computeLShell(EARTH_RADIUS_KM, (90 - 45) * Math.PI / 180, phi, coeffs, 1);
    const L60 = computeLShell(EARTH_RADIUS_KM, (90 - 60) * Math.PI / 180, phi, coeffs, 1);

    expect(L45).toBeGreaterThan(L30);
    expect(L60).toBeGreaterThan(L45);
  });

  it('L ≈ 1 at equator at higher altitude', () => {
    // At equator, L = r/Re regardless of altitude
    const r = EARTH_RADIUS_KM * 2; // 2 Re altitude at equator
    const theta = Math.PI / 2;
    const phi = 0;
    const L = computeLShell(r, theta, phi, coeffs, 1);
    // At equator, L should equal r/Re = 2
    expect(L).toBeGreaterThan(1.5);
    expect(L).toBeLessThan(2.5);
  });

  it('does not produce NaN at the poles', () => {
    // North pole: colatitude ~0
    const L = computeLShell(EARTH_RADIUS_KM, 0.01, 0, coeffs, 1);
    expect(isNaN(L)).toBe(false);
    expect(isFinite(L)).toBe(true);
  });
});

describe('classifyRegion', () => {
  it('classifies L < 1.2 as below-inner-belt', () => {
    expect(classifyRegion(1.0)).toBe('below-inner-belt');
  });

  it('classifies L = 1.5 as inner-belt', () => {
    expect(classifyRegion(1.5)).toBe('inner-belt');
  });

  it('classifies L = 2.5 as slot-region', () => {
    expect(classifyRegion(2.5)).toBe('slot-region');
  });

  it('classifies L = 4.0 as outer-belt', () => {
    expect(classifyRegion(4.0)).toBe('outer-belt');
  });

  it('classifies L > 6 as beyond-outer-belt', () => {
    expect(classifyRegion(7.0)).toBe('beyond-outer-belt');
  });
});

describe('computeSAAProximity', () => {
  it('SAA proximity higher over Brazil than Europe at LEO altitude', () => {
    // SAA center: approximately lat=-30°, lon=-45° (Brazil)
    // Convert to colatitude/longitude radians
    const altKm = 400;
    const r = EARTH_RADIUS_KM + altKm;

    // Brazil (SAA region): lat=-30°, lon=-45°
    const thetaBrazil = (90 - (-30)) * (Math.PI / 180); // colatitude 120°
    const phiBrazil = (-45 + 360) * (Math.PI / 180); // east longitude

    // Europe: lat=50°, lon=10°
    const thetaEurope = (90 - 50) * (Math.PI / 180); // colatitude 40°
    const phiEurope = 10 * (Math.PI / 180);

    const saaBrazil = computeSAAProximity(r, thetaBrazil, phiBrazil, coeffs, 13);
    const saaEurope = computeSAAProximity(r, thetaEurope, phiEurope, coeffs, 13);

    // SAA proximity should be higher over Brazil
    expect(saaBrazil).toBeGreaterThan(saaEurope);
  });

  it('SAA proximity is 0 for degree-1 (pure dipole)', () => {
    // With only dipole, actual = dipole, so no depression
    const r = EARTH_RADIUS_KM + 400;
    const theta = Math.PI / 2;
    const phi = 0;
    const saa = computeSAAProximity(r, theta, phi, coeffs, 1);
    expect(saa).toBe(0);
  });
});

describe('computeMagneticEnvironment', () => {
  it('returns all expected fields', () => {
    const r = EARTH_RADIUS_KM + 400;
    const theta = Math.PI / 2;
    const phi = 0;
    const env = computeMagneticEnvironment(r, theta, phi, coeffs, 1);

    expect(env).toHaveProperty('bMagnitude');
    expect(env).toHaveProperty('bVector');
    expect(env).toHaveProperty('lShell');
    expect(env).toHaveProperty('region');
    expect(env).toHaveProperty('saaProximity');

    expect(env.bMagnitude).toBeGreaterThan(0);
    expect(env.bVector).toHaveLength(3);
    expect(typeof env.region).toBe('string');
  });

  it('equatorial surface point is below-inner-belt', () => {
    const env = computeMagneticEnvironment(
      EARTH_RADIUS_KM, Math.PI / 2, 0, coeffs, 1
    );
    expect(env.region).toBe('below-inner-belt');
  });

  it('no NaN in any returned value', () => {
    // Test a grid of points
    const testPoints = [
      [EARTH_RADIUS_KM, Math.PI / 2, 0],
      [EARTH_RADIUS_KM, 0.1, Math.PI],
      [EARTH_RADIUS_KM * 3, Math.PI / 4, Math.PI / 2],
      [EARTH_RADIUS_KM + 400, Math.PI / 3, 1.5],
    ];

    for (const [r, theta, phi] of testPoints) {
      const env = computeMagneticEnvironment(r, theta, phi, coeffs, 13);
      expect(isNaN(env.bMagnitude)).toBe(false);
      expect(isNaN(env.lShell)).toBe(false);
      expect(isNaN(env.saaProximity)).toBe(false);
      for (const v of env.bVector) {
        expect(isNaN(v)).toBe(false);
      }
    }
  });
});

describe('computeLShellCartesian', () => {
  it('matches spherical version at equator', () => {
    // Equator, lon=0: x=Re, y=0, z=0
    const L = computeLShellCartesian(EARTH_RADIUS_KM, 0, 0, coeffs, 1);
    // y-up convention: equator is in the x-z plane, y=0
    // But cartesianToSpherical uses y-up: r=Re, theta=pi/2 (equator)
    // Actually x=Re, y=0, z=0 → theta = acos(y/r) = acos(0) = pi/2, phi = atan2(z,x) = 0
    expect(L).toBeGreaterThan(0.8);
    expect(L).toBeLessThan(1.3);
  });
});
