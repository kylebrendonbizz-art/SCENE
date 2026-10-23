/* premiumjet245 (Gameplay Logic): premium (= PRIVATE charter) vs economy travel RULES. Additive, offline, rules-based, no AI.
   Kill switch window.SCENE_PREMIUMJET_OFF=true (checked on every hook/tick: OFF = old travel, no writes, no bump, no jet lines).
   CHOICE: hooks the existing living-world v48 travel() sheet (it already has Economy / Business / Private charter / Fly home).
     class = 'premium' for data-v48-flight="private"; 'economy' for economy, business and home (business keeps its own v48
     cost/energy; it just never counts as premium). The v48 A-List lock on Private charter (rank48()>=6 || fame>=190) and its
     price (base*8.5, charged by chargeUsd48) are untouched. Can't afford -> v48 blocks ("You cannot afford this flight yet."),
     no trip is recorded, the sheet stays open so the player can pick economy. This file never writes money.
   ARRIVAL: remember('travel',{city,mode,...}) (written by completeTravel48 only after a successful charge) ->
     state.premiumjet245.lastTrip={id,city,class,mode,day,at,from}; premium also sets arrivedPrivateDay=sceneDay.
   BUMP: while the player is still in the city they flew private to (lastTrip premium, same city, <=2 game days), worldflow236
     travel-card and eventchain231 card outcomes get +0.08 on the outcome roll: the card's risk[tone] is raised by 0.08 for
     the synchronous resolve only (click capture on [data-wf236-tone]/[data-ec231-tone] + wrapped SCENE_WORLDFLOW.resolveCard /
     SCENE_EVENTCHAIN.resolve), then restored. Cards for other cities and city-less cards get no bump. Economy = no change.
   JET LINES (Writer famejet241, window.SCENE_FAMEJET_LINES): premium arrival only. ~4 s after landing ONE of kim/britney/kylie
     (must be reachable: canAccess() or in the worldflow orbit; highest friendship first; skipped if storymem238 has a memory
     beat/record for her today = storymem wins) sends jet.<c>.flex.dm the first time ever, jet.<c>.after.dm after that.
     The player's first post during that premium trip gets one comment from the same celeb (flex.comment if her flex is
     still unused, else after.comment). Flex per player per celeb: state.premiumjet245.jetFlex[celebId].flex (once ever).
     Max 1 jet DM per game day. Economy never schedules anything.
   FAME TIER: SCENE_PREMIUMJET.fameTier() = famelevel239 level (XP curve): low <6, mid 6-20, high >=21; fameLine(id,ch) picks
     fame.<c>.<tier>.<dm|comment|news> for later callers (not auto-wired; fame rooms are out of scope).
   UI HOOKS (no styling here): travel sheet buttons get .pj245-option.pj245-<class>[data-pj245-class][data-pj245-locked];
     the arrival card gets .pj245-arrival.pj245-<class>[data-pj245-class]; <html data-pj245-arrived="private"> on the game
     day of a private arrival; jet DMs/comments carry kind/rendererSource 'premiumjet245' + data premiumjet245={trip,beat}.
   Never calls render() while #modal.dataset.dm (SCENE_DMGUARD.renderSafe when present).
   Save: ONE new key state.premiumjet245 (lazy, created on the first trip; old saves load). */
