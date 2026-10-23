/* dmdash238: DM composer guard. Additive; kill switch window.SCENE_DMGUARD_OFF=true.
   Root cause: app.js render() binds `document.querySelectorAll('[data-dm]')` -> onclick=openDm(dataset.dm).
   While a DM is open, #modal itself carries data-dm, so ANY render() (ticks, feed injects, travel) arms
   #modal.onclick; the next tap inside the chat (input / Send) bubbles to #modal -> openDm() rebuilds the
   chat page -> composer empties. Guard: #modal never accepts an openDm click binder; plus a shared
   dmThreadOpen() + deferred render used by our own tick callers. */
(function(){'use strict';
const OFF=()=>window.SCENE_DMGUARD_OFF===true;
const M=()=>document.getElementById('modal');
function dmThreadOpen(){return !!M()?.dataset?.dm}
let pending=false;
/* render now unless a DM thread is open; then defer until it closes (no-op when no DM is open = old behaviour) */
function renderSafe(){if(!OFF()&&dmThreadOpen()){pending=true;return false}pending=false;try{render()}catch{}return true}
const pd=Object.getOwnPropertyDescriptor(HTMLElement.prototype,'onclick');
const TRAP=f=>typeof f==='function'&&/openDm\s*\(/.test(String(f));
function arm(){const m=M();if(!m||m.__dmguard238)return!!m;m.__dmguard238=true;
  Object.defineProperty(m,'onclick',{configurable:true,get(){return pd.get.call(this)},set(f){if(!OFF()&&TRAP(f))return;pd.set.call(this,f)}});
  try{if(TRAP(pd.get.call(m)))pd.set.call(m,null)}catch{}return true}
window.SCENE_DMGUARD={dmThreadOpen,renderSafe,pending:()=>pending,installed:()=>!!M()?.__dmguard238};
window.dmThreadOpen=dmThreadOpen;
if(!arm()){const w=setInterval(()=>{if(arm())clearInterval(w)},100)}
setInterval(()=>{if(pending&&!dmThreadOpen()){pending=false;try{if(typeof render==='function')render()}catch{}}},500);
})();
