// Local do arquivo: src/pages/pastoral-detail.js - VERSÃO COMPLETA E CORRIGIDA

// --- 1. IMPORTAÇÕES ESSENCIAIS ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/pastoral-detalhe.css"; // Crie este arquivo para os estilos de detalhe

// Componentes e Dados
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import pastorais from "..//data/pastorais.json"; // Carrega os dados diretamente

// --- 2. FUNÇÃO PRINCIPAL ---
function initializePage() {
  // Renderiza os componentes reutilizáveis
  renderHeader();
  renderFooter();

  const pastoralDetailContainer = document.querySelector(
    ".pastoral-detail-page"
  );
  if (!pastoralDetailContainer) return;

  // Pega o ID da pastoral pela URL
  const params = new URLSearchParams(window.location.search);
  const pastoralId = params.get("id");
  if (!pastoralId) return;

  // Encontra a pastoral correta nos dados já importados
  const pastoral = pastorais.find((p) => p.id === pastoralId);

  // Se não encontrar a pastoral, para a execução
  if (!pastoral) {
    pastoralDetailContainer.innerHTML = "<h1>Pastoral não encontrada</h1>";
    return;
  }

  // Lógica inteligente para o caminho da IMAGEM
  const imageURL = pastoral.image.startsWith("http")
    ? pastoral.image // Se for externa, usa como está
    : `${import.meta.env.BASE_URL}${pastoral.image.replace(/^\//, "")}`; // Se for interna, monta o caminho

  // Preenche todos os campos da página de detalhe
  document.title = `${pastoral.name} - Paróquia N. S. de Nazaré`;
  document.getElementById("pastoral-name").textContent = pastoral.name;
  document.getElementById("pastoral-image").src = imageURL; // Usa a URL corrigida
  document.getElementById("pastoral-objective").textContent =
    pastoral.objective;
  document.getElementById("pastoral-how-to-participate").textContent =
    pastoral.howToParticipate;
  document.getElementById("pastoral-who-can-join").textContent =
    pastoral.whoCanJoin;
  document.getElementById("pastoral-schedule").textContent = pastoral.schedule;
  document.getElementById("coordinator-name").textContent =
    pastoral.coordinator.name;
  document.getElementById("coordinator-contact").textContent =
    pastoral.coordinator.contact;

  const activitiesList = document.getElementById("pastoral-activities");
  activitiesList.innerHTML = pastoral.activities
    .map((activity) => `<li>${activity}</li>`)
    .join("");
}

// --- 3. EXECUÇÃO ---
document.addEventListener("DOMContentLoaded", initializePage);
