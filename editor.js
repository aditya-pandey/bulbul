// The writing surface: plain lines where emphasis looks like emphasis and a slide break looks like one.
// It keeps its own nodes (marked data-morph-ignore), so the caret, the keyboard's own undo and Hindi
// composition are never disturbed by a render. What it hands back is the poem's usual marked-up text.

const BREAK = /^\s*[-—]{3,}\s*$/;
const MARK = /\*\*\*([^*]+)\*\*\*|\*\*([^*]+)\*\*|__([^_]+)__|\*([^*]+)\*/;
const el = (tag, ...kids) => { const n = document.createElement(tag); n.append(...kids); return n; };

function inlineNodes(text) {
  const out = [];
  let rest = text;
  for (let m; (m = rest.match(MARK)); rest = rest.slice(m.index + m[0].length)) {
    if (m.index) out.push(document.createTextNode(rest.slice(0, m.index)));
    if (m[1]) out.push(el('i', el('b', ...inlineNodes(m[1]))));
    else if (m[2]) out.push(el('b', ...inlineNodes(m[2])));
    else if (m[3]) out.push(el('u', ...inlineNodes(m[3])));
    else out.push(el('i', ...inlineNodes(m[4])));
  }
  if (rest) out.push(document.createTextNode(rest));
  return out;
}

function lineNode(text) {
  if (BREAK.test(text)) return breakNode();
  return el('div', ...(text ? inlineNodes(text) : [el('br')]));
}
function breakNode() {
  const x = el('button');
  x.type = 'button';
  x.className = 'ms-join';
  x.setAttribute('aria-label', 'Join these two slides');
  x.textContent = '×';
  const label = el('span');
  label.textContent = 'New slide';
  const n = el('div', label, x);
  n.className = 'ms-break';
  n.contentEditable = 'false';
  return n;
}

const TAGS = { B: 'b', STRONG: 'b', U: 'u', I: 'i', EM: 'i' };
const WRAP = { u: '__', b: '**', i: '*' };
function runsToText(runs) {
  const merged = [];
  for (const r of runs) {
    const last = merged[merged.length - 1];
    if (last && last.m === r.m) last.t += r.t;
    else merged.push({ ...r });
  }
  return merged.map(({ t, m }) => {
    if (!m || !t.trim()) return t;
    const [, a, core, z] = t.match(/^(\s*)([\s\S]*?)(\s*)$/);
    let s = core;
    for (const k of ['u', 'b', 'i']) if (m.includes(k)) s = WRAP[k] + s + WRAP[k];
    return a + s + z;
  }).join('');
}

export function toBody(root) {
  const lines = [];
  let cur = null;
  const flush = () => { if (cur) { lines.push(runsToText(cur)); cur = null; } };
  const walk = (n, m) => {
    if (n.nodeType === 3) {
      n.nodeValue.replace(/ /g, ' ').replace(/​/g, '').split('\n').forEach((t, i) => {
        if (i) { cur ??= []; flush(); }
        if (t) (cur ??= []).push({ t, m });
      });
      return;
    }
    if (n.nodeType !== 1) return;
    if (n.classList.contains('ms-break')) { flush(); lines.push('---'); return; }
    if (n.nodeName === 'BR') { if (cur) flush(); else lines.push(''); return; }
    if (n.nodeName === 'DIV' || n.nodeName === 'P') {
      flush();
      n.childNodes.forEach(c => walk(c, m));
      flush();
      return;
    }
    const k = TAGS[n.nodeName];
    const next = k && !m.includes(k) ? m + k : m;
    n.childNodes.forEach(c => walk(c, next));
  };
  root.childNodes.forEach(c => walk(c, ''));
  flush();
  return lines.join('\n');
}

function fill(root, body) {
  root.replaceChildren(...String(body || '').split('\n').map(lineNode));
  root.classList.toggle('is-empty', !String(body || '').trim());
}

// Where the caret is, as a direct child of the surface
function blockAt(root) {
  const sel = getSelection();
  let n = sel.rangeCount ? sel.getRangeAt(0).startContainer : null;
  if (!n || !root.contains(n)) return root.lastElementChild;
  if (n === root) return root.children[Math.min(sel.getRangeAt(0).startOffset, root.children.length - 1)] || null;
  while (n.parentNode !== root) n = n.parentNode;
  return n;
}
function caretTo(node, atEnd = true) {
  const r = document.createRange();
  r.selectNodeContents(node);
  r.collapse(!atEnd);
  const sel = getSelection();
  sel.removeAllRanges();
  sel.addRange(r);
}

