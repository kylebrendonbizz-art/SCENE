/* SCENE notification / toast queue v228 (Gameplay Logic, presentation timing only).
   One toast on screen at a time (~2.2 s each, short gap), max 3 toasts per burst (the rest stay in the bell /
   state.notifications silently), same-meaning toasts deduped per burst (e.g. "49 people followed you" and
   "+49 new followers"), the "phone blowing up" lock screen capped to 3 rows revealed ~400 ms apart, and the
   Career reward feedback limited to ONE combined burst per outcome (the OUTCOME banner; the per-stat flying chips
   that duplicated it are dropped).
   It never touches state: addNotif/state.notifications, economy, rewards, relationships and DMs are untouched.
   API: window.SCENE_NOTIFY_QUEUE.push({text,kind}) · .config · .stats() · 'scene:toast' CustomEvent per toast shown
        (detail {kind,text,source}); reward bursts fire it with kind 'reward' so a redesigned banner can hook in.
   Kill switch: window.SCENE_NOTIFQ_OFF=true (checked on every call) restores the old behaviour. */
(()=>{
'use strict';
if(window.SCENE_NOTIFY_QUEUE)return;
const CFG={toastMs:2200,gapMs:350,maxPerBurst:3,burstIdleMs:1500,lockMaxRows:3,lockGapMs:400,chips:'banner'/* 'banner' = banner only when it shows; 'all' = old */};
const off=()=>window.SCENE_NOTIFQ_OFF===true;
const now=()=>performance.now(),q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
const st={shown:0,deduped:0,silenced:0,lockCut:0,chipsDropped:0,maxQueue:0};
const queue=[];let burst={start:0,shown:0,keys:new Set()},lastEnd=0,busyWas=false,current=null;

/* meaning key: follower gains collapse to one key per amount; everything else by normalised text */
function meaning(text,k=''){
  const t=String(text||'').toLowerCase().replace(/\s+/g,' ').trim(),kk=String(k||'').toLowerCase();
  if(/follow/.test(t)||/follow/.test(kk)){const n=(t.match(/[\d][\d,.]*\s*[km]?/)||[''])[0].replace(/[,\s]/g,'');if(n)return 'followers:'+n}
  return kk+'|'+t.replace(/[^\p{L}\p{N} ]/gu,'');
}
function emit(kind,text,source){try{dispatchEvent(new CustomEvent('scene:toast',{detail:{kind,text:String(text||''),source}}))}catch{}}

/* ---- lane ---- */
function vis(e){return !!(e&&e.isConnected&&e.getClientRects().length)}
function flashVisible(){const t=document.getElementById('toast');return !!(t&&!t.classList.contains('hidden')&&(t.textContent||'').trim())}
function bannerOn(){const b=document.getElementById('mo-banner');return !!(b&&b.style.opacity==='1')}
function laneBusy(){return flashVisible()||bannerOn()||qa('.scene-chapter148,.scene-scoretoast157,.mo-pap,.mo-notifs').some(vis)}
function newBurstIfIdle(){if(!queue.length&&!laneBusy()&&now()-lastEnd>CFG.burstIdleMs&&now()-burst.start>CFG.burstIdleMs)burst={start:now(),shown:0,keys:new Set()}}
/* accept or drop an item for the current burst */
function admit(item){
  newBurstIfIdle();
  const key=item.key||meaning(item.text,item.kind);
  if(burst.keys.has(key)||queue.some(x=>x.key===key)){st.deduped++;return false}
  burst.keys.add(key);item.key=key;
  if(burst.shown+queue.length>=CFG.maxPerBurst){st.silenced++;return false} // stays in the bell / notifications list
  item.at=now();queue.push(item);st.maxQueue=Math.max(st.maxQueue,queue.length);pump();return true;
}
let pumpT=0;
function pump(){
  clearTimeout(pumpT);
  const busy=laneBusy();if(busyWas&&!busy)lastEnd=now();busyWas=busy;
  if(off()){while(queue.length)run(queue.shift());return}
  if(queue.length&&!busy&&now()-lastEnd>=CFG.gapMs){run(queue.shift());busyWas=true}
  if(queue.length)pumpT=setTimeout(pump,100);
}
function run(item){burst.shown++;st.shown++;current=item;try{item.run()}catch(e){console.warn('notifq',e)}emit(item.kind||'toast',item.text,item.source||'queue')}

/* ---- 1. game toast: flash(text) ---- */
function baseOf(f){let b=f;while(b&&b.__base)b=b.__base;return b}
let innerFlash=null,passing=false;
const copyFlags=(from,to)=>{for(const k of Object.keys(from))if(/^__/.test(k)&&k!=='__base'&&!(k in to))to[k]=from[k]}; // other wrappers (uiux2) see their own marker and don't re-wrap
function showFlash(text,self,args){
  passing=true;try{innerFlash.apply(self,args)}finally{passing=false}
  const base=baseOf(innerFlash),t=document.getElementById('toast');
  if(base&&t&&!off()){clearTimeout(base.t);base.t=setTimeout(()=>t.classList.add('hidden'),CFG.toastMs)}
}
function wrapFlash(){
  const f=window.flash;if(typeof f!=='function'||f.__nq)return;innerFlash=f;
  const w=function(text){
    if(off()||passing)return f.apply(this,arguments);
    const self=this,args=arguments;admit({kind:'flash',text:String(text),source:'flash',run:()=>showFlash(text,self,args)});
  };
  w.__nq=true;w.__base=f;copyFlags(f,w);window.flash=w;try{flash=w}catch{}
}

/* ---- 2. lock screen + notif stacks (motion sceneFX._int.notifStack, read at call time by motion3) ---- */
function wrapStack(){
  const I=window.sceneFX?._int;if(!I||typeof I.notifStack!=='function'||I.notifStack.__nq)return;
  const b=I.notifStack;
  const w=function(items,o){
    if(off()||passing||!Array.isArray(items))return b.apply(this,arguments);
    o={...(o||{})};const seen=new Set(),out=[];
    for(const it of items){const k=meaning(it&&it.t,it&&it.k);if(seen.has(k)){st.deduped++;continue}seen.add(k);out.push(it)}
    const cap=CFG.lockMaxRows;if(out.length>cap)st.lockCut+=out.length-cap;
    o.max=Math.min(Number(o.max)||4,cap);o.gap=Math.max(Number(o.gap)||0,CFG.lockGapMs);
    if(o.lock)burst={start:now(),shown:CFG.maxPerBurst,keys:new Set(out.map(it=>meaning(it.t,it.k)))}; // the lock screen IS this burst: queued toasts with the same news wait/dedupe
    emit(o.lock?'lock':'stack',out.slice(0,cap).map(it=>it.k+': '+it.t).join(' · '),'notifStack');
    passing=true;try{return b.call(this,out.slice(0,cap),o)}finally{passing=false}
  };
  w.__nq=true;w.__base=b;copyFlags(b,w);I.notifStack=w;
}

/* ---- 3. DOM toasts created inside other closures: chapter banners, score toasts, plain notif stacks ---- */
const DOM_TOASTS='.scene-chapter148,.scene-scoretoast157';
function requeue(el,why){
  const html=el.innerHTML,cls=el.className,text=(el.textContent||'').trim();el.remove();
  admit({kind:cls.includes('chapter')?'chapter':'score',text,source:why,run:()=>{const c=document.createElement('div');c.className=cls;c.dataset.nqReplay='1';c.innerHTML=html;document.body.appendChild(c);setTimeout(()=>c.remove(),CFG.toastMs+400)}});
}
function onAdded(el){
  if(off()||el.nodeType!==1)return;
  if(el.matches?.(DOM_TOASTS)&&!el.dataset.nqReplay){
    const others=qa(DOM_TOASTS).some(x=>x!==el&&vis(x));
    if(flashVisible()||bannerOn()||others||queue.length||qa('.mo-pap,.mo-notifs').some(vis)||now()-lastEnd<CFG.gapMs)requeue(el,'dom');
    else{const key=meaning(el.textContent);newBurstIfIdle();if(burst.keys.has(key)){st.deduped++;el.remove();return}burst.keys.add(key);burst.shown++;st.shown++;emit('dom',el.textContent,'dom')}
    return;
  }
  // a plain (non-lock) notif stack row: one row on screen at a time, max 3 per stack
  if(el.classList?.contains('mo-notif')){const box=el.parentElement;if(!box||box.classList.contains('mo-lock')||!box.classList.contains('mo-notifs'))return;
    const rows=[...box.querySelectorAll('.mo-notif')];if(rows.length>CFG.maxPerBurst){el.remove();st.silenced++;return}
    rows.forEach(r=>{if(r!==el)r.style.display='none'});emit('stack',el.textContent,'stack');return}
  // flying reward chips: the OUTCOME banner already shows the combined result -> drop the duplicates
  if(el.classList?.contains('mo-fly')&&CFG.chips==='banner')chipCheck();
}
let chipT=0;
function chipCheck(){cancelAnimationFrame(chipT);chipT=requestAnimationFrame(()=>{if(off()||!bannerOn())return;for(const c of qa('#mo-layer .mo-fly,.mo-layer .mo-fly')){c.remove();st.chipsDropped++}})}
let bannerWas=false;
function onBanner(){
  const on=bannerOn();if(on&&!bannerWas&&!off()){
    // one combined reward burst per outcome: banner wins, chips go, a plain toast under it steps aside
    chipCheck();const t=document.getElementById('toast');if(flashVisible())t.classList.add('hidden');
    for(const el of qa(DOM_TOASTS))if(!el.dataset.nqReplay)requeue(el,'banner');
    const b=document.getElementById('mo-banner');emit('reward',b?b.textContent:'','banner');
  }
  bannerWas=on;if(!on)pump();
}
function observe(){
  if(!document.body||observe.done)return;observe.done=true;
  new MutationObserver(recs=>{for(const r of recs){if(r.type==='attributes'){if(r.target.id==='mo-banner')onBanner();continue}
    for(const n of r.addedNodes){onAdded(n);if(n.id==='mo-banner')onBanner()}}}).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['style']});
}

