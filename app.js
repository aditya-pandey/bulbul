import {
  ARTWORKS, PAPERS, FONTS, FONT_CATS, LAYOUTS, FLOWS, FRAMES, RATIOS, TEXT_SIZES, TEXT_STYLES,
  TITLE_STYLES, TEXTURES, INK_SWATCHES, RHYTHMS, MOODS, ATMOS, LIGHTS, CHARMS,
  LOOKS, LOOK_CATS, lookPatch, isHindi, finishSrc,
  BLOOMS, PERCHES, SPARKS, changedLayers,
  OLD_SAMPLES,
  poemMetrics, computeTypeScale, paginatePoem, resolveStyle
} from './data.js';
import { mountEditor, onEditor, focusEditor, editorFocused, caretSlide, mark, breakHere } from './editor.js';
import { PLACEMENT, FLOW, FRAME, TITLE, LINE, ALIGN } from './pictos.js';
import { inkAdvice } from './contrast.js';
import { fitMock, MOCK_W, MOCK_H } from './snapshot.js';
import { initGestures } from './gestures.js';
import { EXAMPLES } from './examples.js';
import { PLATFORMS, platformOf, captionFor, sharePages, poster, mockup, mockStage, BACKDROPS, backdropCSS, copyImage, canShareFiles, shareFiles, downloadPoster } from './share.js';
import { morph } from './morph.js';
import { renderSheetHTML, fitSheet, clearFits, esc, stripEmphasis, SHEET_W, SHEET_RATIO } from './sheet.js';

// Storage keys predate the current name. Keep them: renaming would orphan saved poems.
const STORAGE_KEY = 'noor.poems.v1';
const THEME_KEY = 'noor.theme';
const SHARE_KEY = 'noor.share';
const MINE_KEY = 'noor.looks.mine';
const RECENT_KEY = 'noor.looks.recent';
const BEGAN_KEY = 'noor.began';
const HINT_KEY = 'noor.hints';
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
  undo: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5L4 9l4 4M4 9h10a6 6 0 0 1 0 12h-3"/></svg>`,
  redo: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 5l4 4-4 4M20 9H10a6 6 0 0 0 0 12h3"/></svg>`,
  heart: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20s-7.5-4.6-7.5-10.1A4.3 4.3 0 0 1 12 7.200a4.3 4.3 0 0 1 7.5 2.700C19.5 15.4 12 20 12 20z"/></svg>`,
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

const FORMATS = [
  { id: '4:5', label: 'Post', note: '4 × 5', w: 11, h: 14 },
  { id: '1:1', label: 'Square', note: '1 × 1', w: 13, h: 13 },
  { id: '9:16', label: 'Story', note: '9 × 16', w: 9, h: 16 },
  { id: '2:3', label: 'Pin', note: '2 × 3', w: 10.5, h: 15.5 },
  { id: 'auto', label: 'Long page', note: 'Full length', w: 8, h: 18 }
];
const formatIcon = f => `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="${(20 - f.w) / 2}" y="${(20 - f.h) / 2}" width="${f.w}" height="${f.h}" rx="1.8"/>${f.id === 'auto' ? '<path d="M8.5 6h3M8.5 9h3M8.5 12h3"/>' : ''}</svg>`;

let saveWarned = false;
function savePoems(poems) {
  const had = saveWarned;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(poems));
    saveWarned = false;
  } catch {
    saveWarned = true;
  }
  if (had !== saveWarned && typeof state !== 'undefined' && document.getElementById('app')?.firstElementChild) queueMicrotask(render);
}

/* ---------- States: what happened, and one thing to do ---------- */

// Browsers give a site about 5 MB here; text is counted two bytes a letter.
const ROOM = 5 * 1024 * 1024;
function roomUsed() {
  let n = 0;
  try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); n += k.length + (localStorage.getItem(k) || '').length; } } catch {}
  return (n * 2) / (ROOM * 2);
}
let offlineSeen = false;
let roomSeen = false;
function currentNotice() {
  if (saveWarned) return { id: 'unsaved', text: '<b>This change isn’t saved.</b> There is no room left on this device.', label: 'Save a backup', urgent: true };
  if (!navigator.onLine && !offlineSeen) return { id: 'offline', text: '<b>You’re offline.</b> Keep writing. New fonts will come when you’re back.', label: 'All right' };
  if (!roomSeen && roomUsed() > 0.8) return { id: 'room', text: '<b>Nearly out of room here.</b> Photos take the most. Keep a copy of your poems.', label: 'Save a backup' };
  return null;
}
function renderNotice() {
  const n = currentNotice();
  return n ? `<div class="notice" data-notice="${n.id}" role="${n.urgent ? 'alert' : 'status'}"><p>${n.text}</p><button type="button" class="note-btn" id="notice-act">${n.label}</button></div>` : '';
}
function noticeAct() {
  const n = currentNotice();
  if (!n) return;
  if (n.id === 'offline') offlineSeen = true;
  else { if (n.id === 'room') roomSeen = true; doBackup(); }
  render();
}
for (const t of ['online', 'offline']) window.addEventListener(t, () => { if (t === 'online') offlineSeen = false; render(); });

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
  lookCat: 'you',
  applying: '',
  looksShown: 16,
  artSub: 'minimal',
  fontCat: 'all',
  typeSeg: 'font',
  marks: {},
  full: false,
  formatOpen: false,
  mobileSheetOpen: false,
  sheetTall: false,
  moreOpen: false,
  slideIdx: 0,
  editingRich: false,
  viewing: null,
  help: false,
  examplesOpen: false,
  heard: '',
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

/* Undo: each change remembers only what it changed, so undoing a frame never touches the words. */
const history_ = new Map();
const histOf = id => { if (!history_.has(id)) history_.set(id, { past: [], future: [] }); return history_.get(id); };
function recordChange(poem, patch, label) {
  const keys = Object.keys(patch).filter(k => poem[k] !== patch[k]);
  if (!keys.length) return;
  const h = histOf(poem.id);
  const name = keys.join();
  const last = h.past[h.past.length - 1];
  const after = Object.fromEntries(keys.map(k => [k, patch[k]]));
  // A slider or a drag is one change, not fifty
  if (last && last.name === name && Date.now() - last.at < 700 && !label) { last.after = after; last.at = Date.now(); h.future = []; return; }
  h.past.push({ name, at: Date.now(), before: Object.fromEntries(keys.map(k => [k, poem[k]])), after });
  if (h.past.length > 120) h.past.shift();
  h.future = [];
}
function stepHistory(back) {
  const poem = getActivePoem();
  if (!poem) return;
  const h = histOf(poem.id);
  const step = (back ? h.past : h.future).pop();
  if (!step) return;
  (back ? h.future : h.past).push({ ...step, at: 0 });
  state.editingRich = false;
  patchActive(back ? step.before : step.after, { keep: false });
}
const canStep = back => { const h = history_.get(state.activeId); return Boolean(h && (back ? h.past : h.future).length); };

