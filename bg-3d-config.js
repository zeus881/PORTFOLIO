/* ══════════════════════════════════════════════════════════════════════════════
   3D BACKGROUND CONFIGURATION & CUSTOMIZATION
   ══════════════════════════════════════════════════════════════════════════════

   This file contains all customizable parameters for the Premium 3D Background.
   Modify these values to adjust the appearance and performance of the animation.

   HOW TO USE:
   1. Import this file in bg-3d.js (optional - currently hardcoded)
   2. Modify values below to customize your background
   3. Save and refresh your browser

══════════════════════════════════════════════════════════════════════════════ */

const BG3D_CONFIG = {
    /* ────────────────────────────────────────
       PARTICLE SETTINGS
       ──────────────────────────────────────── */
    particles: {
        // Quality-based particle counts
        counts: {
            high: 4000,      // High-end devices (RTX, M1/M2, etc.)
            medium: 2500,    // Standard desktop
            low: 1200        // Mobile & low-end
        },
        
        // Size of individual particles
        size: {
            min: 0.1,
            max: 0.5
        },
        
        // Velocity/movement speed
        velocity: {
            x: { min: -0.5, max: 0.5 },
            y: { min: -0.5, max: 0.5 },
            z: { min: -0.5, max: 0.5 }
        },
        
        // Lifetime and cycling
        lifetime: {
            min: 0.5,
            max: 1.5
        }
    },

    /* ────────────────────────────────────────
       COLOR PALETTE
       ──────────────────────────────────────── */
    colors: [
        { name: 'Electric Cyan', r: 0.0,  g: 0.83, b: 1.0  },   // #00D4FF
        { name: 'Neon Purple',   r: 0.55, g: 0.36, b: 0.96 },   // #8B5CF6
        { name: 'Cyan',          r: 0.03, g: 0.71, b: 0.83 },   // #06B6D4
        { name: 'Soft White',    r: 0.98, g: 0.98, b: 0.99 }    // #F8FAFC
    ],

    /* ────────────────────────────────────────
       SCENE & CAMERA
       ──────────────────────────────────────── */
    scene: {
        // Background color (Deep Black)
        background: 0x050816,
        
        // Fog settings for depth perception
        fog: {
            color: 0x050816,
            near: 150,
            far: 300
        },
        
        // Camera field of view
        camera: {
            fov: 75,
            near: 0.1,
            far: 1000,
            posZ: 50
        }
    },

    /* ────────────────────────────────────────
       LIGHTING
       ──────────────────────────────────────── */
    lighting: {
        // Ambient light (overall brightness)
        ambient: {
            color: 0xffffff,
            intensity: 0.4
        },
        
        // Directional light (main light source)
        directional: {
            color: 0x00d4ff,
            intensity: 0.3,
            position: [50, 50, 50]
        },
        
        // Point lights (colored accents)
        pointLights: [
            {
                color: 0x00d4ff,
                intensity: 0.5,
                distance: 200,
                position: [100, 50, 50]
            },
            {
                color: 0x8b5cf6,
                intensity: 0.3,
                distance: 150,
                position: [-80, -50, 40]
            }
        ]
    },

    /* ────────────────────────────────────────
       ANIMATION & MOTION
       ──────────────────────────────────────── */
    animation: {
        // Noise-based fluid motion
        noise: {
            scale: 0.1,        // How large the noise pattern is
            speed: 0.3,        // How fast noise evolves
            amplitude: [8, 6, 5] // X, Y, Z motion amplitude
        },
        
        // Sinusoidal wave motion
        waves: {
            speed: [0.5, 0.3, 0.4],  // X, Y, Z wave speeds
            scales: [0.5, 0.3, 0.4]  // Wave scales
        },
        
        // Orbital motion around center
        orbital: {
            enabled: true,
            speed: 0.1,  // Rotation speed
            radius: null // Auto-calculated from position
        }
    },

    /* ────────────────────────────────────────
       MOUSE INTERACTION
       ──────────────────────────────────────── */
    interaction: {
        // Mouse influence radius
        radius: 50,
        
        // Strength of mouse attraction/repulsion
        influence: 0.8,
        
        // Glow boost on mouse interaction
        glowBoost: 0.6
    },

    /* ────────────────────────────────────────
       SHADER & RENDERING
       ──────────────────────────────────────── */
    rendering: {
        // Blending mode for additive glow effect
        blending: 'additive',
        
        // Point size attenuation
        sizeAttenuation: true,
        pointSizeScale: 80,
        pointSizeMin: 0.5,
        pointSizeMax: 8,
        
        // Transparency
        transparent: true,
        depthWrite: false,
        
        // Glow/bloom effects
        glow: {
            intensity: 0.6,
            exponential: 8.0,
            falloff: 2.0
        },
        
        // Alpha/fade effects
        alpha: {
            minAlpha: 0.1,
            maxAlpha: 1.0,
            fadeSpeed: 1.5
        }
    },

    /* ────────────────────────────────────────
       PERFORMANCE OPTIMIZATION
       ──────────────────────────────────────── */
    performance: {
        // Target frame rate
        targetFps: 60,
        
        // Pixel ratio for different quality levels
        pixelRatio: {
            high: 'window.devicePixelRatio',
            medium: 1,
            low: 0.75
        },
        
        // Enable frustum culling
        frustumCulling: true,
        
        // Adaptive quality (reduce particles if FPS drops)
        adaptiveQuality: false,
        adaptiveThreshold: 50  // Min FPS before reducing quality
    }
};

