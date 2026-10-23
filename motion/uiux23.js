/* uiux23 · (1) the scene-director157 milestone / level card (#scene-overlay157, e.g. "Make the timeline ask who you are")
   re-skinned in the dark-glass gold-pink look, reward chips become HUD-style glass pills with matching icons;
   (2) energy / diamonds / fame HUD icons drawn from one shared stroke icon set (CSS) so they are uniform.
   Presentation only: same trigger, same text, same chips, same button and its own onclick (we only add classes and
   prepend icons). When uiux12 takes over a level-up (.u12src, hidden) we leave it alone.
   Kill switch: window.SCENE_UIUX23_OFF = true. Loads motion/uiux23.css itself. */
(function(){
 if (window.SCENE_UIUX23 || window.SCENE_UIUX23_OFF === true) return;
 var H = document.documentElement, stats = { cards: 0, pills: 0 };
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'motion/uiux23.css?v=uiux23-1'; document.head.appendChild(l);
 H.classList.add('u23');
 function icon(k){ var i = document.createElement('i'); i.className = 'u23i k-' + k; i.setAttribute('aria-hidden', 'true'); return i; }
 function kindOf(t){ t = t.toLowerCase(); return /xp/.test(t) ? 'xp' : /follower/.test(t) ? 'fol' : /skill/.test(t) ? 'skill' : /fame/.test(t) ? 'star' : /reputation|rep\b/.test(t) ? 'rep' : /diamond|gem/.test(t) ? 'gem' : /energy/.test(t) ? 'bolt' : 'star'; }
 function skin(root){
  if (root.classList.contains('u23card')) return;
  var c = root.querySelector('.scene-celebrate157'); if (!c) return;
  root.classList.add('u23card'); stats.cards++;
  var level = /level/i.test((c.querySelector('small') || {}).textContent || ''); root.setAttribute('data-u23kind', level ? 'level' : 'milestone');
  var b = c.querySelector('.scene-bursticon157'); if (b) b.appendChild(icon(level ? 'xp' : 'star'));
  [].forEach.call(c.querySelectorAll('.scene-chiprow157 span'), function(s, i){
   var t = s.textContent, m = /^([+\u2212-]?[\d.,]+[KkMm]?)\s*(.*)$/.exec(t.trim());
   s.textContent = ''; s.appendChild(icon(kindOf(t)));
   if (m) { var n = document.createElement('b'); n.textContent = m[1]; s.appendChild(n); s.appendChild(document.createTextNode(' ' + m[2])); } else s.appendChild(document.createTextNode(t));
   s.style.setProperty('--d', (220 + i * 90) + 'ms'); stats.pills++;
  });
 }
 new MutationObserver(function(recs){
  for (var i = 0; i < recs.length; i++) { var a = recs[i].addedNodes; for (var j = 0; j < a.length; j++) if (a[j].id === 'scene-overlay157') skin(a[j]); }
 }).observe(document.body, { childList: true });
 var ex = document.getElementById('scene-overlay157'); if (ex) skin(ex);
 window.SCENE_UIUX23 = { stats: stats };
})();
