/* uiux18 · storyline presentation for Gameplay Logic's story228 chain.
   - Chapter title card (TV-episode open) when a chapter's first beat is offered — once per chapter per save
   - Career story tracker (chapter + beat pills) merged into "Next up"; thin chapter line on the Feed's Today / Next-move card
   - "Story moves on" toast when a beat is done; tabloid "BREAKING" flash + teaser when a chapter is done
   - uiux18c: a toast never shows stale (beat superseded / chapter ended / BREAKING up / waited >90 s) or over a sheet, DM or modal. Kill: SCENE_UIUX18C_OFF
   - uiux18b: the toast shows the finished beat's own ripple line (story229 keys) under "STORY", after the result card closes. Kill: SCENE_UIUX18B_OFF
   Reads only: 'scene:story-beat' events, SCENE_STORY.state(), SCENE_ROSTER_LINES.story (Writer copy). Never writes the game save;
   shown moments are recorded in localStorage 'scene-uiux18-seen'. Moments go through SCENE_NOTIFY_QUEUE, one at a time, and never
   sit on top of the level-up (uiux12), the unlock card (uiux17), modals or cinematics. Kill switch: window.SCENE_UIUX18_OFF = true.
   Copy keys (Writer can override): window.SCENE_UIUX18_COPY. */
(function(){
'use strict';
if (window.SCENE_UIUX18) return;
var OFF = function(){ return window.SCENE_UIUX18_OFF === true; };
var KEY = 'scene-uiux18-seen';
var COPY = window.SCENE_UIUX18_COPY = Object.assign({
 kicker: 'CHAPTER {n}', today: 'Today', firstUp: 'First up: {beat}', tapHint: 'Tap to continue',
 movesOn: 'STORY MOVES ON', storyTag: 'STORY', nextBeat: 'Next: {beat}', lastBeat: 'Final beat: {beat}',
 breaking: 'BREAKING', complete: '{chapter} complete', nextChapter: 'Next · Chapter {n}: {title}', theEnd: 'More chapters soon.',
 tracker: 'CHAPTER {n}', trackerCount: '{done}/{total}', feedLine: 'Chapter {n} · {title}'
}, window.SCENE_UIUX18_COPY || {});
var stats = { title: 0, toast: 0, breaking: 0, events: 0, yielded: 0, closedEarly: 0, track: 0, feed: 0, errors: 0 };
var G = function(n){ try { return Function('return typeof ' + n + '!=="undefined"?' + n + ':undefined')(); } catch (e) { return undefined; } };
var S = function(){ return G('state'); };
var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var fill = function(t, o){ return String(t).replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : m; }); };
var cap = function(s){ s = String(s || ''); return s.charAt(0).toUpperCase() + s.slice(1); };
function story(){ try { var X = window.SCENE_STORY; return X && typeof X.state === 'function' ? X.state() : null; } catch (e) { return null; } }
function wcopy(){ var R = window.SCENE_ROSTER_LINES; return R && R.story && typeof R.story === 'object' ? R.story : {}; }
function playerFirst(){ var p = (S() || {}).player || {}; return String(p.name || '').split(' ')[0] || ''; }

