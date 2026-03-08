/**
 * src/scene/satelliteSwarm.js
 *
 * Three.js rendering for the satellite swarm:
 *   - One THREE.Points per orbit class (leo/meo/geo/heo/other) for easy per-class
 *     visibility toggling without touching buffer contents.
 *   - Custom ShaderMaterial with soft circular halos (same visual language as
 *     particleSystem.js).
 *   - Animated draw-on orbit trace for the selected satellite.
 *
 * Usage:
 *   const swarm = createSatelliteSwarm(scene, satellites);
 *   // Each frame:
 *   swarm.updatePositions(positions, count);  // Float32Array from worker
 *   swarm.tickOrbitTrace(now);                // animate draw-on
 *   // On selection:
 *   swarm.setSelected(satelliteIndex);        // -1 to deselect
 *   // On filter change:
 *   swarm.setClassVisible('leo', bool);
 *   // On class filter array:
 *   swarm.applyVisibility(params.satellites);
 */

import * as THREE from 'three';

// Earth radius (km) — matches src/utils/constants.js EARTH_RADIUS_KM
const Re = 6371.2;

// ─── Orbit class config ───────────────────────────────────────────────────────

export const ORBIT_CLASSES = ['leo', 'meo', 'geo', 'heo', 'other'];

const CLASS_COLORS = {
  leo:   new THREE.Color(0xc8d8f0),  // pale blue-white
  meo:   new THREE.Color(0x44eebb),  // cyan-teal (GPS/nav)
  geo:   new THREE.Color(0xffdd44),  // gold (geostationary ring)
  heo:   new THREE.Color(0xee66ff),  // magenta (Molniya orbits)
  other: new THREE.Color(0x888888),  // grey (transitional)
};

const SELECTED_COLOR = new THREE.Color(1, 1, 1);

// ─── Shaders ──────────────────────────────────────────────────────────────────

const VERTEX_SHADER = /* glsl */`
  attribute vec3  satColor;
  attribute float satSize;
  varying   vec3  vColor;
  uniform   float uDPR;

  void main() {
    vColor = satColor;
    vec4  mvPos = modelViewMatrix * vec4(position, 1.0);
    float dist  = max(-mvPos.z, 0.01);
    // Size attenuation: larger up close, smaller far away
    gl_PointSize = clamp(satSize / (dist * 0.18 + 0.05), 3.0, 20.0) * uDPR;
    gl_Position  = projectionMatrix * mvPos;
  }
`;

