// Local do arquivo: /src/pages/eventos-detalhe.js - VERSÃO FIREBASE

// --- 1. IMPORTAÇÕES ESSENCIAIS ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/pages/eventos-detalhe.css";

// Componentes, Funções Úteis e Firebase
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import { formatarData, buildSafeURL } from "/src/utils/helpers.js"; // Importa do arquivo central
import { db } from "/src/firebase-config.js";
import { doc, getDoc } from "firebase/firestore"; // Funções para buscar um único documento

// --- 2. FUNÇÃO PRINCIPAL ---
async function initializePage() {
  renderHeader();
  renderFooter();

  const container = document.querySelector(".event-detail-page");
  if (!container) return;

  try {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id"); // O ID do documento Firebase
    if (!eventId) {
      container.innerHTML = `<h1>ID do evento não fornecido.</h1>`;
      return;
    }

    // 1. Cria uma referência direta ao documento na coleção "eventos"
    const docRef = doc(db, "eventos", eventId);

    // 2. Busca os dados desse documento específico
    const docSnap = await getDoc(docRef);

    // 3. Verifica se o documento realmente existe no banco de dados
    if (docSnap.exists()) {
      const eventItem = { id: docSnap.id, ...docSnap.data() };

      // --- Preenche a página com os dados ---
      document.title = `${eventItem.title} - Paróquia N. S. de Nazaré`;
      document.getElementById("event-title-full").textContent = eventItem.title;
      document.getElementById(
        "event-date-full"
      ).textContent = `Data: ${formatarData(eventItem.date)}`;
      document.getElementById("event-text-full").innerHTML = eventItem.fullText;

      const mainImage = document.getElementById("event-image-large");
      mainImage.src = buildSafeURL(eventItem.image);
      mainImage.alt = eventItem.title;

      if (eventItem.galleryImages && eventItem.galleryImages.length > 0) {
        document.getElementById("event-gallery-container").style.display =
          "block";
        const gallery = document.getElementById("event-gallery");
        gallery.innerHTML = eventItem.galleryImages
          .map((imgUrl) => {
            const safeImgUrl = buildSafeURL(imgUrl);
            return `<a href="${safeImgUrl}" target="_blank" title="Clique para ampliar"><img src="${safeImgUrl}" alt="Foto da galeria do evento"></a>`;
          })
          .join("");
      }

      if (eventItem.driveLink) {
        const driveContainer = document.getElementById(
          "event-drive-link-container"
        );
        driveContainer.innerHTML = `<a href="${buildSafeURL(
          eventItem.driveLink
        )}" class="btn" target="_blank">Ver álbum completo</a>`;
      }
    } else {
      // Se o documento com esse ID não for encontrado
      console.log("Nenhum evento encontrado com o ID:", eventId);
      container.innerHTML = `<h1>Evento não encontrado.</h1>`;
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do evento:", error);
    container.innerHTML = `<h1>Ocorreu um erro ao carregar o evento.</h1>`;
  }
}

// --- 3. EXECUÇÃO ---
document.addEventListener("DOMContentLoaded", initializePage);
