
// Configuração do Login com Google
function handleGoogleAuth() {
    // Inicializa o botão de login do Google
    google.accounts.id.initialize({
        client_id: 'SEU_CLIENT_ID_AQUI',
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true
    });
    
    // Renderiza o botão
    google.accounts.id.renderButton(
        document.getElementById('google-login'),
        { 
            theme: 'outline', 
            size: 'medium',
            text: 'continue_with',
            shape: 'pill'
        }
    );
    
    // Renderiza o botão na seção de agendamento
    google.accounts.id.renderButton(
        document.getElementById('google-login-agendamento'),
        { 
            theme: 'filled_blue', 
            size: 'large',
            text: 'signin_with',
            shape: 'pill',
            width: '300'
        }
    );
}

// Manipula a resposta de credenciais
function handleCredentialResponse(response) {
    console.log('Credencial JWT:', response.credential);
    
    // Aqui você enviaria o token para seu backend para validação
    // fetch('/api/auth/google', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ token: response.credential })
    // })
    
    // Por enquanto, vamos apenas armazenar localmente
    localStorage.setItem('google_token', response.credential);
    
    // Atualiza a UI
    updateAuthUI();
}

// Atualiza a UI com base no estado de autenticação
function updateAuthUI() {
    const token = localStorage.getItem('google_token');
    const loginElements = document.querySelectorAll('.login-required');
    
    if (token) {
        // Usuário logado
        loginElements.forEach(el => {
            el.innerHTML = `
                <p>Você está logado e pode agendar sua doação</p>
                <button id="logout-google" class="btn-logout">Sair <i class="fas fa-sign-out-alt"></i></button>
            `;
        });
        
        // Adiciona evento de logout
        document.getElementById('logout-google').addEventListener('click', logoutGoogle);
        
        // Carrega o calendário
        loadCalendar();
    } else {
        // Usuário não logado
        loginElements.forEach(el => {
            el.innerHTML = `
                <p>Para agendar, faça login com sua conta Google</p>
                <div id="google-login-agendamento"></div>
            `;
            // Re-renderiza o botão
            google.accounts.id.renderButton(
                el.querySelector('#google-login-agendamento'),
                { 
                    theme: 'filled_blue', 
                    size: 'large',
                    text: 'signin_with',
                    shape: 'pill',
                    width: '300'
                }
            );
        });
    }
}

// Função de logout
function logoutGoogle() {
    localStorage.removeItem('google_token');
    updateAuthUI();
    google.accounts.id.prompt();
}

// Carrega o calendário (simulação)
function loadCalendar() {
    const calendarPlaceholder = document.getElementById('calendar');
    const loadingElement = document.querySelector('.calendar-loading');
    
    // Simula carregamento
    setTimeout(() => {
        loadingElement.style.display = 'none';
        calendarPlaceholder.innerHTML = `
            <div class="calendar-mockup">
                <p>Calendário do Google será integrado aqui</p>
                <p>Datas disponíveis serão mostradas</p>
                <div class="mockup-slot available">
                    <span>10:00 - 11:00</span>
                    <button class="btn-slot">Agendar</button>
                </div>
                <div class="mockup-slot available">
                    <span>11:00 - 12:00</span>
                    <button class="btn-slot">Agendar</button>
                </div>
                <div class="mockup-slot booked">
                    <span>13:00 - 14:00</span>
                    <span>Indisponível</span>
                </div>
            </div>
        `;
    }, 1500);
}

// Inicializa quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    handleGoogleAuth();
    updateAuthUI();
});
let userEmail = "";

function handleCredentialResponse(response) {
  const data = jwt_decode(response.credential);
  userEmail = data.email;
  console.log("Usuário logado:", userEmail);
  
  // Mostra o formulário de agendamento
  document.getElementById('agendamento-form').style.display = 'block';
}
