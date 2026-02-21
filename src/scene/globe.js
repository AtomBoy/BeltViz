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
 * @returns {{ group: THREE.Group, setDirection: (lonRad: number, decRad?: number) => void }}
 */
export function createSun(scene) {
  const SUN_DISTANCE = 120; // scene units — well beyond the Moon's ~60 Re orbit

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

  /**
   * @param {number} lonRad - Geographic east longitude in radians
   * @param {number} [decRad=0] - Declination (sub-solar latitude) in radians
   */
  function setDirection(lonRad, decRad = 0) {
    const cosD = Math.cos(decRad);
    sunGroup.position.set(
      cosD * Math.cos(lonRad) * SUN_DISTANCE,
      Math.sin(decRad) * SUN_DISTANCE,
      cosD * Math.sin(lonRad) * SUN_DISTANCE
    );
  }

  setDirection(0);

  return { group: sunGroup, setDirection };
}

/**
 * Create a moon representation.
 * Placed at the Moon's true orbital distance (~60 Earth radii).
 * @param {THREE.Scene} scene
 * @returns {{ mesh: THREE.Mesh, setPosition: (lonRad: number, decRad: number, distRe: number) => void, setVisible: (v: boolean) => void }}
 */
export function createMoon(scene) {
  // Moon radius ~0.2727 Earth radii (true ratio)
  const moonGeometry = new THREE.SphereGeometry(0.2727, 32, 32);
  // MeshStandardMaterial so the sun's directional light produces a crescent.
  // emissive floor keeps the dark side faintly visible rather than black.
  const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0x999999,
    roughness: 0.95,
    metalness: 0.0,
    emissive: 0x222222,
    emissiveIntensity: 1.0,
  });
  const moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);

  // Tiny diffuse halo — just enough to pick it out against dark space
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  gradient.addColorStop(0,   'rgba(180, 180, 180, 0.15)');
  gradient.addColorStop(0.6, 'rgba(160, 160, 160, 0.05)');
  gradient.addColorStop(1,   'rgba(140, 140, 140, 0.0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 64, 64);

  const glowTexture = new THREE.CanvasTexture(canvas);
  const glowMaterial = new THREE.SpriteMaterial({
    map: glowTexture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const glow = new THREE.Sprite(glowMaterial);
  glow.scale.set(0.8, 0.8, 1);

  const moonGroup = new THREE.Group();
  moonGroup.add(moonMesh);
  moonGroup.add(glow);
  scene.add(moonGroup);

  /**
   * @param {number} lonRad - Geographic east longitude in radians
   * @param {number} decRad - Declination in radians
   * @param {number} distRe - Distance in Earth radii (scene units)
   */
  function setPosition(lonRad, decRad, distRe) {
    const cosD = Math.cos(decRad);
    moonGroup.position.set(
      cosD * Math.cos(lonRad) * distRe,
      Math.sin(decRad) * distRe,
      cosD * Math.sin(lonRad) * distRe
    );
  }

  function setVisible(v) {
    moonGroup.visible = v;
  }

  return { mesh: moonGroup, setPosition, setVisible };
}
