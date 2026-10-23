(()=>{
'use strict';
if(globalThis.SCENE_BETA94)return;
globalThis.SCENE_BETA94={version:142};
globalThis.SCENE_BETA95=globalThis.SCENE_BETA94;
const COUNTRIES94={'Los Angeles':'USA','New York':'USA','Cape Town':'South Africa','Johannesburg':'South Africa','London':'United Kingdom','Paris':'France','Dubai':'UAE','Tokyo':'Japan'};
state.betaMode=true;
if(state.player&&!state.economyRebalanced94){const fame=Number(state.player.fame)||0,followers=Number(state.player.followers)||0,cash=Number(state.player.money)||0;if(fame<15&&followers<1000&&cash>1500)state.player.money=750;else if(fame<40&&followers<10000&&cash>5000)state.player.money=2500;state.economyRebalanced94=true}
if(!state.liveSourceRepair94){const sourceMatch={bbcnews:/bbc/i,skynews:/sky/i,tmz:/tmz/i,billboard:/billboard/i,variety:/variety/i,vogue:/vogue/i,rollingstone:/rolling stone/i,enews:/e!|e news/i,people:/people/i};state.posts=(state.posts||[]).filter(p=>{if(!p?.liveNews||!p.sourceName||!sourceMatch[p.authorId])return true;return sourceMatch[p.authorId].test(String(p.sourceName))});state.liveSourceRepair94=true}
if(!state.currencyRepair95){for(const q of state.missions?.quests||[]){if(q.rewardLabel)q.rewardLabel=String(q.rewardLabel).replace(/\bR(?=\d)/g,'$');if(!q.claimed&&q.id==='q1'&&Number(q.reward?.money)>100){q.reward.money=100;q.rewardLabel='$100 · 10 XP · +1 fame · +10 energy'}if(!q.claimed&&q.id==='q3'&&Number(q.reward?.money)>180){q.reward.money=180;q.rewardLabel='$180 · 15 XP · +2 fame · +2 rep · +15 energy'}}for(const n of state.notifications||[])if(n.text)n.text=String(n.text).replace(/([+\-])R(?=\d)/g,'$1$');state.currencyRepair95=true}
function betaEnergy94(){if(!state.player)return;state.player.energy=100;state.lastEnergyAt=now()}
betaEnergy94();try{save()}catch{}
recoverEnergy=function(){betaEnergy94();return 0};
const baseApplyEffect95=applyEffect;applyEffect=function(e={}){const copy={...e};if(state.betaMode&&Number(copy.energy)<0)copy.energy=0;const out=baseApplyEffect95(copy);if(state.betaMode)betaEnergy94();return out};
setInterval(()=>{if(state?.betaMode&&state?.player&&state.player.energy!==100)betaEnergy94()},1500);

const X_CACHE94='scene-x-profile-meta-v142';let xMeta94={};try{const c=JSON.parse(localStorage.getItem(X_CACHE94)||'{}');xMeta94=c.data||{};if(c.at)xMeta94.__at=c.at}catch{}
const PROFILE_IMAGE_CACHE144='scene-profile-images-v145';let profileImages144={};try{profileImages144=JSON.parse(localStorage.getItem(PROFILE_IMAGE_CACHE144)||'{}')||{}}catch{}
function usableSocialBio94(s=''){const t=String(s||'').replace(/\s+/g,' ').trim();if(!t)return'';if(/\b[\d,.]+\s+followers?\b/i.test(t)&&/\b[\d,.]+\s+following\b/i.test(t))return'';if(/\bjoined\s+(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}\b/i.test(t))return'';if(/see the latest (?:posts|conversations|updates) (?:from|with)/i.test(t))return'';if(/see instagram photos and videos/i.test(t))return'';return t.slice(0,700)}
globalThis.SCENE_SOCIAL_BIO139=usableSocialBio94;
function applyX94(data){for(const [handle,p] of Object.entries(data||{})){const a=ACCOUNTS.find(x=>String(X?.[x.id]||'').toLowerCase()===handle.toLowerCase());if(!a||!p)continue;if(p.image)a.xPhoto94=p.image;const bio=usableSocialBio94(p.bio);if(bio)a.xBio94=bio;else delete a.xBio94}}
function applyProfileImages144(){for(const [id,v] of Object.entries(profileImages144)){const a=byId(id);if(!a||Date.now()-(v?.at||0)>=7*24*3600000)continue;if(v?.image)a.sceneVerifiedPhoto142=v.image;if(v?.pinterestImage)a.scenePinterestPhoto144=v.pinterestImage}}
applyX94(xMeta94);applyProfileImages144();
function usableAvatarUrl144(url=''){const s=String(url||'').trim();if(!s)return'';if(/^data:image\//i.test(s))return s;if(!/^https:\/\//i.test(s))return'';if(/(?:signature|sig(?:nature)?[._-]|wordmark|logo|icon|coat[_ -]?of[_ -]?arms|\.svg(?:\.png)?)(?:[/?#]|$)/i.test(s))return'';return s}
function avatarCandidates144(a){if(!a||a.type==='player')return[];const x=X?.[a.id],ig=IG?.[a.id],wiki=usableAvatarUrl144(a.sceneVerifiedPhoto142),raw=[a.scenePhoto111,a.custom?a.photo:'',a.xPhoto94,a.sceneIgPhoto137,wiki,x?`https://unavatar.io/x/${encodeURIComponent(x)}`:'',!a.custom?a.photo:'','',a.scenePinterestPhoto144],seen=new Set(),out=[];for(const u0 of raw){const u=usableAvatarUrl144(u0);if(!u||seen.has(u))continue;seen.add(u);out.push(u)}return out}
function socialAvatar94(a){return avatarCandidates144(a)[0]||''}
socialAvatar=socialAvatar94;
av=function(a,cls=''){const candidates=avatarCandidates144(a),src=candidates[0]||'',next=encodeURIComponent(JSON.stringify(candidates.slice(1)));return `<span class="avatar ${cls}" aria-label="${esc(a.name)}">${src?`<img loading="lazy" src="${esc(src)}" data-avatar-next="${esc(next)}" alt="${esc(a.name)}" onerror="try{const q=JSON.parse(decodeURIComponent(this.dataset.avatarNext||'%5B%5D')),n=q.shift();this.dataset.avatarNext=encodeURIComponent(JSON.stringify(q));if(n){this.src=n;return}}catch(e){}this.remove()">`:''}<span>${initials(a.name)}</span></span>`};
const baseShortBio94=shortBio;shortBio=function(a){return a?.sceneIgBio139||usableSocialBio94(a?.xBio94)||baseShortBio94(a)};
async function hydrateX94(){
 if(globalThis.SCENE_BANDWIDTH_SAFE203)return;
 const cachedAt=Number(xMeta94.__at)||0;if(Date.now()-cachedAt<6*3600000)return;
 const pairs=Object.entries(X||{}).filter(([id,h])=>byId(id)&&h),next={};
 for(let i=0;i<pairs.length;i+=10){const batch=pairs.slice(i,i+10),handles=batch.map(x=>x[1]).join(',');try{const r=await fetch(`${API}/x-profiles?handles=${encodeURIComponent(handles)}`);if(!r.ok)continue;const d=await r.json();for(const p of d.profiles||[])if(p?.handle&&p.ok)next[p.handle]=p}catch(e){}}
 if(Object.keys(next).length){xMeta94={...xMeta94,...next,__at:Date.now()};try{localStorage.setItem(X_CACHE94,JSON.stringify({at:xMeta94.__at,data:xMeta94}))}catch{}applyX94(next);render()}
}
async function hydrateProfileImages142(){
 if(globalThis.SCENE_BANDWIDTH_SAFE203)return;
 const targets=ACCOUNTS.filter(a=>a.type==='celeb'&&!a.custom&&a.id!=='kim').filter(a=>{const v=profileImages144[a.id];return(!v?.image&&!v?.pinterestImage)||Date.now()-(v?.at||0)>7*24*3600000});
 for(let i=0;i<targets.length;i+=8){const batch=targets.slice(i,i+8).map(a=>({id:a.id,name:a.name,wiki:a.wiki||'',x:X?.[a.id]||''}));try{const r=await fetch(`${API}/profile-images?items=${encodeURIComponent(JSON.stringify(batch))}`);if(!r.ok)continue;const d=await r.json();let changed=false;for(const p of d.profiles||[]){if(!p?.id||(!p.image&&!p.pinterestImage))continue;profileImages144[p.id]={image:p.image||'',source:p.source||'',pinterestImage:p.pinterestImage||'',pinterestSource:p.pinterestSource||'',at:Date.now()};const a=byId(p.id);if(a){if(p.image)a.sceneVerifiedPhoto142=p.image;if(p.pinterestImage)a.scenePinterestPhoto144=p.pinterestImage;changed=true}}if(changed){try{localStorage.setItem(PROFILE_IMAGE_CACHE144,JSON.stringify(profileImages144))}catch{}if(state?.player)render()}}catch{}await new Promise(r=>setTimeout(r,120))}
}

const NAV94={feed:'<svg viewBox="0 0 24 24"><path d="M3.5 10.5 12 3l8.5 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-4.5v-6h-5v6H5a1.5 1.5 0 0 1-1.5-1.5v-9Z"/></svg>',world:'<svg viewBox="0 0 24 24"><path d="M7 6V4.8C7 3.8 7.8 3 8.8 3h6.4c1 0 1.8.8 1.8 1.8V6M4 7h16a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 20 19H4a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 4 7Z"/><path d="M2.8 12.2c3.1 1.2 6.1 1.8 9.2 1.8s6.1-.6 9.2-1.8M10 12h4v4h-4z"/></svg>',circle:'<svg viewBox="0 0 24 24"><path d="M4 5.5h11a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9l-4.5 3v-3.4A3 3 0 0 1 2 13.2V7.5A2 2 0 0 1 4 5.5Z"/><path d="M18 8.5h1a3 3 0 0 1 3 3v3a3 3 0 0 1-2.2 2.9V20l-3.3-2.2"/></svg>',you:'<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4.5 21c.5-4.2 3.1-6.5 7.5-6.5s7 2.3 7.5 6.5"/></svg>'};
function decorate94(){
 if(!state.player)return;
 betaEnergy94();
 const meta=document.querySelector('.topbar .meta');if(meta&&!document.querySelector('.location94')){const city=state.player.city||'Los Angeles',home=city===(state.homeCity||'Los Angeles'),loc=document.createElement('div');loc.className='location94';loc.innerHTML=`<span>${home?'⌂':'⌖'}</span><b>${home?'LA HOMETOWN':`CURRENTLY IN ${esc(city.toUpperCase())}`}</b><em>${esc(COUNTRIES94[city]||'')}</em>`;meta.insertAdjacentElement('afterend',loc)}
 const energy=document.querySelector('.hudrow .energy');if(energy){const b=energy.querySelector('b'),em=energy.querySelector('em');if(b)b.textContent='∞';if(em)em.textContent='Energy · BETA';energy.classList.add('betaenergy94')}
 for(const btn of document.querySelectorAll('.navbtn[data-tab]')){const key=btn.dataset.tab,span=btn.querySelector(':scope > span');if(span&&NAV94[key]){span.innerHTML=NAV94[key];span.classList.add('navsvg94')}}
}
const baseRender94=render;render=function(){betaEnergy94();const out=baseRender94();decorate94();return out};
const baseOpenProfile94=openProfile;openProfile=function(id){baseOpenProfile94(id);const a=byId(id),liveBio=a?.sceneIgBio139||usableSocialBio94(a?.xBio94);if(liveBio&&!a?.sceneEdited111){const bio=modal.querySelector('.xbio');if(bio)bio.textContent=liveBio}}

function postingHud94(){let el=document.querySelector('.postinghud94');if(el)el.remove();el=document.createElement('div');el.className='postinghud94';el.innerHTML='<div><span class="postingmark94">SCENE</span><strong>Posting…</strong><i><b></b></i><small>Sending it to the timeline</small></div>';document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('on'));return el}
const baseOpenCompose94=openCompose;openCompose=function(){baseOpenCompose94();const btn=$('#publish');if(!btn)return;const original=btn.onclick;btn.onclick=e=>{const text=$('#posttext')?.value.trim()||'',photo=!$('#composepreview')?.classList.contains('hidden');if(!text&&!photo)return original?.call(btn,e);btn.disabled=true;const hud=postingHud94(),bar=hud.querySelector('b');setTimeout(()=>{if(bar)bar.style.width='72%'},80);setTimeout(()=>{try{original?.call(btn,e)}finally{if(bar)bar.style.width='100%';const strong=hud.querySelector('strong'),small=hud.querySelector('small');if(strong)strong.textContent='Posted';if(small)small.textContent='Your post is live';hud.classList.add('done');setTimeout(()=>hud.remove(),650)}},620)}};

const baseClose94=closeModal;closeModal=function(){delete modal.dataset.eventresolve;return baseClose94()};

decorate94();setTimeout(()=>{void hydrateX94();void hydrateProfileImages142()},250);
})();
