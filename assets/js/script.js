// === Selección de elementos del DOM y variables globales ===
// Botón de búsqueda, contenedor de las cards y URL base de la API
const inputBusqueda = document.getElementById('search');
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

// === Indicador visual de carga ===
function mostrarLoader() {
	if (!document.getElementById('loader-scroll')) {
		const loader = document.createElement('div');
		loader.id = 'loader-scroll';
		loader.innerHTML = `
            <div style="display:flex;justify-content:center;align-items:center;padding:1.5rem;">
                <div class="spinner-border text-warning" role="status" style="width: 3rem; height: 3rem;">
                    <span class="visually-hidden">Cargando...</span>
                </div>
            </div>
        `;
		contenedorData.appendChild(loader);
	}
}

function ocultarLoader() {
	const loader = document.getElementById('loader-scroll');
	if (loader) loader.remove();
}

// === Función para mostrar personajes en el DOM ===
// Pide una página de personajes y los agrega como cards al contenedor
const mostrarPersonaje = async (pagina = 1) => {
	if (cargando) return; // Solo evita llamadas múltiples
	cargando = true;
	mostrarLoader();
	const data = await cargarDatos(`${urlDragonBall}?page=${pagina}`);
	const dataPersonajes = data.items;

	// Espera artificial para ver el loader (por ejemplo, 1 segundo)
	await new Promise((resolve) => setTimeout(resolve, 0));

	ocultarLoader();
	if (!dataPersonajes || dataPersonajes.length === 0) {
		// Si no hay más personajes, vuelve a empezar desde la página 1
		paginaActual = 1;
		cargando = false;
		mostrarPersonaje(paginaActual);
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
		window.innerHeight + window.scrollY >= document.body.offsetHeight - 0 &&
		!cargando &&
		!enBusqueda // Solo si no estás buscando
	) {
		paginaActual++;
		mostrarPersonaje(paginaActual);
	}
});

// === Barra de búsqueda ===
async function buscarPersonajes() {
	const texto = inputBusqueda.value.trim().toLowerCase();
	enBusqueda = true; // Cambia el estado a búsqueda

	if (texto === '') {
		enBusqueda = false;
		contenedorData.innerHTML = '';
		paginaActual = 1;
		hayMas = true;

		if (typeof mostrarPersonaje === 'function') {
			mostrarPersonaje(paginaActual);
		}
		return;
	}

	try {
		const respuesta = await fetch(
			`https://dragonball-api.com/api/characters?name=${encodeURIComponent(texto)}`,
		);
		const datos = await respuesta.json();

		console.log('Datos obtenidos:', datos);
		contenedorData.innerHTML = ''; // Limpia antes de mostrar

		if (!Array.isArray(datos) || datos.length === 0) {
			contenedorData.innerHTML =
				'<div class="text-center py-4">No se encontraron personajes.</div>';
			return;
		}

		datos.forEach((personaje) => {
			contenedorData.innerHTML += `
				<div class="col-12 col-sm-6 col-md-4 col-lg-3 pb-3 d-flex justify-content-center" data-id=${personaje.id}>
					<div class="card personaje-card shadow-sm border-0">
						<img class="card-img-top rounded-top" src="${personaje.image}" alt="${personaje.name}" />
						<div class="card-body">
							<h5 class="card-title">${personaje.name}</h5>
							<p class="card-text">${personaje.race} - ${personaje.gender}</p>
							<button class="btn btn-success btn-ver-detalles">Ver más</button>
						</div>
					</div>
				</div>
			`;
		});
	} catch (error) {
		console.error('Error al buscar personajes:', error);
		contenedorData.innerHTML =
			'<div class="text-center py-4">Error al buscar personajes.</div>';
	}
}
// Búsqueda al hacer clic en el botón
btnBuscar.addEventListener('click', buscarPersonajes);

// Búsqueda al presionar Enter dentro del input
inputBusqueda.addEventListener('keyup', (event) => {
	if (event.key === 'Enter') {
		buscarPersonajes();
	}
});

// === Reiniciar búsqueda y cargar personajes por defecto ===
if (btnReset) {
	btnReset.addEventListener('click', () => {
		try {
			// Lanzamos un error a propósito
			throw new Error('Este es un error para probar el manejo de errores!');
		} catch (error) {
			// Mostramos el error con SweetAlert
			Swal.fire({
				icon: 'error',
				title: 'Error al cargar personajes',
				text: error.message,
			});
		}
	});
}

// if (btnReset) {
// 	btnReset.addEventListener('click', () => {
// 		console.log('Botón Reset presionado. Volviendo a la vista general.');
// 		enBusqueda = false;
// 		contenedorData.innerHTML = '';
// 		paginaActual = 1;
// 		hayMas = true;
// 		mostrarPersonaje(paginaActual);
// 	});
// }

// === Función para crear y mostrar un modal de Bootstrap con los detalles ===
function mostrarModalPersonaje(personaje) {
	// Elimina cualquier modal anterior
	const modalExistente = document.getElementById('modal-personaje');
	if (modalExistente) modalExistente.remove();

	// Crea el HTML del modal
	const modalHtml = `
    <div class="modal fade" id="modal-personaje" tabindex="-1" aria-labelledby="modalPersonajeLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalPersonajeLabel">${personaje.name}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body text-center">
            <img src="${personaje.image}" alt="${
		personaje.name
	}" class="img-fluid rounded mb-3" style="max-height:200px;">
            <p><strong>Raza:</strong> ${personaje.race}</p>
            <p><strong>Género:</strong> ${personaje.gender}</p>
            <p><strong>Descripción:</strong> ${
							personaje.description || 'Sin descripción.'
						}</p>
          </div>
        </div>
      </div>
    </div>
    `;
	document.body.insertAdjacentHTML('beforeend', modalHtml);

	// Inicializa y muestra el modal usando Bootstrap 5
	const modal = new bootstrap.Modal(document.getElementById('modal-personaje'));
	modal.show();
}

// === Delegación de eventos para los botones "Ver más" ===
document.addEventListener('click', async (e) => {
	if (e.target.classList.contains('btn-ver-detalles')) {
		const card = e.target.closest('[data-id]');
		const id = card ? card.getAttribute('data-id') : null;
		if (!id) return;

		try {
			// Pide los detalles del personaje a la API
			const res = await fetch(`https://dragonball-api.com/api/characters/${id}`);
			const personaje = await res.json();
			mostrarModalPersonaje(personaje);
		} catch (error) {
			alert('No se pudo cargar la información del personaje.');
		}
	}
});
