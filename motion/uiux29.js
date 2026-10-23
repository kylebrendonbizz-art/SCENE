/* uiux29 · calm Career + honest "Your move" (presentation only; never writes state, money or saves)
   1 Calm Career: html.u29career while state.tab === 'world' -> CSS de-clutter (spacing over borders, one quiet glass level,
     Logic's cm247 map block tucked to a slim strip, sections keep their order: Next up / Bookings / Your story).
   2 Your move gate (fallback; when Logic yourmove249 is active it owns suppression + naming and uiux29 only adds post context + Not now). The story brain (story-brain-v169) queues a 'career' beat "Turn this post into a real-world move" after every
     player post that has no event, and 'compose'/'career' beats from other memories; v148 shows the current one as the
     .scene-nextmove148 strip (feed + Career) and uiux10 as the Career "Next up" hero. For career/compose beats only:
       real  = beat.fact.subject is set AND beat.fact.sourceId resolves to a memory (and, for "Turn this post…", that memory's
               postId resolves to a post in state.posts). Shown with ONE objective line (the beat's own sub), the post it is
               about ("Your post · “…”") and a "Not now" dismiss.
       empty = anything else -> the strip / hero is hidden (the beat itself is untouched; it resolves as before).
     Not now: hides that beat id for this browser session (sessionStorage 'u29.dismissed'; nothing in the save).
     dm / event / reaction / day-one beats already name a person or event and are left as they are.
   Kill switch: window.SCENE_UIUX29_OFF = true. */
(function(){
 if (window.SCENE_UIUX29 || window.SCENE_UIUX29_OFF === true) return;
 var H = document.documentElement, stats = { real: 0, hidden: 0, dismissed: 0 };
 var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'motion/uiux29.css?v=uiux29-1'; document.head.appendChild(l);
 H.classList.add('u29');
 var esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]; }); };
 var clip = function(t, n){ t = String(t || '').replace(/\s+/g, ' ').trim(); return t.length > n ? t.slice(0, n - 1).trim() + '\u2026' : t; };
 function S(){ try { return typeof state !== 'undefined' ? state : null; } catch (e) { return null; } }
 var DK = 'u29.dismissed';
 function dismissed(){ try { return JSON.parse(sessionStorage.getItem(DK) || '[]'); } catch (e) { return []; } }
 function dismiss(id){ var d = dismissed(); if (d.indexOf(id) < 0) d.push(id); try { sessionStorage.setItem(DK, JSON.stringify(d.slice(-40))); } catch (e) {} stats.dismissed++; }
 /* verdict for a story169 action id ('story169:<beatId>') */
 function verdict(action){
  var m = /^story169:(.+)$/.exec(String(action || '')); if (!m) return null;
  var q = []; try { q = (window.SCENE_STORY169 && SCENE_STORY169.inspect().queue) || []; } catch (e) {}
  var b = null; for (var i = 0; i < q.length; i++) if (q[i] && q[i].id === m[1]) { b = q[i]; break; }
  if (!b || (b.type !== 'career' && b.type !== 'compose')) return null;
  var s = S(), f = b.fact || {}, mem = null, post = null;
  if (f.sourceId && s && s.memory) for (var j = 0; j < s.memory.length; j++) if (s.memory[j].id === f.sourceId) { mem = s.memory[j]; break; }
  if (mem && mem.postId && s.posts) for (var k = 0; k < s.posts.length; k++) if (s.posts[k].id === mem.postId) { post = s.posts[k]; break; }
  /* Logic yourmove249 on HEAD already drops/renames vague career/compose beats inside SCENE_STORY169.objective(); when it is active,
     what reaches the screen is concrete by Logic's rules -> uiux29 only adds the post context + Not now and never rewrites its copy. */
  var LOGIC = !!(window.SCENE_YOURMOVE && window.SCENE_YOURMOVE_OFF !== true);
  if (LOGIC) return { id: b.id, real: dismissed().indexOf(b.id) < 0, objective: '', post: post && post.text ? clip(post.text, 70) : '', why: dismissed().indexOf(b.id) >= 0 ? 'dismissed' : 'logic' };
  var needsPost = /this post/i.test(b.title || '');
  var real = !!(f.subject && mem && (!needsPost || (post && post.text)));
  /* when the subject IS the post text, the beat's sub just repeats the post; use story-brain careerBeat()'s own subject-less line instead */
  var obj = b.sub || ''; if (post && post.text && f.subject && String(post.text).indexOf(String(f.subject).replace(/\u2026$/, '').slice(0, 24)) === 0) obj = b.type === 'career' ? 'Choose the next booking that moves this story forward.' : obj;
  return { id: b.id, real: real && dismissed().indexOf(b.id) < 0, objective: obj, post: post && post.text ? clip(post.text, 70) : '', why: real ? (dismissed().indexOf(b.id) >= 0 ? 'dismissed' : 'real') : 'empty' };
 }
 function apply(el, v, objSel){
  el.setAttribute('data-u29', v.why); el.classList.toggle('u29-hide', !v.real);
  if (!v.real) { stats.hidden++; return; }
  if (el.__u29 === v.id) return; el.__u29 = v.id; stats.real++;
  var o = el.querySelector(objSel); if (o) { o.classList.add('u29obj'); if (v.objective) o.textContent = v.objective; }
  if (v.post && !el.querySelector('.u29ctx')) { var c = document.createElement('p'); c.className = 'u29ctx'; c.innerHTML = '<em>Your post</em> \u201c' + esc(v.post) + '\u201d'; (o || el.lastElementChild).after(c); }
  if (!el.querySelector('.u29x')) { var x = document.createElement('button'); x.type = 'button'; x.className = 'u29x'; x.textContent = 'Not now'; x.setAttribute('aria-label', 'Not now');
   x.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); dismiss(v.id); sweep(); }); el.appendChild(x); }
 }
 var q = 0;
 function sweep(){
  q = 0; if (window.SCENE_UIUX29_OFF) return; var s = S();
  H.classList.toggle('u29career', !!(s && s.tab === 'world'));
  var nm = document.querySelector('.main > .scene-nextmove148');
  if (nm) { var g = String(nm.dataset.sig || '').split('|'), v = verdict(g[3]); if (v) apply(nm, v, '.scene-movecopy148 span'); else nm.classList.remove('u29-hide'); }
  var hero = document.querySelector('.u10-hero:not(.u10-empty)'), cta = hero && hero.querySelector('[data-u10-act]');
  if (hero && cta) { var v2 = verdict(cta.getAttribute('data-u10-act')); if (v2) apply(hero, v2, 'p'); else hero.classList.remove('u29-hide'); }
 }
 new MutationObserver(function(){ if (!q) q = requestAnimationFrame(sweep); }).observe(document.body, { childList: true, subtree: true });
 setInterval(sweep, 2000);
 window.SCENE_UIUX29 = { stats: stats, verdict: verdict, sweep: sweep, undismiss: function(){ try { sessionStorage.removeItem(DK); } catch (e) {} sweep(); } };
})();
