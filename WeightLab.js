class WeightLabTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.activeClone = null;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'space-around';
        this.container.style.padding = '40px';

        // 1. Scene with Pedestal
        const labScene = document.createElement('div');
        labScene.style.width = '100%';
        labScene.style.height = '200px';
        labScene.style.display = 'flex';
        labScene.style.justifyContent = 'center';
        labScene.style.alignItems = 'flex-end';
        labScene.style.position = 'relative';

        const pedestal = document.createElement('div');
        pedestal.className = 'glass-panel pedestal-zone';
        pedestal.style.width = '350px';
        pedestal.style.height = '120px';
        pedestal.style.background = 'linear-gradient(to bottom, #f8fafc, #f1f5f9)';
        pedestal.style.borderRadius = '40px';
        pedestal.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
        pedestal.style.display = 'flex';
        pedestal.style.justifyContent = 'center';
        pedestal.style.alignItems = 'center';
        pedestal.style.border = '3px dashed #cbd5e1';
        pedestal.style.transition = 'all 0.3s ease';
        pedestal.innerHTML = '<span style="opacity: 0.5; font-size: 1.1rem; font-weight: 800; color: #64748b; pointer-events: none; letter-spacing: 1px;">САЛМАҚТЫ ОСЫНДА ҚОЙ</span>';

        labScene.appendChild(pedestal);

        // 2. Objects Rack
        const objectsRack = document.createElement('div');
        objectsRack.style.display = 'flex';
        objectsRack.style.gap = '25px';
        objectsRack.style.padding = '25px';
        objectsRack.style.background = 'rgba(255, 255, 255, 0.5)';
        objectsRack.style.borderRadius = '35px';
        objectsRack.style.boxShadow = 'inset 0 2px 10px rgba(0,0,0,0.05)';

        this.content.objects.forEach(obj => {
            const item = document.createElement('div');
            item.className = 'weight-item pop-in';
            item.dataset.id = obj.id;
            item.dataset.weight = obj.weight;

            item.style.width = '110px';
            item.style.height = '110px';
            item.style.background = 'white';
            item.style.borderRadius = '30px';
            item.style.display = 'flex';
            item.style.justifyContent = 'center';
            item.style.alignItems = 'center';
            item.style.fontSize = '4.5rem';
            item.style.cursor = 'grab';
            item.style.boxShadow = '0 10px 25px rgba(0,0,0,0.08)';
            item.style.userSelect = 'none';
            item.innerHTML = obj.emoji;

            this.setupDragLogic(item);
            objectsRack.appendChild(item);
        });

        this.container.appendChild(labScene);
        this.container.appendChild(objectsRack);
    }

    setupDragLogic(el) {
        const weight = parseInt(el.dataset.weight);
        const lag = Math.max(0.1, 1 - (weight / 12));

        const handleStart = (e) => {
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const rect = el.getBoundingClientRect();
            const startX = rect.left;
            const startY = rect.top;

            // Create Visual Clone
            const clone = el.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.left = startX + 'px';
            clone.style.top = startY + 'px';
            clone.style.zIndex = '10000';
            clone.style.pointerEvents = 'none';
            clone.style.margin = '0';
            clone.style.transform = 'scale(1.1)';
            clone.style.boxShadow = '0 20px 40px rgba(0,0,0,0.2)';
            document.body.appendChild(clone);
            this.activeClone = clone;

            // Hide original
            el.style.visibility = 'hidden';

            if (window.SFX) SFX.playClick();
            this.updateMascot(weight > 7 ? '😟' : '🧐', weight > 7 ? 'shake-anim' : 'thinking-anim');

            let curX = startX;
            let curY = startY;

            const handleMove = (me) => {
                const mx = me.touches ? me.touches[0].clientX : me.clientX;
                const my = me.touches ? me.touches[0].clientY : me.clientY;

                const targetX = mx - 55;
                const targetY = my - 55;

                // Apply physics lag based on weight
                curX += (targetX - curX) * lag;
                curY += (targetY - curY) * lag;

                clone.style.left = curX + 'px';
                clone.style.top = curY + 'px';

                if (weight > 7) {
                    clone.style.transform = `scale(1.1) rotate(${Math.sin(Date.now() / 50) * 5}deg)`;
                }
            };

            const handleEnd = (ee) => {
                window.removeEventListener('mousemove', handleMove);
                window.removeEventListener('mouseup', handleEnd);
                window.removeEventListener('touchmove', handleMove);
                window.removeEventListener('touchend', handleEnd);

                const ex = ee.changedTouches ? ee.changedTouches[0].clientX : ee.clientX;
                const ey = ee.changedTouches ? ee.changedTouches[0].clientY : ee.clientY;

                const dropTarget = document.elementFromPoint(ex, ey);
                const pedestal = dropTarget ? dropTarget.closest('.pedestal-zone') : null;

                if (pedestal) {
                    this.processDrop(el, clone, pedestal);
                } else {
                    // Snap back
                    clone.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                    clone.style.left = startX + 'px';
                    clone.style.top = startY + 'px';
                    clone.style.transform = 'scale(1)';
                    setTimeout(() => {
                        clone.remove();
                        el.style.visibility = 'visible';
                    }, 400);
                }
                this.updateMascot('🦊', 'float-anim');
            };

            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleEnd);
            window.addEventListener('touchmove', handleMove, { passive: false });
            window.addEventListener('touchend', handleEnd);
        };

        el.addEventListener('mousedown', handleStart);
        el.addEventListener('touchstart', handleStart, { passive: false });
    }

    processDrop(original, clone, zone) {
        const objId = original.dataset.id;
        const obj = this.content.objects.find(o => o.id === objId);

        if (obj && obj.weight === this.content.targetWeight) {
            clone.remove();
            zone.innerHTML = `<span style="font-size: 3.5rem" class="pop-in">${obj.emoji}</span>`;
            zone.style.background = '#dcfce7';
            zone.style.border = '2px solid #22c55e';
            original.style.display = 'none';
            if (window.SFX) SFX.playWin();
            this.updateMascot('🤩', 'happy-anim');
            setTimeout(() => this.onSuccess(zone), 1200);
        } else {
            if (this.onFail) this.onFail();
            zone.style.background = '#fee2e2';

            // Rejection fly-out
            clone.style.transition = 'all 0.6s ease-in';
            clone.style.top = '-300px';
            clone.style.opacity = '0';

            setTimeout(() => {
                clone.remove();
                original.style.visibility = 'visible';
                zone.style.background = 'linear-gradient(to bottom, #f8fafc, #e2e8f0)';
            }, 600);
        }
    }

    updateMascot(emoji, anim) {
        const mascotImg = document.querySelector('#mascot-img');
        if (mascotImg) {
            mascotImg.textContent = emoji;
            mascotImg.className = anim;
        }
    }
}
