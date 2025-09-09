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
          console.log('Enviando dados para API...');
          const res = await fetch('https://localhost:7006/api/Captura/capturar-e-salvar', {
            method: 'POST',
            body: formData
          });

          console.log('Resposta da API:', res.status, res.statusText);
          
          if (res.ok) {
            const data = await res.json();
            statusText.innerText = data.message || "Imagem enviada com sucesso!";
            console.log('Sucesso! Mostrando botão continuar...');
            
            // Mostrar botão continuar após sucesso
            document.getElementById('continueButton').style.display = 'block';
            document.getElementById('btnCadastrar').style.display = 'none';
          } else {
            // Se a API retornar erro, mas ainda assim queremos mostrar o botão para teste
            statusText.innerText = "Imagem capturada! (API offline - modo teste)";
            console.log('API retornou erro, mas mostrando botão para teste...');
            
            // Mostrar botão continuar mesmo com erro da API (para teste)
            document.getElementById('continueButton').style.display = 'block';
            document.getElementById('btnCadastrar').style.display = 'none';
          }
        } catch (error) {
          console.log('Erro na requisição:', error);
          statusText.innerText = "Imagem capturada! (API offline - modo teste)";
          
          // Mostrar botão continuar mesmo com erro (para teste)
          document.getElementById('continueButton').style.display = 'block';
          document.getElementById('btnCadastrar').style.display = 'none';
        }
      }, 'image/png');
    }

    // Função para testar o botão (temporária)
    function testarBotao() {
      console.log('Testando exibição do botão...');
      document.getElementById('continueButton').style.display = 'block';
      document.getElementById('btnCadastrar').style.display = 'none';
      document.getElementById('status').innerText = 'Botão de teste ativado!';
    }