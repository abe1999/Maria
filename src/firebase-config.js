// Local: /src/firebase-config.js - VERSÃO OTIMIZADA

// Importa APENAS a função de inicialização
import { initializeApp } from "firebase/app";

// A configuração do seu app web do Firebase (continua a mesma)
const firebaseConfig = {
  apiKey: "AIzaSyAcw22Zu4ugHUhDjeOrvAI1S9N291lQb9g",
  authDomain: "paroquia-site.firebaseapp.com",
  projectId: "paroquia-site",
  storageBucket: "paroquia-site.firebasestorage.app",
  messagingSenderId: "919311513259",
  appId: "1:919311513259:web:0a989e3d3d557f63e169ee",
  measurementId: "G-D41V5EZ1PQ",
};

// Inicia o Firebase e exporta apenas a conexão principal 'app'
export const app = initializeApp(firebaseConfig);
