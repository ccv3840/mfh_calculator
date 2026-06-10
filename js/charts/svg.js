// SVG CHART BUILDERS
// ===================================================
function svgLine(series,opts){
  opts=opts||{};
  if(!series||!series.length||!series[0]||!series[0].length)return'<div style="color:var(--mu);padding:12px;font-size:11px">No data</div>';
  const W=760,H=220,ml=64,mr=24,mt=16,mb=44,pw=W-ml-mr,ph=H-mt-mb;
  const n=series[0].length;
  const allV=series.flat().filter(isFinite);
  let mn=Math.min(...allV),mx=Math.max(...allV);
  if(mn===mx){mn-=1;mx+=1;}
  const pad=(mx-mn)*0.06;mn-=pad;mx+=pad;
  const sx=i=>ml+i/(n-1)*pw,sy=v=>mt+ph-(v-mn)/(mx-mn)*ph;
  const fmt=opts.yFmt||fmtE;
  let s=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">`;
  for(let g=0;g<=5;g++){const yv=mn+(mx-mn)*g/5,yc=sy(yv);
    s+=`<line x1="${ml}" y1="${yc.toFixed(1)}" x2="${W-mr}" y2="${yc.toFixed(1)}" stroke="#1f2233" stroke-width="1"/>`;
    s+=`<text x="${ml-4}" y="${(yc+3.5).toFixed(1)}" fill="#3a3f5e" font-size="9" text-anchor="end" font-family="Space Mono,monospace">${fmt(yv)}</text>`;}
  if(mn<0&&mx>0){const y0=sy(0);s+=`<line x1="${ml}" y1="${y0.toFixed(1)}" x2="${W-mr}" y2="${y0.toFixed(1)}" stroke="#3a3f5e" stroke-width="1" stroke-dasharray="4,3"/>`;}
  if(opts.refs)opts.refs.forEach(ref=>{const yc=sy(ref.v);
    s+=`<line x1="${ml}" y1="${yc.toFixed(1)}" x2="${W-mr}" y2="${yc.toFixed(1)}" stroke="${ref.c}" stroke-width="1" stroke-dasharray="5,3"/>`;
    s+=`<text x="${W-mr+3}" y="${(yc+3).toFixed(1)}" fill="${ref.c}" font-size="8" font-family="Space Mono,monospace">${ref.lbl||''}</text>`;});
  s+=`<line x1="${ml}" y1="${mt+ph}" x2="${W-mr}" y2="${mt+ph}" stroke="#252840"/>`;
  const xstep=Math.max(1,Math.ceil((n-1)/8));
  for(let i=0;i<n;i+=xstep)s+=`<text x="${sx(i).toFixed(1)}" y="${H-mb+13}" fill="#3a3f5e" font-size="9" text-anchor="middle" font-family="Space Mono,monospace">${i}</text>`;
  if((n-1)%xstep!==0)s+=`<text x="${sx(n-1).toFixed(1)}" y="${H-mb+13}" fill="#3a3f5e" font-size="9" text-anchor="middle" font-family="Space Mono,monospace">${n-1}</text>`;
  if(opts.xLabel)s+=`<text x="${ml+pw/2}" y="${H-1}" fill="#3a3f5e" font-size="8" text-anchor="middle" font-family="Space Mono,monospace">${opts.xLabel}</text>`;
  series.forEach((ser,si)=>{
    const col=opts.colors?opts.colors[si]:'#60a5fa';
    const pts=ser.map((v,i)=>`${sx(i).toFixed(1)},${sy(v).toFixed(1)}`);
    const d='M'+pts.join(' L');
    if(opts.fill&&opts.fill[si]){
      const area=`M${sx(0).toFixed(1)},${sy(Math.max(mn,0)).toFixed(1)} `+pts.join(' L')+` L${sx(n-1).toFixed(1)},${sy(Math.max(mn,0)).toFixed(1)} Z`;
      s+=`<path d="${area}" fill="${col}" fill-opacity="0.07"/>`;}
    s+=`<path d="${d}" fill="none" stroke="${col}" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/>`;
    if(n<=16)ser.forEach((v,i)=>s+=`<circle cx="${sx(i).toFixed(1)}" cy="${sy(v).toFixed(1)}" r="2.5" fill="${col}" opacity="0.85"/>`);
  });
  if(opts.labels){let lx=ml;opts.labels.forEach((lbl,i)=>{const col=opts.colors?opts.colors[i]:'#60a5fa';
    s+=`<rect x="${lx}" y="${H-mb+21}" width="12" height="3" fill="${col}" rx="1.5"/>`;
    s+=`<text x="${lx+16}" y="${H-mb+27}" fill="${col}" font-size="9" font-family="Space Mono,monospace">${lbl}</text>`;
    lx+=lbl.length*5.4+26;});}
  s+='</svg>';return s;
}

