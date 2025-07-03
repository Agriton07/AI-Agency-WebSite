// SCRIPT.JS - YOUNGMIND REIMAGINED & OPTIMIZED with GSAP

document.addEventListener('DOMContentLoaded', () => {
    
    // --- GSAP & SCROLLTRIGGER REGISTRATION ---
    gsap.registerPlugin(ScrollTrigger);

    // --- UTILITY FUNCTIONS ---
    const getDelay = (el) => parseFloat(el.style.getPropertyValue('--delay')) || 0;
    const getTransitionEasing = () => getComputedStyle(document.documentElement).getPropertyValue('--transition-easing').trim() || 'power1.out';

    // --- CORE ANIMATIONS ---
    const initAnimations = () => {
        // Initial page load animation for body (prevents flash of content before JS loads)
        gsap.from('body', { opacity: 0, duration: 0.8, ease: getTransitionEasing() });

        // General fade-in elements (e.g., headers, intros)
        gsap.utils.toArray('.gsap-fade').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                duration: 1,
                delay: getDelay(el),
                ease: getTransitionEasing(),
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                    // markers: true, // For debugging animations
                }
            });
        });

        // Slide-up elements (e.g., paragraphs, lists, general content blocks)
        gsap.utils.toArray('.gsap-slide-up').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                y: 50, // Slide up from 50px below
                duration: 1,
                delay: getDelay(el),
                ease: getTransitionEasing(),
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%', // Trigger earlier for smoother entrance
                    toggleActions: 'play none none reverse',
                    // markers: true,
                }
            });
        });

        // Staggered card animation (for service cards, testimonials, team members)
        const cards = gsap.utils.toArray('.gsap-card');
        if (cards.length > 0) {
            gsap.from(cards, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: getTransitionEasing(),
                stagger: 0.15, // Stagger effect for cards
                scrollTrigger: {
                    trigger: '.service-cards-grid, .testimonials-grid, .team-grid', // Adjust trigger based on where cards are
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                    // markers: true,
                }
            });
        }

        // Horizontal slide animations (if any specific sections need this, e.g., image/text blocks)
        gsap.utils.toArray('.gsap-slide-left').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                x: -100, // Slide from left
                duration: 1,
                delay: getDelay(el),
                ease: getTransitionEasing(),
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            });
        });

        gsap.utils.toArray('.gsap-slide-right').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                x: 100, // Slide from right
                duration: 1,
                delay: getDelay(el),
                ease: getTransitionEasing(),
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            });
        });
    };

    // --- HEADER LOGIC ---
    const initHeader = () => {
        const header = document.querySelector('.main-header');
        if (!header) return;

        let lastScrollY = window.scrollY;

        const checkHeaderScroll = () => {
            if (window.scrollY > 50) { // Add scrolled class after 50px scroll
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Optional: Hide header on scroll down, show on scroll up
            // if (window.scrollY > lastScrollY && window.scrollY > header.offsetHeight) {
            //     gsap.to(header, { y: -header.offsetHeight, duration: 0.3, ease: 'power2.in' });
            // } else if (window.scrollY < lastScrollY) {
            //     gsap.to(header, { y: 0, duration: 0.3, ease: 'power2.out' });
            // }
            // lastScrollY = window.scrollY;
        };

        window.addEventListener('scroll', checkHeaderScroll);
        checkHeaderScroll(); // Initial check on load

        // Highlight active navigation link
        const navLinks = document.querySelectorAll('.main-nav a');
        const currentPath = window.location.pathname.split('/').pop();

        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    };

    // --- FOOTER LOGIC ---
    const initFooter = () => {
        const currentYearSpan = document.getElementById('current-year');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        }
    };

    // --- MOBILE NAVIGATION ---
    const initMobileNav = () => {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileNavOverlay = document.createElement('div');
        mobileNavOverlay.id = 'mobile-nav'; // Assign ID for aria-controls
        mobileNavOverlay.className = 'mobile-nav-overlay';
        mobileNavOverlay.setAttribute('role', 'dialog');
        mobileNavOverlay.setAttribute('aria-modal', 'true');
        mobileNavOverlay.setAttribute('aria-labelledby', 'mobile-nav-heading');

        const mobileNavContent = document.querySelector('.main-nav').cloneNode(true);
        mobileNavContent.classList.remove('main-nav'); // Remove desktop nav class
        mobileNavContent.setAttribute('aria-label', 'Navegación principal móvil');
        
        // Add a heading for accessibility
        const heading = document.createElement('h2');
        heading.id = 'mobile-nav-heading';
        heading.textContent = 'Menú de Navegación';
        heading.style.position = 'absolute'; // Visually hidden, but accessible
        heading.style.width = '1px';
        heading.style.height = '1px';
        heading.style.margin = '-1px';
        heading.style.padding = '0';
        heading.style.overflow = 'hidden';
        heading.style.clip = 'rect(0, 0, 0, 0)';
        heading.style.border = '0';

        mobileNavOverlay.appendChild(heading);
        mobileNavOverlay.appendChild(mobileNavContent);
        document.body.appendChild(mobileNavOverlay);

        const toggleMobileMenu = () => {
            const isActive = menuToggle.classList.toggle('active');
            mobileNavOverlay.classList.toggle('active', isActive);
            menuToggle.setAttribute('aria-expanded', isActive);
            mobileNavOverlay.setAttribute('aria-hidden', !isActive);

            // Toggle body scroll lock
            if (isActive) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }

            // Close menu when a link is clicked
            mobileNavContent.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    if (isActive) { // Only if menu is currently open
                        toggleMobileMenu();
                    }
                }, { once: true }); // Ensure it only runs once per click
            });
        };

        if (menuToggle) {
            menuToggle.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile nav if window is resized above mobile breakpoint (e.g., 768px)
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (window.innerWidth > 768 && menuToggle.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }, 250); // Debounce resize event
        });
    };

    // --- CONTACT FORM ---
    const initContactForm = () => {
        const form = document.getElementById('main-contact-form');
        const formStatus = document.querySelector('.form-status');
        if (!form || !formStatus) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            formStatus.textContent = 'Enviando mensaje...';
            formStatus.className = 'form-status'; // Reset classes

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Basic client-side validation for demonstration
            if (!data.name || !data.email || !data.subject || !data.message || !data['privacy-policy']) {
                formStatus.textContent = 'Por favor, rellena todos los campos obligatorios.';
                formStatus.classList.add('error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                formStatus.textContent = 'Por favor, introduce un correo electrónico válido.';
                formStatus.classList.add('error');
                return;
            }

            try {
                // SIMULACIÓN DE ENVÍO DE FORMULARIO
                // En una aplicación real, aquí usarías fetch() para enviar a tu backend:
                // const response = await fetch('/api/contact', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify(data),
                // });

                // if (!response.ok) {
                //     throw new Error(`HTTP error! status: ${response.status}`);
                // }

                // const result = await response.json(); // If your backend returns a JSON response

                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

                // Simulate success or failure
                const success = Math.random() > 0.1; // 90% success rate for demo

                if (success) {
                    formStatus.textContent = '¡Mensaje recibido! Gracias por tu interés. Te contactaremos pronto.';
                    formStatus.classList.add('success');
                    form.reset(); // Clear form fields on success
                } else {
                    throw new Error('Hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo más tarde.');
                }

            } catch (error) {
                console.error('Error submitting form:', error);
                formStatus.textContent = error.message || 'Error al enviar el mensaje. Inténtalo de nuevo.';
                formStatus.classList.add('error');
            }
        });
    };

    // --- FAQ ACCORDION ---
    const initAccordion = () => {
        const accordionItems = document.querySelectorAll('.accordion-item');
        if (accordionItems.length === 0) return;

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');

            // Initialize ARIA attributes
            header.setAttribute('aria-expanded', 'false');
            content.setAttribute('aria-hidden', 'true');
            content.style.maxHeight = '0'; // Ensure content is initially closed

            header.addEventListener('click', () => {
                const isExpanded = header.getAttribute('aria-expanded') === 'true';

                // Close all other open accordions
                accordionItems.forEach(otherItem => {
                    const otherHeader = otherItem.querySelector('.accordion-header');
                    const otherContent = otherItem.querySelector('.accordion-content');
                    if (otherHeader !== header && otherHeader.getAttribute('aria-expanded') === 'true') {
                        otherHeader.setAttribute('aria-expanded', 'false');
                        otherContent.setAttribute('aria-hidden', 'true');
                        gsap.to(otherContent, { maxHeight: 0, paddingBottom: 0, duration: 0.3, ease: 'power1.out' });
                    }
                });

                // Toggle current accordion
                if (isExpanded) {
                    header.setAttribute('aria-expanded', 'false');
                    content.setAttribute('aria-hidden', 'true');
                    gsap.to(content, { maxHeight: 0, paddingBottom: 0, duration: 0.3, ease: 'power1.out' });
                } else {
                    header.setAttribute('aria-expanded', 'true');
                    content.setAttribute('aria-hidden', 'false');
                    // Calculate height dynamically for smooth open (important for varying content)
                    gsap.to(content, { 
                        maxHeight: content.scrollHeight + 'px', 
                        paddingBottom: getComputedStyle(content.querySelector('p')).marginBottom, // Ensure padding matches CSS
                        duration: 0.4, 
                        ease: 'power1.inOut' 
                    });
                }
            });
        });
    };

    // --- INITIALIZE ALL MODULES ---
    try {
        initAnimations();
        initHeader();
        initFooter();
        initMobileNav();
        initContactForm();
        initAccordion(); // Initialize new accordion functionality
    } catch (error) {
        console.error('Error initializing a module:', error);
    }
});