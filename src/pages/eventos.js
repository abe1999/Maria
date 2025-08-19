// --- 1. IMPORTAÇÕES ESSENCIAIS ---
// Organizei todas as importações no topo do arquivo.

// Funções do Firebase
import { db } from "/src/firebase-config.js";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

// Nossos Componentes e Funções Úteis
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import { createEventCard } from "/src/utils/helpers.js"; // Importando nossa função central

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

  eventosPageContainer.innerHTML = "<p>Carregando eventos...</p>";

  try {
    const q = query(collection(db, "eventos"), orderBy("date", "desc"));

    const querySnapshot = await getDocs(q);

    const eventosParaExibir = querySnapshot.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
      };
    });

    if (eventosParaExibir.length === 0) {
      eventosPageContainer.innerHTML =
        "<p>Nenhum evento encontrado no momento.</p>";
      return;
    }

    // ✨ AQUI ESTÁ A CORREÇÃO: Usamos o nome da função que importamos
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
