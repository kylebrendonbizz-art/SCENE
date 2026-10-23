/* SCENE uiux8: never-blank avatars + stories (offline, no network of its own).
   - Avatars: any .avatar whose picture is missing, still loading, failed (onerror / naturalWidth 0) or empty
     shows an initials monogram on a gradient hashed from the character id/name. A real picture always wins:
     the moment an <img> loads, the monogram styling is dropped again.
   - Optional real-photo map (contract in handoff CHANGES.md): window.SCENE_PHOTOS = [{id,avatar,stories[],focus}]
     or {id:{avatar,stories,focus}}; re-applied on the `scene:photos-changed` event.
   - Stories: an opened story with no (working) image gets a card built from the story caption / the
     character's latest real post in game state, else name + handle + monogram. Nothing invented.
   - unavatar.io's white "not found" logo (a 200 SVG that loads "successfully" and looks blank) is treated as
     no picture, so the monogram shows. No src is rewritten and no extra request is made.
   Reads game state only; never writes state or localStorage. Kill switch: window.SCENE_UIUX8_OFF = true. */
(function () {
  'use strict';
  if (window.SCENE_UIUX8_OFF === true || window.sceneUiux8) return;
  var CSS_V = 'uiux8-1';
  try {
    var me = document.currentScript && document.currentScript.src;
    var href = me ? me.replace(/uiux8\.js(\?.*)?$/, 'uiux8.css?v=' + CSS_V) : './motion/uiux8.css?v=' + CSS_V;
    if (!document.getElementById('uiux8-css')) {
      var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; l.id = 'uiux8-css';
      document.head.appendChild(l);
    }
  } catch (e) {}

  var G = function (name) { try { return (0, eval)('typeof ' + name + "!=='undefined'?" + name + ':undefined'); } catch (e) { return undefined; } };
  function hash(s) { s = String(s || ''); var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  // dark-premium palette pairs (deep jewel tones, readable with white initials)
  var PAL = [['#3a2a6e', '#14111f'], ['#5b2346', '#170f18'], ['#1f4a5e', '#0e141b'], ['#5a3a1c', '#17120d'],
    ['#2b4d3a', '#0f1612'], ['#4a2a63', '#1a0f22'], ['#28376e', '#0f1220'], ['#6b2a2a', '#1a0e0e'],
    ['#3d3d52', '#121218'], ['#5c4a1e', '#18140a'], ['#264f57', '#0c1517'], ['#552e5e', '#150d18']];
  function grad(key) { var p = PAL[hash(key) % PAL.length], ang = 120 + (hash(key + '~') % 60); return [p[0], p[1], ang]; }
  function initialsOf(name) {
    var n = String(name || '').replace(/[@_.]+/g, ' ').replace(/[^\p{L}\p{N} ]+/gu, '').trim();
    if (!n) return '';
    var w = n.split(/\s+/); return ((w[0] || '')[0] + (w.length > 1 ? (w[w.length - 1] || '')[0] : (w[0][1] || ''))).toUpperCase();
  }
  function accounts() { var a = G('ACCOUNTS'); return Array.isArray(a) ? a : []; }
  function byId(id) { if (!id) return null; var f = G('byId'); try { if (typeof f === 'function') return f(id) || null; } catch (e) {} return accounts().find(function (x) { return x.id === id; }) || null; }
  function byName(name) { if (!name) return null; var n = String(name).toLowerCase(); return accounts().find(function (x) { return String(x.name || '').toLowerCase() === n; }) || null; }
  function gstate() { var s = G('state'); return s && typeof s === 'object' ? s : null; }

  /* ---------- real-photo map (Gameplay Logic contract) ---------- */
  var photoMap = {};
  function readPhotos() {
    var src = window.SCENE_PHOTOS, out = {};
    try {
      if (Array.isArray(src)) src.forEach(function (e) { if (e && e.id) out[e.id] = e; });
      else if (src && typeof src === 'object') Object.keys(src).forEach(function (k) { var e = src[k]; if (e && typeof e === 'object') out[e.id || k] = e; });
    } catch (e) {}
    photoMap = out;
  }
  function okUrl(u) { u = String(u || '').trim(); return /^(data:image\/|blob:|https?:\/\/|\.{0,2}\/)/i.test(u) || /^[\w./-]+\.(png|jpe?g|webp|avif|gif|svg)(\?.*)?$/i.test(u) ? u : ''; }
  function photoFor(id) { var e = id && photoMap[id]; return e ? { avatar: okUrl(e.avatar), stories: (Array.isArray(e.stories) ? e.stories : []).map(okUrl).filter(Boolean), focus: typeof e.focus === 'string' && /^[\d.\s%a-z-]+$/i.test(e.focus) ? e.focus : '' } : null; }

  /* ---------- unavatar placeholder guard ---------- */
  // unavatar's "not found" answer is a 200 SVG logo (Chrome sizes it 150x150 since it has only a viewBox);
  // real unavatar photos are raster JPEG/PNG (400x400). Treat the logo as "no picture" without any extra request.
  function isPlaceholder(img) { var u = img.currentSrc || img.src || ''; return /^https:\/\/unavatar\.io\//i.test(u) && !/[?&]fallback=false/.test(u) && img.naturalWidth === 150 && img.naturalHeight === 150; }

  /* ---------- avatars ---------- */
  var ID_ATTRS = ['data-profile', 'data-story', 'data-dm', 'data-open-dm', 'data-notif-profile', 'data-notif-dm', 'data-celeb', 'data-id'];
  function avatarIdentity(el) {
    var name = el.getAttribute('aria-label') || '', id = el.dataset.u8id || '';
    if (!id) {
      var host = el.closest(ID_ATTRS.map(function (a) { return '[' + a + ']'; }).join(','));
      if (host) for (var i = 0; i < ID_ATTRS.length; i++) { var v = host.getAttribute(ID_ATTRS[i]); if (v && byId(v)) { var acc = byId(v); if (!name || String(acc.name).toLowerCase() === name.toLowerCase()) { id = v; break; } } }
      if (!id) { var a2 = byName(name); if (a2) id = a2.id; }
    }
    if (!name) { var img = el.querySelector('img[alt]'); name = (img && img.alt) || (id && byId(id) && byId(id).name) || ''; }
    return { id: id, name: name };
  }
  function imgOk(img) { return !!(img && img.getAttribute('src') && img.complete && img.naturalWidth > 0 && !isPlaceholder(img)); }
  function processAvatar(el) {
    if (!el.isConnected) return;
    var who = avatarIdentity(el);
    var key = who.id || who.name || el.textContent.trim() || 'scene';
    if (el.dataset.u8key !== key) {
      var g = grad(key); el.style.setProperty('--u8-a', g[0]); el.style.setProperty('--u8-b', g[1]); el.style.setProperty('--u8-ang', g[2] + 'deg'); el.dataset.u8key = key;
      if (who.id) el.dataset.u8id = who.id;
    }
    // real-photo map
    var ph = photoFor(who.id), mine = el.querySelector(':scope > img.u8-photo');
    if (ph && ph.avatar) {
      if (!mine || mine.dataset.u8src !== ph.avatar) {
        if (mine) mine.remove();
        if (el.dataset.u8failed !== ph.avatar) {
          mine = document.createElement('img'); mine.className = 'u8-photo'; mine.alt = who.name || ''; mine.decoding = 'async';
          mine.dataset.u8src = ph.avatar; if (ph.focus) mine.style.objectPosition = ph.focus;
          mine.addEventListener('error', function () { el.dataset.u8failed = ph.avatar; mine.remove(); schedule(el); });
          mine.addEventListener('load', function () { schedule(el); });
          mine.src = ph.avatar; el.appendChild(mine);
        }
      }
    } else if (mine) mine.remove();
    // initials layer must exist and be non-empty
    var txt = el.querySelector(':scope > span:not(.verified):not(.u8-ini)');
    var hasTxt = txt && txt.textContent.trim();
    var ini = el.querySelector(':scope > .u8-ini');
    if (!hasTxt) {
      var want = initialsOf(who.name) || '✦';
      if (!ini) { ini = document.createElement('span'); ini.className = 'u8-ini'; ini.setAttribute('aria-hidden', 'true'); el.insertBefore(ini, el.firstChild); }
      if (ini.textContent !== want) ini.textContent = want;
    } else if (ini) ini.remove();
    // fallback state: monogram unless some real picture actually rendered
    var imgs = el.querySelectorAll(':scope > img'), real = false;
    for (var i = 0; i < imgs.length; i++) { var ok = imgOk(imgs[i]); imgs[i].classList.toggle('u8-ok', ok); if (ok) real = true; }
    el.classList.toggle('u8-mono', !real);
  }

  /* ---------- stories ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function currentStory(screen) {
    var st = gstate(), idx = G('storyIndex'), s = st && Array.isArray(st.stories) ? st.stories[idx | 0] : null;
    var idEl = screen.querySelector('.storyidentity[data-profile]'), aid = idEl && idEl.getAttribute('data-profile');
    if (s && aid && s.authorId !== aid) s = (st.stories || []).find(function (x) { return x && x.authorId === aid; }) || null;
    return { s: s, id: aid || (s && s.authorId) || '' };
  }
  function latestPost(id) {
    var st = gstate(); if (!st || !Array.isArray(st.posts)) return null; var best = null;
    st.posts.forEach(function (p) { if (p && p.authorId === id && String(p.text || '').trim() && (!best || (p.createdAt || 0) > (best.createdAt || 0))) best = p; });
    return best;
  }
  function agoTxt(t) { var f = G('ago'); try { return typeof f === 'function' ? f(t) : ''; } catch (e) { return ''; } }
  function storyCaption(s) { var f = G('storyDisplayCaption39'); try { if (s && typeof f === 'function') return f(s) || ''; } catch (e) {} return (s && s.caption) || ''; }
  function processStory(screen) {
    if (!screen.isConnected) return;
    var cur = currentStory(screen), s = cur.s, a = byId(cur.id) || {}, sid = (s && s.id) || cur.id;
    var gameImg = screen.querySelector(':scope > img.storyimage:not(.u8-simg)');
    var card = screen.querySelector(':scope > .u8-story');
    if (card && card.dataset.sid !== sid) { card.remove(); card = null; }
    if (!card) {
      var key = cur.id || a.name || 'story', g = grad(key), ph = photoFor(cur.id), simg = '';
      if (ph && ph.stories.length) {
        var pick = ph.stories[hash(sid) % ph.stories.length];
        simg = '<img class="storyimage u8-simg" alt="" src="' + esc(pick) + '"' + (ph.focus ? ' style="object-position:' + esc(ph.focus) + '"' : '') + '>';
      }
      var cap = storyCaption(s).trim(), lp = latestPost(cur.id), lpText = lp ? String(lp.text).trim() : '';
      var main = cap || lpText, showLp = lpText && lpText !== main;
      var mono = initialsOf(a.name) || '✦';
      card = document.createElement('div'); card.className = 'u8-story'; card.dataset.sid = sid;
      card.style.setProperty('--u8-a', g[0]); card.style.setProperty('--u8-b', g[1]); card.style.setProperty('--u8-ang', g[2] + 'deg');
      card.innerHTML = '<div class="u8-scard"><div class="u8-smono" aria-hidden="true">' + esc(mono) + '</div>' +
        (main ? '<p class="u8-stext">' + esc(main) + '</p>' : '') +
        '<div class="u8-swho"><b>' + esc(a.name || '') + '</b>' + (a.handle ? '<span>@' + esc(a.handle) + '</span>' : '') + '</div>' +
        (showLp ? '<div class="u8-slatest"><small>Latest post' + (lp.createdAt ? ' · ' + esc(agoTxt(lp.createdAt)) : '') + '</small><span>' + esc(lpText.length > 140 ? lpText.slice(0, 137) + '…' : lpText) + '</span></div>' : '') +
        '</div>' + simg + '<div class="u8-sfade"></div>';
      var si = card.querySelector('.u8-simg');
      if (si) { si.addEventListener('error', function () { si.remove(); card.classList.remove('u8-hasimg'); }); si.addEventListener('load', function () { card.classList.toggle('u8-hasimg', si.naturalWidth > 0); }); }
      // card goes first so the game's own image (if any) paints above it and wins when it loads
      screen.insertBefore(card, screen.firstChild);
    }
    var gameOk = imgOk(gameImg);
    card.classList.toggle('u8-under', gameOk);
    screen.classList.toggle('u8-story-fb', !gameOk);
    if (gameImg && !gameImg.dataset.u8l) { gameImg.dataset.u8l = '1'; gameImg.addEventListener('load', function () { schedule(screen); }); gameImg.addEventListener('error', function () { setTimeout(function () { schedule(screen); }, 0); }); }
  }

  /* ---------- scheduling ---------- */
  var pending = new Set(), raf = 0, full = false;
  function schedule(el) { if (el) pending.add(el); else full = true; if (!raf) raf = requestAnimationFrame(flush); }
  function flush() {
    raf = 0; var list;
    if (full) { full = false; list = Array.prototype.slice.call(document.querySelectorAll('.avatar,.storyscreen')); pending.clear(); }
    else { list = Array.from(pending); pending.clear(); }
    for (var i = 0; i < list.length; i++) {
      var el = list[i];
      try { if (el.classList.contains('storyscreen')) processStory(el); else if (el.classList.contains('avatar')) processAvatar(el); } catch (e) { /* never break the game */ }
    }
  }
  function collect(node) {
    if (!node || node.nodeType !== 1) return;
    if (node.matches('.avatar,.storyscreen')) pending.add(node);
    var c = node.closest && node.closest('.avatar,.storyscreen'); if (c) pending.add(c);
    if (node.firstElementChild) node.querySelectorAll('.avatar,.storyscreen').forEach(function (x) { pending.add(x); });
  }
  var mo = new MutationObserver(function (recs) {
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.type === 'attributes') { collect(r.target); continue; }
      r.addedNodes.forEach(collect);
      if (r.removedNodes.length) collect(r.target);
    }
    if (pending.size && !raf) raf = requestAnimationFrame(flush);
  });
  // image load/error events don't bubble; listen in capture phase
  function onImg(e) { var t = e.target; if (t && t.tagName === 'IMG') { var c = t.closest('.avatar,.storyscreen'); if (c) schedule(c); } }
  document.addEventListener('load', onImg, true);
  document.addEventListener('error', function (e) { var t = e.target; if (t && t.tagName === 'IMG') { var c = t.closest('.avatar,.storyscreen'); if (c) setTimeout(function () { schedule(c); }, 0); } }, true);
  window.addEventListener('scene:photos-changed', function () {
    readPhotos();
    document.querySelectorAll('.storyscreen > .u8-story').forEach(function (c) { c.remove(); });
    document.querySelectorAll('.avatar[data-u8failed]').forEach(function (a) { delete a.dataset.u8failed; });
    schedule();
  });

  function start() {
    readPhotos();
    mo.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'aria-label'] });
    schedule();
  }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);

  window.sceneUiux8 = {
    version: CSS_V,
    rescan: function () { schedule(); },
    photos: function () { return Object.assign({}, photoMap); },
    count: function () {
      var n = { avatars: 0, mono: 0, real: 0, stories: 0, storyCards: 0 };
      document.querySelectorAll('.avatar').forEach(function (a) { n.avatars++; if (a.classList.contains('u8-mono')) n.mono++; else n.real++; });
      document.querySelectorAll('.storyscreen').forEach(function (s) { n.stories++; if (s.classList.contains('u8-story-fb')) n.storyCards++; });
      return n;
    }
  };
})();
