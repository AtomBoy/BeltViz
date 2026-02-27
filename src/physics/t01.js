/**
 * Tsyganenko T01 external magnetic field model.
 *
 * Computes GSM components of the external magnetic field produced by
 * magnetospheric current systems (symmetric ring current, partial ring current,
 * magnetotail, Birkeland currents, dipole shielding, and IMF interconnection).
 *
 * This is a direct JavaScript port of the Python geopack t01.py implementation
 * (https://github.com/tsssss/geopack), which is itself a port of the original
 * Fortran code by N.A. Tsyganenko (2001–2002, corrected June 2006).
 *
 * References:
 *   Tsyganenko N.A., "A new data-based model of the near magnetosphere magnetic
 *   field: 1. Mathematical structure. 2. Parameterization and fitting to
 *   observations." JGR, 2002.
 *
 * Implementation notes:
 *   - The internal magnetopause check (sigma < s0+dsig) from the original Python
 *     is omitted. The caller (solarWind.js) handles boundary fading via the Shue
 *     1998 magnetopause model, exactly as with T89c.
 *   - All Python globals (rh0, g, dxshift1/2, d, deltady, xkappa1/2, sc_sy,
 *     sc_pr, phi) are passed through the call chain as function parameters.
 *   - Always computes the full model (iopgen=0, iopt=0, iopb=0, iopr=0).
 *   - Double-precision arithmetic throughout (JS numbers are IEEE 754 64-bit).
 */

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

/**
 * Compute T01 external magnetic field.
 *
 * @param {number[]} parmod - 10-element parameter array:
 *   [0] pdyn  - solar wind dynamic pressure (nPa)
 *   [1] dst   - Dst index (nT)
 *   [2] byimf - IMF By component (nT, GSM)
 *   [3] bzimf - IMF Bz component (nT, GSM)
 *   [4] g1    - storm-time index G1 (Qin-Denton)
 *   [5] g2    - storm-time index G2 (Qin-Denton)
 *   [6..9]    - unused (set to 0)
 * @param {number} ps - Dipole tilt angle in radians
 * @param {number} x  - GSM x in Earth radii (sunward positive)
 * @param {number} y  - GSM y in Earth radii (duskward positive)
 * @param {number} z  - GSM z in Earth radii (northward positive)
 * @returns {number[]} [bx, by, bz] external field in nT (GSM frame)
 */
export function t01(parmod, ps, x, y, z) {
  const a = [
    1.00000, 2.47341, 0.40791, 0.30429, -0.10637, -0.89108, 3.29350,
    -0.05413, -0.00696, 1.07869, -0.02314, -0.66173, -0.68018, -0.03246,
    0.02681, 0.28062, 0.16535, -0.02939, 0.02639, -0.24891, -0.08063,
    0.08900, -0.02475, 0.05887, 0.57691, 0.65256, -0.03230, 2.24733,
    4.10546, 1.13665, 0.05506, 0.97669, 0.21164, 0.64594, 1.12556, 0.01389,
    1.02978, 0.02968, 0.15821, 9.00519, 28.17582, 1.35285, 0.42279,
  ];

  const pdyn    = parmod[0];
  const dst_ast = parmod[1] * 0.8 - 13.0 * Math.sqrt(pdyn);
  const byimf   = parmod[2];
  const bzimf   = parmod[3];
  const g1      = parmod[4];
  const g2      = parmod[5];

  return extall(a, pdyn, dst_ast, byimf, bzimf, g1, g2, ps, x, y, z);
}

// ---------------------------------------------------------------------------
// extall — main field assembly
// ---------------------------------------------------------------------------

function extall(a, pdyn, dst, byimf, bzimf, vbimf1, vbimf2, ps, x, y, z) {
  // --- xappa coordinate scaling ---
  const xappa  = Math.pow(pdyn / 2.0, a[38]);
  const rh0    = a[39];
  const g      = a[40];
  const xappa3 = xappa * xappa * xappa;

  const xx = x * xappa;
  const yy = y * xappa;
  const zz = z * xappa;

  // --- IMF clock angle ---
  let sthetah = 0.0;
  if (byimf !== 0.0 || bzimf !== 0.0) {
    let theta = Math.atan2(byimf, bzimf);
    if (theta <= 0.0) theta += 2.0 * Math.PI;
    const sh = Math.sin(theta * 0.5);
    sthetah = sh * sh;
  }

  // --- Nonlinear parameters passed down through call chain ---
  const dxshift1 = a[25] + a[26] * vbimf2;
  const dxshift2 = 0.0;
  const d        = a[27];
  const deltady  = a[28];

  const xkappa1  = a[34] + a[35] * vbimf2;
  const xkappa2  = a[36] + a[37] * vbimf2;

  const znam   = Math.abs(dst) < 20.0 ? 20.0 : Math.abs(dst);
  const sc_sy  = a[29] * Math.pow(20.0 / znam, a[30]) * xappa;
  const sc_pr  = a[31] * Math.pow(20.0 / znam, a[32]) * xappa;
  const phi    = 1.5707963 * Math.tanh(Math.abs(dst) / a[33]);

  // --- Dipole shielding (shlcar3x3) ---
  const [cfx, cfy, cfz] = shlcar3x3(xx, yy, zz, ps);
  const bxcf = cfx * xappa3;
  const bycf = cfy * xappa3;
  const bzcf = cfz * xappa3;

  // --- Tail field (deformed, two modes) ---
  const [bxt1, byt1, bzt1, bxt2, byt2, bzt2] =
    deformed(ps, xx, yy, zz, rh0, g, dxshift1, dxshift2, d, deltady);

  // --- Birkeland currents ---
  const [bxr11, byr11, bzr11, bxr12, byr12, bzr12,
         bxr21, byr21, bzr21, bxr22, byr22, bzr22] =
    birk_tot(ps, xx, yy, zz, xkappa1, xkappa2);

  // --- Ring current ---
  const [bxsrc, bysrc, bzsrc, bxprc, byprc, bzprc] =
    full_rc(ps, xx, yy, zz, sc_sy, sc_pr, phi);

  // --- Amplitude factors ---
  const dlp1  = Math.pow(pdyn / 2.0, a[41]);
  const dlp2  = Math.pow(pdyn / 2.0, a[42]);
  const tamp1 = a[1] + a[2] * dlp1 + a[3] * vbimf1 + a[4] * dst;
  const tamp2 = a[5] + a[6] * dlp2 + a[7] * vbimf1 + a[8] * dst;
  const a_src = a[9]  + a[10] * dst + a[11] * Math.sqrt(pdyn);
  const a_prc = a[12] + a[13] * dst + a[14] * Math.sqrt(pdyn);
  const a_r11 = a[15] + a[16] * vbimf2;
  const a_r12 = a[17] + a[18] * vbimf2;
  const a_r21 = a[19] + a[20] * vbimf2;
  const a_r22 = a[21] + a[22] * vbimf2;

  // hximf=0, hyimf=byimf, hzimf=bzimf (penetrated IMF transverse components)
  const aimf1 = a[23];
  const aimf2 = a[24] * sthetah;

  const bx = a[0]*bxcf + tamp1*bxt1 + tamp2*bxt2 + a_src*bxsrc + a_prc*bxprc
           + a_r11*bxr11 + a_r12*bxr12 + a_r21*bxr21 + a_r22*bxr22;
             // hximf = 0, so IMF terms vanish for bx

  const by = a[0]*bycf + tamp1*byt1 + tamp2*byt2 + a_src*bysrc + a_prc*byprc
           + a_r11*byr11 + a_r12*byr12 + a_r21*byr21 + a_r22*byr22
           + (aimf1 + aimf2) * byimf;

  const bz = a[0]*bzcf + tamp1*bzt1 + tamp2*bzt2 + a_src*bzsrc + a_prc*bzprc
           + a_r11*bzr11 + a_r12*bzr12 + a_r21*bzr21 + a_r22*bzr22
           + (aimf1 + aimf2) * bzimf;

  return [bx, by, bz];
}

// ---------------------------------------------------------------------------
// shlcar3x3 — dipole shielding field (2×3×3 Cartesian harmonics)
// ---------------------------------------------------------------------------

