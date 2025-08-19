(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&t(i)}).observe(document,{childList:!0,subtree:!0});function s(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function t(e){if(e.ep)return;e.ep=!0;const o=s(e);fetch(e.href,o)}})();const n="/img/logo/Nazare-logo.png",c=()=>{const a=document.querySelector("#main-header");a&&window.addEventListener("scroll",()=>{window.scrollY>50?a.classList.add("scrolled"):a.classList.remove("scrolled")})},d=()=>{const a=document.body,r=document.getElementById("hamburger-menu-button"),s=document.getElementById("close-menu-button"),t=document.getElementById("main-nav");if(!a||!r||!s||!t)return;r.addEventListener("click",()=>{a.classList.add("menu-open")}),s.addEventListener("click",()=>{a.classList.remove("menu-open")}),t.querySelectorAll(".dropdown").forEach(o=>{o.querySelector(".drop-btn").addEventListener("click",l=>{window.innerWidth<=992&&(l.preventDefault(),o.classList.toggle("active"))})})};function u(){const a=document.getElementById("header-container");if(!a)return;const r=`
    <header class="main-header" id="main-header">
      <div class="container">
        <a href="/" class="logo">
          <img src="${n}" alt="Logo da Paróquia Nossa Senhora de Nazaré" />
        </a>
        <nav class="main-nav" id="main-nav">
          <button class="close-menu-button" id="close-menu-button" aria-label="Fechar menu">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <ul>
            <li><a href="/">Início</a></li>
            
            <li><a href="/pages/comunidades.html">Comunidades</a></li>
            <li><a href="/pages/pastorais.html">Pastorais</a></li>
            <li><a href="/pages/horarios.html">Horários</a></li>
            <li class="dropdown">
              <a href="javascript:void(0);" class="drop-btn">
                Eventos <i class="fa-solid fa-caret-down"></i>
              </a>
              <div class="dropdown-content">
                <a href="/pages/eventos.html?categoria=evento-geral">Eventos Gerais</a>
                <a href="/pages/eventos.html?categoria=missa">Missas</a>
                <a href="/pages/proximos-eventos.html">Próximos Eventos</a>
              </div>
            </li>
            <li><a href="/pages/acampamento.html">Acampamento</a></li>
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
  `;a.innerHTML=r,c(),d()}function m(){const a=document.getElementById("footer-container");if(!a)return;const r=`
    <footer class="main-footer">
      <div class="container">
        <div class="footer-info-box">
          <div class="footer-column">
            <a href="/" class="logo">
                      <img class="footer-logo" src="${n}" alt="Logo da Paróquia Nossa Senhora de Nazaré" />
            <div class="address-details">
              <h4>Nossa Paróquia</h4>
              <p>
                <strong>Rua Pau ferro, 650, Jardim Eldorado</strong><br>
                Cep: 78912-500 - Porto Velho (RO)
              </p>
            </div>
          </div>
          <div class="footer-column">
            <h4>Contatos</h4>
            <p>
              <i class="fa-solid fa-phone"></i> Telefone: <a href="tel:+556932212270">(69) 3221-2270</a>
            </p>
            <p>
              <i class="fa-brands fa-whatsapp"></i> WhatsApp: <a href="https://wa.me/556932212270" target="_blank">(69) 3221-2270</a>
            </p>
            <p>
              <i class="fa-solid fa-envelope"></i> E-mail:<br>
              <a href="mailto:secretaria@suaparoquia.com.br">secretaria@suaparoquia.com.br</a>
            </p>
          </div>
          <div class="footer-column">
            <h4>Funcionamento</h4>
            <p>
              <strong>Secretaria Paroquial:</strong><br>
              Segunda-feira a Sexta-feira:<br>
              8h às 12h - 14h às 18h
            </p>
            <p>
              <strong>Sábado:</strong><br>
              8h às 12h
            </p>
          </div>
        </div>
      </div>
      <div class="footer-bottom-bar">
        <div class="container">
          <p>&copy; 2025 Paróquia Nossa Senhora de Nazaré. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  `;a.innerHTML=r}export{m as a,u as r};
