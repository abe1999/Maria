// --- 1. IMPORTAÇÕES ESSENCIAIS ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/eventos.css";

// Componentes e Dados
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import allEvents from "/src/data/eventos.json";

// --- 2. FUNÇÕES AUXILIARES ---
function formatarData(dateString) {
  const data = new Date(dateString + "T00:00:00");
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Local: seu arquivo eventos.js

// Local: seu arquivo eventos.js

function createFullEventCard(evento) {
  const linkURL = evento.link.startsWith("http")
    ? evento.link
    : `${import.meta.env.BASE_URL}${evento.link.replace(/^\//, "")}`;
  const imageURL = evento.image.startsWith("http")
    ? evento.image
    : `${import.meta.env.BASE_URL}${evento.image.replace(/^\//, "")}`;

  // AGORA USANDO AS CLASSES DO SEU latest-news.css
  return `
    <div class="home-news-card">
      <a href="${linkURL}">
        <img src="${imageURL}" alt="Imagem do evento: ${evento.title}">
        <div class="home-news-content">
          <p class="home-news-date">${formatarData(evento.date)}</p>
          <h3 class="home-news-title">${evento.title}</h3>
        </div>
      </a>
    </div>
  `;
}

// --- 3. FUNÇÃO PRINCIPAL ---
function initializePage() {
  renderHeader();
  renderFooter();
  const eventosPageContainer = document.querySelector(".eventos-grid");
  if (!eventosPageContainer) return;
  let eventosParaExibir = [...allEvents];
  eventosParaExibir.sort((a, b) => new Date(b.date) - new Date(a.date));
  eventosPageContainer.innerHTML = eventosParaExibir
    .map(createFullEventCard)
    .join("");
}

// --- 4. EXECUÇÃO ---
document.addEventListener("DOMContentLoaded", initializePage);
