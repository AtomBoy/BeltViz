import * as THREE from 'three';
import { KM_TO_SCENE } from '../utils/constants.js';

/**
 * Create a satellite marker mesh — a small emissive sphere.
 *
 * @returns {{ mesh: THREE.Mesh, setPosition: function, setVisible: function }}
 */
export function createSatelliteMarker() {
  const geometry = new THREE.SphereGeometry(0.03, 16, 16);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    emissive: 0x00ff88,
    emissiveIntensity: 0.8,
    roughness: 0.3,
    metalness: 0.5,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false;

  /**
   * Set position from physics coordinates (km).
   * @param {number} xKm
   * @param {number} yKm
   * @param {number} zKm
   */
  function setPosition(xKm, yKm, zKm) {
    mesh.position.set(
      xKm * KM_TO_SCENE,
      yKm * KM_TO_SCENE,
      zKm * KM_TO_SCENE
    );
  }

  function setVisible(visible) {
    mesh.visible = visible;
  }

  return { mesh, setPosition, setVisible };
}
