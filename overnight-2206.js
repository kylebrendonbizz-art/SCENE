/* overnight-2206: Agent 3 — Rewind dismiss hooks + chip scroll hint. Kill: window.SCENE_OV2206_OFF=true before load, or set anytime. */
(function(){
  if(window.SCENE_OV2206_OFF===true){document.documentElement.classList.add('ov2206-off');return}
  document.documentElement.classList.add('ov2206');
  const q=(s,r=document)=>r.querySelector(s);
  function dismissRewind(){
    const root=q('.mo-rewind'); if(!root)return false;
    root.querySelector('.mo-rw-skip')?.click();
    if(root.isConnected){root.remove(); try{window.sceneFX&&sceneFX.sync&&sceneFX.sync()}catch{}}
    return true;
  }
  function hookClose(){
    const base=window.closeModal;
    if(typeof base!=='function'||base.__ov2206)return;
    const w=function(){dismissRewind(); return base.apply(this,arguments)};
    w.__ov2206=true; w.__mo=base.__mo; window.closeModal=w;
  }
  function hookEscape(){
    if(window.__ov2206Esc)return; window.__ov2206Esc=true;
    document.addEventListener('keydown',e=>{
      if(window.SCENE_OV2206_OFF===true)return;
      if(e.key==='Escape')dismissRewind();
    },true);
  }
  function chipPeek(){
    const row=q('#u3chips'); if(!row||row.__ov2206)return;
    row.__ov2206=1;
    // ensure overflow scroll can reveal clipped chip
    row.style.webkitOverflowScrolling='touch';
  }
  function tick(){
    if(window.SCENE_OV2206_OFF===true){document.documentElement.classList.add('ov2206-off');return}
    document.documentElement.classList.remove('ov2206-off');
    document.documentElement.classList.add('ov2206');
    hookClose(); hookEscape(); chipPeek();
  }
  tick();
  setInterval(tick,500);
  window.SCENE_OV2206={dismissRewind,kill(){window.SCENE_OV2206_OFF=true;document.documentElement.classList.add('ov2206-off')}};
})();
