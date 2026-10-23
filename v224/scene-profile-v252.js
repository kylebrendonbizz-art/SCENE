/* profile252 (SCENE v52): verified reveal, profile redesign, calmer notifications/progress, toast batching.
   Kill switch: window.SCENE_PROFILE252_OFF = true. Adds state.pf252 only; never touches money/saves/registry. */
(function(){
if(window.SCENE_PROFILE252_OFF)return;
const W=window;let ready=false;
function S(){try{return state}catch(e){return null}}
function E(s){try{return esc(s)}catch(e){return String(s??'')}}
function F(n){try{return fmt(n)}catch(e){return String(n)}}
function st(){const s=S();s.pf252=s.pf252||{v:1,trophies:{},dayKey:'',dayFollowers:0,unfollowed:[]};return s.pf252}
function stage(){try{return playerMediaStage129()}catch(e){return'unknown'}}
const STAGE_LABEL={unknown:'UNKNOWN',breakthrough:'BREAKTHROUGH',recognized:'RECOGNIZED',mainstream:'MAINSTREAM'};
function isIcon(p){return (p.fame||0)>=220||(p.followers||0)>=5e6}
const COVERS={Music:['#5b2a86','#e0458b'],Acting:['#1b2a4a','#c8963e'],Fashion:['#2b1630','#d9a6c9'],Creator:['#0f3d3e','#3fd0c9']};
const CITY_TINT={'Los Angeles':'#ff8a3d','New York':'#5aa3ff','London':'#8a9bb0','Paris':'#f0b6c8','Tokyo':'#ff4f7b','Miami':'#2fe0c8'};
function cover(p){const c=COVERS[p.career]||['#2a2140','#6a4cff'],t=CITY_TINT[p.city]||c[1];return `linear-gradient(135deg,${c[0]} 0%,${c[1]} 60%,${t} 100%)`}
function prog(p){const f=(p.fame||0)/80,g=(p.followers||0)/250000;return Math.max(0,Math.min(99,Math.round(Math.max(f,g)*100)))}
function bioFor(p){if(p.bio)return E(p.bio);const c={Music:'Making songs in',Acting:'Chasing roles in',Fashion:'Styling looks in',Creator:'Creating out of'}[p.career]||'New in';return `<span class="pf-auto">${E(c)} ${E(p.city||'the city')}. Just getting started ✦</span>`}
/* ---------- A) verification ---------- */
function checkVerify(){const s=S();if(!s||!s.player)return;const p=s.player;if(p.verified)return;if((p.fame||0)>=80||(p.followers||0)>=250000){p.verified=true;const t=st();t.trophies.verified=t.trophies.verified||Date.now();t.revealPending=true;try{addNotif(`📰 ${p.name} is now verified on SCENE. The blue check is official.`,'world',{channel:'progress'})}catch(e){}try{save()}catch(e){}}}
function reveal(){const t=st();if(!t.revealPending)return;t.revealPending=false;try{save()}catch(e){}
 const d=document.createElement('div');d.id='pf252reveal';const cols=['#4aa3ff','#ffd36b','#ff6fae','#fff','#7cf0c8'];let conf='';for(let i=0;i<28;i++)conf+=`<i style="left:${Math.random()*100}%;background:${cols[i%5]};animation-delay:${(Math.random()*.5).toFixed(2)}s;transform:rotate(${Math.random()*360}deg)"></i>`;
 d.innerHTML=`<div class="pf-flash"></div><div class="pf-conf">${conf}</div><div class="pf-card"><div class="pf-bigcheck">✓</div><b>You're verified ✓</b><span>The blue check is official. Press is already writing about it.</span><button>Nice</button></div>`;
 document.body.appendChild(d);const close=()=>d.remove();d.querySelector('button').onclick=close;setTimeout(close,6500)}
/* celeb co-signs + unfollow on drama */
function coSigns(){const s=S(),t=st();const ids=(s.followedByIds||[]).filter(id=>{const a=byId(id);return a&&a.type==='celeb'});
 for(const id of ids.slice()){const r=s.relations[id];if(r&&(r.tension||0)>=70&&(r.friendship||0)<15){s.followedByIds=s.followedByIds.filter(x=>x!==id);t.unfollowed.push({id,at:Date.now()});try{addNotif(`${byId(id).name} quietly unfollowed you.`,'follow',{celebrityId:id})}catch(e){}}}
 return (s.followedByIds||[]).map(byId).filter(a=>a&&a.type==='celeb')}
/* trophies derived from existing state */
function trophies(){const s=S(),p=s.player,t=st(),mem=s.memory||[],posts=playerPosts();
 let viral=false;try{viral=posts.some(x=>metricsFor(x).likes>=5000||(x.virality||1)>=2.5)}catch(e){}
 const met=mem.find(m=>m.celebrityId&&byId(m.celebrityId))||null;const metName=met?byId(met.celebrityId).name.split(' ')[0]:'';
 const scandal=mem.some(m=>/scandal|drama|leak|beef|backlash/i.test((m.type||'')+' '+(m.text||'')));
 const list=[['post','📝','First post',posts.length>0],['viral','🔥','First viral post',viral],['travel','✈️','First city trip',(s.travelHistory||[]).length>0],['met','🤝',met?`Met ${metName}`:'Meet a celeb',!!met],['verified','✓','Verified',!!p.verified],['scandal','🛡️','Survived a scandal',scandal]];
 list.forEach(x=>{if(x[3]&&!t.trophies[x[0]])t.trophies[x[0]]=Date.now()});return list}
function rival(){const s=S();let best=null;for(const [id,r] of Object.entries(s.relations||{})){if((r.tension||0)>=40&&(!best||r.tension>best.r.tension)){const a=byId(id);if(a)best={a,r}}}return best}
function buzz(){const s=S(),p=s.player,t=st(),key=new Date().toDateString();if(t.dayKey!==key){t.dayKey=key;t.dayFollowers=p.followers||0}
 const gain=Math.max(0,(p.followers||0)-(t.dayFollowers||0));const news=(s.posts||[]).find(x=>x.authorId!=='player'&&new RegExp(String(p.name||'@@').split(' ')[0],'i').test(x.text||''));
 const line=news?String(news.text).slice(0,70):({unknown:'Nobody is talking yet. One good post changes that.',breakthrough:'A few accounts are starting to repost you.',recognized:'Blogs are spelling your name right now.',mainstream:'Everyone has an opinion about you.'}[stage()]);return {gain,line}}
/* ---------- B/C) profile ---------- */
function renderYou252(){const s=S(),p=s.player,posts=playerPosts(),sg=stage(),icon=isIcon(p);
 const ring=icon?'icon':sg;const fans=coSigns(),tr=trophies(),rv=rival(),bz=buzz();
 let pin=null;try{pin=posts.slice().sort((a,b)=>metricsFor(b).likes-metricsFor(a).likes)[0]}catch(e){}
 const tab=st().tab||'posts',shown=tab==='media'?posts.filter(x=>x.media):posts;
 const chk=p.verified?check():`<span class="pf-lock" title="Verified at 80 fame or 250K followers">✓</span><span class="pf-lockhint">${prog(p)}% to verified</span>`;
 const co=fans.length?`<div class="pf-co"><span class="pf-cofaces">${fans.slice(0,3).map(a=>{try{return av(a)}catch(e){return''}}).join('')}</span><span>Followed by <b>${fans.slice(0,2).map(a=>E(a.name.split(' ')[0])).join(', ')}</b>${fans.length>2?` +${fans.length-2}`:''}</span></div>`:'';
 const shelf=`<div class="pf-shelf">${rv?`<span class="pf-tro pf-rival" data-profile="${rv.a.id}">⚔️<b>Rival: ${E(rv.a.name.split(' ')[0])}</b></span>`:''}${tr.map(x=>`<span class="pf-tro ${x[3]?'on':''}">${x[1]}<b>${E(x[2])}</b></span>`).join('')}</div>`;
 const tiles=shown.length?shown.slice(0,30).map(x=>`<button class="pf-tile" data-comments="${x.id}">${x.media?`<img loading="lazy" src="${E(x.media)}" alt="" onerror="this.remove()">`:''}<span>${E(String(x.text||'').slice(0,60))}</span></button>`).join(''):`${'<div class="pf-tile ghost"></div>'.repeat(6)}<div class="pf-ghostmsg">${tab==='media'?'No photos yet. Add one to a post.':'Your first post goes here.'}<button class="btn" data-action="compose">Post something</button></div>`;
 return `<section class="youpage pf252"><div class="pf-cover" style="background:${cover(p)}"><span class="pf-stage">${STAGE_LABEL[sg]||'UNKNOWN'}${icon?' · ICON':''}</span></div>
<div class="pf-head"><div class="pf-av ring-${ring}">${playerAvatarMarkup('youavatar')}</div><div class="youbuttons pf-btns"><button class="btn secondary" data-action="editprofile">Edit</button><button class="btn" data-action="compose">Post</button></div></div>
<div class="pf-name"><strong>${E(p.name)} ${chk}</strong><span>@${E(p.handle)} · ${E(p.career)} · ${E(p.city)}</span></div>
<div class="pf-bio">${bioFor(p)}</div>
<div class="pf-stats"><div><b>${posts.length}</b><span>Posts</span></div><div><b>${F(p.followers)}</b><span>Followers</span></div><div><b>${F(playerFollowingCount())}</b><span>Following</span></div></div>
<div class="pf-chips"><span>⭐ Fame ${p.fame}</span><span>💬 Rep ${p.reputation}</span><span>💵 $${Math.round(p.money).toLocaleString()}</span></div>
${co}
<div class="pf-buzz"><span class="pf-buzzline">🗞️ ${E(bz.line)}</span><b>📈 +${F(bz.gain)} today</b></div>
${shelf}
${pin?`<div class="pf-pin"><span class="pf-pinlbl">📌 PINNED</span>${postHtml(pin,true)}</div>`:''}
<div class="youposttabs pf-tabs"><button class="${tab==='posts'?'on':''}" data-pf252tab="posts">POSTS <span>${posts.length}</span></button><button class="${tab==='media'?'on':''}" data-pf252tab="media">MEDIA</button></div>
<div class="pf-grid">${tiles}</div></section>`}
/* ---------- D) notifications + progress ---------- */
const LOW=/^(UPDATE|WORLD)$/;
function tidyActivity(){const page=document.querySelector('.activitypage');if(!page)return;const inb=page.querySelector('.ff232inbox');if(inb){const h=inb.querySelector('.ff232ih');if(h&&!h.onclick)h.onclick=()=>inb.classList.toggle('pf-open')}
 if(page.dataset.pf252)return;page.dataset.pf252='1';
 const list=page.querySelector('.activitylist');if(!list)return;const rows=[...list.querySelectorAll('.activityrow')];
 if(list.classList.contains('social')){const groups={};rows.forEach(r=>{const k=(r.querySelector('.activitymeta b')||{}).textContent||'';if(/LIKE|COMMENT|REPOST/.test(k)){(groups[k]=groups[k]||[]).push(r)}});
  for(const [k,g] of Object.entries(groups)){if(g.length<2)continue;let n=0;g.forEach(r=>{const m=((r.querySelector('strong')||r).textContent.match(/(\d[\d,.]*)\s*(new|others)?/)||[])[1];n+=parseInt(String(m||'1').replace(/,/g,''))||1});
   const who=`${n} ${n===1?'like':'likes'}`;
   const verb={LIKES:'liked',LIKE:'liked',COMMENTS:'commented on',COMMENT:'commented on',REPOSTS:'reposted',REPOST:'reposted'}[k]||'reacted to';
   g[0].querySelector('strong').textContent=verb==='liked'?`${n} new likes across your posts`:`${n} people ${verb} your posts`;g.slice(1).forEach(r=>r.remove())}}
 else{const s=S(),p=s.player;let next='';try{const q=(s.missions?.quests||[]).find(q=>!q.claimed);next=q?(q.done?'Claim: ':'')+q.text:'Post something people will talk about'}catch(e){}
  const L=lvl(),x=xpInto();const card=document.createElement('div');card.className='pf-progress';
  card.innerHTML=`<div class="pf-plvl"><b>LVL ${L}</b><span>${x}% to LVL ${L+1}</span></div><div class="pf-pbar"><i style="width:${x}%"></i></div><div class="pf-prow"><span>Next unlock</span><b>${p.verified?'Icon status at 220 fame':`Blue check · ${prog(p)}%`}</b></div><div class="pf-prow"><span>Next step</span><b>${E(next)}</b></div>`;
  const stats=page.querySelector('.activitystats');if(stats)stats.replaceWith(card);else list.before(card);
  rows.forEach(r=>{if(LOW.test((r.querySelector('.activitymeta b')||{}).textContent||''))r.classList.add('pf-low')})}
 const all=[...list.querySelectorAll('.activityrow')];if(all.length>5){all.slice(5).forEach(r=>r.classList.add('pf-hide'));const b=document.createElement('button');b.className='pf-seeall';b.textContent=`See all (${all.length})`;b.onclick=()=>{list.querySelectorAll('.pf-hide').forEach(r=>r.classList.remove('pf-hide'));b.remove()};list.appendChild(b)}}
/* toast batching: at most 1 toast per 10s; extras roll into one summary */
let lastToast=0,held=0,holdT=null;
function watchToast(){const el=document.getElementById('toast');if(!el||el.dataset.pf252)return;el.dataset.pf252='1';new MutationObserver(()=>{if(el.classList.contains('hidden')||el.dataset.pfsum)return;const t=Date.now();if(t-lastToast<10000){held++;el.classList.add('hidden');clearTimeout(holdT);holdT=setTimeout(()=>{if(!held)return;el.dataset.pfsum='1';el.textContent=`+${held} more update${held>1?'s':''} in your bell`;el.classList.remove('hidden');held=0;setTimeout(()=>{el.classList.add('hidden');delete el.dataset.pfsum},2600)},10000)}else lastToast=t}).observe(el,{attributes:true,childList:true,attributeFilter:['class']})}
/* ---------- wiring ---------- */
function after(){const s=S();if(!s||!s.player)return;document.body.classList.toggle('pf252-you',s.tab==='you');
 document.querySelectorAll('[data-pf252tab]').forEach(b=>b.onclick=()=>{st().tab=b.dataset.pf252tab;try{save()}catch(e){}render()});
 reveal();watchToast()}
let obs=false;
function wrap(){if(typeof W.render!=='function'||typeof W.renderYou!=='function')return;
 if(!W.renderYou.pf252){const oYou=W.renderYou;W.renderYou=function(){if(W.SCENE_PROFILE252_OFF)return oYou.apply(this,arguments);try{return renderYou252()}catch(e){console.warn('pf252',e);return oYou.apply(this,arguments)}};W.renderYou.pf252=1}
 if(!W.render.pf252){const oRender=W.render;W.render=function(){if(!W.SCENE_PROFILE252_OFF)try{checkVerify()}catch(e){}const r=oRender.apply(this,arguments);if(!W.SCENE_PROFILE252_OFF)try{after()}catch(e){console.warn('pf252',e)}return r};W.render.pf252=1;try{if(S()?.player)W.render()}catch(e){}}
 if(!obs){obs=true;new MutationObserver(()=>{if(!W.SCENE_PROFILE252_OFF)try{tidyActivity()}catch(e){}}).observe(document.body,{childList:true,subtree:true})}}
/* app.js and later patches may (re)define render/renderYou after us, so keep re-wrapping */
setInterval(()=>{if(W.SCENE_PROFILE252_OFF)return;wrap();try{const p=S()?.player;if(p&&!p.verified){checkVerify();if(p.verified)render()}}catch(e){}},1000);
wrap();
})();
