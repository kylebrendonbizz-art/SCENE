(()=>{
const DAY_MS=86400000;
function completedStoryCount92(){const built=Array.isArray(state.storyHistory)?state.storyHistory.length:0;const custom=(state.memory||[]).filter(m=>m&&m.type==='event'&&m.custom).length;return built+custom}
function ensureDay92(){if(!state.player)return;state.dayLedger92=Array.isArray(state.dayLedger92)?state.dayLedger92:[];if(!Number.isFinite(state.sceneDay))state.sceneDay=completedStoryCount92();const d=Number(state.sceneDay)||0;for(const p of state.posts||[])if(!Number.isFinite(p.sceneDay))p.sceneDay=d}
function recapOutlet92(){return (typeof choosePlayerOutlet48==='function'&&choosePlayerOutlet48('event'))||byId('popbase')||byId('enews')||media?.[0]||null}
function recapText92(ctx){
 const name=state.player?.name||'The player',career=String(state.player?.career||'career').toLowerCase(),city=String(ctx?.city||state.player?.city||'Los Angeles'),title=String(ctx?.title||'a career story').replace(/\s+/g,' ').trim().replace(/[.!?]+$/,''),choice=String(ctx?.choice||ctx?.response||'').replace(/\s+/g,' ').trim(),c=choice.toLowerCase(),t=title.toLowerCase();
 let lead='';
 if(/stay home|skip|decline|pass on|don'?t go|do not go|leave them waiting/.test(c))lead=`${name} passed on a ${career} opportunity in ${city} and never showed, leaving the room to move on without ${(typeof playerPronouns130==='function'&&playerPronouns130()?.object)||name}.`;
 else if(/repost/.test(c)&&/joke/.test(c))lead=`${name} turned an unexpected post into a joke, giving the moment a second life online.`;
 else if(/joke|laugh|playful/.test(c))lead=`${name} played the moment for laughs in ${city} instead of feeding the drama.`;
 else if(/say nothing|silent|ignore|keep walking|leave it|off record|private/.test(c))lead=`${name} kept a ${city} moment deliberately quiet, leaving the timeline with very little to work with.`;
 else if(/deny|shut it down|correct/.test(c))lead=`${name} pushed back publicly as speculation around a ${city} moment started to spread.`;
 else if(/post|share|quote|tease|clip|cryptic/.test(c))lead=`${name} gave the timeline just enough from a ${city} ${career} moment to start fresh chatter.`;
 else if(/accept|go|take|say yes|show up|walk in|commit|play|give them|trust|bring|ask to read|prepared/.test(c)){const pr=typeof playerPronouns130==='function'?playerPronouns130():null;lead=pr?`${name} took a new ${career} opportunity in ${city} and left with more momentum than ${pr.subject} arrived with.`:`${name} took a new ${career} opportunity in ${city} and left with more momentum than at the start.`;}
 else if(/camera|page|account|spotted|photo/.test(t))lead=`${name} drew a little more local attention in ${city} after being recognised in public.`;
 else lead=`${name} added another small ${career} win to the résumé in ${city}.`;
 return `Yesterday, ${lead}`.replace(/\s+/g,' ').slice(0,280)
}
const baseMkPost92=mkPost;
mkPost=function(...args){ensureDay92();const p=baseMkPost92(...args);if(p&&!Number.isFinite(p.sceneDay))p.sceneDay=Number(state.sceneDay)||0;return p};
globalThis.SCENE_advanceDay=function(ctx={}){if(!state.player)return 0;ensureDay92();const oldDay=Number(state.sceneDay)||0;for(const p of state.posts||[]){if(!Number.isFinite(p.sceneDay))p.sceneDay=oldDay;if(Number.isFinite(p.createdAt))p.createdAt-=DAY_MS}state.sceneDay=oldDay+1;state.dayLedger92.unshift({day:state.sceneDay,title:String(ctx.title||'Story completed'),choice:String(ctx.choice||ctx.response||''),outcome:String(ctx.outcome||''),at:now()});state.dayLedger92=state.dayLedger92.slice(0,120);/* Completing a day records private progress; publicity belongs to the world director. */addNotif(`Day ${state.sceneDay+1} begins · your story progress is saved.`,'world');save();return state.sceneDay};
function dayLabel92(day){const cur=Number(state.sceneDay)||0,shown=day+1;/* display only: stored sceneDay stays 0-based */if(day===cur)return `DAY ${shown} · TODAY`;if(day===cur-1)return `DAY ${shown} · YESTERDAY`;return `DAY ${shown}`}
renderFeed=function(){ensureDay92();const base=state.filter==='following'?state.posts.filter(p=>p.authorId==='player'||state.followingIds.includes(p.authorId)):state.posts;const posts=[...base].sort((a,b)=>b.createdAt-a.createdAt);let last=null,timeline='';for(const p of posts){const day=Number.isFinite(p.sceneDay)?p.sceneDay:(Number(state.sceneDay)||0);if(day!==last){timeline+=`<div class="feedday"><span>${esc(dayLabel92(day))}</span><i></i></div>`;last=day}timeline+=postHtml(p)}const day=Number(state.sceneDay)||0,latest=state.dayLedger92?.[0];return `<div class="scenedaybar"><div><small>SCENE TIME</small><strong>Day ${day+1}</strong></div><span>${day===0?'THE BEGINNING':latest?esc(latest.title):'THE STORY CONTINUES'}</span></div><div class="stories"><button class="storybtn addstory" data-action="addstory"><span class="avatar storyav playerstory">${initials(state.player.name)}<b>+</b></span><span>Your story</span></button>${state.stories.slice(0,15).map(s=>{const a=byId(s.authorId);return a?`<button class="storybtn ${s.seen?'seen':''}" data-story="${a.id}">${av(a,'storyav')}<span>${esc(a.name.split(' ')[0])}</span></button>`:''}).join('')}</div><div class="feedtabs"><button class="feedtab ${state.filter==='foryou'?'on':''}" data-filter="foryou">For you</button><button class="feedtab ${state.filter==='following'?'on':''}" data-filter="following">Following</button></div>${timeline||'<div class="empty">Follow people from Search and their posts will appear here.</div>'}`};
function retireAutomaticRecaps129(){
 if(state.recapFix129)return;
 const legacyRecap=p=>{const a=byId(p?.authorId),t=String(p?.text||'');return p?.kind==='day-recap'||Boolean(a?.type==='media'&&/^Yesterday, /i.test(t)&&/(took a new .* opportunity|passed on a .* opportunity|kept a .* moment deliberately quiet|gave the timeline just enough|added another small .* win|left with more momentum than)/i.test(t))};
 const recaps=(state.posts||[]).filter(legacyRecap);
 state.retiredDayRecaps129=[...(state.retiredDayRecaps129||[]),...recaps].slice(-40);
 state.posts=(state.posts||[]).filter(p=>!legacyRecap(p));
 state.notifications=(state.notifications||[]).filter(n=>!/^Day \d+ begins · yesterday's story is now moving through the feed\.$/.test(n.text||''));
 state.recapFix129=true;save();
}
retireAutomaticRecaps129();
ensureDay92();
globalThis.SCENE_DAY92={version:92,get day(){ensureDay92();return Number(state.sceneDay)||0},advance:globalThis.SCENE_advanceDay};
})();
