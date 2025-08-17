// main.js - VERSÃO FINAL COMPLETA

// --- IMPORTS DE CSS ---
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/hero.css";
import "/src/styles/components/quick-links.css";
import "/src/styles/components/latest-news.css";

// --- LÓGICA DO SEU SITE ---
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { initializeNewsLoader } from "/src/pages/eventos.js";

function inicializarCarrossel() {
  const swiper = new Swiper(".swiper", {
    modules: [Navigation, Pagination, Autoplay],
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    autoplay: { delay: 5000, disableOnInteraction: false },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
  inicializarCarrossel();
  initializeNewsLoader(); // <-- 3. CHAMADA DA FUNÇÃO
});
