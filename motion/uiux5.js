/* SCENE uiux5 · Live pill (Dynamic Island style) + DM reactions (iMessage-style tapbacks).
   Additive only: no core file is edited and the main save (localStorage 'status-hatchable-v4') is
   never written by this file. Reactions live in their own key 'scene-uiux5-reactions'.
   Kill switch: set window.SCENE_UIUX5_OFF=true before this script runs (nothing is installed, not even CSS).
   Sources for the pill are real game state/events only:
     - scene:dm-typing start/stop + scene:dm-delivered (runtime v200 events)     → "Kim is typing…" / new message
     - agreed plans in state.dms[].kimThread200.plans (status 'agreed' with a when/day label)
       and confirmed proposals in state.sceneProposals180 (status 'confirmed' with scheduledFor) → upcoming plan
     - like milestones on the player's own posts (metricsFor(p).likes) and follower jumps (state.player.followers)
     - celeb tapbacks created by this file (see react section)                    → "Kim laughed at your message"
   Tap targets use existing navigation: openDm(id) and openComments(postId); followers → the You tab button. */
(()=>{
'use strict';
if(window.SCENE_UIUX5_OFF===true||window.sceneUiux5)return;
const VER='uiux5-1',KEY='scene-uiux5-reactions',SKEY='scene-uiux5-pill';
const SRC=(document.currentScript&&document.currentScript.src)||'';
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const modal=()=>document.getElementById('modal');
const mq=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const RM=()=>mq.matches||document.documentElement.dataset.moReduced==='1';
const anim=(el,kf,o)=>{if(!el||!el.animate||RM())return null;try{return el.animate(kf,o)}catch{return null}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const char=id=>{try{return typeof byId==='function'?byId(id)||null:null}catch{return null}};
const nameOf=id=>char(id)?.name||'';
const firstName=id=>{const n=nameOf(id);return n.split(/\s+/)[0]||n};
const h32=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const T=()=>Date.now();
const dmOf=id=>(S()?.dms||[]).find(d=>d&&d.id===id)||null;
const openDmId=()=>{const m=modal();return m&&m.dataset.dm&&m.querySelector('.chatpage')?m.dataset.dm:''};
const fmtN=n=>{n=Math.round(+n||0);if(n>=1e6)return (n/1e6).toFixed(n>=1e7?0:1).replace(/\.0$/,'')+'M';if(n>=1e3)return (n/1e3).toFixed(n>=1e4?0:1).replace(/\.0$/,'')+'K';return String(n)};
const blockedUI=()=>!S()?.player||!!document.querySelector('.migrationboot,#status-tour,#scene-cinematic148,#scene-overlay157')||document.hidden;

/* ---------- CSS (one include line in index.html → the CSS is pulled in from here) ---------- */
(function css(){if(document.getElementById('uiux5-css'))return;const l=document.createElement('link');l.rel='stylesheet';l.id='uiux5-css';
  try{l.href=new URL('uiux5.css?v='+VER,SRC||location.href).href}catch{l.href='./motion/uiux5.css?v='+VER}document.head.appendChild(l)})();

/* ======================= 1. LIVE PILL ======================= */
const PRIO={react:4,typing:3,message:3,post:2,followers:2,plan:1};
const HOLD={react:3200,typing:1800,message:3000,post:3800,followers:3400,plan:4200};
const COOLDOWN=4500;           // gap between two different items (typing/react may jump the gap)
const Q=[];let cur=null,holdT=0,lastEnd=0,pumpT=0;const seenKeys=new Map();
let pill,hit,lead,txt,trail;
function sess(){try{return JSON.parse(sessionStorage.getItem(SKEY))||{}}catch{return{}}}
function setSess(o){try{sessionStorage.setItem(SKEY,JSON.stringify(o))}catch{}}
function buildPill(){
  pill=document.createElement('div');pill.id='u5-pill';pill.className='u5-pill';pill.dataset.state='hidden';pill.setAttribute('role','status');pill.setAttribute('aria-live','polite');
  pill.innerHTML='<button type="button" class="u5-pill-hit" tabindex="-1"><span class="u5-lead"></span><span class="u5-txt"></span><span class="u5-trail"></span></button>';
  document.body.appendChild(pill);hit=pill.firstElementChild;lead=hit.children[0];txt=hit.children[1];trail=hit.children[2];
  hit.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();const it=cur;if(!it)return;end(true);try{it.go&&it.go()}catch(err){console.warn('uiux5 pill nav',err)}});
}
function push(it){
  if(!it||!it.key)return;
  if(cur&&cur.key===it.key){Object.assign(cur,it);paint(cur,pill.dataset.state==='expanded'?'expanded':'compact');return}
  const seen=seenKeys.get(it.key);if(seen&&T()-seen<(it.repeatMs||60000))return;
  const i=Q.findIndex(x=>x.key===it.key);if(i>=0)Q.splice(i,1);
  it.at=T();Q.push(it);Q.sort((a,b)=>(PRIO[b.kind]-PRIO[a.kind])||(a.at-b.at));if(Q.length>5)Q.length=5;pump();
}
function pump(){
  clearTimeout(pumpT);
  for(let i=Q.length-1;i>=0;i--){const x=Q[i];if((x.live&&!x.live())||(x.ttl&&T()-x.at>x.ttl)||(x.valid&&!x.valid()))Q.splice(i,1)}
  const next=Q[0];if(!next)return;
  if(cur){ // only a strictly higher priority item may cut in, and never in the first 900ms
    if(PRIO[next.kind]>PRIO[cur.kind]&&T()-cur.shownAt>900){end(false)}else return}
  if(blockedUI()){pumpT=setTimeout(pump,1200);return}
  const wait=(next.kind==='typing'||next.kind==='react'||next.kind==='message')?0:Math.max(0,COOLDOWN-(T()-lastEnd));
  if(wait){pumpT=setTimeout(pump,wait+30);return}
  Q.shift();show(next);
}
function paint(it,st){
  const a=it.charId?char(it.charId):null;
  lead.innerHTML=a&&typeof av==='function'?(()=>{try{return av(a,'u5-av')}catch{return ''}})():(it.icon?`<span class="u5-ic">${esc(it.icon)}</span>`:'');
  txt.innerHTML=it.html||esc(it.text||'');
  trail.innerHTML=it.kind==='typing'?'<span class="u5-dots"><i></i><i></i><i></i></span>':(it.trail?`<span class="u5-ic">${esc(it.trail)}</span>`:'');
  hit.setAttribute('aria-label',(it.text||'')+(it.go?' · open':''));hit.tabIndex=it.go?0:-1;
  pill.dataset.kind=it.kind;setState(st);
}
function setState(st){if(!pill)return;pill.dataset.state=st;place()}
/* never park the pill on top of real controls: sample the area it would cover and, if any tappable
   element is underneath, drop it just below that element's header (e.g. the DM header). */
const TAPPABLE='button,a,input,select,textarea,label,[data-tab],[data-profile],[onclick],[role="button"]';
function place(){
  if(!pill)return;const st=pill.dataset.state;if(st==='hidden'){pill.style.removeProperty('--u5-top');return}
  pill.style.removeProperty('--u5-top');
  const W=st==='expanded'?Math.min(300,innerWidth-110):120,H=st==='expanded'?44:28;
  const r0=pill.getBoundingClientRect(),top=r0.top,x0=innerWidth/2-W/2;
  let push=0;const old=pill.style.visibility;pill.style.visibility='hidden';
  try{for(let y=top+2;y<top+H;y+=8)for(let x=x0+4;x<x0+W;x+=18){const el=document.elementFromPoint(x,y);const c=el&&el.closest&&el.closest(TAPPABLE);if(c&&!c.disabled){const hd=c.closest('header,.chatnav,.profiletop,.pagehead')||c;push=Math.max(push,hd.getBoundingClientRect().bottom)}}}catch{}
  pill.style.visibility=old;
  if(push>top)pill.style.setProperty('--u5-top',Math.round(push+6)+'px');
}
function show(it){
  cur=it;it.shownAt=T();seenKeys.set(it.key,T());
  if(it.persist){const o=sess();o[it.key]=T();setSess(o)}
  paint(it,'expanded');
  anim(pill,[{transform:'translateX(-50%) scale(.92)'},{transform:'translateX(-50%) scale(1.03)',offset:.6},{transform:'translateX(-50%) scale(1)'}],{duration:420,easing:'cubic-bezier(.34,1.56,.64,1)'});
  clearTimeout(holdT);holdT=setTimeout(()=>collapse(it),it.hold||HOLD[it.kind]||3200);
}
function collapse(it){
  if(cur!==it)return;
  if(it.live&&it.live()){setState('compact');clearTimeout(holdT);holdT=setTimeout(function chk(){if(cur!==it)return;if(it.live()&&!(it.charId&&openDmId()===it.charId))holdT=setTimeout(chk,500);else end(false)},500);return}
  end(false);
}
function end(){clearTimeout(holdT);if(!cur){return}cur=null;lastEnd=T();setState('hidden');setTimeout(pump,COOLDOWN+40)}

/* --- source: typing (scene:dm-typing) --- */
const typingNow=id=>!!dmOf(id)?.typing;
function typingItem(id,mid){const n=firstName(id);if(!n)return null;return{kind:'typing',key:'typing:'+id+':'+(mid||''),charId:id,text:`${n} is typing…`,html:`<b>${esc(n)}</b> is typing…`,live:()=>typingNow(id)&&openDmId()!==id,go:()=>openDm(id),repeatMs:20000}}
addEventListener('scene:dm-typing',e=>{const d=e.detail||{};if(!d.characterId)return;
  if(d.state==='start'){if(openDmId()===d.characterId)return;push(typingItem(d.characterId,d.messageId))}
});
addEventListener('scene:dm-delivered',e=>{const d=e.detail||{};if(d.from!=='them'||!d.characterId)return;
  const id=d.characterId;if(openDmId()===id)return;
  const showing=cur&&cur.kind==='typing'&&cur.charId===id;
  const queued=Q.some(x=>x.kind==='typing'&&x.charId===id);
  if(!showing&&!queued)return; // only morph a typing pill into the message it produced (no extra spam)
  for(let i=Q.length-1;i>=0;i--)if(Q[i].kind==='typing'&&Q[i].charId===id)Q.splice(i,1);
  const m=(dmOf(id)?.messages||[]).find(x=>x.mid===d.messageId),n=firstName(id);if(!m||!n)return;
  const prev=m.text?String(m.text).replace(/\s+/g,' ').slice(0,60):(m.image?'Sent a photo':'New message');
  const it={kind:'message',key:'msg:'+id+':'+d.messageId,charId:id,text:`${n}: ${prev}`,html:`<b>${esc(n)}</b> <span class="u5-dim">${esc(prev)}</span>`,go:()=>openDm(id),valid:()=>openDmId()!==id,ttl:8000};
  if(showing){cur=null;Q.unshift(it);show(Q.shift())}else push(it);
});
/* typing that started while the thread was open, then the thread was closed */
function typingSweep(){if(blockedUI())return;for(const d of S()?.dms||[])if(d?.typing&&openDmId()!==d.id&&!(cur&&cur.kind==='typing'&&cur.charId===d.id)&&!Q.some(x=>x.charId===d.id&&x.kind==='typing'))push(typingItem(d.id,(d.queue||[])[0]?.mid||''))}

/* --- source: plans with a time label (runtime v200 agreed plans + confirmed proposals) --- */
function planList(){
  const out=[],s=S();if(!s)return out;
  for(const d of s.dms||[]){for(const plans of [d?.kimThread200?.plans,d?.thread226?.plans]){if(!Array.isArray(plans))continue;
    for(const p of plans){if(!p||p.status!=='agreed')continue;const when=String(p.day||p.when||'').trim();if(!when)continue;
      const what=p.kind==='event'&&p.what?p.what:[p.activity&&p.activity!=='hang'?p.activity:'plans',p.place?`in ${p.place}`:''].filter(Boolean).join(' ');
      out.push({id:'plan:'+d.id+':'+(p.id||h32(what+when))+':'+when,charId:d.id,what,when,at:+p.agreedAt||+p.updatedAt||0})}}}
  for(const p of Array.isArray(s.sceneProposals180)?s.sceneProposals180:[]){if(!p||p.status!=='confirmed'||!p.scheduledFor)continue;
    out.push({id:'prop:'+p.id+':'+p.scheduledFor,charId:p.characterId,what:p.title||'Plan',when:String(p.scheduledFor),at:+p.confirmedAt||+p.updatedAt||0})}
  return out.sort((a,b)=>b.at-a.at);
}
let planBase=null;
function planSweep(){
  const list=planList(),ids=new Set(list.map(p=>p.id));
  const fresh=planBase?list.filter(p=>!planBase.has(p.id)):list.slice(0,1).filter(p=>!sess()[p.id]); // on load: the newest one, once per session
  planBase=ids;
  for(const p of fresh.slice(0,1)){const n=firstName(p.charId);if(!n)continue;const what=p.what.charAt(0).toUpperCase()+p.what.slice(1);
    const When=p.when.charAt(0).toUpperCase()+p.when.slice(1);push({kind:'plan',key:p.id,persist:true,charId:p.charId,text:`${When}: ${what} with ${n}`,html:`<b>${esc(When)}</b> <span class="u5-dim">${esc(what.toLowerCase())} · ${esc(n)}</span>`,trail:'🗓️',go:()=>openDm(p.charId),ttl:120000})}
}

/* --- source: the player's posts doing well + follower jumps (real numbers the game shows) --- */
const MIL=[10,25,50,100,250,500,1e3,2500,5e3,1e4,25e3,5e4,1e5,25e4,5e5,1e6,25e5,5e6,1e7];
const milIdx=n=>{let i=-1;for(let k=0;k<MIL.length;k++)if(n>=MIL[k])i=k;return i};
const postBase=new Map();let folBase=null;
function postSweep(){
  const s=S();if(!s?.player||typeof metricsFor!=='function')return;
  const mine=(s.posts||[]).filter(p=>p&&p.authorId==='player').sort((a,b)=>(b.createdAt||0)-(a.createdAt||0)).slice(0,6);
  for(const p of mine){let likes=0;try{likes=+metricsFor(p).likes||0}catch{continue}
    const k=milIdx(likes),b=postBase.get(p.id);postBase.set(p.id,{k:Math.max(k,b?.k??-1),likes});
    if(b===undefined||k<=b.k||k<0)continue;
    const snippet=String(p.text||'').replace(/\s+/g,' ').slice(0,26)||'your post';
    push({kind:'post',key:'post:'+p.id+':'+MIL[k],icon:'♥',text:`Your post hit ${fmtN(MIL[k])} likes · “${snippet}”`,html:`<b>${fmtN(MIL[k])} likes</b> <span class="u5-dim">on “${esc(snippet)}”</span>`,trail:'📈',go:()=>{if(typeof openComments==='function'&&S()?.posts?.some(x=>x.id===p.id))openComments(p.id)},ttl:30000})}
  const f=+s.player.followers||0;
  if(folBase===null){folBase=f;return}
  const gain=f-folBase;
  if(gain>=Math.max(10,Math.round(folBase*.05))){push({kind:'followers',key:'fol:'+f,icon:'＋',text:`+${fmtN(gain)} new followers · ${fmtN(f)} total`,html:`<b>+${fmtN(gain)} followers</b> <span class="u5-dim">· ${fmtN(f)} total</span>`,trail:'✨',go:()=>{try{if(modal()?.firstElementChild)closeModal()}catch{}document.querySelector('.navbtn[data-tab="you"]')?.click()},ttl:30000});folBase=f}
  else if(f<folBase)folBase=f;
}

/* ======================= 2. DM REACTIONS ======================= */
const EMO=['❤️','😂','‼️','🔥','👀'];
const VERB={'❤️':'loved','😂':'laughed at','‼️':'emphasized','🔥':'reacted 🔥 to','👀':'reacted 👀 to'};
function load(){try{const o=JSON.parse(localStorage.getItem(KEY));if(o&&o.v===1)return {v:1,t:o.t||{},auto:o.auto||{}}}catch{}return {v:1,t:{},auto:{}}}
let RS=load();
function persist(){try{localStorage.setItem(KEY,JSON.stringify(RS))}catch{}}
addEventListener('storage',e=>{if(e.key===KEY){RS=load();decorate()}});
const thId=id=>'dm:'+id;
const msgKey=(m,i)=>m&&m.mid?String(m.mid):'i'+i;
function getR(th,k){return RS.t[th]?.[k]||null}
function setR(th,k,patch){const t=RS.t[th]||(RS.t[th]={});const cur=Object.assign({},t[k]||{},patch);for(const x of Object.keys(cur))if(cur[x]==null)delete cur[x];if(Object.keys(cur).length)t[k]=cur;else delete t[k];if(!Object.keys(t).length)delete RS.t[th];persist()}
/* map DOM bubbles to state messages: dmThreadHtml renders one .bubble per message in order (+ an optional
   .typing bubble). If counts ever differ we align from the end (newest messages are the ones on screen). */
function bubbleMap(){
  const id=openDmId();if(!id)return null;const th=modal().querySelector('#dmthread');const d=dmOf(id);if(!th||!d)return null;
  const bs=[...th.querySelectorAll(':scope > .bubble')].filter(b=>!b.classList.contains('typing'));const ms=d.messages||[];
  const n=Math.min(bs.length,ms.length),out=[];for(let j=0;j<n;j++){const bi=bs.length-n+j,mi=ms.length-n+j;out.push({b:bs[bi],m:ms[mi],k:msgKey(ms[mi],mi)})}
  return {id,th:thId(id),list:out};
}
function decorate(popKey){
  const M=bubbleMap();if(!M)return;
  for(const {b,m,k} of M.list){
    b.dataset.u5k=k;b.classList.add('u5-b');const r=getR(M.th,k);
    const want=r?[r.them&&r.them.e,r.me].filter(Boolean):[];const sig=want.join('|')+'|'+(r?.them?.by||'');
    let tb=b.querySelector(':scope > .u5-tb');
    if(!want.length){if(tb)tb.remove();b.classList.remove('u5-has');continue}
    if(!tb){tb=document.createElement('span');tb.className='u5-tb';tb.setAttribute('aria-hidden','false');b.appendChild(tb)}
    b.classList.add('u5-has');
    if(tb.dataset.sig!==sig){tb.dataset.sig=sig;
      tb.innerHTML=(r.them?`<i class="u5-e u5-e-them" title="${esc(nameOf(r.them.by))}">${esc(r.them.e)}</i>`:'')+(r.me?`<i class="u5-e u5-e-me" title="You">${esc(r.me)}</i>`:'');
      tb.setAttribute('aria-label',[r.them?`${nameOf(r.them.by)} ${VERB[r.them.e]||'reacted to'} this`:'',r.me?`You reacted ${r.me}`:''].filter(Boolean).join(', '))}
    if(popKey&&popKey===k)pop(tb);
  }
}
function pop(tb){anim(tb,[{transform:'scale(.2)',opacity:0},{transform:'scale(1.35)',opacity:1,offset:.55},{transform:'scale(.9)',offset:.8},{transform:'scale(1)'}],{duration:480,easing:'cubic-bezier(.34,1.56,.64,1)'})}
function burst(b,emoji){ // big heart that pops out of the bubble on double tap
  if(RM())return;const r=b.getBoundingClientRect(),el=document.createElement('i');el.className='u5-burst';el.textContent=emoji;el.style.left=(r.left+r.width/2)+'px';el.style.top=(r.top+r.height/2)+'px';document.body.appendChild(el);
  const a=anim(el,[{transform:'translate(-50%,-50%) scale(.3)',opacity:0},{transform:'translate(-50%,-50%) scale(1.25)',opacity:1,offset:.35},{transform:'translate(-50%,-70%) scale(1)',opacity:1,offset:.7},{transform:'translate(-50%,-110%) scale(.8)',opacity:0}],{duration:700,easing:'cubic-bezier(.16,.86,.24,1)'});
  if(a)a.onfinish=()=>el.remove();else el.remove();
}
function react(b,emoji,{toggle=true}={}){
  const M=bubbleMap();if(!M)return;const row=M.list.find(x=>x.b===b);if(!row)return;
  const curE=getR(M.th,row.k)?.me||null,next=toggle&&curE===emoji?null:emoji;
  setR(M.th,row.k,{me:next});decorate(next?row.k:null);if(next)burst(b,emoji);
  try{navigator.vibrate&&navigator.vibrate(8)}catch{}
}
/* reaction bar */
let bar=null,scrim=null,barFor=null;
function closeBar(){if(!bar)return;const b=bar,s=scrim;bar=scrim=null;if(barFor)barFor.classList.remove('u5-lift');barFor=null;
  const a=anim(b,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.85)'}],{duration:140,easing:'ease-in'});if(a)a.onfinish=()=>b.remove();else b.remove();s.remove()}
function openBar(b){
  closeBar();const M=bubbleMap();if(!M)return;const row=M.list.find(x=>x.b===b);if(!row)return;
  const mine=getR(M.th,row.k)?.me||'';barFor=b;b.classList.add('u5-lift');
  scrim=document.createElement('div');scrim.className='u5-scrim';document.body.appendChild(scrim);
  const swallow=e=>{e.preventDefault();e.stopPropagation();closeBar()};scrim.addEventListener('touchstart',swallow,{passive:false});scrim.addEventListener('mousedown',swallow);
  bar=document.createElement('div');bar.className='u5-bar';bar.setAttribute('role','menu');
  const text=row.m?.text?String(row.m.text):'';
  bar.innerHTML=EMO.map(e=>`<button type="button" role="menuitem" data-u5e="${e}" class="${e===mine?'on':''}" aria-label="React ${e}">${e}</button>`).join('')+(text?'<button type="button" role="menuitem" class="u5-copy" aria-label="Copy message">Copy</button>':'');
  document.body.appendChild(bar);
  const r=b.getBoundingClientRect(),bw=bar.offsetWidth,bh=bar.offsetHeight,hdr=modal().querySelector('.chatnav')?.getBoundingClientRect().bottom||0;
  let left=b.classList.contains('me')?r.right-bw:r.left;left=Math.max(8,Math.min(innerWidth-bw-8,left));
  let top=r.top-bh-8;if(top<hdr+6)top=Math.min(innerHeight-bh-8,r.bottom+8);
  bar.style.left=left+'px';bar.style.top=top+'px';bar.style.transformOrigin=(b.classList.contains('me')?'right':'left')+(top<r.top?' bottom':' top');
  anim(bar,[{opacity:0,transform:'scale(.6)'},{opacity:1,transform:'scale(1.04)',offset:.7},{opacity:1,transform:'scale(1)'}],{duration:260,easing:'cubic-bezier(.34,1.56,.64,1)'});
  [...bar.querySelectorAll('button')].forEach((x,i)=>anim(x,[{transform:'scale(.3)',opacity:0},{transform:'scale(1)',opacity:1}],{duration:220,delay:30+i*28,easing:'cubic-bezier(.34,1.56,.64,1)',fill:'backwards'}));
  bar.addEventListener('click',e=>{const x=e.target.closest('button');if(!x)return;e.preventDefault();e.stopPropagation();
    if(x.classList.contains('u5-copy')){try{navigator.clipboard?.writeText(text)}catch{}try{typeof flash==='function'&&flash('Copied')}catch{}closeBar();return}
    const target=barFor;closeBar();if(target&&target.isConnected)react(target,x.dataset.u5e)});
}
/* gestures (delegated on #modal so they survive thread re-renders) */
const NOGO='a,button,input,textarea,select,label,video,audio,[data-profile]';
function bubbleAt(t){const b=t&&t.closest&&t.closest('#dmthread > .bubble');if(!b||b.classList.contains('typing')||t.closest(NOGO))return null;return b}
let tap=null,lp=null,lastTouch=0;
function hasSelection(){try{const s=getSelection();return s&&!s.isCollapsed&&String(s).trim().length>0}catch{return false}}
function wireGestures(){
  const m=modal();if(!m||m.dataset.u5g)return;m.dataset.u5g='1';
  m.addEventListener('touchstart',e=>{lastTouch=T();const b=bubbleAt(e.target);if(!b||e.touches.length>1){lp&&clearTimeout(lp.t);lp=null;return}
    const p=e.touches[0];lp={b,x:p.clientX,y:p.clientY,fired:false,t:setTimeout(()=>{if(!lp||lp.b!==b)return;lp.fired=true;tap=null;openBar(b);try{navigator.vibrate&&navigator.vibrate(10)}catch{}},460)}},{passive:true});
  m.addEventListener('touchmove',e=>{if(!lp)return;const p=e.touches[0];if(Math.hypot(p.clientX-lp.x,p.clientY-lp.y)>10){clearTimeout(lp.t);lp=null;tap=null}},{passive:true});
  m.addEventListener('touchcancel',()=>{if(lp)clearTimeout(lp.t);lp=null},{passive:true});
  m.addEventListener('touchend',e=>{lastTouch=T();const L=lp;lp=null;if(!L)return;clearTimeout(L.t);
    if(L.fired){if(e.cancelable)e.preventDefault();return}
    const p=e.changedTouches[0],now=T();
    if(tap&&tap.b===L.b&&now-tap.at<320&&Math.hypot(p.clientX-tap.x,p.clientY-tap.y)<30&&!hasSelection()){if(e.cancelable)e.preventDefault();tap=null;react(L.b,'❤️');return}
    tap={b:L.b,at:now,x:p.clientX,y:p.clientY};
  },{passive:false});
  m.addEventListener('contextmenu',e=>{const b=bubbleAt(e.target);if(!b)return;e.preventDefault();if(T()-lastTouch<800)return;openBar(b)});
  m.addEventListener('dblclick',e=>{if(T()-lastTouch<800)return;const b=bubbleAt(e.target);if(!b)return;e.preventDefault();try{getSelection().removeAllRanges()}catch{}react(b,'❤️')});
  m.addEventListener('scroll',()=>closeBar(),true);
}

/* celebs reacting to Kyle's messages: deterministic ~1 in 4 replies, never twice in a row per thread */
function pickEmoji(reply,mine){const t=(String(reply||'')+' '+String(mine||'')).toLowerCase();
  if(/😂|😭|\blol\b|\blmao\b|haha|funny|\bjoke/.test(t))return '😂';
  if(/🔥|\bfire\b|\bhot\b|obsessed|iconic|slay/.test(t))return '🔥';
  if(/👀|\btea\b|\bspill|\bgossip|\bwho\b.*\?|really\?/.test(t))return '👀';
  if(/!!|\bomg\b|no way|\bwait\b|\bwhat\?/.test(t))return '‼️';
  return '❤️'}
function maybeCelebReact(det){
  const id=det.characterId,mid=det.messageId,d=dmOf(id),n=nameOf(id);if(!d||!mid||!n)return;
  const ms=d.messages||[],i=ms.findIndex(m=>m&&m.mid===mid);if(i<1)return;
  const mine=ms[i-1];if(!mine||mine.from!=='me')return;        // only the first bubble of a reply to Kyle
  const th=thId(id),a=RS.auto[th]||{};if(a.lastMid===mid)return;
  const k=msgKey(mine,i-1);if(getR(th,k)?.them){RS.auto[th]={lastMid:mid,lastReacted:false};persist();return}
  const yes=!a.lastReacted&&h32(th+'|'+mid)%4===0;
  RS.auto[th]={lastMid:mid,lastReacted:yes};
  if(!yes){persist();return}
  const e=pickEmoji(ms[i]?.text,mine.text);setR(th,k,{them:{e,by:id,at:T()}});
  decorate(k);
  const fn=firstName(id),verb=VERB[e]||'reacted to';
  push({kind:'react',key:'react:'+th+':'+k,charId:id,text:`${fn} ${verb} your message`,html:`<b>${esc(fn)}</b> ${esc(verb)} your message`,trail:e,go:()=>{if(openDmId()!==id)openDm(id)},ttl:15000,hold:3000});
}
addEventListener('scene:dm-delivered',e=>{const d=e.detail||{};if(d.from!=='them')return;setTimeout(()=>{try{maybeCelebReact(d)}catch(err){console.warn('uiux5 react',err)}},650)});

/* ======================= boot ======================= */
function boot(){
  buildPill();wireGestures();
  const m=modal();let qd=false;
  if(m)new MutationObserver(()=>{if(qd)return;qd=true;requestAnimationFrame(()=>{qd=false;try{wireGestures();if(barFor&&!barFor.isConnected)closeBar();decorate();
      if(cur&&cur.charId&&openDmId()===cur.charId&&(cur.kind==='typing'||cur.kind==='message'))end(false);place()}catch(err){console.warn('uiux5',err)}})}).observe(m,{childList:true,subtree:true});
  addEventListener('resize',place);
  setInterval(()=>{try{if(window.SCENE_UIUX5_OFF===true){pill&&(pill.dataset.state='hidden');return}typingSweep();planSweep();postSweep()}catch(err){console.warn('uiux5 sweep',err)}},2000);
  try{postSweep();planSweep()}catch{}
  decorate();
  window.sceneUiux5={version:VER,storageKey:KEY,current:()=>cur&&{kind:cur.kind,key:cur.key,text:cur.text,state:pill.dataset.state},queue:()=>Q.map(x=>({kind:x.kind,key:x.key})),reactions:()=>JSON.parse(JSON.stringify(RS)),plans:planList,redecorate:decorate};
}
(function wait(n=0){if(typeof render==='function'&&typeof openDm==='function'&&!document.querySelector('.migrationboot')&&document.getElementById('modal'))return setTimeout(boot,60);if(n<900)setTimeout(()=>wait(n+1),100)})();
})();
