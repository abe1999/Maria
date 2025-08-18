// Local: /src/components/homepage-loader.js

// Usa o caminho absoluto para consistência total
import allEvents from "/src/data/eventos.json";

function formatarData(dateString) {
  const data = new Date(dateString + "T00:00:00");
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function createHomeEventCard(evento) {
  const linkURL = evento.link.startsWith("http")
    ? evento.link
    : `${import.meta.env.BASE_URL}${evento.link.replace(/^\//, "")}`;

  const imageURL = evento.image.startsWith("http")
    ? evento.image
    : `${import.meta.env.BASE_URL}${evento.image.replace(/^\//, "")}`;

  return `
    <div class="home-news-card">
      <a href="${linkURL}">
        <img src="${imageURL}" alt="Imagem do evento: ${evento.title}">
        <div class="home-news-content">
          <span class="home-news-date">${formatarData(evento.date)}</span>
          <h3 class="home-news-title">${evento.title}</h3>
        </div>
      </a>
    </div>
  `;
}

// A função é exportada corretamente
export function initializeHomepageNews() {
  const homeNewsContainer = document.getElementById("latest-news-grid");
  if (!homeNewsContainer) return;

  let eventosParaExibir = [...allEvents];
  eventosParaExibir.sort((a, b) => new Date(b.date) - new Date(a.date));

  const latestEvents = eventosParaExibir.slice(0, 3);
  homeNewsContainer.innerHTML = latestEvents.map(createHomeEventCard).join("");
}
