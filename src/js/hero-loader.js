// Local: /src/js/hero-loader.js

// --- IMPORTS ---
// CORREÇÃO 1: Importar o Swiper e seus módulos para poder usá-los neste arquivo.
import Swiper from "swiper";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

// Importa a conexão principal 'app' e TODAS as funções do Firestore de uma só vez.
import { app } from "../firebase-config.js";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";

// Cria a instância do banco de dados a partir da conexão principal
const db = getFirestore(app);
// --- FUNÇÕES ---

// Função para inicializar o Swiper.js
function inicializarSwiper() {
  const swiper = new Swiper(".swiper", {
    // Registra os módulos que vamos usar
    modules: [Navigation, Pagination, Autoplay],
    // Suas opções do Swiper
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    effect: "fade",
  });
}

// Função principal para carregar os slides do Firebase
async function carregarSlides() {
  const swiperWrapper = document.querySelector(".swiper-wrapper");
  if (!swiperWrapper) {
    console.error("Elemento '.swiper-wrapper' não encontrado!");
    return;
  }

  try {
    // CORREÇÃO 2: Usar a coleção "destaques" para alinhar com as regras e o painel ADM.
    const slidesRef = collection(db, "destaques");
    const q = query(
      slidesRef,
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

    // Inicializa o Swiper DEPOIS que os slides foram adicionados ao HTML
    inicializarSwiper();
  } catch (error) {
    console.error("Erro ao carregar os slides:", error);
    swiperWrapper.innerHTML =
      "<p>Não foi possível carregar os destaques. Tente novamente mais tarde.</p>";
  }
}

// Inicia o carregamento dos slides assim que o script for executado
carregarSlides();
