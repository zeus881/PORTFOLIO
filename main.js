'use strict';

/* ══════════════════════════════════════
   CUSTOM CURSOR
══════════════════════════════════════ */
(function setupCursor() {
    return;
    const dot   = document.getElementById('cursor');
    const trail = document.getElementById('cursor-trail');
    if (!dot || !trail) return;

    let tx = 0, ty = 0;
    let px = 0, py = 0;
    let cursorScale = 1;
    let cursorColor = '#9b59b6';
    let trailColor  = 'rgba(52,152,219,0.52)';

    document.addEventListener('mousemove', e => {
        tx = e.clientX; ty = e.clientY;
    }, { passive: true });

    document.addEventListener('mousedown', () => cursorScale = 0.6);
    document.addEventListener('mouseup',   () => cursorScale = 1);

    // Grow on hoverable elements
    document.querySelectorAll('a,button,.glow-card,.project-card,.tech-icon-card').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorScale = 2;
            cursorColor = '#3498db';
            trailColor  = 'rgba(52,152,219,0.62)';
        });
        el.addEventListener('mouseleave', () => {
            cursorScale = 1;
            cursorColor = '#9b59b6';
            trailColor  = 'rgba(52,152,219,0.52)';
        });
    });

    function renderCursor() {
        px += (tx - px) * 0.25;
        py += (ty - py) * 0.25;
        dot.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%) scale(${cursorScale})`;
        trail.style.transform = `translate(${px}px, ${py}px) translate(-50%, -50%)`;
        dot.style.background = cursorColor;
        trail.style.borderColor = trailColor;
        requestAnimationFrame(renderCursor);
    }
    renderCursor();
})();


/* ══════════════════════════════════════
   SCROLL PROGRESS BAR
══════════════════════════════════════ */
(function setupProgress() {
    const bar = document.getElementById('progress-bar');
    if (!bar) return;
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
            const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            bar.style.width = pct + '%';
            ticking = false;
        });
    }, { passive: true });
})();


/* ══════════════════════════════════════
   PARTICLE CANVAS
══════════════════════════════════════ */
(function setupParticles() {
    return;
    const canvas = document.getElementById('particle-canvas');
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isSlowCPU = navigator.hardwareConcurrency && window.navigator.hardwareConcurrency < 6;
    const isSmall = window.innerWidth < 900;
    if (!canvas || isReduced || isSlowCPU || isSmall) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const COLORS = ['rgba(52,152,219,', 'rgba(155,89,182,', 'rgba(46,204,113,'];
    const COUNT  = 28;

    const particles = Array.from({ length: COUNT }, () => ({
        x:  Math.random() * window.innerWidth,
        y:  Math.random() * window.innerHeight,
        r:  Math.random() * 1.8 + 0.6,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        col: COLORS[Math.floor(Math.random() * COLORS.length)],
        op: Math.random() * 0.35 + 0.18,
    }));

    function drawLine(a, b, alpha) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(52,152,219,${alpha * 0.85})`;
        ctx.lineWidth   = 0.65;
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
    }

    function tick() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const W = canvas.width, H = canvas.height;
        const MAX = 100;
        const MAX_SQ = MAX * MAX;

        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.col + p.op + ')';
            ctx.fill();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distSq = dx * dx + dy * dy;
                if (distSq < MAX_SQ) {
                    const alpha = (1 - distSq / MAX_SQ) * 0.24;
                    drawLine(particles[i], particles[j], alpha);
                }
            }
        }

        requestAnimationFrame(tick);
    }
    tick();
})();


