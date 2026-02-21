import { describe, it, expect } from 'vitest';
import { julianDate, solarPosition, lunarPosition } from '../src/utils/astronomy.js';

describe('julianDate', () => {
  it('returns correct JD for J2000.0 epoch', () => {
    // J2000.0 = 2000-01-01T12:00:00Z = JD 2451545.0
    const j2000 = new Date('2000-01-01T12:00:00Z');
    expect(julianDate(j2000)).toBeCloseTo(2451545.0, 1);
  });

  it('returns correct JD for Unix epoch', () => {
    // Unix epoch = 1970-01-01T00:00:00Z = JD 2440587.5
    const unix = new Date(0);
    expect(julianDate(unix)).toBeCloseTo(2440587.5, 1);
  });
});

describe('solarPosition', () => {
  it('summer solstice 2025: declination near +23.4 degrees', () => {
    const date = new Date('2025-06-21T12:00:00Z');
    const pos = solarPosition(date);
    const decDeg = pos.declinationRad * (180 / Math.PI);
    expect(decDeg).toBeGreaterThan(23.0);
    expect(decDeg).toBeLessThan(24.0);
  });

  it('winter solstice 2025: declination near -23.4 degrees', () => {
    const date = new Date('2025-12-21T12:00:00Z');
    const pos = solarPosition(date);
    const decDeg = pos.declinationRad * (180 / Math.PI);
    expect(decDeg).toBeLessThan(-23.0);
    expect(decDeg).toBeGreaterThan(-24.0);
  });

  it('vernal equinox 2025: declination near 0', () => {
    const date = new Date('2025-03-20T09:02:00Z');
    const pos = solarPosition(date);
    const decDeg = pos.declinationRad * (180 / Math.PI);
    expect(Math.abs(decDeg)).toBeLessThan(1.5);
  });

  it('autumnal equinox 2025: declination near 0', () => {
    const date = new Date('2025-09-22T18:20:00Z');
    const pos = solarPosition(date);
    const decDeg = pos.declinationRad * (180 / Math.PI);
    expect(Math.abs(decDeg)).toBeLessThan(1.5);
  });

  it('noon UTC: sub-solar longitude near 0 degrees (prime meridian)', () => {
    // At 12:00 UTC the sun is roughly overhead near the prime meridian
    // (±15 deg tolerance for equation of time)
    const date = new Date('2025-03-20T12:00:00Z');
    const pos = solarPosition(date);
    const lonDeg = pos.longitudeRad * (180 / Math.PI);
    expect(Math.abs(lonDeg)).toBeLessThan(20);
  });

  it('midnight UTC: sub-solar longitude near ±180 degrees', () => {
    const date = new Date('2025-03-20T00:00:00Z');
    const pos = solarPosition(date);
    const lonDeg = pos.longitudeRad * (180 / Math.PI);
    expect(Math.abs(Math.abs(lonDeg) - 180)).toBeLessThan(20);
  });

  it('longitude is in range [-pi, pi]', () => {
    const dates = [
      new Date('2025-01-01T00:00:00Z'),
      new Date('2025-04-01T06:00:00Z'),
      new Date('2025-07-15T18:00:00Z'),
      new Date('2025-10-31T12:00:00Z'),
    ];
    for (const date of dates) {
      const pos = solarPosition(date);
      expect(pos.longitudeRad).toBeGreaterThanOrEqual(-Math.PI - 0.001);
      expect(pos.longitudeRad).toBeLessThanOrEqual(Math.PI + 0.001);
    }
  });

  it('produces no NaN for arbitrary dates', () => {
    const dates = [
      new Date('1900-01-01T00:00:00Z'),
      new Date('2000-06-15T08:30:00Z'),
      new Date('2050-12-31T23:59:59Z'),
    ];
    for (const date of dates) {
      const pos = solarPosition(date);
      expect(Number.isNaN(pos.declinationRad)).toBe(false);
      expect(Number.isNaN(pos.longitudeRad)).toBe(false);
    }
  });
});

describe('lunarPosition', () => {
  it('declination is within ±30 degrees (bounded by ecliptic + orbital inclination)', () => {
    const dates = [
      new Date('2025-01-15T00:00:00Z'),
      new Date('2025-04-10T12:00:00Z'),
      new Date('2025-07-20T06:00:00Z'),
      new Date('2025-10-05T18:00:00Z'),
    ];
    for (const date of dates) {
      const pos = lunarPosition(date);
      const decDeg = pos.declinationRad * (180 / Math.PI);
      expect(Math.abs(decDeg)).toBeLessThan(30);
    }
  });

  it('distance is approximately 55–65 Earth radii', () => {
    const dates = [
      new Date('2025-01-15T00:00:00Z'),
      new Date('2025-04-10T12:00:00Z'),
      new Date('2025-07-20T06:00:00Z'),
    ];
    for (const date of dates) {
      const pos = lunarPosition(date);
      expect(pos.distanceEarthRadii).toBeGreaterThan(55);
      expect(pos.distanceEarthRadii).toBeLessThan(65);
    }
  });

  it('longitude is in range [-pi, pi]', () => {
    const dates = [
      new Date('2025-01-01T00:00:00Z'),
      new Date('2025-06-15T12:00:00Z'),
      new Date('2025-12-31T23:59:59Z'),
    ];
    for (const date of dates) {
      const pos = lunarPosition(date);
      expect(pos.longitudeRad).toBeGreaterThanOrEqual(-Math.PI - 0.001);
      expect(pos.longitudeRad).toBeLessThanOrEqual(Math.PI + 0.001);
    }
  });

  it('produces no NaN for arbitrary dates', () => {
    const dates = [
      new Date('1900-01-01T00:00:00Z'),
      new Date('2000-06-15T08:30:00Z'),
      new Date('2050-12-31T23:59:59Z'),
    ];
    for (const date of dates) {
      const pos = lunarPosition(date);
      expect(Number.isNaN(pos.declinationRad)).toBe(false);
      expect(Number.isNaN(pos.longitudeRad)).toBe(false);
      expect(Number.isNaN(pos.distanceEarthRadii)).toBe(false);
    }
  });

  it('moon moves significantly over one month (not static)', () => {
    // Moon completes an orbit in ~27.3 days so two dates 14 days apart
    // should differ by roughly 180 degrees in longitude
    const date1 = new Date('2025-03-01T00:00:00Z');
    const date2 = new Date('2025-03-15T00:00:00Z');
    const pos1 = lunarPosition(date1);
    const pos2 = lunarPosition(date2);
    const lonDiff = Math.abs(pos1.longitudeRad - pos2.longitudeRad) * (180 / Math.PI);
    // Should differ by at least 90 degrees in 14 days
    expect(lonDiff).toBeGreaterThan(90);
  });
});
