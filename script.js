// SCRIPT.JS - YOUNGMIND REIMAGINED & OPTIMIZED with GSAP

document.addEventListener('DOMContentLoaded', () => {
    
    // --- GSAP & SCROLLTRIGGER REGISTRATION ---
    gsap.registerPlugin(ScrollTrigger);

    // --- UTILITY FUNCTIONS ---
    const getDelay = (el) => parseFloat(el.style.getPropertyValue('--delay')) || 0;

    // --- CORE ANIMATIONS ---
    const initAnimations = () => {
        // Initial page load animation
        gsap.from('body', { opacity: 0, duration: 0.8, ease: 'power1.inOut' });

        // General fade-in elements
        gsap.utils.toArray('.gsap-fade').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                duration: 1,
                delay: getDelay(el),
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                }
            });
        });

        // Slide-up elements
        gsap.utils.toArray('.gsap-slide-up').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                y: 50,
                duration: 1,
                delay: getDelay(el),
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    toggleActions: 'play none none reverse',
                }
            });
        });

        // Staggered card animation
        const cards = gsap.utils.toArray('.gsap-card');
        if (cards.length > 0) {
            gsap.from(cards, {
                opacity: 0,
                y: 50,
                duration: 0.8,
                ease: 'power3.out',
                stagger: 0.15,
                scrollTrigger: {
                    trigger: '.service-cards-grid',
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                }
            });
        }
        
        // Horizontal slide animations
        gsap.utils.toArray('.gsap-slide-left').forEach(el => {
            gsap.from(el, {
                opacity: 0,
                x: -100,
                duration: 1.2,
                ease: 'power3.out',
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
                x: 100,
                duration: 1.2,
                ease: 'power3.out',
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
        ScrollTrigger.create({
            start: 'top top',
            end: 99999,
            onUpdate: self => {
                if (self.scroll() > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
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
        const mainNav = document.querySelector('.main-nav');
        if (!menuToggle || !mainNav) return;

        menuToggle.addEventListener('click', () => {
            const isActive = mainNav.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            menuToggle.querySelector('.fa-bars').style.opacity = isActive ? '0' : '1';
            menuToggle.querySelector('.fa-times').style.opacity = isActive ? '1' : '0';
            document.body.style.overflow = isActive ? 'hidden' : '';
        });

        // Add close icon to toggle button
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fas fa-times';
        closeIcon.setAttribute('aria-hidden', 'true');
        closeIcon.style.opacity = '0';
        closeIcon.style.position = 'absolute';
        menuToggle.appendChild(closeIcon);
    };

    // --- CONTACT FORM ---
    const initContactForm = () => {
        const form = document.getElementById('main-contact-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // This is a simulation.
            // In a real-world application, you would use the Fetch API 
            // to send the form data to a serverless function or backend endpoint.
            alert('¡Formulario recibido! (Simulación). Gracias por tu mensaje.');
            form.reset();
        });
    };

    // --- INITIALIZE ALL MODULES ---
    try {
        initAnimations();
        initHeader();
        initFooter();
        initMobileNav();
        initContactForm();
    } catch (error) {
        console.error("Initialization failed:", error);
    }
});