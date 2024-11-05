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
