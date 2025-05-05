// chat.js

// Função para buscar unidades de coleta pelo CEP
async function buscarUnidadesPorCep(cep) {
  const res = await fetch(`/backend/cep.php?cep=${cep}`);
  const data = await res.json();
  return data.unidades || [];
}

// Exemplo de como você pode chamar a função ao receber o CEP do usuário
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, 'user');
  userInput.value = '';

  if (text.match(/^\d{5}-\d{3}$/)) { // Verifica se o texto é um CEP válido
    const unidades = await buscarUnidadesPorCep(text);
    if (unidades.length > 0) {
      appendMessage(`Unidades de coleta para o CEP ${text}: ${unidades.join(', ')}`, 'assistant');
    } else {
      appendMessage(`Nenhuma unidade encontrada para o CEP ${text}.`, 'assistant');
    }
  } else {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      appendMessage(data.reply, 'assistant');
    } catch {
      appendMessage('Desculpe, não consegui responder agora.', 'assistant');
    }
  }
}