function patchActive(patch, { rerender = true, fade = true, keep = true, label = '' } = {}) {
  const p = getActivePoem();
  if (!p) return;
  if (keep) recordChange(p, patch, label);
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
    state.applying = '';
    state.lookCat = 'you';
    // A blank page opens ready to write
    const blank = !p.title && !p.body;
    if (blank) state.railTab = 'write';
    state.formatOpen = false;
    state.marks = {};
    state.mobileSheetOpen = blank && !desktopStage.matches;
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
  begin();
  state.poems.unshift(p);
  savePoems(state.poems);
  openPoem(p.id);
  setTimeout(() => focusEditor(), 40);
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
        ${state.song ? `<button type="button" class="song ${px < 46 ? 'to-right' : 'to-left'}${py < 46 ? ' is-low' : ''}" data-song="${esc(state.song.id)}" style="left:${px}%;top:${py}%">${esc(state.song.line)}</button>` : ''}
        <span class="petal p1"></span><span class="petal p2"></span><span class="petal p3"></span>
        <p class="branch-note">${kept.length ? 'A blossom for every poem' : 'Examples, until yours bloom'}</p>
      </div>
    </section>`;
}

// A carousel shows its first slide, as it would arrive
// The opening of a long poem, for small previews: whole, it would be too small to read
function firstOf(p, ratio) {
  const pages = paginatePoem(p.body, { ratio, layout: resolveStyle(p).layout });
  return pages.length > 1 ? { ...p, body: pages[0].text, sign: '' } : p;
}
function thumbHTML(p, ratio) {
  const st = resolveStyle(p);
  const pages = st.carousel ? paginatePoem(p.body, { ratio, layout: st.layout }) : null;
  if (!pages && st.ratio === 'auto') return renderSheetHTML(firstOf(p, ratio), { thumb: true, ratio });
  return renderSheetHTML(p, { thumb: true, ratio, slide: pages && pages.length > 1 ? pages[0] : null });
}
const thumbRatio = st => (st.ratio === 'auto' ? (st.carousel ? '4:5' : '2:3') : st.ratio);

function renderExamples() {
  // Once there is a body of work, the examples step back to one row
  const tuck = state.poems.filter(p => !p.archived).length >= 3;
  const row = tuck && !state.examplesOpen;
  return `
    <section class="home-examples">
      <div class="home-top"><h2 class="home-h">Made in Bulbul</h2>${tuck ? `<button type="button" class="note-btn" id="examples-all" aria-expanded="${state.examplesOpen}">${state.examplesOpen ? 'Show fewer' : 'See all'}</button>` : '<span class="gallery-stat">Poems by Aditya</span>'}</div>
      <div class="${row ? 'example-row' : 'anthology-grid'}" data-grid="examples-${row ? 'row' : 'all'}">${EXAMPLES.map(p => {
        const st = resolveStyle(p);
        const r = thumbRatio(st);
        return `
          <button type="button" class="poem-card" data-example="${p.id}" aria-label="${esc(p.title)}, ${esc(p.kind)}">
            <span class="poem-card-frame${st.carousel ? ' is-stack' : ''}" data-thumb-cls="rat-${r.replace(':', '-')}" style="aspect-ratio:${r.replace(':', ' / ')}"><span class="thumb-scale">${thumbHTML(p, r)}</span></span>
            <span class="poem-card-meta"><span class="poem-card-title"><span>${esc(p.title)}</span></span><span class="poem-card-sub">${esc(p.kind)}</span></span>
          </button>`;
      }).join('')}</div>
    </section>`;
}

/* ---------- First hints: one at a time, gone once done ---------- */

const HINTS = ['Write your first line.', 'Tap Looks and try one.', 'Share it when it feels done.'];
function hintAt() {
  const n = localStorage.getItem(HINT_KEY);
  const at = n === null ? (state.poems.length > 1 ? HINTS.length : 0) : Number(n);
  return at === 0 && String(getActivePoem()?.body || '').trim().length > 2 ? 1 : at;
}
function hintDone(i) {
  if (hintAt() !== i && !(i === 0 && !Number(localStorage.getItem(HINT_KEY)) && hintAt() === 1)) return;
  localStorage.setItem(HINT_KEY, String(i + 1));
  if (state.activeId) render();
}
const renderHint = () => (HINTS[hintAt()] ? `<p class="hint-line" data-hint="${hintAt()}" role="status">${HINTS[hintAt()]}</p>` : '');

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
  rememberFocus();
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
  else setTimeout(() => focusEditor(), 60);
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
  hintDone(2);
  const last = localStorage.getItem(SHARE_KEY);
  state.share = { platform: PLATFORMS.some(p => p.id === last) ? last : 'image', split: st.carousel, page: state.slideIdx, caption: captionFor(poem), who: (poem.sign || '').replace(/^[\s—–~-]+/, '').trim() || localStorage.getItem(NAME_KEY) || '', as: 'page', backdrop: 'poem', ready: false, note: '' };
  if (platformOf(state.share.platform).ratio && poemMetrics(poem.body).lines > 22) state.share.split = true;
  render();
  prepareShare();
  document.querySelector('.share [data-close]')?.focus({ preventScroll: true });
}
let overlayFrom = null; // what opened the overlay, so focus can go back
function rememberFocus() {
  const el = document.activeElement;
  overlayFrom = el?.id ? '#' + el.id : el?.dataset?.example ? `[data-example="${el.dataset.example}"]` : el?.dataset?.bloom ? `[data-bloom="${el.dataset.bloom}"]` : null;
}
function closeOverlay() {
  const back = state.share ? '#share-btn' : overlayFrom;
  state.share = null;
  state.viewing = null;
  state.help = false;
  render();
  if (back) document.querySelector(back)?.focus({ preventScroll: true });
}
function openHelp() {
  rememberFocus();
  state.help = true;
  render();
  document.querySelector('.help [data-close]')?.focus();
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
  now.sh.failed = false;
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
    if (run === shareRun && state.share) { now.sh.failed = true; render(); }
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
    hum(12);
  shareNote(which.length > 1 ? `Downloaded ${which.length} images` : 'Downloaded');
  } catch (err) {
    console.error(err);
    if (state.share) { state.share.failed = true; render(); }
  }
}
async function shareSystem() {
  const now = shareNow();
  if (!now?.sh.posters) return;
  try {
    await shareFiles(now.sh.posters, now.mock ? '' : now.sh.caption);
  } catch (err) {
    if (err?.name !== 'AbortError') shareNote('This browser can’t share images. Download it instead.');
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
    done.then(ok => shareNote(ok ? `Image copied. Paste it into ${platform.label}${now.pages.length > 1 ? ', then copy the next slide here' : ''}.` : `This browser won’t copy images. Download it and add it in ${platform.label}.`));
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
  const busy = setTimeout(() => toast('Getting the image ready', 1400), 350);
  const ok = await copyImage(poster(poem, ratio, page).then(p => p.blob)).then(() => true, () => false);
  clearTimeout(busy);
  toast(ok ? (pages.length > 1 ? `Copied slide ${page.index + 1} as an image` : 'Copied as an image') : 'This browser won’t copy images. Share can download it.', 2800);
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

// What the image says and shows, for people who can't see it
function altText(poem, page) {
  const st = resolveStyle(poem);
  const words = stripEmphasis(String((page && page.total > 1 ? page.text : poem.body) || '').replace(/^\s*[-—]{3,}\s*$/gm, '').trim());
  const by = (poem.sign || '').replace(/^[\s—–~-]+/, '').trim();
  const scene = st.bgMode === 'art' ? `, with the picture “${st.painting.name}”` : st.bgMode === 'photo' ? ', over a photograph' : '';
  const head = `A poem${poem.title ? ` titled “${poem.title}”` : ''}${by ? ` by ${by}` : ''}${page && page.total > 1 ? `, slide ${page.index + 1} of ${page.total}` : ''}${scene}.`;
  return `${head}\n\n${words}`;
}
function copyAlt() {
  const now = shareNow();
  if (!now) return;
  navigator.clipboard.writeText(altText(now.poem, now.pages[now.at])).then(() => shareNote('Alt text copied'), () => shareNote('Copying isn’t allowed here.'));
}

function renderShare() {
  const now = shareNow();
  if (!now) return '';
  const { sh, platform, ratio, pages, at, poem } = now;
  const many = pages.length > 1;
  const canSplit = paginatePoem(poem.body, { ratio: ratio === 'auto' ? '4:5' : ratio, layout: resolveStyle(poem).layout }).length > 1;
  const touch = isTouch() && canShareFiles();
  const sendLabel = platform.send === 'paste' ? `Copy image and open ${platform.label}` : `Download and open ${platform.id === 'story' ? 'Instagram' : platform.label}`;
  const size = ratio === 'auto' ? 'Full length' : ratio.replace(':', ' × ');
  const wait = sh.ready ? '' : 'disabled aria-describedby="share-note"';
  const waitAll = sh.posters ? '' : 'disabled aria-describedby="share-note"';
  const noun = now.mock ? 'mockup' : many ? 'slides' : 'page';
  const note = sh.failed ? '' : sh.note || (sh.ready && (sh.posters || now.mock || !touch) ? '' : `Getting your ${noun} ready. The buttons open in a moment.`);
  const picks = `<div class="share-grid" role="group" aria-label="Where to share">${PLATFORMS.map(p => `<button type="button" class="share-to${p.id === platform.id ? ' on' : ''}" data-shareto="${p.id}" aria-pressed="${p.id === platform.id}">${p.icon}<span>${p.label}</span></button>`).join('')}</div>`;
  const caption = platform.id === 'image' || (now.mock && ['pin', 'story'].includes(platform.id)) ? '' : `<div class="share-cap"><div class="share-cap-top"><label for="share-caption">Caption</label><button type="button" class="quiet-link" id="share-alt">Copy the poem as alt text</button></div><textarea id="share-caption" rows="3">${esc(sh.caption)}</textarea></div>`;
  const failed = sh.failed ? `<div class="state-card" role="alert"><p><b>The image didn’t come out.</b> Your poem is safe.</p><button type="button" class="btn" id="share-retry">Try again</button></div>` : '';
  const acts = touch
    ? `<button type="button" class="btn primary big" id="share-system" ${now.mock ? wait : waitAll}>${ICONS.share} Share</button>
       <div class="share-pair"><button type="button" class="btn" id="share-copy" ${wait}>Copy ${now.mock ? 'mockup' : 'image'}</button>${many && now.mock ? `<button type="button" class="btn" id="mock-all">Download all ${pages.length}</button>` : `<button type="button" class="btn" id="${now.mock ? 'mock-download' : 'share-download'}" ${wait}>Download${many && !now.mock ? ` (${pages.length})` : ''}</button>`}</div>`
    : now.mock
      ? `<button type="button" class="btn primary" id="mock-download" ${wait}>${ICONS.download} Download mockup</button>
         <div class="share-pair"><button type="button" class="btn" id="share-copy" ${wait}>Copy mockup</button>${many ? `<button type="button" class="btn" id="mock-all">Download all ${pages.length}</button>` : canShareFiles() ? `<button type="button" class="btn" id="share-system" ${waitAll}>More apps</button>` : ''}</div>`
      : platform.id === 'image'
        ? `<button type="button" class="btn primary" id="share-copy" ${wait}>${ICONS.copy} Copy image</button>
           <button type="button" class="btn" id="share-download" ${wait}>${ICONS.download} ${many ? `Download ${pages.length} images` : 'Download'}</button>`
        : `<button type="button" class="btn primary" id="share-send" ${wait}>${ICONS.share} ${sendLabel}</button>
           <div class="share-pair"><button type="button" class="btn" id="share-copy" ${wait}>Copy image</button><button type="button" class="btn" id="share-download" ${wait}>Download${many ? ` (${pages.length})` : ''}</button></div>`;
  return `
    <div class="overlay" data-overlay="share">
      <div class="overlay-scrim" data-close></div>
      <div class="panel share" role="dialog" aria-modal="true" aria-label="Share">
        <span class="panel-grab" aria-hidden="true"></span>
        <div class="share-view${now.mock ? ' is-mock' : ''}${sh.ready || sh.failed ? '' : ' is-waiting'}">${now.mock ? `<div class="mock-frame">${now.stage(at)}</div>` : mockHTML(now)}
          ${many ? `<div class="pager"><button type="button" class="icon-btn" data-spage="${at - 1}" ${at ? '' : 'disabled'} aria-label="Previous slide">${ICONS.back}</button><span>${at + 1} of ${pages.length}</span><button type="button" class="icon-btn" data-spage="${at + 1}" ${at < pages.length - 1 ? '' : 'disabled'} aria-label="Next slide">${ICONS.next}</button></div>` : ''}
        </div>
        <div class="share-side">
          <div class="panel-top"><h2 class="panel-title">Share</h2><button type="button" class="icon-btn" data-close aria-label="Close">${ICONS.close}</button></div>
          ${touch ? `<div class="share-acts is-first">${acts}</div>` : ''}
          ${picks}
          <div class="share-row"><div class="seg" role="group" aria-label="What to share"><button type="button" class="seg-btn${now.mock ? '' : ' on'}" data-as="page">Page</button><button type="button" class="seg-btn${now.mock ? ' on' : ''}" data-as="mock">Mockup</button></div><span class="share-size">${now.mock ? '1080 × 1350' : size}</span></div>
          ${now.mock ? `<div class="share-row"><span>Backdrop</span><div class="backdrops">${BACKDROPS.map(bd => `<button type="button" class="bd-dot bd-${bd.id}${bd.id === sh.backdrop ? ' on' : ''}" data-backdrop="${bd.id}" title="${bd.label}" aria-label="${bd.label}" aria-pressed="${bd.id === sh.backdrop}" style="${backdropCSS(bd.id, poem).css}"></button>`).join('')}</div></div>` : ''}
          ${canSplit ? `<div class="share-row"><span>Long poem</span><div class="seg"><button type="button" class="seg-btn${sh.split ? '' : ' on'}" data-split="0">One image</button><button type="button" class="seg-btn${sh.split ? ' on' : ''}" data-split="1">Slides</button></div></div>` : ''}
          ${platform.id === 'image' || !now.mock ? '' : `<label class="share-cap"><span>Name</span><input id="share-who" type="text" autocomplete="off" placeholder="Your name" value="${esc(sh.who)}"></label>`}
          ${caption}
          ${failed}
          <div class="share-acts">
            ${touch ? '' : acts}
            ${!touch && canShareFiles() && !(now.mock && !many) ? `<button type="button" class="btn ghost" id="share-system" ${waitAll}>${ICONS.share} More apps</button>` : ''}
            ${now.mock ? '' : '<button type="button" class="btn ghost" id="share-text">Copy the words</button>'}
            ${platform.id === 'image' && !now.mock ? '<button type="button" class="btn ghost" id="share-alt">Copy the poem as alt text</button>' : ''}
          </div>
          <p class="share-note" id="share-note" role="status">${esc(note)}</p>
        </div>
      </div>
    </div>`;
}

const SHORTCUTS = [
  ['Undo', '⌘ Z', 'Ctrl Z'], ['Redo', '⇧ ⌘ Z', 'Ctrl Y'], ['Share', 'S', 'S'], ['Previous and next slide', '←  →', '←  →'],
  ['Write, Looks, Picture, Type, Page', '1 – 5', '1 – 5'], ['Write', 'W', 'W'], ['Find a poem', '⌘ K', 'Ctrl K'], ['This list', '?', '?']
];
const onMac = /Mac|iPhone|iPad/.test(navigator.platform);
function renderHelp() {
  return state.help ? `
    <div class="overlay" data-overlay="help">
      <div class="overlay-scrim" data-close></div>
      <div class="panel help" role="dialog" aria-modal="true" aria-label="Keyboard shortcuts">
        <div class="panel-top"><h2 class="panel-title">Shortcuts</h2><button type="button" class="icon-btn" data-close aria-label="Close">${ICONS.close}</button></div>
        <dl>${SHORTCUTS.map(([what, mac, pc]) => `<div><dt>${what}</dt><dd><kbd>${onMac ? mac : pc}</kbd></dd></div>`).join('')}</dl>
      </div>
    </div>` : '';
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

function agoText(t) {
  const m = Math.max(0, Math.round((Date.now() - (t || 0)) / 60000));
  if (m < 2) return 'just now';
  if (m < 60) return `${m} minutes ago`;
  if (m < 120) return 'an hour ago';
  if (m < 1440) return `${Math.round(m / 60)} hours ago`;
  if (m < 2880) return 'yesterday';
  return `on ${new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}`;
}

function renderContinue() {
  const last = state.poems.filter(p => !p.archived).sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))[0];
  if (!last) return '';
  const lines = poemLines(last);
  const r = thumbRatio(resolveStyle(last));
  return `
    <button type="button" class="continue" data-open="${esc(last.id)}">
      <span class="continue-art"><span class="continue-frame" data-thumb-cls="rat-${r.replace(':', '-')}" style="aspect-ratio:${r.replace(':', ' / ')}"><span class="thumb-scale">${thumbHTML(last, r)}</span></span></span>
      <span class="continue-words">
        <span class="continue-lbl">Continue writing</span>
        <span class="continue-title">${esc(last.title || 'Untitled poem')}</span>
        <span class="continue-line">${esc(lines[lines.length - 1] || 'An open page')}</span>
        <span class="continue-when">Edited ${agoText(last.updatedAt)}</span>
      </span>
      <span class="continue-go">${ICONS.next}</span>
    </button>`;
}

// Someone who has never begun sees one thing to do
const isFirstRun = () => !state.poems.length && !localStorage.getItem(BEGAN_KEY);
function begin() { localStorage.setItem(BEGAN_KEY, '1'); }
function renderFirstRun() {
  const part = dayPart();
  const [px, py] = PERCHES[state.perch];
  return `
    <div class="first" data-view="first">
      <img class="hero-wash" src="${finishSrc(part.wash)}" alt="">
      <div class="first-brand">${LOCKUP_SVG}<p class="brand-sub">For words that sing</p></div>
      <div class="hero-branch first-branch">
        <div class="branch-sway"><img class="branch-img" src="./assets/home/branch.webp" alt="" width="1300" height="590">
          ${BLOOMS.slice(0, 7).map(([x, y], i) => `<img class="bloom-still" src="./assets/home/bloom-${i % 3 + 1}.webp" alt="" style="left:${x}%;top:${y}%;--i:${i}">`).join('')}
        </div>
        <button type="button" class="bird" id="bird" aria-label="Hear a line" style="left:${px}%;top:${py}%"><span class="bird-turn" style="--face:${state.facing}"><img src="./assets/home/bulbul.webp" alt=""></span></button>
      </div>
      <div class="first-words">
        <p class="first-spark">${esc(todaysSpark())}</p>
        <button type="button" class="btn primary big" id="first-write">Write a poem</button>
        <button type="button" class="quiet-link" id="first-look">Look around first</button>
      </div>
    </div>`;
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
      ], { duration: Math.min(460, 300 + Math.abs(dx) * 0.4), composite: 'add' });
    }
  }
  sing(song);
}
function nearestPerch(x, y) {
  let best = 0;
  PERCHES.forEach(([a, b], i) => { if (Math.hypot(a - x, (b - y) * 0.45) < Math.hypot(PERCHES[best][0] - x, (PERCHES[best][1] - y) * 0.45)) best = i; });
  return best;
}
// On touch, the first tap on a blossom is for listening; the second opens the poem.
let lastPointer = 'mouse';
document.addEventListener('pointerdown', e => { lastPointer = e.pointerType; }, true);
function touchBloom(el) {
  const id = el.dataset.bloom;
  const open = () => (id.startsWith('ex-') ? viewExample(id) : openPoem(id));
  if (lastPointer !== 'touch' || state.heard === id) { state.heard = ''; open(); return; }
  state.heard = id;
  hopTo(nearestPerch(parseFloat(el.style.left), parseFloat(el.style.top)), pickSong(id));
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
  if (isFirstRun()) return renderFirstRun();
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
  const inMood = md => state.poems.some(p => !p.archived && (md === 'Long' ? poemMetrics(p.body).lines >= 14 || p.mood === 'Long' : p.mood === md));
  const pills = ['All', ...MOODS.filter(md => inMood(md) || state.moodFilter === md), ...(archivedCount ? ['Archived'] : [])];

  const none = !state.poems.length && !q;
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
        ${q
          ? `<h2>No poem has “${esc(state.search.trim())}” in it</h2><button type="button" class="btn" id="clear-search">Clear the search</button>`
          : isArchTab
            ? '<h2>Nothing is put away</h2><button type="button" class="btn" data-mood="All">See all poems</button>'
            : `<h2>No poems in ${esc(state.moodFilter)} yet</h2><button type="button" class="btn" data-mood="All">See all poems</button>`}
      </div>`;

  const filterBar = none ? '' : `<div class="filter-bar">
          <div class="mood-pills" role="group" aria-label="Collections">
            ${pills.map(md => `<button type="button" aria-pressed="${state.moodFilter === md}" class="pill${state.moodFilter === md ? ' on' : ''}" data-mood="${esc(md)}">${esc(md)}${md === 'Archived' ? ` (${archivedCount})` : ''}</button>`).join('')}
          </div>
          <span class="gallery-stat">${filtered.length === activeCount || isArchTab ? `${filtered.length} ${filtered.length === 1 ? 'poem' : 'poems'}` : `${filtered.length} of ${activeCount}`}</span>
        </div>`;

  const galleryMenu = state.moreOpen ? `
    <div class="ios-menu" role="menu" aria-label="More">
      <button type="button" class="ios-menu-item" id="m-backup-btn" role="menuitem"><span>Save a backup</span>${ICONS.download}</button>
      <button type="button" class="ios-menu-item" id="m-import-btn" role="menuitem"><span>Restore a backup</span>${ICONS.upload}</button>
      <button type="button" class="ios-menu-item" id="m-motion-btn" role="menuitem"><span>${calm() ? 'Turn motion on' : 'Turn motion off'}</span>${ICONS.motion}</button>
    </div>
  ` : '';

  return `
    <div class="shell" data-view="gallery" ${state.viewing || state.help ? 'inert' : ''}>
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
          <button type="button" class="btn sm ghost desktop-only" id="backup-btn" >${ICONS.download} Save a backup</button>
          <button type="button" class="btn sm ghost desktop-only" id="import-btn" >${ICONS.upload} Restore a backup</button>
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
      ${renderNotice()}
      ${q ? '' : renderContinue()}
      ${q ? '' : renderHero()}
        ${filterBar}
      ${none ? (q ? '' : `<div class="empty-state is-first"><h2>Nothing written yet</h2><p>A poem starts with one line.</p><button type="button" class="btn" id="empty-new-btn">Write a poem</button></div>`) : `<main>${cardsHTML}</main>`}
      ${q ? '' : renderExamples()}
      ${q ? '' : renderLookStrip()}
    </div>

    ${renderViewer()}
    <div class="mobile-fab-wrap" data-view="gallery-fab">
      <button type="button" class="mobile-fab" id="mobile-new-btn">${ICONS.write}<span>Write</span></button>
    </div>
  `;
}

