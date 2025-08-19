// Importa as funções do Firebase
import { db } from "/src/firebase-config.js";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";

// Importa nossa nova função centralizada de criar o card
import { createEventCard } from "/src/utils/helpers.js";

// A função que o main.js chama, agora conectada ao Firebase
export async function initializeHomepageNews() {
  const container = document.getElementById("latest-news-grid");
  if (!container) return;

  container.innerHTML = "<p>Carregando as últimas notícias...</p>";

  try {
    // Cria a consulta: busca na coleção "eventos", ordena por data (desc) e LIMITA o resultado aos 3 mais recentes.
    const q = query(
      collection(db, "eventos"),
      orderBy("date", "desc"),
      limit(3)
    );

    const querySnapshot = await getDocs(q);

    const latestEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (latestEvents.length === 0) {
      container.innerHTML = "<p>Nenhuma notícia encontrada.</p>";
      return;
    }

    // Renderiza os 3 cards na tela usando a função importada
    container.innerHTML = latestEvents.map(createEventCard).join("");
  } catch (error) {
    console.error("Erro ao buscar últimas notícias:", error);
    container.innerHTML = "<p>Não foi possível carregar as notícias.</p>";
  }
}
