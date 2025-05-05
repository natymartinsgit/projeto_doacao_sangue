document.addEventListener('DOMContentLoaded', () => {
    // Inicializa FullCalendar
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      selectable: true,
      dateClick: info => openModal(info.dateStr)
    });
    calendar.render();
  
    // Google Identity init
    google.accounts.id.initialize({
      client_id: 'SEU_CLIENT_ID.apps.googleusercontent.com',
      callback: handleCredentialResponse,
      auto_select: false
    });
  
    // Modal controls
    const modal      = document.getElementById('agendamento-modal');
    const closeBtn   = document.querySelector('.modal-close');
    const body       = document.getElementById('modal-body');
    let selectedDate;
  
    closeBtn.onclick = () => modal.style.display = 'none';
  
    // Abre o modal e decide o que renderizar
    function openModal(dateStr) {
      selectedDate = dateStr;
      modal.style.display = 'flex';
      body.innerHTML = ''; // limpa
  
      // Se não estiver logado
      if (!window.GOOGLE_USER) {
        body.innerHTML = `
          <p>Para agendar em <strong>${dateStr}</strong>, faça login:</p>
          <div id="g_id_signin"></div>
        `;
        google.accounts.id.renderButton(
          document.getElementById('g_id_signin'),
          { theme: 'outline', size: 'large' }
        );
      } else {
        // Já está logado, mostra formulário
        const user = window.GOOGLE_USER;
        body.innerHTML = `
          <p>Você escolheu: <strong>${dateStr}</strong></p>
          <label>Nome</label>
          <input type="text" id="nome" value="${user.name}" readonly />
          <label>Email</label>
          <input type="email" id="email" value="${user.email}" readonly />
          <button id="confirm-btn" class="btn-hero" style="width:100%;">Confirmar Agendamento</button>
        `;
        document.getElementById('confirm-btn').onclick = confirmBooking;
      }
    }
  
    // Callback do Google Identity
    function handleCredentialResponse(response) {
      // decodifica o JWT pra extrair nome/email
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      window.GOOGLE_USER = { name: payload.name, email: payload.email };
  
      // fecha e re-abre modal para mostrar formulário
      modal.style.display = 'none';
      openModal(selectedDate);
    }
  
    // Confirma e insere no Google Calendar
    async function confirmBooking() {
      modal.style.display = 'none';
      // inicializa gapi se necessário
      await gapi.client.init({
        apiKey: 'SUA_API_KEY',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        clientId: 'SEU_CLIENT_ID.apps.googleusercontent.com',
        scope: 'https://www.googleapis.com/auth/calendar.events'
      });
      // faz sign-in silencioso
      const auth = gapi.auth2.getAuthInstance();
      if (!auth.isSignedIn.get()) await auth.signIn({ ux_mode: 'popup', prompt: 'consent' });
      
      const event = {
        summary: 'Doação de Sangue',
        description: `Agendamento de ${window.GOOGLE_USER.name}`,
        start: { date: selectedDate },
        end:   { date: selectedDate }
      };
      try {
        await gapi.client.calendar.events.insert({
          calendarId: 'primary', resource: event
        });
        alert(`✔ Agendado para ${selectedDate}`);
      } catch (e) {
        console.error(e);
        alert('❌ Erro ao agendar. Tente novamente.');
      }
    }
  });
  