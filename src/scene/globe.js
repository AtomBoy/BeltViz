import * as THREE from 'three';

/**
 * Create the Earth globe mesh with texture and atmosphere glow.
 */
export function createGlobe(scene) {
  const loader = new THREE.TextureLoader();

  // Earth sphere
  const geometry = new THREE.SphereGeometry(1, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: loader.load('./textures/earth_day_2k.png'),
    roughness: 0.8,
    metalness: 0.1,
  });
  const earth = new THREE.Mesh(geometry, material);
  scene.add(earth);

  // Atmosphere glow (fresnel rim effect)
  const atmosGeometry = new THREE.SphereGeometry(1.015, 64, 64);
  const atmosMaterial = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vec3 viewDir = normalize(-vPosition);
        float rim = 1.0 - dot(viewDir, vNormal);
        float intensity = pow(rim, 3.0) * 0.8;
        gl_FragColor = vec4(0.4, 0.6, 1.0, intensity);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.FrontSide,
    depthWrite: false,
  });
  const atmosphere = new THREE.Mesh(atmosGeometry, atmosMaterial);
  scene.add(atmosphere);

  return earth;
}

/**
 * Create a sun representation at a given direction.
 * Includes a glowing sphere and a radial corona sprite.
 * @param {THREE.Scene} scene
 * @returns {{ group: THREE.Group, setDirection: (lonRad: number) => void }}
 */
export function createSun(scene) {
  const SUN_DISTANCE = 60; // scene units

  // Glowing sun sphere
  const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
  const sunMaterial = new THREE.MeshBasicMaterial({
    color: 0xffee88,
  });
  const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);

  // Corona glow (additive billboard sprite)
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, 'rgba(255, 238, 136, 1.0)');
  gradient.addColorStop(0.3, 'rgba(255, 200, 80, 0.6)');
  gradient.addColorStop(0.7, 'rgba(255, 160, 40, 0.15)');
  gradient.addColorStop(1, 'rgba(255, 120, 0, 0.0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);

  const coronaTexture = new THREE.CanvasTexture(canvas);
  const coronaMaterial = new THREE.SpriteMaterial({
    map: coronaTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const corona = new THREE.Sprite(coronaMaterial);
  corona.scale.set(12, 12, 1);

  const sunGroup = new THREE.Group();
  sunGroup.add(sunMesh);
  sunGroup.add(corona);
  sunGroup.visible = false; // hidden until solar wind enabled
  scene.add(sunGroup);

  function setDirection(lonRad) {
    sunGroup.position.set(
      Math.cos(lonRad) * SUN_DISTANCE,
      0,
      Math.sin(lonRad) * SUN_DISTANCE
    );
  }

  setDirection(0);

  return { group: sunGroup, setDirection };
}
