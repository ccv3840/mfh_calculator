// ─── Mobile UI helpers ────────────────────────────────────────────
// Sidebar toggle for phones
function toggleMobileSidebar() {
  var sidebar = document.querySelector('.sidebar');
  var btn     = document.getElementById('mobile-menu-btn');
  var open    = sidebar.classList.toggle('mobile-open');
  if (btn) btn.textContent = open ? '✕ Close' : '☰ Inputs';
}

// Auto-close sidebar when a tab is switched on mobile
(function patchSwitchTab() {
  var _original = window.switchTab;
  if (typeof _original === 'function') {
    window.switchTab = function(t) {
      _original(t);
      if (window.innerWidth <= 767) {
        var sidebar = document.querySelector('.sidebar');
        var btn     = document.getElementById('mobile-menu-btn');
        if (sidebar) sidebar.classList.remove('mobile-open');
        if (btn)     btn.textContent = '☰ Inputs';
      }
    };
  }
})();

// Detect mobile and add body class for JS-driven responsive tweaks
(function detectMobile() {
  function check() {
    var isMobile = window.innerWidth <= 767;
    document.body.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('is-tablet', window.innerWidth > 767 && window.innerWidth <= 1023);
  }
  check();
  window.addEventListener('resize', check);
})();
