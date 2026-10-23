/* SCENE follower ladder. Counts are fictional game balances, not live social metrics. */
(()=>{
'use strict';
if(globalThis.SCENE_PEOPLE128)return;
const seeds=[["Searows","Singer-songwriter"],["Gia Ford","Singer-songwriter"],["Hannah Jadagu","Singer-songwriter"],["Squirrel Flower","Singer-songwriter"],["Anna B Savage","Singer-songwriter"],["Katy J Pearson","Singer-songwriter"],["Lime Garden","Indie band"],["English Teacher","Indie band"],["Blondshell","Singer-songwriter"],["Nieve Ella","Singer-songwriter"],["Matilda Mann","Singer-songwriter"],["Orla Gartland","Singer-songwriter"],["Dodie","Singer-songwriter"],["Lauren Aquilina","Singer-songwriter"],["Nina Nesbitt","Singer-songwriter"],["Laurel","Singer-songwriter"],["Orion Sun","Singer-songwriter"],["Arlo Parks","Singer-songwriter"],["Nilüfer Yanya","Singer-songwriter"],["Bess Atwell","Singer-songwriter"],["Rachel Chinouriri","Singer-songwriter"],["Jensen McRae","Singer-songwriter"],["Maya Hawke","Actor · musician"],["Lola Kirke","Actor · musician"],["Talia Ryder","Actor"],["Lola Tung","Actor"],["Holly Humberstone","Singer-songwriter"],["Maisie Peters","Singer-songwriter"],["Griff","Singer-songwriter"],["Rina Sawayama","Singer · actor"],["FLO","R&B group"],["Ravyn Lenae","Singer-songwriter"],["Amber Mark","Singer-songwriter"],["Joy Crookes","Singer-songwriter"],["Celeste","Singer-songwriter"],["Mahalia","Singer-songwriter"],["Nao","Singer-songwriter"],["Tinashe","Singer · dancer"],["Victoria Monét","Singer-songwriter"],["Remi Wolf","Singer-songwriter"],["Dora Jar","Singer-songwriter"],["Samia","Singer-songwriter"],["Lizzy McAlpine","Singer-songwriter"],["ROLE MODEL","Singer-songwriter"],["Omar Apollo","Singer-songwriter"],["Conan Gray","Singer-songwriter"],["Wallows","Indie band"],["Clairo","Singer-songwriter"],["Beabadoobee","Singer-songwriter"],["Faye Webster","Singer-songwriter"],["Ethel Cain","Singer-songwriter"],["Troye Sivan","Singer · actor"],["Reneé Rapp","Singer · actor"],["Dove Cameron","Singer · actor"],["Sofia Wylie","Actor · dancer"],["Sofia Carson","Actor · singer"],["Joshua Bassett","Actor · singer"],["Kit Connor","Actor"],["Joe Locke","Actor"],["Gavin Casalegno","Actor"],["Gigi Hadid","Model"],["Bella Hadid","Model"],["Naomi Campbell","Supermodel"],["Adut Akech","Model"]];
const rosterState128=state;
const previouslyOpen=state.player?celebs.filter(a=>!a.custom&&canAccess(a)).map(a=>a.id):[];
const additions=[];
seeds.forEach(([name,role],i)=>{
 const id='scene-rising-'+String(i+1).padStart(2,'0');
 if(byId(id))return;
 const reach=i<26?1200+i*1450:i<45?55000+(i-26)*24000:650000+(i-45)*320000;
 const reachOverrides={'Gigi Hadid':82000000,'Bella Hadid':61000000,'Naomi Campbell':18000000,'Adut Akech':2400000};
 const balancedReach=reachOverrides[name]||reach;
 const a={id,name,role,reach:balancedReach,type:'celeb',wiki:'',handle:name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,''),photo:'',bio:role+' · SCENE profile',page:'',sceneRising128:true};
 ACCOUNTS.push(a);celebs.push(a);additions.push(a);
 if(globalThis.SCENE_CELEB_EDITOR111)globalThis.SCENE_CELEB_EDITOR111.apply(a);
 const music=/Singer|band|group|musician/.test(role);
 PERSONA[id]={posts:music?[
 'the '+['first','second','last'][i%3]+' take is the one. I knew it.',
 ['someone sang the quiet part back tonight. still thinking about it.','soundcheck was chaos. somehow the show made sense.','putting the demo away until morning before I ruin it.','small room, extremely loud people. thank you.'][i%4]
 ]:['back to the audition tape. one more version.','the call time was brutal. the scene was worth it.'],
 dm:[music?'send me the rough version. I like hearing where it started.':'what was the scene like?','wait, how did that conversation end?']};
});

// v133: one shared celebrity universe across every career. These are simulated SCENE follower totals,
// deliberately balanced for gameplay rather than live social-media counts.
const universeSeeds133=[
 ['scene-u-angelina','Angelina Jolie','Actor · filmmaker',182000000],['scene-u-brad','Brad Pitt','Actor · producer',156000000],['scene-u-aniston','Jennifer Aniston','Actor · producer',138000000],['scene-u-tomholland','Tom Holland','Actor',167000000],['scene-u-annehathaway','Anne Hathaway','Actor',121000000],['scene-u-liamhemsworth','Liam Hemsworth','Actor',72000000],['scene-u-chrishemsworth','Chris Hemsworth','Actor',148000000],['scene-u-florencepugh','Florence Pugh','Actor',61000000],['scene-u-jennaortega','Jenna Ortega','Actor',126000000],['scene-u-jacobelordi','Jacob Elordi','Actor',58000000],['scene-u-emmastone','Emma Stone','Actor · producer',104000000],['scene-u-ryangosling','Ryan Gosling','Actor',97000000],['scene-u-leonardo','Leonardo DiCaprio','Actor · producer',144000000],['scene-u-scarlett','Scarlett Johansson','Actor · producer',132000000],['scene-u-viola','Viola Davis','Actor · producer',54000000],['scene-u-anya','Anya Taylor-Joy','Actor',63000000],['scene-u-austinbutler','Austin Butler','Actor',47000000],['scene-u-paulmescal','Paul Mescal','Actor',31000000],['scene-u-cillian','Cillian Murphy','Actor',39000000],['scene-u-lupita','Lupita Nyong’o','Actor',48000000],['scene-u-jenlaw','Jennifer Lawrence','Actor · producer',118000000],['scene-u-emmaroberts','Emma Roberts','Actor · producer',76000000],['scene-u-milliebobby','Millie Bobby Brown','Actor · producer',133000000],['scene-u-hunter','Hunter Schafer','Actor · model',36000000],['scene-u-lilycollins','Lily Collins','Actor · producer',59000000],
 ['scene-u-tyra','Tyra Banks','Supermodel · media personality',92000000],['scene-u-cara','Cara Delevingne','Model · actor',87000000],['scene-u-irina','Irina Shayk','Supermodel',74000000],['scene-u-winnie','Winnie Harlow','Model · entrepreneur',61000000],['scene-u-emrata','Emily Ratajkowski','Model · author',78000000],['scene-u-karlie','Karlie Kloss','Supermodel · entrepreneur',65000000],['scene-u-ashleygraham','Ashley Graham','Model · media personality',56000000],['scene-u-preciouslee','Precious Lee','Model',19000000],['scene-u-paloma','Paloma Elsesser','Model',16000000],['scene-u-anok','Anok Yai','Supermodel',33000000],['scene-u-alexconsani','Alex Consani','Model · creator',22000000],['scene-u-ameliagray','Amelia Gray','Model',24000000],['scene-u-jourdandunn','Jourdan Dunn','Supermodel',47000000],['scene-u-lindaevangelista','Linda Evangelista','Supermodel',39000000],['scene-u-cindycrawford','Cindy Crawford','Supermodel · entrepreneur',69000000],['scene-u-kaia','Kaia Gerber','Model · actor',52000000],['scene-u-iman','Iman','Supermodel · entrepreneur',43000000],
 ['scene-u-mrbeast','MrBeast','Creator · entrepreneur',390000000],['scene-u-khaby','Khaby Lame','Creator',270000000],['scene-u-charlidamelio','Charli D’Amelio','Creator · media personality',250000000],['scene-u-addisonrae','Addison Rae','Creator · singer · actor',196000000],['scene-u-emmachamberlain','Emma Chamberlain','Creator · entrepreneur',91000000],['scene-u-loganpaul','Logan Paul','Creator · entrepreneur',125000000],['scene-u-jakepaul','Jake Paul','Creator · boxer',118000000],['scene-u-bretman','Bretman Rock','Creator · beauty personality',62000000],['scene-u-dixie','Dixie D’Amelio','Creator · singer',76000000],['scene-u-larray','Larray','Creator',37000000],['scene-u-drewafualo','Drew Afualo','Creator · host',28000000],['scene-u-alixearle','Alix Earle','Creator · host',42000000],['scene-u-nara','Nara Smith','Creator · model',30000000],['scene-u-wisdom','Wisdom Kaye','Creator · model',26000000],['scene-u-jamescharles','James Charles','Creator · beauty personality',68000000],['scene-u-jacksepticeye','Jacksepticeye','Creator · streamer',79000000],['scene-u-markiplier','Markiplier','Creator · filmmaker',94000000],['scene-u-ishowspeed','IShowSpeed','Creator · streamer',122000000],
 ['scene-u-ed','Ed Sheeran','Singer-songwriter',236000000],['scene-u-postmalone','Post Malone','Singer-songwriter · rapper',121000000],['scene-u-lana','Lana Del Rey','Singer-songwriter',108000000],['scene-u-travisscott','Travis Scott','Rapper · producer',168000000],['scene-u-megan','Megan Thee Stallion','Rapper · songwriter',102000000],['scene-u-usher','Usher','Singer · performer',94000000],['scene-u-aliciakeys','Alicia Keys','Singer-songwriter · producer',97000000],['scene-u-samsmith','Sam Smith','Singer-songwriter',83000000],['scene-u-tyler','Tyler, the Creator','Rapper · producer',86000000],['scene-u-lorde','Lorde','Singer-songwriter',62000000],['scene-u-rosalia','ROSALÍA','Singer-songwriter · producer',98000000],['scene-u-karolg','Karol G','Singer-songwriter',151000000],['scene-u-benson','Benson Boone','Singer-songwriter',47000000],['scene-u-gracie','Gracie Abrams','Singer-songwriter',55000000],['scene-u-burna','Burna Boy','Singer-songwriter',76000000],['scene-u-tems','Tems','Singer-songwriter',52000000],['scene-u-tyla','Tyla','Singer · performer',68000000],['scene-u-peso','Peso Pluma','Singer · rapper',74000000],['scene-u-jungkook','Jungkook','Singer',224000000],['scene-u-lisa','LISA','Singer · rapper · performer',231000000]
];
for(const [id,name,role,reach] of universeSeeds133){
 if(byId(id))continue;
 const a={id,name,role,reach,type:'celeb',wiki:'',handle:name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,''),photo:'',bio:role+' · SCENE profile',page:'',sceneUniverse133:true};
 ACCOUNTS.push(a);celebs.push(a);additions.push(a);
 const music=/singer|rapper|songwriter|musician|producer/i.test(role),acting=/actor|filmmaker/i.test(role),fashion=/model|supermodel|fashion/i.test(role),creator=/creator|streamer|media personality|host/i.test(role);
 PERSONA[id]={posts:music?['studio brain. do not ask me what time it is.','working on something. that is all you get.']:acting?['long day on set. worth it.','script pages everywhere.']:fashion?['fittings, fittings, fittings.','camera roll from work.']:creator?['posted it before I could overthink it.','the internet is being very internet today.']:GENERIC_POSTS.slice(0,2),dm:['hey, what’s up?','okay, tell me the actual story.']};
}