function shlcar3x3(x, y, z, ps) {
  const a = [
    -901.2327248, 895.8011176, 817.6208321, -845.5880889, -83.73539535,
     86.58542841, 336.8781402, -329.3619944, -311.2947120, 308.6011161,
     31.94469304, -31.30824526, 125.8739681, -372.3384278, -235.4720434,
    286.7594095, 21.86305585, -27.42344605, -150.4874688, 2.669338538,
     1.395023949, -0.5540427503, -56.85224007, 3.681827033, -43.48705106,
     5.103131905, 1.073551279, -0.6673083508, 12.21404266, 4.177465543,
     5.799964188, -0.3977802319, -1.044652977, 0.5703560010, 3.536082962,
    -3.222069852, 9.620648151, 6.082014949, 27.75216226, 12.44199571,
     5.122226936, 6.982039615, 20.12149582, 6.150973118, 4.663639687,
    15.73319647, 2.303504968, 5.840511214, 0.08385953499, 0.3477844929,
  ];

  const p1 = a[36]; const p2 = a[37]; const p3 = a[38];
  const r1 = a[39]; const r2 = a[40]; const r3 = a[41];
  const q1 = a[42]; const q2 = a[43]; const q3 = a[44];
  const s1 = a[45]; const s2 = a[46]; const s3 = a[47];
  const t1 = a[48]; const t2 = a[49];

  const cps  = Math.cos(ps);
  const sps  = Math.sin(ps);
  const s2ps = 2.0 * cps; // sin(2*ps) approximation per original code

  const st1 = Math.sin(ps * t1); const ct1 = Math.cos(ps * t1);
  const st2 = Math.sin(ps * t2); const ct2 = Math.cos(ps * t2);

  const x1 = x * ct1 - z * st1; const z1 = x * st1 + z * ct1;
  const x2 = x * ct2 - z * st2; const z2 = x * st2 + z * ct2;

  // --- 1st sum: "perpendicular" symmetry (9 terms) ---
  function perp(p, r, z1l, x1l) {
    const sqpr = Math.sqrt(1.0 / (p*p) + 1.0 / (r*r));
    const cyp  = Math.cos(y / p); const syp = Math.sin(y / p);
    const czr  = Math.cos(z1l / r); const szr = Math.sin(z1l / r);
    const expr = Math.exp(sqpr * x1l);
    const fx   = -sqpr * expr * cyp * szr;
    const hy   =  expr / p   * syp * szr;
    const fz   = -expr * cyp / r   * czr;
    return [fx * ct1 + fz * st1, hy, -fx * st1 + fz * ct1];
  }
  function perp3(p, r, z1l, x1l) { // i=3 special case
    const sqpr = Math.sqrt(1.0 / (p*p) + 1.0 / (r*r));
    const cyp  = Math.cos(y / p); const syp = Math.sin(y / p);
    const czr  = Math.cos(z1l / r); const szr = Math.sin(z1l / r);
    const expr = Math.exp(sqpr * x1l);
    const fx   = -expr * cyp * (sqpr * z1l * czr + szr / r * (x1l + 1.0 / sqpr));
    const hy   =  expr / p   * syp * (z1l * czr + x1l / r * szr / sqpr);
    const fz   = -expr * cyp * (czr * (1.0 + x1l / (r*r) / sqpr) - z1l / r * szr);
    return [fx * ct1 + fz * st1, hy, -fx * st1 + fz * ct1];
  }

  const [hx1,hy1,hz1] = perp(p1, r1, z1, x1);
  const [hx2,hy2,hz2] = perp(p1, r2, z1, x1);
  const [hx3,hy3,hz3] = perp3(p1, r3, z1, x1);
  const [hx4,hy4,hz4] = perp(p2, r1, z1, x1);
  const [hx5,hy5,hz5] = perp(p2, r2, z1, x1);
  const [hx6,hy6,hz6] = perp3(p2, r3, z1, x1);
  const [hx7,hy7,hz7] = perp(p3, r1, z1, x1);
  const [hx8,hy8,hz8] = perp(p3, r2, z1, x1);
  const [hx9,hy9,hz9] = perp3(p3, r3, z1, x1);

  const b1 = a[0]+a[1]*cps; const b2 = a[2]+a[3]*cps; const b3 = a[4]+a[5]*cps;
  const b4 = a[6]+a[7]*cps; const b5 = a[8]+a[9]*cps; const b6 = a[10]+a[11]*cps;
  const b7 = a[12]+a[13]*cps; const b8 = a[14]+a[15]*cps; const b9 = a[16]+a[17]*cps;

  let bx = b1*hx1+b2*hx2+b3*hx3+b4*hx4+b5*hx5+b6*hx6+b7*hx7+b8*hx8+b9*hx9;
  let by = b1*hy1+b2*hy2+b3*hy3+b4*hy4+b5*hy5+b6*hy6+b7*hy7+b8*hy8+b9*hy9;
  let bz = b1*hz1+b2*hz2+b3*hz3+b4*hz4+b5*hz5+b6*hz6+b7*hz7+b8*hz8+b9*hz9;

  // --- 2nd sum: "parallel" symmetry (9 terms, uses x2/z2) ---
  function parll(q, s, z2l, x2l) {
    const sqqs = Math.sqrt(1.0 / (q*q) + 1.0 / (s*s));
    const cyq  = Math.cos(y / q); const syq = Math.sin(y / q);
    const czs  = Math.cos(z2l / s); const szs = Math.sin(z2l / s);
    const exqs = Math.exp(sqqs * x2l) * sps;
    const fx   = -sqqs * exqs * cyq * czs;
    const hy   =  exqs / q    * syq * czs;
    const fz   =  exqs / s    * cyq * szs;
    return [fx * ct2 + fz * st2, hy, -fx * st2 + fz * ct2];
  }

  const [qx1,qy1,qz1] = parll(q1, s1, z2, x2);
  const [qx2,qy2,qz2] = parll(q1, s2, z2, x2);
  const [qx3,qy3,qz3] = parll(q1, s3, z2, x2);
  const [qx4,qy4,qz4] = parll(q2, s1, z2, x2);
  const [qx5,qy5,qz5] = parll(q2, s2, z2, x2);
  const [qx6,qy6,qz6] = parll(q2, s3, z2, x2);
  const [qx7,qy7,qz7] = parll(q3, s1, z2, x2);
  const [qx8,qy8,qz8] = parll(q3, s2, z2, x2);
  const [qx9,qy9,qz9] = parll(q3, s3, z2, x2);

  const c1 = a[18]+a[19]*s2ps; const c2 = a[20]+a[21]*s2ps; const c3 = a[22]+a[23]*s2ps;
  const c4 = a[24]+a[25]*s2ps; const c5 = a[26]+a[27]*s2ps; const c6 = a[28]+a[29]*s2ps;
  const c7 = a[30]+a[31]*s2ps; const c8 = a[32]+a[33]*s2ps; const c9 = a[34]+a[35]*s2ps;

  bx += c1*qx1+c2*qx2+c3*qx3+c4*qx4+c5*qx5+c6*qx6+c7*qx7+c8*qx8+c9*qx9;
  by += c1*qy1+c2*qy2+c3*qy3+c4*qy4+c5*qy5+c6*qy6+c7*qy7+c8*qy8+c9*qy9;
  bz += c1*qz1+c2*qz2+c3*qz3+c4*qz4+c5*qz5+c6*qz6+c7*qz7+c8*qz8+c9*qz9;

  return [bx, by, bz];
}

// ---------------------------------------------------------------------------
// deformed — tail field with bending (x-z plane)
// ---------------------------------------------------------------------------

function deformed(ps, x, y, z, rh0, g, dxshift1, dxshift2, d, deltady) {
  const rh2  = -5.2;
  const ieps = 3;

  const sps = Math.sin(ps);
  const r2  = x*x + y*y + z*z;
  const r   = Math.sqrt(r2);
  const zr  = z / r;
  const rh  = rh0 + rh2 * zr * zr;
  const drhdr = -zr / r * 2.0 * rh2 * zr;
  const drhdz =  2.0 * rh2 * zr / r;
  const rrh  = r / rh;
  const f    = Math.pow(1.0 + Math.pow(rrh, ieps), -1.0 / ieps);
  const dfdr = -Math.pow(rrh, ieps - 1) * Math.pow(f, ieps + 1) / rh;
  const dfdrh = -rrh * dfdr;

  const spsas = sps * f;
  const cpsas = Math.sqrt(1.0 - spsas * spsas);

  const xas = x * cpsas - z * spsas;
  const zas = x * spsas + z * cpsas;

  const facps = sps / cpsas * (dfdr + dfdrh * drhdr) / r;
  const psasx = facps * x;
  const psasy = facps * y;
  const psasz = facps * z + sps / cpsas * dfdrh * drhdz;

  const dxasdx =  cpsas - zas * psasx;
  const dxasdy =        - zas * psasy;
  const dxasdz = -spsas - zas * psasz;
  const dzasdx =  spsas + xas * psasx;
  const dzasdy =          xas * psasy;
  const dzasdz =  cpsas + xas * psasz;
  const fac1 = dxasdz * dzasdy - dxasdy * dzasdz;
  const fac2 = dxasdx * dzasdz - dxasdz * dzasdx;
  const fac3 = dzasdx * dxasdy - dxasdx * dzasdy;

  const [bxas1, byas1, bzas1, bxas2, byas2, bzas2] =
    warped(ps, xas, y, zas, g, dxshift1, dxshift2, d, deltady);

  const bx1 = bxas1*dzasdz - bzas1*dxasdz + byas1*fac1;
  const by1 = byas1 * fac2;
  const bz1 = bzas1*dxasdx - bxas1*dzasdx + byas1*fac3;

  const bx2 = bxas2*dzasdz - bzas2*dxasdz + byas2*fac1;
  const by2 = byas2 * fac2;
  const bz2 = bzas2*dxasdx - bxas2*dzasdx + byas2*fac3;

  return [bx1, by1, bz1, bx2, by2, bz2];
}

// ---------------------------------------------------------------------------
// warped — warping in y-z plane
// ---------------------------------------------------------------------------

function warped(ps, x, y, z, g, dxshift1, dxshift2, d, deltady) {
  const xl     = 20.0;
  const sps    = Math.sin(ps);
  const rho2   = y*y + z*z;
  const rho    = Math.sqrt(rho2);

  let phi_w, cphi, sphi;
  if (y === 0.0 && z === 0.0) {
    phi_w = 0.0; cphi = 1.0; sphi = 0.0;
  } else {
    phi_w = Math.atan2(z, y);
    cphi  = y / rho;
    sphi  = z / rho;
  }

  const xl4     = xl * xl * xl * xl;
  const rr4l4   = rho / (rho2 * rho2 + xl4);
  const f       = phi_w + g * rho2 * rr4l4 * cphi * sps;
  const dfdphi  = 1.0 - g * rho2 * rr4l4 * sphi * sps;
  const dfdrho  = g * rr4l4 * rr4l4 * (3.0 * xl4 - rho2 * rho2) * cphi * sps;
  // dfdx = 0 (dgdx=0, dxldx=0)

  const cf  = Math.cos(f);
  const sf  = Math.sin(f);
  const yas = rho * cf;
  const zas = rho * sf;

  const [bx_as1, by_as1, bz_as1, bx_as2, by_as2, bz_as2] =
    unwarped(x, yas, zas, dxshift1, dxshift2, d, deltady);

  // Deform mode 1
  const brho_as1 =  by_as1 * cf + bz_as1 * sf;
  const bphi_as1 = -by_as1 * sf + bz_as1 * cf;
  const brho_s1  = brho_as1 * dfdphi;
  const bphi_s1  = bphi_as1 - rho * (brho_as1 * dfdrho); // bx_as1*dfdx=0
  const bx1      = bx_as1 * dfdphi;
  const by1      = brho_s1 * cphi - bphi_s1 * sphi;
  const bz1      = brho_s1 * sphi + bphi_s1 * cphi;

  // Deform mode 2
  const brho_as2 =  by_as2 * cf + bz_as2 * sf;
  const bphi_as2 = -by_as2 * sf + bz_as2 * cf;
  const brho_s2  = brho_as2 * dfdphi;
  const bphi_s2  = bphi_as2 - rho * (brho_as2 * dfdrho);
  const bx2      = bx_as2 * dfdphi;
  const by2      = brho_s2 * cphi - bphi_s2 * sphi;
  const bz2      = brho_s2 * sphi + bphi_s2 * cphi;

  return [bx1, by1, bz1, bx2, by2, bz2];
}

// ---------------------------------------------------------------------------
// unwarped — shielded tail disk field (two modes)
// ---------------------------------------------------------------------------

