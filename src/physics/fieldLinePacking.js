/**
 * Pack/unpack traced field lines for zero-copy worker → main thread transfer.
 *
 * The tracer produces one [x, y, z, metric] array per point (~9,000 per line,
 * ~70 lines per rebuild). Posting that nested structure costs a full
 * structured clone; packing into a single Float32Array lets postMessage
 * transfer the buffer instead.
 *
 * Lives in its own module (not fieldLineWorker.js, which assigns
 * self.onmessage at module top level) so both the worker and node-based
 * tests can import it.
 *
 * Packed format:
 *   positions — Float32Array, stride 4: x, y, z (km), colour metric
 *   offsets   — Uint32Array(lineCount + 1), point index where each line
 *               starts; line i spans [offsets[i], offsets[i+1])
 *   meta      — [{ lat, lon, isOpen }, …] per line (small, cloned normally)
 *
 * Float32 truncation is ~0.01 km at tail distances (25 Re) — invisible at
 * scene scale (1 unit = 6371.2 km).
 */

export function packTracedLines(tracedLines) {
  let total = 0;
  for (const line of tracedLines) total += line.points.length;

  const positions = new Float32Array(total * 4);
  const offsets = new Uint32Array(tracedLines.length + 1);
  const meta = [];

  let o = 0;
  for (let i = 0; i < tracedLines.length; i++) {
    const line = tracedLines[i];
    offsets[i] = o;
    for (const pt of line.points) {
      const base = o * 4;
      positions[base] = pt[0];
      positions[base + 1] = pt[1];
      positions[base + 2] = pt[2];
      positions[base + 3] = pt[3] ?? 0;
      o++;
    }
    meta.push({ lat: line.lat, lon: line.lon, isOpen: line.isOpen ?? false });
  }
  offsets[tracedLines.length] = o;

  return { positions, offsets, meta };
}

/**
 * Inverse of packTracedLines. Each returned line exposes its points as a
 * zero-copy subarray view:
 *   { points: { flat, count }, count, lat, lon, isOpen }
 * where flat is a Float32Array with stride 4 (x, y, z, metric).
 * createFieldLineMesh accepts this { flat, count } form directly.
 */
export function unpackTracedLines({ positions, offsets, meta }) {
  const lines = [];
  for (let i = 0; i < meta.length; i++) {
    const start = offsets[i];
    const end = offsets[i + 1];
    const count = end - start;
    lines.push({
      points: { flat: positions.subarray(start * 4, end * 4), count },
      count,
      lat: meta[i].lat,
      lon: meta[i].lon,
      isOpen: meta[i].isOpen,
    });
  }
  return lines;
}
