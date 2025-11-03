// Local: /src/admin/editor.js - VERSÃO COMPLETA E CORRIGIDA

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
tinymce.init({
  selector: "#fullText",
  plugins: "lists link image emoticons",
  toolbar:
    "undo redo | styles | bold italic underline | bullist numlist | link image emoticons",
  height: 400,
  menubar: false,
  placeholder: "Digite o texto completo do evento aqui...",
  setup: function (editor) {
    editor.on("init", function () {
      loadEventData(); // Carrega os dados do evento APÓS o editor estar pronto
    });
  },
});

// --- 3. ELEMENTOS DO DOM ---
const editorTitle = document.getElementById("editor-title");
const eventForm = document.getElementById("event-form");
const titleInput = document.getElementById("title");
const dateInput = document.getElementById("date");
const excerptInput = document.getElementById("excerpt");
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

const rsvpOption1TextInput = document.getElementById("rsvp_option_1_text");
const rsvpOption1IdInput = document.getElementById("rsvp_option_1_id");
const rsvpOption2TextInput = document.getElementById("rsvp_option_2_text");
const rsvpOption2IdInput = document.getElementById("rsvp_option_2_id");

// --- 4. LÓGICA PRINCIPAL ---
const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");
const isEditMode = Boolean(eventId);
let existingImageUrl = "";
let existingGalleryUrls = []; // Variável para guardar as URLs da galeria existente

