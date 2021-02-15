let pagina = 1;

const cita = {
  nombre: "",
  fecha: "",
  hora: "",
  servicios: [],
};

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

  // Muestra el resumen de la cita o mensaje de error en caso de no pasar la validación
  mostrarResumen();
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

    const id = parseInt(elemento.dataset.idServicio);

    eliminarServicio(id);
  } else {
    elemento.classList.add("seleccionado");

    const servicioObj = {
      id: parseInt(elemento.dataset.idServicio),
      nombre: elemento.firstElementChild.textContent,
      precio: elemento.firstElementChild.nextElementSibling.textContent,
    };
    // console.log(servicioObj);

    agregarServicio(servicioObj);
  }
}

function eliminarServicio(id) {
  const { servicios } = cita;
  cita.servicios = servicios.filter((servicio) => servicio.id !== id);

  console.log(cita);
}

function agregarServicio(servicioObj) {
  const { servicios } = cita;
  cita.servicios = [...servicios, servicioObj];
  console.log(cita);
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

function mostrarResumen() {
  // Destructuring
  const { nombre, fecha, hora, servicios } = cita;

  const resumenDiv = document.querySelector(".contenido-resumen");

  // Validación

  if (Object.values(cita).includes("")) {
    // Object.values nos devuelve un Array con los valores del objeto, sin sus llaves (Keys). Básicamente en la línea anterior evaluamos si el objeto cita nos entrega un array con algún campo vacío.
    const noServicios = document.createElement("P");
    noServicios.textContent = "Por favor complete todos los datos";

    noServicios.classList.add("invalidar-cita");

    // Agregar a resumen Div
    resumenDiv.appendChild(noServicios);
  }
}