// A visual choice, shown as a small picture with its name beneath
const picRow = (list, pics, current, attr, label) => `
  <div class="pic-row" role="group" aria-label="${label}">
    ${list.map(x => `<button type="button" class="pic-btn${x.id === current ? ' on' : ''}" ${attr}="${x.id}" aria-label="${esc(x.label)}" aria-pressed="${x.id === current}">${pics[x.id] || ''}<span>${esc(x.label)}</span></button>`).join('')}
  </div>`;

/* ---------- Choosing looks ---------- */

const lookOf = id => LOOKS.find(l => l.id === id);
function savedLooks(key) {
  try { const a = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(a) ? a : []; } catch { return []; }
}
function keepLook(key, id, max = 60) {
  localStorage.setItem(key, JSON.stringify([id, ...savedLooks(key).filter(x => x !== id)].slice(0, max)));
}
function toggleMine(id) {
  const mine = savedLooks(MINE_KEY);
  hum(8);
  localStorage.setItem(MINE_KEY, JSON.stringify(mine.includes(id) ? mine.filter(x => x !== id) : [id, ...mine]));
  render();
}

// Reads the poem for its length and a few plain cues, so the first row suits it.
const CUES = [
  [/god|prayer|faith|worship|temple|mosque|इबादत|ख़ुदा|खुदा|दुआ|सजदा|मंदिर|मस्जिद|बंदगी|ज़ियारत/i, ['ibadat', 'arch-dawn', 'lotus', 'stars', 'golden']],
  [/rain|monsoon|umbrella|wet|बारिश|बरसात|सावन|भीग/i, ['rainsill', 'umbrella', 'paperboat', 'rickshaw', 'monsoon', 'moved-on']],
  [/night|star|moon|dark|lantern|sleep|रात|तारे|चाँद|चांद|नींद/i, ['jasmine', 'stars', 'lanterns', 'lighthouse', 'charpai', 'indigo', 'moonlit']],
  [/sea|wave|shore|river|boat|ocean|समंदर|नदी|लहर|नाव|दरिया/i, ['sea', 'wave', 'nauka', 'paper-sea', 'whale', 'lotus']],
  [/letter|wrote|write|ink|page|pen|ख़त|खत|कलम|कागज़|कागज|लिख/i, ['letter', 'postbox', 'airmail', 'postcard', 'notebook', 'telegram', 'chair']],
  [/window|light|sun|dawn|morning|धूप|खिड़की|सुबह|रोशनी/i, ['window', 'golden', 'palm', 'arch-dawn', 'leaves']],
  [/flower|rose|bloom|tree|garden|petal|leaf|फूल|गुलाब|पेड़|पत्त/i, ['meadow', 'cherry', 'pressed', 'bougainvillea', 'vase', 'petals', 'vine', 'tulip', 'bulbul', 'fern']],
  [/love|heart|you|kiss|प्यार|इश्क|दिल|मोहब्बत|तुम/i, ['embrace', 'gajra', 'umbrella', 'windows', 'threshold', 'petals']],
  [/home|house|room|door|mother|घर|कमरा|दरवाज़|माँ|मां/i, ['storeys', 'threshold', 'saris', 'chair', 'valley', 'train']],
  [/bird|sky|fly|wing|पंछी|आसमान|उड़/i, ['bulbul', 'kitestring', 'kites', 'stars', 'balloon', 'heron']],
  [/city|train|road|street|शहर|रेल|सड़क|गली/i, ['train', 'rickshaw', 'kites', 'filmstrip']],
  [/dance|song|music|sing|गीत|नाच|संगीत|सुर/i, ['twirl', 'music', 'bansuri', 'record', 'warli']]
];
function looksFor(poem) {
  const text = `${poem.title} ${poem.body}`;
  // A set of slides is judged by its longest slide
  const lines = poem.carousel ? Math.max(...paginatePoem(poem.body, { ratio: poem.ratio, layout: poem.layout }).map(s => poemMetrics(s.text).lines)) : poemMetrics(poem.body).lines;
  const score = new Map();
  const add = (id, n) => score.set(id, (score.get(id) || 0) + n);
  for (const [re, ids] of CUES) {
    const hits = (text.match(new RegExp(re.source, 'gi')) || []).length;
    // A word in the title says more than one in the body
    const inTitle = new RegExp(re.source, 'i').test(poem.title) ? 4 : 0;
    if (hits) ids.forEach((id, i) => add(id, Math.min(3, hits) * 3 + inTitle - i * 0.35));
  }
  for (const l of LOOKS) {
    const p = l.patch;
    if (poem.ratio === 'auto' && !poem.carousel) add(l.id, { run: 2.4, opening: 1.2, below: 0.8, scene: 0.8 }[p.layout] || 0);
    else if (lines > 16) add(l.id, p.bgMode === 'solid' || p.layout === 'scene' ? 1.4 : p.layout === 'corner' ? 0.4 : -1.6);
    else if (lines && lines <= 5) add(l.id, ['below', 'arch', 'print'].includes(p.layout) ? 1 : p.layout === 'corner' ? 0.8 : 0);
    if (p.textStyle === 'blackout') add(l.id, lines > 12 ? -2 : 0);
    if (isHindi(text) && l.cat === 'folk') add(l.id, 0.6);
  }
  const ranked = [...LOOKS].sort((a, b) => (score.get(b.id) || 0) - (score.get(a.id) || 0));
  // At most three from a family, so the row stays varied
  const seen = {};
  return ranked.filter(l => (seen[l.cat] = (seen[l.cat] || 0) + 1) <= 3).slice(0, 12);
}

