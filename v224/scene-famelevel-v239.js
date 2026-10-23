/* famelevel239: (1) followers scale with level, (2) no multi-level jumps. Additive; kill switch window.SCENE_FAMELEVEL_OFF=true
   (checked on every write, so OFF = old grants/levels immediately).
   How: state.player.followers / state.player.xp become own accessor properties (same enumerable value in JSON/saves), so
   EVERY grant path (applyEffect + live-social clout wrap, posts, bookings/finishGig, story230, milestones, level rewards,
   eventchain/worldflow cards, travel, celeb reactions) is covered without touching those files. Re-armed when state.player
   is replaced (onboarding, QA setup, load).
   FOLLOWERS: on a positive write of base delta d: bonus = min(50000, floor(d * min(2, (level-1)/10))). Level 1 = +0%,
   L6 = +50%, L11 = +100%, L21+ = +200% (cap). Decreases / zero deltas pass through untouched. Level = the game's own
   XP curve (SCENE_DIRECTOR157.level / levelInfo157).
   LEVELS: XP writes may raise the level by at most +1 per write AND +1 per game day (state.sceneDay). A write crossing 2+
   thresholds lands exactly on the next threshold (overflow discarded); once the day's level is used, XP holds 1 below
   the next threshold (overflow discarded). On load, a save whose XP sits 2+ levels above the acknowledged level
   (sceneDirector157.lastLevel) is clamped to lastLevel+1 (one level-up moment, no catch-up chain).
   New save key: state.famelevel239 {v,day,dayBase,capped,discardedXp,bonusFollowers,loadClamp}. Money untouched. */
(function(){'use strict';
const OFF=()=>window.SCENE_FAMELEVEL_OFF===true;
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const today=()=>Number(S()?.sceneDay)||0;
function info(xp){xp=Number(xp)||0;try{const f=globalThis.SCENE_DIRECTOR157?.level||(typeof levelInfo157==='function'?levelInfo157:null);if(f)return f(xp)}catch{}
  let level=1,start=0,need=10;while(level<60&&xp>=start+need){start+=need;level++;need=10+(level-1)*5}return{level,start,need}} /* same curve as levelInfo157 */
function startOf(L){let s=0,need=10;for(let l=1;l<L&&l<60;l++){s+=need;need=10+l*5}return s}
function fl(){const s=S();if(!s)return{};let f=s.famelevel239;if(!f||typeof f!=='object')f=s.famelevel239={v:239,day:null,dayBase:null,capped:0,discardedXp:0,bonusFollowers:0,loadClamp:null};return f}
function roll(f,lvlNow){const d=today();if(f.day!==d||!Number.isFinite(f.dayBase)){f.day=d;f.dayBase=lvlNow}}
function bonusFor(d,xp){if(!(d>0))return 0;const L=info(xp).level,factor=Math.min(2,Math.max(0,(L-1)/10));return Math.min(50000,Math.floor(d*factor))}
const last={raw:null};
function arm(p){if(!p||p.__fl239)return;
  let fol=p.followers,xp=p.xp;
  /* old-save catch-up clamp (before director157 sees the XP) */
  try{const dir=S()?.sceneDirector157,base=Number(dir?.lastLevel);if(!OFF()&&Number.isFinite(base)&&base>=1){const L=info(xp).level;if(L>base+1){const to=startOf(base+1),f=fl();f.loadClamp={from:Number(xp)||0,to,lastLevel:base,at:Date.now()};f.discardedXp=(Number(f.discardedXp)||0)+((Number(xp)||0)-to);xp=to;f.day=today();f.dayBase=base}}}catch(e){console.warn('famelevel239 load',e)}
  Object.defineProperty(p,'__fl239',{value:true,enumerable:false,configurable:true});
  Object.defineProperty(p,'followers',{enumerable:true,configurable:true,get(){return fol},set(v){
    const n=Number(v),o=Number(fol)||0;if(OFF()||!Number.isFinite(n)||n<=o){fol=v;return}
    const b=bonusFor(n-o,xp);fol=n+b;if(b){const f=fl();f.bonusFollowers=(Number(f.bonusFollowers)||0)+b;last.followers={base:n-o,bonus:b}}}});
  Object.defineProperty(p,'xp',{enumerable:true,configurable:true,get(){return xp},set(v){
    const n=Number(v),o=Number(xp)||0;if(OFF()||!Number.isFinite(n)||n<=o){xp=v;return}
    const L0=info(o).level,L1=info(n).level;if(L1<=L0){xp=n;return}
    const f=fl();roll(f,L0);const maxL=Math.min(L0+1,(Number(f.dayBase)||L0)+1);
    if(L1<=maxL){xp=n;return}
    const to=maxL>L0?startOf(maxL):Math.max(o,startOf(L0+1)-1);
    f.capped=(Number(f.capped)||0)+1;f.discardedXp=(Number(f.discardedXp)||0)+(n-to);last.xp={asked:n,got:to,from:L0,want:L1,max:maxL,day:f.day};xp=to}});
}
function poll(){const s=S();if(!s?.player)return;if(!s.player.__fl239)arm(s.player)}
setInterval(poll,50);poll();
window.SCENE_FAMELEVEL={version:239,state:fl,info,startOf,bonusFor,last:()=>last,armed:()=>!!S()?.player?.__fl239};
})();
