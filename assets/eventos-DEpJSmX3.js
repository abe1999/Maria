import{r as n,a as i}from"./Footer-BZh9Zm0S.js";/* empty css                    *//* empty css                */import{a as s}from"./eventos-CD9gLwlm.js";function o(t){return new Date(t+"T00:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}function c(t){const a=t.link.startsWith("http")?t.link:`/${t.link.replace(/^\//,"")}`,e=t.image.startsWith("http")?t.image:`/${t.image.replace(/^\//,"")}`;return`
    <a href="${a}" class="evento-card">
      <img src="${e}" alt="Imagem do evento: ${t.title}">
      <div class="evento-conteudo">
        <p class="evento-data">${o(t.date)}</p>
        <h3 class="evento-titulo">${t.title}</h3>
        <p class="evento-resumo">${t.excerpt}</p>
        <span class="btn">Ver Mais</span>
      </div>
    </a>
  `}function l(){n(),i();const t=document.querySelector(".eventos-grid");if(!t)return;let a=[...s];a.sort((e,r)=>new Date(r.date)-new Date(e.date)),t.innerHTML=a.map(c).join("")}document.addEventListener("DOMContentLoaded",l);
