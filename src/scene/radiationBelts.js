import * as THREE from 'three';

// Latitude limits for the depicted high-flux belt cores.
// The belts are drawn as the HIGH-FLUX CORE regions (where trapped-particle
// flux is near its peak in the AP8/AE8 models — Vette 1991), not the full
// loss-cone-limited trapping envelope. The core populations are more
// equatorially confined than the loss cone alone would allow, which is why
// these limits are narrower than the ±38°/±28° loss-cone values.
//   Inner belt core: ±35° magnetic latitude
//   Outer belt core: ±22° magnetic latitude
const INNER_LAT_LIMIT = 35 * Math.PI / 180;
const OUTER_LAT_LIMIT = 22 * Math.PI / 180;
// Storage ring: narrow, strongly equatorially-confined band of ultra-relativistic
// electrons (Baker et al. 2013 observed a thin ring; ±18° keeps it visually
// distinct from the thicker outer belt it sits just inside of).
const STORAGE_LAT_LIMIT = 18 * Math.PI / 180;

/**
 * Radiation belt definitions.
 * Each belt depicts the high-flux core: inner/outer L-shell boundaries bracket
 * the flux peak rather than the maximum trapping extent.
 *   Inner belt: proton flux (>10 MeV) peaks near L ≈ 1.5 (Selesnick et al. 2014).
 *   Outer belt: electron flux (>1 MeV) peaks at L ≈ 4.0–4.5 (Reeves et al. 2013;
 *   Li & Hudson 2019 review).
 * Particle injection L-ranges in src/physics/particleDrift.js mirror these
 * values — keep them in sync.
 */
export const BELT_DEFINITIONS = [
  {
    name: 'innerBelt',
    label: 'Inner Belt',
    lMin: 1.3,
    lMax: 1.9,
    latLimit: INNER_LAT_LIMIT,
    color: new THREE.Color(0.88, 0.14, 0.06), // crimson (reads NASA-red under full sun + ACES)
    opacity: 0.95, // slider-relative multiplier (see updateBeltFlux)
  },
  {
    name: 'outerBelt',
    label: 'Outer Belt',
    lMin: 3.0,
    lMax: 4.8, // core upper bound; expands to ~5.6 at Kp≥7 (Ganushkina et al. 2011)
    latLimit: OUTER_LAT_LIMIT,
    color: new THREE.Color(0.05, 0.72, 0.72), // bright turquoise (NASA-teal under full sun + ACES)
    opacity: 0.85, // slider-relative multiplier (see updateBeltFlux)
  },
  {
    name: 'storageBelt',
    label: 'Storage Belt (3rd)',
    // Storm-time "storage ring" of ultra-relativistic (>2 MeV) electrons at
    // L ≈ 3.0–3.5 Re, between the inner and outer belts (Baker et al. 2013,
    // Science 340; mechanism in Shprits et al. 2013, Nature Physics 9):
    // ULF radial transport drives electrons inward during the storm main
    // phase, where they are stably trapped because VLF pitch-angle scattering
    // is absent at these L-shells. Rendered as a thin violet ring just inside
    // the outer belt's inner edge; flux thresholds in beltFlux.js.
    lMin: 3.0,
    lMax: 3.5,
    latLimit: STORAGE_LAT_LIMIT,            // ±18°, narrow equatorial ring
    color: new THREE.Color(0.55, 0.0, 0.9), // violet/purple
    opacity: 0.8, // slider-relative multiplier (see updateBeltFlux)
  },
];

/**
 * Build vertex positions for a single radiation belt as a smooth iso-flux-style
 * toroid.
 *
 * The cross-section is a closed, ROUNDED contour — an ellipse in (L, λ_m)
 * space mapped through the dipole field-line geometry:
 *   L(t) = L_mid + L_half·cos(t),  λ(t) = latLimit·sin(t),  t ∈ [0, 2π)
 *   ρ (equatorial distance) = L · cos³(λ)   [Earth radii = scene units]
 *   y (northward)           = L · cos²(λ) · sin(λ)
 *
 * This models an idealized iso-flux contour of the trapped-particle
 * distribution (flux peaks at (L_mid, λ=0) and falls off smoothly in both L
 * and latitude — cf. AP8/AE8 flux maps, Vette 1991). Iso-flux contours are
 * smooth and rounded; bounding the belt by field-line walls with a hard
 * latitude cutoff (the previous approach) produced unphysical sharp cusps at
 * the tips and pushed the inner edge below Earth's surface
 * (r = lMin·cos²λ < 1 at high |λ|). With the ellipse the minimum radius is
 * L_mid·cos²(latLimit) — ≈1.07 Re for the inner belt, safely above the surface.
 *
 * The dipole mapping bends the low-L side of the ellipse around Earth, giving
 * the classic concave-inner-edge crescent cross-section.
 */
