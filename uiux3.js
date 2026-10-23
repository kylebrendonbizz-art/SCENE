/* SCENE uiux3 · DM reply chips (2026-10-01, UI/UX)
   2–3 tappable suggestions above the DM composer. Tapping one types it into the REAL composer
   (#dmtext) and presses the REAL Send button (#dmsend), so sendDm, DM events, memory and the
   offline reply layer behave exactly as if the player typed it. Long-press or ✎ = fill only.
   Provider API: window.SCENE_DM_CHIPS = { provide(ctx) -> [{text, intent}] }
     ctx = {characterId, threadId, lastTheirText, lastMyText, tier, plans, entities, intents}
   Kill switch: window.SCENE_DM_CHIPS_OFF = true. No core files are edited; nothing is written to the save. */

/* ======================================================================================
   CHIP TEXT: SCENE Writer's final copy (from /workspace/writer/handoff/chips/chip-text.js, 2026-10-01).
   Edit lines here; keep the keys. Keys = SCENE_PARSE intent names. Slots = SCENE_PARSE slot names:
   {person} {place} {time} {activity} {meal} {event} {favour}
   A line is only offered when EVERY slot it uses is filled from this thread or the save (a chip with an
   unfilled {slot} never renders). memory_check / favour_ask only appear when the parser reports that
   intent / fills {favour}. rude is intentionally empty. byCharacter lines go in front for that character only.
   ====================================================================================== */
const SCENE_DM_CHIP_TEXT = {
  greeting:       ['Heyyy, what are you up to?', 'Hi you! How’s your week?', 'Okay hi, I miss you', 'Hey stranger 👀', 'Hiii, you alive?'],
  ask_about_them: ['How’s your day going?', 'What are you doing this weekend?', 'Okay tell me everything', 'How are you actually?', 'What’s keeping you busy?', 'Anything fun coming up?'],
  invite:         ['{place} {time}? I’m serious', 'Come to {place} with me {time}', '{meal} {time}? My treat', 'We need a {meal} date this week', 'Drinks this weekend? Say yes', 'You, me, {place}. Thoughts?', 'Coffee soon?'],
  plan_followup:  ['Still on for {event} {time}?', 'Are we still doing {meal}?', 'What time for {place}?', 'Want me to pick you up?', 'I’ll get my assistant to sort it', 'What are you wearing to {event}?', 'Let’s make it a whole night', 'Still on for {time}? 👀'],
  compliment:     ['You looked insane in your last post', 'Your style lately >>>', 'You make it look so easy', 'Honestly obsessed with you'],
  work:           ['Is work crazy right now?', 'How was set today?', 'Busy week?', 'You working too hard again?'],
  tease:          ['Don’t you dare flake 😂', 'You’re always busy, I’m offended', 'Be on time for once 😂', 'Bet you forgot about me'],
  news_share:     ['Okay I have news', 'You will NOT believe my day', 'Wait, can I tell you something?'],
  memory_check:   ['Do you remember {event}?', 'Remember what I told you about {event}?', 'You remember {place}, right?'],
  favour_ask:     ['Can I ask you a small favour?', 'Could you help me out with {favour}?', 'Be honest, would you be down for {favour}?'],
  rude:           [],   // never suggested
  byCharacter: {
    kim: {
      ask_about_them: ['How are the kids?', 'How’s SKIMS going?', 'How’s law school going?'],
      compliment:     ['That SKIMS campaign was so good'],
      plan_followup:  ['What should I wear?', 'Do I need to dress up for this?']
    }
  }
};

