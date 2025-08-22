import { db } from "../firebase-config.js"; // Ajuste o caminho se necessário
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

// Função para inicializar o Swiper.js
// É importante que ela seja chamada DEPOIS que os slides forem carregados
function inicializarSwiper() {
  const swiper = new Swiper(".swiper", {
    // Opções do seu Swiper
    loop: true,
    autoplay: {
      delay: 5000, // 5 segundos
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
    effect: "fade", // Exemplo de efeito, ajuste conforme seu gosto
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
    // 1. Cria a consulta ao Firestore
    const slidesRef = collection(db, "destaques_carrosel");
    const q = query(
      slidesRef,
      where("ativo", "==", true),
      orderBy("ordem", "asc")
    );

    // 2. Executa a consulta
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      swiperWrapper.innerHTML =
        "<p>Nenhum destaque para exibir no momento.</p>";
      return;
    }

    // 3. Gera o HTML para cada slide
    let slidesHtml = "";
    querySnapshot.forEach((doc) => {
      const slide = doc.data();

      // Note o uso de style="background-image: ..." para a imagem de fundo
      slidesHtml += `
                <div class="swiper-slide" style="background-image: url('${slide.imagemUrl}')">
                    <div class="slide-content">
                        <h2>${slide.texto}</h2>
                        <a href="${slide.linkUrl}" class="btn-slide" target="_blank">Saiba Mais</a>
                    </div>
                </div>
            `;
    });

    // 4. Insere o HTML gerado no wrapper
    swiperWrapper.innerHTML = slidesHtml;

    // 5. INICIALIZA o Swiper
    inicializarSwiper();
  } catch (error) {
    console.error("Erro ao carregar os slides:", error);
    swiperWrapper.innerHTML =
      "<p>Não foi possível carregar os destaques. Tente novamente mais tarde.</p>";
  }
}

// Inicia o carregamento dos slides assim que o script for executado
carregarSlides();
