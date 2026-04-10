/* =====================================================
   Extra.js — Interactivity for All 12 New Portfolio Sections
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ─────────────────────────────────────────
       1. INTERACTIVE TERMINAL
       ─────────────────────────────────────────*/
    const termInput = document.getElementById('terminal-input');
    const termBody = document.getElementById('terminal-body');

    const COMMANDS = {
        help: `<span class="t-output">Available commands:
  <span style="color:var(--primary-color)">about</span>      — Learn about Rithish
  <span style="color:var(--primary-color)">skills</span>     — List tech skills
  <span style="color:var(--primary-color)">projects</span>   — Show all projects
  <span style="color:var(--primary-color)">hobbies</span>    — Gaming & interests
  <span style="color:var(--primary-color)">roadmap</span>    — Academic journey
  <span style="color:var(--primary-color)">contact</span>    — Get contact info
  <span style="color:var(--primary-color)">clear</span>      — Clear terminal
  <span style="color:var(--primary-color)">whoami</span>     — Identity reveal
  <span style="color:var(--primary-color)">socials</span>    — Social media links
  <span style="color:var(--primary-color)">date</span>       — Current date/time</span>`,

        ls: `<span class="t-output">about  skills  projects  hobbies  roadmap  contact  clear  whoami  socials  date</span>`,

        hobbies: `<span class="t-output">🎮 Gaming  : Freefire, PUBG, GTA 5, Fortnite
🎵 Music   : Phonk, Lo-fi, Synthwave
☕ Coffee  : Black Coffee & Espresso
🤖 Future  : Generative AI & Robotics</span>`,

        roadmap: `<span class="t-output">Current: B.Tech AI & Data Science (Sem 4)
Focus  : Deep Learning · Computer Vision
Next   : Research Internship in AI Safety</span>`,

        socials: `<span class="t-output">GitHub    : @Rithish1201
LinkedIn  : /in/rithish-r-785337317
Instagram : @_rithish.json_</span>`,

        about: `<span class="t-output">┌─ Rithish R ────────────────────────────────┐
│ 2nd-year B.Tech AI & Data Science student  │
│ @ KGiSL Institute of Technology, Coimbatore│
│ Passionate about AI, IoT, AR/VR & Web Dev  │
│ Open-source contributor · Night-owl coder  │
└────────────────────────────────────────────┘</span>`,

        skills: `<span class="t-output">Languages  : Python · JavaScript · C/C++ · SQL
Frontend   : React 19 · Vite · Tailwind CSS · Three.js
Backend    : Node.js · FastAPI · Socket.io · MongoDB
AI/ML      : TensorFlow · Scikit-learn · Gemini API
IoT        : Arduino · ESP8266 · MQTT · Sensor Fusion
Tools      : Git · Figma · VS Code · Linux</span>`,

        projects: `<span class="t-output">1. CrisisAI Live       — Public safety intelligence
2. CodeLab             — Online IDE & real-time debugger
3. JARVIS Smart Factory — Industrial IoT platform
4. AgriSmart360        — Precision agriculture AI
5. SmartText AI        — AI-powered text utility
6. Math Master         — Scientific computation suite
7. KeralaVerse         — AR/VR heritage platform
8. IP & URL Analyzer   — Cybersecurity threat intel</span>`,

        contact: `<span class="t-output">Email    : rithish1201@gmail.com
GitHub   : github.com/Rithish1201
LinkedIn : linkedin.com/in/rithish-r-785337317
Instagram: @_.rithish1201._
Location : Coimbatore, Tamil Nadu, India</span>`,

        education: `<span class="t-output">🎓 B.Tech AI & DS  — KGiSL Institute (2024–2027)
📚 12th Science     — Amrita Vidyalayam (CBSE) (2024)
📖 10th Grade       — Amrita Vidyalayam (CBSE) (2022)</span>`,

        whoami: `<span class="t-output" style="color:var(--accent-color)">Rithish R — AI Engineer · Full-Stack Dev · Tech Dreamer
"Building the future, one commit at a time."</span>`,

        date: `<span class="t-output">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>`,

        clear: '__clear__'
    };



    function appendLine(cmd, output) {
        const cmdLine = document.createElement('div');
        cmdLine.className = 't-line';
        cmdLine.innerHTML = `<span class="t-prompt">rithish@portfolio:~$</span> <span class="t-text">${cmd}</span>`;
        termBody.appendChild(cmdLine);

        if (output === '__clear__') {
            termBody.innerHTML = '';
            return;
        }

        const outLine = document.createElement('div');
        outLine.className = 't-line';
        outLine.innerHTML = output;
        termBody.appendChild(outLine);
        termBody.scrollTop = termBody.scrollHeight;
    }

    if (termInput) {
        termInput.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                const val = termInput.value.trim().toLowerCase();
                termInput.value = '';
                if (!val) return;
                const result = COMMANDS[val];
                if (result) {
                    appendLine(val, result);
                } else {
                    appendLine(val, `<span class="t-error">Command not found: '${val}'. Type 'help' for a list.</span>`);
                }
            }
        });

        document.querySelector('.terminal-window')?.addEventListener('click', () => termInput.focus());
    }


    /* ─────────────────────────────────────────
       4. CODING ACTIVITY CHARTS (Chart.js)
       ─────────────────────────────────────────*/
    const langChart = document.getElementById('lang-chart');
    const hoursChart = document.getElementById('hours-chart');

    async function fetchGitHubStats(username) {
        const cacheKey = `gh_stats_${username}`;
        const cached = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        
        if (cached && cacheTime && (Date.now() - parseInt(cacheTime) < 3600000)) {
            return JSON.parse(cached);
        }

        try {
            const [repoRes, eventsRes] = await Promise.all([
                fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`),
                fetch(`https://api.github.com/users/${username}/events?per_page=100`)
            ]);

            const repos = await repoRes.json();
            const languages = {};
            repos.forEach(r => {
                if (r.language) {
                    languages[r.language] = (languages[r.language] || 0) + 1;
                }
            });

            const topLangs = Object.entries(languages)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);
                
            let total = 0;
            topLangs.forEach(l => total += l[1]);
            
            const langLabels = [];
            const langData = [];
            topLangs.forEach(l => {
                langLabels.push(l[0]);
                langData.push(Math.round((l[1] / total) * 100));
            });

            const events = await eventsRes.json();
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const commitCounts = [0, 0, 0, 0, 0, 0, 0];
            const displayLabels = [];
            
            const today = new Date().getDay();
            for(let i=6; i>=0; i--) {
                let d = today - i;
                if(d < 0) d += 7;
                displayLabels.push(days[d]);
            }
            
            const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
            
            events.forEach(ev => {
                if (ev.type === 'PushEvent' || ev.type === 'CreateEvent') {
                    const evDate = new Date(ev.created_at);
                    if (evDate.getTime() > oneWeekAgo) {
                        commitCounts[evDate.getDay()]++;
                    }
                }
            });
            
            const orderedCommits = [];
            for(let i=6; i>=0; i--) {
                let d = today - i;
                if(d < 0) d += 7;
                orderedCommits.push(commitCounts[d]);
            }
            
            const finalData = {
                langLabels: langLabels.length > 0 ? langLabels : ['Python', 'JavaScript', 'HTML', 'CSS', 'C++'],
                langData: langData.length > 0 ? langData : [40, 25, 20, 10, 5],
                commitLabels: displayLabels,
                commitData: orderedCommits
            };
            
            localStorage.setItem(cacheKey, JSON.stringify(finalData));
            localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
            
            return finalData;

        } catch (error) {
            console.error("Error fetching GitHub stats:", error);
            return null;
        }
    }

    async function initCharts() {
        if (!langChart || !hoursChart || typeof Chart === 'undefined') return;

        let stats = await fetchGitHubStats('Rithish1201');
        
        if (!stats) {
            stats = {
                langLabels: ['Python', 'JavaScript', 'React/JSX', 'CSS/HTML', 'C++', 'Other'],
                langData: [40, 25, 20, 8, 4, 3],
                commitLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                commitData: [3, 5, 4, 6, 7, 9, 5] 
            };
        }

        new Chart(langChart, {
            type: 'doughnut',
            data: {
                labels: stats.langLabels,
                datasets: [{
                    data: stats.langData,
                    backgroundColor: [
                        'rgba(0,242,254,0.7)',
                        'rgba(233,0,255,0.7)',
                        'rgba(79,172,254,0.7)',
                        'rgba(67,233,123,0.7)',
                        'rgba(253,200,68,0.7)',
                        'rgba(100,100,100,0.5)',
                    ],
                    borderWidth: 0,
                }]
            },
            options: {
                plugins: {
                    legend: { labels: { color: '#a1a1aa', font: { family: 'Outfit' } } }
                },
                cutout: '65%'
            }
        });

        new Chart(hoursChart, {
            type: 'bar',
            data: {
                labels: stats.commitLabels,
                datasets: [{
                    label: 'Commits',
                    data: stats.commitData,
                    backgroundColor: 'rgba(0,242,254,0.3)',
                    borderColor: 'rgba(0,242,254,0.8)',
                    borderWidth: 2,
                    borderRadius: 8,
                }]
            },
            options: {
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: { ticks: { color: '#a1a1aa' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                    y: { ticks: { color: '#a1a1aa' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
                }
            }
        });
    }

    initCharts();


    /* ─────────────────────────────────────────
       5. TECH STACK TOOLTIP
       ─────────────────────────────────────────*/
    const planets = document.querySelectorAll('.tech-planet');
    const tooltip = document.getElementById('tech-tooltip');

    planets.forEach(planet => {
        planet.addEventListener('mouseenter', () => {
            if (!tooltip) return;
            const tech = planet.dataset.tech;
            const projects = planet.dataset.projects;
            tooltip.innerHTML = `<strong>${tech}</strong><br><small style="color:var(--text-muted)">Used in: ${projects}</small>`;
            tooltip.style.display = 'block';
        });
        planet.addEventListener('mouseleave', () => {
            if (tooltip) tooltip.style.display = 'none';
        });
    });


    /* ─────────────────────────────────────────
       6. VISITOR COUNTER (CountAPI)
       ─────────────────────────────────────────*/
    const visitorEl = document.getElementById('visitor-count');
    if (visitorEl) {
        // Using counterapi.dev as a reliable alternative to countapi.xyz
        fetch('https://api.counterapi.dev/v1/rithish-portfolio/visits/up')
            .then(r => r.json())
            .then(data => {
                if (data && data.count) {
                    animateNum(visitorEl, data.count);
                } else {
                    visitorEl.textContent = '1,000+';
                }
            })
            .catch(() => {
                visitorEl.textContent = '1,200+';
            });
    }

    /* ─────────────────────────────────────────
       7. FUN FACTS COUNTER ANIMATION
       ─────────────────────────────────────────*/
    const factCounters = document.querySelectorAll('.counter-num');
    
    const factObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNum(entry.target, target);
                factObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    factCounters.forEach(counter => factObserver.observe(counter));

    /* ─────────────────────────────────────────
       8. INTERACTIVE HOBBY CARDS
       ─────────────────────────────────────────*/
    const interactiveCards = document.querySelectorAll('.interactive-fact');
    interactiveCards.forEach(card => {
        card.addEventListener('click', () => {
            const info = card.getAttribute('data-info');
            const originalText = card.querySelector('p').textContent;
            const detailLabel = card.querySelector('.fact-detail');
            
            if (card.classList.contains('active')) {
                card.classList.remove('active');
                detailLabel.textContent = 'Click to reveal';
            } else {
                // Deactivate others
                interactiveCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                detailLabel.textContent = info;
            }
        });
    });

    function animateNum(el, target) {
        let current = 0;
        const duration = 2000; // 2 seconds
        const stepTime = Math.abs(Math.floor(duration / target));
        
        // Ensure minimum step time for high numbers to avoid browser lag
        const actualStepTime = Math.max(stepTime, 20);
        const increment = target / (duration / actualStepTime);

        const timer = setInterval(() => {
            current += increment;
            el.textContent = Math.floor(current).toLocaleString();
            
            if (current >= target) {
                el.textContent = target.toLocaleString();
                clearInterval(timer);
            }
        }, actualStepTime);
    }

});
