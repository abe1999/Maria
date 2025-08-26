import { db } from "/src/firebase-config.js";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";

const slidesContainer = document.getElementById("slides-list-container");

async function loadSlides() {
  if (!slidesContainer) return;

  try {
    // CORREÇÃO: Usando a coleção "destaques" para consistência
    const q = query(collection(db, "destaques"), orderBy("ordem", "asc"));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      slidesContainer.innerHTML = "<p>Nenhum slide cadastrado ainda.</p>";
      return;
    }

    slidesContainer.innerHTML = querySnapshot.docs
      .map((doc) => {
        const slide = doc.data();
        const slideId = doc.id;
        return `
          <div class="event-item" id="slide-${slideId}">
            <img src="${
              slide.imageUrl
            }" alt="Miniatura" style="width: 100px; height: 50px; object-fit: cover; margin-right: 20px; border-radius: 4px;">

            <div class="event-item-info">
              <span class="event-item-title">${slide.texto} (Ordem: ${
          slide.ordem
        })</span>
              <span class="event-item-date">${
                slide.ativo ? "✔️ Ativo" : "❌ Inativo"
              }</span>
            </div>
            <div class="event-item-actions">
              <a href="editor-destaque.html?id=${slideId}" class="btn btn-edit">Editar</a>
              <button class="btn btn-delete" data-id="${slideId}">Excluir</button>
            </div>
          </div>
        `;
      })
      .join("");
  } catch (error) {
    // Esta é a linha que está mostrando o erro agora
    console.error("Erro ao carregar slides:", error);
    slidesContainer.innerHTML =
      "<p>Erro ao carregar os slides. Verifique as permissões no Firestore.</p>";
  }
}

slidesContainer.addEventListener("click", async (event) => {
  if (event.target.classList.contains("btn-delete")) {
    const slideId = event.target.dataset.id;
    if (confirm("Tem certeza que deseja excluir este slide?")) {
      try {
        // CORREÇÃO: Usando a coleção "destaques" aqui também
        await deleteDoc(doc(db, "destaques", slideId));

        alert("Slide excluído com sucesso!");
        document.getElementById(`slide-${slideId}`).remove();
      } catch (error) {
        console.error("Erro ao excluir slide:", error);
        alert("Não foi possível excluir o slide.");
      }
    }
  }
});

// A execução começa aqui
loadSlides();
