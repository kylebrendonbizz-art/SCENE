/* uiux9: SCENE start page redesign (landing hero + stepped sign-up + starter picker restyle).
   Presentation only. It reuses the core onboarding DOM (#name, #handle, #starterpronouns, birthday, [data-career], #enter)
   and the core handlers. Nothing is written to the save; the save format is unchanged.
   Copy: window.SCENE_START_COPY (SCENE Writer), with fallback placeholders marked [PH].
   Kill switch: window.SCENE_UIUX9_OFF=true (set before this script runs) restores the old look. */
(function(){
 'use strict';
 if (window.SCENE_UIUX9_OFF) return;
 var html = document.documentElement;
 html.classList.add('u9');
 var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

 /* [PH] placeholders, used only when SCENE_START_COPY lacks a key. See COPY_FOR_WRITER.md. */
 var PH = {
  tagline:'Your fame era starts tonight.', hero_cta:'Start your story', hero_sub:'Fictional celebrity life sim · free · offline-safe',
  chip_dm_name:'Your bestie', chip_dm_text:'ok wait who ARE you 👀', chip_likes:'12.4K likes', chip_likes_sub:'on your first post',
  chip_news_src:'Pop Base', chip_news_text:'New face spotted with A-listers in WeHo', chip_follow:'+2,318 followers',
  step_label_1:'You', step_label_2:'Identity', step_label_3:'Lane', step_label_4:'Your person',
  step1_title:'Who’s the new face?', step1_helper:'Your name and @handle go on your profile card.',
  step2_title:'How should SCENE refer to you?', step2_helper:'Characters, comments and headlines use this.',
  step3_title:'Choose your lane', step3_helper:'Your lane sets your gigs and who clocks you first.',
  card_preview_label:'Live preview', btn_next:'Next', btn_back:'Back',
  city_label:'Starting city', city_la_vibe:'Sunset, studio lots, paparazzi at Erewhon.',
  err_name:'Add your name and handle.', err_handle:'Add your name and handle.',
  err_pronouns:'Choose Male, Female or They / Them so SCENE refers to you correctly.'
 };
 function copyObj(){ var c = window.SCENE_START_COPY; return (c && typeof c === 'object') ? c : {}; }
 function sub(s, vars){ return String(s).replace(/\$\{(\w+)\}/g, function(m,k){ return vars && vars[k] != null ? vars[k] : m; }); }
 function C(key, vars){ var v = copyObj()[key]; if (typeof v !== 'string' || !v.trim()) v = PH[key] || ''; return sub(v, vars); }
 function nested(path, vars){ var o = copyObj(); path.split('.').forEach(function(k){ o = o && o[k]; }); return typeof o === 'string' && o.trim() ? sub(o, vars) : ''; }
 function esc(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); }
 function $(sel, root){ return (root || document).querySelector(sel); }
 function vars(){ var n = $('#name'), h = $('#handle'); return { name: n ? n.value.trim() : '', handle: h ? h.value.replace(/^@/,'').trim() : '', city: 'Los Angeles' }; }

 /* Handle validation hook from Gameplay Logic (optional). Returns null when OK (and normalises the input), or an error line. */
 function handleError(){
  var h = $('#handle'); if (!h) return null;
  var raw = h.value.replace(/^@/,'').trim();
  if (!raw) return C('err_handle');
  var api = window.SCENE_HANDLE;
  if (!api || typeof api.validate !== 'function') return null;
  var r; try { r = api.validate(h.value, { current: h.getAttribute('data-uiux9-current') || h.defaultValue || '' }); } catch (e) { return null; }
  if (!r) return null;
  if (r.ok) {
   if (typeof r.value === 'string' && r.value && r.value !== h.value) { h.value = r.value; h.dispatchEvent(new Event('input', { bubbles: true })); }
   return null;
  }
  var v = { handle: raw, name: vars().name }, map = { format:'errors.handleInvalid', length:'errors.handleLength', taken:'errors.handleTaken' };
  return nested(map[r.error] || 'errors.handleInvalid', v) || C('err_handle');
 }

 var ui = { step: 0, started: false };
 var STEPS = 3; /* steps inside onboarding; step 4 is the game's own starter picker */

 function grain(){ return '<svg class="u9grain" aria-hidden="true"><filter id="u9n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#u9n)"/></svg>'; }
 function aurora(){ return '<div class="u9aurora" aria-hidden="true"><i class="a1"></i><i class="a2"></i><i class="a3"></i><i class="a4"></i></div>' + grain(); }
 function progress(active){
  var h = '<div class="u9prog" role="progressbar" aria-valuemin="1" aria-valuemax="4" aria-valuenow="' + active + '">';
  for (var i = 1; i <= 4; i++) h += '<div class="u9seg' + (i < active ? ' done' : i === active ? ' on' : '') + '"><i></i><span>' + esc(C('step_label_' + i)) + '</span></div>';
  return h + '</div>';
 }

 function enhance(root){
  root.classList.add('u9on'); html.classList.add('u9-onboarding');
  var heroOld = $('.onboardhero', root), card = $('.identitycard', root), fields = $('.identityfields', root), starter = $('.startercard', root);
  var pron = $('.identityfield130', root), bday = $('.birthdayfield130', root), lanes = $('.careerfield', root), enter = $('#enter', root);
  var promise = $('.onboardpromise', root), note = $('.fictionnote', root), eyebrow = heroOld ? $('.onboardeyebrow', heroOld) : null;
  if (!fields || !enter || !card) return; /* unknown markup: leave the old page alone */

  /* HERO */
  var hero = document.createElement('section');
  hero.className = 'u9hero'; hero.setAttribute('aria-label', 'SCENE');
  hero.innerHTML = aurora() +
   '<div class="u9chips" aria-hidden="true">' +
    '<div class="u9chip u9c-dm"><b class="u9av">✦</b><span><strong>' + esc(C('chip_dm_name')) + '</strong><em>' + esc(C('chip_dm_text')) + '</em></span></div>' +
    '<div class="u9chip u9c-like"><b class="u9heart">♥</b><span><strong>' + esc(C('chip_likes')) + '</strong><em>' + esc(C('chip_likes_sub')) + '</em></span></div>' +
    '<div class="u9chip u9c-news"><b class="u9tick">✓</b><span><strong>' + esc(C('chip_news_src')) + '</strong><em>' + esc(C('chip_news_text')) + '</em></span></div>' +
    '<div class="u9chip u9c-follow"><b class="u9plus">+</b><span><strong>' + esc(C('chip_follow')) + '</strong></span></div>' +
   '</div>' +
   '<div class="u9herocopy">' +
    '<div class="u9eyebrow"><i></i><span class="u9eyebrowtxt"></span></div>' +
    '<h1 class="u9word" aria-label="SCENE">SCENE</h1>' +
    '<p class="u9tag">' + esc(C('tagline')) + '</p>' +
    '<button type="button" class="u9cta" id="u9start"><span>' + esc(C('hero_cta')) + '</span><b aria-hidden="true">→</b></button>' +
    '<small class="u9sub">' + esc(C('hero_sub')) + '</small>' +
   '</div>';
  if (eyebrow) $('.u9eyebrowtxt', hero).textContent = eyebrow.textContent.trim(); /* existing wording */

  /* FLOW */
  var flow = document.createElement('section');
  flow.className = 'u9flow';
  flow.innerHTML = aurora() +
   '<header class="u9flowtop"><button type="button" class="u9back" id="u9back" aria-label="' + esc(C('btn_back')) + '"><b aria-hidden="true">‹</b><span>' + esc(C('btn_back')) + '</span></button><div class="u9progwrap">' + progress(1) + '</div></header>' +
   '<div class="u9panes">' +
    '<div class="u9pane" data-u9pane="1"><div class="u9card"><h2>' + esc(C('step1_title')) + '</h2><p class="u9help">' + esc(C('step1_helper')) + '</p><div class="u9preview"><small class="u9plabel"><i></i>' + esc(C('card_preview_label')) + '</small></div><div class="u9slot1"></div><p class="u9err" role="alert" aria-live="assertive"></p></div><button type="button" class="u9next" data-u9next="1"><span>' + esc(C('btn_next')) + '</span><b aria-hidden="true">→</b></button></div>' +
    '<div class="u9pane" data-u9pane="2"><div class="u9card"><h2>' + esc(C('step2_title')) + '</h2><p class="u9help">' + esc(C('step2_helper')) + '</p><div class="u9pchips" role="group"></div><div class="u9slot2"></div><p class="u9err" role="alert" aria-live="assertive"></p></div><button type="button" class="u9next" data-u9next="2"><span>' + esc(C('btn_next')) + '</span><b aria-hidden="true">→</b></button></div>' +
    '<div class="u9pane" data-u9pane="3"><div class="u9card"><h2>' + esc(C('step3_title')) + '</h2><p class="u9help">' + esc(C('step3_helper')) + '</p>' +
     '<div class="u9city" role="note"><div class="u9cityart" aria-hidden="true"><i class="sun"></i><i class="hills"></i><i class="palm p1"></i><i class="palm p2"></i></div><div class="u9citytxt"><small>' + esc(C('city_label')) + '</small><strong>Los Angeles</strong><span>' + esc(C('city_la_vibe')) + '</span></div><b class="u9pin" aria-hidden="true">●</b></div>' +
     '<div class="u9slot3"></div><p class="u9err" role="alert" aria-live="assertive"></p></div><div class="u9slot3b"></div></div>' +
   '</div>';

  /* Move the real core nodes into the steps (ids, handlers and values stay with the nodes). */
  var preview = $('.u9preview', flow);
  if (starter) preview.appendChild(starter);
  $('.u9slot1', flow).appendChild(fields);
  if (pron) $('.u9slot2', flow).appendChild(pron);
  if (bday) $('.u9slot2', flow).appendChild(bday);
  if (lanes) $('.u9slot3', flow).appendChild(lanes);
  var s3b = $('.u9slot3b', flow); s3b.appendChild(enter); if (promise) s3b.appendChild(promise); if (note) s3b.appendChild(note);

  /* Pronoun chips: a tappable proxy for the real <select id="starterpronouns"> (still the source of truth). */
  var sel = $('#starterpronouns', flow), pc = $('.u9pchips', flow);
  if (sel && pc) {
   sel.classList.add('u9srsel'); sel.tabIndex = -1; sel.setAttribute('aria-hidden', 'true');
   var lab = pron && pron.querySelector('span'); if (lab) lab.classList.add('u9vh');
   pc.setAttribute('aria-label', lab ? lab.textContent : 'Pronouns');
   Array.prototype.forEach.call(sel.options, function(o){
    if (!o.value) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'u9pchip'; b.dataset.u9pron = o.value;
    var parts = o.textContent.split('·'); b.innerHTML = '<b>' + esc(parts[0].trim()) + '</b>' + (parts[1] ? '<small>' + esc(parts[1].trim()) + '</small>' : '');
    b.onclick = function(){ sel.value = o.value; sel.dispatchEvent(new Event('change', { bubbles: true })); syncChips(); clearErr(2); };
    pc.appendChild(b);
   });
   var syncChips = function(){ pc.querySelectorAll('.u9pchip').forEach(function(b){ var on = b.dataset.u9pron === sel.value; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }); };
   sel.addEventListener('change', syncChips); syncChips();
  }

  root.insertBefore(flow, root.firstChild);
  root.insertBefore(hero, root.firstChild);

  hero.querySelector('#u9start').onclick = function(){ ui.started = true; go(1, 1); };
  flow.querySelector('#u9back').onclick = function(){ if (ui.step <= 1) { ui.started = false; go(0, -1); } else go(ui.step - 1, -1); };
  flow.querySelectorAll('[data-u9next]').forEach(function(b){ b.onclick = function(){ next(Number(b.dataset.u9next)); }; });
  ['#name', '#handle'].forEach(function(id){ var el = $(id, flow); if (el) el.addEventListener('input', function(){ clearErr(1); }); });
  [$('#name', flow), $('#handle', flow)].forEach(function(el){ if (el) el.addEventListener('keydown', function(e){ if (e.key === 'Enter') { e.preventDefault(); if (el.id === 'name') { var h = $('#handle'); h && h.focus(); } else next(1); } }); });

  go(ui.started ? (ui.step || 1) : 0, 0);
 }

 function paneErr(n){ return document.querySelector('[data-u9pane="' + n + '"] .u9err'); }
 function showErr(n, msg){ var e = paneErr(n); if (!e) return; e.textContent = msg; e.classList.remove('shake'); void e.offsetWidth; e.classList.add('on', 'shake'); }
 function clearErr(n){ var e = paneErr(n); if (e) { e.textContent = ''; e.classList.remove('on', 'shake'); } }

 function next(n){
  if (n === 1) {
   var v = vars();
   if (!v.name) { showErr(1, C('err_name')); var nm = $('#name'); nm && nm.focus(); return; }
   var he = handleError(); if (he) { showErr(1, he); var hh = $('#handle'); hh && hh.focus(); return; }
   clearErr(1); go(2, 1);
  } else if (n === 2) {
   var s = $('#starterpronouns'); if (s && !s.value) { showErr(2, C('err_pronouns')); return; }
   clearErr(2); go(3, 1);
  }
 }

 function go(step, dir){
  var root = $('.onboard.u9on'); if (!root) return;
  ui.step = step; root.dataset.u9step = String(step);
  root.classList.toggle('u9fwd', dir >= 0); root.classList.toggle('u9rev', dir < 0);
  var pw = $('.u9progwrap', root); if (pw && step) pw.innerHTML = progress(step);
  root.querySelectorAll('.u9pane').forEach(function(p){ var on = Number(p.dataset.u9pane) === step; p.classList.toggle('on', on); p.setAttribute('aria-hidden', on ? 'false' : 'true'); if (on && dir) { p.classList.remove('u9in'); void p.offsetWidth; p.classList.add('u9in'); } });
  try { window.scrollTo(0, 0); } catch (e) {}
 }

 /* Final gate: the handle validator runs again before the core #enter handler saves. */
 document.addEventListener('click', function(e){
  var t = e.target && e.target.closest && e.target.closest('#enter'); if (!t || !$('.onboard.u9on')) return;
  var v = vars();
  if (!v.name) { e.stopImmediatePropagation(); e.preventDefault(); go(1, -1); showErr(1, C('err_name')); return; }
  var he = handleError(); if (he) { e.stopImmediatePropagation(); e.preventDefault(); go(1, -1); showErr(1, he); return; }
  var s = $('#starterpronouns'); if (s && !s.value) { e.stopImmediatePropagation(); e.preventDefault(); go(2, -1); showErr(2, C('err_pronouns')); return; }
 }, true);

 /* STEP 4: the game's own starter picker (#scene-cinematic148), restyled as story-ring cards. */
 function friendVibe(id){ return (copyObj()['friend_' + id] && String(copyObj()['friend_' + id]).trim()) ? sub(copyObj()['friend_' + id], vars()) : ''; }
 function decoratePicker(cin){
  var list = $('#sceneStarterList148', cin), card = $('.scene-card148', cin);
  if (list && card) {
   if (!cin.classList.contains('u9pick')) {
    cin.classList.add('u9pick', 'u9cin'); card.insertAdjacentHTML('afterbegin', aurora()); 
    var pg = $('.scene-progress148', card); if (pg) { pg.insertAdjacentHTML('beforebegin', '<div class="u9progwrap">' + progress(4) + '</div>'); pg.classList.add('u9hide'); }
    new MutationObserver(function(){ decorateList(list); }).observe(list, { childList: true });
    list.addEventListener('pointerdown', function(e){ var b = e.target.closest('[data-starter148]'); if (!b) return; list.querySelectorAll('.u9sel').forEach(function(x){ x.classList.remove('u9sel'); }); b.classList.add('u9sel'); });
   }
   decorateList(list);
  } else if (card && $('.scene-dmmini148', card) && !cin.classList.contains('u9cin') && (function(){ try { return state.firstSession148.stage === 1; } catch (e) { return false; } })()) {
   cin.classList.add('u9chosen', 'u9cin'); card.insertAdjacentHTML('afterbegin', aurora());
  }
 }
 function decorateList(list){
  list.querySelectorAll('[data-starter148]').forEach(function(b){
   if (b.querySelector('.u9vibe')) return;
   var line = friendVibe(b.dataset.starter148); if (!line) return;
   var meta = b.querySelector('.scene-frmeta148'); var s = document.createElement('small'); s.className = 'u9vibe'; s.textContent = line;
   (meta ? meta.parentNode : b).appendChild(s); b.classList.add('u9hasvibe');
  });
 }

 function scan(){
  var ob = document.querySelector('#app > .onboard');
  if (ob && !ob.classList.contains('u9on')) { try { enhance(ob); } catch (e) { console.warn('uiux9 onboarding enhance skipped', e); } }
  if (!ob && html.classList.contains('u9-onboarding')) { html.classList.remove('u9-onboarding'); ui.step = 0; ui.started = false; }
  var cin = document.getElementById('scene-cinematic148'); if (cin) { try { decoratePicker(cin); } catch (e) {} }
 }
 var queued = false;
 function q(){ if (queued) return; queued = true; requestAnimationFrame(function(){ queued = false; scan(); }); }
 function start(){
  var app = document.getElementById('app');
  if (app) new MutationObserver(q).observe(app, { childList: true });
  new MutationObserver(q).observe(document.body, { childList: true });
  scan();
 }
 if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
 window.SCENE_UIUX9 = { version: 1, go: go, get step(){ return ui.step; } };
})();
