(()=>{
'use strict';
if(globalThis.SCENE_GAMEPLAY_FLOW148)return;
const FLOW_VERSION148=148;
const runtime148={pickerQueued:false,lastStage:-1,checking:false};

function flow148(){
 if(!state.player)return null;
 if(!state.firstSession148){
  const freshCareer=(Number(state.player.fame)||0)<=3&&(Number(state.player.followers)||0)<500&&(Number(state.playerPosts)||0)<=2&&(Number(state.sceneDay)||0)<=1;
  state.firstSession148=freshCareer?{version:FLOW_VERSION148,stage:0,completed:false,startedAt:now(),baselinePosts:Number(state.playerPosts)||0,friendId:'',postReacted:false,choiceAt:0}:{version:FLOW_VERSION148,stage:5,completed:true,startedAt:now(),existingCareer:true};
  save();
 }
 const f=state.firstSession148;
 if(!Number.isFinite(f.stage))f.stage=f.completed?5:0;
 repairFreshOpening148();syncStarterAccess148(f);
 return f;
}
function friend148(){const f=flow148();return f?.friendId?byId(f.friendId):null}
function esc148(v){return esc(String(v??''))}
function removeCinematic148(){document.getElementById('scene-cinematic148')?.remove()}
function showCinematic148(html){removeCinematic148();const root=document.createElement('div');root.id='scene-cinematic148';root.className='scene-cinematic148';root.innerHTML=`<div class="scene-card148" role="dialog" aria-modal="false"><button type="button" class="scene-dismiss148" aria-label="Close">×</button>${html}</div>`;document.body.appendChild(root);root.querySelector('.scene-dismiss148').onclick=removeCinematic148;return root}
function showChapter148(title,body,icon='✦',ms=3300){document.querySelector('.scene-chapter148')?.remove();const el=document.createElement('div');el.className='scene-chapter148';el.innerHTML=`<i>${icon}</i><div><b>${esc148(title)}</b><span>${esc148(body)}</span></div>`;document.body.appendChild(el);setTimeout(()=>el.remove(),ms)}
function progressPct148(stage){return Math.max(8,Math.min(100,(stage/5)*100))}
function firstName148(a){return String(a?.name||'').split(/\s+/)[0]||'them'}
function repairFreshOpening148(){if(state.sceneOpeningDayRepair154||!state?.player)return;const trulyFresh=(Number(state.sceneDay)||0)===0&&(Number(state.player.fame)||0)===0&&(Number(state.player.followers)||0)<=100&&(Number(state.playerPosts)||0)===0;if(!trulyFresh)return;for(const p of state.posts||[])p.sceneDay=0;state.dayLedger92=[];state.sceneOpeningDayRepair154=true;save()}
function syncStarterAccess148(f=state.firstSession148){if(!state?.player||!f?.friendId)return;const a=byId(f.friendId);if(!a)return;let changed=false;state.dmAccessIds=Array.isArray(state.dmAccessIds)?state.dmAccessIds:[];if(!state.dmAccessIds.includes(a.id)){state.dmAccessIds.push(a.id);changed=true}const r=memoryFor(a.id);if(!r.unlocked){r.unlocked=true;changed=true}if(!r.directAccess){r.directAccess=true;changed=true}if(changed)save()}

function starterIds148(){
 const bank={Music:['sabrina','charli','tatemcrae'],Acting:['sydney','timothee','zendaya'],Fashion:['hailey','kendall','zendaya'],Creator:['kylie','sabrina','doja']},featured=bank[state.player?.career]||['sabrina','sydney','hailey'],priority=new Map(featured.map((id,i)=>[id,i]));
 return [...celebs].filter(Boolean).sort((a,b)=>{const pa=priority.has(a.id)?priority.get(a.id):-1,pb=priority.has(b.id)?priority.get(b.id):-1;if(pa>=0||pb>=0)return pa>=0&&pb>=0?pa-pb:pa>=0?-1:1;return String(a.name||'').localeCompare(String(b.name||''))});
}
function starterOpener148(a){
 const custom={
  sabrina:'okay your account is finally live 😭 text me before you overthink your first post',
  charli:'wait you actually made the account lol. text me before you post anything boring',
  tatemcrae:'you’re liveeee 😭 okay text me. what are we doing first?',
  sydney:'you’re officially on here 😂 text me before the internet gets ideas',
  timothee:'you made it. okay — text me before you disappear for three weeks.',
  zendaya:'okayyy you’re live 🤍 text me. what’s the first move?',
  hailey:'your account is up 👀 text me before everyone starts watching',
  kendall:'wait you finally made it 😂 text me before you do anything chaotic',
  kylie:'okayyy your page is live 👀 text me. what are we posting first?',
  doja:'oh no you’re online now 😭 text me immediately',
  kim:'Okay, you’re officially on here. Text me before you post anything — I want to see the first one.'
 };
 let line=custom[a.id]||`okay ${state.player.name}, you’re actually live 😭 text me before you overthink this`;
 try{if(typeof dmIdentityStyle==='function')line=dmIdentityStyle(a,line)}catch{}
 return line;
}
function ensureStarterDm148(a){
 const d=dmState(a.id),line=starterOpener148(a),already=d.messages.some(m=>m.kind==='scene-starter148');
 if(!already){d.messages.push({mid:'starter148-'+now(),from:'them',text:line,at:now(),kind:'scene-starter148'});addNotif(`${a.name} sent you a message.`,'dm',{celebrityId:a.id})}
 d.unread=true;d.lastInboundAt=d.lastInboundAt||now();d.awaitingPlayer=true;
 return line;
}
function repairStarter148(){
 const f=flow148();if(!f?.friendId)return false;const a=byId(f.friendId);if(!a)return false;let changed=false;
 const r=memoryFor(a.id);if(!r.unlocked){r.unlocked=true;changed=true}if(!r.directAccess){r.directAccess=true;changed=true}if(!f.relationshipSeeded170){f.relationshipSeeded170=true;changed=true}
 state.dmAccessIds=Array.isArray(state.dmAccessIds)?state.dmAccessIds:[];if(!state.dmAccessIds.includes(a.id)){state.dmAccessIds.push(a.id);changed=true}
 state.followingIds=Array.isArray(state.followingIds)?state.followingIds:[];if(!state.followingIds.includes(a.id)){state.followingIds.push(a.id);changed=true}
 state.followedByIds=Array.isArray(state.followedByIds)?state.followedByIds:[];if(!state.followedByIds.includes(a.id)){state.followedByIds.push(a.id);changed=true}
 const d=dmState(a.id),mem=state.memory||[],chapter=mem.find(m=>m.type==='chapter_complete'&&m.chapter==='first-five'),choice=mem.find(m=>m.type==='starter_choice'&&m.celebrityId===a.id),ripple=mem.find(m=>m.type==='starter_public_ripple'&&m.celebrityId===a.id),outbound=[...(d.messages||[])].reverse().find(m=>m.from==='me'),careerFloor=f.careerStartedAt||f.choiceAt||f.startedAt||0,careerMove=mem.find(m=>(m.type==='gig'||m.type==='story_choice')&&(m.at||0)>=careerFloor);
 if(chapter&&!f.completedAt){f.stage=5;f.completed=true;f.completedAt=chapter.at||now();changed=true}
 else if(careerMove&&!f.completedAt&&(f.stage>=4||choice)){f.stage=5;f.completed=true;f.completedAt=careerMove.at||now();changed=true}
 else if(!f.completedAt&&!f.existingCareer){
  if(choice){if(f.completed||f.stage!==4){f.completed=false;f.stage=4;changed=true}if(!f.choiceAt){f.choiceAt=choice.at||now();changed=true}}
  else if(ripple){if(f.completed||f.stage!==3){f.completed=false;f.stage=3;changed=true}f.postReacted=true;f.firstPostId=f.firstPostId||ripple.postId||'';f.rippleFollowers=Number(f.rippleFollowers||ripple.followers)||0}
  else if(outbound){if(f.completed||f.stage!==2){f.completed=false;f.stage=2;changed=true}if(!f.repliedAt){f.repliedAt=outbound.at||now();changed=true}if(!Number.isFinite(f.baselinePosts)){f.baselinePosts=Number(state.playerPosts)||0;changed=true}}
  else{if(f.completed||f.stage!==1){f.completed=false;f.stage=1;changed=true}if(!d.messages?.some(m=>m.kind==='scene-starter148')){ensureStarterDm148(a);changed=true}}
 }
 if(!f.completed&&f.stage===1&&!d.messages?.some(m=>m.kind==='scene-starter148')){ensureStarterDm148(a);changed=true}
 if(changed)save();return changed;
}
function showStarterPicker148(){
 const f=flow148();if(!f||f.completed||f.stage!==0||document.getElementById('scene-cinematic148'))return;
 const items=starterIds148();if(!items.length)return;
 const root=showCinematic148(`<div class="scene-eyebrow148">CHAPTER 01 · YOUR WAY IN</div><h2>Pick who already knows you.</h2><p>Anyone in SCENE. Whoever you pick is your first real connection: the first DM on your phone, the first famous name in your comments, and the reason people start asking who you are.</p><div class="scene-progress148"><i style="width:8%"></i></div><div class="scene-startersearch148"><span>⌕</span><input id="sceneStarterSearch148" autocomplete="off" placeholder="Search celebrities…"></div><div class="scene-startercount148">${items.length} people available</div><div class="scene-friends148 scene-friends-scroll148" id="sceneStarterList148"></div>`);
 const input=root.querySelector('#sceneStarterSearch148'),list=root.querySelector('#sceneStarterList148'),draw=()=>{const q=String(input?.value||'').trim().toLowerCase(),shown=items.filter(a=>!q||String(a.name||'').toLowerCase().includes(q)||String(a.handle||'').toLowerCase().includes(q)||String(a.role||'').toLowerCase().includes(q));list.innerHTML=shown.map((a,i)=>`<button type="button" class="scene-friend148" data-starter148="${esc148(a.id)}">${av(a)}<span><b>${esc148(a.name)} ${check()}</b><span class="scene-frmeta148">@${esc148(a.handle)} · ${i<3&&!q?'suggested for you · ':''}${esc148(a.role||'celebrity')}</span></span><em>›</em></button>`).join('')||'<div class="scene-starterempty148">No celebrity matches that search.</div>';list.querySelectorAll('[data-starter148]').forEach(btn=>btn.onclick=()=>chooseStarter148(btn.dataset.starter148))};
 input.oninput=draw;draw();setTimeout(()=>input.focus(),120);
}
function chooseStarter148(id){
 const a=byId(id),f=flow148();if(!a||!f)return;
 f.friendId=a.id;f.stage=1;f.chosenAt=now();f.relationshipSeeded170=true;
 const r=memoryFor(a.id);r.unlocked=true;r.directAccess=true;globalThis.SCENE_KERNEL170?.relationshipSignal?.(a.id,'starter_friend_seed',{visibility:'private',source:'starter_friend',summary:`${a.name} is the player's established starting celebrity friend.`,floor:a.id==='kim'?{friendship:52,trust:42,chemistry:50,tension:0}:{friendship:38,trust:27,chemistry:6,tension:0}});
 state.dmAccessIds=Array.isArray(state.dmAccessIds)?state.dmAccessIds:[];if(!state.dmAccessIds.includes(a.id))state.dmAccessIds.push(a.id);
 if(!state.followingIds.includes(a.id))state.followingIds.push(a.id);
 if(!state.followedByIds.includes(a.id))state.followedByIds.push(a.id);
 const opener=ensureStarterDm148(a);
 state.events.unshift(`${a.name} is already in your inner circle.`);
 remember('starter_friend',{celebrityId:a.id,celebrity:a.name,friendship:r.friendship,trust:r.trust});save();render();
 const root=showCinematic148(`<div class="scene-eyebrow148">YOUR INNER CIRCLE</div><h2>${esc148(a.name)} already knows you.</h2><p>And ${esc148(firstName148(a))} is in your phone for real now: following you, one DM away, watching what you post, and remembering how you two are doing as your career takes off.</p><div class="scene-phone148"><div class="scene-dmmini148">${av(a)}<div><strong>${esc148(a.name)} ${check()}</strong><small>now · Message</small><p>${esc148(opener)}</p></div></div></div><div class="scene-rewards148"><span>♡ Connection ${Math.round(Number(memoryFor(a.id)?.friendship)||38)}</span><span>✓ Follows you</span><span>✉ DM unlocked</span></div><button class="scene-primary148" id="sceneReply148">Reply to ${esc148(firstName148(a))}</button>`);
 root.querySelector('#sceneReply148').onclick=()=>{removeCinematic148();openDm(a.id)};
}

function reactionLine148(a,p){
 const text=String(p?.text||'').trim(),low=text.toLowerCase(),photo=Boolean(p?.media),first=firstName148(a);
 const postSpecific=photo?{
  kylie:['okayyy this pic is cute','wait this photo 😭','love thisss'],kendall:['okay this is actually cute lol','wait I like this one'],sabrina:['oh this pic is GOOD','okayyy face card'],charli:['lol this pic goes hard','okayyyy'],doja:['oh you ate this lol','wait this is good']
 }: /song|studio|track|music|demo|chorus|album|single/.test(low)?{
  kylie:['wait I need to hear it now','okayyy music era 👀'],charli:['send the song immediately lol','okay louder'],sabrina:['waittt what are you making','I need the chorus now'],doja:['okay play it then lol','if it’s weird send it'],tatemcrae:['waittt I wanna hear 😭','okay send it']
 }: /shoot|campaign|brand|skincare|fashion|look|outfit|set|booking|appearance/.test(low)?{
  kylie:['okay wait what is this for 👀','cute. tell me the plan'],kendall:['wait what are you shooting lol','okay this looks fun'],sydney:['wait what is this for?','okayyy tell me more'],hailey:['wait I like this. what’s the project?','cuteee what is this for?']
 }:{};
 const defaults={sabrina:['lol okayyyy','wait 😭'],charli:['lol hi','okayyyy'],tatemcrae:['waittt 😭','lol okay'],sydney:['okay hi 😂','wait lol'],timothee:['okay, hi 😂','lol what is this'],zendaya:['okay 🤍','lol hi'],hailey:['cute lol','okayyy'],kendall:['lol hi','okayyy'],kylie:['lol wait','okayyy'],doja:['lol what','okay lmao']};
 const bank=postSpecific[a.id]||defaults[a.id]||['lol okay','wait 😂'];return bank[Math.abs(hash(`${a.id}|${p?.id||text}|starter184`))%bank.length];
}
function rippleFan148(p,a,i){
 const c=contextualFanComment(p);if(!c)return null;c.createdAt=now()+i;return c;
}
function handleFirstPost148(){
 const f=flow148(),a=friend148();if(!f||f.completed||f.stage!==2||f.postReacted||!a)return;
 const d=dmState(a.id),sent=[...(d.messages||[])].reverse().find(m=>m.from==='me'),floor=f.repliedAt||sent?.at||f.chosenAt||f.startedAt||0;
 const p=playerPosts().find(x=>(x.createdAt||0)>=Math.max(0,floor-1500));if(!p)return;
 f.postReacted=true;f.stage=3;f.firstPostId=p.id;
 p.comments=p.comments||[];
 const reply=reactionLine148(a,p);if(!p.comments.some(c=>c.authorId===a.id))p.comments.unshift({id:'startercomment148-'+now(),authorId:a.id,name:a.name,handle:a.handle,text:reply,createdAt:now(),verified:true,likes:rand(90,640),replies:[]});
 for(let i=0;i<2;i++){const fan=rippleFan148(p,a,i);if(fan)p.comments.push(fan)}
 const followers=rand(28,54);f.rippleFollowers=followers;globalThis.SCENE_KERNEL170?.relationshipSignal?.(a.id,'starter_public_support',{visibility:'public',source:'starter_first_post',summary:`${a.name} publicly supported the player's first post.`,deltas:{friendship:3,trust:1}});state.player.followers+=followers;state.player.fame+=1;state.player.xp+=5;p.seedViews=(p.seedViews||0)+rand(65,150);p.seedLikes=(p.seedLikes||0)+rand(12,36);
 addNotif(`${a.name} commented on your post: “${reply}”`,'comment',{celebrityId:a.id,postId:p.id});addNotif(`${followers} people followed you after ${a.name}'s comment.`,'follow',{postId:p.id,amount:followers});
 remember('starter_public_ripple',{celebrityId:a.id,celebrity:a.name,postId:p.id,followers,fame:1,friendship:3});save();render();
 setTimeout(()=>showRipple148(followers),520);
}
function showRipple148(followerGain){
 const f=flow148(),a=friend148();if(!f||f.stage!==3||!a||document.getElementById('scene-cinematic148'))return;
 const initialsPlayer=initials(state.player.name);
 const root=showCinematic148(`<div class="scene-eyebrow148">WORLD RIPPLE</div><div class="scene-ripple148"><div class="scene-orbit148"><span class="scene-orbitline148 l1"></span><span class="scene-orbitline148 l2"></span><span class="scene-orbitline148 l3"></span><span class="scene-orbitcenter148">${esc148(initialsPlayer)}</span><span class="scene-orbitfriend148">${av(a)}</span><span class="scene-orbitfan148 f1">+1</span><span class="scene-orbitfan148 f2">♡</span><span class="scene-orbitfan148 f3">@</span></div><h2>One comment changed the room.</h2><p>${esc148(a.name)} reacted publicly. People who had never seen you before clicked through, followed, commented and started asking how you know each other.</p></div><div class="scene-rewards148"><span>+${fmt(followerGain)} followers</span><span>+1 fame</span><span>+3 connection</span></div><button class="scene-primary148" id="sceneDecide148">Decide what to do next</button>`);
 root.querySelector('#sceneDecide148').onclick=showRippleChoice148;
}
function showRippleChoice148(){
 const f=flow148(),a=friend148();if(!f||f.stage!==3||!a)return;
 const root=showCinematic148(`<div class="scene-eyebrow148">YOUR MOVE</div><h2>People are watching the friendship now.</h2><p>Lean into it, keep everyone guessing, or keep it between you and ${esc148(firstName148(a))}. Each one plays out differently.</p><div class="scene-choices148"><button class="scene-choice148" data-choice148="0"><span><b>Reply like this is completely normal</b><small>Stronger friendship · warm audience growth</small></span><em>›</em></button><button class="scene-choice148" data-choice148="1"><span><b>Say nothing and let people speculate</b><small>More buzz · more fame · less closeness</small></span><em>›</em></button><button class="scene-choice148" data-choice148="2"><span><b>Text ${esc148(firstName148(a))}: “keep us low-key”</b><small>More trust · stronger reputation · less public heat</small></span><em>›</em></button></div>`);
 root.querySelectorAll('[data-choice148]').forEach(b=>b.onclick=()=>resolveRippleChoice148(Number(b.dataset.choice148)));
}
function resolveRippleChoice148(choice){
 const f=flow148(),a=friend148();if(!f||f.stage!==3||!a)return;let reward={},title='',body='',relDelta={};
 if(choice===0){reward={followers:18,xp:4};relDelta={friendship:4,trust:2};title='You made it feel real.';body=`The reply makes the connection feel genuine instead of staged. ${a.name} likes that you did not turn it into a stunt.`}
 if(choice===1){reward={followers:34,fame:1,xp:4};relDelta={friendship:1};title='The mystery worked.';body='You give the internet nothing. Naturally, they make up the rest. Your name travels further than it would have with an explanation.'}
 if(choice===2){reward={followers:5,rep:3,xp:4};relDelta={trust:4};title='You protected the friendship.';body=`The public moment cools down, but ${a.name} trusts you more. Not every win has to be visible.`}
 globalThis.SCENE_KERNEL170?.relationshipSignal?.(a.id,'starter_public_support',{visibility:choice===2?'private':'public',source:'starter_choice',summary:`Starter relationship choice ${choice} with ${a.name}.`,deltas:relDelta});
 applyEffect(reward);f.stage=4;f.choiceAt=now();f.choice=choice;remember('starter_choice',{celebrityId:a.id,celebrity:a.name,choice,effect:reward});addNotif(`${title} Your relationship with ${a.name} changed.`,'connection',{celebrityId:a.id});save();render();
 const chips=[];if(reward.followers)chips.push(`+${reward.followers} followers`);if(reward.fame)chips.push(`+${reward.fame} fame`);if(reward.rep)chips.push(`+${reward.rep} reputation`);chips.push(choice===0?'+4 friendship':choice===2?'+4 trust':'+1 friendship');
 const root=showCinematic148(`<div class="scene-outcome148"><div class="scene-burst148">✦</div><div class="scene-eyebrow148">THE WORLD REMEMBERS</div><h2>${esc148(title)}</h2><p>${esc148(body)}</p><div class="scene-rewards148">${chips.map(x=>`<span>${esc148(x)}</span>`).join('')}</div></div><button class="scene-primary148" id="sceneCareer148">Make your first career move</button>`);
 root.querySelector('#sceneCareer148').onclick=()=>{removeCinematic148();startFirstGig148()};
}
function startFirstGig148(){const f=flow148();if(f&&!f.completed&&f.stage===4){f.careerStartedAt=now();f.jobsBefore148=Number(state.jobsDone)||0;save()}state.tab='world';render();setTimeout(()=>{const story=document.querySelector('[data-story-op]');if(story){story.click();return}const first=document.querySelector('[data-gig]');if(first?.dataset.gig){startGig(first.dataset.gig);return}flash('Choose your first career move below.')},120)}
function completeChapter148(){const f=flow148();if(!f||f.completed||f.stage!==4)return;const floor=f.careerStartedAt||f.choiceAt||f.startedAt||0,move=(state.memory||[]).find(m=>(m.type==='gig'||m.type==='story_choice')&&(m.at||0)>=floor),recentGig=(state.memory||[]).find(m=>m.type==='gig'&&now()-(m.at||0)<20*60000),jobsAdvanced=Number.isFinite(f.jobsBefore148)&&(Number(state.jobsDone)||0)>f.jobsBefore148;if(!move&&!jobsAdvanced&&!recentGig)return;f.stage=5;f.completed=true;f.completedAt=now();remember('chapter_complete',{chapter:'first-five',title:'You have entered the scene'});save();showChapter148('CHAPTER 01 COMPLETE','You have a real relationship, a public ripple and your first career move. From here, SCENE keeps handing you the next meaningful move.','♛',4600);render()}

function actionForObjective148(action){
 removeCinematic148();
 if(String(action||'').startsWith('story169:')){const id=String(action).slice(9);if(globalThis.SCENE_STORY169?.act?.(id))return true}
 if(action==='compose')return openCompose();
 if(action==='feed'){state.tab='feed';render();return}
 if(action==='career'){state.tab='world';render();return}
 if(action==='firstgig')return startFirstGig148();
 if(action==='activity')return openActivity('social');
 if(action==='event')return openEvent(state.pendingEvent);
 if(action==='ripple')return showRipple148(Number(flow148()?.rippleFollowers)||0);
 if(action.startsWith('dm:')){repairStarter148();return openDm(action.slice(3))}
}
function directorObjective148(){
 const f=flow148(),a=friend148();if(!f)return null;
 if(!f.completed){
  if(f.stage===0)return{icon:'✦',label:'YOUR WAY IN',title:'Choose who you already know',sub:'Your first celebrity relationship starts the story.',action:'picker',button:'Start'};
  if(f.stage===1&&a)return{icon:'✉',label:'NEXT MOVE',title:`Reply to ${firstName148(a)}`,sub:'Your friend is waiting in your DMs.',action:`dm:${a.id}`,button:'Reply'};
  if(f.stage===2)return{icon:'＋',label:'NEXT MOVE',title:'Make your first post',sub:`Give ${a?firstName148(a):'your circle'} — and the world — something to react to.`,action:'compose',button:'Post'};
  if(f.stage===3)return{icon:'◎',label:'WORLD RIPPLE',title:'See what your friend changed',sub:'A public reaction is moving through your audience.',action:'ripple',button:'See it'};
  if(f.stage===4)return{icon:'◉',label:'NEXT MOVE',title:'Book your first gig while they’re looking',sub:'People are talking about you. Walk into your first real room and give them something better to talk about.',action:'firstgig',button:'Go'};
 }
 const unread=(state.dms||[]).find(d=>d.unread&&d.messages?.length);if(unread){const person=byId(unread.id);if(person)return{icon:'✉',label:'SOMETHING MOVED',title:`${firstName148(person)} messaged you`,sub:'Your private world is reacting to what you have been doing.',action:`dm:${person.id}`,button:'Open'}}
 if(state.pendingEvent)return{icon:'✦',label:'LIVE SITUATION',title:state.pendingEvent.title||'Something just happened',sub:'This choice can move your career, reputation or relationships.',action:'event',button:'Choose'};
 const storyObjective169=globalThis.SCENE_STORY169?.objective?.();if(storyObjective169)return storyObjective169;
 const memories=state.memory||[],latest=playerPosts()[0],recent=latest&&now()-(latest.createdAt||0)<12*60000,hasSocial=(state.notifications||[]).some(n=>n.unread&&(n.channel||notifChannel(n.kind))==='social'),lastGig=memories.find(m=>m.type==='gig'),lastEvent=memories.find(m=>m.type==='event'),lastPost=memories.find(m=>m.type==='player_post'),lastMove=[lastGig,lastEvent,lastPost].filter(Boolean).sort((x,y)=>(y.at||0)-(x.at||0))[0];
 if(lastMove?.type==='gig'&&now()-(lastMove.at||0)<12*60000){if(hasSocial)return{icon:'♡',label:'THE JOB LANDED',title:'See what that booking changed',sub:'People are reacting to the actual booking and the choices you made inside it.',action:'activity',button:'Check'};return{icon:'＋',label:'AFTER THE JOB',title:'Give people your version',sub:'The booking is complete. Post, message someone, or let the next story begin — you do not need to repeat the job.',action:'compose',button:'Post'};}
 if(recent&&hasSocial)return{icon:'♡',label:'YOUR POST IS MOVING',title:'People are reacting right now',sub:'Check who showed up and what changed.',action:'activity',button:'Check'};
 if(recent&&(state.player.energy||0)>=12&&(!lastGig||(lastGig.at||0)<(latest.createdAt||0)))return{icon:'◉',label:'KEEP THE STORY MOVING',title:'Your post is live — turn it into momentum',sub:'You do not need to wait. Make the next career move while the timeline keeps reacting in the background.',action:'career',button:'Make a move'};
 if(recent)return{icon:'＋',label:'KEEP THE STORY MOVING',title:'Your post is live — do something new',sub:'The world can keep reacting while you post, message people or move your story forward.',action:'compose',button:'New post'};
 if((state.player.energy||0)>=12&&(!lastGig||now()-(lastGig.at||0)>8*60000))return{icon:'◉',label:'NEXT MOVE',title:'Turn attention into a career win',sub:'A job gives the world a new reason to notice you.',action:'career',button:'Career'};
 return{icon:'＋',label:'NEXT MOVE',title:'Give the world something new',sub:'Post, start a conversation, or create the next piece of your story.',action:'compose',button:'Post'};
}
function injectNextMove148(){
 if(!state?.player)return;const old=document.querySelector('.scene-nextmove148');if(state.tab==='settings'){old?.remove();return}const main=document.querySelector('.main');if(!main)return;const o=directorObjective148();if(!o){old?.remove();return}const sig=[o.label,o.title,o.sub,o.action,o.button].join('|');if(old?.dataset.sig===sig)return;old?.remove();
 const card=document.createElement('div');card.className='scene-nextmove148';card.dataset.sig=sig;card.innerHTML=`<div class="scene-moveicon148">${o.icon}</div><div class="scene-movecopy148"><small>${esc148(o.label)}</small><strong>${esc148(o.title)}</strong><span>${esc148(o.sub)}</span></div><button type="button" class="scene-movego148">${esc148(o.button)}</button>`;main.prepend(card);card.querySelector('button').onclick=()=>{if(o.action==='picker')showStarterPicker148();else actionForObjective148(o.action)};
}
function checkProgress148(){
 repairStarter148();const f=flow148();if(!f||f.completed)return;if(f.stage===2)handleFirstPost148();if(f.stage===4)completeChapter148();
}

const baseSendDm148=sendDm;
sendDm=function(id,text,image=''){
 const f=state.player?flow148():null,wasStarter=Boolean(f&&!f.completed&&f.stage===1&&f.friendId===id);const out=baseSendDm148(id,text,image);
 if(wasStarter){f.stage=2;f.repliedAt=now();f.baselinePosts=Number(state.playerPosts)||0;save();setTimeout(()=>{showChapter148('MESSAGE SENT',`${firstName148(friend148())} has it. Your first post is next.`,'✉');injectNextMove148()},620)}
 return out;
};

const baseRenderSettings148=renderSettings;
renderSettings=function(){const html=baseRenderSettings148();if(!state.player)return html;const card=`<div class="heading">Gameplay</div><div class="card settingrow"><div class="grow"><strong>Opening chapter</strong><small>Replay the new celebrity-friend opening and action → reaction → consequence flow on this career.</small></div><button class="btn secondary" data-action="replayflow148">Replay</button></div>`;return html.replace('</section>',card+'</section>')};
const baseBind148=bind;
bind=function(){baseBind148();document.querySelectorAll('[data-action="replayflow148"]').forEach(b=>b.onclick=()=>{state.firstSession148={version:FLOW_VERSION148,stage:0,completed:false,startedAt:now(),baselinePosts:Number(state.playerPosts)||0,friendId:'',postReacted:false,choiceAt:0,replay:true};state.tutorialQueued=false;save();state.tab='feed';render();setTimeout(showStarterPicker148,120)})};

const baseOpenDm148=openDm;
openDm=function(){removeCinematic148();return baseOpenDm148.apply(this,arguments)};
const baseRender148=render;
render=function(){
 if(state.player){const f=flow148();if(f&&!f.completed)state.tutorialQueued=false;repairStarter148()}
 baseRender148();
 if(!state.player)return;
 if(state.tab==='settings'){removeCinematic148();return;}
 injectNextMove148();checkProgress148();
 const f=flow148();if(f&&!f.completed&&f.stage===0&&!runtime148.pickerQueued){runtime148.pickerQueued=true;setTimeout(()=>{runtime148.pickerQueued=false;if(!document.querySelector('#modal #dmtext'))showStarterPicker148()},440)}
};

setInterval(()=>{if(!state?.player||document.hidden)return;try{checkProgress148();injectNextMove148()}catch{}},1200);
globalThis.SCENE_GAMEPLAY_FLOW148={version:FLOW_VERSION148,replay:()=>{state.firstSession148={version:FLOW_VERSION148,stage:0,completed:false,startedAt:now(),baselinePosts:Number(state.playerPosts)||0};save();render()},objective:directorObjective148};
try{if(state?.player)render()}catch(e){console.warn('SCENE gameplay flow 148 init',e)}
})();
