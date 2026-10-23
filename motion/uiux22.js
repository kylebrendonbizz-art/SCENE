/* uiux22 · six small feel fixes (presentation only; never touches money/economy/saves):
   1 swipe right from the left edge closes a DM thread (clicks the game's own #chatback)
   2 blur the DM input after a send so the phone keyboard closes
   3 HUD pills (energy / diamonds / fame) + XP track in the uiux19/20 dark-glass gold-pink look (CSS)
   4 paparazzi flashbulbs (motion3 .mo-pap) originate in the top third, slightly softer
   5 post likes/comments count up with an icon pop; new comment previews fade/slide in (post engagement only)
   7 level-up moment (uiux12 .u12moment) re-skinned as a centred dark-glass card + fame tier line (same trigger/data/close)
   6 double-tap Feed/Career to smooth-scroll to top (game handler kept; touch-action hardening, see CHANGES.md)
   Kill switch: window.SCENE_UIUX22_OFF = true. Loads motion/uiux22.css itself. */
(function(){
 if (window.SCENE_UIUX22 || window.SCENE_UIUX22_OFF === true) return;
 var H = document.documentElement, RM = function(){ return matchMedia('(prefers-reduced-motion: reduce)').matches; };
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'motion/uiux22.css?v=uiux22-1'; document.head.appendChild(l);
 H.classList.add('u22');
 var stats = { swipeClose: 0, blurs: 0, counts: 0, comments: 0, flashes: 0, tops: 0 };

 /* 1 · edge swipe to leave a DM */
 var sw = null;
 document.addEventListener('touchstart', function(e){
  var t = e.touches[0], page = e.target.closest && e.target.closest('.chatpage');
  sw = (page && e.touches.length === 1 && t.clientX <= 24) ? { x: t.clientX, y: t.clientY, page: page, h: false } : null;
 }, { passive: true, capture: true });
 document.addEventListener('touchmove', function(e){
  if (!sw) return; var t = e.touches[0], dx = t.clientX - sw.x, dy = t.clientY - sw.y;
  if (!sw.h) { if (Math.abs(dy) > 12 && Math.abs(dy) > dx) { sw = null; return; } if (dx > 12 && dx > Math.abs(dy) * 1.5) sw.h = true; }
  if (sw && sw.h) { sw.page.style.transition = 'none'; sw.page.style.transform = 'translateX(' + Math.max(0, dx) + 'px)'; sw.page.style.boxShadow = '-18px 0 40px rgba(0,0,0,.45)'; }
 }, { passive: true, capture: true });
 function endSwipe(e){
  if (!sw) return; var s = sw; sw = null; var t = e.changedTouches && e.changedTouches[0]; if (!t) return;
  var dx = t.clientX - s.x, dy = t.clientY - s.y, ok = s.h && dx > 80 && Math.abs(dy) < dx * 0.6;
  var back = document.getElementById('chatback');
  if (ok && back) { stats.swipeClose++; s.page.style.transition = 'transform .16s ease-out'; s.page.style.transform = 'translateX(100%)'; setTimeout(function(){ back.click(); }, 150); }
  else { s.page.style.transition = 'transform .2s ease-out'; s.page.style.transform = ''; setTimeout(function(){ s.page.style.boxShadow = ''; s.page.style.transition = ''; }, 220); }
 }
 document.addEventListener('touchend', endSwipe, { passive: true, capture: true });
 document.addEventListener('touchcancel', function(){ if (sw) { sw.page.style.transform = ''; sw.page.style.boxShadow = ''; } sw = null; }, { passive: true, capture: true });

 /* 2 · close the keyboard after a DM send */
 function afterSend(){ [90, 320].forEach(function(ms){ setTimeout(function(){ var i = document.getElementById('dmtext'); if (i && !i.value.trim() && document.activeElement === i) { i.blur(); stats.blurs++; } }, ms); }); }
 document.addEventListener('click', function(e){ if (e.target.closest && e.target.closest('#dmsend')) afterSend(); }, true);
 document.addEventListener('submit', function(e){ if (e.target && e.target.id === 'dmcomposer') afterSend(); }, true);
 document.addEventListener('keydown', function(e){ if (e.key === 'Enter' && !e.shiftKey && e.target && e.target.id === 'dmtext') afterSend(); }, true);

 /* 4 · paparazzi flash origin into the top third */
 function lift(root){ var b = root.querySelectorAll('.mo-flashbulb'); for (var i = 0; i < b.length; i++) { b[i].style.setProperty('--y', (5 + Math.random() * 25).toFixed(1) + '%'); } if (b.length) stats.flashes++; }

 /* 7 · level-up card: tier line from motion.js's fame-tier rule; everything else is uiux12's own data */
 var TIERS = ['Unknown', 'Rising', 'Famous', 'Icon'];
 function lvl(m){
  stats.levelCards = (stats.levelCards || 0) + 1; m.classList.add('u22lv');
  /* same thresholds as motion.js computeTier(); computed here because its tier attribute updates a beat after the level jump */
  var L = 0, f = 0; try { L = window.SCENE_DIRECTOR157.level().level; f = Number(window.state.player.fame) || 0; } catch (e) {}
  var t = L ? TIERS[f >= 180 || L >= 16 ? 3 : f >= 80 || L >= 9 ? 2 : f >= 15 || L >= 4 ? 1 : 0] : TIERS[Number(H.getAttribute('data-mo-tier'))], sub = m.querySelector('.u12sub');
  if (t && sub && !m.querySelector('.u22tier')) { var e = document.createElement('small'); e.className = 'u22tier'; e.textContent = '\u2726 ' + t.toUpperCase() + ' \u00b7 FAME TIER'; sub.after(e); }
  var b = m.querySelector('.u12btn'); if (b) b.textContent = 'Nice';
 }

 /* 5 · post engagement count-up */
 var seen = {}, prev = {}, queued = 0;
 function num(s){ var m = /([\d.,]+)\s*([KkMm])?/.exec(s || ''); if (!m) return NaN; var n = parseFloat(m[1].replace(/,/g, '')); return m[2] ? n * (/k/i.test(m[2]) ? 1e3 : 1e6) : n; }
 function like(n, sample){ if (/M/i.test(sample)) return (n / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'; if (/K/i.test(sample)) return (n / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'; return String(Math.round(n)); }
 function onScreen(el){ var r = el.getBoundingClientRect(); return r.width && r.bottom > 0 && r.top < innerHeight; }
 function countUp(span, from, to, text){
  var btn = span.closest('.metric'); if (!btn || btn.querySelector('.u22ct')) return; stats.counts++;
  btn.classList.add('u22counting'); var o = document.createElement('b'); o.className = 'u22ct'; o.textContent = like(from, text);
  o.style.left = span.offsetLeft + 'px'; o.style.top = span.offsetTop + 'px'; o.style.minWidth = span.offsetWidth + 'px';
  btn.appendChild(o);
  var ic = btn.querySelector('svg'); if (ic && ic.animate) ic.animate([{ transform: 'scale(1)', filter: 'none' }, { transform: 'scale(1.38)', filter: 'drop-shadow(0 0 6px rgba(255,158,199,.9))', offset: .35 }, { transform: 'scale(1)', filter: 'none' }], { duration: 480, easing: 'cubic-bezier(.2,1.5,.4,1)' });
  var t0 = performance.now(), D = Math.min(900, 420 + (to - from) * 40);
  (function step(t){ var k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3); o.textContent = like(from + (to - from) * e, text);
   if (k < 1 && o.isConnected) requestAnimationFrame(step); else { o.remove(); btn.classList.remove('u22counting'); } })(t0);
 }
 function scan(){
  queued = 0; var posts = document.querySelectorAll('[data-live-post]');
  for (var i = 0; i < posts.length; i++) {
   var p = posts[i], id = p.getAttribute('data-live-post');
   ['likes', 'comments'].forEach(function(k){
    var s = p.querySelector('[data-live-metric="' + k + '"]'); if (!s) return; var key = id + ':' + k, v = num(s.textContent);
    if (isNaN(v)) return; if (prev[key] != null && v > prev[key] && !RM() && onScreen(s)) countUp(s, prev[key], v, s.textContent); prev[key] = v;
   });
   var c = p.querySelector('.commentpreview,.socialthreadpreview'); if (c) { var tx = c.textContent;
    if (seen[id] != null && seen[id] !== tx && !RM() && onScreen(c) && c.animate) { stats.comments++; c.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 380, easing: 'cubic-bezier(.2,.8,.2,1)' }); }
    seen[id] = tx; }
  }
 }
 new MutationObserver(function(recs){
  for (var i = 0; i < recs.length; i++) { var a = recs[i].addedNodes; for (var j = 0; j < a.length; j++) if (a[j].nodeType === 1) { if (a[j].classList.contains('mo-pap')) lift(a[j]); else if (a[j].classList.contains('u12moment')) lvl(a[j]); } }
  if (!queued) queued = requestAnimationFrame(scan);
 }).observe(document.body, { childList: true, subtree: true, characterData: true });
 setTimeout(scan, 500);

 /* 6 · double-tap Feed/Career to top. The game's bind() handler calls a native smooth scrollTo, but on Feed the
    live re-renders (motion2's same-tab scroll keeper calls scrollTo(0,y)) cancel it mid-way. We run our own short rAF
    glide that re-asserts its position each frame, so a re-render can't stop it. */
 var tapT = 0, tapTab = '', glide = 0;
 function toTop(){ cancelAnimationFrame(glide); var y0 = scrollY, t0 = performance.now(), D = RM() ? 1 : Math.min(520, 260 + y0 / 8); stats.tops++;
  (function f(t){ var k = Math.min(1, (t - t0) / D), e = 1 - Math.pow(1 - k, 3); scrollTo(0, Math.round(y0 * (1 - e))); var m = document.querySelector('.main'); if (m && m.scrollTop) m.scrollTop = Math.round(m.scrollTop * (1 - e)); if (k < 1) glide = requestAnimationFrame(f); })(t0); }
 document.addEventListener('click', function(e){
  var b = e.target.closest && e.target.closest('.nav [data-tab]'); if (!b) return; var t = b.getAttribute('data-tab'), now = performance.now();
  var active = b.classList.contains('on') || (window.state && window.state.tab === t);
  if (active && (t === 'feed' || t === 'world') && tapTab === t && now - tapT < 450) { tapT = 0; setTimeout(toTop, 0); return; }
  tapTab = t; tapT = now;
 }, true);
 addEventListener('touchstart', function(){ cancelAnimationFrame(glide); }, { passive: true });

 window.SCENE_UIUX22 = { stats: stats, scan: scan };
})();
