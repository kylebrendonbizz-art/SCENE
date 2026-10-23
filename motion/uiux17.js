/* uiux17 · celeb unlock moment + "Next to notice you" strip in Circle.
   Presentation only: never grants access, never writes the game save (status-hatchable-v4). Announced celebs are kept in
   localStorage 'scene-uiux17-seen' (per save). Kill switch: window.SCENE_UIUX17_OFF = true.
   Data source, in order of preference:
     1. Gameplay Logic contract — window 'scene:celeb-unlocked' {characterId,reason,fame,threshold,line} + window.SCENE_UNLOCKS.list()
     2. read-only fallback adapter — the game's own access rule (SCENE_ACCESS85.hasDirectAccess / canAccess) and its gate
        (SCENE_ACCESS85.requiredLevel vs lvl()); new unlocks found by diffing the reachable set on a 1.5 s tick.
   Copy keys (Writer can rewrite): window.SCENE_UIUX17_COPY = {heading, dm, later, strip, stripSub, more*, hint*, fallbackLine}. */
(function(){
'use strict';
if (window.SCENE_UIUX17) return;
var OFF = function(){ return window.SCENE_UIUX17_OFF === true; };
var KEY = 'scene-uiux17-seen';
/* Writer roster-lines.json → [unlockLine, ...unlockLineAlt] per celeb id (embedded: no fetch) */
var LINES = {"kim":["Kim noticed how clean your last few posts looked. She notices that kind of thing.","Kim Kardashian watched your story. Twice, apparently.","Your name came up in a SKIMS meeting. Kim asked who you were."],"ariana":["Ariana replayed your last video and sent it to her group chat.","ariana grande liked three of your posts in a row. that’s a lot."],"taylor":["Taylor read one of your captions and said it had a good last line.","Taylor Swift followed you. People are already making theories about why."],"beyonce":["Beyoncé’s team flagged your last performance. That doesn’t happen by accident.","Beyoncé watched your rehearsal clip. All of it."],"rihanna":["Rihanna commented a single emoji on your post. The comments went feral.","Rihanna screenshotted your fit. Fenty’s team is asking questions."],"miley":["Miley watched your clip and said it had real teeth. From her, that’s a compliment.","Miley Cyrus followed you after one very loud post."],"gaga":["Lady Gaga saw your post and called it brave. She means it.","Gaga’s team sent your clip around. It was described as ‘bold’."],"nicki":["Nicki Minaj quoted your caption. The Barbz have entered your comments.","Nicki noticed you. Now hold on."],"cardi":["Cardi B posted your video with ‘WHO IS THIS 😭’. Now everyone’s asking.","CARDI B FOLLOWED YOU. that’s it. that’s the news."],"kylie":["kylie saved your last post. her team noticed she saved it.","kylie jenner commented 👀 on your post. that’s the whole comment."],"kendall":["kendall liked your candid. not the posed one. the candid.","kendall jenner followed you. no comment, no caption. very her."],"khloe":["Khloé commented ‘Okay babe 👀’ on your post. The family group chat may have seen it.","Khloé Kardashian sent your post to someone. Probably her sisters."],"kourtney":["kourtney liked your calm post. she said it felt peaceful.","kourtney kardashian followed you after your slow morning story."],"kris":["Kris Jenner asked her assistant who you were. That’s how it starts.","Kris Jenner looked at your numbers. She liked what she saw."],"selena":["selena liked your post. she said it felt real.","selena gomez followed you after your honest story."],"justin":["justin liked your clip. no comment. just the like.","justin bieber followed you. people are freaking out lol"],"shawn":["shawn watched your acoustic clip. he said it felt honest.","shawn mendes followed you after a late-night post."],"hailey":["hailey liked your glowy pic. she said the lighting was right.","hailey bieber followed you. very quiet, very her."],"billie":["billie liked your weird post. not the polished one. the weird one.","billie eilish followed you. dude."],"sabrina":["Sabrina noticed your caption. Called it ‘dangerously postable’.","Sabrina Carpenter followed you. Unfortunately, it’s a big deal."],"olivia":["olivia replayed your sad post. she said the line hurt in a good way.","olivia rodrigo followed you after your 2am post."],"dua":["Dua Lipa saved your post. Then shared it with her book club.","Dua Lipa followed you. Love."],"doja":["doja commented ‘what’ on your post. apparently that’s a compliment.","doja cat followed you and then posted a picture of a lamp. could be related."],"sza":["sza liked your vulnerable post. then unliked it. then liked it again.","sza followed you and immediately overthought it."],"weeknd":["the weeknd liked your late-night post. very quiet. very deliberate.","the weeknd followed you. no comment. that’s the statement."],"drake":["Drake liked your post at 2 a.m. That’s a statement.","Drake followed you. The timeline is already making it a thing."],"bruno":["Bruno Mars watched your clip and said it had swing.","Bruno Mars followed you. Ayyyy."],"harry":["harry liked your post. people screenshotted it within seconds.","harry styles followed you. the timeline did not handle it calmly."],"badbunny":["Bad Bunny liked your post. Diablo.","Bad Bunny followed you. Jajaja, everyone’s asking why."],"jlo":["Jennifer Lopez saw your dance clip. She said the work showed.","JLo followed you. Okay, love."],"shakira":["Shakira watched your dance clip and said the rhythm was real. That’s high praise.","Shakira followed you after your dance post. Ay."],"zendaya":["zendaya liked your fitting pic. she doesn’t like many.","zendaya followed you. quietly. that’s how she does it 🤍"],"timothee":["Timothée watched your audition tape somehow. He has like twelve questions.","Timothée Chalamet followed you after your film post. Wait, okay."],"pedro":["Pedro Pascal saw your post and called you ‘kid’. Affectionately.","Pedro Pascal followed you. Oh no 😂"],"sydney":["sydney liked your post. then asked her producer who you were.","sydney sweeney followed you. that is wild."],"margot":["Margot Robbie saw your post. Okay, interesting.","Margot Robbie followed you. People are speculating."],"jenniferaniston":["Jennifer Aniston laughed at your post. Out loud, apparently.","Jennifer Aniston followed you. Very casual. Very big deal."],"britney":["Britney liked your dance video 💕 and commented ‘yesss’.","Britney Spears followed you after your dance clip 💕"],"charli":["charli liked your post at 4am. that’s the time she likes things.","charli xcx followed you. the lore matters."],"chappell":["Chappell Roan saw your post and said ‘BABE.’ That’s it. That’s the review.","Chappell Roan followed you. Okay, diva."],"tatemcrae":["tate watched your dance clip twice. she said your lines were clean.","tate mcrae followed you after your dance clip. no way."]};
var COPY = window.SCENE_UIUX17_COPY = Object.assign({
 heading: 'NEW IN YOUR ORBIT', alsoOne: '+1 more just noticed you · Circle › People', alsoMany: '+{n} more just noticed you · Circle › People', dm: 'DM them', later: 'Later', fallbackLine: '{name} just noticed you.',
 strip: 'Next to notice you', stripSubFame: 'Fame brings them closer', stripSubLevel: 'Level up to reach them',
 moreFame: '{n} more fame', moreLevel: '{n} more level', moreLevels: '{n} more levels',
 hintFame: '{name} notices you at {need} fame · {n} to go. Bookings and posts raise it.',
 hintLevel: '{name} opens up at Level {need} · {n} to go. Bookings and posts get you there.'
}, window.SCENE_UIUX17_COPY || {});
var stats = { shown: 0, queued: 0, viaQueue: 0, events: 0, diffs: 0, seeded: 0, strip: 0, errors: 0, source: '' };
var G = function(n){ try { return Function('return typeof ' + n + '!=="undefined"?' + n + ':undefined')(); } catch (e) { return undefined; } };
var S = function(){ return G('state'); };
var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
var fill = function(t, o){ return String(t).replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : m; }); };
function celebList(){ var c = G('celebs'); return Array.isArray(c) ? c : []; }
function byId(id){ var f = G('byId'); try { if (f) return f(id); } catch (e) {} return celebList().find(function(a){ return a.id === id; }) || null; }
function curLvl(){ var f = G('lvl'); try { return f ? f() : 1; } catch (e) { return 1; } }
function real(){ var U = window.SCENE_UNLOCKS; return U && typeof U.list === 'function' ? U : null; }
function reachable(a){ var A = window.SCENE_ACCESS85; try { if (A && A.hasDirectAccess) return !!A.hasDirectAccess(a); var c = G('canAccess'); return c ? !!c(a) : false; } catch (e) { return false; } }

