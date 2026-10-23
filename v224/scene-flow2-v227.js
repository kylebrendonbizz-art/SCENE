/* SCENE Gameplay Logic · v227 flow2 module (viral card feed, side-quest auto-claim, Activity badge source, SCENE_CAREER).
   Additive, loaded after scene-next-v227.js (end of the v224 list).
   A) Viral card from real state only.
      Logic is the source of sceneFX.viral() calls. Every number passed is read from the save at call time:
        views   = metricsFor(post).views  (the exact count the post card shows)
        likes   = metricsFor(post).likes
        likedBy = names of celebrities with a real 'like' notification on THIS post (gameplay-polish-v143 orbit likes)
        delta   = real follower gain since logic first saw the post (uiux7 renders delta as "+N new followers",
                  so views gained must NOT go in delta; it is passed as viewsGained, which uiux7 ignores)
        repostBy is never passed: reposts are anonymous computed counts, no real account exists.
      Threshold (VIRAL227.minViews / followerRatio): the player's LATEST post is "taking off" when its shown views
        reach max(1000, 3 x followers) -- the same line uiux2's viral gate uses (CONFIG.caps.viralMinViews /
        viralFollowerMult), so a logic card is never removed by uiux2. Motion caps the card at one per in-game day.
      Bookkeeping lives in localStorage 'scene-viral227:<handle>' (NOT in the save, so the save format is unchanged).
      Paid viral push (living-world-v48 kind 'viral') calls SCENE_VIRAL227.fromPush(post) synchronously, so the
      real-numbers card claims the day before motion's number-less memory hook can.
      globalThis.SCENE_VIRAL_LOGIC227=true lets UI/UX gate motion.js self-triggers (see CHANGES_FLOW2.md).
   B) Side quests auto-claim on completion (no claim UI exists in the v48 Career view).
      autoClaimQuests227(quests) is called from immersion-v39 progressQuests. Grants through the existing
      claimQuest(id,{auto:true}) so applyEffect math, side_quest memory, notification and stage bonus are unchanged;
      q.claimed (the game's own saved flag) is set inside claimQuest BEFORE applyEffect, and quests already in the
      side_quest memory ledger are marked claimed without paying, so a double grant is impossible (also across reloads). Feedback = ONE item: SCENE_POPQ.push({id:q.id,kind:'reward',...})
      when uiux2's queue exists, else one existing toast (flash). */
