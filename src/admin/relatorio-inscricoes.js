// Local: /src/admin/relatorio-inscricoes.js - VERSÃO CORRIGIDA

// --- 1. IMPORTAÇÕES GLOBAIS E DA PÁGINA ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/buttons.css";
import "/src/styles/components/page-header.css";
import "/src/styles/components/admin-header.css";
// A linha do 'admin-base.css' foi removida daqui
import "./relatorio-inscricoes.css"; // O CSS que acabamos de criar

// Componentes
import { renderAdminHeader } from "/src/components/AdminHeader.js";

// Firebase
import { app } from "../firebase-config.js";
import {
  getFirestore,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
const db = getFirestore(app);

// --- 2. MONTAGEM DA PÁGINA ---
renderAdminHeader();

// --- 3. LÓGICA DA PÁGINA ---
const reportContainer = document.getElementById("report-container");

async function loadReport() {
  if (!reportContainer) return;

  try {
    const q = query(
      collection(db, "contadoresDeEventos"),
      orderBy("ultimaInscricao", "desc")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      reportContainer.innerHTML =
        "<p>Nenhuma inscrição (contagem) registrada ainda.</p>";
      return;
    }

    let reportHTML = '<ul class="report-list">';

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const contadorId = doc.id;
      const contagem = data.contagem;

      reportHTML += `
                <li class="report-item">
                    <span class="report-item-id">${contadorId}</span>
                    <span class="report-item-count">${contagem} pessoa(s)</span>
                </li>
            `;
    });

    reportHTML += "</ul>";
    reportContainer.innerHTML = reportHTML;
  } catch (error) {
    console.error("Erro ao carregar relatório:", error);
    reportContainer.innerHTML =
      "<p style='color:red;'>Ocorreu um erro ao carregar o relatório. Verifique o console.</p>";
  }
}

// --- 4. EXECUÇÃO ---
loadReport();
