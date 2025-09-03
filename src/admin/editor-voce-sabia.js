// Local: /src/admin/editor-voce-sabia.js - VERSÃO COMPLETA COM EDIÇÃO

import { app } from "../firebase-config.js";
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const db = getFirestore(app);
const storage = getStorage(app);

// --- 1. ELEMENTOS DO DOM ---
const form = document.getElementById("voceSabia-form");
const editorTitle = document.getElementById("editor-title");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const imageUploadInput = document.getElementById("imageUpload");
const imagePreview = document.getElementById("image-preview");
const saveButton = document.getElementById("save-button");

// --- 2. LÓGICA DE DETECÇÃO DE MODO (CRIAR vs. EDITAR) ---
const params = new URLSearchParams(window.location.search);
const docId = params.get("id");
const isEditMode = Boolean(docId); // Será 'true' se houver um ID na URL

// --- 3. INICIALIZAÇÃO DO EDITOR DE TEXTO E CARREGAMENTO DE DADOS ---
tinymce.init({
  selector: "#content",
  plugins: "lists link image emoticons",
  toolbar:
    "undo redo | bold italic underline | bullist numlist | link image emoticons",
  height: 300,
  menubar: false,
  placeholder: "Escreva o conteúdo aqui...",
  setup: function (editor) {
    // Só carrega os dados DEPOIS que o editor estiver pronto
    editor.on("init", function () {
      if (isEditMode) {
        loadItemData();
      }
    });
  },
});

// --- 4. FUNÇÃO PARA CARREGAR DADOS NO MODO DE EDIÇÃO ---
async function loadItemData() {
  editorTitle.textContent = "Editar 'Você Sabia?'";
  saveButton.textContent = "Atualizar";

  try {
    const docRef = doc(db, "voceSabia", docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      titleInput.value = data.title;
      categoryInput.value = data.category;

      // Preenche o editor TinyMCE com o conteúdo
      tinymce.get("content").setContent(data.content || "");

      if (data.imageUrl) {
        imagePreview.src = data.imageUrl;
        imagePreview.style.display = "block";
      }
    } else {
      alert("Documento não encontrado!");
      window.location.href = "gerenciar-voce-sabia.html";
    }
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
    alert("Não foi possível carregar os dados para edição.");
  }
}

// --- 5. LÓGICA DE SALVAMENTO (AGORA COM INTELIGÊNCIA) ---
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";

  try {
    let imageUrl = isEditMode ? imagePreview.src : ""; // Mantém a imagem antiga se não houver nova
    const imageFile = imageUploadInput.files[0];

    if (imageFile) {
      const filePath = `voceSabia/${Date.now()}-${imageFile.name}`;
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    const content = tinymce.get("content").getContent();

    const voceSabiaData = {
      title: titleInput.value,
      category: categoryInput.value,
      content: content,
      imageUrl: imageUrl,
      // Só atualiza o 'createdAt' se for um novo item
      ...(isEditMode ? {} : { createdAt: serverTimestamp() }),
    };

    if (isEditMode) {
      // Se estiver editando, ATUALIZA o documento existente
      const docRef = doc(db, "voceSabia", docId);
      await updateDoc(docRef, voceSabiaData);
      alert("Item atualizado com sucesso!");
    } else {
      // Se for novo, CRIA um novo documento
      await addDoc(collection(db, "voceSabia"), voceSabiaData);
      alert('Item "Você Sabia?" salvo com sucesso!');
    }

    window.location.href = "gerenciar-voce-sabia.html";
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Ocorreu um erro ao salvar. Verifique o console.");
    saveButton.disabled = false;
    saveButton.textContent = isEditMode ? "Atualizar" : "Salvar";
  }
});
