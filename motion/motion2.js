/* SCENE motion layer · batch 2 (sheets, tabs, likes, DM liveliness, tactile taps)
   Depends on motion.js (window.sceneFX._int). DM motion listens ONLY to window events:
   scene:dm-typing / scene:dm-delivered / scene:dm-seen / scene:dm-double-text (see dm-events-shim.js). */
(()=>{
'use strict';
const q=s=>document.querySelector(s),T=()=>performance.now();
const mq=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const RM=()=>mq.matches||document.documentElement.dataset.moReduced==='1';
const E={out:'cubic-bezier(.16,.86,.24,1)',snap:'cubic-bezier(.34,1.56,.64,1)',inout:'cubic-bezier(.65,0,.35,1)'},D={fast:160,med:320,slow:640};
const anim=(el,kf,o)=>{if(!el||!el.animate||RM())return null;try{return el.animate(kf,o)}catch{return null}};
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const modal=()=>document.getElementById('modal');
const layer=()=>{let l=document.getElementById('mo-layer');if(!l){l=document.createElement('div');l.id='mo-layer';l.className='mo-layer';document.body.appendChild(l)}return l};

/* ---------- 1. sheets: enter animations + swipe-down dismiss ---------- */
let lastKind='';
function kindOf(el){if(!el)return'';if(el.matches('.chatpage'))return'dm';if(el.matches('.profilepage'))return'profile';if(el.matches('.activitypage'))return'page';if(el.matches('.overlay'))return'sheet';if(el.matches('.outcomeoverlay'))return'outcome';if(el.matches('.storyscreen'))return'story';return el.className||'x'}
function enterModal(){
  const m=modal(),el=m&&m.firstElementChild,k=kindOf(el);
  if(!el){lastKind='';return}
  if(k===lastKind)return;lastKind=k;
  if(k==='dm'||k==='profile'||k==='page'){anim(el,[{transform:'translateX(100%)',opacity:.6},{transform:'translateX(0)',opacity:1}],{duration:D.med+60,easing:E.out})}
  else if(k==='sheet'){anim(el,[{opacity:0},{opacity:1}],{duration:D.med,easing:E.out});const sh=el.querySelector('.sheet');anim(sh,[{transform:'translateY(100%)'},{transform:'translateY(0)'}],{duration:350,easing:E.out});sh&&swipe(sh)}
  else if(k==='outcome'){anim(el,[{opacity:0},{opacity:1}],{duration:D.med,easing:E.out});anim(el.firstElementChild,[{transform:'translateY(30px) scale(.94)',opacity:0},{transform:'none',opacity:1}],{duration:D.slow,easing:E.snap})}
}
function swipe(sh){
  if(sh.dataset.moSwipe)return;sh.dataset.moSwipe='1';
  let y0=0,dy=0,t0=0,on=false;
  sh.addEventListener('touchstart',e=>{if(sh.scrollTop>2||e.touches.length>1){on=false;return}on=true;y0=e.touches[0].clientY;dy=0;t0=T()},{passive:true});
  sh.addEventListener('touchmove',e=>{if(!on)return;dy=e.touches[0].clientY-y0;if(dy<=0){sh.style.transform='';return}if(e.cancelable)e.preventDefault();sh.style.transform=`translateY(${dy}px)`;const o=sh.parentElement;if(o)o.style.opacity=String(Math.max(.35,1-dy/600))},{passive:false});
  const end=()=>{if(!on)return;on=false;const v=dy/Math.max(1,T()-t0);const o=sh.parentElement;
    if(dy>110||v>.8){try{window.closeModal()}catch{}}
    else if(dy>0){const from=sh.style.transform;sh.style.transform='';if(o)o.style.opacity='';anim(sh,[{transform:from},{transform:'translateY(0)'}],{duration:D.med,easing:E.snap})}};
  sh.addEventListener('touchend',end,{passive:true});sh.addEventListener('touchcancel',end,{passive:true});
}

/* ---------- 2. tabs: crossfade+slide, nav indicator, per-tab scroll ---------- */
const ORDER=['feed','world','circle','you','settings'];
const scrollByTab={};let lastTab='',lastIndX=null;
function hookRender(){
  const base=window.render;if(typeof base!=='function'||base.__mo2)return;
  const w=function(...a){const s=S(),before=s?.tab,y=scrollY;const r=base.apply(this,a);try{const after=S()?.tab;if(after&&after===before&&Math.abs(scrollY-y)>2)scrollTo(0,y)}catch{}return r};
  w.__mo2=true;window.render=w;
}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-tab]');const s=S();if(b&&s&&b.dataset.tab!==s.tab)scrollByTab[s.tab]=scrollY},true);
function afterRender(){
  const s=S();if(!s?.player)return;const tab=s.tab,main=q('.main');
  if(lastTab&&tab!==lastTab&&main){
    const dir=ORDER.indexOf(tab)>=ORDER.indexOf(lastTab)?1:-1;
    const y=scrollByTab[tab]||0;scrollTo(0,y);requestAnimationFrame(()=>{if(Math.abs(scrollY-y)>2)scrollTo(0,y)});
    anim(main,[{opacity:0,transform:`translateX(${18*dir}px)`},{opacity:1,transform:'translateX(0)'}],{duration:D.med-60,easing:E.out});
  }
  if(tab!==lastTab||!q('.nav .mo-navind'))navIndicator();
  lastTab=tab;
}
function navIndicator(){
  const nav=q('.nav'),on=nav&&nav.querySelector('.navbtn.on');if(!nav)return;
  let ind=nav.querySelector('.mo-navind');if(!ind){ind=document.createElement('i');ind.className='mo-navind';nav.appendChild(ind)}
  if(!on){ind.style.opacity='0';return}
  const nr=nav.getBoundingClientRect(),r=on.getBoundingClientRect(),x=r.left-nr.left+r.width/2-14;
  ind.style.opacity='1';ind.style.transform=`translateX(${x}px)`;
  if(lastIndX!==null&&lastIndX!==x)anim(ind,[{transform:`translateX(${lastIndX}px) scaleX(1.6)`},{transform:`translateX(${x}px) scaleX(1)`}],{duration:D.med+40,easing:E.snap});
  lastIndX=x;
}

/* ---------- 3. like burst ---------- */
let pendingLike=null;
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-like]');if(!b)return;const s=S(),p=s?.posts?.find(x=>x.id===b.dataset.like);pendingLike={id:b.dataset.like,liking:p?!p.liked:true,at:T()};setTimeout(likeFx,0)},true);
function likeFx(){
  const L=pendingLike;if(!L||T()-L.at>1500)return;
  const b=document.querySelector(`[data-like="${CSS.escape(L.id)}"]`);if(!b){requestAnimationFrame(likeFx);return}
  pendingLike=null;
  const svg=b.querySelector('svg'),num=b.querySelector('span');
  if(!L.liking){anim(svg,[{transform:'scale(1)'},{transform:'scale(.8)'},{transform:'scale(1)'}],{duration:D.med,easing:E.out});return}
  anim(svg,[{transform:'scale(.6)'},{transform:'scale(1.45)',offset:.45},{transform:'scale(.92)',offset:.75},{transform:'scale(1)'}],{duration:520,easing:E.snap});
  anim(num,[{transform:'translateY(.5em)',opacity:0},{transform:'none',opacity:1}],{duration:D.med,delay:120,easing:E.out,fill:'backwards'});
  if(RM()||!svg)return;
  const r=svg.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2,Lr=layer();
  const ring=document.createElement('i');ring.className='mo-likering';ring.style.left=cx+'px';ring.style.top=cy+'px';Lr.appendChild(ring);
  const ra=anim(ring,[{transform:'translate(-50%,-50%) scale(.3)',opacity:.9},{transform:'translate(-50%,-50%) scale(2.2)',opacity:0}],{duration:520,easing:E.out});if(ra)ra.onfinish=()=>ring.remove();else ring.remove();
  for(let i=0;i<9;i++){const d=document.createElement('i');d.className='mo-likedot';d.style.left=cx+'px';d.style.top=cy+'px';d.style.background=['#ff3d6e','#ff8fb1','#ffd36b','#ff5ab4'][i%4];Lr.appendChild(d);
    const ang=i/9*Math.PI*2+Math.random()*.4,dist=22+Math.random()*16,x=Math.cos(ang)*dist,y=Math.sin(ang)*dist;
    const a=anim(d,[{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${x}px),calc(-50% + ${y}px)) scale(.2)`,opacity:0}],{duration:560+Math.random()*160,easing:E.out});if(a)a.onfinish=()=>d.remove();else d.remove()}
}

/* ---------- 4. DM liveliness (events only) ---------- */
function thread(){const m=modal();if(!m||!m.firstElementChild)return null;return m.querySelector('#dmthread,[data-dm-thread],.chatthread,.dmthread')||m}
function bubbles(side){const t=thread();if(!t)return[];return [...t.querySelectorAll('[class*="bubble"],[data-from]')].filter(b=>!/typing/.test(b.className)&&!b.closest('.typing')&&(!side||(side==='them'?/\bthem\b/.test(b.className)||b.dataset.from==='them':/\bme\b/.test(b.className)||b.dataset.from==='me')))}
function newest(side){const b=bubbles(side);return b[b.length-1]||null}
function whenDom(fn,n=0){requestAnimationFrame(()=>{if(!fn()&&n<8)setTimeout(()=>whenDom(fn,n+1),60)})}
function onDelivered(e){const d=e.detail||{},side=d.from==='me'?'me':'them';
  whenDom(()=>{const b=newest(side);if(!b||b.dataset.moIn===String(d.messageId))return!!b;b.dataset.moIn=String(d.messageId);
    if(side==='me'){const comp=q('#modal .chatcomposer,#modal #dmtext');const cr=comp&&comp.getBoundingClientRect(),br=b.getBoundingClientRect();const dy=cr?Math.max(20,Math.min(160,cr.top-br.top)):40;
      anim(b,[{transform:`translateY(${dy}px) scale(.92)`,opacity:.2},{transform:'translateY(-3px) scale(1.01)',opacity:1,offset:.75},{transform:'none',opacity:1}],{duration:D.med+80,easing:E.out})}
    else{anim(b,[{transform:'translateX(-22px) scale(.9)',opacity:0},{transform:'none',opacity:1}],{duration:D.med+40,easing:E.out});nudgeMeter(d.characterId)}
    return true})}
function onDouble(e){const side=e.detail?.from==='me'?'me':'them';whenDom(()=>{const b=newest(side);if(!b)return false;anim(b,[{transform:'translateY(14px) scale(.9)',opacity:0},{transform:'translateY(-6px) scale(1.04)',opacity:1,offset:.55},{transform:'translateY(2px)',offset:.8},{transform:'none'}],{duration:520,delay:60,easing:E.out,fill:'backwards'});return true})}
function onSeen(){whenDom(()=>{const t=thread();if(!t)return false;const lab=[...t.querySelectorAll('small,[data-status]')].filter(x=>/seen/i.test(x.textContent)).pop();if(!lab)return false;anim(lab,[{opacity:0,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:D.med+80,easing:E.out});return true})}
function onTyping(e){const d=e.detail||{};if(d.state==='start')whenDom(()=>{const t=thread();const tb=t&&[...t.querySelectorAll('.typing,[data-typing]')].pop();if(!tb)return false;anim(tb,[{transform:'scale(.5) translateY(10px)',opacity:0},{transform:'scale(1.05)',opacity:1,offset:.7},{transform:'none',opacity:1}],{duration:D.med+40,easing:E.snap});return true});
  beat(d.characterId,d.state==='start')}
/* heartbeat on the character's avatar ring while typing (avatars carry aria-label=name) */
function avatarsFor(id){let n='';try{n=byId(id)?.name||''}catch{}if(!n)return[];return [...document.querySelectorAll('.avatar[aria-label]')].filter(a=>a.getAttribute('aria-label')===n)}
function beat(id,on){avatarsFor(id).forEach(a=>a.classList.toggle('mo-beat',on&&!RM()))}
/* small relationship meter in the DM header, nudged on each reply */
function heat(id){const r=S()?.relations?.[id]||{};return Math.max(0,Math.min(100,Math.round((+r.friendship||0)*.5+(+r.chemistry||0)*.3+(+r.trust||0)*.2-(+r.tension||0)*.3)))}
function meter(){const m=modal(),id=m?.dataset?.dm;if(!id||!m.firstElementChild)return null;let el=m.querySelector('.mo-meter');if(!el){el=document.createElement('div');el.className='mo-meter';el.innerHTML='<span>♥</span><i><b></b></i>';(m.querySelector('.chatnav .chatidentity')||m.querySelector('.chatnav')||m.firstElementChild).appendChild(el)}const v=heat(id);el.querySelector('b').style.transform=`scaleX(${Math.max(.04,v/100)})`;el.title=`Relationship ${v}/100`;return el}
function nudgeMeter(id){const el=meter();if(!el||modal()?.dataset?.dm!==id)return;anim(el,[{transform:'scale(1)'},{transform:'scale(1.18)',offset:.35},{transform:'scale(1)'}],{duration:D.slow,easing:E.snap});anim(el.querySelector('span'),[{transform:'scale(1)'},{transform:'scale(1.6)',offset:.3},{transform:'scale(1)'}],{duration:D.slow,easing:E.snap})}
addEventListener('scene:dm-delivered',onDelivered);addEventListener('scene:dm-double-text',onDouble);addEventListener('scene:dm-seen',onSeen);addEventListener('scene:dm-typing',onTyping);

/* ---------- 5. tactile: diamonds clink when spent ---------- */
addEventListener('scenefx:gems-spent',()=>{const g=q('.hudrow .gems');if(!g||RM())return;anim(g,[{transform:'rotate(0)'},{transform:'rotate(-5deg)'},{transform:'rotate(4deg)'},{transform:'rotate(-2deg)'},{transform:'rotate(0)'}],{duration:360,easing:'linear'});
  const r=g.getBoundingClientRect(),Lr=layer();for(let i=0;i<6;i++){const s=document.createElement('i');s.className='mo-spark';s.textContent='✦';s.style.left=(r.left+18+Math.random()*20)+'px';s.style.top=(r.top+r.height/2)+'px';Lr.appendChild(s);const a=anim(s,[{transform:'translate(-50%,-50%) scale(.4)',opacity:1},{transform:`translate(calc(-50% + ${(Math.random()-.5)*50}px),calc(-50% - ${14+Math.random()*26}px)) scale(1)`,opacity:0}],{duration:600+i*40,easing:E.out});if(a)a.onfinish=()=>s.remove();else s.remove()}});

/* ---------- boot ---------- */
function boot(){
  hookRender();
  const m=modal();if(m)new MutationObserver(()=>{enterModal();meter();/* re-renders (openComments etc.) replace .sheet without changing modal kind: re-arm swipe (idempotent via data-mo-swipe) */const sh=m.querySelector(':scope > .overlay > .sheet');if(sh)swipe(sh)}).observe(m,{childList:true});
  const app=document.getElementById('app');let qd=false;
  new MutationObserver(()=>{if(qd)return;qd=true;queueMicrotask(()=>{qd=false;try{afterRender()}catch(e){console.warn('motion2',e)}})}).observe(app,{childList:true});
  setInterval(()=>{hookRender()},1000);afterRender();
}
(function wait(n=0){if(window.sceneFX&&window.sceneFX._int&&typeof render==='function'&&!document.querySelector('.migrationboot'))return setTimeout(boot,50);if(n<700)setTimeout(()=>wait(n+1),100)})();

/* ---------- debug ---------- */
Object.assign(window.sceneFX||(window.sceneFX={}),{
  dm(kind='typing',id){const m=modal();id=id||m?.dataset?.dm||'kim';const base={characterId:id,threadId:'dm:'+id,messageId:'debug'+Date.now()};
    const f=(n,x={})=>dispatchEvent(new CustomEvent('scene:'+n,{detail:{...base,...x}}));
    if(kind==='typing'){f('dm-typing',{state:'start'});setTimeout(()=>f('dm-typing',{state:'stop'}),2500)}else if(kind==='seen')f('dm-seen');else if(kind==='double')f('dm-double-text');else f('dm-delivered',{from:kind==='me'?'me':'them'});return kind},
  like(){const b=q('[data-like]');if(b)b.click();return!!b}
});
})();
