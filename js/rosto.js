const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('status');

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => { video.srcObject = stream });

function rosto() {
  const name = document.getElementById('name').value;
  if (!name) {
    statusText.innerText = "Digite o nome antes de cadastrar.";
    return;
  }

  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('Nome', name);       // deve casar com UploadRequest.Nome
    formData.append('Imagem', blob, 'foto.png'); // deve casar com UploadRequest.Imagem

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
