import {
  ARTWORKS, PAPERS, FONTS, FONT_CATS, LAYOUTS, FRAMES, RATIOS, TEXT_SIZES, TEXT_STYLES,
  TITLE_STYLES, TEXTURES, INK_SWATCHES, RHYTHMS, MOODS,
  PRESETS, WORD_BANKS, STARTER_POEMS,
  findRhymes, poemMetrics, computeTypeScale, paginatePoem, resolveStyle
} from './data.js';
import { exportPoemPNG, exportCarouselPNGs } from './export.js';

const STORAGE_KEY = 'noor.poems.v1';
const LEGACY_KEY = 'folio.poems.v1';
const THEME_KEY = 'noor.theme';

// Bespoke Zero-Moon Noor Brand Lockup — Dawn Light Monogram (N + Sun Orb) + Outlined Custom "noor" Wordmark
const NOOR_SYMBOL_SVG = `<svg class="brand-arch" viewBox="0 0 256 256" fill="none" aria-hidden="true"><path fill="currentColor" d="M44 64 A20 20 0 0 1 64 44 H98 L168 165.2 V116 H212 V192 A20 20 0 0 1 192 212 H158 L88 90.8 V212 H44 Z"/><circle class="brand-gold" cx="190" cy="66" r="22"/></svg>`;
const NOOR_LOCKUP_SVG = `<svg class="brand-lockup-svg" viewBox="0 0 740 256" fill="none" role="img" aria-label="Noor"><g><path fill="currentColor" d="M44 64 A20 20 0 0 1 64 44 H98 L168 165.2 V116 H212 V192 A20 20 0 0 1 192 212 H158 L88 90.8 V212 H44 Z"/><circle class="brand-gold" cx="190" cy="66" r="22"/></g><g transform="translate(260 32) scale(1.12)" fill="currentColor"><path d="M20 64 H35 V82 C44 69 58 62 76 62 C102 62 116 78 116 105 V146 H101 V107 C101 87 91 76 72 76 C52 76 35 89 35 110 V146 H20 Z"/><path fill-rule="evenodd" d="M178 62 A42 43 0 1 0 178.1 62 Z M178 75 A27 30 0 1 1 177.9 75 Z"/><path fill-rule="evenodd" d="M270 62 A42 43 0 1 0 270.1 62 Z M270 75 A27 30 0 1 1 269.9 75 Z"/><path d="M334 64 H349 V84 C357 70 370 62 387 62 C394 62 399 63 403 65 L398 79 C394 77 390 76 384 76 C364 76 349 91 349 113 V146 H334 Z"/><circle class="brand-gold" cx="224" cy="36" r="11"/></g></svg>`;

