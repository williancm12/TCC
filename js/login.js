// Função para fazer login
function login() {
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioEncontrado = usuarios.find(user => user.email === email && user.senha === senha);

    if (usuarioEncontrado) {
        alert('Login realizado com sucesso!');
        window.location.href = "inicio.html"; // Redireciona para a página inicial
    } else {
        alert('E-mail ou senha incorretos.');
    }
}

// Função para criar um novo usuário (sign-up)
function criarUsuario() {
    const email = document.getElementById('novoEmail').value;
    const senha = document.getElementById('novaSenha').value;

    if (email === '' || senha === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioExistente = usuarios.find(user => user.email === email);

    if (usuarioExistente) {
        alert('Usuário já existe!');
        return;
    }

    usuarios.push({ email, senha });
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuário criado com sucesso!');

    // Limpar os campos após cadastro
    document.getElementById('novoEmail').value = '';
    document.getElementById('novaSenha').value = '';

    closeModal();
}

// Função para abrir o modal de cadastro
function openModal() {
    document.getElementById('modal').style.display = 'block';
}

// Função para fechar o modal de cadastro
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

 document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("https://localhost:7006/api/Login/login", {
        method: "POST",
        headers: {
          "accept": "*/*",
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwiZW1haWwiOiJtb3JlaXJhY2V6YXIwNUBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjMiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoibW9yZWlyYWNlemFyMDVAZ21haWwuY29tIiwiZXhwIjoxNzYwNzE5MDcyfQ.QNkDaSWnLv-YFHzTJNPogRZIGvZJDMxNVObGsR8MF68",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      if (!response.ok) {
        throw new Error(`Erro: ${response.status}`);
      }

      const data = await response.json();
      console.log("Token recebido:", data.token);

      // Exemplo: salvar o token no localStorage
      localStorage.setItem("authToken", data.token);

      alert("Login realizado com sucesso!");
    } catch (error) {
      console.error("Falha no login:", error);
      alert("Erro ao fazer login. Verifique as credenciais.");
    }
  });