import * as THREE from 'three';
import { fieldStrengthToColor, lShellToColor } from '../utils/colors.js';

/**
 * Default isosurface levels for |B| mode (nT).
 */
export const DEFAULT_B_LEVELS = [40000, 20000, 10000, 5000, 2000, 1000, 500, 200];

/**
 * Default isosurface levels for L-shell mode (dimensionless).
 * These follow the field line topology — each surface shows where
 * a given field line "shell" exists in space.
 */
export const DEFAULT_L_LEVELS = [1.5, 2, 3, 4, 5, 6, 8, 10];

// Keep backward compat for imports that use DEFAULT_ISO_LEVELS
export const DEFAULT_ISO_LEVELS = DEFAULT_B_LEVELS;

/**
 * Build a Three.js Group containing isosurface meshes.
 *
 * @param {Array} surfaces - Array of { level, positions, normals, indices }
 * @param {object} options - { opacity, clippingPlanes, mode }
 *   mode: 'fieldStrength' or 'lShell'
 * @returns {THREE.Group}
 */
export function buildIsosurfaceGroup(surfaces, options = {}) {
  const group = new THREE.Group();
  const opacity = options.opacity ?? 0.2;
  const clippingPlanes = options.clippingPlanes || [];
  const mode = options.mode || 'fieldStrength';

  // Sort: for |B|, ascending (weakest/outermost first)
  // For L-shell, descending (largest L / outermost first)
  const sorted = [...surfaces].sort((a, b) =>
    mode === 'lShell' ? b.level - a.level : a.level - b.level
  );

  sorted.forEach((surface, i) => {
    if (surface.positions.length === 0) return;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(surface.positions, 3)
    );
    geometry.setAttribute(
      'normal',
      new THREE.BufferAttribute(surface.normals, 3)
    );
    geometry.setIndex(new THREE.BufferAttribute(surface.indices, 1));

    let color;
    if (mode === 'lShell') {
      color = lShellToColor(surface.level, 1, 12);
    } else {
      color = fieldStrengthToColor(surface.level, 100, 50000);
    }

    const material = new THREE.MeshPhysicalMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.6,
      metalness: 0.0,
      clippingPlanes,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = i;
    mesh.userData.isoLevel = surface.level;
    group.add(mesh);
  });

  return group;
}

/**
 * Dispose all geometry and materials in an isosurface group.
 */
export function disposeIsosurfaceGroup(group) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
  });
}

/**
 * Update opacity on all isosurface meshes in a group.
 */
export function updateIsosurfaceOpacity(group, opacity) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.material && obj.material.opacity !== undefined) {
      obj.material.opacity = opacity;
    }
  });
}

/**
 * Update clipping planes on all isosurface meshes.
 */
export function updateIsosurfaceClipping(group, clippingPlanes) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.material) {
      obj.material.clippingPlanes = clippingPlanes;
      obj.material.needsUpdate = true;
    }
  });
}
