/* SCENE uiux10: Career page redesign (presentation only). Kill switch: window.SCENE_UIUX10_OFF=true
   Overview order: 1 Next up · 2 Bookings · 3 Your story so far · then a collapsible "Skills & level" row and Travel/Resources rows.
   A segmented control (Career / Travel / Resources / Skills) keeps every original sub-view reachable; Skills is last.
   - NEVER pays or grants anything. Every tap goes through the game's own entry points:
       bookings  -> window.SCENE_CAREER.act(action) when flow2 exists, else the game's startGig(id) (what bind() calls for .jobcard)
                    or the original [data-story-op] button (bound to openStory48 by living-world-v48 bind)
       next beat -> SCENE_CAREER.act / SCENE_STORY169.act / openDm / openCompose / openEvent / the original v148 next-move button
       Travel / Resources / Skills -> the game's own live, already-bound nodes are MOVED into the new layout (handlers untouched)
   - Data: window.SCENE_CAREER.getState() -> {next:{beat,sideItems,queued,source}, bookings[], story[]} (Gameplay Logic flow2, not merged
     yet) + 'scene:career-changed'. Until it exists, the TEMP adapter below builds the same shape from the existing game state.
   - Copy: window.SCENE_CAREER_COPY (SCENE Writer, public/motion/career-copy.js, loaded by this file); UI_COPY is only the fallback.
   - Writes nothing to storage. The save key is never touched by this file. Days are shown as sceneDay+1. */