/* ---------- adapter: [{characterId, need, have, locked, unit}] ---------- */
function list(){
 var U = real();
 if (U) { stats.source = 'SCENE_UNLOCKS'; try { return (U.list() || []).map(function(x){ return { characterId: x.characterId, need: Number(x.need) || 0, have: Number(x.have) || 0, locked: !!x.locked, unit: x.unit || 'fame' }; }); } catch (e) { stats.errors++; } }
 stats.source = 'fallback';
 var A = window.SCENE_ACCESS85, L = curLvl();
 return celebList().filter(function(a){ return a && a.type === 'celeb' && !a.custom; }).map(function(a){
  var need = 0; try { need = A && A.requiredLevel ? A.requiredLevel(a) : 0; } catch (e) {}
  return { characterId: a.id, need: need, have: L, locked: !reachable(a), unit: 'level' };
 });
}

/* ---------- seen store (separate key, per save) ---------- */
function saveId(){ var s = S(); if (!s || !s.player) return ''; var f = s.firstSession148 || {}; return String(s.player.handle || s.player.name || '?') + '|' + String(f.startedAt || f.createdAt || s.createdAt || s.startedAt || ''); }
function readSeen(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { return {}; } }
function seenFor(){ var all = readSeen(), id = saveId(); return all[id] || null; }
function writeSeen(rec){ var all = readSeen(), id = saveId(); if (!id) return; all[id] = rec; var ks = Object.keys(all); if (ks.length > 6) ks.slice(0, ks.length - 6).forEach(function(k){ delete all[k]; }); try { localStorage.setItem(KEY, JSON.stringify(all)); } catch (e) {} }
function markSeen(id){ var r = seenFor() || { seeded: true, ids: [] }; if (r.ids.indexOf(id) < 0) r.ids.push(id); writeSeen(r); }
function isSeen(id){ var r = seenFor(); return !!(r && r.ids.indexOf(id) >= 0); }