/* ══════════════════════════════════════════════════════════════════════════════
   CUSTOMIZATION EXAMPLES
   ══════════════════════════════════════════════════════════════════════════════

   EXAMPLE 1: More aggressive glow effect
   ───────────────────────────────────────────────────────────────────────────
   Modify the glow settings in the rendering section:
   
   glow: {
       intensity: 1.0,        // Increased from 0.6
       exponential: 12.0,     // Increased from 8.0
       falloff: 3.0           // Increased from 2.0
   }

   EXAMPLE 2: Slower, more relaxed animation
   ───────────────────────────────────────────────────────────────────────────
   animation: {
       noise: {
           speed: 0.15,              // Halved from 0.3
       },
       waves: {
           speed: [0.25, 0.15, 0.2]  // All halved
       },
       orbital: {
           speed: 0.05               // Halved from 0.1
       }
   }

   EXAMPLE 3: Different color palette (warm sunset)
   ───────────────────────────────────────────────────────────────────────────
   colors: [
       { name: 'Orange',    r: 1.0,  g: 0.65, b: 0.0  },
       { name: 'Red',       r: 1.0,  g: 0.3,  b: 0.2  },
       { name: 'Yellow',    r: 1.0,  g: 0.85, b: 0.0 },
       { name: 'Gold',      r: 1.0,  g: 0.75, b: 0.3 }
   ]

   EXAMPLE 4: Stronger mouse interaction
   ───────────────────────────────────────────────────────────────────────────
   interaction: {
       radius: 100,      // Doubled from 50
       influence: 1.5,   // Increased from 0.8
       glowBoost: 1.0    // Increased from 0.6
   }

   EXAMPLE 5: Ultra high-end visual quality
   ───────────────────────────────────────────────────────────────────────────
   particles: {
       counts: {
           high: 8000,    // Doubled from 4000
           medium: 5000,  // Doubled from 2500
           low: 2500      // Doubled from 1200
       }
   }

   ───────────────────────────────────────────────────────────────────────────

   TO APPLY THESE MODIFICATIONS:
   
   1. Edit the BG3D_CONFIG object above with your desired values
   2. Pass the config to PremiumBackground3D in bg-3d.js:
      
      window.bg3d = new PremiumBackground3D(BG3D_CONFIG);
      window.bg3d.init();
   
   3. Or modify the hardcoded values directly in bg-3d.js within the class methods

══════════════════════════════════════════════════════════════════════════════ */

export { BG3D_CONFIG };
