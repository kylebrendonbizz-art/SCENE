/* SCENE Master Character Runtime v200
   Kim Kardashian is the first character whose state/outcomes are owned by the structured resolver.
   Old UI remains; old relationship/proposal writers are not authoritative for Kim. */
(()=>{
'use strict';
if(globalThis.SCENE_CHARACTER200)return;
const APP_ID='kim',CHAR_ID='kim_kardashian',SCORE_PROPS=new Set(['friendship','trust','chemistry','tension']);
const KIM_PUBLIC_POSTS200=[
  'fittings.',
  'tonight.',
  'camera roll.',
  'details.',
  'family 🤍',
  'back at it.',
  'one more from last night.',
  'the glam was worth it.',
  'just because.',
  'on set.',
  'long day. good day.',
  'SKIMS.',
  'NikeSKIMS.',
  'testing two versions. one of them is obviously better.',
  'I changed my mind five times and this was the one.',
  'less talking. more doing.',
  'my favorite people 🤍',
  'okay this one made the feed.',
  'work, then dinner.',
  'very into this look.',
  'a little chaos before the photo.',
  'meetings, fittings, home.',
  'I love a clean idea.',
  'late but worth it.'
];
const STALE_KIM_PUBLIC200=new Set([
  'Meetings all day. The kind I actually like.',
  'I love when the plan comes together quietly.',
  'One thing about me: I will turn the idea into a business.',
  'testing two versions today. one of them is obviously better.',
  'meetings, fittings, product notes, repeat.',
  'quiet launch energy. I like seeing what people notice first.'
].map(x=>x.toLowerCase()));
const STARTER_FLOOR200={friendship:52,trust:42,chemistry:50};/* decided 2026-10-01: Kim as starter = real friend; never lowers a higher value */
const isStarter200=()=>state?.firstSession148?.friendId===APP_ID;
let serverSeeded200=false;
let syncSeq200=0,appliedSeq200=0,appliedRevision200=-1;
let writeDepth=0,relTarget=null,relProxy=null,profile200=null,readyPromise=null,rendererWarmPromise200=null;
const WORKER_BASE200='https://scene-brain.kylebrendonbizz.workers.dev';
let workerProbe200={ok:false,checkedAt:0,pending:null};
let lastRenderer200={source:'none',at:0,status:'idle',reason:'',transport:'none'};
const clean=(v,n=700)=>String(v??'').replace(/\s+/g,' ').trim().slice(0,n);
const key200=()=>String(state?.sceneKernel170?.playerKey||'');
const appKim=()=>typeof byId==='function'?byId(APP_ID):null;
const dynamicStore=()=>{state.sceneCharacterMaster200=state.sceneCharacterMaster200||{version:200,characters:{}};state.sceneCharacterMaster200.characters=state.sceneCharacterMaster200.characters||{};return state.sceneCharacterMaster200};
function rawLegacy(){
  const current=state?.relations?.[APP_ID];
  if(current&&typeof current==='object')return current;
  return {friendship:0,trust:0,chemistry:0,tension:0,memories:[],unlocked:true,lastTopic:''};
}
function guardRelation(){
  if(!state?.relations)return null;
  const desc=Object.getOwnPropertyDescriptor(state.relations,APP_ID);
  if(desc?.get?.sceneMaster200){applyStarterFloor200();return desc.get()}
  const existing=desc?.get?desc.get():rawLegacy();
  relTarget={friendship:Number(existing?.friendship)||0,trust:Number(existing?.trust)||0,chemistry:Number(existing?.chemistry)||0,tension:Number(existing?.tension)||0,memories:Array.isArray(existing?.memories)?existing.memories:[],unlocked:existing?.unlocked!==false,lastTopic:existing?.lastTopic||'',directAccess:Boolean(existing?.directAccess)};
  for(const [k,v] of Object.entries(existing||{}))if(!(k in relTarget))relTarget[k]=v;
  relProxy=new Proxy(relTarget,{set(o,p,v){if(SCORE_PROPS.has(String(p))&&!writeDepth)return true;o[p]=v;return true}});
  const getter=()=>relProxy;getter.sceneMaster200=true;
  const setter=v=>{if(!v||typeof v!=='object')return;for(const [k,val] of Object.entries(v)){if(SCORE_PROPS.has(k)&&!writeDepth)continue;relTarget[k]=val}};
  Object.defineProperty(state.relations,APP_ID,{configurable:true,enumerable:true,get:getter,set:setter});
  applyStarterFloor200();
  return relProxy;
}
function withWrite(fn){writeDepth++;try{return fn()}finally{writeDepth--}}
function applyStarterFloor200(){
  if(!isStarter200()||!relTarget)return false;let changed=false;
  /* The floor is a one-time seed, not immunity: once the server says it has applied the starter seed, its scores
     win (so a rude message can still cost Kim affinity) and the client stops re-raising them. */
  try{if(serverSeeded200||dynamicStore().characters?.[CHAR_ID]?.current_state?.starter_seed_applied)return false}catch{}
  for(const [k,v] of Object.entries(STARTER_FLOOR200))if((Number(relTarget[k])||0)<v){relTarget[k]=v;changed=true}
  return changed;
}
function syncLegacy(s,seq=0){
  if(!s?.relationship)return;
  /* Stale-response guard: a response from an older request (or an older server revision) must not
     overwrite newer scores we already applied. Server revision wins when present; otherwise request order. */
  const rev=Number.isFinite(Number(s.revision))?Number(s.revision):null;
  if(rev!==null){if(rev<appliedRevision200)return;appliedRevision200=rev}
  else if(seq&&seq<appliedSeq200)return;
  if(seq)appliedSeq200=Math.max(appliedSeq200,seq);
  const r=guardRelation();if(!r)return;
  withWrite(()=>{
    r.friendship=Math.max(0,Math.min(100,Number(s.relationship.affinity)||0));
    r.trust=Math.max(0,Math.min(100,Number(s.relationship.trust)||0));
    r.chemistry=Math.max(0,Math.min(100,Number(s.relationship.respect)||0));
    r.tension=Math.max(0,Math.min(100,Number(s.relationship.annoyance)||0));
  });
  if(s.current_state?.starter_seed_applied)serverSeeded200=true;
  applyStarterFloor200();
  dynamicStore().characters[CHAR_ID]=JSON.parse(JSON.stringify(s));
}
function seedState(){
  const r=rawLegacy(),active=(state.sceneProposals180||[]).filter(p=>p.characterId===APP_ID&&!['declined','completed','cancelled','confirmed','superseded_character200'].includes(String(p.status||''))),mem=(state.memory||[]).filter(m=>m.celebrityId===APP_ID),dm=(state.dms||[]).find(x=>x.id===APP_ID),meaningful=mem.filter(m=>/hangout|gift|proposal_accepted|opportunity_confirmed|collab|introduction|verified_public|verified_comment|follow_back|shared_experience|milestone/i.test(String(m.type||''))).length;
  return {
    relationship:{affinity:Number(r.friendship)||0,trust:Number(r.trust)||0,respect:Math.round(((Number(r.friendship)||0)+(Number(r.trust)||0))/2),annoyance:Number(r.tension)||0},
    awareness_of_player:{knows_player_identity:(Number(r.friendship)||0)>0||(Number(r.trust)||0)>0,knows_player_profession:false,knows_player_reputation:false,known_player_projects:[]},
    current_state:{unresolved_events:active.map(p=>({legacyProposalId:p.id,type:p.type,status:p.status,subject:p.subject||p.title||''})).slice(0,20)},
    migration_evidence:{starter_friend:state.firstSession148?.friendId===APP_ID,meaningful_interactions:meaningful,dm_turns:(dm?.messages||[]).filter(x=>x.text).length}
  };
}
function playerPayload(){
  const p=state.player||{},identity=typeof playerIdentity130==='function'?playerIdentity130(p):{};
  return {name:p.name||'Player',handle:p.handle||'',career:p.career||'',city:p.city||'',followers:Number(p.followers)||0,fame:Number(p.fame)||0,reputation:Number(p.reputation)||0,...identity};
}
async function workerReady200(force=false){
  const fresh=!force&&Date.now()-Number(workerProbe200.checkedAt||0)<5*60000;
  if(fresh)return Boolean(workerProbe200.ok);
  if(workerProbe200.pending)return workerProbe200.pending;
  workerProbe200.pending=(async()=>{
    let timer=0;
    try{
      const controller=new AbortController();timer=setTimeout(()=>controller.abort(),2200);
      const r=await fetch(`${WORKER_BASE200}/health`,{method:'GET',cache:'no-store',signal:controller.signal});
      if(!r.ok)return false;
      const out=await r.json();
      return Boolean(out?.ok&&out?.service==='scene-brain');
    }catch{return false}
    finally{if(timer)clearTimeout(timer)}
  })();
  const ok=await workerProbe200.pending;workerProbe200={ok,checkedAt:Date.now(),pending:null};return ok;
}
function applyProfile(profile){
  profile200=profile||profile200;if(!profile200)return;
  const a=appKim();if(!a)return;
  const ed=a.sceneEdited111;
  const ident=profile200.identity||{},social=profile200.social_media?.instagram||{};
  if(!ed){
    a.name=profile200.editor_name||ident.display_name||ident.name||a.name;
    a.handle=String(profile200.editor_handle||ident.primary_handle||social.handle||a.handle).replace(/^@/,'');
    a.role=profile200.editor_role||(ident.professions||[]).slice(0,3).join(' · ')||a.role;
    a.reach=Number(profile200.editor_reach||social.followers_approx)||a.reach;
    a.bio=profile200.editor_public_bio||ident.game_public_bio||a.bio;
    a.sceneBio111=profile200.editor_public_bio||social.current_bio_exact||ident.game_public_bio||a.bio;
    a.personaBio=profile200.editor_description||profile200.public_persona?.overall_writeup||a.personaBio||'';
  }
  a.sceneMaster200=true;
  a.sceneCharacterId200=CHAR_ID;
  a.sceneCanonicalBio200=social.current_bio_exact||'';
  a.sceneCanonicalPhoto200=profile200.runtime?.local_profile_image_asset||a.scenePhoto111||a.photo||'';
  a.sceneProfileCacheStatus200=profile200.runtime?.profile_picture_cache_status||'not_attempted';
  a.characterGuide137=profile200.editor_description||profile200.public_persona?.overall_writeup||a.characterGuide137||'';
  a.factualDossier137=ident.game_public_bio||a.factualDossier137||'';
  try{if(typeof PERSONA!=='undefined'){PERSONA[APP_ID]=PERSONA[APP_ID]||{};PERSONA[APP_ID].posts=[...KIM_PUBLIC_POSTS200]}}catch{}
}
function migratePublicVoice200(){
  if(!state?.player||state.sceneKimPublicVoice207)return false;
  let changed=false,n=0;const replacement=seed=>KIM_PUBLIC_POSTS200[Math.abs(typeof hash==='function'?hash(String(seed||n++)):n++)%KIM_PUBLIC_POSTS200.length];
  for(const p of state.posts||[]){if(p?.authorId!==APP_ID)continue;const old=String(p.text||'').trim();if(STALE_KIM_PUBLIC200.has(old.toLowerCase())){p.text=replacement(p.id||old);changed=true}}
  for(const s of state.stories||[]){if(s?.authorId!==APP_ID)continue;const old=String(s.caption||'').trim();if(STALE_KIM_PUBLIC200.has(old.toLowerCase())){s.caption=replacement(s.id||old);changed=true}}
  state.sceneKimPublicVoice207=true;return changed;
}
async function load200(){
  if(!state?.player||!key200())return null;
  guardRelation();
  try{
    const seq=++syncSeq200;
    const r=await fetch(`${API}/character-state`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({key:key200(),characterId:CHAR_ID,seedState:seedState()})});
    if(!r.ok)return null;
    const out=await r.json();
    if(out.profile)applyProfile(out.profile);
    if(out.state)syncLegacy(out.state,seq);
    migratePublicVoice200();
    for(const p of state.sceneProposals180||[])if(p.characterId===APP_ID&&!['declined','completed','cancelled','confirmed','superseded_character200'].includes(String(p.status||'')))p.status='superseded_character200';
    save();
    return out;
  }catch{return null}
}
function ensureReady(){if(!readyPromise)readyPromise=load200().finally(()=>{setTimeout(()=>{readyPromise=null},1500)});return readyPromise}
async function saveStaticOverride(a,next){
  if(a?.id!==APP_ID)return null;
  const overrides={
    editor_name:next?.name,
    editor_handle:next?.handle,
    editor_role:next?.role,
    editor_reach:next?.reach,
    editor_public_bio:next?.bio,
    editor_description:next?.personaBio
  };
  const localAsset=next?.photo&&/^https?:\/\//i.test(next.photo)?next.photo:'';
  try{
    const r=await fetch(`${API}/character-profile`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'save',overrides,localProfileImageAsset:localAsset})});
    if(r.ok){const out=await r.json();if(out.profile)applyProfile(out.profile);return out}
  }catch{}
  return null;
}
async function clearStaticOverride(){
  try{const r=await fetch(`${API}/character-profile`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'clear'})});if(r.ok){const out=await r.json();profile200=out.profile||null;return out}}catch{}return null
}
function canonicalAvatar(a,cls=''){
  const manual=a?.scenePhoto111||'',src=manual||a?.sceneCanonicalPhoto200||'';
  return `<span class="avatar ${cls}" aria-label="${esc(a.name)}">${src?`<img loading="lazy" src="${esc(src)}" alt="${esc(a.name)}" onerror="this.remove()">`:''}<span>${initials(a.name)}</span></span>`;
}
const baseAv200=av;av=function(a,cls=''){if(a?.id===APP_ID&&a?.sceneMaster200)return canonicalAvatar(a,cls);return baseAv200(a,cls)};
const baseSocialAvatar200=typeof socialAvatar==='function'?socialAvatar:null;
if(baseSocialAvatar200)socialAvatar=function(a){if(a?.id===APP_ID&&a?.sceneMaster200)return a.scenePhoto111||a.sceneCanonicalPhoto200||'';return baseSocialAvatar200(a)};
const baseShortBio200=typeof shortBio==='function'?shortBio:null;
if(baseShortBio200)shortBio=function(a){if(a?.id===APP_ID&&a?.sceneMaster200&&!a.sceneEdited111)return a.sceneCanonicalBio200||a.sceneBio111||a.role;return baseShortBio200(a)};

