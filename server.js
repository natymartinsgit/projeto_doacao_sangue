const express = require('express');
const app = express();
const path = require('path');

// Servir arquivos estáticos (CSS, JS, imagens) da pasta 'front-end'
app.use(express.static(path.join(__dirname, 'front-end')));

// Rota para carregar o index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'html', 'index.html'));
});

// Definir a porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
