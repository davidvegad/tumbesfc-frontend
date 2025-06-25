// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURACIÓN ---
    // ¡IMPORTANTE! Cambia esta URL por la URL de tu API en Render
    const API_BASE_URL = 'https://mi-backend-render.onrender.com/api'; 
    const SILUETA_URL = 'identity/silueta.png'; // Ruta a una imagen por defecto

    // --- FUNCIONES PARA CARGAR DATOS ---

    // Cargar Jugadores
    async function cargarJugadores() {
        try {
            const response = await fetch(`${API_BASE_URL}/jugadores/`);
            const jugadores = await response.json();
            const wrapper = document.getElementById('jugadores-wrapper');
            wrapper.innerHTML = ''; // Limpiar contenido
            jugadores.forEach(jugador => {
                const jugadorCard = `
                    <div class="swiper-slide player-card">
                        <img src="${jugador.foto || SILUETA_URL}" alt="Foto de ${jugador.nombre}">
                        <h3>${jugador.nombre}</h3>
                        <p>${jugador.posicion.nombre}</p>
                    </div>`;
                wrapper.innerHTML += jugadorCard;
            });
            // Inicializar Swiper DESPUÉS de añadir el contenido
            new Swiper('.mySwiper', { slidesPerView: 1, spaceBetween: 30, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 600: { slidesPerView: 1 }, 900: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } } });
        } catch (error) {
            console.error('Error al cargar jugadores:', error);
        }
    }

    // Cargar Próximos Partidos
    async function cargarProximosPartidos() {
        try {
            const response = await fetch(`${API_BASE_URL}/partidos/proximos/`);
            const partidos = await response.json();
            const wrapper = document.getElementById('partidos-wrapper');
            wrapper.innerHTML = '';
            partidos.forEach(partido => {
                 const fecha = new Date(partido.fecha + 'T' + partido.hora);
                 const fechaFormateada = fecha.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                 const horaFormateada = fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

                const partidoCard = `
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
                wrapper.innerHTML += partidoCard;
            });
            new Swiper('.partidosSwiper', { slidesPerView: 1, spaceBetween: 10, navigation: { nextEl: '.partidos-next', prevEl: '.partidos-prev' }, pagination: { el: '.partidos-pagination', clickable: true }, breakpoints: { 600: { slidesPerView: 1 }, 900: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } } });
        } catch (error) {
            console.error('Error al cargar próximos partidos:', error);
        }
    }
    
    // ... Puedes crear funciones similares para cargarNoticias, cargarResultados, etc.
    // Te dejo el de noticias como ejemplo final.

    // Cargar Noticias
    async function cargarNoticias() {
        try {
            const response = await fetch(`${API_BASE_URL}/noticias/`);
            const noticias = await response.json();
            const wrapper = document.getElementById('noticias-wrapper');
            wrapper.innerHTML = '';
            noticias.forEach(noticia => {
                const fecha = new Date(noticia.fecha);
                const fechaFormateada = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
                // Asumiendo que tu API no genera el enlace a la noticia detallada, lo omitimos por ahora
                const noticiaCard = `
                    <div class="swiper-slide noticia-card">
                        <a href="#" style="text-decoration:none;color:inherit;">
                            <img src="${noticia.imagen}" alt="Imagen noticia" class="noticia-img">
                            <div class="noticia-content">
                                <h3>${noticia.titulo}</h3>
                                <p class="news-date">${fechaFormateada}</p>
                                <p class="news-resumen">${noticia.resumen.substring(0, 90)}...</p>
                            </div>
                        </a>
                    </div>`;
                wrapper.innerHTML += noticiaCard;
            });
            new Swiper('.noticiasSwiper', { slidesPerView: 1, spaceBetween: 32, navigation: { nextEl: '.noticias-next', prevEl: '.noticias-prev' }, pagination: { el: '.noticias-pagination', clickable: true }, breakpoints: { 600: { slidesPerView: 1 }, 900: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } } });
        } catch (error) {
            console.error('Error al cargar noticias:', error);
        }
    }
	
	// js/main.js

// ... (aquí van la constante API_BASE_URL y las funciones que ya tienes) ...

// --- NUEVAS FUNCIONES ---

// Cargar Últimos Resultados
async function cargarResultados() {
    try {
        const response = await fetch(`${API_BASE_URL}/partidos/resultados/`);
        const resultados = await response.json();
        const wrapper = document.getElementById('resultados-wrapper');
        wrapper.innerHTML = ''; // Limpiar

        resultados.forEach(partido => {
            const fecha = new Date(partido.fecha);
            const fechaFormateada = fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

            const resultadoCard = `
                <div class="swiper-slide resultado-card">
                    <div class="liga-nombre">${partido.liga || ''}</div>
                    <div class="resultado-equipos">
                        <div class="team-info">
                            <img src="identity/logo.png" alt="Tumbes FC" class="team-logo">
                            <span class="team-name-ult">Tumbes FC</span>
                        </div>
                        <div class="resultado-marcador">
                            <span>${partido.goles_local !== null ? partido.goles_local : '0'}</span>
                            <span class="guion">-</span>
                            <span>${partido.goles_visitante !== null ? partido.goles_visitante : '0'}</span>
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
            wrapper.innerHTML += resultadoCard;
        });

        new Swiper('.resultadosSwiper', { slidesPerView: 1, spaceBetween: 32, navigation: { nextEl: '.resultados-next', prevEl: '.resultados-prev' }, pagination: { el: '.resultados-pagination', clickable: true }, breakpoints: { 600: { slidesPerView: 1 }, 900: { slidesPerView: 2 }, 1200: { slidesPerView: 3 } } });

    } catch (error) {
        console.error('Error al cargar resultados:', error);
    }
}

