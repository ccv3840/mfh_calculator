// FORMATTERS
// ===================================================
function fmtE(v){const n=+v;if(n>=1e6)return'€'+(n/1e6).toFixed(2).replace(/\.?0+$/,'')+'M';if(n>=1e3)return'€'+Math.round(n/1e3)+'k';return'€'+Math.round(n);}
function fEf(v){return'€'+new Intl.NumberFormat('de-DE').format(Math.round(+v));}
function fP(v){return(+v).toFixed(1)+'%';}
function fPn(v){return(v>=0?'+':'')+v.toFixed(1)+'%';}
function fG(v){return(v>=0?'+':'-')+'€'+new Intl.NumberFormat('de-DE').format(Math.round(Math.abs(v)));}

// ===================================================