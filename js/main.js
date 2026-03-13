/* ============================================
   ESCAPE ROOM - OPERATOR SITE - MAIN JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── SCROLL PROGRESS BAR ──
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    }, { passive: true });
  }

  // ── MOBILE NAV TOGGLE ──
  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', siteNav.classList.contains('open'));
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.site-header')) {
        siteNav.classList.remove('open');
      }
    });
  }

  // ── QA ACCORDION ──
  document.querySelectorAll('.qa-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.qa-item');
      const answer = item.querySelector('.qa-answer');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.qa-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.qa-answer').style.maxHeight = '0';
      });

      // Open this if was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ── PAGE TABS ──
  document.querySelectorAll('.page-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      const container = tab.closest('.tabs-wrapper') || document;

      // Deactivate all
      container.querySelectorAll('.page-tab').forEach(t => t.classList.remove('active'));
      container.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      // Activate clicked
      tab.classList.add('active');
      const panel = container.querySelector(`[data-panel="${target}"]`);
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.animate-stagger > *').forEach((el, i) => {
          el.style.animationDelay = `${i * 0.05}s`;
        });
      }
    });
  });

  // ── CHECKLIST (persistent via localStorage) ──
  document.querySelectorAll('.check-item').forEach(item => {
    const key = 'check_' + item.dataset.key;
    // Restore state
    if (localStorage.getItem(key) === 'true') {
      item.classList.add('checked');
      const box = item.querySelector('.check-box');
      if (box) box.textContent = '✓';
    }
    // Toggle
    item.addEventListener('click', () => {
      item.classList.toggle('checked');
      const isChecked = item.classList.contains('checked');
      const box = item.querySelector('.check-box');
      if (box) box.textContent = isChecked ? '✓' : '';
      localStorage.setItem(key, isChecked);
    });
  });

  // ── QA SEARCH ──
  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim().toLowerCase();
      document.querySelectorAll('.qa-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        const visible = !query || text.includes(query);
        item.style.display = visible ? '' : 'none';
      });
      // Show/hide category headers
      document.querySelectorAll('.qa-category').forEach(cat => {
        const visibleItems = [...cat.querySelectorAll('.qa-item')]
          .filter(i => i.style.display !== 'none');
        cat.style.display = visibleItems.length > 0 ? '' : 'none';
      });
    });
  }

  // ── FILTER TABS (Q&A) ──
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      document.querySelectorAll('.qa-category').forEach(cat => {
        if (filter === 'all') {
          cat.style.display = '';
        } else {
          cat.style.display = cat.dataset.category === filter ? '' : 'none';
        }
      });
    });
  });

  // ── RESET CHECKLIST BUTTON ──
  const resetBtn = document.querySelector('.checklist-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      document.querySelectorAll('.check-item').forEach(item => {
        item.classList.remove('checked');
        const box = item.querySelector('.check-box');
        if (box) box.textContent = '';
        localStorage.removeItem('check_' + item.dataset.key);
      });
    });
  }

  // ── ACTIVE NAV LINK ──
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ── INTERSECTION OBSERVER for animate-in ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-in').forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

});
