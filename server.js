require('dotenv').config();
const express = require('express');
const app = express(); // 👈 inicializa o express aqui em cima ✅

const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const mongoose = require('./db'); // Importa a conexão com o MongoDB
const Unidade = require('./models/Unidade'); // Modelo Unidade
const authEmailRoute = require('./routes/authEmail');
app.use('/auth-email', express.json(), authEmailRoute);
const disponibilidadeRoute = require('./routes/disponibilidade'); // depois do express
app.use('/disponibilidade', disponibilidadeRoute); // registra a rota aqui

// Configuração da sessão e inicialização
app.use(session({ secret: 'secreta', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

// Estratégia de login com Google
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI
}, (accessToken, refreshToken, profile, done) => {
  return done(null, { profile, accessToken });
}));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Página inicial
app.get('/', (req, res) => {
  res.send(`
    <h1>Bem-vinda, Naty!</h1>
    <a href="/auth/google">Fazer login com Google</a>
  `);
});

// Rota para autenticação com Google
app.get('/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar']
}));

// Callback após login com Google
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  res.redirect('/dashboard');
});

// Página de dashboard com formulário de agendamento
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');

  // Consultar unidades de coleta do banco
  Unidade.find().then(unidades => {
    let unidadesOptions = unidades.map(unidade => `
      <option value="${unidade.nome}">${unidade.nome}</option>
    `).join('');

    res.send(`
      <h1>Bem-vinda, ${req.user.profile.displayName}!</h1>

      <!-- Mini Calendário -->
      <div id="calendar"></div>

      <form action="/create-event" method="POST">
        <label>Nome completo:</label><br>
        <input type="text" name="nome" required><br><br>

        <label>Idade:</label><br>
        <input type="number" name="idade" min="16" max="69" required><br><br>

        <label>Unidade de Coleta:</label><br>
        <select name="unidade" required>
          <option value="">-- Selecione uma unidade --</option>
          ${unidadesOptions}
        </select><br><br>

        <label>Data e hora da chegada:</label><br>
        <input type="datetime-local" name="startTime" required><br><br>

        <p><small>🩸 A doação leva em média 1 hora. Esse tempo pode variar de acordo com o tipo de doação e com o seu corpo.</small></p>

        <button type="submit">Agendar Doação</button>
      </form>
      <br><a href="/logout">Sair</a>

      <!-- Scripts do FullCalendar -->
      <script src="https://cdn.jsdelivr.net/npm/@fullcalendar/core/main.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@fullcalendar/daygrid/main.min.js"></script>
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          var calendarEl = document.getElementById('calendar');
          var calendar = new FullCalendar.Calendar(calendarEl, {
            plugins: [ 'dayGrid' ],
            initialView: 'dayGridMonth',
            events: '/disponibilidade/${unidades[0]._id}', // Aqui passamos o ID da primeira unidade (ou uma variável para o cliente)
            dateClick: function(info) {
              alert('Data clicada: ' + info.dateStr);
            }
          });
          calendar.render();
        });
      </script>
    `);
  }).catch(err => {
    res.send('Erro ao carregar unidades');
  });
});

// Rota para criar o evento no Google Calendar
app.post('/create-event', async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect('/');

  const { nome, idade, unidade, startTime } = req.body;

  const startDate = new Date(startTime);
  const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Duração de 1 hora

  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: req.user.accessToken });

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  const descricao = `
Doação de sangue agendada.

👤 Paciente: ${nome}
🎂 Idade: ${idade}
🏥 Unidade: ${unidade}

🕒 Chegada: ${startDate.toLocaleString('pt-BR')}
⏳ Duração estimada: 1 hora

📌 Observações:
- Levar documento com foto.
- Estar alimentado e hidratado.
- Evitar jejum e uso de bebidas alcoólicas.

📣 A duração da doação pode variar dependendo do tipo de coleta e das condições do doador.
  `;

  const event = {
    summary: `Doação de sangue - ${nome}`,
    location: unidade,
    description: descricao.trim(),
    start: {
      dateTime: startDate.toISOString(),
      timeZone: 'America/Sao_Paulo',
    },
    end: {
      dateTime: endDate.toISOString(),
      timeZone: 'America/Sao_Paulo',
    },
  };

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event
    });

    res.send(`
      <p>✅ Agendamento criado com sucesso!</p>
      <a href="${response.data.htmlLink}" target="_blank">Ver no Google Calendar</a><br><br>
      <a href="/dashboard">Voltar</a>
    `);
  } catch (err) {
    console.error('Erro ao criar evento:', err);
    res.send('❌ Erro ao criar o evento no Google Calendar.');
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.logout(() => res.redirect('/'));
});

// Iniciar servidor
app.listen(3000, () => {
  console.log('🚀 Servidor rodando em http://localhost:3000');
});
