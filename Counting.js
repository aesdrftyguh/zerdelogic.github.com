class CountingTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { items: [{emoji: '🦆', count: 5}, {emoji: '🐸', count: 2}], targetEmoji: '🦆', answer: 5 }
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

        const scene = document.createElement('div');
        scene.style.width = '100%';
        scene.style.maxWidth = '600px';
        scene.style.height = '350px';
        scene.style.background = '#e0f2fe';
        scene.style.borderRadius = '30px';
        scene.style.position = 'relative';
        scene.style.overflow = 'hidden';
        scene.style.border = '6px solid white';
        scene.style.boxShadow = '0 15px 35px rgba(0,0,0,0.1)';

        // Distribute items randomly
        const allItems = [];
        this.content.items.forEach(group => {
            for (let i = 0; i < group.count; i++) {
                allItems.push(group.emoji);
            }
        });

        // Shuffle
        allItems.sort(() => Math.random() - 0.5);

        allItems.forEach((emoji, idx) => {
            const item = document.createElement('div');
            item.textContent = emoji;
            item.style.position = 'absolute';
            item.style.fontSize = '3.5rem';
            item.style.left = (10 + Math.random() * 80) + '%';
            item.style.top = (10 + Math.random() * 80) + '%';
            item.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            item.className = 'pop-in';
            item.style.animationDelay = `${idx * 0.05}s`;
            item.style.cursor = 'pointer';

            item.onclick = () => {
                if (window.SFX) SFX.playClick();
                item.style.filter = 'drop-shadow(0 0 10px gold)';
                item.style.transform = 'scale(1.2) rotate(15deg)';
            };

            scene.appendChild(item);
        });

        this.container.appendChild(scene);

        // Options
        const optionsRow = document.createElement('div');
        optionsRow.style.display = 'flex';
        optionsRow.style.gap = '15px';

        const possibleAnswers = [this.content.answer, this.content.answer + 1, this.content.answer - 1]
            .filter(n => n > 0)
            .sort(() => Math.random() - 0.5);

        // Use Set to ensure uniqueness
        const uniqueAnswers = [...new Set(possibleAnswers)];
        if (uniqueAnswers.length < 3) uniqueAnswers.push(this.content.answer + 2);

        uniqueAnswers.sort((a, b) => a - b).forEach(val => {
            const btn = document.createElement('button');
            btn.className = 'glass-button';
            btn.style.padding = '15px 40px';
            btn.style.fontSize = '2rem';
            btn.style.fontWeight = '900';
            btn.textContent = val;

            btn.onclick = () => {
                if (val === this.content.answer) {
                    if (window.SFX) SFX.playWin();
                    this.updateMascot('🎯', 'happy-anim');
                    setTimeout(() => this.onSuccess(), 1000);
                } else {
                    if (window.SFX) SFX.playError();
                    this.updateMascot('🧐', 'thinking-anim');
                    this.onFail();
                }
            };
            optionsRow.appendChild(btn);
        });

        this.container.appendChild(optionsRow);
    }

    updateMascot(emoji, anim) {
        const mascotImg = document.querySelector('#mascot-img');
        if (mascotImg) {
            mascotImg.textContent = emoji;
            mascotImg.className = anim;
        }
    }
}
