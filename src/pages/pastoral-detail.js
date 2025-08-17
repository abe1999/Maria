// /assets/js/pastoral-detail.js

document.addEventListener("DOMContentLoaded", function () {
  const pastoralDetailContainer = document.querySelector(
    ".pastoral-detail-page"
  );

  async function loadPastoralDetail() {
    if (!pastoralDetailContainer) return;

    try {
      // Pega o ID da pastoral pela URL
      const params = new URLSearchParams(window.location.search);
      const pastoralId = params.get("id");

      if (!pastoralId) return; // Não faz nada se não houver ID

      const response = await fetch("/data/pastorais.json");
      const pastorais = await response.json();

      const pastoral = pastorais.find((p) => p.id === pastoralId);

      if (pastoral) {
        // Preenche todos os campos da página de detalhe
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

        const activitiesList = document.getElementById("pastoral-activities");
        activitiesList.innerHTML = pastoral.activities
          .map((activity) => `<li>${activity}</li>`)
          .join("");
      }
    } catch (error) {
      console.error("Falha ao carregar detalhes da pastoral:", error);
    }
  }

  loadPastoralDetail();
});
