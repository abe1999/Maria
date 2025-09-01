// Local: /src/js/voce-sabia-page-loader.js - VERSÃO FINAL CORRIGIDA

// --- 1. IMPORTAÇÕES GLOBAIS (O QUE ESTAVA FALTANDO) ---
// Importa os estilos essenciais para a página ter a aparência correta
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/voce-sabia.css"; // O CSS específico da página

// Importa as funções para renderizar o Header e o Footer
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";

// Importa as ferramentas do Firebase
import { db } from "../firebase-config.js";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

// --- 2. MONTAGEM DA PÁGINA ---
// Renderiza os componentes globais IMEDIATAMENTE
renderHeader();
renderFooter();

const gridContainer = document.getElementById("voce-sabia-grid");

async function loadAllVoceSabia() {
  if (!gridContainer) return;
  try {
    const q = query(collection(db, "voceSabia"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      gridContainer.innerHTML = "<p>Nenhuma curiosidade cadastrada ainda.</p>";
      return;
    }

    gridContainer.innerHTML = ""; // Limpa a mensagem "Carregando..."

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const docId = doc.id; // Pega o ID único do documento

      // ## MUDANÇA PRINCIPAL AQUI ##
      // O card agora é um link (<a>) que envolve o conteúdo
      const cardLink = document.createElement("a");
      cardLink.className = "sabia-card-link";
      cardLink.href = `voce-sabia-detalhe.html?id=${docId}`; // Aponta para a pág. de detalhe com o ID

      let imageHtml = data.imageUrl
        ? `<img src="${data.imageUrl}" alt="${data.title}" class="card-image">`
        : "";

      cardLink.innerHTML = `
                <div class="sabia-card">
                    ${imageHtml}
                    <div class="card-content">
                        <span class="card-category">${data.category}</span>
                        <h3 class="card-title">${data.title}</h3>
                        <div class="card-text">${data.content.substring(
                          0,
                          150
                        )}...</div>
                        <span class="card-read-more">Ler Mais &rarr;</span>
                    </div>
                </div>
            `;
      gridContainer.appendChild(cardLink);
    });
  } catch (error) {
    console.error("Erro ao carregar itens 'Você Sabia?':", error);
    gridContainer.innerHTML = "<p>Ocorreu um erro ao carregar o conteúdo.</p>";
  }
}

document.addEventListener("DOMContentLoaded", loadAllVoceSabia);
