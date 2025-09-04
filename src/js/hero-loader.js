// Local: /src/js/hero-loader.js - VERSÃO FINAL CORRIGIDA

// --- IMPORTS ---
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Primeiro, importamos os estilos PADRÃO da biblioteca Swiper
import "swiper/css";
import "swiper/css/bundle";

// =======================================================================
// ## AGORA, importamos o NOSSO CSS, que vai sobrescrever o que for preciso ##
import "/src/styles/components/hero.css";
// =======================================================================

// Importa a conexão principal 'app' e as funções do Firestore
import { app } from "../firebase-config.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

const db = getFirestore(app);

// Adicionamos 'export' aqui para que o main.js possa "enxergar" esta função
export async function loadHeroCarousel() {
  const swiperWrapper = document.querySelector(
    ".swiper-wrapper#destaques-container"
  );
  if (!swiperWrapper) return;

  try {
    const q = query(
      collection(db, "destaques"),
      where("ativo", "==", true),
      orderBy("ordem", "asc")
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      swiperWrapper.innerHTML =
        "<p>Nenhum destaque para exibir no momento.</p>";
      return;
    }

    let slidesHtml = "";
    querySnapshot.forEach((doc) => {
      const slide = doc.data();
      slidesHtml += `
              <div class="swiper-slide" style="background-image: url('${slide.imageUrl}')">
                  <div class="slide-content">
                      <h2>${slide.texto}</h2>
                      <a href="${slide.linkUrl}" class="btn-slide" target="_blank">${slide.textoBotao}</a>
                  </div>
              </div>
            `;
    });
    swiperWrapper.innerHTML = slidesHtml;

    new Swiper(".swiper", {
      modules: [Navigation, Pagination, Autoplay],
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      pagination: { el: ".swiper-pagination", clickable: true },
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      effect: "fade",
    });
  } catch (error) {
    console.error("Erro ao carregar os slides do carrossel:", error);
    swiperWrapper.innerHTML = "<p>Não foi possível carregar os destaques.</p>";
  }
}
