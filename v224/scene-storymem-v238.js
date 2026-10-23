/* SCENE storymem238 (Gameplay Logic, 2026-10-10): story memory. Additive, offline, rules-based, no AI, no money.
   RECORD (state.storymem238.recent, cap 20, newest first): travel-card flops (worldflow236 + eventchain231 resolved cards with
   outcome 'flop'), gossip starts/steps (worldflow236 gossip chain; seed text captured from the player's DM/post), brand drops
   (player post/DM that SCENE_EVENTCHAIN.classifyDm reads as brag with a brand slot). Private topics never recorded.
   USE (next GAME day, state.sceneDay): one consequence beat per game day for the newest unused memory from a previous day:
     - chapter line (Writer memory.<celeb>.<trigger>.chapter) written into that day's existing 'Day N begins' bell row (no new pop)
     - one DM from the reactor celeb (memory.<celeb>.<trigger>.dm); for a worldflow flop with the same celeb it REPLACES the
       generic worldflow next-day card DM (no double DM)
     - one outlet news post + reactor comment (memory.<celeb>.<trigger>.news/.comment) unless worldflow's own gossip pickup posts today
     - travel flop (worldflow) -> the same city card comes back as today's card (skips the random card once) = chapter moves
   Worldflow's generic gossip/flop lines (wf.gossip.news.*, wf.gossip.comment.celeb, wf.gossip.dm.*, wf.card.dm/news.flop) are
   swapped for memory-grounded lines while a matching memory exists (Proxy over window.SCENE_WORLDFLOW_LINES; passthrough otherwise).
   Reactor = memory celeb if Writer covers it (kim/britney/kylie), else the covered celeb with the highest friendship.
   Copy: window.SCENE_STORYMEM_LINES (v224/storymem-lines-v238.js, dev/sync-storymem-lines.mjs); neutral fact templates below.
   Every served line must contain a memory fact (city/brand/claim/celeb) or come from a Writer trigger key.
   Save: ONE new key state.storymem238 (lazy; old saves load). Kill switch window.SCENE_STORYMEM_OFF=true (checked on every hook). */
