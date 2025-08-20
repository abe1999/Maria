// --- 1. IMPORTAÇÕES ESSENCIAIS ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/eventos.css"; // Reutiliza o estilo da página de eventos

// Componentes, Funções Úteis e Firebase
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import { createEventCard } from "/src/utils/helpers.js";
import { db } from "/src/firebase-config.js";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

// --- 2. FUNÇÃO PRINCIPAL (Sua lógica de busca) ---
async function initializeProximosEventos() {
  const container = document.querySelector(".eventos-grid");
  if (!container) return;

  container.innerHTML = "<p>Carregando próximos eventos...</p>";

  try {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const q = query(
      collection(db, "eventos"),
      where("date", ">=", hoje),
      orderBy("date", "asc")
    );

    const querySnapshot = await getDocs(q);

    const proximosEventos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (proximosEventos.length === 0) {
      container.innerHTML =
        "<p>Nenhum evento futuro encontrado no momento.</p>";
      return;
    }

    container.innerHTML = proximosEventos.map(createEventCard).join("");
  } catch (error) {
    console.error("Erro ao buscar próximos eventos:", error);
    container.innerHTML =
      "<p>Não foi possível carregar os próximos eventos.</p>";
  }
}

// --- 3. EXECUÇÃO ---
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initializeProximosEventos(); // Chama a função principal
});
