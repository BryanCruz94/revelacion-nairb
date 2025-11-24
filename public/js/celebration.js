// public/js/celebration.js

let canvas, ctx;
let W, H;
let animId = null;
let particles = [];
let fireworks = [];
let mode = null; // "fake" | "real"

function resize() {
  if (!canvas) return;
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ---------- CONFETTI ---------- */
function spawnConfettiBurst(count = 120) {
  for (let i = 0; i < count; i++) {
    particles.push({
      x: W / 2 + rand(-80, 80),
      y: H * 0.25 + rand(-40, 40),
      vx: rand(-6, 6),
      vy: rand(-10, -3),
      g: rand(0.12, 0.18),
      size: rand(4, 8),
      rot: rand(0, Math.PI),
      spin: rand(-0.2, 0.2),
      life: rand(120, 200),
      // colores pastel
      color: [ "#ffb6cf", "#ffe9f2", "#a8d6ff", "#e5f4ff", "#e5defe" ][Math.floor(rand(0,5))]
    });
  }
}

function updateConfetti() {
  particles.forEach(p => {
    p.vy += p.g;
    p.x += p.vx;
    p.y += p.vy;
    p.rot += p.spin;
    p.life -= 1;
  });
  particles = particles.filter(p => p.life > 0 && p.y < H + 30);
}

function drawConfetti() {
  particles.forEach(p => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size*1.4);
    ctx.restore();
  });
}

/* ---------- FIREWORKS ---------- */
function spawnFirework() {
  const startX = rand(W*0.2, W*0.8);
  const targetY = rand(H*0.12, H*0.45);

  fireworks.push({
    x: startX,
    y: H + 10,
    vx: rand(-1.2, 1.2),
    vy: rand(-12, -9),
    targetY,
    exploded: false
  });
}

function explodeFirework(fw) {
  const count = 60;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = rand(2.5, 5.5);
    particles.push({
      x: fw.x,
      y: fw.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      g: 0.06,
      size: rand(2.5, 4.5),
      rot: rand(0, Math.PI),
      spin: rand(-0.1, 0.1),
      life: rand(70, 120),
      color: [ "#ffb6cf", "#a8d6ff", "#e5defe", "#ffffff" ][Math.floor(rand(0,4))]
    });
  }
}

function updateFireworks() {
  fireworks.forEach(fw => {
    fw.x += fw.vx;
    fw.y += fw.vy;
    fw.vy += 0.08; // gravedad al subir
    if (!fw.exploded && fw.y <= fw.targetY) {
      fw.exploded = true;
      explodeFirework(fw);
    }
  });
  fireworks = fireworks.filter(fw => !fw.exploded);
}

/* ---------- LOOP ---------- */
function loop() {
  ctx.clearRect(0, 0, W, H);

  // real = confetti continuo + fireworks
  if (mode === "real") {
    if (Math.random() < 0.06) spawnFirework();
    if (Math.random() < 0.04) spawnConfettiBurst(40);

    updateFireworks();
    updateConfetti();
    drawConfetti();
  }

  animId = requestAnimationFrame(loop);
}

/* ---------- API PUBLICA ---------- */

export function initCelebrationCanvas() {
  canvas = document.getElementById("fxCanvas");
  ctx = canvas.getContext("2d");
  resize();
  window.addEventListener("resize", resize);
}

export function startFakeFX(fakeSectionEl) {
  mode = "fake";
  canvas.classList.add("hidden");
  if (fakeSectionEl) fakeSectionEl.classList.add("fake-drum");
}

export function startRealFX(realSectionEl) {
  mode = "real";

  particles = [];
  fireworks = [];

  canvas.classList.remove("hidden");

  // burst inicial grande
  spawnConfettiBurst(220);
  for (let i = 0; i < 5; i++) spawnFirework();

  if (realSectionEl) realSectionEl.classList.add("real-glow");

  if (!animId) loop();
}

export function stopAllFX(fakeSectionEl, realSectionEl) {
  mode = null;
  particles = [];
  fireworks = [];

  canvas.classList.add("hidden");

  if (fakeSectionEl) fakeSectionEl.classList.remove("fake-drum");
  if (realSectionEl) realSectionEl.classList.remove("real-glow");

  if (animId) {
    cancelAnimationFrame(animId);
    animId = null;
  }
}
