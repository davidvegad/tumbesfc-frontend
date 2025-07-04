// js/players.js

document.addEventListener('DOMContentLoaded', () => {
    const API_BASE_URL = window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://127.0.0.1:8000/api' // URL de tu backend local
        : 'https://mi-backend-render.onrender.com/api'; // ¡IMPORTANTE! Reemplaza esto con la URL real de tu backend en Render
    const SILUETA_URL = 'identity/silueta.png'; // Ruta a una imagen por defecto

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

    async function cargarTodosLosJugadores() {
        const wrapper = document.getElementById('all-players-grid');
        const jugadores = await fetchData('jugadores', wrapper);
        if (!jugadores) return;

        const jugadoresHtml = jugadores.map(jugador => `
            <div class="player-card">
                <img src="${jugador.foto || SILUETA_URL}" alt="Foto de ${jugador.nombre}">
                <h3>${jugador.nombre}</h3>
                <p>${jugador.posicion}</p>
            </div>
        `).join('');

        wrapper.innerHTML = jugadoresHtml;
    }

    // Lógica para animaciones al hacer scroll (copiada de main.js para esta página)
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

    cargarTodosLosJugadores();
});