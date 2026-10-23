/* SCENE motion layer · batch 1
   Hooks into the existing game without rewriting it:
   - MutationObserver on #app/#modal (render() rebuilds via innerHTML, so we repaint persisted values right after)
   - wraps closeModal and SCENE_advanceDay, observes memory/notifications for natural triggers
   Debug: window.sceneFX.{reward,viral,tier,rewind,reduced,info} */
(()=>{
'use strict';
const MO={ease:{out:'cubic-bezier(.16,.86,.24,1)',snap:'cubic-bezier(.34,1.56,.64,1)',inout:'cubic-bezier(.65,0,.35,1)'},dur:{fast:160,med:320,slow:640}};
const mq=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};
const RM=()=>mq.matches||document.documentElement.dataset.moReduced==='1';
const q=s=>document.querySelector(s);
const T=()=>performance.now();
const easeOut=t=>1-Math.pow(1-t,4);
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const P=()=>S()?.player||null;
const call=(name,...a)=>{try{const f=window[name];return typeof f==='function'?f(...a):undefined}catch{return undefined}};
const fmtN=v=>{try{return fmt(Math.round(v))}catch{return String(Math.round(v))}};
const money=v=>{v=Math.round(v);try{if(typeof localMoney==='function')return localMoney(v)}catch{}try{return moneyDisplay(v)}catch{return '$'+v}};
const cash=()=>{try{if(typeof currentCash48==='function')return Number(currentCash48())||0}catch{}return Number(P()?.money)||0};
const tierName=f=>{try{return fameTier(f)}catch{return''}};
const levelInfo=xp=>{try{const f=window.SCENE_DIRECTOR157?.level;if(f)return f(xp)}catch{}const need=120;return{level:Math.floor(xp/need)+1,into:xp%need,need,percent:Math.round((xp%need)/need*100)}};
const escH=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const mstore=()=>{const s=S();if(!s)return{};if(!s.motionFX||typeof s.motionFX!=='object')s.motionFX={};return s.motionFX};
const persist=()=>{try{save()}catch{}};
const anim=(el,kf,o)=>{if(!el||!el.animate)return null;try{return el.animate(kf,o)}catch{return null}};
const layer=()=>{let l=document.getElementById('mo-layer');if(!l){l=document.createElement('div');l.id='mo-layer';l.className='mo-layer';document.body.appendChild(l)}return l};
const emit=(n,d={})=>{try{window.dispatchEvent(new CustomEvent('scenefx:'+n,{detail:d}))}catch{}};
const vibrate=p=>{try{if(!RM())navigator.vibrate?.(p)}catch{}};

/* ---------------- action point ---------------- */
let lastTap={x:innerWidth/2,y:innerHeight*.55,t:0};
document.addEventListener('pointerdown',e=>{lastTap={x:e.clientX,y:e.clientY,t:T()}},{capture:true,passive:true});
const origin=()=>T()-lastTap.t<6000?lastTap:{x:innerWidth/2,y:innerHeight*.55,t:0};

/* ---------------- blocking surfaces (rewards wait until they close) ---------------- */
const modalEl=()=>document.getElementById('modal');
function blocked(){
  const m=modalEl();
  return Boolean((m&&m.firstElementChild)||document.getElementById('scene-overlay157')||q('.scene-cinematic148')||q('.mo-rewind')||q('.mo-tierup'));
}

/* ---------------- HUD fields ---------------- */
const FIELDS={
  followers:{get:()=>Number(P()?.followers)||0,label:'followers',fly:()=>q('.topbar .meta')},
  money:{get:cash,label:'',fly:()=>q('.topbar .meta .mo-mm')||q('.topbar .meta')},
  gems:{get:()=>Number(P()?.gems)||0,label:'◆',fly:()=>q('.hudrow .gems')},
  fame:{get:()=>Number(P()?.fame)||0,label:'fame',fly:()=>q('.hudrow .hudfame')},
  xp:{get:()=>Number(P()?.xp)||0,label:'XP',fly:()=>q('.xptrack')}
};
const KEYS=Object.keys(FIELDS);
const target={},shown={},tw={};let owner='',raf=0,lastLevel=0;
function chipText(k,d){const s=d>0?'+':'−',a=Math.abs(d);if(k==='money')return `${s}${money(a)}`;if(k==='followers')return `${s}${fmtN(a)} followers`;if(k==='gems')return `${s}${a} ◆`;if(k==='fame')return `${s}${a} fame`;return `${s}${a} XP`}
function tween(k,to,{delay=0,dur=0}={}){
  const from=shown[k];if(RM()||from===to){shown[k]=to;delete tw[k];return}
  const mag=Math.abs(to-from);dur=dur||(k==='money'?1:Math.min(1500,700+Math.log10(mag+1)*260));if(k==='money')flapFrom=money(from);
  tw[k]={from,to,start:T()+delay,dur};kick();
}
function kick(){if(!raf)raf=requestAnimationFrame(frame)}
function frame(now){
  raf=0;let live=false;
  const done=[];for(const k of Object.keys(tw)){const t=tw[k];if(now<t.start){live=true;continue}const p=Math.min(1,(now-t.start)/t.dur);shown[k]=t.from+(t.to-t.from)*easeOut(p);if(p<1)live=true;else{shown[k]=t.to;delete tw[k];done.push([k,t.to-t.from])}}
  paint();done.forEach(([k,d])=>landed(k,d));if(live)kick();
}
let flapFrom='';
function flap(){const box=q('.topbar .meta .mo-mm');if(!box||!flapFrom||RM()){flapFrom='';return}const chars=[...box.children],old=[...flapFrom];flapFrom='';let n=0;for(let i=chars.length-1,j=old.length-1;i>=0;i--,j--){if(old[j]===chars[i].textContent)continue;anim(chars[i],[{transform:'rotateX(-95deg)',opacity:.3},{transform:'rotateX(12deg)',opacity:1,offset:.7},{transform:'rotateX(0)'}],{duration:MO.dur.med+40,delay:n*45,easing:MO.ease.out,fill:'backwards'});n++}}
function landed(k,d){
  if(k==='money'){flap();emit('money',{delta:d})}
  if(k==='gems'&&d<0)emit('gems-spent',{delta:d});
  const el=k==='followers'||k==='money'?q('.topbar .meta'):k==='xp'?q('.levelbadge'):k==='gems'?q('.hudrow .gems b'):q('.hudrow .hudfame b');
  if(!el||RM())return;
  anim(el,[{transform:'scale(1)'},{transform:'scale(1.16)',offset:.35},{transform:'scale(1)'}],{duration:MO.dur.med+80,easing:MO.ease.snap});
  if(k!=='xp'&&k!=='followers'&&k!=='money'){const chip=el.parentElement;chip&&anim(chip,[{transform:'translateY(0)'},{transform:'translateY(-2px)',offset:.4},{transform:'translateY(0)'}],{duration:MO.dur.med,easing:MO.ease.out})}
}
function setText(el,t){if(el&&el.textContent!==t)el.textContent=t}
function paint(){
  const p=P();if(!p||!owner)return;
  const meta=q('.topbar .meta');
  if(meta){const fo=`${fmtN(shown.followers)} followers`,mo=money(shown.money),tier=tierName(p.fame),tierPart=tier==='Unknown'?'':` · ${tier}`,want=`${fo}${tierPart} · ${mo}`;if(meta.textContent!==want||!meta.querySelector('.mo-mm'))meta.innerHTML=`<span class="mo-mf">${escH(fo)}</span>${tierPart?` · ${escH(tier)}`:''} · <span class="mo-mm">${[...mo].map(c=>`<span class="mo-ch">${escH(c)}</span>`).join('')}</span>`}
  setText(q('.youstats>div:nth-child(2) b'),fmtN(shown.followers));
  setText(q('.hudrow .gems b'),String(Math.round(shown.gems)));
  setText(q('.hudrow .hudfame b'),String(Math.round(shown.fame)));
  const li=levelInfo(Math.round(shown.xp));
  const bar=q('.xptrack i');if(bar){const v=String((li.percent/100).toFixed(4));if(bar.style.getPropertyValue('--mo-xpp')!==v)bar.style.setProperty('--mo-xpp',v)}
  setText(q('.xptext'),`${li.into}/${li.need} XP`);
  const badge=q('.levelbadge');if(badge){setText(badge,`LVL ${li.level}`);if(lastLevel&&li.level>lastLevel&&!RM())anim(badge,[{transform:'scale(1)'},{transform:'scale(1.5)',offset:.3},{transform:'scale(1)'}],{duration:520,easing:MO.ease.snap});lastLevel=li.level}
  decorate();
}
/* ---------- deltas → chips + banner ---------- */
let pend={},pendTimer=0;
function queueDelta(k,d){pend[k]=(pend[k]||0)+d;clearTimeout(pendTimer);pendTimer=setTimeout(flushDeltas,140)}
function flushDeltas(){
  const deltas=pend;pend={};const ks=KEYS.filter(k=>deltas[k]);if(!ks.length)return;
  const o=origin(),recent=T()-lastTap.t<6000;
  const passive=!recent&&ks.every(k=>k==='followers'&&Math.abs(deltas[k])<5);
  if(passive)return;
  if(!RM())ks.forEach((k,i)=>fly(k,deltas[k],o,i));
  emit('deltas',{deltas,recent});
  const significant=ks.some(k=>k!=='followers')||Math.abs(deltas.followers||0)>=5;
  if(significant)banner(deltas);
}
function fly(k,d,o,i){
  const tgt=FIELDS[k].fly();const L=layer();const el=document.createElement('div');
  el.className=`mo-fly k-${k}${d<0?' neg':''}`;el.textContent=chipText(k,d);L.appendChild(el);
  const w=el.offsetWidth||90,h=el.offsetHeight||26;
  let tx=innerWidth/2,ty=20;if(tgt){const r=tgt.getBoundingClientRect();tx=r.left+Math.min(r.width,160)/2;ty=Math.max(10,r.top+r.height/2)}
  const sx=Math.max(8,Math.min(innerWidth-w-8,o.x-w/2+(i%2?18:-18)*(i?1:0))),sy=Math.max(60,o.y-h/2-i*30);
  const ex=tx-w/2,ey=ty-h/2,mx=(sx+ex)/2+(i%2?40:-40),my=Math.min(sy,ey)-40;
  const a=anim(el,[
    {transform:`translate3d(${sx}px,${sy}px,0) scale(.4)`,opacity:0},
    {transform:`translate3d(${sx}px,${sy-26}px,0) scale(1.12)`,opacity:1,offset:.18},
    {transform:`translate3d(${sx}px,${sy-30}px,0) scale(1)`,opacity:1,offset:.32},
    {transform:`translate3d(${mx}px,${my}px,0) scale(.85)`,opacity:1,offset:.68},
    {transform:`translate3d(${ex}px,${ey}px,0) scale(.45)`,opacity:0}
  ],{duration:1050,delay:i*110,easing:MO.ease.inout,fill:'both'});
  if(a)a.onfinish=()=>el.remove();else el.remove();
}
let bannerEl=null,bannerTimer=0,bannerSum={};
function banner(deltas){
  const ord=['followers','fame','xp','money','gems'];
  if(bannerEl&&bannerEl.isConnected&&bannerEl.style.opacity==='1'){for(const k of ord)if(deltas[k])bannerSum[k]=(bannerSum[k]||0)+deltas[k]}else bannerSum={...deltas};
  if(!bannerEl){bannerEl=document.createElement('div');bannerEl.id='mo-banner';document.body.appendChild(bannerEl)}
  const head=q('.topbar');const top=head?Math.max(8,Math.min(head.getBoundingClientRect().bottom+8,180)):12;
  const fresh=bannerEl.style.opacity!=='1';
  bannerEl.style.top=top+'px';
  const parts=ord.filter(k=>bannerSum[k]).map(k=>{const d=bannerSum[k],s=d>0?'+':'−',a=Math.abs(d);const val=k==='money'?money(a):k==='followers'?fmtN(a):String(a);const lbl=k==='money'?'cash':k==='gems'?'diamonds':FIELDS[k].label;return `<span class="${d<0?'neg':''}"><b>${s}${escH(val)}</b> ${escH(lbl)}</span>`});
  const pos=ord.filter(k=>bannerSum[k]>0).length>=ord.filter(k=>bannerSum[k]<0).length;
  bannerEl.innerHTML=`<small>${pos?'OUTCOME · NICE':'OUTCOME · OUCH'}</small><div class="mo-row">${parts.join('')}</div>`;
  bannerEl.style.opacity='1';bannerEl.style.transform='translate(-50%,0)';
  if(fresh&&!RM()){anim(bannerEl,[{transform:'translate(-50%,-140%)',opacity:0},{transform:'translate(-50%,0)',opacity:1}],{duration:MO.dur.slow,easing:MO.ease.snap});
    [...bannerEl.querySelectorAll('.mo-row span')].forEach((s,i)=>anim(s,[{transform:'translateY(8px) scale(.9)',opacity:0},{transform:'none',opacity:1}],{duration:MO.dur.med,delay:160+i*70,easing:MO.ease.out,fill:'backwards'}))}
  clearTimeout(bannerTimer);bannerTimer=setTimeout(()=>{if(!bannerEl)return;const el=bannerEl;const done=()=>{el.style.opacity='0';el.style.transform='translate(-50%,-140%)'};const a=RM()?null:anim(el,[{transform:'translate(-50%,0)',opacity:1},{transform:'translate(-50%,-60%)',opacity:0}],{duration:MO.dur.med,easing:MO.ease.inout});if(a)a.onfinish=done;else done()},2600);
}

/* ---------------- sync: state → display ---------------- */
function sync(){
  const p=P();
  if(!p){owner='';return}
  const id=`${p.handle}|${p.name}`;
  if(owner!==id){owner=id;for(const k of KEYS){target[k]=shown[k]=FIELDS[k].get()}lastLevel=levelInfo(shown.xp).level;tierSync(true);dayEnsure();paint();return}
  const isBlocked=blocked();
  if(!isBlocked){
    let flew=false;
    for(const k of KEYS){const v=FIELDS[k].get();if(v!==target[k]){const d=v-target[k],old=target[k];target[k]=v;
      if(k==='followers'&&d>=Math.max(60,old*.2)&&T()-viralAt>15000){viral({delta:d,natural:'followers'});tween(k,v,{dur:1800,delay:200});continue}
      tween(k,v,{delay:RM()?0:620});queueDelta(k,d);flew=true;
      if(k==='xp'){const bar=q('.xptrack');if(bar&&!RM()){bar.classList.remove('mo-filling');requestAnimationFrame(()=>bar.classList.add('mo-filling'));setTimeout(()=>bar.classList.remove('mo-filling'),1700)}}}}
    tierSync(false);
  }
  paint();
}

/* ---------------- calmer live counters ---------------- */
const lastBump=new WeakMap();
function calmBumps(recs){
  const hits=[];
  for(const r of recs){const el=r.target;if(el.nodeType===1&&el.classList.contains('countbump')){el.classList.remove('countbump');hits.push(el)}}
  if(!hits.length||RM())return;
  const now=T(),vh=innerHeight;let n=0;
  for(const el of hits){if(n>=4)break;if(now-(lastBump.get(el)||0)<3200)continue;const r=el.getBoundingClientRect();if(r.bottom<0||r.top>vh||!r.width)continue;lastBump.set(el,now);
    anim(el,[{transform:'translateY(.45em)',opacity:.25},{transform:'translateY(0)',opacity:1}],{duration:MO.dur.med,delay:n*70,easing:MO.ease.out,fill:'backwards'});n++}
}

/* ---------------- header decorations (tier chip + ring) ---------------- */
const TIERS=[{name:'Unknown',blurb:''},{name:'Rising',blurb:'People are starting to say your name. Gold is creeping into your HUD.'},{name:'Famous',blurb:'Rooms go quiet when you walk in. Your profile ring just turned gold.'},{name:'Icon',blurb:'You are the main character now. Holographic everything.'}];
let curTier=0,debugTier=null;
function decorate(){
  const wm=q('.topbar .scene-wordmark');
  if(wm){let c=wm.querySelector('.mo-tierchip');if(!c){c=document.createElement('span');c.className='mo-tierchip';wm.appendChild(c)}const t=TIERS[curTier].name.toUpperCase(),h=`<i>${curTier?'✓':'·'}</i>${t}`;if(c.dataset.t!==t){c.innerHTML=h;c.dataset.t=t}}
  const av=q('.youidentity>.youavatar');if(av&&!av.parentElement.classList.contains('mo-ringwrap')){const w=document.createElement('span');w.className='mo-ringwrap';av.replaceWith(w);w.appendChild(av)}
}
function computeTier(){const p=P();if(!p)return 0;const f=Number(p.fame)||0,L=levelInfo(Number(p.xp)||0).level;return f>=180||L>=16?3:f>=80||L>=9?2:f>=15||L>=4?1:0}
function applyTier(t){curTier=t;document.documentElement.dataset.moTier=String(t);const c=q('.mo-tierchip');if(c)c.dataset.t=''}
function tierSync(initial){
  if(!P())return;const m=mstore();const t=debugTier??computeTier();
  if(initial||!Number.isFinite(m.tier)){m.tier=Number.isFinite(m.tier)&&!initial?m.tier:t;applyTier(t);if(m.tier!==t){m.tier=t}persist();return}
  if(t>m.tier){m.tier=t;persist();applyTier(t);tierUp(t)}else if(t<m.tier){m.tier=t;persist();applyTier(t)}else if(curTier!==t)applyTier(t);
}
function seal(){return `<svg viewBox="0 0 120 120" aria-hidden="true"><defs><linearGradient id="mo-sg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".35" stop-color="var(--mo-accent)"/><stop offset="1" stop-color="var(--mo-accent-2)"/></linearGradient></defs><path fill="url(#mo-sg)" d="${(()=>{let d='';for(let i=0;i<24;i++){const a=i/24*Math.PI*2,r=i%2?52:58;d+=(i?'L':'M')+(60+Math.cos(a)*r).toFixed(1)+' '+(60+Math.sin(a)*r).toFixed(1)}return d+'Z'})()}"/><circle cx="60" cy="60" r="40" fill="#0b0b10" opacity=".9"/><path d="M42 61l12 12 25-27" fill="none" stroke="url(#mo-sg)" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg><div class="shine"></div>`}
function tierUp(t,debug=false){
  const info=TIERS[t]||TIERS[1];q('.mo-tierup')?.remove();
  const root=document.createElement('div');root.className='mo-tierup';root.setAttribute('role','dialog');root.setAttribute('aria-label',`New tier: ${info.name}`);
  root.innerHTML=`<div class="wrap"><div class="mo-shock"></div><div class="mo-seal">${seal()}</div><div class="line"><small>NEW FAME TIER</small></div><div class="line"><h2>${escH(info.name)}</h2></div><div class="line"><p>${escH(info.blurb)}</p></div><div class="line"><button type="button">Own it</button></div></div>`;
  document.body.appendChild(root);vibrate([20,60,40]);
  const close=()=>{if(!root.isConnected)return;const a=RM()?null:anim(root,[{opacity:1},{opacity:0}],{duration:MO.dur.med,easing:MO.ease.out});const fin=()=>{root.remove();shineHud();emit('tier-closed',{tier:t,name:info.name,debug})};if(a)a.onfinish=fin;else fin()};
  root.querySelector('button').onclick=close;root.addEventListener('click',e=>{if(e.target===root)close()});setTimeout(close,6500);
  root.style.opacity='1';
  if(RM())return;
  anim(root,[{opacity:0},{opacity:1}],{duration:MO.dur.med,easing:MO.ease.out});
  const s=root.querySelector('.mo-seal');
  anim(s,[{transform:'scale(3.2) rotate(-28deg)',opacity:0},{transform:'scale(.86) rotate(4deg)',opacity:1,offset:.55},{transform:'scale(1.04) rotate(-1deg)',offset:.78},{transform:'scale(1) rotate(0)'}],{duration:760,delay:180,easing:MO.ease.inout,fill:'backwards'});
  anim(root.querySelector('.mo-shock'),[{transform:'translateY(-60px) scale(.6)',opacity:0},{transform:'translateY(-60px) scale(.9)',opacity:.9,offset:.1},{transform:'translateY(-60px) scale(2.6)',opacity:0}],{duration:800,delay:520,easing:MO.ease.out,fill:'both'});
  anim(root.querySelector('.wrap'),[{transform:'translate(0,0)'},{transform:'translate(-5px,3px)'},{transform:'translate(4px,-2px)'},{transform:'translate(-2px,1px)'},{transform:'translate(0,0)'}],{duration:260,delay:600,easing:'linear'});
  setTimeout(()=>s.classList.add('sweep'),900);
  [...root.querySelectorAll('.line>*')].forEach((el,i)=>anim(el,[{transform:'translateY(18px)',opacity:0},{transform:'none',opacity:1}],{duration:MO.dur.slow,delay:820+i*110,easing:MO.ease.out,fill:'backwards'}));
}
function shineHud(){if(RM())return;document.querySelectorAll('.hudrow>span,.mo-tierchip').forEach((el,i)=>{setTimeout(()=>{el.classList.add('mo-shine');setTimeout(()=>el.classList.remove('mo-shine'),1100)},i*90)});const c=q('.mo-tierchip');c&&anim(c,[{transform:'scale(.6)',opacity:.2},{transform:'scale(1.25)',opacity:1,offset:.5},{transform:'scale(1)'}],{duration:620,easing:MO.ease.snap})}

/* ---------------- going viral ---------------- */
let viralAt=-1e9;
function cityName(){return P()?.city||'Los Angeles'}
function reel(n){
  const s=Math.max(0,Math.round(n)).toLocaleString('en-US');
  return `<span class="mo-reel">+${[...s].map(ch=>/\d/.test(ch)?`<span class="col"><span class="strip" data-d="${ch}">${Array.from({length:30},(_,i)=>`<span>${i%10}</span>`).join('')}</span></span>`:`<span>${ch}</span>`).join('')}<span class="lbl">FOLLOWERS</span></span>`;
}
function spinReel(root){
  [...root.querySelectorAll('.strip')].forEach((st,i,all)=>{const d=+st.dataset.d,end=-(20+d);if(RM()){st.style.transform=`translateY(${end}em)`;return}
    st.style.transform=`translateY(${end}em)`;anim(st,[{transform:'translateY(0)'},{transform:`translateY(${end-.25}em)`,offset:.88},{transform:`translateY(${end}em)`}],{duration:1100+(all.length-i)*160,delay:260,easing:MO.ease.out,fill:'backwards'})});
}
function shake(){if(RM())return;const kf=[{transform:'translate3d(0,0,0)'},{transform:'translate3d(-6px,2px,0)'},{transform:'translate3d(5px,-3px,0)'},{transform:'translate3d(-4px,1px,0)'},{transform:'translate3d(3px,2px,0)'},{transform:'translate3d(-1px,-1px,0)'},{transform:'translate3d(0,0,0)'}];
  ['.topbar','.main'].forEach(s=>anim(q(s),kf,{duration:420,easing:'linear'}))}
function notifStack(items,o={}){
  q('.mo-notifs')?.remove();const box=document.createElement('div');box.className='mo-notifs'+(o.lock?' mo-lock':'');if(o.lock)box.innerHTML='<div class="mo-lockclock"></div>';document.body.appendChild(box);
  const max=o.max||4,clock=box.querySelector('.mo-lockclock');if(clock){const d=new Date();clock.innerHTML=`<b>${d.toLocaleTimeString([],{hour:'numeric',minute:'2-digit'}).replace(/\s?[AP]M/i,'')}</b><span>${escH(o.title||'Your phone is blowing up')}</span>`}
  items.slice(0,max).forEach((it,i)=>setTimeout(()=>{const n=document.createElement('div');n.className='mo-notif';n.innerHTML=`<span class="ic">${it.ic}</span><span class="tx"><b>${escH(it.k)}${o.lock?'<i>now</i>':''}</b>${escH(it.t)}</span>`;if(clock)clock.after(n);else box.prepend(n);if(o.lock&&!RM()){anim(box,[{transform:'translateX(-50%) rotate(0)'},{transform:'translateX(calc(-50% - 3px)) rotate(-1.2deg)'},{transform:'translateX(calc(-50% + 3px)) rotate(1.2deg)'},{transform:'translateX(calc(-50% - 2px)) rotate(-.6deg)'},{transform:'translateX(-50%) rotate(0)'}],{duration:260,delay:120,easing:'linear'});vibrate(30)}
    if(!RM())anim(n,[{transform:'translateY(-120%) scale(.96)',opacity:0},{transform:'translateY(4px) scale(1)',opacity:1,offset:.7},{transform:'none',opacity:1}],{duration:MO.dur.slow,easing:MO.ease.snap});
    [...box.querySelectorAll('.mo-notif')].forEach((c,j)=>{c.style.transform=`scale(${1-j*(o.lock?.025:.04)})`;c.style.opacity=String(1-j*(o.lock?.1:.18))})},RM()?0:i*(o.gap||360)));
  setTimeout(()=>{const a=RM()?null:anim(box,[{transform:'translateX(-50%)',opacity:1},{transform:'translate(-50%,-30px)',opacity:0}],{duration:MO.dur.med,easing:MO.ease.inout});const f=()=>box.remove();if(a)a.onfinish=f;else f()},o.hold||4200);
}
function viral(opts={}){
  /* Real numbers only (Gameplay Logic supplies them): opts.delta = real follower gain, opts.views = real views,
     opts.likes = real likes, opts.likedBy = real celeb names who liked, opts.repostBy = real account that reposted.
     No invented ranks, reposts or likers. Max one viral card per in-game day. */
  const p=P(),day=Number(S()?.sceneDay)||0,m0=mstore();if(m0.viralDay===day&&!opts.force)return null;m0.viralDay=day;persist();
  viralAt=T();emit('viral',opts);
  const delta=Math.round(Number(opts.delta)||0),views=Math.round(Number(opts.views)||0),likes=Math.round(Number(opts.likes)||0);
  const city=opts.city||cityName();
  q('.mo-trend')?.remove();
  vibrate([40,30,40,30,80]);shake();
  const liked=(Array.isArray(opts.likedBy)?opts.likedBy:[]).filter(Boolean);
  const items=[{ic:'🔥',k:'TAKING OFF',t:views?`${fmtN(views)} views and climbing`:`Your post is moving fast in ${city}`}];
  if(liked.length)items.push({ic:'♥',k:'LIKES',t:likes>liked.length?`${liked[0]} and ${fmtN(likes-1)} others liked your post`:`${liked[0]} liked your post`});
  else if(likes)items.push({ic:'♥',k:'LIKES',t:`${fmtN(likes)} likes on your post`});
  if(opts.repostBy)items.push({ic:'↻',k:'REPOST',t:`${opts.repostBy} reposted you`});
  if(delta>0)items.push({ic:'＋',k:'FOLLOWERS',t:`+${fmtN(delta)} new followers`});
  notifStack(items);
  const root=document.createElement('div');root.className='mo-trend';root.setAttribute('aria-live','polite');
  root.innerHTML=`<div class="mo-flash"></div><div class="card"><small>YOU'RE GOING VIRAL</small><h2>🔥 ${views?fmtN(views)+' views':'Taking off'}</h2><h3>in ${escH(city)}</h3>${delta>0?reel(delta):''}</div>`;
  document.body.appendChild(root);spinReel(root);
  const card=root.querySelector('.card'),flash=root.querySelector('.mo-flash');
  if(!RM()){
    anim(card,[{transform:'scale(2.4) rotate(-6deg)',opacity:0},{transform:'scale(.92) rotate(1deg)',opacity:1,offset:.55},{transform:'scale(1.03)',offset:.8},{transform:'scale(1) rotate(0)'}],{duration:620,delay:120,easing:MO.ease.inout,fill:'backwards'});
    anim(flash,[{opacity:0},{opacity:1,offset:.15},{opacity:0}],{duration:900,delay:380,easing:MO.ease.out});
    setTimeout(()=>anim(card,[{transform:'translate(0,0)'},{transform:'translate(-7px,4px)'},{transform:'translate(6px,-3px)'},{transform:'translate(-3px,2px)'},{transform:'translate(0,0)'}],{duration:240,easing:'linear'}),470);
  }
  setTimeout(()=>{const a=RM()?null:anim(card,[{transform:'none',opacity:1},{transform:'translateY(-40px) scale(.9)',opacity:0}],{duration:MO.dur.med+80,easing:MO.ease.inout,fill:'forwards'});const f=()=>root.remove();if(a)a.onfinish=f;else f()},opts.hold||3400);
  return {delta,views,city};
}
const rnd=(a,b)=>a+Math.random()*(b-a);
/* natural hooks: viral push resource, 🔥 gig/story outcome cards, a player post whose views spike */
function scanViral(){
  const s=S();if(!s?.player)return;const m=mstore();m.seenViral=Array.isArray(m.seenViral)?m.seenViral:[];
  const now=T();if(now-viralAt<15000)return;
  const mem=(s.memory||[]).find(x=>x&&/viral/.test(String(x.type||''))&&Date.now()-(x.at||0)<60000&&!m.seenViral.includes(x.id));
  if(mem){m.seenViral.unshift(mem.id);m.seenViral=m.seenViral.slice(0,60);persist();if(!blocked()){viral({natural:'viral_push'})}return}
  const fol=Math.max(1,Number(s.player.followers)||1);
  for(const p of (s.posts||[]).filter(x=>x.authorId==='player').slice(0,6)){if(m.seenViral.includes(p.id))continue;let v=0;try{v=metricsFor(p).views}catch{}if(v>=Math.max(150,fol*2.2)){m.seenViral.unshift(p.id);m.seenViral=m.seenViral.slice(0,60);persist();if(!blocked()){let lk=0;try{lk=Number(metricsFor(p).likes)||0}catch{}viral({natural:'post',postId:p.id,views:v,likes:lk,text:String(p.text||'')})}return}}
}
function watchModalForViral(){
  const m=modalEl();if(!m)return;
  new MutationObserver(()=>{const halo=m.querySelector('.outcomehalo');if(halo&&/🔥/.test(halo.textContent)&&!halo.dataset.mo&&T()-viralAt>8000){halo.dataset.mo='1';const d=FIELDS.followers.get()-(target.followers||0);setTimeout(()=>viral({natural:'gig',delta:d>0?d:undefined}),450)}}).observe(m,{childList:true,subtree:true});
}

/* ---------------- Story Rewind ---------------- */
function snapshot(){const p=P(),s=S();return{day:Number(s?.sceneDay)||0,at:Date.now(),followers:Number(p?.followers)||0,money:cash(),fame:Number(p?.fame)||0,xp:Number(p?.xp)||0,gems:Number(p?.gems)||0,city:p?.city||'',cities:[p?.city||'']}}
function dayEnsure(){const m=mstore(),s=S();if(!s?.player)return;const d=Number(s.sceneDay)||0;if(!m.dayStart||m.dayStart.day!==d){m.dayStart=snapshot();persist()}}
function trackCity(){const m=mstore(),c=P()?.city;if(!m.dayStart||!c)return;m.dayStart.cities=m.dayStart.cities||[];if(!m.dayStart.cities.includes(c)){m.dayStart.cities.push(c);persist()}}
function buildRecap(ctx={}){
  const s=S(),p=P();if(!s||!p)return null;dayEnsure();const st=mstore().dayStart||snapshot(),since=st.at||0,day=st.day;
  const dayPosts=(s.posts||[]).filter(x=>Number(x.sceneDay)===day||(x.createdAt>=since));
  const score=x=>{try{return metricsFor(x).views}catch{return 0}};
  const mine=dayPosts.filter(x=>x.authorId==='player').sort((a,b)=>score(b)-score(a));
  const top=(mine[0]||dayPosts.filter(x=>x.authorId!=='player').sort((a,b)=>score(b)-score(a))[0])||null;
  let topPost=null;if(top){let m={};try{m=metricsFor(top)}catch{}const a=top.authorId==='player'?{name:p.name}:(()=>{try{return byId(top.authorId)}catch{return null}})();topPost={mine:top.authorId==='player',text:String(top.text||'').slice(0,140),author:a?.name||'',views:m.views||0,likes:m.likes||0}}
  const counts={};const bump=(id,n=1,why='')=>{if(!id)return;const c=counts[id]||(counts[id]={n:0,why:new Set()});c.n+=n;if(why)c.why.add(why)};
  for(const e of s.memory||[]){if(!e||(e.at||0)<since)continue;if(e.celebrityId)bump(e.celebrityId,1,/dm|message/i.test(e.type)?'DMs':/like/.test(e.type)?'likes':/comment|reply/.test(e.type)?'comments':/follow/.test(e.type)?'follows':'moments')}
  for(const d of s.dms||[]){const n=(d.messages||[]).filter(m=>(m.at||0)>=since).length;if(n)bump(d.id,n,'DMs')}
  for(const n of s.notifications||[]){if((n.at||0)>=since&&n.celebrityId)bump(n.celebrityId,1,'notifications')}
  const people=Object.entries(counts).map(([id,c])=>{let a=null;try{a=byId(id)}catch{}return a&&a.type!=='player'?{id,name:a.name,n:c.n,why:[...c.why].slice(0,2).join(' + ')}:null}).filter(Boolean).sort((a,b)=>b.n-a.n).slice(0,3);
  const cities=[...new Set([...(st.cities||[]),p.city].filter(Boolean))];
  const nowCash=cash();
  return{day,nextDay:day+1,title:String(ctx.title||''),choice:String(ctx.choice||''),d:{followers:p.followers-st.followers,money:nowCash-st.money,fame:p.fame-st.fame,xp:p.xp-st.xp,gems:(p.gems||0)-st.gems},followers:p.followers,topPost,people,cities,tier:TIERS[curTier].name};
}
function hookDay(){
  const base=globalThis.SCENE_advanceDay;if(typeof base!=='function'||base.__mo)return;
  const w=function(ctx={}){let recap=null;try{recap=buildRecap(ctx)}catch(e){console.warn('motion recap',e)}const r=base.apply(this,arguments);try{if(recap){const m=mstore();m.pendingRewind=recap;m.dayStart=snapshot();persist();rewindDue=0}}catch{}return r};
  w.__mo=true;globalThis.SCENE_advanceDay=w;if(globalThis.SCENE_DAY92)try{globalThis.SCENE_DAY92.advance=w}catch{}
}
let rewindDue=0;
function maybeRewind(){
  const m=mstore();if(!m.pendingRewind||q('.mo-rewind'))return;
  if(blocked()){rewindDue=0;return}
  if(!rewindDue){rewindDue=T()+1700;return}
  if(T()<rewindDue)return;
  const r=m.pendingRewind;m.pendingRewind=null;persist();rewindDue=0;openRewind(r);
}
const GRADS=['radial-gradient(circle at 20% 15%,#ff4fa3,transparent 55%),radial-gradient(circle at 85% 80%,#6b4bff,transparent 55%),#14051f',
 'radial-gradient(circle at 80% 10%,#1fe0a0,transparent 50%),radial-gradient(circle at 10% 90%,#1a5bff,transparent 60%),#031512',
 'radial-gradient(circle at 15% 85%,#ffb21f,transparent 55%),radial-gradient(circle at 90% 15%,#ff3d3d,transparent 50%),#1c0a02',
 'radial-gradient(circle at 85% 85%,#c04bff,transparent 55%),radial-gradient(circle at 10% 10%,#ff7ac6,transparent 50%),#14031a',
 'radial-gradient(circle at 50% 0%,#36d1ff,transparent 55%),radial-gradient(circle at 50% 100%,#ffe066,transparent 50%),#030f1a'];
function sign(n,f=v=>fmtN(v)){return (n>=0?'+':'−')+f(Math.abs(n))}
function avHtml(id){try{return av(byId(id))}catch{return''}}
function rewindCards(r){
  const cards=[];
  cards.push(`<div class="eyebrow ln">STORY REWIND</div><h1 class="ln">Day ${r.day+1}</h1><h1 class="ln" style="opacity:.55">wrapped.</h1><p class="ln">Here's how today played out.</p>`);
  cards.push(`<div class="eyebrow ln">YOUR AUDIENCE</div><h1 class="ln" data-count="${r.d.followers}">${sign(0)}</h1><h2 class="ln">followers today</h2><p class="ln">You end the day at <b>${fmtN(r.followers)}</b>. Status: <b>${escH(r.tier)}</b>.</p><div class="mo-rw-chips ln">${[['fame',r.d.fame,v=>String(v)],['XP',r.d.xp,v=>String(v)],['cash',r.d.money,v=>money(v)],['diamonds',r.d.gems,v=>String(v)]].filter(x=>x[1]).map(x=>`<span>${sign(x[1],x[2])} ${x[0]}</span>`).join('')||'<span>Quiet day on the stats</span>'}</div>`);
  if(r.topPost)cards.push(`<div class="eyebrow ln">${r.topPost.mine?'YOUR TOP POST':'THE POST EVERYONE SAW'}</div><h1 class="ln mid">${fmtN(r.topPost.views)} views</h1><div class="mo-rw-quote ln">“${escH(r.topPost.text||'…')}”<em>${escH(r.topPost.author)} · ♥ ${fmtN(r.topPost.likes)}</em></div>`);
  cards.push(r.people.length?`<div class="eyebrow ln">WHO WAS IN YOUR ORBIT</div><h1 class="ln mid">${escH(r.people[0].name.split(' ')[0])} kept showing up.</h1><div class="mo-rw-people">${r.people.map(x=>`<div class="ln">${avHtml(x.id)}<span><b>${escH(x.name)}</b><small>${x.n} interaction${x.n===1?'':'s'}${x.why?' · '+escH(x.why):''}</small></span></div>`).join('')}</div>`:`<div class="eyebrow ln">WHO WAS IN YOUR ORBIT</div><h1 class="ln mid">Nobody yet.</h1><p class="ln">Slide into a DM tomorrow. Celebrities remember who talks to them.</p>`);
  cards.push(`<div class="eyebrow ln">WHERE YOU WERE</div><div class="mo-rw-places">${r.cities.map(c=>`<span class="ln">${escH(c)}</span>`).join('')}</div><p class="ln">Day ${r.nextDay+1} starts now.</p><div class="ln" style="margin-top:26px"><button type="button" class="mo-rw-btn" data-mo-done>Start Day ${r.nextDay+1}</button></div>`);
  return cards;
}
function openRewind(r){
  if(!r)return;q('.mo-rewind')?.remove();
  const cards=rewindCards(r),N=cards.length,DUR=5200;let i=-1,timer=0,start=0;
  const root=document.createElement('div');root.className='mo-rewind';root.setAttribute('role','dialog');root.setAttribute('aria-label',`Day ${r.day+1} rewind`);
  root.innerHTML=`<div class="mo-rw-bars">${cards.map(()=>'<i><b></b></i>').join('')}</div><div class="mo-rw-top"><span>SCENE · DAY ${r.day+1}</span><button type="button" class="mo-rw-skip">Skip ✕</button></div><div class="mo-rw-stage"></div><button class="mo-rw-tap l" aria-label="Previous"></button><button class="mo-rw-tap r" aria-label="Next"></button>`;
  document.body.appendChild(root);
  const stage=root.querySelector('.mo-rw-stage'),bars=[...root.querySelectorAll('.mo-rw-bars i')];
  const close=()=>{clearTimeout(timer);const a=RM()?null:anim(root,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(1.04)'}],{duration:MO.dur.med,easing:MO.ease.out});const f=()=>{root.remove();sync()};if(a)a.onfinish=f;else f()};
  const go=(n,dir=1)=>{
    if(n>=N)return close();if(n<0)n=0;const prev=stage.firstElementChild;i=n;clearTimeout(timer);
    bars.forEach((b,j)=>{b.classList.toggle('done',j<i);const f=b.firstElementChild;f.getAnimations?.().forEach(a=>a.cancel());f.style.transform=j<i?'scaleX(1)':'scaleX(0)'});
    const c=document.createElement('div');c.className='mo-rw-card';c.innerHTML=`<div class="bg" style="background:${GRADS[i%GRADS.length]}"></div>${cards[i]}`;stage.appendChild(c);
    c.querySelector('[data-mo-done]')?.addEventListener('click',e=>{e.stopPropagation();close()});
    if(prev){if(RM())prev.remove();else{const a=anim(prev,[{transform:'translateX(0) scale(1)',opacity:1},{transform:`translateX(${-30*dir}%) scale(.92)`,opacity:0}],{duration:MO.dur.med+60,easing:MO.ease.inout,fill:'forwards'});if(a)a.onfinish=()=>prev.remove();else prev.remove()}}
    if(!RM()){
      anim(c,[{transform:`translateX(${40*dir}%) scale(1.04)`,opacity:0},{transform:'none',opacity:1}],{duration:MO.dur.slow,easing:MO.ease.out});
      anim(c.querySelector('.bg'),[{transform:'scale(1.25) rotate(-4deg)'},{transform:'scale(1) rotate(0)'}],{duration:DUR,easing:'linear',fill:'both'});
      [...c.querySelectorAll('.ln')].forEach((el,j)=>anim(el,[{transform:'translateY(36px)',opacity:0},{transform:'none',opacity:1}],{duration:MO.dur.slow,delay:120+j*90,easing:MO.ease.out,fill:'backwards'}));
      const fill=bars[i].firstElementChild;start=T();anim(fill,[{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:DUR,easing:'linear',fill:'forwards'});
    }else bars[i].firstElementChild.style.transform='scaleX(1)';
    const cnt=c.querySelector('[data-count]');if(cnt){const to=+cnt.dataset.count;if(RM())cnt.textContent=sign(to);else{const t0=T()+260,du=1300;const step=()=>{const p=Math.min(1,Math.max(0,(T()-t0)/du));cnt.textContent=sign(Math.round(to*easeOut(p)));if(p<1&&cnt.isConnected)requestAnimationFrame(step)};requestAnimationFrame(step)}}
    if(i<N-1)timer=setTimeout(()=>go(i+1,1),DUR);
  };
  root.querySelector('.mo-rw-skip').onclick=e=>{e.stopPropagation();close()};
  root.querySelector('.mo-rw-tap.r').onclick=()=>go(i+1,1);
  root.querySelector('.mo-rw-tap.l').onclick=()=>go(i-1,-1);
  document.addEventListener('keydown',function k(e){if(!root.isConnected)return document.removeEventListener('keydown',k);if(e.key==='Escape')close();if(e.key==='ArrowRight')go(i+1,1);if(e.key==='ArrowLeft')go(i-1,-1)});
  if(!RM())anim(root,[{opacity:0},{opacity:1}],{duration:MO.dur.med,easing:MO.ease.out});
  go(0,1);
}

/* ---------------- modal close ghost ---------------- */
function hookCloseModal(){
  const base=window.closeModal;if(typeof base!=='function'||base.__mo)return;
  const w=function(...a){const m=modalEl(),first=m&&m.firstElementChild;
    if(first&&!RM()){try{const g=document.createElement('div');g.className='mo-ghost';const c=first.cloneNode(true);c.querySelectorAll('[id]').forEach(x=>x.removeAttribute('id'));c.removeAttribute('id');g.appendChild(c);document.body.appendChild(g);
      const page=c.matches('.chatpage,.profilepage,.activitypage')?c:null,sheet=c.querySelector('.sheet,.outcomecard'),cur=(sheet&&sheet.style.transform)||'translateY(0)',D=MO.dur.med;
      const a1=anim(g,[{opacity:1},{opacity:0}],{duration:page?D:D-40,easing:MO.ease.out,fill:'forwards',delay:page?80:0});
      if(page)anim(c,[{transform:'translateX(0)'},{transform:'translateX(100%)'}],{duration:D,easing:MO.ease.inout,fill:'forwards'});
      else if(sheet&&sheet.matches('.sheet'))anim(sheet,[{transform:cur},{transform:'translateY(110%)'}],{duration:D,easing:MO.ease.inout,fill:'forwards'});
      else if(sheet)anim(sheet,[{transform:'none'},{transform:'scale(.94)'}],{duration:D-40,easing:MO.ease.inout,fill:'forwards'});
      if(a1)a1.onfinish=()=>g.remove();else g.remove();setTimeout(()=>g.remove(),800)}catch{}}
    return base.apply(this,a)};
  w.__mo=true;window.closeModal=w;
}

/* ---------------- boot ---------------- */
function ready(){try{return typeof render==='function'&&typeof state!=='undefined'&&!document.querySelector('.migrationboot')&&!!document.getElementById('app')}catch{return false}}
function boot(){
  ['mo-css','mo-css2','mo-css3'].forEach(i=>{const c=document.getElementById(i);if(c)document.head.appendChild(c)}); /* keep motion rules last in the cascade */
  const app=document.getElementById('app');
  new MutationObserver(()=>{try{sync()}catch(e){console.warn('motion sync',e)}}).observe(app,{childList:true,subtree:true,characterData:true});
  new MutationObserver(calmBumps).observe(app,{attributes:true,attributeFilter:['class'],subtree:true});
  const m=modalEl();if(m)new MutationObserver(()=>{if(!m.firstElementChild)requestAnimationFrame(sync)}).observe(m,{childList:true});
  new MutationObserver(()=>{if(!document.getElementById('scene-overlay157'))sync()}).observe(document.body,{childList:true});
  watchModalForViral();hookCloseModal();hookDay();
  setInterval(()=>{try{hookDay();hookCloseModal();sync();trackCity();scanViral();maybeRewind()}catch(e){console.warn('motion tick',e)}},300);
  sync();
}
(function wait(n=0){if(ready())return boot();if(n<600)setTimeout(()=>wait(n+1),100)})();

/* ---------------- debug API ---------------- */
window.sceneFX={
  version:'motion-batch1',tokens:MO,
  reward(d={followers:42,fame:2,xp:12}){const p=P();if(!p)return'no player';try{applyEffect(d)}catch{for(const k in d)p[k]=(p[k]||0)+d[k]}persist();sync();return d},
  viral(opts){return viral(opts||{})},
  tier(n=1){n=Math.max(0,Math.min(3,Number(n)||0));debugTier=n;const m=mstore();m.tier=n;applyTier(n);tierUp(n,true);return TIERS[n].name},
  tierAuto(){debugTier=null;tierSync(false);return curTier},
  rewind(){const r=mstore().pendingRewind||buildRecap((()=>{const st=S()||{},l=(st.dayLedger92||[])[0]||(st.storyHistory||[])[0]||null;return l?{title:l.title,choice:l.choice}:{}})());if(!r)return'no player';mstore().pendingRewind=null;openRewind(r);return r},
  reduced(on=true){document.documentElement.dataset.moReduced=on?'1':'0';return RM()},
  _int:{notifStack:(items,o)=>notifStack(items,o),lastViral:()=>viralAt,blocked:()=>blocked(),origin:()=>origin(),layer:()=>layer(),RM,MO,anim,escH,P,S,mstore,persist,fmtN,money},
  info(){return{tier:curTier,shown:{...shown},target:{...target},blocked:blocked(),dayStart:mstore().dayStart,pendingRewind:!!mstore().pendingRewind}}
};
})();