function svgBars(values,opts){
  opts=opts||{};
  if(!values||!values.length)return'<div style="color:var(--mu);padding:12px;font-size:11px">No data</div>';
  const W=760,H=190,ml=64,mr=20,mt=14,mb=34;
  const pw=W-ml-mr,ph=H-mt-mb,n=values.length;
  const mn=Math.min(0,...values.filter(isFinite)),mx=Math.max(0,...values.filter(isFinite));
  const pad=(mx-mn)*0.07;
  const lo=mn-(Math.abs(mn)>0?pad:0),hi=mx+pad||1;
  const sy=v=>mt+ph-(v-lo)/(hi-lo)*ph,bw=Math.max(2,pw/n*0.72);
  let s=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">`;
  for(let g=0;g<=4;g++){const yv=lo+(hi-lo)*g/4,yc=sy(yv);
    s+=`<line x1="${ml}" y1="${yc.toFixed(1)}" x2="${W-mr}" y2="${yc.toFixed(1)}" stroke="#1f2233" stroke-width="1"/>`;
    s+=`<text x="${ml-4}" y="${(yc+3.5).toFixed(1)}" fill="#3a3f5e" font-size="9" text-anchor="end" font-family="Space Mono,monospace">${opts.yFmt?opts.yFmt(yv):fmtE(yv)}</text>`;}
  const y0=sy(0);
  s+=`<line x1="${ml}" y1="${y0.toFixed(1)}" x2="${W-mr}" y2="${y0.toFixed(1)}" stroke="#3a3f5e" stroke-width="1.5"/>`;
  values.forEach((v,i)=>{
    if(!isFinite(v))return;
    const x=ml+i/n*pw+(pw/n-bw)/2,yTop=v>=0?sy(v):y0,yBot=v>=0?y0:sy(v);
    const h=Math.max(1,Math.abs(yBot-yTop)),c=v>=0?'#34d399':'#f87171';
    s+=`<rect x="${x.toFixed(1)}" y="${yTop.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" fill="${c}" rx="2" opacity="0.85"/>`;
    if(n<=15){const lx=x+bw/2,ly=v>=0?yTop-3:yBot+10;
      s+=`<text x="${lx.toFixed(1)}" y="${ly.toFixed(1)}" fill="${c}" font-size="7.5" text-anchor="middle" font-family="Space Mono,monospace">${fmtE(v)}</text>`;}
  });
  const xstep=Math.max(1,Math.ceil(n/8));
  for(let i=0;i<n;i+=xstep){const xc=ml+(i+0.5)/n*pw;
    s+=`<text x="${xc.toFixed(1)}" y="${H-mb+11}" fill="#3a3f5e" font-size="9" text-anchor="middle" font-family="Space Mono,monospace">${i+1}</text>`;}
  s+='</svg>';return s;
}

