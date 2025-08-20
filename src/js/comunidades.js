// Local do arquivo: src/pages/comunidades.js

// --- 1. Importações Essenciais ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/comunidades.css";

import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import comunidades from "../data/comunidades.json";

// --- 2. Lógica da Página ---

// Função para criar o card de comunidade
function createComunidadeCard(comunidade) {
  return `
    <div class="comunidade-card-avatar">
      <a href="/src/pages/comunidade-detalhe.html?id=${comunidade.id}">
        <div class="avatar-container">
          <img src="${comunidade.imagemCard}" alt="Foto da ${comunidade.nome}">
        </div>
        <h3 class="comunidade-titulo">${comunidade.nome}</h3>
        <p class="comunidade-descricao">${comunidade.resumo}</p>
      </a>
    </div>
  `;
}

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