/* ---------- seen store (per save) ---------- */
function saveId(){ var s = S(); if (!s || !s.player) return ''; var f = s.firstSession148 || {}; return String(s.player.handle || s.player.name || '?') + '|' + String(f.startedAt || f.createdAt || s.createdAt || s.startedAt || ''); }
function readAll(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
function rec(){ var a = readAll(), r = a[saveId()] || {}; r.titles = r.titles || []; r.beats = r.beats || []; r.ends = r.ends || []; return r; }
function put(r){ var a = readAll(), id = saveId(); if (!id) return; a[id] = r; var ks = Object.keys(a); if (ks.length > 6) ks.slice(0, ks.length - 6).forEach(function(k){ delete a[k]; }); try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }
function once(list, k){ var r = rec(); if (r[list].indexOf(k) >= 0) return false; r[list].push(k); put(r); return true; }

/* ---------- events ---------- */
addEventListener('scene:story-beat', function(ev){
 var d = ev && ev.detail || {}; stats.events++; if (OFF() || !d.chapterId) return;
 if (d.status === 'done') lastDone[d.chapterId] = d.beatId;
 var st = story() || {}, idx = Number.isFinite(st.chapterIndex) && st.chapterId === d.chapterId ? st.chapterIndex : null;
 if (d.status === 'offered' && Number(d.beatIndex) === 0) {
  if (!once('titles', d.chapterId)) return;
  var b0 = (st.beats || [])[0];
  enqueue({ kind: 'title', chapterId: d.chapterId, n: idx == null ? '' : idx + 1, title: chapterTitleOf(d.chapterId, d.chapterTitle), first: b0 && b0.label || '' });
 } else if (d.status === 'done') {
  if (!once('beats', d.chapterId + '/' + d.beatId)) return;
  var last = Number(d.beatIndex) >= Number(d.beatCount) - 1;
  if (last) { if (!once('ends', d.chapterId)) return; enqueue({ kind: 'breaking', chapterId: d.chapterId, n: idx == null ? '' : idx + 1, title: chapterTitleOf(d.chapterId, d.chapterTitle) }); }
  else { var nb = (st.beats || [])[Number(d.beatIndex) + 1]; enqueue({ kind: 'toast', chapterId: d.chapterId, beatId: d.beatId, next: nb && nb.label || '', isLast: Number(d.beatIndex) + 1 === Number(d.beatCount) - 1, doneN: Number(d.beatIndex) + 1, total: Number(d.beatCount) }); }
 }
 sched();
});
/* Writer's upcoming keys: story.chapters.<id>.subtitle (or .teaser); else "First up: <first beat>" */
function teaserOf(j){ var c = wcopy().chapters, x = c && c[j.chapterId] || {}; var t = x.subtitle || x.teaser; return t ? fill(t, { player: playerFirst(), chapter: j.title }) : j.first ? fill(COPY.firstUp, { beat: j.first }) : ''; }
function chapterTitleOf(id, fallback){ var c = wcopy().chapters; return c && c[id] && c[id].title || fallback || ''; }
function headlineOf(id, title, nextTitle){
 var c = wcopy().chapters, h = c && c[id] && c[id].headline;
 if (!h) { /* the game's own end-of-chapter notification carries the (placeholder or Writer) headline: "Story · X complete. <headline>" */
  var s = S(), ns = s && s.notifications || [], pre = 'Story · ' + title + ' complete.';
  for (var i = 0; i < ns.length && i < 20; i++) { var t = String(ns[i] && ns[i].text || ''); if (t.indexOf(pre) === 0) { h = t.slice(pre.length).trim(); break; } }
 }
 return h ? fill(h, { chapter: title, next: nextTitle || '', player: playerFirst() }) : fill(COPY.complete, { chapter: title });
}

/* uiux18b: the beat's own ripple line (story229 keys, same lookup + same pick as the result card):
   story.beats.<beatId>.ripple → story.ripple → fallbacks.ripple.<beatId> → fallbacks.ripple._default; '' = old toast text. Kill: SCENE_UIUX18B_OFF */
var OFF18B = function(){ return window.SCENE_UIUX18B_OFF === true; };
function fnv(s){ var h = 2166136261; for (var c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
function rippleOf(j){
 if (OFF18B() || !j.beatId) return '';
 var X = window.SCENE_STORY228, inv = null, R0 = window.SCENE_ROSTER_LINES || {}, C = wcopy(), F = R0.fallbacks && R0.fallbacks.ripple || {};
 try { var l = X && X.state ? X.state().invites || [] : []; for (var i = l.length - 1; i >= 0; i--) if (l[i] && l[i].beat && l[i].beat.beatId === j.beatId) { inv = l[i]; break; } } catch (e) {}
 var one = function(v){ if (typeof v === 'string') return v; if (Array.isArray(v)) { v = v.filter(Boolean); return v.length ? v[fnv(inv && inv.id || j.beatId) % v.length] : ''; } return ''; };
 var t = one(C.beats && C.beats[j.beatId] && C.beats[j.beatId].ripple) || one(C.ripple) || one(F[j.beatId]) || one(F._default);
 if (!t) return '';
 var byId = G('byId'), a = null; try { a = inv && byId ? byId(inv.celebId) : null; } catch (e) {}
 var nm = String(a && a.name || '');
 return fill(t, { player: playerFirst(), first: nm.split(' ')[0], name: nm, place: inv && inv.placeText || '', when: 'today', label: inv && inv.type || '', chapter: chapterTitleOf(j.chapterId, '') })
  .replace(/\{\w+\}/g, '').replace(/\s+([,.!?])/g, '$1').replace(/\s{2,}/g, ' ').trim();
}
var CARD = '#modal .outcomeoverlay,#mo-banner[style*="opacity: 1"]';
function cardUp(){ return !OFF18B() && vis(CARD); }

/* uiux18c: stale / busy rules for the beat toast. Kill: SCENE_UIUX18C_OFF */
var OFF18C = function(){ return window.SCENE_UIUX18C_OFF === true; };
var lastDone = {}, SHEET = '#modal > *,.u11sheet,.birthdaysheet166,.chatpage,.sheet,[aria-modal="true"]';
function sheetUp(){ return !OFF18C() && vis(SHEET); }
function staleWhy(j){
 if (OFF18C() || j.kind !== 'toast') return '';
 if (!j.el && Date.now() - j.t0 > 90000) return 'late';
 if (lastDone[j.chapterId] && lastDone[j.chapterId] !== j.beatId) return 'beat';
 var st = story();
 if (st && st.chapterId) { if (st.chapterId !== j.chapterId) return 'chapter';
  var dn = (st.beats || []).filter(function(b){ return b.status === 'done'; }).pop(); if (dn && j.beatId && dn.beatId !== j.beatId) return 'beat'; }
 if (document.querySelector('.u18break') || jobs.some(function(k){ return k.kind === 'breaking'; }) || (cur && cur !== j && cur.kind === 'breaking')) return 'breaking';
 return '';
}
function drop(j, why){ stats.dropped = (stats.dropped || 0) + 1; (stats.dropWhy = stats.dropWhy || []).push(why + ':' + (j.beatId || '')); if (cur === j) clearTimeout(waitT); finish(j); }

/* ---------- queue / sequencing ---------- */
var jobs = [], cur = null, waitT = 0;
function enqueue(j){ j.t0 = Date.now(); jobs.push(j); pump(); }
var BIG = '.u12moment,.u17card,#scene-overlay157:not(.hidden),#scene-cinematic148,.scene-cinematic148,.scene-chapter148,.u14take,.mo-notifs,.u15stack,.mo-tierup,.mo-rewind,.mo-pap';
function shown(e){ if (!e.isConnected || e.classList.contains('u17yield') || e.classList.contains('out')) return false; var r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false;
 var c = getComputedStyle(e); return c.visibility !== 'hidden' && c.display !== 'none' && Number(c.opacity) > .05; }
function vis(sel){ var l = document.querySelectorAll(sel); for (var i = 0; i < l.length; i++) if (shown(l[i])) return true; return false; }
function bigWhich(){ return [].slice.call(document.querySelectorAll(BIG)).filter(shown).map(function(e){ return e.className || e.id; }).join(' '); }
var LANE = '.scene-scoretoast157,.uiux15-row,.u15row';
function busy(){
 if (vis(BIG) || vis(LANE)) return true;
 var b = document.getElementById('mo-banner'); if (b && b.style.opacity === '1') return true;
 var t = document.getElementById('toast'); if (t && !t.classList.contains('hidden') && (t.textContent || '').trim()) return true;
 var m = document.getElementById('modal'); if (m && m.firstElementChild && !m.classList.contains('hidden')) return true;
 if (document.getElementById('u9start')) return true;
 return false;
}
function pump(){
 if (cur || !jobs.length || OFF()) return;
 jobs = jobs.filter(function(k){ var w = staleWhy(k); if (w) { stats.dropped = (stats.dropped || 0) + 1; (stats.dropWhy = stats.dropWhy || []).push(w + ':' + (k.beatId || '')); } return !w; });
 if (!jobs.length) return;
 var j = cur = jobs.shift(), NQ = window.SCENE_NOTIFY_QUEUE, ok = false;
 if (NQ && typeof NQ.push === 'function' && window.SCENE_NOTIFQ_OFF !== true) {
  try { ok = NQ.push({ kind: 'story', text: 'Story · ' + j.kind + ' · ' + (j.title || j.next || ''), key: 'uiux18-' + j.kind + '-' + j.chapterId + '-' + j.t0, run: function(){ if (cur === j && !j.el) { j.viaQ = 'ran'; waitTurn(); } } }); } catch (e) { ok = false; }
  if (ok) { j.viaQ = 'queued'; setTimeout(function(){ if (cur === j && !j.el && j.viaQ === 'queued') { j.viaQ = 'timeout'; waitTurn(); } }, 9000); }
 }
 if (!ok) waitTurn();
}
function waitTurn(){
 var j = cur; if (!j || j.el) return; clearTimeout(waitT);
 if (j.kind === 'toast' && !OFF18C()) { var w = staleWhy(j); if (w) return drop(j, w);
  if (busy() || cardUp() || sheetUp()) { waitT = setTimeout(waitTurn, 220); return; }
  waitT = setTimeout(function(){ if (cur !== j || j.el || j.done) return; if (staleWhy(j) || busy() || cardUp() || sheetUp()) return waitTurn(); show(j); }, 320); return; }
 if ((busy() && Date.now() - j.t0 < 60000) || (cardUp() && Date.now() - j.t0 < 600000)) { waitT = setTimeout(waitTurn, 220); return; }
 waitT = setTimeout(function(){ if (cur !== j || j.el) return; if ((busy() && Date.now() - j.t0 < 60000) || cardUp()) return waitTurn(); show(j); }, 320);
}
function finish(j){ if (j.done) return; j.done = true; clearInterval(j.yT); clearTimeout(j.tA); clearTimeout(j.tB); clearTimeout(j.hard); var el = j.el;
 if (el) { el.classList.remove('in'); el.classList.add('out'); setTimeout(function(){ el.remove(); }, 420); }
 setTimeout(function(){ if (cur === j) cur = null; pump(); }, 700); }
/* never overlap a bigger moment: the title card bows out early, banner/toast step aside and come back */
function guard(j, mode){ j.yT = setInterval(function(){ if (!j.el || j.done) return clearInterval(j.yT); var y = vis(BIG);
 if (mode !== 'close' && !y && (vis(LANE) || cardUp())) y = true;
 if (j.kind === 'toast' && !OFF18C()) { var w = staleWhy(j) || (y && Date.now() - j.t0 > 90000 ? 'late' : ''); if (w) return drop(j, w); if (!y && sheetUp()) y = true; } /* toasts/banners: also step aside for the game's outcome toast */
 if (mode === 'close') { if (y) { stats.closedEarly++; stats.closedFor = bigWhich(); finish(j); } return; }
 if (y !== j.el.classList.contains('u18yield')) { j.el.classList.toggle('u18yield', y); if (y) { stats.yielded++; stats.yieldTo = bigWhich(); pause(j); } else arm(j); } }, 100); }

/* ---------- sound ---------- */
function swell(){ var X = window.SCENE_SFX; if (!X || !X.play) return false;
 return X.play(function(c, out, t){
  var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(600, t); lp.frequency.linearRampToValueAtTime(2400, t + 1.4); lp.connect(out);
  [220, 329.63, 440, 554.37].forEach(function(f, i){ var o = c.createOscillator(), g = c.createGain(); o.type = i % 2 ? 'triangle' : 'sine'; o.frequency.value = f; o.detune.value = (i - 1.5) * 4;
   g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.09, t + .9 + i * .05); g.gain.exponentialRampToValueAtTime(.0008, t + 3.2); o.connect(g); g.connect(lp); o.start(t); o.stop(t + 3.3); });
  var n = c.createBufferSource(), ng = c.createGain(), hp = c.createBiquadFilter(); n.buffer = X.noise(c, 'white'); hp.type = 'highpass'; hp.frequency.value = 6000;
  ng.gain.setValueAtTime(0, t + .3); ng.gain.linearRampToValueAtTime(.018, t + 1.1); ng.gain.exponentialRampToValueAtTime(.0005, t + 2.6); n.connect(hp); hp.connect(ng); ng.connect(out); n.start(t + .3); n.stop(t + 2.7);
 }, .6); }
function camera(){ var X = window.SCENE_SFX, U = window.SCENE_UIUX13; if (!X || !X.play) return false;
 if (U && typeof U.render === 'function') { try { return X.play(U.render(5), .7); } catch (e) {} }
 return X.play(function(c, out, t){ for (var i = 0; i < 4; i++) { var n = c.createBufferSource(), g = c.createGain(); n.buffer = X.noise(c, 'white'); var s = t + i * .11; g.gain.setValueAtTime(.25, s); g.gain.exponentialRampToValueAtTime(.001, s + .06); n.connect(g); g.connect(out); n.start(s); n.stop(s + .08); } }, .5); }
function blip(){ var X = window.SCENE_SFX; if (!X || !X.play) return false;
 return X.play(function(c, out, t){ [[784, 0], [1174.7, .08]].forEach(function(p){ var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = p[0]; var s = t + p[1]; g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(.08, s + .01); g.gain.exponentialRampToValueAtTime(.0008, s + .5); o.connect(g); g.connect(out); o.start(s); o.stop(s + .55); }); }, .45); }

/* ---------- moments ---------- */
function show(j){
 var el = document.createElement('div'); j.el = el; el.setAttribute('role', j.kind === 'toast' ? 'status' : 'dialog');
 if (j.kind === 'title') {
  el.className = 'u18title'; el.setAttribute('aria-label', fill(COPY.kicker, { n: j.n }) + ' ' + j.title);
  el.innerHTML = '<i class="u18bar u18top"></i><i class="u18bar u18bot"></i><i class="u18spot"></i><div class="u18panel"><small class="u18kick">' + esc(fill(COPY.kicker, { n: j.n }).trim()) + '</small>' +
   '<h1 class="u18name">' + esc(j.title) + '</h1>' + (teaserOf(j) ? '<p class="u18tease">' + esc(teaserOf(j)) + '</p>' : '') + '<span class="u18tap">' + esc(COPY.tapHint) + '</span></div>';
  stats.title++; j.sfx = swell(); j.life = 3200; guard(j, 'close');
 } else if (j.kind === 'toast') {
  j.ripple = rippleOf(j); el.className = 'u18toast' + (j.ripple ? ' u18rip' : '');
  el.innerHTML = '<small>' + esc(j.ripple ? COPY.storyTag : COPY.movesOn) + '</small><b>' + esc(j.ripple || (j.next ? fill(j.isLast ? COPY.lastBeat : COPY.nextBeat, { beat: cap(j.next) }) : '')) + '</b><span class="u18dots">' +
   Array.from({ length: j.total }, function(_, i){ return '<i class="' + (i < j.doneN ? 'on' : i === j.doneN ? 'nx' : '') + '"></i>'; }).join('') + '</span>';
  stats.toast++; if (j.ripple) stats.ripple = (stats.ripple || 0) + 1; j.sfx = blip(); j.life = j.ripple ? 3800 : 2800; guard(j, 'yield');
 } else {
  var st = story() || {}, nt = st.chapterId && st.chapterId !== j.chapterId ? st.chapterTitle : '', nn = Number.isFinite(st.chapterIndex) ? st.chapterIndex + 1 : '';
  j.headline = headlineOf(j.chapterId, j.title, nt);
  el.className = 'u18break'; el.setAttribute('aria-label', COPY.breaking + ': ' + j.headline);
  el.innerHTML = '<i class="u18flash"></i><div class="u18bpanel"><div class="u18btop"><span class="u18tag">' + esc(COPY.breaking) + '</span><small>' + esc(fill(COPY.kicker, { n: j.n }).trim()) + ' · ' + esc(j.title) + '</small></div>' +
   '<h2 class="u18head' + (j.headline.length > 130 ? ' u18long' : j.headline.length > 80 ? ' u18mid' : '') + '">' + esc(j.headline) + '</h2><p class="u18next">' + esc(nt ? fill(COPY.nextChapter, { n: nn, title: nt }) : COPY.theEnd) + '</p></div>';
  stats.breaking++; j.sfx = camera(); j.life = 5600; guard(j, 'yield');
 }
 el.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); finish(j); });
 document.body.appendChild(el);
 requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('in'); }); });
 if (j.kind === 'breaking') j.tB = setTimeout(function(){ el.classList.add('teaser'); }, 2300);
 arm(j);
 window.SCENE_UIUX18.last = { kind: j.kind, chapterId: j.chapterId, title: j.title, next: j.next, ripple: j.ripple, headline: j.headline, viaQ: j.viaQ || 'own', sfx: j.sfx };
}
function arm(j){ clearTimeout(j.tA); if (j.shownAt == null) { j.shownAt = Date.now(); j.spent = 0; j.hard = setTimeout(function(){ finish(j); }, j.life * 4 + 8000); }
 j.armedAt = Date.now(); j.tA = setTimeout(function(){ finish(j); }, Math.max(900, j.life - j.spent)); }
