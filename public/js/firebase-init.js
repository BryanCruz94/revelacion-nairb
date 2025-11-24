// public/js/firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyDJXP7pJ5aB7_V8Kgdz-fKv839VJH4Sh2E",
  authDomain: "revelacion-nairb.firebaseapp.com",
  projectId: "revelacion-nairb",
  storageBucket: "revelacion-nairb.firebasestorage.app",
  messagingSenderId: "566178748558",
  appId: "1:566178748558:web:251a3c759a04e96f0891df"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