function unwarped(x, y, z, dxshift1, dxshift2, d, deltady) {
  const deltadx1 = 1.0; const alpha1 = 1.1; const xshift1 = 6.0;
  const deltadx2 = 0.0; const alpha2 = 0.25; const xshift2 = 4.0;
  const xm1 = -12.0; const xm2 = -12.0;

  const a1 = [
    -25.45869857,   57.35899080,  317.5501869,  -2.626756717, -93.38053698,
   -199.6467926,  -858.8129729,   34.09192395,  845.4214929,  -29.07463068,
     47.10678547, -128.9797943,  -781.7512093,   6.165038619, 167.8905046,
    492.0680410,  1654.724031,   -46.77337920,-1635.922669,    40.86186772,
     -0.1349775602, -0.9661991179e-1, -0.1662302354, 0.002810467517, 0.2487355077,
      0.1025565237, -14.41750229,  -0.8185333989,  11.07693629,  0.7569503173,
     -9.655264745,  112.2446542,   777.5948964,   -5.745008536, -83.03921993,
   -490.2278695, -1155.004209,    39.08023320,  1172.780574,   -39.44349797,
    -14.07211198,  -40.41201127, -313.2277343,    2.203920979,   8.232835341,
    197.7065115,   391.2733948,  -18.57424451,  -437.2779053,   23.04976898,
     11.75673963,   13.60497313,   4.691927060,  18.20923547,   27.59044809,
      6.677425469,   1.398283308,   2.839005878,  31.24817706,   24.53577264,
  ];

  const a2 = [
    -287187.1962,   4970.499233,  410490.1952,  -1347.839052, -386370.3240,
      3317.983750, -143462.3895,   5706.513767,  171176.2904,    250.8882750,
    -506570.8891,   5733.592632,  397975.5842,   9771.762168, -941834.2436,
      7990.975260,  54313.10318,    447.5388060,  528046.3449,  12751.04453,
     -21920.98301,   -21.05075617,  31971.07875,  3012.641612, -301822.9103,
      -3601.107387,  1797.577552,    -6.315855803, 142578.8406,  13161.93640,
     804184.8410,  -14168.99698, -851926.6360,  -1890.885671,  972475.6869,
      -8571.862853,  26432.49197,  -2554.752298, -482308.3431,  -4391.473324,
     105155.9160,   -1134.622050,  -74353.53091, -5382.670711,  695055.0788,
       -916.3365144, -12111.06667,    67.20923358, -367200.9285, -21414.14421,
         14.75567902,   20.75638190,   59.78601609,  16.86431444,   32.58482365,
         23.69472951,   17.24977936,   13.64902647,  68.40989058,   11.67828167,
  ];

  let bx1 = 0.0, by1 = 0.0, bz1 = 0.0;
  let bx2 = 0.0, by2 = 0.0, bz2 = 0.0;

  // Mode 1 (iopt=0 or iopt=1)
  {
    const xsc1  = (x - xshift1 - dxshift1) * alpha1 - xm1 * (alpha1 - 1.0);
    const ysc1  = y * alpha1;
    const zsc1  = z * alpha1;
    const d0sc1 = d * alpha1;
    const [fx1, fy1, fz1] = taildisk(d0sc1, deltadx1, deltady, xsc1, ysc1, zsc1);
    const [hx1, hy1, hz1] = shlcar5x5(a1, x, y, z, dxshift1);
    bx1 = fx1 + hx1; by1 = fy1 + hy1; bz1 = fz1 + hz1;
  }

  // Mode 2 (iopt=0 or iopt=2)
  {
    const xsc2  = (x - xshift2 - dxshift2) * alpha2 - xm2 * (alpha2 - 1.0);
    const ysc2  = y * alpha2;
    const zsc2  = z * alpha2;
    const d0sc2 = d * alpha2;
    const [fx2, fy2, fz2] = taildisk(d0sc2, deltadx2, deltady, xsc2, ysc2, zsc2);
    const [hx2, hy2, hz2] = shlcar5x5(a2, x, y, z, dxshift2);
    bx2 = fx2 + hx2; by2 = fy2 + hy2; bz2 = fz2 + hz2;
  }

  return [bx1, by1, bz1, bx2, by2, bz2];
}

// ---------------------------------------------------------------------------
// shlcar5x5 — tail shielding field (5×5 Cartesian harmonics)
// ---------------------------------------------------------------------------

function shlcar5x5(a, x, y, z, dshift) {
  let dhx = 0.0, dhy = 0.0, dhz = 0.0;
  let l = 0;
  for (let i = 0; i < 5; i++) {
    const rp   = 1.0 / a[50 + i];
    const cypi = Math.cos(y * rp);
    const sypi = Math.sin(y * rp);
    for (let k = 0; k < 5; k++) {
      const rr   = 1.0 / a[55 + k];
      const szrk = Math.sin(z * rr);
      const czrk = Math.cos(z * rr);
      const sqpr = Math.sqrt(rp*rp + rr*rr);
      const epr  = Math.exp(x * sqpr);
      const dbx  = -sqpr * epr * cypi * szrk;
      const dby  =    rp * epr * sypi * szrk;
      const dbz  =   -rr * epr * cypi * czrk;
      const coef = a[l] + a[l + 1] * dshift;
      l += 2;
      dhx += coef * dbx;
      dhy += coef * dby;
      dhz += coef * dbz;
    }
  }
  return [dhx, dhy, dhz];
}

// ---------------------------------------------------------------------------
// taildisk — tail current disk field
// ---------------------------------------------------------------------------

function taildisk(d0, deltadx, deltady, x, y, z) {
  const f = [-71.09346626, -1014.308601, -1272.939359, -3224.935936, -44546.86232];
  const b = [10.90101242, 12.68393898, 13.51791954, 14.86775017, 15.12306404];
  const c = [0.7954069972, 0.6716601849, 1.174866319, 2.565249920, 10.01986790];

  const rho    = Math.sqrt(x*x + y*y);
  const drhodx = x / rho;
  const drhody = y / rho;
  const dex    = Math.exp(x / 7.0);
  const dd     = d0 + deltady * (y / 20.0) * (y / 20.0) + deltadx * dex;
  const dddy   = deltady * y * 0.005;
  const dddx   = deltadx / 7.0 * dex;
  const dzeta  = Math.sqrt(z*z + dd*dd);
  const ddzetadx = dd * dddx / dzeta;
  const ddzetady = dd * dddy / dzeta;
  const ddzetadz = z / dzeta;

  let dbx = 0.0, dby = 0.0, dbz = 0.0;
  for (let i = 0; i < 5; i++) {
    const bi = b[i]; const ci = c[i];
    const s1 = Math.sqrt((rho + bi)*(rho + bi) + (dzeta + ci)*(dzeta + ci));
    const s2 = Math.sqrt((rho - bi)*(rho - bi) + (dzeta + ci)*(dzeta + ci));
    const ds1drho = (rho + bi) / s1;
    const ds2drho = (rho - bi) / s2;
    const ds1ddz  = (dzeta + ci) / s1;
    const ds2ddz  = (dzeta + ci) / s2;
    const ds1dx   = ds1drho * drhodx + ds1ddz * ddzetadx;
    const ds1dy   = ds1drho * drhody + ds1ddz * ddzetady;
    const ds1dz   =                    ds1ddz * ddzetadz;
    const ds2dx   = ds2drho * drhodx + ds2ddz * ddzetadx;
    const ds2dy   = ds2drho * drhody + ds2ddz * ddzetady;
    const ds2dz   =                    ds2ddz * ddzetadz;
    const s1ts2   = s1 * s2;
    const s1ps2   = s1 + s2;
    const s1ps2sq = s1ps2 * s1ps2;
    const bi2     = 2.0 * bi;
    const fac1    = Math.sqrt(s1ps2sq - bi2 * bi2);
    const asas    = fac1 / (s1ts2 * s1ps2sq);
    const dasds1  = (1.0 / (fac1 * s2) - asas / s1ps2 * (s2*s2 + s1*(3.0*s1 + 4.0*s2))) / (s1 * s1ps2);
    const dasds2  = (1.0 / (fac1 * s1) - asas / s1ps2 * (s1*s1 + s2*(3.0*s2 + 4.0*s1))) / (s2 * s1ps2);
    const dasdx   = dasds1 * ds1dx + dasds2 * ds2dx;
    const dasdy   = dasds1 * ds1dy + dasds2 * ds2dy;
    const dasdz   = dasds1 * ds1dz + dasds2 * ds2dz;
    dbx -= f[i] * x * dasdz;
    dby -= f[i] * y * dasdz;
    dbz += f[i] * (2.0 * asas + x * dasdx + y * dasdy);
  }
  return [dbx, dby, dbz];
}

// ---------------------------------------------------------------------------
// birk_tot — total Birkeland current field (4 modes)
// ---------------------------------------------------------------------------

