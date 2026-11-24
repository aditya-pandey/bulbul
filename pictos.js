// Small pictures of what a choice does to the page, drawn in the interface ink.
const svg = inner => `<svg class="pic" viewBox="0 0 40 50" width="40" height="50" fill="none" stroke="currentColor" stroke-linecap="round" aria-hidden="true">${inner}</svg>`;
const sheet = (inner, extra = '') => svg(`<rect x="4" y="1.5" width="32" height="47" rx="2.5" stroke-width="1.4"${extra}/>${inner}`);
const ln = (x, y, w, o = 1) => `<path d="M${x} ${y}h${w}" stroke-width="2" opacity="${o}"/>`;
const art = (x, y, w, h, rx = 1.5) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="currentColor" stroke="none" opacity=".3"/>`;
const lines = (x, y, ws, gap = 5) => ws.map((w, i) => ln(x, y + i * gap, w)).join('');

export const PLACEMENT = {
  side: sheet(lines(8, 17, [9, 11, 8, 10]) + art(22, 10, 11, 30)),
  overlay: sheet(art(4, 1.5, 32, 47, 2.5) + lines(13, 19, [14, 10, 14])),
  below: sheet(lines(12, 9, [16, 12, 14]) + art(10, 26, 20, 17)),
  corner: sheet(lines(8, 9, [16, 12, 14]) + art(19, 28, 14, 17)),
  scene: sheet(lines(8, 9, [16, 12]) + '<path d="M4 38c6-8 10-3 14-5s10-8 18-2v15a2.5 2.5 0 0 1-2.5 2.5h-27A2.5 2.5 0 0 1 4 46z" fill="currentColor" stroke="none" opacity=".3"/>'),
  arch: sheet('<path d="M13 27V15a7 7 0 0 1 14 0v12z" fill="currentColor" stroke="none" opacity=".3"/>' + lines(13, 34, [14, 10, 12])),
  print: sheet('<g transform="rotate(-5 20 17)"><rect x="11" y="7" width="18" height="20" rx="1" stroke-width="1.3"/>' + art(13, 9, 14, 12, .5) + '</g><path d="M16 5.5l8-1" stroke-width="3" opacity=".5"/>' + lines(12, 35, [16, 12]))
};

const words = lines(13, 20, [14, 10, 14]);
export const FRAME = {
  none: sheet(words),
  hairline: sheet('<rect x="8" y="5.5" width="24" height="39" stroke-width="1"/><rect x="10" y="7.5" width="20" height="35" stroke-width=".6"/>' + words),
  bookpage: sheet('<path d="M9 8h22M9 41h22" stroke-width="1"/><circle cx="20" cy="45" r="1" fill="currentColor" stroke="none"/>' + words),
  polaroid: sheet('<path fill="currentColor" stroke="none" opacity=".3" fill-rule="evenodd" d="M4 4a2.5 2.5 0 0 1 2.5-2.5h27A2.5 2.5 0 0 1 36 4v42a2.5 2.5 0 0 1-2.5 2.5h-27A2.5 2.5 0 0 1 4 46zM8.5 6v34h23V6z"/>' + words),
  arch: sheet('<path d="M9 44V18a11 11 0 0 1 22 0v26z" stroke-width="1"/>' + lines(14, 24, [12, 9, 12])),
  airmail: sheet('<rect x="5.5" y="3" width="29" height="44" rx="1.5" stroke-width="3" stroke-dasharray="3 3" stroke-linecap="butt" opacity=".75"/>' + words),
  stamp: sheet('<rect x="5" y="2.5" width="30" height="45" rx="1" stroke-width="2.6" stroke-dasharray=".1 4"/><rect x="10" y="8" width="20" height="34" stroke-width="1"/>' + words),
  film: sheet('<path d="M4 4a2.5 2.5 0 0 1 2.5-2.5h27A2.5 2.5 0 0 1 36 4v5H4zM4 41h32v5a2.5 2.5 0 0 1-2.5 2.5h-27A2.5 2.5 0 0 1 4 46z" fill="currentColor" stroke="none" opacity=".75"/>' + lines(13, 21, [14, 10, 14])),
  deco: sheet('<path d="M8 14V6h8M32 14V6h-8M8 36v8h8M32 36v8h-8" stroke-width="1.3"/><path d="M11 12V9h3M29 12V9h-3M11 38v3h3M29 38v3h-3" stroke-width=".9"/>' + words),
  ajrakh: sheet('<rect x="6.5" y="4" width="27" height="42" stroke-width="4.5" opacity=".35"/><rect x="6.5" y="4" width="27" height="42" stroke-width="2" stroke-dasharray=".1 5"/>' + words),
  kantha: sheet('<rect x="8" y="5.5" width="24" height="39" stroke-width="1.3" stroke-dasharray="3 2.5"/><rect x="10.5" y="8" width="19" height="34" stroke-width=".9" stroke-dasharray="2 2"/>' + words),
  vine: sheet('<path d="M8 6c4 3 4-2 8 0s4 2 8 0 4 3 8 0M8 44c4 3 4-2 8 0s4 2 8 0 4 3 8 0M8 6c3 5-2 6 0 12s2 8 0 13-2 8 0 13M32 6c3 5-2 6 0 12s2 8 0 13-2 8 0 13" stroke-width="1.1"/>' + words)
};

const body = lines(9, 25, [20, 15, 18, 12], 5.5);
export const TITLE = {
  classic: sheet('<path d="M9 11h15" stroke-width="3.4"/>' + ln(9, 17, 5, .5) + body),
  none: sheet(lines(9, 12, [20, 15, 18, 12, 16, 10], 5.5)),
  dropcap: sheet('<path d="M9.5 18l4-10 4 10M11 14.5h5" stroke-width="2"/>' + ln(20, 11, 11) + ln(20, 17, 8) + body),
  smallcaps: sheet('<path d="M9 11h2.5M14 11h2.5M19 11h2.5M24 11h2.5" stroke-width="2"/>' + ln(9, 17, 5, .5) + body),
  italic: sheet('<path d="M9 15l2.5-6M13 15l2.5-6M17 15l2.5-6M21 15l2.5-6M25 15l2.5-6" stroke-width="1.8"/>' + body),
  highlight: sheet('<rect x="8" y="7" width="20" height="8" rx="1.5" fill="currentColor" stroke="none" opacity=".26"/><path d="M11 11h13" stroke-width="2.6"/>' + body),
  vertical: sheet('<path d="M9 14v20" stroke-width="2.4" opacity=".6"/>' + lines(14, 15, [16, 12, 15, 10, 13], 5.5))
};

const strip = (x, y, w) => `<rect x="${x}" y="${y}" width="${w}" height="6" rx=".6" stroke-width="1"/><path d="M${x + 2} ${y + 3}h${w - 4}" stroke-width="1.5"/>`;
export const LINE = {
  plain: sheet(lines(9, 14, [20, 15, 18, 12, 16], 5.5)),
  torn: sheet('<path d="M9 9l4 1 5-1 6 1.5 6-1 1 8-1 7 1 8-1.5 8-6-1-5 1.5-6-1-4 1-.5-8 1-8-1-8z" stroke-width="1.1" fill="currentColor" fill-opacity=".12"/>' + lines(13, 19, [13, 9, 12])),
  'cutout-line': sheet(strip(8, 11, 22) + strip(8, 20, 16) + strip(8, 29, 20)),
  'cutout-word': sheet(strip(8, 11, 9) + strip(19, 12, 12) + strip(8, 21, 13) + strip(23, 20, 8) + strip(9, 30, 11) + strip(22, 30, 9)),
  ruled: sheet([14, 22, 30].map((y, i) => `<path d="M9 ${y}h${[18, 13, 16][i]}" stroke-width="1.6"/><path d="M9 ${y + 3.5}h${[18, 13, 16][i]}" stroke-width="1" opacity=".7"/>`).join('')),
  marker: sheet([12, 20, 28].map((y, i) => `<rect x="8" y="${y}" width="${[21, 16, 19][i]}" height="5.5" rx="1" fill="currentColor" stroke="none" opacity=".26"/><path d="M10 ${y + 2.8}h${[17, 12, 15][i]}" stroke-width="1.5"/>`).join('')),
  blackout: sheet([11, 19, 27].map((y, i) => `<rect x="8" y="${y}" width="${[14, 10, 16][i]}" height="5.5" fill="currentColor" stroke="none"/><rect x="${[24, 20, 26][i]}" y="${y}" width="7" height="5.5" rx="2.7" stroke-width="1"/>`).join(''))
};

export const ALIGN = {
  left: sheet(lines(9, 15, [20, 13, 18, 10], 6)),
  center: sheet([20, 13, 18, 10].map((w, i) => ln(20 - w / 2, 15 + i * 6, w)).join('')),
  right: sheet([20, 13, 18, 10].map((w, i) => ln(31 - w, 15 + i * 6, w)).join(''))
};
