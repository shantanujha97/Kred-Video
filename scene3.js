// Kred product demo v3 = v2 without the "by KernelDAO" line on the logo and without the URL pill on the end card. v2 = v1 with the UI straight after the opening line; "pegged 1:1 to USD" moves onto the institutions card — Bento camera grammar on Kred's light UI (no React Bits: the backdrop is drawn on canvas)
const $ = id => document.getElementById(id);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, p) => a + (b - a) * p;
const fmt = (v, d = 2) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
const show = (el, on) => { el.style.display = on ? '' : 'none'; };
const cam = (cx, cy, z) => ({ cx, cy, z });

gsap.registerPlugin(CustomEase);
CustomEase.create('weighty', 'M0,0 C0.38,0 0.12,1 1,1');
CustomEase.create('travel', 'M0,0 C0.45,0 0.1,1 1,1');
CustomEase.create('arrive', 'M0,0 C0.25,0.8 0.25,1 1,1');
const CAM_EASE = 'weighty', LAND = 'expo.out';
const SHIFT = 2200, SV = 1300, STRIP = 0.9;
const WIDE = 1.12, CLOSE = 1.72, MODZ = 1.6;

// ---- camera (world = Figma 1x px; z = screen px per world px) ----
const offR = c => cam(c.cx - SHIFT / c.z, c.cy, c.z);
const INIT = {
  A: offR(cam(643, 417, WIDE)),
  B: cam(643, 430, 0.5),
  C: cam(643, 482 - SV / WIDE, WIDE),
  D: offR(cam(643, 470, WIDE)),
};
const KEYS = { A: [], B: [], C: [], D: [] };
const IDS = 'ABCD';
function interpCam(a, b, p) {
  const z = Math.exp(lerp(Math.log(a.z), Math.log(b.z), p));
  if (b.z >= a.z) { const ox = (b.cx - a.cx) * a.z * (1 - p), oy = (b.cy - a.cy) * a.z * (1 - p); return { cx: b.cx - ox / z, cy: b.cy - oy / z, z }; }
  const ox = (a.cx - b.cx) * b.z * p, oy = (a.cy - b.cy) * b.z * p; return { cx: a.cx - ox / z, cy: a.cy - oy / z, z };
}
function camAt(id, t) {
  let st = INIT[id];
  for (const k of KEYS[id]) {
    if (t < k.t) return st;
    if (t < k.t + k.d) {
      const p = (t - k.t) / k.d, e = gsap.parseEase(k.ease)(p);
      if (k.an) { const a = k.an, z = Math.exp(lerp(Math.log(k.from.z), Math.log(k.to.z), e)); return { cx: a.wx - (a.sx - 960) / z, cy: a.wy - (a.sy - 540) / z, z }; }
      return interpCam(k.from, k.to, e);
    }
    st = k.to;
  }
  return st;
}
const akey = (id, t, d, ease, to, an) => { const L = KEYS[id], last = L[L.length - 1]; if (last && t < last.t + last.d - 1e-6) console.error(`camera keys overlap on ${id} at ${t.toFixed(2)}`); L.push({ t, d, to, ease, an, from: camAt(id, t) }); };
const pan = (id, to, at, dur, ease = CAM_EASE) => akey(id, at, dur, ease, { ...camAt(id, at), ...to });
const scr = (c, x, y) => [960 + (x - c.cx) * c.z, 540 + (y - c.cy) * c.z];
// push/pull about the one world point that stays put on screen
const focusPt = (k, C) => [(C.cx * C.z - k.cx * k.z) / (C.z - k.z), (C.cy * C.z - k.cy * k.z) / (C.z - k.z)];
const zoomTo = (id, C, at, dur, ease) => { const k = camAt(id, at), P = focusPt(k, C), sp = scr(k, P[0], P[1]); akey(id, at, dur, ease, cam(C.cx, C.cy, C.z), { wx: P[0], wy: P[1], sx: sp[0], sy: sp[1] }); };
const panX = (id, x, at, dur, ease) => { const k = camAt(id, at); akey(id, at, dur, ease, cam(x, k.cy, k.z)); };
const panY = (id, y, at, dur, ease) => { const k = camAt(id, at); akey(id, at, dur, ease, cam(k.cx, y, k.z)); };

const MBW = [];
const S = {
  wash: 1,
  logoOn: 1, mk: 0, q: 0, w: 0, gloss: -0.3, logoScale: 1, by: 0, glow: 0, LY: 540, LS: 7,
  tiles: Array.from({ length: 10 }, () => 0),
  A: 0, a1: 0, a3: 0, a4: 0, aBlur: 0, aPatch: 0, aN: 0, aCaret: 0, aDec: 0, aMod: 0, aModOut: 0, aMod2: 0, aMod3: 0, aSp1: 0, aCk1: 0, aSp2: 0, aCk2: 0, aOk: 0, aOkOut: 0, aOkHov: 0,
  B: 0, b1: 0, b3: 0, b4: 0, b10: 0, bBlur: 0, bPatch: 0, bN: 0, bCaret: 0, bDec: 0, bMod: 0, bModOut: 0, bMod2: 0, bMod3: 0, bSp1: 0, bCk1: 0, bSp2: 0, bCk2: 0, bOk: 0, bOkOut: 0, bRing: 0,
  C: 0, cStat: 0, cRows: Array.from({ length: 7 }, () => 0), cHov: 0,
  D: 0, dStat: 0, dRows: Array.from({ length: 8 }, () => 0), dHov: 0, dHovY: 0, dBlur: 0,
  chips: [0, 0, 0, 0], chipsOut: 0, tag: 0, url: 0,
  cur: { w: 'A', x: 0, y: 0, op: 0, press: 0, hand: 0 },
  sh: { aShine: 0, bShine: 0, cShine: 0 },
  cams: { ...INIT },
};
let tl;

