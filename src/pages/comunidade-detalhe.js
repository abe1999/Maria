// Local do arquivo: src/pages/comunidade-detalhe.js

// --- Importações de Estilos ---
// Caminhos corrigidos com um único "../"
import "../styles/base/reset.css";
import "../styles/base/variables.css";
import "../styles/base/typography.css";
import "../styles/components/header.css";
import "../styles/components/footer.css";
import "../styles/pages/comunidade-detalhe.css";

// --- Importações de Módulos e Dados ---
// Caminhos corrigidos com um único "../"
import { renderHeader } from "../components/Header.js";
import { renderFooter } from "../components/Footer.js";
import comunidades from "../data/comunidades.json";

// --- Lógica da Página ---
function renderDetalhesComunidade() {
  const params = new URLSearchParams(window.location.search);
  const comunidadeId = params.get("id");
  const container = document.querySelector("main");
  if (!container) return;

  const comunidade = comunidades.find((c) => c.id === comunidadeId);

  if (!comunidade) {
    container.innerHTML = `<p class="container">Comunidade não encontrada.</p>`;
    return;
  }

  document.title = `${comunidade.nome} | Paróquia N. S. de Nazaré`;

  const horariosHtml = comunidade.horarios
    .map((h) => `<li><strong>${h.dia}:</strong> ${h.descricao}</li>`)
    .join("");

  const pageHtml = `
    <div class="hero-comunidade" style="background-image: url('${
      import.meta.env.BASE_URL
    }${comunidade.imagemBanner}')">
      <h1 id="comunidade-nome">${comunidade.nome}</h1>
    </div>

    <div class="conteudo-principal container">
      <div class="info-coluna">
        <h2>Sobre a Comunidade</h2>
        <p id="comunidade-historia">${comunidade.historia}</p>

        <h2>Horários de Missas e Celebrações</h2>
        <ul id="comunidade-horarios">${horariosHtml}</ul>
      </div>

      <div class="mapa-coluna">
        <h2>Como Chegar</h2>
        <p id="comunidade-endereco">${comunidade.endereco}</p>
        <div class="map-responsive">
          <iframe
            id="comunidade-mapa"
            src="${comunidade.googleMapsUrl}"
            width="600"
            height="450"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  `;

  container.innerHTML = pageHtml;
}

// --- Execução ---
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  renderDetalhesComunidade();
});
