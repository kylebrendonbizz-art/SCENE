/* uiux25 · Living city: LA map (presentation only; reads game data, never writes state/money/saves).
   Entry: a glass map button in the top bar (next to search) opens a full-screen LA map above the bottom nav
   (nav stays tappable; any nav tab closes the map). Districts = the game's own LA places (CITY_MOMENTS48['Los Angeles']
   venues + Malibu / Calabasas from SCENE_STORIES places). Celeb avatars = today's SCENE_STORIES entries whose place
   names an LA district; celebs whose story is in LA but at an unnamed spot ("studio", "glam room") are listed as
   "Around LA today". Nobody is placed without a story saying so. Paparazzi: occasional soft flash on a district that has
   celebs (one at a time, ~every 7 s, none with reduced motion). Tap a pin -> glass sheet with the venue + who's there.
   Kill switch: window.SCENE_UIUX25_OFF = true. Loads motion/uiux25.css itself. */
(function(){
 if (window.SCENE_UIUX25 || window.SCENE_UIUX25_OFF === true) return;
 var H = document.documentElement, stats = { opened: 0, pins: 0, avatars: 0, flashes: 0, taps: 0 };
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'motion/uiux25.css?v=uiux25-1'; document.head.appendChild(l);
 H.classList.add('u25');
 var RM = function(){ return matchMedia('(prefers-reduced-motion: reduce)').matches; };
 var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
 /* stylised LA (viewBox 0 0 390 430); x/y from lon/lat, compressed to fit a phone */
 var D = [
  { id: 'malibu', name: 'Malibu', re: /malibu/i, x: 52, y: 318 },
  { id: 'calabasas', name: 'Calabasas', re: /calabasas/i, x: 104, y: 150 },
  { id: 'burbank', name: 'Burbank', re: /burbank/i, x: 318, y: 86 },
  { id: 'santaMonica', name: 'Santa Monica', re: /santa monica/i, x: 196, y: 352 },
  { id: 'beverlyHills', name: 'Beverly Hills', re: /beverly hills/i, x: 226, y: 270 },
  { id: 'weho', name: 'West Hollywood', re: /west hollywood|\bweho\b/i, x: 268, y: 232 },
  { id: 'hollywood', name: 'Hollywood', re: /hollywood/i, x: 308, y: 196 },
  { id: 'melrose', name: 'Melrose', re: /melrose/i, x: 300, y: 262 },
  { id: 'silverlake', name: 'Silver Lake', re: /silver ?lake/i, x: 356, y: 222 },
  { id: 'culver', name: 'Culver City', re: /culver/i, x: 284, y: 334 }
 ];
 function moments(){ try { return (typeof CITY_MOMENTS48 !== 'undefined' && CITY_MOMENTS48['Los Angeles']) || []; } catch (e) { return []; } }
 function venueFor(d){ var m = moments(); for (var i = 0; i < m.length; i++) if (d.re.test(m[i])) return m[i]; return ''; }
 function who(id){ try { return typeof byId === 'function' ? byId(id) : null; } catch (e) { return null; } }
 function avatar(a){ try { if (typeof av === 'function') return av(a, 'u25av'); } catch (e) {} return '<span class="avatar u25av u25ini">' + esc((a.name || '?').slice(0, 1)) + '</span>'; }
 function today(){
  var out = { at: {}, around: [] }, seen = {};
  try {
   var list = (window.SCENE_STORIES && SCENE_STORIES.today && SCENE_STORIES.today()) || [];
   list.forEach(function(s){
    var id = s.charId, a = id && who(id); if (!a || seen[id]) return;
    var sl = s.slots || {}, place = String(s.place || sl.place || sl.where || sl.location || ''), city = String(s.city || sl.city || '');
    var d = null; for (var i = 0; i < D.length; i++) if (D[i].re.test(place)) { d = D[i]; break; }
    
    if (d) { seen[id] = 1; (out.at[d.id] = out.at[d.id] || []).push({ a: a, place: place, caption: s.caption || '' }); }
    else if (/los angeles|^la$/i.test(city)) { seen[id] = 1; out.around.push({ a: a, place: place }); }
   });
  } catch (e) {}
  /* Logic hook: window.SCENE_CITYSTATE.presence() -> { <spotId>: [celebId, ...] } (e.g. livingcity's hollywood/beverlyHills/
     santaMonica). When present it is the source of truth for who is AT a district; uiux25 only draws it. */
  try { var pr = window.SCENE_CITYSTATE && typeof SCENE_CITYSTATE.presence === 'function' && SCENE_CITYSTATE.presence();
   if (pr) Object.keys(pr).forEach(function(k){ (pr[k] || []).forEach(function(id){ var a = who(id); if (!a) return;
    out.around = out.around.filter(function(x){ return x.a.id !== id; }); (out.at[k] = out.at[k] || []).push({ a: a, place: '' }); }); }); } catch (e) {}
  return out;
 }
 var root = null, flashT = 0, data = null;
 var SVG = '<svg class="u25svg" viewBox="0 0 390 430" preserveAspectRatio="xMidYMid slice" aria-hidden="true">' +
  '<defs><linearGradient id="u25sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#14112a"/><stop offset="1" stop-color="#0b0a18"/></linearGradient>' +
  '<radialGradient id="u25glow" cx=".75" cy=".5" r=".6"><stop offset="0" stop-color="rgba(255,158,199,.16)"/><stop offset="1" stop-color="rgba(255,158,199,0)"/></radialGradient></defs>' +
  '<rect width="390" height="430" fill="#110e1c"/><rect width="390" height="430" fill="url(#u25glow)"/>' +
  '<path d="M0 286 C60 300 120 318 170 344 C200 360 214 372 228 392 L240 430 L0 430Z" fill="url(#u25sea)"/>' +
  '<path d="M0 286 C60 300 120 318 170 344 C200 360 214 372 228 392 L240 430" fill="none" stroke="rgba(243,211,154,.35)" stroke-width="1.2"/>' +
  '<path d="M0 230 C60 210 120 230 180 214 C230 200 270 176 330 168 C360 164 380 170 390 176 L390 196 C350 194 300 208 250 226 C190 248 120 262 60 270 L0 278Z" fill="rgba(255,255,255,.035)"/>' +
  '<g fill="none" stroke="rgba(243,211,154,.16)" stroke-width="1.4" stroke-linecap="round">' +
   '<path d="M104 150 C170 170 240 186 304 196 C340 202 370 216 390 232"/>' +
   '<path d="M226 40 C232 140 238 260 250 430"/>' +
   '<path d="M214 372 C270 352 330 336 390 326"/>' +
   '<path d="M318 86 C340 140 360 180 390 210"/></g>' +
  '<g fill="rgba(255,255,255,.04)">' + Array.apply(null, Array(36)).map(function(_, i){ var x = 150 + (i * 37) % 240, y = 40 + (i * 53) % 360; return '<circle cx="' + x + '" cy="' + y + '" r="1"/>'; }).join('') + '</g>' +
  '<text x="70" y="384" class="u25sea">PACIFIC</text><text x="128" y="246" class="u25mtn">SANTA MONICA MTNS</text></svg>';
 function pinHtml(d){
  var here = data.at[d.id] || [], hot = here.length > 0;
  var avs = here.slice(0, 3).map(function(x){ stats.avatars++; return avatar(x.a); }).join('') + (here.length > 3 ? '<i class="u25more">+' + (here.length - 3) + '</i>' : '');
  var spotLines = lines() && lines()['city.la.' + d.id + '.kim.spot'];
  return '<button type="button" class="u25pin' + (hot ? ' hot' : '') + (spotLines ? ' spot' : '') + '" data-d="' + d.id + '" style="left:' + (d.x / 390 * 100).toFixed(2) + '%;top:' + (d.y / 430 * 100).toFixed(2) + '%" aria-label="' + esc(d.name + (hot ? ', ' + here.length + ' here' : '')) + '">' +
   '<i class="u25dot"></i><b>' + esc(d.name) + '</b>' + (avs ? '<span class="u25avs">' + avs + '</span>' : '') + '</button>';
 }
 /* celebs whose story today is in LA but at no named district: a floating "Around LA" cluster, not a fake pin */
 function cluster(list){ if (!list.length) return ''; return '<div class="u25cluster u25pin hot" data-d="around" style="left:44%;top:12%"><small>AROUND LA</small><span class="u25avs">' + list.slice(0, 4).map(function(x){ stats.avatars++; return avatar(x.a); }).join('') + (list.length > 4 ? '<i class="u25more">+' + (list.length - 4) + '</i>' : '') + '</span></div>'; }
 function open(){
  if (root) return; stats.opened++; data = today();
  root = document.createElement('div'); root.className = 'u25map'; root.setAttribute('role', 'dialog'); root.setAttribute('aria-label', 'Los Angeles map');
  var around = data.around.slice(0, 8);
  root.innerHTML = '<header class="u25head"><button type="button" class="u25x" aria-label="Close map">\u2039</button><div><small>LIVE \u00b7 TODAY</small><h2>Los Angeles</h2></div><span class="u25tab" aria-current="page">MAP</span></header>' +
   '<div class="u25stage">' + SVG + D.map(pinHtml).join('') + cluster(around) + '</div>' +
   (around.length ? '<div class="u25around"><small>AROUND LA TODAY</small><div>' + around.map(function(x){ stats.avatars++; return '<button type="button" class="u25who" data-id="' + esc(x.a.id) + '">' + avatar(x.a) + '<span>' + esc(x.a.name) + '</span></button>'; }).join('') + '</div></div>' : '') +
   '<div class="u25sheet" hidden></div>';
  document.body.appendChild(root); stats.pins = D.length; fit();
  requestAnimationFrame(function(){ root.classList.add('on'); });
  H.classList.add('u25open'); var b = document.querySelector('.u25mapbtn'); if (b) b.setAttribute('aria-pressed', 'true');
  root.querySelector('.u25x').onclick = close;
  root.addEventListener('click', function(e){
   var p = e.target.closest('.u25pin'); if (p && p.getAttribute('data-d') === 'around') { hideSheet(); var st = root.querySelector('.u25around'); if (st) st.scrollIntoView({ block: 'nearest' }); return; }
   if (p) { stats.taps++; sheet(p.getAttribute('data-d')); return; }
   var w = e.target.closest('.u25who'); if (w) { var id = w.getAttribute('data-id'); close(); try { if (typeof openProfile === 'function') openProfile(id); } catch (x) {} return; }
   if (!e.target.closest('.u25sheet')) hideSheet();
  });
  if (!RM()) flashT = setInterval(flash, 7000);
 }
 function sheet(id){
  var d = D.filter(function(x){ return x.id === id; })[0], s = root && root.querySelector('.u25sheet'); if (!d || !s) return;
  [].forEach.call(root.querySelectorAll('.u25pin.sel'), function(x){ x.classList.remove('sel'); });
  var pin = root.querySelector('.u25pin[data-d="' + id + '"]'); if (pin) pin.classList.add('sel');
  var here = data.at[id] || [], v = venueFor(d);
  s.innerHTML = '<small>' + esc(d.name.toUpperCase()) + '</small>' + (v ? '<b>' + esc(v) + '</b>' : '') +
   (here.length ? '<div class="u25list">' + here.map(function(x){ return '<button type="button" class="u25who" data-id="' + esc(x.a.id) + '">' + avatar(x.a) + '<span>' + esc(x.a.name) + '<em>' + esc(x.place) + '</em></span></button>'; }).join('') + '</div>' : '<p>No one\u2019s posted from here today.</p>');
  s.hidden = false; requestAnimationFrame(function(){ s.classList.add('on'); });
 }
 function hideSheet(){ var s = root && root.querySelector('.u25sheet'); if (s) { s.classList.remove('on'); s.hidden = true; } if (root) [].forEach.call(root.querySelectorAll('.u25pin.sel'), function(x){ x.classList.remove('sel'); }); }
 function flash(){
  if (!root || document.hidden) return; var hot = root.querySelectorAll('.u25pin.hot'); if (!hot.length) return;
  var p = hot[Math.floor(Math.random() * hot.length)], f = document.createElement('i'); f.className = 'u25flash'; p.appendChild(f); stats.flashes++;
  setTimeout(function(){ f.remove(); }, 700);
 }
 /* the map stops at the bottom nav's top edge so the nav (inside #app's stacking context) stays visible and tappable */
 function fit(){ if (!root) return; var n = document.querySelector('.nav'), t = n ? n.getBoundingClientRect().top : innerHeight; root.style.bottom = Math.max(0, Math.round(innerHeight - t)) + 'px'; }
 addEventListener('resize', fit);
 function close(){ if (!root) return; clearInterval(flashT); var r = root; root = null; r.classList.remove('on'); H.classList.remove('u25open'); var b = document.querySelector('.u25mapbtn'); if (b) b.setAttribute('aria-pressed', 'false'); setTimeout(function(){ r.remove(); }, 260); }
 /* ---------- encounter card shell (Writer livingcity242 lines + Logic location state plug in here) ----------
    Lines: window.SCENE_LIVINGCITY_LINES = flat { 'city.la.<spot>.<celebId>.<part>': [variants] } (Writer's livingcity-lines.json).
    Trigger: Logic calls SCENE_UIUX25.encounter({ spot, celebId }) or dispatches 'scene:encounter' with that detail, after its own
    location + celeb gates. uiux25 never decides that an encounter happens. Shows: portrait, Writer's spot label (the leading
    "<celeb full name>, " is trimmed because the portrait and name already say who), the approach chip as her bubble.
    No player choice chips: Writer hasn't written them; the card has a close (×) only. */
 function lines(){ return window.SCENE_LIVINGCITY_LINES || null; }
 function pick(k, seed){ var L = lines(), v = L && L[k]; if (!v || !v.length) return ''; v = v.filter(function(x){ return x.indexOf('{') < 0; }); return v.length ? v[(seed || 0) % v.length] : ''; }
 var encEl = null;
 function encounter(o){
  o = o || {}; var a = who(o.celebId), spot = o.spot; if (!a || !spot) return false;
  var base = 'city.la.' + spot + '.' + o.celebId + '.', label = pick(base + 'spot', 0), chip = pick(base + 'approach.chip', o.seed || 0);
  if (label && a.name && label.indexOf(a.name + ', ') === 0) label = label.slice(a.name.length + 2);
  var d = D.filter(function(x){ return x.id === spot; })[0];
  if (encEl) encEl.remove();
  var el = encEl = document.createElement('div'); el.className = 'u25enc'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', 'Run-in with ' + a.name);
  el.innerHTML = '<button type="button" class="u25encx" aria-label="Close">\u00d7</button><small>' + esc(((d && d.name) || (o.city === 'nyc' || o.city === 'New York' ? 'New York' : 'Los Angeles')).toUpperCase()) + ' \u00b7 RUN-IN</small>' +
   '<div class="u25encwho">' + avatar(a) + '<div><b>' + esc(a.name) + '</b>' + (label ? '<span>' + esc(label.charAt(0).toUpperCase() + label.slice(1)) + '</span>' : '') + '</div></div>' +
   (chip ? '<p class="u25bubble">' + esc(chip) + '</p>' : '') + '<i class="u25encflash" aria-hidden="true"></i>';
  document.body.appendChild(el); stats.encounters = (stats.encounters || 0) + 1;
  requestAnimationFrame(function(){ el.classList.add('on'); });
  el.querySelector('.u25encx').onclick = function(){ el.classList.remove('on'); setTimeout(function(){ el.remove(); if (encEl === el) encEl = null; }, 260); };
  return true;
 }
 addEventListener('scene:encounter', function(e){ encounter(e.detail); });
 /* entry button in the top bar (re-added after every render) */
 var PIN = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/></svg>';
 function entry(){
  var s = document.querySelector('.topbar .searchtop'); if (!s || s.parentNode.querySelector('.u25mapbtn')) return;
  var b = document.createElement('button'); b.type = 'button'; b.className = 'iconbtn u25mapbtn'; b.setAttribute('aria-label', 'LA map'); b.setAttribute('aria-pressed', root ? 'true' : 'false'); b.innerHTML = PIN;
  b.onclick = function(e){ e.stopPropagation(); root ? close() : open(); }; s.parentNode.insertBefore(b, s);
 }
 new MutationObserver(entry).observe(document.body, { childList: true, subtree: true });
 setTimeout(entry, 400);
 document.addEventListener('click', function(e){ if (root && e.target.closest && e.target.closest('.nav [data-tab], .nav .fab')) close(); }, true);
 document.addEventListener('keydown', function(e){ if (root && e.key === 'Escape') close(); });
 window.SCENE_UIUX25 = { stats: stats, open: open, close: close, districts: D, today: today, encounter: encounter };
})();