/* ══════════════════════════════════════
   THREE.JS HERO ANIMATION
══════════════════════════════════════ */
function setupHero3D() {
    const canvas = document.getElementById('hero-3d');
    const heroSection = document.getElementById('home');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!canvas || !window.THREE || prefersReduced || !heroSection) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08101b, 0.018);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 4.5, 9.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setClearColor(0x08101b, 0);

    const ambient = new THREE.AmbientLight(0x9cc7e8, 0.32);
    scene.add(ambient);
    const keyLight = new THREE.DirectionalLight(0xdfefff, 0.75);
    keyLight.position.set(5.5, 7.5, 3);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0x2edc98, 0.24);
    fillLight.position.set(-4.5, 2.8, -4.5);
    scene.add(fillLight);

    const group = new THREE.Group();
    scene.add(group);

    const colors = [0x3498db, 0x9b59b6, 0x2ecc71];
    const positions = [
        { x: -2.4, y: 0.12, z: -0.45 },
        { x: 0.1,  y: 0.18, z: 0.05 },
        { x: 2.2,  y: 0.07, z: -0.45 },
    ];
    const geometry = new THREE.IcosahedronGeometry(1.08, 0);

    positions.forEach((pos, idx) => {
        const color = colors[idx];
        const material = new THREE.MeshStandardMaterial({
            color,
            emissive: color,
            emissiveIntensity: 0.24,
            metalness: 0.1,
            roughness: 0.4,
            flatShading: true,
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(pos.x, pos.y, pos.z);
        mesh.scale.setScalar(1 - idx * 0.05);
        mesh.userData = { baseY: pos.y, speed: 0.9 + idx * 0.14 };
        group.add(mesh);

        const glow = new THREE.PointLight(color, 0.35, 7, 2);
        glow.position.set(pos.x, pos.y + 1.1, pos.z);
        scene.add(glow);
    });

    const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.8, 0.05, 12, 80),
        new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.08, transparent: true })
    );
    ring.rotation.x = Math.PI * 0.4;
    group.add(ring);

    const outerRing = new THREE.Mesh(
        new THREE.TorusGeometry(4.1, 0.025, 10, 120),
        new THREE.MeshBasicMaterial({ color: 0x1abc9c, opacity: 0.13, transparent: true })
    );
    outerRing.rotation.x = Math.PI * 0.62;
    outerRing.rotation.y = Math.PI * 0.18;
    group.add(outerRing);

    const starGeometry = new THREE.BufferGeometry();
    const starCount = 180;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 18;
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 12 - 3;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
        starGeometry,
        new THREE.PointsMaterial({
            color: 0x8bd8ff,
            size: 0.035,
            transparent: true,
            opacity: 0.52,
            blending: THREE.AdditiveBlending,
        })
    );
    scene.add(stars);

    const mouse = { x: 0, y: 0 };
    let visible = true;

    window.addEventListener('mousemove', e => {
        mouse.x = (e.clientX / window.innerWidth - 0.5) * 0.95;
        mouse.y = (e.clientY / window.innerHeight - 0.5) * 0.35;
    }, { passive: true });

    function resize() {
        const width = canvas.clientWidth || window.innerWidth;
        const height = canvas.clientHeight || window.innerHeight;
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const obs = new IntersectionObserver(entries => {
        visible = entries.some(entry => entry.isIntersecting);
        if (visible) requestAnimationFrame(animate);
    }, { threshold: 0.05 });
    obs.observe(heroSection);
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; if (visible) requestAnimationFrame(animate); });

    function animate(time) {
        if (!visible) return;
        const t = time * 0.001;
        group.rotation.y = t * 0.14;
        stars.rotation.y = t * 0.025;
        stars.rotation.x = Math.sin(t * 0.18) * 0.035;
        outerRing.rotation.z = t * 0.12;
        ring.rotation.z = -t * 0.18;
        group.rotation.x += (mouse.y * 0.06 - group.rotation.x) * 0.05;
        group.position.x += (mouse.x * 0.7 - group.position.x) * 0.05;
        group.position.y = Math.sin(t * 0.32) * 0.08;

        group.children.forEach(child => {
            if (!child.userData || !child.userData.speed) return;
            const wave = Math.sin(t * child.userData.speed) * 0.22;
            child.rotation.x = wave * 0.22;
            child.rotation.y = Math.cos(t * child.userData.speed * 0.85) * 0.18;
            child.position.y = child.userData.baseY + Math.sin(t * child.userData.speed) * 0.06;
            if (child.material && child.material.emissive) {
                child.material.emissiveIntensity = 0.24 + Math.max(0, wave) * 0.38;
            }
        });

        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}


/* ══════════════════════════════════════
   TYPING ANIMATION
══════════════════════════════════════ */
(function setupTyping() {
    const el = document.getElementById('typed-text');
    if (!el) return;

    const phrases = [
        'Software Engineer',
        'Backend & IoT Developer',
        'Python · Elixir Engineer',
        'DSA Problem Solver',
        'Cloud & DevOps Enthusiast',
        'AI Automation Builder',
    ];

    let pi = 0, ci = 0, del = false;

    function tick() {
        const cur = phrases[pi];
        if (!del) {
            el.textContent = cur.slice(0, ++ci);
            if (ci === cur.length) { del = true; setTimeout(tick, 1800); return; }
        } else {
            el.textContent = cur.slice(0, --ci);
            if (ci === 0) { del = false; pi = (pi + 1) % phrases.length; }
        }
        setTimeout(tick, del ? 48 : 82);
    }
    tick();
})();