// Cargar Hero Slides (Carrusel Principal)
async function cargarHeroSlides() {
    try {
        const response = await fetch(`${API_BASE_URL}/heroslides/`);
        const slides = await response.json();
        const wrapper = document.getElementById('hero-wrapper');
        wrapper.innerHTML = ''; // Limpiar

        slides.forEach(slide => {
            const heroSlide = `
                <div class="swiper-slide">
                    <a href="${slide.link || '#'}" target="_blank" style="text-decoration:none; color:inherit;">
                        <img src="${slide.imagen}" alt="${slide.titulo}" class="hero-img">
                        <div class="hero-text-overlay">
                            ${slide.titulo ? `<h1>${slide.titulo}</h1>` : ''}
                            ${slide.subtitulo ? `<p>${slide.subtitulo}</p>` : ''}
                            ${(slide.boton_texto && slide.link) ? `<span class="hero-cta">${slide.boton_texto}</span>` : ''}
                        </div>
                    </a>
                </div>`;
            wrapper.innerHTML += heroSlide;
        });

        new Swiper('.heroSwiper', { slidesPerView: 1, loop: true, autoplay: { delay: 4000, disableOnInteraction: false }, navigation: { nextEl: '.hero-next', prevEl: '.hero-prev' }, pagination: { el: '.hero-pagination', clickable: true }, speed: 800 });

    } catch (error) {
        console.error('Error al cargar hero slides:', error);
    }
}

// Cargar Sponsors
async function cargarSponsors() {
    try {
        const response = await fetch(`${API_BASE_URL}/sponsors/`);
        const sponsors = await response.json();
        const destacadosWrapper = document.getElementById('sponsors-destacados-wrapper');
        const normalesWrapper = document.getElementById('sponsors-normales-wrapper');
        
        destacadosWrapper.innerHTML = '';
        normalesWrapper.innerHTML = '';

        sponsors.forEach(sponsor => {
            const sponsorLink = `
                <a href="${sponsor.url}" target="_blank" class="sponsor-link ${sponsor.destacado ? 'sponsor-big' : ''}">
                    <img src="${sponsor.imagen}" alt="${sponsor.nombre}">
                </a>`;
            
            if (sponsor.destacado) {
                destacadosWrapper.innerHTML += sponsorLink;
            } else {
                normalesWrapper.innerHTML += sponsorLink;
            }
        });

    } catch (error) {
        console.error('Error al cargar sponsors:', error);
    }
}


    // --- LLAMAR A TODAS LAS FUNCIONES AL CARGAR LA PÁGINA ---
    cargarJugadores();
    cargarProximosPartidos();
    cargarNoticias();
	cargarResultados();
    cargarHeroSlides();
    cargarSponsors();
    // Llama aquí al resto de tus funciones (cargarResultados, cargarSponsors, etc.)
});