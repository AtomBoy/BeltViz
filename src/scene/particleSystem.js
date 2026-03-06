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
 *
 * Four physically distinct populations are simulated:
 *
 *   (A) Inner belt protons (L = 1.2–2.0) — CRAND source:
 *     Cosmic Ray Albedo Neutron Decay: galactic cosmic rays hit the upper
 *     atmosphere → neutrons → decay to protons in flight. Source is constant,
 *     azimuthally uniform, and independent of solar wind. Drift WESTWARD.
 *     Long-lived (300–600 s visual). Orange.
 *
 *   (B) Inner belt electrons (L = 1.5–2.0) — inward diffusion:
 *     Electrons diffuse inward from the outer belt and accumulate in the outer
 *     portion of the inner belt. Constant slow trickle, azimuthally uniform.
 *     Drift EASTWARD — visibly faster than the colocated protons.
 *     Moderate lifetime (~120 s visual). Blue.
 *     Combined with (A), the inner belt appears warm-white from additive mixing.
 *
 *   (C) Outer belt electrons (L = 3.0–6.0) — storm injection:
 *     Electrons injected from the nightside plasma sheet during substorms and
 *     storms. Rate and L-range driven by Dst. Short-lived (25–45 s). Blue.
 *
 *   (D) Ring current protons (L = 1.5–4.5) — storm injection:
 *     Protons injected alongside electrons from the nightside plasma sheet.
 *     The ring current (which CAUSES the Dst depression we measure) is primarily
 *     carried by these 10–300 keV protons. Representative energy 10 MeV used
 *     for visual drift rates. Nightside injection, Dst-driven. Drift WESTWARD.
 *     Moderate lifetime (~35–45 s). Orange.
 *
 *   Slot region (L = 2.0–3.0) is normally empty of ELECTRONS. Protons can
 *   exist in the slot — only electrons are blocked there until extreme storms.
 *
 * Visual time scale:
 *   VISUAL_DRIFT_SCALE converts physics drift rates (rad/sim-second) to
 *   visual rates (rad/real-second). Calibrated so electrons at L=4, E=1 MeV
 *   complete one orbit in ~2.5 min regardless of the sim time scale.
 */

import * as THREE from 'three';
import {
  ELECTRON, PROTON,
  driftRate, injectionRate,
  outerBeltLRange, crandInjectionRate, innerBeltLRange, innerBeltLifetime,
  innerBeltElectronRate, innerBeltElectronLRange, ringCurrentLRange,
} from '../physics/particleDrift.js';

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_PARTICLES = 2000;

// Physics: L=4, E=1 MeV electron drift period = 1.05/(4×1) h ≈ 945 s.
// Visual target: ~2.5 min per orbit → scale = 945 / 150 = 6.3
const VISUAL_DRIFT_SCALE = 6.3;

// Baseline outer belt electrons per real second at quiet conditions (Dst ≥ −20 nT).
const BASE_INJECT_RATE = 20;

// Ring current proton base rate: ~20% of outer electron rate.
// Ring current protons coexist with outer electrons, slightly weighted lower.
const BASE_RING_CURRENT_RATE = 4;

// On first enable, inject these fractions of maxCount immediately.
const BURST_CRAND_PROTON    = 0.20; // inner belt protons (CRAND)
const BURST_INNER_ELECTRON  = 0.07; // inner belt electrons (diffusion)
const BURST_OUTER_ELECTRON  = 0.30; // outer belt electrons (storm)
const BURST_RING_PROTON     = 0.05; // ring current protons

// Birth flash: new particles briefly glow bright to mark their injection point.
const FLASH_DURATION = 3.0;  // seconds
const FLASH_PEAK     = 5.0;  // additional brightness multiplier at birth (so 6× base)

// Slot region protection for ELECTRONS only.
// Real slot (L = 2–3) is empty of electrons in quiet conditions; protons exist freely.
const SLOT_L_MIN = 2.0;
const SLOT_L_MAX = 3.0;
const SLOT_DST_THRESHOLD = -100; // nT — slot fills with electrons below this Dst

// Representative energies for each population.
// CRAND protons: 30 MeV (high-energy inner belt protons from cosmic-ray cascade).
// Inner electrons: 1 MeV (similar to outer belt electrons — diffuse inward without energy loss).
// Ring current protons: 10 MeV representative for visual drift rates.
//   (Real ring current protons are 10–300 keV — too low-energy to drift perceptibly
//    at these visual scales, so we use a higher representative energy that preserves
//    the qualitative physics: protons drift westward, more slowly than electrons.)
const CRAND_PROTON_ENERGY_MEV        = 30;
const INNER_ELECTRON_ENERGY_MEV      = 1.0;
const RING_CURRENT_PROTON_ENERGY_MEV = 10;

