// Inicializa o Swiper
const swiper = new Swiper(".swiper", {
  // Parâmetros opcionais
  direction: "horizontal", // Direção do slide
  loop: true, // Faz o carrossel voltar ao início

  // Autoplay para trocar de slide sozinho
  autoplay: {
    delay: 5000, // 5 segundos por slide
    disableOnInteraction: false, // Não para o autoplay se o usuário mexer
  },

  // Paginação (as bolinhas)
  pagination: {
    el: ".swiper-pagination",
    clickable: true, // Permite clicar nas bolinhas para navegar
  },

  // Botões de navegação (as setas)
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});
