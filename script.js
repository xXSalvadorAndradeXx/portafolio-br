
const links = document.querySelectorAll('nav a');

// Añadimos un evento de clic a cada enlace
links.forEach(link => {
    link.addEventListener('click', function() {
        // Eliminamos la clase "active" de todos los enlaces
        links.forEach(link => link.classList.remove('active'));

        // Añadimos la clase "active" solo al enlace seleccionado
        this.classList.add('active');
    });
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        const feedback = document.getElementById('contactFeedback');

        if (!nombre || !email || !mensaje) {
            feedback.textContent = 'Por favor completa todos los campos.';
            return;
        }

        // Construir mailto como fallback para envío
        const subject = encodeURIComponent('Contacto desde portafolio: ' + nombre);
        const body = encodeURIComponent('Nombre: ' + nombre + '\nEmail: ' + email + '\n\n' + mensaje);
        const mailto = `mailto:Alesolano980@gmail.com?subject=${subject}&body=${body}`;

        // Intentar abrir cliente de correo
        window.location.href = mailto;

        feedback.textContent = 'Gracias, tu mensaje se ha preparado para enviar. Si tu cliente de correo no se abre, puedes escribir a Alesolano980@gmail.com';
        contactForm.reset();
    });
}

// Testimonial slider: auto-advance slower, pause on hover, center active slide
setTimeout(() => {
    const track = document.querySelector('.grid-testimonios');
    const slides = track ? Array.from(track.querySelectorAll('.card-testimonio')) : [];
    if (!track || slides.length === 0) return;

    let slideIndex = 0;
    let gap = parseInt(getComputedStyle(track).gap) || 22;
    const container = track.parentElement;

    const updateSizes = () => {
        gap = parseInt(getComputedStyle(track).gap) || 22;
    };

    const goToSlide = (index) => {
        const containerWidth = container.getBoundingClientRect().width;
        const cardRect = slides[0].getBoundingClientRect();
        const cardWidth = cardRect.width + gap;

        // compute offset so that the slide is centered in the container
        const offset = (index * cardWidth) - (containerWidth - cardRect.width) / 2;
        track.style.transform = `translateX(-${Math.max(0, offset)}px)`;

        // update active class
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
    };

    updateSizes();
    goToSlide(slideIndex);

    // Manual controls: Prev / Next buttons
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

    // keyboard support when container focused
    container.tabIndex = 0;
    container.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    window.addEventListener('resize', () => {
        updateSizes();
        goToSlide(slideIndex);
    });

}, 300);

// Modal para reconocimientos
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
    };

    const closeModal = () => {
        modal.setAttribute('aria-hidden', 'true');
        modalImg.src = '';
        modalCaption.textContent = '';
    };

    // abrir al hacer clic en miniaturas
    document.querySelectorAll('.rec-thumb-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const src = link.getAttribute('data-src') || link.href;
            const alt = link.querySelector('img')?.alt || '';
            openModal(src, alt);
        });
    });

    // cerrar al clicar fondo, botón o ESC
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('rec-modal-backdrop')) closeModal();
    });
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();
