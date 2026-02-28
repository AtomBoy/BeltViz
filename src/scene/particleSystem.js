/**
 * src/scene/particleSystem.js
 *
 * Van Allen belt particle visualization using guiding-center drift.
 *
 * Particles are represented as point sprites (THREE.Points) with additive
 * blending so overlapping particles accumulate brightness, naturally showing
 * dense ring-current regions.
 *
 * Physics summary:
 *   - Particles live on drift shells defined by (L, phi, lambdaM).
 *   - Each frame phi advances by driftRate × dt (visual time scale).
 *   - Bounce motion (N–S along field lines) is represented by a static spread
 *     in lambdaM up to the mirror latitude — not animated, since drift is the
 *     physically meaningful ring-current motion.
 *   - Dst from solar wind data drives injection rate and target L-range.
 *   - Loss is modelled as a first-order decay with L-dependent lifetime.
 *
 * Visual time scale:
 *   VISUAL_DRIFT_SCALE converts physics drift rates (rad/sim-second) to
 *   visual rates (rad/real-second). Calibrated so electrons at L=4, E=1 MeV
 *   complete one orbit in ~10 real seconds regardless of the sim time scale.
 */

import * as THREE from 'three';
import {
  ELECTRON, PROTON,
  driftRate, injectionRate, injectionLRange,
} from '../physics/particleDrift.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_PARTICLES = 2000;

// Physics: L=4, E=1 MeV electron drift period = 1.05/(4×1) h ≈ 945 s.
// Visual target: ~2.5 min per orbit → scale = 945 / 150 = 6.3
const VISUAL_DRIFT_SCALE = 6.3;

// Baseline new particles per real second at quiet conditions (Dst ≥ −20 nT).
// After the initial burst this tops up the pool gradually.
const BASE_INJECT_RATE = 20;

// On first enable, inject this fraction of maxCount immediately so particles
// appear right away rather than trickling in over many seconds.
const BURST_FRACTION = 0.35;

// Birth flash: new particles briefly glow bright to mark their injection point.
// Flash fades linearly over FLASH_DURATION seconds.
const FLASH_DURATION = 3.0;  // seconds
const FLASH_PEAK     = 5.0;  // additional brightness multiplier at birth (so 6× base)

// Loss lifetimes in real seconds (tuned for aesthetics).
// Shorter at outer L shells; inner belt is very long-lived.
function realLifetime(L) {
  if (L < 2) return 90;   // inner belt — slow loss
  if (L < 4) return 45;   // outer belt main body
  return 25;               // outer belt fringe — fast loss
}

// Default proton energy for the 'both' species mode.
const PROTON_ENERGY_MEV = 30;

// Particle colours by species (additive-blend friendly — stay dim individually)
const COL_ELECTRON = new THREE.Color(0x3399ff); // blue-white
const COL_PROTON   = new THREE.Color(0xff6622); // orange-red

// ─── GLSL Shaders ─────────────────────────────────────────────────────────────

