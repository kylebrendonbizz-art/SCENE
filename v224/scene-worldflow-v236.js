/* SCENE worldflow236 (Gameplay Logic, 2026-10-09): living-world flow. Additive, offline, rules-based, no AI, no money.
   Data: public/v224/worldflow-data-v236.json (RIVALS table, travel CARDS, neutral fallback lines). Writer copy overrides:
   window.SCENE_WORLDFLOW_LINES (public/v224/worldflow-lines-v236.js, same flat keys; LINE_KEYS.md). Slots {player} {celeb} {other} {brand} {city} {title}.
   1) GOSSIP  - one active chain at a time (state.worldflow236.gossip.active), 3 steps on GAME days (state.sceneDay):
                step0 seed (player DM brag/accusation/scandal word, player post brag/scandal/celeb mention, charbrain235 news,
                rival moment) -> step1 next game day: news post by an outlet (or, if charbrain already posted the story, its post)
                + 1-2 comments (one from an orbit celeb when there is one) -> step2 the day after: optional DM from one orbit
                celeb who heard it (friendship >= CFG.dmMin; line passes SCENE_CHARBRAIN.valid hard-fact check; Kylie lowercase).
                Private/sensitive topics (charbrain sensitive, kids/children) never seed. Feed only; the DM is the only bell row.
   2) RIVALS  - 5 real public tension pairs (data). Max 1 moment per game day, per-pair cooldown. Trigger: player close to one
                side (friendship >= CFG.closeMin) OR player post / DM mentioned the pair (last 2 game days). Moment = feed post by
                the side the player is closer to (neutral, never names the other or makes a claim) + 2 fan comments, +0.1 friendship
                (eventchain gate size) with that side, optional gossip seed.
   3) TRAVEL CARDS - eventchain-style sheet cards from 5 templates, each tied to a CITY48 city. Not in the city -> 'Fly to {city}'
                (existing travel() sheet; the existing flight cost is the ONLY money path, player-confirmed). In the city -> safe/bold/
                messy -> success/mixed/flop (seeded, no reroll) -> xp/energy, tiny friendship delta, news post 1-3 game hours later
                with comments, DM from the celeb next game day; messy/flop may seed gossip. Spawn: max 1 open card, cadence
                CFG.cardEveryDays from CFG.cardStartDay, daily cap shared with eventchain (SCENE_EVENTCHAIN.config.cardsPerDay, counting
                its spawned-today), one bell notification per card. Career tab: 'Travel opportunities' block.
   Save: ONE new key state.worldflow236 (lazy; old saves load). Kill switches (checked on every hook): window.SCENE_GOSSIP_OFF,
   SCENE_RIVAL_OFF, SCENE_TRAVELCARD_OFF; window.SCENE_WORLDFLOW_OFF disables all three. */
