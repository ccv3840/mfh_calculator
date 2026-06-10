// RENDER FUNCTIONS
// ===================================================
function renderOverview(r,p){
  // Update OPT names dynamically
  OPT.A.fn='Option 1 — Swiss Lombard + '+fmtE(p.mab)+' MFH';
  OPT.B.fn='Option 2 — German Grundschuld + '+fmtE(p.mab)+' MFH';
  OPT.C.fn='Option 3 — All-in '+fmtE(p.mc_)+' MFH';

  // Strategy legend
  const pros={A:['Low rate ('+fP(p.lr)+')',lm_mode===1?'Full salary→S&P500 yr1':'Flexible repayment','ETF keeps compounding'],B:['No FX currency risk','Tax-deductible interest','All-German structure'],C:['Max property exposure',p.sal>0?'All salary→S&P500':'No salary cost','No acquisition loan'],D:['Zero operational work','No debt/margin call',p.d_lomb_en?'Leveraged S&P500 via Lombard':'Full diversification']};
  const cons={A:['CHF/EUR FX exposure',lm_mode===0?'Salary used for repayment':'Lombard held to exit','2-country complexity'],B:['Higher rate ('+fP(p.gr)+')',gm_mode===0?'Salary used for repayment':'Fixed period debt','Lower collateral growth'],C:['All capital consumed','€'+fmtE(p.mc_)+' mortgage risk','Concentrated position'],D:['No real estate exposure','No rental income',p.d_lomb_en?'Lombard repaid at exit from portfolio':'No leverage']};
  document.getElementById('strat-legend').innerHTML=KEYS.map(k=>{const o=OPT[k];
    return`<div class="sc sc${k}"><div class="sc-num">${o.sn}</div><div class="sc-name">${o.name}</div><div class="sc-desc">${o.desc}</div><div class="sc-chips">${pros[k].map(x=>`<span class="chip-p">✓ ${x}</span>`).join('')}${cons[k].map(x=>`<span class="chip-n">⚠ ${x}</span>`).join('')}</div></div>`;
  }).join('');

  // Summary window
  const tots=[r.totA,r.totB,r.totC,r.totD],gains=[r.gainA,r.gainB,r.gainC,r.gainD],cagrs=[r.cagrA,r.cagrB,r.cagrC,r.cagrD];
  const sorted=[...KEYS].sort((_a,_b)=>tots[KEYS.indexOf(_b)]-tots[KEYS.indexOf(_a)]);
  const rank={};sorted.forEach((k,i)=>rank[k]=i+1);
  const rankE={1:'🥇 #1',2:'🥈 #2',3:'🥉 #3',4:'4th'};
  document.getElementById('sw-yr').textContent=p.yrs;
  document.getElementById('sw-cards').innerHTML=KEYS.map(k=>{
    const i=KEYS.indexOf(k),o=OPT[k],mult=(tots[i]/Math.max(1,r.ti)).toFixed(2);
    return`<div class="swc" style="border-left:2px solid ${o.c}33">
      <div class="swc-rank"><span style="color:${o.c};font-size:9px;font-family:Space Mono,monospace">${o.sn}</span><span style="font-size:9px;font-family:Space Mono,monospace;background:${o.bg};color:${o.c};border:1px solid ${o.br};padding:1px 5px;border-radius:3px">${rankE[rank[k]]}</span></div>
      <div class="swc-tot" style="color:${o.c}">${fmtE(tots[i])}</div>
      <div class="swc-gain">Gain: <b style="color:var(--pos)">${fG(gains[i])}</b></div>
      <div class="swc-name">${o.name}</div>
      <div class="swc-cagr">${mult}× · ${cagrs[i].toFixed(1)}% CAGR on ${fmtE(r.ti)} input</div>
    </div>`;
  }).join('');

  // Insights
  const winner=KEYS[KEYS.map(k=>gains[KEYS.indexOf(k)]).indexOf(Math.max(...gains))];
  const bd=Math.abs(r.totB-r.totD);
  const opp=r.sp500_yr[p.yrs]-r.sp_A_yr[p.yrs];
  document.getElementById('sw-ins').innerHTML=[
    {l:'🏆 Strategy Winner',v:OPT[winner].sn,d:'Net +'+fmtE(r['gain'+winner]),vc:OPT[winner].c},
    {l:'B vs D Margin',v:fmtE(bd),d:r.totB>r.totD?'Property beats index':'Index beats property',vc:bd>50000?'var(--pos)':'var(--warn)'},
    {l:'Salary Opp. Cost (A&B)',v:fmtE(opp),d:'S&P500 gains missed during loan repayment',vc:'var(--warn)'},
  ].map(i=>`<div class="si"><div class="si-lbl">${i.l}</div><div class="si-val" style="color:${i.vc}">${i.v}</div><div class="si-desc">${i.d}</div></div>`).join('');

  // Bar chart
  const maxG=Math.max(...gains);
  const bkeys=[...KEYS].sort((_a,_b)=>gains[KEYS.indexOf(_b)]-gains[KEYS.indexOf(_a)]);
  document.getElementById('bc').innerHTML=bkeys.map(k=>{
    const i=KEYS.indexOf(k),o=OPT[k],g=gains[i],t=tots[i];
    const pct=Math.max(3,g/Math.max(maxG,1)*100),mult=(t/Math.max(1,r.ti)).toFixed(2);
    return`<div class="bc-row">
      <div class="bc-lbl"><span class="bc-dot" style="background:${o.c}"></span><b style="color:${o.c}">${o.sn}</b>&nbsp;<span style="font-size:9.5px">${o.name}</span></div>
      <div class="bc-track"><div class="bc-fill" style="width:${pct}%;background:${o.c}18;border-left:3px solid ${o.c}"><span style="color:${o.c}">${fmtE(g)} net · ${mult}×</span></div></div>
      <div class="bc-num" style="color:${o.c}">${fmtE(t)}</div>
      <div class="bc-x">${mult}×</div>
    </div>`;
  }).join('');

  // Salary flow
  document.getElementById('sf').innerHTML=KEYS.map(k=>{
    const o=OPT[k];
    const yr_rep=k==='A'?r.lA.yr:k==='B'?r.lB.yr:0;
    const sal_free=k==='A'?r.lA.sal_freed:k==='B'?r.lB.sal_freed:1;
    const sp=k==='A'?r.sp_A:k==='B'?r.sp_B:k==='C'?r.sp_C:r.sp_D;
    const mode_note=k==='A'?(p.lm===1?'Interest-only, all salary→S&P500':p.lm===2?`Repay over ${p.lmy}yr`:'Salary schedule'):k==='B'?(p.gm===1?'Interest-only→exit':p.gm===2?`Fix ${p.gmy}yr`:'Salary schedule'):'';
    const dots=Array.from({length:p.yrs},(_,i)=>{
      const y=i+1;
      const is_rep=y<sal_free&&(k==='A'||k==='B')&&p.sal>0;
      const c=is_rep?'#f87171':o.c;
      return`<div class="sf-dot" style="background:${c}22;border:1px solid ${c}55;color:${c}">${is_rep?'R':'S'}</div>`;
    }).join('');
    return`<div class="sf-card"><div class="sf-tag" style="color:${o.c}">${o.sn}</div><div class="sf-name">${o.name}</div><div class="sf-dots">${dots}</div><div style="font-size:8.5px;color:var(--mu);line-height:1.5">${yr_rep>0?`<span style="color:#f87171">R=repay yr 1–${yr_rep}</span>  `:''}<span style="color:${o.c}">S=S&P500</span>${mode_note?`<br><span style="color:var(--di)">${mode_note}</span>`:''}</div><div class="sf-res" style="color:${o.c}">S&P500 at yr${p.yrs}: ${fmtE(sp)}</div></div>`;
  }).join('');

  // Table
  document.getElementById('yr-lbl').textContent=p.yrs;
  const thd=KEYS.map(k=>`<th style="color:${OPT[k].c}">${OPT[k].sn}<br><span style="font-size:7.5px;opacity:.6;font-weight:400">${OPT[k].name}</span></th>`).join('');
  const cE=(v,k,b)=>{
    const col=OPT[k].c,fmt=fEf(v);
    return b?`<b style="color:${col}">${fmt}</b>`:`<span style="color:${col}">${fmt}</span>`;
  };
  const cG=v=>`<b style="color:${v>=0?'var(--pos)':'var(--neg)'}">${fG(v)}</b>`;
  const rows=[
    {sep:'MFH Investment'},
    {l:'MFH property equity at exit',d:'Property value at '+p.yrs+'yr – remaining mortgage',vs:[r.fAB.eq,r.fAB.eq,r.fC.eq,null]},
    {l:'MFH cumulative net cash flow',d:'Sum of all annual (NOI – annuity). Negative early years included.',vs:[r.fAB.cum,r.fAB.cum,r.fC.cum,null]},
    {sep:'Collateral & Index Investments'},
    {l:'Collateral / lump sum value at exit',d:'ETF World (A) · Property+carry (B) · None—consumed as costs (C) · S&P500 '+(p.d_lomb_en?'(with Lombard leverage)':'lump')+'  (D)',vs:[r.netETF_A,r.propV+r.carryB,null,r.lumpD]},
    {l:'Salary invested in S&P500',d:'Salary DCA from yr after loan repayment (A,B) or yr 1 (C,D)',vs:[r.sp_A,r.sp_B,r.sp_C,r.sp_D]},
    {sep:'Costs'},
    {l:'Acquisition loan — total interest',d:'Lombard interest paid (A) · Grundschuld interest paid (B)',vs:[-r.lA.ti,-r.lB.ti,0,0]},
    p.pl_en?{l:'Private loan — total interest cost',d:'Annual: '+fP(p.plr)+' × '+fmtE(p.pla)+' = '+fmtE(p.pla*(p.plr/100))+'/yr × '+p.yrs+'yr. Applies to all options (cost of initial capital).',vs:[-r.pl_total_int,-r.pl_total_int,-r.pl_total_int,-r.pl_total_int]}:null,
    {sep:'Summary'},
    {l:'Total wealth at year '+p.yrs,vs:[r.totA,r.totB,r.totC,r.totD],bold:true},
    {l:'Total capital input (initial + salary)',d:fmtE(p.ic)+' initial + '+fmtE(p.sal)+'/yr × '+p.yrs+'yr',vs:[r.ti,r.ti,r.ti,r.ti]},
    {l:'Net wealth created above input',vs:[r.gainA,r.gainB,r.gainC,r.gainD],gain:true},
  ].filter(Boolean);
  document.getElementById('bt').innerHTML=`<thead><tr><th>Component</th>${thd}</tr></thead><tbody>`+
    rows.map(row=>{
      if(row.sep)return`<tr class="tr-sep"><td colspan="5">${row.sep}</td></tr>`;
      const tds=row.vs.map((v,i)=>{
        const k=KEYS[i];
        if(v===null)return`<td style="color:var(--di)">—</td>`;
        if(row.gain)return`<td>${cG(v)}</td>`;
        if(row.bold)return`<td>${cE(v,k,true)}</td>`;
        if(v<0)return`<td style="color:var(--neg)">${fEf(v)}</td>`;
        return`<td>${cE(v,k)}</td>`;
      }).join('');
      return`<tr title="${row.d||''}"><td><span style="font-size:11px;color:var(--mu)">${row.l}</span>${row.d?`<div style="font-size:9px;color:var(--di);margin-top:1px">${row.d}</div>`:''}</td>${tds}</tr>`;
    }).join('')+'</tbody>';

  // Amort
  document.getElementById('ag').innerHTML=mkAmort(r.mabR,r.mabAnn,'Options 1(A) & 2(B) — '+fmtE(p.mab)+' MFH',OPT.A.c)+mkAmort(r.mcR,r.mcAnn,'Option 3(C) — '+fmtE(p.mc_)+' MFH',OPT.C.c);

  // MFH2
  if(mfh2Open&&r.mfh2_result){
    const m2=r.mfh2_result;
    if(!m2.feasible){
      document.getElementById('mfh2-result').innerHTML=`<div class="notice n-warn">Insufficient MFH1 equity at year ${m2.buy_year}: ${fmtE(m2.avail)} available, ${fmtE(m2.needed)} needed (10% of ${fmtE(p.m2p)}). Increase equity % or buy later.</div>`;
    } else {
      const f=m2.final;
      document.getElementById('mfh2-result').innerHTML=`<div class="notice n-good">
        <b>Second MFH feasible!</b> Buying ${fmtE(p.m2p)} MFH at year ${m2.buy_year} using ${fmtE(m2.avail)} from MFH1 equity (${p.m2e}%).
        After ${m2.yrs_remaining} years: equity <b>${fmtE(f.eq)}</b> · cumulative cash <b>${fmtE(f.cum)}</b> · net gain above cost: <b>${fmtE(m2.net_equity_gain)}</b>.
        <br>Total portfolio boost at year ${p.yrs}: MFH1 + MFH2 equity = <b>${fmtE(r.fAB.eq+f.eq)}</b> vs ${fmtE(r.fAB.eq)} without MFH2.
      </div>`;
    }
  }

  // Insight bar
  const w=r['tot'+winner];
  document.getElementById('insight-bar').innerHTML=`<b style="color:${OPT[winner].c}">${OPT[winner].fn}</b> leads with ${fmtE(w)} (${r['cagr'+winner].toFixed(1)}% CAGR).  B vs D gap: <b>${fmtE(Math.abs(r.totB-r.totD))}</b> ${r.totB>r.totD?'— leveraged property leads':'— S&P500 benchmark leads'}.  Lombard mode: <b>${['Salary schedule','Interest-only (cheap leverage)','Custom '+p.lmy+'yr'][p.lm]}</b> · Grundschuld: <b>${['Salary schedule','Interest-only','Custom '+p.gmy+'yr'][p.gm]}</b>`;
}

