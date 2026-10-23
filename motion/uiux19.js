/* uiux19 · global density pass: smaller type scale, tighter cards / rows / header, capped serif display headlines.
   CSS-only (motion/uiux19.css, every rule scoped under html.u19); no logic, no copy. Plain <head> script so the class is set before first paint.
   Kill switch: window.SCENE_UIUX19_OFF = true (before load), or SCENE_UIUX19.off() at runtime. */
(function(){
 if (window.SCENE_UIUX19 || window.SCENE_UIUX19_OFF === true) return;
 var h = document.documentElement; h.classList.add('u19');
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = './motion/uiux19.css?v=uiux19-1'; l.id = 'uiux19-css'; document.head.appendChild(l);
 /* Feed tabs: the feed re-renders on tap, so the sliding indicator animates on the new element via a short-lived html[data-u19slide] flag */
 var slideT = 0;
 document.addEventListener('click', function(e){ var t = e.target && e.target.closest && e.target.closest('.feedtabs .feedtab'); if (!t || t.classList.contains('on') || !h.classList.contains('u19')) return;
  h.setAttribute('data-u19slide', t.getAttribute('data-filter') === 'following' ? 'r' : 'l'); clearTimeout(slideT); slideT = setTimeout(function(){ h.removeAttribute('data-u19slide'); }, 420); }, true);
 window.SCENE_UIUX19 = { off: function(){ h.classList.remove('u19'); }, on: function(){ h.classList.add('u19'); } };
})();
