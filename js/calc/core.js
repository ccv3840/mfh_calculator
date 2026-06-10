// CORE CALCULATIONS
// ===================================================
function calcMFH(price,p,private_loan_active){
  const r=p.mr/100,t=p.til/100,ann=price*(r+t);
  const noi0=price*(p.rend/100)*(1-p.oc/100);
  const afa=price*0.70*0.02;
  let bal=price,cum=0,pl_remaining=private_loan_active?p.pla:0,cum_pl=0;
  const rows=[];
  for(let y=1;y<=p.yrs;y++){
    const int=bal*r,prin=Math.min(ann-int,bal);
    bal=Math.max(0,bal-prin);
    const noi=noi0*Math.pow(1+p.rg/100,y-1);
    const nc_gross=noi-ann;
    cum+=nc_gross;
    const pv=price*Math.pow(1+p.pa/100,y);
    const eq=pv-bal;
    const taxable=Math.max(0,noi-int-afa);
    const tax=taxable*0.42;
    const nc_at=nc_gross-tax;
    const dscr=noi/ann;
    // private loan repayment from FCF
    let pl_repay=0,nc_after_pl=nc_at;
    if(private_loan_active&&p.pl_fcf&&pl_remaining>0){
      pl_repay=Math.min(Math.max(0,nc_at)*p.plf/100,pl_remaining);
      pl_remaining=Math.max(0,pl_remaining-pl_repay);
      nc_after_pl=nc_at-pl_repay;
    }
    cum_pl+=pl_repay;
    rows.push({y,bal,int,prin,noi,nc:nc_gross,nc_at,cum,pv,eq,tax,dscr,
      oc_amt:noi0*(p.oc/100)*Math.pow(1+p.rg/100,y-1),
      int_amt:int,tilg:prin,gross_rent:price*(p.rend/100)*Math.pow(1+p.rg/100,y-1),
      pl_repay,nc_after_pl,
      coc_g:nc_gross/(price*0.10)*100,coc_n:nc_at/(price*0.10)*100});
  }
  return{rows,ann,noi0,afa};
}

function calcAcqLoanFlex(loan,rate,sal,n,mode,custom_yrs){
  if(loan<=0)return{ti:0,yr:0,bal_exit:0,sal_freed:1,rows:[]};
  const r=rate/100;
  if(mode===1){// interest-only
    const int=loan*r,ti=int*n;
    return{ti,yr:n,bal_exit:loan,sal_freed:1,
      rows:Array.from({length:n},(_,i)=>({y:i+1,i:int,prin:0,bal:loan}))};
  }
  // mode 0 or 2
  let ann_pmt=sal;
  if(mode===2){
    const yrs=Math.min(Math.max(1,custom_yrs||5),n);
    ann_pmt=r>0?loan*r/(1-Math.pow(1+r,-yrs)):loan/yrs;
  }
  let bal=loan,ti=0,yr=n;
  const rows=[];
  for(let y=1;y<=n;y++){
    const int=bal*r,prin=Math.min(ann_pmt-int,bal);
    bal=Math.max(0,bal-prin);ti+=int;
    rows.push({y,i:int,prin,bal});
    if(bal<=0){yr=y;break;}
  }
  return{ti,yr,bal_exit:bal,sal_freed:yr+1,rows};
}