(()=>{
'use strict';
if(window.SCENE_STORYMEM)return;
const V=238,OFF=()=>window.SCENE_STORYMEM_OFF===true,CAP=20,WRITER=['kim','britney','kylie'],OUTLETS=['popbase','tmz','enews','people'];
const PRIVATE=/\b(kids?|children|child|daughters?|sons?|baby|babies|stormi|north|kanye|ye|pregnan\w*|health|rehab|conservator\w*)\b/i;
const T=()=>Date.now();
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const S0=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const G=n=>{try{return globalThis[n]}catch{return undefined}};
const who=id=>{try{return byId(id)}catch{return null}};
const first=a=>String(a?.name||'').split(/\s+/)[0]||'';
const day=()=>Number(S0()?.sceneDay)||0;
const fr=id=>Number(S0()?.relations?.[id]?.friendship)||0;
const save0=()=>{try{save()}catch{}};
const TRIG={'travel-flop':'travelFlop',gossip:'gossipStart','brand-drop':'brandDrop'};
/* neutral fact-grounded fallbacks (used when a Writer key is missing, and for worldflow line swaps) */
const NEUTRAL={
 'travelFlop.news':["{player}'s {city} trip flopped yesterday, and {celeb} has not posted about it."],
 'travelFlop.dm':['still thinking about {city} yesterday? it flopped. we go again'],
 'travelFlop.comment':['{city} flop or not, next one counts'],
 'travelFlop.chapter':['The {city} flop from yesterday is still in your mentions. Today starts with fixing it.'],
 'gossipStart.news':["Yesterday's '{claim}' talk around {player} is still going today. Nothing confirmed."],
 'gossipStart.dm':["'{claim}' is still going around from yesterday. you good?"],
 'gossipStart.comment':["not touching the '{claim}' thing"],
 'gossipStart.chapter':["Yesterday's '{claim}' gossip did not go away overnight. Today you deal with it."],
 'brandDrop.news':['{player} name-dropped {brand} yesterday. No deal has been confirmed.'],
 'brandDrop.dm':['you said {brand} yesterday. is that real?'],
 'brandDrop.comment':['{brand} already?'],
 'brandDrop.chapter':['You said {brand} in public yesterday. Today someone wants to know if it is real.']};
const WFSWAP={ /* worldflow key -> neutral memory-grounded template (filled by us; worldflow sees plain text) */
 'wf.gossip.news':["Yesterday's '{claim}' talk around {player} made the timeline today. Nothing confirmed.","{player} and '{claim}': yesterday's gossip is still going. Nobody has confirmed it."],
 'wf.gossip.comment.celeb':["saw the '{claim}' thing. not getting into it"],
 'wf.gossip.dm':["'{claim}' is still going around from the other day. you good?"],
 'wf.card.news.flop':["{player}'s {city} trip with {celeb} flopped, fans say."],
 'wf.card.dm.flop':['still thinking about {city} yesterday? it flopped. we go again'],
 'wf.card.comment.flop':['{city} flop. next time']};

/* ---------- state ---------- */
function sm(){const s=S0();if(!s)return null;let m=s.storymem238;if(!m||typeof m!=='object')m=s.storymem238={v:V};
  m.recent=Array.isArray(m.recent)?m.recent:[];m.seen=Array.isArray(m.seen)?m.seen:[];m.beats=Array.isArray(m.beats)?m.beats:[];
  if(!Number.isFinite(m.beatDay))m.beatDay=-1;return m}
function seen(id){const m=sm();if(m.seen.includes(id))return true;m.seen.unshift(id);m.seen=m.seen.slice(0,80);return false}
function snip(t){let x=String(t||'').replace(/[{}"“”]/g,'').replace(/\s+/g,' ').trim();const ab=x.match(/\babout (.+)$/i);if(ab&&ab[1].split(' ').length>=1)x=ab[1];
  x=x.replace(/^(did you hear|have you heard|i heard|omg|lol|so|wait|btw|ok(ay)?)\b[\s,!.:-]*/i,'').replace(/^(the|a|an|that|this)\s+/i,'');const w=x.split(' ');return w.slice(0,7).join(' ').replace(/[.,!?;:]+$/,'')+(w.length>7?'…':'')}
function record(x){if(OFF()||!S0()?.player)return null;const m=sm();
  if(PRIVATE.test([x.text,x.claim,x.brand].join(' ')))return null;
  if(x.sourceId&&seen(x.kind+'|'+x.sourceId))return null;
  const e={id:'sm.'+day()+'.'+H(T()+JSON.stringify(x))%1e6,day:day(),kind:x.kind,city:x.city||'',celebId:x.celebId||'',brand:x.brand||'',claim:x.claim||'',text:String(x.text||'').slice(0,140),src:x.src||'',sourceId:x.sourceId||'',tpl:x.tpl||'',at:T()};
  m.recent.unshift(e);m.recent=m.recent.slice(0,CAP);save0();return e}

/* ---------- copy ---------- */
function slotsOf(e,extra={}){const p=S0()?.player||{};return{player:first(p)||p.name||'',handle:p.handle?('@'+String(p.handle).replace(/^@/,'')):(first(p)||''),city:e.city||'',brand:e.brand||'',claim:e.claim||'',celeb:e.celebId?(who(e.celebId)?.name||''):'',...extra}}
function fill(t,sl){let miss=false;const o=String(t).replace(/\{(player|handle|city|brand|claim|celeb)\}/g,(m,k)=>{const v=sl[k];if(v==null||v===''){miss=true;return''}return String(v)});return miss?null:o}
const grounded=(t,e,sl)=>[sl.city,sl.brand,sl.claim,sl.celeb].filter(Boolean).some(f=>t.toLowerCase().includes(String(f).toLowerCase()));
function pick(arr,sl,seed,needFact,e){if(!arr||!arr.length)return'';const n=arr.length,st=H(seed)%n;
  for(let i=0;i<n;i++){const t=fill(arr[(st+i)%n],sl);if(!t||PRIVATE.test(t))continue;if(needFact&&!grounded(t,e,sl))continue;return t}return''}
function vals(k){const W=G('SCENE_STORYMEM_LINES')||{},v=W[k];return(Array.isArray(v)?v:typeof v==='string'?[v]:[]).map(String).filter(x=>x.trim()&&!/\[PLACEHOLDER/.test(x))}
/* Writer trigger key first (trigger lines name their trigger), then neutral fact template (must contain a fact) */
function mline(e,reactor,ch,seed){const tr=TRIG[e.kind],sl=slotsOf(e);let t=pick(vals(`memory.${reactor}.${tr}.${ch}`),sl,seed+ch,false,e);
  if(!t)t=pick(NEUTRAL[`${tr}.${ch}`],{...sl,celeb:sl.celeb||first(who(reactor))},seed+ch,true,e);return t}
function reactorFor(e){if(WRITER.includes(e.celebId)&&who(e.celebId))return e.celebId;const xs=WRITER.filter(id=>who(id));return xs.sort((a,b)=>fr(b)-fr(a))[0]||''}

/* ---------- RECORD ---------- */
function scanCards(){
  const w=G('SCENE_WORLDFLOW')?.state?.();if(w)for(const c of w.cards?.active||[])if(c.status==='resolved'&&c.outcome==='flop')record({kind:'travel-flop',src:'worldflow236',sourceId:c.id,city:c.city,celebId:c.celebId,brand:c.brand,tpl:c.tpl,text:`${c.tpl} ${c.tone} flop`});
  const e=G('SCENE_EVENTCHAIN')?.state?.();if(e)for(const c of e.active||[])if(c.status==='resolved'&&c.outcome==='flop'&&c.city)record({kind:'travel-flop',src:'eventchain231',sourceId:c.id,city:c.city,celebId:c.celebId||'',brand:c.brand||'',text:`${c.arc||''} ${c.card||''} flop`.trim()});}
let lastPlayerText={t:'',at:0};
function scanGossip(){const w=G('SCENE_WORLDFLOW')?.state?.(),c=w?.gossip?.active;if(!c)return;const m=sm();
  const ex=m.recent.find(x=>x.kind==='gossip'&&x.sourceId===c.id);if(ex){if(ex.step!==c.step){ex.step=c.step;save0()}return}
  let text='';if((c.src==='dm'||c.src==='post')&&T()-lastPlayerText.at<15000)text=lastPlayerText.t;
  if(m.seen.includes('gossip|'+c.id))return;
  let city='';if(c.src==='travelcard'){const f=m.recent.find(x=>x.kind==='travel-flop'&&x.day===c.day0);city=f?.city||''}
  const claim=text?snip(text):city?`${city} flop`:c.otherId?`${first(who(c.celebId))} and ${first(who(c.otherId))}`:'';
  const r=record({kind:'gossip',src:'worldflow236:'+c.src,sourceId:c.id,celebId:c.celebId||'',city,claim,text});if(r){r.step=c.step;r.day=c.day0;if(city)r.used='linked-flop'}}
function onPlayerText(t,toId){t=String(t||'');if(!t)return;lastPlayerText={t,at:T()};if(PRIVATE.test(t))return;
  const ec=G('SCENE_EVENTCHAIN')?.classifyDm?.(t);const brand=ec?.slots?.brand||'';
  if(ec&&ec.intent==='brag'&&brand)record({kind:'brand-drop',src:toId?'dm':'post',sourceId:'b.'+H(t+day()),brand,celebId:toId&&WRITER.includes(toId)?toId:'',claim:snip(t),text:t})}

/* ---------- USE: worldflow line swap ---------- */
function pending(kinds){const d=day();return sm()?.recent.find(e=>kinds.includes(e.kind)&&d-e.day<=2)||null}
function swapFor(key){if(OFF())return null;const w=G('SCENE_WORLDFLOW')?.state?.();
  if(/^wf\.gossip\.(news|dm)\.|^wf\.gossip\.comment\.celeb$/.test(key)){const c=w?.gossip?.active;if(!c)return null;
    const e=sm().recent.find(x=>x.kind==='gossip'&&x.sourceId===c.id);if(!e||!e.claim)return null;
    const base=key.startsWith('wf.gossip.news')?'wf.gossip.news':key.startsWith('wf.gossip.dm')?'wf.gossip.dm':key;const sl=slotsOf(e);
    const out=WFSWAP[base].map(t=>fill(t,sl)).filter(Boolean);if(out.length){(e.quoted=e.quoted||[]).push(day()+':'+key);return out}return null}
  if(/^wf\.card\.(news|dm|comment)\.flop$/.test(key)){const e=pending(['travel-flop']);if(!e||e.src!=='worldflow236')return null;(e.quoted=e.quoted||[]).push(day()+':'+key);
    return WFSWAP[key]} /* worldflow fills {player}{city}{celeb} from the card itself */
  return null}
function proxyLines(){const cur=window.SCENE_WORLDFLOW_LINES;if(cur&&cur.__sm238)return;const base=cur&&typeof cur==='object'?cur:{};
  window.SCENE_WORLDFLOW_LINES=new Proxy(base,{get(o,k){if(k==='__sm238')return true;if(typeof k==='string'&&k.startsWith('wf.')){try{const s=swapFor(k);if(s)return s}catch{}}return o[k]}})}

/* ---------- USE: consequence beat (1 per game day) ---------- */
function outlet(seed){const xs=OUTLETS.map(who).filter(Boolean);return xs.length?xs[H(seed)%xs.length]:null}
function newsPost(a,text,tag){if(!a||!text||typeof mkPost!=='function')return null;try{const p=mkPost(a,0,text,{media:false,kind:'storymem238'});p.comments=[];p.storymem238=tag;if(!state.posts.includes(p))state.posts.unshift(p);return p}catch(e){console.warn('sm238 post',e);return null}}
function sendDm238(id,text,tag){const a=who(id);if(!a||!text||typeof dmState!=='function')return false;const d=dmState(id),at=T();
  d.messages.push({mid:'m'+at+Math.random(),from:'them',text,at,kind:'storymem238',rendererSource:'storymem238',storymem238:tag,replyTo:''});
  d.unread=document.getElementById('modal')?.dataset?.dm!==id;d.lastInboundAt=at;try{dmUpdateConversation180(a,d,text,'them')}catch{}
  try{addNotif(`${a.name} messaged you.`,'dm',{celebrityId:id,storymem238:tag})}catch{}return true}
function chapterRow(d,text){try{const n=(state.notifications||[]).find(x=>/begins/i.test(String(x.text||''))&&(T()-(x.at||x.createdAt||0))<120000);if(n&&!n.storymem238){n.text=String(n.text).replace(/·.*$/,'').trim()+' · '+text;n.storymem238=d;return true}}catch{}return false}
function beat(force){
  if(OFF()||!S0()?.player)return null;const m=sm(),d=day();if(m.beatDay===d&&!force)return null;
  const e=m.recent.find(x=>!x.used&&x.day<d&&d-x.day<=2);if(!e)return null;
  const r=reactorFor(e);if(!r)return null;const seed=d+e.id,tag=e.id;m.beatDay=d;e.used=d;const out={day:d,mem:e.id,kind:e.kind,reactor:r};
  out.chapter=mline(e,r,'chapter',seed);if(out.chapter){m.chapter={day:d,mem:e.id,text:out.chapter};out.row=chapterRow(d,out.chapter)}
  const w=G('SCENE_WORLDFLOW')?.state?.();
  /* DM: replace worldflow's generic next-day card DM when it is the same celeb */
  if(e.kind==='travel-flop'&&e.src==='worldflow236'&&w&&r===e.celebId){const c=w.cards.active.find(x=>x.id===e.sourceId);if(c&&!c.dmSent){c.dmSent=true;w.sched=w.sched.filter(j=>!(j.id===c.id&&j.type==='carddm'))}}
  const dmT=mline(e,r,'dm',seed);if(dmT&&sendDm238(r,r==='kylie'?dmT.toLowerCase():dmT,tag))out.dm=dmT;
  /* news: skip if worldflow's own gossip pickup (already memory-grounded) posts today */
  const wfPickup=e.kind==='gossip'&&w?.gossip?.active?.id===e.sourceId&&w.gossip.active.step===0;
  if(!wfPickup){const nt=mline(e,r,'news',seed),p=newsPost(outlet(seed),nt,tag);
    if(p){out.news=nt;const ct=mline(e,r,'comment',seed+'c'),a=who(r);if(ct&&a)p.comments.push({id:'sm'+T()+Math.random(),authorId:a.id,name:a.name,handle:a.handle,text:ct,createdAt:T(),verified:true,likes:900+H(a.id+ct)%9000,replies:[],storymem238:tag})}}
  /* chapter moves: a worldflow flop brings the same city card back today instead of a random card */
  if(e.kind==='travel-flop'&&e.tpl&&!window.SCENE_TRAVELCARD_OFF){try{const c=G('SCENE_WORLDFLOW')?.spawnCard?.(e.tpl);if(c){c.storymem238=e.id;out.retryCard=c.id}}catch{}}
  m.beats.unshift(out);m.beats=m.beats.slice(0,20);save0();
  try{if(S0().tab==='feed'){if(window.SCENE_DMGUARD)SCENE_DMGUARD.renderSafe();else if(!document.getElementById('modal')?.dataset?.dm)render()}}catch{}return out} /* dmdash238 */

function tick(){if(OFF()||!S0()?.player)return;proxyLines();try{scanCards()}catch(e){console.warn('sm238 cards',e)}try{scanGossip()}catch(e){console.warn('sm238 gossip',e)}
  const m=sm();if(m.lastDay!==day()){m.lastDay=day();beat(false)}}
let INSTALLED=false;
function install(){
  const bR=remember;remember=function(type,data){if(!OFF()&&type==='player_post'){try{lastPlayerText={t:String(data?.text||''),at:T()}}catch{}}const r=bR.apply(this,arguments);if(!OFF()&&type==='player_post'){try{onPlayerText(data?.text,'');scanGossip()}catch(e){console.warn('sm238 post',e)}}return r};
  const bS=sendDm;sendDm=function(id,text){if(!OFF())lastPlayerText={t:String(text||''),at:T()};const o=bS.apply(this,arguments);if(!OFF()){try{onPlayerText(text,id);scanGossip()}catch(e){console.warn('sm238 dm',e)}}return o};
  const bA=globalThis.SCENE_advanceDay;if(typeof bA==='function')globalThis.SCENE_advanceDay=function(){const r=bA.apply(this,arguments);try{tick()}catch(e){console.warn('sm238 day',e)}return r};
  const m=sm();if(!Number.isFinite(m.lastDay))m.lastDay=day(); /* first boot: no beat for history */
  proxyLines();setInterval(()=>{try{tick()}catch(e){console.warn('sm238 tick',e)}},1500);INSTALLED=true}
globalThis.SCENE_STORYMEM={version:V,key:'storymem238',installed:()=>INSTALLED,state:()=>S0()?sm():null,record,beat:()=>beat(true),tick:()=>tick(),swapFor};
let tries=0;const wait=setInterval(()=>{tries++;try{if(typeof state!=='undefined'&&state.player&&typeof remember==='function'&&typeof sendDm==='function'&&typeof mkPost==='function'&&typeof render==='function'&&(G('SCENE_WORLDFLOW')?.installed?.()||tries>100)){clearInterval(wait);install()}}catch{}},300);
})();
