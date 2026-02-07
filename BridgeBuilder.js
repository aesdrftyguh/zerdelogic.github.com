class BridgeBuilderTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.placedBlocks = [];
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.height = '100%';
        this.container.style.padding = '10px 20px';
        this.container.style.gap = '15px';
        this.container.style.background = 'linear-gradient(to bottom, #bae6fd, #e0f2fe)';
        this.container.style.overflow = 'hidden';

        // Header
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.style.zIndex = '10';
        header.innerHTML = `
            <div style="font-size: 1.6rem; font-weight: bold; margin-bottom: 5px;">
                Көпір сал: Ұзындығы <span style="color: #ea580c; font-size: 2.2rem;">${this.content.width}</span> бөлшек жина!
            </div>
            <div id="bridge-progress" style="font-size: 1.4rem; color: #334155;">
                Қазір: <span id="current-bridge-val" style="font-weight: 900; color: #10b981;">0</span> / ${this.content.width}
            </div>
        `;
        this.container.appendChild(header);

        // Canyon Scene - River flowing vertically, bridge horizontally
        const scene = document.createElement('div');
        scene.style.width = '100%';
        scene.style.flex = '1';
        scene.style.position = 'relative';
        scene.style.display = 'flex';
        scene.style.alignItems = 'center';
        scene.style.justifyContent = 'center';
        scene.style.background = '#0ea5e9'; // River
        scene.style.borderRadius = '30px';
        scene.style.border = '6px solid #f1f5f9';
        scene.style.boxShadow = 'inset 0 0 50px rgba(0,0,0,0.1)';
        scene.style.overflow = 'hidden';

        // Shores
        const shoreWidth = 60;
        const leftShore = this.createShore(true, shoreWidth);
        const rightShore = this.createShore(false, shoreWidth);
        scene.appendChild(leftShore);
        scene.appendChild(rightShore);

        // The Drop Zone (Canyon)
        const canyon = document.createElement('div');
        canyon.className = 'bridge-canyon';
        canyon.style.width = `calc(100% - ${shoreWidth * 2}px)`;
        canyon.style.height = '100px';
        canyon.style.background = 'rgba(255, 255, 255, 0.1)';
        canyon.style.borderRadius = '15px';
        canyon.style.position = 'relative';
        canyon.style.border = '4px dashed rgba(255, 255, 255, 0.5)';
        canyon.style.display = 'flex';
        canyon.style.alignItems = 'center';
        canyon.style.animation = 'pulse-target 2s infinite ease-in-out';

        // Placeholder text
        const hintText = document.createElement('div');
        hintText.style.position = 'absolute';
        hintText.style.width = '100%';
        hintText.style.textAlign = 'center';
        hintText.style.color = 'white';
        hintText.style.fontWeight = 'bold';
        hintText.style.fontSize = '1.2rem';
        hintText.style.opacity = '0.7';
        hintText.style.pointerEvents = 'none';
        hintText.textContent = 'КӨПІРДІ ОСЫ ЖЕРГЕ ҚҰРАСТЫР';
        canyon.appendChild(hintText);

        const bridgeContainer = document.createElement('div');
        bridgeContainer.style.position = 'absolute';
        bridgeContainer.style.top = '0';
        bridgeContainer.style.left = '0';
        bridgeContainer.style.width = '100%';
        bridgeContainer.style.height = '100%';
        bridgeContainer.style.display = 'flex';
        this.bridgeContainer = bridgeContainer;
        canyon.appendChild(bridgeContainer);

        scene.appendChild(canyon);
        this.container.appendChild(scene);

        // Rack (Blocks)
        const rack = document.createElement('div');
        rack.style.width = '100%';
        rack.style.padding = '15px';
        rack.style.background = 'rgba(255, 255, 255, 0.9)';
        rack.style.borderRadius = '20px';
        rack.style.display = 'flex';
        rack.style.flexWrap = 'wrap';
        rack.style.justifyContent = 'center';
        rack.style.gap = '10px';
        rack.style.zIndex = '10';
        rack.style.boxShadow = '0 -10px 20px rgba(0,0,0,0.05)';

        this.content.blocks.forEach(val => {
            const block = document.createElement('div');
            block.className = 'bridge-block';
            block.dataset.val = val;
            block.style.width = (val * 30) + 'px';
            block.style.minWidth = '40px';
            block.style.height = '50px';
            block.style.background = 'linear-gradient(to bottom, #f97316, #ea580c)';
            block.style.borderRadius = '8px';
            block.style.display = 'flex';
            block.style.justifyContent = 'center';
            block.style.alignItems = 'center';
            block.style.color = 'white';
            block.style.fontWeight = '900';
            block.style.fontSize = '1.4rem';
            block.style.cursor = 'grab';
            block.style.border = '2px solid rgba(255,255,255,0.2)';
            block.style.boxShadow = '0 6px 0 #9a3412, 0 8px 15px rgba(0,0,0,0.2)';
            block.textContent = val;

            this.setupDrag(block, val);
            rack.appendChild(block);
        });
        this.container.appendChild(rack);

        // Styles
        if (!document.getElementById('bridge-ui-styles')) {
            const style = document.createElement('style');
            style.id = 'bridge-ui-styles';
            style.textContent = `
                @keyframes pulse-target {
                    0% { transform: scale(1); border-color: rgba(255,255,255,0.5); }
                    50% { transform: scale(1.02); border-color: rgba(255,255,255,1); box-shadow: 0 0 20px rgba(255,255,255,0.4); }
                    100% { transform: scale(1); border-color: rgba(255,255,255,0.5); }
                }
                .bridge-block:active { transform: scale(0.95); }
            `;
            document.head.appendChild(style);
        }
    }

    createShore(isLeft, width) {
        const shore = document.createElement('div');
        shore.style.position = 'absolute';
        shore.style.top = '0';
        shore.style.bottom = '0';
        shore.style.width = width + 'px';
        shore.style[isLeft ? 'left' : 'right'] = '0';
        shore.style.background = '#64748b'; // Rock color
        shore.style.display = 'flex';
        shore.style.flexDirection = 'column';
        shore.style.justifyContent = 'space-around';
        shore.style.alignItems = 'center';
        shore.style.zIndex = '5';

        // Add some "cracks" or "stones" texture
        for (let i = 0; i < 3; i++) {
            const stone = document.createElement('div');
            stone.style.width = '70%';
            stone.style.height = '20%';
            stone.style.background = '#475569';
            stone.style.borderRadius = '10px';
            shore.appendChild(stone);
        }
        return shore;
    }

    setupDrag(el, val) {
        const onStart = (e) => {
            if (e.target.closest('#mascot-img')) return;
            e.preventDefault();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const rect = el.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();

            const clone = el.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.left = (rect.left - containerRect.left) + 'px';
            clone.style.top = (rect.top - containerRect.top) + 'px';
            clone.style.zIndex = '1000';
            clone.style.pointerEvents = 'none';
            clone.style.transform = 'scale(1.1)';
            clone.style.opacity = '0.9';
            this.container.appendChild(clone);

            if (window.SFX) SFX.playClick();

            const onMove = (me) => {
                const mx = me.touches ? me.touches[0].clientX : me.clientX;
                const my = me.touches ? me.touches[0].clientY : me.clientY;
                clone.style.left = (mx - containerRect.left - (val * 15)) + 'px';
                clone.style.top = (my - containerRect.top - 25) + 'px';
            };

            const onEnd = (ee) => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onEnd);
                window.removeEventListener('touchmove', onMove);
                window.removeEventListener('touchend', onEnd);

                const ex = ee.changedTouches ? ee.changedTouches[0].clientX : ee.clientX;
                const ey = ee.changedTouches ? ee.changedTouches[0].clientY : ee.clientY;

                const target = document.elementFromPoint(ex, ey);
                const canyonZone = target ? target.closest('.bridge-canyon') : null;

                if (canyonZone) {
                    this.placeBlock(val, clone);
                } else {
                    clone.style.transition = 'all 0.3s ease-out';
                    clone.style.left = (rect.left - containerRect.left) + 'px';
                    clone.style.top = (rect.top - containerRect.top) + 'px';
                    clone.style.transform = 'scale(0)';
                    setTimeout(() => clone.remove(), 300);
                }
            };

            window.addEventListener('mousemove', onMove);
            window.addEventListener('mouseup', onEnd);
            window.addEventListener('touchmove', onMove, { passive: false });
            window.addEventListener('touchend', onEnd);
        };

        el.addEventListener('mousedown', onStart);
        el.addEventListener('touchstart', onStart, { passive: false });
    }

    placeBlock(val, clone) {
        const totalNow = this.placedBlocks.reduce((a, b) => a + b, 0);
        if (totalNow + val > this.content.width) {
            if (window.SFX) SFX.playError();
            this.updateMascot('😟', 'shake-anim');
            clone.style.transition = 'all 0.5s ease-in';
            clone.style.top = '1000px';
            setTimeout(() => clone.remove(), 500);
            return;
        }

        this.placedBlocks.push(val);
        clone.remove();

        const blockEl = document.createElement('div');
        blockEl.style.width = (val / this.content.width * 100) + '%';
        blockEl.style.height = '80px';
        blockEl.style.background = 'linear-gradient(to bottom, #f97316, #ea580c)';
        blockEl.style.border = '3px solid rgba(255,255,255,0.4)';
        blockEl.style.borderRadius = '5px';
        blockEl.style.display = 'flex';
        blockEl.style.justifyContent = 'center';
        blockEl.style.alignItems = 'center';
        blockEl.style.color = 'white';
        blockEl.style.fontWeight = 'bold';
        blockEl.style.fontSize = '1.2rem';
        blockEl.className = 'pop-in';
        blockEl.textContent = val;

        blockEl.style.cursor = 'pointer';
        blockEl.onclick = () => {
            const index = this.placedBlocks.indexOf(val);
            if (index > -1) {
                this.placedBlocks.splice(index, 1);
                blockEl.remove();
                this.updateProgress();
            }
            if (window.SFX) SFX.playClick();
        };

        this.bridgeContainer.appendChild(blockEl);
        this.updateProgress();

        const newTotal = this.placedBlocks.reduce((a, b) => a + b, 0);
        if (newTotal === this.content.width) {
            if (window.SFX) SFX.playWin();
            this.updateMascot('🤩', 'happy-anim');
            setTimeout(() => this.onSuccess(), 1000);
        } else {
            this.updateMascot('😁', 'thinking-anim');
        }
    }

    updateProgress() {
        const total = this.placedBlocks.reduce((a, b) => a + b, 0);
        const counter = document.getElementById('current-bridge-val');
        if (counter) counter.textContent = total;
    }

    updateMascot(emoji, anim) {
        const mascotImg = document.querySelector('#mascot-img');
        if (mascotImg) {
            mascotImg.textContent = emoji;
            mascotImg.className = anim;
        }
    }
}
