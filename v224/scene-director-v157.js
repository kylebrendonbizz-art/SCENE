/* SCENE v157 — persistent progression + causal celebrity world director. */
(()=>{
'use strict';
if(globalThis.SCENE_DIRECTOR157)return;
const VERSION157=157, DKEY='sceneDirector157';
const now157=()=>Date.now();
const clamp157=(n,min,max)=>Math.max(min,Math.min(max,n));
const esc157=v=>typeof esc==='function'?esc(String(v??'')):String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const uniq157=(arr=[])=>[...new Set(arr.filter(Boolean))];

function levelInfo157(xp=Number(state.player?.xp)||0){
  let level=1,start=0,need=10;
  while(level<60&&xp>=start+need){start+=need;level++;need=10+(level-1)*5}
  return {level,start,need,into:Math.max(0,xp-start),percent:clamp157(Math.round(((xp-start)/need)*100),0,100)};
}
function slots157(level=levelInfo157().level){
  return Math.min(9,1+(level>=2?1:0)+(level>=3?1:0)+(level>=4?1:0)+(level>=6?1:0)+(level>=8?1:0)+(level>=10?1:0)+(level>=13?1:0)+(level>=17?1:0));
}
const skillLabels157={
  Music:['Stage Presence','Public Narrative','Industry Instinct'],
  Acting:['Screen Presence','Press Control','Industry Instinct'],
  Fashion:['Camera Presence','Brand Diplomacy','Runway Nerve'],
  Creator:['Audience Instinct','Brand Diplomacy','Drama Immunity']
};
const goals157={
  Music:'Turn a first connection into a career people can hear coming.',
  Acting:'Turn small rooms into a name casting teams remember.',
  Fashion:'Build a look, a network and a reputation the room cannot ignore.',
  Creator:'Turn attention into influence without losing the voice that got you noticed.'
};
const milestoneBank157=[
  {title:'Make the timeline ask who you are', followers:200, beats:1, reward:{xp:8,followers:35}, skillPoints:1},
  {title:'Turn curiosity into momentum', followers:750, beats:3, active:2, reward:{xp:12,followers:80,fame:1}, skillPoints:1},
  {title:'Survive your first discourse cycle', followers:2500, beats:6, skills:2, reward:{xp:16,followers:180,fame:1,rep:1}, skillPoints:1},
  {title:'Book a moment people cannot ignore', followers:5000, fame:12, gigs:2, reward:{xp:20,followers:350,fame:2}, skillPoints:1},
  {title:'Control the public narrative', followers:10000, rep:55, events:3, skills:5, reward:{xp:26,followers:700,fame:2,rep:2}, skillPoints:1},
  {title:'Become a name the industry recognises', followers:25000, fame:30, active:3, reward:{xp:32,followers:1400,fame:3}, skillPoints:2},
  {title:'Break out of your lane', followers:100000, fame:55, active:4, reward:{xp:42,followers:4000,fame:4,rep:2}, skillPoints:2},
  {title:'Own the conversation', followers:250000, fame:80, skills:10, reward:{xp:55,followers:9000,fame:5}, skillPoints:2},
  {title:'Become unavoidable', followers:1000000, fame:120, active:6, reward:{xp:75,followers:25000,fame:7,rep:3}, skillPoints:3}
];

const fanSeeds157=[
 ['scene-fan-mia','Mia Navarro','@midnightmia',4280,'Los Angeles'],
 ['scene-fan-eli','Eli Brooks','@elionmain',1710,'New York'],
 ['scene-fan-zuri','Zuri Miles','@zuritalks',8900,'Atlanta'],
 ['scene-fan-noa','Noa Kim','@noakim',2380,'Los Angeles'],
 ['scene-fan-ava','Ava Laurent','@avadoespop',12600,'Paris'],
 ['scene-fan-luca','Luca Bennett','@lucabennett',6200,'London'],
 ['scene-fan-jules','Jules Rivera','@julesonline',33400,'Miami'],
 ['scene-fan-sam','Sam Okafor','@samonfilm',5800,'London'],
 ['scene-fan-nina','Nina Patel','@ninawatches',19700,'Toronto'],
 ['scene-fan-leo','Leo Martins','@leosays',4100,'São Paulo'],
 ['scene-fan-ivy','Ivy Chen','@ivyinternet',24600,'Los Angeles'],
 ['scene-fan-cam','Cam Ellis','@cameronell',9600,'Chicago'],
 ['scene-fan-ren','Ren Flores','@renfiles',7300,'Mexico City'],
 ['scene-fan-theo','Theo Jameson','@theowatches',2900,'Manchester'],
 ['scene-fan-amara','Amara Cole','@amaracole',52000,'New York'],
 ['scene-fan-sasha','Sasha Reed','@sashafeed',15400,'Los Angeles'],
 ['scene-fan-dani','Dani Cruz','@danicruz',11200,'Austin'],
 ['scene-fan-kai','Kai Morgan','@kaimorgan',6800,'Cape Town'],
 ['scene-fan-lena','Lena Ortiz','@lenaonline',21800,'Los Angeles'],
 ['scene-fan-max','Max Hollow','@maxscrolls',3700,'New York'],
 ['scene-fan-aria','Aria Stone','@ariastone',8500,'London'],
 ['scene-fan-jo','Jo Park','@jopark',14300,'Seoul'],
 ['scene-fan-reece','Reece Taylor','@reecetalks',4600,'Sydney'],
 ['scene-fan-mika','Mika Rowe','@mikaisonline',31600,'Los Angeles']
];
const microSeeds157=[
 ['scene-media-popcurrent','Pop Current','popcurrent','Emerging pop culture account',186000],
 ['scene-media-scenewire','Scene Wire','scenewire','Entertainment discovery desk',94000],
 ['scene-media-viralroom','Viral Room','viralroom','Internet culture account',322000],
 ['scene-media-backstage','Backstage Signal','backstagesignal','Emerging entertainment & industry watch',71000],
 ['scene-media-cultureloop','Culture Loop','cultureloop','Culture and creator news',147000],
 ['scene-media-spotlight','The Spotlight','thespotlight','Rising talent and entertainment account',83000]
];
const FAN_VOICE157={
 'scene-fan-mia':['stan','lowercase, excitable pop-culture stan; short bursts, dramatic when genuinely excited, hates corporate wording'],
 'scene-fan-eli':['skeptic','dry New York skeptic; asks for receipts, rarely impressed, short blunt sentences'],
 'scene-fan-zuri':['chaotic','high-energy internet native; caps only for real shock, funny and impulsive'],
 'scene-fan-noa':['casual','casual observer; understated, sometimes barely cares, sounds like a normal person scrolling'],
 'scene-fan-ava':['culture','fashion/pop culture watcher; notices image, styling, framing and public narrative'],
 'scene-fan-luca':['dry','deadpan British internet voice; concise, ironic, almost never gushes'],
 'scene-fan-jules':['stan','enthusiastic fan account; emotionally invested but not blindly positive'],
 'scene-fan-sam':['industry','film/TV watcher; notices casting, rooms, credits and whether a career move actually matters'],
 'scene-fan-nina':['detective','timeline detective; remembers earlier posts and notices inconsistencies without inventing facts'],
 'scene-fan-leo':['casual','warm casual observer; reacts naturally and does not turn everything into lore'],
 'scene-fan-ivy':['culture','internet-culture analyst; notices how narratives form and who is framing them'],
 'scene-fan-cam':['skeptic','lightly cynical Chicago commenter; funny, skeptical of hype, willing to change their mind'],
 'scene-fan-ren':['detective','detail-oriented pop-culture tracker; asks specific questions instead of generic context begging'],
 'scene-fan-theo':['dry','understated dry humor; lowercase, minimal punctuation, one-liners'],
 'scene-fan-amara':['industry','media-savvy industry watcher; focuses on repeat bookings, teams, positioning and access'],
 'scene-fan-sasha':['stan','LA stan with a sharp tongue; playful, quick, occasionally protective'],
 'scene-fan-dani':['chaotic','messy-funny internet friend energy; reacts first, thinks second, but still references the actual beat'],
 'scene-fan-kai':['casual','Cape Town casual follower; relaxed, observant, not impressed by fame for its own sake'],
 'scene-fan-lena':['culture','LA culture watcher; reads visual choices, rollout clues and audience shifts'],
 'scene-fan-max':['skeptic','New York skeptic; hates overclaiming and calls out weak headlines'],
 'scene-fan-aria':['stan','British pop fan; witty, enthusiastic and specific'],
 'scene-fan-jo':['culture','Seoul culture/fashion observer; concise, aesthetic and detail-focused'],
 'scene-fan-reece':['casual','Australian casual account; friendly, clipped, low-drama'],
 'scene-fan-mika':['detective','online investigator energy; remembers prior public details, never invents private facts']
};
const MEDIA_VOICE157={
 'scene-media-popcurrent':'fast pop-news account: concise, factual, one sharp detail, no purple prose; sounds like a real breaking update',
 'scene-media-scenewire':'small entertainment trade desk: career-first, names the room/job/connection and why it matters professionally; restrained tone',
 'scene-media-viralroom':'internet culture account: frames what is actually spreading, memes/replies/search behavior; punchy but not brainless hype',
 'scene-media-backstage':'industry whisper account: notices auditions, teams, callbacks, repeat invitations and behind-the-scenes career signals; never pretends gossip is confirmed',
 'scene-media-cultureloop':'culture analysis page: explains why a specific post or interaction is catching on and what narrative people are building around it',
 'scene-media-spotlight':'rising-talent page: human-interest tone, introduces emerging people through one concrete recent achievement rather than generic hype',
 popbase:'ultra-concise pop culture update: factual wording, one event per post, minimal opinion, no filler',
 tmz:'gossip/tabloid framing: conversational, curious, slightly provocative, focused on visible behavior and public clues without inventing facts',
 enews:'chatty entertainment-news voice: accessible, playful, asks the obvious pop-culture question but still cites the actual event',
 people:'human-interest entertainment voice: centers the person, relationship or milestone and adds context without sounding like a trade memo',
 variety:'entertainment trade publication: industry language, credits/booking/context, restrained and specific; never stan language',
 billboard:'music-business publication: songs, performances, charts, collaborators and career movement; precise and music-specific',
 vogue:'fashion editorial voice: clothes, image, campaign, styling and cultural positioning; elegant but concrete',
 rollingstone:'music/culture voice: sharper analysis and cultural framing, a little opinionated, never generic PR copy',
 bbcnews:'formal neutral news voice: plain factual sentences and only broad public-interest developments',
 skynews:'formal breaking-news voice: direct, factual, no stan language or gossip flourish'
};
function addPopulation157(){
  for(const [id,name,handleRaw,reach,city] of fanSeeds157){
    if(byId(id))continue;
    const handle=handleRaw.replace(/^@/,'');
    const [archetype,voice]=FAN_VOICE157[id]||['casual','normal casual social-media user'];
    const a={id,name,handle,role:`Fan · ${archetype}`,reach,type:'fan',wiki:'',photo:`https://i.pravatar.cc/160?u=${encodeURIComponent(id)}`,bio:`${name} · ${city} · ${voice}.`,page:'',sceneFan157:true,sceneArchetype157:archetype,sceneVoice157:voice,city};
    ACCOUNTS.push(a);
    if(Array.isArray(NORMAL_NPCS)&&!NORMAL_NPCS.some(x=>x.handle===handle))NORMAL_NPCS.push({id,name,handle,followers:reach,following:250+reach%900,city,bio:a.bio,avatar:a.photo,personality:archetype,job:archetype==='industry'?'media assistant':'',interests:['pop culture','entertainment'],cadence:/lowercase|minimal|understated/.test(voice)?'lowercase':'short'});
  }
  for(const [id,name,handle,role,reach] of microSeeds157){
    if(byId(id))continue;
    const voice=MEDIA_VOICE157[id]||'small entertainment account with a specific editorial point of view';
    const a={id,name,handle,role,reach,type:'media',wiki:'',photo:'',bio:`${role}. ${voice}`,page:'',sceneMicro157:true,sceneMediaVoice157:voice};
    ACCOUNTS.push(a);media.push(a);
    PERSONA[id]={posts:[],dm:[]};
  }
}
addPopulation157();

function countMemory157(type){return (state.memory||[]).filter(m=>m.type===type).length}
function totalSkills157(d){return Object.values(d.skills||{}).reduce((a,b)=>a+(Number(b)||0),0)}
function suggestedMilestoneIndex157(){
  const p=state.player||{},f=Number(p.followers)||0,fame=Number(p.fame)||0;
  if(f>=250000||fame>=80)return 7;
  if(f>=100000||fame>=55)return 6;
  if(f>=25000||fame>=30)return 5;
  if(f>=10000)return 4;
  if(f>=5000||fame>=12)return 3;
  if(f>=2500)return 2;
  if(f>=750)return 1;
  return 0;
}
function ensure157(){
  if(!state.player)return null;
  let d=state[DKEY];
  if(!d||d.version!==VERSION157){
    const li=levelInfo157();
    const friend=state.firstSession148?.friendId||'';
    const relational=Object.entries(state.relations||{}).filter(([id,r])=>byId(id)?.type==='celeb'&&(r?.unlocked||r?.friendship>0)).sort((a,b)=>(b[1]?.friendship||0)-(a[1]?.friendship||0)).map(x=>x[0]);
    const active=uniq157([friend,...relational]).slice(0,slots157(li.level));
    d=state[DKEY]={
      version:VERSION157,installedAt:now157(),lastLevel:li.level,skills:{a:0,b:0,c:0},
      activeCelebs:active,worldBeats:0,reactedIds:[],milestoneIndex:suggestedMilestoneIndex157(),
      completedMilestones:[],pendingLevel:null,pendingMilestone:null,newPostCount:0,lastReactionAt:0
    };
    const earned=Math.max(0,li.level-1);
    state.player.skillPoints=Math.max(Number(state.player.skillPoints)||0,earned);
    save();
  }
  d.skills=d.skills||{a:0,b:0,c:0};
  d.activeCelebs=Array.isArray(d.activeCelebs)?d.activeCelebs:[];
  d.reactedIds=Array.isArray(d.reactedIds)?d.reactedIds:[];
  d.completedMilestones=Array.isArray(d.completedMilestones)?d.completedMilestones:[];
  d.newPostIds=Array.isArray(d.newPostIds)?d.newPostIds.filter(id=>(state.posts||[]).some(p=>p.id===id)):[];
  d.newPostCount=d.newPostIds.length;
  if(state.firstSession148?.friendId&&!d.activeCelebs.includes(state.firstSession148.friendId))d.activeCelebs.unshift(state.firstSession148.friendId);
  d.activeCelebs=uniq157(d.activeCelebs).filter(id=>byId(id)?.type==='celeb').slice(0,slots157());
  return d;
}
function activeCelebs157(){
  const d=ensure157();return (d?.activeCelebs||[]).map(byId).filter(Boolean);
}
function starterId157(){return state.firstSession148?.friendId||''}
function isOpening157(){return Boolean(state.firstSession148&&!state.firstSession148.completed&&!state.firstSession148.existingCareer)}

const baseLvl157=lvl,baseXpInto157=xpInto;
lvl=function(){return levelInfo157().level};
xpInto=function(){return levelInfo157().percent};

function skillRows157(d){
  const labels=skillLabels157[state.player?.career]||skillLabels157.Creator;
  return labels.map((label,i)=>{
    const key=['a','b','c'][i],val=Number(d.skills[key])||0;
    return `<div class="scene-skill157"><div><span>${esc157(label)}</span><b>${val}</b></div><div class="scene-skillbar157"><i style="width:${Math.min(100,val*10)}%"></i></div><button data-scene-skill157="${key}" ${state.player.skillPoints>0?'':'disabled'}>＋</button></div>`;
  }).join('');
}
function milestoneProgress157(m,d){
  const p=state.player||{}, checks=[];
  if(m.followers)checks.push({ok:p.followers>=m.followers,label:`${fmt(p.followers)} / ${fmt(m.followers)} followers`});
  if(m.fame)checks.push({ok:p.fame>=m.fame,label:`${p.fame} / ${m.fame} fame`});
  if(m.rep)checks.push({ok:p.reputation>=m.rep,label:`${p.reputation} / ${m.rep} reputation`});
  if(m.beats)checks.push({ok:d.worldBeats>=m.beats,label:`${d.worldBeats} / ${m.beats} world ripples`});
  if(m.active)checks.push({ok:activeCelebs157().length>=m.active,label:`${activeCelebs157().length} / ${m.active} active celebrity connections`});
  if(m.skills)checks.push({ok:totalSkills157(d)>=m.skills,label:`${totalSkills157(d)} / ${m.skills} skill points invested`});
  if(m.gigs){const n=countMemory157('gig');checks.push({ok:n>=m.gigs,label:`${n} / ${m.gigs} career jobs completed`})}
  if(m.events){const n=countMemory157('event');checks.push({ok:n>=m.events,label:`${n} / ${m.events} public situations handled`})}
  return checks;
}
function directorCareer157(baseHtml){
  const d=ensure157();if(!d)return baseHtml;
  const li=levelInfo157(),m=milestoneBank157[Math.min(d.milestoneIndex,milestoneBank157.length-1)],checks=milestoneProgress157(m,d),done=checks.filter(x=>x.ok).length,percent=checks.length?Math.round(done/checks.length*100):0,active=activeCelebs157(),slots=slots157(li.level);
  const panel=`<div class="scene-career157">
    <div class="scene-levelcard157">
      <div class="scene-leveltop157"><span>LEVEL ${li.level}</span><b>${li.into}/${li.need} XP</b></div>
      <div class="scene-leveltrack157"><i style="width:${li.percent}%"></i></div>
      <small>${slots} celebrity ${slots===1?'slot':'slots'} · ${Math.max(0,state.player.skillPoints||0)} skill ${Number(state.player.skillPoints||0)===1?'point':'points'} ready</small>
    </div>
    <div class="scene-goal157"><small>MAIN GOAL · ${esc157(state.player.career)}</small><strong>${esc157(goals157[state.player.career]||goals157.Creator)}</strong><span>Every public move can change your audience, relationships, reputation and who notices you.</span></div>
    <div class="heading">Next milestone</div>
    <div class="scene-milestone157"><div class="scene-milehead157"><span>${String(d.milestoneIndex+1).padStart(2,'0')}</span><div><small>${percent}% COMPLETE</small><strong>${esc157(m.title)}</strong></div></div><div class="scene-miletrack157"><i style="width:${percent}%"></i></div><div class="scene-reqs157">${checks.map(x=>`<div class="${x.ok?'done':''}"><i>${x.ok?'✓':'○'}</i><span>${esc157(x.label)}</span></div>`).join('')}</div><small class="scene-milereward157">Reward · ${m.reward.xp||0} XP${m.skillPoints?` · +${m.skillPoints} skill point${m.skillPoints===1?'':'s'}`:''}${m.reward.fame?` · +${m.reward.fame} fame`:''}</small></div>
    <div class="heading scene-heading157">Skills</div>
    <div class="scene-skillgrid157">${skillRows157(d)}</div>
    <div class="heading scene-heading157">Your celebrity world</div>
    <div class="scene-worldcast157"><div class="scene-caststack157">${active.map(a=>av(a,'microav')).join('')||'<span class="scene-emptycast157">＋</span>'}</div><div><strong>${active.length}/${slots} active</strong><span>${slots-active.length>0?`${slots-active.length} open ${slots-active.length===1?'slot':'slots'} · level up for more`:'Level up to unlock another slot'}</span></div><button data-action="scene-add-character157">＋ Add</button></div>
  </div>`;
  const start=baseHtml.indexOf('<div class="milestone card">'), end=baseHtml.indexOf('<div class="heading">Resources</div>');
  if(start>=0&&end>start)return baseHtml.slice(0,start)+panel+baseHtml.slice(end);
  if(baseHtml.includes('class="section career48"')){const close=baseHtml.lastIndexOf('</section>');if(close>=0)return baseHtml.slice(0,close)+panel+baseHtml.slice(close)}
  return baseHtml+panel;
}
const baseRenderWorld157=renderWorld;
renderWorld=function(){return directorCareer157(baseRenderWorld157())};

function fanAccount157(seed=''){
  const fans=ACCOUNTS.filter(a=>a.sceneFan157);if(!fans.length)return null;
  const h=Math.abs(typeof hash==='function'?hash(seed):seed.length);return fans[h%fans.length];
}
function eligibleMedia157(){
  const p=state.player||{},stage=typeof playerMediaStage129==='function'?playerMediaStage129():'unknown';
  const micro=media.filter(a=>a.sceneMicro157),lower=media.filter(a=>['tmz','enews','people'].includes(a.id)),all=media.filter(a=>!a.sceneMicro157);
  // Unknown players spread through people/fan accounts first. Editorial accounts enter only once there is actual public recognition.
  if(stage==='unknown')return[];
  if(stage==='breakthrough')return micro;
  if(stage==='recognized')return [...micro,...lower];
  return [...micro,...all];
}
function context157(m){
  const p=state.player||{},handle=`@${p.handle}`,clip=s=>String(s||'').replace(/\s+/g,' ').trim().slice(0,78);
  if(m.type==='player_post')return {subject:m.text?`the post “${clip(m.text)}”`:'the new post',fan:[
    `okay ${handle} just posted ${m.text?`“${clip(m.text)}”`:''} and I need the context immediately`,
    `I was not following ${handle} five minutes ago and now ${m.text?'that post':''} has me doing research`,
    `${handle} is starting to show up on my feed and I genuinely want to know what the story is`
  ],media:`${handle} is starting to pick up discovery traffic after a new post moved beyond the account's usual audience.`};
  if(m.type==='gig')return {subject:m.title||'the latest job',fan:[
    `people from ${place227(m)||'that job'} are already talking about ${handle}. okay then`,
    `${handle} apparently had a ${m.outcome||'solid'} night ${place227(m)?(/^the /.test(place227(m))?'at ':'in ')+place227(m):'at the booking'} and now I want the footage`,
    `one good room can change everything and it sounds like ${handle} just had one`
  ],media:`Rising ${String(p.career||'entertainment').toLowerCase()} name ${p.name} is getting early attention after a booking ${place227(m)&&/^the /.test(place227(m))?'at '+place227(m):'in '+(m.city||p.city)}.`};
  if(m.type==='event'){const pl=place227(m),atPl=pl?(/^the /.test(pl)?'at '+pl:'in '+pl):'';return {subject:pl||'the situation',fan:[
    `${handle} ${atPl||'last night'}… I have questions`,
    `the ${pl||'latest'} discourse has reached my timeline and somehow ${handle} is in the middle of it`,
    `wait I need the full story on ${handle} ${atPl||'and this whole thing'}`
  ],media:`${p.name}'s night ${atPl||'out'} is starting a small but noticeable conversation online.`}};
  if(m.type==='travel')return {subject:`the ${m.city||'trip'} trip`,fan:[
    `why did ${handle} just land in ${m.city||'another city'} right when things were getting interesting`,
    `${handle} in ${m.city||'town'}… work trip or plot development?`,
    `not me noticing ${handle} is suddenly in ${m.city||'a new city'}`
  ],media:`${handle} has been spotted in ${m.city||'a new city'} as the emerging ${String(p.career||'talent').toLowerCase()} name builds momentum.`};
  if(m.type==='verified_public'||m.type==='verified_comment'||m.type==='starter_public_ripple')return {subject:`the ${m.celebrity||'celebrity'} interaction`,fan:[
    `who is ${handle} and why is ${m.celebrity||'a verified account'} already in their orbit`,
    `I came from the ${m.celebrity||'celebrity'} interaction and now I am invested in ${handle}`,
    `${m.celebrity||'that verified account'} interacting with ${handle} just sent a lot of people to that profile`
  ],media:`People are asking who ${handle} is after a visible interaction with ${m.celebrity||'a verified celebrity account'}.`};
  if(m.type==='scene_milestone'||m.type==='chapter_complete'||m.type==='side_quest')return {subject:m.title||'the milestone',fan:[
    `${handle} quietly hit ${m.title||'another milestone'} and the growth is starting to look very real`,
    `watching ${handle} go from random account to actual name on my feed in real time is kind of wild`,
    `${handle} just cleared ${m.title||'another career step'} — okay momentum`
  ],media:`${p.name} has hit another early career marker as interest around ${handle} continues to build.`};
  return null;
}
function fanComments157(ctx,m,count=3){
  const out=[],pseudo={id:`scene-thread-${m.id||m.type}-${now157()}`,authorId:'player',text:String(ctx.subject||ctx.text||m.text||m.title||''),media:'',comments:out};
  for(let i=0;i<count;i++){
    const c=contextualFanComment(pseudo);if(!c)continue;
    if(out.some(x=>String(x.text||'').toLowerCase()===String(c.text||'').toLowerCase()))continue;
    out.push(c);
  }
  return out;
}
function addWorldPost157(a,text,m,kind='scene-world157'){
  if(!a||!text)return null;
  const p=mkPost(a,0,String(text).slice(0,280),{media:false,kind});
  p.sceneBeat157=m.id||'';p.comments=Array.isArray(p.comments)?p.comments:[];
  const target=rand(2,4);while(p.comments.length<target){const c=contextualFanComment(p);if(!c||p.comments.some(x=>String(x.text||'').toLowerCase()===String(c.text||'').toLowerCase()))break;p.comments.push(c)}
  state.posts.unshift(p);state.posts=state.posts.slice(0,140);
  return p;
}
function newPostsPill157(posts=[]){
  const d=ensure157();if(!d)return;
  const incoming=(Array.isArray(posts)?posts:[posts]).map(x=>typeof x==='string'?(state.posts||[]).find(p=>p.id===x):x).filter(p=>p?.id&&p.authorId!=='player');
  d.newPostIds=Array.isArray(d.newPostIds)?d.newPostIds:[];
  for(const p of incoming)if(!d.newPostIds.includes(p.id))d.newPostIds.push(p.id);
  d.newPostIds=d.newPostIds.filter(id=>(state.posts||[]).some(p=>p.id===id)).slice(-20);
  d.newPostCount=d.newPostIds.length;
  let btn=document.getElementById('scene-newposts157');
  if(!d.newPostCount){btn?.remove();return}
  const feedVisible=state.tab==='feed'&&!modal?.firstElementChild;
  if(!feedVisible){btn?.remove();return}
  if(!btn){btn=document.createElement('button');btn.id='scene-newposts157';btn.className='scene-newposts157';document.body.appendChild(btn)}
  const exactPosts=d.newPostIds.map(id=>(state.posts||[]).find(p=>p.id===id)).filter(Boolean).sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
  const authors=[];for(const p of exactPosts){const a=byId(p.authorId)||p.npcAuthor;if(a&&!authors.some(x=>x.id===a.id))authors.push(a)}
  const faces=authors.slice(0,2).map(a=>av(a,'microav')).join('');
  btn.innerHTML=`<span class="scene-newfaces157">${faces}</span><b>${d.newPostCount} new ${d.newPostCount===1?'post':'posts'} ↑</b>`;
  btn.onclick=()=>{d.newPostIds=[];d.newPostCount=0;btn.remove();state.tab='feed';save();render();requestAnimationFrame(()=>window.scrollTo({top:0,behavior:'smooth'}))};
}
function rewardToast157(title,bits=[]){
  document.querySelector('.scene-scoretoast157')?.remove();
  const el=document.createElement('div');el.className='scene-scoretoast157';el.innerHTML=`<small>WORLD MOVED</small><strong>${esc157(title)}</strong><span>${bits.map(esc157).join(' · ')}</span>`;document.body.appendChild(el);setTimeout(()=>el.remove(),3600);
}
/* place227: where a memory happened, without quoting the quest/story title ("A fundraiser at the Williamsburg rooftop needs a last-minute performer" -> "the Williamsburg rooftop"). */
function place227(m){
  const t=String(m?.title||'').replace(/\s+/g,' ').trim(),stop=/^(needs?|asks?|wants?|offers?|is|are|was|has|have|with|for|and|to|in|on|at|of|tonight|tomorrow|today|after|before|while|who|that|which|but|or|if|when|so|just|again|now|then|this|your|you)$/i;
  if(t.includes(' · ')){const seg=t.split(' · ').pop().trim();if(seg)return /^(the|a|an)\s/i.test(seg)?seg:'the '+seg}
  const at=t.match(/\bat\s+((?:the|a|an)\s+)?(.+)$/i);
  if(at){const words=[];for(const w of at[2].split(' ')){if(stop.test(w.replace(/[^\w']/g,''))||words.length>=4)break;words.push(w.replace(/[.,!?;:]+$/,''))}if(words.length)return ((at[1]&&/^the/i.test(at[1]))?'the ':'')+words.join(' ')}
  const city=m?.city||state.player?.city||'';return city;
}
function consequence226(m){
  const q=s=>String(s||'').replace(/\s+/g,' ').trim(),e=m?.effect&&typeof m.effect==='object'?m.effect:{},o=q(m?.outcome).replace(/[.!?]+$/,'');
  if(o&&o.length<=110&&!/^(you|your|i|we)\b/i.test(o)&&!/\bcho(se|osing)\b/i.test(o))return o.replace(/^[A-Z](?=[a-z])/,x=>x.toLowerCase());
  const bits=[],f=Number(e.followers)||0,fame=Number(e.fame)||0,rep=Number(e.rep)||0,money=Number(e.money)||0;
  if(f>=1000)bits.push(`${typeof fmt==='function'?fmt(f):f} new followers`);else if(f>0||fame>0)bits.push('more people noticed');else if(fame<0)bits.push('some of the attention cooled off');
  if(rep<0)bits.push('the reputation took a hit');else if(rep>0)bits.push('the reputation went up');
  if(!bits.length&&money>0)bits.push('it paid');else if(!bits.length&&money<0)bits.push('it cost money');
  return bits.slice(0,2).join('; ');
}
function beatDetail159(m){
  const q=s=>String(s||'').replace(/\s+/g,' ').trim();
  if(m.type==='player_post')return m.text?`the post “${q(m.text).slice(0,92)}”`:'the new post';
  /* v226: narrate consequences (what changed), never "<player> chose…" — the player made the choice and doesn't need it read back */
  if(m.type==='gig'){const pl=place227(m);return `${pl&&/^the /i.test(pl)?pl:'the booking'}${m.city?` in ${q(m.city)}`:''}`} /* feedguard230: no raw rating label "(solid)" in prose */
  if(m.type==='event'){const pl=place227(m),what=pl?(/^the /.test(pl)?pl:`a night in ${pl}`):'a public moment',res=consequence226(m);return res?`${what} (${res})`:what;}
  if(m.type==='travel')return `the arrival in ${q(m.city||state.player.city)}`;
  if(['verified_public','verified_comment','starter_public_ripple'].includes(m.type))return `${q(m.celebrity||'a verified celebrity')}'s public interaction with @${state.player.handle}`;
  if(m.type==='scene_milestone'||m.type==='chapter_complete'||m.type==='side_quest')return `another career step`;
  return q(m.title||m.text||'the latest move');
}
function semanticLocal166(input){
 const text=String(input||'').replace(/\s+/g,' ').trim(),low=text.toLowerCase(),people=[];
 const add=n=>{if(n&&!people.includes(n))people.push(n)};
 for(const a of celebs||[]){const name=String(a.name||'').toLowerCase(),handle=String(a.handle||'').toLowerCase();if((name&&low.includes(name))||(handle&&low.includes('@'+handle)))add(a.name)}
 const aliases=[['kim','Kim Kardashian'],['kris','Kris Jenner'],['kylie','Kylie Jenner'],['kendall','Kendall Jenner'],['khloé','Khloé Kardashian'],['khloe','Khloé Kardashian'],['kourtney','Kourtney Kardashian'],['rihanna','Rihanna'],['beyoncé','Beyoncé'],['beyonce','Beyoncé'],['ariana','Ariana Grande'],['taylor','Taylor Swift'],['sabrina','Sabrina Carpenter'],['tate','Tate McRae'],['zendaya','Zendaya']];for(const [key,name] of aliases)if(new RegExp(`\\b${key}\\b`,'i').test(low))add(name);
 let kind='general',subject='',summary='',significance='ordinary';
 if(/\bkuwtk\b|keeping up with the kardashians|\b(?:episode|appearance|guest|filming|film|shoot|show)\b.{0,32}\bkeeping up\b|\bkeeping up\b.{0,32}\b(?:episode|appearance|guest|filming|film|shoot|show)\b/.test(low)){const kp=(state.sceneProposals180||[]).find(x=>x.type==='keeping_up_guest'&&['confirmed','completed'].includes(x.status));subject='KUWTK (Keeping Up with the Kardashians)';if(kp){kind='tv_appearance';significance='major-entertainment';summary=`${state.player?.name||'The player'} has a confirmed Keeping Up guest segment.`}else{kind='tv_claim';significance='social';summary=`${state.player?.name||'The player'} is talking about a Keeping Up appearance, but there is no confirmed production booking in SCENE yet.`}if(!people.length){add('Kim Kardashian');add('Kris Jenner')}}
 else if(/(?:#\s*1|number one|no\.?\s*1|number-one)/.test(low)&&/song|single|track|record|chart|music/.test(low)){kind='chart_achievement';subject='#1 song/chart result';significance='major-career';summary=`${state.player?.name||'The player'} is publicly saying a song/single has reached number one.`}
 else if(/\b(released?|dropped|out now|available now|stream(?:ing)? now|just released|just dropped)\b/.test(low)&&/\b(song|single|track|album|record|music|ep)\b/.test(low)){kind='music_release';subject='music release';significance='career';summary=`${state.player?.name||'The player'} is announcing that music has actually been released.`}
 else if(/\b(studio|recording|writing|rehearsal|demo|working on|making|finishing|mixing|mastering|session)\b/.test(low)&&/\b(song|single|track|album|record|music|ep)\b/.test(low)){kind='music_work';subject='music work in progress';significance='career';summary=`${state.player?.name||'The player'} is talking about music they are still working on, not announcing a release.`}
 else if(/streams?|sales|chart|spotify|apple music|billboard|stats?|numbers/.test(low)&&/song|single|album|track|music/.test(low)){kind='music_stats';subject='music performance/statistics';significance='career';summary=`${state.player?.name||'The player'} is discussing concrete music performance or chart statistics.`}
 else if(/guest appearance|guest spot|appearing on|filming for|episode of|on the show/.test(low)){kind='tv_appearance';subject='television/show appearance';significance='career';summary=`${state.player?.name||'The player'} says they have a guest television/show appearance.`}
 else if(people.length){kind='celebrity_reference';subject=people.join(' + ');significance='social';summary=`${state.player?.name||'The player'} is explicitly talking about ${people.join(', ')}.`}
 else if(/\b(?:won(?!['’])|awards?|grammys?|emmys?|oscars?|nominations?|nominated)\b/.test(low)){kind='award';subject='award/nomination';significance='major-career';summary=`${state.player?.name||'The player'} is talking about an award or nomination.`}
 return{text,kind,subject,summary,significance,people};
}
function continuity159(m){const types=new Set(['player_post','gig','event','travel','side_quest','verified_public','verified_comment','starter_public_ripple','chapter_complete','scene_milestone','viral_push','story_choice']),at=Number(m?.at)||now157(),prior=(state.memory||[]).find(x=>x&&x.id!==m?.id&&types.has(x.type)&&(Number(x.at)||0)<at),starter=byId(state.firstSession148?.friendId||''),priorSummary=prior?.sceneUnderstanding166?.summary||prior?.semantic166?.summary|| (prior?beatDetail159(prior):'');return{prior:priorSummary,starter:starter?.name||'',starterRole:starter?.role||'',ongoingNarrative:prior?`${state.player.name} was already in conversation because of ${priorSummary}${starter?` with ${starter.name} as the original visible connection`:''}. The current beat is ${m.sceneUnderstanding166?.summary||semanticLocal166(m.text||m.title||m.choice||'').summary||beatDetail159(m)}.`:(starter?`${starter.name} is ${state.player.name}'s original celebrity connection in this career.`:'')}}
function socialStore159(){if(!state.sceneSocialVoice159||typeof state.sceneSocialVoice159!=='object')state.sceneSocialVoice159={npcs:{},ledger:[]};return state.sceneSocialVoice159}
function npcMemory159(n){const s=socialStore159();if(!s.npcs[n.id])s.npcs[n.id]={seenPlayer:0,lastLines:[],stance:(Math.abs(hash(n.id+'stance159'))%41)-20};return s.npcs[n.id]}
function postMeaning159(p){
  const text=String(p?.text||'').replace(/\s+/g,' ').trim(),low=text.toLowerCase(),author=p?.authorId==='player'?{type:'player',name:state.player?.name}:byId(p?.authorId),quote=(text.match(/[“"]([^”"]{3,100})[”"]/)||[])[1]||'',aboutPlayer=p?.authorId==='player'||low.includes(`@${String(state.player?.handle||'').toLowerCase()}`)||low.includes(String(state.player?.name||'').toLowerCase()),semantic=semanticLocal166(text);
  let topic='general';if(/song|music|studio|album|record|track|single|chorus|verse|demo|showcase|performance|chart|streams?/.test(low))topic='music';else if(/brand|campaign|booking|career|job|audition|callback|fitting|meeting|client|brief|industry|role|set|guest appearance|filming|episode/.test(low))topic='career';else if(/kiss|date|crush|relationship|boyfriend|girlfriend|soft.?launch|romance/.test(low))topic='romance';else if(/cape town|johannesburg|london|paris|new york|los angeles|dubai|tokyo|airport|flight|landed|arrival/.test(low))topic='travel';else if(/dress|look|outfit|fashion|stylist|runway|beauty|makeup/.test(low))topic='fashion';else if(/fight|shade|feud|lie|receipts|drama|backlash|deny|clap/.test(low))topic='drama';
  return{text,low,author,quote,aboutPlayer,topic,semantic,isMedia:author?.type==='media',isFan:author?.type==='fan',isCeleb:author?.type==='celeb'};
}
function sourceBeat180(p){const id=String(p?.sceneBeat157||p?.sourceEventId||p?.sourceArcId||'');if(id){const mem=(state.memory||[]).find(x=>String(x.id||'')===id);if(mem)return mem}const a=byId(p?.authorId);if(a?.type==='celeb')return (state.memory||[]).find(x=>x.celebrityId===a.id&&now157()-(Number(x.at)||0)<3*3600000&&['verified_public','verified_comment','scene_celeb_reaction','incoming_dm','event','story_choice'].includes(x.type))||null;return null}
function postLinkedToPlayer180(p,m){if(m.aboutPlayer)return true;const src=sourceBeat180(p);if(src&&['verified_public','verified_comment','scene_celeb_reaction','player_post','event','story_choice'].includes(src.type))return true;const a=m.author;if(a?.type==='celeb'){const r=memoryFor(a.id);return Boolean((r.friendship||0)>=28||(r.trust||0)>=24||followsMe(a.id))}return false}
function specificPostComment180(person,m,p){
 const h=`@${state.player?.handle||''}`,linked=postLinkedToPlayer180(p,m),t=m.low||'',author=m.author?.name||'',src=sourceBeat180(p),celeb=src?.celebrity||byId(src?.celebrityId)?.name||author;
 const choose=arr=>arr[Math.abs(hash(`${person}|${p?.id||m.text}|specific180`))%arr.length],short=String(m.text||'').replace(/\s+/g,' ').trim().slice(0,72);
 if(/opened the session again|said i was done.*session|session again/.test(t))return choose([`you were absolutely not done 😭`,`what were you changing when you reopened it`,`the “one more session” lie gets everybody`,`okay but did the reopened session actually fix it`,`now I need to hear whatever made you open the project again`]);
 if(/campaign day|crease anything|first frame|garment bag|fitting/.test(t))return choose([`did the outfit survive the first frame 😭`,`okay but what campaign is this for`,`the pre-shoot crease panic is so real`,`need the finished campaign after this caption`,`campaign day before the first frame always looks mildly terrifying`]);
 if(/shoes won|the shoes won/.test(t))return choose([`okay now show us the shoes`,`which shoes won though 👀`,`honestly the shoes winning feels correct`,`I need the pair because this caption sold them already`,`not the shoes making the final decision 😭`]);
 if(/progress is quiet|quiet sometimes|quiet progress/.test(t))return choose([`okay what progress are we talking about 👀`,`quiet progress usually means there is a story missing`,`this is cryptic enough that now I need context`,`are we supposed to know what moved forward here 😭`,`fine keep it quiet but at least give us one clue`]);
 if(m.isCeleb){
  if(/internet is a terrible place|see you tomorrow/.test(t)){const base=[`“see you tomorrow” is doing a LOT of work here 😭`,`okay tomorrow for WHAT`,`${author||'they'} cannot post this and disappear lol`,`the “see you tomorrow” part is suspicious`],spec=[`wait is this about ${h} or am I being too online`,`not me wondering if ${h} is involved in whatever tomorrow is`,`if this somehow connects back to ${h} I am logging off`,`do we think “tomorrow” has anything to do with ${h} 👀`];return choose(linked&&Math.abs(hash(`${p?.id}|${person}|link180`))%100<45?[...base,...spec]:base)}
  if(/sent the demo|demo at 3am/.test(t))return choose([`3am demo sends are always either genius or a cry for help`,`okay but now I want to hear the demo`,`“at 3am obviously” 😭 painfully on brand`,`who got the 3am demo though`]);
  if(/early call|wet hair|garment bags/.test(t))return choose([`wet hair + garment bags means the day started disrespectfully early`,`the garment bag pile tells me everything I need to know`,`okay what shoot has you up this early`,`this is exactly what 5am call time looks like 😭`]);
  if(/no context|tomorrow|tonight|soon|you'll see|you will see/.test(t)&&linked)return choose([`is this about ${h} or are we inventing lore again`,`why did my brain immediately connect this to ${h} 😭`,`okay but does ${h} know what this means`,`not saying this is about ${h}... but I am absolutely asking`]);
 }
 if(m.isMedia){
  if(/new celebrity connection/.test(t))return choose([`okay WHICH celebrity connection`,linked?`are they talking about ${h} and ${celeb||'that celeb'}?`:`you cannot say “new celebrity connection” and leave it there`,`name the connection or leave me alone 😭`,`wait who actually interacted with who`]);
  if(/surprise sighting/.test(t))return choose([`a sighting of who though 😭`,`where was the sighting? that is the entire story`,linked?`is this another ${h} thing?`:`this is extremely vague for a “sighting”`,`okay give us the actual location at least`]);
 }
 if(p?.authorId==='player'&&/keeping up|kuwtk|episode/.test(t)){const bank={stan:[`WAIT a Keeping Up appearance?? 😭`,`okay I need this episode immediately`,`not me actually setting a reminder for this`,`Kim better give us behind-the-scenes 😭`],skeptic:[`wait is the appearance actually confirmed now?`,`okay but what are they doing in the episode`,`I need to know if this is a cameo or a whole segment`],dry:[`casually announcing a Keeping Up appearance is insane`,`oh sure. normal little Tuesday update.`,`“keeping up appearance today” is not a sentence you just drop casually`],kind:[`wait this is actually such a fun booking`,`okayyy congrats, I hope filming is amazing`,`this would be so cute omg`],chaotic:[`KEEPING UP???? HELLO????`,`KIM WHAT DID YOU DO 😭`,`WHO ELSE IS IN THE EPISODE I NEED NAMES`],culture:[`okay this is the first update where I genuinely want the episode details`,`the Kardashian show connection just became an actual appearance — that is wild`],detective:[`okay so the appearance is real now. when does it air?`,`need the call sheet, the cast list and the episode date immediately`,`who else is filming today 👀`],industry:[`a real TV appearance is a much bigger deal than a random cosign`,`okay this is an actual credit now, not just internet chatter`],lurker:[`KUWTK?? 👀`,`wait WHAT`,`episode details pls`],casual:[`wait are you actually on Keeping Up??`,`okay now I want to watch this lol`,`who else is in the episode 👀`,`when does this air??`]};return choose(bank[person]||bank.casual)}
 if(p?.authorId==='player'&&/^(?:so )?(?:cute|hey|hi|hii|hello|hey guys|hi guys|so cute hey guys)[! .😂😭❤️]*$/i.test(t))return choose({stan:[`hiiii 😭`,`cute WHAT happened lol`,`okay hi why do I feel like I missed something`],skeptic:[`hey lol. context?`,`why does this sound like the middle of a conversation`,`cute what 😭`],dry:[`hello to you too, mysterious citizen`,`strong opening. zero context.`,`this feels like I walked into a conversation late`],kind:[`hiii hope you’re having a good day`,`okay cute 😭 hi`,`hey!! what are we celebrating`],chaotic:[`HEY???? WHAT HAPPENED 😭`,`SO CUTE WHAT???`,`you cannot say this and vanish omg`],culture:[`this is such a “posted mid-thought” caption lol`,`the casual hello is somehow making everybody nosy`],detective:[`okay what did I miss before “so cute”`,`I need the sentence that came before this one`,`cute about WHAT exactly 👀`],industry:[`lol this is just a normal post and honestly good for them`,`not every caption needs a rollout strategy thank god`],lurker:[`hii 👀`,`wait lol`,`cute??`],casual:[`hiii lol`,`okay what’s cute 😭`,`hey?? what did I miss`,`this sounds like you opened the app mid-conversation`] }[person]||[`hiii lol`,`okay what’s cute 😭`,`hey?? what did I miss`]);
 return'';
}
function specificComment166(person,m){
 const s=m.semantic||{},h=`@${state.player?.handle||''}`,people=s.people||[],who=people.length?people.join(' and '):'',subject=s.subject||'the announcement';
 if(s.kind==='tv_claim'&&/KUWTK/i.test(subject)){const bank={stan:[`wait did ${h} actually get booked for Keeping Up or are we watching the pitch happen in real time 😭`,`okay I need Kim to confirm this before I lose my mind`],skeptic:[`is this actually confirmed yet or did ${h} just pitch the idea?`,`I need a production confirmation before I call this a booking`],dry:[`love an announcement that may currently just be a suggestion`,`keeping up episode: spiritually confirmed, contractually unclear`],kind:[`if they are pitching this, I hope it actually happens`,`wait this would be fun if production says yes`],chaotic:[`KIM PLEASE CONFIRM OR DENY 😭`,`IS THIS A PITCH OR A BOOKING I NEED ANSWERS`],culture:[`the interesting part is whether a private celebrity connection can turn into a real booking here`,`if Kim actually takes the idea to production, that is when this becomes more than social proximity`],detective:[`noting this as a player claim until there is an actual booking`,`timeline status: idea mentioned, production confirmation still missing`],industry:[`a warm introduction can create the opportunity, but it is not a booking until production says yes`,`the conversion from relationship to confirmed work is the real signal here`],lurker:[`confirmed? 👀`,`wait is this real`],casual:[`wait are they actually doing an episode or just talking about it`,`okay somebody tell me if this is confirmed lol`]};const arr=bank[person]||bank.casual;return arr[Math.abs(hash(`${person}|${m.text}|tvclaim180`))%arr.length]}
 if(s.kind==='tv_appearance'&&/KUWTK/i.test(subject)){const bank={stan:[`A KUWTK guest appearance??? oh ${h} is IN the Kardashian plot now 😭`,`not KUWTK 😭 okay I am absolutely watching this episode`],skeptic:[`a KUWTK guest spot is actually a real visibility jump. I want to see what the appearance is, not just the hype`,`okay this is more concrete than the usual “people are noticing” thing — KUWTK is a specific booking`],dry:[`congratulations to ${h} on entering the Kardashian Cinematic Universe`,`KUWTK guest appearance. casual sentence. extremely normal career development.`],kind:[`wait a KUWTK guest spot is huge, good for them`,`that is such a fun booking omg`],chaotic:[`KUWTK???? WITH THE KARDASHIANS???? HELLO????`,`THE KARDASHIAN LORE JUST ABSORBED ${h.toUpperCase()} 😭`],culture:[`KUWTK puts ${h} in front of an audience that may know the Kardashians but not them yet — that crossover is the story`,`this is the first thing that actually ties ${h}'s online buzz directly into Kardashian-world`],detective:[`KUWTK guest appearance + ${who||'Kardashian-world'} connection. okay, that explains why this account keeps crossing into that orbit`,`saving this one because “guest on KUWTK” is an actual event, not a vague cosign`],industry:[`a KUWTK guest appearance is audience crossover plus a recognizable credit; that can change the next rooms ${h} gets into`,`this is the kind of booking that can convert social proximity into an actual entertainment credential`],lurker:[`KUWTK 👀`,`okay that is actually big`],casual:[`wait they are going on KUWTK?? okay now I get why people are talking`,`I did not expect KUWTK to be the next update lol`]};return (bank[person]||bank.casual)[Math.abs(hash(`${person}|${m.text}|kuwtk166`))%(bank[person]||bank.casual).length]}
 if(s.kind==='chart_achievement'){const bank={stan:[`NUMBER ONE????? ${h} HELLO 😭`,`a #1 song is insane actually omg`],skeptic:[`a #1 is a real result, not vibes. now I want to know which chart and how long it holds`,`if the song is genuinely sitting at #1, that changes the conversation completely`],dry:[`number one song. love a quiet little update.`,`apparently ${h} just skipped directly to “chart-topper”. noted.`],kind:[`a number one song is amazing, congrats to them`,`okay that is genuinely huge`],chaotic:[`NUMBER ONE???? I LEAVE FOR TEN MINUTES 😭`,`THE SONG IS #1????? EXCUSE ME`],culture:[`a #1 changes the frame from “new person people are curious about” to “artist with a measurable hit”`,`chart success gives the whole story a different centre of gravity now`],detective:[`the important part here is the actual #1 claim — checking the chart details before I build a whole theory`,`okay, #1 is the first hard stat in this storyline`],industry:[`a #1 single changes leverage immediately: bookings, features, press and deal terms all get easier to negotiate`,`that chart result matters more than a week of generic buzz; this is a concrete career signal`],lurker:[`#1 👀`,`oh wow`],casual:[`wait the song is number one?? congrats`,`okay that is actually massive lol`]};return (bank[person]||bank.casual)[Math.abs(hash(`${person}|${m.text}|chart166`))%(bank[person]||bank.casual).length]}
 if(s.kind==='music_stats'){const bank={industry:[`actual chart/stream numbers are useful — this is the kind of data that changes what a team can ask for next`,`numbers matter here. audience conversion tells you more than generic hype`],culture:[`stats make the story less about “who is this?” and more about what audience they are actually building`,`this is where the narrative becomes measurable instead of just social chatter`],skeptic:[`finally, numbers. much easier to judge than vague “momentum” language`,`give me the chart and stream figures over the hype posts any day`],stan:[`THE NUMBERS???? okayyy ${h} 😭`,`stats day I love it here`],casual:[`okay those numbers are actually good`,`the stats make this make way more sense now`]};const arr=bank[person]||bank.casual;return arr[Math.abs(hash(`${person}|${m.text}|stats166`))%arr.length]}
 if(s.kind==='celebrity_reference'&&who){const bank={stan:[`NOT ${who.toUpperCase()} 😭`,`wait ${who} is involved??`,`okay now I’m nosy 😭`],skeptic:[`okay but what actually happened with ${who}?`,`is ${who} actually part of this or are we reaching?`,`I need one real detail lol`],dry:[`${who}. sure. completely normal update.`,`ah. ${who}. that explains the replies.`,`well that escalated quickly.`],culture:[`the replies saw ${who} and immediately lost their minds 😭`,`everyone is stuck on the ${who} part lol`,`okay the ${who} mention changed the whole comment section`],detective:[`when did ${who} enter this story 👀`,`okay I missed a chapter — why ${who}?`,`need the ${who} backstory immediately`],industry:[`wait is this actually a collab with ${who}?`,`what are you two working on?`,`okay if ${who} is involved I need the actual project details`],lurker:[`${who}?? 👀`,`wait ${who}?`,`oh??`],casual:[`wait this is about ${who}? lol`,`how did ${who} get involved 😭`,`okay ${who} being here is random lol`]};const arr=bank[person]||bank.casual;return arr[Math.abs(hash(`${person}|${m.text}|celeb184`))%arr.length]}
 return'';
}
function socialNorm181(s){return String(s||'').toLowerCase().replace(/@[a-z0-9_.]+/g,'@user').replace(/[“”"'’‘!?.,:;()]/g,' ').replace(/\s+/g,' ').trim()}
function commentIntent189(s){const n=socialNorm181(s);if(!n)return'empty';if(/\b(what happened|happened before|happened after|need (?:the )?(?:context|story|backstory|missing)|give (?:me|us) (?:the )?(?:context|story|details)|tell (?:me|us) (?:the )?(?:rest|story)|missing (?:part|chapter)|context|what (?:is|was) this about|what does .* mean|what are we missing|one more detail|full story)\b/.test(n))return'context';if(/\b(who else|who is in|who was there|who are you with|who else is involved|with who|with whom)\b/.test(n))return'people';if(/\b(when does|when is|what time|air date|release date|when can|when will|episode date|call time)\b/.test(n))return'timing';if(/\b(is this (?:actually )?confirmed|actually booked|is .* real|who confirmed|source|proof|confirmed yet)\b/.test(n))return'verification';if(/\b(what (?:did|do) they offer|what (?:is|was) the (?:job|role|project|booking)|what kind of (?:booking|role|project|campaign|segment)|who are you working with)\b/.test(n))return'career-detail';if(/^(?:okay |wait |lol |lmao |girl |bro )?(?:what|huh|hello|context|why)[\s?!.]*$/.test(n))return'confusion';return'other'}
function commentCore189(s){return socialNorm181(String(s||'').replace(/[“"][^”"]{4,120}[”"]/g,' ').replace(/@[a-z0-9_.]+/gi,' ')).replace(/\b(okay|wait|lol|lmao|omg|literally|actually|just|really|the|this|that|with|from|your|you|they|them|their|have|has|had|was|were|are|and|but|for|not|now|here|there|today|please)\b/g,' ').replace(/\s+/g,' ').trim()}
function commentTooClose189(a,b){const na=socialNorm181(a),nb=socialNorm181(b);if(!na||!nb)return false;if(na===nb)return true;const ia=commentIntent189(a),ib=commentIntent189(b);if(ia===ib&&['context','confusion'].includes(ia))return true;const ca=commentCore189(a),cb=commentCore189(b);if(ca&&ca===cb)return true;const A=new Set(ca.split(' ').filter(w=>w.length>2)),B=new Set(cb.split(' ').filter(w=>w.length>2));if(A.size<3||B.size<3)return false;let same=0;for(const w of A)if(B.has(w))same++;const overlap=same/Math.max(A.size,B.size),jacc=same/Math.max(1,A.size+B.size-same);return overlap>=.7||jacc>=.58}
function allThreadTexts189(p){const out=[];const walk=list=>{for(const c of list||[]){if(c?.text)out.push(c.text);if(c?.replies?.length)walk(c.replies)}};walk(p?.comments||[]);return out}
function threadCommentTooClose189(p,text,ignore=null){return allThreadTexts189(p).some(x=>x!==ignore&&commentTooClose189(x,text))}
function majorPostComment181(n,p){const t=String(p?.text||'').toLowerCase();if(p?.authorId==='player'&&/\bkeeping up\b|\bkuwtk\b/.test(t)&&/appearance|episode|film|filming|guest|official|today/.test(t)){const lines=[`wait are you actually filming today??`,`who else is in the episode 👀`,`okay when does this air`,`what kind of segment are you doing?`,`Kim better be in your scene 😭`,`not a Keeping Up appearance omg`,`how did this even get booked??`,`is this a cameo or a whole segment`,`I need the episode date immediately`,`okay this is actually huge congrats`,`please post behind-the-scenes after filming`,`are Kris and Kim both filming today?`,`wait what are you doing in the episode`,`this is so random 😭 I need the full story`,`okay now I genuinely want to watch`,`not me setting a reminder already`,`do you get to film with Kim??`,`how long is your segment 👀`,`I need wardrobe details immediately`,`this went from internet lore to an actual TV appearance real fast`],start=Math.abs(hash(`${n?.id||n?.handle}|${p.id}|major181`))%lines.length;for(let i=0;i<lines.length;i++){const line=lines[(start+i)%lines.length];if(!socialTooClose181(line))return line}return lines[start]}return''}
function socialTooClose181(line){const n=socialNorm181(line),ledger=(socialStore159().ledger||[]).slice(-320).map(socialNorm181);if(!n)return true;if(ledger.includes(n))return true;const words=new Set(n.split(' ').filter(w=>w.length>3));if(words.size<4)return false;return ledger.some(old=>{const ow=new Set(old.split(' ').filter(w=>w.length>3));let same=0;for(const w of words)if(ow.has(w))same++;return same/Math.max(words.size,ow.size)>=.78})}
function rememberSocialLine181(n,m,line){const mem=npcMemory159(n),seen=mem.seenPlayer||0;if(m.aboutPlayer)mem.seenPlayer=Math.min(99,seen+1);mem.lastLines=[...(mem.lastLines||[]),String(line).toLowerCase()].slice(-10);const s=socialStore159();s.ledger=[...(s.ledger||[]),String(line).toLowerCase()].slice(-420)}
function angleComment189(person,m,p){const t=String(m?.text||p?.text||'').toLowerCase(),author=m?.author?.name||'they',choose=bank=>{const arr=bank[person]||bank.casual||[];return arr.length?arr[Math.abs(hash(`${person}|${p?.id||t}|angle189`))%arr.length]:''};
 if(/notes app|cheaper|expensive|budget|cost|afford/.test(t))return choose({stan:['the notes app budget was a LIAR 😭','oh this idea is about to become expensive expensive'],skeptic:['how expensive are we talking because that wording is ominous','this is the exact sentence people say before the invoice arrives'],dry:['the notes app has never once respected a budget','concept: free. execution: unfortunately money.'],kind:['honestly every good idea gets expensive the second it leaves the notes app','I hope the expensive version is worth it 😭'],chaotic:['THE NOTES APP LIED TO YOU 😭','cancel the invoice and keep the vision'],culture:['“sounded cheaper in my notes app” is painfully creative-industry coded','every project has the moment where the cute idea meets an actual budget'],detective:['okay what part made the budget explode 👀','I need to know which idea caused the financial jump scare'],industry:['that is usually the moment concept meets production cost','some producer just opened a spreadsheet after reading this'],lurker:['the notes app lied 😭','budget said absolutely not'],casual:['lol this is so real','the way ideas become expensive the second they become real 😭']});
 if(/progress is quiet|quiet progress|progress.*quiet/.test(t))return choose({stan:['needed this reminder actually','quiet progress still counts and I am stealing that'],skeptic:['true, but I still want to know what progress we are talking about','fair. results eventually have to make some noise though'],dry:['unfortunately growth has terrible PR','progress: famously bad at posting updates'],kind:['this is actually a nice reminder','somebody needed to read this today 🤍'],chaotic:['WHY did this motivational post get me 😭','fine I will stop doomscrolling and do my work'],culture:['the anti-announcement announcement lol','a rare timeline post that is not trying to turn everything into a launch'],detective:['quiet progress toward WHAT though 👀','okay now I want to know what is being worked on'],industry:['the best career moves are sometimes invisible until they are finished','not every useful week produces a headline'],lurker:['needed that','real'],casual:['honestly true','okay this one got me a little']});
 if(/campaign day|crease|first frame|shoot day|on set|call time/.test(t))return choose({stan:['campaign dayyy I need the pictures already','the first frame better be worth the early call 😭'],skeptic:['campaign for what though 👀','I just know the call time was disrespectful'],dry:['trying not to crease anything is the real job','fashion: standing very still, professionally.'],kind:['hope the shoot goes well!!','okay have a good campaign day 🤍'],chaotic:['DO NOT SIT DOWN IN THE OUTFIT 😭','somebody guard the clothes with their life'],culture:['campaign-day posts always look calm while the set is chaos','the glamorous part is apparently avoiding chairs'],detective:['what campaign is this 👀','need the photographer credit when this drops'],industry:['first-frame nerves are real; campaign sets move fast','wardrobe continuity just entered the chat'],lurker:['do not crease it 😭','campaign 👀'],casual:['lol good luck not sitting down','this is exactly why I could never model']});
 if(/session|studio|demo|recording|opened the session|song/.test(t))return choose({stan:['oh we are back in the session?? I need to hear it','the song clearly won the argument 😭'],skeptic:['“opened the session again” means it was never done lol','I will believe it is finished when the file is exported'],dry:['songs are never finished, only temporarily abandoned','the session reopened itself. tragic.'],kind:['sometimes one more pass is the one 🤍','hope the new version clicks'],chaotic:['CLOSE THE LAPTOP BEFORE VERSION 47 😭','the session said you thought you were DONE?'],culture:['creative people saying “done” has lost all legal meaning','one more session is a universal musician lie'],detective:['what did you change this time 👀','okay which part dragged you back in'],industry:['one more session can save a record or ruin sleep; no middle ground','revision brain is undefeated'],lurker:['again?? 😭','version 38 incoming'],casual:['lol you were definitely not done','this is every creative project ever']});
 return choose({stan:[`I love when ${author} posts one sentence and leaves everyone to deal with it`,`this somehow makes perfect sense to me 😭`],skeptic:['I cannot tell if this is a joke or a warning yet','I am reserving judgment but the wording is doing a lot'],dry:['a sentence has been posted. consequences pending.','extremely specific and somehow still vague. impressive.'],kind:['honestly, fair','I hope whatever this is about turns out well'],chaotic:['WHY did I understand this immediately 😭','this feels like the start of a problem and I support it'],culture:['this reads like a group-chat message that escaped onto the timeline','the tone of this post is doing more than the punctuation'],detective:['okay, one detail please 👀','I am allowing myself exactly one follow-up question: what happened'],industry:['somewhere a team member just read this and sighed','I feel like there is a work story hiding behind this sentence'],lurker:['real','👀'],casual:['lol mood','honestly same']})}
function personalCommentLine159(n,p){
 const m=postMeaning159(p),mem=npcMemory159(n),person=n.personality||'casual',q=String(m.text||'').replace(/\s+/g,' ').slice(0,68),topic=m.topic,majorSpecific=majorPostComment181(n,p),postSpecific=specificPostComment180(person,m,p),specific=majorSpecific||postSpecific||specificComment166(person,m);let line='';
 if(globalThis.SCENE_FEEDGUARD_OFF!==true){const sp=specialComment230c(n,p);if(sp){if(sp.text){spc230c().set(sp.text,sp.kind);rememberSocialLine181(n,m,sp.text)}return sp.text}} /* feedguard230c: KUWTK / chart #1 comments win over the Writer comment library */
 const writer159=globalThis.SCENE_WRITER_COMMENTS?.lineFor?.(n,p);if(writer159){rememberSocialLine181(n,m,writer159);return writer159}
 if(specific&&!socialTooClose181(specific))line=specific;
 if(!line){const angled=angleComment189(person,m,p);if(angled&&!socialTooClose181(angled)&&!threadCommentTooClose189(p,angled))line=angled}
 if(!line){const author=m.author?.name||'they',snippet=String(m.text||'').replace(/\s+/g,' ').trim().slice(0,62),quoted=snippet?`“${snippet}”`:'this post',banks=m.isCeleb?{
  stan:[`${quoted} 😭 okay I need the rest of this story`,`not ${author} dropping ${quoted} and leaving`,`okay now I need to know what happened after this`],
  skeptic:[`what actually happened before ${quoted}?`,`okay but what does ${quoted} mean in context`,`I need one more detail before this makes sense`],
  dry:[`${quoted} is an insane sentence to leave without context`,`excellent. one sentence, zero explanation.`,`right, and what happened after that exactly?`],
  kind:[`okay wait, I hope whatever ${quoted} is about went well`,`this sounds like there is a whole story behind it`,`I need the context but this is cute`],
  chaotic:[`HELLO???? ${quoted} 😭`,`YOU CANNOT SAY ${quoted} AND LEAVE`,`wait WHAT happened after this 😭`],
  culture:[`the actual caption is what has me curious here`,`this feels like the middle of a story, not the beginning`,`okay the context behind ${quoted} is definitely the interesting part`],
  detective:[`what happened right before ${quoted} 👀`,`I need the timeline that leads to this caption`,`okay there is absolutely a missing chapter here`],
  industry:[`what project or situation is ${quoted} actually about?`,`okay give us the concrete context behind this`,`what was happening when this got posted?`],
  lurker:[`👀`, `context??`, `wait what happened`],
  casual:[`okay what happened 😭`,`lol I need context for this`,`wait tell us the rest`]
 }:m.isMedia?{
  stan:[`okay but what is the actual story here`,`wait give us the detail behind this headline`,`I need the full version now`],skeptic:[`who confirmed this?`,`what’s the source on this?`,`what exactly is confirmed here?`],dry:[`headline received. context pending.`,`okay, and the actual detail is?`,`great. now what happened.`],kind:[`hope this turns out well for everyone involved`,`okay I want the full story`,`this sounds interesting`],chaotic:[`HELLO???? DETAILS 😭`,`okay WHAT happened`,`I need the full story immediately`],culture:[`the detail behind the headline matters more than the wording`,`what actually happened here?`,`okay give us the context`],detective:[`source? 👀`,`where did this happen?`,`who else was there?`],industry:[`what is the confirmed event here?`,`is there a date or actual booking attached?`,`what happened exactly?`],lurker:[`👀`,`source?`,`wait`],casual:[`wait what happened`,`okay I need context`,`what’s the actual story?`]
 }:{
  stan:topic==='music'?[`wait I need to hear this`,`okay what does it sound like though`,`drop a snippet 😭`]:topic==='career'?[`wait what did you book?`,`okay this sounds exciting, what is it?`,`congrats but I need details 😭`]:[`okay but what happened after ${quoted}?`,`this feels like there is more to the story`,`wait give us context 😭`],
  skeptic:topic==='career'?[`is this actually booked?`,`what’s the job exactly?`,`what did they actually offer?`]:topic==='music'?[`is this released or are you still working on it?`,`what exactly are we hearing about here?`,`okay but is there a song yet?`]:[`what happened before ${quoted}?`,`I need more context than this`,`what are we missing here?`],
  dry:[`the ${quoted} part needs context`,`okay and then what happened?`,`one sentence and somehow more questions`],
  kind:topic==='career'?[`congrats 🤍 what is the project?`,`hope it goes well!! what are you doing?`,`this is exciting, tell us more`]:topic==='music'?[`can’t wait to hear it 🤍`,`what kind of song is it?`,`this sounds fun, I need a snippet`]:[`hope this is a good thing 🤍`,`okay wait this is cute`,`tell us the rest`],
  chaotic:[`WAIT WHAT HAPPENED 😭`,`HELLOOOO DETAILS`,`you cannot post this and disappear 😭`],
  culture:[`the context is more interesting than the caption here`,`okay what is the actual story behind this`,`this feels like the part after something already happened`],
  detective:[`what happened immediately before this 👀`,`okay I need the timeline`,`who else was there?`],
  industry:topic==='career'?[`what kind of booking is it?`,`who are you working with?`,`what is the actual role/project?`]:topic==='music'?[`is this out yet?`,`who worked on it with you?`,`when can we hear it?`]:[`what’s the concrete detail here?`,`what exactly happened?`,`what are we missing?`],
  lurker:[`👀`,`wait what happened`,`context?`],
  casual:[`wait what happened 😭`,`okay tell us more`,`lol what is this about?`]
 };const bank=banks[person]||banks.casual,start=Math.abs(hash(`${n.id}|${p.id||m.text}|187`))%bank.length;for(let i=0;i<bank.length;i++){const c=String(bank[(start+i)%bank.length]);if(c&&!socialTooClose181(c)&&!(mem.lastLines||[]).includes(c.toLowerCase())){line=c;break}}if(!line)line=snippet?`okay, what happened after “${snippet}”?`:`okay, what actually happened?` }
 if(n.cadence==='lowercase'||n.cadence==='no-punctuation')line=line.toLowerCase();if(n.cadence==='proper')line=line.charAt(0).toUpperCase()+line.slice(1)+(/[.!?]$/.test(line)?'':'.');if(n.cadence==='emoji'&&!/[😭👀😂💀🤍✨]$/.test(line)&&Math.abs(hash(n.id+line))%4===0)line+=' 😭';rememberSocialLine181(n,m,line);return line;
}
const baseContextual159=contextualFanComment;
contextualFanComment=function(p){
  p.comments=p.comments||[];const usedHandles=new Set(p.comments.map(c=>c.handle).filter(Boolean)),pool=NORMAL_NPCS.filter(n=>!usedHandles.has(n.handle));
  for(let i=0;i<90&&pool.length;i++){const n=pool[Math.abs(hash(`${p.id||p.text}|voice189|${p.comments.length}|${i}`))%pool.length];if(!n)continue;const text=personalCommentLine159(n,p);if(!text||threadCommentTooClose189(p,text))continue;return{id:'voice189-'+now157()+Math.random(),fan:true,npcId:n.id,name:n.name,handle:n.handle,avatar:n.avatar||fanAvatar(n.handle),text,createdAt:now157()-rand(300,50000),likes:rand(0,Math.max(4,Math.floor((state.player?.fame||0)/4)+4)),replies:[],sceneVoice159:true}}
  // Silence is better than manufacturing another paraphrase of the same reaction.
  return null;
};
const basePublicReply184=publicPersonaReply;
publicPersonaReply=function(a,text,negative=false){
 const t=String(text||'').trim(),low=t.toLowerCase(),v=VOICE[a?.id]||{},style=s=>v.lower?s.charAt(0).toLowerCase()+s.slice(1):s;if(!a)return'';
 if(a.type==='media')return negative?'We’re sticking with what was reported.':/\?$/.test(t)?'We’ll update if there is anything confirmed.':'Thanks for reading.';
 if(negative){const bank={kim:['Okay.','You’re entitled to your opinion.'],kylie:['lol okay','okayyy 😭'],kendall:['lol okay','fair enough'],rihanna:['Baby please 😂','Okay 😂'],doja:['lmao okay','sure lol'],charli:['lol okay','fair']};return style((bank[a.id]||['Okay.','Fair enough.'])[Math.abs(hash(`${a.id}|${t}|neg184`))%(bank[a.id]||['Okay.','Fair enough.']).length])}
 if(/\b(love|congrats|congratulations|proud|amazing|cute|beautiful|iconic|ate|slay)\b/.test(low)){const bank={kylie:['thank youuu 🤍','aw thank you 😭'],kim:['Thank you 🤍','That’s sweet, thank you.'],kendall:['lol thank you 🤍','aw thanks'],ariana:['thank youuu 😭🤍','stoppp thank you'],rihanna:['thank you baby 😂','aww thank you'],charli:['thank uuu lol','love u'],doja:['lol thank you','tyyy']};return style((bank[a.id]||['Thank you 🤍','That’s sweet.'])[Math.abs(hash(`${a.id}|${t}|thanks184`))%(bank[a.id]||['Thank you 🤍','That’s sweet.']).length])}
 if(/\?$/.test(t)){const bank={kylie:['lol maybe 👀','soon-ish 😭','wait and see'],kim:['I’ll share it when it’s actually ready.','You’ll know when there’s something to say.'],kendall:['lol later','maybe 😭'],doja:['why are you asking me 😭','lol maybe'],charli:['maybeeee lol','wait and see']};return style((bank[a.id]||['Maybe 👀','You’ll know soon enough.'])[Math.abs(hash(`${a.id}|${t}|q184`))%(bank[a.id]||['Maybe 👀','You’ll know soon enough.']).length])}
 const bank={kylie:['lol exactly','😭 literally','okayyy'],kim:['Exactly.','Right.'],kendall:['lol literally','exactly'],rihanna:['Exactly 😂','baby yes'],doja:['lmao exactly','real'],charli:['lol exactly','real']};const own=bank[a.id];return own?style(own[Math.abs(hash(`${a.id}|${t}|pub184`))%own.length]):basePublicReply184(a,t,false)
};
function fanPostLine159(fan,m){
 const detail=beatDetail159(m),h=`@${state.player.handle}`,type=fan?.sceneArchetype157||FAN_VOICE157[fan?.id]?.[0]||'casual',celeb=m.celebrity||byId(m.celebrityId)?.name||'',semantic=m.sceneUnderstanding166||semanticLocal166(m.text||m.title||m.choice||''),text=String(m.text||m.title||'').replace(/\s+/g,' ').trim();
 if(semantic.kind==='tv_appearance'&&/KUWTK/i.test(semantic.subject||'')){src230='kuwtk';const lines={stan:[`${h} is actually doing a Keeping Up appearance??? 😭 I need the episode now`,`who else is filming with ${h} today because I need DETAILS`],skeptic:[`${h} says the Keeping Up appearance is official now — okay, what kind of segment is it?`,`if this is filming today, when does the episode actually air?`],chaotic:[`KEEPING UP???? ${h.toUpperCase()} WHAT 😭`,`Kim Kardashian please explain how ${h} ended up on set TODAY`],dry:[`${h} casually announcing a Keeping Up appearance. normal career update.`,`apparently ${h} is filming with the Kardashian universe today. sure.`],detective:[`okay so ${h} says the Keeping Up appearance is official — who else is on the call sheet?`,`need to know what scene ${h} is filming and with who 👀`],industry:[`${h} landing a real Keeping Up guest segment is a proper TV credit, not just a social interaction`,`a confirmed Kardashian-world TV appearance is a genuinely useful booking for ${h}`],culture:[`the interesting part of ${h}'s Keeping Up announcement is that the celebrity connection actually turned into work`,`this is the point where ${h}'s Kardashian connection became an actual on-camera appearance`],casual:[`wait ${h} is actually doing Keeping Up today?? lol`,`okay now I genuinely want to know what ${h} is filming`],lurker:[`${h} on Keeping Up?? 👀`,`episode when 👀`]};const bank=lines[type]||lines.casual;return bank[Math.abs(hash(`${fan?.id}|${m.id}|kuwtk181`))%bank.length]}
 if(celeb){const lines={stan:[`${celeb} and ${h} in the same replies again 😭 okay what is going on`,`not ${celeb} popping up around ${h} again`],skeptic:[`okay, ${celeb} interacting with ${h} is real. the theories are still theories though`,`one comment from ${celeb} and everyone has a screenplay already`],chaotic:[`${celeb} KNOWS ${h}????? HELLO 😭`,`why is ${celeb} in ${h}'s replies omg`],dry:[`${celeb} has entered the chat. everybody remain extremely normal.`,`one ${celeb} comment and the app needs a corkboard apparently.`],detective:[`${celeb} → ${h}. public interaction confirmed. everything else is still guessing.`,`okay ${celeb} actually interacted with ${h}; noting that and nothing more for now`],industry:[`${celeb} commenting on ${h} is useful visibility, but the interaction itself is the only confirmed fact`,`the direct ${celeb} interaction is real; whatever relationship is behind it is still private`],culture:[`${celeb} showing up around ${h} is why people are speculating, but nobody actually knows the relationship yet`,`the replies are turning one ${celeb} interaction into ten different theories already`],casual:[`wait how does ${h} know ${celeb} 😭`,`okay ${celeb} in ${h}'s replies was not on my bingo card`],lurker:[`${celeb} 👀`,`wait ${celeb}??`]};const bank=lines[type]||lines.casual;return bank[Math.abs(hash(`${fan?.id}|${m.id}|celeb181`))%bank.length]}
 if(m.type==='gig'||m.type==='event'||m.type==='story_choice'){const bank=[`${h} just posted about ${detail} — what actually happened in the room?`,`okay ${h}, give us the version of ${detail} that did not fit in the caption`,`${/^(the|a|an)\s/i.test(detail)?detail.charAt(0).toUpperCase()+detail.slice(1):'The '+detail} sounds like there is a better story behind it`];return bank[Math.abs(hash(`${fan?.id}|${m.id}|event181`))%bank.length]}
 if(m.type==='player_post'){const q=text.slice(0,90);const bank=[`${h} really posted “${q}” and left us with that 😭`,`okay ${h}, “${q.slice(0,55)}” — context please`,`the “${q.slice(0,48)}” post has me nosy, unfortunately`];return bank[Math.abs(hash(`${fan?.id}|${m.id}|post181`))%bank.length]}
 return `${h} has something new up and I'm reading every reply for clues.`;
}
function mediaLine159(outlet,m){
  const p=state.player||{},detail=beatDetail159(m),h=`@${p.handle}`,voice=MEDIA_VOICE157[outlet?.id]||outlet?.sceneMediaVoice157||'',semantic=m.sceneUnderstanding166||semanticLocal166(m.text||m.title||m.choice||'');
  if(semantic.kind==='tv_appearance'&&/KUWTK/i.test(semantic.subject||'')){src230='kuwtk';const confirmed=(state.sceneProposals180||[]).some(x=>x.type==='keeping_up_guest'&&x.status==='confirmed')||(state.memory||[]).some(x=>x.type==='player_created_opportunity_confirmed'&&x.proposalType==='keeping_up_guest'),verb=confirmed?'is set to appear':'says a guest appearance is happening',specific={
    tmz:confirmed?`${p.name} says the Keeping Up appearance is official and filming is on the schedule today. Now the obvious question is who else is in the episode.`:`${p.name} says a Keeping Up appearance is happening — but the public details are still thin.`,
    enews:confirmed?`${p.name} confirms a Keeping Up guest appearance is on the schedule, putting the emerging name on camera in the Kardashian-Jenner TV world.`:`${p.name} says a Keeping Up appearance is on the way.`,
    people:confirmed?`${p.name} confirms a guest appearance in the Kardashian-Jenner television world, with filming now on the schedule.`:`${p.name} says a Kardashian-Jenner TV appearance is coming.`,
    popbase:confirmed?`${p.name} confirms a Keeping Up guest appearance is filming today.`:`${p.name} announces a Keeping Up guest appearance.`,
    variety:confirmed?`${p.name} has booked a Keeping Up guest segment, turning the emerging ${String(p.career||'entertainment').toLowerCase()} profile's Kardashian connection into a television credit.`:`${p.name} says a Keeping Up guest appearance is in the works.`,
    'scene-media-popcurrent':confirmed?`${p.name} confirms a Keeping Up guest appearance, with filming now on the schedule.`:`${p.name} says a Keeping Up guest appearance is coming.`,
    'scene-media-scenewire':confirmed?`${p.name} has booked a Keeping Up guest segment — a concrete TV credit for the emerging ${String(p.career||'entertainment').toLowerCase()} career.`:`${p.name} says a Keeping Up guest segment is being discussed.`,
    'scene-media-viralroom':`${h} just announced a Keeping Up appearance and the replies immediately started asking who else is in the episode.`,
    'scene-media-backstage':confirmed?`A Keeping Up guest segment puts ${p.name} on an actual production call sheet, not just in celebrity-adjacent social chatter.`:`${p.name}'s Keeping Up claim is getting attention, but the booking details are still the important part.`,
    'scene-media-cultureloop':confirmed?`${p.name}'s Kardashian connection has now turned into an on-camera Keeping Up appearance.`:`${h} is publicly talking about a Keeping Up appearance; confirmation is what separates the post from the booking.`,
    'scene-media-spotlight':confirmed?`${p.name} has landed a Keeping Up guest appearance — the clearest television booking in the rising career so far.`:`${p.name} says a Keeping Up appearance is next.`};return specific[outlet?.id]||`${p.name} ${verb} on Keeping Up.`}
  if(semantic.kind==='chart_achievement'){src230='chart1';const specific={
    'scene-media-popcurrent':`${p.name} says the new song has reached No. 1.`,
    'scene-media-scenewire':`${p.name} is claiming a No. 1 song — a chart result that would materially change the leverage around the emerging music career.`,
    'scene-media-viralroom':`${h} just posted that the song is No. 1 and the celebration has taken over the replies.`,
    'scene-media-backstage':`A No. 1 result would move ${p.name} from online curiosity into a measurable music success story.`,
    'scene-media-cultureloop':`A No. 1 song gives ${h}'s growing audience a concrete result to point to.`,
    'scene-media-spotlight':`${p.name} says the song has hit No. 1 — the strongest concrete career result attached to the account yet.`};return specific[outlet?.id]||`${p.name} says the song has reached No. 1.`}
  if(semantic.kind==='award'){const t=award230c(outlet,m);if(t){src230='award';return t}} /* feedguard230c: Writer feed.mediaReaction.award[]; empty pool = unchanged */
  if(['verified_public','verified_comment','starter_public_ripple'].includes(m.type)){
    const celeb=m.celebrity||byId(m.celebrityId)?.name||'a verified celebrity',specific={
      'scene-media-popcurrent':`${celeb} interacted publicly with ${h}, sending curious fans to the emerging account.`,
      'scene-media-scenewire':`${celeb}'s public interaction with ${p.name} created a visible discovery bump for the emerging ${String(p.career||'entertainment').toLowerCase()} profile.`,
      'scene-media-viralroom':`${celeb} just showed up around ${h} and the replies immediately filled with “who is this?”`,
      'scene-media-backstage':`${celeb}'s public interaction put ${p.name} in front of a much larger audience for the first time.`,
      'scene-media-cultureloop':`${celeb}'s audience is discovering ${h} after the two accounts interacted publicly.`,
      'scene-media-spotlight':`${p.name} is getting a new wave of profile attention after a public interaction with ${celeb}.`};
    return specific[outlet?.id]||`${celeb} interacted publicly with ${h}.`;
  }
  const lines={
    'scene-media-popcurrent':`${p.name} is picking up early pop-culture attention after ${detail}.`,
    'scene-media-scenewire':`${p.name}, an emerging ${String(p.career||'entertainment').toLowerCase()} name, added another industry signal with ${detail}.`,
    'scene-media-viralroom':`${h} is reaching a wider set of feeds after ${detail}.`,
    'scene-media-backstage':`${p.name} has another public career signal on the board after ${detail}.`,
    'scene-media-cultureloop':`${detail} introduced ${h} to people who were not following the account before.`,
    'scene-media-spotlight':`${p.name} is beginning to get noticed beyond the original following after ${detail}.`,
    popbase:`${p.name} is drawing attention following ${detail}.`,
    tmz:`${p.name} has people asking questions after ${detail} — and the public clues are doing plenty of work on their own.`,
    enews:`So, ${p.name} just gave the timeline something to work with: ${detail}.`,
    people:`${p.name}'s latest step into the spotlight came through ${detail}.`,
    variety:`Emerging ${String(p.career||'entertainment').toLowerCase()} talent ${p.name} is gaining industry visibility following ${detail}.`,
    billboard:`${p.name}'s music career is drawing fresh attention following ${detail}.`,
    vogue:`${p.name}'s public image is beginning to travel beyond the original audience after ${detail}.`,
    rollingstone:`${detail} is the latest example of how ${p.name}'s audience is being built one visible connection at a time.`,
    bbcnews:`${p.name} has attracted wider public attention following ${detail}.`,
    skynews:`Attention around ${p.name} has increased following ${detail}.`
  };
  return lines[outlet?.id]||`${p.name} is getting early attention after ${detail}.`;
}
function repairPublicCopy178(){
 if(!state?.player||state.scenePublicCopy178)return;
 const bad=/specific story to attach|made a choice that changed how the moment played out|still early in the climb|turns an unfamiliar handle|milestone [“\"]|the milestone [“\"]|public clues are doing plenty of work|latest example of how .* audience is being built one visible connection at a time|new celebrity connection is suddenly getting attention|surprise sighting has the timeline asking/i,stage=typeof playerMediaStage129==='function'?playerMediaStage129():'unknown';
 let changed=false;state.posts=(state.posts||[]).filter(p=>{const a=byId(p.authorId);if(a?.type!=='media'||!bad.test(String(p.text||'')))return true;const source=(state.memory||[]).find(m=>m.id===p.sceneBeat157);if(stage==='unknown'||!source){changed=true;return false}const next=mediaLine159(a,source);if(next&&next!==p.text){p.text=next;changed=true}return true});
 state.scenePublicCopy178=true;if(changed)save();
}
repairPublicCopy178();
function repairComments180(){
 if(!state?.player||state.sceneCommentRepair180)return;const banned=/somebody confiscate my wifi|curious, not convinced|people are noticing.? paragraph|one visible cosign can move discovery fast|audience crossover matters more than the comment|this came up on my feed so hi|the post is feeding me today|kind of small post people cite later|timestamps first, theories later|rooting for a normal outcome|framing is more interesting than the headline|headline is doing more work than the confirmed detail|repeat access will matter more than this single hit/i,seen=new Set();let changed=false;
 for(const p of state.posts||[]){if(!Array.isArray(p.comments))continue;const next=[];for(const c of p.comments){const norm=String(c.text||'').replace(/\s+/g,' ').trim().toLowerCase(),dup=norm&&seen.has(norm);if(!banned.test(norm)&&!dup){if(norm)seen.add(norm);next.push(c);continue}const n=NORMAL_NPCS.find(x=>x.id===c.npcId||x.handle===c.handle);let fresh=n?personalCommentLine159(n,p):'';const fn=String(fresh||'').replace(/\s+/g,' ').trim().toLowerCase();if(fresh&&!banned.test(fn)&&!seen.has(fn)){c.text=fresh;seen.add(fn);next.push(c)}changed=true}p.comments=next}
 state.sceneCommentRepair180=true;if(changed)save();
}
repairComments180();
function repairSocial181(){
 if(!state?.player||state.sceneSocialRepair181)return;const bad=/never seen .*account|clicked the page|stayed a minute|came for .*stayed|feeding me today|waiting to see what happens next|confirmed sentence|retention is the real test|audience crossover matters|career move changes|society continues|chose chaos via|people are noticing.? paragraph|somebody confiscate my wifi|this is exactly why i followed|early supporters are clocked in|saving this one for (?:the )?lore|good for them.? everybody starts with one room/i;let changed=false;const kept=[];
 for(const p of state.posts||[]){const a=byId(p.authorId),srcId=String(p.sceneBeat157||''),src=(state.memory||[]).find(m=>String(m.id||'')===srcId);if(a?.sceneFan157&&bad.test(String(p.text||''))){if(src){p.text=fanPostLine159(a,src);changed=true;if(bad.test(String(p.text||'')))continue}else{changed=true;continue}}
  if(Array.isArray(p.comments)){const used=new Set(),next=[];for(const c of p.comments){let text=String(c.text||''),norm=socialNorm181(text);if(!text||bad.test(text)||used.has(norm)){const n=NORMAL_NPCS.find(x=>x.id===c.npcId||x.handle===c.handle);if(n){text=personalCommentLine159(n,p);norm=socialNorm181(text);c.text=text;changed=true}else{changed=true;continue}}if(used.has(norm))continue;used.add(norm);next.push(c)}p.comments=next}kept.push(p)}
 state.posts=kept;state.sceneSocialRepair181=true;if(changed)save();
}
repairSocial181();
function repairMajorCoverage181(){
 if(!state?.player||state.sceneMajorCoverage181)return;state.sceneMajorCoverage181=true;const confirmed=(state.sceneProposals180||[]).some(x=>x.type==='keeping_up_guest'&&x.status==='confirmed')||(state.memory||[]).some(x=>x.type==='player_created_opportunity_confirmed'&&x.proposalType==='keeping_up_guest');if(!confirmed){save();return}
 const post=(state.posts||[]).find(p=>p.authorId==='player'&&/\bkeeping up\b/i.test(String(p.text||''))&&/\b(appearance|episode|film|filming|guest|today|official)/i.test(String(p.text||'')));if(!post){save();return}let source=(state.memory||[]).find(m=>m.type==='player_post'&&m.postId===post.id);if(!source)source={id:'repair181-'+post.id,type:'player_post',postId:post.id,text:post.text,at:post.createdAt||now157(),visibility:'public'};source.sceneUnderstanding166={kind:'tv_appearance',subject:'KUWTK (Keeping Up with the Kardashians)',summary:`${state.player.name} has a confirmed Keeping Up guest segment.`,significance:'major-entertainment',people:['Kim Kardashian']};const created=[];
 for(const id of ['tmz','enews','popbase']){const outlet=byId(id);if(!outlet)continue;const exists=(state.posts||[]).some(p=>p.authorId===id&&/keeping up|kardashian/i.test(String(p.text||''))&&Math.abs((p.createdAt||0)-(post.createdAt||0))<12*3600000);if(exists)continue;const p=addWorldPost157(outlet,mediaLine159(outlet,source),source,'scene-news181-repair');if(p)created.push(p)}
 if(created.length){save();newPostsPill157(created)}else save();
}
setTimeout(repairMajorCoverage181,500);
function repairSocial182(){
 if(!state?.player||state.sceneSocialRepair182)return;state.sceneSocialRepair182=true;const confirmed=(state.sceneProposals180||[]).some(x=>x.type==='keeping_up_guest'&&x.status==='confirmed')||(state.memory||[]).some(x=>x.type==='player_created_opportunity_confirmed'&&x.proposalType==='keeping_up_guest'),bad=/this is exactly why i followed|early supporters are clocked in|saving this one for (?:the )?lore|good for them.? everybody starts with one room|never seen .*account|clicked the page|stayed a minute|feeding me today|waiting to see what happens next|confirmed sentence|career move changes|audience crossover|retention is the real test/i;let changed=false;
 for(const p of state.posts||[]){if(Array.isArray(p.comments)){const keep=[];for(const c of p.comments){if(c.verified||(!c.fan&&!c.npcId&&!c.sceneAi159)){keep.push(c);continue}if(!bad.test(String(c.text||''))){keep.push(c);continue}changed=true}p.comments=keep}
  if(confirmed&&p.authorId==='player'&&/\bkeeping up\b/i.test(String(p.text||''))&&/\b(appearance|episode|film|filming|guest|today|official)/i.test(String(p.text||''))){const verified=(p.comments||[]).filter(c=>c.verified),ordinary=(p.comments||[]).filter(c=>!c.verified&&!c.fan&&!c.npcId&&!c.sceneAi159);p.comments=[...verified,...ordinary];for(let i=0;i<6;i++){const c=contextualFanComment(p);if(c)p.comments.push(c)}changed=true}}
 const announcement=(state.posts||[]).find(p=>p.authorId==='player'&&/\bkeeping up\b/i.test(String(p.text||'')));if(confirmed&&announcement){const source=(state.memory||[]).find(m=>m.type==='player_post'&&m.postId===announcement.id)||{id:'repair182-'+announcement.id,type:'player_post',postId:announcement.id,text:announcement.text,at:announcement.createdAt||now157(),visibility:'public'};source.sceneUnderstanding166={kind:'tv_appearance',subject:'KUWTK (Keeping Up with the Kardashians)',summary:`${state.player.name} has a confirmed Keeping Up guest segment.`,significance:'major-entertainment',people:['Kim Kardashian']};for(const p of state.posts||[]){const a=byId(p.authorId);if(a?.type==='media'&&/in-game connection|connection with kim kardashian turned into an actual production booking/i.test(String(p.text||''))){p.text=mediaLine159(a,source);changed=true}}}
 if(changed)save();else save();
}
setTimeout(repairSocial182,850);
function repairSocial184(){
 if(!state?.player||state.sceneSocialRepair184)return;state.sceneSocialRepair184=true;let changed=false;const bad=/the post is feeding me|i recognize this account now|bookmarking this one|i need more than this to know what is going on|i need the story behind this post immediately|part is making me nosy|okay[, ]+i have questions|turn the idea int|^noted[.! ]*$|^wait what[.! ]*$|^hello\?+[.! ]*$|let people have a nice thing|early supporters are clocked in|saving this one for (?:the )?lore|this is exactly why i followed|never seen .*account|clicked the page|stayed a minute|confirmed sentence|audience crossover|retention is the real test|career move changes|society continues/i;
 const recent=(state.posts||[]).slice(0,55);for(const p of state.posts||[]){if(!Array.isArray(p.comments))continue;const isRecent=recent.includes(p);if(isRecent){const protectedComments=p.comments.filter(c=>c?.authorId==='player'||c?.verified);p.comments=protectedComments;const target=p.authorId==='player'?6:5;let guard=0;while(p.comments.filter(c=>c?.fan||c?.npcId||c?.sceneVoice159||c?.sceneAi159).length<target&&guard++<24){const c=contextualFanComment(p);if(c&&!bad.test(String(c.text||''))&&!p.comments.some(x=>socialNorm181(x.text)===socialNorm181(c.text)))p.comments.push(c)}p._commentVisible=Math.min(12,p.comments.length);changed=true;continue}const next=[];for(const c of p.comments){if((c?.fan||c?.npcId||c?.sceneVoice159||c?.sceneAi159)&&bad.test(String(c.text||''))){changed=true;continue}next.push(c)}p.comments=next}
 if(changed)save();else save();
}
setTimeout(repairSocial184,1150);
function repairSocial188(){
 if(!state?.player||state.sceneSocialRepair188)return;state.sceneSocialRepair188=true;let changed=false;const recent=new Set((state.posts||[]).slice(0,70)),bad=/^lol\s+[a-z]|^okay then[.! ]*$|very normal post|that’s a real job|that's a real job|^i get it[.! ]*$|keep your private life private|decide what you actually want the next move|^lol okay[.! ]*$|^noted[.! ]*$|bookmarking this|the post is feeding me|i recognize this account|comment is taking me out|being here is sending me|what did they offer\??$/i;
 for(const p of state.posts||[]){if(!Array.isArray(p.comments))continue;const verifiedSeen=new Set(),kept=[];for(const c of p.comments){if(c?.verified&&c.authorId){if(verifiedSeen.has(c.authorId)){changed=true;continue}verifiedSeen.add(c.authorId);if(recent.has(p)&&bad.test(String(c.text||''))){const a=byId(c.authorId),src=(state.memory||[]).find(m=>m.type==='player_post'&&m.postId===p.id)||{id:'repair187-'+p.id,type:'player_post',postId:p.id,text:p.text,at:p.createdAt||now157(),visibility:'public'};if(a){c.text=activeLine157(a,src);changed=true}}}if(recent.has(p)&&(c?.fan||c?.npcId||c?.sceneVoice159||c?.sceneAi159)){changed=true;continue}if(bad.test(String(c?.text||''))&&!c?.authorId){changed=true;continue}kept.push(c)}p.comments=kept;if(recent.has(p)){const target=p.authorId==='player'?6:5;let guard=0;while(p.comments.filter(c=>c?.fan||c?.npcId||c?.sceneVoice159||c?.sceneAi159).length<target&&guard++<60){const c=contextualFanComment(p);if(!c)continue;const norm=socialNorm181(c.text);if(!norm||bad.test(c.text)||p.comments.some(x=>socialNorm181(x.text)===norm))continue;p.comments.push(c)}p._commentVisible=Math.min(Math.max(12,p._commentVisible||0),p.comments.length);changed=true}}
 if(changed)save();else save();
}
setTimeout(repairSocial188,1450);
function repairSocial189(){
 if(!state?.player||state.sceneSocialRepair189)return;state.sceneSocialRepair189=true;let changed=false;const recent=new Set((state.posts||[]).slice(0,80)),legacy=/the post is feeding me|i recognize this account|bookmarking this|very normal post|^okay then[.! ]*$|^i get it[.! ]*$|comment is taking me out|being here is sending me|one thing about me: i will turn the idea|career move changes|audience crossover|retention is the real test|never seen .*account|clicked the page|stayed a minute|confirmed sentence|society continues/i;
 for(const p of state.posts||[]){if(!recent.has(p)||!Array.isArray(p.comments))continue;const kept=[],verifiedSeen=new Set();for(const c of p.comments){const protectedComment=c?.authorId==='player'||(c?.replies||[]).some(r=>r?.authorId==='player');if(c?.verified&&c?.authorId){if(verifiedSeen.has(c.authorId)&&!protectedComment){changed=true;continue}verifiedSeen.add(c.authorId);kept.push(c);continue}if(protectedComment){kept.push(c);continue}if(legacy.test(String(c?.text||''))){changed=true;continue}const pseudo={...p,comments:kept};if(c?.text&&threadCommentTooClose189(pseudo,c.text)){changed=true;continue}kept.push(c)}p.comments=kept;const target=p.authorId==='player'?6:5;let guard=0;while(p.comments.filter(c=>c?.fan||c?.npcId||c?.sceneVoice159||c?.sceneAi159).length<target&&guard++<100){const c=contextualFanComment(p);if(!c)break;p.comments.push(c);changed=true}p._commentVisible=Math.min(Math.max(10,Number(p._commentVisible)||0),p.comments.length)}
 if(changed)save();else save();
}
setTimeout(repairSocial189,1750);
function activeLine157(a,m){
  const detail=beatDetail159(m),quote=m.type==='player_post'&&m.text?`“${String(m.text).replace(/\s+/g,' ').slice(0,78)}”`:detail,rel=memoryFor(a.id),tr=typeof dmBioTraits==='function'?dmBioTraits(a):{},close=(rel.friendship||0)>=35||a.id===starterId157(),semantic=m.sceneUnderstanding166||semanticLocal166(m.text||m.title||m.choice||''),postText=String(m.text||'').toLowerCase(),tagged=postText.includes('@'+String(a.handle||'').toLowerCase());
  if(m.type==='player_post'&&tagged&&/\b(single|song|track|feature|collab|collaboration|campaign|project|movie|film|show|reboot|episode)\b/.test(postText)){src230='project';
    const p=(state.sceneProposals180||[]).find(x=>x.characterId===a.id&&!['declined','completed','cancelled'].includes(x.status)),confirmed=p&&['confirmed','completed'].includes(p.status),warm=p&&['interested','meeting_offered','accepted','offered'].includes(p.status);
    if(confirmed)return tr.lower?'yeah 😭 this one is real. we’re doing it.':'Yes — this one is real. We’re doing it.';
    if(warm)return tr.lower?'we’re talking about it 😭 don’t announce it like it’s finished yet.':'We’re talking about it. Don’t announce it like it’s confirmed yet.';
    return tr.lower?'wait 😭 you just announced a project with me before we agreed on it. text me first.':'You just announced a project with me before we agreed on it 😭. Talk to me first.';
  }
  if(semantic.kind==='tv_appearance'&&/KUWTK/i.test(semantic.subject||'')){src230='kuwtk';const lines={kylie:[`wait you’re doing KUWTK?? 😭 okay tell me what they have you filming`,`KUWTK guest spot?? lol okay now I need the whole story`],kim:[`If you’re coming onto KUWTK, know what part of your story you actually want on camera before filming starts.`,`A KUWTK appearance can be great exposure. Just do not let the episode define more of you than you want it to.`],kendall:[`lol good luck with the KUWTK cameras 😭 just be normal and you’ll be fine`,`KUWTK?? okay that is actually funny. text me after filming.`],kris:[`A guest appearance is useful if the audience remembers why you were there. Make the moment count.`,`KUWTK can put you in front of a very different audience. Be clear about what you want them to remember.`]};const bank=lines[a.id];if(bank?.length)return bank[Math.abs(hash(`${a.id}|${m.id}|kuwtk166`))%bank.length];return `A KUWTK guest appearance is a real step. Tell me what they actually want you there for.`}
  if(semantic.kind==='chart_achievement'){src230='chart1';const lines={sabrina:[`NUMBER ONE??? okay wait that is actually huge 😭 what chart?`,`a #1 song?? okay you’re allowed to be annoying about this for at least 24 hours`],tatemcrae:[`wait NUMBER ONE???? 😭😭 are you kidding`,`a #1 song is crazyyy omg congrats`],kylie:[`wait your song is #1?? that’s hugeeee 😭 congrats`,`NUMBER ONE??? okayyy now celebrate before you start thinking about the next thing`],kim:[`A No. 1 is a real result. Save every stat and use the moment while people are paying attention.`,`Congratulations. A chart result like that gives you leverage — be smart about what you do next.`]};const bank=lines[a.id];if(bank?.length)return bank[Math.abs(hash(`${a.id}|${m.id}|numberone166`))%bank.length];return `A No. 1 song is huge. Congratulations — that is a real career result.`}
  const special={
    kylie:m.type==='player_post'?[`not ${quote} 😭 which one was the worst?`,`I saw ${quote}. honestly leave it up and don't explain it lol`]:[`I saw ${detail}. don't answer every question people ask you lol`,`${detail} is already becoming a whole thing. just let it breathe.`],
    sabrina:m.type==='player_post'?[`${quote} is a caption designed to get you questioned. I respect it.`,`The way you posted ${quote} and left is very suspicious of you.`]:[`The missing context around ${detail} is doing excellent work, actually.`,`I saw ${detail}. Very “I will explain absolutely nothing” of you.`],
    tatemcrae:m.type==='player_post'?[`wait ${quote} 😭 what happened`,`I saw ${quote} lol are you good`]:[`wait I saw ${detail} 😭 are you good`,`${detail} is kinda crazy lol tell me what actually happened`],
    hailey:m.type==='player_post'?[`saw ${quote}. honestly don't over-explain it`,`I saw ${quote}. people are going to make a whole story either way`]:[`saw ${detail}. honestly keep it simple and don't over-explain it`,`I saw ${detail}. people are gonna make a whole story either way, so protect your peace`],
    sydney:m.type==='player_post'?[`okay ${quote} made me laugh. what actually happened?`,`saw ${quote}. you're gonna have to tell me the real story`]:[`okay I heard about ${detail}. did the room actually feel good?`,`saw ${detail}. that's a real step — how did it feel?`],
    kim:m.type==='player_post'?[`I saw ${quote}. If people are curious, you do not have to answer every question.`,`${quote} is getting attention. Let the post do its job.`]:[`I saw ${detail}. If people are curious, you do not have to answer every question.`,`${detail} is useful attention. The next move matters more than explaining this one.`],
    kendall:m.type==='player_post'?[`lol ${quote}. people are already making it ten times bigger`,`saw ${quote}. I would leave it alone`]:[`lol I saw ${detail}. people are already making it ten times bigger`,`saw ${detail}. I would leave it alone and let everyone calm down`],
    zendaya:m.type==='player_post'?[`Saw ${quote}. Keep the part that matters to you off the timeline.`,`I saw ${quote}. You do not owe the replies an explanation.`]:[`Saw ${detail}. Keep the part that matters to you off the timeline.`,`I saw ${detail}. You can let the work be the answer.`],
    doja:m.type==='player_post'?[`why would you post ${quote} and expect normal replies 😭`,`${quote} has people doing unpaid detective work. beautiful.`]:[`why did ${detail} turn into a full investigation 😭`,`${detail} has the replies doing unpaid detective work. beautiful.`],
    rihanna:m.type==='player_post'?[`Baby, ${quote}? 😂 let them wonder.`,`I saw ${quote}. own it and stop reading every reply.`]:[`Baby, I saw ${detail}. Let them talk if they don't know the whole story 😂`,`${detail}? okay. own it and stop reading every reply.`],
    charli:m.type==='player_post'?[`lol ${quote} is already becoming lore. leave it`,`${quote} is very internet. unfortunately it works.`]:[`lol ${detail} is already becoming lore. do not feed it too much`,`saw ${detail}. very internet. unfortunately it works.`],
    chappell:m.type==='player_post'?[`BABE. ${quote} and then ZERO explanation? 😭`,`${quote} is camp but please keep something for yourself.`]:[`BABE. ${detail} has people writing chapters already 😭`,`${detail} is camp but keep something for yourself, please.`]
  };
  const bank=special[a.id];if(bank?.length)return bank[Math.abs(hash(`${a.id}|${m.id||m.type}|celeb159`))%bank.length];
  if(!close)return tr.private?`Saw ${detail}. Congrats — keep your head down and enjoy it.`:`I saw ${detail}. That's a good step. Congrats.`;
  if(tr.direct)return `I saw ${detail}. Good. Now decide what you actually want the next move to be.`;
  if(tr.private)return `saw ${detail}. happy for you — but you do not need to give the internet the whole story.`;
  if(tr.playful)return `I saw ${detail} 😭 be serious. what actually happened?`;
  if(tr.warm)return `I saw ${detail}. That's really exciting — how are you feeling about it?`;
  return `I saw ${detail}. Tell me how it actually felt from your side.`;
}
function mediaActorsForBeat181(m,semantic,exposure){
 if(!exposure)return[];const ids=[];
 if(semantic.kind==='tv_appearance'&&/KUWTK/i.test(semantic.subject||'')){ids.push('tmz','enews','popbase');if(Math.abs(hash(`${m.id}|people181`))%2===0)ids.push('people');}
 else if(semantic.kind==='chart_achievement')ids.push('billboard','popbase',Math.abs(hash(`${m.id}|chart181`))%2?'rollingstone':'scene-media-popcurrent');
 else if(semantic.kind==='music_release')ids.push('billboard','popbase');
 else if(semantic.kind==='award')ids.push('variety','enews');
 else {const pool=eligibleMedia157();if(pool.length)ids.push(pool[Math.abs(hash(`${m.id||m.type}|media181`))%pool.length].id)}
 return [...new Set(ids)].map(byId).filter(Boolean).slice(0,4);
}
function chooseActors159(m){
  const kernel=globalThis.SCENE_KERNEL170,fanPool=ACCOUNTS.filter(a=>a.sceneFan157),fans=[];let lastType='';
  for(let i=0;i<fanPool.length&&fans.length<2;i++){const a=fanPool[Math.abs(hash(`${m.id||m.type}|fanpick|${i}`))%fanPool.length],type=a.sceneArchetype157||'';if(fans.some(x=>x.id===a.id)||type===lastType)continue;fans.push(a);lastType=type}
  const commenters=[],seen=new Set();for(let i=0;i<80&&commenters.length<7;i++){const n=NORMAL_NPCS[Math.abs(hash(`${m.id||m.type}|commenter|${i}`))%NORMAL_NPCS.length];if(!n||seen.has(n.id))continue;seen.add(n.id);commenters.push(n)}
  const semantic=m.sceneUnderstanding166||semanticLocal166(m.text||m.title||m.choice||''),visibility=kernel?.visibility?.(m)||m.visibility||(Array.isArray(m.tags)&&m.tags.includes('public')?'public':'private'),observable=['gig','event','verified_public','verified_comment','starter_public_ripple','viral_push','story_choice'].includes(m.type)||(m.type==='player_post'&&['major-career','major-entertainment'].includes(semantic.significance)),exposure=visibility==='public'&&observable,mediaActors=mediaActorsForBeat181(m,semantic,exposure),mediaActor=mediaActors[0]||null;
  let celebrity=null;if(!['verified_public','verified_comment','starter_public_ripple'].includes(m.type)){
    const direct=m.celebrityId?byId(m.celebrityId):null,pool=[],used=new Set();for(const a of [direct,...activeCelebs157()]){if(!a||a.type!=='celeb'||used.has(a.id))continue;used.add(a.id);if(kernel&&!kernel.eligibleCelebrity(m,a))continue;pool.push(a)}
    if(pool.length){celebrity=direct&&pool.some(x=>x.id===direct.id)?direct:pool.slice().sort((x,y)=>(memoryFor(y.id).friendship||0)+(memoryFor(y.id).trust||0)-(memoryFor(x.id).friendship||0)-(memoryFor(x.id).trust||0))[0];if(celebrity){const signal=Math.abs(hash(`${m.id||m.type}|${celebrity.id}|react159`))%100,threshold=celebrity.id===m.celebrityId?90:celebrity.id===starterId157()?80:52;if(signal>=threshold)celebrity=null}}
  }
  return {fans,commenters,mediaActor,mediaActors,celebrity};
}
function npcComment159(n,text){return{id:'scene-ai-comment159-'+now157()+Math.random(),fan:true,npcId:n.id,name:n.name,handle:n.handle,avatar:n.avatar||fanAvatar(n.handle),text:String(text||'').slice(0,220),createdAt:now157()-rand(300,18000),likes:rand(0,Math.max(4,Math.floor((state.player?.fame||0)/4)+4)),replies:[],sceneAi159:true}}
function attachComment159(post,n,text,sourceBeat=null){if(!post||!n||!text)return false;post.comments=post.comments||[];if(threadCommentTooClose189(post,text))return false;{const cm=npcComment159(n,text),sk=spc230c().get(text);if(sk){cm.special230=sk;spc230c().delete(text)}post.comments.push(cm)}try{if(sourceBeat)globalThis.SCENE_KERNEL170?.recordNpcReaction?.(n.id,sourceBeat,text)}catch{}return true}
function rewardCeleb159(a,m,line,publicImpact=true){
  if(!a||!line)return 0;const rel=memoryFor(a.id),gain=publicImpact?Math.max(5,Math.min(850,Math.round(Math.sqrt(Math.max(1000,a.reach||1000))/45)+Math.round((rel.friendship||0)/2))):0;
  if(gain)state.player.followers+=gain;state.player.xp+=3;if(publicImpact&&(a.reach||0)>=50000000)state.player.fame+=1;const score=globalThis.SCENE_KERNEL170?.scoreChange?.(a.id,m,{publicImpact,line})||null;
  remember('scene_celeb_reaction',{celebrityId:a.id,celebrity:a.name,sourceType:m.type,sourceId:m.id,followers:gain,xp:3,text:line,public:publicImpact,scoreChange:score||null});
  addNotif(`${a.name} reacted to what you did: “${String(line).slice(0,72)}”`,publicImpact?'comment':'dm',{celebrityId:a.id,postId:m.postId||''});
  const scoreBits=score?[score.friendship?`${score.friendship>0?'+':''}${score.friendship} friendship`:'',score.trust?`${score.trust>0?'+':''}${score.trust} trust`:'',score.tension?`${score.tension>0?'+':''}${score.tension} tension`:''].filter(Boolean):[];if(publicImpact)rewardToast157(`${a.name} moved the room`,[gain?`+${gain} followers`:'','+3 XP',...scoreBits].filter(Boolean));return gain?1:0;
}
function addCelebReaction159(a,m,line,placement='comment'){
  if(!a||!line)return 0;
  if(placement==='dm'){
    const d=dmState(a.id),last=d.messages?.at(-1);if(last?.from==='them')return 0;const at=now157();d.messages.push({mid:'scene-ai-dm159-'+at,from:'them',text:line,at,kind:'scene-ai159',memoryId:m.id});d.unread=modal.dataset.dm!==a.id;d.lastInboundAt=at;d.awaitingPlayer=true;rewardCeleb159(a,m,line,false);return 0;
  }
  if(placement==='comment'&&m.postId){const p=state.posts.find(x=>x.id===m.postId);if(p){p.comments=p.comments||[];if(p.comments.some(c=>c.authorId===a.id))return 0;p.comments.unshift({id:'scene-celeb159-'+now157(),authorId:a.id,name:a.name,handle:a.handle,text:line,createdAt:now157(),verified:true,likes:rand(45,Math.max(160,Math.floor((a.reach||10000)/65000))),replies:[],sceneReaction157:a.id,sceneAi159:true});rewardCeleb159(a,m,line,true);return 1}}
  const p=addWorldPost157(a,line,m,'scene-celeb159');if(p){rewardCeleb159(a,m,line,true);return 1}return 0;
}
function recentLines159(){const out=[];for(const p of (state.posts||[]).slice(0,14)){if(p.text)out.push(p.text);for(const c of (p.comments||[]).slice(0,2))if(c.text)out.push(c.text)}return out.slice(0,24)}
function celebPayload159(a){if(!a)return null;const r=memoryFor(a.id),kernel=globalThis.SCENE_KERNEL170?.context?.(a.id),mem=kernel?.knownFacts?.length?kernel.knownFacts.slice(0,10).map(x=>`${x.type}: ${x.summary||x.title||x.text||''}`):(state.memory||[]).filter(x=>x.celebrityId===a.id||x.celebrity===a.name).slice(0,6).map(x=>`${x.type}: ${x.title||x.text||x.choice||x.outcome||''}`);return{id:a.id,name:a.name,role:a.role,bio:a.bio||'',persona:a.characterGuide137||a.personaBio||'',friendship:r.friendship||0,trust:r.trust||0,tension:r.tension||0,recognition:kernel?.recognition||0,familiarity:kernel?.familiarity||0,attention:kernel?.attention||0,knowledge:kernel?{lastSource:kernel.lastSource||'',knownFacts:(kernel.knownFacts||[]).slice(0,12)}:null,recentMemories:mem}}
function fallbackReaction159(m,ctx,actors){
  let count=0;const created=[],semantic=m.sceneUnderstanding166||semanticLocal166(m.text||m.title||m.choice||''),playerPost=m.postId?state.posts.find(x=>x.id===m.postId):null,major=['major-career','major-entertainment'].includes(semantic.significance)||['verified_public','verified_comment','starter_public_ripple'].includes(m.type);
  if(playerPost){const wanted=major?Math.min(6,actors.commenters.length):Math.min(4,actors.commenters.length);for(const n of actors.commenters.slice(0,wanted)){const line=personalCommentLine159(n,playerPost);if(attachComment159(playerPost,n,line,m)){} }}
  if(major||m.type!=='player_post'){for(const fan of actors.fans.slice(0,major?2:1)){const p=addWorldPost157(fan,fanPostLine159(fan,m),m,'scene-chatter159');if(p){created.push(p);count++}}}
  for(const outlet of (actors.mediaActors||[actors.mediaActor]).filter(Boolean)){const p=addWorldPost157(outlet,mediaLine159(outlet,m),m,'scene-news159');if(p){created.push(p);count++}}
  if(actors.celebrity)count+=addCelebReaction159(actors.celebrity,m,activeLine157(actors.celebrity,m),m.type==='player_post'?'comment':'post');
  return count;
}
async function reactBeat159(m){
  const beforePostIds=new Set((state.posts||[]).map(p=>p.id));
  const d=ensure157(),ctx=context157(m);if(!d||!ctx)return;d.worldBeats=(Number(d.worldBeats)||0)+1;d.lastReactionAt=now157();d.reactedIds.unshift(m.id);d.reactedIds=d.reactedIds.slice(0,220);m.echoed=true;m.sceneReactionQueued159=true;save();
  const actors=chooseActors159(m),semantic=semanticLocal166(m.text||m.title||m.choice||''),story=continuity159(m),relatedPeople=(semantic.people||[]).map(name=>celebs.find(a=>String(a.name||'').toLowerCase()===String(name).toLowerCase())).filter(Boolean).slice(0,6).map(a=>({id:a.id,name:a.name,role:a.role,bio:a.bio||'',persona:a.characterGuide137||a.personaBio||''})),payload={beat:{type:m.type,title:m.title||'',text:m.text||'',choice:m.choice||'',decision:m.decision||'',decisions:m.decisions||[],outcome:m.outcome||'',city:m.city||state.player.city,celebrity:m.celebrity||byId(m.celebrityId)?.name||'',visibility:globalThis.SCENE_KERNEL170?.visibility?.(m)||m.visibility||(Array.isArray(m.tags)&&m.tags.includes('private')?'private':'public')},context:{semanticHint:semantic,continuity:story,relatedPeople},player:{name:state.player.name,handle:state.player.handle,career:state.player.career,city:state.player.city,followers:state.player.followers,fame:state.player.fame,reputation:state.player.reputation,pronouns:state.player.pronouns||''},fans:actors.fans.map(a=>({id:a.id,name:a.name,handle:a.handle,archetype:a.sceneArchetype157,voice:a.sceneVoice157,city:a.city})),commenters:actors.commenters.map(n=>{const kc=globalThis.SCENE_KERNEL170?.npcContext?.(n.id,m)||{};return{id:n.id,name:n.name,handle:n.handle,personality:n.personality||'',job:n.job||'',interests:n.interests||[],cadence:n.cadence||'',affinity:Number(kc.affinity)||0,familiarity:Number(kc.familiarity)||0,recognition:Number(kc.recognition)||0,knownFacts:(kc.knownFacts||[]).slice(0,6)}}),celebrity:celebPayload159(actors.celebrity),media:actors.mediaActor?{id:actors.mediaActor.id,name:actors.mediaActor.name,role:actors.mediaActor.role,voice:MEDIA_VOICE157[actors.mediaActor.id]||actors.mediaActor.sceneMediaVoice157||actors.mediaActor.bio||''}:null,recent:recentLines159()};
  const result=null;
  let count=0;if(!result){m.sceneUnderstanding166=semantic;count=fallbackReaction159(m,ctx,actors);save();const actualPosts=(state.posts||[]).filter(p=>!beforePostIds.has(p.id)&&p.authorId!=='player');if(actualPosts.length)newPostsPill157(actualPosts);return}
  m.sceneUnderstanding166=result.understanding||semantic;
  const targets={player:m.postId?state.posts.find(x=>x.id===m.postId):null,fan0:null,fan1:null,media:null,celebrity:null},resolvedSemantic=m.sceneUnderstanding166||semantic,major=['major-career','major-entertainment'].includes(resolvedSemantic.significance)||['verified_public','verified_comment','starter_public_ripple'].includes(m.type),badSocial=/never seen .*account|clicked the page|stayed a minute|came for .*stayed|feeding me today|waiting to see what happens next|confirmed sentence|retention is the real test|audience crossover|career move changes|society continues|chose chaos via|this is exactly why i followed|early supporters are clocked in|saving this one for (?:the )?lore|good for them.? everybody starts with one room/i;
  if(major||m.type!=='player_post'){for(let i=0;i<(result.fanPosts||[]).length;i++){const fp=result.fanPosts[i],a=byId(fp.authorId);if(!a?.sceneFan157)continue;const text=badSocial.test(String(fp.text||''))||socialTooClose181(fp.text)?fanPostLine159(a,m):fp.text,p=addWorldPost157(a,text,m,'scene-chatter159');if(p){targets[`fan${i}`]=p;count++}}}
  const mediaActors=(actors.mediaActors||[actors.mediaActor]).filter(Boolean);for(let i=0;i<mediaActors.length;i++){const outlet=mediaActors[i],forceLocal=resolvedSemantic.kind==='tv_appearance'&&/KUWTK/i.test(resolvedSemantic.subject||''),aiText=i===0&&result.mediaPost&&result.mediaPost.authorId===outlet.id&&!forceLocal?result.mediaPost.text:'',text=aiText||mediaLine159(outlet,m),p=addWorldPost157(outlet,text,m,'scene-news159');if(p){if(!targets.media)targets.media=p;count++}}
  if(result.celebrityReaction&&actors.celebrity&&result.celebrityReaction.authorId===actors.celebrity.id){count+=addCelebReaction159(actors.celebrity,m,result.celebrityReaction.text,result.celebrityReaction.placement);if(result.celebrityReaction.placement==='post')targets.celebrity=state.posts[0]}
  for(const c of result.comments||[]){const n=actors.commenters.find(x=>x.id===c.npcId);if(!n)continue;const target=targets[c.target]||targets.player||targets.media||targets.fan0||targets.fan1||targets.celebrity;if(!target)continue;const forceBeatSpecific=major&&target===targets.player,needsRewrite=forceBeatSpecific||badSocial.test(String(c.text||''))||socialTooClose181(c.text)||threadCommentTooClose189(target,c.text),text=needsRewrite?personalCommentLine159(n,target):c.text;if(attachComment159(target,n,text,m))rememberSocialLine181(n,postMeaning159(target),text)}
  if(targets.player){const wanted=major?6:4;for(const n of actors.commenters){if((targets.player.comments||[]).length>=wanted)break;if((targets.player.comments||[]).some(c=>c.npcId===n.id))continue;attachComment159(targets.player,n,personalCommentLine159(n,targets.player),m)}}
  if(!count&&!targets.player&&!result.celebrityReaction)count=fallbackReaction159(m,ctx,actors);save();const actualPosts=(state.posts||[]).filter(p=>!beforePostIds.has(p.id)&&p.authorId!=='player');if(actualPosts.length)newPostsPill157(actualPosts);
}
function reactBeat157(m){void reactBeat159(m)}
const eligibleTypes157=new Set(['player_post','gig','event','travel','side_quest','verified_public','verified_comment','starter_public_ripple']);
function scanWorld157(){
  const d=ensure157();if(!d||isOpening157())return;
  const memories=(state.memory||[]).slice().reverse();
  for(const m of memories){
    if(!m?.id||m.at<d.installedAt||d.reactedIds.includes(m.id)||!eligibleTypes157.has(m.type))continue;
    if(m.type==='event'&&Array.isArray(m.tags)&&m.tags.includes('private')){d.reactedIds.push(m.id);continue}
    reactBeat157(m);break;
  }
}

function reqSatisfied157(m,d){const c=milestoneProgress157(m,d);return c.length>0&&c.every(x=>x.ok)}
function showOverlay157(kind,title,body,chips=[],button='Keep going'){
  if(document.getElementById('scene-overlay157'))return false;
  const root=document.createElement('div');root.id='scene-overlay157';root.className='scene-overlay157';
  root.innerHTML=`<div class="scene-celebrate157"><div class="scene-confetti157">${Array.from({length:18},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><div class="scene-bursticon157">${kind==='level'?'↑':'✦'}</div><small>${kind==='level'?'LEVEL UP':'MILESTONE COMPLETE'}</small><h2>${esc157(title)}</h2><p>${esc157(body)}</p><div class="scene-chiprow157">${chips.map(x=>`<span>${esc157(x)}</span>`).join('')}</div><button>${esc157(button)}</button></div>`;
  document.body.appendChild(root);root.querySelector('button').onclick=()=>root.remove();return true;
}
function checkLevel157(){
  const d=ensure157();if(!d)return;
  const li=levelInfo157();
  if(li.level<=d.lastLevel)return;
  const from=d.lastLevel,to=li.level,beforeSlots=slots157(from),afterSlots=slots157(to),points=to-from;
  d.lastLevel=to;state.player.skillPoints=(Number(state.player.skillPoints)||0)+points;
  const chips=[`+${points} skill ${points===1?'point':'points'}`,`${li.into}/${li.need} XP`];if(afterSlots>beforeSlots)chips.push(`+${afterSlots-beforeSlots} celebrity slot${afterSlots-beforeSlots===1?'':'s'}`);
  addNotif(`Level ${to} reached · +${points} skill ${points===1?'point':'points'}${afterSlots>beforeSlots?' · new celebrity slot unlocked':''}.`,'career');
  remember('scene_level_up',{level:to,from,skillPoints:points,newSlots:afterSlots-beforeSlots});
  d.pendingLevel={level:to,chips,afterSlots};save();
}
function showPending157(){
  const d=ensure157();if(!d||isOpening157()||document.getElementById('scene-overlay157')||document.querySelector('.scene-cinematic148')||modal.innerHTML.trim())return;
  if(d.pendingLevel){
    const p=d.pendingLevel;d.pendingLevel=null;save();showOverlay157('level',`Level ${p.level}`,p.afterSlots>slots157(p.level-1)?[`New level, new seat at the table. Spend your skill point, then pull another celebrity into your story.`,`Level ${p.level}! Your circle has room for one more famous face. Spend your skill point and pick who gets in.`,`Level ${p.level}, and the room just got bigger. Your skill point is waiting, and so is a new celebrity for your story.`][p.level%3]:[`You’re climbing. Put your new skill point where you want people to notice you next.`,`Level ${p.level} looks good on you. Spend your skill point on the kind of star you want to be.`,`Level ${p.level}. A quiet win is still a win. Use your skill point to shape what you’re known for.`][p.level%3],p.chips,'Continue');return;
  }
  if(d.pendingMilestone){
    const p=d.pendingMilestone;d.pendingMilestone=null;save();showOverlay157('milestone',p.title,'The game world has registered the shift. New conversations, opportunities and reactions can build from this.',p.chips,'See what happens next');
  }
}
function checkMilestone157(){
  const d=ensure157();if(!d)return;
  const idx=Math.min(d.milestoneIndex,milestoneBank157.length-1),m=milestoneBank157[idx];
  if(!m||d.completedMilestones.includes(idx)||!reqSatisfied157(m,d))return;
  d.completedMilestones.push(idx);d.milestoneIndex=Math.min(milestoneBank157.length-1,idx+1);
  applyEffect(m.reward||{});state.player.skillPoints=(Number(state.player.skillPoints)||0)+(m.skillPoints||0);
  const chips=[];if(m.reward.xp)chips.push(`+${m.reward.xp} XP`);if(m.reward.followers)chips.push(`+${fmt(m.reward.followers)} followers`);if(m.reward.fame)chips.push(`+${m.reward.fame} fame`);if(m.reward.rep)chips.push(`+${m.reward.rep} reputation`);if(m.skillPoints)chips.push(`+${m.skillPoints} skill point${m.skillPoints===1?'':'s'}`);
  remember('scene_milestone',{title:m.title,index:idx,reward:m.reward,skillPoints:m.skillPoints||0});
  addNotif(`Milestone complete: ${m.title} · ${chips.join(' · ')}.`,'career');
  d.pendingMilestone={title:m.title,chips};save();render();
}

function openCharacterPicker157(){
  const d=ensure157(),slots=slots157(),starter=starterId157();
  showSheet('Build your celebrity world',`<div class="scene-picker157"><div class="scene-picktop157"><strong>${d.activeCelebs.length}/${slots} active slots</strong><span>Everyone exists in SCENE. Your level controls how many celebrities are actively woven into your story at once.</span></div><div class="searchbox"><span>⌕</span><input id="scene-picksearch157" autocomplete="off" placeholder="Search any celebrity"></div><div id="scene-pickresults157"></div></div>`);
  const input=document.getElementById('scene-picksearch157'),out=document.getElementById('scene-pickresults157');
  const draw=()=>{
    const q=String(input.value||'').trim().toLowerCase(),activeSet=new Set(d.activeCelebs);
    let items=celebs.filter(a=>!q||String(a.name||'').toLowerCase().includes(q)||String(a.handle||'').toLowerCase().includes(q)||String(a.role||'').toLowerCase().includes(q));
    items.sort((a,b)=>(activeSet.has(b.id)?1:0)-(activeSet.has(a.id)?1:0)||Math.abs(Math.log10(Math.max(1,a.reach))-Math.log10(Math.max(1,state.player.followers)))-Math.abs(Math.log10(Math.max(1,b.reach))-Math.log10(Math.max(1,state.player.followers)))||b.reach-a.reach);
    items=items.slice(0,70);
    out.innerHTML=items.map(a=>{
      const active=activeSet.has(a.id),lockedAdd=!active&&d.activeCelebs.length>=slots;
      return `<div class="scene-pickerrow157">${av(a)}<button class="scene-pickidentity157" data-profile="${esc157(a.id)}"><strong>${esc157(a.name)} ${check()}</strong><span>${esc157(a.role)} · ${fmt(a.reach)} followers</span></button><button class="scene-picktoggle157 ${active?'on':''}" data-scene-toggle157="${esc157(a.id)}" ${a.id===starter||lockedAdd?'disabled':''}>${a.id===starter?'Starter':active?'In world':lockedAdd?'Level up':'Add'}</button></div>`;
    }).join('')||'<div class="empty">No celebrity found.</div>';
    out.querySelectorAll('[data-profile]').forEach(b=>b.onclick=()=>openProfile(b.dataset.profile));
    out.querySelectorAll('[data-scene-toggle157]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.sceneToggle157,a=byId(id);if(!a)return;
      const at=d.activeCelebs.indexOf(id);
      if(at>=0){d.activeCelebs.splice(at,1);save();draw();return}
      if(d.activeCelebs.length>=slots){flash('Level up to unlock another celebrity slot.');return}
      d.activeCelebs.push(id);const r=memoryFor(id);r.unlocked=true;r.directAccess=true;
      state.dmAccessIds=Array.isArray(state.dmAccessIds)?state.dmAccessIds:[];if(!state.dmAccessIds.includes(id))state.dmAccessIds.push(id);
      if(!state.followingIds.includes(id))state.followingIds.push(id);
      remember('scene_character_added',{celebrityId:id,celebrity:a.name,level:lvl()});addNotif(`${a.name} is now active in your SCENE world.`,'connection',{celebrityId:id});
      if(!globalThis.SCENE_BANDWIDTH_SAFE203&&a.id!=='kim')try{void globalThis.SCENE_CHARACTER135?.research?.(a)}catch{}
      save();flash(`${a.name} added to your world`);draw();
    });
  };
  input.oninput=draw;draw();setTimeout(()=>input.focus(),60);
}

const baseOpenComments187=openComments;
openComments=function(id){
 const p=state.posts.find(x=>x.id===id);if(!p)return;
 if(!Number.isFinite(Number(p._commentVisible))||Number(p._commentVisible)<1)p._commentVisible=Math.min(14,(p.comments||[]).length);
 baseOpenComments187(id);
 const sheet=modal.querySelector('.sheet'),list=modal.querySelector('#commentlist'),btn=modal.querySelector('#morecomments');if(!sheet||!list)return;
 if(btn){btn.style.display='none';btn.textContent='Refresh replies'}
 let sentinel=sheet.querySelector('#commentautosentinel189');if(!sentinel){sentinel=document.createElement('div');sentinel.id='commentautosentinel189';sentinel.className='commentautosentinel187';list.insertAdjacentElement('afterend',sentinel)}
 const snapshot=()=>({shown:Number(p._commentVisible)||0,total:Math.max(metricsFor(p).commentsTotal,threadCount(p.comments||[])),physical:(p.comments||[]).length});
 const caught=()=>{const x=snapshot();return x.shown>=x.physical&&x.total<=x.physical};
 const label=()=>{const x=snapshot();sentinel.textContent=caught()?'Replies are up to date':x.shown<x.physical?'Keep scrolling — more replies are below':'More replies load automatically';sentinel.style.display='block'};label();
 const load=()=>{
  if(now157()-(p._autoCommentAt189||0)<700)return;
  const before=Number(p._commentVisible)||0,x=snapshot();
  if(before<x.physical)p._commentVisible=Math.min(x.physical,before+8);
  else if(x.total>x.physical){const wanted=Math.min(8,Math.max(1,x.total-x.physical));for(let i=0,guard=0;i<wanted&&guard++<120;){const c=contextualFanComment(p);if(!c)break;if(threadCommentTooClose189(p,c.text))continue;p.comments.push(c);i++}ensureCommentIds(p);p._commentVisible=Math.min(p.comments.length,before+8)}
  p._autoCommentAt189=now157();save();openComments(id);
 };
 if(btn)btn.onclick=()=>openComments(id);
 const auto=()=>{if(sheet.scrollHeight-sheet.scrollTop-sheet.clientHeight<620&&!caught())load()};
 let scrollTimer189=0;const queueAuto=()=>{clearTimeout(scrollTimer189);scrollTimer189=setTimeout(auto,180)};
 sheet.addEventListener('scroll',queueAuto,{passive:true});
 requestAnimationFrame(()=>{if(sheet.scrollHeight<=sheet.clientHeight+120&&!caught())setTimeout(load,220)});
};
const basePostHtml157=postHtml;
postHtml=function(p,profile=false){
  const a=p.authorId==='player'?null:byId(p.authorId);
  if(!a?.sceneFan157)return basePostHtml157(p,profile);
  const m=metricsFor(p);
  return `<article class="post ${profile?'profilepost':''} scene-fanpost157"><div class="posthead"><button class="avatarbtn" data-scene-fan157="${esc157(a.handle)}">${av(a)}</button><div class="postbody"><div class="identity"><strong>${esc157(a.name)}</strong><span>@${esc157(a.handle)}</span><span>· ${ago(p.createdAt)}</span><button class="postmore" aria-label="More">•••</button></div><div class="posttext">${esc157(p.text)}</div>${!profile?p.comments.slice(0,1).map(c=>`<button class="commentpreview" data-comments="${p.id}"><b>@${esc157(c.handle)}</b> ${esc157(c.text)}</button>`).join(''):''}<div class="metrics"><button class="metric" data-comments="${p.id}">${ICON.comment}<span>${fmt(m.commentsTotal)}</span></button><button class="metric ${p.reposted?'reposted':''}" data-repost="${p.id}">${ICON.repost}<span>${fmt(m.reposts)}</span></button><button class="metric ${p.liked?'liked':''}" data-like="${p.id}">${ICON.heart}<span>${fmt(m.likes)}</span></button><span class="metric staticmetric">${ICON.views}<span>${fmt(m.views)}</span></span><button class="metric sharemetric" data-share="${p.id}">${ICON.share}</button></div></div></div></article>`;
};

const baseBind157=bind;
bind=function(){
  baseBind157();
  document.querySelectorAll('[data-action="add-celeb"],[data-action="scene-add-character157"]').forEach(b=>b.onclick=openCharacterPicker157);
  document.querySelectorAll('[data-scene-skill157]').forEach(b=>b.onclick=()=>{
    const d=ensure157(),key=b.dataset.sceneSkill157;if(!d||!['a','b','c'].includes(key)||(state.player.skillPoints||0)<=0)return;
    d.skills[key]=(Number(d.skills[key])||0)+1;state.player.skillPoints-=1;remember('scene_skill_up',{skill:key,value:d.skills[key]});save();render();flash('Skill upgraded');
  });
  document.querySelectorAll('[data-scene-fan157]').forEach(b=>b.onclick=e=>{e.stopPropagation();openNpcProfile(b.dataset.sceneFan157)});
};

const baseRender157=render;
render=function(){
  baseRender157();
  if(!state.player)return;
  const d=ensure157(),li=levelInfo157();
  document.querySelectorAll('.xptext').forEach(el=>el.textContent=`${li.into}/${li.need} XP`);
  document.querySelectorAll('.levelbadge').forEach(el=>el.textContent=`LVL ${li.level}`);
  document.querySelectorAll('.xptrack i').forEach(el=>el.style.width=`${li.percent}%`);
  const postPill=document.getElementById('scene-newposts157');if(state.tab!=='feed'||modal?.firstElementChild)postPill?.remove();else if((d?.newPostIds||[]).length&&!postPill)newPostsPill157([]);
};


let postPillObserver157=null;
setTimeout(()=>{try{if(!modal||postPillObserver157)return;postPillObserver157=new MutationObserver(()=>{const pill=document.getElementById('scene-newposts157');if(modal.firstElementChild){pill?.remove();return}const d=ensure157();if(state?.tab==='feed'&&(d?.newPostIds||[]).length&&!document.getElementById('scene-newposts157'))newPostsPill157([])});postPillObserver157.observe(modal,{childList:true})}catch{}},0);
function tick157(){
  if(!state?.player||document.hidden)return;
  try{ensure157();checkLevel157();checkMilestone157();scanWorld157();showPending157()}catch(e){console.warn('SCENE director157',e)}
}
setInterval(tick157,1200);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)setTimeout(tick157,120)});
setTimeout(()=>{if(state?.player){ensure157();render();tick157()}},120);
/* feedguard230: director lines go through the shared no-repeat guard (public/v224/scene-dedupe-v230.js) and the Writer
   override hook SCENE_ROSTER_LINES.feed.<slotKey>.<characterId>[] (fallback .default[]). ctx230 = the save facts in scope
   for the template ({first},{player},{handle},{place},{city},{event},{booking},{postTopic},{celeb},{day}). Rerolls vary the
   seed only; the line still lands (rewards/relationship moves unchanged). Off: window.SCENE_FEEDGUARD_OFF=true */
function ctx230(a,m){const p=state.player||{},pl=place227(m)||'',txt=String(m?.text||'').replace(/\s+/g,' ').trim(),title=String(m?.title||'').split(' · ')[0].replace(/\s+/g,' ').trim();return{first:String(a?.name||'').split(/\s+/)[0]||'',name:a?.name||'',player:String(p.name||'').split(/\s+/)[0]||'',handle:'@'+(p.handle||''),place:pl&&pl!==(m?.city||p.city)?pl:'',city:m?.city||p.city||'',event:m?.type==='gig'||m?.type==='player_post'||storyBeat230b(m)?'':title,booking:m?.type==='gig'?title:'',postTopic:m?.type==='player_post'?txt.slice(0,60):'',celeb:m?.celebrity||'',day:String(Number(state.sceneDay)||0),type:m?.type||''}}
/* feedguard230b: special-case reactions win. The KUWTK / chart #1 / tagged-project branches of the three generators set
   src230 (a source tag, not a text match); the wrapper calls the generator once first and, when it came from a special
   branch, passes ctx.special so the guard keeps that line (dedupe/reroll only) and never swaps in a Writer pool line.
   Story beats (milestone, chapter, story choice, side quest, story228/230 scenes) get {event}='' so a chapter or quest
   title never lands in "at {event}" lines. */
var src230=''; /* var: the generators run during this IIFE's own init (repair passes), before this line */
const STORY_TYPES230B=new Set(['scene_milestone','chapter_complete','story_choice','side_quest','scene_level_up','story228_scene','story230_booking']);
function storyBeat230b(m){return !!m&&(STORY_TYPES230B.has(m.type)||!!m.story228||!!m.story230||!!m.chapter)}
function specialKind230b(s){if(!s)return'';if((s.kind==='tv_appearance'||s.kind==='tv_claim')&&/KUWTK/i.test(s.subject||''))return'kuwtk';if(s.kind==='chart_achievement')return'chart1';if(s.kind==='award')return'award';return''}
/* feedguard230c: (1) special fan comments. KUWTK (majorPostComment181 / specificComment166) and chart #1 (specificComment166)
   comments are picked before the Writer comment library, rerolled only inside those banks (other personas' lines), and
   tagged comment.special230. Bank exhausted -> no comment (never a Writer/generic line). (2) award media reactions:
   SCENE_ROSTER_LINES.feed.mediaReaction.award[] (slots as WRITER_LINES.md, same filter: no {, no dangling at/from/after),
   tagged special; empty or unusable pool -> the old generic line, byte for byte. Kill switch SCENE_FEEDGUARD_OFF. */
var SPC230C; /* var + lazy: the comment generators can run during this IIFE's own init (repair passes), before this line */
function spc230c(){if(!SPC230C||SPC230C.size>200)SPC230C=new Map();return SPC230C}
function specialComment230c(n,p){try{if(!n||!p)return null;
  const maj=majorPostComment181(n,p);if(maj)return{kind:'kuwtk',text:!socialTooClose181(maj)&&!threadCommentTooClose189(p,maj)?maj:''};
  const m=postMeaning159(p),k=specialKind230b(m.semantic);if(k!=='kuwtk'&&k!=='chart1')return null;
  const own=n.personality||'casual';for(const person of [own,...['stan','skeptic','dry','kind','chaotic','culture','detective','industry','lurker','casual'].filter(x=>x!==own)]){const t=specificComment166(person,m);if(t&&!socialTooClose181(t)&&!threadCommentTooClose189(p,t))return{kind:k,text:t}}
  return{kind:k,text:''}}catch{return null}}
function specialCommentFor230c(c,p){const n=(typeof NORMAL_NPCS!=='undefined'?NORMAL_NPCS:[]).find(x=>x&&x.id===c?.npcId)||(c?{id:c.npcId,handle:c.handle,name:c.name,personality:'casual'}:null);return specialComment230c(n,p)}
function award230c(outlet,m){const G=globalThis.SCENE_FEEDGUARD230;if(!G?.fillLine||globalThis.SCENE_FEEDGUARD_OFF===true)return'';
  const P=globalThis.SCENE_ROSTER_LINES?.feed?.mediaReaction?.award;if(!Array.isArray(P))return'';const L=P.filter(x=>typeof x==='string'&&x.trim());if(!L.length)return'';
  const ctx=ctx230(outlet,m),key=String(outlet?.id||'?');if(!ctx.postTopic)ctx.postTopic=String(m?.text||m?.title||m?.choice||'').split(' · ')[0].replace(/\s+/g,' ').trim().slice(0,60); /* award beats can be nominations/events: {postTopic} = the post or event topic */const start=Math.abs(hash(`${key}|${m?.id}|award230c`))%L.length;
  for(let i=0;i<L.length;i++){const t=G.fillLine(L[(start+i)%L.length],ctx);if(t&&!G.isDup(key,t))return t}return''}
function specialPost230b(p){if(!p)return'';try{const m=sourceBeat180(p)||(state.memory||[]).find(x=>x&&x.type==='player_post'&&x.postId&&x.postId===p.id);const s=m?.sceneUnderstanding166||(p.authorId==='player'?semanticLocal166(p.text||''):null);return specialKind230b(s)}catch{return''}}
{const wrap230=(slot,raw)=>function(a,m){const G=globalThis.SCENE_FEEDGUARD230;if(!G||globalThis.SCENE_FEEDGUARD_OFF===true||!a||!m)return raw(a,m);
  src230='';const first=raw(a,m),sp=src230;src230='';const c=ctx230(a,m);if(sp)c.special=sp;
  return G.generate(slot,a.id,c,i=>{if(!i)return first;src230='';try{return raw(a,{...m,id:`${m.id}~fg${i}`})}finally{src230=''}})};
 fanPostLine159=wrap230('fanReaction',fanPostLine159);mediaLine159=wrap230('mediaReaction',mediaLine159);activeLine157=wrap230('celebReaction',activeLine157);}
globalThis.SCENE_COMMENT189={version:189,tooClose:commentTooClose189,threadTooClose:threadCommentTooClose189,intent:commentIntent189,repair:repairSocial189};
globalThis.SCENE_DIRECTOR157={version:VERSION157,specialPost230b:specialPost230b,specialComment230c:specialCommentFor230c,storyBeat230b:storyBeat230b,level:levelInfo157,slots:slots157,active:activeCelebs157,openCharacters:openCharacterPicker157,tick:tick157,narration:{beatDetail:beatDetail159,media:mediaLine159,fan:fanPostLine159,celeb:activeLine157}};
})();
