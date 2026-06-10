// ── Draggable chart blocks ──────────────────────────────────────────
const DEFAULT_CHART_ORDER=['cb-wealth','cb-equity','cb-cashflow','cb-costs','cb-dscr','cb-ltv-a','cb-ltv-d','cb-dca','cb-cumcf','cb-stack'];
let _dragSrc=null;

function initChartDrag(){
  const container=document.getElementById('charts-sortable');
  if(!container)return;
  container.querySelectorAll('.chart-block').forEach(block=>{
    block.addEventListener('dragstart',e=>{
      _dragSrc=block;
      e.dataTransfer.effectAllowed='move';
      e.dataTransfer.setData('text/plain',block.id);
      setTimeout(()=>block.classList.add('cb-drag-active'),0);
    });
    block.addEventListener('dragend',()=>{
      block.classList.remove('cb-drag-active');
      container.querySelectorAll('.chart-block').forEach(b=>{
        b.classList.remove('cb-over-top','cb-over-bottom');
      });
      _dragSrc=null;
    });
    block.addEventListener('dragover',e=>{
      e.preventDefault();
      e.dataTransfer.dropEffect='move';
      if(_dragSrc&&block!==_dragSrc){
        container.querySelectorAll('.chart-block').forEach(b=>{
          b.classList.remove('cb-over-top','cb-over-bottom');
        });
        const rect=block.getBoundingClientRect();
        if(e.clientY<rect.top+rect.height/2) block.classList.add('cb-over-top');
        else block.classList.add('cb-over-bottom');
      }
    });
    block.addEventListener('dragleave',e=>{
      if(!block.contains(e.relatedTarget)){
        block.classList.remove('cb-over-top','cb-over-bottom');
      }
    });
    block.addEventListener('drop',e=>{
      e.preventDefault();
      block.classList.remove('cb-over-top','cb-over-bottom');
      if(!_dragSrc||_dragSrc===block)return;
      const rect=block.getBoundingClientRect();
      if(e.clientY<rect.top+rect.height/2){
        container.insertBefore(_dragSrc,block);
      } else {
        container.insertBefore(_dragSrc,block.nextSibling);
      }
    });
  });
}

function resetChartOrder(){
  const container=document.getElementById('charts-sortable');
  if(!container)return;
  DEFAULT_CHART_ORDER.forEach(id=>{
    const el=document.getElementById(id);
    if(el)container.appendChild(el);
  });
}