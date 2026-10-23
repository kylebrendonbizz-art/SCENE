/* uiux31 · map rebuild to Kyle's mockup (presentation only; no state/money/save writes)
   1 Photo cities: each map stage (LA / NYC / Cape Town / London / Paris) gets a real photo backdrop (free Unsplash photos, shipped
     locally in motion/uiux31/: LA palms+skyline sunset, Eiffel at dusk, Table Mountain at sunset, Manhattan night, Westminster dusk).
     The flat SVG / uiux30 shape layers are hidden under it; uiux30's vibe colour still tints the panel edge.
   2 Torn-paper: the stage is a torn photo print (cream paper rim, ragged edges, tape); district pins become torn-paper tags with a
     coloured dot; the venue sheet is a torn note card. Script city title + crown + one-line city mood, neon pill city picker.
   3 MAP tab: a big gold MAP tab docked on the bottom nav's top edge (the nav's own 4 tabs + uiux21 badge lift untouched); tap = map.
   4 Instant run-in: ANY celeb tap on the map (pin avatar, venue sheet row, Around strip, NYC rows too) closes the map and shows the
     run-in card with Say hi / Invite her / Start drama / Walk on at once: Logic's own card when citymaps247 raises one for that
     celeb synchronously, otherwise uiux25's card + uiux27 chips immediately (no 350 ms wait, no "fly first" note, never a profile).
   bump4choice250 (Logic hotfix): setSpot(spot, tappedId) only when Logic has her there; LA face -> id by uiux25 draw order.
   Kill switch: window.SCENE_UIUX31_OFF = true. */
