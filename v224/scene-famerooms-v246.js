/* SCENE famerooms246 (Gameplay Logic, 2026-10-10): fame rooms / invite-only parties / celebs who only DM you once you're famous.
   Additive, offline, rules-based, no AI, no money writes. Kill switch window.SCENE_FAMEROOMS_OFF=true (checked on every hook/tick;
   OFF = the cold pre-246 behaviour: no gate, no card, no fame lines, wrappers pass through).
   TIERS (lean, = premiumjet245): famelevel239 level (game XP curve): low <6, mid 6-20, high >=21. SCENE_FAMEROOMS.tier().
   GATE: invite-only rooms unlock at state.player.fame >= 130 = the existing living-world v48 LADDER48 rung 'Famous'
     ("Private rooms and A-list invitations"). Fame only (the rung's follower bar is not required). SCENE_FAMEROOMS.unlockedRoom().
   ROOM/PARTY: when unlocked, max ONE invite per game day (state.sceneDay): a quiet card on Career (state.tab 'world'), no toast,
     no modal, never render(). Room = first data room for the player's city (hash by day), else a generic city room.
     Go -> small follower bump through applyEffect({followers}) (famelevel239 accessor scales it) and, at HIGH tier only, one
     celeb DM ~3 s later using fame.<celeb>.high.dm (shares the 1 fame-DM/day cap below). Skip -> nothing. SCENE_FAMEROOMS.lastInvite().
   CELEBS WHO ONLY DM WHEN FAMOUS (kim/britney/kylie):
     low tier  -> they never cold-initiate: contextualDmOpener (app maybeNpcDm + kernel170 proactive DM text) returns '' for them,
                  kernel170 pending 'dm' reactions for them are cancelled (status 'cancelled', famerooms246:'cold'), and
                  SCENE_LOGIC226.proactive(...,'dm') returns ''. Story-driven beats (storymem, livingcity run-ins, worldflow/eventchain
                  cards, story228 invites, premiumjet jet DMs, replies to the player) are NOT cold initiates and are untouched.
     mid/high  -> at most ONE fame-tier initiate DM per game day across the three (fame.<c>.<tier>.dm): either the daily initiator
                  (after initDelayMs of play in the day; idle thread, reachable, no storymem/jet DM from her today; at high tier it waits
                  while today's invite is open, so Go -> party DM is the day's one) or the first
                  contextual opener/kernel proactive DM text that day. Later openers that day keep their existing text.
   LOOKUP ORDER: storymem238 memory for that celeb that day (her opener/comment keeps the existing text; storymem's own beat
     speaks) > fame.<c>.<tier>.<ch> line > existing fallbacks. Comments: SCENE_LOGIC226.proactive(...,'comment') for britney/kylie
     uses fame.<c>.<tier>.comment max 1 per celeb per game day (kim's proactive comments keep the kim v225 path).
   Copy: window.SCENE_FAMEJET_LINES (Writer famejet241, synced by premiumjet245) for fame.*; optional window.SCENE_FAMEROOMS_LINES
     for room card copy (neutral fallbacks below). Lines pass the charbrain hard-fact validator when present; kylie dm/comment lowercased.
   DM guard: never render() while #modal.dataset.dm; SCENE_DMGUARD.renderSafe when present.
   Save: ONE new key state.famerooms246 (lazy: created on the first invite / fame DM / fame comment; old saves load).
   UI hooks: .fr246[data-fr246-status=open|went|skipped][data-fr246-room] > .fr246-title/.fr246-body/.fr246-go/.fr246-skip;
     html[data-fr246-tier=low|mid|high][data-fr246-unlocked=0|1]; DMs kind/rendererSource 'famerooms246', message.famerooms246={src,tier,day}. */
