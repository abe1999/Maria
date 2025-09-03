// Local: /main.js

// --- IMPORTS DE PACOTES NPM (NÃO USAM /src/) ---
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// --- IMPORTS DOS SEUS ARQUIVOS CSS (PRECISAM DE /src/) ---
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/hero.css";
import "/src/styles/components/article.css";
import "/src/styles/components/quick-links.css";
import "/src/styles/components/latest-news.css";

// --- IMPORTS DOS SEUS MÓDULOS JS (PRECISAM DE /src/) ---
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import { initializeHomepageNews } from "/src/components/homepage-loader.js";

// --- LÓGICA DO SEU SITE ---
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  initializeHomepageNews();
});
