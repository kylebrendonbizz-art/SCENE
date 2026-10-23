/* SCENE livingcity243 (Gameplay Logic, 2026-10-10): LA living city. Additive, offline, rules-based, no AI, no money.
   1. DISTRICTS: Hollywood / Beverly Hills / Santa Monica (v224/livingcity-data-v243.json) while player.city (or homeCity when
      player.city is unset) is Los Angeles. 3-button district switch injected at the top of the Career tab (state.tab 'world', first child of the main that holds .career48);
      it only redraws its own block (never calls render()). Current spot: state.livingcity243.spot.
   2. IN-CITY (refreshed once per game day = state.sceneDay, and on first LA tick): for kim/britney/kylie, only if UNLOCKED
      (app canAccess) and player in LA: roll r = hash(seed|day|id)/2^32; in city if r < base + min(fameMax, fame*famePer)
      (0.35 + up to 0.25). If more than max (2) pass, keep the lowest r. Each in-city celeb gets one spot for the day (hash).
      state.livingcity243.inCity[id] / .where[id].
   3. BUMP-INTO: entering a spot (or a new game day while staying) starts a visit. If an in-city + unlocked celeb is at that spot,
      the visit has no run-in yet, and that celeb+spot was not met today: Writer approach.dm -> DM thread (1 bell row via addNotif),
      approach.chip + spot label -> encounter card on Career with player chips. Max 1 run-in per visit; same celeb+spot max 1 per day.
   4. PAPARAZZI: on bump (chance +bumpBonus) or LA spot change: chance base + min(fameMax, fame*famePer); 1 feed post per game day
      (outlet post, no toast). Writer key city.la.paparazzi[.<spot>[.<celeb>]] if present, else neutral fallback.
   5. ENGAGE / LEAVE: 'Say hi' -> 0-2 talk.dm by closeness (friendship <10: 0, <35: 1, else 2) then leave.dm; 'Keep walking' or
      leaving the spot -> leave.dm (walk) / silent (spot change). The encounter always ends; approach state cleared.
   DM guard: never render() while #modal.dataset.dm; feed refresh via SCENE_DMGUARD.renderSafe when present.
   Copy: window.SCENE_LIVINGCITY_LINES (v224/livingcity-lines-v243.js, dev/sync-livingcity-lines.mjs). No player reply branching.
   Save: ONE new key state.livingcity243 (lazy). Kill switch window.SCENE_LIVINGCITY_OFF=true (checked on every hook). */
