class MatchingTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // Expects pairs: [{id: 'p1', left: {...}, right: {...}}]
        this.onSuccess = onSuccess;
        this.onFail = onFail;

        this.pairs = content.pairs || [];
        this.leftSelected = null;
        this.rightSelected = null;
        this.matchesFound = 0;
        this.render(); // Required by TaskRunner (see line 44)
    }

    render() {
        this.container.style.width = '100%';
        this.container.style.height = 'auto'; // Adapted layout
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'row'; // Force horizontal
        this.container.style.flexWrap = 'wrap'; // Allow wrap on small screens
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'flex-start'; // Align top
        this.container.style.padding = '20px'; // Added padding
        this.container.style.gap = '40px';
        this.container.style.boxSizing = 'border-box'; // Fix overflow

        // Left Column
        const leftCol = document.createElement('div');
        leftCol.className = 'matching-col';
        leftCol.style.display = 'flex';
        leftCol.style.flexDirection = 'column';
        leftCol.style.gap = '20px';
        leftCol.style.flex = '0 0 35%'; /* slightly narrower */
        leftCol.style.alignItems = 'center'; /* Center cards */

        // Right Column
        const rightCol = document.createElement('div');
        rightCol.className = 'matching-col';
        rightCol.style.display = 'flex';
        rightCol.style.flexDirection = 'column';
        rightCol.style.gap = '20px';
        rightCol.style.flex = '0 0 35%';
        rightCol.style.alignItems = 'center'; /* Center cards */

        // Randomize render order to make it a game
        const leftItems = this.pairs.map(p => ({ ...p.left, pairId: p.id, side: 'left' }));
        const rightItems = this.pairs.map(p => ({ ...p.right, pairId: p.id, side: 'right' }));

        // Shuffle right items
        rightItems.sort(() => Math.random() - 0.5);

        leftItems.forEach(item => leftCol.appendChild(this.createCard(item)));
        rightItems.forEach(item => rightCol.appendChild(this.createCard(item)));

        this.container.appendChild(leftCol);
        this.container.appendChild(rightCol);
    }

    createCard(item) {
        const card = document.createElement('div');
        card.className = 'glass-button matching-card pop-in';
        card.innerHTML = `<span style="font-size: 2.5rem;">${item.content}</span>`;
        card.style.justifyContent = 'center';
        card.style.height = '100px';
        card.style.width = '100%'; // Full width of column
        card.style.maxWidth = '250px'; // But not too wide
        card.style.margin = '0 auto'; // Center in column
        card.dataset.pairId = item.pairId;
        card.dataset.side = item.side;
        card.style.borderRadius = '20px';
        card.style.background = 'white';
        card.style.boxShadow = '0 5px 15px rgba(0,0,0,0.05)';
        card.style.border = '2px solid transparent';

        card.addEventListener('click', () => this.handleCardClick(card));
        return card;
    }

    handleCardClick(card) {
        if (card.classList.contains('matched')) return;

        // Deselect if already selected
        if (card.classList.contains('selected')) {
            card.classList.remove('selected');
            card.style.border = '2px solid transparent';
            card.style.background = 'white';

            if (card.dataset.side === 'left') this.leftSelected = null;
            else this.rightSelected = null;
            return;
        }

        // Select new
        // Clear previous selection on same side
        if (card.dataset.side === 'left') {
            if (this.leftSelected) {
                this.leftSelected.classList.remove('selected');
                this.leftSelected.style.border = '2px solid transparent';
                this.leftSelected.style.background = 'white';
            }
            this.leftSelected = card;
        } else {
            if (this.rightSelected) {
                this.rightSelected.classList.remove('selected');
                this.rightSelected.style.border = '2px solid transparent';
                this.rightSelected.style.background = 'white';
            }
            this.rightSelected = card;
        }
        card.classList.add('selected');
        card.style.border = '3px solid #f59e0b'; // Amber selection
        card.style.background = '#fffbeb';

        // Check Match
        if (this.leftSelected && this.rightSelected) {
            this.checkMatch();
        }
    }

    checkMatch() {
        const leftId = this.leftSelected.dataset.pairId;
        const rightId = this.rightSelected.dataset.pairId;

        if (leftId === rightId) {
            // Match!
            this.leftSelected.classList.add('matched');
            this.rightSelected.classList.add('matched');

            this.leftSelected.style.background = '#fef3c7'; // Light amber
            this.rightSelected.style.background = '#fef3c7';
            this.leftSelected.style.border = '3px solid #fbbf24';
            this.rightSelected.style.border = '3px solid #fbbf24';

            this.leftSelected.classList.remove('selected');
            this.rightSelected.classList.remove('selected');

            this.leftSelected = null;
            this.rightSelected = null;
            this.matchesFound++;
            if (window.SFX) SFX.playClick();

            if (this.matchesFound === this.pairs.length) {
                setTimeout(() => this.onSuccess(), 500);
            }
        } else {
            // No Match
            const l = this.leftSelected;
            const r = this.rightSelected;

            l.classList.add('shake-anim');
            r.classList.add('shake-anim');
            l.style.background = '#fee2e2'; // Red tint
            r.style.background = '#fee2e2';
            l.style.border = '3px solid #ef4444';
            r.style.border = '3px solid #ef4444';

            setTimeout(() => {
                l.classList.remove('shake-anim', 'selected');
                r.classList.remove('shake-anim', 'selected');
                l.style.background = 'white';
                r.style.background = 'white';
                l.style.border = '2px solid transparent';
                r.style.border = '2px solid transparent';
                this.leftSelected = null;
                this.rightSelected = null;
                this.onFail();
            }, 600);
        }
    }
}
