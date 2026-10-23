/* SCENE flowfix232 (Gameplay Logic, 2026-10-09). Additive gameplay-flow patch, offline, rules-based, no AI.
   1. POPCAP   — max 3 interrupting pop-ups per game day (state.sceneDay). Tiers: must (chapter, ending, level-up,
                 event card offered, money-critical) / quiet. Quiet items may use 2 of the 3 slots, must items all 3.
                 Over budget -> held in a quiet inbox: small count badge on the existing bell (.bellbtn) + a
                 "held for later" section injected at the top of the existing Activity sheet. Player-initiated
                 feedback (within 1.5 s of a tap/key) is never counted or held. Sheets (showSheet) are counted, never held.
                 API: window.SCENE_POPCAP.list(day?) / .stats() / .gate(item) / .config. Event 'scene:popcap-held'.
   2. ORBITGATE — a celeb joins the circle (story228 'scene:celeb-unlocked' + "New in your orbit" row + first DM) only after
                 a real intro: story invite/beat, event card, booking/plan memory, or a DM thread the PLAYER started.
                 Otherwise deferred (dropped after 7 game days without an intro). Max 2 joins per game day.
                 A join shows a one-line who-card: copy 'orbit.who.<id>' -> 'orbit.who.default' ({name} {handle} {known_for}).
                 DM access rules (canAccess) are NOT changed. API: window.SCENE_ORBITGATE.
   3. DAYALIGN  — "Your story so far" day labels (SCENE_CAREER.getState().story[].day) = the game day the beat was PLAYED,
                 not the day it was queued (story169 stamps b.day at enqueue). Display only; chapter progress untouched.
   4. CHIPS232  — DM reply chips from SCENE_PARSE of their last message + the pending story invite / event card for that
                 celeb. Copy 'chips.<intent>.<n>'. Plugs into uiux3's window.SCENE_DM_CHIPS.provide; falls back to the old chips.
   Copy: window.SCENE_FLOWFIX232_LINES = {key:[variants]} (Writer, optional; built-in defaults otherwise).
   Save: ONE new key state.flowfix232 (old saves load; nothing else in the save changes format).
   Kill switches (checked on every call): window.SCENE_POPCAP_OFF / SCENE_ORBITGATE_OFF / SCENE_DAYALIGN_OFF / SCENE_CHIPS232_OFF = true. */
