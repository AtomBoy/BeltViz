import * as THREE from 'three';
import { KM_TO_SCENE } from '../utils/constants.js';

/**
 * Create a Three.js mesh for a traced field line.
 * @param {number[][]} points - Array of [x, y, z] in km
 * @param {object} options - { color, radius, radialSegments }
 * @returns {THREE.Mesh}
 */
export function createFieldLineMesh(points, options = {}) {
  const radius = options.radius || 0.008;
  const radialSegments = options.radialSegments || 5;
  const color = options.color || 0x00aaff;

  // Convert km to scene coordinates and create Vector3 array
  const vectors = points.map(
    ([x, y, z]) =>
      new THREE.Vector3(x * KM_TO_SCENE, y * KM_TO_SCENE, z * KM_TO_SCENE)
  );

  if (vectors.length < 2) return null;

  // Smooth curve through traced points
  const curve = new THREE.CatmullRomCurve3(vectors);

  // Tube geometry along the curve
  const tubularSegments = Math.min(vectors.length * 2, 500);
  const geometry = new THREE.TubeGeometry(
    curve,
    tubularSegments,
    radius,
    radialSegments,
    false
  );

  const material = new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: 0.25,
    roughness: 0.5,
    metalness: 0.2,
    transparent: true,
    opacity: 0.85,
  });

  return new THREE.Mesh(geometry, material);
}

/**
 * Build all field line meshes and add to a group.
 * @param {Array} tracedLines - Array of { points, lat, lon }
 * @param {function} colorFn - (lat) => THREE.Color
 * @param {object} options - { radius }
 * @returns {THREE.Group}
 */
export function buildFieldLineGroup(tracedLines, colorFn, options = {}) {
  const group = new THREE.Group();

  for (const line of tracedLines) {
    const color = colorFn(line.lat);
    const mesh = createFieldLineMesh(line.points, {
      color,
      radius: options.radius || 0.008,
    });
    if (mesh) group.add(mesh);
  }

  return group;
}
