export function formatarData(timestamp) {
  if (!timestamp || typeof timestamp.toDate !== "function") {
    return "Data indisponível";
  }
  const data = timestamp.toDate();
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function buildSafeURL(path) {
  if (!path || typeof path !== "string") return "";
  if (path.startsWith("http")) {
    return path;
  }
  // Apenas garante que o caminho comece com uma barra
  return `/${path.replace(/^\//, "")}`;
}

// =======================================================================
// ## FUNÇÃO PARA OS CARDS DA HOMEPAGE -  ##
// =======================================================================
export function createHomepageNewsCard(evento) {
  const linkURL = buildSafeURL(`src/pages/evento-detalhe.html?id=${evento.id}`);
  const imageURL = buildSafeURL(
    evento.imageUrl || "/img/placeholder-evento.jpg"
  );
  const dataFormatada = formatarData(evento.date);

  return `
    <div class="home-news-card">
      <a href="${linkURL}">
        <img src="${imageURL}" alt="Imagem do evento: ${evento.title}" class="home-news-image">
        <div class="home-news-content">
          <p class="home-news-date">${dataFormatada}</p>
          <h3 class="home-news-title">${evento.title}</h3>
        </div>
      </a>
    </div>
  `;
}

export function createEventListPageCard(evento) {
  const linkURL = buildSafeURL(`src/pages/evento-detalhe.html?id=${evento.id}`);
  const imageURL = buildSafeURL(
    evento.imageUrl || "/img/placeholder-evento.jpg"
  );
  const dataFormatada = formatarData(evento.date);

  return `
    <a href="${linkURL}" class="evento-card">
        ${
          evento.imageUrl
            ? `<img src="${imageURL}" alt="${evento.title}" class="evento-card__image">`
            : ""
        }
        <div class="evento-conteudo">
            <span class="evento-data">${dataFormatada}</span>
            <h3 class="evento-titulo">${evento.title}</h3>
            <p class="evento-resumo">${evento.excerpt || ""}</p>
            <span class="btn">Ver Mais</span>
        </div>
    </a>
  `;
}
