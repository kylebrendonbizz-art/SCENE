/* uiux12: level-up moment (full-screen glass: glow burst, old → new level count-up, "what's new" from the game's own chips).
   Presentation only. The game (scene-director-v157 checkLevel157/showPending157) still decides the level-up, grants the
   skill points and writes the save; it then opens #scene-overlay157 ("LEVEL UP"). This layer hides that overlay the
   moment it is inserted (before it paints), reads its real data (level, chips like "+1 skill point", "+1 celebrity slot",
   "1/15 XP"), waits for the reward banner / SCENE_POPQ to finish, shows the new moment, and on close presses the old
   overlay's own button so the game's flow is unchanged. Never grants or changes anything.
   Only one moment at a time: a second level-up while one is waiting/open retargets it to the final level.
   Loads motion/uiux12.css itself. Kill switch: window.SCENE_UIUX12_OFF=true restores the original overlay. */
(function(){
'use strict';
if (window.SCENE_UIUX12_OFF) return;
var html = document.documentElement; html.classList.add('u12');
var RM = function(){ return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
(function css(){ if (document.getElementById('uiux12-css')) return; var l = document.createElement('link'); l.rel = 'stylesheet'; l.id = 'uiux12-css'; l.href = './motion/uiux12.css?v=uiux12-1'; (document.head || document.documentElement).appendChild(l); })();
var AUTO_MS = 4000, MAX_WAIT_MS = 6000;
var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
var S = function(){ try { return state; } catch (e) { return window.state; } };
var stats = { intercepted: 0, shown: 0, merged: 0, viaQueue: 0 };
var job = null, lastShown = 0; /* {src, from, to, chips, body, shownAt, el} */

function isLevelOverlay(n){ return n && n.id === 'scene-overlay157' && /level\s*up/i.test((n.querySelector('small') || {}).textContent || ''); }
function read(n){
 var h = n.querySelector('h2'), to = Number(((h && h.textContent) || '').replace(/[^\d]/g, '')) || null;
 var chips = Array.prototype.map.call(n.querySelectorAll('.scene-chiprow157 span'), function(s){ return s.textContent.trim(); }).filter(Boolean);
 var pts = 0; chips.forEach(function(c){ var m = /^\+(\d+)\s+skill\s+point/i.exec(c); if (m) pts = Number(m[1]); });
 var body = (n.querySelector('p') || {}).textContent || '';
 return { to: to, from: to && pts ? to - pts : (to ? to - 1 : null), chips: chips, body: body.trim() };
}
function intercept(n){
 if (window.SCENE_UIUX12_OFF || n.classList.contains('u12src')) return;
 var d = read(n); if (!d.to) return; /* unknown markup: leave the original alone */
 n.classList.add('u12src'); n.setAttribute('aria-hidden', 'true'); stats.intercepted++;
 if (!job && d.to <= lastShown) { stats.alreadyShown = (stats.alreadyShown || 0) + 1; setTimeout(function(){ if (n.isConnected) pressOld(n); }, 0); return; } /* this level was already celebrated by a retargeted moment */
 if (job) { /* already queued/open: show the final level only */
  stats.merged++;
  var old = job.src; job.src = n; job.to = Math.max(job.to, d.to); job.chips = d.chips; job.body = d.body;
  if (old && old !== n && old.isConnected) pressOld(old);
  if (job.el) update(true); return;
 }
 job = { src: n, from: d.from, to: d.to, chips: d.chips, body: d.body, t0: Date.now() };
 if (!viaNotifQ()) waitTurn();
}
/* Preferred sequencing: Gameplay Logic's notification queue (scene-notifq-v228) when present — it runs our item only
   once the OUTCOME banner / current toast has finished. Falls back to our own wait loop when the queue is missing,
   switched off, or declines the item (burst cap / dedupe). A safety timer guarantees the moment still appears. */
function viaNotifQ(){
 var NQ = window.SCENE_NOTIFY_QUEUE; if (!NQ || typeof NQ.push !== 'function' || window.SCENE_NOTIFQ_OFF === true) return false;
 var j = job, ok = false;
 try { ok = NQ.push({ kind: 'levelup', text: 'Level ' + j.to, key: 'uiux12-level-' + j.to + '-' + j.t0, run: function(){ if (job === j && !j.el) { j.viaQ = 'ran'; waitTurn(); } } }); } catch (e) { ok = false; }
 if (!ok) return false;
 j.viaQ = 'queued'; stats.viaQueue = (stats.viaQueue || 0) + 1;
 setTimeout(function(){ if (job === j && !j.el && j.viaQ === 'queued') { j.viaQ = 'timeout'; waitTurn(); } }, MAX_WAIT_MS);
 return true;
}
function busy(){
 var b = document.getElementById('mo-banner'); if (b && b.style.opacity === '1') return true;
 var l = document.getElementById('mo-layer'); if (l && l.childElementCount) return true;
 try { if (window.SCENE_POPQ && typeof SCENE_POPQ.size === 'function' && SCENE_POPQ.size() > 0) return true; } catch (e) {}
 if (job && job.src && job.src.classList.contains('uiux2-held')) return true;
 var m = document.getElementById('modal'); if (m && m.firstElementChild) return true;
 return false;
}
function waitTurn(){
 if (!job) return;
 if (!job.src.isConnected) { job = null; return; } /* the game (or uiux2's merge cap) removed it */
 if (busy() && Date.now() - job.t0 < MAX_WAIT_MS) { setTimeout(waitTurn, 180); return; }
 setTimeout(show, 260); /* breathing room after the banner leaves */
}
function lines(){
 var out = [];
 job.chips.forEach(function(c){
  var m;
  if ((m = /^\+(\d+)\s+skill\s+points?/i.exec(c))) out.push({ i: '✦', t: c.replace(/^\+/, '+'), s: 'Spend it on the star you want to be' });
  else if ((m = /^\+(\d+)\s+celebrity\s+slots?/i.exec(c))) out.push({ i: '★', t: c, s: 'Room for one more famous face in your circle' });
  else if ((m = /^(\d+)\/(\d+)\s*XP$/i.exec(c))) out.push({ i: '◎', t: c + ' to Level ' + (job.to + 1), s: '', bar: Math.max(0, Math.min(1, Number(m[1]) / Number(m[2]))) });
  else out.push({ i: '•', t: c, s: '' });
 });
 try { var sp = Number(S().player.skillPoints) || 0; var gained = job.to - (job.from || job.to); if (sp > gained) out.push({ i: '◆', t: sp + ' skill points ready to spend in total', s: '' }); } catch (e) {}
 return out;
}
function show(){
 if (!job || job.el) return;
 if (!job.src.isConnected) { job = null; return; }
 stats.shown++;
 var rm = RM(), el = document.createElement('div');
 el.className = 'u12moment' + (rm ? ' u12rm' : ''); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Level up');
 el.innerHTML = '<div class="u12glass"></div><div class="u12glow" aria-hidden="true"><i></i><i></i><i></i></div><canvas class="u12fx" aria-hidden="true"></canvas>' +
  '<div class="u12card">' +
   '<small class="u12eyebrow">LEVEL UP</small>' +
   '<div class="u12num" aria-live="polite"><span class="u12from" aria-hidden="true"></span><b class="u12to"></b></div>' +
   '<p class="u12sub"></p>' +
   '<ul class="u12new" aria-label="What\u2019s new"></ul>' +
   '<button type="button" class="u12btn">Continue</button>' +
   '<small class="u12tap" aria-hidden="true">Tap anywhere to continue</small>' +
   '<i class="u12timer" aria-hidden="true"></i>' +
  '</div>';
 document.body.appendChild(el); job.el = el;
 update(false);
 el.addEventListener('click', function(e){ e.stopPropagation(); close(); });
 el.addEventListener('keydown', function(e){ if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); } });
 requestAnimationFrame(function(){ el.classList.add('u12on'); try { el.querySelector('.u12btn').focus({ preventScroll: true }); } catch (e) {} });
 if (!rm) confetti(el.querySelector('.u12fx'));
 try { if (navigator.vibrate && !rm) navigator.vibrate([12, 40, 18]); } catch (e) {}
 job.auto = setTimeout(close, AUTO_MS);
 var j = job; (function watch(){ if (job !== j || !j.el) return; var L = liveLevel(); if (L > j.to) { j.to = L; stats.merged++; update(true); } setTimeout(watch, 300); })();
}
/* the same numbers checkLevel157 puts in its chips, recomputed from the game's own level/slot functions so a
   retargeted (multi-level) moment stays accurate */
function gameChips(){
 try { var D = window.SCENE_DIRECTOR157; if (!D || typeof D.level !== 'function' || typeof D.slots !== 'function' || !job.from) return null;
  var li = D.level(), pts = job.to - job.from, ns = D.slots(job.to) - D.slots(job.from), out = ['+' + pts + ' skill ' + (pts === 1 ? 'point' : 'points')];
  if (li.level === job.to) out.push(li.into + '/' + li.need + ' XP');
  if (ns > 0) out.push('+' + ns + ' celebrity slot' + (ns === 1 ? '' : 's'));
  return out; } catch (e) { return null; }
}
function liveLevel(){ try { return window.SCENE_DIRECTOR157.level().level; } catch (e) { return 0; } }
function update(retarget){
 var el = job.el; if (!el) return;
 var gc = gameChips(); if (gc) job.chips = gc;
 var list = lines();
 el.querySelector('.u12sub').textContent = 'Level ' + job.to;
 el.querySelector('.u12new').innerHTML = list.map(function(x, i){ return '<li style="--d:' + (i * 90 + 520) + 'ms"><b aria-hidden="true">' + esc(x.i) + '</b><span><strong>' + esc(x.t) + '</strong>' + (x.s ? '<em>' + esc(x.s) + '</em>' : '') + (x.bar != null ? '<i class="u12bar"><i style="--p:' + x.bar.toFixed(3) + '"></i></i>' : '') + '</span></li>'; }).join('');
 count(el, job.from, job.to, retarget);
 if (retarget && job.auto) { clearTimeout(job.auto); job.auto = setTimeout(close, AUTO_MS); }
}
function count(el, from, to, again){
 var num = el.querySelector('.u12to'), fr = el.querySelector('.u12from');
 num.setAttribute('aria-label', 'Level ' + to);
 if (RM() || !from || from >= to) { num.textContent = String(to); fr.textContent = ''; return; }
 fr.textContent = String(from);
 var start = performance.now() + (again ? 0 : 260), dur = Math.min(1100, 420 + (to - from) * 160);
 num.textContent = String(from);
 (function step(t){
  if (!el.isConnected) return;
  var k = Math.max(0, Math.min(1, (t - start) / dur)), e = 1 - Math.pow(1 - k, 3), v = Math.round(from + (to - from) * e);
  if (num.textContent !== String(v)) { num.textContent = String(v); num.classList.remove('u12tick'); void num.offsetWidth; num.classList.add('u12tick'); }
  if (k < 1) requestAnimationFrame(step); else el.classList.add('u12landed');
 })(performance.now());
}
function confetti(cv){
 var W = cv.width = innerWidth * (devicePixelRatio || 1), H = cv.height = innerHeight * (devicePixelRatio || 1), g = cv.getContext('2d'); if (!g) return;
 var cols = ['#f3d39a', '#ffd7a8', '#ff9ec7', '#ffc2dc', '#ffffff', '#e8b4ff'], P = [], cx = W / 2, cy = H * .36, s = devicePixelRatio || 1;
 for (var i = 0; i < 90; i++) { var a = Math.random() * Math.PI * 2, v = (4 + Math.random() * 9) * s; P.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 4 * s, r: (2 + Math.random() * 4) * s, c: cols[i % cols.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .4, kind: i % 3, life: 1 }); }
 var t0 = performance.now();
 (function frame(t){
  if (!cv.isConnected) return; var el = (t - t0) / 1000; g.clearRect(0, 0, W, H);
  P.forEach(function(p){ p.vx *= .985; p.vy = p.vy * .985 + .22 * s; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life = Math.max(0, 1 - el / 2.6);
   g.save(); g.globalAlpha = p.life; g.translate(p.x, p.y); g.rotate(p.rot); g.fillStyle = p.c;
   if (p.kind === 0) g.fillRect(-p.r, -p.r / 2.5, p.r * 2, p.r / 1.25);
   else if (p.kind === 1) { g.beginPath(); g.arc(0, 0, p.r / 1.6, 0, 6.283); g.fill(); }
   else { g.beginPath(); for (var k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.moveTo(0, 0); g.quadraticCurveTo(p.r * .25, p.r * .25, 0, p.r * 1.4); } g.fill(); }
   g.restore(); });
  if (el < 2.7) requestAnimationFrame(frame); else g.clearRect(0, 0, W, H);
 })(t0);
}
function pressOld(n){ var b = n.querySelector('button'); if (b) b.click(); if (n.isConnected) n.remove(); }
function close(){
 if (!job || !job.el) return; var j = job; job = null; clearTimeout(j.auto); lastShown = Math.max(lastShown, j.to);
 var el = j.el; el.classList.remove('u12on'); el.classList.add('u12off');
 setTimeout(function(){ el.remove(); }, RM() ? 0 : 380);
 if (j.src && j.src.isConnected) pressOld(j.src); /* same as tapping the game's own "Continue" */
}
new MutationObserver(function(ms){
 if (window.SCENE_UIUX12_OFF) return;
 for (var i = 0; i < ms.length; i++) for (var k = 0; k < ms[i].addedNodes.length; k++) { var n = ms[i].addedNodes[k]; if (n.nodeType === 1 && isLevelOverlay(n)) intercept(n); }
}).observe(document.body || document.documentElement, { childList: true });
(function late(){ var n = document.getElementById('scene-overlay157'); if (n && isLevelOverlay(n)) intercept(n); })();
window.SCENE_UIUX12 = { version: 1, stats: function(){ return JSON.parse(JSON.stringify(stats)); }, get open(){ return !!(job && job.el); }, close: close };
})();
