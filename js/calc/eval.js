// ─── QUICK PROPERTY EVALUATION ──────────────────────────────────────
var _ev_mgmt_mode = 'sqm';
var _ev_buf_mode  = 'sqm';

function evalSyncPrice() {
  var listed   = +document.getElementById('ev_listed').value   || 0;
  var discount = +document.getElementById('ev_discount').value || 0;
  var price    = Math.round(listed * (1 - discount/100));
  document.getElementById('ev_price').value = price;
  // Update display
  var disp = document.getElementById('ev_price_display');
  if (disp) disp.textContent = price>=1e6 ? '€'+(price/1e6).toFixed(2).replace(/\.?0+$/,'')+'M' : '€'+Math.round(price/1000)+'k';
  // Update price/m² (needs sqm, may be 0 until evalCalc runs)
  var sqm0 = +document.getElementById('ev_sqm').value||0;
  var sqm0 = +document.getElementById('ev_sqm').value||0;
  var pm2d = document.getElementById('ev_price_m2_display');
  if (pm2d&&sqm0>0) pm2d.textContent = '€'+Math.round(price/sqm0).toLocaleString('de-DE')+' / m²';
  var save = listed - price;
  var ddisp = document.getElementById('ev_discount_display');
  if (ddisp) ddisp.textContent = (discount>0 ? '€'+Math.round(save/1000)+'k below asking ('+discount.toFixed(1)+'% off)' : 'No discount — full asking price');
  evalCalc();
}

function evalToggle(field, mode) {
  if (field === 'mgmt') {
    _ev_mgmt_mode = mode;
    document.getElementById('ev_mgmt_m2_btn').className  = 'ev-toggle-btn' + (mode==='sqm'?' active':'');
    document.getElementById('ev_mgmt_pct_btn').className = 'ev-toggle-btn' + (mode==='pct'?' active':'');
    document.getElementById('ev_mgmt_pfx').textContent   = mode==='sqm' ? '€/m²' : '%';
    document.getElementById('ev_mgmt_sfx').textContent   = mode==='sqm' ? '/mo'  : 'rent';
    if (mode==='sqm') document.getElementById('ev_mgmt_val').value = 2.5;
    else              document.getElementById('ev_mgmt_val').value = 5;
  } else {
    _ev_buf_mode = mode;
    document.getElementById('ev_buf_m2_btn').className  = 'ev-toggle-btn' + (mode==='sqm'?' active':'');
    document.getElementById('ev_buf_pct_btn').className = 'ev-toggle-btn' + (mode==='pct'?' active':'');
    document.getElementById('ev_buf_pfx').textContent   = mode==='sqm' ? '€/m²' : '%';
    document.getElementById('ev_buf_sfx').textContent   = mode==='sqm' ? '/yr'  : 'price';
    if (mode==='sqm') document.getElementById('ev_buf_val').value = 8;
    else              document.getElementById('ev_buf_val').value = 1;
  }
  evalCalc();
}

function evalSyncRent() {
  var sqm = +document.getElementById('ev_sqm').value     || 0;
  var rm2 = +document.getElementById('ev_rent_m2').value || 0;
  if (sqm>0 && rm2>0) document.getElementById('ev_cold_rent').value = Math.round(sqm*rm2);
  evalCalc();
}

