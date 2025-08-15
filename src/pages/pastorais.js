// Local do arquivo: src/pages/pastorais.js

// --- 1. Importações de Estilos ---
// Caminhos relativos para os estilos
import "../styles/base/reset.css";
import "../styles/base/variables.css";
import "../styles/base/typography.css";
import "../styles/components/header.css";
import "../styles/components/footer.css";
import "../styles/pages/pastorais.css";

// --- 2. Importações de Módulos e Dados ---
import { renderHeader } from "../components/Header.js";
import { renderFooter } from "../components/Footer.js";
import pastorais from "../data/pastorais.json";

// --- 3. Funções de Renderização ---

function createPastoralCard(pastoral) {
  return `
      <div class="pastoral-card">
        <img src="${pastoral.image}" alt="${pastoral.name}">
        <div class="card-content">
          <h3>${pastoral.name}</h3>
          <p>${pastoral.excerpt}</p>
          <a href="${import.meta.env.BASE_URL}pages/pastoral-detalhe.html?id=${
    pastoral.id
  }" class="btn-secondary">Saiba Mais</a>
        </div>
      </div>
    `;
}

// Função para preencher a página de detalhes
function renderPastoralDetalhe() {
  const params = new URLSearchParams(window.location.search);
  const pastoralId = params.get("id");

  const pastoral = pastorais.find((p) => p.id === pastoralId);

  if (pastoral) {
    document.title = `${pastoral.name} - Paróquia N. S. de Nazaré`;

    // Preenche os elementos do HTML com os dados do JSON
    document.getElementById("pastoral-name").textContent = pastoral.name;
    document.getElementById("pastoral-image").src = pastoral.image;
    document.getElementById("pastoral-objective").textContent =
      pastoral.objective;
    document.getElementById("pastoral-how-to-participate").textContent =
      pastoral.howToParticipate;
    document.getElementById("pastoral-who-can-join").textContent =
      pastoral.whoCanJoin;
    document.getElementById("pastoral-schedule").textContent =
      pastoral.schedule;
    document.getElementById("coordinator-name").textContent =
      pastoral.coordinator.name;
    document.getElementById("coordinator-contact").textContent =
      pastoral.coordinator.contact;

    const activitiesList = document.getElementById("pastoral-activities");
    activitiesList.innerHTML = pastoral.activities
      .map((activity) => `<li>${activity}</li>`)
      .join("");
  } else {
    // Caso a pastoral não seja encontrada
    const container = document.querySelector(".pastoral-detail-page");
    if (container) {
      container.innerHTML = `<p class="container">Pastoral não encontrada.</p>`;
    }
  }
}

// --- 4. Inicialização da Página ---
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();

  const isDetalhePage = document.querySelector(".pastoral-detail-page");
  if (isDetalhePage) {
    // Carrega os estilos e dados da página de detalhes
    import("../styles/pages/pastoral-detalhe.css");
    renderPastoralDetalhe();
  } else {
    // Carrega os estilos e dados da página de listagem
    const pastoraisGridContainer = document.querySelector(".pastorais-grid");
    if (pastoraisGridContainer) {
      pastoraisGridContainer.innerHTML = pastorais
        .map(createPastoralCard)
        .join("");
    }
  }
});
