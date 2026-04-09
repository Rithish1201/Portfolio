// Force page to start at the top on every refresh
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

let mouseX = 0, mouseY = 0;

// Ensure scroll happens after browser paints and tries its own scroll
window.addEventListener('load', () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    
    // Remove hash from URL if present so it doesn't jump down (e.g., #about)
    if (window.location.hash) {
        history.replaceState('', document.title, window.location.pathname + window.location.search);
    }
});

// Initialize Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Integrate Lenis with GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});
gsap.ticker.lagSmoothing(0, 0);


// Initialize AOS
AOS.init({
    once: false,
    offset: 100,
});

// Update Scroll Progress Bar
const progressBar = document.querySelector('.scroll-progress-bar');
window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollTop;
    const heightTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPosition = (scrollTotal / heightTotal) * 100;
    progressBar.style.width = scrollPosition + '%';
});

// Typing Text Animation
const typed = new Typed('#typed-text', {
    strings: ['Full-Stack Developer', 'AI & Data Science Student', 'IoT Innovator', 'AR/VR Enthusiast'],
    typeSpeed: 50,
    backSpeed: 30,
    backDelay: 2000,
    loop: true
});

// Custom Cursor Logic
const cursorDot = document.querySelector('.cursor-dot');


window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot tracks with high responsiveness
    gsap.set(cursorDot, { x: mouseX, y: mouseY });

    // Spotlight effect
    const spotlight = document.querySelector('.spotlight-overlay');
    if (spotlight) {
        spotlight.style.setProperty('--x', `${mouseX}px`);
        spotlight.style.setProperty('--y', `${mouseY}px`);
    }
});

// Click Interaction
window.addEventListener('mousedown', () => cursorDot.classList.add('active'));
window.addEventListener('mouseup', () => cursorDot.classList.remove('active'));

window.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
});

// Hover morphing
const interactives = 'a, button, .magnetic-btn, .interactive-fact, .tech-planet, .cell, .splash-dp-container';
document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactives)) cursorDot.classList.add('hover');
});
document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactives)) cursorDot.classList.remove('hover');
});

// Cursor Particle Trail Logic
const trailCanvas = document.getElementById('cursor-trail');
const trailCtx = trailCanvas ? trailCanvas.getContext('2d') : null;
let trailParticles = [];
let cursorLastX = 0;
let cursorLastY = 0;

if (trailCanvas) {
    const resizeTrail = () => {
        trailCanvas.width = window.innerWidth;
        trailCanvas.height = window.innerHeight;
    };
    resizeTrail();
    window.addEventListener('resize', resizeTrail);

    class TrailParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.life = 1; // opacity
            this.color = `hsla(${Math.random() * 60 + 180}, 100%, 50%, ${this.life})`; // Cyan/Blue range
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.size > 0.1) this.size -= 0.05;
            this.life -= 0.02;
        }
        draw() {
            trailCtx.fillStyle = `rgba(0, 242, 254, ${this.life})`;
            trailCtx.beginPath();
            trailCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            trailCtx.fill();
        }
    }

    window.addEventListener('mousemove', (e) => {
        const dx = e.clientX - cursorLastX;
        const dy = e.clientY - cursorLastY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Spawn particles based on distance moved
        if (dist > 4) {
            const count = Math.min(Math.floor(dist / 4), 5); // Faster moves = more particles
            for (let i = 0; i < count; i++) {
                trailParticles.push(new TrailParticle(e.clientX, e.clientY));
            }
            cursorLastX = e.clientX;
            cursorLastY = e.clientY;
        }
    });

    function animateTrail() {
        trailCtx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
        for (let i = 0; i < trailParticles.length; i++) {
            trailParticles[i].update();
            trailParticles[i].draw();
            if (trailParticles[i].life <= 0) {
                trailParticles.splice(i, 1);
                i--;
            }
        }
        requestAnimationFrame(animateTrail);
    }
    animateTrail();
}

// Magnetic Buttons
const magneticBtns = document.querySelectorAll('.magnetic-btn');

magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const position = btn.getBoundingClientRect();
        const x = e.clientX - position.left - position.width / 2;
        const y = e.clientY - position.top - position.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorOutline.style.borderColor = 'var(--accent-color)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'var(--secondary-color)';
    });
});

// Three.js Background Animation (Particles)
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg-canvas'),
    alpha: true,
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 2000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    // Spread particles
    posArray[i] = (Math.random() - 0.5) * 15;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.005,
    color: 0x00f2fe,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

camera.position.z = 3;

// Mouse tracking for 3D environment
// Reusing global mouseX and mouseY declared at top


document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) - 0.5;
    mouseY = (event.clientY / window.innerHeight) - 0.5;
});

