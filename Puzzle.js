class PuzzleTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { emoji: '🐻', pieces: [0,1,2,3] shuffled }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.placedCount = 0;
        this.totalPieces = 4;
        this.render();
    }

    render() {
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
        this.container.style.gap = '40px';

        // 1. Puzzle Board (Targets)
        const board = document.createElement('div');
        board.style.display = 'grid';
        board.style.gridTemplateColumns = 'repeat(2, 100px)';
        board.style.gridTemplateRows = 'repeat(2, 100px)';
        board.style.gap = '4px';
        board.style.padding = '10px';
        board.style.background = 'rgba(255,255,255,0.3)';
        board.style.borderRadius = '20px';
        board.style.border = '2px dashed #6366f1';

        for (let i = 0; i < 4; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.index = i;
            slot.style.width = '100px';
            slot.style.height = '100px';
            slot.style.background = 'rgba(255,255,255,0.5)';
            slot.style.borderRadius = '10px';
            slot.style.display = 'flex';
            slot.style.justifyContent = 'center';
            slot.style.alignItems = 'center';

            this.enableDrop(slot);
            board.appendChild(slot);
        }

        // 2. Source Pieces
        const piecesContainer = document.createElement('div');
        piecesContainer.style.display = 'flex';
        piecesContainer.style.gap = '20px';
        piecesContainer.style.marginTop = '20px';

        const shuffled = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

        shuffled.forEach(idx => {
            const piece = this.createPiece(idx);
            piecesContainer.appendChild(piece);
        });

        this.container.appendChild(board);
        this.container.appendChild(piecesContainer);
    }

    createPiece(index) {
        const piece = document.createElement('div');
        piece.className = 'glass-button pop-in';
        piece.style.width = '80px';
        piece.style.height = '80px';
        piece.style.padding = '0';
        piece.style.overflow = 'hidden';
        piece.style.cursor = 'grab';
        piece.draggable = true;
        piece.dataset.index = index;

        // Visual of a piece (using clip-path to show a quadrant of the emoji)
        const inner = document.createElement('div');
        inner.style.fontSize = '120px'; // Massive emoji
        inner.style.width = '200px';
        inner.style.height = '200px';
        inner.style.display = 'flex';
        inner.style.justifyContent = 'center';
        inner.style.alignItems = 'center';
        inner.style.position = 'absolute';
        inner.innerHTML = this.content.emoji;

        // Position the large emoji so only the relevant quadrant is visible 
        const x = (index % 2) * -100;
        const y = Math.floor(index / 2) * -100;
        inner.style.left = `${x}px`;
        inner.style.top = `${y}px`;

        piece.appendChild(inner);
        this.enableDrag(piece);
        return piece;
    }

    enableDrag(el) {
        el.addEventListener('dragstart', (e) => {
            window.draggedPiece = el;
            el.style.opacity = '0.5';
        });
        el.addEventListener('dragend', () => {
            el.style.opacity = '1';
        });
    }

    enableDrop(slot) {
        slot.addEventListener('dragover', (e) => e.preventDefault());
        slot.addEventListener('drop', (e) => {
            const dragged = window.draggedPiece;
            if (!dragged) return;

            if (dragged.dataset.index === slot.dataset.index) {
                // Correct placement
                SFX.playClick();
                slot.style.background = 'transparent';
                dragged.style.position = 'relative';
                dragged.style.width = '100px';
                dragged.style.height = '100px';
                dragged.style.left = '0';
                dragged.style.top = '0';
                dragged.draggable = false;
                slot.appendChild(dragged);

                this.placedCount++;
                if (this.placedCount === this.totalPieces) {
                    setTimeout(() => this.onSuccess(), 500);
                }
            } else {
                SFX.playError();
                slot.style.animation = 'shake 0.5s';
                setTimeout(() => slot.style.animation = '', 500);
            }
        });
    }
}