function calcDCA(pmt,s,e,n,rate){
  if(pmt<=0)return 0;
  const r=rate/100;let fv=0;
  for(let y=s;y<=Math.min(e,n);y++)fv+=pmt*Math.pow(1+r,n-y);
  return fv;
}
function calcDCAyearly(pmt,s,e,n,rate){
  if(pmt<=0)return new Array(n+1).fill(0);
  const r=rate/100;const out=new Array(n+1).fill(0);
  for(let y=1;y<=n;y++){let v=0;for(let j=Math.max(1,s);j<=Math.min(e,y);j++)v+=pmt*Math.pow(1+r,y-j);out[y]=v;}
  return out;
}
function calcIRR(cfs){
  function npv(r){return cfs.reduce((s,c,t)=>s+c/Math.pow(1+r,t),0);}
  let lo=-0.9,hi=5,mid=0;
  if(npv(lo)*npv(hi)>0){for(let r=-0.5;r<5;r+=0.05)if(npv(r)*npv(r+0.05)<=0){lo=r;hi=r+0.05;break;}}
  for(let i=0;i<200;i++){mid=(lo+hi)/2;if(Math.abs(hi-lo)<1e-7)break;if(npv(lo)*npv(mid)<0)hi=mid;else lo=mid;}
  return mid;
}
function calcPropCarry(p){
  const r=p.gr/100,acq=p.ic*p.ltv/100;
  const noi0=p.ic*(p.cy/100)*(1-p.oc/100);
  const afa=p.ic*0.70*0.02;let bal=acq,carry=0;
  for(let y=1;y<=p.yrs;y++){
    const noi=noi0*Math.pow(1+p.rg/100,y-1);
    const gsi=bal*r,taxable=Math.max(0,noi-afa-gsi),pmt=Math.min(p.sal-gsi,bal);
    carry+=noi-taxable*0.42;
    bal=Math.max(0,bal-pmt);
  }
  return carry;
}
function calcNPV(cfs,rate){return cfs.reduce((s,c,t)=>s+c/Math.pow(1+rate/100,t),0);}

// Private loan interest cost per year (separate from MFH)
function calcPrivateLoanCost(p){
  if(!p.pl_en||p.pla<=0)return 0;
  // Simple: annual interest = amount * rate * years (simplified, ignoring partial repayment)
  return p.pla*(p.plr/100)*p.yrs; // total interest over holding period
}

// MFH2 calculation
function calcMFH2(mfh1_rows,p){
  const by=Math.min(p.m2y,p.yrs-1);
  if(by>=mfh1_rows.length)return null;
  const mfh1_equity_at_by=mfh1_rows[by-1]?mfh1_rows[by-1].eq:0;
  const avail=mfh1_equity_at_by*(p.m2e/100);
  const needed=p.m2p*0.10;
  if(avail<needed*0.5)return{feasible:false,avail,needed,buy_year:by};
  // Calculate MFH2 for remaining years
  const yrs_remaining=p.yrs-by;
  if(yrs_remaining<1)return{feasible:false,avail,needed,buy_year:by};
  const p2={...p,yrs:yrs_remaining};
  const mfh2=calcMFH(p.m2p,p2,false);
  const f=mfh2.rows[yrs_remaining-1];
  return{feasible:true,avail,needed,buy_year:by,mfh2,final:f,yrs_remaining,price:p.m2p,
    net_equity_gain:f.eq+Math.max(0,f.cum)-avail};
}

