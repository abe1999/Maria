import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",function(){const e=document.querySelector(".pastorais-grid");function r(a){return`
      <div class="pastoral-card">
        <img src="${a.image}" alt="${a.name}">
        <div class="card-content">
          <h3>${a.name}</h3>
          <p>${a.excerpt}</p>
          <a href="/pages/pastoral-detalhe.html?id=${a.id}" class="btn-secondary">Saiba Mais</a>
        </div>
      </div>
    `}async function t(){if(e)try{const n=await(await fetch("/data/pastorais.json")).json();e.innerHTML=n.map(r).join("")}catch(a){console.error("Falha ao carregar lista de pastorais:",a)}}t()});
