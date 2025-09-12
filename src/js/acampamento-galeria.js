// Local: /src/js/acampamento-galeria.js

// --- 1. IMPORTAÇÕES ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
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

    const allCamps = querySnapshot.docs.map((doc) => doc.data());

    // A "mágica" de agrupar por ano
    const campsByYear = allCamps.reduce((acc, camp) => {
      const year = camp.year;
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(camp);
      return acc;
    }, {});

    galleryContainer.innerHTML = ""; // Limpa a mensagem "Carregando..."

    // Pega os anos e os ordena do mais novo para o mais antigo
    const sortedYears = Object.keys(campsByYear).sort((a, b) => b - a);

    // Renderiza cada seção de ano
    for (const year of sortedYears) {
      galleryContainer.innerHTML += `<h2 class="year-title">${year}</h2>`;
      let yearHtml = '<div class="album-grid">';

      campsByYear[year].forEach((camp) => {
        const imageUrl = camp.mainImageUrl || "/img/placeholder-evento.jpg";
        const albumUrl = camp.driveAlbumUrl || "#";

        yearHtml += `
                    <a href="${albumUrl}" class="album-card" target="_blank" rel="noopener noreferrer">
                        <img src="${imageUrl}" alt="Cartaz do ${camp.type} ${
          camp.year
        }" class="album-card__image">
                        <div class="album-card__content">
                            <h3 class="album-card__title">Acampamento ${
                              camp.type
                            }</h3>
                            <p class="album-card__theme">${camp.theme || ""}</p>
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

loadAlbumGallery();
