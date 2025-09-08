// Local: /src/components/homepage-loader.js - VERSÃO CORRIGIDA

import { app } from "/src/firebase-config.js";
import {
  getFirestore,
  collection,
  query,
  where, // Adicionamos 'where' para o filtro de data
  orderBy, // Adicionamos 'orderBy' para ordenar
  limit,
  getDocs,
} from "firebase/firestore";

const db = getFirestore(app);

// Importa nossa função de criar o card
import { createHomepageNewsCard } from "/src/utils/helpers.js";

// A função que o main.js chama
export async function initializeHomepageNews() {
  const container = document.getElementById("latest-news-grid");
  if (!container) return;

  container.innerHTML = "<p>Carregando as últimas notícias...</p>";

  try {
    // Pega a data de hoje para fazer a comparação
    const hoje = new Date();

    // Consulta corrigida: busca na coleção "eventos",
    // filtra por datas que já passaram (<= hoje),
    // ordena pelas mais recentes e limita a 3.
    const q = query(
      collection(db, "eventos"),
      where("date", "<=", hoje), // <-- FILTRO DE DATA ADICIONADO
      orderBy("date", "desc"),
      limit(3)
    );

    const querySnapshot = await getDocs(q);

    const latestEvents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (latestEvents.length === 0) {
      container.innerHTML =
        "<p>Nenhuma notícia ou evento anterior encontrado.</p>";
      return;
    }

    // Renderiza os 3 cards na tela
    container.innerHTML = latestEvents.map(createHomepageNewsCard).join("");
  } catch (error) {
    console.error("Erro ao buscar últimas notícias:", error);
    container.innerHTML = "<p>Não foi possível carregar as notícias.</p>";
  }
}
