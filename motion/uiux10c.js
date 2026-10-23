/* uiux10c · Career page tidy-up on top of uiux10 + uiux16 glass:
   - the "More" list (Skills & level / Travel / Resources) is hidden: the Career · Travel · Resources · Skills tabs already cover it
   - "skill points ready" moves to a small badge on the Skills tab
   - the story "See it all / Show less" link sits in its own section header (it was floating alone under the timeline); it only
     exists when there are more than 4 story items, so an empty section never shows it
   - consistency pass (uiux10c.css): same glass cards, radii, gold/pink accents and headings across all four tabs
   Presentation only; reads state.player.skillPoints. Loads motion/uiux10c.css itself; rules scoped under html.u10c.
   Kill switch: window.SCENE_UIUX10C_OFF = true. */
(function(){
'use strict';
if (window.SCENE_UIUX10C_OFF === true || window.SCENE_UIUX10C) return;
var stats = { badge: 0, link: 0 };
window.SCENE_UIUX10C = { version: 1, stats: stats };
document.documentElement.classList.add('u10c');
var l = document.createElement('link'); l.id = 'uiux10c-css'; l.rel = 'stylesheet'; l.href = './motion/uiux10c.css?v=uiux10c-1'; (document.head || document.documentElement).appendChild(l);
function sp(){ try { var s = Function('return typeof state!=="undefined"?state:null')(); return Math.max(0, Number(s && s.player && s.player.skillPoints) || 0); } catch (e) { return 0; } }
function fix(){
 if (window.SCENE_UIUX10C_OFF === true) return;
 var root = document.getElementById('uiux10'); if (!root) return;
 var tab = root.querySelector('.u10-seg [data-u10-seg="skills"]');
 if (tab) {
  var n = sp(), b = tab.querySelector('.u10c-badge');
  if (n > 0) { var t = String(n > 99 ? '99+' : n);
   if (!b) { b = document.createElement('b'); b.className = 'u10c-badge'; tab.appendChild(b); stats.badge++; }
   if (b.textContent !== t) b.textContent = t;
   var al = 'Skills, ' + n + ' skill point' + (n === 1 ? '' : 's') + ' ready'; if (tab.getAttribute('aria-label') !== al) tab.setAttribute('aria-label', al);
  } else if (b) { b.remove(); tab.removeAttribute('aria-label'); }
 }
 var link = root.querySelector('[data-sec="story"] > [data-u10-tl]'), head = root.querySelector('[data-sec="story"] > .u10-sechead');
 if (link && head) { link.classList.add('u10c-headlink'); head.appendChild(link); stats.link++; }
}
var raf = 0;
function sched(){ if (raf) return; raf = requestAnimationFrame(function(){ raf = 0; try { fix(); } catch (e) { console.warn('uiux10c', e); } }); }
function boot(){ var app = document.getElementById('app') || document.body; new MutationObserver(sched).observe(app, { childList: true, subtree: true }); setInterval(sched, 2000); sched(); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