const ICONS = {
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  search: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  back: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>`,
  next: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`,
  sparkles: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 3l.7 1.8L21.5 5.5l-1.8.7L19 8l-.7-1.8-1.8-.7 1.8-.7L19 3z"/></svg>`,
  download: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  upload: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
  sun: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
  moon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  archive: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/></svg>`,
  trash: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  more: `<svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/></svg>`,
  move: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
  artwork: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
  fonts: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  style: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  write: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
};

function esc(s) {
  return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Render inline poetic emphasis (**bold**, __underline__, *italic*) safely from escaped text
function formatInlineHTML(text) {
  let out = esc(text);
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong class="poem-em-b">$1</strong>');
  out = out.replace(/__([^_]+)__/g, '<span class="poem-em-u">$1</span>');
  out = out.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return out;
}

function stripEmphasis(s) {
  return String(s || '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1');
}

function loadPoems() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch {}
  const seeded = structuredClone(STARTER_POEMS);
  savePoems(seeded);
  return seeded;
}

function savePoems(poems) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(poems)); } catch {}
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || localStorage.getItem('folio.theme') || 'light';
  document.documentElement.dataset.theme = saved;
  return saved;
}

const state = {
  poems: loadPoems(),
  theme: initTheme(),
  activeId: null,
  search: '',
  moodFilter: 'All',
  railTab: 'artwork',
  artSub: 'minimal',
  fontCat: 'all',
  focusMode: false,
  mobileSheetOpen: false,
  moreOpen: false,
  slideIdx: 0,
  rhymeQuery: '',
  editingRich: false,
  exporting: false
};

function toast(msg, ms = 2200) {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => el.remove(), ms);
}

function getActivePoem() {
  return state.poems.find(p => p.id === state.activeId) || null;
}

function patchActive(patch, { rerender = true } = {}) {
  const p = getActivePoem();
  if (!p) return;
  Object.assign(p, patch, { updatedAt: Date.now() });
  savePoems(state.poems);
  if (rerender) render();
}

function openPoem(id) {
  const p = state.poems.find(x => x.id === id);
  if (!p) return;
  state.activeId = id;
  state.slideIdx = 0;
  state.focusMode = false;
  state.mobileSheetOpen = false;
  state.moreOpen = false;
  state.editingRich = false;
  const st = resolveStyle(p);
  state.artSub = st.bgMode === 'solid' ? 'solid' : st.bgMode === 'photo' ? 'photo' : (st.painting.grp || 'minimal');
  render();
  window.scrollTo(0, 0);
}

function createPoem() {
  const pr = PRESETS[Math.floor(Math.random() * PRESETS.length)];
  const p = {
    id: 'poem-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: '',
    body: '',
    bgMode: pr.bgMode,
    painting: pr.painting,
    paper: 'ivory-press',
    layout: pr.layout,
    font: pr.font,
    frame: pr.frame,
    align: pr.align,
    ratio: pr.ratio,
    textSize: 'auto',
    textStyle: pr.textStyle || 'plain',
    titleStyle: pr.titleStyle || 'classic',
    texture: pr.texture || 'grain',
    inkColor: 'auto',
    rhythm: 'balanced',
    textX: 0,
    textY: 0,
    carousel: false,
    wash: pr.wash,
    sign: '',
    pageNo: '',
    mood: '',
    archived: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  state.poems.unshift(p);
  savePoems(state.poems);
  openPoem(p.id);
  setTimeout(() => (document.getElementById('poem-title-in') || document.getElementById('poem-body-in'))?.focus(), 40);
}

function ratioClass(ratio) {
  if (ratio === 'auto') return 'rat-auto';
  return 'rat-' + ratio.replace(':', '-');
}

function renderSheetHTML(poem, { editable = false, slide = null, miniature = false } = {}) {
  const st = resolveStyle(poem);
  const pal = st.pal;
  const fn = st.font;
  const rhythmMult = (RHYTHMS.find(r => r.id === st.rhythm) || RHYTHMS[1]).mult;

  const isCarousel = Boolean(slide && slide.total > 1);
  const effRatio = isCarousel && st.ratio === 'auto' ? '4:5' : (miniature ? '4:5' : st.ratio);
  const bodyText = slide ? slide.text : String(poem.body || '');
  const cleanBody = editable ? bodyText : bodyText.replace(/^\s*[-—]{3,}\s*$/gm, '').trim();

  const tStyle = st.titleStyle || 'classic';
  const showTitleBlock = (!slide || slide.isFirst) && tStyle !== 'none' && tStyle !== 'dropcap' && tStyle !== 'vertical';
  const showVerticalTitle = (!slide || slide.isFirst) && tStyle === 'vertical' && Boolean(poem.title?.trim());
  const showSign = !slide || slide.isLast;

  const ts = computeTypeScale(cleanBody, {
    ratio: effRatio,
    layout: st.layout,
    textSize: st.textSize,
    isCarousel
  });
  const boost = fn.scaleBoost || 1;
  const finalScale = Number((ts.scale * boost).toFixed(3));
  const finalLh = Number((fn.lh * ts.lhMult * rhythmMult).toFixed(3));

  const imgSrc = st.bgMode === 'art' ? st.painting.src : (st.bgMode === 'photo' && st.photo ? st.photo : '');
  const effLayout = imgSrc ? st.layout : 'overlay';
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
  const hasEmphasis = /\*\*[^*]+\*\*|__[^_]+__|\*[^*]+\*/.test(cleanBody);
  const useRichView = (isAnyCut || tStyle === 'dropcap' || hasEmphasis) && (!editable || !state.editingRich);

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
  if (isAnyCut && (!editable || !state.editingRich)) {
    const rawLines = (cleanBody || 'Tap to write…').split('\n');
    const shownLines = miniature ? rawLines.slice(0, 9) : rawLines;
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
      ? (editable
        ? `<input id="poem-title-in" class="poem-title-in${titleCls}" type="text" placeholder="Untitled poem…" value="${esc(poem.title)}" style="${fontTitleStyle}" aria-label="Poem title">`
        : (poem.title ? `<div class="poem-title-ro${titleCls}" style="${fontTitleStyle}">${esc(poem.title)}</div>` : ''))
      : '';

    const showRule = showTitleBlock && tStyle !== 'highlight' && (editable || poem.title);
    const ruleHTML = showRule
      ? `<div class="poem-rule" style="background:${pal.acc || pal.ink}"></div>`
      : '';

    const dropCls = tStyle === 'dropcap' ? ' poem-body-dropcap' : '';
    let bodyHTML;
    if (editable && !useRichView) {
      bodyHTML = `<textarea id="poem-body-in" class="${isAnyCut ? 'cutout-edit-ta' : 'poem-body-in'}" rows="5" placeholder="Begin writing…\n\nTip: use **bold** or __underline__ for emphasis, or --- for a carousel break." style="${fontBodyStyle}" aria-label="Poem body">${esc(poem.body)}</textarea>`;
    } else if (editable && useRichView) {
      bodyHTML = `<div id="rich-tap-edit" class="poem-body-ro${dropCls}" style="${fontBodyStyle};cursor:text;" title="Tap to edit text">${formatInlineHTML(cleanBody || 'Tap to write…')}</div>`;
    } else {
      bodyHTML = `<div class="poem-body-ro${dropCls}" style="${fontBodyStyle}">${formatInlineHTML(cleanBody || '…')}</div>`;
    }

    const signHTML = (showSign && st.sign.trim())
      ? `<div class="poem-sign" style="font-family:${fn.fam};color:${pal.sub || pal.ink};text-align:${textAlign}">${esc(st.sign)}</div>`
      : '';

    innerTextHTML = `${titleHTML}${ruleHTML}${bodyHTML}${signHTML}`;
  }

  const tsCls = isTorn ? ' ts-torn' : isAnyCut ? ' ts-cutout' : '';
  const hasOff = st.textX !== 0 || st.textY !== 0;
  const dragHandle = editable
    ? `<button type="button" class="drag-handle" id="drag-text-handle" title="Drag to move textbox">${ICONS.move}<span>Move</span></button>`
    : '';
  const wrappedInner = isTorn ? `<div class="poem-torn-scrap">${innerTextHTML}</div>` : innerTextHTML;
  const txStyle = `--tx:${st.textX}%;--ty:${st.textY}%;`;
  const textCol = `<div id="${editable ? 'movable-text-col' : ''}" class="poem-text-col al-${textAlign}${effLayout === 'overlay' ? ' poem-overlay-pad' : ''}${tsCls}${hasOff ? ' has-offset' : ''}" style="${txStyle}">${dragHandle}${wrappedInner}</div>`;

  const sideArtImg = imgSrc
    ? `<img class="poem-side-img${imgBlend ? ' blend-mul' : ''}${imgContain ? ' is-contain' : ''}${imgVignette ? ' is-vignette' : ''}" src="${esc(imgSrc)}" alt="${esc(st.painting.name || 'Poem artwork')}" style="${imgFilter}">`
    : '';

  const bgOverlayHTML = (imgSrc && effLayout === 'overlay')
    ? `<img class="poem-bg-img${imgBlend ? ' blend-mul' : ''}" src="${esc(imgSrc)}" alt="" style="${imgFilter}">${washAlpha > 0.005 ? `<div class="poem-wash" style="background:${washBg}"></div>` : ''}`
    : '';

  const frameHTML = st.frame === 'hairline'
    ? `<div class="poem-frame-hairline" style="color:${pal.acc || pal.ink}"></div>`
    : st.frame === 'arch'
      ? `<div class="poem-frame-arch" style="color:${pal.acc || pal.ink}"></div>`
      : st.frame === 'bookpage'
        ? `<div class="poem-book-top" style="color:${pal.acc || pal.ink}"></div><div class="poem-book-bot" style="color:${pal.sub || pal.ink};font-family:${fn.fam}">${slide && slide.total > 1 ? `— ${slide.index + 1} / ${slide.total} —` : (st.pageNo.trim() ? `— ${esc(st.pageNo.trim())} —` : '✦')}</div>`
        : '';

  const verticalTitleHTML = showVerticalTitle
    ? `<div class="poem-title-vertical" style="font-family:${fn.fam};color:${pal.sub || pal.ink}">${esc(poem.title)}</div>`
    : '';

  const slideBadge = (slide && slide.total > 1 && st.frame !== 'bookpage')
    ? `<div class="poem-slide-badge" style="color:${pal.sub || pal.ink};font-family:${fn.fam}">${slide.index + 1} / ${slide.total}</div>`
    : '';

  const artWrapCls = `${imgBlend ? ' is-blend' : ''}${imgContain ? ' is-contain' : ''}`;
  let contentHTML;
  if (effLayout === 'side') {
    contentHTML = `<div class="poem-split">${textCol}<div class="poem-split-art${artWrapCls}">${sideArtImg}</div></div>`;
  } else if (effLayout === 'below') {
    contentHTML = `<div class="poem-stack">${textCol}<div class="poem-stack-art${artWrapCls}">${sideArtImg}</div></div>`;
  } else if (effLayout === 'corner') {
    contentHTML = `<div class="poem-corner-wrap">${textCol}<div class="poem-corner-art${artWrapCls}">${sideArtImg}</div></div>`;
  } else {
    contentHTML = textCol;
  }

  return `
    <div id="${editable || slide ? 'active-poem-sheet' : ''}" class="poem-sheet ${ratioClass(effRatio)} fr-${st.frame}${isMat ? ' is-mat' : ''}" style="${outerStyle}">
      <div class="poem-sheet-inner" style="${innerStyle}">
        ${bgOverlayHTML}
        <div class="poem-grain tex-${st.texture}"></div>
        ${frameHTML}
        ${verticalTitleHTML}
        ${contentHTML}
        ${slideBadge}
      </div>
    </div>
  `;
}

function renderGallery() {
  const q = state.search.trim().toLowerCase();
  const isArchTab = state.moodFilter === 'Archived';
  const filtered = state.poems.filter(p => {
    if (isArchTab ? !p.archived : p.archived) return false;
    if (state.moodFilter !== 'All' && !isArchTab) {
      if (state.moodFilter === 'Long') {
        if (poemMetrics(p.body).lines < 14 && p.mood !== 'Long') return false;
      } else if (p.mood !== state.moodFilter) {
        return false;
      }
    }
    if (q) {
      const hay = `${p.title} ${p.body} ${p.mood} ${p.sign}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const activeCount = state.poems.filter(p => !p.archived).length;
  const archivedCount = state.poems.filter(p => p.archived).length;
  const pills = ['All', ...MOODS, ...(archivedCount ? ['Archived'] : [])];

  const cardsHTML = filtered.length
    ? `<div class="anthology-grid">${filtered.map(p => {
        const m = poemMetrics(p.body);
        const st = resolveStyle(p);
        const isLong = m.lines > 11;
        const fadeHTML = isLong
          ? `<div class="poem-card-fade" style="background:linear-gradient(to bottom, transparent, ${st.pal.bg2 || st.pal.bg} 86%)"></div>`
          : '';
        return `
          <button type="button" class="poem-card" data-open="${esc(p.id)}">
            <div class="poem-card-frame">
              ${renderSheetHTML(p, { editable: false, miniature: true })}
              ${fadeHTML}
            </div>
            <div class="poem-card-meta">
              <h2 class="poem-card-title">${esc(p.title || 'Untitled poem')}</h2>
              <span class="poem-card-sub">${m.lines} ${m.lines === 1 ? 'line' : 'lines'}${p.mood ? ' · ' + esc(p.mood) : ''}</span>
            </div>
          </button>
        `;
      }).join('')}</div>`
    : `<div class="empty-state">
        ${NOOR_SYMBOL_SVG}
        <h2>A quiet, open page</h2>
        <p>${q || state.moodFilter !== 'All' ? 'No poems match this filter yet.' : 'Begin your anthology with your first poem.'}</p>
        <button type="button" class="btn primary" id="empty-new-btn">${ICONS.plus} Write a poem</button>
      </div>`;

  const galleryMenu = state.moreOpen ? `
    <div class="ios-menu" role="menu">
      <button type="button" class="ios-menu-item" id="m-backup-btn" role="menuitem"><span>Backup JSON</span>${ICONS.download}</button>
      <button type="button" class="ios-menu-item" id="m-import-btn" role="menuitem"><span>Import JSON</span>${ICONS.upload}</button>
    </div>
  ` : '';

  return `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <h1 class="brand-mark">${NOOR_LOCKUP_SVG}</h1>
          <span class="brand-sub">Poetry studio</span>
        </div>
        <div class="search-wrap">
          ${ICONS.search}
          <input id="gallery-search" class="search-in" type="search" placeholder="Search poems…" value="${esc(state.search)}" aria-label="Search poems">
        </div>
        <div class="topbar-right">
          <button type="button" class="btn sm ghost desktop-only" id="backup-btn" title="Export anthology JSON">${ICONS.download} Backup</button>
          <button type="button" class="btn sm ghost desktop-only" id="import-btn" title="Import anthology JSON">${ICONS.upload} Import</button>
          <input id="import-file" type="file" accept="application/json" hidden>
          <button type="button" class="btn sm icon-only" id="theme-btn" title="Toggle light or night studio" aria-label="Toggle studio theme">${state.theme === 'dark' ? ICONS.sun : ICONS.moon}</button>
          <div class="menu-wrap mobile-only">
            <button type="button" class="btn sm icon-only" id="more-btn" aria-label="More options" aria-expanded="${state.moreOpen}">${ICONS.more}</button>
            ${galleryMenu}
          </div>
          <button type="button" class="btn primary desktop-only" id="new-poem-btn">${ICONS.plus} New poem</button>
        </div>
      </header>

      <main>
        <div class="filter-bar">
          <div class="mood-pills" role="tablist" aria-label="Filter poems by collection">
            ${pills.map(md => `<button type="button" role="tab" aria-selected="${state.moodFilter === md}" class="pill${state.moodFilter === md ? ' on' : ''}" data-mood="${esc(md)}">${esc(md)}${md === 'Archived' ? ` (${archivedCount})` : ''}</button>`).join('')}
          </div>
          <span class="gallery-stat">${activeCount} ${activeCount === 1 ? 'poem' : 'poems'}</span>
        </div>
        ${cardsHTML}
      </main>
    </div>

    <div class="mobile-fab-wrap">
      <button type="button" class="mobile-fab" id="mobile-new-btn">${ICONS.plus}<span>Write a poem</span></button>
    </div>
  `;
}

