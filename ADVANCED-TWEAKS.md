# 3D Background — Advanced Tweaks & Optimization

## 🎨 Shader Customizations

### Motion Control

**Current shader motion combines three techniques:**

1. **Noise-based flowing motion**
   ```glsl
   float n1 = noise(noisePos);
   pos += sin(time * 0.5 + phase) * n1 * 8.0;
   ```
   - `time * 0.5` → Controls animation speed
   - `* 8.0` → Controls amplitude (motion range)
   - Increase either value for more dramatic motion

2. **Sinusoidal wave motion**
   ```glsl
   float n2 = noise(noisePos + vec3(10.0));
   pos += cos(time * 0.3 + phase) * n2 * 6.0;
   ```
   - `time * 0.3` → Wave frequency
   - `* 6.0` → Wave amplitude
   - Lower time coefficient = slower, larger amplitude = more pronounced

3. **Orbital motion**
   ```glsl
   float angle = atan(pos.y, pos.x) + time * 0.1;
   float radius = length(pos.xy);
   pos.x = cos(angle) * radius;
   pos.y = sin(angle) * radius;
   ```
   - `time * 0.1` → Rotation speed
   - Increase for faster rotation, decrease for subtle effect

---

## 🌀 Create Different Animation Styles

### Hypnotic Spiral Pattern
```javascript
// Replace orbital motion section in vertex shader with:
float angle = atan(pos.y, pos.x) + time * 0.3;  // 3x faster
float radius = length(pos.xy) * (1.0 + sin(time * 0.5) * 0.2);  // Pulsing radius
pos.x = cos(angle) * radius;
pos.y = sin(angle) * radius;
```

### Explosive Energy Burst
```javascript
// Replace noise motion with:
float n1 = noise(noisePos);
float explosion = 1.0 + sin(time * 2.0) * 0.5;  // Pulsing
pos += normalize(pos) * explosion * n1 * 15.0;  // Outward motion
```

### Calm Floating Clouds
```javascript
// Reduce all time multipliers by half
pos += sin(time * 0.25 + phase) * n1 * 4.0;  // Slower, subtle
pos += cos(time * 0.15 + phase) * n2 * 3.0;
// Remove orbital motion entirely
```

### Chaotic Storm
```javascript
// Increase all parameters
pos += sin(time * 1.5 + phase) * n1 * 20.0;
pos += cos(time * 0.9 + phase) * n2 * 15.0;
float angle = atan(pos.y, pos.x) + time * 0.5;  // Fast rotation
float radius = length(pos.xy) * (1.0 + sin(time * 2.0) * 0.5);
pos.x = cos(angle) * radius * 1.2;
pos.y = sin(angle) * radius * 1.2;
```

---

## 🎯 Mouse Interaction Tweaks

### Stronger Pull Effect
```glsl
// Original:
if (dist < 50.0) {
    float influence = (1.0 - dist / 50.0) * mouseInfluence;
    pos += normalize(toMouse) * influence * 15.0;
}

// Stronger:
if (dist < 75.0) {  // Larger radius
    float influence = (1.0 - dist / 75.0) * mouseInfluence * 1.5;  // Stronger
    pos += normalize(toMouse) * influence * 25.0;  // More movement
}
```

### Repulsion Effect (Particles Push Away from Cursor)
```glsl
if (dist < 50.0) {
    float influence = (1.0 - dist / 50.0) * mouseInfluence;
    pos -= normalize(toMouse) * influence * 15.0;  // Minus instead of plus
}
```

### Swirl Around Cursor
```glsl
if (dist < 80.0) {
    vec2 perpendicular = vec2(-toMouse.y, toMouse.x);
    float influence = (1.0 - dist / 80.0) * 0.8;
    pos += normalize(perpendicular) * influence * 20.0;
}
```

---

## 🌈 Advanced Color Effects

### Rainbow Gradient Based on Position
```javascript
// In createParticleSystem, replace colorPalette assignment with:
let hue = (positions[i*3] + positions[i*3+1] + positions[i*3+2]) * 0.01;
const color = new THREE.Color().setHSL(hue % 1.0, 0.7, 0.5);
colors[i * 3] = color.r;
colors[i * 3 + 1] = color.g;
colors[i * 3 + 2] = color.b;
```

### Time-Based Color Cycling
```glsl
// In fragment shader:
varying vec3 vColor;
// Modify vColor based on time:
vec3 cycledColor = mix(vColor, vec3(1.0), sin(time * 0.5) * 0.5 + 0.5);
gl_FragColor = vec4(cycledColor, alpha * vAlpha);
```

### Gradient by Depth
```javascript
// In createParticleSystem, color based on Z position:
const color = colorPalette[Math.floor((positions[i*3+2] + 60) / 120 * colorPalette.length)];
```

---

## ✨ Glow & Bloom Effects

### Ultra Aggressive Bloom
```glsl
// In fragment shader, replace glow calculation with:
float glow = exp(-dist * dist * 16.0) * 1.0;  // More intense
alpha += glow * 1.5;  // Stronger bloom
```

### Subtle, Realistic Glow
```glsl
float glow = exp(-dist * dist * 4.0) * 0.3;  // Subtle
float softEdge = smoothstep(0.5, 0.3, dist);
alpha = mix(alpha, alpha + glow, 0.4);
```

