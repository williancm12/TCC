const apiKey = 'LA-b213b0a62dda429faaf87b60023209f589ed507340b44cf0bb283f89ba1dc366';

async function sendMessageToChatGPT(message) {
  try {
    const response = await fetch('https://api.llama-api.com/v1/chat/completions', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3.1-70b',
        messages: [{ role: 'user', content: message }],
        max_tokens: 100
      })
    });

    if (!response.ok) {
      const errorMessage = await response.json();
      console.error("Erro na API:", errorMessage);
      throw new Error(`Erro na comunicação com a API: ${errorMessage.error || "Desconhecido"}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro detectado:", error);
    return 'Desculpe, ocorreu um erro ao processar sua solicitação.';
  }
}

document.getElementById('btn-submit').addEventListener('click', async () => {
  const messageInput = document.getElementById('message-input');
  const userMessage = messageInput.value.trim();
  if (!userMessage) return;

  const history = document.getElementById('history');
  const status = document.getElementById('status');
  const button = document.getElementById('btn-submit');

  history.innerHTML += `<p><strong>Você:</strong> ${userMessage}</p>`;
  messageInput.value = '';


  status.textContent = 'Pensando...';
  button.disabled = true;

  const botMessage = await sendMessageToChatGPT(userMessage);


  history.innerHTML += `<p><strong>ChatGPT:</strong> ${botMessage}</p>`;
  history.scrollTop = history.scrollHeight; 

  status.textContent = '';
  button.disabled = false;
});
