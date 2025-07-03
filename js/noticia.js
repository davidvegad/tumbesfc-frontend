document.addEventListener('DOMContentLoaded', () => {
    // ¡IMPORTANTE! Reutiliza la URL de tu API
    //const API_BASE_URL = 'https://mi-backend-render.onrender.com/api'; 
	const API_BASE_URL = 'http://127.0.0.1:8000/api'; 

    // 1. Obtener el ID de la noticia desde la URL
    const params = new URLSearchParams(window.location.search);
    const noticiaId = params.get('id');

    const container = document.getElementById('noticia-detalle-container');

    if (!noticiaId) {
        container.innerHTML = '<p>Error: No se ha especificado una noticia.</p>';
        return;
    }

    // 2. Pedir los datos de esa noticia específica a la API
// js/noticia.js

// ... (El resto de tu código se mantiene igual) ...

async function cargarDetalleNoticia() {
    try {
        const response = await fetch(`${API_BASE_URL}/noticias/${noticiaId}/`);
        if (!response.ok) {
            throw new Error('La noticia no fue encontrada.');
        }
        const noticia = await response.json();

        // Actualizar el título de la página
        document.title = `${noticia.titulo} - Tumbes FC`;

        // 3. Crear el HTML y mostrarlo en la página (USANDO TUS CLASES CSS)
        const detalleHtml = `
            <article class="noticia-articulo">
                <h1>${noticia.titulo}</h1>
                
                <img src="${noticia.imagen}" alt="${noticia.titulo}" class="noticia-img-detalle">
                
                <div class="cuerpo-noticia">
                    ${noticia.cuerpo}
                </div>
                
                <a href="index.html" class="cta-button" style="margin-top: 30px;">‹ Volver a Noticias</a>
            </article>
        `;
        container.innerHTML = detalleHtml;

    } catch (error) {
        console.error('Error al cargar el detalle de la noticia:', error);
        container.innerHTML = `<p>Error al cargar la noticia. Es posible que ya no exista. <a href="index.html">Volver</a></p>`;
    }
}

cargarDetalleNoticia();
});