// FUNÇÃO DE UPLOAD COMPLETA COM DEPURAÇÃO
async function uploadFile(file, isMainImage = false) {
  if (!file) return null;
  console.log(
    "✔️ PASSO 1: Função uploadFile iniciada para o arquivo:",
    file.name
  );

  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };
  console.log("✔️ PASSO 2: Comprimindo imagem...");
  const compressedFile = await imageCompression(file, options);
  console.log(
    `✅ PASSO 3: Compressão concluída. Novo tamanho: ${(
      compressedFile.size / 1024
    ).toFixed(2)} KB`
  );

  return new Promise((resolve, reject) => {
    const filePath = `eventos/${Date.now()}-${compressedFile.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        if (isMainImage) {
          // Só mostra o progresso para a imagem principal
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          uploadProgressContainer.style.display = "block";
          uploadProgress.value = progress;
          uploadProgressText.textContent = `Enviando imagem principal: ${Math.round(
            progress
          )}%`;
        }
      },
      (error) => {
        console.error(
          "❌ ERRO NO UPLOAD! Verifique as regras de segurança do Storage para a pasta 'eventos/'.",
          error
        );
        reject(new Error(`Falha ao enviar o arquivo. Código: ${error.code}`));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log("✅ PASSO 4: Upload bem-sucedido! URL:", downloadURL);
        resolve(downloadURL);
      }
    );
  });
}

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
      const data = docSnap.data(); // 'data' é definida AQUI
      titleInput.value = data.title || "";
      dateInput.value = data.date
        ? data.date.toDate().toISOString().split("T")[0]
        : "";
      excerptInput.value = data.excerpt || "";
      categoryInput.value = data.category || "noticia";
      linkInput.value = data.link || "";
      tinymce.get("fullText").setContent(data.fullText || "");

      if (data.imageUrl) {
        existingImageUrl = data.imageUrl;
        imagePreview.src = existingImageUrl;
        imagePreview.style.display = "block";
        currentImagePath.textContent = `Imagem atual carregada.`;
      }

      if (data.galleryUrls && data.galleryUrls.length > 0) {
        existingGalleryUrls = data.galleryUrls;
        const oldInfo = document.querySelector(".gallery-status-info");
        if (oldInfo) oldInfo.remove();
        const galleryInfoDiv = document.createElement("div");
        galleryInfoDiv.className = "gallery-status-info";
        galleryInfoDiv.innerHTML = `... (status da galeria) ...`;
        galleryImageInputs[2].parentElement.appendChild(galleryInfoDiv);
      }

      // ===============================================================
      // ## ESTE É O LUGAR CORRETO PARA O CÓDIGO DE CARREGAR O RSVP ##
      // Dentro de if(docSnap.exists())
      // ===============================================================
      if (data.rsvpOptions) {
        if (data.rsvpOptions[0]) {
          rsvpOption1TextInput.value = data.rsvpOptions[0].text || "";
          rsvpOption1IdInput.value = data.rsvpOptions[0].id || "";
        }
        if (data.rsvpOptions[1]) {
          rsvpOption2TextInput.value = data.rsvpOptions[1].text || "";
          rsvpOption2IdInput.value = data.rsvpOptions[1].id || "";
        }
      }
      // ===============================================================
    } else {
      alert("Evento não encontrado!");
      window.location.href = "dashboard.html";
    }
  } catch (error) {
    console.error("Erro ao carregar evento:", error);
    alert("Não foi possível carregar os dados do evento.");
  }
}

// LÓGICA DE SUBMIT COMPLETA (JÁ INCLUI A GALERIA)
eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";

  try {
    console.log("✔️ PASSO 0: Formulário enviado.");
    let mainImageUrl = existingImageUrl;
    const newMainImageFile = imageUploadInput.files[0];
    if (newMainImageFile) {
      mainImageUrl = await uploadFile(newMainImageFile, true);
    }
    console.log("✔️ PASSO 5: Upload da imagem principal concluído.");

    const galleryFiles = galleryImageInputs
      .map((input) => input.files[0])
      .filter(Boolean);
    let galleryUrls = existingGalleryUrls;
    if (galleryFiles.length > 0) {
      console.log(`✔️ PASSO 6: Iniciando upload...`);
      const uploadPromises = galleryFiles.map((file) =>
        uploadFile(file, false)
      );
      galleryUrls = await Promise.all(uploadPromises);
    }
    console.log("✅ PASSO 6.1: Upload da galeria concluído.");

    const fullTextContent = tinymce.get("fullText").getContent();

    // ===============================================================
    // ## ESTE É O LUGAR CORRETO PARA O CÓDIGO DE SALVAR O RSVP ##
    // ===============================================================
    const rsvpOptions = [];
    if (rsvpOption1TextInput.value && rsvpOption1IdInput.value) {
      rsvpOptions.push({
        text: rsvpOption1TextInput.value,
        id: rsvpOption1IdInput.value,
      });
    }
    if (rsvpOption2TextInput.value && rsvpOption2IdInput.value) {
      rsvpOptions.push({
        text: rsvpOption2TextInput.value,
        id: rsvpOption2IdInput.value,
      });
    }

    const eventData = {
      title: titleInput.value,
      date: Timestamp.fromDate(new Date(dateInput.value + "T00:00:00")),
      excerpt: excerptInput.value,
      fullText: fullTextContent,
      category: categoryInput.value,
      link: linkInput.value,
      imageUrl: mainImageUrl,
      galleryUrls: galleryUrls,
      rsvpOptions: rsvpOptions, // A nova propriedade
    };
    // ===============================================================

    console.log("📦 PASSO 7: Pacote de dados pronto:", eventData);

    if (isEditMode) {
      const docRef = doc(db, "eventos", eventId);
      await updateDoc(docRef, eventData);
      alert("Evento atualizado com sucesso!");
    } else {
      await addDoc(collection(db, "eventos"), eventData);
      alert("Evento cadastrado com sucesso!");
    }

    console.log("✅ PASSO 8: Dados salvos no Firestore!");
    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("❌ ERRO GERAL NO PROCESSO DE SALVAMENTO!", error);
    alert(`Erro ao salvar: ${error.message}`);
    saveButton.disabled = false;
    saveButton.textContent = "Salvar Evento";
    uploadProgressContainer.style.display = "none";
  }
});

// A chamada `loadEventData()` foi movida para dentro do `tinymce.init`
