// Sharing without a server: the page is painted to an image here, then handed to the system share
// sheet, the clipboard or a download. Nothing is uploaded by Bulbul.
import { posterBlob, mockBlob, posterName } from './export.js';
import { finishSrc, paginatePoem, resolveStyle } from './data.js';

const g = (body, filled = false) => `<svg width="22" height="22" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="${filled ? 'none' : 'currentColor'}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

// `send`: "paste" copies the image and opens the composer; "upload" downloads it and opens the site.
export const PLATFORMS = [
  { id: 'image', label: 'Image', ratio: '', icon: g('<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="9" cy="9" r="1.8"/><path d="M4 17l5-5 4 4 3-3 4 4"/>') },
  { id: 'whatsapp', label: 'WhatsApp', ratio: '4:5', send: 'paste', url: t => `https://wa.me/?text=${encodeURIComponent(t)}`, icon: g('<path d="M4 20l1.2-4A8 8 0 1 1 8.2 19L4 20z"/><path d="M9 9.2c.2 3 2.6 5.4 5.6 5.8l1-1.6-2-1-.9.8c-1-.4-1.8-1.2-2.2-2.2l.8-.9-1-2z" fill="currentColor" stroke="none"/>') },
  { id: 'insta', label: 'Instagram', ratio: '4:5', send: 'upload', url: () => 'https://www.instagram.com/', icon: g('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="3.9"/><circle cx="16.8" cy="7.2" r=".6" fill="currentColor"/>') },
  { id: 'story', label: 'Story', ratio: '9:16', send: 'upload', url: () => 'https://www.instagram.com/', icon: g('<rect x="6.5" y="2.5" width="11" height="19" rx="3"/><path d="M12 9v6M9 12h6"/>') },
  { id: 'pin', label: 'Pinterest', ratio: '2:3', send: 'upload', url: () => 'https://www.pinterest.com/pin-creation-tool/', icon: g('<circle cx="12" cy="12" r="9"/><path d="M10.2 20l2-9M9 12.5c-1.8-3.5 1-5.8 3.5-5.5 3 .3 4 3.2 2.7 5.8-1.2 2.4-3.5 2-4 .6"/>') },
  { id: 'x', label: 'X', ratio: '4:5', send: 'paste', url: t => `https://x.com/intent/post?text=${encodeURIComponent(t)}`, icon: g('<path d="M4 4l16 16M20 4L4 20"/>') },
  { id: 'threads', label: 'Threads', ratio: '4:5', send: 'paste', url: t => `https://www.threads.com/intent/post?text=${encodeURIComponent(t)}`, icon: g('<path d="M17.5 8.5C16.5 5 14.5 4 12 4 8 4 5 7 5 12s3 8 7 8c3.5 0 6-2 6-4.6 0-2.7-2.6-3.9-5.6-3.9-2.3 0-3.9.9-3.9 2.6 0 1.5 1.3 2.4 2.9 2.4 2.5 0 3.6-1.8 3.6-4.5 0-2.2-1.1-3.5-3-3.5-1.3 0-2.2.5-2.7 1.4"/>') },
  { id: 'facebook', label: 'Facebook', ratio: '4:5', send: 'paste', url: () => 'https://www.facebook.com/', icon: g('<circle cx="12" cy="12" r="9"/><path d="M12.8 21v-8h2.6M12.8 13H10M12.8 13v-2.2c0-1.8.9-2.6 2.7-2.6"/>') }
];

export const platformOf = id => PLATFORMS.find(p => p.id === id) || PLATFORMS[0];

export function captionFor(poem) {
  return [poem.title?.trim(), poem.sign?.trim()].filter(Boolean).join('\n');
}

// The slides a share will send: one poster, or the poem split across several
export function sharePages(poem, platform, split) {
  const st = resolveStyle(poem);
  const ratio = platform.ratio || (split && st.ratio === 'auto' ? '4:5' : st.ratio);
  if (!split) return { ratio, pages: [null] };
  return { ratio, pages: paginatePoem(poem.body, { ratio, layout: st.layout }) };
}

// Painted posters, remembered until the poem or the target size changes
const made = new Map();
function remember(key, job) {
  if (!made.has(key)) {
    if (made.size > 40) made.delete(made.keys().next().value);
    const p = job();
    p.catch(() => made.delete(key));
    made.set(key, p);
  }
  return made.get(key);
}
const pageKey = page => (page ? page.index + '/' + page.total : 'whole');
export function poster(poem, ratio, page) {
  return remember([poem.id, poem.updatedAt, ratio, pageKey(page)].join('|'),
    () => posterBlob({ ...poem, ratio }, page).then(blob => ({ blob, name: posterName(poem, page) })));
}
export function mockup(poem, platform, page, html) {
  return remember(['mock', poem.id, poem.updatedAt, html].join('|'),
    () => mockBlob(html, poem).then(blob => ({ blob, name: posterName(poem, page).replace(/\.png$/, `-${platform.id}-mockup.png`) })));
}

// What a mockup sits on
export const BACKDROPS = [
  { id: 'poem', label: 'From the poem' },
  { id: 'paper', label: 'Paper' },
  { id: 'wash', label: 'Watercolour' },
  { id: 'red', label: 'Bulbul red' },
  { id: 'ink', label: 'Ink' },
  { id: 'clear', label: 'Transparent' }
];
export function backdropCSS(id, poem) {
  const { pal } = resolveStyle(poem);
  const bg2 = pal.bg2 || pal.bg;
  switch (id) {
    case 'paper': return { css: 'background:#EFEAE1', dark: false };
    case 'wash': return { css: 'background:#F7F1E6', dark: false };
    case 'red': return { css: 'background:#A82E26', dark: true };
    case 'ink': return { css: 'background:#1C1714', dark: true };
    case 'clear': return { css: 'background:transparent', dark: false };
    default: return { css: `background:color-mix(in srgb, ${pal.acc || pal.ink} 30%, ${bg2})`, dark: Boolean(pal.dark) };
  }
}
export function mockStage(id, poem, cardHTML) {
  const { css, dark } = backdropCSS(id, poem);
  const st = resolveStyle(poem);
  const wash = id === 'wash' ? `<img class="mock-wash" src="${finishSrc(st.atmos || 'wash-blush')}" alt="">` : '';
  return `<div class="mock-stage bd-${id}${dark ? ' on-dark' : ''}" style="${css}">${wash}<div class="mock-fit">${cardHTML}</div></div>`;
}

export function copyImage(blobPromise) {
  if (!navigator.clipboard?.write || typeof ClipboardItem === 'undefined') return Promise.reject(new Error('unsupported'));
  // Hand over the promise itself: Safari only allows the write inside the click.
  return navigator.clipboard.write([new ClipboardItem({ 'image/png': blobPromise })]);
}

const asFiles = posters => posters.map(p => new File([p.blob], p.name, { type: 'image/png' }));
export function canShareFiles() {
  try { return Boolean(navigator.canShare?.({ files: [new File([''], 'a.png', { type: 'image/png' })] })); } catch { return false; }
}
export function shareFiles(posters, text) {
  return navigator.share({ files: asFiles(posters), text });
}
export function downloadPoster({ blob, name }) {
  const a = document.createElement('a');
  a.download = name;
  a.href = URL.createObjectURL(blob);
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}
