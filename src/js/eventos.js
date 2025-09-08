// Local: /src/js/eventos.js - VERSÃO FINAL

// --- 1. IMPORTAÇÕES ESSENCIAIS ---
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
import { createEventListPageCard } from "/src/utils/helpers.js"; // Import está correto!

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
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "eventos"),
      where("date", "<", hoje),
      orderBy("date", "desc")
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

    // ===============================================
    // ## CORREÇÃO FINAL AQUI ##
    // ===============================================
    eventosPageContainer.innerHTML = eventosParaExibir
      .map(createEventListPageCard) // Usando o nome correto da função
      .join("");
  } catch (error) {
    console.error("Erro ao buscar eventos do Firebase:", error);
    eventosPageContainer.innerHTML =
      "<p>Ocorreu um erro ao carregar os eventos. Por favor, tente novamente mais tarde.</p>";
  }
}

// --- 3. EXECUÇÃO ---
document.addEventListener("DOMContentLoaded", initializePage);
