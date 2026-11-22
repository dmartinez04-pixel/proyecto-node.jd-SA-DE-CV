window.onload = init;

function init() {
    if (localStorage.getItem("token")) {
        window.location.href = "index.html";
    }
}

function entrar(event) {
    event.preventDefault();

    var mail = document.getElementById("correo").value.trim();
    var pass = document.getElementById("contrasena").value;

    axios.post("http://localhost:3000/admins/login", {
        ma_email: mail,
        ma_password: pass
    })
    .then(function(res) {
        if (res.data.code === 200) {
            localStorage.setItem("token", res.data.message);
            window.location.href = "index.html";
        } else {
            alert("Usuario y/o contraseña incorrectos");
        }
    })
    .catch(function(err) {
        console.log(err);
        alert("Usuario y/o contraseña incorrectos");
    });
}