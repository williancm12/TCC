const conversationDiv = document.getElementById('conversation');
const apiURL = "https://catfact.ninja/fact";
const MAX_MESSAGES = 7;

// Função para carregar mensagens salvas no localStorage
function loadConversation() {
    const messages = JSON.parse(localStorage.getItem('conversation')) || [];
    conversationDiv.innerHTML = ''; // Limpa o conteúdo
    messages.forEach((message, index) => addMessageToDOM(message, index));
}

// Função para salvar mensagens no localStorage com limite máximo
function saveMessage(message) {
    const messages = JSON.parse(localStorage.getItem('conversation')) || [];
    messages.push(message);
    if (messages.length > MAX_MESSAGES) {
        messages.shift();
    }
    localStorage.setItem('conversation', JSON.stringify(messages));
}

// Função para formatar o horário
function formatTimestamp(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

// Adicionar mensagem ao DOM
function addMessageToDOM({ text, sender, timestamp }, index) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card';

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = text;

    const timestampDiv = document.createElement('div');
    timestampDiv.className = 'timestamp';
    timestampDiv.textContent = timestamp;

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Excluir';
    deleteBtn.dataset.index = index; // Configura o índice como atributo

    cardDiv.appendChild(messageDiv);
    cardDiv.appendChild(timestampDiv);
    cardDiv.appendChild(deleteBtn);

    conversationDiv.appendChild(cardDiv);

    // Scroll automático apenas se estiver no final
    const isAtBottom =
        conversationDiv.scrollHeight - conversationDiv.scrollTop <= conversationDiv.clientHeight;
    if (isAtBottom) {
        conversationDiv.scrollTop = conversationDiv.scrollHeight;
    }
}

// Delegação de eventos para excluir mensagens
conversationDiv.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const index = event.target.dataset.index;
        deleteMessage(index);
    }
});

// Função para buscar uma resposta aleatória da API
async function getRandomMessage() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error("Erro ao obter dados da API.");
        const data = await response.json();
        return data.fact || "Erro ao receber a resposta.";
    } catch (error) {
        console.error("Erro:", error);
        return "Erro ao conectar com a API.";
    }
}

// Função para enviar notificação
async function sendNotification() {
    const now = new Date();

    const botMessageText = await getRandomMessage();
    const timestamp = formatTimestamp(now);

    const botMessage = {
        text: botMessageText,
        sender: "bot",
        timestamp: timestamp
    };

    addMessageToDOM(botMessage, Date.now());
    saveMessage(botMessage);
}

// Função para excluir uma mensagem individual
function deleteMessage(index) {
    const messages = JSON.parse(localStorage.getItem('conversation')) || [];
    messages.splice(index, 1);
    localStorage.setItem('conversation', JSON.stringify(messages));
    loadConversation();
}

// Função para excluir todas as mensagens
function deleteAllMessages() {
    if (confirm("Tem certeza de que deseja excluir todas as mensagens?")) {
        localStorage.removeItem('conversation');
        loadConversation();
        alert("Todas as mensagens foram excluídas!");
    }
}

// Inicializa as mensagens salvas
loadConversation();

// Configura a busca de mensagens da API a cada 3 minutos
setInterval(sendNotification, 180000); // 3 minutos em milissegundos

// Envia uma mensagem inicial ao carregar a página
sendNotification();

// Função para alternar o tema de fundo
let themes = [
    'linear-gradient(135deg, #1e3c72, #2a5298)',
    'linear-gradient(135deg, #000, #6a0dad)'
];
let currentThemeIndex = 0;

function toggleTheme() {
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    document.body.style.background = themes[currentThemeIndex];
}