import"./modulepreload-polyfill-B5Qt9EMX.js";import{r,a as d}from"./Footer-DjiHI036.js";/* empty css                  *//* empty css                    */import{c as t}from"./comunidades-DHJKb5uK.js";function n(e){return`
    <div class="comunidade-card-avatar">
      <a href="/pages/comunidade-detalhe.html?id=${e.id}">
        <div class="avatar-container">
          <img src="${e.imagemCard}" alt="Foto da ${e.nome}">
        </div>
        <h3 class="comunidade-titulo">${e.nome}</h3>
        <p class="comunidade-descricao">${e.resumo}</p>
      </a>
    </div>
  `}function o(){const e=document.getElementById("comunidades-grid");if(!e)return;const a=t.map(n).join("");e.innerHTML=a}document.addEventListener("DOMContentLoaded",()=>{r(),d(),o()});
