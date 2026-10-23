/* SCENE levelnext244 (Gameplay Logic, 2026-10-10): level-up names ONE real unlock + one quiet "what's next" line on Career.
   Additive, offline, rules-based, no AI, no money. Reuses: scene-director-v157 (sceneDirector157.lastLevel = the level the game
   acknowledged; checkLevel157 -> addNotif "Level N reached" + #scene-overlay157, restyled by uiux12 .u12moment), famelevel239
   (+1 level/day cap, untouched), worldflow236 (travel card templates + real rival pairs + spawnCard/rivalNow), livingcity243
   (LA spots + state.livingcity243.inCity/where; optional, read-only, may not be merged yet).
   1. UNLOCK: when sceneDirector157.lastLevel rises above state.levelnext244.seen, record ONE unlock for the new level
      (state.levelnext244.unlocks[level] = {type,id,label,day}). Type cycles by level (city, rival, district, collab); first unused
      id of that type, else next type, else oldest reuse. Pool comes only from existing data:
        city     = worldflow236 travel card templates (CITY48 cities; current city skipped) -> queued SCENE_WORLDFLOW.spawnCard(key)
                   when no card is open (worldflow caps apply; retried up to 3 game days)
        rival    = worldflow236 real rival pairs (both in roster) -> queued SCENE_WORLDFLOW.rivalNow(key) (1 rival moment/day rule kept)
        district = LA spots (livingcity243 data ids) -> tip only (feeds the what's-next line)
        collab   = worldflow236 card brand x celeb (SKIMS x Kim) -> tag only
      Surfaces (no new modal): appends " · Unlock: {label}" to the game's own "Level N reached" bell row, one <li class="lx244-unlock">
      in the uiux12 moment list (or a chip on the plain overlay), and "Last unlock: {label}" on Career (so a held moment loses nothing).
   2. WHAT'S NEXT: one quiet line on Career (state.tab 'world'), no toast, priority: open worldflow travel card > celeb DM cooling
      (unread from a celeb, or friendship below yesterday's snapshot) > livingcity in-city celeb at another LA spot > next level unlock
      preview > keep posting. Own element only (textContent), never render(); never touches #modal.
   Copy: window.SCENE_LEVELNEXT_LINES (Writer, optional; keys in LINE_KEYS.md), neutral fallbacks below.
   Save: ONE new key state.levelnext244 (lazy; old saves start with seen = current level, no retro unlocks).
   UI hooks: .lx244 [data-lx244-kind] > .lx244-next[data-lx244-next=<kind>] + .lx244-last[data-lx244-type]; .lx244-unlock; .lx244-chip.
   Kill switch window.SCENE_LEVELNEXT_OFF=true (checked every tick/hook: nothing recorded, line removed). */