function eventVisibility(type,data){
  if(data?.visibility&&['public','private','limited'].includes(data.visibility))return data.visibility;
  if(['player_post','verified_public','verified_comment','viral_push','story_choice'].includes(type))return'public';
  if(['dm_sent','dm_reply','character_interaction_resolved','hangout','gift','celebrity_edit'].includes(type))return'private';
  return'limited';
}
function shouldBridgeEvent200(type,data={}){
  const cid=String(data.celebrityId||data.accountId||''),visibility=eventVisibility(type,data),kimIds=new Set([APP_ID,CHAR_ID,'Kim Kardashian']);
  if(kimIds.has(cid))return true;
  if(visibility==='public')return true;
  for(const key of ['witnesses','informed','known_by','knownBy'])if((Array.isArray(data?.[key])?data[key]:[]).some(x=>kimIds.has(String(x))))return true;
  return false;
}
function normalizedEvent(type,data={},m={}){
  const visibility=eventVisibility(type,data),participants=['player'],cid=String(data.celebrityId||data.accountId||'');
  if(cid)participants.push(cid===APP_ID?CHAR_ID:cid);
  return {
    event_id:String(m.id||`mem_${Date.now()}_${Math.random().toString(36).slice(2,8)}`),
    event_type:type,
    visibility,
    participants:[...new Set(participants)],
    witnesses:Array.isArray(data.witnesses)?data.witnesses:[],
    informed:Array.isArray(data.informed)?data.informed:[],
    known_by:[...new Set(participants)],
    summary:clean(data.summary||data.title||data.text||data.choice||data.outcome||type,700),
    payload:{...data,broadcast:visibility==='public'}
  };
}
async function recordEvent(event,apply=false){
  if(!state?.player||!key200())return null;
  try{
    const seq=++syncSeq200;
    const r=await fetch(`${API}/character-event`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({key:key200(),event,player:playerPayload(),seedState:seedState()})});
    if(!r.ok)return null;const out=await r.json();if(out.state)syncLegacy(out.state,seq);return out;
  }catch{return null}
}
const baseRemember200=remember;
remember=function(type,data={}){
  const out=baseRemember200(type,data);
  try{const m=state.memory?.[0];if(m?.type===type&&shouldBridgeEvent200(type,data))void recordEvent(normalizedEvent(type,data,m))}catch{}
  return out;
};