(()=>{
'use strict';
if(window.SCENE_LIVINGCITY)return;
const V=243,K='livingcity243',OFF=()=>window.SCENE_LIVINGCITY_OFF===true,T=()=>Date.now();
let D={city:'Los Angeles',spots:[{id:'hollywood',label:'Hollywood'},{id:'beverlyHills',label:'Beverly Hills'},{id:'santaMonica',label:'Santa Monica'}],
  celebs:['kim','britney','kylie'],inCity:{base:.35,famePer:.0025,fameMax:.25,max:2},pap:{base:.2,famePer:.00333,fameMax:.35,bumpBonus:.25,perDay:1,outlets:['popbase','tmz','enews']},talk:{one:10,two:35},beatMs:2200};
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const S0=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const G=n=>{try{return globalThis[n]}catch{return undefined}};
const who=id=>{try{return byId(id)}catch{return null}};
const day=()=>Number(S0()?.sceneDay)||0;
const save0=()=>{try{save()}catch{}};
const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dmOpen=()=>{try{return G('SCENE_DMGUARD')?.dmThreadOpen?.()??!!document.getElementById('modal')?.dataset?.dm}catch{return false}};
const spotLabel=id=>D.spots.find(s=>s.id===id)?.label||'';
const NEUTRAL={pap:['{player} spotted around {spot}, LA. A photographer followed for a block.','Cameras caught {player} in {spot} today. No comment yet.'],
  papCeleb:['{player} and {celeb} spotted in {spot} today. Nobody stopped for photos.','{celeb} and {player}, same {spot} sidewalk. Photographers noticed.'],
  hi:['Say hi'],walk:['Keep walking']};

/* ---------- state ---------- */
function lc(){const s=S0();if(!s)return null;let m=s[K];if(!m||typeof m!=='object')m=s[K]={v:V};
  for(const k of['inCity','where'])if(!m[k]||typeof m[k]!=='object'||Array.isArray(m[k]))m[k]={};
  for(const k of['met','log'])if(!Array.isArray(m[k]))m[k]=[];
  for(const k of['papDay','inCityDay','lastDay'])if(!Number.isFinite(m[k]))m[k]=-1;
  if(m.spot&&!spotLabel(m.spot))m.spot=null;return m}
function inLA(){const s=S0(),p=s?.player;if(!p)return false;return (p.city||s.homeCity||'')===D.city}
function unlocked(id){const a=who(id);if(!a)return false;try{return !!canAccess(a)}catch{return false}}
const fame=()=>Math.max(0,Number(S0()?.player?.fame)||0);
const fr=id=>Number(S0()?.relations?.[id]?.friendship)||0;
function log(x){const m=lc();m.log.unshift({day:day(),at:T(),...x});m.log=m.log.slice(0,30)}

/* ---------- copy ---------- */
function vals(k){const W=G('SCENE_LIVINGCITY_LINES')||{},v=W[k];return(Array.isArray(v)?v:typeof v==='string'?[v]:[]).map(String).filter(x=>x.trim()&&!/\[PLACEHOLDER/.test(x))}
function fill(t,sl){let miss=false;const o=String(t).replace(/\{(player|celeb|spot)\}/g,(_,k)=>{const v=sl[k];if(!v){miss=true;return''}return v});return miss?null:o}
function pick(arr,seed,sl={}){const n=arr.length;if(!n)return'';const st=H(seed)%n;for(let i=0;i<n;i++){const t=fill(arr[(st+i)%n],sl);if(t)return t}return''}
function slots(id,spot){const p=S0()?.player||{};return{player:String(p.name||'').split(/\s+/)[0]||'',celeb:id?(who(id)?.name||''):'',spot:spotLabel(spot)}}
const keyOf=(spot,id,part)=>`city.la.${spot}.${id}.${part}`;
const line=(spot,id,part,seed)=>pick(vals(keyOf(spot,id,part)),seed+part,slots(id,spot));
const chipText=(k,n)=>pick(vals(`city.la.player.${k}.chip`),'c'+k)||NEUTRAL[n][0];

/* ---------- 2. in-city ---------- */
function seed(){const s=S0();return String(s?.player?.name||'')+'|'+String(s?.player?.handle||'')}
function refreshInCity(force){const m=lc(),d=day();if(!force&&m.inCityDay===d)return m.inCity;m.inCityDay=d;
  const c=D.inCity,p=c.base+Math.min(c.fameMax,fame()*c.famePer),la=inLA(),rolled=[];
  for(const id of D.celebs){m.inCity[id]=false;delete m.where[id];if(!la||!unlocked(id))continue;const r=H(seed()+'|'+d+'|'+id)/4294967296;if(r<p)rolled.push([r,id])}
  rolled.sort((a,b)=>a[0]-b[0]).slice(0,c.max).forEach(([,id])=>{m.inCity[id]=true;m.where[id]=D.spots[H(seed()+'|w|'+d+'|'+id)%D.spots.length].id});
  m.inCityP=+p.toFixed(3);save0();return m.inCity}

/* ---------- DM / feed ---------- */
function pushDm(id,text,stage,notify){const a=who(id);if(!a||!text||typeof dmState!=='function')return false;const d=dmState(id),at=T();
  d.messages.push({mid:'m'+at+Math.random(),from:'them',text,at,kind:K,rendererSource:K,livingcity243:stage,replyTo:''});
  d.unread=document.getElementById('modal')?.dataset?.dm!==id;d.lastInboundAt=at;try{dmUpdateConversation180(a,d,text,'them')}catch{}
  if(notify){try{addNotif(`${a.name} ran into you in ${spotLabel(lc().spot)}.`,'dm',{celebrityId:id,livingcity243:stage})}catch{}}return true}
function refreshFeed(){try{if(S0()?.tab!=='feed')return;const g=G('SCENE_DMGUARD');if(g?.renderSafe)g.renderSafe();else if(!dmOpen())render()}catch{}}

/* ---------- 4. paparazzi ---------- */
function paparazzi(o={}){if(OFF()||!inLA())return null;const m=lc(),d=day(),spot=o.spot||m.spot;if(!spot||m.papDay===d)return null;
  const c=D.pap,p=c.base+Math.min(c.fameMax,fame()*c.famePer)+(o.celeb?c.bumpBonus:0);if(!o.force&&Math.random()>=p)return null;
  if(typeof mkPost!=='function')return null;const outs=c.outlets.map(who).filter(Boolean);if(!outs.length)return null;const a=outs[H(d+spot)%outs.length],sd=d+'|'+spot+'|'+(o.celeb||'');
  const sl=slots(o.celeb,spot),text=(o.celeb&&pick(vals(`city.la.paparazzi.${spot}.${o.celeb}`),sd,sl))||pick(vals(`city.la.paparazzi.${spot}`),sd,sl)||pick(vals('city.la.paparazzi'),sd,sl)||pick(o.celeb?NEUTRAL.papCeleb:NEUTRAL.pap,sd,sl);
  if(!text)return null;let post;try{post=mkPost(a,0,text,{media:false,kind:K});post.comments=[];post.livingcity243={spot,celeb:o.celeb||''};if(!state.posts.includes(post))state.posts.unshift(post)}catch(e){console.warn('lc243 pap',e);return null}
  m.papDay=d;log({ev:'pap',spot,celeb:o.celeb||'',post:post.id});save0();refreshFeed();return post}

/* ---------- 3. visit + bump ---------- */
function bump(){if(OFF()||!inLA())return null;const m=lc(),v=m.visit,d=day();if(!v||v.runIn||m.approach)return null;refreshInCity(false);
  const id=D.celebs.find(id=>m.inCity[id]&&m.where[id]===v.spot&&unlocked(id)&&!m.met.includes(d+':'+v.spot+':'+id)&&vals(keyOf(v.spot,id,'approach.dm')).length);
  if(!id)return null;const sd=seed()+d+v.n,dm=line(v.spot,id,'approach.dm',sd);if(!dm)return null;
  v.runIn=id;m.met.unshift(d+':'+v.spot+':'+id);m.met=m.met.slice(0,60);
  m.approach={id,spot:v.spot,day:d,at:T(),stage:'approach',label:line(v.spot,id,'spot',sd),chip:line(v.spot,id,'approach.chip',sd),q:[],nextAt:0};
  pushDm(id,dm,'approach',true);log({ev:'bump',spot:v.spot,celeb:id});save0();paparazzi({celeb:id,spot:v.spot});draw();return m.approach}
function enterSpot(spot,why){if(OFF()||!inLA()||!spotLabel(spot))return false;const m=lc(),d=day();
  if(m.visit&&m.visit.spot===spot&&m.visit.day===d&&m.spot===spot)return false;
  const changed=m.spot!==spot;if(m.approach&&m.approach.stage==='approach'&&changed)m.approach=null; /* walked off mid-approach: silent */
  m.spot=spot;m.visitN=(Number(m.visitN)||0)+1;m.visit={spot,day:d,n:m.visitN,runIn:null,at:T(),why:why||'pick'};log({ev:'visit',spot,why:why||'pick'});save0();
  const b=bump();if(!b&&changed&&why==='pick')paparazzi({spot});draw();return true}

/* ---------- 5. engage / leave ---------- */
function act(kind){if(OFF())return false;const m=lc(),a=m.approach;if(!a||a.stage!=='approach')return false;const sd=seed()+a.day+a.at;
  const talk=vals(keyOf(a.spot,a.id,'talk.dm')),f=fr(a.id),n=kind==='hi'?(f<D.talk.one?0:f<D.talk.two?1:2):0,q=[];
  for(let i=0;i<n&&i<talk.length;i++)q.push(['talk',talk[(H(sd+'t')+i)%talk.length]]);
  const lv=line(a.spot,a.id,'leave.dm',sd);if(lv)q.push(['leave',lv]);
  a.stage=kind==='hi'?'talk':'leave';a.q=q;a.nextAt=0;log({ev:kind,celeb:a.id,spot:a.spot,lines:q.length});drain();draw();return true}
function drain(){const m=lc(),a=m?.approach;if(!a||a.stage==='approach')return;if(T()<a.nextAt)return;const x=a.q.shift();
  if(x)pushDm(a.id,x[1],x[0],false);if(!a.q.length){m.approach=null;m.lastRunIn={id:a.id,spot:a.spot,day:a.day}}else a.nextAt=T()+D.beatMs;save0();draw()}

/* ---------- 1. Career district switch (own block only; never render()) ---------- */
function css(){if(document.getElementById('lc243css'))return;const st=document.createElement('style');st.id='lc243css';
  st.textContent='.lc243{margin:8px 12px 10px;padding:10px 12px;border-radius:16px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12)}.lc243 .lc243h{display:flex;justify-content:space-between;align-items:baseline;font-size:12px;opacity:.8;margin-bottom:8px}.lc243 .lc243h b{font-size:13px;opacity:1}.lc243 .lc243row{display:flex;gap:6px}.lc243 .lc243row button{flex:1;padding:8px 4px;border-radius:12px;border:1px solid rgba(255,255,255,.18);background:transparent;color:inherit;font-size:12px}.lc243 .lc243row button.on{background:rgba(255,255,255,.18);font-weight:700}.lc243 .lc243card{margin-top:10px;padding:10px;border-radius:12px;background:rgba(0,0,0,.25)}.lc243 .lc243card small{display:block;opacity:.75;font-size:11px}.lc243 .lc243chip{display:inline-block;margin:6px 0 8px;padding:6px 10px;border-radius:14px;background:rgba(255,255,255,.14);font-size:13px}.lc243 .lc243acts{display:flex;gap:6px}.lc243 .lc243acts button{flex:1;padding:8px;border-radius:12px;border:0;font-size:12px;font-weight:600}.lc243 .lc243note{margin-top:8px;font-size:11px;opacity:.7}';
  document.head.appendChild(st)}
function html(){const m=lc(),a=m.approach,v=m.visit;let x=`<div class="lc243h"><b>Los Angeles</b><span>${m.spot?'You are in '+E(spotLabel(m.spot)):'Pick a district'}</span></div><div class="lc243row">${D.spots.map(s=>`<button type="button" data-lc243-spot="${E(s.id)}" class="${m.spot===s.id?'on':''}">${E(s.label)}</button>`).join('')}</div>`;
  if(a&&a.stage==='approach')x+=`<div class="lc243card" data-lc243-approach="${E(a.id)}"><small>${E(a.label||who(a.id)?.name||'')}</small><div class="lc243chip">${E(a.chip||'')}</div><div class="lc243acts"><button type="button" data-lc243-act="hi">${E(chipText('sayHi','hi'))}</button><button type="button" data-lc243-act="walk">${E(chipText('keepWalking','walk'))}</button></div></div>`;
  else if(a)x+=`<div class="lc243note">${E(who(a.id)?.name||'')} is in your DMs.</div>`;
  else if(v&&v.runIn)x+=`<div class="lc243note">You ran into ${E(who(v.runIn)?.name||'')} here.</div>`;return x}
function draw(){try{const old=document.querySelector('.lc243');const s=S0();
  if(OFF()||!s?.player||s.tab!=='world'||!inLA()){old?.remove();return}
  const host=document.querySelector('.career48')?.parentElement; /* Career main (uiux10 hides .career48 and renders a sibling) */if(!host){old?.remove();return}
  css();const h=html();let el=old;if(!el||el.parentNode!==host){old?.remove();el=document.createElement('div');el.className='lc243';host.prepend(el);el.dataset.sig=''}
  if(el.dataset.sig!==h){el.innerHTML=h;el.dataset.sig=h}
  if(!el.__lc){el.__lc=1;el.addEventListener('click',e=>{const b=e.target.closest('[data-lc243-spot],[data-lc243-act]');if(!b)return;e.stopPropagation();
    if(b.dataset.lc243Spot)enterSpot(b.dataset.lc243Spot,'pick');else act(b.dataset.lc243Act)})}}catch(e){console.warn('lc243 draw',e)}}

/* ---------- tick ---------- */
function tick(){if(OFF()||window.SCENE_CITYMAPS?.owns?.()){document.querySelector('.lc243')?.remove();return} /* citymaps247 owns LA while on (SCENE_CITYMAPS_OFF=true restores this module) */const s=S0();if(!s?.player)return;
  if(!inLA()){const m=s[K];if(m&&(m.visit||m.approach)){m.visit=null;m.approach=null;save0()}draw();return}
  const m=lc(),d=day();if(m.lastDay!==d){m.lastDay=d;refreshInCity(false);if(m.spot)enterSpot(m.spot,'day')}
  else if(m.spot&&!m.visit)enterSpot(m.spot,'return');
  if(m.visit&&!m.visit.runIn&&!m.approach)bump();drain();draw()}
let INSTALLED=false;
function install(){INSTALLED=true;setInterval(()=>{try{tick()}catch(e){console.warn('lc243 tick',e)}},700);try{tick()}catch{}}
fetch('./v224/livingcity-data-v243.json?v=lc243-1',{cache:'no-cache'}).then(r=>r.ok?r.json():null).then(j=>{if(j&&Array.isArray(j.spots)&&j.spots.length)D={...D,...j}}).catch(()=>{});
globalThis.SCENE_LIVINGCITY={version:V,key:K,installed:()=>INSTALLED,state:()=>S0()?lc():null,config:()=>D,inLA,setSpot:id=>enterSpot(id,'pick'),
  refresh:()=>refreshInCity(true),bump,paparazzi,act,tick:()=>tick(),
  force(id,o={}){const m=lc();if(!m)return null;if('inCity'in o)m.inCity[id]=!!o.inCity;if(o.spot)m.where[id]=o.spot;m.inCityDay=day();save0();return{inCity:m.inCity[id],where:m.where[id]}}};
const wait=setInterval(()=>{try{if(typeof state!=='undefined'&&state.player&&typeof byId==='function'&&typeof canAccess==='function'&&typeof dmState==='function'&&typeof mkPost==='function'&&typeof render==='function'){clearInterval(wait);install()}}catch{}},300);
})();