function lookCard(l, poem, mine) {
  const on = poem.look === l.id;
  const kept = mine.includes(l.id);
  // Slides show their first page, not the whole poem in miniature
  const first = poem.carousel || poem.ratio === 'auto' || poemMetrics(poem.body).lines > 18 ? paginatePoem(poem.body, { ratio: '4:5', layout: poem.layout })[0].text : poem.body;
  const sample = { ...poem, ...lookPatch(l, poem), carousel: false, title: poem.title || 'Untitled', body: first || 'Begin with\none honest line,\nand let the page\ndo the rest.' };
  return `
    <div class="look-cell" data-cell="${l.id}">
      <button type="button" class="look-btn${on ? ' on' : ''}" data-look="${l.id}" aria-pressed="${on}" aria-label="${esc(l.name)}">
        <span class="look-frame${state.applying === l.id ? ' is-busy' : ''}"><span class="look-scale">${renderSheetHTML(sample, { thumb: true, ratio: '4:5' })}</span>${state.applying === l.id ? '<span class="ring" aria-hidden="true"></span>' : ''}</span>
        <span class="look-nm">${esc(l.name)}</span>
      </button>
      <button type="button" class="look-heart${kept ? ' on' : ''}" data-heart="${l.id}" aria-pressed="${kept}" aria-label="${kept ? 'Remove' : 'Keep'} ${esc(l.name)} ${kept ? 'from' : 'in'} My Looks">${ICONS.heart}</button>
    </div>`;
}

