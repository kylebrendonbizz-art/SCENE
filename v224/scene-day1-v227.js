/* SCENE day-one goal sequencer v227 (logic only, additive).
   Reads existing save state; the only thing it writes is state.day1_227 (progress record).
   Never changes relationships, economy, Kim's resolver, music or the registry, and never locks anything itself:
   UI/UX reads getState() and decides what to hide/dim.
   API: window.SCENE_DAY1.getState() -> {goal:{id,title,detail,tab,action}|null, unlockedTabs:[...], done}
        window event 'scene:day1-changed' {detail: <same object>} whenever the result changes. */
(()=>{
'use strict';
if(globalThis.SCENE_DAY1)return;
const V=227;
const ALL_TABS=['feed','circle','you','career','career.work','circle.people','career.travel','career.resources'];
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const first=a=>String(a?.name||'').split(/\s+/)[0]||'your friend';
const clip=(t,n=70)=>{t=String(t||'').replace(/\s+/g,' ').trim();return t.length>n?t.slice(0,n-1).trim()+'…':t};
const fs148=()=>S()?.firstSession148||null;
const friend=()=>{const id=fs148()?.friendId;try{return id&&typeof byId==='function'?byId(id):null}catch{return null}};
const thread=id=>(S()?.dms||[]).find(d=>d.id===id)||null;
const outboundSince=(id,t)=>(thread(id)?.messages||[]).some(m=>m.from==='me'&&(m.at||0)>=t);
const posts=()=>{try{return typeof playerPosts==='function'?playerPosts():(S()?.posts||[]).filter(p=>p.authorId==='player')}catch{return[]}};
const mem=()=>S()?.memory||[];
const stage=()=>Number(fs148()?.stage)||0;
const quests=()=>S()?.missions?.quests||[];
function lastMove(){const f=fs148()||{},floor=f.careerStartedAt||f.choiceAt||0;return mem().find(m=>(m.type==='gig'||m.type==='story_choice')&&(m.at||0)>=floor)||null}
function rec(){const s=S();if(!s?.player)return null;if(!s.day1_227||s.day1_227.v!==V){const legacy=isLegacy();s.day1_227={v:V,startedAt:Date.now(),legacy,done:legacy,completed:{}};try{save()}catch{}}return s.day1_227}
function isLegacy(){const s=S(),p=s.player||{},f=s.firstSession148;
  // Never lock an existing career: v148 already flagged it, or it is clearly past day one.
  return Boolean(f?.existingCareer)||(Number(s.sceneDay)||0)>=4||(Number(p.fame)||0)>=10||(Number(p.followers)||0)>=1000||(Number(s.jobsDone)||0)>=3||posts().length>=5}

/* Ordered goals. check() = readable state test for "done". unlocks = tabs opened when this goal is done. */
const GOALS=[
 {id:'pick_friend',unlocks:['circle'],tab:'feed',action:'picker',
  check:()=>Boolean(fs148()?.friendId),
  title:()=>'Pick who already knows you',detail:()=>'One celebrity friend who follows you back from the start.'},
 {id:'reply_friend',unlocks:[],tab:'circle',action:()=>`dm:${fs148()?.friendId||''}`,
  check:()=>stage()>=2||Boolean(fs148()?.repliedAt)||outboundSince(fs148()?.friendId,0),
  title:()=>`Reply to ${first(friend())}`,detail:()=>{const m=(thread(fs148()?.friendId)?.messages||[]).find(x=>x.kind==='scene-starter148');return m?`“${clip(m.text)}”`:`${first(friend())} texted you first.`}},
 {id:'first_post',unlocks:['you'],tab:'feed',action:'compose',
  check:()=>stage()>=3||Boolean(fs148()?.postReacted),
  title:()=>'Post your first look',detail:()=>`${first(friend())} is waiting to see it.`},
 {id:'answer_ripple',unlocks:['career'],tab:'feed',action:'ripple',
  check:()=>stage()>=4||Boolean(fs148()?.choiceAt),
  title:()=>`Decide how to play ${first(friend())}'s comment`,detail:()=>{const n=Number(fs148()?.rippleFollowers)||0;return n?`${n} people followed you after it. Your call changes the friendship.`:'Your call changes the friendship.'}},
 {id:'first_booking',unlocks:['career.work'],tab:'career',action:'firstgig',
  check:()=>Boolean(fs148()?.completed),
  title:()=>'Take your first booking',detail:()=>`One room in ${S()?.player?.city||'Los Angeles'}.`},
 {id:'tell_friend',unlocks:['circle.people'],tab:'circle',action:()=>`dm:${fs148()?.friendId||''}`,
  check:()=>{const f=fs148()||{};return outboundSince(f.friendId,f.completedAt||Infinity)},
  title:()=>`Tell ${first(friend())} how it went`,detail:()=>`${first(friend())} hasn't heard about your first booking yet.`},
 {id:'paid_job',unlocks:['career.travel'],tab:'career.work',action:'career:work',
  check:()=>(Number(S()?.jobsDone)||0)>=1,
  title:()=>'Book a paid job',detail:()=>`Opportunities has work in ${S()?.player?.city||'Los Angeles'}. Pay and energy are on each card.`},
 {id:'second_post',unlocks:[],tab:'feed',action:'compose',
  check:()=>posts().length>=2,
  title:()=>'Post about the job',detail:()=>mem().some(m=>m.type==='gig')?'Nobody outside the room knows how the job went yet.':'Your second post starts a timeline.'},
 {id:'first_story_beat',unlocks:['career.resources'],tab:'career',action:()=>{try{return globalThis.SCENE_STORY169?.objective?.()?.action||'career:story'}catch{return'career:story'}},
  // Side quests (state.missions.quests) are not rendered by the v48 Career view, so the last day-one goal is the first real story-brain decision.
  check:()=>{try{return (globalThis.SCENE_STORY169?.inspect?.().history||[]).some(b=>b.type&&b.type!=='reaction')}catch{return false}},
  title:()=>{try{return globalThis.SCENE_STORY169?.objective?.()?.title||'Make your next story call'}catch{return'Make your next story call'}},
  detail:()=>{try{return globalThis.SCENE_STORY169?.objective?.()?.sub||'Your first booking left a decision open.'}catch{return'Your first booking left a decision open.'}}}
];

function compute(){
  const s=S();if(!s?.player)return{goal:null,unlockedTabs:[],done:false};
  const r=rec();if(r.done)return{goal:null,unlockedTabs:[...ALL_TABS],done:true};
  const tabs=new Set(['feed']);let goal=null,changed=false;
  for(const g of GOALS){
    let ok=Boolean(r.completed[g.id]);
    if(!ok){try{ok=Boolean(g.check())}catch{ok=false}if(ok){r.completed[g.id]=Date.now();changed=true}}
    if(ok){g.unlocks.forEach(t=>tabs.add(t));continue}
    if(!goal){const act=typeof g.action==='function'?g.action():g.action;goal={id:g.id,title:g.title(),detail:g.detail(),tab:g.tab,action:act}}
  }
  // Goals done out of order still count; the current goal is the first unfinished one. Tabs only open on completion.
  if(!goal){r.done=true;r.doneAt=Date.now();changed=true}
  if(changed){try{save()}catch{}}
  return r.done?{goal:null,unlockedTabs:[...ALL_TABS],done:true}:{goal,unlockedTabs:ALL_TABS.filter(t=>tabs.has(t)),done:false};
}
let lastSig='';
function tick(){let st;try{st=compute()}catch(e){return}const sig=JSON.stringify(st);if(sig!==lastSig){lastSig=sig;try{dispatchEvent(new CustomEvent('scene:day1-changed',{detail:st}))}catch{}}return st}
globalThis.SCENE_DAY1={version:V,getState:()=>{const st=compute();const sig=JSON.stringify(st);if(sig!==lastSig){lastSig=sig;try{dispatchEvent(new CustomEvent('scene:day1-changed',{detail:st}))}catch{}}return st},goals:GOALS.map(g=>g.id),allTabs:[...ALL_TABS],
  inspect:()=>({record:S()?.day1_227||null,state:compute()})};
try{if(typeof render==='function'){const base=render;render=function(){const out=base.apply(this,arguments);setTimeout(tick,0);return out}}}catch{}
setInterval(()=>{if(!document.hidden)tick()},1000);
tick();
})();