(function(){
 if (window.SCENE_UIUX31 || window.SCENE_UIUX31_OFF === true) return;
 var H = document.documentElement, stats = { decorated: 0, runIns: 0, logic: 0, ui: 0, tab: 0 };
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'motion/uiux31.css?v=uiux31-1'; document.head.appendChild(l);
 H.classList.add('u31');
 var off = function(){ return window.SCENE_UIUX31_OFF === true; };
 var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
 var CITY = { la: 'Los Angeles', nyc: 'New York', cpt: 'Cape Town', ldn: 'London', par: 'Paris' };
 var MOOD = { la: 'Sunset parties', nyc: 'Night lights', cpt: 'Beach & mountain', ldn: 'Old money', par: 'Fashion at dusk' };
 function cityOf(st){ if (st.classList.contains('u27stage-nyc')) return 'nyc'; if (st.classList.contains('u28stage')) return st.getAttribute('data-c'); return 'la'; }
 function key(c){ c = String(c || ''); for (var k in CITY) if (k === c || CITY[k] === c) return k; return /new ?york|nyc/i.test(c) ? 'nyc' : ''; }
 function mapCity(root){ return key(root.getAttribute('data-u28-vibe') || root.getAttribute('data-u27-city')) || 'la'; }
 /* ragged torn-paper edges, generated once (deterministic) and exposed as CSS vars */
 (function torn(){
  var s = 7; function r(){ s = (s * 9301 + 49297) % 233280; return s / 233280; }
  function edge(amp){ var p = [], i, n = 26;
   for (i = 0; i <= n; i++) p.push((i / n * 100).toFixed(1) + '% ' + (r() * amp).toFixed(2) + '%');
   for (i = 0; i <= 14; i++) p.push((100 - r() * amp * .5).toFixed(2) + '% ' + (i / 14 * 100).toFixed(1) + '%');
   for (i = n; i >= 0; i--) p.push((i / n * 100).toFixed(1) + '% ' + (100 - r() * amp).toFixed(2) + '%');
   for (i = 14; i >= 0; i--) p.push((r() * amp * .5).toFixed(2) + '% ' + (i / 14 * 100).toFixed(1) + '%');
   return 'polygon(' + p.join(',') + ')'; }
  H.style.setProperty('--u31-torn', edge(2.2)); H.style.setProperty('--u31-torn2', edge(1.6)); H.style.setProperty('--u31-tag', edge(9));
 })();
 /* ---- 1 + 2 · photo stage, torn paper, script title ---- */
 var VERB = { sayhi: 'Say hi', invite: 'Invite her', drama: 'Start drama', walk: 'Walk on' };
 function verbs(){ [].forEach.call(document.querySelectorAll('.u25enc .u27c:not([data-writer])'), function(b){ var v = VERB[b.getAttribute('data-act')]; if (v && b.textContent !== v) b.textContent = v; }); }
 function sweep(){
  if (off()) return; verbs(); var r = document.querySelector('.u25map'); if (!r) return;
  if (!r.classList.contains('u31m')) { r.classList.add('u31m'); stats.decorated++; }
  [].forEach.call(r.querySelectorAll('.u25stage'), function(st){
   if (st.querySelector(':scope > .u31photo')) return; var c = cityOf(st); if (!CITY[c]) return;
   var ph = document.createElement('div'); ph.className = 'u31photo'; ph.setAttribute('data-c', c); ph.setAttribute('aria-hidden', 'true');
   ph.innerHTML = '<i class="u31img"></i><i class="u31shade"></i><div class="u31title"><span class="u31crown">\u265b</span><b>' + esc(CITY[c]) + '</b><em>' + esc(MOOD[c]) + '</em></div><i class="u31tape"></i><i class="u31tape u31tape2"></i>';
   st.insertBefore(ph, st.firstChild); st.classList.add('u31stage');
  });
  var c = mapCity(r); r.setAttribute('data-u31-city', c);
 }
 var q = 0; new MutationObserver(function(){ if (!q) q = requestAnimationFrame(function(){ q = 0; sweep(); tabSync(); }); }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['data-u28-vibe', 'data-u27-city', 'hidden'] });
 /* ---- 3 · MAP tab docked on the nav ---- */
 var GLOBE = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.8 3.8 5.8 3.8 9s-1.2 6.2-3.8 9c-2.6-2.8-3.8-5.8-3.8-9S9.4 5.8 12 3z"/></svg>';
 var tab = null;
 function tabSync(){
  if (off()) { if (tab) tab.hidden = true; return; }
  var n = document.querySelector('.nav'), ok = !!(window.SCENE_UIUX25 && n);
  if (ok) { var r = n.getBoundingClientRect(); ok = r.height > 20 && r.top < innerHeight && getComputedStyle(n).visibility !== 'hidden' && getComputedStyle(n).display !== 'none'; }
  if (document.querySelector('.u25map')) ok = false; /* the map has its own close; nav taps close it too */
  var ae = document.activeElement; if (ae && /^(INPUT|TEXTAREA)$/.test(ae.tagName)) ok = false;
  if (!tab) { tab = document.createElement('button'); tab.type = 'button'; tab.className = 'u31tab'; tab.setAttribute('aria-label', 'Map'); tab.innerHTML = '<span class="u31globe">' + GLOBE + '</span><b>MAP</b>';
   tab.onclick = function(e){ e.stopPropagation(); stats.tab++; var U = window.SCENE_UIUX25; if (!U) return; document.querySelector('.u25map') ? U.close() : U.open(); setTimeout(tabSync, 30); };
   document.body.appendChild(tab); }
  tab.hidden = !ok; if (!ok) return;
  tab.style.bottom = Math.round(innerHeight - n.getBoundingClientRect().top + 4) + 'px';
  tab.setAttribute('aria-pressed', document.querySelector('.u25map') ? 'true' : 'false');
 }
 setInterval(tabSync, 700); addEventListener('resize', tabSync); document.addEventListener('focusin', tabSync); document.addEventListener('focusout', function(){ setTimeout(tabSync, 50); }); setTimeout(tabSync, 500);
 /* ---- 4 · instant run-in (window capture: runs before uiux25/27/28's own handlers) ---- */
 function logicSpots(c){ try { var cf = SCENE_CITYMAPS.config(); return ((cf && cf.cities && cf.cities[c] && cf.cities[c].spots) || []).map(function(s){ return s.id; }); } catch (e) { return []; } }
 function here(c, spot){ try { return (SCENE_CITYSTATE.presence(CITY[c]) || {})[spot] || []; } catch (e) { return []; } }
 function runIn(id, spot, c){
  stats.runIns++; try { SCENE_UIUX25.close(); } catch (e) {}
  var lc = ''; try { lc = SCENE_CITYMAPS.city(); } catch (e) {}
  /* bump4choice250: walk only for a celeb Logic has there, and ask Logic for THAT celeb (shared district -> her card, not the other one's) */
  if (spot && lc === c && logicSpots(c).indexOf(spot) >= 0 && here(c, spot).indexOf(id) >= 0) { try { SCENE_CITYMAPS.setSpot(spot, id); } catch (e) {} }
  var card = null; try { card = SCENE_CITYMAPS.state().card; } catch (e) {}
  if (card && card.id === id && card.stage === 'choose' && document.querySelector('.u25enc .u27chips')) { stats.logic++; return; }
  stats.ui++; try { SCENE_UIUX25.encounter({ celebId: id, spot: spot || 'around', city: c, source: 'uiux31' }); } catch (e) {}
 }
 addEventListener('click', function(e){
  if (off()) return; var root = e.target.closest && e.target.closest('.u25map'); if (!root) return;
  var c = mapCity(root), w = e.target.closest('.u25who'), av = !w && e.target.closest('.u25pin .avatar, .u25pin .u25av'), id = '', spot = '';
  if (w) { id = w.getAttribute('data-id'); if (!w.closest('.u25around')) { var sel = root.querySelector('.u25stage:not([hidden]) .u25pin.sel') || root.querySelector('.u25pin.sel'); spot = sel ? (sel.getAttribute('data-u27n') || sel.getAttribute('data-d') || '') : ''; } }
  else if (av) { var pin = av.closest('.u25pin'); spot = pin.getAttribute('data-u27n') || pin.getAttribute('data-d') || ''; if (spot === 'around') spot = '';
   var list = []; try { list = (SCENE_CITYSTATE.presence(CITY[c]) || {})[spot] || []; } catch (x) {}
   /* bump4choice250: LA pins draw SCENE_UIUX25.today() order (story celebs first, then Logic presence) -> map the tapped face by that order */
   if (c === 'la' && pin.getAttribute('data-d')) try { var dl = (((SCENE_UIUX25.today() || {}).at || {})[spot] || []).map(function(x){ return x && x.a && x.a.id; }); if (dl.length) list = dl; } catch (x) {}
   var i = [].indexOf.call(pin.querySelectorAll('.avatar, .u25av'), av); id = list[i] || list[0] || '';
   if (!id && pin.getAttribute('data-d') === 'around') { var t = root.querySelectorAll('.u25around .u25who')[i]; id = t ? t.getAttribute('data-id') : ''; } }
  if (!id) return; e.preventDefault(); e.stopImmediatePropagation(); runIn(id, spot, c);
 }, true);
 window.SCENE_UIUX31 = { stats: stats, sweep: sweep, tabSync: tabSync, runIn: runIn };
})();
