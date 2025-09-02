import { app } from "/src/firebase-config.js";
// 2. Importa as ferramentas de Autenticação, incluindo getAuth e a função de login
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// 3. Cria a instância do auth localmente
const auth = getAuth(app);

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const loginButton = document.getElementById("login-button");

// Garante que o formulário foi encontrado antes de adicionar o listener
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = emailInput.value;
    const password = passwordInput.value;

    errorMessage.textContent = "";
    loginButton.disabled = true;
    loginButton.textContent = "Entrando...";

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // O redirecionamento NÃO PODE ter /src/
      window.location.href = "/src/admin/dashboard.html";
    } catch (error) {
      console.error("Erro no login:", error.code, error.message);
      errorMessage.textContent = "E-mail ou senha inválidos.";
    } finally {
      loginButton.disabled = false;
      loginButton.textContent = "Entrar";
    }
  });
} else {
  console.error(
    "O formulário de login #login-form não foi encontrado no HTML."
  );
}
