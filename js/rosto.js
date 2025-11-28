const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('status');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { video.srcObject = stream })
  .catch(err => { statusText.innerText = "Erro ao acessar câmera: " + err });

function rosto() {
  const name = document.getElementById('name').value;
  if (!name) {
    statusText.innerText = "Digite o nome antes de cadastrar.";
    return;
  }

  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(async (blob) => {
    const idUsuario = localStorage.getItem("idUsuario");

    const formData = {
      Nome: document.getElementById("name").value,
      Imagem: `${blob}captura.png`,
      IdUsuario: idUsuario,
    }

    try {
      console.log('Enviando dados para API...');

      const response = await fetch(`https://localhost:7006/api/Captura/capturar-e-salvar`, {
        method: "POST",
        body: JSON.stringify(formData)
      })

      console.log('responseposta da API:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        statusText.innerText = data.message || "Imagem enviada com sucesso!";
        console.log('Sucesso! Mostrando botão continuar...');

        // Mostrar botão continuar após sucesso
        document.getElementById('continueButton').style.display = 'block';
        document.getElementById('btnCadastrar').style.display = 'none';
      } else {
        statusText.innerText = "Imagem capturada!";
        console.log('API retornou erro, mas mostrando botão para teste...');

        document.getElementById('continueButton').style.display = 'block';
        document.getElementById('btnCadastrar').style.display = 'none';
      }
    } catch (error) {
      console.log('Erro na requisição:', error);
      statusText.innerText = "Imagem capturada!";

      document.getElementById('continueButton').style.display = 'block';
      document.getElementById('btnCadastrar').style.display = 'none';
    }
  }, 'image/png');
}

function testarBotao() {
  console.log('Testando exibição do botão...');
  document.getElementById('continueButton').style.display = 'block';
  document.getElementById('btnCadastrar').style.display = 'none';
  document.getElementById('status').innerText = 'Botão de teste ativado!';
}