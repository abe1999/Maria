// Local: /src/js/evento-detalhe.js - VERSÃO FINAL "MINI-MAESTRO"

// --- 1. IMPORTAÇÕES GLOBAIS E DA PÁGINA ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/article.css";
import "/src/styles/components/buttons.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/evento-detalhe.css";

// Componentes e Funções
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import { formatarData, buildSafeURL } from "/src/utils/helpers.js";

// Firebase
import { app } from "../firebase-config.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore(app);

// --- 2. MONTAGEM DA PÁGINA ---
// Agora este arquivo monta a "moldura" da página
renderHeader();
renderFooter();

// --- 3. LÓGICA ESPECÍFICA DA PÁGINA ---
async function initializePage() {
  const articleContainer = document.getElementById("article-main-content");
  const extraContainer = document.getElementById("event-extra-content");
  if (!articleContainer || !extraContainer) return;

  try {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");
    if (!eventId) {
      /* ... */ return;
    }

    const docRef = doc(db, "eventos", eventId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const eventItem = { id: docSnap.id, ...docSnap.data() };

      // Preenche o conteúdo principal
      document.title = `${eventItem.title} - Paróquia N. S. de Nazaré`;
      const imageUrl = eventItem.imageUrl || "/img/placeholder-evento.jpg";
      articleContainer.innerHTML = `
        <h1 class="page-title">${eventItem.title}</h1>
        <p class="article-category">Data: ${formatarData(eventItem.date)}</p>
        <img src="${buildSafeURL(imageUrl)}" alt="${
        eventItem.title
      }" class="main-event-image">
        <div class="article-content">${eventItem.fullText}</div>
      `;

      extraContainer.innerHTML = "";

      // Lógica Condicional para Galeria
      if (eventItem.galleryUrls && eventItem.galleryUrls.length > 0) {
        let galleryHTML = `<div class="event-gallery-container"><h2>Galeria de Fotos</h2><div class="event-gallery">`;
        galleryHTML += eventItem.galleryUrls
          .map((imgUrl) => {
            const safeImgUrl = buildSafeURL(imgUrl);
            return `<a href="${safeImgUrl}" target="_blank"><img src="${safeImgUrl}" alt="Foto da galeria"></a>`;
          })
          .join("");
        galleryHTML += `</div></div>`;
        extraContainer.innerHTML += galleryHTML;
      }

      // Lógica Condicional para Link do Drive
      if (eventItem.link) {
        const driveHTML = `<div class="event-drive-link-container"><a href="${buildSafeURL(
          eventItem.link
        )}" class="btn btn-primary" target="_blank"><i class="fa-brands fa-google-drive"></i> Ver Álbum Completo</a></div>`;
        extraContainer.innerHTML += driveHTML;
      }
    } else {
      articleContainer.innerHTML = `<h1>Evento não encontrado.</h1>`;
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do evento:", error);
    articleContainer.innerHTML = `<h1>Ocorreu um erro ao carregar o evento.</h1>`;
  }
}

// Inicia a execução da lógica específica da página
initializePage();