(()=>{
'use strict';
if(window.SCENE_FAMEROOMS)return;
const V=246,K='famerooms246',OFF=()=>window.SCENE_FAMEROOMS_OFF===true,T=()=>Date.now();
const CFG={gateFame:130,gateRung:'Famous',fame:{mid:6,high:21},celebs:['kim','britney','kylie'],initDelayMs:20000,partyDmDelayMs:3000,
  bump:{pct:.004,min:200,max:4000},tickMs:1000};
const ROOMS=[
 {id:'la-hills-dinner',city:'Los Angeles',label:'Hills dinner, no phones'},
 {id:'la-studio-afterparty',city:'Los Angeles',label:'Studio after-party, list only'},
 {id:'ny-penthouse',city:'New York',label:'Penthouse listening party'},
 {id:'london-members',city:'London',label:'Members-club late room'},
 {id:'paris-atelier',city:'Paris',label:'Atelier dinner after the show'}];
const FALL={'rooms.card.kicker':'Invite only','rooms.card.title':'{room}','rooms.card.body':"Your name's on the list tonight. No plus-ones.",
  'rooms.card.go':'Go','rooms.card.skip':'Not tonight','rooms.card.went':'You went. +{followers} followers.','rooms.card.skipped':'You passed on tonight.',
  'rooms.generic':'Private room, {city}'};
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const S0=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const G=n=>{try{return globalThis[n]}catch{return undefined}};
const who=id=>{try{return byId(id)}catch{return null}};
const first=a=>String(a?.name||'').split(/\s+/)[0]||'';
const day=()=>Number(S0()?.sceneDay)||0;
const fr=id=>Number(S0()?.relations?.[id]?.friendship)||0;
const save0=()=>{try{save()}catch{}};
const modalEl=()=>document.getElementById('modal');
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c]);

/* ---------- state (lazy) ---------- */
function fm(){const s=S0();if(!s)return null;let m=s[K];if(!m||typeof m!=='object')m=s[K]={v:V};
  if(!m.usedV||typeof m.usedV!=='object')m.usedV={};if(!Array.isArray(m.invites))m.invites=[];if(!m.dmDay||typeof m.dmDay!=='object')m.dmDay={day:null,celebId:null,src:null};
  if(!m.cmDay||typeof m.cmDay!=='object')m.cmDay={day:null,ids:[]};if(!Array.isArray(m.log))m.log=[];if(!Array.isArray(m.queue))m.queue=[];return m}
const peek=()=>{const m=S0()?.[K];return m&&typeof m==='object'?m:null};
function log(x){const m=fm();m.log.unshift({at:T(),day:day(),...x});m.log=m.log.slice(0,40)}
function renderSafe(){try{const g=G('SCENE_DMGUARD');if(g?.renderSafe)return g.renderSafe();if(!modalEl()?.dataset?.dm)render()}catch{}}

/* ---------- tier + gate ---------- */
function level(){const xp=Number(S0()?.player?.xp)||0;try{const L=G('SCENE_FAMELEVEL')?.info?.(xp)?.level||G('SCENE_DIRECTOR157')?.level?.(xp)?.level;if(L)return L}catch{}return 1}
function tier(){const L=level();return L>=CFG.fame.high?'high':L>=CFG.fame.mid?'mid':'low'}
const unlocked=()=>!OFF()&&(Number(S0()?.player?.fame)||0)>=CFG.gateFame;

/* ---------- copy ---------- */
function vals(key){const L=G('SCENE_FAMEJET_LINES')||{},v=L[key];return(Array.isArray(v)?v:typeof v==='string'?[v]:[]).map(String).filter(x=>x.trim())}
function fill(t,sl){let miss=false;const o=String(t).replace(/\{(player|handle|city|room|followers)\}/g,(x,k)=>{const v=sl?.[k];if(v==null||v===''){miss=true;return''}return String(v)});return miss?null:o}
function slots(extra={}){const p=S0()?.player||{};return{player:first(p)||p.name||'',handle:p.handle?(String(p.handle).startsWith('@')?p.handle:'@'+p.handle):'',city:p.city||'',...extra}}
function lineFor(key,seed,voiceId){const vs=vals(key),n=vs.length;if(!n)return'';const m=fm(),used=Array.isArray(m.usedV[key])?m.usedV[key]:[];
  const st=H(seed+key)%n,order=[...Array(n).keys()].map(i=>(st+i)%n),fresh=order.filter(i=>!used.includes(i)),tryOrder=fresh.length?fresh:order,CB=G('SCENE_CHARBRAIN');
  for(const i of tryOrder){let t=fill(vs[i],slots());if(t==null)continue;if(voiceId==='kylie'&&/\.(dm|comment)$/.test(key))t=t.toLowerCase();
    try{if(voiceId&&CB?.brain?.(voiceId)&&CB.valid){const ok=CB.valid(voiceId,t,false);if(!ok)continue;t=ok}}catch{}
    m.usedV[key]=(fresh.length?used:[]).concat(i).slice(-n);return t}
  return''}
function ui(key,sl){const L=G('SCENE_FAMEROOMS_LINES')||{};let v=L[key];if(Array.isArray(v))v=v[H(day()+key)%v.length];const t=typeof v==='string'&&v.trim()?fill(v,sl):null;return t??fill(FALL[key]||'',sl)??''}

