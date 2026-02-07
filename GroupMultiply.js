class GroupMultiplyTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { operand1: 3, operand2: 2, emoji: '🍎', total: 6 }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.currentCount = 0;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.height = '100%';
        this.container.style.gap = '20px';

        const title = document.createElement('div');
        title.style.fontSize = '1.8rem';
        title.style.fontWeight = 'bold';
        title.innerHTML = `Әр себетке <span style="color: #6366f1; font-size: 2.5rem;">${this.content.operand2}</span>-ден ${this.content.emoji} сал!`;
        this.container.appendChild(title);

        const workspace = document.createElement('div');
        workspace.style.display = 'flex';
        workspace.style.gap = '30px';
        workspace.style.flexWrap = 'wrap';
        workspace.style.justifyContent = 'center';
        workspace.style.flex = '1';
        this.workspace = workspace;

        for (let i = 0; i < this.content.operand1; i++) {
            const group = document.createElement('div');
            group.className = 'multiply-group glass-panel';
            group.dataset.index = i;
            group.dataset.count = 0;
            group.style.width = '180px';
            group.style.height = '150px';
            group.style.border = '3px dashed #cbd5e1';
            group.style.borderRadius = '20px';
            group.style.display = 'flex';
            group.style.flexWrap = 'wrap';
            group.style.padding = '10px';
            group.style.gap = '5px';
            group.style.alignContent = 'center';
            group.style.justifyContent = 'center';
            group.innerHTML = `<div style="width: 100%; text-align: center; color: #94a3b8; font-size: 0.8rem;">${i + 1}-себет</div>`;
            workspace.appendChild(group);
        }
        this.container.appendChild(workspace);

        const source = document.createElement('div');
        source.style.padding = '20px';
        source.style.background = 'white';
        source.style.borderRadius = '20px';
        source.style.boxShadow = '0 10px 20px rgba(0,0,0,0.05)';
        source.style.display = 'flex';
        source.style.gap = '20px';

        // Endless source item
        const item = document.createElement('div');
        item.style.fontSize = '3rem';
        item.style.cursor = 'grab';
        item.style.transition = 'transform 0.2s';
        item.textContent = this.content.emoji;
        item.onmouseover = () => item.style.transform = 'scale(1.2)';
        item.onmouseout = () => item.style.transform = 'scale(1)';

        this.setupDrag(item);
        source.appendChild(item);

        const equation = document.createElement('div');
        equation.style.fontSize = '2rem';
        equation.style.fontWeight = '900';
        equation.style.color = '#334155';
        equation.innerHTML = `${this.content.operand1} × ${this.content.operand2} = <span id="mult-result" style="color: #6366f1;">?</span>`;
        source.appendChild(equation);

        this.container.appendChild(source);
    }

    setupDrag(el) {
        const onStart = (e) => {
            e.preventDefault();
            const rect = el.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();

            const clone = el.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.left = (rect.left - containerRect.left) + 'px';
            clone.style.top = (rect.top - containerRect.top) + 'px';
            clone.style.zIndex = '1000';
            clone.style.pointerEvents = 'none';
            this.container.appendChild(clone);

            if (window.SFX) SFX.playClick();

            const onMove = (me) => {
                const mx = me.touches ? me.touches[0].clientX : me.clientX;
                const my = me.touches ? me.touches[0].clientY : me.clientY;
                clone.style.left = (mx - containerRect.left - 25) + 'px';
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
                const group = target ? target.closest('.multiply-group') : null;

                if (group) {
                    this.addToGroup(group, clone, containerRect);
                } else {
                    clone.style.transition = 'all 0.3s';
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

    addToGroup(group, clone, containerRect) {
        let count = parseInt(group.dataset.count);
        if (count >= this.content.operand2) {
            if (window.SFX) SFX.playError();
            clone.style.transition = 'all 0.4s';
            clone.style.top = '-200px';
            clone.style.opacity = '0';
            setTimeout(() => clone.remove(), 400);
            return;
        }

        group.dataset.count = ++count;
        this.currentCount++;

        const rect = group.getBoundingClientRect();
        clone.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        clone.style.left = (rect.left - containerRect.left + 20 + (count - 1) * 30) + 'px';
        clone.style.top = (rect.top - containerRect.top + 40) + 'px';
        clone.style.transform = 'scale(0.8)';

        if (this.currentCount === (this.content.operand1 * this.content.operand2)) {
            document.getElementById('mult-result').textContent = this.currentCount;
            if (window.SFX) SFX.playWin();
            this.updateMascot('🤩', 'happy-anim');
            setTimeout(() => this.onSuccess(), 1500);
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
