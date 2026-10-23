/* SCENE feedguard230 (Gameplay Logic): one no-repeat guard + template sanitiser for generated timeline posts, comments
   and NPC DMs. Additive add-on, loaded from index.html; waits for the v224 boot chain, then hooks save()/render() with a
   sweep over items it has not seen yet (new items only: an existing save is never rewritten when it loads).
   - Sanitiser (all generated text): doubled words ("the the"), raw rating labels "(solid)", unfilled {slot}/[slot]
     tokens, " ," and double spaces.
   - No-repeat: per character, per save (state.dedupe230 = {v,h:{charKey:[sig…]},r:[sig…]}, capped), plus the last 60
     generated items across everyone. Exact, near (token Jaccard >= .8) or same first 6 words = duplicate.
     Generators that can be re-asked (director fan/media/celeb lines, contextualFanComment) are rerolled up to 6 times;
     anything still duplicated when it lands is dropped from the feed (never repeated). Effects already applied (rewards,
     relationship moves) are left exactly as they were.
   - Never touched: the player's own posts/comments/DMs; Kim's real DMs (runtime/story replies); story228 invite DMs;
     DM replies to the player (sanitised only, never dropped, so no conversation loses its answer).
   - Writer override hook: SCENE_ROSTER_LINES.feed.<slotKey>.<characterId>[] (fallback .default[]); slot keys and the
     {slots} are in WRITER_LINES.md. Lines with a slot that has no value are skipped, never shown half-filled.
   Kill switch: window.SCENE_FEEDGUARD_OFF=true (checked on every call). */
(()=>{
'use strict';
if(window.SCENE_FEEDGUARD230)return;
const OFF=()=>window.SCENE_FEEDGUARD_OFF===true;
const CAP_PER=12,CAP_KEYS=400,CAP_RECENT=60,REROLLS=6; /* feedguard230c: 400 speakers (was 160: with ~330 npc48 commenters an early commenter's history was evicted and its slot-free personality lines could repeat) */
const H=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619)}return h>>>0};
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};

