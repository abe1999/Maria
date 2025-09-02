// Local: /src/js/eventos.js - VERSÃO CORRIGIDA E APRIMORADA

// --- 1. IMPORTAÇÕES ESSENCIAIS ---
// Funções do Firebase (adicionamos a função 'where' para o filtro)
import { app } from "/src/firebase-config.js";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
const db = getFirestore(app);

// Nossos Componentes e Funções Úteis
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import { createEventCard } from "/src/utils/helpers.js";

// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/eventos.css";

// --- 2. FUNÇÃO PRINCIPAL ---
async function initializePage() {
  renderHeader();
  renderFooter();

  const eventosPageContainer = document.querySelector(".eventos-grid");
  if (!eventosPageContainer) return;

  eventosPageContainer.innerHTML = "<p>Carregando arquivo de eventos...</p>";

  try {
    // Pega a data de hoje para fazer a comparação
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Consulta simplificada: busca TODOS os eventos com data no passado
    const q = query(
      collection(db, "eventos"),
      where("date", "<", hoje),
      orderBy("date", "desc") // Ordena dos mais recentes para os mais antigos
    );

    const querySnapshot = await getDocs(q);

    const eventosParaExibir = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (eventosParaExibir.length === 0) {
      eventosPageContainer.innerHTML =
        "<p>Nenhum evento anterior encontrado no arquivo.</p>";
      return;
    }

    eventosPageContainer.innerHTML = eventosParaExibir
      .map(createEventCard)
      .join("");
  } catch (error) {
    console.error("Erro ao buscar eventos do Firebase:", error);
    eventosPageContainer.innerHTML =
      "<p>Ocorreu um erro ao carregar os eventos. Por favor, tente novamente mais tarde.</p>";
  }
}

// --- 3. EXECUÇÃO ---
document.addEventListener("DOMContentLoaded", initializePage);
