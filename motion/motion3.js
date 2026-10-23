/* SCENE motion layer · batch 3: phone blow-up, paparazzi, travel moment, relationship heat rings, living background.
   Depends on motion.js (sceneFX._int). Natural hooks: city change (travel), new state.memory entries, scenefx:* events. */
(()=>{
'use strict';
const q=s=>document.querySelector(s),T=()=>performance.now();
const mq=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const RM=()=>mq.matches||document.documentElement.dataset.moReduced==='1';
const E={out:'cubic-bezier(.16,.86,.24,1)',snap:'cubic-bezier(.34,1.56,.64,1)',inout:'cubic-bezier(.65,0,.35,1)'};
const anim=(el,kf,o)=>{if(!el||!el.animate||RM())return null;try{return el.animate(kf,o)}catch{return null}};
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const P=()=>S()?.player||null;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let pickIdx=null,lastPick='';const pick=a=>{if(pickIdx!==null)return a[Math.min(pickIdx,a.length-1)];const pool=a.length>1?a.filter(x=>x!==lastPick):a;const r=(pool.length?pool:a)[Math.floor(Math.random()*(pool.length||a.length))];lastPick=r;return r};
const I=()=>window.sceneFX?._int||{};
const vib=p=>{try{if(!RM())navigator.vibrate?.(p)}catch{}};
const busy=()=>q('.mo-travel')||q('.mo-rewind')||q('.mo-tierup');

/* ---------- 1. phone blowing up (REAL data only: notifications, real DMs to the player, real follower/view numbers) ---------- */
let blowAt=-1e9,blowTimer=0;
function realBlowItems(extra={}){
  const s=S()||{},items=[],since=Date.now()-15*60000;
  if(extra.followers>0)items.push({ic:'＋',k:'FOLLOWERS',t:`+${fmtNum(extra.followers)} new followers`});
  // real DMs the player actually received (their own phone, so private is fine)
  for(const d of s.dms||[]){const m=[...(d.messages||[])].reverse().find(x=>x.from==='them'&&(x.at||0)>=since&&x.text);if(!m)continue;let n='';try{n=byId(d.id)?.name}catch{}if(n)items.push({ic:'💬',k:n.toUpperCase(),t:String(m.text).slice(0,90)})}
  // real recent notifications
  for(const n of (s.notifications||[]).filter(x=>(x.at||0)>=since).slice(0,6)){let k='UPDATE';try{k=notifLabel(n)}catch{}items.push({ic:(()=>{try{return notifGlyph(n.kind)}catch{return'•'}})(),k,t:String(n.text||'').slice(0,90)})}
  // real numbers on the player's latest post
  const post=(s.posts||[]).find(x=>x.authorId==='player');if(post){let m=null;try{m=metricsFor(post)}catch{}if(m&&m.views>0)items.push({ic:'📈',k:'YOUR POST',t:`Your post hit ${fmtNum(m.views)} views · ♥ ${fmtNum(m.likes)}`})}
  const seen=new Set();return items.filter(x=>{const key=x.k+x.t;if(seen.has(key))return false;seen.add(key);return true}).slice(0,6);
}
const fmtNum=v=>{try{return fmt(v)}catch{return String(v)}};
function blowup(o={}){
  if(T()-blowAt<12000&&!o.force)return false;
  if(q('.mo-notifs')||busy()){clearTimeout(blowTimer);blowTimer=setTimeout(()=>blowup(o),900);return false}
  const items=realBlowItems(o);if(items.length<2&&!o.force)return false;if(!items.length)return false;
  blowAt=T();I().notifStack?.(items,{lock:true,max:6,gap:300,hold:5200,title:o.title||'Your phone is blowing up'});vib([25,40,25,40,25]);return true;
}
addEventListener('scenefx:viral',e=>{const d=e.detail||{};clearTimeout(blowTimer);blowAt=T()-12000+5600;blowTimer=setTimeout(()=>blowup({title:'Still blowing up…',followers:d.natural?d.delta:0}),5400);
  if(d.natural==='post'&&d.text)report({kind:'post',text:d.text,views:d.views});else if(d.natural==='followers'&&d.delta>0)report({kind:'followers',delta:d.delta})});
addEventListener('scenefx:tier-closed',e=>{const d=e.detail||{};clearTimeout(blowTimer);blowTimer=setTimeout(()=>blowup({title:'Everyone noticed'}),500);if(!d.debug&&d.name)report({kind:'tier',tier:d.name})});
addEventListener('scenefx:deltas',e=>{const d=e.detail?.deltas||{};const lastViral=I().lastViral?.()??-1e9;if(T()-lastViral<10000)return;if((d.followers||0)>=40||(d.fame||0)>=4){clearTimeout(blowTimer);blowTimer=setTimeout(()=>blowup({followers:d.followers||0}),2400)}});

/* ---------- 2. paparazzi: tabloids ONLY report real, public facts from the save, with a gossip lag ---------- */
let papAt=-1e9;
const up=s=>String(s||'').toUpperCase();
const clip=(s,n=60)=>{s=String(s||'').replace(/\s+/g,' ').trim();return s.length>n?s.slice(0,n-1).trim()+'…':s};
/* Venue/place pulled out of a quest title ("… at the Lower East Side room …" → "THE LOWER EAST SIDE ROOM").
   Headlines never quote the full title; the full title stays in the footer fact line. */
const VSTOP='asks|ask|needs|need|has|have|had|puts|wants|waves|offers|suddenly|is|are|was|were|says|tells|calls|invites|loses|runs|gets|for|with|and|to|in|on|onto|at|of|tonight|tomorrow|today|after|before|while|who|that|which|but|or|if|when|so|just|again|now|then|this|your|you|me|my';
const VRX=new RegExp(`\\bat\\s+(?:(the|a|an)\\s+)?((?:[A-Z0-9][\\w&'’.\\-]*\\s+){0,4}[A-Z][\\w&'’\\-]*(?:\\s+(?!(?:${VSTOP})\\b)[a-z][a-z\\-]*){0,2})`);
function venue(title){const m=String(title||'').match(VRX);if(!m)return'';const v=m[2].trim();if(!v||v.split(/\s+/).length>6)return'';return up((m[1]?m[1]+' ':'')+v)}
function headline(f,p){
  const N=up(p.name||'This newcomer'),H='@'+up(p.handle||'newface'),day=Number.isFinite(f.day)?f.day:null,D=day!==null?` DAY ${day+1}.`:'';
  switch(f.kind){
    case'travel':{const to=up(f.to),from=up(f.from),m=f.mode==='private'?'PRIVATE':f.mode==='business'?'BUSINESS CLASS':'';
      return pick([
        `${N} HAS LANDED IN ${to}.${D}`,
        `${N} TOUCHES DOWN IN ${to}. WHO'S PICKING UP?${D}`,
        `${N} IS IN ${to} NOW. WHAT'S THE PLAN?${D}`,
        ...(from?[`BYE ${from}, HELLO ${to}: ${N} IS ON THE MOVE.${D}`,`${N} HAS LEFT ${from}. NEXT STOP, ${to}.${D}`]:[]),
        ...(m&&from?[`${N} FLIES ${m} FROM ${from} TO ${to}. WE SEE YOU.${D}`,`${m} FROM ${from} TO ${to}? ${N} IS NOT PLAYING AROUND.${D}`]:[]),
        ...(m&&!from?[`${N} FLIES ${m} TO ${to}. WE SEE YOU.${D}`]:[])])}
    case'event':{const v=venue(f.title),c=f.city?up(f.city):'',inC=c&&!(v&&v.includes(c))?` IN ${c}`:'';
      if(v)return pick([
        `${N} SPOTTED AT ${v}${inC}.`,
        `${N} WAS AT ${v}${inC}, AND PEOPLE ARE TALKING.`,
        `FAN PHOTOS SHOW ${N} AT ${v}${inC}.`,
        `${N} PULLED UP TO ${v}${inC}.`]);
      return c?pick([
        `${N} SPOTTED OUT IN ${c}.`,
        `${N} WAS SEEN OUT LATE IN ${c}.`,
        `FAN PHOTOS SHOW ${N} ON A NIGHT OUT IN ${c}.`]):pick([
        `${N} SPOTTED ON A NIGHT OUT.`,
        `${N} WAS SEEN OUT LATE.`])}
    case'gig':{const v=venue(f.title),c=f.city?up(f.city):'',inC=c&&!(v&&v.includes(c))?` IN ${c}`:'',r=f.outcome?up(clip(f.outcome,40)):'',w=v?` AT ${v}${inC}`:inC;
      return r?pick([
        `${N} WORKED A GIG${w}. EARLY REVIEWS: ${r}.`,
        `${N}'S GIG${w}: ${r}.`]):pick([
        `${N} HAS BOOKED A GIG${w}.`,
        `${N} IS WORKING${w}. WE WANT DETAILS.`])}
    case'post':return pick([
      `${H}'S POST "${up(clip(f.text,44))}" HAS ${fmtNum(f.views)} VIEWS AND COUNTING.`,
      `${fmtNum(f.views)} PEOPLE HAVE NOW SEEN ${H}'S "${up(clip(f.text,44))}".`]);
    case'followers':return pick([
      `${N} JUST GAINED ${fmtNum(f.delta)} FOLLOWERS IN ONE GO.`,
      `+${fmtNum(f.delta)} FOLLOWERS OVERNIGHT. ${N} IS HAVING A MOMENT.`,
      `${fmtNum(f.delta)} NEW FOLLOWERS FOR ${N}. SOMEONE'S PR TEAM IS WORKING OVERTIME.`]);
    case'tier':return pick([
      `${N} IS OFFICIALLY ${up(f.tier)} NOW.`,
      `IT'S OFFICIAL: ${N} JUST HIT ${up(f.tier)}.`]);
    case'public':{const C=up(f.celebrity);return f.positive===false?pick([
      `${C} THROWS SHADE AT ${H}.${D}`,
      `${C} VS ${H}? WE NEED ANSWERS.${D}`,
      `${C} DID NOT HOLD BACK ON ${H}.${D}`]):pick([
      `${C} JUST SHOUTED OUT ${H}.${D}`,
      `${C} IS PUBLICLY RIDING FOR ${H}.${D}`,
      `${C} AND ${H}? THE INTERNET HAS QUESTIONS.${D}`])}
  }
  return '';
}
function factLine(f){switch(f.kind){case'travel':return `${f.from?'Flight '+f.from+' → '+f.to:'Flight to '+f.to}${Number.isFinite(f.day)?' · day '+(f.day+1):''}${f.mode?' · '+f.mode:''}`;case'event':return [(x=>x?x.toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase()):'')(venue(f.title)),f.city].filter(Boolean).join(' · ')||'Public sighting';case'gig':return ['Gig',(x=>x?x.toLowerCase().replace(/(^|\s)\S/g,c=>c.toUpperCase()):'')(venue(f.title)),f.city].filter(Boolean).join(' · ');case'post':return `Your post · ${fmtNum(f.views)} views`;case'followers':return `+${fmtNum(f.delta)} followers`;case'tier':return `Fame tier: ${f.tier}`;case'public':return `Public interaction: ${f.celebrity}`}return''}
function tlog(){const m=I().mstore?.();if(!m)return{queue:[],log:[]};m.tabloid=m.tabloid||{queue:[],log:[]};return m.tabloid}
function report(f){const t=tlog(),s=S()||{};f.day=Number.isFinite(f.day)?f.day:(Number(s.sceneDay)||0);f.at=Date.now();f.tab=s.tab;f.key=f.key||`${f.kind}:${f.title||f.to||f.text||f.tier||f.delta}:${f.day}`;
  if(t.log.some(x=>x.key===f.key)||t.queue.some(x=>x.key===f.key))return;t.queue.push(f);t.queue=t.queue.slice(-5);I().persist?.()}
/* gossip lag: a queued fact is "reported" on the next tab change, the next Scene day, or after 45s, never over an overlay */
function maybeReport(){
  const t=tlog(),s=S();if(!t.queue.length||!s?.player)return;if(busy()||q('.mo-pap')||q('.mo-notifs')||q('.mo-trend')||I().blocked?.())return;
  const f=t.queue[0],ready=s.tab!==f.tab||(Number(s.sceneDay)||0)>f.day||Date.now()-f.at>45000;if(!ready)return;
  t.queue.shift();t.log.unshift(f);t.log=t.log.slice(0,30);I().persist?.();showTabloid(f);
}
function showTabloid(f,o={}){
  q('.mo-pap')?.remove();papAt=T();
  const p=P()||{},debug=!!o.debug,h=debug&&!f?'DEBUG CARD · NO REAL PUBLIC EVENT IN THIS SAVE YET':headline(f,p);if(!h)return;
  const outlet=(()=>{try{return (byId('popbase')||byId('enews'))?.name||'Pop Base'}catch{return'Pop Base'}})();
  const lag=f?((Number(S()?.sceneDay)||0)>f.day?'reported a day later':'reported'):'debug';
  const root=document.createElement('div');root.className='mo-pap';const n=2+Math.floor(Math.random()*3);
  root.innerHTML=Array.from({length:n},()=>`<i class="mo-flashbulb" style="--x:${10+Math.random()*80}%;--y:${10+Math.random()*60}%"></i>`).join('')+
   `<div class="mo-tabloid${debug?' debug':''}"><div class="bar"><b>${debug?'DEBUG':'REPORTED'}</b><span>${esc(up(outlet))}</span></div><h3>${esc(h)}</h3><p>${esc(up(outlet))} · ${esc(lag)}${f&&factLine(f)?' · '+esc(factLine(f)):''}</p><div class="cam">📸</div></div>`;
  document.body.appendChild(root);vib([15,60,15]);
  const card=root.querySelector('.mo-tabloid');
  [...root.querySelectorAll('.mo-flashbulb')].forEach((fl,i)=>{const a=anim(fl,[{opacity:0},{opacity:.95,offset:.15},{opacity:0}],{duration:240,delay:i*(170+Math.random()*120),easing:'ease-out',fill:'both'});if(!a)fl.remove()});
  const inDelay=RM()?0:n*220+120;
  anim(card,[{transform:'translateX(120%) rotate(8deg)',opacity:0},{transform:'translateX(-4%) rotate(-4deg)',opacity:1,offset:.7},{transform:'translateX(0) rotate(-3deg)',opacity:1}],{duration:560,delay:inDelay,easing:E.out,fill:'backwards'});
  const close=()=>{const a=anim(card,[{transform:'translateX(0) rotate(-3deg)',opacity:1},{transform:'translateX(-120%) rotate(-10deg)',opacity:0}],{duration:420,easing:E.inout,fill:'forwards'});if(a)a.onfinish=()=>root.remove();else root.remove()};
  card.onclick=close;setTimeout(close,inDelay+4200);
  window.__moLastHeadline=h;
}
/* debug: re-report the latest real fact (or a clearly labelled DEBUG card) */
function paparazzi(){const t=tlog();const f=t.log[0]||t.queue[0]||latestFact();showTabloid(f||null,{debug:!f})}
function latestFact(){const s=S()||{};for(const m of s.memory||[]){const f=factFromMemory(m);if(f)return f}return null}
function factFromMemory(m){
  if(!m)return null;const priv=(Array.isArray(m.tags)&&m.tags.includes('private'))||m.visibility==='private';if(priv)return null;
  const day=Number.isFinite(m.sceneDay)?m.sceneDay:undefined;
  if(m.type==='travel'&&m.city)return{kind:'travel',from:m.from||'',to:m.city,mode:m.mode||'',day,key:'mem:'+m.id};
  if(m.type==='gig'&&m.title)return{kind:'gig',title:m.title,outcome:m.outcome||'',city:m.city||P()?.city||'',day,key:'mem:'+m.id};
  if((m.type==='event'||m.type==='story_choice')&&m.title)return{kind:'event',title:m.title,city:m.city||P()?.city||'',day,key:'mem:'+m.id};
  if(m.type==='verified_public'&&m.celebrity)return{kind:'public',celebrity:m.celebrity,positive:m.positive,day,key:'mem:'+m.id};
  return null;
}

/* ---------- 3. travel moment ---------- */
const CODES={'Los Angeles':'LAX','New York':'JFK','London':'LHR','Paris':'CDG','Tokyo':'HND','Cape Town':'CPT','Johannesburg':'JNB','Miami':'MIA','Nashville':'BNA','Toronto':'YYZ','Chicago':'ORD','Dubai':'DXB','Sydney':'SYD','Seoul':'ICN','Milan':'MXP','Lagos':'LOS','Mexico City':'MEX','Rio de Janeiro':'GIG','Berlin':'BER','Las Vegas':'LAS','Atlanta':'ATL','Ibiza':'IBZ'};
const code=c=>CODES[c]||String(c||'???').replace(/[^A-Za-z]/g,'').slice(0,3).toUpperCase();
let travelling=false;
function travelFx(to,from){
  if(travelling)return;const p=P()||{},s=S()||{};from=from||p.city||'Los Angeles';to=to||'Paris';travelling=true;q('.mo-travel')?.remove();
  const day=Number(s.sceneDay)||0,seat=`${2+Math.floor(Math.random()*30)}${'ABCDF'[Math.floor(Math.random()*5)]}`,flight=`SC ${100+Math.floor(Math.random()*899)}`;
  const root=document.createElement('div');root.className='mo-travel';root.setAttribute('role','dialog');root.setAttribute('aria-label',`Travelling to ${to}`);
  root.innerHTML=`<div class="mo-pass"><div class="main"><small>BOARDING PASS · ${esc(flight)}</small><div class="route"><b>${esc(code(from))}</b><span>✈</span><b>${esc(code(to))}</b></div><div class="meta"><span>PASSENGER<br><em>${esc(String(p.name||'Guest').toUpperCase())}</em></span><span>SEAT<br><em>${seat}</em></span><span>DAY<br><em>${day+1}</em></span></div></div><div class="stub"><small>GATE</small><b>${1+Math.floor(Math.random()*40)}</b><small>${esc(code(to))}</small></div></div>
  <div class="mo-map"><svg viewBox="0 0 320 170" width="320" height="170" aria-hidden="true"><defs><pattern id="mo-dots" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.2" fill="rgba(255,255,255,.18)"/></pattern></defs><rect width="320" height="170" rx="18" fill="url(#mo-dots)"/><path d="M40 130 Q160 -10 280 110" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-dasharray="5 6"/><circle cx="40" cy="130" r="6" fill="#7af0ff"/><circle cx="280" cy="110" r="6" fill="#ff7ae0"/><text x="40" y="155" fill="#fff" font-size="11" font-weight="800" text-anchor="middle">${esc(code(from))}</text><text x="280" y="135" fill="#fff" font-size="11" font-weight="800" text-anchor="middle">${esc(code(to))}</text></svg><i class="mo-plane"><svg viewBox="0 0 24 24" width="26" height="26"><path fill="#fff" d="M2 13.5 9.5 12 6 4h2.6l6 7.3 5.4-.3a1.9 1.9 0 0 1 0 3.8l-5.4-.3-6 7.3H6l3.5-8L2 14.5z"/></svg></i></div>
  <div class="mo-city"><h1>${esc(String(to).toUpperCase())}.</h1><h2>Day ${day+1}.</h2></div><button class="mo-tskip" type="button">Skip</button>`;
  document.body.appendChild(root);
  let done=false;const close=()=>{if(done)return;done=true;travelling=false;const a=anim(root,[{opacity:1},{opacity:0}],{duration:360,easing:E.out,fill:'forwards'});const f=()=>{root.remove();dispatchEvent(new CustomEvent('scenefx:travel-done',{detail:{to}}))};if(a)a.onfinish=f;else f()};
  root.querySelector('.mo-tskip').onclick=close;
  if(RM()){root.classList.add('rm');setTimeout(close,2200);return}
  const pass=root.querySelector('.mo-pass'),stub=root.querySelector('.stub'),main=root.querySelector('.main'),map=root.querySelector('.mo-map'),plane=root.querySelector('.mo-plane'),city=root.querySelector('.mo-city');
  anim(root,[{opacity:0},{opacity:1}],{duration:300,easing:E.out});
  anim(pass,[{transform:'translateY(60px) rotate(-6deg)',opacity:0},{transform:'none',opacity:1}],{duration:560,easing:E.snap,fill:'backwards'});
  anim(stub,[{transform:'none'},{transform:'translate(4px,-3px) rotate(4deg)',offset:.2},{transform:'translate(60px,240px) rotate(38deg)',opacity:0}],{duration:900,delay:900,easing:E.inout,fill:'forwards'});
  anim(main,[{transform:'none',opacity:1},{transform:'translate(-6px,-2px) rotate(-2deg)',offset:.2},{transform:'translateY(-90px) scale(.9)',opacity:0}],{duration:800,delay:1100,easing:E.inout,fill:'forwards'});
  anim(map,[{transform:'scale(.9)',opacity:0},{transform:'none',opacity:1}],{duration:500,delay:1500,easing:E.out,fill:'both'});
  anim(plane,[{offsetDistance:'0%',opacity:0},{offsetDistance:'8%',opacity:1,offset:.08},{offsetDistance:'100%',opacity:1}],{duration:1500,delay:1700,easing:E.inout,fill:'both'});
  anim(map,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-30px) scale(.94)'}],{duration:400,delay:3300,easing:E.inout,fill:'forwards'});
  anim(city.firstElementChild,[{transform:'translateY(-120px) scale(1.5)',opacity:0},{transform:'translateY(6px) scale(.98)',opacity:1,offset:.7},{transform:'none',opacity:1}],{duration:620,delay:3450,easing:E.out,fill:'both'});
  anim(city.lastElementChild,[{transform:'translateY(14px)',opacity:0},{transform:'none',opacity:1}],{duration:420,delay:3850,easing:E.out,fill:'both'});
  setTimeout(()=>vib(30),3600);setTimeout(close,5400);
}
let lastCity=null;
function watchCity(){const c=P()?.city;if(!c){lastCity=null;return}if(lastCity===null){lastCity=c;return}if(c!==lastCity){const from=lastCity;lastCity=c;travelFx(c,from)}}
/* real public memory entries (flights, gigs, events, story choices, verified public moments) → tabloid queue */
const seenMem=new Set();let primed=false;
function scanMoments(){
  const s=S();if(!s?.player)return;
  for(const m of (s.memory||[]).slice(0,10)){if(!m?.id||seenMem.has(m.id))continue;seenMem.add(m.id);if(!primed)continue;
    const f=factFromMemory(m);if(!f)continue;
    if(f.kind==='travel'){const fame=Number(s.player.fame)||0;if(!(m.witnessed||fame>=40||Math.random()<.5))continue}  /* only tabloid-worthy flights */
    report(f)}
  primed=true;maybeReport();
}

/* ---------- 4. relationship heat rings ---------- */
const nameToId=new Map();function idFor(n){if(!nameToId.size){try{for(const a of celebs)nameToId.set(a.name,a.id)}catch{}}return nameToId.get(n)}
function heatOf(id){const r=S()?.relations?.[id];if(!r)return null;const v=(+r.friendship||0)*.5+(+r.chemistry||0)*.3+(+r.trust||0)*.2-(+r.tension||0)*.3;return Math.max(0,Math.min(100,Math.round(v)))}
function heatColor(h){const lerp=(a,b,t)=>a.map((x,i)=>Math.round(x+(b[i]-x)*t)),B=[74,163,255],K=[255,111,181],R=[255,48,48];const c=h<50?lerp(B,K,h/50):lerp(K,R,(h-50)/50);return `rgb(${c.join(',')})`}
const lastHeat={};
function cracks(){const m=I().mstore?.();if(!m)return{};return m.cracks||(m.cracks={})}
function paintRings(){
  const cr=cracks();
  document.querySelectorAll('.avatar[aria-label]').forEach(a=>{
    if(a.closest('.post,.commentrow,.comment,.mo-rewind,.mo-notifs'))return;
    const id=idFor(a.getAttribute('aria-label'));if(!id)return;const h=heatOf(id);if(h===null)return;
    const col=heatColor(h),key=col+(cr[id]?'x':'');if(a.dataset.moHeat===key)return;a.dataset.moHeat=key;
    a.classList.add('mo-heat');a.style.setProperty('--mo-heat',col);a.classList.toggle('mo-crack',!!cr[id]);
  });
}
function crack(id){const cr=cracks();cr[id]=Date.now();I().persist?.();paintRings();let n='';try{n=byId(id)?.name}catch{}document.querySelectorAll('.avatar[aria-label]').forEach(a=>{if(a.getAttribute('aria-label')===n)anim(a,[{transform:'translateX(0)'},{transform:'translateX(-4px) rotate(-3deg)'},{transform:'translateX(4px) rotate(3deg)'},{transform:'translateX(-2px)'},{transform:'none'}],{duration:380,easing:'linear'})})}
function watchHeat(){const s=S();if(!s?.relations)return;const cr=cracks();for(const id of Object.keys(s.relations)){const h=heatOf(id);if(h===null)continue;const was=lastHeat[id];lastHeat[id]=h;if(was===undefined)continue;if(h<=was-5)crack(id);else if(h>was&&cr[id]){delete cr[id];I().persist?.();paintRings()}}}
function hookFollow(){const base=window.toggleFollow;if(typeof base!=='function'||base.__mo3)return;const w=function(id,...r){let before=false;try{before=isFollowing(id)}catch{}const out=base.call(this,id,...r);try{if(before&&!isFollowing(id))setTimeout(()=>crack(id),60)}catch{}return out};w.__mo3=true;window.toggleFollow=w}

/* ---------- 5. living background ---------- */
const CITY_TINT={'Los Angeles':['#ff7a59','#ff3d9a'],'New York':['#3d7bff','#9fb6ff'],'London':['#6f8bb3','#b3a6ff'],'Paris':['#ff8fc7','#ffd3a1'],'Tokyo':['#ff2fd1','#38e8ff'],'Cape Town':['#2fd1a0','#ffcf5a'],'Johannesburg':['#ffb02f','#2fd17a'],'Miami':['#ff6fb5','#2fe0d1'],'Dubai':['#ffcf5a','#ff8a3d']};
function timeTint(){const h=new Date().getHours();return h<6?['#2b2bff','#6b2bff']:h<11?['#ffb38a','#ffd98a']:h<17?['#4ab8ff','#7affd8']:h<21?['#ff6a3d','#d13dff']:['#4b2bff','#ff2b8a']}
function bg(){
  let el=document.getElementById('mo-bg');
  if(!el){el=document.createElement('div');el.id='mo-bg';el.setAttribute('aria-hidden','true');el.innerHTML='<i></i><i></i><i></i>';document.body.prepend(el)}
  const t=timeTint(),c=CITY_TINT[P()?.city]||['#7a5cff','#3dd1ff'];
  el.style.setProperty('--b1',t[0]);el.style.setProperty('--b2',c[0]);el.style.setProperty('--b3',c[1]||t[1]);
}
document.addEventListener('visibilitychange',()=>document.documentElement.classList.toggle('mo-hidden',document.hidden));

/* ---------- boot ---------- */
function boot(){
  bg();hookFollow();
  let qd=false;const schedule=()=>{if(qd)return;qd=true;requestAnimationFrame(()=>{qd=false;try{paintRings()}catch{}})};
  new MutationObserver(schedule).observe(document.getElementById('app'),{childList:true,subtree:true});
  const m=document.getElementById('modal');if(m)new MutationObserver(schedule).observe(m,{childList:true,subtree:true});
  setInterval(()=>{try{watchCity();scanMoments();watchHeat();hookFollow()}catch(e){console.warn('motion3',e)}},400);
  setInterval(()=>{if(!document.hidden)bg()},60000);
  addEventListener('scenefx:travel-done',bg);
}
(function wait(n=0){if(window.sceneFX&&window.sceneFX._int&&typeof render==='function'&&!document.querySelector('.migrationboot'))return setTimeout(boot,80);if(n<700)setTimeout(()=>wait(n+1),100)})();

Object.assign(window.sceneFX||(window.sceneFX={}),{
  paparazzi(){paparazzi();return window.__moLastHeadline||''},
  tabloids(){return JSON.parse(JSON.stringify(tlog()))},
  /* QA only: render one headline template (variant index i) for a given fact shape. Never logs or queues anything. */
  _tabloidPreview(f,i=0){pickIdx=i;try{showTabloid(Object.assign({day:Number(S()?.sceneDay)||0},f))}finally{pickIdx=null}return window.__moLastHeadline||''},
  travel(city='Paris',from){travelFx(city,from);return city},
  blowup(){return blowup({force:true})},
  crack(id='kim'){crack(id);return id},
  background(){bg();return getComputedStyle(document.getElementById('mo-bg')).getPropertyValue('--b1')}
});
})();
