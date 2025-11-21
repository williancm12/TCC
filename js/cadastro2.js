async function CadastrarUsuario() {
    function formatarDataParaISO(data) {
        if (!data.includes("/")) return data;
        const [dia, mes, ano] = data.split("/");
        return `${ano}-${mes}-${dia}`;
    }

    const payload = {
        email: document.getElementById("email").value.trim(),
        senha: document.getElementById("senha").value.trim(),
        nome: document.getElementById("nome").value.trim(),
        telefone: document.getElementById("telefone").value.trim(),
        celular: document.getElementById("celular").value.trim(),
        rg: document.getElementById("rg").value.trim(),
        dataNascimento: formatarDataParaISO(document.getElementById("dataNasc").value.trim()),
        cpf: document.getElementById("cpf").value.trim(),
        deficiencia: document.getElementById("deficiencia").value.trim(),
        nomeBanco: document.getElementById("nomeBanco").value.trim(),
        agencia: document.getElementById("agencia").value.trim(),
        numeroConta: document.getElementById("numeroConta").value.trim(),
        tipoConta: document.getElementById("tipoConta").value.trim(),
        cep: document.getElementById("cep").value.trim(),
        rua: document.getElementById("rua").value.trim(),
        bairro: document.getElementById("bairro").value.trim(),
        cidade: document.getElementById("cidade").value.trim(),
        estado: document.getElementById("estado").value.trim(),
        complemento: document.getElementById("complemento").value.trim(),
        numero: Number(document.getElementById("numero").value.trim()),
        pais: document.getElementById("pais").value.trim()
    };

    console.log("ENVIANDO PARA API:", payload);

    try {
        const response = await fetch("https://localhost:7006/api/Usuario", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Erro API:", data);
            alert("Erro ao cadastrar: " + JSON.stringify(data));
            return;
        }

        alert("Cadastro realizado com sucesso!");
    } 
    catch (err) {
        console.error("Erro ao conectar:", err);
        alert("Falha ao conectar ao servidor.");
    }
}
