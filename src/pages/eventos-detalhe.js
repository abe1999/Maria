document.addEventListener("DOMContentLoaded", function () {
  // Função para pegar o ID do evento da URL
  function getEventId() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get("id"), 10);
  }

  // Função para formatar a data que está no padrão AAAA-MM-DD
  function formatarData(dateString) {
    // 1. Pega a string da data (ex: "2025-07-28") e adiciona um horário
    // para garantir que o fuso horário não cause problemas.
    const data = new Date(dateString + "T00:00:00");

    // 2. Formata a data para ser exibida ao usuário.
    // Podemos escolher o formato que quisermos!
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit", // dia com 2 dígitos: "28"
      month: "long", // mês por extenso: "julho"
      year: "numeric", // ano numérico: "2025"
    });
  }
  // Função principal para buscar e exibir os detalhes do evento
  async function loadEventDetail() {
    const eventId = getEventId();
    const container = document.querySelector(".event-detail-page .container");

    if (isNaN(eventId)) {
      container.innerHTML =
        "<h1>Evento não encontrado</h1><p>O ID fornecido na URL é inválido.</p>";
      return;
    }

    try {
      // [MELHORIA] Usando caminho relativo para mais portabilidade
      const response = await fetch("../data/eventos.json");
      if (!response.ok)
        throw new Error("Não foi possível carregar os dados dos eventos.");

      const allEvents = await response.json();
      const eventItem = allEvents.find((item) => item.id === eventId);

      if (!eventItem) {
        throw new Error("O evento com este ID não foi encontrado.");
      }

      // --- Preenchendo a página com os dados ---
      document.title = `${eventItem.title} - Paróquia N. S. de Nazaré`;
      document.getElementById("event-title-full").textContent = eventItem.title;

      // [MELHORIA] Aplicando a formatação da data
      document.getElementById(
        "event-date-full"
      ).textContent = `Data do evento: ${formatarData(eventItem.date)}`;

      const mainImage = document.getElementById("event-image-large");
      mainImage.src = eventItem.image;
      mainImage.alt = eventItem.title;

      document.getElementById("event-text-full").innerHTML = eventItem.fullText;

      // --- Montando a galeria de fotos ---
      if (eventItem.galleryImages && eventItem.galleryImages.length > 0) {
        document.getElementById("event-gallery-container").style.display =
          "block";
        const gallery = document.getElementById("event-gallery");
        gallery.innerHTML = eventItem.galleryImages
          .map(
            (imgUrl) => `
                    <a href="${imgUrl}" target="_blank" title="Clique para ampliar">
                        <img src="${imgUrl}" alt="Foto da galeria do evento">
                    </a>
                `
          )
          .join("");
      }

      // --- Montando o link do Google Drive ---
      if (eventItem.driveLink) {
        const driveContainer = document.getElementById(
          "event-drive-link-container"
        );
        driveContainer.innerHTML = `<a href="${eventItem.driveLink}" class="btn" target="_blank">Ver álbum completo ou baixar fotos</a>`;
      }
    } catch (error) {
      console.error("Erro detalhado:", error);
      container.innerHTML = `<h1>Erro ao Carregar Evento</h1><p>${error.message}</p>`;
    }
  }

  loadEventDetail();
});
