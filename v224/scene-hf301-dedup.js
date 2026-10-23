/* SCENE hf301-dedup (S1 hotfix g, 2026-10-17): outcome-level dedup for duplicated comments / news / notifications.
   Several systems (director157, kernel170, worldflow236, eventchain231, storymem238, premiumjet245, famerooms246) react to the
   same event independently, and each only dedups against itself. Until the World Director bus (S3) owns events, this patch
   enforces one global rule set on NEW outcomes only (anything that existed when the page loaded is never touched):
   (1) notifications: an identical text inside 10 minutes is merged into the earlier one (bumped + unread) instead of stacking;
       if it refers to a DIFFERENT post, the text gets the post's snippet so it no longer reads as a duplicate
       ("Kourtney Kardashian came back to your post “coffee then…”.").
   (2) a verified celeb appears at most once per player post; identical comment text never appears twice on one post
       (comments the player replied to are kept).
   (3) a world post by the same author about the same source event (sceneBeat157/sourceEventId/sourceId), or with identical text
       inside 10 minutes, is kept once.
   Runs inside save() and render() (cheap: newest 40 posts). Rewards already granted are not clawed back. No new save keys.
   Kill switch: window.SCENE_HF_DEDUP_OFF=true (or SCENE_HOTFIX301_OFF=true) - checked on every call. */
