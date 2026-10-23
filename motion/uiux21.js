/* uiux21 · keep the DM composer clear of AppDeploy's floating host badge (bottom-right, injected by v2.appdeploy.ai/shared/js/overlay.js
   as <appdeploy-overlay-…> in the top layer, closed shadow root). The badge is NOT ours and is never hidden; we only measure it and give
   the chat composer bottom clearance while it is on screen (html.u21badge + --u21-clear). No badge (local / dismissed) -> no change.
   Kill switch: window.SCENE_UIUX21_OFF = true. */
(function(){
 if (window.SCENE_UIUX21) return;
 var h = document.documentElement, last = '';
 function host(){ var c = h.children; for (var i = 0; i < c.length; i++) if (/^APPDEPLOY-OVERLAY/i.test(c[i].tagName)) return c[i]; return null; }
 function measure(){
  var o = host(); if (!o || window.SCENE_UIUX21_OFF === true) return 0;
  var W = innerWidth, H = innerHeight, top = -1;
  for (var x = W - 24; x > W - 140 && top < 0; x -= 28) for (var y = H - 4; y > H - 160; y -= 3) { if (document.elementFromPoint(x, y) === o) top = y; else if (top >= 0) break; }
  if (top < 0) return 0;
  for (var y2 = top; y2 > H - 200; y2 -= 2) { var hit = false; for (var x2 = W - 24; x2 > W - 140; x2 -= 14) if (document.elementFromPoint(x2, y2) === o) { hit = true; break; } if (!hit) break; top = y2; }
  return Math.ceil(H - top + 6);
 }
 function tick(){
  var c = 0; try { c = measure(); } catch (e) {}
  var k = c ? 'on' + c : ''; if (k === last) return; last = k;
  if (c) { h.classList.add('u21badge'); h.style.setProperty('--u21-clear', c + 'px'); } else { h.classList.remove('u21badge'); h.style.removeProperty('--u21-clear'); }
 }
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = './motion/uiux21.css?v=uiux21-1'; l.id = 'uiux21-css'; document.head.appendChild(l);
 setInterval(tick, 1200); addEventListener('resize', function(){ last = 'x'; tick(); }); setTimeout(tick, 400);
 window.SCENE_UIUX21 = { tick: tick, measure: measure };
})();
