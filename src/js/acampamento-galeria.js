// Local: /src/js/acampamento-galeria.js - VERSÃO CORRIGIDA

// --- 1. IMPORTAÇÕES ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/components/buttons.css";
import "/src/styles/pages/acampamento-galeria.css";

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
} from "firebase/firestore";

const db = getFirestore(app);

// --- 2. MONTAGEM DA PÁGINA ---
renderHeader();
renderFooter();

// --- 3. LÓGICA DA GALERIA ---
// ## CORREÇÃO AQUI: A declaração da variável estava faltando ou no lugar errado ##
const galleryContainer = document.getElementById("album-gallery-container");

async function loadAlbumGallery() {
  if (!galleryContainer) return;
  try {
    const q = query(
      collection(db, "acampamentos"),
      where("status", "==", "Realizado"),
      orderBy("startDate", "desc")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      galleryContainer.innerHTML =
        "<p>Nenhum álbum de acampamento realizado encontrado.</p>";
      return;
    }

    const allCamps = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const campsByYear = allCamps.reduce((acc, camp) => {
      const year = camp.startDate.toDate().getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(camp);
      return acc;
    }, {});

    galleryContainer.innerHTML = "";

    const sortedYears = Object.keys(campsByYear).sort((a, b) => b - a);

    for (const year of sortedYears) {
      galleryContainer.innerHTML += `<h2 class="year-title">${year}</h2>`;
      let yearHtml = '<div class="album-grid">';

      campsByYear[year].forEach((camp) => {
        const imageUrl = camp.mainImageUrl || "/img/placeholder-evento.jpg";
        const albumUrl = camp.driveAlbumUrl || "#";
        const campTitle = `${camp.edition}º Acampamento ${camp.type}`;

        // ==============================================================
        // ## LÓGICA DA DATA CORRIGIDA AQUI ##
        // ==============================================================
        let campDateRange = "";
        // Verifica se as datas existem antes de formatar
        if (camp.startDate && camp.endDate) {
          // Define o novo formato numérico
          const options = {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            timeZone: "UTC",
          };

          const startDateFormatted = camp.startDate
            .toDate()
            .toLocaleDateString("pt-BR", options);
          const endDateFormatted = camp.endDate
            .toDate()
            .toLocaleDateString("pt-BR", options);

          // Une as duas datas
          campDateRange = `${startDateFormatted} a ${endDateFormatted}`;
        }
        // ==============================================================

        yearHtml += `
                    <a href="${albumUrl}" class="album-card" target="_blank" rel="noopener noreferrer">
                        <img src="${imageUrl}" alt="Cartaz do ${campTitle}" class="album-card__image">
                        <div class="album-card__content">
                            <h3 class="album-card__title">${campTitle}</h3>
                            <p class="album-card__theme">${camp.theme || ""}</p>
                            <p class="album-card__date">${campDateRange}</p>
                        </div>
                    </a>
                `;
      });

      yearHtml += "</div>";
      galleryContainer.innerHTML += yearHtml;
    }
  } catch (error) {
    console.error("Erro ao carregar galeria:", error);
    galleryContainer.innerHTML =
      "<p>Ocorreu um erro ao carregar os álbuns.</p>";
  }
}

// Inicia o carregamento
loadAlbumGallery();
