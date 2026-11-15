// -------------------------
// REFERENCIAS
// -------------------------
const modal = document.getElementById("modal");
const btnAbrir = document.getElementById("btn-abrir-modal");
const btnCerrar = document.getElementById("btn-cerrar");
const btnGuardar = document.getElementById("btn-guardar");
const tablaBody = document.getElementById("tabla-body");
const buscador = document.getElementById("buscador");
const modalTitulo = document.getElementById("modal-titulo");

// Formulario
const fNombre = document.getElementById("form-nombre");
const fEmail = document.getElementById("form-email");
const fTelefono = document.getElementById("form-telefono");
const fCanal = document.getElementById("form-canal");
const fFecha = document.getElementById("form-fecha");
const fRespuesta = document.getElementById("form-respuesta");
const fNotas = document.getElementById("form-notas");

let contactos = JSON.parse(localStorage.getItem("contactosMensajesSantaCruz")) || [];
let editIndex = null;

// -------------------------
// LOCAL STORAGE
// -------------------------
function guardarEnLocalStorage() {
  localStorage.setItem("contactosMensajesSantaCruz", JSON.stringify(contactos));
}

// -------------------------
// ACTUALIZAR TABLA
// -------------------------
function pintarTabla() {
  tablaBody.innerHTML = "";
  contactos.forEach((c, i) => {
    let claseRespuesta = "";
    if (c.respuesta === "Pendiente") claseRespuesta = "respuesta-pendiente";
    else if (c.respuesta === "Respondió") claseRespuesta = "respuesta-respondio";
    else if (c.respuesta === "Rechazó") claseRespuesta = "respuesta-rechazo";
    else claseRespuesta = "respuesta-noenviado";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${c.nombre}</td>
      <td>${c.email}</td>
      <td>${c.telefono}</td>
      <td>${c.canal}</td>
      <td>${c.fecha}</td>
      <td class="${claseRespuesta}">${c.respuesta}</td>
      <td>${c.notas}</td>
      <td>
        <button class="btn-editar" onclick="editarContacto(${i})">✏️</button>
        <button class="btn-borrar" onclick="borrarContacto(${i})">🗑️</button>
      </td>
    `;
    tablaBody.appendChild(fila);
  });
}

// -------------------------
// ABRIR / CERRAR MODAL
// -------------------------
btnAbrir.onclick = () => {
  modal.classList.remove("oculto");
  modalTitulo.textContent = "Añadir nuevo contacto";
  editIndex = null;
  fNombre.value = fEmail.value = fTelefono.value = fFecha.value = fNotas.value = "";
  fCanal.value = "Correo";
  fRespuesta.value = "Pendiente";
};

btnCerrar.onclick = () => modal.classList.add("oculto");

// -------------------------
// GUARDAR NUEVO CONTACTO / EDITAR
// -------------------------
btnGuardar.onclick = () => {
  const nuevo = {
    nombre: fNombre.value,
    email: fEmail.value,
    telefono: fTelefono.value,
    canal: fCanal.value,
    fecha: fFecha.value,
    respuesta: fRespuesta.value,
    notas: fNotas.value
  };

  if (editIndex !== null) {
    contactos[editIndex] = nuevo;
  } else {
    contactos.push(nuevo);
  }

  guardarEnLocalStorage();
  pintarTabla();
  modal.classList.add("oculto");
};

// -------------------------
// EDITAR CONTACTO
// -------------------------
function editarContacto(i) {
  editIndex = i;
  const c = contactos[i];
  modal.classList.remove("oculto");
  modalTitulo.textContent = "Editar contacto";
  fNombre.value = c.nombre;
  fEmail.value = c.email;
  fTelefono.value = c.telefono;
  fCanal.value = c.canal;
  fFecha.value = c.fecha;
  fRespuesta.value = c.respuesta;
  fNotas.value = c.notas;
}

// -------------------------
// BORRAR CONTACTO
// -------------------------
function borrarContacto(i) {
  if (confirm("¿Seguro que quieres borrar este contacto?")) {
    contactos.splice(i, 1);
    guardarEnLocalStorage();
    pintarTabla();
  }
}

// -------------------------
// BUSCADOR
// -------------------------
buscador.addEventListener("input", () => {
  const filtro = buscador.value.toLowerCase();
  const filtrados = contactos.filter(c =>
    c.nombre.toLowerCase().includes(filtro) ||
    c.email.toLowerCase().includes(filtro)
  );
  tablaBody.innerHTML = "";
  filtrados.forEach((c, i) => {
    let claseRespuesta = "";
    if (c.respuesta === "Pendiente") claseRespuesta = "respuesta-pendiente";
    else if (c.respuesta === "Respondió") claseRespuesta = "respuesta-respondio";
    else if (c.respuesta === "Rechazó") claseRespuesta = "respuesta-rechazo";
    else claseRespuesta = "respuesta-noenviado";

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${c.nombre}</td>
      <td>${c.email}</td>
      <td>${c.telefono}</td>
      <td>${c.canal}</td>
      <td>${c.fecha}</td>
      <td class="${claseRespuesta}">${c.respuesta}</td>
      <td>${c.notas}</td>
      <td>
        <button class="btn-editar" onclick="editarContacto(${i})">✏️</button>
        <button class="btn-borrar" onclick="borrarContacto(${i})">🗑️</button>
      </td>
    `;
    tablaBody.appendChild(fila);
  });
});