/* ---------- detection ---------- */
/* only once the starter friend is picked (onboarding done) — the starter is introduced by onboarding, never announced here */
function ready(){ var s = S(); return !!(s && s.player && saveId() && s.firstSession148 && s.firstSession148.friendId); }
var pending = [], current = null;
function announce(id, line, why){
 if (OFF() || !id || !ready() || id === S().firstSession148.friendId || isSeen(id) || current && current.id === id || pending.some(function(p){ return p.id === id; }) || batch.some(function(p){ return p.id === id; })) return false;
 var a = byId(id); if (!a) return false;
 markSeen(id); /* once per celeb per save, even if the card is dismissed with Later or the page reloads mid-queue */
 /* unlocks that land together (one fame jump can open a whole tier) become ONE card: the first celeb + "+N more" */
 batch.push({ id: id, line: line || pickLine(a), why: why || '' }); stats.queued++;
 clearTimeout(batchT); batchT = setTimeout(flush, 1200); return true;
}
var batch = [], batchT = 0;
function flush(){ if (!batch.length) return; var b = batch; batch = []; var job = b[0]; job.extra = b.length - 1; job.others = b.slice(1).map(function(x){ return x.id; }); pending.push(job); pump(); }
function pickLine(a){
 var ls = LINES[a.id]; if (!ls || !ls.length) return fill(COPY.fallbackLine, { name: a.name });
 var h = 0, s = a.id + '|' + saveId(); for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
 return ls[Math.abs(h) % ls.length];
}
function tick(){
 if (OFF()) return; var s = S(); if (!ready()) return;
 try {
  var rec = seenFor(), L = list(), open = L.filter(function(x){ return !x.locked; }).map(function(x){ return x.characterId; });
  if (!rec) { writeSeen({ seeded: true, ids: open }); stats.seeded = open.length; return; } /* first sight of this save: nothing already reachable is "new" */
  if (real()) return; /* the real event drives announcements */
  var fresh = open.filter(function(id){ return rec.ids.indexOf(id) < 0; });
  if (fresh.length) { stats.diffs++; fresh.forEach(function(id){ announce(id, '', 'diff'); }); }
 } catch (e) { if (stats.errors++ < 5) console.warn('uiux17', e); }
}
addEventListener('scene:celeb-unlocked', function(ev){ var d = ev && ev.detail || {}; stats.events++; if (OFF()) return;
 if (!seenFor()) { tick(); } /* make sure the save is seeded so this one counts as new */
 announce(d.characterId, typeof d.line === 'string' && d.line.trim() ? d.line : '', 'event:' + (d.reason || '')); });

