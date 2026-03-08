/**
 * public/workers/satelliteWorker.js
 *
 * Classic Web Worker (no ES modules) for SGP4 satellite propagation using the
 * US Space Force official WASM propagator (Sgp4Prop v9.1.1.0).
 *
 * Loaded as a classic worker so importScripts() is available:
 *   new Worker('/workers/satelliteWorker.js')
 *
 * Message protocol:
 *   Main → Worker: { type: 'init', satellites: [{id, line1, line2}] }
 *   Worker → Main: { type: 'ready', count }
 *
 *   Main → Worker: { type: 'propagate', requestId, ds50utc }
 *   Worker → Main: { type: 'positions', requestId, positions: Float32Array, count }
 *                  (positions is transferred zero-copy: [x0,y0,z0, x1,y1,z1, ...] scene coords)
 *
 *   Main → Worker: { type: 'traceOrbit', requestId, satIndex, ds50utc, periodMin }
 *   Worker → Main: { type: 'orbit', requestId, satIndex, points: Float32Array }
 *                  (points is 180×3 floats in scene coords)
 *
 * Coordinate system:
 *   SGP4 returns ECI (TEME, km, z-up). Converted to BeltViz scene coords (Y-up, unitless):
 *     x_bv = (x_eci*cos(gmst) + y_eci*sin(gmst)) / Re
 *     y_bv = z_eci / Re
 *     z_bv = (-x_eci*sin(gmst) + y_eci*cos(gmst)) / Re
 *   where Re = 6371.2 km and gmst = Greenwich Mean Sidereal Time (radians).
 */

// Tell Emscripten where to find the WASM binary.
// Without this, ENVIRONMENT_IS_WORKER sets scriptDirectory = self.location.href
// (the worker URL /workers/satelliteWorker.js), so it would look for
// /workers/Sgp4Prop.wasm instead of /lib/sgp4/Sgp4Prop.wasm.
var Module = { locateFile: (path) => '/lib/sgp4/' + path };

importScripts('/lib/sgp4/Sgp4Prop.js');

const Re = 6371.2; // Earth radius in km

// ─── GMST from Ds50UTC ────────────────────────────────────────────────────────

/**
 * Compute Greenwich Mean Sidereal Time in radians from Ds50UTC.
 * Vallado formula (accurate to ~0.1 arcsec for modern dates).
 *
 * @param {number} ds50utc - Days since 1950-01-01 00:00:00 UTC
 * @returns {number} GMST in radians [0, 2π)
 */
function gmstFromDs50UTC(ds50utc) {
  const JD_1950 = 2433281.5;
  // JD at 0h of the integer day
  const jd0h = Math.floor(ds50utc) + JD_1950;
  // Julian centuries from J2000.0 to 0h of this day
  const T = (jd0h - 2451545.0) / 36525.0;
  // GMST at 0h (degrees) — Vallado Eq. 3-47
  const gmst0h = 100.4606184 + T * (36000.77004 + T * (0.000387933 - T / 38710000.0));
  // Add Earth rotation for fractional day: 360.98564724 deg/day
  const fracDay = ds50utc - Math.floor(ds50utc);
  let gmstDeg = (gmst0h + 360.98564724 * fracDay) % 360.0;
  if (gmstDeg < 0) gmstDeg += 360.0;
  return gmstDeg * (Math.PI / 180.0);
}

// ─── ECI → BeltViz scene coordinates ─────────────────────────────────────────

/**
 * Convert ECI position (TEME, km, z-up) to BeltViz scene coords (Y-up, unitless).
 *
 * @param {number} x_eci - ECI x in km
 * @param {number} y_eci - ECI y in km
 * @param {number} z_eci - ECI z in km
 * @param {number} cosGmst - cos(GMST)
 * @param {number} sinGmst - sin(GMST)
 * @returns {[number, number, number]} [x_bv, y_bv, z_bv] in scene units
 */
function eciToScene(x_eci, y_eci, z_eci, cosGmst, sinGmst) {
  // ECI → ECEF: rotate around z-axis by GMST
  const x_ecef = x_eci * cosGmst + y_eci * sinGmst;
  const y_ecef = -x_eci * sinGmst + y_eci * cosGmst;
  const z_ecef = z_eci;
  // ECEF (z-up) → BeltViz (Y-up): Y=north, X=toward 0° lon, Z=toward 90°E
  return [x_ecef / Re, z_ecef / Re, y_ecef / Re];
}

