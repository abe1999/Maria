import { app } from "/src/firebase-config.js";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
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

// --- ELEMENTOS DO DOM ---
const editorTitle = document.getElementById("editor-title");
const slideForm = document.getElementById("slide-form");
const textoInput = document.getElementById("texto");
const linkUrlInput = document.getElementById("linkUrl");
const textoBotaoInput = document.getElementById("textoBotao");
const imageUploadInput = document.getElementById("imageUpload");
const imagePreview = document.getElementById("image-preview");
const currentImagePath = document.getElementById("current-image-path");
const ordemInput = document.getElementById("ordem");
const ativoCheckbox = document.getElementById("ativo");
const saveButton = document.getElementById("save-button");

// --- LÓGICA PRINCIPAL ---
const params = new URLSearchParams(window.location.search);
const slideId = params.get("id");
const isEditMode = Boolean(slideId);
let imageUrlToSave = ""; // Guarda a URL da imagem

async function loadSlideData() {
  if (!isEditMode) return;

  editorTitle.textContent = "Editar Slide";
  try {
    // CORREÇÃO: Usando a coleção "destaques"
    const docRef = doc(db, "destaques", slideId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      textoInput.value = data.texto || "";
      linkUrlInput.value = data.linkUrl || "";
      textoBotaoInput.value = data.textoBotao || "";
      ordemInput.value = data.ordem || 1;
      ativoCheckbox.checked = data.ativo;

      // CORREÇÃO: Buscando o campo "imageUrl"
      if (data.imageUrl) {
        imageUrlToSave = data.imageUrl;
        imagePreview.src = imageUrlToSave;
        imagePreview.style.display = "block";
        currentImagePath.textContent = `Imagem atual carregada.`;
      }
    } else {
      alert("Slide não encontrado!");
      window.location.href = "gerenciar-destaques.html";
    }
  } catch (error) {
    console.error("--- OCORREU UM ERRO DETALHADO ---");
    console.error("Objeto do erro completo:", error);
    console.error("Mensagem do erro:", error.message);
    console.error("Rastro do erro (stack):", error.stack);
    alert(`Ocorreu um erro ao carregar os dados. Verifique o console.`);
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

slideForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";

  const newImageFile = imageUploadInput.files[0];

  try {
    if (newImageFile) {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      const compressedFile = await imageCompression(newImageFile, options);

      const filePath = `destaques/${Date.now()}-${compressedFile.name}`;
      const storageRef = ref(storage, filePath);
      const uploadTask = uploadBytesResumable(storageRef, compressedFile);

      await uploadTask;
      imageUrlToSave = await getDownloadURL(uploadTask.snapshot.ref);
      console.log("Upload concluído. URL:", imageUrlToSave);
    }

    if (!imageUrlToSave && !isEditMode) {
      throw new Error("Você precisa selecionar uma imagem para o novo slide.");
    }

    await saveData();
  } catch (error) {
    console.error("Erro no processo de salvamento:", error);
    alert(`Erro ao salvar: ${error.message}`);
    saveButton.disabled = false;
    saveButton.textContent = "Salvar Slide";
  }
});

async function saveData() {
  const slideData = {
    texto: textoInput.value,
    linkUrl: linkUrlInput.value,
    textoBotao: textoBotaoInput.value,
    // CORREÇÃO: Usando "imageUrl" para consistência
    imageUrl: imageUrlToSave,
    ordem: Number(ordemInput.value),
    ativo: ativoCheckbox.checked,
  };

  try {
    if (isEditMode) {
      // CORREÇÃO: Usando a coleção "destaques"
      const docRef = doc(db, "destaques", slideId);
      await updateDoc(docRef, slideData);
      alert("Slide atualizado com sucesso!");
    } else {
      // CORREÇÃO: Usando a coleção "destaques"
      await addDoc(collection(db, "destaques"), slideData);
      alert("Slide cadastrado com sucesso!");
    }
    window.location.href = "gerenciar-destaques.html";
  } catch (error) {
    console.error("Erro ao salvar no Firestore:", error);
    throw new Error("Falha ao salvar os dados no banco de dados.");
  }
}

// Inicializa a página
loadSlideData();
