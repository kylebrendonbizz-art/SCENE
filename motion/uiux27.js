/* uiux27 · city-specific maps + interactive run-in card (presentation only; no state/money/save writes)
   1 LA: every uiux25 district gets its own look (tint zone, landmark glyph, label style) via .u27-<id> on the pin.
   2 NYC: a second map (Hudson/East River, Manhattan grid, Brooklyn/Queens, skyline) with the six districts the game's own
     CITY_MOMENTS48['New York'] venues name (Lower East Side, Brooklyn, SoHo, Manhattan, Williamsburg, Chelsea). Header picker
     LA | NYC; opens on NYC when state.player.city === 'New York'. Who is where in NYC: Logic hook
     SCENE_CITYSTATE.presence('New York') -> { <nycId>: [celebId] } (drawn when present; nothing invented otherwise).
   3 Run-in card: four chips Say hi / Invite / Drama / Walk away. Labels use Writer's city.<city>.player.<sayHi|invite|drama|keepWalking>.chip
     when present, else the plain verb. Every tap fires window 'scene:encounter-chip' {action:'sayhi'|'invite'|'drama'|'walk',
     choice, celebId, spot}. Say hi swaps her bubble to Writer's talk.dm/approach.dm; Invite/Drama show no dialogue (Writer hasn't
     written any) and just mark the chip sent; Walk away closes. Supersedes uiux26's two chips while on.
   Kill switch: window.SCENE_UIUX27_OFF = true. */