function birk_tot(ps, x, y, z, xkappa1, xkappa2) {
  const sh11 = [
     46488.84663, -15541.95244, -23210.09824, -32625.03856, -109894.4551,
    -71415.32808,  58168.94612,  55564.87578, -22890.60626,  -6056.763968,
      5091.368100,   239.7001538, -13899.49253,   4648.016991,   6971.310672,
      9699.351891,  32633.34599,  21028.48811, -17395.96190, -16461.11037,
      7447.621471,  2528.844345,  -1934.094784,  -588.3108359, -32588.88216,
     10894.11453,  16238.25044,  22925.60557,  77251.11274,  50375.97787,
    -40763.78048, -39088.60660,  15546.53559,   3559.617561,  -3187.730438,
       309.1487975,    88.22153914,  -243.0721938,   -63.63543051,   191.1109142,
        69.94451996,  -187.9539415,   -49.89923833,   104.0902848,  -120.2459738,
       253.5572433,    89.25456949,  -205.6516252,   -44.93654156,   124.7026309,
        32.53005523,   -98.85321751,   -36.51904756,    98.88241690,    24.88493459,
       -55.04058524,    61.14493565,  -128.4224895,   -45.35023460,   105.0548704,
       -43.66748755,   119.3284161,    31.38442798,   -92.87946767,   -33.52716686,
        89.98992001,    25.87341323,   -48.86305045,    59.69362881,  -126.5353789,
       -44.39474251,   101.5196856,    59.41537992,    41.18892281,    80.86101200,
         3.066809418,    7.893523804,   30.56212082,    10.36861082,     8.222335945,
        19.97575641,     2.050148531,    4.992657093,     2.300564232,    0.2256245602,
        -0.05841594319,
  ];
  const sh12 = [
     210260.4816, -1443587.401, -1468919.281,   281939.2993, -1131124.839,
     729331.7943,  2573541.307,   304616.7457,   468887.5847,   181554.7517,
   -1300722.650,  -257012.8601,   645888.8041, -2048126.412, -2529093.041,
     571093.7972, -2115508.353,  1122035.951,  4489168.802,    75234.22743,
     823905.6909,   147926.6121, -2276322.876,  -155528.5992,  -858076.2979,
    3474422.388,  3986279.931,  -834613.9747,  3250625.781, -1818680.377,
   -7040468.986,  -414359.6073, -1295117.666,  -346320.6487,  3565527.409,
     430091.9496,    -0.1565573462,    7.377619826,    0.4115646037,   -6.146078880,
       3.808028815,    -0.5232034932,    1.454841807,  -12.32274869,    -4.466974237,
      -2.941184626,    -0.6172620658,   12.64613490,    1.494922012,  -21.35489898,
      -1.652256960,    16.81799898,    -1.404079922,  -24.09369677,   -10.99900839,
      45.94237820,     2.248579894,    31.91234041,    7.575026816,  -45.80833339,
      -1.507664976,    14.60016998,     1.348516288,  -11.05980247,    -5.402866968,
      31.69094514,    12.28261196,   -37.55354174,    4.155626879,  -33.70159657,
      -8.437907434,    36.22672602,   145.0262164,    70.73187036,    85.51110098,
      21.47490989,    24.34554406,    31.34405345,     4.655207476,    5.747889264,
       7.802304187,     1.844169801,    4.867254550,    2.941393119,    0.1379899178,
       0.06607020029,
  ];
  const sh21 = [
     162294.6224,   503885.1125,  -27057.67122,  -531450.1339,   84747.05678,
    -237142.1712,   84133.61490,  259530.0402,   69196.05160,  -189093.5264,
     -19278.55134,  195724.5034, -263082.6367,  -818899.6923,   43061.10073,
     863506.6932,  -139707.9428,  389984.8850,  -135167.5555,  -426286.9206,
    -109504.0387,   295258.3531,   30415.07087,  -305502.9405,  100785.3400,
     315010.9567,  -15999.50673, -332052.2548,   54964.34639,  -152808.3750,
      51024.67566,  166720.0603,   40389.67945,  -106257.7272,  -11126.14442,
     109876.2047,     2.978695024,   558.6019011,    2.685592939,  -338.0004730,
      -81.99724090,  -444.1102659,    89.44617716,   212.0849592,   -32.58562625,
      -982.7336105,   -35.10860935,   567.8931751,    -1.917212423,  -260.2023543,
        -1.023821735,  157.5533477,    23.00200055,   232.0603673,   -36.79100036,
      -111.9110936,    18.05429984,   447.0481000,    15.10187415,  -258.7297813,
        -1.032340149, -298.6402478,    -1.676201415,  180.5856487,    64.52313024,
       209.0160857,   -53.85574010,   -98.52164290,   14.35891214,   536.7666279,
        20.09318806,  -309.7349530,    58.54144539,    67.45226850,   97.92374406,
         4.752449760,   10.46824379,   32.91856110,    12.05124381,    9.962933904,
        15.91258637,    1.804233877,    6.578149088,    2.515223491,   0.1930034238,
        -0.02261109942,
  ];
  const sh22 = [
    -131287.8986,  -631927.6885,  -318797.4173,   616785.8782,  -50027.36189,
     863099.9833,   47680.20240, -1053367.944,   -501120.3811,  -174400.9476,
     222328.6873,   333551.7374,  -389338.7841, -1995527.467,   -982971.3024,
    1960434.268,   297239.7137,  2676525.168,   -147113.4775, -3358059.979,
   -2106979.191,  -462827.1322,  1017607.960,  1039018.475,    520266.9296,
    2627427.473,  1301981.763, -2577171.706,   -238071.9956, -3539781.111,
      94628.16420, 4411304.724,  2598205.733,    637504.9351, -1234794.298,
   -1372562.403,    -2.646186796,  -31.10055575,    2.295799273,   19.20203279,
      30.01931202,  -302.1028550,   -14.78310655,   162.1561899,    0.4943938056,
     176.8089129,    -0.2444921680, -100.6148929,     9.172262228,  137.4303440,
      -8.451613443,   -84.20684224, -167.3354083,  1321.830393,    76.89928813,
    -705.7586223,    18.28186732,  -770.1665162,    -9.084224422,  436.3368157,
      -6.374255638,  -107.2730177,    6.080451222,   65.53843753,   143.2872994,
   -1028.009017,    -64.22739330,   547.8536586,   -20.58928632,   597.3893669,
      10.17964133,  -337.7800252,   159.3532209,    76.34445954,    84.74398828,
      12.76722651,   27.63870691,   32.69873634,     5.145153451,    6.310949163,
       6.996159733,   1.971629939,   4.436299219,    2.904964304,   0.1486276863,
       0.06859991529,
  ];

  // Region 1 (xkappa1)
  const x_sc1 = xkappa1 - 1.1;
  const [fx11, fy11, fz11] = birk_1n2(1, 1, ps, x, y, z, xkappa1);
  const [hx11, hy11, hz11] = birk_shl(sh11, ps, x_sc1, x, y, z);
  const bx11 = fx11 + hx11; const by11 = fy11 + hy11; const bz11 = fz11 + hz11;

  const [fx12, fy12, fz12] = birk_1n2(1, 2, ps, x, y, z, xkappa1);
  const [hx12, hy12, hz12] = birk_shl(sh12, ps, x_sc1, x, y, z);
  const bx12 = fx12 + hx12; const by12 = fy12 + hy12; const bz12 = fz12 + hz12;

  // Region 2 (xkappa2)
  const x_sc2 = xkappa2 - 1.0;
  const [fx21, fy21, fz21] = birk_1n2(2, 1, ps, x, y, z, xkappa2);
  const [hx21, hy21, hz21] = birk_shl(sh21, ps, x_sc2, x, y, z);
  const bx21 = fx21 + hx21; const by21 = fy21 + hy21; const bz21 = fz21 + hz21;

  const [fx22, fy22, fz22] = birk_1n2(2, 2, ps, x, y, z, xkappa2);
  const [hx22, hy22, hz22] = birk_shl(sh22, ps, x_sc2, x, y, z);
  const bx22 = fx22 + hx22; const by22 = fy22 + hy22; const bz22 = fz22 + hz22;

  return [bx11,by11,bz11, bx12,by12,bz12, bx21,by21,bz21, bx22,by22,bz22];
}

// ---------------------------------------------------------------------------
// birk_1n2 — Birkeland region 1 or 2 field (one mode)
// ---------------------------------------------------------------------------

function birk_1n2(numb, mode, ps, x, y, z, xkappa) {
  const beta  = 0.9;
  const rh    = 10.0;
  const eps   = 3.0;
  const b     = 0.5;
  const rho_0 = 7.0;

  const a11 = [
    0.1618068350, -0.1797957553,  2.999642482,  -0.9322708978, -0.6811059760,
    0.2099057262, -8.358815746,  -14.86033550,   0.3838362986, -16.30945494,
    4.537022847,   2.685836007,  27.97833029,    6.330871059,   1.876532361,
   18.95619213,   0.9651528100,  0.4217195118,  -0.08957770020, -1.823555887,
    0.7457045438, -0.5785916524, -1.010200918,   0.01112389357,  0.09572927448,
   -0.3599292276,  8.713700514,   0.9763932955,  3.834602998,   2.492118385,  0.7113544659,
  ];
  const a12 = [
    0.7058026940, -0.2845938535,  5.715471266,  -2.472820880,  -0.7738802408,
    0.3478293930, -11.37653694,  -38.64768867,   0.6932927651, -212.4017288,
    4.944204937,   3.071270411,  33.05882281,    7.387533799,   2.366769108,
   79.22572682,   0.6154290178,  0.5592050551,  -0.1796585105,  -1.654932210,
    0.7309108776, -0.4926292779, -1.130266095,  -0.009613974555, 0.1484586169,
   -0.2215347198,  7.883592948,   0.02768251655,  2.950280953,   1.212634762,  0.5567714182,
  ];
  const a21 = [
    0.1278764024, -0.2320034273,  1.805623266,  -32.37241440,  -0.9931490648,
    0.3175085630, -2.492465814,  -16.21600096,   0.2695393416,  -6.752691265,
    3.971794901,  14.54477563,   41.10158386,    7.912889730,   1.258297372,
    9.583547721,   1.014141963,   0.5104134759,  -0.1790430468,  -1.756358428,
    0.7561986717, -0.6775248254, -0.04014016420,  0.01446794851,  0.1200521731,
   -0.2203584559,  4.508963850,   0.8221623576,   1.779933730,   1.102649543,  0.8867880020,
  ];
  const a22 = [
    0.4036015198, -0.3302974212,  2.827730930,  -45.44405830,  -1.611103927,
    0.4927112073, -0.003258457559, -49.59014949,  0.3796217108, -233.7884098,
    4.312666980,  18.05051709,   28.95320323,   11.09948019,    0.7471649558,
   67.10246193,   0.5667096597,   0.6468519751,  -0.1560665317,  -1.460805289,
    0.7719653528, -0.6658988668,   0.2515179349e-5, 0.02426021891, 0.1195003324,
   -0.2625739255,  4.377172556,   0.2421190547,   2.503482679,   1.071587299,  0.7247997430,
  ];

  const dphi   = numb === 1 ? 0.055 : 0.030;
  const dtheta = numb === 1 ? 0.06  : 0.09;

  const xsc  = x * xkappa;
  const ysc  = y * xkappa;
  const zsc  = z * xkappa;
  const rho2 = xsc*xsc + zsc*zsc;
  const rho  = Math.sqrt(rho2);
  const rsc  = Math.sqrt(xsc*xsc + ysc*ysc + zsc*zsc);
  const rho0_2 = rho_0 * rho_0;

  let phi_c;
  if (xsc === 0.0 && zsc === 0.0) {
    phi_c = 0.0;
  } else {
    phi_c = Math.atan2(-zsc, xsc);
  }
  const sphic = Math.sin(phi_c);
  const cphic = Math.cos(phi_c);

  const brack  = dphi + b * rho0_2 / (rho0_2 + 1.0) * (rho*rho - 1.0) / (rho0_2 + rho*rho);
  const r1rh   = (rsc - 1.0) / rh;
  const denom_eps = Math.pow(1.0 + Math.pow(r1rh, eps), 1.0 / eps);
  const psias  = beta * ps / denom_eps;

  const phis      = phi_c - brack * Math.sin(phi_c) - psias;
  const dphisphi  = 1.0 - brack * Math.cos(phi_c);
  const dphisrho  = -2.0 * b * rho0_2 * rho / ((rho0_2 + rho*rho) * (rho0_2 + rho*rho)) * Math.sin(phi_c)
                  + beta * ps * Math.pow(r1rh, eps - 1.0) * rho / (rh * rsc * denom_eps * (1.0 + Math.pow(r1rh, eps)));
  const dphisdy   = beta * ps * Math.pow(r1rh, eps - 1.0) * ysc / (rh * rsc * denom_eps * (1.0 + Math.pow(r1rh, eps)));

  const sphics = Math.sin(phis);
  const cphics = Math.cos(phis);
  const xs     =  rho * cphics;
  const zs     = -rho * sphics;

  let aCoeff;
  if (numb === 1) {
    aCoeff = (mode === 1) ? a11 : a12;
  } else {
    aCoeff = (mode === 1) ? a21 : a22;
  }

  const [bxs, byas, bzs] = twocones(aCoeff, xs, ysc, zs, dtheta, mode);

  const brhoas =  bxs * cphics - bzs * sphics;
  const bphias = -bxs * sphics - bzs * cphics;

  const brho_s = brhoas * dphisphi                                  * xkappa;
  const bphi_s = (bphias - rho * (byas * dphisdy + brhoas * dphisrho)) * xkappa;
  const by_s   = byas * dphisphi                                    * xkappa;

  const bx_out =  brho_s * cphic - bphi_s * sphic;
  const by_out =  by_s;
  const bz_out = -brho_s * sphic - bphi_s * cphic;

  return [bx_out, by_out, bz_out];
}

