// Minimal keyed DOM patcher. Updates the live tree to match an HTML string while keeping
// every element that still belongs: scroll offsets, focus, image decodes, running CSS
// transitions and IME composition all survive a render.

const IGNORE = 'data-morph-ignore';

function keyOf(node) {
  if (node.nodeType !== 1) return null;
  if (node.id) return '#' + node.id;
  const d = node.dataset;
  if (!d) return null;
  for (const name in d) return name + ':' + d[name];
  return null;
}

function sameKind(a, b) {
  return a.nodeType === b.nodeType && a.nodeName === b.nodeName && keyOf(a) === keyOf(b);
}

function patchAttributes(from, to) {
  for (const { name, value } of to.attributes) {
    if (from.getAttribute(name) !== value) from.setAttribute(name, value);
  }
  for (const { name } of Array.from(from.attributes)) {
    if (!to.hasAttribute(name)) from.removeAttribute(name);
  }
}

function patchNode(from, to) {
  if (from.isEqualNode(to)) return;
  if (from.nodeType !== 1) {
    if (from.nodeValue !== to.nodeValue) from.nodeValue = to.nodeValue;
    return;
  }
  patchAttributes(from, to);
  patchChildren(from, to);
}

function patchChildren(parent, target) {
  const keyed = new Map();
  for (const c of parent.childNodes) {
    const k = keyOf(c);
    if (k) keyed.set(k, c);
  }

  let cursor = parent.firstChild;
  const skip = () => {
    while (cursor && cursor.nodeType === 1 && cursor.hasAttribute(IGNORE)) cursor = cursor.nextSibling;
  };
  const wanted = new Set();
  for (const t of target.childNodes) {
    const k = keyOf(t);
    if (k) wanted.add(k);
  }

  for (const want of Array.from(target.childNodes)) {
    // Drop nodes that no longer exist so their neighbours keep their place.
    for (skip(); cursor; skip()) {
      const ck = keyOf(cursor);
      if (!ck || wanted.has(ck)) break;
      const gone = cursor;
      cursor = cursor.nextSibling;
      gone.remove();
    }

    const k = keyOf(want);
    let match = null;
    if (k) {
      const hit = keyed.get(k);
      if (hit && sameKind(hit, want)) { match = hit; keyed.delete(k); }
    } else if (cursor && sameKind(cursor, want)) {
      match = cursor;
    }

    if (!match) {
      parent.insertBefore(want, cursor);
      continue;
    }
    if (match === cursor) cursor = cursor.nextSibling;
    else parent.insertBefore(match, cursor);
    patchNode(match, want);
  }

  for (skip(); cursor; skip()) {
    const gone = cursor;
    cursor = cursor.nextSibling;
    gone.remove();
  }
}

// Form values live in properties, not attributes, so bring them in line after a patch.
function syncFields(root) {
  for (const el of root.querySelectorAll('textarea, input')) {
    if (el.type === 'file' || el.type === 'checkbox' || el.type === 'radio') continue;
    const next = el.nodeName === 'TEXTAREA' ? el.textContent : (el.getAttribute('value') || '');
    if (el.value !== next) el.value = next;
  }
}

export function morph(root, html) {
  const tpl = document.createElement('template');
  // Collapse layout whitespace between tags: it carries no meaning here and would
  // otherwise be matched as anonymous text nodes.
  tpl.innerHTML = html;
  stripLayoutText(tpl.content);
  patchChildren(root, tpl.content);
  syncFields(root);
}

function stripLayoutText(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const drop = [];
  while (walker.nextNode()) {
    const n = walker.currentNode;
    if (!n.nodeValue.trim() && /\n/.test(n.nodeValue) && !n.parentNode.closest?.('textarea, .poem-body-ro')) drop.push(n);
  }
  drop.forEach(n => n.remove());
}
