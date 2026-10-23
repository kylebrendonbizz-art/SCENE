/* SCENE v170 — canonical action + character knowledge kernel.
   Clean-room architecture inspired by observed Status client boundaries: actions, character state,
   score changes and delayed consequences are separate from generated dialogue. */
(()=>{
'use strict';
if(globalThis.SCENE_KERNEL170)return;
const VERSION=170,KEY='sceneKernel170',DEVICE_KEY='scene-player-key-v170',MAX_ACTIONS=220,MAX_FACTS=80;
const baseSave=save,baseRemember=remember;
const rt={syncTimer:0,syncing:false,hydrating:false,recoveryKicked:false,lastSyncAt:0,generation:0,processingReaction:false};
const now170=()=>Date.now();
const clean=(v,n=260)=>String(v??'').replace(/\s+/g,' ').trim().slice(0,n);
const clamp170=(v,min=0,max=100)=>Math.max(min,Math.min(max,Number(v)||0));
const deep=v=>{try{return JSON.parse(JSON.stringify(v))}catch{return null}};
const stable=s=>{try{return Math.abs(hash(String(s||'')))%10000/10000}catch{let h=0;for(const c of String(s||''))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h%10000)/10000}};
function uuid170(){try{return crypto.randomUUID().replace(/-/g,'')}catch{return `scene${now170().toString(36)}${Math.random().toString(36).slice(2,14)}`}}
function ensure170(){
 if(!state?.player)return null;
 let k=state[KEY];
 if(!k||k.version!==VERSION){const old=k||{};let persisted='';try{persisted=localStorage.getItem(DEVICE_KEY)||''}catch{}const playerKey=old.playerKey||persisted||uuid170(),recoveryPending=!old.playerKey&&Boolean(persisted);k=state[KEY]={version:VERSION,playerKey,revision:Number(old.revision)||0,installedAt:now170(),actions:Array.isArray(old.actions)?old.actions.slice(0,MAX_ACTIONS):[],characters:old.characters&&typeof old.characters==='object'?old.characters:{},reactionQueue:Array.isArray(old.reactionQueue)?old.reactionQueue:[],lastHydratedAt:Number(old.lastHydratedAt)||0,recoveryPending};try{localStorage.setItem(DEVICE_KEY,playerKey)}catch{}baseSave()}
 k.actions=Array.isArray(k.actions)?k.actions:[];k.characters=k.characters&&typeof k.characters==='object'?k.characters:{};k.reactionQueue=Array.isArray(k.reactionQueue)?k.reactionQueue:[];try{if(k.playerKey)localStorage.setItem(DEVICE_KEY,k.playerKey)}catch{}return k;
}
function rel170(id){const r=state.relations?.[id]||{};return{friendship:clamp170(r.friendship),trust:clamp170(r.trust),chemistry:clamp170(r.chemistry),tension:clamp170(r.tension),directAccess:Boolean(r.directAccess||state.dmAccessIds?.includes(id)),followsPlayer:Boolean(state.followedByIds?.includes(id)),playerFollows:Boolean(state.followingIds?.includes(id))}}
function npcLocal170(id){const n=state.commentEngine66?.npcs?.[id]||{};return{affinity:Number(n.affinity)||0,familiarity:clamp170(n.familiarity),playerHearts:Number(n.playerHearts)||0,playerReplies:Number(n.playerReplies)||0,lastReactionAt:Number(n.lastReactionAt)||0}}
function char170(id){const k=ensure170();if(!k||!id)return null;if(!k.characters[id])k.characters[id]={id,recognition:0,familiarity:0,attention:0,lastSeenAt:0,lastInteractionAt:0,lastSource:'',knownEventIds:[],knownFacts:[],relationship:{},npc:{}};const c=k.characters[id];c.knownEventIds=Array.isArray(c.knownEventIds)?c.knownEventIds:[];c.knownFacts=Array.isArray(c.knownFacts)?c.knownFacts:[];const a=typeof byId==='function'?byId(id):null;c.relationship=a?.type==='celeb'?rel170(id):(c.relationship||{});c.npc=npcLocal170(id);return c}
function topic170(m){const s=clean(m?.sceneStory169?.subject||m?.sceneUnderstanding166?.subject||m?.text||m?.title||m?.choice||m?.type,420).toLowerCase();if(/song|music|studio|album|single|record|chart|stream|concert|performance/.test(s))return'music';if(/fashion|look|runway|stylist|dress|campaign|beauty/.test(s))return'fashion';if(/kiss|date|relationship|romance|crush|boyfriend|girlfriend/.test(s))return'romance';if(/travel|flight|airport|cape town|johannesburg|london|paris|dubai|tokyo|new york|los angeles/.test(s))return'travel';if(/feud|drama|shade|backlash|receipts|deny|leak/.test(s))return'drama';if(/job|gig|booking|career|audition|deal|meeting|cover|award|show|appearance/.test(s))return'career';return'general'}
function visibility170(m){
 if(m?.visibility)return clean(m.visibility,24);
 const tags=Array.isArray(m?.tags)?m.tags:[];if(tags.includes('private'))return'private';if(tags.includes('limited'))return'limited';if(tags.includes('public'))return'public';
 if(/^dm_|incoming_dm|dm_sent|dm_reply$/.test(m?.type||''))return'private';
 if(['hangout','profile_edit','rest','diamond_boost','chapter_complete'].includes(m?.type))return'private';
 if(m?.type==='travel')return m.witnessed?'public':'private';
 if(m?.type==='gig')return ['viral','standout','strong'].includes(String(m.outcome||'').toLowerCase())?'limited':'private';
 if(['player_post','verified_public','verified_comment','comment_reply','follow_back','mention','media_mention_reply','viral_push'].includes(m?.type))return'public';
 if(['event','story_choice','side_quest','scene_milestone'].includes(m?.type))return'limited';
 return'private';
}
function summary170(m){return clean(m?.sceneStory169?.summary||m?.sceneUnderstanding166?.summary||m?.outcome||m?.text||m?.title||m?.choice||`${state.player?.name||'Player'} made a ${m?.type||'move'}.`,420)}
function involved170(m){const ids=new Set();if(m?.celebrityId)ids.add(String(m.celebrityId));if(m?.accountId&&byId(m.accountId)?.type==='celeb')ids.add(String(m.accountId));for(const x of m?.mentions||[])if(x?.id&&x.type==='celeb')ids.add(String(x.id));for(const x of m?.peopleInvolved||[])if(x&&x!=='player')ids.add(String(x));const names=[m?.celebrity,...(m?.sceneStory169?.people||[]),...(m?.sceneUnderstanding166?.people||[])].filter(Boolean);for(const name of names){const a=(celebs||[]).find(x=>String(x.name||'').toLowerCase()===String(name).toLowerCase());if(a)ids.add(a.id)}return [...ids]}
function fact170(m){return{id:String(m?.id||`mem-${now170()}`),type:clean(m?.type,70),at:Number(m?.at)||now170(),visibility:visibility170(m),topic:topic170(m),summary:summary170(m),title:clean(m?.title,160),text:clean(m?.text,260),choice:clean(m?.choice||m?.decision,220),outcome:clean(m?.outcome,260),city:clean(m?.city,100),celebrityId:clean(m?.celebrityId,140),postId:clean(m?.postId,160),sourceArcId:clean(m?.sourceArcId,160)} }
function stage170(){const f=Number(state.player?.followers)||0,fa=Number(state.player?.fame)||0;if(state.player?.verified||fa>=80||f>=250000)return'mainstream';if(fa>=40||f>=25000)return'recognized';if(fa>=18&&f>=5000)return'breakthrough';return'unknown'}
function markKnown170(id,m,source='observed',boost=0){const c=char170(id);if(!c||!m)return null;const f=fact170(m);if(!c.knownEventIds.includes(f.id)){c.knownEventIds.unshift(f.id);c.knownEventIds=c.knownEventIds.slice(0,MAX_FACTS);c.knownFacts.unshift({...f,source});c.knownFacts=c.knownFacts.slice(0,MAX_FACTS)}c.lastSeenAt=now170();c.lastSource=source;c.recognition=clamp170(c.recognition+Math.max(1,boost|| (f.visibility==='public'?2:4)));c.familiarity=clamp170(c.familiarity+(source==='direct'||source==='dm'?4:1));c.attention=clamp170(c.attention+(f.visibility==='public'?2:5));if(source==='direct'||source==='dm')c.lastInteractionAt=now170();const a=byId(id);if(a?.type==='celeb')c.relationship=rel170(id);else c.npc=npcLocal170(id);return c}
function knows170(id,mOrId){const c=char170(id);if(!c)return false;const id2=typeof mOrId==='string'?mOrId:String(mOrId?.id||'');return Boolean(id2&&c.knownEventIds.includes(id2))}
function shouldPublicCelebKnow170(a,m){if(!a||a.type!=='celeb')return false;if(involved170(m).includes(a.id))return true;const r=rel170(a.id),st=stage170(),starter=state.firstSession148?.friendId===a.id;if(starter&&(r.friendship>=20||r.trust>=16))return true;if(r.followsPlayer&&r.friendship>=10)return true;if(!['public','limited'].includes(visibility170(m)))return false;const fame=Number(state.player?.fame)||0,followers=Number(state.player?.followers)||0,reach=Number(a.reach)||0;let chance=0;if(visibility170(m)==='public')chance=.035+fame/520+Math.log10(Math.max(10,followers))/50+(r.friendship+r.trust)/700;else chance=.01+(r.friendship+r.trust)/900;if(st==='breakthrough')chance+=.05;if(st==='recognized')chance+=.14;if(st==='mainstream')chance+=.28;if(reach>=100000000&&st==='unknown')chance*=.22;else if(reach>=30000000&&st==='unknown')chance*=.45;if(r.playerFollows)chance+=.02;return stable(`${m.id}|${a.id}|aware170`)<Math.min(.82,chance)}
function spread170(m){const vis=visibility170(m),touched=new Set(),direct=involved170(m);for(const id of direct){markKnown170(id,m,'direct',8);touched.add(id)}const starter=byId(state.firstSession148?.friendId||'');if(starter&&!touched.has(starter.id)&&vis!=='private'){const rr=rel170(starter.id);if(rr.friendship>=20||rr.trust>=16||rr.followsPlayer){markKnown170(starter.id,m,'close-network',5);touched.add(starter.id)}}if(vis==='public'||vis==='limited'){for(const a of celebs||[]){if(touched.has(a.id)||!shouldPublicCelebKnow170(a,m))continue;markKnown170(a.id,m,vis==='public'?'public-feed':'industry-ripple',vis==='public'?2:3);touched.add(a.id);if(touched.size>=18)break}}return [...touched]}
function characterPayload170(id){if(id==='kim')return null;const c=char170(id);if(!c)return null;return{id,relationship:c.relationship||{},knowledge:{recognition:c.recognition||0,familiarity:c.familiarity||0,attention:c.attention||0,lastSeenAt:c.lastSeenAt||0,lastInteractionAt:c.lastInteractionAt||0,lastSource:c.lastSource||'',knownEventIds:(c.knownEventIds||[]).slice(0,60),knownFacts:(c.knownFacts||[]).slice(0,24)},memory:{npc:c.npc||{}}}}
function queue170(m,touched){const k=ensure170();if(!k)return[];const out=[],vis=visibility170(m),at=now170(),postId=clean(m?.postId,180);if(vis!=='private'){for(const id of touched.slice(0,6)){const a=byId(id);if(!a||a.type!=='celeb')continue;const r=rel170(id),prob=.08+(r.friendship+r.trust)/500+(r.followsPlayer?.16:0);if(stable(`${m.id}|${id}|queue170`)>=Math.min(.68,prob))continue;const channel=(r.directAccess||r.followsPlayer)?'dm':(vis==='public'&&postId?'comment':'');if(!channel)continue;const q={id:`rq170-${m.id}-${id}`,sourceActionId:String(m.id),targetId:id,channel,dueAt:at+45000+Math.floor(stable(`${id}|${m.id}|delay`)*150000),status:'pending',payload:{type:m.type,summary:summary170(m),visibility:vis,postId}};if(!k.reactionQueue.some(x=>x.id===q.id))k.reactionQueue.push(q);out.push(q)}}k.reactionQueue=k.reactionQueue.filter(x=>x&&x.dueAt>at-12*3600000).slice(-80);return out}
function action170(m){return{id:String(m.id),type:clean(m.type,80),actorId:'player',subjectId:clean(m.celebrityId||m.accountId,160),visibility:visibility170(m),topic:topic170(m),payload:{summary:summary170(m),title:clean(m.title,180),text:clean(m.text,300),choice:clean(m.choice||m.decision,240),outcome:clean(m.outcome,300),city:clean(m.city,100),involved:involved170(m),postId:clean(m.postId,180),at:Number(m.at)||now170()}}}
async function post170(body){if(rt.kernelMissing)return null;try{const c=new AbortController(),t=setTimeout(()=>c.abort(),8000),r=await fetch(`${API}/scene-kernel`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body),signal:c.signal});clearTimeout(t);if(r.status>=400)rt.kernelMissing=true;return r.ok?await r.json():null}catch{rt.kernelMissing=true;return null}}
function compact170(){const out={},keys=['player','relations','dms','memory','events','notifications','pendingEvent','followingIds','followedByIds','dmAccessIds','sceneDay','worldDay','playerPosts','jobsDone','travelHistory','firstSession148','posts','stories','missions','questStage','customCelebs','lastWorldAt','lastEnergyAt','lastAutoDmAt','commentEngine66','sim58','sim66','director56','brain57','sceneDirector157','sceneStory169','sceneProposals180',KEY];for(const k of keys)if(state[k]!==undefined)out[k]=state[k];for(const k of Object.keys(state))if(/^(scene|sim|director|brain)/.test(k)&&out[k]===undefined)out[k]=state[k];/* Keep full local state, but never re-upload embedded image/audio/video data on every cloud snapshot. Uploaded media URLs remain intact. */try{return JSON.parse(JSON.stringify(out,(key,value)=>typeof value==='string'&&/^(?:data:(?:image|audio|video)\/|blob:)/i.test(value)?'':value))||{}}catch{return deep(out)||{}}}
function scheduleSnapshot170(){const k=ensure170();if(!k||rt.hydrating||k.recoveryPending)return;clearTimeout(rt.syncTimer);const delay=globalThis.SCENE_BANDWIDTH_SAFE203?300000:650;rt.syncTimer=setTimeout(()=>void syncSnapshot170(),delay)}
async function syncSnapshot170(){const k=ensure170();if(!k||rt.syncing)return;rt.syncing=true;const revision=k.revision,snapshot=compact170();const result=await post170({mode:'snapshot',key:k.playerKey,revision,snapshot});rt.syncing=false;if(result?.ok){rt.lastSyncAt=now170();k.lastSyncedRevision=Math.max(Number(k.lastSyncedRevision)||0,revision);baseSave()}}
async function persistEvent170(m,touched,reactions){const k=ensure170();if(!k)return;const chars=touched.map(characterPayload170).filter(Boolean);void post170({mode:'event',key:k.playerKey,action:action170(m),characters:chars,reactions})}
function ingest170(m){const k=ensure170();if(!k||!m?.id||k.actions.some(x=>x.id===m.id))return;const a=action170(m);k.actions.unshift(a);k.actions=k.actions.slice(0,MAX_ACTIONS);const touched=spread170(m),reactions=queue170(m,touched);baseSave();persistEvent170(m,touched,reactions);scheduleSnapshot170()}
function context170(id){const c=char170(id);if(!c)return null;return{id,recognition:c.recognition||0,familiarity:c.familiarity||0,attention:c.attention||0,lastSeenAt:c.lastSeenAt||0,lastInteractionAt:c.lastInteractionAt||0,lastSource:c.lastSource||'',relationship:c.relationship||{},knownFacts:(c.knownFacts||[]).slice(0,16),knownEventIds:(c.knownEventIds||[]).slice(0,60),npc:c.npc||{}}}
function observe170(id,m,source='feed'){const c=markKnown170(id,m,source,source==='direct'?6:2);if(c){baseSave();scheduleSnapshot170()}return context170(id)}
function eligibleCelebrity170(m,a){if(!a||a.type!=='celeb')return false;if(involved170(m).includes(a.id)){markKnown170(a.id,m,'direct',7);return true}if(knows170(a.id,m))return true;if(visibility170(m)==='public'&&shouldPublicCelebKnow170(a,m)){markKnown170(a.id,m,'public-feed',2);return true}return false}
function npcContext170(id,m=null){if(m&&visibility170(m)!=='private')observe170(id,m,'feed');const c=context170(id)||{};const n=npcLocal170(id);return{...c,affinity:n.affinity||0,familiarity:Math.max(Number(c.familiarity)||0,n.familiarity||0),playerHearts:n.playerHearts||0,playerReplies:n.playerReplies||0}}
const REL_SIGNAL_DEFAULTS170={
 positive_public_comment:{friendship:1,trust:0,chemistry:0,tension:0},
 negative_public_comment:{friendship:-2,trust:-1,chemistry:0,tension:4},
 positive_direct_interaction:{friendship:2,trust:1,chemistry:0,tension:-1},
 negative_direct_interaction:{friendship:-2,trust:-1,chemistry:0,tension:3},
 hangout_complete:{friendship:4,trust:2,chemistry:1,tension:-1},
 gift_given:{friendship:3,trust:1,chemistry:0,tension:0},
 starter_public_support:{friendship:2,trust:1,chemistry:0,tension:0},
 access_success:{friendship:2,trust:1,chemistry:0,tension:0},
 verified_public_positive:{friendship:1,trust:0,chemistry:0,tension:-1},
 verified_public_negative:{friendship:-1,trust:-1,chemistry:0,tension:2},
 neutral:{friendship:0,trust:0,chemistry:0,tension:0}
};
function relationshipSignal170(id,signal='neutral',meta={}){
 const a=byId(id),r=memoryFor(id);if(!a||a.type!=='celeb'||!r)return{friendship:0,trust:0,chemistry:0,tension:0,applied:false};
 const base=REL_SIGNAL_DEFAULTS170[signal]||REL_SIGNAL_DEFAULTS170.neutral,raw=meta?.deltas&&typeof meta.deltas==='object'?meta.deltas:{};
 const d={friendship:Math.max(-20,Math.min(20,Number(raw.friendship??raw.affinity??base.friendship)||0)),trust:Math.max(-20,Math.min(20,Number(raw.trust??base.trust)||0)),chemistry:Math.max(-20,Math.min(20,Number(raw.chemistry??raw.respect??base.chemistry)||0)),tension:Math.max(-20,Math.min(20,Number(raw.tension??raw.annoyance??base.tension)||0))};
 const floor=meta?.floor&&typeof meta.floor==='object'?{friendship:clamp170(meta.floor.friendship??meta.floor.affinity),trust:clamp170(meta.floor.trust),chemistry:clamp170(meta.floor.chemistry??meta.floor.respect),tension:meta.floor.tension===undefined&&meta.floor.annoyance===undefined?null:clamp170(meta.floor.tension??meta.floor.annoyance)}:null;
 const visibility=clean(meta.visibility||'private',24),summary=clean(meta.summary||`${a.name}: ${String(signal).replace(/_/g,' ')}`,320),record={celebrityId:id,celebrity:a.name,relationshipSignal:signal,relationshipDelta:d,relationshipFloor:floor,visibility,summary,source:clean(meta.source,80)};
 baseRemember('relationship_signal',record);const mem=state.memory?.[0];if(mem?.type==='relationship_signal')ingest170(mem);
 if((id==='kim'||id==='kim_kardashian')&&globalThis.SCENE_CHARACTER200?.recordEvent){
   const event={event_type:'relationship_signal',character_id:'kim_kardashian',visibility,participants:['player','kim_kardashian'],witnesses:[],informed:[],known_by:['kim_kardashian'],summary,payload:{signal,deltas:d,floor,source:record.source,context:meta.context||null}};
   // Kim's local scores are server-mastered (write-guarded proxy); ask her runtime to apply the starter floor now so UI shown before the server answers is right.
   if(floor)try{globalThis.SCENE_CHARACTER200?.applyStarterFloor?.()}catch{}
   void globalThis.SCENE_CHARACTER200.recordEvent(event,true);return{...d,applied:true,pendingMaster:true};
 }
 r.friendship=clamp170((r.friendship||0)+d.friendship);r.trust=clamp170((r.trust||0)+d.trust);r.chemistry=clamp170((r.chemistry||0)+d.chemistry);r.tension=clamp170((r.tension||0)+d.tension);
 if(floor){r.friendship=Math.max(r.friendship,floor.friendship);r.trust=Math.max(r.trust,floor.trust);r.chemistry=Math.max(r.chemistry,floor.chemistry);if(floor.tension!==null)r.tension=Math.min(r.tension,floor.tension)}
 const c=char170(id);if(c)c.relationship=rel170(id);baseSave();scheduleSnapshot170();return{...d,applied:true,pendingMaster:false}
}
function scoreChange170(id,m,{publicImpact=true,line=''}={}){const a=byId(id);if(!a||a.type!=='celeb')return{friendship:0,trust:0,tension:0};const direct=involved170(m).includes(id),privateMove=!publicImpact||visibility170(m)==='private',negative=/not for me|rethink|too much|don't like|do not like|bad idea|weird choice|not sure about|shouldn't|should not/i.test(String(line||'')),signal=negative?(direct?'negative_direct_interaction':'negative_public_comment'):(direct?'positive_direct_interaction':privateMove?'neutral':'verified_public_positive'),d=relationshipSignal170(id,signal,{visibility:privateMove?'private':'public',source:'scene_director',summary:summary170(m),context:{actionId:m?.id||'',line:clean(line,220)}}),c=markKnown170(id,m,direct?'direct':publicImpact?'public-reaction':'dm',direct?6:3);if(c){c.relationship=rel170(id);c.familiarity=clamp170(c.familiarity+(direct?3:1));c.attention=clamp170(c.attention+2)}baseSave();scheduleSnapshot170();return d}
function bootstrapHistory170(){const k=ensure170();if(!k||k.backfilled)return;const t=now170(),items=(state.memory||[]).slice(0,120).reverse();for(const m of items){if(!m?.id||k.actions.some(x=>x.id===m.id))continue;const direct=involved170(m).length>0,vis=visibility170(m),age=t-(Number(m.at)||0);if(direct&&age<=14*24*3600000||vis==='public'&&age<=24*3600000){k.actions.unshift(action170(m));spread170(m)}}k.actions=k.actions.slice(0,MAX_ACTIONS);k.backfilled=true;k.backfilledAt=t;baseSave();scheduleSnapshot170()}
function recordNpcReaction170(id,m,text=''){
 const s=state.commentEngine66||(state.commentEngine66={version:1,npcs:{},ledger:[],decisions:[]}),n=s.npcs[id]||(s.npcs[id]={affinity:(Math.floor(stable(id+'aff170')*37))-18,familiarity:0,lastReactionAt:0,playerHearts:0,playerReplies:0,stanceHistory:[]});
 n.lastReactionAt=now170();n.familiarity=clamp170((n.familiarity||0)+1);const low=String(text||'').toLowerCase();if(/love|rooting|happy|congrats|good for|cute|support/.test(low))n.affinity=Math.min(100,(n.affinity||0)+1);else if(/forced|not buying|mid|bad idea|don't believe|do not believe/.test(low))n.affinity=Math.max(-100,(n.affinity||0)-1);if(m?.id)markKnown170(id,m,'feed',1);baseSave();scheduleSnapshot170();return npcContext170(id,m)}
function queuedFact170(q){const k=ensure170(),c=char170(q?.targetId);if(!k||!q||!c)return null;const known=(c.knownFacts||[]).find(f=>String(f.id)===String(q.sourceActionId));if(known)return known;const a=(k.actions||[]).find(x=>String(x.id)===String(q.sourceActionId));if(!a)return null;const p=a.payload||{};return{id:a.id,type:a.type,at:Number(p.at)||now170(),visibility:a.visibility||'private',topic:a.topic||'general',summary:clean(p.summary,420),title:clean(p.title,180),text:clean(p.text,300),choice:clean(p.choice,220),outcome:clean(p.outcome,300),city:clean(p.city,100),postId:clean(p.postId,180),source:'ledger'}}
async function finishReaction170(q,status='done'){if(!q)return;q.status=status;q.completedAt=now170();q.processing=false;baseSave();scheduleSnapshot170();try{await post170({mode:'complete',key:ensure170()?.playerKey,reactionId:q.id})}catch{}}
function proactiveFallback170(a,f){if(typeof contextualDmOpener==='function'){try{const x=contextualDmOpener(a,{id:f.id,type:f.type,at:f.at,title:f.title||f.summary,text:f.text||f.summary,city:f.city||'',outcome:f.outcome||''});const seen=new Set((state.dms?.find(t=>t.id===a.id)?.messages||[]).filter(m=>m.from==='them').map(m=>String(m.text||'').trim().toLowerCase()));if(x&&!seen.has(String(x).trim().toLowerCase()))return clean(x,260)}catch{}}try{const y=a?.id!=='kim'&&globalThis.SCENE_LOGIC226?.proactive?.(a,f,'dm');if(y)return clean(y,260)}catch{}const v=typeof VOICE!=='undefined'?VOICE[a.id]||{}:{},detail=clean(f.title||f.summary||f.text,92);let line=f.topic==='music'?`saw the music update about ${detail}. how are you feeling about it now?`:f.topic==='career'?`saw what happened with ${detail}. did it actually feel like a good move?`:f.topic==='travel'?`saw you're in ${f.city||'a new city'} — work or fun?`:`I saw ${detail}. what actually happened?`;if(v.lower)line=line.charAt(0).toLowerCase()+line.slice(1);return clean(line,260)}
function proactiveCommentFallback170(a,f){try{const y=a?.id!=='kim'&&globalThis.SCENE_LOGIC226?.proactive?.(a,f,'comment');if(y)return clean(y,260)}catch{}const v=typeof VOICE!=='undefined'?VOICE[a.id]||{}:{},detail=clean(f.text||f.title||f.summary,76);let line='';if(f.topic==='music')line=`${detail?`“${detail}” — `:''}${(v.music||[])[0]||'keep going. I want to hear where this lands.'}`;else if(f.topic==='career')line=`${detail?`on “${detail}” — `:''}${(v.career||[])[0]||'this feels like a real move.'}`;else if(f.topic==='travel')line=`${f.city?`${f.city} looks good on you. `:''}${(v.default||[])[0]||'have fun.'}`;else line=detail?`“${detail}” ${(v.default||[])[0]||'okay, I see you.'}`:((v.default||[])[0]||'okay, I see you.');if(v.lower)line=line.charAt(0).toLowerCase()+line.slice(1);return clean(line,260)}
async function processReactionQueue170(){
 const k=ensure170();if(!k||rt.processingReaction||document.hidden)return;const now=now170(),pending=(k.reactionQueue||[]).filter(q=>q&&(!q.status||q.status==='pending')&&!q.processing&&Number(q.dueAt)<=now).sort((a,b)=>Number(a.dueAt)-Number(b.dueAt));const q=pending[0];if(!q)return;const a=byId(q.targetId),f=queuedFact170(q);if(!a||a.type!=='celeb'||!f||!knows170(a.id,f.id)){await finishReaction170(q,'cancelled');return}
 const d=typeof dmState==='function'?dmState(a.id):null,r=rel170(a.id),c=char170(a.id),sourcePost=f.postId?state.posts?.find(p=>p.id===f.postId):null;if(d?.messages?.some(x=>x.memoryId===f.id&&x.from==='them')){await finishReaction170(q,'done');return}if(sourcePost?.comments?.some(x=>x.authorId===a.id)){await finishReaction170(q,'done');return}if(q.channel==='dm'&&d&&(d.queue?.length||d.typing||d.pending||d.replying||d.awaitingPlayer||d.messages?.at(-1)?.from==='them')){q.dueAt=now+90000+Math.floor(stable(q.id+'retry')*120000);baseSave();return}
 rt.processingReaction=true;q.processing=true;const out=null;
 let placement=q.channel==='comment'?'comment':'dm',text='';if(!text)text=placement==='comment'?proactiveCommentFallback170(a,f):proactiveFallback170(a,f);if(placement==='comment'&&(!f.postId||!state.posts?.some(p=>p.id===f.postId)))placement='silence';if(placement==='dm'&&!r.directAccess&&!r.followsPlayer)placement='silence';
 if(placement==='dm'){
  if(!d||d.queue?.length||d.typing||d.pending||d.replying||d.awaitingPlayer||d.messages?.at(-1)?.from==='them'){q.dueAt=now170()+120000;q.processing=false;rt.processingReaction=false;baseSave();return}
  if(!text)text=proactiveFallback170(a,f);const t=now170();d.messages.push({mid:'kernel170-'+t,from:'them',text,at:t,kind:'proactive170',memoryId:f.id});d.unread=modal.dataset.dm!==a.id;d.lastInboundAt=t;d.awaitingPlayer=true;c.lastInteractionAt=t;c.lastSource='proactive-dm';c.familiarity=clamp170(c.familiarity+2);c.attention=clamp170(c.attention+2);addNotif(`${a.name} messaged you.`,'dm',{celebrityId:a.id,sourceEventId:f.id})
 }else if(placement==='comment'){
  const p=state.posts.find(x=>x.id===f.postId);if(p&&!p.comments?.some(x=>x.authorId===a.id)){p.comments=p.comments||[];p.comments.unshift({id:'kernel170-comment-'+now170(),authorId:a.id,name:a.name,handle:a.handle,text,createdAt:now170(),verified:true,likes:0,replies:[],sourceEventId:f.id,proactive170:true});c.lastInteractionAt=now170();c.lastSource='proactive-comment';c.familiarity=clamp170(c.familiarity+1);c.attention=clamp170(c.attention+2);addNotif(`${a.name} came back to your post.`,'social',{postId:p.id,celebrityId:a.id,sourceEventId:f.id})}else placement='silence'
 }
 await finishReaction170(q,placement==='silence'?'silence':'done');rt.processingReaction=false;try{if((state.tab==='feed'||state.tab==='circle')&&!modal.dataset.dm)render();else if(placement==='dm'&&modal.dataset.dm===a.id&&typeof refreshOpenDm==='function')refreshOpenDm(a.id)}catch{}
}
async function hydrate170(){const k=ensure170();if(!k||rt.hydrating||rt.kernelMissing)return;const requestKey=k.playerKey,requestGeneration=rt.generation;try{const c=new AbortController(),t=setTimeout(()=>c.abort(),8000),r=await fetch(`${API}/scene-kernel?key=${encodeURIComponent(requestKey)}`,{signal:c.signal});clearTimeout(t);if(r.status>=400)rt.kernelMissing=true;if(!r.ok)return;const d=await r.json();if(requestGeneration!==rt.generation||!state?.player||ensure170()?.playerKey!==requestKey)return;const remote=Number(d.world?.revision)||0;if(d.world?.snapshot&&remote>Number(k.revision||0)){rt.hydrating=true;const snap=d.world.snapshot;for(const [name,val] of Object.entries(snap||{}))state[name]=val;if(requestGeneration!==rt.generation||ensure170()?.playerKey!==requestKey){rt.hydrating=false;return}const fresh=ensure170();fresh.revision=remote;fresh.lastHydratedAt=now170();rt.hydrating=false;baseSave();try{render()}catch{}}else if(Array.isArray(d.characters)){for(const row of d.characters){if(row.character_id==='kim_kardashian')continue;const c2=char170(row.character_id);if(!c2)continue;const kn=row.knowledge||{},mm=row.memory||{};if((kn.knownEventIds||[]).length>(c2.knownEventIds||[]).length){c2.recognition=Number(kn.recognition)||c2.recognition;c2.familiarity=Number(kn.familiarity)||c2.familiarity;c2.attention=Number(kn.attention)||c2.attention;c2.lastSeenAt=Number(kn.lastSeenAt)||c2.lastSeenAt;c2.lastInteractionAt=Number(kn.lastInteractionAt)||c2.lastInteractionAt;c2.lastSource=kn.lastSource||c2.lastSource;c2.knownEventIds=kn.knownEventIds||c2.knownEventIds;c2.knownFacts=kn.knownFacts||c2.knownFacts;c2.npc=mm.npc||c2.npc}}baseSave()}const live=ensure170();if(Array.isArray(d.reactions)){for(const row of d.reactions){const id=String(row.reaction_id||'');if(!id||live.reactionQueue.some(x=>x.id===id))continue;live.reactionQueue.push({id,sourceActionId:String(row.source_action_id||''),targetId:String(row.target_id||''),channel:String(row.channel||'world'),dueAt:Date.parse(row.due_at)||now170(),status:'pending',payload:row.payload||{}})}}live.reactionQueue=live.reactionQueue.slice(-100);live.lastHydratedAt=now170();live.recoveryPending=false;bootstrapHistory170();if(remote<=Number(live.revision||0))scheduleSnapshot170();setTimeout(()=>void processReactionQueue170(),180)}catch{} }

save=function(){const out=baseSave();if(state?.player&&!rt.hydrating){const k=ensure170();if(k){k.revision=(Number(k.revision)||0)+1;baseSave();if(k.recoveryPending){if(!rt.recoveryKicked){rt.recoveryKicked=true;setTimeout(async()=>{try{await hydrate170()}finally{rt.recoveryKicked=false}},0)}}else scheduleSnapshot170()}}return out};
remember=function(type,data={}){const out=baseRemember(type,data);try{const m=state.memory?.[0];if(m?.type===type)ingest170(m)}catch(e){console.warn('SCENE kernel ingest',e)}return out};

/* Status-like character boundary: DMs may use only facts this character actually knows. */
if(typeof dmEventMemoryFor==='function'){
 dmEventMemoryFor=function(a){
  const eligible=new Set(['player_post','gig','event','travel','side_quest','comment_reply','verified_public','verified_comment','follow_back','story_choice','scene_milestone']);
  return (state.memory||[]).find(m=>{if(!eligible.has(m.type)||now170()-(m.at||0)>8*3600000)return false;const d=(state.dms||[]).find(x=>x.id===a.id);if(d?.messages?.some(x=>x.from==='them'&&x.memoryId===m.id))return false;if(m.dmConsumedBy===a.id)return false;const direct=involved170(m).includes(a.id);if(direct&&!knows170(a.id,m))markKnown170(a.id,m,'direct',7);return direct||knows170(a.id,m)})||null;
 };
}
async function resetCareer170(){
 const oldKey=ensure170()?.playerKey||'';
 try{Sound.stop()}catch{}
 rt.generation++;rt.hydrating=false;rt.syncing=false;rt.processingReaction=false;rt.recoveryKicked=false;clearTimeout(rt.syncTimer);
 const playerKey=uuid170();
 try{localStorage.setItem(DEVICE_KEY,playerKey)}catch{}
 state=fresh();
 state[KEY]={version:VERSION,playerKey,revision:0,installedAt:now170(),actions:[],characters:{},reactionQueue:[],lastHydratedAt:0,recoveryPending:false,backfilled:true,historyBootstrapped:true};
 baseSave();
 if(oldKey&&oldKey!==playerKey)void post170({mode:'reset',key:oldKey});
 try{render()}catch{}
}
if(typeof bind==='function'){
 const baseBind170=bind;
 bind=function(){baseBind170();const reset=document.querySelector('[data-action="reset"]');if(reset){reset.onclick=()=>{if(confirm('Restart your SCENE career? This starts a completely fresh world.'))void resetCareer170()}}};
}
function playerCanonKind170(text=''){
 const raw=clean(text,900),t=raw.toLowerCase().replace(/[’‘]/g,"'");
 if(!raw||/\b(?:we should|we need to|we gotta|we have to|want to|wanna|let'?s|can we|should we|we could)\b.{0,35}\b(?:hang out|hangout|get together|go to|visit|meet)\b/.test(t))return'';
 if(/\bremember when we\b|\blast time we\b|\bwe (?:went|were|did|hung|met|stayed|travel(?:ed|led)|visited|ate|had|saw|watched|talked|worked|shot|filmed|partied|danced)\b|\bwe've (?:been|done|gone|known|worked|hung|talked|met)\b|\byou (?:told|said|gave|showed|sent) me\b|\bi told you\b|\bwe talked about\b|\bmiss hanging\b|\b(?:i )?(?:loved|love|miss|remember|enjoyed) (?:us )?(?:hanging out|being together|our time|that trip|that night|that day)\b|\b(?:hanging out|hung out|being together)\s+(?:in|at|with)\b/.test(t))return'shared_history';
 return'';
}
function playerCanon170(id,text=''){
 const kind=playerCanonKind170(text);if(!kind||!id)return null;
 const raw=clean(text,900),recent=(state.memory||[]).find(m=>m.type==='player_declared_canon'&&m.celebrityId===id&&clean(m.text,900).toLowerCase()===raw.toLowerCase());if(recent){markKnown170(id,recent,'dm',4);return fact170(recent)}
 baseRemember('player_declared_canon',{celebrityId:id,celebrity:byId(id)?.name||id,text:raw,summary:raw,canonType:kind,playerAuthored:true,visibility:'private'});
 const m=state.memory?.[0];if(m?.type==='player_declared_canon'){ingest170(m);markKnown170(id,m,'dm',6);baseSave();scheduleSnapshot170();return fact170(m)}return null;
}
function chatMove170(text,d){
 const raw=String(text||'').trim(),t=raw.toLowerCase().replace(/[’‘]/g,"'"),resolved=d?.context?.conversation180||{};
 if(!t)return'empty';
 if(String(resolved.lastPlayerMeaning||'').trim().toLowerCase()===raw.toLowerCase()&&['family','smalltalk','proposal','schedule_query','schedule_confirmation','clarify','advice'].includes(resolved.playerIntent))return resolved.playerIntent;
 if(t==='[photo]'||/sent (?:a )?(?:photo|picture)|show you (?:a )?(?:photo|picture)/.test(t))return'photo';
 if(playerCanonKind170(raw))return'player_canon';
 if(/^(hey+|hi+|hii+|hello+|yo+|sup+|what'?s up|wassup)(?:\s+[a-z'-]{2,20}){0,2}[!?. ]*$/.test(t))return'greeting';
 if(/\b(how are you|how you doing|how have you been|wyd|what are you doing|what you doing|what are you up to|how was your day|how'?s your day|what'?s new|anything new|are you busy|you busy|you good|are you okay|what are you watching|what are you listening to|have you eaten|did you eat)\b/.test(t))return'smalltalk';
 if(/\b(wanna|want to|can we|should we|do you wanna)\b.{0,24}\b(hang|hang out|chill|meet up|see each other)\b|\bhang with you\b/.test(t))return'hangout_request';
 if((/\bkuwtk\b|keeping up/.test(t))&&/\b(we should|can we|could we|what if we|let'?s|i want to|put me on|have me on|we are doing|we'?re doing|we need to do|i should be on)\b/.test(t))return'proposal';
 if(/\b(collab|collaborat|campaign|partner|partnership|work together|team up|feature)\b|\bkylie\s*skin\b|\bskincare\b/.test(t))return'proposal';
 if(/\b(we should|can we|could we|would you|do you want to|wanna|want to|let'?s|what if we|how about we|bring back|revive|make another|do another)\b.{0,90}\b(reboot|revival|reunion|sequel|remake|spin[- ]?off|special|movie|film|series|show|episode|sitcom)\b/.test(t))return'proposal';
 const careerAccess=/\b(new york fashion week|nyfw|paris fashion week|milan fashion week|london fashion week|fashion week|runway|model(?:ling|ing)?|casting|audition|tour|concert|festival|premiere|met gala|grammys?|oscars?|emmys?|award show|red carpet|guest list)\b/.test(t)&&(/\b(can|could|would) you\b.{0,45}\b(get|put|bring|take|invite|introduce|help|ask)\b|\b(get|put|bring|take|invite|introduce|help) me\b|\bi want to\b.{0,35}\b(model|perform|act|walk|come|join|work)\b|\blet me\b.{0,25}\b(model|perform|act|walk|come|join)\b/.test(t));
 if(careerAccess)return'proposal';
 if(/^(why|why\?|meaning|meaning\?|what do you mean|what did you mean|how so|explain|keep going|go on|tell me more|what else|and\?|then\?)[!?. ]*$/.test(t))return'followup';
 if(/^(okay|ok|yeah|yes|yep|right|fair|true|lol|lmao|haha|cool|nice|cute|love that|sounds good)[!?. 😂😭]*$/.test(t))return'acknowledgement';
 if(/\b(how many followers|my followers|follower count|who am i|know me|why.*me|are we friends|do you like me|miss me)\b/.test(t))return'relationship_fact';
 if(/\b(your sister|your sisters|your brother|your brothers|your mom|your mother|your daughter|your son|your kids|your children|kendall|kylie|kourtney|khloe|khloé|kris|rob|north|saint|chicago|psalm|mason|penelope|reign|rocky|true|tatum|dream)\b/.test(t))return'family';
 return'generative';
}
if(typeof aiPersonaReply==='function'){
 aiPersonaReply=async function(a,text){
  const d=dmState(a.id),canon=playerCanon170(a.id,text),move=chatMove170(text,d);d.context=d.context||{};d.context.lastMove170=move;if(canon){d.context.playerCanon170=canon;d.context.topic=d.context.topic||'default'}
  return '';
 };
}

if(typeof finalDmLine==='function'){
 const baseFinalDmLine170=finalDmLine;
 finalDmLine=function(a,generated,input){
  if(playerCanonKind170(input)&&!String(generated||'').trim()){
   const t=String(input||''),lower=Boolean((typeof VOICE!=='undefined'?VOICE[a?.id]:null)?.lower),loc=/\b(?:went|traveled|travelled|visited|stayed|hung out|hanging out)\s+(?:to|in|at)\s+([^?.!,]{2,48})/i.exec(t)?.[1]?.trim();
   const travel=/\b(?:when .*travel|last .*travel|where .*travel|been traveling|been travelling|traveled|travelled)\b/i.test(t),hung=/\b(?:hung out|hanging|hangout)\b/i.test(t);
   let line=hung&&travel?'yeah 😂 I remember. we need to do that again. I’ve mostly been moving around for work lately.':hung?'yeah 😂 I remember. we need to do that again.':/\byou (?:told|said|gave|showed|sent) me\b/i.test(t)?'yeah, I remember that.':loc?`yeah 😂 I remember ${loc}. what made you think of that?`:'yeah 😂 I remember that. what made you think of it?';
   if(!lower)line=line.charAt(0).toUpperCase()+line.slice(1);return line;
  }
  return baseFinalDmLine170(a,generated,input);
 };
}

function bootstrapHistory170(){const k=ensure170();if(!k||k.historyBootstrapped)return;k.historyBootstrapped=true;const recent=[...(state.memory||[])].reverse().slice(-120);for(const m of recent){if(!m?.id||k.actions.some(x=>x.id===m.id))continue;const a=action170(m);k.actions.unshift(a);spread170(m)}k.actions=k.actions.sort((a,b)=>(b.payload?.at||0)-(a.payload?.at||0)).slice(0,MAX_ACTIONS);baseSave();scheduleSnapshot170()}
setTimeout(()=>{if(state?.player){ensure170();bootstrapHistory170();void hydrate170();setTimeout(scheduleSnapshot170,900);setTimeout(()=>void processReactionQueue170(),1200)}},260);
setInterval(()=>{if(state?.player&&!document.hidden)void processReactionQueue170()},5000);
window.addEventListener('focus',()=>{if(state?.player){void hydrate170();setTimeout(()=>void processReactionQueue170(),300)}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&state?.player){void hydrate170();setTimeout(()=>void processReactionQueue170(),300)}});
globalThis.SCENE_KERNEL170={version:VERSION,context:context170,npcContext:npcContext170,recordNpcReaction:recordNpcReaction170,knows:knows170,observe:observe170,eligibleCelebrity:eligibleCelebrity170,relationshipSignal:relationshipSignal170,scoreChange:scoreChange170,ingest:ingest170,playerCanon:playerCanon170,playerCanonKind:playerCanonKind170,sync:syncSnapshot170,processQueue:processReactionQueue170,visibility:visibility170,fact:fact170,inspect:()=>deep(ensure170())};
})();
