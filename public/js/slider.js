// public/js/slider.js

let track, dotsEl, slides = [];
let index = 0;
let autoTimer = null;

// 👇 Pon aquí tus archivos reales
const ECO_IMAGES = [
  "./assets/eco1.jpg",
  "./assets/eco2.jpg",
  "./assets/eco3.jpg"
];

function qs(id){ return document.getElementById(id); }

function renderCarousel() {
  track = qs("carouselTrack");
  dotsEl = qs("carouselDots");
  if (!track || !dotsEl) return;

  track.innerHTML = "";
  dotsEl.innerHTML = "";
  slides = [];

  ECO_IMAGES.forEach((src, i) => {
    // slide
    const slide = document.createElement("div");
    slide.className = "carousel-slide";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Eco ${i+1}`;

    slide.appendChild(img);
    track.appendChild(slide);
    slides.push(slide);

    // dot
    const dot = document.createElement("div");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => goTo(i));
    dotsEl.appendChild(dot);
  });

  bindButtons();
  bindSwipe();
  goTo(0);
  startAutoPlay();
}

function bindButtons() {
  const prevBtn = document.querySelector(".carousel-btn.prev");
  const nextBtn = document.querySelector(".carousel-btn.next");
  if (prevBtn) prevBtn.addEventListener("click", prev);
  if (nextBtn) nextBtn.addEventListener("click", next);
}

function updateDots() {
  [...dotsEl.children].forEach((d, i) => {
    d.classList.toggle("active", i === index);
  });
}

function goTo(i) {
  index = (i + slides.length) % slides.length;
  const offset = index * 100;
  track.style.transform = `translateX(-${offset}%)`;
  updateDots();
}

function next() { goTo(index + 1); resetAutoPlay(); }
function prev() { goTo(index - 1); resetAutoPlay(); }

/* Autoplay */
function startAutoPlay() {
  stopAutoPlay();
  autoTimer = setInterval(() => next(), 4500);
}
function stopAutoPlay() {
  if (autoTimer) clearInterval(autoTimer);
  autoTimer = null;
}
function resetAutoPlay() {
  startAutoPlay();
}

/* Swipe / drag */
function bindSwipe() {
  let startX = 0;
  let dx = 0;
  let dragging = false;

  const wrapper = document.querySelector(".carousel-track-wrapper");
  if (!wrapper) return;

  wrapper.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    dragging = true;
    stopAutoPlay();
  }, { passive: true });

  wrapper.addEventListener("touchmove", (e) => {
    if (!dragging) return;
    dx = e.touches[0].clientX - startX;
  }, { passive: true });

  wrapper.addEventListener("touchend", () => {
    if (!dragging) return;
    dragging = false;

    if (dx > 50) prev();
    else if (dx < -50) next();
    else resetAutoPlay();

    dx = 0;
  });

  // mouse drag (pc)
  wrapper.addEventListener("mousedown", (e) => {
    startX = e.clientX;
    dragging = true;
    stopAutoPlay();
  });

  window.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    dx = e.clientX - startX;
  });

  window.addEventListener("mouseup", () => {
    if (!dragging) return;
    dragging = false;

    if (dx > 60) prev();
    else if (dx < -60) next();
    else resetAutoPlay();

    dx = 0;
  });
}

/* Exponemos para que wall.js lo llame en fase real */
window.initEcoCarousel = renderCarousel;
