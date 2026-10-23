/* SCENE hf301-dmreply (S1 hotfix a, 2026-10-17): stop dmchoices251 overwriting character-engine DM replies.
   Bug (audit F3): dmchoices251 watchReply() replaces the FIRST celeb message that arrives within 30 s of a chip pick with the
   chip's shared stock reply (o.re) - even when Kim's/Britney's/Kylie's own engines (charbrain235, Kim character pack,
   eventchain231, story228) produced it, and even when it answers the player's NEXT typed message.
   Fix: dmchoices251 calls save() right after it overwrites (m.dmc251='repaired', original kept in m.dmc251orig) and before it
   re-renders the thread. This patch wraps save() (outermost, loaded after the save throttle) and, synchronously, restores the
   original text when (1) the reply came from any named engine / access gate (rendererSource, kind, charbrain235, logic226), or
   (2) the reply does not answer the chip message itself (reply to a later message). The authored chip reply is kept only for a
   plain generic reply to the chip message (the case dmchoices251 was built for). Restored messages get m.hf301='engine'|'later'
   and m.dmc251='hf301-restored'; m.dmc251orig is kept. No new save keys; save-compatible both ways.
   Kill switch: window.SCENE_HF_DMREPLY_OFF=true (or SCENE_HOTFIX301_OFF=true) - checked on every save. */
(()=>{'use strict';
if(window.SCENE_HF301_DMREPLY)return;
const OFF=()=>window.SCENE_HF_DMREPLY_OFF===true||window.SCENE_HOTFIX301_OFF===true;
const READY=()=>{try{return typeof state!=='undefined'&&typeof save==='function'&&typeof render==='function'&&typeof remember==='function'&&typeof addNotif==='function'&&[...document.scripts].some(x=>/scene-stories-v229\.js/.test(x.src))}catch{return false}};
const whenReady=(fn,delay)=>{const go=()=>setTimeout(()=>{try{fn()}catch(e){console.warn('hf301',e)}},delay);if(READY())return go();/* one shared boot poll for all hf301 files */const Q=window.__HF301Q=window.__HF301Q||[];Q.push(go);if(Q.length===1){const t=setInterval(()=>{if(READY()){clearInterval(t);for(const g of Q.splice(0))g()}},250)}};
const S=()=>{try{return state}catch{return null}};
const CHIP=new Map();/* dm id -> {text, at} of the last chip the player picked (in-memory only) */
const stats={chips:0,checked:0,keptAuthored:0,restoredEngine:0,restoredLater:0};
document.addEventListener('click',e=>{try{const b=e.target&&e.target.closest&&e.target.closest('#dmc251 [data-dmc]');if(!b)return;const box=document.getElementById('dmc251'),id=document.getElementById('modal')?.dataset?.dm;
  const o=box&&box.__set&&box.__set.items&&box.__set.items[+b.dataset.dmc];if(id&&o){CHIP.set(id,{text:String(o.text||'').trim(),at:Date.now()});stats.chips++}}catch{}},true);
const engineMade=m=>Boolean(m.rendererSource||m.kind||m.charbrain235||m.logic226||m.ec231||m.sceneDecision200);
function check(){if(OFF()||!CHIP.size)return 0;const s=S();if(!s?.dms)return 0;let fixed=0;const t=Date.now();
  for(const [id,c] of CHIP){if(t-c.at>40000){CHIP.delete(id);continue}const d=s.dms.find(x=>x.id===id);if(!d)continue;const ms=d.messages||[];
    for(let i=Math.max(0,ms.length-8);i<ms.length;i++){const m=ms[i];if(!m||m.from!=='them'||m.dmc251!=='repaired'||m.hf301)continue;stats.checked++;
      let me=null;if(m.replyTo)me=ms.find(x=>x&&x.from==='me'&&x.mid===m.replyTo);if(!me){for(let j=i-1;j>=0;j--)if(ms[j]?.from==='me'){me=ms[j];break}}
      const later=!me||String(me.text||'').trim()!==c.text,eng=engineMade(m);
      if((eng||later)&&typeof m.dmc251orig==='string'&&m.dmc251orig){m.text=m.dmc251orig;m.hf301=eng?'engine':'later';m.dmc251='hf301-restored';fixed++;eng?stats.restoredEngine++:stats.restoredLater++}
      else{m.hf301='kept';stats.keptAuthored++}}}
  return fixed}
function wrap(){if(typeof save!=='function'||save.__hf301dm)return false;const base=save;save=function(){try{if(check()){/* thread is re-rendered by dmchoices251 right after this save */}}catch(e){}return base.apply(this,arguments)};save.__hf301dm=1;return true}
whenReady(wrap,1600);
window.SCENE_HF301_DMREPLY={v:301,stats:()=>({...stats}),check};
})();
