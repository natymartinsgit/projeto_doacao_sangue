// Adiciona elementos decorativos dinamicamente
function addDecorations() {
    // Adiciona corações flutuantes
    const sections = document.querySelectorAll('.secao');
    sections.forEach(section => {
      for (let i = 0; i < 3; i++) {
        const heart = document.createElement('i');
        heart.className = 'fas fa-heart icone-flutuante heart';
        heart.style.left = `${Math.random() * 80 + 10}%`;
        heart.style.top = `${Math.random() * 80 + 10}%`;
        heart.style.animationDelay = `${Math.random() * 5}s`;
        section.appendChild(heart);
      }
    });
  
    // Adiciona bolhas animadas no hero
    const hero = document.querySelector('.hero');
    const bolhasContainer = document.createElement('div');
    bolhasContainer.className = 'bolhas';
    
    for (let i = 0; i < 10; i++) {
      const bolha = document.createElement('div');
      bolha.className = 'bolha';
      bolhasContainer.appendChild(bolha);
    }
    
    hero.appendChild(bolhasContainer);
  }
  
  // Efeito de digitação no título
  function typeWriter(element, text, i = 0) {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(() => typeWriter(element, text, i), 100);
    }
  }
  
  // Inicia todos os efeitos quando o DOM estiver carregado
  document.addEventListener('DOMContentLoaded', () => {
    addDecorations();
    
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
      const text = heroTitle.textContent;
      heroTitle.textContent = '';
      typeWriter(heroTitle, text);
    }
    
    // Efeito parallax
    window.addEventListener('scroll', () => {
      const scrollPosition = window.pageYOffset;
      const hero = document.querySelector('.hero');
      if (hero) {
        hero.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    });
  });
  document.getElementById("pesquisar").addEventListener("click", function() {
    let cep = document.getElementById("cep").value;

    // Validar se o CEP está no formato correto (somente números)
    if (!/^\d{5}-\d{3}$/.test(cep)) {
        alert("Por favor, digite um CEP válido no formato 00000-000.");
        return;
    }

    // Remover o traço do CEP
    cep = cep.replace("-", "");

    // Chama a função que vai buscar os dados da API
    buscarUnidades(cep);
});

function buscarUnidades(cep) {
    fetch(`/backend/cep.php?cep=${cep}`)
        .then(response => response.json())
        .then(data => {
            // Limpar a lista de unidades
            let unidadesList = document.getElementById("unidades");
            unidadesList.innerHTML = "";

            if (data.unidades && data.unidades.length > 0) {
                // Se encontrar unidades de coleta, mostra na tela
                data.unidades.forEach(unidade => {
                    let listItem = document.createElement("li");
                    listItem.textContent = unidade;
                    unidadesList.appendChild(listItem);
                });
            } else {
                // Caso não encontre, informa ao usuário
                unidadesList.innerHTML = "<li>Não encontramos unidades próximas para o seu CEP.</li>";
            }
        })
        .catch(error => {
            alert("Erro ao buscar informações.");
        });
}
