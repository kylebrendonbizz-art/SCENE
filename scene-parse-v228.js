/* SCENE shared message parser v228 (2026-10-01).
   window.SCENE_PARSE(text, ctx?) -> { intents, slots, tone, refersToPlanId, detail }
   One client-side parser that every reply system reads from (Kim's fallback in runtime v200 first; non-Kim
   replies, chips and Writer templates next). Pure function: no state writes, no events, no network.
   The detectors in `kit` are the exact ones that used to live inline in Kim's clientFallback
   (runtime v200, 42ef72f), moved here unchanged so Kim's replies stay byte-identical.
   API reference: PARSE_API.md. */
(()=>{
'use strict';
if(globalThis.SCENE_PARSE)return;
const norm=raw=>String(raw??'').trim().toLowerCase().replace(/[’‘]/g,"'");

/* ---- registries ------------------------------------------------------------------------------------ */
/* Venue registry (moved from runtime v200 VENUES200; the only venue list in the game). */
const VENUES=Object.freeze([
  {re:/\b(?:the )?(?:hollywood|la|l\.a\.) bowl\b|\bthe bowl\b/,name:'the Hollywood Bowl',short:'the Bowl',city:'LA',night:true},
  {re:/\b(?:the )?greek(?: theatre| theater)?\b/,name:'the Greek',short:'the Greek',city:'LA',night:true},
  {re:/\bsofi(?: stadium)?\b/,name:'SoFi',short:'SoFi',city:'LA',night:true},
  {re:/\b(?:the )?(?:kia )?forum\b/,name:'the Forum',short:'the Forum',city:'LA',night:true},
  {re:/\b(?:crypto(?:\.com)? arena|staples(?: center)?)\b/,name:'Crypto.com Arena',short:'the arena',city:'LA',night:true},
  {re:/\b(?:msg|madison square garden|the garden)\b/,name:'Madison Square Garden',short:'the Garden',city:'New York',night:true},
  {re:/\bradio city\b/,name:'Radio City',short:'Radio City',city:'New York',night:true},
  {re:/\bdodger stadium\b/,name:'Dodger Stadium',short:'Dodger Stadium',city:'LA',night:true},
  {re:/\bcoachella\b/,name:'Coachella',short:'Coachella',city:'Indio',night:false},
  {re:/\b(?:the )?o2\b/,name:'the O2',short:'the O2',city:'London',night:true}
].map(v=>Object.freeze(v)));
/* City matcher (moved from runtime v200 PLACES200; the per-character lines stay with each character).
   Order matters: first registry hit wins, exactly as before. A generic hit is title-cased from the match. */
const CITIES=Object.freeze([
  {re:/\bparis\b/,name:'Paris'},
  {re:/\blondon\b/,name:'London'},
  {re:/\b(?:new york|nyc|manhattan)\b/,name:'New York'},
  {re:/\bmilan\b/,name:'Milan'},
  {re:/\bmiami\b/,name:'Miami'},
  {re:/\b(?:la|l\.a\.|los angeles|calabasas|malibu|beverly hills|west hollywood|weho)\b/,name:'LA'},
  {re:/\b(?:vegas|las vegas)\b/,name:'Vegas'},
  {re:/\b(?:tokyo|dubai|rome|mykonos|cabo|aspen|tulum|ibiza|st barths|london)\b/,name:''}
]);
const CITY_CANON={LA:'Los Angeles',Vegas:'Las Vegas'};
/* living-world v48's CITY48 (game cities) is used as an extra slot-only fallback (e.g. Cape Town). */
function gameCities(){try{return typeof CITY48!=='undefined'&&CITY48&&typeof CITY48==='object'?Object.keys(CITY48):[]}catch{return[]}}
/* Character registry: app.js `celebs` (ACCOUNTS type celeb), or ctx.characters for tests/tools. */
function registry(ctx){
  if(Array.isArray(ctx?.characters))return ctx.characters;
  try{return typeof celebs!=='undefined'&&Array.isArray(celebs)?celebs:[]}catch{return[]}
}
const PERFORMER_STOP=new Set(['will','grace','hope','faith','rich','king','queen','prince','young','future','more','page','star','mark','love','drake']);
const STOPW=new Set("i i'm im i'll ill i've ive me my we we're us our you you're your u ur a an the and or but so to of in on at for with is are was were be been being it it's its this that these those just really very so like lol omg haha get got go going gonna wanna want make made let's lets do did does have has had can could should would will what when where why how who which there here then than too also up out about all some any not no yes yeah ok okay hey hi hello oh well".split(' '));
const INTJ=new Set(['ugh','hmm','idk','tbh','lmao','wow','yay','omg','lol','haha','thing','things','stuff','something','anything','girl','babe','bro']);

/* ---- legacy detectors (verbatim from runtime v200) ------------------------------------------------- */
function city(t){
  for(const p of CITIES){const m=p.re.exec(t);if(!m)continue;if(p.name)return {name:p.name,generic:false,re:p.re};return {name:m[0].replace(/\b\w/g,c=>c.toUpperCase()),generic:true}}
  return null;
}
function acts(t){
  const out=[];for(const [k,re] of [['dinner',/\bdinner\b/],['lunch',/\blunch\b/],['brunch',/\bbrunch\b/],['drinks',/\b(?:drinks?|cocktails?|a glass of wine)\b/],['coffee',/\b(?:coffee|matcha)\b/],['party',/\b(?:party|afterparty|club)\b/],['shopping',/\bshopping\b/],['workout',/\b(?:workout|work out|gym|pilates)\b/],['movie',/\b(?:movie|film screening)\b/]])if(re.test(t))out.push(k);
  return out;
}
function when(t){const m=/\b(tonight|tomorrow|today|this weekend|next weekend|next week|this week|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/.exec(t);return m?m[1]:''}
function performer(raw,t,ctx){
  const self=ctx?.selfId;let list=[];try{list=registry(ctx).filter(a=>a&&a.id!==self&&a.name)}catch{}
  for(const a of list){const full=String(a.name).toLowerCase(),first=full.split(/\s+/)[0];
    if(full.length>4&&t.includes(full))return {id:a.id,name:a.name,short:a.name.split(/\s+/)[0]};
    if(first.length>=4&&!PERFORMER_STOP.has(first)&&new RegExp('\\b'+first.replace(/[^a-zé]/g,'')+'\\b','i').test(raw))return {id:a.id,name:a.name,short:a.name.split(/\s+/)[0]};}
  return null;
}
function event(raw,t,ctx){
  const venue=VENUES.find(v=>v.re.test(t))||null,perf=performer(raw,t,ctx);
  const kindM=/\b(concert|show|performing|perform|performs|tour|tickets?|gig|festival|premiere|afterparty|party|gala|screening)\b/.exec(t);
  const cue=/\b(?:we should|should we|let'?s|wanna|want to|go to|come (?:to|with)|you down|you in|tickets?|take you|bring you|join me|are you going|you coming)\b/.test(t);
  if(!(venue||(perf&&kindM)||kindM))return null;
  if(!cue&&!(venue&&/\?/.test(raw)))return null;
  const kind=kindM?kindM[1]:'show',isParty=/party/.test(kind),isPremiere=kind==='premiere',isGame=false;
  const what=perf&&venue?`${perf.short} at ${venue.short}`:perf?`${perf.short}’s show`:venue?venue.short.replace(/^the /,'The '):isParty?'A party':isPremiere?'The premiere':isGame?'The game':'The show';
  return {venue,performer:perf,kind,isParty,isPremiere,isGame,what,concert:Boolean(perf||venue)&&!isParty&&!isPremiere&&!isGame};
}
/* ≤3 content words, from the given line (callers pass the last line of a burst) */
function topic(text){
  const words=String(text||'').toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9' ]/g,' ').split(/\s+/).filter(Boolean);
  let best=[],cur=[];for(const w of words){if(STOPW.has(w)||INTJ.has(w)||w.length<3){if(cur.length>best.length)best=cur;cur=[]}else cur.push(w)}if(cur.length>best.length)best=cur;
  return best.slice(-3).join(' ');
}
const RX={
  hostile:/\b(?:you are|you're|ur)\b.{0,18}\b(?:annoying|fake|awful|terrible)|\bpiss off\b|\bfuck off\b/i,
  hbu:/\b(?:hbu|wbu|how about you|what about you|and you|you\?)\b/,
  hbu2:/\bhbu\b/,
  nightUp:/\b(?:night thing|at night|in the evening|evening thing|night instead|make it (?:a )?(?:night|late|evening)|after dark)\b/,
  logist:/\b(?:assistant|my team|my people|my manager|i'll (?:set it up|book|get (?:the )?tickets|handle it|sort it|arrange|plan it|organi[sz]e)|set it up|book it|get (?:us |the )?tickets|i got (?:us |the )?tickets|send a car|pick you up)\b/,
  viaAssistant:/\bassistant|team|people|manager\b/,
  inviteCue:/\b(?:wanna|want to|let'?s|we should|can we|could we|should we|down (?:for|to)|come with|join me|you free|are you free|hang|hang out|hangout|get together|grab|meet up|see you)\b/,
  lastAsked:/what did you have in mind|\bwhere\b/i,
  stillOn:/\b(?:still on|we still|are we still|still happening|still good for|our (?:lunch|dinner|plan|plans)|see you (?:there|then|thursday|next week))\b/,
  timeQ:/\b(?:what day|which day|what time|when works|day works|time works|when are you free|when should)\b/,
  timeQ2:/^when\b/,
  hang:/\b(?:hang|hang out|hangout|get together|see each other|meet up)\b/,
  bigEventTogether:/\b(?:wanna|want to|should we|can we|could we|let'?s)\b.{0,35}\b(?:go(?: together)?|attend|hit)\b.{0,60}\b(?:fashion week|nyfw|met gala|grammys?|oscars?|emmys?|premiere|festival|afterparty)\b/,
  howAreYou:/\b(?:how are you|how r u|how are u|you good|you okay|you alright|how have you been|how's it going|hows it going|how's your (?:day|week)|how is your (?:day|week)|how was your (?:day|week)|your week going)\b/,
  whatDoing:/\b(?:what are you (?:doing|up to)|wyd|what's your plan|whats your plan|plans (?:for|this)|doing this weekend|up to this weekend|what about you)\b/,
  work:/\b(?:audition|callback|call back|casting|screen test|chemistry read|self[- ]?tape|booked|pilot|role|gig|shoot|photoshoot|campaign meeting|job interview|new job|label meeting)\b/,
  yourCampaign:/\b(?:your|you)\b.{0,20}\bcampaign\b/,
  booked:/\b(?:booked|got (?:it|the part|the role|the job)|landed)\b/,
  howDidItGo:/\b(?:how did it go|it went|went well|went bad|didn't get it|did not get it)\b/,
  compliment:/\b(?:you look|you looked|looked (?:so )?(?:amazing|incredible|beautiful|gorgeous|stunning|good)|looks (?:so )?(?:amazing|incredible|beautiful|gorgeous|stunning)|you're so|ur so|so pretty|obsessed with (?:your|you)|love your|loved your|iconic|you're beautiful|you're gorgeous)\b/,
  favourite:/\bfavou?rite\b/,
  aboutYou:/\b(?:you|your|u|ur)\b/,
  thanks:/^(?:thank you|thanks|thx|ty)\b/,
  agree:/^(?:(?:ok(?:ay)?|yes|yeah|yep|sure|deal|perfect|sounds good|cool|great|love that|bet)[!. ]*)+$/,
  greeting:/^(?:hey+|hi+|hello+|yo|hiya|heyy+)\b/,
  laughter:/^(?:(?:ha|he){2,}|yay+|lol+|lmao+|😂+|😭+)[!?. x]*$/i,
  refersBack:/\b(?:us|we|it|that)\b/,
  project:/\bfor ((?:a |an |the )?[a-z0-9][a-z0-9 '’-]{2,40})/i,
  /* new (slot/intent layer only; Kim's legacy branches do not read these) */
  rude2:/\b(?:shut up|stfu|stupid|idiot|dumb|moron|hate you|ugly|bitch|fuck you|you suck|u suck|you're trash|ur trash|you're boring|ur boring|get lost|nobody asked|who asked)\b/,
  apology:/\b(?:sorry|so sorry|my bad|apologi[sz]e|forgive me)\b/,
  goodbye:/\b(?:bye+|byee+|goodnight|good night|gn|ttyl|talk (?:to you )?(?:later|soon|tomorrow)|gotta go|got to go|see ya|cya|night night|see you (?:soon|later))\b/,
  greeting2:/^(?:good (?:morning|afternoon|evening)|what'?s up|whats up|sup|wassup|howdy|heyo)\b/,
  question3:/\b(?:do|did|have|are|would|will|can|could) you\b/,
  question2:/^(?:what|when|where|why|how|who|which|do you|did you|are you|can you|could you|would you|will you|is it|is there|have you|wanna|want to)\b/,
  memory:/\b(?:do you remember|you remember|remember when|remember (?:that|the|me|our|last)|did you forget|you forgot)\b/,
  news:/\b(?:guess what|big news|good news|i have news|i booked|i landed|i signed|i won|i got (?:the|a|my) (?:part|role|job|deal|callback|audition|record deal)|i'm (?:launching|dropping|releasing|moving)|just dropped|i got signed)\b/,
  collab:/\b(?:collab|collabs|collaborate|collaboration|work together|working together|make (?:a |some )?(?:song|track|record|video|content|something) together|do (?:a )?(?:song|track|duet|video|campaign) together|duet|joint (?:post|campaign|drop|video)|partner on|partnership)\b/,
  planChange:/\b(?:instead|reschedul\w*|push it|move it to|can'?t make it|cancel|rain ?check|change of plans?|different day|another day|earlier instead|later instead)\b/,
  ask:/\b(?:can you|could you|would you|will you|any chance|is there any way|do me a favou?r|i need a favou?r|favou?r to ask|please|pls|plz)\b/,
  flirt:/\b(?:you're (?:hot|cute|sexy|fine)|ur (?:hot|cute|sexy)|miss you|thinking (?:about|of) you|date me|go on a date|on a date|kiss me|crush on you|marry me|be mine)\b|😘|😍|😏|🥰|😉|💋/u,
  tease:/\b(?:jk|just kidding|you wish|as if|nice try|sure you (?:are|do|did|will)|you're such a|ur such a|calm down|ok grandma|ok boomer)\b|😜|🙄|😛|🤭/u,
  excited:/\b(?:omg|yay+|can'?t wait|so excited|let'?s go+|yess+|ahh+|wooo*|finally)\b|🥳|🎉|🔥|🤩|😍/u
};
const FAVOURS=[
  ['share_song',/\b(?:listen to|share|post|play|hear|check out|repost)\b.{0,25}\b(?:my|our|the)\s+(?:new\s+)?(?:song|track|single|demo|record|ep|album|mix|music)\b/],
  ['shoutout',/\b(?:shout ?out|shout me out|repost me|tag me|plug me|mention me|post about me)\b/],
  ['tickets',/\b(?:get|grab|find|spare|have|got)\s+(?:me|us)\s+(?:some\s+|a\s+|two\s+|2\s+)?(?:tickets?|passes|seats|in)\b|\b(?:guest ?list|plus one|\+1|backstage pass)\b/],
  ['feature',/\b(?:feature on|feat\.?|be on my (?:song|track|record)|jump on (?:my|a|the) (?:song|track|verse)|hop on (?:my|a|the) (?:song|track)|do a verse)\b/],
  ['intro',/\b(?:introduce me|intro me|an intro to|introduction to|put me in touch|connect me with|link me (?:with|up)|hook me up with)\b/]
];
const PICTO=/\p{Extended_Pictographic}\uFE0F?/gu;
const MEALS=[['breakfast',/\bbreakfast\b/],['brunch',/\bbrunch\b/],['lunch',/\blunch\b/],['dinner',/\bdinner\b/],['drinks',/\b(?:drinks?|cocktails?|a glass of wine)\b/],['coffee',/\b(?:coffee|matcha)\b/]];
const FAVOUR_TEXT={share_song:'sharing my song',shoutout:'a shoutout',tickets:'tickets',feature:'a feature',intro:'an intro',other:'a favour'};
/* slot objects print as their template text, so String(slot) / `${slot}` works for chips that expect strings */
const asText=(o,fn)=>{if(o&&typeof o==='object')Object.defineProperty(o,'toString',{value:fn,enumerable:false});return o};
const WEEKDAYS=['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

function persons(raw,t,ctx){
  const self=ctx?.selfId,out=[];let list=[];try{list=registry(ctx).filter(a=>a&&a.id!==self&&a.name)}catch{}
  for(const a of list){const full=String(a.name).toLowerCase(),first=full.split(/\s+/)[0];let at=-1;
    if(full.length>4&&t.includes(full))at=t.indexOf(full);
    else if(first.length>=4&&!PERFORMER_STOP.has(first)){const m=new RegExp('\\b'+first.replace(/[^a-zé]/g,'')+'\\b','i').exec(raw);if(m)at=m.index}
    /* slot-only extra: short first names / ids such as "Kim" (the performer rule above needs >=4 letters) */
    if(at<0){const id=String(a.id||'').toLowerCase();if(/^[a-z]{3,}$/.test(id)&&!PERFORMER_STOP.has(id)&&(id===first||first.startsWith(id))){const m=new RegExp('\\b'+id+'\\b','i').exec(raw);if(m)at=m.index}}
    if(at>=0)out.push({name:a.name,at});}
  return out.sort((a,b)=>a.at-b.at).map(x=>x.name).filter((x,i,arr)=>arr.indexOf(x)===i);
}
const PAST_WHEN=/\b(yesterday|last night|last week|next month|this morning|this afternoon|this evening|tomorrow night|later today)\b/;
function timeSlot(t,ctx,nightUp){
  const lw=when(t),pm=PAST_WHEN.exec(t),text=pm&&(!lw||pm.index<=t.indexOf(lw))?pm[1]:lw;
  let tod=null;
  if(/\btonight\b/.test(t)||nightUp||/\b(?:night|late night|after dark)\b/.test(t.replace(/\bgood ?night\b|\bnight night\b/g,'')))tod='night';
  else if(/\bevening\b/.test(t))tod='evening';
  else if(/\bafternoon\b/.test(t))tod='afternoon';
  else if(/\bmorning\b|\bearly\b(?! call)/.test(t))tod='morning';
  let off=null;
  if(['today','tonight','this morning','this afternoon','this evening','later today'].includes(text))off=0;else if(text==='tomorrow'||text==='tomorrow night')off=1;else if(text==='next week')off=7;
  else if(text==='yesterday'||text==='last night')off=-1;else if(text==='last week')off=-7;
  else{const wd=WEEKDAYS.indexOf(text),today=Number.isInteger(ctx?.weekday)?ctx.weekday:null;if(wd>=0&&today!==null&&today>=0&&today<=6)off=(wd-today+7)%7}
  if(!text&&!tod)return null;
  const todText=tod?(/night thing|evening thing|at night|in the evening|after dark|tonight|morning|afternoon|evening|night/.exec(t)||[tod])[0]:'';
  return {text:text||todText,dayOffset:off,timeOfDay:tod};
}
function lastMeal(t){let best=null,at=-1;for(const [k,re] of MEALS){const g=new RegExp(re.source,'g');let m;while((m=g.exec(t)))if(m.index>at){at=m.index;best=k}}return best}

/* ---- main ------------------------------------------------------------------------------------------ */
function SCENE_PARSE(text,ctx){
  ctx=ctx&&typeof ctx==='object'?ctx:{};
  const raw=String(text??'').trim(),t=norm(raw);
  const lines=raw.split(/\n+/).map(x=>x.trim()).filter(Boolean),last=lines[lines.length-1]||raw;
  const plans=Array.isArray(ctx.plans)?ctx.plans:[];
  const plan=[...plans].reverse().find(p=>p&&p.status!=='cancelled')||null;
  const lastReply=String(ctx.lastReply||'');
  const question=/\?/.test(raw);
  /* legacy detail (Kim's exact flags) */
  const live0=Boolean(plan&&plan.kind==='event'&&!['declined','cancelled'].includes(plan.status));
  let ev=event(raw,t,ctx),evToPlan=false;if(ev&&live0&&!ev.venue&&!ev.performer){ev=null;evToPlan=true}
  const a=acts(t),c=ev?null:city(t),w=when(t);
  const nightUp=RX.nightUp.test(t),logist=RX.logist.test(t);
  const stillOn=RX.stillOn.test(t),timeQ=RX.timeQ.test(t)||RX.timeQ2.test(t);
  const inviteCue=RX.inviteCue.test(t)||(question&&a.length>0)||RX.lastAsked.test(lastReply)||Boolean(plan&&plan.status==='pending');
  const hang=RX.hang.test(t)&&inviteCue;
  const hostile=RX.hostile.test(t);
  const workM=RX.work.exec(t);
  const detail={
    norm:t,lines,last,question,hostile,
    hbu:RX.hbu.test(t)||RX.hbu2.test(t),
    event:ev,eventFoldedIntoPlan:evToPlan,city:c,acts:a,when:w,
    nightUp,logist,viaAssistant:RX.viaAssistant.test(t),
    inviteCue,stillOn,timeQ,hang,
    bigEventTogether:RX.bigEventTogether.test(t),
    howAreYou:RX.howAreYou.test(t),whatDoing:RX.whatDoing.test(t),weekend:/weekend/.test(t),
    work:workM?workM[0]:'',yourCampaign:RX.yourCampaign.test(t),booked:RX.booked.test(t),howDidItGo:RX.howDidItGo.test(t),
    project:RX.project.exec(last)?.[1]?.replace(/\s+(?:tomorrow|today|tonight|next week)$/i,'').trim()||'',
    compliment:RX.compliment.test(t),favourite:RX.favourite.test(t),aboutYou:RX.aboutYou.test(t),
    thanks:RX.thanks.test(t),agree:RX.agree.test(t),greeting:RX.greeting.test(t),laughter:RX.laughter.test(t),
    refersBack:RX.refersBack.test(t),
    topic:topic(last)
  };
  /* slots */
  const venue=ev?.venue||null;
  let place=null;
  if(venue)place={name:venue.name,short:venue.short,city:CITY_CANON[venue.city]||venue.city};
  else{const ci=c||city(t);
    if(ci)place={name:ci.name,short:ci.name,city:CITY_CANON[ci.name]||ci.name};
    else for(const k of gameCities()){if(new RegExp('\\b'+k.toLowerCase().replace(/[^a-z ]/g,'')+'\\b').test(t)){place={name:k,short:k,city:k};break}}}
  const meal=lastMeal(t);
  const newsy=Boolean(workM&&!detail.yourCampaign)||RX.news.test(t);
  const evAct=ev?(ev.isParty?'party':ev.isPremiere?'premiere':ev.isGame?'game':'show'):null;
  const otherAct=newsy?null:a.find(x=>!['dinner','lunch','brunch','drinks','coffee'].includes(x))||null;
  const activity=evAct||(meal?'meal':null)||otherAct||(hang||/\b(?:hang|hang out|hangout|chill together|link up)\b/.test(t)?'hang':null);
  let favour=null;for(const [type,re] of FAVOURS)if(re.test(t)){favour={type};break}
  const asking=RX.ask.test(t)||question;
  if(favour&&favour.type!=='tickets'&&!asking&&!/\b(?:me|my)\b/.test(t))favour=null;
  if(favour&&favour.type==='tickets'&&/\bi(?:'ll| will| got| can)\b.{0,12}\btickets?\b/.test(t)&&!/\b(?:get|grab|find|spare)\s+(?:me|us)\b/.test(t))favour=null;
  if(!favour&&RX.ask.test(t)&&/\b(?:for me|favou?r)\b/.test(t))favour={type:'other'};
  const slots={
    person:persons(raw,t,ctx),
    place,
    time:timeSlot(t,ctx,nightUp),
    activity,
    meal,
    event:ev?{what:ev.what,venue:venue?{name:venue.name,short:venue.short,city:CITY_CANON[venue.city]||venue.city}:null,performer:ev.performer?{...ev.performer}:null,kind:ev.kind}:null,
    favour,
    quote:detail.topic
  };
  /* tone */
  const emoji=[...new Set(raw.match(PICTO)||[])];
  const rude=hostile||RX.rude2.test(t);
  const tone={rude,excited:/!/.test(raw)||RX.excited.test(t)||RX.excited.test(raw),emoji};
  /* intents (ordered by priority; primary first) */
  const I=new Set();
  if(rude)I.add('rude');
  if(RX.apology.test(t))I.add('apology');
  const memory=RX.memory.test(t),textInvite=RX.inviteCue.test(t)||/\b(?:we|us|together|with me)\b/.test(t);
  let invite=Boolean(ev||((a.length||c)&&inviteCue&&!stillOn)||hang||detail.bigEventTogether);
  if(invite&&memory&&!RX.inviteCue.test(t))invite=false;            /* "do you remember the party?" is not an invite */
  if(invite&&favour&&!textInvite)invite=false;                      /* "can you get me tickets?" is a favour, not an invite */
  if(invite)I.add('invite');
  if(RX.planChange.test(t)||(nightUp&&!ev))I.add('plan_change');
  if((logist&&!ev)||stillOn||(timeQ&&plan)||evToPlan||(plan&&plan.status==='pending'&&(c||place)&&!ev))I.add('plan_followup');
  if(favour)I.add('favour_ask');
  if(RX.collab.test(t))I.add('collab_pitch');
  if((workM&&!detail.yourCampaign&&!/\b(?:your|you)\b.{0,12}\b(?:audition|role|shoot|gig|pilot)\b/.test(t))||RX.news.test(t))I.add('news_share');
  if(memory)I.add('memory_check');
  if(detail.howAreYou)I.add('how_are_you');
  if(detail.hbu)I.add('hbu');
  if(question||RX.question2.test(t)||RX.question3.test(t))I.add('question');
  if(detail.compliment)I.add('compliment');
  if(RX.flirt.test(t)||RX.flirt.test(raw))I.add('flirt');
  if(RX.tease.test(t)||RX.tease.test(raw))I.add('tease');
  if(detail.greeting||RX.greeting2.test(t))I.add('greeting');
  if(RX.goodbye.test(t))I.add('goodbye');
  if(!I.size)I.add('other');
  const intents=[...I];
  asText(slots.place,function(){return this.short||this.name||''});
  asText(slots.time,function(){return this.text||''});
  asText(slots.event,function(){return this.what||''});
  asText(slots.favour,function(){return FAVOUR_TEXT[this.type]||''});
  /* a bare "the show"/"tickets" match that turned out not to be an invite is not an event slot */
  if(!invite&&ev&&!ev.venue&&!ev.performer){slots.event=null;if(slots.activity===evAct)slots.activity=(meal?'meal':null)||otherAct||null}
  const follow=I.has('plan_followup')||I.has('plan_change')||(plan&&detail.refersBack&&!ev&&intents.every(x=>['other','question','tease','compliment'].includes(x)));
  const refersToPlanId=plan&&follow&&!['declined','cancelled'].includes(plan.status)?(plan.id||null):null;
  /* flat template strings for Writer/UI: {person} {place} {time} {activity} {meal} {event} {favour} {quote} ('' = unknown) */
  const fill={person:(slots.person[0]||'').split(/\s+/)[0],place:slots.place?String(slots.place):'',time:slots.time?String(slots.time):'',activity:slots.activity||'',meal:slots.meal||'',event:slots.event?String(slots.event):'',favour:slots.favour?String(slots.favour):'',quote:slots.quote||''};
  return {intents,slots,tone,refersToPlanId,fill,detail};
}
SCENE_PARSE.version=228;
SCENE_PARSE.intents=Object.freeze(['greeting','how_are_you','hbu','invite','plan_followup','plan_change','question','favour_ask','compliment','tease','flirt','rude','apology','news_share','memory_check','collab_pitch','goodbye','other']);
SCENE_PARSE.venues=VENUES;
SCENE_PARSE.favourText=Object.freeze({...FAVOUR_TEXT});
/* chip/Writer bank keys that are not parser intents: which parser intents feed them */
SCENE_PARSE.chipKeys=Object.freeze({ask_about_them:Object.freeze(['how_are_you','hbu','question']),work:Object.freeze(['question','news_share'])});
SCENE_PARSE.kit=Object.freeze({norm,city,acts,when,event,performer,topic});
globalThis.SCENE_PARSE=SCENE_PARSE;
})();
