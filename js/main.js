// ===== Dickens Blog - Main JS =====

// Theme toggle
(function() {
  const saved = localStorage.getItem('theme');
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  btn.textContent = isDark ? '☀️' : '🌙';
}

document.addEventListener('DOMContentLoaded', updateThemeIcon);

// Back to top
document.addEventListener('DOMContentLoaded', function() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });
  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// Active nav link
document.addEventListener('DOMContentLoaded', function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function(link) {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
});

// ===== Visitor counter (busuanzi) =====
// 免註冊、JSONP、無 cookie。計數器資料由第三方服務提供；
// 載入失敗時整塊移除，不會留下「–」這種半殘畫面。
(function() {
  function initCounter() {
    const footer = document.querySelector('.footer-bottom');
    if (!footer || document.getElementById('siteCounter')) return;

    var box = document.createElement('div');
    box.className = 'site-counter';
    box.id = 'siteCounter';
    box.style.display = 'none';
    box.innerHTML =
      '<span id="busuanzi_container_site_pv">本站總瀏覽 <b id="busuanzi_value_site_pv">–</b> 次</span>' +
      '<span id="busuanzi_container_site_uv">訪客 <b id="busuanzi_value_site_uv">–</b> 人</span>' +
      '<span id="busuanzi_container_page_pv">本頁瀏覽 <b id="busuanzi_value_page_pv">–</b> 次</span>';
    footer.appendChild(box);

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    document.head.appendChild(script);

    // 最多等 12 秒；拿到數字才顯示，拿不到就整塊收掉
    let waited = 0;
    const timer = setInterval(function() {
      waited += 500;
      const pv = document.getElementById('busuanzi_value_site_pv');
      if (pv && pv.textContent && pv.textContent !== '–') {
        box.style.display = 'flex';
        clearInterval(timer);
      } else if (waited >= 12000) {
        clearInterval(timer);
        if (box.parentNode) box.parentNode.removeChild(box);
      }
    }, 500);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCounter);
  } else {
    initCounter();
  }
})();

// ===== Waline comments (anonymous, nickname only) =====
// 只在文章頁（有 .post-detail-content）執行：在 post-nav 後面插入
// 留言容器，再從 CDN 載入 Waline 用戶端。留言資料存在 Vercel +
// Neon 後端，各篇文章用網址路徑區分。
(function() {
  function initWaline() {
    if (!document.querySelector('.post-detail-content')) return;
    var nav = document.querySelector('.post-nav');
    if (!nav || document.getElementById('waline')) return;

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/@waline/client@v3/dist/waline.css';
    document.head.appendChild(link);

    var box = document.createElement('div');
    box.id = 'waline';
    box.style.marginTop = '48px';
    nav.parentNode.insertBefore(box, nav.nextSibling);

    var script = document.createElement('script');
    script.type = 'module';
    script.textContent =
      "import { init } from 'https://unpkg.com/@waline/client@v3/dist/waline.js';\n" +
      "init({\n" +
      "  el: '#waline',\n" +
      "  serverURL: 'https://waline-psi-tawny.vercel.app',\n" +
      "  requiredMeta: ['nick'],\n" +
      "  login: 'enable',\n" +
      "  dark: 'html[data-theme=\"dark\"]'\n" +
      "});";
    document.body.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWaline);
  } else {
    initWaline();
  }
})();
