// ─── Property quick-evaluation tests ──────────────────────────────

suite('Closing costs — Nebenkosten');

test('standard German Nebenkosten ~11%', ()=>{
  var price=1000000;
  var total=price*(0.0357+0.015+0.005+0.055);
  assertClose(total/price, 0.1107, 0.001);
});
test('required investment = down payment + closing costs', ()=>{
  var price=1000000, loanPct=80;
  var closing=price*(0.0357+0.015+0.005+0.055);
  var down=price*(1-loanPct/100);
  assertClose(down+closing, 310700, 100);
});
test("100% loan → required investment = closing costs only", ()=>{
  var price=1012500;
  var closing=price*(0.0357+0.015+0.005+0.055);
  var down=price*(1-1.0);  // 100% loan
  assertClose(down+closing, closing, 1);
});

suite('Price negotiation');

test('25% discount on €1.35M → €1.0125M', ()=>{
  assertEqual(1350000*(1-25/100), 1012500);
});
test('0% discount → listed price unchanged', ()=>{
  assertEqual(1350000*(1-0/100), 1350000);
});
test('100% discount → 0', ()=>{
  assertEqual(1350000*(1-100/100), 0);
});

suite('AfA depreciation rate from Restnutzungsdauer');

test('40yr → 2.50%', ()=>{ assertClose(1/40*100, 2.50, 0.01); });
test('50yr → 2.00%', ()=>{ assertClose(1/50*100, 2.00, 0.01); });
test('30yr → 3.33%', ()=>{ assertClose(1/30*100, 3.33, 0.01); });
test('80yr → 1.25%', ()=>{ assertClose(1/80*100, 1.25, 0.01); });

suite('NOI calculation');

test('NOI positive with default values', ()=>{
  var cold_ann=14.5*428*12;  // €74,424
  var vac=cold_ann*0.03;
  var mgmt=2.5*428*12;       // €12,840
  var buf=0;
  var noi=(cold_ann-vac)-mgmt-buf;
  assertGt(noi, 0);
});
test('vacancy reduces NOI', ()=>{
  var cold_ann=74424, mgmt=12840;
  var noi_low =(cold_ann*(1-0.03))-mgmt;
  var noi_high=(cold_ann*(1-0.15))-mgmt;
  assertGt(noi_low, noi_high);
});
test("NOI / price = net yield", ()=>{
  var price=1012500, cold_ann=14.5*428*12;
  var noi=(cold_ann*0.97)-2.5*428*12;
  var yield_pct=noi/price*100;
  assertGt(yield_pct, 3);
  assertLt(yield_pct, 10);
});

suite('Annuity formula');

test('annuity = loan × (zins + tilgung)', ()=>{
  var loan=1012500, zins=4, til=1.25;
  var ann=loan*(zins+til)/100;
  assertClose(ann, 53156, 1);
});
test('higher Zins → higher annuity', ()=>{
  var loan=1000000, til=1.25;
  assertGt(loan*(5+til)/100, loan*(4+til)/100);
});