// Visual lifetime for inner belt electrons and ring current protons.
// Inner electrons: moderate (longer than outer electrons, shorter than CRAND protons).
const INNER_ELECTRON_LIFETIME = 120; // seconds

// Representative mean lifetimes for budget computation (Little's Law: N_steady = rate × τ).
// These are averages across each population's L-range, used only for budget allocation.
const AVG_CRAND_LIFETIME          = 450; // innerBeltLifetime midpoint at L ≈ 1.6
const AVG_INNER_ELECTRON_LIFETIME = 120; // equals INNER_ELECTRON_LIFETIME (constant)
const AVG_OUTER_ELECTRON_LIFETIME =  35; // mix: 45s (L < 4) + 25s (L ≥ 4)
const AVG_RING_PROTON_LIFETIME    =  40; // skewed lower-L vs outer electrons → slightly longer

// Particle colours by species (additive-blend friendly)
const COL_ELECTRON = new THREE.Color(0x3399ff); // blue-white (electrons)
const COL_PROTON   = new THREE.Color(0xff6622); // orange-red (protons)

// ─── Budget computation (Little's Law) ────────────────────────────────────────

/**
 * Compute per-population particle budget for the current solar wind conditions.
 *
 * At steady state N_i = rate_i × τ_i (Little's Law). Each population's share of
 * maxCount is proportional to this weight. Budgets always sum exactly to maxCount.
 *
 * When showProtons or showElectrons is false, those populations get zero budget;
 * the remaining species expand to fill the pool proportionally.
 *
 * @param {number} maxCount       Total particle pool size for this frame
 * @param {number} dst            Dst index in nT (drives outer injection rates)
 * @param {boolean} showElectrons Whether electron populations (B, C) are enabled
 * @param {boolean} showProtons   Whether proton populations (A, D) are enabled
 * @returns {{ budgetA, budgetB, budgetC, budgetD }}
 */
function computeBudgets(maxCount, dst, showElectrons, showProtons) {
  const mult = injectionRate(dst);
  const wA = showProtons   ? crandInjectionRate()          * AVG_CRAND_LIFETIME          : 0;
  const wB = showElectrons ? innerBeltElectronRate()       * AVG_INNER_ELECTRON_LIFETIME : 0;
  const wC = showElectrons ? mult * BASE_INJECT_RATE       * AVG_OUTER_ELECTRON_LIFETIME : 0;
  const wD = showProtons   ? mult * BASE_RING_CURRENT_RATE * AVG_RING_PROTON_LIFETIME    : 0;
  const total = wA + wB + wC + wD;
  if (total === 0) return { budgetA: 0, budgetB: 0, budgetC: 0, budgetD: 0 };
  const budgetA = Math.floor(maxCount * wA / total);
  const budgetB = Math.floor(maxCount * wB / total);
  const budgetD = Math.floor(maxCount * wD / total);
  // C gets the remainder so budgets sum exactly to maxCount (no rounding gap).
  const budgetC = Math.max(0, maxCount - budgetA - budgetB - budgetD);
  return { budgetA, budgetB, budgetC, budgetD };
}

// ─── Lifetime helpers ─────────────────────────────────────────────────────────

function outerBeltRealLifetime(L) {
  if (L < 4) return 45;
  return 25;
}

// ─── GLSL Shaders ─────────────────────────────────────────────────────────────