(()=>{'use strict';
if(window.__uiux3)return;window.__uiux3=true;

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const norm=x=>String(x||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim();
// game globals are top-level let/const in app.js (classic script), so they are reachable by name but not on window
const G=n=>{try{switch(n){case'state':return typeof state!=='undefined'?state:undefined;case'celebs':return typeof celebs!=='undefined'?celebs:undefined;case'CITY':return typeof CITY!=='undefined'?CITY:undefined}}catch{}return undefined};
const isKim=id=>id==='kim'||id==='kim_kardashian';
const reduced=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return false}};
const off=()=>window.SCENE_DM_CHIPS_OFF===true;
const thread=id=>{const st=G('state');return (st?.dms||[]).find(d=>d&&d.id===id)||null}; // read-only: never dmState() (it creates rows)

/* ---------- entity extraction ---------- */
/* TEMP fallback, used ONLY when window.SCENE_PARSE (Gameplay Logic's shared parser) is not defined.
   Venue names mirror VENUES200 in scene-character-runtime-v200.js (that list is private to its closure). */
const VENUES_TEMP=[
  [/\b(?:the )?(?:hollywood|la|l\.a\.) bowl\b|\bthe bowl\b/,'the Bowl'],[/\b(?:the )?greek(?: theatre| theater)?\b/,'the Greek'],
  [/\bsofi(?: stadium)?\b/,'SoFi'],[/\b(?:the )?(?:kia )?forum\b/,'the Forum'],[/\b(?:crypto(?:\.com)? arena|staples(?: center)?)\b/,'the arena'],
  [/\b(?:msg|madison square garden)\b/,'the Garden'],[/\bradio city\b/,'Radio City'],[/\bdodger stadium\b/,'Dodger Stadium'],[/\bcoachella\b/,'Coachella'],[/\b(?:the )?o2\b/,'the O2']];
const CITY_ALIAS_TEMP=[[/\b(?:nyc|manhattan)\b/,'New York'],[/\b(?:vegas|las vegas)\b/,'Vegas'],[/\bmiami\b/,'Miami'],[/\bmilan\b/,'Milan'],[/\bparis\b/,'Paris'],[/\blondon\b/,'London']];
const STOP_FIRST=new Set(['will','grace','hope','faith','rich','king','queen','prince','young','future','more','page','star','mark','love','post','lady','bad','the','english','lime','squirrel','laurel','celeste','joy','amber','griff','role','precious','wisdom','hunter','usher','iman','gracie','tyler','dove','kit','nao','flo']);
const TIME_RE=/\b(tonight|tomorrow night|tomorrow|today|this weekend|next weekend|next week|this week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/;
const MEAL_RE=/\b(breakfast|brunch|lunch|dinner|drinks|coffee)\b/;
const ACT_RE=/\b(shopping|workout|pilates|movie|party|concert|show)\b/;
function lightExtract(text,selfId){ // TEMP
  const raw=String(text||''),t=raw.toLowerCase().replace(/[’‘]/g,"'"),out={};
  for(const [re,n] of VENUES_TEMP)if(re.test(t)){out.place=n;break}
  if(!out.place){const city=G('CITY');for(const n of Object.keys(city||{}))if(n.length>3&&t.includes(n.toLowerCase())){out.place=n;break}}
  if(!out.place)for(const [re,n] of CITY_ALIAS_TEMP)if(re.test(t)){out.place=n;break}
  const list=(G('celebs')||[]).filter(a=>a&&a.name&&a.id!==selfId&&!(isKim(selfId)&&isKim(a.id)));
  for(const a of list){const full=String(a.name).toLowerCase(),first=full.split(/\s+/)[0];
    if((full.length>4&&t.includes(full))||(first.length>=4&&!STOP_FIRST.has(first)&&new RegExp('\\b'+a.name.split(/\s+/)[0].replace(/[^A-Za-zÀ-ÿ]/g,'')+'\\b').test(raw))){out.person=a.name.split(/\s+/)[0];break}}
  const tm=TIME_RE.exec(t);if(tm)out.time=tm[1];
  const ml=MEAL_RE.exec(t);if(ml)out.meal=ml[1];
  const ac=ACT_RE.exec(t);if(ac)out.activity=ac[1];
  if(/\b(?:performing|concert|show|gig|tour)\b/.test(t)&&(out.person||out.place))out.event=out.person&&out.place?`${out.person} at ${out.place}`:out.person?`${out.person}’s show`:out.place;
  return {intents:[],slots:out};
}
const MEALS=new Set(['breakfast','brunch','lunch','dinner','drinks','coffee']);
/* logic2's non-Kim intent layer (SCENE_LOGIC226.parseIntent = parseIntent226) mapped onto the SCENE_PARSE shape.
   It knows cities/activities/when but not venues, performers or events, so those gaps are filled by the TEMP extractor. */
function fromLogic226(text,selfId){
  const P=window.SCENE_LOGIC226.parseIntent(String(text||''));if(!P||typeof P!=='object')return null;
  const intents=[];const add=(c,n)=>{if(c&&!intents.includes(n))intents.push(n)};
  add(P.rude,'rude');add(P.favour,'favour_ask');add(P.stillOn||P.timeQ,'plan_followup');add(P.inviteCue||P.hang,'invite');add(P.greet,'greeting');add(P.how||P.wyd,'ask_about_them');add(P.compliment,'compliment');add(P.work,'work');
  const slots={},acts=Array.isArray(P.acts)?P.acts:[];
  if(P.place?.name)slots.place=P.place.name;if(P.when)slots.time=P.when;
  const meal=acts.find(a=>MEALS.has(a)),act=acts.find(a=>!MEALS.has(a));if(meal)slots.meal=meal;if(act)slots.activity=act;
  const tmp=lightExtract(text,selfId).slots; // TEMP gap-fill: venue, person, event, time words logic2 doesn't parse
  for(const k of ['place','person','event','time','meal','activity'])if(!slots[k]&&tmp[k])slots[k]=tmp[k];
  if(tmp.place&&/^the |^SoFi|^Radio|^Dodger|^Coachella/.test(tmp.place))slots.place=tmp.place; // a venue is more specific than its city
  return {intents,slots,source:'SCENE_LOGIC226.parseIntent'};
}
/* parser order: 1) window.SCENE_PARSE (shared, Gameplay Logic)  2) logic2 parseIntent226  3) TEMP light extraction */
/* SCENE_PARSE result -> uiux3 shape: slot values come from p.fill (ready strings, e.g. 'the Bowl'); chip-only keys
   (ask_about_them, work) are added when the parser reports one of their nearest intents (SCENE_PARSE.chipKeys) */
function fromSceneParse(p){
  const intents=Array.isArray(p.intents)?[...p.intents]:[],slots={},f=p.fill&&typeof p.fill==='object'?p.fill:null,raw=p.slots&&typeof p.slots==='object'?p.slots:{};
  for(const k of ['person','place','time','activity','meal','event','favour']){
    const v=f&&typeof f[k]==='string'?f[k].trim():'';
    if(v)slots[k]=v;else if(!f&&raw[k]!=null&&!(Array.isArray(raw[k])&&!raw[k].length))slots[k]=Array.isArray(raw[k])?raw[k].map(String):String(raw[k]);}
  const ck=window.SCENE_PARSE.chipKeys;
  if(ck&&typeof ck==='object')for(const key of Object.keys(ck)){const near=[].concat(ck[key]||[]);if(!intents.includes(key)&&near.some(x=>intents.includes(x)))intents.push(key)}
  return {intents,slots,source:'SCENE_PARSE'};
}
function parse(text,selfId){
  // selfId = the character whose DM is open, so the parser leaves them out of person/performer matches
  // (SCENE_PARSE v228 reads ctx.selfId; charId is passed too for the same id)
  if(typeof window.SCENE_PARSE==='function'){try{const p=window.SCENE_PARSE(String(text||''),{selfId,charId:selfId});if(p&&typeof p==='object')return fromSceneParse(p)}catch{}}
  if(typeof window.SCENE_LOGIC226?.parseIntent==='function'){try{const p=fromLogic226(text,selfId);if(p)return p}catch{}}
  return {...lightExtract(text,selfId),source:'uiux3-temp'};
}
const SLOTS=['person','place','time','activity','meal','event','favour'];
function plansFor(id,d){
  const out=[];
  if(isKim(id)&&Array.isArray(d?.kimThread200?.plans))for(const p of d.kimThread200.plans)if(p&&typeof p==='object')out.push({...p});
  if(!isKim(id)&&Array.isArray(d?.thread226?.plans))for(const p of d.thread226.plans)if(p&&typeof p==='object')out.push({...p}); // logic2 non-Kim plans
  // plans other layers saved to memory for this celeb (read-only)
  for(const m of (G('state')?.memory||[]).slice(0,80))if(m&&m.type==='plan_agreed'&&m.celebrityId===id&&!isKim(id))out.push({status:'agreed',what:m.what||'',where:m.where||'',place:m.place||'',when:m.when||'',activity:m.activity||'',who:m.who||[]});
  return out;
}
function tierFor(id){
  try{
    if(isKim(id)){const st=G('state'),r=st?.relations?.kim||{},f=+r.friendship||0,tr=+r.trust||0,starter=st?.firstSession148?.friendId==='kim';
      return (starter&&(+r.tension||0)<40)||(f>=51&&tr>=35)?'close':f>=25?'friendly':'stranger'}
    const t=window.SCENE_LOGIC226?.tier?.(id);
    return t==='close'||t==='friend'?'close':t==='acquaintance'?'friendly':t==='rival'?'rival':'stranger';
  }catch{return 'stranger'}
}
function buildCtx(id,d){
  const msgs=(d?.messages||[]).filter(m=>m&&m.text);
  const lastThem=[...msgs].reverse().find(m=>m.from==='them'),lastMe=[...msgs].reverse().find(m=>m.from==='me');
  const plans=plansFor(id,d),ent={};SLOTS.forEach(k=>ent[k]=[]);
  const push=(k,v)=>{v=String(v||'').trim();if(v&&!ent[k].some(x=>x.toLowerCase()===v.toLowerCase()))ent[k].push(v)};
  for(const m of msgs.slice(-30)){const p=parse(m.text,id);for(const k of SLOTS)if(p.slots[k])[].concat(p.slots[k]).forEach(v=>push(k,v))}
  const live=[...plans].reverse().find(p=>p&&['agreed','maybe'].includes(p.status));
  if(live){ // the save is the source of truth for the plan; put its facts first
    const un=(k,v)=>{v=String(v||'').trim();if(!v)return;ent[k]=ent[k].filter(x=>x.toLowerCase()!==v.toLowerCase());ent[k].unshift(v)};
    un('event',live.what);un('place',live.whereShort||live.where||live.place);un('time',live.when);
    if(MEALS.has(live.activity))un('meal',live.activity);else{un('activity',live.activity);ent.meal=[]} // show plan: don't follow up a passing 'one drink after'
    (live.who||[]).forEach(w=>un('person',String(w).split(/\s+/)[0]));
  }
  const their=parse(lastThem?.text||'',id),mine=parse(lastMe?.text||'',id);
  return {characterId:id,threadId:'dm:'+id,lastTheirText:lastThem?.text||'',lastMyText:lastMe?.text||'',tier:tierFor(id),plans,entities:ent,intents:their.intents,mySlots:mine.slots,parser:their.source,myIntents:mine.intents};
}

/* ---------- DEFAULT provider ---------- */
// lowercase voices are marked in app.js as VOICE[id].lower (top-level const, reachable by name, not on window)
const lowerVoice=id=>{try{return typeof VOICE!=='undefined'&&!!(VOICE[id]&&VOICE[id].lower)}catch{return false}};
// a line that starts with a filled slot ("{place} {time}? ...") gets a capital first letter ("The Bowl tomorrow?"),
// except for characters whose voice is deliberately lowercase
function fill(tpl,ent,lower){let ok=true;const s=tpl.replace(/\{(\w+)\}/g,(_,k)=>{const v=(ent[k]||[])[0];if(!v){ok=false;return''}return v});if(!ok)return'';const o=s.replace(/\s+([?!.,])/g,'$1').replace(/\s+/g,' ').trim();if(/\{\w+\}/.test(o))return'';return /^\s*\{\w+\}/.test(tpl)&&!lower?o.charAt(0).toUpperCase()+o.slice(1):o}
/* drop follow-ups that ask for something the save already has */
function redundant(tpl,plan){ // checks the TEMPLATE (not slot values), so "{time}" = "tomorrow night" doesn't count as a night suggestion
  if(!plan)return true; // no live plan in the save -> no plan follow-ups
  if(/night|evening|late/i.test(tpl)&&(plan.timeOfDay==='night'||/night/.test(plan.when||'')))return true;
  if(/assistant|set it up|sort it|book it|tickets|pick you up/i.test(tpl)&&plan.logistics)return true;
  if(/what time|pick you up|when works/i.test(tpl)&&plan.day)return true;
  return false;
}
function defaultProvide(ctx){
  const base=window.SCENE_DM_CHIP_TEXT||SCENE_DM_CHIP_TEXT,ent=ctx.entities||{},own=(base.byCharacter||{})[isKim(ctx.characterId)?'kim':ctx.characterId]||{};
  const T={};for(const k of Object.keys(base))if(Array.isArray(base[k]))T[k]=[...(own[k]||[]),...base[k]];
  const low=lowerVoice(ctx.characterId),avoid=new Set((ctx.avoid||[]).map(norm)),avoidTpl=new Set(ctx.avoidTpl||[]),mineN=norm(ctx.lastMyText);
  const echoes=text=>{const n=norm(text);if(avoid.has(n))return true; // shown recently / already sent
    // an invite naming the same place/meal I just proposed is just me repeating myself
    return /\b(?:go to|grab|get)\b/i.test(text)&&['place','meal','event'].some(k=>(ent[k]||[])[0]&&n.includes(norm(ent[k][0]))&&mineN.includes(norm(ent[k][0])))};
  // an invite that names a place/event/meal I just proposed myself is me repeating myself
  const reInvite=tpl=>['place','event','meal'].some(k=>tpl.includes('{'+k+'}')&&ctx.mySlots&&ctx.mySlots[k]);
  const plan=[...(ctx.plans||[])].reverse().find(p=>p&&['agreed','maybe'].includes(p.status))||null; // pending (no place yet) is not followed up
  const their=norm(ctx.lastTheirText),q=/\?/.test(ctx.lastTheirText||''),stranger=ctx.tier==='stranger'||ctx.tier==='rival';
  let order;
  if(!ctx.lastTheirText&&!ctx.lastMyText)order=['greeting','ask_about_them','compliment'];
  else if(plan&&!stranger)order=['plan_followup','plan_followup','compliment','tease','ask_about_them'];
  else if(stranger)order=['ask_about_them','compliment','work','greeting'];
  else if(ent.place?.length||ent.meal?.length)order=['invite','ask_about_them','compliment'];
  else if(q||/\b(?:what's up|whats up|you\?)\b/.test(their))order=['ask_about_them','invite','compliment','work'];
  else order=['invite','ask_about_them','compliment','tease'];
  if((ctx.intents||[]).includes('invite')&&plan&&!stranger)order.unshift('plan_followup');
  // parser-gated intents: only when the parser reports them (and, for favours, names the favour)
  const said=[...(ctx.intents||[]),...(ctx.myIntents||[])];
  if(said.includes('memory_check'))order.splice(1,0,'memory_check');
  if(said.includes('favour_ask')&&(ent.favour||[]).length&&!stranger)order.splice(1,0,'favour_ask');
  order=order.filter(k=>k!=='rude');
  const out=[],used=new Set(),cursor={};
  for(const intent of order){
    const list=T[intent]||[];let i=cursor[intent]||0;
    for(;i<list.length;i++){const text=fill(list[i],ent,low);if(!text||used.has(norm(text))||echoes(text)||avoidTpl.has(list[i]))continue;
      if(intent==='plan_followup'&&redundant(list[i],plan))continue;
      if(intent==='invite'&&reInvite(list[i]))continue;
      if(intent==='invite'&&plan)continue; // a live plan exists: follow it up instead of inviting again
      out.push({text,intent,tpl:list[i]});used.add(norm(text));i++;break}
    cursor[intent]=i;
  }
  // over-supply: the UI drops repeats, so offer extras in the same order
  for(const intent of order){const list=T[intent]||[];for(const tpl of list){const text=fill(tpl,ent,low);if(!text||used.has(norm(text))||echoes(text)||avoidTpl.has(tpl))continue;if(intent==='plan_followup'&&redundant(tpl,plan))continue;if(intent==='invite'&&(plan||reInvite(tpl)))continue;out.push({text,intent,tpl,extra:true});used.add(norm(text))}}
  return out;
}
if(!window.SCENE_DM_CHIPS||typeof window.SCENE_DM_CHIPS.provide!=='function')window.SCENE_DM_CHIPS={provide:defaultProvide};
window.SCENE_DM_CHIPS.defaultProvide=defaultProvide;window.SCENE_DM_CHIPS.buildContext=id=>buildCtx(id,thread(id));

/* ---------- no-repeat memory (in-page only, never saved) ---------- */
const shownLog=new Map(); // threadId -> last texts shown (norm), newest last
const tplLog=new Map();   // threadId -> templates behind those chips (same line with new slot values = still a repeat)
const forMsg=new Map();   // threadId -> {mid, chips}
function pick(id,d){
  const ctx=buildCtx(id,d);let raw=[];
  ctx.avoidTpl=[...(tplLog.get(ctx.threadId)||[])];
  ctx.avoid=[...(shownLog.get(ctx.threadId)||[]),...(d?.messages||[]).filter(m=>m.from==='me'&&m.text).map(m=>norm(m.text))];
  try{raw=window.SCENE_DM_CHIPS.provide(ctx)||[]}catch(e){console.warn('uiux3 provider',e);try{raw=defaultProvide(ctx)}catch{raw=[]}}
  const recent=new Set(shownLog.get(ctx.threadId)||[]);
  const mine=new Set((d?.messages||[]).filter(m=>m.from==='me'&&m.text).map(m=>norm(m.text)));
  const last=norm(ctx.lastMyText),out=[],seen=new Set();
  for(const c of raw){const text=String(c?.text||'').trim().slice(0,120),n=norm(text);if(/\{\w*\}?|\}/.test(text))continue; // never render an unfilled {slot}, whatever the provider
    if(!n||seen.has(n)||recent.has(n)||n===last||mine.has(n))continue;seen.add(n);out.push({text,intent:String(c.intent||''),tpl:c.tpl||''});if(out.length===3)break}
  if(out.length<2)return []; // 2 or 3, never a lonely chip
  const log=[...(shownLog.get(ctx.threadId)||[]),...out.map(c=>norm(c.text))].slice(-10);shownLog.set(ctx.threadId,log);
  tplLog.set(ctx.threadId,[...(tplLog.get(ctx.threadId)||[]),...out.map(c=>c.tpl||c.text)].slice(-10));
  return out;
}

/* ---------- UI ---------- */
let row=null,curId='',sendLock=0,lastSig='';
function els(){return {m:document.getElementById('modal'),wrap:$('.chatcomposerwrap'),input:$('#dmtext'),send:$('#dmsend'),form:$('#dmcomposer'),th:$('#dmthread')}}
function setPad(on){const {th}=els();if(!th)return;if(on&&row){const h=row.offsetHeight||56;th.style.paddingBottom=(28+h)+'px'}else th.style.paddingBottom=''}
function hide(){if(!row||row.dataset.state==='hidden')return;row.dataset.state='hidden';row.setAttribute('aria-hidden','true');setPad(false)}
function showChips(id,chips){
  const {wrap,th}=els();if(!wrap)return;
  if(!row||!wrap.contains(row)){row=document.createElement('div');row.className='u3chips';row.id='u3chips';row.setAttribute('role','group');row.setAttribute('aria-label','Suggested replies');row.dataset.state='hidden';wrap.insertBefore(row,wrap.firstChild);wire(row)}
  const sig=id+'|'+chips.map(c=>c.text).join('|');
  if(sig!==lastSig){row.innerHTML='';chips.forEach((c,i)=>{const g=document.createElement('div');g.className='u3chip';g.style.setProperty('--u3i',i);g.dataset.intent=c.intent;
      const b=document.createElement('button');b.type='button';b.className='u3send';b.dataset.u3text=c.text;b.textContent=c.text;
      const e=document.createElement('button');e.type='button';e.className='u3edit';e.dataset.u3text=c.text;e.setAttribute('aria-label','Edit “'+c.text+'” before sending');e.textContent='✎';
      g.append(b,e);row.appendChild(g)});lastSig=sig;row.scrollLeft=0}
  row.removeAttribute('aria-hidden');
  if(row.dataset.state!=='shown'){const near=th?th.scrollHeight-th.scrollTop-th.clientHeight<140:false;row.dataset.state='entering';void row.offsetWidth;
    requestAnimationFrame(()=>{row.dataset.state='shown';setPad(true);if(th&&near)th.scrollTop=th.scrollHeight})}
  else setPad(true);
}
function fillComposer(text,sendIt){
  const {input,send,m}=els();if(!input||!send||!m?.dataset.dm)return false;
  input.focus({preventScroll:true});
  input.value=text;input.dispatchEvent(new Event('input',{bubbles:true}));
  if(!sendIt){try{input.setSelectionRange(text.length,text.length)}catch{}hide();return true}
  hide();send.click(); // the real Send button -> the game's own submit handler -> sendDm()
  return true;
}
function wire(r){
  let timer=0,longFired=false,sx=0,sy=0;
  r.addEventListener('contextmenu',e=>e.preventDefault());
  r.addEventListener('pointerdown',e=>{const b=e.target.closest('.u3send');if(!b)return;longFired=false;sx=e.clientX;sy=e.clientY;clearTimeout(timer);
    timer=setTimeout(()=>{longFired=true;b.classList.add('u3long');fillComposer(b.dataset.u3text,false);try{navigator.vibrate?.(8)}catch{}},520)});
  r.addEventListener('pointermove',e=>{if(Math.hypot(e.clientX-sx,e.clientY-sy)>10)clearTimeout(timer)});
  ['pointerup','pointercancel','pointerleave'].forEach(t=>r.addEventListener(t,()=>clearTimeout(timer)));
  r.addEventListener('click',e=>{const b=e.target.closest('button[data-u3text]');if(!b)return;e.preventDefault();e.stopPropagation();
    if(b.classList.contains('u3edit'))return void fillComposer(b.dataset.u3text,false);
    if(longFired){longFired=false;return}
    const t=Date.now();if(t-sendLock<900)return;sendLock=t;fillComposer(b.dataset.u3text,true)});
}
/* visibility state machine: show after their reply is delivered; hide while I type or they type */
let deliveredAt=0;
function evaluate(){
  const {m,input,wrap}=els(),id=m?.dataset?.dm||'';
  if(!id||!wrap||!$('.chatpage')){curId='';return}
  if(id!==curId){curId=id;lastSig='';if(row&&!wrap.contains(row))row=null}
  if(off())return hide();
  const d=thread(id);if(!d)return hide();
  const msgs=(d.messages||[]).filter(m=>m&&(m.text||m.image)),last=msgs[msgs.length-1];
  const busy=d.typing||d.pending||(d.queue||[]).length>0;
  if(busy||(input&&input.value.trim()))return hide();
  if(last&&last.from!=='them')return hide();
  if(last&&Date.now()-deliveredAt<380)return; // let the bubble land first
  const key=id+'|'+(last?.mid||'empty');let entry=forMsg.get(id);
  if(!entry||entry.key!==key){entry={key,chips:pick(id,d)};forMsg.set(id,entry)}
  if(!entry.chips.length)return hide();
  showChips(id,entry.chips);
}
addEventListener('scene:dm-delivered',e=>{if(e.detail?.from==='them'){deliveredAt=Date.now();setTimeout(evaluate,400)}else hide()});
addEventListener('scene:dm-typing',e=>{if(e.detail?.state==='start')hide();else setTimeout(evaluate,420)});
document.addEventListener('input',e=>{if(e.target?.id==='dmtext'){if(e.target.value.trim())hide();else evaluate()}},true);
setInterval(()=>{try{evaluate()}catch(e){console.warn('uiux3',e)}},300);
window.SCENE_DM_CHIPS_DEBUG={evaluate,shown:id=>[...(shownLog.get('dm:'+id)||[])],current:()=>[...document.querySelectorAll('#u3chips .u3send')].map(b=>b.textContent)};
})();
