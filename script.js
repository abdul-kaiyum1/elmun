/* ================= SETUP ================= */

const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];
let forming = false;
let targetPoints = [];

/* ================= HEART CLASS ================= */

class Heart {
  constructor(x, y) {
    this.x = x || Math.random() * canvas.width;
    this.y = y || Math.random() * canvas.height;
    this.size = Math.random() * 6 + 4;
    this.speedY = Math.random() * 0.4 + 0.2;
    this.tx = null;
    this.ty = null;
  }

  update() {
    if (forming && this.tx) {
      this.x += (this.tx - this.x) * 0.06;
      this.y += (this.ty - this.y) * 0.06;
    } else {
      this.y -= this.speedY;
      if (this.y < 0) {
        this.y = canvas.height;
        this.x = Math.random() * canvas.width;
      }
    }
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.size / 10, this.size / 10);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(0, -3, -5, -3, -5, 0);
    ctx.bezierCurveTo(-5, 3, 0, 5, 0, 8);
    ctx.bezierCurveTo(0, 5, 5, 3, 5, 0);
    ctx.bezierCurveTo(5, -3, 0, -3, 0, 0);

    ctx.fillStyle = "rgba(255,77,109,0.9)";
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ff4d6d";

    ctx.fill();
    ctx.restore();
  }
}

/* ================= PARTICLES ================= */

function initParticles() {
  hearts = [];
  for (let i = 0; i < 60; i++) {
    hearts.push(new Heart());
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  hearts.forEach(h => {
    h.update();
    h.draw();
  });
  requestAnimationFrame(animate);
}

initParticles();
animate();

/* ================= NAME FORMATION ================= */

function createTextPoints(text) {
  const temp = document.createElement("canvas");
  const t = temp.getContext("2d");

  temp.width = canvas.width;
  temp.height = canvas.height;

  t.fillStyle = "white";
  t.font = "bold 140px Orbitron";
  t.textAlign = "center";

  t.fillText(text, canvas.width / 2, canvas.height / 2);

  const data = t.getImageData(0, 0, canvas.width, canvas.height).data;
  let pts = [];

  for (let y = 0; y < canvas.height; y += 4) {
    for (let x = 0; x < canvas.width; x += 4) {
      let i = (y * canvas.width + x) * 4;
      if (data[i + 3] > 128) pts.push({ x, y });
    }
  }

  return pts;
}

function formName() {
  forming = true;
  targetPoints = createTextPoints("ELMUN");

  hearts.forEach((h, i) => {
    let p = targetPoints[i % targetPoints.length];
    h.tx = p.x;
    h.ty = p.y;
  });

  setTimeout(() => {
    forming = false;
  }, 3000);
}

/* ================= AUDIO ================= */

function playMusic() {
  let audio = document.getElementById("music");
  audio.volume = 0;

  audio.play().then(() => {
    let v = 0;
    let fade = setInterval(() => {
      if (v < 0.5) {
        v += 0.02;
        audio.volume = v;
      } else clearInterval(fade);
    }, 200);
  }).catch(()=>{});
}

/* ================= SCREEN ================= */

function switchScreen(hide, show) {
  document.getElementById(hide).classList.remove("active");
  document.getElementById(show).classList.add("active");
}

/* ================= TYPEWRITER ================= */

function typeText(element, text, speed = 40) {
  return new Promise(resolve => {
    let i = 0;
    element.innerHTML = "";

    function t() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        setTimeout(t, speed);
      } else resolve();
    }

    t();
  });
}

/* ================= TIMELINE ================= */

async function runTimeline() {

  // 1. Loader
  switchScreen("countdown", "loader");

  const lines = [
    "Initializing surprise...",
    "Loading emotions...",
    "Preparing something special...",
    "Done ✔"
  ];

  for (let line of lines) {
    terminal.innerHTML += line + "\n";
    await new Promise(r => setTimeout(r, 700));
  }

  await new Promise(r => setTimeout(r, 1000));

  // 2. Message
  switchScreen("loader", "message");

  await typeText(msgText,
`Hey Elmun... 💙
I made something just for you...

Even if we’re far apart,
you’ve become really special to me...`);

  await new Promise(r => setTimeout(r, 2000));

  // 3. Name formation
  formName();
  await new Promise(r => setTimeout(r, 4000));

  // 4. Birthday
  switchScreen("message", "birthday");

  confetti({ particleCount: 200, spread: 100 });
  playMusic();
}

/* ================= COUNTDOWN ================= */

const targetDate = new Date("April 1, 2026 00:00:00").getTime();
let started = false;

setInterval(() => {
  let now = new Date().getTime();
  let diff = targetDate - now;

  if (diff <= 0 && !started) {
    started = true;
    runTimeline();
    return;
  }

  const d = Math.floor(diff/(1000*60*60*24));
  const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const m = Math.floor((diff%(1000*60*60))/(1000*60));

  timer.innerHTML = `${d}d ${h}h ${m}m`;
}, 1000);

/* ================= MODAL ================= */

const msgs = [
"Distance is just a glitch in the matrix!",
"You are one of my favorite people.",
"Stay happy and keep shining 🚀",
"I love you ❤️"
];

function openModal(i) {
  modal.style.display = "flex";
  modalText.innerHTML = msgs[i];
}

function closeModal() {
  modal.style.display = "none";
}

/* ================= FINAL ================= */

function goFinal() {
  switchScreen("birthday", "final");

  const lines = [
    "No matter the distance...",
    "You became really important to me...",
    "Thank you for being in my life 💙",
    "Happy Birthday, Elmun ❤️"
  ];

  let i = 0;

  function showLines() {
    if (i < lines.length) {
      finalText.innerHTML = lines[i];
      i++;
      setTimeout(showLines, 2000);
    }
  }

  showLines();

  confetti({ particleCount: 400, spread: 150 });
}
