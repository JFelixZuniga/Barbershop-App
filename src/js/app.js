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

  // Almacena el nombre de la cita en el objeto
  nombreCita();

  // Almacenar la fecha de la cita en el objeto
  fechaCita();

  // Almacena la hora de la cita en el objeto
  horaCita();

  // Deshabilita días pasados
  desabilitarFechaAnterior();
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

  // console.log(cita);
}

function agregarServicio(servicioObj) {
  const { servicios } = cita;
  cita.servicios = [...servicios, servicioObj];
  // console.log(cita);
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

    mostrarResumen(); // Carga el resumen de la cita
  } else {
    paginaAnterior.classList.remove("ocultar");
    paginaSiguiente.classList.remove("ocultar");
  }
  mostrarSeccion(); //Cambia la sección que se muestra por la de la página
}

function mostrarResumen() {
  // Destructuring
  const { nombre, fecha, hora, servicios } = cita;

  // Seleccionar el resumen
  const resumenDiv = document.querySelector(".contenido-resumen");

  // Limpiar el Html previo
  while (resumenDiv.firstChild) {
    resumenDiv.removeChild(resumenDiv.firstChild);
  }

  // Validación del objeto
  if (Object.values(cita).includes("")) {
    // Object.values nos devuelve un Array con los valores del objeto, sin sus llaves (Keys). Básicamente en la línea anterior evaluamos si el objeto cita nos entrega un array con algún campo vacío.
    const noServicios = document.createElement("P");
    noServicios.textContent = "Por favor complete todos los datos";

    noServicios.classList.add("invalidar-cita");

    // Agregar a resumen Div
    resumenDiv.appendChild(noServicios);
    return;
  }

  const headingCita = document.createElement("H3");
  headingCita.textContent = "Resumen de Cita";

  // Mostrar el resumen
  const nombreCita = document.createElement("P");
  nombreCita.innerHTML = `<span>Nombre:</span> ${nombre}`;

  const fechaCita = document.createElement("P");
  fechaCita.innerHTML = `<span>Fecha:</span> ${fecha}`;

  const horaCita = document.createElement("P");
  horaCita.innerHTML = `<span>Hora:</span> ${hora}`;

  const serviciosCita = document.createElement("DIV");
  serviciosCita.classList.add("resumen-servicios");

  const headingServicios = document.createElement("H3");
  headingServicios.textContent = "Resumen de Servicios";

  serviciosCita.appendChild(headingServicios);

  let cantidad = 0;

  // Iterar sobre el arreglo de servicios
  servicios.forEach((servicio) => {
    const { nombre, precio } = servicio;

    const contenedorServicio = document.createElement("DIV");
    contenedorServicio.classList.add("contenedor-servicio");

    const textoServicio = document.createElement("P");
    textoServicio.textContent = nombre;

    const precioServicio = document.createElement("P");
    precioServicio.textContent = precio;
    precioServicio.classList.add("precio");

    const totalServicio = precio.split("$");
    cantidad += parseInt(totalServicio[1].trim());

    // Colocar texto y precio en el Div
    contenedorServicio.appendChild(textoServicio);
    contenedorServicio.appendChild(precioServicio);

    serviciosCita.appendChild(contenedorServicio);
  });

  // console.log(cantidad);

  resumenDiv.appendChild(headingCita);
  resumenDiv.appendChild(nombreCita);
  resumenDiv.appendChild(fechaCita);
  resumenDiv.appendChild(horaCita);

  resumenDiv.appendChild(serviciosCita);

  const cantidadPagar = document.createElement("P");
  cantidadPagar.classList.add("total");
  cantidadPagar.innerHTML = `<span>Total a Pagar: </span>$ ${cantidad}`;

  resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
  const nombreInput = document.querySelector("#nombre");

  nombreInput.addEventListener("input", (e) => {
    const nombreTexto = e.target.value.trim(); // trim() elimina los espacios en blancos al inicio y final

    // Validación de que el nombreTexto debe tener algo
    if (nombreTexto === "" || nombreTexto.length < 3) {
      mostrarAlerta("nombre no válido", "error");
    } else {
      const alerta = document.querySelector(".alerta");
      if (alerta) {
        alerta.remove();
      }
      cita.nombre = nombreTexto;
      // console.log(cita);
    }
  });
}

function mostrarAlerta(mensaje, tipo) {
  // Controlamos el número de alertas que se generan
  const alertaPrevia = document.querySelector(".alerta");
  if (alertaPrevia) {
    return; // Detecta el return y detiene la ejecución del código
  }

  const alerta = document.createElement("DIV");
  alerta.textContent = mensaje;
  alerta.classList.add("alerta");

  if (tipo === "error") {
    alerta.classList.add("error");
  }

  // Insertar en el Html
  const formulario = document.querySelector(".formulario");
  formulario.appendChild(alerta);

  // Eliminar la alerta después de 3 segundos
  setTimeout(() => {
    alerta.remove();
  }, 3000);
}

function fechaCita() {
  const fechaInput = document.querySelector("#fecha");
  fechaInput.addEventListener("input", (e) => {
    // Date(e.target.value).getUTCDate() devuelve el número del día del 0 al 6 (de domingo a sábado)
    const dia = new Date(e.target.value).getUTCDay();

    if ([0, 6].includes(dia)) {
      e.preventDefault();
      fechaInput.value = "";
      mostrarAlerta("Fines de semana no son permitidos", "error");
    } else {
      cita.fecha = fechaInput.value;
      console.log(cita);
    }
  });
}

function desabilitarFechaAnterior() {
  const inputFecha = document.querySelector("#fecha");

  const fechaAhora = new Date();
  const year = fechaAhora.getFullYear();
  const mes = fechaAhora.getMonth() + 1;
  const dia = fechaAhora.getDate() + 1;

  const fechaDeshabilitar = `${year}-${mes < 10 ? `0${mes}` : mes}-${
    dia < 10 ? `0${dia}` : dia
  }`;

  inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
  const inputHora = document.querySelector("#hora");
  inputHora.addEventListener("input", (e) => {
    const horaCita = e.target.value;
    const hora = horaCita.split(":");

    if (hora[0] < 09 || hora[0] > 18) {
      mostrarAlerta("Hora no válida", "error");
      setTimeout(() => {
        inputHora.value = "";
      }, 3000);
    } else {
      cita.hora = horaCita;

      console.log(cita);
    }
  });
}
