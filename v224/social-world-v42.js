(()=>{
/* STATUS v42 — interconnected social-world feed. Does not touch DM plumbing. */
const SOCIAL_VERSION=4;
const baseMetricsV42=metricsFor;
const baseWorldPostV42=worldPost;
const baseBindV42=bind;

function socialNpc(handle){return npcByHandle(handle)||NORMAL_NPCS[hash(handle)%NORMAL_NPCS.length]}
function accountByHandle(handle){const h=String(handle||'').replace(/^@/,'').toLowerCase();return ACCOUNTS.find(a=>String(a.handle||'').toLowerCase()===h||String(X[a.id]||'').toLowerCase()===h)||null}
function richPostText(text){
 const safe=esc(text||'');
 return safe.replace(/(^|\s)@([A-Za-z0-9_\.]+)/g,(m,lead,h)=>{const a=accountByHandle(h);return a?`${lead}<button class="mention" data-profile="${a.id}">@${esc(h)}</button>`:`${lead}<span class="mention">@${esc(h)}</span>`});
}
function npcAvatarMarkup(n,cls=''){const src=n?.avatar||fanAvatar(n?.handle||'fan');return `<span class="avatar ${cls}"><img loading="lazy" src="${esc(src)}" alt="${esc(n?.name||'User')}" onerror="this.remove()"><span>${initials(n?.name||n?.handle||'?')}</span></span>`}
function postAuthor(p){
 if(p.authorId==='player')return {id:'player',name:state.player.name,handle:state.player.handle,type:'player',photo:state.player.avatar||''};
 if(p.npcAuthor)return {...p.npcAuthor,type:'npc'};
 return byId(p.authorId);
}
function replyFromCeleb(id,text,replies=[]){const a=typeof id==='string'?byId(id):id;if(!a)return replyFromFan(text);return{id:'sc'+now()+Math.random(),authorId:a.id,name:a.name,handle:a.handle,text,createdAt:now()-rand(1000,90000),verified:true,likes:rand(90,Math.max(300,Math.floor(a.reach/9000))),replies}}
function replyFromFan(text,handle=pick(FAN_NAMES),replies=[]){const n=socialNpc(handle);return{id:'sf'+now()+Math.random(),npcId:n.id,name:n.name,handle:n.handle,avatar:n.avatar,text,createdAt:now()-rand(800,130000),likes:rand(0,2600),replies}}
function nestedFan(text,handle=pick(FAN_NAMES)){const n=socialNpc(handle);return{id:'sn'+now()+Math.random(),npcId:n.id,name:n.name,handle:n.handle,avatar:n.avatar,text,createdAt:now()-rand(200,50000),likes:rand(0,800),replies:[]}}
function choosePair(){let a=pick(celebs),b=pick(celebs.filter(x=>x.id!==a.id));return[a,b]}
function harmlessMoment(a,b,seed=''){
 const banks=[
  {kind:'studio',main:`late studio lights and two familiar cars outside. @${b.handle} you still awake?`,news:`Spotted: ${a.name} and ${b.name} were both seen leaving the same studio within twenty minutes. Collaboration or coincidence?`,fan:`why are @${a.handle} and @${b.handle} suddenly in the same orbit 👀`},
  {kind:'fashion',main:`the fitting ran three hours late but the look was worth it.`,news:`Fashion-watch accounts noticed ${a.name} and ${b.name} were both pulled into the same private fitting block today.`,fan:`the stylists putting @${a.handle} and @${b.handle} in the same building is not a drill`},
  {kind:'dinner',main:`good dinner. better conversation. no phones needed.`,news:`Seen in the same room: ${a.name} and ${b.name} at a small industry dinner tonight. No official project has been announced.`,fan:`everyone acting normal about @${a.handle} + @${b.handle} at that dinner while I am absolutely not`},
  {kind:'backstage',main:`backstage is always where the actual night happens.`,news:`Backstage chatter picked up after ${a.name} and ${b.name} were seen talking for most of the encore.`,fan:`somebody explain why @${a.handle} and @${b.handle} were backstage together for like the entire encore 😭`},
  {kind:'social',main:`you people notice EVERYTHING 😭`,news:`A tiny social-media interaction between ${a.name} and ${b.name} has fan accounts doing detective work again.`,fan:`@${a.handle} liking @${b.handle}'s post in under 60 seconds… clocked`}
 ];return banks[hash(a.id+b.id+seed+now())%banks.length]
}
function makeInteractivePost(author,text,mins=0,opts={}){
 const p=mkPost(author,mins,text,{media:Boolean(opts.media),kind:opts.kind||'social-scene'});
 p.comments=[];p.socialScene=true;p.sceneType=opts.sceneType||opts.kind||'social';p.sceneId=opts.sceneId||('scene'+now()+Math.random());p.socialLabel=opts.label||'';p.quote=opts.quote||null;
 if(opts.media){p.media=realPhoto(author,p.id);p.autoMedia=Boolean(p.media)}
 return p;
}
function seedSceneReplies(p,a,b,moment){
 const A=a.id,B=b.id;
 const sets={
  studio:[replyFromFan(pick([`okay but if this turns into a song I need credit for emotionally preparing`,`two cars outside one studio at midnight is a press release in my eyes`,`the studio lights being on this late is all the proof I need`,`whoever parked next to who, I'm writing it down`]), 'hologram_stan'),replyFromCeleb(B,pick([`lol everyone relax. we were working.`,`it was a session. with snacks. that's it`,`you'd be bored if you saw what we actually did lol`,`we fixed one snare sound for four hours. thrilling`])),replyFromFan(pick([`“we were working” is exactly what people say before a teaser drops`,`the snacks detail has me convinced it was a long night`,`four hours on one sound means it's going on something big`,`noting the date. come back to this post in a month`]), 'softlaunchdetective'),replyFromCeleb(A,pick([`you all need hobbies 😭`,`this is why I park around the corner now`,`the comment section has better theories than my label`,`go outside. respectfully.`]))],
  fashion:[replyFromFan(pick([`the fashion accounts are about to zoom into every pixel`,`three hours late means they changed the look at least twice`,`somebody get the tailor on a podcast`,`a private fitting block with both of them is not a coincidence`]), 'culturewatch'),replyFromCeleb(B,pick([`the fitting was chaos lol`,`there were pins in places pins should not be`,`the tailor deserves an award and a nap`,`we tried on everything except patience`])),replyFromFan(pick([`I need the LOOK not the lore`,`show us one sleeve. ONE`,`describe the colour at least. a hint. anything`,`I will accept a blurry mirror pic at this point`]), 'joburggirlie'),replyFromCeleb(A,pick([`you will get the look when you get the look.`,`patience. it's worth it, I promise`,`the look is in a garment bag and the bag is staying shut`,`nope. not even a sleeve.`]))],
  dinner:[replyFromFan(pick([`the phrase “small industry dinner” has never once meant small consequences`,`no phones needed at a dinner like that means someone signed something`,`which restaurant, i just want to sit at the same table`,`dessert was ordered, i can feel it. this was a long one`]), 'thegroupchat'),replyFromCeleb(B,pick([`it was literally dinner 😭`,`we ate pasta and argued about movies. scandalous`,`the bread was the real headline`,`you know nothing about the dessert and you never will`])),replyFromFan(pick([`sure and I am literally calm`,`pasta is how every big deal starts, ask anyone`,`what movie though. this matters`,`the dessert line is the most suspicious sentence of the week`]), 'scrollingagain'),replyFromCeleb(A,pick([`no phones needed was the whole point lol`,`we put our phones in a bowl and it was lovely`,`nobody took a single photo and I'd do it again`,`the only thing announced was the dessert order`]))],
  backstage:[replyFromFan(pick([`backstage friendships are how every dangerous collab starts`,`talking through the encore means somebody missed their cue`,`who was guarding the green room door and can they talk`,`the encore was long and so was that conversation`]), 'nightshiftstan'),replyFromCeleb(B,pick([`we were talking about the SHOW lmao`,`we were rating the lighting cues, calm down`,`it was mostly about where to get food after`,`backstage is ninety percent people looking for a charger`])),replyFromFan(pick([`and what specifically about the show for 45 minutes 🤨`,`rating lighting cues for an entire encore? sure`,`the charger excuse is new. i respect it`,`where did you get food after, asking for the timeline`]), 'softlaunchdetective'),replyFromCeleb(A,pick([`detectives clock out please`,`the investigation is closed. go to bed`,`I'm muting this thread with love`,`none of you have a backstage pass and it shows`]))],
  social:[replyFromFan(pick([`I knew I was not imagining that like`,`sixty seconds is not a casual like, it's a reflex`,`screenshotted the notification before it vanished`,`the like came in before the post had ten comments`]), 'fandomarchive'),replyFromCeleb(B,pick([`it was ONE like 😭`,`my thumb slipped and now I'm in a documentary`,`I like a lot of posts. this one was good`,`please stop timing my likes with a stopwatch`])),replyFromFan(pick([`one like with excellent timing`,`a thumb doesn't slip that fast`,`“my thumb slipped” has never convinced anyone`,`the stopwatch stays running`]), 'culturewatch'),replyFromCeleb(A,pick([`this app is a surveillance state`,`I'm turning off activity status forever`,`you all would make incredible private investigators`,`not one of you is getting the full story`]))]
 };
 p.comments=(sets[moment.kind]||sets.social).map((x,i)=>{x.createdAt=p.createdAt+60000*(i+1);return x});
 // Give the first fan comment an actual mini thread so detail view feels conversational.
 if(p.comments[0])p.comments[0].replies=[nestedFan(pick([`no because the timing is what got me`,`this thread has turned into a full investigation`,`bookmarking this thread for when the news drops`,`whoever posted first deserves a finder's fee`]), 'internetresident'),replyFromCeleb(B,p.sceneType==='studio'?pick([`there is no conspiracy 😭`,`it was a work night, I swear`,`the only secret is how much coffee we drank`]):pick([`you all are too fast`,`how did you find this in four minutes`,`I posted this ten seconds ago??`]) )];
 ensureCommentIds(p);
}
function generateSocialScene(offsetMin=0){
 const [a,b]=choosePair(),moment=harmlessMoment(a,b,String(offsetMin)),sceneId='scene'+now()+Math.random();
 const style=hash(sceneId)%4;
 let main;
 if(style===0){
  main=makeInteractivePost(a,moment.main,offsetMin,{sceneId,sceneType:moment.kind,label:b?`with @${b.handle}`:'',media:Math.random()<.32});
 }else if(style===1){
  const outlet=pick(media);main=makeInteractivePost(outlet,moment.news,offsetMin,{sceneId,sceneType:moment.kind,label:'SCENE WORLD · SIMULATED',media:false,quote:{id:a.id,text:moment.main}});
 }else if(style===2){
  const n=socialNpc(pick(FAN_NAMES));main={id:'npcpost'+now()+Math.random(),authorId:'npc:'+n.handle,npcAuthor:n,text:moment.fan,createdAt:now()-offsetMin*60000,liked:false,reposted:false,comments:[],kind:'npc-social',socialScene:true,sceneId,sceneType:moment.kind,socialLabel:'FAN TIMELINE',media:'',seedSocial:seeded(sceneId,8,90)};
 }else{
  main=makeInteractivePost(b,`@${a.handle} is never beating the “shows up with an idea at the worst possible hour” allegations 😂`,offsetMin,{sceneId,sceneType:moment.kind,label:`Replying to @${a.handle}`,quote:{id:a.id,text:moment.main}});
 }
 if(main.npcAuthor){
  main.comments=[replyFromFan(pick([`I was waiting for someone to say it`,`thank god somebody posted this before me`,`we've been discussing this exact thing all afternoon`,`the group chat sends its regards`]), 'thegroupchat'),replyFromCeleb(a,pick([`the allegation is false and defamatory 😂`,`I'd like to speak to whoever runs this account`,`respectfully, delete this 😂`,`my lawyer is laughing at this, which is worse`])),replyFromCeleb(b,pick([`no comment.`,`I plead the fifth`,`I'm staying out of this one`,`👀 I saw nothing`])),replyFromFan(pick([`NO COMMENT???`,`pleading the fifth is basically a confession`,`staying out of it means they were in it`,`the 👀 is doing the talking`]), 'maincharacter404')];ensureCommentIds(main)
 }else seedSceneReplies(main,a,b,moment);
 state.posts.unshift(main);
 if(Math.random()<.42){
  const follow=makeInteractivePost(b,pick([`the internet has created a full documentary out of twenty minutes. impressive honestly.`,`you all wrote a three-act structure out of one parking spot`,`someone made a timeline with arrows. I'm framing it`,`the fan theories this week have better plots than my last script`]),Math.max(0,offsetMin-2),{sceneId,sceneType:moment.kind,label:`About the ${moment.kind} discourse`,quote:{id:main.authorId&&byId(main.authorId)?main.authorId:a.id,text:main.text}});
  follow.comments=[replyFromFan(pick([`and I watched every episode`,`the arrows were mine and I stand by them`,`credit the theorists in the liner notes`,`we're not stopping until there's a sequel`]), 'scrollingagain'),replyFromCeleb(a,pick([`season two cancelled.`,`the writers' room has been shut down`,`no sequel. not even a spin-off`,`production has wrapped, go home`])),replyFromFan(pick([`renew it immediately`,`we will crowdfund the next season`,`a cancellation is just a cliffhanger with extra steps`,`picketing outside until they bring it back`]), 'fandomarchive')];ensureCommentIds(follow);state.posts.unshift(follow)
 }
 state.posts=state.posts.slice(0,150);return main;
}

const EVERYDAY_BANK={
 Music:['trying not to overthink the bridge and immediately overthinking the bridge','airport coffee is doing all the heavy lifting today','I said one more take three takes ago','the demo was better before I touched it again','actually turned my phone off for an hour. life changing.','a very normal amount of voice notes were sent today','the vocal booth smells like throat spray and ambition','wrote a hook in the shower and sang it into my phone dripping wet','the drummer is late and the producer is pretending not to notice','tour bus wifi is a myth','the green room fruit plate is untouched as usual','soundcheck took longer than the show, somehow'],
 Acting:['early call time. suspiciously good coffee.','the scene looked easy on paper lol','spent all day pretending one hallway was five different locations','costume fitting took longer than the scene 😭','learning lines in the car like a professional','craft services has a waffle station and my willpower is gone','the director said one more and meant six','I have been in this wig for eleven hours','we shot a sunset scene at seven a.m.','my trailer has a plant now. her name is Brenda','lunch break nap in full makeup, no regrets'],
 Fashion:['the backup look ended up being the look','three fittings later and somehow we are back at option one','the shoes won. I lost.','camera roll is 90% mirrors this week','some clothes only make sense once the lights are on','the steamer and I are in a committed relationship','walked the runway in my head forty times before bed','a tailor fixed my hem in ninety seconds. hero','found a safety pin in my pocket from last season','the photographer said look natural and I forgot how faces work'],
 Creator:['I opened the comments and immediately closed the comments','this was supposed to be a quick post lol','my drafts folder needs legal representation','one clip changed the whole day','the algorithm and I are currently not speaking','filmed the same intro eleven times and kept the first','ring light died mid-sentence. we persevere','edited until the sun came up and the clip is nine seconds','my comment section is smarter than my script','took a break from posting for a day and it felt like a week']
};
function everydayText(a,seed=''){
 const role=/actor/i.test(a.role)?'Acting':/model|fashion/i.test(a.role)?'Fashion':/media|personality|entrepreneur/i.test(a.role)?'Creator':'Music';
 const bank=[...(PERSONA[a.id]?.posts||[]),...(EVERYDAY_BANK[role]||EVERYDAY_BANK.Creator)];
 return uniqueLine(`daily-${a.id}`,bank,seed+new Date().toISOString().slice(0,10));
}
function seedEverydayReplies(p,a){
 const pool=[
  replyFromFan(pick([`why is this actually relatable`,`this is my exact tuesday and I'm not famous`,`the fact that this happens to them too is healing`,`I narrated this exact problem to my coffee this morning`,`famous and still losing to the small stuff, I love it`]),pick(FAN_NAMES)),
  replyFromFan(pick([`the low-stakes post I needed today 😭`,`posting a normal day is weirdly calming`,`more posts like this and fewer announcements please`,`feeling very seen on my lunch break`,`this is the most honest post on my feed`]),pick(FAN_NAMES)),
  replyFromFan(pick([`okay but give us the rest of the story`,`there's definitely a funny ending you left out`,`what happened right after this though`,`I need the part two with photos`,`who else was there, be honest`]),pick(FAN_NAMES))
 ];
 if(Math.random()<.5){const b=pick(celebs.filter(x=>x.id!==a.id));pool.splice(1,0,replyFromCeleb(b,pick([`same honestly`,`this is so you 😂`,`you left out the funniest part`,`call me when you are done being dramatic 😭`,`I was there and it was worse than this`,`tell them what you said to the waiter 😂`,`you posted this instead of answering my text`])))}
 pool[0].replies=[nestedFan(pick([`literally like a normal person for once lol`,`famous people having small problems is my favourite genre`,`the most human thing on the app today`,`adding this to my comfort folder`]),pick(FAN_NAMES))];p.comments=pool;ensureCommentIds(p)
}
function generateEverydayPost(offsetMin=0){
 const a=pick(celebs),sceneId='daily'+now()+Math.random(),text=everydayText(a,sceneId),mention=Math.random()<.24?pick(celebs.filter(x=>x.id!==a.id)):null;
 const finalText=mention?`${text} @${mention.handle}`:text;
 const p=makeInteractivePost(a,finalText,offsetMin,{sceneId,sceneType:'everyday',label:Math.random()<.28?'FROM THEIR DAY':'',media:Math.random()<.27});seedEverydayReplies(p,a);state.posts.unshift(p);state.posts=state.posts.slice(0,150);return p
}
function generateReplyPost(offsetMin=0){
 const [a,b]=choosePair(),sceneId='reply'+now()+Math.random(),lines=[`@${b.handle} no because you know exactly what happened 😭`,`@${b.handle} you are leaving out half the story lol`,`@${b.handle} this is why I do not tell you things`,`@${b.handle} okay I will give you that one`,`@${b.handle} absolutely not putting the rest of this on the timeline`,`@${b.handle} you promised you'd never bring that up`,`@${b.handle} I'm telling everyone about the karaoke if you keep going`,`@${b.handle} this is why we're not allowed to sit together`,`@${b.handle} fine, but my version is funnier`],text=uniqueLine(`topreply-${a.id}`,lines,sceneId);
 const p=makeInteractivePost(a,text,offsetMin,{sceneId,sceneType:'reply',label:`Replying to @${b.handle}`,quote:{id:b.id,text:everydayText(b,sceneId+'q')}});
 p.comments=[replyFromCeleb(b,pick([`you started it 😭`,`oh NOW you want privacy`,`that is not how I remember it lol`,`I have screenshots.`,`the karaoke was a team effort and you know it`,`my version has witnesses`,`we agreed to take this to the grave 😭`])),replyFromFan(pick([`which story are they talking about, I need receipts`,`two famous people bickering in public is my sport`,`the history between these two goes back further than we know`,`somebody start a thread with dates`]),pick(FAN_NAMES)),replyFromFan(pick([`following both of them was the best decision I've made`,`the screenshots line is a threat and I love it`,`notifications on for this feud immediately`,`I'm making popcorn for the replies`]),pick(FAN_NAMES))];ensureCommentIds(p);state.posts.unshift(p);state.posts=state.posts.slice(0,150);return p
}
function generateNpcLifePost(offsetMin=0){
 const n=socialNpc(pick(FAN_NAMES)),sceneId='npclife'+now()+Math.random(),life=['my group chat has been arguing about one screenshot for 40 minutes','I came online for five minutes and somehow know too much','why did the coffee shop playlist eat today','my entire personality is waiting for one announcement','I need celebrities to stop posting cryptic things while I am at work','the way one like can ruin everybody’s afternoon 😭','normal day on the internet absolutely nothing is normal','my boss walked past right as I gasped at my phone','three different celebrities posted coffee today. is it a code','I muted a word and the app found a new way to show it to me','my screen time report is a cry for help','refreshed a profile so many times it asked if I was okay'];
 let text=uniqueLine(`npc-life-${n.handle}`,life,sceneId);if(Math.random()<.35){const a=pick(celebs);text+=` @${a.handle}`}
 const p={id:'npcpost'+now()+Math.random(),authorId:'npc:'+n.handle,npcAuthor:n,text,createdAt:now()-offsetMin*60000,liked:false,reposted:false,comments:[],kind:'npc-life',socialScene:true,sceneId,sceneType:'npc-life',socialLabel:'TIMELINE',media:'',seedSocial:seeded(sceneId,12,110)};
 p.comments=[replyFromFan(pick([`real unfortunately`,`this is my afternoon too`,`you said what all of us were thinking`,`logging off in solidarity. after one more scroll`]),pick(FAN_NAMES)),replyFromFan(pick([`the timeline has been insane today`,`the app is in a mood today`,`every post today is a cliffhanger`,`I've refreshed so many times my thumb hurts`]),pick(FAN_NAMES))];if(Math.random()<.22){const a=pick(celebs);p.comments.push(replyFromCeleb(a,pick([`😭`,`not me getting tagged in this`,`please leave me out of the investigation lol`,`why am I in this 😭`,`I was asleep for all of this`,`the tag is unnecessary but I'll allow it`])))}ensureCommentIds(p);state.posts.unshift(p);state.posts=state.posts.slice(0,150);return p
}
function generatePlayerOrbitPost(offsetMin=0){
 if(!state.player||state.player.fame<8)return null;const recent=playerPosts()[0],sceneId='playerorbit'+now()+Math.random();if(!recent)return null;
 const n=socialNpc(pick(FAN_NAMES)),snip=String(recent.text||'that post').replace(/\s+/g,' ').slice(0,58),text=state.player.fame<40?`okay why is @${state.player.handle}'s “${snip}” post starting to move 👀`:`everybody suddenly has an opinion about @${state.player.handle}'s latest post and nobody remembers who started it`;
 const p={id:'npcpost'+now()+Math.random(),authorId:'npc:'+n.handle,npcAuthor:n,text,createdAt:now()-offsetMin*60000,liked:false,reposted:false,comments:[],kind:'player-orbit',socialScene:true,sceneId,sceneType:'player-orbit',socialLabel:'ABOUT YOU',media:'',seedSocial:seeded(sceneId,18,130),quote:{id:null,text:recent.text}};
 p.comments=[replyFromFan(pick([`I was literally about to say this`,`saw it in three group chats before lunch`,`the quote tweets are where it really gets going`,`early to this one and proud of it`]),pick(FAN_NAMES)),replyFromFan(pick([`the comments are moving FAST`,`refreshing and there are twenty new replies`,`someone already made a meme of it`,`it's on my explore page now too`]),pick(FAN_NAMES))];ensureCommentIds(p);state.posts.unshift(p);state.posts=state.posts.slice(0,150);return p
}

metricsFor=function(p){
 if(!p?.npcAuthor)return baseMetricsV42(p);
 const n=p.npcAuthor,age=Math.max(.1,(now()-p.createdAt)/60000),potential=Math.max(20,(n.followers||200)*(.45+(p.seedSocial||20)/50)),curve=1-Math.exp(-age/55),views=Math.round(potential*curve),likes=Math.round(views*(.035+(hash(p.id)%40)/1000)),reposts=Math.round(likes*(.05+(hash(p.id+'r')%80)/1000)),commentsTotal=Math.max(threadCount(p.comments||[]),Math.round(likes*.035));return{views,likes,reposts,commentsTotal,shares:Math.round(reposts*.55+likes*.01)}
};

function inlineConversation(p){
 if(!p.socialScene||!p.comments?.length)return !p.profile?p.comments?.slice(0,1).filter(Boolean).map(c=>`<button class="commentpreview" data-comments="${esc(p.id)}"><b>@${esc(c.handle)}</b> ${esc(c.text)}</button>`).join('')||'':'';
 const featured=[...p.comments].sort((x,y)=>Number(Boolean(y.verified))-Number(Boolean(x.verified))).slice(0,2);
 return `<button class="socialthreadpreview" data-comments="${esc(p.id)}">${featured.map(c=>{const ca=c.authorId?byId(c.authorId):null;return `<span>${ca?av(ca,'microav'):npcAvatarMarkup({name:c.name,handle:c.handle,avatar:c.avatar},'microav')}<i><b>${esc(c.name||ca?.name||c.handle)}${ca?` ${check()}`:''}</b><em>${richPostText(c.text)}</em></i></span>`}).join('')}<strong>View conversation · ${fmt(threadCount(p.comments))} replies</strong></button>`
}
function quoteHtml(q){if(!q)return'';const a=byId(q.id);return `<div class="quotedpost" ${a?`data-profile="${a.id}"`:''}><div><b>${a?esc(a.name):'SCENE'}</b>${a?check():''}${a?`<span>@${esc(a.handle)}</span>`:''}</div><p>${richPostText(q.text||'')}</p></div>`}

postHtml=function(p,profile=false){
 const a=postAuthor(p);if(!a)return'';const m=metricsFor(p),pid=esc(p.id),isNpc=a.type==='npc',avatar=isNpc?npcAvatarMarkup(a):av(a),profileAttr=p.authorId==='player'?'disabled':isNpc?`data-npc-profile="${esc(a.handle)}"`:`data-profile="${a.id}"`,verified=!isNpc&&(p.authorId!=='player'||state.player.verified),label=p.socialLabel?`<div class="socialcontext">${esc(p.socialLabel)}</div>`:'';
 return `<article class="post ${profile?'profilepost':''} ${p.socialScene?'socialscene':''}" data-live-post="${pid}" data-openpost="${pid}"><div class="posthead"><button class="avatarbtn" ${profileAttr}>${avatar}</button><div class="postbody">${label}<div class="identity"><strong>${esc(a.name)}</strong>${verified?check():''}<span>@${esc(a.handle)}</span><span>· ${ago(p.createdAt)}</span><button class="postmore" aria-label="More">•••</button></div><div class="posttext">${richPostText(p.text)}</div>${quoteHtml(p.quote)}${p.liveNews&&p.sourceUrl?`<a class="newssource" href="${esc(p.sourceUrl)}" target="_blank" rel="noreferrer">${esc(p.sourceName||'Current news')} ↗</a>`:''}${mediaHtml(p,profile)}${!profile?inlineConversation(p):''}<div class="metrics"><button class="metric" data-comments="${pid}" aria-label="Reply">${ICON.comment}<span data-live-metric="comments">${fmt(m.commentsTotal)}</span></button><button class="metric ${p.reposted?'reposted':''}" data-repost="${pid}" aria-label="Repost">${ICON.repost}<span data-live-metric="reposts">${fmt(m.reposts)}</span></button><button class="metric ${p.liked?'liked':''}" data-like="${pid}" aria-label="Like">${ICON.heart}<span data-live-metric="likes">${fmt(m.likes)}</span></button><span class="metric staticmetric">${ICON.views}<span data-live-metric="views">${fmt(m.views)}</span></span><button class="metric sharemetric" data-share="${pid}" aria-label="Share">${ICON.share}<span data-live-metric="shares">${fmt(m.shares||0)}</span></button></div></div></div></article>`
};

openComments=function(id){
 const p=state.posts.find(x=>x.id===id);if(!p)return;ensureCommentIds(p);const a=postAuthor(p);if(!a)return;let replyTo='';const total=Math.max(metricsFor(p).commentsTotal,threadCount(p.comments));const headAv=a.type==='npc'?npcAvatarMarkup(a):av(a);const verified=a.type!=='npc'&&a.type!=='player';
 showSheet(`${fmt(total)} replies`,`<div class="threadop interactiveop">${headAv}<div><div class="identity"><strong>${esc(a.name)}</strong>${verified?check():''}<span>@${esc(a.handle)}</span></div>${p.socialLabel?`<div class="socialcontext">${esc(p.socialLabel)}</div>`:''}<p>${richPostText(p.text)}</p>${quoteHtml(p.quote)}${mediaHtml(p,true)}</div></div><div class="threaddivider"><span>Conversation</span></div><div id="commentlist">${p.comments.slice(0,p._commentVisible||12).map(c=>commentHtml(c)).join('')}</div><button class="btn secondary full morecomments" id="morecomments">Load more replies</button><div class="commentcomposer"><div id="replyingto" class="replyingto hidden"></div><form id="commentform"><span class="commentme">${playerAvatarMarkup('fanav')}</span><input id="commenttext" maxlength="280" autocomplete="off" placeholder="Post your reply"><button>Reply</button></form></div>`);
 const bindThread=()=>{modal.querySelectorAll('[data-profile]').forEach(b=>b.onclick=e=>{e.stopPropagation();openProfile(b.dataset.profile)});modal.querySelectorAll('[data-npc-profile]').forEach(b=>b.onclick=e=>{e.stopPropagation();openNpcProfile(b.dataset.npcProfile)});modal.querySelectorAll('[data-reply-to]').forEach(b=>b.onclick=e=>{e.stopPropagation();replyTo=b.dataset.replyTo||'';const label=$('#replyingto');label.classList.remove('hidden');label.innerHTML=`Replying to <b>@${esc(b.dataset.replyHandle||'user')}</b> <button id="cancelreply">×</button>`;$('#commenttext').placeholder=`Reply to @${b.dataset.replyHandle||'user'}`;$('#commenttext').focus();$('#cancelreply').onclick=()=>{replyTo='';label.classList.add('hidden');$('#commenttext').placeholder='Post your reply'}})};bindThread();
 $('#commentform').onsubmit=e=>{e.preventDefault();const text=$('#commenttext').value.trim();if(!text)return;const c=playerComment(text);let targetAuthorId='';if(replyTo){const parent=findThreadComment(p.comments,replyTo);targetAuthorId=parent?.authorId||'';(parent?.replies||p.comments).push(c)}else p.comments.push(c);const target=byId(targetAuthorId)||(p.authorId==='player'||p.npcAuthor?null:byId(p.authorId));if(target?.type==='celeb'){const negative=/hate|boring|mid|fake|embarrass|terrible|awful|flop|annoying|trash|ugly/i.test(text);globalThis.SCENE_KERNEL170?.relationshipSignal?.(target.id,negative?'negative_public_comment':'positive_public_comment',{visibility:'public',source:'player_comment',summary:`Player commented to ${target.name}: ${text}`,context:{postId:p.id,replyTo:replyTo||null}})}remember('comment',{postId:p.id,celebrityId:target?.id||null,celebrity:target?.name||null,text,replyTo:replyTo||null});save();scheduleCommentReaction(p,c,targetAuthorId);openComments(id);flash(replyTo?'Reply posted':'Comment posted')};
 $('#morecomments').onclick=()=>{const shown=p._commentVisible||12;if(shown>=p.comments.length){for(let i=0;i<8;i++){const next=contextualFanComment(p);if(next)p.comments.push(next)}ensureCommentIds(p)}p._commentVisible=Math.min(p.comments.length,shown+8);save();openComments(id)}
};

worldPost=function(){
 const r=Math.random();
 if(r<.36)generateEverydayPost(0);
 else if(r<.64)generateSocialScene(0);
 else if(r<.78)generateReplyPost(0);
 else if(r<.9)generateNpcLifePost(0);
 else if(r<.96&&generatePlayerOrbitPost(0)){}
 else baseWorldPostV42();
 save();
};

bind=function(){
 baseBindV42();
 document.querySelectorAll('[data-npc-profile]').forEach(b=>b.onclick=e=>{e.stopPropagation();openNpcProfile(b.dataset.npcProfile)});
 document.querySelectorAll('[data-openpost]').forEach(el=>el.onclick=e=>{if(e.target.closest('button,a,input,label'))return;openComments(el.dataset.openpost)});
};

function seedInteractiveFeed(){
 if(state.socialWorldVersion>=SOCIAL_VERSION)return;
 state.socialWorldVersion=SOCIAL_VERSION;state.socialLore=state.socialLore||[];
 // Mix ordinary life, direct replies, fan chatter and mini storylines through the feed.
 generateEverydayPost(3);generateReplyPost(11);generateNpcLifePost(24);generateSocialScene(39);generateEverydayPost(63);generateSocialScene(96);generateReplyPost(142);generateNpcLifePost(205);generateSocialScene(330);if(state.player?.fame>=8)generatePlayerOrbitPost(18);
 save();
}
seedInteractiveFeed();
setTimeout(()=>{try{render();refreshLiveCounts()}catch(e){console.warn('STATUS social-world render fallback',e)}},0);
})();
