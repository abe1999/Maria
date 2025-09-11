// Local: /src/components/AdminHeader.js

import { app } from "/src/firebase-config.js";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(app);

export function renderAdminHeader() {
  const headerPlaceholder = document.getElementById("header-container");
  if (!headerPlaceholder) return;

  const headerHTML = `
    <header class="admin-main-header">
        <div class="container">
            <a href="/src/admin/dashboard.html" class="admin-logo">
                <h1>Painel Administrativo</h1>
            </a>
            <button id="logout-button" class="btn-logout">
                <i class="fa-solid fa-right-from-bracket"></i> Sair
            </button>
        </div>
    </header>
  `;

  headerPlaceholder.innerHTML = headerHTML;

  // Adiciona a funcionalidade ao botão de logout que acabamos de criar
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    logoutButton.addEventListener("click", async () => {
      if (confirm("Tem certeza que deseja sair?")) {
        try {
          await signOut(auth);
          // Redireciona para a página de login DENTRO do admin
          window.location.href = "login.html";
        } catch (error) {
          console.error("Erro ao fazer logout:", error);
        }
      }
    });
  }
}
