document.getElementById('search-btn').addEventListener('click', function () {
    var cep = document.getElementById('cep').value;

    if (cep.includes('-')) {
        alert("Por favor, digite o CEP sem o traço '-'");
        return;
    }

    if (cep.length === 8 && !isNaN(cep)) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                const resultDiv = document.getElementById('cep-result');
                resultDiv.style.display = 'block';

                if (data.erro) {
                    resultDiv.innerHTML = "<p>CEP não encontrado.</p>";
                    return;
                }

                // Lista de unidades por bairro ou cidade
                const unidades = [
                    {
                        nome: "Unidade Hospital Geral De Pirajussara",
                        endereco: "Av.Ibirama, nº 1214 - Parque Industrial Daci - Taboão da Serra-SP",
                        bairro: "Parque Industrial Daci",
                        cidade: "Taboão da Serra"
                    },
                    {
                        nome: "Unidade AmorSaúde",
                        endereco: "Rua Cassio M Boy, nº 47 - Cercado Grande - Embu das Artes-SP",
                        bairro: "Cercado Grande",
                        cidade: "Embu das Artes"
                    },
                    {
                        nome: "Unidade Hospital São Francisco",
                        endereco:"Rua Prof. Manoel José Pedroso, nº 701 - Parque Bahia - Cotia-SP",
                        bairro: "Parque Bahia",
                        cidade: "Cotia"
                    },
                    {
                        nome: "",
                        endereco: "Rua das Flores, 100 - Taboão da Serra",
                        cidade: "Taboão da Serra"
                    },
                    {
                        nome: "Unidade Embu das Artes",
                        endereco: "Av. Brasil, 50 - Embu das Artes",
                        cidade: "Embu das Artes"
                    },
                    {
                        nome: "Unidade Cotia",
                        endereco: "Rua Central, 77 - Cotia",
                        cidade: "Cotia"
                    },
                    {
                        nome: "Unidade Itapecerica da Serra",
                        endereco: "Av. das Palmeiras, 200 - Itapecerica da Serra",
                        cidade: "Itapecerica da Serra"
                    }
                ];

                const unidadeEncontrada = unidades.find(u =>
                    u.bairro?.toLowerCase() === data.bairro.toLowerCase() ||
                    u.cidade.toLowerCase() === data.localidade.toLowerCase()
                );

                if (unidadeEncontrada) {
                    resultDiv.innerHTML = `
                        <p><strong>Endereço:</strong> ${data.logradouro}, ${data.bairro}</p>
                        <p><strong>Cidade:</strong> ${data.localidade} - ${data.uf}</p>
                        <p><strong>Unidade próxima:</strong> ${unidadeEncontrada.nome} - ${unidadeEncontrada.endereco}</p>
                    `;
                } else {
                    resultDiv.innerHTML = `
                        <p><strong>Endereço:</strong> ${data.logradouro}, ${data.bairro}</p>
                        <p><strong>Cidade:</strong> ${data.localidade} - ${data.uf}</p>
                        <p>Não encontramos uma unidade próxima cadastrada para essa região.</p>
                    `;
                }
            })
            .catch(error => {
                console.error("Erro na requisição:", error);
                document.getElementById('cep-result').innerHTML = "<p>Erro ao buscar o CEP.</p>";
            });
    } else {
        alert("Digite um CEP válido com 8 números.");
    }
});
