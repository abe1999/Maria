// Local do arquivo: src/components/Header.js - VERSÃO FINAL E ORGANIZADA

import logoImage from "/img/logo/Nazare-logo.png";

// =========================================================
// ## FUNÇÕES DE LÓGICA (DEFINIDAS FORA) ##
// =========================================================
const initializeHeaderScrollEffect = () => {
  const header = document.querySelector("#main-header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
};

const initializeMobileMenu = () => {
  const body = document.body;
  const hamburgerButton = document.getElementById("hamburger-menu-button");
  const closeButton = document.getElementById("close-menu-button");
  const mainNav = document.getElementById("main-nav");

  if (hamburgerButton && closeButton) {
    hamburgerButton.addEventListener("click", () =>
      body.classList.add("menu-open")
    );
    closeButton.addEventListener("click", () =>
      body.classList.remove("menu-open")
    );
  }

  const dropdownTriggers = mainNav.querySelectorAll(
    ".main-nav .dropdown > .drop-btn"
  );
  dropdownTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      // Esta lógica de clique SÓ funciona em telas de celular
      if (window.innerWidth <= 992) {
        event.preventDefault();
        const parentDropdown = trigger.parentElement;
        parentDropdown.classList.toggle("active");
      }
    });
  });
};

// =========================================================
// ## FUNÇÃO PRINCIPAL QUE MONTA TUDO ##
// =========================================================
export function renderHeader() {
  const headerPlaceholder = document.getElementById("header-container");
  if (!headerPlaceholder) return;

  const BASE = import.meta.env.BASE_URL;

  const headerHTML = `
    <header class="main-header" id="main-header">
      <div class="container">
        <a href="${BASE}" class="logo">
          <img src="${logoImage}" alt="Logo da Paróquia Nossa Senhora de Nazaré" />
        </a>
        <nav class="main-nav" id="main-nav">
          <button class="close-menu-button" id="close-menu-button" aria-label="Fechar menu">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <ul>
            <li><a href="${BASE}">Início</a></li>
            <li><a href="${BASE}src/pages/comunidades.html">Comunidades</a></li>
            <li><a href="${BASE}src/pages/pastorais.html">Pastorais</a></li>
            <li><a href="${BASE}src/pages/horarios.html">Horários</a></li>
            <li class="dropdown">
              <a href="javascript:void(0);" class="drop-btn">
                Eventos <i class="fa-solid fa-caret-down"></i>
              </a>
              <div class="dropdown-content">
                <a href="${BASE}src/pages/proximos-eventos.html"><span>Próximos Eventos</span></a>
                <a href="${BASE}src/pages/eventos.html"><span>Eventos Anteriores</span></a>
              </div>
            </li>
            <li><a href="${BASE}src/pages/acampamento.html">Acampamento</a></li>
            <li><a href="${BASE}src/pages/voce-sabia.html">Você Sabia?</a></li>
          </ul>
        </nav>
        <div class="header-right">
          <div class="social-media"></div>
          <button class="hamburger-menu" id="hamburger-menu-button" aria-label="Abrir menu">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </header>
  `;

  // 1. Insere o HTML na página
  headerPlaceholder.innerHTML = headerHTML;

  // 2. DEPOIS de o HTML existir, chama as funções para adicionar a interatividade
  initializeHeaderScrollEffect();
  initializeMobileMenu();
}