// ─── WASM state ───────────────────────────────────────────────────────────────

let wasmReady = false;
let pendingMessages = [];

// Persistent heap allocations (allocated once after init)
let satCount = 0;
let satKeys = null;     // Module heap pointer (satCount × 8 bytes, i64 array)
let satKeyIds = [];     // JS array of satKey i64 values (as JS numbers)
let resultPtr = null;   // Reusable result buffer for bulk propagation

// WASM function handles
let c_addSat, c_initSats, c_propDs50, c_removeFromSgp4, c_removeFromTle;

function initWasmFunctions() {
  c_addSat        = Module.cwrap('TleAddSatFrLines_wasm', 'number', ['string', 'string']);
  c_initSats      = Module.cwrap('Sgp4InitSats_wasm',     'number', ['number', 'int', 'number']);
  c_propDs50      = Module.cwrap('Sgp4PropDs50UtcPosVel_wasm', 'number', ['number', 'int', 'double', 'int', 'double', 'number']);
  c_removeFromSgp4 = Module.cwrap('Sgp4RemoveSats_wasm',  'number', ['number', 'int', 'number']);
  c_removeFromTle  = Module.cwrap('TleRemoveSats_wasm',   'number', ['number', 'int', 'number']);
}

// ─── Free satellites (call before re-init) ────────────────────────────────────

function freeSatellites() {
  if (satCount === 0 || !satKeys) return;
  const errPtr = Module._malloc(8);
  c_removeFromSgp4(satKeys, satCount, errPtr);
  c_removeFromTle(satKeys, satCount, errPtr);
  Module._free(errPtr);
  Module._free(satKeys);
  if (resultPtr) Module._free(resultPtr);
  satKeys    = null;
  resultPtr  = null;
  satKeyIds  = [];
  satCount   = 0;
}

// ─── Init satellites ──────────────────────────────────────────────────────────

function initSatellites(satellites) {
  // Add all TLEs sequentially and collect satKeys
  const ids = [];
  for (const sat of satellites) {
    const key = c_addSat(sat.line1.trim(), sat.line2.trim());
    if (key === 0) {
      console.warn('[SatWorker] TLE parse failed for', sat.id, sat.name || '');
      ids.push(null);
    } else {
      ids.push(key);
    }
  }

  // Filter out failed parses
  const validIds = ids.filter(k => k !== null);
  satCount = validIds.length;

  // Allocate satKeys array on WASM heap (i64 = 8 bytes each)
  satKeys = Module._malloc(satCount * 8);
  satKeyIds = validIds;
  for (let i = 0; i < satCount; i++) {
    Module.setValue(satKeys + i * 8, validIds[i], 'i64');
  }

  // Initialize Sgp4 objects
  const errPtr = Module._malloc(8);
  const ret = c_initSats(satKeys, satCount, errPtr);
  Module._free(errPtr);
  if (ret !== 0) {
    console.error('[SatWorker] Sgp4InitSats failed, errcode:', ret);
    return 0;
  }

  // Allocate persistent result buffer for bulk propagation (1 prop per sat)
  // 8 doubles per result: errCode, propTime, x, y, z, vx, vy, vz
  resultPtr = Module._malloc(satCount * 8 * 8);

  return satCount;
}

// ─── Propagate all satellites ─────────────────────────────────────────────────

function propagateAll(ds50utc) {
  if (!satKeys || satCount === 0) return null;

  const ret = c_propDs50(satKeys, satCount, ds50utc, 1, 1.0, resultPtr);
  if (ret !== 0) {
    console.warn('[SatWorker] propagation error code:', ret);
  }

  const gmst = gmstFromDs50UTC(ds50utc);
  const cosG = Math.cos(gmst);
  const sinG = Math.sin(gmst);

  // Output: [x0,y0,z0, x1,y1,z1, ...] for all sats (scene coords)
  const positions = new Float32Array(satCount * 3);
  const heap = Module.HEAPF64;
  const base = resultPtr / 8; // offset into Float64Array view

  for (let i = 0; i < satCount; i++) {
    const offset = base + i * 8; // 8 doubles per sat
    const err = heap[offset];    // errCode (0 = success)
    if (err !== 0) {
      // Satellite propagation failed (deep decay, etc.) — place underground
      positions[i * 3]     = 0;
      positions[i * 3 + 1] = -2; // below Earth surface (y < -1 hides it)
      positions[i * 3 + 2] = 0;
      continue;
    }
    const x_eci = heap[offset + 2];
    const y_eci = heap[offset + 3];
    const z_eci = heap[offset + 4];

    const [bx, by, bz] = eciToScene(x_eci, y_eci, z_eci, cosG, sinG);
    positions[i * 3]     = bx;
    positions[i * 3 + 1] = by;
    positions[i * 3 + 2] = bz;
  }

  return positions;
}