// ---------------------------------------------------------------------------
// twocones — northern + southern Birkeland cone pair
// ---------------------------------------------------------------------------

function twocones(a, x, y, z, dtheta, m) {
  const [bxn, byn, bzn] = one_cone(a, x,  y,  z, dtheta, m);
  const [bxs, bys, bzs] = one_cone(a, x, -y, -z, dtheta, m);
  return [bxn - bxs, byn + bys, bzn + bzs];
}

// ---------------------------------------------------------------------------
// one_cone — single Birkeland cone field
// ---------------------------------------------------------------------------

function one_cone(a, x, y, z, dtheta, m) {
  const dr = 1e-6;
  const dt = 1e-6;
  const theta0 = a[30];

  const rho2  = x*x + y*y;
  const rho   = Math.sqrt(rho2);
  const r     = Math.sqrt(rho2 + z*z);
  const theta = Math.atan2(rho, z);
  const phi   = Math.atan2(y, x);

  const rs     = r_s(a, r, theta);
  const thetas = theta_s(a, r, theta);

  const [btast, bfast] = fialcos(rs, thetas, phi, m, theta0, dtheta);

  const drsdr  = (r_s(a, r + dr, theta) - r_s(a, r - dr, theta)) / (2.0 * dr);
  const drsdt  = (r_s(a, r, theta + dt) - r_s(a, r, theta - dt)) / (2.0 * dt);
  const dtsdr  = (theta_s(a, r + dr, theta) - theta_s(a, r - dr, theta)) / (2.0 * dr);
  const dtsdt  = (theta_s(a, r, theta + dt) - theta_s(a, r, theta - dt)) / (2.0 * dt);

  const stsst = Math.sin(thetas) / Math.sin(theta);
  const rsr   = rs / r;

  const br     = -rsr / r * stsst * btast * drsdt;
  const btheta =  rsr       * stsst * btast * drsdr;
  const bphi   =  rsr * bfast * (drsdr * dtsdt - drsdt * dtsdr);

  const s  = rho / r;
  const c  = z / r;
  const sf = rho > 0.0 ? y / rho : 0.0;
  const cf = rho > 0.0 ? x / rho : 1.0;
  const be = br * s + btheta * c;

  return [
    a[0] * (be * cf - bphi * sf),
    a[0] * (be * sf + bphi * cf),
    a[0] * (br * c  - btheta * s),
  ];
}

// ---------------------------------------------------------------------------
// r_s, theta_s — deformed spherical coordinates
// ---------------------------------------------------------------------------

function r_s(a, r, theta) {
  const cos1 = Math.cos(theta);
  const cos2 = Math.cos(2.0 * theta);
  return r
    + a[1] / r
    + a[2] * r / Math.sqrt(r*r + a[10]*a[10])
    + a[3] * r / (r*r + a[11]*a[11])
    + (a[4] + a[5] / r
       + a[6] * r / Math.sqrt(r*r + a[12]*a[12])
       + a[7] * r / (r*r + a[13]*a[13])) * cos1
    + (a[8] * r / Math.sqrt(r*r + a[14]*a[14])
       + a[9] * r / Math.pow(r*r + a[15]*a[15], 2)) * cos2;
}

function theta_s(a, r, theta) {
  const sin1 = Math.sin(theta);
  const sin2 = Math.sin(2.0 * theta);
  const sin3 = Math.sin(3.0 * theta);
  return theta
    + (a[16] + a[17] / r + a[18] / (r*r)
       + a[19] * r / Math.sqrt(r*r + a[26]*a[26])) * sin1
    + (a[20] + a[21] * r / Math.sqrt(r*r + a[27]*a[27])
       + a[22] * r / (r*r + a[28]*a[28])) * sin2
    + (a[23] + a[24] / r
       + a[25] * r / (r*r + a[29]*a[29])) * sin3;
}

// ---------------------------------------------------------------------------
// fialcos — conical Birkeland current potential
// ---------------------------------------------------------------------------

function fialcos(r, theta, phi, n, theta0, dt) {
  const btn  = new Array(10).fill(0.0);
  const bpn  = new Array(10).fill(0.0);
  const ccos = new Array(10).fill(0.0);
  const ssin = new Array(10).fill(0.0);

  const sinte = Math.sin(theta);
  const ro    = r * sinte;
  const coste = Math.cos(theta);
  const sinfi = Math.sin(phi);
  const cosfi = Math.cos(phi);
  const tg    = sinte / (1.0 + coste);   // tan(theta/2)
  const ctg   = sinte / (1.0 - coste);   // cot(theta/2)

  const tetanp = theta0 + dt;
  const tetanm = theta0 - dt;
  let tgp = 0.0, tgm = 0.0, tgm2 = 0.0, tgp2 = 0.0;
  if (theta >= tetanm) {
    tgp  = Math.tan(tetanp * 0.5);
    tgm  = Math.tan(tetanm * 0.5);
    tgm2 = tgm * tgm;
    tgp2 = tgp * tgp;
  }

  let cosm1 = 1.0, sinm1 = 0.0;
  let tm = 1.0;
  let tgm2m = 1.0, tgp2m = 1.0;

  for (let mi = 1; mi <= n; mi++) {
    tm = tm * tg;
    ccos[mi-1] = cosm1 * cosfi - sinm1 * sinfi;
    ssin[mi-1] = sinm1 * cosfi + cosm1 * sinfi;
    cosm1 = ccos[mi-1];
    sinm1 = ssin[mi-1];

    let t = 0.0, dtt = 0.0;
    if (theta < tetanm) {
      t   = tm;
      dtt = 0.5 * mi * tm * (tg + ctg);
    } else if (theta < tetanp) {
      tgm2m = tgm2m * tgm2;
      const fc  = 1.0 / (tgp - tgm);
      const fc1 = 1.0 / (2.0 * mi + 1.0);
      const tgm2m1 = tgm2m * tgm;
      const tg21   = 1.0 + tg * tg;
      t   = fc * (tm * (tgp - tg) + fc1 * (tm * tg - tgm2m1 / tm));
      dtt = 0.5 * mi * fc * tg21 * (tm / tg * (tgp - tg) - fc1 * (tm - tgm2m1 / (tm * tg)));
    } else {
      tgp2m = tgp2m * tgp2;
      tgm2m = tgm2m * tgm2;
      const fc  = 1.0 / (tgp - tgm);
      const fc1 = 1.0 / (2.0 * mi + 1.0);
      t   = fc * fc1 * (tgp2m * tgp - tgm2m * tgm) / tm;
      dtt = -t * mi * 0.5 * (tg + ctg);
    }

    btn[mi-1] =  mi * t * ccos[mi-1] / ro;
    bpn[mi-1] = -dtt * ssin[mi-1] / r;
  }

  return [btn[n-1] * 800.0, bpn[n-1] * 800.0];
}

// ---------------------------------------------------------------------------
// birk_shl — Birkeland current shielding
// ---------------------------------------------------------------------------

function birk_shl(a, ps, x_sc, x, y, z) {
  const cps  = Math.cos(ps);
  const sps  = Math.sin(ps);
  const s3ps = 2.0 * cps;

  const pst1 = ps * a[84]; const pst2 = ps * a[85];
  const st1  = Math.sin(pst1); const ct1 = Math.cos(pst1);
  const st2  = Math.sin(pst2); const ct2 = Math.cos(pst2);
  const x1   = x * ct1 - z * st1; const z1 = x * st1 + z * ct1;
  const x2   = x * ct2 - z * st2; const z2 = x * st2 + z * ct2;

  let l = 0;
  let bx = 0.0, by = 0.0, bz = 0.0;

  for (let m = 0; m < 2; m++) {
    for (let i = 0; i < 3; i++) {
      const p    = a[72 + i];
      const q    = a[78 + i];
      const cypi = Math.cos(y / p); const sypi = Math.sin(y / p);
      const cyqi = Math.cos(y / q); const syqi = Math.sin(y / q);

      for (let k = 0; k < 3; k++) {
        const r    = a[75 + k];
        const s    = a[81 + k];
        const szrk = Math.sin(z1 / r); const czrk = Math.cos(z1 / r);
        const czsk = Math.cos(z2 / s); const szsk = Math.sin(z2 / s);
        const sqpr = Math.sqrt(1.0 / (p*p) + 1.0 / (r*r));
        const sqqs = Math.sqrt(1.0 / (q*q) + 1.0 / (s*s));
        const epr  = Math.exp(x1 * sqpr);
        const eqs  = Math.exp(x2 * sqqs);

        let fx, fy, fz;
        if (m === 0) {
          fx = -sqpr * epr * cypi * szrk;
          fy =        epr * sypi * szrk / p;
          fz =       -epr * cypi * czrk / r;
        } else {
          fx = -sps * sqqs * eqs * cyqi * czsk;
          fy =  sps / q    * eqs * syqi * czsk;
          fz =  sps / s    * eqs * cyqi * szsk;
        }

        for (let n = 0; n < 2; n++) {
          for (let nn = 0; nn < 2; nn++) {
            let hx, hy, hz;
            if (m === 0) {
              const base_x = n === 0 ? fx : fx * cps;
              const base_y = n === 0 ? fy : fy * cps;
              const base_z = n === 0 ? fz : fz * cps;
              hx = nn === 0 ? base_x : base_x * x_sc;
              hy = nn === 0 ? base_y : base_y * x_sc;
              hz = nn === 0 ? base_z : base_z * x_sc;
            } else {
              const base_x = n === 0 ? fx : fx * s3ps;
              const base_y = n === 0 ? fy : fy * s3ps;
              const base_z = n === 0 ? fz : fz * s3ps;
              hx = nn === 0 ? base_x : base_x * x_sc;
              hy = nn === 0 ? base_y : base_y * x_sc;
              hz = nn === 0 ? base_z : base_z * x_sc;
            }

            const hxr = m === 0 ? hx*ct1 + hz*st1 : hx*ct2 + hz*st2;
            const hzr = m === 0 ? -hx*st1 + hz*ct1 : -hx*st2 + hz*ct2;

            bx += hxr * a[l];
            by += hy  * a[l];
            bz += hzr * a[l];
            l++;
          }
        }
      }
    }
  }
  return [bx, by, bz];
}

