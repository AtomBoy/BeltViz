import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/**
 * Set up camera orbit controls.
 */
export function setupControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1.5;
  controls.maxDistance = 200; // far enough to frame field lines traced ~100 Re down the tail
  controls.enablePan = false;
  controls.autoRotateSpeed = 0.3;
  return controls;
}
