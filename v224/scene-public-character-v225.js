(function publicCharacter225(){
  'use strict';
  if(globalThis.SCENE_PUBLIC225)return;

  const VERSION=225;
  const registry=new Map();
  const KIM_FAMILY=new Set(['kris','kourtney','khloe','kendall','kylie']);
  const KIM_OLD_PUBLIC=/^(Meetings all day\. The kind I actually like\.|I love when the plan comes together quietly\.|One thing about me: I will turn the idea into a business\.|Exactly\.|Right\.|Okay\.|Thank you 🤍|That’s sweet, thank you\.)$/i;
  const KIM_GENERIC=/^(okayyy|i see you|okay,?\s*i see it\.?|this is good\.?|you definitely left out some context\.?|noted\.?|call me|😭|exactly\.?|right\.?|lol exactly|same honestly|this is so you 😂|you left out the funniest part)$/i;

  function choose225(lines,seed=''){
    const list=(lines||[]).filter(Boolean);
    if(!list.length)return'';
    return list[Math.abs(hash(String(seed)))%list.length];
  }
  function rel225(id){
    try{return memoryFor(id)||{}}catch{return state?.relations?.[id]||{}}
  }
  function stage225(id){
    const r=rel225(id),n=Math.max(0,Number(r.friendship)||0);
    if(n>=89)return'inner_circle';
    if(n>=71)return'close_friend';
    if(n>=51)return'friend';
    if(n>=31)return'industry_acquaintance';
    if(n>=16)return'recognizes_you';
    return'stranger';
  }
  function playerMainstream225(){
    const p=state?.player||{};
    return Boolean(p.verified)||(Number(p.fame)||0)>=140||(Number(p.followers)||0)>=250000;
  }
  function kimContext225(){
    try{return globalThis.SCENE_KERNEL170?.context?.('kim')||{}}catch{return{}}
  }
  function kimKnowsPlayer225(){
    const r=rel225('kim'),k=kimContext225(),kr=k.relationship||{};
    return (Number(r.friendship)||0)>=16||(Number(r.trust)||0)>=12||Boolean(kr.followsPlayer)||(Number(k.recognition)||0)>=6||playerMainstream225();
  }
  function postTopic225(p){
    const low=String(p?.text||'').toLowerCase();
    if(/skims|brand|product|business|launch|deal|meeting|office|work|career/.test(low))return'business';
    if(/fit|fitting|look|fashion|dress|wardrobe|glam|style/.test(low))return'fashion';
    if(/family|mom|kris|khlo|kourt|kendall|kylie/.test(low))return'family';
    if(/film|camera|set|episode|production|shoot/.test(low))return'production';
    return'general';
  }
  function mentionedAccount225(p){
    const text=String(p?.text||'');
    const hits=[...text.matchAll(/@([A-Za-z0-9_.]+)/g)].map(x=>String(x[1]).toLowerCase());
    for(const h of hits){
      const a=(ACCOUNTS||[]).find(x=>String(x.handle||'').toLowerCase()===h||String(X?.[x.id]||'').toLowerCase()===h);
      if(a)return a;
    }
    return null;
  }
  function kimFamilyLine225(id,seed=''){
    const banks={
      kris:['Mom 😂','She already called me about it 😂','Of course she has a plan.'],
      khloe:['This is very you 😂','Okay this actually made me laugh.','You left out the funniest part.'],
      kourtney:['Okay 😂','I knew you were going to say that.','This is exactly why the family chat is chaos.'],
      kendall:['This is so you.','Okay wait 😂','You make this look way too easy.'],
      kylie:['lol you would 😂','Okayyy 😂','You definitely left out half the story.']
    };
    return choose225(banks[id]||['😂'],'kim-family|'+id+'|'+seed);
  }
  function kimOwnPost225(p){
    const mentioned=mentionedAccount225(p);
    if(mentioned&&KIM_FAMILY.has(mentioned.id))return kimFamilyLine225(mentioned.id,p.id);
    const banks={
      business:[
        'Good product days are my favorite kind of busy.',
        'The details nobody sees are usually the ones that take the longest.',
        'A lot of calls. One very clear plan.',
        'Back to work. Quietly getting it done.',
        'The idea is the easy part. Execution is everything.'
      ],
      fashion:[
        'Fittings all day. Worth it when the look is right.',
        'The look only works when every detail does.',
        'Back in fittings.',
        'Tiny adjustments make the whole thing.'
      ],
      production:[
        'Long day on set. The work is the fun part.',
        'A lot happening behind the camera today.',
        'Call time came early. Worth it.',
        'The part nobody sees takes the longest.'
      ],
      family:[
        'Family group chat is louder than this app 😂',
        'Keeping this one in the family chat.',
        'Family time. Phone down.'
      ],
      general:[
        'Busy in the best way.',
        'A very full day.',
        'Back to work.',
        'One thing at a time.',
        'Quiet day. A lot getting done.'
      ]
    };
    const topic=postTopic225(p);
    return choose225(banks[topic]||banks.general,'kim-post|'+p.id+'|'+(state?.worldDay||0));
  }
  function postDirectlyInvolvesKim225(p){
    const low=String(p?.text||'').toLowerCase();
    return p?.authorId==='kim'||low.includes('@kimkardashian')||low.includes('kim kardashian')||p?.quote?.id==='kim';
  }
  function allowedKimComment225(p){
    if(!p)return false;
    if(p.authorId==='kim')return true;
    if(KIM_FAMILY.has(p.authorId))return true;
    if(postDirectlyInvolvesKim225(p))return true;
    if(p.authorId==='player')return kimKnowsPlayer225();
    return false;
  }
  function kimPlayerComment225(p,seed=''){
    const topic=postTopic225(p),stage=stage225('kim');
    const handle=state?.player?.handle?'@'+state.player.handle:'';
    const warm=['friend','close_friend','inner_circle'].includes(stage);
    const banks={
      business:warm?[
        ('This is a good move. Keep the details tight until it’s locked. '+handle).trim(),
        ('Okay, this makes sense for you. Do not over-explain it yet. '+handle).trim(),
        ('Good. Now make sure the actual deal matches the announcement. '+handle).trim()
      ]:[
        'Congrats. The details matter more than the hype.',
        'Looks like a good step. Keep going.',
        'Good move. Let the work land.'
      ],
      fashion:warm?[
        ('Okay this look works 😂 '+handle).trim(),
        ('The details are right. '+handle).trim(),
        ('This one is good. '+handle).trim()
      ]:[
        'The look works.',
        'Okay, this is good.',
        'The details make it.'
      ],
      general:warm?[
        ('lol okay, I see you '+handle).trim(),
        ('You knew exactly what you were doing with this post 😂 '+handle).trim(),
        ('Okay. I need the part you left out 😂 '+handle).trim()
      ]:[
        'The caption is making me curious 😂',
        'Okay, I need the missing chapter 😂',
        'You cannot post this like there is not a story behind it 😂'
      ]
    };
    return choose225(banks[topic]||banks.general,'kim-player-comment|'+(p?.id||'')+'|'+seed+'|'+stage);
  }
  function kimComment225(p,seed=''){
    if(p?.authorId==='player')return kimPlayerComment225(p,seed);
    if(KIM_FAMILY.has(p?.authorId))return kimFamilyLine225(p.authorId,seed);
    if(postDirectlyInvolvesKim225(p)){
      return choose225([
        'You all notice everything 😂',
        'Not everything needs a theory.',
        'The comments are already doing too much 😂'
      ],'kim-mentioned|'+(p?.id||'')+'|'+seed);
    }
    return'';
  }
  function kimPublicReply225(text,negative=false){
    const t=String(text||'').trim(),low=t.toLowerCase(),stage=stage225('kim');
    const warm=['friend','close_friend','inner_circle'].includes(stage);
    if(/introduce|introduction|guest list|get me in|invite me|met gala|nyfw|fashion week|backstage|meet kendall|meet kylie/.test(low)){
      return warm?'Text me what you actually need. I’m not promising anything in the comments.':'That’s not something I can promise in the comments.';
    }
    if(negative||/hate|fake|flop|ugly|trash|awful|terrible|boring|embarrass/.test(low)){
      return choose225(['Okay.','You’re entitled to your opinion.','Noted.'],'kim-public-neg|'+t);
    }
    if(/love|congrats|congratulations|proud|amazing|beautiful|iconic|ate|slay|cute/.test(low)){
      return warm?choose225(['Thank you 🤍','Love you. Thank you 🤍','That’s sweet 😂🤍'],'kim-public-warm|'+t):choose225(['Thank you 🤍','That’s sweet, thank you.'],'kim-public-thanks|'+t);
    }
    if(/\?$/.test(t)){
      if(/when|release|launch|coming|announce|tell us/.test(low))return'I’ll share it when there’s actually something to share.';
      return warm?'lol ask me privately 😂':'I’m keeping that one private.';
    }
    return warm?choose225(['Exactly 😂','lol right','You get it.'],'kim-public-friend|'+t):choose225(['Exactly.','Right.','Thank you.'],'kim-public-neutral|'+t);
  }
  function sanitizeKimPost225(p){
    if(!p||p.authorId!=='kim')return false;
    let changed=false;
    const mentioned=mentionedAccount225(p);
    const badMention=mentioned&&!KIM_FAMILY.has(mentioned.id);
    const playerHandle=String(state?.player?.handle||'').toLowerCase();
    const playerName=String(state?.player?.name||'').toLowerCase();
    const low=String(p.text||'').toLowerCase();
    const playerLinked=Boolean(state?.player&&((playerHandle&&low.includes(playerHandle))||(playerName&&low.includes(playerName))||p.quote?.id==='player'));
    const generated=Boolean(p.socialScene)||KIM_OLD_PUBLIC.test(String(p.text||'').trim())||badMention;
    if((playerLinked&&!kimKnowsPlayer225())||generated){
      p.text=kimOwnPost225(p);
      if(badMention||(playerLinked&&!kimKnowsPlayer225())){
        p.quote=null;
        p.socialLabel='';
        p.sceneType='everyday';
        p.kind='everyday';
      }
      changed=true;
    }
    if(!p.scenePublic225){p.scenePublic225='kim';changed=true}
    return changed;
  }
  function sanitizeKimComments225(p){
    if(!p?.comments?.length)return false;
    let changed=false;
    const cleanList=[];
    for(const c of p.comments){
      if(c?.authorId==='kim'){
        if(!allowedKimComment225(p)){changed=true;continue}
        const next=kimComment225(p,c.id||c.text);
        if(next&&(!c.scenePublic225||KIM_GENERIC.test(String(c.text||'').trim()))){
          c.text=next;
          c.scenePublic225='kim';
          changed=true;
        }
      }
      if(Array.isArray(c?.replies)&&c.replies.length){
        const replies=[];
        for(const r of c.replies){
          if(r?.authorId==='kim'){
            if(!allowedKimComment225(p)){changed=true;continue}
            const next=kimComment225(p,r.id||r.text);
            if(next&&(!r.scenePublic225||KIM_GENERIC.test(String(r.text||'').trim()))){
              r.text=next;
              r.scenePublic225='kim';
              changed=true;
            }
          }
          replies.push(r);
        }
        c.replies=replies;
      }
      cleanList.push(c);
    }
    p.comments=cleanList;
    return changed;
  }
  function sanitizeWorld225(){
    let changed=false;
    for(const p of (state?.posts||[]).slice(0,80)){
      if(sanitizeKimPost225(p))changed=true;
      if(sanitizeKimComments225(p))changed=true;
    }
    return changed;
  }
  function fallbackCelebComment225(exclude){
    const pool=(celebs||[]).filter(a=>a.id!==exclude&&a.id!=='kim');
    const a=pool[Math.abs(hash('fallback-celeb|'+exclude+'|'+Date.now()))%Math.max(1,pool.length)];
    if(!a)return{id:'c225'+Date.now(),fan:true,name:'user',handle:'user',text:'',createdAt:Date.now(),likes:0,replies:[]};
    const lines=PERSONA[a.id]?.dm||['okayyy','I see you','noted.'];
    return{id:'c225'+Date.now()+Math.random(),authorId:a.id,name:a.name,handle:a.handle,text:choose225(lines,'fallback|'+a.id+'|'+exclude),createdAt:Date.now()-rand(1000,500000),verified:true,likes:rand(90,9000),replies:[]};
  }

  registry.set('kim',{
    id:'kim',
    family:[...KIM_FAMILY],
    stage:()=>stage225('kim'),
    knowsPlayer:kimKnowsPlayer225,
    post:kimOwnPost225,
    comment:kimComment225,
    publicReply:kimPublicReply225
  });

  const basePublicReply=publicPersonaReply;
  publicPersonaReply=function(a,text,negative=false){
    if(a?.id==='kim')return kimPublicReply225(text,negative);
    return basePublicReply(a,text,negative);
  };

  const baseCelebComment=celebComment;
  celebComment=function(exclude){
    for(let i=0;i<14;i++){
      const c=baseCelebComment(exclude);
      if(c?.authorId!=='kim')return c;
      const fake={authorId:exclude,text:'',comments:[]};
      if(allowedKimComment225(fake)){
        c.text=kimComment225(fake,c.id||i);
        c.scenePublic225='kim';
        return c;
      }
    }
    return fallbackCelebComment225(exclude);
  };

  const baseWorldPost=worldPost;
  worldPost=function(...args){
    const before=new Set((state?.posts||[]).map(p=>p.id));
    const out=baseWorldPost(...args);
    let changed=false;
    for(const p of (state?.posts||[])){
      if(before.has(p.id))continue;
      if(sanitizeKimPost225(p))changed=true;
      if(sanitizeKimComments225(p))changed=true;
    }
    if(changed){try{save();render()}catch{}}
    return out;
  };

  const kernel=globalThis.SCENE_KERNEL170;
  if(kernel?.eligibleCelebrity&&!kernel.__public225Wrapped){
    const baseEligible=kernel.eligibleCelebrity.bind(kernel);
    kernel.eligibleCelebrity=(m,a)=>{
      if(a?.id!=='kim')return baseEligible(m,a);
      const direct=String(m?.celebrityId||'')==='kim'||String(m?.celebrityId||'')==='kim_kardashian'||(m?.mentions||[]).some(x=>x?.id==='kim')||/kim kardashian|@kimkardashian/i.test(String(m?.text||''));
      if(direct)return baseEligible(m,a);
      const r=rel225('kim'),k=kimContext225(),kr=k.relationship||{};
      const visibility=kernel.visibility?.(m)||m?.visibility||'private';
      if(visibility!=='public')return false;
      if((Number(r.friendship)||0)<16&&(Number(r.trust)||0)<12&&!kr.followsPlayer&&!playerMainstream225())return false;
      return baseEligible(m,a);
    };
    kernel.__public225Wrapped=true;
  }

  let lastSig='';
  function sweep225(){
    if(!state?.posts)return;
    const sig=(state.posts||[]).slice(0,30).map(p=>p.id+':'+(p.comments?.length||0)).join('|');
    if(sig===lastSig)return;
    lastSig=sig;
    if(sanitizeWorld225()){
      try{save();render()}catch{}
    }
  }

  const migrated=sanitizeWorld225();
  if(migrated){try{save()}catch{}}
  setInterval(()=>{if(!document.hidden)sweep225()},1800);

  globalThis.SCENE_PUBLIC225={
    version:VERSION,
    register:(id,pack)=>registry.set(id,pack),
    get:id=>registry.get(id)||null,
    sanitize:sanitizeWorld225,
    kim:{
      stage:()=>stage225('kim'),
      knowsPlayer:kimKnowsPlayer225,
      publicReply:kimPublicReply225,
      canComment:allowedKimComment225
    },
    inspect:()=>({
      kimStage:stage225('kim'),
      kimKnowsPlayer:kimKnowsPlayer225(),
      kimPosts:(state?.posts||[]).filter(p=>p.authorId==='kim').slice(0,8).map(p=>({id:p.id,text:p.text,kind:p.kind,scenePublic225:p.scenePublic225})),
      strayKimComments:(state?.posts||[]).flatMap(p=>(p.comments||[]).filter(c=>c.authorId==='kim'&&!allowedKimComment225(p)).map(c=>({postId:p.id,postAuthor:p.authorId,text:c.text})))
    })
  };
})();