(()=>{'use strict';
if(window.SCENE_HF301_DEDUP)return;
const OFF=()=>window.SCENE_HF_DEDUP_OFF===true||window.SCENE_HOTFIX301_OFF===true;
const READY=()=>{try{return typeof state!=='undefined'&&typeof save==='function'&&typeof render==='function'&&typeof remember==='function'&&typeof addNotif==='function'&&[...document.scripts].some(x=>/scene-stories-v229\.js/.test(x.src))}catch{return false}};
const whenReady=(fn,delay)=>{const go=()=>setTimeout(()=>{try{fn()}catch(e){console.warn('hf301',e)}},delay);if(READY())return go();/* one shared boot poll for all hf301 files */const Q=window.__HF301Q=window.__HF301Q||[];Q.push(go);if(Q.length===1){const t=setInterval(()=>{if(READY()){clearInterval(t);for(const g of Q.splice(0))g()}},250)}};
const S=()=>{try{return state}catch{return null}};
const LEGACY=new WeakSet();const SEEN=new WeakMap();let seq=0;
const stats={notifMerged:0,notifDisambiguated:0,commentCelebDup:0,commentTextDup:0,worldSourceDup:0,worldTextDup:0};
function markLegacy(){const s=S();if(!s)return false;for(const p of s.posts||[]){LEGACY.add(p);for(const c of p.comments||[])LEGACY.add(c)}for(const n of s.notifications||[])LEGACY.add(n);return true}
const seen=o=>{let v=SEEN.get(o);if(v==null){v=++seq;SEEN.set(o,v)}return v};
const norm=t=>String(t||'').toLowerCase().replace(/\s+/g,' ').trim();
const playerReplied=c=>(c?.replies||[]).some(r=>r&&(r.authorId==='player'||r.fromPlayer));
function sweep(){if(OFF())return 0;const s=S();if(!s?.posts)return 0;let n=0;const posts=s.posts.slice(0,40);
  for(const p of posts){if(p?.authorId!=='player'||!Array.isArray(p.comments)||p.comments.length<2)continue;const byA=new Map(),byT=new Map(),drop=new Set();
    for(const c of p.comments){if(!c)continue;seen(c);
      if(c.verified&&c.authorId){const o=byA.get(c.authorId);if(o){const loser=pickLoser(o,c);if(loser){drop.add(loser);stats.commentCelebDup++;if(loser===o)byA.set(c.authorId,c)}}else byA.set(c.authorId,c)}
      const k=norm(c.text);if(k){const o=byT.get(k);if(o&&o!==c&&!drop.has(o)&&!drop.has(c)){const loser=pickLoser(o,c);if(loser){drop.add(loser);stats.commentTextDup++;if(loser===o)byT.set(k,c)}}else if(!o)byT.set(k,c)}}
    if(drop.size){p.comments=p.comments.filter(c=>!drop.has(c));n+=drop.size}}
  const bySrc=new Map(),byTxt=new Map(),dropP=new Set();
  for(const p of posts){if(!p||p.authorId==='player')continue;seen(p);const src=p.sceneBeat157||p.sourceEventId||p.sourceId||'';
    if(src){const k=p.authorId+'|'+src,o=bySrc.get(k);if(o){const l=pickLoser(o,p);if(l){dropP.add(l);stats.worldSourceDup++;if(l===o)bySrc.set(k,p)}}else bySrc.set(k,p)}
    const t=norm(p.text);if(t){const k=p.authorId+'|'+t,o=byTxt.get(k);if(o&&!dropP.has(o)&&!dropP.has(p)&&Math.abs((p.createdAt||0)-(o.createdAt||0))<600000){const l=pickLoser(o,p);if(l){dropP.add(l);stats.worldTextDup++}}else if(!o)byTxt.set(k,p)}}
  if(dropP.size){s.posts=s.posts.filter(p=>!dropP.has(p));n+=dropP.size}
  return n}
/* returns the duplicate to drop (the newer one), or null if both are legacy / protected */
function pickLoser(a,b){const la=LEGACY.has(a),lb=LEGACY.has(b);if(la&&lb)return null;let loser;if(la)loser=b;else if(lb)loser=a;else loser=seen(a)<=seen(b)?b:a;
  if(playerReplied(loser))return null;return loser}
function snippet(postId){const p=(S()?.posts||[]).find(x=>x.id===postId)||(S()?.playerPostArchive||[]).find(x=>x.id===postId);const t=String(p?.text||'').replace(/\s+/g,' ').trim();return t?(t.length>34?t.slice(0,32)+'…':t):''}
function wrapNotif(){if(typeof addNotif!=='function'||addNotif.__hf301dd)return;const base=addNotif;
  addNotif=function(text,kind,meta){try{if(!OFF()&&typeof text==='string'){const s=S(),t=Date.now();meta=meta||{};
      const prior=(s?.notifications||[]).find(n=>n&&n.text===text&&t-(n.at||0)<600000);
      if(prior){if(meta.postId&&prior.postId&&prior.postId!==meta.postId){const sn=snippet(meta.postId);if(sn){arguments[0]=/your post\.$/.test(text)?text.replace(/your post\.$/,`your post “${sn}”.`):`${text.replace(/\.$/,'')} (“${sn}”)`;stats.notifDisambiguated++;
            if(!prior.hf301sn){const ps=snippet(prior.postId);if(ps){prior.text=/your post\.$/.test(prior.text)?prior.text.replace(/your post\.$/,`your post “${ps}”.`):`${prior.text.replace(/\.$/,'')} (“${ps}”)`;prior.hf301sn=1}}}}
        else{prior.at=t;prior.unread=true;prior.amount=(Number(prior.amount)||1)+1;stats.notifMerged++;return prior}}}}catch(e){}
    return base.apply(this,arguments)};addNotif.__hf301dd=1}
function wrapSR(){if(typeof save==='function'&&!save.__hf301dd){const b=save;save=function(){try{sweep()}catch(e){}return b.apply(this,arguments)};save.__hf301dd=1}
  if(typeof render==='function'&&!render.__hf301dd){const r=render;render=function(){try{sweep()}catch(e){}return r.apply(this,arguments)};render.__hf301dd=1}}
const boot=()=>{if(!markLegacy())return false;wrapNotif();wrapSR();return true};
whenReady(()=>{if(!boot()){const t=setInterval(()=>{if(boot())clearInterval(t)},500)}},1300);
window.SCENE_HF301_DEDUP={v:301,sweep,stats:()=>({...stats})};
})();
