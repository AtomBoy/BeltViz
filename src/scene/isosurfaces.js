import * as THREE from 'three';
import { fieldStrengthToColor } from '../utils/colors.js';

/**
 * Default isosurface levels in nT, logarithmically spaced from
 * near-surface (~60,000 nT) down to outer belt (~100 nT at 6 Re).
 */
export const DEFAULT_ISO_LEVELS = [40000, 20000, 10000, 5000, 2000, 1000, 500, 200];

// Range for color mapping
const B_MIN = 100;
const B_MAX = 50000;

/**
 * Build a Three.js Group containing isosurface meshes.
 *
 * @param {Array} surfaces - Array of { level, positions, normals, indices }
 *   where level is the nT value and positions/normals/indices come from extractIsosurface
 * @param {object} options - { opacity, clippingPlanes }
 * @returns {THREE.Group}
 */
export function buildIsosurfaceGroup(surfaces, options = {}) {
  const group = new THREE.Group();
  const opacity = options.opacity ?? 0.2;
  const clippingPlanes = options.clippingPlanes || [];

  // Sort surfaces by level ascending (weakest/outermost first)
  // so outer surfaces render before inner ones
  const sorted = [...surfaces].sort((a, b) => a.level - b.level);

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

    const color = fieldStrengthToColor(surface.level, B_MIN, B_MAX);

    const material = new THREE.MeshPhysicalMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.6,
      metalness: 0.0,
      clippingPlanes,
    });

    const mesh = new THREE.Mesh(geometry, material);
    // Outer (weaker) surfaces render first
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
