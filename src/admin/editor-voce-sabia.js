import { db, storage } from "../firebase-config.js";
import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Elementos do DOM
const form = document.getElementById("voceSabia-form");
const titleInput = document.getElementById("title");
const categoryInput = document.getElementById("category");
const contentInput = document.getElementById("content");
const imageUploadInput = document.getElementById("imageUpload");
const saveButton = document.getElementById("save-button");

// Lógica de Edição (simplificada, podemos adicionar depois)
const params = new URLSearchParams(window.location.search);
const docId = params.get("id");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";

  try {
    let imageUrl = ""; // Começa com URL vazia
    const imageFile = imageUploadInput.files[0];

    // Se uma imagem foi selecionada, faz o upload
    if (imageFile) {
      const filePath = `voceSabia/${Date.now()}-${imageFile.name}`;
      const storageRef = ref(storage, filePath);
      const snapshot = await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(snapshot.ref);
    }

    // Monta o objeto com os dados
    const voceSabiaData = {
      title: titleInput.value,
      category: categoryInput.value,
      content: contentInput.value,
      imageUrl: imageUrl, // Pode ser vazia se não houver imagem
      createdAt: serverTimestamp(), // Usa a data/hora do servidor
    };

    // Adiciona um novo documento na coleção "voceSabia"
    await addDoc(collection(db, "voceSabia"), voceSabiaData);
    alert('Item "Você Sabia?" salvo com sucesso!');
    window.location.href = "gerenciar-voce-sabia.html"; // Redireciona para a página de gerenciamento
  } catch (error) {
    console.error("Erro ao salvar:", error);
    alert("Ocorreu um erro ao salvar. Verifique o console.");
    saveButton.disabled = false;
    saveButton.textContent = "Salvar";
  }
});
