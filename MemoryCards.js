// Template for Memory Card Game (Find Pairs)
class MemoryCardsTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { pairs: ["🍎", "🍌", "🍇"] } -> generates 2 of each
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.cards = [];
        this.flippedCards = [];
        this.matchedCount = 0;
        this.isLocked = false;
        this.render();
    }

    render() {
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
        this.container.style.gap = '20px';
        this.container.style.padding = '10px';
        this.container.style.boxSizing = 'border-box';

        // Prepare cards
        const items = [...this.content.pairs, ...this.content.pairs];
        const shuffled = items.sort(() => Math.random() - 0.5);

        // Grid Container
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gap = '20px';
        grid.style.padding = '30px';

        // Adjust grid columns based on number of cards
        const totalCards = shuffled.length;
        if (totalCards <= 6) {
            grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        } else if (totalCards <= 8) {
            grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        } else {
            grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
        }

        shuffled.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card pop-in';
            card.dataset.value = item;
            card.style.width = '120px';
            card.style.height = '120px';
            card.style.position = 'relative';
            card.style.perspective = '1000px';
            card.style.cursor = 'pointer';
            card.style.animationDelay = `${index * 0.1}s`;

            // Inner container for Flip effect
            const inner = document.createElement('div');
            inner.className = 'card-inner';
            inner.style.position = 'relative';
            inner.style.width = '100%';
            inner.style.height = '100%';
            inner.style.textAlign = 'center';
            inner.style.transition = 'transform 0.6s';
            inner.style.transformStyle = 'preserve-3d';

            // Front (Face Down)
            const front = document.createElement('div');
            front.style.position = 'absolute';
            front.style.width = '100%';
            front.style.height = '100%';
            front.style.backfaceVisibility = 'hidden';
            front.style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
            front.style.borderRadius = '20px';
            front.style.display = 'flex';
            front.style.justifyContent = 'center';
            front.style.alignItems = 'center';
            front.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
            front.innerHTML = '<span style="font-size: 3rem; opacity: 0.5;">❓</span>';

            // Back (Face Up)
            const back = document.createElement('div');
            back.style.position = 'absolute';
            back.style.width = '100%';
            back.style.height = '100%';
            back.style.backfaceVisibility = 'hidden';
            back.style.background = '#ffffff';
            back.style.borderRadius = '20px';
            back.style.display = 'flex';
            back.style.justifyContent = 'center';
            back.style.alignItems = 'center';
            back.style.transform = 'rotateY(180deg)';
            back.style.fontSize = '4.5rem';
            back.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
            back.style.border = '4px solid #6366f1';
            back.innerHTML = item;

            inner.appendChild(front);
            inner.appendChild(back);
            card.appendChild(inner);

            card.addEventListener('click', () => this.flipCard(card, inner));

            grid.appendChild(card);
            this.cards.push(card);
        });

        this.container.appendChild(grid);
    }

    flipCard(card, inner) {
        if (this.isLocked) return;
        if (card.dataset.flipped === 'true') return; // Already flipped

        SFX.playClick();

        // Flip animation
        inner.style.transform = 'rotateY(180deg)';
        card.dataset.flipped = 'true';
        this.flippedCards.push({ card, inner, value: card.dataset.value });

        if (this.flippedCards.length === 2) {
            this.checkForMatch();
        }
    }

    checkForMatch() {
        this.isLocked = true;
        const [first, second] = this.flippedCards;

        if (first.value === second.value) {
            // Match!
            SFX.playTone(600, 'sine', 0.1);
            setTimeout(() => {
                first.inner.querySelector('div:nth-child(2)').style.background = '#dcfce7'; // Green bg
                first.inner.querySelector('div:nth-child(2)').style.borderColor = '#22c55e';

                second.inner.querySelector('div:nth-child(2)').style.background = '#dcfce7';
                second.inner.querySelector('div:nth-child(2)').style.borderColor = '#22c55e';

                // Pulse animation
                first.card.style.animation = 'pulse 0.5s';
                second.card.style.animation = 'pulse 0.5s';

                this.flippedCards = [];
                this.isLocked = false;
                this.matchedCount++;

                if (this.matchedCount === this.content.pairs.length) {
                    setTimeout(() => this.onSuccess(), 1000);
                }
            }, 500);
        } else {
            // No Match
            setTimeout(() => {
                // Shake effect
                first.card.style.animation = 'shake 0.5s';
                second.card.style.animation = 'shake 0.5s';
                SFX.playFail();

                setTimeout(() => {
                    first.inner.style.transform = 'rotateY(0deg)';
                    second.inner.style.transform = 'rotateY(0deg)';
                    first.card.dataset.flipped = 'false';
                    second.card.dataset.flipped = 'false';
                    first.card.style.animation = '';
                    second.card.style.animation = '';

                    this.flippedCards = [];
                    this.isLocked = false;
                }, 500);
            }, 1000);
        }
    }
}
