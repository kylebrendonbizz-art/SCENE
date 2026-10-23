/* uiux10d · two old Career/nav fixes, presentation only (overrides in its own file; uiux2.js / uiux10.js untouched).
   1. Locked-tab hints ("unlocks after …") no longer float over the tab bar and content all the time: they become a tiny glass pill
      anchored above the locked tab icon, shown only on tap (2.6 s) and once for 3 s the first time each hint appears this session.
      Wording = Writer's: "Opens after you answer the comment call", "Opens after your first post." (generic "Opens after {x}").
   2. Bookings lock line "Not yet · unlocks after first booking": hidden whenever bookings are actually on the table; otherwise
      Writer's line "Land your first gig to open this up."
   Scoped under html.u10d. Kill switch: window.SCENE_UIUX10D_OFF = true. */
(function(){
'use strict';
if (window.SCENE_UIUX10D_OFF === true || window.SCENE_UIUX10D) return;
var COPY = window.SCENE_UIUX10D_COPY = Object.assign({
 'answer_ripple': 'Opens after you answer the comment call', 'first_post': 'Opens after your first post.',
 generic: 'Opens after {x}', day: 'Opens on Day {d}', bookingsLocked: 'Land your first gig to open this up.'
}, window.SCENE_UIUX10D_COPY || {});
var MAP = { 'unlocks after the comment call': COPY.answer_ripple, 'unlocks after first post': COPY.first_post };
var stats = { rewritten: 0, peeks: 0, lockHidden: 0, lockText: 0 };
window.SCENE_UIUX10D = { version: 1, stats: stats };
document.documentElement.classList.add('u10d');
var l = document.createElement('link'); l.id = 'uiux10d-css'; l.rel = 'stylesheet'; l.href = './motion/uiux10d.css?v=uiux10d-1'; (document.head || document.documentElement).appendChild(l);
function writer(h){ if (MAP[h]) return MAP[h]; var m = /^unlocks after (.+)$/.exec(h); if (m) return COPY.generic.replace('{x}', m[1]); m = /^unlocks on Day (\d+)$/.exec(h); if (m) return COPY.day.replace('{d}', m[1]); return h; }
var peeked = {};
function peek(b, ms){ b.classList.add('u10d-peek'); stats.peeks++; clearTimeout(b.__u10dT); b.__u10dT = setTimeout(function(){ b.classList.remove('u10d-peek'); }, ms); }
function fix(){
 if (window.SCENE_UIUX10D_OFF === true) return;
 var bs = document.querySelectorAll('.nav .navbtn[data-uiux2-dim]');
 for (var i = 0; i < bs.length; i++) { var b = bs[i], h = b.getAttribute('data-uiux2-hint') || '', w = writer(h);
  if (w !== h) { b.setAttribute('data-uiux2-hint', w); stats.rewritten++; } /* uiux2 compares data-uiux2-dim, so this sticks until its hint really changes */
  if (!peeked[w]) { peeked[w] = 1; peek(b, 3000); } }
 var lk = document.querySelector('#uiux10 [data-sec="bookings"] .u10-lock');
 if (lk) { var has = !!document.querySelector('#uiux10 [data-sec="bookings"] .u10-book');
  if (has) { if (!lk.classList.contains('u10d-hide')) { lk.classList.add('u10d-hide'); stats.lockHidden++; } }
  else { lk.classList.remove('u10d-hide'); if (lk.textContent !== COPY.bookingsLocked) { lk.textContent = COPY.bookingsLocked; stats.lockText++; } } }
}
document.addEventListener('pointerdown', function(e){ var b = e.target.closest && e.target.closest('.nav .navbtn[data-uiux2-dim]'); if (b && window.SCENE_UIUX10D_OFF !== true) peek(b, 2600); }, true);
var raf = 0;
function sched(){ if (raf) return; raf = requestAnimationFrame(function(){ raf = 0; try { fix(); } catch (e) { console.warn('uiux10d', e); } }); }
function boot(){ new MutationObserver(sched).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-uiux2-hint'] }); setInterval(sched, 2000); sched(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
