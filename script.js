// Smooth scroll mejorado para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar activo con observer
const navLinks = document.querySelectorAll('nav a:not(.language)');
const sections = document.querySelectorAll('section[id]');

const observerOptions = {
    threshold: 0.3,
    rootMargin: '-80px 0px 0px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => observer.observe(section));

// Navbar click handler mejorado
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        navLinks.forEach(link => link.classList.remove('active'));
        this.classList.add('active');
    });
});

// Contact form handling con feedback visual mejorado
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const mensaje = document.getElementById('mensaje')?.value.trim();
        const feedback = document.getElementById('contactFeedback');

        if (!nombre || !email || !mensaje) {
            if (feedback) {
                feedback.textContent = '⚠️ Por favor completa todos los campos.';
                feedback.style.color = '#EA5D4C';
            }
            return;
        }

        const subject = encodeURIComponent('Contacto desde portafolio: ' + nombre);
        const body = encodeURIComponent('Nombre: ' + nombre + '\nEmail: ' + email + '\n\n' + mensaje);
        const mailto = `mailto:Alesolano980@gmail.com?subject=${subject}&body=${body}`;

        window.location.href = mailto;

        if (feedback) {
            feedback.textContent = '✅ ¡Gracias! Tu mensaje está listo para enviar.';
            feedback.style.color = '#10b981';
        }
        contactForm.reset();
    });
}

// Testimonial slider mejorado con touch support
setTimeout(() => {
    const track = document.querySelector('.grid-testimonios');
    const slides = track ? Array.from(track.querySelectorAll('.card-testimonio')) : [];
    if (!track || slides.length === 0) return;

    let slideIndex = 0;
    let startX = 0;
    let endX = 0;
    const container = track.parentElement;

    const updateSizes = () => {
        return parseInt(getComputedStyle(track).gap) || 30;
    };

    const goToSlide = (index) => {
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
        });
    };

    updateSizes();
    goToSlide(slideIndex);
    
    // Set initial opacity
    slides.forEach((s, i) => {
        s.style.transition = 'all 0.5s ease';
        s.style.opacity = i === 0 ? '1' : '0.5';
        s.style.filter = i === 0 ? 'none' : 'blur(2px)';
    });

    const prevBtn = document.querySelector('.btn-slide.prev');
    const nextBtn = document.querySelector('.btn-slide.next');

    const prev = () => {
        slideIndex = (slideIndex - 1 + slides.length) % slides.length;
        goToSlide(slideIndex);
    };
    
    const next = () => {
        slideIndex = (slideIndex + 1) % slides.length;
        goToSlide(slideIndex);
    };

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);

    // Touch events para mobile
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    track.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                next();
            } else {
                prev();
            }
        }
    });

    // Keyboard support
    container.tabIndex = 0;
    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    // Auto-advance
    let autoAdvance = setInterval(next, 5000);
    
    container.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    container.addEventListener('mouseleave', () => {
        autoAdvance = setInterval(next, 5000);
    });

    window.addEventListener('resize', () => {
        updateSizes();
        goToSlide(slideIndex);
    });

}, 300);

// Modal para reconocimientos mejorado con animaciones
(() => {
    const modal = document.getElementById('recModal');
    const modalImg = document.getElementById('recModalImg');
    const modalCaption = document.getElementById('recModalCaption');
    const closeBtn = modal ? modal.querySelector('.rec-modal-close') : null;

    if (!modal) return;

    const openModal = (src, alt) => {
        modalImg.src = src;
        modalImg.alt = alt || 'Reconocimiento';
        modalCaption.textContent = alt || '';
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Animación de entrada
        modal.querySelector('.rec-modal-content').style.animation = 'modalIn 0.3s ease forwards';
    };

    const closeModal = () => {
        modal.setAttribute('aria-hidden', 'true');
        modalImg.src = '';
        modalCaption.textContent = '';
        document.body.style.overflow = '';
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
})();

// Animación de skills al hacer scroll
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelector('.fill').style.animation = 'loadBar 1.5s ease forwards';
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.skill').forEach(skill => {
    skillObserver.observe(skill);
});

// Función para guardar sección (usada en proyectos)
function guardarSeccion(seccion) {
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ultimaSeccion', seccion);
    }
}