function calcAll(p){
  const n=p.yrs;
  const mab=calcMFH(p.mab,p,p.pl_en);
  const mc=calcMFH(p.mc_,p,false);
  const fAB=mab.rows[n-1],fC=mc.rows[n-1];
  const eqAB=p.mab*0.10,eqC=p.mc_*0.10;

  // Acquisition loans
  const lA=calcAcqLoanFlex(p.ic*p.ltv/100,p.lr,p.sal,n,p.lm,p.lmy);
  const lB=calcAcqLoanFlex(p.ic*p.ltv/100,p.gr,p.sal,n,p.gm,p.gmy);

  // ETF & Property collateral values
  const etfVals=Array.from({length:n+1},(_,y)=>(p.ic>0?p.ic:p.pl_en?p.pla:0)*Math.pow(1+p.etf/100,y));
  const etfAtExit=etfVals[n];
  const propV=p.ic*Math.pow(1+p.pa/100,n);
  const carryB=calcPropCarry(p);

  // Private loan annual cost
  const pl_annual_int=p.pl_en?p.pla*(p.plr/100):0;
  const pl_total_int=pl_annual_int*n;

  // Lombard: in interest-only mode, balance repaid at exit from ETF
  const lA_exit_repay=lA.mode===1||p.lm===1?lA.bal_exit:0;
  // Net ETF at exit (after repaying any Lombard balance)
  const netETF_A=etfAtExit-lA_exit_repay;

  // Option D Lombard — MUST be computed before sp_D_yr uses dL.sal_freed
  const d_lomb_amt=p.d_lomb_en&&p.ic>0?p.ic*(p.d_ltv/100):0;
  const d_sp_init=p.ic+d_lomb_amt;
  const lump_actual=Math.max(0,d_sp_init)*Math.pow(1+p.sp/100,n);
  const dL=p.d_lomb_en&&d_lomb_amt>0
    ?calcAcqLoanFlex(d_lomb_amt,p.lr,p.sal,n,p.dm,p.d_lmy)
    :{ti:0,yr:0,bal_exit:0,sal_freed:1,rows:[]};

  // S&P500 salary DCA — dL must exist before sp_D_yr
  const sp_A_yr=calcDCAyearly(p.sal,lA.sal_freed,n,n,p.sp);
  const sp_B_yr=calcDCAyearly(p.sal,lB.sal_freed,n,n,p.sp);
  const sp_C_yr=calcDCAyearly(p.sal,1,n,n,p.sp);
  const sp500_yr=calcDCAyearly(p.sal,1,n,n,p.sp);
  const sp_D_yr=p.d_lomb_en?calcDCAyearly(p.sal,dL.sal_freed,n,n,p.sp):sp500_yr;
  const sp_A=sp_A_yr[n],sp_B=sp_B_yr[n],sp_C=sp_C_yr[n],sp_D=sp_D_yr[n];

  // Totals
  const totA=netETF_A+fAB.eq+Math.max(0,fAB.cum)+sp_A-lA.ti-pl_total_int;
  const totB=propV+carryB+fAB.eq+Math.max(0,fAB.cum)+sp_B-lB.ti-pl_total_int;
  const totC=fC.eq+Math.max(0,fC.cum)+sp_C;
  const totD=(lump_actual-dL.bal_exit)+sp_D-dL.ti; // repay remaining Lombard at exit, minus interest paid

  const cagr=(t,i,y)=>i>0?(Math.pow(t/i,1/y)-1)*100:0;
  const ti=p.ic+p.sal*n;

  // LTV data for chart
  const ltv_data=[];
  for(let y=0;y<=n;y++){
    const etf=etfVals[y];
    let lbal=lA.rows.length>0&&y>0?(y<=lA.rows.length?lA.rows[Math.min(y-1,lA.rows.length-1)].bal:0):(y===0?p.ic*p.ltv/100:0);
    ltv_data.push({y,etf,lbal,ltv:etf>0?lbal/etf*100:0});
  }
  // Option D LTV (S&P500 vs Lombard balance)
  const ltv_data_D=Array.from({length:n+1},(_,y)=>{
    const pv=d_sp_init*Math.pow(1+p.sp/100,y);
    const lbal=y===0?d_lomb_amt:(y<=dL.rows.length?dL.rows[y-1].bal:dL.bal_exit);
    return{y,etf:pv,lbal,ltv:pv>0&&lbal>0?lbal/pv*100:0};
  });

  // Yearly totals for wealth chart
  const yearly={A:[],B:[],C:[],D:[]};
  for(let y=0;y<=n;y++){
    const rAB=y>0?mab.rows[y-1]:null;
    const rC=y>0?mc.rows[y-1]:null;
    const etfy=etfVals[y];
    const lA_bal_y=y===0?p.ic*p.ltv/100:y<=lA.rows.length?lA.rows[y-1].bal:0;
    const lB_bal_y=y===0?p.ic*p.ltv/100:y<=lB.rows.length?lB.rows[y-1].bal:0;
    const net_etf_y=p.lm===1?etfy-lA_bal_y:etfy; // interest-only: ETF minus full Lombard until exit
    yearly.A.push(y===0?p.ic:net_etf_y+(rAB?rAB.eq:0)+(rAB&&rAB.cum>0?rAB.cum:0)+sp_A_yr[y]-lA.ti*(y/n));
    yearly.B.push(y===0?p.ic:propV*(y/n)+carryB*(y/n)+(rAB?rAB.eq:0)+(rAB&&rAB.cum>0?rAB.cum:0)+sp_B_yr[y]-lB.ti*(y/n));
    yearly.C.push(y===0?0:(rC?rC.eq:0)+(rC&&rC.cum>0?rC.cum:0)+sp_C_yr[y]);
    yearly.D.push((d_sp_init>0?d_sp_init*Math.pow(1+p.sp/100,y):p.ic*Math.pow(1+p.sp/100,y))-dL.bal_exit*(y/n)+sp_D_yr[y]);
  }
  // fix D year-by-year
  for(let y=0;y<=n;y++)yearly.D[y]=p.ic*Math.pow(1+p.sp/100,y)+sp500_yr[y];

  // MFH2
  const mfh2_result=mfh2Open?calcMFH2(mab.rows,p):null;

  function mfhMet(mfh,eq_inv,price){
    const rows=mfh.rows,fn=rows[rows.length-1];
    const irr_cfs=[-eq_inv,...rows.map((r,i)=>i===rows.length-1?r.nc+fn.eq:r.nc)];
    const irr=calcIRR(irr_cfs)*100;
    const npv=calcNPV(irr_cfs,p.dr);
    const trm=(fn.eq+fn.cum)/eq_inv;
    const disc_eq=fn.eq/Math.pow(1+p.inf/100,rows.length);
    const disc_cf=rows.reduce((s,r,i)=>s+r.nc/Math.pow(1+p.inf/100,i+1),0);
    const trm_disc=(disc_eq+disc_cf)/eq_inv;
    const tap=fn.cum+rows.reduce((s,r)=>s+r.prin,0)+(fn.pv-price);
    const rp=irr-p.rf;
    const neg_cf=rows.filter(r=>r.nc<0).reduce((s,r)=>s+r.nc,0);
    const npvSens=[];
    for(let dr=1;dr<=15;dr+=0.5)npvSens.push({dr,npv:calcNPV(irr_cfs,dr)});
    return{irr,npv,trm,trm_disc,disc_profit:disc_eq+disc_cf-eq_inv,tap,rp,neg_cf,npvSens,
      dscr_arr:rows.map(r=>r.dscr),coc_g:rows.map(r=>r.coc_g),coc_n:rows.map(r=>r.coc_n),
      dscr1:rows[0].dscr,dscrN:fn.dscr,coc1g:rows[0].coc_g,coc1n:rows[0].coc_n,
      cocNg:fn.coc_g,cocNn:fn.coc_n,cum_cf:fn.cum,equity_n:fn.eq,
      tilg_total:rows.reduce((s,r)=>s+r.prin,0),price_app:fn.pv-price,eq_inv};
  }

  return{ti,totA,totB,totC,totD,
    gainA:totA-ti,gainB:totB-ti,gainC:totC-ti,gainD:totD-ti,
    cagrA:cagr(totA,ti,n),cagrB:cagr(totB,ti,n),cagrC:cagr(totC,ti,n),cagrD:cagr(totD,ti,n),
    netETF_A,propV,carryB,fAB,fC,sp_A,sp_B,sp_C,sp_D,lumpD:lump_actual,lA,lB,
    mabR:mab.rows,mcR:mc.rows,mabAnn:mab.ann,mcAnn:mc.ann,
    yearly,metAB:mfhMet(mab,eqAB,p.mab),metC:mfhMet(mc,eqC,p.mc_),
    sp_A_yr,sp_B_yr,sp_C_yr,sp500_yr,sp_D_yr,eqAB,eqC,ltv_data,ltv_data_D,d_lomb_amt,dL,
    pl_total_int,pl_annual_int,mfh2_result};
}

// ===================================================