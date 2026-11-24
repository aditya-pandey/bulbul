import {
  ARTWORKS, PAPERS, FONTS, FONT_CATS, LAYOUTS, FRAMES, RATIOS, TEXT_SIZES, TEXT_STYLES,
  TITLE_STYLES, TEXTURES, INK_SWATCHES, RHYTHMS, MOODS, ATMOS, LIGHTS, CHARMS, CHARM_POS,
  LOOKS, LOOK_CATS, lookPatch, isHindi, finishSrc,
  BLOOMS, PERCHES, SPARKS, changedLayers,
  WORD_BANKS, OLD_SAMPLES,
  findRhymes, poemMetrics, computeTypeScale, paginatePoem, resolveStyle
} from './data.js';
import { fitMock, MOCK_W, MOCK_H } from './snapshot.js';
import { initGestures } from './gestures.js';
import { EXAMPLES } from './examples.js';
import { PLATFORMS, platformOf, captionFor, sharePages, poster, mockup, mockStage, BACKDROPS, backdropCSS, copyImage, canShareFiles, shareFiles, downloadPoster } from './share.js';
import { morph } from './morph.js';
import { renderSheetHTML, fitSheet, clearFits, esc, stripEmphasis, SHEET_W, SHEET_RATIO } from './sheet.js';

