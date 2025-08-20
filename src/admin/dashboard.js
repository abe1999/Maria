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

// --- 1. LÓGICA DE LOGOUT ---
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

// --- 2. LÓGICA PARA CARREGAR E EXIBIR EVENTOS ---
async function loadEvents() {
  if (!eventsContainer) return;

  try {
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

    // Gera o HTML para cada item da lista
    eventsContainer.innerHTML = events
      .map(
        (event) => `
      <div class="event-item" id="event-${event.id}">
        <span class="event-item-title">${event.title}</span>
        <div class="event-item-actions">
          <a href="/src/admin/editor.html?id=${event.id}" class="btn btn-edit">Editar</a>
          <button class="btn btn-delete" data-id="${event.id}">Excluir</button>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Erro ao carregar eventos:", error);
    eventsContainer.innerHTML = "<p>Erro ao carregar eventos.</p>";
  }
}

// --- 3. LÓGICA PARA DELETAR EVENTOS ---
eventsContainer.addEventListener("click", async (event) => {
  // Verifica se o clique foi em um botão com a classe 'btn-delete'
  if (event.target.classList.contains("btn-delete")) {
    const eventId = event.target.dataset.id;
    const eventTitle = document.querySelector(
      `#event-${eventId} .event-item-title`
    ).textContent;

    // Pede confirmação antes de deletar
    if (
      confirm(
        `Tem certeza que deseja excluir o evento "${eventTitle}"? Esta ação não pode ser desfeita.`
      )
    ) {
      try {
        // Pega a referência do documento no Firestore
        const docRef = doc(db, "eventos", eventId);
        // Deleta o documento
        await deleteDoc(docRef);

        alert("Evento excluído com sucesso!");
        // Remove o item da tela sem precisar recarregar a página
        document.getElementById(`event-${eventId}`).remove();
      } catch (error) {
        console.error("Erro ao excluir evento:", error);
        alert("Não foi possível excluir o evento. Tente novamente.");
      }
    }
  }
});

// --- INICIALIZAÇÃO ---
// Chama a função para carregar os eventos assim que a página abre
loadEvents();
