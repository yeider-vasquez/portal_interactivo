// 1. Selección de elementos clave del DOM
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");
const selectCurso = document.querySelector("#curso");
const tarjetasCursos = document.querySelectorAll(".card-course");

// 2. Función pura para obtener el valor base del curso
function obtenerPrecioBase(curso) {
  switch (curso) {
    case "HTML":
      return 100000;
    case "CSS":
      return 120000;
    case "JavaScript":
      return 150000;
    default:
      return 0;
  }
}

// 3. Interacción visual: Al hacer clic en una tarjeta, se selecciona en el formulario
tarjetasCursos.forEach(tarjeta => {
  tarjeta.addEventListener("click", () => {
    const cursoNombre = tarjeta.getAttribute("data-course");
    selectCurso.value = cursoNombre;
    
    // Desplazamiento suave al formulario
    document.querySelector("#inscripcion").scrollIntoView({ behavior: 'smooth' });
  });
});

// 4. Manejo del evento Submit
formulario.addEventListener("submit", function(evento) {
  evento.preventDefault();

  // Validaciones del navegador
  if (!formulario.checkValidity()) {
    formulario.reportValidity();
    return;
  }

  // Captura y limpieza de entradas
  const nombre = document.querySelector("#nombre").value.trim();
  const correo = document.querySelector("#correo").value.trim();
  const edad = Number(document.querySelector("#edad").value);
  const curso = selectCurso.value;
  const modalidad = document.querySelector("#modalidad").value;

  // Validación de reglas de negocio
  if (nombre.length < 3 || edad < 14 || edad > 100) {
    mostrarError("Verifica que el nombre tenga al menos 3 letras y la edad esté entre 14 y 100 años.");
    return;
  }

  // Cálculo del precio final
  const precioBase = obtenerPrecioBase(curso);
  const recargo = (modalidad === "Presencial") ? 20000 : 0;
  const precioTotal = precioBase + recargo;

  // Renderizado seguro en el DOM (previene XSS)
  renderizarResumen({
    nombre,
    correo,
    edad,
    curso,
    modalidad,
    precioBase,
    recargo,
    precioTotal
  });
});

// 5. Función para construir el ticket de resumen de forma segura
function renderizarResumen(datos) {
  resultado.className = "summary-box";
  resultado.removeAttribute("hidden");
  resultado.textContent = ""; // Limpieza previa

  // Estructura del Ticket
  const header = document.createElement("div");
  header.className = "summary-header";

  const titulo = document.createElement("h3");
  titulo.textContent = "Resumen de Inscripción";

  const status = document.createElement("span");
  status.className = "status-badge";
  status.textContent = "Cotización Calculada";

  header.appendChild(titulo);
  header.appendChild(status);

  // Detalles
  const detailsGrid = document.createElement("div");
  detailsGrid.className = "summary-details";

  const campos = [
    { label: "Estudiante", val: datos.nombre },
    { label: "Correo", val: datos.correo },
    { label: "Edad", val: `${datos.edad} años` },
    { label: "Curso", val: datos.curso },
    { label: "Modalidad", val: datos.modalidad },
    { label: "Recargo Presencial", val: `$${datos.recargo.toLocaleString("es-CO")} COP` }
  ];

  campos.forEach(campo => {
    const item = document.createElement("div");
    item.className = "summary-item";

    const lbl = document.createElement("span");
    lbl.className = "label";
    lbl.textContent = campo.label;

    const val = document.createElement("span");
    val.className = "value";
    val.textContent = campo.val;

    item.appendChild(lbl);
    item.appendChild(val);
    detailsGrid.appendChild(item);
  });

  // Total
  const totalDiv = document.createElement("div");
  totalDiv.className = "summary-total";

  const totalLbl = document.createElement("span");
  totalLbl.textContent = "Valor Estimado Total:";

  const totalVal = document.createElement("span");
  totalVal.className = "total-price";
  totalVal.textContent = `$${datos.precioTotal.toLocaleString("es-CO")} COP`;

  totalDiv.appendChild(totalLbl);
  totalDiv.appendChild(totalVal);
  detailsGrid.appendChild(totalDiv);

  resultado.appendChild(header);
  resultado.appendChild(detailsGrid);
}

// 6. Función para mostrar errores
function mostrarError(mensaje) {
  resultado.className = "summary-box error-state";
  resultado.removeAttribute("hidden");
  resultado.textContent = mensaje;
}

// 7. Evento Reset para ocultar el cuadro de resultado
formulario.addEventListener("reset", function() {
  resultado.textContent = "";
  resultado.setAttribute("hidden", "true");
  resultado.className = "summary-box";
});