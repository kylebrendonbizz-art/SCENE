(()=>{
/* STATUS v45 — first-play coach marks. Does not touch DM/message plumbing. */
const TOUR_VERSION=1;
let tour={active:false,index:0,root:null,ring:null,bubble:null,step:null};
const STEPS=[
 {icon:'✦',title:'Welcome to SCENE',body:'You start small, then build followers, fame, money, relationships and access until the whole world knows your name.',center:true},
 {selector:'.hudrow .energy',icon:'⚡',title:'Energy',body:'Jobs, events and travel use energy. It regenerates over time — and Career has ways to refill it.'},
 {selector:'.hudrow .gems',icon:'◆',title:'Diamonds',body:'These are premium game currency. Earn them from levels and milestones, then spend them on boosts, VIP access and more.'},
 {selector:'.hudrow .hudfame',icon:'✦',title:'Fame',body:'Fame is your social status. More fame unlocks bigger jobs, press attention, celebrity access and better travel options.'},
 {selector:'.topbar [data-action="search"]',icon:'⌕',title:'Find anyone',body:'Search celebrity and news profiles here. You can follow anyone — but famous people only follow back when you have actually earned their attention.'},
 {selector:'.topbar [data-action="activity"]',icon:'◉',title:'Your notifications',body:'Social shows follows, likes, mentions and replies. Progress keeps career rewards, fame changes and milestones separate.'},
 {selector:'[data-action="addstory"]',icon:'＋',title:'Stories',body:'Post your own story here, then tap through everyone else’s. Stories are one of the quickest ways to make the world feel alive.'},
 {selector:'.post .metrics',icon:'♡',title:'The feed is live',body:'Likes, replies, reposts, shares and views keep moving. When you are unknown, reactions are tiny. As you blow up, the numbers start flying.'},
 {selector:'.fab[data-action="compose"]',icon:'＋',title:'Post something',body:'Text, photos, comments and replies all become part of your career memory. The world can react to what you actually do.'},
 {selector:'[data-tab="world"]',icon:'◎',title:'Career',body:'This is where you climb the social ladder: jobs, side quests, milestones, diamonds, travel and the next thing that could change your career.'},
 {selector:'[data-tab="circle"]',icon:'◌',title:'Circle',body:'Your private world lives here — DMs, relationships and people you have actually earned access to.'},
 {selector:'[data-tab="you"]',icon:'○',title:'You',body:'Your public profile. Watch your followers, posts and engagement grow as your career gets bigger.'},
 {selector:'.settingstop',icon:'⚙',title:'Settings',body:'Music, volume, the live-world status, restart career — and this tutorial if you ever want the tour again.'},
 {icon:'♛',title:'Now make them care.',body:'Post. Work. Travel. Take risks. Build relationships. Every little move can become a bigger story later.',center:true,final:true}
];

function el(q){return q?document.querySelector(q):null}
function cleanup(){
 if(tour.root)tour.root.remove();
 tour={active:false,index:0,root:null,ring:null,bubble:null,step:null};
 document.documentElement.classList.remove('tour-open');
 window.removeEventListener('resize',positionTour);
 window.removeEventListener('scroll',positionTour,true);
}
function finishTour(skipped=false){
 if(state?.player){state.tutorialVersion=TOUR_VERSION;state.tutorialQueued=false;save()}
 cleanup();
 if(!skipped)flash('You’re ready. Go become somebody. ✦');
}
function ensureRoot(){
 if(tour.root)return;
 const root=document.createElement('div');root.id='status-tour';root.innerHTML=`<div class="tourblocker"></div><div class="tourring"></div><div class="tourbubble" role="dialog" aria-live="polite"><div class="tourtop"><span class="touricon"></span><button class="tourskip" type="button">Skip</button></div><div class="tourcount"></div><h3></h3><p></p><div class="touractions"><button class="tourback" type="button">Back</button><button class="tournext" type="button">Next</button></div></div>`;
 document.body.appendChild(root);tour.root=root;tour.ring=root.querySelector('.tourring');tour.bubble=root.querySelector('.tourbubble');
 root.querySelector('.tourskip').onclick=()=>finishTour(true);
 root.querySelector('.tourback').onclick=()=>{if(tour.index>0){tour.index--;drawTour()}};
 root.querySelector('.tournext').onclick=()=>{if(tour.index>=STEPS.length-1)finishTour(false);else{tour.index++;drawTour()}};
 window.addEventListener('resize',positionTour);window.addEventListener('scroll',positionTour,true);
}
function positionTour(){
 if(!tour.active||!tour.bubble||!tour.step)return;
 const step=tour.step,target=step.center?null:el(step.selector),ring=tour.ring,b=tour.bubble;
 if(step.center||!target){ring.classList.add('hidden');b.classList.add('centered');b.style.left='50%';b.style.top='50%';b.style.bottom='auto';b.style.transform='translate(-50%,-50%)';return}
 b.classList.remove('centered');ring.classList.remove('hidden');
 const r=target.getBoundingClientRect(),pad=7,left=Math.max(7,r.left-pad),top=Math.max(7,r.top-pad),width=Math.min(innerWidth-14,r.width+pad*2),height=r.height+pad*2;
 ring.style.left=left+'px';ring.style.top=top+'px';ring.style.width=width+'px';ring.style.height=height+'px';
 const bubbleW=Math.min(338,innerWidth-24),spaceBelow=innerHeight-(r.bottom+pad),preferBelow=spaceBelow>245||r.top<innerHeight*.42;
 b.style.width=bubbleW+'px';b.style.left=Math.max(12,Math.min(innerWidth-bubbleW-12,r.left+r.width/2-bubbleW/2))+'px';b.style.transform='none';
 if(preferBelow){b.dataset.place='below';b.style.top=Math.min(innerHeight-205,r.bottom+18)+'px';b.style.bottom='auto'}else{b.dataset.place='above';b.style.top='auto';b.style.bottom=Math.max(14,innerHeight-r.top+18)+'px'}
}
function drawTour(){
 ensureRoot();const step=STEPS[tour.index];tour.step=step;
 let target=step.center?null:el(step.selector);
 // If a target is temporarily unavailable, skip forward rather than leaving a dead tutorial.
 if(!step.center&&!target){if(tour.index<STEPS.length-1){tour.index++;return drawTour()}return finishTour(false)}
 tour.root.querySelector('.touricon').textContent=step.icon||'✦';
 tour.root.querySelector('.tourcount').textContent=step.final?'READY':`${tour.index+1} / ${STEPS.length}`;
 tour.root.querySelector('h3').textContent=step.title;
 tour.root.querySelector('p').textContent=step.body;
 tour.root.querySelector('.tourback').disabled=tour.index===0;
 tour.root.querySelector('.tournext').textContent=step.final?'Start playing':'Next';
 if(target){try{target.scrollIntoView({block:'nearest',behavior:'smooth'})}catch{}}
 requestAnimationFrame(()=>requestAnimationFrame(positionTour));
}
function startTour(replay=false){
 if(!state?.player||tour.active)return;
 closeModal();state.tab='feed';state.filter='foryou';state.tutorialQueued=false;if(replay)state.tutorialVersion=0;save();
 tour.active=true;tour.index=0;document.documentElement.classList.add('tour-open');
 baseRenderTour();setTimeout(drawTour,180);
}
window.STATUS_startTour=()=>startTour(true);

const baseSettingsTour=renderSettings;
renderSettings=function(){
 const html=baseSettingsTour();
 return html.replace('</section>',`<div class="heading">Help</div><div class="card settingrow toursetting"><div class="grow"><strong>How to play</strong><small>Replay the guided SCENE tour and learn what every main control does.</small></div><button class="btn secondary" data-action="tutorial">Replay tour</button></div></section>`)
};

const baseBindTour=bind;
bind=function(){baseBindTour();document.querySelectorAll('[data-action="tutorial"]').forEach(b=>b.onclick=()=>startTour(true))};

const baseRenderTour=render;
render=function(){
 baseRenderTour();
 if(tour.active)setTimeout(positionTour,40);
 else if(state?.player&&state.tutorialQueued&&(state.tutorialVersion||0)<TOUR_VERSION){setTimeout(()=>startTour(false),520)}
};
})();