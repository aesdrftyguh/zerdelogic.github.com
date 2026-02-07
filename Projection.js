class ProjectionTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { layout: [[1,0],[1,1]], options: [[[1,0],[1,1]], ...], answerIndex: 1 }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.render();
    }

    render() {
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.gap = '30px';

        // 1. 3D View (Isometric Perspective)
        const scene = document.createElement('div');
        scene.style.width = '300px';
        scene.style.height = '300px';
        scene.style.perspective = '800px';
        scene.style.background = 'white';
        scene.style.borderRadius = '30px';
        scene.style.boxShadow = '0 15px 40px rgba(0,0,0,0.05)';
        scene.style.display = 'flex';
        scene.style.justifyContent = 'center';
        scene.style.alignItems = 'center';

        const world = document.createElement('div');
        world.style.transformStyle = 'preserve-3d';
        world.style.transform = 'rotateX(-30deg) rotateY(45deg)';
        scene.appendChild(world);

        const cubeSize = 40;
        this.content.layout.forEach((row, z) => {
            row.forEach((height, x) => {
                for (let y = 0; y < height; y++) {
                    const cube = this.createCube(cubeSize);
                    cube.style.transform = `translate3d(${x * cubeSize}px, ${-y * cubeSize}px, ${z * cubeSize}px)`;
                    world.appendChild(cube);
                }
            });
        });

        this.container.appendChild(scene);

        // 2. Question Text
        const qText = document.createElement('div');
        qText.textContent = 'Бұл фигураның ҮСТІНЕН КӨРІНІСІ (Top View) қайсысы?';
        qText.style.fontSize = '1.5rem';
        qText.style.fontWeight = 'bold';
        qText.style.color = '#334155';
        this.container.appendChild(qText);

        // 3. 2D Projections (Options)
        const optionsRow = document.createElement('div');
        optionsRow.style.display = 'flex';
        optionsRow.style.gap = '30px';

        this.content.options.forEach((opt, index) => {
            const btn = document.createElement('div');
            btn.className = 'glass-panel mc-option pop-in';
            btn.style.padding = '15px';
            btn.style.cursor = 'pointer';
            btn.style.transition = 'all 0.3s ease';
            btn.style.animationDelay = `${index * 0.1}s`;

            const grid = this.create2DGrid(opt, 25);
            btn.appendChild(grid);

            btn.onclick = (e) => {
                if (index === this.content.answerIndex) {
                    btn.style.border = '4px solid #22c55e';
                    btn.style.background = '#dcfce7';
                    this.onSuccess(btn); // Pass element for localized burst
                } else {
                    btn.classList.add('shake-anim');
                    SFX.playFail();
                    this.onFail();
                    setTimeout(() => btn.classList.remove('shake-anim'), 500);
                }
            };

            optionsRow.appendChild(btn);
        });

        this.container.appendChild(optionsRow);
    }

    createCube(size) {
        const cube = document.createElement('div');
        cube.style.position = 'absolute';
        cube.style.width = `${size}px`;
        cube.style.height = `${size}px`;
        cube.style.transformStyle = 'preserve-3d';

        const faces = ['front', 'back', 'top', 'bottom', 'left', 'right'];
        const colors = ['#f8fafc', '#f1f5f9', '#ffffff', '#e2e8f0', '#f1f5f9', '#cbd5e1'];

        faces.forEach((face, i) => {
            const f = document.createElement('div');
            f.style.position = 'absolute';
            f.style.width = '100%';
            f.style.height = '100%';
            f.style.background = colors[i];
            f.style.border = '1px solid #94a3b8';
            if (face === 'front') f.style.transform = `translateZ(${size / 2}px)`;
            if (face === 'back') f.style.transform = `rotateY(180deg) translateZ(${size / 2}px)`;
            if (face === 'top') f.style.transform = `rotateX(90deg) translateZ(${size / 2}px)`;
            if (face === 'bottom') f.style.transform = `rotateX(-90deg) translateZ(${size / 2}px)`;
            if (face === 'left') f.style.transform = `rotateY(-90deg) translateZ(${size / 2}px)`;
            if (face === 'right') f.style.transform = `rotateY(90deg) translateZ(${size / 2}px)`;
            cube.appendChild(f);
        });
        return cube;
    }

    create2DGrid(layout, tileSize) {
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = `repeat(${layout[0].length}, ${tileSize}px)`;
        grid.style.gap = '3px';

        layout.forEach(row => {
            row.forEach(cell => {
                const c = document.createElement('div');
                c.style.width = `${tileSize}px`;
                c.style.height = `${tileSize}px`;
                c.style.borderRadius = '4px';
                c.style.background = cell > 0 ? '#6366f1' : '#f1f5f9';
                c.style.border = cell > 0 ? 'none' : '1px solid #e2e8f0';
                grid.appendChild(c);
            });
        });
        return grid;
    }
}
