import{r as o,a as i}from"./Footer-BDMERer1.js";/* empty css                    *//* empty css                */import{a as s}from"./eventos-CD9gLwlm.js";function l(t){return new Date(t+"T00:00:00").toLocaleDateString("pt-BR",{day:"2-digit",month:"long",year:"numeric"})}function c(t){const e=t.link.startsWith("http")?t.link:`/${t.link.replace(/^\//,"")}`,a=t.image.startsWith("http")?t.image:`/${t.image.replace(/^\//,"")}`;return`
    <a href="${e}" class="evento-card">
      <img src="${a}" alt="Imagem do evento: ${t.title}">
      <div class="evento-conteudo">
        <p class="evento-data">${l(t.date)}</p>
        <h3 class="evento-titulo">${t.title}</h3>
        <p class="evento-resumo">${t.excerpt}</p>
        <span class="btn">Ver Mais</span>
      </div>
    </a>
  `}function d(){o(),i();const t=document.getElementById("proximos-eventos-grid");if(!t)return;const e=new Date;e.setHours(0,0,0,0);const a=s.filter(n=>new Date(n.date)>=e);a.sort((n,r)=>new Date(n.date)-new Date(r.date)),a.length>0?t.innerHTML=a.map(c).join(""):t.innerHTML='<p style="text-align: center; font-size: 1.1rem; color: var(--color-text-light);">Nenhum evento futuro agendado no momento. Volte em breve!</p>'}document.addEventListener("DOMContentLoaded",d);