/* Hold the poster to see it as it was before this look */
const lookWas = new Map();
let peekTimer = 0;
let peeking = false;
function peekStart(target) {
  clearTimeout(peekTimer);
  const poem = getActivePoem();
  if (!poem || !lookWas.has(poem.id) || poem.carousel || target.closest('input, textarea, button, [data-grab]')) return;
  peekTimer = setTimeout(() => {
    const holder = sheetHolder();
    if (!holder) return;
    peeking = true;
    const tpl = document.createElement('template');
    tpl.innerHTML = renderSheetHTML({ ...poem, ...lookWas.get(poem.id) }, { thumb: true, ratio: poem.ratio || '4:5' }).trim();
    const was = tpl.content.firstElementChild;
    was.classList.add('sheet-peek');
    was.setAttribute('data-morph-ignore', '');
    was.setAttribute('aria-hidden', 'true');
    was.querySelectorAll('img').forEach(i => i.removeAttribute('loading'));
    holder.appendChild(was);
    fitSheet(was);
    was.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
  }, 320);
}
function peekEnd() {
  clearTimeout(peekTimer);
  if (!peeking) return;
  peeking = false;
  document.querySelectorAll('.sheet-peek').forEach(n => n.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'ease-out' }).finished.then(() => n.remove(), () => n.remove()));
}
document.addEventListener('pointerdown', e => { if (e.button === 0 && e.target.closest?.('#sheet-holder')) peekStart(e.target); });
for (const t of ['pointerup', 'pointercancel', 'pointerleave']) document.addEventListener(t, peekEnd);
document.addEventListener('pointermove', e => { if (Math.abs(e.movementX) + Math.abs(e.movementY) > 12) clearTimeout(peekTimer); });
document.addEventListener('contextmenu', e => { if (peeking) e.preventDefault(); });

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
    const mine = savedLooks(MINE_KEY);
    const recent = savedLooks(RECENT_KEY);
    const rows = [
      { id: 'you', label: 'For this poem', list: looksFor(poem) },
      ...(recent.length ? [{ id: 'recent', label: 'Recent', list: recent.map(lookOf).filter(Boolean) }] : []),
      ...(mine.length ? [{ id: 'mine', label: 'My Looks', list: mine.map(lookOf).filter(Boolean) }] : []),
      ...LOOK_CATS.map(c => ({ ...c, list: c.id === 'all' ? LOOKS : LOOKS.filter(l => l.cat === c.id) }))
    ];
    const row = rows.find(r => r.id === state.lookCat) || rows[0];
    const shown = row.list.slice(0, state.looksShown);
    railContent = `
      <div class="subtabs" role="group" aria-label="Looks">${rows.map(r => `<button type="button" class="subtab${r === row ? ' on' : ''}" aria-pressed="${r === row}" data-lookcat="${r.id}">${esc(r.label)}</button>`).join('')}</div>
      <div class="look-grid" data-grid="looks-${row.id}">
        ${shown.map(l => lookCard(l, poem, mine)).join('')}
        ${shown.length < row.list.length ? '<div class="look-more" data-more="looks"></div>' : ''}
      </div>
    `;
  } else if (state.railTab === 'artwork') {
    const subTabs = [
      { id: 'story', label: 'Illustrations' },
      { id: 'folk', label: 'Folk & Craft' },
      { id: 'print', label: 'Print & Paper' },
      { id: 'line', label: 'Line & Ink' },
      { id: 'night', label: 'Night' },
      { id: 'minimal', label: 'Minimal' },
      { id: 'sketch', label: 'Sketches' },
      { id: 'light', label: 'Light' },
      { id: 'editorial', label: 'Book & Ink' },
      { id: 'canvas', label: 'Watercolour' },
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
    const long = st.ratio === 'auto' && !st.carousel && m.lines > 14;
    const places = long ? LAYOUTS.filter(l => !['corner', 'side'].includes(l.id)) : LAYOUTS;
    const placed = long && ['corner', 'side', 'run'].includes(st.layout) ? 'opening' : st.layout === 'run' ? 'corner' : st.layout;
    const placementHTML = st.bgMode === 'art' && st.painting.run ? '<p class="hint placement">This picture runs down the side, as far as the poem goes.</p>' : st.bgMode !== 'solid' ? `
      <div class="placement">
        <div class="sec-lbl">Placement</div>
        ${picRow(places, PLACEMENT, placed, 'data-layout', 'Placement')}
        ${canWash ? `<label class="range-row">
          <span>Softness</span>
          <input id="wash-range" class="range-in" type="range" min="0" max="65" value="${st.wash}" aria-label="Softness of the picture">
          <output>${st.wash}%</output>
        </label>` : ''}
      </div>
    ` : '';

    railContent = `
      <div class="subtabs" role="group" aria-label="Categories">${subTabs.map(t => `<button type="button" class="subtab${state.artSub === t.id ? ' on' : ''}" data-artsub="${t.id}">${esc(t.label)}</button>`).join('')}</div>
      ${placementHTML}
      ${picker}
    `;
  } else if (state.railTab === 'fonts') {
    const firstLine = stripEmphasis(String(poem.body || '').split('\n').find(l => l.trim()) || '').trim().slice(0, 30);
    const shown = state.fontCat === 'all' ? FONTS : FONTS.filter(f => f.cat === state.fontCat);
    const inked = !['torn', 'cutout-line', 'cutout-word'].includes(st.textStyle);
    const freeAlign = st.textStyle !== 'torn' && !(st.bgMode !== 'solid' && st.layout === 'side');
    railContent = `
      <div class="seg wide-seg" role="group" aria-label="Type">
        <button type="button" class="seg-btn${state.typeSeg === 'font' ? ' on' : ''}" data-typeseg="font" aria-pressed="${state.typeSeg === 'font'}">Font</button>
        <button type="button" class="seg-btn${state.typeSeg === 'setting' ? ' on' : ''}" data-typeseg="setting" aria-pressed="${state.typeSeg === 'setting'}">Setting</button>
      </div>
      ${state.typeSeg === 'setting' ? `
      <div data-grid="setting" class="stack">
        <div><div class="sec-lbl">Title</div>${picRow(TITLE_STYLES, TITLE, st.titleStyle, 'data-titlestyle', 'Title style')}</div>
        <div><div class="sec-lbl">Lines</div>${picRow(TEXT_STYLES, LINE, st.textStyle, 'data-textstyle', 'Line style')}</div>
        ${inked && m.lines >= 4 ? `<div><div class="sec-lbl">Arrangement</div>${picRow(FLOWS, FLOW, st.flow, 'data-flow', 'Arrangement')}</div>` : ''}
        ${freeAlign ? `<div><div class="sec-lbl">Alignment</div>${picRow([{ id: 'left', label: 'Left' }, { id: 'center', label: 'Centre' }, { id: 'right', label: 'Right' }], ALIGN, st.align, 'data-align', 'Alignment')}</div>` : ''}
        <div>
          <div class="sec-lbl">Size</div>
          <div class="pills">${TEXT_SIZES.map(ts => `<button type="button" class="choice-pill${st.textSize === ts.id ? ' on' : ''}" data-textsize="${ts.id}" aria-pressed="${st.textSize === ts.id}">${esc(ts.label)}</button>`).join('')}</div>
        </div>
        <div>
          <div class="sec-lbl">Line spacing</div>
          <div class="pills">${RHYTHMS.map(rh => `<button type="button" class="choice-pill${st.rhythm === rh.id ? ' on' : ''}" data-rhythm="${rh.id}" aria-pressed="${st.rhythm === rh.id}">${esc(rh.label)}</button>`).join('')}</div>
        </div>
        ${inked ? `<div>
          <div class="sec-lbl">Ink</div>
          <div class="ink-swatches">${INK_SWATCHES.map(sw => `<button type="button" class="ink-dot${st.inkColor === sw.id ? ' on' : ''}" data-ink="${sw.id}" title="${esc(sw.label)}" aria-label="${esc(sw.label)}" aria-pressed="${st.inkColor === sw.id}" style="${sw.hex ? `background:${sw.hex};` : 'background:var(--surface-2);color:var(--ink);'}">${sw.hex ? '' : 'A'}</button>`).join('')}</div>
        </div>` : ''}
      </div>` : `
      <div class="subtabs" role="group" aria-label="Fonts">${FONT_CATS.map(fc => `<button type="button" class="subtab${state.fontCat === fc.id ? ' on' : ''}" aria-pressed="${state.fontCat === fc.id}" data-fontcat="${fc.id}">${esc(fc.label)}</button>`).join('')}</div>
      <div class="font-list" data-grid="font-${state.fontCat}">
        ${shown.map(fn => `
          <button type="button" class="font-btn${st.font.id === fn.id ? ' on' : ''}" aria-pressed="${st.font.id === fn.id}" data-font="${fn.id}">
            <span class="font-sample" style="font-family:${fn.fam};font-weight:${fn.titleW};font-style:${fn.italicTitle ? 'italic' : 'normal'}">${esc(fn.cat === 'hindi' && !isHindi(firstLine) ? 'कुछ शब्द, कुछ ख़ामोशी' : firstLine || fn.name)}</span>
            <span class="font-cat">${esc(fn.name)}</span>
          </button>
        `).join('')}
      </div>`}
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
        ${st.charm ? '<p class="hint" style="margin-top:8px">Drag it on the page to another corner.</p>' : ''}
      </div>
      <div>
        <div class="sec-lbl">Frame</div>
        ${picRow(FRAMES, FRAME, st.frame, 'data-frame', 'Frame')}
      </div>
    `;
  } else {
    railContent = `
      <div class="ms">
        <div class="ms-head">
          <textarea id="ms-title" class="ms-title" rows="1" placeholder="Title, if it has one" aria-label="Title" style="font-family:${st.font.fam};font-weight:${st.font.titleW}">${esc(poem.title)}</textarea>
          <button type="button" class="ms-peek" id="ms-peek" aria-label="See the page"><span class="look-scale">${desktopStage.matches ? '' : renderSheetHTML(st.carousel ? poem : firstOf(poem, '4:5'), { thumb: true, ratio: '4:5', slide: activeSlide })}</span></button>
        </div>
        <div class="ms-host" id="ms-host"></div>
      </div>
      <div class="ms-more">
        <label class="ms-row"><span class="sec-lbl">Signature</span><input id="sign-in" class="field-in" type="text" placeholder="Your name or pen name" value="${esc(st.sign)}"></label>
        ${st.frame === 'bookpage' ? `<label class="ms-row"><span class="sec-lbl">Page number</span><input id="page-in" class="field-in" type="text" inputmode="numeric" placeholder="143" value="${esc(st.pageNo)}"></label>` : ''}
        <div class="ms-row"><span class="sec-lbl">Collection</span><div class="pills">${MOODS.map(md => `<button type="button" class="choice-pill${st.mood === md ? ' on' : ''}" aria-pressed="${st.mood === md}" data-setmood="${esc(md)}">${esc(md)}</button>`).join('')}</div></div>
      </div>
    `;
  }
  const writeBar = state.railTab !== 'write' ? '' : `
    <div class="ms-bar" role="toolbar" aria-label="Emphasis">
      ${[['bold', '<b>B</b>', 'Bold'], ['italic', '<i>I</i>', 'Italic'], ['underline', '<u>U</u>', 'Underline']].map(([k, face, name]) => `<button type="button" class="ms-tool${state.marks[k] ? ' on' : ''}" data-ms="${k}" aria-label="${name}" aria-pressed="${Boolean(state.marks[k])}">${face}</button>`).join('')}
      <button type="button" class="ms-tool is-wide" data-ms="break">${ICONS.plus}<span>New slide</span></button>
      <span class="ms-count" id="ms-count">${m.lines} ${m.lines === 1 ? 'line' : 'lines'}</span>
      <button type="button" class="btn sm primary ms-done" id="ms-done">Done</button>
    </div>`;

  const carouselNavHTML = st.carousel ? `
    <div class="carousel-nav" aria-label="Slides">
      <button type="button" class="btn sm ghost" id="prev-slide-btn" aria-label="Previous slide" ${state.slideIdx <= 0 ? 'disabled' : ''}>${ICONS.back} <span class="c-word">Prev</span></button>
      <span class="carousel-lbl">Slide ${state.slideIdx + 1} of ${slides.length}</span>
      <div class="carousel-dots">
        ${slides.map((s, i) => `<button type="button" class="c-dot${i === state.slideIdx ? ' on' : ''}" data-slide="${i}" aria-label="Slide ${i + 1}"></button>`).join('')}
      </div>
      <button type="button" class="btn sm ghost" id="next-slide-btn" aria-label="Next slide" ${state.slideIdx >= slides.length - 1 ? 'disabled' : ''}><span class="c-word">Next</span> ${ICONS.next}</button>
      <button type="button" class="btn sm" id="edit-full-btn">Edit</button>
    </div>
  ` : '';

  const fmt = FORMATS.find(f => f.id === st.ratio) || FORMATS[1];
  const toolRow = `
    <div class="bar-tools">
      <button type="button" class="btn sm icon-only" id="undo-btn" aria-label="Undo" title="Undo" ${canStep(true) ? '' : 'disabled'}>${ICONS.undo}</button>
      <button type="button" class="btn sm icon-only" id="redo-btn" aria-label="Redo" title="Redo" ${canStep(false) ? '' : 'disabled'}>${ICONS.redo}</button>
      <div class="menu-wrap">
        <button type="button" class="btn sm" id="format-btn" aria-haspopup="menu" aria-expanded="${state.formatOpen}" title="Page format">${formatIcon(fmt)}<span>${fmt.label}</span></button>
        ${state.formatOpen ? `<div class="ios-menu format-menu" role="menu" aria-label="Page format">${FORMATS.map(f => `<button type="button" class="ios-menu-item" role="menuitemradio" aria-checked="${f.id === fmt.id}" data-ratio="${f.id}">${formatIcon(f)}<span>${f.label}</span><small>${f.note}</small></button>`).join('')}
          <div class="ios-menu-sep seg-in-menu"></div>
          <div class="seg seg-in-menu" role="group" aria-label="Single page or slides"><button type="button" class="seg-btn${st.carousel ? '' : ' on'}" data-pages="one" aria-pressed="${!st.carousel}">Single</button><button type="button" class="seg-btn${st.carousel ? ' on' : ''}" data-pages="slides" aria-pressed="${st.carousel}">Slides${slides.length > 1 ? ` · ${slides.length}` : ''}</button></div></div>` : ''}
      </div>
      <div class="seg" role="group" aria-label="Single page or slides">
        <button type="button" class="seg-btn${!st.carousel ? ' on' : ''}" id="mode-single-btn" aria-pressed="${!st.carousel}">Single</button>
        <button type="button" class="seg-btn${st.carousel ? ' on' : ''}" id="mode-carousel-btn" aria-pressed="${st.carousel}">Slides${slides.length > 1 ? ` · ${slides.length}` : ''}</button>
      </div>
    </div>`;

  // A page too full to read: say so, and offer what would fix it
  const longest = Math.max(0, ...stripEmphasis(poem.body).split('\n').map(l => l.trim().length));
  const fullTip = state.full && !st.carousel && st.ratio !== 'auto' ? `
    <div class="full-tip" role="status"><p>Too much to read on one ${esc((FORMATS.find(f => f.id === st.ratio) || FORMATS[0]).label.toLowerCase())}.</p>
      <div class="full-acts">${longest <= 26 && m.lines <= 24 && st.flow !== 'two' ? '<button type="button" class="note-btn" data-full="two">Two columns</button>' : ''}<button type="button" class="note-btn" data-full="long">Long page</button><button type="button" class="note-btn" data-full="slides">${slides.length} slides</button></div>
    </div>` : '';

  const tabMeta = [
    { id: 'write', label: 'Write', icon: ICONS.write, note: 'Write here, or straight on the page.' },
    { id: 'looks', label: 'Looks', icon: ICONS.looks, note: 'Sets the whole page: picture, type and paper.' },
    { id: 'artwork', label: 'Picture', icon: ICONS.artwork, layer: 'picture', note: 'Changes only the picture and where it sits.' },
    { id: 'fonts', label: 'Type', icon: ICONS.fonts, layer: 'type', note: 'Changes only how the words look.' },
    { id: 'style', label: 'Page', icon: ICONS.style, layer: 'page', note: 'Changes only the paper, light and frame.' }
  ];
  const activeTab = tabMeta.find(t => t.id === state.railTab) || tabMeta[1];
  const activeTabLabel = activeTab.label;
  const changed = changedLayers(poem);
  const lookName = LOOKS.find(l => l.id === poem.look)?.name;
  const layerNames = { picture: 'picture', type: 'type', page: 'page' };
  const advice = ['fonts', 'style'].includes(state.railTab) ? inkAdvice(poem) : null;
  const railNote = advice
    ? `<span role="status">This ink is hard to read here.</span><button type="button" class="note-btn" id="ink-fix" data-fix="${advice.id}">Use ${esc(advice.label)}</button>`
    : state.railTab === 'looks' && lookName
    ? `<span>${changed.length ? `<b>${esc(lookName)}</b>, with your own ${changed.map(c => layerNames[c]).join(changed.length > 2 ? ', ' : ' and ')}` : `<b>${esc(lookName)}</b>, as designed`}</span>${changed.length ? '<button type="button" class="note-btn" id="look-reset-btn">Reset</button>' : ''}`
    : `<span>${activeTab.note}</span>`;

  const mobileMoreMenu = state.moreOpen ? `
    <div class="ios-menu" role="menu" aria-label="More">
      <button type="button" class="ios-menu-item" id="m-shuffle-btn" role="menuitem"><span>Try a look at random</span>${ICONS.sparkles}</button>
      <button type="button" class="ios-menu-item" id="m-copy-image-btn" role="menuitem"><span>Copy image</span>${ICONS.copy}</button>
      <button type="button" class="ios-menu-item" id="m-copy-btn" role="menuitem"><span>Copy the words</span>${ICONS.write}</button>
      <button type="button" class="ios-menu-item" id="m-theme-btn" role="menuitem"><span>${state.theme === 'dark' ? 'Light' : 'Dark'}</span>${state.theme === 'dark' ? ICONS.sun : ICONS.moon}</button>
      <button type="button" class="ios-menu-item" id="m-motion-btn" role="menuitem"><span>${calm() ? 'Turn motion on' : 'Turn motion off'}</span>${ICONS.motion}</button>
      <div class="ios-menu-sep"></div>
      <button type="button" class="ios-menu-item" id="m-archive-btn" role="menuitem"><span>${poem.archived ? 'Bring back from Archive' : 'Put away in Archive'}</span>${ICONS.archive}</button>
      <button type="button" class="ios-menu-item danger" id="m-delete-btn" role="menuitem"><span>Delete poem</span>${ICONS.trash}</button>
    </div>
  ` : '';

  return `
    <div ${state.share || state.help ? 'inert ' : ''}class="studio${state.mobileSheetOpen ? ' has-sheet' : ''}${isWriting() ? ' is-writing' : ''}${st.ratio === 'auto' && !st.carousel ? ' is-longpage' : ''}" data-view="studio-${esc(poem.id)}">
      <div class="studio-stage">
        <div class="stage-bar">
          <div class="stage-bar-left">
            <button type="button" class="btn sm ghost" id="back-gallery-btn" aria-label="Back to all poems">${ICONS.back}<span class="desktop-only">Poems</span></button>
          </div>
          ${toolRow}
          <div class="stage-bar-right">
            <button type="button" class="btn sm icon-only wide-only" id="shuffle-btn" title="Try a look at random" aria-label="Try a look at random">${ICONS.sparkles}</button>
            <button type="button" class="btn sm icon-only wide-only" id="theme-btn" title="Light or dark" aria-label="Light or dark">${state.theme === 'dark' ? ICONS.sun : ICONS.moon}</button>
            <button type="button" class="btn sm desktop-only" id="copy-image-btn" title="Copy this page as an image">${ICONS.copy} Copy image</button>
            <button type="button" class="btn sm primary" id="share-btn">${ICONS.share} Share</button>
            <div class="menu-wrap mobile-only">
              <button type="button" class="btn sm icon-only" id="more-btn" aria-label="More" aria-haspopup="menu" aria-expanded="${state.moreOpen}">${ICONS.more}</button>
              ${mobileMoreMenu}
            </div>
          </div>
        </div>

        ${renderNotice()}
        ${fullTip}
        <div class="stage-canvas-wrap">
          ${carouselNavHTML}
          <div class="sheet-holder" id="sheet-holder">${renderSheetHTML(poem, { editable: !st.carousel, editingRich: state.editingRich, design: true, inline: finePointer.matches, slide: activeSlide })}</div>
        </div>

        ${renderHint()}
        <div class="stage-footer">
          <span id="metrics-lbl">${m.stanzas} ${m.stanzas === 1 ? 'stanza' : 'stanzas'} · ${m.lines} ${m.lines === 1 ? 'line' : 'lines'} · ${m.words} words</span>
          <span class="save-chip${saveWarned ? ' is-off' : ''}" title="Poems are kept in this browser, on this device. Save a backup from the home page to keep a copy elsewhere.">${saveWarned ? 'Not saved' : `${ICONS.check} Saved on this device`}</span>
        </div>
      </div>

      <div class="sheet-scrim${state.mobileSheetOpen ? ' open' : ''}" id="sheet-scrim"></div>

      <aside class="studio-rail${state.mobileSheetOpen ? ' sheet-open' : ''}${state.sheetTall ? ' is-tall' : ''}${state.railTab === 'write' ? ' is-write' : ''}" aria-label="Write and design">
        <button type="button" class="sheet-grabber" id="sheet-grabber" aria-label="${state.sheetTall ? 'Make the panel smaller' : 'Make the panel taller'}"></button>
        <div class="rail-tabs" role="tablist" aria-label="Design" style="--tab:${tabMeta.findIndex(t => t.id === state.railTab)}">
          ${tabMeta.map(tb => `<button type="button" role="tab" id="tab-${tb.id}" aria-controls="panel" tabindex="${state.railTab === tb.id ? 0 : -1}" aria-selected="${state.railTab === tb.id}" class="rail-tab${state.railTab === tb.id ? ' on' : ''}" data-railtab="${tb.id}">${tb.label}${changed?.includes(tb.layer) ? '<i class="tab-dot" title="Changed from the look"></i>' : ''}</button>`).join('')}
        </div>
        <div class="rail-note">${railNote}<button type="button" class="icon-btn sheet-close" id="sheet-done-btn" aria-label="Close panel">${ICONS.down}</button></div>
        <div class="rail-body" id="panel" role="tabpanel" aria-labelledby="tab-${state.railTab}" data-tabpanel="${state.railTab}">${railContent}</div>
        ${writeBar}
        <div class="rail-foot">
          <button type="button" class="btn sm" id="archive-btn">${ICONS.archive} ${poem.archived ? 'Unarchive' : 'Archive'}</button>
          <button type="button" class="btn sm danger" id="delete-btn">${ICONS.trash} Delete</button>
        </div>
      </aside>

      <nav class="ios-dock" aria-label="Studio tools">
        ${tabMeta.map(tb => `
          <button type="button" class="dock-btn${state.mobileSheetOpen && state.railTab === tb.id ? ' on' : ''}" data-docktab="${tb.id}" aria-expanded="${state.mobileSheetOpen && state.railTab === tb.id}" aria-controls="panel">
            ${tb.icon}
            <span>${tb.label}${changed?.includes(tb.layer) ? '<i class="tab-dot"></i>' : ''}</span>
          </button>
        `).join('')}
      </nav>
    </div>
  `;
}

