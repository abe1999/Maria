import { db, auth } from "/src/firebase-config.js";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";

const logoutButton = document.getElementById("logout-button");
const eventsContainer = document.getElementById("events-list-container");
// NOVO: Pega o input da barra de busca
const searchInput = document.getElementById("search-input");

// --- 1. LÓGICA DE LOGOUT (Sem alterações) ---
logoutButton.addEventListener("click", async () => {
  if (confirm("Tem certeza que deseja sair?")) {
    try {
      await signOut(auth);
      alert("Você saiu com sucesso.");
      window.location.href = "/admin/login.html";
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Não foi possível sair. Tente novamente.");
    }
  }
});

// --- 2. LÓGICA PARA CARREGAR E EXIBIR EVENTOS (Com alterações) ---
async function loadEvents() {
  if (!eventsContainer) return;

  try {
    // Sua consulta já estava perfeita, ordenando por data descendente
    const q = query(collection(db, "eventos"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);

    const events = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (events.length === 0) {
      eventsContainer.innerHTML = "<p>Nenhum evento cadastrado ainda.</p>";
      return;
    }

    // ALTERADO: Agora o HTML inclui a data formatada
    eventsContainer.innerHTML = events
      .map((event) => {
        // Formata a data para o padrão brasileiro (dd/mm/aaaa)
        const dataFormatada = event.date
          .toDate()
          .toLocaleDateString("pt-BR", { timeZone: "UTC" });

        return `
          <div class="event-item" id="event-${event.id}">
            <div class="event-item-info">
                <span class="event-item-title">${event.title}</span>
                <span class="event-item-date">${dataFormatada}</span>
            </div>
            <div class="event-item-actions">
              <a href="/src/admin/editor.html?id=${event.id}" class="btn btn-edit">Editar</a>
              <button class="btn btn-delete" data-id="${event.id}">Excluir</button>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    eventsContainer.innerHTML = "<p>Erro ao carregar eventos.</p>";
  }
}

// --- 3. LÓGICA PARA DELETAR EVENTOS (Sem alterações) ---
eventsContainer.addEventListener("click", async (event) => {
  if (event.target.classList.contains("btn-delete")) {
    const eventId = event.target.dataset.id;
    const eventTitle = document.querySelector(
      `#event-${eventId} .event-item-title`
    ).textContent;

    if (
      confirm(
        `Tem certeza que deseja excluir o evento "${eventTitle}"? Esta ação não pode ser desfeita.`
      )
    ) {
      try {
        const docRef = doc(db, "eventos", eventId);
        await deleteDoc(docRef);
        alert("Evento excluído com sucesso!");
        document.getElementById(`event-${eventId}`).remove();
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
        alert("Não foi possível excluir o evento. Tente novamente.");
      }
    }
  }
});

// --- 4. NOVO: LÓGICA DO FILTRO DE BUSCA ---
searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const allEvents = document.querySelectorAll(".event-item");

  allEvents.forEach((eventElement) => {
    const titleElement = eventElement.querySelector(".event-item-title");
    if (titleElement) {
      const title = titleElement.textContent.toLowerCase();

      // Se o título do evento incluir o termo de busca, ele é exibido. Se não, é escondido.
      if (title.includes(searchTerm)) {
        eventElement.style.display = "flex"; // Use 'flex' para corresponder ao estilo
      } else {
        eventElement.style.display = "none";
      }
    }
  });
});

// --- INICIALIZAÇÃO ---
loadEvents();
