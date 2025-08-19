import{r,a as i}from"./Footer-BDMERer1.js";/* empty css                    *//* empty css                */import{a as o}from"./eventos-CD9gLwlm.js";function s(t){return new Date(t+"T00:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}function d(t){const e=t.link.startsWith("http")?t.link:`/${t.link.replace(/^\//,"")}`,a=t.image.startsWith("http")?t.image:`/${t.image.replace(/^\//,"")}`;return`
    <div class="home-news-card">
      <a href="${e}">
        <img src="${a}" alt="Imagem do evento: ${t.title}">
        <div class="home-news-content">
          <p class="home-news-date">${s(t.date)}</p>
          <h3 class="home-news-title">${t.title}</h3>
        </div>
      </a>
    </div>
  `}function l(){r(),i();const t=document.querySelector(".eventos-grid");if(!t)return;let e=[...o];e.sort((a,n)=>new Date(n.date)-new Date(a.date)),t.innerHTML=e.map(d).join("")}document.addEventListener("DOMContentLoaded",l);