function kimStoryContext200(){
  try{
    const ctx=globalThis.SCENE_STORY169?.context?.()||null;
    if(!ctx)return null;
    const blob=JSON.stringify({thread:ctx.thread||null,current:ctx.current||null}).toLowerCase();
    return /\bkim(?: kardashian)?\b/.test(blob)?ctx:null;
  }catch{return null}
}

/* Kim client fallback v2 (2026-10-01): used when the AI/backend is unavailable (e.g. 501).
   - one reply per burst (consecutive player messages are merged into one turn by deliverMaster)
   - never repeats a line already sent in this thread
   - small intent layer (invite + place, greetings, how-are-you, plans, work/audition, compliments,
     questions about her, generic quote-back) with relationship tiers (close/friendly/stranger)
   - agreed hang-outs are written to d.kimThread200.plans so later turns remember them. */
const normLine200=x=>String(x||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
const EMOJI200=/(?:😂|😭|🤍)/u;
function kimThread200(d){
  if(!d)return {plans:[],facts:{},turns:0};
  const m=d.kimThread200=d.kimThread200&&typeof d.kimThread200==='object'?d.kimThread200:{version:1,plans:[],facts:{},turns:0};
  m.plans=Array.isArray(m.plans)?m.plans:[];m.facts=m.facts&&typeof m.facts==='object'?m.facts:{};return m;
}
function kimTier200(){
  const r=rawLegacy(),f=Number(r?.friendship)||0,tr=Number(r?.trust)||0;
  if((isStarter200()&&(Number(r?.tension)||0)<40)||(f>=51&&tr>=35))return'close';
  if(f>=25)return'friendly';
  return'stranger';
}
const PLACES200=[
  {name:'Paris',when:'next week',close:'Paris? Okay, I’m actually there next week for fittings.',friendly:'Paris… maybe. I’m there next week for fittings, so send me a day and I’ll check.',fav:'Honestly? Walking around after a fitting when nobody knows where I am. And the bread.'},
  {name:'London',when:'in a couple weeks',close:'London? I might be there for a work thing in a couple weeks.',friendly:'London could work. I’m there in a couple weeks for work, I’ll see what my days look like.'},
  {name:'New York',when:'next week',close:'New York works, I’m there for meetings next week.',friendly:'I’m in New York next week for meetings. Maybe, send me a day.'},
  {name:'Milan',when:'during fashion week',close:'Milan? I’ll be there for fashion week anyway.',friendly:'Milan, maybe. It depends on my fittings.'},
  {name:'Miami',when:'soon',close:'Miami? Okay, I could do that.',friendly:'Miami could be fun. Let me look at my calendar.'},
  {name:'LA',when:'this week',close:'I’m home, so that’s easy.',friendly:'I’m home this week, so maybe.'},
  {name:'Vegas',when:'soon',close:'Vegas? You know that’s never just one night.',friendly:'Vegas is a lot. Maybe.'}
];
/* Detection (cities, activities, day words, venues, performers, intents) now lives in the shared parser
   public/scene-parse-v228.js (window.SCENE_PARSE). Kim keeps her voice: the per-city lines above, her persona
   lookups (KUWTK, Met, Kendall, family, kids, SKIMS, law) and every reply line below. */
const parse200=()=>typeof globalThis.SCENE_PARSE==='function'?globalThis.SCENE_PARSE:null;
const kit200=()=>parse200()?.kit||null;
function placeLines200(h){
  if(!h)return null;if(!h.generic)return PLACES200.find(p=>p.name===h.name)||null;
  const nm=h.name;return {name:nm,when:'',close:`${nm}? I’d have to check where I am that week.`,friendly:`${nm}… I’d have to check where I am.`};
}
function findPlace200(t){const h=kit200()?.city?.(t)||null,p=placeLines200(h);return p&&h&&!h.generic?{re:h.re,...p}:p}/* same shape as before (incl. re) for SCENE_REPLYKIT200 */
function findActs200(t){return kit200()?.acts?.(t)||[]}
function findWhen200(t){return kit200()?.when?.(t)||''}
function activityLine200(acts,place){
  if(acts.includes('dinner')&&(acts.includes('lunch')||place))return{act:'lunch',line:'Lunch, not dinner, dinners turn into a whole thing.'};
  if(acts.includes('lunch'))return{act:'lunch',line:'Lunch works.'};
  if(acts.includes('brunch'))return{act:'brunch',line:'Brunch is fine, but not before ten.'};
  if(acts.includes('dinner'))return{act:'dinner',line:'Dinner, but early. I’m not doing a midnight thing.'};
  if(acts.includes('drinks'))return{act:'drinks',line:'One drink. I have an early call.'};
  if(acts.includes('coffee'))return{act:'coffee',line:'Coffee is easy. Mornings are better for me.'};
  if(acts.includes('party'))return{act:'party',line:'A party is a lot. Lunch first, then we’ll see.'};
  if(acts.includes('shopping'))return{act:'shopping',line:'Shopping, yes. I already know where.'};
  if(acts.includes('workout'))return{act:'workout',line:'I work out at 6am. If you can handle that, fine.'};
  if(acts.includes('movie'))return{act:'movie',line:'A movie is fine. I pick.'};
  return{act:'',line:''};
}
const DAY200='Thursday, around one';
function planLabel200(p){return [p.activity||'plans',p.place?`in ${p.place}`:'',p.when||''].filter(Boolean).join(' ')}
/* event / venue / performer invites (2026-10-01 fix): "We should go to LA bowl tomorrow? Miley is performing" — detected by SCENE_PARSE (detail.event) */
const cap200=x=>x?x[0].toUpperCase()+x.slice(1):x;
/* generic follow-ups quote ≤3 content words from what was said (SCENE_PARSE slots.quote / detail.topic), never the whole message */
function kimCandidates200(input,d){
  const raw=String(input||'').trim(),t=raw.toLowerCase().replace(/[’‘]/g,"'");
  const tier=kimTier200(),close=tier==='close',stranger=tier==='stranger';
  const mem=kimThread200(d),plan=[...mem.plans].reverse().find(p=>p&&p.status!=='cancelled')||null;
  const recent=[...(d?.messages||[])].filter(m=>m?.text),lastThem=[...recent].reverse().find(m=>m.from==='them')?.text||'';
  /* one shared parse of the whole burst; Kim reads the legacy flags in .detail (same detectors as before) */
  let parsed=null;const P=parse200();if(P)try{parsed=P(raw,{selfId:APP_ID,plans:mem.plans,lastReply:lastThem})}catch{}
  const D=parsed?.detail||{last:raw,acts:[],when:'',topic:'',event:null,city:null,project:'',work:''};
  const last=D.last;
  const tp=D.topic;
  const has=n=>new RegExp('\\b'+n+'\\b','i').test(t),question=Boolean(D.question);
  const C=[];const add=(...xs)=>{for(const x of xs)if(x)C.push(typeof x==='string'?{text:x}:x)};
  /* hostile */
  if(D.hostile){add(close?'Okay, wow. What did I do?':'Okay, you can stop talking to me like that.','I’m not doing this with you.');return C}
  /* specific legacy intents */
  if(/\b(?:invite|have|put|get)\s+me\b.{0,55}\b(?:kuwtk|keeping up(?: with the kardashians)?)\b/.test(t))add('You mean come on the show? What would you actually want to do on it?');
  if(D.bigEventTogether)add(close?'Go together? Maybe. Which one are you thinking?':'Together? Which one are you even thinking?');
  if(/met gala/.test(t)&&/\b(?:get|invite|bring|take|put|come)\b/.test(t))add('I can’t just get someone into the Met like that 😭');
  if(/introduc.*kendall|kendall.*introduc/.test(t))add(close?'What’s the intro for? Send me the context first.':'For what?');
  const fam=['kris','kendall','kylie','khloe','khloé','kourtney','north','saint','chicago','psalm','rob'].filter(has);
  if(fam.length){
    if(fam.includes('kris')&&/\b(?:told|said)\b/.test(t))add('Of course my mom told you. What did she say?');
    else if(['north','saint','chicago','psalm'].some(x=>fam.includes(x)))add('They’re good. Loud, but good. Why?');
    else add(`${fam[0][0].toUpperCase()+fam[0].slice(1)}? She’s good. Why, what happened?`,'They’re good. What’s up?');
  }
  const when0=D.when||'';
  /* "hbu?" — a little about her day; prefixed onto a plan answer when both come in one burst */
  const hbu=Boolean(D.hbu);
  const dayBits=close?['Same, honestly. Fittings all morning, then homework with the kids.','Fittings all day, I’m dead.','Long day, but good. Meetings and a fitting.']:['Busy. Meetings all day.','Work, mostly.'];
  const dayBit=hbu?dayBits[(mem.turns||0)%dayBits.length]:'';
  /* event / venue / performer invite */
  /* SCENE_PARSE already folds a bare "the show/tickets" mention into a live event plan (detail.eventFoldedIntoPlan) */
  const ev=D.event||null;
  if(ev){
    const whenTxt=when0?cap200(when0)+' works.':'';
    const p={kind:'event',activity:ev.isParty?'party':ev.isPremiere?'premiere':ev.isGame?'game':'show',what:ev.what,where:ev.venue?.name||'',whereShort:ev.venue?.short||'',place:ev.venue?.city||'',when:when0||'',timeOfDay:ev.venue?.night?'night':'',who:ev.performer?[ev.performer.name]:[],status:stranger?'declined':close?'agreed':'maybe'};
    if(stranger)add({text:`That’s sweet, but I don’t really go to ${ev.isParty?'parties':'shows'} with people I haven’t met.`,tpl:'ev-stranger',plan:p},{text:'Maybe one day. Let’s see.',tpl:'ev-stranger2',plan:p});
    else if(close){
      const lead=ev.concert?`${ev.what}? Okay, I’m in, but I’m not doing the pit.`:ev.isParty?'A party? Okay, but I’m leaving by midnight.':ev.isPremiere?'The premiere? Fine, but we’re skipping the carpet.':`${ev.what}? Okay, I’m in.`;
      add({text:[dayBit?dayBit+' But':'',dayBit?lead.replace(/^(A|The) /,m=>m.toLowerCase()):lead,whenTxt].filter(Boolean).join(' '),plan:p,tpl:'ev-yes'});
      add({text:`${ev.what}? Yes. ${whenTxt} I’ll wear something I can actually walk in.`.replace(/\s+/g,' ').trim(),plan:p,tpl:'ev-yes2'});
    }else add({text:`${dayBit?dayBit+' ':''}${ev.what} could be fun. Maybe, let me see what ${when0||'that day'} looks like.`,plan:p,tpl:'ev-maybe'});
  }
  /* follow-ups on an existing plan: "make it a night thing", "my assistant will set it up" */
  const live=plan&&!['declined','cancelled'].includes(plan.status)?plan:null;
  const nightUp=Boolean(D.nightUp);
  const logist=Boolean(D.logist);
  if(plan&&plan.status==='declined'&&!ev&&(nightUp||logist))add({text:'I said I’d pass, but thank you.',tpl:'fu-declined'},{text:'Really, it’s okay. Maybe another time.',tpl:'fu-declined2'});
  if(live&&!ev&&(nightUp||logist)){
    const isEv=live.kind==='event',np={...live};
    const lines=[];
    if(nightUp){np.timeOfDay='night';if(np.when&&!/night/.test(np.when))np.when=np.when+' night';
      lines.push(isEv&&live.timeOfDay==='night'?{text:`It’s ${live.whereShort||live.where||'a show'}, it’s a night thing anyway. One drink after, then I’m going home.`,tpl:'fu-night-ev'}:{text:'Fine, night. But I’m not staying out until 3.',tpl:'fu-night'});}
    if(logist){np.logistics='player_assistant';if(close&&np.status==='maybe')np.status='agreed';
      const viaAsst=Boolean(D.viaAssistant);if(!viaAsst)lines.push({text:'Okay, you’re handling it. I’m just showing up.',tpl:'fu-assist3'});
      lines.push({text:'Perfect. Have your assistant text mine, I’ll send you her number.',tpl:'fu-assist1'},{text:`Good. Tell them we need parking close${isEv&&/bowl/i.test(live.where||'')?', I’m not walking up that hill':''}.`,tpl:'fu-assist2'},{text:'Okay, you’re handling it. I’m just showing up.',tpl:'fu-assist3'});}
    if(nightUp&&logist&&lines.length>1){const a=lines.shift(),b=lines.shift();lines.unshift({text:`${a.text} Have your assistant text mine.`,tpl:'fu-assist1'},b);}
    for(const l of lines)add({...l,plan:np});
  }
  if(hbu&&!ev&&!(live&&(nightUp||logist)))add({text:`${dayBit} You?`.replace('dead. You?','dead. What about you?'),tpl:'hbu'});
  /* invites / plans */
  const acts=D.acts||[],place=ev?null:placeLines200(D.city),when=when0;
  const inviteCue=Boolean(D.inviteCue);
  const stillOn=Boolean(D.stillOn);
  const timeQ=Boolean(D.timeQ);
  if((stillOn||timeQ)&&plan&&plan.status==='declined')add({text:'We’re not, I said I’d pass. Nothing personal.',tpl:'still-declined'},{text:`Still a no on ${plan.whereShort||'that'}, sorry.`,tpl:'still-declined2'});
  if((stillOn||(timeQ&&plan))&&plan&&plan.kind==='event'&&plan.status!=='declined'){
    const whenTxt=[plan.when||'',plan.timeOfDay==='night'&&!/night/.test(plan.when||'')?'night':''].filter(Boolean).join(' ');
    if(timeQ)add({text:`${plan.where?'Doors are at seven, so pick me up at six thirty. Traffic to '+plan.where.replace(/^the /,'the ')+' is a nightmare.':'Seven. Don’t be late.'}`,plan:{...plan,day:'doors at seven, pickup six thirty'},tpl:'ev-time'});
    if(plan.status==='maybe')add({text:'I said maybe. Send me the details and I’ll check.',tpl:'ev-maybe-still'});
    add({text:`Yes. ${plan.what||'The show'}${whenTxt?', '+whenTxt:''}. ${plan.logistics?'Your assistant has my assistant’s number, right?':'Send me the details.'}`,tpl:'ev-still'});
  }else if(stillOn||(timeQ&&plan)){
    if(plan&&plan.status==='agreed'){
      const hour={lunch:'around one',dinner:'around seven',drinks:'around nine',coffee:'around ten',brunch:'around eleven',party:'around ten',movie:'around eight'}[plan.activity]||'around one';
      const specific=plan.when&&plan.when!==plan.placeWhen?plan.when:'';
      const nextDay=plan.day||`${specific||(plan.placeWhen==='next week'?'next Thursday':'Thursday')} ${hour}`;
      const after=/^(?:dinner|drinks|party|movie)$/.test(plan.activity)?'I have an early call the next day.':'I have a fitting after.';
      if(timeQ&&!plan.day)add({text:`${nextDay[0].toUpperCase()+nextDay.slice(1)}. ${/fitting/.test(after)?'I’m done with fittings by noon.':'That’s the only night I have.'}`,plan:{...plan,day:nextDay}});
      const sentence=`${plan.activity||'lunch'}${plan.place?` in ${plan.place}`:''}${plan.day?`, ${plan.day}`:plan.when?` ${plan.when}`:''}`;
      add({text:`Yes. ${sentence[0].toUpperCase()+sentence.slice(1)}. Don’t be late, ${after}`},{text:'Still on. I’ll text you the place the day before.'});
    }else if(plan&&plan.status==='pending')add(`We said ${plan.activity||'something'}, but you still haven’t told me where.`);
    else if(plan&&plan.status==='maybe')add(close?'Probably. Send me a day.':'I said maybe. Send me a day and I’ll check.');
    else add('Still on for what? I don’t think we actually made a plan yet.');
  }
  const hang=Boolean(D.hang);
  if(!ev&&(acts.length||place)&&inviteCue&&!stillOn){
    const al=activityLine200(acts,place),act=al.act||plan?.activity||'';
    if(stranger)add('That’s nice of you, but I don’t really make plans with people I haven’t actually met.',`${place?place.name+'? ':''}Maybe one day. Let’s see.`);
    else if(place){
      const wantsAct=al.line||(plan?.activity&&plan.kind!=='event'?`${plan.activity[0].toUpperCase()+plan.activity.slice(1)} it is.`:'What do you want to do?');
      const p={kind:act?'meal':'hang',activity:act||'hang',place:place.name,when:when||plan?.when||place.when||'',placeWhen:place.when||'',status:close?'agreed':'maybe'};
      if(close){
        add({text:`${place.close} ${wantsAct}`.trim(),plan:p});
        if(act)add({text:`${place.close} ${act[0].toUpperCase()+act.slice(1)}, then. I’ll pick the place.`,plan:p});
      }else add({text:`${place.friendly} ${al.line||''}`.trim(),plan:p});
    }else if(acts.length){
      const p={activity:al.act||acts[0],place:'',when,status:'pending'};
      if(close)add({text:`${al.line||'Okay.'} Where are you even going to be?`,plan:p},{text:`${al.line||'Okay.'} Where?`,plan:p});
      else add({text:`Maybe. ${al.line} Where were you thinking?`,plan:p});
    }
  }else if(!ev&&hang&&!stillOn){
    if(stranger)add('Lol I don’t even know you yet.','Maybe one day. We’ll see.');
    else add(close?'Okay, what did you have in mind?':'Maybe. What were you thinking?',close?'I could do something. What are you thinking?':'Depends. What did you have in mind?');
  }
  if(timeQ&&!plan&&!C.length)add(close?'For what? Tell me the plan first.':'When what?');
  /* how are you / week */
  if(D.howAreYou)
    add(close?'Good. Tired. Fittings all day, then homework with the kids. You?':'I’m good. Busy. You?',close?'Honestly busy, but good busy. How are you?':'Good, thanks. Long week.','Long week. Good though. What about you?');
  /* plans / what are you doing */
  if(D.whatDoing)
    add(D.weekend?'This weekend is the kids’ games and maybe one dinner. Why, what are you doing?':'Meetings, a fitting, then home. Very glamorous. What about you?','Work, then a SKIMS review, then bed. You?');
  /* work / audition */
  if(D.work&&!D.yourCampaign){
    const proj=D.project||'';
    if(D.booked)add(`Wait, you booked it? That’s huge. ${proj?`Tell me everything about ${proj}.`:'What’s the project?'}`);
    else{
      const what=D.work.replace('call back','callback');
      mem.facts.work={what,project:proj||'',when:when||'',at:Date.now()};
      add(`A ${what}${proj?` for ${proj}`:''}${when?` ${when}`:''}? Okay, that’s a good sign. Know your lines cold and don’t overdo the outfit.`,`${proj?`${proj[0].toUpperCase()+proj.slice(1)}? `:''}Okay. Text me after, I want to know how it goes.`);
    }
  }
  if(D.howDidItGo&&mem.facts.work)add(`Wait, the ${mem.facts.work.what}? Tell me exactly what they said.`);
  /* compliments */
  if(D.compliment){
    if(/\bskims\b/.test(t))add('Thank you. That campaign took forever, we reshot the whole thing twice.','Thank you 🤍 I was so nervous about that one.');
    else add('Stop. Thank you 🤍','That’s sweet. Thank you.','You’re nice. Thank you.');
  }
  /* questions about her */
  if(question){
    if(D.favourite&&place?.fav)add(place.fav);
    if(/\b(?:kids|children|north|saint|chicago|psalm)\b/.test(t))add('The kids are good. Loud, but good.');
    if(/\bskims\b/.test(t))add('SKIMS is busy. There’s a launch I can’t talk about yet.');
    if(/\b(?:law|bar exam|law school|lawyer)\b/.test(t))add('Still studying. It never really stops.');
    if(D.favourite&&D.aboutYou)add('Hmm. Depends on the day. Why?');
  }
  /* thanks / agreement */
  if(D.thanks)add('Of course.','Anytime.');
  if(D.agree){
    if(plan&&plan.status!=='pending')add('Good. I’ll send you the place.','Okay, good. Don’t flake.');else add('Okay, good.','Mhm.');
  }
  /* greetings (only if nothing more specific) */
  if(!C.length&&D.greeting)add(close?'Hey. What’s up?':'Hi. What’s up?',close?'Hi! What’s going on?':'Hey.',close?'Hey you.':'Hi again.',close?'Hi again.':'Hello.');
  /* story context */
  const story=kimStoryContext200(),storySummary=String(story?.thread?.summary||story?.current?.sub||'').trim();
  if(!C.length&&storySummary&&/\b(?:that|this|room|door|story|thing|what.*happen|what.*talking)\b/i.test(t))add(/\broom\b/i.test(storySummary)?'You mean the room I told you about? Yeah, I know what you mean.':`Yeah, I know what you mean. ${storySummary.slice(0,150)}`);
  /* light laughter */
  if(!C.length&&D.laughter)add('I know.','lol','😂');
  /* generic follow-up that refers to what was said */
  if(live&&D.refersBack&&!C.length)add({text:`Okay. So we’re still doing ${live.what||live.activity||'this'}${live.when?' '+live.when:''}?`,tpl:'g-plan'});
  if(tp){
    if(question)add({text:`The ${tp} thing? Depends. Give me the actual situation.`,tpl:'g-q1'},{text:`Hm. Why are you asking about ${tp}?`,tpl:'g-q2'});
    add({text:`Wait, the ${tp} thing. What happened?`,tpl:'g-1'},{text:`Okay, back up. ${cap200(tp)}?`,tpl:'g-2'},{text:`Hm. Tell me more about the ${tp} part.`,tpl:'g-3'});
  }
  add({text:'Wait, say that again. I’m in a fitting, I’m only half reading.',tpl:'g-4'},{text:'Okay. And?',tpl:'g-5'},{text:'Hm. Explain.',tpl:'g-6'},{text:'Wait, what do you mean?',tpl:'g-7'},{text:'Okay, I’m listening.',tpl:'g-8'});
  try{const K=globalThis.SCENE_KIMREPLY255;if(K&&!K.off())return K.rewrite(C,{tp,question,close,stranger,d,raw,D})}catch{} /* kimreply255: Writer kim.client200.* lines; off -> unchanged */
  return C;
}
function kimEmojiBudget200(text,d){
  const prev=(d?.messages||[]).filter(m=>m?.from==='them'&&m.text).slice(-4).map(m=>m.text);
  if(!prev.some(x=>EMOJI200.test(x)))return text;
  const out=String(text).replace(/\s*(?:😂|😭|🤍)+\s*/gu,' ').replace(/\s+([?.!,])/g,'$1').replace(/\s+/g,' ').trim();
  return out||text;
}
function clientFallback(input,d=null,apply=false){
  const used=new Set((d?.messages||[]).filter(m=>m?.from==='them'&&m.text).map(m=>normLine200(m.text)));
  const C=kimCandidates200(input,d);
  let pick=null;const usedTpl=new Set(Array.isArray(d?.kimThread200?.usedTpl)?d.kimThread200.usedTpl:[]);
  for(const c of C){const txt=kimEmojiBudget200(c.text,d);if(c.tpl&&usedTpl.has(c.tpl))continue;if(!used.has(normLine200(txt))&&!used.has(normLine200(c.text))){pick={...c,text:txt};break}}
  if(!pick){try{const K=globalThis.SCENE_KIMREPLY255;const x=K&&!K.off()?K.exhausted(used,d):'';if(x)pick={text:x}}catch{}} /* kimreply255 */
  if(!pick){const n=used.size+1;pick={text:`Okay, wait. Say that again${n%2?' but slower':''}.`};if(used.has(normLine200(pick.text)))pick={text:`Hm. I’m reading this ${n} times and I still need more.`}}
  if(apply&&d){
    const mem=kimThread200(d);mem.turns=(Number(mem.turns)||0)+1;mem.lastInput=clean(input,240);
    if(pick.tpl){mem.usedTpl=Array.isArray(mem.usedTpl)?mem.usedTpl:[];mem.usedTpl.push(pick.tpl);mem.usedTpl=mem.usedTpl.slice(-60)}
    if(pick.plan){
      const open=[...mem.plans].reverse().find(p=>p&&['pending','maybe','agreed'].includes(p.status)&&(!p.place||!pick.plan.place||p.place===pick.plan.place));
      const next={...(open||{}),...pick.plan,updatedAt:Date.now()};if(!next.id)next.id='plan'+Date.now();if(!next.createdAt)next.createdAt=Date.now();
      const becameAgreed=next.status==='agreed'&&open?.status!=='agreed';
      if(open)Object.assign(open,next);else mem.plans.push(next);
      if(becameAgreed){next.agreedAt=Date.now();if(open)open.agreedAt=next.agreedAt;try{remember('plan_agreed',{celebrityId:APP_ID,celebrity:'Kim',summary:`Agreed: ${next.kind==='event'&&next.what?next.what+(next.when?' '+next.when:''):planLabel200(next)}`,what:next.what||'',where:next.where||'',who:next.who||[],activity:next.activity,place:next.place,when:next.when,visibility:'private'})}catch{}}
    }
  }
  return pick.text;
}
async function deliverMaster(id,job){
  const a=appKim(),d=dmState(APP_ID);if(!a||!job||job.generating)return;
  /* One turn per burst: wait until the player has paused, then answer every queued player message at once. */
  const lastMine200=[...(d.messages||[])].reverse().find(m=>m?.from==='me');
  if(lastMine200&&Date.now()-Number(lastMine200.at||0)<1600){job.dueAt=Date.now()+900;d.typing=true;return}
  const burst200=(d.queue||[]).filter(x=>x&&x.text!=null);if(!burst200.includes(job))burst200.unshift(job);
  const burstIds200=new Set(burst200.map(x=>x.mid)),burstText200=burst200.map(x=>String(x.text||'[photo]').trim()).filter(Boolean).join('\n');
  job.generating=true;job.generatingAt=Date.now();
  const useWorker=false;
  if(!useWorker){try{await ensureReady()}catch{}}
  let out=null,transport='appdeploy';
  const recentMessages=(d.messages||[]).filter(x=>x.text).slice(-10).map(x=>{const row={from:x.from,text:String(x.text||'').slice(0,700)};const prev=x.sceneDecision200?.decision;if(prev)row.sceneDecision200={decision:{action:String(prev.action||''),reason_codes:(prev.reason_codes||[]).slice(0,6)}};return row});
  const payload={key:key200(),characterId:CHAR_ID,interactionId:job.mid,channel:'dm',message:burstText200||job.text||'[photo]',burstMessageIds:[...burstIds200],player:playerPayload(),seedState:seedState(),recentMessages,clientContext:{story:kimStoryContext200(),thread:d.kimThread200||null}};
  const attempt=async(base)=>{let timer=0;try{const controller=new AbortController();timer=setTimeout(()=>controller.abort(),6500);const url=base==='worker'?`${WORKER_BASE200}/api/character-interaction`:`${API}/character-interaction`;const r=await fetch(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});if(r.ok)return{ok:true,data:await r.json(),status:r.status};return{ok:false,status:r.status}}catch{return{ok:false,status:0}}finally{if(timer)clearTimeout(timer)}};
  const seq=++syncSeq200;
  let response=await attempt('appdeploy');
  if(!response.ok&&[0,502,503,504].includes(Number(response.status))){await new Promise(resolve=>setTimeout(resolve,220));response=await attempt('appdeploy')}
  if(response.ok)out=response.data;
  /* Player kept typing while we were waiting on the server: fold the new messages into this turn instead of replying twice. */
  if((d.queue||[]).some(x=>x&&!burstIds200.has(x.mid))){job.generating=false;job.generatingAt=0;job.stage='typing';job.dueAt=Date.now()+700;d.typing=true;return}
  if(out?.state)syncLegacy(out.state,seq);
  const action=out?.decision?.decision?.action||'reply',at=Date.now();
  const rendererAi=Boolean(out?.ai),rendererReason=out?.renderer?.reason||(response?.status===402||response?.status===429?'free_tier_local_character_pack':rendererAi?'contextual_ai':out?'pack_resolver':'local_character_pack');
  job.generating=false;d.typing=false;d.pending=false;
  if(action!=='ignore'){
    const packText=clean(out?.reply||'',700);
    /* never repeat any line already sent in this thread (server or local) */
    const prevThem200=new Set((d.messages||[]).filter(m=>m?.from==='them'&&m.text).map(m=>normLine200(m.text))),packRepeat200=Boolean(packText)&&(prevThem200.has(normLine200(packText))||/\bkeep\s+going\b/i.test(packText));
    const useLocal200=!packText||packRepeat200,lastFallback=useLocal200?clean(clientFallback(burstText200,d,true),700):'';
    const reply=clean(useLocal200?lastFallback:packText,700),source=!useLocal200?(rendererAi?'contextual_ai':'character_pack'):'character_pack_local';
    lastRenderer200={source,at,status:'ok',reason:rendererReason,transport};
    if(reply){
      d.messages.push({mid:'m'+at+Math.random(),from:'them',text:reply,at,replyTo:job.mid,ai:rendererAi,localAi:false,rendererSource:source,rendererReason,sceneDecision200:out?.decision||null});
      dmUpdateConversation180(a,d,reply,'them');
      d.unread=modal.dataset.dm===APP_ID?false:true;d.lastInboundAt=at;d.awaitingPlayer=true;
      remember('character_interaction_resolved',{celebrityId:APP_ID,celebrity:a.name,text:reply,inReplyTo:burstText200,burstMessageIds:[...burstIds200],turnId:job.mid,decisionAction:action,rendererSource:source,rendererReason,localAi:false,visibility:'private'});
      if(out?.decision?.decision?.world_actions?.length){
        for(const wa of out.decision.decision.world_actions){
          if(wa.type==='introduction_offer'){
            addNotif(`${a.name} is willing to make a conditional introduction to ${wa.target}.`,'career',{celebrityId:APP_ID});
            remember('character_introduction',{celebrityId:APP_ID,celebrity:a.name,target:wa.target,guaranteed:false,visibility:'private'});
          }
        }
      }
    }
  }else{
    d.awaitingPlayer=false;
  }
  for(const m of d.messages||[])if(m?.from==='me'&&burstIds200.has(m.mid))m.status='seen';
  d.queue=d.queue.filter(x=>!burstIds200.has(x.mid));
  save();
  if(modal.dataset.dm===APP_ID)refreshOpenDm(APP_ID);else if(action!=='ignore'){addNotif(`${a.name} replied to you.`,'dm',{celebrityId:APP_ID});if(state.tab==='circle')render()}
  processDmQueues();
}
const baseDeliverDmJob200=deliverDmJob;
deliverDmJob=async function(id,job){if(id===APP_ID)return deliverMaster(id,job);return baseDeliverDmJob200(id,job)};
function recoverStuckKim200(boot=false){
  const d=(state?.dms||[]).find(x=>x.id===APP_ID);if(!d)return false;
  const t=Date.now();let changed=false;
  for(const job of d.queue||[]){
    const staleGenerating=Boolean(job.generating)&&(boot||!job.generatingAt||t-Number(job.generatingAt)>45000);
    const staleTyping=job.stage==='typing'&&t-Number(job.dueAt||t)>45000;
    if(staleGenerating||staleTyping){job.generating=false;job.generatingAt=0;job.stage='typing';job.dueAt=t;changed=true}
  }
  if(d.typing&&!(d.queue||[]).length){d.typing=false;d.pending=false;changed=true}
  if(changed){try{save()}catch{};setTimeout(()=>{try{processDmQueues()}catch{}},40)}
  return changed;
}
setTimeout(()=>recoverStuckKim200(true),140);
setInterval(()=>recoverStuckKim200(false),10000);

