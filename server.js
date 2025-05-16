const express = require('express');
const path = require('path');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Configurações OAuth2
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Servir arquivos estáticos do front-end
app.use(express.static(path.join(__dirname, 'front-end')));

// Página inicial (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'front-end', 'html', 'index.html'));
});

// Rota para login com Google
app.get('/auth/google', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/calendar'
    ]
  });

  res.redirect(url);
});

// Rota de callback do Google após login
app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Aqui você pode salvar os dados do usuário, se quiser
    res.send(`
      <h2>Login com Google realizado com sucesso!</h2>
      <pre>${JSON.stringify(tokens, null, 2)}</pre>
    `);
  } catch (error) {
    console.error('Erro ao autenticar com Google:', error);
    res.status(500).send('Erro durante a autenticação.');
  }
});

// Inicializa o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
