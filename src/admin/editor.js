import { db, storage } from "../firebase-config.js";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// --- ELEMENTOS DO DOM ---
const editorTitle = document.getElementById("editor-title");
const eventForm = document.getElementById("event-form");
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const excerptInput = document.getElementById("excerpt");
const fullTextInput = document.getElementById("fullText");
const imageUploadInput = document.getElementById("imageUpload");
const imagePreview = document.getElementById("image-preview");
const currentImagePath = document.getElementById("current-image-path");
const categoryInput = document.getElementById("category");
const linkInput = document.getElementById("link");
const saveButton = document.getElementById("save-button");
const uploadProgressContainer = document.getElementById(
  "upload-progress-container"
);
const uploadProgress = document.getElementById("upload-progress");
const uploadProgressText = document.getElementById("upload-progress-text");

// --- LÓGICA PRINCIPAL ---

const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");
const isEditMode = Boolean(eventId);
let imageUrlToSave = ""; // Guarda a URL da imagem a ser salva no Firestore

// Função para carregar dados do evento no modo de edição
async function loadEventData() {
  if (!isEditMode) {
    editorTitle.textContent = "Adicionar Novo Evento";
    return;
  }

  try {
    editorTitle.textContent = "Editar Evento";
    const docRef = doc(db, "eventos", eventId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      titleInput.value = data.title || "";
      dateInput.value = data.date
        ? data.date.toDate().toISOString().split("T")[0]
        : "";
      excerptInput.value = data.excerpt || "";
      fullTextInput.value = data.fullText || "";
      categoryInput.value = data.category || "noticia";
      linkInput.value = data.link || "";

      if (data.image) {
        imageUrlToSave = data.image; // Guarda a URL da imagem atual
        imagePreview.src = imageUrlToSave;
        imagePreview.style.display = "block";
        currentImagePath.textContent = `Imagem atual: ${
          imageUrlToSave.split("/").pop().split("?")[0]
        }`;
      }
    } else {
      alert("Evento não encontrado!");
      window.location.href = "/src/admin/dashboard.html";
    }
  } catch (error) {
    console.error("Erro ao carregar evento:", error);
    alert("Não foi possível carregar os dados do evento.");
  }
}

// --- LÓGICA DE UPLOAD E SALVAMENTO ---

// Mostra a pré-visualização da imagem selecionada
imageUploadInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
    currentImagePath.textContent = `Nova imagem selecionada: ${file.name}`;
  }
});

// Listener para o envio do formulário
eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";

  const newImageFile = imageUploadInput.files[0];

  try {
    // PASSO 1: UPLOAD DA IMAGEM (se uma nova foi selecionada)
    if (newImageFile) {
      // Cria um nome único para o arquivo baseado na data/hora atual
      const filePath = `eventos/${Date.now()}-${newImageFile.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, newImageFile);

      // Listener para o progresso do upload
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploadProgressContainer.style.display = "block";
          uploadProgress.value = progress;
          uploadProgressText.textContent = `Enviando imagem: ${Math.round(
            progress
          )}%`;
        },
        (error) => {
          // Erro no upload
          console.error("Erro no upload:", error);
          throw new Error("Falha ao enviar a imagem.");
        },
        async () => {
          // Upload completo
          imageUrlToSave = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("Imagem disponível em:", imageUrlToSave);
          // Depois que o upload termina, salva os dados no Firestore
          await saveData();
        }
      );
    } else {
      // Se nenhuma imagem nova foi selecionada, apenas salva os dados
      await saveData();
    }
  } catch (error) {
    console.error("Erro no processo de salvamento:", error);
    alert(`Erro ao salvar: ${error.message}`);
    saveButton.disabled = false;
    saveButton.textContent = "Salvar Evento";
  }
});

// Função que reúne os dados e salva no Firestore
async function saveData() {
  // PASSO 2: PREPARAR OS DADOS DO FORMULÁRIO
  const eventData = {
    title: titleInput.value,
    date: Timestamp.fromDate(new Date(dateInput.value + "T00:00:00")),
    excerpt: excerptInput.value,
    fullText: fullTextInput.value,
    category: categoryInput.value,
    link: linkInput.value,
    image: imageUrlToSave, // Usa a URL da imagem (a antiga ou a nova do upload)
  };

  try {
    // PASSO 3: SALVAR NO FIRESTORE (CRIAR ou ATUALIZAR)
    if (isEditMode) {
      // ATUALIZA um documento existente
      const docRef = doc(db, "eventos", eventId);
      await updateDoc(docRef, eventData);
      alert("Evento atualizado com sucesso!");
    } else {
      // CRIA um novo documento
      await addDoc(collection(db, "eventos"), eventData);
      alert("Evento cadastrado com sucesso!");
    }

    // PASSO 4: REDIRECIONAR PARA O PAINEL
    window.location.href = "/src/admin/dashboard.html";
  } catch (error) {
    console.error("Erro ao salvar no Firestore:", error);
    throw new Error("Falha ao salvar os dados no banco de dados.");
  }
}

// --- INICIALIZAÇÃO ---
loadEventData();
