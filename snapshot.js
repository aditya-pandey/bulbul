// Renders the poster's real markup to a canvas, so the saved PNG is the preview.
// The sheet, its styles, images and fonts are inlined into one SVG, which the browser then paints.
import { renderSheetHTML, fitSheet, SHEET_W } from './sheet.js';
import { RATIOS, resolveStyle } from './data.js';

const urlCache = new Map();
function toDataURL(url) {
  if (url.startsWith('data:')) return Promise.resolve(url);
  if (!urlCache.has(url)) {
    urlCache.set(url, fetch(url).then(r => {
      if (!r.ok) throw new Error(`Could not load ${url}`);
      return r.blob();
    }).then(blob => new Promise((res, rej) => {
      const fr = new FileReader();
      fr.onload = () => res(String(fr.result));
      fr.onerror = rej;
      fr.readAsDataURL(blob);
    })).catch(err => { urlCache.delete(url); throw err; }));
  }
  return urlCache.get(url);
}

const textCache = new Map();
function getText(url) {
  if (!textCache.has(url)) textCache.set(url, fetch(url).then(r => { if (!r.ok) throw new Error(url); return r.text(); }).catch(err => { textCache.delete(url); throw err; }));
  return textCache.get(url);
}

function covers(range, points) {
  if (!range) return true;
  return range.split(',').some(part => {
    const m = part.trim().match(/^U\+([0-9A-F?]+)(?:-([0-9A-F]+))?$/i);
    if (!m) return false;
    const lo = parseInt(m[1].replace(/\?/g, '0'), 16);
    const hi = m[2] ? parseInt(m[2], 16) : parseInt(m[1].replace(/\?/g, 'F'), 16);
    return points.some(p => p >= lo && p <= hi);
  });
}

// Only the font files this poem needs: its families, and the subsets its characters fall in.
async function fontCSS(families, text) {
  const points = [...new Set(Array.from(text, c => c.codePointAt(0)))];
  const sheets = [...document.querySelectorAll('link[rel="stylesheet"][href*="fonts.googleapis.com"]')].map(l => l.href);
  const faces = (await Promise.all(sheets.map(getText))).join('\n').match(/@font-face\s*{[^}]*}/g) || [];
  const wanted = faces.filter(f => {
    const fam = f.match(/font-family:\s*['"]?([^'";]+)/)?.[1];
    return families.has(fam) && covers(f.match(/unicode-range:\s*([^;]+);/)?.[1], points);
  });
  const out = await Promise.all(wanted.map(async f => {
    const src = f.match(/url\(([^)]+)\)/)?.[1].replace(/['"]/g, '');
    return f.replace(/src:[^;]+;/, `src:url(${await toDataURL(src)}) format('woff2');`);
  }));
  return out.join('\n');
}

const isWebKit = /AppleWebKit/.test(navigator.userAgent) && !window.chrome;

function loadSVG(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not paint the poster'));
    img.src = src;
  });
}

async function paint(svg, w, h) {
  const src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d');
  const probe = document.createElement('canvas');
  probe.width = probe.height = 48;
  const pctx = probe.getContext('2d', { willReadFrequently: true });
  // WebKit reports an SVG loaded before its nested images and fonts have decoded.
  // Paint again until two passes agree.
  let last = '';
  for (let pass = 0; pass < (isWebKit ? 10 : 1); pass++) {
    const img = await loadSVG(src);
    await img.decode?.().catch(() => {});
    if (isWebKit) await new Promise(r => setTimeout(r, 120));
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);
    pctx.drawImage(cv, 0, 0, 48, 48);
    const now = pctx.getImageData(0, 0, 48, 48).data.join(); // throws if tainted
    if (pass > 2 && now === last) break;
    last = now;
  }
  return cv;
}

export async function snapshotPoem(poem, slide = null) {
  const st = resolveStyle(poem);
  const ratioId = slide && slide.total > 1 && st.ratio === 'auto' ? '4:5' : st.ratio;
  const rat = RATIOS.find(r => r.id === ratioId) || RATIOS[1];
  const baseW = SHEET_W['rat-' + ratioId.replace(':', '-')] || 458;
  const scale = rat.w / baseW;

  const host = document.createElement('div');
  host.className = 'snapshot-host';
  host.style.width = baseW + 'px';
  host.innerHTML = renderSheetHTML(poem, { slide });
  document.body.appendChild(host);
  try {
    const sheet = host.querySelector('.poem-sheet');
    const imgs = [...sheet.querySelectorAll('img')];
    await document.fonts.ready;
    await Promise.all(imgs.map(i => i.decode().catch(() => {})));
    fitSheet(sheet);
    const outH = rat.h || Math.min(6000, Math.round(sheet.offsetHeight * scale));
    const families = new Set([...st.font.fam.matchAll(/'([^']+)'/g)].map(m => m[1]));
    const [css, fonts] = await Promise.all([
      getText(new URL('./styles.css', location.href).href),
      fontCSS(families, sheet.textContent + ' ' + poem.title),
      ...imgs.map(async i => i.setAttribute('src', await toDataURL(i.src)))
    ]);
    imgs.forEach(i => { i.removeAttribute('loading'); i.removeAttribute('decoding'); });
    const xml = new XMLSerializer().serializeToString(sheet);
    const clean = css.replace(/]]>/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${rat.w}" height="${outH}" viewBox="0 0 ${rat.w} ${outH}"><foreignObject x="0" y="0" width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" class="snapshot-root" style="width:${baseW}px;height:${outH / scale}px;zoom:${scale};"><style><![CDATA[${fonts}\n${clean}]]></style>${xml}</div></foreignObject></svg>`;
    return await paint(svg, rat.w, outH);
  } finally {
    host.remove();
  }
}
