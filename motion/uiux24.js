/* uiux24 · UI polish on the v38 stack (presentation only; never touches money/economy/saves):
   1 milestone card: the one generic engine body line is shown in Scene voice (exact-match swap; titles untouched)
   2 leftover reward/stat pills (story outcome, first-DM card, day recap, career tier chip, "Reward ·" lines) get the
     uiux23 glass + gold-pink look; "+N thing" pills get uiux23's matching icon
   3 @reply comments in the comment sheet read as a thread (indent + connector + gold parent handle chip)
   4 after a trip lands (motion3 'scenefx:travel-done', after uiux14's flight), a glass city card from the game's own
     data: CITY48 country/tag + the travel mode from state.travelHistory[0]
   5 DM mood line under the celeb name, only where the game already has mood data (eventchain231's Kylie status row)
   Kill switch: window.SCENE_UIUX24_OFF = true. Loads motion/uiux24.css itself. */
(function(){
 if (window.SCENE_UIUX24 || window.SCENE_UIUX24_OFF === true) return;
 var H = document.documentElement, stats = { body: 0, pills: 0, replies: 0, city: 0, mood: 0 };
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'motion/uiux24.css?v=uiux24-1'; document.head.appendChild(l);
 H.classList.add('u24');
 var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };

 /* 1 · generic engine body -> Scene voice (exact match only, so Writer/Logic copy changes win automatically) */
 var BODY = { 'The game world has registered the shift. New conversations, opportunities and reactions can build from this.': 'The timeline noticed. Watch who reaches out next.' };
 function copy(root){ var p = root.querySelector('.scene-celebrate157 > p'); if (p && BODY[p.textContent.trim()]) { p.textContent = BODY[p.textContent.trim()]; stats.body++; } }

 /* 2 · leftover pills */
 var PILLS = '.rewardburst span,.scene-rewards148 span,.mo-rw-chips span';
 function kindOf(t){ t = t.toLowerCase(); return /xp/.test(t) ? 'xp' : /follower/.test(t) ? 'fol' : /skill/.test(t) ? 'skill' : /fame/.test(t) ? 'star' : /reputation|\brep\b/.test(t) ? 'rep' : /diamond|gem/.test(t) ? 'gem' : /energy/.test(t) ? 'bolt' : ''; }
 function pill(s){
  if (s.__u24) return; s.__u24 = 1; s.classList.add('u24pill'); stats.pills++;
  var t = s.textContent.trim(), k = kindOf(t);
  if (k && H.classList.contains('u23') && /^[+\u2212-]?[\d.,]+/.test(t) && !s.querySelector('.u23i')) { var i = document.createElement('i'); i.className = 'u23i k-' + k; i.setAttribute('aria-hidden', 'true'); s.prepend(i); }
 }

 /* 3 · @reply threads (comment sheet). Only classes + a span around the existing leading @handle; no new text */
 function thread(w){
  if (w.__u24) return; w.__u24 = 1; var p = w.querySelector(':scope > .commentrow p'); if (!p) return;
  var m = /^(@[\w.]+)/.exec(p.textContent.trim()); if (!m || w.classList.contains('nested')) return;
  var tn = p.firstChild; if (!tn || tn.nodeType !== 3) return; var raw = tn.nodeValue, at = raw.indexOf(m[1]); if (at < 0 || raw.slice(0, at).trim()) return;
  var s = document.createElement('span'); s.className = 'u24at'; s.textContent = m[1];
  tn.nodeValue = raw.slice(at + m[1].length); p.insertBefore(s, tn); w.classList.add('u24reply'); stats.replies++;
 }

 /* 5 · mood line from eventchain231's own status row (prefix + mood are Writer keys) */
 function mood(){
  var M = document.getElementById('modal'), st = M && M.querySelector('.ec231dmstatus'), nm = M && M.querySelector('.chatidentity strong'), id = nm && nm.parentElement;
  var old = M && M.querySelector('.u24mood');
  if (!st || !id) { if (old) old.remove(); return; }
  var t = (st.textContent.split(' \u00b7 ')[0] || '').trim(); if (!t) return;
  if (!old) { old = document.createElement('small'); old.className = 'u24mood'; id.appendChild(old); stats.mood++; }
  if (old.textContent !== t) old.textContent = t;
 }

 function sweep(){
  q = 0;
  var o = document.getElementById('scene-overlay157'); if (o) copy(o);
  [].forEach.call(document.querySelectorAll(PILLS), pill);
  [].forEach.call(document.querySelectorAll('.commentwrap'), thread);
  mood();
 }
 var q = 0;
 new MutationObserver(function(recs){
  /* comment rows are handled synchronously (before paint) so the sheet never reflows after it is shown */
  for (var i = 0; i < recs.length; i++) { var a = recs[i].addedNodes; for (var j = 0; j < a.length; j++) { var n = a[j]; if (n.nodeType !== 1) continue;
   if (n.classList.contains('commentwrap')) thread(n); else if (n.querySelectorAll) [].forEach.call(n.querySelectorAll('.commentwrap'), thread);
   if (n.id === 'scene-overlay157') copy(n); } }
  if (!q) q = requestAnimationFrame(sweep);
 }).observe(document.body, { childList: true, subtree: true, characterData: true });

 /* 4 · city card after landing */
 var cityEl = null;
 function cityCard(to){
  var S = window.state || {}, h = (S.travelHistory || [])[0] || {}, c = to || (S.player && S.player.city); if (!c) return;
  var info = {}; try { info = (typeof CITY48 !== 'undefined' && CITY48[c]) || {}; } catch (e) {}
  var mode = h.city === c && h.mode ? String(h.mode) : '', day = Number(S.sceneDay) || 0;
  if (cityEl) cityEl.remove();
  var el = cityEl = document.createElement('div'); el.className = 'u24city'; el.setAttribute('role', 'status');
  el.innerHTML = '<small>LANDED' + (mode ? ' \u00b7 ' + esc(mode.toUpperCase()) : '') + (day ? ' \u00b7 DAY ' + day : '') + '</small>' +
   '<b>You\u2019re in ' + esc(c) + '</b>' + (info.country || info.tag ? '<span>' + esc([info.country, info.tag].filter(Boolean).join(' \u00b7 ')) + '</span>' : '');
  document.body.appendChild(el); stats.city++;
  requestAnimationFrame(function(){ el.classList.add('on'); });
  var close = function(){ el.classList.remove('on'); setTimeout(function(){ el.remove(); if (cityEl === el) cityEl = null; }, 400); };
  el.addEventListener('click', close); setTimeout(close, 4600);
 }
 addEventListener('scenefx:travel-done', function(e){ setTimeout(function(){ cityCard(e.detail && e.detail.to); }, 250); });

 setTimeout(sweep, 600);
 window.SCENE_UIUX24 = { stats: stats, cityCard: cityCard, sweep: sweep };
})();
