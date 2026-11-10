import * as THREE from 'three';
import {
  FLUX_LEVELS,
  ATM_R0,
  ATM_R1,
  BELT_PROFILES,
  resolveBeltProfile,
  isoFluxContour,
} from '../physics/beltProfile.js';

/**
 * Radiation belt rendering — NASA-style flux maps.
 *
 * Each belt is drawn from the analytic flux-shape model in
 * src/physics/beltProfile.js, f(L, λ) ∈ [0, 1]:
 *
 *   • SHELLS — three nested iso-flux surfaces per belt (halo / core / peak
 *     levels), each the meridional iso-contour of f revolved about the dipole
 *     axis. The outer shells are translucent, so an uncut belt reads as a
 *     glowing volume that gets hotter toward its core.
 *
 *   • CUT FACES — when a clipping plane is active, a quad in that plane is
 *     shaded by evaluating the same f(L, λ) per fragment and colour-mapping
 *     it. This fills the cross-section with the flux gradient (cf. NASA SVS
 *     30470) instead of exposing hollow shells.
 *
 * Two colour modes:
 *   'flux' — one rainbow colormap shared by all belts (blue edge → red core)
 *   'belt' — each belt keeps its own hue (red inner, teal outer, violet
 *            storage ring), shading dark edge → bright core
 *
 * The "core" level is calibrated to the cited high-flux core ranges (see
 * BELT_PROFILES); the halo shows the wider trapped region around it.
 */

/** Maximum fractional storm compression/stretch (see applyStormDeformation). */
export const STORM_MAX_DEFORM = 0.22;

/**
 * Per-belt rendering definitions. Shape parameters live in BELT_PROFILES
 * (physics); lMin/lMax here are the quiet-time core range, kept for callers
 * that want the headline numbers.
 */
export const BELT_DEFINITIONS = [
  {
    name: 'innerBelt',
    label: 'Inner Belt',
    lMin: BELT_PROFILES.innerBelt.coreMin,
    lMax: BELT_PROFILES.innerBelt.coreMax,
    color: new THREE.Color(0.88, 0.14, 0.06), // crimson
    opacity: 0.95, // slider-relative multiplier (see updateBeltFlux)
    deforms: false, // CRAND protons deep in the dipole: no storm deformation
  },
  {
    name: 'outerBelt',
    label: 'Outer Belt',
    lMin: BELT_PROFILES.outerBelt.coreMin,
    lMax: BELT_PROFILES.outerBelt.coreMax, // expands to ~5.6 at Kp≥7 (Ganushkina et al. 2011)
    color: new THREE.Color(0.05, 0.72, 0.72), // turquoise
    opacity: 0.85,
    deforms: true,
  },
  {
    name: 'storageBelt',
    label: 'Storage Belt (3rd)',
    // Storm-time "storage ring" of ultra-relativistic (>2 MeV) electrons at
    // L ≈ 3.0–3.5 Re (Baker et al. 2013, Science 340; Shprits et al. 2013,
    // Nature Physics 9). Fades in with storageBeltFlux (beltFlux.js); while it
    // is present the outer belt's inner edge retreats, opening a second slot.
    lMin: BELT_PROFILES.storageBelt.coreMin,
    lMax: BELT_PROFILES.storageBelt.coreMax,
    color: new THREE.Color(0.55, 0.0, 0.9), // violet
    opacity: 0.8,
    deforms: true, // shares the outer belt's radial scale so the gap between them is preserved
  },
];

/**
 * Nested shells, innermost (hottest) first.
 *
 * Shells are drawn unlit with view-dependent opacity (see SHELL_FRAGMENT):
 * `faceAlpha` is the opacity where the surface faces the camera; toward the
 * silhouette it rises to 1. A translucent shell is therefore nearly invisible
 * face-on (the hotter shells show through) and forms a coloured rim at its
 * edge — so an uncut belt reads as a glowing volume, blue at the outside and
 * hot in the middle, consistent with the flux map on a cut face.
 *
 * `tint` is the flux value used to colour the shell: representative of the
 * band it encloses rather than its (cooler) boundary level.
 */
