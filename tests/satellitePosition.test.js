import { describe, it, expect } from 'vitest';
import { geographicToPhysicsPosition } from '../src/physics/satellitePosition.js';
import { EARTH_RADIUS_KM } from '../src/utils/constants.js';

describe('geographicToPhysicsPosition', () => {
  it('equator at lon=0 gives x=r, y=0, z=0', () => {
    const pos = geographicToPhysicsPosition(0, 0, 0);
    expect(pos.r).toBeCloseTo(EARTH_RADIUS_KM, 1);
    expect(pos.x).toBeCloseTo(EARTH_RADIUS_KM, 1);
    expect(Math.abs(pos.y)).toBeLessThan(1);
    expect(Math.abs(pos.z)).toBeLessThan(1);
  });

  it('north pole gives y=r, x≈0, z≈0', () => {
    const pos = geographicToPhysicsPosition(90, 0, 0);
    expect(pos.y).toBeCloseTo(EARTH_RADIUS_KM, 1);
    expect(Math.abs(pos.x)).toBeLessThan(1);
    expect(Math.abs(pos.z)).toBeLessThan(1);
  });

  it('south pole gives y=-r', () => {
    const pos = geographicToPhysicsPosition(-90, 0, 0);
    expect(pos.y).toBeCloseTo(-EARTH_RADIUS_KM, 1);
  });

  it('altitude correctly added to radial distance', () => {
    const alt = 400;
    const pos = geographicToPhysicsPosition(0, 0, alt);
    expect(pos.r).toBeCloseTo(EARTH_RADIUS_KM + alt, 1);
    expect(pos.altitudeKm).toBe(alt);
  });

  it('equator at lon=90E gives z=r', () => {
    const pos = geographicToPhysicsPosition(0, 90, 0);
    expect(pos.z).toBeCloseTo(EARTH_RADIUS_KM, 1);
    expect(Math.abs(pos.x)).toBeLessThan(1);
  });

  it('negative longitude wraps correctly', () => {
    const pos = geographicToPhysicsPosition(0, -90, 0);
    // lon=-90 is the same as lon=270
    expect(pos.phi).toBeCloseTo(270 * Math.PI / 180, 5);
    expect(pos.z).toBeCloseTo(-EARTH_RADIUS_KM, 1);
  });

  it('colatitude is correct', () => {
    // lat=45 → colatitude=45° = π/4
    const pos = geographicToPhysicsPosition(45, 0, 0);
    expect(pos.theta).toBeCloseTo(Math.PI / 4, 5);
  });

  it('preserves input metadata', () => {
    const pos = geographicToPhysicsPosition(30, -45, 800);
    expect(pos.latDeg).toBe(30);
    expect(pos.lonDeg).toBe(-45);
    expect(pos.altitudeKm).toBe(800);
  });
});
