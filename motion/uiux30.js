/* uiux30 · stronger city vibes on the living-city map (presentation only; no state/money/save writes)
   Adds ONE decorative layer .u30fx[data-c] into each map stage (above the map art, below the pins; pointer-events:none):
     la  = parties: sweeping searchlights, falling confetti, neon horizon, palms
     nyc = night: stars, moon + halo, lit-window skyline with a spire (uiux27 geometry untouched, only darker/brighter around it)
     cpt = beach: Table Mountain + Lion's Head, sun rays, surf foam, umbrella, palms
     ldn = old money: racing green + gold pinstripe, classical facade with pediment, clock tower, gilt Thames, fog
     par = fashion: champagne dusk, gold-lit Eiffel, bokeh, runway lights
   Also (uiux29b): the Career Your Move hero gets its gold ring (uiux10c's #uiux10 rule out-specified uiux29's).
   Kill switch: window.SCENE_UIUX30_OFF = true. */
(function(){
 if (window.SCENE_UIUX30 || window.SCENE_UIUX30_OFF === true) return;
 var H = document.documentElement, stats = { fx: 0 };
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'motion/uiux30.css?v=uiux30-1'; document.head.appendChild(l);
 H.classList.add('u30');
 var N = { la: 14, nyc: 8, cpt: 8, ldn: 8, par: 10 };
 function cityOf(st){ if (st.classList.contains('u27stage-nyc')) return 'nyc'; if (st.classList.contains('u28stage')) return st.getAttribute('data-c'); return 'la'; }
 function sweep(){
  if (window.SCENE_UIUX30_OFF) return; var r = document.querySelector('.u25map'); if (!r) return;
  [].forEach.call(r.querySelectorAll('.u25stage'), function(st){
   if (st.querySelector(':scope > .u30fx')) return; var c = cityOf(st); if (!N[c]) return;
   var fx = document.createElement('div'); fx.className = 'u30fx'; fx.setAttribute('data-c', c); fx.setAttribute('aria-hidden', 'true');
   fx.innerHTML = new Array(N[c] + 1).join('<i></i>');
   var pin = st.querySelector(':scope > .u25pin, :scope > .u25cluster'); if (pin) st.insertBefore(fx, pin); else st.appendChild(fx); stats.fx++;
  });
 }
 var q = 0; new MutationObserver(function(){ if (!q) q = requestAnimationFrame(function(){ q = 0; sweep(); }); }).observe(document.body, { childList: true, subtree: true });
 window.SCENE_UIUX30 = { stats: stats, sweep: sweep };
})();
