import { auth } from "../firebase-config.js";
import { signInWithEmailAndPassword } from "firebase/auth";

const loginForm = document.getElementById("login-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const errorMessage = document.getElementById("error-message");
const loginButton = document.getElementById("login-button");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  errorMessage.textContent = "";
  loginButton.disabled = true;
  loginButton.textContent = "Entrando...";

  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Login bem-sucedido!", userCredential.user);
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("Erro no login:", error.code, error.message);

    switch (error.code) {
      case "auth/invalid-credential":
        errorMessage.textContent = "E-mail ou senha inválidos.";
        break;
      case "auth/user-not-found":
        errorMessage.textContent = "Nenhum usuário encontrado com este e-mail.";
        break;
      case "auth/wrong-password":
        errorMessage.textContent = "Senha incorreta.";
        break;
      default:
        errorMessage.textContent =
          "Ocorreu um erro ao fazer login. Tente novamente.";
    }
  } finally {
    loginButton.disabled = false;
    loginButton.textContent = "Entrar";
  }
});
