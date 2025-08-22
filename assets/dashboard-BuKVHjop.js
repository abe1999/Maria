import"./variables-lgvELO44.js";import"./auth-guard-SJLOh_jH.js";import{f as s,e as i,a as c,d as r,h as d,q as l,c as m,o as u,g as v}from"./firebase-config-nTO6jsOd.js";const f=document.getElementById("logout-button"),o=document.getElementById("events-list-container");f.addEventListener("click",async()=>{if(confirm("Tem certeza que deseja sair?"))try{await s(i),alert("Você saiu com sucesso."),window.location.href="/admin/login.html"}catch(t){console.error("Erro ao fazer logout:",t),alert("Não foi possível sair. Tente novamente.")}});async function p(){if(o)try{const t=l(m(r,"eventos"),u("date","desc")),a=(await v(t)).docs.map(e=>({id:e.id,...e.data()}));if(a.length===0){o.innerHTML="<p>Nenhum evento cadastrado ainda.</p>";return}o.innerHTML=a.map(e=>`
      <div class="event-item" id="event-${e.id}">
        <span class="event-item-title">${e.title}</span>
        <div class="event-item-actions">
          <a href="/src/admin/editor.html?id=${e.id}" class="btn btn-edit">Editar</a>
          <button class="btn btn-delete" data-id="${e.id}">Excluir</button>
        </div>
      </div>
    `).join("")}catch(t){console.error("Erro ao carregar eventos:",t),o.innerHTML="<p>Erro ao carregar eventos.</p>"}}o.addEventListener("click",async t=>{if(t.target.classList.contains("btn-delete")){const n=t.target.dataset.id,a=document.querySelector(`#event-${n} .event-item-title`).textContent;if(confirm(`Tem certeza que deseja excluir o evento "${a}"? Esta ação não pode ser desfeita.`))try{const e=c(r,"eventos",n);await d(e),alert("Evento excluído com sucesso!"),document.getElementById(`event-${n}`).remove()}catch(e){console.error("Erro ao excluir evento:",e),alert("Não foi possível excluir o evento. Tente novamente.")}}});p();