### Pulsing Glow
```glsl
float glow = exp(-dist * dist * 8.0) * (0.5 + sin(time) * 0.5);
// Glow intensity changes over time
```

---

## 🎬 Advanced Animation Patterns

### Elastic Wave Propagation
```glsl
float wave = sin(time - length(pos) * 0.1) * 0.5 + 0.5;
pos += normalize(pos) * wave * 5.0;
```

### Vortex / Whirlpool
```glsl
float angle = atan(pos.y, pos.x);
float radius = length(pos.xy);
float twist = angle + time * 0.3 + radius * 0.05;
pos.x = cos(twist) * radius;
pos.y = sin(twist) * radius;
```

### Breathing / Pulsating Effect
```glsl
float breathe = 1.0 + sin(time * 0.5) * 0.3;
pos *= breathe;
```

### Gravitational Pull to Center
```glsl
vec3 toCenter = -pos;
pos += normalize(toCenter) * length(toCenter) * 0.01;
```

---

## ⚡ Performance Optimizations

### Reduce Shader Complexity
If experiencing FPS drops, simplify the vertex shader:

**Before (Complex):**
```glsl
float n1 = noise(noisePos);
float n2 = noise(noisePos + vec3(10.0));
float n3 = noise(noisePos + vec3(20.0));
pos += sin(time * 0.5 + phase) * n1 * 8.0;
pos += cos(time * 0.3 + phase) * n2 * 6.0;
pos.z += sin(time * 0.4 + phase) * n3 * 5.0;
```

**After (Optimized):**
```glsl
float n1 = noise(noisePos);
pos += sin(time * 0.5 + phase) * n1 * 8.0;
pos.z += cos(time * 0.3 + phase) * n1 * 5.0;  // Reuse n1
```

### Remove Orbital Motion for More FPS
In the vertex shader, comment out:
```glsl
/*
float angle = atan(pos.y, pos.x) + time * 0.1;
float radius = length(pos.xy);
pos.x = cos(angle) * radius;
pos.y = sin(angle) * radius;
*/
```

### Lower Quality Fragments
In fragment shader, use fewer glow calculations:
```glsl
float alpha = 1.0 - smoothstep(0.3, 0.5, dist);
// Remove second glow calculation for faster rendering
gl_FragColor = vec4(finalColor, alpha * vAlpha);
```

---

## 🔧 Camera & View Tweaks

### Zoom In/Out
```javascript
// In init() method:
this.camera.position.z = 30;  // Zoom in (was 50)
// or
this.camera.position.z = 100; // Zoom out (was 50)
```

### Change Field of View
```javascript
this.camera = new THREE.PerspectiveCamera(
    120,  // Wider FOV (was 75)
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
```

### Change Fog Distance
```javascript
this.scene.fog = new THREE.Fog(
    0x050816,
    200,  // Closer fog (was 150)
    400   // Further far plane (was 300)
);
```

---

## 🎨 Lighting Configurations

### Bright, Vibrant Look
```javascript
// Increase all light intensities
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);  // Was 0.4
const directionalLight = new THREE.DirectionalLight(0x00d4ff, 0.5);  // Was 0.3
```

### Dark, Moody Look
```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);  // Was 0.4
const directionalLight = new THREE.DirectionalLight(0x00d4ff, 0.1);  // Was 0.3
```

### Monochromatic Blue Lighting
```javascript
const ambientLight = new THREE.AmbientLight(0x0066ff, 0.3);
const directionalLight = new THREE.DirectionalLight(0x0066ff, 0.4);
const pointLight1 = new THREE.PointLight(0x0066ff, 0.6);
const pointLight2 = new THREE.PointLight(0x0033ff, 0.4);
```

---

## 📊 Testing Your Modifications

### Monitor Performance
```javascript
// In browser console:
setInterval(() => {
    console.log('FPS:', window.bg3d.fps);
    console.log('Time:', window.bg3d.time);
}, 1000);
```

### Check Memory Usage
```javascript
// In Chrome DevTools:
Performance → Start → Move mouse → Stop → Analyze
```

### Visual Debugging
```javascript
// Make particles solid for easier debugging:
// In fragment shader, replace with:
gl_FragColor = vec4(vColor, 1.0);  // Solid colors, no glow
```

---

## 🚀 Performance Targets

| Metric | Target | Good | Excellent |
|--------|--------|------|-----------|
| FPS (Desktop) | 50 | 55+ | 60 |
| FPS (Mobile) | 30 | 35+ | 40+ |
| Memory (Desktop) | <50MB | <40MB | <30MB |
| Memory (Mobile) | <20MB | <15MB | <10MB |
| Load Time | <200ms | <100ms | <50ms |

---

## 💡 Pro Tips

1. **Start with small changes** — Modify one parameter and observe
2. **Use Chrome DevTools** to profile performance before/after
3. **Test on real devices** — Emulation doesn't always match real performance
4. **Keep backups** — Save working versions before major changes
5. **Mobile first** — Optimize for mobile, it will be perfect on desktop

---

## 🔗 Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [GLSL Shader Language](https://learnopengl.com/Getting-started/Shaders)
- [WebGL Performance](https://www.khronos.org/webgl/resources/)
- [The Book of Shaders](https://thebookofshaders.com/)

---

**Happy customizing! 🎨**
