// public/js/wall.js
import { db } from "./firebase-init.js";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  onSnapshot as onDocSnapshot,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

import {
  initCelebrationCanvas,
  startFakeFX,
  startRealFX,
  stopAllFX
} from "./celebration.js";

const boyList = document.getElementById("boyList");
const girlList = document.getElementById("girlList");

const votingSection = document.getElementById("votingSection");
const fakeSection = document.getElementById("fakeSection");
const realSection = document.getElementById("realSection");

const winnersText = document.getElementById("winnersText");
const photosEl = document.getElementById("photos");
const phaseLabel = document.getElementById("phaseLabel");

let currentVotes = [];
let currentPhase = "voting";

// iniciar canvas de fx
initCelebrationCanvas();

/* 1) Listener votos */
const votesQ = query(collection(db, "votes"), orderBy("createdAt", "asc"));

onSnapshot(votesQ, (snap) => {
  currentVotes = snap.docs.map(d => d.data());

  const boys = currentVotes.filter(v => v.guess === "boy");
  const girls = currentVotes.filter(v => v.guess === "girl");

  renderBubbles(boyList, boys);
  renderBubbles(girlList, girls);

  if (currentPhase === "real") {
    showWinners(girls);
  }
});

function renderBubbles(container, arr) {
  container.innerHTML = "";
  arr.forEach(v => {
    const div = document.createElement("div");
    div.className = "bubble";
    div.textContent = v.name;
    container.appendChild(div);
  });
}

/* 2) Listener estado global */
const stateRef = doc(db, "reveal", "state");
onDocSnapshot(stateRef, (snap) => {
  const data = snap.data();
  const phase = data?.phase || "voting";
  currentPhase = phase;

  phaseLabel.textContent = `Fase: ${phase}`;

  if (phase === "voting") {
    showSection("voting");
    document.getElementById("tituloVotaciones").style.display = "block";
    stopAllFX(fakeSection, realSection);
  }

  if (phase === "fake") {
    showSection("fake");
    document.getElementById("tituloVotaciones").style.display = "none";
    stopAllFX(fakeSection, realSection);
    startFakeFX(fakeSection);
  }

  if (phase === "real") {
    showSection("real");
    document.getElementById("tituloVotaciones").style.display = "none";
    stopAllFX(fakeSection, realSection);
    const girls = currentVotes.filter(v => v.guess === "girl");
    showWinners(girls);
    // loadPhotos();
    if (window.initEcoCarousel) window.initEcoCarousel();
    startRealFX(realSection);
  }
});

function showSection(which) {
  votingSection.classList.add("hidden");
  fakeSection.classList.add("hidden");
  realSection.classList.add("hidden");

  if (which === "voting") votingSection.classList.remove("hidden");
  if (which === "fake") fakeSection.classList.remove("hidden");
  if (which === "real") realSection.classList.remove("hidden");
}

function showWinners(girls) {
  if (girls.length === 0) {
    winnersText.textContent = "Nadie votó por niña… 😅 pero sorpresa igual 💗";
    return;
  }
  const names = girls.map(g => g.name).join(", ");
  winnersText.textContent = `${names} tienen una mejor intuición.`;
}

/* tus fotos reales */
function loadPhotos() {
  if (photosEl.children.length > 0) return;

  const placeholders = ["eco1.jpg", "eco2.jpg", "eco3.jpg"];

  placeholders.forEach(src => {
    const img = document.createElement("img");
    img.src = `./assets/${src}`;
    img.alt = "Eco bebé";
    img.style.width = "100%";
    img.style.borderRadius = "12px";
    photosEl.appendChild(img);
  });
}