(function(){'use strict';
if(window.sceneUiux10)return;
const V='uiux10-2';
const OFF=()=>window.SCENE_UIUX10_OFF===true;
const BASE=(()=>{try{return new URL('.',document.currentScript.src).href}catch{return './motion/'}})();
function loadAssets(){if(document.getElementById('uiux10-css'))return;
 const l=document.createElement('link');l.rel='stylesheet';l.id='uiux10-css';l.href=BASE+'uiux10.css?v='+V;document.head.appendChild(l);
 if(!document.getElementById('uiux10-copy')){const s=document.createElement('script');s.id='uiux10-copy';s.src=BASE+'career-copy.js?v='+V;s.onload=()=>schedule();document.head.appendChild(s)}}
const RM=()=>{try{return matchMedia('(prefers-reduced-motion: reduce)').matches}catch{return false}};
const S=()=>{try{return typeof state!=='undefined'?state:window.state}catch{return window.state}};
const q=(s,r=document)=>{try{return r.querySelector(s)}catch{return null}};
const qa=(s,r=document)=>{try{return [...r.querySelectorAll(s)]}catch{return[]}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const txt=e=>(e?.textContent||'').replace(/\s+/g,' ').trim();
const fill=(t,o={})=>String(t).replace(/\{(\w+)\}/g,(_,k)=>o[k]??'');
const clip=(t,n=90)=>{t=String(t||'').replace(/\s+/g,' ').trim();return t.length>n?t.slice(0,n-1).trim()+'…':t};

/* ---------- copy: fallback only; SCENE Writer's window.SCENE_CAREER_COPY wins key by key ---------- */
const UI_COPY={
 'header.level':'Level {level}','header.rank':'{rank}',
 'seg.overview':'Career','seg.travel':'Travel','seg.resources':'Resources','seg.skills':'Skills',
 'next.title':'Next up','next.kicker':'YOUR MOVE','next.button':'Let’s go','next.side':'Also on your plate','next.empty':'All quiet for now. Post something or grab a booking.',
 'book.title':'Bookings','book.sub':'Paid work in {city}','book.payLabel':'Pay','book.pay':'{pay}','book.when':'Right now','book.energy':'{energy} energy','book.energyBeta':'Zero energy','book.button':'Book it','book.empty':'Nothing on the table yet. Get your name out there.','book.locked':'Not yet',
 'story.title':'Your story so far','story.chapter':'Chapter {n} · {rank}','story.next':'Next rung: {rank}','story.empty':'Nothing here yet. Your first move starts it.','story.more':'See it all','story.less':'Show less',
 'story.kind.story':'Story','story.kind.job':'Booking','story.kind.travel':'Trip','story.kind.level':'Level up','story.kind.friend':'New friend','story.day':'Day {day}',
 'more.title':'More','more.skills':'Skills & level','more.skillsSub':'Skill points ready: {n}','more.travel':'Travel','more.travelSub':'You’re in {city}','more.resources':'Resources','more.resourcesSub':'Energy, boosts & gifts',
 'back':'Back to Career'
};
const C=(k,o)=>{const w=window.SCENE_CAREER_COPY;const t=(w&&typeof w==='object'&&typeof w[k]==='string'&&w[k])||UI_COPY[k]||'';return o?fill(t,o):t};

/* ---------- page memory (in-memory only, never saved) ---------- */
let seg='overview',lastView=null,storyOpen=false,skillsOpen=false,bookScroll=0,lastSeg=null,raf=0,building=false,entered=false;
const SEGS=['overview','travel','resources','skills']; // Kyle: My story + Opportunities come before Skills
const origSection=()=>q('.main > .section.career48');
const clickOrig=sel=>{const b=q(sel);if(b){b.click();return true}return false};
// switch the game's own Career sub-view by clicking its (hidden) sub-tab: same careerView write + save + render as the old page
function ensureView(v){const s=S();if((s?.careerView||'story')===v)return;clickOrig(`.main > .section.career48 [data-career-view="${v}"]`)}

/* ================= TEMP ADAPTER (remove when Gameplay Logic flow2 / window.SCENE_CAREER is merged) =================
   Builds the flow2 SCENE_CAREER shape from what the game already renders and saves. Read-only: it renders the
   Career sub-views to a string with the game's own renderWorld() (careerView restored in finally{}, no save, no render). */
const TEMP=(()=>{
 function viewDoc(v){const s=S();if((s?.careerView||'story')===v)return origSection();
  if(typeof window.renderWorld!=='function'||!s)return null;const prev=s.careerView;let html='';
  try{s.careerView=v;html=window.renderWorld()}catch{html=''}finally{s.careerView=prev}
  const t=document.createElement('template');t.innerHTML=html;return t.content}
 const venueOf=t=>{t=String(t||'');const m=t.match(/\bat (?:the )?([^.!?,]+)$/i)||t.match(/^(?:the )?(.+?) (?:asks|needs|wants|offers|invites|is looking)\b/i);return m?m[1].trim():''};
 function bookings(){const s=S()||{},p=s.player||{},out=[];
  const w=viewDoc('work');
  for(const b of qa('.jobcard[data-gig]',w)){const meta=qa('.jobmeta span,.jobmeta b',b).map(txt),rw=qa('.jobreward span',b).map(txt);const en=/(\d+)\s*⚡/.exec(meta[1]||'');const energy=s.betaMode?0:(en?+en[1]:0);
   out.push({id:'gig:'+b.dataset.gig,kind:'job',title:clip(txt(q('h3',b)),60),venue:meta[0]||'',pay:rw[0]?{min:null,max:null,label:rw[0],currency:(/^([A-Z]{3})/.exec(rw[1]||'')||[])[1]||''}:null,when:'now',requirements:{energy,energyOk:(+p.energy||0)>=energy},action:'gig:'+b.dataset.gig})}
  const st=viewDoc('story');
  for(const b of qa('[data-story-op]',st)){const t=txt(q('strong',b));out.push({id:'story:'+b.dataset.storyOp,kind:'story',title:clip(venueOf(t)||t,60),venue:venueOf(t),label:txt(q('small',b)),pay:null,when:'now',requirements:{energy:0,energyOk:true},action:'story:'+b.dataset.storyOp})}
  return out}
 function next(){const N=window.SCENE_NEXT;if(N&&typeof N.getState==='function'){try{const x=N.getState()||{};return{beat:x.beat||null,sideItems:(x.sideItems||[]).slice(0,2),queued:+x.queued||0,source:'SCENE_NEXT'}}catch{}}
  // day-one Today card (uiux2, when stacked) is the current goal
  try{const u=window.sceneUiux2?.status?.();const go=q('#uiux2-today [data-uiux2-go]');if(u&&u.active&&u.goal&&go)return{beat:{id:'day1:'+u.goal.id,title:u.goal.title||'',hook:u.goal.detail||'',tab:'',action:'uiux2:go'},sideItems:[],queued:0,source:'TEMP:uiux2'}}catch{}
  let o=null;try{o=window.SCENE_STORY169?.objective?.()||null}catch{}
  if(o)return{beat:{id:String(o.action||''),title:o.title,hook:o.sub||'',tab:'career',action:o.action},sideItems:[],queued:0,source:'SCENE_STORY169'};
  // the game's own v148 next-move card (data-sig = kicker|title|hook|action|button)
  const nm=q('.main > .scene-nextmove148');if(nm){const g=String(nm.dataset.sig||'').split('|');return{beat:{id:'v148:'+(g[3]||g[1]||''),title:txt(q('.scene-movecopy148 strong',nm))||g[1]||'',hook:txt(q('.scene-movecopy148 span',nm))||g[2]||'',tab:'',action:'v148:go',button:txt(q('button',nm))||g[4]||''},sideItems:[],queued:0,source:'TEMP:v148'}}
  return{beat:null,sideItems:[],queued:0,source:'TEMP'}}
 function story(){let h=[];try{h=window.SCENE_STORY169?.inspect?.().history||[]}catch{}const mem=S()?.memory||[];
  return h.filter(b=>b&&(/^memory:/.test(b.completedReason||'')||b.completedReason==='viewed-fallout')).map(b=>{let outcome='';
   if(b.type==='event'&&b.event?.title){const m=mem.find(x=>x&&x.type==='event'&&x.title===b.event.title&&(+x.at||0)>=(+b.createdAt||0));outcome=clip(m?.outcome||m?.choice||'',160)}else outcome=clip(b.sub||'',160);
   const d=Number.isFinite(Number(b.day))&&b.day!==null?Number(b.day):null;return{id:b.id,kind:'story',day:d,dayLabel:d===null?null:d+1,title:clip(b.title||b.event?.title||'',90),outcome,type:b.type,at:b.completedAt||0}}).sort((a,b)=>b.at-a.at).slice(0,20)}
 return{getState:()=>({next:next(),bookings:bookings(),story:story()}),viewDoc,temp:true}})();
/* ================= /TEMP ADAPTER ================= */

/* milestones the save already records (display only; not part of the flow2 shape): trips, bookings played, level-ups, starter friend, v48 story ops */
function milestones(){const s=S()||{},out=[];
 for(const h of (s.storyHistory||[]))if(h&&h.title)out.push({id:'sh:'+(h.id||h.at),kind:'story',title:clip(h.title,90),outcome:clip([h.choice,h.outcome].filter(Boolean).join(' · '),160),at:+h.at||0,day:null});
 for(const m of (s.memory||[])){if(!m||typeof m!=='object')continue;const at=+m.at||0;
  if(m.type==='travel'&&m.city)out.push({id:m.id,kind:'travel',title:m.city,outcome:m.from?`${m.from} → ${m.city}`:'',at});
  else if(m.type==='gig'&&m.title)out.push({id:m.id,kind:'job',title:clip(m.title,90),outcome:m.outcome?String(m.outcome).replace(/^\w/,c=>c.toUpperCase()):'',at});
  else if(m.type==='scene_level_up'&&m.level)out.push({id:m.id,kind:'level',title:C('header.level',{level:m.level}),outcome:'',at});
  else if((m.type==='starter_friend'||m.type==='starter_choice')&&(m.celebrity||m.name)&&!out.some(x=>x.kind==='friend'&&x.title===(m.celebrity||m.name)))out.push({id:m.id,kind:'friend',title:m.celebrity||m.name,outcome:'',at});}
 return out}

let lastData={next:{beat:null,sideItems:[]},bookings:[],story:[]},usingReal=false;
function getData(){const real=window.SCENE_CAREER;let d=null;usingReal=false;
 if(real&&typeof real.getState==='function'){try{d=real.getState();usingReal=true}catch(e){console.warn('uiux10 SCENE_CAREER',e);d=null}}
 if(!d)d=TEMP.getState();
 const next=d.next&&typeof d.next==='object'?d.next:{beat:null,sideItems:[]};
 const bookings=Array.isArray(d.bookings)?d.bookings:[];
 const seen=new Set(),story=[...(Array.isArray(d.story)?d.story:[]),...milestones()].filter(x=>x&&x.title&&!seen.has(x.kind+'|'+x.title+'|'+x.at)&&seen.add(x.kind+'|'+x.title+'|'+x.at)).sort((a,b)=>(+b.at||0)-(+a.at||0));
 lastData={next,bookings,story,real:usingReal};return lastData}

/* ---------- actions: all through the game's own functions ---------- */
function act(action){const a=String(action||'');if(!a)return false;
 const real=window.SCENE_CAREER;if(real&&typeof real.act==='function'){try{if(real.act(a))return true}catch(e){console.warn('uiux10 act',e)}}
 if(a==='uiux2:go')return clickOrig('#uiux2-today [data-uiux2-go]');
 if(a==='v148:go')return clickOrig('.main > .scene-nextmove148 button');
 if(a.startsWith('gig:')){const id=a.slice(4);const b=qa('.main > .section.career48 .jobcard[data-gig]').find(x=>x.dataset.gig===id);if(b){b.click();return true}if(typeof window.startGig==='function'){window.startGig(id);return true}return false}
 if(a.startsWith('story:')){const id=a.slice(6);ensureView('story');const b=qa('.main > .section.career48 [data-story-op]').find(x=>x.dataset.storyOp===id);if(b){b.click();return true}return false}
 if(a.startsWith('story169:')){try{return !!window.SCENE_STORY169?.act?.(a.slice(9))}catch{return false}}
 if(a.startsWith('dm:')&&typeof window.openDm==='function'){window.openDm(a.slice(3));return true}
 if(a==='compose'&&typeof window.openCompose==='function'){window.openCompose();return true}
 if(a==='event'&&typeof window.openEvent==='function'&&S()?.pendingEvent){window.openEvent(S().pendingEvent);return true}
 if(a==='career:work'){q('#uiux10 [data-sec="bookings"]')?.scrollIntoView({behavior:RM()?'auto':'smooth',block:'start'});return true}
 return clickOrig('.main > .scene-nextmove148 button')}

/* ---------- view ---------- */
function meta(){const s=S()||{},p=s.player||{};const sec=origSection();
 const lvTxt=txt(q('.scene-levelcard157 .scene-leveltop157 span',sec||document));let level=(/(\d+)/.exec(lvTxt)||[])[1];if(!level){try{level=String(lvl())}catch{level='1'}}
 const rank=txt(q('.sectiontop .skillchip',sec||document));let money='';try{money=typeof moneyDisplay==='function'?moneyDisplay(p.money,p.city):'$'+p.money}catch{money=''}
 const xpPct=parseFloat(q('.scene-levelcard157 .scene-leveltrack157 i',sec||document)?.style.width||'0')||0;
 return {level,rank,money,xpPct,city:p.city||'',sp:Math.max(0,Number(p.skillPoints)||0),beta:!!s.betaMode}}
function chapter(){const d=TEMP.viewDoc('story');if(!d)return null;const ch=q('.careerchapter',d),pr=q('.chapterprogress',d);if(!ch)return null;
 const em=/CHAPTER\s+(\d+)\s*·\s*(.+)/i.exec(txt(q('.chaptereyebrow',ch))),nr=/·\s*(.+)$/.exec(txt(q('span',pr)));const cap=x=>String(x||'').toLowerCase().replace(/\b\w/g,c=>c.toUpperCase());
 return {n:em?em[1]:'',rank:em?cap(em[2]):'',nextRank:nr?nr[1]:'',title:txt(q('h3',ch)),pct:parseFloat(q('i',pr)?.style.width||'0')||0,reqs:txt(q('small',pr))}}
const ICO={travel:'✈',resources:'⚡',skills:'✦'};
function payText(b){const raw=b.pay?(b.pay.label||(b.pay.min!=null?(b.pay.max==null||Number(b.pay.min)===Number(b.pay.max)?`$${b.pay.min}`:`$${b.pay.min}–$${b.pay.max}`):'')):'';if(!raw)return '';const t=C('book.pay',{pay:raw,currency:b.pay.currency||''}).trim();return t||raw}
function energyText(b,m){const e=b.requirements?.energy;if(m.beta)return C('book.energyBeta');return e?C('book.energy',{energy:e}):''}
function whenText(b){return b.when&&b.when!=='now'?String(b.when):C('book.when')}
function takeText(b,hero){return (b.kind==='story'&&C('book.storyButton'))||(hero&&C('next.bookButton'))||C('book.button')}
function chips(b,m){const pay=payText(b),en=energyText(b,m);return `<div class="u10-chips">${pay?`<span class="u10-chip u10-pay"><em>${esc(C('book.payLabel'))}</em> ${esc(pay)}</span>`:''}<span class="u10-chip u10-when"><i class="u10-live" aria-hidden="true"></i>${esc(whenText(b))}</span>${en?`<span class="u10-chip${b.requirements?.energyOk===false?' u10-low':''}">${esc(en)}</span>`:''}</div>`}
function heroHTML(d,m){const beat=d.next?.beat;
 if(beat&&beat.title)return {html:`<article class="u10-hero"><div class="u10-glow" aria-hidden="true"></div><small class="u10-kicker">${esc(C('next.kicker'))}</small><h3>${esc(beat.title)}</h3>${beat.hook?`<p>${esc(beat.hook)}</p>`:''}<button type="button" class="u10-cta" data-u10-act="${esc(beat.action||'')}">${esc(C('next.button.'+String(beat.action||'').split(':')[0])||beat.button||C('next.button'))}<span aria-hidden="true">→</span></button></article>`,used:null};
 const bk=(d.bookings||[]).find(b=>b.requirements?.energyOk!==false)||(d.bookings||[])[0];
 if(bk)return {html:`<article class="u10-hero"><div class="u10-glow" aria-hidden="true"></div><small class="u10-kicker">${esc(C('next.bookKicker')||C('next.kicker'))}</small><h3>${esc(bk.title)}</h3>${bk.venue||bk.label?`<p>${esc(bk.label||bk.venue)}</p>`:''}${chips(bk,m)}<button type="button" class="u10-cta" data-u10-act="${esc(bk.action)}">${esc(takeText(bk,true))}<span aria-hidden="true">→</span></button></article>`,used:bk.id};
 return {html:`<div class="u10-hero u10-empty"><p>${esc(C('next.empty'))}</p></div>`,used:null}}
function sideHTML(side){if(!side.length)return'';return `<small class="u10-label">${esc(C('next.side'))}</small><div class="u10-side">${side.map(x=>`<button type="button" class="u10-sideitem u10-glass" data-u10-act="${esc(x.action||'')}"><span class="u10-dot" aria-hidden="true"></span><span class="u10-sidetxt"><b>${esc(x.title)}</b></span><span aria-hidden="true" class="u10-chev">›</span></button>`).join('')}</div>`}
function bookHTML(list,m){const dim=q('.main > .section.career48 [data-career-view="work"][data-uiux2-dim]');const hint=dim?.dataset.uiux2Hint||'';
 const head=`<div class="u10-sechead"><h2>${esc(C('book.title'))}</h2><span class="u10-sub">${esc(C('book.sub',{city:m.city}))}</span></div>${hint?`<div class="u10-lock">${esc(C('book.locked'))} · ${esc(hint)}</div>`:''}`;
 if(!list.length)return head+`<div class="u10-emptycard u10-glass">${esc(C('book.empty'))}</div>`;
 return head+`<div class="u10-rail" data-u10-rail${C('aria.rail')?` role="region" aria-label="${esc(C('aria.rail'))}"`:''}>${list.map(b=>`<article class="u10-book u10-glass k-${esc(b.kind)}"><small class="u10-place">${esc(b.label||b.venue||'')}</small><h3>${esc(b.title)}</h3>${chips(b,m)}<button type="button" class="u10-take" data-u10-act="${esc(b.action)}" data-u10-book="${esc(b.id)}">${esc(takeText(b))}</button></article>`).join('')}</div>`}
function storyHTML(items,ch){const head=`<div class="u10-sechead"><h2>${esc(C('story.title'))}</h2></div>`;
 const chap=ch?`<div class="u10-chapter u10-glass"><div class="u10-chtop"><small>${esc(C('story.chapter',{n:ch.n,rank:ch.rank}))}</small><span>${esc(ch.nextRank?C('story.next',{rank:ch.nextRank}):'')}</span></div><b>${esc(ch.title)}</b><div class="u10-bar"><i style="width:${Math.max(0,Math.min(100,ch.pct))}%"></i></div><small class="u10-reqs">${esc(ch.reqs)}</small></div>`:'';
 if(!items.length)return head+chap+`<div class="u10-emptycard u10-glass">${esc(C('story.empty'))}</div>`;
 const shown=storyOpen?items:items.slice(0,4);
 return head+chap+`<ol class="u10-timeline">${shown.map(x=>{const day=Number.isFinite(Number(x.day))&&x.day!==null?C('story.day',{day:Number(x.day)+1}):C('story.dayNone');return `<li class="u10-tl k-${esc(x.kind)}"><span class="u10-tldot" aria-hidden="true"></span><div><small>${esc((x.kind==='story'&&x.type&&C('story.kind.'+x.type))||C('story.kind.'+x.kind)||C('story.kind.story'))}${day?' · '+esc(day):''}</small><b>${esc(x.title)}</b>${x.outcome?`<p>${esc(x.outcome)}</p>`:''}</div></li>`}).join('')}</ol>${items.length>4?`<button type="button" class="u10-link" data-u10-tl aria-expanded="${storyOpen}">${esc(storyOpen?C('story.less'):C('story.more'))}</button>`:''}`}
function moreHTML(m){return `<div class="u10-sechead"><h2>${esc(C('more.title'))}</h2></div><div class="u10-morelist u10-glass">
 <button type="button" class="u10-morerow" data-u10-skills aria-expanded="${skillsOpen}"><span class="u10-mi" aria-hidden="true">${ICO.skills}</span><span><b>${esc(C('more.skills'))}</b><small>${esc(C('more.skillsSub',{n:m.sp}))}</small></span><span class="u10-chev u10-rot" aria-hidden="true">›</span></button>
 <div class="u10-skillslot" data-u10-skillslot ${skillsOpen?'':'hidden'}></div>
 ${[['travel',C('more.travel'),C('more.travelSub',{city:m.city})],['resources',C('more.resources'),C('more.resourcesSub')]].map(([k,a,b])=>`<button type="button" class="u10-morerow" data-u10-seg="${k}"><span class="u10-mi" aria-hidden="true">${ICO[k]}</span><span><b>${esc(a)}</b><small>${esc(b)}</small></span><span class="u10-chev" aria-hidden="true">›</span></button>`).join('')}</div>`}
function headerHTML(m){return `<div class="u10-head" id="u10-head"><div class="u10-headrow"><div class="u10-id"><small>${esc(C('header.level',{level:m.level}))}</small><b>${esc(C('header.rank',{rank:m.rank}))}</b></div><span class="u10-money">${esc(m.money)}</span></div><div class="u10-xp" aria-hidden="true"><i style="width:${m.xpPct}%"></i></div><div class="u10-seg" role="tablist"${C('aria.seg')?` aria-label="${esc(C('aria.seg'))}"`:''}>${SEGS.map(k=>`<button type="button" role="tab" aria-selected="${seg===k}" class="${seg===k?'on':''}" data-u10-seg="${k}">${esc(C('seg.'+k))}</button>`).join('')}<i class="u10-segpill" aria-hidden="true" style="--i:${SEGS.indexOf(seg)}"></i></div></div>`}

/* ---------- build ---------- */
function build(){if(building)return;const s=S();if(!s?.player||s.tab!=='world')return;const main=q('#app .main');const sec=origSection();if(!main||!sec)return;
 if(OFF()){teardown();return}
 building=true;try{
 const view=s.careerView||'story';
 if(lastView!==null&&view!==lastView){if(view==='travel'||view==='resources')seg=view;else if(seg==='travel'||seg==='resources')seg='overview'}
 if(lastView===null&&(view==='travel'||view==='resources'))seg=view;
 lastView=view;if((seg==='travel'||seg==='resources')&&view!==seg)seg='overview';
 document.documentElement.dataset.uiux10='on';main.classList.add('u10-main');
 if(!sec.dataset.u10id)sec.dataset.u10id=String(Math.random()).slice(2,10);
 let root=q('#uiux10',main);const fresh=!entered;
 if(!root){root=document.createElement('div');root.id='uiux10';main.insertBefore(root,sec)}
 const rail=q('[data-u10-rail]',root);if(rail)bookScroll=rail.scrollLeft;
 // give previously moved live nodes back to the same game section before re-rendering (otherwise innerHTML would destroy them)
 for(const sl of qa('[data-u10-slot],[data-u10-skillslot]',root))if(sl.dataset.from===sec.dataset.u10id)[...sl.childNodes].forEach(x=>sec.appendChild(x));
 const m=meta(),d=getData();let body='';
 if(seg==='overview'){const hero=heroHTML(d,m);
  body=`<section class="u10-sec" data-sec="next"><div class="u10-sechead"><h2>${esc(C('next.title'))}</h2></div>${hero.html}${sideHTML((d.next?.sideItems||[]).filter(x=>x&&x.title).slice(0,2))}</section>`
  +`<section class="u10-sec" data-sec="bookings">${bookHTML(d.bookings,m)}</section>`
  +`<section class="u10-sec" data-sec="story">${storyHTML(d.story,chapter())}</section>`
  +`<section class="u10-sec u10-moresec" data-sec="more">${moreHTML(m)}</section>`}
 else body=`<button type="button" class="u10-link u10-back" data-u10-seg="overview">‹ ${esc(C('back'))}</button><div class="u10-slot" data-u10-slot="${seg}"></div>`;
 root.innerHTML=headerHTML(m)+`<div class="u10-body${fresh&&!RM()?' u10-in':''}" data-seg="${seg}">${body}</div>`;
 entered=true;
 // move the game's live, bound nodes (handlers survive a DOM move)
 const slot=q('[data-u10-slot]',root);const sk=q('.scene-career157',sec)||q('.scene-career157',main);
 if(slot&&(seg==='travel'||seg==='resources')){const tabs=q('.career48tabs',sec);let n=tabs?tabs.nextSibling:null;const move=[];while(n){if(!(n.classList&&n.classList.contains('scene-career157')))move.push(n);n=n.nextSibling}move.forEach(x=>slot.appendChild(x))}
 else if(slot&&seg==='skills'&&sk)slot.appendChild(sk);
 else if(seg==='overview'&&skillsOpen&&sk)q('[data-u10-skillslot]',root)?.appendChild(sk);
 for(const sl of qa('[data-u10-slot],[data-u10-skillslot]',root))sl.dataset.from=sec.dataset.u10id;
 const r2=q('[data-u10-rail]',root);if(r2&&bookScroll)r2.scrollLeft=bookScroll;
 if(lastSeg!==null&&lastSeg!==seg&&!RM())q('.u10-body',root)?.animate?.([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:220,easing:'cubic-bezier(.2,.8,.2,1)'});
 lastSeg=seg;measure();
 }finally{building=false}}
function scrollToHead(){const h=q('#u10-head');if(!h)return;const top=h.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--u10-top'))||0);if(scrollY>top)scrollTo({top,behavior:RM()?'auto':'smooth'})}
function setSeg(k){if(!SEGS.includes(k))return;seg=k;
 if(k==='travel'||k==='resources'){lastView=k;ensureView(k)}
 else{const v=S()?.careerView;if(v==='travel'||v==='resources'){lastView='story';ensureView('story')}}
 build();scrollToHead()}
function teardown(){const had=document.documentElement.dataset.uiux10==='on'||q('#uiux10');delete document.documentElement.dataset.uiux10;q('#uiux10')?.remove();q('.main')?.classList.remove('u10-main');
 lastView=null;lastSeg=null;entered=false;if(had&&S()?.tab==='world'){try{render()}catch{}}} // re-render puts moved nodes back in the original page
function measure(){const tb=q('.topbar');const h=tb?Math.round(tb.getBoundingClientRect().height):0;document.documentElement.style.setProperty('--u10-top',Math.max(0,h)+'px')}

/* ---------- events ---------- */
document.addEventListener('click',e=>{if(OFF())return;const t=e.target.closest?.('#uiux10 [data-u10-seg],#uiux10 [data-u10-act],#uiux10 [data-u10-tl],#uiux10 [data-u10-skills]');if(!t)return;
 if(t.dataset.u10Seg)return setSeg(t.dataset.u10Seg);
 if(t.hasAttribute('data-u10-skills')){skillsOpen=!skillsOpen;build();return}
 if(t.hasAttribute('data-u10-tl')){storyOpen=!storyOpen;build();return}
 if(t.dataset.u10Act!=null)act(t.dataset.u10Act)});
function schedule(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;try{build()}catch(e){console.warn('uiux10',e)}})}
function hook(){const app=document.getElementById('app');if(!app)return setTimeout(hook,100);
 new MutationObserver(recs=>{if(building)return;if(OFF()){if(document.documentElement.dataset.uiux10)teardown();return}
  if(S()?.tab!=='world'){if(document.documentElement.dataset.uiux10)delete document.documentElement.dataset.uiux10;lastView=null;entered=false;return}
  const sec=origSection(),root=q('#app .main #uiux10');
  if(sec&&(!root||!sec.dataset.u10id))return build(); // runs as a microtask after render(): before paint, no flash of the old page
  if(recs.some(r=>!(r.target.closest&&r.target.closest('#uiux10'))&&[...r.addedNodes,...r.removedNodes].some(n=>n.nodeType===1&&(n.matches?.('.scene-nextmove148,#uiux2-today')||n.querySelector?.('#uiux2-today')))))schedule();
 }).observe(app,{childList:true,subtree:true});
 build()}
function start(){if(OFF())return wait();loadAssets();hook();
 addEventListener('scene:career-changed',schedule);addEventListener('scene:next-changed',schedule);addEventListener('scene:day1-changed',schedule);
 addEventListener('resize',measure,{passive:true});
 let offSeen=false;setInterval(()=>{const o=OFF();if(o!==offSeen){offSeen=o;if(o)teardown();else schedule()}},400)}
// OFF at load: touch nothing (no CSS, no copy, no observer) until the switch is turned off
function wait(){const t=setInterval(()=>{if(!OFF()){clearInterval(t);start()}},500)}
window.sceneUiux10={version:V,get seg(){return seg},setSeg,data:()=>getData(),copy:UI_COPY,refresh:()=>schedule(),temp:()=>!window.SCENE_CAREER};
if(document.readyState==='loading')addEventListener('DOMContentLoaded',start);else start();
})();
