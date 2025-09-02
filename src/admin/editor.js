// Importa a conexão principal 'app'
import { app } from "/src/firebase-config.js";

// Importa as ferramentas do Firestore, incluindo o 'getFirestore'
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  Timestamp,
} from "firebase/firestore";

// Importa as ferramentas do Storage, incluindo o 'getStorage'
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

// Importa a biblioteca de compressão de imagem (esta linha não muda)
import imageCompression from "browser-image-compression";

// Cria as instâncias do db e storage localmente
const db = getFirestore(app);
const storage = getStorage(app);
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

// NOVO: Pegando os inputs da galeria
const galleryImageInputs = [
  document.getElementById("galleryImage1"),
  document.getElementById("galleryImage2"),
  document.getElementById("galleryImage3"),
];

// --- LÓGICA PRINCIPAL ---
const params = new URLSearchParams(window.location.search);
const eventId = params.get("id");
const isEditMode = Boolean(eventId);
let existingImageUrl = ""; // Guarda a URL da imagem principal existente
let existingGalleryUrls = []; // NOVO: Guarda as URLs da galeria existente

// NOVO: Função reutilizável para fazer upload de UM arquivo.
// Ela retorna uma "Promise" que nos avisa quando o upload termina, entregando a URL.
async function uploadFile(file) {
  if (!file) return null;

  // Lógica de compressão que você já tinha
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };
  const compressedFile = await imageCompression(file, options);
  console.log(
    `Comprimindo ${file.name}... Original: ${(file.size / 1024).toFixed(
      2
    )} KB, Comprimido: ${(compressedFile.size / 1024).toFixed(2)} KB`
  );

  // Lógica de upload que você já tinha, mas agora dentro de uma Promise
  return new Promise((resolve, reject) => {
    const filePath = `eventos/${Date.now()}-${compressedFile.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, compressedFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        uploadProgressContainer.style.display = "block";
        uploadProgress.value = progress;
        uploadProgressText.textContent = `Enviando ${
          compressedFile.name
        }: ${Math.round(progress)}%`;
      },
      (error) => {
        console.error("Erro no upload:", error);
        reject(new Error(`Falha ao enviar o arquivo ${compressedFile.name}.`));
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        console.log(`Arquivo ${compressedFile.name} enviado:`, downloadURL);
        resolve(downloadURL); // A Promise foi resolvida com sucesso!
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
        existingImageUrl = data.image;
        imagePreview.src = existingImageUrl;
        imagePreview.style.display = "block";
        currentImagePath.textContent = `Imagem atual carregada.`;
      }

      // NOVO: Carregar e exibir informações da galeria existente
      if (data.galeriaUrls && data.galeriaUrls.length > 0) {
        existingGalleryUrls = data.galeriaUrls;
        const galleryInfoDiv = document.createElement("div");
        galleryInfoDiv.style.marginTop = "10px";
        galleryInfoDiv.innerHTML = `<b>Galerias existentes:</b> ${existingGalleryUrls.length} imagem(s).<br/><small>Para alterar, apenas envie novas imagens.</small>`;
        galleryImageInputs[2].parentElement.appendChild(galleryInfoDiv);
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

// EVENTO DE SUBMIT TOTALMENTE REFEITO
eventForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";

  try {
    // 1. Upload da imagem principal (se uma nova foi selecionada)
    let mainImageUrl = existingImageUrl; // Começa com a imagem antiga
    const newMainImageFile = imageUploadInput.files[0];
    if (newMainImageFile) {
      mainImageUrl = await uploadFile(newMainImageFile);
    }

    // 2. Upload das imagens da galeria
    const galleryFiles = galleryImageInputs
      .map((input) => input.files[0])
      .filter((file) => file); // Pega apenas os inputs que têm arquivos

    let galleryUrls = existingGalleryUrls; // Começa com as imagens antigas
    if (galleryFiles.length > 0) {
      const uploadPromises = galleryFiles.map((file) => uploadFile(file));
      // Promise.all espera TODOS os uploads terminarem antes de continuar
      galleryUrls = await Promise.all(uploadPromises);
    }

    // 3. Preparar os dados para salvar
    const eventData = {
      title: titleInput.value,
      date: Timestamp.fromDate(new Date(dateInput.value + "T00:00:00")),
      excerpt: excerptInput.value,
      fullText: fullTextInput.value,
      category: categoryInput.value,
      link: linkInput.value,
      image: mainImageUrl, // URL da imagem principal (nova ou antiga)
      galeriaUrls: galleryUrls, // Array com as URLs da galeria
    };

    // 4. Salvar os dados no Firestore
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
    console.error("Erro no processo de salvamento:", error);
    alert(`Erro ao salvar: ${error.message}`);
    saveButton.disabled = false;
    saveButton.textContent = "Salvar Evento";
    uploadProgressContainer.style.display = "none";
  }
});

// Carrega os dados do evento ao iniciar a página
loadEventData();
