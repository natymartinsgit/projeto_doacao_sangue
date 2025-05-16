app.post('/agenda', async (req, res) => {
    const { access_token } = req.body;
  
    oauth2Client.setCredentials({ access_token }); // ativa o token
  
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
  
    const evento = {
      summary: 'Doação de Sangue',
      location: 'Hospital Municipal de Taboão',
      description: 'Agendamento feito pelo site Doe Sangue',
      start: {
        dateTime: '2025-05-15T10:00:00-03:00',
        timeZone: 'America/Sao_Paulo',
      },
      end: {
        dateTime: '2025-05-15T10:30:00-03:00',
        timeZone: 'America/Sao_Paulo',
      },
    };
  
    try {
      const response = await calendar.events.insert({
        calendarId: 'primary', // calendário principal
        requestBody: evento,
      });
  
      res.json({ message: 'Evento criado com sucesso!', eventLink: response.data.htmlLink });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar evento', detalhes: error.message });
    }
  });
  