// Storage keys predate the current name. Keep them: renaming would orphan saved poems.
const STORAGE_KEY = 'noor.poems.v1';
const THEME_KEY = 'noor.theme';
const NAME_KEY = 'noor.name';
const MOTION_KEY = 'noor.motion';
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
  share: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>`,
  down: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9.5l6 6 6-6"/></svg>`,
  check: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`,
  close: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  looks: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="11" height="15" rx="2"/><path d="M17 6.5l2.6.7a2 2 0 0 1 1.4 2.4L18.6 19a2 2 0 0 1-2.4 1.4"/></svg>`,
  motion: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M3 9c3-4 6-4 9 0s6 4 9 0"/><path d="M3 16c3-4 6-4 9 0s6 4 9 0"/></svg>`,
  move: `<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="5 9 2 12 5 15"/><polyline points="9 5 12 2 15 5"/><polyline points="15 19 12 22 9 19"/><polyline points="19 9 22 12 19 15"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/></svg>`,
  artwork: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>`,
  fonts: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>`,
  style: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>`,
  write: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`,
  copy: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`
};

const textHash = t => {
  let h = 5381;
  for (let i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
};
const isOldSample = p => OLD_SAMPLES[p.id] && OLD_SAMPLES[p.id] === textHash(`${p.title}|${p.body}`);

function loadPoems() {
  for (const key of [STORAGE_KEY, ...LEGACY_KEYS]) {
    let arr = null;
    try { arr = JSON.parse(localStorage.getItem(key) || 'null'); } catch {}
    if (Array.isArray(arr) && (arr.length || key === STORAGE_KEY)) return arr.filter(p => p && !isOldSample(p));
  }
  return [];
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

// Light or dark follows the system until the person chooses
const darkSystem = matchMedia('(prefers-color-scheme: dark)');
const chosenTheme = () => [THEME_KEY, ...LEGACY_THEME_KEYS].map(k => localStorage.getItem(k)).find(v => v === 'light' || v === 'dark');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const bar = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
  document.querySelectorAll('meta[name="theme-color"]').forEach(m => { m.removeAttribute('media'); m.content = bar; });
  return theme;
}
const initTheme = () => applyTheme(chosenTheme() || (darkSystem.matches ? 'dark' : 'light'));
darkSystem.addEventListener('change', () => {
  if (chosenTheme()) return;
  state.theme = initTheme();
  render();
});

const state = {
  poems: loadPoems(),
  theme: initTheme(),
  activeId: null,
  search: '',
  moodFilter: 'All',
  railTab: 'looks',
  lookCat: 'all',
  looksShown: 16,
  artSub: 'minimal',
  fontCat: 'all',
  focusMode: false,
  mobileSheetOpen: false,
  sheetTall: false,
  moreOpen: false,
  slideIdx: 0,
  rhymeQuery: '',
  editingRich: false,
  viewing: null,
  share: null,
  galleryScroll: 0,
  sparkShift: 0,
  perch: 2,
  facing: 1,
  song: null
};

function toast(msg, ms = 2200, action = null) {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  if (action) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'toast-btn';
    btn.textContent = action.label;
    btn.addEventListener('click', () => { action.run(); el.remove(); });
    el.appendChild(btn);
  }
  root.querySelectorAll('.toast:has(.toast-btn)').forEach(n => n.remove());
  root.appendChild(el);
  setTimeout(() => {
    el.classList.add('is-leaving');
    setTimeout(() => el.remove(), 260);
  }, ms);
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

// Motion: "full", or "calm" (fades only, nothing travels). Follows the system until the person chooses.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
function applyMotion() {
  const m = localStorage.getItem(MOTION_KEY);
  document.documentElement.dataset.motion = m === 'full' || m === 'calm' ? m : (reducedMotion.matches ? 'calm' : 'full');
}
applyMotion();
reducedMotion.addEventListener('change', applyMotion);
const calm = () => document.documentElement.dataset.motion === 'calm';

// Cross-fade between the anthology and the studio, carrying the poem from its card to the sheet.
function transitionView(update, heroBefore, heroAfter) {
  if (!document.startViewTransition || document.hidden) { update(); return; }
  if (calm()) { heroBefore = heroAfter = null; }
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
    state.share = null;
    state.viewing = null;
    state.slideIdx = 0;
    state.looksShown = 16;
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
    state.share = null;
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

function createPoem({ spark = '', lookId = '' } = {}) {
  const start = LOOKS.find(l => l.id === lookId) || LOOKS[Math.floor(Math.random() * 24)];
  const setting = lookPatch(start, { title: '', body: spark });
  const p = {
    ...setting,
    look: start.id,
    id: 'poem-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    title: '',
    body: '',
    spark,
    paper: setting.paper || 'ivory-press',
    ratio: '4:5',
    carousel: false,
    sign: '',
    pageNo: '',
    mood: '',
    archived: false,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  state.railTab = 'looks';
  state.poems.unshift(p);
  savePoems(state.poems);
  openPoem(p.id);
  setTimeout(() => {
    (document.getElementById('poem-title-in') || document.getElementById('poem-body-in'))?.focus();
  }, 40);
}

/* ---------- Home ---------- */

const DAY = Math.floor(Date.now() / 864e5);
const todaysSpark = () => SPARKS[(DAY * 7 + state.sparkShift) % SPARKS.length];

function dayPart() {
  const h = new Date().getHours();
  if (h < 5) return { greet: 'Still awake?', wash: 'wash-monsoon' };
  if (h < 12) return { greet: 'Good morning', wash: 'wash-blush' };
  if (h < 17) return { greet: 'Good afternoon', wash: 'wash-turmeric' };
  if (h < 21) return { greet: 'Good evening', wash: 'wash-rose' };
  return { greet: 'The quiet hours', wash: 'wash-monsoon' };
}

function poemLines(p) {
  return stripEmphasis(p.body || '').split('\n').map(l => l.trim()).filter(l => l.length > 7 && l.length < 64 && !/^[-—]{3,}$/.test(l));
}
function pickSong(id) {
  const own = state.poems.filter(p => !p.archived);
  const pool = (own.length ? own : EXAMPLES).filter(p => (!id || p.id === id) && poemLines(p).length);
  if (!pool.length) return null;
  const p = pool[Math.floor(Math.random() * pool.length)];
  const lines = poemLines(p);
  return { id: p.id, line: lines[Math.floor(Math.random() * lines.length)] };
}

function renderHero() {
  const part = dayPart();
  const kept = state.poems.filter(p => !p.archived);
  const inBloom = kept.length ? [...kept].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)).slice(-BLOOMS.length) : EXAMPLES.slice(0, 6);
  const [px, py] = PERCHES[state.perch];
  const buds = BLOOMS.slice(inBloom.length, inBloom.length + 3);
  return `
    <section class="hero" data-part="hero">
      <img class="hero-wash" src="${finishSrc(part.wash)}" alt="">
      <div class="hero-copy">
        <h2 class="hero-greet">${part.greet}</h2>
        <div class="spark">
          <button type="button" class="spark-text" id="spark-use" title="Write from this">${esc(todaysSpark())}</button>
          <button type="button" class="spark-next" id="spark-next" aria-label="Another idea" title="Another idea">${ICONS.sparkles}</button>
        </div>
      </div>
      <div class="hero-branch">
        <div class="branch-sway">
          <img class="branch-img" src="./assets/home/branch.webp" alt="" width="1300" height="590">
          ${buds.map(([x, y], i) => `<img class="bud" data-bud="${inBloom.length + i}" src="./assets/home/bud.webp" alt="" style="left:${x}%;top:${y}%">`).join('')}
          ${inBloom.map((p, i) => `<button type="button" class="bloom" data-bloom="${esc(p.id)}" data-label="${esc(p.title || 'Untitled poem')}" aria-label="Open ${esc(p.title || 'Untitled poem')}" style="left:${BLOOMS[i][0]}%;top:${BLOOMS[i][1]}%;--i:${i}"><img src="./assets/home/bloom-${i % 3 + 1}.webp" alt=""></button>`).join('')}
        </div>
        <button type="button" class="bird" id="bird" aria-label="Hear a line from your poems" style="left:${px}%;top:${py}%"><span class="bird-turn" style="--face:${state.facing}"><img src="./assets/home/bulbul.webp" alt=""></span></button>
        ${state.song ? `<button type="button" class="song ${px < 46 ? 'to-right' : 'to-left'}" data-song="${esc(state.song.id)}" style="left:${px}%;top:${py}%">${esc(state.song.line)}</button>` : ''}
        <span class="petal p1"></span><span class="petal p2"></span><span class="petal p3"></span>
        <p class="branch-note">${kept.length ? 'A blossom for every poem' : 'Examples, until yours bloom'}</p>
      </div>
    </section>`;
}

// A carousel shows its first slide, as it would arrive
function thumbHTML(p, ratio) {
  const st = resolveStyle(p);
  const pages = st.carousel ? paginatePoem(p.body, { ratio, layout: st.layout }) : null;
  return renderSheetHTML(p, { thumb: true, ratio, slide: pages && pages.length > 1 ? pages[0] : null });
}
const thumbRatio = st => (st.ratio === 'auto' ? (st.carousel ? '4:5' : '2:3') : st.ratio);

function renderExamples() {
  return `
    <section class="home-examples">
      <div class="home-top"><h2 class="home-h">Made in Bulbul</h2><span class="gallery-stat">Poems by Aditya</span></div>
      <div class="anthology-grid">${EXAMPLES.map(p => {
        const st = resolveStyle(p);
        const r = thumbRatio(st);
        return `
          <button type="button" class="poem-card" data-example="${p.id}" aria-label="${esc(p.title)}, ${esc(p.kind)}">
            <span class="poem-card-frame${st.carousel ? ' is-stack' : ''}" style="aspect-ratio:${r.replace(':', ' / ')}"><span class="thumb-scale">${thumbHTML(p, r)}</span></span>
            <span class="poem-card-meta"><span class="poem-card-title"><span>${esc(p.title)}</span></span><span class="poem-card-sub">${esc(p.kind)}</span></span>
          </button>`;
      }).join('')}</div>
    </section>`;
}

/* ---------- Example viewer ---------- */

function viewedPoem() { return EXAMPLES.find(p => p.id === state.viewing?.id) || null; }
function renderViewer() {
  const p = viewedPoem();
  if (!p) return '';
  const st = resolveStyle(p);
  const ratio = st.carousel && st.ratio === 'auto' ? '4:5' : st.ratio;
  const pages = st.carousel ? paginatePoem(p.body, { ratio, layout: st.layout }) : [null];
  const at = Math.min(state.viewing.slide, pages.length - 1);
  return `
    <div class="overlay" data-overlay="viewer">
      <div class="overlay-scrim" data-close></div>
      <div class="panel viewer" role="dialog" aria-modal="true" aria-label="${esc(p.title)}">
        <span class="panel-grab" aria-hidden="true"></span>
        <div class="viewer-stage${ratio === 'auto' ? ' is-long' : ''}" data-view-page="${p.id}-${at}" data-ratio-cls="rat-${ratio.replace(':', '-')}">
          <div class="viewer-fit"><div class="viewer-scale">${renderSheetHTML(p, { thumb: true, ratio, slide: pages.length > 1 ? pages[at] : null })}</div></div>
        </div>
        <div class="viewer-side">
          <div class="panel-top"><span class="viewer-kind">${esc(p.kind)}</span><button type="button" class="icon-btn" data-close aria-label="Close">${ICONS.close}</button></div>
          <h2 class="viewer-title">${esc(p.title)}</h2>
          <p class="viewer-by">Aditya · ${esc(st.font.name)}${st.bgMode === 'art' ? ' · ' + esc(st.painting.name) : ''}</p>
          ${pages.length > 1 ? `<div class="pager"><button type="button" class="icon-btn" data-vslide="${at - 1}" ${at ? '' : 'disabled'} aria-label="Previous slide">${ICONS.back}</button><span>${at + 1} of ${pages.length}</span><button type="button" class="icon-btn" data-vslide="${at + 1}" ${at < pages.length - 1 ? '' : 'disabled'} aria-label="Next slide">${ICONS.next}</button></div>` : ''}
          <div class="viewer-acts">
            <button type="button" class="btn primary" id="ex-style-btn">${ICONS.plus} Write in this style</button>
            <button type="button" class="btn" id="ex-copy-btn">Add a copy to my poems</button>
          </div>
          <div class="viewer-nav"><button type="button" class="btn sm ghost" data-vstep="-1">${ICONS.back} Previous</button><button type="button" class="btn sm ghost" data-vstep="1">Next ${ICONS.next}</button></div>
        </div>
      </div>
    </div>`;
}
function viewExample(id) {
  state.viewing = { id, slide: 0 };
  clearTimeout(songTimer);
  render();
  document.querySelector('.viewer [data-close]')?.focus();
}
function fromExample(keepWords) {
  const p = viewedPoem();
  if (!p) return;
  const { id, kind, title, body, sign, ...setting } = p;
  const words = keepWords ? { title, body, sign } : { title: '', body: '', sign: '', carousel: false };
  const now = Date.now();
  const poem = { ...setting, ...words, textStyle: !keepWords && setting.textStyle === 'blackout' ? 'plain' : setting.textStyle, id: 'poem-' + now.toString(36) + Math.random().toString(36).slice(2, 6), archived: false, createdAt: now, updatedAt: now };
  state.viewing = null;
  state.railTab = 'looks';
  state.poems.unshift(poem);
  savePoems(state.poems);
  openPoem(poem.id);
  if (keepWords) toast('Added a copy to your poems');
  else setTimeout(() => (document.getElementById('poem-title-in') || document.getElementById('poem-body-in'))?.focus(), 60);
}

/* ---------- Share ---------- */

function openShare() {
  const poem = getActivePoem();
  if (!poem) return;
  const st = resolveStyle(poem);
  state.moreOpen = false;
  state.mobileSheetOpen = false;
  state.editingRich = false;
  document.querySelectorAll('.toast').forEach(n => n.remove());
  state.share = { platform: 'image', split: st.carousel, page: state.slideIdx, caption: captionFor(poem), who: (poem.sign || '').replace(/^[\s—–~-]+/, '').trim() || localStorage.getItem(NAME_KEY) || '', as: 'page', backdrop: 'poem', ready: false, note: '' };
  render();
  prepareShare();
  document.querySelector('.share [data-close]')?.focus();
}
function closeOverlay() {
  const wasShare = Boolean(state.share);
  state.share = null;
  state.viewing = null;
  render();
  if (wasShare) document.getElementById('share-btn')?.focus();
}
function shareNow() {
  const poem = getActivePoem();
  const sh = state.share;
  if (!poem || !sh) return null;
  const platform = platformOf(sh.platform);
  const { ratio, pages } = sharePages(poem, platform, sh.split);
  const at = Math.min(sh.page, pages.length - 1);
  const now = { poem, sh, platform, ratio, pages, at, mock: sh.as === 'mock' };
  now.stage = i => mockStage(sh.backdrop, poem, mockHTML({ ...now, at: i }));
  now.make = i => (now.mock ? mockup(poem, platform, pages[i], now.stage(i)) : poster(poem, ratio, pages[i]));
  return now;
}
// Paint ahead of the click, so copying and sharing can happen inside it
let shareRun = 0;
let captionTimer = 0;
async function prepareShare() {
  const now = shareNow();
  if (!now) return;
  const run = ++shareRun;
  now.sh.ready = false;
  now.sh.posters = null;
  render();
  try {
    const posters = [];
    // Only the mockup on show is painted ahead; the pages of a post are all sent together.
    const order = now.mock ? [now.at] : [now.at, ...now.pages.keys()].filter((v, i, a) => a.indexOf(v) === i);
    for (const i of order) {
      posters[i] = await now.make(i);
      if (run !== shareRun || !state.share) return;
      if (i === now.at) { now.sh.ready = true; render(); }
    }
    now.sh.posters = posters.filter(Boolean);
    render();
  } catch (err) {
    console.error(err);
    if (run === shareRun && state.share) { now.sh.note = 'Could not prepare the image. Please try again.'; render(); }
  }
}
function setShare(patch) {
  const poem = getActivePoem();
  if (!state.share || !poem) return;
  if ('split' in patch) patch.splitChosen = true;
  // A long poem shrinks to nothing on a fixed-size post, so start it as slides.
  if ('platform' in patch && !state.share.splitChosen) {
    patch.split = resolveStyle(poem).carousel || (Boolean(platformOf(patch.platform).ratio) && poemMetrics(poem.body).lines > 22);
    patch.page = 0;
  }
  Object.assign(state.share, { note: '' }, patch);
  prepareShare();
}
// Words shown inside a mockup: preview at once, repaint when typing pauses
function editShare(key, value) {
  if (!state.share) return;
  state.share[key] = value;
  if (state.share.as === 'mock') {
    state.share.ready = false;
    clearTimeout(captionTimer);
    captionTimer = setTimeout(prepareShare, 450);
  }
  render();
}
function shareNote(note) { if (state.share) { state.share.note = note; render(); } }

function shareCopyImage() {
  const now = shareNow();
  if (!now) return Promise.resolve(false);
  return copyImage(now.make(now.at).then(p => p.blob)).then(() => true, () => false);
}
async function shareDownload({ all = true } = {}) {
  const now = shareNow();
  if (!now) return;
  const which = all && !now.mock || all === 'mocks' ? [...now.pages.keys()] : [now.at];
  try {
    for (const i of which) {
      if (which.length > 1 && now.mock) shareNote(`Painting mockup ${i + 1} of ${which.length}…`);
      downloadPoster(await now.make(i));
      if (which.length > 1) await new Promise(r => setTimeout(r, 260));
    }
    shareNote(which.length > 1 ? `Downloaded ${which.length} images` : 'Downloaded');
  } catch (err) {
    console.error(err);
    shareNote('Could not prepare the image. Please try again.');
  }
}
async function shareSystem() {
  const now = shareNow();
  if (!now?.sh.posters) return;
  try {
    await shareFiles(now.sh.posters, now.mock ? '' : now.sh.caption);
  } catch (err) {
    if (err?.name !== 'AbortError') shareNote('Sharing isn’t available here. Download the image instead.');
  }
}
const isTouch = () => matchMedia('(pointer: coarse)').matches;
function shareSend() {
  const now = shareNow();
  if (!now) return;
  const { platform, sh } = now;
  if (isTouch() && canShareFiles() && sh.posters) { shareSystem(); return; }
  const url = platform.url(sh.caption);
  if (platform.send === 'paste') {
    const done = shareCopyImage();
    window.open(url, '_blank', 'noopener');
    done.then(ok => shareNote(ok ? `Image copied. Paste it into ${platform.label}${now.pages.length > 1 ? ', then copy the next slide here' : ''}.` : `Your browser blocked copying. Download the image and add it in ${platform.label}.`));
  } else {
    navigator.clipboard?.writeText(sh.caption).catch(() => {});
    window.open(url, '_blank', 'noopener');
    shareDownload().then(() => shareNote(`Downloaded, and the caption is copied. Upload it on ${platform.id === 'story' ? 'Instagram from your phone' : platform.label}.`));
  }
}
async function quickCopyImage() {
  const poem = getActivePoem();
  if (!poem) return;
  const st = resolveStyle(poem);
  const ratio = st.carousel && st.ratio === 'auto' ? '4:5' : st.ratio;
  const pages = st.carousel ? paginatePoem(poem.body, { ratio, layout: st.layout }) : [null];
  const page = pages[Math.min(state.slideIdx, pages.length - 1)];
  state.moreOpen = false;
  render();
  const busy = setTimeout(() => toast('Painting the image…', 1400), 350);
  const ok = await copyImage(poster(poem, ratio, page).then(p => p.blob)).then(() => true, () => false);
  clearTimeout(busy);
  toast(ok ? (pages.length > 1 ? `Copied slide ${page.index + 1} as an image` : 'Copied as an image') : 'Copying images isn’t allowed here. Use Share to download.', 2800);
}

function mockHTML(now) {
  const { poem, sh, platform, ratio, pages, at } = now;
  const sheet = renderSheetHTML(poem, { thumb: true, ratio, slide: pages[at] && pages.length > 1 ? pages[at] : null });
  const art = `<div class="mock-art${ratio === 'auto' ? ' is-long' : ''}" data-ratio-cls="rat-${ratio.replace(':', '-')}" style="aspect-ratio:${ratio === 'auto' ? '4 / 5' : ratio.replace(':', ' / ')}"><div class="mock-scale">${sheet}</div></div>`;
  const who = sh.who.trim() || 'Your name';
  const face = `<span class="mock-face">${esc(Array.from(who)[0])}</span>`;
  const cap = esc(sh.caption).replace(/\n/g, '<br>');
  const dots = pages.length > 1 ? `<span class="mock-dots">${pages.map((_, i) => `<i class="${i === at ? 'on' : ''}"></i>`).join('')}</span>` : '';
  switch (platform.id) {
    case 'whatsapp': return `<div class="mock m-chat"><div class="bubble">${art}${cap ? `<p>${cap}</p>` : ''}<time>now ${ICONS.check}</time></div></div>`;
    case 'insta': return `<div class="mock m-post"><header>${face}<b>${esc(who)}</b></header>${art}${dots}<p><b>${esc(who)}</b> ${cap.replace(/<br>/g, ' ')}</p></div>`;
    case 'story': return `<div class="mock m-story">${art}<div class="story-bars">${pages.slice(0, 12).map((_, i) => `<i class="${i <= at ? 'on' : ''}"></i>`).join('')}</div><header>${face}<b>${esc(who)}</b></header></div>`;
    case 'pin': return `<div class="mock m-pin">${art}<p><b>${esc(poem.title || 'Untitled poem')}</b></p><footer>${face}<span>${esc(who)}</span></footer></div>`;
    case 'x': case 'threads': case 'facebook': return `<div class="mock m-x"><header>${face}<b>${esc(who)}</b></header>${cap ? `<p>${cap}</p>` : ''}${art}</div>`;
    default: return `<div class="mock m-plain">${art}</div>`;
  }
}

function renderShare() {
  const now = shareNow();
  if (!now) return '';
  const { sh, platform, ratio, pages, at, poem } = now;
  const many = pages.length > 1;
  const canSplit = paginatePoem(poem.body, { ratio: ratio === 'auto' ? '4:5' : ratio, layout: resolveStyle(poem).layout }).length > 1;
  const touch = isTouch() && canShareFiles();
  const sendLabel = touch ? `Share to ${platform.label}` : platform.send === 'paste' ? `Copy image and open ${platform.label}` : `Download and open ${platform.id === 'story' ? 'Instagram' : platform.label}`;
  const size = ratio === 'auto' ? 'Full length' : ratio.replace(':', ' × ');
  return `
    <div class="overlay" data-overlay="share">
      <div class="overlay-scrim" data-close></div>
      <div class="panel share" role="dialog" aria-modal="true" aria-label="Share">
        <span class="panel-grab" aria-hidden="true"></span>
        <div class="share-view${now.mock ? ' is-mock' : ''}">${now.mock ? `<div class="mock-frame">${now.stage(at)}</div>` : mockHTML(now)}
          ${many ? `<div class="pager"><button type="button" class="icon-btn" data-spage="${at - 1}" ${at ? '' : 'disabled'} aria-label="Previous slide">${ICONS.back}</button><span>${at + 1} of ${pages.length}</span><button type="button" class="icon-btn" data-spage="${at + 1}" ${at < pages.length - 1 ? '' : 'disabled'} aria-label="Next slide">${ICONS.next}</button></div>` : ''}
        </div>
        <div class="share-side">
          <div class="panel-top"><h2 class="panel-title">Share</h2><button type="button" class="icon-btn" data-close aria-label="Close">${ICONS.close}</button></div>
          <div class="share-grid" role="group" aria-label="Where to share">${PLATFORMS.map(p => `<button type="button" class="share-to${p.id === platform.id ? ' on' : ''}" data-shareto="${p.id}" aria-pressed="${p.id === platform.id}">${p.icon}<span>${p.label}</span></button>`).join('')}</div>
          <div class="share-row"><div class="seg" role="group" aria-label="What to share"><button type="button" class="seg-btn${now.mock ? '' : ' on'}" data-as="page">Page</button><button type="button" class="seg-btn${now.mock ? ' on' : ''}" data-as="mock">Mockup</button></div><span class="share-size">${now.mock ? '1080 × 1350' : size}</span></div>
          ${now.mock ? `<div class="share-row"><span>Backdrop</span><div class="backdrops">${BACKDROPS.map(bd => `<button type="button" class="bd-dot bd-${bd.id}${bd.id === sh.backdrop ? ' on' : ''}" data-backdrop="${bd.id}" title="${bd.label}" aria-label="${bd.label}" aria-pressed="${bd.id === sh.backdrop}" style="${backdropCSS(bd.id, poem).css}"></button>`).join('')}</div></div>` : ''}
          ${canSplit ? `<div class="share-row"><span>Long poem</span><div class="seg"><button type="button" class="seg-btn${sh.split ? '' : ' on'}" data-split="0">One image</button><button type="button" class="seg-btn${sh.split ? ' on' : ''}" data-split="1">Slides</button></div></div>` : ''}
          ${platform.id === 'image' || !now.mock ? '' : `<label class="share-cap"><span>Name</span><input id="share-who" type="text" autocomplete="off" placeholder="Your name" value="${esc(sh.who)}"></label>`}
          ${platform.id === 'image' || (now.mock && ['pin', 'story'].includes(platform.id)) ? '' : `<label class="share-cap"><span>Caption</span><textarea id="share-caption" rows="3">${esc(sh.caption)}</textarea></label>`}
          <div class="share-acts">
            ${now.mock
              ? `<button type="button" class="btn primary" id="mock-download" ${sh.ready ? '' : 'disabled'}>${ICONS.download} Download mockup</button>
                 <div class="share-pair"><button type="button" class="btn" id="share-copy" ${sh.ready ? '' : 'disabled'}>Copy mockup</button>${many ? `<button type="button" class="btn" id="mock-all">Download all ${pages.length}</button>` : canShareFiles() ? `<button type="button" class="btn" id="share-system" ${sh.posters ? '' : 'disabled'}>More apps…</button>` : ''}</div>`
              : platform.id === 'image'
              ? `<button type="button" class="btn primary" id="share-copy" ${sh.ready ? '' : 'disabled'}>${ICONS.copy} Copy image</button>
                 <button type="button" class="btn" id="share-download" ${sh.ready ? '' : 'disabled'}>${ICONS.download} ${many ? `Download ${pages.length} images` : 'Download'}</button>`
              : `<button type="button" class="btn primary" id="share-send" ${sh.ready ? '' : 'disabled'}>${ICONS.share} ${sendLabel}</button>
                 <div class="share-pair"><button type="button" class="btn" id="share-copy" ${sh.ready ? '' : 'disabled'}>Copy image</button><button type="button" class="btn" id="share-download" ${sh.ready ? '' : 'disabled'}>Download${many ? ` (${pages.length})` : ''}</button></div>`}
            ${canShareFiles() && !(touch && platform.id !== 'image') && !(now.mock && !many) ? `<button type="button" class="btn ghost" id="share-system" ${sh.posters ? '' : 'disabled'}>${ICONS.share} More apps…</button>` : ''}
            ${now.mock ? '' : '<button type="button" class="btn ghost" id="share-text">Copy the words</button>'}
          </div>
          <p class="share-note" role="status">${esc(sh.note || (sh.ready ? '' : now.mock ? 'Painting the mockup…' : 'Painting the image…'))}</p>
        </div>
      </div>
    </div>`;
}

function fitOverlay() {
  const frame = document.querySelector('.mock-frame');
  if (frame) {
    const stage = frame.firstElementChild;
    fitMock(stage);
    const view = frame.parentElement;
    const cs = getComputedStyle(view);
    const pager = view.querySelector('.pager');
    const w = view.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const h = desktopStage.matches ? view.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (pager ? pager.offsetHeight + 12 : 0) : 340;
    const z = Math.min(w / MOCK_W, h / MOCK_H, 1);
    frame.style.width = MOCK_W * z + 'px';
    frame.style.height = MOCK_H * z + 'px';
    stage.style.transform = `scale(${z.toFixed(4)})`;
  }
  document.querySelectorAll('[data-ratio-cls]').forEach(box => {
    if (box.closest('.mock-stage')) return;
    const scale = box.querySelector('.viewer-scale, .mock-scale');
    const base = SHEET_W[box.dataset.ratioCls];
    const r = SHEET_RATIO[box.dataset.ratioCls];
    if (box.classList.contains('viewer-stage')) {
      const cs = getComputedStyle(box);
      const w = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const h = box.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const z = Math.min(1.6, w / base, r ? h / (base / r) : 9);
      scale.style.setProperty('--thumb', z.toFixed(4));
      const fit = box.querySelector('.viewer-fit');
      fit.style.width = base * z + 'px';
      fit.style.height = (r ? base / r : scale.firstElementChild.offsetHeight) * z + 'px';
    } else {
      scale.style.setProperty('--thumb', (box.clientWidth / base).toFixed(4));
    }
  });
}

function renderLookStrip() {
  const shown = LOOKS.map((l, i) => LOOKS[(i + DAY * 5) % LOOKS.length]).slice(0, 14);
  return `
    <section class="home-looks">
      <h2 class="home-h">Start from a look</h2>
      <div class="look-strip">
        ${shown.map(l => `
          <button type="button" class="look-btn" data-startlook="${l.id}" aria-label="New poem with the ${esc(l.name)} look">
            <span class="look-frame"><span class="look-scale">${renderSheetHTML({ ...l.patch, title: l.name, body: 'Begin with\none honest line,\nand let the page\ndo the rest.', sign: '' }, { thumb: true, ratio: '4:5' })}</span></span>
            <span class="look-nm">${esc(l.name)}</span>
          </button>`).join('')}
      </div>
    </section>`;
}

const birdEl = () => document.getElementById('bird');
let songTimer = 0;
function sing(song, wait = 620) {
  clearTimeout(songTimer);
  if (state.song) { state.song = null; render(); }
  songTimer = setTimeout(() => {
    if (state.activeId || !birdEl()) return;
    state.song = song;
    render();
  }, wait);
}
function hopTo(i, song) {
  const bird = birdEl();
  if (!bird) return;
  if (i !== state.perch) {
    const was = bird.getBoundingClientRect();
    state.facing = PERCHES[i][0] < PERCHES[state.perch][0] ? -1 : 1;
    state.perch = i;
    state.song = null;
    render();
    const now = bird.getBoundingClientRect();
    const dx = was.left - now.left;
    const dy = was.top - now.top;
    if (calm()) bird.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
    else {
      const far = Math.min(90, 26 + Math.abs(dx) * 0.16);
      bird.animate([
        { transform: `translate(${dx}px, ${dy}px)`, easing: 'cubic-bezier(.3,0,.5,1)' },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - far}px) rotate(${-8 * state.facing}deg)`, easing: 'cubic-bezier(.4,0,.5,1)', offset: 0.52 },
        { transform: 'translate(0, 3px)', offset: 0.9 },
        { transform: 'none' }
      ], { duration: 420 + Math.abs(dx) * 0.7, composite: 'add' });
    }
  }
  sing(song);
}
function nearestPerch(x, y) {
  let best = 0;
  PERCHES.forEach(([a, b], i) => { if (Math.hypot(a - x, (b - y) * 0.45) < Math.hypot(PERCHES[best][0] - x, (PERCHES[best][1] - y) * 0.45)) best = i; });
  return best;
}
let hoverBloom = '';
document.addEventListener('pointerover', e => {
  const bloom = e.target.closest?.('.bloom');
  const id = bloom?.dataset.bloom || '';
  if (id === hoverBloom) return;
  hoverBloom = id;
  if (bloom && e.pointerType === 'mouse') hopTo(nearestPerch(parseFloat(bloom.style.left), parseFloat(bloom.style.top)), pickSong(id));
});
// Left alone, the bird moves about and sings something of yours.
setInterval(() => {
  if (state.activeId || state.viewing || document.hidden || calm() || hoverBloom || state.search) return;
  const hero = document.querySelector('.hero');
  if (!hero || hero.getBoundingClientRect().bottom < 80) return;
  hopTo(Math.floor(Math.random() * PERCHES.length), pickSong());
}, 9000);

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

  const none = !state.poems.length;
  const cardsHTML = none ? '' : filtered.length
    ? `<div class="anthology-grid">${filtered.map(p => {
        const m = poemMetrics(p.body);
        const st = resolveStyle(p);
        const cardRatio = thumbRatio(st);
        return `
          <button type="button" class="poem-card" data-open="${esc(p.id)}">
            <div class="poem-card-frame${st.carousel ? ' is-stack' : ''}" style="aspect-ratio:${cardRatio.replace(':', ' / ')}">
              <div class="thumb-scale">${thumbHTML(p, cardRatio)}</div>
            </div>
            <div class="poem-card-meta">
              <h2 class="poem-card-title"><span>${esc(p.title || "Untitled poem")}</span></h2>
              <span class="poem-card-sub">${m.lines} ${m.lines === 1 ? 'line' : 'lines'}</span>
            </div>
          </button>
        `;
      }).join('')}${!q && !isArchTab ? `<button type="button" class="poem-card new-card" id="new-card-btn"><span class="poem-card-frame">${ICONS.plus}<span>New page</span></span></button>` : ''}</div>`
    : `<div class="empty-state">
        ${SYMBOL_SVG}
        <h2>An open page</h2>
        <p>${q ? `Nothing matches “${esc(state.search.trim())}”.` : state.moodFilter !== 'All' ? 'No poems in this collection yet.' : 'Begin your anthology with your first poem.'}</p>
        <button type="button" class="btn primary" id="empty-new-btn">${ICONS.plus} Write a poem</button>
      </div>`;

  const filterBar = none ? '' : `<div class="filter-bar">
          <div class="mood-pills" role="tablist" aria-label="Filter poems by collection">
            ${pills.map(md => `<button type="button" role="tab" aria-selected="${state.moodFilter === md}" class="pill${state.moodFilter === md ? ' on' : ''}" data-mood="${esc(md)}">${esc(md)}${md === 'Archived' ? ` (${archivedCount})` : ''}</button>`).join('')}
          </div>
          <span class="gallery-stat">${filtered.length === activeCount || isArchTab ? `${filtered.length} ${filtered.length === 1 ? 'poem' : 'poems'}` : `${filtered.length} of ${activeCount}`}</span>
        </div>`;

  const galleryMenu = state.moreOpen ? `
    <div class="ios-menu" role="menu">
      <button type="button" class="ios-menu-item" id="m-backup-btn" role="menuitem"><span>Backup JSON</span>${ICONS.download}</button>
      <button type="button" class="ios-menu-item" id="m-import-btn" role="menuitem"><span>Import JSON</span>${ICONS.upload}</button>
      <button type="button" class="ios-menu-item" id="m-motion-btn" role="menuitem"><span>${calm() ? 'Turn motion on' : 'Turn motion off'}</span>${ICONS.motion}</button>
    </div>
  ` : '';

  return `
    <div class="shell" data-view="gallery" ${state.viewing ? 'inert' : ''}>
      <div class="gallery-head">
      <header class="topbar">
        <div class="brand">
          <h1 class="brand-mark">${LOCKUP_SVG}</h1>
          <p class="brand-sub">For words that sing</p>
        </div>
        <div class="search-wrap">
          ${ICONS.search}
          <input id="gallery-search" class="search-in" type="search" placeholder="Search poems…" value="${esc(state.search)}" aria-label="Search poems">
        </div>
        <div class="topbar-right">
          <button type="button" class="btn sm ghost desktop-only" id="backup-btn" title="Export anthology JSON">${ICONS.download} Backup</button>
          <button type="button" class="btn sm ghost desktop-only" id="import-btn" title="Import anthology JSON">${ICONS.upload} Import</button>
          <input id="import-file" type="file" accept="application/json" hidden>
          <button type="button" class="btn sm icon-only desktop-only" id="motion-btn" title="${calm() ? 'Turn motion on' : 'Turn motion off'}" aria-label="Motion" aria-pressed="${!calm()}">${ICONS.motion}</button>
          <button type="button" class="btn sm icon-only" id="theme-btn" title="Toggle light or night studio" aria-label="Toggle studio theme">${state.theme === 'dark' ? ICONS.sun : ICONS.moon}</button>
          <div class="menu-wrap mobile-only">
            <button type="button" class="btn sm icon-only" id="more-btn" aria-label="More options" aria-expanded="${state.moreOpen}">${ICONS.more}</button>
            ${galleryMenu}
          </div>
          <button type="button" class="btn primary desktop-only" id="new-poem-btn">${ICONS.plus} New poem</button>
        </div>
      </header>

      </div>
      ${q ? '' : renderHero()}
        ${filterBar}
      ${none ? '' : `<main>${cardsHTML}</main>`}
      ${q ? '' : renderExamples()}
      ${q ? '' : renderLookStrip()}
    </div>

    ${renderViewer()}
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
    story: ARTWORKS.filter(a => a.grp === 'story'),
    folk: ARTWORKS.filter(a => a.grp === 'folk'),
    print: ARTWORKS.filter(a => a.grp === 'print'),
    line: ARTWORKS.filter(a => a.grp === 'line'),
    night: ARTWORKS.filter(a => a.grp === 'night'),
    minimal: ARTWORKS.filter(a => a.grp === 'minimal'),
    sketch: ARTWORKS.filter(a => a.grp === 'sketch'),
    light: ARTWORKS.filter(a => a.grp === 'light'),
    editorial: ARTWORKS.filter(a => a.grp === 'editorial'),
    canvas: ARTWORKS.filter(a => a.grp === 'canvas')
  };

  let railContent = '';
  if (state.railTab === 'looks') {
    const inCat = LOOKS.filter(l => state.lookCat === 'all' || l.cat === state.lookCat);
    const shown = inCat.slice(0, state.looksShown);
    railContent = `
      <div class="subtabs" role="group" aria-label="Categories">${LOOK_CATS.map(c => `<button type="button" class="subtab${state.lookCat === c.id ? ' on' : ''}" data-lookcat="${c.id}">${esc(c.label)}</button>`).join('')}</div>
      <div class="look-grid" data-grid="looks-${state.lookCat}">
        ${shown.map(l => {
          const patch = lookPatch(l, poem);
          const on = poem.look === l.id;
          const sample = { ...poem, ...patch, carousel: false, title: poem.title || 'Untitled', body: poem.body || 'Begin with\none honest line,\nand let the page\ndo the rest.' };
          return `
          <button type="button" class="look-btn${on ? ' on' : ''}" data-look="${l.id}" aria-pressed="${on}">
            <span class="look-frame"><span class="look-scale">${renderSheetHTML(sample, { thumb: true, ratio: '4:5' })}</span></span>
            <span class="look-nm">${esc(l.name)}</span>
          </button>`;
        }).join('')}
        ${shown.length < inCat.length ? '<div class="look-more" data-more="looks"></div>' : ''}
      </div>
    `;
  } else if (state.railTab === 'artwork') {
    const subTabs = [
      { id: 'story', label: `Illustrations (${grps.story.length})` },
      { id: 'folk', label: `Folk & Craft (${grps.folk.length})` },
      { id: 'print', label: `Print & Paper (${grps.print.length})` },
      { id: 'line', label: `Line & Ink (${grps.line.length})` },
      { id: 'night', label: `Night (${grps.night.length})` },
      { id: 'minimal', label: `Minimal (${grps.minimal.length})` },
      { id: 'sketch', label: `Sketches (${grps.sketch.length})` },
      { id: 'light', label: `Light (${grps.light.length})` },
      { id: 'editorial', label: `Book & Ink (${grps.editorial.length})` },
      { id: 'canvas', label: `Watercolour (${grps.canvas.length})` },
      { id: 'photo', label: 'Your Photo' }
    ];

    let picker = '';
    if (!grps[state.artSub] && state.artSub !== 'photo') state.artSub = 'story';
    if (grps[state.artSub]) {
      picker = `<div class="paint-grid" data-grid="${state.artSub}"><button type="button" class="paint-btn${st.bgMode === 'solid' ? ' on' : ''}" id="no-picture-btn"><span class="paint-thumb finish-th is-none"></span><span class="paint-nm">No picture</span></button>${grps[state.artSub].map(pt => {
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
    const firstLine = stripEmphasis(String(poem.body || '').split('\n').find(l => l.trim()) || '').trim().slice(0, 30);
    const hasOffset = st.textX !== 0 || st.textY !== 0;
    const shown = state.fontCat === 'all' ? FONTS : FONTS.filter(f => f.cat === state.fontCat);
    railContent = `
      <div class="subtabs" role="group" aria-label="Categories">${[{ id: 'setting', label: 'Size & style' }, ...FONT_CATS].map(fc => `<button type="button" class="subtab${state.fontCat === fc.id ? ' on' : ''}" data-fontcat="${fc.id}">${esc(fc.label)}</button>`).join('')}</div>
      ${state.fontCat === 'setting' ? `
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
        <div class="sec-lbl">Alignment</div>
        <div class="pills">
          ${['left', 'center', 'right'].map(al => `<button type="button" class="choice-pill${st.align === al ? ' on' : ''}" data-align="${al}" style="text-transform:capitalize">${al}</button>`).join('')}
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
        <div class="sec-lbl">Title style</div>
        <div class="pills">
          ${TITLE_STYLES.map(ts => `<button type="button" class="choice-pill${st.titleStyle === ts.id ? ' on' : ''}" data-titlestyle="${ts.id}">${esc(ts.label)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Line style</div>
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
      ` : `
      <div class="font-list" data-grid="font-${state.fontCat}">
        ${shown.map(fn => `
          <button type="button" class="font-btn${st.font.id === fn.id ? ' on' : ''}" data-font="${fn.id}">
            <span class="font-sample" style="font-family:${fn.fam};font-weight:${fn.titleW};font-style:${fn.italicTitle ? 'italic' : 'normal'}">${esc(fn.cat === 'hindi' && !isHindi(firstLine) ? 'कुछ शब्द, कुछ ख़ामोशी' : firstLine || fn.name)}</span>
            <span class="font-cat">${esc(fn.name)}</span>
          </button>
        `).join('')}
      </div>
      `}
    `;
  } else if (state.railTab === 'style') {
    railContent = `
      <div>
        <div class="sec-lbl">Paper</div>
        <div class="finish-row">
          ${st.bgMode === 'art' ? `<button type="button" class="finish-btn${!st.paperPick ? ' on' : ''}" data-paper=""><span class="finish-th sw" style="background:linear-gradient(135deg,${st.painting.bg},${st.painting.bg2 || st.painting.bg});color:${st.painting.ink}">Aa</span><span>Original</span></button>` : ''}
          ${PAPERS.filter(pa => !(st.bgMode === 'art' && pa.dark && st.painting.blend === 'multiply')).map(pa => `<button type="button" class="finish-btn${(st.bgMode === 'art' ? st.paperPick : st.paper.id) === pa.id ? ' on' : ''}" data-paper="${esc(pa.id)}"><span class="finish-th sw" style="background:linear-gradient(135deg,${pa.bg},${pa.bg2});color:${pa.ink}">Aa</span><span>${esc(pa.name)}</span></button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Paper texture</div>
        <div class="pills">
          ${TEXTURES.map(tx => `<button type="button" class="choice-pill${st.texture === tx.id ? ' on' : ''}" data-texture="${tx.id}">${esc(tx.label)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Watercolour</div>
        <div class="finish-row">
          <button type="button" class="finish-btn${!st.atmos ? ' on' : ''}" data-atmos=""><span class="finish-th is-none"></span><span>None</span></button>
          ${ATMOS.map(x => `<button type="button" class="finish-btn${st.atmos === x.id ? ' on' : ''}" data-atmos="${x.id}"><span class="finish-th"><img src="${finishSrc(x.id)}" alt="" loading="lazy"></span><span>${esc(x.label)}</span></button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Light</div>
        <div class="finish-row">
          <button type="button" class="finish-btn${!st.light ? ' on' : ''}" data-light=""><span class="finish-th is-none"></span><span>None</span></button>
          ${LIGHTS.map(x => `<button type="button" class="finish-btn${st.light === x.id ? ' on' : ''}" data-light="${x.id}"><span class="finish-th"><img src="${finishSrc(x.id)}" alt="" loading="lazy"></span><span>${esc(x.label)}</span></button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Keepsake</div>
        <div class="finish-row">
          <button type="button" class="finish-btn${!st.charm ? ' on' : ''}" data-charm=""><span class="finish-th is-none"></span><span>None</span></button>
          ${CHARMS.map(x => `<button type="button" class="finish-btn${st.charm === x.id ? ' on' : ''}" data-charm="${x.id}"><span class="finish-th"><img src="${finishSrc(x.id)}" alt="" loading="lazy"></span><span>${esc(x.label)}</span></button>`).join('')}
        </div>
        ${st.charm ? `<div class="pills" style="margin-top:8px;">${CHARM_POS.map(p => `<button type="button" class="choice-pill${st.charmPos === p.id ? ' on' : ''}" data-charmpos="${p.id}">${esc(p.label)}</button>`).join('')}</div>` : ''}
      </div>
      <div>
        <div class="sec-lbl">Frame</div>
        <div class="pills">
          ${FRAMES.map(fr => `<button type="button" class="choice-pill${st.frame === fr.id ? ' on' : ''}" data-frame="${fr.id}">${esc(fr.label)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Poster format</div>
        <div class="pills">
          ${RATIOS.map(r => `<button type="button" class="choice-pill${st.ratio === r.id ? ' on' : ''}" data-ratio="${r.id}">${esc(r.label)}</button>`).join('')}
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
        <div class="sec-lbl">Signature</div>
        <input id="sign-in" class="field-in" type="text" placeholder="— your name or pen name" value="${esc(st.sign)}">
      </div>
      <div>
        <div class="sec-lbl">Collection tag</div>
        <div class="pills">
          ${MOODS.map(md => `<button type="button" class="choice-pill${st.mood === md ? ' on' : ''}" data-setmood="${esc(md)}">${esc(md)}</button>`).join('')}
        </div>
      </div>
      <div>
        <div class="sec-lbl">Book page number</div>
        <input id="page-in" class="field-in" type="text" placeholder="e.g. 143" value="${esc(st.pageNo)}">
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
    { id: 'looks', label: 'Looks', icon: ICONS.looks, note: 'Sets the whole page: picture, type and paper.' },
    { id: 'artwork', label: 'Picture', icon: ICONS.artwork, layer: 'picture', note: 'Changes only the picture and where it sits.' },
    { id: 'fonts', label: 'Type', icon: ICONS.fonts, layer: 'type', note: 'Changes only how the words look.' },
    { id: 'style', label: 'Page', icon: ICONS.style, layer: 'page', note: 'Changes only the paper, light and frame.' },
    { id: 'write', label: 'Words', icon: ICONS.write, note: 'The words themselves, and help writing them.' }
  ];
  const activeTab = tabMeta.find(t => t.id === state.railTab) || tabMeta[0];
  const activeTabLabel = activeTab.label;
  const changed = changedLayers(poem);
  const lookName = LOOKS.find(l => l.id === poem.look)?.name;
  const layerNames = { picture: 'picture', type: 'type', page: 'page' };
  const railNote = state.railTab === 'looks' && lookName
    ? `<span>${changed.length ? `<b>${esc(lookName)}</b>, with your own ${changed.map(c => layerNames[c]).join(changed.length > 2 ? ', ' : ' and ')}` : `<b>${esc(lookName)}</b>, as designed`}</span>${changed.length ? '<button type="button" class="note-btn" id="look-reset-btn">Reset</button>' : ''}`
    : `<span>${activeTab.note}</span>`;

  const mobileMoreMenu = state.moreOpen ? `
    <div class="ios-menu" role="menu">
      <button type="button" class="ios-menu-item" id="m-shuffle-btn" role="menuitem"><span>Shuffle pairing</span>${ICONS.sparkles}</button>
      <button type="button" class="ios-menu-item" id="m-copy-image-btn" role="menuitem"><span>Copy image</span>${ICONS.copy}</button>
      <button type="button" class="ios-menu-item" id="m-copy-btn" role="menuitem"><span>Copy the words</span>${ICONS.write}</button>
      <button type="button" class="ios-menu-item" id="m-theme-btn" role="menuitem"><span>${state.theme === 'dark' ? 'Light studio' : 'Night studio'}</span>${state.theme === 'dark' ? ICONS.sun : ICONS.moon}</button>
      <button type="button" class="ios-menu-item" id="m-motion-btn" role="menuitem"><span>${calm() ? 'Turn motion on' : 'Turn motion off'}</span>${ICONS.motion}</button>
      <div class="ios-menu-sep"></div>
      <button type="button" class="ios-menu-item" id="m-archive-btn" role="menuitem"><span>${poem.archived ? 'Unarchive poem' : 'Archive poem'}</span>${ICONS.archive}</button>
      <button type="button" class="ios-menu-item danger" id="m-delete-btn" role="menuitem"><span>Delete poem</span>${ICONS.trash}</button>
    </div>
  ` : '';

  return `
    <div ${state.share ? 'inert ' : ''}class="studio${state.focusMode ? ' is-focus' : ''}${state.mobileSheetOpen ? ' has-sheet' : ''}" data-view="studio-${esc(poem.id)}">
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
            <button type="button" class="btn sm desktop-only" id="copy-image-btn" title="Copy this page as an image">${ICONS.copy} Copy image</button>
            <button type="button" class="btn sm primary" id="share-btn">${ICONS.share} Share</button>
            <div class="menu-wrap mobile-only">
              <button type="button" class="btn sm icon-only" id="more-btn" aria-label="More options" aria-expanded="${state.moreOpen}">${ICONS.more}</button>
              ${mobileMoreMenu}
            </div>
          </div>
        </div>

        <div class="stage-canvas-wrap">
          ${carouselNavHTML}
          <div class="sheet-holder" id="sheet-holder">${renderSheetHTML(poem, { editable: !st.carousel, editingRich: state.editingRich, slide: activeSlide })}</div>
        </div>

        <div class="stage-footer">
          <span id="metrics-lbl">${m.stanzas} ${m.stanzas === 1 ? 'stanza' : 'stanzas'} · ${m.lines} ${m.lines === 1 ? 'line' : 'lines'} · ${m.words} words · ~${m.syllables} syllables</span>
          <span class="stage-tip">${longHint.replace(/^<span class="stage-tip">|<\/span>$/g, '')}</span>
          <span class="save-chip${saveWarned ? ' is-off' : ''}" title="Poems are kept in this browser, on this device. Use Backup on the home page to keep a copy elsewhere.">${saveWarned ? 'Not saved: storage is full' : `${ICONS.check} Saved on this device`}</span>
        </div>
      </div>

      <div class="sheet-scrim${state.mobileSheetOpen ? ' open' : ''}" id="sheet-scrim"></div>

      <aside class="studio-rail${state.mobileSheetOpen ? ' sheet-open' : ''}${state.sheetTall ? ' is-tall' : ''}" aria-label="Poem design inspector">
        <button type="button" class="sheet-grabber" id="sheet-grabber" aria-label="${state.sheetTall ? 'Make the panel smaller' : 'Make the panel taller'}"></button>
        <div class="rail-tabs" role="tablist" style="--tab:${tabMeta.findIndex(t => t.id === state.railTab)}">
          ${tabMeta.map(tb => `<button type="button" role="tab" aria-selected="${state.railTab === tb.id}" class="rail-tab${state.railTab === tb.id ? ' on' : ''}" data-railtab="${tb.id}">${tb.label}${changed?.includes(tb.layer) ? '<i class="tab-dot" title="Changed from the look"></i>' : ''}</button>`).join('')}
        </div>
        <div class="rail-note">${railNote}<button type="button" class="icon-btn sheet-close" id="sheet-done-btn" aria-label="Close panel">${ICONS.down}</button></div>
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
            <span>${tb.label}${changed?.includes(tb.layer) ? '<i class="tab-dot"></i>' : ''}</span>
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
  const cs = getComputedStyle(stage);
  const w = stage.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  const baseW = SHEET_W[cls];
  zoom = Math.min(cls === 'rat-auto' ? 1.2 : 1.6, w / baseW);
  if (desktopStage.matches && SHEET_RATIO[cls]) {
    const nav = stage.querySelector('.carousel-nav');
    const h = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (nav ? nav.offsetHeight + 14 : 0);
    zoom = Math.max(0.6, Math.min(zoom, h / (baseW / SHEET_RATIO[cls])));
  }
  root.setProperty('--stage-zoom', zoom.toFixed(3));
  if (!desktopStage.matches && state.mobileSheetOpen) {
    // The panel's resting height (see .studio-rail), not its height mid-drag or when made taller
    const dock = document.querySelector('.ios-dock')?.offsetHeight || 0;
    const rest = Math.min(innerHeight * 0.5, 500);
    const free = stage.clientHeight - rest - dock - 24;
    const tall = SHEET_RATIO[cls] ? (baseW / SHEET_RATIO[cls]) * zoom : sheet.offsetHeight * zoom;
    lift = Math.max(0.36, Math.min(1, free / tall));
    const padT = parseFloat(cs.paddingTop);
    const top = padT + Math.max(0, (stage.clientHeight - padT - parseFloat(cs.paddingBottom) - tall) / 2) - stage.scrollTop;
    rise = (12 - top) / zoom;
  }
  root.setProperty('--stage-lift', lift.toFixed(3));
  root.setProperty('--stage-rise', Math.round(rise) + 'px');
}

const stageObserver = new ResizeObserver(() => fitStage());

// Thumbnails are the real sheet, scaled to their frame
function fitThumbs() {
  for (const grid of document.querySelectorAll('.anthology-grid')) {
    const gap = innerWidth <= 600 ? 12 : 22;
    const meta = innerWidth <= 600 ? 32 : 44;
    for (const card of grid.children) {
      const frame = card.querySelector('.poem-card-frame');
      const sheet = card.querySelector('.poem-sheet');
      if (!sheet) { card.style.gridRowEnd = `span ${Math.round(frame.clientWidth / 0.8 + meta + gap)}`; continue; }
      const cls = Object.keys(SHEET_W).find(c => sheet.classList.contains(c));
      const w = frame.clientWidth;
      frame.style.setProperty('--thumb', (w / SHEET_W[cls]).toFixed(4));
      card.style.gridRowEnd = `span ${Math.round(w / SHEET_RATIO[cls] + meta + gap)}`;
    }
  }
  const look = document.querySelector('.look-frame');
  if (look) document.documentElement.style.setProperty('--look', (look.clientWidth / SHEET_W['rat-4-5']).toFixed(4));
}
const thumbObserver = new ResizeObserver(() => { fitThumbs(); fitOverlay(); });
thumbObserver.observe(document.body);

function fitSheets() {
  document.querySelectorAll('.poem-sheet[data-fit]').forEach(n => fitSheet(n));
  fitOverlay();
}
let refit = 0;
document.fonts?.addEventListener?.('loadingdone', () => {
  clearTimeout(refit);
  refit = setTimeout(() => { clearFits(); render(); }, 120);
});

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
  if (sheet) fitSheet(sheet, { cache: false });
}

/* ---------- Rendering ---------- */

// A copy of the current sheet, laid over the new one and faded away.
function captureGhost() {
  const sheet = document.getElementById('active-poem-sheet');
  if (!sheet || document.hidden) return null;
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

function playGhost(cap, dir = 0) {
  const holder = sheetHolder();
  if (!holder || !cap.sheet.isConnected || cap.sheet.outerHTML === cap.before) return;
  holder.querySelectorAll('.sheet-ghost').forEach(n => n.remove());
  holder.appendChild(cap.ghost);
  const done = () => cap.ghost.remove();
  const travel = calm() ? 0 : dir * 46;
  const ease = 'cubic-bezier(0.32, 0.72, 0, 1)';
  cap.ghost.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `translateX(${-travel}px)` }], { duration: dir ? 340 : 260, easing: dir ? ease : 'ease-out', fill: 'forwards' }).finished.then(done, done);
  if (travel) cap.sheet.animate([{ transform: `translateX(${travel}px)` }, { transform: 'none' }], { duration: 340, easing: ease });
  setTimeout(done, 480); // never leave the copy behind if frames stall
}

// Looks are real posters, so paint them as they come into reach rather than all at once
const moreLooks = new IntersectionObserver(seen => {
  if (!seen.some(s => s.isIntersecting)) return;
  state.looksShown += 12;
  render();
}, { rootMargin: '500px 0px' });
let watchedMore = null;

let observedStage = null;
function render({ fade = false, dir = 0 } = {}) {
  const root = document.getElementById('app');
  if (!root) return;
  const poem = getActivePoem();
  const cap = fade && poem ? captureGhost() : null;
  morph(root, poem ? renderStudio(poem) + renderShare() : renderGallery());
  document.title = poem ? `${poem.title || 'Untitled poem'} · Bulbul` : 'Bulbul · For words that sing';

  const stage = document.querySelector('.stage-canvas-wrap');
  if (stage !== observedStage) {
    stageObserver.disconnect();
    if (stage) stageObserver.observe(stage);
    observedStage = stage;
  }
  const more = document.querySelector('.look-more');
  if (more !== watchedMore) {
    if (watchedMore) moreLooks.unobserve(watchedMore);
    watchedMore = more;
  }
  if (more) { moreLooks.unobserve(more); moreLooks.observe(more); }
  if (poem) {
    fitStage();
    autoSizeTextarea();
  }
  fitThumbs();
  fitSheets();
  if (cap) playGhost(cap, dir);
}

// Re-render the anthology, gliding cards that stay to their new place.
function renderGalleryFlow() {
  const cards = () => Array.from(document.querySelectorAll('.poem-card'));
  const was = new Map(cards().map(c => [c.dataset.open || c.dataset.example || c.id, c.getBoundingClientRect()]));
  render();
  const head = document.querySelector('.gallery-head');
  const grid = document.querySelector('.anthology-grid');
  const bar = document.querySelector('.filter-bar');
  if (head && grid && bar && grid.getBoundingClientRect().top < bar.getBoundingClientRect().bottom - 4) {
    window.scrollBy(0, grid.getBoundingClientRect().top - bar.getBoundingClientRect().bottom - 8);
  }
  for (const card of cards()) {
    card.getAnimations().forEach(a => a.cancel());
    const from = was.get(card.dataset.open || card.dataset.example || card.id);
    const to = card.getBoundingClientRect();
    if (!from) {
      card.animate([{ opacity: 0, transform: calm() ? 'none' : 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 280, easing: 'ease-out' });
      continue;
    }
    const dx = from.left - to.left;
    const dy = from.top - to.top;
    if (Math.abs(dx) < 1 && Math.abs(dy) < 1) continue;
    if (calm()) { card.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: 'ease-out' }); continue; }
    card.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'none' }], { duration: 460, easing: 'cubic-bezier(0.22, 0.9, 0.24, 1)' });
  }
}

// Bring the selected category into view inside its own scroller, without moving anything else.
function revealSubtab() {
  const on = document.querySelector('.subtab.on');
  const bar = on?.parentElement;
  if (!bar) return;
  bar.scrollTo({ left: on.offsetLeft - (bar.clientWidth - on.offsetWidth) / 2, behavior: calm() ? 'auto' : 'smooth' });
}

/* ---------- Actions ---------- */

function toggleTheme() {
  transitionView(() => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
    localStorage.setItem(THEME_KEY, state.theme);
    state.moreOpen = false;
    render();
  });
}

function toggleMotion() {
  const next = calm() ? 'full' : 'calm';
  localStorage.setItem(MOTION_KEY, next);
  applyMotion();
  state.moreOpen = false;
  render();
  toast(next === 'full' ? 'Motion on' : 'Motion off');
}

const STYLE_KEYS = ['look', 'bgMode', 'painting', 'paper', 'paperPick', 'layout', 'wash', 'font', 'align', 'textStyle', 'titleStyle', 'inkColor', 'rhythm', 'textSize', 'textX', 'textY', 'frame', 'texture', 'atmos', 'light', 'charm', 'charmPos'];
function pickLook(id) {
  const l = LOOKS.find(x => x.id === id);
  const poem = getActivePoem();
  if (!l || !poem) return;
  state.editingRich = false;
  const before = Object.fromEntries(STYLE_KEYS.map(k => [k, poem[k]]));
  const patch = { ...lookPatch(l, poem), look: l.id };
  const art = patch.bgMode === 'art' ? ARTWORKS.find(a => a.id === patch.painting) : null;
  const assets = [art?.src, patch.atmos && finishSrc(patch.atmos), patch.light && finishSrc(patch.light), patch.charm && finishSrc(patch.charm)];
  patchWhenReady(Promise.all([...assets.map(imageReady), fontReady(patch.font, poem.body)]), patch, () => {
    if (art) state.artSub = art.grp;
    toast(`Look: ${l.name}`, 4200, { label: 'Undo', run: () => { if (getActivePoem() === poem) patchActive(before); } });
  });
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
  const look = LOOKS[Math.floor(Math.random() * LOOKS.length)];
  state.moreOpen = false;
  render();
  pickLook(look.id);
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

function pickArt(id) {
  const pt = ARTWORKS.find(a => a.id === id);
  const poem = getActivePoem();
  if (!pt || !poem) return;
  const st = resolveStyle(poem);
  // Only the picture changes. It moves only when it can't sit where the last one did.
  const loose = pt.contain || pt.blend === 'multiply';
  const keep = st.bgMode === 'art' && !(loose && st.layout === 'overlay');
  const patch = { bgMode: 'art', painting: pt.id };
  if (!keep) Object.assign(patch, { layout: pt.defLayout || 'side', textX: 0, textY: 0 });
  patchWhenReady(imageReady(pt.src), patch);
}

function removePicture() {
  const st = resolveStyle(getActivePoem());
  patchActive({ bgMode: 'solid', layout: 'overlay', paper: st.paperPick || st.paper.id, textX: 0, textY: 0 });
}

function pickFinish(key, id) {
  const patch = { [key]: id };
  if (key === 'charm') patch.charmPos = '';
  patchWhenReady(imageReady(id && finishSrc(id)), patch);
}

function pickPaper(id) {
  const st = resolveStyle(getActivePoem());
  if (st.bgMode !== 'art') { patchActive({ bgMode: 'solid', paper: id }); return; }
  const patch = { paperPick: id };
  // A picture that fills the page would hide the paper, so frame it instead.
  if (id && st.layout === 'overlay') patch.layout = st.painting.defLayout && st.painting.defLayout !== 'overlay' ? st.painting.defLayout : 'arch';
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
function closeSheet() { state.mobileSheetOpen = false; state.sheetTall = false; render(); }
function goToSlide(i) { const dir = Math.sign(i - state.slideIdx); state.slideIdx = i; render({ fade: true, dir }); }

/* ---------- Phone gestures ---------- */

const rootStyle = document.documentElement.style;
let held = null;
const railDrag = {
  selector: '.studio-rail.sheet-open',
  handle: '.sheet-grabber, .rail-note',
  up: true,
  start(rail) {
    held = {
      h: rail.offsetHeight,
      max: Math.round(innerHeight * 0.86),
      lift: parseFloat(rootStyle.getPropertyValue('--stage-lift')) || 1,
      rise: parseFloat(rootStyle.getPropertyValue('--stage-rise')) || 0
    };
    document.documentElement.classList.add('is-dragging-panel');
  },
  move(rail, dy) {
    if (dy < 0) {
      const room = state.sheetTall ? dy * 0.12 : dy;
      rail.style.transform = '';
      rail.style.height = Math.min(held.max + 16, held.h - room) + 'px';
      return;
    }
    rail.style.height = held.h + 'px';
    rail.style.transform = `translateY(${dy}px)`;
    // The poem grows back as the panel leaves
    const p = Math.min(1, dy / held.h);
    rootStyle.setProperty('--stage-lift', (held.lift + (1 - held.lift) * p).toFixed(3));
    rootStyle.setProperty('--stage-rise', (held.rise * (1 - p)).toFixed(1) + 'px');
  },
  end(rail, dy, v) {
    document.documentElement.classList.remove('is-dragging-panel');
    if (state.sheetTall) {
      if (v > 1.1 || dy > held.h * 0.5) { closeSheet(); return; }
      if (v > 0.35 || dy > held.h * 0.12) state.sheetTall = false;
    } else if (v > 0.45 || dy > held.h * 0.3) {
      closeSheet();
      return;
    } else if (v < -0.4 || dy < -56) {
      state.sheetTall = true;
    }
    render(); // clears the inline position, so the panel eases to where it belongs
  }
};
const panelDrag = {
  selector: '.panel',
  handle: '.panel-grab',
  start(panel) { panel.getAnimations().forEach(a => a.finish()); },
  move(panel, dy) { panel.style.transform = `translateY(${dy > 0 ? dy : dy * 0.12}px)`; },
  end(panel, dy, v) {
    const from = panel.style.transform || 'none';
    panel.style.transform = '';
    const away = v > 0.5 || dy > Math.min(220, panel.offsetHeight * 0.26);
    const move = panel.animate([{ transform: from }, { transform: away ? 'translateY(104%)' : 'none' }], { duration: away ? 220 : 300, easing: 'cubic-bezier(.2, .8, .2, 1)', fill: away ? 'forwards' : 'none' });
    if (away) {
      document.querySelector('.overlay-scrim')?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' });
      let done = false;
      const close = () => { if (!done) { done = true; closeOverlay(); } };
      move.finished.then(close, close);
      setTimeout(close, 320);
    }
  }
};
initGestures({
  panels: [railDrag, panelDrag],
  swipes: [
    { selector: '.share-view', go: d => document.querySelector(`.share-view [data-spage]:${d > 0 ? 'last' : 'first'}-of-type:not([disabled])`)?.click() },
    { selector: '.viewer-stage', go: d => {
      const turn = document.querySelector(`.viewer [data-vslide]:${d > 0 ? 'last' : 'first'}-of-type:not([disabled])`);
      (turn || document.querySelector(`[data-vstep="${d}"]`))?.click();
    } },
    { selector: '.stage-canvas-wrap', go: d => { if (getActivePoem()?.carousel) document.getElementById(d > 0 ? 'next-slide-btn' : 'prev-slide-btn')?.click(); } }
  ]
});

/* ---------- Events: one set of listeners, delegated from the document ---------- */

const CLICKS = [
  ['#theme-btn, #m-theme-btn', toggleTheme],
  ['#motion-btn, #m-motion-btn', toggleMotion],
  ['#more-btn', () => { state.moreOpen = !state.moreOpen; render(); }],

  // Anthology
  ['#new-poem-btn, #mobile-new-btn, #empty-new-btn, #new-card-btn', () => createPoem()],
  ['#spark-use', () => createPoem({ spark: todaysSpark() })],
  ['#spark-next', () => { state.sparkShift += 1; render(); }],
  ['[data-startlook]', el => createPoem({ lookId: el.dataset.startlook })],
  ['[data-bloom]', el => (el.dataset.bloom.startsWith('ex-') ? viewExample(el.dataset.bloom) : openPoem(el.dataset.bloom))],
  ['[data-song]', el => (el.dataset.song.startsWith('ex-') ? viewExample(el.dataset.song) : openPoem(el.dataset.song))],
  ['#bird', () => hopTo((state.perch + 1 + Math.floor(Math.random() * (PERCHES.length - 1))) % PERCHES.length, pickSong())],
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
  ['#m-copy-btn', doCopy],
  ['#copy-image-btn, #m-copy-image-btn', quickCopyImage],
  ['#share-btn', openShare],

  // Overlays
  ['[data-close]', closeOverlay],
  ['[data-shareto]', el => setShare({ platform: el.dataset.shareto })],
  ['[data-split]', el => setShare({ split: el.dataset.split === '1', page: 0 })],
  ['[data-spage]', el => setShare({ page: Number(el.dataset.spage) })],
  ['#share-copy', () => shareCopyImage().then(ok => shareNote(ok ? (state.share?.as === 'mock' ? 'Mockup copied' : 'Image copied') : 'Your browser blocked copying. Download the image instead.'))],
  ['#share-download', () => shareDownload()],
  ['#mock-download', () => shareDownload({ all: false })],
  ['#mock-all', () => shareDownload({ all: 'mocks' })],
  ['[data-as]', el => setShare({ as: el.dataset.as })],
  ['[data-backdrop]', el => setShare({ backdrop: el.dataset.backdrop })],
  ['#share-send', shareSend],
  ['#share-system', shareSystem],
  ['#share-text', () => doCopy().then(() => {})],
  ['[data-vslide]', el => { state.viewing.slide = Number(el.dataset.vslide); render(); }],
  ['[data-vstep]', el => {
    const i = EXAMPLES.findIndex(p => p.id === state.viewing.id);
    state.viewing = { id: EXAMPLES[(i + Number(el.dataset.vstep) + EXAMPLES.length) % EXAMPLES.length].id, slide: 0 };
    render();
  }],
  ['#ex-style-btn', () => fromExample(false)],
  ['#ex-copy-btn', () => fromExample(true)],
  ['[data-example]', el => viewExample(el.dataset.example)],
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
  ['#sheet-scrim, #sheet-done-btn', closeSheet],
  ['#sheet-grabber', () => { state.sheetTall = !state.sheetTall; render(); }],
  ['[data-railtab]', el => setTab(el.dataset.railtab)],
  ['[data-artsub]', el => { state.artSub = el.dataset.artsub; render(); revealSubtab(); }],
  ['[data-fontcat]', el => { state.fontCat = el.dataset.fontcat; render(); revealSubtab(); }],

  // Looks and finishes
  ['[data-look]', el => pickLook(el.dataset.look)],
  ['#look-reset-btn', () => pickLook(getActivePoem().look)],
  ['#no-picture-btn', removePicture],
  ['[data-lookcat]', el => { state.lookCat = el.dataset.lookcat; state.looksShown = 16; render(); revealSubtab(); }],
  ['[data-atmos]', el => pickFinish('atmos', el.dataset.atmos)],
  ['[data-light]', el => pickFinish('light', el.dataset.light)],
  ['[data-charmpos]', el => patchActive({ charmPos: el.dataset.charmpos })],
  ['[data-charm]', el => pickFinish('charm', el.dataset.charm)],

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
  ['#share-caption', el => editShare('caption', el.value)],
  ['#share-who', el => { localStorage.setItem(NAME_KEY, el.value.trim()); editShare('who', el.value); }],
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
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's' && state.activeId) {
    e.preventDefault();
    toast('Already saved on this device. Use Share to download.');
  }
  if (e.key === 'Escape') {
    if (state.share || state.viewing) { closeOverlay(); return; }
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
setTimeout(() => document.getElementById('app')?.setAttribute('data-ready', ''), 900);
if (!state.activeId) sing(pickSong(), 1600);
