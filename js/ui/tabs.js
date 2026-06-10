// TAB SWITCHING
// ===================================================
let activeTab='overview',lastR=null,lastP=null;
function switchTab(t){
  ['overview','charts','metrics','eval'].forEach(k=>{
    document.getElementById('page-'+k).className='page'+(k===t?' active':'');
    document.getElementById('tab-'+k).className='tab'+(k===t?' active':'');
  });
  activeTab=t;if(lastR&&lastP)renderActive(lastR,lastP);
}
function renderActive(r,p){
  if(activeTab==='overview')renderOverview(r,p);
  else if(activeTab==='charts'){renderCharts(r,p);setTimeout(initChartDrag,0);}
  else if(activeTab==='metrics')renderMetrics(r,p);
}

// ===================================================