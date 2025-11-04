// Local: /src/js/evento-detalhe.js - VERSÃO FINAL COM TUDO (INSCRIÇÃO + GALERIA)

// --- 1. IMPORTAÇÕES ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/article.css";
import "/src/styles/components/buttons.css";
import "/src/styles/components/page-header.css";
import "/src/styles/pages/evento-detalhe.css";

// Componentes e Funções
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";
import { formatarData, buildSafeURL } from "/src/utils/helpers.js";

// ## MODIFICADO: Adiciona as novas funções do Firestore ##
import { app } from "../firebase-config.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  increment,
  serverTimestamp,
} from "firebase/firestore";
const db = getFirestore(app);

// --- 2. MONTAGEM DA PÁGINA ---
renderHeader();
renderFooter();

// --- 3. LÓGICA ESPECÍFICA DA PÁGINA ---
// ## ADICIONADO: Busca o novo container de inscrição ##
const articleContainer = document.getElementById("article-main-content");
const rsvpContainer = document.getElementById("rsvp-container");
const extraContainer = document.getElementById("event-extra-content");

async function initializePage() {
  if (!articleContainer || !extraContainer || !rsvpContainer) {
    console.error(
      "Erro: Um dos containers principais (article, rsvp, extra) não foi encontrado no HTML."
    );
    return;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");
    if (!eventId) {
      /* ... */ return;
    }

    const docRef = doc(db, "eventos", eventId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const eventItem = { id: docSnap.id, ...docSnap.data() };

      // Preenche o conteúdo principal (como antes)
      document.title = `${eventItem.title} - Paróquia N. S. de Nazaré`;
      const imageUrl = eventItem.imageUrl || "/img/placeholder-evento.jpg";
      articleContainer.innerHTML = `
        <h1 class="page-title">${eventItem.title}</h1>
        <p class="article-category">Data: ${formatarData(eventItem.date)}</p>
        <img src="${buildSafeURL(imageUrl)}" alt="${
        eventItem.title
      }" class="main-event-image">
        <div class="article-content">${eventItem.fullText}</div>
      `;

      // Limpa os containers de conteúdo extra
      extraContainer.innerHTML = "";
      rsvpContainer.innerHTML = "";

      // =======================================================
      // ## CÓDIGO ADICIONADO: Lógica do RSVP ##
      // =======================================================
      if (eventItem.rsvpOptions && eventItem.rsvpOptions.length > 0) {
        let rsvpHTML = "<h2>Inscrições</h2>";

        eventItem.rsvpOptions.forEach((option) => {
          const storageKey = `inscrito_${option.id}`;
          const inscricaoSalva = localStorage.getItem(storageKey);

          if (inscricaoSalva) {
            rsvpHTML += `
              <div class="rsvp-option">
                <span class="rsvp-text">${option.text}</span>
                <div class="rsvp-controls">
                  <button class="btn btn-rsvp confirmed" disabled>
                    Inscrição Confirmada (${inscricaoSalva} pessoa(s))
                  </button>
                </div>
              </div>`;
          } else {
            rsvpHTML += `
              <div class="rsvp-option">
                <span class="rsvp-text">${option.text}</span>
                <div class="rsvp-controls">
                  <label for="quantity-${option.id}">Quantidade:</label>
                  <select id="quantity-${option.id}" class="rsvp-quantity">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <button class="btn btn-primary btn-rsvp" data-id="${option.id}" data-text="${option.text}">
                    Confirmar Presença
                  </button>
                </div>
              </div>`;
          }
        });
        rsvpContainer.innerHTML = rsvpHTML;
      }

      // Lógica Condicional para Galeria (EXISTENTE)
      if (eventItem.galleryUrls && eventItem.galleryUrls.length > 0) {
        // ... (seu código da galeria, sem alterações)
      }

      // Lógica Condicional para Link do Drive (EXISTENTE)
      if (eventItem.link) {
        // ... (seu código do link do drive, sem alterações)
      }
    } else {
      articleContainer.innerHTML = `<h1>Evento não encontrado.</h1>`;
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do evento:", error);
    articleContainer.innerHTML = `<h1>Ocorreu um erro ao carregar o evento.</h1>`;
  }
}

// =======================================================
// ## CÓDIGO ADICIONADO: Nova função para o clique ##
// =======================================================
async function handleRsvpClick(event) {
  if (!event.target.classList.contains("btn-rsvp")) return;

  const button = event.target;
  const optionId = button.dataset.id;
  const optionText = button.dataset.text;

  // ## CORREÇÃO AQUI: Trocamos 'option.id' por 'optionId' ##
  const quantitySelect = document.getElementById(`quantity-${optionId}`);

  const quantity = Number(quantitySelect.value);

  if (quantity <= 0) return;

  if (
    confirm(
      `Confirmar inscrição de ${quantity} pessoa(s) para "${optionText}"?`
    )
  ) {
    button.disabled = true;
    button.textContent = "Salvando...";

    try {
      const counterRef = doc(db, "contadoresDeEventos", optionId);

      await setDoc(
        counterRef,
        {
          contagem: increment(quantity),
          ultimaInscricao: serverTimestamp(),
        },
        { merge: true }
      );

      localStorage.setItem(`inscrito_${optionId}`, quantity);

      button.textContent = `Inscrição Confirmada (${quantity} pessoa(s))`;
      button.classList.add("confirmed");
      button.classList.remove("btn-primary");
      if (quantitySelect) quantitySelect.disabled = true;
    } catch (error) {
      console.error("Erro ao salvar inscrição:", error);
      alert("Não foi possível salvar sua inscrição. Tente novamente.");
      button.disabled = false;
      button.textContent = "Confirmar Presença";
    }
  }
}

// Inicia a execução da lógica específica da página
initializePage();

// =======================================================
// ## CÓDIGO ADICIONADO: "Ouvinte" de cliques ##
// =======================================================
if (rsvpContainer) {
  rsvpContainer.addEventListener("click", handleRsvpClick);
}
