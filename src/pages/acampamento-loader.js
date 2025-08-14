document.addEventListener("DOMContentLoaded", () => {
  const tabsContainer = document.getElementById("acampamento-tabs");
  const contentContainer = document.getElementById("acampamento-content");

  // Se os containers não existirem na página, o script para.
  if (!tabsContainer || !contentContainer) return;

  fetch("/data/acampamentos.json")
    .then((response) => response.json())
    .then((acampamentos) => {
      if (!acampamentos || acampamentos.length === 0) return;

      let tabsHTML = "";
      let contentHTML = "";

      acampamentos.forEach((acampamento, index) => {
        const isActive = index === 0 ? "active" : "";

        // Cria o botão da aba
        tabsHTML += `<button class="tab-link ${isActive} ${
          acampamento.classeCor
        }" data-tab="tab-${acampamento.id}">${acampamento.nome.replace(
          "Acampamento ",
          ""
        )}</button>`;

        // Cria a lista de detalhes
        let detalhesHTML = acampamento.detalhes
          .map(
            (detalhe) =>
              `<li><i class="${detalhe.icone}"></i> <strong>${detalhe.titulo}:</strong> ${detalhe.valor}</li>`
          )
          .join("");

        // Cria a galeria de fotos
        let fotosHTML = acampamento.fotos
          .map(
            (fotoUrl) =>
              `<img src="${fotoUrl}" alt="Foto do ${acampamento.nome}" />`
          )
          .join("");

        // Cria o player de vídeo
        let videoHTML = "";
        if (acampamento.video && acampamento.video.url) {
          const videoTag = acampamento.video.url.includes("youtube.com")
            ? `<iframe src="${acampamento.video.url}" title="Depoimento de Campista" frameborder="0" allowfullscreen></iframe>`
            : `<video src="${acampamento.video.url}" controls width="100%"></video>`;
          videoHTML = `
                        <div class="video-depoimento">
                            <h4>${acampamento.video.titulo}</h4>
                            ${videoTag}
                        </div>
                    `;
        }

        // =============================================================
        // CRIA O PAINEL DE CONTEÚDO COM A NOVA LÓGICA DE 2 COLUNAS
        // =============================================================
        contentHTML += `
                    <div class="tab-content ${isActive}" id="tab-${acampamento.id}">
                        <div class="content-column">
                            <div class="acampamento-titulo ${acampamento.classeCor}">
                                <i class="${acampamento.icone}"></i>
                                <h3>${acampamento.nome}</h3>
                            </div>
                            <p class="descricao">${acampamento.descricao}</p>
                            <ul class="acampamento-detalhes">${detalhesHTML}</ul>
                            ${videoHTML}
                        </div>

                        <div class="photos-column">
                            ${fotosHTML}
                        </div>
                    </div>
                `;
      });

      // Insere o HTML gerado na página
      tabsContainer.innerHTML = tabsHTML;
      contentContainer.innerHTML = contentHTML;

      // --- Lógica de clique para fazer as abas funcionarem ---
      const tabLinks = document.querySelectorAll(".tab-link");

      tabLinks.forEach((link) => {
        link.addEventListener("click", () => {
          document.querySelector(".tab-link.active").classList.remove("active");
          document
            .querySelector(".tab-content.active")
            .classList.remove("active");

          link.classList.add("active");
          document.getElementById(link.dataset.tab).classList.add("active");
        });
      });
    })
    .catch((error) =>
      console.error("Erro ao carregar dados dos acampamentos:", error)
    );
});
