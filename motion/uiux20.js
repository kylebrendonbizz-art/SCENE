/* uiux20 · story230 endings + score meter + choice lean chips (Gameplay Logic story230 contract, KEYS230.md).
   Reads only: 'scene:story-ending' / 'scene:story-beat' events, SCENE_STORY.scores(), SCENE_ROSTER_LINES.story.endings (or .endings).
   1) Ending cinematic once per save (localStorage 'scene-uiux20-seen'), waits for modals / other moments to clear.
   2) Clout / loyalty / mess meter inside the uiux18 Career tracker (#u18track); hidden without SCENE_STORY.scores().
   3) Lean chips on [data-story230] choices only when a hook exposes the deltas: SCENE_STORY.leans(beatId|null) -> {choiceId:{clout,loyalty,mess}}
      or data-clout / data-loyalty / data-mess on the button. No hook -> nothing.
   Degrades to nothing when story230 is absent. Kill switch: window.SCENE_UIUX20_OFF = true. Copy overrides: window.SCENE_UIUX20_COPY. */
(function(){
'use strict';
if (window.SCENE_UIUX20) return;
var OFF = function(){ return window.SCENE_UIUX20_OFF === true; };
var KEY = 'scene-uiux20-seen';
var COPY = window.SCENE_UIUX20_COPY = Object.assign({
 kicker: 'THE ENDING', see: 'See your ending', endLine: 'Your ending: {title}', endNext: 'Your ending is next.', breaking: 'BREAKING', rival: 'RIVAL', allies: 'In your corner', noAllies: 'You did this on your own.', keep: 'Keep playing',
 clout: 'Clout', loyalty: 'Loyalty', mess: 'Mess', meter: 'YOUR STORY SO FAR',
 endings: { icon: { title: 'Icon', headline: '{player} is an icon now.' }, 'cult-favourite': { title: 'Cult favourite', headline: '{player} has the fans who never leave.' }, 'cautionary-tale': { title: 'Cautionary tale', headline: 'Everyone is talking about {player}. Not all of it is kind.' } }
}, window.SCENE_UIUX20_COPY || {});
var stats = { endings: 0, meter: 0, chips: 0, errors: 0 };
var G = function(n){ try { return Function('return typeof ' + n + '!=="undefined"?' + n + ':undefined')(); } catch (e) { return undefined; } };
var S = function(){ return G('state'); };
var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
function scores(){ try { var X = window.SCENE_STORY; return X && typeof X.scores === 'function' ? X.scores() : null; } catch (e) { return null; } }
function who(id){ try { var b = G('byId'); return id && b ? b(id) : null; } catch (e) { return null; } }
function first(a){ return String(a && a.name || '').split(' ')[0]; }
function names(ids){ var n = (ids || []).map(function(i){ return first(who(i)); }).filter(Boolean); return n.length <= 1 ? (n[0] || '') : n.slice(0, -1).join(', ') + ' and ' + n[n.length - 1]; }
function avatar(id, cls){ var a = who(id); if (!a) return ''; var av = G('av'); try { if (av) return av(a, cls); } catch (e) {} return '<span class="avatar ' + cls + '">' + esc(first(a).slice(0, 2).toUpperCase()) + '</span>'; }
function pick(v, seed){ if (Array.isArray(v)) { v = v.filter(Boolean); if (!v.length) return ''; var h = 0; for (var i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0; return v[h % v.length]; } return typeof v === 'string' ? v : ''; }
function fill(t, o){ return String(t || '').replace(/\{(\w+)\}/g, function(m, k){ return o[k] != null ? o[k] : ''; }).replace(/\s+([,.!?])/g, '$1').replace(/\s{2,}/g, ' ').trim(); }
function clean(t){ return String(t || '').replace(/\{\w+\}/g, '').replace(/\s+([,.!?;:])/g, '$1').replace(/\s{2,}/g, ' ').trim(); }
function ending(){ try { var X = window.SCENE_STORY; return X && typeof X.ending === 'function' ? X.ending() || null : null; } catch (e) { return null; } }
/* filled lines only: the scene:story-ending detail (title/headline/body), then SCENE_STORY.ending(), then uiux20 defaults ({player} only) */
function endCopy(id, d){
 var E = ending() || {}, df = COPY.endings[id] || COPY.endings['cult-favourite'], p = (S() || {}).player || {}, me = String(p.name || '').split(' ')[0];
 var one = function(k){ return clean(d && d[k]) || clean(E.endingId === id || !E.endingId ? E[k] : '') || clean(String(df[k] || '').replace('{player}', me)); };
 return { title: one('title'), body: one('body'), headline: one('headline') };
}
/* ---------- seen store (per save; same id scheme as uiux18) ---------- */
function saveId(){ var s = S(); if (!s || !s.player) return ''; var f = s.firstSession148 || {}; return String(s.player.handle || s.player.name || '?') + '|' + String(f.startedAt || f.createdAt || s.createdAt || s.startedAt || ''); }
function seen(){ try { return (JSON.parse(localStorage.getItem(KEY) || '{}') || {})[saveId()]; } catch (e) { return null; } }
function markSeen(id){ try { var a = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; a[saveId()] = { endingId: id, at: Date.now() }; var ks = Object.keys(a); if (ks.length > 6) ks.slice(0, ks.length - 6).forEach(function(k){ delete a[k]; }); localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} }

/* ---------- 1. ending cinematic ---------- */
var pending = null, waitT = 0;
var BUSY = '#modal > *,.u18title,.u18break,.u18toast,.u12moment,.u17card,#scene-cinematic148,.scene-cinematic148,.u14take,.mo-notifs,#u9start';
function shown(e){ var r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; var c = getComputedStyle(e); return c.visibility !== 'hidden' && c.display !== 'none' && Number(c.opacity) > .05; }
function busy(){ return [].some.call(document.querySelectorAll(BUSY), shown); }
function queue(d){ if (OFF() || !d || !d.endingId || !saveId() || seen() || document.querySelector('.u20end')) return; pending = d; pending.t0 = pending.t0 || Date.now(); tryShow(); }
function tryShow(){ clearTimeout(waitT); if (!pending || OFF()) return; if (busy() && Date.now() - pending.t0 < 300000) { waitT = setTimeout(tryShow, 400); return; } var d = pending; pending = null; show(d); }
function shutter(){ var X = window.SCENE_SFX, U = window.SCENE_UIUX13; if (!X || !X.play) return false;
 if (U && typeof U.render === 'function') { try { return X.play(U.render(5), .7); } catch (e) {} }
 return X.play(function(c, out, t){ for (var i = 0; i < 3; i++) { var n = c.createBufferSource(), g = c.createGain(); n.buffer = X.noise(c, 'white'); var s = t + i * .12; g.gain.setValueAtTime(.25, s); g.gain.exponentialRampToValueAtTime(.001, s + .06); n.connect(g); g.connect(out); n.start(s); n.stop(s + .08); } }, .5); }
function show(d){
 var sc = Object.assign({ clout: 0, loyalty: 0, mess: 0 }, d.scores || {}), cp = endCopy(d.endingId, d), allies = (d.allies || []).filter(function(i){ return who(i); }).slice(0, 6);
 var rival = who(d.rivalId), max = Math.max(20, sc.clout, sc.loyalty, sc.mess);
 var bar = function(k){ var v = Math.max(0, Number(sc[k]) || 0); return '<div class="u20row u20-' + k + '"><span>' + esc(COPY[k]) + '</span><i><b style="--w:' + Math.round(v / max * 100) + '%"></b></i><em data-v="' + v + '">0</em></div>'; };
 var el = document.createElement('div'); el.className = 'u20end u20-' + esc(d.endingId); el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', COPY.kicker + ': ' + cp.title);
 el.innerHTML = '<i class="u20flash"></i><i class="u20spot"></i><div class="u20card">' +
  '<small class="u20kick">' + esc(COPY.kicker) + '</small><h1 class="u20title">' + esc(cp.title) + '</h1>' +
  '<div class="u20cover"><span class="u20tag">' + esc(COPY.breaking) + '</span><h2>' + esc(cp.headline) + '</h2>' + (cp.body ? '<p>' + esc(cp.body) + '</p>' : '') + '</div>' +
  '<div class="u20bars">' + bar('clout') + bar('loyalty') + bar('mess') + '</div>' +
  (rival ? '<div class="u20rival">' + avatar(d.rivalId, 'u20av') + '<div><span class="u20rtag">' + esc(COPY.rival) + '</span><b>' + esc(rival.name) + '</b></div></div>' : '') +
  '<div class="u20allies"><small>' + esc(allies.length ? COPY.allies : COPY.noAllies) + '</small><div class="u20faces">' + allies.map(function(i){ return avatar(i, 'u20av u20sm'); }).join('') + '</div>' + (allies.length ? '<span>' + esc(names(allies)) + '</span>' : '') + '</div>' +
  '<button type="button" class="u20keep">' + esc(COPY.keep) + '</button></div>';
 document.body.appendChild(el); markSeen(d.endingId); stats.endings++; stats.last = { endingId: d.endingId, title: cp.title, headline: cp.headline, sfx: shutter() };
 requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('in'); }); });
 setTimeout(function(){ el.classList.add('bars'); [].forEach.call(el.querySelectorAll('.u20row em'), function(e){ var v = Number(e.dataset.v), t0 = performance.now(); (function step(t){ var k = Math.min(1, (t - t0) / 1100); e.textContent = Math.round(v * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(step); })(t0); }); }, 900);
 var close = function(){ el.classList.remove('in'); el.classList.add('out'); setTimeout(function(){ el.remove(); }, 450); };
 el.querySelector('.u20keep').addEventListener('click', close);
}
addEventListener('scene:story-ending', function(ev){ try { queue(ev && ev.detail); } catch (e) { stats.errors++; } });

