// 1) Callback do Google Identity Services (GIS)
function handleCredentialResponse(response) {
  // response.credential é um ID Token (não é token de acesso!)
  const idToken = response.credential;

  console.log('ID Token recebido:', idToken);

  // Salva o token no localStorage (se quiser usar para saber que o usuário está logado)
  localStorage.setItem('google_token', idToken);

  // Depois de login, inicializa o gapi para usar a API do Calendar
  loadGapiClient();
}

// 2) Carrega e inicializa o gapi.client para Calendar API
function loadGapiClient() {
  gapi.load('client', async () => {
    await gapi.client.init({
      apiKey: 'AIzaSyCYrg4jmBmkWbwdmyc1BAF4klmhOso-d2w',
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
    });

    console.log('gapi.client para Google Calendar inicializado!');
  });
}
