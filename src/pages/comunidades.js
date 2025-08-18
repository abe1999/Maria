// Local do arquivo: src/pages/comunidades.js

// --- 1. Importações Essenciais ---
import "../styles/base/reset.css";
import "../styles/base/variables.css";
import "../styles/base/typography.css";
import "../styles/components/header.css";
import "../styles/components/footer.css";
import "../styles/components/page-header.css";
import "../styles/pages/comunidades.css";

import { renderHeader } from "../components/Header.js";
import { renderFooter } from "../components/Footer.js";
import comunidades from "../data/comunidades.json";

// --- 2. Lógica da Página ---

// Função para criar o card de comunidade
function createComunidadeCard(comunidade) {
  return `
    <div class="comunidade-card-avatar">
      <a href="${import.meta.env.BASE_URL}pages/comunidade-detalhe.html?id=${
    comunidade.id
  }">
        <div class="avatar-container">
          <img src="${comunidade.imagemCard}" alt="Foto da ${comunidade.nome}">
        </div>
        <h3 class="comunidade-titulo">${comunidade.nome}</h3>
        <p class="comunidade-descricao">${comunidade.resumo}</p>
      </a>
    </div>
  `;
}

// Função para renderizar as comunidades
function renderComunidades() {
  const container = document.getElementById("comunidades-grid");
  if (!container) return;

  const html = comunidades.map(createComunidadeCard).join("");

  container.innerHTML = html;
}

// --- 3. Execução ---
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderComunidades();
});
