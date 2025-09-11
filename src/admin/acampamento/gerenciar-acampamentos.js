// Local: /src/admin/acampamento/gerenciar-acampamentos.js - VERSÃO LIMPA

// Local: /src/admin/acampamento/gerenciar-acampamentos.js - VERSÃO FINAL

// --- 1. IMPORTAÇÕES ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/buttons.css";
import "/src/styles/components/page-header.css";
import "/src/styles/components/admin-header.css"; // O CSS do novo header
import "./gerenciar-acampamentos.css";

// Componentes e Funções
import { renderAdminHeader } from "/src/components/AdminHeader.js"; // USA O NOVO HEADER
// renderFooter não é mais necessário aqui

// ... (resto das suas importações do Firebase e helpers)

// --- 2. MONTAGEM DA PÁGINA ---
renderAdminHeader(); // Usa o novo header do admin
// A chamada renderFooter() foi REMOVIDA

// --- 3. LÓGICA DA PÁGINA ---
// (Toda a sua lógica de loadItems e de delete continua exatamente a mesma)
// ...
// Firebase
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

// --- 2. MONTAGEM DA PÁGINA ADMIN ---
renderAdminHeader(); // Usa o novo header do admin
// NÃO renderiza mais o footer

// --- 3. LÓGICA DA PÁGINA ---
// (Toda a sua lógica de loadItems e de delete continua a mesma)
const listContainer = document.getElementById("acampamentos-list-container");
async function loadItems() {
  /* ... */
}
listContainer.addEventListener("click", async (event) => {
  /* ... */
});
loadItems();
