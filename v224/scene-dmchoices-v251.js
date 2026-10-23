/* SCENE dmchoices251 (2026-10-14): context-matched DM reply choices + chapter headline + "what changed" toast + "X remembers" lines.
   Additive overlay; works for EVERY celeb DM thread. Typed composer untouched (choices just fill #dmtext and press the game's own Send,
   so every existing reply engine - kim runtime, charbrain, eventchain - still answers).
   Choices are picked from the celeb's LAST message only (intent: invite/secret/drama/praise/checkin/collab/busy/vulnerable/question/statement).
   If the player spoke last, no choices are shown (no mismatched chips while waiting).
   Writes (new key only): state.dmc251 = {v,clout,mess,mem{id:[{day,text}]},picks,hlDay}. Relationship nudges are small (friendship/trust/tension,
   clamped 0-100). No money, followers, fame, level, registry or save-format changes.
   Kill switch: window.SCENE_DMCHOICES_OFF=true (checked on every hook). */
(()=>{'use strict';
if(window.SCENE_DMCHOICES)return;
const OFF=()=>window.SCENE_DMCHOICES_OFF===true;
const S=()=>{try{return typeof state!=='undefined'?state:null}catch{return null}};
const M=()=>document.getElementById('modal');
const who=id=>{try{return byId(id)}catch{return null}};
const first=id=>String(who(id)?.name||'them').split(/\s+/)[0];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const H=s=>{let h=2166136261;s=String(s);for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
function st(){const s=S();if(!s)return null;let c=s.dmc251;if(!c||typeof c!=='object')c=s.dmc251={v:251};
  c.clout=+c.clout||0;c.mess=+c.mess||0;c.mem=c.mem&&typeof c.mem==='object'?c.mem:{};c.picks=+c.picks||0;return c}
const day=()=>Number(S()?.sceneDay)||1;
const save0=()=>{try{save()}catch{}};

/* ---------- intent of the celeb's last line ---------- */
const RULES=[
 ['secret',/\b(between us|don'?t tell|off the record|keep (this|it) (quiet|private|lowkey|between)|nobody knows|secret|not public yet|can you keep)\b/],
 ['drama',/\b(why did you|heard you|you said|people are saying|rumou?rs?|are you serious|not cool|mad at|upset|shady|what was that|explain|lied|blogs? (are|is) saying)\b/],
 ['invite',/\b(come (to|with|through|by)|pull up|join (me|us)|you in\??|tonight|dinner|party|afterparty|meet (me|up)|link up|wanna (come|hang|go)|studio session|plus one|come out)\b/],
 ['collab',/\b(collab|feature|duet|campaign|shoot|brand deal|project|remix|work together|on set|role|script|track)\b/],
 ['vulnerable',/\b(tired|exhausted|stressed|rough (day|week)|miss (you|home)|sad|lonely|hard (day|week|time)|overwhelmed|can'?t sleep|anxious)\b/],
 ['busy',/\b(busy|swamped|can'?t talk|talk later|ttyl|in a meeting|later\.?$|crazy (day|week)|on set all day|give me a (sec|minute)|brb)\b/],
 ['praise',/\b(love (it|that|your|this)|obsessed|proud of you|congrat|killed it|iconic|so good|slay|ate|loved your|you look)\b/],
 ['checkin',/\b(how are you|how'?s it going|what are you up to|wyd|what'?s new|how have you been|how'?s (your|the)|you good\??|what'?s up)\b/]];
function intentOf(t){const n=String(t||'').toLowerCase().replace(/[’‘]/g,"'");for(const [k,re] of RULES)if(re.test(n))return k;return /\?\s*$/.test(n.trim())?'question':'statement'}
/* a short quotable hook from their line, for replies that echo it */
function hook(t){const m=String(t).match(/\b(tonight|dinner|the party|the afterparty|the studio|the shoot|the campaign|the track|the remix|Paris|London|New York|NYC|LA|Cape Town|Miami|Vegas|Tokyo|Milan|the Met|the Grammys|the premiere)\b/i);return m?m[1]:''}

/* ---------- choice sets: A loyal / B clout / C mess. fx: f friendship, t trust(Loyalty), x tension, c clout, m mess. mem = what they remember ---------- */
const SETS={
 invite:[{l:'A',tag:'Say yes',txt:(n,h)=>`I'm in${h?' for '+h:''}. Send me the time and place.`,fx:{f:3,t:1},mem:'you showed up when invited',re:"Yay. I'll send details."},
  {l:'B',tag:'Yes, if it’s public',txt:()=>`Only if we get a photo for the grid 👀`,fx:{f:1,c:3,m:1},mem:'you wanted the invite on camera',re:'Lol fine, one photo. Then phones away.'},
  {l:'C',tag:'Rain check',txt:()=>`Can't make it this time, rain check? I'll make it up to you.`,fx:{f:-1,t:1},mem:'you took a rain check',re:'Okay, holding you to that.'}],
 secret:[{l:'A',tag:'Keep it private',txt:()=>`That stays between us. You have my word.`,fx:{t:4,f:2,m:-1},mem:'you kept it private',re:"Thank you. That's why I told you."},
  {l:'B',tag:'Tease, don’t tell',txt:()=>`My lips are sealed… but I might post a very vague emoji.`,fx:{t:-1,c:2,m:1},mem:'you joked about hinting at it',re:"Do NOT. I'm serious 😭"},
  {l:'C',tag:'Threaten to spill',txt:()=>`Honestly the internet deserves to know this one 😭`,fx:{t:-5,x:4,c:4,m:3},mem:'you joked about leaking it',re:'Not funny. Forget I said anything.'}],
 drama:[{l:'A',tag:'Clear it up',txt:()=>`That's not what happened, and I'm sorry it landed that way. Can I explain?`,fx:{t:3,x:-3,m:-2},mem:'you owned it and cleared the air',re:'Okay. I appreciate you saying that.'},
  {l:'B',tag:'Laugh it off',txt:()=>`The blogs will say anything for clicks. You know me better than that.`,fx:{x:-1,c:1},mem:'you brushed the rumour off',re:'Mm. Just watch what you say.'},
  {l:'C',tag:'Double down',txt:()=>`I said what I said. Not taking it back.`,fx:{t:-3,x:5,c:3,m:3},mem:'you doubled down',re:'Wow. Okay then.'}],
 collab:[{l:'A',tag:'Commit',txt:()=>`I'm genuinely in. Tell me what you need from me and when.`,fx:{f:2,t:2},mem:'you committed to the project',re:"Love that. I'll loop you in."},
  {l:'B',tag:'Talk terms',txt:()=>`Love it. Have your team send details and we'll make it huge.`,fx:{c:3,f:1},mem:'you played it like business',re:'Fair. My team will reach out.'},
  {l:'C',tag:'Ask who else',txt:()=>`Who else is on it? I'm not sharing a credit with just anyone.`,fx:{x:3,c:1,m:2},mem:'you got territorial about credit',re:"Relax, it's not like that."}],
 vulnerable:[{l:'A',tag:'Be there',txt:()=>`I'm here. Want to talk, or want me to distract you?`,fx:{t:4,f:3},mem:'you were there on a rough day',re:'Thank you. Honestly, that helps.'},
  {l:'B',tag:'Cheer them up',txt:n=>`Okay, sending you the most chaotic meme I have. You've got this, ${n}.`,fx:{f:2,c:1},mem:'you made them laugh on a bad day',re:'Okay that actually made me laugh.'},
  {l:'C',tag:'Make it about you',txt:()=>`Same honestly, my week's been worse. Let me tell you…`,fx:{f:-2,x:2,m:1},mem:'you made their bad day about you',re:'…Okay. Never mind.'}],
 busy:[{l:'A',tag:'Give space',txt:()=>`No rush at all. Catch me when you're free.`,fx:{t:2,f:1},mem:'you gave them space',re:'Thank you, talk soon.'},
  {l:'B',tag:'Leave a hook',txt:()=>`Go do your thing. I've got news for you later 👀`,fx:{c:1,f:1},mem:'you left them curious',re:'Wait, what news?? Okay later.'},
  {l:'C',tag:'Guilt trip',txt:()=>`Wow, okay. Too busy for me now?`,fx:{x:3,f:-2,m:2},mem:'you guilt-tripped them for being busy',re:"It's literally work. Calm down."}],
 praise:[{l:'A',tag:'Thank them',txt:n=>`That means a lot coming from you, ${n}. Thank you.`,fx:{f:3,t:1},mem:'you were gracious',re:'Of course. You earned it.'},
  {l:'B',tag:'Return it',txt:()=>`Stop, you're the blueprint. We should do something together.`,fx:{f:2,c:2},mem:'you hyped them right back',re:"Stop 🥹 Yes, let's."},
  {l:'C',tag:'Brag',txt:()=>`I know 😌 Wait till you see what's next.`,fx:{c:2,x:1,m:1},mem:'you got a little cocky',re:'Okay, humble much? Lol.'}],
 checkin:[{l:'A',tag:'Honest update',txt:()=>`Honestly? Busy but good. How are YOU doing though?`,fx:{f:2,t:2},mem:'you were honest with them',re:"I'm good. Busy, but good."},
  {l:'B',tag:'Tease a project',txt:()=>`Can't say much yet, but something big is coming 👀`,fx:{c:2,f:1},mem:'you teased your next move',re:"Now I'm curious. Tell me first."},
  {l:'C',tag:'Ask for gossip',txt:()=>`Living. Now tell me the gossip, I know you have some.`,fx:{f:1,c:1,m:2},mem:'you fished for gossip',re:"Lol you know I can't say."}],
 question:[{l:'A',tag:'Answer straight',txt:()=>`Honestly, yes. Straight answer.`,fx:{t:2,f:1},mem:'you gave them a straight answer',re:'Okay, good to know.'},
  {l:'B',tag:'Ask what they mean',txt:()=>`Depends. Why, what are you thinking?`,fx:{f:1,c:1},mem:'you kept them guessing',re:'Just curious. Tell you later.'},
  {l:'C',tag:'Dodge',txt:()=>`No comment 😏`,fx:{x:1,c:1,m:1},mem:'you dodged their question',re:'Fine, keep your secrets.'}],
 statement:[{l:'A',tag:'Agree',txt:n=>`Okay that's so real, ${n}.`,fx:{f:2,t:1},mem:'you backed them up',re:'Right?? Thank you.'},
  {l:'B',tag:'Ask for more',txt:()=>`Wait, tell me more. What happened?`,fx:{f:2},mem:'you actually listened',re:'Long story. Tell you when I see you.'},
  {l:'C',tag:'Push back',txt:()=>`Hmm. Not sure I agree with that one.`,fx:{x:2,c:1,m:1},mem:'you pushed back on them',re:'Okay, fair. Agree to disagree.'}],
 opener:[{l:'A',tag:'Warm hello',txt:n=>`Hey ${n}! Loved your last post, had to say hi.`,fx:{f:2},mem:'you reached out first',re:"Hi! Thank you, that's sweet."},
  {l:'B',tag:'Pitch a collab',txt:()=>`Hi! Random, but I think we'd make something great together.`,fx:{c:2,f:1},mem:'you pitched them cold',re:"Ha, okay. I'm listening."},
  {l:'C',tag:'Bold opener',txt:()=>`So are we finally going to be friends or what?`,fx:{f:1,x:1,m:1},mem:'you came in bold',re:"Lol. We'll see."}]};
const FX_LABEL={f:'Friendship',t:'Loyalty',x:'Tension',c:'Clout',m:'Mess'};
const fxText=fx=>Object.entries(fx).map(([k,v])=>`${v>0?'+':'−'}${Math.abs(v)} ${FX_LABEL[k]}`).join(' · ');

function lastLine(id){const d=S()?.dms?.find(x=>x.id===id);if(!d)return null;if(d.typing||d.pending)return{wait:1};
  const m=(d.messages||[]).filter(x=>x&&(x.from==='me'||x.from==='them'));if(!m.length)return{open:1};const L=m[m.length-1];
  return L.from==='me'?{wait:1}:{text:String(L.text||'')}}
function choicesFor(id){const L=lastLine(id);if(!L||L.wait)return null;const k=L.open?'opener':intentOf(L.text);const n=first(id),h=L.text?hook(L.text):'';
  const mem=(st()?.mem[id]||[])[0];
  return{k,items:SETS[k].map(o=>({...o,text:o.txt(n&&n!=='them'?n:'',h).replace(/, \./,'.').replace(/,\s*$/,'')})),mem}}

/* ---------- chapter + headline ---------- */
const CH=['Arrival','First Heat','The Glow-Up','Rivals','Headlines','Crown'];
function chapter(){const d=day(),i=Math.min(CH.length-1,Math.floor((d-1)/5));const city=S()?.player?.city||'LA';return{n:i+1,name:CH[i],city,day:d}}
function headline(){const c=st(),s=S(),me=s?.player?.name||'You';const ids=Object.keys(c?.mem||{});const last=ids.map(id=>({id,m:c.mem[id][0]})).filter(x=>x.m).sort((a,b)=>(b.m.at||0)-(a.m.at||0))[0];
  const T=[c.mess>=8?`Messy era? Insiders say ${me} is stirring the pot`:null,c.clout>=8?`${me} is everywhere this week — and loving it`:null,
   last?`${me} and ${first(last.id)} spotted texting — sources say ${last.m.text.replace(/^you /,'they ')}`:null,
   `${me} lands in ${chapter().city}: who's in the inner circle?`].filter(Boolean);return T[H(day()+'|'+T.length)%T.length]}

/* ---------- toast ---------- */
function toast(html){let t=document.getElementById('dmc251toast');if(!t){t=document.createElement('div');t.id='dmc251toast';document.body.appendChild(t)}
  t.innerHTML=html;t.classList.remove('show');void t.offsetWidth;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),3600)}

/* the celeb's reply to a picked option is the authored reaction for that option (engines can't parse scripted text, e.g. 'a little early for gifts, no?') */
/* ---------- apply a pick ---------- */
function apply(id,o){const c=st();let r;try{r=memoryFor(id)}catch{r=null}
  const cl=v=>Math.max(0,Math.min(100,v));
  if(r){if(o.fx.f)r.friendship=cl((+r.friendship||0)+o.fx.f);if(o.fx.t)r.trust=cl((+r.trust||0)+o.fx.t);if(o.fx.x)r.tension=cl((+r.tension||0)+o.fx.x)}
  c.clout+=o.fx.c||0;c.mess=Math.max(0,c.mess+(o.fx.m||0));c.picks++;
  const m=c.mem[id]=Array.isArray(c.mem[id])?c.mem[id]:[];m.unshift({day:day(),at:Date.now(),text:o.mem});c.mem[id]=m.slice(0,12);save0();
  toast(`<b>What changed</b><span>${esc(first(id))}: ${esc(fxText(o.fx))}</span><em>${esc(first(id))} will remember: ${esc(o.mem)}</em>`)}
const CONFUSED=/^(what do you mean\??|huh\??|wdym\??|i don'?t (follow|get it)\.?|sorry\??|not sure what you mean\.?|what\??|\?+)$/i;
function watchReply(id,o){const d=S()?.dms?.find(x=>x.id===id);if(!d||!o.re)return;const n0=d.messages.length,t0=Date.now();
  const iv=setInterval(()=>{if(OFF()||Date.now()-t0>30000)return clearInterval(iv);const m=d.messages.slice(n0).find(x=>x.from==='them');if(!m)return;clearInterval(iv);
   if(true){m.dmc251orig=m.text;m.text=o.re;m.dmc251='repaired';save0();try{const th=document.getElementById('dmthread');if(th&&M()?.dataset?.dm===id){th.innerHTML=dmThreadHtml(d);th.scrollTop=th.scrollHeight}}catch{}}},400)}
function send(id,o){const inp=document.getElementById('dmtext'),btn=document.getElementById('dmsend');if(!inp||!btn)return;
  inp.value=o.text;inp.dispatchEvent(new Event('input',{bubbles:true}));apply(id,o);btn.click();watchReply(id,o)}

/* ---------- render into the open thread ---------- */
function render(){document.documentElement.classList.toggle('dmc251on',!OFF());if(OFF())return;const md=M(),id=md?.dataset?.dm;if(!id)return;const wrap=md.querySelector('.chatcomposerwrap'),thread=md.querySelector('#dmthread');if(!wrap||!thread)return;
  /* chapter + memory banner, top of thread */
  let top=md.querySelector('#dmc251top');if(!top){top=document.createElement('div');top.id='dmc251top';thread.parentNode.insertBefore(top,thread)}
  const ch=chapter(),c=st(),mm=(c.mem[id]||[])[0];
  const topHtml=`<div class="dmc-hl"><span>CH ${ch.n} · ${esc(ch.name.toUpperCase())} · ${esc(ch.city)} · DAY ${ch.day}</span><b>${esc(headline())}</b></div>`+
   `<div class="dmc-bar"><i>Clout ${c.clout}</i><i>Loyalty ${Math.round(+(()=>{try{return memoryFor(id).trust}catch{return 0}})()||0)}</i><i>Mess ${c.mess}</i></div>`+
   (mm?`<div class="dmc-mem">💭 ${esc(first(id))} remembers: ${esc(mm.text)}</div>`:'');
  if(top.__h!==topHtml){top.innerHTML=topHtml;top.__h=topHtml}
  /* choices above composer */
  let box=md.querySelector('#dmc251');if(!box){box=document.createElement('div');box.id='dmc251';wrap.insertBefore(box,wrap.firstChild);
   box.addEventListener('click',e=>{e.stopPropagation();const b=e.target.closest('[data-dmc]');if(!b||OFF())return;const set=box.__set;const o=set&&set.items[+b.dataset.dmc];if(o){box.innerHTML='';box.__key='';send(id,o)}})}
  const set=choicesFor(id);const key=set?set.k+'|'+set.items.map(x=>x.text).join('|'):'';
  if(box.__key===key)return;box.__key=key;box.__set=set;
  box.innerHTML=set?`<div class="dmc-k">Reply options · or type your own</div>`+set.items.map((o,i)=>`<button type="button" class="dmc-opt" data-dmc="${i}"><em>${o.l}</em><span><b>${esc(o.text)}</b><small>${esc(o.tag)} → ${esc(fxText(o.fx))}</small></span></button>`).join(''):''}

/* daily headline toast on the main screen (once per game day) */
function dailyHL(){if(OFF())return;const c=st(),s=S();if(!c||!s?.player)return;const d=day();if(c.hlDay===d)return;c.hlDay=d;save0();
  const ch=chapter();toast(`<b>Day ${d} · Chapter ${ch.n}: ${esc(ch.name)}</b><span>📰 ${esc(headline())}</span>`)}

const css=document.createElement('style');css.textContent=`
#dmc251top{padding:6px 12px 0}.dmc-hl{background:linear-gradient(135deg,#1b1030,#2a1240);border:1px solid #ffffff1f;border-radius:12px;padding:7px 10px;color:#fff}
.dmc-hl span{display:block;font-size:10px;letter-spacing:.08em;color:#f5c26b;font-weight:700}.dmc-hl b{display:block;font-size:12.5px;line-height:1.3;margin-top:2px}
.dmc-bar{display:flex;gap:6px;margin-top:6px}.dmc-bar i{font-style:normal;font-size:11px;font-weight:700;background:#ffffff14;color:inherit;border-radius:999px;padding:3px 9px}
.dmc-mem{margin-top:6px;font-size:12px;opacity:.85;font-style:italic}
/* uiux3's generic quick chips (#u3chips) are replaced by context-matched options */
.dmc251on #u3chips{display:none!important}
#dmc251{display:flex;flex-direction:column;gap:6px;padding:6px 10px 4px}#dmc251:empty{display:none}.dmc-k{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;opacity:.6}
.dmc-opt{display:flex;gap:9px;align-items:flex-start;text-align:left;border:1px solid #ffffff26;background:#ffffff0f;color:inherit;border-radius:12px;padding:7px 10px;font:inherit;cursor:pointer}
.dmc-opt em{font-style:normal;font-weight:800;color:#ff5fa2;min-width:14px}.dmc-opt b{display:block;font-size:13px;font-weight:600}.dmc-opt small{display:block;font-size:11px;opacity:.65;margin-top:2px}
.dmc-opt:active{transform:scale(.98)}
#dmc251toast{position:fixed;left:50%;top:14px;transform:translate(-50%,-140%);z-index:2147483000;max-width:92vw;width:360px;background:#141018f2;color:#fff;border:1px solid #f5c26b66;border-radius:14px;padding:10px 14px;box-shadow:0 10px 30px #0008;transition:transform .35s ease;pointer-events:none;font-size:13px}
#dmc251toast.show{transform:translate(-50%,0)}#dmc251toast b{display:block;color:#f5c26b;font-size:12px;letter-spacing:.04em}#dmc251toast span{display:block;margin-top:3px}#dmc251toast em{display:block;margin-top:4px;opacity:.8;font-size:12px}`;
document.head.appendChild(css);

let q=0;const kick=()=>{if(q)return;q=requestAnimationFrame(()=>{q=0;try{render()}catch(e){}})};
const arm=()=>{const md=M();if(!md)return false;new MutationObserver(kick).observe(md,{childList:true,subtree:true,attributes:true,attributeFilter:['data-dm']});return true};
if(!arm()){const w=setInterval(()=>{if(arm())clearInterval(w)},200)}
setInterval(()=>{try{dailyHL();kick()}catch{}},2500);
window.SCENE_DMCHOICES={v:251,intentOf,choicesFor,headline,chapter,render,state:st};
})();
