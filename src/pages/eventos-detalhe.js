// Local do arquivo: /src/pages/eventos-detalhe.js - VERSÃO CORRIGIDA E PADRONIZADA

// --- 1. IMPORTAÇÕES ESSENCIAIS ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/pages/eventos-detalhe.css"; // Crie este arquivo para os estilos desta página

import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import allEvents from "/src/data/eventos.json"; // Carrega os dados diretamente da pasta 'src'

// --- 2. FUNÇÕES AUXILIARES ---
function formatarData(dateString) {
  const data = new Date(dateString + "T00:00:00");
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

/** Constrói uma URL segura, considerando o BASE_URL para caminhos internos */
function buildSafeURL(path) {
  if (!path || typeof path !== "string") return "";
  return path.startsWith("http")
    ? path
    : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

// --- 3. FUNÇÃO PRINCIPAL ---
function initializePage() {
  renderHeader();
  renderFooter();

  const container = document.querySelector(".event-detail-page");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const eventIdStr = params.get("id"); // O ID da URL vem como string
  if (!eventIdStr) return;

  // O ID no JSON pode ser número ou string, então comparamos de forma flexível (==)
  const eventItem = allEvents.find((item) => item.id === eventIdStr);

  if (!eventItem) {
    container.innerHTML = `<h1>Evento não encontrado.</h1>`;
    return;
  }

  // --- Preenche a página com os dados ---
  document.title = `${eventItem.title} - Paróquia N. S. de Nazaré`;
  document.getElementById("event-title-full").textContent = eventItem.title;
  document.getElementById(
    "event-date-full"
  ).textContent = `Data: ${formatarData(eventItem.date)}`;
  document.getElementById("event-text-full").innerHTML = eventItem.fullText;

  // Corrige o caminho da imagem principal
  const mainImage = document.getElementById("event-image-large");
  mainImage.src = buildSafeURL(eventItem.image);
  mainImage.alt = eventItem.title;

  // Monta a galeria de fotos com caminhos corrigidos
  if (eventItem.galleryImages && eventItem.galleryImages.length > 0) {
    document.getElementById("event-gallery-container").style.display = "block";
    const gallery = document.getElementById("event-gallery");
    gallery.innerHTML = eventItem.galleryImages
      .map((imgUrl) => {
        const safeImgUrl = buildSafeURL(imgUrl);
        return `<a href="${safeImgUrl}" target="_blank" title="Clique para ampliar"><img src="${safeImgUrl}" alt="Foto da galeria do evento"></a>`;
      })
      .join("");
  }

  // Monta o link do Google Drive com caminho corrigido
  if (eventItem.driveLink) {
    const driveContainer = document.getElementById(
      "event-drive-link-container"
    );
    driveContainer.innerHTML = `<a href="${buildSafeURL(
      eventItem.driveLink
    )}" class="btn" target="_blank">Ver álbum completo</a>`;
  }
}

// --- 4. EXECUÇÃO ---
document.addEventListener("DOMContentLoaded", initializePage);
