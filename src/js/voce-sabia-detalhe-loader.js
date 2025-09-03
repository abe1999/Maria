// Local: /src/js/voce-sabia-detalhe-loader.js - VERSÃO CORRIGIDA

// --- 1. IMPORTAÇÕES GLOBAIS ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/voce-sabia-detalhe.css";
import "/src/styles/components/article.css";

import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";

// =========================================================
// ## BLOCO DO FIREBASE CORRIGIDO ##
// Importamos APENAS as ferramentas que esta página precisa: doc e getDoc
// =========================================================
import { app } from "/src/firebase-config.js";
import { getFirestore, doc, getDoc } from "firebase/firestore";
const db = getFirestore(app);

// --- 2. MONTAGEM DA PÁGINA ---
renderHeader();
renderFooter();

// --- 3. LÓGICA ESPECÍFICA DA PÁGINA ---
const articleContainer = document.getElementById("sabia-article-container");

async function loadSingleVoceSabia() {
  if (!articleContainer) return;

  try {
    const params = new URLSearchParams(window.location.search);
    const docId = params.get("id");

    if (!docId) {
      articleContainer.innerHTML = "<h1>Item não especificado.</h1>";
      return;
    }

    const docRef = doc(db, "voceSabia", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      document.title = `${data.title} - Você Sabia?`;

      let imageHtml = data.imageUrl
        ? `<img src="${data.imageUrl}" alt="${data.title}" class="article-image">`
        : "";

      articleContainer.innerHTML = `
          <p class="article-category">${data.category}</p>
          <h1 class="article-title">${data.title}</h1>
          ${imageHtml}
          <div class="article-content">
              ${data.content}
          </div>
        `;
    } else {
      articleContainer.innerHTML = "<h1>Conteúdo não encontrado.</h1>";
    }
  } catch (error) {
    console.error("Erro ao carregar item:", error);
    articleContainer.innerHTML =
      "<h1>Ocorreu um erro ao carregar o conteúdo.</h1>";
  }
}

// Inicia o carregamento do conteúdo específico da página
loadSingleVoceSabia();
