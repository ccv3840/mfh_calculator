// ─── Node.js test runner ───────────────────────────────────────────
// Usage: node tests/run.js

// Load framework
var {suite,test,assert,assertEqual,assertClose,assertGt,assertLt,summary} = require("./assert.js");

// Expose test helpers globally so test files dont need require()
global.suite=suite; global.test=test; global.assert=assert;
global.assertEqual=assertEqual; global.assertClose=assertClose;
global.assertGt=assertGt; global.assertLt=assertLt;

// ── Stub DOM-dependent globals (not needed for pure calc tests) ───
global.document = { getElementById: ()=>null, querySelectorAll: ()=>[] };

// ── Load source files ─────────────────────────────────────────────
require("../js/formatters.js");
require("../js/calc/core.js");

// ── Run test suites ───────────────────────────────────────────────
require("./formatters.test.js");
require("./calc.core.test.js");
require("./calc.eval.test.js");

summary();
