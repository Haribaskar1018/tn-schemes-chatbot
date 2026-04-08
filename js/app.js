/* ═══════════════════════════════════════════════════════════════
   TN Government Schemes Hub — App Logic
   Features: Chat, Particles, Scroll Reveal, Counter Animation
   ═══════════════════════════════════════════════════════════════ */

// ─── PARTICLES BACKGROUND ───
(function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 50;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            radius: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.15 + 0.05,
            color: Math.random() > 0.5 ? 'rgba(13,92,56,' : 'rgba(221,161,94,'
        };
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(createParticle());
        }
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color + p.opacity + ')';
            ctx.fill();
        });

        // Draw connecting lines
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(13,92,56,${0.03 * (1 - dist / 150)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    init();
    draw();
})();

// ─── NAVBAR SCROLL ───
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
})();

// ─── STATS COUNTER ANIMATION ───
(function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    function animateCounters() {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 1500;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                // easeOutQuart
                const eased = 1 - Math.pow(1 - progress, 4);
                counter.textContent = Math.floor(eased * target);
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }
            requestAnimationFrame(update);
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    const statsContainer = document.querySelector('.hero-stats');
    if (statsContainer) observer.observe(statsContainer);
})();

// ─── SCROLL REVEAL for Cards & Steps ───
(function initScrollReveal() {
    const elements = document.querySelectorAll('.card, .step-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    elements.forEach(el => observer.observe(el));
})();

// ─── MOBILE MENU ───
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.right = '20px';
        navLinks.style.background = 'white';
        navLinks.style.padding = '20px';
        navLinks.style.borderRadius = '16px';
        navLinks.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        navLinks.querySelectorAll('a').forEach(a => a.style.color = '#1f2937');
    }
}

// ─── LANGUAGE TOGGLE (placeholder) ───
let currentLang = 'ta';
function toggleLanguage() {
    currentLang = currentLang === 'ta' ? 'en' : 'ta';
    // Placeholder — a full i18n system could be plugged in here
}

// ─── CHATBOT ───
function toggleChat() {
    const chatWindow = document.getElementById('chat-window');
    chatWindow.classList.toggle('active');
}

function autoPrompt(text) {
    if (!document.getElementById('chat-window').classList.contains('active')) {
        toggleChat();
    }
    // Small delay to allow animation
    setTimeout(() => {
        const input = document.getElementById('chat-input');
        input.value = text;
        sendMessage();
    }, 300);
}

function handleKeyPress(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
}

async function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';

    // Add user message
    appendMessage(message, 'user');

    // Typing indicator
    const typingId = showTyping();

    try {
        const response = await fetch('http://localhost:8000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });

        const data = await response.json();
        removeTyping(typingId);

        if (data.error) {
            appendMessage("மன்னிக்கவும், ஒரு பிழை ஏற்பட்டுள்ளது: " + data.error, 'bot');
        } else {
            appendMessage(formatText(data.response), 'bot');
        }
    } catch (error) {
        removeTyping(typingId);
        appendMessage("மன்னிக்கவும், சேவையகத்தை தொடர்பு கொள்ள முடியவில்லை. (Server not reachable — make sure backend.py is running)", 'bot');
    }
}

function appendMessage(text, sender) {
    const chatBody = document.getElementById('chat-body');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;

    if (sender === 'bot') {
        msgDiv.innerHTML = `
            <div class="bot-avatar-small"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble">${text}</div>
        `;
    } else {
        msgDiv.innerHTML = `<div class="msg-bubble">${text}</div>`;
    }

    chatBody.appendChild(msgDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function showTyping() {
    const chatBody = document.getElementById('chat-body');
    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'message bot typing';
    typingDiv.innerHTML = `
        <div class="bot-avatar-small"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble">
            <div class="dot"></div><div class="dot"></div><div class="dot"></div>
        </div>
    `;
    chatBody.appendChild(typingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
    return id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function clearChat() {
    const chatBody = document.getElementById('chat-body');
    chatBody.innerHTML = `
        <div class="message bot">
            <div class="bot-avatar-small"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble">
                வணக்கம்! 🙏 நான் தமிழ்நாடு அரசு திட்டங்கள் உதவியாளர்.
                <br><br>உங்களுக்கு எந்த திட்டம் பற்றி தகவல் வேண்டும்?
            </div>
        </div>
        <div class="quick-chips">
            <button class="chip" onclick="autoPrompt('கலைஞர் மகளிர் உரிமை திட்டம் என்றால் என்ன?')">🏆 மகளிர் உரிமை</button>
            <button class="chip" onclick="autoPrompt('புதுமை பெண் திட்டம் பற்றி சொல்லுங்கள்')">📚 புதுமை பெண்</button>
            <button class="chip" onclick="autoPrompt('நான் முதல்வன் திட்டம் பற்றி விளக்குங்கள்')">💼 நான் முதல்வன்</button>
            <button class="chip" onclick="autoPrompt('எனக்கு என்ன திட்டங்கள் கிடைக்கும்?')">❓ எனக்கான திட்டங்கள்</button>
        </div>
    `;
}

// Simple markdown to HTML
function formatText(text) {
    if (!text) return "";
    let f = text;
    // Headers
    f = f.replace(/^### (.*$)/gm, '<strong style="font-size:1.05rem">$1</strong>');
    f = f.replace(/^## (.*$)/gm, '<strong style="font-size:1.1rem">$1</strong>');
    // Bold & italic
    f = f.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    f = f.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Lists
    f = f.replace(/^- (.*$)/gm, '• $1');
    f = f.replace(/^\d+\. (.*$)/gm, '▸ $1');
    // Line breaks
    f = f.replace(/\n/g, '<br>');
    return f;
}
