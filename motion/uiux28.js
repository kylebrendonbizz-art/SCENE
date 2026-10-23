/* uiux28 · celeb tap -> 4-choice run-in, real city on the run-in header, city vibe backgrounds (presentation only; no money/save writes)
   1 ROOT CAUSE (Kim "doesn't open"): uiux25 asks SCENE_CITYSTATE.presence() with NO city; citymaps247's presence(name) returns null
     without one, so no celeb (Kim included) was ever drawn on an LA pin, and the avatars that were drawn (Around LA strip) opened a
     profile, not a run-in. Fix: no-arg presence() calls default to the map's city (Los Angeles); every celeb avatar on the map
     (pin sheet, pin avatars, Around LA strip; NYC is owned by uiux27-2's runIn from ea3d319) now opens the run-in for THAT celeb:
       a. city + district are citymaps247's own (la/nyc, its spots) -> SCENE_CITYMAPS.setSpot(spot): Logic's real visit/bump/choice card,
          so the chips resolve in Logic. If Logic doesn't raise a card for that celeb (not in town, already met, caps),
       b. fallback: SCENE_UIUX25.encounter({celebId, spot, city}) -> uiux25 card + uiux27 four chips (events still fire; no dialogue invented).
   2 Run-in header reads the encounter payload city (la/nyc/'New York'/...), e.g. "SOHO · NEW YORK · RUN-IN".
   3 Vibes: map + run-in card get data-u28-vibe = la (parties) | nyc (night) | cpt (beach) | ldn (fog) | par (dusk). Picker gains
     Cape Town / London / Paris with lean pins named from the game's own CITY_MOMENTS48 venues (no presence data there yet).
   bump4choice250 (Logic hotfix): LA pin body with a Logic celeb there also raises the run-in (as NYC since ea3d319); avatar -> celeb id
     follows uiux25's draw order; Logic is asked for the tapped celeb (shared district); LA hot pins sit above neighbours so
     the avatar is hit (Silver Lake's box covered Hollywood's Kim). No profile path remains for an in-city celeb.
   Kill switch: window.SCENE_UIUX28_OFF = true. */
