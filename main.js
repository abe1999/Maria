// Local: /main.js - VERSÃO FINAL E CORRIGIDA

// --- 1. IMPORTAÇÕES DE ESTILOS ---
// Estilos globais e da homepage
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/page-header.css";
import "/src/styles/components/article.css";
import "/src/styles/components/hero.css";
import "/src/styles/components/quick-links.css";
import "/src/styles/components/latest-news.css";

// --- 2. IMPORTAÇÕES DE MÓDULOS JS ---
// Módulos Globais
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";

// ## CORREÇÃO AQUI: Importamos as funções da homepage ##
import { loadHeroCarousel } from "/src/js/hero-loader.js";
import { initializeHomepageNews } from "/src/components/homepage-loader.js";

// --- 3. EXECUÇÃO ---

// Renderiza a "moldura" em todas as páginas
renderHeader();
renderFooter();

// --- LÓGICA ESPECÍFICA DA HOMEPAGE (COM VERIFICAÇÃO) ---
// Esta parte só será executada se os elementos existirem na página atual

// Se encontrar o container do carrossel, carrega o carrossel
if (document.getElementById("destaques-container")) {
  loadHeroCarousel();
}

// Se encontrar o container das notícias, carrega as notícias
if (document.getElementById("latest-news-grid")) {
  initializeHomepageNews();
}