// STACKED horizontal bars
function svgStackH(data,opts){
  opts=opts||{};
  if(!data||!data.length)return'<div style="color:var(--mu);padding:12px;font-size:11px">No data</div>';
  // Consistent per-category colors — same slot = same color across ALL rows
  // Slot 0: Foundation (ETF/Property/Lump)  Slot 1: MFH Equity  Slot 2: MFH Cash  Slot 3: Salary S&P500
  const SEG_COLORS=['#3b82f6','#10b981','#6ee7b7','#f59e0b'];
  const SEG_LABELS=['Collateral / Lump Sum','MFH Equity at exit','MFH Cumul. Cash Flow','Salary → S&P500'];
  const ROW_H=56,GAP=12,LEGEND_H=38;
  const W=780,ml=196,mr=86,pw=W-ml-mr;
  const H=LEGEND_H+data.length*(ROW_H+GAP)+16;
  const mx=Math.max(...data.map(d=>d.segs.reduce((a,sg)=>a+Math.max(0,sg.v),0)))||1;
  let s=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">`;

  // ── Legend ──
  // Collect which slots are actually used across all rows
  const usedSlots=new Set();
  data.forEach(d=>d.segs.forEach((sg,si)=>{if(sg&&sg.v>0)usedSlots.add(sg._slot!==undefined?sg._slot:si);}));
  let lx=ml;
  [...usedSlots].sort().forEach(si=>{
    s+=`<rect x="${lx}" y="9" width="14" height="14" fill="${SEG_COLORS[si]}" rx="3"/>`;
    s+=`<text x="${lx+19}" y="20" fill="${SEG_COLORS[si]}" font-size="10" font-weight="500" font-family="Space Grotesk,sans-serif">${SEG_LABELS[si]||'Segment '+(si+1)}</text>`;
    lx+=(SEG_LABELS[si]||'').length*5.8+34;
  });
  // separator line under legend
  s+=`<line x1="${ml}" y1="30" x2="${W-mr}" y2="30" stroke="#252840" stroke-width="1"/>`;

  // ── Rows ──
  data.forEach((d,di)=>{
    const ry=LEGEND_H+di*(ROW_H+GAP);
    const barY=ry+18, barH=24;

    // Row background (subtle)
    s+=`<rect x="${ml}" y="${ry+4}" width="${pw}" height="${barH+8}" fill="#161820" rx="4"/>`;

    // Option label LEFT
    s+=`<text x="${ml-10}" y="${barY+8}" fill="${d.color||'#e8eaf6'}" font-size="11" font-weight="600" text-anchor="end" font-family="Space Grotesk,sans-serif">${d.label}</text>`;
    s+=`<text x="${ml-10}" y="${barY+20}" fill="#6e738f" font-size="8.5" text-anchor="end" font-family="Space Mono,monospace">${d.sub||''}</text>`;

    // Segments
    let cx=ml;
    d.segs.forEach((sg,si)=>{
      if(!sg||sg.v<=0)return;
      const w=Math.max(0,(sg.v/mx)*pw);
      const slotIdx=sg._slot!==undefined?sg._slot:si;
      const col=SEG_COLORS[slotIdx]||sg.c||'#60a5fa';
      // Bar rect
      s+=`<rect x="${cx.toFixed(1)}" y="${barY}" width="${w.toFixed(1)}" height="${barH}" fill="${col}" rx="3"/>`;
      // White label inside bar (only if bar is wide enough)
      if(w>=52){
        s+=`<text x="${(cx+w/2).toFixed(1)}" y="${(barY+barH/2+4).toFixed(1)}" fill="rgba(0,0,0,0.75)" font-size="9" font-weight="600" text-anchor="middle" font-family="Space Mono,monospace">${fmtE(sg.v)}</text>`;
      } else if(w>=28){
        // Just value, tiny
        s+=`<text x="${(cx+w/2).toFixed(1)}" y="${(barY+barH/2+3.5).toFixed(1)}" fill="rgba(0,0,0,0.65)" font-size="7.5" text-anchor="middle" font-family="Space Mono,monospace">${fmtE(sg.v)}</text>`;
      }
      // Separator between segments
      cx+=w;
      if(cx<ml+pw-2)s+=`<line x1="${cx.toFixed(1)}" y1="${barY}" x2="${cx.toFixed(1)}" y2="${barY+barH}" stroke="#0b0d12" stroke-width="2"/>`;
    });

    // Total label RIGHT
    const tot=d.segs.reduce((a,sg)=>a+(sg&&sg.v>0?sg.v:0),0);
    const tot_x=ml+(tot/mx)*pw+10;
    s+=`<text x="${tot_x.toFixed(1)}" y="${(barY+barH/2+4).toFixed(1)}" fill="${d.color||'#e8eaf6'}" font-size="12" font-weight="700" font-family="Space Mono,monospace">${fmtE(tot)}</text>`;

    // Row divider (between rows, not last)
    if(di<data.length-1)s+=`<line x1="${ml}" y1="${ry+ROW_H+GAP/2}" x2="${W-mr}" y2="${ry+ROW_H+GAP/2}" stroke="#1f2233" stroke-width="1" stroke-dasharray="4,4"/>`;
  });

  s+='</svg>';return s;
}