window.SCENE_NOTIFY_QUEUE={version:'v228',config:CFG,
  push(item){item=typeof item==='string'?{text:item}:{...(item||{})};const text=String(item.text||'');if(!text)return false;
    const run=item.run||(()=>{if(innerFlash)showFlash(text,window,[text]);else{const t=document.getElementById('toast');if(t){t.textContent=text;t.classList.remove('hidden');setTimeout(()=>t.classList.add('hidden'),CFG.toastMs)}}});
    if(off()){run();emit(item.kind||'toast',text,'push');return true}
    return admit({kind:item.kind||'toast',text,key:item.key,source:'push',run})},
  meaning,stats:()=>({...st,queued:queue.length,burstShown:burst.shown}),pending:()=>queue.map(x=>({kind:x.kind,text:x.text}))};
(function wait(n=0){wrapFlash();wrapStack();observe();if(n<600&&(!window.flash?.__nq||!window.sceneFX?._int?.notifStack?.__nq||!observe.done))setTimeout(()=>wait(n+1),100)})();
// later wrappers (uiux2 polls too) may sit outside ours; re-wrap keeps us outermost without double wrapping
setInterval(()=>{if(window.flash&&!window.flash.__nq)wrapFlash();const I=window.sceneFX?._int;if(I&&I.notifStack&&!I.notifStack.__nq)wrapStack()},1000);
})();
