// ─── Core simulation engine tests ─────────────────────────────────

suite('calcMFH — mortgage mechanics');

test('mortgage balance decreases each year', ()=>{
  var p={mr:4,til:2,rend:6,oc:22,rg:2.5,pa:3,yrs:10,pl_en:false};
  var r=calcMFH(1000000,p,false);
  assertGt(r.rows[0].bal, r.rows[9].bal);
});
test('equity grows over time', ()=>{
  var p={mr:4,til:2,rend:6,oc:22,rg:2.5,pa:3,yrs:10,pl_en:false};
  var r=calcMFH(1000000,p,false);
  assertGt(r.rows[9].eq, r.rows[0].eq);
});
test('DSCR is positive', ()=>{
  var p={mr:4,til:2,rend:6,oc:22,rg:2.5,pa:3,yrs:5,pl_en:false};
  var r=calcMFH(1000000,p,false);
  assertGt(r.rows[0].dscr, 0);
});
test('higher Rendite → higher DSCR', ()=>{
  var base={mr:4,til:2,oc:22,rg:2.5,pa:3,yrs:5,pl_en:false};
  var lo=calcMFH(1000000,Object.assign({},base,{rend:4}),false);
  var hi=calcMFH(1000000,Object.assign({},base,{rend:8}),false);
  assertGt(hi.rows[0].dscr, lo.rows[0].dscr);
});
test('higher Zins → lower DSCR', ()=>{
  var base={til:2,rend:6,oc:22,rg:2.5,pa:3,yrs:5,pl_en:false};
  var lo=calcMFH(1000000,Object.assign({},base,{mr:2}),false);
  var hi=calcMFH(1000000,Object.assign({},base,{mr:6}),false);
  assertGt(lo.rows[0].dscr, hi.rows[0].dscr);
});

suite('calcAcqLoanFlex — loan repayment modes');

test('mode 1 (interest-only) — principal unchanged at exit', ()=>{
  var r=calcAcqLoanFlex(100000,5,50000,10,1,5);
  assertEqual(r.bal_exit, 100000);
});
test('mode 0 (salary schedule) — reduces principal', ()=>{
  var r=calcAcqLoanFlex(100000,5,50000,10,0,5);
  assertLt(r.bal_exit, 100000);
});
test('zero loan → zero total interest', ()=>{
  var r=calcAcqLoanFlex(0,5,50000,10,0,5);
  assertEqual(r.ti, 0);
});
test('higher rate → more interest paid', ()=>{
  var lo=calcAcqLoanFlex(100000,2,50000,10,0,5);
  var hi=calcAcqLoanFlex(100000,6,50000,10,0,5);
  assertGt(hi.ti, lo.ti);
});

suite('calcIRR — internal rate of return');

test('10% single-period return → IRR=0.10', ()=>{
  assertClose(calcIRR([-100,110]), 0.10, 0.001);
});
test('breakeven cashflows → IRR=0', ()=>{
  assertClose(calcIRR([-100,100]), 0.0, 0.001);
});
test('loss → negative IRR', ()=>{
  assertLt(calcIRR([-100,90]), 0);
});

suite('calcNPV — net present value');

test('NPV at 0% = sum of cashflows', ()=>{
  assertClose(calcNPV([-100,50,50,50],0), 50, 0.01);
});
test('NPV at IRR ≈ 0', ()=>{
  var cfs=[-100,60,60];
  var irr=calcIRR(cfs)*100;
  assertClose(calcNPV(cfs,irr), 0, 1);
});
test('higher discount rate → lower NPV', ()=>{
  var cfs=[-100,40,40,40];
  assertGt(calcNPV(cfs,5), calcNPV(cfs,10));
});