function renderStudio(poem) {
  const st = resolveStyle(poem);
  const m = poemMetrics(poem.body);
  const effCarouselRatio = st.ratio === 'auto' ? '4:5' : st.ratio;
  const slides = paginatePoem(poem.body, { ratio: effCarouselRatio, layout: st.layout });
  if (state.slideIdx >= slides.length) state.slideIdx = Math.max(0, slides.length - 1);
  const activeSlide = st.carousel ? slides[state.slideIdx] : null;

  const grps = {
    minimal: ARTWORKS.filter(a => a.grp === 'minimal'),
    sketch: ARTWORKS.filter(a => a.grp === 'sketch'),
    light: ARTWORKS.filter(a => a.grp === 'light'),
    editorial: ARTWORKS.filter(a => a.grp === 'editorial'),
    canvas: ARTWORKS.filter(a => a.grp === 'canvas')
  };

  let railContent = '';
  if (state.railTab === 'artwork') {
    const subTabs = [
      { id: 'minimal', label: `Minimal (${grps.minimal.length})` },
      { id: 'sketch', label: `Sketches (${grps.sketch.length})` },
      { id: 'light', label: `Light (${grps.light.length})` },
      { id: 'editorial', label: `Book & Ink (${grps.editorial.length})` },
      { id: 'canvas', label: `Watercolour (${grps.canvas.length})` },
      { id: 'solid', label: 'Papers' },
      { id: 'photo', label: 'Your Photo' }
    ];

    let picker = '';
    if (grps[state.artSub]) {
      picker = `<div class="paint-grid">${grps[state.artSub].map(pt => {
        const isBlend = pt.blend === 'multiply';
        const isContain = isBlend || Boolean(pt.contain);
        return `
          <button type="button" class="paint-btn${st.bgMode === 'art' && st.painting.id === pt.id ? ' on' : ''}" data-art="${esc(pt.id)}">
            <span class="paint-thumb${isContain ? ' is-contain' : ''}${isBlend ? ' is-blend' : ''}${pt.vignette ? ' is-vignette' : ''}" style="background:${pt.bg}">
              <img src="${esc(pt.src)}" alt="${esc(pt.name)}" loading="lazy" style="${pt.filter ? 'filter:' + pt.filter : ''}">
            </span>
            <span class="paint-nm">${esc(pt.name)}</span>
          </button>
        `;
      }).join('')}</div>`;
    } else if (state.artSub === 'solid') {
      picker = `<div class="paper-grid">${PAPERS.map(pa => `
        <button type="button" class="paper-btn${st.bgMode === 'solid' && st.paper.id === pa.id ? ' on' : ''}" data-paper="${esc(pa.id)}">
          <span class="paper-sw" style="background:linear-gradient(135deg,${pa.bg},${pa.bg2});color:${pa.ink};border-color:${pa.acc}">Aa</span>
          <span class="paper-nm">${esc(pa.name)}</span>
        </button>
      `).join('')}</div>`;
    } else {
      picker = `
        <div style="display:flex;flex-direction:column;gap:12px;">
          <button type="button" class="btn primary" id="pick-photo-btn">${ICONS.plus} ${st.photo ? 'Change photo' : 'Upload background photo'}</button>
          <input id="photo-file-in" type="file" accept="image/*" hidden>
          <div>
            <div class="sec-lbl">Text ink on photo</div>
            <div class="pills">
              <button type="button" class="choice-pill${st.photoDark ? ' on' : ''}" data-photodark="1">Light ink</button>
              <button type="button" class="choice-pill${!st.photoDark ? ' on' : ''}" data-photodark="0">Dark ink</button>
            </div>
          </div>
          <p class="hint">Pair your photo with Book Editorial, Full Canvas, Corner Art, or Torn Paper.</p>
        </div>
      `;
    }

    const placementHTML = st.bgMode !== 'solid' ? `
      <div>
        <div class="sec-lbl">Artwork placement</div>
        <div class="pills">
          ${LAYOUTS.map(ly => `<button type="button" class="choice-pill${st.layout === ly.id ? ' on' : ''}" data-layout="${ly.id}">${esc(ly.label)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Text paper style</div>
        <div class="pills">
          ${TEXT_STYLES.map(ts => `<button type="button" class="choice-pill${st.textStyle === ts.id ? ' on' : ''}" data-textstyle="${ts.id}">${esc(ts.label)}</button>`).join('')}
        </div>
      </div>
      ${st.layout === 'overlay' ? `
        <div>
          <div class="sec-lbl">Backdrop softness (${st.wash}%)</div>
          <input id="wash-range" class="range-in" type="range" min="0" max="65" value="${st.wash}">
        </div>
      ` : ''}
    ` : `
      <div>
        <div class="sec-lbl">Text paper style</div>
        <div class="pills">
          ${TEXT_STYLES.map(ts => `<button type="button" class="choice-pill${st.textStyle === ts.id ? ' on' : ''}" data-textstyle="${ts.id}">${esc(ts.label)}</button>`).join('')}
        </div>
      </div>
    `;

    railContent = `
      <div class="subtabs">${subTabs.map(t => `<button type="button" class="subtab${state.artSub === t.id ? ' on' : ''}" data-artsub="${t.id}">${esc(t.label)}</button>`).join('')}</div>
      ${picker}
      ${placementHTML}
    `;
  } else if (state.railTab === 'fonts') {
    const shown = state.fontCat === 'all' ? FONTS : FONTS.filter(f => f.cat === state.fontCat);
    railContent = `
      <div class="subtabs">${FONT_CATS.map(fc => `<button type="button" class="subtab${state.fontCat === fc.id ? ' on' : ''}" data-fontcat="${fc.id}">${esc(fc.label)}</button>`).join('')}</div>
      <div class="font-list">
        ${shown.map(fn => `
          <button type="button" class="font-btn${st.font.id === fn.id ? ' on' : ''}" data-font="${fn.id}">
            <span class="font-sample" style="font-family:${fn.fam};font-weight:${fn.titleW};font-style:${fn.italicTitle ? 'italic' : 'normal'}">${esc(fn.name)}</span>
            <span class="font-cat">${esc(fn.cat)}</span>
          </button>
        `).join('')}
      </div>
    `;
  } else if (state.railTab === 'style') {
    const hasOffset = st.textX !== 0 || st.textY !== 0;
    railContent = `
      <div>
        <div class="sec-lbl">Title style</div>
        <div class="pills">
          ${TITLE_STYLES.map(ts => `<button type="button" class="choice-pill${st.titleStyle === ts.id ? ' on' : ''}" data-titlestyle="${ts.id}">${esc(ts.label)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Text paper style</div>
        <div class="pills">
          ${TEXT_STYLES.map(ts => `<button type="button" class="choice-pill${st.textStyle === ts.id ? ' on' : ''}" data-textstyle="${ts.id}">${esc(ts.label)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Textbox position</div>
        <div class="pills">
          <span class="hint" style="align-self:center;">Drag the <strong>Move</strong> handle on the poem</span>
          ${hasOffset ? `<button type="button" class="choice-pill on" id="reset-pos-btn">Reset center</button>` : ''}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Ink colour</div>
        <div class="ink-swatches">
          ${INK_SWATCHES.map(sw => `
            <button type="button" class="ink-dot${st.inkColor === sw.id ? ' on' : ''}" data-ink="${sw.id}" title="${esc(sw.label)}" aria-label="${esc(sw.label)}" style="${sw.hex ? `background:${sw.hex};` : 'background:var(--surface-2);color:var(--ink);'}">${sw.hex ? '' : 'A'}</button>
          `).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Paper texture</div>
        <div class="pills">
          ${TEXTURES.map(tx => `<button type="button" class="choice-pill${st.texture === tx.id ? ' on' : ''}" data-texture="${tx.id}">${esc(tx.label)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Text size &amp; line rhythm</div>
        <div class="pills" style="margin-bottom:6px;">
          ${TEXT_SIZES.map(ts => `<button type="button" class="choice-pill${st.textSize === ts.id ? ' on' : ''}" data-textsize="${ts.id}">${esc(ts.label)}</button>`).join('')}
        </div>
        <div class="pills">
          ${RHYTHMS.map(rh => `<button type="button" class="choice-pill${st.rhythm === rh.id ? ' on' : ''}" data-rhythm="${rh.id}">${esc(rh.label)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Poster format</div>
        <div class="pills">
          ${RATIOS.map(r => `<button type="button" class="choice-pill${st.ratio === r.id ? ' on' : ''}" data-ratio="${r.id}">${esc(r.label)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Frame</div>
        <div class="pills">
          ${FRAMES.map(fr => `<button type="button" class="choice-pill${st.frame === fr.id ? ' on' : ''}" data-frame="${fr.id}">${esc(fr.label)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Alignment</div>
        <div class="pills">
          ${['left', 'center', 'right'].map(al => `<button type="button" class="choice-pill${st.align === al ? ' on' : ''}" data-align="${al}" style="text-transform:capitalize">${al}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Signature</div>
        <input id="sign-in" class="field-in" type="text" placeholder="— your name or pen name" value="${esc(st.sign)}">
      </div>
      <div>
        <div class="sec-lbl">Book page number</div>
        <input id="page-in" class="field-in" type="text" placeholder="e.g. 143" value="${esc(st.pageNo)}">
      </div>
      <div>
        <div class="sec-lbl">Collection tag</div>
        <div class="pills">
          ${MOODS.map(md => `<button type="button" class="choice-pill${st.mood === md ? ' on' : ''}" data-setmood="${esc(md)}">${esc(md)}</button>`).join('')}
        </div>
      </div>
    `;
  } else {
    const lastWordMatch = String(poem.body || '').trim().match(/([A-Za-z]+)\W*$/);
    const activeRhymeWord = state.rhymeQuery || (lastWordMatch ? lastWordMatch[1] : '');
    const rhymes = findRhymes(activeRhymeWord);
    railContent = `
      <div>
        <div class="sec-lbl">Line emphasis &amp; carousel</div>
        <div class="pills">
          <button type="button" class="choice-pill" data-wrap="**"><strong>Bold line</strong></button>
          <button type="button" class="choice-pill" data-wrap="__"><span class="poem-em-u">Underline</span></button>
          <button type="button" class="choice-pill" data-wrap="*"><em>Italic</em></button>
          <button type="button" class="choice-pill" id="insert-break-btn">Slide break (---)</button>
          <button type="button" class="choice-pill${st.ratio === 'auto' ? ' on' : ''}" data-ratio="auto">Long Page</button>
        </div>
        <p class="hint" style="margin-top:8px;">Wrap lines in <code>**bold**</code> or <code>__underline__</code> for visual punch, or place <code>---</code> on its own line for manual carousel breaks.</p>
      </div>
      <div>
        <div class="sec-lbl">Rhyme finder</div>
        <input id="rhyme-in" class="field-in" type="text" placeholder="Type a word (e.g. light, rain, moon)…" value="${esc(state.rhymeQuery)}">
        <div class="word-chips" style="margin-top:8px;">
          ${rhymes.length
            ? rhymes.map(rw => `<button type="button" class="word-chip" data-insert="${esc(rw)}">${esc(rw)}</button>`).join('')
            : `<span class="hint">${activeRhymeWord ? `No close rhymes for “${esc(activeRhymeWord)}” in offline bank.` : 'Write a line or type a word above to see rhymes.'}</span>`
          }
        </div>
      </div>
      ${WORD_BANKS.map(bank => `
        <div>
          <div class="sec-lbl">${esc(bank.label)}</div>
          <div class="word-chips">
            ${bank.words.map(w => `<button type="button" class="word-chip" data-insert="${esc(w)}">${esc(w)}</button>`).join('')}
          </div>
        </div>
      `).join('')}
    `;
  }

  const carouselNavHTML = st.carousel ? `
    <div class="carousel-nav" aria-label="Carousel slide preview">
      <button type="button" class="btn sm ghost" id="prev-slide-btn" ${state.slideIdx <= 0 ? 'disabled' : ''}>${ICONS.back} Prev</button>
      <span class="carousel-lbl">Slide ${state.slideIdx + 1} of ${slides.length}</span>
      <div class="carousel-dots">
        ${slides.map((s, i) => `<button type="button" class="c-dot${i === state.slideIdx ? ' on' : ''}" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}
      </div>
      <button type="button" class="btn sm ghost" id="next-slide-btn" ${state.slideIdx >= slides.length - 1 ? 'disabled' : ''}>Next ${ICONS.next}</button>
      <button type="button" class="btn sm" id="edit-full-btn">Edit</button>
    </div>
  ` : '';

  const longHint = (!st.carousel && m.lines >= 16 && st.ratio !== 'auto')
    ? `<span class="stage-tip">Long poem (${m.lines} lines) · Auto-fit active · try <strong>Carousel (${slides.length})</strong> or <strong>Long Page</strong></span>`
    : `<span class="stage-tip">${st.carousel ? `Previewing ${slides.length}-slide carousel` : (st.ratio === 'auto' ? 'Unclipped Long Page · exports full height' : 'Hover poem to drag & reposition · tap to write')}</span>`;

  const tabMeta = [
    { id: 'artwork', label: 'Artwork', icon: ICONS.artwork },
    { id: 'fonts', label: 'Fonts', icon: ICONS.fonts },
    { id: 'style', label: 'Style', icon: ICONS.style },
    { id: 'write', label: 'Write', icon: ICONS.write }
  ];
  const activeTabLabel = tabMeta.find(t => t.id === state.railTab)?.label || 'Artwork';

  const mobileMoreMenu = state.moreOpen ? `
    <div class="ios-menu" role="menu">
      <button type="button" class="ios-menu-item" id="m-shuffle-btn" role="menuitem"><span>Shuffle pairing</span>${ICONS.sparkles}</button>
      <button type="button" class="ios-menu-item" id="m-copy-btn" role="menuitem"><span>Copy poem text</span>${ICONS.copy}</button>
      <button type="button" class="ios-menu-item" id="m-theme-btn" role="menuitem"><span>${state.theme === 'dark' ? 'Light studio' : 'Night studio'}</span>${state.theme === 'dark' ? ICONS.sun : ICONS.moon}</button>
      <div class="ios-menu-sep"></div>
      <button type="button" class="ios-menu-item" id="m-archive-btn" role="menuitem"><span>${poem.archived ? 'Unarchive poem' : 'Archive poem'}</span>${ICONS.archive}</button>
      <button type="button" class="ios-menu-item danger" id="m-delete-btn" role="menuitem"><span>Delete poem</span>${ICONS.trash}</button>
    </div>
  ` : '';

  return `
    <div class="studio${state.focusMode ? ' is-focus' : ''}">
      <div class="studio-stage">
        <div class="stage-bar">
          <div class="stage-bar-left">
            <button type="button" class="btn sm ghost" id="back-gallery-btn" style="padding-left:6px;">${ICONS.back}<span>noor</span></button>
            <button type="button" class="btn sm desktop-only" id="shuffle-btn" title="Try a curated art & font pairing">${ICONS.sparkles} Shuffle</button>
            <button type="button" class="btn sm desktop-only${state.focusMode ? ' primary' : ''}" id="focus-btn">${state.focusMode ? 'Exit Focus' : 'Focus'}</button>
            <div class="seg" role="group" aria-label="Single or Carousel view">
              <button type="button" class="seg-btn${!st.carousel ? ' on' : ''}" id="mode-single-btn">Single</button>
              <button type="button" class="seg-btn${st.carousel ? ' on' : ''}" id="mode-carousel-btn">Carousel (${slides.length})</button>
            </div>
          </div>
          <div class="stage-bar-right">
            <button type="button" class="btn sm icon-only desktop-only" id="theme-btn" title="Toggle light or night studio" aria-label="Toggle studio theme">${state.theme === 'dark' ? ICONS.sun : ICONS.moon}</button>
            <button type="button" class="btn sm desktop-only" id="copy-btn">Copy</button>
            <button type="button" class="btn sm primary" id="export-btn" ${state.exporting ? 'disabled' : ''}>
              ${ICONS.download} <span>${state.exporting ? 'Saving…' : (st.carousel && slides.length > 1 ? `Save (${slides.length})` : 'Save<span class="desktop-only">&nbsp;PNG</span>')}</span>
            </button>
            <div class="menu-wrap mobile-only">
              <button type="button" class="btn sm icon-only" id="more-btn" aria-label="More options" aria-expanded="${state.moreOpen}">${ICONS.more}</button>
              ${mobileMoreMenu}
            </div>
          </div>
        </div>

        <div class="stage-canvas-wrap">
          ${carouselNavHTML}
          ${renderSheetHTML(poem, { editable: !st.carousel, slide: activeSlide })}
        </div>

        <div class="stage-footer">
          <span id="metrics-lbl">${m.stanzas} ${m.stanzas === 1 ? 'stanza' : 'stanzas'} · ${m.lines} ${m.lines === 1 ? 'line' : 'lines'} · ${m.words} words · ~${m.syllables} syllables</span>
          ${longHint}
        </div>
      </div>

      <div class="sheet-scrim${state.mobileSheetOpen ? ' open' : ''}" id="sheet-scrim"></div>

      <aside class="studio-rail${state.mobileSheetOpen ? ' sheet-open' : ''}" aria-label="Poem design inspector">
        <div class="rail-sheet-head">
          <div class="sheet-grabber" id="sheet-grabber"></div>
          <div class="sheet-head-row">
            <h2 class="sheet-title">${activeTabLabel}</h2>
            <button type="button" class="btn sm primary" id="sheet-done-btn">Done</button>
          </div>
        </div>
        <div class="rail-tabs" role="tablist">
          ${tabMeta.map(tb => `<button type="button" role="tab" aria-selected="${state.railTab === tb.id}" class="rail-tab${state.railTab === tb.id ? ' on' : ''}" data-railtab="${tb.id}">${tb.label}</button>`).join('')}
        </div>
        <div class="rail-body">${railContent}</div>
        <div class="rail-foot">
          <button type="button" class="btn sm" id="archive-btn">${ICONS.archive} ${poem.archived ? 'Unarchive' : 'Archive'}</button>
          <button type="button" class="btn sm danger" id="delete-btn">${ICONS.trash} Delete</button>
        </div>
      </aside>

      <nav class="ios-dock" aria-label="Studio tools">
        ${tabMeta.map(tb => `
          <button type="button" class="dock-btn${state.mobileSheetOpen && state.railTab === tb.id ? ' on' : ''}" data-docktab="${tb.id}">
            ${tb.icon}
            <span>${tb.label}</span>
          </button>
        `).join('')}
      </nav>
    </div>
  `;
}

function autoSizeTextarea() {
  const ta = document.getElementById('poem-body-in');
  if (!ta) return;
  ta.style.height = 'auto';
  ta.style.height = Math.max(88, ta.scrollHeight) + 'px';
}

function liveUpdateMetricsAndScale(poem) {
  const st = resolveStyle(poem);
  const rhythmMult = (RHYTHMS.find(r => r.id === st.rhythm) || RHYTHMS[1]).mult;
  const m = poemMetrics(poem.body);
  const lbl = document.getElementById('metrics-lbl');
  if (lbl) lbl.textContent = `${m.stanzas} ${m.stanzas === 1 ? 'stanza' : 'stanzas'} · ${m.lines} ${m.lines === 1 ? 'line' : 'lines'} · ${m.words} words · ~${m.syllables} syllables`;

  const effCarouselRatio = st.ratio === 'auto' ? '4:5' : st.ratio;
  const slides = paginatePoem(poem.body, { ratio: effCarouselRatio, layout: st.layout });
  const cBtn = document.getElementById('mode-carousel-btn');
  if (cBtn) cBtn.textContent = `Carousel (${slides.length})`;

  const sheet = document.getElementById('active-poem-sheet');
  if (sheet) {
    const ts = computeTypeScale(poem.body, { ratio: st.ratio, layout: st.layout, textSize: st.textSize, isCarousel: false });
    const boost = st.font.scaleBoost || 1;
    sheet.style.setProperty('--ps-scale', Number((ts.scale * boost).toFixed(3)));
    sheet.style.setProperty('--ps-lh-mult', ts.lhMult);
    sheet.style.setProperty('--ps-pad-mult', ts.padMult);
    const ta = document.getElementById('poem-body-in');
    if (ta) ta.style.lineHeight = Number((st.font.lh * ts.lhMult * rhythmMult).toFixed(3));
  }
  autoSizeTextarea();
}

function wireDraggableTextbox(poem) {
  const handle = document.getElementById('drag-text-handle');
  const col = document.getElementById('movable-text-col');
  const sheet = document.getElementById('active-poem-sheet');
  if (!handle || !col || !sheet) return;

  let startX = 0, startY = 0, baseX = 0, baseY = 0, curX = 0, curY = 0, dragging = false;

  handle.addEventListener('pointerdown', e => {
    e.preventDefault();
    e.stopPropagation();
    handle.setPointerCapture(e.pointerId);
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    baseX = Number.isFinite(poem.textX) ? poem.textX : 0;
    baseY = Number.isFinite(poem.textY) ? poem.textY : 0;
    curX = baseX;
    curY = baseY;
    col.classList.add('is-dragging');
  });

  handle.addEventListener('pointermove', e => {
    if (!dragging) return;
    const rect = sheet.getBoundingClientRect();
    const dxPct = ((e.clientX - startX) / Math.max(180, rect.width * 0.65)) * 100;
    const dyPct = ((e.clientY - startY) / Math.max(180, rect.height * 0.65)) * 100;
    let nx = Math.max(-44, Math.min(44, Math.round(baseX + dxPct)));
    let ny = Math.max(-44, Math.min(44, Math.round(baseY + dyPct)));
    // Gentle magnetic snap near center
    if (Math.abs(nx) <= 2) nx = 0;
    if (Math.abs(ny) <= 2) ny = 0;
    curX = nx;
    curY = ny;
    col.style.setProperty('--tx', nx + '%');
    col.style.setProperty('--ty', ny + '%');
  });

  const endDrag = () => {
    if (!dragging) return;
    dragging = false;
    col.classList.remove('is-dragging');
    patchActive({ textX: curX, textY: curY }, { rerender: false });
    col.classList.toggle('has-offset', curX !== 0 || curY !== 0);
  };
  handle.addEventListener('pointerup', endDrag);
  handle.addEventListener('pointercancel', endDrag);
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem(THEME_KEY, state.theme);
  state.moreOpen = false;
  render();
}

function doBackup() {
  const blob = new Blob([JSON.stringify({ app: 'Noor', version: 2, poems: state.poems }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'noor-anthology.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
  state.moreOpen = false;
  render();
  toast('Exported Noor anthology JSON');
}

function wireEvents() {
  document.getElementById('theme-btn')?.addEventListener('click', toggleTheme);
  document.getElementById('m-theme-btn')?.addEventListener('click', toggleTheme);

  document.getElementById('more-btn')?.addEventListener('click', e => {
    e.stopPropagation();
    state.moreOpen = !state.moreOpen;
    render();
  });

  if (!state.activeId) {
    document.getElementById('new-poem-btn')?.addEventListener('click', createPoem);
    document.getElementById('mobile-new-btn')?.addEventListener('click', createPoem);
    document.getElementById('empty-new-btn')?.addEventListener('click', createPoem);

    const searchIn = document.getElementById('gallery-search');
    searchIn?.addEventListener('input', e => {
      state.search = e.target.value;
      const pos = e.target.selectionStart;
      render();
      const next = document.getElementById('gallery-search');
      if (next) { next.focus(); next.setSelectionRange(pos, pos); }
    });

    document.querySelectorAll('[data-mood]').forEach(btn => {
      btn.addEventListener('click', () => { state.moodFilter = btn.dataset.mood; render(); });
    });

    document.querySelectorAll('[data-open]').forEach(card => {
      card.addEventListener('click', () => openPoem(card.dataset.open));
    });

    document.getElementById('backup-btn')?.addEventListener('click', doBackup);
    document.getElementById('m-backup-btn')?.addEventListener('click', doBackup);

    const impIn = document.getElementById('import-file');
    const triggerImport = () => { state.moreOpen = false; impIn?.click(); };
    document.getElementById('import-btn')?.addEventListener('click', triggerImport);
    document.getElementById('m-import-btn')?.addEventListener('click', triggerImport);
    impIn?.addEventListener('change', async e => {
      const file = e.target.files?.[0];
      if (!file) return;
      try {
        const parsed = JSON.parse(await file.text());
        const arr = Array.isArray(parsed) ? parsed : parsed?.poems;
        if (!Array.isArray(arr)) throw new Error('Invalid file');
        const byId = new Map(state.poems.map(p => [p.id, p]));
        let added = 0;
        for (const item of arr) {
          if (item && typeof item === 'object' && item.id) {
            if (!byId.has(item.id)) added++;
            byId.set(item.id, item);
          }
        }
        state.poems = Array.from(byId.values()).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        savePoems(state.poems);
        render();
        toast(`Imported anthology (${added} new)`);
      } catch {
        toast('Could not read that JSON file');
      }
      e.target.value = '';
    });
    return;
  }

  // Studio events
  const poem = getActivePoem();
  if (!poem) return;

  autoSizeTextarea();
  wireDraggableTextbox(poem);

  document.getElementById('back-gallery-btn')?.addEventListener('click', () => {
    state.activeId = null;
    state.mobileSheetOpen = false;
    state.moreOpen = false;
    state.editingRich = false;
    render();
  });

  document.getElementById('focus-btn')?.addEventListener('click', () => {
    state.focusMode = !state.focusMode;
    render();
  });

  const doShuffle = () => {
    const pr = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    state.moreOpen = false;
    state.editingRich = false;
    patchActive({
      bgMode: pr.bgMode,
      painting: pr.painting,
      layout: pr.layout,
      textStyle: pr.textStyle || 'plain',
      titleStyle: pr.titleStyle || 'classic',
      texture: pr.texture || 'grain',
      font: pr.font,
      frame: pr.frame,
      align: pr.align,
      wash: pr.wash,
      textX: 0,
      textY: 0
    });
    const pt = ARTWORKS.find(a => a.id === pr.painting);
    if (pt) state.artSub = pt.grp;
    render();
    toast('Tried a fresh pairing');
  };
  document.getElementById('shuffle-btn')?.addEventListener('click', doShuffle);
  document.getElementById('m-shuffle-btn')?.addEventListener('click', doShuffle);

  document.getElementById('mode-single-btn')?.addEventListener('click', () => {
    if (poem.carousel) patchActive({ carousel: false });
  });
  document.getElementById('mode-carousel-btn')?.addEventListener('click', () => {
    state.slideIdx = 0;
    state.mobileSheetOpen = false;
    state.editingRich = false;
    patchActive({ carousel: true });
  });
  document.getElementById('edit-full-btn')?.addEventListener('click', () => {
    patchActive({ carousel: false });
    setTimeout(() => document.getElementById('poem-body-in')?.focus(), 30);
  });

  document.getElementById('prev-slide-btn')?.addEventListener('click', () => {
    if (state.slideIdx > 0) { state.slideIdx--; render(); }
  });
  document.getElementById('next-slide-btn')?.addEventListener('click', () => {
    state.slideIdx++;
    render();
  });
  document.querySelectorAll('[data-slide]').forEach(dot => {
    dot.addEventListener('click', () => { state.slideIdx = Number(dot.dataset.slide); render(); });
  });

  const doCopy = async () => {
    state.moreOpen = false;
    const clean = `${poem.title ? poem.title + '\n\n' : ''}${stripEmphasis(String(poem.body || '').replace(/^\s*[-—]{3,}\s*$/gm, '').trim())}${poem.sign ? '\n\n' + poem.sign : ''}`;
    try {
      await navigator.clipboard.writeText(clean);
      render();
      toast('Copied poem text');
    } catch {
      render();
      toast('Copy failed — select text directly');
    }
  };
  document.getElementById('copy-btn')?.addEventListener('click', doCopy);
  document.getElementById('m-copy-btn')?.addEventListener('click', doCopy);

  document.getElementById('export-btn')?.addEventListener('click', async () => {
    if (state.exporting) return;
    state.exporting = true;
    state.moreOpen = false;
    render();
    try {
      const st = resolveStyle(poem);
      if (st.carousel) {
        const n = await exportCarouselPNGs(poem);
        toast(`Saved ${n}-slide high-res carousel PNGs`);
      } else {
        await exportPoemPNG(poem);
        toast(st.ratio === 'auto' ? 'Saved full-length Long Page PNG' : 'Saved high-res poster PNG');
      }
    } catch (err) {
      console.error(err);
      toast('Export failed — please try again');
    } finally {
      state.exporting = false;
      render();
    }
  });

  // Live direct editing
  document.getElementById('poem-title-in')?.addEventListener('input', e => {
    patchActive({ title: e.target.value }, { rerender: false });
  });
  document.getElementById('poem-body-in')?.addEventListener('input', e => {
    patchActive({ body: e.target.value }, { rerender: false });
    liveUpdateMetricsAndScale(poem);
  });

  // Tap-to-edit rich views (Word Cut-Out, Line Cut-Out, Drop Cap, Inline Emphasis)
  document.getElementById('rich-tap-edit')?.addEventListener('click', () => {
    state.editingRich = true;
    render();
    const ta = document.getElementById('poem-body-in');
    if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
  });
  if (state.editingRich) {
    const finishRich = () => {
      setTimeout(() => {
        const ae = document.activeElement;
        if (ae && (ae.id === 'poem-title-in' || ae.id === 'poem-body-in')) return;
        if (state.editingRich) { state.editingRich = false; render(); }
      }, 130);
    };
    document.getElementById('poem-body-in')?.addEventListener('blur', finishRich);
    document.getElementById('poem-title-in')?.addEventListener('blur', finishRich);
  }

  // Mobile iOS Bottom Dock & Sheet controls
  document.querySelectorAll('[data-docktab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tb = btn.dataset.docktab;
      state.moreOpen = false;
      if (state.mobileSheetOpen && state.railTab === tb) {
        state.mobileSheetOpen = false;
      } else {
        state.railTab = tb;
        state.mobileSheetOpen = true;
      }
      render();
    });
  });
  const closeSheet = () => { state.mobileSheetOpen = false; render(); };
  document.getElementById('sheet-scrim')?.addEventListener('click', closeSheet);
  document.getElementById('sheet-done-btn')?.addEventListener('click', closeSheet);
  document.getElementById('sheet-grabber')?.addEventListener('click', closeSheet);

  // Desktop Rail tabs
  document.querySelectorAll('[data-railtab]').forEach(btn => {
    btn.addEventListener('click', () => { state.railTab = btn.dataset.railtab; render(); });
  });
  document.querySelectorAll('[data-artsub]').forEach(btn => {
    btn.addEventListener('click', () => { state.artSub = btn.dataset.artsub; render(); });
  });
  document.querySelectorAll('[data-art]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pt = ARTWORKS.find(a => a.id === btn.dataset.art);
      if (!pt) return;
      state.editingRich = false;
      const nextPatch = {
        bgMode: 'art',
        painting: pt.id,
        layout: pt.defLayout || 'overlay',
        textStyle: pt.defTextStyle || 'plain',
        textX: 0,
        textY: 0
      };
      if (pt.defLayout === 'below') nextPatch.align = 'center';
      if (pt.defTexture) nextPatch.texture = pt.defTexture;
      if (pt.defTitleStyle) nextPatch.titleStyle = pt.defTitleStyle;
      patchActive(nextPatch);
    });
  });
  document.querySelectorAll('[data-paper]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.paper;
      const patch = { bgMode: 'solid', paper: id, layout: 'overlay' };
      if (id === 'raw-kraft') patch.texture = 'kraft';
      if (id === 'handmade-cotton') patch.texture = 'cotton';
      patchActive(patch);
    });
  });
  document.querySelectorAll('[data-layout]').forEach(btn => {
    btn.addEventListener('click', () => patchActive({ layout: btn.dataset.layout, textX: 0, textY: 0 }));
  });
  document.getElementById('wash-range')?.addEventListener('input', e => {
    patchActive({ wash: Number(e.target.value) });
  });

  const photoIn = document.getElementById('photo-file-in');
  document.getElementById('pick-photo-btn')?.addEventListener('click', () => photoIn?.click());
  photoIn?.addEventListener('change', e => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      patchActive({ bgMode: 'photo', photo: String(reader.result || ''), layout: 'overlay' });
      toast('Background photo applied');
    };
    reader.readAsDataURL(file);
  });
  document.querySelectorAll('[data-photodark]').forEach(btn => {
    btn.addEventListener('click', () => patchActive({ bgMode: 'photo', photoDark: btn.dataset.photodark === '1' }));
  });

  document.querySelectorAll('[data-fontcat]').forEach(btn => {
    btn.addEventListener('click', () => { state.fontCat = btn.dataset.fontcat; render(); });
  });
  document.querySelectorAll('[data-font]').forEach(btn => {
    btn.addEventListener('click', () => patchActive({ font: btn.dataset.font }));
  });

  // Style customisations
  document.querySelectorAll('[data-titlestyle]').forEach(btn => {
    btn.addEventListener('click', () => { state.editingRich = false; patchActive({ titleStyle: btn.dataset.titlestyle }); });
  });
  document.querySelectorAll('[data-textstyle]').forEach(btn => {
    btn.addEventListener('click', () => { state.editingRich = false; patchActive({ textStyle: btn.dataset.textstyle }); });
  });
  document.getElementById('reset-pos-btn')?.addEventListener('click', () => {
    patchActive({ textX: 0, textY: 0 });
    toast('Centered textbox');
  });
  document.querySelectorAll('[data-ink]').forEach(btn => {
    btn.addEventListener('click', () => patchActive({ inkColor: btn.dataset.ink }));
  });
  document.querySelectorAll('[data-texture]').forEach(btn => {
    btn.addEventListener('click', () => patchActive({ texture: btn.dataset.texture }));
  });
  document.querySelectorAll('[data-rhythm]').forEach(btn => {
    btn.addEventListener('click', () => patchActive({ rhythm: btn.dataset.rhythm }));
  });
  document.querySelectorAll('[data-textsize]').forEach(btn => {
    btn.addEventListener('click', () => patchActive({ textSize: btn.dataset.textsize }));
  });
  document.querySelectorAll('[data-ratio]').forEach(btn => {
    btn.addEventListener('click', () => {
      const r = btn.dataset.ratio;
      patchActive({ ratio: r, carousel: r === 'auto' ? false : poem.carousel });
    });
  });
  document.querySelectorAll('[data-frame]').forEach(btn => {
    btn.addEventListener('click', () => patchActive({ frame: btn.dataset.frame }));
  });
  document.querySelectorAll('[data-align]').forEach(btn => {
    btn.addEventListener('click', () => patchActive({ align: btn.dataset.align }));
  });
  document.getElementById('sign-in')?.addEventListener('input', e => {
    patchActive({ sign: e.target.value }, { rerender: false });
    const sEl = document.querySelector('.poem-sign');
    if (sEl) sEl.textContent = e.target.value;
    else render();
  });
  document.getElementById('page-in')?.addEventListener('input', e => {
    patchActive({ pageNo: e.target.value }, { rerender: false });
    const bEl = document.querySelector('.poem-book-bot');
    if (bEl && !poem.carousel) bEl.textContent = e.target.value.trim() ? `— ${e.target.value.trim()} —` : '✦';
  });
  document.querySelectorAll('[data-setmood]').forEach(btn => {
    btn.addEventListener('click', () => {
      const md = btn.dataset.setmood;
      patchActive({ mood: poem.mood === md ? '' : md });
    });
  });

  // Write tab — emphasis wrap helpers + break + rhyme + word banks
  document.querySelectorAll('[data-wrap]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mk = btn.dataset.wrap;
      const lines = String(poem.body || '').split('\n');
      const idx = lines.length - 1;
      const last = lines[idx].trim();
      lines[idx] = last ? `${mk}${last}${mk}` : `${mk}emphasized line${mk}`;
      state.editingRich = false;
      patchActive({ body: lines.join('\n') });
      toast('Styled last line');
    });
  });
  document.getElementById('insert-break-btn')?.addEventListener('click', () => {
    const cur = String(poem.body || '').trimEnd();
    patchActive({ body: cur ? `${cur}\n\n---\n\n` : '---\n\n', carousel: false });
    toast('Inserted manual slide break (---)');
  });
  const rhymeIn = document.getElementById('rhyme-in');
  rhymeIn?.addEventListener('input', e => {
    state.rhymeQuery = e.target.value;
    const pos = e.target.selectionStart;
    render();
    const next = document.getElementById('rhyme-in');
    if (next) { next.focus(); next.setSelectionRange(pos, pos); }
  });
  document.querySelectorAll('[data-insert]').forEach(chip => {
    chip.addEventListener('click', () => {
      const wd = chip.dataset.insert;
      const cur = String(poem.body || '');
      const sep = cur && !/[\s\n]$/.test(cur) ? ' ' : '';
      patchActive({ body: cur + sep + wd });
      toast(`Inserted “${wd}”`, 1400);
    });
  });

  const doArchive = () => {
    state.moreOpen = false;
    const next = !poem.archived;
    patchActive({ archived: next });
    toast(next ? 'Moved to Archive' : 'Restored to Anthology');
    if (next) { state.activeId = null; state.mobileSheetOpen = false; render(); }
  };
  const doDelete = () => {
    state.moreOpen = false;
    if (!confirm(`Delete “${poem.title || 'Untitled poem'}”?`)) return;
    state.poems = state.poems.filter(x => x.id !== poem.id);
    savePoems(state.poems);
    state.activeId = null;
    state.mobileSheetOpen = false;
    render();
    toast('Poem deleted');
  };
  document.getElementById('archive-btn')?.addEventListener('click', doArchive);
  document.getElementById('m-archive-btn')?.addEventListener('click', doArchive);
  document.getElementById('delete-btn')?.addEventListener('click', doDelete);
  document.getElementById('m-delete-btn')?.addEventListener('click', doDelete);
}

function render() {
  const root = document.getElementById('app');
  if (!root) return;
  const poem = getActivePoem();
  root.innerHTML = poem ? renderStudio(poem) : renderGallery();
  wireEvents();
}

document.addEventListener('click', () => {
  if (state.moreOpen) { state.moreOpen = false; render(); }
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (state.moreOpen) { state.moreOpen = false; render(); return; }
    if (state.mobileSheetOpen) { state.mobileSheetOpen = false; render(); return; }
    if (state.activeId && state.focusMode) { state.focusMode = false; render(); }
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && !state.activeId) {
    e.preventDefault();
    document.getElementById('gallery-search')?.focus();
  }
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

render();
