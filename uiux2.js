/* SCENE uiux2 · "calm day one" UI layer (prototype). New file, no core edits. Loads after uiux1.js.
   What it does while active (new careers only, roughly the first 2 Scene days, or until the day-one goals are done):
   1. Today card: ONE current goal at the top of Feed (compact strip on other tabs), with a button that goes to it.
      Source of truth: window.SCENE_DAY1.getState() -> {goal:{id,title,detail,tab,action}, unlockedTabs:[...], done}
      (SCENE Gameplay Logic), re-read on the window event 'scene:day1-changed'. Until that exists, a TEMP stand-in
      below derives the same shape from the game's real first-session/quest state.
   2. Progressive reveal: tabs/sections not needed yet are softly dimmed with a small "unlocks after X" hint.
      They still work when tapped (nothing is hidden or disabled).
   3. Pop-up/toast queue: one modal-class surface at a time, toasts spaced out, low-priority items collapsed
      into a single "N updates" pill. Cooperates with motion1-3 (they already defer to sceneFX._int.blocked()).
      The queue only controls timing and stacking; it never writes or rewrites game text.
   4. Quiet badges: unread counts on tabs/buttons that are not relevant to the current goal shrink to a small dot.
   Kill switch: window.SCENE_CALM_DAY1=false (checked continuously; everything reverts within ~0.5 s).
   Debug: window.sceneUiux2.status() / .getState() / .config / .release() */
