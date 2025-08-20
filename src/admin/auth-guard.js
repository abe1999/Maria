import { auth } from "/src/firebase-config.js";
import { onAuthStateChanged } from "firebase/auth";

// Mensagem para sabermos que o script começou a rodar
console.log("--- Auth Guard Executando ---");

// A função do Firebase que verifica o status do login
onAuthStateChanged(auth, (user) => {
  // Mostra o status do usuário no console (se está logado ou não)
  console.log("Status de autenticação verificado. Usuário:", user);

  // Pega o caminho da página que o usuário está tentando acessar
  const currentPage = window.location.pathname;
  console.log("Página Atual (pathname):", currentPage);

  // Condição: Se NÃO houver usuário (user é null) E a página atual NÃO É a de login...
  if (!user && !currentPage.includes("/src/admin/login.html")) {
    // Mensagem de diagnóstico antes de redirecionar
    console.log(
      "Usuário não autenticado. Redirecionando para a página de login..."
    );

    // ✨ A CORREÇÃO PRINCIPAL ESTÁ AQUI: Adicionamos o /src/ no caminho
    window.location.href = "/src/admin/login.html";
  } else if (user && currentPage.includes("/src/admin/login.html")) {
    // BÔNUS: Se o usuário JÁ ESTIVER logado e tentar acessar a página de login,
    // o mandamos direto para o dashboard.
    console.log("Usuário já logado. Redirecionando para o dashboard...");
    window.location.href = "/src/admin/dashboard.html";
  } else {
    // Se o usuário está logado e na página certa, ou na página de login sem estar logado,
    // não fazemos nada e deixamos a página carregar.
    console.log("Nenhuma ação de redirecionamento necessária.");
  }
});
