/* SCENE v139 — proper Following manager from the You profile. */
(()=>{
'use strict';
if(globalThis.SCENE_FOLLOWING139)return;

function followingAccounts139(){
 const ids=Array.isArray(state?.followingIds)?state.followingIds:[];
 return ids.map(id=>byId(id)).filter(Boolean).sort((a,b)=>String(a.name||'').localeCompare(String(b.name||'')));
}
function unfollow139(id){
 const a=byId(id),i=(state.followingIds||[]).indexOf(id);if(!a||i<0)return;
 state.followingIds.splice(i,1);
 remember('unfollow',{celebrityId:id,celebrity:a.name,source:'you_following_manager'});
 save();
 flash(`Unfollowed ${a.name}`);
}
function followingRow139(a){
 const mutual=typeof followsMe==='function'&&followsMe(a.id);
 return `<div class="followingrow139" data-follow-row="${esc(a.id)}">
  <button class="followingidentity139" type="button" data-follow-profile="${esc(a.id)}">${av(a,'followingavatar139')}<span><strong>${esc(a.name)} ${a.type==='celeb'||a.type==='media'?check():''}</strong><small>@${esc(a.handle||'')} ${mutual?'<em>Follows you</em>':''}</small><i>${esc(a.role||'Public figure')}</i></span></button>
  <button class="unfollow139" type="button" data-unfollow="${esc(a.id)}">Unfollow</button>
 </div>`;
}
function openFollowing139(){
 const total=followingAccounts139().length;
 showSheet('Following',`<div class="followingmanager139">
  <div class="followingintro139"><div><strong>${fmt(total)}</strong><span>Following</span></div><p>People and accounts you chose to follow in SCENE. Open a profile or unfollow directly here.</p></div>
  <label class="followingsearch139"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="5.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m15 15 4.2 4.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg><input id="followingsearch139" type="search" placeholder="Search following" autocomplete="off" autocapitalize="off"></label>
  <div class="followinglist139" id="followinglist139"></div>
  <button class="findpeople139" id="findpeople139" type="button">＋ Find people to follow</button>
 </div>`);
 const input=$('#followingsearch139'),list=$('#followinglist139'),intro=modal.querySelector('.followingintro139 strong');
 function draw(){
  const all=followingAccounts139(),q=String(input?.value||'').trim().toLowerCase(),shown=q?all.filter(a=>`${a.name} ${a.handle} ${a.role}`.toLowerCase().includes(q)):all;
  if(intro)intro.textContent=fmt(all.length);
  list.innerHTML=shown.length?shown.map(followingRow139).join(''):`<div class="followingempty139"><span>${q?'⌕':'＋'}</span><strong>${q?'No matches':'You are not following anyone yet.'}</strong><p>${q?'Try a different name or handle.':'Find people from Search and they will appear here.'}</p></div>`;
  list.querySelectorAll('[data-follow-profile]').forEach(b=>b.onclick=()=>openProfile(b.dataset.followProfile));
  list.querySelectorAll('[data-unfollow]').forEach(b=>b.onclick=()=>{const id=b.dataset.unfollow,a=byId(id);if(!a)return;unfollow139(id);draw()});
 }
 if(input)input.oninput=draw;
 const find=$('#findpeople139');if(find)find.onclick=()=>openSearch();
 draw();
}

const baseRenderYou139=renderYou;
renderYou=function(){
 const html=baseRenderYou139(),count=fmt(playerFollowingCount()),plain=`<div><b>${count}</b><span>Following</span></div>`;
 const linked=`<button class="youfollowing139" type="button" data-open-following139 aria-label="View accounts you follow"><b>${count}</b><span>Following</span><i aria-hidden="true">›</i></button>`;
 return html.includes(plain)?html.replace(plain,linked):html;
};
const baseBind139=bind;
bind=function(){baseBind139();document.querySelectorAll('[data-open-following139]').forEach(b=>b.onclick=openFollowing139)};

globalThis.SCENE_FOLLOWING139={open:openFollowing139,version:139};
if(state?.player)render();
})();