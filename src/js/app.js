let pagina = 1;

document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarServicios();

  // Resaclta el Div actual según el tab al que se presiona
  mostrarSeccion();

  // Oculta o muestra una sección según el tab seleccionado
  cambiarSeccion();

  // Paginación botones siguiente y anterior
  paginaSiguiente();

  paginaAnterior();

  // Comprueba la página actual para ocultar o mostrar la paginación
  botonesPaginador();
}

function mostrarSeccion() {
  // Eliminar mostrar-seccion de la sección anterior
  const seccionAnterior = document.querySelector(".mostrar-seccion");
  if (seccionAnterior) {
    seccionAnterior.classList.remove("mostrar-seccion");
  }

  const seccionActual = document.querySelector(`#paso-${pagina}`);
  seccionActual.classList.add("mostrar-seccion");

  // Elimina la clase de actual en el tab anterior
  const tabAnterior = document.querySelector(".tabs button.actual");
  if (tabAnterior) {
    tabAnterior.classList.remove("actual");
  }

  // Resalta el Tab actual
  const tab = document.querySelector(`[data-paso="${pagina}"]`);
  tab.classList.add("actual");
}

function cambiarSeccion() {
  const enlaces = document.querySelectorAll(".tabs button");

  // El addEventListener se agrega solo sobre 1 elemento, no sobre una colección, por ello iteramos sobre enlaces.
  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (e) => {
      e.preventDefault();
      pagina = parseInt(e.target.dataset.paso);

      // Agregar la clase de actual en el nuevo tab
      mostrarSeccion();

      botonesPaginador();
    });
  });
}

async function mostrarServicios() {
  try {
    const resultado = await fetch("./servicios.json");
    const db = await resultado.json();
    // Con la desestructuración extraemos el valor y creamos la variable en un solo paso
    const { servicios } = db;

    // Generamos el Html
    servicios.forEach((servicio) => {
      const { id, nombre, precio } = servicio;

      // DOM Scripting
      // Generamos el nombre del servicio
      const nombreServicio = document.createElement("P");
      nombreServicio.textContent = nombre;
      nombreServicio.classList.add("nombre-servicio");

      // Generamos el precio del servicio
      const precioServicio = document.createElement("P");
      precioServicio.textContent = `$ ${precio}`;
      precioServicio.classList.add("precio-servicio");

      // Generamos el div contenedor del servicio
      const servicioDiv = document.createElement("DIV");
      servicioDiv.classList.add("servicio");
      servicioDiv.dataset.idServicio = id;

      // Cuando hacemos click en servicioDiv se ejecutartá la función seleccionarServicio
      servicioDiv.onclick = seleccionarServicio;

      // Inyectamos precio y nombre en el div de servicio
      servicioDiv.appendChild(nombreServicio);
      servicioDiv.appendChild(precioServicio);

      // Inyectamos el div en el Html
      document.querySelector("#servicios").appendChild(servicioDiv);
    });
  } catch (error) {
    console.log(error);
  }
}

function seleccionarServicio(e) {
  let elemento;

  // Forzamos que el elemento al cual le damos click sea el DIV
  if (e.target.tagName === "P") {
    elemento = e.target.parentElement;
  } else {
    elemento = e.target;
  }

  if (elemento.classList.contains("seleccionado")) {
    elemento.classList.remove("seleccionado");
  } else {
    elemento.classList.add("seleccionado");
  }
}

function paginaSiguiente() {
  const paginaSiguiente = document.querySelector("#siguiente");
  paginaSiguiente.addEventListener("click", () => {
    pagina++; // Incrementamos la página

    botonesPaginador(); // Volevmos a comprobar los btn del paginador
  });
}

function paginaAnterior() {
  const paginaAnterior = document.querySelector("#anterior");
  paginaAnterior.addEventListener("click", () => {
    pagina--;

    botonesPaginador();
  });
}

function botonesPaginador() {
  const paginaSiguiente = document.querySelector("#siguiente");
  const paginaAnterior = document.querySelector("#anterior");

  if (pagina === 1) {
    paginaAnterior.classList.add("ocultar");
  } else if (pagina === 3) {
    paginaSiguiente.classList.add("ocultar");
    paginaAnterior.classList.remove("ocultar");
  } else {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  }
  mostrarSeccion(); //Cambia la sección que se muestra por la de la página
}
