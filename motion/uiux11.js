/* uiux11: birthday wheel picker (iOS-style glass, three scroll-snap columns: month / day / year).
   Presentation only. It replaces the game's own #birthdaypicker166 sheet (app.js bindIdentity130) by intercepting
   taps on [data-birthday-open166] in the capture phase, and writes the result exactly where the game reads it:
   the hidden <input id="{prefix}birthday"> as "YYYY-MM-DD" (validated by readIdentity130: 1900-01-01 … today).
   The visible label / age line are refreshed with the game's own birthdayLabel166() + playerAge130().
   Nothing else in the save is touched. Loads motion/uiux11.css itself.
   Kill switch: window.SCENE_UIUX11_OFF=true (checked on every tap) restores the game's original picker. */
(function(){
'use strict';
if (window.SCENE_UIUX11_OFF) return;
var ROW = 40, VISIBLE = 5; /* row height (px) and rows shown; keep in sync with uiux11.css */
var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
var RM = function(){ return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
(function css(){ if (document.getElementById('uiux11-css')) return; var l = document.createElement('link'); l.rel = 'stylesheet'; l.id = 'uiux11-css'; l.href = './motion/uiux11.css?v=uiux11-1'; (document.head || document.documentElement).appendChild(l); })();

function pad(n){ return String(n).padStart(2, '0'); }
function today(){ var d = new Date(); return { y: d.getFullYear(), m: d.getMonth() + 1, d: d.getDate() }; }
function daysIn(y, m){ return new Date(y, m, 0).getDate(); }
function ageOf(v){ try { if (typeof playerAge130 === 'function') return playerAge130(v); } catch (e) {}
 var p = v.split('-').map(Number), t = today(); return t.y - p[0] - ((t.m < p[1] || (t.m === p[1] && t.d < p[2])) ? 1 : 0); }
function labelOf(v){ try { if (typeof birthdayLabel166 === 'function') return birthdayLabel166(v); } catch (e) {} var p = v.split('-').map(Number); return p[2] + ' ' + MONTHS[p[1]-1] + ' ' + p[0]; }
var MIN_YEAR = 1900; /* readIdentity130 rejects anything before 1900-01-01 */

var cur = null; /* open picker state */

function open(prefix, opener){
 close(true);
 var input = document.getElementById(prefix + 'birthday'); if (!input) return false;
 var t = today(), v = String(input.value || '');
 /* default = the game's own default (current year − 25, 1 January) */
 var sel = /^\d{4}-\d{2}-\d{2}$/.test(v) ? v.split('-').map(Number) : [t.y - 25, 1, 1];
 sel = { y: Math.min(t.y, Math.max(MIN_YEAR, sel[0])), m: Math.min(12, Math.max(1, sel[1])), d: Math.max(1, sel[2]) };
 var root = document.createElement('div'); root.id = 'u11picker'; root.className = 'u11picker' + (RM() ? ' u11rm' : '');
 root.innerHTML = '<div class="u11backdrop" data-u11cancel></div>' +
  '<div class="u11sheet" role="dialog" aria-modal="true" aria-labelledby="u11title">' +
   '<div class="u11grab" aria-hidden="true"></div>' +
   '<div class="u11head"><button type="button" class="u11btn u11cancel" data-u11cancel>Cancel</button><strong id="u11title">Birthday</strong><button type="button" class="u11btn u11done" data-u11done>Done</button></div>' +
   '<div class="u11readout" aria-live="polite"><b class="u11date"></b><small class="u11age"></small></div>' +
   '<div class="u11wheels"><div class="u11band" aria-hidden="true"></div>' +
    col('month', 'Month') + col('day', 'Day') + col('year', 'Year') +
   '</div>' +
   '<small class="u11hint">Swipe or scroll each wheel · arrow keys work too</small>' +
  '</div>';
 document.body.appendChild(root);
 cur = { root: root, prefix: prefix, input: input, opener: opener || null, sel: sel, cols: {} };
 ['month', 'day', 'year'].forEach(function(k){ cur.cols[k] = root.querySelector('[data-u11col="' + k + '"]'); });
 fill('month'); fill('year'); fill('day');
 ['month', 'day', 'year'].forEach(function(k){ wire(k); jump(k, false); });
 readout();
 root.querySelectorAll('[data-u11cancel]').forEach(function(b){ b.addEventListener('click', function(){ close(); }); });
 root.querySelector('[data-u11done]').addEventListener('click', done);
 root.addEventListener('keydown', function(e){ if (e.key === 'Escape') { e.preventDefault(); close(); } else if (e.key === 'Enter' && e.target.closest('[data-u11col]')) { e.preventDefault(); done(); } });
 requestAnimationFrame(function(){ root.classList.add('u11on'); ['month', 'day', 'year'].forEach(function(k){ jump(k, false); paint(k); }); try { cur && cur.cols.month.focus({ preventScroll: true }); } catch (e) {} });
 return true;
}
function col(k, label){
 return '<div class="u11col" data-u11col="' + k + '" tabindex="0" role="spinbutton" aria-label="' + label + '"><div class="u11pad"></div><div class="u11items"></div><div class="u11pad"></div></div>';
}
function range(k){
 var t = today(), s = cur.sel;
 if (k === 'month') return { min: 1, max: 12 };
 if (k === 'year') return { min: MIN_YEAR, max: t.y };
 return { min: 1, max: daysIn(s.y, s.m) };
}
function text(k, n){ return k === 'month' ? MONTHS[n-1] : String(n); }
function fill(k){
 var r = range(k), box = cur.cols[k].querySelector('.u11items'), h = '';
 for (var n = r.min; n <= r.max; n++) h += '<div class="u11item" data-v="' + n + '" aria-hidden="true"><span>' + text(k, n) + '</span></div>';
 box.innerHTML = h; cur.cols[k]._min = r.min; cur.cols[k]._max = r.max;
}
function val(k){ return k === 'month' ? cur.sel.m : k === 'day' ? cur.sel.d : cur.sel.y; }
function setVal(k, n){ if (k === 'month') cur.sel.m = n; else if (k === 'day') cur.sel.d = n; else cur.sel.y = n; }
function jump(k, smooth){
 var c = cur.cols[k], top = (val(k) - c._min) * ROW, from = c.scrollTop;
 cancelAnimationFrame(c._raf || 0); c._target = top;
 if (!smooth || RM() || Math.abs(top - from) < 1) { c.classList.remove('u11glide'); c.scrollTop = top; c._target = null; aria(k); return; }
 /* programmatic glide with a soft spring-like ease; snap is paused so it can't fight the animation */
 var t0 = performance.now(), dur = Math.min(520, 220 + Math.sqrt(Math.abs(top - from)) * 9);
 c.classList.add('u11glide');
 (function step(t){
  var x = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - x, 3) * Math.cos(x * 1.6);
  c.scrollTop = from + (top - from) * Math.min(1.02, e);
  if (x < 1 && c._target === top) c._raf = requestAnimationFrame(step);
  else if (c._target === top) { c.scrollTop = top; c._target = null; c.classList.remove('u11glide'); }
 })(t0);
 aria(k);
}
function aria(k){ var c = cur.cols[k]; c.setAttribute('aria-valuemin', c._min); c.setAttribute('aria-valuemax', c._max); c.setAttribute('aria-valuenow', val(k)); c.setAttribute('aria-valuetext', text(k, val(k))); }
/* keep the composed date valid: clamp day to the month length (leap years included) and never past today */
function clamp(){
 var t = today(), s = cur.sel, ch = {}, d0 = s.d;
 if (s.y === t.y && s.m > t.m) { s.m = t.m; ch.month = 1; }
 var max = daysIn(s.y, s.m);
 if (s.d > max) s.d = max;
 if (s.y === t.y && s.m === t.m && s.d > t.d) s.d = t.d;
 if (cur.cols.day._max !== max) { fill('day'); ch.day = 1; }
 if (s.d !== d0) ch.day = 1;
 Object.keys(ch).forEach(function(k){ jump(k, true); paint(k); });
}
function paint(k){
 var c = cur && cur.cols[k]; if (!c) return;
 var mid = c.scrollTop / ROW;
 c.querySelectorAll('.u11item').forEach(function(it, i){
  var dist = i - mid, a = Math.max(-1, Math.min(1, dist / 3));
  var face = it.firstChild; if (face) face.style.transform = RM() ? '' : 'rotateX(' + (-a * 62).toFixed(1) + 'deg) translateZ(0)';
  it.style.opacity = String(Math.max(.18, 1 - Math.abs(dist) * .28).toFixed(2));
  it.classList.toggle('on', Math.round(mid) === i);
 });
}
function wire(k){
 var c = cur.cols[k], raf = 0, settle = 0;
 c.addEventListener('scroll', function(){
  if (!raf) raf = requestAnimationFrame(function(){ raf = 0; paint(k); });
  clearTimeout(settle); settle = setTimeout(function again(){
   if (!cur) return;
   if (c._target != null) { settle = setTimeout(again, 90); return; }
   pick(k, Math.round(c.scrollTop / ROW) + c._min, false);
  }, 110);
 }, { passive: true });
 /* a finger or wheel takes over from any programmatic glide */
 ['touchstart', 'wheel', 'pointerdown'].forEach(function(t){ c.addEventListener(t, function(){ if (c._target != null) { cancelAnimationFrame(c._raf || 0); c._target = null; c.classList.remove('u11glide'); } }, { passive: true }); });
 c.addEventListener('click', function(e){ var it = e.target.closest('.u11item'); if (it) pick(k, Number(it.dataset.v), true); });
 c.addEventListener('keydown', function(e){
  var step = { ArrowUp: -1, ArrowDown: 1, PageUp: -5, PageDown: 5 }[e.key], n = null;
  if (step) n = val(k) + step; else if (e.key === 'Home') n = c._min; else if (e.key === 'End') n = c._max;
  if (n === null) { if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { var ks = ['month', 'day', 'year'], i = ks.indexOf(k) + (e.key === 'ArrowLeft' ? -1 : 1); if (ks[i]) { e.preventDefault(); cur.cols[ks[i]].focus(); } } return; }
  e.preventDefault(); pick(k, Math.max(c._min, Math.min(c._max, n)), true);
 });
}
function pick(k, n, scroll){
 if (!cur) return; var c = cur.cols[k];
 n = Math.max(c._min, Math.min(c._max, n));
 var was = val(k); setVal(k, n);
 if (scroll || Math.abs(c.scrollTop - (n - c._min) * ROW) > 1) jump(k, true);
 aria(k); clamp();
 if (n !== was && navigator.vibrate && !RM()) { try { navigator.vibrate(4); } catch (e) {} }
 readout();
}
function value(){ var s = cur.sel; return s.y + '-' + pad(s.m) + '-' + pad(s.d); }
function readout(){ if (!cur) return; var v = value(), a = ageOf(v); cur.root.querySelector('.u11date').textContent = labelOf(v); cur.root.querySelector('.u11age').textContent = a === null ? '' : 'Age ' + a; }
function done(){
 if (!cur) return; var c = cur;
 /* settle any wheel that is still gliding */
 ['month', 'day', 'year'].forEach(function(k){ var col = c.cols[k]; var n = Math.round(col.scrollTop / ROW) + col._min; if (n !== val(k)) { setVal(k, Math.max(col._min, Math.min(col._max, n))); } });
 clamp();
 var v = value(), ok = ageOf(v) !== null && v >= '1900-01-01';
 c.input.value = ok ? v : '';
 /* same refresh the game's own bindIdentity130 performs */
 var label = document.getElementById(c.prefix + 'birthdaylabel166'), age = document.getElementById(c.prefix + 'age'), n = ageOf(c.input.value);
 if (label) label.textContent = labelOf(c.input.value) || 'Set birthday';
 if (!c.input.value && label) { try { label.textContent = birthdayLabel166(''); } catch (e) { label.textContent = 'Set birthday'; } }
 if (age) age.textContent = n === null || !c.input.value ? 'Tap birthday to choose your date' : 'Age ' + n + ' · updates automatically';
 try { c.input.dispatchEvent(new Event('input', { bubbles: true })); c.input.dispatchEvent(new Event('change', { bubbles: true })); } catch (e) {}
 close();
}
function close(instant){
 if (!cur) { var stale = document.getElementById('u11picker'); if (stale) stale.remove(); return; }
 var c = cur; cur = null;
 var r = c.root; if (instant || RM()) r.remove(); else { r.classList.remove('u11on'); r.classList.add('u11off'); setTimeout(function(){ r.remove(); }, 320); }
 if (c.opener && !instant) { try { c.opener.focus({ preventScroll: true }); } catch (e) {} }
}

document.addEventListener('click', function(e){
 if (window.SCENE_UIUX11_OFF) return;
 var b = e.target && e.target.closest && e.target.closest('[data-birthday-open166]'); if (!b) return;
 var prefix = b.getAttribute('data-birthday-open166');
 if (!document.getElementById(prefix + 'birthday')) return; /* unknown markup: let the game handle it */
 e.preventDefault(); e.stopImmediatePropagation();
 try { open(prefix, b); } catch (err) { console.warn('uiux11 picker failed, using the game picker', err); close(true); window.SCENE_UIUX11_OFF = true; b.click(); window.SCENE_UIUX11_OFF = false; }
}, true);

window.SCENE_UIUX11 = { version: 1, open: open, close: function(){ close(); }, get value(){ return cur ? value() : null; } };
})();
