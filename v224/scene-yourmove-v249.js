/* SCENE yourmove249 (Gameplay Logic, 2026-10-11): "Your Move" only when there is a concrete next action, and the copy names it.
   Root cause: story-brain-v169 queues a generic careerBeat ("Turn this post into a real-world move" / "Turn this into the next room" /
   "Choose the next move that gives the world a new reason to care") after every ordinary post, chapter milestone or empty queue, and
   generic composeBeats ("Put your version on the record"); scene-next-v227 falls back to "Take the next booking". uiux10 shows any of
   them under the YOUR MOVE kicker.
   Fix (additive, wrapper only, no story-brain edit):
   1. SCENE_STORY169.objective(): when the queue head is a 'career' or 'compose' beat, rewrite its title/sub so it NAMES the action:
        career  -> a real open booking right now (SCENE_JOBS48.jobs(), energy ok or beta): Book “<gig · place>” / Open now in <city> · <pay> · <n>⚡
        compose -> what to post, from the beat's own fact kind + subject (job/travel/event/career_story/music/chart/celeb/tv/award/brand)
      If nothing concrete exists (no affordable booking; fact kind general/milestone/tv_claim or no subject) the card is suppressed:
        - more beats queued behind it -> the vague head is removed from state.sceneStory169.queue (not written to history, so it never
          counts as a finished story beat) and the next beat is shown;
        - it is the only beat -> objective() returns null (beat kept; shows later, named, once a booking is affordable). No re-queue loop.
      'event' / 'dm' / 'reaction' beats are already concrete (named person / choices) and pass through unchanged. Actions unchanged.
   2. SCENE_NEXT.getState(): the 'career:work' fallback beat becomes the named booking (action gig:<id>, handled by SCENE_CAREER.act /
      uiux10 act) or null (uiux10 then shows its own UP FOR GRABS booking card or "All quiet").
   No money, save-economy, follower, level, relationship, registry or DM-composer changes. Reads only; the only write is the queue shift in 1.
   Copy: window.SCENE_YOURMOVE_LINES (Writer, optional) overrides any FB key below; {slots} must all fill or the fallback is used.
   Kill switch window.SCENE_YOURMOVE_OFF=true (checked on every call: original objective/getState output passes through untouched). */
