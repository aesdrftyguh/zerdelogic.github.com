// Simple Canvas Confetti Effect
class ConfettiManager {
    constructor() {
        this.particles = [];
        this.canvas = null;
        this.ctx = null;
    }

    init() {
        // Create canvas if not exists
        if (!this.canvas) {
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'fixed';
            this.canvas.style.top = '0';
            this.canvas.style.left = '0';
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
            this.canvas.style.pointerEvents = 'none';
            this.canvas.style.zIndex = '9999';
            document.body.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
        }

        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    launch() {
        this.init();

        // Create 50 particles from top
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];

        for (let i = 0; i < 50; i++) {
            this.particles.push(this.createParticle(
                Math.random() * this.canvas.width,
                -20,
                colors[Math.floor(Math.random() * colors.length)]
            ));
        }

        this.animate();
    }

    // New: Burst from specific coordinates (e.g. from a button)
    burst(x, y) {
        this.init();
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#fd79a8'];
        for (let i = 0; i < 20; i++) {
            const p = this.createParticle(x, y, colors[Math.floor(Math.random() * colors.length)]);
            p.vx = (Math.random() - 0.5) * 15; // Explode outwards
            p.vy = (Math.random() - 0.5) * 15;
            this.particles.push(p);
        }
        this.animate();
    }

    createParticle(x, y, color) {
        return {
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6 - 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10,
            size: Math.random() * 8 + 4,
            color: color,
            gravity: 0.2,
            life: 1
        };
    }

    animate() {
        if (this.particles.length === 0) {
            if (this.ctx) this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.animating = false;
            return;
        }

        this.animating = true;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];

            // Update
            p.vy += p.gravity;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.life -= 0.02; // Fade faster for bursts

            // Draw
            this.ctx.save();
            this.ctx.translate(p.x, p.y);
            this.ctx.rotate((p.rotation * Math.PI) / 180);
            this.ctx.globalAlpha = Math.max(0, p.life);
            this.ctx.fillStyle = p.color;

            // Randomly draw stars or squares
            if (i % 2 === 0) {
                this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            } else {
                this.drawStar(0, 0, 5, p.size, p.size / 2);
            }
            this.ctx.restore();

            // Remove dead particles
            if (p.y > this.canvas.height || p.life <= 0) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            this.ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            this.ctx.lineTo(x, y);
            rot += step;
        }
        this.ctx.lineTo(cx, cy - outerRadius);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

// Global instance
const Confetti = new ConfettiManager();
