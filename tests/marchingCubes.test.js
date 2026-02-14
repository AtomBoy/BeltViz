import { describe, it, expect } from 'vitest';
import { extractIsosurface } from '../src/physics/marchingCubes.js';

/**
 * Helper: create a scalar field grid where each cell stores x^2 + y^2 + z^2
 * (distance-squared from origin). This produces a sphere isosurface at r = sqrt(isoValue).
 */
function createSphereGrid(resolution, boundsMin, boundsMax) {
  const res = resolution;
  const grid = new Float32Array(res * res * res);
  const stepX = (boundsMax[0] - boundsMin[0]) / (res - 1);
  const stepY = (boundsMax[1] - boundsMin[1]) / (res - 1);
  const stepZ = (boundsMax[2] - boundsMin[2]) / (res - 1);

  for (let ix = 0; ix < res; ix++) {
    for (let iy = 0; iy < res; iy++) {
      for (let iz = 0; iz < res; iz++) {
        const x = boundsMin[0] + ix * stepX;
        const y = boundsMin[1] + iy * stepY;
        const z = boundsMin[2] + iz * stepZ;
        grid[ix * res * res + iy * res + iz] = x * x + y * y + z * z;
      }
    }
  }
  return grid;
}

/**
 * Helper: create a grid with Infinity inside a sphere (Earth masking).
 */
function createMaskedSphereGrid(resolution, boundsMin, boundsMax, maskRadius) {
  const res = resolution;
  const grid = new Float32Array(res * res * res);
  const stepX = (boundsMax[0] - boundsMin[0]) / (res - 1);
  const stepY = (boundsMax[1] - boundsMin[1]) / (res - 1);
  const stepZ = (boundsMax[2] - boundsMin[2]) / (res - 1);

  for (let ix = 0; ix < res; ix++) {
    for (let iy = 0; iy < res; iy++) {
      for (let iz = 0; iz < res; iz++) {
        const x = boundsMin[0] + ix * stepX;
        const y = boundsMin[1] + iy * stepY;
        const z = boundsMin[2] + iz * stepZ;
        const r2 = x * x + y * y + z * z;
        grid[ix * res * res + iy * res + iz] =
          Math.sqrt(r2) < maskRadius ? Infinity : r2;
      }
    }
  }
  return grid;
}

