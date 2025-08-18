import{r as t,a as n}from"./Footer-CyP6qy2r.js";/* empty css                    */import{p as d}from"./pastorais-DqvWpdRP.js";function s(){t(),n();const a=document.querySelector(".pastorais-grid");if(!a)return;function i(e){const r=`/Maria/pages/pastoral-detalhe.html?id=${e.id}`;return`
      <div class="pastoral-card">
        <img src="${e.image.startsWith("http")?e.image:`/Maria/${e.image.replace(/^\//,"")}`}" alt="${e.name}">
        <div class="card-content">
          <h3>${e.name}</h3>
          <p>${e.excerpt}</p>
          <a href="${r}" class="btn-secondary">Saiba Mais</a>
        </div>
      </div>
    `}a.innerHTML=d.map(i).join("")}document.addEventListener("DOMContentLoaded",s);
