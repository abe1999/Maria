// Local: /src/js/voce-sabia-page-loader.js
import "/src/styles/pages/voce-sabia.css";
import { db } from "../firebase-config.js";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

const gridContainer = document.getElementById("voce-sabia-grid");

async function loadAllVoceSabia() {
  if (!gridContainer) return;

  try {
    // Consulta para buscar todos os itens da coleção "voceSabia",
    // ordenando pelos mais recentes primeiro.
    const q = query(collection(db, "voceSabia"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      gridContainer.innerHTML = "<p>Nenhuma curiosidade cadastrada ainda.</p>";
      return;
    }

    // Limpa a mensagem "Carregando..."
    gridContainer.innerHTML = "";

    querySnapshot.forEach((doc) => {
      const data = doc.data();

      // Cria o HTML do card para cada item
      const card = document.createElement("div");
      card.className = "sabia-card";

      let imageHtml = "";
      // Adiciona a imagem apenas se a URL existir no banco de dados
      if (data.imageUrl) {
        imageHtml = `<img src="${data.imageUrl}" alt="${data.title}" class="card-image">`;
      }

      card.innerHTML = `
                ${imageHtml}
                <div class="card-content">
                    <span class="card-category">${data.category}</span>
                    <h3 class="card-title">${data.title}</h3>
                    <div class="card-text">${data.content}</div>
                </div>
            `;

      gridContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar itens 'Você Sabia?':", error);
    gridContainer.innerHTML =
      "<p>Ocorreu um erro ao carregar o conteúdo. Tente novamente mais tarde.</p>";
  }
}

// Inicia o carregamento quando a página está pronta
document.addEventListener("DOMContentLoaded", loadAllVoceSabia);
