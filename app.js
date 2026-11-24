import {
  ARTWORKS, PAPERS, FONTS, FONT_CATS, LAYOUTS, FRAMES, RATIOS, TEXT_SIZES, TEXT_STYLES,
  TITLE_STYLES, TEXTURES, INK_SWATCHES, RHYTHMS, MOODS,
  PRESETS, WORD_BANKS, STARTER_POEMS,
  findRhymes, poemMetrics, computeTypeScale, paginatePoem, resolveStyle
} from './data.js';
import { exportPoemPNG, exportCarouselPNGs } from './export.js';
import { morph } from './morph.js';

// Storage keys predate the current name. Keep them: renaming would orphan saved poems.
const STORAGE_KEY = 'noor.poems.v1';
const THEME_KEY = 'noor.theme';
const LEGACY_KEYS = ['folio.poems.v1'];
const LEGACY_THEME_KEYS = ['folio.theme'];

// Bulbul: a comma that is also a songbird; the marks on its wing are lines of verse.
const SYMBOL_SVG = `<svg class="brand-symbol" viewBox="38 6 212 242" aria-hidden="true"><path class="brand-body" fill-rule="evenodd" d="M106 10 C114 30 130 40 150 42 C176 45 196 60 204 80 C216 80 230 84 244 92 C232 98 220 102 209 103 C216 106 224 112 230 122 C220 122 212 120 206 117 C206 182 140 236 42 244 C84 220 108 192 113 160 C92 146 82 122 84 94 C86 62 94 34 106 10 Z M163 76 A9 9 0 1 1 181 76 A9 9 0 1 1 163 76 Z M187 157 C173 186 150 206 116 220 C146 200 164 180 176 152 Z M160 154 C150 176 136 192 112 206 C130 188 141 172 149 150 Z"/><path class="brand-cheek" d="M186 98 C190 120 172 138 142 136 C146 114 162 98 186 98 Z"/></svg>`;
const LOCKUP_SVG = `<svg class="brand-lockup-svg" viewBox="38 6 854 242" role="img" aria-label="Bulbul"><path class="brand-body" fill-rule="evenodd" d="M106 10 C114 30 130 40 150 42 C176 45 196 60 204 80 C216 80 230 84 244 92 C232 98 220 102 209 103 C216 106 224 112 230 122 C220 122 212 120 206 117 C206 182 140 236 42 244 C84 220 108 192 113 160 C92 146 82 122 84 94 C86 62 94 34 106 10 Z M163 76 A9 9 0 1 1 181 76 A9 9 0 1 1 163 76 Z M187 157 C173 186 150 206 116 220 C146 200 164 180 176 152 Z M160 154 C150 176 136 192 112 206 C130 188 141 172 149 150 Z"/><path class="brand-cheek" d="M186 98 C190 120 172 138 142 136 C146 114 162 98 186 98 Z"/><g class="brand-body" transform="translate(268 34) scale(.92)"><g transform="translate(0 0)"><path fill-rule="evenodd" d="M0 54 L36 38 V116 C46 105 58 100 74 100 C106 100 128 121 128 151 C128 182 105 203 72 203 C56 203 44 198 34 189 L20 200 H0 Z M36 138 V170 C40 184 49 191 61 191 C80 191 91 176 91 151 C91 127 80 113 63 113 C51 113 41 122 36 138 Z"/></g><g transform="translate(144 0)"><path d="M0 116 L36 102 V160 C36 177 43 185 56 185 C68 185 78 178 85 166 V116 L121 102 V200 H88 L86 184 C76 197 62 203 45 203 C16 203 0 187 0 157 Z"/></g><g transform="translate(283 0)"><path d="M0 54 L36 38 V200 H0 Z"/></g><g transform="translate(337 0)"><path fill-rule="evenodd" d="M0 54 L36 38 V116 C46 105 58 100 74 100 C106 100 128 121 128 151 C128 182 105 203 72 203 C56 203 44 198 34 189 L20 200 H0 Z M36 138 V170 C40 184 49 191 61 191 C80 191 91 176 91 151 C91 127 80 113 63 113 C51 113 41 122 36 138 Z"/></g><g transform="translate(481 0)"><path d="M0 116 L36 102 V160 C36 177 43 185 56 185 C68 185 78 178 85 166 V116 L121 102 V200 H88 L86 184 C76 197 62 203 45 203 C16 203 0 187 0 157 Z"/></g><g transform="translate(620 0)"><path d="M0 54 L36 38 V200 H0 Z"/></g></g></svg>`;

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
    for (const key of [STORAGE_KEY, ...LEGACY_KEYS]) {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const arr = JSON.parse(raw);
      if (Array.isArray(arr) && arr.length) return arr;
    }
  } catch {}
  const seeded = structuredClone(STARTER_POEMS);
  savePoems(seeded);
  return seeded;
}

