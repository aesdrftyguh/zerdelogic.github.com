class VisualMemoryTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { items: ['🍎', '🍌', '🍇', '🍒'], target: '🍎' }
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
        this.container.style.gap = '30px';

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
        grid.style.gap = '20px';

        const boxes = [];
        // Shuffle items to randomize position
        const shuffledItems = [...this.content.items].sort(() => Math.random() - 0.5);

        shuffledItems.forEach((emoji, idx) => {
            const box = document.createElement('div');
            box.className = 'glass-panel pop-in';
            box.style.width = '140px';
            box.style.height = '140px';
            box.style.display = 'flex';
            box.style.justifyContent = 'center';
            box.style.alignItems = 'center';
            box.style.fontSize = '4.5rem';
            box.style.cursor = 'pointer';
            box.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            box.textContent = emoji;

            grid.appendChild(box);
            boxes.push({ el: box, emoji: emoji });
        });

        this.container.appendChild(grid);

        const statusText = document.createElement('div');
        statusText.style.fontSize = '1.5rem';
        statusText.style.fontWeight = 'bold';
        statusText.style.color = '#4f46e5';
        statusText.textContent = 'Есте сақта!';
        this.container.appendChild(statusText);

        // Timer to hide
        setTimeout(() => {
            boxes.forEach(box => {
                box.el.textContent = '❓';
                box.el.style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
                box.el.style.color = 'white';
            });
            statusText.innerHTML = `<span style="font-size: 2.5rem;">${this.content.target}</span> қайда болды?`;

            boxes.forEach(box => {
                box.el.onclick = () => {
                    if (box.emoji === this.content.target) {
                        box.el.textContent = box.emoji;
                        box.el.style.background = '#dcfce7';
                        box.el.style.borderColor = '#22c55e';
                        if (window.SFX) SFX.playWin();
                        this.updateMascot('🤩', 'happy-anim');
                        setTimeout(() => this.onSuccess(), 1000);
                    } else {
                        box.el.style.animation = 'shake 0.5s';
                        if (window.SFX) SFX.playFail();
                        this.onFail();
                    }
                };
            });
        }, 3000);
    }

    updateMascot(emoji, anim) {
        const mascotImg = document.querySelector('#mascot-img');
        if (mascotImg) {
            mascotImg.textContent = emoji;
            mascotImg.className = anim;
        }
    }
}
