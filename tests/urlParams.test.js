import { describe, it, expect } from 'vitest';
import {
  parseHashString,
  buildHashString,
  applyIsoLevelsFromUrl,
  DEFAULTS,
} from '../src/ui/urlParams.js';
import { DEFAULT_PARAMS } from '../src/utils/defaultParams.js';

// Default-active iso levels in lShell mode (mirrors initIsoLevels() in main.js)
const DEFAULT_ISO_LEVELS_OBJ = {
  1.5: false, 2: true, 3: false, 4: true, 5: false, 6: true, 8: false, 10: true,
};

function makeParams(overrides = {}) {
  const p = structuredClone(DEFAULT_PARAMS);
  p.isoLevels = { ...DEFAULT_ISO_LEVELS_OBJ };
  // deep-merge one level of nesting (particles / aurora / satellites)
  for (const [k, v] of Object.entries(overrides)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) Object.assign(p[k], v);
    else p[k] = v;
  }
  return p;
}

describe('buildHashString', () => {
  it('writes nothing when all params are at defaults', () => {
    expect(buildHashString(makeParams())).toBe('');
  });

  it('writes only non-default values', () => {
    const str = buildHashString(makeParams({ maxDegree: 8, dst: -120 }));
    const sp = new URLSearchParams(str);
    expect(sp.get('maxDegree')).toBe('8');
    expect(sp.get('dst')).toBe('-120');
    expect([...sp.keys()].sort()).toEqual(['dst', 'maxDegree']);
  });

  it('normalizes float precision (no 0.008000000000001 noise)', () => {
    const str = buildHashString(makeParams({ tubeRadius: 0.0080000000000001 }));
    expect(str).toBe(''); // collapses back to the default 0.008
  });

  it('writes camera as an atomic triplet only when moved', () => {
    const home = buildHashString(makeParams(), { x: 0, y: 1.5, z: 4 });
    expect(home).toBe('');

    const moved = new URLSearchParams(
      buildHashString(makeParams(), { x: 1.25, y: -0.5, z: 3 })
    );
    expect(moved.get('camX')).toBe('1.25');
    expect(moved.get('camY')).toBe('-0.5');
    expect(moved.get('camZ')).toBe('3');
  });

  it('omits isoLevels at the default active set regardless of key order', () => {
    // Regression: a lexicographic sort produced '10,2,4,6' which never
    // matched the default '2,4,6,10', so isoLevels was written to every URL.
    expect(buildHashString(makeParams())).not.toContain('isoLevels');
  });

  it('writes isoLevels numerically sorted when changed', () => {
    const p = makeParams();
    p.isoLevels = { 1.5: false, 2: false, 3: true, 4: false, 5: false, 6: false, 8: true, 10: true };
    const sp = new URLSearchParams(buildHashString(p));
    expect(sp.get('isoLevels')).toBe('3,8,10');
  });
});

describe('parseHashString', () => {
  it('returns empty overrides for an empty hash', () => {
    expect(parseHashString('')).toEqual({ params: {}, isoLevels: null, camera: null });
  });

  it('skips malformed numeric values', () => {
    const { params } = parseHashString('maxDegree=abc&dst=-50');
    expect(params.maxDegree).toBeUndefined();
    expect(params.dst).toBe(-50);
  });

  it('returns camera only when all three components are present', () => {
    expect(parseHashString('camX=1&camY=2').camera).toBeNull();
    expect(parseHashString('camX=1&camY=2&camZ=3').camera).toEqual({ x: 1, y: 2, z: 3 });
  });

  it('groups nested particle keys under params.particles', () => {
    const { params } = parseHashString('particles=true&pCount=400&showElec=false');
    expect(params.particles).toEqual({ enabled: true, count: 400, showElectrons: false });
  });
});