// Clock for smooth animation
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Rotate particles slowly
    particlesMesh.rotation.y = elapsedTime * 0.05;
    particlesMesh.rotation.x = elapsedTime * 0.02;

    // React to mouse movement
    particlesMesh.rotation.y += mouseX * 0.1;
    particlesMesh.rotation.x += mouseY * 0.1;

    renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    if (splashRenderer) {
        splashCamera.aspect = window.innerWidth / window.innerHeight;
        splashCamera.updateProjectionMatrix();
        splashRenderer.setSize(window.innerWidth, window.innerHeight);
    }
});

/* ─────────────────────────────────────────
   3D CRYSTAL BACKGROUND (Splash Screen)
   ─────────────────────────────────────────*/
const splashScene = new THREE.Scene();
const splashBgCanvas = document.querySelector('#splash-bg-canvas');
let splashRenderer, splashCamera, splashCrystals = [], splashAnimationId;

if (splashBgCanvas) {
    splashCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    splashRenderer = new THREE.WebGLRenderer({ canvas: splashBgCanvas, alpha: true, antialias: true });
    splashRenderer.setSize(window.innerWidth, window.innerHeight);
    splashRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create Crystals
    const crystalColors = [0x00f2fe, 0x4FACFE, 0x43E97B];
    for (let i = 0; i < 15; i++) {
        const geometry = i % 2 === 0 ? new THREE.OctahedronGeometry(Math.random() * 0.5 + 0.2, 0) : new THREE.IcosahedronGeometry(Math.random() * 0.4 + 0.2, 0);
        
        // Solid glow material
        const material = new THREE.MeshPhongMaterial({
            color: crystalColors[Math.floor(Math.random() * crystalColors.length)],
            transparent: true,
            opacity: 0.2,
            shininess: 100,
            emissive: crystalColors[Math.floor(Math.random() * crystalColors.length)],
            emissiveIntensity: 0.5
        });

        const mesh = new THREE.Mesh(geometry, material);
        
        // Tech Wireframe overlay
        const wireframeMaterial = new THREE.MeshBasicMaterial({ 
            color: material.color, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.4 
        });
        const wireframe = new THREE.Mesh(geometry, wireframeMaterial);
        mesh.add(wireframe);

        // Random position
        mesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5);
        mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        
        // Store movement data
        mesh.userData = {
            rotSpeed: { x: Math.random() * 0.01, y: Math.random() * 0.01, z: Math.random() * 0.01 },
            floatOffset: Math.random() * Math.PI * 2,
            floatSpeed: 0.5 + Math.random() * 0.5
        };

        splashScene.add(mesh);
        splashCrystals.push(mesh);
    }

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    splashScene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00f2fe, 2);
    pointLight.position.set(5, 5, 5);
    splashScene.add(pointLight);

    splashCamera.position.z = 5;

    function animateSplash() {
        splashAnimationId = requestAnimationFrame(animateSplash);
        const time = Date.now() * 0.001;

        splashCrystals.forEach(c => {
            c.rotation.x += c.userData.rotSpeed.x;
            c.rotation.y += c.userData.rotSpeed.y;
            c.position.y += Math.sin(time * c.userData.floatSpeed + c.userData.floatOffset) * 0.002;
            c.position.x += Math.cos(time * 0.5 + c.userData.floatOffset) * 0.001;
            
            // Punchy Color Cycling
            const hue = (time * 0.1 + c.userData.floatOffset) % 1;
            c.material.emissive.setHSL(hue, 1, 0.5);
            c.children[0].material.color.setHSL(hue, 1, 0.5);
        });

        // Drift based on mouse
        splashScene.rotation.y += (mouseX * 0.05 - splashScene.rotation.y) * 0.05;
        splashScene.rotation.x += (mouseY * 0.05 - splashScene.rotation.x) * 0.05;

        splashRenderer.render(splashScene, splashCamera);
    }
    animateSplash();
}

// GSAP ScrollTrigger for Roadmap Line
// We animate a pseudo-element height. Since we can't directly animate CSS variables natively easily via GSAP without extra setup, 
// we will animate a DOM element we add dynamically to the timeline-line.
const timelineLine = document.querySelector('.timeline-line');
const progressLine = document.createElement('div');
progressLine.style.position = 'absolute';
progressLine.style.top = '0';
progressLine.style.left = '0';
progressLine.style.width = '100%';
progressLine.style.height = '0%';
progressLine.style.background = 'linear-gradient(180deg, var(--primary-color), var(--accent-color))';
progressLine.style.borderRadius = '2px';
timelineLine.appendChild(progressLine);

gsap.to(progressLine, {
    height: "100%",
    ease: "none",
    scrollTrigger: {
        trigger: ".roadmap-section",
        start: "top center",
        end: "bottom center",
        scrub: 1
    }
});