/* ---------- Stage measurement ---------- */

// Phones held sideways get the desktop's side-by-side layout
const desktopStage = matchMedia('(min-width: 861px), (min-width: 601px) and (max-height: 500px)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const isWriting = () => state.railTab === 'write' && (desktopStage.matches || state.mobileSheetOpen);
for (const q of [desktopStage, finePointer]) q.addEventListener('change', () => { if (desktopStage.matches) state.mobileSheetOpen = false; render(); });
const autoSizesNatively = CSS.supports('field-sizing', 'content');

function autoSizeTextarea() {
  if (autoSizesNatively) return;
  for (const id of ['poem-title-in', 'ms-title']) {
    const t = document.getElementById(id);
    if (t) { t.style.height = 'auto'; t.style.height = t.scrollHeight + 'px'; }
  }
  const ta = document.getElementById('poem-body-in');
  if (!ta) return;
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
  const nav = stage.querySelector('.carousel-nav');
  const room = stage.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom) - (nav ? nav.offsetHeight + 14 : 0);
  // The whole poster is always in view; only a long page scrolls
  if (SHEET_RATIO[cls]) zoom = Math.max(innerHeight <= 500 ? 0.3 : 0.5, Math.min(zoom, room / (baseW / SHEET_RATIO[cls])));
  root.setProperty('--stage-zoom', zoom.toFixed(3));
  root.setProperty('--bar', Math.round(document.querySelector('.stage-bar').getBoundingClientRect().bottom) + 'px');
  // A long page keeps its size and scrolls behind the panel; anything else shrinks to stay whole
  if (!desktopStage.matches && state.mobileSheetOpen && state.railTab !== 'write' && SHEET_RATIO[cls]) {
    // The panel's resting height (see .studio-rail), not its height mid-drag or when made taller
    const dock = document.querySelector('.ios-dock')?.offsetHeight || 0;
    const rest = Math.min(260, innerHeight * 0.4);
    const bar = nav ? nav.offsetHeight + 14 : 0;
    const free = stage.clientHeight - rest - dock - 20 - bar;
    const tall = (baseW / SHEET_RATIO[cls]) * zoom;
    lift = Math.max(0.36, Math.min(1, free / tall));
    const padT = parseFloat(cs.paddingTop);
    // The slide bar stays at the top; the poster rises to just under it
    const top = padT + Math.max(0, (stage.clientHeight - padT - parseFloat(cs.paddingBottom) - tall - bar) / 2) - stage.scrollTop;
    rise = (12 - top) / zoom;
  }
  root.setProperty('--stage-lift', lift.toFixed(3));
  root.setProperty('--stage-rise', Math.round(rise) + 'px');
}

const stageObserver = new ResizeObserver(() => { fitStage(); fitThumbs(); });

// Thumbnails are the real sheet, scaled to their frame
function fitThumbs() {
  for (const grid of document.querySelectorAll('.anthology-grid')) {
    const gap = innerWidth <= 600 ? 12 : 22;
    const meta = Math.max(innerWidth <= 600 ? 32 : 44, grid.querySelector('.poem-card-meta')?.offsetHeight || 0);
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
  document.querySelectorAll('.example-row [data-thumb-cls], .continue-frame').forEach(f => f.style.setProperty('--thumb', (f.clientWidth / SHEET_W[f.dataset.thumbCls]).toFixed(4)));
  const look = document.querySelector('.look-frame');
  if (look) document.documentElement.style.setProperty('--look', (look.clientWidth / SHEET_W['rat-4-5']).toFixed(4));
}
const thumbObserver = new ResizeObserver(() => { fitThumbs(); fitOverlay(); });
thumbObserver.observe(document.body);

function fitSheets() {
  document.querySelectorAll('.poem-sheet[data-fit]').forEach(n => fitSheet(n));
  fitOverlay();
  // Words shrunk below about 10 px at their base size are too small to share
  const live = document.getElementById('active-poem-sheet');
  const poem = getActivePoem();
  if (!live || !poem) return;
  const st = resolveStyle(poem);
  const size = (parseFloat(live.style.getPropertyValue('--ps-scale')) || 1) * 14.5 / (st.font.scaleBoost || 1);
  const full = st.textSize === 'auto' && poemMetrics(poem.body).lines > 12 && size * (458 / SHEET_W[Object.keys(SHEET_W).find(c => live.classList.contains(c))]) < 10.6;
  if (full !== state.full) { state.full = full; render(); }
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
  if (lbl) lbl.textContent = `${m.stanzas} ${m.stanzas === 1 ? 'stanza' : 'stanzas'} · ${m.lines} ${m.lines === 1 ? 'line' : 'lines'} · ${m.words} words`;

  const effCarouselRatio = st.ratio === 'auto' ? '4:5' : st.ratio;
  const slides = paginatePoem(poem.body, { ratio: effCarouselRatio, layout: st.layout });
  const cBtn = document.getElementById('mode-carousel-btn');
  if (cBtn) cBtn.textContent = `Slides${slides.length > 1 ? ` · ${slides.length}` : ''}`;

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
  const fields = ghost.querySelectorAll('textarea');
  sheet.querySelectorAll('textarea').forEach((t, i) => { fields[i].value = t.value; });
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
}, { rootMargin: '500px' });
let watchedMore = null;

