const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];
let forming = false;

/* HEART PARTICLE SYSTEM */
class Heart {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseSize = Math.random() * 6 + 3;
        this.size = this.baseSize;
        this.speedY = Math.random() * 0.5 + 0.3;
        this.tx = null;
        this.ty = null;
    }
    update() {
        if (forming && this.tx !== null) {
            this.x += (this.tx - this.x) * 0.08;
            this.y += (this.ty - this.y) * 0.08;
            this.size = this.baseSize * 0.3; 
        } else {
            this.y -= this.speedY;
            if (this.y < -50) this.y = canvas.height + 50;
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
        ctx.fillStyle = forming ? "#ff0040" : "#ff4d6d";
        ctx.fill();
        ctx.restore();
    }
}

function init() {
    for (let i = 0; i < 1000; i++) hearts.push(new Heart());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => { h.update(); h.draw(); });
    requestAnimationFrame(animate);
}

init();
animate();

/* STARDUST CURSOR EFFECT */
document.addEventListener("mousemove", (e) => {
    if(Math.random() > 0.6) {
        let star = document.createElement("div");
        star.className = "stardust";
        star.style.left = e.pageX + "px";
        star.style.top = e.pageY + "px";
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1000);
    }
});

/* NAME MAPPING (ELMUN) */
function createTextPoints(text) {
    const temp = document.createElement("canvas");
    const t = temp.getContext("2d");
    temp.width = canvas.width; 
    temp.height = canvas.height;
    
    let fontSize = Math.min(canvas.width / 5, 180);
    t.font = `bold ${fontSize}px Arial`;
    t.textAlign = "center"; 
    t.textBaseline = "middle";
    t.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const data = t.getImageData(0, 0, canvas.width, canvas.height).data;
    let pts = [];
    
    for (let y = 0; y < canvas.height; y += 4) { 
        for (let x = 0; x < canvas.width; x += 4) {
            if (data[((y * canvas.width + x) * 4) + 3] > 128) {
                pts.push({ x, y });
            }
        }
    }
    return pts;
}

function formName() {
    forming = true;
    let rawPoints = createTextPoints("ELMUN");
    rawPoints.sort(() => Math.random() - 0.5); 
    
    hearts.forEach((h, i) => {
        let p = rawPoints[Math.floor(i * (rawPoints.length / hearts.length))];
        if (p) { 
            h.tx = p.x; 
            h.ty = p.y; 
        }
    });
    
    setTimeout(() => {
        forming = false;
        hearts.forEach(h => { 
            h.tx = null; 
            h.ty = null; 
        });
    }, 4500);
}

/* COUNTDOWN LOGIC */
const targetDate = new Date("April 1, 2026 00:00:00").getTime();