function buildDipoleBeltPositions(lMin, lMax, latLimitRad, nLat, nAz) {
  const lMid  = (lMin + lMax) / 2;
  const lHalf = (lMax - lMin) / 2;
  const nP = 2 * nLat; // profile points around the closed contour
  const profile = [];

  for (let i = 0; i < nP; i++) {
    const t = (2 * Math.PI * i) / nP;
    const L = lMid + lHalf * Math.cos(t);
    const lambda = latLimitRad * Math.sin(t);
    const c = Math.cos(lambda);
    const s = Math.sin(lambda);
    profile.push(L * c * c * c, L * c * c * s);
  }

  // profile is a flat array of [rho, yNorth] pairs forming a closed loop
  const positions = new Float32Array((nAz + 1) * nP * 3);

  for (let iAz = 0; iAz <= nAz; iAz++) {
    const phi = (2 * Math.PI * iAz) / nAz;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);

    for (let iP = 0; iP < nP; iP++) {
      const rho = profile[iP * 2];
      const yN  = profile[iP * 2 + 1];
      const base = (iAz * nP + iP) * 3;
      positions[base]     = rho * cosPhi;
      positions[base + 1] = yN;
      positions[base + 2] = rho * sinPhi;
    }
  }

  return { positions, nP };
}

/**
 * Build triangle indices for a revolved belt profile.
 * The profile is a closed loop, so quads wrap end-to-end with (iP + 1) % nP.
 */
function buildDipoleBeltIndices(nP, nAz) {
  const indices = [];
  for (let iAz = 0; iAz < nAz; iAz++) {
    for (let iP = 0; iP < nP; iP++) {
      const iP1 = (iP + 1) % nP;
      const a = iAz * nP + iP;
      const b = iAz * nP + iP1;
      const c = (iAz + 1) * nP + iP;
      const d = (iAz + 1) * nP + iP1;
      indices.push(a, c, b);
      indices.push(b, c, d);
    }
  }
  return new Uint32Array(indices);
}

/**
 * Build a Three.js Group containing radiation belt meshes.
 *
 * Uses analytic dipole geometry (no marching cubes, no web worker) to produce
 * smooth closed toroids bounded by the loss-cone latitude limits. The outer belt
 * is optionally deformed for storm-time solar wind asymmetry.
 *
 * @param {object} options
 * @param {boolean} [options.showInnerBelt=true]
 * @param {boolean} [options.showOuterBelt=true]
 * @param {Array}   [options.clippingPlanes=[]]
 * @param {number}  [options.opacity=0.85]     - user slider value; multiplied by per-belt opacity factor
 * @param {number}  [options.sunDirX=1]        - sun direction X (scene coords)
 * @param {number}  [options.sunDirZ=0]        - sun direction Z (scene coords)
 * @param {number}  [options.stormIntensity=0] - [0,1] for outer belt deformation
 * @param {number}  [options.kp=0]             - Kp index [0-9] for dynamic outer belt lMax
 * @returns {THREE.Group}
 */