/* ---------- who ---------- */
function storymemToday(id){const sm=S0()?.storymem238,d=day();if(!sm||G('SCENE_STORYMEM_OFF')===true)return false;
  return (sm.beats||[]).some(b=>b&&b.day===d&&b.reactor===id)||(sm.recent||[]).some(e=>e&&e.day===d&&e.celebId===id)}
function jetToday(id){const pj=S0()?.premiumjet245;return !!pj&&G('SCENE_PREMIUMJET_OFF')!==true&&pj.jetDay?.day===day()&&pj.lastTrip?.celebId===id}
function reachable(id){const a=who(id);if(!a)return false;try{if(canAccess(a))return true}catch{}try{return (G('SCENE_WORLDFLOW')?.orbit?.()||[]).includes(id)}catch{return false}}
function idle(id){const d=(S0()?.dms||[]).find(x=>x&&x.id===id);if(!d)return true;return !(d.queue?.length||d.typing||d.pending||d.replying)&&d.messages?.at(-1)?.from!=='them'}
function pickCeleb(t,seed){return CFG.celebs.filter(id=>reachable(id)&&idle(id)&&!storymemToday(id)&&!jetToday(id)&&vals(`fame.${id}.${t}.dm`).length)
  .sort((a,b)=>fr(b)-fr(a)||H(seed+a)-H(seed+b))[0]||''}
const dmUsedToday=()=>{const m=peek();return !!m&&m.dmDay?.day===day()&&!!m.dmDay.celebId};

/* ---------- delivery ---------- */
function useDm(id,src){const m=fm();m.dmDay={day:day(),celebId:id,src,at:T()};log({ev:'dm',celeb:id,src,tier:tier()})}
function sendDm(id,text,tag){const a=who(id);if(!a||!text||typeof dmState!=='function')return false;const d=dmState(id),at=T();
  d.messages.push({mid:'m'+at+Math.random(),from:'them',text,at,kind:'famerooms246',rendererSource:'famerooms246',famerooms246:tag,replyTo:''});
  d.unread=modalEl()?.dataset?.dm!==id;d.lastInboundAt=at;d.awaitingPlayer=true;try{dmUpdateConversation180(a,d,text,'them')}catch{}
  try{if(modalEl()?.dataset?.dm!==id)addNotif(`${a.name} messaged you.`,'dm',{celebrityId:id,famerooms246:tag.src})}catch{}
  try{if(modalEl()?.dataset?.dm===id&&typeof refreshOpenDm==='function')refreshOpenDm(id)}catch{}return true}
/* daily fame-tier initiate (mid+): one per game day across kim/britney/kylie */
function initiate(src,tOverride){if(OFF())return false;const t=tOverride||tier();if(t==='low'||dmUsedToday())return false;
  const id=pickCeleb(t,day()+'|'+src);if(!id){return false}const text=lineFor(`fame.${id}.${t}.dm`,day()+'|'+src,id);if(!text)return false;
  if(!sendDm(id,text,{src,tier:t,day:day()}))return false;useDm(id,src);save0();renderSafe();return id}

/* ---------- rooms ---------- */
function roomFor(d){const city=S0()?.player?.city||'Los Angeles',pool=ROOMS.filter(r=>r.city===city);
  if(pool.length){const r=pool[H(d+'|room')%pool.length];return{id:r.id,city,label:r.label}}return{id:'generic-'+String(city).toLowerCase().replace(/\W+/g,'-'),city,label:ui('rooms.generic',{city})}}
function todayInvite(){const m=peek();return m?.invites?.find(x=>x.day===day())||null}
function offer(){if(!unlocked()||todayInvite())return null;const d=day(),r=roomFor(d),m=fm();
  const inv={id:`fr246-${d}-${r.id}`,day:d,room:r.id,label:r.label,city:r.city,status:'open',at:T(),tier:tier()};m.invites.unshift(inv);m.invites=m.invites.slice(0,20);
  log({ev:'invite',room:r.id});save0();return inv}
function bumpFor(){const f=Number(S0()?.player?.followers)||0;return Math.max(CFG.bump.min,Math.min(CFG.bump.max,Math.round(f*CFG.bump.pct)))}
function attend(id){if(OFF())return false;const inv=todayInvite();if(!inv||inv.id!==id||inv.status!=='open')return false;const p=S0().player,f0=Number(p.followers)||0,base=bumpFor();
  try{if(typeof applyEffect==='function')applyEffect({followers:base});else p.followers=f0+base}catch{p.followers=f0+base}
  inv.status='went';inv.wentAt=T();inv.followersBase=base;inv.followersGot=(Number(p.followers)||0)-f0;
  if(tier()==='high'&&!dmUsedToday())fm().queue.push({type:'partyDm',inv:inv.id,day:inv.day,dueAt:T()+CFG.partyDmDelayMs});
  log({ev:'went',room:inv.room,base,got:inv.followersGot});save0();draw(true);return true}
