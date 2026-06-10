function renderMetrics(r,p){
  const m=r.metAB,mc=r.metC;
  const cls=(v,g,w)=>v>=g?'good':v>=w?'warn':'bad';
  function kCard(met,lbl,price,col,bg,br){
    return`<div class="mh-card" style="border-top:2px solid ${col}">
      <div class="mh-top"><div class="mh-badge" style="background:${bg};color:${col};border:1px solid ${br}">${lbl}</div><div class="mh-price">${fmtE(price)} · equity inv: ${fmtE(met.eq_inv)}</div></div>
      <div class="kpi-grid">
        <div class="kpi ${cls(met.irr,12,7)}"><div class="kpi-l">Levered IRR</div><div class="kpi-v">${met.irr.toFixed(1)}%</div><div class="kpi-s">equity return</div></div>
        <div class="kpi ${cls(met.dscr1,1.25,1)}"><div class="kpi-l">DSCR yr1</div><div class="kpi-v">${met.dscr1.toFixed(3)}</div><div class="kpi-s">${met.dscr1>=1.25?'healthy':met.dscr1>=1?'ok':'risky'}</div></div>
        <div class="kpi ${met.npv>0?'good':'bad'}"><div class="kpi-l">NPV @${p.dr}%</div><div class="kpi-v">${fmtE(met.npv)}</div><div class="kpi-s">${met.npv>0?'+ve':'−ve'}</div></div>
        <div class="kpi ${cls(met.trm,3,1.5)}"><div class="kpi-l">TRM</div><div class="kpi-v">${met.trm.toFixed(2)}×</div><div class="kpi-s">total return mult.</div></div>
        <div class="kpi ${cls(met.rp,5,2)}"><div class="kpi-l">Risk Premium</div><div class="kpi-v">${fPn(met.rp)}</div><div class="kpi-s">vs ${p.rf}% rfr</div></div>
        <div class="kpi ${met.coc1g>0?'warn':'bad'}"><div class="kpi-l">CoC yr1 gross</div><div class="kpi-v">${met.coc1g.toFixed(1)}%</div><div class="kpi-s">cash-on-cash</div></div>
      </div>
    </div>`;
  }
  document.getElementById('mh').innerHTML=kCard(m,'Options 1(A) & 2(B) — '+OPT.A.name.split('+')[1]||'MFH',p.mab,OPT.A.c,OPT.A.bg,OPT.A.br)+kCard(mc,'Option 3(C) — '+OPT.C.name,p.mc_,OPT.C.c,OPT.C.bg,OPT.C.br);

  const b=(v,g,w,fmt)=>`<span class="badge ${cls(v,g,w)}">${fmt(v)}</span>`;
  const row=(l,d,vAB,vC,bAB,bC)=>`<tr><td><div class="m-lbl">${l}</div><div class="m-desc">${d}</div></td><td>${bAB||''} ${vAB}</td><td>${bC||''} ${vC}</td></tr>`;
  const sec=l=>`<tr class="m-sec"><td colspan="3">${l}</td></tr>`;

  document.getElementById('mt').innerHTML=`<thead><tr><th>Metric</th><th style="color:${OPT.A.c}">Options 1(A) &amp; 2(B) — ${fmtE(p.mab)}</th><th style="color:${OPT.C.c}">Option 3(C) — ${fmtE(p.mc_)}</th></tr></thead><tbody>`+[
    sec('DSCR / Debt Coverage'),
    row('DSCR — Year 1','NOI ÷ Debt Service. >1.25 healthy, >1.0 ok, <1.0 cash-negative',m.dscr1.toFixed(4)+'×',mc.dscr1.toFixed(4)+'×',b(m.dscr1,1.25,1,v=>v>=1.25?'✓ healthy':v>=1?'ok':'⚠ risky'),b(mc.dscr1,1.25,1,v=>v>=1.25?'✓ healthy':v>=1?'ok':'⚠ risky')),
    row('DSCR — Year '+p.yrs,'Rent grew '+fP(p.rg)+'/yr improves coverage',m.dscrN.toFixed(4)+'×',mc.dscrN.toFixed(4)+'×',b(m.dscrN,1.25,1,v=>v>=1.25?'✓':'ok'),b(mc.dscrN,1.25,1,v=>v>=1.25?'✓':'ok')),
    row('Cash-flow negative total','Total shortfall needing external funding (from reserves)',fEf(m.neg_cf),fEf(mc.neg_cf),'',''),
    sec('Cash-on-Cash Returns (equity = closing costs ~10%)'),
    row('CoC ROI yr1 (gross)','Net cash flow ÷ equity invested',fP(m.coc1g),fP(mc.coc1g),'',''),
    row('CoC ROI yr1 (net after tax)','After 42% marginal rate with AfA shield',fP(m.coc1n),fP(mc.coc1n),'',''),
    row('CoC ROI yr'+p.yrs+' (gross)',fP(p.rg)+'/yr rent growth applied to final year',fP(m.cocNg),fP(mc.cocNg),b(m.cocNg,8,3,v=>v.toFixed(1)+'%'),b(mc.cocNg,8,3,v=>v.toFixed(1)+'%')),
    row('CoC ROI yr'+p.yrs+' (net)','After income tax final year',fP(m.cocNn),fP(mc.cocNn),'',''),
    sec('Total Return & Appreciation'),
    row('Total Appreciation Profit','= Net Cash Flow + Tilgung Repaid + Price Appreciation',fEf(m.tap),fEf(mc.tap),'',''),
    row('TRM — Total Return Multiplier','(Equity at exit + Cumul. Cash) ÷ Equity Invested',m.trm.toFixed(3)+'×',mc.trm.toFixed(3)+'×',b(m.trm,3,1.5,v=>v.toFixed(2)+'×'),b(mc.trm,3,1.5,v=>v.toFixed(2)+'×')),
    row('TRM Discounted ('+fP(p.inf)+' inflation)','Real TRM — future values discounted',m.trm_disc.toFixed(3)+'×',mc.trm_disc.toFixed(3)+'×','',''),
    row('Discounted Profit @'+fP(p.inf),'Total return in today\'s money minus initial equity',fEf(m.disc_profit),fEf(mc.disc_profit),m.disc_profit>0?'<span class="badge good">positive</span>':'<span class="badge bad">negative</span>',mc.disc_profit>0?'<span class="badge good">positive</span>':'<span class="badge bad">negative</span>'),
    sec('Value'),
    row('NPV @ '+fP(p.dr),'Discounted equity cash flows minus initial equity',fEf(m.npv),fEf(mc.npv),m.npv>0?'<span class="badge good">value+</span>':'<span class="badge bad">value−</span>',mc.npv>0?'<span class="badge good">value+</span>':'<span class="badge bad">value−</span>'),
    row('Equity invested (closing costs)','~10% Nebenkosten: GrESt 5.5%+Notar+Broker',fEf(m.eq_inv),fEf(mc.equity_inv),'',''),
    row('Equity at exit',fP(p.pa)+'/yr appreciation for '+p.yrs+'yr – remaining mortgage',fEf(m.equity_n),fEf(mc.equity_n),'',''),
    row('Tilgung repaid','Principal paid down via annuity over '+p.yrs+' years',fEf(m.tilg_total),fEf(mc.tilg_total),'',''),
    row('Price appreciation',fP(p.pa)+'/yr × '+p.yrs+' years',fEf(m.price_app),fEf(mc.price_app),'',''),
    sec('Risk & Return'),
    row('Levered Equity IRR','IRR on equity (closing costs). Includes leverage amplification.',fP(m.irr),fP(mc.irr),b(m.irr,12,7,v=>v.toFixed(1)+'%'),b(mc.irr,12,7,v=>v.toFixed(1)+'%')),
    row('Risk Premium vs '+fP(p.rf),'Levered IRR minus risk-free rate (German Bund)',fPn(m.rp),fPn(mc.rp),b(m.rp,5,2,v=>fPn(v)),b(mc.rp,5,2,v=>fPn(v))),
  ].join('')+'</tbody>';

  document.getElementById('ch-dscr2').innerHTML=svgLine([m.dscr_arr,mc.dscr_arr],{colors:[OPT.A.c,OPT.C.c],labels:['DSCR 1(A)&2(B)','DSCR 3(C)'],yFmt:v=>(+v).toFixed(2),refs:[{v:1.0,c:'#f87171',lbl:'1.0'},{v:1.25,c:'#fbbf24',lbl:'1.25'}]});
  document.getElementById('ch-coc').innerHTML=svgLine([m.coc_g,mc.coc_g,m.coc_n,mc.coc_n],{colors:[OPT.A.c,OPT.C.c,OPT.A.c+'88',OPT.C.c+'88'],labels:['1&2 gross','3 gross','1&2 net','3 net'],yFmt:v=>(+v).toFixed(1)+'%',refs:[{v:0,c:'#3a3f5e',lbl:''}]});
  document.getElementById('ch-npv').innerHTML=svgLine([(m.npvSens||[]).map(d=>d.npv),(mc.npvSens||[]).map(d=>d.npv)],{colors:[OPT.A.c,OPT.C.c],labels:['NPV 1(A)&2(B)','NPV 3(C)'],yFmt:fmtE,refs:[{v:0,c:'#f87171',lbl:'IRR (NPV=0)'}]});
  document.getElementById('ch-cc2').innerHTML=svgLine([r.mabR.map(row=>row.cum),r.mcR.map(row=>row.cum)],{colors:[OPT.A.c,OPT.C.c],labels:['Cum.CF 1&2','Cum.CF 3'],yFmt:fmtE,refs:[{v:0,c:'#3a3f5e',lbl:''}]});
}