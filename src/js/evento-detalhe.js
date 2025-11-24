// Local: /src/js/evento-detalhe.js - VERSÃO FINAL REVISADA

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

// Firebase
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

// --- 3. LÓGICA DA PÁGINA ---
const articleContainer = document.getElementById("article-main-content");
const rsvpContainer = document.getElementById("rsvp-container");
const extraContainer = document.getElementById("event-extra-content");

async function initializePage() {
  // Verifica se a estrutura do HTML está correta
  if (!articleContainer || !extraContainer || !rsvpContainer) {
    console.error("Erro: Containers principais não encontrados no HTML.");
    return;
  }

  try {
    const params = new URLSearchParams(window.location.search);
    const eventId = params.get("id");
    if (!eventId) {
      articleContainer.innerHTML = `<h1>ID do evento não fornecido.</h1>`;
      return;
    }

    const docRef = doc(db, "eventos", eventId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const eventItem = { id: docSnap.id, ...docSnap.data() };

      // 1. Preenche o conteúdo principal
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

      // Limpa containers extras
      extraContainer.innerHTML = "";
      rsvpContainer.innerHTML = "";

      // 2. Lógica de Inscrições (RSVP)
      if (eventItem.rsvpOptions && eventItem.rsvpOptions.length > 0) {
        let rsvpHTML = "<h2>Inscrições</h2>";

        eventItem.rsvpOptions.forEach((option) => {
          const storageKey = `inscrito_${option.id}`;
          const inscricaoSalva = localStorage.getItem(storageKey);

          if (inscricaoSalva) {
            // Visual para quem já se inscreveu
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
            // Visual para nova inscrição
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

      // 3. Lógica da Galeria
      if (eventItem.galleryUrls && eventItem.galleryUrls.length > 0) {
        let galleryHTML = `<div class="event-gallery-container"><h2>Galeria de Fotos</h2><div class="event-gallery">`;
        galleryHTML += eventItem.galleryUrls
          .map((imgUrl) => {
            const safeImgUrl = buildSafeURL(imgUrl);
            return `<a href="${safeImgUrl}" target="_blank"><img src="${safeImgUrl}" alt="Foto da galeria"></a>`;
          })
          .join("");
        galleryHTML += `</div></div>`;
        extraContainer.innerHTML += galleryHTML;
      }

      // 4. Lógica do Link do Drive (CORRIGIDA PARA ACEITAR OS DOIS FORMATOS)
      const linkDoDrive = eventItem.driveAlbumUrl || eventItem.link;

      if (linkDoDrive) {
        const driveHTML = `
            <div class="event-drive-link-container" style="text-align: center; margin-top: 30px;">
                <a href="${linkDoDrive}" class="btn btn-primary" target="_blank">
                    <i class="fa-brands fa-google-drive"></i> Ver Álbum Completo
                </a>
            </div>`;
        extraContainer.innerHTML += driveHTML;
      }
    } else {
      articleContainer.innerHTML = `<h1>Evento não encontrado.</h1>`;
    }
  } catch (error) {
    console.error("Erro ao buscar detalhes do evento:", error);
    articleContainer.innerHTML = `<h1>Ocorreu um erro ao carregar o evento.</h1>`;
  }
}

// --- FUNÇÃO DE CLIQUE DO RSVP ---
async function handleRsvpClick(event) {
  // Verifica se o clique foi no botão correto
  if (!event.target.classList.contains("btn-rsvp")) return;

  const button = event.target;
  const optionId = button.dataset.id;
  const optionText = button.dataset.text;
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

      // Salva no Firebase (incrementando o contador)
      await setDoc(
        counterRef,
        {
          contagem: increment(quantity),
          ultimaInscricao: serverTimestamp(),
        },
        { merge: true }
      );

      // Salva no navegador do usuário
      localStorage.setItem(`inscrito_${optionId}`, quantity);

      // Atualiza a tela
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

// --- EXECUÇÃO ---
initializePage();

// Adiciona o ouvinte de eventos apenas se o container existir
if (rsvpContainer) {
  rsvpContainer.addEventListener("click", handleRsvpClick);
}
