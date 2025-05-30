const btnBuscar = document.getElementById('btn-Search');
const contenedorData = document.getElementById('contenedor-data');
const urlDragonBall = 'https://dragonball-api.com/api/characters';

// Función para limpiar el contenedor de datos

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
const mostrarPersonaje = async (e) => {
	const data = await cargarDatos(urlDragonBall);
	const dataPersonajes = data.items;
	dataPersonajes.forEach((personaje) => {
		contenedorData.innerHTML += `
        <div class="col-3 pb-2 d-flex justify-content-center" data-id=${personaje.id}>
            <div class="card">
            <img
                class="card-img-top"
                src=${personaje.image}
            />
            <div class="card-body">
                <h5 class="card-title">${personaje.name}</h5>
                <p class="card-text">${personaje.race} - ${personaje.gender}</p>
                <button class="btn btn-success btn-ver-detalles">Ver más</button>
            </div>
            </div>
        </div>
    `;
	});
};

mostrarPersonaje();
