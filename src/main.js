// =======================================================
// IMPORTAÇÃO DE ESTILOS
// =======================================================

/* 1. Base e Configurações Globais */
import "./styles/base/reset.css";
import "./styles/base/variables.css";
import "./styles/base/typography.css";

/* 2. Componentes Reutilizáveis */
import "./styles/components/header.css";
import "./styles/components/footer.css";
import "./styles/components/hero.css";
import "./styles/components/quick-links.css";
import "./styles/components/latest-news.css";

/* 3. Estilos Específicos de Páginas */
import "./styles/pages/_events.css";
import "./styles/pages/_pastorais.css";
import "./styles/pages/_comunidades.css";
import "./styles/pages/comunidade-detalhe.css";
import "./styles/pages/pastoral-detalhe.css";
import "./styles/pages/_acampamento.css";

// =======================================================
// LÓGICA DO SEU SITE
// =======================================================

// 1. Importa as funções que renderizam o HTML do Header e Footer
import { renderHeader } from "./components/Header.js";
import { renderFooter } from "./components/Footer.js";

// 2. Importa a biblioteca Swiper (carrossel)
import Swiper from "swiper/bundle";
import "swiper/css/bundle"; // Importa o CSS base do Swiper

// 3. Funções e Scripts do seu site
function inicializarCarrossel() {
  const swiper = new Swiper(".swiper", {
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: {
      delay: 5000,
    },
  });
}

function carregarNoticias() {
  // Lógica para carregar as notícias na grade (pode vir de './data/noticias.js')
  console.log("Carregando últimas notícias...");
  // Exemplo: document.querySelector('#latest-news-grid').innerHTML = '...';
}

// =======================================================
// EXECUÇÃO DO CÓDIGO
// =======================================================

// "Desenha" o header e o footer na tela
renderHeader();
renderFooter();

// Inicializa as funcionalidades da página
inicializarCarrossel();
carregarNoticias();