(()=>{
'use strict';
if(window.sceneUiux2)return;

/* ================= CONFIG (all knobs live here) ================= */
// Goal order. SCENE Gameplay Logic owns the final order; the TEMP stand-in shows the first goal in this list that
// is not done yet. Ids the stand-in understands are the keys of TEMP_GOALS below.
// Order supplied by SCENE Gameplay Logic (scene-day1-v227.js). When window.SCENE_DAY1 exists it decides the goal and
// this list is only used for the "Step n of N" label; the TEMP stand-in uses it to pick the first pending goal it knows.
const GOAL_ORDER=['pick_friend','reply_friend','first_post','answer_ripple','first_booking','tell_friend','paid_job','second_post','first_story_beat'];
const CONFIG={
  calmDays:2,                 // TEMP stand-in only; with SCENE_DAY1 present calm ends when its goals are done
  maxDaysWithLogic:8,         // safety stop with SCENE_DAY1 present (Scene days advance on every story beat)
  dayLabelOffset:1,          // logic2: the UI shows stored sceneDay+1 (stored Day 0 is labelled 'Day 1')
  wrapUpMaxMs:45000,         // after the last calm day ends, stay on (max) until its wrap-up surfaces are closed                 // active while state.sceneDay < calmDays (Scene days are 0-based: Day 0 and Day 1)
  todayOtherTabs:'compact',   // 'compact' strip on Career/Circle/You, or 'game' to keep the game's own next-move card there
  hideGameNextMove:true,      // the Today card replaces the game's .scene-nextmove148 card while active
  // Tab unlocks used by the TEMP stand-in (unlocked once that goal is done). The current goal's tab is always unlocked.
  // which goal opens which tab/sub-view (Gameplay Logic table). Used for the hints, and by the TEMP stand-in to compute unlockedTabs.
  unlockedBy:{circle:'pick_friend',you:'first_post',career:'answer_ripple','career.work':'first_booking','circle.people':'tell_friend','career.travel':'paid_job','career.resources':'first_story_beat'},
  subViews:{'career.work':'[data-career-view="work"]','career.travel':'[data-career-view="travel"]','career.resources':'[data-career-view="resources"]','circle.people':'[data-circle-view="people"]'},
  // Sections inside tabs, dimmed until a goal is done ('goal:<id>') or until calm mode ends ('calm-end').
  // extra sections (beyond the sub-views above) dimmed until calm mode ends
  sectionDims:[
    {heading:/^skills$/i,tab:'world',until:'calm-end'},
    {heading:/^your celebrity world$/i,tab:'world',until:'calm-end'}
  ],
  quietBadges:true,           // non-relevant badges -> small dot
  quietStoryRings:true,       // unseen story rings render muted
  toastGapMs:1100,
  bannerSupersedesToast:true,
  autoSurfaces:['cinematic','levelup'], // game-opened surfaces that wait for the reward banner/toast (never user-opened sheets)
  autoHoldMs:3200,
  settleAfterModalMs:1300,  // queued banners wait this long after a modal closes (motion's reward banner goes first)            // minimum quiet time between two toasts
  chapterMs:3300,             // lifetime of a re-played .scene-chapter148 banner (same as the game's default)
  maxToastWaitMs:9000,        // a queued game toast is never held longer than this
  // low priority = collapsed into the "N updates" pill instead of interrupting
  lowPriority:{phoneBlowup:true,newPostsPill:true},
  // caps on motion/game bursts. They run for every save (also after calm mode) unless window.SCENE_POPUP_CAPS=false
  // or the master switch window.SCENE_CALM_DAY1=false.
  caps:{phonePerDay:1,rewindMinGapMs:120000,levelMergeMs:60000,viralMinViews:1000,viralFollowerMult:3,viralPerDay:1},
  // modal-class surfaces, highest priority first. Only the top one is visible; the rest wait (CSS hold).
  modalPriority:[['modal','#modal > *'],['levelup','#scene-overlay157'],['rewind','.mo-rewind'],['tierup','.mo-tierup'],['trend','.mo-trend'],['cinematic','#scene-cinematic148'],['phone','.mo-notifs']],
};
// UI-only labels (not game wording). TEMP until Gameplay Logic supplies copy; keep short.
const UI_COPY={kicker:'TODAY',step:'Step {n} of {total}',go:'Go',hint:'unlocks after {x}',hintCalmEnd:'unlocks on Day {d}',updates:'{n} updates',update:'1 update'};

/* ================= helpers ================= */
const q=(s,r=document)=>{try{return r.querySelector(s)}catch{return null}};
const qa=(s,r=document)=>{try{return [...r.querySelectorAll(s)]}catch{return []}};
const S=()=>{try{return state}catch{return window.state}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fill=(t,o)=>String(t).replace(/\{(\w+)\}/g,(_,k)=>o[k]??'');
const now=()=>Date.now();
const LS='scene-uiux2-calm-v1'; // own key; the game save (status-hatchable-v4) is never read or written here
const lsGet=()=>{try{return JSON.parse(localStorage.getItem(LS)||'{}')}catch{return{}}};
const lsSet=o=>{try{localStorage.setItem(LS,JSON.stringify(o))}catch{}};
const visible=e=>{if(!e||!e.isConnected)return false;const r=e.getBoundingClientRect();if(!(r.width>0&&r.height>0))return false;const cs=getComputedStyle(e);return cs.display!=='none'&&cs.visibility!=='hidden'};

/* ================= TEMP stand-in for SCENE_DAY1 (yields to the real one when window.SCENE_DAY1 exists) ================= */
// TEMP: delete this block once SCENE Gameplay Logic ships window.SCENE_DAY1. Titles/details come from the game's own
// objective text (SCENE_GAMEPLAY_FLOW148.objective()) whenever it describes the same step.
const flow=()=>S()?.firstSession148||null;
const gameObj=()=>{try{return window.SCENE_GAMEPLAY_FLOW148?.objective?.()||null}catch{return null}};
let lastStoryOpText='';
const TEMP_GOALS={
  'pick_friend':{tab:'feed',action:'picker',done:f=>f.stage>=1||f.completed},
  'reply_friend':{tab:'circle',action:f=>f.friendId?'dm:'+f.friendId:'tab:circle',done:f=>f.stage>=2||f.completed},
  'first_post':{tab:'feed',action:'compose',done:f=>f.stage>=3||f.completed},
  'answer_ripple':{tab:'feed',action:'ripple',done:f=>f.stage>=4||f.completed},
  'first_booking':{tab:'world',action:'firstgig',done:f=>!!f.completed},
  'day1-story':{tab:'world',action:'story-op',done:()=>(Number(S()?.sceneDay)||0)>=CONFIG.calmDays,
    // TEMP placeholder copy (the game has no objective text for this step); Gameplay Logic to replace.
    title:'Play today’s story',detail:()=>lastStoryOpText}
};
const TEMP_STAGE_ACTION={0:'picker',1:'dm:',2:'compose',3:'ripple',4:'firstgig'};
const TEMP_DAY1={
  temp:true,
  getState(){
    const s=S(),f=flow();if(!s?.player||!f)return{goal:null,unlockedTabs:['feed','world','circle','you'],done:true};
    const order=[...GOAL_ORDER.filter(id=>TEMP_GOALS[id]),'day1-story'];
    const pending=order.filter(id=>!TEMP_GOALS[id].done(f));
    const done=!pending.length||(Number(s.sceneDay)||0)>=CONFIG.calmDays;
    const id=pending[0],def=TEMP_GOALS[id];let goal=null;
    if(id&&!done){
      const action=typeof def.action==='function'?def.action(f):def.action;
      const o=gameObj();const oa=String(o?.action||'');
      const same=o&&(oa===action||(action.startsWith('dm:')&&oa.startsWith('dm:'))||(!f.completed&&TEMP_STAGE_ACTION[f.stage]&&oa.startsWith(TEMP_STAGE_ACTION[f.stage])&&TEMP_STAGE_ACTION[f.stage]===(action.startsWith('dm:')?'dm:':action)));
      goal={id,tab:def.tab,action,title:same?o.title:(def.title||id),detail:same?o.sub:(typeof def.detail==='function'?def.detail():def.detail||''),button:same?o.button:'',temp:true};
    }
    const doneIds=order.filter(x=>TEMP_GOALS[x].done(f));
    const unlockedTabs=['feed',...Object.entries(CONFIG.unlockedBy).filter(([t,after])=>doneIds.includes(after)||navTab(goal?.tab)===t).map(([t])=>t)];
    return{goal,unlockedTabs,done,doneIds};
  }
};
const day1=()=>{const real=window.SCENE_DAY1;return real&&typeof real.getState==='function'?real:TEMP_DAY1};
// Gameplay Logic tab ids -> game ids: career=world (nav), career.<view>=Career sub-view, circle.people=Circle People
const TAB_MAP={career:'world'};const navTab=t=>{t=String(t||'');const top=t.split('.')[0];return TAB_MAP[top]||top};
function readState(){try{const st=day1().getState()||{};const ut=Array.isArray(st.unlockedTabs)?st.unlockedTabs:['feed','world','circle','you'];return{goal:st.goal?{...st.goal,navTab:navTab(st.goal.tab)}:null,unlockedTabs:ut.map(navTab),unlockedRaw:ut,done:!!st.done,doneIds:st.doneIds||null,source:day1()===TEMP_DAY1?'temp':'SCENE_DAY1'}}catch(e){console.warn('uiux2 getState',e);return{goal:null,unlockedTabs:['feed','world','circle','you'],done:true,source:'error'}}}

/* ================= active window ================= */
let ST=readState(),active=false,overSince=0;
function eligible(){
  if(window.SCENE_CALM_DAY1===false)return false;
  const s=S();if(!s?.player)return false;const f=flow();
  if(!f||f.existingCareer||f.replay)return false;              // brand-new careers only
  const key=String(f.startedAt||'');if(lsGet().ended?.[key])return false;
  if(ST.source==='SCENE_DAY1'){if((Number(s.sceneDay)||0)>=CONFIG.maxDaysWithLogic)return endFor(key)}
  // finished: let the closing day's wrap-up (outcome, level-up, Story Rewind) play under calm rules first
  const over=(ST.source==='temp'&&(Number(s.sceneDay)||0)>=CONFIG.calmDays)||ST.done;
  if(over){const wrapping=modalAny()||!!s.motionFX?.pendingRewind;if(wrapping&&active&&now()-(overSince||(overSince=now()))<CONFIG.wrapUpMaxMs)return true;return endFor(key)}
  overSince=0;
  return true;
}
function endFor(key){const o=lsGet();o.ended=o.ended||{};o.ended[key]=now();lsSet(o);return false}

/* ================= 1. Today card ================= */
function goalStep(g){const i=GOAL_ORDER.indexOf(g?.id);return i<0?'':fill(UI_COPY.step,{n:i+1,total:GOAL_ORDER.length})}
function todayHtml(g,compact){
  const step=goalStep(g);
  if(compact)return `<button type="button" class="uiux2-strip" data-uiux2-go><small>${esc(UI_COPY.kicker)}</small><b>${esc(g.title)}</b><i>›</i></button>`;
  return `<div class="uiux2-tophead"><small>${esc(UI_COPY.kicker)}</small>${step?`<em>${esc(step)}</em>`:''}</div><strong>${esc(g.title)}</strong>${g.detail?`<span>${esc(g.detail)}</span>`:''}<button type="button" class="uiux2-go" data-uiux2-go>${esc(g.button||UI_COPY.go)} <i>→</i></button>`;
}
function renderToday(){
  const main=q('#app .main'),s=S();let card=q('#uiux2-today');
  if(!active||!ST.goal||!main||s?.tab==='settings'){card?.remove();return}
  const onFeed=s.tab==='feed',compact=!onFeed;
  if(compact&&CONFIG.todayOtherTabs!=='compact'){card?.remove();return}
  const sig=[ST.goal.id,ST.goal.title,ST.goal.detail,ST.goal.button,compact].join('|');
  if(card&&card.parentElement===main&&card.dataset.sig===sig&&main.firstElementChild===card)return;
  if(!card){card=document.createElement('section');card.id='uiux2-today';card.setAttribute('aria-label','Today');}
  if(card.dataset.sig!==sig){card.className='uiux2-today'+(compact?' compact':'');card.dataset.sig=sig;card.innerHTML=todayHtml(ST.goal,compact);card.querySelector('[data-uiux2-go]').onclick=e=>{e.preventDefault();e.stopPropagation();goTo(ST.goal)}}
  if(main.firstElementChild!==card)main.prepend(card);
}
function clickTab(t){const b=q(`.nav .navbtn[data-tab="${t}"]`);if(S()?.tab===t)return true;if(b){b.click();return true}try{state.tab=t;render();return true}catch{return false}}
function gameNextMoveButton(action){
  for(const c of qa('.scene-nextmove148')){const a=(c.dataset.sig||'').split('|')[3]||'';if(a===action||(action.startsWith('dm:')&&a===action))return c.querySelector('button')}
  return null;
}
function goTo(g){
  if(!g)return;const a=String(g.action||'');
  try{
    const viaGame=gameNextMoveButton(a);if(viaGame){viaGame.click();return}
    if(a.startsWith('tab:'))return clickTab(navTab(a.slice(4)));
    if(a.startsWith('career:')){clickTab('world');setTimeout(()=>q(`[data-career-view="${a.slice(7)}"]`)?.click(),60);return}
    if(a.startsWith('story169:')){try{if(window.SCENE_STORY169?.act)return window.SCENE_STORY169.act(a.slice(9))}catch{}}
    if(a.startsWith('dm:')){if(typeof openDm==='function')return openDm(a.slice(3));return clickTab('circle')}
    if(a==='compose'){q('.fab[data-action="compose"]')?.click();return}
    if(a==='activity'){if(typeof openActivity==='function')return openActivity('social')}
    if(a==='event'){try{if(state.pendingEvent&&typeof openEvent==='function')return openEvent(state.pendingEvent)}catch{}}
    if(a==='story-op'||a==='firstgig'||a==='career'){clickTab('world');setTimeout(()=>{const op=q('[data-story-op]');if(op)op.click();else q('[data-career-view="story"]')?.click()},60);return}
    if(g.navTab||g.tab)clickTab(g.navTab||navTab(g.tab));
  }catch(e){console.warn('uiux2 goTo',e);if(g.tab)clickTab(navTab(g.tab))}
}

/* ================= 2. progressive reveal (soft dim + hint) ================= */
const GOAL_LABEL=id=>{return ({pick_friend:'picking a friend',reply_friend:'your first reply',first_post:'first post',answer_ripple:'the comment call',first_booking:'first booking',tell_friend:'telling your friend',paid_job:'first paid job',second_post:'second post',first_story_beat:'first story call','day1-story':'today’s story'}[id])||id}; // TEMP short labels
function untilDone(u){if(u==='calm-end')return !active;const id=u.replace(/^goal:/,'');const doneIds=ST.doneIds||[];return doneIds.includes(id)}
const calmEndHint=()=>fill(UI_COPY.hintCalmEnd,{d:CONFIG.calmDays+CONFIG.dayLabelOffset});
function hintFor(u){return u==='calm-end'?calmEndHint():fill(UI_COPY.hint,{x:GOAL_LABEL(u.replace(/^goal:/,''))})}
function setDim(el,hint){if(!el)return;if(el.dataset.uiux2Dim!==hint){el.dataset.uiux2Dim=hint;el.setAttribute('data-uiux2-hint',hint)}}
function clearDims(keep){for(const el of qa('[data-uiux2-dim]'))if(!keep||!keep.has(el)){delete el.dataset.uiux2Dim;el.removeAttribute('data-uiux2-hint')}}
function applyDims(){
  if(!active){clearDims();return}
  const keep=new Set();
  // nav tabs
  const unlocked=new Set(ST.unlockedTabs);if(ST.goal)unlocked.add(ST.goal.navTab||navTab(ST.goal.tab));
  const raw=new Set(ST.unlockedRaw||[]);if(ST.goal?.tab)raw.add(ST.goal.tab);
  const hintOf=id=>{const after=CONFIG.unlockedBy[id];return after?fill(UI_COPY.hint,{x:GOAL_LABEL(after)}):calmEndHint()};
  for(const b of qa('.nav .navbtn[data-tab]')){const t=b.dataset.tab;if(t==='feed'||unlocked.has(t))continue;const id=Object.keys(TAB_MAP).find(k=>TAB_MAP[k]===t)||t;setDim(b,hintOf(id));keep.add(b)}
  for(const [id,sel] of Object.entries(CONFIG.subViews)){
    const open=raw.has(id)||(ST.source==='temp'&&!TEMP_GOALS[CONFIG.unlockedBy[id]]&&false)||(ST.source==='temp'&&ST.doneIds?.includes(CONFIG.unlockedBy[id]));
    if(open)continue;
    for(const el of qa('#app .main '+sel)){if(el.classList.contains('on'))continue;setDim(el,ST.source==='temp'&&!TEMP_GOALS[CONFIG.unlockedBy[id]]?calmEndHint():hintOf(id));keep.add(el)}}
  // sections
  const tab=S()?.tab;
  for(const d of CONFIG.sectionDims){
    if(untilDone(d.until))continue;if(d.tab&&d.tab!==tab)continue;const hint=hintFor(d.until);
    if(d.sel){for(const el of qa('#app .main '+d.sel)){if(el.classList.contains('on')||el.getAttribute('aria-selected')==='true')continue;setDim(el,hint);keep.add(el)}}
    if(d.heading){for(const h of qa('#app .main .heading')){if(!d.heading.test((h.textContent||'').trim()))continue;setDim(h,hint);keep.add(h);let n=h.nextElementSibling;while(n&&!n.classList.contains('heading')){if(n.id!=='uiux2-today'){n.dataset.uiux2Dim=hint;n.dataset.uiux2DimBody='1';keep.add(n)}n=n.nextElementSibling}}}
  }
  clearDims(keep);
}

/* ================= 4. quiet badges ================= */
function applyQuiet(){
  const html=document.documentElement;
  if(!active){delete html.dataset.uiux2Rings;for(const e of qa('[data-uiux2-quiet]'))delete e.dataset.uiux2Quiet;return}
  if(CONFIG.quietStoryRings)html.dataset.uiux2Rings='quiet';else delete html.dataset.uiux2Rings;
  const g=ST.goal||{},a=String(g.action||'');
  const relevant=new Set();if(g.tab)relevant.add('tab:'+(g.navTab||navTab(g.tab)));if(a.startsWith('dm:'))relevant.add('tab:circle');if(a==='activity')relevant.add('bell');
  const want=new Set();
  if(CONFIG.quietBadges){
    for(const b of qa('.nav .navbtn[data-tab]'))if(b.querySelector(':scope > b')&&!relevant.has('tab:'+b.dataset.tab))want.add(b);
    const bell=q('.topbar .bellbtn');if(bell&&bell.querySelector(':scope > b')&&!relevant.has('bell'))want.add(bell);
  }
  for(const e of qa('[data-uiux2-quiet]'))if(!want.has(e))delete e.dataset.uiux2Quiet;
  for(const e of want)e.dataset.uiux2Quiet='1';
}

/* ================= 3. pop-up / toast queue ================= */
const held=[];      // low-priority items collapsed into the pill: {kind,label,replay()}
const toastQ=[];    // spaced toasts waiting: {kind,run(),at}
let lastToastEnd=0,toastWasVisible=false,replaying=false;
function modalTop(){for(const [k,sel] of CONFIG.modalPriority){const e=q(sel);if(e&&e.isConnected&&!e.classList.contains('uiux2-held')&&visible(e))return k}return ''}
function modalAny(){for(const [,sel] of CONFIG.modalPriority){const e=q(sel);if(e&&e.isConnected)return true}return false}
function toastVisible(){
  const t=document.getElementById('toast');if(t&&!t.classList.contains('hidden')&&(t.textContent||'').trim())return true;
  if(qa('.scene-chapter148').some(e=>e.isConnected))return true;
  const b=document.getElementById('mo-banner');if(b&&b.style.opacity==='1')return true;
  if(q('.mo-pap'))return true;
  return false;
}
// motion's outcome banner supersedes a plain game toast that is still up (e.g. 'Posted' + the reward it caused)
function supersede(){if(!active||!CONFIG.bannerSupersedesToast)return;const b=document.getElementById('mo-banner'),t=document.getElementById('toast');if(b&&b.style.opacity==='1'&&t&&!t.classList.contains('hidden'))t.classList.add('hidden')}
function toastLaneBusy(){return toastVisible()||now()-lastToastEnd<CONFIG.toastGapMs}
// modal lane: keep only the highest-priority surface visible; hold the rest (CSS) until it closes
// reward feedback from motion (outcome banner + flying chips) or a game toast currently on screen
function rewardBusy(){const b=document.getElementById('mo-banner');if(b&&b.style.opacity==='1')return true;const l=document.getElementById('mo-layer');if(l&&l.childElementCount)return true;const t=document.getElementById('toast');return !!(t&&!t.classList.contains('hidden')&&(t.textContent||'').trim())}
const autoHeldSince=new WeakMap();let lastModalSeen=0;
function enforceModal(){
  const present=[];for(const [k,sel] of CONFIG.modalPriority)for(const e of qa(sel))if(e.isConnected)present.push([k,e]);
  if(present.length)lastModalSeen=now();
  if(!active){for(const [,e] of present)e.classList.remove('uiux2-held');return}
  let top=null;
  for(const [k,e] of present){
    if(!top){
      // game-opened surfaces (cinematic, level-up) wait for the reward banner/toast to finish, max autoHoldMs
      if(CONFIG.autoSurfaces.includes(k)&&rewardBusy()){if(!autoHeldSince.has(e))autoHeldSince.set(e,now());if(now()-autoHeldSince.get(e)<CONFIG.autoHoldMs){e.classList.add('uiux2-held');top=e;continue}}
      top=e;e.classList.remove('uiux2-held');continue}
    e.classList.add('uiux2-held')}
}
// game toast (app.js flash) -> spaced
let baseFlash=null;
function wrapFlash(){
  const f=window.flash;if(typeof f!=='function'||f.__uiux2)return;baseFlash=f;
  const w=function(t){if(!active||replaying)return baseFlash.apply(this,arguments);const args=arguments,self=this;
    if(!toastLaneBusy()&&!toastQ.length)return baseFlash.apply(self,args);
    if(toastQ.some(x=>x.kind==='flash'&&x.text===String(t)))return;
    toastQ.push({kind:'flash',text:String(t),at:now(),run:()=>baseFlash.apply(self,args)});pump()};
  w.__uiux2=true;w.__base=f;window.flash=w;try{flash=w}catch{}
}
// chapter banners (.scene-chapter148) are created inside gameplay-flow's closure: intercept on insert, replay a copy later
function interceptChapter(el){
  if(!active||el.dataset.uiux2Replay)return;
  if(!(toastLaneBusyExcept(el)||modalAny()))return;
  const html=el.innerHTML,cls=el.className;el.remove();
  toastQ.push({kind:'chapter',at:now(),needsNoModal:true,run:()=>{const c=document.createElement('div');c.className=cls;c.dataset.uiux2Replay='1';c.innerHTML=html;document.body.appendChild(c);setTimeout(()=>c.remove(),CONFIG.chapterMs)}});pump();
}
function toastLaneBusyExcept(el){const was=el.isConnected;const others=qa('.scene-chapter148').filter(x=>x!==el).length>0;const t=document.getElementById('toast');const tv=t&&!t.classList.contains('hidden')&&(t.textContent||'').trim();const b=document.getElementById('mo-banner');return !!(others||tv||(b&&b.style.opacity==='1')||q('.mo-pap')||now()-lastToastEnd<CONFIG.toastGapMs)}
let pumpT=0;
function pump(){
  clearTimeout(pumpT);
  const vis=toastVisible();if(toastWasVisible&&!vis)lastToastEnd=now();toastWasVisible=vis;
  if(!toastQ.length)return;
  const head=toastQ[0],overdue=now()-head.at>CONFIG.maxToastWaitMs&&head.kind==='flash';
  const blockedByModal=head.needsNoModal&&(modalAny()||now()-lastModalSeen<CONFIG.settleAfterModalMs);
  if(!active||overdue||(!vis&&now()-lastToastEnd>=CONFIG.toastGapMs&&!blockedByModal)){toastQ.shift();replaying=true;try{head.run()}catch(e){console.warn('uiux2 toast',e)}finally{replaying=false}toastWasVisible=true}
  pumpT=setTimeout(pump,150);
}
// motion3 tabloid/phone: hook the shared motion API (sceneFX._int) — motion3 reads it at call time
function wrapMotion(){
  const I=window.sceneFX?._int;if(!I)return;
  if(typeof I.blocked==='function'&&!I.blocked.__uiux2){const b=I.blocked;const w=function(){return b.apply(this,arguments)||(active&&(toastLaneBusy()||toastQ.length>0))};w.__uiux2=true;w.__base=b;I.blocked=w}
  if(typeof I.notifStack==='function'&&!I.notifStack.__uiux2){const b=I.notifStack;const w=function(items,o){
      if(!(o&&o.lock)||replaying)return b.apply(this,arguments);
      const d=phoneDecision();
      if(d==='drop'){capped.phone++;return}
      if(d==='quiet'){capped.phoneQuiet++;return}
      if(d==='hold'){const args=arguments,self=this;for(let i=held.length-1;i>=0;i--)if(held[i].kind==='phone')held.splice(i,1); // keep only the latest
        held.push({kind:'phone',label:o.title||'',replay:()=>{if(capMem.phoneDays.has(dayNow())){capped.phone++;return}capMem.phoneDays.add(dayNow());b.apply(self,args)}});renderPill();return}
      capMem.phoneDays.add(dayNow());return b.apply(this,arguments)};w.__uiux2=true;w.__base=b;I.notifStack=w}
}
// "N new posts" pill (scene-director) is low priority: hidden by CSS while active and counted in our pill
function newPostsHeld(){return active&&CONFIG.lowPriority.newPostsPill&&!!document.getElementById('scene-newposts157')}
function pillCount(){return held.length+(newPostsHeld()?1:0)}
function renderPill(){
  let pill=document.getElementById('uiux2-pill');const n=active?pillCount():0;
  const show=n>0&&S()?.tab==='feed'&&!modalAny();
  if(!show){pill?.remove();return}
  if(!pill){pill=document.createElement('button');pill.type='button';pill.id='uiux2-pill';pill.className='uiux2-pill';pill.onclick=releasePill;document.body.appendChild(pill)}
  const hud=q('.topbar');const top=hud?Math.max(8,Math.min(hud.getBoundingClientRect().bottom+8,200)):12;pill.style.top=top+'px';
  const txt=n===1?UI_COPY.update:fill(UI_COPY.updates,{n});if(pill.textContent!==txt)pill.textContent=txt;
}
function releasePill(){
  document.getElementById('uiux2-pill')?.remove();
  const items=held.splice(0);const np=document.getElementById('scene-newposts157');
  if(np&&CONFIG.lowPriority.newPostsPill){replaying=true;try{np.click()}finally{replaying=false}}
  // replay one at a time, spaced, never over a modal
  let i=0;const next=()=>{if(i>=items.length)return;if(modalTop()||q('.mo-notifs')){setTimeout(next,600);return}const it=items[i++];replaying=true;try{it.replay()}catch(e){console.warn('uiux2 replay',e)}finally{replaying=false}setTimeout(next,6200)};setTimeout(next,np?700:0);
}
function release(){ // kill-switch path: let everything held go
  for(const e of qa('.uiux2-held'))e.classList.remove('uiux2-held');
  while(toastQ.length){const h=toastQ.shift();try{if(h.kind!=='chapter')h.run()}catch{}}
  held.splice(0);document.getElementById('uiux2-pill')?.remove();
}

/* ================= caps (one blow-up per day, rewind dedupe, merged level-ups, viral only on real views) ================= */
const capsOn=()=>window.SCENE_CALM_DAY1!==false&&window.SCENE_POPUP_CAPS!==false;
const dayNow=()=>Number(S()?.sceneDay)||0;
const capped={phone:0,rewind:0,level:0,viral:0,phoneQuiet:0};
const capMem={phoneDays:new Set(),rewindKeys:new Set(),lastRewind:0,lastLevel:0,viralDays:new Set()};
function classifyRecent(){ // SCENE_NEXT.classify(n) -> 'now'|'queue'|'quiet' over the notifications the blow-up would show
  const c=window.SCENE_NEXT?.classify;if(typeof c!=='function')return null;
  const since=now()-15*60000,out=[];for(const n of (S()?.notifications||[]).filter(x=>(x.at||0)>=since).slice(0,6)){try{out.push(c(n))}catch{}}return out}
function phoneDecision(){
  if(!capsOn())return 'show';
  if(capMem.phoneDays.has(dayNow()))return 'drop'; // phonePerDay=1
  const cls=classifyRecent();if(cls&&cls.length&&cls.every(x=>x==='quiet'))return 'quiet';
  if(active&&CONFIG.lowPriority.phoneBlowup&&!(cls&&cls.includes('now')))return 'hold';
  return 'show';
}
function viewsBacked(){try{const p=S()?.player||{};const post=(S()?.posts||[]).find(x=>x.authorId==='player');if(!post)return false;const m=typeof metricsFor==='function'?metricsFor(post):post;const v=Number(m?.views)||0;return v>=Math.max(CONFIG.caps.viralMinViews,(Number(p.followers)||0)*CONFIG.caps.viralFollowerMult)}catch{return false}}
let lastTrendKill=0;
function capNode(n){
  if(!capsOn())return;
  if(n.classList.contains('mo-rewind')){
    const key=n.getAttribute('aria-label')||String(dayNow());
    if(capMem.rewindKeys.has(key)||now()-capMem.lastRewind<CONFIG.caps.rewindMinGapMs){n.classList.add('uiux2-held');capped.rewind++;queueMicrotask(()=>{const sk=n.querySelector('.mo-rw-skip');if(sk)sk.click();else n.remove()});return}
    capMem.rewindKeys.add(key);capMem.lastRewind=now();n.dataset.uiux2Ok='1';return}
  if(n.id==='scene-overlay157'&&/level\s*up/i.test(n.textContent||'')){
    if(now()-capMem.lastLevel<CONFIG.caps.levelMergeMs){capped.level++;n.remove();return}
    capMem.lastLevel=now();return}
  if(n.classList.contains('mo-trend')){
    if(!viewsBacked()||capMem.viralDays.has(dayNow())){capped.viral++;lastTrendKill=now();n.remove();for(const x of qa('.mo-notifs:not(.mo-lock)'))x.remove();return}
    capMem.viralDays.add(dayNow());return}
  if(n.classList.contains('mo-notifs')&&!n.classList.contains('mo-lock')&&now()-lastTrendKill<300){n.remove();return}
}

/* ================= public entry point: window.SCENE_POPQ ================= */
// push({id, kind, title, body, rewards?:{money,xp,gems,followers}, priority?:'now'|'queue'|'quiet'})
//  - dedupe by id (per page session)
//  - priority missing -> SCENE_NEXT.classify(item) when present, else 'queue'
//  - 'now'   -> next free toast slot (spaced like every other toast)
//  - 'queue' -> waits until no modal is open (and, during calm mode, collapses into the "N updates" pill)
//  - 'quiet' -> not shown (kept in SCENE_POPQ.quiet() for debugging; the game's own bell is unaffected)
//  - kind 'reward' reuses motion.js's outcome banner (#mo-banner). DISPLAY ONLY: applying the reward is Gameplay
//    Logic's job (e.g. claimQuest). Reward ids already shown are persisted (last 200) in state.motionFX.popqShown via
//    motion's own sceneFX._int.mstore()/persist(), so a reward can't show twice after a reload.
//    Title/body text is shown as given (never rewritten).
const popSeen=new Set(),popQuiet=[];let popPending=0;
const POPQ_KEEP=200;
function mstoreSafe(){try{return window.sceneFX?._int?.mstore?.()||null}catch{return null}}
function rewardShown(id){const m=mstoreSafe();return !!(m&&Array.isArray(m.popqShown)&&m.popqShown.includes(id))}
function markRewardShown(id){const m=mstoreSafe();if(!m)return;const a=Array.isArray(m.popqShown)?m.popqShown.filter(x=>x!==id):[];a.push(id);m.popqShown=a.slice(-POPQ_KEEP);try{window.sceneFX._int.persist?.()}catch{}}
function showRewardBanner(r){
  let b=document.getElementById('mo-banner'),own=false;
  // motion creates #mo-banner lazily; if it doesn't exist yet, borrow the same element/id (styled by motion.css) and remove it afterwards
  if(!b&&document.getElementById('mo-css')){b=document.createElement('div');b.id='mo-banner';b.dataset.uiux2Own='1';document.body.appendChild(b);own=true}
  const ord=[['followers','followers'],['xp','XP'],['money','cash'],['gems','diamonds']];
  const parts=ord.filter(([k])=>Number(r?.[k])).map(([k,l])=>{const v=Number(r[k]);return `<span class="${v<0?'neg':''}"><b>${v<0?'−':'+'}${k==='money'?'$':''}${esc(Math.abs(v).toLocaleString())}</b> ${esc(l)}</span>`});
  if(!b||!parts.length)return false;
  b.innerHTML=`<small>OUTCOME · NICE</small><div class="mo-row">${parts.join('')}</div>`;
  const head=q('.topbar');b.style.top=(head?Math.max(8,Math.min(head.getBoundingClientRect().bottom+8,180)):12)+'px';b.style.opacity='1';b.style.transform='translate(-50%,0)';
  setTimeout(()=>{if(b.style.opacity==='1'){b.style.opacity='0';b.style.transform='translate(-50%,-140%)'}if(own)setTimeout(()=>b.remove(),600)},2600);return true;
}
function runPop(it){
  const text=[it.title,it.body].filter(Boolean).join(' — ');
  if(it.kind==='reward'&&it.rewards){
    if(rewardShown(it.id))return;markRewardShown(it.id);
    const shown=showRewardBanner(it.rewards);const f=baseFlash||window.flash;
    if(!shown&&text&&f)f(text);
    else if(shown&&text&&f)setTimeout(()=>{toastQ.push({kind:'popq',at:now(),run:()=>f(text)});pump()},2800);
    return}
  if(text)(baseFlash||window.flash)?.(text);
}
const SCENE_POPQ={
  push(item){
    if(!item||typeof item!=='object')return false;const id=String(item.id??'');if(!id||popSeen.has(id))return false;if(item.kind==='reward'&&rewardShown(id))return false;popSeen.add(id);
    let pr=item.priority;if(!['now','queue','quiet'].includes(pr)){pr='queue';try{const c=window.SCENE_NEXT?.classify;if(typeof c==='function'){const r=c({id,kind:item.kind,text:item.title||item.body||'',title:item.title,body:item.body,at:now(),unread:true});if(['now','queue','quiet'].includes(r))pr=r}}catch{}}
    const it={...item,id,priority:pr,at:now()};
    if(pr==='quiet'){popQuiet.push(it);return 'quiet'}
    popPending++;const done=()=>{popPending=Math.max(0,popPending-1)};
    if(pr==='queue'&&active&&window.SCENE_CALM_DAY1!==false){held.push({kind:'popq',id,label:it.title||'',replay:()=>{done();runPop(it)}});renderPill();return 'queue'}
    toastQ.push({kind:'popq',at:now(),needsNoModal:pr==='queue',run:()=>{done();runPop(it)}});pump();return pr;
  },
  size(){return popPending},
  quiet(){return popQuiet.slice()},
};
window.SCENE_POPQ=SCENE_POPQ;

/* ================= main loop ================= */
let lastSig='';
function apply(){
  try{
    ST=readState();
    const was=active;active=eligible();
    const html=document.documentElement;
    if(active)html.dataset.uiux2='on';else delete html.dataset.uiux2;
    if(capsOn())html.dataset.uiux2Caps='on';else{delete html.dataset.uiux2Caps;for(const r of qa('.mo-rewind'))r.dataset.uiux2Ok='1'}
    if(active&&CONFIG.hideGameNextMove)html.dataset.uiux2Nextmove=CONFIG.todayOtherTabs==='compact'?'hide':'feed';else delete html.dataset.uiux2Nextmove;
    if(was&&!active)release();
    if(S()?.tab==='world'){const op=q('#app .main [data-story-op]');if(op)lastStoryOpText=(op.querySelector('h3,h4,strong,b')?.textContent||op.textContent||'').replace(/\s+/g,' ').trim().slice(0,90)}
    for(const r of qa('.mo-rewind:not([data-uiux2-ok]):not(.uiux2-held)'))capNode(r); // safety net if the observer missed one
    renderToday();applyDims();applyQuiet();enforceModal();renderPill();
  }catch(e){console.warn('uiux2',e)}
}
let qd=false;const soon=()=>{if(qd)return;qd=true;queueMicrotask(()=>{qd=false;apply()})};
function boot(){
  wrapFlash();wrapMotion();
  const app=document.getElementById('app');if(app)new MutationObserver(soon).observe(app,{childList:true});
  const m=document.getElementById('modal');if(m)new MutationObserver(()=>{enforceModal();renderPill()}).observe(m,{childList:true});
  new MutationObserver(recs=>{for(const r of recs)for(const n of r.addedNodes){if(n.nodeType!==1)continue;if(n.classList.contains('scene-chapter148'))interceptChapter(n);try{capNode(n)}catch(e){console.warn('uiux2 cap',e)}}enforceModal();renderPill()}).observe(document.body,{childList:true});
  addEventListener('scene:day1-changed',soon);
  setInterval(()=>{wrapFlash();wrapMotion();apply();
    // TEMP stand-in emits the same event so listeners get exercised; the real SCENE_DAY1 emits its own
    if(day1()===TEMP_DAY1){const sig=JSON.stringify([ST.goal?.id,ST.goal?.title,ST.unlockedTabs,ST.done]);if(lastSig&&sig!==lastSig)dispatchEvent(new CustomEvent('scene:day1-changed',{detail:{source:'uiux2-temp',state:ST}}));lastSig=sig}
  },500);
  setInterval(pump,400);setInterval(()=>{if(active){enforceModal();supersede()}},200);
  apply();
  window.sceneUiux2={version:'uiux2-1',config:CONFIG,goalOrder:GOAL_ORDER,copy:UI_COPY,
    status:()=>({active,source:ST.source,goal:ST.goal&&{id:ST.goal.id,title:ST.goal.title,tab:ST.goal.tab,action:ST.goal.action},unlockedTabs:ST.unlockedTabs,done:ST.done,queuedToasts:toastQ.length,held:pillCount(),day:S()?.sceneDay,capped:{...capped},capsOn:capsOn()}),
    getState:readState,go:()=>goTo(ST.goal),release:releasePill,refresh:apply,_temp:TEMP_DAY1};
}
(function wait(n=0){
  const ready=typeof window.render==='function'&&!document.querySelector('.migrationboot')&&(window.sceneFX||n>80);
  if(ready)return setTimeout(boot,0);if(n<900)setTimeout(()=>wait(n+1),100);
})();
})();
