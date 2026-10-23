/* SCENE "Next up" driver v227 (logic only, additive; load after scene-day1-v227.js).
   One main beat per game day, max 2 side items, everything else counted as queued.
   Reads existing state (story brain v169 queue, pendingEvent, quests, DMs, notifications); writes only state.next227.
   It never changes relationships, economy, Kim, music or the registry, and it never deletes notifications.
   API: SCENE_NEXT.getState() -> {beat:{id,title,hook,tab,action}|null, sideItems:[{id,title,tab,action}](<=2), queued:n, unlockedTabs:[...]}
        window event 'scene:next-changed' {detail:<same>} ; SCENE_NEXT.classify(notification) -> 'now'|'queue'|'quiet' */
(()=>{
'use strict';
if(globalThis.SCENE_NEXT)return;
const V=227,ALL_TABS=['feed','circle','you','career','career.work','circle.people','career.travel','career.resources'];
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const who=id=>{try{return typeof byId==='function'?byId(id):null}catch{return null}};
const first=a=>String(a?.name||'').split(/\s+/)[0]||'';
const clip=(t,n=90)=>{t=String(t||'').replace(/\s+/g,' ').trim();return t.length>n?t.slice(0,n-1).trim()+'…':t};
const PLAYER_MOVES=new Set(['player_post','dm_sent','gig','story_choice','event','travel','comment','hangout','starter_choice']);
const friendId=()=>S()?.firstSession148?.friendId||'';
function lastPlayerMoveAt(){for(const m of S()?.memory||[])if(PLAYER_MOVES.has(m.type))return Number(m.at)||0;return 0}
function rec(){const s=S();if(!s?.player)return null;if(!s.next227||s.next227.v!==V){s.next227={v:V,day:Number(s.sceneDay)||0,beatId:'',beatSince:Date.now(),resolved:[]};try{save()}catch{}}return s.next227}
const tabForStory={event:'career',career:'career',dm:'circle',compose:'feed',reaction:'feed'};
function storyBeat(){
  const S169=globalThis.SCENE_STORY169;if(!S169?.objective)return null;let o=null,raw=null;
  try{o=S169.objective()}catch{}if(!o)return null;
  try{raw=(S169.inspect?.().queue||[])[0]||null}catch{}
  const type=raw?.type||'',actor=raw?.actorId||'';
  return{id:String(o.action||'story').replace(/^story169:/,'story:'),title:o.title,hook:o.sub||'',tab:tabForStory[type]||'career',action:o.action,actorId:actor,type};
}
function storyQueueLen(){try{return (globalThis.SCENE_STORY169?.inspect?.().queue||[]).length}catch{return 0}}
function unreadDms(){return (S()?.dms||[]).filter(d=>d.unread&&d.messages?.length&&d.messages[d.messages.length-1]?.from==='them')}
function claimable(){return (S()?.missions?.quests||[]).filter(q=>q.done&&!q.claimed)}
function pendingEventItem(){const e=S()?.pendingEvent;return e?{id:'event:'+clip(e.title,40),title:e.title||'A live situation',tab:'career',action:'event'}:null}
function dmItem(d){const a=who(d.id);return a?{id:'dm:'+d.id,title:`${a.name}: “${clip(d.messages[d.messages.length-1].text,60)}”`,tab:'circle',action:'dm:'+d.id}:null}

function compute(){
  const s=S();if(!s?.player)return{beat:null,sideItems:[],queued:0,unlockedTabs:[]};
  const d1=globalThis.SCENE_DAY1?.getState?.();
  const dms=unreadDms(),quests=claimable();
  if(d1&&!d1.done){
    const g=d1.goal,q=dms.filter(d=>!(g&&g.action==='dm:'+d.id)).length+storyQueueLen();
    return{beat:g?{id:'day1:'+g.id,title:g.title,hook:g.detail,tab:g.tab,action:g.action}:null,sideItems:[],queued:q,unlockedTabs:d1.unlockedTabs};
  }
  const r=rec();
  let beat=storyBeat(),usedPending=false;
  if(!beat){const e=pendingEventItem();if(e){beat={id:e.id,title:e.title,hook:clip(s.pendingEvent?.body||'',160),tab:'career',action:'event'};usedPending=true}}
  if(!beat)beat={id:'career:work',title:'Take the next booking',hook:`Opportunities in ${s.player.city||'Los Angeles'} refresh after each job.`,tab:'career.work',action:'career:work'};
  // Day/beat bookkeeping: a new beat id means the previous one resolved (story brain advanced or the day moved).
  if(r.beatId!==beat.id){if(r.beatId){r.resolved.unshift({id:r.beatId,at:Date.now(),day:Number(s.sceneDay)||0});r.resolved=r.resolved.slice(0,40)}r.beatId=beat.id;r.beatSince=Date.now();r.day=Number(s.sceneDay)||0;try{save()}catch{}}
  // Side items in priority order; the list releases one at a time as items clear.
  const cand=[];const beatActor=beat.actorId||'';
  const fid=friendId();
  const prio=[...dms].sort((a,b)=>(b.id===beatActor)-(a.id===beatActor)||(b.id===fid)-(a.id===fid)||((b.lastInboundAt||0)-(a.lastInboundAt||0)));
  const dmFirst=prio.find(d=>'dm:'+d.id!==beat.action);if(dmFirst){const it=dmItem(dmFirst);if(it)cand.push(it)}
  // Claimable side quests are NOT offered: the v48 Career view renders no [data-quest] button (verified headless). Re-enable once UI renders them.
  if(!usedPending){const e=pendingEventItem();if(e)cand.push(e)}
  for(const d of prio)if(d!==dmFirst&&'dm:'+d.id!==beat.action){const it=dmItem(d);if(it)cand.push(it)}
  const sideItems=cand.slice(0,2).map(({id,title,tab,action})=>({id,title,tab,action}));
  const queuedNotifs=(s.notifications||[]).filter(n=>n.unread&&(n.at||0)>=r.beatSince&&classify(n)==='queue').length;
  const queued=Math.max(0,cand.length-sideItems.length)+Math.max(0,storyQueueLen()-1)+queuedNotifs;
  const {actorId,type,...pub}=beat;
  return{beat:pub,sideItems,queued,unlockedTabs:d1?.unlockedTabs?.length?d1.unlockedTabs:[...ALL_TABS]};
}
/* Pop-up policy (for UI/UX's queue). 'now' = direct result of the player's own last move or a reply in a thread they wrote to;
   'quiet' = passive counters (bell badge only); 'queue' = everything else, shown one at a time after the current beat resolves. */
const QUIET_KINDS=new Set(['like','follow','world','reply']);
function classify(n){
  if(!n)return'quiet';const kind=String(n.kind||''),text=String(n.text||''),at=Number(n.at)||0,s=S();
  const sinceMove=at-lastPlayerMoveAt();
  if(kind==='dm'&&n.celebrityId){const d=(s?.dms||[]).find(x=>x.id===n.celebrityId);const wrote=(d?.messages||[]).some(m=>m.from==='me');if(wrote&&/replied to you/.test(text))return'now';if(n.celebrityId===friendId())return'now';return'queue'}
  if(QUIET_KINDS.has(kind)&&!n.celebrityId)return'quiet';
  if(/^Day \d+ begins|^While you were away|^Level \d+ reached · \+\d+ diamond/.test(text))return'quiet';
  if(sinceMove>=0&&sinceMove<15000&&['career','comment','connection','fame','follow'].includes(kind))return'now';
  return'queue';
}
let lastSig='';
function emit(st){const sig=JSON.stringify(st);if(sig!==lastSig){lastSig=sig;try{dispatchEvent(new CustomEvent('scene:next-changed',{detail:st}))}catch{}}return st}
function tick(){try{return emit(compute())}catch(e){}}
globalThis.SCENE_NEXT={version:V,getState:()=>emit(compute()),classify,inspect:()=>({record:S()?.next227||null,state:compute()})};
try{if(typeof render==='function'){const base=render;render=function(){const out=base.apply(this,arguments);setTimeout(tick,0);return out}}}catch{}
addEventListener('scene:day1-changed',()=>setTimeout(tick,0));
setInterval(()=>{if(!document.hidden)tick()},1000);
tick();
})();
