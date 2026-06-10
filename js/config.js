// OPTION METADATA
// ===================================================
const OPT={
  A:{k:'A',n:'1',c:'#34d399',bg:'rgba(52,211,153,.12)',br:'rgba(52,211,153,.35)',
    sn:'Option 1 (A)',name:'Swiss Lombard + Small MFH',
    fn:'Option 1 — Swiss Lombard + '+fmtE(2000000)+' MFH',
    desc:'Borrow at low rate (1%) against CHF ETF portfolio at Swiss private bank. Flexible repayment. Use proceeds as MFH closing costs.'},
  B:{k:'B',n:'2',c:'#fbbf24',bg:'rgba(251,191,36,.12)',br:'rgba(251,191,36,.35)',
    sn:'Option 2 (B)',name:'Grundschuld + Small MFH',
    fn:'Option 2 — German Grundschuld + '+fmtE(2000000)+' MFH',
    desc:'Refinance existing property (Grundschuld) at 4.5%. Flexible repayment mode. Use proceeds as closing costs for new MFH.'},
  C:{k:'C',n:'3',c:'#a78bfa',bg:'rgba(167,139,250,.12)',br:'rgba(167,139,250,.35)',
    sn:'Option 3 (C)',name:'All-in — Large MFH',
    fn:'Option 3 — All-in '+fmtE(4000000)+' MFH',
    desc:'Deploy all capital as MFH closing costs. No acquisition loan. Full salary compounds in S&P500 from year 1.'},
  D:{k:'D',n:'4',c:'#60a5fa',bg:'rgba(96,165,250,.12)',br:'rgba(96,165,250,.35)',
    sn:'Option 4 (D)',name:'Pure S&P500 Benchmark',
    fn:'Option 4 — Pure S&P500 Index',
    desc:'Lump-sum + full salary DCA into S&P500 at assumed return. Zero debt. Zero operations. Benchmark.'},
};
const KEYS=['A','B','C','D'];

// Repayment modes (per option key)
let lm_mode=0, gm_mode=0, dm_mode=0; // 0=salary, 1=interest-only, 2=custom

// ===================================================