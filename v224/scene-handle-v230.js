/* scene-handle-v230.js: player handle validator (pure).
   window.SCENE_HANDLE.validate(raw, {current}) -> {ok, value, error:null|'format'|'length'|'taken'}
   - normalises: trim, strip leading @, lowercase
   - allowed [a-z0-9._], length 3-20, no leading/trailing dot, no '..'
   - 'taken': equals any registry character's handle or id, or a news outlet handle, case-insensitive
   - {current}: if the normalised value equals the player's current handle it is always ok (keeping your handle in Edit Profile)
   No DOM, no state writes, no auto-run: nothing in this file calls validate(); the signup / edit-profile handler does. */
(function(){
 'use strict';
 const norm=raw=>String(raw==null?'':raw).trim().replace(/^@+/,'').toLowerCase();
 function reserved(){
  const out=new Set(),add=v=>{const s=String(v==null?'':v).trim().replace(/^@+/,'').toLowerCase();if(s)out.add(s)};
  let list=[];try{list=typeof ACCOUNTS!=='undefined'&&Array.isArray(ACCOUNTS)?ACCOUNTS:[]}catch{}
  try{if(typeof celebs!=='undefined'&&Array.isArray(celebs))list=list.concat(celebs)}catch{}
  for(const a of list){if(!a)continue;if(Array.isArray(a)){add(a[0]);add(a[3])}else if(typeof a==='object'){add(a.id);add(a.handle);add(a.x);add(a.ig)}}
  for(const name of ['IG','X']){try{const m=name==='IG'?(typeof IG!=='undefined'?IG:null):(typeof X!=='undefined'?X:null);if(m&&typeof m==='object')for(const v of Object.values(m))add(v)}catch{}}
  return out;
 }
 function validate(raw,opts){
  const value=norm(raw),current=opts&&opts.current!=null?norm(opts.current):'';
  if(current&&value===current)return{ok:true,value,error:null};
  if(/[^a-z0-9._]/.test(value))return{ok:false,value,error:'format'};
  if(value.length<3||value.length>20)return{ok:false,value,error:'length'};
  if(/^\.|\.$|\.\./.test(value))return{ok:false,value,error:'format'};
  if(reserved().has(value))return{ok:false,value,error:'taken'};
  return{ok:true,value,error:null};
 }
 const api=Object.freeze({version:230,validate,normalize:norm});
 try{if(!globalThis.SCENE_HANDLE)Object.defineProperty(globalThis,'SCENE_HANDLE',{value:api,writable:false,configurable:true})}catch{}
})();
