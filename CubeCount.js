class CubeCountTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { layout: [[1,0],[1,1]], answer: 3, options: [2,3,4] }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.isXray = false;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.alignItems = 'center';
        this.container.style.justifyContent = 'center';
        this.container.style.gap = '40px';

        // Scene for 3D
        const scene = document.createElement('div');
        scene.id = 'cube-scene';
        scene.style.position = 'relative';
        scene.style.width = '400px';
        scene.style.height = '400px';
        scene.style.perspective = '1000px';
        scene.style.display = 'flex';
        scene.style.alignItems = 'center';
        scene.style.justifyContent = 'center';

        const world = document.createElement('div');
        world.style.position = 'relative';
        world.style.transformStyle = 'preserve-3d';
        world.style.transform = 'rotateX(-30deg) rotateY(45deg)';
        world.style.transition = 'transform 0.5s ease';
        scene.appendChild(world);

        // Render cubes from layout (array of heights e.g. [[1,2],[0,1]])
        const layout = this.content.layout;
        const cubeSize = 60;

        layout.forEach((row, z) => {
            row.forEach((height, x) => {
                for (let y = 0; y < height; y++) {
                    const cube = this.createCube(cubeSize);
                    cube.style.transform = `translate3d(${x * cubeSize}px, ${-y * cubeSize}px, ${z * cubeSize}px)`;
                    world.appendChild(cube);
                }
            });
        });

        this.container.appendChild(scene);

        // X-Ray Button
        const xrayBtn = document.createElement('button');
        xrayBtn.innerHTML = 'Рентген 🔍';
        xrayBtn.className = 'glass-button primary';
        xrayBtn.style.margin = '0 auto';
        xrayBtn.onclick = () => this.toggleXray();
        this.container.appendChild(xrayBtn);

        // Options
        const optionsContainer = document.createElement('div');
        optionsContainer.style.display = 'flex';
        optionsContainer.style.gap = '20px';

        this.content.options.forEach(opt => {
            const btn = document.createElement('div');
            btn.className = 'glass-panel mc-option';
            btn.style.padding = '20px 40px';
            btn.style.fontSize = '2rem';
            btn.style.cursor = 'pointer';
            btn.textContent = opt;
            btn.onclick = () => {
                if (opt === this.content.answer) {
                    this.onSuccess(btn);
                } else {
                    this.onFail();
                    btn.classList.add('shake-anim');
                    setTimeout(() => btn.classList.remove('shake-anim'), 500);
                }
            };
            optionsContainer.appendChild(btn);
        });

        this.container.appendChild(optionsContainer);
        this.world = world;
    }

    createCube(size) {
        const cube = document.createElement('div');
        cube.style.position = 'absolute';
        cube.style.width = `${size}px`;
        cube.style.height = `${size}px`;
        cube.style.transformStyle = 'preserve-3d';
        cube.className = 'scene-cube';

        const faces = ['front', 'back', 'top', 'bottom', 'left', 'right'];
        const colors = ['#f8fafc', '#f1f5f9', '#ffffff', '#e2e8f0', '#f1f5f9', '#cbd5e1'];

        faces.forEach((face, i) => {
            const f = document.createElement('div');
            f.style.position = 'absolute';
            f.style.width = '100%';
            f.style.height = '100%';
            f.style.background = colors[i];
            f.style.border = '2px solid #94a3b8';
            f.style.opacity = '1';
            f.style.transition = 'opacity 0.3s, background 0.3s';
            f.className = 'cube-face';

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

    toggleXray() {
        this.isXray = !this.isXray;
        SFX.playClick();
        const faces = this.container.querySelectorAll('.cube-face');
        faces.forEach(f => {
            f.style.opacity = this.isXray ? '0.3' : '1';
            if (this.isXray) f.style.background = '#3b82f633';
            else {
                // Restore original colors logic if needed, or just let CSS transition
            }
        });

        if (this.isXray) {
            setTimeout(() => this.toggleXray(), 1500); // Auto-off after 1.5s
        }
    }
}
