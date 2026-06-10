// COLLAPSIBLE SECTIONS
// ===================================================
function toggleDLomb(){
  const en=document.getElementById('d_lomb_en').checked;
  document.getElementById('d-lomb-fields').style.opacity=en?1:0.35;
  document.getElementById('d-lomb-fields').style.pointerEvents=en?'auto':'none';
}
function toggleColl(bodyId,btnId){
  const b=document.getElementById(bodyId),btn=document.getElementById(btnId);
  const open=b.classList.toggle('open');
  btn.className='coll-btn'+(open?' active':'');
}
// Private loan fields enable/disable
function updatePLFields(){
  const en=document.getElementById('pl_en').checked;
  document.getElementById('pl-fields').style.opacity=en?1:0.4;
  document.getElementById('pl-fields').style.pointerEvents=en?'auto':'none';
}
document.getElementById('pl_en').addEventListener('change',function(){updatePLFields();calc();});
document.getElementById('pl_fcf_en').addEventListener('change',calc);

// About drawer
function toggleAbout(){document.getElementById('about-drawer').classList.toggle('open');}

// Amort toggle
let amortOpen=false;
function toggleAmort(){
  amortOpen=!amortOpen;
  document.getElementById('amort-box').style.display=amortOpen?'':'none';
  document.querySelector('.amort-toggle').textContent=(amortOpen?'▴':'▾')+' MFH amortization year-by-year';
}

// MFH2 toggle
let mfh2Open=false;
function toggleMFH2(){
  mfh2Open=!mfh2Open;
  document.getElementById('mfh2-body').className='mfh2-body'+(mfh2Open?' open':'');
  document.getElementById('mfh2-toggle-icon').textContent=mfh2Open?'▴':'▾';
  if(mfh2Open)calc();
}

// ===================================================