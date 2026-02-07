class ShareDivideTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { total: 6, divisor: 2, emoji: '🥕', answer: 3 }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.sharedCount = 0;
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
        title.innerHTML = `Барлық ${this.content.emoji}-ны <span style="color: #ef4444; font-size: 2.5rem;">${this.content.divisor}</span> кейіпкерге тең бөл!`;
        this.container.appendChild(title);

        // Characters/Recipients
        const recipients = document.createElement('div');
        recipients.style.display = 'flex';
        recipients.style.gap = '50px';
        recipients.style.justifyContent = 'center';
        recipients.style.flex = '1';
        this.recipients = recipients;

        const avatars = ['🐰', '🦊', '🐻', '🐯'];
        for (let i = 0; i < this.content.divisor; i++) {
            const area = document.createElement('div');
            area.style.display = 'flex';
            area.style.flexDirection = 'column';
            area.style.alignItems = 'center';
            area.style.gap = '10px';

            const avatar = document.createElement('div');
            avatar.style.fontSize = '4rem';
            avatar.textContent = avatars[i % avatars.length];
            area.appendChild(avatar);

            const plate = document.createElement('div');
            plate.className = 'divide-plate glass-panel';
            plate.dataset.index = i;
            plate.dataset.count = 0;
            plate.style.width = '150px';
            plate.style.height = '100px';
            plate.style.border = '3px solid #e2e8f0';
            plate.style.borderRadius = '50%';
            plate.style.display = 'flex';
            plate.style.flexWrap = 'wrap';
            plate.style.justifyContent = 'center';
            plate.style.alignContent = 'center';
            plate.style.background = 'white';
            area.appendChild(plate);

            recipients.appendChild(area);
        }
        this.container.appendChild(recipients);

        // Sources
        const sourceArea = document.createElement('div');
        sourceArea.style.width = '100%';
        sourceArea.style.padding = '20px';
        sourceArea.style.background = 'rgba(255,255,255,0.8)';
        sourceArea.style.borderRadius = '20px 20px 0 0';
        sourceArea.style.display = 'flex';
        sourceArea.style.flexWrap = 'wrap';
        sourceArea.style.justifyContent = 'center';
        sourceArea.style.gap = '10px';

        for (let i = 0; i < this.content.total; i++) {
            const item = document.createElement('div');
            item.className = 'divide-item';
            item.style.fontSize = '2.5rem';
            item.style.cursor = 'grab';
            item.style.userSelect = 'none';
            item.textContent = this.content.emoji;
            this.setupDrag(item);
            sourceArea.appendChild(item);
        }

        const equation = document.createElement('div');
        equation.style.fontSize = '2rem';
        equation.style.fontWeight = '900';
        equation.style.width = '100%';
        equation.style.textAlign = 'center';
        equation.style.marginTop = '10px';
        equation.innerHTML = `${this.content.total} ÷ ${this.content.divisor} = <span id="div-result" style="color: #ef4444;">?</span>`;
        sourceArea.appendChild(equation);

        this.container.appendChild(sourceArea);
    }

    setupDrag(el) {
        const onStart = (e) => {
            e.preventDefault();
            const rect = el.getBoundingClientRect();
            const containerRect = this.container.getBoundingClientRect();

            el.style.opacity = '0.3';
            const clone = el.cloneNode(true);
            clone.style.position = 'absolute';
            clone.style.left = (rect.left - containerRect.left) + 'px';
            clone.style.top = (rect.top - containerRect.top) + 'px';
            clone.style.zIndex = '1000';
            clone.style.opacity = '1';
            clone.style.pointerEvents = 'none';
            this.container.appendChild(clone);

            if (window.SFX) SFX.playClick();

            const onMove = (me) => {
                const mx = me.touches ? me.touches[0].clientX : me.clientX;
                const my = me.touches ? me.touches[0].clientY : me.clientY;
                clone.style.left = (mx - containerRect.left - 20) + 'px';
                clone.style.top = (my - containerRect.top - 20) + 'px';
            };

            const onEnd = (ee) => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onEnd);
                window.removeEventListener('touchmove', onMove);
                window.removeEventListener('touchend', onEnd);

                const ex = ee.changedTouches ? ee.changedTouches[0].clientX : ee.clientX;
                const ey = ee.changedTouches ? ee.changedTouches[0].clientY : ee.clientY;

                const target = document.elementFromPoint(ex, ey);
                const plate = target ? target.closest('.divide-plate') : null;

                if (plate) {
                    this.addToPlate(plate, clone, el, containerRect);
                } else {
                    el.style.opacity = '1';
                    clone.remove();
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

    addToPlate(plate, clone, original, containerRect) {
        let count = parseInt(plate.dataset.count);
        plate.dataset.count = ++count;
        this.sharedCount++;

        original.style.visibility = 'hidden';
        original.style.pointerEvents = 'none';

        const rect = plate.getBoundingClientRect();
        clone.style.transition = 'all 0.4s';
        clone.style.left = (rect.left - containerRect.left + 30 + (count - 1) * 20) + 'px';
        clone.style.top = (rect.top - containerRect.top + 20) + 'px';
        clone.style.transform = 'scale(0.7)';

        if (this.sharedCount === this.content.total) {
            // Check if all plates have equal amount
            const plates = Array.from(this.recipients.querySelectorAll('.divide-plate'));
            const counts = plates.map(p => parseInt(p.dataset.count));
            const isCorrect = counts.every(c => c === this.content.answer);

            if (isCorrect) {
                document.getElementById('div-result').textContent = this.content.answer;
                if (window.SFX) SFX.playWin();
                this.updateMascot('🥳', 'happy-anim');
                setTimeout(() => this.onSuccess(), 1500);
            } else {
                if (window.SFX) SFX.playError();
                this.updateMascot('🤔', 'thinking-anim');
                setTimeout(() => this.onFail(), 1000);
            }
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
