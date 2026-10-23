/* SCENE citymaps247 (Gameplay Logic, 2026-10-10): city maps + interactive bump-intos for LA and NYC. Additive, offline, rules-based, no AI, no money.
   Extends livingcity243 (same in-city formula + LA spots + Writer LA lines); self-contained so SCENE_LIVINGCITY_OFF does not kill it.
   1. MAP: Career tab block .cm247-map.cm247-la (sunset palette, diagonal boulevards) / .cm247-map.cm247-nyc (slate street grid, cab-yellow pins).
      Shown while player.city (or homeCity) is Los Angeles or New York (existing travel() is the only way to change city).
      LA: Hollywood / Beverly Hills / Santa Monica. NYC: SoHo / Midtown / Brooklyn (v224/citymaps-data-v247.json).
   2. IN-CITY once per game day per city: kim/britney/kylie, unlocked (canAccess) only; r=fnv(seed|day|id) (LA = livingcity243 seed, so LA rolls
      match it; NYC seed adds '|nyc'); in if r < 0.35+min(0.25,fame*0.0025); max 2; one district each.
   3. BUMP: entering a district starts a visit; first in-city celeb there (not met today at that city+district) -> approach DM (1 bell row) + choice
      card: Say hi / Invite / Start drama / Walk away. Max ONE choice resolution per visit; card then ends.
      sayHi   -> choice.sayHi.dm, talk.dm, leave.dm (beats 2.2 s apart, queued in save). storymem238 memory beat for that celeb today wins the talk line.
      invite  -> choice.invite.dm, ends. Accept roll (seeded): p=0.4+friendship/100 (max .9). state.citymaps247.invite {day,id,city,spot,accepted}. Max 1/day.
      drama   -> choice.drama.dm, ends. SCENE_WORLDFLOW.seedGossip (kind 'celeb') + SCENE_STORYMEM.record(kind 'gossip', claim '<Celeb> in <District>')
                 so tomorrow's storymem beat quotes it. Max 1/day. Fixed claim template; private regex guard (kids/Stormi/conservatorship never).
      walkAway-> choice.walkAway.dm only (no second goodbye), ends.
      Every choice also lands in state.citymaps247.memories; next game day ONE quote DM for the newest unquoted memory unless storymem238 owns it
      (drama with storymem on) or storymem already DMed that celeb today.
   4. Paparazzi on an LA bump: delegates to SCENE_LIVINGCITY.paparazzi (its 1/day cap) when livingcity is on. NYC: none this patch.
   Coexistence: while citymaps is on, livingcity243's own tick stands down (1-line guard in scene-livingcity-v243.js); SCENE_CITYMAPS_OFF=true restores
   livingcity243 exactly. LA spot seeded from state.livingcity243.spot once. Copy: SCENE_CITYMAPS_LINES (Writer, optional) > SCENE_LIVINGCITY_LINES (LA)
   > neutral fallbacks naming the district + celeb. Never render(); own block only, skipped while a DM thread is open. Save: state.citymaps247 only.
   UI bridge (uiux25/uiux27): bump dispatches 'scene:encounter' {celebId,spot,city,seed} (deferred while a DM is open); listens to 'scene:encounter-chip'
   action sayhi|invite|drama|walk (choice sayHi|invite|drama|keepWalking|walkAway; keepWalking + walkAway + walk = walk-away). SCENE_CITYSTATE.presence(cityName)
   -> {spotId:[celebId]} for LA + NYC map pins (same daily roll; bump still needs the player in that city).
   bump4choice250: setSpot(spot, celebId?) / bump(celebId?) — optional tapped celeb is tried first when two share a district (same eligibility rules). */
