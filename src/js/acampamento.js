// Local: /src/js/acampamento.js - VERSÃO FINAL E LIMPA

// --- 1. IMPORTAÇÕES ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/acampamento.css";

import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import { app } from "../firebase-config.js";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";

const db = getFirestore(app);

// --- 2. MONTAGEM DA PÁGINA ---
renderHeader();
renderFooter();

// --- 3. LÓGICA DA AGENDA ---
const agendaContainer = document.getElementById("agenda-acampamentos-grid");

async function loadAgenda() {
  if (!agendaContainer) return;
  try {
    const q = query(
      collection(db, "acampamentos"),
      where("status", "in", ["Próximo", "Inscrições Abertas"]),
      orderBy("startDate", "asc"),
      limit(3)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      agendaContainer.innerHTML =
        "<p>Nenhum acampamento agendado no momento. Fique atento para novidades!</p>";
      return;
    }

    agendaContainer.innerHTML = querySnapshot.docs
      .map((doc) => {
        const camp = doc.data();
        const imageUrl = camp.mainImageUrl || "/img/placeholder-evento.jpg";
        const startDate = camp.startDate
          .toDate()
          .toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
        const endDate = camp.endDate
          .toDate()
          .toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          });

        const campTitle = `${camp.edition}º Acampamento de ${camp.type}`;

        return `
                <div class="camp-card">
                    <img src="${imageUrl}" alt="Cartaz do ${campTitle}" class="camp-card-image">
                    <div class="camp-card-content">
                        <span class="camp-card-status">${camp.status}</span>
                        <h3 class="camp-card-title">${campTitle}</h3>
                        <p class="camp-card-date">${startDate} a ${endDate}</p>
                    </div>
                </div>
            `;
      })
      .join("");
  } catch (error) {
    console.error("Erro ao carregar agenda de acampamentos:", error);
    agendaContainer.innerHTML =
      "<p>Não foi possível carregar a agenda. Tente novamente mais tarde.</p>";
  }
}

// Inicia o carregamento da agenda
loadAgenda();
