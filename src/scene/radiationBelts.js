import * as THREE from 'three';

// Loss-cone latitude limits for trapped particle populations.
// Particles with mirror points inside the atmosphere are lost; the surviving
// population is confined to much narrower latitudes than the full L-shell surface.
//   Inner belt (L ≈ 1.2–2.0): loss cone ≈ ±38° magnetic latitude
//   Outer belt (L ≈ 3.0–6.0): loss cone ≈ ±28° magnetic latitude
const INNER_LAT_LIMIT = 38 * Math.PI / 180;
const OUTER_LAT_LIMIT = 28 * Math.PI / 180;

/**
 * Radiation belt definitions.
 * Each belt is defined by inner/outer L-shell boundaries, particle loss-cone
 * latitude limit, and display properties.
 */
export const BELT_DEFINITIONS = [
  {
    name: 'innerBelt',
    label: 'Inner Belt',
    lMin: 1.2,
    lMax: 2.0,
    latLimit: INNER_LAT_LIMIT,
    color: new THREE.Color(0.9, 0.4, 0.1), // warm orange/red
    opacity: 0.12,
  },
  {
    name: 'outerBelt',
    label: 'Outer Belt',
    lMin: 3.0,
    lMax: 5.0,
    latLimit: OUTER_LAT_LIMIT,
    color: new THREE.Color(0.0, 0.75, 0.75), // teal/cyan
    opacity: 0.08,
  },
];

/**
 * Build vertex positions for a single radiation belt using the analytic dipole
 * field-line formula. The belt is a toroid bounded by two L-shell surfaces and
 * capped at ±latLimit magnetic latitude.
 *
 * Dipole field-line geometry at L-shell L, magnetic latitude λ:
 *   ρ (equatorial distance) = L · cos³(λ)   [Earth radii = scene units]
 *   y (northward)           = L · cos²(λ) · sin(λ)
 *
 * Cross-section profile (closed loop in the meridional half-plane):
 *   inner L-shell from south lat to north lat  (nLat+1 points)
 *   outer L-shell from north lat to south lat  (nLat+1 points)
 * The connecting segments (top cap: inner-north→outer-north,
 * bottom cap: outer-south→inner-south) are implicit — they are the profile
 * "gaps" closed by the modular index wrapping in buildDipoleBeltIndices().
 */
