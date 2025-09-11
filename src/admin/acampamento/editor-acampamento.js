// Local: /src/admin/acampamento/editor-acampamento.js

// --- 1. IMPORTAÇÕES ---
// Estilos
import "/src/styles/base/reset.css";
import "/src/styles/base/variables.css";
import "/src/styles/base/typography.css";
import "/src/styles/components/header.css";
import "/src/styles/components/footer.css";
import "/src/styles/components/buttons.css";
import "../editor.css"; // Reutiliza o CSS de editor genérico do admin

// Componentes e Funções
import { renderHeader } from "/src/components/Header.js";
import { renderFooter } from "/src/components/Footer.js";

// Firebase
import { app } from "../../firebase-config.js"; // Atenção ao caminho: ../../
import {
  getFirestore,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  Timestamp,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import imageCompression from "browser-image-compression";

const db = getFirestore(app);
const storage = getStorage(app);

// --- 2. MONTAGEM DA PÁGINA E EDITOR ---
renderHeader();
renderFooter();

tinymce.init({
  selector: "#description",
  plugins: "lists link",
  toolbar: "undo redo | bold italic | bullist numlist | link",
  height: 300,
  menubar: false,
  placeholder: "Descreva o acampamento, público-alvo, etc.",
  setup: function (editor) {
    editor.on("init", function () {
      // Só carrega os dados do acampamento DEPOIS que o editor estiver pronto.
      loadCampData();
    });
  },
});

// --- 3. ELEMENTOS DO DOM ---
const editorTitle = document.getElementById("editor-title");
const form = document.getElementById("acampamento-form");
const nameInput = document.getElementById("name");
const themeInput = document.getElementById("theme");
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const statusSelect = document.getElementById("status");
const imageUploadInput = document.getElementById("mainImageUpload");
const imagePreview = document.getElementById("image-preview");
const driveUrlInput = document.getElementById("driveAlbumUrl");
const saveButton = document.getElementById("save-button");

// --- 4. LÓGICA PRINCIPAL ---
const params = new URLSearchParams(window.location.search);
const campId = params.get("id");
const isEditMode = Boolean(campId);
let existingImageUrl = "";

// Função de upload de imagem (reutilizada)
async function uploadFile(file) {
  if (!file) return null;
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  };
  const compressedFile = await imageCompression(file, options);
  const filePath = `acampamentos/${Date.now()}-${compressedFile.name}`;
  const storageRef = ref(storage, filePath);
  await uploadBytes(storageRef, compressedFile);
  return await getDownloadURL(storageRef);
}

// Função para carregar dados no modo de edição
async function loadCampData() {
  if (!isEditMode) return;
  editorTitle.textContent = "Editar Acampamento";
  saveButton.textContent = "Atualizar Acampamento";
  try {
    const docRef = doc(db, "acampamentos", campId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      nameInput.value = data.name || "";
      themeInput.value = data.theme || "";
      // Converte Timestamps do Firebase de volta para o formato de data do HTML
      startDateInput.value = data.startDate
        ? data.startDate.toDate().toISOString().split("T")[0]
        : "";
      endDateInput.value = data.endDate
        ? data.endDate.toDate().toISOString().split("T")[0]
        : "";
      statusSelect.value = data.status || "Próximo";
      driveUrlInput.value = data.driveAlbumUrl || "";
      tinymce.get("description").setContent(data.description || "");

      if (data.mainImageUrl) {
        existingImageUrl = data.mainImageUrl;
        imagePreview.src = existingImageUrl;
        imagePreview.style.display = "block";
      }
    }
  } catch (error) {
    console.error("Erro ao carregar dados do acampamento:", error);
    alert("Não foi possível carregar os dados para edição.");
  }
}

// Lógica de Submit do formulário
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  saveButton.disabled = true;
  saveButton.textContent = "Salvando...";

  try {
    let mainImageUrl = existingImageUrl;
    const imageFile = imageUploadInput.files[0];
    if (imageFile) {
      mainImageUrl = await uploadFile(imageFile);
    }

    const description = tinymce.get("description").getContent();

    const campData = {
      name: nameInput.value,
      theme: themeInput.value,
      startDate: Timestamp.fromDate(
        new Date(startDateInput.value + "T00:00:00")
      ),
      endDate: Timestamp.fromDate(new Date(endDateInput.value + "T00:00:00")),
      status: statusSelect.value,
      description: description,
      mainImageUrl: mainImageUrl,
      driveAlbumUrl: driveUrlInput.value,
    };

    if (isEditMode) {
      const docRef = doc(db, "acampamentos", campId);
      await updateDoc(docRef, campData);
      alert("Acampamento atualizado com sucesso!");
    } else {
      await addDoc(collection(db, "acampamentos"), campData);
      alert("Acampamento cadastrado com sucesso!");
    }

    window.location.href = "gerenciar-acampamentos.html";
  } catch (error) {
    console.error("Erro ao salvar acampamento:", error);
    alert(`Ocorreu um erro ao salvar: ${error.message}`);
    saveButton.disabled = false;
    saveButton.textContent = isEditMode
      ? "Atualizar Acampamento"
      : "Salvar Acampamento";
  }
});

// O carregamento dos dados foi movido para o setup do TinyMCE para garantir que o editor esteja pronto
