/* SCENE v226 — gameplay logic layer (additive, loads last).
   Rules: fame raises visibility / reply chance only; friendship & trust only move from real interactions.
   Structured state decides willingness (reply / delay / brush-off / ignore) BEFORE any DM line is rendered.
   Kim is excluded everywhere (server resolver owns her). Save-safe: only adds state.logic226 and relation.recognition226. */
(()=>{'use strict';
if(globalThis.SCENE_LOGIC226)return;
const VERSION=226;
const BANNED=["\\bthank(s| you)\\b.*\\bthank(s| you)\\b","^love (this|it)!*$","\\blove this!+","\\blet me know if (you need|there'?s) anything\\b","\\bi'?m (always )?here for you\\b","\\byou'?ve got this\\b","\\bkeep (shining|slaying|going,? superstar)\\b","\\bstay tuned\\b","\\bhope (this|that) helps\\b","\\bfeel free to (reach out|ask)\\b","\\bsending (you )?(love|good vibes|hugs)\\b","\\b(autograph|signed (photo|copy|poster)|fan ?mail address|self-addressed)\\b","\\bmy team will (be in touch|reach out)\\b","\\bis there anything else\\b","\\bhave a (great|wonderful|blessed) day\\b","\\bremember to breathe\\b","\\bbelieve in yourself\\b","\\bdestined for greatness\\b","\\byour energy is unmatched\\b","\\bso proud of you\\b","\\bthat sounds incredibly exciting\\b","\\blet'?s make it happen\\b","\\bthis could be huge for your career\\b"].map(s=>{try{return new RegExp(s,'i')}catch{return null}}).filter(Boolean);
const isKim=id=>id==='kim'||id==='kim_kardashian';
const celebOk=a=>a&&a.type==='celeb'&&!isKim(a.id)&&!a.custom;
const FAME_ONLY=new Set(['verified_public_positive','access_success']);   // being seen / a team opening a line is not friendship
const ONE_SIDED=new Set(['positive_public_comment']);                      // player commenting on their post: tiny, capped
const ONE_SIDED_CAP=15;                                                    // public-only contact can't lift you past stranger tier
const DM_DAILY_CAP=2, DM_FRIENDSHIP_CEIL=50;                               // chatting alone can't make you close friends
const T=()=>Date.now();
const roll=s=>(Math.abs(typeof hash==='function'?hash(String(s)):0)%1000)/1000;
const store=()=>{if(!state.logic226||typeof state.logic226!=='object')state.logic226={version:VERSION,dmDay:{},log:[],repaired:{}};const s=state.logic226;s.dmDay=s.dmDay||{};s.log=Array.isArray(s.log)?s.log:[];s.repaired=s.repaired||{};return s};
const rel=id=>memoryFor(id);
function noteRecognition(id,n=1){const r=rel(id);if(r)r.recognition226=Math.min(100,(Number(r.recognition226)||0)+n)}
function log(e){const s=store();s.log.unshift({at:T(),...e});s.log=s.log.slice(0,60)}
function tier(id){const r=rel(id)||{},f=Number(r.friendship)||0;if((Number(r.tension)||0)>=35)return'rival';return f<=15?'stranger':f<=50?'acquaintance':f<=70?'friend':'close'}
const isStarter=id=>state.firstSession148?.friendId===id;

/* ---------- 1. fame vs friendship: wrap the kernel's public entry points ---------- */
function installKernel(){
 const k=globalThis.SCENE_KERNEL170;if(!k||k.__logic226)return;k.__logic226=true;
 const baseSignal=k.relationshipSignal,baseScore=k.scoreChange;
 if(typeof baseSignal==='function')k.relationshipSignal=function(id,signal='neutral',meta={}){
  if(isKim(id)||!rel(id))return baseSignal.call(this,id,signal,meta);
  meta=meta&&typeof meta==='object'?meta:{};
  if(FAME_ONLY.has(signal)){noteRecognition(id);const t=Number(meta.deltas?.tension??(signal==='verified_public_positive'?-1:0))||0;meta={...meta,deltas:{friendship:0,trust:0,chemistry:0,tension:Math.min(0,t)},logic226:'fame_only'}}
  else if(ONE_SIDED.has(signal)){noteRecognition(id);if((Number(rel(id).friendship)||0)>=ONE_SIDED_CAP)meta={...meta,deltas:{...(meta.deltas||{}),friendship:0},logic226:'one_sided_cap'}}
  return baseSignal.call(this,id,signal,meta)};
 if(typeof baseScore==='function')k.scoreChange=function(id,m,opts={}){
  if(isKim(id)||!rel(id))return baseScore.call(this,id,m,opts);
  const r=rel(id),before={f:Number(r.friendship)||0,t:Number(r.trust)||0},t0=T()-1,out=baseScore.call(this,id,m,opts);
  const sig=(state.memory||[]).find(x=>x?.type==='relationship_signal'&&x.celebrityId===id&&(Number(x.at)||0)>=t0);
  if(sig&&FAME_ONLY.has(sig.relationshipSignal)){r.friendship=Math.min(Number(r.friendship)||0,before.f);r.trust=Math.min(Number(r.trust)||0,before.t);noteRecognition(id);if(out&&typeof out==='object'){out.friendship=0;out.trust=0}sig.logic226='fame_only_reverted';save()}
  return out};
}

/* ---------- 2. DM willingness gate (non-Kim celebrities) ---------- */
const PROPOSALISH=/\b(collab|collaborat|campaign|partner|work together|team up|feature|movie|film|series|show|episode|casting|audition|tour|festival|premiere)\b/i;
const FAVOUR=/share my (song|post|music)|follow me back|shout ?out|promo|repost|autograph|sign (my|this)|guest ?list|tickets?\b/i;
const RUDE=/\b(stupid|idiot|shut up|hate you|ugly|trash|loser|fake)\b/i;
function burst(d){let n=0;for(let i=d.messages.length-1;i>=0;i--){const m=d.messages[i];if(m.from==='them'&&(m.text||m.image))break;if(m.from==='me')n++}return n}
function decide(a,d,job,delayed=false){
 const id=a.id,t=tier(id),b=burst(d),fame=Number(state.player?.fame)||0,text=String(job?.text||''),x=roll(`${job?.mid}|${delayed?'d':'q'}|gate226`),proposal=PROPOSALISH.test(text);
 const why={tier:t,burst:b,fame,starter:isStarter(id)};
 if(t==='rival'){if(x<.25)return{action:'reply',...why,reason:'tension_but_answers'};if(proposal)return{action:'brush',...why,reason:'tension'};return{action:x<.6?'ignore':'brush',...why,reason:'tension'}}
 if(b>=5)return{action:proposal||x<.55?'brush':'ignore',...why,reason:'flood'};
 if(b>=3&&t!=='close'&&!delayed)return{action:'delay',...why,reason:'double_text',after:decide(a,d,job,true)};
 if(isStarter(id)||t==='friend'||t==='close')return{action:'reply',...why,reason:'knows_you'};
 let p=t==='stranger'?.35:.72;p+=Math.min(.2,fame/500);            // fame = visibility -> more likely to answer, not closer
 if(FAVOUR.test(text))p-=t==='stranger'?.3:.15;                    // asking favours of people who don't know you
 if(delayed)p+=.15;
 if(x<p)return{action:'reply',...why,reason:'willing',p:+p.toFixed(2)};
 if(!delayed)return{action:'delay',...why,reason:'busy',p:+p.toFixed(2),after:decide(a,d,job,true)};
 return{action:proposal?'brush':'ignore',...why,reason:'not_interested',p:+p.toFixed(2)};
}
const BRUSH={
 stranger:['who is this?','sorry, do i know you?','what is this about?','hi. what do you need?'],
 acquaintance:['can’t really talk right now','in the middle of something. later','busy day, give me a bit'],
 friend:['one sec, i’m in the middle of something','can’t talk rn, later'],
 close:['can’t talk rn, later'],
 flood:['that’s a lot of messages','i saw them. i’m just busy','one message is plenty 😭'],
 rival:['noted.','not really in the mood for this','we’re not doing this right now','k.']
};
function brushLine(a,d,g){
 const bank=BRUSH[g.reason==='flood'?'flood':g.tier]||BRUSH.acquaintance,recent=new Set(d.messages.filter(m=>m.from==='them').slice(-6).map(m=>String(m.text||'').toLowerCase()));
 const start=Math.floor(roll(`${a.id}|${d.messages.length}|brush226`)*bank.length);let line=bank[start];
 for(let i=0;i<bank.length;i++){const c=bank[(start+i)%bank.length];if(!recent.has(c.toLowerCase())&&!BANNED.some(r=>r.test(c))){line=c;break}}
 const lower=Boolean((typeof VOICE!=='undefined'?VOICE[a.id]:null)?.lower);return lower?line:line.replace(/^[a-z]/,c=>c.toUpperCase());
}
function gateNewJob(id){
 const a=byId(id);if(!celebOk(a))return;const d=dmState(id),job=d.queue[d.queue.length-1];if(!job||job.gate226)return;
 let g=decide(a,d,job);
 const F=globalThis.SCENE_LOGIC226?.__forceNext;if(F){globalThis.SCENE_LOGIC226.__forceNext=null;g={...g,action:F,reason:'forced_test',after:F==='delay'?{action:'reply'}:null}} /* harness-only, not persisted */
 /* one answer per burst: if an earlier message in this burst already gets a reply, this one is just read */
 const earlier=d.queue.slice(0,-1).map(j=>j.gate226?.final);
 const head=d.queue.length>1?d.queue[0]:null;
 if(!F&&head?.gate226){ /* burst = every player message since the last celeb reply; it is decided and answered as ONE unit (same as Kim's runtime) */
  g={...g,action:'merge',reason:'burst',after:null};
  if(head.gate226.final==='reply'&&d.queue.length>=5){head.gate226.final='brush';head.gate226.reason='flood'}
 }
 job.gate226=g;
 /* delay = 6-18 s real time (hard cap 20 s): normal 'Seen' first, held, then the stock typing indicator for the last 1-3.4 s */
 if(g.action==='merge'){job.gate226.final='merge'}else if(g.action==='delay'){job.delayMs226=Math.min(20000,6000+Math.floor(roll(job.mid+'|wait')*12000));job.gate226.final=g.after?.action||'reply'}else job.gate226.final=g.action;
 log({id,action:g.action,final:job.gate226.final,reason:g.reason,tier:g.tier,burst:g.burst});save();
}
function dropIgnored(){
 let changed=false;
 for(const d of state.dms||[]){const job=d.queue?.[0];if(!job||job.generating||job.gate226?.final!=='ignore'||isKim(d.id))continue;
  if(T()<(Number(job.dueAt)||0))continue;
  const ids=new Set([job.mid,...d.queue.slice(1).filter(j=>j.gate226?.final==='merge').map(j=>j.mid)]);
  for(const m of d.messages)if(m.from==='me'&&ids.has(m.mid))m.status='seen';
  d.queue=d.queue.filter(j=>!ids.has(j.mid));d.typing=false;d.pending=d.queue.length>0;d.awaitingPlayer=false;
  const s=store();s.leftOnRead=s.leftOnRead||{};s.leftOnRead[d.id]=(s.leftOnRead[d.id]||0)+1;changed=true;
  try{if(modal.dataset.dm===d.id)refreshOpenDm(d.id)}catch{}}
 if(changed)save();
}
function holdSeen(){
 /* delayed reply timeline, anchored to when the player's message was sent (sentAt):
    'Seen' until sentAt+delay-3s, then the stock typing indicator until sentAt+delay (delay 6-18 s, so always < 20 s) */
 for(const d of state.dms||[]){const job=d.queue?.[0];if(!job||!job.delayMs226||job.gate226?.final==='ignore')continue;
  const sentAt=Number(d.messages.find(m=>m.mid===job.mid)?.at)||Number(job.at)||T(),replyAt=sentAt+job.delayMs226;
  if(job.stage==='seen'&&!job.seenHold226){job.seenHold226=true;job.dueAt=Math.max(Number(job.dueAt)||0,replyAt-3000);d.typing=false;save()}
  else if(job.stage==='typing'&&!job.typingHold226){job.typingHold226=true;job.dueAt=Math.max(T()+1050,Math.min(replyAt,T()+3400));save()}}
}
function dmRelationship(a,job,replied){
 if(!replied||!celebOk(a))return;const k=globalThis.SCENE_KERNEL170;if(!k?.relationshipSignal)return;const text=String(job?.text||'');
 if(RUDE.test(text)){k.relationshipSignal(a.id,'negative_direct_interaction',{visibility:'private',source:'dm_logic226',summary:`Player was rude to ${a.name} in DMs.`});return}
 const s=store(),day=Number(state.sceneDay)||0,key=`${a.id}|${day}`;if((s.dmDay[key]||0)>=DM_DAILY_CAP)return;if(text.replace(/\W/g,'').length<6)return;
 const r=rel(a.id);if((Number(r.friendship)||0)>=DM_FRIENDSHIP_CEIL)return;
 s.dmDay[key]=(s.dmDay[key]||0)+1;for(const k2 of Object.keys(s.dmDay))if(Number(k2.split('|').pop())<day-3)delete s.dmDay[k2];
 k.relationshipSignal(a.id,'positive_direct_interaction',{visibility:'private',source:'dm_logic226',summary:`Real DM back-and-forth with ${a.name}.`,deltas:{friendship:1,trust:1,chemistry:0,tension:-1}});
}
function installDm(){
 if(typeof sendDm!=='function'||typeof deliverDmJob!=='function'||typeof processDmQueues!=='function')return false;
 const baseSend=sendDm,baseDeliver=deliverDmJob,baseProcess=processDmQueues;
 sendDm=function(id,text,image=''){const out=baseSend.apply(this,arguments);try{gateNewJob(id)}catch(e){console.warn('logic226 gate',e)}return out};
 processDmQueues=function(){try{dropIgnored()}catch(e){console.warn('logic226 ignore',e)}const out=baseProcess.apply(this,arguments);try{holdSeen()}catch(e){console.warn('logic226 seen',e)}return out};
 deliverDmJob=async function(id,job){
  const a=byId(id),g=job?.gate226;
  if(!celebOk(a)||!g)return baseDeliver.apply(this,arguments);
  if(g.final==='merge')return; /* folded into the head job of its burst */
  if(g.final==='ignore'){dropIgnored();return}
  {const d=dmState(id);if(job.generating)return;
   const lastMine=[...d.messages].reverse().find(m=>m.from==='me');
   if(lastMine&&T()-Number(lastMine.at||0)<1600){job.dueAt=T()+900;d.typing=true;return} /* player still typing: wait for the pause */
   const burst=[job,...d.queue.filter(j=>j!==job&&j.gate226?.final==='merge')];
   if(burst.length>1){const last=burst[burst.length-1],ids=new Set(burst.map(j=>j.mid));
    for(const m of d.messages)if(m.from==='me'&&ids.has(m.mid))m.status='seen';
    last.text=burst.map(j=>String(j.text||'[photo]').trim()).filter(Boolean).join('\n');last.gate226={...g,final:g.final,burstIds:[...ids]};last.stage=job.stage;last.dueAt=job.dueAt;last.generating=false;
    d.queue=[last,...d.queue.filter(j=>!ids.has(j.mid))];job=last;arguments[1]=last}}
  if(g.final==='brush'){const d=dmState(id);const line=brushLine(a,d,g),at=T();
   d.messages.push({mid:'m'+at+Math.random(),from:'them',text:line,at,replyTo:job.mid,ai:false,logic226:g.reason});
   d.queue=d.queue.filter(x=>x.mid!==job.mid);d.typing=false;d.pending=false;d.lastInboundAt=at;d.awaitingPlayer=true;d.unread=modal.dataset.dm!==id;
   try{dmUpdateConversation180(a,d,line,'them')}catch{}
   remember('dm_reply',{celebrityId:id,celebrity:a.name,text:line,inReplyTo:job.text,turnId:job.mid,ai:false,willingness226:g.reason});save();
   try{if(modal.dataset.dm===id)refreshOpenDm(id);else addNotif(`${a.name} replied to you.`,'dm',{celebrityId:a.id})}catch{}
   return}
  const out=await baseDeliver.apply(this,arguments);try{dmRelationship(a,job,true)}catch(e){console.warn('logic226 rel',e)}return out};
 return true;
}

/* ---------- 3. one-time save repair of old "X chose…" read-back narration ---------- */
const OLD=[[/,\s*where [^,.!?“”"]{1,40}? chose to [^.!?“”"]*/g,''],[/\s+after choosing [^.!?()“”"]*?(?=\s*[.!?()“”"]|$)/g,''],[/;\s*you chose [^)]*/g,'']];
function repairNarration(){
 const s=store();if(s.repaired.narration)return;let n=0;const seen=new Set();
 const walk=(o,depth)=>{if(!o||typeof o!=='object'||depth>7||seen.has(o))return;seen.add(o);
  for(const k of Object.keys(o)){const v=o[k];if(k==='memory'&&depth===0)continue;
   if(typeof v==='string'&&/chose to|after choosing|you chose/.test(v)){let nv=v;for(const [re,rep] of OLD)nv=nv.replace(re,rep);if(nv!==v){o[k]=nv;n++}}
   else if(v&&typeof v==='object')walk(v,depth+1)}};
 walk(state,0);s.repaired.narration={at:T(),fixed:n};save();
}

