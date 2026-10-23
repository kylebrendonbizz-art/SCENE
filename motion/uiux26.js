/* uiux26 · styling for Logic's hooks (presentation only; never writes state/money/saves):
   1 premiumjet245 travel: economy = cheap on purpose (fluorescent gate, shuttle), premium = dark lounge + gold boarding pass;
     arrival card .pj245-arrival gets a pass stub from SCENE_PREMIUMJET.lastTrip() (from -> city), premium adds a champagne
     moment, velvet rope and "Private car · <player name>"; Career gets a gold "Arrived by private jet" chip on the game day
     of a private arrival (html[data-pj245-arrived=private] / SCENE_PREMIUMJET.arrivedPrivateToday()).
   2 levelnext244 (.lx244 what's-next / last unlock, .lx244-chip, .lx244-unlock): glass + gold-pink, CSS only. No new modal.
   3 fame look (light): famerooms246 sets html[data-fr246-tier=low|mid|high] -> CSS only (gold feed-header edge, softer HUD).
   Kill switch: window.SCENE_UIUX26_OFF = true. Loads motion/uiux26.css itself. */
(function(){
 if (window.SCENE_UIUX26 || window.SCENE_UIUX26_OFF === true) return;
 var H = document.documentElement, stats = { stubs: 0, chips: 0 };
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'motion/uiux26.css?v=uiux26-1'; document.head.appendChild(l);
 H.classList.add('u26');
 var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
 function PJ(){ return window.SCENE_PREMIUMJET || null; }
 var CODES = {'Los Angeles':'LAX','New York':'JFK','London':'LHR','Paris':'CDG','Tokyo':'HND','Cape Town':'CPT','Johannesburg':'JNB','Miami':'MIA','Nashville':'BNA','Toronto':'YYZ','Chicago':'ORD','Dubai':'DXB','Sydney':'SYD','Seoul':'ICN','Milan':'MXP','Lagos':'LOS','Mexico City':'MEX','Rio de Janeiro':'GIG','Berlin':'BER','Las Vegas':'LAS','Atlanta':'ATL','Ibiza':'IBZ'};
 function code(c){ if (CODES[c]) return CODES[c]; return String(c || '').replace(/[^A-Za-z ]/g, '').split(' ').map(function(w){ return w.charAt(0); }).join('').toUpperCase().slice(0, 3) || '---'; }
 function arrival(card){
  if (card.__u26) return; var cls = card.getAttribute('data-pj245-class'); if (!cls) return; card.__u26 = 1; stats.stubs++;
  var t = (PJ() && PJ().lastTrip && PJ().lastTrip()) || {}, from = t.from || '', to = t.city || card.getAttribute('data-pj245-city') || '';
  var name = ''; try { name = (state.player && state.player.name) || ''; } catch (e) {}
  var stub = document.createElement('div'); stub.className = 'u26stub';
  stub.innerHTML = '<span><small>' + (cls === 'premium' ? 'PRIVATE CHARTER' : esc((t.mode || 'economy').toUpperCase())) + '</small><b>' + esc(code(from)) + ' \u2192 ' + esc(code(to)) + '</b></span>' +
   '<span><small>' + (cls === 'premium' ? 'GATE' : 'SHUTTLE') + '</small><b>' + (cls === 'premium' ? 'FBO' : 'B12') + '</b></span>';
  var h2 = card.querySelector('h2'); if (h2) h2.before(stub); else card.prepend(stub);
  if (cls === 'premium') {
   var fx = document.createElement('div'); fx.className = 'u26pour'; fx.setAttribute('aria-hidden', 'true'); fx.innerHTML = '<i></i><i></i><i></i><i></i><i></i>'; card.prepend(fx);
   var rope = document.createElement('div'); rope.className = 'u26rope'; rope.setAttribute('aria-hidden', 'true');
   var p = card.querySelector('p'); (p || h2 || stub).after(rope);
   if (name) { var car = document.createElement('div'); car.className = 'u26car'; car.innerHTML = '<b>Private car</b><span>' + esc(name) + '</span>'; rope.after(car); }
  }
 }
 function privToday(){ try { return H.getAttribute('data-pj245-arrived') === 'private' || !!(PJ() && PJ().arrivedPrivateToday && PJ().arrivedPrivateToday()); } catch (e) { return false; } }
 function careerChip(){
  var tab = ''; try { tab = state.tab; } catch (e) {}
  var on = privToday() && tab === 'world', ex = document.querySelector('.u26jetchip');
  if (!on) { if (ex) ex.remove(); return; }
  var lx = document.querySelector('.lx244'); if (ex) { if (lx && ex.nextElementSibling !== lx) lx.before(ex); return; }
  var host = document.querySelector('.lx244') || document.querySelector('.u10-head') || document.querySelector('.careerpanelintro') || document.querySelector('.main > *'); if (!host) return;
  var c = document.createElement('div'); c.className = 'u26jetchip'; c.innerHTML = '<i aria-hidden="true">\u2708</i>Arrived by private jet';
  if (host.classList && host.classList.contains('lx244')) host.before(c); else host.after(c); stats.chips++;
 }
 var q = 0;
 function sweep(){ q = 0; [].forEach.call(document.querySelectorAll('.pj245-arrival'), arrival); careerChip(); }
 new MutationObserver(function(){ if (!q) q = requestAnimationFrame(sweep); }).observe(document.body, { childList: true, subtree: true });
 setInterval(careerChip, 1500);

 /* 4 · uiux26-chips: Writer's player chips (city.la.player.sayHi.chip / keepWalking.chip in SCENE_LIVINGCITY_LINES) on the uiux25
    run-in card. Shown only when both keys exist (never invented). Keep walking = the card's own close. Say hi = swaps the bubble to
    Writer's city.la.<spot>.<celeb>.talk.dm (else approach.dm) and fires 'scene:encounter-chip' {celebId,spot,choice} for Logic. */
 function LL(){ var L = window.SCENE_LIVINGCITY_LINES; return L && typeof L === 'object' ? L : null; }
 function one(k, seed){ var L = LL(), v = L && L[k]; if (typeof v === 'string') v = [v]; if (!v || !v.length) return ''; v = v.filter(function(x){ return String(x).indexOf('{') < 0; }); return v.length ? String(v[(seed || 0) % v.length]) : ''; }
 function chips(o){
  o = o || {}; var el = document.querySelector('.u25enc'); if (!el || el.querySelector('.u26chips') || !o.celebId || !o.spot) return;
  var seed = o.seed || 0, hi = one('city.la.player.sayHi.chip', seed), walk = one('city.la.player.keepWalking.chip', seed); if (!hi || !walk) return;
  var row = document.createElement('div'); row.className = 'u26chips';
  row.innerHTML = '<button type="button" class="u26hi">' + esc(hi) + '</button><button type="button" class="u26walk">' + esc(walk) + '</button>'; el.appendChild(row); stats.encChips = (stats.encChips || 0) + 1;
  var fire = function(choice){ try { window.dispatchEvent(new CustomEvent('scene:encounter-chip', { detail: { celebId: o.celebId, spot: o.spot, choice: choice } })); } catch (e) {} };
  row.querySelector('.u26walk').onclick = function(){ fire('keepWalking'); var x = el.querySelector('.u25encx'); if (x) x.click(); };
  row.querySelector('.u26hi').onclick = function(){ fire('sayHi'); var base = 'city.la.' + o.spot + '.' + o.celebId + '.', t = one(base + 'talk.dm', seed) || one(base + 'approach.dm', seed);
   if (t) { var b = el.querySelector('.u25bubble'); if (!b) { b = document.createElement('p'); b.className = 'u25bubble'; row.before(b); } b.textContent = t; }
   row.remove(); };
 }
 window.addEventListener('scene:encounter', function(e){ if (!window.SCENE_UIUX26_OFF) chips(e.detail); });
 (function wrap(n){ var U = window.SCENE_UIUX25; if (!U || !U.encounter) { if (n < 40) setTimeout(function(){ wrap(n + 1); }, 250); return; }
  var f = U.encounter; U.encounter = function(o){ var r = f.apply(this, arguments); if (r && !window.SCENE_UIUX26_OFF) chips(o); return r; }; })(0);
 window.SCENE_UIUX26 = { stats: stats, sweep: sweep };
})();
