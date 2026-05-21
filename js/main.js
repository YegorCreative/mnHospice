/* =====================================================
   Minnesota Hospice Care — Main JavaScript
   ===================================================== */

(function () {
  'use strict';

  /* =====================================================
     STICKY HEADER — adds .scrolled class on scroll
     ===================================================== */
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function handleScroll() {
    const current = window.scrollY;
    if (current > 48) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = current;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  /* =====================================================
     MOBILE HAMBURGER MENU
     ===================================================== */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.querySelector('.main-nav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', function () {
      const isOpen = mainNav.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';

      // Animate hamburger bars
      const bars = hamburger.querySelectorAll('span');
      if (isOpen) {
        bars[0].style.transform = 'translateY(7px) rotate(45deg)';
        bars[1].style.opacity = '0';
        bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
      } else {
        bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
      }
    });

    // Close menu when a nav link is clicked
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function () {
        mainNav.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        const bars = hamburger.querySelectorAll('span');
        bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
      });
    });
  }

  /* =====================================================
     SMOOTH ANCHOR SCROLLING with offset for fixed header
     ===================================================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* =====================================================
     DONATION AMOUNT SELECTOR
     ===================================================== */
  const amountSelector = document.getElementById('amountSelector');
  const customAmountWrap = document.getElementById('customAmountWrap');

  if (amountSelector) {
    amountSelector.addEventListener('click', function (e) {
      const btn = e.target.closest('.amount-btn');
      if (!btn) return;

      // Clear all active states
      amountSelector.querySelectorAll('.amount-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      if (btn.dataset.amount === 'custom') {
        customAmountWrap.hidden = false;
        const input = customAmountWrap.querySelector('input');
        if (input) input.focus();
      } else {
        customAmountWrap.hidden = true;
      }
    });
  }

  /* =====================================================
     FREQUENCY TOGGLE
     ===================================================== */
  const freqBtns = document.querySelectorAll('.freq-btn');

  freqBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      freqBtns.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  /* =====================================================
     FORM VALIDATION — Donate Form
     ===================================================== */
  const donateForm = document.getElementById('donateForm');

  if (donateForm) {
    donateForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(this)) return;

      // Simulate submission (replace with real payment processor)
      showFormSuccess(
        this,
        'Thank you for your generous gift! A confirmation will be sent to your email shortly.'
      );
    });
  }

  /* =====================================================
     FORM VALIDATION — Contact Form
     ===================================================== */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm(this)) return;

      showFormSuccess(
        this,
        'Thank you! We\'ve received your message and will be in touch within one business day.'
      );
    });
  }

  /**
   * Validates required fields in a form.
   * @param {HTMLFormElement} form
   * @returns {boolean}
   */
  function validateForm(form) {
    let valid = true;
    const required = form.querySelectorAll('[required]');

    required.forEach(field => {
      field.classList.remove('error');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value.trim())) {
        field.classList.add('error');
        valid = false;
      }
    });

    if (!valid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.focus();
    }

    return valid;
  }

  /**
   * Replaces a form with a success message.
   * @param {HTMLFormElement} form
   * @param {string} message
   */
  function showFormSuccess(form, message) {
    const successEl = document.createElement('div');
    successEl.className = 'form-success';
    successEl.setAttribute('role', 'alert');
    successEl.textContent = message;
    form.replaceWith(successEl);
  }

  /**
   * Validates an email address format.
   * @param {string} email
   * @returns {boolean}
   */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* Clear error state on input
  ===================================================== */
  document.addEventListener('input', function (e) {
    if (e.target.classList.contains('error')) {
      e.target.classList.remove('error');
    }
  });

  /* =====================================================
     SCROLL REVEAL — IntersectionObserver
     ===================================================== */
  const revealEls = document.querySelectorAll(
    '.service-card, .story-card, .about-copy, .about-visual, .give-copy, .contact-info, .trust-item'
  );

  revealEls.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger children within grid parents
            const siblings = Array.from(
              entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')
            );
            const idx = siblings.indexOf(entry.target);
            const delay = Math.min(idx * 80, 320);
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Fallback for older browsers — show all
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* =====================================================
     FOOTER YEAR
     ===================================================== */
  const yearEl = document.getElementById('footerYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =====================================================
     QUOTE ROTATOR — Minnesota care philosophy
     ===================================================== */
  const QUOTES = [
    'Like Minnesota\u2019s 10,000 lakes \u2014 calm, clear, and always there for you.',
    'We believe every season of life deserves dignity and quiet grace.',
    'Rooted in the north. Devoted to the people who call it home.',
    'In the hardest winters, Minnesotans look out for each other. We always have.',
    'Where the birches grow and the waters run deep \u2014 so does our care.',
  ];

  const quoteTextEl = document.getElementById('quoteText');
  const quoteDotsEl = document.getElementById('quoteDots');
  let quoteIndex = 0;
  let quoteTimer = null;

  function buildQuoteDots() {
    if (!quoteDotsEl) return;
    quoteDotsEl.innerHTML = '';
    QUOTES.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Quote ' + (i + 1));
      dot.addEventListener('click', () => goToQuote(i));
      quoteDotsEl.appendChild(dot);
    });
  }

  function updateDots(idx) {
    if (!quoteDotsEl) return;
    quoteDotsEl.querySelectorAll('.quote-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx);
    });
  }

  function goToQuote(idx) {
    if (!quoteTextEl) return;
    quoteTextEl.classList.add('fading');
    setTimeout(() => {
      quoteIndex = idx;
      quoteTextEl.textContent = QUOTES[quoteIndex];
      quoteTextEl.classList.remove('fading');
      updateDots(quoteIndex);
    }, 600);
  }

  function advanceQuote() {
    goToQuote((quoteIndex + 1) % QUOTES.length);
  }

  function startQuoteTimer() {
    quoteTimer = setInterval(advanceQuote, 5000);
  }

  if (quoteTextEl) {
    buildQuoteDots();
    quoteTextEl.textContent = QUOTES[0];
    startQuoteTimer();

    // Pause rotation on hover
    const strip = document.querySelector('.quote-strip');
    if (strip) {
      strip.addEventListener('mouseenter', () => clearInterval(quoteTimer));
      strip.addEventListener('mouseleave', startQuoteTimer);
    }
  }

  /* =====================================================
     SUBTLE PARALLAX on Hero layers
     ===================================================== */
  const heroStars  = document.querySelector('.hero-stars');
  const heroAurora = document.querySelector('.hero-aurora');
  const heroPinesF = document.querySelector('.hero-pines-far');
  const heroContent = document.querySelector('.hero-content');

  if (heroStars && 'IntersectionObserver' in window) {
    function applyParallax() {
      const scrollY = window.scrollY;
      const heroEl  = document.querySelector('.hero');
      if (!heroEl) return;
      const heroH = heroEl.offsetHeight;
      if (scrollY > heroH) return;

      const p = scrollY / heroH; // 0 to 1

      if (heroStars)   heroStars.style.transform   = 'translateY(' + (scrollY * 0.25).toFixed(1) + 'px)';
      if (heroAurora)  heroAurora.style.transform  = 'translateY(' + (scrollY * 0.15).toFixed(1) + 'px)';
      if (heroPinesF)  heroPinesF.style.transform  = 'translateY(' + (scrollY * 0.08).toFixed(1) + 'px)';
      if (heroContent) heroContent.style.transform = 'translateY(' + (scrollY * 0.30).toFixed(1) + 'px)';
    }

    window.addEventListener('scroll', applyParallax, { passive: true });
  }

})();
