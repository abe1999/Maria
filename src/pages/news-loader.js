// src/pages/news-loader.js - VERSÃO FINAL E CORRIGIDA

import allEvents from "/src/data/eventos.json";

// --- FUNÇÕES AUXILIARES ---

function formatarData(dateString) {
  const data = new Date(dateString + "T00:00:00");
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// Função para criar o card completo (para a página de eventos)
function createFullEventCard(evento) {
  return `
    <a href="${evento.link}" class="evento-card">
      <img src="${evento.image}" alt="Imagem do evento: ${evento.title}">
      <div class="evento-conteudo">
        <p class="evento-data">${formatarData(evento.date)}</p>
        <h3 class="evento-titulo">${evento.title}</h3>
        <p class="evento-resumo">${evento.excerpt}</p>
        <span class="btn">Ver Mais</span>
      </div>
    </a>
  `;
}

// Função para criar o card da homepage (usando seu CSS mais novo)
function createHomeEventCard(evento) {
  return `
    <div class="home-news-card">
      <a href="${evento.link}">
        <img src="${evento.image}" alt="Imagem do evento: ${evento.title}">
        <div class="home-news-content">
          <span class="home-news-date">${formatarData(evento.date)}</span>
          <h3 class="home-news-title">${evento.title}</h3>
        </div>
      </a>
    </div>
  `;
}

// --- FUNÇÃO PRINCIPAL (APENAS UMA VEZ) ---

export function initializeNewsLoader() {
  const homeNewsContainer = document.getElementById("latest-news-grid");
  const eventosPageContainer = document.querySelector(".eventos-grid");

  if (!homeNewsContainer && !eventosPageContainer) {
    return;
  }

  try {
    let eventosParaExibir = [...allEvents];
    eventosParaExibir.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Lógica para a HOMEPAGE
    if (homeNewsContainer) {
      const latestEvents = eventosParaExibir.slice(0, 3);
      homeNewsContainer.innerHTML = latestEvents
        .map(createHomeEventCard)
        .join("");
    }

    // Lógica para a PÁGINA DE EVENTOS
    if (eventosPageContainer) {
      // (aqui vai a lógica de filtros que você tinha, se precisar)
      eventosPageContainer.innerHTML = eventosParaExibir
        .map(createFullEventCard)
        .join("");
    }
  } catch (error) {
    console.error("Falha ao carregar eventos:", error);
    const errorMessage =
      "<p>Não foi possível carregar os eventos no momento.</p>";
    if (homeNewsContainer) homeNewsContainer.innerHTML = errorMessage;
    if (eventosPageContainer) eventosPageContainer.innerHTML = errorMessage;
  }
}