function pause(j){ clearTimeout(j.tA); if (j.armedAt) j.spent += Date.now() - j.armedAt; j.armedAt = 0; }

/* ---------- Career tracker + Feed line ---------- */
function pillsHtml(st){
 var nextSeen = false;
 return st.beats.map(function(b){ var cls = b.status === 'done' ? 'done' : !nextSeen ? (nextSeen = true, 'next') : 'locked';
  return '<li class="u18pill ' + cls + '" data-beat="' + esc(b.beatId) + '" data-status="' + esc(b.status) + '"><span class="u18pi" aria-hidden="true">' + (cls === 'done' ? '✓' : cls === 'next' ? '●' : '') + '</span><span class="u18pl">' + esc(cap(b.label)) + '</span></li>'; }).join('');
}
function heroAct(){ var b = document.querySelector('#uiux10 [data-sec="next"] .u10-hero .u10-cta[data-u10-act]'); var a = b && b.dataset.u10Act || ''; return /^(story228:|dm:)/.test(a) ? b : null; }
function placeTracker(st){
 var old = document.getElementById('u18track'), s = S();
 if (!st || !st.beats || !st.beats.length || !s || s.tab !== 'world') { if (old) old.remove(); return; }
 var host = document.querySelector('#uiux10 [data-sec="next"]'), anchor = host && host.querySelector('.u10-sechead');
 if (!host) { host = document.querySelector('#app .main'); anchor = null; }
 if (!host) return;
 var done = st.beats.filter(function(b){ return b.status === 'done'; }).length, hero = heroAct();
 var sig = JSON.stringify([st.chapterId, st.beats.map(function(b){ return b.status + b.label; }), !!hero]);
 var el = old;
 if (!el || el.parentElement !== host || (anchor ? el.previousElementSibling !== anchor : host.firstElementChild !== el)) { if (el) el.remove(); el = document.createElement('section'); el.id = 'u18track'; el.className = 'u18track'; if (anchor) anchor.insertAdjacentElement('afterend', el); else host.insertBefore(el, host.firstChild); el.dataset.sig = ''; }
 if (el.dataset.sig === sig) return; el.dataset.sig = sig; stats.track++;
 el.innerHTML = '<div class="u18trhead"><small>' + esc(fill(COPY.tracker, { n: st.chapterIndex + 1 })) + '</small><b>' + esc(chapterTitleOf(st.chapterId, st.chapterTitle)) + '</b><span>' + esc(fill(COPY.trackerCount, { done: done, total: st.beats.length })) + '</span></div>' +
  '<ol class="u18pills">' + pillsHtml(st) + '</ol>';
 el.classList.toggle('u18live', !!hero);
}
function placeFeed(st){
 var s = S(), old = document.querySelector('.u18line');
 var host = s && s.tab === 'feed' ? (document.querySelector('#uiux2-today') || document.querySelector('#app .main > .scene-nextmove148')) : null;
 if (!st || !st.beats || !st.beats.length || !host) { if (old) old.remove(); return; }
 var done = st.beats.filter(function(b){ return b.status === 'done'; }).length, sig = st.chapterId + ':' + done + '/' + st.beats.length;
 if (old && old.parentElement === host && old.dataset.sig === sig) return; if (old) old.remove();
 var el = document.createElement('div'); el.className = 'u18line'; el.dataset.sig = sig; stats.feed++;
 el.innerHTML = '<span>' + esc(fill(COPY.feedLine, { n: st.chapterIndex + 1, title: chapterTitleOf(st.chapterId, st.chapterTitle) })) + '</span><i><b style="width:' + Math.round(done / st.beats.length * 100) + '%"></b></i><em>' + done + '/' + st.beats.length + '</em>';
 host.appendChild(el);
}
document.addEventListener('click', function(e){
 var p = e.target.closest && e.target.closest('#u18track .u18pill.next'); if (!p || OFF()) return;
 var h = heroAct(); if (h) { e.preventDefault(); e.stopPropagation(); h.click(); } /* reuse the Next up card's own action — no new game actions */
}, true);
var raf = 0;
function sched(){ if (raf) return; raf = requestAnimationFrame(function(){ raf = 0; if (OFF()) { var a = document.getElementById('u18track'), b = document.querySelector('.u18line'); if (a) a.remove(); if (b) b.remove(); return; }
 try { var st = story(); placeTracker(st); placeFeed(st); } catch (e) { if (stats.errors++ < 5) console.warn('uiux18', e); } }); }