let observedStage = null;
function render({ fade = false, dir = 0 } = {}) {
  const root = document.getElementById('app');
  if (!root) return;
  const poem = getActivePoem();
  const cap = fade && poem ? captureGhost() : null;
  morph(root, (poem ? renderStudio(poem) + renderShare() : renderGallery()) + renderHelp());
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
    const fn = resolveStyle(poem).font;
    mountEditor(document.getElementById('ms-host'), { id: poem.id, body: String(poem.body || ''), placeholder: poem.spark || 'Begin writing…', style: `font-family:${fn.fam};font-weight:${fn.bodyW};` });
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

function pickLook(id) {
  const l = LOOKS.find(x => x.id === id);
  const poem = getActivePoem();
  if (!l || !poem) return;
  state.editingRich = false;
  const setting = lookPatch(l, poem);
  // Kept for hold-to-compare
  const lookBefore = Object.fromEntries(['look', ...Object.keys(setting), 'painting', 'paper'].map(k => [k, poem[k]]));
  const patch = { ...setting, look: l.id };
  const art = patch.bgMode === 'art' ? ARTWORKS.find(a => a.id === patch.painting) : null;
  const assets = [art?.src, patch.atmos && finishSrc(patch.atmos), patch.light && finishSrc(patch.light), patch.charm && finishSrc(patch.charm)];
  state.applying = id;
  render();
  patchWhenReady(Promise.all([...assets.map(imageReady), fontReady(patch.font, poem.body)]), patch, () => {
    state.applying = '';
    lookWas.set(poem.id, lookBefore);
    keepLook(RECENT_KEY, l.id, 12);
    if (art) state.artSub = art.grp;
    hintDone(1);
    render();
    toast(`Look: ${l.name}`, 4200, { label: 'Undo', run: () => { if (getActivePoem() === poem) stepHistory(true); } });
  });
}

function doBackup() {
  const blob = new Blob([JSON.stringify({ app: 'Bulbul', version: 2, poems: state.poems }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'bulbul-backup.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 500);
  state.moreOpen = false;
  render();
  hum(12);
  toast('Backup saved to your downloads');
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
    toast(added ? `Restored ${added} ${added === 1 ? 'poem' : 'poems'}` : 'Everything in that backup is already here');
  } catch {
    toast('That file isn’t a Bulbul backup');
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
  try { await navigator.clipboard.writeText(clean); } catch { msg = 'This browser won’t copy. Select the words instead.'; }
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

/* ---------- Writing ---------- */

let typed = 0;
const typedRender = () => { clearTimeout(typed); typed = setTimeout(render, 90); };
onEditor({
  input(body) {
    if (!getActivePoem()) return;
    patchActive({ body }, { rerender: false, keep: false });
    if (body.trim().length > 2) hintDone(0);
    typedRender();
  },
  marks(next) {
    const poem = getActivePoem();
    const at = poem?.carousel && /^\s*[-—]{3,}\s*$/m.test(poem.body) ? caretSlide() : -1;
    const turned = at >= 0 && at !== state.slideIdx;
    if (!turned && ['bold', 'italic', 'underline'].every(k => Boolean(state.marks[k]) === Boolean(next[k]))) return;
    state.marks = next;
    if (turned) state.slideIdx = at;
    render();
  }
});
function emphasise(what) {
  if (what === 'break') {
    const poem = getActivePoem();
    if (!breakHere()) { toast('Write a line first'); return; }
    patchActive({ carousel: true, ratio: poem.ratio === 'auto' ? '4:5' : poem.ratio }, { fade: false });
    return;
  }
  if (!mark(what)) toast('Write a line first');
}
function goWrite(line = -1) {
  state.railTab = 'write';
  state.mobileSheetOpen = !desktopStage.matches;
  state.sheetTall = false;
  state.editingRich = false;
  state.formatOpen = false;
  state.moreOpen = false;
  render();
  focusEditor(line);
}
function setPages(slides) {
  const poem = getActivePoem();
  if (Boolean(poem.carousel) === slides) return;
  state.slideIdx = 0;
  state.editingRich = false;
  if (slides) state.mobileSheetOpen = state.railTab === 'write' && state.mobileSheetOpen;
  patchActive({ carousel: slides, ...(slides && poem.ratio === 'auto' ? { ratio: '4:5' } : {}) });
}
// The bar above the keyboard needs to know where the keyboard is
const view = window.visualViewport;
const keyboard = () => document.documentElement.style.setProperty('--kb', Math.max(0, Math.round(innerHeight - view.height - view.offsetTop)) + 'px');
view?.addEventListener('resize', keyboard);
view?.addEventListener('scroll', keyboard);

function doArchive() {
  const poem = getActivePoem();
  const next = !poem.archived;
  state.moreOpen = false;
  poem.archived = next;
  savePoems(state.poems);
  if (next) closeStudio(); else render();
  toast(next ? 'Put away in Archive' : 'Back with your poems', 5000, { label: 'Undo', run: () => { poem.archived = !next; savePoems(state.poems); render(); } });
}

function doDelete() {
  const poem = getActivePoem();
  const at = state.poems.indexOf(poem);
  state.moreOpen = false;
  state.poems = state.poems.filter(x => x !== poem);
  savePoems(state.poems);
  closeStudio();
  toast(`Deleted “${poem.title || 'Untitled poem'}”`, 7000, { label: 'Undo', run: () => { state.poems.splice(Math.max(0, at), 0, poem); savePoems(state.poems); render(); } });
}

function toggleMenu(key) {
  state[key] = !state[key];
  if (state[key]) state[key === 'moreOpen' ? 'formatOpen' : 'moreOpen'] = false;
  render();
  if (state[key]) (document.querySelector('.ios-menu [aria-checked="true"]') || document.querySelector('.ios-menu .ios-menu-item'))?.focus({ preventScroll: true });
}
function closeMenus(refocus) {
  if (!state.moreOpen && !state.formatOpen) return false;
  const id = state.moreOpen ? 'more-btn' : 'format-btn';
  state.moreOpen = false;
  state.formatOpen = false;
  render();
  if (refocus) document.getElementById(id)?.focus({ preventScroll: true });
  return true;
}
function setTab(tab) {
  const turned = state.railTab !== tab;
  state.railTab = tab;
  render();
  if (turned) document.querySelector('.rail-body').scrollTop = 0;
  revealSubtab();
}
function closeSheet() { state.mobileSheetOpen = false; state.sheetTall = false; render(); }
function goToSlide(i) { const dir = Math.sign(i - state.slideIdx); state.slideIdx = i; render({ fade: true, dir }); }

/* ---------- Phone gestures ---------- */

const rootStyle = document.documentElement.style;
let held = null;
const railDrag = {
  selector: '.studio-rail.sheet-open:not(.is-write)',
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
  ['#more-btn', () => toggleMenu('moreOpen')],

  // Anthology
  ['#new-poem-btn, #mobile-new-btn, #empty-new-btn, #new-card-btn', () => createPoem()],
  ['#spark-use', () => createPoem({ spark: todaysSpark() })],
  ['#spark-next', () => { state.sparkShift += 1; render(); }],
  ['[data-startlook]', el => createPoem({ lookId: el.dataset.startlook })],
  ['[data-bloom]', touchBloom],
  ['#first-write', () => { begin(); createPoem({ spark: todaysSpark(), lookId: 'window' }); }],
  ['#first-look', () => { begin(); transitionView(render); }],
  ['#examples-all', () => { state.examplesOpen = !state.examplesOpen; render(); }],
  ['[data-song]', el => (el.dataset.song.startsWith('ex-') ? viewExample(el.dataset.song) : openPoem(el.dataset.song))],
  ['#bird', () => hopTo((state.perch + 1 + Math.floor(Math.random() * (PERCHES.length - 1))) % PERCHES.length, pickSong())],
  ['[data-mood]', el => { if (state.moodFilter !== el.dataset.mood) { state.moodFilter = el.dataset.mood; renderGalleryFlow(); } }],
  ['[data-open]', el => openPoem(el.dataset.open)],
  ['#backup-btn, #m-backup-btn', doBackup],
  ['#notice-act', noticeAct],
  ['#clear-search', () => { state.search = ''; renderGalleryFlow(); document.getElementById('gallery-search')?.focus(); }],
  ['#import-btn, #m-import-btn', triggerImport],

  // Studio bar
  ['#back-gallery-btn', closeStudio],
  ['#undo-btn', () => stepHistory(true)],
  ['#redo-btn', () => stepHistory(false)],
  ['#format-btn', () => toggleMenu('formatOpen')],
  ['#shuffle-btn, #m-shuffle-btn', doShuffle],
  ['#mode-single-btn', () => setPages(false)],
  ['[data-pages]', el => { state.formatOpen = false; setPages(el.dataset.pages === 'slides'); render(); }],
  ['[data-full]', el => {
    if (el.dataset.full === 'slides') setPages(true);
    else patchActive(el.dataset.full === 'two' ? { flow: 'two', ...(['corner', 'side', 'arch', 'print'].includes(getActivePoem().layout) ? { layout: 'below', textX: 0, textY: 0 } : {}) } : { ratio: 'auto', carousel: false });
  }],
  ['[data-ms]', el => emphasise(el.dataset.ms)],
  ['#ms-done, #ms-peek', () => { document.activeElement?.blur(); closeSheet(); }],
  ['#mode-carousel-btn', () => setPages(true)],
  ['#edit-full-btn', () => goWrite(slideLine(getActivePoem(), state.slideIdx))],
  ['#prev-slide-btn', () => { if (state.slideIdx > 0) goToSlide(state.slideIdx - 1); }],
  ['#next-slide-btn', () => goToSlide(state.slideIdx + 1)],
  ['[data-slide]', el => goToSlide(Number(el.dataset.slide))],
  ['#m-copy-btn', doCopy],
  ['#copy-image-btn, #m-copy-image-btn', quickCopyImage],
  ['#share-btn', openShare],

  // Overlays
  ['[data-close]', closeOverlay],
  ['[data-shareto]', el => { localStorage.setItem(SHARE_KEY, el.dataset.shareto); setShare({ platform: el.dataset.shareto }); }],
  ['#share-alt', copyAlt],
  ['#share-retry', () => prepareShare()],
  ['[data-split]', el => setShare({ split: el.dataset.split === '1', page: 0 })],
  ['[data-spage]', el => setShare({ page: Number(el.dataset.spage) })],
  ['#share-copy', () => shareCopyImage().then(ok => shareNote(ok ? (state.share?.as === 'mock' ? 'Mockup copied' : 'Image copied') : 'This browser won’t copy images. Download it instead.'))],
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
  ['#rich-tap-edit, [data-grab=text]', (el, e) => tapWords(e)],
  ['#active-poem-sheet .poem-text-col', (el, e) => { if (getActivePoem().carousel) goWrite(lineAt(e)); }],

  // Inspector navigation
  ['[data-docktab]', el => {
    const tab = el.dataset.docktab;
    state.moreOpen = false;
    if (state.mobileSheetOpen && state.railTab === tab) { closeSheet(); return; }
    if (tab === 'write') { goWrite(); return; }
    state.mobileSheetOpen = true;
    setTab(tab);
  }],
  ['#sheet-scrim, #sheet-done-btn', closeSheet],
  ['#sheet-grabber', () => { state.sheetTall = !state.sheetTall; render(); }],
  ['[data-railtab]', el => (el.dataset.railtab === 'write' ? goWrite() : setTab(el.dataset.railtab))],
  ['[data-artsub]', el => { state.artSub = el.dataset.artsub; render(); revealSubtab(); }],
  ['[data-typeseg]', el => { state.typeSeg = el.dataset.typeseg; render(); revealSubtab(); }],
  ['#ink-fix', el => patchActive({ inkColor: el.dataset.fix })],
  ['[data-fontcat]', el => { state.fontCat = el.dataset.fontcat; render(); revealSubtab(); }],

  // Looks and finishes
  ['[data-heart]', el => toggleMine(el.dataset.heart)],
  ['[data-look]', el => { if (state.applying !== el.dataset.look) pickLook(el.dataset.look); }],
  ['#look-reset-btn', () => pickLook(getActivePoem().look)],
  ['#no-picture-btn', removePicture],
  ['[data-lookcat]', el => { state.lookCat = el.dataset.lookcat; state.looksShown = 16; render(); revealSubtab(); }],
  ['[data-atmos]', el => pickFinish('atmos', el.dataset.atmos)],
  ['[data-light]', el => pickFinish('light', el.dataset.light)],
  ['[data-charm]', el => pickFinish('charm', el.dataset.charm)],

  // Artwork
  ['[data-art]', el => pickArt(el.dataset.art)],
  ['[data-paper]', el => pickPaper(el.dataset.paper)],
  ['[data-flow]', el => patchActive({ flow: el.dataset.flow })],
  ['[data-layout]', el => patchActive({ layout: el.dataset.layout, textX: 0, textY: 0 })],
  ['#pick-photo-btn', () => document.getElementById('photo-file-in')?.click()],
  ['[data-photodark]', el => patchActive({ bgMode: 'photo', photoDark: el.dataset.photodark === '1' })],

  // Fonts and style
  ['[data-font]', el => patchWhenReady(fontReady(el.dataset.font, getActivePoem().body), { font: el.dataset.font })],
  ['[data-titlestyle]', el => { state.editingRich = false; patchActive({ titleStyle: el.dataset.titlestyle }); }],
  ['[data-textstyle]', el => { state.editingRich = false; patchActive({ textStyle: el.dataset.textstyle }); }],
  ['[data-ink]', el => patchActive({ inkColor: el.dataset.ink })],
  ['[data-texture]', el => patchActive({ texture: el.dataset.texture })],
  ['[data-rhythm]', el => patchActive({ rhythm: el.dataset.rhythm })],
  ['[data-textsize]', el => patchActive({ textSize: el.dataset.textsize })],
  ['[data-ratio]', el => {
    const r = el.dataset.ratio;
    const fromMenu = state.formatOpen;
    state.formatOpen = false;
    patchActive({ ratio: r, carousel: r === 'auto' ? false : Boolean(getActivePoem().carousel) });
    if (fromMenu) document.getElementById('format-btn')?.focus({ preventScroll: true });
  }],
  ['[data-frame]', el => patchActive({ frame: el.dataset.frame })],
  ['[data-align]', el => patchActive({ align: el.dataset.align })],
  ['[data-setmood]', el => {
    const md = el.dataset.setmood;
    patchActive({ mood: getActivePoem().mood === md ? '' : md }, { fade: false });
  }]
];

const INPUTS = [
  ['#gallery-search', el => { state.search = el.value; renderGalleryFlow(); }],
  ['#poem-title-in', el => { patchActive({ title: el.value.replace(/\n+/g, ' ') }, { rerender: false, keep: false }); autoSizeTextarea(); }],
  ['#ms-title', el => { patchActive({ title: el.value.replace(/\n+/g, ' ') }, { rerender: false, keep: false }); typedRender(); }],
  ['#poem-body-in', el => {
    patchActive({ body: el.value }, { rerender: false, keep: false });
    if (el.value.trim().length > 2) hintDone(0);
    liveUpdateMetricsAndScale(getActivePoem());
  }],
  ['#wash-range', el => patchActive({ wash: Number(el.value) }, { fade: false })],
  ['#share-caption', el => editShare('caption', el.value)],
  ['#share-who', el => { localStorage.setItem(NAME_KEY, el.value.trim()); editShare('who', el.value); }],
  ['#sign-in', el => patchActive({ sign: el.value }, { fade: false, keep: false })],
  ['#page-in', el => patchActive({ pageNo: el.value }, { fade: false, keep: false })]
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
  if ((state.moreOpen || state.formatOpen) && !e.target.closest?.('.menu-wrap')) { state.moreOpen = false; state.formatOpen = false; render(); }
});

// Leaving a tap-to-edit poem returns it to its styled view
document.addEventListener('focusout', e => {
  if (!state.editingRich || !/^poem-(title|body)-in$/.test(e.target.id)) return;
  setTimeout(() => {
    if (/^poem-(title|body)-in$/.test(document.activeElement?.id || '')) return;
    if (state.editingRich) { state.editingRich = false; render(); }
  }, 130);
});

/* ---------- Picking things up: hold the words or a keepsake, then move ---------- */

let grab = null;
let grabbed = false; // swallows the click that ends a drag
const hum = ms => { if (!calm()) navigator.vibrate?.(ms); };

function textBounds(col) {
  const r = document.createRange();
  r.selectNodeContents(col);
  const boxes = [...r.getClientRects()].filter(b => b.width > 1 && b.height > 1);
  if (!boxes.length) return col.getBoundingClientRect();
  return { left: Math.min(...boxes.map(b => b.left)), right: Math.max(...boxes.map(b => b.right)), top: Math.min(...boxes.map(b => b.top)), bottom: Math.max(...boxes.map(b => b.bottom)) };
}
function showGuides(sheet, x, y) {
  let g = sheet.querySelector('.guides');
  if (!g) {
    g = document.createElement('div');
    g.className = 'guides';
    g.setAttribute('data-morph-ignore', '');
    g.innerHTML = '<i class="gx"></i><i class="gy"></i>';
    sheet.appendChild(g);
  }
  g.classList.toggle('on-x', x);
  g.classList.toggle('on-y', y);
}
function liftGrab() {
  if (!grab || grab.live) return;
  clearTimeout(grab.timer);
  clearTimeout(peekTimer);
  grab.live = true;
  grab.el.classList.add('is-dragging');
  grab.sheet.classList.add('is-grabbing');
  hum(10);
  if (grab.kind === 'text') {
    const b = textBounds(grab.el);
    const s = grab.sheet.getBoundingClientRect();
    grab.midX = (b.left + b.right) / 2 - (s.left + s.right) / 2;
    grab.midY = (b.top + b.bottom) / 2 - (s.top + s.bottom) / 2;
    showGuides(grab.sheet, false, false);
  }
}
document.addEventListener('pointerdown', e => {
  grabbed = false;
  const el = e.target.closest?.('[data-grab]');
  const poem = getActivePoem();
  if (!el || !poem || e.button !== 0) return;
  const sheet = document.getElementById('active-poem-sheet');
  grab = {
    kind: el.dataset.grab, el, sheet, poem, id: e.pointerId, mouse: e.pointerType === 'mouse',
    sx: e.clientX, sy: e.clientY, x: poem.textX || 0, y: poem.textY || 0, baseX: poem.textX || 0, baseY: poem.textY || 0, live: false
  };
  grab.timer = setTimeout(liftGrab, grab.mouse ? 260 : 380);
});
document.addEventListener('pointermove', e => {
  if (!grab || e.pointerId !== grab.id) return;
  const dx = e.clientX - grab.sx;
  const dy = e.clientY - grab.sy;
  if (!grab.live) {
    if (Math.hypot(dx, dy) < (grab.mouse ? 5 : 10)) return;
    if (!grab.mouse) { clearTimeout(grab.timer); grab = null; return; }
    liftGrab();
  }
  if (grab.kind === 'charm') {
    const k = grab.sheet.getBoundingClientRect().width / grab.sheet.offsetWidth || 1;
    grab.el.style.translate = `${dx / k}px ${dy / k}px`;
    return;
  }
  const box = grab.el.getBoundingClientRect();
  const clamp = v => Math.max(-44, Math.min(44, Math.round(v * 10) / 10));
  let px = dx;
  let py = dy;
  const onX = Math.abs(grab.midX + dx) < 7;
  const onY = Math.abs(grab.midY + dy) < 7;
  if (onX) px = -grab.midX;
  if (onY) py = -grab.midY;
  let nx = clamp(grab.baseX + (px / Math.max(1, box.width)) * 100);
  let ny = clamp(grab.baseY + (py / Math.max(1, box.height)) * 100);
  if (!onX && Math.abs(nx) < 1.5) nx = 0;
  if (!onY && Math.abs(ny) < 1.5) ny = 0;
  if ((onX && !grab.onX) || (onY && !grab.onY)) hum(6);
  grab.onX = onX;
  grab.onY = onY;
  grab.x = nx;
  grab.y = ny;
  grab.el.style.setProperty('--tx', nx + '%');
  grab.el.style.setProperty('--ty', ny + '%');
  showGuides(grab.sheet, onX, onY);
});
function dropGrab(e) {
  if (!grab || (e.pointerId !== undefined && e.pointerId !== grab.id)) return;
  const was = grab;
  grab = null;
  clearTimeout(was.timer);
  if (!was.live) return;
  grabbed = true;
  setTimeout(() => { grabbed = false; }, 80);
  was.el.classList.remove('is-dragging');
  was.sheet.classList.remove('is-grabbing');
  was.sheet.querySelector('.guides')?.remove();
  if (was.kind === 'text') { patchActive({ textX: was.x, textY: was.y }, { fade: false }); return; }
  was.el.style.translate = '';
  const r = was.sheet.getBoundingClientRect();
  const corner = (e.clientY < r.top + r.height / 2 ? 't' : 'b') + (e.clientX < r.left + r.width / 2 ? 'l' : 'r');
  hum(6);
  if (e.type !== 'pointercancel') patchActive({ charmPos: corner });
}
document.addEventListener('pointerup', dropGrab);
document.addEventListener('pointercancel', dropGrab);
document.addEventListener('touchmove', e => { if (grab?.live && e.cancelable) e.preventDefault(); }, { passive: false });
document.addEventListener('contextmenu', e => { if (grab || grabbed) e.preventDefault(); });
document.addEventListener('click', e => { if (grabbed && e.isTrusted) { grabbed = false; e.preventDefault(); e.stopPropagation(); } }, true);

// A tap edits the words. Once they have been moved, a second tap puts them back.
let tapWait = 0;
const written = text => String(text).split('\n').filter(l => l.trim()).length;
// The line of the poem (counting every line of the text) where a slide begins
function slideLine(poem, slide) {
  const st = resolveStyle(poem);
  const before = paginatePoem(poem.body, { ratio: st.ratio === 'auto' ? '4:5' : st.ratio, layout: st.layout }).slice(0, slide).reduce((n, s) => n + written(s.text), 0);
  return nthLine(poem.body, before);
}
function nthLine(body, n) {
  const lines = String(body || '').split('\n');
  for (let i = 0, seen = 0; i < lines.length; i++) {
    if (!lines[i].trim() || /^\s*[-—]{3,}\s*$/.test(lines[i])) continue;
    if (seen++ === n) return i;
  }
  return -1;
}
// Which line of the poem was tapped
function lineAt(e) {
  const poem = getActivePoem();
  const words = document.querySelector('#active-poem-sheet .poem-body-ro');
  const hit = e && (document.caretPositionFromPoint?.(e.clientX, e.clientY) || document.caretRangeFromPoint?.(e.clientX, e.clientY));
  const node = hit && (hit.offsetNode || hit.startContainer);
  if (!words || !node || !words.contains(node)) return -1;
  const block = (node.nodeType === 1 ? node : node.parentElement).closest('.st');
  const r = document.createRange();
  r.setStart(block || words, 0);
  r.setEnd(node, hit.offset ?? hit.startOffset);
  let n = written(r.toString().split('\n').slice(0, -1).join('\n'));
  if (block) for (const b of words.querySelectorAll('.st')) { if (b === block) break; n += written(b.textContent); }
  if (poem.carousel) {
    const st = resolveStyle(poem);
    n += paginatePoem(poem.body, { ratio: st.ratio === 'auto' ? '4:5' : st.ratio, layout: st.layout }).slice(0, state.slideIdx).reduce((k, s) => k + written(s.text), 0);
  }
  return nthLine(poem.body, n);
}
// With a mouse you type on the page itself; by touch, on the writing surface at the same line.
function editWords(line = -1) {
  if (!finePointer.matches) { goWrite(line); return; }
  state.editingRich = true;
  render();
  const ta = document.getElementById('poem-body-in') || document.getElementById('poem-title-in');
  if (ta) { ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); }
}
function tapWords(e) {
  const poem = getActivePoem();
  const line = lineAt(e);
  if (!(poem.textX || poem.textY)) { editWords(line); return; }
  if (tapWait) { clearTimeout(tapWait); tapWait = 0; patchActive({ textX: 0, textY: 0 }, { fade: false }); return; }
  document.getElementById('movable-text-col')?.classList.add('is-tapped');
  tapWait = setTimeout(() => { tapWait = 0; editWords(line); }, 260);
}
document.addEventListener('keydown', e => {
  const el = e.target.closest?.('[data-grab]');
  const poem = getActivePoem();
  if (!el || !poem || e.target !== el) return;
  const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[e.key];
  if (el.dataset.grab === 'charm') {
    if (!step) return;
    e.preventDefault();
    const at = poem.charmPos && poem.charmPos !== 'tc' ? poem.charmPos : (resolveStyle(poem).charmPos === 'tc' ? 'tr' : resolveStyle(poem).charmPos);
    patchActive({ charmPos: (step[1] ? (step[1] < 0 ? 't' : 'b') : at[0]) + (step[0] ? (step[0] < 0 ? 'l' : 'r') : at[1]) });
    return;
  }
  if (e.key === 'Enter') { e.preventDefault(); editWords(); return; }
  if (e.key === '0') { e.preventDefault(); patchActive({ textX: 0, textY: 0 }, { fade: false }); return; }
  if (!step) return;
  e.preventDefault();
  const by = e.shiftKey ? 5 : 1;
  const hold = v => Math.max(-44, Math.min(44, v));
  patchActive({ textX: hold((poem.textX || 0) + step[0] * by), textY: hold((poem.textY || 0) + step[1] * by) }, { fade: false });
});

const typing = el => Boolean(el?.closest?.('input:not([type=range]), textarea, [contenteditable]'));

window.addEventListener('keydown', e => {
  const cmd = e.metaKey || e.ctrlKey;
  const key = e.key.toLowerCase();
  const inField = typing(e.target);
  // Titles are one line: Enter moves on to the poem
  if (e.key === 'Enter' && !e.isComposing && /^(poem|ms)-title(-in)?$/.test(e.target.id || '')) {
    e.preventDefault();
    if (e.target.id === 'ms-title') focusEditor(0); else document.getElementById('poem-body-in')?.focus();
    return;
  }
  // Emphasis while typing straight on the page
  if (cmd && e.target.id === 'poem-body-in' && 'biu'.includes(key) && key) {
    e.preventDefault();
    const ta = e.target;
    const mk = { b: '**', i: '*', u: '__' }[key];
    const { selectionStart: a, selectionEnd: z } = ta;
    if (a === z) return;
    ta.setRangeText(mk + ta.value.slice(a, z) + mk, a, z, 'select');
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    return;
  }
  const studio = Boolean(state.activeId) && !state.share && !state.help;

  if (e.key === 'Escape') {
    if (state.share || state.viewing || state.help) { closeOverlay(); return; }
    if (closeMenus(true)) return;
    if (state.mobileSheetOpen) { closeSheet(); return; }
    if (inField && state.activeId) e.target.blur();
    return;
  }

  // Menus
  const menu = document.querySelector('.ios-menu');
  if (menu && menu.contains(document.activeElement)) {
    const items = [...menu.querySelectorAll('.ios-menu-item')];
    const at = items.indexOf(document.activeElement);
    const to = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: items.length - 1 }[e.key];
    if (to !== undefined) { e.preventDefault(); items[(to + items.length) % items.length].focus(); return; }
    if (e.key === 'Tab') { closeMenus(true); e.preventDefault(); return; }
  }
  // Tabs
  if (e.target.matches?.('.rail-tab')) {
    const tabs = [...document.querySelectorAll('.rail-tab')];
    const at = tabs.indexOf(e.target);
    const to = { ArrowRight: at + 1, ArrowLeft: at - 1, Home: 0, End: tabs.length - 1 }[e.key];
    if (to !== undefined) {
      e.preventDefault();
      const next = tabs[(to + tabs.length) % tabs.length].dataset.railtab;
      setTab(next);
      document.getElementById('tab-' + next)?.focus();
      return;
    }
  }

  if (cmd && key === 's' && state.activeId) { e.preventDefault(); toast('Saved on this device already'); return; }
  if (cmd && key === 'k' && !state.activeId) { e.preventDefault(); document.getElementById('gallery-search')?.focus(); return; }
  // Inside a field, undo belongs to the field
  if (cmd && studio && !inField && (key === 'z' || key === 'y')) { e.preventDefault(); stepHistory(key === 'z' && !e.shiftKey); return; }
  if (cmd || e.altKey || inField) return;
  if (e.key === '?') { e.preventDefault(); state.help ? closeOverlay() : openHelp(); return; }
  if (state.viewing && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    document.querySelector(`.viewer [data-vslide]:${e.key === 'ArrowRight' ? 'last' : 'first'}-of-type:not([disabled])`)?.click();
    return;
  }
  if (state.share && (e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.target.matches('button, [type=range]')) {
    document.querySelector(`.share-view [data-spage]:${e.key === 'ArrowRight' ? 'last' : 'first'}-of-type:not([disabled])`)?.click();
    return;
  }
  if (!studio) return;
  if (key === 's') { e.preventDefault(); openShare(); return; }
  if (key === 'w' || e.key === '1') { e.preventDefault(); goWrite(); return; }
  const tab = ['', 'looks', 'artwork', 'fonts', 'style'][Number(e.key) - 1];
  if (tab) {
    if (!desktopStage.matches) state.mobileSheetOpen = true;
    setTab(tab);
    return;
  }
  if (getActivePoem()?.carousel && !e.target.closest('[data-grab], [type=range]') && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
    e.preventDefault();
    document.getElementById(e.key === 'ArrowRight' ? 'next-slide-btn' : 'prev-slide-btn')?.click();
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
if (!state.activeId && !isFirstRun()) sing(pickSong(), 1600);