let saveWarned = false;
function savePoems(poems) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(poems));
    saveWarned = false;
  } catch {
    if (saveWarned) return;
    saveWarned = true;
    toast('Storage is full, so this change isn’t saved. Try a smaller photo.', 5000);
  }
}

function initTheme() {
  const saved = [THEME_KEY, ...LEGACY_THEME_KEYS].map(k => localStorage.getItem(k)).find(Boolean) || 'light';
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
  exporting: false,
  galleryScroll: 0
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

function patchActive(patch, { rerender = true, fade = true } = {}) {
  const p = getActivePoem();
  if (!p) return;
  Object.assign(p, patch, { updatedAt: Date.now() });
  savePoems(state.poems);
  if (rerender) render({ fade });
}

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

// Cross-fade between the anthology and the studio, carrying the poem from its card to the sheet.
function transitionView(update, heroBefore, heroAfter) {
  if (!document.startViewTransition || reducedMotion.matches || document.hidden) { update(); return; }
  const from = heroBefore?.();
  if (from) from.style.viewTransitionName = 'poem-hero';
  let to = null;
  const vt = document.startViewTransition(() => {
    if (from) from.style.viewTransitionName = '';
    update();
    to = heroAfter?.();
    if (to) to.style.viewTransitionName = 'poem-hero';
  });
  vt.ready.catch(() => {}); // rejects when a newer transition takes over
  vt.finished.catch(() => {}).finally(() => { if (to) to.style.viewTransitionName = ''; });
}

const cardFrameOf = id => document.querySelector(`[data-open="${CSS.escape(id)}"] .poem-card-frame`);
const sheetHolder = () => document.getElementById('sheet-holder');

function openPoem(id, { push = true } = {}) {
  const p = state.poems.find(x => x.id === id);
  if (!p) return;
  if (!state.activeId) state.galleryScroll = window.scrollY;
  transitionView(() => {
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
  }, () => cardFrameOf(id), sheetHolder);
  if (push) history.pushState({ inApp: true }, '', '#/' + encodeURIComponent(id));
}

function showGallery() {
  const id = state.activeId;
  if (!id) return;
  transitionView(() => {
    state.activeId = null;
    state.mobileSheetOpen = false;
    state.moreOpen = false;
    state.editingRich = false;
    render();
    window.scrollTo(0, state.galleryScroll);
  }, sheetHolder, () => cardFrameOf(id));
}

function closeStudio() {
  showGallery();
  if (history.state?.inApp) history.back();
  else history.replaceState(null, '', location.pathname + location.search);
}

function routeId() {
  const m = location.hash.match(/^#\/(.+)$/);
  const id = m ? decodeURIComponent(m[1]) : null;
  return id && state.poems.some(p => p.id === id) ? id : null;
}

// Wait briefly for an image or font so a style change swaps in finished, not half-loaded.
const within = (ms, promise) => Promise.race([promise.catch(() => {}), new Promise(r => setTimeout(r, ms))]);
function imageReady(src) {
  if (!src) return Promise.resolve();
  const img = new Image();
  img.src = src;
  return within(600, img.decode());
}
function fontReady(fontId, text) {
  const fn = FONTS.find(f => f.id === fontId);
  if (!fn || !document.fonts?.load) return Promise.resolve();
  return within(600, Promise.all([fn.titleW, fn.bodyW].map(w => document.fonts.load(`${w} 20px ${fn.fam}`, text || 'a'))));
}

// Latest pick wins when several are clicked in quick succession.
let pickToken = 0;
async function patchWhenReady(ready, patch, after) {
  const token = ++pickToken;
  const id = state.activeId;
  await ready;
  if (token !== pickToken || state.activeId !== id) return;
  patchActive(patch);
  after?.();
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
  const textCol = `<div ${editable ? 'id="movable-text-col" ' : ''}class="poem-text-col al-${textAlign}${effLayout === 'overlay' ? ' poem-overlay-pad' : ''}${tsCls}${hasOff ? ' has-offset' : ''}" style="${txStyle}">${dragHandle}${wrappedInner}</div>`;

  const sideArtImg = imgSrc
    ? `<img decoding="sync" class="poem-side-img${imgBlend ? ' blend-mul' : ''}${imgContain ? ' is-contain' : ''}${imgVignette ? ' is-vignette' : ''}" src="${esc(imgSrc)}" alt="${esc(st.painting.name || 'Poem artwork')}" style="${imgFilter}">`
    : '';

  const bgOverlayHTML = (imgSrc && effLayout === 'overlay')
    ? `<img decoding="sync" class="poem-bg-img${imgBlend ? ' blend-mul' : ''}" src="${esc(imgSrc)}" alt="" style="${imgFilter}">${washAlpha > 0.005 ? `<div class="poem-wash" style="background:${washBg}"></div>` : ''}`
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
    <div ${editable || slide ? 'id="active-poem-sheet" ' : ''}class="poem-sheet ${ratioClass(effRatio)} fr-${st.frame}${isMat ? ' is-mat' : ''}" style="${outerStyle}">
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
        ${SYMBOL_SVG}
        <h2>An open page</h2>
        <p>${q ? `Nothing matches “${esc(state.search.trim())}”.` : state.moodFilter !== 'All' ? 'No poems in this collection yet.' : 'Begin your anthology with your first poem.'}</p>
        <button type="button" class="btn primary" id="empty-new-btn">${ICONS.plus} Write a poem</button>
      </div>`;

  const galleryMenu = state.moreOpen ? `
    <div class="ios-menu" role="menu">
      <button type="button" class="ios-menu-item" id="m-backup-btn" role="menuitem"><span>Backup JSON</span>${ICONS.download}</button>
      <button type="button" class="ios-menu-item" id="m-import-btn" role="menuitem"><span>Import JSON</span>${ICONS.upload}</button>
    </div>
  ` : '';

  return `
    <div class="shell" data-view="gallery">
      <div class="gallery-head">
      <header class="topbar">
        <div class="brand">
          <h1 class="brand-mark">${LOCKUP_SVG}</h1>
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

        <div class="filter-bar">
          <div class="mood-pills" role="tablist" aria-label="Filter poems by collection">
            ${pills.map(md => `<button type="button" role="tab" aria-selected="${state.moodFilter === md}" class="pill${state.moodFilter === md ? ' on' : ''}" data-mood="${esc(md)}">${esc(md)}${md === 'Archived' ? ` (${archivedCount})` : ''}</button>`).join('')}
          </div>
          <span class="gallery-stat">${filtered.length === activeCount || isArchTab ? `${filtered.length} ${filtered.length === 1 ? 'poem' : 'poems'}` : `${filtered.length} of ${activeCount}`}</span>
        </div>
      </div>
      <main>
        ${cardsHTML}
      </main>
    </div>

    <div class="mobile-fab-wrap" data-view="gallery-fab">
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
      picker = `<div class="paint-grid" data-grid="${state.artSub}">${grps[state.artSub].map(pt => {
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
      picker = `<div class="paper-grid" data-grid="solid">${PAPERS.map(pa => `
        <button type="button" class="paper-btn${st.bgMode === 'solid' && st.paper.id === pa.id ? ' on' : ''}" data-paper="${esc(pa.id)}">
          <span class="paper-sw" style="background:linear-gradient(135deg,${pa.bg},${pa.bg2});color:${pa.ink};border-color:${pa.acc}">Aa</span>
          <span class="paper-nm">${esc(pa.name)}</span>
        </button>
      `).join('')}</div>`;
    } else {
      picker = `
        <div class="photo-panel" data-grid="photo">
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

    const canWash = st.bgMode !== 'solid' && st.layout === 'overlay';
    const placementHTML = st.bgMode !== 'solid' ? `
      <div class="placement">
        <div class="sec-lbl">Placement</div>
        <div class="pills fill">
          ${LAYOUTS.map(ly => `<button type="button" class="choice-pill${st.layout === ly.id ? ' on' : ''}" data-layout="${ly.id}">${esc(ly.label)}</button>`).join('')}
        </div>
        <label class="range-row${canWash ? '' : ' is-off'}">
          <span>Softness</span>
          <input id="wash-range" class="range-in" type="range" min="0" max="65" value="${st.wash}" ${canWash ? '' : 'disabled'} aria-label="Backdrop softness">
          <output>${canWash ? st.wash + '%' : 'Full canvas only'}</output>
        </label>
      </div>
    ` : '';

    railContent = `
      <div class="subtabs" role="group" aria-label="Categories">${subTabs.map(t => `<button type="button" class="subtab${state.artSub === t.id ? ' on' : ''}" data-artsub="${t.id}">${esc(t.label)}</button>`).join('')}</div>
      ${placementHTML}
      ${picker}
    `;
  } else if (state.railTab === 'fonts') {
    const shown = state.fontCat === 'all' ? FONTS : FONTS.filter(f => f.cat === state.fontCat);
    railContent = `
      <div class="subtabs" role="group" aria-label="Categories">${FONT_CATS.map(fc => `<button type="button" class="subtab${state.fontCat === fc.id ? ' on' : ''}" data-fontcat="${fc.id}">${esc(fc.label)}</button>`).join('')}</div>
      <div class="font-list" data-grid="font-${state.fontCat}">
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
    <div class="studio${state.focusMode ? ' is-focus' : ''}${state.mobileSheetOpen ? ' has-sheet' : ''}" data-view="studio-${esc(poem.id)}">
      <div class="studio-stage">
        <div class="stage-bar">
          <div class="stage-bar-left">
            <button type="button" class="btn sm ghost" id="back-gallery-btn" style="padding-left:6px;" aria-label="Back to all poems">${ICONS.back}<span>Poems</span></button>
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
          <div class="sheet-holder" id="sheet-holder">${renderSheetHTML(poem, { editable: !st.carousel, slide: activeSlide })}</div>
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
        <div class="rail-body" data-tabpanel="${state.railTab}">${railContent}</div>
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

/* ---------- Stage measurement ---------- */

const desktopStage = matchMedia('(min-width: 861px)');
const autoSizesNatively = CSS.supports('field-sizing', 'content');

function autoSizeTextarea() {
  const ta = document.getElementById('poem-body-in');
  if (!ta || autoSizesNatively) return;
  // Collapsing to measure would clamp the stage's scroll, so put it back afterwards.
  const stage = document.querySelector('.stage-canvas-wrap');
  const top = stage?.scrollTop;
  ta.style.height = 'auto';
  ta.style.height = Math.max(88, ta.scrollHeight) + 'px';
  if (stage && stage.scrollTop !== top) stage.scrollTop = top;
}

const SHEET_W = { 'rat-4-5': 458, 'rat-1-1': 458, 'rat-9-16': 350, 'rat-2-3': 408 };
const SHEET_RATIO = { 'rat-4-5': 4 / 5, 'rat-1-1': 1, 'rat-9-16': 9 / 16, 'rat-2-3': 2 / 3 };

// Size the poster to the space it has on desktop; on phones, lift it clear of the open sheet.
function fitStage() {
  const root = document.documentElement.style;
  const stage = document.querySelector('.stage-canvas-wrap');
  const sheet = document.getElementById('active-poem-sheet');
  if (!stage || !sheet) return;
  let zoom = 1;
  let lift = 1;
  let rise = 0;
  const cls = Object.keys(SHEET_W).find(c => sheet.classList.contains(c));
  if (desktopStage.matches) {
    if (cls) {
      const cs = getComputedStyle(stage);
      const nav = stage.querySelector('.carousel-nav');
      const h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (nav ? nav.offsetHeight + 14 : 0);
      const w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const baseW = SHEET_W[cls];
      zoom = Math.max(0.7, Math.min(1.6, w / baseW, h / (baseW / SHEET_RATIO[cls])));
    }
  } else if (state.mobileSheetOpen && cls) {
    const rail = document.querySelector('.studio-rail');
    const free = stage.clientHeight - (rail?.offsetHeight || 0) - 24;
    lift = Math.max(0.42, Math.min(1, free / sheet.offsetHeight));
    rise = 12 - (sheetHolder().offsetTop - stage.scrollTop);
  }
  root.setProperty('--stage-zoom', zoom.toFixed(3));
  root.setProperty('--stage-lift', lift.toFixed(3));
  root.setProperty('--stage-rise', Math.round(rise) + 'px');
}

const stageObserver = new ResizeObserver(() => fitStage());

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

/* ---------- Rendering ---------- */

// A copy of the current sheet, laid over the new one and faded away.
function captureGhost() {
  const sheet = document.getElementById('active-poem-sheet');
  if (!sheet || reducedMotion.matches || document.hidden) return null;
  const ghost = sheet.cloneNode(true);
  const ta = sheet.querySelector('textarea');
  if (ta) ghost.querySelector('textarea').value = ta.value;
  const inp = sheet.querySelector('input');
  if (inp) ghost.querySelector('input').value = inp.value;
  ghost.removeAttribute('id');
  ghost.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
  ghost.setAttribute('data-morph-ignore', '');
  ghost.setAttribute('aria-hidden', 'true');
  ghost.inert = true;
  ghost.classList.add('sheet-ghost');
  return { ghost, sheet, before: sheet.outerHTML };
}

function playGhost(cap) {
  const holder = sheetHolder();
  if (!holder || !cap.sheet.isConnected || cap.sheet.outerHTML === cap.before) return;
  holder.querySelectorAll('.sheet-ghost').forEach(n => n.remove());
  holder.appendChild(cap.ghost);
  const done = () => cap.ghost.remove();
  cap.ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-out', fill: 'forwards' }).finished.then(done, done);
  setTimeout(done, 400); // never leave the copy behind if frames stall
}

let observedStage = null;
function render({ fade = false } = {}) {
  const root = document.getElementById('app');
  if (!root) return;
  const poem = getActivePoem();
  const cap = fade && poem ? captureGhost() : null;
  morph(root, poem ? renderStudio(poem) : renderGallery());
  document.title = poem ? `${poem.title || 'Untitled poem'} · Bulbul` : 'Bulbul · Poetry studio';

  const stage = document.querySelector('.stage-canvas-wrap');
  if (stage !== observedStage) {
    stageObserver.disconnect();
    if (stage) stageObserver.observe(stage);
    observedStage = stage;
  }
  if (poem) {
    fitStage();
    autoSizeTextarea();
  }
  if (cap) playGhost(cap);
}

// Re-render the anthology, gliding cards that stay to their new place.
function renderGalleryFlow() {
  const cards = () => Array.from(document.querySelectorAll('.poem-card'));
  if (reducedMotion.matches) { render(); return; }
  const was = new Map(cards().map(c => [c.dataset.open, c.getBoundingClientRect()]));
  render();
  const head = document.querySelector('.gallery-head');
  const grid = document.querySelector('.anthology-grid');
  if (head && grid && grid.getBoundingClientRect().top < head.getBoundingClientRect().bottom) window.scrollTo(0, 0);
  for (const card of cards()) {
    card.getAnimations().forEach(a => a.cancel());
    const from = was.get(card.dataset.open);
    const to = card.getBoundingClientRect();
    if (!from) {
      card.animate([{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 240, easing: 'ease-out' });
      continue;
    }
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    card.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(0.32, 0.72, 0, 1)' });
  }
}

// Bring the selected category into view inside its own scroller, without moving anything else.
function revealSubtab() {
  const on = document.querySelector('.subtab.on');
  const bar = on?.parentElement;
  if (!bar) return;
  bar.scrollTo({ left: on.offsetLeft - (bar.clientWidth - on.offsetWidth) / 2, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

/* ---------- Actions ---------- */

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = state.theme;
  localStorage.setItem(THEME_KEY, state.theme);
  state.moreOpen = false;
  render();
}

function doBackup() {
  const blob = new Blob([JSON.stringify({ app: 'Bulbul', version: 2, poems: state.poems }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'bulbul-anthology.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
  state.moreOpen = false;
  render();
  toast('Anthology backup downloaded');
}

function triggerImport() {
  state.moreOpen = false;
  render();
  document.getElementById('import-file')?.click();
}

async function importFile(input) {
  const file = input.files?.[0];
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
  input.value = '';
}

function doShuffle() {
  const pr = PRESETS[Math.floor(Math.random() * PRESETS.length)];
  state.moreOpen = false;
  state.editingRich = false;
  const pt = ARTWORKS.find(a => a.id === pr.painting);
  render();
  patchWhenReady(Promise.all([imageReady(pt?.src), fontReady(pr.font, getActivePoem()?.body)]), {
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
  }, () => {
    if (pt && state.artSub !== pt.grp) { state.artSub = pt.grp; render(); revealSubtab(); }
    toast('Tried a fresh pairing');
  });
}

async function doCopy() {
  const poem = getActivePoem();
  state.moreOpen = false;
  const clean = `${poem.title ? poem.title + '\n\n' : ''}${stripEmphasis(String(poem.body || '').replace(/^\s*[-—]{3,}\s*$/gm, '').trim())}${poem.sign ? '\n\n' + poem.sign : ''}`;
  let msg = 'Copied poem text';
  try { await navigator.clipboard.writeText(clean); } catch { msg = 'Copy failed. Select the text directly.'; }
  render();
  toast(msg);
}

async function doExport() {
  const poem = getActivePoem();
  if (state.exporting || !poem) return;
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
    toast('Export failed. Please try again.');
  } finally {
    state.exporting = false;
    render();
  }
}

function pickArt(id) {
  const pt = ARTWORKS.find(a => a.id === id);
  if (!pt) return;
  state.editingRich = false;
  const patch = {
    bgMode: 'art',
    painting: pt.id,
    layout: pt.defLayout || 'overlay',
    textStyle: pt.defTextStyle || 'plain',
    textX: 0,
    textY: 0
  };
  if (pt.defLayout === 'below') patch.align = 'center';
  if (pt.defTexture) patch.texture = pt.defTexture;
  if (pt.defTitleStyle) patch.titleStyle = pt.defTitleStyle;
  patchWhenReady(imageReady(pt.src), patch);
}

function pickPaper(id) {
  const patch = { bgMode: 'solid', paper: id, layout: 'overlay' };
  if (id === 'raw-kraft') patch.texture = 'kraft';
  if (id === 'handmade-cotton') patch.texture = 'cotton';
  patchActive(patch);
}

function pickPhoto(input) {
  const file = input.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    patchActive({ bgMode: 'photo', photo: String(reader.result || ''), layout: 'overlay' });
    toast('Background photo applied');
  };
  reader.readAsDataURL(file);
  input.value = '';
}

function wrapLastLine(mk) {
  const lines = String(getActivePoem().body || '').split('\n');
  const idx = lines.length - 1;
  const last = lines[idx].trim();
  lines[idx] = last ? `${mk}${last}${mk}` : `${mk}emphasized line${mk}`;
  state.editingRich = false;
  patchActive({ body: lines.join('\n') });
  toast('Styled last line');
}

function insertWord(wd) {
  const cur = String(getActivePoem().body || '');
  const sep = cur && !/[\s\n]$/.test(cur) ? ' ' : '';
  patchActive({ body: cur + sep + wd }, { fade: false });
  toast(`Inserted “${wd}”`, 1400);
}

function doArchive() {
  const next = !getActivePoem().archived;
  state.moreOpen = false;
  patchActive({ archived: next });
  toast(next ? 'Moved to Archive' : 'Restored to your poems');
  if (next) closeStudio();
}

function doDelete() {
  const poem = getActivePoem();
  state.moreOpen = false;
  if (!confirm(`Delete “${poem.title || 'Untitled poem'}”?`)) { render(); return; }
  state.poems = state.poems.filter(x => x.id !== poem.id);
  savePoems(state.poems);
  closeStudio();
  toast('Poem deleted');
}

function setTab(tab) { state.railTab = tab; render(); revealSubtab(); }
function closeSheet() { state.mobileSheetOpen = false; render(); }
function goToSlide(i) { state.slideIdx = i; render({ fade: true }); }

/* ---------- Events: one set of listeners, delegated from the document ---------- */

const CLICKS = [
  ['#theme-btn, #m-theme-btn', toggleTheme],
  ['#more-btn', () => { state.moreOpen = !state.moreOpen; render(); }],

  // Anthology
  ['#new-poem-btn, #mobile-new-btn, #empty-new-btn', createPoem],
  ['[data-mood]', el => { if (state.moodFilter !== el.dataset.mood) { state.moodFilter = el.dataset.mood; renderGalleryFlow(); } }],
  ['[data-open]', el => openPoem(el.dataset.open)],
  ['#backup-btn, #m-backup-btn', doBackup],
  ['#import-btn, #m-import-btn', triggerImport],

  // Studio bar
  ['#back-gallery-btn', closeStudio],
  ['#focus-btn', () => { state.focusMode = !state.focusMode; render(); }],
  ['#shuffle-btn, #m-shuffle-btn', doShuffle],
  ['#mode-single-btn', () => { if (getActivePoem().carousel) patchActive({ carousel: false }); }],
  ['#mode-carousel-btn', () => {
    if (getActivePoem().carousel) return;
    state.slideIdx = 0;
    state.mobileSheetOpen = false;
    state.editingRich = false;
    patchActive({ carousel: true });
  }],
  ['#edit-full-btn', () => { patchActive({ carousel: false }); document.getElementById('poem-body-in')?.focus(); }],
  ['#prev-slide-btn', () => { if (state.slideIdx > 0) goToSlide(state.slideIdx - 1); }],
  ['#next-slide-btn', () => goToSlide(state.slideIdx + 1)],
  ['[data-slide]', el => goToSlide(Number(el.dataset.slide))],
  ['#copy-btn, #m-copy-btn', doCopy],
  ['#export-btn', doExport],
  ['#archive-btn, #m-archive-btn', doArchive],
  ['#delete-btn, #m-delete-btn', doDelete],

  // Rich views (cut-outs, drop cap, inline emphasis) open for editing on tap
  ['#rich-tap-edit', () => {
    state.editingRich = true;
    render();
    const ta = document.getElementById('poem-body-in');
    if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
  }],

  // Inspector navigation
  ['[data-docktab]', el => {
    const tab = el.dataset.docktab;
    state.moreOpen = false;
    if (state.mobileSheetOpen && state.railTab === tab) { closeSheet(); return; }
    state.mobileSheetOpen = true;
    setTab(tab);
  }],
  ['#sheet-scrim, #sheet-done-btn, #sheet-grabber', closeSheet],
  ['[data-railtab]', el => setTab(el.dataset.railtab)],
  ['[data-artsub]', el => { state.artSub = el.dataset.artsub; render(); revealSubtab(); }],
  ['[data-fontcat]', el => { state.fontCat = el.dataset.fontcat; render(); revealSubtab(); }],

  // Artwork
  ['[data-art]', el => pickArt(el.dataset.art)],
  ['[data-paper]', el => pickPaper(el.dataset.paper)],
  ['[data-layout]', el => patchActive({ layout: el.dataset.layout, textX: 0, textY: 0 })],
  ['#pick-photo-btn', () => document.getElementById('photo-file-in')?.click()],
  ['[data-photodark]', el => patchActive({ bgMode: 'photo', photoDark: el.dataset.photodark === '1' })],

  // Fonts and style
  ['[data-font]', el => patchWhenReady(fontReady(el.dataset.font, getActivePoem().body), { font: el.dataset.font })],
  ['[data-titlestyle]', el => { state.editingRich = false; patchActive({ titleStyle: el.dataset.titlestyle }); }],
  ['[data-textstyle]', el => { state.editingRich = false; patchActive({ textStyle: el.dataset.textstyle }); }],
  ['#reset-pos-btn', () => { patchActive({ textX: 0, textY: 0 }, { fade: false }); toast('Centered textbox'); }],
  ['[data-ink]', el => patchActive({ inkColor: el.dataset.ink })],
  ['[data-texture]', el => patchActive({ texture: el.dataset.texture })],
  ['[data-rhythm]', el => patchActive({ rhythm: el.dataset.rhythm })],
  ['[data-textsize]', el => patchActive({ textSize: el.dataset.textsize })],
  ['[data-ratio]', el => {
    const r = el.dataset.ratio;
    patchActive({ ratio: r, carousel: r === 'auto' ? false : getActivePoem().carousel });
  }],
  ['[data-frame]', el => patchActive({ frame: el.dataset.frame })],
  ['[data-align]', el => patchActive({ align: el.dataset.align })],
  ['[data-setmood]', el => {
    const md = el.dataset.setmood;
    patchActive({ mood: getActivePoem().mood === md ? '' : md }, { fade: false });
  }],

  // Write
  ['[data-wrap]', el => wrapLastLine(el.dataset.wrap)],
  ['#insert-break-btn', () => {
    const cur = String(getActivePoem().body || '').trimEnd();
    patchActive({ body: cur ? `${cur}\n\n---\n\n` : '---\n\n', carousel: false });
    toast('Inserted manual slide break (---)');
  }],
  ['[data-insert]', el => insertWord(el.dataset.insert)]
];

const INPUTS = [
  ['#gallery-search', el => { state.search = el.value; renderGalleryFlow(); }],
  ['#poem-title-in', el => patchActive({ title: el.value }, { rerender: false })],
  ['#poem-body-in', el => {
    patchActive({ body: el.value }, { rerender: false });
    liveUpdateMetricsAndScale(getActivePoem());
  }],
  ['#wash-range', el => patchActive({ wash: Number(el.value) }, { fade: false })],
  ['#sign-in', el => patchActive({ sign: el.value }, { fade: false })],
  ['#page-in', el => patchActive({ pageNo: el.value }, { fade: false })],
  ['#rhyme-in', el => { state.rhymeQuery = el.value; render(); }]
];

const CHANGES = [
  ['#import-file', importFile],
  ['#photo-file-in', pickPhoto]
];

function delegate(type, table) {
  document.addEventListener(type, e => {
    for (const [sel, fn] of table) {
      const el = e.target.closest?.(sel);
      if (!el) continue;
      if (!el.disabled) fn(el, e);
      return;
    }
  });
}

delegate('click', CLICKS);
delegate('input', INPUTS);
delegate('change', CHANGES);

document.addEventListener('click', e => {
  if (state.moreOpen && !e.target.closest?.('.menu-wrap')) { state.moreOpen = false; render(); }
});

// Leaving a tap-to-edit poem returns it to its styled view
document.addEventListener('focusout', e => {
  if (!state.editingRich || !/^poem-(title|body)-in$/.test(e.target.id)) return;
  setTimeout(() => {
    if (/^poem-(title|body)-in$/.test(document.activeElement?.id || '')) return;
    if (state.editingRich) { state.editingRich = false; render(); }
  }, 130);
});

// Drag the textbox by its Move handle
let drag = null;
document.addEventListener('pointerdown', e => {
  const handle = e.target.closest?.('#drag-text-handle');
  const col = document.getElementById('movable-text-col');
  const sheet = document.getElementById('active-poem-sheet');
  const poem = getActivePoem();
  if (!handle || !col || !sheet || !poem) return;
  e.preventDefault();
  handle.setPointerCapture(e.pointerId);
  const baseX = Number.isFinite(poem.textX) ? poem.textX : 0;
  const baseY = Number.isFinite(poem.textY) ? poem.textY : 0;
  drag = { col, sheet, startX: e.clientX, startY: e.clientY, baseX, baseY, x: baseX, y: baseY };
  col.classList.add('is-dragging');
});
document.addEventListener('pointermove', e => {
  if (!drag) return;
  // Offsets are stored as a percentage of the text column, so divide by its on-screen size.
  const rect = drag.col.getBoundingClientRect();
  const clamp = v => Math.max(-44, Math.min(44, Math.round(v)));
  let nx = clamp(drag.baseX + ((e.clientX - drag.startX) / Math.max(1, rect.width)) * 100);
  let ny = clamp(drag.baseY + ((e.clientY - drag.startY) / Math.max(1, rect.height)) * 100);
  // Gentle magnetic snap near center
  if (Math.abs(nx) <= 2) nx = 0;
  if (Math.abs(ny) <= 2) ny = 0;
  drag.x = nx;
  drag.y = ny;
  drag.col.style.setProperty('--tx', nx + '%');
  drag.col.style.setProperty('--ty', ny + '%');
});
function endDrag() {
  if (!drag) return;
  const { col, x, y } = drag;
  drag = null;
  col.classList.remove('is-dragging');
  patchActive({ textX: x, textY: y }, { fade: false });
}
document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', endDrag);

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (state.moreOpen) { state.moreOpen = false; render(); return; }
    if (state.mobileSheetOpen) { closeSheet(); return; }
    if (state.activeId && state.focusMode) { state.focusMode = false; render(); }
  }
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k' && !state.activeId) {
    e.preventDefault();
    document.getElementById('gallery-search')?.focus();
  }
});

// Browser back and forward move between the anthology and a poem
history.scrollRestoration = 'manual';
window.addEventListener('popstate', () => {
  const id = routeId();
  if (id === state.activeId) return;
  if (id) openPoem(id, { push: false });
  else showGallery();
});

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

state.activeId = routeId();
if (state.activeId) {
  const st = resolveStyle(getActivePoem());
  state.artSub = st.bgMode === 'solid' ? 'solid' : st.bgMode === 'photo' ? 'photo' : (st.painting.grp || 'minimal');
}
render();
setTimeout(() => document.getElementById('app')?.setAttribute('data-ready', ''), 700);
