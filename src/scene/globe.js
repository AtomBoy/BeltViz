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
 * Create a simple starfield background.
 */
export function createStarfield(scene) {
  const count = 2000;
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Random points on a large sphere
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 200 + Math.random() * 300;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.5,
    sizeAttenuation: true,
  });

  const stars = new THREE.Points(geometry, material);
  scene.add(stars);
  return stars;
}