// ---------------------------------------------------------------------------
// full_rc — symmetric + partial ring current (with shielding)
// ---------------------------------------------------------------------------

function full_rc(ps, x, y, z, sc_sy, sc_pr, phi) {
  // corrected values (as of May 2006)
  const c_sy = [
    -957.2534900, -817.5450246,  583.2991249,  758.8568270,
      13.17029064,  68.94173502,  -15.29764089,  -53.43151590,  27.34311724,
     149.5252826,  -11.00696044, -179.7031814,  953.0914774,  817.2340042,
    -581.0791366, -757.5387665,  -13.10602697,  -68.58155678,  15.22447386,
      53.15535633,  -27.07982637, -149.1413391,  10.91433279,  179.3251739,
      -6.028703251,  1.303196101,  -1.345909343,  -1.138296330, -0.06642634348,
      -0.3795246458,  0.07487833559,  0.2891156371, -0.5506314391, -0.4443105812,
       0.2273682152,  0.01086886655, -9.130025352,  1.118684840,  1.110838825,
       0.1219761512, -0.06263009645, -0.1896093743,  0.03434321042, 0.01523060688,
      -0.4913171541, -0.2264814165, -0.04791374574,  0.1981955976, -68.32678140,
     -48.72036263,  14.03247808,  16.56233733,   2.369921099,  6.200577111,
      -1.415841250,  -0.8184867835, -3.401307527,  -8.490692287,  3.217860767,
      -9.037752107,  66.09298105,  48.23198578,  -13.67277141,  -16.27028909,
      -2.309299411,  -6.016572391,  1.381468849,   0.7935312553,  3.436934845,
       8.260038635,  -3.136213782,  8.833214943,   8.041075485,  8.024818618,
      35.54861873,  12.55415215,   1.738167799,   3.721685353,  23.06768025,
       6.871230562,  6.806229878,  21.35990364,   1.687412298,  3.500885177,
       0.3498952546, 0.6595919814,
  ];
  const c_pr = [
     -64820.58481,  -63965.62048,  66267.93413, 135049.7504,  -36.56316878,
       124.6614669,  56.75637955,  -87.56841077, 5848.631425,  4981.097722,
     -6233.712207, -10986.40188,  68716.52057,  65682.69473, -69673.32198,
    -138829.3568,   43.45817708, -117.9565488,  -62.14836263,  79.83651604,
     -6211.451069,  -5151.633113,  6544.481271,  11353.03491,  23.72352603,
      -256.4846331,  25.77629189,  145.2377187,   -4.472639098, -3.554312754,
        2.936973114,   2.682302576,  2.728979958,  26.43396781, -9.312348296,
       -29.65427726, -247.5855336, -206.9111326,  74.25277664, 106.4069993,
        15.45391072,  16.35943569,  -5.965177750,  -6.079451700, 115.6748385,
       -35.27377307, -32.28763497,  -32.53122151,  93.74409310,  84.25677504,
       -29.23010465, -43.79485175,  -6.434679514,  -6.620247951,  2.443524317,
        2.266538956, -43.82903825,   6.904117876,  12.24289401,  17.62014361,
       152.3078796,  124.5505289,  -44.58690290,  -63.02382410,  -8.999368955,
        -9.693774119,  3.510930306,   3.770949738, -77.96705716,  22.07730961,
        20.46491655,  18.67728847,   9.451290614,   9.313661792, 644.7620970,
       418.2515954,   7.183754387,  35.62128817,   19.43180682,  39.57218411,
        15.69384715,   7.123215241,  2.300635346,  21.90881131,  -0.01775839370, 0.3996346710,
  ];

  const [hxsrc, hysrc, hzsrc, hxprc, hyprc, hzprc] =
    src_prc(sc_sy, sc_pr, phi, ps, x, y, z);

  const x_sc_sy = sc_sy - 1.0;
  const [fsx, fsy, fsz] = rc_shield(c_sy, ps, x_sc_sy, x, y, z);

  const x_sc_pr = sc_pr - 1.0;
  const [fpx, fpy, fpz] = rc_shield(c_pr, ps, x_sc_pr, x, y, z);

  return [
    hxsrc + fsx, hysrc + fsy, hzsrc + fsz,
    hxprc + fpx, hyprc + fpy, hzprc + fpz,
  ];
}

// ---------------------------------------------------------------------------
// src_prc — ring current field in SM coordinates
// ---------------------------------------------------------------------------

function src_prc(sc_sy, sc_pr, phi, ps, x, y, z) {
  const cps = Math.cos(ps);
  const sps = Math.sin(ps);
  const xt  = x * cps - z * sps;
  const zt  = z * cps + x * sps;

  // Symmetric RC
  const xts = xt / sc_sy; const yts = y / sc_sy; const zts = zt / sc_sy;
  const [bxs, bys, bzs] = rc_symm(xts, yts, zts);

  // Partial RC (symmetric component)
  const xta = xt / sc_pr; const yta = y / sc_pr; const zta = zt / sc_pr;
  const [bxa_s, bya_s, bza_s] = prc_symm(xta, yta, zta);

  // Partial RC (quadrupole component, rotated by phi)
  const cp = Math.cos(phi); const sp = Math.sin(phi);
  const xr = xta * cp - yta * sp;
  const yr = xta * sp + yta * cp;
  const [bxa_qr, bya_qr, bza_q] = prc_quad(xr, yr, zta);

  // Rotate quadrupole back
  const bxa_q = bxa_qr * cp + bya_qr * sp;
  const bya_q = -bxa_qr * sp + bya_qr * cp;

  const bxp = bxa_s + bxa_q;
  const byp = bya_s + bya_q;
  const bzp = bza_s + bza_q;

  // Transform back to GSM
  const bxsrc =  bxs * cps + bzs * sps;
  const bysrc =  bys;
  const bzsrc =  bzs * cps - bxs * sps;
  const bxprc =  bxp * cps + bzp * sps;
  const byprc =  byp;
  const bzprc =  bzp * cps - bxp * sps;

  return [bxsrc, bysrc, bzsrc, bxprc, byprc, bzprc];
}

// ---------------------------------------------------------------------------
// rc_symm — symmetric ring current field
// ---------------------------------------------------------------------------

function rc_symm(x, y, z) {
  const ds  = 1e-2;
  const dc  = 0.99994999875;
  const d   = 1e-4;
  const drd = 5e3; // = 1/(2*d)

  const rho2 = x*x + y*y;
  const r2   = rho2 + z*z;
  const r    = Math.sqrt(r2);
  const rp   = r + d;
  const rm   = r - d;
  const sint = Math.sqrt(rho2) / r;
  const cost = z / r;

  let bx, by, bz;
  if (sint < ds) {
    const a_val  = ap(r, ds, dc) / ds;
    const dardr  = (rp * ap(rp, ds, dc) - rm * ap(rm, ds, dc)) * drd;
    const fxy    = z * (2.0 * a_val - dardr) / (r * r2);
    bx = fxy * x; by = fxy * y;
    bz = (2.0 * a_val * cost*cost + dardr * sint*sint) / r;
  } else {
    const theta  = Math.atan2(sint, cost);
    const tp     = theta + d; const tm = theta - d;
    const sintp  = Math.sin(tp); const costp = Math.cos(tp);
    const sintm  = Math.sin(tm); const costm = Math.cos(tm);
    const br_val = (sintp * ap(r, sintp, costp) - sintm * ap(r, sintm, costm)) / (r * sint) * drd;
    const bt_val = (rm * ap(rm, sint, cost) - rp * ap(rp, sint, cost)) / r * drd;
    const fxy    = (br_val + bt_val * cost / sint) / r;
    bx = fxy * x; by = fxy * y;
    bz = br_val * cost - bt_val * sint;
  }
  return [bx, by, bz];
}

// ---------------------------------------------------------------------------
// ap — vector potential for symmetric ring current
// ---------------------------------------------------------------------------

function ap(r, sint, cost) {
  const [a1,a2,rrc1,dd1,rrc2,dd2,p1,r1,dr1,dla1,p2,r2,dr2,dla2,p3,r3,dr3] = [
    -456.5289941, 375.9055332, 4.274684950, 2.439528329, 3.367557287,
     3.146382545, -0.2291904607, 3.746064740, 1.508802177, 0.5873525737,
     0.1556236119, 4.993638842, 3.324180497, 0.4368407663, 0.1855957207,
     2.969226745, 2.243367377,
  ];

  let prox = false;
  let sint1 = sint;
  let cost1 = cost;
  if (sint1 < 1e-2) { sint1 = 1e-2; cost1 = 0.99994999875; prox = true; }

  const alpha  = sint1 * sint1 / r;
  const gamma  = cost1 / (r * r);

  const arg1 = -((r - r1) / dr1) * ((r - r1) / dr1) - (cost1 / dla1) * (cost1 / dla1);
  const arg2 = -((r - r2) / dr2) * ((r - r2) / dr2) - (cost1 / dla2) * (cost1 / dla2);
  const arg3 = -((r - r3) / dr3) * ((r - r3) / dr3);

  const dexp1 = arg1 < -500.0 ? 0.0 : Math.exp(arg1);
  const dexp2 = arg2 < -500.0 ? 0.0 : Math.exp(arg2);
  const dexp3 = arg3 < -500.0 ? 0.0 : Math.exp(arg3);

  const alpha_s  = alpha * (1.0 + p1 * dexp1 + p2 * dexp2 + p3 * dexp3);
  const gammas2  = gamma * gamma;

  const alsqh = alpha_s * alpha_s / 2.0;
  const f     = 64.0 / 27.0 * gammas2 + alsqh * alsqh;
  const qv    = Math.pow(Math.sqrt(f) + alsqh, 1.0 / 3.0);
  let cv      = qv - 4.0 * Math.pow(gammas2, 1.0 / 3.0) / (3.0 * qv);
  if (cv < 0.0) cv = 0.0;
  const gv    = Math.sqrt(cv * cv + 4.0 * Math.pow(gammas2, 1.0 / 3.0));
  const rs    = 4.0 / ((Math.sqrt(2.0 * gv - cv) + Math.sqrt(cv)) * (gv + cv));
  const costs = gamma * rs * rs;
  const sints = Math.sqrt(1.0 - costs * costs);
  const rhos  = rs * sints;
  const zs    = rs * costs;

  const aphi1 = _elliptic_aphi(rrc1, rhos, zs, dd1);
  const aphi2 = _elliptic_aphi(rrc2, rhos, zs, dd2);

  let result = a1 * aphi1 + a2 * aphi2;
  if (prox) result = result * sint / sint1;
  return result;
}

