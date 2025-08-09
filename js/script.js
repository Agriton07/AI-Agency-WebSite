/* ===========================================================
   SCRIPT - IberixAI / YoungMind
   - GSAP animations
   - Mobile nav overlay (accessible)
   - Chatbot toggle (accessible, focus trap)
   - FAQ accordion
   - Contact form lightweight handler + feedback
   - Misc helpers (year, lazy images, ESC handling)
   =========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------
     Safe helper & feature-detect
     --------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // --- GSAP registration ---
  if (window.gsap && window.gsap.registerPlugin) {
    gsap.registerPlugin(ScrollTrigger);
    const easing = 'power2.out';

    const getDelay = el => {
      if (!el) return 0;
      const d = el.style.getPropertyValue('--delay');
      return d ? parseFloat(d) : (el.dataset && el.dataset.delay ? parseFloat(el.dataset.delay) : 0);
    };

    const animate = (selector, vars = {}) => {
      gsap.utils.toArray(selector).forEach((el) => {
        const delay = getDelay(el);
        gsap.fromTo(el, { ...(vars.from || {}) }, {
          ...(vars.to || vars),
          delay,
          ease: vars.ease || easing,
          duration: vars.duration || 0.8,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
            // markers: true
          }
        });
      });
    };

    // basic reveal patterns (apply only if elements exist)
    if ($$('.gsap-fade').length) animate('.gsap-fade', { from: { opacity: 0 }, to: { opacity: 1 } });
    if ($$('.gsap-slide-up').length) animate('.gsap-slide-up', { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 } });
    if ($$('.gsap-card').length) animate('.gsap-card', { from: { opacity: 0, y: 40 }, to: { opacity: 1, y: 0 }, stagger: 0.12 });
  }

  /* ---------------------------
     Header scroll effect
     --------------------------- */
  const header = document.querySelector('.main-header') || document.querySelector('header');
  const onScrollHeader = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 48);
  };
  window.addEventListener('scroll', onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------------------
     Mobile nav overlay (accessible)
     --------------------------- */
  const menuToggle = $('.menu-toggle');
  const mainNav = document.querySelector('.main-nav');

  let mobileOverlay = null;
  let lastActiveElement = null;

  if (menuToggle && mainNav) {
    // create overlay (only once)
    mobileOverlay = document.createElement('div');
    mobileOverlay.className = 'mobile-nav-overlay';
    mobileOverlay.setAttribute('role', 'dialog');
    mobileOverlay.setAttribute('aria-modal', 'true');
    mobileOverlay.setAttribute('aria-hidden', 'true');

    // clone nav content
    const cloneNav = mainNav.cloneNode(true);
    cloneNav.classList.add('mobile-nav-clone');
    // add a close button at top
    const closeBtn = document.createElement('button');
    closeBtn.className = 'mobile-nav-close btn-ghost';
    closeBtn.setAttribute('aria-label', 'Cerrar menú');
    closeBtn.textContent = 'Cerrar ✕';
    closeBtn.style.marginBottom = '18px';
    closeBtn.style.color = 'var(--text-100)';
    const navWrap = document.createElement('nav');
    navWrap.appendChild(closeBtn);
    navWrap.appendChild(cloneNav);
    mobileOverlay.appendChild(navWrap);
    document.body.appendChild(mobileOverlay);

    // helpers focus trap
    const focusableSelector = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])';
    const focusTrap = (container, active) => {
      const focusable = Array.from(container.querySelectorAll(focusableSelector));
      if (!focusable.length) return;
      if (active) {
        focusable[0].focus();
        const keyHandler = (e) => {
          if (e.key !== 'Tab') return;
          const idx = focusable.indexOf(document.activeElement);
          if (e.shiftKey && idx === 0) { e.preventDefault(); focusable[focusable.length - 1].focus(); }
          else if (!e.shiftKey && idx === focusable.length - 1) { e.preventDefault(); focusable[0].focus(); }
        };
        container._trapKey = keyHandler;
        container.addEventListener('keydown', keyHandler);
      } else {
        if (container._trapKey) container.removeEventListener('keydown', container._trapKey);
        container._trapKey = null;
      }
    };

    const openOverlay = () => {
      lastActiveElement = document.activeElement;
      mobileOverlay.classList.add('active');
      mobileOverlay.setAttribute('aria-hidden', 'false');
      menuToggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      focusTrap(mobileOverlay, true);
    };
    const closeOverlay = () => {
      mobileOverlay.classList.remove('active');
      mobileOverlay.setAttribute('aria-hidden', 'true');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      focusTrap(mobileOverlay, false);
      if (lastActiveElement) lastActiveElement.focus();
    };

    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!mobileOverlay.classList.contains('active')) openOverlay();
      else closeOverlay();
    });

    closeBtn.addEventListener('click', closeOverlay);

    // close on link click
    mobileOverlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        closeOverlay();
      });
    });

    // escape to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileOverlay.classList.contains('active')) closeOverlay();
    });
  }

  /* ---------------------------
     Footer year
     --------------------------- */
  const yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------
     Chatbot: toggle, focus trap, send mock
     --------------------------- */
  const chatbotToggle = $('#chatbot-toggle');
  const chatbotWidget = $('#chatbot-widget');
  const chatbotClose = $('#chatbot-close');
  const chatbotInput = $('#chatbot-input');
  const chatbotSend = $('#chatbot-send') || $('#chatbot-form button[type="submit"]');

  let chatbotOpen = false;
  let chatbotLastFocus = null;

  const openChatbot = () => {
    if (!chatbotWidget) return;
    chatbotLastFocus = document.activeElement;
    chatbotWidget.classList.add('open');
    chatbotWidget.setAttribute('aria-hidden', 'false');
    chatbotToggle && chatbotToggle.setAttribute('aria-expanded', 'true');
    chatbotOpen = true;
    // trap focus
    const focusable = chatbotWidget.querySelectorAll('button, a, input, textarea');
    if (focusable && focusable[0]) focusable[0].focus();
    document.body.style.overflow = ''; // allow scrolling if needed
  };

  const closeChatbot = () => {
    if (!chatbotWidget) return;
    chatbotWidget.classList.remove('open');
    chatbotWidget.setAttribute('aria-hidden', 'true');
    chatbotToggle && chatbotToggle.setAttribute('aria-expanded', 'false');
    chatbotOpen = false;
    if (chatbotLastFocus) chatbotLastFocus.focus();
  };

  if (chatbotToggle && chatbotWidget) {
    chatbotToggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (!chatbotOpen) openChatbot(); else closeChatbot();
    });
    if (chatbotClose) chatbotClose.addEventListener('click', closeChatbot);

    // Close with ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatbotOpen) closeChatbot();
    });

    // simple mock send — replace with real integration
    const chatbotForm = $('#chatbot-form') || null;
    if (chatbotForm) {
      chatbotForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = chatbotForm.querySelector('#chatbot-input');
        const body = $('#chatbot-body');
        if (!input || !input.value.trim()) {
          input && input.focus();
          return;
        }
        const userMessage = document.createElement('div');
        userMessage.textContent = 'Tú: ' + input.value;
        userMessage.style.margin = '8px 0';
        userMessage.style.color = '#fff';
        body.appendChild(userMessage);

        // fake bot response after delay
        setTimeout(() => {
          const bot = document.createElement('div');
          bot.textContent = 'IberixAI: Gracias — nos pondremos en contacto contigo pronto.';
          bot.style.margin = '8px 0';
          bot.style.color = 'var(--text-200)';
          body.appendChild(bot);
          body.scrollTop = body.scrollHeight;
        }, 700);

        input.value = '';
        input.focus();
      });
    }
  }

  /* ---------------------------
     FAQ accordion (progressive + accessible)
     --------------------------- */
  const accordions = $$('.accordion-item');
  accordions.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const panel = item.querySelector('.accordion-content');
    if (!header || !panel) return;
    header.setAttribute('aria-expanded', 'false');
    const contentHeight = () => {
      // temporarily show to measure
      panel.style.height = 'auto';
      const h = panel.scrollHeight;
      panel.style.height = '0';
      return h;
    };
    header.addEventListener('click', () => {
      const open = header.getAttribute('aria-expanded') === 'true';
      if (open) {
        // close
        header.setAttribute('aria-expanded', 'false');
        gsap.to(panel, { height: 0, duration: 0.28, ease: 'power2.inOut' });
      } else {
        // open
        header.setAttribute('aria-expanded', 'true');
        gsap.to(panel, { height: contentHeight(), duration: 0.32, ease: 'power2.inOut' });
      }
    });
  });

  /* ---------------------------
     Contact form: basic validation & feedback
     --------------------------- */
  const contactForm = $('#main-contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const status = contactForm.querySelector('.form-status');
      const name = contactForm.querySelector('#name');
      const email = contactForm.querySelector('#email');
      const message = contactForm.querySelector('#message');
      const privacy = contactForm.querySelector('#privacy-policy');

      // basic validation
      if (!name.value.trim() || !email.value.trim() || !message.value.trim() || (privacy && !privacy.checked)) {
        status && (status.textContent = 'Por favor, completa todos los campos requeridos y acepta la política de privacidad.');
        return;
      }

      // fake submit (replace with fetch to backend)
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn && (submitBtn.disabled = true);
      status && (status.textContent = 'Enviando...');

      setTimeout(() => {
        status && (status.textContent = 'Mensaje enviado. Gracias — te contactaremos en 1-2 días hábiles.');
        contactForm.reset();
        submitBtn && (submitBtn.disabled = false);
      }, 900);
    });
  }

  /* ---------------------------
     Lazy-load images (progressive enhancement)
     --------------------------- */
  $$('img').forEach(img => {
    if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
  });

  /* ---------------------------
     Small accessibility / UX helpers
     --------------------------- */
  // If any anchor has only "#" prevent scroll
  $$('a[href="#"]').forEach(a => a.addEventListener('click', e => e.preventDefault()));

  // reduce motion preference
  const mediaReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaReduce && mediaReduce.matches && window.gsap) {
    // disable gsap scrollTriggers
    ScrollTrigger.getAll && ScrollTrigger.getAll().forEach(st => st.disable());
  }

  // debug helper - safe to remove
  // console.log('UI script loaded');
});

// ====== Menú móvil ======
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#mobile-nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      const expanded = nav.classList.contains("open");
      menuToggle.setAttribute("aria-expanded", expanded);
    });
  }
});