// Add GSAP Parallax to About Me floating cards
gsap.to(".stat-box", {
    y: -50,
    ease: "none",
    scrollTrigger: {
        trigger: ".about-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
    }
});

// Matrix Rain Effect for About Section
const matrixCanvas = document.getElementById('matrix-canvas');
if (matrixCanvas) {
    const ctx = matrixCanvas.getContext('2d');

    // Set canvas dimensions to match the section
    const resizeMatrix = () => {
        matrixCanvas.width = document.querySelector('.about-section').offsetWidth;
        matrixCanvas.height = document.querySelector('.about-section').offsetHeight;
    };
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);

    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*<>[]{}';
    const matrix = letters.split('');
    const fontSize = 16;
    let drops = [];
    for (let x = 0; x < matrixCanvas.width / fontSize; x++) drops[x] = 1;

    function drawMatrix() {
        ctx.fillStyle = 'rgba(5, 5, 5, 0.05)';
        ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

        ctx.fillStyle = 'rgba(0, 242, 254, 0.5)'; // Darker Cyan for subtle background effect
        ctx.font = fontSize + 'px monospace';

        if (drops.length < matrixCanvas.width / fontSize) {
            for (let x = drops.length; x < matrixCanvas.width / fontSize; x++) drops[x] = 1;
        }

        for (let i = 0; i < drops.length; i++) {
            const text = matrix[Math.floor(Math.random() * matrix.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    setInterval(drawMatrix, 50);
}

// AI Chatbot Logic
const chatToggle = document.getElementById('chatbot-toggle');
const chatPanel = document.getElementById('chatbot-panel');
const closeChat = document.getElementById('close-chat');
const chatInput = document.getElementById('chat-input');
const sendChat = document.getElementById('send-chat');
const chatOutput = document.getElementById('chat-output');

if (chatToggle && chatPanel) {
    chatToggle.addEventListener('click', () => {
        chatPanel.classList.remove('hidden');
        chatToggle.style.transform = 'scale(0)';
    });

    closeChat.addEventListener('click', () => {
        chatPanel.classList.add('hidden');
        chatToggle.style.transform = 'scale(1)';
    });

    const handleChat = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        // Add user msg
        const userMsg = document.createElement('p');
        userMsg.className = 'user-msg';
        userMsg.textContent = text;
        chatOutput.appendChild(userMsg);

        chatInput.value = '';
        chatOutput.scrollTop = chatOutput.scrollHeight;

        // Simulated Bot Response
        setTimeout(() => {
            const botMsg = document.createElement('p');
            botMsg.className = 'bot-msg';

            const lowerText = text.toLowerCase();
            if (lowerText.includes('skill')) {
                botMsg.textContent = 'Rithish is proficient in React 19, Node.js, FastAPI, Python, AI/ML (Gemini, TensorFlow), and IoT.';
            } else if (lowerText.includes('project')) {
                botMsg.textContent = 'His featured projects include CrisisAI Live, CodeLab, JARVIS Factory IoT, and AgriSmart360.';
            } else if (lowerText.includes('contact')) {
                botMsg.textContent = 'You can reach Rithish at rithish1201@gmail.com or call +91 9965968697.';
            } else {
                botMsg.textContent = 'Interesting! As an AI prototype, my responses are limited. Ask me about his skills, projects, or contact info.';
            }

            chatOutput.appendChild(botMsg);
            chatOutput.scrollTop = chatOutput.scrollHeight;
        }, 1000);
    };

    sendChat.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });
}

// Tic-Tac-Toe Game Logic (Unbeatable AI with Minimax)
const boardCells = document.querySelectorAll('.cell');
const gameStatus = document.getElementById('game-status');
const resetBtn = document.getElementById('reset-game');
const humanPlayer = 'X';
const aiPlayer = 'O';
let gameState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

