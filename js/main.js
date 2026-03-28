/* ============================================
   main.js – Theme, Scroll Reveal, Nav, KPI Counter
   ============================================ */

(function () {
  'use strict';

  /* ---------- Theme Toggle ---------- */
  const html = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');

  function getPreferredTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  setTheme(getPreferredTheme());

  themeBtn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(next);
  });

  /* ---------- Mobile Menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.querySelector('.nav__links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  /* ---------- Scroll Reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ---------- Nav Active Section ---------- */
  const sections = document.querySelectorAll('.section, .hero');
  const navLinksAll = document.querySelectorAll('.nav__link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinksAll.forEach(link => {
          link.classList.toggle('active', link.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: `-${parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) + 10}px 0px -40% 0px` });

  sections.forEach(section => sectionObserver.observe(section));

  /* ---------- KPI Count-Up ---------- */
  const kpiNumbers = document.querySelectorAll('.kpi-card__number');

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const kpiObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        kpiObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  kpiNumbers.forEach(el => kpiObserver.observe(el));

  /* ---------- Toggle Projects ---------- */
  const toggleBtn = document.getElementById('toggle-projects');
  const extraProject = document.getElementById('extra-project');
  let expanded = false;

  toggleBtn.addEventListener('click', () => {
    expanded = !expanded;
    extraProject.style.display = expanded ? 'block' : 'none';
    toggleBtn.textContent = expanded ? '접기' : '더 보기';

    if (expanded) {
      extraProject.classList.add('reveal', 'show');
      extraProject.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });

  /* ---------- Project Modal ---------- */
  const modalOverlay = document.getElementById('project-modal');
  const modalContent = document.getElementById('modal-content');
  const modalClose = modalOverlay ? modalOverlay.querySelector('.modal__close') : null;

  function openModal(projectId) {
    const tpl = document.getElementById('tpl-' + projectId);
    if (!tpl || !modalOverlay) return;
    modalContent.innerHTML = '';
    modalContent.appendChild(tpl.content.cloneNode(true));
    modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');
    history.replaceState(null, '', '#' + projectId);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    history.replaceState(null, '', window.location.pathname);
  }

  // Card click → open modal
  document.querySelectorAll('.project-card[data-project]').forEach(function (card) {
    card.addEventListener('click', function () {
      openModal(card.dataset.project);
    });
  });

  // Close handlers
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function (e) {
      if (e.target === modalOverlay) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (lightbox && lightbox.classList.contains('active')) {
        closeLightbox();
      } else {
        closeModal();
      }
    }
  });

  /* ---------- Image Lightbox ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightbox-img');

  function openLightbox(src) {
    if (!lightbox) return;
    lightboxImg.src = src;
    lightbox.classList.add('active');
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
  }

  if (lightbox) {
    lightbox.addEventListener('click', closeLightbox);
  }

  // Delegate click on arch images inside modal
  if (modalContent) {
    modalContent.addEventListener('click', function (e) {
      if (e.target.classList.contains('modal__arch-img')) {
        e.stopPropagation();
        openLightbox(e.target.src);
      }
    });
  }

  // Open from URL hash on load
  if (window.location.hash) {
    var id = window.location.hash.slice(1);
    if (document.getElementById('tpl-' + id)) {
      setTimeout(function () { openModal(id); }, 500);
    }
  }

})();
