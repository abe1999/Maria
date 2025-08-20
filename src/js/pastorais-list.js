// Local do arquivo: src/pages/pastorais.js - VERSÃO COM CORREÇÃO DE IMAGEM EXTERNA

// --- 1. Importações Essenciais ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/pastorais.css";

import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import pastorais from "../data/pastorais.json";

// --- 2. Lógica da Página ---

// Função única que executa tudo quando a página carrega
function initializePage() {
  // Renderiza os componentes reutilizáveis
  renderHeader();
  renderFooter();

  const pastoraisGridContainer = document.querySelector(".pastorais-grid");
  if (!pastoraisGridContainer) return;

  // Função interna para criar cada card
  function createPastoralCard(pastoral) {
    const detailURL = `${
      import.meta.env.BASE_URL
    }src/pages/pastoral-detalhe.html?id=${pastoral.id}`;

    // ===================================================================
    // LÓGICA INTELIGENTE PARA A IMAGEM: Só adiciona o prefixo se não for uma URL externa
    // ===================================================================
    const imageURL = pastoral.image.startsWith("http")
      ? pastoral.image // Se começar com 'http', usa a URL como está
      : `${import.meta.env.BASE_URL}${pastoral.image.replace(/^\//, "")}`; // Senão, monta o caminho completo

    return `
      <div class="pastoral-card">
        <img src="${imageURL}" alt="${pastoral.name}">
        <div class="card-content">
          <h3>${pastoral.name}</h3>
          <p>${pastoral.excerpt}</p>
          <a href="${detailURL}" class="btn-secondary">Saiba Mais</a>
        </div>
      </div>
    `;
  }

  // Gera o HTML dos cards e insere na página
  pastoraisGridContainer.innerHTML = pastorais.map(createPastoralCard).join("");
}

// --- 3. Execução ---
// Adiciona um único listener para executar a função principal
document.addEventListener("DOMContentLoaded", initializePage);
