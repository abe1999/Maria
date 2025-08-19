import{r as l,a as m}from"./Footer-BDMERer1.js";import{c as u}from"./comunidades-DV2kg8bF.js";function h(){const d=new URLSearchParams(window.location.search).get("id"),o=document.querySelector("main");if(!o)return;const e=u.find(a=>a.id===d);if(!e)return;document.title=`${e.nome} | Paróquia N. S. de Nazaré`;const c=e.horarios.map(a=>`
    <li><strong>${a.dia}:</strong> ${a.descricao}</li>
  `).join("");let i="";if(e.redesSociais&&Object.keys(e.redesSociais).length>0){const a={instagram:"fa-instagram",facebook:"fa-facebook",whatsapp:"fa-whatsapp",youtube:"fa-youtube"};i=Object.entries(e.redesSociais).map(([r,n])=>{const s=a[r];return!n||!s?"":`
          <li>
            <a href="${n}" target="_blank" rel="noopener noreferrer" aria-label="${r}">
              <i class="fa-brands ${s}"></i>
            </a>
          </li>
        `}).join("")}const t=`
    <div class="hero-comunidade" style="background-image: url('${e.imagemBanner}')">
      <h1 id="comunidade-nome">${e.nome}</h1>
    </div>

    <div class="conteudo-principal container">
      <div class="info-coluna">
        <h2>Sobre a Comunidade</h2>
        <p id="comunidade-historia">${e.historia}</p>

        <h2>Horários de Missas e Celebrações</h2>
        <ul id="comunidade-horarios">${c}</ul>
        
        ${i?`
          <h2>Nossas Redes</h2>
          <ul class="redes-sociais-lista">${i}</ul>
        `:""}
        
      </div>

      <div class="mapa-coluna">
        <h2>Como Chegar</h2>
        <p id="comunidade-endereco">${e.endereco}</p>
        <div class="map-responsive">
          <iframe
            id="comunidade-mapa"
            src="${e.googleMapsUrl}"
            width="600"
            height="450"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
             referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  `;o.innerHTML=t}document.addEventListener("DOMContentLoaded",()=>{l(),m(),h()});
