// --- Importações Essenciais ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/pages/comunidades.css";

// Componentes de Header e Footer
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";

// Nossos dados do novo JSON
import comunidades from "/src/data/comunidades.json";

// --- Lógica da Página ---

function renderComunidades() {
  const container = document.getElementById("comunidades-grid");
  if (!container) return;

  // O HTML gerado agora usa "imagemCard" e "resumo"
  const html = comunidades
    .map(
      (comunidade) => `
      <div class="comunidade-card-avatar">
        <a href="/pages/comunidade.html?id=${comunidade.id}">
          <div class="avatar-container">
            <img src="${comunidade.imagemCard}" alt="Foto da ${comunidade.nome}">
          </div>
          <h3 class="comunidade-titulo">${comunidade.nome}</h3>
          <p class="comunidade-descricao">${comunidade.resumo}</p>
        </a>
      </div>
    `
    )
    .join("");

  container.innerHTML = html;
}

// --- Execução ---
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderComunidades();
});