// MFH costs breakdown — 2 grouped stacked columns per year
// Group 1 (left, wider): Running costs STACKED: Opex → Mortgage Interest → PL Annual Interest
// Group 2 (right, narrower): Capital outflows STACKED: Tilgung → PL Principal Repayment
// Reference: Gross rent outline (positive)   Line: Net FCF after ALL outflows
function svgMFHCosts(rows,p){
  if(!rows||!rows.length)return'<div style="color:var(--mu);padding:12px;font-size:11px">No data</div>';
  const pl_active=p&&p.pl_en&&p.pla>0;
  const pl_int=pl_active?p.pla*(p.plr/100):0; // flat annual PL interest

  const W=780,H=310,ml=68,mr=20,mt=18,mb=72,pw=W-ml-mr,ph=H-mt-mb;
  const n=rows.length;

  const maxPos=Math.max(...rows.map(r=>r.gross_rent),1);
  const maxNeg=Math.max(...rows.map(r=>r.oc_amt+r.int_amt+pl_int+r.tilg+(r.pl_repay||0)),1);
  const totalRange=maxPos+maxNeg;
  const y0=mt+ph*(maxPos/totalRange); // zero line in SVG coords
  const sy=v=>y0-v*(ph/totalRange);   // pos v → up, neg v → down

  const zone=pw/n;
  const totalW=zone*0.84;
  const g1W=totalW*0.56; // Group 1: running costs
  const g2W=totalW*0.36; // Group 2: capital outflows
  const gap=totalW*0.08; // gap between groups

  let s=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">`;

  // Grid
  for(let g=0;g<=6;g++){
    const yv=-maxNeg+(maxPos+maxNeg)*g/6;
    const yc=sy(yv);
    s+=`<line x1="${ml}" y1="${yc.toFixed(1)}" x2="${W-mr}" y2="${yc.toFixed(1)}" stroke="#1c1e2c" stroke-width="1"/>`;
    s+=`<text x="${ml-4}" y="${(yc+3.5).toFixed(1)}" fill="#3a3f5e" font-size="8.5" text-anchor="end" font-family="Space Mono,monospace">${fmtE(yv)}</text>`;
  }
  s+=`<line x1="${ml}" y1="${y0.toFixed(1)}" x2="${W-mr}" y2="${y0.toFixed(1)}" stroke="#3a3f5e" stroke-width="2"/>`;

  rows.forEach((r,i)=>{
    const cx=ml+(i+0.5)/n*pw;
    const x1=cx-totalW/2;
    const x2=x1+g1W+gap;

    // Gross rent reference (faint positive area)
    const rent_h=Math.max(0,y0-sy(r.gross_rent));
    s+=`<rect x="${x1.toFixed(1)}" y="${sy(r.gross_rent).toFixed(1)}" width="${totalW.toFixed(1)}" height="${rent_h.toFixed(1)}" fill="#34d399" rx="2" opacity="0.1"/>`;
    s+=`<line x1="${x1.toFixed(1)}" y1="${sy(r.gross_rent).toFixed(1)}" x2="${(x1+totalW).toFixed(1)}" y2="${sy(r.gross_rent).toFixed(1)}" stroke="#34d399" stroke-width="1.5" stroke-dasharray="3,2" opacity="0.55"/>`;
    if(rent_h>20&&i===0)s+=`<text x="${(x1+totalW/2).toFixed(1)}" y="${(sy(r.gross_rent)+13).toFixed(1)}" fill="#34d399" font-size="8" text-anchor="middle" font-family="Space Mono,monospace" opacity="0.6">rent</text>`;

    // ── GROUP 1: Running costs STACKED ──
    let top1=y0;
    function addG1(val,col,lbl){
      const h=Math.max(0,sy(-val)-y0-(top1-y0));
      if(h<1)return;
      s+=`<rect x="${x1.toFixed(1)}" y="${top1.toFixed(1)}" width="${g1W.toFixed(1)}" height="${h.toFixed(1)}" fill="${col}" rx="2"/>`;
      if(h>13)s+=`<text x="${(x1+g1W/2).toFixed(1)}" y="${(top1+h/2+3.5).toFixed(1)}" fill="rgba(255,255,255,0.85)" font-size="7.5" text-anchor="middle" font-family="Space Mono,monospace">${fmtE(val)}</text>`;
      top1+=h;
    }
    // Recalc properly using cumulative
    const oc_bottom=sy(-r.oc_amt);
    const int_bottom=sy(-(r.oc_amt+r.int_amt));
    const pli_bottom=sy(-(r.oc_amt+r.int_amt+pl_int));
    // Opex
    const oc_h=Math.max(0,oc_bottom-y0);
    if(oc_h>0){s+=`<rect x="${x1.toFixed(1)}" y="${y0.toFixed(1)}" width="${g1W.toFixed(1)}" height="${oc_h.toFixed(1)}" fill="#f87171" rx="2"/>`;
      if(oc_h>13)s+=`<text x="${(x1+g1W/2).toFixed(1)}" y="${(y0+oc_h/2+3.5).toFixed(1)}" fill="rgba(255,255,255,0.88)" font-size="7.5" text-anchor="middle" font-family="Space Mono,monospace">${fmtE(r.oc_amt)}</text>`;}
    // Interest stacked on Opex
    const int_h=Math.max(0,int_bottom-oc_bottom);
    if(int_h>0){s+=`<rect x="${x1.toFixed(1)}" y="${oc_bottom.toFixed(1)}" width="${g1W.toFixed(1)}" height="${int_h.toFixed(1)}" fill="#fbbf24" rx="2"/>`;
      if(int_h>13)s+=`<text x="${(x1+g1W/2).toFixed(1)}" y="${(oc_bottom+int_h/2+3.5).toFixed(1)}" fill="rgba(0,0,0,0.72)" font-size="7.5" text-anchor="middle" font-family="Space Mono,monospace">${fmtE(r.int_amt)}</text>`;}
    // PL Annual Interest stacked on Interest
    if(pl_int>0){const pli_h=Math.max(0,pli_bottom-int_bottom);
      if(pli_h>0){s+=`<rect x="${x1.toFixed(1)}" y="${int_bottom.toFixed(1)}" width="${g1W.toFixed(1)}" height="${pli_h.toFixed(1)}" fill="#f472b6" rx="2"/>`;
        if(pli_h>13)s+=`<text x="${(x1+g1W/2).toFixed(1)}" y="${(int_bottom+pli_h/2+3.5).toFixed(1)}" fill="rgba(255,255,255,0.88)" font-size="7.5" text-anchor="middle" font-family="Space Mono,monospace">${fmtE(pl_int)}</text>`;}}

    // Group 1 top label (first year only)
    if(i===0)s+=`<text x="${(x1+g1W/2).toFixed(1)}" y="${(y0-5).toFixed(1)}" fill="#6e738f" font-size="7" text-anchor="middle" font-family="Space Mono,monospace">COSTS</text>`;

    // ── GROUP 2: Capital outflows STACKED (separate column) ──
    const til_h=Math.max(0,sy(-r.tilg)-y0);
    if(til_h>0){s+=`<rect x="${x2.toFixed(1)}" y="${y0.toFixed(1)}" width="${g2W.toFixed(1)}" height="${til_h.toFixed(1)}" fill="#60a5fa" rx="2"/>`;
      if(til_h>13)s+=`<text x="${(x2+g2W/2).toFixed(1)}" y="${(y0+til_h/2+3.5).toFixed(1)}" fill="rgba(0,0,0,0.72)" font-size="7.5" text-anchor="middle" font-family="Space Mono,monospace">${fmtE(r.tilg)}</text>`;}
    // PL principal repayment stacked on Tilgung
    if(pl_active&&r.pl_repay>0){
      const pl_rep_top=y0+til_h;
      const pl_rep_h=Math.max(0,sy(-(r.tilg+r.pl_repay))-y0-til_h);
      if(pl_rep_h>0){s+=`<rect x="${x2.toFixed(1)}" y="${pl_rep_top.toFixed(1)}" width="${g2W.toFixed(1)}" height="${pl_rep_h.toFixed(1)}" fill="#a78bfa" rx="2"/>`;
        if(pl_rep_h>13)s+=`<text x="${(x2+g2W/2).toFixed(1)}" y="${(pl_rep_top+pl_rep_h/2+3.5).toFixed(1)}" fill="rgba(255,255,255,0.88)" font-size="7.5" text-anchor="middle" font-family="Space Mono,monospace">${fmtE(r.pl_repay)}</text>`;}}

    if(i===0)s+=`<text x="${(x2+g2W/2).toFixed(1)}" y="${(y0-5).toFixed(1)}" fill="#6e738f" font-size="7" text-anchor="middle" font-family="Space Mono,monospace">CAPITAL</text>`;

    // Net FCF dot
    const fcf_total=r.gross_rent-r.oc_amt-r.int_amt-pl_int-r.tilg-(r.pl_repay||0);
    s+=`<circle cx="${cx.toFixed(1)}" cy="${sy(fcf_total).toFixed(1)}" r="3.5" fill="${fcf_total>=0?'#34d399':'#f87171'}"/>`;

    // X axis label
    if(n<=15||(i%Math.ceil(n/8)===0)||i===n-1)
      s+=`<text x="${cx.toFixed(1)}" y="${H-mb+12}" fill="#3a3f5e" font-size="9" text-anchor="middle" font-family="Space Mono,monospace">${r.y}</text>`;
  });

  // Net FCF line
  const fcf_pts=rows.map((r,i)=>{
    const cx=ml+(i+0.5)/n*pw;
    const fcf=r.gross_rent-r.oc_amt-r.int_amt-pl_int-r.tilg-(r.pl_repay||0);
    return`${cx.toFixed(1)},${sy(fcf).toFixed(1)}`;
  }).join(' L');
  s+=`<path d="M${fcf_pts}" fill="none" stroke="#34d399" stroke-width="2" stroke-dasharray="5,3"/>`;

  // Legend
  const ALL_LEG=[
    {lbl:'Gross Rent',c:'#34d399',op:0.5,line:false},
    {lbl:'Opex',c:'#f87171',op:1,line:false},
    {lbl:'Mortgage Interest',c:'#fbbf24',op:1,line:false},
  ];
  if(pl_int>0)ALL_LEG.push({lbl:'PL Annual Interest',c:'#f472b6',op:1,line:false});
  ALL_LEG.push({lbl:'Tilgung',c:'#60a5fa',op:1,line:false});
  if(pl_active)ALL_LEG.push({lbl:'PL Principal',c:'#a78bfa',op:1,line:false});
  ALL_LEG.push({lbl:'Net FCF',c:'#34d399',op:1,line:true});

  let lx=ml;const leg_y=H-mb+22;
  ALL_LEG.forEach(({lbl,c,op,line})=>{
    if(lx+lbl.length*5.4+36>W-mr){lx=ml;} // wrap if needed
    if(line){s+=`<line x1="${lx}" y1="${leg_y+5}" x2="${lx+13}" y2="${leg_y+5}" stroke="${c}" stroke-width="2" stroke-dasharray="4,2"/>`;s+=`<circle cx="${lx+6}" cy="${leg_y+5}" r="3" fill="${c}"/>`;}
    else s+=`<rect x="${lx}" y="${leg_y}" width="10" height="10" fill="${c}" rx="2" opacity="${op}"/>`;
    s+=`<text x="${lx+16}" y="${leg_y+9}" fill="${c}" font-size="9" opacity="${op}" font-family="Space Grotesk,sans-serif">${lbl}</text>`;
    lx+=lbl.length*5.4+28;
  });
  s+=`<text x="${ml+pw/2}" y="${H-5}" fill="#2e324e" font-size="8" text-anchor="middle" font-family="Space Mono,monospace">Group 1 = running costs stacked (Opex + Interest [+ PL Interest])  ·  Group 2 = capital repayments stacked (Tilgung [+ PL Principal])</text>`;
  s+='</svg>';return s;
}

