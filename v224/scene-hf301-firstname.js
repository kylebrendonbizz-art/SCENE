/* SCENE hf301-firstname (S1 hotfix b, 2026-10-17): "Hey The!" fix for DM-choice chips.
   dmchoices251's first() takes the first whitespace token of the name, so "The Weeknd" -> "Hey The! ..." and
   "Tyler, the Creator" -> "Hey Tyler,! ...". This patch computes a proper short name (leading article dropped, text after a
   comma dropped) and corrects ONLY the dmchoices251 surfaces: chip labels, the chip text that gets sent (#dmc251.__set),
   the memory banner/headline (#dmc251top) and the "what changed" toast (#dmc251toast). Celebs whose first token is already
   right are never touched. No save writes. Exposes window.SCENE_FIRSTNAME(nameOrId).
   Kill switch: window.SCENE_HF_FIRSTNAME_OFF=true (or SCENE_HOTFIX301_OFF=true) - checked on every mutation. */
(()=>{'use strict';
if(window.SCENE_HF301_FIRSTNAME)return;
const OFF=()=>window.SCENE_HF_FIRSTNAME_OFF===true||window.SCENE_HOTFIX301_OFF===true;
const ART=/^(the|thee|a|an)$/i;
function shortName(name){let n=String(name||'').trim();if(!n)return'';n=n.replace(/\s*,.*$/,'');const t=n.split(/\s+/).filter(Boolean);
  while(t.length>1&&ART.test(t[0]))t.shift();return (t[0]||n).replace(/[,;:.!]+$/,'')}
const rawFirst=name=>String(name||'them').split(/\s+/)[0];
window.SCENE_FIRSTNAME=x=>{let a=null;try{a=byId(x)}catch{}return shortName(a?.name||x)};
let MAP=null;/* bad token -> good short name, only where they differ and the bad token is unambiguous */
function map(){if(MAP)return MAP;const m=new Map(),amb=new Set();let list=[];try{list=celebs}catch{}
  for(const c of list){const bad=rawFirst(c.name),good=shortName(c.name);if(!bad||bad===good)continue;if(m.has(bad)&&m.get(bad)!==good)amb.add(bad);m.set(bad,good)}
  for(const b of amb)m.delete(b);if(list.length)MAP=m;return m}
const esc=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
/* only fix the token where dmchoices251 templates place a name: "Hey X!", ", X.", "X: +2 ...", "X will remember", "X remembers", "and X spotted" */
function fixText(t){if(!t||typeof t!=='string')return t;let out=t;for(const [bad,good] of map()){if(!out.includes(bad))continue;
  const re=new RegExp(`(^|[\\s(])${esc(bad)}(?=\\s*[!.:]|\\s+(will remember|remembers|spotted)\\b)`,'g');out=out.replace(re,(m0,pre)=>pre+good)}
  return out}
function fixEl(root){if(!root)return 0;let n=0;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let x;while((x=w.nextNode())){const f=fixText(x.nodeValue);if(f!==x.nodeValue){x.nodeValue=f;n++}}return n}
function fixAll(){if(OFF())return;if(!map().size)return;const box=document.getElementById('dmc251');
  if(box&&box.__set&&Array.isArray(box.__set.items)){for(const o of box.__set.items){if(o&&typeof o.text==='string'){const f=fixText(o.text);if(f!==o.text)o.text=f}}}
  fixEl(box);fixEl(document.getElementById('dmc251top'));fixEl(document.getElementById('dmc251toast'))}
let q=0;const kick=()=>{if(q)return;q=1;Promise.resolve().then(()=>{q=0;try{fixAll()}catch{}})};
/* microtask after each DOM mutation = before paint, so the wrong name never shows */
const obs=new MutationObserver(kick);
const armModal=()=>{const md=document.getElementById('modal');if(!md)return false;obs.observe(md,{childList:true,subtree:true,characterData:true});return true};
if(!armModal()){new MutationObserver((r,mo)=>{if(armModal())mo.disconnect()}).observe(document.documentElement,{childList:true,subtree:true})}
let toastArmed=false;new MutationObserver(()=>{const t=document.getElementById('dmc251toast');if(t&&!toastArmed){toastArmed=true;obs.observe(t,{childList:true,subtree:true,characterData:true});kick()}}).observe(document.body,{childList:true});
/* safety net: click on a chip fixes the item text first (capture phase runs before dmchoices251's handler) */
document.addEventListener('click',e=>{if(OFF())return;if(e.target&&e.target.closest&&e.target.closest('#dmc251 [data-dmc]'))fixAll()},true);
window.SCENE_HF301_FIRSTNAME={v:301,shortName,fixText,map:()=>[...map()]};
})();
