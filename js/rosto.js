const video = document.getElementById('video');
    const canvas = document.getElementById('canvas');
    const statusText = document.getElementById('status');

    // Acessar câmera
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => { video.srcObject = stream })
      .catch(err => { statusText.innerText = "Erro ao acessar câmera: " + err });

    // Função para capturar e enviar a imagem
    function rosto() {
      const name = document.getElementById('name').value;
      if (!name) {
        statusText.innerText = "Digite o nome antes de cadastrar.";
        return;
      }

      canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(async (blob) => {
        const formData = new FormData();
        formData.append('Nome', name);
        formData.append('Imagem', blob, 'foto.png');

        try {
          const res = await fetch('https://localhost:7006/api/Captura/capturar-e-salvar', {
            method: 'POST',
            body: formData
          });

          const data = await res.json();
          statusText.innerText = data.message || "Imagem enviada com sucesso!";
        } catch (error) {
          statusText.innerText = "Erro ao cadastrar: " + error.message;
        }
      }, 'image/png');
    }