/* ---------- 2. score meter in the uiux18 tracker ---------- */
function meterHtml(sc, inner){ var max = Math.max(20, sc.clout | 0, sc.loyalty | 0, sc.mess | 0);
 var h = ['clout', 'loyalty', 'mess'].map(function(k){ var v = Math.max(0, Number(sc[k]) || 0); return '<div class="u20m u20-' + k + '"><span>' + esc(COPY[k]) + '<em>' + v + '</em></span><i><b style="width:' + Math.round(v / max * 100) + '%"></b></i></div>'; }).join('');
 return inner ? h : '<div class="u20meter">' + h + '</div>'; }
function meter(){
 var host = document.getElementById('u18track'), old = document.querySelector('#u18track > .u20meter'), sc = OFF() ? null : scores();
 if (!host || !sc) { if (old) old.remove(); return; }
 var max = Math.max(20, sc.clout | 0, sc.loyalty | 0, sc.mess | 0), sig = [sc.clout, sc.loyalty, sc.mess, max].join(',');
 if (old && old.parentElement === host && old.dataset.sig === sig) return;
 if (old) old.remove();
 var el = document.createElement('div'); el.className = 'u20meter'; el.dataset.sig = sig; el.setAttribute('aria-label', COPY.clout + ' ' + sc.clout + ', ' + COPY.loyalty + ' ' + sc.loyalty + ', ' + COPY.mess + ' ' + sc.mess);
 el.innerHTML = meterHtml(sc, true);
 host.appendChild(el); stats.meter++;
}
/* ---------- 3. lean chips (hook only) ---------- */
function leansFor(beat){ try { var X = window.SCENE_STORY; return X && typeof X.leans === 'function' ? X.leans(beat || null) || null : null; } catch (e) { return null; } }
function chips(){
 if (OFF()) return; var bs = document.querySelectorAll('#modal .eventchoice[data-story230]:not([data-u20])'); if (!bs.length) return;
 [].forEach.call(bs, function(b){ b.setAttribute('data-u20', '1'); var hasC = b.hasAttribute('data-choice'), cid = hasC ? b.dataset.choice : b.dataset.story230, L = leansFor(hasC ? b.dataset.story230 : null);
  var d = b.hasAttribute('data-clout') ? { clout: b.dataset.clout, loyalty: b.dataset.loyalty, mess: b.dataset.mess } : (L && L[cid]) || {};
  var out = ['clout', 'loyalty', 'mess'].filter(function(k){ return Number(d[k]) > 0; }).map(function(k){ return '<i class="u20chip u20-' + k + '">+' + esc(COPY[k]) + '</i>'; }).join('');
  if (!out) return; var host = b.querySelector('span') || b; var w = document.createElement('span'); w.className = 'u20chips'; w.innerHTML = out; host.appendChild(w); stats.chips++; });
}
/* uiux18 BREAKING teaser for the final chapter said "More chapters soon." -> the ending (getter on uiux18's live copy object) */
try { var C18 = window.SCENE_UIUX18_COPY; if (C18) { var old18 = C18.theEnd; Object.defineProperty(C18, 'theEnd', { configurable: true, get: function(){ if (OFF()) return old18; var e = ending(); return e && e.title ? fill(COPY.endLine, { title: clean(e.title) }) : COPY.endNext; } }); } } catch (e) {}
function endData(){ var e = ending(), sc = scores(); if (!e || !e.endingId) return null; sc = sc || {}; return { endingId: e.endingId, scores: { clout: sc.clout, loyalty: sc.loyalty, mess: sc.mess }, rivalId: sc.rivalId, allies: sc.allies, guests: sc.guests, title: e.title, headline: e.headline, body: e.body }; }
function doneCard(){
 var old = document.getElementById('u20done'), d = OFF() ? null : endData(), s = S();
 if (!d || !s || s.tab !== 'world' || document.getElementById('u18track')) { if (old) old.remove(); return; }
 var host = document.querySelector('#uiux10 [data-sec="next"]'), anchor = host && host.querySelector('.u10-sechead'); if (!host) return;
 var cp = endCopy(d.endingId, d), sig = d.endingId + '|' + cp.title + '|' + [d.scores.clout, d.scores.loyalty, d.scores.mess].join(',');
 if (old && old.parentElement === host && old.dataset.sig === sig) return; if (old) old.remove();
 var el = document.createElement('section'); el.id = 'u20done'; el.className = 'u18track u20done'; el.dataset.sig = sig;
 el.innerHTML = '<div class="u18trhead"><small>' + esc(COPY.kicker) + '</small><b>' + esc(cp.title) + '</b></div><button type="button" class="u20see">' + esc(COPY.see) + '<span aria-hidden="true">→</span></button>';
 if (anchor) anchor.insertAdjacentElement('afterend', el); else host.prepend(el);
 el.querySelector('.u20see').addEventListener('click', function(){ var x = endData(); if (x && !document.querySelector('.u20end')) show(x); });
 var sc = scores(); if (sc) { var hold = el; var m = document.createElement('div'); hold.insertBefore(m, hold.querySelector('.u20see')); m.outerHTML = meterHtml(sc); }
}
addEventListener('scene:story-beat', function(){ setTimeout(meter, 60); });
setInterval(function(){ try { meter(); chips(); doneCard(); } catch (e) { stats.errors++; } }, 500);
/* boot: an ending that fired before this page saw it (e.g. reload mid-moment) still shows once */
setTimeout(function(){ try { var x = endData(); if (x && !seen()) { x.t0 = Date.now(); queue(x); } } catch (e) {} }, 4000);
var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = './motion/uiux20.css?v=uiux20-2'; l.id = 'uiux20-css'; document.head.appendChild(l);
window.SCENE_UIUX20 = { stats: stats, show: function(d){ show(d); }, meter: meter };
})();
