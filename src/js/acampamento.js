// --- Importações Essenciais (COM CAMINHOS CORRIGIDOS) ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/acampamento.css";

import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
// Assumindo que seu JSON está na raiz do projeto, fora de 'src'
import acampamentos from "../data/acampamentos.json";

// --- O resto do seu código (já estava correto) ---

/** Cria o HTML para um único botão de aba */
function createTabButton(acampamento, index) {
  const isActive = index === 0 ? "active" : "";
  const nomeAba = acampamento.nome.replace("Acampamento ", "");
  return `
    <button class="tab-link ${isActive} ${acampamento.classeCor}" data-tab="tab-${acampamento.id}">
      ${nomeAba}
    </button>
  `;
}

/** Cria o HTML para um único painel de conteúdo */
function createContentPanel(acampamento, index) {
  const isActive = index === 0 ? "active" : "";
  const fotosHTML = acampamento.fotos
    .map((fotoUrl) => {
      const imageURL = fotoUrl.startsWith("http")
        ? fotoUrl
        : `${import.meta.env.BASE_URL}${fotoUrl.replace(/^\//, "")}`;
      return `<img src="${imageURL}" alt="Foto do ${acampamento.nome}" />`;
    })
    .join("");

  let videoHTML = "";
  if (acampamento.video && acampamento.video.url) {
    let videoUrl = acampamento.video.url;
    if (!videoUrl.startsWith("http")) {
      videoUrl = `${import.meta.env.BASE_URL}${videoUrl.replace(/^\//, "")}`;
    }
    const videoTag = videoUrl.includes("youtube.com")
      ? `<iframe src="${videoUrl}" title="Depoimento de Campista" frameborder="0" allowfullscreen></iframe>`
      : `<video src="${videoUrl}" controls width="100%"></video>`;
    videoHTML = `
      <div class="video-depoimento">
        <h4>${acampamento.video.titulo}</h4>
        ${videoTag}
      </div>
    `;
  }

  const detalhesHTML = acampamento.detalhes
    .map(
      (detalhe) =>
        `<li><i class="${detalhe.icone}"></i> <strong>${detalhe.titulo}:</strong> ${detalhe.valor}</li>`
    )
    .join("");

  return `
    <div class="tab-content ${isActive}" id="tab-${acampamento.id}">
      <div class="content-column">
        <div class="acampamento-titulo ${acampamento.classeCor}">
          <i class="${acampamento.icone}"></i>
          <h3>${acampamento.nome}</h3>
        </div>
        <p class="descricao">${acampamento.descricao}</p>
        <ul class="acampamento-detalhes">${detalhesHTML}</ul>
        ${videoHTML}
      </div>
      <div class="photos-column">
        ${fotosHTML}
      </div>
    </div>
  `;
}

/** Adiciona os listeners de clique para as abas funcionarem */
function addTabListeners() {
  const tabLinks = document.querySelectorAll(".tab-link");
  if (tabLinks.length === 0) return;

  tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelector(".tab-link.active")?.classList.remove("active");
      document.querySelector(".tab-content.active")?.classList.remove("active");
      link.classList.add("active");
      document.getElementById(link.dataset.tab).classList.add("active");
    });
  });
}

// --- 3. FUNÇÃO PRINCIPAL ---
function initializePage() {
  renderHeader();
  renderFooter();

  const tabsContainer = document.getElementById("acampamento-tabs");
  const contentContainer = document.getElementById("acampamento-content");

  if (
    !tabsContainer ||
    !contentContainer ||
    !acampamentos ||
    acampamentos.length === 0
  )
    return;

  tabsContainer.innerHTML = acampamentos.map(createTabButton).join("");
  contentContainer.innerHTML = acampamentos.map(createContentPanel).join("");
  addTabListeners();
}

// --- 4. EXECUÇÃO ---
document.addEventListener("DOMContentLoaded", initializePage);