(function(){
 if (window.SCENE_UIUX28 || window.SCENE_UIUX28_OFF === true) return;
 var H = document.documentElement, stats = { taps: 0, logic: 0, ui: 0, headers: 0, vibes: 0 };
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'motion/uiux28.css?v=uiux28-2'; document.head.appendChild(l);
 H.classList.add('u28');
 var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
 var CITY = { la: 'Los Angeles', nyc: 'New York', cpt: 'Cape Town', ldn: 'London', par: 'Paris' };
 function key(c){ c = String(c || ''); for (var k in CITY) if (k === c || CITY[k] === c) return k; return /new ?york|nyc/i.test(c) ? 'nyc' : ''; }
 /* venues verbatim from CITY_MOMENTS48 (living-world-v48); x/y on the 390x430 stage */
 var EXTRA = {
  cpt: [['City Bowl', 'City Bowl rooftop', 190, 150], ['Long Street', 'Long Street venue', 236, 196], ['Woodstock', 'Woodstock studio', 300, 170], ['V&A Waterfront', 'V&A Waterfront launch', 250, 104], ['Sea Point', 'Sea Point shoot', 110, 150], ['Camps Bay', 'Camps Bay gathering', 92, 262]],
  ldn: [['Camden', 'Camden venue', 196, 92], ['Notting Hill', 'Notting Hill shoot', 74, 168], ['Soho', 'Soho room', 168, 196], ['West End', 'West End office', 132, 232], ['Shoreditch', 'Shoreditch studio', 290, 162], ['East London', 'East London launch', 330, 236]],
  par: [['Pigalle', 'Pigalle room', 206, 96], ['Canal Saint-Martin', 'Canal Saint-Martin shoot', 286, 140], ['Le Marais', 'Le Marais studio', 250, 222], ['Bastille', 'Bastille venue', 308, 266], ['Saint-Germain', 'Saint-Germain dinner', 140, 262]]
 };
 /* ---- 1a · presence() without a city = the map's city ---- */
 (function wrapP(n){ var C = window.SCENE_CITYSTATE; if (!C || typeof C.presence !== 'function') { if (n < 60) setTimeout(function(){ wrapP(n + 1); }, 250); return; }
  if (C.presence.__u28) return; var f = C.presence; C.presence = function(name){ return f.call(this, name || (window.SCENE_UIUX28_OFF ? name : 'Los Angeles')); }; C.presence.__u28 = 1; })(0);
 /* ---- 1b · avatar tap -> run-in ---- */
 function mapCity(root){ var c = root && (root.getAttribute('data-u28-vibe') || root.getAttribute('data-u27-city')); return key(c) || 'la'; }
 function logicSpots(c){ try { var cf = window.SCENE_CITYMAPS && SCENE_CITYMAPS.config(); return ((cf && cf.cities && cf.cities[c] && cf.cities[c].spots) || []).map(function(s){ return s.id; }); } catch (e) { return []; } }
 function here(c, spot){ try { return (SCENE_CITYSTATE.presence(CITY[c]) || {})[spot] || []; } catch (e) { return []; } }
 function runIn(id, spot, c){
  stats.taps++; try { window.SCENE_UIUX25 && SCENE_UIUX25.close(); } catch (e) {}
  var lc = ''; try { lc = SCENE_CITYMAPS.city(); } catch (e) {}
  /* bump4choice250: walk only for a celeb Logic actually has there, and ask Logic for THAT celeb (shared districts) */
  if (spot && lc === c && logicSpots(c).indexOf(spot) >= 0 && here(c, spot).indexOf(id) >= 0) { try { SCENE_CITYMAPS.setSpot(spot, id); } catch (e) {} }
  setTimeout(function(){
   var card = null; try { card = SCENE_CITYMAPS.state().card; } catch (e) {}
   var el = document.querySelector('.u25enc');
   if (card && card.id === id && card.stage === 'choose' && el) { stats.logic++; return; }
   stats.ui++; try { SCENE_UIUX25.encounter({ celebId: id, spot: spot || 'around', city: c, source: 'uiux28' }); } catch (e) {}
  }, 350);
 }
 function pinRunIn(c, spot){
  try { var lc = SCENE_CITYMAPS.city(); if (lc !== c) return; var ids = here(c, spot); SCENE_CITYMAPS.setSpot(spot, ids[0]); stats.pins = (stats.pins || 0) + 1;
   var card = SCENE_CITYMAPS.state().card;
   if (card && card.stage === 'choose' && card.city === c && card.spot === spot && !document.querySelector('.u25enc')) { stats.logic++; SCENE_UIUX25.encounter({ celebId: card.id, spot: spot, city: c, seed: 0, source: 'uiux28' }); }
  } catch (e) {}
 }
 document.addEventListener('click', function(e){
  if (window.SCENE_UIUX28_OFF) return; var root = e.target.closest && e.target.closest('.u25map'); if (!root || mapCity(root) === 'nyc') return; /* NYC taps: uiux27-2 runIn (Tester fix ea3d319) owns them */
  var w = e.target.closest('.u25who'), av = !w && e.target.closest('.u25pin .avatar, .u27pin .avatar'), id = '', spot = '';
  if (w) { id = w.getAttribute('data-id'); var sel = root.querySelector('.u25pin.sel'); spot = sel ? (sel.getAttribute('data-d') || sel.getAttribute('data-u27n') || '') : ''; if (w.closest('.u25around')) spot = ''; }
  else if (av) { var pin = av.closest('.u25pin'); spot = pin.getAttribute('data-d') || pin.getAttribute('data-u27n') || ''; if (spot === 'around') spot = '';
   /* bump4choice250: avatars are drawn in SCENE_UIUX25.today() order (story celebs first, then Logic presence) -> read the id from that order */
   var list = []; try { list = (((SCENE_UIUX25.today() || {}).at || {})[spot] || []).map(function(x){ return x && x.a && x.a.id; }); } catch (x) {}
   if (!list.length) list = here(mapCity(root), spot);
   var i = [].indexOf.call(pin.querySelectorAll('.avatar'), av); id = list[i] || list[0] || ''; }
  else { /* bump4choice250: LA pin BODY with a Logic celeb there -> uiux25 opens its sheet as before, then the run-in raises over the map */
   var pb = e.target.closest('.u25pin[data-d]'), ps = pb && pb.getAttribute('data-d'), c0 = mapCity(root);
   if (ps && ps !== 'around' && c0 === 'la' && logicSpots(c0).indexOf(ps) >= 0 && here(c0, ps).length) setTimeout(function(){ pinRunIn(c0, ps); }, 0);
   return; }
  if (!id) return; e.preventDefault(); e.stopImmediatePropagation(); runIn(id, spot, mapCity(root));
 }, true);
 /* ---- 2 · header city from payload ---- */
 function header(o){
  o = o || {}; var el = document.querySelector('.u25enc'); if (!el) return; var c = key(o.city) || 'la', sm = el.querySelector('small'); el.setAttribute('data-u28-vibe', c);
  var dn = ''; try { var D = (SCENE_UIUX25.districts || []).concat((window.SCENE_UIUX27 && SCENE_UIUX27.nyc) || []); D.forEach(function(d){ if (d.id === o.spot) dn = d.name; }); } catch (e) {}
  try { (SCENE_CITYMAPS.config().cities[c] || { spots: [] }).spots.forEach(function(s){ if (s.id === o.spot) dn = s.label; }); } catch (e) {}
  if (sm) { sm.textContent = (dn ? dn.toUpperCase() + ' \u00b7 ' : '') + CITY[c].toUpperCase() + ' \u00b7 RUN-IN'; stats.headers++; }
 }
 addEventListener('scene:encounter', function(e){ if (!window.SCENE_UIUX28_OFF) header(e.detail); });
 (function wrap(n){ var U = window.SCENE_UIUX25; if (!U || !U.encounter) { if (n < 40) setTimeout(function(){ wrap(n + 1); }, 250); return; }
  var f = U.encounter; U.encounter = function(o){ var r = f.apply(this, arguments); if (r && !window.SCENE_UIUX28_OFF) header(o); return r; }; })(0);
 /* ---- 3 · vibes + extra cities ---- */
 function vibe(root, c){ root.setAttribute('data-u28-vibe', c); stats.vibes++; }
 function extraStage(root, c){
  var st = root.querySelector('.u28stage[data-c="' + c + '"]'); if (st) return st;
  st = document.createElement('div'); st.className = 'u25stage u28stage'; st.setAttribute('data-c', c);
  st.innerHTML = '<div class="u28bg" aria-hidden="true"><i></i><i></i><i></i></div>' + EXTRA[c].map(function(p, i){ return '<button type="button" class="u25pin u28pin" data-u28p="' + i + '" style="left:' + (p[2] / 390 * 100).toFixed(2) + '%;top:' + (p[3] / 430 * 100).toFixed(2) + '%" aria-label="' + esc(p[0]) + '"><i class="u25dot"></i><b>' + esc(p[0]) + '</b></button>'; }).join('');
  var last = root.querySelectorAll('.u25stage'); last[last.length - 1].after(st); return st;
 }
 function show(root, c){
  var s = root.querySelector('.u25sheet'); if (s) { s.hidden = true; s.classList.remove('on'); }
  [].forEach.call(root.querySelectorAll('.u28stage'), function(x){ x.hidden = x.getAttribute('data-c') !== c; });
  if (EXTRA[c]) { extraStage(root, c).hidden = false; [].forEach.call(root.querySelectorAll('.u25stage:not(.u28stage), .u25around'), function(x){ x.hidden = true; });
   var h = root.querySelector('.u25head h2'); if (h) h.textContent = CITY[c]; root.setAttribute('aria-label', CITY[c] + ' map'); root.classList.remove('u27nyc'); }
  [].forEach.call(root.querySelectorAll('.u27pick button'), function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-c') === c ? 'true' : 'false'); });
  vibe(root, c);
 }
 function decorate(root){
  if (root.__u28) return; var pk = root.querySelector('.u27pick'); if (!pk) return; root.__u28 = 1;
  pk.insertAdjacentHTML('beforeend', '<button type="button" data-c="ldn">LDN</button><button type="button" data-c="par">PAR</button><button type="button" data-c="cpt">CPT</button>');
  pk.addEventListener('click', function(e){ var b = e.target.closest('button'); if (!b) return; var c = b.getAttribute('data-c');
   if (EXTRA[c]) { e.stopImmediatePropagation(); e.stopPropagation(); show(root, c); return; }
   [].forEach.call(root.querySelectorAll('.u28stage'), function(x){ x.hidden = true; }); setTimeout(function(){ vibe(root, c); }, 0); }, true);
  root.addEventListener('click', function(e){ var p = e.target.closest('[data-u28p]'); if (!p) return; e.stopImmediatePropagation();
   var c = root.getAttribute('data-u28-vibe'), v = EXTRA[c] && EXTRA[c][+p.getAttribute('data-u28p')], s = root.querySelector('.u25sheet'); if (!v || !s) return;
   [].forEach.call(root.querySelectorAll('.u25pin.sel'), function(x){ x.classList.remove('sel'); }); p.classList.add('sel');
   s.innerHTML = '<small>' + esc(v[0].toUpperCase()) + ' \u00b7 ' + esc(CITY[c].toUpperCase()) + '</small><b>' + esc(v[1]) + '</b><p>No one\u2019s posted from here today.</p>'; s.hidden = false; requestAnimationFrame(function(){ s.classList.add('on'); }); }, true);
  var pc = ''; try { pc = key(state.player.city); } catch (e) {}
  if (EXTRA[pc]) show(root, pc); else vibe(root, root.getAttribute('data-u27-city') === 'nyc' ? 'nyc' : 'la');
 }
 new MutationObserver(function(){ var r = document.querySelector('.u25map'); if (r && !r.__u28) setTimeout(function(){ decorate(r); }, 0); }).observe(document.body, { childList: true });
 window.SCENE_UIUX28 = { stats: stats, cities: CITY, show: function(c){ var r = document.querySelector('.u25map'); if (!r) return; if (EXTRA[c]) show(r, c); else { var b = r.querySelector('.u27pick [data-c="' + c + '"]'); if (b) b.click(); } } };
})();
