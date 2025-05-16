const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config(); // Carrega as variáveis do .env

const app = express();

// Verifica se as variáveis de ambiente estão definidas
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.REDIRECT_URI) {
  console.error("❌ Erro: Variáveis de ambiente não definidas corretamente no .env");
  process.exit(1);
}

// Criação do cliente OAuth2 com as credenciais
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Página inicial com botão de login
app.get('/', (req, res) => {
  res.send(`
    <h1>Login com Google</h1>
    <a href="/auth/google">
      <button style="padding: 10px 20px; font-size: 16px;">Entrar com Google</button>
    </a>
  `);
});

// 1. Rota para redirecionar o usuário ao login com o Google
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

// 2. Rota que recebe o código de autorização após login
app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Aqui você pode salvar os tokens no banco de dados ou sessão
    res.send(`
      <h2>Login com Google realizado com sucesso!</h2>
      <p>Você pode usar o token de acesso para integrar com a API do Google Calendar.</p>
      <pre>${JSON.stringify(tokens, null, 2)}</pre>
    `);
  } catch (error) {
    console.error('❌ Erro ao autenticar:', error);
    res.status(500).send('Erro durante o login com Google');
  }
});

// Inicializa o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
