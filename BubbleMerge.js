class BubbleMergeTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { target: 10, bubbles: [2, 5, 3, 7, 8] }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.height = '100%';
        this.container.style.userSelect = 'none';

        const title = document.createElement('div');
        title.style.fontSize = '2rem';
        title.style.fontWeight = '800';
        title.style.marginBottom = '20px';
        title.innerHTML = `Қосындысы <span style="color: #3b82f6; font-size: 3rem;">${this.content.target}</span> болатын көпіршіктерді қос!`;
        this.container.appendChild(title);

        const world = document.createElement('div');
        world.style.width = '100%';
        world.style.flex = '1';
        world.style.position = 'relative';
        world.style.overflow = 'hidden';
        world.style.background = 'rgba(255,255,255,0.3)';
        world.style.borderRadius = '20px';
        world.style.border = '2px solid rgba(59,130,246,0.1)';
        this.container.appendChild(world);
        this.world = world;

        const controls = document.createElement('div');
        controls.style.marginTop = '15px';
        controls.style.zIndex = '10';

        const btnReset = document.createElement('button');
        btnReset.className = 'glass-button';
        btnReset.style.padding = '10px 25px';
        btnReset.style.fontSize = '1.1rem';
        btnReset.style.background = 'rgba(255,255,255,0.8)';
        btnReset.innerHTML = '🔄 Қайта бастау';
        btnReset.onclick = () => {
            if (window.SFX) SFX.playClick();
            this.render();
        };
        controls.appendChild(btnReset);
        this.container.appendChild(controls);

        // Wait a bit for the world to get its dimensions
        setTimeout(() => {
            this.content.bubbles.forEach(val => {
                this.createBubble(val);
            });
        }, 50);
    }

    createBubble(val) {
        const bubble = document.createElement('div');
        bubble.className = 'bubble pop-in';
        bubble.dataset.value = val;

        const size = 80 + (val * 5);
        bubble.style.width = size + 'px';
        bubble.style.height = size + 'px';
        bubble.style.borderRadius = '50%';
        bubble.style.background = 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), rgba(59,130,246,0.3) 100%)';
        bubble.style.boxShadow = 'inset -5px -5px 15px rgba(0,0,0,0.1), 0 10px 20px rgba(59,130,246,0.2)';
        bubble.style.border = '2px solid rgba(255,255,255,0.5)';
        bubble.style.display = 'flex';
        bubble.style.justifyContent = 'center';
        bubble.style.alignItems = 'center';
        bubble.style.fontSize = (1.5 + val * 0.1) + 'rem';
        bubble.style.fontWeight = 'bold';
        bubble.style.color = '#1e40af';
        bubble.style.position = 'absolute';
        bubble.style.cursor = 'grab';
        bubble.style.transition = 'transform 0.2s';
        bubble.textContent = val;

        // Safer Spawning
        const worldRect = this.world.getBoundingClientRect();
        const W = worldRect.width || 800;
        const H = worldRect.height || 500;

        let x, y, attempts = 0;
        const padding = 20;

        do {
            x = padding + Math.random() * (W - size - padding * 2);
            y = padding + Math.random() * (H - size - padding * 2);
            attempts++;

            var overlaps = Array.from(this.world.querySelectorAll('.bubble')).some(existing => {
                const ex = parseFloat(existing.style.left);
                const ey = parseFloat(existing.style.top);
                const ew = parseFloat(existing.style.width);
                const dist = Math.sqrt(Math.pow(ex - x, 2) + Math.pow(ey - y, 2));
                return dist < (size + ew) * 0.75; // Stronger distance requirement
            });
        } while (overlaps && attempts < 100);

        bubble.style.left = x + 'px';
        bubble.style.top = y + 'px';

        // Spawn protection
        bubble._merging = true;
        setTimeout(() => bubble._merging = false, 1000);

        this.setupDrag(bubble);
        this.world.appendChild(bubble);
        return bubble;
    }

    setupDrag(el) {
        let isDragging = false;
        let startX, startY;

        const onStart = (e) => {
            e.preventDefault();
            isDragging = true;
            el.style.zIndex = '1000';
            el.style.cursor = 'grabbing';
            el.style.transform = 'scale(1.1)';
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            startX = clientX - el.offsetLeft;
            startY = clientY - el.offsetTop;

            if (window.SFX) SFX.playClick();

            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onEnd);
            document.addEventListener('touchmove', onMove, { passive: false });
            document.addEventListener('touchend', onEnd);
        };

        const onMove = (e) => {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            let nx = clientX - startX;
            let ny = clientY - startY;

            // Boundaries
            const worldRect = this.world.getBoundingClientRect();
            const elRect = el.getBoundingClientRect();

            if (nx < 0) nx = 0;
            if (ny < 0) ny = 0;
            if (nx + elRect.width > worldRect.width) nx = worldRect.width - elRect.width;
            if (ny + elRect.height > worldRect.height) ny = worldRect.height - elRect.height;

            el.style.left = nx + 'px';
            el.style.top = ny + 'px';

            this.checkCollision(el);
        };

        const onEnd = () => {
            isDragging = false;
            el.style.zIndex = '1';
            el.style.cursor = 'grab';
            el.style.transform = 'scale(1)';
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onEnd);
            document.removeEventListener('touchmove', onMove);
            document.removeEventListener('touchend', onEnd);
        };

        el.addEventListener('mousedown', onStart);
        el.addEventListener('touchstart', onStart, { passive: false });
    }

    checkCollision(activeBubble) {
        if (activeBubble._merging) return;

        const others = this.world.querySelectorAll('.bubble');
        const r1 = activeBubble.getBoundingClientRect();
        const v1 = parseInt(activeBubble.dataset.value);

        others.forEach(other => {
            if (other === activeBubble || other._merging) return;
            const r2 = other.getBoundingClientRect();

            const dx = (r1.left + r1.width / 2) - (r2.left + r2.width / 2);
            const dy = (r1.top + r1.height / 2) - (r2.top + r2.height / 2);
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Tight merge threshold: 30% overlap of radii
            if (dist < (r1.width / 2 + r2.width / 2) * 0.4) {
                const v2 = parseInt(other.dataset.value);
                const sum = v1 + v2;

                if (sum <= this.content.target) {
                    this.mergeBubbles(activeBubble, other, sum);
                } else {
                    this.shakeBubble(other);
                }
            }
        });
    }

    mergeBubbles(b1, b2, newValue) {
        if (b1._merging || b2._merging) return;
        b1._merging = true;
        b2._merging = true;

        const r1 = b1.getBoundingClientRect();
        const r2 = b2.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        const midX = ((r1.left + r2.left) / 2) - containerRect.left;
        const midY = ((r1.top + r2.top) / 2) - containerRect.top;

        b1.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        b2.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        b1.style.left = midX + 'px';
        b1.style.top = midY + 'px';
        b2.style.left = midX + 'px';
        b2.style.top = midY + 'px';
        b1.style.transform = 'scale(0)';
        b2.style.transform = 'scale(0)';
        b1.style.opacity = '0';
        b2.style.opacity = '0';

        if (window.SFX) SFX.playPop();

        setTimeout(() => {
            b1.remove();
            b2.remove();
            const newBubble = this.createBubble(newValue);
            newBubble.style.left = midX + 'px';
            newBubble.style.top = midY + 'px';

            newBubble._merging = true;
            setTimeout(() => newBubble._merging = false, 1500); // Longer protection for merged bubbles

            if (newValue === this.content.target) {
                if (window.SFX) SFX.playWin();
                this.updateMascot('🤩', 'happy-anim');
                setTimeout(() => this.onSuccess(), 1200);
            }
        }, 300);
    }

    shakeBubble(el) {
        el.animate([
            { transform: 'translateX(0)' },
            { transform: 'translateX(-5px)' },
            { transform: 'translateX(5px)' },
            { transform: 'translateX(0)' }
        ], { duration: 200 });
    }

    updateMascot(emoji, anim) {
        const mascotImg = document.querySelector('#mascot-img');
        if (mascotImg) {
            mascotImg.textContent = emoji;
            mascotImg.className = anim;
        }
    }
}
