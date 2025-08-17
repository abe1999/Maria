import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{const i=document.getElementById("acampamento-tabs"),s=document.getElementById("acampamento-content");!i||!s||fetch("/data/acampamentos.json").then(e=>e.json()).then(e=>{if(!e||e.length===0)return;let c="",d="";e.forEach((t,r)=>{const n=r===0?"active":"";c+=`<button class="tab-link ${n} ${t.classeCor}" data-tab="tab-${t.id}">${t.nome.replace("Acampamento ","")}</button>`;let a=t.detalhes.map(o=>`<li><i class="${o.icone}"></i> <strong>${o.titulo}:</strong> ${o.valor}</li>`).join(""),v=t.fotos.map(o=>`<img src="${o}" alt="Foto do ${t.nome}" />`).join(""),l="";if(t.video&&t.video.url){const o=t.video.url.includes("youtube.com")?`<iframe src="${t.video.url}" title="Depoimento de Campista" frameborder="0" allowfullscreen></iframe>`:`<video src="${t.video.url}" controls width="100%"></video>`;l=`
                        <div class="video-depoimento">
                            <h4>${t.video.titulo}</h4>
                            ${o}
                        </div>
                    `}d+=`
                    <div class="tab-content ${n}" id="tab-${t.id}">
                        <div class="content-column">
                            <div class="acampamento-titulo ${t.classeCor}">
                                <i class="${t.icone}"></i>
                                <h3>${t.nome}</h3>
                            </div>
                            <p class="descricao">${t.descricao}</p>
                            <ul class="acampamento-detalhes">${a}</ul>
                            ${l}
                        </div>

                        <div class="photos-column">
                            ${v}
                        </div>
                    </div>
                `}),i.innerHTML=c,s.innerHTML=d,document.querySelectorAll(".tab-link").forEach(t=>{t.addEventListener("click",()=>{document.querySelector(".tab-link.active").classList.remove("active"),document.querySelector(".tab-content.active").classList.remove("active"),t.classList.add("active"),document.getElementById(t.dataset.tab).classList.add("active")})})}).catch(e=>console.error("Erro ao carregar dados dos acampamentos:",e))});