export function buildRadiationBeltGroup(options = {}) {
  const {
    showInnerBelt = true,
    showOuterBelt = true,
    clippingPlanes = [],
    opacity,
    sunDirX = 1,
    sunDirZ = 0,
    stormIntensity = 0,
    kp = 0,
  } = options;

  const group = new THREE.Group();
  const nLat = 80;
  const nAz  = 120;

  for (const def of BELT_DEFINITIONS) {
    const show = (def.name === 'innerBelt'   && showInnerBelt) ||
                 (def.name === 'outerBelt'   && showOuterBelt) ||
                 (def.name === 'storageBelt' && showOuterBelt);
    if (!show) continue;

    // Outer belt lMax expands during active conditions (Ganushkina et al. 2011):
    // Kp=3 → 5.0 Re, Kp=5 → 5.4 Re, Kp≥7 → 5.8 Re
    const effectiveLMax = def.name === 'outerBelt'
      ? def.lMax + Math.min(0.8, Math.max(0, (kp - 3) / 4) * 0.8)
      : def.lMax;

    const { positions, nP } = buildDipoleBeltPositions(def.lMin, effectiveLMax, def.latLimit, nLat, nAz);

    // Storm-time radial deformation for the outer and storage belts.
    // The inner belt (CRAND protons, L < 2) sits deep in the dipole and does
    // not deform. The storage belt's FLUX is stable (no VLF scattering losses)
    // but its GEOMETRY at L = 6–8.5 is shaped by the external field like the
    // outer belt's — deforming both with the same radial scale also preserves
    // the gap between them (the storm-expanded outer belt would otherwise
    // stretch through the rigid storage belt on the nightside).
    if ((def.name === 'outerBelt' || def.name === 'storageBelt') && stormIntensity > 0.01) {
      applyStormDeformation({ positions }, sunDirX, sunDirZ, stormIntensity);
    }

    const indexData = buildDipoleBeltIndices(nP, nAz);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setIndex(new THREE.BufferAttribute(indexData, 1));
    geometry.computeVertexNormals();

    const material = new THREE.MeshPhysicalMaterial({
      color: def.color,
      emissive: def.color,
      emissiveIntensity: 0.15,
      transparent: true, // always transparent so opacity can animate without shader recompiles
      opacity: (opacity ?? 0.85) * def.opacity,
      depthWrite: false, // updated per-frame in updateBeltFlux based on effective opacity
      side: THREE.DoubleSide, // interior surface visible at clip cuts
      roughness: 0.4,
      clearcoat: 0.3,
      clearcoatRoughness: 0.35,
      metalness: 0.0,
      clippingPlanes,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = def.name === 'innerBelt' ? 10 : def.name === 'outerBelt' ? 11 : 12;
    mesh.userData.beltName = def.name;
    group.add(mesh);
  }

  return group;
}

/**
 * Dispose all geometry and materials in a radiation belt group.
 */
export function disposeRadiationBeltGroup(group) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
  });
}

/**
 * Apply storm-time radial deformation to a marching-cubes surface in place.
 *
 * During geomagnetic storms the outer belt is compressed on the dayside
 * (solar wind ram pressure) and stretched on the nightside. The deformation
 * is a per-vertex radial scale based on the vertex's azimuthal angle relative
 * to the sun direction. Used for the outer and storage belts — the inner belt
 * (CRAND protons, deep in the dipole) does not deform meaningfully.
 *
 * @param {{ positions: Float32Array }} surface - vertex positions mutated in place
 * @param {number} sunDirX - X component of normalized sun direction (scene coords)
 * @param {number} sunDirZ - Z component of normalized sun direction (scene coords)
 * @param {number} stormIntensity - [0, 1]; 0 = quiet, 1 = severe (|Dst| >= 150 nT)
 * @param {number} [maxDeform=0.22] - max fractional compression/expansion
 */
export function applyStormDeformation(surface, sunDirX, sunDirZ, stormIntensity, maxDeform = 0.22) {
  if (stormIntensity < 0.01) return;
  const pos = surface.positions;
  for (let i = 0, n = pos.length / 3; i < n; i++) {
    const px = pos[3 * i];
    const py = pos[3 * i + 1];
    const pz = pos[3 * i + 2];
    // Use the equatorial projection to determine dayside/nightside angle.
    const eq = Math.sqrt(px * px + pz * pz);
    const cosAngle = eq > 1e-6 ? (px * sunDirX + pz * sunDirZ) / eq : 0;
    // scale < 1 on dayside (compressed), > 1 on nightside (stretched)
    const scale = 1 - stormIntensity * maxDeform * cosAngle;
    pos[3 * i]     = px * scale;
    pos[3 * i + 1] = py * scale;
    pos[3 * i + 2] = pz * scale;
  }
}

