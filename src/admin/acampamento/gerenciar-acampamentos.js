// Local: /src/admin/acampamento/gerenciar-acampamentos.js - VERSÃO FINAL

// --- 1. IMPORTAÇÕES ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/buttons.css";
import "/src/styles/components/page-header.css";
import "/src/styles/components/admin-header.css";
import "./gerenciar-acampamentos.css";

// Componentes e Funções
import { renderAdminHeader } from "/src/components/AdminHeader.js";
import { app } from "../../firebase-config.js";
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

// --- 2. MONTAGEM DA PÁGINA ---
// Removemos a chamada ao renderFooter, pois decidimos não tê-lo no admin
renderAdminHeader();

// --- 3. LÓGICA DA PÁGINA ---
const listContainer = document.getElementById("acampamentos-list-container");

async function loadItems() {
  if (!listContainer) return;

  try {
    // A consulta completa, agora que sabemos que a conexão funciona
    const q = query(
      collection(db, "acampamentos"),
      orderBy("startDate", "desc")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      listContainer.innerHTML = "<p>Nenhum acampamento cadastrado ainda.</p>";
      return;
    }

    listContainer.innerHTML = querySnapshot.docs
      .map((doc) => {
        const item = doc.data();
        const itemId = doc.id;
        const thumbnail = item.mainImageUrl
          ? `<img src="${item.mainImageUrl}" alt="miniatura" class="item-thumbnail">`
          : `<div class="item-thumbnail-placeholder">Sem Cartaz</div>`;

        // Constrói o nome completo do acampamento
        const nomeCompleto = `Acampamento ${item.type || ""} ${
          item.year || ""
        }`.trim();

        return `
                <div class="list-item" id="item-${itemId}">
                    ${thumbnail}
                    <div class="item-info">
                        <span class="item-title">${nomeCompleto}</span>
                        <span class="item-category">Tema: ${
                          item.theme || "Não definido"
                        }</span>
                        <span class="item-status">Status: <strong>${
                          item.status
                        }</strong></span>
                    </div>
                    <div class="item-actions">
                        <a href="editor-acampamento.html?id=${itemId}" class="btn btn-secondary">Editar</a>
                        <button class="btn btn-danger btn-delete" data-id="${itemId}">Excluir</button>
                    </div>
                </div>
            `;
      })
      .join("");
  } catch (error) {
    console.error("Erro ao carregar acampamentos:", error);
    listContainer.innerHTML =
      "<p>Ocorreu um erro ao carregar os itens. Verifique o console.</p>";
  }
}

// Lógica para deletar um item
listContainer.addEventListener("click", async (event) => {
  if (event.target.matches(".btn-delete")) {
    const itemId = event.target.dataset.id;
    if (confirm("Tem certeza que deseja excluir este acampamento?")) {
      try {
        await deleteDoc(doc(db, "acampamentos", itemId));
        alert("Acampamento excluído com sucesso!");
        document.getElementById(`item-${itemId}`).remove();
      } catch (error) {
        console.error("Erro ao excluir acampamento:", error);
        alert("Não foi possível excluir o item.");
      }
    }
  }
});

// --- 4. EXECUÇÃO ---
loadItems();
