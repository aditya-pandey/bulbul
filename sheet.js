import { CHARMS, RHYTHMS, computeTypeScale, finishSrc, resolveStyle } from './data.js';

export const SHEET_W = { 'rat-4-5': 458, 'rat-1-1': 458, 'rat-9-16': 350, 'rat-2-3': 408, 'rat-auto': 520 };
export const SHEET_RATIO = { 'rat-4-5': 4 / 5, 'rat-1-1': 1, 'rat-9-16': 9 / 16, 'rat-2-3': 2 / 3 };

export function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Render inline poetic emphasis (**bold**, __underline__, *italic*) safely from escaped text
export function formatInlineHTML(text) {
  let out = esc(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="poem-em-b">$1</strong>');
  out = out.replace(/__([^_]+)__/g, '<span class="poem-em-u">$1</span>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return out;
}

export function stripEmphasis(s) {
  return String(s || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');
}


// Text styles that work line by line: underline, highlighter and blackout
function linedHTML(body, style) {
  return body.split('\n').map(line => {
    if (!line.trim()) return '';
    if (style !== 'blackout') return `<span class="ln">${formatInlineHTML(line)}</span>`;
    // Blackout: words marked with emphasis stay readable; a line with none keeps its last word.
    const marked = /\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*/;
    const parts = marked.test(line)
      ? line.split(/(\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*)/)
      : (m => [line.slice(0, m.index), `*${m[0].trim()}*`])(line.match(/\S*[\p{L}\p{N}]\S*[^\p{L}\p{N}]*$/u) || { index: line.length, 0: '' });
    return parts.filter(p => p.trim()).map(p => marked.test(p)
      ? `<span class="kept">${esc(stripEmphasis(p))}</span>`
      : p.trim().split(/\s+/).map(w => `<span class="bar">${esc(w)}</span>`).join(' ')).join(' ');
  }).join('\n');
}

/* ---------- Arrangement: one column, two columns, or stanzas stepping left and right ---------- */

const stanzasOf = body => String(body || '').split(/\n\s*\n+/).map(s => s.replace(/^\n+|\s+$/g, '')).filter(s => s.trim());
const linesIn = s => s.split('\n').filter(l => l.trim()).length;

// Two columns of about equal height. Breaks between stanzas, or between lines when there is only one.
export function columnsOf(body) {
  let blocks = stanzasOf(body);
  if (blocks.length < 2) {
    const ls = String(body || '').split('\n').filter(l => l.trim());
    const half = Math.ceil(ls.length / 2);
    return [[ls.slice(0, half).join('\n')], [ls.slice(half).join('\n')]];
  }
  const weight = b => b.split('\n').reduce((n, l) => n + (l.trim() ? Math.max(1, Math.ceil(l.trim().length / 27)) : 0), 0.9); // long lines turn over
  const total = blocks.reduce((n, b) => n + weight(b), 0);
  let at = 1;
  let best = Infinity;
  for (let i = 1, sum = 0; i < blocks.length; i++) {
    sum += weight(blocks[i - 1]);
    const gap = Math.abs(total - 2 * sum) + (2 * sum < total ? 0.2 : 0); // the first column may be the longer
    if (gap < best) { best = gap; at = i; }
  }
  return [blocks.slice(0, at), blocks.slice(at)];
}

/* ---------- Fitting: shrink auto-sized text until it clears the art and the edges ---------- */

const fitCache = new Map();
export const clearFits = () => fitCache.clear();

function fitKeyFor(poem, st, body, ratio, slide) {
  const parts = [poem.title, body, st.sign, st.painting.id, st.bgMode, st.layout, st.font.id, st.frame, st.align,
    st.textStyle, st.titleStyle, st.rhythm, st.textSize, st.flow, ratio, slide ? slide.index : ''].join('|');
  let h = 5381;
  for (let i = 0; i < parts.length; i++) h = ((h << 5) + h + parts.charCodeAt(i)) | 0;
  return 'k' + (h >>> 0).toString(36);
}

function overflows(sheet, growing = false) {
  const inner = sheet.querySelector('.poem-sheet-inner');
  const col = sheet.querySelector('.poem-text-col');
  const box = col?.parentElement;
  if (!inner || !col) return false;
  const ics = getComputedStyle(inner);
  const innerH = inner.clientHeight - parseFloat(ics.paddingTop) - parseFloat(ics.paddingBottom);
  if (box === inner) return col.offsetHeight > innerH + 1;
  const cs = getComputedStyle(box);
  const room = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
  const corner = box.querySelector(':scope > .poem-corner-art');
  if (corner) return col.offsetTop + col.offsetHeight > corner.offsetTop + corner.offsetHeight * (growing ? 0.12 : 0.34);
  if (box.matches('.poem-split')) return col.offsetHeight > room + 1 || box.offsetHeight > innerH + 1;
  return box.scrollHeight > innerH + 1 || box.offsetHeight > innerH + 1;
}

function bodyLines(sheet) {
  const el = sheet.querySelector('.poem-body-ro, .poem-body-in');
  if (!el) return 0;
  const lh = parseFloat(getComputedStyle(el).lineHeight) || 20;
  const blocks = el.querySelectorAll('.st');
  if (blocks.length) return [...blocks].reduce((n, b) => n + Math.round(b.scrollHeight / lh), 0);
  return Math.round(el.scrollHeight / lh);
}

// A long page has all the height it wants, so its words are as large as its longest line allows.
function fitLong(copy, base) {
  const el = copy.querySelector('.poem-body-ro');
  const want = el ? Number(el.dataset.lines) : 0;
  let scale = base;
  if (!want) return scale;
  const at = n => { scale = Number((base * n).toFixed(3)); copy.style.setProperty('--ps-scale', scale); return bodyLines(copy); };
  if (at(1) > want) {
    for (let n = 0.97; n >= 0.84; n -= 0.03) if (at(n) <= want) return scale;
    return base;
  }
  let best = base;
  for (let n = 1.05; n <= 1.46; n += 0.05) {
    if (at(n) > want) break;
    best = scale;
  }
  return best;
}

// Short poems may grow into empty paper, as long as no line has to wrap.
const ROOMY = '.ly-corner, .ly-scene, .ly-overlay.bg-solid';

// Measured on a copy at 1:1, because browsers disagree about sizes inside zoomed elements.
let bench = null;
export function fitSheet(sheet, { cache = true } = {}) {
  const key = sheet.dataset.fit;
  if (!key || (cache && fitCache.has(key))) return;
  if (!bench) {
    bench = document.createElement('div');
    bench.className = 'snapshot-host';
    bench.setAttribute('aria-hidden', 'true');
    bench.inert = true;
    document.body.appendChild(bench);
  }
  const copy = sheet.cloneNode(true);
  copy.removeAttribute('id');
  copy.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
  copy.querySelectorAll('img').forEach(n => n.removeAttribute('src'));
  const live = sheet.querySelector('.poem-body-in, .cutout-edit-ta');
  if (live?.nodeName === 'TEXTAREA') {
    const ro = document.createElement('div');
    ro.className = 'poem-body-ro';
    ro.style.cssText = live.style.cssText;
    ro.style.height = '';
    ro.textContent = live.value || 'Begin writing…';
    ro.dataset.lines = (live.value || 'Begin').split('\n').length;
    copy.querySelector('.poem-body-in, .cutout-edit-ta').replaceWith(ro);
  }
  bench.replaceChildren(copy);
  if (copy.matches('.rat-auto')) {
    const scale = fitLong(copy, parseFloat(copy.style.getPropertyValue('--ps-scale')) || 1);
    bench.replaceChildren();
    sheet.style.setProperty('--ps-scale', scale);
    if (cache) fitCache.set(key, scale);
    return;
  }

  let scale = parseFloat(copy.style.getPropertyValue('--ps-scale')) || 1;
  const start = scale;
  for (let i = 0; i < 14 && scale > start * 0.5 && overflows(copy); i++) {
    scale = Number((scale * 0.945).toFixed(3));
    copy.style.setProperty('--ps-scale', scale);
  }
  if (scale === start && copy.matches(ROOMY)) {
    const lines = bodyLines(copy);
    for (let next = start * 1.05; lines && next <= start * 1.34; next *= 1.05) {
      copy.style.setProperty('--ps-scale', next.toFixed(3));
      if (overflows(copy, true) || bodyLines(copy) > lines) break;
      scale = Number(next.toFixed(3));
    }
  }
  bench.replaceChildren();
  sheet.style.setProperty('--ps-scale', scale);
  if (cache) fitCache.set(key, scale);
}

function ratioClass(ratio) {
  if (ratio === 'auto') return 'rat-auto';
  return 'rat-' + ratio.replace(':', '-');
}

// The poster, at a fixed base width (see SHEET_W). Preview, thumbnails, looks and PNG export all use this markup.
export function renderSheetHTML(poem, { editable = false, editingRich = false, design = false, inline = true, slide = null, thumb = false, ratio = '' } = {}) {
  const st = resolveStyle(poem);
  const pal = st.pal;
  const fn = st.font;
  const rhythmMult = (RHYTHMS.find(r => r.id === st.rhythm) || RHYTHMS[1]).mult;

  const isCarousel = Boolean(slide && slide.total > 1);
  const baseRatio = ratio || st.ratio;
  const effRatio = isCarousel && baseRatio === 'auto' ? '4:5' : baseRatio;
  const bodyText = slide ? slide.text : String(poem.body || '');
  const cleanBody = editable ? bodyText : bodyText.replace(/^\s*[-—]{3,}\s*$/gm, '').trim();

  const tStyle = st.titleStyle || 'classic';
  const showTitleBlock = (!slide || slide.isFirst) && tStyle !== 'none' && tStyle !== 'dropcap' && tStyle !== 'vertical';
  const showVerticalTitle = (!slide || slide.isFirst) && tStyle === 'vertical' && Boolean(poem.title?.trim());
  const showSign = !slide || slide.isLast;

  const lineCount = linesIn(cleanBody);
  const isLong = effRatio === 'auto' && lineCount > 14;
  const flow = ['cutout-line', 'cutout-word', 'torn'].includes(st.textStyle) || lineCount < 4 ? 'one' : st.flow;
  const cols = flow === 'two' ? columnsOf(cleanBody) : null;

  const ts = computeTypeScale(cols ? cols[0].join('\n\n') : cleanBody, {
    ratio: effRatio,
    layout: st.layout,
    textSize: st.textSize,
    isCarousel
  });
  const boost = fn.scaleBoost || 1;
  const fitKey = fitKeyFor(poem, st, cleanBody, effRatio, slide);
  const finalScale = fitCache.get(fitKey) ?? Number((ts.scale * boost).toFixed(3));
  const finalLh = Number((fn.lh * ts.lhMult * rhythmMult).toFixed(3));

  const imgSrc = st.bgMode === 'art' ? st.painting.src : (st.bgMode === 'photo' && st.photo ? st.photo : '');
  // A picture in the corner or at the side has nowhere good to sit on a long page: it opens the page instead.
  const runs = st.bgMode === 'art' && Boolean(st.painting.run);
  const wanted = st.layout === 'run' && !runs ? 'corner' : runs ? 'run' : st.layout;
  const effLayout = !imgSrc ? 'overlay' : isLong && ['corner', 'side'].includes(wanted) ? 'opening' : wanted;
  const imgBlend = st.bgMode === 'art' && st.painting.blend === 'multiply';
  const imgContain = imgBlend || (st.bgMode === 'art' && Boolean(st.painting.contain));
  const imgVignette = st.bgMode === 'art' && Boolean(st.painting.vignette);
  const imgFilter = st.bgMode === 'art' && st.painting.filter ? `filter:${st.painting.filter};` : '';

  const washAlpha = st.bgMode === 'photo' ? Math.max(0.28, st.wash / 100) : st.wash / 100;
  const washBg = pal.dark ? `rgba(12,14,20,${washAlpha})` : `rgba(250,247,240,${washAlpha})`;

  const isTorn = st.textStyle === 'torn';
  const isLineCut = st.textStyle === 'cutout-line';
  const isWordCut = st.textStyle === 'cutout-word';
  const isAnyCut = isLineCut || isWordCut;
  const isLined = ['ruled', 'marker', 'blackout'].includes(st.textStyle);
  const hasEmphasis = /\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*/.test(cleanBody);
  // In Design the words are for moving; a tap turns them back into a field.
  const still = editable && design && !editingRich && (Boolean(cleanBody.trim()) || !inline);
  const useRichView = (still || isAnyCut || isLined || tStyle === 'dropcap' || hasEmphasis || flow !== 'one') && (!editable || still || (!editingRich && Boolean(cleanBody.trim())));
  const textAlign = (effLayout === 'side' || isTorn) ? 'left' : st.align;
  const sheetBg = `linear-gradient(145deg, ${pal.bg}, ${pal.bg2 || pal.bg})`;

  const isMat = st.frame === 'polaroid';
  const outerStyle = isMat
    ? `background:${pal.mat || '#FAF8F3'};color:${pal.ink};--ps-scale:${finalScale};--ps-lh-mult:${ts.lhMult};--ps-pad-mult:${ts.padMult};--t-acc:${pal.acc || pal.ink};`
    : `background:${sheetBg};color:${pal.ink};--ps-scale:${finalScale};--ps-lh-mult:${ts.lhMult};--ps-pad-mult:${ts.padMult};--t-acc:${pal.acc || pal.ink};`;
  const innerStyle = isMat ? `background:${sheetBg};` : '';

  const titleCls = tStyle === 'smallcaps'
    ? ' poem-title-smallcaps'
    : tStyle === 'italic'
      ? ' poem-title-italic'
      : tStyle === 'highlight'
        ? ' poem-title-highlight'
        : '';

  const fontTitleStyle = `font-family:${fn.fam};font-weight:${fn.titleW};letter-spacing:${fn.ls};font-style:${fn.italicTitle ? 'italic' : 'normal'};text-align:${textAlign};`;
  const fontBodyStyle = `font-family:${fn.fam};font-weight:${fn.bodyW};letter-spacing:${fn.ls};line-height:${finalLh};text-align:${textAlign};`;

  let innerTextHTML = '';
  if (isAnyCut && (!editable || !editingRich)) {
    const rawLines = (cleanBody || 'Tap to write…').split('\n');
    const shownLines = rawLines;
    let tStrip = '';
    if (showTitleBlock && poem.title) {
      if (isWordCut) {
        const tWords = poem.title.trim().split(/\s+/).filter(Boolean);
        tStrip = `<div class="cutout-word-row" style="margin-bottom:8px;">${tWords.map(w => `<span class="cutout-word-tile" style="${fontTitleStyle};font-size:calc(19px * var(--ps-scale));">${esc(w)}</span>`).join('')}</div>`;
      } else {
        tStrip = `<span class="cutout-strip is-title${titleCls}" style="${fontTitleStyle};font-size:calc(20px * var(--ps-scale));">${esc(poem.title)}</span>`;
      }
    }
    const bStrips = shownLines.map(ln => {
      if (!ln.trim()) return `<div class="cutout-gap"></div>`;
      if (isWordCut) {
        const words = stripEmphasis(ln).trim().split(/\s+/).filter(Boolean);
        return `<div class="cutout-word-row">${words.map(w => `<span class="cutout-word-tile" style="${fontBodyStyle};font-size:calc(13.2px * var(--ps-scale));">${esc(w)}</span>`).join('')}</div>`;
      }
      return `<span class="cutout-strip" style="${fontBodyStyle};font-size:calc(13.5px * var(--ps-scale));">${formatInlineHTML(ln)}</span>`;
    }).join('');
    const sStrip = (showSign && st.sign.trim())
      ? `<span class="cutout-strip is-sign" style="font-family:${fn.fam};font-size:max(11px,calc(12px * var(--ps-scale)));">${esc(st.sign)}</span>`
      : '';
    innerTextHTML = `<div class="poem-cutout-block" ${editable ? 'id="rich-tap-edit" title="Tap to edit poem text"' : ''}>${tStrip}${bStrips}${sStrip}</div>`;
  } else {
    const titleHTML = showTitleBlock
      ? (editable && !still
        ? `<textarea id="poem-title-in" class="poem-title-in${titleCls}" rows="1" placeholder="Untitled poem…" style="${fontTitleStyle}" aria-label="Poem title">${esc(poem.title)}</textarea>`
        : (poem.title ? `<div class="poem-title-ro${titleCls}" style="${fontTitleStyle}">${esc(poem.title)}</div>` : ''))
      : '';

    const showRule = showTitleBlock && tStyle !== 'highlight' && ((editable && !still) || poem.title);
    const ruleHTML = showRule
      ? `<div class="poem-rule" style="background:${pal.acc || pal.ink}"></div>`
      : '';

    const set = t => (isLined ? linedHTML(t, st.textStyle) : formatInlineHTML(t));
    const st_ = t => `<div class="st">${set(t)}</div>`;
    const shown = cleanBody || (editable ? poem.spark || 'Tap to write…' : '…');
    const richBody = !cleanBody || flow === 'one' ? set(shown)
      : cols ? cols.map(c => `<div class="st-col">${c.map(st_).join('')}</div>`).join('')
      : stanzasOf(cleanBody).map(st_).join('');
    const dropCls = (tStyle === 'dropcap' ? ' poem-body-dropcap' : '') + (isLined ? ` is-${st.textStyle}` : '') + (cleanBody ? (flow === 'one' ? '' : ` flow-${flow}`) : ' is-blank');
    // Lines as set, for the fitting: blank lines count in one column, where they are part of the text
    const lineData = ` data-lines="${flow === 'one' ? shown.split('\n').length : lineCount}"`;
    let bodyHTML;
    if (editable && !useRichView) {
      bodyHTML = `<textarea id="poem-body-in" spellcheck="false" class="${isAnyCut ? 'cutout-edit-ta' : 'poem-body-in'}" rows="5" placeholder="${esc(poem.spark || 'Begin writing…')}" style="${fontBodyStyle}" aria-label="Poem body">${esc(poem.body)}</textarea>`;
    } else if (editable && useRichView) {
      bodyHTML = `<div id="rich-tap-edit" class="poem-body-ro${dropCls}"${lineData} style="${fontBodyStyle};cursor:text;" title="Tap to edit text">${richBody}</div>`;
    } else {
      bodyHTML = `<div class="poem-body-ro${dropCls}"${lineData} style="${fontBodyStyle}">${richBody}</div>`;
    }

    const signHTML = (showSign && st.sign.trim())
      ? `<div class="poem-sign" style="font-family:${fn.fam};color:${pal.sub || pal.ink};text-align:${textAlign}">${esc(st.sign)}</div>`
      : '';

    const endHTML = isLong && effLayout === 'opening' ? `<svg class="poem-end" viewBox="0 0 120 20" aria-hidden="true" style="color:${pal.acc || pal.ink}"><path d="M4 10h40M76 10h40M60 3c5 3 7 5 7 7s-2 4-7 7c-5-3-7-5-7-7s2-4 7-7z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="60" cy="10" r="1.6" fill="currentColor"/></svg>` : '';
    innerTextHTML = `${titleHTML}${ruleHTML}${bodyHTML}${signHTML}${endHTML}`;
  }

  const tsCls = isTorn ? ' ts-torn' : isAnyCut ? ' ts-cutout' : '';
  const hasOff = st.textX !== 0 || st.textY !== 0;
  const wrappedInner = isTorn ? `<div class="poem-torn-scrap">${innerTextHTML}</div>` : innerTextHTML;
  const txStyle = `--tx:${st.textX}%;--ty:${st.textY}%;`;
  const textCol = `<div ${editable ? 'id="movable-text-col" ' : ''}${still ? 'data-grab="text" tabindex="0" role="group" aria-label="Words on the page. Enter edits them, arrow keys move them, 0 puts them back." ' : ''}class="poem-text-col al-${textAlign}${effLayout === 'overlay' ? ' poem-overlay-pad' : ''}${tsCls}${hasOff ? ' has-offset' : ''}" style="${txStyle}">${wrappedInner}</div>`;

  const sideArtImg = imgSrc
    ? `<img${thumb ? ' loading="lazy"' : ''} decoding="sync" class="poem-side-img${imgBlend ? ' blend-mul' : ''}${imgContain ? ' is-contain' : ''}${imgVignette ? ' is-vignette' : ''}" src="${esc(imgSrc)}" alt="${esc(st.painting.name || 'Poem artwork')}" style="${imgFilter}">`
    : '';

  const bgOverlayHTML = (imgSrc && effLayout === 'overlay')
    ? `<img${thumb ? ' loading="lazy"' : ''} decoding="sync" class="poem-bg-img${imgBlend ? ' blend-mul' : ''}" src="${esc(imgSrc)}" alt="" style="${imgFilter}">${washAlpha > 0.005 ? `<div class="poem-wash" style="background:${washBg}"></div>` : ''}`
    : '';

  const frameHTML = st.frame === 'hairline'
    ? `<div class="poem-frame-hairline" style="color:${pal.acc || pal.ink}"></div>`
    : st.frame === 'arch'
      ? `<div class="poem-frame-arch" style="color:${pal.acc || pal.ink}"></div>`
      : st.frame === 'film'
          ? '<div class="poem-frame-film"></div><div class="poem-frame-film is-bottom"></div>'
        : ['airmail', 'stamp', 'deco', 'ajrakh', 'kantha', 'vine'].includes(st.frame)
          ? `<div class="poem-frame-img fi-${st.frame}" style="border-image-source:url('${finishSrc('frame-' + st.frame)}')"></div>`
        : st.frame === 'bookpage'
        ? `<div class="poem-book-top" style="color:${pal.acc || pal.ink}"></div><div class="poem-book-bot" style="color:${pal.sub || pal.ink};font-family:${fn.fam}">${slide && slide.total > 1 ? `— ${slide.index + 1} / ${slide.total} —` : (st.pageNo.trim() ? `— ${esc(st.pageNo.trim())} —` : '✦')}</div>`
        : '';

  const verticalTitleHTML = showVerticalTitle
    ? `<div class="poem-title-vertical" style="font-family:${fn.fam};color:${pal.sub || pal.ink}">${esc(poem.title)}</div>`
    : '';

  const slideBadge = (slide && slide.total > 1 && st.frame !== 'bookpage')
    ? `<div class="poem-slide-badge" style="color:${pal.sub || pal.ink};font-family:${fn.fam}">${slide.index + 1} / ${slide.total}</div>`
    : '';

  const lazy = thumb ? ' loading="lazy"' : '';
  const atmosHTML = st.atmos ? `<img class="poem-atmos" src="${finishSrc(st.atmos)}" alt=""${lazy}>` : '';
  const lightHTML = st.light ? `<img class="poem-light ${st.light}${pal.dark ? ' on-dark' : ''}" src="${finishSrc(st.light)}" alt=""${lazy}>` : '';
  const charmHTML = st.charm ? `<img ${editable && design ? `data-grab="charm" tabindex="0" role="button" aria-label="${esc(CHARMS.find(c => c.id === st.charm).label)}. Arrow keys move it to another corner." draggable="false" ` : ''}class="poem-charm ${st.charm} at-${st.charmPos}" src="${finishSrc(st.charm)}" alt=""${lazy}>` : '';
  const artWrapCls = `${imgBlend ? ' is-blend' : ''}${imgContain ? ' is-contain' : ''}`;
  let contentHTML;
  if (effLayout === 'side') {
    contentHTML = `<div class="poem-split">${textCol}<div class="poem-split-art${artWrapCls}">${sideArtImg}</div></div>`;
  } else if (effLayout === 'below') {
    contentHTML = `<div class="poem-stack">${textCol}<div class="poem-stack-art${artWrapCls}">${sideArtImg}</div></div>`;
  } else if (effLayout === 'opening') {
    contentHTML = `<div class="poem-opening"><div class="poem-opening-art${artWrapCls}">${sideArtImg}</div>${textCol}</div>`;
  } else if (effLayout === 'run') {
    const r = st.painting.run;
    const base = st.painting.src.replace(/\.webp$/, '');
    contentHTML = `<div class="poem-run"><div class="run-art" aria-hidden="true"><img class="run-top" src="${base}-top.webp" alt="" style="aspect-ratio:${r.w} / ${r.top}"${thumb ? ' loading="lazy"' : ''}><div class="run-mid" style="background-image:url('${base}-mid.webp');background-size:var(--run-w) calc(var(--run-w) * ${(r.mid / r.w).toFixed(4)})"></div><img class="run-end" src="${base}-end.webp" alt="" style="aspect-ratio:${r.w} / ${r.end}"${thumb ? ' loading="lazy"' : ''}></div>${textCol}</div>`;
  } else if (effLayout === 'corner') {
    contentHTML = `<div class="poem-corner-wrap">${textCol}<div class="poem-corner-art${artWrapCls}">${sideArtImg}</div></div>`;
  } else if (effLayout === 'scene') {
    contentHTML = `<div class="poem-scene">${textCol}<div class="poem-scene-art${artWrapCls}">${sideArtImg}</div></div>`;
  } else if (effLayout === 'arch') {
    contentHTML = `<div class="poem-arch"><div class="poem-arch-art${artWrapCls}" style="color:${pal.acc || pal.ink}">${sideArtImg}</div>${textCol}</div>`;
  } else if (effLayout === 'print') {
    contentHTML = `<div class="poem-print"><div class="poem-print-art"><div class="poem-print-photo${artWrapCls}">${sideArtImg}</div><img class="poem-print-tape" src="${finishSrc('charm-tape')}" alt=""></div>${textCol}</div>`;
  } else {
    contentHTML = textCol;
  }

  return `
    <div ${(editable || slide) && !thumb ? 'id="active-poem-sheet" ' : ''}class="poem-sheet ${ratioClass(effRatio)} fr-${st.frame} ly-${effLayout} bg-${st.bgMode}${isLong ? ' is-long' : ''}${String(poem.title || '').length > 17 ? ' has-long-title' : ''}${isMat ? ' is-mat' : ''}" data-fit="${st.textSize === 'auto' ? fitKey : ''}" style="${outerStyle}">
      <div class="poem-sheet-inner" style="${innerStyle}">
        ${bgOverlayHTML}
        ${atmosHTML}
        <div class="poem-grain tex-${st.texture}${pal.dark ? ' on-dark' : ''}"></div>
        ${frameHTML}
        ${verticalTitleHTML}
        ${contentHTML}
        ${slideBadge}
        ${charmHTML}
        ${lightHTML}
      </div>
    </div>
  `;
}

