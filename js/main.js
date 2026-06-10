// MAIN CALC
// ===================================================
function calc(){
  const p=P();
  const r=calcAll(p);
  lastR=r;lastP=p;
  renderActive(r,p);
  // sync pl_fields opacity
  updatePLFields();
}

// ===================================================
// DEFAULTS & RESET
// ===================================================
const DEF={ic:500000,sal:50000,yrs:10,sp:11,etf:8.8,pa:3,rend:6,rg:2.5,oc:22,mab:2000000,mc:4000000,mr:4,til:1,lr:1,ltv:50,gr:4.5,cy:5,dr:5,inf:3,rf:2.5,d_ltv:50,pla:200000,plr:5,plf:50,m2y:5,m2p:2000000,m2e:80,lmy:5,gmy:5,d_ltv:50,d_lmy:5};
const LF={ic:'eur',sal:'eur',yrs:'yr',sp:'pct',etf:'pct',pa:'pct',rend:'pct',rg:'pct',oc:'pct',mab:'eur',mc:'eur',mr:'pct',til:'pct',lr:'pct',ltv:'pct',gr:'pct',cy:'pct',dr:'pct',inf:'pct',rf:'pct',d_ltv:'pct',pla:'eur',plr:'pct',plf:'pct',m2y:'yr',m2p:'eur',m2e:'pct',lmy:'yr',gmy:'yr',d_ltv:'pct',d_lmy:'yr'};
const LV={ic:'v_ic',sal:'v_sal',yrs:'v_yrs',sp:'v_sp',etf:'v_etf',pa:'v_pa',rend:'v_rend',rg:'v_rg',oc:'v_oc',mab:'v_mab',mc:'v_mc',mr:'v_mr',til:'v_til',lr:'v_lr',ltv:'v_ltv',gr:'v_gr',cy:'v_cy',dr:'v_dr',inf:'v_inf',rf:'v_rf',d_ltv:'v_d_ltv',pla:'v_pla',plr:'v_plr',plf:'v_plf',m2y:'v_m2y',m2p:'v_m2p',m2e:'v_m2e',lmy:'v_lmy',gmy:'v_gmy',d_ltv:'v_d_ltv',d_lmy:'v_d_lmy'};
function resetAll(){
  lm_mode=0;gm_mode=0;dm_mode=0;
  document.querySelectorAll('.mode-btn').forEach(b=>b.className='mode-btn');
  document.querySelectorAll('#lmodes .mode-btn')[0].className='mode-btn active';
  document.querySelectorAll('#gmodes .mode-btn')[0].className='mode-btn active';
  document.querySelectorAll('#dmodes .mode-btn').forEach((b,i)=>{b.className='mode-btn'+(i===0?' active':'');});
  document.getElementById('dm-years-row').style.display='none';
  document.getElementById('lm-years-row').style.display='none';
  document.getElementById('gm-years-row').style.display='none';
  document.getElementById('pl_en').checked=false;
  document.getElementById('d_lomb_en').checked=false;
  toggleDLomb();
  document.getElementById('pl_fcf_en').checked=false;
  Object.entries(DEF).forEach(([id,v])=>{
    const el=document.getElementById(id);if(!el)return;
    el.value=v;
    const lid=LV[id];if(!lid)return;
    const span=document.getElementById(lid);
    if(span)updateBadge(span,LF[id],v);
  });
  calc();
}

calc();
evalSyncPrice();