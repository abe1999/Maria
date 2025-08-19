// Arquivo: src/utils/helpers.js

export function formatarData(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") {
    return "Data indisponível";
  }
  const data = timestamp.toDate();
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export function createEventCard(evento) {
  const link = evento.link || `/pages/evento-detalhe.html?id=${evento.id}`;
  const linkURL = buildSafeURL(link);

  const image = evento.image || "/img/placeholder-evento.jpg";
  const imageURL = buildSafeURL(image);

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

// ✨ FUNÇÃO ADICIONADA
export function buildSafeURL(path) {
  if (!path || typeof path !== "string") return "";
  return path.startsWith("http")
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