// ─── Trace single satellite orbit ─────────────────────────────────────────────

function traceOrbit(satIndex, ds50utc, periodMin) {
  if (!satKeys || satIndex < 0 || satIndex >= satCount) return null;

  const steps = 181; // 181 points = 180 segments (closed loop)
  const stepMin = periodMin / 180.0;

  // Single-sat propagation: extract just this satellite's key
  const singleKeyPtr = Module._malloc(8);
  Module.setValue(singleKeyPtr, satKeyIds[satIndex], 'i64');

  const traceResPtr = Module._malloc(steps * 8 * 8); // 8 doubles per step
  const ret = c_propDs50(singleKeyPtr, 1, ds50utc, steps, stepMin, traceResPtr);
  Module._free(singleKeyPtr);

  if (ret !== 0) {
    Module._free(traceResPtr);
    console.warn('[SatWorker] traceOrbit error code:', ret);
    return null;
  }

  const gmst0 = gmstFromDs50UTC(ds50utc);
  const earthRateRadPerMin = 7.2921150e-5 * 60; // rad/min
  const heap = Module.HEAPF64;
  const base = traceResPtr / 8;
  const points = new Float32Array(steps * 3);

  for (let i = 0; i < steps; i++) {
    const offset = base + i * 8;
    const err = heap[offset];
    if (err !== 0) {
      points[i * 3]     = 0;
      points[i * 3 + 1] = -2;
      points[i * 3 + 2] = 0;
      continue;
    }
    const x_eci = heap[offset + 2];
    const y_eci = heap[offset + 3];
    const z_eci = heap[offset + 4];

    // Advance GMST for each time step
    const gmst = gmst0 + earthRateRadPerMin * stepMin * i;
    const cosG = Math.cos(gmst);
    const sinG = Math.sin(gmst);

    const [bx, by, bz] = eciToScene(x_eci, y_eci, z_eci, cosG, sinG);
    points[i * 3]     = bx;
    points[i * 3 + 1] = by;
    points[i * 3 + 2] = bz;
  }

  Module._free(traceResPtr);
  return points;
}

// ─── Message handler ──────────────────────────────────────────────────────────

function handleMessage(e) {
  const { type, requestId } = e.data;

  if (type === 'init') {
    const count = initSatellites(e.data.satellites);
    self.postMessage({ type: 'ready', count });
    return;
  }

  if (type === 'propagate') {
    const positions = propagateAll(e.data.ds50utc);
    if (!positions) {
      self.postMessage({ type: 'positions', requestId, positions: new Float32Array(0), count: 0 });
      return;
    }
    self.postMessage({ type: 'positions', requestId, positions, count: satCount }, [positions.buffer]);
    return;
  }

  if (type === 'traceOrbit') {
    const points = traceOrbit(e.data.satIndex, e.data.ds50utc, e.data.periodMin);
    if (!points) {
      self.postMessage({ type: 'orbit', requestId, satIndex: e.data.satIndex, points: null });
      return;
    }
    self.postMessage({ type: 'orbit', requestId, satIndex: e.data.satIndex, points }, [points.buffer]);
    return;
  }
}

// ─── Startup: wait for WASM runtime ──────────────────────────────────────────

if (Module.calledRun) {
  // WASM already initialized synchronously
  initWasmFunctions();
  wasmReady = true;
  self.onmessage = handleMessage;
  // Drain any messages received before ready
  for (const msg of pendingMessages) handleMessage(msg);
  pendingMessages = [];
} else {
  // Buffer messages until WASM runtime initializes
  self.onmessage = (e) => pendingMessages.push(e);

  Module['onRuntimeInitialized'] = function () {
    initWasmFunctions();
    wasmReady = true;
    self.onmessage = handleMessage;
    for (const msg of pendingMessages) handleMessage(msg);
    pendingMessages = [];
  };
}