const VERTEX_SHADER = /* glsl */`
  attribute vec3 particleColor;
  varying   vec3 vColor;
  uniform   float uDPR; // device pixel ratio — ensures 1 CSS pixel minimum on Retina

  void main() {
    vColor = particleColor;
    vec4 mvPos  = modelViewMatrix * vec4(position, 1.0);
    float dist  = max(-mvPos.z, 0.01);
    // Size in CSS pixels, scaled to framebuffer pixels by uDPR.
    // At default zoom (dist ≈ 11 Re) → ~7.5 CSS px; zoomed in (dist ≈ 4) → ~14 CSS px.
    // Minimum 4.5 CSS px ensures the circular soft edge is visible at any zoom.
    gl_PointSize = clamp(15.0 / (dist * 0.18 + 0.05), 4.5, 27.0) * uDPR;
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const FRAGMENT_SHADER = /* glsl */`
  varying vec3 vColor;

  void main() {
    // Radial distance from point centre (0 = centre, 1 = edge).
    float d     = length(gl_PointCoord - vec2(0.5)) * 2.0;
    if (d > 1.0) discard;
    float alpha = pow(1.0 - d, 1.6);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// ─── createParticleSystem ─────────────────────────────────────────────────────

/**
 * Create and return a particle system.
 *
 * @param {THREE.Scene} scene
 * @returns {{ mesh: THREE.Points, update: Function, dispose: Function }}
 */
export function createParticleSystem(scene) {
  // ── CPU-side particle state ─────────────────────────────────────────────────
  const pL         = new Float32Array(MAX_PARTICLES); // L-shell
  const pPhi       = new Float32Array(MAX_PARTICLES); // azimuthal angle (rad)
  const pLambdaM   = new Float32Array(MAX_PARTICLES); // bounce latitude (rad) — stored for reference only
  const pDriftRate = new Float32Array(MAX_PARTICLES); // visual drift rate (rad/real-s)
  const pLifetime  = new Float32Array(MAX_PARTICLES); // real-second e-fold lifetime
  const pAge       = new Float32Array(MAX_PARTICLES); // seconds since injection (for flash)
  const pAlive     = new Uint8Array(MAX_PARTICLES);   // 0 = dead slot
  // Precomputed lambdaM-dependent constants (set at inject time, constant for particle lifetime):
  //   pRCosL[i]  = L × cos³(λ_m)          — x,z position multiplier
  //   pYConst[i] = L × cos²(λ_m) × sin(λ_m) — y position (invariant)
  // Reduces per-frame trig from 4 calls to 2 (only cos/sin of phi needed each frame).
  const pRCosL  = new Float32Array(MAX_PARTICLES);
  const pYConst = new Float32Array(MAX_PARTICLES);

  // ── GPU attribute arrays ────────────────────────────────────────────────────
  const posArr = new Float32Array(MAX_PARTICLES * 3); // x,y,z scene units
  const colArr = new Float32Array(MAX_PARTICLES * 3); // r,g,b [0-1]

  const geometry = new THREE.BufferGeometry();
  const posAttr  = new THREE.BufferAttribute(posArr, 3);
  const colAttr  = new THREE.BufferAttribute(colArr, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  colAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', posAttr);
  geometry.setAttribute('particleColor', colAttr);
  geometry.setDrawRange(0, MAX_PARTICLES);
  // Pre-set bounding sphere so Three.js never auto-computes it from particle data.
  // Outer belt max L ≈ 5.5 Re; 7 Re gives a safe margin.
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 7);

  const material = new THREE.ShaderMaterial({
    vertexShader:   VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    uniforms: {
      uDPR: { value: window.devicePixelRatio ?? 1 },
    },
    transparent:    true,
    depthWrite:     false,
    blending:       THREE.AdditiveBlending,
    // The custom color attribute is named 'particleColor' (not 'color') because
    // Three.js r163+ reserves the 'color' attribute name internally and will not
    // bind it as a custom attribute even without vertexColors: true.
  });

  const mesh = new THREE.Points(geometry, material);
  mesh.frustumCulled = false; // particles are always within view
  scene.add(mesh);

  let aliveCount  = 0;
  let injectAccum = 0;    // fractional injection accumulator
  let wasEnabled  = false; // tracks enable transition for burst injection
  let nextFreeHint = 0;   // linear scan hint — avoids O(n) from slot 0 every time

  // ── inject: place one new particle ─────────────────────────────────────────

  function inject(speciesCode, energyMeV, lMin, lMax, sunLonRad = 0) {
    // Find a dead slot, starting from where we left off.
    let slot = -1;
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const idx = (nextFreeHint + i) % MAX_PARTICLES;
      if (!pAlive[idx]) { slot = idx; nextFreeHint = (idx + 1) % MAX_PARTICLES; break; }
    }
    if (slot === -1) return; // pool full

    const L = lMin + Math.random() * (lMax - lMin);
    // Inject from the nightside (midnight sector ± 90°).
    // Real storm injection occurs when magnetotail plasma-sheet particles are
    // driven inward on the nightside — centred on the anti-solar direction.
    // phi=0 is subsolar; sun sits at phi_sun = -sunLonRad, so nightside = π - sunLonRad.
    const nightsidePhi = Math.PI - sunLonRad;
    const phi = nightsidePhi + (Math.random() - 0.5) * Math.PI;
    // Spread bounce latitude along field line, mostly near equator.
    // Mirror latitude (dipole) ≈ arccos(1/√L).
    const maxLambda = Math.acos(Math.sqrt(1 / Math.max(L, 1))) * 0.65;
    const lambdaM   = (Math.random() - 0.5) * 2 * maxLambda;

    const rate = driftRate(L, energyMeV, speciesCode) * VISUAL_DRIFT_SCALE;
    const life = realLifetime(L);

    // Precompute lambdaM constants (these never change for this particle).
    const cosLM   = Math.cos(lambdaM);
    const rEq     = L * cosLM * cosLM;

    pL[slot]         = L;
    pPhi[slot]       = phi;
    pLambdaM[slot]   = lambdaM;
    pRCosL[slot]     = rEq * cosLM;           // L × cos³(λ_m)
    pYConst[slot]    = rEq * Math.sin(lambdaM); // L × cos²(λ_m) × sin(λ_m)
    pDriftRate[slot] = rate;
    pLifetime[slot]  = life;
    pAge[slot]       = 0;     // reset age so flash fires on birth
    pAlive[slot]     = 1;
    aliveCount++;

    // Base colour — will be overwritten each frame by the drift loop with flash.
    const col = speciesCode === ELECTRON ? COL_ELECTRON : COL_PROTON;
    colArr[slot * 3]     = col.r;
    colArr[slot * 3 + 1] = col.g;
    colArr[slot * 3 + 2] = col.b;
  }

  // Pick a species code based on which populations are enabled.
  function pickSpecies(showElectrons, showProtons) {
    if (showElectrons && showProtons) return Math.random() < 0.5 ? ELECTRON : PROTON;
    if (showElectrons) return ELECTRON;
    return PROTON; // showProtons only (caller guards against both false)
  }

  // ── update: called every frame ──────────────────────────────────────────────

  /**
   * @param {number} dt            Real elapsed time since last frame (seconds, capped at 0.1)
   * @param {object|null} swParams Solar wind params (may be null if disabled)
   * @param {object} pParams       params.particles { enabled, showElectrons, showProtons, count, energyMeV }
   * @param {number} [playSpeed]   Current timeline playback speed (sim-s per real-s). Default 1.
   */
  function update(dt, swParams, pParams, playSpeed = 1) {
    if (!pParams.enabled) {
      mesh.visible = false;
      wasEnabled = false; // reset so next enable gets a fresh burst
      return;
    }
    mesh.visible = true;

    const dst           = swParams?.dst        ?? 0;
    const sunLonRad     = swParams?.sunLonRad  ?? 0;
    const showElectrons = pParams.showElectrons ?? true;
    const showProtons   = pParams.showProtons   ?? true;
    const canInject     = showElectrons || showProtons;
    const energy        = pParams.energyMeV ?? 1.0;

    // Scale down particle count at high playback speeds to keep frame rate smooth.
    // Field line rebuilds are expensive; fewer GPU uploads help during fast playback.
    //   ≤ 60×  → full count
    //   3600×  → 25%
    //   86400× → 10%
    const speedTier = playSpeed >= 86400 ? 0.10 : playSpeed >= 3600 ? 0.25 : 1.0;
    const maxCount  = Math.max(50, Math.floor(Math.min(pParams.count ?? 800, MAX_PARTICLES) * speedTier));

    // ── Burst injection on first enable ───────────────────────────────────
    // Inject a fraction of maxCount immediately so particles are visible
    // right away rather than trickling in over tens of seconds.
    if (!wasEnabled) {
      wasEnabled = true;
      if (canInject) {
        const { lMin, lMax } = injectionLRange(dst);
        const burstTarget = Math.floor(maxCount * BURST_FRACTION);
        while (aliveCount < burstTarget) {
          const sp = pickSpecies(showElectrons, showProtons);
          const E  = sp === PROTON ? PROTON_ENERGY_MEV : energy;
          inject(sp, E, lMin, lMax, sunLonRad);
        }
      }
      injectAccum = 0;
    }

    // ── Steady-state injection ─────────────────────────────────────────────
    const rate = injectionRate(dst) * BASE_INJECT_RATE;
    if (canInject) {
      injectAccum += rate * dt;
      while (injectAccum >= 1 && aliveCount < maxCount) {
        injectAccum -= 1;
        const { lMin, lMax } = injectionLRange(dst);
        const sp = pickSpecies(showElectrons, showProtons);
        const E  = sp === PROTON ? PROTON_ENERGY_MEV : energy;
        inject(sp, E, lMin, lMax, sunLonRad);
      }
      if (injectAccum > rate) injectAccum = 0; // pool full — reset accumulator
    }

    // ── Drift, ageing, loss ────────────────────────────────────────────────
    // Track whether any GPU data changed this frame to avoid pointless uploads.
    let dirtyPos = false;
    let dirtyCol = false;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (!pAlive[i]) continue; // dead slots stay at (0,0,0) from last zero-on-death

      // First-order decay: probability of loss this frame
      if (Math.random() < 1 - Math.exp(-dt / pLifetime[i])) {
        pAlive[i] = 0;
        aliveCount--;
        colArr[i * 3] = colArr[i * 3 + 1] = colArr[i * 3 + 2] = 0;
        posArr[i * 3] = posArr[i * 3 + 1] = posArr[i * 3 + 2] = 0;
        dirtyPos = dirtyCol = true;
        continue;
      }

      // Advance azimuthal angle
      pPhi[i] = (pPhi[i] + pDriftRate[i] * dt) % (Math.PI * 2);

      // Write GPU position using precomputed lambdaM constants (2 trig calls vs 4).
      const cosPhi = Math.cos(pPhi[i]);
      const sinPhi = Math.sin(pPhi[i]);
      posArr[i * 3]     =  pRCosL[i] * cosPhi;
      posArr[i * 3 + 1] =  pYConst[i];
      posArr[i * 3 + 2] = -pRCosL[i] * sinPhi;
      dirtyPos = true;

      // Birth flash: newly injected particles glow bright, fading to base colour.
      pAge[i] += dt;
      const flash      = pAge[i] < FLASH_DURATION
        ? FLASH_PEAK * (1 - pAge[i] / FLASH_DURATION)
        : 0;
      const brightness = 1.0 + flash;
      const baseCol    = pDriftRate[i] >= 0 ? COL_ELECTRON : COL_PROTON;
      colArr[i * 3]     = baseCol.r * brightness;
      colArr[i * 3 + 1] = baseCol.g * brightness;
      colArr[i * 3 + 2] = baseCol.b * brightness;
      dirtyCol = true;
    }

    if (dirtyPos) {
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true; // upload colors on any frame with live particles (born or moved)
    } else if (dirtyCol) {
      colAttr.needsUpdate = true; // upload colors on death-only frames
    }

  }

  // ── dispose ─────────────────────────────────────────────────────────────────

  function dispose() {
    scene.remove(mesh);
    geometry.dispose();
    material.dispose();
  }

  return { mesh, update, dispose };
}
