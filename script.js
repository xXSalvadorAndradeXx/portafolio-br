/**
 * PORTAFOLIO BRIAN RIVERA - JAVASCRIPT MEJORADO
 * Versión: 2.0
 * Mejoras: Menú hamburguesa, Scroll To Top, Observers, Accesibilidad
 */

document.addEventListener('DOMContentLoaded', () => {

    // ============ MENÚ HAMBURGUESA ============
    const header = document.querySelector('header');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a:not(.language)');
    const languageBtn = document.getElementById('btnIdioma');

    // Crear botón hamburguesa
    const hamburger = document.createElement('button');
    hamburger.className = 'hamburger';
    hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.innerHTML = '<span></span><span></span><span></span>';

    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';

    // Insertar en el DOM
    header.insertBefore(hamburger, nav);
    document.body.appendChild(overlay);

    // Función para cerrar menú
    const closeMenu = () => {
        nav.classList.remove('active');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    // Función para abrir menú
    const openMenu = () => {
        nav.classList.add('active');
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Toggle menú
    hamburger.addEventListener('click', () => {
        if (nav.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Cerrar con overlay
    overlay.addEventListener('click', closeMenu);

    // Cerrar al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (nav.classList.contains('active')) {
                closeMenu();
            }
        });
    });

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            closeMenu();
        }
    });

    // Ajustar en resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && nav.classList.contains('active')) {
            closeMenu();
        }
    });

    // ============ SOMBRA DEL HEADER AL SCROLL ============
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // ============ CONTROL DE SECCIONES (reemplaza scroll para navegación) ============
    // Mostrar solo la sección activa cuando se presiona un enlace del menú
    const allSections = document.querySelectorAll('section[id]');

    const showSection = (id) => {
        const target = document.getElementById(id);
        if (!target) return;

        allSections.forEach(sec => {
            if (sec === target) {
                sec.hidden = false;
                sec.classList.add('visible-section');
                sec.setAttribute('aria-hidden', 'false');
                sec.tabIndex = -1;
            } else {
                sec.hidden = true;
                sec.classList.remove('visible-section');
                sec.setAttribute('aria-hidden', 'true');
            }
        });

        // Actualizar estado del menú
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${id}`) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            } else {
                link.classList.remove('active');
                link.removeAttribute('aria-current');
            }
        });

        // Llevar la vista a la sección mostrada (mantener el contenido existente)
        try {
            const headerHeight = header ? header.offsetHeight : 0;
            const targetTop = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 8;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
            target.focus();
            history.replaceState(null, '', `#${id}`);
        } catch (err) {}
    };

    // Interceptar clicks en enlaces ancla del menú y mostrar secciones
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const id = href.replace('#', '');
            // Cerrar menú si está abierto
            if (nav.classList.contains('active')) closeMenu();
            showSection(id);
        });
    });

    // Inicializar sección visible según hash o inicio
    const initialId = (location.hash && location.hash.length > 1) ? location.hash.replace('#','') : 'inicio';
    setTimeout(() => {
        // Marcar todas como ocultas primero
        allSections.forEach(s => { s.hidden = true; s.setAttribute('aria-hidden','true'); });
        showSection(initialId);
    }, 50);

    // Nota: se elimina el bloqueo global de scroll/teclas para permitir
    // que el usuario pueda desplazarse dentro de la sección actualmente visible.
    // Las demás secciones permanecen ocultas y solo se muestran usando el menú.

    // ============ NAVBAR ACTIVO CON INTERSECTION OBSERVER ============
    const sections = document.querySelectorAll('section[id]');
    
    if (sections.length > 0) {
        const observerOptions = {
            threshold: 0.2,
            rootMargin: '-100px 0px -40% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                            link.setAttribute('aria-current', 'page');
                        } else {
                            link.removeAttribute('aria-current');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }

    // ============ BOTÓN VOLVER ARRIBA ============
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.setAttribute('aria-label', 'Volver al inicio');
    backToTopBtn.innerHTML = '↑';
    document.body.appendChild(backToTopBtn);

    const toggleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    };

    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ============ FORMULARIO DE CONTACTO ============
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const nombre = document.getElementById('nombre')?.value.trim();
            const email = document.getElementById('email')?.value.trim();
            const asunto = document.getElementById('asunto')?.value.trim();
            const mensaje = document.getElementById('mensaje')?.value.trim();
            const feedback = document.getElementById('contactFeedback');

            if (!nombre || !email || !asunto || !mensaje) {
                if (feedback) {
                    feedback.textContent = '⚠️ Por favor completa todos los campos.';
                    feedback.style.color = '#EA5D4C';
                    feedback.setAttribute('role', 'alert');
                }
                return;
            }

            // Validación básica de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                if (feedback) {
                    feedback.textContent = '⚠️ Por favor ingresa un email válido.';
                    feedback.style.color = '#EA5D4C';
                    feedback.setAttribute('role', 'alert');
                }
                return;
            }

            if (mensaje.length < 20) {
                if (feedback) {
                    feedback.textContent = '⚠️ El mensaje debe contener al menos 20 caracteres.';
                    feedback.style.color = '#EA5D4C';
                    feedback.setAttribute('role', 'alert');
                }
                return;
            }

            // Envío a Formspree
            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    if (feedback) {
                        feedback.textContent = '✅ ¡Gracias! Tu mensaje ha sido enviado.';
                        feedback.style.color = '#10b981';
                        feedback.setAttribute('role', 'status');
                    }
                    contactForm.reset();
                } else {
                    const data = await response.json().catch(() => ({}));
                    if (feedback) {
                        const msg = data?.errors ? (data.errors.map(err => err.message).join(', ')) : 'Error al enviar el mensaje. Por favor intenta nuevamente.';
                        feedback.textContent = '⚠️ ' + msg;
                        feedback.style.color = '#EA5D4C';
                        feedback.setAttribute('role', 'alert');
                    }
                }
            } catch (err) {
                if (feedback) {
                    feedback.textContent = '⚠️ Error de red. Intenta nuevamente más tarde.';
                    feedback.style.color = '#EA5D4C';
                    feedback.setAttribute('role', 'alert');
                }
            }
        });
    }

    // ============ SLIDER DE TESTIMONIOS MEJORADO ============
    setTimeout(() => {
        const track = document.querySelector('.grid-testimonios');
        const slides = track ? Array.from(track.querySelectorAll('.card-testimonio')) : [];
        if (!track || slides.length === 0) return;

        let slideIndex = 0;
        let startX = 0;
        let endX = 0;
        let autoAdvance;
        const container = track.parentElement;

        // Crear dots indicadores
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'testimonial-dots';
        dotsContainer.setAttribute('role', 'tablist');
        dotsContainer.setAttribute('aria-label', 'Navegación de testimonios');
        
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.className = 'testimonial-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Testimonio ${i + 1}`);
            dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
        
        const controlsDiv = container.querySelector('.testimonials-controls');
        if (controlsDiv) {
            controlsDiv.after(dotsContainer);
        }

        const dots = dotsContainer.querySelectorAll('.testimonial-dot');

        const updateSizes = () => {
            return parseInt(getComputedStyle(track).gap) || 30;
        };

        const goToSlide = (index) => {
            slideIndex = index;
            const gap = updateSizes();
            const containerWidth = container.getBoundingClientRect().width;
            const cardRect = slides[0].getBoundingClientRect();
            const cardWidth = cardRect.width + gap;
            
            const offset = (index * cardWidth) - (containerWidth - cardRect.width) / 2;
            track.style.transform = `translateX(-${Math.max(0, offset)}px)`;

            slides.forEach((s, i) => {
                s.classList.toggle('active', i === index);
                s.style.opacity = i === index ? '1' : '0.5';
                s.style.filter = i === index ? 'none' : 'blur(2px)';
                s.setAttribute('aria-hidden', i === index ? 'false' : 'true');
            });
            
            dots.forEach((d, i) => {
                d.classList.toggle('active', i === index);
                d.setAttribute('aria-selected', i === index ? 'true' : 'false');
            });
        };

        // Inicializar
        updateSizes();
        goToSlide(0);
        
        slides.forEach((s, i) => {
            s.style.transition = 'all 0.5s ease';
            s.style.opacity = i === 0 ? '1' : '0.5';
            s.style.filter = i === 0 ? 'none' : 'blur(2px)';
            s.setAttribute('aria-roledescription', 'testimonio');
            s.setAttribute('aria-hidden', i === 0 ? 'false' : 'true');
        });

        const prevBtn = document.querySelector('.btn-slide.prev');
        const nextBtn = document.querySelector('.btn-slide.next');

        const prev = () => {
            slideIndex = (slideIndex - 1 + slides.length) % slides.length;
            goToSlide(slideIndex);
            resetAutoAdvance();
        };
        
        const next = () => {
            slideIndex = (slideIndex + 1) % slides.length;
            goToSlide(slideIndex);
            resetAutoAdvance();
        };

        if (prevBtn) prevBtn.addEventListener('click', prev);
        if (nextBtn) nextBtn.addEventListener('click', next);

        // Touch events
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) next();
                else prev();
            }
        });

        // Keyboard support
        container.setAttribute('tabindex', '0');
        container.setAttribute('role', 'region');
        container.setAttribute('aria-label', 'Carrusel de testimonios');
        container.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
            if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
        });

        // Auto-advance
        const startAutoAdvance = () => {
            autoAdvance = setInterval(next, 5000);
        };
        
        const resetAutoAdvance = () => {
            clearInterval(autoAdvance);
            startAutoAdvance();
        };
        
        startAutoAdvance();
        
        container.addEventListener('mouseenter', () => clearInterval(autoAdvance));
        container.addEventListener('mouseleave', startAutoAdvance);
        container.addEventListener('focusin', () => clearInterval(autoAdvance));
        container.addEventListener('focusout', startAutoAdvance);

        window.addEventListener('resize', () => {
            updateSizes();
            goToSlide(slideIndex);
        });

    }, 300);

    // ============ MODAL DE RECONOCIMIENTOS ============
    const modal = document.getElementById('recModal');
    const modalImg = document.getElementById('recModalImg');
    const modalCaption = document.getElementById('recModalCaption');
    const closeBtn = modal ? modal.querySelector('.rec-modal-close') : null;

    if (modal) {
        const openModal = (src, alt) => {
            modalImg.src = src;
            modalImg.alt = alt || 'Reconocimiento';
            modalCaption.textContent = alt || '';
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            closeBtn?.focus();
        };

        const closeModal = () => {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            // Limpiar src después de la transición
            setTimeout(() => {
                if (modal.getAttribute('aria-hidden') === 'true') {
                    modalImg.src = '';
                    modalCaption.textContent = '';
                }
            }, 300);
        };

        document.querySelectorAll('.rec-thumb-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const src = link.getAttribute('data-src') || link.href;
                const alt = link.querySelector('img')?.alt || '';
                openModal(src, alt);
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('rec-modal-backdrop')) {
                closeModal();
            }
        });
        
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
                closeModal();
            }
        });
    }

    // ============ ANIMACIÓN DE SKILLS AL HACER SCROLL ============
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('animate');
                const fill = el.querySelector('.fill');
                const level = el.dataset.level;
                if (fill && level) {
                    fill.style.width = level + '%';
                }
                skillObserver.unobserve(el);
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.skill').forEach(skill => {
        skillObserver.observe(skill);
    });

    // ============ ANIMACIÓN DE SECCIONES AL ENTRAR ============
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });

    // ============ GUARDAR SECCIÓN (para proyectos) ============
    window.guardarSeccion = function(seccion) {
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('ultimaSeccion', seccion);
        }
    };

});