function evalCalc() {
  var gn = function(id){ var el=document.getElementById(id); return el?(+el.value||0):0; };
  var gs = function(id){ var el=document.getElementById(id); return el?el.value:''; };
  var se = function(id,html){ var el=document.getElementById(id); if(el)el.innerHTML=html; };
  var st = function(id,txt){  var el=document.getElementById(id); if(el)el.textContent=txt; };
  var fE = function(v){ return '€'+Math.round(Math.abs(v)).toLocaleString('de-DE'); };
  var fP = function(v,d){ d=d||2; return (+v).toFixed(d)+'%'; };
  var fCF= function(v){ return (v>=0?'+':'-')+fE(v); };
  var fM = function(v){ return v>=1e6?'€'+(v/1e6).toFixed(2).replace(/\.?0+$/,'')+'M': v>=1000?'€'+Math.round(v/1000)+'k':'€'+Math.round(v); };
  var kc = function(v,lo,hi){ return v>=hi?'var(--pos)':v>=lo?'var(--warn)':'var(--neg)'; };

  var listed   = gn('ev_listed') || gn('ev_price');
  var price    = gn('ev_price');
  var sqm      = gn('ev_sqm');
  var cold_mo  = gn('ev_cold_rent');
  var mgmt_val = gn('ev_mgmt_val');
  var vac_pct  = gn('ev_vacancy');
  var buf_val  = gn('ev_buf_val');
  var loan_pct = gn('ev_loan_pct');
  var zins     = gn('ev_zins');
  var tilgung  = gn('ev_tilgung');
  var yrs      = Math.max(1,Math.min(30,gn('ev_yrs')||10));
  var rg       = gn('ev_rent_growth');
  var pa       = gn('ev_pa');
  var broker   = gn('ev_broker');
  var notary   = gn('ev_notary');
  var registry = gn('ev_registry');
  var grst     = gn('ev_grst');
  var addr     = gs('ev_addr') || 'Property';

  // ── Closing costs + Required Investment ALWAYS update (no early return) ──
  var broker_cost   = price * broker   / 100;
  var notary_cost   = price * notary   / 100;
  var registry_cost = price * registry / 100;
  var grst_cost     = price * grst     / 100;
  var closing_total = broker_cost + notary_cost + registry_cost + grst_cost;
  var closing_pct   = price>0 ? closing_total/price*100 : 0;
  var loan          = price * loan_pct / 100;
  var down_pmt      = price - loan;
  var req_invest    = down_pmt + closing_total;

  se('ev_closing_total',
    '<div style="margin-top:4px;font-family:Space Mono,monospace;font-size:9.5px;line-height:1.9">'+
    '<span style="color:var(--mu)">Broker: </span><span style="color:var(--neg)">'+fE(broker_cost)+'</span><br>'+
    '<span style="color:var(--mu)">Notar: </span><span style="color:var(--neg)">'+fE(notary_cost)+'</span><br>'+
    '<span style="color:var(--mu)">Grundbuch: </span><span style="color:var(--neg)">'+fE(registry_cost)+'</span><br>'+
    '<span style="color:var(--mu)">GrESt: </span><span style="color:var(--neg)">'+fE(grst_cost)+'</span><br>'+
    '<b style="color:var(--C)">Total: '+fE(closing_total)+' ('+fP(closing_pct,1)+'%)</b>'+
    '</div>');

  se('ev_invest_breakdown',
    '<div style="font-family:Space Mono,monospace;font-size:10px;line-height:2.1">'+
    '<span style="color:var(--mu)">Down payment: </span><span style="color:var(--tx)">'+fE(down_pmt)+'</span><br>'+
    '<span style="color:var(--mu)">Closing costs: </span><span style="color:var(--C)">'+fE(closing_total)+'</span><br>'+
    '<span style="color:var(--mu)">Bank loan: </span><span style="color:var(--D)">'+fE(loan)+'</span>'+
    '</div>');
  st('ev_invest_total', fM(req_invest));
  var pm2 = sqm>0 ? price/sqm : 0;
  var pm2d2 = document.getElementById('ev_price_m2_display');
  if (pm2d2) pm2d2.textContent = pm2>0?'€'+Math.round(pm2).toLocaleString('de-DE')+' / m²':'—';
  st('ev_invest_pct', fP(req_invest/Math.max(price,1)*100,1)+'% of price · loan '+loan_pct+'%');

  // ── Early return if no rent data ──────────────────────────────────
  if (!price || !cold_mo) {
    se('ev-kpis','<div style="color:var(--mu);padding:16px;font-size:11px">Enter purchase price and cold rent to see full analysis.</div>');
    se('ev-cf-hero',''); se('ev-table','');
    return;
  }

  // ── Core calcs ────────────────────────────────────────────────────
  var cold_ann  = cold_mo * 12;
  var vac_ann   = cold_ann * vac_pct / 100;
  var eff_rent  = cold_ann - vac_ann;
  var mgmt_ann  = _ev_mgmt_mode==='sqm' ? mgmt_val*sqm*12 : cold_ann*mgmt_val/100;
  var buf_ann   = _ev_buf_mode==='sqm'  ? buf_val*sqm     : price*buf_val/100;
  var noi0      = eff_rent - mgmt_ann - buf_ann;
  var ann       = loan * (zins+tilgung) / 100;
  var rnd       = Math.max(5, gn('ev_rnd') || 40);
  var afa_rate  = 1/rnd; // e.g. 40yr → 2.5%  |  50yr → 2.0%
  var afa       = price * 0.70 * afa_rate;
  var gross_yield = price>0 ? cold_ann/price*100 : 0;
  var net_yield   = price>0 ? noi0/price*100     : 0;
  var kpf         = cold_ann>0 ? price/cold_ann  : 0;
  var dscr_y1     = ann>0 ? noi0/ann : 0;
  var cf_mo_gross = (noi0-ann)/12;
  var tax_y1      = Math.max(0, noi0 - loan*zins/100 - afa)*0.42;
  var cf_mo_net   = (noi0 - ann - tax_y1)/12;
  var listing_discount = listed>0 ? (listed-price)/listed*100 : 0;

  // ── Year-by-year rows (build once, reuse) ─────────────────────────
  var yearRows = [];
  var bal = loan;
  for (var y=1; y<=Math.max(yrs,30); y++) {
    var gr_ = cold_ann*Math.pow(1+rg/100,y-1);
    var vc_ = gr_*vac_pct/100;
    var mg_ = _ev_mgmt_mode==='sqm' ? mgmt_val*sqm*12 : gr_*mgmt_val/100;
    var bf_ = _ev_buf_mode==='sqm'  ? buf_val*sqm     : price*buf_val/100;
    var ni_ = gr_-vc_-mg_-bf_;
    var in_ = bal*zins/100;
    var pr_ = Math.min(ann-in_,bal); bal=Math.max(0,bal-pr_);
    var nc_ = ni_-ann;
    var pv_ = price*Math.pow(1+pa/100,y);
    var eq_ = pv_-bal;
    var tx_ = Math.max(0,ni_-in_-afa)*0.42;
    var na_ = nc_-tx_;
    yearRows.push({y:y,bal:bal,int:in_,prin:pr_,gr:gr_,vc:vc_,mg:mg_,bf:bf_,ni:ni_,nc:nc_,na:na_,pv:pv_,eq:eq_,ds:ann>0?ni_/ann:0});
  }

  // ── TRM + IRR (based on yrs horizon) ─────────────────────────────
  var cum_cf_n = 0;
  for (var i=0; i<yrs; i++) cum_cf_n += yearRows[i].na;
  var equity_n  = yearRows[yrs-1].eq;
  var total_ret = equity_n + cum_cf_n;
  var trm = req_invest>0 ? total_ret/req_invest : 0;

  // IRR: -req_invest at t=0, na each year, + equity_n in final year
  function calcIRR_ev(cfs){
    function npv(r){ return cfs.reduce(function(s,c,t){return s+c/Math.pow(1+r,t);},0); }
    var lo=-0.5,hi=5,mid=0;
    if(npv(lo)*npv(hi)>0){for(var r=-0.5;r<5;r+=0.05)if(npv(r)*npv(r+0.05)<=0){lo=r;hi=r+0.05;break;}}
    for(var i=0;i<200;i++){mid=(lo+hi)/2;if(Math.abs(hi-lo)<1e-7)break;if(npv(lo)*npv(mid)<0)hi=mid;else lo=mid;}
    return mid*100;
  }
  var irr_cfs = [-req_invest];
  for (var i=0; i<yrs; i++) irr_cfs.push(i===yrs-1 ? yearRows[i].na+equity_n : yearRows[i].na);
  var irr_val = req_invest>0 ? calcIRR_ev(irr_cfs) : 0;

  // Update Required Investment card with TRM + IRR
  se('ev_invest_trm',
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px;border-top:1px solid var(--b1);padding-top:10px">'+
    '<div><div style="font-size:8px;font-family:Space Mono,monospace;letter-spacing:.07em;text-transform:uppercase;color:var(--di);margin-bottom:3px">TRM after '+yrs+'yr</div>'+
    '<div style="font-size:18px;font-weight:700;font-family:Space Mono,monospace;color:'+kc(trm,1.5,2.5)+'">'+trm.toFixed(2)+'×</div>'+
    '<div style="font-size:9px;color:var(--mu)">(equity+CF)/invested</div></div>'+
    '<div><div style="font-size:8px;font-family:Space Mono,monospace;letter-spacing:.07em;text-transform:uppercase;color:var(--di);margin-bottom:3px">Levered IRR</div>'+
    '<div style="font-size:18px;font-weight:700;font-family:Space Mono,monospace;color:'+kc(irr_val,8,14)+'">'+irr_val.toFixed(1)+'%</div>'+
    '<div style="font-size:9px;color:var(--mu)">on '+fM(req_invest)+' capital</div></div>'+
    '</div>');

  // ── Breakeven ─────────────────────────────────────────────────────
  var ann_rate  = loan_pct>0&&(zins+tilgung)>0 ? (zins+tilgung)/100*loan_pct/100 : 0;
  var fixed_in  = cold_ann*(1-vac_pct/100);
  var fixed_co  = (_ev_mgmt_mode==='sqm'?mgmt_val*sqm*12:0)+(_ev_buf_mode==='sqm'?buf_val*sqm:0);
  var var_co_rt = (_ev_mgmt_mode==='pct'?mgmt_val/100:0)+(_ev_buf_mode==='pct'?buf_val/100:0);
  var max_p10   = ann_rate>0 ? (fixed_in-fixed_co)/((1.00*ann_rate)+var_co_rt*0.01) : 0;
  var max_p125  = ann_rate>0 ? (fixed_in-fixed_co)/((1.10*ann_rate)+var_co_rt*0.01) : 0;
  var disc10    = listed>0&&max_p10>0  ? Math.max(0,(listed-max_p10)/listed*100)  : null;
  var disc125   = listed>0&&max_p125>0 ? Math.max(0,(listed-max_p125)/listed*100) : null; // DSCR 1.10
  var cum3=-req_invest, cf_be=null, inv_be=null;
  for (var i=0; i<yearRows.length; i++) {
    cum3 += yearRows[i].na;
    if (cf_be===null&&cum3>=0) cf_be=yearRows[i].y;
    var eq_gain = yearRows[i].eq-(price-loan);
    if (inv_be===null&&(eq_gain+cum3+req_invest)>=req_invest) inv_be=yearRows[i].y;
    if (i>=29&&cf_be!==null&&inv_be!==null) break;
  }

  // ── KPIs ─────────────────────────────────────────────────────────
  var kpis1 = [
    {l:'Kaufpreisfaktor', v:kpf.toFixed(1)+'×', s:cold_ann>0?(100/kpf).toFixed(2)+'% gross yield':'—', c:kc(25-kpf,0,5)},
    {l:'Bruttorendite',   v:fP(gross_yield),      s:'Cold rent / price',  c:kc(gross_yield,4,6)},
    {l:'Nettorendite',    v:fP(net_yield),         s:'NOI / price',        c:kc(net_yield,2,4)},
    {l:'DSCR Year 1',    v:dscr_y1.toFixed(3)+'×',s:dscr_y1>=1.25?'✓ healthy':dscr_y1>=1.1?'⚠ ok':dscr_y1>=1?'⚠ low':'✗ neg.CF',c:kc(dscr_y1,1,1.25)},
  ];
  var kpis2 = [
    {l:'Min Disc. DSCR≥1.1', v:disc125!==null?(disc125<0.1?'✓ ok now':'-'+disc125.toFixed(1)+'%'):'—', s:disc125>0.1?'Max price '+fM(max_p125):'Healthy at price', c:disc125!==null&&disc125<0.1?'var(--pos)':'var(--warn)'},
    {l:'Invest. Payback',v:inv_be?'Year '+inv_be:'> 30yr',s:'Equity+CF ≥ capital in',c:inv_be&&inv_be<=12?'var(--pos)':inv_be&&inv_be<=20?'var(--warn)':'var(--neg)'},
    {l:'AfA rate',        v:fP(afa_rate*100,2),s:'1/'+rnd+'yr = '+fE(afa)+'/yr deductible',c:'var(--A)'},
    {l:'Annuity / month', v:fE(ann/12),s:'Zins+Tilgung monthly',c:'var(--mu)'},
  ];
  var mkKpi=function(k){return '<div class="ev-kpi"><div class="ev-kpi-l">'+k.l+'</div><div class="ev-kpi-v" style="color:'+k.c+';font-size:'+(k.v.length>9?'12':'16')+'px">'+k.v+'</div><div class="ev-kpi-s">'+k.s+'</div></div>';};
  se('ev-kpis',
    '<div style="font-size:8px;font-family:Space Mono,monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--mu);margin-bottom:8px;padding-bottom:5px;border-bottom:1px solid var(--b1)">Initial KPI Metrics</div>'+
    '<div style="display:grid;grid-template-columns:repeat(8,1fr);gap:8px;margin-bottom:12px">'+kpis1.concat(kpis2).map(mkKpi).join('')+'</div>');

  // ── Cashflow hero ─────────────────────────────────────────────────
  var posG=cf_mo_gross>=0;
  var hC=posG?'var(--A)':'var(--neg)',hBg=posG?'rgba(52,211,153,.08)':'rgba(248,113,113,.08)',hBd=posG?'rgba(52,211,153,.3)':'rgba(248,113,113,.3)';
  se('ev-cf-hero',
    '<div class="ev-cf-hero" style="background:'+hBg+';border-color:'+hBd+'">'+
    '<div><div class="ev-cf-label">Monthly cashflow (pre-tax)</div>'+
    '<div class="ev-cf-value" style="color:'+hC+'">'+fCF(cf_mo_gross)+'<span style="font-size:16px;font-weight:400;color:var(--mu)"> / month</span></div></div>'+
    '<div style="padding:0 16px;border-left:1px solid var(--b2)">'+
    '<div class="ev-cf-label">After-tax yr 1 (AfA shielded)</div>'+
    '<div class="ev-cf-after" style="color:'+(cf_mo_net>=0?'var(--pos)':'var(--neg)')+'">'+fCF(cf_mo_net)+' / month</div>'+
    '<div class="ev-cf-sub">42% tax · AfA saves €'+Math.round(afa*0.42/12)+'/mo</div></div>'+
    '<div style="padding:0 16px;border-left:1px solid var(--b2)">'+
    '<div class="ev-cf-label">TRM after '+yrs+' years</div>'+
    '<div class="ev-cf-after" style="color:'+kc(trm,1.5,2.5)+'">'+trm.toFixed(2)+'× · IRR '+irr_val.toFixed(1)+'%</div>'+
    '<div class="ev-cf-sub">Total return: '+fM(total_ret)+' on '+fM(req_invest)+' invested</div></div>'+
    '<div style="padding:0 16px;border-left:1px solid var(--b2)">'+
    '<div class="ev-cf-label">Required investment</div>'+
    '<div class="ev-cf-after" style="color:var(--D)">'+fM(req_invest)+'</div>'+
    '<div class="ev-cf-sub">'+fM(down_pmt)+' down + '+fM(closing_total)+' costs</div></div>'+
    '</div>');

  // ── Table ─────────────────────────────────────────────────────────
  var rows_html='', cum4=-req_invest;
  for (var i=0; i<yrs; i++) {
    var r=yearRows[i];
    cum4+=r.na;
    var be=cf_be===r.y?' 🎯':'';
    rows_html+='<tr>'+
      '<td>'+r.y+be+'</td>'+
      '<td>'+fE(r.bal)+'</td>'+
      '<td class="ev-neg">'+fE(r.int)+'</td>'+
      '<td style="color:var(--D)">'+fE(r.prin)+'</td>'+
      '<td class="ev-neg">'+fE(r.mg)+'</td>'+
      '<td class="ev-neg">'+fE(r.vc)+'</td>'+
      '<td class="ev-neg">'+fE(r.bf)+'</td>'+
      '<td>'+fE(r.gr)+'</td>'+
      '<td style="color:var(--A)">'+fE(r.ni)+'</td>'+
      '<td class="'+(r.nc>=0?'ev-pos':'ev-neg')+'">'+fCF(r.nc)+'</td>'+
      '<td class="'+(r.ds>=1.25?'ev-pos':r.ds>=1?'ev-warn':'ev-neg')+'">'+r.ds.toFixed(2)+'×</td>'+
      '<td class="'+(cum4>=0?'ev-pos':'ev-neg')+'">'+fCF(cum4)+'</td>'+
      '<td style="color:var(--A);font-weight:700">'+fE(r.eq)+'</td>'+
      '</tr>';
  }
  se('ev-table',
    '<div class="ev-table-wrap">'+
    '<div class="ev-table-head">'+addr+' — '+fM(price)+
    (listed&&listed!==price?' <span style="font-size:9px;color:var(--mu)">(listed '+fM(listed)+', discount '+listing_discount.toFixed(1)+'%)</span>':'')+
    '<div class="ev-table-sub">Annual EUR · AfA '+fE(afa)+'/yr · 42% tax applied · 🎯 = CF breakeven year</div></div>'+
    '<div style="overflow-x:auto"><table class="evt">'+
    '<thead><tr>'+
    '<th>Yr</th><th>Mortgage</th><th>Interest</th><th>Tilgung</th>'+
    '<th>Mgmt Fee</th><th>Vacancy</th><th>Repair</th>'+
    '<th>Gross Rent</th><th>NOI</th><th>Net CF</th><th>DSCR</th><th>Cumul.CF</th><th>Equity</th>'+
    '</tr></thead><tbody>'+rows_html+'</tbody></table></div></div>');
}

// ===================================================