/* SCENE hf301-savethrottle (S1 hotfix e, 2026-10-17): at most one full save per 500 ms.
   Every remember()/reaction/tick calls save(), and the save chain (5 wrappers; kernel170 serialises the whole state twice per
   call) wrote 'status-hatchable-v4' 360 times / ~60 MB in 10 minutes in the audit. This wraps save() OUTSIDE all existing
   wrappers: the first call runs immediately (unchanged behaviour for single actions); further calls inside the 500 ms window are
   merged into ONE trailing save at the end of the window, which serialises the latest state (so nothing is dropped - later
   state always includes earlier changes). Pending saves are flushed synchronously on pagehide / visibilitychange(hidden) /
   beforeunload. The returned value of a merged call is undefined (no caller in v52 uses save()'s return value).
   Kill switch: window.SCENE_HF_SAVE_OFF=true (or SCENE_HOTFIX301_OFF=true) - checked per call; a pending save is flushed. */
(()=>{'use strict';
if(window.SCENE_HF301_SAVE)return;
const OFF=()=>window.SCENE_HF_SAVE_OFF===true||window.SCENE_HOTFIX301_OFF===true;
const READY=()=>{try{return typeof state!=='undefined'&&typeof save==='function'&&typeof render==='function'&&typeof remember==='function'&&typeof addNotif==='function'&&[...document.scripts].some(x=>/scene-stories-v229\.js/.test(x.src))}catch{return false}};
const whenReady=(fn,delay)=>{const go=()=>setTimeout(()=>{try{fn()}catch(e){console.warn('hf301',e)}},delay);if(READY())return go();/* one shared boot poll for all hf301 files */const Q=window.__HF301Q=window.__HF301Q||[];Q.push(go);if(Q.length===1){const t=setInterval(()=>{if(READY()){clearInterval(t);for(const g of Q.splice(0))g()}},250)}};
const WIN=500;let base=null,last=0,timer=0,pend=false;const stats={calls:0,ran:0,merged:0};
function run(){pend=false;if(timer){clearTimeout(timer);timer=0}last=Date.now();stats.ran++;return base.apply(window,[])}
function flush(){if(pend){try{run()}catch(e){}}}
function wrap(){if(typeof save!=='function'||save.__hf301save)return false;base=save;
  save=function(){stats.calls++;if(OFF()){if(pend){pend=false;if(timer){clearTimeout(timer);timer=0}}last=Date.now();return base.apply(this,arguments)}
    const t=Date.now();if(!pend&&t-last>=WIN)return run();
    stats.merged++;pend=true;if(!timer)timer=setTimeout(()=>{timer=0;try{if(pend)run()}catch(e){console.warn('hf301 save',e)}},Math.max(0,WIN-(t-last)));return undefined};
  save.__hf301save=1;return true}
whenReady(wrap,1200);
addEventListener('pagehide',flush);addEventListener('beforeunload',flush);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')flush()});
window.SCENE_HF301_SAVE={v:301,flush,stats:()=>({...stats,pending:pend})};
})();