(()=>{
'use strict';
if(window.SCENE_YOURMOVE)return;
const V=249,K='sceneStory169',OFF=()=>window.SCENE_YOURMOVE_OFF===true;
const S0=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const G=n=>{try{return globalThis[n]}catch{return undefined}};
const save0=()=>{try{save()}catch{}};
const clip=(t,n=70)=>{t=String(t||'').replace(/\s+/g,' ').trim();return t.length>n?t.slice(0,n-1).trim()+'…':t};
const FB={
 'ym.book.title':'Book “{gig}”','ym.book.sub':'Open now in {city} · {pay} · {energy}⚡',
 'ym.book.subBeta':'Open now in {city} · {pay}','ym.book.button':'Book it',
 'ym.post.job':'Post one behind-the-scenes detail from {subject}','ym.post.travel':'Post your first {subject} moment',
 'ym.post.event':'Post your side of “{subject}”','ym.post.career_story':'Post what changed after “{subject}”',
 'ym.post.chart_achievement':'Post the chart screenshot and thank your listeners','ym.post.music_release':'Post the release with one line about the song',
 'ym.post.music_work':'Post one studio clue — no release date','ym.post.music_stats':'Post the real numbers, not hype',
 'ym.post.celebrity_interaction':'Post a casual reply to {subject}','ym.post.celebrity_reference':'Post about {subject} — keep it casual',
 'ym.post.tv_appearance':'Post a filming-day tease for {subject}','ym.post.award':'Post a thank-you naming who got you there',
 'ym.post.brand':'Post the collab detail you are allowed to share','ym.post.button':'Write the post'
};
const POST_KINDS=new Set(['job','travel','event','career_story','chart_achievement','music_release','music_work','music_stats','celebrity_interaction','celebrity_reference','tv_appearance','award','brand']);
function fill(t,v){if(typeof t!=='string'||!t)return null;let miss=false;const out=t.replace(/\{(\w+)\}/g,(_,k)=>{const x=v[k];if(x===undefined||x===null||x==='')miss=true;return String(x??'')});return miss?null:out}
function line(key,v={}){const W=G('SCENE_YOURMOVE_LINES');let w=W&&W[key];if(Array.isArray(w))w=w[Math.floor(Math.random()*w.length)];return fill(w,v)||fill(FB[key],v)}
/* the first booking the player can start right now (same list the Career work view / uiux10 rail renders) */
function booking(){const J=G('SCENE_JOBS48'),s=S0();if(!J||!s?.player)return null;let jobs=[];try{jobs=J.jobs()||[]}catch{return null}
 const en=Number(s.player.energy)||0,j=jobs.find(x=>x&&x[0]&&(s.betaMode||en>=(Number(x[3])||0)));if(!j)return null;
 let pay='';try{pay=J.payLabel(j)||''}catch{}
 return{id:String(j[0]),gig:clip(j.displayTitle||j[1],60),venue:clip(j[2]||'',40),pay,energy:Number(j[3])||0,city:s.player.city||'Los Angeles',beta:!!s.betaMode}}
function bookCopy(bk){const v={gig:bk.gig,venue:bk.venue,city:bk.city,pay:bk.pay,energy:bk.energy};
 return{title:line('ym.book.title',v),sub:line(bk.beta?'ym.book.subBeta':'ym.book.sub',v)||'',button:line('ym.book.button')}}
function postCopy(fact){const kind=String(fact?.kind||''),subject=clip(fact?.subject||'',60);if(!POST_KINDS.has(kind))return null;
 if(!subject||/^(latest move|live situation|career story|career booking|travel)$/i.test(subject))return null;
 const title=line('ym.post.'+kind,{subject});if(!title)return null;return{title,sub:clip(fact.summary||'',160),button:line('ym.post.button')}}
/* concrete copy for a queued story169 beat, or null when there is no concrete action */
function concrete(b){if(!b)return null;if(b.type==='career'){const bk=booking();return bk?bookCopy(bk):null}
 if(b.type==='compose')return postCopy(b.fact);return{}}
let dropped=0;
function wrapObjective(orig){return function(){let o=orig.apply(this,arguments);if(OFF())return o;
 for(let i=0;i<6&&o;i++){const st=S0()?.[K],b=st?.queue?.[0];if(!b||o.action!==`story169:${b.id}`)return o;
  if(b.type!=='career'&&b.type!=='compose')return o;
  const c=concrete(b);if(c)return Object.assign({},o,c,{label:b.type==='career'?(o.label||'NEXT CAREER BEAT'):(o.label||'YOUR MOVE')});
  if(st.queue.length>1){st.queue.shift();dropped++;save0();o=orig.apply(this,arguments);continue}
  return null}
 return o}}
function wrapNext(orig){return function(){const st=orig.apply(this,arguments);if(OFF()||!st||!st.beat||st.beat.action!=='career:work')return st;
 const bk=booking();if(!bk)return Object.assign({},st,{beat:null});const c=bookCopy(bk);
 return Object.assign({},st,{beat:{id:'gig:'+bk.id,title:c.title,hook:c.sub,tab:'career.work',action:'gig:'+bk.id}})}}
const done={story:false,next:false};
function hook(){const S=G('SCENE_STORY169');if(!done.story&&S&&typeof S.objective==='function'){S.objective=wrapObjective(S.objective);done.story=true}
 const N=G('SCENE_NEXT');if(!done.next&&N&&typeof N.getState==='function'){N.getState=wrapNext(N.getState);done.next=true}
 return done.story&&done.next}
window.SCENE_YOURMOVE={version:V,concrete,booking,postCopy,inspect:()=>({hooked:{...done},dropped,off:OFF()})};
if(!hook()){let n=0;const t=setInterval(()=>{if(hook()||++n>240)clearInterval(t)},250)}
})();
