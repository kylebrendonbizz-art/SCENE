/* SCENE hf301-storage (S1 hotfix f, 2026-10-17): cut localStorage write churn without changing what is stored.
   (1) Identical rewrites of SMALL keys (<= 8 KB) are skipped - e.g. kernel170 ensure170() rewrites 'scene-player-key-v170' with
       the same value on every call (1,053 writes in 10 min in the audit). Skipping a write of an identical value changes nothing.
   (2) 'status-used-npc-lines-v1' (the anti-repeat line memory, rewritten in full on EVERY line pick by uniqueLine/writer
       persist) is coalesced: the newest value is written at most once per 4 s, and flushed immediately on pagehide /
       visibilitychange(hidden) / beforeunload, so nothing is lost on close. In-memory USED_NPC_LINES is unchanged.
   The main save 'status-hatchable-v4' is never deferred past the current task (see (3) and hf301-savethrottle). Reads see deferred values (getItem is
   patched to return the pending value), so behaviour is identical for readers.
   Kill switch: window.SCENE_HF_STORAGE_OFF=true (or SCENE_HOTFIX301_OFF=true) - checked per write; turning it on flushes. */
(()=>{'use strict';
if(window.SCENE_HF301_STORAGE)return;
const OFF=()=>window.SCENE_HF_STORAGE_OFF===true||window.SCENE_HOTFIX301_OFF===true;
const P=Storage.prototype,baseSet=P.setItem,baseGet=P.getItem,baseRemove=P.removeItem;
const COALESCE={'status-used-npc-lines-v1':4000};const SMALL=8192;
/* (3) the full save: kernel170's save wrapper serialises and writes the whole state twice in one synchronous call (before and
   after bumping revision). Writes of this key inside the SAME task are merged into one write of the newest value at the end of
   that task (microtask) - nothing can run or unload in between, so durability is unchanged. */
const SAME_TASK={'status-hatchable-v4':1};const micro=new Map();
const pending=new Map();let timer=0;const stats={skippedIdentical:0,coalesced:0,flushed:0,sameTaskMerged:0};
function flush(){for(const [k,v] of micro){try{baseSet.call(localStorage,k,v)}catch{}}micro.clear();if(timer){clearTimeout(timer);timer=0}for(const [k,v] of pending){try{baseSet.call(localStorage,k,v);stats.flushed++}catch{}}pending.clear()}
P.setItem=function(k,v){if(this!==window.localStorage||OFF()){if(pending.size&&this===window.localStorage)flush();return baseSet.call(this,k,v)}
  k=String(k);v=String(v);
  if(COALESCE[k]){pending.set(k,v);stats.coalesced++;if(!timer)timer=setTimeout(flush,COALESCE[k]);return}
  if(SAME_TASK[k]){const had=micro.has(k);micro.set(k,v);if(had){stats.sameTaskMerged++;return}queueMicrotask(()=>{if(!micro.has(k))return;const val=micro.get(k);micro.delete(k);try{baseSet.call(localStorage,k,val)}catch{}});return}
  if(v.length<=SMALL){try{if(baseGet.call(this,k)===v){stats.skippedIdentical++;return}}catch{}}
  return baseSet.call(this,k,v)};
P.getItem=function(k){if(this===window.localStorage){k=String(k);if(micro.has(k))return micro.get(k);if(pending.has(k))return pending.get(k)}return baseGet.call(this,k)};
P.removeItem=function(k){if(this===window.localStorage){pending.delete(String(k));micro.delete(String(k))}return baseRemove.call(this,k)};
addEventListener('pagehide',flush);addEventListener('beforeunload',flush);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()});
window.SCENE_HF301_STORAGE={v:301,flush,stats:()=>({...stats,pending:pending.size})};
})();