function mkAmort(rows,ann,label,col){
  const trs=rows.map(r=>{
    const cls=r.nc<0?'neg-r':'pos-r',cc=r.nc<0?'#f87171':'#34d399';
    return`<tr class="${cls}"><td>Yr ${r.y}</td><td>${fEf(r.bal)}</td><td style="color:#f87171">${fEf(r.int)}</td><td style="color:#60a5fa">${fEf(r.prin)}</td><td>${fEf(r.noi)}</td><td style="color:${cc}">${fG(r.nc)}</td><td style="color:${col};font-weight:700">${fEf(r.eq)}</td></tr>`;
  }).join('');
  const fn=rows[rows.length-1];
  const negT=rows.filter(r=>r.nc<0).reduce((s,r)=>s+r.nc,0);
  return`<div class="aw"><div class="ah" style="border-left:3px solid ${col}">${label} · Annuity: ${fEf(ann)}/yr</div><div style="overflow-x:auto"><table class="amt"><thead><tr><th>Yr</th><th>Mortgage Bal.</th><th>Interest</th><th>Tilgung</th><th>NOI</th><th>Net Cash</th><th>Equity</th></tr></thead><tbody>${trs}</tbody></table></div><div class="af"><span>Equity exit: <b style="color:${col}">${fEf(fn.eq)}</b></span><span>Cum.cash: <b style="color:#34d399">${fEf(fn.cum)}</b></span><span>Mortgage left: <b style="color:#f87171">${fEf(fn.bal)}</b></span><span>CF-neg total: <b style="color:#f87171">${fEf(negT)}</b></span></div></div>`;
}