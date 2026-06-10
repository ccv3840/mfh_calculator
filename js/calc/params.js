// PARAMS
// ===================================================
function P(){
  const g=id=>+document.getElementById(id).value;
  const cb=id=>document.getElementById(id).checked;
  return{
    ic:g('ic'),sal:g('sal'),yrs:g('yrs'),
    sp:g('sp'),etf:g('etf'),pa:g('pa'),
    rend:g('rend'),rg:g('rg'),oc:g('oc'),
    mab:g('mab'),mc_:g('mc'),
    mr:g('mr'),til:g('til'),
    lr:g('lr'),ltv:g('ltv'),lm:lm_mode,lmy:g('lmy'),
    gr:g('gr'),cy:g('cy'),gm:gm_mode,gmy:g('gmy'),
    dr:g('dr'),inf:g('inf'),rf:g('rf'),
    pl_en:cb('pl_en'),pla:g('pla'),plr:g('plr'),
    pl_fcf:cb('pl_fcf_en'),plf:g('plf'),
    m2y:g('m2y'),m2p:g('m2p'),m2e:g('m2e'),
    d_lomb_en:cb('d_lomb_en'),d_ltv:g('d_ltv'),dm:dm_mode,d_lmy:g('d_lmy'),
  };
}

// ===================================================