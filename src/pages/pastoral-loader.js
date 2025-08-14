document.addEventListener("DOMContentLoaded", function () {
  const pastoraisGridContainer = document.querySelector(".pastorais-grid");
  const pastoralDetailContainer = document.querySelector(
    ".pastoral-detail-page"
  );

  // Função para criar o card na página de listagem
  function createPastoralCard(pastoral) {
    return `
            <div class="pastoral-card">
                <img src="${pastoral.image}" alt="${pastoral.name}">
                <div class="card-content">
                    <h3>${pastoral.name}</h3>
                    <p>${pastoral.excerpt}</p>
                    <a href="/pages/pastoral-detalhe.html?id=${pastoral.id}" class="btn-secondary">Saiba Mais</a>
                </div>
            </div>
        `;
  }

  // Função para carregar os dados do JSON
  async function loadPastorais() {
    try {
      const response = await fetch("/data/pastorais.json");
      const pastorais = await response.json();

      // Lógica para a PÁGINA DE LISTAGEM
      if (pastoraisGridContainer) {
        pastoraisGridContainer.innerHTML = pastorais
          .map(createPastoralCard)
          .join("");
      }

      // Lógica para a PÁGINA DE DETALHE
      if (pastoralDetailContainer) {
        const params = new URLSearchParams(window.location.search);
        const pastoralId = params.get("id");

        const pastoral = pastorais.find((p) => p.id === pastoralId);

        if (pastoral) {
          document.title = `${pastoral.name} - Paróquia N. S. de Nazaré`;
          document.getElementById("pastoral-name").textContent = pastoral.name;
          document.getElementById("pastoral-image").src = pastoral.image;
          document.getElementById("pastoral-objective").textContent =
            pastoral.objective;
          document.getElementById("pastoral-how-to-participate").textContent =
            pastoral.howToParticipate;
          document.getElementById("pastoral-who-can-join").textContent =
            pastoral.whoCanJoin;
          document.getElementById("pastoral-schedule").textContent =
            pastoral.schedule;
          document.getElementById("coordinator-name").textContent =
            pastoral.coordinator.name;
          document.getElementById("coordinator-contact").textContent =
            pastoral.coordinator.contact;

          // Preenche a lista de atividades
          const activitiesList = document.getElementById("pastoral-activities");
          activitiesList.innerHTML = pastoral.activities
            .map((activity) => `<li>${activity}</li>`)
            .join("");
        }
      }
    } catch (error) {
      console.error("Falha ao carregar dados das pastorais:", error);
    }
  }

  loadPastorais();
});
