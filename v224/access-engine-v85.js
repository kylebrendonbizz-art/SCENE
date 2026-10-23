/* SCENE v178 — earned celebrity access; once a private line is open, chat stays open */
(()=>{
'use strict';
if(globalThis.SCENE_ACCESS85)return;
const isQa=()=>new URLSearchParams(location.search).get('__dmqa')==='1';
const baseDmState=dmState,baseOpenDm=openDm,baseOpenProfile=openProfile,baseSendDm=sendDm,baseDeliverDmJob=deliverDmJob,baseMaybeFollowBack=maybeFollowBack,baseRender=render,basePersonHtml=personHtml;
function ensureState85(){state.dmAccessIds=Array.isArray(state.dmAccessIds)?state.dmAccessIds:[];state.assistantRequests=state.assistantRequests||{};}

function roster85(){return celebs.filter(a=>!a.custom).slice().sort((a,b)=>(a.reach||0)-(b.reach||0)||a.name.localeCompare(b.name))}
function requiredSceneLevel85(a){if(!a||a.type!=='celeb'||a.custom)return 0;const i=roster85().findIndex(x=>x.id===a.id);return i<0?1:i+1}
function publicTouches85(a){return (state.memory||[]).filter(m=>m.celebrityId===a.id&&['comment_reply','verified_public','verified_comment','event','gig','story_choice','follow_back'].includes(m.type)).length}
function established85(a){if(!a)return false;if((state.dmAccessIds||[]).includes(a.id))return true;const d=(state.dms||[]).find(x=>x.id===a.id);return Boolean(d?.messages?.some(m=>m.from==='me'))}
function relationshipEarned85(a){const r=state.relations?.[a.id]||{};return publicTouches85(a)>=3&&(r.friendship||0)>=24&&(r.trust||0)>=12}
function starterFriend85(a){return Boolean(a&&state?.firstSession148?.friendId===a.id)}
function hasDirectAccess85(a){ensureState85();if(isQa())return true;if(!state?.player||!a||a.type!=='celeb')return false;if(a.custom)return true;if(starterFriend85(a))return true;const r=state.relations?.[a.id]||{};if(r.directAccess||r.unlocked)return true;if(established85(a))return true;if(lvl()>=requiredSceneLevel85(a))return true;if(relationshipEarned85(a))return true;return false}
function nextCelebrity85(){return roster85().find(a=>requiredSceneLevel85(a)>lvl())||null}

function inspect85(id=''){const a=id?byId(id):null,d=id?(state.dms||[]).find(x=>x.id===id):null;return{level:state.player?lvl():0,energy:state.player?.energy??null,access:a?hasDirectAccess85(a):null,requiredLevel:a?requiredSceneLevel85(a):null,credits:d?.replyCredits??0,dms:(state.dms||[]).length,accessIds:[...(state.dmAccessIds||[])]}}
function qaSetup85(){if(new URLSearchParams(location.search).get('__accessqa')!=='1')return null;state=fresh();state.player={name:'QA',handle:'qa',career:'Music',followers:82,following:0,bio:'',avatar:'',money:2500,energy:100,fame:0,reputation:50,city:'Los Angeles',verified:false,xp:0,gems:2,skillPoints:0};state.homeCity='Los Angeles';state.dmAccessIds=[];state.assistantRequests={};state.sceneAccessVersion=1;state.sceneUnlockSeenLevel=1;save();render();return inspect85()}
globalThis.SCENE_ACCESS85={version:85,hasDirectAccess:hasDirectAccess85,requiredLevel:requiredSceneLevel85,publicTouches:publicTouches85,nextCelebrity:nextCelebrity85,inspect:inspect85,qaSetup:qaSetup85};
canAccess=function(a){return hasDirectAccess85(a)};
accessibleCelebs=function(){return celebs.filter(hasDirectAccess85)};
maybeNpcDm=function(){return false};

dmState=function(id){const d=baseDmState(id);d.replyCredits=999;d.pendingPassDraft=null;return d};

function migrate85(){
 state.dmAccessIds=Array.isArray(state.dmAccessIds)?state.dmAccessIds:[];
 state.assistantRequests=state.assistantRequests||{};
 if((state.sceneAccessVersion||0)<2){
  state.dms=(state.dms||[]).filter(d=>{const a=byId(d.id),starter=state?.firstSession148?.friendId===d.id,starterMsg=d.messages?.some(m=>m.kind==='scene-starter148');return a?.custom||starter||starterMsg||d.messages?.some(m=>m.from==='me')});
  for(const d of state.dms||[])if(d.messages?.some(m=>m.from==='me')&&!state.dmAccessIds.includes(d.id))state.dmAccessIds.push(d.id);
  for(const d of state.dms||[]){d.replyCredits=0;d.pendingPassDraft=null;d.queue=[];d.typing=false;d.pending=false;d.replying=false}
  state.notifications=(state.notifications||[]).filter(n=>n.kind!=='dm'||state.dms.some(d=>d.id===n.celebrityId));
  state.sceneUnlockSeenLevel=state.player?lvl():0;
  state.sceneAccessVersion=2;save();
 }
}
migrate85();

function syncUnlocks85(){
 if(!state.player)return;
 const current=lvl();
 if(!Number.isFinite(state.sceneUnlockSeenLevel)){state.sceneUnlockSeenLevel=current;save();return}
 if(current<=state.sceneUnlockSeenLevel)return;
 const from=state.sceneUnlockSeenLevel+1;
 for(let level=from;level<=current;level++){
  const a=roster85()[level-1];
  if(a)addNotif(`Level ${level} access unlocked: ${a.name} is now close enough to message and interact with directly.`,'connection',{celebrityId:a.id});
 }
 state.sceneUnlockSeenLevel=current;save();
}
render=function(){syncUnlocks85();return baseRender()};

maybeFollowBack=function(a){
 if(!a||a.type!=='celeb')return;
 const r=state.relations?.[a.id]||{};
 if(publicTouches85(a)<1&&(r.friendship||0)<15)return;
 return baseMaybeFollowBack(a);
};

function gateCopy85(a){const level=requiredSceneLevel85(a),req=state.assistantRequests?.[a.id],used=req?.lastLevel===lvl();return{level,used,req}}
function openCelebrityGate85(id){
 const a=byId(id);if(!a)return;
 if(hasDirectAccess85(a))return openDm(id);
 const g=gateCopy85(a),next=g.level-lvl();
 showSheet('Private access',`<div class="accessgate"><div class="accesslock">✦</div><div class="eventtag">PRIVATE LINE LOCKED</div><h3>You haven’t earned direct access to ${esc(a.name)} yet.</h3><p>Your profile isn’t established enough to land in their personal inbox. You can still follow them, comment on posts and get noticed publicly — or send a note through their assistant and hope it gets passed along.</p><div class="accessprogress"><span>Level ${lvl()}</span><i><b style="width:${Math.min(100,(lvl()/Math.max(1,g.level))*100)}%"></b></i><span>Level ${g.level}</span></div><div class="accesshint">${next>0?`${next} level${next===1?'':'s'} until guaranteed direct access.`:'A strong public relationship can still open this line early.'}</div><button class="btn blue full" id="assistantrequest" ${g.used?'disabled':''}>${g.used?'Assistant contacted this level':'Send a note to their assistant'}</button><small>${g.used?'Try again after your next level-up.':'No energy is used for this. Their team may ignore it, notice you, or open the line early.'}</small></div>`);
 const b=$('#assistantrequest');if(b)b.onclick=()=>assistantRequest85(a);
}
globalThis.SCENE_openCelebrityGate=openCelebrityGate85;

function assistantRequest85(a){
 ensureState85();
 const prior=state.assistantRequests[a.id]||{};
 if(prior.lastLevel===lvl())return flash('Their assistant already got a note from you this level.');
 const r=state.relations[a.id]||memoryFor(a.id),touches=publicTouches85(a),gap=Math.max(0,requiredSceneLevel85(a)-lvl());
 const chance=clamp(.06+(state.player.fame||0)/650+(r.friendship||0)/260+(r.trust||0)/420+touches*.035+(gap<=1?.14:gap<=3?.06:0),.05,.48),success=Math.random()<chance;
 state.assistantRequests[a.id]={lastLevel:lvl(),at:now(),success};
 remember('assistant_outreach',{celebrityId:a.id,celebrity:a.name,level:lvl(),success});
 if(success){
  if(!state.dmAccessIds.includes(a.id))state.dmAccessIds.push(a.id);
  globalThis.SCENE_KERNEL170?.relationshipSignal?.(a.id,'access_success',{visibility:'private',source:'assistant_outreach',summary:`${a.name}'s team opened a direct line after the player's outreach.`});
  addNotif(`${a.name}'s team passed your name along. Direct messages are now open.`,'connection',{celebrityId:a.id});save();
  showSheet('Their team replied',`<div class="accessgate success"><div class="accesslock">✓</div><div class="eventtag">ACCESS OPENED</div><h3>Your name got through.</h3><p>${esc(a.name)}'s team passed the note along and opened a private line. Once it is open, the conversation stays open.</p><button class="btn blue full" id="openearnedchat">Open chat</button></div>`);$('#openearnedchat').onclick=()=>openDm(a.id);
 }else{
  save();
  showSheet('Assistant response',`<div class="accessgate"><div class="accesslock">…</div><div class="eventtag">NOT YET</div><h3>Your note reached the team.</h3><p>No private line opened this time. Keep showing up publicly, build momentum, and try again after your next level.</p><button class="btn secondary full" id="assistantdone">Got it</button></div>`);$('#assistantdone').onclick=closeModal;
 }
}

personHtml=function(a,locked=false,outlet=false){
 if(outlet)return basePersonHtml(a,false,true);
 const actual=a.type==='celeb'&&!hasDirectAccess85(a),r=state.relations[a.id]||{friendship:0},level=requiredSceneLevel85(a),touches=publicTouches85(a);
 return `<button class="person ${actual?'locked':''}" data-profile="${a.id}">${av(a)}<div class="grow"><strong>${esc(a.name)} ${check()}</strong><span>${esc(a.role)}</span>${actual?`<div class="rel">🔒 Direct access · Level ${level} · ${touches} public interaction${touches===1?'':'s'}</div>`:`<div class="rel">${a.custom?'Custom celebrity · direct access':`${fmt(a.reach)} followers · Connection ${r.friendship||0}%`}</div>`}</div><span>›</span></button>`;
};

openProfile=function(id){
 baseOpenProfile(id);const a=byId(id);if(!a||a.type!=='celeb')return;
 const lock=$('#lockedmsg');if(lock){lock.textContent=`DM locked · Lv ${requiredSceneLevel85(a)}`;lock.onclick=()=>openCelebrityGate85(a.id)}
};

function decorateDmCredits85(id){
 if(isQa()||modal.dataset.dm!==id)return;
 const a=byId(id),wrap=modal.querySelector('.chatcomposerwrap');if(!wrap)return;
 if(starterFriend85(a)){wrap.querySelector('.dmcreditbar')?.remove();modal.querySelector('.dmpassoverlay')?.remove();return}
 const d=dmState(id);let bar=wrap.querySelector('.dmcreditbar');if(!bar){bar=document.createElement('div');bar.className='dmcreditbar';wrap.insertBefore(bar,wrap.firstChild)}
 bar.innerHTML=`<span>Chat pass</span><b>${d.replyCredits||0}/5 replies left</b>`;
 bar.classList.toggle('empty',!(d.replyCredits>0));
}

function showDmPass85(id,continuing=false){
 if(isQa()||modal.dataset.dm!==id)return;
 const a=byId(id),d=dmState(id),page=modal.querySelector('.chatpage');if(!a||starterFriend85(a)||!page||d.replyCredits>0||page.querySelector('.dmpassoverlay'))return;
 const hasHistory=d.messages?.some(m=>m.from==='them');
 page.insertAdjacentHTML('beforeend',`<div class="dmpassoverlay"><div class="dmpasscard"><div class="passicon">⚡</div><h3>${hasHistory||continuing?'Continue chatting':'Start chatting'} with ${esc(a.name)}?</h3><p>${hasHistory?'Keep the momentum going.':'You earned the private line. Open a real conversation.'}</p><div class="passdots"><i></i><i></i><i></i><i></i><i></i></div><button id="buydmreplies"><span>Add 5 replies</span><b>−1 ⚡</b></button><button class="passlater" id="dmpasslater">Not now</button><small>${state.betaMode?'BETA energy stays unlimited, but every 5 replies still uses 1 energy pass.':`You have ${state.player.energy} energy. One pass covers the next 5 replies in this chat.`}</small></div></div>`);
 $('#buydmreplies').onclick=()=>{
  if(state.player.energy<1)return flash('You need 1 energy for 5 replies.');
  state.player.energy=Math.max(0,state.player.energy-1);d.replyCredits=5;const draft=d.pendingPassDraft;d.pendingPassDraft=null;remember('dm_reply_pass',{celebrityId:id,celebrity:a.name,replies:5,energy:1,betaFree:false});save();page.querySelector('.dmpassoverlay')?.remove();render();decorateDmCredits85(id);flash('5 replies unlocked · −1 energy ⚡');
  if(draft)setTimeout(()=>{sendDm(id,draft.text,draft.image||'');refreshOpenDm(id);decorateDmCredits85(id)},80);else setTimeout(()=>$('#dmtext')?.focus(),80);
 };
 $('#dmpasslater').onclick=()=>{d.pendingPassDraft=null;save();page.querySelector('.dmpassoverlay')?.remove()};
}

openDm=function(id){
 const a=byId(id);if(!a)return;
 if(a.type==='celeb'&&!hasDirectAccess85(a))return openCelebrityGate85(id);
 ensureState85();if(a.custom&&!state.dmAccessIds.includes(a.id))state.dmAccessIds.push(a.id);
 const r=state.relations?.[a.id]||memoryFor(a.id);if(a.custom){r.unlocked=true;r.directAccess=true}
 baseOpenDm(id);const d=dmState(id);d.pendingPassDraft=null;d.replyCredits=999;modal.querySelector('.dmcreditbar')?.remove();modal.querySelector('.dmpassoverlay')?.remove();
 const input=modal.querySelector('#dmtext'),send=modal.querySelector('#dmsend'),form=modal.querySelector('#dmcomposer');
 if(input){input.disabled=false;input.readOnly=false;input.removeAttribute('aria-disabled');input.style.pointerEvents='auto';input.style.opacity='1'}
 if(send){send.disabled=false;send.removeAttribute('aria-disabled');send.style.pointerEvents='auto';send.style.opacity='1'}
 if(form){form.style.pointerEvents='auto';form.removeAttribute('inert')}
 save();setTimeout(()=>{try{input?.focus()}catch{}},80);
};

sendDm=function(id,text,image=''){
 const a=byId(id);if(!a)return false;
 if(a.type==='celeb'&&!hasDirectAccess85(a)){openCelebrityGate85(id);return false}
 const d=dmState(id),body=String(text||'').trim()||'[photo]',at=now();
 if(!image&&d.lastSentText===body&&at-(d.lastSentAt||0)<1200)return false;
 d.pendingPassDraft=null;d.replyCredits=999;
 const out=baseSendDm(id,text,image);save();return out;
};

deliverDmJob=async function(id,job){
 const out=await baseDeliverDmJob(id,job),d=dmState(id);d.replyCredits=999;d.pendingPassDraft=null;modal.querySelector('.dmcreditbar')?.remove();modal.querySelector('.dmpassoverlay')?.remove();save();return out;
};

const oldRenderPeoplePane=renderPeoplePane;
renderPeoplePane=function(){
 const html=oldRenderPeoplePane(),next=nextCelebrity85();
 const progress=`<div class="accesssummary"><div><small>CELEBRITY ACCESS</small><strong>Level ${lvl()} · ${celebs.filter(hasDirectAccess85).length} direct connections</strong><span>${next?`Next: ${esc(next.name)} at Level ${requiredSceneLevel85(next)}`:'Every built-in celebrity is now within reach.'}</span></div><b>✦</b></div>`;
 return html.replace('<div class="heading firstheading">',progress+'<div class="heading firstheading">');
};

async function runAccessQa85(){
 if(new URLSearchParams(location.search).get('__accessqa')!=='1')return;
 try{
  qaSetup85();
  const ordered=roster85(),first=ordered[0],locked=byId('beyonce')||ordered.at(-1),initial={first:{id:first?.id,name:first?.name,level:first?requiredSceneLevel85(first):null,access:first?hasDirectAccess85(first):false},locked:{id:locked?.id,name:locked?.name,level:locked?requiredSceneLevel85(locked):null,access:locked?hasDirectAccess85(locked):false},energy:state.player.energy,dms:state.dms.length};
  openCelebrityGate85(locked.id);const gateText=modal.innerText||'';closeModal();openDm(first.id);
  await new Promise(r=>setTimeout(r,100));
  const passText=modal.querySelector('.dmpassoverlay')?.innerText||'',pre=inspect85(first.id);modal.querySelector('#buydmreplies')?.click();await new Promise(r=>setTimeout(r,30));
  const bought=inspect85(first.id);sendDm(first.id,'Hey from access QA');const sent=inspect85(first.id),before=state.dms.length;maybeNpcDm();const randomDmDelta=state.dms.length-before;
  document.body.innerHTML=`<pre id="accessqa">${esc(JSON.stringify({initial,gateText,passText,pre,bought,sent,randomDmDelta},null,2))}</pre>`;
 }catch(e){document.body.innerHTML=`<pre id="accessqa-error">${esc(String(e&&e.stack||e))}</pre>`}
}
setTimeout(()=>{try{render()}catch(e){console.warn('SCENE access render fallback',e)}},0);
setTimeout(()=>{void runAccessQa85()},450);
})();
