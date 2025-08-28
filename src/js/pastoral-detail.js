// Local do arquivo: src/pages/pastoral-detail.js - VERSÃO COMPLETA E CORRIGIDA

// --- 1. IMPORTAÇÕES ESSENCIAIS ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/pastoral-detalhe.css";

// Componentes e Dados
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import pastorais from "/src/data/pastorais.json"; // Corrigi o caminho para /src/

// --- 2. FUNÇÃO PRINCIPAL ---
function initializePage() {
  renderHeader();
  renderFooter();

  const pastoralDetailContainer = document.querySelector(
    ".pastoral-detail-page"
  );
  if (!pastoralDetailContainer) return;

  const params = new URLSearchParams(window.location.search);
  const pastoralId = params.get("id");
  if (!pastoralId) return;

  const pastoral = pastorais.find((p) => p.id === pastoralId);

  if (!pastoral) {
    pastoralDetailContainer.innerHTML = "<h1>Pastoral não encontrada</h1>";
    return;
  }

  // --- PREENCHIMENTO DOS DADOS NA PÁGINA ---

  document.title = `${pastoral.name} - Paróquia N. S. de Nazaré`;
  document.getElementById("pastoral-name").textContent = pastoral.name;
  document.getElementById("pastoral-image").src = pastoral.image.startsWith(
    "http"
  )
    ? pastoral.image
    : `${import.meta.env.BASE_URL}${pastoral.image.replace(/^\//, "")}`;
  document.getElementById("pastoral-objective").textContent =
    pastoral.objective;
  document.getElementById("pastoral-schedule").textContent = pastoral.schedule;

  // --- CORREÇÃO 1: Lógica para "Como Participar" (Objeto) ---
  const howToParticipateEl = document.getElementById(
    "pastoral-how-to-participate"
  );
  let participateHtml = `<p>${pastoral.howToParticipate.steps}</p>`;
  participateHtml += "<ul>";
  participateHtml += pastoral.howToParticipate.documents
    .map((doc) => `<li>${doc}</li>`)
    .join("");
  participateHtml += "</ul>";
  howToParticipateEl.innerHTML = participateHtml;

  // --- CORREÇÃO 2: Lógica para "Quem Pode Fazer Parte" (Array de Objetos) ---
  const whoCanJoinEl = document.getElementById("pastoral-who-can-join");
  whoCanJoinEl.innerHTML = pastoral.whoCanJoin
    .map(
      (etapa) => `
      <div class="etapa-item">
        <strong>${etapa.stage}:</strong>
        <p>${etapa.requirement}</p>
      </div>
    `
    )
    .join("");

  // --- CORREÇÃO 3: Lógica para Contato do Coordenador (Array) ---
  document.getElementById("coordinator-name").textContent =
    pastoral.coordinator.name;
  const coordinatorContactEl = document.getElementById("coordinator-contact");
  coordinatorContactEl.innerHTML = pastoral.coordinator.contact
    .map((contato) => `<p>${contato}</p>`)
    .join("");

  // --- NOVO: Lógica para exibir "Como fazer parte da Equipe" ---
  const howToJoinTeamEl = document.getElementById("pastoral-how-to-join-team");
  if (pastoral.howToJoinTeam && howToJoinTeamEl) {
    let joinTeamHtml = `<h3>${pastoral.howToJoinTeam.title}</h3>`;
    joinTeamHtml += "<ul>";
    joinTeamHtml += pastoral.howToJoinTeam.requirements
      .map((req) => `<li>${req}</li>`)
      .join("");
    joinTeamHtml += "</ul>";
    howToJoinTeamEl.innerHTML = joinTeamHtml;
  }

  // --- Lógica para Atividades (Já estava correta) ---
  const activitiesList = document.getElementById("pastoral-activities");
  activitiesList.innerHTML = pastoral.activities
    .map((activity) => `<li>${activity}</li>`)
    .join("");
}

// --- 3. EXECUÇÃO ---
document.addEventListener("DOMContentLoaded", initializePage);
