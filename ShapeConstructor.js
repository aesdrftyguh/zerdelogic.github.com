class ShapeConstructorTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.placedCount = 0;
        this.totalSlots = content.blueprint.slots.length;
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.justifyContent = 'space-around';
        this.container.style.alignItems = 'center';
        this.container.style.padding = '20px';

        // 1. Blueprint Area (The "Ghost" House)
        const blueprintArea = document.createElement('div');
        blueprintArea.className = 'glass-panel pop-in';
        blueprintArea.style.position = 'relative';
        blueprintArea.style.width = this.content.blueprint.width || '400px';
        blueprintArea.style.height = this.content.blueprint.height || '400px';
        blueprintArea.style.background = 'rgba(255, 255, 255, 0.4)';
        blueprintArea.style.borderRadius = '40px';
        blueprintArea.style.overflow = 'visible';

        // Render Slots
        this.content.blueprint.slots.forEach(slot => {
            const slotEl = document.createElement('div');
            slotEl.className = 'shape-slot';
            slotEl.dataset.id = slot.id;
            slotEl.dataset.shape = slot.shape;

            slotEl.style.position = 'absolute';
            slotEl.style.left = slot.x;
            slotEl.style.top = slot.y;
            slotEl.style.width = slot.size;
            slotEl.style.height = slot.size;
            slotEl.style.display = 'flex';
            slotEl.style.justifyContent = 'center';
            slotEl.style.alignItems = 'center';
            slotEl.style.transition = 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';

            // Visual outline of the shape
            slotEl.innerHTML = this.renderShapeSVG(slot.shape, 'rgba(0,0,0,0.08)', slot.size, true);

            this.enableDrop(slotEl);
            blueprintArea.appendChild(slotEl);
        });

        // 2. Parts Area (The blocks to drag)
        const partsContainer = document.createElement('div');
        partsContainer.className = 'glass-panel pop-in';
        partsContainer.style.display = 'flex';
        partsContainer.style.gap = '25px';
        partsContainer.style.padding = '25px';
        partsContainer.style.marginTop = '40px';
        partsContainer.style.borderRadius = '30px';
        partsContainer.style.justifyContent = 'center';
        partsContainer.style.boxShadow = '0 10px 40px rgba(0,0,0,0.05)';

        this.content.parts.forEach(part => {
            const partEl = document.createElement('div');
            partEl.className = 'draggable-shape';
            partEl.draggable = true;
            partEl.dataset.id = part.id;
            partEl.dataset.shape = part.shape;
            partEl.dataset.color = part.color || '#6366f1';

            partEl.style.width = '100px';
            partEl.style.height = '100px';
            partEl.style.display = 'flex';
            partEl.style.justifyContent = 'center';
            partEl.style.alignItems = 'center';
            partEl.style.cursor = 'grab';
            partEl.style.transition = 'transform 0.2s';

            partEl.innerHTML = this.renderShapeSVG(part.shape, partEl.dataset.color, '80px');

            this.enableDrag(partEl);
            partsContainer.appendChild(partEl);
        });

        this.container.appendChild(blueprintArea);
        this.container.appendChild(partsContainer);
    }

    renderShapeSVG(shape, color, size, isOutline = false) {
        const s = parseInt(size);
        let content = '';
        // Blueprint outline style: primary blue dashed
        const strokeColor = isOutline ? 'rgba(99, 102, 241, 0.4)' : color;
        const stroke = isOutline ? `stroke="${strokeColor}" stroke-width="4" stroke-dasharray="10,5" fill="none"` : `fill="${color}"`;

        if (shape === 'square') {
            content = `<rect x="5" y="5" width="${s - 10}" height="${s - 10}" rx="25" ${stroke} />`;
        } else if (shape === 'triangle') {
            // High-quality rounded triangle
            const p = 15; // padding
            const d = `M ${s / 2} ${p} L ${s - p} ${s - p} L ${p} ${s - p} Z`;

            if (isOutline) {
                content = `<path d="${d}" ${stroke} stroke-linejoin="round" />`;
            } else {
                // Rounding via stroke trick for solid shapes - but thinner to avoid 'outer' look
                content = `<path d="${d}" fill="${color}" stroke="${color}" stroke-width="15" stroke-linejoin="round" />`;
            }
        } else if (shape === 'circle') {
            content = `<circle cx="${s / 2}" cy="${s / 2}" r="${s / 2 - 10}" ${stroke} />`;
        } else if (shape === 'rect') {
            content = `<rect x="5" y="15" width="${s - 10}" height="${s - 30}" rx="20" ${stroke} />`;
        }

        return `<svg width="${size}" height="${size}" viewBox="0 0 ${s} ${s}" style="overflow: visible; filter: ${isOutline ? 'none' : 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'}">
                    ${content}
                </svg>`;
    }

    enableDrag(el) {
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            el.style.opacity = '0.5';
            el.style.transform = 'scale(0.8)';
            window.draggedShape = el;
            SFX.playClick();
        });

        el.addEventListener('dragend', () => {
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
        });
    }

    enableDrop(slotEl) {
        slotEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            slotEl.style.transform = 'scale(1.1)';
        });

        slotEl.addEventListener('dragleave', () => {
            slotEl.style.transform = 'scale(1)';
        });

        slotEl.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedEl = window.draggedShape;

            if (draggedEl && (draggedEl.dataset.id === slotEl.dataset.id || draggedEl.dataset.shape === slotEl.dataset.shape)) {
                // Correct!
                const color = draggedEl.dataset.color;
                slotEl.innerHTML = this.renderShapeSVG(slotEl.dataset.shape, color, slotEl.style.width);
                slotEl.style.transform = 'scale(1) rotate(360deg)';

                draggedEl.style.visibility = 'hidden';
                draggedEl.draggable = false;

                this.placedCount++;
                SFX.playHover();

                if (this.placedCount === this.totalSlots) {
                    setTimeout(() => this.onSuccess(slotEl), 500);
                }
            } else {
                // Wrong
                this.onFail();
                slotEl.style.filter = 'drop-shadow(0 0 10px rgba(239, 68, 68, 0.5))';
                setTimeout(() => {
                    slotEl.style.filter = 'none';
                }, 500);
            }
            slotEl.style.transform = 'scale(1)';
            window.draggedShape = null;
        });
    }
}