let pad = null;
let hooks = { input() {}, marks() {} };
const sync = () => {
  pad.classList.toggle('is-empty', !pad.textContent.trim() && !pad.querySelector('.ms-break') && pad.children.length < 2);
  pad._body = toBody(pad);
  hooks.input(pad._body);
};

// Put the surface in its host, or refresh it when the words changed elsewhere.
export function mountEditor(host, { id, body, placeholder, style }) {
  if (!host) return;
  let n = host.querySelector('.ms-body');
  if (!n) {
    n = document.createElement('div');
    n.className = 'ms-body';
    n.contentEditable = 'true';
    n.setAttribute('data-morph-ignore', '');
    n.setAttribute('role', 'textbox');
    n.setAttribute('aria-multiline', 'true');
    n.setAttribute('aria-label', 'Your poem');
    n.setAttribute('autocapitalize', 'sentences');
    n.spellcheck = false;
    n.addEventListener('input', e => { if (!e.isComposing) sync(); });
    n.addEventListener('compositionend', sync);
    n.addEventListener('paste', e => {
      e.preventDefault();
      document.execCommand('insertText', false, e.clipboardData.getData('text/plain').replace(/\r/g, ''));
    });
    n.addEventListener('drop', e => e.preventDefault());
    n.addEventListener('focus', () => { document.execCommand('defaultParagraphSeparator', false, 'div'); document.execCommand('styleWithCSS', false, false); });
    n.addEventListener('click', e => {
      const x = e.target.closest?.('.ms-join');
      if (x) { x.closest('.ms-break').remove(); sync(); }
    });
    host.append(n);
  }
  pad = n;
  n.dataset.placeholder = placeholder || '';
  n.style.cssText = style || '';
  if (n.dataset.poem !== id || n._body !== body) {
    n.dataset.poem = id;
    n._body = body;
    fill(n, body);
  }
}

export const onEditor = h => { hooks = { ...hooks, ...h }; };
export const editorFocused = () => Boolean(pad && document.activeElement === pad);

// Caret to a line of the poem (its end), or to the end of the poem
export function focusEditor(line = -1) {
  if (!pad?.isConnected) return;
  pad.focus({ preventScroll: true });
  const at = pad.children[line] && !pad.children[line].matches('.ms-break') ? pad.children[line] : pad.lastElementChild || pad;
  caretTo(at);
  at.scrollIntoView?.({ block: 'center' });
}

// Emphasis on the selection, or on the whole line when nothing is selected
export function mark(cmd) {
  if (!pad?.isConnected) return false;
  if (!editorFocused()) { pad.focus({ preventScroll: true }); if (!pad.contains(getSelection().anchorNode)) caretTo(pad.lastElementChild || pad); }
  const sel = getSelection();
  const whole = sel.isCollapsed;
  const block = whole ? blockAt(pad) : null;
  if (whole) {
    if (!block?.textContent.trim() || block.matches?.('.ms-break')) return false;
    const r = document.createRange();
    r.selectNodeContents(block);
    sel.removeAllRanges();
    sel.addRange(r);
  }
  document.execCommand('styleWithCSS', false, false);
  document.execCommand(cmd);
  if (whole) getSelection().collapseToEnd();
  sync();
  return true;
}

// Which slide the caret is in, counting the breaks above it
export function caretSlide() {
  let n = editorFocused() ? blockAt(pad) : null;
  if (!n) return -1;
  let i = 0;
  while ((n = n.previousElementSibling)) if (n.matches('.ms-break')) i++;
  return i;
}

// The next slide starts after the line the caret is on
export function breakHere() {
  if (!pad?.isConnected || !pad.textContent.trim()) return false;
  const at = blockAt(pad) || pad.lastElementChild;
  const blank = at.nodeType === 1 && !at.textContent.trim() && !at.matches('.ms-break');
  const br = breakNode();
  if (blank) at.replaceWith(br); else at.after(br);
  let next = br.nextElementSibling;
  while (next && !next.textContent.trim() && next.nextElementSibling) { const gone = next; next = next.nextElementSibling; gone.remove(); }
  if (!next || next.matches('.ms-break')) { next = lineNode(''); br.after(next); }
  pad.focus({ preventScroll: true });
  caretTo(next, false);
  sync();
  return true;
}

document.addEventListener('selectionchange', () => {
  if (!editorFocused()) return;
  hooks.marks({ bold: document.queryCommandState('bold'), italic: document.queryCommandState('italic'), underline: document.queryCommandState('underline') });
});

// Buttons that act on the selection must not take it away
document.addEventListener('mousedown', e => { if (e.target.closest?.('.ms-bar button')) e.preventDefault(); });