describe('extractIsosurface', () => {
  const bounds = [-3, -3, -3];
  const boundsMax = [3, 3, 3];
  const res = 32;

  it('produces a closed surface from x²+y²+z² at r=2', () => {
    const grid = createSphereGrid(res, bounds, boundsMax);
    const isoValue = 4.0; // r² = 4 → r = 2

    const result = extractIsosurface(grid, res, bounds, boundsMax, isoValue);

    // Should produce geometry
    expect(result.positions.length).toBeGreaterThan(0);
    expect(result.indices.length).toBeGreaterThan(0);
    expect(result.normals.length).toBe(result.positions.length);

    // Indices should reference valid vertices
    const numVertices = result.positions.length / 3;
    for (let i = 0; i < result.indices.length; i++) {
      expect(result.indices[i]).toBeLessThan(numVertices);
    }

    // Indices count should be divisible by 3 (triangles)
    expect(result.indices.length % 3).toBe(0);
  });

  it('vertices lie near the expected isosurface radius', () => {
    const grid = createSphereGrid(res, bounds, boundsMax);
    const targetR = 2.0;
    const isoValue = targetR * targetR;

    const result = extractIsosurface(grid, res, bounds, boundsMax, isoValue);

    // Check each vertex is approximately at radius 2
    const numVerts = result.positions.length / 3;
    for (let i = 0; i < numVerts; i++) {
      const x = result.positions[i * 3];
      const y = result.positions[i * 3 + 1];
      const z = result.positions[i * 3 + 2];
      const r = Math.sqrt(x * x + y * y + z * z);
      // Grid step is 6/31 ≈ 0.19, so vertices should be within one step of target
      expect(r).toBeGreaterThan(targetR - 0.3);
      expect(r).toBeLessThan(targetR + 0.3);
    }
  });

  it('normals point approximately outward for a sphere', () => {
    const grid = createSphereGrid(res, bounds, boundsMax);
    const isoValue = 4.0;

    const result = extractIsosurface(grid, res, bounds, boundsMax, isoValue);

    // For a sphere centered at origin, normals should be roughly parallel
    // to the position vector (either same or opposite direction).
    const numVerts = result.positions.length / 3;
    let alignedCount = 0;
    for (let i = 0; i < numVerts; i++) {
      const px = result.positions[i * 3];
      const py = result.positions[i * 3 + 1];
      const pz = result.positions[i * 3 + 2];
      const nx = result.normals[i * 3];
      const ny = result.normals[i * 3 + 1];
      const nz = result.normals[i * 3 + 2];

      const pLen = Math.sqrt(px * px + py * py + pz * pz);
      if (pLen < 0.01) continue;

      // Dot product of normalized position with normal
      const dot = (px * nx + py * ny + pz * nz) / pLen;
      // Should be close to +1 or -1 (parallel or anti-parallel)
      if (Math.abs(dot) > 0.7) alignedCount++;
    }
    // At least 80% of normals should be roughly aligned
    expect(alignedCount / numVerts).toBeGreaterThan(0.8);
  });

  it('no NaN in positions or normals', () => {
    const grid = createSphereGrid(res, bounds, boundsMax);
    const isoValue = 4.0;

    const result = extractIsosurface(grid, res, bounds, boundsMax, isoValue);

    for (let i = 0; i < result.positions.length; i++) {
      expect(isNaN(result.positions[i])).toBe(false);
    }
    for (let i = 0; i < result.normals.length; i++) {
      expect(isNaN(result.normals[i])).toBe(false);
    }
  });

  it('produces smaller surface at smaller radius', () => {
    const grid = createSphereGrid(res, bounds, boundsMax);
    const result1 = extractIsosurface(grid, res, bounds, boundsMax, 1.0); // r=1
    const result2 = extractIsosurface(grid, res, bounds, boundsMax, 4.0); // r=2

    // Larger sphere should have more triangles
    expect(result2.indices.length).toBeGreaterThan(result1.indices.length);
  });

  it('returns empty geometry when isovalue is outside data range', () => {
    const grid = createSphereGrid(res, bounds, boundsMax);
    // Max value in grid: corners at (3,3,3) → 27. Pick isovalue above that.
    const result = extractIsosurface(grid, res, bounds, boundsMax, 100.0);

    expect(result.positions.length).toBe(0);
    expect(result.indices.length).toBe(0);
    expect(result.normals.length).toBe(0);
  });

  it('returns empty geometry when isovalue is below minimum', () => {
    const grid = createSphereGrid(res, bounds, boundsMax);
    // Min value is 0 at origin (or very near). Negative isovalue → all inside.
    const result = extractIsosurface(grid, res, bounds, boundsMax, -1.0);

    expect(result.positions.length).toBe(0);
    expect(result.indices.length).toBe(0);
  });

  it('Earth-masked cells produce no triangles inside the mask', () => {
    const maskRadius = 1.5;
    const grid = createMaskedSphereGrid(res, bounds, boundsMax, maskRadius);
    // Extract at r² = 1.0 (r=1), which is inside the mask → should be empty
    const result = extractIsosurface(grid, res, bounds, boundsMax, 1.0);

    // The isosurface at r=1 is entirely inside the masked region
    expect(result.positions.length).toBe(0);
    expect(result.indices.length).toBe(0);
  });

  it('Earth-masked grid still produces surface outside the mask', () => {
    const maskRadius = 1.0;
    const grid = createMaskedSphereGrid(res, bounds, boundsMax, maskRadius);
    // Extract at r² = 4.0 (r=2), which is well outside the mask
    const result = extractIsosurface(grid, res, bounds, boundsMax, 4.0);

    // Should still produce geometry
    expect(result.positions.length).toBeGreaterThan(0);
    expect(result.indices.length).toBeGreaterThan(0);

    // No vertex should be inside the mask
    const numVerts = result.positions.length / 3;
    for (let i = 0; i < numVerts; i++) {
      const x = result.positions[i * 3];
      const y = result.positions[i * 3 + 1];
      const z = result.positions[i * 3 + 2];
      const r = Math.sqrt(x * x + y * y + z * z);
      expect(r).toBeGreaterThan(maskRadius - 0.3);
    }
  });

  it('vertex cache avoids duplicates (positions length < 3 * index count)', () => {
    const grid = createSphereGrid(res, bounds, boundsMax);
    const result = extractIsosurface(grid, res, bounds, boundsMax, 4.0);

    const numVertices = result.positions.length / 3;
    const numTriangles = result.indices.length / 3;
    // Without caching, each triangle would add 3 unique vertices.
    // With caching, shared edges reuse vertices, so vertex count should be much less.
    expect(numVertices).toBeLessThan(numTriangles * 3);
  });

  it('works with different resolutions', () => {
    const smallBounds = [-2, -2, -2];
    const smallBoundsMax = [2, 2, 2];

    for (const testRes of [8, 16, 48]) {
      const grid = createSphereGrid(testRes, smallBounds, smallBoundsMax);
      const result = extractIsosurface(grid, testRes, smallBounds, smallBoundsMax, 1.0);

      expect(result.positions.length).toBeGreaterThan(0);
      expect(result.indices.length).toBeGreaterThan(0);
      expect(result.normals.length).toBe(result.positions.length);
    }
  });
});
