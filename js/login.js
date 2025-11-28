// Função para fazer login
async function Login(event) {
    // Impede o envio padrão do formulário (que coloca os dados na URL)
    if (event) event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("https://localhost:7006/api/Login/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("API login response:", data);

            const token = data.token;
            const idUsuario = data.idUsuario;

            if (data.token && data.idUsuario) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("idUsuario", data.idUsuario.toString());
                console.log('Token está disponivel', data.token);
                console.log('idUsuario está disponivel', data.idUsuario);
                alert("Login realizado com sucesso!");
                window.location.href = "inicio-mapa.html";
                return;
            } else {
                alert("Login realizado, mas nenhum token foi retornado.");
            }
        } else {
            alert("Erro no login: " + response.status);
        }
    } catch (err) {
        console.error("Erro ao chamar API de login:", err);
        alert("Falha de conexão com o servidor.");
    }

    // Fallback local
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const usuarioEncontrado = usuarios.find(user => user.username === username && user.password === password);

    if (usuarioEncontrado) {
        localStorage.setItem('token', usuarioEncontrado.token || 'token');
        alert('Login realizado com sucesso! (local)');
        window.location.href = "inicio-mapa.html";
    } else {
        alert('E-mail ou senha incorretos.');
    }s
}

function showInstructionsScreen() {
    const instructionsScreen = document.getElementById('instructionsScreen');
    if (instructionsScreen) {
        instructionsScreen.style.display = 'flex';
        document.body.style.overflow = 'hidden';

        setTimeout(() => {
            instructionsScreen.classList.add('show');
        }, 10);
    }
}

function hideInstructionsAndRedirect() {
    const instructionsScreen = document.getElementById('instructionsScreen');
    if (instructionsScreen) {
        instructionsScreen.classList.remove('show');
        setTimeout(() => {
            instructionsScreen.style.display = 'none';
            document.body.style.overflow = 'auto';
            window.location.href = "rosto.html";
        }, 300);
    } else {
        window.location.href = "rosto.html";
    }
}
