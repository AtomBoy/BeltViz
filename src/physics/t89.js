/**
 * Tsyganenko T89c external magnetic field model.
 *
 * Computes GSM components of the external magnetic field produced by
 * extra-terrestrial current systems (ring current, magnetotail, closure
 * currents, Chapman-Ferraro + Birkeland currents).
 *
 * This is a direct JavaScript port of the Python geopack t89.py implementation
 * (https://github.com/tsssss/geopack), which is itself a port of the original
 * Fortran code by N.A. Tsyganenko (1989, updated 1992, 1996, 2006).
 *
 * Reference:
 *   Tsyganenko N.A., "A magnetospheric magnetic field model with a warped
 *   tail current sheet", Planet. Space Sci., v.37, pp.5-20, 1989.
 *
 * The 1992 modification added two tilt-angle-dependent terms to the tail
 * current model (parameters ak16, ak17 = a[15], a[16]).
 */

/**
 * T89 coefficient matrix: 7 Kp levels × 30 parameters each.
 * Row index 0-6 = iopt 1-7 = Kp 0, 1, 2, 3, 4, 5, ≥6.
 * Values taken from the Python geopack source (column-major Fortran order).
 */
const PARAMS = [
  // iopt=1 (Kp = 0,0+)
  [-116.53, -10719.0, 42.375, 59.753, -11363.0, 1.7844, 30.268,
    -3.5372e-2, -6.6832e-2, 1.6456e-2, -1.3024, 1.6529e-3, 2.0293e-3,
    20.289, -2.5203e-2, 224.91, -9234.8, 22.788, 7.8813, 1.8362,
    -0.27228, 8.8184, 2.8714, 14.468, 32.177, 0.01, 0.0, 7.0459, 4.0, 20.0],
  // iopt=2 (Kp = 1-,1,1+)
  [-55.553, -13198.0, 60.647, 61.072, -16064.0, 2.2534, 34.407,
    -3.8887e-2, -9.4571e-2, 2.7154e-2, -1.3901, 1.3460e-3, 1.3238e-3,
    23.005, -3.0565e-2, 55.047, -3875.7, 20.178, 7.9693, 1.4575,
    0.89471, 9.4039, 3.5215, 14.474, 36.555, 0.01, 0.0, 7.0787, 4.0, 20.0],
  // iopt=3 (Kp = 2-,2,2+)
  [-101.34, -13480.0, 111.35, 12.386, -24699.0, 2.6459, 38.948,
    -3.4080e-2, -0.12404, 2.9702e-2, -1.4052, 1.2103e-3, 1.6381e-3,
    24.49, -3.7705e-2, -298.32, 4400.9, 18.692, 7.9064, 1.3047,
    2.4541, 9.7012, 7.1624, 14.288, 33.822, 0.01, 0.0, 6.7442, 4.0, 20.0],
  // iopt=4 (Kp = 3-,3,3+)
  [-181.69, -12320.0, 173.79, -96.664, -39051.0, 3.2633, 44.968,
    -4.6377e-2, -0.16686, 4.8298e-2, -1.5473, 1.0277e-3, 3.1632e-3,
    27.341, -5.0655e-2, -514.10, 12482.0, 16.257, 8.5834, 1.0194,
    3.6148, 8.6042, 5.5057, 13.778, 32.373, 0.01, 0.0, 7.3195, 4.0, 20.0],
  // iopt=5 (Kp = 4-,4,4+)
  [-436.54, -9001.0, 323.66, -410.08, -50340.0, 3.9932, 58.524,
    -3.8519e-2, -0.26822, 7.4528e-2, -1.4268, -1.0985e-3, 9.6613e-3,
    27.557, -5.6522e-2, -867.03, 20652.0, 14.101, 8.3501, 0.72996,
    3.8149, 9.2908, 6.4674, 13.729, 28.353, 0.01, 0.0, 7.4237, 4.0, 20.0],
  // iopt=6 (Kp = 5-,5,5+)
  [-707.77, -4471.9, 432.81, -435.51, -60400.0, 4.6229, 68.178,
    -8.8245e-2, -0.21002, 0.11846, -2.6711, 2.2305e-3, 1.0910e-2,
    27.547, -5.4080e-2, -424.23, 1100.2, 13.954, 7.5337, 0.89714,
    3.7813, 8.2945, 5.174, 14.213, 25.237, 0.01, 0.0, 7.0037, 4.0, 20.0],
  // iopt=7 (Kp >= 6-)
  [-1190.4, 2749.9, 742.56, -1110.3, -77193.0, 7.6727, 102.05,
    -9.6015e-2, -0.74507, 0.11214, -1.3614, 1.5157e-3, 2.2283e-2,
    23.164, -7.4146e-2, -2219.1, 48253.0, 12.714, 7.6777, 0.57138,
    2.9633, 9.3909, 9.7263, 11.123, 21.558, 0.01, 0.0, 4.4518, 4.0, 20.0],
];

