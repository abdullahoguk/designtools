/* Cutting Mat Wallpaper Generator — designtools.abdullahog.uk/cuttingmatwallpaper
 * Everything is drawn relative to the canvas size, so the small preview and the
 * full-resolution export produce the same composition. */
'use strict';

(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ------------------------------------------------------------------ data */

  const PRESETS = [
    { group: 'Telefon', items: [
      ['iphone-pro-max', 'iPhone 16/17 Pro Max', 1320, 2868],
      ['iphone-pro', 'iPhone 16/17 Pro', 1206, 2622],
      ['iphone', 'iPhone 15/16', 1179, 2556],
      ['iphone-plus', 'iPhone 15 Pro Max / 16 Plus', 1290, 2796],
      ['iphone-13', 'iPhone 12–14', 1170, 2532],
      ['iphone-se', 'iPhone SE', 750, 1334],
      ['android-fhd', 'Android FHD+ (20:9)', 1080, 2400],
      ['android-qhd', 'Android QHD+ (20:9)', 1440, 3200],
      ['pixel-pro', 'Pixel 9 Pro', 1280, 2856],
      ['galaxy-ultra', 'Galaxy S24/S25 Ultra', 1440, 3120],
    ] },
    { group: 'Tablet', items: [
      ['ipad-pro-13', 'iPad Pro 13" (dikey)', 2064, 2752],
      ['ipad-pro-13-l', 'iPad Pro 13" (yatay)', 2752, 2064],
      ['ipad-air-11', 'iPad Air 11" (dikey)', 1640, 2360],
      ['ipad-mini', 'iPad mini (dikey)', 1488, 2266],
    ] },
    { group: 'Masaüstü & dizüstü', items: [
      ['fhd', 'Full HD 16:9 — 1920×1080', 1920, 1080],
      ['qhd', 'QHD 16:9 — 2560×1440', 2560, 1440],
      ['4k', '4K UHD — 3840×2160', 3840, 2160],
      ['5k', '5K / Studio Display', 5120, 2880],
      ['6k', '6K Pro Display XDR', 6016, 3384],
      ['wqxga', '16:10 — 2560×1600', 2560, 1600],
      ['uw', 'Ultrawide 21:9 — 3440×1440', 3440, 1440],
      ['suw', 'Süper ultrawide 32:9', 5120, 1440],
      ['mba-13', 'MacBook Air 13"', 2560, 1664],
      ['mba-15', 'MacBook Air 15"', 2880, 1864],
      ['mbp-14', 'MacBook Pro 14"', 3024, 1964],
      ['mbp-16', 'MacBook Pro 16"', 3456, 2234],
      ['imac', 'iMac 24" 4.5K', 4480, 2520],
    ] },
  ];

  const THEMES = {
    green:  { name: 'Yeşil',    bg: '#1f8c68', line: '#eaf4ee', text: '#f4f8f5' },
    orange: { name: 'Turuncu',  bg: '#d4601e', line: '#fde9da', text: '#fff4ec' },
    cream:  { name: 'Krem',     bg: '#f4f1ec', line: '#3d3b38', text: '#2a2826' },
    black:  { name: 'Siyah',    bg: '#0c0c0c', line: '#8f8f8f', text: '#e8e8e8' },
    blue:   { name: 'Mavi',     bg: '#1d4fa3', line: '#e3eaf7', text: '#f2f5fb' },
    navy:   { name: 'Lacivert', bg: '#15223f', line: '#9fb0d0', text: '#e9eef8' },
    pink:   { name: 'Pembe',    bg: '#eeb4c0', line: '#5b2533', text: '#4a1d29' },
    yellow: { name: 'Sarı',     bg: '#ecc443', line: '#2d2a20', text: '#24211a' },
    grey:   { name: 'Gri',      bg: '#bfc0bb', line: '#2e2f2c', text: '#222320' },
    purple: { name: 'Mor',      bg: '#5b3fa6', line: '#ece6fb', text: '#f6f2ff' },
  };

  const QUOTES = [
    { t: 'Stay focused.', b: 'Attention is the rarest material you own. Spend it on fewer things, cut away the rest, and let the work take its real shape.' },
    { t: 'Get things done.', b: 'Start before you feel ready. Small finished pieces beat large perfect plans; measure progress in what ships, not in what is imagined.' },
    { t: "Don't be busy.\nBe productive.", b: 'Motion is not progress. Choose the cut that matters, make it clean, and leave the rest of the board untouched.' },
    { t: 'Good things,\ntake time.', b: 'Patience is a working tool. Lay down each line with care; the grid rewards those who return to it every day.' },
    { t: 'Measure twice,\ncut once.', b: 'Plan with care, act with confidence. Precision at the start saves hours of repair at the end.' },
    { t: 'Done is better\nthan perfect.', b: 'Ship the honest version today. Refinement is easier when there is something real on the table.' },
    { t: 'Make it simple.', b: 'Remove until it breaks, then add back one thing. Clarity is a cut, not a coat of paint.' },
    { t: 'Odaklan.', b: 'Dikkatin en değerli malzemen. Onu az şeye harca, gerisini kes at ve işin gerçek şeklini almasına izin ver.' },
    { t: 'Ölç, biç,\nsonra kes.', b: 'Acele etme. Planı sağlam kur, çizgiyi net çek; iyi iş, sabırla atılan adımların toplamıdır.' },
    { t: 'Adım adım.', b: 'Büyük işler küçük ve düzenli adımlarla biter. Bugün bir çizgi daha çek.' },
    { t: 'Az ama öz.', b: 'Fazlalıkları kes. Geriye kalan, gerçekten önemli olandır.' },
    { t: 'Sabır, en keskin\nbıçaktır.', b: 'Hızlı kesim çoğu zaman yeniden ölçmek demektir. Yavaş ol, doğru ol.' },
  ];

  const FONTS = [
    { group: 'Serif', items: [
      ['Newsreader', 'Newsreader'],
      ['Instrument Serif', 'Instrument Serif'],
      ['Fraunces', 'Fraunces'],
      ['DM Serif Display', 'DM Serif Display'],
      ['EB Garamond', 'EB Garamond'],
      ['Playfair Display', 'Playfair Display'],
      ['IBM Plex Serif', 'IBM Plex Serif'],
    ] },
    { group: 'Grotesk / sans', items: [
      ['Inter Tight', 'Inter Tight'],
      ['Geist', 'Geist'],
      ['Instrument Sans', 'Instrument Sans'],
      ['Space Grotesk', 'Space Grotesk'],
      ['Bricolage Grotesque', 'Bricolage Grotesque'],
      ['Manrope', 'Manrope'],
      ['Syne', 'Syne'],
    ] },
    { group: 'Mono', items: [
      ['JetBrains Mono', 'JetBrains Mono'],
      ['IBM Plex Mono', 'IBM Plex Mono'],
      ['Geist Mono', 'Geist Mono'],
    ] },
  ];
  const FONT_IDS = FONTS.flatMap(g => g.items.map(i => i[0]));

  const DEFAULT = Object.freeze({
    preset: 'fhd', w: 1920, h: 1080,
    theme: 'green', bg: THEMES.green.bg, line: THEMES.green.line, text: THEMES.green.text,
    pattern: 'grid', density: 24, major: 5, lineOpacity: 100, sub: false,
    frame: true, rulers: true, rulerStep: 'cell', diagonal: true, angles: true,
    guideOrigin: 'bl', angleStep: 15, arcs: false, arcRadii: '', arcTicks: true,
    sideLabel: true, sideText: 'Cutting mat wallpaper\ndesigntools.abdullahog.uk',
    quoteOn: true, quote: QUOTES[0].t, font: 'Newsreader', fontWeight: 400, fontItalic: false, fontSize: 4.4, textY: 50, textBox: true,
    bodyOn: true, bodyWeight: 400, body: QUOTES[0].b, bodyPos: 'br',
    light: 'none', lightIntensity: 60, lightSoftness: 55, lightAngle: -38, seed: 7,
    lightX: 32, lightY: 30, lightSize: 55,
    grain: 18, vignette: 0,
    lockscreen: true,
    format: 'png',
  });

  let state = { ...DEFAULT };

  /* --------------------------------------------------------------- helpers */

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };

  function hexRgb(hex) {
    let h = String(hex || '#000').replace('#', '');
    if (h.length === 3) h = h.split('').map(c => c + c).join('');
    const n = parseInt(h, 16) || 0;
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }
  const rgba = (c, a) => `rgba(${c.r},${c.g},${c.b},${clamp(a, 0, 1)})`;
  const luminance = c => (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255;

  function mulberry32(a) {
    return () => {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Does this browser support ctx.filter blur? (Safari < 18 does not.)
  const FILTER_OK = (() => {
    try {
      const c = mk(12, 12), x = c.getContext('2d');
      if (!('filter' in x)) return false;
      x.filter = 'blur(3px)';
      x.fillRect(5, 5, 2, 2);
      return x.getImageData(1, 1, 1, 1).data[3] > 0;
    } catch { return false; }
  })();

  const fontQuote = (st, px) => `${st.fontItalic ? 'italic ' : ''}${st.fontWeight} ${px}px "${st.font}", Georgia, serif`;
  const fontSans = (px, w = 400) => `${w} ${px}px "Inter Tight", "Helvetica Neue", Arial, sans-serif`;
  const fontMono = px => `400 ${px}px "JetBrains Mono", ui-monospace, monospace`;

  function neededFonts(st) {
    return [fontQuote(st, 40), fontSans(40, st.bodyWeight), fontSans(40, 500), fontMono(40)];
  }

  /* ----------------------------------------------------------- light mask */

  const maskCache = new Map();
  const PATCH_LIGHTS = new Set(['spot', 'window']);

  function drawShadowShapes(x, w, h, st) {
    const rnd = mulberry32(st.seed * 9973 + st.light.length * 131);
    const D = Math.hypot(w, h);
    x.fillStyle = '#000';
    x.strokeStyle = '#000';
    x.lineCap = 'round';

    // "Fallen light" types: the whole surface is in shade and light is cut out of it.
    if (PATCH_LIGHTS.has(st.light)) {
      x.fillRect(0, 0, w, h);
      x.globalCompositeOperation = 'destination-out';
      const P = [w * st.lightX / 100, h * st.lightY / 100];
      const S = D * (0.1 + st.lightSize / 100 * 0.42);
      const ang = st.lightAngle * Math.PI / 180;

      if (st.light === 'spot') {
        const g = x.createRadialGradient(P[0], P[1], 0, P[0], P[1], S);
        g.addColorStop(0, 'rgba(0,0,0,1)');
        g.addColorStop(0.45, 'rgba(0,0,0,.75)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = g;
        x.fillRect(0, 0, w, h);
        // a faint secondary bounce
        const q = [P[0] + Math.cos(ang) * S * 1.1, P[1] - Math.sin(ang) * S * 1.1];
        const g2 = x.createRadialGradient(q[0], q[1], 0, q[0], q[1], S * 0.45);
        g2.addColorStop(0, 'rgba(0,0,0,.35)');
        g2.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = g2;
        x.fillRect(0, 0, w, h);
      }

      if (st.light === 'window') {
        // Soft halo around the patch
        const halo = x.createRadialGradient(P[0], P[1], 0, P[0], P[1], S * 1.3);
        halo.addColorStop(0, 'rgba(0,0,0,.35)');
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = halo;
        x.fillRect(0, 0, w, h);
        // Window panes projected onto the surface: rotated + sheared parallelogram grid
        const cols = 2 + Math.floor(rnd() * 2), rows = 2;
        const pw = S * 0.9 / cols, ph = S * 1.25 / rows, gap = S * 0.045;
        x.save();
        x.translate(P[0], P[1]);
        x.rotate(ang);
        x.transform(1, 0, -0.55, 1, 0, 0);
        x.fillStyle = '#000';
        for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
          x.fillRect(-cols * pw / 2 + c * pw + gap / 2, -rows * ph / 2 + r * ph + gap / 2, pw - gap, ph - gap);
        }
        x.restore();
      }

      x.globalCompositeOperation = 'source-over';
      return;
    }

    if (st.light === 'blinds' || st.light === 'mixed') {
      x.save();
      x.translate(w / 2, h / 2);
      x.rotate(st.lightAngle * Math.PI / 180);
      const period = D * (st.light === 'mixed' ? 0.115 : 0.085);
      let p = -D / 2 - rnd() * period;
      while (p < D / 2) {
        const bw = period * (0.36 + rnd() * 0.24);
        x.fillRect(p, -D, bw, 2 * D);
        p += period * (0.88 + rnd() * 0.28);
      }
      if (rnd() < 0.75) { // window mullion across the slats
        const q = (rnd() - 0.5) * D * 0.5;
        x.fillRect(-D, q, 2 * D, period * 0.55);
      }
      x.restore();
    }

    if (st.light === 'leaves' || st.light === 'mixed') {
      const branches = st.light === 'mixed' ? 2 : 4 + Math.floor(rnd() * 3);
      const base = st.lightAngle * Math.PI / 180;
      for (let b = 0; b < branches; b++) {
        // start just outside the top/right edge, grow inward along the light angle
        const side = rnd();
        let px = side < 0.6 ? rnd() * w : w + D * 0.02;
        let py = side < 0.6 ? -D * 0.02 : rnd() * h * 0.8;
        let ang = Math.PI / 2 + base * 0.6 + (rnd() - 0.5) * 0.9 + (side < 0.6 ? 0 : 0.6);
        const len = D * (0.35 + rnd() * 0.4);
        const steps = 60, stepLen = len / steps;
        const curve = (rnd() - 0.5) * 0.03;
        x.lineWidth = D * 0.0035;
        x.beginPath();
        x.moveTo(px, py);
        const pts = [];
        for (let i = 0; i < steps; i++) {
          ang += curve + (rnd() - 0.5) * 0.04;
          px += Math.cos(ang) * stepLen;
          py += Math.sin(ang) * stepLen;
          x.lineTo(px, py);
          pts.push([px, py, ang]);
        }
        x.stroke();
        const every = 3 + Math.floor(rnd() * 2);
        for (let i = 2; i < pts.length; i += every) {
          const [lx, ly, la] = pts[i];
          const sideSign = (i / every) % 2 < 1 ? 1 : -1;
          const rx = D * (0.022 + rnd() * 0.022) * (1 - i / pts.length * 0.35);
          const ry = rx * (0.36 + rnd() * 0.12);
          const rot = la + sideSign * (0.55 + rnd() * 0.45);
          const cx = lx + Math.cos(rot) * rx * 0.9;
          const cy = ly + Math.sin(rot) * rx * 0.9;
          x.beginPath();
          x.ellipse(cx, cy, rx, ry, rot, 0, Math.PI * 2);
          x.fill();
        }
      }
    }
  }

  function getMask(W, H, st) {
    const ms = Math.min(1, 1024 / Math.max(W, H));
    const w = Math.max(4, Math.round(W * ms)), h = Math.max(4, Math.round(H * ms));
    const key = [w, h, st.light, st.lightAngle, st.lightSoftness, st.seed, st.lightX, st.lightY, st.lightSize].join('|');
    if (maskCache.has(key)) return maskCache.get(key);

    const a = mk(w, h);
    drawShadowShapes(a.getContext('2d'), w, h, st);
    const blur = (1 + st.lightSoftness / 100 * 34) * (Math.max(w, h) / 1024);
    const out = mk(w, h), ox = out.getContext('2d');
    if (FILTER_OK) {
      ox.filter = `blur(${blur.toFixed(2)}px)`;
      ox.drawImage(a, 0, 0);
      ox.filter = 'none';
    } else {
      // Fallback blur: down-sample then smooth up-sample (twice for softer edges).
      const f = Math.max(1, blur / 1.1);
      const s1 = mk(Math.max(2, Math.round(w / f)), Math.max(2, Math.round(h / f)));
      const s2 = mk(Math.max(2, Math.round(w / f * 2)), Math.max(2, Math.round(h / f * 2)));
      for (const [c, src] of [[s1, a], [s2, s1]]) {
        const cx = c.getContext('2d');
        cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
        cx.drawImage(src, 0, 0, c.width, c.height);
      }
      ox.imageSmoothingEnabled = true; ox.imageSmoothingQuality = 'high';
      ox.drawImage(s2, 0, 0, w, h);
    }
    if (maskCache.size > 12) maskCache.delete(maskCache.keys().next().value);
    maskCache.set(key, out);
    return out;
  }

  function applyLight(ctx, W, H, st) {
    if (st.light === 'none' || st.lightIntensity <= 0) return;
    const patch = PATCH_LIGHTS.has(st.light);
    const mask = getMask(W, H, st);
    const k = st.lightIntensity / 100;
    const bg = hexRgb(st.bg);
    const lum = luminance(bg);

    // Shadow: multiply by a deeper, more saturated version of the background.
    const shade = c => Math.round(255 * Math.pow(c / 255, 0.85) * 0.55);
    const sc = mk(mask.width, mask.height), sx = sc.getContext('2d');
    sx.fillStyle = `rgb(${shade(bg.r)},${shade(bg.g)},${shade(bg.b)})`;
    sx.fillRect(0, 0, sc.width, sc.height);
    sx.globalCompositeOperation = 'destination-in';
    sx.drawImage(mask, 0, 0);

    // Highlight: warm light through the gaps (matters most on dark backgrounds).
    const hc = mk(mask.width, mask.height), hx = hc.getContext('2d');
    hx.fillStyle = 'rgb(255,244,226)';
    hx.fillRect(0, 0, hc.width, hc.height);
    hx.globalCompositeOperation = 'destination-out';
    hx.drawImage(mask, 0, 0);

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.globalCompositeOperation = 'multiply';
    ctx.globalAlpha = k * (patch ? 0.75 : 0.95);
    ctx.drawImage(sc, 0, 0, W, H);
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = k * (lum < 0.2 ? 0.16 : 0.14) * (patch ? 2.2 : 1);
    ctx.drawImage(hc, 0, 0, W, H);
    ctx.restore();
  }

  let noiseTile = null;
  function applyGrain(ctx, W, H, st) {
    if (st.grain <= 0) return;
    if (!noiseTile) {
      noiseTile = mk(192, 192);
      const x = noiseTile.getContext('2d');
      const img = x.createImageData(192, 192);
      const rnd = mulberry32(42);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 128 + (rnd() - 0.5) * 200;
        img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
        img.data[i + 3] = 255;
      }
      x.putImageData(img, 0, 0);
    }
    const u = Math.min(W, H) / 1000;
    const pat = ctx.createPattern(noiseTile, 'repeat');
    if (pat.setTransform) pat.setTransform(new DOMMatrix().scale(Math.max(0.5, u)));
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = st.grain / 100 * 0.22;
    ctx.fillStyle = pat;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function applyVignette(ctx, W, H, st) {
    if (st.vignette <= 0) return;
    const R = Math.hypot(W, H) / 2;
    const g = ctx.createRadialGradient(W / 2, H / 2, R * 0.35, W / 2, H / 2, R);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(1, `rgba(0,0,0,${st.vignette / 100 * 0.6})`);
    ctx.save();
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  /* ---------------------------------------------------------------- render */

  function wrapText(ctx, text, maxW) {
    const out = [];
    for (const para of text.split('\n')) {
      const words = para.split(/\s+/).filter(Boolean);
      if (!words.length) { out.push(''); continue; }
      let line = words[0];
      for (let i = 1; i < words.length; i++) {
        const test = line + ' ' + words[i];
        if (ctx.measureText(test).width > maxW) { out.push(line); line = words[i]; }
        else line = test;
      }
      out.push(line);
    }
    return out;
  }

  function render(ctx, W, H, st) {
    const m = Math.min(W, H), u = m / 1000;
    const LC = hexRgb(st.line), op = st.lineOpacity / 100;
    const px = v => Math.max(v * u, 0.35);
    const P = st.pattern;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = st.bg;
    ctx.fillRect(0, 0, W, H);

    /* --- grid geometry --- */
    const framed = st.frame || st.rulers;
    const margin = framed ? m * 0.065 : 0;
    const cell = (m - 2 * margin) / st.density;
    let cols, rows;
    if (framed) {
      cols = Math.max(1, Math.floor((W - 2 * margin) / cell + 1e-6));
      rows = Math.max(1, Math.floor((H - 2 * margin) / cell + 1e-6));
    } else {
      cols = Math.max(1, Math.floor((W - cell * 0.6) / cell));
      rows = Math.max(1, Math.floor((H - cell * 0.6) / cell));
    }
    const gw = cols * cell, gh = rows * cell;
    const gx = (W - gw) / 2, gy = (H - gh) / 2;
    const ox = gx, oy = gy + gh; // origin bottom-left, like a real mat
    const ext = framed ? [gx, gy, gx + gw, gy + gh] : [0, 0, W, H];
    const iA = framed ? 0 : -Math.ceil(gx / cell), iB = framed ? cols : cols + Math.ceil(gx / cell);
    const jA = framed ? 0 : -Math.ceil(gy / cell), jB = framed ? rows : rows + Math.ceil(gy / cell);
    const X = i => ox + i * cell, Y = j => oy - j * cell;
    const isMaj = n => Number.isInteger(n) && ((n % st.major) + st.major) % st.major === 0;

    const gridLines = (filter, step, width, color) => {
      ctx.beginPath();
      for (let i = iA; i <= iB + 1e-9; i += step) {
        if (!filter(i)) continue;
        const x = X(i);
        if (x < ext[0] - 0.5 || x > ext[2] + 0.5) continue;
        ctx.moveTo(x, ext[1]); ctx.lineTo(x, ext[3]);
      }
      for (let j = jA; j <= jB + 1e-9; j += step) {
        if (!filter(j)) continue;
        const y = Y(j);
        if (y < ext[1] - 0.5 || y > ext[3] + 0.5) continue;
        ctx.moveTo(ext[0], y); ctx.lineTo(ext[2], y);
      }
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.stroke();
    };

    const crosses = (skipMajorLines) => {
      const s = cell * 0.17;
      ctx.beginPath();
      for (let i = framed ? 0 : 0; i <= cols; i++) {
        for (let j = 0; j <= rows; j++) {
          if (skipMajorLines && (isMaj(i) || isMaj(j))) continue;
          const x = X(i), y = Y(j);
          const k = (!skipMajorLines && isMaj(i) && isMaj(j)) ? 1.35 : 1;
          ctx.moveTo(x - s * k, y); ctx.lineTo(x + s * k, y);
          ctx.moveTo(x, y - s * k); ctx.lineTo(x, y + s * k);
        }
      }
      ctx.lineWidth = px(1.1);
      ctx.strokeStyle = rgba(LC, 0.8 * op);
      ctx.stroke();
    };

    const dots = (positions, r, alpha) => {
      ctx.beginPath();
      for (const [x, y] of positions) { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2); }
      ctx.fillStyle = rgba(LC, alpha);
      ctx.fill();
    };

    ctx.lineCap = 'butt';

    if (P === 'grid') {
      if (st.sub) gridLines(i => !Number.isInteger(i), 0.5, px(0.5), rgba(LC, 0.13 * op));
      gridLines(i => !isMaj(i), 1, px(0.8), rgba(LC, 0.32 * op));
      gridLines(isMaj, 1, px(1.8), rgba(LC, 0.9 * op));
    } else if (P === 'gridcross') {
      if (st.sub) gridLines(i => !isMaj(i), 1, px(0.5), rgba(LC, 0.12 * op));
      gridLines(isMaj, 1, px(1.6), rgba(LC, 0.85 * op));
      crosses(true);
    } else if (P === 'cross') {
      crosses(false);
      if (st.sub) {
        const pos = [];
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) pos.push([X(i + 0.5), Y(j + 0.5)]);
        dots(pos, px(1), 0.35 * op);
      }
    } else if (P === 'dots') {
      const small = [], big = [];
      for (let i = 0; i <= cols; i++) for (let j = 0; j <= rows; j++) {
        (isMaj(i) && isMaj(j) ? big : small).push([X(i), Y(j)]);
      }
      dots(small, px(1.8), 0.75 * op);
      dots(big, px(3), 0.95 * op);
      if (st.sub) {
        const pos = [];
        for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) pos.push([X(i + 0.5), Y(j + 0.5)]);
        dots(pos, px(0.9), 0.35 * op);
      }
    }

    /* --- frame --- */
    if (st.frame && P !== 'plain') {
      ctx.lineWidth = px(2.2);
      ctx.strokeStyle = rgba(LC, 0.95 * op);
      ctx.strokeRect(gx, gy, gw, gh);
    }

    /* --- rulers / edge ticks --- */
    if (st.rulers && framed && P !== 'plain') {
      const fs = clamp(cell * 0.26, 7 * u, 13 * u);
      const minStep = Math.max(1, Math.ceil(fs * 2.3 / cell));
      const step = st.rulerStep === 'major' ? Math.ceil(minStep / st.major) * st.major : minStep;
      ctx.beginPath();
      const tickStep = st.sub ? 0.5 : 1;
      for (let i = 0; i <= cols + 1e-9; i += tickStep) {
        const len = margin * (isMaj(i) ? 0.18 : Number.isInteger(i) ? 0.1 : 0.05);
        ctx.moveTo(X(i), gy); ctx.lineTo(X(i), gy - len);
        ctx.moveTo(X(i), oy); ctx.lineTo(X(i), oy + len);
      }
      for (let j = 0; j <= rows + 1e-9; j += tickStep) {
        const len = margin * (isMaj(j) ? 0.18 : Number.isInteger(j) ? 0.1 : 0.05);
        ctx.moveTo(gx, Y(j)); ctx.lineTo(gx - len, Y(j));
        ctx.moveTo(gx + gw, Y(j)); ctx.lineTo(gx + gw + len, Y(j));
      }
      ctx.lineWidth = px(0.8);
      ctx.strokeStyle = rgba(LC, 0.5 * op);
      ctx.stroke();

      ctx.font = fontMono(fs);
      ctx.fillStyle = rgba(LC, 0.72 * op);
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const off = margin * 0.5;
      for (let i = 0; i <= cols; i += step) {
        ctx.fillText(String(i), X(i), gy - off);
        ctx.fillText(String(i), X(i), oy + off);
      }
      for (let j = 0; j <= rows; j += step) {
        ctx.fillText(String(j), gx - off, Y(j));
        ctx.fillText(String(j), gx + gw + off, Y(j));
      }
    }

    /* --- angle & radius guides --- */
    if ((st.diagonal || st.angles || st.arcs) && P !== 'plain') {
      ctx.save();
      ctx.beginPath();
      ctx.rect(ext[0], ext[1], ext[2] - ext[0], ext[3] - ext[1]);
      ctx.clip();
      const L = Math.hypot(W, H) * 1.5;
      const center = st.guideOrigin === 'center';
      // each origin: point + horizontal direction sign; angles measured counter-clockwise
      const origins = center ? [{ x: gx + gw / 2, y: gy + gh / 2, sx: 1 }]
        : st.guideOrigin === 'br' ? [{ x: gx + gw, y: oy, sx: -1 }]
        : st.guideOrigin === 'both' ? [{ x: ox, y: oy, sx: 1 }, { x: gx + gw, y: oy, sx: -1 }]
        : st.guideOrigin === 'four' ? [{ x: ox, y: oy, sx: 1, sy: 1 }, { x: gx + gw, y: oy, sx: -1, sy: 1 }, { x: ox, y: gy, sx: 1, sy: -1 }, { x: gx + gw, y: gy, sx: -1, sy: -1 }]
        : [{ x: ox, y: oy, sx: 1 }];
      const span = center ? 360 : 90;
      const stepA = clamp(st.angleStep, 5, 45);
      const angles = new Set();
      if (st.angles) for (let a = stepA; a < span; a += stepA) if (center || a < 90) angles.add(a);
      if (st.diagonal) for (let a = 45; a < span; a += 90) angles.add(a);
      if (center && st.angles) angles.add(0);
      const dir = (o, a) => { const r = a * Math.PI / 180; return [o.sx * Math.cos(r), -(o.sy || 1) * Math.sin(r)]; };

      // radii (in cells): user list or automatic
      const maxR = center ? Math.min(cols, rows) / 2 : Math.min(cols, rows);
      let radii = String(st.arcRadii || '').split(/[,\s;]+/).map(Number).filter(v => v > 0);
      if (!radii.length) {
        radii = [0.3, 0.62, 0.9].map(f => Math.max(1, Math.round(maxR * f / st.major) * st.major || Math.round(maxR * f)));
        radii = [...new Set(radii)];
      }
      radii.sort((p, q) => p - q);

      for (const o of origins) {
        for (const a of angles) {
          const [dx, dy] = dir(o, a);
          const solid = a % 90 === 45 && st.diagonal;
          ctx.beginPath();
          ctx.moveTo(o.x, o.y);
          ctx.lineTo(o.x + dx * L, o.y + dy * L);
          if (solid) { ctx.setLineDash([]); ctx.lineWidth = px(1.3); ctx.strokeStyle = rgba(LC, 0.85 * op); }
          else { ctx.setLineDash([px(6), px(5)]); ctx.lineWidth = px(0.8); ctx.strokeStyle = rgba(LC, 0.45 * op); }
          ctx.stroke();
        }
        ctx.setLineDash([]);

        if (st.arcs) {
          ctx.beginPath();
          for (const rc of radii) {
            const R = rc * cell;
            ctx.moveTo(o.x + o.sx * R, o.y);
            for (let t = 0; t <= span; t += 1) { const [dx, dy] = dir(o, t); ctx.lineTo(o.x + dx * R, o.y + dy * R); }
          }
          ctx.lineWidth = px(1);
          ctx.strokeStyle = rgba(LC, 0.7 * op);
          ctx.stroke();
          if (st.arcTicks) {
            ctx.beginPath();
            for (const rc of radii) {
              const R = rc * cell;
              for (let t = 0; t < span + (center ? 0 : 1); t += 5) {
                const big = t % 15 === 0;
                const len = cell * (big ? 0.3 : 0.15);
                const [dx, dy] = dir(o, t);
                ctx.moveTo(o.x + dx * (R - len), o.y + dy * (R - len));
                ctx.lineTo(o.x + dx * R, o.y + dy * R);
              }
            }
            ctx.lineWidth = px(0.8);
            ctx.strokeStyle = rgba(LC, 0.6 * op);
            ctx.stroke();
          }
        }

        // angle labels — on the first arc when arcs are on
        if (st.angles || st.diagonal) {
          const fs = clamp(cell * 0.22, 6 * u, 11 * u);
          ctx.font = fontMono(fs);
          ctx.fillStyle = rgba(LC, 0.75 * op);
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const R = st.arcs ? radii[0] * cell + fs * 1.4 : Math.min(gw, gh) * (center ? 0.12 : 0.2);
          for (const a of angles) {
            if (center && stepA < 15 && a % 15) continue;
            const [dx, dy] = dir(o, a);
            ctx.fillText(`${a}°`, o.x + dx * R, o.y + dy * R);
          }
        }
      }
      ctx.restore();
    }

    /* --- side label --- */
    if (st.sideLabel && st.sideText.trim()) {
      const fs = clamp(cell * 0.24, 8 * u, 13 * u);
      const lines = st.sideText.toUpperCase().split('\n').slice(0, 4);
      const lh = fs * 1.25;
      ctx.save();
      ctx.font = fontSans(fs, 500);
      if ('letterSpacing' in ctx) ctx.letterSpacing = `${(fs * 0.06).toFixed(2)}px`;
      ctx.fillStyle = rgba(LC, 0.7 * op);
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.translate(gx + Math.max(cell * 0.35, fs) + lines.length * lh, gy + Math.max(cell * 0.5, fs * 1.5));
      ctx.rotate(Math.PI / 2);
      lines.forEach((l, i) => ctx.fillText(l, 0, i * lh));
      ctx.restore();
    }

    /* --- text blocks --- */
    const boxes = [], painters = [];

    if (st.quoteOn && st.quote.trim()) {
      const F = m * st.fontSize / 100;
      ctx.font = fontQuote(st, F);
      const lines = st.quote.split('\n');
      const lh = F * 1.12;
      const tw = Math.max(...lines.map(l => ctx.measureText(l).width));
      const th = lines.length * lh;
      const cx = W / 2;
      const cy = framed ? gy + gh * st.textY / 100 : H * st.textY / 100;
      boxes.push([cx - tw / 2 - F * 0.8, cy - th / 2 - F * 0.5, cx + tw / 2 + F * 0.8, cy + th / 2 + F * 0.5]);
      painters.push(() => {
        ctx.font = fontQuote(st, F);
        ctx.fillStyle = st.text;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        lines.forEach((l, i) => ctx.fillText(l, cx, cy - th / 2 + lh * (i + 0.5) + F * 0.04));
      });
    }

    if (st.bodyOn && st.body.trim()) {
      const Fb = Math.max(m * st.fontSize / 100 * 0.3, 6 * u);
      ctx.font = fontSans(Fb, st.bodyWeight);
      const maxW = Math.min(gw - cell * 1.4, Math.max(Fb * 21, gw * 0.2));
      const lines = wrapText(ctx, st.body, maxW);
      const lh = Fb * 1.32;
      const bw = Math.max(...lines.map(l => ctx.measureText(l).width));
      const th = lines.length * lh;
      const pad = Math.max(cell * 0.6, Fb * 1.4);
      let x0;
      if (st.bodyPos === 'bl') x0 = gx + pad;
      else if (st.bodyPos === 'bc') x0 = W / 2 - bw / 2;
      else x0 = gx + gw - pad - bw;
      let y0 = st.bodyPos === 'tr' ? gy + pad : gy + gh - pad - th;
      boxes.push([x0 - Fb * 0.8, y0 - Fb * 0.8, x0 + bw + Fb * 0.8, y0 + th + Fb * 0.8]);
      painters.push(() => {
        ctx.font = fontSans(Fb, st.bodyWeight);
        ctx.fillStyle = st.text;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        lines.forEach((l, i) => ctx.fillText(l, x0, y0 + i * lh + Fb * 0.1));
      });
    }

    if (st.textBox && P !== 'plain') {
      const lined = P === 'grid' || P === 'gridcross';
      for (const raw of boxes) {
        const [x0, y0, x1, y1] = raw;
        const snap = U => [
          ox + Math.floor((x0 - ox) / U) * U,
          oy - Math.ceil((oy - y0) / U) * U,
          ox + Math.ceil((x1 - ox) / U) * U,
          oy - Math.floor((oy - y1) / U) * U,
        ];
        const area = b => (b[2] - b[0]) * (b[3] - b[1]);
        let b = snap(cell), inset;
        if (lined) {
          const bm = snap(cell * st.major);
          if (area(bm) <= area(raw) * 3.2) { b = bm; inset = px(1.8) * 0.75; }
          else inset = P === 'gridcross' ? cell * 0.24 : px(0.8) * 0.75;
        } else {
          inset = cell * 0.24;
        }
        b = [Math.max(b[0], ext[0]), Math.max(b[1], ext[1]), Math.min(b[2], ext[2]), Math.min(b[3], ext[3])];
        ctx.fillStyle = st.bg;
        ctx.fillRect(b[0] + inset, b[1] + inset, b[2] - b[0] - 2 * inset, b[3] - b[1] - 2 * inset);
      }
    }
    painters.forEach(f => f());
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0px';

    /* --- atmosphere --- */
    applyLight(ctx, W, H, st);
    applyGrain(ctx, W, H, st);
    applyVignette(ctx, W, H, st);
    ctx.restore();
  }

  /* -------------------------------------------------------------- preview */

  const canvas = $('#preview');
  const frame = $('#frame');
  const stage = $('#stage');
  let rafId = 0, settleId = 0;
  const requested = new Set();

  function ensureFonts() {
    for (const spec of neededFonts(state)) {
      if (requested.has(spec)) continue;
      requested.add(spec);
      document.fonts.load(spec).then(schedule).catch(() => {});
    }
  }

  function schedule() {
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(draw);
  }

  function draw() {
    ensureFonts();
    const W = state.w, H = state.h;
    const cs = getComputedStyle(stage);
    const availW = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const availH = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - 30;
    const s = Math.max(0.01, Math.min(availW / W, availH / H));
    const cssW = Math.floor(W * s), cssH = Math.floor(H * s);
    // Cap the preview backing store (~4 MP). Huge GPU canvases (4K+ at DPR 2) can
    // drop draw calls right after a resize; the export renders at full size anyway.
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxPx = 4.2e6;
    if (cssW * cssH * dpr * dpr > maxPx) dpr = Math.sqrt(maxPx / (cssW * cssH));
    const pw = Math.max(1, Math.min(W, Math.round(cssW * dpr)));
    const ph = Math.max(1, Math.min(H, Math.round(cssH * dpr)));
    const resized = canvas.width !== pw || canvas.height !== ph;
    if (resized) { canvas.width = pw; canvas.height = ph; }
    canvas.style.width = cssW + 'px';
    canvas.style.height = cssH + 'px';
    frame.style.setProperty('--cw', cssW + 'px');
    frame.classList.toggle('portrait', H > W);
    frame.classList.toggle('show-lock', state.lockscreen);
    render(canvas.getContext('2d', { willReadFrequently: true }), pw, ph, state);
    // A freshly resized canvas sometimes presents an incomplete first frame
    // (seen in Chrome with GPU raster); paint once more on the next frame.
    if (resized) {
      cancelAnimationFrame(settleId);
      settleId = requestAnimationFrame(() => render(canvas.getContext('2d'), canvas.width, canvas.height, state));
    }
    $('#meta').textContent = `${W} × ${H} px · ${state.format.toUpperCase()}`;
    $('#meta-r').textContent = `önizleme ${Math.round(s * 100)}%`;
  }

  new ResizeObserver(schedule).observe(stage);
  canvas.addEventListener('contextrestored', schedule);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) schedule(); });

  /* --------------------------------------------------------------- export */

  async function download() {
    const btns = [$('#btn-download'), $('#btn-download-top')];
    btns.forEach(b => (b.disabled = true));
    try {
      await Promise.all(neededFonts(state).map(f => document.fonts.load(f).catch(() => {})));
      const W = state.w, H = state.h;
      const c = mk(W, H);
      // willReadFrequently forces a software (CPU) canvas. Large GPU-backed canvases
      // in Chromium/Brave were dropping the base layer, leaving only the light pass.
      render(c.getContext('2d', { willReadFrequently: true }), W, H, state);
      const jpg = state.format === 'jpg';
      const blob = await new Promise(res => c.toBlob(res, jpg ? 'image/jpeg' : 'image/png', 0.93));
      if (!blob) throw new Error('Tarayıcı bu boyutta görsel oluşturamadı.');
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `cutting-mat-${state.theme}-${state.pattern}-${W}x${H}.${jpg ? 'jpg' : 'png'}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast('İndirildi');
    } catch (e) {
      toast(e.message || 'İndirme başarısız');
    } finally {
      btns.forEach(b => (b.disabled = false));
    }
  }

  /* ------------------------------------------------------------------- UI */

  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove('show'), 1800);
  }

  function buildPresetSelect() {
    const sel = $('#preset');
    const dpr = window.devicePixelRatio || 1;
    const sw = Math.round(screen.width * dpr), sh = Math.round(screen.height * dpr);
    sel.innerHTML = '';
    const mine = new Option(`Bu ekran — ${sw}×${sh}`, 'screen');
    sel.add(mine);
    for (const g of PRESETS) {
      const og = document.createElement('optgroup');
      og.label = g.group;
      for (const [id, name, w, h] of g.items) og.appendChild(new Option(`${name}`, id));
      sel.appendChild(og);
    }
    sel.add(new Option('Özel boyut…', 'custom'));
  }

  function presetSize(id) {
    if (id === 'screen') {
      const dpr = window.devicePixelRatio || 1;
      return [Math.round(screen.width * dpr), Math.round(screen.height * dpr)];
    }
    for (const g of PRESETS) for (const [pid, , w, h] of g.items) if (pid === id) return [w, h];
    return null;
  }

  function applyOrientationDefaults() {
    // Sensible density / type size when switching between portrait & landscape.
    const portrait = state.h > state.w;
    state.density = portrait ? 9 : 24;
    state.fontSize = portrait ? 7 : 4.4;
  }

  function buildSwatches() {
    const wrap = $('#swatches');
    wrap.innerHTML = '';
    for (const [id, t] of Object.entries(THEMES)) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch';
      b.title = t.name;
      b.setAttribute('aria-label', `${t.name} tema`);
      b.dataset.theme = id;
      b.style.backgroundColor = t.bg;
      b.style.backgroundImage = `linear-gradient(${t.line}55 1px, transparent 1px), linear-gradient(90deg, ${t.line}55 1px, transparent 1px)`;
      b.addEventListener('click', () => {
        Object.assign(state, { theme: id, bg: t.bg, line: t.line, text: t.text });
        changed();
      });
      wrap.appendChild(b);
    }
  }

  function buildQuoteSelect() {
    const sel = $('#quote-preset');
    sel.innerHTML = '';
    sel.add(new Option('Özel metin', '-1'));
    QUOTES.forEach((q, i) => sel.add(new Option(q.t.replace('\n', ' '), String(i))));
    sel.addEventListener('change', () => {
      const q = QUOTES[+sel.value];
      if (!q) return;
      state.quote = q.t;
      state.body = q.b;
      state.quoteOn = true;
      changed();
    });
  }

  function buildFontSelect() {
    const sel = $('#font-select');
    for (const g of FONTS) {
      const og = document.createElement('optgroup');
      og.label = g.group;
      for (const [f, label] of g.items) og.appendChild(new Option(label, f));
      sel.appendChild(og);
    }
  }

  function syncUI() {
    for (const el of $$('[data-k]')) {
      const k = el.dataset.k, v = state[k];
      if (el.type === 'checkbox') el.checked = !!v;
      else if (el.type === 'radio') el.checked = el.value === String(v);
      else if (document.activeElement !== el) el.value = v;
    }
    for (const o of $$('[data-o]')) {
      const k = o.dataset.o, v = state[k];
      o.textContent = (k === 'lightAngle' || k === 'angleStep') ? `${v}°` : k === 'fontSize' ? Number(v).toFixed(1) : String(v);
    }
    $('#preset').value = state.preset;
    $('#custom-size').classList.toggle('show', state.preset === 'custom');
    for (const s of $$('.swatch')) s.setAttribute('aria-pressed', String(s.dataset.theme === state.theme));
    $('#light-controls').classList.toggle('off', state.light === 'none');
    $('#light-pos').classList.toggle('off', !PATCH_LIGHTS.has(state.light));
    $('#side-text-field').style.display = state.sideLabel ? '' : 'none';
    const qi = QUOTES.findIndex(q => q.t === state.quote);
    $('#quote-preset').value = String(qi);

    const area = state.w * state.h;
    $('#export-hint').textContent = area > 16.7e6
      ? 'Not: Bu boyut bazı mobil tarayıcıların (iOS Safari) canvas sınırını aşabilir.'
      : `Çıktı: ${state.w} × ${state.h} px`;
  }

  let hashTimer = 0;
  function writeHash() {
    clearTimeout(hashTimer);
    hashTimer = setTimeout(() => {
      const p = new URLSearchParams();
      for (const k of Object.keys(DEFAULT)) if (state[k] !== DEFAULT[k]) p.set(k, String(state[k]));
      const h = p.toString();
      history.replaceState(null, '', h ? '#' + h : location.pathname + location.search);
    }, 250);
  }

  function readHash() {
    if (!location.hash) return;
    const p = new URLSearchParams(location.hash.slice(1));
    for (const [k, v] of p) {
      if (!(k in DEFAULT)) continue;
      const d = DEFAULT[k];
      if (typeof d === 'number') { const n = parseFloat(v); if (Number.isFinite(n)) state[k] = n; }
      else if (typeof d === 'boolean') state[k] = v === 'true';
      else state[k] = v;
    }
    if (state.light === 'dapple') state.light = 'spot';
    if (!FONT_IDS.includes(state.font)) state.font = 'Inter Tight';
    state.w = clamp(Math.round(state.w), 200, 8192);
    state.h = clamp(Math.round(state.h), 200, 8192);
  }

  function changed() {
    syncUI();
    writeHash();
    schedule();
  }

  function bindInputs() {
    for (const el of $$('[data-k]')) {
      const evt = el.type === 'checkbox' || el.type === 'radio' || el.tagName === 'SELECT' ? 'change' : 'input';
      el.addEventListener(evt, () => {
        const k = el.dataset.k;
        let v;
        if (el.type === 'checkbox') v = el.checked;
        else if (el.type === 'radio') { if (!el.checked) return; v = el.value; }
        else if (el.type === 'range' || el.type === 'number') { v = parseFloat(el.value); if (!Number.isFinite(v)) return; }
        else v = typeof DEFAULT[k] === 'number' ? parseFloat(el.value) : el.value;
        if (k === 'w' || k === 'h') { v = clamp(Math.round(v), 200, 8192); state.preset = 'custom'; }
        if (k === 'bg' || k === 'line' || k === 'text') state.theme = 'custom';
        state[k] = v;
        changed();
      });
    }

    $('#preset').addEventListener('change', e => {
      const id = e.target.value;
      state.preset = id;
      const size = presetSize(id);
      if (size) {
        const wasPortrait = state.h > state.w;
        [state.w, state.h] = size;
        if (wasPortrait !== (state.h > state.w)) applyOrientationDefaults();
      }
      changed();
    });

    $('#btn-rotate').addEventListener('click', () => {
      [state.w, state.h] = [state.h, state.w];
      state.preset = 'custom';
      applyOrientationDefaults();
      changed();
    });

    $('#btn-seed').addEventListener('click', () => {
      state.seed = (state.seed % 9999) + 1 + Math.floor(Math.random() * 50);
      changed();
    });

    $('#btn-download').addEventListener('click', download);
    $('#btn-download-top').addEventListener('click', download);

    $('#btn-share').addEventListener('click', async () => {
      clearTimeout(hashTimer);
      const p = new URLSearchParams();
      for (const k of Object.keys(DEFAULT)) if (state[k] !== DEFAULT[k]) p.set(k, String(state[k]));
      const url = location.origin + location.pathname + (p.toString() ? '#' + p : '');
      try { await navigator.clipboard.writeText(url); toast('Link kopyalandı'); }
      catch { prompt('Linki kopyala:', url); }
    });

    $('#btn-reset').addEventListener('click', () => {
      const { preset, w, h } = state;
      state = { ...DEFAULT, preset, w, h };
      if (h > w) applyOrientationDefaults();
      changed();
    });

    $('#btn-random').addEventListener('click', () => {
      const pick = a => a[Math.floor(Math.random() * a.length)];
      const themeId = pick(Object.keys(THEMES));
      const t = THEMES[themeId];
      const q = pick(QUOTES);
      Object.assign(state, {
        theme: themeId, bg: t.bg, line: t.line, text: t.text,
        pattern: pick(['grid', 'grid', 'cross', 'gridcross', 'dots']),
        light: pick(['none', 'spot', 'window', 'blinds', 'leaves', 'mixed']),
        lightX: Math.round(15 + Math.random() * 70), lightY: Math.round(15 + Math.random() * 70),
        guideOrigin: pick(['bl', 'bl', 'both', 'center', 'four']), arcs: Math.random() < 0.5,
        lightAngle: Math.round(-60 + Math.random() * 50),
        seed: 1 + Math.floor(Math.random() * 9999),
        quote: q.t, body: q.b, quoteOn: true,
        font: pick(['Newsreader', 'Newsreader', 'Instrument Serif', 'Fraunces', 'EB Garamond', 'Inter Tight', 'Geist', 'Instrument Sans', 'Space Grotesk']),
      });
      changed();
    });

    $('#btn-theme').addEventListener('click', () => {
      const root = document.documentElement;
      const cur = root.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      const next = cur === 'dark' ? 'light' : 'dark';
      root.dataset.theme = next;
      try { localStorage.setItem('theme', next); } catch {}
    });

    window.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') { e.preventDefault(); download(); }
    });
  }

  function setLockDate() {
    const d = new Date();
    $('#lock-date').textContent = d.toLocaleDateString('tr-TR', { weekday: 'short', day: 'numeric', month: 'long' });
  }

  /* ----------------------------------------------------------------- boot */

  buildPresetSelect();
  buildSwatches();
  buildQuoteSelect();
  buildFontSelect();
  readHash();
  if (!location.hash) {
    // First visit: start in the orientation of the visitor's device.
    const portraitDevice = window.matchMedia('(max-width: 700px) and (orientation: portrait)').matches;
    if (portraitDevice) {
      state.preset = 'screen';
      [state.w, state.h] = presetSize('screen');
      applyOrientationDefaults();
    }
  }
  bindInputs();
  setLockDate();
  syncUI();
  schedule();
  document.fonts.ready.then(schedule);
})();
