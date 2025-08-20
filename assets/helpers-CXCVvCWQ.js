function o(t){return!t||typeof t.toDate!="function"?"Data indisponível":t.toDate().toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}function s(t){const e=t.link||`/src/pages/evento-detalhe.html?id=${t.id}`,n=a(e),i=t.image||"/img/placeholder-evento.jpg",r=a(i);return`
    <div class="home-news-card">
      <a href="${n}">
        <img src="${r}" alt="Imagem do evento: ${t.title}">
        <div class="home-news-content">
          <p class="home-news-date">${o(t.date)}</p>
          <h3 class="home-news-title">${t.title}</h3>
        </div>
      </a>
    </div>
  `}function a(t){return!t||typeof t!="string"?"":t.startsWith("http")?t:`/${t.replace(/^\//,"")}`}export{a as b,s as c,o as f};