/**
 * Core T89 external field computation.
 * Translated directly from the Python geopack extern() function.
 *
 * @param {number[]} a - 30-element parameter array for the chosen Kp level
 * @param {number} x  - GSM x in Earth radii (sunward)
 * @param {number} y  - GSM y in Earth radii (duskward)
 * @param {number} z  - GSM z in Earth radii (northward)
 * @param {number} tilt - Dipole tilt angle in radians
 * @returns {number[]} [bx, by, bz] external field in nT (GSM frame)
 */
function extern(a, x, y, z, tilt) {
  // Fixed model constants
  const a02 = 25.0, xlw2 = 170.0, rt = 30.0;
  const xd = 0.0, xld2 = 40.0;
  const sxc = 4.0, xlwc2 = 50.0;

  // Parameter aliases
  const dyc = a[29];
  const dx  = a[17];
  const adr = a[18];
  const d0  = a[19];
  const dd  = a[20];
  const rc  = a[21];
  const g   = a[22];
  const at  = a[23];
  const p   = a[24];
  const delt = a[25];
  const q   = a[26];
  const sx  = a[27];
  const gam = a[28];

  // Precomputed constants
  const ha02    = 0.5 * a02;
  const dyc2    = dyc * dyc;
  const rdyc2   = 1.0 / dyc2;
  const drdyc2  = -2.0 * rdyc2;
  const hlwc2m  = -0.5 * xlwc2;
  const hxlw2m  = -0.5 * xlw2;
  const hxld2m  = -0.5 * xld2;
  const dbldel  = 2.0 * delt;

  // Weight constants for Chapman-Ferraro field (enforce div B = 0)
  const w1 = -0.5 / dx;
  const w2 = w1 * 2.0;
  const w4 = -1.0 / 3.0;
  const w3 = w4 / dx;
  const w5 = -0.5;
  const w6 = -3.0;

  // Linear parameters ak1..ak17 = a[0]..a[16]
  const [ak1, ak2, ak3, ak4, ak5, ak6, ak7, ak8, ak9,
         ak10, ak11, ak12, ak13, ak14, ak15, ak16, ak17] = a;

  // Precomputed CF coefficient combinations
  const ak610 = ak6 * w1 + ak10 * w5;
  const ak711 = ak7 * w2 - ak11;
  const ak812 = ak8 * w2 + ak12 * w6;
  const ak913 = ak9 * w3 + ak13 * w4;

  // Tilt-angle quantities
  const tlt2 = tilt * tilt;
  const sps  = Math.sin(tilt);
  const cps  = Math.cos(tilt);
  const tps  = sps / cps;
  const htp  = tps * 0.5;

  // Coordinate squares
  const x2 = x * x;
  const y2 = y * y;
  const z2 = z * z;

  // Solar-magnetic (SM-like) coordinate rotation by tilt
  const xsm = x * cps - z * sps;
  const zsm = x * sps + z * cps;

  // ── Warped current sheet shape zs and its derivatives ──────────────────────
  const xrc    = xsm + rc;
  const sxrc   = Math.sqrt(xrc * xrc + 16.0);
  const y4     = y2 * y2;
  const y410   = y4 + 1e4;
  const sy4    = sps / y410;
  const zs1    = htp * (xrc - sxrc);
  const dzsx   = -zs1 / sxrc;   // ∂zs/∂xsm
  const zs     = zs1 - g * sy4 * y4;
  const dzsy   = g * (-sy4 / y410 * 4e4 * y2 * y); // ∂zs/∂y

  // ── Ring current contribution ───────────────────────────────────────────────
  const xsm2 = xsm * xsm;
  const dsqt = Math.sqrt(xsm2 + a02);
  const fa0  = 0.5 * (1.0 + xsm / dsqt);
  const ddr  = d0 + dd * fa0;
  const dfa0 = ha02 / (dsqt * dsqt * dsqt);
  const zr   = zsm - zs;
  const tr   = Math.sqrt(zr * zr + ddr * ddr);
  const ro2  = xsm2 + y2;
  const adrt = adr + tr;
  const adrt2 = adrt * adrt;
  const fk   = 1.0 / (adrt2 + ro2);
  const dsfc = Math.sqrt(fk);
  const fc   = fk * fk * dsfc;
  const facxy = 3.0 * adrt * fc / tr;
  const xzr  = xsm * zr;
  const yzr  = y   * zr;
  const xzyz = xsm * dzsx + y * dzsy;
  const faq  = zr * xzyz - ddr * dd * dfa0 * xsm;
  const dbxdp = facxy * xzr;
  const dbzdp = fc * (2.0 * adrt2 - ro2) + facxy * faq;
  // der[0][4] = ring current Bx, der[1][4] = By, der[2][4] = Bz
  const d04 = dbxdp * cps + dbzdp * sps;
  const d14 = facxy * yzr;
  const d24 = dbzdp * cps - dbxdp * sps;

  // ── Tail current sheet contribution ────────────────────────────────────────
  const dely2 = delt * y2;
  let d = d0 + dely2;  // basic half-thickness (dt = d0)
  let adsl = 0.0;
  if (Math.abs(gam) >= 1e-6) {
    const xxd  = xsm - xd;
    const rqd  = 1.0 / (xxd * xxd + xld2);
    const rqds = Math.sqrt(rqd);
    const h    = 0.5 * (1.0 + xxd * rqds);
    const hs   = -hxld2m * rqd * rqds;  // hxld2m = -0.5*xld2, so -hxld2m = +0.5*xld2
    d    = d + gam * h;
    adsl = -d * xsm * gam * hs;
  }
  const d2  = d * d;
  const t   = Math.sqrt(zr * zr + d2);
  const xsmx = xsm - sx;
  const rdsq2 = 1.0 / (xsmx * xsmx + xlw2);
  const rdsq  = Math.sqrt(rdsq2);
  const v    = 0.5 * (1.0 - xsmx * rdsq);
  const dvx  = hxlw2m * rdsq * rdsq2;
  const inner = Math.sqrt(xsm2 + 16.0) - xsm;
  const om   = Math.sqrt(inner);
  const oms  = -om / (om * om + xsm) * 0.5;
  const rdy  = 1.0 / (p + q * om);
  const rdy2 = rdy * rdy;
  const fy   = 1.0 / (1.0 + y2 * rdy2);
  const w    = v * fy;
  const yfy1 = 2.0 * fy * y2 * rdy2;
  const fypr = yfy1 * rdy;
  const fydy = fypr * fy;
  const dwx  = dvx * fy + fydy * q * oms * v;
  const ydwy = -v * yfy1 * fy;
  const ddy  = dbldel * y;
  const att  = at + t;
  const s1   = Math.sqrt(att * att + ro2);
  const f5   = 1.0 / s1;
  const f7   = 1.0 / (s1 + att);
  const f1   = f5 * f7;
  const f3   = f5 * f5 * f5;
  const f9   = att * f3;
  const fs   = zr * xzyz - d * y * ddy + adsl;
  const xdwx = xsm * dwx + ydwy;
  const wt   = w / t;
  const brrz1 = wt * f1;
  const brrz2 = wt * f3;
  const dbxc1 = brrz1 * xzr;
  const dbxc2 = brrz2 * xzr;
  const d100  = brrz1 * yzr;
  const d110  = brrz2 * yzr;
  const wtfs  = wt * fs;
  const dbzc1 = w * f5 + xdwx * f7 + wtfs * f1;
  const dbzc2 = w * f9 + xdwx * f1 + wtfs * f3;
  // der[row][col] for tail terms
  const d000 = dbxc1 * cps + dbzc1 * sps;
  const d001 = dbxc2 * cps + dbzc2 * sps;
  const d200 = dbzc1 * cps - dbxc1 * sps;
  const d201 = dbzc2 * cps - dbxc2 * sps;
  // tilt-modulated tail terms (indices 15,16)
  const d015 = d000 * tlt2;
  const d016 = d001 * tlt2;
  const d115 = d100 * tlt2;
  const d116 = d110 * tlt2;
  const d215 = d200 * tlt2;
  const d216 = d201 * tlt2;

  // ── Closure (return) current contribution ──────────────────────────────────
  const zpl   = z + rt;
  const zmn   = z - rt;
  const rogsm2 = x2 + y2;
  const spl   = Math.sqrt(zpl * zpl + rogsm2);
  const smn   = Math.sqrt(zmn * zmn + rogsm2);
  const xsxc  = x - sxc;
  const rqc2  = 1.0 / (xsxc * xsxc + xlwc2);
  const rqc   = Math.sqrt(rqc2);
  const fyc   = 1.0 / (1.0 + y2 * rdyc2);
  const wc    = 0.5 * (1.0 - xsxc * rqc) * fyc;
  const dwcx  = hlwc2m * rqc2 * rqc * fyc;
  const dwcy  = drdyc2 * wc * fyc * y;
  const szrp  = 1.0 / (spl + zpl);
  const szrm  = 1.0 / (smn - zmn);
  const xywc  = x * dwcx + y * dwcy;
  const wcsp  = wc / spl;
  const wcsm  = wc / smn;
  const fxyp  = wcsp * szrp;
  const fxym  = wcsm * szrm;
  const fxpl  =  x * fxyp;
  const fxmn  = -x * fxym;
  const fypl  =  y * fxyp;
  const fymn  = -y * fxym;
  const fzpl  = wcsp + xywc * szrp;
  const fzmn  = wcsm + xywc * szrm;
  // der[row][2,3] for closure currents
  const d002 = fxpl + fxmn;
  const d003 = (fxpl - fxmn) * sps;
  const d102 = fypl + fymn;
  const d103 = (fypl - fymn) * sps;
  const d202 = fzpl + fzmn;
  const d203 = (fzpl - fzmn) * sps;

  // ── Chapman-Ferraro + Birkeland current contribution ───────────────────────
  const ex    = Math.exp(x / dx);
  const ec    = ex * cps;
  const es    = ex * sps;
  const ecz   = ec * z;
  const esz   = es * z;
  const eszy2 = esz * y2;
  const eszz2 = esz * z2;
  const ecz2  = ecz * z;
  const esy   = es * y;

  // Bx CF terms: der[0][5..8]
  const d005 = ecz;
  const d006 = es;
  const d007 = esy * y;
  const d008 = esz * z;
  // By CF terms: der[1][9..12]
  const d109 = ecz * y;
  const d110b = esy;
  const d111 = esy * y2;
  const d112 = esy * z2;
  // Bz CF terms: der[2][13,14] + mixed
  const d213 = ec;
  const d214 = ec * y2;
  const d205 = ecz2 * w1;
  const d209 = ecz2 * w5;
  const d206 = esz * w2;
  const d210 = -esz;
  const d207 = eszy2 * w2;
  const d211 = eszy2 * w6;
  const d208 = eszz2 * w3;
  const d212 = eszz2 * w4;

  // ── Assemble total external field ──────────────────────────────────────────
  const sx1 = ak6 * d005 + ak7 * d006 + ak8 * d007 + ak9 * d008;
  const sy1 = ak10 * d109 + ak11 * d110b + ak12 * d111 + ak13 * d112;
  const sz1 = ak14 * d213 + ak15 * d214
            + ak610 * ecz2 + ak711 * esz + ak812 * eszy2 + ak913 * eszz2;

  const bxcl = ak3 * d002 + ak4 * d003;
  const bycl = ak3 * d102 + ak4 * d103;
  const bzcl = ak3 * d202 + ak4 * d203;

  const bxt = ak1 * d000 + ak2 * d001 + bxcl + ak16 * d015 + ak17 * d016;
  const byt = ak1 * d100 + ak2 * d110  + bycl + ak16 * d115 + ak17 * d116;
  const bzt = ak1 * d200 + ak2 * d201 + bzcl + ak16 * d215 + ak17 * d216;

  const bxOut = bxt + ak5 * d04 + sx1;
  const byOut = byt + ak5 * d14 + sy1;
  const bzOut = bzt + ak5 * d24 + sz1;

  return [bxOut, byOut, bzOut];
}

/**
 * Compute T89 external magnetic field.
 *
 * @param {number} iopt - Kp level: 1=Kp0, 2=Kp1, 3=Kp2, 4=Kp3, 5=Kp4, 6=Kp5, 7=Kp≥6
 * @param {number} ps   - Dipole tilt angle in radians
 * @param {number} x    - GSM x in Earth radii (sunward positive)
 * @param {number} y    - GSM y in Earth radii (duskward positive)
 * @param {number} z    - GSM z in Earth radii (northward positive)
 * @returns {number[]} [bx, by, bz] external field in nT (GSM frame)
 */
export function t89(iopt, ps, x, y, z) {
  const idx = Math.max(0, Math.min(6, Math.round(iopt) - 1));
  const a = PARAMS[idx];
  return extern(a, x, y, z, ps);
}