(function(){
 if (window.SCENE_UIUX27 || window.SCENE_UIUX27_OFF === true) return;
 var H = document.documentElement, stats = { la: 0, nyc: 0, chips: 0, events: 0 };
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'motion/uiux27.css?v=uiux27-2'; document.head.appendChild(l);
 H.classList.add('u27');
 var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
 /* LA district identities: glyph = landmark silhouette shorthand, zone = tint radius */
 var LA = { hollywood: ['\u2605', 'nightlife'], beverlyHills: ['\u2766', 'wealth'], santaMonica: ['\u224b', 'beach'], malibu: ['\u25e0', 'coast'],
  calabasas: ['\u2302', 'gated'], burbank: ['\u25a3', 'studios'], weho: ['\u25c6', 'strip'], melrose: ['\u2726', 'style'], silverlake: ['\u25cc', 'indie'], culver: ['\u25b6', 'screen'] };
 var NYC = [
  { id: 'chelsea', name: 'Chelsea', re: /chelsea/i, x: 150, y: 196 },
  { id: 'midtown', name: 'Manhattan', re: /manhattan/i, x: 196, y: 138 },
  { id: 'soho', name: 'SoHo', re: /soho/i, x: 160, y: 262 },
  { id: 'les', name: 'Lower East Side', re: /lower east side/i, x: 214, y: 284 },
  { id: 'williamsburg', name: 'Williamsburg', re: /williamsburg/i, x: 300, y: 250 },
  { id: 'brooklyn', name: 'Brooklyn', re: /brooklyn/i, x: 262, y: 360 }
 ];
 var NG = { chelsea: ['\u25a6', 'gallery'], midtown: ['\u25b2', 'tower'], soho: ['\u25a4', 'cast-iron'], les: ['\u266a', 'late'], williamsburg: ['\u25d0', 'rooftop'], brooklyn: ['\u2312', 'bridge'] };
 function zone(id, g, x, y){ return '<i class="u27zone u27z-' + id + '" style="left:' + (x / 390 * 100).toFixed(2) + '%;top:' + (y / 430 * 100).toFixed(2) + '%" aria-hidden="true"></i>'; }
 function decorateLA(root){
  var st = root.querySelector('.u25stage'); if (!st || st.__u27) return; st.__u27 = 1;
  var D = (window.SCENE_UIUX25 && SCENE_UIUX25.districts) || [];
  st.insertAdjacentHTML('afterbegin', D.map(function(d){ return zone(d.id, LA[d.id], d.x, d.y); }).join(''));
  [].forEach.call(st.querySelectorAll('.u25pin[data-d]'), function(p){ var id = p.getAttribute('data-d'), g = LA[id]; if (!g) return;
   p.classList.add('u27pin', 'u27-' + id); p.setAttribute('data-u27-vibe', g[1]); var b = p.querySelector('b'); if (b && !b.querySelector('.u27g')) b.insertAdjacentHTML('afterbegin', '<span class="u27g" aria-hidden="true">' + g[0] + '</span>'); stats.la++; });
 }
 var NSVG = '<svg class="u25svg u27nsvg" viewBox="0 0 390 430" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
  '<defs><linearGradient id="u27riv" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#0b1a2a"/><stop offset="1" stop-color="#0e2236"/></linearGradient></defs>' +
  '<rect width="390" height="430" fill="url(#u27riv)"/>' +
  /* Manhattan island */ '<path d="M178 20 C198 40 222 80 236 130 C246 170 248 220 240 262 C234 296 222 318 200 330 C182 322 168 300 156 270 C140 230 128 180 132 130 C136 90 152 50 178 20Z" fill="#121a24" stroke="rgba(160,200,255,.35)" stroke-width="1.2"/>' +
  /* Brooklyn/Queens */ '<path d="M262 120 C300 110 350 120 390 112 L390 430 L200 430 C214 400 236 370 246 340 C258 300 262 260 258 220 C256 180 254 150 262 120Z" fill="#141a20" stroke="rgba(160,200,255,.22)" stroke-width="1"/>' +
  /* NJ edge */ '<path d="M0 0 L120 0 C110 80 104 170 110 260 C114 330 120 390 110 430 L0 430Z" fill="#10151b"/>' +
  /* grid */ '<g stroke="rgba(160,200,255,.07)" stroke-width="1">' + Array.apply(null, Array(14)).map(function(_, i){ var y = 60 + i * 18; return '<path d="M140 ' + y + ' L240 ' + (y - 26) + '"/>'; }).join('') + '<path d="M170 40 L206 320"/><path d="M196 34 L226 300"/></g>' +
  /* park */ '<path d="M186 70 L210 64 L220 118 L196 124Z" fill="rgba(90,170,120,.18)"/>' +
  /* bridges */ '<g stroke="rgba(243,211,154,.35)" stroke-width="1.6"><path d="M214 300 L262 312"/><path d="M226 268 L260 262"/></g>' +
  '<text x="123" y="250" class="u27riv" transform="rotate(-80 123 250)">HUDSON</text><text x="250" y="236" class="u27riv" transform="rotate(-84 250 236)">EAST RIVER</text><text x="198" y="96" class="u27park">PARK</text></svg>' +
  '<div class="u27sky" aria-hidden="true"></div>';
 function nycWho(){
  var out = {}; try { var pr = window.SCENE_CITYSTATE && typeof SCENE_CITYSTATE.presence === 'function' && SCENE_CITYSTATE.presence('New York');
   if (pr) Object.keys(pr).forEach(function(k){ out[k] = (pr[k] || []).map(function(id){ try { return typeof byId === 'function' ? byId(id) : null; } catch (e) { return null; } }).filter(Boolean); }); } catch (e) {}
  return out;
 }
 function face(a){ try { if (typeof av === 'function') return av(a, 'u25av'); } catch (e) {} return '<span class="avatar u25av u25ini">' + esc((a.name || '?').slice(0, 1)) + '</span>'; }
 function venue(d){ try { var m = (typeof CITY_MOMENTS48 !== 'undefined' && CITY_MOMENTS48['New York']) || []; for (var i = 0; i < m.length; i++) if (d.re.test(m[i])) return m[i]; } catch (e) {} return ''; }
 function nycStage(root){
  var w = nycWho(), st = document.createElement('div'); st.className = 'u25stage u27stage-nyc';
  st.innerHTML = NSVG + NYC.map(function(d){ var here = w[d.id] || [], g = NG[d.id];
   return zone(d.id, g, d.x, d.y) + '<button type="button" class="u25pin u27pin u27-' + d.id + (here.length ? ' hot' : '') + '" data-u27n="' + d.id + '" data-u27-vibe="' + g[1] + '" style="left:' + (d.x / 390 * 100).toFixed(2) + '%;top:' + (d.y / 430 * 100).toFixed(2) + '%" aria-label="' + esc(d.name) + '">' +
    '<i class="u25dot"></i><b><span class="u27g" aria-hidden="true">' + g[0] + '</span>' + esc(d.name) + '</b>' + (here.length ? '<span class="u25avs">' + here.slice(0, 3).map(face).join('') + '</span>' : '') + '</button>'; }).join('');
  stats.nyc++; return st;
 }
 function nycSheet(root, id){
  var d = NYC.filter(function(x){ return x.id === id; })[0], s = root.querySelector('.u25sheet'); if (!d || !s) return;
  [].forEach.call(root.querySelectorAll('.u25pin.sel'), function(x){ x.classList.remove('sel'); }); var p = root.querySelector('[data-u27n="' + id + '"]'); if (p) p.classList.add('sel');
  var here = nycWho()[id] || [], v = venue(d);
  s.innerHTML = '<small>' + esc(d.name.toUpperCase()) + '</small>' + (v ? '<b>' + esc(v) + '</b>' : '') + (here.length ? '<div class="u25list">' + here.map(function(a){ return '<button type="button" class="u25who" data-id="' + esc(a.id) + '">' + face(a) + '<span>' + esc(a.name) + '</span></button>'; }).join('') + '</div>' : '<p>No one\u2019s posted from here today.</p>');
  s.hidden = false; requestAnimationFrame(function(){ s.classList.add('on'); });
 }
 /* fix(citymaps) Tester: tapping a NYC district pin / a celeb avatar on it / her row in the sheet = walk there (citymaps247 enterSpot) -> bump ->
   run-in card with the 4 chips. Before this the NYC overlay map only opened a sheet (and the row opened her profile), so a tap never bumped. */
function runIn(root, spot, a){
 var CM = window.SCENE_CITYMAPS, s = root.querySelector('.u25sheet'), note = function(t){ if (s && t) s.insertAdjacentHTML('beforeend', '<p class="u27note">' + esc(t) + '</p>'); };
 try { if (!CM || !CM.owns || !CM.owns()) return false; var here = (CM.presence('New York') || {})[spot] || []; if (!here.length) return false;
  var id = a && here.indexOf(a.id) >= 0 ? a.id : here[0], nm = ((typeof byId === 'function' && byId(id)) || {}).name || '';
  if (CM.city() !== 'nyc') { note('Fly to New York to run into ' + nm.split(' ')[0] + '.'); return true; }
  CM.setSpot(spot, id); /* bump4choice250: tapped celeb first */ var m = CM.state(), c = m && m.card;
  if (c && c.stage === 'choose' && c.city === 'nyc' && c.spot === spot) {
   if (!document.querySelector('.u25enc') && window.SCENE_UIUX25 && SCENE_UIUX25.encounter) SCENE_UIUX25.encounter({ celebId: c.id, spot: spot, city: 'nyc', seed: 0 });
   return true; }
  var met = m && m.visit && m.visit.spot === spot && m.visit.runIn; note(met ? 'You already ran into ' + ((typeof byId === 'function' && byId(met)) || {}).name + ' here today.' : 'You\u2019re here. No run-in right now.'); return true;
 } catch (x) { return false; }
}
function setCity(root, c){
  var la = root.querySelector('.u25stage:not(.u27stage-nyc)'), ny = root.querySelector('.u27stage-nyc'), ar = root.querySelector('.u25around'), s = root.querySelector('.u25sheet');
  if (s) { s.hidden = true; s.classList.remove('on'); }
  if (c === 'nyc' && !ny) { ny = nycStage(root); (la || root.querySelector('.u25head')).after(ny); }
  if (la) la.hidden = c === 'nyc'; if (ny) ny.hidden = c !== 'nyc'; if (ar) ar.hidden = c === 'nyc';
  root.classList.toggle('u27nyc', c === 'nyc'); root.classList.toggle('u27la', c !== 'nyc'); root.setAttribute('data-u27-city', c);
  root.setAttribute('aria-label', c === 'nyc' ? 'New York map' : 'Los Angeles map');
  var h = root.querySelector('.u25head h2'); if (h) h.textContent = c === 'nyc' ? 'New York' : 'Los Angeles';
  [].forEach.call(root.querySelectorAll('.u27pick button'), function(b){ b.setAttribute('aria-pressed', b.getAttribute('data-c') === c ? 'true' : 'false'); });
 }
 function decorate(root){
  if (root.__u27) return; root.__u27 = 1; decorateLA(root);
  var tab = root.querySelector('.u25tab'), pk = document.createElement('div'); pk.className = 'u27pick'; pk.setAttribute('role', 'group'); pk.setAttribute('aria-label', 'City');
  pk.innerHTML = '<button type="button" data-c="la">LA</button><button type="button" data-c="nyc">NYC</button>';
  if (tab) tab.replaceWith(pk); else root.querySelector('.u25head').appendChild(pk);
  pk.addEventListener('click', function(e){ var b = e.target.closest('button'); if (b) { e.stopPropagation(); setCity(root, b.getAttribute('data-c')); } });
  root.addEventListener('click', function(e){ var p = e.target.closest('[data-u27n]'); if (p) { e.stopImmediatePropagation(); var n = p.getAttribute('data-u27n'), f = e.target.closest('.u25av'), fi = f ? [].indexOf.call(p.querySelectorAll('.u25av'), f) : -1; nycSheet(root, n); runIn(root, n, fi >= 0 ? (nycWho()[n] || [])[fi] : null); return; }
   var w = e.target.closest('.u25sheet .u25who'); var sp = root.querySelector('.u27stage-nyc .u25pin.sel'); if (w && sp && root.getAttribute('data-u27-city') === 'nyc' && runIn(root, sp.getAttribute('data-u27n'), { id: w.getAttribute('data-id') })) e.stopImmediatePropagation(); }, true);
  var c = ''; try { c = state.player.city; } catch (e) {}
  setCity(root, c === 'New York' ? 'nyc' : 'la');
 }
 /* ---- 3 · run-in chips ---- */
 function LL(){ var L = window.SCENE_LIVINGCITY_LINES; return L && typeof L === 'object' ? L : null; }
 function one(k, seed){ var L = LL(), v = L && L[k]; if (typeof v === 'string') v = [v]; if (!v || !v.length) return ''; v = v.filter(function(x){ return String(x).indexOf('{') < 0; }); return v.length ? String(v[(seed || 0) % v.length]) : ''; }
 var ACT = [['sayhi', 'sayHi', 'Say hi'], ['invite', 'invite', 'Invite'], ['drama', 'drama', 'Drama'], ['walk', 'keepWalking', 'Walk away']];
 function chips(o){
  o = o || {}; var el = document.querySelector('.u25enc'); if (!el || el.querySelector('.u27chips') || !o.celebId || !o.spot) return;
  var seed = o.seed || 0, city = o.city || 'la', row = document.createElement('div'); row.className = 'u27chips'; row.setAttribute('role', 'group'); row.setAttribute('aria-label', 'Your move');
  row.innerHTML = ACT.map(function(a){ var w = one('city.' + city + '.player.' + a[1] + '.chip', seed); return '<button type="button" class="u27c u27c-' + a[0] + '" data-act="' + a[0] + '"' + (w ? ' data-writer="1"' : '') + '>' + esc(w || a[2]) + '</button>'; }).join('');
  el.appendChild(row); stats.chips++;
  row.addEventListener('click', function(e){
   var b = e.target.closest('[data-act]'); if (!b || b.disabled) return; var act = b.getAttribute('data-act');
   stats.events++; try { dispatchEvent(new CustomEvent('scene:encounter-chip', { detail: { action: act, choice: act === 'sayhi' ? 'sayHi' : act === 'walk' ? 'keepWalking' : act, celebId: o.celebId, spot: o.spot, city: city } })); } catch (x) {}
   if (act === 'walk') { var x = el.querySelector('.u25encx'); if (x) x.click(); return; }
   if (act === 'sayhi') { var base = 'city.' + city + '.' + o.spot + '.' + o.celebId + '.', t = one(base + 'talk.dm', seed) || one(base + 'approach.dm', seed);
    if (t) { var bb = el.querySelector('.u25bubble'); if (!bb) { bb = document.createElement('p'); bb.className = 'u25bubble'; row.before(bb); } bb.textContent = t; } }
   b.disabled = true; b.classList.add('sent'); b.setAttribute('aria-pressed', 'true');
  });
 }
 addEventListener('scene:encounter', function(e){ if (!window.SCENE_UIUX27_OFF) chips(e.detail); });
 (function wrap(n){ var U = window.SCENE_UIUX25; if (!U || !U.encounter) { if (n < 40) setTimeout(function(){ wrap(n + 1); }, 250); return; }
  var f = U.encounter; U.encounter = function(o){ var r = f.apply(this, arguments); if (r && !window.SCENE_UIUX27_OFF) chips(o); return r; }; })(0);
 new MutationObserver(function(){ var r = document.querySelector('.u25map'); if (r && !r.__u27) decorate(r); }).observe(document.body, { childList: true });
 window.SCENE_UIUX27 = { stats: stats, nyc: NYC, setCity: function(c){ var r = document.querySelector('.u25map'); if (r) setCity(r, c); } };
})();