/* ---------- 4. voice + reply layer for non-Kim celebrities (logic2). Kim never reaches this code. ----------
   Intent parsing re-uses runtime v200's reply kit (SCENE_REPLYKIT200: places / activities / when / normLine) and
   mirrors its intent order (hostile → plans → how-are-you → wyd → work → compliments → thanks → greetings → story).
   Game state decides first: the willingness gate (section 2) already chose reply/brush/ignore; tier + thread memory pick the line. */
const KIT=()=>globalThis.SCENE_REPLYKIT200||null;
const norm=x=>{const k=KIT();return k?.normLine?k.normLine(x):String(x||'').toLowerCase().replace(/[^a-z0-9' ]/g,' ').replace(/\s+/g,' ').trim()};
/* compact public-persona styles from /workspace/scene-work/voice-sheets (fictionalised personas) */
const STYLE={
 sabrina:{lower:false,emoji:['😭','🙂']},charli:{lower:true,emoji:['😭']},tatemcrae:{lower:true,emoji:['😭']},sydney:{lower:true,emoji:['😂','🙂']},
 timothee:{lower:false,emoji:['😂']},zendaya:{lower:true,emoji:['🤍']},hailey:{lower:true,emoji:['👀','🤍']},kendall:{lower:true,emoji:['😂']},
 kylie:{lower:true,emoji:['👀','😭']},doja:{lower:true,emoji:['😭','💀']}
};
const OV={ /* per-character overrides, written from each voice sheet's tics/tier rules; {k}=topic word, {p}=place, {a}=activity */
 sabrina:{greet:['Hi. Dangerous timing, what’s up?','Oh, hello. What’s going on?','Hiii. To what do I owe this?','Heyyy. Explain yourself.','Hello. I’m listening, allegedly.','Hi 😭 what did you do'],how:['Good. Tired in a glamorous way. You?','Fine, allegedly. You?','Thriving, with several reservations. You?','Unfortunately great. How are you?','Honestly good. Slightly feral. You?','Doing well, legally speaking. You?'],wyd:['Writing. Allegedly.','Pretending to rest. You?','Rewriting one line for the fourth time. Normal behaviour.','Avoiding a voice memo I recorded at 2am.','Writing something that’s either genius or terrible. Promising.','Nothing I can legally discuss 😇','Working. Glamorously. What’s up?','Working, which sounds more impressive than it is. You?','At work, being a professional. Allegedly.','Working on something I’m not allowed to describe. Tragic.'],favour:['Bold opener. I respect it. No.','I don’t do favours by DM. It’s a whole policy. I wrote it.','Respectfully, that’s a big ask for a text.','If it’s a song, send it and I’ll tell you if it’s good. That’s all I’m promising.','Absolutely not, but I admire the confidence 🙂','My legal team (me) has reviewed this and says no.'],rude:['Noted 🙂','Respectfully, no.','Wow. Filed under things you’ll regret.','That was a choice.','I’m going to pretend you didn’t send that 🙂','Bold. Wrong, but bold.'],compliment:['Stop. I’m going to get unbearable.','Okay, I’ll allow it.','Say that again but slower.','Dangerous thing to tell me. I’ll never recover.','Noted, framed, and going on the fridge.','You’re only saying that because it’s true 😇'],pub:['{K} is dangerously postable.','Unfortunately {k} is the good part.','I support this with several reservations.','{K}? Tragic. I love it.','Explain.','This is either genius or terrible. Promising.','{K} has my full legal support.']},
 charli:{greet:['heyyy what are u doing','hi lol what’s up','hi. what’s happening','oh hi lol','hiii ok go','yo what’s going on'],how:['tired. good tired. u?','alive. barely. you?','aliveeee. u?','chaotic but fine lol. u?','good actually. suspicious. u?','running on 3am demos lol. you?'],wyd:['studio. making it louder','nothing. which is suspicious. u?','making something ruder than it needs to be','listening to the same 8 bars on loop lol','arguing with a kick drum. u?','ignoring label notes lol'],favour:['i don’t do favour posts lol','lol no promises. like none','hmm. that’s not how i work','no lol. i don’t run that and i’m not starting now','if it’s music send it. if it’s anything else it’s probably a no','that’s a big ask over text lol'],rude:['ok bye','that’s not it','lol ok','boring. try again','ok.','wow ok. noted'],compliment:['stop lol','ok i’ll take it','ok wait say more','lol ur being nice. suspicious','real. but stop','ok that’s actually nice 🖤'],pub:['{k} is too tasteful. make it ruder','real','this sounds like 4am in a good way','{k} is the lore. keep it','make it louder','lol real','ok {k} is actually good']},
 tatemcrae:{greet:['heyyy','hii what’s up','hiii','hey lol what’s going on','waittt hi','hey! sorry i’m slow, what’s up'],how:['so tired lol rehearsal legs. u?','good! exhausted. you?','i’m so tired but good lol. you?','sore. happy. mostly sore. u?','honestly good. my legs are not. you?','good! running on no sleep lol. you?'],wyd:['rehearsal. my legs are gone','lying on the floor after rehearsal lol','icing my knees. glamorous','running the same eight counts until i hate them lol','nothing for once. it’s weird','about to sleep for a year'],favour:['lol i can’t really do that sorry','i don’t really share stuff i haven’t heard yet','hmm no promises lol','sorry lol that’s not really a me thing','i’d get in so much trouble lol','if it’s a song, okay send it. anything else is a no sorry'],rude:['wow okay','um okay','okay that was mean lol','sorry what?','okay. not doing this','um. bye lol'],compliment:['stopp 😭','that’s so nice lol','stoppp okay','wait that’s really sweet','okay i’m blushing lol','nooo stop 😭'],pub:['waittt {k} 😭','that is crazy lol','waittt this','{k} looks exhausting in the best way','okay the energy here','not me watching this four times lol','{k} is so good wait']},
 sydney:{greet:['hey! what’s up','hi hi','hey, what’s going on?','hii. what’s up?','hey! sorry, between things. what’s up?','hi! okay what’s happening'],how:['good! long call time today. you?','tired but good. you?','good, call time was brutal though. you?','busy in a good way. you?','honestly good. had a garage morning lol. you?','running around but good. how are you?'],wyd:['between setups lol','in the car. what’s up?','waiting on a lighting change lol','hiding in my trailer between scenes','going through script notes. you?','nothing exciting. you?'],favour:['wait what is this for?','i don’t really post stuff as a favour, sorry','that’s not really how i do things','i can’t do that one, sorry','that has to go through proper channels, not my dms','i don’t say yes to things over dm. ever'],rude:['okay that was weird','wow. okay','yeah i’m not doing this','okay. bye','not sure what that was, but no','that’s a lot. i’m going to go'],compliment:['stop 😂','you’re sweet','okay that’s nice','stoppp. okay i’ll take it','that’s really nice 🙂','ha okay, you can stay'],pub:['wait what is this for?','that is wild','{k} is a whole look','the {k} part is so good lol','okay i need the whole story','this is so good 😂','{K} looks like a long day lol']},
 timothee:{greet:['Hey man. What’s up?','Wait, hi. What’s going on?','Hey — okay, hi. What’s happening?','Oh, hey. Good timing actually.','Hi! Okay, talk to me.','Hey, man. I’m around, what’s up?'],how:['Good, man. Bit sleep-deprived. You?','Honestly good. Reading too much. You?','Good — scattered, but good. You?','Wait, okay, good actually. How are you?','Tired in a fun way 😂 You?','Good. Watched too many old movies last night. You?'],wyd:['Reading a script I can’t talk about. You?','Walking. Thinking. You?','Rewatching an old movie for the fifth time. Research.','Honestly? Trying to be a normal person for a day.','Nothing, man. Which never happens. You?','Going through notes, which is… a lot 😂'],favour:['I have like twelve questions first.','I don’t really do stuff like that, man.','Man, that’s a big one for a DM.','Wait, okay — no. But I respect the ask.','I can’t really do that, man. Not my call.','That’s not really how it works for me 😂'],rude:['Okay. Wow.','I’m going to pretend that didn’t happen.','Okay, man.','That’s… a choice.','Wow. Okay, I’m out.','Not sure what I did, but okay.'],compliment:['Man, stop.','That’s really kind.','Okay, stop — that’s nice though.','Wait, really? That’s kind of incredible.','You’re being way too nice 😂','Man. Okay. That’s generous.'],pub:['Wait, okay. {K}.','I have like twelve questions about {k}.','Do not sand off the strange part.','This is kind of incredible, man.','{K} — okay, yes.','This is… a lot 😂 in a good way.','Okay, this matters more than people think.']},
 zendaya:{greet:['hey 🤍','hi, what’s up?','hey. what’s going on?','hi. go ahead','hello. what’s up?','hi 🤍 how’s it going?'],how:['honestly good. quiet week. you?','tired, but okay. you?','good. calm, for once. you?','honestly fine. how are you?','okay. a lot going on, but okay. you?','good 🤍 you?'],wyd:['honestly resting','nothing. it’s nice. you?','reading. you?','trying to do nothing on purpose','in a fitting, so not much 😂','sitting with some notes. you?'],favour:['i don’t really do things like that for people','honestly, that’s not something i do','i’d rather not. what’s going on with you though?','not over dm. that’s just a rule i have','i’m going to pass on that one','that’s a lot to ask. no'],rude:['i’m going to step away from this one','okay. no.','okay.','i don’t think so.','i’m not going to respond to that','alright. i’m done here'],compliment:['that’s kind 🤍','you’re sweet','honestly, that’s nice to hear','okay, i’ll take that 🤍','that’s generous','that’s really kind of you'],pub:['honestly {k} 🤍','clarity is underrated','the {k} is doing the talking','the calm in this 🤍','{K} says enough','quietly one of the good ones','honestly, this']},
 hailey:{greet:['hii','hey! what’s up','hiii 🤍','hey, what’s going on?','okay hi. what’s up?','hi! on my second coffee. what’s up?'],how:['good! very much need a coffee. you?','tired but cute. you?','honestly good. you?','good, busy week. how are you?','okay wait i’m actually good. you?','surviving on coffee lol. you?'],wyd:['literally nothing. you?','getting coffee number two','looking at shoot selects. you?','nothing honestly. it’s nice','picking between two photos for way too long lol','on a call that should’ve been a text'],favour:['i don’t really do that, sorry','i can’t do that from my dms, sorry','hmm, not really something i do','no promises honestly','i have to pass on that one, sorry','honestly that’s not a dm thing'],rude:['okay, not doing this','wow. bye','noted.','okay. that’s enough','not sure what that was. i’m going to go','hmm. no'],compliment:['stoppp','cuteee, you’re sweet','okay that’s cute','stop 🤍','you’re sweet honestly','wait that made my day'],pub:['cuteee','wait i like the {k}','okay wait {k} 👀','okay this is cute','{K} is so good honestly','the lighting is doing exactly what it should','okay wait i like this 🤍']},
 kendall:{greet:['hey','lol hi','hi.','hmm hi','hey. what’s up','hi lol what'],how:['good. tired. you?','fine lol. you?','okay. airports. you?','good actually. you?','tired of airports lol. you?','hmm. fine. you?'],wyd:['nothing. it’s great','lying down. you?','sitting in an airport lol','avoiding the family group chat','nothing. thinking about lying down','waiting around. you?'],favour:['hmm. no','lol no','lol absolutely not','i don’t really do that','hmm. probably not','not my thing. sorry'],rude:['lol okay','hmm. no','okay.','lol bye','fair enough. bye','that’s weird. okay'],compliment:['lol stop','that’s nice','hmm okay i’ll take it','stop lol','you’re funny','okay that’s nice 😂'],pub:['lol literally','hmm {k}','that is actually funny','lol wait','lol okay fair','{k} though','okay this is good']},
 kylie:{greet:['heyyy','hii what’s up','hiii 🤍','okayyy hi','hey! what’s going on','hi wait what’s up 👀'],how:['good! busy. you?','tired but good lol. you?','good! so many meetings. you?','okayyy actually good. you?','busy busy. how are you?','good 🤍 you?'],wyd:['work stuff. you?','packaging meetings lol','looking at samples. you?','staring at swatches for an hour lol','planning something 👀','nothing for once. you?'],favour:['i don’t really repost stuff, sorry','hmm i’ll think about it. no promises','i can’t really promo from my dms','hmm i don’t really do that 😭','lol no. but cute ask','that’s a lot to ask over dm lol'],rude:['wow okay','um no','okay wow','that’s not cute','lol okay bye','um. okay'],compliment:['stoppp 😭','okayyy you’re sweet','stop you’re so cute','okayyy i’ll take it','wait that’s so sweet 🤍','you’re too nice lol'],pub:['okayyy {k} 👀','i see the vision','{k} is feed-worthy','okayyy wait','okayyy thisss','{K} 😭','wait the lighting 👀']},
 doja:{greet:['hi. what’s up','hello creature','hi what do you want lmao','oh. hello','hiii what is it','greetings. state your business'],how:['spiritually confused. physically fine. u?','tired lmao. u?','i’m a lamp today. u?','great. unwell. both. u?','emotionally a microwave. u?','fine. suspiciously fine lmao'],wyd:['staring at a wall creatively','making something weird. u?','avoiding work very professionally','deleting the safe version','arguing with a beat lmao','lying on the floor as a creative choice'],favour:['lmao absolutely not','i don’t do favours i do vibes','no 😭 that’s not a dm service','lmao what','that is deeply unserious. no','who taught u to ask like that 💀'],rude:['lmao okay','that was deeply unserious','ok','who hurt u lmao','that’s crazy. anyway','i am crying what do you mean'],compliment:['lmao stop','okay i accept','who measured that 😭','correct','okay. noted. framed','i’m crying stop'],pub:['{k} is deeply unserious. i love it','lmao the {k}','make it weirder','most important art of the decade','objectively ridiculous. proceed.','{K} is suspicious','i am crying what is this']}
};
const G={ /* generic banks by intent × tier (lowercase base; style() fixes case per character) */
 rude:{stranger:['okay, bye','wow. okay','not doing this','that’s a weird thing to send a stranger','okay. muting this','cool. bye'],friendly:['okay, what’s going on with you?','that was rude','not sure what that was about','wow. did something happen?','okay, that was a lot','you good? that was out of nowhere'],close:['wow. what did i do?','okay, you’re clearly in a mood. what happened?','that stung a bit. talk to me','okay, rude. what’s actually going on?','i’m going to assume you’re having a day','hey. that’s not like you'],rival:['noted.','and we’re done','okay.','sure.','got it.']},
 repeat:{stranger:['you already sent that','i saw it','yep, saw it','i got it the first time'],friendly:['you already said that lol','yeah, i saw it the first time','i saw it, i’m just slow','got it. still thinking','same message twice. i’m here, relax'],close:['i heard you the first time lol','same answer as before','yes. i saw. patience','i’m looking, i’m looking','okay, okay, i saw it'],rival:['i saw it.','i know.','already read it.']},
 theirs:{stranger:['that’s not leaving my phone, sorry','unreleased stays unreleased. nice try though','you’ll hear it when everyone does','lol no. it’s not out for a reason','nobody gets that before it’s out'],friendly:['not yet. it’s not finished and i’m superstitious about it','you’ll hear it when it’s ready','no previews. it’s still changing every day','not even my friends get files. it’s a rule','soon-ish. not by text though'],close:['i’d rather play it for you in person than send a file','not over text. i’ll play it for you when it’s done','soon. you’ll hear it early, just not as a file','no files. if i send it once it ends up everywhere','not yet. it’s still a mess and i want you to hear the good version'],rival:['no','that’s cute. no','no.']},
 favour:{stranger:['i don’t really do favours for people i don’t know','that’s a big ask from someone i just met','not how that works','i can’t do that, sorry','that’s a lot for a first message'],friendly:['i don’t say yes to stuff like that over text','maybe. if it’s music, let me actually hear it first','i don’t do things as favours, sorry','hmm. not promising anything','that’s a lot to ask this early'],close:['if it’s music, send it and i’ll be honest','for you i’ll think about it. no promises','maybe. if it’s good i’ll say something','honestly? probably not. but i love the nerve','you know i can’t always do that stuff'],rival:['no.','not happening.']},
 inviteP:{stranger:['that’s nice, but i don’t make plans with people i haven’t met','{p}? we’ve never actually met','i don’t really do {a} with people i don’t know, sorry','that’s a no for now. we don’t know each other','{p} is a lot for a first conversation'],friendly:['{p} maybe. i’d have to see where i am that week','{a} in {p}? possibly. send me dates and i’ll check','maybe. {p} depends on my schedule','{a} in {p} could be fun. what dates?','i’m not saying no to {p}. i need dates first'],close:['{a} in {p}? yes. when are you thinking?','okay, {p}, {a}. i’m in. pick a day','yes to {p}. we just need a date','{a} in {p}? obviously. when?','i’m in for {p}. send me days that work'],rival:['not right now.','no.','i’ll pass.']},
 /* ---- logic3 slots: NEUTRAL PLACEHOLDERS for SCENE Writer (see CHANGES_LOGIC3.md) ---- */
 planDecline:{busy:['can’t that week, i’m slammed. another time?'],travelling:['can’t, i’m travelling that week. after?'],booked:['i’m already booked then. different day?']},
 planCounter:{time:['yes, but can we do a different day?'],place:['yes. somewhere other than {p} though?']},
 planWhen:{ask:['what day works for you?'],propose:['how about {day}?']},
 favourSong:{yes:['send it. i’ll listen first'],no:['i don’t share music from people i don’t know']},
 favourAccess:{maybe:['i can’t promise that. let me see'],no:['i can’t get people in, sorry']},
 favourFollow:{yes:['i’ll take a look'],no:['i don’t really do follow-backs']},
 inviteEvent:{stranger:['{e}? i don’t really make plans with people i haven’t met'],friendly:['{e}? maybe. let me check that night'],close:['{e}? yes, i’m in'],rival:['not right now.']}, /* logic3 slot, NEUTRAL PLACEHOLDERS: event invite from SCENE_PARSE ({e} = event.what, {p} = venue short) */
 askAbout:{known:['{k}? soon. that’s all i can say'],deflect:['can’t talk about the {k} yet']},
 invite:{stranger:['i don’t even know you yet','that’s a lot for someone i just met','i don’t really make plans with people i haven’t met','ha, no. we’ve never met'],friendly:['maybe. where?','depends where and when','possibly. what were you thinking?','could be fun. where?','maybe. give me details'],close:['yes. where are we going?','okay, where?','i’m in. where and when?','obviously. where?','yes. pick a place'],rival:['not right now.','no.']},
 hang:{stranger:['i don’t even know you yet','maybe one day. we’ll see','we’ve literally never met','ha. let’s start with talking'],friendly:['maybe. what were you thinking?','depends. what did you have in mind?','possibly. what’s the idea?','maybe, if the timing works. what kind of thing?'],close:['yes. what’s the plan?','okay, what did you have in mind?','yes please. what are we doing?','always. what’s the idea?','i’m in. you pick'],rival:['not really.','no.']},
 how:{stranger:['good, busy. what’s up?','fine. what’s this about?','i’m good. what’s up?','okay. busy day. what’s up?'],friendly:['good, busy. you?','tired but good. you?','pretty good actually. you?','fine! long day. you?','not bad. how are you?'],close:['honestly tired. long week. you?','good! busy. how are you?','better now. what’s going on with you?','okay-ish. tell me something good','tired. distract me'],rival:['fine.','okay.','busy.']},
 wyd:{stranger:['in the middle of something. what’s up?','nothing much. why?','busy, but go on','working on a few things. what’s going on?'],friendly:['working, sort of. you?','nothing exciting. why?','just finished something. you?','not much. what are you up to?','procrastinating. you?'],close:['nothing, come entertain me','working, but i’m bored. you?','avoiding everything. talk to me','lying down. what’s up?','nothing. why, what’s happening?'],rival:['busy.','working.']},
 compliment:{stranger:['oh. that’s nice','ha, okay','that’s nice of you','well, that’s nice to hear','okay, i’ll take it'],friendly:['stop','you’re sweet','okay i’ll take it','stop it, that’s nice','okay, say more'],close:['stop it','okay say it again','you’re biased but i love that','obviously. but say it again','okay now i’m blushing'],rival:['okay.','sure.']},
 thanks:{any:['of course','anytime','ofc','obviously','yeah of course','it’s nothing']},
 ack:{any:['mhm','okay','okay good','cool','good','perfect']},
 greet:{stranger:['hi. do i know you?','hey. who’s this?','hi?','hey. what’s up?','hello. have we met?'],known:['hey, i’ve seen your posts. what’s up?','hi. you’re the one from my feed, right?','oh hey, i know your page. what’s up?','hi. i think i’ve seen you around','hey. your stuff keeps showing up for me'],friendly:['hey! what’s up','hi you','hey, what’s going on?','hiii','hey. what’s new?'],close:['heyyy','hi! what’s going on?','there you are','hey you. what’s up?','hiii what’s happening'],rival:['hi.','hey.']},
 question:{any:['hm. depends. what’s this about?','why do you ask?','honestly not sure. why?','good question. not sure yet','hmm, depends on the day','not something i can really answer over text']},
 laugh:{any:['lol','right','ha','i know right','stop','lol yeah']},
 generic:{stranger:['okay','sure','hm','got it','mhm'],friendly:['fair','lol okay','mhm, go on','okay, and?','huh. okay','that’s fair'],close:['okay go on','lol fair','wait tell me more','and then what?','okay i’m listening','go on, i’m listening'],rival:['okay.','sure.','fine.']}
};
;(()=>{const W=globalThis.SCENE_WRITER_LINES_L3;if(!W)return;const ok=v=>Array.isArray(v)?v.length>0&&v.every(x=>typeof x==='string'):v&&typeof v==='object'&&Object.values(v).every(ok);for(const [k,v] of Object.entries(W.G||{}))if(ok(v))G[k]=JSON.parse(JSON.stringify(v));for(const [id,o] of Object.entries(W.OV||{}))for(const [k,v] of Object.entries(o||{}))if(ok(v))(OV[id]=OV[id]||{})[k]=[...v]})(); /* writer logic3: lines live in writer-lines-logic3.js */
const RUDE2=/\b(stupid|idiot|shut up|hate you|ugly|trash|loser|fake|annoying|awful|pathetic|bitch|piss off|fuck off|you suck|boring)\b/i;
const THEIRS2=/send me (your |the |that |a )?(unreleased|new song|new track|demo|snippet|leak)|unreleased (song|track|music|demo|snippet)|can i (hear|get) (the |your )?(unreleased|new song|demo|snippet)|(leak|preview) (me )?(your|the) (song|track|album)/i; /* asks for THEIR unreleased music (not 'share my song') */
const FAVOUR2=/share my (song|post|music|video|track)|send me (your |the |that |a )?(unreleased|new|demo|snippet|leak)|unreleased (song|track|music|demo|snippet)|can i (hear|get) (the |your )?(unreleased|new song|demo|snippet)|repost|re-post|shout ?out|follow me back|promote (me|my)|autograph|signed|sign (my|this)|get me (in|into|on)|guest ?list|tickets?\b|put me on|post (my|about my)/i;
const CAREER2=/\b(collab|collaborat|campaign|partner|work together|team up|feature|casting|met gala|fashion week|nyfw|premiere|reboot|sequel|episode|series)\b/i;
const ECHO=/what do you mean exactly|asked me about .{0,80} twice|^wait\s*[—-]\s*on\s*[“"]|^on\s*[“"]/i;
function styleOf(a){const s=STYLE[a.id];if(s)return s;const v=typeof VOICE!=='undefined'?VOICE[a.id]:null;return{lower:Boolean(v?.lower),emoji:[]}}
/* logic3 (g): lowercase voices also lowercase a later stand-alone "I" (I, I’m, I’ll, I’d, I’ve) */
const lowerI226=t=>String(t||'').replace(/\bI\b(?=[’' ,.!?]|$)/g,'i');
function styled(a,line,d){
 const s=styleOf(a);let t=String(line||'').trim();
 const recent=(d?.messages||[]).filter(m=>m.from==='them'&&m.text).slice(-3).map(m=>m.text).join(' ');
 if(/\p{Extended_Pictographic}/u.test(recent))t=t.replace(/\s*\p{Extended_Pictographic}\uFE0F?/gu,'').trim()||t; /* emoji budget: not in consecutive messages */
 if(s.lower)t=lowerI226(t.replace(/^[A-Z](?=[a-z’' ])/,c=>c.toLowerCase()));else t=t.replace(/^[a-z]/,c=>c.toUpperCase()).replace(/\bi\b/g,'I').replace(/([.!?]\s+)([a-z])/g,(m,x,y)=>x+y.toUpperCase());
 return t;
}
const banned=t=>BANNED.some(r=>r.test(t))||/\bthank(s| you)\b.*\bthank(s| you)\b/i.test(t);
function pickLine(a,d,list,seed,vars={}){
 const used=new Set((d?.messages||[]).filter(m=>m.from==='them'&&m.text).map(m=>norm(m.text)));
 const recentThanks=(d?.messages||[]).filter(m=>m.from==='them').slice(-4).some(m=>/\bthank/i.test(m.text||''));
 const L=(list||[]).filter(Boolean);if(!L.length)return'';const start=Math.floor(roll(seed)*L.length);
 for(let i=0;i<L.length;i++){let c=L[(start+i)%L.length];for(const [k,v] of Object.entries(vars))c=c.split(`{${k}}`).join(v).split(`{${k.toUpperCase()}}`).join(v?v[0].toUpperCase()+v.slice(1):v);
  if(/\{[a-zA-Z]\}/.test(c))continue;const out=styled(a,c,d);if(used.has(norm(out))||banned(out)||(recentThanks&&/\bthank/i.test(out)))continue;return out}
 return'';
}
function level(id){const t=tier(id);if(t==='rival')return'rival';if(t==='friend'||t==='close')return'close';if(t==='acquaintance'||isStarter(id))return'friendly';return'stranger'}
/* logic3: the save's starter friend (state.firstSession148.friendId) is an established friend in Kyle's story, so plan/invite and favour
   decisions use the close tier. Other intents keep level(). Kim never reaches this code (celebOk excludes Kim). */
function isStarterFriend226(id){return isStarter(id)}
function planLevel226(a){const lv=level(a.id);if(lv==='rival')return lv;return isStarterFriend226(a.id)?'close':lv}
/* decided from state BEFORE any text is chosen; deterministic per seed (same thread position + same message = same answer).
   starter-friend plans: ~78% accept, ~12% counter (day or place), ~10% decline with a concrete reason (busy / travelling / booked).
   Other close friends keep logic2 behaviour (always yes). */
const DECLINE_REASONS226=['busy','travelling','booked'];
function planDecision226(a,d,P,seed){
 const lv=planLevel226(a);if(lv!=='close'||!isStarterFriend226(a.id))return{lv,verdict:null};
 const r=roll(seed+'|plan226'),reason=DECLINE_REASONS226[Math.floor(roll(seed+'|why226')*DECLINE_REASONS226.length)];
 const verdict=r<0.78?'accept':r<0.90?'counter':'decline';
 return{lv,verdict,reason:verdict==='decline'?reason:'',counter:verdict==='counter'?(P.place&&!P.when?'place':'time'):''};
}
/* logic3 (e): favour decisions by type (state first: tier), text second */
function favourDecision226(type,lv){
 if(type==='song')return lv==='close'||lv==='friendly'?'yes':'no';
 if(type==='access')return lv==='close'?'maybe':'no';
 if(type==='follow')return lv==='close'||lv==='friendly'?'yes':'no';
 return'';
}
/* logic3 (c): short, quest-free name for a fact ("A fundraiser at the Williamsburg rooftop needs a last-minute performer" -> "the Williamsburg rooftop");
   same rules as strings.patch place227. '' when nothing short exists, so {d}/{s} lines are skipped and the {d}-free variants are used. */
function shortFact226(f){
 const raw=String(f?.venue||f?.place||f?.title||f?.summary||'').replace(/\s+/g,' ').trim().replace(/[.!?]+$/,'');if(!raw)return'';
 const stop=/^(needs?|asks?|wants?|offers?|is|are|was|has|have|with|for|and|to|in|on|at|of|tonight|tomorrow|today|after|before|while|who|that|which|but|or|if|when|so|just|again|now|then|this|your|you)$/i;
 if(raw.includes(' · ')){const seg=raw.split(' · ').pop().replace(/\s*\([^)]*\)\s*$/,'').trim();if(seg&&seg.split(' ').length<=5)return /^(the|a|an)\s/i.test(seg)?seg.replace(/^The /,'the '):'the '+seg}
 const at=raw.match(/\bat\s+((?:the|a|an)\s+)?(.+)$/i);
 if(at){const words=[];for(const w of at[2].split(' ')){if(stop.test(w.replace(/[^\w']/g,''))||words.length>=4)break;words.push(w.replace(/[.,!?;:]+$/,''))}if(words.length)return ((at[1]&&/^the/i.test(at[1]))?'the ':'')+words.join(' ')}
 const w=raw.replace(/\s*\([^)]*\)/g,'').split(' ');if(w.length<=5){const x=w.join(' ');return /^[A-Z][a-z]/.test(x)&&!/^[A-Z][a-z]+\s[A-Z]/.test(x)?x[0].toLowerCase()+x.slice(1):x}
 return'';
}
function thread(d){const m=d.thread226=d.thread226&&typeof d.thread226==='object'?d.thread226:{version:1,plans:[],facts:{},turns:0};m.plans=Array.isArray(m.plans)?m.plans:[];m.facts=m.facts&&typeof m.facts==='object'?m.facts:{};return m}
function bank(a,intent,lv){const o=OV[a.id]?.[intent];const g=G[intent]||{};const gen=g[lv]||g.any||g.friendly||[];if(lv==='rival')return gen;const r=[...(o||[]),...gen];r.tiers=[o||[],gen];return r} /* logic3 (d): .tiers = own lines first, generic only if none of them is usable */
/* ONE swap point for intent/slot detection (non-Kim). Pure: text in, flags + slots out; no state, no wording.
   v228: reads the shared parser (public/scene-parse-v228.js, window.SCENE_PARSE) and maps it onto this shape.
   Only cues SCENE_PARSE does not have yet stay local (their-unreleased-music, career/proposal words, story, public-comment cues).
   parseIntentLocal226 below is the pre-v228 detector, kept as the fallback if SCENE_PARSE is missing. */
function parseIntent226(input){
 const SP=typeof globalThis.SCENE_PARSE==='function'?globalThis.SCENE_PARSE:null;let S=null;
 const raw=String(input||'').trim(),t=raw.toLowerCase().replace(/[’‘]/g,"'");
 if(SP)try{S=SP(raw)}catch{S=null}
 if(!S||!S.detail)return parseIntentLocal226(input);
 const D=S.detail,I=new Set(S.intents||[]),fav=S.slots?.favour?.type||'',LOC=parseIntentLocal226(input);
 const city=SP.kit?.city?.(t)||null,slotCity=S.slots?.place&&!S.slots?.event?.venue?{name:S.slots.place.name}:null;
 const work0=/\b(audition|callback|casting|screen test|self[- ]?tape|booked|pilot|gig|shoot|photoshoot|label meeting|studio session|new job)\b/.exec(t);
 return {raw,t,question:Boolean(D.question),acts:D.acts||[],place:city?{name:city.name}:slotCity,when:D.when||'',
  rude:RUDE2.test(t)||Boolean(S.tone?.rude),theirs:THEIRS2.test(t),
  favour:FAVOUR2.test(t)||['share_song','shoutout','tickets'].includes(fav),
  career:CAREER2.test(t)||I.has('collab_pitch'),
  inviteCue:Boolean(D.inviteCue)&&!I.has('goodbye'),hang:Boolean(D.hang),
  stillOn:Boolean(D.stillOn)||/\bour trip\b/.test(t),timeQ:Boolean(D.timeQ),
  how:Boolean(D.howAreYou),wyd:Boolean(D.whatDoing)||/\bwhat are you working on\b/.test(t),
  work:work0?work0[0]:(D.work&&!D.yourCampaign&&!new RegExp('\\b(?:your|ur)\\b.{0,20}\\b'+D.work+'\\b').test(t)?D.work.replace('call back','callback'):''),booked:Boolean(D.booked),outcome:Boolean(D.howDidItGo),
  compliment:Boolean(D.compliment),thanks:Boolean(D.thanks),ack:Boolean(D.agree),greet:Boolean(D.greeting),
  story:/\b(that thing|what happened|the thing|did you see|did you hear|you saw)\b/.test(t),
  laugh:Boolean(D.laughter),
  attention:/\b(notice me|reply to me|follow me|dm me|answer me)\b/.test(t),aboutYou:Boolean(D.aboutYou),
  praise:/\b(love (you|this|it)|obsessed|queen|icon|iconic|goat|beautiful|gorgeous|stunning|slay|so pretty|perfect)\b/.test(t),
  /* logic3: favour type, ask-about-them and event slots on the shared path (local detector supplies the cues SCENE_PARSE has no field for) */
  favourType:({share_song:'song',tickets:'access',shoutout:'follow'})[fav]||LOC.favourType,askAbout:LOC.askAbout,
  event:S.slots?.event?{what:String(S.slots.event.what||''),kind:S.slots.event.kind||'',venue:S.slots.event.venue?{name:S.slots.event.venue.name,short:S.slots.event.venue.short||S.slots.event.venue.name,city:S.slots.event.venue.city||''}:null,performer:S.slots.event.performer?{id:S.slots.event.performer.id,name:S.slots.event.performer.name,short:S.slots.event.performer.short}:null}:null,
  intents:[...I],slots:S.slots,shared:true};
}
function parseIntentLocal226(input){
 const raw=String(input||'').trim(),t=raw.toLowerCase().replace(/[’‘]/g,"'"),k=KIT(),question=/\?/.test(raw);
 const acts=k?.findActs?k.findActs(t):[],place=k?.findPlace?k.findPlace(t):null,when=k?.findWhen?k.findWhen(t):'';
 const work=/\b(audition|callback|casting|screen test|self[- ]?tape|booked|pilot|gig|shoot|photoshoot|label meeting|studio session|new job)\b/.exec(t);
 return {raw,t,question,acts,place,when,
  rude:RUDE2.test(t),theirs:THEIRS2.test(t),favour:FAVOUR2.test(t),career:CAREER2.test(t),
  inviteCue:/\b(wanna|want to|let'?s|we should|can we|could we|should we|down (for|to)|come with|join me|you free|are you free|hang|hang out|get together|grab|meet up)\b/.test(t)||(question&&acts.length>0),
  hang:/\b(hang|hang out|hangout|get together|meet up)\b/.test(t),
  stillOn:/\b(still on|we still|are we still|still happening|our (lunch|dinner|plan|plans|trip))\b/.test(t),
  timeQ:/\b(what day|which day|what time|when works|when are you free)\b/.test(t)||/^when\b/.test(t),
  how:/\b(how are you|how r u|how are u|you good|you okay|how have you been|how's it going|hows it going|how's your (day|week)|how was your (day|week))\b/.test(t),
  wyd:/\b(what are you (doing|up to|working on)|wyd|what's your plan|whats your plan|doing this weekend|up to this weekend)\b/.test(t),
  work:work?work[0]:'',booked:/\b(booked|got (it|the part|the role|the job)|landed)\b/.test(t),
  outcome:/\b(how did it go|it went|went well|went bad|didn't get it|did not get it)\b/.test(t),
  compliment:/\b(you look|you looked|so pretty|obsessed with (your|you)|love your|loved your|iconic|you're so (good|talented|pretty|funny)|ur so)\b/.test(t),
  thanks:/^(thank you|thanks|thx|ty)\b/.test(t),
  ack:/^((ok(ay)?|yes|yeah|yep|sure|deal|perfect|sounds good|cool|great|bet)[!. ]*)+$/.test(t),
  greet:/^(hey+|hi+|hello+|yo|hiya|heyy+)\b/.test(t),
  story:/\b(that thing|what happened|the thing|did you see|did you hear|you saw)\b/.test(t),
  laugh:/^((ha|he){2,}|lol+|lmao+|😂+|😭+)[!?. x]*$/i.test(t),
  /* public-comment cues */
  attention:/\b(notice me|reply to me|follow me|dm me|answer me)\b/.test(t),
  /* logic3 (e): favour type; (f): question about the celeb's own work */
  favourType:/\b(share|repost|listen to|post|play) (my|this|our) (song|music|track|demo|video|post|ep|single)\b|\bpost (my|about my)\b|\brepost\b|\bshare my\b/.test(t)?'song':/\btickets?\b|guest ?list|get me (in|into|on)\b|put me on\b|backstage|plus ?one/.test(t)?'access':/\bfollow me( back)?\b|follow back|shout ?out|promote (me|my)|notice me/.test(t)?'follow':'other',
  askAbout:(()=>{if(!question||/\b(my|our)\s+(new\s+)?(tour|album|song|single|movie|film|show|season|project|release|ep)\b/.test(t))return'';const m=/\b(?:your|the|ur|new)\s+(?:next\s+|new\s+)?(tour|album|song|single|movie|film|show|season|project|release|ep|collab|era)\b/.exec(t)||/\b(tour|album|single|movie|season|era)\b/.exec(t);return m&&/\b(when|where|what|is|are|will|how|any|so)\b/.test(t)&&!/\b(i|i'm|im|me)\b/.test(t.replace(/\b(tell me|let me know)\b/g,''))?m[1]:''})(),aboutYou:/\b(you|your|u|ur)\b/.test(t),
  praise:/\b(love (you|this|it)|obsessed|queen|icon|iconic|goat|beautiful|gorgeous|stunning|slay|so pretty|perfect)\b/.test(t)};
}
const ACK_AGREED226=['good. don’t flake','okay good','good. holding you to it','okay, it’s happening then','deal']; /* = the existing agreed-ack lines (Writer text, reused) */
function nonKimCandidates(a,input,d,base){
 const P=parseIntent226(input),raw=P.raw,t=P.t,lv=level(a.id),mem=thread(d);
 const nLines=Math.max(1,raw.split(/\n+/).filter(Boolean).length),mine=(d.messages||[]).filter(m=>m.from==='me'&&m.text),prevMine=mine.slice(0,-nLines).slice(-4).map(m=>norm(m.text)),seed=`${a.id}|${d.messages.length}|${norm(raw)}`;
 const plan=[...mem.plans].reverse().find(p=>p&&p.status!=='cancelled')||null,question=P.question;
 const C=[];const add=(intent,list,vars,extra)=>{let x='';for(const L of (list&&list.tiers?list.tiers:[list])){x=pickLine(a,d,L,seed+intent,vars);if(x)break}if(x)C.push({text:x,intent,...(extra||{})})};
 if(prevMine.includes(norm(raw))&&norm(raw).length>2){add('repeat',G.repeat[lv]||G.repeat.friendly);if(C.length)return C}
 if(P.rude){add('rude',bank(a,'rude',lv));return C}
 if(P.theirs){add('theirs',bank(a,'theirs',lv));if(C.length)return C}
 if(P.favour){const plv=planLevel226(a),fv=favourDecision226(P.favourType,plv),key={song:'favourSong',access:'favourAccess',follow:'favourFollow'}[P.favourType];
  if(key&&fv&&G[key]?.[fv])add('favour',G[key][fv],{},{favour:{type:P.favourType,verdict:fv}});
  if(!C.length)add('favour',bank(a,'favour',lv));return C}
 if(P.askAbout&&!P.inviteCue&&!(P.intents||[]).includes('invite')){const k=P.askAbout,own=(state.posts||[]).filter(x=>x&&x.authorId===a.id).find(x=>new RegExp('\\b'+k+'\\b','i').test(String(x.text||x.caption||'')));
  add('ask_about_them',own?G.askAbout.known:G.askAbout.deflect,{k});if(C.length)return C}
 const acts=P.acts,place=P.place,when=P.when;
 const inviteCue=P.inviteCue||(question&&acts.length>0)||Boolean(plan&&plan.status==='pending'&&(acts.length||place));
 const stillOn=P.stillOn,timeQ=P.timeQ;
 /* logic3 (a): an agreed plan with no day is pending-time: 'what day / when?' asks for or proposes a day; a day from the player (or yes to a proposed day) fixes it */
 const noDay=Boolean(plan&&plan.status==='agreed'&&!plan.when);
 if(noDay&&P.when&&!stillOn&&!(place&&plan.place&&place.name!==plan.place)){add('ack',['good. don’t flake','okay good','good. holding you to it','okay, it’s happening then','deal'],{},{plan:{...plan,when:P.when,day:P.when}});if(C.length)return C}
 if(noDay&&plan.proposedWhen&&P.ack){add('ack',['good. don’t flake','okay good','good. holding you to it','okay, it’s happening then','deal'],{},{plan:{...plan,when:plan.proposedWhen,day:plan.proposedWhen}});if(C.length)return C}
 if(noDay&&timeQ&&!stillOn){const propose=roll(seed+'|day226')<0.5,day=['thursday','friday','the weekend','next week'][Math.floor(roll(seed+'|which226')*4)];
  if(propose)add('plan_when',G.planWhen.propose,{day},{plan:{...plan,proposedWhen:day}});else add('plan_when',G.planWhen.ask);if(C.length)return C}
 if(stillOn||(timeQ&&plan)){
  if(!plan)add('stillon',['still on for what? we didn’t actually make a plan','what plan? i don’t think we set anything','wait, did we plan something? i don’t think we did','pretty sure we never made a plan','still on? we haven’t planned anything yet']);
  else if(plan.status==='declined'&&plan.declineReason)add('stillon',[...G.planDecline[plan.declineReason],'we didn’t make any plans, remember?'],{...(plan.place?{p:plan.place}:{}),...(plan.activity?{a:plan.activity}:{})});
  else if(plan.status==='declined')add('stillon',['we didn’t make any plans, remember?','there’s no plan. i passed on that one','we never set anything up','nothing’s on. i said no to that one, remember?','there wasn’t a plan, just an idea']);
  else if(plan.status==='agreed')add('stillon',['yes, still in for {l}','{l}? yeah, i’m still in','i’m in. {l}, i haven’t forgotten','still in. {l}, right?','yes. {l}. don’t let me forget'],{l:planLabel(plan)});
  else if(plan.status==='maybe'&&plan.counter)add('stillon',[...G.planCounter[plan.counter],'maybe. i still need dates from you'],{p:plan.place||'there',...(plan.activity?{a:plan.activity}:{})});
  else if(plan.status==='maybe')add('stillon',['i said maybe. send me dates and i’ll check','maybe. i still need dates from you','still a maybe. give me dates and i’ll look','it’s a maybe until i see dates','maybe! i just need to know when']);
  else add('stillon',['we said {a} but you never said where','{a}, sure, but where?','we still haven’t picked a place for {a}','still need a place for {a}','{a} is still on the table. where though?'],{a:plan.activity||'something'});
 }
 const EV=P.event&&P.event.what&&(P.event.venue||P.event.performer)&&(inviteCue||(P.intents||[]).includes('invite'))&&!stillOn?P.event:null; /* logic3: SCENE_PARSE event slot ("Miley at the Bowl") */
 const PD=EV||((acts.length||place)&&inviteCue&&!stillOn)||(P.hang&&!stillOn)?planDecision226(a,d,P,seed):{lv,verdict:null};
 if(EV){const plv=PD.lv,ep={kind:'event',what:EV.what,activity:'',place:EV.venue?.short||'',where:EV.venue?.name||'',city:EV.venue?.city||'',who:EV.performer?.name||'',when:when||'',day:when||null};
  const ev={e:EV.what,...(ep.place?{p:ep.place}:{})};
  if(PD.verdict==='decline')add('invite',G.planDecline[PD.reason],ev,{plan:{...ep,status:'declined',declineReason:PD.reason}});
  else if(PD.verdict==='counter')add('invite',G.planCounter.time,ev,{plan:{...ep,status:'maybe',counter:'time'}});
  else{const status=plv==='close'?'agreed':plv==='friendly'?'maybe':'declined';add('invite',G.inviteEvent[plv]||G.inviteEvent.friendly,ev,{plan:{...ep,status}})}
 }else if((acts.length||place)&&inviteCue&&!stillOn){
  const act=acts[0]||plan?.activity||'',p=place?.name||'',plv=PD.lv,av=act?{a:act}:{}; /* (b) no invented activity: {a} lines drop out when none was named */
  const base3={activity:act,place:p,when:when||'',day:when||null};
  if(PD.verdict==='decline')add('invite',G.planDecline[PD.reason],{...(p?{p}:{}),...av},{plan:{...base3,status:'declined',declineReason:PD.reason}});
  else if(PD.verdict==='counter')add('invite',G.planCounter[PD.counter],{p:p||'there',...av},{plan:{...base3,status:'maybe',counter:PD.counter}});
  else if(p&&plv==='close'&&when){const ad=L=>(L||[]).filter(x=>act||!/\{activity\}/i.test(x)),own=ad(OV[a.id]?.planAcceptDay),gen=ad(G.planAcceptDay),L=[...own,...gen,...ACK_AGREED226];L.tiers=[own,gen,ACK_AGREED226];add('invite',L,{place:p,time:when,...(act?{activity:act}:{})},{plan:{...base3,status:'agreed'}})} /* day already given: don't ask for one (reuses the agreed-ack lines) */
  else if(p){const status=plv==='close'?'agreed':plv==='friendly'?'maybe':'declined';add('invite',G.inviteP[plv]||[],{p,...av},{plan:{...base3,status}})}
  else add('invite',G.invite[plv]||[],{},plv==='stranger'||plv==='rival'?null:{plan:{...base3,status:'pending'}});
 }else if(P.hang&&!stillOn){
  if(PD.verdict==='decline')add('hang',G.planDecline[PD.reason],{},{plan:{activity:'',place:'',when:when||'',day:when||null,status:'declined',declineReason:PD.reason}});
  else add('hang',G.hang[PD.lv]||[]);
 }
 if(P.how)add('how',bank(a,'how',lv));
 if(P.wyd)add('wyd',bank(a,'wyd',lv));
 if(P.work){const what=P.work;if(P.booked)add('work',['wait, you booked it? okay, what is it?','you got it? okay that’s actually big. what’s the project?','wait. you booked it?? tell me everything','okay, you got it. how do you feel?','you booked it? okay, i need details']);else{mem.facts.work={what,when,at:T()};add('work',['{w}{n}? okay. tell me how it goes','{w}{n}? don’t overthink it. text me after','{w}{n}? nice. what’s it for?','ooh, {w}{n}. text me when you’re out','{w}{n}. okay, i want updates','{w}{n}? go in like you already have it'],{w:what,n:when?` ${when}`:''})}}
 if(P.outcome&&mem.facts.work)add('work',['wait, the {w}? what did they say?','okay, how did the {w} actually go?','the {w}! okay, tell me','and? the {w}. i need to know','wait, how was the {w}?'],{w:mem.facts.work.what});
 if(P.compliment)add('compliment',bank(a,'compliment',lv));
 if(P.thanks)add('thanks',G.thanks.any);
 if(P.ack&&plan&&plan.status==='maybe'&&plan.counter)add('ack',['good. don’t flake','okay good','good. holding you to it','okay, it’s happening then','deal'],{},{plan:{...plan,status:'agreed',counterAccepted:true}});
 else if(P.ack)add('ack',plan&&plan.status==='agreed'?['good. don’t flake','okay good','good. holding you to it','okay, it’s happening then','deal']:G.ack.any);
 if(!C.length&&P.greet){const known=lv==='stranger'&&((Number(rel(a.id).recognition226)||0)>=5||(Number(state.player?.fame)||0)>=40);add('greet',known?G.greet.known:bank(a,'greet',lv))}
 if(!C.length&&P.story){const f=(globalThis.SCENE_KERNEL170?.context?.(a.id)?.knownFacts||[])[0];if(f?.title||f?.summary)add('story',['you mean {s}? yeah, i saw','{s}? yeah, people were talking about it','oh, {s}? yeah, it was on my feed','{s}? yeah, i caught that','wait, {s}? yeah, i saw it'],{...(shortFact226(f)?{s:shortFact226(f)}:{}),_s:clean226(f.title||f.summary,70).replace(/[.!?]+$/,'')});else add('story',['what thing? i didn’t see anything','no, what happened?','i missed it. what happened?','didn’t see it. fill me in','no? what are we talking about'])}
 if(!C.length&&P.laugh)add('laugh',G.laugh.any);
 if(!C.length&&question&&base&&!ECHO.test(base)&&!new Set((d.messages||[]).filter(m=>m.from==='them').map(m=>norm(m.text))).has(norm(base)))C.push({text:base,intent:'base'});
 if(!C.length&&question)add('question',G.question.any);
 if(!C.length){ /* nothing specific: keep the base line if it's not an echo/repeat; else reference the open thread, else a short in-voice reaction */
  const usedN=new Set((d.messages||[]).filter(m=>m.from==='them').map(m=>norm(m.text)));
  if(base&&!ECHO.test(base)&&!usedN.has(norm(base)))C.push({text:base,intent:'base'});
  else{if(mem.facts.work&&T()-(mem.facts.work.at||0)>60000)add('thread',['wait, did you hear back about the {w}?','any news on the {w}?','so… the {w}. anything yet?','did the {w} people ever get back to you?'],{w:mem.facts.work.what});
   if(plan&&plan.status==='maybe'&&plan.place)add('thread',['also, {p}. are you actually serious about that?','still thinking about {p}, by the way','wait, were you serious about {p}?','so {p}… real or just talk?'],{p:plan.place});
   add('generic',G.generic[lv]||G.generic.friendly)}
 }
 return C;
}
const clean226=(v,n=200)=>String(v??'').replace(/\s+/g,' ').trim().slice(0,n);
function planLabel(p){if(p&&p.kind==='event'&&p.what)return [p.what,p.when||''].filter(Boolean).join(' ');return [p.activity||'plans',p.place?`in ${p.place}`:'',p.when||''].filter(Boolean).join(' ')}
/* ---------- logic3: plan time + read-only SCENE_PLANS (for the UI live pill). Stored in the existing plan memory (d.thread226.plans);
   older plans get the new fields as null on read. Kim's plans (d.kimThread200) are listed read-only and never written. ---------- */
const WEEK226={'today':0,'tonight':0,'this morning':0,'this afternoon':0,'this evening':0,'tomorrow':1,'tomorrow night':1,'tomorrow morning':1,'day after tomorrow':2,'next week':7};
function resolveDay226(when,made){const w=String(when||'').toLowerCase().trim();if(!w)return null;const base=Number.isFinite(made)?made:(Number(state.sceneDay)||0);
 for(const [k,v] of Object.entries(WEEK226).sort((x,y)=>y[0].length-x[0].length))if(w.includes(k))return base+v;
 const n=/\bin (\d{1,2}) days?\b/.exec(w);if(n)return base+Math.min(30,Number(n[1]));return null} /* weekday names / 'the weekend' stay null: the game has no calendar weekday */
function slotOf226(p){const t=`${p.when||''} ${p.activity||''}`.toLowerCase();
 if(/\b(morning|breakfast|brunch|coffee)\b/.test(t))return'morning';if(/\b(afternoon|lunch)\b/.test(t))return'afternoon';
 if(/\b(tonight|night|evening|dinner|drinks|party|concert|show|club|late)\b/.test(t))return'night';return null}
/* storage: p.sceneDay (number|null) + p.slot. NOT p.day: Kim's plans and uiux3/uiux5 already read p.day as a text label ("next Thursday around one"). */
function planTime226(p,write){const day=Number.isFinite(p.sceneDay)?p.sceneDay:resolveDay226(p.when||(typeof p.day==='string'?p.day:''),p.madeDay),slot=p.slot||slotOf226(p);if(write){p.sceneDay=day;p.slot=slot}return{day,slot}}
function plansStatus226(p){const st=String(p.status||'');if(st==='declined'||st==='cancelled')return'cancelled';if(st==='done')return'done';
 if(st==='agreed'){const{day}=planTime226(p,false);return Number.isFinite(day)&&day<(Number(state.sceneDay)||0)?'done':'agreed'}return'pending'}
function plansList226(){const out=[];for(const d of state.dms||[]){const src=isKim(d.id)?d.kimThread200?.plans:d.thread226?.plans;if(!Array.isArray(src))continue;
  for(const p of src){if(!p||typeof p!=='object')continue;const{day,slot}=planTime226(p,false);
   out.push({id:String(p.id||''),charId:d.id,activity:p.activity||p.what||null,place:p.place||p.where||null,day:Number.isFinite(day)?day:null,slot:slot||null,status:plansStatus226(p)})}}
 return JSON.parse(JSON.stringify(out))}
function applyPick(a,d,pick){
 const mem=thread(d);mem.turns=(Number(mem.turns)||0)+1;mem.lastIntent=pick.intent;
 if(pick.plan){const open=[...mem.plans].reverse().find(p=>p&&['pending','maybe','agreed'].includes(p.status)&&(!p.place||!pick.plan.place||p.place===pick.plan.place));
  const next={...(open||{}),...Object.fromEntries(Object.entries(pick.plan).filter(([,v])=>v!==''&&v!=null)),updatedAt:T()};if(!next.id)next.id='plan226-'+a.id+'-'+T();
  if(!Number.isFinite(next.madeDay))next.madeDay=Number(state.sceneDay)||0;planTime226(next,true); /* logic3: sceneDay = raw sceneDay the plan is for (null = pending), slot = morning/afternoon/night/null */
  const became=next.status==='agreed'&&open?.status!=='agreed';if(open)Object.assign(open,next);else mem.plans.push(next);mem.plans=mem.plans.slice(-8);
  try{dispatchEvent(new CustomEvent('scene:plans-changed',{detail:{charId:a.id,planId:next.id,status:plansStatus226(next)}}))}catch{}
  if(became){try{remember('plan_agreed',{celebrityId:a.id,celebrity:a.name,summary:`Agreed: ${planLabel(next)}`,activity:next.activity,place:next.place,when:next.when,visibility:'private'})}catch{}}}
}
function installReplies(){
 if(typeof finalDmLine!=='function')return false;const baseFinal=finalDmLine;
 finalDmLine=function(a,generated,input){
  const base=baseFinal.apply(this,arguments);
  try{if(!celebOk(a))return base;const t=String(input||'');{const P0=parseIntent226(t);if(P0.career&&!P0.favour&&!P0.theirs&&!P0.rude)return base} /* proposal engines own career/collab asks */
   const d=dmState(a.id),lines=t.split(/\n+/).map(x=>x.trim()).filter(Boolean),lastLine=lines[lines.length-1]||t;
   /* a merged burst is answered as a whole, led by its last message (what the player is waiting on) */
   let C=nonKimCandidates(a,lastLine,d,String(base||''));if(lines.length>1&&(!C[0]||['generic','base','question'].includes(C[0].intent))){const W=nonKimCandidates(a,t,d,String(base||''));if(W[0]&&!['generic','base'].includes(W[0].intent))C=W}
   const pick=C[0];if(!pick?.text)return base;applyPick(a,d,pick);return pick.text}
  catch(e){console.warn('logic226 reply',e);return base}};
 return true;
}
/* world reactions (kernel proactive fallbacks): vary, reference the real fact, no first-entry-always */
function proactive(a,f,channel){
 if(!celebOk(a)||!f)return'';const d=dmState(a.id),lv=level(a.id),detail=clean226(f.title||f.summary||f.text,80).replace(/[.!?]+$/,''),topic=f.topic||'general',seed=`${a.id}|${f.id||detail}|pro226|${channel}`;
 if(channel==='comment'){
  const k=topicWord(f.text||f.title||f.summary||'');const list=[...(OV[a.id]?.pub||[]),...PUB.topic,...PUB.general];return pubPick(a,list,seed,{k})}
 const B={music:['wait, {d}? how did it sound?','{d}? okay, how are you feeling about the music now?','{d}? who was in the room?','heard about the music thing. is it done or still changing?','okay, {d}. i want to hear how that went','so the music update. good or stressful?'],career:['wait, {d}? was it actually good or just good on paper?','{d}? okay, how did the room feel?','{d}? what happens next?','saw the news. good move?','{d}? is that a big deal or a small one?','okay, {d}. tell me the version that isn’t online'],travel:['wait, you’re in {c}? work or fun?','{c}? okay, how long are you there?','{c}! how is it?','you’re in {c}? eat something good','okay, {c}. send me one good photo'],general:['wait, {d}? what’s the story?','okay, {d}… explain','{d}? tell me the real version','i saw your update. what’s going on?','{d}? okay, i have questions','so… {d}. talk to me']};
 const list=lv==='stranger'?(B[topic]||B.general).slice(0,1):(B[topic]||B.general);const sd=shortFact226(f),dv=sd?{d:sd}:{};return pickLine(a,d,list,seed,{...dv,c:f.city||'a new city'})||pickLine(a,d,B.general,seed+'g',dv);
}
/* ---------- 5. public replies (task 4): replaces the 'Thank you 🤍' banks for non-Kim celebrities ---------- */
const PUB={
 compliment:['stop','okay i’ll take it','you’re being nice. suspicious','ok now say it louder','okay, you can stay','that’s kind'],
 question:['not answering that one in the comments 🙂','you’ll find out when everyone else does','good question. wrong place to ask it','that’s a dm question, if that','soon. maybe. we’ll see','some things stay out of the comments'],
 favour:['the comments are not a booking desk lol','bold. no','nice try','that’s a dm conversation, if that','i admire the confidence','asking in the comments is a choice'],
 negative:['noted 🙂','okay','we’ll all survive this somehow','respectfully, no','fair enough','noted. moving on'],
 topic:['okay, {k}','{K} is the part people will remember','not {k} 😭','{k} though. yes','{K} really is the whole thing','wait, {k}','{K}. no notes'],
 general:['okay this is good','real','i see it','lol okay','fair','this one’s good','honestly yes']
};
const TOPIC_WORDS=/\b(setlist|chorus|verse|demo|song|single|track|album|ep|mix|beat|gig|show|set|tour|audition|callback|scene|role|script|set life|fit|outfit|look|dress|makeup|hair|nails|shoot|photoshoot|photo|pic|selfie|video|dance|choreo|rehearsal|studio|campaign|launch|packaging|interview|premiere|red carpet|trailer|coffee|car|dog|cat|sunset|beach)\b/i;
function topicWord(text){const m=TOPIC_WORDS.exec(String(text||''));return m?m[0].toLowerCase():''}
function pubLedger(id){const s=store();s.pub=s.pub||{};s.pub[id]=Array.isArray(s.pub[id])?s.pub[id]:[];return s.pub[id]}
function subTopic(c,k){if(/\{k\}/i.test(c)&&!k)return null;return c.replace(/\bthe \{k\}/g,`the ${k}`).replace(/\{k\}/g,`the ${k}`).replace(/\{K\}/g,`The ${k}`)}
function pubPick(a,list,seed,vars){
 const led=pubLedger(a.id),others=Object.entries(store().pub||{}).filter(([id])=>id!==a.id).flatMap(([,v])=>v.slice(-3)),all=new Set(others),st=styleOf(a);const L=list.filter(Boolean);const start=Math.floor(roll(seed)*L.length);
 for(let pass=0;pass<2;pass++)for(let i=0;i<L.length;i++){let c=subTopic(L[(start+i)%L.length],vars?.k||'');if(c==null)continue;
  if(pass===1&&(led.slice(-4).includes(norm(c))||banned(c)||/\bthank/i.test(c)))continue;
  if(/\{[a-zA-Z]\}/.test(c))continue;let out=st.lower?c.replace(/^[A-Z](?=[a-z’' ])/,x=>x.toLowerCase()):c.replace(/^[a-z]/,x=>x.toUpperCase()).replace(/\bi\b/g,'I').replace(/([.!?]\s+)([a-z])/g,(m,x,y)=>x+y.toUpperCase());
  if(pass===0&&(led.includes(norm(out))||all.has(norm(out))||banned(out)||/\bthank/i.test(out)))continue;led.push(norm(out));if(led.length>10)led.shift();save();return out}
 return'';
}
function publicReply(a,text,negative){
 const t=String(text||''),low=t.toLowerCase(),k=topicWord(t),lv=level(a.id),seed=`${a.id}|${norm(t)}|pub226|${(pubLedger(a.id)).length}`,own=(OV[a.id]?.pub||[]);
 let list;
 const P=parseIntent226(t);
 if(negative||P.rude)list=PUB.negative;
 else if(P.favour||P.theirs||P.attention)list=PUB.favour;
 else if(P.question&&(P.aboutYou||P.askAbout||k))list=PUB.question;
 else if(P.praise)list=[...(OV[a.id]?.compliment||[]),...PUB.compliment];
 else if(k)list=[...own,...PUB.topic];
 else list=[...own,...PUB.general]; /* {k} templates drop out automatically when there is no topic word */
 if(lv==='rival'&&!negative)list=['okay','noted','sure','mhm','fine'];
 return pubPick(a,list,seed,{k});
}
function installPublic(){
 if(typeof publicPersonaReply!=='function')return false;const basePub=publicPersonaReply;
 publicPersonaReply=function(a,text,negative=false){
  if(!celebOk(a))return basePub.apply(this,arguments);
  if(!STYLE[a.id]){ /* no voice sheet: keep the character's existing bank line unless it is a thank-you / banned / a repeat */
   try{const b=String(basePub.apply(this,arguments)||''),led=pubLedger(a.id);if(b&&!/\bthank/i.test(b)&&!banned(b)&&!led.includes(norm(b))&&!/^(okay|ok|noted)\.?$/i.test(b.trim())){led.push(norm(b));if(led.length>10)led.shift();save();return styleOf(a).lower?lowerI226(b):b}}catch{}}
  try{const out=publicReply(a,text,negative);if(out)return out}catch(e){console.warn('logic226 public',e)}
  const b=basePub.apply(this,arguments);return /^\s*(thank you|that’s sweet, thank you|thanks for)/i.test(String(b||''))?(styleOf(a).lower?'okay':'Okay'):b};
 return true;
}

function install(){
 if(!state)return;store();installKernel();const dmOk=installDm();
 try{if(state.player)repairNarration()}catch(e){console.warn('logic226 repair',e)}
 const repliesOk=installReplies(),publicOk=installPublic();
 globalThis.SCENE_LOGIC226={version:VERSION,tier,decide,inspect:()=>JSON.parse(JSON.stringify(store())),dmGate:dmOk,replies:repliesOk,publicReplies:publicOk,proactive,publicReply,level,parseIntent:parseIntent226,planDecision:planDecision226,shortFact:shortFact226,__banks:()=>JSON.parse(JSON.stringify({OV,G,PUB}))};
 try{let ch=false;for(const d of state.dms||[]){if(isKim(d.id)||!Array.isArray(d.thread226?.plans))continue;for(const p of d.thread226.plans){if(p&&typeof p==='object'&&(!('sceneDay' in p)||!('slot' in p))){const x=planTime226(p,false);if(!('sceneDay' in p))p.sceneDay=x.day;if(!('slot' in p))p.slot=x.slot;ch=true}}}if(ch)save()}catch{} /* logic3: additive migration, missing day/slot -> resolved or null */
 try{if(!globalThis.SCENE_PLANS)Object.defineProperty(globalThis,'SCENE_PLANS',{value:Object.freeze({list:plansList226}),writable:false,configurable:true})}catch{}
}
install();
})();
