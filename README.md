# MFH Wealth Strategy Simulator

Interactive German Mehrfamilienhaus (MFH) real estate investment simulator comparing 4 wealth-building strategies over a configurable horizon.

**Live:** https://ccv3840.github.io/mfh_calculator/

---

## Project Structure

```
mfh_calculator/
├── index.html              # Entry point — HTML structure only
├── css/
│   └── main.css            # All styles
├── js/
│   ├── config.js           # Option metadata (OPT, KEYS), mode state
│   ├── formatters.js       # Pure formatting functions (fmtE, fP, fG …)
│   ├── calc/
│   │   ├── params.js       # P() — reads all sidebar inputs into param object
│   │   ├── core.js         # Simulation engine (calcMFH, calcAll, calcIRR …)
│   │   └── eval.js         # Quick Property Evaluation tab logic
│   ├── charts/
│   │   └── svg.js          # Pure SVG chart builders (svgLine, svgBars …)
│   ├── ui/
│   │   ├── inputs.js       # Editable value badges + mode toggle buttons
│   │   ├── controls.js     # Sidebar toggles, collapsible sections
│   │   ├── drag.js         # Draggable chart block ordering
│   │   └── tabs.js         # Tab switching + renderActive dispatcher
│   ├── render/
│   │   ├── overview.js     # Overview tab renderer
│   │   ├── charts.js       # Charts tab renderer
│   │   └── metrics.js      # Metrics tab renderer
│   └── main.js             # calc(), resetAll(), DEF defaults, init
└── tests/
    ├── assert.js           # Minimal test framework (Node + browser)
    ├── formatters.test.js  # Formatter function tests
    ├── calc.core.test.js   # Core simulation engine tests
    ├── calc.eval.test.js   # Property evaluation calculation tests
    ├── run.js              # Node.js test runner
    └── index.html          # Browser test runner
```

## Script load order

Config → Formatters → Calc → Charts → UI → Render → Main

## Running tests

**Node.js:**
```bash
node tests/run.js
```

**Browser:**
Open `tests/index.html` via a local server:
```bash
python3 -m http.server 8080
# → http://localhost:8080/tests/index.html
```

## 4 Strategies compared

| Option | Strategy |
|--------|----------|
| A 🟢 | Swiss Lombard loan (~1%) + Small MFH |
| B 🟡 | German Grundschuld (~4.5%) + Small MFH |
| C 🟣 | All-in Large MFH (no acquisition loan) |
| D 🔵 | Pure S&P500 benchmark |

## Key assumptions

- German Annuitätendarlehen mortgage math
- AfA: 2% × 70% of purchase price per year (or 1/Restnutzungsdauer)
- CGT on exit: 0% after 10yr Spekulationsfrist (personal holding)
- Marginal tax rate: 42%

**Not financial advice.**