(()=>{
'use strict';
if(window.SCENE_PREMIUMJET)return;
const V=245,OFF=()=>window.SCENE_PREMIUMJET_OFF===true;
const CFG={bump:.08,celebs:['kim','britney','kylie'],dmDelayMs:4000,commentDelayMs:2500,dmPerDay:1,tripDays:2,fame:{mid:6,high:21},tickMs:1000};
const T=()=>Date.now();
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const S0=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const G=n=>{try{return globalThis[n]}catch{return undefined}};
const who=id=>{try{return byId(id)}catch{return null}};
const first=a=>String(a?.name||'').split(/\s+/)[0]||'';
const day=()=>Number(S0()?.sceneDay)||0;
const fr=id=>Number(S0()?.relations?.[id]?.friendship)||0;
const save0=()=>{try{save()}catch{}};
const modalEl=()=>document.getElementById('modal');
const norm=c=>String(c||'').trim().toLowerCase();
const classOf=mode=>mode==='private'?'premium':'economy';
const STATS={bumps:0,last:null,resolvedWithBump:[]};

/* ---------- state (lazy) ---------- */
function pj(){const s=S0();if(!s)return null;let m=s.premiumjet245;if(!m||typeof m!=='object')m=s.premiumjet245={v:V};
  if(!m.jetFlex||typeof m.jetFlex!=='object')m.jetFlex={};if(!Array.isArray(m.queue))m.queue=[];if(!m.usedV||typeof m.usedV!=='object')m.usedV={};
  if(!Array.isArray(m.log))m.log=[];if(!Array.isArray(m.bumps))m.bumps=[];if(!('lastTrip' in m))m.lastTrip=null;if(!('arrivedPrivateDay' in m))m.arrivedPrivateDay=null;return m}
const peek=()=>{const m=S0()?.premiumjet245;return m&&typeof m==='object'?m:null};
function log(x){const m=pj();m.log.unshift({at:T(),day:day(),...x});m.log=m.log.slice(0,40)}
function renderSafe(){try{const g=G('SCENE_DMGUARD');if(g?.renderSafe)return g.renderSafe();if(!modalEl()?.dataset?.dm)render()}catch{}}

/* ---------- copy ---------- */
function vals(key){const L=G('SCENE_FAMEJET_LINES')||{},v=L[key];return(Array.isArray(v)?v:typeof v==='string'?[v]:[]).map(String).filter(x=>x.trim())}
function fill(t,sl){let miss=false;const o=String(t).replace(/\{(player|handle|city)\}/g,(x,k)=>{const v=sl?.[k];if(v==null||v===''){miss=true;return''}return String(v)});return miss?null:o}
/* seeded variant, no reuse of a variant until the key's pool is spent (per save); charbrain hard-fact validator when present */
function lineFor(key,sl,seed,voiceId){const vs=vals(key),n=vs.length;if(!n)return'';const m=pj(),used=Array.isArray(m.usedV[key])?m.usedV[key]:[];
  const st=H(seed+key)%n,order=[...Array(n).keys()].map(i=>(st+i)%n),fresh=order.filter(i=>!used.includes(i)),tryOrder=fresh.length?fresh:order,CB=G('SCENE_CHARBRAIN');
  for(const i of tryOrder){let t=fill(vs[i],sl);if(t==null)continue;if(voiceId==='kylie'&&/\.(dm|comment)$/.test(key))t=t.toLowerCase();
    try{if(voiceId&&CB?.brain?.(voiceId)&&CB.valid){const ok=CB.valid(voiceId,t,false);if(!ok)continue;t=ok}}catch{}
    m.usedV[key]=(fresh.length?used:[]).concat(i).slice(-n);return t}
  return''}
function playerSlots(extra={}){const p=S0()?.player||{};return{player:first(p)||p.name||'',handle:p.handle?(String(p.handle).startsWith('@')?p.handle:'@'+p.handle):'',...extra}}

/* ---------- fame tier (famelevel239 level) ---------- */
function level(){const xp=Number(S0()?.player?.xp)||0;try{const L=G('SCENE_FAMELEVEL')?.info?.(xp)?.level||G('SCENE_DIRECTOR157')?.level?.(xp)?.level;if(L)return L}catch{}return 1}
function fameTier(){const L=level();return L>=CFG.fame.high?'high':L>=CFG.fame.mid?'mid':'low'}
function fameLine(id,ch){if(OFF()||!CFG.celebs.includes(id))return'';return lineFor(`fame.${id}.${fameTier()}.${ch}`,playerSlots(),day()+'|'+T(),ch==='news'?'':id)}

/* ---------- who texts ---------- */
function storymemToday(id){const sm=S0()?.storymem238,d=day();if(!sm||G('SCENE_STORYMEM_OFF')===true)return false;
  return (sm.beats||[]).some(b=>b&&b.day===d&&b.reactor===id)||(sm.recent||[]).some(e=>e&&e.day===d&&e.celebId===id)}
function reachable(id){const a=who(id);if(!a)return false;try{if(canAccess(a))return true}catch{}try{return (G('SCENE_WORLDFLOW')?.orbit?.()||[]).includes(id)}catch{return false}}
function pickCeleb(trip,prefer){const ok=id=>reachable(id)&&!storymemToday(id)&&vals(`jet.${id}.after.dm`).length;
  if(prefer&&ok(prefer))return prefer;
  return CFG.celebs.filter(ok).sort((a,b)=>fr(b)-fr(a)||H(trip.id+a)-H(trip.id+b))[0]||''}
function beatOf(id){return pj().jetFlex[id]?.flex?'after':'flex'}
function markBeat(id,beat,ch,trip){const m=pj(),j=m.jetFlex[id]=m.jetFlex[id]||{};
  if(beat==='flex')j.flex={day:day(),ch,city:trip.city,trip:trip.id,at:T()};else{j.after=(Number(j.after)||0)+1;j.lastAfterDay=day()}}

/* ---------- delivery ---------- */
function sendDm(id,text,tag){const a=who(id);if(!a||!text||typeof dmState!=='function')return false;const d=dmState(id),at=T();
  d.messages.push({mid:'m'+at+Math.random(),from:'them',text,at,kind:'premiumjet245',rendererSource:'premiumjet245',premiumjet245:tag,replyTo:''});
  d.unread=modalEl()?.dataset?.dm!==id;d.lastInboundAt=at;try{dmUpdateConversation180(a,d,text,'them')}catch{}
  try{addNotif(`${a.name} messaged you.`,'dm',{celebrityId:id,premiumjet245:tag.trip})}catch{}return true}
function findPost(id){const s=S0();return (s.posts||[]).find(p=>p&&p.id===id)||(s.playerPostArchive||[]).find(p=>p&&p.id===id)||null}
function addComment(id,postId,text,tag){const a=who(id),p=findPost(postId);if(!a||!p||!text)return false;let c;
  try{c=typeof celebComment==='function'?celebComment('player'):null}catch{c=null}
  c=Object.assign(c||{id:'pj'+T()+Math.random(),createdAt:T(),likes:900+H(a.id+text)%9000,replies:[]},{authorId:a.id,name:a.name,handle:a.handle,text,verified:true,premiumjet245:tag});
  if(id==='kim')c.scenePublic225='kim';/* Writer copy is already Kim's voice: v225 keeps it (its own allowedKimComment225 gate still applies) */
  p.comments=Array.isArray(p.comments)?p.comments:[];p.comments.unshift(c);
  try{addNotif(`${a.name} commented on your post: “${String(text).slice(0,70)}”`,'comment',{celebrityId:a.id,postId:p.id})}catch{}return true}
function runDm(j){const m=pj(),t=m.lastTrip;if(!t||t.id!==j.trip||t.class!=='premium')return log({ev:'dm-drop',why:'trip-changed'});
  const d=day();if(m.jetDay?.day===d&&m.jetDay.n>=CFG.dmPerDay)return log({ev:'dm-capped',trip:t.id});
  const id=pickCeleb(t);if(!id)return log({ev:'dm-skip',why:'no-celeb',trip:t.id});
  const beat=beatOf(id),text=lineFor(`jet.${id}.${beat}.dm`,{city:t.city},t.id+'dm',id);if(!text)return log({ev:'dm-skip',why:'no-line',celeb:id});
  if(!sendDm(id,text,{trip:t.id,beat}))return;markBeat(id,beat,'dm',t);t.celebId=id;t.dm={celebId:id,beat};
  m.jetDay={day:d,n:(m.jetDay?.day===d?m.jetDay.n:0)+1};log({ev:'dm',celeb:id,beat,trip:t.id})}
function runComment(j){const m=pj(),t=m.lastTrip;if(!t||t.id!==j.trip||t.class!=='premium')return log({ev:'cm-drop',why:'trip-changed'});
  const id=pickCeleb(t,t.celebId);if(!id){t.commented='skip';return log({ev:'cm-skip',why:'no-celeb'})}
  const beat=beatOf(id),text=lineFor(`jet.${id}.${beat}.comment`,{city:t.city},t.id+'cm',id);if(!text){t.commented='skip';return}
  if(!addComment(id,j.postId,text,{trip:t.id,beat})){t.commented='skip';return}markBeat(id,beat,'comment',t);t.commented={celebId:id,beat,postId:j.postId};log({ev:'comment',celeb:id,beat,trip:t.id})}

/* ---------- hooks ---------- */
function liveTrip(){const t=peek()?.lastTrip,p=S0()?.player;return !OFF()&&t&&t.class==='premium'&&p&&norm(p.city)===norm(t.city)&&day()-(Number(t.day)||0)<=CFG.tripDays?t:null}
function onTravel(data){const city=String(data?.city||'');if(!city)return;const m=pj(),cls=classOf(data.mode),d=day();
  const t={id:'t'+T().toString(36)+(H(city+Math.random())%1296).toString(36),city,class:cls,mode:String(data.mode||''),day:d,at:T(),from:String(data.from||'')};
  m.lastTrip=t;m.queue=m.queue.filter(j=>j.type!=='dm'&&j.type!=='comment');/* a new trip ends the old trip window */
  if(cls==='premium'){m.arrivedPrivateDay=d;m.queue.push({type:'dm',trip:t.id,dueAt:T()+CFG.dmDelayMs})}
  log({ev:'trip',city,cls,mode:t.mode});save0();setTimeout(decorateArrival,0);setTimeout(decorateArrival,250)}
function onPlayerPost(data){const t=liveTrip();if(!t||t.commented||!data?.postId)return;t.commented='queued';pj().queue.push({type:'comment',trip:t.id,postId:data.postId,dueAt:T()+CFG.commentDelayMs});save0()}
function decorateArrival(){if(OFF())return;const t=peek()?.lastTrip,c=modalEl()?.querySelector('.outcomeoverlay .outcomecard');if(!t||!c||c.dataset.pj245Class)return;
  c.dataset.pj245Class=t.class;c.dataset.pj245City=t.city;c.classList.add('pj245-arrival','pj245-'+t.class)}
function decorateSheet(){if(OFF())return;const M=modalEl();if(!M)return;const bs=M.querySelectorAll('[data-v48-flight]');
  bs.forEach(b=>{const cls=classOf(b.dataset.v48Flight);b.dataset.pj245Class=cls;b.classList.add('pj245-option','pj245-'+cls);if(cls==='premium')b.dataset.pj245Locked=b.disabled?'1':'0'});
  if(bs.length)M.querySelector('.travelhero')?.classList.add('pj245-sheet')}
function syncHtml(){const on=!OFF()&&arrivedPrivateToday(),el=document.documentElement;if(on&&el.dataset.pj245Arrived!=='private')el.dataset.pj245Arrived='private';else if(!on&&el.dataset.pj245Arrived)delete el.dataset.pj245Arrived}
function arrivedPrivateToday(){const m=peek();return !!m&&m.arrivedPrivateDay!=null&&Number(m.arrivedPrivateDay)===day()}

/* ---------- success bump (+0.08 on the card outcome roll) ---------- */
let ACTIVE=null;
function bumpTargets(t){const out=[],c=norm(t.city),seen=new Set(),add=(r,src,id)=>{if(r&&typeof r==='object'&&!seen.has(r)){seen.add(r);out.push({r,src,id})}};
  try{const W=G('SCENE_WORLDFLOW'),w=S0()?.worldflow236,cards=W?.data?.()?.cards||[];if(!G('SCENE_WORLDFLOW_OFF')&&!G('SCENE_TRAVELCARD_OFF'))for(const x of w?.cards?.active||[])if(x.status==='open'&&x.city&&norm(x.city)===c)add(cards.find(k=>k.key===x.tpl)?.risk,'worldflow236',x.id)}catch{}
  try{const E=G('SCENE_EVENTCHAIN'),e=S0()?.eventChain;if(!G('SCENE_EVENTCHAIN_OFF'))for(const x of e?.active||[])if(x.status==='open'&&x.city&&norm(x.city)===c)add(E?.arcs?.[x.arc]?.cards?.find(k=>k.key===x.card)?.risk,'eventchain231',x.id)}catch{}
  return out}
function applyBump(via){if(ACTIVE)return false;const t=liveTrip();if(!t)return false;const tg=bumpTargets(t);if(!tg.length)return false;
  ACTIVE={via,trip:t.id,saved:tg.map(x=>({...x,o:{...x.r}}))};for(const x of tg)for(const k of Object.keys(x.r))if(Number.isFinite(x.r[k]))x.r[k]=+(x.r[k]+CFG.bump).toFixed(4);
  STATS.bumps++;STATS.last={via,trip:t.id,bump:CFG.bump,cards:tg.map(x=>x.id),at:T()};return true}
function restoreBump(){if(!ACTIVE)return;const a=ACTIVE;ACTIVE=null;for(const x of a.saved)for(const k of Object.keys(x.o))x.r[k]=x.o[k];
  const done=[];try{for(const x of S0()?.worldflow236?.cards?.active||[])if(a.saved.some(s=>s.id===x.id)&&x.status==='resolved')done.push({id:x.id,src:'worldflow236',outcome:x.outcome,tone:x.tone})}catch{}
  try{for(const x of S0()?.eventChain?.active||[])if(a.saved.some(s=>s.id===x.id)&&x.status==='resolved')done.push({id:x.id,src:'eventchain231',outcome:x.outcome,tone:x.tone})}catch{}
  if(done.length){const m=pj();for(const d of done)if(!m.bumps.some(b=>b.id===d.id)){m.bumps.unshift({...d,bump:CFG.bump,trip:a.trip,day:day()});STATS.resolvedWithBump.push(d)}m.bumps=m.bumps.slice(0,20);save0()}}
function withBump(fn,via){const on=!OFF()&&applyBump(via);try{return fn()}finally{if(on)restoreBump()}}

/* ---------- tick ---------- */
function tick(){if(OFF()||!S0()?.player)return;syncHtml();const m=peek();if(!m||!Array.isArray(m.queue)||!m.queue.length)return;
  const now=T(),keep=[];let ch=false;
  for(const j of m.queue){if(now<j.dueAt){keep.push(j);continue}try{if(j.type==='dm')runDm(j);else if(j.type==='comment')runComment(j)}catch(e){console.warn('pj245 job',e)}ch=true}
  m.queue=keep;if(ch){save0();renderSafe()}}

/* ---------- install ---------- */
let INSTALLED=false;
function install(){
  const bT=travel;travel=function(){const r=bT.apply(this,arguments);if(!OFF()){try{decorateSheet()}catch(e){console.warn('pj245 sheet',e)}}return r};
  const bR=remember;remember=function(type,data){const r=bR.apply(this,arguments);if(!OFF()&&S0()?.player){try{if(type==='travel')onTravel(data);else if(type==='player_post')onPlayerPost(data)}catch(e){console.warn('pj245 hook',e)}}return r};
  document.addEventListener('click',e=>{if(OFF())return;const b=e.target?.closest?.('[data-wf236-tone],[data-ec231-tone]');if(!b)return;if(applyBump(b.dataset.wf236Tone?'wf-click':'ec-click'))setTimeout(restoreBump,0)},true);
  const wrapApi=()=>{const W=G('SCENE_WORLDFLOW');if(W&&W.resolveCard&&!W.resolveCard.__pj245){const o=W.resolveCard;W.resolveCard=Object.assign(function(){return withBump(()=>o.apply(this,arguments),'wf-api')},{__pj245:true})}
    const E=G('SCENE_EVENTCHAIN');if(E&&E.resolve&&!E.resolve.__pj245){const o=E.resolve;E.resolve=Object.assign(function(){return withBump(()=>o.apply(this,arguments),'ec-api')},{__pj245:true})}};
  wrapApi();setInterval(()=>{try{wrapApi();tick()}catch(e){console.warn('pj245 tick',e)}},CFG.tickMs);
  INSTALLED=true}
globalThis.SCENE_PREMIUMJET={version:V,key:'premiumjet245',config:CFG,installed:()=>INSTALLED,state:()=>peek(),
  lastTrip:()=>peek()?.lastTrip||null,arrivedPrivateToday,classOf,fameTier,fameLine,liveTrip,stats:()=>STATS,tick:()=>tick(),
  beatFor:id=>peek()?.jetFlex?.[id]?.flex?'after':'flex',bump:()=>CFG.bump};
function bootReady(){try{return typeof state!=='undefined'&&state.player&&typeof travel==='function'&&typeof remember==='function'&&typeof dmState==='function'&&typeof render==='function'&&!document.querySelector('.migrationboot')&&(G('SCENE_WORLDFLOW')?.installed?.()||tries>80)}catch{return false}}
let tries=0;const w=setInterval(()=>{tries++;if(bootReady()){clearInterval(w);install()}},300); /* installs even while OFF (every hook checks OFF), so the switch can flip live */
})();
