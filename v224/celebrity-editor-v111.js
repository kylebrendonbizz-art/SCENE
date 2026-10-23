(()=>{
'use strict';
if(globalThis.SCENE_CELEB_EDITOR111)return;

const KEY111='scene-celebrity-edits-v111';
const own111=(o,k)=>Object.prototype.hasOwnProperty.call(o||{},k);
let edits111={};
try{edits111=JSON.parse(localStorage.getItem(KEY111)||'{}')||{}}catch{edits111={}}
function persist111(){try{localStorage.setItem(KEY111,JSON.stringify(edits111))}catch{}}

function applyEdit111(a,o=edits111[a?.id]){
 if(!a||!o)return a;
 if(own111(o,'name')&&String(o.name||'').trim())a.name=String(o.name).trim();
 if(own111(o,'handle')&&String(o.handle||'').trim())a.handle=String(o.handle).replace(/^@/,'').trim();
 if(own111(o,'role'))a.role=String(o.role||'Public figure').trim()||'Public figure';
 if(own111(o,'reach')&&Number.isFinite(Number(o.reach)))a.reach=Math.max(0,Number(o.reach));
 if(own111(o,'bio')){a.sceneBio111=String(o.bio||'');a.bio=String(o.bio||'')}
 if(own111(o,'personaBio'))a.personaBio=String(o.personaBio||'');
 if(own111(o,'photo')&&o.photo)a.scenePhoto111=String(o.photo);else delete a.scenePhoto111;
 a.sceneEdited111=true;
 return a
}
for(const a of celebs||[])applyEdit111(a);

const baseSocialAvatar111=typeof socialAvatar==='function'?socialAvatar:null;
if(baseSocialAvatar111){socialAvatar=function(a){return a?.scenePhoto111||baseSocialAvatar111(a)}}
const baseAv111=av;
av=function(a,cls=''){
 if(!a?.scenePhoto111)return baseAv111(a,cls);
 return `<span class="avatar ${cls}" aria-label="${esc(a.name)}"><img loading="lazy" src="${esc(a.scenePhoto111)}" alt="${esc(a.name)}" onerror="this.remove()"><span>${initials(a.name)}</span></span>`
};
const baseShortBio111=shortBio;
shortBio=function(a){if(a&&own111(a,'sceneBio111'))return a.sceneBio111||a.role;return baseShortBio111(a)};

function currentBio111(a){const o=edits111[a.id];if(own111(o,'bio'))return String(o.bio||'');const valid=globalThis.SCENE_SOCIAL_BIO139||((s='')=>String(s||'').trim());return String(valid(a.sceneIgBio139)||valid(a.xBio94)||'')}
function currentPersona111(a){const o=edits111[a.id];if(own111(o,'personaBio'))return String(o.personaBio||'');const guide=String(a.characterGuide137||a.personaBio||'').trim(),facts=String(a.factualDossier137||'').trim();if(guide&&facts&&!guide.includes(facts.slice(0,120)))return `${guide}\n\nPublic background: ${facts}`.slice(0,5000);return String(guide||facts||a.bio||'').slice(0,5000)}
function currentPhoto111(a){const o=edits111[a.id];if(own111(o,'photo')&&o.photo)return String(o.photo);return ''}
function returnToProfile111(id){setTimeout(()=>openProfile(id),0)}

function wireSheetReturn111(id){
 const close=modal.querySelector('.close');if(close){close.setAttribute('aria-label','Back to profile');close.onclick=()=>returnToProfile111(id)}
 const overlay=modal.querySelector('.overlay');if(overlay)overlay.onclick=e=>{if(e.target===e.currentTarget)returnToProfile111(id)}
}

function openCelebrityMenu111(id){
 const a=byId(id);if(!a)return;
 showSheet(a.name,`<div class="profilemenu111">
  <button id="editcelebmenu111"><span>✎</span><div><strong>Edit celebrity</strong><small>Name, photo, followers, bio and personality</small></div><b>›</b></button>
  <button id="aboutcelebmenu111"><span>ⓘ</span><div><strong>About & public profiles</strong><small>View source bio and linked public accounts</small></div><b>›</b></button>
 </div>`);
 wireSheetReturn111(id);
 $('#editcelebmenu111').onclick=()=>openCelebrityEditor111(id);
 $('#aboutcelebmenu111').onclick=()=>{openAbout(a);wireSheetReturn111(id)};
}

function openCelebrityEditor111(id){
 const a=byId(id);if(!a||a.type!=='celeb')return;
 const o=edits111[id]||{},bio=currentBio111(a),persona=currentPersona111(a),photo=currentPhoto111(a);
 showSheet('Edit celebrity',`<div class="editprofile celebeditor111" data-celeb-editor111="${esc(id)}">
  <div class="celebeditintro111"><small>SCENE CHARACTER</small><strong>Edit ${esc(a.name)}</strong><span>These changes only affect your SCENE world. The detailed description shapes how they talk to you, react and post.</span></div>
  <div class="editavatar celebeditavatar111"><div id="celebavatar111">${av(a,'large')}</div><label class="btn secondary celebphotobtn111">Change photo<input id="celebphoto111" type="file" accept="image/*" hidden></label></div>
  <label class="field"><span>Name</span><input id="celebname111" maxlength="80" value="${esc(a.name)}"></label>
  <label class="field"><span>Handle</span><div class="celebhandle111"><i>@</i><input id="celebhandle111" maxlength="40" value="${esc(a.handle)}" autocapitalize="none" spellcheck="false"></div></label>
  <label class="field"><span>Role</span><input id="celebrole111" maxlength="100" value="${esc(a.role||'Public figure')}"></label>
  <label class="field"><span>Followers</span><input id="celebreach111" inputmode="numeric" value="${Math.max(0,Math.round(Number(a.reach)||0))}"></label>
  <label class="field"><span>Public bio</span><textarea id="celebbio111" maxlength="700" rows="4" placeholder="What appears on their SCENE profile…">${esc(bio)}</textarea><b class="fieldcount111" id="biocount111">${bio.length}/700</b></label>
  <label class="field characterdescription111"><span>Description <em>optional</em></span><small>Go deeper than the bio: personality, backstory, humour, privacy, interests, relationships and how they speak. SCENE uses this as character context.</small><textarea id="celebpersona111" maxlength="5000" rows="12" placeholder="Describe how this person should behave in your SCENE world…">${esc(persona)}</textarea><b class="fieldcount111" id="personacount111">${persona.length}/5000</b></label>
  <button class="btn blue full savecharacter111" id="saveceleb111">Save changes</button>
  ${!a.custom&&edits111[id]?'<button class="btn secondary full resetcharacter111" id="resetceleb111">Use live/default profile again</button>':''}
 </div>`);
 wireSheetReturn111(id);
 let chosenPhoto111=photo;
 const nameEl=$('#celebname111'),bioEl=$('#celebbio111'),personaEl=$('#celebpersona111');
 function updateCounts111(){const bc=$('#biocount111'),pc=$('#personacount111');if(bc)bc.textContent=`${bioEl.value.length}/700`;if(pc)pc.textContent=`${personaEl.value.length}/5000`}
 bioEl.oninput=personaEl.oninput=updateCounts111;
 if(!a.custom&&!edits111[id]&&globalThis.SCENE_CHARACTER135?.research){const initialBio=bio,initialPersona=persona;void globalThis.SCENE_CHARACTER135.research(a).then(entry=>{const active=modal.querySelector(`[data-celeb-editor111="${CSS.escape(id)}"]`);if(!entry||!active)return;if(bioEl.value===initialBio)bioEl.value=currentBio111(a);if(personaEl.value===initialPersona)personaEl.value=currentPersona111(a);updateCounts111()})}
 $('#celebphoto111').onchange=async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{
   chosenPhoto111=await imageFileToDataUrl(file);
   const box=$('#celebavatar111');if(box)box.innerHTML=`<span class="avatar large"><img src="${esc(chosenPhoto111)}" alt="${esc(nameEl.value||a.name)}"><span>${initials(nameEl.value||a.name)}</span></span>`;
   flash('New celebrity photo ready');
  }catch{flash('That photo could not be loaded.')}
 };
 $('#saveceleb111').onclick=()=>{
  const name=String(nameEl.value||'').trim(),handle=String($('#celebhandle111').value||'').replace(/^@/,'').replace(/\s+/g,'').trim(),role=String($('#celebrole111').value||'').trim()||'Public figure',reach=Math.max(0,Number(String($('#celebreach111').value||'').replace(/[^0-9]/g,''))||0),nextBio=String(bioEl.value||'').trim(),personaBio=String(personaEl.value||'').trim();
  if(!name)return flash('Give the celebrity a name.');
  if(!handle)return flash('Give the celebrity a handle.');
  if(ACCOUNTS.some(x=>x.id!==id&&String(x.handle||'').toLowerCase()===handle.toLowerCase()))return flash(`@${handle} is already being used.`);
  const next={name,handle,role,reach,bio:nextBio,personaBio};
  if(chosenPhoto111)next.photo=chosenPhoto111;else if(own111(o,'photo'))next.photo=o.photo;
  edits111[id]=next;persist111();applyEdit111(a,next);
  if(id==='kim'&&globalThis.SCENE_CHARACTER200?.saveStaticOverride)void globalThis.SCENE_CHARACTER200.saveStaticOverride(a,next);
  const raw=(state.customCelebs||[]).find(x=>x.id===id);
  if(raw)Object.assign(raw,{name,handle,role,reach,bio:nextBio,personaBio,photo:next.photo||raw.photo||''});
  remember('celebrity_edit',{celebrityId:id,celebrity:name});save();
  openProfile(id);flash(`${name} updated`);
 };
 const reset=$('#resetceleb111');if(reset)reset.onclick=()=>{delete edits111[id];persist111();if(id==='kim'&&globalThis.SCENE_CHARACTER200?.clearStaticOverride)void globalThis.SCENE_CHARACTER200.clearStaticOverride();flash('Restoring the live/default profile…');setTimeout(()=>location.reload(),420)};
}

const baseOpenProfile111=openProfile;
openProfile=function(id){
 const pre=byId(id);if(pre)applyEdit111(pre);
 baseOpenProfile111(id);
 const a=byId(id);if(!a)return;
 if(a.type==='celeb'){
  const actions=modal.querySelector('.xactions');if(actions)actions.classList.add('profileactions111');
  const more=modal.querySelector('#profilemore');if(more){more.setAttribute('aria-label','Celebrity options');more.onclick=()=>openCelebrityMenu111(id)}
  if(own111(a,'sceneBio111')){const bio=modal.querySelector('.xbio');if(bio)bio.textContent=a.sceneBio111||a.role}
  if(edits111[id]){const h=modal.querySelector('.xhandle');if(h&&!h.querySelector('.profileedited111'))h.insertAdjacentHTML('beforeend',' <span class="profileedited111">Edited</span>')}
 }
};

globalThis.SCENE_CELEB_EDITOR111={version:111,open:openCelebrityEditor111,apply:applyEdit111,getEdits:()=>JSON.parse(JSON.stringify(edits111))};
try{if(state?.player)render()}catch{}
})();
