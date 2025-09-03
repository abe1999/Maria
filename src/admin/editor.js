// Local: /src/admin/editor.js - VERSÃO COM EDITOR DE TEXTO RICO (TinyMCE)

// --- 1. IMPORTAÇÕES ---
import { app } from "/src/firebase-config.js";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import imageCompression from "browser-image-compression";

const db = getFirestore(app);
const storage = getStorage(app);

// --- 2. INICIALIZAÇÃO DO EDITOR DE TEXTO ---
// Este bloco "transforma" sua textarea em um editor de texto rico.
tinymce.init({
  selector: "#fullText", // <<< Aponta para a sua textarea de texto completo do evento
  plugins: "lists link image emoticons",
  toolbar:
    "undo redo | styles | bold italic underline | bullist numlist | link image emoticons",
  height: 400,
  menubar: false,
  placeholder: "Digite o texto completo do evento aqui...",
  setup: function (editor) {
    // Garante que o carregamento dos dados só aconteça DEPOIS que o editor estiver pronto.
    editor.on("init", function () {
      loadEventData();
    });
  },
});

// --- 3. ELEMENTOS DO DOM ---
const editorTitle = document.getElementById("editor-title");
const eventForm = document.getElementById("event-form");
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const excerptInput = document.getElementById("excerpt");
// const fullTextInput = document.getElementById("fullText"); // Não precisamos mais dele diretamente
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
const galleryImageInputs = [
  document.getElementById("galleryImage1"),
  document.getElementById("galleryImage2"),
  document.getElementById("galleryImage3"),
];

// --- 4. LÓGICA PRINCIPAL ---
const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");
const isEditMode = Boolean(eventId);
let existingImageUrl = "";
let existingGalleryUrls = [];

// Função de upload (sem alterações)
async function uploadFile(file) {
  // ... (sua função de upload continua a mesma)
}

// Função para carregar dados (com pequena alteração)
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
      categoryInput.value = data.category || "noticia";
      linkInput.value = data.link || "";

      // ## ALTERAÇÃO AQUI: Define o conteúdo no editor TinyMCE ##
      tinymce.get("fullText").setContent(data.fullText || "");

      if (data.image) {
        existingImageUrl = data.image;
        imagePreview.src = existingImageUrl;
        imagePreview.style.display = "block";
        currentImagePath.textContent = `Imagem atual carregada.`;
      }
      // ... (resto da sua lógica de galeria)
    } else {
      alert("Evento não encontrado!");
      window.location.href = "/admin/dashboard.html"; // Corrigido para não ter /src/
    }
  } catch (error) {
    console.error("Erro ao carregar evento:", error);
    alert("Não foi possível carregar os dados do evento.");
  }
}

// Preview da imagem principal (sem alterações)
imageUploadInput.addEventListener("change", (event) => {
  // ... (sua lógica de preview continua a mesma)
});

// Evento de SUBMIT (com pequena alteração)
eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";

  try {
    // ... (sua lógica de upload de imagens continua a mesma)
    let mainImageUrl = existingImageUrl;
    // ...
    let galleryUrls = existingGalleryUrls;
    // ...

    // ## ALTERAÇÃO AQUI: Pega o conteúdo do editor TinyMCE ##
    const fullTextContent = tinymce.get("fullText").getContent();

    const eventData = {
      title: titleInput.value,
      date: Timestamp.fromDate(new Date(dateInput.value + "T00:00:00")),
      excerpt: excerptInput.value,
      fullText: fullTextContent, // Usa o conteúdo do editor
      category: categoryInput.value,
      link: linkInput.value,
      image: mainImageUrl,
      galeriaUrls: galleryUrls,
    };

    if (isEditMode) {
      const docRef = doc(db, "eventos", eventId);
      await updateDoc(docRef, eventData);
      alert("Evento atualizado com sucesso!");
    } else {
      await addDoc(collection(db, "eventos"), eventData);
      alert("Evento cadastrado com sucesso!");
    }
    window.location.href = "dashboard.html";
  } catch (error) {
    // ... (sua lógica de erro continua a mesma)
  }
});

// A chamada `loadEventData()` foi movida para dentro do `tinymce.init`
