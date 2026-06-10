// ─── Formatter function tests ──────────────────────────────────────

suite('fmtE — currency formatting');

test('millions — round', ()=>{
  assertEqual(fmtE(2000000), '€2M');
});
test('millions — decimal', ()=>{
  assertEqual(fmtE(1500000), '€1.5M');
  assertEqual(fmtE(2200000), '€2.2M');
});
test('thousands', ()=>{
  assertEqual(fmtE(500000), '€500k');
  assertEqual(fmtE(1000),   '€1k');
});
test('small values', ()=>{
  assertEqual(fmtE(0),   '€0');
  assertEqual(fmtE(500), '€500');
});

suite('fP — percent formatting');

test('integer percent', ()=>{
  assertEqual(fP(5),  '5.0%');
  assertEqual(fP(0),  '0.0%');
});
test('decimal percent', ()=>{
  assertEqual(fP(3.14), '3.1%');
  assertEqual(fP(2.55), '2.6%');
});

suite('fPn — signed percent');

test('positive gets + prefix', ()=>{
  assert(fPn(5).startsWith('+'), 'positive should have +');
});
test('negative gets - prefix', ()=>{
  assert(fPn(-3).startsWith('-'), 'negative should have -');
});

suite('fG — signed EUR gain/loss');

test('positive gain', ()=>{
  assert(fG(100000).startsWith('+'), 'gain should start with +');
});
test('negative loss', ()=>{
  assert(fG(-50000).startsWith('-'), 'loss should start with -');
});