// ---- backdrop: Kred's page grey, a faint teal dot grid, soft brand glows, the banner's star motif, paper grain ----
function drawBg() {
  const c = $('bg'), g = c.getContext('2d'), W = c.width, H = c.height;
  g.fillStyle = '#eceeee'; g.fillRect(0, 0, W, H);
  const neb = (x, y, r, col, a) => { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
  neb(1100, 640, 1150, '251,252,252', 0.95);
  neb(1950, 160, 950, '6,90,88', 0.075); neb(220, 1180, 850, '6,90,88', 0.055); neb(2050, 1220, 700, '202,66,39', 0.04);
  // star motif (the dashboard banner's asterisk), very faint
  const star = (x, y, L, w, a) => { g.save(); g.translate(x, y); g.strokeStyle = `rgba(6,90,88,${a})`; g.lineWidth = w; g.lineCap = 'butt';
    for (let i = 0; i < 4; i++) { g.save(); g.rotate(i * Math.PI / 4); g.beginPath(); g.moveTo(-L, 0); g.lineTo(-w * 1.2, 0); g.moveTo(w * 1.2, 0); g.lineTo(L, 0); g.stroke(); g.restore(); }
    g.restore(); };
  star(1960, 230, 620, 58, 0.018); star(160, 1150, 420, 40, 0.014);
  // dot grid, quieter in the middle where the UI sits
  for (let y = 14; y < H; y += 28) for (let x = 14; x < W; x += 28) {
    const d = Math.hypot((x - W / 2) / (W / 2), (y - H / 2) / (H / 2));
    g.fillStyle = `rgba(6,70,68,${(0.045 + 0.075 * clamp(d, 0, 1)).toFixed(3)})`; g.beginPath(); g.arc(x, y, 1.15, 0, Math.PI * 2); g.fill();
  }
  // paper grain (seeded, static)
  const im = g.getImageData(0, 0, W, H), D = im.data; let s = 1234567;
  const rnd = () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) / 4294967296); };
  for (let i = 0; i < D.length; i += 4) { const n = (rnd() + rnd() - 1) * 7; D[i] += n; D[i + 1] += n; D[i + 2] += n; }
  g.putImageData(im, 0, 0);
}
function heading(el, text, accent) {
  el.innerHTML = text.split(' ').map(w => w === '|' ? '<br>' : accent.includes(w)
    ? `<span class="gw" style="background:linear-gradient(100deg,#065a58 0%,#065a58 30%,#3fb3a6 50%,#065a58 70%,#065a58 100%);background-size:300% 100%;-webkit-background-clip:text;background-clip:text;color:transparent">${w}</span>`
    : `<span>${w}</span>`).join(' ');
  [...el.querySelectorAll('span')].forEach(s => { s.style.opacity = 0; });
}
const words = el => [...el.querySelectorAll('span')];

// ---- logo: Kred mark (10 tiles) + wordmark ----
const TILES = [ // [x, y, w, h] in the 96×32 logo box; 0-5 inner squares, 6-9 the bracket bars
  [11.75, 11.7, 2.85, 2.85], [17.45, 11.7, 2.85, 2.85], [14.6, 8.85, 2.85, 2.85], [11.75, 17.4, 2.85, 2.85], [17.45, 17.4, 2.85, 2.85], [14.6, 20.25, 2.85, 2.85],
  [8.95, 3.2, 14.2, 2.85], [26.0, 8.85, 2.85, 14.2], [8.95, 25.95, 14.2, 2.85], [3.2, 8.85, 2.85, 14.25]];
