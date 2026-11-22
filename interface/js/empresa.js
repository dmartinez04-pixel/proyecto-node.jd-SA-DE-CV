window.onload = init;
var url = "http://localhost:3000";
var headers = {};

function init() {
    var token = localStorage.getItem("token");

    if (token && token !== "undefined" && token !== "null") {
        headers = {
            headers: {
                'Authorization': "Bearer " + token
            }
        };

        var linksLogout = document.querySelectorAll('a[href="login.html"]');
        for (var i = 0; i < linksLogout.length; i++) {
            linksLogout[i].addEventListener("click", function() {
                localStorage.removeItem("token");
            });
        }

        if (document.getElementById("tablaEmpleados")) {
            mostrarEmpleados();

            var inputBuscar = document.getElementById("buscar");
            if (inputBuscar) {
                inputBuscar.addEventListener("keypress", function(e) {
                    if (e.key === "Enter") {
                        mostrarEmpleados();
                    }
                });
            }
        }
    } else {
        window.location.href = "login.html";
    }
}

function cerrarSesion() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

function mostrarEmpleados() {
    var inputBuscar = document.getElementById("buscar");
    var nombre = inputBuscar ? inputBuscar.value.trim() : "";
    var ruta = nombre !== "" ? url + "/employees/" + nombre : url + "/employees";

    axios.get(ruta, headers)
        .then(function(res) {
            if (res.data.code === 200) {
                renderizarTabla(res.data.message);
            }
        })
        .catch(function(err) {
            if (err.response && err.response.status === 401) {
                cerrarSesion();
            } else if (err.response && err.response.status === 404) {
                document.getElementById("tablaEmpleados").innerHTML = `
                    <tr>
                        <td colspan="6" class="text-center text-muted">No se encontraron empleados con ese nombre.</td>
                    </tr>
                `;
            } else {
                console.log(err);
            }
        });
}

function renderizarTabla(empleados) {
    var tbody = document.getElementById("tablaEmpleados");
    var lista = Array.isArray(empleados) ? empleados : [empleados];
    tbody.innerHTML = "";

    for (var i = 0; i < lista.length; i++) {
        tbody.innerHTML += `
            <tr>
                <td>${lista[i].em_id}</td>
                <td>${lista[i].em_name}</td>
                <td>${lista[i].em_lastname}</td>
                <td>${lista[i].em_phone}</td>
                <td>${lista[i].em_email}</td>
                <td>${lista[i].em_direccion}</td>
            </tr>
        `;
    }
}

function agregarEmpleado(event) {
    event.preventDefault();

    var datos = {
        em_name: document.getElementById("nombre").value,
        em_lastname: document.getElementById("apellido").value,
        em_phone: document.getElementById("telefono").value,
        em_email: document.getElementById("correo").value,
        em_direccion: document.getElementById("direccion").value
    };

    var divMensaje = document.getElementById("mensaje");

    axios.post(url + "/employees", datos, headers)
        .then(function(res) {
            if (res.data.code === 201) {
                if (divMensaje) {
                    divMensaje.innerHTML = `<div class="alert alert-success">Empleado guardado correctamente.</div>`;
                }
                event.target.reset();
                setTimeout(function() {
                    window.location.href = "index.html";
                }, 1200);
            }
        })
        .catch(function(err) {
            if (err.response && err.response.status === 401) {
                cerrarSesion();
            } else if (divMensaje) {
                divMensaje.innerHTML = `<div class="alert alert-danger">Error al guardar el empleado.</div>`;
            }
            console.log(err);
        });
}

function buscarEmpleadoEditar() {
    var id = document.getElementById("idEmpleado").value.trim();
    var divEncontrado = document.getElementById("empleadoEncontrado");
    var formEditar = document.getElementById("formEditar");
    var divMensaje = document.getElementById("mensaje");

    if (divMensaje) divMensaje.innerHTML = "";

    if (!id || parseInt(id) < 1) {
        divEncontrado.innerHTML = `<div class="alert alert-warning">Por favor ingresa un ID válido.</div>`;
        formEditar.style.display = "none";
        return;
    }

    axios.get(url + "/employees/" + id, headers)
        .then(function(res) {
            var emp = Array.isArray(res.data.message) ? res.data.message[0] : res.data.message;

            if (res.data.code === 200 && emp) {
                divEncontrado.innerHTML = `<div class="alert alert-info">Editando a: <strong>${emp.em_name} ${emp.em_lastname}</strong></div>`;
                
                document.getElementById("nuevo_nombre").value = emp.em_name;
                document.getElementById("nuevo_apellido").value = emp.em_lastname;
                document.getElementById("nuevo_telefono").value = emp.em_phone;
                document.getElementById("nuevo_correo").value = emp.em_email;
                document.getElementById("nuevo_direccion").value = emp.em_direccion;

                formEditar.dataset.id = emp.em_id;
                formEditar.style.display = "block";
            }
        })
        .catch(function(err) {
            formEditar.style.display = "none";
            if (err.response && err.response.status === 401) {
                cerrarSesion();
            } else if (err.response && err.response.status === 404) {
                divEncontrado.innerHTML = `<div class="alert alert-warning">No se encontró ningún empleado con ese ID.</div>`;
            } else {
                divEncontrado.innerHTML = `<div class="alert alert-danger">Error al buscar el empleado.</div>`;
                console.log(err);
            }
        });
}

