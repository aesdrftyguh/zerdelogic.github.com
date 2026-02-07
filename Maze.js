class MazeTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { grid: [[0,1,0],[0,0,0]], start: [0,0], end: [1,2], emoji: '🐱', target: '🐟' }
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
        this.container.style.background = 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)';

        const mazeGrid = document.createElement('div');
        mazeGrid.style.display = 'grid';

        // Responsive cell size calculation
        const cols = this.content.grid[0].length;
        const cellSize = `clamp(30px, ${80 / cols}vw, 65px)`;

        mazeGrid.style.gridTemplateColumns = `repeat(${cols}, ${cellSize})`;
        mazeGrid.style.gridTemplateRows = `repeat(${this.content.grid.length}, ${cellSize})`;
        mazeGrid.style.gap = '4px';
        mazeGrid.style.padding = '8px';
        mazeGrid.style.background = '#92400e';
        mazeGrid.style.borderRadius = '15px';
        mazeGrid.style.boxShadow = '0 10px 30px rgba(146, 64, 14, 0.3)';

        this.cells = [];

        this.content.grid.forEach((row, rIdx) => {
            this.cells[rIdx] = [];
            row.forEach((cell, cIdx) => {
                const div = document.createElement('div');
                div.style.width = cellSize;
                div.style.height = cellSize;
                div.style.borderRadius = '6px';
                div.style.display = 'flex';
                div.style.justifyContent = 'center';
                div.style.alignItems = 'center';
                div.style.fontSize = `calc(${cellSize} * 0.65)`;

                if (cell === 1) { // Wall
                    div.style.background = '#713f12';
                    div.style.boxShadow = 'inset 0 0 10px rgba(0,0,0,0.5)';
                } else { // Path
                    div.style.background = '#fde68a';
                    div.style.cursor = 'pointer';
                    div.onclick = () => this.moveTo(rIdx, cIdx);
                }

                div.style.pointerEvents = 'auto'; // Ensure div is clickable
                div.innerHTML = `<span style="pointer-events: none;">${rIdx === this.content.start[0] && cIdx === this.content.start[1] ? this.content.emoji : (rIdx === this.content.end[0] && cIdx === this.content.end[1] ? this.content.target : '')}</span>`;

                if (rIdx === this.content.start[0] && cIdx === this.content.start[1]) {
                    div.id = 'maze-player';
                    div.style.cursor = 'grab';
                    this.playerPos = [...this.content.start];
                    this.setupDrag(div);
                }

                mazeGrid.appendChild(div);
                this.cells[rIdx][cIdx] = div;
            });
        });

        this.container.appendChild(mazeGrid);
    }

    moveTo(r, c) {
        if (!this.playerPos) return;
        const dr = Math.abs(r - this.playerPos[0]);
        const dc = Math.abs(c - this.playerPos[1]);

        if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
            if (this.content.grid[r][c] === 0) {
                // Clear old
                this.cells[this.playerPos[0]][this.playerPos[1]].querySelector('span').textContent = '';

                // Set new
                this.playerPos[0] = r;
                this.playerPos[1] = c;
                this.cells[r][c].querySelector('span').textContent = this.content.emoji;

                if (window.SFX) SFX.playTone(400 + (r + c) * 30, 'sine', 0.05);

                // Win check
                if (r === this.content.end[0] && c === this.content.end[1]) {
                    this.isDragging = false;
                    if (window.SFX) SFX.playWin();
                    this.updateMascot('🥰', 'happy-anim');
                    setTimeout(() => this.onSuccess(), 1000);
                }
                return true;
            }
        }
        return false;
    }

    setupDrag(el) {
        this.isDragging = false;

        const onStart = (e) => {
            e.preventDefault();
            this.isDragging = true;
            if (window.SFX) SFX.playClick();
        };

        const onMove = (e) => {
            if (!this.isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const target = document.elementFromPoint(clientX, clientY);
            if (!target) return;

            // Find cell index
            let targetR = -1;
            let targetC = -1;
            this.cells.forEach((row, r) => {
                row.forEach((cell, c) => {
                    if (cell === target || cell.contains(target)) {
                        targetR = r;
                        targetC = c;
                    }
                });
            });

            if (targetR !== -1 && targetC !== -1) {
                this.moveTo(targetR, targetC);
            }
        };

        const onEnd = () => {
            this.isDragging = false;
        };

        el.addEventListener('mousedown', onStart);
        el.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('mousemove', onMove);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchend', onEnd);
    }

    updateMascot(emoji, anim) {
        const mascotImg = document.querySelector('#mascot-img');
        if (mascotImg) {
            mascotImg.textContent = emoji;
            mascotImg.className = anim;
        }
    }
}
