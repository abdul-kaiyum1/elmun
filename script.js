/* =========================================
   HEART PARTICLES (1000 HD HEARTS)
========================================= */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let hearts = [];
let forming = false;

class Heart {
    constructor() { 
        this.reset(); 
    }

    reset() {
        this.x = Math.random() > 0.5 ? Math.random() * canvas.width : (Math.random() > 0.5 ? -50 : canvas.width + 50);
        this.y = Math.random() > 0.5 ? canvas.height + 50 : -50;
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
            if (this.y < -50) {
                this.y = canvas.height + 50;
                this.x = Math.random() * canvas.width;
            }
            this.size = this.baseSize;
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
        ctx.shadowBlur = forming ? 0 : 15; 
        ctx.shadowColor = "#ff4d6d";
        
        ctx.fill();
        ctx.restore();
    }
}

function init() { 
    for (let i = 0; i < 1000; i++) {
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

init(); 
animate();

/* =========================================
   MAGIC CURSOR (STARDUST EFFECT)
========================================= */
document.addEventListener("mousemove", function(e) {
    if(Math.random() > 0.6) {
        let star = document.createElement("div");
        star.className = "stardust";
        star.style.left = (e.pageX - 3) + "px";
        star.style.top = (e.pageY - 3) + "px";
        document.body.appendChild(star);
        setTimeout(() => star.remove(), 1000);
    }
});

/* =========================================
   NAME MAPPING LOGIC (ELMUN)
========================================= */
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

/* =========================================
   MUSIC CONTROLS
========================================= */
let isPlaying = false;
const musicPlayer = document.getElementById("music");

function toggleMusic() {
    const btn = document.getElementById("music-btn");
    if(isPlaying) { 
        musicPlayer.pause(); 
        btn.innerHTML = "🎵 Play Music"; 
    } else { 
        musicPlayer.play(); 
        btn.innerHTML = "⏸ Pause Music"; 
    }
    isPlaying = !isPlaying;
}

/* =========================================
   COUNTDOWN LOGIC
========================================= */
const targetDate = new Date("April 1, 2026 00:00:00").getTime();
let started = false;

setInterval(() => {
    let diff = targetDate - new Date().getTime();
    
    if (diff <= 0 && !started) { 
        started = true; 
        start(); 
        return; 
    }
    
    if (diff > 0) {
        document.getElementById("timer").innerHTML = 
        `${Math.floor(diff/86400000)}d : 
         ${Math.floor((diff%86400000)/3600000)}h : 
         ${Math.floor((diff%3600000)/60000)}m : 
         ${Math.floor((diff%60000)/1000)}s`;
    }
}, 1000);

/* =========================================
   FLOW CONTROLS
========================================= */
function switchScreen(hide, show){
    document.getElementById(hide).classList.remove("active");
    document.getElementById(show).classList.add("active");
}

function start() {
    switchScreen("countdown", "loader");
    let lines = [
        "Initializing connection...", 
        "Bypassing distance protocol...", 
        "Loading virtual hugs...", 
        "Ready ❤️"
    ];
    let i = 0;
    
    let t = setInterval(() => {
        document.getElementById("terminal").innerHTML += lines[i] + "\n";
        i++;
        if (i === lines.length) { 
            clearInterval(t); 
            setTimeout(showMessage, 1000); 
        }
    }, 800);
}

function showMessage() {
    switchScreen("loader", "message");
    let txt = "Hey Elmun... I made this just for you 💙";
    let char = 0;
    
    let t = setInterval(() => {
        document.getElementById("msgText").innerHTML += txt[char];
        char++;
        if (char === txt.length) { 
            clearInterval(t); 
            setTimeout(() => { 
                document.getElementById("msgText").innerHTML = ""; 
                formName(); 
                setTimeout(showBirthday, 5000); 
            }, 1000); 
        }
    }, 60);
}

function showBirthday() {
    switchScreen("message", "birthday");
    confetti({ particleCount: 400, spread: 160, origin: { y: 0.6 } });
    
    spawnBalloons();
    
    musicPlayer.play().catch(() => {});
}

/* =========================================
   INTERACTIVE CAKE & BALLOONS
========================================= */
function blowCake() {
    const flame = document.getElementById('cake-flame');
    const hint = document.getElementById('hint-text');
    
    if (flame && !flame.classList.contains('out')) {
        flame.classList.add('out'); 
        confetti({ particleCount: 250, spread: 120, origin: { y: 0.5 } });
        hint.innerHTML = "Yay! Now open your gifts! 💌";
    } else {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } });
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
        b.style.animationDelay = (Math.random() * 5) + "s";
        
        b.onclick = function(e) {
            confetti({ 
                particleCount: 50, 
                origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight }, 
                colors: [this.style.backgroundColor, '#ffffff'] 
            });
            this.remove();
        };
        container.appendChild(b);
    }
}

/* =========================================
   TYPEWRITER MODALS
========================================= */
const msgs = [
    "Distance is just a glitch in the matrix! Who says online friends can't be best friends? From our late-night chats to everything in between, you are truly special. Happy Birthday!",
    "Even without hanging out in real life, you've become one of my absolute favorite people. Thanks for always listening to my random thoughts and being such an awesome friend. Have the best day ever!",
    "May your year be completely bug-free, your happiness load in 0.1 seconds, and all your dreams compile perfectly! Stay happy and keep shining. 🌟",
    "You mean so much to me. Thank you for being such an amazing part of my life. I love you! ❤️"
];

const titles = [
    "Envelope 1 💌", 
    "Envelope 2 ✨", 
    "Envelope 3 🚀", 
    "The Final Secret 🤫"
];

let typeInterval;

function openModal(i) {
    document.getElementById("modal").style.display = "flex";
    document.getElementById("modalTitle").innerHTML = titles[i];
    let target = document.getElementById("modalText");
    target.innerHTML = "";
    
    clearInterval(typeInterval);
    
    let txt = msgs[i];
    let char = 0;
    
    typeInterval = setInterval(() => {
        if (char < txt.length) {
            target.innerHTML += txt[char];
            char++;
        } else {
            clearInterval(typeInterval);
        }
    }, 40);
}

function closeModal() { 
    document.getElementById("modal").style.display = "none"; 
    clearInterval(typeInterval); 
}

/* =========================================
   FINAL SCREEN
========================================= */
function goFinal() {
    switchScreen("birthday", "final");
    
    let txt = "No matter the distance... you mean everything to me. Happy Birthday once again! 💙";
    let char = 0;
    
    let t = setInterval(() => {
        if (char < txt.length) {
            document.getElementById("finalText").innerHTML += txt[char];
            char++;
        } else {
            clearInterval(t);
        }
    }, 50);

    let end = Date.now() + 4000;
    (function frame() {
        confetti({ particleCount: 8, angle: 60, spread: 60, origin: { x: 0 }, colors: ['#ff4d6d', '#00ffcc', '#ffb703'] });
        confetti({ particleCount: 8, angle: 120, spread: 60, origin: { x: 1 }, colors: ['#ff4d6d', '#00ffcc', '#ffb703'] });
        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}