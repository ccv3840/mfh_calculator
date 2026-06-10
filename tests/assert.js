// ─── Minimal test framework (Node.js + browser) ────────────────────
var _pass=0, _fail=0;

function suite(name){ console.log('\n── '+name+' ──'); }

function test(name, fn){
  try{ fn(); _pass++;
    console.log('  ✓ '+name);
  } catch(e){ _fail++;
    console.error('  ✗ '+name+'\n    '+e.message);
  }
}

function assert(cond,msg){ if(!cond) throw new Error(msg||'Expected truthy'); }
function assertEqual(a,b,msg){
  if(a!==b) throw new Error(msg||('Expected '+JSON.stringify(b)+' got '+JSON.stringify(a)));
}
function assertClose(a,b,tol,msg){
  tol=tol||0.01;
  if(Math.abs(a-b)>tol) throw new Error(msg||('Expected ~'+b+' got '+a+' (tol '+tol+')'));
}
function assertGt(a,b,msg){ if(a<=b) throw new Error(msg||('Expected '+a+' > '+b)); }
function assertLt(a,b,msg){ if(a>=b) throw new Error(msg||('Expected '+a+' < '+b)); }

function summary(){
  var status = _fail===0 ? '✓ ALL PASSED' : '✗ FAILURES';
  console.log('\n'+status+': '+_pass+' passed, '+_fail+' failed');
  if(typeof process!=='undefined') process.exit(_fail>0?1:0);
}

if(typeof module!=='undefined'){
  module.exports={suite,test,assert,assertEqual,assertClose,assertGt,assertLt,summary};
}