/* ---------- uiux5 plan pill: "Tomorrow: press day with Kim" while that story scene is already on today ----------
   story228 keeps plan.when live (bookings2 whenOf/kimPlanWhen), but a pill uiux5 already painted keeps its old label. */
function fixPlanPill(){
 var pill = document.querySelector('.u5-pill[data-kind="plan"]'); if (!pill) return;
 var b = pill.querySelector('b'); if (!b || !/^tomorrow$/i.test((b.textContent || '').trim())) return;
 var X = window.SCENE_STORY228, inv = X && X.state && X.state() && X.state().invites || [], s = S(), today = Number(s && s.sceneDay) || 0;
 var dim = pill.querySelector('.u5-dim'), txt = (dim ? dim.textContent : pill.textContent) || '', who = (txt.split('·').pop() || '').trim().toLowerCase();
 var byId = G('byId');
 var due = inv.some(function(x){ if (!x || x.status !== 'accepted' || x.rewardApplied || !(Number(x.day) <= today)) return false;
  var a = byId ? byId(x.celebId) : null, first = String(a && a.name || x.celebId).split(' ')[0].toLowerCase(); return !who || first === who; });
 if (due) { b.textContent = COPY.today; stats.pillFixed = (stats.pillFixed || 0) + 1; }
}
setInterval(function(){ if (!OFF()) try { fixPlanPill(); } catch (e) {} }, 400);

/* ---------- boot ---------- */
window.SCENE_UIUX18 = { version: 1, stats: stats, seen: rec, last: null, pending: function(){ return jobs.map(function(j){ return j.kind; }); }, current: function(){ return cur && cur.kind; } };
function boot(n){
 if (OFF()) return;
 if (!S() || !document.getElementById('app')) { if (n < 300) setTimeout(function(){ boot(n + 1); }, 100); return; }
 if (!document.getElementById('uiux18-css')) { var l = document.createElement('link'); l.id = 'uiux18-css'; l.rel = 'stylesheet'; l.href = './motion/uiux18.css?v=uiux18-1'; document.head.appendChild(l); }
 new MutationObserver(sched).observe(document.getElementById('app'), { childList: true, subtree: true });
 setInterval(sched, 2000); sched();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ boot(0); }); else boot(0);
})();
