document.addEventListener('DOMContentLoaded', () => {
  const chatButton = document.getElementById('chat-button');
  const chatWidget = document.getElementById('chat-widget');
  const chatClose  = document.getElementById('chat-close');
  const sendBtn    = document.getElementById('send-btn');
  const userInput  = document.getElementById('user-message');
  const messages   = document.getElementById('chat-messages');

  // Debug: confira se os elementos foram encontrados
  console.log({ chatButton, chatWidget, chatClose });

  // Abre o widget
  chatButton.addEventListener('click', () => {
    chatWidget.style.display = 'flex';
  });

  // Fecha o widget
  chatClose.addEventListener('click', () => {
    chatWidget.style.display = 'none';
  });

  // Envio de mensagem
  sendBtn.addEventListener('click', sendMessage);
  userInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') sendMessage();
  });

  function appendMessage(text, role) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message', role);
    msgDiv.innerHTML = `<span class="text">${text}</span>`;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    userInput.value = '';

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      appendMessage(data.reply, 'assistant');
    } catch (err) {
      console.error(err);
      appendMessage('Desculpe, não consegui responder agora.', 'assistant');
    }
  }
});
