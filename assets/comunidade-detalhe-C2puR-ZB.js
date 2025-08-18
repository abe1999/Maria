import{r as n,a as s}from"./Footer-BZh9Zm0S.js";import{c}from"./comunidades-Cu2MY4Cn.js";function t(){const r=new URLSearchParams(window.location.search).get("id"),a=document.querySelector("main");if(!a)return;const e=c.find(o=>o.id===r);if(!e)return;document.title=`${e.nome} | Paróquia N. S. de Nazaré`;const i=e.horarios.map(o=>`
    <li><strong>${o.dia}:</strong> ${o.descricao}</li>
  `).join(""),d=`
    <div class="hero-comunidade" style="background-image: url('${e.imagemBanner}')">
      <h1 id="comunidade-nome">${e.nome}</h1>
    </div>

    <div class="conteudo-principal container">
      <div class="info-coluna">
        <h2>Sobre a Comunidade</h2>
        <p id="comunidade-historia">${e.historia}</p>

        <h2>Horários de Missas e Celebrações</h2>
        <ul id="comunidade-horarios">${i}</ul>
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
  `;a.innerHTML=d}document.addEventListener("DOMContentLoaded",()=>{n(),s(),t()});
