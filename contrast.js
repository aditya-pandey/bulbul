// Reading contrast between a chosen ink and the paper under it.
import { INK_SWATCHES, resolveStyle } from './data.js';

const rgb = hex => {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? [...h].map(c => c + c).join('') : h;
  return [0, 2, 4].map(i => parseInt(f.slice(i, i + 2), 16));
};
const lum = hex => {
  const [r, g, b] = rgb(hex).map(v => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
export function contrast(a, b) {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}
const apart = (a, b) => rgb(a).reduce((t, v, i) => t + (v - rgb(b)[i]) ** 2, 0);

// null when the words read well, or when the paper isn't what's behind them
export function inkAdvice(poem) {
  const st = resolveStyle(poem);
  if (st.inkColor === 'auto' || st.bgMode === 'photo' || (st.bgMode === 'art' && st.layout === 'overlay')) return null;
  if (['torn', 'cutout-line', 'cutout-word'].includes(st.textStyle)) return null;
  const grounds = [st.pal.bg, st.pal.bg2 || st.pal.bg];
  const worst = ink => Math.min(...grounds.map(g => contrast(ink, g)));
  if (worst(st.pal.ink) >= 4.5) return null;
  const own = resolveStyle({ ...poem, inkColor: 'auto' }).pal.ink;
  const choices = INK_SWATCHES.map(s => ({ id: s.id, label: s.hex ? s.label : 'the paper’s own ink', hex: s.hex || own })).filter(c => worst(c.hex) >= 4.5);
  if (!choices.length) return null;
  choices.sort((a, b) => apart(a.hex, st.pal.ink) - apart(b.hex, st.pal.ink));
  return choices[0];
}