// Above this effective opacity a belt is "solid enough" that writing depth gives
// correct occlusion; below it, depthWrite would visibly clip other transparent
// layers (particles, fainter belts) and is left off as before.
const DEPTH_WRITE_OPACITY_THRESHOLD = 0.55;

/**
 * Update radiation belt material properties to encode particle flux intensity.
 *
 * Called from main.js animate() loop with smoothly-lerped flux values so that
 * belt appearance changes are gradual rather than jarring.
 *
 * baseOpacity (the GUI slider) is the target opacity itself: at the default
 * 0.85 the belts render as solid NASA-illustration-style tori; low values
 * (~0.1–0.3) give translucent belts so particles, satellites, and field lines
 * remain visible through them. Flux primarily modulates brightness/emissive —
 * the storm signal is carried by glow and color whitening, not by fading.
 *
 * Inner belt (CRAND protons): stable — modest glow variation only.
 * Outer belt (storm electrons): emissive surges and shifts teal→teal-white
 *   at high flux (representing dense relativistic electron population).
 *
 * @param {THREE.Group} group - radiationBeltGroup from buildRadiationBeltGroup()
 * @param {{ innerFlux: number, outerFlux: number }} flux - normalized [0, 1] values
 * @param {number} baseOpacity - current params.beltOpacity (user's global knob, 0–1)
 */
export function updateBeltFlux(group, flux, baseOpacity) {
  if (!group) return;

  group.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;
    const name = obj.userData.beltName;

    if (name === 'innerBelt') {
      // Stable CRAND source: near-constant opacity, modest glow variation.
      // Emissive kept low so the sun directional light provides visible shading.
      obj.material.opacity = Math.min(1, baseOpacity * (0.95 + 0.05 * flux.innerFlux));
      obj.material.emissiveIntensity = 0.12 + 0.18 * flux.innerFlux;
      // Colour stays warm orange — no hue shift for stable inner belt.

    } else if (name === 'outerBelt') {
      // Storm-driven electrons: brightness surges with flux while opacity stays
      // near the slider value. Night side remains visible from ambient
      // (0x333344, 0.5) + the emissive floor.
      obj.material.opacity = Math.min(1, baseOpacity * (0.85 + 0.15 * flux.outerFlux));
      obj.material.emissiveIntensity = 0.10 + 0.30 * flux.outerFlux;

      // Colour shift: lerp emissive from base turquoise [0.05, 0.72, 0.72]
      // toward teal-white [0.55, 1.0, 1.0] as flux rises, representing the
      // denser (brighter) relativistic electron population during storms.
      // Max blend factor 0.7 — keeps recognisably teal even at peak flux.
      const t = flux.outerFlux * 0.7;
      obj.material.emissive.setRGB(
        0.05 + 0.5 * t,
        0.72 + 0.28 * t,
        0.72 + 0.28 * t,
      );
      obj.material.needsUpdate = true;

    } else if (name === 'storageBelt') {
      // Storage (third) belt: completely invisible at quiet conditions; fades in
      // during geomagnetic storms as storageBeltFlux rises above zero.
      // Colour shifts from violet [0.55, 0.0, 0.9] toward bright violet-white
      // at peak flux, distinguishing ultra-relativistic electrons (>2 MeV) from
      // the teal outer belt electrons.
      // Baker et al. 2013 (Science), Shprits et al. 2013 (Nature Physics).
      const sf = flux.storageBeltFlux ?? 0;
      obj.material.opacity = Math.min(1, baseOpacity * 0.9 * sf);
      obj.material.emissiveIntensity = 0.08 + 0.30 * sf;
      const t = sf * 0.6;
      obj.material.emissive.setRGB(
        0.55 + 0.45 * t,
        0.0  + 0.6  * t,
        0.9  + 0.1  * t,
      );
      obj.material.needsUpdate = true;
    }

    // Solid belts write depth for correct occlusion; translucent ones don't.
    // depthWrite is render state — no shader recompile / needsUpdate required.
    obj.material.depthWrite = obj.material.opacity > DEPTH_WRITE_OPACITY_THRESHOLD;
  });
}

/**
 * Update clipping planes on all radiation belt meshes.
 */
export function updateBeltClipping(group, clippingPlanes) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.material) {
      obj.material.clippingPlanes = clippingPlanes;
      obj.material.needsUpdate = true;
    }
  });
}