// Shared elliptic integral helper (used in both ap and apprc)
function _elliptic_aphi(rrc, rhos, zs, dd) {
  const p     = (rrc + rhos) * (rrc + rhos) + zs * zs + dd * dd;
  const xk2   = 4.0 * rrc * rhos / p;
  const xk    = Math.sqrt(xk2);
  const xkrho12 = xk * Math.sqrt(rhos);
  const xk2s = 1.0 - xk2;
  const dl    = Math.log(1.0 / xk2s);
  const elk   = 1.38629436112
    + xk2s * (0.09666344259 + xk2s * (0.03590092383 + xk2s * (0.03742563713 + xk2s * 0.01451196212)))
    + dl * (0.5 + xk2s * (0.12498593597 + xk2s * (0.06880248576 + xk2s * (0.03328355346 + xk2s * 0.00441787012))));
  const ele   = 1.0
    + xk2s * (0.44325141463 + xk2s * (0.0626060122 + xk2s * (0.04757383546 + xk2s * 0.01736506451)))
    + dl * xk2s * (0.2499836831 + xk2s * (0.09200180037 + xk2s * (0.04069697526 + xk2s * 0.00526449639)));
  return ((1.0 - xk2 * 0.5) * elk - ele) / xkrho12;
}

// ---------------------------------------------------------------------------
// prc_symm — symmetric component of partial ring current field
// ---------------------------------------------------------------------------

function prc_symm(x, y, z) {
  const ds  = 1e-2;
  const dc  = 0.99994999875;
  const d   = 1e-4;
  const drd = 5e3;

  const rho2 = x*x + y*y;
  const r2   = rho2 + z*z;
  const r    = Math.sqrt(r2);
  const rp   = r + d;
  const rm   = r - d;
  const sint = Math.sqrt(rho2) / r;
  const cost = z / r;

  let bx, by, bz;
  if (sint < ds) {
    const a_val  = apprc(r, ds, dc) / ds;
    const dardr  = (rp * apprc(rp, ds, dc) - rm * apprc(rm, ds, dc)) * drd;
    const fxy    = z * (2.0 * a_val - dardr) / (r * r2);
    bx = fxy * x; by = fxy * y;
    bz = (2.0 * a_val * cost*cost + dardr * sint*sint) / r;
  } else {
    const theta  = Math.atan2(sint, cost);
    const tp     = theta + d; const tm = theta - d;
    const sintp  = Math.sin(tp); const costp = Math.cos(tp);
    const sintm  = Math.sin(tm); const costm = Math.cos(tm);
    const br_val = (sintp * apprc(r, sintp, costp) - sintm * apprc(r, sintm, costm)) / (r * sint) * drd;
    const bt_val = (rm * apprc(rm, sint, cost) - rp * apprc(rp, sint, cost)) / r * drd;
    const fxy    = (br_val + bt_val * cost / sint) / r;
    bx = fxy * x; by = fxy * y;
    bz = br_val * cost - bt_val * sint;
  }
  return [bx, by, bz];
}

// ---------------------------------------------------------------------------
// apprc — vector potential for partial ring current
// ---------------------------------------------------------------------------

function apprc(r, sint, cost) {
  const [
    a1, a2, rrc1, dd1, rrc2, dd2,
    p1, alpha1, dal1, beta1, dg1,
    p2, alpha2, dal2, beta2, dg2, beta3,
    p3, alpha3, dal3, beta4, dg3, beta5,
    q0, q1, alpha4, dal4, dg4,
    q2, alpha5, dal5, dg5, beta6, beta7,
  ] = [
    -80.11202281,  12.58246758, 6.560486035, 1.930711037, 3.827208119,
      0.7789990504,  0.3058309043,  0.1817139853, 0.1257532909, 3.422509402,
      0.04742939676, -4.800458958, -0.02845643596, 0.2188114228, 2.545944574,
      0.00813272793,  0.35868244,  103.1601001, -0.00764731187, 0.1046487459,
      2.958863546,   0.01172314188, 0.4382872938, 0.01134908150, 14.51339943,
      0.2647095287,  0.07091230197, 0.01512963586, 6.861329631, 0.1677400816,
      0.04433648846, 0.05553741389, 0.7665599464, 0.7277854652,
  ];

  let prox = false;
  let sint1 = sint;
  let cost1 = cost;
  if (sint1 < 1e-2) { sint1 = 1e-2; cost1 = 0.99994999875; prox = true; }

  const alpha = sint1 * sint1 / r;
  const gamma = cost1 / (r * r);

  const arg1 = -(gamma / dg1) * (gamma / dg1);
  const arg2 = -((alpha - alpha4) / dal4) * ((alpha - alpha4) / dal4) - (gamma / dg4) * (gamma / dg4);

  const dexp1 = arg1 < -500.0 ? 0.0 : Math.exp(arg1);
  const dexp2 = arg2 < -500.0 ? 0.0 : Math.exp(arg2);

  const alpha_s = alpha * (
    1.0
    + p1 / Math.pow(1.0 + ((alpha - alpha1) / dal1) * ((alpha - alpha1) / dal1), beta1) * dexp1
    + p2 * (alpha - alpha2) / Math.pow(1.0 + ((alpha - alpha2) / dal2) * ((alpha - alpha2) / dal2), beta2)
           / Math.pow(1.0 + (gamma / dg2) * (gamma / dg2), beta3)
    + p3 * (alpha - alpha3) * (alpha - alpha3)
           / Math.pow(1.0 + ((alpha - alpha3) / dal3) * ((alpha - alpha3) / dal3), beta4)
           / Math.pow(1.0 + (gamma / dg3) * (gamma / dg3), beta5)
  );

  const gamma_s = gamma * (
    1.0 + q0
    + q1 * (alpha - alpha4) * dexp2
    + q2 * (alpha - alpha5)
           / Math.pow(1.0 + ((alpha - alpha5) / dal5) * ((alpha - alpha5) / dal5), beta6)
           / Math.pow(1.0 + (gamma / dg5) * (gamma / dg5), beta7)
  );

  const gammas2 = gamma_s * gamma_s;
  const alsqh   = alpha_s * alpha_s / 2.0;
  const f       = 64.0 / 27.0 * gammas2 + alsqh * alsqh;
  const qv      = Math.pow(Math.sqrt(f) + alsqh, 1.0 / 3.0);
  let cv         = qv - 4.0 * Math.pow(gammas2, 1.0 / 3.0) / (3.0 * qv);
  if (cv < 0.0) cv = 0.0;
  const gv       = Math.sqrt(cv * cv + 4.0 * Math.pow(gammas2, 1.0 / 3.0));
  const rs       = 4.0 / ((Math.sqrt(2.0 * gv - cv) + Math.sqrt(cv)) * (gv + cv));
  const costs    = gamma_s * rs * rs;
  const sints    = Math.sqrt(1.0 - costs * costs);
  const rhos     = rs * sints;
  const zs       = rs * costs;

  const aphi1 = _elliptic_aphi(rrc1, rhos, zs, dd1);
  const aphi2 = _elliptic_aphi(rrc2, rhos, zs, dd2);

  let result = a1 * aphi1 + a2 * aphi2;
  if (prox) result = result * sint / sint1;
  return result;
}

// ---------------------------------------------------------------------------
// prc_quad — quadrupole component of partial ring current
// ---------------------------------------------------------------------------

function prc_quad(x, y, z) {
  const d  = 1e-4;
  const dd = 2e-4;
  const ds = 1e-2;
  const dc = 0.99994999875;

  const rho2 = x*x + y*y;
  const r    = Math.sqrt(rho2 + z*z);
  const rho  = Math.sqrt(rho2);
  const sint = rho / r;
  const cost = z / r;
  const rp   = r + d;
  const rm   = r - d;

  let bx, by, bz;
  if (sint > ds) {
    const cphi = x / rho;
    const sphi = y / rho;
    const br   = br_prc_q(r, sint, cost);
    const bt   = bt_prc_q(r, sint, cost);
    const dbrr = (br_prc_q(rp, sint, cost) - br_prc_q(rm, sint, cost)) / dd;
    const theta = Math.atan2(sint, cost);
    const sintp = Math.sin(theta + d); const costp = Math.cos(theta + d);
    const sintm = Math.sin(theta - d); const costm = Math.cos(theta - d);
    const dbtt  = (bt_prc_q(r, sintp, costp) - bt_prc_q(r, sintm, costm)) / dd;
    bx = sint * (br + (br + r * dbrr + dbtt) * sphi*sphi) + cost * bt;
    by = -sint * sphi * cphi * (br + r * dbrr + dbtt);
    bz = (br * cost - bt * sint) * cphi;
  } else {
    const st = ds;
    const ct = z < 0.0 ? -dc : dc;
    const theta = Math.atan2(st, ct);
    const sintp = Math.sin(theta + d); const costp = Math.cos(theta + d);
    const sintm = Math.sin(theta - d); const costm = Math.cos(theta - d);
    const br   = br_prc_q(r, st, ct);
    const bt   = bt_prc_q(r, st, ct);
    const dbrr = (br_prc_q(rp, st, ct) - br_prc_q(rm, st, ct)) / dd;
    const dbtt = (bt_prc_q(r, sintp, costp) - bt_prc_q(r, sintm, costm)) / dd;
    const fcxy = r * dbrr + dbtt;
    bx = (br * (x*x + 2.0*y*y) + fcxy * y*y) / (r * st) / (r * st) + bt * ct;
    by = -(br + fcxy) * x * y / ((r * st) * (r * st));
    bz = (br * ct / st - bt) * x / r;
  }
  return [bx, by, bz];
}

// ---------------------------------------------------------------------------
// br_prc_q — radial component of quadrupole partial ring current
// ---------------------------------------------------------------------------