if (boardCells.length > 0) {
    function handleCellClick(e) {
        const cell = e.target;
        const index = parseInt(cell.getAttribute('data-index'));

        if (gameState[index] !== "" || !gameActive) return;

        // Human Turn
        makeMove(index, humanPlayer);
        if(!checkWinForVisuals()) {
            gameStatus.textContent = "Jarvis is thinking...";
            gameActive = false; // Block user input while AI thinks
            
            // AI Turn with small delay for realism
            setTimeout(() => {
                const bestMoveIndex = minimax(gameState, aiPlayer).index;
                makeMove(bestMoveIndex, aiPlayer);
                checkWinForVisuals();
                if(gameActive) gameStatus.textContent = `Your Turn (X)`;
            }, 500);
        }
    }

    function makeMove(index, player) {
        if (typeof index !== 'number') return;
        gameState[index] = player;
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        cell.textContent = player;
        cell.classList.add(player.toLowerCase());
    }

    function checkWinForVisuals() {
        if (checkWinResult(gameState, humanPlayer)) {
            gameStatus.textContent = `You Win! (Wait, that's impossible...)`;
            gameActive = false;
            return true;
        } else if (checkWinResult(gameState, aiPlayer)) {
            gameStatus.textContent = `Jarvis Wins!`;
            gameActive = false;
            return true;
        } else if (getEmptySpots(gameState).length === 0) {
            gameStatus.textContent = "It's a Draw!";
            gameActive = false;
            return true;
        }
        gameActive = true;
        return false;
    }

    // --- MINIMAX AI LOGIC ---
    function getEmptySpots(board) {
        return board.map((spot, index) => spot === "" ? index : null).filter(val => val !== null);
    }

    function checkWinResult(board, player) {
        return winningConditions.some(condition => {
            return condition.every(index => board[index] === player);
        });
    }

    function minimax(newBoard, player) {
        const availSpots = getEmptySpots(newBoard);

        // Terminal states check
        if (checkWinResult(newBoard, humanPlayer)) {
            return { score: -10 };
        } else if (checkWinResult(newBoard, aiPlayer)) {
            return { score: 10 };
        } else if (availSpots.length === 0) {
            return { score: 0 };
        }

        const moves = [];

        for (let i = 0; i < availSpots.length; i++) {
            const move = {};
            move.index = availSpots[i];

            newBoard[availSpots[i]] = player; // Make valid move

            if (player === aiPlayer) {
                const result = minimax(newBoard, humanPlayer);
                move.score = result.score;
            } else {
                const result = minimax(newBoard, aiPlayer);
                move.score = result.score;
            }

            newBoard[availSpots[i]] = ""; // Reset spot
            moves.push(move);
        }

        let bestMove;
        if (player === aiPlayer) {
            let bestScore = -10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 10000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function resetGame() {
        gameState = ["", "", "", "", "", "", "", "", ""];
        gameActive = true;
        gameStatus.textContent = `Your Turn (X)`;
        boardCells.forEach(cell => {
            cell.textContent = "";
            cell.classList.remove('x', 'o');
        });
    }

    boardCells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetBtn.addEventListener('click', resetGame);
}

// Background Music & Splash Screen Logic
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = musicToggle ? musicToggle.querySelector('i') : null;
const splashScreen = document.getElementById('splash-screen');
const enterBtn = document.getElementById('enter-btn');

if (bgMusic && musicToggle && splashScreen && enterBtn) {
    let isPlaying = true; // Default to ON for a premium feel

    const updateUI = () => {
        if (!bgMusic.paused) {
            musicIcon.className = 'fas fa-volume-up';
            musicToggle.classList.add('playing');
        } else {
            musicIcon.className = 'fas fa-volume-mute';
            musicToggle.classList.remove('playing');
        }
    };

    const startExperience = () => {
        // High-energy Burst Effect with Speed Lines
        const speedLinesGroup = new THREE.Group();
        splashScene.add(speedLinesGroup);

        for(let i=0; i<30; i++) {
            const lineGeom = new THREE.BoxGeometry(0.02, 0.02, 2);
            const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
            const line = new THREE.Mesh(lineGeom, lineMat);
            line.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*10, Math.random()*5);
            speedLinesGroup.add(line);
            
            gsap.to(line.position, { z: -10, duration: 1, ease: "power4.in" });
            gsap.to(line.scale, { z: 20, duration: 1, ease: "power4.in" });
        }

        gsap.to(splashScreen, {
            duration: 1.2,
            scale: 12,
            opacity: 0,
            ease: "power4.in",
            onComplete: () => {
                splashScreen.style.display = 'none';
                document.body.style.overflow = 'auto'; // Re-enable scroll
                
                // Cleanup 3D Splash resources
                if (splashAnimationId) cancelAnimationFrame(splashAnimationId);
                if (splashRenderer) {
                    splashRenderer.dispose();
                    splashScene.traverse(obj => {
                        if (obj.geometry) obj.geometry.dispose();
                        if (obj.material) {
                            if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                            else obj.material.dispose();
                        }
                    });
                }
            }
        });

        // Give the background particles a punchy boost
        gsap.to(particlesMesh.rotation, { y: "+=5", duration: 3, ease: "power2.out" });
        gsap.to(particlesMaterial, { size: 0.02, duration: 0.5, yoyo: true, repeat: 1 });
        
        // Start Music
        bgMusic.play().then(() => {
            updateUI();
        }).catch(e => console.log("Audio block persisted."));

        // Refresh animations to ensure they trigger correctly after splash
        AOS.refresh();
    };

    enterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startExperience();
    });

    // Toggle button handler
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!bgMusic.paused) {
            bgMusic.pause();
            isPlaying = false;
        } else {
            bgMusic.play();
            isPlaying = true;
        }
        updateUI();
    });

}
