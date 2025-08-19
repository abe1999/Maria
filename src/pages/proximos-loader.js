// Importa as funções do Firebase
import { db } from "/src/firebase-config.js";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";

// Importa nossa função centralizada de criar o card
import { createEventCard } from "/src/utils/helpers.js";

// A função que será exportada e chamada pela página de "Próximos Eventos"
export async function initializeProximosEventos() {
  const container = document.querySelector(".eventos-grid"); // Assumindo que o container tem esta classe
  if (!container) return;

  container.innerHTML = "<p>Carregando próximos eventos...</p>";

  try {
    // Pega a data e hora de agora
    const hoje = new Date();
    // A linha abaixo zera as horas/minutos para pegar eventos de hoje o dia todo
    hoje.setHours(0, 0, 0, 0);

    // ✨ A NOVA CONSULTA INTELIGENTE ✨
    // 1. Pega a coleção "eventos"
    // 2. Filtra (where) para pegar apenas onde a data for maior ou igual a hoje
    // 3. Ordena (orderBy) para que os eventos mais próximos apareçam primeiro
    const q = query(
      collection(db, "eventos"),
      where("date", ">=", hoje),
      orderBy("date", "asc")
    );

    const querySnapshot = await getDocs(q);

    const proximosEventos = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (proximosEventos.length === 0) {
      container.innerHTML =
        "<p>Nenhum evento futuro encontrado no momento.</p>";
      return;
    }

    // Renderiza os cards na tela
    container.innerHTML = proximosEventos.map(createEventCard).join("");
  } catch (error) {
    console.error("Erro ao buscar próximos eventos:", error);
    container.innerHTML =
      "<p>Não foi possível carregar os próximos eventos.</p>";
  }
}
