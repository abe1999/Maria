// Local: /src/components/Header.js - VERSÃO FINAL SEM constants.js

// ## CORREÇÃO: Importamos a imagem diretamente aqui ##
import logoImage from "/img/logo/Nazare-logo.png";

import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/buttons.css";

const initializeHeaderScrollEffect = () => {
  const header = document.querySelector("#main-header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 50);
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

  if (mainNav) {
    const dropdownTriggers = mainNav.querySelectorAll(".dropdown > .drop-btn");
    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        if (window.innerWidth <= 992) {
          event.preventDefault();
          trigger.parentElement.classList.toggle("active");
        }
      });
    });
  }
};

// --- Função Principal que Monta Tudo ---

export function renderHeader() {
  const headerPlaceholder = document.getElementById("header-container");
  if (!headerPlaceholder) return;

  // ## CORREÇÃO: Definimos a constante BASE aqui dentro ##
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
                <a href="${BASE}src/pages/proximos-eventos.html">Próximos Eventos</a>
                <a href="${BASE}src/pages/eventos.html">Eventos Anteriores</a>
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

  headerPlaceholder.innerHTML = headerHTML;

  // Chama as funções para "dar vida" ao header
  initializeHeaderScrollEffect();
  initializeMobileMenu();
}