(()=>{
'use strict';
if(window.SCENE_FLOWFIX232)return;
const V='v232',G=k=>window[k];
const OFF={pop:()=>window.SCENE_POPCAP_OFF===true,orbit:()=>window.SCENE_ORBITGATE_OFF===true,day:()=>window.SCENE_DAYALIGN_OFF===true,chips:()=>window.SCENE_CHIPS232_OFF===true};
const CFG={perDay:3,reserveMust:1,feedbackMs:1500,inboxMax:60,orbitPerDay:2,dropDays:7,whoMs:4500};
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const day=()=>Number(S()?.sceneDay)||0;
const T=()=>Date.now();
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=x=>String(x||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
const who=id=>{try{return typeof byId==='function'?byId(id):null}catch{return null}};
const first=a=>String(a?.name||'').split(' ')[0];
const persist=()=>{try{if(typeof save==='function')save()}catch{}};
function ff(){const s=S();if(!s)return null;if(!s.flowfix232||typeof s.flowfix232!=='object')s.flowfix232={v:V};const f=s.flowfix232;
  f.popcap=f.popcap&&typeof f.popcap==='object'?f.popcap:{day:-1,shown:0,quiet:0,inbox:[],unseen:0,log:[]};
  f.orbit=f.orbit&&typeof f.orbit==='object'?f.orbit:{members:[],deferred:{},dropped:[],joins:{day:-1,n:0},intros:{}};
  f.dayalign=f.dayalign&&typeof f.dayalign==='object'?f.dayalign:{done:{}};return f}

/* ---------- copy ---------- */
const DEF={
 'popcap.inbox.title':['Held for later · {n}'],'popcap.inbox.empty':['Nothing held.'],
 'orbit.who.default':['{name} (@{handle}) is in your circle now · {known_for}','{name} (@{handle}) is in your circle now'],
 'chips.event_card.1':['count me in for {event}','i\'m in. {event} sounds fun'],'chips.event_card.2':['what\'s the plan for {event}?','tell me more about {event}'],'chips.event_card.3':['can\'t do {event} right now','pass on {event} for now?'],
 'chips.invite.1':['yes! {activity} {time} works','{time} at {place}? perfect','i\'m in for {time}','yes, i\'m in!'],'chips.invite.2':['can\'t make {time}, sorry','i have to pass this time'],'chips.invite.3':['could we do {counter_time} instead?','{time} is tough. {counter_time}?','can we do another day?'],
 'chips.question.1':['yeah, honestly yes','100%'],'chips.question.2':['not really, tbh','no, but i\'m curious'],'chips.question.3':['you first 👀','why do you ask?'],
 'chips.plan.1':['still on for {time}?','see you {time}','we\'re still on, right?'],'chips.plan.2':['where are we meeting?','what time works?'],'chips.plan.3':['can we move it to {counter_time}?','rain check to {counter_time}?'],
 'chips.greeting.1':['hey {name}!','hiii'],'chips.greeting.2':['how\'s your day going?','what are you up to?'],'chips.greeting.3':['look who it is','finally, a text from {name}'],
 'chips.compliment.1':['stop, thank you!','that means a lot'],'chips.compliment.2':['right back at you','you\'re too kind'],
 'chips.thanks.1':['of course!','anytime'],'chips.thanks.2':['you owe me one','next one\'s on you'],
 'chips.apology.1':['all good, really','water under the bridge'],'chips.apology.2':['it stung a little, not gonna lie','thanks. i needed to hear that'],
 'chips.flirt.1':['careful, i might blush','oh is that so?'],'chips.flirt.2':['haha stop','you\'re trouble'],
 'chips.work.1':['i\'m so down to work together','let\'s make it happen'],'chips.work.2':['send me the details','what\'s the timeline?'],'chips.work.3':['looping in my team','let me check my schedule'],
 'chips.ask.1':['sure, i got you','of course'],'chips.ask.2':['what do you need it for?','tell me more first'],'chips.ask.3':['can\'t right now, sorry','not this time'],
 'chips.rude.1':['that was a bit much','okay, no need for that'],'chips.rude.2':['let\'s talk later','i\'ll leave it there']};
function variants(key){const W=G('SCENE_FLOWFIX232_LINES');let v=W&&typeof W==='object'?W[key]:null;if(typeof v==='string')v=[v];if(Array.isArray(v)&&v.filter(Boolean).length)return v.filter(Boolean);return DEF[key]||[]}
function fillSlots(t,sl){let ok=true;const o=String(t).replace(/\{(\w+)\}/g,(_,k)=>{const v=sl[k];if(v===undefined||v===null||v===''){ok=false;return''}return String(v)});return ok?o.replace(/\s+([?!.,])/g,'$1').replace(/\s+/g,' ').trim():''}
function line(key,sl={},seed='',avoid=null){const L=variants(key);if(!L.length)return'';const st=H(seed+key)%L.length,ok=[];
  for(let i=0;i<L.length;i++){const v=L[(st+i)%L.length],t=fillSlots(v,sl);if(t&&!(avoid&&avoid.has(norm(t))))ok.push({t,n:(String(v).match(/\{\w+\}/g)||[]).length})}
  ok.sort((a,b)=>b.n-a.n);return ok[0]?.t||''}   /* richest fully-filled variant wins (hash order breaks ties) */

/* =====================================================================================================
   1. POPCAP
   ===================================================================================================== */
let lastInput=0;for(const e of ['pointerdown','keydown','click','touchstart'])addEventListener(e,ev=>{if(ev.isTrusted!==false)lastInput=T()},true);
const MUST_RE=/level ?up|chapter|ending|not enough (cash|money)|can.?t afford|out of (cash|money)|\bbroke\b|overdraft|debt|invited you|event card|new opportunity/i;
function classify(kind,text){if(['chapter','ending','levelup','eventchain','money','must'].includes(String(kind)))return'must';return MUST_RE.test(String(text||''))?'must':'quiet'}
function actionFor(kind,text){const t=String(text||'');if(kind==='eventchain')return'ec';const m=/^(.+?) sent you a message/.exec(t);if(m){const a=(typeof celebs!=='undefined'?celebs:[]).find(x=>x.name===m[1]);if(a)return'dm:'+a.id}return''}
function roll(){const p=ff()?.popcap;if(!p)return null;if(p.day!==day()){p.day=day();p.shown=0;p.quiet=0;p.log=[]}return p}
let silent=0;const recent=new Map();
function gate(item){
  if(OFF.pop()||silent)return true;const p=roll();if(!p)return true;
  if(T()-lastInput<CFG.feedbackMs&&!item.forceCount)return true;            /* direct feedback to a tap: never an interruption */
  const rk=String(item.kind||'')+'|'+norm(item.text),rp=recent.get(rk);if(rp&&T()-rp.t<4000)return rp.ok; /* same item re-fired by another queue (uiux2/notifq): one decision */
  const tier=item.tier||classify(item.kind,item.text);
  const ok=tier==='must'?p.shown<CFG.perDay:(p.shown<CFG.perDay&&p.quiet<CFG.perDay-CFG.reserveMust);
  recent.set(rk,{t:T(),ok});if(recent.size>40)recent.delete(recent.keys().next().value);
  if(ok){p.shown++;if(tier!=='must')p.quiet++;p.log.push({at:T(),kind:item.kind,tier,text:String(item.text||'').slice(0,140)});return true}
  hold({...item,tier});return false}
function hold(item){const p=roll();if(!p)return;const text=String(item.text||'').replace(/\s+/g,' ').trim().slice(0,160);if(!text)return;
  const d=day();if(p.inbox.some(x=>x.day===d&&x.text===text))return;
  const x={id:'pc'+T()+Math.random().toString(36).slice(2,5),at:T(),day:d,kind:item.kind||'toast',tier:item.tier||'quiet',text,action:item.action||actionFor(item.kind,text),source:item.source||''};
  p.inbox.unshift(x);p.inbox=p.inbox.slice(0,CFG.inboxMax);p.unseen=(p.unseen||0)+1;persist();paintBadge();
  try{dispatchEvent(new CustomEvent('scene:popcap-held',{detail:{...x}}))}catch{}}
/* flash(text) — outermost wrapper (notifq/uiux2 markers copied so they don't re-wrap) */
function wrapFlash(){const f=window.flash;if(typeof f!=='function'||f.__ff232)return;
  const w=function(text){if(OFF.pop()||silent)return f.apply(this,arguments);if(!gate({kind:'flash',text:String(text||''),source:'flash'}))return;return f.apply(this,arguments)};
  for(const k of Object.keys(f))if(/^__/.test(k)&&!(k in w))w[k]=f[k];w.__ff232=true;w.__base=f;window.flash=w;try{flash=w}catch{}}
function wrapPush(){const Q=G('SCENE_NOTIFY_QUEUE');if(!Q||Q.__ff232||typeof Q.push!=='function')return;const b=Q.push;
  Q.push=function(item){if(OFF.pop())return b.apply(this,arguments);const it=typeof item==='string'?{text:item}:{...(item||{})};
    if(!gate({kind:it.kind||'toast',text:it.text,tier:it.tier,source:'notifq'}))return false;return b.apply(this,arguments)};Q.__ff232=true}
/* DOM pop-ups created inside other closures */
const DOM_MUST='.scene-chapter148,.u18title,.u18break,.u20end,.u12moment,.scene-cinematic148';
const DOM_QUIET='.scene-scoretoast157,.u17card,.u18toast,.mo-pap,.mo-trend,.mo-tierup,.u15stack,.mo-notifs:not(.mo-lock)';
function whoInto(el,id){const t=whoLine(id);if(t&&el.isConnected&&!el.querySelector('.ff232who-line')){const p=document.createElement('p');p.className='ff232who-line';p.dataset.char=id;p.textContent=t;el.appendChild(p)}}
function onAdded(el){if(el.nodeType!==1||el.dataset.ff232)return;
  const cid=el.matches('.u17card')?el.dataset.celeb:'';
  if(cid&&!OFF.orbit()){const m=(ff()?.orbit?.members||[]).filter(x=>x.id===cid).at(-1);setTimeout(()=>whoInto(el,cid),80);
    if(m&&!OFF.pop()&&T()-m.at<10000){el.dataset.ff232='merged';setTimeout(()=>document.querySelector(`.ff232who[data-char="${cid}"]`)?.remove(),80);return}} /* the join already spent its interrupt: one card, who-line inside */const must=el.matches(DOM_MUST),quiet=!must&&el.matches(DOM_QUIET);if(!must&&!quiet)return;
  el.dataset.ff232='seen';setTimeout(()=>{if(OFF.pop()||!el.isConnected)return;const text=(el.textContent||'').replace(/\s+/g,' ').trim().slice(0,140);
    const ok=gate({kind:must?'dom-must':'dom',tier:must?'must':'quiet',text:text||el.className,source:'dom:'+String(el.className).split(' ')[0]});
    if(ok){el.dataset.ff232='ok'}else{el.dataset.ff232='held';try{el.remove()}catch{}}},60)}
/* showSheet: counted (must) when nobody tapped; never held, because callers bind handlers right after it renders */
function wrapSheet(){const f=window.showSheet;if(typeof f!=='function'||f.__ff232)return;
  const w=function(title){if(!OFF.pop()&&T()-lastInput>=CFG.feedbackMs){const p=roll();if(p){p.shown++;p.log.push({at:T(),kind:'sheet',tier:'must',text:String(title||'')})}}return f.apply(this,arguments)};
  for(const k of Object.keys(f))if(/^__/.test(k))w[k]=f[k];w.__ff232=true;window.showSheet=w;try{showSheet=w}catch{}}
/* quiet inbox: small count on the existing bell + a section at the top of the existing Activity sheet */
function paintBadge(){const b=document.querySelector('.bellbtn');if(!b)return;const p=ff()?.popcap,n=OFF.pop()?0:(p?.unseen||0);let i=b.querySelector('.ff232q');
  if(!n){if(i)i.remove();return}if(!i){i=document.createElement('i');i.className='ff232q';i.setAttribute('aria-label','held for later');b.appendChild(i)}if(i.textContent!==String(n))i.textContent=String(n)}
function injectInbox(){if(OFF.pop())return;const p=ff()?.popcap,m=document.getElementById('modal'),sh=m?.querySelector('.activitypage');if(!p||!sh||sh.querySelector('.ff232inbox'))return;
  const items=p.inbox.filter(x=>!x.done&&x.day>=day()-1).slice(0,12);if(!items.length)return;
  const box=document.createElement('div');box.className='ff232inbox';
  box.innerHTML=`<div class="ff232ih">${esc(line('popcap.inbox.title',{n:items.length},'t'))}</div>`+items.map(x=>`<button type="button" class="ff232ir" data-ff232-act="${esc(x.action||'')}" data-ff232-id="${esc(x.id)}"><span>${esc(x.text)}</span><small>Day ${x.day+1}</small></button>`).join('');
  const head=sh.querySelector('.activitytabs')||sh.querySelector('.activitynav');head?head.after(box):sh.prepend(box);
  box.querySelectorAll('[data-ff232-id]').forEach(b=>b.onclick=()=>{const x=p.inbox.find(y=>y.id===b.dataset.ff232Id);if(x)x.done=true;persist();const a=b.dataset.ff232Act||'';
    try{if(a==='ec'){const c=(G('SCENE_EVENTCHAIN')?.state?.()?.active||[]).filter(c=>c.status==='open').at(-1);if(c)G('SCENE_EVENTCHAIN').open(c.id)}else if(a.startsWith('dm:'))openDm(a.slice(3));else if(a.startsWith('profile:'))openProfile(a.slice(8))}catch{}})}
document.addEventListener('click',e=>{if(OFF.pop())return;if(e.target?.closest?.('.bellbtn')){const p=ff()?.popcap;if(p&&p.unseen){p.unseen=0;persist()}setTimeout(()=>{injectInbox();paintBadge()},120);setTimeout(injectInbox,500)}},true);
const POPCAP={version:V,config:CFG,gate,hold,
  list:(d)=>{const p=ff()?.popcap;if(!p)return[];return p.inbox.filter(x=>d===undefined||x.day===d).map(x=>({...x}))},
  stats:()=>{const p=roll()||{};return{day:day(),shown:p.shown||0,quiet:p.quiet||0,budget:CFG.perDay,unseen:p.unseen||0,held:(p.inbox||[]).length,log:[...(p.log||[])]}}};

/* =====================================================================================================
   2. ORBITGATE
   ===================================================================================================== */
const INTRO_MEM=/gig|job|booking|plan_agreed|collab|project|story_choice|^event$|eventchain/i;
function introOf(id){const s=S();if(!s||!id)return'';const o=ff().orbit;
  if(o.intros[id])return o.intros[id];
  if(s.firstSession148?.friendId===id)return'starter';
  if((s.storyInvites228?.invites||[]).some(x=>x&&x.celebId===id))return'story';
  if((s.eventChain?.active||[]).some(c=>c&&(c.celebId===id||c.rivalId===id)))return'eventcard';
  if((s.memory||[]).some(m=>m&&m.celebrityId===id&&INTRO_MEM.test(String(m.type||''))&&m.type!=='incoming_dm'))return'booking';
  const d=(s.dms||[]).find(x=>x&&x.id===id),f=(d?.messages||[]).find(m=>m&&(m.text||m.image));if(f&&f.from==='me')return'dm';
  return''}
function joinsToday(){const o=ff().orbit;if(o.joins.day!==day())o.joins={day:day(),n:0};return o.joins}
let rawDispatch=null;const suppress=new Set();
function knownFor(a){const k=a?.knownFor||a?.known_for||a?.role||'';return String(k).trim()}
function whoLine(id){const a=who(id);if(!a)return'';const sl={name:a.name,handle:String(a.handle||'').replace(/^@/,''),known_for:knownFor(a)};
  return line('orbit.who.'+id,sl,id)||line('orbit.who.default',sl,id)}
function showWho(id){const text=whoLine(id);if(!text)return;
  if(!gate({kind:'orbit',tier:'quiet',text,action:'profile:'+id,source:'orbit'}))return;
  const u17=document.querySelector('.u17card');if(u17&&!u17.querySelector('.ff232who-line')){const p=document.createElement('p');p.className='ff232who-line';p.dataset.char=id;p.textContent=text;u17.appendChild(p);return}
  document.querySelector('.ff232who')?.remove();const c=document.createElement('div');c.className='ff232who';c.dataset.char=id;c.setAttribute('role','status');
  let av='';try{av=typeof window.av==='function'?window.av(who(id),'microav'):''}catch{}
  c.innerHTML=`${av}<span>${esc(text)}</span>`;c.onclick=()=>{c.remove();try{openProfile(id)}catch{}};document.body.appendChild(c);setTimeout(()=>c.remove(),CFG.whoMs)}
function join(id,via,detail,later){const o=ff().orbit,j=joinsToday();j.n++;o.members.push({id,day:day(),at:T(),via});delete o.deferred[id];
  if(later){const a=who(id),s=S(),d0=o.deferredNotif?.[id];
    try{addNotif(d0||`New in your orbit: ${a?.name||id}.`,'connection',{celebrityId:id})}catch{}
    if(o.deferredNotif)delete o.deferredNotif[id];
    try{rawDispatch.call(window,new CustomEvent('scene:celeb-unlocked',{detail:{...(detail||{characterId:id}),ff232:true,via}}))}catch{}
    const u=s.unlocks228,d=(s.dms||[]).find(x=>x.id===id);if(u&&Array.isArray(u.firstDmQ)&&!d?.messages?.length&&!u.firstDmQ.includes(id))u.firstDmQ.push(id)}
  persist();setTimeout(()=>showWho(id),later?400:900);try{dispatchEvent(new CustomEvent('scene:orbit-joined',{detail:{characterId:id,via,day:day()}}))}catch{}}
function onUnlock(detail){const id=detail?.characterId;if(!id)return true;const o=ff()?.orbit;if(!o)return true;
  const via=introOf(id),j=joinsToday();
  if(via&&j.n<CFG.orbitPerDay){join(id,via,detail,false);return true}
  o.deferred[id]={day:day(),at:T(),why:via?'cap':'no-intro',detail:{characterId:id,reason:detail.reason,fame:detail.fame,threshold:detail.threshold,line:detail.line}};
  /* story228 queues + may send the first DM in this same synchronous tick: hold it, then take this celeb out of the queue */
  suppress.add(id);const u=S().unlocks228,prev=u?u.lastFirstDmAt:undefined;if(u)u.lastFirstDmAt=T();
  setTimeout(()=>{suppress.delete(id);if(u){u.firstDmQ=(u.firstDmQ||[]).filter(x=>x!==id);u.lastFirstDmAt=prev}persist()},0);
  persist();return false}
function wrapDispatch(){if(rawDispatch)return;rawDispatch=window.dispatchEvent;
  window.dispatchEvent=function(ev){try{if(ev&&ev.type==='scene:celeb-unlocked'&&!OFF.orbit()&&!ev.detail?.ff232&&S()?.player){if(!onUnlock(ev.detail||{}))return true}}catch(e){console.warn('flowfix232 orbit',e)}return rawDispatch.call(this,ev)}}
function wrapNotif(){const f=window.addNotif;if(typeof f!=='function'||f.__ff232)return;
  const w=function(text,kind,meta){const id=meta&&meta.celebrityId;if(id&&suppress.has(id)&&/^New in your orbit/i.test(String(text||''))){const o=ff().orbit;(o.deferredNotif||(o.deferredNotif={}))[id]=String(text);return null}return f.apply(this,arguments)};
  w.__ff232=true;window.addNotif=w;try{addNotif=w}catch{}}
function orbitTick(){if(OFF.orbit()||!S()?.player)return;const o=ff().orbit;let ch=false;
  for(const id of Object.keys(o.deferred)){const x=o.deferred[id],via=introOf(id);
    if(via){if(joinsToday().n<CFG.orbitPerDay){join(id,via,x.detail,true);ch=true}else if(x.why!=='cap'){x.why='cap';ch=true}continue}
    if(day()-x.day>=CFG.dropDays){o.dropped.push({id,day:day(),since:x.day});o.dropped=o.dropped.slice(-80);delete o.deferred[id];if(o.deferredNotif)delete o.deferredNotif[id];ch=true}}
  if(ch)persist()}
const ORBITGATE={version:V,config:CFG,introOf,whoLine,
  intro:(id,why='api')=>{const o=ff()?.orbit;if(!o||!id)return false;o.intros[id]=String(why);persist();orbitTick();return true},
  state:()=>{const o=ff()?.orbit;return o?JSON.parse(JSON.stringify({...o,joinsToday:joinsToday().n})):null}};

/* =====================================================================================================
   3. DAYALIGN — story day label = game day the beat was played
   ===================================================================================================== */
function dayAt(ts){const s=S(),cur=day();const L=(s?.dayLedger92||[]).filter(x=>x&&Number.isFinite(+x.at)&&Number.isFinite(+x.day)).sort((a,b)=>a.at-b.at);
  if(!L.length||!ts)return null;let d=null;for(const x of L){if(x.at<=ts)d=x.day;else break}
  if(d===null)d=Math.max(0,L[0].day-1);return Math.min(cur,d)}
function stampTick(){if(OFF.day()||!S()?.player)return;const h=G('SCENE_STORY169')?.inspect?.().history||[],D=ff().dayalign.done;let ch=false;
  for(const b of h.slice(0,20)){if(!b?.completedAt)continue;const k=b.id+'@'+b.completedAt;if(k in D)continue;
    D[k]=T()-b.completedAt<10*60000?day():dayAt(b.completedAt);ch=true}           /* fresh completions: the live game day */
  const ks=Object.keys(D);if(ks.length>200)for(const k of ks.slice(0,ks.length-200))delete D[k];if(ch)persist()}
function storyDay(item){const D=ff()?.dayalign?.done||{},k=item.id+'@'+item.at;let d=Number.isFinite(D[k])?D[k]:dayAt(item.at);
  if(!Number.isFinite(d))return item.day;if(Number.isFinite(item.day))d=Math.max(d,Number(item.day));return Math.min(d,day())}
function wrapCareer(){const C=G('SCENE_CAREER');if(!C||C.__ff232||typeof C.getState!=='function')return;const b=C.getState;
  C.getState=function(){const out=b.apply(this,arguments);if(OFF.day()||!out||!Array.isArray(out.story))return out;
    try{return{...out,story:out.story.map(x=>{if(x?.kind!=='story')return x;const d=storyDay(x);return Number.isFinite(d)?{...x,day:d,dayLabel:d+1,queuedDay:x.day}:x})}}catch(e){return out}};C.__ff232=true}
const DAYALIGN={version:V,gameDay:()=>day()+1,storyDay:(id,at)=>{const d=storyDay({id,at,day:null});return Number.isFinite(d)?d+1:null},dayAt};

/* =====================================================================================================
   4. CHIPS232 — context reply chips through uiux3's provider API
   ===================================================================================================== */
function parse(text,id){try{const P=G('SCENE_PARSE');if(typeof P==='function'){const p=P(String(text||''),{selfId:id,charId:id});if(p&&typeof p==='object')return p}}catch{}return{intents:[],slots:{}}}
function slotVal(p,ctx,k){const f=p?.fill?.[k];if(f)return String(f);const r=p?.slots?.[k];if(r){if(typeof r==='string')return r;if(Array.isArray(r)&&r[0])return String(r[0]?.name||r[0]?.value||r[0]);if(r.name||r.value||r.text)return String(r.name||r.value||r.text)}
  const e=ctx?.entities?.[k];return Array.isArray(e)&&e[0]?String(e[0]):''}
function counterOf(t){t=String(t||'').toLowerCase();if(/tonight/.test(t))return'tomorrow night';if(/today|now/.test(t))return'tomorrow';if(/tomorrow/.test(t))return'the day after';if(/weekend|saturday|sunday/.test(t))return'next week';if(/monday|tuesday|wednesday|thursday|friday/.test(t))return'the weekend';return'another day'}
function cardTitle(c){const L=G('SCENE_EVENTCHAIN_LINES')||{};let v=L[`ec.${c.arc}.${c.card}.title`];if(Array.isArray(v))v=v[0];return String(v||'').trim()||'the '+String(c.arc||'event')}
function contextFor(id,ctx){const s=S()||{},p=parse(ctx.lastTheirText||'',id),intents=[...new Set([...(Array.isArray(p.intents)?p.intents:[]),...(ctx.intents||[])])];
  const inv=(s.storyInvites228?.invites||[]).filter(x=>x&&x.celebId===id&&x.status==='pending').at(-1)||null;
  const card=(G('SCENE_EVENTCHAIN')?.state?.()?.active||[]).filter(c=>c&&c.celebId===id&&(c.status==='open'||c.status==='queued')).at(-1)||null;
  const types=G('SCENE_STORY228')?.types||{};
  const time=(inv&&(inv.when||''))||slotVal(p,ctx,'time')||'';
  const sl={name:first(who(id))||'you',event:card?cardTitle(card):'',city:card?.city||'',
    activity:slotVal(p,ctx,'meal')||slotVal(p,ctx,'activity')||(inv&&String(types[inv.type]?.label||'').toLowerCase())||slotVal(p,ctx,'event')||'',
    time,counter_time:time?counterOf(time):'',place:(inv&&inv.placeText)||slotVal(p,ctx,'place')||'',topic:slotVal(p,ctx,'event')||slotVal(p,ctx,'activity')||'',favour:slotVal(p,ctx,'favour')||''};
  return{p,intents,inv,card,sl,plan:(ctx.plans||[]).length>0}}
const ORDER=['question','ask','work','apology','rude','compliment','flirt','thanks','greeting'];
function provide(ctx){const base=G('SCENE_DM_CHIPS')?.defaultProvide;const fb=()=>{try{return base?base(ctx):[]}catch{return[]}};
  if(OFF.chips()||!ctx?.characterId)return fb();
  try{const id=ctx.characterId,X=contextFor(id,ctx),avoid=new Set([...(ctx.avoid||[])].map(norm)),seed=id+'|'+(ctx.lastTheirText||''),out=[];
    const add=(intent,n)=>{const key=`chips.${intent}.${n}`,t=line(key,X.sl,seed,avoid);if(t&&!out.some(c=>norm(c.text)===norm(t))){out.push({text:t,intent:'ff232:'+intent,tpl:key+':'+t});avoid.add(norm(t))}};
    const set=(intent,ns)=>ns.forEach(n=>add(intent,n));
    let primary='';
    if(X.inv||X.intents.includes('invite')){primary='invite';set('invite',[1,2,3])}
    else if(X.card){primary='event_card';set('event_card',[1,2,3])}
    else if(X.plan&&(X.intents.includes('plan')||X.intents.includes('plan_followup'))){primary='plan';set('plan',[1,2,3])}
    else{const it=ORDER.find(k=>X.intents.includes(k)||(k==='ask'&&X.intents.includes('favour_ask')));if(it){primary=it;set(it,[1,2,3])}}
    if(X.card&&primary!=='event_card'&&primary!=='invite'){if(out.length>=3)out.pop();add('event_card',1)}
    if(!primary&&!X.card)return fb();
    if(out.length<2){for(const c of fb()){if(out.length>=3)break;if(!out.some(x=>norm(x.text)===norm(c.text)))out.push(c)}}
    return out.slice(0,3)}catch(e){console.warn('flowfix232 chips',e);return fb()}}
function installChips(){const C=G('SCENE_DM_CHIPS');if(!C||C.__ff232||typeof C.provide!=='function')return false;const prev=C.provide;
  C.provide=function(ctx){if(OFF.chips())return prev.apply(this,arguments);return provide(ctx)};C.__ff232=true;return true}

/* ---------- boot ---------- */
function css(){if(document.getElementById('ff232-css'))return;const s=document.createElement('style');s.id='ff232-css';
  s.textContent=`.bellbtn{position:relative}.bellbtn .ff232q{position:absolute;left:-2px;bottom:-2px;min-width:14px;height:14px;padding:0 3px;border-radius:7px;background:#7c5cff;color:#fff;font:700 9px/14px system-ui;font-style:normal;text-align:center;box-shadow:0 0 0 2px rgba(0,0,0,.35);pointer-events:none}
.ff232who{position:fixed;left:50%;top:calc(env(safe-area-inset-top,0px) + 64px);transform:translateX(-50%);z-index:9998;width:max-content;max-width:min(92vw,380px);display:flex;gap:8px;align-items:center;padding:9px 13px;border-radius:16px;background:rgba(22,18,34,.88);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);color:#fff;font:600 13px/1.3 system-ui;box-shadow:0 8px 28px rgba(0,0,0,.35);animation:ff232in .28s ease-out}
.ff232who .avatar,.ff232who .microav{width:26px;height:26px;flex:none}.ff232who-line{margin:8px 0 0;font-size:13px;opacity:.9}@keyframes ff232in{from{opacity:0;transform:translate(-50%,-8px)}}
.ff232inbox{margin:4px 0 12px;padding:8px;border-radius:14px;background:rgba(124,92,255,.08)}.ff232ih{font:700 11px/1.4 system-ui;letter-spacing:.06em;text-transform:uppercase;opacity:.7;margin:2px 4px 6px}
.ff232ir{display:flex;width:100%;gap:8px;justify-content:space-between;align-items:center;text-align:left;padding:7px 6px;border:0;background:none;color:inherit;font:500 13px/1.3 system-ui;border-top:1px solid rgba(127,127,127,.15)}.ff232ir small{opacity:.55;flex:none}`;
  document.head.appendChild(s)}
function ready(){try{return typeof state!=='undefined'&&typeof deliverDmJob==='function'&&typeof showSheet==='function'&&G('SCENE_STORY228')&&G('SCENE_EVENTCHAIN')}catch{return false}}
let installed=false;
function install(){if(installed)return;installed=true;css();wrapDispatch();wrapNotif();wrapSheet();
  new MutationObserver(rs=>{for(const r of rs)for(const n of r.addedNodes)try{onAdded(n)}catch{}}).observe(document.body,{childList:true,subtree:true});
  setInterval(()=>{try{wrapFlash();wrapPush();wrapCareer();installChips();if(window.addNotif&&!window.addNotif.__ff232)wrapNotif();paintBadge();injectInbox();orbitTick();stampTick()}catch(e){console.warn('flowfix232',e)}},1000);
  try{wrapFlash();wrapPush();wrapCareer();installChips();stampTick()}catch{}}
(function wait(n=0){if(ready()&&document.body)return install();if(n<600)setTimeout(()=>wait(n+1),100)})();
window.SCENE_FLOWFIX232={version:V,config:CFG,silent:fn=>{silent++;try{return fn()}finally{silent--}}};
window.SCENE_POPCAP=POPCAP;window.SCENE_ORBITGATE=ORBITGATE;window.SCENE_DAYALIGN=DAYALIGN;window.SCENE_CHIPS232={provide,context:(id)=>{try{const C=G('SCENE_DM_CHIPS');const ctx=C?.buildContext?C.buildContext(id):{characterId:id};const X=contextFor(id,ctx);return{intents:X.intents,invite:X.inv?.id||null,card:X.card?.id||null,slots:X.sl}}catch(e){return null}}};
})();