function skip(id){const inv=todayInvite();if(!inv||inv.id!==id||inv.status!=='open')return false;inv.status='skipped';log({ev:'skipped',room:inv.room});save0();draw(true);return true}
function runQueue(){const m=peek();if(!m?.queue?.length)return;const now=T(),keep=[];
  for(const j of m.queue){if(now<j.dueAt){keep.push(j);continue}try{if(j.type==='partyDm'&&j.day===day()){const id=initiate('party','high');const inv=m.invites.find(x=>x.id===j.inv);if(inv)inv.dmFrom=id||null}}catch(e){console.warn('fr246 job',e)}}
  m.queue=keep}

/* ---------- Career card (own element; never render()) ---------- */
function css(){if(document.getElementById('fr246css'))return;const st=document.createElement('style');st.id='fr246css';
  st.textContent='.fr246{margin:8px 16px;padding:10px 12px;border-radius:14px;border:1px solid rgba(212,175,55,.45);background:rgba(20,16,8,.35);font-size:13px;line-height:1.35}.fr246 .fr246-k{display:block;font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;opacity:.7}.fr246 .fr246-title{display:block;font-weight:600;margin:2px 0}.fr246 .fr246-body{display:block;opacity:.85}.fr246 .fr246-row{display:flex;gap:8px;margin-top:8px}.fr246 button{flex:1;padding:7px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.2);background:transparent;color:inherit;font:inherit}.fr246 .fr246-go{background:rgba(212,175,55,.25)}';
  document.head.appendChild(st)}
function host(){const l=document.querySelector('.lx244');if(l)return{after:l};const h=document.querySelector('.u10-head');if(h&&h.parentElement)return{after:h};const i=document.querySelector('.careerpanelintro');if(i)return{after:i};
  const c=document.querySelector('.career48');return c?{prepend:c}:null}
let lastSig='';
function draw(force){try{const old=document.querySelector('.fr246'),s=S0(),inv=todayInvite();
  if(OFF()||!s?.player||s.tab!=='world'||!inv||!unlocked()){old?.remove();return}
  const h=host();if(!h){old?.remove();return}
  let el=old;const ok=el&&(h.after?el.previousElementSibling===h.after:el.parentNode===h.prepend);
  const sig=inv.id+'|'+inv.status;if(ok&&!force&&sig===lastSig)return;lastSig=sig;
  if(!ok){old?.remove();el=document.createElement('div');el.className='fr246';el.setAttribute('aria-live','off');if(h.after)h.after.after(el);else h.prepend.prepend(el)}
  css();el.dataset.fr246Status=inv.status;el.dataset.fr246Room=inv.room;el.dataset.fr246Invite=inv.id;
  const body=inv.status==='went'?ui('rooms.card.went',{followers:(inv.followersGot||inv.followersBase||0).toLocaleString()}):inv.status==='skipped'?ui('rooms.card.skipped'):ui('rooms.card.body');
  el.innerHTML=`<span class="fr246-k">${esc(ui('rooms.card.kicker'))}</span><span class="fr246-title">${esc(ui('rooms.card.title',{room:inv.label}))}</span><span class="fr246-body">${esc(body)}</span>`+
    (inv.status==='open'?`<div class="fr246-row"><button type="button" class="fr246-go" data-fr246-go="${esc(inv.id)}">${esc(ui('rooms.card.go'))}</button><button type="button" class="fr246-skip" data-fr246-skip="${esc(inv.id)}">${esc(ui('rooms.card.skip'))}</button></div>`:'');
  }catch(e){console.warn('fr246 draw',e)}}
document.addEventListener('click',e=>{const b=e.target?.closest?.('[data-fr246-go],[data-fr246-skip]');if(!b||OFF())return;e.preventDefault();e.stopPropagation();
  if(b.dataset.fr246Go)attend(b.dataset.fr246Go);else skip(b.dataset.fr246Skip)},true);

/* ---------- cold gate + fame line wiring ---------- */
const trio=a=>!!a&&CFG.celebs.includes(a.id);
/* text for a cold initiate DM: null = keep existing, '' = blocked (low fame) */
function initiateText(a,src){if(OFF()||!trio(a))return null;const t=tier();if(t==='low'){log0(a.id,src);return''}
  if(storymemToday(a.id)||dmUsedToday())return null;const text=lineFor(`fame.${a.id}.${t}.dm`,day()+'|'+src,a.id);if(!text)return null;useDm(a.id,src);return text}