const industrySeeds128=[
 ['scene-ind-models-la','Vanguard Models LA','Model agency · Los Angeles','Fashion',0,4200,true,['new faces submissions are open this week. clean digitals, natural light, no overthinking.','casting teams are moving fast this month. updated books matter.']],
 ['scene-ind-booker-mara','Mara Ellis','Model booker · fashion casting','Fashion',0,3100,false,['looking for a strong walk and an even stronger attitude for a small campaign next week.','one good test shoot can change how a whole board sees you.']],
 ['scene-ind-studio-noir','Studio Noir Casting','Fashion casting · campaigns','Fashion',12,8900,true,['streetwear campaign casting this Friday. fresh faces welcome.','campaign brief just landed. clean styling, movement, personality.']],
 ['scene-ind-lena-stylist','Lena Park','Fashion stylist','Fashion',18,12700,false,['pulling looks for three very different people today. somehow the shoes are the hardest part.','good styling is knowing when to stop adding things.']],
 ['scene-ind-casting-la','Westside Casting Room','Casting office · film & television','Acting',0,2700,true,['self-tape requests are going out tonight. slate clean, sound clear, make the scene yours.','small role. two scenes. very good director. sometimes that is exactly the job you want.']],
 ['scene-ind-cd-jules','Jules Mercer','Casting director','Acting',8,5200,false,['watching tapes all afternoon. specificity beats volume every single time.','callbacks are not about doing more. they are about making the choice clearer.']],
 ['scene-ind-director-ava','Ava North','Film director','Acting',22,18100,false,['location scout today. the right room can write half the scene for you.','chemistry read tomorrow. casting is finally starting to feel real.']],
 ['scene-ind-agent-noah','Noah Finch','Talent agent · film & television','Acting',15,6400,false,['a good meeting is not a booking, but it can be the reason the booking happens later.','reading breakdowns before coffee should be illegal.']],
 ['scene-ind-ar-echo','Echo Room A&R','A&R · artist development','Music',0,7600,true,['listening day. one great demo beats ten finished songs with nothing to say.','new artist meeting this afternoon. songs first, numbers second.']],
 ['scene-ind-prod-milo','Milo Reyes','Music producer','Music',10,21400,false,['the rough vocal is still better than the polished one. annoying but true.','studio open late tonight. chasing one chorus until it finally lands.']],
 ['scene-ind-manager-ivy','Ivy Lane Management','Artist management','Music',20,9800,true,['tour support slots are being discussed. being ready matters more than being loud.','artist development is ninety percent boring planning and ten percent magic.']],
 ['scene-ind-radio-kai','Kai Mercer','Radio producer · music','Music',14,14300,false,['booking emerging acts for next week. personality matters as much as the song.','one live performance can tell you more than a month of rollout decks.']],
 ['scene-ind-creator-house','Northstar Creator House','Creator management · brands','Creator',0,11600,true,['small creator briefing tomorrow. good concepts beat follower count when the idea is actually strong.','brand list is open again. looking for people who can make an ad feel like their own content.']],
 ['scene-ind-brand-simone','Simone Vale','Brand partnerships manager','Creator',8,4700,false,['if the brief kills the creator voice, the campaign is already dead.','three tiny creators outperformed the biggest name on the last campaign. noted.']],
 ['scene-ind-social-omar','Omar Chen','Social producer · digital media','Creator',14,15300,false,['short-form shoot today. the best take was the one nobody planned.','watch time is useful. personality is still the reason people come back.']],
 ['scene-ind-pr-lucy','Lucy Hart PR','Publicist · entertainment','Creator',20,7200,true,['one good interview can do more than five forced viral moments.','media training today. please stop answering questions nobody asked.']]
];
const industry128=[];
for(const [id,name,role,career,minFame,reach,industryOrg,posts] of industrySeeds128){
 if(byId(id)){industry128.push(byId(id));continue}
 const a={id,name,role,career,minFame,reach,type:'industry',industryOrg:Boolean(industryOrg),wiki:'',handle:name.toLowerCase().replace(/[^a-z0-9]/g,''),photo:'',bio:role+' · SCENE industry connection',page:'',sceneIndustry128:true};
 ACCOUNTS.push(a);industry128.push(a);PERSONA[id]={posts,dm:[industryOrg?'send the details through and I can point you in the right direction.':'what is the actual opportunity?','what happened in the room?']};
}
function industryForCareer128(){
 const career=String(state.player?.career||'');
 return industry128.filter(a=>a.career===career).sort((a,b)=>a.minFame-b.minFame||b.reach-a.reach);
}
function syncIndustryAccess128(){
 if(!state.player)return;
 state.relations=state.relations||{};
 for(const a of industry128){
  const r=state.relations[a.id]||(state.relations[a.id]={friendship:0,trust:0,chemistry:0,tension:0,memories:[],unlocked:false,lastTopic:''});
  if(a.career===state.player.career&&(state.player.fame||0)>=a.minFame)r.unlocked=true;
 }
}
function industryRow128(a){
 const r=state.relations[a.id]||{friendship:0},open=canAccess(a),gate=Math.max(0,a.minFame-(state.player?.fame||0));
 return '<button class="person '+(open?'':'locked')+'" data-profile="'+esc(a.id)+'">'+av(a)+'<div class="grow"><strong>'+esc(a.name)+' '+check()+'</strong><span>'+esc(a.role)+'</span><div class="rel">'+fmt(a.reach)+' followers · '+(open?'Industry connection '+(r.friendship||0)+'%':gate+' fame to enter your orbit')+'</div></div><span>›</span></button>';
}
const worldPostBeforeIndustry128=worldPost;
worldPost=function(){
 syncIndustryAccess128();
 const pool=industryForCareer128().filter(canAccess);
 if(pool.length&&Math.random()<.22){
  const a=pick(pool),bank=PERSONA[a.id]?.posts||GENERIC_POSTS,p=mkPost(a,0,pick(bank),{media:false,kind:'industry-feed'});
  state.posts.unshift(p);state.posts=state.posts.slice(0,100);return;
 }
 return worldPostBeforeIndustry128();
};
function ensure128(){
 state.relations=state.relations||{};
 for(const a of additions)if(!state.relations[a.id])state.relations[a.id]={friendship:0,trust:0,chemistry:0,tension:0,memories:[],unlocked:false,lastTopic:''};
 syncIndustryAccess128();
 if(!state.peopleSections128||typeof state.peopleSections128!=='object')state.peopleSections128={};
 if(!state.peopleRoster128){
  state.dmAccessIds=Array.isArray(state.dmAccessIds)?state.dmAccessIds:[];
  for(const id of (state===rosterState128?previouslyOpen:[]))if(!state.dmAccessIds.includes(id))state.dmAccessIds.push(id);
  state.peopleRoster128=1;
 }
}
function tier128(n){return n>=10000000?'A LISTER':n>=1000000?'B LISTER':n>=100000?'C LISTER':n>=10000?'D LISTER':'NEWCOMER'}
const CAREER_ROLE128={
 Music:['singer','songwriter','musician','band','group','rapper','producer','dj','music'],
 Acting:['actor','actress','film','television','director','producer','casting'],
 Fashion:['model','fashion','designer','stylist','beauty'],
 Creator:['creator','influencer','streamer','youtuber','tiktok','media','host','podcast']
};
function careerAffinity128(a){
 const career=String(state.player?.career||'').trim(),role=String(a?.role||'').toLowerCase(),bio=String(a?.bio||'').toLowerCase(),hay=role+' '+bio,terms=CAREER_ROLE128[career]||[];
 let score=0;for(const term of terms)if(hay.includes(term))score+=4;
 // Crossover careers are useful too: actors who make music, singers who act, creators in fashion, etc.
 if(career==='Acting'&&/actor|actress|director|film|television/.test(hay))score+=7;
 if(career==='Music'&&/singer|songwriter|musician|rapper|band|producer|music/.test(hay))score+=7;
 if(career==='Fashion'&&/model|fashion|designer|stylist/.test(hay))score+=7;
 if(career==='Creator'&&/creator|influencer|host|media|streamer|youtuber|tiktok/.test(hay))score+=7;
 return score;
}
function orbit128(){
 const open=celebs.filter(canAccess),career=String(state.player?.career||'');
 return open.sort((a,b)=>careerAffinity128(b)-careerAffinity128(a)||Math.abs(Math.log10(Math.max(1,a.reach))-Math.log10(Math.max(1,state.player?.followers||1)))-Math.abs(Math.log10(Math.max(1,b.reach))-Math.log10(Math.max(1,state.player?.followers||1)))||b.reach-a.reach);
}
function ranking128(){
 const list=celebs.map(a=>({id:a.id,name:a.name,followers:Math.max(0,Number(a.reach)||0),account:a}));
 if(state.player)list.push({id:'player',name:state.player.name,followers:Math.max(0,Number(state.player.followers)||0),player:true});
 list.sort((a,b)=>b.followers-a.followers||(a.player?1:b.player?-1:a.name.localeCompare(b.name))||a.id.localeCompare(b.id));
 return list.map((a,i)=>({...a,rank:i+1,tier:tier128(a.followers)}));
}
function section128(key,title,count,body){
 return '<details class="peoplefold128" data-people-fold="'+key+'" '+(state.peopleSections128[key]?'open':'')+'><summary><span>'+title+'</span><b>'+count+'</b><i aria-hidden="true">⌄</i></summary><div class="peoplefoldbody128">'+body+'</div></details>';
}
function rankRow128(row){
 const a=row.account,p=state.player;
 return '<button class="rankrow128 '+(row.player?'is-player':'')+'" '+(row.player?'data-tab="you"':'data-profile="'+esc(a.id)+'"')+'><span class="ranknum128">#'+row.rank+'</span>'+(row.player?'<span class="avatar">'+(p.avatar?'<img src="'+esc(p.avatar)+'" alt="">':'')+'<span>'+initials(p.name)+'</span></span>':av(a))+'<span class="rankidentity128"><strong>'+esc(row.name)+(row.player?' <em>YOU</em>':'')+'</strong><small>'+row.tier+'</small></span><span class="rankfollowers128">'+fmt(row.followers)+'<small>followers</small></span></button>';
}
renderPeoplePane=function(){
 ensure128();const all=ranking128(),me=all.find(x=>x.player),topCelebs=all.filter(x=>!x.player).slice(0,100),peopleToKnow=additions.slice().sort((a,b)=>b.reach-a.reach||a.name.localeCompare(b.name)),orbit=orbit128(),industry=industryForCareer128(),ahead=me&&all[me.rank-2];
 let progress='';
 if(me){const next=me.followers<10000?10000:me.followers<100000?100000:me.followers<1000000?1000000:me.followers<10000000?10000000:null;
 progress='<div class="yourrank128"><small>YOUR POSITION · SCENE FOLLOWERS</small><strong>#'+me.rank+' <span>'+me.tier+'</span></strong><p>'+fmt(me.followers)+' followers'+(ahead?' · '+fmt(Math.max(1,ahead.followers-me.followers+1))+' to pass '+esc(ahead.name):' · You lead the list')+'</p>'+(next?'<div class="rankprogress128"><i style="width:'+Math.min(100,me.followers/next*100)+'%"></i></div><small>'+fmt(next-me.followers)+' to '+tier128(next)+'</small>':'')+'</div>';
 }
 return '<div class="peoplepane people128"><div class="worldeditbar"><div><strong>Your world</strong><span>Artists, creators and the people you are climbing past.</span></div><button class="btn secondary" data-action="add-celeb">＋ Add celebrity</button></div>'+progress+
 section128('top','Top 100 · overall most followed',topCelebs.length,'<p class="ranknote128">The 100 most-followed people in SCENE across every career — music, acting, fashion, creators and crossover stars.</p>'+(me?'<div class="rankoutside128"><small>YOUR POSITION · PINNED</small>'+rankRow128(me)+'</div>':'')+topCelebs.map(rankRow128).join(''))+
 section128('biggest','People to know · all careers',peopleToKnow.length,'<p class="ranknote128">Every celebrity added to the expanded SCENE world, across all careers. Browse anyone regardless of the career you chose.</p>'+peopleToKnow.map(a=>personHtml(a,!canAccess(a))).join(''))+
 section128('orbit','In your orbit · '+esc(state.player?.career||'Career'),orbit.length,orbit.length?'<p class="ranknote128">People closest to your career surface first, but SCENE still pulls from the full celebrity world.</p>'+orbit.map(a=>personHtml(a,false)).join(''):'<div class="empty compactempty">Your first connections start here. Build relationships and level up to meet more people.</div>')+
 section128('industry','Industry connections · '+esc(state.player?.career||'Career'),industry.length,'<p class="ranknote128">These people can matter to your career even if they are not famous. They do not compete on the Top 100 celebrity ladder.</p>'+industry.map(industryRow128).join(''))+
 section128('news','News',media.length,media.map(a=>personHtml(a,false,true)).join(''))+'</div>';
};
const priorBind=bind;
bind=function(){priorBind();document.querySelectorAll('[data-people-fold]').forEach(el=>el.ontoggle=()=>{ensure128();const key=el.dataset.peopleFold;if(state.peopleSections128[key]===el.open)return;state.peopleSections128[key]=el.open;save()})};
const priorSave=save;save=function(){ensure128();return priorSave()};
ensure128();save();
globalThis.SCENE_PEOPLE128={ranking:ranking128,tier:tier128,ensure:ensure128,added:additions.length};
if(state.player)render();
})();