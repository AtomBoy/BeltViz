import * as THREE from 'three';

/**
 * Radiation belt definitions.
 * Each belt is defined by inner/outer L-shell boundaries and display properties.
 */
export const BELT_DEFINITIONS = [
  {
    name: 'innerBelt',
    label: 'Inner Belt',
    lMin: 1.2,
    lMax: 2.0,
    color: new THREE.Color(0.9, 0.4, 0.1), // warm orange/red
    opacity: 0.12,
  },
  {
    name: 'outerBelt',
    label: 'Outer Belt',
    lMin: 3.0,
    lMax: 6.0,
    color: new THREE.Color(0.3, 0.3, 0.9), // cooler blue/purple
    opacity: 0.08,
  },
];

/**
 * Build a Three.js Group containing radiation belt meshes.
 *
 * Each belt is rendered as two isosurfaces (inner and outer L-shell boundaries)
 * with DoubleSide material to create a filled shell appearance.
 *
 * @param {Array} beltSurfaces - Array of { name, surfaces: [{ positions, normals, indices }] }
 *   where surfaces[0] = inner boundary, surfaces[1] = outer boundary
 * @param {object} options - { clippingPlanes }
 * @returns {THREE.Group}
 */
export function buildRadiationBeltGroup(beltSurfaces, options = {}) {
  const group = new THREE.Group();
  const clippingPlanes = options.clippingPlanes || [];
  const opacity = options.opacity;

  for (const belt of beltSurfaces) {
    const def = BELT_DEFINITIONS.find((d) => d.name === belt.name);
    if (!def) continue;

    for (const surface of belt.surfaces) {
      if (surface.positions.length === 0) continue;

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

      const material = new THREE.MeshPhysicalMaterial({
        color: def.color,
        emissive: def.color,
        emissiveIntensity: 0.3,
        transparent: true,
        opacity: opacity ?? def.opacity,
        depthWrite: false,
        side: THREE.DoubleSide,
        roughness: 0.8,
        metalness: 0.0,
        clippingPlanes,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = def.name === 'innerBelt' ? 10 : 11;
      mesh.userData.beltName = def.name;
      group.add(mesh);
    }
  }

  return group;
}

/**
 * Dispose all geometry and materials in a radiation belt group.
 */
export function disposeRadiationBeltGroup(group) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
  });
}

/**
 * Update opacity on all radiation belt meshes.
 */
export function updateBeltOpacity(group, opacity) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.material && obj.material.opacity !== undefined) {
      obj.material.opacity = opacity;
    }
  });
}

/**
 * Update clipping planes on all radiation belt meshes.
 */
export function updateBeltClipping(group, clippingPlanes) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.material) {
      obj.material.clippingPlanes = clippingPlanes;
      obj.material.needsUpdate = true;
    }
  });
}