function log0(id,src){const s=STATS.cold;s.push({id,src,day:day(),at:T()});if(s.length>40)s.shift()}
function commentText(a){if(OFF()||!trio(a)||storymemToday(a.id))return null;const m=peek(),d=day();if(m?.cmDay?.day===d&&m.cmDay.ids.includes(a.id))return null;
  const t=tier(),text=lineFor(`fame.${a.id}.${t}.comment`,d+'|cm',a.id);if(!text)return null;const c=fm().cmDay;if(c.day!==d){c.day=d;c.ids=[]}c.ids.push(a.id);log({ev:'comment',celeb:a.id,tier:t});return text}
function sweepKernel(){if(OFF()||tier()!=='low')return;const k=S0()?.sceneKernel170;if(!Array.isArray(k?.reactionQueue))return;let n=0;
  for(const q of k.reactionQueue){if(q&&(!q.status||q.status==='pending')&&!q.processing&&q.channel==='dm'&&CFG.celebs.includes(q.targetId)){q.status='cancelled';q.famerooms246='cold';n++;log0(q.targetId,'kernel170')}}
  if(n)save0()}
const STATS={cold:[]};

/* ---------- tick ---------- */
let dayKey=null,dayStart=0;
function syncHtml(){const r=document.documentElement;if(OFF()||!S0()?.player){delete r.dataset.fr246Tier;delete r.dataset.fr246Unlocked;return}const t=tier(),u=unlocked()?'1':'0';if(r.dataset.fr246Tier!==t)r.dataset.fr246Tier=t;if(r.dataset.fr246Unlocked!==u)r.dataset.fr246Unlocked=u}
function tick(){syncHtml();if(OFF()){document.querySelector('.fr246')?.remove();return}if(!S0()?.player)return;
  const d=day();if(dayKey!==d){dayKey=d;dayStart=T()}
  sweepKernel();offer();runQueue();
  const ti=tier(),inv=todayInvite();/* high tier + open invite: the party DM (on Go) is today's fame DM; Skip frees the daily initiator */
  if(ti!=='low'&&!dmUsedToday()&&T()-dayStart>=CFG.initDelayMs&&!(ti==='high'&&inv?.status==='open')&&!(inv?.status==='went'&&peek()?.queue?.length))initiate('daily');
  draw()}

/* ---------- install ---------- */
let INSTALLED=false;
function install(){
  if(typeof contextualDmOpener==='function'&&!contextualDmOpener.__fr246){const b=contextualDmOpener;const w=function(a,mem){const x=(()=>{try{return initiateText(a,'opener')}catch{return null}})();if(x!=null){if(x)save0();return x}return b.apply(this,arguments)};w.__fr246=true;w.__base=b;contextualDmOpener=w}
  const wrapL=()=>{const L=G('SCENE_LOGIC226');if(!L||typeof L.proactive!=='function'||L.proactive.__fr246)return;const o=L.proactive;
    L.proactive=Object.assign(function(a,f,ch){try{const x=ch==='comment'?commentText(a):initiateText(a,'logic226');if(x!=null)return x}catch{}return o.apply(this,arguments)},{__fr246:true,__base:o})};
  const bR=remember;remember=function(){const r=bR.apply(this,arguments);try{sweepKernel()}catch{}return r};
  wrapL();setInterval(()=>{try{wrapL();tick()}catch(e){console.warn('fr246 tick',e)}},CFG.tickMs);INSTALLED=true}
globalThis.SCENE_FAMEROOMS={version:V,key:K,config:CFG,rooms:ROOMS,installed:()=>INSTALLED,state:()=>peek(),
  tier:()=>tier(),level,unlocked:()=>unlocked(),
  unlockedRoom:()=>{if(!unlocked())return null;const i=todayInvite();return i?{id:i.room,label:i.label,city:i.city,invite:i.id,status:i.status}:roomFor(day())},
  lastInvite:()=>peek()?.invites?.[0]||null,attend,skip,initiate:()=>initiate('api'),dmToday:()=>peek()?.dmDay?.day===day()?{...peek().dmDay}:null,stats:()=>STATS,tick:()=>tick()};
function bootReady(){try{return typeof state!=='undefined'&&state.player&&typeof remember==='function'&&typeof dmState==='function'&&typeof render==='function'&&!document.querySelector('.migrationboot')&&(G('SCENE_PREMIUMJET')?.installed?.()||tries>80)}catch{return false}}
let tries=0;const w=setInterval(()=>{tries++;if(bootReady()){clearInterval(w);install()}},300); /* installs even while OFF (every hook checks OFF) */
})();