describe('round-trip (build → parse)', () => {
  it('recovers scalar, nested and isoLevels overrides exactly', () => {
    const p = makeParams({
      maxDegree: 8,
      dst: -120,
      solarWindSpeed: 700,
      showFieldLines: false,
      isoMode: 'fieldStrength',
      particles: { enabled: true, count: 400 },
      aurora: { enabled: true, opacity: 0.5 },
      satellites: { enabled: true },
    });
    p.isoLevels = { 1.5: true, 2: false, 3: false, 4: true, 5: false, 6: false, 8: false, 10: false };

    const str = buildHashString(p);
    const { params: parsed, isoLevels } = parseHashString(str);

    expect(parsed.maxDegree).toBe(8);
    expect(parsed.dst).toBe(-120);
    expect(parsed.solarWindSpeed).toBe(700);
    expect(parsed.showFieldLines).toBe(false);
    expect(parsed.isoMode).toBe('fieldStrength');
    expect(parsed.particles).toEqual({ enabled: true, count: 400 });
    expect(parsed.aurora).toEqual({ enabled: true, opacity: 0.5 });
    expect(parsed.satellites).toEqual({ enabled: true });

    // isoLevels re-applied via applyIsoLevelsFromUrl reproduces the object
    const target = { isoLevels: { ...DEFAULT_ISO_LEVELS_OBJ } };
    applyIsoLevelsFromUrl(target, isoLevels);
    expect(target.isoLevels).toEqual(p.isoLevels);
  });

  it('default params survive a full round-trip unchanged', () => {
    const { params: parsed, isoLevels, camera } = parseHashString(buildHashString(makeParams()));
    expect(parsed).toEqual({});
    expect(isoLevels).toBeNull();
    expect(camera).toBeNull();
  });
});

describe('DEFAULTS drift guard', () => {
  // Maps every URL DEFAULTS key to its path in DEFAULT_PARAMS. If either
  // side changes without the other, this test fails — preventing silently
  // broken shared URLs.
  const KEY_MAP = {
    maxDegree:           ['maxDegree'],
    numLatitudes:        ['numLatitudes'],
    numLongitudes:       ['numLongitudes'],
    tubeRadius:          ['tubeRadius'],
    showFieldLines:      ['showFieldLines'],
    autoRotate:          ['autoRotate'],
    datetimeString:      ['datetimeString'],
    showIsosurfaces:     ['showIsosurfaces'],
    isoMode:             ['isoMode'],
    isoResolution:       ['isoResolution'],
    isoOpacity:          ['isoOpacity'],
    showInnerBelt:       ['showInnerBelt'],
    showOuterBelt:       ['showOuterBelt'],
    beltOpacity:         ['beltOpacity'],
    clipEquatorial:      ['clipEquatorial'],
    clipMeridional:      ['clipMeridional'],
    clipMeridionalAngle: ['clipMeridionalAngle'],
    solarWindEnabled:    ['solarWindEnabled'],
    solarWindSpeed:      ['solarWindSpeed'],
    solarWindDensity:    ['solarWindDensity'],
    imfBy:               ['imfBy'],
    imfBz:               ['imfBz'],
    dst:                 ['dst'],
    showMagnetopause:    ['showMagnetopause'],
    pEnabled:            ['particles', 'enabled'],
    pShowElec:           ['particles', 'showElectrons'],
    pShowProt:           ['particles', 'showProtons'],
    pCount:              ['particles', 'count'],
    pEnergy:             ['particles', 'energyMeV'],
    aEnabled:            ['aurora', 'enabled'],
    aOpacity:            ['aurora', 'opacity'],
    satSwarm:            ['satellites', 'enabled'],
    // isoLevels: string-form default, checked separately below
  };

  it('every DEFAULTS key matches its DEFAULT_PARAMS value', () => {
    for (const [urlKey, path] of Object.entries(KEY_MAP)) {
      const expected = path.reduce((obj, k) => obj[k], DEFAULT_PARAMS);
      expect(DEFAULTS[urlKey], `DEFAULTS.${urlKey} vs DEFAULT_PARAMS.${path.join('.')}`)
        .toBe(expected);
    }
  });

  it('KEY_MAP covers every DEFAULTS key (no unmapped additions)', () => {
    const mapped = new Set([...Object.keys(KEY_MAP), 'isoLevels']);
    for (const k of Object.keys(DEFAULTS)) {
      expect(mapped.has(k), `DEFAULTS.${k} missing from drift-guard KEY_MAP`).toBe(true);
    }
  });

  it('isoLevels default string matches the documented active set', () => {
    expect(DEFAULTS.isoLevels).toBe('2,4,6,10');
  });
});
