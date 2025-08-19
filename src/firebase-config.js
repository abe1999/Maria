// Importa as funções que vamos precisar do SDK do Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// A configuração do seu app web do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAcw22Zu4ugHUhDjeOrvAI1S9N291lQb9g",
  authDomain: "paroquia-site.firebaseapp.com",
  projectId: "paroquia-site",
  storageBucket: "paroquia-site.firebasestorage.app",
  messagingSenderId: "919311513259",
  appId: "1:919311513259:web:0a989e3d3d557f63e169ee",
  measurementId: "G-D41V5EZ1PQ",
};

// Inicia o Firebase
const app = initializeApp(firebaseConfig);

// Exporta os serviços que vamos usar em outras partes do site
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