const BAR_FROM = { 6: [0, -5], 7: [5, 0], 8: [0, 5], 9: [-5, 0] };
const WORD = 'M73.8187 23.1421H71.8394L71.7926 21.3026L71.338 21.9071C70.8097 22.6094 70.2313 22.9779 69.3378 23.1814C66.8588 23.7459 64.532 22.3322 63.763 19.7943C63.5274 19.0169 63.5485 17.2653 63.8032 16.4465C64.3462 14.7018 65.5123 13.5262 67.126 13.0967C68.0582 12.8486 69.4663 12.9814 70.2741 13.3935C70.7332 13.6277 71.3042 14.169 71.5712 14.6232L71.7926 15L71.8135 11.9415C71.8249 10.2593 71.8521 8.83531 71.8739 8.77695C71.9036 8.69735 72.1455 8.67676 72.845 8.69429L73.7765 8.71768L73.8187 23.1421ZM38.852 13.4205C38.852 15.8059 38.869 16.1874 38.9768 16.2287C39.1118 16.2805 39.0742 16.3229 42.012 12.8094L43.7746 10.7016H44.971C45.8034 10.7016 46.1676 10.7299 46.1676 10.7947C46.1676 10.846 44.9772 12.2338 43.5224 13.8788C42.0676 15.5239 40.8772 16.9241 40.8772 16.9906C40.8772 17.057 42.0862 18.4517 43.5637 20.09C45.0413 21.7283 46.2502 23.1131 46.2502 23.1674C46.2502 23.2387 45.9064 23.271 45.0103 23.2837L43.7704 23.3014L41.467 20.5723C39.9185 18.7377 39.1193 17.8519 39.0285 17.8693C38.9072 17.8926 38.8911 18.1737 38.8715 20.6039L38.8498 23.3125L36.8268 23.2661L36.8054 17.0665C36.7937 13.6567 36.8019 10.8204 36.8235 10.7636C36.852 10.6888 37.138 10.6602 37.8575 10.6602H38.852V13.4205ZM48.8541 13.9419C48.8541 14.4738 48.8851 14.8736 48.9231 14.8305C48.961 14.7873 49.0563 14.5775 49.1347 14.3641C49.3316 13.829 49.8093 13.3619 50.3772 13.1494C50.7527 13.009 51.0296 12.9747 51.7917 12.9747H52.7392V14.7933H51.7623C50.5316 14.7933 50.0701 14.9194 49.6078 15.3817C49.0356 15.9539 49.0194 16.079 49.0194 19.9334V23.3074H47.0355V12.9747H48.8541V13.9419ZM59.3864 13.1383C60.2697 13.3642 60.7829 13.6598 61.4676 14.3373C62.437 15.2964 62.8239 16.3157 62.8239 17.9105V18.8437H59.1109C57.0687 18.8437 55.339 18.8663 55.2671 18.8939C54.9413 19.019 55.2627 20.0198 55.8268 20.6371C56.4121 21.2775 56.9066 21.5095 57.7815 21.5538C58.168 21.5734 58.6352 21.5486 58.8197 21.4989C59.3013 21.3689 59.8566 20.9744 60.1678 20.5411L60.4369 20.1663H61.4264C62.5956 20.1663 62.6218 20.1885 62.2823 20.8906C61.9654 21.5455 61.0433 22.4432 60.3259 22.7949C59.1428 23.375 57.565 23.4628 56.2523 23.0214C55.454 22.753 55.1504 22.5744 54.5656 22.0293C53.9703 21.4744 53.5295 20.7783 53.2589 19.9661C53.0577 19.3622 53.0367 19.1839 53.0386 18.0998C53.0406 17.0272 53.064 16.8309 53.2611 16.2334C53.7616 14.7158 54.8095 13.6808 56.3349 13.1974C56.9022 13.0176 57.0459 12.9989 57.9543 12.986C58.5054 12.9782 58.9418 13.0246 59.3864 13.1383ZM57.3616 14.7115C56.217 14.9052 55.4896 15.7348 55.1992 17.1776C55.0902 17.7195 55.1635 17.7926 55.7563 17.7331C55.9836 17.7103 57.0736 17.6668 58.1785 17.6364C59.2835 17.6059 60.3064 17.5562 60.4517 17.5256C60.7063 17.4722 60.715 17.4568 60.6879 17.1068C60.5923 15.8724 59.7407 14.9469 58.4896 14.7178C57.9501 14.619 57.9094 14.6188 57.3616 14.7115ZM68.0095 14.7953C66.3509 15.2141 65.3229 17.1196 65.7273 19.0257C65.9399 20.0275 66.5091 20.7616 67.4241 21.2138C67.9902 21.4936 68.1097 21.5219 68.7235 21.5219C69.3082 21.5219 69.4742 21.487 69.9533 21.2627C71.3084 20.6286 72.0051 19.1975 71.7601 17.5511C71.6362 16.7179 71.3633 16.1333 70.866 15.636C70.3165 15.0865 69.6578 14.7874 68.9102 14.7479C68.586 14.7307 68.1808 14.7521 68.0095 14.7953Z';
const MC = [16.03, 16.0];                    // centre of the mark in logo units
const LOCKC = 38.5;                           // centre of the full lockup (3.2…73.8)
let TILE_EL = [], GLOSS_EL = [];
function setupLogo() {
  const NS = 'http://www.w3.org/2000/svg', gm = $('gMark'), gw = $('gWord');
  for (const [x, y, w, h] of TILES) { const r = document.createElementNS(NS, 'rect'); Object.entries({ x, y, width: w, height: h, fill: '#ca4227' }).forEach(([k, v]) => r.setAttribute(k, v)); gm.appendChild(r); TILE_EL.push(r); }
  for (const [x, y, w, h] of TILES) { const r = document.createElementNS(NS, 'rect'); Object.entries({ x, y, width: w, height: h, fill: 'url(#gl)' }).forEach(([k, v]) => r.setAttribute(k, v)); gm.appendChild(r); GLOSS_EL.push(r); }
  const p = document.createElementNS(NS, 'path'); p.setAttribute('d', WORD); p.setAttribute('fill', '#075a5a'); p.setAttribute('fill-rule', 'evenodd'); gw.appendChild(p);
}
const CHIPS = [
  ['Rigorous KYB', '<path d="M12 3l7 3v5c0 4.4-3 8.3-7 9.5-4-1.2-7-5.1-7-9.5V6l7-3z"/><path d="M9 12l2.2 2.2L15.5 10"/>'],
  ['Protected by insurance fund', '<path d="M3 12a9 9 0 0 1 18 0H3z"/><path d="M12 12v6.5a2 2 0 0 1-4 0"/><path d="M12 3v0"/>'],
  ['Proof of reserve', '<ellipse cx="12" cy="6" rx="7" ry="2.6"/><path d="M5 6v6c0 1.4 3.1 2.6 7 2.6s7-1.2 7-2.6V6"/><path d="M5 12v6c0 1.4 3.1 2.6 7 2.6 1 0 1.9-.1 2.7-.2"/><path d="M15.5 18.5l1.8 1.8 3.2-3.4"/>'],
  ['Certified for trust and transparency', '<circle cx="12" cy="9.5" r="5.5"/><path d="M9.6 9.6l1.6 1.6 3.2-3.2"/><path d="M8.6 14.2L7.2 21l4.8-2.4 4.8 2.4-1.4-6.8"/>'],
];
function setupChips() {
  const box = $('chips');
  box.innerHTML = CHIPS.map(([t, ic], i) => `<div class="chip" id="chip${i}"><div class="ic"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#065a58" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${ic}</svg></div>${t}</div>`).join('');
  const rows = [[0, 1], [2, 3]], Y = [520, 628], GAP = 22;
  rows.forEach((r, ri) => { const ws = r.map(i => $('chip' + i).offsetWidth), tot = ws.reduce((a, b) => a + b, 0) + GAP * (r.length - 1); let x = 960 - tot / 2; r.forEach((i, k) => { Object.assign($('chip' + i).style, { left: x + 'px', top: Y[ri] + 'px' }); x += ws[k] + GAP; }); });
}
function setupRows() {
  const D = [[662, 779], [793, 910], [923, 1040], [1054, 1171], [1183, 1300], [1314, 1431], [1444, 1561]];
  $('cRows').innerHTML = D.map(([t, b], i) => `<img class="rowimg" id="cr${i}" src="assets/deals_r${i}.png" style="top:${(t - 6) / 1.5}px;height:${(b + 7 - t + 6) / 1.5}px">`).join('');
  const T = [[785, 902], [914, 1031], [1043, 1160], [1172, 1289], [1301, 1418], [1430, 1547], [1559, 1676], [1688, 1805]];
  $('dRows').innerHTML = T.map(([t, b], i) => `<img class="rowimg" id="dr${i}" src="assets/dash_r${i}.png" style="top:${(t - 6) / 1.5}px;height:${(b + 7 - t + 6) / 1.5}px">`).join('');
}

