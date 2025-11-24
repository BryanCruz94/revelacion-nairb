// public/js/admin.js
import { db } from "./firebase-init.js";
import {
  doc,
  updateDoc,
  serverTimestamp,
  collection,
  getDocs,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const toVoting = document.getElementById("toVoting");
const toFake = document.getElementById("toFake");
const toReal = document.getElementById("toReal");
const statusEl = document.getElementById("adminStatus");

const stateRef = doc(db, "reveal", "state");

async function setPhase(phase) {
  statusEl.textContent = `Cambiando a ${phase}...`;
  try {
    await updateDoc(stateRef, {
      phase,
      updatedAt: serverTimestamp(),
    });
    statusEl.textContent = `✅ Fase actual: ${phase}`;
  } catch (e) {
    console.error(e);
    statusEl.textContent = "❌ Error actualizando fase.";
  }
}
const deleteVotesBtn = document.getElementById("deleteVotes");

deleteVotesBtn.addEventListener("click", async () => {
  if (!confirm("¿Seguro que quieres borrar TODOS los votos?")) return;

  statusEl.textContent = "Borrando votos...";

  try {
    const snap = await getDocs(collection(db, "votes"));

    const deletions = snap.docs.map(docSnap =>
      deleteDoc(docSnap.ref)
    );

    await Promise.all(deletions);

    statusEl.textContent = "✅ Votos borrados.";
  } catch (e) {
    console.error(e);
    statusEl.textContent = "❌ Error borrando votos.";
  }
});


toVoting.addEventListener("click", () => setPhase("voting"));
toFake.addEventListener("click", () => setPhase("fake"));
toReal.addEventListener("click", () => setPhase("real"));
