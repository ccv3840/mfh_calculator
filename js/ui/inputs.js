// EDITABLE INPUTS — click to type
// ===================================================
function startEdit(span,sliderId,type){
  const slider=document.getElementById(sliderId);
  const cur=+slider.value;
  const inp=document.createElement('input');
  inp.type='number';inp.className='sl-edit-input';
  inp.value=cur;inp.step=type==='pct'?0.1:type==='int'?1:1000;
  function finish(){
    let v=parseFloat(inp.value);
    if(isNaN(v))v=cur;
    v=Math.max(+slider.min,Math.min(+slider.max,v));
    slider.value=v;
    const label=inp.parentNode;
    label.replaceChild(span,inp);
    updateBadge(span,type,v);
    calc();
  }
  inp.onblur=finish;
  inp.onkeydown=e=>{if(e.key==='Enter'){inp.blur();}if(e.key==='Escape'){span.parentNode&&inp.parentNode&&inp.parentNode.replaceChild(span,inp);}};
  span.parentNode.replaceChild(inp,span);
  inp.focus();inp.select();
}
function updateBadge(el,type,v){
  if(type==='eur')el.textContent=fmtE(v);
  else if(type==='pct')el.textContent=fP(v);
  else if(type==='yr')el.textContent=v+' yr';
  else el.textContent=v;
}
function slR(rangeEl,id,valId,type){
  const v=+rangeEl.value;
  const span=document.getElementById(valId);
  if(span)updateBadge(span,type,v);
  if(id==='pl_en'||id==='pl_fcf_en')return;
  calc();
}

// ===================================================

// MODE TOGGLES
// ===================================================
function setMode(key,m){
  if(key==='lm')lm_mode=m;else if(key==='gm')gm_mode=m;else dm_mode=m;
  const rowMap={lm:'lmodes',gm:'gmodes',dm:'dmodes'};
  const yrowMap={lm:'lm-years-row',gm:'gm-years-row',dm:'dm-years-row'};
  const row=rowMap[key],yrow=yrowMap[key];
  document.getElementById(row).querySelectorAll('.mode-btn').forEach((b,i)=>{
    b.className='mode-btn'+(i===m?' active':'');
  });
  document.getElementById(yrow).style.display=m===2?'':'none';
  calc();
}

// ===================================================