/* uiux15: calmer "phone blowing up" / going-viral notification rows.
   Presentation only. motion.js notifStack() (also behind scene-notifq-v228's row cap) still decides WHAT rows exist;
   this layer hides its fast-stepping .mo-notifs box the moment it appears and mirrors the same rows into a glass stack
   that brings them in ~1.3 s apart with a gentle spring slide, keeps each one readable, and can be dismissed with a tap
   or a swipe up. The source box stays in the DOM (hidden) until motion removes it, so every "is a notif stack open?"
   check elsewhere keeps working. Kill switch: window.SCENE_UIUX15_OFF=true. Loads motion/uiux15.css itself. */
(function(){
'use strict';
if (window.SCENE_UIUX15_OFF) return;
document.documentElement.classList.add('u15');
var RM = function(){ return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
(function css(){ if (document.getElementById('uiux15-css')) return; var l = document.createElement('link'); l.rel = 'stylesheet'; l.id = 'uiux15-css'; l.href = './motion/uiux15.css?v=uiux15-1'; (document.head || document.documentElement).appendChild(l); })();
var GAP_MS = 1300, READ_MS = 2600, MAX_ROWS = 3;
var stats = { stacks: 0, rows: 0, dismissed: 0 }, cur = null;

function build(src){
 var lock = src.classList.contains('mo-lock'), el = document.createElement('div');
 el.className = 'u15stack' + (lock ? ' u15lock' : '') + (RM() ? ' u15rm' : ''); el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite');
 var clock = src.querySelector('.mo-lockclock');
 el.innerHTML = (lock ? '<div class="u15scrim" aria-hidden="true"></div><div class="u15clock">' + (clock ? clock.innerHTML : '') + '</div>' : '') + '<div class="u15rows"></div><small class="u15hint">Tap to dismiss</small>';
 document.body.appendChild(el);
 requestAnimationFrame(function(){ el.classList.add('u15on'); });
 var c = { src: src, el: el, rows: el.querySelector('.u15rows'), queue: [], seen: new WeakSet(), next: 0, timer: 0, end: 0, srcGone: false };
 el.addEventListener('click', function(){ stats.dismissed++; close(c, true); });
 var y0 = null; el.addEventListener('touchstart', function(e){ y0 = e.touches[0].clientY; }, { passive: true });
 el.addEventListener('touchmove', function(e){ if (y0 != null && y0 - e.touches[0].clientY > 40) { y0 = null; stats.dismissed++; close(c, true); } }, { passive: true });
 stats.stacks++; return c;
}
function collect(c){
 c.src.querySelectorAll('.mo-notif').forEach(function(n){ if (c.seen.has(n)) return; c.seen.add(n); c.queue.push(n.innerHTML); });
 pump(c);
}
function pump(c){
 if (cur !== c || c.timer) return;
 if (!c.queue.length) { if (c.srcGone) schedEnd(c); return; }
 var wait = Math.max(0, c.next - Date.now());
 c.timer = setTimeout(function(){ c.timer = 0; if (cur !== c) return; var h = c.queue.shift();
  var row = document.createElement('div'); row.className = 'u15row'; row.innerHTML = h; c.rows.insertBefore(row, c.rows.firstChild); stats.rows++;
  var all = c.rows.querySelectorAll('.u15row'); all.forEach(function(r, i){ r.style.setProperty('--i', i); if (i >= MAX_ROWS) { r.classList.add('u15out'); setTimeout(function(){ r.remove(); }, 500); } });
  requestAnimationFrame(function(){ row.classList.add('u15in'); });
  try { if (navigator.vibrate && !RM()) navigator.vibrate(12); } catch (e) {}
  c.next = Date.now() + (RM() ? 600 : GAP_MS); c.end = Date.now() + READ_MS;
  pump(c); schedEnd(c);
 }, wait);
}
function schedEnd(c){
 clearTimeout(c.endT);
 if (!c.srcGone || c.queue.length || c.timer) return;
 c.endT = setTimeout(function(){ close(c, false); }, Math.max(400, c.end - Date.now()));
}
function close(c, user){
 if (cur !== c) return; cur = null; clearTimeout(c.timer); clearTimeout(c.endT);
 c.el.classList.remove('u15on'); c.el.classList.add('u15off'); setTimeout(function(){ c.el.remove(); }, RM() ? 0 : 450);
 if (user && c.src.isConnected) c.src.remove();
}
new MutationObserver(function(ms){
 if (window.SCENE_UIUX15_OFF) return;
 for (var i = 0; i < ms.length; i++) {
  var m = ms[i];
  for (var k = 0; k < m.addedNodes.length; k++) { var n = m.addedNodes[k]; if (n.nodeType !== 1) continue;
   if (n.classList.contains('mo-notifs') && m.target === document.body) { n.classList.add('u15src'); n.setAttribute('aria-hidden', 'true'); if (cur) close(cur, false); cur = build(n); collect(cur); }
   else if (n.classList.contains('mo-notif') && cur && n.parentElement === cur.src) collect(cur); }
  for (var r = 0; r < m.removedNodes.length; r++) if (cur && m.removedNodes[r] === cur.src) { cur.srcGone = true; schedEnd(cur); }
 }
}).observe(document.body || document.documentElement, { childList: true, subtree: true });
window.SCENE_UIUX15 = { version: 1, stats: function(){ return JSON.parse(JSON.stringify(stats)); }, get open(){ return !!cur; } };
})();
