// Touch gestures for the phone layout: panels follow the finger, pages swipe.
// A drag may start on a handle, or anywhere in a panel whose content is scrolled to the top.

const SLOP = 8;
const phone = matchMedia('(max-width: 860px)');

const isField = el => Boolean(el.closest('input, textarea, select, [contenteditable]'));

function scrollsX(el, until) {
  for (let n = el; n && n !== until; n = n.parentElement) {
    if (n.scrollWidth > n.clientWidth + 2 && /auto|scroll/.test(getComputedStyle(n).overflowX)) return true;
  }
  return false;
}
function atTop(el, until) {
  for (let n = el; n; n = n.parentElement) {
    if (n.scrollTop > 0 && n.scrollHeight > n.clientHeight + 1) return false;
    if (n === until) break;
  }
  return true;
}

/**
 * panels: [{ selector, handle, up, start(el), move(el, dy), end(el, dy, velocity) }]
 * swipes: [{ selector, go(direction) }]
 */
export function initGestures({ panels, swipes }) {
  let g = null;
  let eatClick = false;

  function begin(target, x, y, mouse) {
    g = null;
    if (!phone.matches || !target?.closest) return;
    const panel = panels.map(p => ({ p, el: target.closest(p.selector) })).find(h => h.el);
    const swipe = swipes.map(s => ({ s, el: target.closest(s.selector) })).find(h => h.el);
    const onHandle = Boolean(panel && panel.p.handle && target.closest(panel.p.handle));
    if (!panel && !swipe) return;
    if (mouse && !onHandle && !swipe) return;
    g = { target, x, y, panel, swipe, onHandle, mode: '', lastY: y, lastT: performance.now(), v: 0 };
  }

  function move(x, y, e) {
    if (!g) return;
    const dx = x - g.x;
    const dy = y - g.y;
    if (!g.mode) {
      if (Math.hypot(dx, dy) < SLOP) return;
      if (Math.abs(dx) > Math.abs(dy) * 1.2) {
        if (!g.swipe || isField(g.target) || scrollsX(g.target, g.swipe.el)) { g = null; return; }
        g.mode = 'swipe';
      } else {
        const free = g.panel && ((g.onHandle && (dy > 0 || g.panel.p.up)) || (dy > 0 && !isField(g.target) && atTop(g.target, g.panel.el)));
        if (!free) { g = null; return; }
        g.mode = 'drag';
        g.y = y; // start from here, so the panel doesn't jump by the slop
        g.panel.p.start(g.panel.el);
      }
    }
    if (e.cancelable) e.preventDefault();
    if (g.mode !== 'drag') return;
    const now = performance.now();
    if (now > g.lastT) g.v = g.v * 0.4 + ((y - g.lastY) / (now - g.lastT)) * 0.6;
    g.lastY = y;
    g.lastT = now;
    g.panel.p.move(g.panel.el, y - g.y);
  }

  function finish(x, y, cancelled) {
    const was = g;
    g = null;
    if (!was || !was.mode) return;
    eatClick = true;
    setTimeout(() => { eatClick = false; }, 60);
    if (was.mode === 'swipe') {
      const dx = x - was.x;
      if (!cancelled && Math.abs(dx) > 40) was.swipe.s.go(dx < 0 ? 1 : -1);
      return;
    }
    // A pause before letting go means it wasn't a flick
    const v = performance.now() - was.lastT > 90 ? 0 : was.v;
    was.panel.p.end(was.panel.el, cancelled ? 0 : y - was.y, cancelled ? 0 : v);
  }

  document.addEventListener('touchstart', e => {
    if (e.touches.length > 1) { const t = e.touches[0]; finish(t.clientX, t.clientY, true); return; }
    begin(e.target, e.touches[0].clientX, e.touches[0].clientY, false);
  }, { passive: true });
  document.addEventListener('touchmove', e => { if (g) move(e.touches[0].clientX, e.touches[0].clientY, e); }, { passive: false });
  document.addEventListener('touchend', e => { const t = e.changedTouches[0]; finish(t.clientX, t.clientY, false); });
  document.addEventListener('touchcancel', e => { const t = e.changedTouches[0]; finish(t.clientX, t.clientY, true); });

  // A mouse in a narrow window can use the handles too
  document.addEventListener('mousedown', e => { if (e.button === 0) begin(e.target, e.clientX, e.clientY, true); });
  document.addEventListener('mousemove', e => { if (g) move(e.clientX, e.clientY, e); });
  document.addEventListener('mouseup', e => finish(e.clientX, e.clientY, false));
  document.addEventListener('click', e => {
    if (!eatClick || !e.isTrusted) return;
    eatClick = false;
    e.preventDefault();
    e.stopPropagation();
  }, true);
}
