document.addEventListener("DOMContentLoaded", function () {
  iniciarApp();
});

function iniciarApp() {
  mostrarServicios();
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