const SHELLS = [
  { key: 'peak', level: FLUX_LEVELS.peak, tint: 0.95, faceAlpha: 1.0,  rimPower: 1.0, renderOrder: 10 },
  { key: 'core', level: FLUX_LEVELS.core, tint: 0.62, faceAlpha: 0.20, rimPower: 2.0, renderOrder: 11 },
  { key: 'halo', level: FLUX_LEVELS.halo, tint: 0.22, faceAlpha: 0.06, rimPower: 2.5, renderOrder: 12 },
];

// ── Colormaps (single source for JS shells and the GLSL cut face) ───────────

/**
 * Rainbow flux colormap stops [t, r, g, b] in display (sRGB) space.
 * Modelled on NASA's Van Allen belt cross-sections: thin blue rim, broad
 * green band, yellow → orange → red core.
 */
const RAINBOW_STOPS = [
  [0.00, 0.06, 0.08, 0.62],
  [0.14, 0.10, 0.28, 0.92],
  [0.26, 0.05, 0.72, 0.88],
  [0.38, 0.22, 0.80, 0.26],
  [0.56, 0.62, 0.86, 0.16],
  [0.68, 0.99, 0.90, 0.10],
  [0.82, 0.99, 0.52, 0.06],
  [1.00, 0.88, 0.08, 0.05],
];

/** Rainbow colormap, JS side. Writes display-space RGB into `out`. */
function rainbowDisplay(t, out) {
  const s = RAINBOW_STOPS;
  const x = Math.min(1, Math.max(0, t));
  let i = 1;
  while (i < s.length - 1 && x > s[i][0]) i++;
  const a = s[i - 1];
  const b = s[i];
  const u = (x - a[0]) / (b[0] - a[0]);
  out[0] = a[1] + u * (b[1] - a[1]);
  out[1] = a[2] + u * (b[2] - a[2]);
  out[2] = a[3] + u * (b[3] - a[3]);
  return out;
}

/** GLSL source for the same rainbow colormap, generated from RAINBOW_STOPS. */
function rainbowGlsl() {
  const f = (v) => v.toFixed(4);
  const s = RAINBOW_STOPS;
  let src = 'vec3 rainbow(float t) {\n  t = clamp(t, 0.0, 1.0);\n';
  src += `  vec3 c = vec3(${f(s[0][1])}, ${f(s[0][2])}, ${f(s[0][3])});\n`;
  for (let i = 1; i < s.length; i++) {
    src += `  c = mix(c, vec3(${f(s[i][1])}, ${f(s[i][2])}, ${f(s[i][3])}), ` +
           `clamp((t - ${f(s[i - 1][0])}) / ${f(s[i][0] - s[i - 1][0])}, 0.0, 1.0));\n`;
  }
  return src + '  return c;\n}\n';
}

// 'belt' colour mode ramp: edge darkening and peak whitening (JS + GLSL).
const BELT_RAMP_DARK = 0.4;
const BELT_RAMP_WHITEN = 0.3;

/**
 * Per-belt hue ramp ('belt' colour mode): dark at the halo edge, the belt's
 * hue at the core level, whitened toward the peak. Display-space RGB.
 * The GLSL `beltRamp` in the cut-face shader mirrors this.
 */
function beltRampDisplay(hue, f, out) {
  const s1 = smooth01((f - FLUX_LEVELS.halo) / (FLUX_LEVELS.core - FLUX_LEVELS.halo));
  const s2 = smooth01((f - FLUX_LEVELS.core) / (1 - FLUX_LEVELS.core));
  const h = [hue.r, hue.g, hue.b];
  for (let i = 0; i < 3; i++) {
    const dark = h[i] * BELT_RAMP_DARK;
    const mid = dark + s1 * (h[i] - dark);
    out[i] = mid + s2 * BELT_RAMP_WHITEN * (1 - mid);
  }
  return out;
}

/** A belt's hue in display (sRGB) space; def.color is in linear working space. */
const _displayHues = new Map();
function displayHue(def) {
  let hue = _displayHues.get(def.name);
  if (!hue) {
    hue = def.color.clone().convertLinearToSRGB();
    _displayHues.set(def.name, hue);
  }
  return hue;
}

