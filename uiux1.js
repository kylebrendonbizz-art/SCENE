/* SCENE uiux1 · keep the comments sheet's scroll position across re-renders.
   Root cause: app.js wraps openComments (the "185" wrapper) to restore the sheet scroll,
   but social-world-v42.js later REPLACES openComments wholesale (openComments=function…),
   so the 185 wrapper is dropped. Every openComments(id) re-render (auto-load, "New replies ·
   refresh", heart a comment, post a comment/reply) rebuilds #modal via showSheet() and the
   new .sheet starts at scrollTop 0 → jump to top.
   Fix: wrap the FINAL openComments (after every module has loaded) and, when the same post's
   thread is already open, restore the reader's position by anchoring on the first visible
   comment (falls back to the raw scrollTop). First open of a thread is untouched (top).
   Also pins the page scroll under the sheet. No core files are edited. */
(()=>{
'use strict';
const modal=()=>document.getElementById('modal');
// Anchor rows: commentHtml is overridden later (living-world) and no longer emits data-comment-id,
// so key each .commentrow by its Reply/heart button id (falls back to data-comment-id).
const keyOf=row=>{const b=row.querySelector('[data-reply-to],[data-comment-heart]');return (b&&(b.dataset.replyTo||b.dataset.commentHeart))||row.closest('[data-comment-id]')?.dataset.commentId||''};
const rows=sheet=>[...sheet.querySelectorAll('#commentlist .commentrow')];
function snapshot(sheet){
  const top=sheet.getBoundingClientRect().top;let anchor=null,key='';
  for(const row of rows(sheet)){const r=row.getBoundingClientRect();if(r.height&&r.bottom>top+1){const k=keyOf(row);if(k){anchor=row;key=k;break}}}
  return {scrollTop:sheet.scrollTop,id:key,off:anchor?anchor.getBoundingClientRect().top-top:0};
}
function restore(sheet,s){
  if(!sheet||!s)return;
  let target=s.scrollTop;
  if(s.id){const el=rows(sheet).find(r=>keyOf(r)===s.id);
    if(el)target=sheet.scrollTop+(el.getBoundingClientRect().top-sheet.getBoundingClientRect().top)-s.off;}
  target=Math.max(0,Math.min(target,sheet.scrollHeight-sheet.clientHeight));
  if(Math.abs(sheet.scrollTop-target)>1)sheet.scrollTop=target;
  return target;
}
function wrap(){
  const base=window.openComments;
  if(typeof base!=='function'||base.__uiux1)return false;
  const w=function(id){
    const m=modal(),open=m&&m.querySelector('#commentlist')?m.querySelector('.sheet'):null;
    const same=!!open&&m.dataset.uiux1Post===String(id);
    const snap=same?snapshot(open):null,winY=window.scrollY;
    const out=base.apply(this,arguments);
    try{
      const sheet=m&&m.querySelector('#commentlist')?m.querySelector('.sheet'):null;
      if(sheet){m.dataset.uiux1Post=String(id)}else if(m)delete m.dataset.uiux1Post;
      if(Math.abs(window.scrollY-winY)>2)window.scrollTo(0,winY);
      if(sheet&&snap){
        const set=restore(sheet,snap);
        // late layout (images, sentinel text, rAF work in the 185/187/189 wrappers) — re-apply once
        // per frame for two frames, but only if nobody (the user) has scrolled since.
        let last=set,n=0;const again=()=>{if(!sheet.isConnected||Math.abs(sheet.scrollTop-last)>2)return;last=restore(sheet,snap);if(++n<2)requestAnimationFrame(again)};
        requestAnimationFrame(again);
      }
    }catch(e){console.warn('uiux1',e)}
    return out;
  };
  w.__uiux1=true;w.__uiux1Base=base;
  window.openComments=w;
  try{openComments=w}catch{}
  return true;
}
function closeHook(){const m=modal();if(!m)return;new MutationObserver(()=>{if(!m.querySelector('#commentlist'))delete m.dataset.uiux1Post}).observe(m,{childList:true})}
function boot(){wrap();closeHook();setInterval(wrap,1500);window.sceneUiux1={version:1,wrapped:()=>!!(window.openComments&&window.openComments.__uiux1)}}
(function wait(n=0){
  if(typeof window.openComments==='function'&&typeof window.render==='function'&&!document.querySelector('.migrationboot')&&window.SCENE_COMMENT189!==undefined||n>600&&typeof window.openComments==='function')return setTimeout(boot,0);
  if(n<900)setTimeout(()=>wait(n+1),100);
})();
})();