/* ---------- sanitiser ---------- */
const LABELS=/\s*\((?:solid|good|great|weak|rough|messy|standout|viral|strong|decent|bad|poor|ok|okay|fine|mid|average|excellent|low|medium|high)\)/gi;
const KEEP_DOUBLE=new Set(['no','so','very','really','ha','haha','la','bye','yes','go','stop','please','wait','omg','okay','ok','yeah','yay','oh','hey','hi','run','now','more','again','never','bye-bye','rah','yup','nah','lol']);
const SLOTS=/\{[A-Za-z_][\w.]*\}|\[(?:[a-z]+_[a-z_]+|name|first|place|city|event|booking|handle|player|celeb|topic|posttopic|slot)\]/gi;
function sanitize(t){
  let s=String(t??'');if(!s)return s;const o=s;
  s=s.replace(LABELS,'').replace(SLOTS,'').replace(/\b(undefined|null|NaN)\b(?=[\s.,!?]|$)/g,'');
  s=s.replace(/\b([A-Za-z']+) (\1)\b/gi,(m,a)=>KEEP_DOUBLE.has(a.toLowerCase())?m:a);
  s=s.replace(/[ \t]{2,}/g,' ').replace(/ +([,.;:!?])/g,'$1').replace(/,{2,}/g,',').replace(/\(\s*\)/g,'').replace(/[ \t]{2,}/g,' ').trim();
  return s===o.trim()?o:s;
}

/* ---------- signatures ---------- */
function tokens(t){return String(t||'').toLowerCase().replace(/https?:\/\/\S+/g,' ').replace(/@[\w.]+/g,' ').replace(/[\d]+(?:[.,]\d+)?[kmb]?/g,' ').replace(/[\u2018\u2019']/g,'').replace(/[^\p{L}\s]+/gu,' ').split(/\s+/).filter(Boolean)}
function sig(t){const k=tokens(t).slice(0,14);return k.length?k.join(' '):'#'+String(t||'').toLowerCase().replace(/\s+/g,'').slice(0,40)}
function near(a,b){
  if(a===b)return true;if(a[0]==='#'||b[0]==='#')return false;
  const A=a.split(' '),B=b.split(' ');
  if(A.length>=6&&B.length>=6&&A.slice(0,6).join(' ')===B.slice(0,6).join(' '))return true;
  if(A.length<4||B.length<4)return false;
  const sa=new Set(A),sb=new Set(B);let inter=0;for(const x of sa)if(sb.has(x))inter++;
  return inter/(sa.size+sb.size-inter)>=0.8;
}
function store(){const s=S();if(!s)return null;let d=s.dedupe230;if(!d||typeof d!=='object'||!d.h||!Array.isArray(d.r)){d=s.dedupe230={v:1,h:{},r:[]}}return d}
const pending=new Map(); /* sig -> count: lines a generator just handed out, not yet seen landing by the sweep */
function isDup(key,text){
  const d=store();if(!d)return false;const g=sig(text);
  for(const x of d.h[key]||[])if(near(g,x))return true;
  for(const x of d.r)if(near(g,x))return true;
  for(const x of pending.keys())if(near(g,x))return true;
  return false;
}
function record(key,text){
  const d=store();if(!d)return;const g=sig(text);
  const arr=Array.isArray(d.h[key])?d.h[key]:[];delete d.h[key];d.h[key]=arr; /* feedguard230c: re-insert = least-recently-used eviction */
  if(!arr.includes(g)){arr.push(g);if(arr.length>CAP_PER)arr.splice(0,arr.length-CAP_PER)}
  const ks=Object.keys(d.h);if(ks.length>CAP_KEYS)for(const k of ks.slice(0,ks.length-CAP_KEYS))delete d.h[k];
  d.r.push(g);if(d.r.length>CAP_RECENT)d.r.splice(0,d.r.length-CAP_RECENT);
}
const STATS={sanitized:0,dropped:0,rerolled:0,overrides:0,exhausted:0,special:0};

/* ---------- Writer override hook + reroll ---------- */
/* feedguard230b: a line that would still show a brace or a dangling preposition ("at !", "after .") is never used */
const DANGLE=/[{}]|\b(?:at|from|after)\s*(?:[!?.,:;)]|$)/i;
function fill(line,ctx){let miss=false;const out=String(line||'').replace(/\{(\w+)\}/g,(m,k)=>{const v=ctx&&ctx[k];if(v===undefined||v===null||String(v).trim()===''){miss=true;return m}return String(v)});return miss||DANGLE.test(out)?'':out}
const RESERVED230C={mediaReaction:new Set(['award']),fanComment:new Set(['personality','default'])}; /* feedguard230c: reserved pool sub-keys, never a characterId */
/* feedguard230c: fanComment tiers, in order: feed.fanComment["npc-<handle>" | "npc48-<n>"] (the comment's npcId; bare handle
   / "@handle" also accepted), then feed.fanComment.personality.<type>[] (type = the NPC's personality: stan, skeptic, dry,
   kind, chaotic, culture, detective, casual, industry, lurker), then default[]. Each tier is rotated on its own and tried
   before the next. 'personality' (and mediaReaction 'award') are reserved sub-keys, never a characterId. Other slots:
   own id, else default[]. All tiers empty = the old behaviour. */
function overrides(slot,id,alts,pers){const F=globalThis.SCENE_ROSTER_LINES?.feed?.[slot];if(!F||typeof F!=='object')return[];const R=RESERVED230C[slot],ok=k=>k&&!R?.has(k)&&Array.isArray(F[k])&&F[k].length;
  const D=Array.isArray(F.default)?F.default:[];let L;
  const good=x=>typeof x==='string'&&x.trim();
  if(slot==='fanComment'){const k=[id,...(alts||[])].find(ok),own=k?F[k].filter(good):[],PP=F.personality&&typeof F.personality==='object'&&pers?F.personality[pers]:null,pl=Array.isArray(PP)?PP.filter(good):[];
    if(own.length||pl.length){const d=D.filter(good);L=[...own,...pl,...d];L.segs=[own.length,pl.length,d.length].filter(n=>n>0);return L}L=D}else L=ok(id)?F[id]:D;
  return L.filter(good)}
function take(text){pending.set(sig(text),(pending.get(sig(text))||0)+1);return text}
/* generate(slotKey, characterId, ctx, raw(i)) -> text. Writer lines first (per character, then default), then the
   built-in generator rerolled; never returns empty (an unavoidable repeat is dropped later by the sweep).
   feedguard230b: ctx.special (set by the caller when the built-in line came from a special-case branch: KUWTK, chart #1,
   tagged project, award) skips the Writer pools, so that reaction keeps its own text (dedupe/reroll only). */
function generate(slot,id,ctx,raw){
  if(OFF())return raw(0);
  const key=String(id||'?'),L=ctx?.special?[]:overrides(slot,key,ctx?.altKeys,ctx?.personality);if(ctx?.special)STATS.special++;
  if(L.length){const h=H(`${slot}|${key}|${ctx?.day}|${ctx?.event||ctx?.postTopic||''}`),order=L.segs?L.segs.flatMap((n,j)=>{const o=L.segs.slice(0,j).reduce((a,b)=>a+b,0);return [...Array(n).keys()].map(i=>o+((h+i)%n))}):null,start=h%L.length;for(let i=0;i<L.length;i++){const t=sanitize(fill(L[order?order[i]:(start+i)%L.length],ctx));if(t&&!isDup(key,t)){STATS.overrides++;return take(t)}}}
  let first='';for(let i=0;i<REROLLS;i++){let t;try{t=sanitize(raw(i))}catch{t=''}if(!t)continue;if(!first)first=t;if(!isDup(key,t)){if(i)STATS.rerolled++;return take(t)}}
  STATS.exhausted++;return first||raw(0);
}

/* ---------- sweep (new items only) ---------- */
const SEEN=new WeakSet(),TXT=new WeakMap(); /* TXT: text last checked, so a line rewritten in place later (e.g. scene-public-character-v225 Kim comments) is checked again */
const due=x=>{if(!SEEN.has(x)){SEEN.add(x);return true}return typeof x.text==='string'&&TXT.has(x)&&TXT.get(x)!==x.text};
const isPlayerC=(c,p)=>c&&(c.authorId==='player'||c.player===true||c.isPlayer===true||c.mine===true||(p&&c.handle&&String(c.handle).replace(/^@/,'')===String(p.handle||'')&&!c.fan&&!c.npcId&&!c.authorId));
const TEMPLATE_DM=/^(proactive170|scene-starter148|scene-ai159|auto|npc)/;
function dmExempt(d,m){
  if(m.from!=='them')return 'skip';
  if(m.kind==='story228'||m.inviteId228||m.rendererSource==='story228')return 'skip';
  const template=TEMPLATE_DM.test(String(m.kind||''))||/^(kernel170-|starter148-|scene-ai-dm159-)/.test(String(m.mid||''));
  if(d.id==='kim'&&!template)return 'skip'; /* Kim's real DMs: untouched */
  if(m.replyTo||m.rendererSource||m.ai===true||m.logic226)return 'clean'; /* answers to the player: sanitise only */
  return 'guard';
}
let seeded=false;
function walk(fn){const s=S();if(!s)return;for(const p of s.posts||[]){fn(p,'post');for(const c of p.comments||[]){fn(c,'comment',p);for(const r of c.replies||[])fn(r,'reply',p)}}for(const d of s.dms||[])for(const m of d.messages||[])fn(m,'dm',d)}
/* seed(): everything already in the state when the guard installs (the loaded save) is left as it is; only items made after
   that are checked. On a save that has never seen the guard, its existing texts become the starting history. */
function seed(){const s=S();if(!s)return false;walk(x=>{if(x&&typeof x==='object'){SEEN.add(x);TXT.set(x,x.text)}});seeded=true;if(!s.player)return true;const first=!s.dedupe230;store();
  if(first){const hist=[];walk((x,kind,parent)=>{if(!x?.text)return;if(kind==='post'&&x.authorId!=='player')hist.push([x.authorId,x.text,Number(x.createdAt)||0]);else if((kind==='comment'||kind==='reply')&&!isPlayerC(x,s.player))hist.push([x.authorId||x.npcId||x.handle||x.name,x.text,Number(x.createdAt)||0]);else if(kind==='dm'&&x.from==='them'&&parent.id!=='kim')hist.push([parent.id,x.text,Number(x.at)||0])});hist.sort((a,b)=>a[2]-b[2]).slice(-300).forEach(([k,t])=>record(String(k||'?'),t))}
  return true}
function keyFor(c){return String(c.authorId||c.npcId||c.handle||c.name||'?')}
function landed(key,text){const g=sig(text),n=pending.get(g);if(n){if(n>1)pending.set(g,n-1);else pending.delete(g);record(key,text);return true}return false}
function check(key,obj,field='text'){ /* -> true if the item should be dropped */
  const t0=obj[field];if(typeof t0!=='string'||!t0)return false;const t=sanitize(t0);if(t!==t0){obj[field]=t;STATS.sanitized++}TXT.set(obj,t);
  if(!t)return true;if(landed(key,t))return false;if(isDup(key,t))return true;record(key,t);return false}
function sweep(){
  if(OFF())return;const s=S();if(!seeded){seed();return}if(!s?.player)return;if(!s.dedupe230)store();
  let changed=false;const pl=s.player;
  const posts=s.posts||[],dropPosts=new Set();
  for(let i=posts.length-1;i>=0;i--){const p=posts[i];if(!p||typeof p!=='object')continue;
    if(due(p)){if(p.authorId!=='player'&&check(String(p.authorId||'?'),p)){dropPosts.add(p)}}
    if(Array.isArray(p.comments)){const keep=[];for(const c of p.comments){if(!c||typeof c!=='object'){keep.push(c);continue}
      let drop=false;if(due(c)){if(!isPlayerC(c,pl))drop=check(keyFor(c),c)}
      if(!drop&&Array.isArray(c.replies)){const rk=c.replies.filter(r=>{if(!r||typeof r!=='object'||!due(r))return true;if(isPlayerC(r,pl))return true;return !check(keyFor(r),r)});if(rk.length!==c.replies.length){c.replies=rk;changed=true;STATS.dropped++}}
      if(drop){STATS.dropped++;changed=true;continue}keep.push(c)}
      if(keep.length!==p.comments.length)p.comments=keep}}
  if(dropPosts.size){s.posts=posts.filter(p=>!dropPosts.has(p));STATS.dropped+=dropPosts.size;changed=true}
  for(const d of s.dms||[]){const msgs=d.messages;if(!Array.isArray(msgs))continue;let removed=false;
    const keep=msgs.filter(m=>{if(!m||typeof m!=='object'||!due(m))return true;const mode=dmExempt(d,m);if(mode==='skip')return true;
      if(mode==='clean'){const t=sanitize(m.text);if(typeof m.text==='string'&&t&&t!==m.text){m.text=t;STATS.sanitized++}if(m.text)record(d.id,m.text);return true}
      if(check(d.id,m)){removed=true;STATS.dropped++;return false}return true});
    if(removed){d.messages=keep;changed=true;const last=keep.at(-1);if(!last||last.from!=='them'){d.unread=false;d.awaitingPlayer=false}}}
  pending.clear();
  return changed;
}
const safeSweep=()=>{try{return sweep()}catch(e){console.warn('feedguard230 sweep',e);return false}};

/* ---------- install ---------- */
function bootReady(){try{return typeof state!=='undefined'&&typeof save==='function'&&typeof render==='function'&&typeof mkPost==='function'&&[...document.scripts].some(x=>/scene-stories-v229\.js/.test(x.src))}catch{return false}}
function install(){
  if(OFF())return;
  const baseSave=save;save=function(){safeSweep();return baseSave.apply(this,arguments)};
  const baseRender=render;render=function(){safeSweep();return baseRender.apply(this,arguments)};
  if(typeof contextualFanComment==='function'){const baseCFC=contextualFanComment;contextualFanComment=function(p,...rest){
    if(OFF())return baseCFC.call(this,p,...rest);let made=null,spBank=false;const D=globalThis.SCENE_DIRECTOR157,spk=D?.specialPost230b?.(p)||'';
    const pl=S()?.player||{},topic=String(p?.text||'').replace(/\s+/g,' ').trim().slice(0,60);
    for(let i=0;i<REROLLS;i++){const c=baseCFC.call(this,p,...rest);if(!c)return c;made=made||c;const key=keyFor(c);
      if(spk){const sc=D?.specialComment230c?.(c,p);if(sc){spBank=true;const t=sanitize(sc.text||'');if(t&&!isDup(key,t)){c.text=take(t);c.special230=sc.kind;STATS.special++;return c}continue}} /* feedguard230c: special bank only */
      const alts=c.handle?[String(c.handle).replace(/^@/,''),'@'+String(c.handle).replace(/^@/,'')]:[],pers=String((typeof NORMAL_NPCS!=='undefined'?NORMAL_NPCS:[]).find(x=>x&&x.id===c.npcId)?.personality||c.personality||''),L=spk?[]:overrides('fanComment',key,alts,pers);if(L.length){const ctx={altKeys:alts,personality:pers,first:String(c.name||'').split(/\s+/)[0]||'',player:String(pl.name||'').split(/\s+/)[0]||'',handle:'@'+(pl.handle||''),postTopic:topic,city:pl.city||'',day:String(Number(S()?.sceneDay)||0)};const t=generate('fanComment',key,ctx,()=>c.text);if(t){c.text=t;return c}}
      const t=sanitize(c.text);if(t&&!isDup(key,t)){c.text=take(t);if(i)STATS.rerolled++;return c}}
    STATS.exhausted++;return spBank?null:made};}
  seed();
  setInterval(()=>{if(!OFF()&&safeSweep()){try{baseSave()}catch{}}},1500);
}
globalThis.SCENE_FEEDGUARD230={version:230,patch:'230c',fillLine:(l,c)=>sanitize(fill(l,c)),sanitize,sig,near,isDup:(k,t)=>isDup(String(k),t),generate,sweep:safeSweep,stats:()=>({...STATS}),key:'dedupe230'};
let tries=0;const wait=setInterval(()=>{if(OFF()){clearInterval(wait);return}if(bootReady()||++tries>300){clearInterval(wait);if(bootReady())install()}},150);
})();