/* ══════════════════════════════════════
   SKILL CIRCLES
══════════════════════════════════════ */
const SKILLS = [
    { name: 'Python',     pct: 90, color: '#3498db', glow: '#3498db' },
    { name: 'Elixir',     pct: 80, color: '#9b59b6', glow: '#9b59b6' },
    { name: 'JavaScript', pct: 83, color: '#1abc9c', glow: '#1abc9c' },
    { name: 'AWS',        pct: 78, color: '#2ecc71', glow: '#2ecc71' },
    { name: 'Docker',     pct: 82, color: '#3498db', glow: '#3498db' },
    { name: 'DSA',        pct: 75, color: '#9b59b6', glow: '#9b59b6' },
];

function buildSkills() {
    const grid = document.getElementById('skills-grid');
    if (!grid) return;

    SKILLS.forEach(({ name, pct, color, glow }, i) => {
        const offset = +(283 * (1 - pct / 100)).toFixed(1);
        const div = document.createElement('div');
        div.className = 'flex flex-col items-center reveal';
        div.style.transitionDelay = `${i * 0.09}s`;
        div.dataset.skillOffset   = offset;
        div.dataset.ringIdx       = i;
        div.innerHTML = `
        <div style="position:relative;width:82px;height:82px;">
            <svg width="82" height="82" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="rgba(255,255,255,0.06)" stroke-width="8" fill="none"/>
                <circle cx="50" cy="50" r="45" stroke="${color}" stroke-width="8" fill="none"
                    stroke-dasharray="283" stroke-dashoffset="283"
                    stroke-linecap="round"
                    class="skill-ring" id="ring-${i}"
                    style="filter:drop-shadow(0 0 5px ${glow});"/>
            </svg>
            <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:0.9rem;font-weight:700;color:#e2e8f0;font-family:'Fira Code',monospace;">${pct}%</span>
        </div>
        <span style="margin-top:8px;font-size:0.7rem;font-weight:600;color:#64748b;">${name}</span>`;
        grid.appendChild(div);
    });
}


/* ══════════════════════════════════════
   INTERSECTION OBSERVER — reveal + rings + counters
══════════════════════════════════════ */
function setupObservers() {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            e.target.classList.add('visible');

            // Skill ring
            const off = e.target.dataset.skillOffset;
            const idx = e.target.dataset.ringIdx;
            if (off !== undefined && idx !== undefined) {
                setTimeout(() => {
                    const ring = document.getElementById(`ring-${idx}`);
                    if (ring) ring.style.strokeDashoffset = off;
                }, 150);
            }

            // Counters
            e.target.querySelectorAll('[data-count]').forEach(animateCounter);

            obs.unobserve(e.target);
        });
    }, { threshold: 0.18 });

    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function animateCounter(el) {
    const target = +el.dataset.count;
    const suffix = el.dataset.suffix || '';
    const dur    = 1600;
    const start  = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / dur, 1);
        const ease     = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}


/* ══════════════════════════════════════
   3D CARD TILT
══════════════════════════════════════ */
function setupTilt() {
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const { left, top, width, height } = card.getBoundingClientRect();
            const x = (e.clientX - left - width  / 2) / (width  / 2);
            const y = (e.clientY - top  - height / 2) / (height / 2);
            card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateZ(4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
            card.style.transition = 'transform 0.5s ease';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
        });
    });
}


/* ══════════════════════════════════════
   DSA ALGORITHM DEMO
══════════════════════════════════════ */


/* ══════════════════════════════════════
   ACTIVE NAV
══════════════════════════════════════ */
function setupActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const links    = document.querySelectorAll('nav a.nav-link');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            links.forEach(l => l.classList.remove('active'));
            const m = [...links].find(l => l.getAttribute('href') === `#${e.target.id}`);
            if (m) m.classList.add('active');
        });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => obs.observe(s));
}