// LTV chart with dual axis
function svgLTV(ltv_data,opts){
  opts=opts||{};
  if(!ltv_data||ltv_data.length<2)return'<div style="color:var(--mu);padding:12px;font-size:11px">No data</div>';
  const W=760,H=220,ml=64,mr=64,mt=16,mb=44,pw=W-ml-mr,ph=H-mt-mb;
  const n=ltv_data.length;
  const etfVals=ltv_data.map(d=>d.etf),lbalVals=ltv_data.map(d=>d.lbal);
  const ltvVals=ltv_data.map(d=>d.ltv);
  const eurMx=Math.max(...etfVals)*1.1||1;
  const eurMn=0;
  const ltvMx=Math.max(100,...ltvVals.filter(isFinite))*1.1||100;
  const ltvMn=0;
  const sx=i=>ml+i/(n-1)*pw;
  const syE=v=>mt+ph-(v-eurMn)/(eurMx-eurMn)*ph;
  const syL=v=>mt+ph-(v-ltvMn)/(ltvMx-ltvMn)*ph;
  let s=`<svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;display:block" xmlns="http://www.w3.org/2000/svg">`;
  // grid & left axis (EUR)
  for(let g=0;g<=5;g++){const yv=eurMn+(eurMx-eurMn)*g/5,yc=syE(yv);
    s+=`<line x1="${ml}" y1="${yc.toFixed(1)}" x2="${W-mr}" y2="${yc.toFixed(1)}" stroke="#1f2233" stroke-width="1"/>`;
    s+=`<text x="${ml-4}" y="${(yc+3.5).toFixed(1)}" fill="#3a3f5e" font-size="8.5" text-anchor="end" font-family="Space Mono,monospace">${fmtE(yv)}</text>`;}
  // right axis (LTV %)
  for(let g=0;g<=5;g++){const yv=ltvMn+(ltvMx-ltvMn)*g/5,yc=syL(yv);
    s+=`<text x="${W-mr+4}" y="${(yc+3.5).toFixed(1)}" fill="#a78bfa" font-size="8.5" font-family="Space Mono,monospace">${yv.toFixed(0)}%</text>`;}
  // 50% LTV warning line
  const y50=syL(50);
  s+=`<line x1="${ml}" y1="${y50.toFixed(1)}" x2="${W-mr}" y2="${y50.toFixed(1)}" stroke="#fbbf24" stroke-width="1" stroke-dasharray="4,3"/>`;
  s+=`<text x="${W-mr+4}" y="${(y50+3).toFixed(1)}" fill="#fbbf24" font-size="8" font-family="Space Mono,monospace">50%</text>`;
  // x axis
  s+=`<line x1="${ml}" y1="${mt+ph}" x2="${W-mr}" y2="${mt+ph}" stroke="#252840"/>`;
  const xstep=Math.max(1,Math.ceil((n-1)/8));
  for(let i=0;i<n;i+=xstep)s+=`<text x="${sx(i).toFixed(1)}" y="${H-mb+13}" fill="#3a3f5e" font-size="9" text-anchor="middle" font-family="Space Mono,monospace">${i}</text>`;
  // ETF value line
  const pts_etf=etfVals.map((v,i)=>`${sx(i).toFixed(1)},${syE(v).toFixed(1)}`).join(' L');
  s+=`<path d="M${pts_etf}" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round"/>`;
  // Lombard balance line
  const pts_lb=lbalVals.map((v,i)=>`${sx(i).toFixed(1)},${syE(v).toFixed(1)}`).join(' L');
  s+=`<path d="M${pts_lb}" fill="none" stroke="#f87171" stroke-width="2" stroke-linecap="round"/>`;
  // LTV % line (uses right scale)
  const pts_ltv=ltvVals.map((v,i)=>`${sx(i).toFixed(1)},${syL(Math.min(v,ltvMx)).toFixed(1)}`).join(' L');
  s+=`<path d="M${pts_ltv}" fill="none" stroke="#a78bfa" stroke-width="2" stroke-dasharray="6,2" stroke-linecap="round"/>`;
  // Legend
  const leg2=[['ETF value','#34d399'],['Lombard balance','#f87171'],['LTV %','#a78bfa']];
  let lx=ml;
  leg2.forEach(([lbl,c])=>{
    s+=`<rect x="${lx}" y="${H-mb+21}" width="12" height="3" fill="${c}" rx="1.5"/>`;
    s+=`<text x="${lx+15}" y="${H-mb+27}" fill="${c}" font-size="9" font-family="Space Mono,monospace">${lbl}</text>`;
    lx+=lbl.length*5.4+26;});
  s+=`<text x="${ml-52}" y="${mt+ph/2}" fill="#3a3f5e" font-size="8.5" text-anchor="middle" transform="rotate(-90,${ml-52},${mt+ph/2})" font-family="Space Mono,monospace">EUR Value</text>`;
  s+=`<text x="${W-mr+52}" y="${mt+ph/2}" fill="#a78bfa" font-size="8.5" text-anchor="middle" transform="rotate(90,${W-mr+52},${mt+ph/2})" font-family="Space Mono,monospace">LTV %</text>`;
  s+='</svg>';return s;
}

// ===================================================