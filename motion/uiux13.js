/* uiux13: cute paparazzi camera burst — 3–5 quick shutter clicks + a soft flash "whoosh"/pop, synthesised live with
   WebAudio (noise bursts + filtered envelopes; no audio files, no network).
   Fires whenever motion3's paparazzi flash (.mo-pap with .mo-flashbulb) appears. Presentation only.
   Mute rule = the game's own sound setting: silent when the soundtrack is off (state.music === false) or the music
   volume is 0; level follows state.musicVolume (kept modest). iOS unlock: the AudioContext is created/resumed on the
   first user gesture; before that the hook is counted but silent. Throttled to once per 2 s.
   Exposes window.SCENE_SFX (shared audio helper, reused by uiux14) and window.SCENE_UIUX13 (stats / render for QA).
   Kill switch: window.SCENE_UIUX13_OFF=true. */
(function(){
'use strict';
var S = function(){ try { return state; } catch (e) { return window.state; } };

/* ---------- shared helper: window.SCENE_SFX ---------- */
var SFX = window.SCENE_SFX;
if (!SFX) {
 var ctx = null, unlocked = false;
 var AC = window.AudioContext || window.webkitAudioContext;
 var make = function(){ if (!ctx && AC) { try { ctx = new AC({ latencyHint: 'interactive' }); } catch (e) { try { ctx = new AC(); } catch (e2) { ctx = null; } } } return ctx; };
 var unlock = function(){ var c = make(); if (!c) return; if (c.state === 'suspended') { try { c.resume(); } catch (e) {} }
  /* iOS: play one silent buffer inside the gesture */
  try { var b = c.createBuffer(1, 1, 22050), s = c.createBufferSource(); s.buffer = b; s.connect(c.destination); s.start(0); } catch (e) {}
  unlocked = true; };
 ['pointerdown', 'touchend', 'keydown', 'click'].forEach(function(t){ document.addEventListener(t, unlock, { capture: true, passive: true }); });
 var noiseCache = new WeakMap();
 SFX = {
  version: 1,
  /* the game's sound setting (app.js Sound / state.music, state.musicVolume) */
  muted: function(){ var s = S(); if (!s) return false; if (s.music === false) return true; var v = Number(s.musicVolume); return Number.isFinite(v) && v <= 0; },
  level: function(){ var s = S(), v = Number(s && s.musicVolume); if (!Number.isFinite(v)) v = .58; return Math.max(.35, Math.min(1, v)); },
  ready: function(){ return !!(ctx && ctx.state === 'running'); },
  get ctx(){ return ctx; }, get unlocked(){ return unlocked; }, unlock: unlock,
  /* white / brown noise buffers for any (Offline)AudioContext */
  noise: function(c, kind){ var m = noiseCache.get(c) || {}; if (m[kind]) return m[kind];
   var len = Math.floor(c.sampleRate * 2.5), b = c.createBuffer(1, len, c.sampleRate), d = b.getChannelData(0), last = 0, seed = 1234567;
   for (var i = 0; i < len; i++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; var w = seed / 0x3fffffff - 1; if (kind === 'brown') { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w; }
   m[kind] = b; noiseCache.set(c, m); return b; },
  /* play(renderFn): renderFn(ctx, destinationNode, startTime) builds the graph. Returns true if it sounded. */
  play: function(render, gain){ if (SFX.muted() || document.hidden) return false; var c = ctx; if (!c || c.state !== 'running') return false;
   var out = c.createGain(); out.gain.value = (gain == null ? 1 : gain) * SFX.level(); out.connect(c.destination);
   try { render(c, out, c.currentTime + .02); } catch (e) { console.warn('SCENE_SFX', e); return false; }
   setTimeout(function(){ try { out.disconnect(); } catch (e) {} }, 6000); return true; },
  /* WAV export of any render function (QA / handoff preview) */
  wav: function(render, seconds, rate){ rate = rate || 44100; var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext; var oc = new OAC(1, Math.ceil(seconds * rate), rate);
   var out = oc.createGain(); out.gain.value = 1; out.connect(oc.destination); render(oc, out, .02);
   return oc.startRendering().then(function(buf){ var d = buf.getChannelData(0), n = d.length, ab = new ArrayBuffer(44 + n * 2), v = new DataView(ab), w = function(o, s){ for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, 'RIFF'); v.setUint32(4, 36 + n * 2, true); w(8, 'WAVE'); w(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true); v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, 'data'); v.setUint32(40, n * 2, true);
    var peak = 0; for (var i = 0; i < n; i++) peak = Math.max(peak, Math.abs(d[i]));
    for (var j = 0; j < n; j++) v.setInt16(44 + j * 2, Math.max(-1, Math.min(1, d[j])) * 32767, true);
    return { bytes: new Uint8Array(ab), peak: peak, seconds: n / rate }; }); }
 };
 window.SCENE_SFX = SFX;
}
if (window.SCENE_UIUX13_OFF) return;

/* ---------- the paparazzi burst ---------- */
var THROTTLE_MS = 2000, GAIN = .32;
function env(g, t, a, peak, d){ g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + a + d); }
function click(c, out, t, pitch){
 /* two-part shutter: bright "tk" (high-passed noise) + a softer "clack" a hair later, each with a tiny tonal body */
 [[0, 3600, .9, .012], [.028, 1900, .55, .022]].forEach(function(p){
  var src = c.createBufferSource(); src.buffer = SFX.noise(c, 'white'); var hp = c.createBiquadFilter(); hp.type = 'bandpass'; hp.frequency.value = p[1] * pitch; hp.Q.value = .9;
  var g = c.createGain(); env(g, t + p[0], .0015, p[2], p[3]); src.connect(hp); hp.connect(g); g.connect(out); src.start(t + p[0], Math.random() * 2, .06); });
 var o = c.createOscillator(), og = c.createGain(); o.type = 'triangle'; o.frequency.setValueAtTime(2300 * pitch, t); o.frequency.exponentialRampToValueAtTime(1300 * pitch, t + .03);
 env(og, t, .001, .16, .035); o.connect(og); og.connect(out); o.start(t); o.stop(t + .06);
}
function whoosh(c, out, t){
 /* soft flash "fwip": band-passed noise sweeping up, plus a cute rising flash-charge ping */
 var src = c.createBufferSource(); src.buffer = SFX.noise(c, 'white'); var bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.4;
 bp.frequency.setValueAtTime(700, t); bp.frequency.exponentialRampToValueAtTime(5200, t + .22);
 var g = c.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(.22, t + .12); g.gain.exponentialRampToValueAtTime(0.0001, t + .3);
 src.connect(bp); bp.connect(g); g.connect(out); src.start(t, .3, .4);
 var o = c.createOscillator(), og = c.createGain(); o.type = 'sine'; o.frequency.setValueAtTime(1800, t + .02); o.frequency.exponentialRampToValueAtTime(4200, t + .2);
 og.gain.setValueAtTime(0.0001, t); og.gain.exponentialRampToValueAtTime(.05, t + .08); og.gain.exponentialRampToValueAtTime(0.0001, t + .24); o.connect(og); og.connect(out); o.start(t); o.stop(t + .3);
 /* little "pop" when the first bulb fires */
 var p = c.createOscillator(), pg = c.createGain(); p.type = 'sine'; p.frequency.setValueAtTime(900, t + .2); p.frequency.exponentialRampToValueAtTime(220, t + .28); env(pg, t + .2, .003, .2, .09); p.connect(pg); pg.connect(out); p.start(t + .2); p.stop(t + .34);
}
function render(n){ n = Math.max(3, Math.min(5, n || 4));
 return function(c, out, t){
  var lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 9000; lp.connect(out); /* keep it soft, never harsh */
  whoosh(c, lp, t);
  var at = t + .22; for (var i = 0; i < n; i++) { click(c, lp, at, 1 + (i % 2 ? .06 : -.03) + i * .02); at += .085 + ((i * 37) % 5) * .012; }
 }; }
var stats = { fired: 0, played: 0, muted: 0, throttled: 0, locked: 0, hidden: 0 }, last = -1e9;
function fire(n){
 if (window.SCENE_UIUX13_OFF) return false;
 stats.fired++;
 var t = Date.now(); if (t - last < THROTTLE_MS) { stats.throttled++; return false; }
 if (SFX.muted()) { stats.muted++; return false; }
 if (document.hidden) { stats.hidden++; return false; }
 if (!SFX.ready()) { stats.locked++; return false; }
 last = t; var ok = SFX.play(render(n), GAIN); if (ok) stats.played++; return ok;
}
new MutationObserver(function(ms){
 for (var i = 0; i < ms.length; i++) for (var k = 0; k < ms[i].addedNodes.length; k++) { var n = ms[i].addedNodes[k];
  if (n.nodeType === 1 && n.classList && n.classList.contains('mo-pap')) { var bulbs = n.querySelectorAll('.mo-flashbulb').length; fire(bulbs + 1); } }
}).observe(document.body || document.documentElement, { childList: true });
window.SCENE_UIUX13 = { version: 1, stats: function(){ return JSON.parse(JSON.stringify(stats)); }, fire: fire, render: render, wav: function(n){ return SFX.wav(render(n || 4), 1.1); } };
})();
