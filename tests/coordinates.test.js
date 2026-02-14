import { describe, it, expect } from 'vitest';
import {
  sphericalToCartesian,
  cartesianToSpherical,
  bFieldToCartesian,
} from '../src/physics/coordinates.js';

const EPSILON = 1e-8;

function expectClose(actual, expected, eps = EPSILON) {
  expect(Math.abs(actual - expected)).toBeLessThan(eps);
}

describe('sphericalToCartesian', () => {
  it('north pole (theta=0) maps to +Y', () => {
    const [x, y, z] = sphericalToCartesian(1, 0, 0);
    expectClose(x, 0);
    expectClose(y, 1);
    expectClose(z, 0);
  });

  it('equator lon=0 maps to +X', () => {
    const [x, y, z] = sphericalToCartesian(1, Math.PI / 2, 0);
    expectClose(x, 1);
    expectClose(y, 0);
    expectClose(z, 0);
  });

  it('equator lon=90E maps to +Z', () => {
    const [x, y, z] = sphericalToCartesian(1, Math.PI / 2, Math.PI / 2);
    expectClose(x, 0);
    expectClose(y, 0);
    expectClose(z, 1);
  });

  it('south pole (theta=pi) maps to -Y', () => {
    const [x, y, z] = sphericalToCartesian(1, Math.PI, 0);
    expectClose(x, 0);
    expectClose(y, -1);
    expectClose(z, 0);
  });

  it('scales by radius', () => {
    const [x, y, z] = sphericalToCartesian(5, Math.PI / 2, 0);
    expectClose(x, 5);
    expectClose(y, 0);
    expectClose(z, 0);
  });
});

describe('cartesianToSpherical', () => {
  it('roundtrips through sphericalToCartesian', () => {
    const cases = [
      [3, 0.7, 1.2],
      [1, Math.PI / 4, Math.PI],
      [10, Math.PI / 2, 0],
      [2, 0.1, 5.5],
    ];
    for (const [r, theta, phi] of cases) {
      const [x, y, z] = sphericalToCartesian(r, theta, phi);
      const [r2, theta2, phi2] = cartesianToSpherical(x, y, z);
      expectClose(r2, r, 1e-6);
      expectClose(theta2, theta, 1e-6);
      // phi may wrap around 2pi
      expectClose(Math.cos(phi2), Math.cos(phi), 1e-6);
      expectClose(Math.sin(phi2), Math.sin(phi), 1e-6);
    }
  });
});

describe('bFieldToCartesian', () => {
  it('radial field at north pole points +Y', () => {
    // At north pole (theta~0), Br pointing outward should be +Y
    const theta = 0.001;
    const phi = 0;
    const [Bx, By, Bz] = bFieldToCartesian(1, 0, 0, theta, phi);
    expectClose(Bx, 0, 0.01);
    expectClose(By, 1, 0.01);
    expectClose(Bz, 0, 0.01);
  });

  it('radial field at equator lon=0 points +X', () => {
    const theta = Math.PI / 2;
    const phi = 0;
    const [Bx, By, Bz] = bFieldToCartesian(1, 0, 0, theta, phi);
    expectClose(Bx, 1);
    expectClose(By, 0);
    expectClose(Bz, 0);
  });

  it('Btheta (southward) at equator lon=0 points -Y', () => {
    // Btheta increases toward south pole; at equator it should point -Y
    const theta = Math.PI / 2;
    const phi = 0;
    const [Bx, By, Bz] = bFieldToCartesian(0, 1, 0, theta, phi);
    expectClose(Bx, 0);
    expectClose(By, -1);
    expectClose(Bz, 0);
  });

  it('Bphi (eastward) at equator lon=0 points +Z', () => {
    const theta = Math.PI / 2;
    const phi = 0;
    const [Bx, By, Bz] = bFieldToCartesian(0, 0, 1, theta, phi);
    expectClose(Bx, 0);
    expectClose(By, 0);
    expectClose(Bz, 1);
  });
});