const countdownInterval = setInterval(() => {
    let now = new Date().getTime();
    let diff = targetDate - now;

    if (diff <= 0) {
        clearInterval(countdownInterval);
        startProcess();
        return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("timer").innerHTML = `${d}d : ${h}h : ${m}m : ${s}s`;
}, 1000);

/* FLOW CONTROL */
function startProcess() {
    document.getElementById("countdown").classList.remove("active");
    document.getElementById("loader").classList.add("active");
    
    let lines = ["Connecting...", "Loading Hugs...", "ELMUN.exe ready ❤️"];
    let i = 0;
    let t = setInterval(() => {
        document.getElementById("terminal").innerHTML += lines[i++] + "\n";
        if (i === lines.length) {
            clearInterval(t);
            setTimeout(showMessage, 1000);
        }
    }, 800);
}

function showMessage() {
    document.getElementById("loader").classList.remove("active");
    document.getElementById("message").classList.add("active");
    
    let txt = "Hey Elmun... I made this for you 💙";
    let char = 0;
    let t = setInterval(() => {
        document.getElementById("msgText").innerHTML += txt[char++];
        if (char === txt.length) {
            clearInterval(t);
            setTimeout(() => {
                document.getElementById("message").classList.remove("active");
                formName();
                setTimeout(showBirthday, 5000);
            }, 1000);
        }
    }, 60);
}

function showBirthday() {
    document.getElementById("message").classList.remove("active");
    document.getElementById("birthday").classList.add("active");
    confetti({ particleCount: 300, spread: 150, origin: { y: 0.7 } });
    spawnBalloons();
    document.getElementById("music").play().catch(() => {});
}

/* CAKE INTERACTIONS */
function blowCandle() {
    document.getElementById("cake-flame").classList.add("out");
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    
    setTimeout(() => {
        document.getElementById("birthday").classList.remove("active");
        document.getElementById("cake-cutting").classList.add("active");
    }, 2000);
}

function cutCake() {
    const knife = document.getElementById("knife");
    const slice = document.getElementById("cake-slice");
    const hint = document.getElementById("cut-hint");

    knife.style.transform = "translateX(-50%) translateY(110px) rotate(0deg)";
    
    setTimeout(() => {
        slice.classList.add("cut");
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        hint.innerHTML = "Perfect! Here are your gifts 🎁";
        document.getElementById("gift-buttons").style.display = "grid";
        document.getElementById("final-trigger").style.display = "block";
    }, 600);
}

/* UPDATED EMOTIONAL MESSAGES */
const msgs = [
    "Distance is just a glitch in the matrix… 💫\nWho said online friends can’t be real?\n\nFrom random conversations to late-night talks, you’ve become someone really important to me.\n\nAnd honestly… I’m really glad I met you.",
    "Even without meeting in real life, you’ve become one of my favorite people.\n\nThanks for always listening to my random thoughts, for being there in your own way, and for just being… you.\n\nYou make things feel lighter.",
    "May your year be completely bug-free 😌\nYour happiness load in 0.1 seconds, and all your dreams compile perfectly.\n\nKeep shining, keep smiling, and don’t ever lose that spark you have ✨",
    "There’s something I don’t say enough…\n\nYou mean a lot to me.\n\nMore than just a friend, more than just someone I talk to.\n\nThank you for being in my life…\nI love you ❤️"
];

function openModal(i) {
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modalTitle").innerHTML = ["Friendship 💌", "Comfort ✨", "Wishes 🚀", "Secret 🤫"][i];
    
    let target = document.getElementById("modalText");
    let char = 0;
    let txt = msgs[i];
    target.innerHTML = "";

    let t = setInterval(() => {
        target.innerHTML += txt[char++];
        if (char === txt.length) clearInterval(t);
    }, 30);
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

/* MUSIC TOGGLE */
function toggleMusic() {
    let m = document.getElementById("music");
    let btn = document.getElementById("music-btn");
    if (m.paused) {
        m.play();
        btn.innerHTML = "⏸ Pause Music";
    } else {
        m.pause();
        btn.innerHTML = "🎵 Play Music";
    }
}

function spawnBalloons() {
    const container = document.getElementById("birthday");
    const colors = ['#ff4d6d', '#00ffcc', '#ffb703', '#8338ec', '#ff006e'];
    for (let i = 0; i < 20; i++) {
        let b = document.createElement("div");
        b.className = "balloon";
        b.style.left = Math.random() * 90 + "vw";
        b.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        b.style.animationDuration = (Math.random() * 6 + 6) + "s";
        b.onclick = function(e) {
            confetti({ particleCount: 50, origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }, colors: [this.style.backgroundColor, '#ffffff'] });
            this.remove();
        };
        container.appendChild(b);
    }
}

/* FINAL SURPRISE */
function goFinal() {
    document.getElementById("cake-cutting").classList.remove("active");
    document.getElementById("final").classList.add("active");
    
    let txt = "Happy Birthday Elmun! May our bond stay forever... 💙";
    let char = 0;
    let t = setInterval(() => {
        document.getElementById("finalText").innerHTML += txt[char++];
        if (char === txt.length) clearInterval(t);
    }, 60);

    let end = Date.now() + 5000;
    (function frame() {
        confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#ff4d6d', '#00ffcc'] });
        confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#ff4d6d', '#00ffcc'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}