function smooth01(x) {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
}

/**
 * Display-space colour of a belt at relative flux value `f` for a colour mode.
 * Written into `target` (a THREE.Vector3 used as a shader uniform).
 */
const _rgb = [0, 0, 0];
function fluxColor(def, f, colorMode, target) {
  if (colorMode === 'belt') beltRampDisplay(displayHue(def), f, _rgb);
  else rainbowDisplay(f, _rgb);
  return target.set(_rgb[0], _rgb[1], _rgb[2]);
}

// ── Shell geometry ──────────────────────────────────────────────────────────

/**
 * Revolve a closed meridional contour about the dipole (Y) axis.
 * @param {Float64Array} contour flat (ρ, y) pairs, closed loop
 * @param {number} nAz azimuthal segments
 */
function revolveContour(contour, nAz) {
  const nP = contour.length / 2;
  const positions = new Float32Array((nAz + 1) * nP * 3);
  for (let iAz = 0; iAz <= nAz; iAz++) {
    const phi = (2 * Math.PI * iAz) / nAz;
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    for (let iP = 0; iP < nP; iP++) {
      const rho = contour[iP * 2];
      const base = (iAz * nP + iP) * 3;
      positions[base]     = rho * cosPhi;
      positions[base + 1] = contour[iP * 2 + 1];
      positions[base + 2] = rho * sinPhi;
    }
  }
  return { positions, nP };
}

/**
 * Triangle indices for a revolved closed profile (quads wrap with (iP+1) % nP).
 */
function buildRevolvedIndices(nP, nAz) {
  const indices = new Uint32Array(nAz * nP * 6);
  let k = 0;
  for (let iAz = 0; iAz < nAz; iAz++) {
    for (let iP = 0; iP < nP; iP++) {
      const iP1 = (iP + 1) % nP;
      const a = iAz * nP + iP;
      const b = iAz * nP + iP1;
      const c = (iAz + 1) * nP + iP;
      const d = (iAz + 1) * nP + iP1;
      indices[k++] = a; indices[k++] = c; indices[k++] = b;
      indices[k++] = b; indices[k++] = c; indices[k++] = d;
    }
  }
  return indices;
}

// ── Shell shader ────────────────────────────────────────────────────────────

const SHELL_VERTEX = /* glsl */ `
  #include <clipping_planes_pars_vertex>
  varying vec3 vNormalView;
  varying vec3 vViewDir;
  void main() {
    #include <begin_vertex>
    #include <project_vertex>
    #include <clipping_planes_vertex>
    vNormalView = normalMatrix * normal;
    vViewDir = -mvPosition.xyz;
  }
`;

const SHELL_FRAGMENT = /* glsl */ `
  #include <clipping_planes_pars_fragment>
  varying vec3 vNormalView;
  varying vec3 vViewDir;
  uniform vec3  uColor;      // display-space RGB
  uniform float uOpacity;
  uniform float uFaceAlpha;  // opacity where the surface faces the camera
  uniform float uRimPower;
  void main() {
    #include <clipping_planes_fragment>
    float ndv = abs(dot(normalize(vNormalView), normalize(vViewDir)));
    float rim = pow(1.0 - ndv, uRimPower);
    float alpha = uOpacity * mix(uFaceAlpha, 1.0, rim);
    // Slight darkening toward the silhouette keeps a sense of 3D form.
    gl_FragColor = vec4(uColor * (0.78 + 0.22 * ndv), alpha);
  }
`;

function createShellMaterial(shell, clippingPlanes) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Vector3(1, 1, 1) },
      uOpacity: { value: 1 },
      uFaceAlpha: { value: shell.faceAlpha },
      uRimPower: { value: shell.rimPower },
    },
    vertexShader: SHELL_VERTEX,
    fragmentShader: SHELL_FRAGMENT,
    transparent: true, // always transparent so opacity can animate without shader recompiles
    depthWrite: false, // updated per-frame in updateBeltFlux based on effective opacity
    side: THREE.DoubleSide,
    clipping: true,
    clippingPlanes,
    toneMapped: false,
  });
}