const basePublicPersona200=typeof publicPersonaReply==='function'?publicPersonaReply:null;
if(basePublicPersona200)publicPersonaReply=function(a,text,negative=false){
  if(a?.id!==APP_ID)return basePublicPersona200(a,text,negative);
  const t=String(text||'').toLowerCase(),seed=`${text}|${negative?'n':'p'}`,pick200=list=>list[Math.abs(typeof hash==='function'?hash(seed):seed.length)%list.length];
  if(negative)return pick200(['Okay.','Noted.','You’re entitled to your opinion.']);
  if(/\b(?:love|beautiful|gorgeous|stunning|iconic|amazing|pretty|obsessed)\b/.test(t))return pick200(['Thank you 🤍','That’s sweet, thank you.','🤍']);
  if(/\b(?:when|release|drop|launch|coming|tell us|what is|what’s)\b/.test(t))return pick200(['Soon.','I’ll share when there’s something to share.','You’ll know when it’s ready.']);
  if(/😂|😭|\blol\b|\blmao\b/.test(t))return pick200(['😂','I know 😂','lol']);
  return pick200(['Exactly.','I know.','🤍']);
};

const baseRender200=render;
render=function(){guardRelation();applyProfile(profile200);return baseRender200()};

async function cacheProfileImage(){
  try{
    const r=await fetch(`${API}/character-profile`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mode:'cache_image'})});
    if(r.ok){const out=await r.json();if(out.profile){applyProfile(out.profile);if(out.profile.runtime?.local_profile_image_asset)render()}return out}
  }catch{}return null
}
function relationship(){return dynamicStore().characters[CHAR_ID]||null}

