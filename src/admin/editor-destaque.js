import { db, storage } from "/src/firebase-config.js";
import { doc, getDoc, addDoc, updateDoc, collection } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";

// --- ELEMENTOS DO DOM ---
const editorTitle = document.getElementById("editor-title");
const slideForm = document.getElementById("slide-form");
const textoInput = document.getElementById("texto");
const linkUrlInput = document.getElementById("linkUrl");
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
    const docRef = doc(db, "destaques_carrosel", slideId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      textoInput.value = data.texto || "";
      linkUrlInput.value = data.linkUrl || "";
      ordemInput.value = data.ordem || 1;
      ativoCheckbox.checked = data.ativo;
      if (data.imagemUrl) {
        imageUrlToSave = data.imagemUrl;
        imagePreview.src = imageUrlToSave;
        imagePreview.style.display = "block";
        currentImagePath.textContent = `Imagem atual carregada.`;
      }
    } else {
      alert("Slide não encontrado!");
      window.location.href = "gerenciar-destaques.html";
    }
  } catch (error) {
    console.error("Erro ao carregar dados do slide:", error);
    alert("Não foi possível carregar os dados do slide.");
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

      // Aguarda o upload ser concluído para obter a URL
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
    imagemUrl: imageUrlToSave,
    ordem: Number(ordemInput.value),
    ativo: ativoCheckbox.checked,
  };

  try {
    if (isEditMode) {
      const docRef = doc(db, "destaques_carrosel", slideId);
      await updateDoc(docRef, slideData);
      alert("Slide atualizado com sucesso!");
    } else {
      await addDoc(collection(db, "destaques_carrosel"), slideData);
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