// ── Cut-face shader ─────────────────────────────────────────────────────────

const CUT_FACE_HALF_SIZE = 10; // Re — covers the storm-stretched outer halo

const CUT_FACE_VERTEX = /* glsl */ `
  #include <clipping_planes_pars_vertex>
  varying vec3 vWorld;
  void main() {
    #include <begin_vertex>
    vWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;
    #include <project_vertex>
    #include <clipping_planes_vertex>
  }
`;

// Mirrors beltFluxAt() in src/physics/beltProfile.js — change them together.
const CUT_FACE_FRAGMENT = /* glsl */ `
  #include <clipping_planes_pars_fragment>
  varying vec3 vWorld;

  uniform mat4  uWorldToDipole;
  uniform vec2  uSunDir;        // sun direction (x, z) in the belt frame
  uniform float uStorm;         // storm intensity [0, 1]
  uniform vec4  uShapeA[3];     // lPeak, wIn, pIn, wOut
  uniform vec4  uShapeB[3];     // pOut, k, enabled, deforms
  uniform float uGain[3];       // colour gain from current flux
  uniform float uAlpha[3];      // per-belt fade (storage ring fades in)
  uniform vec3  uHue[3];        // 'belt' mode hues (display space)
  uniform float uColorMode;     // 0 = rainbow flux, 1 = per-belt hue
  uniform float uOpacity;

  const float HALO = ${FLUX_LEVELS.halo.toFixed(4)};
  const float CORE = ${FLUX_LEVELS.core.toFixed(4)};
  const float LN2  = 0.6931472;

  ${rainbowGlsl()}

  vec3 beltRamp(vec3 hue, float f) {
    float s1 = smoothstep(HALO, CORE, f);
    float s2 = smoothstep(CORE, 1.0, f);
    vec3 mid = mix(hue * ${BELT_RAMP_DARK.toFixed(4)}, hue, s1);
    return mid + s2 * ${BELT_RAMP_WHITEN.toFixed(4)} * (vec3(1.0) - mid);
  }

  float beltFlux(int i, vec3 p) {
    vec4 A = uShapeA[i];
    vec4 B = uShapeB[i];
    if (B.z < 0.5) return 0.0;
    vec3 q = p;
    if (B.w > 0.5) {
      // Undo applyStormDeformation(): a radial scale that depends on azimuth only.
      float eq = length(p.xz);
      float cosA = eq > 1e-6 ? dot(p.xz, uSunDir) / eq : 0.0;
      q = p / (1.0 - uStorm * ${STORM_MAX_DEFORM.toFixed(4)} * cosA);
    }
    float r = length(q);
    if (r < 1e-4) return 0.0;
    float s = q.y / r;
    float c2 = max(1.0 - s * s, 1e-5);
    float L = r / c2;
    float d = L - A.x;
    float x = d < 0.0 ? -d / A.y : d / A.w;
    float pw = d < 0.0 ? A.z : B.x;
    float g = exp(-LN2 * pow(max(x, 0.0), pw));
    float h = (c2 * c2 * c2) / sqrt(4.0 - 3.0 * c2);
    float atm = smoothstep(${ATM_R0.toFixed(4)}, ${ATM_R1.toFixed(4)}, r);
    return g * pow(h, B.y) * atm;
  }

  // Colour + coverage of one belt at this fragment (rgb, a).
  vec4 shade(int i, vec3 p) {
    float f = beltFlux(i, p);
    float e = max(fwidth(f), 1e-4);
    float cover = smoothstep(HALO - e, HALO + e, f) * uAlpha[i];
    vec3 col = uColorMode < 0.5
      ? rainbow(f * uGain[i])
      : beltRamp(uHue[i], f) * (0.75 + 0.25 * uGain[i]);
    return vec4(col, cover);
  }

  void main() {
    #include <clipping_planes_fragment>
    vec3 p = (uWorldToDipole * vec4(vWorld, 1.0)).xyz;

    vec4 inner   = shade(0, p);
    vec4 outer   = shade(1, p);
    vec4 storage = shade(2, p);

    // Inner and outer belts never overlap; take whichever covers this point.
    vec4 base = outer.a > inner.a ? outer : inner;
    // The storage ring composites over the outer belt while it fades in.
    float a = storage.a + base.a * (1.0 - storage.a);
    if (a < 0.01) discard;
    vec3 col = (storage.rgb * storage.a + base.rgb * base.a * (1.0 - storage.a)) / a;
    gl_FragColor = vec4(col, a * uOpacity);
  }
`;