function buildDipoleBeltPositions(lMin, lMax, latLimitRad, nLat, nAz) {
  const profile = [];
  // Inner boundary is the fixed lMin L-shell throughout — it defines the concave
  // inner face of the belt (Earth-side). Outer boundary tapers from lMax at the
  // equator to lMin at ±latLimit where the two surfaces meet and close the tip.
  // This produces a D-shaped / crescent cross-section: no waist, no pinch.
  // taper(λ) = cos(π/2 · |λ|/latLimit) — 1 at equator, 0 at limits.
  const taper = (lambda) => Math.cos((Math.PI / 2) * Math.abs(lambda) / latLimitRad);

  // Inner L-shell: fixed at lMin, south lat → north lat
  for (let i = 0; i <= nLat; i++) {
    const lambda = -latLimitRad + (2 * latLimitRad * i) / nLat;
    const c = Math.cos(lambda);
    const s = Math.sin(lambda);
    profile.push(lMin * c * c * c, lMin * c * c * s);
  }

  // Outer L-shell: tapers lMax→lMin, north lat → south lat (reversed for closed loop)
  for (let i = nLat; i >= 0; i--) {
    const lambda = -latLimitRad + (2 * latLimitRad * i) / nLat;
    const lEff = lMin + (lMax - lMin) * taper(lambda);
    const c = Math.cos(lambda);
    const s = Math.sin(lambda);
    profile.push(lEff * c * c * c, lEff * c * c * s);
  }

  // profile is now a flat array of [rho, yNorth] pairs, length = 2*(nLat+1)
  const nP = profile.length / 2; // number of profile points
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
 * Generates quads for the full ring including the two cap segments (the profile
 * "gap" between inner-north and outer-north, and outer-south and inner-south)
 * by wrapping with (iP + 1) % nP.
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
 * @param {number}  [options.opacity]          - overrides per-belt default
 * @param {number}  [options.sunDirX=1]        - sun direction X (scene coords)
 * @param {number}  [options.sunDirZ=0]        - sun direction Z (scene coords)
 * @param {number}  [options.stormIntensity=0] - [0,1] for outer belt deformation
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
  } = options;

  const group = new THREE.Group();
  const nLat = 80;
  const nAz  = 120;

  for (const def of BELT_DEFINITIONS) {
    const show = (def.name === 'innerBelt' && showInnerBelt) ||
                 (def.name === 'outerBelt' && showOuterBelt);
    if (!show) continue;

    const { positions, nP } = buildDipoleBeltPositions(def.lMin, def.lMax, def.latLimit, nLat, nAz);

    // Storm-time radial deformation for outer belt (inner belt is stable).
    if (def.name === 'outerBelt' && stormIntensity > 0.01) {
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
      transparent: true,
      opacity: opacity ?? def.opacity,
      depthWrite: false,
      side: THREE.DoubleSide,
      roughness: 0.55,
      metalness: 0.0,
      clippingPlanes,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = def.name === 'innerBelt' ? 10 : 11;
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
 * to the sun direction. Only used for the outer belt — the inner belt (CRAND
 * protons) is stable and does not deform meaningfully.
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

/**
 * Update opacity on all radiation belt meshes.
 */
export function updateBeltOpacity(group, opacity) {
  if (!group) return;
  group.traverse((obj) => {
    if (obj.material && obj.material.opacity !== undefined) {
      obj.material.opacity = opacity;
    }
  });
}

/**
 * Update radiation belt material properties to encode particle flux intensity.
 *
 * Called from main.js animate() loop with smoothly-lerped flux values so that
 * belt appearance changes are gradual rather than jarring.
 *
 * The existing updateBeltOpacity() GUI slider still works — it is the user's
 * overall brightness knob. flux modulates within the range it implies.
 *
 * Inner belt (CRAND protons): relatively stable opacity, modest glow variation.
 * Outer belt (storm electrons): wider opacity range, color shifts blue→blue-white
 *   at high flux (representing dense relativistic electron population).
 *
 * @param {THREE.Group} group - radiationBeltGroup from buildRadiationBeltGroup()
 * @param {{ innerFlux: number, outerFlux: number }} flux - normalized [0, 1] values
 * @param {number} baseOpacity - current params.beltOpacity (user's global knob, 0–1)
 */
export function updateBeltFlux(group, flux, baseOpacity) {
  if (!group) return;
  // Scale factor: beltOpacity default is 0.15; normalise so slider works as before.
  const opacityScale = baseOpacity / 0.15;

  group.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;
    const name = obj.userData.beltName;

    if (name === 'innerBelt') {
      // Inner belt: opacity range [0.06, 0.16], glow range [0.08, 0.22]
      // Relatively constant — CRAND is not storm-driven.
      // Emissive kept low so the sun directional light provides visible shading.
      obj.material.opacity = Math.min(1, (0.06 + 0.10 * flux.innerFlux) * opacityScale);
      obj.material.emissiveIntensity = 0.08 + 0.14 * flux.innerFlux;
      // Colour stays warm orange — no hue shift for stable inner belt.

    } else if (name === 'outerBelt') {
      // Outer belt: opacity range [0.03, 0.23], glow range [0.05, 0.22]
      // Highly dynamic — electrons surge during storms.
      // Emissive kept low so diffuse lighting gives 3D definition; night side
      // remains visible from ambient (0x333344, 0.5) + low emissive floor.
      obj.material.opacity = Math.min(1, (0.03 + 0.20 * flux.outerFlux) * opacityScale);
      obj.material.emissiveIntensity = 0.05 + 0.17 * flux.outerFlux;

      // Colour shift: lerp emissive from base teal [0.0, 0.75, 0.75] toward
      // teal-white [0.5, 1.0, 1.0] as flux rises, representing the denser
      // (brighter) relativistic electron population during storms.
      // Max blend factor 0.7 — keeps recognisably teal even at peak flux.
      const t = flux.outerFlux * 0.7;
      obj.material.emissive.setRGB(
        0.0 + 0.5 * t,
        0.75 + 0.25 * t,
        0.75 + 0.25 * t,
      );
      obj.material.needsUpdate = true;
    }
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
