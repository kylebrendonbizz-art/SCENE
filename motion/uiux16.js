/* uiux16: "Apple glass glamour" skin — CSS-first. This script only (1) sets html.u16 so every rule in uiux16.css is
   scoped and switchable, (2) loads uiux16.css, and (3) adds one fixed, compositor-only living background layer.
   It never touches game state, layout logic or event handlers.
   Loaded as a plain (non-deferred) script in <head> so the class is on <html> before the first paint.
   Kill switch: window.SCENE_UIUX16_OFF=true (set before this script runs) — nothing is added, the old look stays. */
(function(){
'use strict';
if (window.SCENE_UIUX16_OFF) return;
var html = document.documentElement; html.classList.add('u16');
if (!document.getElementById('uiux16-css')) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.id = 'uiux16-css'; l.href = './motion/uiux16.css?v=uiux16-1'; (document.head || html).appendChild(l); }
function bg(){ if (document.getElementById('u16bg') || !document.body) return; var d = document.createElement('div'); d.id = 'u16bg'; d.setAttribute('aria-hidden', 'true'); d.innerHTML = '<i></i><i></i><i></i>'; document.body.insertBefore(d, document.body.firstChild); }
if (document.body) bg(); else document.addEventListener('DOMContentLoaded', bg);
/* pause the background drift while the tab is hidden (zero cost in background tabs) */
document.addEventListener('visibilitychange', function(){ html.classList.toggle('u16-hidden', document.hidden); });
window.SCENE_UIUX16 = { version: 1 };
})();