function createCutFaceMaterial(uniforms) {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: CUT_FACE_VERTEX,
    fragmentShader: CUT_FACE_FRAGMENT,
    transparent: true,
    depthWrite: true,
    side: THREE.DoubleSide,
    clipping: true,
    toneMapped: false,
  });
}

const _zAxis = new THREE.Vector3(0, 0, 1);

/** Place a cut-face quad on its clipping plane. */
function orientCutFace(mesh, plane) {
  mesh.quaternion.setFromUnitVectors(_zAxis, plane.normal);
  mesh.position.copy(plane.normal).multiplyScalar(-plane.constant);
}

/**
 * (Re)build the cut-face quads for the active clipping planes.
 * Each face is clipped by every active plane except its own.
 */
function syncCutFaces(group, clippingPlanes) {
  const faces = group.userData.cutFaceGroup;
  const uniforms = group.userData.cutFaceUniforms;
  if (!faces || !uniforms) return;

  while (faces.children.length > clippingPlanes.length) {
    const mesh = faces.children[faces.children.length - 1];
    faces.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  }
  while (faces.children.length < clippingPlanes.length) {
    const size = 2 * CUT_FACE_HALF_SIZE;
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), createCutFaceMaterial(uniforms));
    mesh.renderOrder = 9; // before the translucent shells
    mesh.userData.isBeltCutFace = true;
    faces.add(mesh);
  }
  clippingPlanes.forEach((plane, i) => {
    const mesh = faces.children[i];
    orientCutFace(mesh, plane);
    mesh.material.clippingPlanes = clippingPlanes.filter((p) => p !== plane);
    mesh.material.needsUpdate = true;
  });
}

// ── Public API ──────────────────────────────────────────────────────────────

/**
 * Build a Three.js Group containing the radiation belts.
 *
 * Structure:  root (identity) ─┬─ shells (rotated to the dipole axis)
 *                              └─ cut faces (world-aligned to the clip planes)
 *
 * @param {object} options
 * @param {boolean} [options.showInnerBelt=true]
 * @param {boolean} [options.showOuterBelt=true]  also controls the storage ring
 * @param {Array}   [options.clippingPlanes=[]]
 * @param {number}  [options.opacity=0.85]        user slider value
 * @param {number}  [options.sunDirX=1]           sun direction X (scene coords)
 * @param {number}  [options.sunDirZ=0]           sun direction Z (scene coords)
 * @param {number}  [options.stormIntensity=0]    [0,1] outer/storage deformation
 * @param {number}  [options.kp=0]                Kp index — outer belt expansion
 * @param {number}  [options.storageFlux=0]       [0,1] — opens the second slot
 * @param {'flux'|'belt'} [options.colorMode='flux']
 * @param {THREE.Quaternion} [options.dipoleQuaternion] rotation Y → dipole axis
 * @returns {THREE.Group}
 */