(()=>{
'use strict';
if(globalThis.SCENE_VIRAL227)return;
const VIRAL227={minViews:1000,followerRatio:3,maxLikedBy:3,tickMs:250};
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const cel=id=>{try{return typeof byId==='function'?byId(id):null}catch{return null}};
const key=()=>{const p=S()?.player;return p?`scene-viral227:${p.handle||p.name||'player'}`:null};
function load(){const k=key();if(!k)return null;try{const v=JSON.parse(localStorage.getItem(k)||'null');if(v&&Array.isArray(v.fired)&&v.seen&&typeof v.seen==='object')return v}catch{}return{fired:[],seen:{}}}
function store(v){const k=key();if(!k)return;v.fired=v.fired.slice(0,80);const ids=Object.keys(v.seen);if(ids.length>40)for(const id of ids.slice(0,ids.length-40))delete v.seen[id];try{localStorage.setItem(k,JSON.stringify(v))}catch{}}
function metrics(p){try{const m=metricsFor(p);return{views:Math.round(Number(m.views)||0),likes:Math.round(Number(m.likes)||0)}}catch{return{views:0,likes:0}}}
function likedBy(p){const out=[];for(const n of (S()?.notifications||[])){if(n&&n.kind==='like'&&n.celebrityId&&n.postId===p.id){const c=cel(n.celebrityId),name=c?.name;if(name&&!out.includes(name))out.push(name);if(out.length>=VIRAL227.maxLikedBy)break}}return out}
const threshold=()=>{const fol=Math.max(1,Number(S()?.player?.followers)||1);return Math.max(VIRAL227.minViews,Math.round(fol*VIRAL227.followerRatio))};
const fx=()=>globalThis.sceneFX&&typeof globalThis.sceneFX.viral==='function'?globalThis.sceneFX:null;
const blocked=()=>{try{return Boolean(fx()?._int?.blocked?.())}catch{return false}};
let last=null;
function payload(p,rec){const m=metrics(p),fol=Number(S()?.player?.followers)||0,base=rec.seen[p.id]||{followers:fol,views:m.views};
  const o={natural:'logic227',postId:p.id,views:m.views,likes:m.likes,viewsGained:Math.max(0,m.views-(base.views||0))};
  const d=fol-(Number(base.followers)||fol);if(d>0)o.delta=d;const lb=likedBy(p);if(lb.length)o.likedBy=lb;return o}
function fire(p,rec){const o=payload(p,rec);if(!o.views)return false;rec.fired.unshift(p.id);store(rec);let r=null;try{r=fx().viral(o)}catch(e){console.warn('viral227',e)}last={at:Date.now(),post:p.id,opts:o,shown:r!==null};return true}
function scan(){const s=S();if(!s?.player||!fx())return;const rec=load();if(!rec)return;const fol=Number(s.player.followers)||0;let dirty=false;
  const posts=(s.posts||[]).filter(x=>x&&x.authorId==='player').slice(0,1);/* latest post only (same post uiux2's viral gate checks) */
  for(const p of posts){if(rec.fired.includes(p.id))continue;const m=metrics(p);
    if(!rec.seen[p.id]){rec.seen[p.id]={followers:fol,views:m.views};dirty=true;/* already past the line when first seen (old save / reload): not taking off now, never card it */if(m.views>=threshold()){rec.fired.unshift(p.id);continue}}
    if(m.views>=threshold()&&!blocked()){fire(p,rec);return}}
  if(dirty)store(rec)}
/* paid viral push: called synchronously from living-world-v48 right after the push changes the post */
function fromPush(p,followerGain){if(!p||!fx())return null;const rec=load();if(!rec||rec.fired.includes(p.id))return null;const fol=Number(S()?.player?.followers)||0,g=Math.max(0,Math.round(Number(followerGain)||0));/* baseline = followers just before the push, so delta is exactly what the push added */rec.seen[p.id]={followers:fol-g,views:(rec.seen[p.id]?.views)||0};store(rec);/* below the line: no card yet; scan() fires when the boosted post actually crosses it */if(metrics(p).views<threshold()||blocked())return null;fire(p,rec);return last}
/* ---------- B) side quests ---------- */
const pending=new Set(),toasted=new Set();
const R=['money','xp','gems','followers'];
function snap(){const p=S()?.player||{};const o={};for(const k of R)o[k]=Number(p[k])||0;return o}
function feedback(q,gain,extra){const rewards={};for(const k of R)if(gain[k])rewards[k]=gain[k];
  const title=`Side quest complete · ${q.text}`;
  if(window.SCENE_POPQ&&typeof window.SCENE_POPQ.push==='function'){try{window.SCENE_POPQ.push({id:q.id,kind:'reward',title,rewards,...(extra?{detail:extra}:{})});return}catch(e){console.warn('popq227',e)}}
  if(toasted.has(q.id))return;toasted.add(q.id);try{flash(`${title} · ${q.rewardLabel||''}`.replace(/ · $/,''))}catch{}}
/* already paid on this save? side_quest memory (written by claimQuest since v39) is the game's own ledger: a quest set that was
   regenerated with claimed:false (syncQuestStage) must not pay again. Then the game's own q.claimed is set without paying. */
function paidBefore(id){return (S()?.memory||[]).some(m=>m&&m.type==='side_quest'&&m.questId===id)}
/* earned check: only pay when the quest's real progress meets its target right now, after the save has finished loading.
   A done flag set during boot (before posts/history are loaded) is cleared instead of paid. */
function earned227(q){try{const f=globalThis.questProgress227;return typeof f==='function'?f(q)>=q.target:true}catch{return false}}
function booted227(){return document.readyState==='complete'&&performance.now()-(globalThis.__sceneLoadAt227||0)>1500}
addEventListener('load',()=>{globalThis.__sceneLoadAt227=performance.now()});
function claimNow(id){pending.delete(id);const s=S();const q=s?.missions?.quests?.find(x=>x.id===id);if(!q||!q.done||q.claimed)return;
  if(!booted227()){pending.add(id);setTimeout(()=>claimNow(id),600);return}
  if(!earned227(q)){q.done=false;try{save()}catch{}return}

  if(paidBefore(id)){q.claimed=true;try{save()}catch{}return}
  const before=snap(),stageBefore=(s.questStageBonuses||[]).length;let res=null;try{res=claimQuest(id,{auto:true})}catch(e){console.warn('claim227',e);return}
  if(!q.claimed)return;const after=snap(),gain={};for(const k of R)gain[k]=after[k]-before[k];
  const extra=(s.questStageBonuses||[]).length>stageBefore?(res&&res.extra)||'':'';feedback(q,gain,extra);try{render()}catch{}}
globalThis.autoClaimQuests227=function(quests){let fixed=false;/* ledger-paid first, synchronously, so the stage-set bonus logic in claimQuest sees the true claimed set */for(const q of quests||[])if(q&&q.done&&!q.claimed&&paidBefore(q.id)){q.claimed=true;fixed=true}if(fixed){try{save()}catch{}}for(const q of quests||[]){if(q&&q.done&&!q.claimed&&!pending.has(q.id)){pending.add(q.id);setTimeout(()=>claimNow(q.id),0)}}};
/* ---------- C) Activity badge = same source as the list ----------
   The tab badge used unreadCount(channel) (raw unread notifications) while the list renders activityDisplayItems(channel)
   (merged/grouped rows). Both now count unread rows of activityDisplayItems for 'social' and 'progress'; the total
   (no channel) swaps those two parts for the same numbers. Read-only: no notification is changed. */
try{if(typeof unreadCount==='function'&&typeof activityDisplayItems==='function'&&!unreadCount.v227){
  const baseUnread227=unreadCount;
  const rows=ch=>{try{return activityDisplayItems(ch).filter(x=>x&&x.unread).length}catch{return baseUnread227(ch)}};
  unreadCount=function(channel=''){if(channel==='social'||channel==='progress')return rows(channel);if(!channel){const all=baseUnread227('');return Math.max(0,all-baseUnread227('social')-baseUnread227('progress')+rows('social')+rows('progress'))}return baseUnread227(channel)};
  unreadCount.v227=true}}catch(e){console.warn('badge227',e)}
/* one-time repair: older builds saved the bell's click Event as state.activityView (app.js bell handler, fixed in flow2).
   Only that field is touched, and only when it is not a valid tab name. */
try{const s=S();if(s&&s.activityView!==undefined&&!['social','progress'].includes(s.activityView)){s.activityView='social';try{save()}catch{}}}catch{}
/* ---------- D) SCENE_CAREER: one read-only data source for the Career redesign (UI/UX) ---------- */
const clip=(t,n=90)=>{t=String(t||'').replace(/\s+/g,' ').trim();return t.length>n?t.slice(0,n-1).trim()+'…':t};
const venueOf=t=>{t=String(t||'');const m=t.match(/\bat (?:the )?([^.!?,]+)$/i)||t.match(/^(?:the )?(.+?) (?:asks|needs|wants|offers|invites|is looking)\b/i);return m?m[1].trim():''};
/* bookings2: short 'Gig · Place' titles for story-op cards (was a sentence fragment such as 'Hollywood rehearsal room asks for a live acoustic take').
   Gig = the op's own kind from its badge ('CITY · KIND'); Place = the city place named in the op, minus its room-type noun. Ids unchanged. */
const GIG_NAMES={'ACOUSTIC TAKE':'Acoustic session','EXTRA UPGRADE':'Speaking line','LOCAL FEED':'Local feature','LOCAL PRESS':'Local press','FAN CLIP':'Fan clip'};
const gigName=k=>{k=String(k||'').trim().toUpperCase();if(!k)return'';if(GIG_NAMES[k])return GIG_NAMES[k];const t=k.toLowerCase().replace(/\b(dj|ugc)\b/g,x=>x.toUpperCase());return t.charAt(0).toUpperCase()+t.slice(1)};
const PLACE_NOUN=/\s+(?:studio lot|rehearsal room|creative office|press office|media office|fashion office|pop-up|showcase|mixer|studio|room|launch|rooftop|gallery|shoot|gathering|venue|dinner|office|event)$/i;
function placeOf(op,J){let list=[];try{list=J&&typeof J.places==='function'?J.places()||[]:[]}catch{}const t=String(op?.title||'');return list.filter(x=>x&&t.includes(x)).sort((a,b)=>b.length-a.length)[0]||''}
function gigTitle(op,J){const kind=String(op?.badge||'').split(' · ').pop(),gig=gigName(kind),place=placeOf(op,J),short=place?(place.replace(PLACE_NOUN,'')||place):(S()?.player?.city||'');if(!gig)return venueOf(op?.title)||op?.title||'';return short?`${gig} · ${short}`:gig}
function careerNext(){const N=globalThis.SCENE_NEXT;if(N&&typeof N.getState==='function'){try{const st=N.getState()||{};return{beat:st.beat||null,sideItems:(st.sideItems||[]).slice(0,2),queued:Number(st.queued)||0,source:'SCENE_NEXT'}}catch{}}
  let o=null;try{o=globalThis.SCENE_STORY169?.objective?.()||null}catch{}return{beat:o?{id:String(o.action||'').replace(/^story169:/,'story:'),title:o.title,hook:o.sub||'',tab:'career',action:o.action}:null,sideItems:[],queued:0,source:'SCENE_STORY169'}}
function careerBookings(){const J=globalThis.SCENE_JOBS48;if(!J)return[];const s=S(),p=s?.player||{},when='now'/* bookings start on tap: no scheduled slots exist */,out=[];
  try{for(const j of J.jobs()){const energy=s?.betaMode?0:Number(j[3])||0;out.push({id:'gig:'+j[0],kind:'job',title:clip(j.displayTitle||j[1],60),venue:j[2]||'',pay:{min:j[4]?.[0]||0,max:j[4]?.[1]||0,label:J.payLabel(j),currency:J.currency(),note:'finishGig48 pays rand(min,max) x outcome tier (messy .75 / solid 1 / standout 1.22 / viral 1.45)'},when,requirements:{energy,energyOk:(Number(p.energy)||0)>=energy,rank:j[5]||0,rankName:J.rankName(j[5]||0),rankOk:(j[5]||0)<=J.rank()},action:'gig:'+j[0]})}}catch(e){console.warn('career227 jobs',e)}
  try{for(const op of J.storyOps()){const money=(op.choices||[]).map(c=>Number(c?.[1]?.money)||0).filter(x=>x>0),en=Math.max(0,...(op.choices||[]).map(c=>-(Number(c?.[1]?.energy)||0)));
    out.push({id:'story:'+op.id,kind:'story',title:clip(gigTitle(op,J),60),venue:placeOf(op,J)||venueOf(op.title),label:op.badge||'',pay:money.length?{min:J.money(Math.min(...money)),max:J.money(Math.max(...money)),label:'',currency:'USD'}:null,when,requirements:{energy:s?.betaMode?0:en,energyOk:s?.betaMode||(Number(p.energy)||0)>=en},action:'story:'+op.id})}}catch(e){console.warn('career227 story ops',e)}
  return out}
function careerStory(){let h=[];try{h=globalThis.SCENE_STORY169?.inspect?.().history||[]}catch{}const mem=S()?.memory||[];
  const played=h.filter(b=>b&&(/^memory:/.test(b.completedReason||'')||b.completedReason==='viewed-fallout'||b.completedReason==='already-resolved-v227'));
  return played.map(b=>{let outcome='';if(b.type==='event'&&b.event?.title){const m=mem.find(x=>x&&x.type==='event'&&x.title===b.event.title&&(Number(x.at)||0)>=(Number(b.createdAt)||0));outcome=clip(m?.outcome||m?.choice||'',160)}else outcome=clip(b.sub||'',160);
    const d=Number.isFinite(Number(b.day))?Number(b.day):null;return{id:b.id,kind:'story',day:d,dayLabel:d===null?null:d+1,title:clip(b.title||b.event?.title||'',90),outcome,type:b.type,at:b.completedAt||0}}).sort((a,b)=>b.at-a.at).slice(0,20)}
function careerState(){if(!S()?.player)return{next:{beat:null,sideItems:[],queued:0},bookings:[],story:[]};return{next:careerNext(),bookings:careerBookings(),story:careerStory()}}
let careerSig='';
function careerTick(){if(!S()?.player)return;const st=careerState(),sig=JSON.stringify([st.next.beat?.id,st.next.beat?.title,st.next.sideItems.map(x=>x.id),st.bookings.map(b=>b.id+'|'+b.requirements.energyOk),st.story.map(x=>x.id)]);if(sig!==careerSig){careerSig=sig;try{window.dispatchEvent(new CustomEvent('scene:career-changed',{detail:st}))}catch{}}return st}
function careerAct(action){const a=String(action||'');try{if(a.startsWith('gig:')){startGig(a.slice(4));return true}if(a.startsWith('story:')){return Boolean(globalThis.SCENE_JOBS48?.openStory(a.slice(6)))}if(a.startsWith('story169:'))return Boolean(globalThis.SCENE_STORY169?.act?.(a.slice(9)))}catch(e){console.warn('career227 act',e)}return false}
globalThis.SCENE_CAREER={version:'v227-flow2',getState:()=>careerState(),act:careerAct};
addEventListener('scene:next-changed',()=>{try{careerTick()}catch{}});
setInterval(()=>{try{careerTick()}catch(e){console.warn('career227 tick',e)}},1000);
globalThis.SCENE_VIRAL_LOGIC227=true;
globalThis.SCENE_VIRAL227={version:'v227-flow2',config:VIRAL227,threshold,scan,fromPush,last:()=>last,record:load};
setInterval(()=>{try{scan()}catch(e){console.warn('viral227 tick',e)}},VIRAL227.tickMs);
})();
