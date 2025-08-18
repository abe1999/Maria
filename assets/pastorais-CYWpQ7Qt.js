import{r,a as n}from"./Footer-BZh9Zm0S.js";/* empty css                    */import{p as d}from"./pastorais-DqvWpdRP.js";function s(){r(),n();const a=document.querySelector(".pastorais-grid");if(!a)return;function i(e){const t=`/pages/pastoral-detalhe.html?id=${e.id}`;return`
      <div class="pastoral-card">
        <img src="${e.image.startsWith("http")?e.image:`/${e.image.replace(/^\//,"")}`}" alt="${e.name}">
        <div class="card-content">
          <h3>${e.name}</h3>
          <p>${e.excerpt}</p>
          <a href="${t}" class="btn-secondary">Saiba Mais</a>
        </div>
      </div>
    `}a.innerHTML=d.map(i).join("")}document.addEventListener("DOMContentLoaded",s);
