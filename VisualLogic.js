// Template for Visual Logic tasks (Pattern completion with images)
class VisualLogicTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { grid: [[...]], options: [{content, correct}] }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
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
        this.container.style.padding = '20px';
        this.container.style.boxSizing = 'border-box';

        const CELL_SIZE = '90px'; // Slightly smaller
        const CELL_FONT = '4.5rem';

        // Grid container
        const gridContainer = document.createElement('div');
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = `repeat(${this.content.grid[0].length}, ${CELL_SIZE})`;
        gridContainer.style.gap = '15px';
        gridContainer.style.padding = '35px';
        gridContainer.style.background = 'linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%)';
        gridContainer.style.borderRadius = '30px';
        gridContainer.style.boxShadow = '0 15px 40px rgba(139, 92, 246, 0.2)';
        gridContainer.style.border = '3px solid rgba(139, 92, 246, 0.3)';

        // Render grid
        this.content.grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                const cellEl = document.createElement('div');
                cellEl.className = 'grid-cell pop-in';
                cellEl.style.width = CELL_SIZE;
                cellEl.style.height = CELL_SIZE;
                cellEl.style.display = 'flex';
                cellEl.style.justifyContent = 'center';
                cellEl.style.alignItems = 'center';
                cellEl.style.borderRadius = '20px';
                cellEl.style.fontSize = CELL_FONT;
                cellEl.style.transition = 'all 0.3s ease';
                cellEl.style.animationDelay = `${(rowIndex * row.length + colIndex) * 0.05}s`;

                if (cell === '?') {
                    // Empty cell with question mark
                    cellEl.innerHTML = '?';
                    cellEl.style.border = '4px dashed #a78bfa';
                    cellEl.style.background = 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)';
                    cellEl.style.color = '#8b5cf6';
                    cellEl.style.fontSize = '5rem';
                    cellEl.style.fontWeight = 'bold';
                    cellEl.style.animation = 'zonePulse 2s ease-in-out infinite';
                    cellEl.dataset.isQuestion = 'true';
                } else {
                    // Regular cell
                    cellEl.innerHTML = cell;
                    cellEl.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
                    cellEl.style.border = '3px solid rgba(139, 92, 246, 0.2)';
                    cellEl.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.1)';
                }

                gridContainer.appendChild(cellEl);
            });
        });

        // Options row
        const optionsRow = document.createElement('div');
        optionsRow.style.display = 'flex';
        optionsRow.style.gap = '25px';
        optionsRow.style.justifyContent = 'center';
        optionsRow.style.padding = '25px';
        optionsRow.style.background = 'rgba(255, 255, 255, 0.5)';
        optionsRow.style.borderRadius = '25px';
        optionsRow.style.backdropFilter = 'blur(10px)';

        this.content.options.forEach((opt, index) => {
            const optEl = document.createElement('div');
            optEl.className = 'visual-option pop-in';
            optEl.innerHTML = opt.content;
            optEl.style.width = CELL_SIZE;
            optEl.style.height = CELL_SIZE;
            optEl.style.display = 'flex';
            optEl.style.justifyContent = 'center';
            optEl.style.alignItems = 'center';
            optEl.style.fontSize = CELL_FONT;
            optEl.style.cursor = 'pointer';
            optEl.style.borderRadius = '20px';
            optEl.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
            optEl.style.border = '3px solid rgba(99, 102, 241, 0.2)';
            optEl.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
            optEl.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            optEl.style.animationDelay = `${index * 0.15}s`;

            // Hover
            optEl.addEventListener('mouseenter', () => {
                SFX.playHover();
                optEl.style.transform = 'translateY(-8px) scale(1.08)';
                optEl.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.3)';
                optEl.style.borderColor = '#6366f1';
            });

            optEl.addEventListener('mouseleave', () => {
                optEl.style.transform = 'translateY(0) scale(1)';
                optEl.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
                optEl.style.borderColor = 'rgba(99, 102, 241, 0.2)';
            });

            // Click
            optEl.addEventListener('click', () => {
                SFX.playClick();
                if (opt.correct) {
                    this.handleCorrectChoice(optEl);
                } else {
                    this.handleWrongChoice(optEl);
                }
            });

            optionsRow.appendChild(optEl);
        });

        this.container.appendChild(gridContainer);
        this.container.appendChild(optionsRow);
    }

    handleCorrectChoice(optEl) {
        // Find question mark cell
        const questionCell = document.querySelector('.grid-cell[data-is-question="true"]');

        if (questionCell) {
            questionCell.innerHTML = optEl.innerHTML;
            questionCell.style.border = '4px solid #22c55e';
            questionCell.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
            questionCell.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.5)';
            questionCell.style.animation = 'successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            questionCell.style.color = '#000';
            questionCell.dataset.isQuestion = '';
        }

        // Highlight selected option
        optEl.style.border = '4px solid #22c55e';
        optEl.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        optEl.style.transform = 'scale(1.1)';

        // Disable all options
        document.querySelectorAll('.visual-option').forEach(item => {
            item.style.pointerEvents = 'none';
        });

        setTimeout(() => this.onSuccess(), 800);
    }

    handleWrongChoice(optEl) {
        optEl.style.animation = 'shake 0.5s';
        this.onFail();

        setTimeout(() => {
            optEl.style.animation = '';
        }, 500);
    }
}
