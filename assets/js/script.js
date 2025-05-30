// === Selección de elementos del DOM y variables globales ===
// Botón de búsqueda, contenedor de las cards y URL base de la API
const btnBuscar = document.getElementById('btn-Search');
const btnReset = document.getElementById('btn-Reset'); // Botón de reinicio
const contenedorData = document.getElementById('contenedor-data');
const urlDragonBall = 'https://dragonball-api.com/api/characters';

// Variables para controlar la paginación y el estado de carga
let paginaActual = 1;
let cargando = false;
let hayMas = true;
let enBusqueda = false; // Nueva variable para controlar el estado de búsqueda

// === Función para cargar datos desde la API ===
// Recibe una URL, hace la petición y retorna los datos en formato JSON
const cargarDatos = async (url) => {
	try {
		const response = await fetch(url);

		if (!response.ok) {
			throw new error('Error en la API');
		}

		const data = await response.json();

		return data;
	} catch (error) {
		console.log(error);
	}
};

// === Función para ver detalles de un personaje ===
// Hace una petición a la API por ID y muestra la descripción en un alert
const verDetalles = async (id) => {
	try {
		const response = await fetch(`${urlDragonBall}/${id}`);
		if (!response.ok) {
			throw new error('Error en la API');
		}

		const data = await response.json();

		alert(data.description);
	} catch (error) {
		console.log(error);
	}
};

// === Función para mostrar personajes en el DOM ===
// Pide una página de personajes y los agrega como cards al contenedor
const mostrarPersonaje = async (pagina = 1) => {
	if (cargando || !hayMas) return; // Evita llamadas múltiples o si no hay más datos
	cargando = true;
	const data = await cargarDatos(`${urlDragonBall}?page=${pagina}`);
	const dataPersonajes = data.items;
	if (!dataPersonajes || dataPersonajes.length === 0) {
		hayMas = false; // Si no hay más personajes, detiene el scroll infinito
		return;
	}
	dataPersonajes.forEach((personaje) => {
		contenedorData.innerHTML += `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 pb-3 d-flex justify-content-center" data-id=${personaje.id}>
                <div class="card personaje-card shadow-sm border-0">
                    <img class="card-img-top rounded-top" src="${personaje.image}" alt="${personaje.name}" />
                    <div class="card-body">
                        <h5 class="card-title">${personaje.name}</h5>
                        <p class="card-text">${personaje.race} - ${personaje.gender}</p>
                        <button class="btn btn-success btn-ver-detalles" id="btn-ver-${personaje.id}">Ver más</button>
                    </div>
                </div>
            </div>
        `;
	});
	cargando = false;
};

// === Carga inicial de personajes ===
mostrarPersonaje();

// === Scroll infinito ===
// Cuando el usuario llega cerca del final de la página, carga más personajes
window.addEventListener('scroll', () => {
	console.log(
		'Scroll detectado. enBusqueda:',
		enBusqueda,
		'cargando:',
		cargando,
		'hayMas:',
		hayMas,
	);
	if (
		window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
		!cargando &&
		hayMas &&
		!enBusqueda // Solo si no estás buscando
	) {
		console.log('Cargando más personajes, página:', paginaActual + 1);
		paginaActual++;
		mostrarPersonaje(paginaActual);
	}
});

// === Búsqueda rápida de personajes por nombre ===

// === Reiniciar búsqueda y cargar personajes por defecto ===
if (btnReset) {
	btnReset.addEventListener('click', () => {
		console.log('Botón Reset presionado. Volviendo a la vista general.');
		enBusqueda = false;
		contenedorData.innerHTML = '';
		paginaActual = 1;
		hayMas = true;
		mostrarPersonaje(paginaActual);
	});
}
