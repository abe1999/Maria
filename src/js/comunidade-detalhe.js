// --- Importações Essenciais ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/pages/comunidade-detalhe.css";

import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import comunidades from "../data/comunidades.json";

// --- Lógica da Página ---

function renderDetalhesComunidade() {
  const params = new URLSearchParams(window.location.search);
  const comunidadeId = params.get("id");
  const container = document.querySelector("main");
  if (!container) return;

  const comunidade = comunidades.find((c) => c.id === comunidadeId);

  if (!comunidade) {
    // ... (código de erro) ...
    return;
  }

  document.title = `${comunidade.nome} | Paróquia N. S. de Nazaré`;

  const horariosHtml = comunidade.horarios
    .map(
      (h) => `
    <li><strong>${h.dia}:</strong> ${h.descricao}</li>
  `
    )
    .join("");

  // --- NOVO: Lógica para renderizar as redes sociais ---
  let redesSociaisHtml = ""; // Começa vazio
  if (
    comunidade.redesSociais &&
    Object.keys(comunidade.redesSociais).length > 0
  ) {
    // Mapeia o nome da rede para o ícone do Font Awesome
    const iconMap = {
      instagram: "fa-instagram",
      facebook: "fa-facebook",
      whatsapp: "fa-whatsapp",
      youtube: "fa-youtube", // Adicione mais se precisar
    };

    redesSociaisHtml = Object.entries(comunidade.redesSociais)
      .map(([rede, url]) => {
        const iconClass = iconMap[rede];
        if (!url || !iconClass) return ""; // Ignora se não tiver URL ou ícone
        return `
          <li>
            <a href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${rede}">
              <i class="fa-brands ${iconClass}"></i>
            </a>
          </li>
        `;
      })
      .join("");
  }
  // --- FIM DA NOVA LÓGICA ---

  const pageHtml = `
    <div class="hero-comunidade" style="background-image: url('${
      comunidade.imagemBanner
    }')">
      <h1 id="comunidade-nome">${comunidade.nome}</h1>
    </div>

    <div class="conteudo-principal container">
      <div class="info-coluna">
        <h2>Sobre a Comunidade</h2>
        <p id="comunidade-historia">${comunidade.historia}</p>

        <h2>Horários de Missas e Celebrações</h2>
        <ul id="comunidade-horarios">${horariosHtml}</ul>
        
        ${
          redesSociaisHtml
            ? `
          <h2>Nossas Redes</h2>
          <ul class="redes-sociais-lista">${redesSociaisHtml}</ul>
        `
            : ""
        }
        
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