/* SCENE Motion Designer hooks (2026-10-01). Window CustomEvents for every DM thread:
   scene:dm-typing {state:'start'|'stop'}, scene:dm-delivered, scene:dm-seen, scene:dm-double-text.
   detail always has {characterId, threadId:'dm:'+characterId, messageId}; plus from:'me'|'them' where it applies.
   dm-double-text = two consecutive bubbles from the same side (detail.from says who; Motion batch3 animates that side).
   Implemented as a diff over state.dms run right after the real DM functions (sendDm, processDmQueues,
   deliverDmJob, refreshOpenDm) and on a 250ms safety tick, so it never changes DM behaviour. */
const dmSnap200=new Map();let dmEventsReady200=false;
function fireDm200(type,detail){try{window.dispatchEvent(new CustomEvent(type,{detail}))}catch{}}
function scanDmEvents200(){
  if(!state?.dms)return;
  for(const d of state.dms){
    if(!d?.id)continue;
    const msgs=(d.messages||[]).filter(m=>m&&m.mid),had=dmSnap200.get(d.id),prev=had||{mids:new Set(),seen:new Set(),typing:false,typingFor:''},job=(d.queue||[])[0]||null;
    const snap={mids:new Set(msgs.map(m=>m.mid)),seen:new Set(msgs.filter(m=>m.from==='me'&&m.status==='seen').map(m=>m.mid)),typing:Boolean(d.typing),typingFor:d.typing?(job?.mid||prev.typingFor||''):''};
    dmSnap200.set(d.id,snap);
    if(!dmEventsReady200)continue;
    const base={characterId:d.id,threadId:'dm:'+d.id};
    if(snap.typing&&!prev.typing)fireDm200('scene:dm-typing',{...base,messageId:snap.typingFor,state:'start'});
    msgs.forEach((m,i)=>{
      if(prev.mids.has(m.mid))return;
      if(prev.typing&&m.from==='them'&&!snap.typing&&!(msgs.slice(0,i).some(x=>!prev.mids.has(x.mid)&&x.from==='them')))fireDm200('scene:dm-typing',{...base,messageId:prev.typingFor,state:'stop'});
      fireDm200('scene:dm-delivered',{...base,messageId:m.mid,from:m.from});
      const before=msgs[i-1];if(before&&before.from===m.from&&(m.text||m.image)&&!m.attachment)fireDm200('scene:dm-double-text',{...base,messageId:m.mid,from:m.from,previousMessageId:before.mid});
    });
    if(prev.typing&&!snap.typing&&!msgs.some(m=>!prev.mids.has(m.mid)&&m.from==='them'))fireDm200('scene:dm-typing',{...base,messageId:prev.typingFor,state:'stop'});
    for(const mid of snap.seen)if(!prev.seen.has(mid))fireDm200('scene:dm-seen',{...base,messageId:mid,from:'me'});
  }
}
for(const name of ['sendDm','processDmQueues','refreshOpenDm']){
  try{const fn=globalThis[name];if(typeof fn!=='function')continue;const wrapped=function(...args){const out=fn.apply(this,args);try{scanDmEvents200()}catch{}if(out&&typeof out.then==='function')out.then(()=>{try{scanDmEvents200()}catch{}},()=>{});return out};globalThis[name]=wrapped;if(name==='sendDm')sendDm=wrapped;else if(name==='processDmQueues')processDmQueues=wrapped;else refreshOpenDm=wrapped}catch{}
}
{const baseDeliver200b=deliverDmJob;deliverDmJob=async function(id,job){try{return await baseDeliver200b(id,job)}finally{try{scanDmEvents200()}catch{}}}}
setTimeout(()=>{try{scanDmEvents200()}catch{};dmEventsReady200=true},0);
setInterval(()=>{try{scanDmEvents200()}catch{}},250);

globalThis.SCENE_CHARACTER200={
  version:200,
  appId:APP_ID,
  characterId:CHAR_ID,
  ready:ensureReady,
  state:relationship,
  profile:()=>profile200,
  publicPosts:()=>[...KIM_PUBLIC_POSTS200],
  rendererDebug:()=>({...lastRenderer200}),
  recordEvent,
  applyStarterFloor:()=>{guardRelation();return applyStarterFloor200()},
  saveStaticOverride,
  clearStaticOverride,
  cacheProfileImage
};

globalThis.SCENE_REPLYKIT200={findPlace:findPlace200,findActs:findActs200,findWhen:findWhen200,normLine:normLine200}; /* read-only export for non-Kim replies (scene-logic-v226); Kim's path does not use it */
guardRelation();
setTimeout(()=>void ensureReady().then(()=>{const p=profile200;if(p?.runtime?.profile_picture_cache_status==='not_attempted')void cacheProfileImage()}),80);
})();
