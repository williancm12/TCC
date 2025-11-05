async function getPerfilUser(params) {
    try {
        const idUsuario = localStorage.getItem("idUsuario");
        const token = localStorage.getItem("token");


        if (!idUsuario || !token) {
            console.error("Usuário não autenticado ou dados ausentes.");
            alert("Você precisa estar logado para acessar o perfil.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(`https://localhost:7006/api/Usuario/${idUsuario}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Informações do usuário", data);

            exibirPerfil(data);
            exibirPerfilInicio(data);
        }
    } catch (err) {
        console.log("Erro ao pegar informações do perfil logado")
    }
}

async function exibirPerfil(usuario) {
    const perfilDiv = document.getElementById("perfil");
    const nomeDiv = document.getElementById("user-name");

    nomeDiv.innerHTML = `<h3>${usuario.nome}</h3>`;

    perfilDiv.innerHTML = `
        <h2>Perfil do Usuário</h2>
        <p><strong>Nome:</strong> ${usuario.nome}</p>
        <p><strong>E-mail:</strong> ${usuario.email}</p>
        <p><strong>Telefone:</strong> ${usuario.telefone}</p>
        <p><strong>Celular:</strong> ${usuario.celular}</p>
        <p><strong>CPF:</strong> ${usuario.cpf}</p>
        <p><strong>RG:</strong> ${usuario.rg}</p>
        <p><strong>Data de Nascimento:</strong> ${new Date(usuario.dataNascimento).toLocaleDateString('pt-BR')}</p>
        <p><strong>Banco:</strong> ${usuario.nomeBanco} - Agência: ${usuario.agencia}, Conta: ${usuario.numeroConta} (${usuario.tipoConta})</p>
        <p><strong>Endereço:</strong> ${usuario.rua}, ${usuario.numero} - ${usuario.bairro}, ${usuario.cidade} - ${usuario.estado}, ${usuario.pais}</p>
        <p><strong>CEP:</strong> ${usuario.cep}</p>
        <p><strong>Deficiência:</strong> ${usuario.deficiencia}</p>
    `;
}

async function exibirPerfilInicio(usuario) {
    const nomeDisplayDiv = document.getElementById("username");
    const emailDiv = document.getElementById("email");

    nomeDisplayDiv.innerHTML = `
        <p>${usuario.nome}</p>
    `;
    emailDiv.innerHTML = `<p>${usuario.email}</p>`;
}


document.addEventListener("DOMContentLoaded", exibirPerfil);
document.addEventListener("DOMContentLoaded", exibirPerfilInicio);