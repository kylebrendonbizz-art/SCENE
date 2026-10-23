/* SCENE v169 — persistent episode brain. Game logic stays coherent without AI; AI only enriches language. */
(()=>{
'use strict';
if(globalThis.SCENE_STORY169)return;
const VERSION=169, KEY='sceneStory169', MAX_QUEUE=12;
const at=()=>Date.now();
const clean=(v,n=260)=>String(v??'').replace(/\s+/g,' ').trim().slice(0,n);
const uniq=a=>[...new Set((a||[]).filter(Boolean))];
const hash169=s=>{let h=2166136261;for(const c of String(s||''))h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0};
const playerName=()=>state.player?.name||'You';
const starterId=()=>state.firstSession148?.friendId||'';
const starter=()=>starterId()?byId(starterId()):null;
const openingDone=()=>Boolean(state.player&&state.firstSession148?.completed);
const storyNow=()=>at();

function store(){
 if(!state.player)return null;
 if(!state[KEY]||state[KEY].version!==VERSION){
  const old=state[KEY]||{};
  state[KEY]={version:VERSION,installedAt:storyNow(),episode:Number(old.episode)||1,queue:Array.isArray(old.queue)?old.queue:[],canon:Array.isArray(old.canon)?old.canon:[],history:Array.isArray(old.history)?old.history:[],seenMemoryIds:Array.isArray(old.seenMemoryIds)?old.seenMemoryIds:[],thread:old.thread||null,bootstrapped:false,lastSeedAt:0,lastAdvanceAt:0};
  save();
 }
 const s=state[KEY];
 s.queue=Array.isArray(s.queue)?s.queue:[];s.canon=Array.isArray(s.canon)?s.canon:[];s.history=Array.isArray(s.history)?s.history:[];s.seenMemoryIds=Array.isArray(s.seenMemoryIds)?s.seenMemoryIds:[];
 return s;
}
function legacyNarration169(v=''){
 const raw=String(v||'').trim();if(!raw)return'';
 let out=raw.replace(/^[^.!?]{1,90}\s+chose\s+[“"][^”"]+[”"]\s+during\s+[^.]+\.?\s*/i,'').replace(/^You chose\s+[“"][^”"]+[”"]\.?\s*/i,'').trim();
 return out||'That decision has already changed what comes next.';
}
function repairNarration169(){
 const s=store();if(!s||s.narrationCopyRepair170)return;
 const fixFact=f=>{if(f?.summary&&/\bchose\b.+\bduring\b|^You chose\b/i.test(String(f.summary)))f.summary=legacyNarration169(f.summary)};
 fixFact(s.thread);for(const f of s.canon||[])fixFact(f);
 for(const list of [s.queue||[],s.history||[]])for(const b of list){if(b?.sub&&/\bchose\b.+\bduring\b|^You chose\b/i.test(String(b.sub)))b.sub=legacyNarration169(b.sub);fixFact(b?.fact)}
 s.narrationCopyRepair170=true;save();
}
function activeCelebs(){try{return globalThis.SCENE_DIRECTOR157?.active?.()||[]}catch{return[]}}
function guideFor(people=[]){
 const named=(people||[]).map(n=>celebs.find(a=>String(a.name||'').toLowerCase()===String(n).toLowerCase())).find(Boolean);
 if(named&&activeCelebs().some(a=>a.id===named.id))return named;
 const st=starter();if(st)return st;
 return activeCelebs()[0]||null;
}
function firstName(a){return clean(a?.name||'them',80).split(/\s+/)[0]||'them'}
function peopleIn(text=''){
 const low=' '+String(text).toLowerCase()+' ',out=[];
 for(const a of celebs||[]){const name=String(a.name||'').toLowerCase(),handle=String(a.handle||'').toLowerCase();if((name&&low.includes(name))||(handle&&low.includes('@'+handle)))out.push(a.name)}
 const aliases=[[' kim ','Kim Kardashian'],[' kris ','Kris Jenner'],[' kylie ','Kylie Jenner'],[' kendall ','Kendall Jenner'],[' khloe ','Khloé Kardashian'],[' khloé ','Khloé Kardashian'],[' kourtney ','Kourtney Kardashian'],[' sabrina ','Sabrina Carpenter'],[' tate ','Tate McRae'],[' rihanna ','Rihanna'],[' beyonce ','Beyoncé'],[' beyoncé ','Beyoncé'],[' ariana ','Ariana Grande'],[' taylor ','Taylor Swift'],[' zendaya ','Zendaya']];
 for(const [needle,name] of aliases)if(low.includes(needle))out.push(name);
 return uniq(out).slice(0,8);
}
function meaning169(m,inherit=true){
 const s=store(),raw=clean(m?.text||m?.title||m?.scenario||m?.choice||m?.decision||'',700),low=raw.toLowerCase(),people=peopleIn(raw),p=playerName();
 let kind='general',subject=raw.slice(0,100)||'latest move',summary=raw?`${p}: ${raw}`:`${p}'s latest move`,significance='ordinary';
 if(m?.type==='gig'){
  kind='job';subject=clean(m.title||'career booking',140);significance='career';summary=`${p} completed ${subject}${m.outcome?` with a ${clean(m.outcome,60)} outcome`:''}.`;/* v226: no choice read-back */
 }else if(m?.type==='travel'){
  kind='travel';subject=clean(m.city||state.player?.city||'travel',100);summary=`${p} travelled to ${subject}.`;significance='social';
 }else if(m?.type==='story_choice'){
  kind='career_story';subject=clean(m.title||'career story',140);summary=clean(m.outcome||`${subject} moved your story forward.`,260);significance='career';
 }else if(m?.type==='event'){
  kind='event';subject=clean(m.title||'live situation',140);summary=clean(m.outcome||`The moment around ${subject} moved forward.`,280);significance='social';
 }else if(['verified_public','verified_comment','starter_public_ripple'].includes(m?.type)){
  kind='celebrity_interaction';subject=clean(m.celebrity||byId(m.celebrityId)?.name||'celebrity interaction',120);summary=`${subject} interacted publicly with ${p}.`;significance='social';if(m.celebrity)people.push(m.celebrity);
 }else if(m?.type==='scene_milestone'||m?.type==='chapter_complete'){
  kind='milestone';subject=clean(m.title||'career milestone',140);summary=`${p} reached the milestone “${subject}”.`;significance='career';
 }else if(/\bkuwtk\b|keeping up with the kardashians|\b(?:episode|appearance|guest|filming|film|shoot|show)\b.{0,32}\bkeeping up\b|\bkeeping up\b.{0,32}\b(?:episode|appearance|guest|filming|film|shoot|show)\b/.test(low)){
  const kp=(state.sceneProposals180||[]).find(x=>x.type==='keeping_up_guest'&&['confirmed','completed'].includes(x.status));subject='KUWTK (Keeping Up with the Kardashians)';if(kp){kind='tv_appearance';summary=`${p} has a confirmed guest segment in the KUWTK / Kardashian-Jenner television world.`;significance='major-entertainment'}else{kind='tv_claim';summary=`${p} is talking publicly about a Keeping Up appearance, but SCENE has no confirmed production booking for it yet.`;significance='social'}if(!people.length){people.push('Kim Kardashian','Kris Jenner')}
 }else if(/(?:#\s*1|number one|no\.?\s*1|number-one)/.test(low)&&/song|single|track|record|chart|music/.test(low)){
  kind='chart_achievement';subject='#1 song/chart result';summary=`${p} says their song or single has reached number one.`;significance='major-career';
 }else if(/\b(released?|dropped|out now|available now|stream(?:ing)? now|just released|just dropped)\b/.test(low)&&/\b(song|single|track|album|record|music|ep)\b/.test(low)){
  kind='music_release';subject='new music release';summary=`${p} is announcing that music has actually been released.`;significance='career';
 }else if(/\b(studio|recording|writing|rehearsal|demo|working on|making|finishing|mixing|mastering|session)\b/.test(low)&&/\b(song|single|track|album|record|music|ep)\b/.test(low)){
  kind='music_work';subject='music work in progress';summary=`${p} is talking about music still being made, not announcing a release.`;significance='career';
 }else if(/streams?|sales|chart|spotify|apple music|billboard|stats?|numbers/.test(low)&&(/song|single|album|track|music/.test(low)||['chart_achievement','music_release','music_stats'].includes(s?.thread?.kind))){
  kind='music_stats';subject=s?.thread?.subject||'music performance statistics';summary=`${p} is following up with concrete music/chart statistics${s?.thread?.subject?` connected to ${s.thread.subject}`:''}.`;significance='career';
 }else if(/guest appearance|guest spot|appearing on|filming for|episode of|on the show/.test(low)){
  kind='tv_appearance';subject='television guest appearance';summary=`${p} says they have a guest television/show appearance.`;significance='career';
 }else if(/won|award|grammy|emmy|oscar|nomination|nominated/.test(low)){
  kind='award';subject='award or nomination';summary=`${p} is talking about an award or nomination.`;significance='major-career';
 }else if(people.length){
  kind='celebrity_reference';subject=people.join(' + ');summary=`${p} is explicitly talking about ${people.join(', ')}.`;significance='social';
 }else if(/brand|campaign|sponsor|deal|collab|collaboration/.test(low)){
  kind='brand';subject='brand/collaboration';summary=`${p} is talking about a brand or collaboration opportunity.`;significance='career';
 }else if(inherit&&s?.thread&&(/\b(this|that|it|they|them|still|again)\b|thanks|update|omg|insane|crazy|stats|numbers/.test(low))){
  kind=s.thread.kind;subject=s.thread.subject;significance=s.thread.significance||'social';summary=`${p} is following up on ${s.thread.subject}: “${raw}”`;
 }
 return{text:raw,kind,subject,summary,significance,people:uniq(people),sourceType:m?.type||''};
}
function rememberFact169(m){
 const s=store();if(!s||!m)return null;const fact={id:'fact169-'+(m.id||hash169(`${m.type}|${m.at}|${m.text||m.title||''}`)),sourceId:m.id||'',at:Number(m.at)||storyNow(),choice:clean(m.choice||m.decision,180),outcome:clean(m.outcome,240),scenario:clean(m.scenario||m.body,420),...meaning169(m,true)};
 m.sceneUnderstanding166={text:fact.text,kind:fact.kind,subject:fact.subject,summary:fact.summary,significance:fact.significance,people:fact.people};
 m.sceneStory169={factId:fact.id,summary:fact.summary,kind:fact.kind,subject:fact.subject,people:fact.people};
 s.canon.unshift(fact);s.canon=s.canon.slice(0,80);s.thread=fact;return fact;
}
function beatId(type,sourceId=''){return `beat169-${type}-${sourceId||storyNow()}-${Math.abs(hash169(`${type}|${sourceId}|${storyNow()}|${Math.random()}`)).toString(36).slice(0,5)}`}
function enqueue(beat){const s=store();if(!s||!beat)return null;const sig=beat.signature||`${beat.type}|${beat.sourceId||''}|${beat.title||''}`;if(s.queue.some(x=>x.signature===sig))return null;const b={id:beat.id||beatId(beat.type,beat.sourceId),createdAt:storyNow(),day:Number(state?.sceneDay)||0,signature:sig,...beat};s.queue.push(b);s.queue=s.queue.slice(0,MAX_QUEUE);save();return b}
function canDm169(a){if(!a||a.type!=='celeb')return false;try{if(globalThis.SCENE_ACCESS85?.hasDirectAccess)return Boolean(globalThis.SCENE_ACCESS85.hasDirectAccess(a));if(typeof canAccess==='function')return Boolean(canAccess(a))}catch{}return false}
/* v227: a beat is finished when (a) it is fallout (reaction) from an earlier Scene day, or (b) its event was already resolved
   after the beat was queued (resolved through another path, so completeMatching169 never saw it at the head). Older saves:
   beats without a day are stamped with the current day the first time they are seen (they can only expire later). */
function resolved227(b){if(!b)return '';const day=Number(state?.sceneDay)||0;if(!Number.isFinite(Number(b.day))){b.day=day;return ''}
 if(b.type==='reaction'&&Number(b.day)<day)return 'stale-fallout-v227';
 if(b.type==='event'&&b.event?.title){const t=clean(b.event.title,180);if((state.memory||[]).some(m=>m&&m.type==='event'&&(Number(m.at)||0)>(Number(b.createdAt)||0)&&clean(m.title,180)===t))return 'already-resolved-v227'}
 return ''}
function current(){const s=store();if(!s)return null;while(s.queue?.length){const b=s.queue[0];if(b?.type==='dm'&&!canDm169(byId(b.actorId))){advance('dm-access-unavailable');continue}const why=resolved227(b);if(why){advance(why);continue}return b||null}return null}
function advance(reason='done'){
 const s=store();if(!s||!s.queue.length)return null;const b=s.queue.shift();s.history.unshift({...b,completedAt:storyNow(),completedReason:reason});s.history=s.history.slice(0,80);s.lastAdvanceAt=storyNow();save();return b;
}
function reactionBeat(fact,m){return{type:'reaction',sourceId:m?.id||fact?.sourceId||'',title:fact?.subject||'See what changed',sub:fact?.summary||'The world reacted to what just happened.',label:'NEW FALLOUT',button:'See it',fact}}
function eventBeat(ev,fact,sourceId=''){
 const people=Array.isArray(fact?.people)?fact.people.filter(Boolean):[],named=people.map(n=>celebs.find(a=>String(a.name||'').toLowerCase()===String(n).toLowerCase())).find(Boolean),event={...ev,storyPeople:people,storySourceSummary:clean(fact?.summary||'',320)};
 if(named){event.storyCharacterId=named.id;event.storyCharacterName=named.name}
 return{type:'event',sourceId,title:event.title,sub:event.body,label:event.badge||'STORY BEAT',button:'Choose',event,fact}
}
function privateThreadCopy169(a,fact){
 const subject=clean(fact?.subject||'',180),kind=fact?.kind||'';
 if(kind==='event'){
  const place=(subject.match(/\bat (?:the )?(.+?)(?:[.!?]|$)/i)||[])[1];
  if(place)return `${a.name} saw how things played out at the ${clean(place,90)}. Message ${firstName(a)} and get a private read before your next move.`;
  return `${a.name} knows what happened. Message ${firstName(a)} privately and see how they read the situation.`;
 }
 if(kind==='job')return `${a.name} knows about ${subject||'the booking'}. Message ${firstName(a)} and get their take before you decide what to do next.`;
 if(kind==='celebrity_interaction'||kind==='celebrity_reference')return `The public connection is getting attention. Message ${firstName(a)} privately before the timeline decides what it means for both of you.`;
 if(kind==='milestone'||kind==='career_story')return `${a.name} has been close enough to your rise to have an opinion. Message ${firstName(a)} and talk through what comes next.`;
 if(kind==='music_work'||kind==='music_release'||kind==='music_stats'||kind==='chart_achievement')return `${a.name} knows what is happening with the music. Message ${firstName(a)} and get an honest private take.`;
 return `${a.name} knows what just happened. Message ${firstName(a)} privately before you make your next move.`;
}
function privateThreadTitle169(a,fact){const subject=clean(fact?.subject||'',150);if(fact?.kind==='event'){const place=(subject.match(/\bat (?:the )?(.+?)(?:[.!?]|$)/i)||[])[1];if(place)return `Ask ${firstName(a)} about the ${clean(place,72)}`;}if(fact?.kind==='job'&&subject)return `Get ${firstName(a)}'s take on ${subject}`;return `Talk to ${firstName(a)}`;}
function dmBeat(a,fact,title=''){if(!canDm169(a))return null;return{type:'dm',sourceId:fact?.sourceId||'',actorId:a.id,title:title||privateThreadTitle169(a,fact),sub:privateThreadCopy169(a,fact),label:'PRIVATE THREAD',button:'Message',fact}}
function composeBeat(fact,title='Put your version on the record'){return{type:'compose',sourceId:fact?.sourceId||'',title,sub:fact?.subject?`Decide what you actually want people to know about ${fact.subject}. Your post becomes the next public beat.`:'Give the timeline the next real piece of your story.',label:'YOUR MOVE',button:'Post',fact}}
function careerBeat(fact,title='Turn this into the next room'){return{type:'career',sourceId:fact?.sourceId||'',title,sub:fact?.subject?`Use the attention around ${fact.subject} to create a real career consequence.`:'Choose the next booking that moves this story forward.',label:'NEXT CAREER BEAT',button:'Choose work',fact}}
function eventDisplay169(b){
 const ev=b?.event||{},f=b?.fact||{},subject=clean(f.subject||ev.title||'',180),choice=clean(f.choice||'',140),low=subject.toLowerCase();
 if(/podcast/.test(low)&&/acoustic/.test(low))return{title:'Your acoustic take opened a new door',sub:`You played ${choice&&/newest song/i.test(choice)?'your newest song':'a song'} live for a small podcast in a Hollywood rehearsal room. Now decide whether to share the moment, use it to chase another music opportunity, or keep it moving quietly.`};
 if(f.kind==='career_story')return{title:subject||'Your last choice opened a new decision',sub:`${clean(f.summary||'',220)}${f.summary?' ':''}Now decide whether this becomes something public, something you use to open the next door, or something you leave behind and move on from.`};
 if(f.kind==='milestone')return{title:'A new part of your career just opened',sub:'You reached a new progression point. Choose what you actually want to do next rather than turning an internal game milestone into a public story.'};
 if(/^.* opens a decision$/i.test(ev.title||'')||/handled .* by choosing|This can become a one-off update/i.test(ev.body||''))return{title:subject||clean(f.summary||'',90)||'Your next move',sub:clean(f.summary||'',220)};
 return{title:ev.title||b?.title||clean(b?.fact?.subject||'',90)||'Your next move',sub:ev.body||b?.sub||''};
}

function eventFor169(fact,m){
 const g=guideFor(fact.people),gname=g?.name||'',gfirst=firstName(g),p=playerName(),subject=fact.subject;
 if(fact.kind==='tv_appearance'&&/KUWTK/i.test(subject))return{badge:'FILMING DAY',title:'KUWTK wants the real version of you',body:`The guest appearance is real now. A producer asks how personal you are willing to get on camera${gname?`, and ${gname} checks in before filming because whatever you give the episode becomes the version viewers meet first`:''}.`,visibility:'public',choices:[
  [gname?`Ask ${gfirst} for press coaching before filming`:'Ask for press coaching before filming',{rep:3,xp:8},`${gname||'Your friend'} helps you decide what belongs on camera and what stays yours. You walk into filming with a clearer boundary.`],
  ['Go in spontaneous and let the cameras find the story',{followers:95,fame:3,xp:9},'You stop trying to control every beat. The episode gets a more natural version of you, and that unpredictability becomes part of the appeal.'],
  ['Ask the producers exactly why they booked you',{rep:4,fame:1,xp:8},'You force the room to say what they see in you. That answer gives you a much clearer idea of what this appearance can do for your career.']
 ]};
 if(fact.kind==='chart_achievement')return{badge:'NUMBER ONE',title:'The No. 1 changed the room',body:`The chart result is no longer just a celebratory post. Calls, messages and new offers start arriving${gname?`, and ${gname} asks what you want this moment to become before everyone else decides for you`:''}.`,visibility:'public',choices:[
  ['Post the chart screenshot and thank the listeners',{followers:140,fame:3,xp:8},'You make the achievement concrete. Fans finally have the exact result to celebrate and share.'],
  [gname?`Call ${gfirst} and plan the next move before posting again`:'Call someone you trust and plan the next move',{rep:4,xp:10},'You turn celebration into strategy before the noise can choose your next move for you.'],
  ['Say nothing for a day and let the number travel on its own',{rep:2,fame:2,xp:7},'The silence makes the chart result feel bigger, not smaller. People keep posting the number even without a victory lap from you.']
 ]};
 if(fact.kind==='music_work')return{badge:'IN THE STUDIO',title:'The song is still becoming something',body:`${fact.summary} Nothing has been released yet. The useful choice now is what you do with the unfinished work${gname?`, especially with ${gname} close enough to give you a real opinion`:''}.`,visibility:'limited',choices:[
  ['Keep it completely private and finish the record first',{rep:3,xp:8},'You protect the unfinished version. The next reaction will be to the work, not a rollout that started too early.'],
  ['Post one tiny studio clue without calling it a release',{followers:28,fame:1,xp:6},'People know you are working, but nobody is told the song is out or even finished.'],
  [gname?`Send ${gfirst} the rough idea privately`:'Send someone you trust the rough idea privately',{rep:2,xp:8},'The unfinished work becomes a private relationship beat instead of public release hype.']
 ]};
 if(fact.kind==='music_release'||fact.kind==='music_stats')return{badge:'MUSIC MOVES',title:fact.kind==='music_release'?'The release has a life of its own now':'The numbers are becoming the story',body:`${fact.summary} The next decision is whether to feed the public story, turn the attention into work, or protect the part that still feels personal${gname?`. ${gname} is watching how you handle it`:'.'}`,visibility:'public',choices:[
  ['Share one concrete detail the fans can carry',{followers:75,fame:2,xp:7},'You give people one useful fact instead of another vague hype post, and the conversation becomes more specific.'],
  ['Use the attention to chase the next booking',{rep:3,fame:2,xp:9},'You push the public attention toward an actual career opportunity instead of letting it evaporate in the feed.'],
  [gname?`Talk to ${gfirst} privately before doing anything else`:'Talk to somebody privately first',{rep:3,xp:8},'You get an outside read before turning the moment into content.']
 ]};
 if(fact.kind==='celebrity_reference'||fact.kind==='celebrity_interaction')return{badge:'CELEBRITY ORBIT',title:`${subject} is now part of your public story`,body:`People are not only reacting to you anymore — they are interpreting what ${subject} means for your rise. You decide whether to make the connection clearer or protect it.`,visibility:'public',choices:[
  ['Acknowledge the connection like it is completely normal',{followers:55,xp:7},'The casual response makes the relationship feel more believable and less like a publicity stunt.'],
  ['Give the internet nothing else',{fame:2,rep:2,xp:6},'You refuse to explain the connection. The unanswered part becomes the thing people keep discussing.'],
  [gname?`Message ${gfirst} privately about the attention`:'Handle it privately with the person involved',{rep:3,xp:8},'You deal with the relationship before the narrative. The public story cools slightly, but the private connection gets more room.']
 ]};
 if(fact.kind==='job')return{badge:'AFTER THE BOOKING',title:`${subject} followed you out of the room`,body:`The job is over, but the choice you made inside it is now the interesting part. ${fact.summary}${gname?` ${gname} has seen enough to ask what you want to do with the attention.`:''}`,visibility:'public',choices:[
  ['Post one behind-the-scenes detail from the job',{followers:42,fame:1,xp:7},'You give the audience a real detail from the booking, so the reaction is about what actually happened instead of generic hype.'],
  [gname?`Debrief with ${gfirst} before you post anything`:'Debrief privately before posting',{rep:3,xp:8},'You talk through the room first and come away with a clearer read on what the booking actually changed.'],
  ['Skip the victory lap and chase the follow-up booking',{rep:4,xp:10},'You leave the public moment alone and use the result as leverage for the next room instead.']
 ]};
 if(fact.kind==='travel')return{badge:'NEW CITY',title:`${subject} gives you a different room`,body:`You are in ${subject}. The audience, industry and people who can open doors here are different from home. Your first move decides what kind of trip this becomes.`,visibility:'public',choices:[
  ['Let people know you landed and ask what to do',{followers:30,xp:5},'The city starts answering back and your trip becomes social immediately.'],
  ['Go straight to work before you post',{rep:3,xp:8},'You make the city part of your career before it becomes part of your feed.'],
  [gname?`Ask ${gfirst} who you should meet here`:'Ask a connection who you should meet',{rep:2,xp:7},'You use the relationship network instead of treating travel like a backdrop.']
 ]};
 if(['award','brand','career_story','milestone'].includes(fact.kind))return{badge:'STORY MOVES',title:clean(fact.subject||'',90)||(fact.kind==='career_story'?'What this moment becomes':'Your next career move'),body:fact.kind==='career_story'?`${clean(fact.summary||'That moment changed your trajectory.',260)} Make it public, use it to open another door, or leave it alone.`:(clean(fact.summary||'',220)||'A new career decision is open.'),visibility:fact.kind==='milestone'?'private':'limited',choices:[
  ['Make the achievement public and specific',{followers:45,fame:2,xp:7},'You put a concrete version of the achievement on the record and give people something real to react to.'],
  ['Use it privately to open the next door',{rep:4,xp:9},'You turn the moment into leverage instead of content.'],
  [gname?`Ask ${gfirst} for a read on it`:'Ask somebody you trust for a read on it',{rep:2,xp:7},'You bring a real relationship into the decision instead of treating the career like a menu.']
 ]};
 return null;
}
function followAfterEvent169(m,beat){
 const s=store(),fact=beat?.fact||s?.thread,choice=String(m?.choice||'').toLowerCase(),g=guideFor(fact?.people||[]);
 if(/ask|call|message|talk|debrief|privately|coach/.test(choice)&&g){const dm=dmBeat(g,fact);if(dm)return dm}
 if(/post|share|public|screenshot|acknowledge/.test(choice))return composeBeat(fact,'Follow through on what you just made public');
 if(/booking|work|chase|career|leverage|next door/.test(choice))return careerBeat(fact,'Turn the decision into the next booking');
 return g&&Math.abs(hash169(`${m?.id}|follow`))%2===0?dmBeat(g,fact):composeBeat(fact);
}
function completeMatching169(m){
 const b=current();if(!b||!m)return null;const t=Number(m.at)||storyNow();if(t+1000<(b.createdAt||0))return null;
 let match=false;
 if(b.type==='event'&&m.type==='event'&&clean(m.title,180)===clean(b.event?.title,180))match=true;
 else if(b.type==='dm'&&m.type==='dm_sent'&&m.celebrityId===b.actorId)match=true;
 else if(b.type==='compose'&&m.type==='player_post')match=true;
 else if(b.type==='career'&&['gig','story_choice'].includes(m.type))match=true;
 if(!match)return null;const done=advance(`memory:${m.type}`);return done;
}
function queueForMemory169(m,completedBeat=null){
 if(!openingDone()||!m)return;const s=store(),fact=rememberFact169(m);if(!fact)return;
 if(m.type==='dm_sent'){return}
 if(m.type==='player_post'){
  enqueue(reactionBeat(fact,m));const ev=eventFor169(fact,m);if(ev)enqueue(eventBeat(ev,fact,m.id));else enqueue(careerBeat(fact,'Turn this post into a real-world move'));return;
 }
 if(m.type==='gig'){
  enqueue(reactionBeat(fact,m));const ev=eventFor169(fact,m);if(ev)enqueue(eventBeat(ev,fact,m.id));return;
 }
 if(m.type==='story_choice'){
  enqueue(reactionBeat(fact,m));const ev=eventFor169(fact,m);if(ev)enqueue(eventBeat(ev,fact,m.id));else enqueue(composeBeat(fact,'Tell the timeline what this changed'));return;
 }
 if(m.type==='event'){
  enqueue(reactionBeat(fact,m));if(completedBeat?.type==='event'){const next=followAfterEvent169(m,completedBeat);if(next)enqueue(next)}else enqueue(composeBeat(fact,'Decide what part of the situation becomes public'));return;
 }
 if(m.type==='travel'){
  const ev=eventFor169(fact,m);if(ev)enqueue(eventBeat(ev,fact,m.id));return;
 }
 if(['verified_public','verified_comment','starter_public_ripple'].includes(m.type)){
  enqueue(reactionBeat(fact,m));const a=byId(m.celebrityId)||guideFor(fact.people);if(a)enqueue(dmBeat(a,fact,`Talk to ${firstName(a)} after the public interaction`));return;
 }
 if(['scene_milestone','chapter_complete'].includes(m.type)){
  const ev=eventFor169(fact,m);if(ev)enqueue(eventBeat(ev,fact,m.id));else enqueue(careerBeat(fact));return;
 }
}
function ingest169(m){
 const s=store();if(!s||!m||!openingDone())return;const key=m.id||`${m.type}|${m.at}|${m.text||m.title||''}`;if(s.seenMemoryIds.includes(key))return;const completed=completeMatching169(m);s.seenMemoryIds.unshift(key);s.seenMemoryIds=s.seenMemoryIds.slice(0,220);queueForMemory169(m,completed);save();
}
function proactive169(){
 const s=store();if(!s||!openingDone()||s.queue.length)return;const st=starter(),career=state.player.career||'Creator',thread=s.thread;
 if(thread){const ev=eventFor169(thread,{type:thread.sourceType});if(ev){enqueue(eventBeat(ev,thread,thread.sourceId));return}}
 if(st){
  const bank={Music:`${st.name} has a small music-industry room you would never get into from a cold email. ${firstName(st)} can bring one person, and it's you.`,Acting:`${st.name} hears about a small industry room where casting people are actually talking, not posing for photos, and offers to bring you.`,Fashion:`${st.name} has a last-minute invitation to a room full of stylists, photographers and brand people. ${firstName(st)} says come, if you can handle being the least famous person there.`,Creator:`${st.name} is going to a launch where creators, brand people and press will all be in the same room, and wants to bring you instead of another established name.`};
  enqueue(eventBeat({badge:'YOUR CONNECTION',title:`${firstName(st)} has a door open`,body:bank[career]||bank.Creator,visibility:'limited',choices:[[`Go and let ${firstName(st)} introduce you`,{energy:-6,xp:10,rep:2},`${st.name} makes the introduction, but you have to carry the room yourself after that.`],[`Ask ${firstName(st)} why now`,{xp:8,rep:3},`The conversation tells you what ${st.name} actually sees in your potential — and that changes how you enter the room.`],['Pass and build something of your own tonight',{energy:5,rep:2,xp:6},`You skip the borrowed access and make a quieter move that belongs completely to you.`]]},{kind:'celebrity_connection',subject:st.name,summary:`${st.name} offers ${playerName()} access to a room through an existing relationship.`,people:[st.name],sourceId:'proactive-'+storyNow(),significance:'social'},'proactive-'+storyNow()));return;
 }
 enqueue(careerBeat(null,'Choose the next move that gives the world a new reason to care'));
}
function bootstrap169(){
 const s=store();if(!s||s.bootstrapped||!openingDone())return;s.bootstrapped=true;
 const recent=(state.memory||[]).find(m=>['gig','player_post','event','story_choice','travel','verified_public','verified_comment','scene_milestone'].includes(m.type)&&storyNow()-(m.at||0)<45*60000);
 if(recent){rememberFact169(recent);s.seenMemoryIds.unshift(recent.id||`${recent.type}|${recent.at}`);const fact=s.thread,ev=eventFor169(fact,recent);if(ev)enqueue(eventBeat(ev,fact,recent.id));else proactive169()}else proactive169();save();
}
function objective169(){
 if(!openingDone())return null;bootstrap169();if(!current())proactive169();const b=current();if(!b)return null;
 if(b.type==='reaction')return{icon:'♡',label:b.label||'NEW FALLOUT',title:b.title||'See what changed',sub:b.sub||'The world has reacted to the last beat.',action:`story169:${b.id}`,button:b.button||'See it'};
 if(b.type==='event'){const d=eventDisplay169(b);return{icon:'✦',label:b.label||'STORY BEAT',title:d.title,sub:d.sub,action:`story169:${b.id}`,button:b.button||'Choose'}}
 if(b.type==='dm'){const a=byId(b.actorId),title=a?privateThreadTitle169(a,b.fact):b.title,sub=a?privateThreadCopy169(a,b.fact):b.sub;return{icon:'✉',label:b.label||'PRIVATE THREAD',title:title||b.title||`Talk to ${firstName(a)}`,sub:sub||b.sub,action:`story169:${b.id}`,button:b.button||'Message'}}
 if(b.type==='compose')return{icon:'＋',label:b.label||'YOUR MOVE',title:b.title,sub:b.sub,action:`story169:${b.id}`,button:b.button||'Post'};
 if(b.type==='career')return{icon:'◉',label:b.label||'NEXT CAREER BEAT',title:b.title,sub:b.sub,action:`story169:${b.id}`,button:b.button||'Choose work'};
 return null;
}
function act169(id){
 const b=current();if(!b||b.id!==id)return false;
 if(b.type==='reaction'){
  try{globalThis.SCENE_DIRECTOR157?.tick?.()}catch{}advance('viewed-fallout');state.tab='feed';save();render();return true;
 }
 if(b.type==='event'){
  state.pendingEvent={...b.event,sceneStory169:true,storyBeatId:b.id,storySourceId:b.sourceId||''};
  if(b.event?.storyCharacterId&&!(state.memory||[]).some(m=>m.type==='story_context'&&m.storyBeatId===b.id)){
   remember('story_context',{celebrityId:b.event.storyCharacterId,celebrity:b.event.storyCharacterName||byId(b.event.storyCharacterId)?.name||'',title:b.event.title,summary:b.event.body||b.fact?.summary||b.event.title,peopleInvolved:b.event.storyPeople||[],storyBeatId:b.id,visibility:b.event.visibility||'limited'});
  }
  save();openEvent(state.pendingEvent);return true;
 }
 if(b.type==='dm'){const a=byId(b.actorId);if(a&&canDm169(a)){try{const d=dmState(a.id);if(d&&state?.firstSession148?.friendId!==a.id&&Number(d.replyCredits)<=0)d.replyCredits=5;if(d)d.sceneStoryPass169=true;save()}catch{}openDm(a.id);return true}advance('dm-access-unavailable');render();return false}
 if(b.type==='compose'){openCompose();return true}
 if(b.type==='career'){state.tab='world';state.careerView='work';save();render();return true}
 return false;
}
function context169(){const s=store(),b=current();return s?{episode:s.episode,thread:s.thread?{kind:s.thread.kind,subject:s.thread.subject,summary:s.thread.summary,people:s.thread.people}:null,current:b?{type:b.type,title:b.title,sub:b.sub}:null,recentCanon:s.canon.slice(0,5).map(x=>({kind:x.kind,subject:x.subject,summary:x.summary,people:x.people}))}:null}

const rememberBefore169=remember;
remember=function(type,data={}){const out=rememberBefore169(type,data);try{const m=state.memory?.[0];if(m?.type===type&&['player_post','gig','event','story_choice','travel','verified_public','verified_comment','starter_public_ripple','scene_milestone','chapter_complete','dm_sent'].includes(type))ingest169(m)}catch(e){console.warn('SCENE story169 ingest',e)}return out};

setTimeout(()=>{try{if(state?.player&&openingDone()){repairNarration169();bootstrap169();render()}}catch(e){console.warn('SCENE story169 init',e)}},220);
globalThis.SCENE_STORY169={version:VERSION,objective:objective169,act:act169,context:context169,inspect:()=>JSON.parse(JSON.stringify(store())),seed:m=>ingest169(m),meaning:m=>meaning169(m,true),proactive:proactive169};
})();
/* v227 logic modules (flow2): day-one goals, next-up driver, flow2 (viral feed, side-quest auto-claim, Activity badge, SCENE_CAREER) */
(()=>{if(globalThis.SCENE_V227_LOADER)return;globalThis.SCENE_V227_LOADER=true;const q=(()=>{try{return (document.currentScript?.src||'').split('?')[1]||''}catch{return''}})(),files=['scene-day1-v227.js','scene-next-v227.js','scene-flow2-v227.js'];
 const load=i=>{if(i>=files.length)return;const s=document.createElement('script');s.async=false;s.src=`./v224/${files[i]}${q?'?'+q:''}`;s.onload=()=>load(i+1);s.onerror=()=>{console.warn('v227 load failed',files[i]);load(i+1)};document.head.appendChild(s)};
 const t0=Date.now(),wait=()=>{if(globalThis.SCENE_LOGIC226||Date.now()-t0>8000)load(0);else setTimeout(wait,50)};wait()})();