// -------------------------
// INICIO
// -------------------------
pintarTabla();

//exportar
const btnExportar = document.getElementById("btn-exportar");

btnExportar.onclick = () => {
  const dataStr = JSON.stringify(contactos, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  // Generamos la fecha actual en formato AAAA-MM-DD
  const hoy = new Date();
  const fecha = hoy.getFullYear() + "-" + 
                String(hoy.getMonth() + 1).padStart(2, '0') + "-" + 
                String(hoy.getDate()).padStart(2, '0');
  
  const a = document.createElement("a");
  a.href = url;
  a.download = `contactos_mensajes_${fecha}.json`; // 👈 Nombre dinámico
  a.click();
  URL.revokeObjectURL(url);
};

let sortNombreAsc = true;
let sortFechaAsc = true;

const thNombre = document.querySelector("th:nth-child(1)");
const thFecha = document.querySelector("th:nth-child(5)");

// Función para limpiar flechas
function limpiarFlechas() {
  thNombre.classList.remove("asc", "desc");
  thFecha.classList.remove("asc", "desc");
}

// Ordenar por nombre
thNombre.onclick = () => {
  contactos.sort((a, b) => sortNombreAsc ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre));
  sortNombreAsc = !sortNombreAsc;
  limpiarFlechas();
  thNombre.classList.add(sortNombreAsc ? "desc" : "asc"); // invertido porque ya se cambió sortNombreAsc
  pintarTabla();
};

// Ordenar por fecha
thFecha.onclick = () => {
  contactos.sort((a, b) => sortFechaAsc ? new Date(a.fecha) - new Date(b.fecha) : new Date(b.fecha) - new Date(a.fecha));
  sortFechaAsc = !sortFechaAsc;
  limpiarFlechas();
  thFecha.classList.add(sortFechaAsc ? "desc" : "asc");
  pintarTabla();
};


// creo que lo manda desde el .json del disco duro al storaje del pc
const btnImportar = document.getElementById("btn-importar");
const inputImportar = document.getElementById("input-importar");

btnImportar.onclick = () => {
  inputImportar.click(); // abre el explorador de archivos
};

inputImportar.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const datos = JSON.parse(event.target.result);
      if (Array.isArray(datos)) {
        contactos = datos; // reemplaza contactos actuales
        guardarEnLocalStorage();
        pintarTabla();
        alert("📥 Contactos importados correctamente!");
      } else {
        alert("❌ Archivo JSON no válido.");
      }
    } catch (err) {
      alert("❌ Error al leer el JSON.");
      console.error(err);
    }
  };
  reader.readAsText(file);
};