/* ══════════════════════════════════════
   HAMBURGER
══════════════════════════════════════ */
function setupHamburger() {
    const btn  = document.getElementById('hamburger');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;

    const [h1, h2, h3] = ['hb1','hb2','hb3'].map(id => document.getElementById(id));

    btn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        if (h1) h1.style.transform = open ? 'translateY(8px) rotate(45deg)' : '';
        if (h2) h2.style.opacity   = open ? '0' : '1';
        if (h3) h3.style.transform = open ? 'translateY(-8px) rotate(-45deg)' : '';
    });

    menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        menu.classList.remove('open');
        if (h1) h1.style.transform = '';
        if (h2) h2.style.opacity   = '1';
        if (h3) h3.style.transform = '';
    }));
}


/* ══════════════════════════════════════
   BACK TO TOP
══════════════════════════════════════ */
function setupBackTop() {
    const btn = document.getElementById('back-top');
    if (!btn) return;
    let backTopTick = false;
    window.addEventListener('scroll', () => {
        if (backTopTick) return;
        backTopTick = true;
        window.requestAnimationFrame(() => {
            btn.classList.toggle('show', window.scrollY > 400);
            backTopTick = false;
        });
    }, { passive: true });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}


/* ══════════════════════════════════════
   CONTACT FORM  (powered by Formsubmit.co)
   No account or API key needed.
   First submission → verification email arrives
   in sanjaykumarr99009@gmail.com → click Activate
   → every future submission lands in Gmail.
══════════════════════════════════════ */
function setupContactForm() {
    const form      = document.getElementById('contact-form');
    const status    = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');
    const btnText   = document.getElementById('btn-text');
    const spinner   = document.getElementById('btn-spinner');
    if (!form || !status) return;

    const ENDPOINT = 'https://formsubmit.co/ajax/sanjaykumarr99009@gmail.com';

    form.addEventListener('submit', async e => {
        e.preventDefault();

        const name    = document.getElementById('f-name').value.trim();
        const email   = document.getElementById('f-email').value.trim();
        const subject = document.getElementById('f-subject').value.trim();
        const message = document.getElementById('f-message').value.trim();

        if (!name || !email || !message) {
            showStatus('// please fill in all required fields (*)', 'error'); return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            showStatus('// invalid email address', 'error'); return;
        }

        setLoading(true);

        let sent = false;

        // Try Formsubmit (works when site is hosted / activated)
        try {
            const res = await fetch(ENDPOINT, {
                method:  'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    message,
                    _replyto:  email,
                    _subject:  `Portfolio — ${subject || 'New message from ' + name}`,
                    _captcha:  'false',
                    _template: 'table',
                }),
            });
            const data = await res.json();
            if (data.success === 'true' || data.success === true) sent = true;
        } catch (_) {
            // Network / CORS — fall through to mailto
        }

        if (sent) {
            showStatus("// message sent! I'll get back to you soon ✓", 'success');
            form.reset();
        } else {
            // Guaranteed fallback — open email client with form pre-filled
            const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
            const mailto = `mailto:sanjaykumarr99009@gmail.com`
                + `?subject=${encodeURIComponent('Portfolio: ' + (subject || 'New message from ' + name))}`
                + `&body=${encodeURIComponent(body)}`;
            window.open(mailto, '_blank');
            showStatus('// your email client opened with the message pre-filled — just hit Send ✓', 'success');
            form.reset();
        }

        setLoading(false);
    });

    function setLoading(on) {
        submitBtn.disabled      = on;
        btnText.textContent     = on ? 'Sending...' : 'Send Message ✉';
        spinner.classList.toggle('hidden', !on);
        submitBtn.style.opacity = on ? '0.7' : '1';
    }

    function showStatus(msg, type) {
        const map = {
            success: { color: '#6ee7b7', border: 'rgba(16,185,129,0.3)',  bg: 'rgba(16,185,129,0.08)' },
            error:   { color: '#fca5a5', border: 'rgba(239,68,68,0.3)',   bg: 'rgba(239,68,68,0.08)'  },
        };
        const s = map[type] || map.error;
        status.textContent       = msg;
        status.style.color       = s.color;
        status.style.borderColor = s.border;
        status.style.background  = s.bg;
        status.classList.remove('hidden');
        setTimeout(() => status.classList.add('hidden'), 6000);
    }
}


/* ══════════════════════════════════════
   INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
    setupHero3D();
    buildSkills();
    setupObservers();
    setupActiveNav();
    setupHamburger();
    setupBackTop();
    setupContactForm();
    setupTilt();
});