(()=>{
'use strict';
if(window.SCENE_CITYMAPS)return;
const V=247,K='citymaps247',OFF=()=>window.SCENE_CITYMAPS_OFF===true,T=()=>Date.now();
let D={cities:{la:{name:'Los Angeles',label:'Los Angeles',tag:'Sunset grid',spots:[{id:'hollywood',label:'Hollywood',x:30,y:30},{id:'beverlyHills',label:'Beverly Hills',x:60,y:55},{id:'santaMonica',label:'Santa Monica',x:18,y:72}]},
  nyc:{name:'New York',label:'New York',tag:'Street grid',spots:[{id:'soho',label:'SoHo',x:26,y:70},{id:'midtown',label:'Midtown',x:40,y:28},{id:'brooklyn',label:'Brooklyn',x:72,y:66}]}},
  celebs:['kim','britney','kylie'],inCity:{base:.35,famePer:.0025,fameMax:.25,max:2},memDays:2,beatMs:2200};
const CHOICES=['sayHi','invite','drama','walkAway'];
const PRIVATE=/\b(kids?|children|child|daughters?|sons?|baby|babies|stormi|north|pregnan\w*|health|rehab|conservator\w*)\b/i;
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const S0=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const G=n=>{try{return globalThis[n]}catch{return undefined}};
const who=id=>{try{return byId(id)}catch{return null}};
const first=a=>String(a?.name||'').split(/\s+/)[0]||'';
const day=()=>Number(S0()?.sceneDay)||0;
const save0=()=>{try{save()}catch{}};
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dmOpen=()=>{try{return G('SCENE_DMGUARD')?.dmThreadOpen?.()??!!document.getElementById('modal')?.dataset?.dm}catch{return false}};
const fr=id=>Number(S0()?.relations?.[id]?.friendship)||0;
const fame=()=>Math.max(0,Number(S0()?.player?.fame)||0);
const NEUTRAL={
 spot:['{celeb}, out in {spot}'],
 'approach.dm':['Wait, is that you? In {spot}? Hi.','Small world. {spot}, of all places.'],
 'approach.chip':['Oh, hey.','Hi, you.'],
 'talk.dm':['{spot} is busy today. Good to see a face I know.'],
 'leave.dm':['Okay, I have to go. See you around {spot}.'],
 'choice.sayHi.dm':['Hi. Did not expect to see you in {spot}.'],'choice.sayHi.chip':['Hi.'],
 'choice.invite.dm':['Plans? Maybe. Send me details and I will look.'],'choice.invite.chip':['Send me details.'],
 'choice.drama.dm':['I am not doing this in the middle of {spot}.'],'choice.drama.chip':['Not here.'],
 'choice.walkAway.dm':['Okay. Bye, then.'],'choice.walkAway.chip':['Okay then.'],
 'quote.dm':['Still thinking about running into you in {spot} yesterday.'],
 'quote.drama.dm':['Yesterday in {spot}. People are still talking about it.'],
 'quote.invite.dm':['About the plan from {spot} yesterday. Still on?'],
 'player.sayHi.chip':['Say hi'],'player.invite.chip':['Invite'],'player.drama.chip':['Start drama'],'player.walkAway.chip':['Walk away']};
const PLAYERKEY={sayHi:'sayHi',invite:'invite',drama:'drama',walkAway:'keepWalking'}; /* Writer LA player chip ids (CHOICES.md) */

/* ---------- state ---------- */
function cm(){const s=S0();if(!s)return null;let m=s[K];const fresh=!m||typeof m!=='object';if(fresh)m=s[K]={v:V};
  for(const k of['spot','inCity','where','inCityDay','caps'])if(!m[k]||typeof m[k]!=='object'||Array.isArray(m[k]))m[k]={};
  for(const k of['met','memories','log'])if(!Array.isArray(m[k]))m[k]=[];
  for(const c of Object.keys(D.cities)){if(!m.inCity[c]||typeof m.inCity[c]!=='object')m.inCity[c]={};if(!m.where[c]||typeof m.where[c]!=='object')m.where[c]={};if(m.spot[c]&&!spotOf(c,m.spot[c]))m.spot[c]=null}
  if(!m.migrated){m.migrated=1;const old=s.livingcity243?.spot;if(old&&spotOf('la',old)&&!m.spot.la)m.spot.la=old} /* seed LA district from livingcity243 once */
  if(!Number.isFinite(m.lastDay))m.lastDay=-1;return m}
const spotOf=(c,id)=>D.cities[c]?.spots.find(s=>s.id===id)||null;
function cityKey(){const s=S0(),p=s?.player;if(!p)return null;const n=p.city||s.homeCity||'';for(const[k,c]of Object.entries(D.cities))if(c.name===n)return k;return null}
function unlocked(id){const a=who(id);if(!a)return false;try{return !!canAccess(a)}catch{return false}}
function log(x){const m=cm();m.log.unshift({day:day(),at:T(),...x});m.log=m.log.slice(0,30)}

/* ---------- copy: SCENE_CITYMAPS_LINES > SCENE_LIVINGCITY_LINES (LA) > neutral ---------- */
function vals(W,k){const v=(G(W)||{})[k];return(Array.isArray(v)?v:typeof v==='string'?[v]:[]).map(String).filter(x=>x.trim()&&!/\[PLACEHOLDER/.test(x))}
function fill(t,sl){let miss=false;const o=String(t).replace(/\{(player|celeb|spot|city)\}/g,(_,k)=>{const v=sl[k];if(!v){miss=true;return''}return v});return miss?null:o}
function pick(arr,seed,sl){const n=arr.length;if(!n)return'';const st=H(seed)%n;for(let i=0;i<n;i++){const t=fill(arr[(st+i)%n],sl);if(t&&!PRIVATE.test(t))return t}return''}
function slots(c,spot,id){const p=S0()?.player||{};return{player:String(p.name||'').split(/\s+/)[0]||'',celeb:id?(who(id)?.name||''):'',spot:spotOf(c,spot)?.label||'',city:D.cities[c]?.label||''}}
function line(c,spot,id,part,seed){const sl=slots(c,spot,id),k=`city.${c}.${spot}.${id}.${part}`;
  let t=pick(vals('SCENE_CITYMAPS_LINES',k),seed+part,sl);if(t)return t;
  if(c==='la'){t=pick(vals('SCENE_LIVINGCITY_LINES',k),seed+part,sl);if(t)return t}
  t=pick(vals('SCENE_CITYMAPS_LINES',`city.${c}.${part}`),seed+part,sl)||pick(vals('SCENE_CITYMAPS_LINES',`city.${part}`),seed+part,sl);if(t)return t;
  return pick(NEUTRAL[part]||[],seed+part,sl)}
const isWriter=(c,spot,id,part)=>vals('SCENE_CITYMAPS_LINES',`city.${c}.${spot}.${id}.${part}`).length+(c==='la'?vals('SCENE_LIVINGCITY_LINES',`city.${c}.${spot}.${id}.${part}`).length:0)>0;
function chip(c,ch){const k=PLAYERKEY[ch],sl=slots(c,'','');return pick(vals('SCENE_CITYMAPS_LINES',`city.${c}.player.${k}.chip`),'c'+ch,sl)||pick(vals('SCENE_CITYMAPS_LINES',`city.player.${k}.chip`),'c'+ch,sl)
  ||pick(vals('SCENE_LIVINGCITY_LINES',`city.la.player.${k}.chip`),'c'+ch,sl)||NEUTRAL[`player.${ch}.chip`][0]}

/* ---------- in-city (livingcity243 formula; LA seed identical) ---------- */
function seed(){const s=S0();return String(s?.player?.name||'')+'|'+String(s?.player?.handle||'')}
function refreshInCity(c,force){const m=cm(),d=day();if(!force&&m.inCityDay[c]===d)return m.inCity[c];m.inCityDay[c]=d;
  const q=D.inCity,p=q.base+Math.min(q.fameMax,fame()*q.famePer),rolled=[],pre=c==='la'?'':'|'+c,sp=D.cities[c].spots;
  m.inCity[c]={};m.where[c]={};for(const id of D.celebs){m.inCity[c][id]=false;if(!unlocked(id))continue;const r=H(seed()+pre+'|'+d+'|'+id)/4294967296;if(r<p)rolled.push([r,id])}
  rolled.sort((a,b)=>a[0]-b[0]).slice(0,q.max).forEach(([,id])=>{m.inCity[c][id]=true;m.where[c][id]=sp[H(seed()+pre+'|w|'+d+'|'+id)%sp.length].id});save0();return m.inCity[c]}

/* ---------- DM ---------- */
function pushDm(id,text,stage,notify,c,spot){const a=who(id);if(!a||!text||typeof dmState!=='function')return false;const d=dmState(id),at=T();
  const tx=id==='kylie'&&!isWriter(c,spot,id,stage)?text.toLowerCase():text;
  d.messages.push({mid:'m'+at+Math.random(),from:'them',text:tx,at,kind:K,rendererSource:K,citymaps247:stage,replyTo:''});
  d.unread=document.getElementById('modal')?.dataset?.dm!==id;d.lastInboundAt=at;try{dmUpdateConversation180(a,d,tx,'them')}catch{}
  if(notify){try{addNotif(`${a.name} ran into you in ${spotOf(c,spot)?.label||D.cities[c]?.label||''}.`,'dm',{celebrityId:id,citymaps247:stage})}catch{}}return true}

/* ---------- storymem hooks ---------- */
const SM=()=>{const x=G('SCENE_STORYMEM');return x&&window.SCENE_STORYMEM_OFF!==true?x:null};
function smBeatToday(id){try{const s=SM()?.state?.(),d=day();return(s?.beats||[]).find(b=>b.day===d&&b.reactor===id)||null}catch{return null}}
function smMemLine(id,c,spot,sd){const b=smBeatToday(id);if(!b)return'';const e=(SM().state().recent||[]).find(x=>x.id===b.mem);if(!e)return'';
  const tr={'travel-flop':'travelFlop',gossip:'gossipStart','brand-drop':'brandDrop'}[e.kind];if(!tr)return'';
  const sl={player:slots(c,spot,id).player,city:e.city||'',brand:e.brand||'',claim:e.claim||'',celeb:who(e.celebId||id)?.name||''};
  const arr=vals('SCENE_STORYMEM_LINES',`memory.${id}.${tr}.dm`).filter(t=>t!==b.dm);const t=pick(arr,sd+'sm',sl);return t} /* storymem memory that day wins */

/* ---------- visit + bump ---------- */
function bump(pref){if(OFF())return null;const c=cityKey(),m=cm(),v=m.visit,d=day();if(!c||!v||v.city!==c||v.runIn||m.card)return null;refreshInCity(c,false);
  const order=D.celebs.includes(pref)?[pref,...D.celebs.filter(x=>x!==pref)]:D.celebs; /* bump4choice250: the celeb the player tapped wins a shared district */
  const id=order.find(id=>m.inCity[c][id]&&m.where[c][id]===v.spot&&unlocked(id)&&!m.met.includes(`${d}:${c}:${v.spot}:${id}`));if(!id)return null;
  const sd=seed()+d+v.n,dm=line(c,v.spot,id,'approach.dm',sd);if(!dm)return null;
  v.runIn=id;m.met.unshift(`${d}:${c}:${v.spot}:${id}`);m.met=m.met.slice(0,60);
  m.card={id,city:c,spot:v.spot,day:d,at:T(),stage:'choose',visit:v.n,label:line(c,v.spot,id,'spot',sd),chip:line(c,v.spot,id,'approach.chip',sd),q:[],nextAt:0};
  pushDm(id,dm,'approach.dm',true,c,v.spot);log({ev:'bump',city:c,spot:v.spot,celeb:id});save0();
  if(c==='la'&&window.SCENE_LIVINGCITY_OFF!==true){try{G('SCENE_LIVINGCITY')?.paparazzi?.({celeb:id,spot:v.spot})}catch{}}
  uiEncounter();draw();return m.card}
function enterSpot(spot,why,pref){if(OFF())return false;const c=cityKey();if(!c||!spotOf(c,spot))return false;const m=cm(),d=day();
  if(m.visit&&m.visit.city===c&&m.visit.spot===spot&&m.visit.day===d&&m.spot[c]===spot)return false;
  if(m.card&&m.card.stage==='choose')m.card=null; /* walked to another district before choosing: silent clear */
  m.spot[c]=spot;m.visitN=(Number(m.visitN)||0)+1;m.visit={city:c,spot,day:d,n:m.visitN,runIn:null,resolved:null,at:T(),why:why||'pick'};log({ev:'visit',city:c,spot});save0();
  const b=bump(pref);if(!b&&why==='pick'&&c==='la'&&window.SCENE_LIVINGCITY_OFF!==true){try{G('SCENE_LIVINGCITY')?.paparazzi?.({spot})}catch{}}draw();return true}

/* ---------- uiux25/uiux27 overlay bridge (presentation lives there; never while a DM thread is open) ---------- */
function uiEncounter(){const m=cm(),a=m?.card;if(!a||a.stage!=='choose'||a.ui||dmOpen()||window.SCENE_UIUX25_OFF===true||!G('SCENE_UIUX25'))return;a.ui=1;
  try{dispatchEvent(new CustomEvent('scene:encounter',{detail:{celebId:a.id,spot:a.spot,city:a.city,seed:H(seed()+a.at)%997,source:K}}))}catch{}save0()}
function uiReply(a){try{const el=document.querySelector('.u25enc');if(!el)return;if(a.stage==='walkAway'){el.querySelector('.u25encx')?.click();return}
  if(a.reply){let bb=el.querySelector('.u25bubble');if(bb)bb.textContent=a.reply}el.querySelectorAll('.u27c').forEach(b=>{b.disabled=true})}catch{}}
const ALIAS={sayhi:'sayHi',sayHi:'sayHi',invite:'invite',drama:'drama',walk:'walkAway',walkAway:'walkAway',keepWalking:'walkAway'};
addEventListener('scene:encounter-chip',e=>{try{if(OFF())return;const d=e.detail||{},ch=ALIAS[d.action]||ALIAS[d.choice];const a=cm()?.card;if(!ch||!a||a.stage!=='choose')return;
  if(d.celebId&&d.celebId!==a.id)return;const r=choose(ch);if(r?.why==='cap')try{document.querySelector('.u25enc .u27c-'+(ch==='invite'?'invite':'drama'))?.removeAttribute('aria-pressed')}catch{}}catch(x){console.warn('cm247 chip',x)}});

/* ---------- choices ---------- */
function capped(ch){const m=cm(),d=day();return(ch==='invite'&&m.caps.inviteDay===d)||(ch==='drama'&&m.caps.dramaDay===d)}
function remember(x){const m=cm();m.memories.unshift({id:'cm.'+day()+'.'+H(T()+JSON.stringify(x))%1e6,day:day(),at:T(),...x});m.memories=m.memories.slice(0,20)}
function choose(ch){if(OFF()||!CHOICES.includes(ch))return{ok:false,why:'off'};const m=cm(),a=m.card,d=day();
  if(!a||a.stage!=='choose')return{ok:false,why:'no-card'};if(m.visit&&m.visit.n===a.visit&&m.visit.resolved)return{ok:false,why:'resolved'};
  if(capped(ch))return{ok:false,why:'cap'};const c=a.city,sp=a.spot,id=a.id,sd=seed()+a.day+a.at,lbl=spotOf(c,sp)?.label||'',out={ok:true,choice:ch};
  const react=line(c,sp,id,`choice.${ch}.dm`,sd);a.reply=line(c,sp,id,`choice.${ch}.chip`,sd);a.q=[];if(react)a.q.push([`choice.${ch}.dm`,react]);
  if(ch==='sayHi'){const t=smMemLine(id,c,sp,sd)||line(c,sp,id,'talk.dm',sd);if(t)a.q.push(['talk.dm',t]);const lv=line(c,sp,id,'leave.dm',sd);if(lv)a.q.push(['leave.dm',lv])}
  if(ch==='invite'){const p=Math.min(.9,.4+fr(id)/100),acc=H(sd+'inv')/4294967296<p;m.caps.inviteDay=d;m.invite={day:d,id,city:c,spot:sp,kind:'hang',accepted:acc};out.accepted=acc}
  if(ch==='drama'){m.caps.dramaDay=d;const claim=`${first(who(id))} in ${lbl}`,text=`${slots(c,sp,id).player} and ${who(id)?.name||''} had a tense moment in ${lbl}`;
    if(!PRIVATE.test(claim+text)){let g=null;try{if(window.SCENE_WORLDFLOW_OFF!==true&&window.SCENE_GOSSIP_OFF!==true)g=G('SCENE_WORLDFLOW')?.seedGossip?.({src:'citymaps247',kind:'celeb',celebId:id,text})}catch{}
      let r=null;try{r=SM()?.record?.({kind:'gossip',src:'citymaps247',sourceId:g?.id||`cm.${d}.${c}.${sp}.${id}`,celebId:id,city:D.cities[c].name,claim,text})}catch{}
      out.gossip=g?.id||null;out.storymem=r?.id||null;m.lastDrama={day:d,id,city:c,spot:sp,gossip:out.gossip,storymem:out.storymem}}}
  remember({kind:ch,celebId:id,city:c,spot:sp,storymem:ch==='drama'&&!!out.storymem,accepted:out.accepted});
  if(m.visit&&m.visit.n===a.visit)m.visit.resolved=ch;a.stage=ch;a.nextAt=0;log({ev:'choice',choice:ch,celeb:id,city:c,spot:sp,...out});save0();uiReply(a);drain();draw();return out}
function drain(){const m=cm(),a=m?.card;if(!a||a.stage==='choose')return;if(T()<a.nextAt)return;const x=a.q.shift();
  if(x)pushDm(a.id,x[1],x[0],false,a.city,a.spot);if(!a.q.length){m.card=null;m.last={id:a.id,city:a.city,spot:a.spot,day:a.day,choice:a.stage,reply:a.reply||''}}else a.nextAt=T()+D.beatMs;save0();draw()}

/* ---------- next-day quote (own memories; storymem owns drama when present) ---------- */
function quote(force){if(OFF())return null;const m=cm(),d=day();if(m.quoteDay===d&&!force)return null;
  const e=m.memories.find(x=>!x.quoted&&x.day<d&&d-x.day<=D.memDays&&!(x.kind==='drama'&&x.storymem));if(!e)return null;m.quoteDay=d;e.quoted=d;
  if(smBeatToday(e.celebId)){save0();return null} /* storymem already spoke for her today */
  const part=e.kind==='drama'?'quote.drama.dm':e.kind==='invite'?'quote.invite.dm':'quote.dm',t=line(e.city,e.spot,e.celebId,part,seed()+e.id);
  if(t&&pushDm(e.celebId,t,part,true,e.city,e.spot)){log({ev:'quote',mem:e.id});save0();return t}save0();return null}

/* ---------- map block (own block only; never render()) ---------- */
function css(){if(document.getElementById('cm247css'))return;const st=document.createElement('style');st.id='cm247css';
  st.textContent=`.cm247{margin:8px 12px 10px}.cm247-map{position:relative;height:150px;border-radius:18px;overflow:hidden;border:1px solid rgba(255,255,255,.14)}
.cm247-map .cm247-title{position:absolute;left:12px;top:10px;font-weight:800;font-size:14px;letter-spacing:.02em;z-index:2}.cm247-map .cm247-tag{position:absolute;right:12px;top:12px;font-size:10px;opacity:.75;text-transform:uppercase;letter-spacing:.12em;z-index:2}
.cm247-la{background:linear-gradient(160deg,#ff9a5a 0%,#f2557a 48%,#5b2a86 100%);color:#fff8ef}
.cm247-la::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(28deg,transparent 0 26px,rgba(255,255,255,.13) 26px 28px),radial-gradient(circle at 82% 22%,rgba(255,226,140,.75) 0 16px,transparent 17px);}
.cm247-la::after{content:'';position:absolute;left:0;right:0;bottom:0;height:26px;background:linear-gradient(0deg,rgba(40,170,210,.55),transparent)}
.cm247-nyc{background:linear-gradient(180deg,#1d2433 0%,#2c3a4f 100%);color:#e8eef7}
.cm247-nyc::before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 17px,rgba(200,215,235,.16) 17px 18px),repeating-linear-gradient(90deg,transparent 0 11px,rgba(200,215,235,.12) 11px 12px)}
.cm247-nyc::after{content:'';position:absolute;top:0;bottom:0;left:58%;width:14px;background:rgba(70,130,190,.45);transform:skewX(-14deg)}
.cm247-pin{position:absolute;transform:translate(-50%,-50%);z-index:2;padding:6px 10px;border-radius:14px;font-size:11px;font-weight:700;border:0;white-space:nowrap}
.cm247-la .cm247-pin{background:rgba(255,248,239,.9);color:#7a2550}.cm247-la .cm247-pin.on{background:#ffd36e;color:#4a1236;box-shadow:0 0 0 3px rgba(255,255,255,.45)}
.cm247-nyc .cm247-pin{background:#f2f4f7;color:#1d2433;border-radius:4px}.cm247-nyc .cm247-pin.on{background:#f7c600;color:#111;box-shadow:0 0 0 3px rgba(247,198,0,.35)}
.cm247-here{margin-top:6px;font-size:12px;opacity:.8}.cm247-card{margin-top:8px;padding:10px;border-radius:14px;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.12)}.cm247-card small{display:block;opacity:.75;font-size:11px}
.cm247-chip{display:inline-block;margin:6px 0 8px;padding:6px 10px;border-radius:14px;background:rgba(255,255,255,.14);font-size:13px}.cm247-acts{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.cm247-acts button{padding:9px 6px;border-radius:12px;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.08);color:inherit;font-size:12px;font-weight:700}.cm247-acts button:disabled{opacity:.4}.cm247-note{margin-top:8px;font-size:11px;opacity:.75}`;
  document.head.appendChild(st)}
function html(){const m=cm(),c=cityKey(),C=D.cities[c],cur=m.spot[c],a=m.card&&m.card.city===c?m.card:null,v=m.visit;
  let x=`<div class="cm247-map cm247-${c}" data-cm247-city="${c}"><div class="cm247-title">${E(C.label)}</div><div class="cm247-tag">${E(C.tag||'')}</div>${C.spots.map(s=>`<button type="button" class="cm247-pin${cur===s.id?' on':''}" style="left:${+s.x}%;top:${+s.y}%" data-cm247-spot="${E(s.id)}">${E(s.label)}</button>`).join('')}</div>`;
  x+=`<div class="cm247-here">${cur?'You are in '+E(spotOf(c,cur)?.label):'Tap a district'}</div>`;
  if(a&&a.stage==='choose')x+=`<div class="cm247-card" data-cm247-card="${E(a.id)}"><small>${E(a.label||who(a.id)?.name||'')}</small><div class="cm247-chip">${E(a.chip||'')}</div><div class="cm247-acts">${CHOICES.map(ch=>`<button type="button" data-cm247-choice="${ch}"${capped(ch)?' disabled':''}>${E(chip(c,ch))}${capped(ch)?' · used today':''}</button>`).join('')}</div></div>`;
  else if(a)x+=`<div class="cm247-note">${E(who(a.id)?.name||'')}: ${E(a.reply||'')} · in your DMs.</div>`;
  else if(v&&v.city===c&&v.runIn)x+=`<div class="cm247-note">You ran into ${E(who(v.runIn)?.name||'')} here${m.last?.reply&&m.last.day===day()&&m.last.spot===v.spot?': "'+E(m.last.reply)+'"':''}.</div>`;return x}
function draw(){try{const old=document.querySelector('.cm247');const s=S0();
  if(OFF()||!s?.player||s.tab!=='world'||!cityKey()){old?.remove();return}
  if(dmOpen())return; /* dmguard238: no DOM churn while a DM thread is open */
  const host=document.querySelector('.career48')?.parentElement;if(!host){old?.remove();return}
  css();const h=html();let el=old;if(!el||el.parentNode!==host){old?.remove();el=document.createElement('div');el.className='cm247';host.prepend(el);el.dataset.sig=''}
  if(el.dataset.sig!==h){el.innerHTML=h;el.dataset.sig=h}
  if(!el.__cm){el.__cm=1;el.addEventListener('click',e=>{const b=e.target.closest('[data-cm247-spot],[data-cm247-choice]');if(!b)return;e.stopPropagation();
    if(b.dataset.cm247Spot)enterSpot(b.dataset.cm247Spot,'pick');else choose(b.dataset.cm247Choice)})}}catch(e){console.warn('cm247 draw',e)}}

/* ---------- tick ---------- */
function tick(){if(OFF()){document.querySelector('.cm247')?.remove();return}const s=S0();if(!s?.player)return;const c=cityKey();
  if(!c){const m=s[K];if(m&&(m.visit||m.card)){m.visit=null;if(m.card&&m.card.stage==='choose')m.card=null;save0()}drain();draw();return}
  const m=cm(),d=day();if(m.visit&&m.visit.city!==c){m.visit=null;if(m.card&&m.card.stage==='choose')m.card=null}
  if(m.lastDay!==d){m.lastDay=d;refreshInCity(c,false);quote(false);if(m.spot[c])enterSpot(m.spot[c],'day')}
  else if(m.spot[c]&&!m.visit)enterSpot(m.spot[c],'return');
  if(m.visit&&!m.visit.runIn&&!m.card)bump();if(m.card&&m.card.city===c)uiEncounter();drain();draw()}
let INSTALLED=false;
function install(){INSTALLED=true;setInterval(()=>{try{tick()}catch(e){console.warn('cm247 tick',e)}},700);try{tick()}catch{}}
fetch('./v224/citymaps-data-v247.json?v=cm247-1',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(j=>{if(j&&j.cities&&j.cities.la&&j.cities.nyc)D={...D,...j}}).catch(()=>{});
function presence(name){if(OFF())return null;const c=Object.keys(D.cities).find(k=>D.cities[k].name===name||k===name);if(!c||!cm())return null;refreshInCity(c,false);
  const m=cm(),o={};for(const s of D.cities[c].spots)o[s.id]=[];for(const id of D.celebs)if(m.inCity[c][id]&&o[m.where[c][id]])o[m.where[c][id]].push(id);return o}
if(!globalThis.SCENE_CITYSTATE)globalThis.SCENE_CITYSTATE={presence,owner:K}; /* uiux27 hook: SCENE_CITYSTATE.presence('New York') -> {soho:[..],midtown:[..],brooklyn:[..]} */
globalThis.SCENE_CITYMAPS={presence,version:V,key:K,installed:()=>INSTALLED,owns:()=>!OFF(),state:()=>S0()?cm():null,config:()=>D,city:cityKey,
  setSpot:(id,celeb)=>enterSpot(id,'pick',celeb),bump,choose,capped,quote:()=>quote(true),tick:()=>tick(),refresh:c=>refreshInCity(c||cityKey(),true),
  force(c,id,o={}){const m=cm();if(!m||!D.cities[c])return null;if('inCity'in o)m.inCity[c][id]=!!o.inCity;if(o.spot)m.where[c][id]=o.spot;m.inCityDay[c]=day();save0();return{inCity:m.inCity[c][id],where:m.where[c][id]}}};
const wait=setInterval(()=>{try{if(OFF())return;if(typeof state!=='undefined'&&state.player&&typeof byId==='function'&&typeof canAccess==='function'&&typeof dmState==='function'&&typeof render==='function'){clearInterval(wait);install()}}catch{}},300);
})();