const FRAGMENT_SHADER = /* glsl */`
  varying vec3 vColor;

  void main() {
    float d = length(gl_PointCoord - vec2(0.5)) * 2.0;
    if (d > 1.0) discard;
    // Crisp disc with thin anti-aliased edge (no soft glow)
    float alpha = smoothstep(1.0, 0.6, d);
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// ─── createSatelliteSwarm ─────────────────────────────────────────────────────

/**
 * @param {THREE.Scene} scene
 * @param {Array}       satellites  - catalog array from satellites.json
 * @returns {object}   swarm controller
 */
export function createSatelliteSwarm(scene, satellites) {
  const dpr = window.devicePixelRatio ?? 1;

  // Build orbit-class → satellite index mappings
  // classIndices[orbitClass] = [globalIndex, ...] for satellites in that class
  const classIndices = { leo: [], meo: [], geo: [], heo: [], other: [] };
  // globalToLocal[globalIndex] = { orbitClass, localIndex }
  const globalToLocal = new Array(satellites.length);

  for (let i = 0; i < satellites.length; i++) {
    const cls = satellites[i].orbitClass;
    const localIdx = classIndices[cls].length;
    classIndices[cls].push(i);
    globalToLocal[i] = { orbitClass: cls, localIndex: localIdx };
  }

  // Build one Points object per orbit class
  const pointsMap = {};  // orbitClass → { points, posAttr, colorAttr, sizeAttr }

  const group = new THREE.Group();
  scene.add(group);

  for (const cls of ORBIT_CLASSES) {
    const count = classIndices[cls].length;
    if (count === 0) {
      pointsMap[cls] = null;
      continue;
    }

    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3); // x,y,z per satellite
    const colors    = new Float32Array(count * 3); // r,g,b per satellite
    const sizes     = new Float32Array(count);     // point size per satellite

    const baseColor = CLASS_COLORS[cls];
    const baseSize  = cls === 'geo' ? 14.0 : (cls === 'heo' ? 12.0 : 11.0);

    for (let i = 0; i < count; i++) {
      colors[i * 3]     = baseColor.r;
      colors[i * 3 + 1] = baseColor.g;
      colors[i * 3 + 2] = baseColor.b;
      sizes[i] = baseSize;
      // Default positions underground — updated on first propagation
      positions[i * 3 + 1] = -2;
    }

    const posAttr   = new THREE.BufferAttribute(positions, 3);
    const colorAttr = new THREE.BufferAttribute(colors, 3);
    const sizeAttr  = new THREE.BufferAttribute(sizes, 1);
    posAttr.setUsage(THREE.DynamicDrawUsage);
    colorAttr.setUsage(THREE.DynamicDrawUsage);
    sizeAttr.setUsage(THREE.DynamicDrawUsage);

    geometry.setAttribute('position', posAttr);
    geometry.setAttribute('satColor', colorAttr);
    geometry.setAttribute('satSize', sizeAttr);

    const material = new THREE.ShaderMaterial({
      uniforms: { uDPR: { value: dpr } },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false; // positions span the whole scene
    group.add(points);

    pointsMap[cls] = { points, posAttr, colorAttr, sizeAttr, baseColor, baseSize };
  }

  // ─── State ──────────────────────────────────────────────────────────────────
  let selectedGlobalIndex = -1;
  let orbitLine = null;

  // Interpolation state: smooth motion between propagation ticks
  let _prevPos        = null;   // Float32Array(satellites.length * 3), global-indexed
  let _nextPos        = null;   // same
  let _lerpT          = 1.0;   // 1.0 = fully at _nextPos (no work needed)
  let _propArrivedAt  = 0;     // performance.now() when _nextPos was last set
  let _propIntervalMs = 10000; // estimated real-ms between propagation arrivals
  let orbitLineDrawCount = 0;
  let orbitLineTotalCount = 0;
  let drawAnimStartTime = null;
  const DRAW_DURATION_MS = 2000;

  // ─── updatePositions ────────────────────────────────────────────────────────

  /**
   * Apply new propagated positions from the worker.
   *
   * @param {Float32Array} positions - [x0,y0,z0, x1,y1,z1, ...] scene coords, length = count×3
   * @param {number}       count     - number of satellites in the positions array
   */
  function updatePositions(positions, count) {
    if (!positions || count === 0) return;
    const now = performance.now();
    const n   = Math.min(count, satellites.length);

    if (!_nextPos) {
      // First propagation — snap directly, start lerp buffers
      _nextPos = new Float32Array(satellites.length * 3);
      _prevPos = new Float32Array(satellites.length * 3);
      for (let i = 0; i < n; i++) {
        _nextPos[i * 3]     = positions[i * 3];
        _nextPos[i * 3 + 1] = positions[i * 3 + 1];
        _nextPos[i * 3 + 2] = positions[i * 3 + 2];
      }
      _prevPos.set(_nextPos);
      _propArrivedAt = now;
      _lerpT = 1.0; // snap immediately, no lerp on first frame
      _writeToBuffers(_nextPos);
      return;
    }

    // Estimate interval from time between arrivals
    if (_propArrivedAt > 0) _propIntervalMs = Math.max(200, now - _propArrivedAt);
    _propArrivedAt = now;

    // Swap: prev ← next, fill next with new data
    const tmp = _prevPos;
    _prevPos = _nextPos;
    _nextPos = tmp;
    for (let i = 0; i < n; i++) {
      _nextPos[i * 3]     = positions[i * 3];
      _nextPos[i * 3 + 1] = positions[i * 3 + 1];
      _nextPos[i * 3 + 2] = positions[i * 3 + 2];
    }
    _lerpT = 0.0; // begin interpolating prev → next
  }

  /** Write a flat global-indexed Float32Array directly to per-class posAttr buffers. */
  function _writeToBuffers(pos) {
    for (let i = 0; i < satellites.length; i++) {
      const info = globalToLocal[i];
      if (!info) continue;
      const slot = pointsMap[info.orbitClass];
      if (!slot) continue;
      const li = info.localIndex;
      slot.posAttr.array[li * 3]     = pos[i * 3];
      slot.posAttr.array[li * 3 + 1] = pos[i * 3 + 1];
      slot.posAttr.array[li * 3 + 2] = pos[i * 3 + 2];
    }
    for (const cls of ORBIT_CLASSES) {
      if (pointsMap[cls]) pointsMap[cls].posAttr.needsUpdate = true;
    }
  }

  /**
   * Interpolate displayed positions between the last two propagation results.
   * Call every frame from animate().
   * @param {number} now - performance.now()
   */
  function lerpPositions(now) {
    if (!_nextPos || !_prevPos || _lerpT >= 1.0) return;
    _lerpT = Math.min(1.0, (now - _propArrivedAt) / _propIntervalMs);
    const t = _lerpT, mt = 1.0 - t;
    for (let i = 0; i < satellites.length; i++) {
      const info = globalToLocal[i];
      if (!info) continue;
      const slot = pointsMap[info.orbitClass];
      if (!slot) continue;
      const li = info.localIndex;
      slot.posAttr.array[li * 3]     = _prevPos[i * 3]     * mt + _nextPos[i * 3]     * t;
      slot.posAttr.array[li * 3 + 1] = _prevPos[i * 3 + 1] * mt + _nextPos[i * 3 + 1] * t;
      slot.posAttr.array[li * 3 + 2] = _prevPos[i * 3 + 2] * mt + _nextPos[i * 3 + 2] * t;
    }
    for (const cls of ORBIT_CLASSES) {
      if (pointsMap[cls]) pointsMap[cls].posAttr.needsUpdate = true;
    }
  }

  // ─── setSelected ────────────────────────────────────────────────────────────

  /**
   * @param {number} globalIndex - index into satellites array, or -1 to deselect
   */
  function setSelected(globalIndex) {
    // Restore previous selection
    if (selectedGlobalIndex >= 0 && selectedGlobalIndex < satellites.length) {
      const prev = globalToLocal[selectedGlobalIndex];
      const slot = pointsMap[prev.orbitClass];
      if (slot) {
        const li = prev.localIndex;
        const c = slot.baseColor;
        slot.colorAttr.array[li * 3]     = c.r;
        slot.colorAttr.array[li * 3 + 1] = c.g;
        slot.colorAttr.array[li * 3 + 2] = c.b;
        slot.sizeAttr.array[li] = slot.baseSize;
        slot.colorAttr.needsUpdate = true;
        slot.sizeAttr.needsUpdate = true;
      }
    }

    selectedGlobalIndex = globalIndex;

    if (globalIndex >= 0 && globalIndex < satellites.length) {
      const cur = globalToLocal[globalIndex];
      const slot = pointsMap[cur.orbitClass];
      if (slot) {
        const li = cur.localIndex;
        slot.colorAttr.array[li * 3]     = SELECTED_COLOR.r;
        slot.colorAttr.array[li * 3 + 1] = SELECTED_COLOR.g;
        slot.colorAttr.array[li * 3 + 2] = SELECTED_COLOR.b;
        slot.sizeAttr.array[li] = slot.baseSize * 2.5;
        slot.colorAttr.needsUpdate = true;
        slot.sizeAttr.needsUpdate = true;
      }
    }
  }

  // ─── Orbit trace ─────────────────────────────────────────────────────────────

  /**
   * Begin showing orbit trace for the selected satellite.
   *
   * @param {Float32Array} points     - 181×3 floats (scene coords)
   * @param {string}       orbitClass - orbit class of the selected satellite
   */
  function setOrbitTrace(points, orbitClass) {
    clearOrbitTrace();
    if (!points || points.length < 6) return;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(points.slice(), 3));
    orbitLineTotalCount = points.length / 3;
    orbitLineDrawCount = 1;
    geometry.setDrawRange(0, 1);

    const color = CLASS_COLORS[orbitClass] ?? new THREE.Color(0xffffff);
    const material = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });

    orbitLine = new THREE.Line(geometry, material);
    orbitLine.frustumCulled = false;
    scene.add(orbitLine);
    drawAnimStartTime = performance.now();
  }

  /**
   * Advance the orbit trace draw-on animation. Call each frame from animate().
   * @param {number} now - performance.now() timestamp
   */
  function tickOrbitTrace(now) {
    if (!orbitLine || orbitLineDrawCount >= orbitLineTotalCount) return;
    const elapsed = now - drawAnimStartTime;
    const t = Math.min(1, elapsed / DRAW_DURATION_MS);
    orbitLineDrawCount = Math.max(2, Math.floor(t * orbitLineTotalCount));
    orbitLine.geometry.setDrawRange(0, orbitLineDrawCount);
  }

  function clearOrbitTrace() {
    if (orbitLine) {
      scene.remove(orbitLine);
      orbitLine.geometry.dispose();
      orbitLine.material.dispose();
      orbitLine = null;
    }
    orbitLineDrawCount = 0;
    orbitLineTotalCount = 0;
    drawAnimStartTime = null;
  }

  // ─── Visibility ──────────────────────────────────────────────────────────────

  /**
   * Apply visibility from params.satellites (showLeo, showMeo, etc.)
   * Also handles clearing the orbit trace if the selected class is hidden.
   *
   * @param {object} satParams - params.satellites
   */
  function applyVisibility(satParams) {
    const classVisible = {
      leo:   satParams.showLeo,
      meo:   satParams.showMeo,
      geo:   satParams.showGeo,
      heo:   satParams.showHeo,
      other: satParams.showOther,
    };
    for (const cls of ORBIT_CLASSES) {
      if (pointsMap[cls]) {
        pointsMap[cls].points.visible = classVisible[cls];
      }
    }
    // Clear orbit trace if selected satellite's class is now hidden
    if (selectedGlobalIndex >= 0) {
      const cls = globalToLocal[selectedGlobalIndex]?.orbitClass;
      if (cls && !classVisible[cls]) {
        clearOrbitTrace();
      }
    }
  }

  // ─── Dispose ──────────────────────────────────────────────────────────────────

  function dispose() {
    clearOrbitTrace();
    for (const cls of ORBIT_CLASSES) {
      const slot = pointsMap[cls];
      if (slot) {
        slot.points.geometry.dispose();
        slot.points.material.dispose();
      }
    }
    scene.remove(group);
  }

  // ─── Public interface ─────────────────────────────────────────────────────────

  return {
    group,
    updatePositions,
    lerpPositions,
    setSelected,
    setOrbitTrace,
    tickOrbitTrace,
    clearOrbitTrace,
    applyVisibility,
    dispose,
    /** Find the global satellite index closest to a screen click (for future picking). */
    getSelectedGlobalIndex: () => selectedGlobalIndex,
  };
}
