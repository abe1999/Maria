// /assets/js/pastorais-list.js

document.addEventListener("DOMContentLoaded", function () {
  const pastoraisGridContainer = document.querySelector(".pastorais-grid");

  // Função para criar o card (só é usada aqui)
  function createPastoralCard(pastoral) {
    return `
      <div class="pastoral-card">
        <img src="${pastoral.image}" alt="${pastoral.name}">
        <div class="card-content">
          <h3>${pastoral.name}</h3>
          <p>${pastoral.excerpt}</p>
          <a href="/pages/pastoral-detalhe.html?id=${pastoral.id}" class="btn-secondary">Saiba Mais</a>
        </div>
      </div>
    `;
  }

  // Função para carregar os dados
  async function loadPastorais() {
    // A verificação `if (pastoraisGridContainer)` não é mais estritamente necessária,
    // pois este script só rodará na página correta, mas é bom manter por segurança.
    if (!pastoraisGridContainer) return;

    try {
      const response = await fetch("/data/pastorais.json");
      const pastorais = await response.json();

      pastoraisGridContainer.innerHTML = pastorais
        .map(createPastoralCard)
        .join("");
    } catch (error) {
      console.error("Falha ao carregar lista de pastorais:", error);
    }
  }

  loadPastorais();
});
