import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Set up camera orbit controls.
 */
export function setupControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1.5;
  controls.maxDistance = 80;
  controls.enablePan = false;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 0.3;
  return controls;
}
