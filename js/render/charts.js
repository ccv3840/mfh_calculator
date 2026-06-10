function renderCharts(r,p){
  function safe(id,fn){try{const el=document.getElementById(id);if(el)el.innerHTML=fn();}catch(e){const el=document.getElementById(id);if(el)el.innerHTML='<div style="color:var(--neg);padding:10px;font-size:11px">Chart error: '+e.message+'</div>';console.error(id,e);}}

  safe('ch-wealth',()=>svgLine([r.yearly.A,r.yearly.B,r.yearly.C,r.yearly.D],{colors:KEYS.map(k=>OPT[k].c),labels:KEYS.map(k=>OPT[k].sn+' · '+OPT[k].name.split(' ')[0]),xLabel:'Year',fill:[1,1,1,1],yFmt:fmtE}));
  const pv=r.mabR.map(row=>row.pv),bl=r.mabR.map(row=>row.bal),eq=r.mabR.map(row=>row.eq);
  safe('ch-eq-ab',()=>svgLine([pv,bl,eq],{colors:['#60a5fa','#f87171',OPT.A.c],labels:['Property Value','Mortgage Balance','Net Equity'],yFmt:fmtE,fill:[0,0,1]}));
  const pvC=r.mcR.map(row=>row.pv),blC=r.mcR.map(row=>row.bal),eqC=r.mcR.map(row=>row.eq);
  safe('ch-eq-c',()=>svgLine([pvC,blC,eqC],{colors:['#60a5fa','#f87171',OPT.C.c],labels:['Property Value','Mortgage Balance','Net Equity'],yFmt:fmtE,fill:[0,0,1]}));
  safe('ch-cf-ab',()=>svgBars(r.mabR.map(row=>row.nc),{yFmt:fmtE}));
  safe('ch-cf-c',()=>svgBars(r.mcR.map(row=>row.nc),{yFmt:fmtE}));
  safe('ch-costs',()=>svgMFHCosts(r.mabR,p));
  safe('ch-dscr',()=>svgLine([r.mabR.map(row=>row.dscr),r.mcR.map(row=>row.dscr)],{colors:[OPT.A.c,OPT.C.c],labels:['DSCR 1(A)&2(B)','DSCR 3(C)'],yFmt:v=>(+v).toFixed(2)+'×',refs:[{v:1.0,c:'#f87171',lbl:'1.0'},{v:1.25,c:'#fbbf24',lbl:'1.25'}]}));
  safe('ch-ltv',()=>svgLTV(r.ltv_data||[]));
  safe('ch-ltv-d',()=>{
    if(!p.d_lomb_en||!r.d_lomb_amt||r.d_lomb_amt<=0)
      return'<div style="color:var(--mu);padding:22px 14px;font-size:11px;text-align:center;line-height:1.8">Enable <b style=\"color:var(--D)\">Lombard on Option 4(D)</b> in the sidebar (Option 4 section) to see the S&amp;P500 vs Lombard LTV trajectory here.</div>';
    return svgLTV(r.ltv_data_D||[]);
  });
  safe('ch-dca',()=>{
    const ayr=(r.sp_A_yr||[]).slice(1),byr=(r.sp_B_yr||[]).slice(1),cyr=(r.sp_C_yr||r.sp500_yr||[]).slice(1);
    return svgLine([ayr,byr,cyr],{colors:[OPT.A.c,OPT.B.c,OPT.C.c],labels:['Opt.1(A) S&P500','Opt.2(B) S&P500','Opt.3(C)/4(D) S&P500'],yFmt:fmtE});
  });
  safe('ch-cumcf',()=>svgLine([r.mabR.map(row=>row.cum),r.mcR.map(row=>row.cum)],{colors:[OPT.A.c,OPT.C.c],labels:['Cumul. CF 1(A)&2(B)','Cumul. CF 3(C)'],yFmt:fmtE,refs:[{v:0,c:'#3a3f5e',lbl:''}]}));
  document.getElementById('yr-lbl2').textContent=p.yrs;
  const stk=[
    // Slot 0=Collateral/Lump, 1=MFH Equity, 2=MFH Cash, 3=Salary S&P500
    {label:'Option 1 (A)',sub:'Swiss Lombard + MFH',color:OPT.A.c,
     segs:[{v:r.netETF_A,slot:0},{v:r.fAB.eq,slot:1},{v:Math.max(0,r.fAB.cum),slot:2},{v:r.sp_A,slot:3}]},
    {label:'Option 2 (B)',sub:'Grundschuld + MFH',color:OPT.B.c,
     segs:[{v:r.propV+r.carryB,slot:0},{v:r.fAB.eq,slot:1},{v:Math.max(0,r.fAB.cum),slot:2},{v:r.sp_B,slot:3}]},
    {label:'Option 3 (C)',sub:'All-in Large MFH',color:OPT.C.c,
     segs:[{v:0,slot:0},{v:r.fC.eq,slot:1},{v:Math.max(0,r.fC.cum),slot:2},{v:r.sp_C,slot:3}]},
    {label:'Option 4 (D)',sub:'Pure S&P500',color:OPT.D.c,
     segs:[{v:r.lumpD,slot:0},{v:0,slot:1},{v:0,slot:2},{v:r.sp_D,slot:3}]},
  ];
  // Map slot index as the segment index so svgStackH uses SEG_COLORS[slot]
  stk.forEach(row=>row.segs=row.segs.map((sg,i)=>({v:sg.v,c:null,_slot:sg.slot??i})));
  safe('ch-stack',()=>svgStackH(stk,{}));
}