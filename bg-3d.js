/* ══════════════════════════════════════════════════════════════════════════════
   PREMIUM 3D ANIMATED BACKGROUND - Three.js Fluid Particle System
   ══════════════════════════════════════════════════════════════════════════════ */

class PremiumBackground3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.particles = null;
        this.particleCount = 0;
        this.mouse = { x: 0, y: 0, vx: 0, vy: 0 };
        this.time = 0;
        this.deltaTime = 0;
        this.lastTime = Date.now();
        this.container = null;
        this.isInitialized = false;
        this.quality = this.detectQuality();
        this.frameCount = 0;
        this.fps = 0;
        this.lastFpsTime = Date.now();
    }

    /* ── Detect device performance capabilities ── */
    detectQuality() {
        const ua = navigator.userAgent;
        const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile|mobile/.test(ua);
        
        if (isMobile) return 'low';
        
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (!gl) return 'low';
        
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
        
        const isHighEnd = renderer.includes('RTX') || renderer.includes('3070') || 
                         renderer.includes('3080') || renderer.includes('4090') ||
                         renderer.includes('AMD Radeon') || renderer.includes('M1') || 
                         renderer.includes('M2') || renderer.includes('M3');
        
        return isHighEnd ? 'high' : 'medium';
    }

    /* ── Initialize Three.js scene ── */
    init() {
        if (this.isInitialized) return;

        if (!window.THREE) {
            console.error('3D Background: Three.js is not loaded');
            return;
        }

        this.container = document.getElementById('bg-canvas-container') || document.querySelector('.hero-stage');
        if (!this.container) {
            console.error('3D Background: Container not found');
            return;
        }

        const { width, height } = this.getContainerSize();

        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050816);
        this.scene.fog = new THREE.Fog(0x050816, 150, 300);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            width / height,
            0.1,
            1000
        );
        this.camera.position.z = 50;

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            precision: 'highp',
            powerPreference: this.quality === 'high' ? 'high-performance' : 'default',
            stencil: false,
            depth: true
        });

        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(this.quality === 'high' ? window.devicePixelRatio : 1);
        if ('outputColorSpace' in this.renderer && THREE.SRGBColorSpace) {
            this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        } else if ('outputEncoding' in this.renderer && THREE.sRGBEncoding) {
            this.renderer.outputEncoding = THREE.sRGBEncoding;
        }
        if (THREE.ACESFilmicToneMapping) this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.setClearColor(0x050816, 0);
        this.container.appendChild(this.renderer.domElement);

        // Create particles
        this.createParticleSystem();

        // Add lighting
        this.setupLighting();

        // Event listeners
        this.setupEventListeners();

        // Start animation loop
        this.animate();
        this.isInitialized = true;
    }

    getContainerSize() {
        const width = this.container.clientWidth || window.innerWidth || 1;
        const height = this.container.clientHeight || window.innerHeight || 1;

        return { width, height };
    }

    /* ── Create particle system ── */
    createParticleSystem() {
        const qualityMap = {
            high: 4000,
            medium: 2500,
            low: 1200
        };

        this.particleCount = qualityMap[this.quality];

        const geometry = new THREE.BufferGeometry();

        // Particle positions
        const positions = new Float32Array(this.particleCount * 3);
        const velocities = new Float32Array(this.particleCount * 3);
        const sizes = new Float32Array(this.particleCount);
        const colors = new Float32Array(this.particleCount * 3);
        const lifetimes = new Float32Array(this.particleCount);
        const phases = new Float32Array(this.particleCount);

        const colorPalette = [
            { r: 0.0, g: 0.83, b: 1.0 },   // Electric Cyan #00D4FF
            { r: 0.55, g: 0.36, b: 0.96 }, // Neon Purple #8B5CF6
            { r: 0.03, g: 0.71, b: 0.83 }, // Cyan #06B6D4
            { r: 0.98, g: 0.98, b: 0.99 }  // Soft White #F8FAFC
        ];

        for (let i = 0; i < this.particleCount; i++) {
            // Random positions in a sphere
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 2;
            const r = Math.random() * 60 + 20;

            positions[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
            positions[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
            positions[i * 3 + 2] = Math.cos(phi) * r;

            // Velocities
            velocities[i * 3] = (Math.random() - 0.5) * 0.4;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

            // Sizes
            sizes[i] = Math.random() * 0.5 + 0.1;

            // Colors
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Lifetimes and phases
            lifetimes[i] = Math.random() * 1.0 + 0.5;
            phases[i] = Math.random() * Math.PI * 2;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('lifetime', new THREE.BufferAttribute(lifetimes, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));

        // Custom shader material
        const material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mousePos: { value: new THREE.Vector3() },
                mouseInfluence: { value: 0.8 },
                textureSize: { value: 256.0 }
            },
            vertexShader: this.getVertexShader(),
            fragmentShader: this.getFragmentShader(),
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            transparent: true,
            sizeAttenuation: true
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    /* ── Vertex shader with fluid motion ── */
    getVertexShader() {
        return `
            attribute vec3 velocity;
            attribute float size;
            attribute float lifetime;
            attribute float phase;

            uniform float time;
            uniform vec3 mousePos;
            uniform float mouseInfluence;

            varying float vAlpha;
            varying vec3 vColor;

            // Perlin-like noise function
            float noise(vec3 p) {
                vec3 i = floor(p);
                vec3 f = fract(p);
                f = f * f * (3.0 - 2.0 * f);

                float n = i.x + i.y * 57.0 + i.z * 113.0;
                float a = sin(n * 12.9898) * 43758.5453;
                float b = sin((n + 1.0) * 12.9898) * 43758.5453;
                float c = sin((n + 57.0) * 12.9898) * 43758.5453;
                float d = sin((n + 58.0) * 12.9898) * 43758.5453;

                float res = mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
                return fract(res);
            }

            void main() {
                vec3 pos = position;

                // Fluid motion using noise
                vec3 noisePos = pos * 0.1 + vec3(time * 0.3);
                float n1 = noise(noisePos);
                float n2 = noise(noisePos + vec3(10.0));
                float n3 = noise(noisePos + vec3(20.0));

                // Apply sinusoidal motion
                pos += sin(time * 0.5 + phase) * n1 * 8.0;
                pos += cos(time * 0.3 + phase) * n2 * 6.0;
                pos.z += sin(time * 0.4 + phase) * n3 * 5.0;

                // Mouse interaction
                vec3 toMouse = mousePos - pos;
                float dist = length(toMouse);
                if (dist < 50.0) {
                    float influence = (1.0 - dist / 50.0) * mouseInfluence;
                    pos += normalize(toMouse) * influence * 15.0;
                }

                // Orbital motion
                float angle = atan(pos.y, pos.x) + time * 0.1;
                float radius = length(pos.xy);
                pos.x = cos(angle) * radius;
                pos.y = sin(angle) * radius;

                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;

                // Point size with depth fade
                float sizeAttenuation = size * 80.0 / -mvPosition.z;
                gl_PointSize = clamp(sizeAttenuation, 0.5, 8.0);

                // Alpha with fade in/out
                vAlpha = sin(time * 1.5 + phase) * 0.3 + 0.5;
                vAlpha *= (1.0 - mod(time + phase, lifetime) / lifetime);
                vAlpha = clamp(vAlpha, 0.1, 1.0);

                vColor = color;
            }
        `;
    }

    /* ── Fragment shader with glow ── */
    getFragmentShader() {
        return `
            varying float vAlpha;
            varying vec3 vColor;

            void main() {
                // Circular particle shape
                vec2 uv = gl_PointCoord - 0.5;
                float dist = length(uv);

                // Soft circle with glow
                float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
                
                // Add glow effect
                float glow = exp(-dist * dist * 8.0) * 0.6;
                alpha += glow;

                // Final color with bloom
                vec3 finalColor = vColor * (1.0 + glow * 2.0);
                gl_FragColor = vec4(finalColor, alpha * vAlpha);
            }
        `;
    }

    /* ── Setup lighting ── */
    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        // Directional light for depth
        const directionalLight = new THREE.DirectionalLight(0x00d4ff, 0.3);
        directionalLight.position.set(50, 50, 50);
        this.scene.add(directionalLight);

        // Point lights for color
        const pointLight1 = new THREE.PointLight(0x00d4ff, 0.5, 200);
        pointLight1.position.set(100, 50, 50);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x8b5cf6, 0.3, 150);
        pointLight2.position.set(-80, -50, 40);
        this.scene.add(pointLight2);
    }

    /* ── Setup event listeners ── */
    setupEventListeners() {
        window.addEventListener('mousemove', (e) => this.onMouseMove(e), { passive: true });
        window.addEventListener('resize', () => this.onWindowResize(), { passive: true });
        window.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: true });
    }

    /* ── Mouse move handler ── */
    onMouseMove(e) {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

        // Convert to world coordinates
        const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
        vector.unproject(this.camera);
        const dir = vector.sub(this.camera.position).normalize();
        const distance = -this.camera.position.z / dir.z;
        const mousePos = this.camera.position.clone().add(dir.multiplyScalar(distance));

        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.mousePos.value = mousePos;
        }
    }

    /* ── Touch move handler ── */
    onTouchMove(e) {
        if (e.touches.length > 0) {
            this.onMouseMove({
                clientX: e.touches[0].clientX,
                clientY: e.touches[0].clientY
            });
        }
    }

    /* ── Window resize handler ── */
    onWindowResize() {
        const { width, height } = this.getContainerSize();

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /* ── Animation loop ── */
    animate = () => {
        requestAnimationFrame(this.animate);

        // Calculate delta time
        const now = Date.now();
        this.deltaTime = (now - this.lastTime) / 1000;
        this.lastTime = now;
        this.time += this.deltaTime;

        // Update particle system
        if (this.particles && this.particles.material.uniforms) {
            this.particles.material.uniforms.time.value = this.time;
        }

        // Render
        this.renderer.render(this.scene, this.camera);

        // FPS counter
        this.frameCount++;
        if (now - this.lastFpsTime >= 1000) {
            this.fps = this.frameCount;
            this.frameCount = 0;
            this.lastFpsTime = now;
        }
    };

    /* ── Cleanup ── */
    dispose() {
        if (this.particles && this.particles.geometry) {
            this.particles.geometry.dispose();
            this.particles.material.dispose();
        }
        if (this.renderer) {
            this.renderer.dispose();
        }
    }
}

/* ── Initialize on DOM ready ── */
(function() {
    function bootBackground(retries = 0) {
        if (!window.THREE) {
            if (retries < 40) {
                window.setTimeout(() => bootBackground(retries + 1), 100);
                return;
            }

            console.error('3D Background: Three.js failed to load');
            return;
        }

        window.bg3d = new PremiumBackground3D();
        window.bg3d.init();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => bootBackground());
    } else {
        bootBackground();
    }
})();
