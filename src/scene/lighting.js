import * as THREE from 'three';

/**
 * Set up scene lighting: directional (sun) + ambient fill.
 */
export function setupLighting(scene) {
  const sunLight = new THREE.DirectionalLight(0xffffff, 1.8);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0x333344, 0.5);
  scene.add(ambientLight);

  return { sunLight, ambientLight };
}
