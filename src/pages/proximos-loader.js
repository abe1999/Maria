// Local do arquivo: /src/pages/proximos-eventos.js - VERSÃO CORRIGIDA

// --- 1. IMPORTAÇÕES ESSENCIAIS ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/eventos.css"; // Reutilizando o CSS de eventos

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

// Reutilizando a função de card da página de eventos para manter consistência
function createEventCard(evento) {
  const linkURL = evento.link.startsWith("http")
    ? evento.link
    : `${import.meta.env.BASE_URL}${evento.link.replace(/^\//, "")}`;
  const imageURL = evento.image.startsWith("http")
    ? evento.image
    : `${import.meta.env.BASE_URL}${evento.image.replace(/^\//, "")}`;

  return `
    <a href="${linkURL}" class="evento-card">
      <img src="${imageURL}" alt="Imagem do evento: ${evento.title}">
      <div class="evento-conteudo">
        <p class="evento-data">${formatarData(evento.date)}</p>
        <h3 class="evento-titulo">${evento.title}</h3>
        <p class="evento-resumo">${evento.excerpt}</p>
        <span class="btn">Ver Mais</span>
      </div>
    </a>
  `;
}

// --- 3. FUNÇÃO PRINCIPAL ---
function initializePage() {
  renderHeader();
  renderFooter();

  const container = document.getElementById("proximos-eventos-grid");
  if (!container) return;

  // A SUA LÓGICA DE FILTRO, INTEGRADA CORRETAMENTE:
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eventosFuturos = allEvents.filter(
    (evento) => new Date(evento.date) >= hoje
  );
  eventosFuturos.sort((a, b) => new Date(a.date) - new Date(b.date));

  if (eventosFuturos.length > 0) {
    container.innerHTML = eventosFuturos.map(createEventCard).join("");
  } else {
    container.innerHTML = `<p style="text-align: center; font-size: 1.1rem; color: var(--color-text-light);">Nenhum evento futuro agendado no momento. Volte em breve!</p>`;
  }
}

// --- 4. EXECUÇÃO ---
document.addEventListener("DOMContentLoaded", initializePage);