/* ---------- sequencing: one at a time, never over the banner / level-up / toasts / modals ---------- */
function bigMoment(){ var l = document.querySelectorAll('.u12moment,#scene-overlay157:not(.hidden),#scene-cinematic148,.scene-cinematic148,.scene-chapter148,.u14take,.mo-notifs,.u15stack,.mo-tierup,.mo-rewind,.mo-pap,.mo-trend'); for (var i = 0; i < l.length; i++) if (l[i].getClientRects().length) return true; return false; }
function busy(){
 if (bigMoment()) return true;
 var b = document.getElementById('mo-banner'); if (b && b.style.opacity === '1') return true;
 var t = document.getElementById('toast'); if (t && !t.classList.contains('hidden') && (t.textContent || '').trim()) return true;
 if (document.querySelector('.u12moment,#scene-overlay157:not(.hidden),.scene-cinematic148,#scene-cinematic148,.scene-chapter148,.mo-pap,.mo-notifs,.u14take,#u9start')) {
  var el = document.querySelector('.u12moment,#scene-overlay157:not(.hidden),.scene-cinematic148,#scene-cinematic148,.scene-chapter148,.mo-pap,.mo-notifs,.u14take,#u9start');
  if (el && el.getClientRects().length) return true; }
 var m = document.getElementById('modal'); if (m && m.firstElementChild && !m.classList.contains('hidden')) return true;
 try { if (window.SCENE_NOTIFY_QUEUE && SCENE_NOTIFY_QUEUE.pending && SCENE_NOTIFY_QUEUE.pending().length) return true; } catch (e) {}
 return false;
}
var waitT = 0;
function pump(){
 if (current || !pending.length) return;
 var job = current = pending.shift(); job.t0 = Date.now();
 var NQ = window.SCENE_NOTIFY_QUEUE, ok = false;
 if (NQ && typeof NQ.push === 'function' && window.SCENE_NOTIFQ_OFF !== true) {
  var a = byId(job.id);
  try { ok = NQ.push({ kind: 'unlock', text: COPY.heading + ': ' + (a ? a.name : job.id), key: 'uiux17-' + job.id, run: function(){ if (current === job && !job.el) { job.viaQ = 'ran'; waitTurn(); } } }); } catch (e) { ok = false; }
  if (ok) { stats.viaQueue++; job.viaQ = 'queued'; setTimeout(function(){ if (current === job && !job.el && job.viaQ === 'queued') { job.viaQ = 'timeout'; waitTurn(); } }, 9000); }
 }
 if (!ok) waitTurn();
}
function waitTurn(){
 var job = current; if (!job || job.el) return;
 clearTimeout(waitT);
 if (OFF()) { current = null; return; }
 if (busy() && Date.now() - job.t0 < 25000) { waitT = setTimeout(waitTurn, 200); return; }
 waitT = setTimeout(function(){ if (current === job && !job.el) { if (busy() && Date.now() - job.t0 < 25000) return waitTurn(); show(job); } }, 280);
}

