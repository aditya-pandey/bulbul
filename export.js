import { RATIOS, RHYTHMS, computeTypeScale, paginatePoem, resolveStyle } from './data.js';

function loadImg(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function stripEmphasis(s) {
  return String(s || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');
}

function parseLineStyle(line) {
  const raw = String(line || '');
  const isBold = /^\s*\*\*.+\*\*\s*$/.test(raw) || /\*\*[^*]+\*\*/.test(raw);
  const isUnder = /__[^_]+__/.test(raw);
  const isItal = !isBold && /\*[^*]+\*/.test(raw);
  return { text: stripEmphasis(raw), isBold, isUnder, isItal };
}

function wrapLines(ctx, text, maxW) {
  const out = [];
  const raw = String(text || '').replace(/\r/g, '').split('\n');
  for (const para of raw) {
    if (!para.trim()) {
      out.push({ text: '', isBold: false, isUnder: false, isItal: false });
      continue;
    }
    const meta = parseLineStyle(para);
    const words = meta.text.split(/\s+/);
    let cur = '';
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(test).width > maxW && cur) {
        out.push({ ...meta, text: cur });
        cur = w;
      } else {
        cur = test;
      }
    }
    if (cur) out.push({ ...meta, text: cur });
  }
  return out;
}

function drawPaperTexture(ctx, cx, cy, cw, ch, texture, dark) {
  if (texture === 'none') return;
  ctx.save();
  if (texture === 'kraft') {
    const n = Math.min(18000, Math.round((cw * ch) / 90));
    for (let k = 0; k < n; k++) {
      ctx.fillStyle = k % 3 === 0 ? 'rgba(255,244,226,0.16)' : 'rgba(58,38,18,0.14)';
      ctx.fillRect(cx + Math.random() * cw, cy + Math.random() * ch, k % 5 === 0 ? 3 : 2, 2);
    }
    // Subtle fiber streaks
    ctx.strokeStyle = 'rgba(66,44,22,0.06)';
    ctx.lineWidth = 1;
    for (let f = 0; f < 140; f++) {
      const fx = cx + Math.random() * cw;
      const fy = cy + Math.random() * ch;
      ctx.beginPath();
      ctx.moveTo(fx, fy);
      ctx.lineTo(fx + 10 + Math.random() * 18, fy + (Math.random() - 0.5) * 6);
      ctx.stroke();
    }
  } else if (texture === 'cotton') {
    ctx.strokeStyle = dark ? 'rgba(255,255,255,0.03)' : 'rgba(40,34,28,0.035)';
    ctx.lineWidth = 1;
    for (let y = cy; y < cy + ch; y += 7) {
      ctx.beginPath(); ctx.moveTo(cx, y); ctx.lineTo(cx + cw, y); ctx.stroke();
    }
    for (let x = cx; x < cx + cw; x += 9) {
      ctx.beginPath(); ctx.moveTo(x, cy); ctx.lineTo(x, cy + ch); ctx.stroke();
    }
  } else {
    ctx.globalAlpha = dark ? 0.036 : 0.025;
    const grainCount = Math.min(8000, Math.round((cw * ch) / 360));
    for (let k = 0; k < grainCount; k++) {
      ctx.fillStyle = k % 2 ? '#ffffff' : '#000000';
      ctx.fillRect(cx + Math.random() * cw, cy + Math.random() * ch, 2, 2);
    }
  }
  ctx.restore();
}

