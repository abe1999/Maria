// Local: /src/admin/gerenciar-voce-sabia.js - VERSÃO LIMPA E CORRETA

// --- 1. IMPORTAÇÕES ---
// Apenas o CSS específico desta página
import "./gerenciar-voce-sabia.css";

// Ferramentas do Firebase
import { app } from "../firebase-config.js";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
const db = getFirestore(app);

// --- 2. LÓGICA DA PÁGINA ---
const listContainer = document.getElementById("voce-sabia-list-container");

async function loadItems() {
  if (!listContainer) return;
  try {
    const q = query(collection(db, "voceSabia"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      listContainer.innerHTML =
        "<p>Nenhum item 'Você Sabia?' cadastrado ainda.</p>";
      return;
    }

    listContainer.innerHTML = querySnapshot.docs
      .map((doc) => {
        const item = doc.data();
        const itemId = doc.id;
        const thumbnail = item.imageUrl
          ? `<img src="${item.imageUrl}" alt="miniatura" class="item-thumbnail">`
          : `<div class="item-thumbnail-placeholder">Sem Imagem</div>`;

        return `
                <div class="list-item" id="item-${itemId}">
                    ${thumbnail}
                    <div class="item-info">
                        <span class="item-title">${item.title}</span>
                        <span class="item-category">${item.category}</span>
                    </div>
                    <div class="item-actions">
                        <a href="editor-voce-sabia.html?id=${itemId}" class="btn btn-secondary">Editar</a>
                        <button class="btn btn-danger btn-delete" data-id="${itemId}">Excluir</button>
                    </div>
                </div>
            `;
      })
      .join("");
  } catch (error) {
    console.error("Erro ao carregar itens:", error);
    listContainer.innerHTML =
      "<p>Ocorreu um erro ao carregar os itens. Tente novamente.</p>";
  }
}

listContainer.addEventListener("click", async (event) => {
  if (event.target.matches(".btn-delete")) {
    const itemId = event.target.dataset.id;
    if (
      confirm(
        "Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita."
      )
    ) {
      try {
        await deleteDoc(doc(db, "voceSabia", itemId));
        alert("Item excluído com sucesso!");
        document.getElementById(`item-${itemId}`).remove();
      } catch (error) {
        console.error("Erro ao excluir item:", error);
        alert("Não foi possível excluir o item.");
      }
    }
  }
});

// --- 3. EXECUÇÃO ---
// A chamada ao renderHeader e renderFooter foi removida, pois o main.js já cuida disso.
loadItems();