const VERTEX_SHADER = /* glsl */`
  attribute vec3 particleColor;
  varying   vec3 vColor;
  uniform   float uDPR;

  void main() {
    vColor = particleColor;
    vec4 mvPos  = modelViewMatrix * vec4(position, 1.0);
    float dist  = max(-mvPos.z, 0.01);
    gl_PointSize = clamp(15.0 / (dist * 0.18 + 0.05), 4.5, 27.0) * uDPR;
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const FRAGMENT_SHADER = /* glsl */`
  varying vec3 vColor;

  void main() {
    float d     = length(gl_PointCoord - vec2(0.5)) * 2.0;
    if (d > 1.0) discard;
    float alpha = pow(1.0 - d, 1.6);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// ─── createParticleSystem ─────────────────────────────────────────────────────

/**
 * @param {THREE.Scene} scene
 * @returns {{ mesh: THREE.Points, update: Function, dispose: Function }}
 */
export function createParticleSystem(scene) {
  // ── CPU-side particle state ─────────────────────────────────────────────────
  const pL         = new Float32Array(MAX_PARTICLES);
  const pPhi       = new Float32Array(MAX_PARTICLES);
  const pLambdaM   = new Float32Array(MAX_PARTICLES);
  const pDriftRate = new Float32Array(MAX_PARTICLES);
  const pLifetime  = new Float32Array(MAX_PARTICLES);
  const pAge       = new Float32Array(MAX_PARTICLES);
  const pAlive     = new Uint8Array(MAX_PARTICLES);
  const pPop       = new Uint8Array(MAX_PARTICLES); // population: 0=A, 1=B, 2=C, 3=D
  // Precomputed lambdaM constants — reduces per-frame trig from 4 to 2 calls.
  const pRCosL  = new Float32Array(MAX_PARTICLES); // L × cos³(λ_m)
  const pYConst = new Float32Array(MAX_PARTICLES); // L × cos²(λ_m) × sin(λ_m)

  // ── GPU attribute arrays ────────────────────────────────────────────────────
  const posArr = new Float32Array(MAX_PARTICLES * 3);
  const colArr = new Float32Array(MAX_PARTICLES * 3);

  const geometry = new THREE.BufferGeometry();
  const posAttr  = new THREE.BufferAttribute(posArr, 3);
  const colAttr  = new THREE.BufferAttribute(colArr, 3);
  posAttr.setUsage(THREE.DynamicDrawUsage);
  colAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', posAttr);
  geometry.setAttribute('particleColor', colAttr);
  geometry.setDrawRange(0, MAX_PARTICLES);
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 7);

  const material = new THREE.ShaderMaterial({
    vertexShader:   VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
    uniforms: { uDPR: { value: window.devicePixelRatio ?? 1 } },
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });

  const mesh = new THREE.Points(geometry, material);
  mesh.frustumCulled = false;
  scene.add(mesh);

  let aliveCount        = 0;
  let aliveA            = 0; // (A) CRAND protons
  let aliveB            = 0; // (B) inner belt electrons
  let aliveC            = 0; // (C) outer belt electrons
  let aliveD            = 0; // (D) ring current protons
  let innerProtonAccum  = 0; // (A) CRAND inner belt protons
  let innerElectronAccum= 0; // (B) inner belt electrons
  let outerElectronAccum= 0; // (C) outer belt electrons
  let outerProtonAccum  = 0; // (D) ring current protons
  let wasEnabled        = false;
  let nextFreeHint      = 0;

  // ── Shared slot finder ──────────────────────────────────────────────────────

  function findSlot() {
    for (let i = 0; i < MAX_PARTICLES; i++) {
      const idx = (nextFreeHint + i) % MAX_PARTICLES;
      if (!pAlive[idx]) { nextFreeHint = (idx + 1) % MAX_PARTICLES; return idx; }
    }
    return -1;
  }

  // ── Shared low-level injector ───────────────────────────────────────────────

  function placeParticle(slot, L, phi, speciesCode, energyMeV, lifetime, col, pop) {
    const maxLambda = Math.acos(Math.sqrt(1 / Math.max(L, 1))) * 0.35;
    const lambdaM   = (Math.random() - 0.5) * 2 * maxLambda;
    const rate      = driftRate(L, energyMeV, speciesCode) * VISUAL_DRIFT_SCALE;
    const cosLM     = Math.cos(lambdaM);
    const rEq       = L * cosLM * cosLM;

    pL[slot]         = L;
    pPhi[slot]       = phi;
    pLambdaM[slot]   = lambdaM;
    pRCosL[slot]     = rEq * cosLM;
    pYConst[slot]    = rEq * Math.sin(lambdaM);
    pDriftRate[slot] = rate;
    pLifetime[slot]  = lifetime;
    pAge[slot]       = 0;
    pAlive[slot]     = 1;
    pPop[slot]       = pop;
    aliveCount++;
    if      (pop === 0) aliveA++;
    else if (pop === 1) aliveB++;
    else if (pop === 2) aliveC++;
    else                aliveD++;

    colArr[slot * 3]     = col.r;
    colArr[slot * 3 + 1] = col.g;
    colArr[slot * 3 + 2] = col.b;
  }

  // ── (A) Inner belt CRAND protons ────────────────────────────────────────────

  function injectInner() {
    const slot = findSlot();
    if (slot === -1) return;
    const { lMin, lMax } = innerBeltLRange();
    const L   = lMin + Math.random() * (lMax - lMin);
    const phi = Math.random() * Math.PI * 2; // uniform — CRAND is azimuthally symmetric
    placeParticle(slot, L, phi, PROTON, CRAND_PROTON_ENERGY_MEV, innerBeltLifetime(L), COL_PROTON, 0);
  }

  // ── (B) Inner belt electrons — inward diffusion ─────────────────────────────

  function injectInnerElectron() {
    const slot = findSlot();
    if (slot === -1) return;
    const { lMin, lMax } = innerBeltElectronLRange();
    const L   = lMin + Math.random() * (lMax - lMin);
    const phi = Math.random() * Math.PI * 2; // uniform — diffusion is azimuthally symmetric
    placeParticle(slot, L, phi, ELECTRON, INNER_ELECTRON_ENERGY_MEV, INNER_ELECTRON_LIFETIME, COL_ELECTRON, 1);
  }

  // ── (C) Outer belt electrons — storm injection ──────────────────────────────

  function injectOuter(energyMeV, sunLonRad, dst) {
    const { lMin, lMax } = outerBeltLRange(dst);
    const L = lMin + Math.random() * (lMax - lMin);

    // Slot protection: electrons are excluded from L = 2.0–3.0 during moderate conditions.
    // Baker et al. (2004): slot fills via inward diffusion only in extreme storms.
    if (L >= SLOT_L_MIN && L <= SLOT_L_MAX && dst > SLOT_DST_THRESHOLD) return;

    const slot = findSlot();
    if (slot === -1) return;

    // Nightside injection (anti-solar direction ± 90°).
    const phi = (Math.PI - sunLonRad) + (Math.random() - 0.5) * Math.PI;
    placeParticle(slot, L, phi, ELECTRON, energyMeV, outerBeltRealLifetime(L), COL_ELECTRON, 2);
  }

  // ── (D) Ring current protons — storm injection ──────────────────────────────

  function injectOuterProton(sunLonRad, dst) {
    const { lMin, lMax } = ringCurrentLRange(dst);
    const L = lMin + Math.random() * (lMax - lMin);
    // No slot guard — protons can freely occupy the slot region.

    const slot = findSlot();
    if (slot === -1) return;

    // Same nightside injection as electrons: plasma sheet injects both species.
    const phi = (Math.PI - sunLonRad) + (Math.random() - 0.5) * Math.PI;
    placeParticle(slot, L, phi, PROTON, RING_CURRENT_PROTON_ENERGY_MEV, outerBeltRealLifetime(L), COL_PROTON, 3);
  }

  // ── update: called every frame ──────────────────────────────────────────────

  /**
   * @param {number} dt            Real elapsed time since last frame (seconds, capped 0.1)
   * @param {object|null} swParams Solar wind params (null if disabled)
   * @param {object} pParams       { enabled, showElectrons, showProtons, count, energyMeV }
   * @param {number} [playSpeed]   Timeline playback speed. Default 1.
   */
  function update(dt, swParams, pParams, playSpeed = 1) {
    if (!pParams.enabled) {
      mesh.visible = false;
      wasEnabled = false;
      return;
    }
    mesh.visible = true;

    const dst           = swParams?.dst        ?? 0;
    const sunLonRad     = swParams?.sunLonRad  ?? 0;
    const stormIntensity = Math.min(1, Math.abs(dst) / 150);
    const sunDirX        = Math.cos(sunLonRad);
    const sunDirZ        = Math.sin(sunLonRad);
    const showElectrons = pParams.showElectrons ?? true;
    const showProtons   = pParams.showProtons   ?? true;
    const energy        = pParams.energyMeV ?? 1.0;

    const maxCount  = Math.max(50, Math.min(pParams.count ?? 800, MAX_PARTICLES));

    // ── Per-population budgets (Little's Law) ───────────────────────────────
    // Each population's steady-state count = rate × mean_lifetime. Budgets are
    // computed once per frame from current Dst and sum exactly to maxCount.
    const { budgetA, budgetB, budgetC, budgetD } =
      computeBudgets(maxCount, dst, showElectrons, showProtons);

    // ── Burst on first enable ────────────────────────────────────────────────
    if (!wasEnabled) {
      wasEnabled = true;

      if (showProtons) {
        // (A) CRAND protons — pre-fill 20% of their budget
        for (let n = 0; n < Math.floor(budgetA * BURST_CRAND_PROTON); n++) injectInner();
        // (D) Ring current protons — pre-fill 5% of their budget
        for (let n = 0; n < Math.floor(budgetD * BURST_RING_PROTON); n++) injectOuterProton(sunLonRad, dst);
      }
      if (showElectrons) {
        // (B) Inner belt electrons — pre-fill 7% of their budget
        for (let n = 0; n < Math.floor(budgetB * BURST_INNER_ELECTRON); n++) injectInnerElectron();
        // (C) Outer belt electrons — pre-fill 30% of their budget
        for (let n = 0; n < Math.floor(budgetC * BURST_OUTER_ELECTRON); n++) injectOuter(energy, sunLonRad, dst);
      }

      innerProtonAccum = innerElectronAccum = outerElectronAccum = outerProtonAccum = 0;
    }

    // ── Steady-state injection ───────────────────────────────────────────────
    // Each population injects only while below its own budget. findSlot() === -1
    // is kept as a safety guard in case rounding produces a budget overshoot.

    if (showProtons) {
      // (A) CRAND protons — constant rate, independent of Dst
      innerProtonAccum += crandInjectionRate() * dt;
      while (innerProtonAccum >= 1 && aliveA < budgetA) {
        innerProtonAccum -= 1;
        injectInner();
      }
      if (innerProtonAccum > crandInjectionRate()) innerProtonAccum = 0;

      // (D) Ring current protons — storm-driven
      const rcRate = injectionRate(dst) * BASE_RING_CURRENT_RATE;
      outerProtonAccum += rcRate * dt;
      while (outerProtonAccum >= 1 && aliveD < budgetD) {
        outerProtonAccum -= 1;
        injectOuterProton(sunLonRad, dst);
      }
      if (outerProtonAccum > rcRate) outerProtonAccum = 0;
    }

    if (showElectrons) {
      // (B) Inner belt electrons — constant trickle from inward diffusion
      innerElectronAccum += innerBeltElectronRate() * dt;
      while (innerElectronAccum >= 1 && aliveB < budgetB) {
        innerElectronAccum -= 1;
        injectInnerElectron();
      }
      if (innerElectronAccum > innerBeltElectronRate()) innerElectronAccum = 0;

      // (C) Outer belt electrons — storm-driven, dominates during active periods
      const outerRate = injectionRate(dst) * BASE_INJECT_RATE;
      outerElectronAccum += outerRate * dt;
      while (outerElectronAccum >= 1 && aliveC < budgetC) {
        outerElectronAccum -= 1;
        injectOuter(energy, sunLonRad, dst);
      }
      if (outerElectronAccum > outerRate) outerElectronAccum = 0;
    }

    // ── Drift, ageing, loss ──────────────────────────────────────────────────
    let dirtyPos = false;
    let dirtyCol = false;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (!pAlive[i]) continue;

      if (Math.random() < 1 - Math.exp(-dt / pLifetime[i])) {
        pAlive[i] = 0;
        aliveCount--;
        const p = pPop[i];
        if      (p === 0) aliveA--;
        else if (p === 1) aliveB--;
        else if (p === 2) aliveC--;
        else              aliveD--;
        colArr[i * 3] = colArr[i * 3 + 1] = colArr[i * 3 + 2] = 0;
        posArr[i * 3] = posArr[i * 3 + 1] = posArr[i * 3 + 2] = 0;
        dirtyPos = dirtyCol = true;
        continue;
      }

      pPhi[i] = (pPhi[i] + pDriftRate[i] * dt) % (Math.PI * 2);

      const cosPhi = Math.cos(pPhi[i]);
      const sinPhi = Math.sin(pPhi[i]);
      let px =  pRCosL[i] * cosPhi;
      let py =  pYConst[i];
      let pz = -pRCosL[i] * sinPhi;
      // Apply storm-time dayside compression / nightside stretching to outer
      // belt populations (C = outer electrons, D = ring current protons).
      // Same formula as applyStormDeformation() in radiationBelts.js.
      if (stormIntensity > 0.01 && pPop[i] >= 2) {
        const eq = pRCosL[i];
        if (eq > 1e-6) {
          const cosAngle = (px * sunDirX + pz * sunDirZ) / eq;
          const scale = 1 - stormIntensity * 0.22 * cosAngle;
          px *= scale; py *= scale; pz *= scale;
        }
      }
      posArr[i * 3]     = px;
      posArr[i * 3 + 1] = py;
      posArr[i * 3 + 2] = pz;
      dirtyPos = true;

      pAge[i] += dt;
      const flash      = pAge[i] < FLASH_DURATION ? FLASH_PEAK * (1 - pAge[i] / FLASH_DURATION) : 0;
      const brightness = 1.0 + flash;
      const baseCol    = pDriftRate[i] >= 0 ? COL_ELECTRON : COL_PROTON;
      colArr[i * 3]     = baseCol.r * brightness;
      colArr[i * 3 + 1] = baseCol.g * brightness;
      colArr[i * 3 + 2] = baseCol.b * brightness;
      dirtyCol = true;
    }

    if (dirtyPos) {
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
    } else if (dirtyCol) {
      colAttr.needsUpdate = true;
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
