(()=>{
'use strict';
if(globalThis.SCENE_MEDIA101)return;
const SOCIAL_CACHE_KEY='scene-social-photo-cache-v100',PIN_CACHE_KEY='scene-pinterest-cache-v101',POST_GAP=7*60*1000;
let socialCache={},pinCache={};
try{socialCache=JSON.parse(localStorage.getItem(SOCIAL_CACHE_KEY)||'{}')||{}}catch{}
try{pinCache=JSON.parse(localStorage.getItem(PIN_CACHE_KEY)||'{}')||{}}catch{}
function persist(){try{localStorage.setItem(SOCIAL_CACHE_KEY,JSON.stringify(socialCache));localStorage.setItem(PIN_CACHE_KEY,JSON.stringify(pinCache))}catch{}}
function canon(url=''){let s=String(url).replace(/&amp;/g,'&');try{const u=new URL(s);u.search='';s=u.toString()}catch{}return s.replace(/\/236x\//,'/SIZE/').replace(/\/474x\//,'/SIZE/').replace(/\/564x\//,'/SIZE/').replace(/\/736x\//,'/SIZE/')}
function allowed(url=''){return /^https:\/\/(?:pbs\.twimg\.com\/media|[^/]*cdninstagram\.com|i\.pinimg\.com)\//i.test(String(url))}
function ledger(){state.mediaLedger101=Array.isArray(state.mediaLedger101)?state.mediaLedger101:[];return state.mediaLedger101}
function used(url,ownerId=''){const k=canon(url);return Boolean(k)&&ledger().some(x=>x.key===k&&x.ownerId!==ownerId)}
function mark(a,url,kind,ownerId=''){const k=canon(url);if(!k)return;state.mediaLedger101=ledger().filter(x=>x.key!==k);state.mediaLedger101.unshift({key:k,url,celebrityId:a?.id||'',kind,ownerId,at:now()});state.mediaLedger101=state.mediaLedger101.slice(0,80)}
function pickUnused(items,a,seed,ownerId=''){const fresh=(items||[]).filter(x=>x?.url&&allowed(x.url)&&!used(x.url,ownerId));if(!fresh.length)return null;return fresh[Math.abs(hash(`${a.id}|${seed}`))%fresh.length]}
async function fetchProfile(path,handle){if(!handle)return[];try{const r=await fetch(`${API}/${path}?handle=${encodeURIComponent(handle)}`);if(!r.ok)return[];const d=await r.json();return (d.profiles?.[0]?.items||[]).filter(x=>x?.url&&allowed(x.url))}catch{return[]}}
async function socialMedia(a){if(!a||a.custom)return[];const c=socialCache[a.id];if(c&&Array.isArray(c.items)&&(globalThis.SCENE_BANDWIDTH_SAFE203||Date.now()-(c.at||0)<4*3600000))return c.items;if(globalThis.SCENE_BANDWIDTH_SAFE203)return[];const x=typeof X!=='undefined'?X?.[a.id]:'',ig=typeof IG!=='undefined'?IG?.[a.id]:'';const [xi,ii]=await Promise.all([fetchProfile('x-media',x),fetchProfile('instagram-media',ig)]),seen=new Set(),items=[...ii,...xi].filter(item=>{const k=canon(item.url);if(!k||seen.has(k))return false;seen.add(k);return true}).sort((a,b)=>(Number(b.takenAt)||0)-(Number(a.takenAt)||0)).slice(0,22);socialCache[a.id]={at:Date.now(),items};persist();return items}
function visualIntent(a,text=''){const t=String(text).toLowerCase();let q='candid recent photo',specific=false;
 if(/jet|plane|flight|airport|runway|boarding|tarmac/.test(t)){q='private jet airport runway boarding tarmac candid';specific=true}
 else if(/studio|record|mix|board|console|song|track|session|lights off/.test(t)){q='recording studio mixing console music session candid';specific=true}
 else if(/backstage|stage|concert|show|soundcheck|rehears/.test(t)){q='backstage concert stage rehearsal candid';specific=true}
 else if(/gym|workout|training|run\b/.test(t)){q='gym workout training candid';specific=true}
 else if(/mirror|outfit|fit\b|fashion|fitting|look\b/.test(t)){q='mirror selfie outfit fashion candid';specific=true}
 else if(/beach|pool|boat|yacht|vacation|holiday/.test(t)){q='vacation beach pool boat candid';specific=true}
 else if(/car|drive|road|traffic/.test(t)){q='car candid driving passenger photo';specific=true}
 else if(/hotel|room|view|balcony|city/.test(t)){q='hotel travel city view candid';specific=true}
 else if(/camera roll|selfie|from earlier|one from today|no context|photo|dump/.test(t)){q='candid selfie camera roll casual';specific=false}
 return {query:`${a.name} ${q}`,specific};
}
async function pinterestMedia(a,text){const intent=visualIntent(a,text),key=`${a.id}|${intent.query}`;const c=pinCache[key];if(c&&Array.isArray(c.items)&&(globalThis.SCENE_BANDWIDTH_SAFE203||Date.now()-(c.at||0)<12*3600000))return {items:c.items,intent};if(globalThis.SCENE_BANDWIDTH_SAFE203)return {items:[],intent};try{const r=await fetch(`${API}/pinterest-media?name=${encodeURIComponent(a.name)}&intent=${encodeURIComponent(intent.query.replace(a.name,'').trim())}`);if(!r.ok)return {items:[],intent};const d=await r.json(),items=(d.items||[]).filter(x=>x?.url&&allowed(x.url));pinCache[key]={at:Date.now(),items};persist();return {items,intent}}catch{return {items:[],intent}}
}
async function aiCaption(a,item,mode,seedText=''){return String(item?.text||item?.alt||seedText||'').replace(/\s+/g,' ').trim().slice(0,240)}
async function contextualizePost(p,a){if(!state?.player||!p||!a||a.type!=='celeb'||a.custom)return false;if(now()-(state.lastAiPhotoPostAt101||0)<POST_GAP)return false;let item=pickUnused(await socialMedia(a),a,`${p.id}|social`,p.id);if(!item){const pin=await pinterestMedia(a,p.text||'candid');item=pickUnused(pin.items,a,`${p.id}|pin`,p.id)}if(!item)return false;const caption=await aiCaption(a,item,'post',p.text||'');if(!caption)return false;p.media=item.url;p.text=caption;p.socialPhoto101=true;p.socialPhotoSource101=item.source||'';p.autoMedia=false;mark(a,item.url,'post',p.id);state.lastAiPhotoPostAt101=now();save();if(state.tab==='feed'&&!modal.dataset.dm)render();return true}
async function hydrateStory(s,a){if(!s||!a||a.type!=='celeb'||a.custom)return false;if(s.media&&allowed(s.media)&&!used(s.media,s.id)){mark(a,s.media,'story',s.id);return true}if(s.media&&!allowed(s.media))s.media='';if(s.media&&used(s.media,s.id))s.media='';if(s.mediaHydrating101)return false;s.mediaHydrating101=true;try{const intent=visualIntent(a,s.caption||''),social=await socialMedia(a);let item=null;
  if(intent.specific){const pin=await pinterestMedia(a,s.caption||'');item=pickUnused(pin.items,a,`${s.id}|pin`,s.id)}
  if(!item)item=pickUnused(social,a,`${s.id}|social`,s.id);
  if(!item&&!intent.specific){const pin=await pinterestMedia(a,s.caption||'candid');item=pickUnused(pin.items,a,`${s.id}|pin2`,s.id)}
  if(!item)return false;
  s.media=item.url;s.scene='photo';s.captionPos='low';s.sticker='';s.socialPhoto101=true;s.socialPhotoSource101=item.source||'';mark(a,item.url,'story',s.id);
  if(intent.specific&&!/Pinterest/i.test(item.source||'')){const c=await aiCaption(a,item,'story',s.caption||'');if(c)s.caption=c}
  save();return true;
 }finally{s.mediaHydrating101=false}
}
async function hydrateStories(limit=7){if(!state?.player)return;const list=(state.stories||[]).slice(0,limit);for(const s of list){const a=byId(s.authorId);if(!a||s.media&&allowed(s.media)&&!used(s.media,s.id))continue;await hydrateStory(s,a)}if(modal.querySelector('.storyscreen')&&typeof drawStory==='function')drawStory();else if(state.tab==='feed')render()}
function repairExisting(){let changed=false;const seen=new Set();state.mediaLedger101=[];for(const p of state.posts||[]){const a=byId(p.authorId);if(a?.type!=='celeb'||a.custom||!p.media)continue;if(!allowed(p.media)){p.media='';p.autoMedia=false;changed=true;continue}const k=canon(p.media);if(seen.has(k)){p.media='';p.autoMedia=false;changed=true}else{seen.add(k);mark(a,p.media,'post',p.id)}}for(const s of state.stories||[]){const a=byId(s.authorId);if(a?.type!=='celeb'||a.custom||!s.media)continue;if(!allowed(s.media)||seen.has(canon(s.media))){s.media='';changed=true}else{seen.add(canon(s.media));mark(a,s.media,'story',s.id)}}if(changed)save()}
function cleanPeople(){const norm=x=>String(x||'').replace(/\s+-\s+(?:People(?:\.com)?|PEOPLE)$/i,'').replace(/\s+/g,' ').trim(),seen=new Set(),out=[];for(const p of state.posts||[]){if(p.authorId==='people'){p.text=norm(p.text);p.sourceName='';p.sourceUrl='';const sig=p.text.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();if(seen.has(sig))continue;seen.add(sig)}out.push(p)}if(out.length!==state.posts.length){state.posts=out;save()}else save()}
const baseMkPost=mkPost;mkPost=function(a,minutes=0,text='',opts={}){const p=baseMkPost(a,minutes,text,opts);if(a?.type==='celeb'&&!a.custom&&p.autoMedia){p.media='';setTimeout(()=>void contextualizePost(p,a),30)}return p};
if(typeof enhancedStory==='function'){const baseEnhanced=enhancedStory;enhancedStory=function(a,offset=0){const s=baseEnhanced(a,offset);if(a?.type==='celeb'&&!a.custom){s.media='';s.scene=s.scene==='photo'?'room':s.scene}return s}}
if(typeof updateStories==='function'){const baseUpdate=updateStories;updateStories=function(){const out=baseUpdate();setTimeout(()=>void hydrateStories(8),50);return out}}
if(typeof drawStory==='function'){const baseDraw=drawStory;drawStory=function(){const s=state.stories?.[storyIndex],a=s?byId(s.authorId):null;if(s&&a&&!s.media&&!s.mediaHydrating101)void hydrateStory(s,a).then(ok=>{if(ok&&modal.querySelector('.storyscreen'))baseDraw()});return baseDraw()}}
function queue(p,a){return contextualizePost(p,a)}
async function prime(){repairExisting();cleanPeople();if(!state?.player)return;await hydrateStories(7);setTimeout(()=>void hydrateStories(15),3500);const candidate=(state.posts||[]).slice(0,18).find(p=>{const a=byId(p.authorId);return a?.type==='celeb'&&!a.custom&&!p.media&&p.autoMedia});if(candidate)void contextualizePost(candidate,byId(candidate.authorId))}
globalThis.SCENE_MEDIA101={version:101,queue,contextualizePost,hydrateStory,hydrateStories,socialMedia,repairExisting,cleanPeople};
setTimeout(()=>void prime(),250);
})();