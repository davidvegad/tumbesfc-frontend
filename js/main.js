// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN ---
	//const API_BASE_URL = 'https://mi-backend-render.onrender.com/api'; 
    const API_BASE_URL = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:8000/api' // URL de tu backend local
        : 'https://mi-backend-render.onrender.com/api'; // ¡IMPORTANTE! Reemplaza esto con la URL real de tu backend en Render
    const SILUETA_URL = 'identity/silueta.png'; // Ruta a una imagen por defecto

    // --- LÓGICA DEL MENÚ MÓVIL ---
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('header nav ul');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Cierra el menú al hacer clic en un enlace
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                }
            });
        });
    }

    // --- FUNCIONES AUXILIARES ---

    async function fetchData(endpoint, wrapper) {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}/`);
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error al cargar ${endpoint}:`, error);
            if (wrapper) {
                wrapper.innerHTML = `<p class="error-message">No se pudo cargar la información. Inténtalo más tarde.</p>`;
            }
            return null;
        }
    }

    function initSwiper(selector, customOptions = {}) {
        const defaultOptions = {
            slidesPerView: 1,
            spaceBetween: 30,
            breakpoints: {
                600: { slidesPerView: 1 },
                900: { slidesPerView: 2 },
                1200: { slidesPerView: 3 },
            },
        };
        // Combinamos las opciones por defecto con las personalizadas
        const finalOptions = { ...defaultOptions, ...customOptions };
        new Swiper(selector, finalOptions);
    }


    // --- FUNCIONES PARA RENDERIZAR CONTENIDO ---

    async function cargarHeroSlides() {
        const wrapper = document.getElementById('hero-wrapper');
        const slides = await fetchData('heroslides', wrapper);
        if (!slides) return;

        const slidesHtml = slides.map(slide => {
            const hasLink = slide.link && slide.link !== '#';
            const linkStart = hasLink ? `<a href="${slide.link}" target="_blank" class="hero-link">` : '';
            const linkEnd = hasLink ? `</a>` : '';

            return `
            <div class="swiper-slide">
                ${linkStart}
                <div class="hero-content-wrapper">
                    <img src="${slide.imagen}" alt="${slide.titulo}" class="hero-img">
                    <div class="hero-text-overlay">
                        ${slide.titulo ? `<h1>${slide.titulo}</h1>` : ''}
                        ${slide.subtitulo ? `<p>${slide.subtitulo}</p>` : ''} <!-- Muestra siempre el subtítulo si existe -->
                        ${(slide.boton_texto && hasLink) ? `<span class="hero-cta">${slide.boton_texto}</span>` : ''}
                    </div>
                </div>
                ${linkEnd}
            </div>
        `;
        }).join('');

        wrapper.innerHTML = slidesHtml;

        const swiperOptions = {
            slidesPerView: 1, // Forzar siempre 1 slide
            spaceBetween: 0, // Sin espacio entre slides para el hero
            autoplay: { delay: 4000, disableOnInteraction: false },
            speed: 800,
            navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' },
            pagination: { el: '.hero-pagination', clickable: true },
            breakpoints: { // Anular los breakpoints por defecto para que siempre sea 1
                600: { slidesPerView: 1, spaceBetween: 0 },
                900: { slidesPerView: 1, spaceBetween: 0 },
                1200: { slidesPerView: 1, spaceBetween: 0 },
            }
        };

        // Activar el loop solo si hay más de 1 slide
        if (slides.length > 1) {
            swiperOptions.loop = true;
        }

        initSwiper('.heroSwiper', swiperOptions);
    }

    async function cargarJugadores() {
        const wrapper = document.getElementById('jugadores-wrapper');
        const jugadores = await fetchData('jugadores', wrapper);
        if (!jugadores) return;

        const jugadoresHtml = jugadores.map(jugador => `
            <div class="swiper-slide player-card">
                <img src="${jugador.foto || SILUETA_URL}" alt="Foto de ${jugador.nombre}">
                <h3>${jugador.nombre}</h3>
                <p>${jugador.posicion}</p>
            </div>
        `).join('');

        wrapper.innerHTML = jugadoresHtml;
        initSwiper('.mySwiper', {
            navigation: { nextEl: '.mySwiper .swiper-button-next', prevEl: '.mySwiper .swiper-button-prev' },
            pagination: { el: '.mySwiper .swiper-pagination', clickable: true },
        });
    }

    async function cargarProximosPartidos() {
        const wrapper = document.getElementById('partidos-wrapper');
        const partidos = await fetchData('partidos/proximos', wrapper);
        if (!partidos) return;

        const partidosHtml = partidos.map(partido => {
            const fecha = new Date(`${partido.fecha}T${partido.hora}`);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const horaFormateada = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

            return `
                <div class="swiper-slide partido-card">
                    ${partido.liga ? `<div class="liga-nombre">${partido.liga}</div>` : ''}
                    <div class="match-teams">
                        <div class="team-info">
                            <img src="identity/logo.png" alt="Tumbes FC" class="team-logo">
                            <span class="team-name team-home">Tumbes FC</span>
                        </div>
                        <span class="vs">VS</span>
                        <div class="team-info">
                            <img src="${partido.logo_visitante || SILUETA_URL}" alt="${partido.equipo_rival}" class="team-logo">
                            <span class="team-name team-away">${partido.equipo_rival}</span>
                        </div>
                    </div>
                    <div class="match-info">
                        <p><strong>Fecha:</strong> ${fechaFormateada}</p>
                        <p><strong>Hora:</strong> ${horaFormateada}</p>
                        <p><strong>Lugar:</strong> ${partido.lugar}</p>
                    </div>
                </div>`;
        }).join('');

        wrapper.innerHTML = partidosHtml;
        initSwiper('.partidosSwiper', {
            navigation: { nextEl: '.partidos-next', prevEl: '.partidos-prev' },
            pagination: { el: '.partidos-pagination', clickable: true },
        });
    }

    async function cargarResultados() {
        const wrapper = document.getElementById('resultados-wrapper');
        const resultados = await fetchData('partidos/resultados', wrapper);
        if (!resultados) return;

        const resultadosHtml = resultados.map(partido => {
            const fecha = new Date(partido.fecha);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

            return `
                <div class="swiper-slide resultado-card">
                    <div class="liga-nombre">${partido.liga || ''}</div>
                    <div class="resultado-equipos">
                        <div class="team-info">
                            <img src="identity/logo.png" alt="Tumbes FC" class="team-logo">
                            <span class="team-name-ult">Tumbes FC</span>
                        </div>
                        <div class="resultado-marcador">
                            <span>${partido.goles_local ?? '0'}</span>
                            <span class="guion">-</span>
                            <span>${partido.goles_visitante ?? '0'}</span>
                        </div>
                        <div class="team-info">
                            <img src="${partido.logo_visitante || SILUETA_URL}" alt="${partido.equipo_rival}" class="team-logo">
                            <span class="team-name-ult">${partido.equipo_rival}</span>
                        </div>
                    </div>
                    <div class="resultado-meta">
                        <span class="resultado-fecha">${fechaFormateada}</span> |
                        <span class="resultado-lugar">${partido.lugar}</span>
                    </div>
                    ${(partido.goleadores_local || partido.goleadores_visitante) ? `
                    <div class="resultado-goleadores">
                        ${partido.goleadores_local ? `<span class="goleadores-local"><b>Tumbes FC:</b> ${partido.goleadores_local}</span>` : ''}
                        ${partido.goleadores_visitante ? `<span class="goleadores-visitante"><b>${partido.equipo_rival}:</b> ${partido.goleadores_visitante}</span>` : ''}
                    </div>` : ''}
                </div>`;
        }).join('');

        wrapper.innerHTML = resultadosHtml;
        initSwiper('.resultadosSwiper', {
            navigation: { nextEl: '.resultados-next', prevEl: '.resultados-prev' },
            pagination: { el: '.resultados-pagination', clickable: true },
        });
    }

    async function cargarNoticias() {
        const wrapper = document.getElementById('noticias-wrapper');
        const noticias = await fetchData('noticias', wrapper);
        if (!noticias) return;

        const noticiasHtml = noticias.map(noticia => {
            const fecha = new Date(noticia.fecha);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
            return `
                <div class="swiper-slide noticia-card">
                    <a href="noticia.html?id=${noticia.id}" class="noticia-link">
                        <img src="${noticia.imagen}" alt="${noticia.titulo}" class="noticia-img">
                        <div class="noticia-content">
                            <h3>${noticia.titulo}</h3>
                            <p class="news-date">${fechaFormateada}</p>
                            <p class="news-resumen">${noticia.resumen.substring(0, 90)}...</p>
                        </div>
                    </a>
                </div>`;
        }).join('');

        wrapper.innerHTML = noticiasHtml;
        initSwiper('.noticiasSwiper', {
            navigation: { nextEl: '.noticias-next', prevEl: '.noticias-prev' },
            pagination: { el: '.noticias-pagination', clickable: true },
        });
    }

    async function cargarSponsors() {
        const destacadosWrapper = document.getElementById('sponsors-destacados-wrapper');
        const normalesWrapper = document.getElementById('sponsors-normales-wrapper');
        const sponsors = await fetchData('sponsors', destacadosWrapper); // Mostrar error en el primer wrapper
        if (!sponsors) return;

        let destacadosHtml = '';
        let normalesHtml = '';

        sponsors.forEach(sponsor => {
            const sponsorLink = `
                <a href="${sponsor.url}" target="_blank" class="sponsor-link ${sponsor.destacado ? 'sponsor-big' : ''}">
                    <img src="${sponsor.imagen}" alt="${sponsor.nombre}">
                </a>`;
            if (sponsor.destacado) {
                destacadosHtml += sponsorLink;
            } else {
                normalesHtml += sponsorLink;
            }
        });

        destacadosWrapper.innerHTML = destacadosHtml;
        normalesWrapper.innerHTML = normalesHtml;
    }

    // --- LÓGICA PARA ANIMACIONES AL HACER SCROLL ---
    const animateOnScrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        animateOnScrollObserver.observe(element);
    });

    // --- LLAMAR A TODAS LAS FUNCIONES AL CARGAR LA PÁGINA ---
    function initApp() {
        cargarHeroSlides();
        cargarJugadores();
        cargarProximosPartidos();
        cargarResultados();
        cargarNoticias();
        cargarSponsors();
    }

    initApp();
});