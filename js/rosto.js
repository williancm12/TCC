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
    const idUsuarioNumber = parseInt(idUsuario);

    const formData = new FormData();
    formData.append('Nome', name);
    formData.append('Imagem', blob, 'captura.png');
    formData.append('IdUsuario', idUsuarioNumber);

    console.log('Enviando dados para API...');

    try {
      const response = await fetch(`https://localhost:7006/api/Captura/capturar-e-salvar`, {
        method: "POST",
        body: formData
      })

      console.log('resposta da API:', response.status, response.statusText);

      if (response.ok) {
        const responseText = await response.text();
        console.log('Resposta:', responseText);
        
        let message;
        try {
          const data = JSON.parse(responseText);
          message = data.message || "Imagem enviada com sucesso!";
        } catch {
          message = responseText || "Imagem enviada com sucesso!";
        }
        
        statusText.innerText = message;
        console.log('Sucesso! Redirecionando para o início...');

        setTimeout(() => {
            window.location.href = "/ProjetoWillian/inicio-mapa.html";
        }, 1500);


      } else {
        statusText.innerText = "Erro ao enviar imagem";
        console.log('API retornou erro');
      }
    } catch (error) {
      console.log('Erro na requisição:', error);
      statusText.innerText = "Erro na requisição";
    }
  }, 'image/png');
}

function testarBotao() {
  document.getElementById('continueButton').style.display = 'block';
  document.getElementById('btnCadastrar').style.display = 'none';
  document.getElementById('status').innerText = 'Botão de teste ativado!';
}