function drawArtwork(ctx, img, painting, bgMode, { cx, cy, cw, ch, isSide, isBelow, isCorner, wash, pal }) {
  ctx.save();
  const isArt = bgMode === 'art';
  const useMultiply = isArt && painting.blend === 'multiply';
  const useContain = useMultiply || (isArt && Boolean(painting.contain));
  const useVignette = isArt && Boolean(painting.vignette);
  const filterStr = isArt && painting.filter ? painting.filter : 'none';

  let source = img;
  if (useVignette) {
    const off = document.createElement('canvas');
    off.width = img.naturalWidth || img.width || 800;
    off.height = img.naturalHeight || img.height || 1000;
    const octx = off.getContext('2d');
    if (filterStr !== 'none') octx.filter = filterStr;
    octx.drawImage(img, 0, 0, off.width, off.height);
    octx.filter = 'none';
    octx.globalCompositeOperation = 'destination-in';
    const rg = octx.createRadialGradient(
      off.width * 0.5, off.height * 0.48, Math.min(off.width, off.height) * 0.24,
      off.width * 0.5, off.height * 0.5, Math.max(off.width, off.height) * 0.50
    );
    rg.addColorStop(0, 'rgba(0,0,0,1)');
    rg.addColorStop(0.68, 'rgba(0,0,0,0.95)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    octx.fillStyle = rg;
    octx.fillRect(0, 0, off.width, off.height);
    source = off;
  } else if (filterStr !== 'none') {
    ctx.filter = filterStr;
  }

  if (useMultiply) ctx.globalCompositeOperation = 'multiply';

  const iw = source.naturalWidth || source.width || 800;
  const ih = source.naturalHeight || source.height || 1000;

  if (isSide) {
    const ax = cx + Math.round(cw * 0.53);
    const aw = Math.round(cw * 0.42);
    const ay = cy + Math.round(ch * 0.08);
    const ah = Math.min(Math.round(ch * 0.84), Math.round(cw * 1.15));
    const sc = useContain ? Math.min(aw / iw, ah / ih) : Math.max(aw / iw, ah / ih);
    const dw = iw * sc;
    const dh = ih * sc;
    ctx.beginPath();
    if (!useContain) ctx.roundRect(ax, ay, aw, ah, 14);
    else ctx.rect(ax, ay, aw, ah);
    ctx.clip();
    ctx.drawImage(source, ax + (aw - dw) / 2, ay + (ah - dh) / 2, dw, dh);
  } else if (isBelow) {
    const aw = Math.round(cw * 0.66);
    const ah = Math.min(Math.round(ch * 0.30), 420);
    const ax = cx + Math.round((cw - aw) / 2);
    const ay = cy + ch - ah - Math.round(cw * 0.07);
    const sc = useContain ? Math.min(aw / iw, ah / ih) : Math.max(aw / iw, ah / ih);
    const dw = iw * sc;
    const dh = ih * sc;
    ctx.beginPath();
    if (!useContain) ctx.roundRect(ax, ay, aw, ah, 14);
    else ctx.rect(ax, ay, aw, ah);
    ctx.clip();
    ctx.drawImage(source, ax + (aw - dw) / 2, ay + (ah - dh) / 2, dw, dh);
  } else if (isCorner) {
    const aw = Math.round(cw * 0.50);
    const ah = Math.min(Math.round(ch * 0.48), 540);
    const ax = cx + cw - aw - 26;
    const ay = cy + ch - ah - 26;
    const sc = Math.min(aw / iw, ah / ih);
    const dw = iw * sc;
    const dh = ih * sc;
    ctx.drawImage(source, ax + (aw - dw), ay + (ah - dh), dw, dh);
  } else {
    const sc = Math.max(cw / iw, ch / ih);
    const dw = iw * sc;
    const dh = ih * sc;
    ctx.drawImage(source, cx + (cw - dw) / 2, cy + (ch - dh) / 2, dw, dh);
  }
  ctx.restore();

  if (!isSide && !isBelow && !isCorner) {
    const baseOp = bgMode === 'photo' ? Math.max(0.28, wash / 100) : wash / 100;
    if (baseOp > 0.005) {
      ctx.save();
      ctx.fillStyle = pal.dark ? `rgba(12,14,20,${baseOp})` : `rgba(250,247,240,${baseOp})`;
      ctx.fillRect(cx, cy, cw, ch);
      ctx.restore();
    }
  }
}

function drawTornScrap(ctx, x, y, w, h) {
  const pts = [
    [0.02, 0.01], [0.14, 0.00], [0.28, 0.014], [0.44, 0.003], [0.62, 0.016], [0.78, 0.004], [0.93, 0.018], [0.99, 0.03],
    [0.975, 0.11], [0.996, 0.21], [0.972, 0.31], [0.995, 0.43], [0.97, 0.54], [0.992, 0.65], [0.968, 0.76], [0.99, 0.87], [0.965, 0.97],
    [0.84, 0.995], [0.68, 0.982], [0.52, 0.998], [0.35, 0.985], [0.18, 0.996], [0.05, 0.984], [0.01, 0.95],
    [0.024, 0.85], [0.004, 0.73], [0.022, 0.61], [0.006, 0.49], [0.025, 0.36], [0.005, 0.24], [0.022, 0.12]
  ];
  ctx.save();
  ctx.shadowColor = 'rgba(18, 15, 12, 0.28)';
  ctx.shadowBlur = 28;
  ctx.shadowOffsetX = 4;
  ctx.shadowOffsetY = 12;
  ctx.beginPath();
  pts.forEach(([px, py], i) => {
    const vx = x + px * w;
    const vy = y + py * h;
    if (i === 0) ctx.moveTo(vx, vy);
    else ctx.lineTo(vx, vy);
  });
  ctx.closePath();
  const grd = ctx.createLinearGradient(x, y, x + w, y + h);
  grd.addColorStop(0, '#ECE8E1');
  grd.addColorStop(1, '#DFDAD1');
  ctx.fillStyle = grd;
  ctx.fill();
  ctx.restore();
}

function drawCutoutStrip(ctx, text, tx, y, lh, align, idx) {
  const tw = ctx.measureText(text).width;
  const px = 14;
  const py = 5;
  const rw = tw + px * 2;
  const rh = Math.round(lh * 0.94);
  const rx = align === 'center' ? tx - rw / 2 : align === 'right' ? tx - rw + px : tx - px;
  const ry = y - py;
  const angle = idx % 3 === 0 ? 0.005 : idx % 2 === 0 ? -0.006 : 0;

  ctx.save();
  ctx.translate(rx + rw / 2, ry + rh / 2);
  ctx.rotate(angle);
  ctx.shadowColor = 'rgba(24, 20, 14, 0.16)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = '#F4EFE2';
  ctx.fillRect(-rw / 2, -rh / 2, rw, rh);
  ctx.restore();
}

function drawCutoutWords(ctx, text, tx, y, lh, align, inkCol, seedIdx) {
  const words = text.split(/\s+/).filter(Boolean);
  if (!words.length) return;
  const padX = 11;
  const gap = 10;
  const widths = words.map(w => ctx.measureText(w).width + padX * 2);
  const totalW = widths.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
  let curX = align === 'center' ? tx - totalW / 2 : align === 'right' ? tx - totalW : tx;
  const rh = Math.round(lh * 0.92);

  ctx.save();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  words.forEach((w, wi) => {
    const rw = widths[wi];
    const angle = ((seedIdx + wi) % 3 === 0 ? -0.011 : (seedIdx + wi) % 2 === 0 ? 0.009 : -0.003);
    ctx.save();
    ctx.translate(curX + rw / 2, y - 4 + rh / 2);
    ctx.rotate(angle);
    ctx.shadowColor = 'rgba(24, 20, 14, 0.16)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;
    ctx.fillStyle = '#F4EFE2';
    ctx.fillRect(-rw / 2, -rh / 2, rw, rh);
    ctx.shadowColor = 'transparent';
    ctx.fillStyle = inkCol;
    ctx.fillText(w, -rw / 2 + padX, -rh / 2 + 4);
    ctx.restore();
    curX += rw + gap;
  });
  ctx.restore();
}

export async function renderPoemSlideCanvas(poem, slideMeta = null) {
  try { await document.fonts?.ready; } catch {}

  const style = resolveStyle(poem);
  const pal = style.pal;
  const fn = style.font;
  const isTorn = style.textStyle === 'torn';
  const isLineCut = style.textStyle === 'cutout-line';
  const isWordCut = style.textStyle === 'cutout-word';
  const isAnyCut = isLineCut || isWordCut;
  const tStyle = style.titleStyle || 'classic';
  const rhythmMult = (RHYTHMS.find(r => r.id === style.rhythm) || RHYTHMS[1]).mult;

  const isCarousel = Boolean(slideMeta && slideMeta.total > 1);
  const ratioId = isCarousel && style.ratio === 'auto' ? '4:5' : style.ratio;
  const rat = RATIOS.find(r => r.id === ratioId) || RATIOS[1];

  const isLongPage = rat.id === 'auto' && !isCarousel;
  const bodyText = slideMeta ? slideMeta.text : String(poem.body || '').replace(/^\s*[-—]{3,}\s*$/gm, '').trim();
  const showTitle = (!slideMeta || slideMeta.isFirst) && tStyle !== 'none' && tStyle !== 'dropcap';
  const showSign = !slideMeta || slideMeta.isLast;
  const titleText = showTitle ? String(poem.title || '').trim() : '';
  const signText = showSign ? String(style.sign || '').trim() : '';

  const imgSrc = style.bgMode === 'art' ? style.painting.src : (style.bgMode === 'photo' && style.photo ? style.photo : '');
  const isSide = Boolean(imgSrc && style.layout === 'side');
  const isBelow = Boolean(imgSrc && style.layout === 'below');
  const isCorner = Boolean(imgSrc && style.layout === 'corner');
  const isMat = style.frame === 'polaroid';

  const W = rat.w;
  const padOuter = isMat ? Math.round(W * 0.068) : 0;
  const padBottom = isMat ? Math.round(W * 0.13) : 0;
  const cw = W - padOuter * 2;

  const boost = fn.scaleBoost || 1;
  const ts = computeTypeScale(bodyText, {
    ratio: rat.id,
    layout: style.layout,
    textSize: style.textSize,
    isCarousel
  });

  const measCv = document.createElement('canvas');
  const mctx = measCv.getContext('2d');

  const padX = Math.round(cw * (isSide ? 0.085 : isTorn ? 0.105 : 0.125) * ts.padMult);
  const textMaxW = isSide
    ? Math.round(cw * 0.43)
    : isTorn
      ? Math.round(cw * 0.54)
      : (cw - padX * 2);

  const measureWithScale = sc => {
    const titleMult = tStyle === 'smallcaps' ? 0.56 : tStyle === 'italic' ? 1.24 : 1.0;
    const titlePx = Math.round(52 * sc * Math.min(1.12, boost) * titleMult);
    const bodyPx = Math.round(31 * sc * boost);
    const lh = Math.round(bodyPx * fn.lh * ts.lhMult * rhythmMult * (isAnyCut ? 1.08 : 1));
    const titleLh = Math.round(titlePx * 1.2);

    const effTitleStr = tStyle === 'smallcaps' ? titleText.toUpperCase() : titleText;
    const titleItal = tStyle === 'italic' || fn.italicTitle;
    mctx.font = `${titleItal ? 'italic ' : ''}${fn.titleW} ${titlePx}px ${fn.fam}`;
    const tLines = (effTitleStr && tStyle !== 'vertical') ? wrapLines(mctx, effTitleStr, textMaxW).map(x => x.text) : [];

    mctx.font = `${fn.bodyW} ${bodyPx}px ${fn.fam}`;
    const bLines = wrapLines(mctx, bodyText, textMaxW);

    let totalH = 0;
    if (tLines.length) totalH += tLines.length * titleLh + Math.round(28 * sc) + Math.round(26 * sc);
    for (const bl of bLines) totalH += bl.text === '' ? Math.round(lh * 0.62) : lh;
    if (signText) totalH += Math.round(44 * sc) + Math.round(bodyPx * 0.9);
    return { titlePx, bodyPx, lh, titleLh, tLines, bLines, totalH, titleItal };
  };

  let effScale = ts.scale;
  let metrics = measureWithScale(effScale);
  let H = rat.h;

  if (isLongPage) {
    const padY = Math.round(W * 0.13);
    const belowExtra = isBelow ? 440 : 0;
    const bookExtra = style.frame === 'bookpage' ? 110 : 0;
    H = Math.min(5400, Math.max(1350, Math.round(metrics.totalH + padY * 2 + belowExtra + bookExtra + padOuter + padBottom)));
  } else {
    const chFixed = H - padOuter - padBottom;
    const availH = chFixed * (isBelow ? 0.52 : 0.76) - (style.frame === 'bookpage' ? 74 : 0);
    if (style.textSize === 'auto' && metrics.totalH > availH) {
      let tries = 0;
      while (metrics.totalH > availH && effScale > 0.54 && tries < 10) {
        effScale = Number((effScale * 0.92).toFixed(3));
        metrics = measureWithScale(effScale);
        tries++;
      }
    }
  }

  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d');

  if (isMat) {
    ctx.fillStyle = pal.mat || '#FAF8F3';
    ctx.fillRect(0, 0, W, H);
  }

  const cx = padOuter;
  const cy = padOuter;
  const ch = H - padOuter - padBottom;

  ctx.save();
  ctx.beginPath();
  ctx.rect(cx, cy, cw, ch);
  ctx.clip();

  const grd = ctx.createLinearGradient(cx, cy, cx + cw, cy + ch);
  grd.addColorStop(0, pal.bg || '#F7F3EA');
  grd.addColorStop(1, pal.bg2 || pal.bg || '#EFE8DA');
  ctx.fillStyle = grd;
  ctx.fillRect(cx, cy, cw, ch);

  drawPaperTexture(ctx, cx, cy, cw, ch, style.texture, pal.dark);

  if (imgSrc) {
    const img = await loadImg(imgSrc);
    if (img) {
      drawArtwork(ctx, img, style.painting, style.bgMode, {
        cx, cy, cw, ch, isSide, isBelow, isCorner, wash: style.wash, pal
      });
    }
  }

  // Frames
  ctx.save();
  ctx.strokeStyle = pal.acc || pal.ink;
  if (style.frame === 'hairline') {
    ctx.globalAlpha = pal.dark ? 0.36 : 0.30;
    ctx.lineWidth = 2;
    ctx.strokeRect(cx + 36, cy + 36, cw - 72, ch - 72);
    ctx.globalAlpha = pal.dark ? 0.16 : 0.14;
    ctx.lineWidth = 1;
    ctx.strokeRect(cx + 46, cy + 46, cw - 92, ch - 92);
  } else if (style.frame === 'bookpage') {
    ctx.globalAlpha = pal.dark ? 0.28 : 0.24;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + 68, cy + 56);
    ctx.lineTo(cx + cw - 68, cy + 56);
    ctx.moveTo(cx + 68, cy + ch - 82);
    ctx.lineTo(cx + cw - 68, cy + ch - 82);
    ctx.stroke();
    ctx.globalAlpha = pal.dark ? 0.68 : 0.62;
    ctx.fillStyle = pal.sub || pal.ink;
    ctx.font = `400 22px ${fn.fam}`;
    ctx.textAlign = 'center';
    const pgLabel = slideMeta && slideMeta.total > 1
      ? `— ${slideMeta.index + 1} / ${slideMeta.total} —`
      : (style.pageNo.trim() ? `— ${style.pageNo.trim()} —` : '✦');
    ctx.fillText(pgLabel, cx + cw / 2, cy + ch - 42);
  } else if (style.frame === 'arch') {
    ctx.globalAlpha = pal.dark ? 0.34 : 0.28;
    ctx.lineWidth = 2;
    const rx = cx + 44, ry = cy + 44, rw = cw - 88, rh = ch - 88, ar = rw / 2;
    ctx.beginPath();
    ctx.moveTo(rx, ry + rh);
    ctx.lineTo(rx, ry + ar);
    ctx.arc(rx + ar, ry + ar, ar, Math.PI, 0, false);
    ctx.lineTo(rx + rw, ry + rh);
    ctx.closePath();
    ctx.stroke();
  }
  ctx.restore();

  // Vertical side-margin title
  if (tStyle === 'vertical' && titleText) {
    ctx.save();
    ctx.translate(cx + 38, cy + ch / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillStyle = pal.sub || pal.ink;
    ctx.globalAlpha = 0.68;
    ctx.font = `500 22px ${fn.fam}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(titleText.toUpperCase().split('').join(' '), 0, 0);
    ctx.restore();
  }

  const align = isSide || isTorn ? 'left' : style.align;
  const offX = Math.round((style.textX / 100) * cw * 0.65);
  const offY = Math.round((style.textY / 100) * ch * 0.65);

  const tx = (isSide
    ? cx + padX
    : isTorn
      ? cx + Math.round(cw * 0.115)
      : align === 'center'
        ? cx + cw / 2
        : align === 'right'
          ? cx + cw - padX
          : cx + padX) + offX;

  const usableTop = cy + (style.frame === 'bookpage' ? 92 : 76);
  const usableBot = cy + ch - (isBelow ? 460 : isCorner ? 320 : (style.frame === 'bookpage' ? 112 : 76));
  const usableH = Math.max(200, usableBot - usableTop);

  let y = (isLongPage || isCorner
    ? usableTop + 36
    : usableTop + Math.max(0, Math.round((usableH - metrics.totalH) / 2))) + offY;

  if (isTorn) {
    const scrapPadX = 56;
    const scrapPadY = 64;
    const scrapX = Math.max(cx + 24, tx - scrapPadX);
    const scrapY = Math.max(cy + 28, y - scrapPadY);
    const scrapW = Math.min(cw - 48, textMaxW + scrapPadX * 2);
    const scrapH = Math.min(ch - 56, metrics.totalH + scrapPadY * 2.15);
    drawTornScrap(ctx, scrapX, scrapY, scrapW, scrapH);
  }

  const inkCol = (isTorn || isAnyCut) ? '#191715' : pal.ink;
  const subCol = (isTorn || isAnyCut) ? '#4A453F' : (pal.sub || pal.ink);
  const accCol = (isTorn || isAnyCut) ? '#4A453F' : (pal.acc || pal.ink);

  ctx.textBaseline = 'top';
  ctx.textAlign = align;

  let stripIdx = 0;

  if (metrics.tLines.length) {
    ctx.font = `${metrics.titleItal ? 'italic ' : ''}${fn.titleW} ${metrics.titlePx}px ${fn.fam}`;
    for (const tl of metrics.tLines) {
      if (isWordCut) {
        drawCutoutWords(ctx, tl, tx, y, metrics.titleLh, align, inkCol, stripIdx++);
      } else if (isLineCut) {
        drawCutoutStrip(ctx, tl, tx, y, metrics.titleLh, align, stripIdx++);
        ctx.fillStyle = inkCol;
        ctx.fillText(tl, tx, y);
      } else {
        if (tStyle === 'highlight') {
          const tw = ctx.measureText(tl).width;
          const hx = align === 'center' ? tx - tw / 2 - 16 : align === 'right' ? tx - tw - 16 : tx - 16;
          ctx.save();
          ctx.fillStyle = pal.acc || '#C48B3B';
          ctx.globalAlpha = 0.24;
          ctx.beginPath();
          ctx.roundRect(hx, y - 4, tw + 32, metrics.titleLh + 4, 8);
          ctx.fill();
          ctx.restore();
        }
        ctx.fillStyle = inkCol;
        ctx.fillText(tl, tx, y);
      }
      y += metrics.titleLh;
    }
    if (!isAnyCut && tStyle !== 'highlight') {
      y += Math.round(14 * effScale);
      ctx.save();
      ctx.fillStyle = accCol;
      ctx.globalAlpha = 0.55;
      const ruleW = Math.round(58 * effScale);
      const rx = align === 'center' ? tx - ruleW / 2 : align === 'right' ? tx - ruleW : tx;
      ctx.fillRect(rx, y, ruleW, 2);
      ctx.restore();
      y += Math.round(30 * effScale);
    } else {
      y += Math.round(24 * effScale);
    }
  }

  let didDropCap = false;
  for (const bl of metrics.bLines) {
    if (bl.text === '') {
      y += Math.round(metrics.lh * 0.62);
      continue;
    }
    const wgt = bl.isBold ? 700 : fn.bodyW;
    ctx.font = `${bl.isItal ? 'italic ' : ''}${wgt} ${metrics.bodyPx}px ${fn.fam}`;

    if (isWordCut) {
      drawCutoutWords(ctx, bl.text, tx, y, metrics.lh, align, inkCol, stripIdx++);
    } else if (isLineCut) {
      drawCutoutStrip(ctx, bl.text, tx, y, metrics.lh, align, stripIdx++);
      ctx.fillStyle = inkCol;
      ctx.fillText(bl.text, tx, y);
    } else if (tStyle === 'dropcap' && !didDropCap && align === 'left') {
      didDropCap = true;
      const first = bl.text[0];
      const rest = bl.text.slice(1);
      ctx.save();
      ctx.fillStyle = accCol;
      ctx.font = `600 ${Math.round(metrics.bodyPx * 2.1)}px ${fn.fam}`;
      const fw = ctx.measureText(first).width;
      ctx.fillText(first, tx, y - Math.round(metrics.bodyPx * 0.35));
      ctx.restore();
      ctx.fillStyle = inkCol;
      ctx.fillText(rest, tx + fw + 8, y);
    } else {
      ctx.fillStyle = inkCol;
      ctx.fillText(bl.text, tx, y);
      if (bl.isUnder) {
        const tw = ctx.measureText(bl.text).width;
        const ux = align === 'center' ? tx - tw / 2 : align === 'right' ? tx - tw : tx;
        ctx.save();
        ctx.fillStyle = inkCol;
        ctx.globalAlpha = 0.82;
        ctx.fillRect(ux, y + metrics.bodyPx + 5, tw, 2.5);
        ctx.restore();
      }
    }
    y += metrics.lh;
  }

  if (signText) {
    y += Math.round(30 * effScale);
    ctx.font = `italic 400 ${Math.round(metrics.bodyPx * 0.82)}px ${fn.fam}`;
    if (isWordCut) {
      drawCutoutWords(ctx, signText, tx, y, Math.round(metrics.lh * 0.9), align, subCol, stripIdx++);
    } else if (isLineCut) {
      drawCutoutStrip(ctx, signText, tx, y, Math.round(metrics.lh * 0.9), align, stripIdx++);
      ctx.fillStyle = subCol;
      ctx.fillText(signText, tx, y);
    } else {
      ctx.fillStyle = subCol;
      ctx.fillText(signText, tx, y);
    }
  }

  if (slideMeta && slideMeta.total > 1 && style.frame !== 'bookpage') {
    ctx.save();
    ctx.fillStyle = pal.sub || pal.ink;
    ctx.globalAlpha = 0.62;
    ctx.font = `400 22px ${fn.fam}`;
    ctx.textAlign = 'center';
    ctx.fillText(`${slideMeta.index + 1} / ${slideMeta.total}`, cx + cw / 2, cy + ch - 46);
    ctx.restore();
  }

  ctx.restore();
  return cv;
}

function downloadCanvas(cv, filename) {
  return new Promise(resolve => {
    const a = document.createElement('a');
    a.download = filename;
    a.href = cv.toDataURL('image/png');
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(resolve, 140);
  });
}

function slug(s) {
  return String(s || 'poem').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'poem';
}

export async function exportPoemPNG(poem) {
  const cv = await renderPoemSlideCanvas(poem, null);
  await downloadCanvas(cv, `${slug(poem.title)}.png`);
}

export async function exportCarouselPNGs(poem) {
  const style = resolveStyle(poem);
  const effRatio = style.ratio === 'auto' ? '4:5' : style.ratio;
  const slides = paginatePoem(poem.body, { ratio: effRatio, layout: style.layout });
  const base = slug(poem.title);
  for (const sl of slides) {
    const cv = await renderPoemSlideCanvas(poem, sl);
    await downloadCanvas(cv, `${base}-slide-${sl.index + 1}.png`);
  }
  return slides.length;
}
