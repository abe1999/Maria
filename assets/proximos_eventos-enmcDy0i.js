import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{const s=document.getElementById("proximos-eventos-grid");fetch("/data/eventos.json").then(t=>t.json()).then(t=>{const o=new Date;o.setHours(0,0,0,0);const n=t.filter(e=>new Date(e.date)>=o);n.sort((e,d)=>new Date(e.date)-new Date(d.date));let a="";n.length>0?n.forEach(e=>{a+=`
                        <div class="news-card"> 
                            <img src="${e.image}" alt="${e.title}">
                            <div class="card-content">
                                <h3>${e.title}</h3>
                                <p>${e.summary}</p>
                                <span class="event-date">Data: ${new Date(e.date).toLocaleDateString("pt-BR",{timeZone:"UTC"})}</span>
                            </div>
                        </div>
                    `}):a="<p>Nenhum evento programado no momento. Volte em breve!</p>",s.innerHTML=a})});
