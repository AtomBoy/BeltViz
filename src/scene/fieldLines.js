import * as THREE from 'three';
import { KM_TO_SCENE } from '../utils/constants.js';

export const TUBE_SEGMENTS = 200;

// Two colour modes, auto-selected by the value range of the bMag array:
//
//   Solar-wind-influence mode (solar wind active):
//     bMag = |B_ext| / (|B_ext| + |B_int|)  ∈ [0, 1]  (a ratio, never > 1)
//     blue = inner magnetosphere (IGRF dominated, no solar wind reach)
//     red  = near magnetopause / tail (T01 field comparable to IGRF)
//     → linear colour scale, no log needed.
//
//   Total-B mode (solar wind off):
//     bMag = |B_total| ≈ IGRF, range 10–60 000 nT
//     blue = weak field (distant), red = strong field (near Earth)
//     → log scale required for the wide dynamic range.
//
// Distinguishing heuristic: ratio values are always ≤ 1; IGRF values are
// routinely thousands of nT. A threshold of 2 cleanly separates the modes.
const RATIO_MODE_THRESHOLD = 2; // bMag > 2 nT → total-B mode (ratio can't exceed 1)
const TOT_LOG_MIN = 1;    // log10(10)
const TOT_LOG_MAX = 4.78; // log10(60 000)

function bMagToColor(bMag, isRatioMode) {
  let t;
  if (isRatioMode) {
    t = Math.min(1, Math.max(0, bMag)); // already [0, 1]
  } else {
    const logB = Math.log10(Math.max(1, bMag));
    t = Math.min(1, Math.max(0, (logB - TOT_LOG_MIN) / (TOT_LOG_MAX - TOT_LOG_MIN)));
  }
  // HSL: hue 240 (blue) → 0 (red) as t goes 0 → 1
  const hue = (1 - t) * 240;
  const color = new THREE.Color();
  color.setHSL(hue / 360, 1.0, 0.55);
  return color;
}

function applyVertexColors(geometry, bMags, tubularSegments, radialSegments) {
  // If all values are ≤ RATIO_MODE_THRESHOLD, bMags contains [0,1] influence
  // ratios (solar wind active). Otherwise they are nT field magnitudes (SW off).
  const isRatioMode = Math.max(...bMags) <= RATIO_MODE_THRESHOLD;

  const vertexCount = (tubularSegments + 1) * (radialSegments + 1);
  const colors = new Float32Array(vertexCount * 3);
  const n = bMags.length;

  for (let k = 0; k < vertexCount; k++) {
    const tubularIdx = Math.floor(k / (radialSegments + 1));
    const t = tubularIdx / tubularSegments;
    const fi = t * (n - 1);
    const lo = Math.floor(fi);
    const hi = Math.min(lo + 1, n - 1);
    const frac = fi - lo;
    const bMag = bMags[lo] + frac * (bMags[hi] - bMags[lo]);
    const c = bMagToColor(bMag, isRatioMode);
    colors[k * 3]     = c.r;
    colors[k * 3 + 1] = c.g;
    colors[k * 3 + 2] = c.b;
  }

  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
}

/**
 * Create a Three.js mesh for a traced field line.
 * @param {number[][]} points - Array of [x, y, z] or [x, y, z, bMag] in km
 * @param {object} options - { color, radius, radialSegments, colorByB }
 * @returns {THREE.Mesh}
 */
export function createFieldLineMesh(points, options = {}) {
  const radius = options.radius || 0.008;
  const radialSegments = options.radialSegments || 5;
  const color = options.color || 0x00aaff;
  const colorByB = options.colorByB ?? false;

  // Extract xyz (and optional bMag) from each point
  const vectors = [];
  const bMags = [];
  for (const pt of points) {
    vectors.push(new THREE.Vector3(pt[0] * KM_TO_SCENE, pt[1] * KM_TO_SCENE, pt[2] * KM_TO_SCENE));
    if (colorByB && pt[3] != null) bMags.push(pt[3]);
  }

  if (vectors.length < 2) return null;

  const curve = new THREE.CatmullRomCurve3(vectors);

  const tubularSegments = options.tubularSegments ?? TUBE_SEGMENTS;
  const geometry = new THREE.TubeGeometry(
    curve,
    tubularSegments,
    radius,
    radialSegments,
    false
  );

  const useVertexColors = colorByB && bMags.length >= 2;

  if (useVertexColors) {
    applyVertexColors(geometry, bMags, tubularSegments, radialSegments);
  }

  // colorByB mode uses unlit MeshBasicMaterial so vertex colors display at full saturation.
  // Standard lighting would wash out the blue→red gradient on the nightside.
  const material = useVertexColors
    ? new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      })
    : new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.25,
        roughness: 0.5,
        metalness: 0.2,
        transparent: true,
        opacity: 0.85,
      });

  return new THREE.Mesh(geometry, material);
}

/**
 * Build all field line meshes and add to a group.
 * @param {Array} tracedLines - Array of { points, lat, lon }
 * @param {function} colorFn - (lat) => THREE.Color
 * @param {object} options - { radius, colorByB }
 * @returns {THREE.Group}
 */
export function buildFieldLineGroup(tracedLines, colorFn, options = {}) {
  const group = new THREE.Group();

  for (const line of tracedLines) {
    const color = colorFn(line.lat);
    const mesh = createFieldLineMesh(line.points, {
      color,
      radius: options.radius || 0.008,
      tubularSegments: options.tubularSegments,
      colorByB: options.colorByB ?? false,
    });
    if (mesh) group.add(mesh);
  }

  return group;
}
