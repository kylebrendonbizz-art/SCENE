/* SCENE hf301-context (S1 hotfix d, 2026-10-17): no "Congrats" for arrests, bad weeks or ordinary posts.
   Bug (audit F1): director157 activeLine157 falls back to "Saw X. Congrats - keep your head down and enjoy it." /
   "I saw X. That's a good step. Congrats." for every not-close celeb regardless of what happened, so 124/185 celebs
   congratulate "I was arrested last night". Close-friend templates say "happy for you" / "really exciting" the same way.
   In-game the line is usually a feedguard230 writer line (roster-lines-v228 celebReaction pools), which is just as context-deaf:
   "Your post “rough day. not okay tbh” made me laugh in a meeting.", "Heard LA treated you well." under an arrest post.
   Fix: a context guard classifies the source event (trouble / vulnerable / achievement / travel / ordinary) with an offline
   lexicon. Wording is replaced only where it does not fit: trouble+vulnerable -> celebration OR upbeat/flippant/endorsing
   phrases; ordinary+travel -> "congrats" templates. Under trouble posts, celebs with an authored writer bank get a neutral line
   from THEIR OWN bank first (voice kept); everyone else gets a short caring/neutral line. Achievements and every hand-written per-celeb bank (kylie, sabrina, kim, ... and the
   chart/KUWTK/project lines) are left untouched. Replacements are neutral/caring lines about the PLAYER's post; they never
   attribute anything to the celeb. Deterministic per (celeb, event).
   Hooks: (1) SCENE_DIRECTOR157.narration.celeb (exported line function); (2) remember('scene_celeb_reaction') - the line is
   corrected in the memory record and in the comment / world post / DM director157 just placed, and in the notification that
   follows. No new save keys. Kill switch: window.SCENE_HF_CONTEXT_OFF=true (or SCENE_HOTFIX301_OFF=true), checked per call. */