function br_prc_q(r, sint, cost) {
  const a1 = -21.2666329;  const a2 = 32.24527521;  const a3 = -6.062894078;
  const a4 =  7.515660734; const a5 = 233.7341288;   const a6 = -227.1195714;
  const a7 =  8.483233889; const a8 = 16.80642754;   const a9 = -24.63534184;
  const a10 = 9.067120578; const a11 = -1.052686913; const a12 = -12.08384538;
  const a13 = 18.61969572; const a14 = -12.71686069; const a15 = 47017.35679;
  const a16 = -50646.71204; const a17 = 7746.058231; const a18 = 1.531069371;
  const xk1 = 2.318824273; const al1 = 0.1417519429; const dal1 = 0.6388013110e-2;
  const b1  = 5.303934488; const be1 = 4.213397467;
  const xk2 = 0.7955534018; const al2 = 0.1401142771; const dal2 = 0.2306094179e-1;
  const b2  = 3.462235072; const be2 = 2.568743010;
  const xk3 = 3.477425908; const xk4 = 1.922155110;
  const al3 = 0.1485233485; const dal3 = 0.2319676273e-1;
  const b3  = 7.830223587; const be3 = 8.492933868;
  const al4 = 0.1295221828; const dal4 = 0.01753008801; const dg1 = 0.01125504083;
  const al5 = 0.1811846095; const dal5 = 0.04841237481; const dg2 = 0.01981805097;
  const c1  = 6.557801891; const c2 = 6.348576071; const c3 = 5.744436687;
  const al6 = 0.2265212965; const dal6 = 0.1301957209; const drm = 0.5654023158;

  const sint2 = sint * sint;
  const cost2 = cost * cost;
  const sc    = sint * cost;
  const alpha = sint2 / r;
  const gamma = cost / (r * r);

  let [f,fa,fs] = ffs(alpha, al1, dal1);
  const d1 = sc * Math.pow(f, xk1) / (Math.pow(r / b1, be1) + 1.0);
  const d2 = d1 * cost2;

  [f,fa,fs] = ffs(alpha, al2, dal2);
  const d3 = sc * Math.pow(fs, xk2) / (Math.pow(r / b2, be2) + 1.0);
  const d4 = d3 * cost2;

  [f,fa,fs] = ffs(alpha, al3, dal3);
  const d5 = sc * Math.pow(alpha, xk3) * Math.pow(fs, xk4) / (Math.pow(r / b3, be3) + 1.0);
  const d6 = d5 * cost2;

  const arga  = ((alpha - al4) / dal4) * ((alpha - al4) / dal4) + 1.0;
  const argg  = 1.0 + (gamma / dg1) * (gamma / dg1);
  const d7  = sc / arga / argg;
  const d8  = d7 / arga;
  const d9  = d8 / arga;
  const d10 = d9 / arga;

  const arga2 = ((alpha - al5) / dal5) * ((alpha - al5) / dal5) + 1.0;
  const argg2 = 1.0 + (gamma / dg2) * (gamma / dg2);
  const d11 = sc / arga2 / argg2;
  const d12 = d11 / arga2;
  const d13 = d12 / arga2;
  const d14 = d13 / arga2;

  const c14 = c1*c1*c1*c1; const c24 = c2*c2*c2*c2; const c34 = c3*c3*c3*c3;
  const d15 = sc / (r*r*r*r + c14);
  const d16 = sc / (r*r*r*r + c24) * cost2;
  const d17 = sc / (r*r*r*r + c34) * cost2 * cost2;

  [f,fa,fs] = ffs(alpha, al6, dal6);
  const d18 = sc * fs / (1.0 + ((r - 1.2) / drm) * ((r - 1.2) / drm));

  return a1*d1 + a2*d2 + a3*d3 + a4*d4 + a5*d5 + a6*d6
       + a7*d7 + a8*d8 + a9*d9 + a10*d10
       + a11*d11 + a12*d12 + a13*d13 + a14*d14
       + a15*d15 + a16*d16 + a17*d17 + a18*d18;
}

// ---------------------------------------------------------------------------
// bt_prc_q — theta component of quadrupole partial ring current
// ---------------------------------------------------------------------------

function bt_prc_q(r, sint, cost) {
  const a1 = 12.74640393;  const a2 = -7.516393516; const a3 = -5.476233865;
  const a4 =  3.212704645; const a5 = -59.10926169; const a6 = 46.62198189;
  const a7 = -0.01644280062; const a8 = 0.1234229112; const a9 = -0.08579198697;
  const a10 = 0.01321366966; const a11 = 0.8970494003; const a12 = 9.136186247;
  const a13 = -38.19301215; const a14 = 21.73775846; const a15 = -410.0783424;
  const a16 = -69.90832690; const a17 = -848.8543440;
  const xk1 = 1.243288286; const al1 = 0.2071721360; const dal1 = 0.05030555417;
  const b1  = 7.471332374; const be1 = 3.180533613;
  const xk2 = 1.376743507; const al2 = 0.1568504222; const dal2 = 0.02092910682;
  const be2 = 1.985148197;
  const xk3 = 0.3157139940; const xk4 = 1.056309517;
  const al3 = 0.1701395257; const dal3 = 0.1019870070;
  const b3  = 6.293740981; const be3 = 5.671824276;
  const al4 = 0.1280772299; const dal4 = 0.02189060799; const dg1 = 0.01040696080;
  const al5 = 0.1648265607; const dal5 = 0.04701592613; const dg2 = 0.01526400086;
  const c1  = 12.88384229; const c2 = 3.361775101; const c3 = 23.44173897;

  const sint2 = sint * sint;
  const cost2 = cost * cost;
  const sc    = sint * cost;
  const alpha = sint2 / r;
  const gamma = cost / (r * r);

  let [f,fa,fs] = ffs(alpha, al1, dal1);
  const d1 = Math.pow(f, xk1) / (Math.pow(r / b1, be1) + 1.0);
  const d2 = d1 * cost2;

  [f,fa,fs] = ffs(alpha, al2, dal2);
  const d3 = Math.pow(fa, xk2) / Math.pow(r, be2);
  const d4 = d3 * cost2;

  [f,fa,fs] = ffs(alpha, al3, dal3);
  const d5 = Math.pow(fs, xk3) * Math.pow(alpha, xk4) / (Math.pow(r / b3, be3) + 1.0);
  const d6 = d5 * cost2;

  [f,fa,fs] = ffs(gamma, 0.0, dg1);
  const fcc = 1.0 + ((alpha - al4) / dal4) * ((alpha - al4) / dal4);
  const d7  = fs / fcc;
  const d8  = d7 / fcc;
  const d9  = d8 / fcc;
  const d10 = d9 / fcc;

  const arg = 1.0 + ((alpha - al5) / dal5) * ((alpha - al5) / dal5);
  const d11 = 1.0 / arg / (1.0 + (gamma / dg2) * (gamma / dg2));
  const d12 = d11 / arg;
  const d13 = d12 / arg;
  const d14 = d13 / arg;

  const c12 = c1*c1; const c22 = c2*c2; const c32 = c3*c3;
  const d15 = 1.0 / (r*r*r*r + c12);
  const d16 = cost2 / (r*r*r*r + c22);
  const d17 = cost2 * cost2 / (r*r*r*r + c32);

  return a1*d1 + a2*d2 + a3*d3 + a4*d4 + a5*d5 + a6*d6
       + a7*d7 + a8*d8 + a9*d9 + a10*d10
       + a11*d11 + a12*d12 + a13*d13 + a14*d14
       + a15*d15 + a16*d16 + a17*d17;
}

// ---------------------------------------------------------------------------
// ffs — utility function used in ring current quadrupole terms
// ---------------------------------------------------------------------------

function ffs(a, a0, da) {
  const sq1 = Math.sqrt((a + a0) * (a + a0) + da * da);
  const sq2 = Math.sqrt((a - a0) * (a - a0) + da * da);
  const fa  = 2.0 / (sq1 + sq2);
  const f   = fa * a;
  const fs  = 0.5 * (sq1 + sq2) / (sq1 * sq2) * (1.0 - f * f);
  return [f, fa, fs];
}

// ---------------------------------------------------------------------------
// rc_shield — ring current shielding field
// ---------------------------------------------------------------------------

function rc_shield(a, ps, x_sc, x, y, z) {
  const fac_sc = (x_sc + 1.0) * (x_sc + 1.0) * (x_sc + 1.0);
  const cps   = Math.cos(ps);
  const sps   = Math.sin(ps);
  const s3ps  = 2.0 * cps;

  const pst1 = ps * a[84]; const pst2 = ps * a[85];
  const st1  = Math.sin(pst1); const ct1 = Math.cos(pst1);
  const st2  = Math.sin(pst2); const ct2 = Math.cos(pst2);
  const x1   = x * ct1 - z * st1; const z1 = x * st1 + z * ct1;
  const x2   = x * ct2 - z * st2; const z2 = x * st2 + z * ct2;

  let l = 0;
  let bx = 0.0, by = 0.0, bz = 0.0;

  for (let m = 0; m < 2; m++) {
    for (let i = 0; i < 3; i++) {
      const p    = a[72 + i];
      const q    = a[78 + i];
      const cypi = Math.cos(y / p); const sypi = Math.sin(y / p);
      const cyqi = Math.cos(y / q); const syqi = Math.sin(y / q);

      for (let k = 0; k < 3; k++) {
        const r    = a[75 + k];
        const s    = a[81 + k];
        const szrk = Math.sin(z1 / r); const czrk = Math.cos(z1 / r);
        const czsk = Math.cos(z2 / s); const szsk = Math.sin(z2 / s);
        const sqpr = Math.sqrt(1.0 / (p*p) + 1.0 / (r*r));
        const sqqs = Math.sqrt(1.0 / (q*q) + 1.0 / (s*s));
        const epr  = Math.exp(x1 * sqpr);
        const eqs  = Math.exp(x2 * sqqs);

        let fx, fy, fz;
        if (m === 0) {
          fx = -sqpr * epr * cypi * szrk * fac_sc;
          fy =        epr * sypi * szrk / p * fac_sc;
          fz =       -epr * cypi * czrk / r * fac_sc;
        } else {
          fx = -sps * sqqs * eqs * cyqi * czsk * fac_sc;
          fy =  sps / q    * eqs * syqi * czsk * fac_sc;
          fz =  sps / s    * eqs * cyqi * szsk * fac_sc;
        }

        for (let n = 0; n < 2; n++) {
          for (let nn = 0; nn < 2; nn++) {
            let hx, hy, hz;
            if (m === 0) {
              const base_x = n === 0 ? fx : fx * cps;
              const base_y = n === 0 ? fy : fy * cps;
              const base_z = n === 0 ? fz : fz * cps;
              hx = nn === 0 ? base_x : base_x * x_sc;
              hy = nn === 0 ? base_y : base_y * x_sc;
              hz = nn === 0 ? base_z : base_z * x_sc;
            } else {
              const base_x = n === 0 ? fx : fx * s3ps;
              const base_y = n === 0 ? fy : fy * s3ps;
              const base_z = n === 0 ? fz : fz * s3ps;
              hx = nn === 0 ? base_x : base_x * x_sc;
              hy = nn === 0 ? base_y : base_y * x_sc;
              hz = nn === 0 ? base_z : base_z * x_sc;
            }

            const hxr = m === 0 ? hx*ct1 + hz*st1 : hx*ct2 + hz*st2;
            const hzr = m === 0 ? -hx*st1 + hz*ct1 : -hx*st2 + hz*ct2;

            bx += hxr * a[l];
            by += hy  * a[l];
            bz += hzr * a[l];
            l++;
          }
        }
      }
    }
  }
  return [bx, by, bz];
}