(()=>{
'use strict';
if(window.SCENE_WORLDFLOW)return;
const V=236,ALL=()=>window.SCENE_WORLDFLOW_OFF===true;
const OFF={gossip:()=>ALL()||window.SCENE_GOSSIP_OFF===true,rival:()=>ALL()||window.SCENE_RIVAL_OFF===true,card:()=>ALL()||window.SCENE_TRAVELCARD_OFF===true};
const CFG={tickMs:2000,hourMs:20000,dmMin:10,closeMin:20,mentionDays:2,rivalCooldown:3,cardsPerDay:3,cardStartDay:2,cardEveryDays:2,expiresDays:3,
  delta:{rival:.1,card:{success:.3,mixed:.1,flop:-.2}},outlets:['popbase','tmz','enews','people']};
const TONES=['safe','bold','messy'],SPREAD={safe:.45,bold:.85,messy:1.05};
const T=()=>Date.now();
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const R=s=>H(s)/4294967296;
const S0=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const G=n=>{try{return globalThis[n]}catch{return undefined}};
const who=id=>{try{return byId(id)}catch{return null}};
const first=a=>String(a?.name||'').split(/\s+/)[0]||'';
const esc0=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const day=()=>Number(S0()?.sceneDay)||0;
const save0=()=>{try{save()}catch{}};
const modalEl=()=>document.getElementById('modal');
const norm=t=>String(t||'').toLowerCase().replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim();
let DATA={rivals:[],cards:[],lines:{}};

/* ---------- state ---------- */
function wf(){const s=S0();if(!s)return null;let w=s.worldflow236;if(!w||typeof w!=='object')w=s.worldflow236={v:V,seed:Math.random().toString(36).slice(2,10)};
  if(!w.seed)w.seed=Math.random().toString(36).slice(2,10);
  w.gossip=w.gossip&&typeof w.gossip==='object'?w.gossip:{active:null,done:[],cbSeen:[]};w.gossip.done=Array.isArray(w.gossip.done)?w.gossip.done:[];w.gossip.cbSeen=Array.isArray(w.gossip.cbSeen)?w.gossip.cbSeen:[];
  w.rival=w.rival&&typeof w.rival==='object'?w.rival:{day:-1,last:{},mentions:{},log:[]};w.rival.last=w.rival.last||{};w.rival.mentions=w.rival.mentions||{};w.rival.log=Array.isArray(w.rival.log)?w.rival.log:[];
  w.cards=w.cards&&typeof w.cards==='object'?w.cards:{active:[],daily:{day:-1,n:0},lastSpawnDay:-99};w.cards.active=Array.isArray(w.cards.active)?w.cards.active:[];w.cards.daily=w.cards.daily||{day:-1,n:0};
  w.sched=Array.isArray(w.sched)?w.sched:[];w.log=Array.isArray(w.log)?w.log:[];return w}
function log(x){const w=wf();w.log.unshift({at:T(),day:day(),...x});w.log=w.log.slice(0,60)}

/* ---------- copy ---------- */
function variants(key){const W=G('SCENE_WORLDFLOW_LINES')||{};for(const src of [W,DATA.lines]){const v=src&&src[key];const a=(Array.isArray(v)?v:typeof v==='string'?[v]:[]).map(String).filter(x=>x.trim()&&!/\[PLACEHOLDER/.test(x));if(a.length)return a}return[]}
function fill(t,sl){let miss=false;const o=String(t).replace(/\{(player|celeb|other|brand|city|title)\}/g,(m,k)=>{const v=sl?.[k];if(v==null||v===''){miss=true;return''}return String(v)});return miss?null:o}
/* line(key,slots,seed,voiceId?,dupKey?): seeded variant; voiceId -> hard-fact validator (charbrain) + Kylie lowercase; dupKey -> skips feedguard230 repeats */
function line(key,sl={},seed='',voiceId='',dupKey=''){const vs=variants(key),n=vs.length;if(!n)return'';const st=H(seed+key)%n,CB=G('SCENE_CHARBRAIN'),FG=G('SCENE_FEEDGUARD230');let firstOk='';
  for(let i=0;i<n;i++){let t=fill(vs[(st+i)%n],sl);if(t==null)continue;if(voiceId){if(voiceId==='kylie')t=t.toLowerCase();if(CB?.brain?.(voiceId)&&CB.valid){t=CB.valid(voiceId,t,false);if(!t)continue}}
    if(!firstOk)firstOk=t;try{if(dupKey&&FG?.isDup&&FG.isDup(dupKey,t))continue}catch{}return t}
  return firstOk}
function slots(extra={}){const p=S0()?.player||{};return{player:first(p)||p.name||'',city:p.city||'',...extra}}

/* ---------- helpers ---------- */
function rel(id){try{return memoryFor(id)}catch{return{friendship:0}}}
function fr(id){return Number(S0()?.relations?.[id]?.friendship)||0}
function isCeleb(id){const a=who(id);return !!a&&a.type==='celeb'&&!a.custom}
function orbit(){const s=S0()||{},ids=new Set();try{for(const m of s.flowfix232?.orbit?.members||[])if(m?.id)ids.add(m.id)}catch{}
  for(const [id,r] of Object.entries(s.relations||{}))if((Number(r?.friendship)||0)>=CFG.dmMin)ids.add(id);
  return [...ids].filter(isCeleb).sort((a,b)=>fr(b)-fr(a))}
function outlet(seed){const xs=CFG.outlets.map(who).filter(Boolean);return xs.length?xs[H(seed)%xs.length]:null}
function npcs(seed,n){const all=(typeof NORMAL_NPCS!=='undefined'&&Array.isArray(NORMAL_NPCS))?NORMAL_NPCS:[];const out=[];if(!all.length)return out;let i=H(seed)%all.length;while(out.length<n&&out.length<all.length){const x=all[i%all.length];if(!out.includes(x))out.push(x);i+=7}return out}
const fanC=(n,text,tag)=>({id:'wf'+T()+Math.random(),npcId:n.id,name:n.name,handle:n.handle,avatar:n.avatar||'',text,createdAt:T()-2000,likes:5+H(n.handle+text)%400,replies:[],worldflow236:tag});
const celebC=(a,text,tag)=>({id:'wf'+T()+Math.random(),authorId:a.id,name:a.name,handle:a.handle,text,createdAt:T(),verified:true,likes:900+H(a.id+text)%9000,replies:[],worldflow236:tag});
function post(a,text,tag){if(!a||!text||typeof mkPost!=='function')return null;try{const p=mkPost(a,0,text,{media:false,kind:'worldflow236'});p.comments=[];p.worldflow236=tag;if(!state.posts.includes(p))state.posts.unshift(p);return p}catch(e){console.warn('wf236 post',e);return null}}
function relDelta(id,amount,why){if(!amount)return 0;try{G('SCENE_KERNEL170')?.relationshipSignal?.(id,'neutral',{deltas:{friendship:amount,trust:0,chemistry:0,tension:0},source:'worldflow236',summary:`${first(who(id))}: ${why}`,visibility:'private'});return amount}catch{return 0}}
function dm(id,text,tag){const a=who(id);if(!a||!text||typeof dmState!=='function')return false;const d=dmState(id),at=T();
  d.messages.push({mid:'m'+at+Math.random(),from:'them',text,at,kind:'worldflow236',rendererSource:'worldflow236',worldflow236:tag,replyTo:''});
  d.unread=modalEl()?.dataset?.dm!==id;d.lastInboundAt=at;try{dmUpdateConversation180(a,d,text,'them')}catch{}
  try{addNotif(`${a.name} messaged you.`,'dm',{celebrityId:id,worldflow236:tag})}catch{}return true}

/* ---------- 1) GOSSIP ---------- */
const SCANDAL=/\b(scandal|exposed?|beef|feud|shade|drama|leak(ed)?|rumou?rs?|cheat(ed|ing)?|dating|breakup|broke up|fight|cancel(l?ed)?|receipts|tea)\b/i;
const PRIVATE=/\b(kids?|children|daughter|son|baby|stormi|north|pregnan\w*|health|rehab|conservator\w*)\b/i;
function seedGossip(o={}){
  if(OFF.gossip()||!S0()?.player)return null;const g=wf().gossip;
  if(g.active){log({ev:'gossip-capped',src:o.src});return null}
  if(PRIVATE.test(String(o.text||'')))return null;
  const kind=['brag','scandal','celeb','rival'].includes(o.kind)?o.kind:'scandal',d=day();
  const c={id:`g.${wf().seed}.${d}.${H(T()+String(o.text||''))%1e6}`,src:o.src||'api',kind,celebId:o.celebId&&who(o.celebId)?o.celebId:'',otherId:o.otherId&&who(o.otherId)?o.otherId:'',postId:o.postId||'',day0:d,step:0,steps:[{step:0,day:d,ev:'seed'}]};
  g.active=c;log({ev:'gossip-seed',id:c.id,src:c.src,kind});save0();return c}
function gossipStep(){
  const g=wf().gossip,c=g.active,d=day();if(!c)return false;
  if(c.step===0&&d>=c.day0+1){
    const sl=slots({celeb:first(who(c.celebId)),other:first(who(c.otherId))}),seed=wf().seed+c.id;
    let p=c.postId?(S0().posts||[]).find(x=>x.id===c.postId):null;
    if(!p){const key=`wf.gossip.news.${c.kind}`;p=post(outlet(seed),line(key,sl,seed)||line('wf.gossip.news.scandal',sl,seed),c.id)}
    if(p){p.comments=Array.isArray(p.comments)?p.comments:[];
      const o=orbit().filter(id=>id!==c.otherId).sort((a,b)=>(fr(b)>=CFG.dmMin)-(fr(a)>=CFG.dmMin)),cel=o.length?who(o[H(seed+'oc')%Math.min(3,o.length)]):null;
      if(cel){const t=line('wf.gossip.comment.celeb',sl,seed+cel.id,cel.id);if(t){p.comments.push(celebC(cel,t,c.id));c.commenter=cel.id}}
      const n=npcs(seed+'f',cel?1:2);for(const x of n)p.comments.push(fanC(x,line('wf.gossip.comment.fan',sl,seed+x.id,'',x.id),c.id));c.newsPostId=p.id}
    c.step=1;c.steps.push({step:1,day:d,ev:'pickup',post:p?.id||'',by:c.commenter||''});log({ev:'gossip-pickup',id:c.id});return true}
  if(c.step===1&&d>=c.day0+2){
    const sl=slots({celeb:first(who(c.celebId)),other:first(who(c.otherId))}),seed=wf().seed+c.id;
    const cand=[c.commenter,...orbit()].filter(id=>id&&id!==c.otherId&&id!==c.celebId&&fr(id)>=CFG.dmMin);let sent='';
    if(c.kind!=='celeb'||cand.length){const id=cand[0];if(id){const t=line(`wf.gossip.dm.${c.kind}`,sl,seed+'dm',id);if(t&&dm(id,t,c.id))sent=id}}
    c.step=2;c.steps.push({step:2,day:d,ev:sent?'dm':'dm-skipped',by:sent});g.done.unshift({id:c.id,kind:c.kind,src:c.src,day0:c.day0,steps:c.steps});g.done=g.done.slice(0,10);g.active=null;
    log({ev:'gossip-done',id:c.id,dm:sent});return true}
  return false}
function watchCharbrain(){const L=S0()?.charbrain?.log;if(!Array.isArray(L))return;const g=wf().gossip;
  for(const e of L.slice(0,10)){if(e?.ev!=='news'||!e.cid||g.cbSeen.includes(e.cid))continue;g.cbSeen.unshift(e.cid);g.cbSeen=g.cbSeen.slice(0,30);
    if(T()-(e.at||0)>10*60000)continue;const p=(S0().posts||[]).find(x=>x.charbrain235===e.cid);seedGossip({src:'charbrain235',kind:'celeb',celebId:e.id,postId:p?.id||'',text:''})}}

/* ---------- 2) RIVALS ---------- */
function pairRe(r){try{return new RegExp(r.re,'i')}catch{return null}}
function noteMentions(text,toId){const t=norm(text);if(!t)return[];const w=wf(),hit=[];
  for(const r of DATA.rivals){const re=pairRe(r);const nameOther=x=>new RegExp(`\\b${first(who(x)).toLowerCase()}\\b`).test(t);
    if((re&&re.test(t))||(toId===r.a&&nameOther(r.b))||(toId===r.b&&nameOther(r.a))){w.rival.mentions[r.key]={day:day(),side:toId===r.a||toId===r.b?toId:''};hit.push(r)}}
  return hit}
function rivalMoment(force){
  if(OFF.rival()||!S0()?.player)return null;const w=wf(),d=day();if(w.rival.day===d)return null;
  const pairs=DATA.rivals.filter(r=>isCeleb(r.a)&&isCeleb(r.b)&&(force||!Number.isFinite(w.rival.last[r.key])||d-w.rival.last[r.key]>=CFG.rivalCooldown));
  const elig=pairs.map(r=>{const m=w.rival.mentions[r.key],ment=m&&d-m.day<=CFG.mentionDays,fa=fr(r.a),fb=fr(r.b),close=Math.max(fa,fb)>=CFG.closeMin;
    return{r,ment,close,side:ment&&m.side?m.side:(fa>=fb?r.a:r.b),score:(ment?100:0)+Math.max(fa,fb)}}).filter(x=>force||x.ment||x.close).sort((a,b)=>b.score-a.score);
  const x=typeof force==='string'?elig.find(e=>e.r.key===force)||null:elig[0];if(!x)return null;
  const r=x.r,side=x.side,other=side===r.a?r.b:r.a,a=who(side),seed=w.seed+r.key+d,sl=slots({celeb:first(a),other:first(who(other))});
  const text=line(`wf.rival.${r.key}.${side}.post`,sl,seed,side)||line('wf.rival.post',sl,seed,side);
  const p=post(a,text,'rival.'+r.key);if(!p)return null;
  for(const n of npcs(seed+'rf',2))p.comments.push(fanC(n,line(`wf.rival.${r.key}.comment.fan`,sl,seed+n.id,'',n.id)||line('wf.rival.comment.fan',sl,seed+n.id,'',n.id),'rival.'+r.key));
  const delta=fr(side)>=CFG.closeMin||x.ment?relDelta(side,CFG.delta.rival,`rival moment ${r.key}`):0;
  w.rival.day=d;w.rival.last[r.key]=d;delete w.rival.mentions[r.key];
  const ent={key:r.key,day:d,side,other,post:p.id,delta,trigger:x.ment?'mention':x.close?'close':'force'};w.rival.log.unshift(ent);w.rival.log=w.rival.log.slice(0,20);
  if(x.ment)seedGossip({src:'rival',kind:'rival',celebId:side,otherId:other,text:''});
  log({ev:'rival',...ent});save0();try{if(S0().tab==='feed'){if(window.SCENE_DMGUARD)SCENE_DMGUARD.renderSafe();else if(!modalEl()?.dataset?.dm)render()}}catch{}return ent} /* dmdash238 */

/* ---------- 3) TRAVEL CARDS ---------- */
function tpl(key){return DATA.cards.find(c=>c.key===key)||null}
function curCity(){const s=S0()||{};return String(s.player?.city||s.homeCity||'Los Angeles').trim()}
function cityOk(c){return !c.city||curCity().toLowerCase()===String(c.city).trim().toLowerCase()}
function ecSpawnedToday(){const e=G('SCENE_EVENTCHAIN')?.state?.();return e&&e.daily&&e.daily.day===day()?(Number(e.daily.spawned)||0):0}
function capOf(){const n=Number(G('SCENE_EVENTCHAIN')?.config?.cardsPerDay);return Number.isFinite(n)&&n>0?n:CFG.cardsPerDay}
function openCard(){return wf().cards.active.find(c=>c.status==='open')}
function cardTitle(c){return line(`wf.card.${c.tpl}.title`,c.sl,wf().seed+c.id)||c.city}
function spawnCard(key,reason='api'){
  if(OFF.card()||!S0()?.player)return null;const w=wf(),d=day();if(openCard())return null;
  const keys=DATA.cards.map(c=>c.key),t=tpl(key||keys[H(w.seed+d)%keys.length]);if(!t)return null;
  const daily=w.cards.daily.day===d?w.cards.daily.n:0;if(daily+ecSpawnedToday()>=capOf()){log({ev:'card-capped',tpl:t.key});return null}
  const pool=t.celebs.filter(isCeleb).sort((a,b)=>fr(b)-fr(a)),celebId=pool[0]||'';if(!celebId)return null;
  const id=`wf.${t.key}.${w.seed}.${d}`;if(w.cards.active.some(c=>c.id===id))return null;
  const c={id,tpl:t.key,city:t.city,celebId,brand:t.brand||'',createdDay:d,expiresDay:d+CFG.expiresDays,status:'open',reason,sl:slots({celeb:first(who(celebId)),brand:t.brand||'',city:t.city})};
  w.cards.active.push(c);w.cards.active=w.cards.active.slice(-12);w.cards.daily={day:d,n:daily+1};w.cards.lastSpawnDay=d;
  try{addNotif(line('wf.ui.notify',{...c.sl,title:cardTitle(c)},w.seed+c.id)||cardTitle(c),'career',{worldflow236:c.id,celebrityId:celebId})}catch{}
  log({ev:'card-spawn',id,reason});save0();return c}
function outcomeOf(c,tone){const t=tpl(c.tpl),p=S0()?.player||{},r=rel(c.celebId);
  const v=(t.risk[tone]??.5)+Math.min(.15,(Number(p.fame)||0)/400)+Math.min(.1,(Number(p.xp)||0)/3000)+Math.max(-.08,Math.min(.12,((Number(r.friendship)||0)-(Number(r.tension)||0)*.5)/500))+(R(wf().seed+'|'+c.id+'|'+tone)-.5)*SPREAD[tone];
  return v>=.62?'success':v>=.38?'mixed':'flop'}
function resolveCard(id,tone){
  if(OFF.card())return null;const w=wf(),c=w.cards.active.find(x=>x.id===id);if(!c||c.status!=='open'||!cityOk(c))return null;
  tone=TONES.includes(tone)?tone:'safe';const t=tpl(c.tpl),out=outcomeOf(c,tone),d=day(),p=S0().player;
  const xp=t.xp[0]+H(w.seed+c.id+'xp')%(t.xp[1]-t.xp[0]+1);p.xp=(Number(p.xp)||0)+xp;p.energy=Math.max(0,(Number(p.energy)||0)-t.energy);
  const rd=relDelta(c.celebId,+(CFG.delta.card[out]).toFixed(2),`${c.tpl} ${tone} ${out}`);
  Object.assign(c,{status:'resolved',tone,outcome:out,resolvedDay:d,result:{xp,energy:-t.energy,rel:rd}});
  const hrs=1+H(w.seed+c.id+'h')%3;w.sched.push({type:'cardnews',id:c.id,dueAt:T()+hrs*CFG.hourMs});w.sched.push({type:'carddm',id:c.id,dueDay:d+1});
  if(tone==='messy'||out==='flop')seedGossip({src:'travelcard',kind:'scandal',celebId:c.celebId,text:''});
  try{remember('worldflow236',{celebrityId:c.celebId,celebrity:who(c.celebId)?.name||c.celebId,card:c.tpl,city:c.city,tone,outcome:out,day:d,visibility:'private'})}catch{}
  log({ev:'card-resolve',id,tone,out});save0();return c}
function cardNews(j){const c=wf().cards.active.find(x=>x.id===j.id);if(!c)return;const seed=wf().seed+c.id,p=post(outlet(seed),line(`wf.card.news.${c.outcome}`,c.sl,seed),c.id);if(!p)return;
  for(const n of npcs(seed+'cf',2))p.comments.push(fanC(n,line(`wf.card.comment.${c.outcome}`,c.sl,seed+n.id,'',n.id),c.id));
  const a=who(c.celebId);if(a&&fr(c.celebId)>=CFG.dmMin){const t=line(`wf.card.comment.${c.outcome}`,c.sl,seed+'cel',a.id);if(t)p.comments.push(celebC(a,t,c.id))}
  c.newsPostId=p.id;log({ev:'card-news',id:c.id,post:p.id})}
function cardDm(j){const c=wf().cards.active.find(x=>x.id===j.id);if(!c||c.dmSent)return;const t=line(`wf.card.dm.${c.outcome}`,c.sl,wf().seed+c.id+'dm',c.celebId);if(t&&dm(c.celebId,t,c.id))c.dmSent=true}
function expireCards(){const w=wf(),d=day();for(const c of w.cards.active)if(c.status==='open'&&d>c.expiresDay){c.status='expired';log({ev:'card-expired',id:c.id})}}
function openSheet(id){
  if(OFF.card())return;const w=wf(),c=w.cards.active.find(x=>x.id===id);if(!c||typeof showSheet!=='function')return;
  const a=who(c.celebId),seed=w.seed+c.id,sl=c.sl;
  const head=`<div class="eventhero immersiveevent story228 wf236card"><div class="eventtag">${esc0(('TRAVEL · '+(a?.name||'')+' · '+c.city).toUpperCase())}</div><h3>${esc0(cardTitle(c))}</h3><p>${esc0(line(`wf.card.${c.tpl}.body`,sl,seed))}</p></div>`;
  let body='';
  if(c.status==='resolved')body=`<div class="eventtag">${esc0(String(c.outcome).toUpperCase())}</div><p>${esc0(line(`wf.card.outcome.${c.outcome}`,sl,seed))}</p><p class="wf236note">+${c.result?.xp||0} XP · ${esc0(first(a))} ${(c.result?.rel>0?'+':'')+(c.result?.rel||0)}%</p>`;
  else if(c.status!=='open')body=`<p class="wf236note">${esc0(c.status)}</p>`;
  else if(!cityOk(c))body=`<button class="btn wf236fly" data-wf236-fly="${esc0(c.city)}">${esc0(line('wf.ui.flyto',sl,seed))}</button><p class="wf236note">${esc0(line('wf.ui.locked',sl,seed))}</p>`;
  else body=`<div class="heading">${esc0(line('wf.ui.choose',sl,seed))}</div>`+TONES.map(t=>`<button class="eventchoice" data-wf236-tone="${t}"><span><b>${esc0(line(`wf.card.${c.tpl}.choice.${t}`,sl,seed)||line(`wf.card.choice.${t}`,sl,seed))}</b><small>${t}</small></span><em>›</em></button>`).join('');
  showSheet('Opportunity',head+body);const M=modalEl();if(!M)return;
  M.querySelector('[data-wf236-fly]')?.addEventListener('click',()=>{try{closeModal()}catch{}try{travel(c.city)}catch(e){console.warn('wf236 travel',e)}});
  M.querySelectorAll('[data-wf236-tone]').forEach(b=>b.onclick=()=>{if(resolveCard(c.id,b.dataset.wf236Tone))openSheet(c.id)})}
function injectOpps(){
  if(OFF.card())return;const intro=document.querySelector('.careerpanelintro');if(!intro||document.querySelector('.wf236opps'))return;
  const w=wf();if(!w)return;const list=w.cards.active.filter(c=>c.status==='open'||(c.status==='resolved'&&c.resolvedDay===day()));if(!list.length)return;
  const box=document.createElement('div');box.className='wf236opps';
  box.innerHTML=`<div class="heading">${esc0(line('wf.ui.opps.title',slots(),w.seed))}</div><div class="jobboard">${list.map(c=>`<button class="jobcard wf236job ${cityOk(c)?'':'lockedjob'}" data-wf236-open="${esc0(c.id)}"><strong>${esc0(cardTitle(c))}</strong><small>${esc0((who(c.celebId)?.name||'')+' · '+c.city+' · '+c.status)}</small></button>`).join('')}</div>`;
  (document.querySelector('.ec231opps')||intro).after(box);box.querySelectorAll('[data-wf236-open]').forEach(b=>b.onclick=()=>openSheet(b.dataset.wf236Open))}

/* ---------- hooks ---------- */
function onPlayerPost(data){const t=String(data?.text||'');if(!t)return;const hits=noteMentions(t,'');
  if(OFF.gossip()||PRIVATE.test(t))return;const ec=G('SCENE_EVENTCHAIN')?.classifyDm?.(t)||{intent:'unknown',slots:{}};
  const men=(data?.mentions||[]).map(m=>m?.id).find(id=>id&&isCeleb(id));
  if(hits.length)return;/* rival mention -> rival moment seeds gossip itself */
  if(ec.intent==='brag')seedGossip({src:'post',kind:'brag',celebId:men||'',text:t});else if(SCANDAL.test(t))seedGossip({src:'post',kind:'scandal',celebId:men||'',text:t});else if(men)seedGossip({src:'post',kind:'celeb',celebId:men,text:t})}
function onDmSent(id,text){const t=String(text||'');if(!t||!isCeleb(id))return;noteMentions(t,id);if(OFF.gossip())return;
  const CB=G('SCENE_CHARBRAIN');try{if(CB?.ids?.includes(id)&&CB.classify(id,t).sensitive.length)return}catch{}
  if(PRIVATE.test(t))return;const ec=G('SCENE_EVENTCHAIN')?.classifyDm?.(t)||{intent:'unknown'};
  if(ec.intent==='brag')seedGossip({src:'dm',kind:'brag',celebId:id,text:t});else if(ec.intent==='accusation'||SCANDAL.test(t))seedGossip({src:'dm',kind:'scandal',celebId:id,text:t})}
function tick(){
  if(ALL()||!S0()?.player)return;const w=wf(),d=day();let ch=false;
  if(!OFF.gossip()){try{watchCharbrain()}catch{}if(gossipStep())ch=true}
  if(!OFF.rival()&&w.rival.day!==d){if(rivalMoment(false))ch=true}
  if(!OFF.card()){if(w.cards.lastDay!==d){w.cards.lastDay=d;expireCards();if(d>=CFG.cardStartDay&&d-w.cards.lastSpawnDay>=CFG.cardEveryDays&&!openCard()){if(spawnCard('','day'))ch=true}}
    const keep=[];for(const j of w.sched){if((Number.isFinite(j.dueAt)&&T()>=j.dueAt)||(Number.isFinite(j.dueDay)&&d>=j.dueDay)){try{if(j.type==='cardnews')cardNews(j);else if(j.type==='carddm')cardDm(j)}catch(e){console.warn('wf236 job',e)}ch=true}else keep.push(j)}w.sched=keep}
  if(ch){save0();try{if(S0().tab==='feed'||S0().tab==='career'){if(window.SCENE_DMGUARD)SCENE_DMGUARD.renderSafe();else if(!modalEl()?.dataset?.dm)render()}}catch{}}} /* dmdash238 */
let INSTALLED=false;
function install(){
  const bR=remember;remember=function(type,data){const r=bR.apply(this,arguments);if(!ALL()&&S0()?.player){try{if(type==='player_post')onPlayerPost(data)}catch(e){console.warn('wf236 post hook',e)}}return r};
  const bS=sendDm;sendDm=function(id,text){const out=bS.apply(this,arguments);if(!ALL()&&S0()?.player){try{onDmSent(id,text)}catch(e){console.warn('wf236 dm hook',e)}}return out};
  const bRen=render;render=function(){const r=bRen.apply(this,arguments);try{injectOpps()}catch{}return r};
  setInterval(()=>{try{tick()}catch(e){console.warn('wf236 tick',e)}},CFG.tickMs);
  if(!document.getElementById('wf236-css')){const st=document.createElement('style');st.id='wf236-css';st.textContent='.wf236note{font-size:12px;opacity:.75;margin:8px 0}.wf236fly{width:100%;margin-top:10px}.wf236opps{margin:10px 0}';document.head.appendChild(st)}
  INSTALLED=true}
async function loadData(){
  try{const r=await fetch('./v224/worldflow-data-v236.json?v=wf236-1',{cache:'no-cache'});if(r.ok)DATA=await r.json()}catch(e){console.warn('wf236 data',e)}
}
globalThis.SCENE_WORLDFLOW={version:V,config:CFG,key:'worldflow236',installed:()=>INSTALLED,data:()=>DATA,state:()=>S0()?wf():null,line,
  seedGossip:o=>seedGossip(o),rivalNow:(k)=>rivalMoment(k||true),spawnCard:(k)=>spawnCard(k,'api'),resolveCard,open:openSheet,tick:()=>tick(),orbit};
function bootReady(){try{return typeof state!=='undefined'&&state.player&&typeof remember==='function'&&typeof sendDm==='function'&&typeof mkPost==='function'&&typeof showSheet==='function'&&typeof render==='function'&&!document.querySelector('.migrationboot')&&(G('SCENE_CHARBRAIN')?.installed?.()||tries>80)}catch{return false}}
let tries=0;loadData().then(()=>{const w=setInterval(()=>{if(ALL())return;tries++;if(bootReady()){clearInterval(w);install()}},300)}); /* waits for sign-up too (state.player) */
})();