(()=>{'use strict';
if(window.SCENE_HF301_CONTEXT)return;
const OFF=()=>window.SCENE_HF_CONTEXT_OFF===true||window.SCENE_HOTFIX301_OFF===true;
const READY=()=>{try{return typeof state!=='undefined'&&typeof save==='function'&&typeof render==='function'&&typeof remember==='function'&&typeof addNotif==='function'&&[...document.scripts].some(x=>/scene-stories-v229\.js/.test(x.src))}catch{return false}};
const whenReady=(fn,delay)=>{const go=()=>setTimeout(()=>{try{fn()}catch(e){console.warn('hf301',e)}},delay);if(READY())return go();/* one shared boot poll for all hf301 files */const Q=window.__HF301Q=window.__HF301Q||[];Q.push(go);if(Q.length===1){const t=setInterval(()=>{if(READY()){clearInterval(t);for(const g of Q.splice(0))g()}},250)}};
const S=()=>{try{return state}catch{return null}};
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const TROUBLE=/\b(arrest(ed)?|jail(ed)?|prison|cops?|police|court|lawsuit|sued|charged|indicted|mugshot|dui|fired|got dropped|dropped me|cancel+ed|scandal|exposed|leak(ed)?|feud|beef|receipts|burning (every )?bridges?|no regrets|come get me|most talented|everyone knows it|fake industry|industry is fake|meltdown|rehab|overdose|fight|banned)\b/i;
const VULN=/\b(rough (day|week|month|time)|hard (day|week|time)|overwhelmed|sad|lonely|miss (my|you|home|them|him|her)|breakup|broke up|heartbroken|hospital|funeral|grief|grieving|passed away|lost (my|our)|crying|cried|anxious|anxiety|depressed|burn(ed|t)? out|can'?t sleep|not okay|struggling)\b/i;
const ACH=/\b(signed|record deal|won|award|number one|#1|no\. ?1|charts?|sold out|lead role|booked|platinum|gold record|nominated|nomination|milestone|launch(ed|ing)?|premiere|headlin\w+|debut|engaged|promotion|cover of)\b/i;
function classify(m){if(!m)return'unknown';const t=String(m.text||m.title||m.choice||'');
  if(m.type==='travel')return'travel';if(m.type==='gig')return m.outcome==='messy'?'ordinary':'achievement';
  if(TROUBLE.test(t))return'trouble';if(VULN.test(t))return'vulnerable';if(ACH.test(t))return'achievement';
  if(m.type==='player_post')return'ordinary';return'unknown'}
const CELEBRATE=/\b(congrat\w*|happy for you|good step|really exciting|enjoy it|proud of you|well deserved|you earned it)\b/i;
const CONGRATS=/\bcongrat\w*/i;
/* upbeat / flippant / endorsing wording that reads wrong under an arrest, a meltdown or a bad week (writer feedguard230 lines included) */
const FLIPPANT=/(made me laugh|treated you well|is working|keep doing whatever|keep it that way|more work than most press releases|feed-worthy|dangerously postable|obsessed|iconic|unhinged|deeply unserious|is a good caption|cute+\b|short film|the right amount|i support it|looked fun|didn't explain it|meant something|has a rhythm|curated|point of view|in a good way|make (the next one|it) (weirder|ruder)|proceed\.|continue$|chaos in the right order|room was better|good pairing|smart yes|you held it|getting booked in the right rooms|jealous of your nights|insane in a good way|so good|looked so good|best-dressed|unfairly good|suspiciously good|iconic|finally someone gets it|respect$)/i;
const P={
 trouble:[d=>`Saw ${d}. Call me before you post anything else about it.`,d=>`Saw ${d}. Not doing this in the comments — text me.`,d=>`Saw ${d}. Hope you've got good people around you right now.`,d=>`Saw ${d}. Whatever happened, don't let the replies write the story.`,d=>`Saw ${d}. Are you actually okay?`,d=>`Saw ${d}. Talk to your team before round two.`,d=>`Saw ${d}. Staying out of the comments on this one. You good?`,d=>`Saw ${d}. Bold. Be smart about the next move.`,d=>`Saw ${d}. That one's going to follow you for a while — breathe first.`,d=>`Saw ${d}. Sleep on it before you say anything else.`],
 vulnerable:[d=>`Saw ${d}. Sending you love — no need to reply.`,d=>`Saw ${d}. Rough weeks end. Text me if you want to vent.`,d=>`Saw ${d}. Be easy on yourself today.`,d=>`Saw ${d}. Logging off for a day is allowed.`,d=>`Saw ${d}. Here if you need a distraction.`,d=>`Saw ${d}. Take care of yourself first, the timeline can wait.`,d=>`Saw ${d}. You don't have to be "on" today.`],
 ordinary:[d=>`Saw ${d}. Honestly a mood.`,d=>`Saw ${d}. Love a normal day.`,d=>`Saw ${d}. Okay, I see you.`,d=>`Saw ${d}. Very relatable, not gonna lie.`,d=>`Saw ${d}. Same energy as my week.`,d=>`Saw ${d}. Keep posting the small stuff, people like it.`,d=>`Saw ${d}. This is the content I'm here for.`,d=>`Saw ${d}. Low-key my favourite kind of post.`],
 travel:[d=>`Saw ${d}. Have the best time.`,d=>`Saw ${d}. Eat something good for me.`,d=>`Saw ${d}. Jealous, honestly.`,d=>`Saw ${d}. Send recs if you find a good spot.`,d=>`Saw ${d}. Safe travels — don't overbook yourself.`,d=>`Saw ${d}. Good city for a reset.`]};
P.unknown=P.ordinary;
let lastDetail='';
function detailOf(m){try{const f=globalThis.SCENE_DIRECTOR157?.narration?.beatDetail;if(f)return f(m)}catch{}return m?.type==='player_post'&&m.text?`the post “${String(m.text).replace(/\s+/g,' ').slice(0,78)}”`:'that'}
function traits(a){try{return typeof dmBioTraits==='function'?dmBioTraits(a)||{}:{}}catch{return{}}}
const stats={checked:0,rewritten:0,ownBank:0,byKind:{}};
/* celebs with an authored writer bank keep their own voice under trouble posts: pick a neutral line from THEIR bank
   (no booking/place/event/celeb slots, nothing upbeat) and fill {postTopic}/{player}/{day}/{city} */
function ownBank(a,m,seed){try{const B=globalThis.SCENE_ROSTER_LINES?.feed?.celebReaction?.[a.id];if(!Array.isArray(B))return'';
  const ok=B.filter(t=>typeof t==='string'&&!/\{(booking|place|event|celeb)\}/.test(t)&&!CELEBRATE.test(t)&&!FLIPPANT.test(t)&&!/(good|pretty|fun|love|perfect|soft|golden|so clean|consistent|tasteful|lol|lmao|😂|👀|crazy)/i.test(t));if(!ok.length)return'';
  const st=S()||{},topic=String(m.text||m.title||'').replace(/\s+/g,' ').trim().slice(0,60);const t=ok[seed%ok.length];if(/\{postTopic\}/.test(t)&&!topic)return'';
  stats.ownBank++;return t.replace(/\{postTopic\}/g,topic).replace(/\{player\}/g,st.player?.name||'you').replace(/\{day\}/g,String(Number(st.sceneDay)||0)).replace(/\{city\}/g,st.player?.city||'LA')}catch{return''}}
function guard(line,a,m){if(OFF()||!line||!a||!m)return line;stats.checked++;const k=classify(m);const s=String(line);
  const bad=(k==='trouble'||k==='vulnerable')?(CELEBRATE.test(s)||FLIPPANT.test(s)):(k==='ordinary'||k==='travel'||k==='unknown')?CONGRATS.test(s):false;if(!bad)return line;
  const seed=H(`${a.id}|${m.id||m.postId||m.type}|hf301`);let out=k==='trouble'?ownBank(a,m,seed):'';
  if(!out){const pool=P[k]||P.ordinary,d=detailOf(m);out=pool[seed%pool.length](d)}
  if(traits(a).lower)out=out.charAt(0).toLowerCase()+out.slice(1).replace(/\.$/,'');
  stats.rewritten++;stats.byKind[k]=(stats.byKind[k]||0)+1;return out}
/* (1) exported line function */
function wrapExport(){const D=globalThis.SCENE_DIRECTOR157;if(!D?.narration?.celeb||D.narration.celeb.__hf301)return!!D;const base=D.narration.celeb;
  const f=function(a,m){const l=base.apply(this,arguments);try{return guard(l,a,m)}catch{return l}};f.__hf301=1;f.__base=base;D.narration.celeb=f;return true}
/* (2) in-game path: director157 places the line, then calls remember('scene_celeb_reaction',{text}) and addNotif(...) */
let PENDING=null;
function fixPlaced(a,m,oldL,newL){const s=S();if(!s)return;
  if(m.postId){const p=(s.posts||[]).find(x=>x.id===m.postId);for(const c of p?.comments||[])if(c&&c.authorId===a.id&&c.text===oldL){c.text=newL;c.hf301ctx=1}}
  for(const p of (s.posts||[]).slice(0,8))if(p&&p.authorId===a.id&&p.text===oldL){p.text=newL;p.hf301ctx=1}
  try{const d=(s.dms||[]).find(x=>x.id===a.id);const last=d?.messages?.[d.messages.length-1];if(last&&last.from==='them'&&last.text===oldL){last.text=newL;last.hf301ctx=1}}catch{}}
function wrapRemember(){if(typeof remember!=='function'||remember.__hf301ctx)return;const base=remember;
  remember=function(type,data){try{if(!OFF()&&type==='scene_celeb_reaction'&&data&&data.text){const s=S();const m=(s?.memory||[]).find(x=>x&&x.id===data.sourceId)||{type:data.sourceType,id:data.sourceId};
      let a=null;try{a=byId(data.celebrityId)}catch{}const nl=guard(data.text,a,m);if(nl!==data.text){fixPlaced(a,m,data.text,nl);PENDING={o:String(data.text).slice(0,72),n:String(nl).slice(0,72),at:Date.now()};data={...data,text:nl,hf301ctx:1};arguments[1]=data}}}catch(e){}
    return base.apply(this,arguments)};remember.__hf301ctx=1}
function wrapNotif(){if(typeof addNotif!=='function'||addNotif.__hf301ctx)return;const base=addNotif;
  addNotif=function(text){try{if(PENDING&&Date.now()-PENDING.at<3000&&typeof text==='string'&&text.includes(PENDING.o)){arguments[0]=text.replace(PENDING.o,PENDING.n);PENDING=null}}catch{}return base.apply(this,arguments)};addNotif.__hf301ctx=1}
whenReady(()=>{wrapRemember();wrapNotif()},1400);if(!wrapExport())whenReady(()=>{if(!wrapExport()){const t=setInterval(()=>{if(wrapExport())clearInterval(t)},500);setTimeout(()=>clearInterval(t),20000)}},0);
window.SCENE_HF301_CONTEXT={v:301,classify,guard,stats:()=>JSON.parse(JSON.stringify(stats))};
})();