// ---- timeline helpers ----
const move = (obj, to, at, dur, ease = 'power3.inOut') => tl.to(obj, { ...to, duration: dur, ease }, at);
const set = (obj, props, at) => tl.set(obj, props, at);
function cardIn(el, at, st = 0.08, s0 = 1.05) {
  const ws = words(el), n = ws.length, E = at + st * (n - 1) + 0.45 + 0.32 + 0.04 * n;
  tl.fromTo(ws, { opacity: 0, y: 34, filter: 'blur(8px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.85, ease: 'expo.out', stagger: st }, at);
  tl.fromTo(el, { scale: s0 }, { scale: 1, duration: 0.8, ease: 'expo.out' }, at);
  tl.fromTo(el, { scale: 1 }, { scale: 1.03, duration: E - at - 0.8, ease: 'none', immediateRender: false }, at + 0.8);
  return E;
}
function cardOut(el, at, mode = 'push') {
  if (mode === 'push') { tl.fromTo(el, { scale: 1.03 }, { scale: 1.45, duration: 0.42, ease: 'power2.in', immediateRender: false }, at); tl.to(words(el), { opacity: 0, filter: 'blur(10px)', duration: 0.24, ease: 'power2.in', stagger: 0.015 }, at); }
  else if (mode === 'rise') { tl.to(words(el), { opacity: 0, y: -24, filter: 'blur(8px)', duration: 0.4, ease: 'power2.in', stagger: 0.02 }, at); }
  else tl.set(words(el), { opacity: 0 }, at);
}
const shine = (k, at, dur = 0.55) => tl.fromTo(S.sh, { [k]: 0 }, { [k]: 1, duration: dur, ease: 'sine.inOut', immediateRender: false }, at);
const tap = (obj, k, at) => { move(obj, { [k]: 1 }, at, 0.07, 'power1.out'); move(obj, { [k]: 0 }, at + 0.07, 0.14, 'power1.in'); };
const curIn = (w, x, y, at) => { set(S.cur, { w, x, y, op: 0, hand: 0 }, at); move(S.cur, { op: 1 }, at, 0.2, 'none'); };
const curGo = (x, y, at, dur, hand = 0) => { move(S.cur, { x, y }, at, dur, 'travel'); move(S.cur, { hand }, at + dur * (hand ? 0.75 : 0.1), 0.12, 'none'); };
const click = at => tap(S.cur, 'press', at);
const curOut = at => move(S.cur, { op: 0 }, at, 0.18, 'none');
const fade = (k, at, dur = 0.22, to = 1, ease = 'sine.inOut') => move(S, { [k]: to }, at, dur, ease);
const AMT = ['2', '20', '200', '2,000', '20,000'];

function build() {
  tl = gsap.timeline({ paused: true });
  const mb = (a, b) => MBW.push([a, b]);
  const washIn = at => move(S, { wash: 1 }, at, 0.18, 'power2.in');
  const washOut = at => move(S, { wash: 0 }, at, 0.45, 'expo.out');
  // a typed amount: caret, five keystrokes, then ".00" lands as the field formats
  const typeAmt = (p, at) => { set(S, { [p + 'Patch']: 1, [p + 'Caret']: 1 }, at); AMT.forEach((_, i) => set(S, { [p + 'N']: i + 1 }, at + 0.18 + i * 0.12)); set(S, { [p + 'Dec']: 1, [p + 'Caret']: 0 }, at + 0.18 + 5 * 0.12 + 0.12); return at + 0.18 + 5 * 0.12 + 0.12; };
  // the two-step confirm: approve spins → tick, then the second step spins → tick
  const confirm = (p, at) => {
    move(S, { [p + 'Blur']: 1 }, at, 0.35, 'sine.inOut');
    move(S, { [p + 'Mod']: 1 }, at + 0.05, 0.6, 'expo.out');
    set(S, { [p + 'Sp1']: 1 }, at + 0.05);
    const a1 = at + 0.95;
    move(S, { [p + 'Sp1']: 0 }, a1, 0.12, 'none'); move(S, { [p + 'Ck1']: 1 }, a1, 0.4, 'expo.out');
    move(S, { [p + 'Mod2']: 1 }, a1 + 0.05, 0.2, 'none'); set(S, { [p + 'Sp2']: 1 }, a1 + 0.1);
    const a2 = a1 + 0.8;
    move(S, { [p + 'Sp2']: 0 }, a2, 0.12, 'none'); move(S, { [p + 'Ck2']: 1 }, a2, 0.4, 'expo.out');
    move(S, { [p + 'Mod3']: 1 }, a2 + 0.05, 0.2, 'none');
    return a2 + 0.45;
  };

  // ===== 01 LOGO: the mark builds from its inner pixels out, the brackets close, the wordmark wipes in =====
  move(S, { wash: 0 }, 0, 0.5, 'sine.inOut');
  [0, 1, 2, 3, 4, 5].forEach((i, k) => move(S.tiles, { [i]: 1 }, 0.15 + k * 0.06, 0.6, 'expo.out'));
  [6, 7, 8, 9].forEach((i, k) => move(S.tiles, { [i]: 1 }, 0.5 + k * 0.05, 0.7, 'expo.out'));
  move(S, { glow: 1 }, 0.3, 0.9, 'sine.inOut');
  move(S, { gloss: 1.3 }, 1.05, 0.55, 'power1.inOut');
  move(S, { q: 1 }, 1.3, 0.55, 'power3.inOut');
  move(S, { w: 1 }, 1.42, 0.6, 'expo.out');
  move(S, { by: 1 }, 1.75, 0.6, 'expo.out');
  move(S, { logoScale: 1.035 }, 1.95, 0.7, 'sine.inOut');
  move(S, { logoScale: 7 }, 2.65, 0.32, 'power3.in'); mb(2.62, 2.97);
  washIn(2.8);
  set(S, { logoOn: 0, by: 0, glow: 0 }, 2.98);

  // ===== 02 "Earn from short-term payment financing." → slides off as the Mint screen slides in =====
  const H = 2.98;
  washOut(H + 0.02);
  const E0 = cardIn($('h1'), H + 0.06, 0.07, 0.86);
  const SL = E0 + 0.35, X0 = SL;
  set(S, { A: 1 }, SL);
  tl.fromTo($('h1'), { x: 0 }, { x: -SHIFT, duration: STRIP, ease: CAM_EASE }, SL); mb(SL, SL + STRIP);
  pan('A', cam(643, 417, WIDE), SL, STRIP);
  cardOut($('h1'), SL + 0.95, 'fade');

  // ===== 03 MINT: wide → push in on the form → type 20,000 → Mint → approve + mint → success → Stake Now =====
  const A0 = SL + STRIP;
  curIn('A', 760, 560, A0 - 0.05); curGo(565, 362, A0, 0.65);
  zoomTo('A', cam(643, 425, CLOSE), A0 + 0.05, 1.05, CAM_EASE);
  click(A0 + 0.7); fade('a1', A0 + 0.7, 0.18);
  const T1 = typeAmt('a', A0 + 0.75);
  fade('a3', T1 + 0.08, 0.28);
  curGo(700, 634, T1 + 0.2, 0.6, 1);
  fade('a4', T1 + 0.72, 0.16); shine('aShine', T1 + 0.75, 0.6);
  const CL1 = T1 + 1.12; click(CL1);
  curOut(CL1 + 0.18);
  zoomTo('A', cam(643, 418, MODZ), CL1 + 0.1, 0.9, CAM_EASE);
  const C1 = confirm('a', CL1 + 0.12);
  move(S, { aModOut: 1 }, C1 + 0.05, 0.3, 'power2.in');
  move(S, { aOk: 1 }, C1 + 0.2, 0.65, 'expo.out');
  curIn('A', 700, 640, C1 + 0.7); curGo(822, 528, C1 + 0.72, 0.6, 1);
  fade('aOkHov', C1 + 1.28, 0.14);
  const CL2 = C1 + 1.55; click(CL2);
  zoomTo('A', cam(819, 527, 9), CL2 + 0.05, 0.62, 'power3.in'); mb(CL2 + 0.35, CL2 + 0.67);
  curOut(CL2 + 0.1);
  washIn(CL2 + 0.5);
  set(S, { A: 0 }, CL2 + 0.68);

  // ===== 04 "Stake KUSD to earn real yield." grows out of the dip; the camera pushes through it =====
  const X1 = CL2 + 0.68;
  washOut(X1 + 0.02);
  const E1 = cardIn($('c1'), X1 + 0.06, 0.08, 0.86);
  cardOut($('c1'), E1, 'push');

  // ===== 05 STAKE: fly in → push in → type → Stake → approve + stake → success → close → land on the 8.4% APY → whip down =====
  const B0 = E1 + 0.22;
  move(S, { B: 1 }, B0, 0.28, 'sine.inOut');
  pan('B', cam(643, 430, WIDE), B0, 1.05, LAND); mb(B0, B0 + 0.35);
  curIn('B', 780, 640, B0 + 0.55); curGo(565, 432, B0 + 0.6, 0.65);
  zoomTo('B', cam(643, 477, CLOSE), B0 + 1.1, 0.95, CAM_EASE);
  click(B0 + 1.3); fade('b1', B0 + 1.3, 0.18);
  const T2 = typeAmt('b', B0 + 1.35);
  fade('b3', T2 + 0.08, 0.28);
  curGo(700, 667, T2 + 0.2, 0.6, 1);
  fade('b4', T2 + 0.72, 0.16); shine('bShine', T2 + 0.75, 0.6);
  const CL3 = T2 + 1.12; click(CL3);
  curOut(CL3 + 0.18);
  zoomTo('B', cam(643, 418, MODZ), CL3 + 0.1, 0.9, CAM_EASE);
  const C2 = confirm('b', CL3 + 0.12);
  move(S, { bModOut: 1 }, C2 + 0.05, 0.3, 'power2.in');
  move(S, { bOk: 1 }, C2 + 0.2, 0.65, 'expo.out');
  curIn('B', 820, 420, C2 + 0.75); curGo(885, 300, C2 + 0.77, 0.55, 1);
  const CL4 = C2 + 1.45; click(CL4);
  curOut(CL4 + 0.15);
  move(S, { bOkOut: 1 }, CL4 + 0.05, 0.3, 'power2.in');
  set(S, { b10: 1, b1: 0, b3: 0, b4: 0, bPatch: 0 }, CL4 + 0.1);
  move(S, { bBlur: 0 }, CL4 + 0.1, 0.4, 'sine.inOut');
  zoomTo('B', cam(800, 330, 2.15), CL4 + 0.2, 0.9, CAM_EASE);
  move(S, { bRing: 1 }, CL4 + 0.85, 0.5, 'expo.out');
  const WB = CL4 + 1.75;
  panY('B', 330 + SV / 2.15, WB, 0.42, 'power3.in'); mb(WB + 0.05, WB + 0.62);
  set(S, { B: 0 }, WB + 0.36);

  // ===== 06 "Backed by vetted institutions." rides up on the whip, carries on up as Deals rises in =====
  const X2 = WB + 0.24;
  tl.fromTo($('c2'), { y: 1000 }, { y: 0, duration: 0.45, ease: 'power3.out' }, X2);
  const E2 = cardIn($('c2'), X2 + 0.06, 0.08, 1);
  tl.fromTo($('c2'), { y: 0 }, { y: -SV, duration: STRIP, ease: CAM_EASE, immediateRender: false }, E2); mb(E2, E2 + STRIP);
  cardOut($('c2'), E2 + 0.95, 'fade');

  // ===== 07 DEALS: rise → stats count up, rows file in → push to the table → hover Atlas → glint on the APR → whip right =====
  set(S, { C: 1 }, E2);
  pan('C', cam(643, 482, WIDE), E2, STRIP);
  const W0 = E2 + STRIP;
  move(S, { cStat: 1 }, E2 + 0.4, 1.3, 'power2.out');
  S.cRows.forEach((_, i) => move(S.cRows, { [i]: 1 }, E2 + 0.55 + i * 0.07, 0.6, 'expo.out'));
  zoomTo('C', cam(660, 600, 1.36), W0 + 0.35, 1.2, CAM_EASE);
  curIn('C', 520, 760, W0 + 0.4); curGo(300, 482, W0 + 0.45, 0.75);
  move(S, { cHov: 1 }, W0 + 1.15, 0.3, 'power2.out');
  curGo(905, 484, W0 + 1.7, 0.7);
  shine('cShine', W0 + 2.25, 0.6);
  move(S, { cHov: 0 }, W0 + 2.9, 0.25, 'power1.in'); curOut(W0 + 2.9);
  panX('C', 660 + 1800 / 1.36, W0 + 2.85, 0.5, 'power3.in'); mb(W0 + 3.05, W0 + 3.8);
  set(S, { C: 0 }, W0 + 3.52);

  // ===== 08 "Every dollar, on-chain." rides in on the whip, slides off as the Dashboard glides in =====
  const X3 = W0 + 3.39;
  tl.fromTo($('c3'), { x: 1500 }, { x: 0, duration: 0.45, ease: 'power3.out' }, X3);
  const E3 = cardIn($('c3'), X3 + 0.05, 0.08, 1);
  tl.fromTo($('c3'), { x: 0 }, { x: -SHIFT, duration: STRIP, ease: CAM_EASE, immediateRender: false }, E3); mb(E3, E3 + STRIP);
  cardOut($('c3'), E3 + 0.95, 'fade');

  // ===== 09 DASHBOARD: glide in → liquidity + APY count up → transactions cascade → slow push on the history =====
  set(S, { D: 1 }, E3);
  pan('D', cam(643, 470, WIDE), E3, STRIP);
  const R0 = E3 + STRIP;
  move(S, { dStat: 1 }, E3 + 0.45, 1.4, 'power2.out');
  S.dRows.forEach((_, i) => move(S.dRows, { [i]: 1 }, E3 + 0.6 + i * 0.07, 0.6, 'expo.out'));
  zoomTo('D', cam(660, 640, 1.34), R0 + 0.3, 1.3, CAM_EASE);
  curIn('D', 760, 760, R0 + 0.45); curGo(640, 563, R0 + 0.5, 0.7);
  move(S, { dHov: 1 }, R0 + 1.15, 0.28, 'power2.out');
  move(S, { dHovY: 1 }, R0 + 1.75, 0.38, 'power3.inOut'); curGo(660, 649, R0 + 1.72, 0.4);
  move(S, { dHov: 0 }, R0 + 2.5, 0.25, 'power1.in'); curOut(R0 + 2.5);
  // pull back and soften: the dashboard becomes the backdrop for the trust points
  const TR = R0 + 2.6;
  zoomTo('D', cam(643, 560, 0.86), TR, 1.0, CAM_EASE);
  move(S, { dBlur: 1 }, TR + 0.1, 0.8, 'sine.inOut');

  // ===== 10 TRUST: "Institutional-grade by design." + four proof points =====
  const E4 = cardIn($('c4'), TR + 0.45, 0.07, 1.02);
  [0, 1, 2, 3].forEach(i => move(S.chips, { [i]: 1 }, TR + 0.75 + i * 0.1, 0.8, 'expo.out'));
  const TO = Math.max(E4, TR + 0.75 + 0.3 + 0.8) + 1.0;
  cardOut($('c4'), TO, 'rise');
  move(S, { chipsOut: 1 }, TO + 0.05, 0.45, 'power2.in');
  move(S, { D: 0 }, TO + 0.15, 0.6, 'sine.inOut');

  // ===== 11 LOCKUP: the mark and wordmark settle, "Credit at internet speed.", the URL =====
  const LK = TO + 0.5;
  set(S, { logoOn: 1, mk: 1, q: 1, w: 0, by: 0, logoScale: 1, LY: 452, LS: 6, gloss: -0.3 }, LK);
  set(S.tiles, Object.fromEntries([...Array(10).keys()].map(i => [i, 0])), LK);
  [0, 1, 2, 3, 4, 5].forEach((i, k) => move(S.tiles, { [i]: 1 }, LK + k * 0.04, 0.55, 'expo.out'));
  [6, 7, 8, 9].forEach((i, k) => move(S.tiles, { [i]: 1 }, LK + 0.2 + k * 0.04, 0.6, 'expo.out'));
  move(S, { w: 1 }, LK + 0.35, 0.6, 'expo.out');
  move(S, { gloss: 1.3 }, LK + 0.75, 0.55, 'power1.inOut');
  const ET = cardIn($('tagline'), LK + 0.55, 0.06, 1.0);
  move(S, { url: 1 }, LK + 0.95, 0.7, 'expo.out');
  const ENDT = Math.max(ET, LK + 1.65) + 1.5;
  move(S, { wash: 1 }, ENDT - 0.5, 0.5, 'sine.inOut');
  tl.set({}, {}, ENDT);

  window.TIMES = { H, E0, X0, SL, A0, T1, CL1, C1, CL2, X1, E1, B0, T2, CL3, C2, CL4, WB, X2, E2, W0, X3, E3, R0, TR, TO, LK, ENDT };
  window.DURATION = +ENDT.toFixed(3);
  window.MB = MBW;
}

// ---------------- apply ----------------
const applyCam = (el, c) => { el.style.transform = `translate(960px,540px) scale(${c.z}) translate(${-c.cx}px,${-c.cy}px)`; };
const w2s = (c, x, y) => [960 + (x - c.cx) * c.z, 540 + (y - c.cy) * c.z];
const op = (id, v) => { const el = $(id); el.style.opacity = v; el.style.display = v > 0.001 ? '' : 'none'; };
function shineApply(k) {
  const el = $(k), p = S.sh[k];
  if (p <= 0 || p >= 1) { el.style.display = 'none'; return; }
  const w = parseFloat(el.style.width), bw = Math.max(26, w * 0.32);
  el.style.display = 'block'; Object.assign(el.firstElementChild.style, { width: bw + 'px', left: (-bw * 1.4 + (w + bw * 2.8) * p) + 'px' });
}
function applyLogo() {
  show($('logo'), S.logoOn > 0); show($('glow'), S.logoOn > 0);
  if (!S.logoOn) { show($('by'), false); return; }
  const L = S.LS, M = L * 1.45, LY = S.LY;
  const ox = 960 - LOCKC * L, oy = LY - 16 * L, lockC = [ox + MC[0] * L, oy + MC[1] * L];
  const q = S.q, s = lerp(M, L, q), cx = lerp(960, lockC[0], q), cy = lerp(LY, lockC[1], q);
  $('gMark').setAttribute('transform', `translate(${cx - MC[0] * s} ${cy - MC[1] * s}) scale(${s})`);
  TILE_EL.forEach((r, i) => {
    const p = S.tiles[i], [x, y, w, h] = TILES[i];
    let tr;
    if (i < 6) { const c = [x + w / 2, y + h / 2], k = 0.35 + 0.65 * p; tr = `translate(${c[0]} ${c[1] + 1.2 * (1 - p)}) scale(${k}) translate(${-c[0]} ${-c[1]})`; }
    else { const [fx, fy] = BAR_FROM[i]; tr = `translate(${fx * (1 - p)} ${fy * (1 - p)})`; }
    r.setAttribute('transform', tr); r.style.opacity = clamp(p * 1.8, 0, 1); GLOSS_EL[i].setAttribute('transform', tr); GLOSS_EL[i].style.opacity = clamp(p * 1.8, 0, 1);
  });
  const g = S.gloss; $('g0').setAttribute('offset', clamp(g - 0.12, 0, 1)); $('g1').setAttribute('offset', clamp(g, 0, 1)); $('g2').setAttribute('offset', clamp(g + 0.12, 0, 1));
  // wordmark: wipes in from behind the mark, sliding a touch left as it sharpens
  const wv = S.w;
  $('gWord').setAttribute('transform', `translate(${ox + 3 * L * (1 - wv)} ${oy}) scale(${L})`);
  $('wclipR').setAttribute('width', 46 * wv);
  $('gWord').style.opacity = clamp(wv * 1.6, 0, 1); $('gWord').style.filter = `blur(${(1 - wv) * 4}px)`;
  Object.assign($('glow').style, { left: (cx - 500) + 'px', top: (cy - 500) + 'px', opacity: S.glow * (1 - 0.5 * q) });
  const sc = `scale(${S.logoScale})`;
  Object.assign($('logo').style, { transformOrigin: `${cx}px ${cy}px`, transform: sc }); $('glow').style.transform = sc;
  show($('by'), false);   // v3: no "by KernelDAO"
  Object.assign($('by').style, { top: (oy + 31 * L) + 'px', opacity: S.by * (1 - clamp((S.logoScale - 1) * 2, 0, 1)), transform: `translateY(${(1 - S.by) * 14}px)`, filter: `blur(${(1 - S.by) * 6}px)` });
}
function modalApply(p) {
  const m = $(p + 'Mod'), a = S[p + 'Mod'], o = S[p + 'ModOut'];
  const v = a * (1 - o); show(m, v > 0.001);
  if (v > 0.001) {
    m.style.opacity = clamp(a * 1.4, 0, 1) * (1 - o);
    m.style.transform = `translateY(${(1 - a) * 26 - o * 10}px) scale(${(0.955 + 0.045 * a) * (1 - 0.03 * o)})`;
    op(p + 'Mod2', S[p + 'Mod2']); op(p + 'Mod3', S[p + 'Mod3']);
    const t = window.__t || 0;
    [1, 2].forEach(k => {
      const sp = $(p + 'Sp' + k), ck = $(p + 'Ck' + k), sv = S[p + 'Sp' + k], cv = S[p + 'Ck' + k], cy = k === 1 ? 180 : 232;
      sp.style.opacity = sv; sp.setAttribute('transform', `translate(500 ${cy}) rotate(${(t * 400) % 360})`);
      ck.style.opacity = clamp(cv * 2, 0, 1); ck.setAttribute('transform', `translate(500 ${cy}) scale(${0.6 + 0.4 * cv})`);
    });
  }
  const ok = $(p + 'Ok'), b = S[p + 'Ok'], bo = S[p + 'OkOut'], bv = b * (1 - bo); show(ok, bv > 0.001);
  if (bv > 0.001) { ok.style.opacity = clamp(b * 1.4, 0, 1) * (1 - bo); ok.style.transform = `translateY(${(1 - b) * 30 - bo * 10}px) scale(${(0.95 + 0.05 * b) * (1 - 0.03 * bo)})`; }
}
function amtApply(p) {
  const on = S[p + 'Patch'] > 0.5, a = S[p + '3'];
  show($(p + 'Patch'), on);   // the field keeps the live text; its fill follows the focus state underneath
  $(p + 'Patch').style.background = `rgb(${lerp(245, 244, a)},${lerp(248, 244, a)},${lerp(248, 247, a)})`;
  const tx = $(p + 'Amt'), n = Math.floor(S[p + 'N'] + 1e-6);
  const s = n ? AMT[n - 1] + (S[p + 'Dec'] > 0.5 ? '.00' : '') : '';
  tx.textContent = on ? s : ''; tx.style.opacity = 1;
  const caret = $(p + 'Caret'), blink = Math.floor((window.__t || 0) * 3) % 2 === 0;
  const typing = S[p + 'N'] > 0 && S[p + 'N'] < AMT.length;
  const cv = on && S[p + 'Caret'] > 0.5 && (typing || blink);
  caret.style.display = cv ? '' : 'none';
  if (cv) caret.setAttribute('x', 480 + (s ? tx.getComputedTextLength() + 1.5 : 0));
}
function render(t) {
  window.__t = t;
  tl.time(t, false);
  for (const id of IDS) S.cams[id] = camAt(id, t);
  let px = 0, py = 0, pz = 0, wsum = 0;
  for (const id of IDS) { const w = S[id]; if (w <= 0.001) continue; const c = S.cams[id]; px += w * (c.cx - 643); py += w * (c.cy - 450); pz += w * Math.log(clamp(c.z / WIDE, 0.5, 2.5)); wsum += w; }
  if (wsum > 1) { px /= wsum; py /= wsum; pz /= wsum; }
  $('bg').style.transform = `translate(${-10 + 0.9 * t - clamp(px * 0.09, -90, 90)}px,${-6 + 0.35 * t - clamp(py * 0.06, -60, 60)}px) scale(${1.05 * Math.exp(0.08 * pz)})`;
  $('wash').style.opacity = S.wash;
  document.querySelectorAll('.gw').forEach(g => { g.style.backgroundPosition = `${100 - (t * 40) % 100}% 0`; });
  applyLogo(); ['aShine', 'bShine', 'cShine'].forEach(shineApply);

  show($('wA'), S.A > 0.001);
  if (S.A > 0.001) {
    op('a1', S.a1); op('a3', S.a3); op('a4', S.a4); op('aBlur', S.aBlur);
    amtApply('a'); modalApply('a'); $('aOkHov').style.opacity = S.aOkHov;
    applyCam($('wA'), S.cams.A); $('wA').style.opacity = S.A;
  }
  show($('wB'), S.B > 0.001);
  if (S.B > 0.001) {
    op('b1', S.b1); op('b3', S.b3); op('b4', S.b4); op('b10', S.b10); op('bBlur', S.bBlur);
    amtApply('b'); modalApply('b');
    const r = S.bRing; $('bRing').style.opacity = r; $('bRing').style.transform = `scale(${1.25 - 0.25 * r})`;
    applyCam($('wB'), S.cams.B); $('wB').style.opacity = S.B;
  }
  show($('wC'), S.C > 0.001);
  if (S.C > 0.001) {
    const s = S.cStat;
    $('cS0').textContent = Math.round(7 * s); $('cS1').textContent = '$' + fmt(Math.round(39650000 * s / 1000) * 1000, 0);
    $('cS2').textContent = Math.round(63 * s) + ' days'; $('cS3').textContent = (12.2 * s).toFixed(1) + '% APR';
    S.cRows.forEach((v, i) => { const el = $('cr' + i); el.style.opacity = v; el.style.transform = `translateY(${(1 - v) * 22}px)`; });
    const h = S.cHov; $('cHov').style.opacity = h; $('cr0').style.transform = `translateY(${(1 - S.cRows[0]) * 22 - 2.5 * h}px)`; $('cHov').style.transform = `translateY(${-2.5 * h}px)`;
    applyCam($('wC'), S.cams.C); $('wC').style.opacity = S.C;
  }
  show($('wD'), S.D > 0.001);
  if (S.D > 0.001) {
    const s = S.dStat;
    $('dLiq').textContent = fmt(Math.round(5000000 * s), 0) + ' USDC'; $('dApy').textContent = (8.2 * s).toFixed(1) + '%';
    S.dRows.forEach((v, i) => { const el = $('dr' + i); el.style.opacity = v; el.style.transform = `translateY(${(1 - v) * 22}px)`; });
    const h = S.dHov, hy = S.dHovY; $('dHov').style.opacity = h; $('dHov').style.top = (523.3 + 86 * hy) + 'px';
    $('wD').style.filter = S.dBlur > 0.001 ? `blur(${S.dBlur * 12}px)` : 'none';
    applyCam($('wD'), S.cams.D); $('wD').style.opacity = S.D * (1 - 0.6 * S.dBlur);
  }
  ['h1', 'c0', 'c1', 'c2', 'c3', 'c4', 'tagline'].forEach(id => { const el = $(id); show(el, words(el).some(s => parseFloat(s.style.opacity || 0) > 0.001)); });
  S.chips.forEach((v, i) => { const el = $('chip' + i), o = S.chipsOut, vv = v * (1 - o); show(el, vv > 0.001); el.style.opacity = vv; el.style.transform = `translateY(${(1 - v) * 30 - o * 20}px) scale(${0.96 + 0.04 * v})`; el.style.filter = `blur(${(1 - v) * 6 + o * 6}px)`; });
  const u = S.url; show($('url'), false);   // v3: no URL pill $('url').style.opacity = u; $('url').style.transform = `translateY(${(1 - u) * 18}px)`; $('url').style.filter = `blur(${(1 - u) * 6}px)`;

  const cur = $('cursor'), cs = S.cur;
  if (cs.op > 0.001 && S[cs.w] > 0.001) {
    const [x, y] = w2s(S.cams[cs.w], cs.x, cs.y);
    Object.assign(cur.style, { display: 'block', left: x + 'px', top: y + 'px', opacity: cs.op, transform: `scale(${1 - 0.16 * cs.press})`, transformOrigin: '0 0' });
    $('curArrow').style.opacity = 1 - cs.hand; $('curHand').style.opacity = cs.hand;
  } else cur.style.display = 'none';
}

window.render = render;
window.ready = (async () => {
  await document.fonts.load('600 40px Geist'); await document.fonts.load('500 20px Geist'); await document.fonts.load('400 20px Geist');
  drawBg();
  heading($('h1'), 'Earn from short-term | payment financing.', ['payment', 'financing.']);
  heading($('c0'), 'Mint KUSD, pegged 1:1 to USD.', ['KUSD,']);
  heading($('c1'), 'Stake KUSD to earn real yield.', ['real', 'yield.']);
  heading($('c2'), 'Pegged 1:1 to USD. | Backed by vetted institutions.', ['1:1', 'vetted', 'institutions.']);
  heading($('c3'), 'Every dollar, on-chain.', ['on-chain.']);
  heading($('c4'), 'Institutional-grade by design.', ['by', 'design.']);
  heading($('tagline'), 'Credit at internet speed.', ['internet', 'speed.']);
  setupLogo(); setupChips(); setupRows(); build();
  await Promise.all([...document.images].map(i => i.decode().catch(() => null)));
  render(0); return true;
})();
