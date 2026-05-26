(function () {
  'use strict';

  const COMMENTS_KEY = 'mr-cocktail-comments';
  const isMobile = () => window.matchMedia('(max-width: 768px)').matches;

  const loader = document.getElementById('loader');
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTop = document.getElementById('backToTop');
  const heroParallax = document.querySelector('[data-parallax]');
  const revealElements = document.querySelectorAll('.reveal');
  const faqItems = document.querySelectorAll('.faq__item');
  const galleryItems = document.querySelectorAll('.gallery__item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  const commentForm = document.getElementById('commentForm');
  const commentsList = document.getElementById('commentsList');
  const commentsEmpty = document.getElementById('commentsEmpty');
  const commentSuccess = document.getElementById('commentSuccess');
  const commentStars = document.getElementById('commentStars');
  const commentRating = document.getElementById('commentRating');

  let lightboxIndex = 0;
  let scrollLockCount = 0;

  function setPageScrollLocked(locked) {
    scrollLockCount += locked ? 1 : -1;
    if (scrollLockCount < 0) scrollLockCount = 0;
    document.body.classList.toggle('is-scroll-locked', scrollLockCount > 0);
    document.body.style.overflow = scrollLockCount > 0 ? 'hidden' : '';
  }

  const DEFAULT_COMMENTS = [
    {
      id: 'seed-1',
      name: 'Nadine K.',
      event: 'Mariage VIP',
      rating: 5,
      text: 'Équipe ponctuelle, présentation très élégante et cocktails parfaitement équilibrés. Nos invités ont été impressionnés.',
      date: '2025-11-12T10:00:00.000Z'
    },
    {
      id: 'seed-2',
      name: 'Jonathan L.',
      event: 'Soirée entreprise',
      rating: 5,
      text: 'Très bonne coordination avant l\'événement, service fluide sur place et cocktails de fruits premium qui valorisent vraiment notre image.',
      date: '2026-01-08T14:30:00.000Z'
    },
    {
      id: 'seed-3',
      name: 'Grace M.',
      event: 'Anniversaire',
      rating: 5,
      text: 'Cocktails magnifiques et service rapide toute la soirée. Nos invités ont adoré le Sunset Royal.',
      date: '2025-09-20T18:00:00.000Z'
    },
    {
      id: 'seed-4',
      name: 'Patrick T.',
      event: 'Cocktail événementiel',
      rating: 5,
      text: 'Installation propre, équipe sérieuse et communication WhatsApp très réactive du devis au jour J.',
      date: '2026-02-14T09:15:00.000Z'
    }
  ];

  function initSEO() {
    const cfg = window.MR_COCKTAIL_SITE;
    if (!cfg || !cfg.url) return;

    const base = cfg.url.endsWith('/') ? cfg.url : `${cfg.url}/`;
    const canonical = document.getElementById('canonicalUrl');
    const ogUrl = document.getElementById('ogUrl');
    const ogImage = document.getElementById('ogImage');

    if (canonical) canonical.setAttribute('href', base);
    if (ogUrl) ogUrl.setAttribute('content', base);
    if (ogImage) {
      const img = ogImage.getAttribute('content') || '';
      if (img && !/^https?:\/\//i.test(img)) {
        ogImage.setAttribute('content', base + img.replace(/^\//, ''));
      }
    }

    const existing = document.getElementById('jsonLdLocalBusiness');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'jsonLdLocalBusiness';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: cfg.name || 'MR Cocktail',
      url: base,
      telephone: cfg.phone,
      email: cfg.email,
      image: `${base}images/hero/hero-main.jpg`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: cfg.city || 'Lubumbashi',
        addressCountry: cfg.country || 'CD'
      },
      sameAs: cfg.instagram ? [cfg.instagram] : [],
      description:
        'Service premium de cocktails de fruits événementiels à Lubumbashi — mariages, anniversaires, entreprises et VIP.'
    });
    document.head.appendChild(script);
  }

  function initLoader() {
    const showHero = () => {
      const hero = document.querySelector('.hero__content--animate');
      if (hero) hero.classList.add('is-ready');
    };

    const hide = () => {
      if (loader) loader.classList.add('hidden');
      document.body.classList.remove('loading');
      showHero();
    };

    if (isMobile() || sessionStorage.getItem('mr-cocktail-visited')) {
      hide();
      return;
    }

    sessionStorage.setItem('mr-cocktail-visited', '1');
    document.body.classList.add('loading');
    if (loader) loader.classList.add('fast');

    const delay = 500;
    const runHide = () => setTimeout(hide, delay);

    if (document.readyState === 'complete') runHide();
    else window.addEventListener('load', runHide);
  }

  let lastActiveSection = '';
  let scrollTicking = false;

  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    backToTop.classList.toggle('visible', window.scrollY > 500);
    updateActiveNavLink();
    scrollTicking = false;
  }

  function initNavbar() {
    const navBackdrop = document.getElementById('navBackdrop');

    window.addEventListener('scroll', () => {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(onScroll);
      }
    }, { passive: true });
    onScroll();

    const setMenuOpen = (isOpen) => {
      const wasOpen = navMenu.classList.contains('open');
      if (wasOpen === isOpen) return;

      navMenu.classList.toggle('open', isOpen);
      navToggle.classList.toggle('active', isOpen);
      navbar.classList.toggle('menu-open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);

      if (navBackdrop) {
        navBackdrop.classList.toggle('is-visible', isOpen);
        navBackdrop.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      }

      setPageScrollLocked(isOpen);
      document.body.classList.toggle('menu-open', isOpen);
      if (isOpen) navbar.classList.add('scrolled');
    };

    navToggle.addEventListener('click', () => {
      setMenuOpen(!navMenu.classList.contains('open'));
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', () => setMenuOpen(false));
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        setMenuOpen(false);
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        setMenuOpen(false);
      }
    });
  }

  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id], .hero[id]');
    const scrollPos = window.scrollY + 120;
    let activeId = lastActiveSection;

    sections.forEach((section) => {
      const id = section.getAttribute('id');
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPos >= top && scrollPos < top + height) {
        activeId = id;
      }
    });

    if (!activeId) return;
    if (activeId === lastActiveSection) return;
    lastActiveSection = activeId;

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${activeId}`);
    });
  }

  function initParallax() {
    if (!heroParallax) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (prefersReduced || isMobile) return;

    const factor = parseFloat(heroParallax.dataset.parallax || 0.25);
    let parallaxTicking = false;

    const applyParallax = () => {
      const rate = Math.min(window.scrollY * factor, window.innerHeight * 0.35);
      heroParallax.style.transform = `translate3d(0, ${rate}px, 0)`;
      parallaxTicking = false;
    };

    window.addEventListener('scroll', () => {
      if (!parallaxTicking) {
        parallaxTicking = true;
        requestAnimationFrame(applyParallax);
      }
    }, { passive: true });

    applyParallax();
  }

  function initScrollReveal() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced || isMobile()) {
      revealElements.forEach((el) => el.classList.add('visible', 'revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add('visible');
          observer.unobserve(el);
          el.addEventListener(
            'transitionend',
            () => el.classList.add('revealed'),
            { once: true }
          );
          setTimeout(() => el.classList.add('revealed'), 900);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  function initLightbox() {
    if (!galleryItems.length) return;

    galleryItems.forEach((item, index) => {
      item.addEventListener('click', () => openLightbox(index));
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
    lightboxNext.addEventListener('click', () => navigateLightbox(1));

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    });
  }

  function openLightbox(index) {
    lightboxIndex = index;
    updateLightboxImage();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    setPageScrollLocked(true);
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    setPageScrollLocked(false);
  }

  function navigateLightbox(dir) {
    lightboxIndex = (lightboxIndex + dir + galleryItems.length) % galleryItems.length;
    updateLightboxImage();
  }

  function updateLightboxImage() {
    const item = galleryItems[lightboxIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery__label span');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
  }

  function getComments() {
    try {
      const stored = localStorage.getItem(COMMENTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (e) {
      return [...DEFAULT_COMMENTS];
    }
    return [...DEFAULT_COMMENTS];
  }

  function saveComments(comments) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function starsHtml(rating) {
    const n = Math.min(5, Math.max(1, Number(rating) || 5));
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function renderComments() {
    if (!commentsList) return;

    const comments = getComments().sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    commentsList.innerHTML = '';

    if (!comments.length) {
      if (commentsEmpty) commentsEmpty.hidden = false;
      return;
    }

    if (commentsEmpty) commentsEmpty.hidden = true;

    comments.forEach((c) => {
      const li = document.createElement('li');
      li.className = 'comment-card';
      li.innerHTML = `
        <div class="comment-card__meta">
          <span class="comment-card__name">${escapeHtml(c.name)}</span>
          ${c.event ? `<span class="comment-card__event">${escapeHtml(c.event)}</span>` : ''}
          <time class="comment-card__date" datetime="${c.date}">${formatDate(c.date)}</time>
        </div>
        <div class="comment-card__body">
          <span class="comment-card__stars" aria-label="${c.rating} sur 5">${starsHtml(c.rating)}</span>
          <p class="comment-card__text">${escapeHtml(c.text)}</p>
        </div>
      `;
      commentsList.appendChild(li);
    });

    if (isMobile() && commentsList.parentElement) {
      requestAnimationFrame(() => clampHorizontalRow(commentsList.parentElement));
    }
  }

  const H_SCROLL_ITEM =
    '.service-card, .trust__item, .team-card, .steps__item, .gallery__item, .comments__form, .comments__list-wrap, .comment-card';

  function clampHorizontalRow(row, pad = 16) {
    if (!row) return;
    const items = [...row.querySelectorAll(H_SCROLL_ITEM)].filter((el) => el.offsetWidth > 0);
    if (!items.length) return;

    const last = items[items.length - 1];
    const limit = Math.max(0, last.offsetLeft + last.offsetWidth - row.clientWidth + pad);

    if (row.scrollLeft > limit) {
      row.scrollLeft = limit;
    }
  }

  /** Limite le scroll horizontal : la dernière carte reste visible, pas de zone vide. */
  function initHorizontalScrollClamp() {
    if (!isMobile()) return;

    const rowSelectors = [
      '.scroll-row--services',
      '.scroll-row--trust',
      '.scroll-row--team',
      '.scroll-row--steps',
      '.gallery-zone .scroll-row',
      '.comments__grid'
    ];

    rowSelectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((row) => {
        row.addEventListener('scroll', () => clampHorizontalRow(row), { passive: true });
        window.addEventListener('resize', () => clampHorizontalRow(row));
        requestAnimationFrame(() => clampHorizontalRow(row));
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function initCommentStars() {
    if (!commentStars) return;

    commentStars.querySelectorAll('.comment-star').forEach((btn) => {
      btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        commentRating.value = value;
        commentStars.querySelectorAll('.comment-star').forEach((star) => {
          star.classList.toggle('active', Number(star.dataset.value) <= Number(value));
        });
      });
    });
  }

  function initComments() {
    if (!commentForm) return;

    if (!localStorage.getItem(COMMENTS_KEY)) {
      saveComments(DEFAULT_COMMENTS);
    }

    renderComments();
    initCommentStars();

    commentForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('commentName').value.trim();
      const event = document.getElementById('commentEvent').value.trim();
      const text = document.getElementById('commentText').value.trim();
      const rating = commentRating.value;
      const consent = document.getElementById('commentConsent');

      if (!name || !text) return;
      if (consent && !consent.checked) return;

      const comments = getComments();
      comments.unshift({
        id: `c-${Date.now()}`,
        name,
        event,
        rating: Number(rating),
        text,
        date: new Date().toISOString()
      });

      saveComments(comments);
      renderComments();
      commentForm.reset();
      commentRating.value = '5';
      commentStars.querySelectorAll('.comment-star').forEach((star) => {
        star.classList.toggle('active', Number(star.dataset.value) <= 5);
      });

      if (commentSuccess) {
        commentSuccess.hidden = false;
        setTimeout(() => {
          commentSuccess.hidden = true;
        }, 4000);
      }
    });
  }

  function initFAQ() {
    faqItems.forEach((item) => {
      const question = item.querySelector('.faq__question');
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        faqItems.forEach((other) => {
          other.classList.remove('open');
          other.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  function initBackToTop() {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight - 8;
          window.scrollTo({
            top: Math.max(0, top),
            behavior: isMobile() ? 'auto' : 'smooth'
          });
        }
      });
    });
  }

  function init() {
    initSEO();
    initLoader();
    initNavbar();
    initParallax();
    initScrollReveal();
    initLightbox();
    initComments();
    initFAQ();
    initBackToTop();
    initSmoothScroll();
    initHorizontalScrollClamp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