export function buildRadiationBeltGroup(options = {}) {
  const {
    showInnerBelt = true,
    showOuterBelt = true,
    clippingPlanes = [],
    opacity = 0.85,
    sunDirX = 1,
    sunDirZ = 0,
    stormIntensity = 0,
    kp = 0,
    storageFlux = 0,
    colorMode = 'flux',
    dipoleQuaternion = null,
  } = options;

  const root = new THREE.Group();
  const shells = new THREE.Group();
  const cutFaces = new THREE.Group();
  if (dipoleQuaternion) shells.quaternion.copy(dipoleQuaternion);
  root.add(shells, cutFaces);

  const nLat = 80;
  const nAz = 120;

  const shapeA = [];
  const shapeB = [];

  for (const def of BELT_DEFINITIONS) {
    const show = def.name === 'innerBelt' ? showInnerBelt : showOuterBelt;
    const profile = resolveBeltProfile(def.name, { kp, storageFlux });
    shapeA.push(new THREE.Vector4(profile.lPeak, profile.wIn, profile.pIn, profile.wOut));
    shapeB.push(new THREE.Vector4(profile.pOut, profile.k, show ? 1 : 0, def.deforms ? 1 : 0));
    if (!show) continue;

    for (const shell of SHELLS) {
      const contour = isoFluxContour(profile, shell.level, nLat);
      const { positions, nP } = revolveContour(contour, nAz);

      // Storm-time radial deformation (outer + storage belts): compressed on
      // the dayside, stretched on the nightside. Applying the same scale to
      // every shell of both belts keeps them nested and preserves the gap
      // between the storage ring and the outer belt.
      if (def.deforms && stormIntensity > 0.01) {
        applyStormDeformation({ positions }, sunDirX, sunDirZ, stormIntensity);
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setIndex(new THREE.BufferAttribute(buildRevolvedIndices(nP, nAz), 1));
      geometry.computeVertexNormals();

      const material = createShellMaterial(shell, clippingPlanes);

      const mesh = new THREE.Mesh(geometry, material);
      mesh.renderOrder = shell.renderOrder;
      mesh.userData.beltName = def.name;
      mesh.userData.shell = shell;
      mesh.userData.def = def;
      shells.add(mesh);
    }
  }

  // Shared uniforms for every cut face.
  const worldToDipole = new THREE.Matrix4();
  if (dipoleQuaternion) {
    worldToDipole.makeRotationFromQuaternion(dipoleQuaternion.clone().invert());
  }
  root.userData.cutFaceUniforms = {
    uWorldToDipole: { value: worldToDipole },
    uSunDir: { value: new THREE.Vector2(sunDirX, sunDirZ) },
    uStorm: { value: stormIntensity > 0.01 ? stormIntensity : 0 },
    uShapeA: { value: shapeA },
    uShapeB: { value: shapeB },
    uGain: { value: [1, 1, 1] },
    uAlpha: { value: [1, 1, 0] },
    uHue: { value: BELT_DEFINITIONS.map((d) => { const c = displayHue(d); return new THREE.Vector3(c.r, c.g, c.b); }) },
    uColorMode: { value: colorMode === 'belt' ? 1 : 0 },
    uOpacity: { value: Math.min(1, opacity * 1.2) },
  };
  root.userData.cutFaceGroup = cutFaces;
  root.userData.shellGroup = shells;
  root.userData.colorMode = colorMode;

  syncCutFaces(root, clippingPlanes);
  return root;
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
 * Apply storm-time radial deformation to a set of vertex positions in place.
 *
 * During geomagnetic storms the outer belt is compressed on the dayside
 * (solar wind ram pressure) and stretched on the nightside. The deformation
 * is a per-vertex radial scale based on the vertex's azimuthal angle relative
 * to the sun direction. Used for the outer and storage belts — the inner belt
 * (CRAND protons, deep in the dipole) does not deform meaningfully.
 *
 * The cut-face shader inverts this transform (see beltFlux() in
 * CUT_FACE_FRAGMENT) — change them together.
 *
 * @param {{ positions: Float32Array }} surface - vertex positions mutated in place
 * @param {number} sunDirX - X component of normalized sun direction (scene coords)
 * @param {number} sunDirZ - Z component of normalized sun direction (scene coords)
 * @param {number} stormIntensity - [0, 1]; 0 = quiet, 1 = severe (|Dst| >= 150 nT)
 * @param {number} [maxDeform=STORM_MAX_DEFORM] - max fractional compression/expansion
 */
export function applyStormDeformation(surface, sunDirX, sunDirZ, stormIntensity, maxDeform = STORM_MAX_DEFORM) {
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

// Above this effective face-on opacity a shell is treated as solid (opaque,
// depth-writing); below it the shell is a translucent layer.
const DEPTH_WRITE_OPACITY_THRESHOLD = 0.55;

// The cut face writes depth only when it is (nearly) opaque.
const CUT_FACE_SOLID_OPACITY = 0.95;

/**
 * Colour gain for a belt from its current normalized flux: at low flux the
 * belt's colours sit lower on the colormap (a quiet outer belt has a
 * yellow-orange core); at high flux the core reaches the top (red).
 */
function fluxGain(flux) {
  return 0.7 + 0.3 * Math.min(1, Math.max(0, flux));
}

/**
 * Update belt materials to encode particle flux intensity.
 *
 * Called from main.js animate() with smoothly-lerped flux values so that
 * belt appearance changes are gradual rather than jarring.
 *
 * baseOpacity (the GUI slider) scales every shell: at the default 0.85 the
 * peak shell is solid and the outer shells are translucent layers around it;
 * low values make the whole belt see-through so particles, satellites, and
 * field lines remain visible inside.
 *
 * Flux is carried by colour and glow, not by fading: each belt's colours are
 * multiplied by a gain from its current flux (see fluxGain). The storage ring
 * is the exception — it is invisible at quiet times and fades in with
 * storageBeltFlux (Baker et al. 2013; Shprits et al. 2013).
 *
 * @param {THREE.Group} group - from buildRadiationBeltGroup()
 * @param {{ innerFlux: number, outerFlux: number, storageBeltFlux?: number }} flux - normalized [0, 1]
 * @param {number} baseOpacity - current params.beltOpacity (0–1)
 */
export function updateBeltFlux(group, flux, baseOpacity) {
  if (!group) return;
  const colorMode = group.userData.colorMode ?? 'flux';
  const sf = flux.storageBeltFlux ?? 0;

  const gain = {
    innerBelt: fluxGain(0.8 + 0.2 * flux.innerFlux), // stable CRAND source: near-constant
    outerBelt: fluxGain(flux.outerFlux),
    storageBelt: fluxGain(0.5 + 0.5 * sf),
  };
  const fade = { innerBelt: 1, outerBelt: 1, storageBelt: Math.min(1, sf * 1.5) };
  const shells = group.userData.shellGroup;
  if (shells) {
    for (const mesh of shells.children) {
      const { beltName, shell, def } = mesh.userData;
      const u = mesh.material.uniforms;
      fluxColor(def, shell.tint * gain[beltName], colorMode, u.uColor.value);
      const opacity = Math.min(1, baseOpacity * def.opacity * fade[beltName]);
      // A shell that is solid face-on (the peak shell at normal slider
      // settings) is drawn fully opaque and writes depth. Blending a nearly
      // opaque torus over itself is order-dependent and shows as patchy
      // scallops; translucent shells stay depth-write-free so they never hide
      // the hotter shells (or particles) behind them.
      // depthWrite is render state — no shader recompile / needsUpdate required.
      const solid = opacity * shell.faceAlpha > DEPTH_WRITE_OPACITY_THRESHOLD;
      u.uOpacity.value = solid ? 1 : opacity;
      mesh.material.depthWrite = solid;
      mesh.visible = opacity > 0.003;
    }
  }

  const cut = group.userData.cutFaceUniforms;
  if (cut) {
    BELT_DEFINITIONS.forEach((def, i) => {
      cut.uGain.value[i] = gain[def.name];
      cut.uAlpha.value[i] = fade[def.name];
    });
    cut.uOpacity.value = Math.min(1, baseOpacity * 1.2);
    // A translucent cut face must not write depth, or it would hide the belt
    // shells behind it (they are drawn later) instead of blending over them.
    const faces = group.userData.cutFaceGroup;
    if (faces) {
      const solid = cut.uOpacity.value > CUT_FACE_SOLID_OPACITY;
      for (const mesh of faces.children) mesh.material.depthWrite = solid;
    }
  }
}

/**
 * Update clipping planes on the belt shells and rebuild/reorient the cut faces.
 */
export function updateBeltClipping(group, clippingPlanes) {
  if (!group) return;
  const shells = group.userData.shellGroup;
  if (shells) {
    for (const mesh of shells.children) {
      mesh.material.clippingPlanes = clippingPlanes;
      mesh.material.needsUpdate = true;
    }
  }
  syncCutFaces(group, clippingPlanes);
}
