/**
 * src/physics/fieldLineWorker.js
 *
 * Web Worker for field line tracing.
 *
 * Running the RK4 field-line integration off the main thread prevents the
 * render loop from stalling during rebuilds (which previously took 200–500 ms
 * spread across multiple event-loop yields).  The Three.js geometry
 * construction (buildFieldLineGroup) still happens on the main thread after
 * this worker replies, since Three.js cannot run in a Worker.
 *
 * Message protocol
 * ─────────────────
 * Main → Worker  { buildId, latitudes, nLongitudes, bothHemispheres,
 *                  polarCapLatitudes, coeffs, maxDegree, solarWindParams }
 *
 * Worker → Main  { type: 'fieldLinesReady', buildId,
 *                  tracedLines: [{ points: [[x,y,z], …], lat, lon }, …] }
 *
 * The main thread discards any response whose buildId is behind the current
 * fieldLineBuildId (stale-build guard, same semantics as the old async pattern).
 */

import { traceFieldLine, generateSeedPoints } from './fieldLineTracer.js';

self.onmessage = function (e) {
  const {
    buildId,
    latitudes,
    nLongitudes,
    bothHemispheres,
    polarCapLatitudes,
    coeffs,
    maxDegree,
    solarWindParams,
  } = e.data;

  const seeds = generateSeedPoints({
    latitudes,
    nLongitudes,
    bothHemispheres,
    polarCapLatitudes,
  });

  const tracedLines = [];
  for (const seed of seeds) {
    const points = traceFieldLine(seed.x, seed.y, seed.z, coeffs, {
      maxDegree,
      solarWindParams,
    });
    const pts = points;
    const r0sq = pts[0][0] ** 2 + pts[0][1] ** 2 + pts[0][2] ** 2;
    const r1sq = pts[pts.length - 1][0] ** 2 + pts[pts.length - 1][1] ** 2 + pts[pts.length - 1][2] ** 2;
    const OPEN_THRESHOLD_SQ = (6371.2 * 2) ** 2; // 2 Re in km, squared
    const isOpen = r0sq > OPEN_THRESHOLD_SQ || r1sq > OPEN_THRESHOLD_SQ;
    tracedLines.push({ points, lat: seed.lat, lon: seed.lon, isOpen });
  }

  self.postMessage({ type: 'fieldLinesReady', buildId, tracedLines });
};
