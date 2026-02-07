class SymmetryTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { grid: [[0,1,0],...], size: 5 }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.userGrid = [];
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.gap = '20px';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.justifyContent = 'center';

        const gridSize = this.content.size || 5;
        this.userGrid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));

        // Create Main Display
        const mainWrapper = document.createElement('div');
        mainWrapper.style.display = 'flex';
        mainWrapper.style.gap = '20px';
        mainWrapper.style.padding = '30px';
        mainWrapper.style.background = 'white';
        mainWrapper.style.borderRadius = '40px';
        mainWrapper.style.boxShadow = '0 20px 60px rgba(0,0,0,0.05)';

        // Left Side: Pattern (Reference)
        const leftGrid = this.createGridDisplay(this.content.pattern, gridSize, false);

        // Mirror Line
        const mirrorLine = document.createElement('div');
        mirrorLine.style.width = '4px';
        mirrorLine.style.background = 'linear-gradient(to bottom, transparent, #3b82f6, transparent)';
        mirrorLine.style.borderRadius = '2px';

        // Right Side: Input
        const rightGrid = this.createGridDisplay(this.userGrid, gridSize, true);

        mainWrapper.appendChild(leftGrid);
        mainWrapper.appendChild(mirrorLine);
        mainWrapper.appendChild(rightGrid);

        this.container.appendChild(mainWrapper);

        // Check Button
        const checkBtn = document.createElement('button');
        checkBtn.innerHTML = 'Тексеру ✅';
        checkBtn.className = 'glass-button primary';
        checkBtn.style.marginTop = '40px';
        checkBtn.onclick = () => this.checkAnswer(checkBtn);
        this.container.appendChild(checkBtn);
    }

    createGridDisplay(data, size, interactive) {
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${size}, 50px)`;
        grid.style.gap = '4px';

        for (let r = 0; r < size; r++) {
            for (let c = 0; c < size; c++) {
                const cell = document.createElement('div');
                cell.style.width = '50px';
                cell.style.height = '50px';
                cell.style.borderRadius = '8px';
                cell.style.transition = 'all 0.2s';
                cell.style.cursor = interactive ? 'pointer' : 'default';

                // Color based on mirror logic (horizontal reflection)
                // For the right grid (input), we mirror the column index
                const val = data[r][c];
                this.updateCellColor(cell, val);

                if (interactive) {
                    cell.onclick = () => {
                        SFX.playClick();
                        this.userGrid[r][c] = this.userGrid[r][c] ? 0 : 1;
                        this.updateCellColor(cell, this.userGrid[r][c]);
                    };
                    cell.onmouseenter = () => {
                        if (!this.userGrid[r][c]) cell.style.background = '#f1f5f9';
                    };
                    cell.onmouseleave = () => {
                        this.updateCellColor(cell, this.userGrid[r][c]);
                    };
                }

                grid.appendChild(cell);
            }
        }
        return grid;
    }

    updateCellColor(el, val) {
        if (val === 1) {
            el.style.background = '#8b5cf6'; // Violet
            el.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.1)';
        } else {
            el.style.background = '#e2e8f0'; // Gray
            el.style.boxShadow = 'none';
        }
    }

    checkAnswer(btn) {
        const target = this.content.target; // Pre-calculated reflection or mirrored pattern
        let correct = true;

        for (let r = 0; r < this.content.size; r++) {
            for (let c = 0; c < this.content.size; c++) {
                if (this.userGrid[r][c] !== target[r][c]) {
                    correct = false;
                    break;
                }
            }
        }

        if (correct) {
            btn.disabled = true;
            btn.style.opacity = '0.7';
            btn.textContent = 'Керемет! 🌟';
            this.onSuccess(btn);
        } else {
            this.onFail();
            btn.classList.add('shake-anim');
            setTimeout(() => btn.classList.remove('shake-anim'), 500);
        }
    }
}