(()=>{
'use strict';
if(window.SCENE_LEVELNEXT)return;
const V=244,K='levelnext244',OFF=()=>window.SCENE_LEVELNEXT_OFF===true;
const S0=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const G=n=>{try{return globalThis[n]}catch{return undefined}};
const who=id=>{try{return byId(id)}catch{return null}};
const day=()=>Number(S0()?.sceneDay)||0;
const save0=()=>{try{save()}catch{}};
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
const first=a=>String(a?.name||'').split(/\s+/)[0]||'';
const TYPES=['city','rival','district','collab'];
const SPOTS0=[{id:'hollywood',label:'Hollywood'},{id:'beverlyHills',label:'Beverly Hills'},{id:'santaMonica',label:'Santa Monica'}]; /* fallback = livingcity-data-v243 spots */
const spots=()=>{try{const s=G('SCENE_LIVINGCITY')?.config?.()?.spots;if(Array.isArray(s)&&s.length&&s.every(x=>x&&x.id&&x.label))return s}catch{}return SPOTS0};
const FB={ /* neutral fallbacks; Writer overrides in SCENE_LEVELNEXT_LINES */
 'lx.unlock.city':'{city} trip card','lx.unlock.rival':'Rival watch: {a} & {b}','lx.unlock.district':'LA tip: {spot}','lx.unlock.collab':'Collab tag: {brand} x {celeb}',
 'lx.ui.unlock':'Unlock: {label}','lx.ui.last':'Last unlock: {label}',
 'lx.next.travel':'Finish the {city} card','lx.next.dm':'Text {celeb} before things cool off','lx.next.city':'Walk {spot} — {celeb} might be around',
 'lx.next.level':'Level {n}: {label}','lx.next.idle':'Keep posting'};

/* ---------- copy ---------- */
function vals(k){const W=G('SCENE_LEVELNEXT_LINES')||{},v=W[k];return(Array.isArray(v)?v:typeof v==='string'?[v]:[]).map(String).filter(x=>x.trim()&&!/\[PLACEHOLDER/.test(x))}
function fill(t,sl){let miss=false;const o=String(t).replace(/\{(\w+)\}/g,(_,k)=>{const v=sl[k];if(v==null||v===''){miss=true;return''}return String(v)});return miss?null:o}
function line(k,sl,seed){const arr=vals(k),n=arr.length;if(n){const st=H(seed||k)%n;for(let i=0;i<n;i++){const t=fill(arr[(st+i)%n],sl);if(t)return t}}return fill(FB[k]||'',sl)||''}

/* ---------- state ---------- */
function lx(){const s=S0();if(!s)return null;let m=s[K];if(!m||typeof m!=='object')m=s[K]={v:V};
  if(!m.unlocks||typeof m.unlocks!=='object'||Array.isArray(m.unlocks))m.unlocks={};
  for(const k of['used','queue'])if(!Array.isArray(m[k]))m[k]=[];
  if(!m.fr||typeof m.fr!=='object')m.fr={day:-1,prev:{},cur:{}};return m}
const dir=()=>S0()?.sceneDirector157||null;

/* ---------- pool (existing data only) ---------- */
function wfData(){try{return G('SCENE_WORLDFLOW')?.data?.()||null}catch{return null}}
function pool(){const D=wfData()||{},city=S0()?.player?.city||'',out=[];
  for(const c of(D.cards||[]))if(c&&c.key&&c.city&&c.city!==city)out.push({type:'city',id:c.key,sl:{city:c.city,brand:c.brand||''}});
  for(const r of(D.rivals||[])){const a=who(r.a),b=who(r.b);if(a&&b&&a.type==='celeb'&&b.type==='celeb')out.push({type:'rival',id:r.key,sl:{a:first(a),b:first(b)}})}
  for(const s of spots())out.push({type:'district',id:s.id,sl:{spot:s.label}});
  for(const c of(D.cards||[]))if(c&&c.brand){const a=(c.celebs||[]).map(who).find(x=>x&&x.type==='celeb');if(a)out.push({type:'collab',id:c.brand.toLowerCase()+'_'+a.id,sl:{brand:c.brand,celeb:first(a)}})}
  return out}
const uid=x=>x.type+':'+x.id;
function choose(level,used){const P=pool();if(!P.length)return null;const u=new Set(used),start=level%TYPES.length;
  for(let i=0;i<TYPES.length;i++){const t=TYPES[(start+i)%TYPES.length],x=P.find(p=>p.type===t&&!u.has(uid(p)));if(x)return x}
  /* everything used once: reuse the oldest */
  const order=used.slice();return P.slice().sort((a,b)=>order.indexOf(uid(a))-order.indexOf(uid(b)))[0]}
const labelOf=x=>x?line('lx.unlock.'+x.type,x.sl,uid(x)):'';

/* ---------- 1. level-up -> one unlock ---------- */
function detect(){if(OFF())return null;const s=S0(),d=dir();if(!s?.player||!d)return null;const L=Number(d.lastLevel);if(!Number.isFinite(L))return null;const m=lx();
  if(!Number.isFinite(m.seen)){m.seen=d.pendingLevel&&Number(d.pendingLevel.level)===L?L-1:L;save0()} /* old save: no retro unlocks */
  if(L<=m.seen){if(L<m.seen)m.seen=L;return null}
  m.seen=L;if(m.unlocks[L])return null; /* max one per level */
  const x=choose(L,m.used);if(!x){save0();return null}
  const u={type:x.type,id:x.id,label:labelOf(x),day:day(),at:Date.now()};m.unlocks[L]=u;m.last=L;
  m.used=m.used.filter(k=>k!==uid(x));m.used.push(uid(x));
  if(x.type==='city'||x.type==='rival')m.queue.push({type:x.type,id:x.id,day:day(),tries:0});
  bell(L,u);save0();return u}
function bell(L,u){try{if(u.bell)return true;const re=new RegExp('^Level '+L+' reached'),rows=(S0().notifications||[]).filter(n=>re.test(String(n.text||'')));
  const n=rows.find(n=>/skill point/.test(n.text))||rows[0];if(!n)return false; /* the director157 row ("Level N reached · +1 skill point") */
  if(!n.lx244){n.text=String(n.text).replace(/\.\s*$/,'')+' · '+line('lx.ui.unlock',{label:u.label})+'.';n.lx244=L}u.bell=true;return true}catch{return false}}
function applyQueue(){const m=lx(),W=G('SCENE_WORLDFLOW');if(!m.queue.length||!W?.installed?.())return;const d=day();
  m.queue=m.queue.filter(q=>{if(d-q.day>3)return false;if(q.lastDay===d)return true;let ok=null;
    try{if(q.type==='city'){const w=W.state?.(),open=w?.cards?.active?.some(c=>c.status==='open');if(open)return true;ok=W.spawnCard(q.id)}
      else if(q.type==='rival')ok=W.rivalNow(q.id)}catch(e){console.warn('lx244 apply',e)}
    q.lastDay=d;q.tries++;if(ok){const u=Object.values(m.unlocks).find(u=>u.type===q.type&&u.id===q.id);if(u)u.applied=d;return false}return true});save0()}

/* surfaces on the existing moment (no new modal, card art untouched) */
function lastU(){const m=S0()?.[K];if(!m||!Number.isFinite(m.last))return null;const u=m.unlocks?.[m.last];return u?{level:m.last,...u}:null}
function decorate(){if(OFF())return;const u=lastU();if(!u)return;const txt=line('lx.ui.unlock',{label:u.label});
  document.querySelectorAll('.u12moment .u12new').forEach(ul=>{const to=Number((ul.closest('.u12card')?.querySelector('.u12to')?.getAttribute('aria-label')||'').replace(/\D/g,''));
    if(to&&to!==u.level)return;if(ul.querySelector('.lx244-unlock'))return;const li=document.createElement('li');li.className='lx244-unlock';li.dataset.lx244Unlock=u.type;
    li.style.setProperty('--d',(ul.children.length*90+520)+'ms');li.innerHTML='<b aria-hidden="true">✧</b><span><strong></strong></span>';li.querySelector('strong').textContent=txt;ul.appendChild(li)});
  const ov=document.getElementById('scene-overlay157');if(ov&&!ov.classList.contains('u12src')){const h=Number((ov.querySelector('h2')?.textContent||'').replace(/\D/g,''));const row=ov.querySelector('.scene-chiprow157');
    if(row&&h===u.level&&!row.querySelector('.lx244-chip')){const sp=document.createElement('span');sp.className='lx244-chip';sp.dataset.lx244Unlock=u.type;sp.textContent=txt;row.appendChild(sp)}}}

/* ---------- 2. what's next ---------- */
function snapFr(){const s=S0(),m=lx(),d=day();if(m.fr.day===d)return;const cur={};for(const t of(s.dms||[]))if(t?.id&&who(t.id)?.type==='celeb'){const f=Number(s.relations?.[t.id]?.friendship);if(Number.isFinite(f))cur[t.id]=f}
  m.fr={day:d,prev:m.fr.day===d-1?(m.fr.cur||{}):{},cur};save0()}
function cooling(){const s=S0(),m=lx();let best=null;
  for(const t of(s.dms||[])){const a=who(t?.id);if(!a||a.type!=='celeb'||a.custom)continue;const last=(t.messages||[])[t.messages.length-1];
    const unread=t.unread&&last&&last.from==='them';const f=Number(s.relations?.[a.id]?.friendship),p=Number(m.fr.prev?.[a.id]);const drop=Number.isFinite(f)&&Number.isFinite(p)&&f<p;
    if(!unread&&!drop)continue;const sc=(unread?Number(last.at)||1:0)+(drop?1e13:0);if(!best||sc>best.sc)best={a,sc,why:drop?'drop':'unread'}}
  return best}
function cityHint(){const s=S0(),m=s?.livingcity243;if(!m||window.SCENE_LIVINGCITY_OFF===true)return null;const p=s.player;if((p?.city||s.homeCity||'')!=='Los Angeles')return null;
  const d=day();if(Number(m.inCityDay)!==d)return null;
  for(const id of Object.keys(m.inCity||{})){if(!m.inCity[id])continue;const w=m.where?.[id];const sp=spots().find(x=>x.id===w);if(!sp||m.spot===w)continue;
    if((m.met||[]).includes(d+':'+w+':'+id))continue;const a=who(id);if(a)return{a,spot:sp}}return null}
function nextUnlock(){const d=dir(),m=S0()?.[K];const L=Number(d?.lastLevel)||1;const x=choose(L+1,(m?.used)||[]);return x?{level:L+1,type:x.type,id:x.id,label:labelOf(x)}:null}
function whatsNext(){const s=S0();if(!s?.player)return null;
  try{const wfOff=window.SCENE_WORLDFLOW_OFF===true||window.SCENE_TRAVELCARD_OFF===true,c=wfOff?null:s.worldflow236?.cards?.active?.find(c=>c.status==='open');
    if(c){let title='';try{title=G('SCENE_WORLDFLOW')?.line?.(`wf.card.${c.tpl}.title`,c.sl||{},'')||''}catch{}return{kind:'travel',id:c.id,text:line('lx.next.travel',{city:c.city,title:title||c.city,celeb:c.sl?.celeb||''},c.id)}}}catch{}
  try{const c=cooling();if(c)return{kind:'dm',id:c.a.id,why:c.why,text:line('lx.next.dm',{celeb:first(c.a)},c.a.id+day())}}catch{}
  try{const h=cityHint();if(h)return{kind:'city',id:h.a.id,spot:h.spot.id,text:line('lx.next.city',{spot:h.spot.label,celeb:first(h.a)},h.a.id+day())}}catch{}
  try{const n=nextUnlock();if(n)return{kind:'level',level:n.level,text:line('lx.next.level',{n:n.level,label:n.label},'L'+n.level)}}catch{}
  return{kind:'idle',text:line('lx.next.idle',{},'idle'+day())}}

/* ---------- Career line (own element, never render()) ---------- */
function css(){if(document.getElementById('lx244css'))return;const st=document.createElement('style');st.id='lx244css';
  st.textContent='.lx244{margin:6px 16px 4px;font-size:12.5px;line-height:1.35;opacity:.82}.lx244 .lx244-next{display:block}.lx244 .lx244-last{display:block;font-size:11px;opacity:.7;margin-top:2px}.lx244 .lx244-last:empty{display:none}';
  document.head.appendChild(st)}
function host(){const h=document.querySelector('.u10-head');if(h&&h.parentElement)return{after:h};const i=document.querySelector('.careerpanelintro');if(i)return{after:i};
  const c=document.querySelector('.career48');return c?{prepend:c}:null}
let lastSig='';
function draw(){try{const old=document.querySelector('.lx244');const s=S0();
  if(OFF()||!s?.player||s.tab!=='world'){old?.remove();return}
  const h=host();if(!h){old?.remove();return}
  const n=whatsNext(),u=lastU();let el=old;
  const ok=el&&(h.after?el.previousElementSibling===h.after:el.parentNode===h.prepend&&el===h.prepend.firstElementChild);
  if(!ok){old?.remove();el=document.createElement('div');el.className='lx244';el.setAttribute('aria-live','off');el.innerHTML='<span class="lx244-next"></span><span class="lx244-last"></span>';
    if(h.after)h.after.after(el);else h.prepend.prepend(el);lastSig=''}
  const lt=u?line('lx.ui.last',{label:u.label}):'',sig=(n?.kind||'')+'|'+(n?.text||'')+'|'+lt;if(sig===lastSig&&ok)return;lastSig=sig;
  css();el.dataset.lx244Kind=n?.kind||'';const a=el.querySelector('.lx244-next'),b=el.querySelector('.lx244-last');
  a.dataset.lx244Next=n?.kind||'';a.textContent=n?.text||'';b.dataset.lx244Type=u?.type||'';b.textContent=lt}catch(e){console.warn('lx244 draw',e)}}

/* ---------- tick ---------- */
function tick(){if(OFF()){document.querySelector('.lx244')?.remove();const m=S0()?.[K],L=Number(dir()?.lastLevel);if(m&&Number.isFinite(m.seen)&&Number.isFinite(L)&&L>m.seen)m.seen=L;return}const s=S0();if(!s?.player||!dir())return;
  detect();const m=S0()[K];if(m&&Number.isFinite(m.last)&&m.unlocks[m.last]&&!m.unlocks[m.last].bell&&day()-m.unlocks[m.last].day<=1&&bell(m.last,m.unlocks[m.last]))save0();
  snapFr();applyQueue();decorate();draw()}
let INSTALLED=false;
function install(){INSTALLED=true;setInterval(()=>{try{tick()}catch(e){console.warn('lx244 tick',e)}},1000);
  try{new MutationObserver(ms=>{let hit=false;for(const r of ms)for(const n of r.addedNodes)if(n.nodeType===1&&(n.id==='scene-overlay157'||n.classList?.contains('u12moment')||n.closest?.('.u12moment')||n.querySelector?.('.u10-head,.careerpanelintro')))hit=true;
    if(hit&&!OFF()){try{detect();decorate();draw()}catch{}}}).observe(document.body,{childList:true,subtree:true})}catch{}
  tick()}
function bootReady(){try{const s=S0();return s&&s.player&&s.sceneDirector157&&typeof save==='function'&&typeof byId==='function'&&!document.querySelector('.migrationboot')}catch{return false}}
const w=setInterval(()=>{if(bootReady()){clearInterval(w);install()}},400);
window.SCENE_LEVELNEXT={version:V,key:K,installed:()=>INSTALLED,state:()=>S0()?.[K]||null,lastUnlock:()=>lastU(),nextUnlock,whatsNext,pool,tick:()=>tick(),line};
})();
