/* uiux14: travel takeover — full-viewport glass sky with clouds, a plane crossing from the real departure city to the
   real arrival city (state.travelHistory[0] written by the game's completeTravel48, falling back to motion3's own
   from/to), a ~3.4 s progress line, then a smooth reveal of the new city. Tap anywhere to skip.
   Sound: a WebAudio jet pass (filtered brown noise swelling and passing + a soft two-tone cabin chime), through the
   shared window.SCENE_SFX helper from uiux13 (same mute rule = the game's soundtrack setting, same gesture unlock).
   Without uiux13 loaded the takeover is silent. Presentation only: the trip, cost, energy and XP are the game's.
   It hides motion3's small .mo-travel card the moment it is inserted and, on close, presses its Skip so motion3's
   'scenefx:travel-done' event still fires. Loads motion/uiux14.css itself. Kill switch: window.SCENE_UIUX14_OFF=true. */
(function(){
'use strict';
if (window.SCENE_UIUX14_OFF) return;
document.documentElement.classList.add('u14');
var RM = function(){ return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
(function css(){ if (document.getElementById('uiux14-css')) return; var l = document.createElement('link'); l.rel = 'stylesheet'; l.id = 'uiux14-css'; l.href = './motion/uiux14.css?v=uiux14-1'; (document.head || document.documentElement).appendChild(l); })();
var S = function(){ try { return state; } catch (e) { return window.state; } };
var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
var FLY_MS = 3400, REVEAL_MS = 1700;
var CODES = {'Los Angeles':'LAX','New York':'JFK','London':'LHR','Paris':'CDG','Tokyo':'HND','Cape Town':'CPT','Johannesburg':'JNB','Miami':'MIA','Nashville':'BNA','Toronto':'YYZ','Chicago':'ORD','Dubai':'DXB','Sydney':'SYD','Seoul':'ICN','Milan':'MXP','Lagos':'LOS','Mexico City':'MEX','Rio de Janeiro':'GIG','Berlin':'BER','Las Vegas':'LAS','Atlanta':'ATL','Ibiza':'IBZ'}; /* same table as motion3 */
var code = function(c){ return CODES[c] || String(c || '???').replace(/[^A-Za-z]/g, '').slice(0, 3).toUpperCase(); };
var stats = { intercepted: 0, shown: 0, skipped: 0, sound: 0, soundMuted: 0, soundLocked: 0 };
var cur = null;

function country(c){ try { return (typeof CITY48 !== 'undefined' && CITY48[c] && CITY48[c].country) || ''; } catch (e) { return ''; } }
function tripData(src){
 var s = S() || {}, p = s.player || {}, h = (s.travelHistory || [])[0] || null;
 var to = p.city || '', from = '';
 if (h && h.city === to && Date.now() - (Number(h.at) || 0) < 20000) from = h.from || '';
 if (!from && src) { var codes = src.querySelectorAll('.route b'); if (codes.length === 2) from = Object.keys(CODES).filter(function(k){ return CODES[k] === codes[0].textContent.trim(); })[0] || codes[0].textContent.trim(); }
 var mode = h && h.city === to ? h.mode : '';
 var modeLabel = mode === 'private' ? 'Private jet' : mode === 'business' ? 'Business class' : mode === 'home' ? 'Flying home' : mode === 'economy' ? 'Economy' : '';
 return { from: from || 'Los Angeles', to: to || 'Paris', mode: modeLabel, day: (Number(s.sceneDay) || 0) + 1, country: country(to) };
}
function clouds(){ var h = ''; for (var i = 0; i < 9; i++) h += '<i class="u14cloud" style="--y:' + (8 + (i * 37) % 78) + '%;--s:' + (0.6 + (i % 4) * .25).toFixed(2) + ';--d:' + (7 + (i * 13) % 9) + 's;--o:' + (-(i * 1.7)).toFixed(1) + 's;--a:' + (.35 + (i % 3) * .2).toFixed(2) + '"></i>'; return h; }
var PLANE = '<svg viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="u14pg" x1="0" x2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#ffe3f0"/></linearGradient></defs><path fill="url(#u14pg)" d="M4 35.5 23.6 32 14.5 11h6.9l15.9 19.3 14.3-.8a5 5 0 0 1 0 10l-14.3-.8L21.4 58h-6.9l9.1-21L4 33.5c-1.3-.2-1.3-2.8 0 0Z"/><path fill="#f3d39a" d="M6 28.5h5l3 4.5-8-.5z"/></svg>';

function show(src){
 var d = tripData(src), rm = RM(), el = document.createElement('div');
 el.className = 'u14trip' + (rm ? ' u14rm' : ''); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Flying from ' + d.from + ' to ' + d.to);
 el.dataset.phase = 'fly';
 el.innerHTML = '<div class="u14sky"></div><div class="u14sun" aria-hidden="true"></div><div class="u14clouds" aria-hidden="true">' + clouds() + '</div>' +
  '<div class="u14trail" aria-hidden="true"></div><div class="u14plane" aria-hidden="true">' + PLANE + '</div>' +
  '<div class="u14top"><small>' + esc(d.mode ? d.mode.toUpperCase() + ' · ' : '') + 'DAY ' + d.day + '</small><button type="button" class="u14skip">Skip</button></div>' +
  '<div class="u14route"><div class="u14end"><b>' + esc(code(d.from)) + '</b><span>' + esc(d.from) + '</span></div>' +
   '<div class="u14line"><i class="u14fill"></i><i class="u14dot"></i></div>' +
   '<div class="u14end u14r"><b>' + esc(code(d.to)) + '</b><span>' + esc(d.to) + '</span></div></div>' +
  '<div class="u14status" aria-live="polite">In the air</div>' +
  '<div class="u14reveal"><small>WELCOME TO</small><h1>' + esc(d.to) + '</h1><p>' + esc([d.country, 'Day ' + d.day].filter(Boolean).join(' · ')) + '</p></div>';
 document.body.appendChild(el); stats.shown++;
 cur = { el: el, src: src, t0: performance.now(), timers: [] };
 el.addEventListener('click', function(e){ e.stopPropagation(); stats.skipped += cur && el.dataset.phase === 'fly' ? 1 : 0; close(); });
 el.addEventListener('keydown', function(e){ if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); close(); } });
 requestAnimationFrame(function(){ el.classList.add('u14on'); try { el.querySelector('.u14skip').focus({ preventScroll: true }); } catch (e) {} });
 var fly = rm ? 900 : FLY_MS;
 el.style.setProperty('--fly', fly + 'ms');
 var pl = el.querySelector('.u14plane'), tr = el.querySelector('.u14trail');
 (function tick(t){ if (!cur || cur.el !== el) return; var k = Math.min(1, (t - cur.t0) / fly); el.style.setProperty('--p', k.toFixed(4));
  var W = innerWidth, H = innerHeight, e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, x = -90 + (W + 180) * e, y = H * .46 - Math.sin(Math.PI * e) * H * .16, ang = -Math.cos(Math.PI * e) * 14;
  if (pl) pl.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + (ang - 4).toFixed(1) + 'deg) scale(' + (1 + Math.sin(Math.PI * e) * .25).toFixed(3) + ')';
  if (tr) tr.style.width = Math.max(0, x + 30).toFixed(0) + 'px', tr.style.transform = 'translateY(' + (y + 34).toFixed(1) + 'px)';
  if (k < 1) requestAnimationFrame(tick); })(performance.now());
 cur.timers.push(setTimeout(function(){ if (!cur || cur.el !== el) return; el.dataset.phase = 'land'; el.classList.add('u14landed'); el.querySelector('.u14status').textContent = 'Landed in ' + d.to; try { navigator.vibrate && !rm && navigator.vibrate(25); } catch (e) {} }, fly));
 cur.timers.push(setTimeout(close, fly + (rm ? 1200 : REVEAL_MS)));
 sound(rm);
}
function close(){
 if (!cur) return; var c = cur; cur = null; c.timers.forEach(clearTimeout);
 c.el.classList.remove('u14on'); c.el.classList.add('u14off'); setTimeout(function(){ c.el.remove(); }, RM() ? 0 : 420);
 if (c.src && c.src.isConnected) { var b = c.src.querySelector('.mo-tskip'); if (b) b.click(); }
 try { if (c.voice) c.voice.stop(); } catch (e) {}
}

/* ---------- jet pass (WebAudio) ---------- */
function render(dur){ dur = dur || FLY_MS / 1000;
 return function(c, out, t){
  var SFX = window.SCENE_SFX;
  /* cabin chime: soft two-tone "ding-dong" */
  [[880, 0], [659.3, .32]].forEach(function(n){ var o = c.createOscillator(), o2 = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o2.type = 'sine'; o.frequency.value = n[0]; o2.frequency.value = n[0] * 2.01;
   var g2 = c.createGain(); g2.gain.value = .18; o2.connect(g2); g2.connect(g); o.connect(g); g.connect(out);
   g.gain.setValueAtTime(0.0001, t + n[1]); g.gain.exponentialRampToValueAtTime(.16, t + n[1] + .015); g.gain.exponentialRampToValueAtTime(0.0001, t + n[1] + 1.1);
   o.start(t + n[1]); o2.start(t + n[1]); o.stop(t + n[1] + 1.2); o2.stop(t + n[1] + 1.2); });
  /* jet: brown-noise rumble + a white-noise "whoosh" band, swelling to a peak mid-pass and fading away, with a
     downward filter glide (doppler feel) and a left→right pan where the context supports it */
  var j0 = t + .35, peak = j0 + dur * .5, end = j0 + dur + .4;
  var bus = c.createGain(); bus.gain.value = 1; var pan = null;
  if (c.createStereoPanner) { pan = c.createStereoPanner(); pan.pan.setValueAtTime(-.8, j0); pan.pan.linearRampToValueAtTime(.8, end); bus.connect(pan); pan.connect(out); } else bus.connect(out);
  var rb = c.createBufferSource(); rb.buffer = SFX.noise(c, 'brown'); rb.loop = true;
  var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.Q.value = .7;
  lp.frequency.setValueAtTime(220, j0); lp.frequency.exponentialRampToValueAtTime(1500, peak); lp.frequency.exponentialRampToValueAtTime(260, end);
  var rg = c.createGain(); rg.gain.setValueAtTime(0.0001, j0); rg.gain.exponentialRampToValueAtTime(.12, j0 + .5); rg.gain.linearRampToValueAtTime(.9, peak); rg.gain.linearRampToValueAtTime(.08, end - .3); rg.gain.exponentialRampToValueAtTime(0.0001, end);
  rb.connect(lp); lp.connect(rg); rg.connect(bus); rb.start(j0); rb.stop(end + .05);
  var wb = c.createBufferSource(); wb.buffer = SFX.noise(c, 'white'); wb.loop = true;
  var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.1;
  bp.frequency.setValueAtTime(900, j0); bp.frequency.exponentialRampToValueAtTime(2600, peak - .1); bp.frequency.exponentialRampToValueAtTime(600, end);
  var wg = c.createGain(); wg.gain.setValueAtTime(0.0001, j0); wg.gain.exponentialRampToValueAtTime(.02, j0 + .5); wg.gain.linearRampToValueAtTime(.09, peak); wg.gain.linearRampToValueAtTime(.005, end - .2); wg.gain.exponentialRampToValueAtTime(0.0001, end);
  wb.connect(bp); bp.connect(wg); wg.connect(bus); wb.start(j0); wb.stop(end + .05);
  /* faint turbine whine gliding down as it passes */
  var o = c.createOscillator(), og = c.createGain(); o.type = 'sawtooth'; o.frequency.setValueAtTime(1240, j0); o.frequency.exponentialRampToValueAtTime(1180, peak); o.frequency.exponentialRampToValueAtTime(820, end);
  var of = c.createBiquadFilter(); of.type = 'lowpass'; of.frequency.value = 2200;
  og.gain.setValueAtTime(0.0001, j0); og.gain.exponentialRampToValueAtTime(.012, peak); og.gain.exponentialRampToValueAtTime(0.0001, end);
  o.connect(of); of.connect(og); og.connect(bus); o.start(j0); o.stop(end + .05);
 }; }
function sound(rm){
 var SFX = window.SCENE_SFX; if (!SFX) return;
 if (SFX.muted()) { stats.soundMuted++; return; }
 if (!SFX.ready()) { stats.soundLocked++; return; }
 if (SFX.play(render((rm ? 900 : FLY_MS) / 1000), .34)) stats.sound++;
}

new MutationObserver(function(ms){
 if (window.SCENE_UIUX14_OFF) return;
 for (var i = 0; i < ms.length; i++) for (var k = 0; k < ms[i].addedNodes.length; k++) { var n = ms[i].addedNodes[k];
  if (n.nodeType === 1 && n.classList && n.classList.contains('mo-travel') && !n.classList.contains('u14src')) { n.classList.add('u14src'); n.setAttribute('aria-hidden', 'true'); stats.intercepted++; if (cur) close(); show(n); } }
}).observe(document.body || document.documentElement, { childList: true });
window.SCENE_UIUX14 = { version: 1, stats: function(){ return JSON.parse(JSON.stringify(stats)); }, render: render, close: close, get open(){ return !!cur; } };
})();
