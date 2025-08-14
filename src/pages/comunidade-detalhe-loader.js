document.addEventListener("DOMContentLoaded", () => {
  // 1. Pega o 'id' da comunidade da URL da página
  const params = new URLSearchParams(window.location.search);
  const comunidadeId = params.get("id");

  // Se não houver ID na URL, para tudo.
  if (!comunidadeId) {
    console.error("ERRO: ID da comunidade não encontrado na URL.");
    return;
  }

  // 2. Busca o arquivo JSON
  const caminhoDoJson = "../data/comunidades.json"; // Caminho relativo para "subir" da pasta 'pages'

  fetch(caminhoDoJson)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Erro ao buscar o arquivo (${response.status})`);
      }
      return response.json();
    })
    .then((comunidades) => {
      // 3. Encontra a comunidade específica dentro do JSON
      const comunidade = comunidades.find((c) => c.id === comunidadeId);

      // Se não encontrar uma comunidade com aquele ID, para tudo.
      if (!comunidade) {
        console.error(
          `ERRO: Nenhuma comunidade encontrada com o ID '${comunidadeId}'.`
        );
        return;
      }

      // 4. Preenche a página HTML com os dados da comunidade encontrada
      document.title = `${comunidade.nome} | Paróquia N. S. de Nazaré`;
      document.getElementById("comunidade-nome").textContent = comunidade.nome;
      document.getElementById("comunidade-historia").textContent =
        comunidade.historia;
      document.getElementById("comunidade-endereco").textContent =
        comunidade.endereco;
      document.getElementById("comunidade-mapa").src = comunidade.googleMapsUrl;

      const heroElement = document.getElementById("hero-comunidade");
      if (heroElement) {
        // Caminho relativo para a imagem do banner
        heroElement.style.backgroundImage = `url('..${comunidade.imagemBanner}')`;
      }

      const horariosList = document.getElementById("comunidade-horarios");
      let horariosHTML = "";
      comunidade.horarios.forEach((h) => {
        horariosHTML += `<li><strong>${h.dia}:</strong> ${h.descricao}</li>`;
      });
      horariosList.innerHTML = horariosHTML;
    })
    .catch((error) => {
      console.error("ERRO GRAVE ao carregar detalhes da comunidade:", error);
    });
});