function guardarEdicion(event) {
    event.preventDefault();

    var formEditar = document.getElementById("formEditar");
    var id = formEditar.dataset.id || document.getElementById("idEmpleado").value.trim();
    var divMensaje = document.getElementById("mensaje");

    var datos = {
        em_name: document.getElementById("nuevo_nombre").value,
        em_lastname: document.getElementById("nuevo_apellido").value,
        em_phone: document.getElementById("nuevo_telefono").value,
        em_email: document.getElementById("nuevo_correo").value,
        em_direccion: document.getElementById("nuevo_direccion").value
    };

    axios.put(url + "/employees/" + id, datos, headers)
        .then(function(res) {
            if (res.data.code === 200) {
                divMensaje.innerHTML = `<div class="alert alert-success">Empleado actualizado correctamente.</div>`;
                setTimeout(function() {
                    window.location.href = "index.html";
                }, 1200);
            }
        })
        .catch(function(err) {
            if (err.response && err.response.status === 401) {
                cerrarSesion();
            } else {
                divMensaje.innerHTML = `<div class="alert alert-danger">Error al actualizar el empleado.</div>`;
                console.log(err);
            }
        });
}

function mostrarSeleccionEliminar() {
    var id = document.getElementById("idEmpleadoEliminar").value.trim();
    var divConfirmacion = document.getElementById("confirmacion");
    var textoConfirmacion = document.getElementById("empleadoAEliminar");
    var divMensaje = document.getElementById("mensaje");

    divMensaje.innerHTML = "";

    if (!id || parseInt(id) < 1) {
        divConfirmacion.style.display = "none";
        divMensaje.innerHTML = `<div class="alert alert-warning">Por favor ingresa un ID válido.</div>`;
        return;
    }

    axios.get(url + "/employees/" + id, headers)
        .then(function(res) {
            var emp = Array.isArray(res.data.message) ? res.data.message[0] : res.data.message;

            if (res.data.code === 200 && emp) {
                textoConfirmacion.innerHTML = `¿Estás seguro de que deseas eliminar definitivamente a <strong>${emp.em_name} ${emp.em_lastname}</strong> (ID: ${emp.em_id})?`;
                divConfirmacion.dataset.id = emp.em_id;
                divConfirmacion.style.display = "block";
            }
        })
        .catch(function(err) {
            divConfirmacion.style.display = "none";
            if (err.response && err.response.status === 401) {
                cerrarSesion();
            } else if (err.response && err.response.status === 404) {
                divMensaje.innerHTML = `<div class="alert alert-warning">No se encontró ningún empleado con ese ID.</div>`;
            } else {
                divMensaje.innerHTML = `<div class="alert alert-danger">Error al buscar el empleado.</div>`;
                console.log(err);
            }
        });
}

function eliminarEmpleado() {
    var divConfirmacion = document.getElementById("confirmacion");
    var id = divConfirmacion.dataset.id || document.getElementById("idEmpleadoEliminar").value.trim();
    var divMensaje = document.getElementById("mensaje");

    axios.delete(url + "/employees/" + id, headers)
        .then(function(res) {
            if (res.data.code === 200) {
                divConfirmacion.style.display = "none";
                document.getElementById("idEmpleadoEliminar").value = "";
                divMensaje.innerHTML = `<div class="alert alert-success">Empleado eliminado correctamente.</div>`;
                setTimeout(function() {
                    window.location.href = "index.html";
                }, 1200);
            }
        })
        .catch(function(err) {
            if (err.response && err.response.status === 401) {
                cerrarSesion();
            } else {
                divMensaje.innerHTML = `<div class="alert alert-danger">Error al eliminar el empleado.</div>`;
                console.log(err);
            }
        });
}

function cancelarEliminar() {
    var divConfirmacion = document.getElementById("confirmacion");
    divConfirmacion.style.display = "none";
    delete divConfirmacion.dataset.id;
    document.getElementById("idEmpleadoEliminar").value = "";
    document.getElementById("mensaje").innerHTML = "";
}