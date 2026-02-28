/**
 * src/scene/auroraRenderer.js
 *
 * Animated aurora oval at the geomagnetic auroral zone (~67° latitude).
 *
 * The aurora represents radiation belt particles whose pitch angle has fallen
 * below the loss cone and are precipitating into the upper atmosphere along
 * dipole field lines.  The foot of field lines at L ≈ 5–7 maps to ~65–75°
 * geomagnetic latitude — the auroral oval.
 *
 * Geometry: Two thin torus rings (northern + southern hemispheres) rendered
 * with a ShaderMaterial.
 *
 * Shader features:
 *   - Curtain striations: overlapping sin waves in longitude (uTime-driven)
 *   - Altitude colour gradient: green (low) → red-green (high)
 *   - Opacity driven by Dst index (brighter during geomagnetic storms)
 *   - Additive blending: natural brightness accumulation / glow
 */

import * as THREE from 'three';

// ─── Geometry constants ───────────────────────────────────────────────────────

const AURORA_LAT_DEG = 67;
const AURORA_LAT_RAD = AURORA_LAT_DEG * Math.PI / 180;

// Aurora band sits at 1.02 Re — just above Earth's surface (~130 km altitude).
const AURORA_RADIUS_RE = 1.02;

const RING_RADIUS  = AURORA_RADIUS_RE * Math.cos(AURORA_LAT_RAD); // horizontal distance from Y axis
const RING_HEIGHT  = AURORA_RADIUS_RE * Math.sin(AURORA_LAT_RAD); // height above equatorial plane
const TUBE_RADIUS  = 0.03;  // ~190 km half-width — spans 80–300 km altitude range

// ─── GLSL Shaders ─────────────────────────────────────────────────────────────

const VERTEX_SHADER = /* glsl */`
  varying vec3 vWorldPos;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */`
  uniform float uTime;
  uniform float uOpacity;
  varying vec3  vWorldPos;

  void main() {
    if (uOpacity <= 0.0) discard;

    // ── Altitude fraction ────────────────────────────────────────────────
    // r=1.0 = Earth's surface; tube centre at r≈1.02; tube spans ~0.06 Re.
    float r       = length(vWorldPos);
    float altFrac = clamp((r - 0.99) / (TUBE_RADIUS * 2.0), 0.0, 1.0);

    // ── Longitude angle (no discontinuity) ───────────────────────────────
    float angle = atan(-vWorldPos.z, vWorldPos.x);   // range −π … +π, sin-safe

    // ── Curtain striations ────────────────────────────────────────────────
    // Layered sin waves at different spatial and temporal frequencies.
    float s1 = sin(angle * 38.0 + uTime * 0.9);
    float s2 = sin(angle * 19.0 + uTime * 0.4 + 1.3);
    float s3 = sin(angle *  7.0 - uTime * 0.6 + 2.1);
    float striation = 0.50 + 0.28 * s1 + 0.14 * s2 + 0.08 * s3;

    // ── Vertical fade: peaks at mid-altitude, fades at edges ─────────────
    float vertFade = sin(altFrac * 3.14159);

    // ── Colour: green at base, red tinge at top (altitude) ───────────────
    // Real aurora: O I (557.7 nm) green dominant below ~200 km,
    //              O I (630.0 nm) red tinge above ~200 km.
    vec3 col = mix(vec3(0.05, 0.95, 0.25), vec3(0.85, 0.15, 0.05), altFrac * altFrac);

    float alpha = striation * vertFade * uOpacity;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`;

// Replace TUBE_RADIUS in the shader with a numeric literal (GLSL preprocessor
// doesn't know JS constants; we substitute at build time via string replace).
const FRAG_SHADER_COMPILED = FRAGMENT_SHADER.replace(
  'TUBE_RADIUS',
  TUBE_RADIUS.toFixed(6)
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeAuroraGeometry(heightSign) {
  // TorusGeometry lies in XY plane by default (hole faces +Z).
  // After rotateX(π/2) the ring is in the XZ plane (hole faces +Y) — horizontal.
  const geo = new THREE.TorusGeometry(RING_RADIUS, TUBE_RADIUS, 12, 128);
  geo.rotateX(Math.PI / 2);
  geo.translate(0, heightSign * RING_HEIGHT, 0);
  return geo;
}

// ─── createAuroraRenderer ─────────────────────────────────────────────────────

/**
 * Create the aurora oval renderer.
 *
 * @param {THREE.Scene} scene
 * @returns {{ meshes: THREE.Mesh[], update: Function, dispose: Function }}
 */
export function createAuroraRenderer(scene) {
  const uniforms = {
    uTime:    { value: 0 },
    uOpacity: { value: 0 },  // starts invisible
  };

  const material = new THREE.ShaderMaterial({
    vertexShader:   VERTEX_SHADER,
    fragmentShader: FRAG_SHADER_COMPILED,
    uniforms,
    transparent:    true,
    depthWrite:     false,
    blending:       THREE.AdditiveBlending,
    side:           THREE.DoubleSide,
  });

  const northMesh = new THREE.Mesh(makeAuroraGeometry(+1), material);
  const southMesh = new THREE.Mesh(makeAuroraGeometry(-1), material);
  northMesh.frustumCulled = false;
  southMesh.frustumCulled = false;

  scene.add(northMesh);
  scene.add(southMesh);

  const meshes = [northMesh, southMesh];

  // ── update ─────────────────────────────────────────────────────────────────

  /**
   * @param {number} realTimeSec  Total elapsed real time in seconds (for shimmer animation)
   * @param {number} dst          Current Dst index in nT
   * @param {object} auroraParams params.aurora { enabled, opacity }
   */
  function update(realTimeSec, dst, auroraParams) {
    if (!auroraParams.enabled) {
      uniforms.uOpacity.value = 0;
      return;
    }

    uniforms.uTime.value = realTimeSec;

    // Map Dst → target opacity.
    // Quiet (Dst ≥ −20): faint aurora (0.12).
    // Severe storm (Dst ≤ −150): bright aurora (0.85).
    let targetOpacity;
    if (dst >= -20) {
      targetOpacity = 0.12;
    } else if (dst >= -50) {
      targetOpacity = 0.12 + ((-dst - 20) / 30) * 0.18;      // 0.12 → 0.30
    } else if (dst >= -150) {
      targetOpacity = 0.30 + ((-dst - 50) / 100) * 0.40;     // 0.30 → 0.70
    } else {
      targetOpacity = 0.70 + Math.min((-dst - 150) / 100, 1) * 0.15; // 0.70 → 0.85
    }

    // Apply user opacity multiplier
    targetOpacity *= (auroraParams.opacity ?? 1.0);

    // Smooth towards target (soft follow to avoid hard jumps when Dst changes)
    const current = uniforms.uOpacity.value;
    uniforms.uOpacity.value = current + (targetOpacity - current) * 0.05;
  }

  // ── dispose ─────────────────────────────────────────────────────────────────

  function dispose() {
    for (const m of meshes) {
      scene.remove(m);
      m.geometry.dispose();
    }
    material.dispose();
  }

  return { meshes, update, dispose };
}
