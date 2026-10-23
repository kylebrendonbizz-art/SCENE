(()=>{
/* STATUS v39 — immersion/progression layer. Intentionally does not replace openDm/sendDm. */
const LADDER=[
 {name:'Unknown',fame:0,followers:0,icon:'·',reward:null,unlock:'Small local jobs and organic discovery.'},
 {name:'Local Buzz',fame:10,followers:500,icon:'✦',reward:{gems:2,money:1200,energy:20,xp:25},unlock:'Better bookings, local press and real industry invites.'},
 {name:'Emerging',fame:25,followers:2500,icon:'✧',reward:{gems:2,money:2500,energy:20,xp:35},unlock:'Verified people start recognizing your name.'},
 {name:'Rising',fame:45,followers:10000,icon:'◆',reward:{gems:3,money:5000,energy:25,xp:50},unlock:'Paparazzi can spot you and premium work opens.'},
 {name:'Breakout',fame:80,followers:50000,icon:'★',reward:{gems:4,money:10000,energy:30,xp:70},unlock:'National press, bigger campaigns and business-class perks.'},
 {name:'Famous',fame:130,followers:250000,icon:'✪',reward:{gems:5,money:25000,energy:35,xp:90},unlock:'Private events, A-list rooms and serious press attention.'},
 {name:'A-List',fame:190,followers:1000000,icon:'♛',reward:{gems:7,money:60000,energy:40,xp:120},unlock:'Private charters, major awards rooms and global campaigns.'},
 {name:'Global Icon',fame:280,followers:10000000,icon:'✹',reward:{gems:10,money:150000,energy:50,xp:180},unlock:'The world watches what you do next.'},
 {name:'Legend',fame:400,followers:50000000,icon:'♕',reward:{gems:15,money:500000,energy:50,xp:250},unlock:'You reached the top of SCENE.'}
];
const JOB_BANK={
 Music:[
  {id:'music-club',title:'Opening slot · 800-cap club',client:'NIGHTLINE',tease:'A promoter heard your name twice this week. Now they want to see if you can own a room.',energy:14,pay:[800,1600],fame:2,xp:14,rank:0},
  {id:'music-studio',title:'Late-night studio session',client:'NORTH ROOM',tease:'A producer has one free night and one unfinished record. Nobody knows if it is a hit yet.',energy:18,pay:[1100,2400],fame:3,xp:18,rank:1},
  {id:'music-feature',title:'Mystery feature request',client:'PRIVATE BRIEF',tease:'A bigger artist wants a verse. Their name stays hidden until you accept the session.',energy:22,pay:[2500,5200],fame:5,xp:24,rank:2},
  {id:'music-radio',title:'Live lounge performance',client:'CITY FM',tease:'One take. Live band. The clip could disappear — or travel everywhere.',energy:20,pay:[3000,6500],fame:6,xp:28,rank:3},
  {id:'music-festival',title:'Surprise festival replacement',client:'MAIN STAGE',tease:'Someone pulled out. You have three hours to be ready for your biggest crowd yet.',energy:30,pay:[7000,16000],fame:10,xp:42,rank:4},
  {id:'music-campaign',title:'Global headphones campaign',client:'CONFIDENTIAL BRAND',tease:'The money is serious. So is the exclusivity clause.',energy:26,pay:[18000,45000],fame:12,xp:50,rank:5}
 ],
 Acting:[
  {id:'act-ad',title:'Commercial callback',client:'CASTING ROOM B',tease:'The role is small, but the casting director remembers faces.',energy:14,pay:[900,1800],fame:2,xp:14,rank:0},
  {id:'act-cameo',title:'Streaming-series cameo',client:'CONFIDENTIAL SET',tease:'Two scenes. One famous co-star. Nobody has announced the episode.',energy:20,pay:[1800,4200],fame:4,xp:22,rank:1},
  {id:'act-read',title:'Chemistry read',client:'STUDIO LOT',tease:'You made the shortlist. What happens in this room decides who gets the role.',energy:24,pay:[2500,5500],fame:6,xp:28,rank:2},
  {id:'act-premiere',title:'Premiere host spot',client:'RED CARPET',tease:'You are not the star of the film — yet. But every camera will be live.',energy:20,pay:[3500,7800],fame:7,xp:32,rank:3},
  {id:'act-lead',title:'Lead-role screen test',client:'MAJOR STUDIO',tease:'Your team says this could change your whole career.',energy:32,pay:[9000,22000],fame:12,xp:50,rank:4},
  {id:'act-franchise',title:'Franchise offer meeting',client:'TOP FLOOR',tease:'Three films. Global press. The contract is thicker than the script.',energy:28,pay:[25000,70000],fame:14,xp:60,rank:5}
 ],
 Fashion:[
  {id:'fashion-lookbook',title:'Lookbook shoot',client:'NEW LABEL',tease:'Tiny budget. Great photographer. The images could be everywhere next month.',energy:13,pay:[700,1500],fame:2,xp:13,rank:0},
  {id:'fashion-fitting',title:'Last-minute runway fitting',client:'FASHION WEEK',tease:'A model dropped out. The look is difficult. The room is important.',energy:18,pay:[1300,3000],fame:4,xp:20,rank:1},
  {id:'fashion-beauty',title:'Beauty campaign test',client:'GLOBAL BEAUTY',tease:'They are testing three faces. Only one gets the campaign.',energy:21,pay:[2600,6200],fame:6,xp:27,rank:2},
  {id:'fashion-cover',title:'Digital cover shoot',client:'STYLE DESK',tease:'The cover line is already written. You just have to become the story.',energy:22,pay:[4000,9000],fame:8,xp:34,rank:3},
  {id:'fashion-house',title:'Fashion-house dinner',client:'PRIVATE SALON',tease:'No cameras inside. Every person at the table can change your career.',energy:24,pay:[6500,15000],fame:10,xp:42,rank:4},
  {id:'fashion-face',title:'Global ambassador meeting',client:'HERITAGE HOUSE',tease:'This is not a post. It is a multi-year deal.',energy:28,pay:[22000,60000],fame:14,xp:60,rank:5}
 ],
 Creator:[
  {id:'creator-brief',title:'First paid brand brief',client:'LOCAL BRAND',tease:'They want one post by tonight. The brief is vague enough to be dangerous.',energy:12,pay:[600,1300],fame:2,xp:13,rank:0},
  {id:'creator-podcast',title:'Podcast guest chair',client:'TRENDING NOW',tease:'They promised no gotcha questions. That usually means there is one.',energy:16,pay:[900,2200],fame:3,xp:18,rank:1},
  {id:'creator-launch',title:'Product-launch livestream',client:'BEAUTY DROP',tease:'You have twenty minutes to make the internet care.',energy:20,pay:[2200,5000],fame:5,xp:24,rank:2},
  {id:'creator-trip',title:'Mystery creator trip',client:'BOARDING PASS',tease:'Destination hidden. Guest list hidden. Cameras definitely not hidden.',energy:24,pay:[3500,8000],fame:7,xp:32,rank:3},
  {id:'creator-host',title:'Awards-week digital host',client:'LIVE DESK',tease:'One wrong question becomes a clip. One great moment becomes your career.',energy:28,pay:[7500,17000],fame:10,xp:44,rank:4},
  {id:'creator-equity',title:'Equity deal meeting',client:'FOUNDER SUITE',tease:'They do not just want your audience. They want your name on the company.',energy:24,pay:[18000,50000],fame:13,xp:55,rank:5}
 ]
};
const JOB_STEPS={
 Music:[
  {q:'The creative director asks what version of you they are getting tonight.',choices:[['Give them the polished version',1,'safe'],['Strip it back and make it intimate',2,'honest'],['Change the whole opening at the last second',3,'bold']]},
  {q:'Ten minutes before you go, a verified artist walks into the room.',choices:[['Stay focused and say hi after',2,'focus'],['Introduce yourself now',1,'network'],['Invite them to watch from side-stage',3,'moment']]},
  {q:'The crowd finally starts filming. What do you do?',choices:[['Play it exactly as rehearsed',1,'clean'],['Talk to the room and make it personal',2,'connection'],['Give them the unreleased hook',3,'viral']]}
 ],
 Acting:[
  {q:'The director asks for your first take with almost no direction.',choices:[['Play it safe and clean',1,'safe'],['Make one strong choice',2,'choice'],['Completely reinterpret the scene',3,'risk']]},
  {q:'A bigger name walks in to read opposite you.',choices:[['Match their energy',2,'chemistry'],['Try to outshine them',1,'competitive'],['Forget the room and stay in the scene',3,'craft']]},
  {q:'They ask for one final take after everyone is tired.',choices:[['Repeat your best take',1,'consistent'],['Go quieter',2,'controlled'],['Throw away the plan',3,'breakthrough']]}
 ],
 Fashion:[
  {q:'The stylist offers you the safe look or the risky sample nobody has worn.',choices:[['Take the safe look',1,'safe'],['Mix pieces from both',2,'styling'],['Wear the risky sample',3,'fashion']]},
  {q:'The photographer says the set feels too perfect.',choices:[['Keep posing',1,'clean'],['Move and let it get messy',3,'editorial'],['Ask for a lighting change',2,'control']]},
  {q:'A clip from the shoot is already being posted.',choices:[['Ask them to remove it',1,'private'],['Let it happen',2,'organic'],['Post your own better angle immediately',3,'moment']]}
 ],
 Creator:[
  {q:'The brand brief sounds exactly like every other sponsored post.',choices:[['Follow it word for word',1,'safe'],['Rewrite the hook in your voice',2,'voice'],['Throw out the brief and pitch a stunt',3,'bold']]},
  {q:'The comments start moving faster than expected.',choices:[['Stick to the script',1,'controlled'],['Answer people live',3,'community'],['Let the chaos build',2,'mystery']]},
  {q:'The brand asks for one last call-to-action.',choices:[['Give them the clean sell',1,'brand'],['Make it a joke',2,'fun'],['Turn it into a cliffhanger',3,'viral']]}
 ]
};
const TRAVEL={
 'Cape Town':{cost:900,tag:'coast',hook:'A rooftop invite is waiting if you can get there before sunset.'},
 'London':{cost:5400,tag:'fashion',hook:'A publicist says there may be a seat for you at a private dinner.'},
 'New York':{cost:7600,tag:'press',hook:'A morning-show producer wants to know if you are in town.'},
 'Paris':{cost:6900,tag:'fashion',hook:'A fitting request lands before your luggage does.'},
 'Los Angeles':{cost:8200,tag:'industry',hook:'Your manager has two meetings and refuses to tell you the second name.'},
 'Dubai':{cost:6100,tag:'luxury',hook:'A launch party is building a guest list around who arrives tonight.'}
};
const EVENT_V2=[
 {badge:'FRONT ROW',title:'They moved your seat',body:'You arrive at a fashion show expecting row four. A publicist whispers that someone important cancelled — and suddenly your name is on a front-row card.',choices:[['Take the seat like you expected it',{energy:-5,fame:5,followers:45,rep:1},'You looked completely at home. Photos of the seating chart start circulating.'],['Ask who the seat belonged to',{energy:-4,fame:2,rep:2},'You learn exactly whose radar you just entered.'],['Give the seat to someone in your circle',{energy:-3,fame:2,rep:5,followers:18},'The room remembers the gesture more than the outfit.']]},
 {badge:'AFTERPARTY',title:'The address just dropped',body:'An invite-only afterparty sends you a location with one rule: no plus-ones, no posting the address, no second chances.',choices:[['Go and work the room',{energy:-14,fame:6,followers:55,xp:8},'You leave with two numbers that matter and one photo you absolutely cannot post yet.'],['Go but stay mysterious',{energy:-10,fame:4,followers:32,rep:2},'You are seen just enough to start questions.'],['Skip it and post from home',{energy:5,followers:15,rep:1},'People assume you were somewhere more interesting anyway.']]},
 {badge:'PAPARAZZI',title:'There are cameras outside',body:'You step out and realize the photographers are not waiting for somebody else anymore.',choices:[['Give them ten seconds',{fame:6,followers:80,rep:1},'One clean set of photos hits entertainment pages before you reach the car.'],['Keep walking and say nothing',{fame:3,followers:35,rep:3},'The mystery works. The captions write themselves.'],['Turn around and use the back exit',{fame:0,rep:2,energy:-2},'No photos. Your team is relieved. The photographers are not.']]},
 {badge:'LIVE TV',title:'The interview goes off-script',body:'The host smiles and asks a question your publicist specifically told them not to ask.',choices:[['Answer with a perfect one-liner',{fame:7,followers:95,rep:2,xp:8},'The clip is online before the interview ends.'],['Redirect to your work',{fame:3,rep:4,xp:5},'You look composed. Industry people notice.'],['Say “next question”',{fame:4,followers:45,rep:-1},'The awkward silence becomes a meme. Somehow, it works.']]},
 {badge:'WARDROBE',title:'Twelve minutes to cameras',body:'The zipper breaks on the look everyone approved. Your stylist is holding safety pins and looking terrified.',choices:[['Rebuild the look on the spot',{energy:-8,fame:5,rep:3},'The emergency version photographs better than the original.'],['Wear the backup',{energy:-3,fame:2,rep:2},'Safe, clean, and nobody outside the room knows there was a crisis.'],['Make the broken look intentional',{energy:-5,fame:7,followers:75,rep:-1},'Fashion accounts argue about it all night.']]},
 {badge:'SURPRISE',title:'Someone wants you on stage',body:'Five minutes before the encore, a headliner’s manager asks if you can walk out for one song. No rehearsal. No announcement.',choices:[['Say yes immediately',{energy:-18,fame:10,followers:140,xp:12},'The crowd reaction changes your entire week.'],['Ask what song first',{energy:-12,fame:6,followers:65,xp:8},'You make the moment look effortless because you actually prepared.'],['Decline politely',{energy:4,rep:3},'You protect the bigger plan. Not every moment needs to be yours.']]},
 {badge:'BRAND DEAL',title:'The number has another zero',body:'A brand doubles the offer — but only if you agree not to work with any competitor for a year.',choices:[['Take the money',{money:18000,fame:3,rep:-1},'Your bank balance jumps. Your options shrink.'],['Counter for six months',{money:11000,fame:4,rep:3,xp:7},'They agree. Your manager sends you three exclamation marks.'],['Walk away',{fame:2,rep:5},'Word gets around that you are not desperate for every cheque.']]},
 {badge:'THE TIMELINE',title:'A verified account just noticed you',body:'A huge verified account replies to your post with one sentence. Your notifications instantly start moving faster.',choices:[['Reply immediately',{followers:120,fame:6,rep:1},'The exchange turns into the post everybody screenshots.'],['Like it and leave',{followers:60,fame:4,rep:2},'The silence makes people speculate even harder.'],['Quote it with a joke',{followers:170,fame:7,rep:0},'The joke escapes your audience and lands on everyone else’s feed.']]},
 {badge:'PRIVATE DINNER',title:'There is one empty chair',body:'Your manager says an industry dinner has one last seat. You will be the least famous person at the table.',choices:[['Take the seat',{energy:-12,fame:7,rep:3,xp:10},'You spend two hours listening — and leave with your next opportunity.'],['Bring a pitch',{energy:-14,fame:5,money:1800,xp:8},'One person asks you to send the deck tomorrow morning.'],['Say no until you are “ready”',{energy:3,rep:1},'The seat goes to somebody else. You remember that.']]},
 {badge:'RUMOUR',title:'Your name is suddenly trending',body:'A harmless photo gets paired with a completely wrong story. It is funny until real outlets start repeating it.',choices:[['Post the truth with receipts',{rep:6,fame:2,followers:25},'The correction travels almost as fast as the rumour.'],['Make a joke out of it',{fame:6,followers:95,rep:1},'The joke becomes bigger than the rumour.'],['Say nothing',{fame:3,followers:40,rep:-1},'The story burns hot for an hour and then finds somebody else.']]}
];

const QUEST_SETS=[
 [
  {id:'s0-job',text:'Book your first real job',type:'jobs',target:1,reward:{money:450,xp:12,energy:8},outcome:'Your name moves from “who?” to a real booking sheet.'},
  {id:'s0-followers',text:'Reach 250 followers',type:'followers',target:250,reward:{followers:25,xp:10,gems:1},outcome:'Your posts start escaping your friend-of-a-friend bubble.'},
  {id:'s0-posts',text:'Post twice and start a timeline',type:'posts',target:2,reward:{fame:1,xp:10,energy:8},outcome:'People finally have enough context to decide whether they care.'}
 ],[
  {id:'s1-jobs',text:'Complete 3 career jobs',type:'jobs',target:3,reward:{money:1000,xp:18,fame:1},outcome:'Local bookers start recognizing your handle before your name.'},
  {id:'s1-travel',text:'Take your first work trip',type:'travel',target:1,reward:{gems:1,xp:15,energy:12},outcome:'Your world gets bigger than one city.'},
  {id:'s1-followers',text:'Reach 1,000 followers',type:'followers',target:1000,reward:{followers:75,xp:18,fame:1},outcome:'Strangers are now showing up in your comments.'}
 ],[
  {id:'s2-verified',text:'Get noticed by 1 verified account',type:'verified',target:1,reward:{gems:1,fame:2,xp:20},outcome:'A blue check knows your name. The screenshot travels.'},
  {id:'s2-job',text:'Land a standout or viral job',type:'standout',target:1,reward:{money:1800,fame:2,xp:24},outcome:'Your team finally has a clip worth sending around.'},
  {id:'s2-followers',text:'Reach 5,000 followers',type:'followers',target:5000,reward:{followers:250,gems:1,xp:22},outcome:'Fan accounts start using your name without explaining who you are.'}
 ],[
  {id:'s3-news',text:'Get your first entertainment-news mention',type:'press',target:1,reward:{fame:3,gems:1,xp:26},outcome:'You wake up and your name is on a page you used to follow.'},
  {id:'s3-events',text:'Complete 3 live events',type:'events',target:3,reward:{money:2500,fame:2,xp:28},outcome:'You stop feeling like a guest and start feeling expected.'},
  {id:'s3-followers',text:'Reach 25K followers',type:'followers',target:25000,reward:{followers:1000,gems:2,xp:30},outcome:'The numbers are starting to look like a career.'}
 ],[
  {id:'s4-cities',text:'Be seen working in 3 cities',type:'cities',target:3,reward:{gems:2,fame:3,xp:35},outcome:'Your name starts travelling before you do.'},
  {id:'s4-verified',text:'Stack 3 verified public interactions',type:'verified',target:3,reward:{followers:2500,fame:3,xp:34},outcome:'The industry starts treating your account like part of the conversation.'},
  {id:'s4-followers',text:'Reach 100K followers',type:'followers',target:100000,reward:{gems:2,money:6000,fame:3},outcome:'You crossed into six figures. Brands stop asking if you have “an audience.”'}
 ],[
  {id:'s5-viral',text:'Create a viral career moment',type:'viral',target:1,reward:{gems:2,fame:4,xp:42},outcome:'One clip now introduces you before you walk into the room.'},
  {id:'s5-audience',text:'Reach 500K followers',type:'followers',target:500000,reward:{gems:3,money:12000,fame:4},outcome:'Half a million people can move when you post.'},
  {id:'s5-circle',text:'Build a 50% connection with a celebrity',type:'relationship',target:50,reward:{gems:2,fame:3,xp:40},outcome:'You are no longer networking. You actually know people here.'}
 ],[
  {id:'s6-follow',text:'Earn a follow from a 100M+ account',type:'alistfollow',target:1,reward:{gems:3,fame:5,xp:50},outcome:'An A-lister follows you because you earned their attention.'},
  {id:'s6-events',text:'Complete 10 live events',type:'events',target:10,reward:{money:30000,gems:3,fame:5},outcome:'Red carpets and private rooms stop feeling exceptional.'},
  {id:'s6-audience',text:'Reach 2M followers',type:'followers',target:2000000,reward:{gems:4,fame:6,xp:60},outcome:'You are now a mainstream celebrity whether you feel ready or not.'}
 ],[
  {id:'s7-cities',text:'Work across 6 SCENE cities',type:'cities',target:6,reward:{gems:4,fame:6,xp:70},outcome:'There is nowhere left where your name feels local.'},
  {id:'s7-press',text:'Stack 10 major press moments',type:'press',target:10,reward:{gems:5,fame:8,money:50000},outcome:'Entertainment media now tracks your movements by default.'},
  {id:'s7-audience',text:'Reach 25M followers',type:'followers',target:25000000,reward:{gems:6,fame:8,xp:90},outcome:'You are operating at global-star scale.'}
 ]
];
function questProgress(q){const mem=state.memory||[];if(q.type==='jobs')return state.jobsDone||0;if(q.type==='followers')return state.player.followers;if(q.type==='posts')return playerPosts().length;if(q.type==='travel')return state.travelHistory?.length||0;if(q.type==='cities')return new Set((state.travelHistory||[]).map(x=>x.city)).size;if(q.type==='verified')return mem.filter(x=>['verified_public','verified_comment','follow_back'].includes(x.type)).length;if(q.type==='events')return mem.filter(x=>x.type==='event').length;if(q.type==='press')return state.notifications.filter(x=>['mention','news'].includes(x.kind)).length;if(q.type==='standout')return mem.filter(x=>x.type==='gig'&&['standout','viral'].includes(x.outcome)).length;if(q.type==='viral')return mem.filter(x=>x.type==='gig'&&x.outcome==='viral').length;if(q.type==='relationship')return Math.max(0,...Object.values(state.relations||{}).map(r=>r.friendship||0));if(q.type==='alistfollow')return (state.followedByIds||[]).some(id=>(byId(id)?.reach||0)>=100000000)?1:0;return 0}
globalThis.questProgress227=questProgress;
function syncQuestStage(){const stage=Math.min(QUEST_SETS.length-1,ladderIndex()),defs=QUEST_SETS[stage];if(state.questStage!==stage||!Array.isArray(state.missions?.quests)||!state.missions.quests.some(q=>String(q.id||'').startsWith(`s${stage}-`))){state.questStage=stage;state.missions=state.missions||{};state.missions.quests=defs.map(q=>({...q,done:false,claimed:false,rewardLabel:effectSummary(q.reward).join(' · ')}));save()}return state.missions.quests}
progressQuests=function(){if(!state.player)return;const quests=syncQuestStage();for(const q of quests)q.done=q.done||questProgress(q)>=q.target;if(typeof autoClaimQuests227==='function')autoClaimQuests227(quests)};
claimQuest=function(id,opts){const q=state.missions.quests.find(x=>x.id===id);if(!q||!q.done||q.claimed)return;q.claimed=true;applyEffect(q.reward||{});remember('side_quest',{questId:q.id,title:q.text,reward:q.rewardLabel,outcome:q.outcome});state.events.unshift(`Side quest complete: ${q.text}`);addNotif(`Side quest complete · ${q.text} · ${q.rewardLabel}.`,'career',{questId:q.id});const all=state.missions.quests.every(x=>x.claimed);let extra='';if(all&&!state.questStageBonuses?.includes(state.questStage)){state.questStageBonuses=state.questStageBonuses||[];state.questStageBonuses.push(state.questStage);state.player.gems=(state.player.gems||0)+1;state.player.xp+=12;state.pendingEvent=pick(EVENTS);extra='Stage set cleared · +1 ◆ · a new live event unlocked.'}save();if(opts&&opts.auto)return{extra};outcomeModal('Side quest complete','MOMENTUM',q.outcome,q.reward||{},extra||'This outcome is now part of your career memory.')};
function ensureImmersionState(){
 state.immersionVersion=3;
 state.ladderClaims=state.ladderClaims||[];
 state.levelClaims=state.levelClaims||[];
 state.questStageBonuses=state.questStageBonuses||[];
 state.jobsDone=state.jobsDone||0;
 state.travelHistory=state.travelHistory||[];
 state.spotlightUntil=state.spotlightUntil||0;
 state.vipTickets=state.vipTickets||0;
 state.storySeenCount=state.storySeenCount||0;
 state.lastMilestonePopup=state.lastMilestonePopup||'';
}
function ladderIndex(){let idx=0;for(let i=1;i<LADDER.length;i++){if(state.player.fame>=LADDER[i].fame&&state.player.followers>=LADDER[i].followers)idx=i;else break}return idx}
function rankByFame(v){let n=LADDER[0].name;for(const x of LADDER)if(v>=x.fame)n=x.name;return n}
function nextLadder(){const i=ladderIndex();return LADDER[Math.min(LADDER.length-1,i+1)]}
function ladderProgress(target){if(!target||!target.fame&&!target.followers)return 100;const fp=Math.min(1,state.player.fame/Math.max(1,target.fame)),ap=Math.min(1,state.player.followers/Math.max(1,target.followers));return Math.round(Math.min(fp,ap)*100)}
function effectSummary(e={}){const out=[];if(e.money)out.push(`${e.money>0?'+':'-'}R${Math.abs(Math.round(e.money)).toLocaleString('en-ZA')}`);if(e.followers)out.push(`${e.followers>0?'+':''}${fmt(e.followers)} followers`);if(e.fame)out.push(`${e.fame>0?'+':''}${e.fame} fame`);if(e.rep)out.push(`${e.rep>0?'+':''}${e.rep} reputation`);if(e.xp)out.push(`${e.xp>0?'+':''}${e.xp} XP`);if(e.energy)out.push(`${e.energy>0?'+':''}${e.energy} energy`);if(e.gems)out.push(`${e.gems>0?'+':''}${e.gems} ◆`);return out}
function outcomeModal(title,kicker,body,e={},extra=''){
 const rewards=effectSummary(e);
 modal.innerHTML=`<div class="outcomeoverlay"><div class="outcomecard"><div class="outcomehalo">✦</div><div class="eventtag">${esc(kicker||'OUTCOME')}</div><h2>${esc(title)}</h2><p>${esc(body||'The world moved a little.')}</p>${rewards.length?`<div class="rewardburst">${rewards.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}${extra?`<div class="outcomeripple">${extra}</div>`:''}<button class="btn blue full" id="outcomecontinue">Continue</button></div></div>`;
 $('#outcomecontinue').onclick=()=>{closeModal();render()};
}
function maybePressEcho(reason,positive=true){
 if(state.player.fame<35)return false;
 const chance=Math.min(.88,.18+state.player.fame/340+(positive?.12:0));
 if(Math.random()>chance)return false;
 const outlet=pick(media),text=reason||`${state.player.name} is starting to draw attention outside their usual audience.`;
 state.posts.unshift(mkPost(outlet,0,text,{media:false,kind:'player-news'}));
 const gain=Math.max(4,Math.round(state.player.followers*.006));state.player.followers+=gain;
 addNotif(`${outlet.name} covered your latest move · +${fmt(gain)} followers.`,'mention',{celebrityId:outlet.id});
 return outlet.name;
}
function claimMilestone(i){
 const m=LADDER[i];if(!m||i===0||state.ladderClaims.includes(i))return;
 if(state.player.fame<m.fame||state.player.followers<m.followers)return flash('You have not reached this milestone yet.');
 applyEffect(m.reward||{});state.ladderClaims.push(i);state.player.xp+=15+i*4;
 remember('milestone',{stage:m.name,reward:effectSummary(m.reward).join(' · ')});
 addNotif(`${m.name} unlocked · ${effectSummary(m.reward).join(' · ')}.`,'career');
 if(i>=3)maybePressEcho(`${state.player.name} has officially entered ${m.name.toLowerCase()} territory after a fast rise online.`);
 if(i>=2)state.pendingEvent=pick(EVENTS);
 save();outcomeModal(`${m.name} unlocked`,'SOCIAL LADDER',`You are not in the same room anymore. ${m.unlock}`,m.reward,`New access: ${esc(m.unlock)}`);
}
function claimLevel(level){
 if(level<2||level>lvl()||state.levelClaims.includes(level))return;
 const reward={gems:1,money:350*level,energy:Math.min(25,8+level),xp:4};if(level%5===0)reward.gems=2;
 applyEffect(reward);state.levelClaims.push(level);remember('level_reward',{level,reward});addNotif(`Level ${level} reward claimed · ${effectSummary(reward).join(' · ')}.`,'career');save();outcomeModal(`Level ${level} reward`,'LEVEL UP','Your climb paid out. Keep the momentum moving.',reward,'Diamonds are earned through levels and major social milestones.');
}
function spendResource(kind){
 const p=state.player;
 if(kind==='energy'){
  if((p.gems||0)<1)return flash('You need 1 diamond.');p.gems--;p.energy=Math.min(100,p.energy+45);remember('diamond_energy',{amount:45});save();render();flash('◆ -1 · +45 energy');return;
 }
 if(kind==='spotlight'){
  if((p.gems||0)<2)return flash('You need 2 diamonds.');const post=playerPosts()[0];if(!post)return flash('Post something first.');p.gems-=2;post.virality=(post.virality||1)+.85;post.seedViews=(post.seedViews||0)+Math.max(60,Math.round(p.followers*.12));post.seedLikes=(post.seedLikes||0)+Math.max(2,Math.round(p.followers*.015));state.spotlightUntil=now()+30*60000;remember('spotlight_boost',{postId:post.id});addNotif('Spotlight activated on your latest post for 30 minutes.','career');save();render();flash('◆ Spotlight activated');return;
 }
 if(kind==='vip'){
  if((p.gems||0)<3)return flash('You need 3 diamonds.');p.gems-=3;state.vipTickets++;state.pendingEvent=pick(EVENTS.filter(e=>['AFTERPARTY','FRONT ROW','PRIVATE DINNER','SURPRISE'].includes(e.badge)));remember('vip_access',{event:state.pendingEvent?.title});addNotif('VIP access unlocked a premium event.','career');save();render();flash('◆ VIP invite unlocked');
 }
}

/* Fame naming now follows the visible social ladder. */
fameTier=function(v){if(state?.player&&v===state.player.fame)return LADDER[ladderIndex()].name;return rankByFame(v)};

const baseMetricsFor=metricsFor;
metricsFor=function(p){
 const m=baseMetricsFor(p);const player=p.authorId==='player';
 if(player)m.commentsTotal=threadCount(p.comments||[]);
 let shares=player?Math.round((m.reposts||0)*.55+(m.views||0)*.003):Math.round((m.reposts||0)*.7+(m.likes||0)*.012);
 if(player&&state.player.followers<180)shares=Math.min(shares,1);
 return {...m,shares:Math.max(0,shares)};
};
postHtml=function(p,profile=false){
 const a=p.authorId==='player'?{name:state.player.name,handle:state.player.handle,type:'player',photo:state.player.avatar||''}:byId(p.authorId);if(!a)return'';const m=metricsFor(p),pid=esc(p.id);
 return `<article class="post ${profile?'profilepost':''}" data-live-post="${pid}"><div class="posthead"><button class="avatarbtn" ${p.authorId==='player'?'disabled':`data-profile="${a.id}"`}>${av(a)}</button><div class="postbody"><div class="identity"><strong>${esc(a.name)}</strong>${p.authorId!=='player'||state.player.verified?check():''}<span>@${esc(a.handle)}</span><span>· ${ago(p.createdAt)}</span><button class="postmore" aria-label="More">•••</button></div><div class="posttext">${esc(p.text)}</div>${p.liveNews&&p.sourceUrl?`<a class="newssource" href="${esc(p.sourceUrl)}" target="_blank" rel="noreferrer">${esc(p.sourceName||'Current news')} ↗</a>`:''}${mediaHtml(p,profile)}${!profile?p.comments.slice(0,1).filter(Boolean).map(c=>`<button class="commentpreview" data-comments="${pid}"><b>@${esc(c.handle)}</b> ${esc(c.text)}</button>`).join(''):''}<div class="metrics"><button class="metric" data-comments="${pid}" aria-label="Reply">${ICON.comment}<span data-live-metric="comments">${fmt(m.commentsTotal)}</span></button><button class="metric ${p.reposted?'reposted':''}" data-repost="${pid}" aria-label="Repost">${ICON.repost}<span data-live-metric="reposts">${fmt(m.reposts)}</span></button><button class="metric ${p.liked?'liked':''}" data-like="${pid}" aria-label="Like">${ICON.heart}<span data-live-metric="likes">${fmt(m.likes)}</span></button><span class="metric staticmetric">${ICON.views}<span data-live-metric="views">${fmt(m.views)}</span></span><button class="metric sharemetric" data-share="${pid}" aria-label="Share">${ICON.share}<span data-live-metric="shares">${fmt(m.shares)}</span></button></div></div></div></article>`;
};
function dayLabel(ts){const d=new Date(ts),today=new Date(),t0=new Date(today.getFullYear(),today.getMonth(),today.getDate()),d0=new Date(d.getFullYear(),d.getMonth(),d.getDate()),diff=Math.round((t0-d0)/86400000);if(diff===0)return'Today';if(diff===1)return'Yesterday';if(diff<7)return d.toLocaleDateString([],{weekday:'long'});return d.toLocaleDateString([],{month:'long',day:'numeric'});}
renderFeed=function(){
 const base=state.filter==='following'?state.posts.filter(p=>p.authorId==='player'||state.followingIds.includes(p.authorId)):state.posts;
 const posts=[...base].sort((a,b)=>b.createdAt-a.createdAt);let last='',timeline='';for(const p of posts){const label=dayLabel(p.createdAt);if(label!==last){timeline+=`<div class="feedday"><span>${esc(label)}</span><i></i></div>`;last=label}timeline+=postHtml(p)}
 return `<div class="stories"><button class="storybtn addstory" data-action="addstory"><span class="avatar storyav playerstory">${initials(state.player.name)}<b>+</b></span><span>Your story</span></button>${state.stories.slice(0,15).map(s=>{const a=byId(s.authorId);return a?`<button class="storybtn ${s.seen?'seen':''}" data-story="${a.id}">${av(a,'storyav')}<span>${esc(a.name.split(' ')[0])}</span></button>`:''}).join('')}</div><div class="feedtabs"><button class="feedtab ${state.filter==='foryou'?'on':''}" data-filter="foryou">For you</button><button class="feedtab ${state.filter==='following'?'on':''}" data-filter="following">Following</button></div>${timeline||'<div class="empty">Follow people from Search and their posts will appear here.</div>'}`;
};
function refreshLiveCounts(){
 if(document.hidden)return;document.querySelectorAll('[data-live-post]').forEach(el=>{const p=state.posts.find(x=>x.id===el.dataset.livePost);if(!p)return;const m=metricsFor(p);for(const k of ['comments','reposts','likes','views','shares']){const n=el.querySelector(`[data-live-metric="${k}"]`);if(!n)continue;const v=fmt(k==='comments'?m.commentsTotal:m[k]);if(n.textContent!==v){n.textContent=v;n.classList.remove('countbump');void n.offsetWidth;n.classList.add('countbump')}}});const followerNode=document.querySelector('.youstats>div:nth-child(2) b');if(followerNode)followerNode.textContent=fmt(state.player.followers);const meta=document.querySelector('.topbar .meta');if(meta)meta.textContent=`${fmt(state.player.followers)} followers · ${fameTier(state.player.fame)} · $${Math.round(state.player.money).toLocaleString('en-US')}`;
}
globalThis.refreshLiveCounts=refreshLiveCounts;setInterval(refreshLiveCounts,1600);

const STORY_CAPTIONS={
 selfie:['hi from here','camera roll before I disappear','no makeup team no problem','quick check in','okay bye lol'],
 mirror:['the outfit made the decision','mirror said post it','five minutes before leaving','this was the backup look btw'],
 room:['home for the next 48 hours','room service and silence','do not ask what time I got in','temporary headquarters'],
 studio:['still here','one more take became six','lights off except the board','made something tonight'],
 backstage:['ten minutes to go','back here again','the quiet part before the noise','you would not believe this hallway'],
 view:['worth the flight','good morning from up here','okay this view is rude','I could stay here'],
 gym:['done. barely.','post workout proof of life','okay now I can eat','this looked easier an hour ago'],
 photo:['from earlier','camera roll','okay hi','this made the cut','one from today','no context','anyway','out for a minute','long day']
};
function storySceneFor(a,seed){const special=a.id==='justin'||a.id==='shawn'?['selfie','gym','studio','view']:a.id==='kylie'||a.id==='kendall'||a.id==='rihanna'?['selfie','mirror','room','view']:a.id==='ariana'||a.id==='miley'||a.id==='billie'?['selfie','studio','backstage','room']:['selfie','room','backstage','view','mirror'];return special[hash(a.id+seed)%special.length]}
function enhancedStory(a,offset=0){const id='s'+a.id+now()+offset,baseScene=storySceneFor(a,id),freshPhoto=realPhoto(a,'story-'+baseScene+'-'+id),scene=freshPhoto?'photo':baseScene,caption=uniqueLine(`story-${a.id}`,freshPhoto?STORY_CAPTIONS.photo:(STORY_CAPTIONS[baseScene]||GENERIC_POSTS),scene+id),positions=['low','center','corner'];return{id,authorId:a.id,createdAt:now()-offset*5*60000,caption,media:freshPhoto||'',seen:false,scene,captionPos:freshPhoto?'low':positions[hash(id)%positions.length],sticker:''}}
makeStories=function(){return ['ariana','justin','miley','kim','sabrina','rihanna','kylie','billie','kendall','zendaya','shawn'].map((id,i)=>enhancedStory(byId(id),i))};
updateStories=function(){if(Math.random()>.72)return;const a=pick(celebs),s=enhancedStory(a,0);state.stories=state.stories.filter(x=>x.authorId!==a.id);state.stories.unshift(s);state.stories=state.stories.slice(0,18);save()};
function upgradeStories(){state.stories=(state.stories||[]).map((s,i)=>{const a=byId(s.authorId);if(!a)return s;const oldScene=s.scene||storySceneFor(a,s.id||String(i));if(/unavatar\.io/i.test(String(s.media||'')))s.media='';const fresh=realPhoto(a,'story-upgrade-'+s.id);if(fresh){s.media=fresh;s.scene='photo';s.captionPos='low';s.sticker=''}else{s.media='';s.scene=oldScene;s.captionPos=s.captionPos||['low','center','corner'][hash((s.id||'')+'pos')%3];s.sticker=''}return s})}
function storyDisplayCaption39(s){const specific=new Set([...(STORY_CAPTIONS.mirror||[]),...(STORY_CAPTIONS.room||[]),...(STORY_CAPTIONS.studio||[]),...(STORY_CAPTIONS.backstage||[]),...(STORY_CAPTIONS.view||[]),...(STORY_CAPTIONS.gym||[])]);if(s.media&&specific.has(String(s.caption||'')))return STORY_CAPTIONS.photo[hash((s.id||'story')+'photo-caption')%STORY_CAPTIONS.photo.length];return s.caption||STORY_CAPTIONS.photo[hash((s.id||'story')+'fallback-caption')%STORY_CAPTIONS.photo.length]}
drawStory=function(){
 clearTimeout(storyTimer);const s=state.stories[storyIndex];if(!s)return closeModal();const a=byId(s.authorId);if(!a)return storyNext();s.seen=true;state.storySeenCount=(state.storySeenCount||0)+1;save();storyStarted=now();
 const media=`<div class="storytextback storyfallback39"></div>${s.media?`<img class="storyimage story-photo" src="${esc(s.media)}" alt="" onerror="this.remove()">`:''}`;
 modal.innerHTML=`<div class="storyscreen ${esc(s.captionPos||'low')}">${media}<div class="storyshade"></div><div class="storysegments">${state.stories.map((_,i)=>`<i class="${i<storyIndex?'done':i===storyIndex?'active':''}"><b></b></i>`).join('')}</div><button class="storyidentity" data-profile="${a.id}">${av(a)}<span><strong>${esc(a.name)} ${check()}</strong><small>${ago(s.createdAt)}${s.sticker?` · ${esc(s.sticker)}`:''}</small></span></button><button class="storyclose" aria-label="Close">×</button><button class="storytap left" id="storyprev" aria-label="Previous"></button><button class="storytap right" id="storynext" aria-label="Next"></button>${(()=>{const c=String(storyDisplayCaption39(s)||'').trim();return c?`<div class="storycaption"><span>${esc(c)}</span></div>`:''})()}<form class="storyreply" id="storyreplyform"><input id="storyreply" placeholder="Send message…"><button>Send</button></form></div>`;
 $('#storyprev').onclick=e=>{e.stopPropagation();storyIndex=Math.max(0,storyIndex-1);drawStory()};$('#storynext').onclick=e=>{e.stopPropagation();storyNext()};modal.querySelector('.storyclose').onclick=closeModal;modal.querySelector('[data-profile]').onclick=()=>openProfile(a.id);$('#storyreplyform').onsubmit=e=>{e.preventDefault();const t=$('#storyreply').value.trim();if(!t)return;if(!canAccess(a))return flash(`${a.name} has message requests limited.`);sendDm(a.id,`Replied to your story: ${t}`);flash('Reply sent');$('#storyreply').value=''};storyTimer=setTimeout(storyNext,6500)
};

/* Replace the small generic event deck with richer social-career moments. */
EVENTS.splice(0,EVENTS.length,...EVENT_V2);
function eventPeople39(text){const q=String(text||'').toLowerCase();return celebs.filter(a=>{const first=String(a.name||'').split(' ')[0].toLowerCase();return q.includes(String(a.name||'').toLowerCase())||(first.length>3&&q.includes(first))}).slice(0,5)}
function fallbackEventOutcome39(ev,scenario,response,baseEffect={},fallbackText=''){
 const low=String(response||'').toLowerCase(),privateMove=ev.visibility==='private'||/private|quiet|silence|ignore|decline|dm |message .* privately|off[- ]camera/.test(low),kind=/thank|kind|nice|support|apolog|love|respect/.test(low)?'positive':/drag|insult|ugly|hate|attack|expose|leak|fight|clap back|clapback/.test(low)?'chaotic':'mixed';
 const effects={...(baseEffect||{})};if(!effects.xp)effects.xp=privateMove?5:8;if(!Object.keys(baseEffect||{}).length){if(privateMove){effects.rep=2}else{effects.fame=1;effects.followers=Math.max(12,Math.round((state.player.followers||100)*.012))}}
 const people=eventPeople39(`${ev.title} ${scenario}`),relationships=people.map(a=>({id:a.id,friendship:kind==='positive'?3:kind==='chaotic'?-3:0,trust:privateMove?4:kind==='chaotic'?-4:1,chemistry:0,tension:kind==='chaotic'?5:privateMove?-2:1}));
 const feedPosts=[];if(!privateMove){const excerpt=String(response||'').replace(/\s+/g,' ').slice(0,110),outlet=pick(media);feedPosts.push({authorId:outlet.id,text:`${state.player.name} is getting attention after responding to ${String(scenario).replace(/\s+/g,' ').slice(0,92)} Their move: “${excerpt}”`});if(people[0])feedPosts.push({authorId:people[0].id,text:kind==='chaotic'?pick(['well that escalated.','Interesting choice.','okay then 😭']):kind==='positive'?pick(['I appreciate that.','That was actually sweet.','Respect.']):pick(['noted.','okay, I saw that.','we’ll leave it there.'])})}
 return{summary:fallbackText||`${privateMove?'You kept the moment mostly off the timeline.':'Your response lands and people start reacting to exactly what you did.'}`,tone:kind,effects,relationships,feedPosts,memoryTags:['custom_event',privateMove?'private':'public',kind]}
}
async function eventOutcome39(ev,scenario,response,baseEffect={},fallbackText=''){
 return fallbackEventOutcome39(ev,scenario,response,baseEffect,fallbackText)
}
function applyEventOutcome39(ev,scenario,response,result){
 const effect=result.effects||{};applyEffect(effect);for(const ch of result.relationships||[]){globalThis.SCENE_KERNEL170?.relationshipSignal?.(ch.id,'event_relationship',{visibility:'private',source:'immersion_event',summary:`${ev.title}: ${response}`,deltas:{friendship:ch.friendship||0,trust:ch.trust||0,chemistry:ch.chemistry||0,tension:ch.tension||0},context:{scenario,outcome:result.summary||''}})}
 let feedCount=0;for(const fp of result.feedPosts||[]){const a=byId(fp.authorId);if(!a||!fp.text)continue;const p=mkPost(a,0,String(fp.text).slice(0,280),{media:false,kind:'event-fallout'});p.comments=[];for(let i=0;i<rand(1,3);i++){const c=contextualFanComment(p);if(c)p.comments.push(c)}state.posts.unshift(p);feedCount++}
 state.posts=state.posts.slice(0,120);state.events.unshift(`${ev.title}: ${response}`);remember('event',{title:ev.title,scenario,choice:response,effect,outcome:result.summary,tags:result.memoryTags||[],custom:true});addNotif(`${ev.title} · ${effectSummary(effect).join(' · ')||'story changed'}.`,'career');state.pendingEvent=null;save();
 const rewards=effectSummary(effect),rels=(result.relationships||[]).filter(x=>Object.values(x).some(v=>typeof v==='number'&&v!==0)).slice(0,4);modal.innerHTML=`<div class="outcomeoverlay"><div class="outcomecard"><div class="outcomehalo" data-mo="1">${result.tone==='chaotic'?'🔥':'✦'}</div><div class="eventtag">${esc(ev.badge||'OUTCOME')} · ${esc(String(result.tone||'mixed').toUpperCase())}</div><h2>${esc(ev.title)}</h2><p>${esc(result.summary||'The world reacted.')}</p>${rewards.length?`<div class="rewardburst">${rewards.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:''}${rels.length?`<div class="outcomeripple">${rels.map(x=>{const a=byId(x.id);const bits=[];if(x.friendship)bits.push(`${x.friendship>0?'+':''}${x.friendship} friendship`);if(x.trust)bits.push(`${x.trust>0?'+':''}${x.trust} trust`);if(x.tension)bits.push(`${x.tension>0?'+':''}${x.tension} tension`);return `${esc(a?.name||x.id)} · ${esc(bits.join(' · '))}`}).join('<br>')}</div>`:''}<div class="outcomeripple">${feedCount?`${feedCount} new feed reaction${feedCount===1?'':'s'} now reference what you actually did.`:'This stayed mostly off the public feed.'}</div><button class="btn blue full" id="event39continue">${feedCount?'See the fallout':'Continue'}</button></div></div>`;$('#event39continue').onclick=()=>{closeModal();if(feedCount)state.tab='feed';save();render()}
}
async function resolveEvent39(ev,scenario,response,baseEffect={},fallbackText=''){
 if(!String(response||'').trim())return flash('Write a response first.');const buttons=modal.querySelectorAll('button');buttons.forEach(b=>b.disabled=true);const status=$('#eventresolving');if(status){status.classList.remove('hidden');status.textContent='The world is reacting…'}const result=await eventOutcome39(ev,scenario,response,baseEffect,fallbackText);applyEventOutcome39(ev,scenario,response,result)
}
openEvent=function(ev){
 if(!ev)return;let scenario=String(ev.body||'');showSheet(ev.badge||'Event',`<div class="eventhero immersiveevent"><div class="eventtag">${esc(ev.badge||'LIVE SITUATION')}</div><h3>${esc(ev.title)}</h3><p id="eventscenario">${esc(scenario)}</p><div class="eventstakes">Edit the situation if you want. Pick a response below or write exactly what you would do.</div><button class="ghostlink eventedit" id="eventedit" type="button">Edit scenario</button><div id="eventeditbox" class="eventcustom hidden"><textarea id="eventscenarioinput" maxlength="1200">${esc(scenario)}</textarea><button class="btn secondary full" id="eventsavescenario" type="button">Save scenario</button></div></div><div class="heading">What do you do?</div>${(ev.choices||[]).map((c,i)=>`<button class="eventchoice" data-eventchoice="${i}"><span><b>${esc(c[0])}</b><small>${effectSummary(c[1]).join(' · ')||'Story consequence'}</small></span><em>›</em></button>`).join('')}<button class="ghostlink" id="eventcustomtoggle" type="button">Write my own response</button><div id="eventcustombox" class="eventcustom hidden"><textarea id="eventcustomtext" maxlength="1000" placeholder="Type exactly what you say or do…"></textarea><button class="btn blue full" id="eventcustomsubmit" type="button">Submit response</button></div><div id="eventresolving" class="eventresolving hidden">The world is reacting…</div>`);
 $('#eventedit').onclick=()=>$('#eventeditbox').classList.toggle('hidden');$('#eventsavescenario').onclick=()=>{scenario=$('#eventscenarioinput').value.trim()||scenario;ev.body=scenario;$('#eventscenario').textContent=scenario;$('#eventeditbox').classList.add('hidden');save();flash('Event scenario updated')};$('#eventcustomtoggle').onclick=()=>{$('#eventcustombox').classList.toggle('hidden');setTimeout(()=>$('#eventcustomtext')?.focus(),60)};$('#eventcustomsubmit').onclick=()=>resolveEvent39(ev,scenario,$('#eventcustomtext').value,{},'Your custom response changes the direction of the moment.');modal.querySelectorAll('[data-eventchoice]').forEach(b=>b.onclick=()=>{const c=ev.choices[+b.dataset.eventchoice];resolveEvent39(ev,scenario,c[0],c[1]||{},c[2]||'The choice landed.')})
};

function jobBoard(){const career=state.player.career||'Music',bank=JOB_BANK[career]||JOB_BANK.Music,rank=ladderIndex(),cap=Math.min(rank+1,5),seed=new Date().toISOString().slice(0,10)+career+(state.worldDay||1),order=[...bank].sort((a,b)=>hash(seed+a.id)-hash(seed+b.id)),open=order.filter(j=>j.rank<=cap),locked=order.filter(j=>j.rank>cap).sort((a,b)=>a.rank-b.rank),visible=[...open.slice(0,3),...locked.slice(0,Math.max(0,4-Math.min(3,open.length)))].slice(0,4);return visible.map(j=>({...j,locked:j.rank>cap}))}
function allJobs(){return Object.values(JOB_BANK).flat()}
function jobById(id){return allJobs().find(x=>x.id===id)}
startGig=function(id){const g=jobById(id)||allJobs().find(x=>x.title===id);if(!g)return;if(state.player.energy<g.energy)return flash(`You need ${g.energy} energy.`);if(g.rank>ladderIndex()+1)return flash('Build more fame before this job opens.');gigSession={g,step:0,score:0,choices:[]};drawGig()};
drawGig=function(){const career=state.player.career||'Music',steps=JOB_STEPS[career]||JOB_STEPS.Music,s=steps[gigSession.step],g=gigSession.g;showSheet(g.title,`<div class="jobbrief"><div class="eventtag">${esc(g.client)} · ${gigSession.step+1}/3</div><h3>${esc(gigSession.step===0?g.tease:s.q)}</h3>${gigSession.step===0?`<p>${g.energy} energy · R${g.pay[0].toLocaleString()}–R${g.pay[1].toLocaleString()} base · choices change the outcome</p><div class="jobquestion">${esc(s.q)}</div>`:''}</div>${s.choices.map((c,i)=>`<button class="eventchoice jobchoice" data-gigchoice="${i}"><span><b>${esc(c[0])}</b><small>${i===2?'High risk · high upside':i===1?'Balanced':'Safer play'}</small></span><em>›</em></button>`).join('')}`);document.querySelectorAll('[data-gigchoice]').forEach(b=>b.onclick=()=>{const c=s.choices[+b.dataset.gigchoice];gigSession.score+=c[1];gigSession.choices.push(c[2]);gigSession.step++;gigSession.step<3?drawGig():finishGig()})};
finishGig=function(){
 const {g,score,choices}=gigSession,p=state.player;const tier=score>=8?'viral':score>=6?'standout':score>=4?'solid':'rough',mult=tier==='viral'?1.75:tier==='standout'?1.38:tier==='solid'?1:.68,pay=Math.round(rand(g.pay[0],g.pay[1])*mult),followers=Math.max(2,Math.round((10+g.fame*9+Math.sqrt(Math.max(1,p.followers))*.9)*mult)),fame=Math.max(1,Math.round(g.fame*mult)),xp=Math.round(g.xp*mult),effect={money:pay,followers,fame,xp,energy:-g.energy};if(tier==='viral'&&Math.random()<.6)effect.gems=1;
 applyEffect(effect);state.jobsDone=(state.jobsDone||0)+1;state.events.unshift(`${g.title} · ${tier} outcome`);remember('gig',{title:g.title,score,outcome:tier,pay,followers,choices,client:g.client});let ripple=tier==='rough'?'The job is done, but nobody is calling it your breakout moment.':tier==='solid'?'You did the job. The right people noticed.':tier==='standout'?'Your name is being passed around after the room cleared.':'A clip escapes the room and your notifications start moving.';let press='';if(tier==='viral'||(tier==='standout'&&p.fame>=35))press=maybePressEcho(`${p.name}'s ${g.title.toLowerCase()} is getting attention after a ${tier} showing.`);if(tier==='standout'||tier==='viral')state.pendingEvent=pick(EVENTS);addNotif(`${g.title} · ${tier.toUpperCase()} · +R${pay.toLocaleString()} · +${fmt(followers)} followers · +${fame} fame · +${xp} XP.`,'career');save();gigSession=null;outcomeModal(tier==='viral'?'That just changed things.':tier==='standout'?'You owned the room.':tier==='solid'?'Job complete.':'You survived it.',`${g.client} · ${tier.toUpperCase()}`,ripple,effect,press?`${press} posted about the moment.`:(tier==='viral'?'A premium event has appeared on your dashboard.':'Your choices were saved and can affect future DMs and opportunities.'));
};

function cityEvent(city){
 const data={
  'Cape Town':{badge:'CAPE TOWN',title:'Sunset rooftop call',body:'You have barely checked in when a stylist texts: “Rooftop. Sunset. Cameras. Be here in forty.”',choices:[['Change and go immediately',{energy:-10,fame:5,followers:42},'You arrive as the sky turns gold. The pictures look far more expensive than the booking.'],['Ask who else is there first',{energy:-5,fame:2,rep:2},'You learn exactly which introductions are worth making before you leave the hotel.'],['Skip it and take the night',{energy:12,rep:1},'No photos tonight. Your energy comes back, and tomorrow stays open.']]},
  'London':{badge:'LONDON',title:'A seat at the private table',body:'A fashion publicist has one late dinner seat in Mayfair. Nobody is posting the guest list.',choices:[['Take the seat',{energy:-11,fame:6,rep:3},'You spend the night seated between two people your team has been trying to meet for months.'],['Arrive for drinks only',{energy:-6,fame:3,followers:28},'You are seen, introduced and gone before the room gets messy.'],['Stay in and prep for work',{energy:8,xp:7},'You miss the gossip and nail the morning call time.']]},
  'New York':{badge:'NEW YORK',title:'Morning television wants you',body:'A producer can squeeze you into tomorrow’s live segment if you confirm before midnight.',choices:[['Say yes to live TV',{energy:-13,fame:7,followers:90,xp:8},'You survive live television and one answer becomes the clip of the morning.'],['Ask for a pre-tape',{energy:-8,fame:4,rep:2},'You get the exposure without the live-wire risk.'],['Pass and keep the schedule',{energy:3,rep:2},'The slot goes to somebody else. Your day stays yours.']]},
  'Paris':{badge:'PARIS',title:'The fitting moved up',body:'A couture fitting that was “maybe” is suddenly happening tonight. The sample is already waiting.',choices:[['Go straight from the airport',{energy:-14,fame:7,followers:70},'The house posts nothing — but fashion accounts somehow know you were there.'],['Ask for the first slot tomorrow',{energy:-6,fame:4,rep:3},'You arrive rested and the fitting goes perfectly.'],['Decline the fitting',{energy:5,rep:1},'The look goes to someone else. Paris keeps moving.']]},
  'Los Angeles':{badge:'LOS ANGELES',title:'The second meeting has a name',body:'Your manager finally tells you who the “mystery meeting” is with. It is a room you have wanted for months.',choices:[['Walk in with a full pitch',{energy:-12,fame:7,xp:10},'They expected a casual hello. You leave with an actual follow-up.'],['Keep it conversational',{energy:-8,fame:5,rep:3},'The meeting runs forty minutes over because nobody wants to end it.'],['Reschedule until you feel ready',{energy:4,rep:-1},'The opening exists today. Tomorrow is less certain.']]},
  'Dubai':{badge:'DUBAI',title:'The launch wants an entrance',body:'A luxury launch asks if you are coming. Then they ask what car is dropping you off.',choices:[['Make the entrance count',{energy:-10,fame:7,followers:85},'Every camera turns at the same time. The arrival becomes half the story.'],['Arrive quietly and network',{energy:-7,fame:4,rep:3},'You avoid the spectacle and leave with better contacts.'],['Skip the launch',{energy:7,rep:1},'The night moves on without you — and your energy does not disappear with it.']]}
 };
 return data[city]||pick(EVENTS);
}
travel=function(city,cost){
 const d=TRAVEL[city]||{cost:Number(cost)||1000,hook:'Something is waiting when you land.'},rank=ladderIndex(),privateUnlocked=rank>=6||state.player.fame>=190;
 showSheet(`Fly to ${city}`,`<div class="travelhero"><div class="eventtag">DEPARTING ${esc(state.player.city.toUpperCase())}</div><h3>${esc(city)}</h3><p>${esc(d.hook)}</p></div><button class="travelmode" data-mode="economy"><span><b>Economy · commercial flight</b><small>Cheapest · -8 energy · low chance of being spotted</small></span><strong>R${d.cost.toLocaleString()}</strong></button><button class="travelmode" data-mode="business"><span><b>Business class</b><small>More comfortable · -2 energy · lounge visibility</small></span><strong>R${Math.round(d.cost*1.8).toLocaleString()}</strong></button><button class="travelmode ${privateUnlocked?'':'locked'}" data-mode="private" ${privateUnlocked?'':'disabled'}><span><b>Private charter ${privateUnlocked?'':'· locked'}</b><small>${privateUnlocked?'No airport queues · +5 energy · high paparazzi interest':'Unlock at A-List'}</small></span><strong>${privateUnlocked?`R${Math.round(d.cost*6.5).toLocaleString()}`:'♛'}</strong></button>`);
 modal.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>completeTravel(city,d,b.dataset.mode));
};
function completeTravel(city,d,mode){
 const mult=mode==='private'?6.5:mode==='business'?1.8:1,cost=Math.round(d.cost*mult);if(state.player.money<cost)return flash('You do not have enough cash for this flight.');state.player.money-=cost;state.player.city=city;const energy=mode==='private'?5:mode==='business'?-2:-8;state.player.energy=clamp(state.player.energy+energy);state.player.xp+=mode==='private'?7:mode==='business'?5:3;state.travelHistory.unshift({city,mode,at:now(),cost});state.travelHistory=state.travelHistory.slice(0,30);remember('travel',{city,cost,mode});
 const fame=state.player.fame,spotChance=fame<30?.02:fame<80?.18:fame<140?.38:fame<190?.55:.72,modeBonus=mode==='private'?.16:mode==='business'?.05:0,spotted=Math.random()<Math.min(.9,spotChance+modeBonus);let followerGain=0,press='';if(spotted){followerGain=Math.max(4,Math.round(Math.sqrt(state.player.followers)*2+fame*.7));state.player.followers+=followerGain;press=pick(media).name;const outlet=media.find(x=>x.name===press)||pick(media);state.posts.unshift(mkPost(outlet,0,`${state.player.name} was spotted arriving in ${city}${mode==='private'?' by private charter':mode==='business'?' after a business-class arrival':''}. The trip has already started speculation about what comes next.`,{media:false,kind:'travel-news'}));addNotif(`${press} spotted your ${city} arrival · +${fmt(followerGain)} followers.`,'mention',{celebrityId:outlet.id})}
 state.pendingEvent=cityEvent(city);save();const effect={money:-cost,energy,xp:mode==='private'?7:mode==='business'?5:3,followers:followerGain};outcomeModal(`Landed in ${city}`,'ARRIVAL',spotted?`You made it through arrivals — but not unnoticed. ${press} already has your name in a post.`:`You landed quietly. For now. ${d.hook}`,effect,`${mode==='private'?'Private charter':mode==='business'?'Business class':'Economy commercial'} · “${state.pendingEvent.title}” is now waiting on your dashboard.`);
}

renderWorld=function(){
 ensureImmersionState();progressQuests();
 const p=state.player,rank=ladderIndex(),current=LADDER[rank],next=LADDER[Math.min(rank+1,LADDER.length-1)],nextClaim=LADDER.find((m,i)=>i>0&&!state.ladderClaims.includes(i)),ready=nextClaim&&p.fame>=nextClaim.fame&&p.followers>=nextClaim.followers,levelReady=Array.from({length:Math.max(0,lvl()-1)},(_,i)=>i+2).find(x=>!state.levelClaims.includes(x)),jobs=jobBoard(),q=state.missions.quests;
 const ladderRail=LADDER.slice(0,8).map((m,i)=>`<span class="ladderdot ${i<rank?'done':i===rank?'current':''}" title="${esc(m.name)}"><i>${m.icon}</i><small>${esc(m.name)}</small></span>`).join('');
 return `<section class="section careerpage"><div class="sectiontop"><div><div class="kicker">Career</div><h2>Climb the ladder.</h2></div><div class="skillchip">${esc(current.name)}</div></div><div class="ladderrail">${ladderRail}</div><div class="milestone starcard"><div class="eyebrow">${ready?'Milestone ready to claim':'Next social milestone'}</div><div class="starcardtop"><strong>${esc(nextClaim?.name||'Legend')}</strong><span>${nextClaim?.icon||'♕'}</span></div>${nextClaim?`<div class="milestonereqs"><span class="${p.fame>=nextClaim.fame?'met':''}">✦ ${p.fame}/${nextClaim.fame} fame</span><span class="${p.followers>=nextClaim.followers?'met':''}">◎ ${fmt(p.followers)}/${fmt(nextClaim.followers)} followers</span></div><div class="milestonebar"><i style="width:${ladderProgress(nextClaim)}%"></i></div><p>${esc(nextClaim.unlock)}</p><div class="rewardpreview">Reward · ${effectSummary(nextClaim.reward).join(' · ')}</div>${ready?`<button class="btn blue full" data-milestone="${LADDER.indexOf(nextClaim)}">Claim ${esc(nextClaim.name)}</button>`:''}`:'<p>You reached the top of SCENE.</p>'}</div>${levelReady?`<button class="levelchest" data-level-reward="${levelReady}"><span>◆</span><div><b>Level ${levelReady} reward ready</b><small>Diamonds · cash · energy</small></div><em>CLAIM</em></button>`:''}<div class="heading">Side quests</div><div class="questlist">${q.map(x=>{const progress=Math.min(questProgress(x),x.target||1);return `<div class="quest ${x.done?'done':''}"><span>${x.claimed?'✓':x.done?'★':'○'}</span><div class="grow"><div>${esc(x.text)}</div><div class="questprogress"><i style="width:${Math.min(100,(progress/Math.max(1,x.target||1))*100)}%"></i></div><small>${fmt(progress)}/${fmt(x.target||1)} · ${esc(x.rewardLabel||'')}</small>${x.done?`<em class="questoutcome">${esc(x.outcome||'')}</em>`:''}</div>${x.done&&!x.claimed?`<button class="questclaim" data-quest="${x.id}">Claim</button>`:x.claimed?'<b class="claimed">Claimed</b>':''}</div>`}).join('')}</div><div class="heading">Use your resources</div><div class="resourcegrid immersiveResources"><div class="card resourcecard"><div class="grow"><strong>Recharge</strong><small>Free +20 energy every 20 min.</small></div><button class="btn secondary" data-action="rest">Rest</button></div><div class="card resourcecard"><div class="grow"><strong>PR push ◆1</strong><small>Trade a diamond for fame + reach.</small></div><button class="btn" data-action="boost">Boost</button></div><div class="card resourcecard"><div class="grow"><strong>Energy pack ◆1</strong><small>Instant +45 energy.</small></div><button class="btn" data-resource="energy">Use</button></div><div class="card resourcecard"><div class="grow"><strong>Spotlight ◆2</strong><small>Push your latest post for 30 min.</small></div><button class="btn" data-resource="spotlight">Push</button></div><div class="card resourcecard vipresource"><div class="grow"><strong>VIP access ◆3</strong><small>Force a premium invite onto your dashboard.</small></div><button class="btn" data-resource="vip">Unlock</button></div></div><div class="heading">Opportunities · ${esc(p.city)}</div><div class="jobboard">${jobs.map(g=>`<button class="jobcard ${g.locked?'lockedjob':''}" ${g.locked?'disabled':''} ${g.locked?'':`data-gig="${g.id}"`}><div class="jobmeta"><span>${esc(g.client)}</span><b>${g.locked?'LOCKED':`${g.energy} ⚡`}</b></div><h3>${esc(g.title)}</h3><p>${esc(g.tease)}</p><div class="jobreward"><span>${g.locked?`Unlock after ${esc(LADDER[Math.max(0,g.rank-1)]?.name||'more fame')}`:`R${g.pay[0].toLocaleString()}–R${g.pay[1].toLocaleString()}`}</span><span>${g.locked?'Keep climbing':`up to +${g.fame} fame`}</span><em>${g.locked?'🔒':'Start ›'}</em></div></button>`).join('')}</div><div class="heading">Travel · choose how you arrive</div><div class="citygrid immersivecities">${Object.entries(TRAVEL).map(([city,d])=>`<button class="btn secondary citybtn" data-city="${esc(city)}" data-cost="${d.cost}" ${p.city===city?'disabled':''}><b>${esc(city)}</b><small>${p.city===city?'You are here':`from R${d.cost.toLocaleString()}`}</small><em>${esc(d.tag)}</em></button>`).join('')}</div></section>`;
};

const baseBind=bind;
bind=function(){
 baseBind();document.querySelectorAll('[data-milestone]').forEach(b=>b.onclick=()=>claimMilestone(+b.dataset.milestone));document.querySelectorAll('[data-level-reward]').forEach(b=>b.onclick=()=>claimLevel(+b.dataset.levelReward));document.querySelectorAll('[data-resource]').forEach(b=>b.onclick=()=>spendResource(b.dataset.resource));
};

/* Upgrade current save without resetting the player's stable base game. */
ensureImmersionState();upgradeStories();save();
setTimeout(()=>{try{render();refreshLiveCounts()}catch(e){console.warn('STATUS immersion render fallback',e)}},0);
})();
