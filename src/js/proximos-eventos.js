// Local: /src/js/proximos-eventos.js - VERSÃO CORRIGIDA

// --- 1. IMPORTAÇÕES ESSENCIAIS ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/eventos.css";

// Componentes, Funções Úteis e Firebase
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";

// ## CORREÇÃO AQUI: Importando a função com o nome novo e correto ##
import { createEventListPageCard } from "/src/utils/helpers.js";

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

// --- 2. FUNÇÃO PRINCIPAL ---
async function initializeProximosEventos() {
  renderHeader();
  renderFooter();

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

    // ## CORREÇÃO AQUI: Usando a função com o nome novo e correto ##
    container.innerHTML = proximosEventos.map(createEventListPageCard).join("");
  } catch (error) {
    console.error("Erro ao buscar próximos eventos:", error);
    container.innerHTML =
      "<p>Não foi possível carregar os próximos eventos.</p>";
  }
}

// --- 3. EXECUÇÃO ---
initializeProximosEventos();
