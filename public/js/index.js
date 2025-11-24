// public/js/index.js
import { db } from "./firebase-init.js";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const nameInput = document.getElementById("nameInput");
const boyBtn = document.getElementById("boyBtn");
const girlBtn = document.getElementById("girlBtn");
const statusEl = document.getElementById("status");

let selectedGuess = null;

boyBtn.addEventListener("click", () => {
  selectedGuess = "boy";
  statusEl.textContent = "Elegiste: Niño 💙";
});

girlBtn.addEventListener("click", () => {
  selectedGuess = "girl";
  statusEl.textContent = "Elegiste: Niña 💗";
});

async function submitVote() {
  const name = nameInput.value.trim();
  if (!name) {
    statusEl.textContent = "Por favor escribe tu nombre.";
    return;
  }
  if (!selectedGuess) {
    statusEl.textContent = "Elige Niño o Niña primero.";
    return;
  }

  statusEl.textContent = "Guardando tu voto...";

  try {
    await addDoc(collection(db, "votes"), {
      name,
      guess: selectedGuess,
      createdAt: serverTimestamp(),
    });

    // Guardamos localmente para mostrar luego si quieres
    localStorage.setItem("guestName", name);
    localStorage.setItem("guestGuess", selectedGuess);

    window.location.href = "./wall.html";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Hubo un error guardando tu voto. Intenta otra vez.";
  }
}

boyBtn.addEventListener("dblclick", submitVote);
girlBtn.addEventListener("dblclick", submitVote);

// Opcional: también permitir Enter sin doble click
document.getElementById("voteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  submitVote();
});

// Si quieres que con un solo click ya vote, descomenta:
 boyBtn.addEventListener("click", submitVote);
 girlBtn.addEventListener("click", submitVote);