/* ---------- the card ---------- */
function chime(){
 var X = window.SCENE_SFX; if (!X || typeof X.play !== 'function') return false;
 return X.play(function(c, out, t){
  [[1046.5, 0], [1318.5, .09], [1568, .18], [2093, .30]].forEach(function(n, i){
   var o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = n[0];
   var s = t + n[1]; g.gain.setValueAtTime(0, s); g.gain.linearRampToValueAtTime(i === 3 ? .07 : .11, s + .012); g.gain.exponentialRampToValueAtTime(.0008, s + (i === 3 ? 1.4 : .9));
   o.connect(g); g.connect(out); o.start(s); o.stop(s + 1.5);
  });
 }, .55);
}
function avatar(a){ var f = G('av'); try { if (f) return f(a, 'u17av'); } catch (e) {} return '<span class="avatar u17av"><img src="' + esc(a.photo || '') + '" alt="' + esc(a.name) + '"></span>'; }
function badge(){ var f = G('check'); try { return f ? f() : ''; } catch (e) { return ''; } }
function show(job){
 var a = byId(job.id); if (!a) { current = null; return pump(); }
 var el = document.createElement('div'); el.className = 'u17card'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-label', COPY.heading + ' ' + a.name); el.dataset.celeb = a.id;
 el.innerHTML = '<div class="u17scrim" data-u17="later"></div><div class="u17panel"><div class="u17ring">' + avatar(a) + '</div>' +
  '<small class="u17kicker">' + esc(COPY.heading) + '</small><strong class="u17name">' + esc(a.name) + ' ' + badge() + '</strong>' +
  '<p class="u17line">' + esc(job.line) + '</p>' + (job.extra > 0 ? '<p class="u17also">' + esc(fill(job.extra === 1 ? COPY.alsoOne : COPY.alsoMany, { n: job.extra })) + '</p>' : '') +
  '<button class="u17dm" data-u17="dm" type="button">' + esc(COPY.dm) + '</button><button class="u17later" data-u17="later" type="button">' + esc(COPY.later) + '</button></div>';
 job.el = el; document.body.appendChild(el); stats.shown++; job.chimed = chime();
 /* if a bigger moment (level-up, cinematic, travel) arrives while we're up, step aside until it's gone — never stack */
 job.yT = setInterval(function(){ if (!el.isConnected) return clearInterval(job.yT); var y = bigMoment(); if (y !== el.classList.contains('u17yield')) { el.classList.toggle('u17yield', y); if (y) stats.yielded = (stats.yielded || 0) + 1; } }, 200);
 requestAnimationFrame(function(){ el.classList.add('in'); });
 el.addEventListener('click', function(e){ var b = e.target.closest('[data-u17]'); if (!b) return; e.preventDefault(); e.stopPropagation(); close(job, b.dataset.u17); });
 window.SCENE_UIUX17.last = { id: a.id, extra: job.extra || 0, others: job.others || [], line: job.line, why: job.why, viaQ: job.viaQ || 'own', chimed: job.chimed };
}
function close(job, how){
 if (!job.el || job.closing) return; job.closing = true; clearInterval(job.yT); var el = job.el; el.classList.remove('in'); el.classList.add('out');
 setTimeout(function(){ el.remove(); if (current === job) current = null; if (how === 'dm') { var f = G('openDm'); try { if (f) f(job.id); } catch (e) { console.warn('uiux17 dm', e); } } setTimeout(pump, 600); }, how === 'dm' ? 160 : 260);
}

/* ---------- Circle: "Next to notice you" ---------- */
function ring(p){ var r = 25, c = 2 * Math.PI * r, d = Math.max(0, Math.min(1, p)) * c;
 return '<svg class="u17prog" viewBox="0 0 56 56" aria-hidden="true"><circle cx="28" cy="28" r="' + r + '" class="u17trk"/><circle cx="28" cy="28" r="' + r + '" class="u17bar" stroke-dasharray="' + d.toFixed(1) + ' ' + c.toFixed(1) + '" transform="rotate(-90 28 28)"/></svg>'; }
