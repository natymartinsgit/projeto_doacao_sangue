// Inicializa o FullCalendar
document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');
    
    if (!calendarEl) return;

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'pt-br',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [] // Aqui depois podemos puxar eventos reais se quiser!
    });

    calendar.render();

    // Esconde o carregando após renderizar
    const loading = document.querySelector('.calendar-loading');
    if (loading) loading.style.display = 'none';
});

// Função para inicializar integração com Google Calendar
function initCalendar() {
    const token = localStorage.getItem('google_token');
    if (!token) return;

    console.log('Usuário autenticado. Calendário pronto.');
}

// Função para agendar evento no Google Calendar
function agendar() {
    const data = document.getElementById('data').value;
    const hora = document.getElementById('hora').value;

    if (!data || !hora) {
        alert('Por favor, preencha a data e hora!');
        return;
    }

    // Carrega a API do Google e autentica o usuário
    gapi.load('client:auth2', () => {
        gapi.client.init({
            clientId: '776208409554-jg554bl8klbb6t051nfbia00a3dp5hpo.apps.googleusercontent.com',
            discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
            scope: "https://www.googleapis.com/auth/calendar.events"
        }).then(() => {
            const authInstance = gapi.auth2.getAuthInstance();

            if (!authInstance.isSignedIn.get()) {
                return authInstance.signIn();
            }
        }).then(() => {
            const event = {
                summary: 'Doação de Sangue',
                location: 'Unidade de Coleta',
                description: 'Agendamento feito via Doe Sangue',
                start: {
                    dateTime: `${data}T${hora}:00`,
                    timeZone: 'America/Sao_Paulo',
                },
                end: {
                    dateTime: `${data}T${hora}:30`,
                    timeZone: 'America/Sao_Paulo',
                }
            };

            return gapi.client.calendar.events.insert({
                calendarId: 'primary',
                resource: event
            });
        }).then((response) => {
            if (response && response.status === 200) {
                alert('Agendamento feito com sucesso no seu Google Calendar!');
                console.log('Evento criado:', response.result);
            } else {
                alert('Falha ao agendar.');
            }
        }).catch(error => {
            console.error('Erro no agendamento:', error);
            alert('Erro ao agendar, tente novamente.');
        });
    });
}

// Inicializa o calendário se já estiver logado
if (localStorage.getItem('google_token')) {
    initCalendar();
}