function nextLocked(){
 var all = list().filter(function(x){ return x.locked && x.need > x.have && byId(x.characterId); });
 /* with Gameplay Logic's fame rule, only the core roster (Writer's roster-lines ids) is fame-gated; the rest stay level-gated */
 if (real()) { var core = all.filter(function(x){ return LINES[x.characterId]; }); if (core.length) all = core; }
 return all.map(function(x){ var a = byId(x.characterId); return { x: x, a: a, gap: x.need - x.have }; })
  .sort(function(p, q){ return p.gap - q.gap || (p.a.reach || 0) - (q.a.reach || 0) || String(p.a.name).localeCompare(q.a.name); }).slice(0, 6);
}
function more(it){ var u = it.x.unit; return fill(u === 'fame' ? COPY.moreFame : it.gap === 1 ? COPY.moreLevel : COPY.moreLevels, { n: it.gap }); }
function progress(it){ var x = it.x; if (x.unit === 'level') { var xp = Number(S().player.xp) || 0, need = (x.need - 1) * 120; return need > 0 ? xp / need : 0; } return x.need > 0 ? x.have / x.need : 0; }
var lastSig = '';
function stripHtml(items){
 var u = items[0] && items[0].x.unit;
 return '<div class="u17head"><b>' + esc(COPY.strip) + '</b><span>' + esc(u === 'fame' ? COPY.stripSubFame : COPY.stripSubLevel) + '</span></div><div class="u17row">' +
  items.map(function(it){ return '<button type="button" class="u17next" data-u17next="' + esc(it.a.id) + '" data-need="' + it.x.need + '" data-have="' + it.x.have + '" data-unit="' + it.x.unit + '" data-gap="' + it.gap + '"><span class="u17nav">' + avatar(it.a) + ring(progress(it)) + '<i>🔒</i></span><em>' + esc(String(it.a.name).split(' ')[0]) + '</em><small>' + esc(more(it)) + '</small></button>'; }).join('') + '</div>';
}
function placeStrip(){
 if (OFF()) { var o = document.getElementById('u17strip'); if (o) o.remove(); return; }
 var tabs = document.querySelector('.circlepage .circletabs'); if (!tabs) return;
 var items = nextLocked(), el = document.getElementById('u17strip');
 if (!items.length) { if (el) el.remove(); return; }
 var sig = items.map(function(it){ return it.a.id + ':' + it.gap; }).join(',') + '|' + (S().player.xp || 0);
 if (!el || el.previousElementSibling !== tabs) { if (el) el.remove(); el = document.createElement('section'); el.id = 'u17strip'; el.className = 'u17strip'; tabs.insertAdjacentElement('afterend', el); lastSig = ''; }
 if (sig !== lastSig) { el.innerHTML = stripHtml(items); lastSig = sig; stats.strip++; }
}
document.addEventListener('click', function(e){
 var b = e.target.closest && e.target.closest('[data-u17next]'); if (!b || OFF()) return; e.preventDefault(); e.stopPropagation();
 var a = byId(b.dataset.u17next); if (!a) return; var o = { name: a.name, need: b.dataset.need, n: b.dataset.gap };
 var t = fill(b.dataset.unit === 'fame' ? COPY.hintFame : COPY.hintLevel, o), f = G('flash');
 b.classList.remove('u17tap'); void b.offsetWidth; b.classList.add('u17tap');
 if (f) f(t); window.SCENE_UIUX17.lastHint = t;
}, true);
var moT = 0;
function onMut(){ if (moT) return; moT = requestAnimationFrame(function(){ moT = 0; try { placeStrip(); } catch (e) { if (stats.errors++ < 5) console.warn('uiux17 strip', e); } }); }

/* ---------- boot ---------- */
function css(){ if (document.getElementById('uiux17-css')) return; var l = document.createElement('link'); l.id = 'uiux17-css'; l.rel = 'stylesheet'; l.href = './motion/uiux17.css?v=uiux17-1'; document.head.appendChild(l); }
window.SCENE_UIUX17 = { version: 1, stats: stats, list: list, nextLocked: function(){ return nextLocked().map(function(it){ return { id: it.a.id, need: it.x.need, have: it.x.have, gap: it.gap, unit: it.x.unit }; }); }, seen: seenFor, tick: tick, announce: announce, last: null };
function boot(n){
 if (OFF()) return;
 if (!S() || !G('celebs')) { if (n < 300) setTimeout(function(){ boot(n + 1); }, 100); return; }
 css(); new MutationObserver(onMut).observe(document.body, { childList: true, subtree: true });
 setInterval(function(){ tick(); onMut(); }, 1500); setTimeout(tick, 900); onMut();
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function(){ boot(0); }); else boot(0);
})();
