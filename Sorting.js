class SortingTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.itemCount = content.items.length;
        this.placedCount = 0;
        this.render(); // Required by TaskRunner (see line 44)
    }

    render() {
        this.container.style.width = '100%';
        this.container.style.height = '100%'; // Full height again
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.justifyContent = 'space-between';
        this.container.style.boxSizing = 'border-box';

        // 1. Render Drop Zones (Bigger!)
        const zonesContainer = document.createElement('div');
        zonesContainer.className = 'sorting-zones';
        zonesContainer.style.display = 'flex';
        zonesContainer.style.justifyContent = 'center';
        zonesContainer.style.gap = '60px'; /* Bigger gap */
        zonesContainer.style.width = '100%';
        zonesContainer.style.marginTop = '40px';

        this.content.zones.forEach(zone => {
            const zoneEl = document.createElement('div');
            zoneEl.className = 'glass-panel drop-zone';
            zoneEl.dataset.id = zone.id;
            zoneEl.dataset.accept = JSON.stringify(zone.accept);

            zoneEl.innerHTML = `
                <div style="font-size: 5rem; margin-bottom: 24px;">${zone.icon}</div>
                <div style="font-weight: 800; font-size: 1.5rem; color: #4b5563;">${zone.label}</div>
            `;

            // Flex styles for zone
            zoneEl.style.width = '180px';
            zoneEl.style.height = '240px';
            zoneEl.style.display = 'flex';
            zoneEl.style.flexDirection = 'column';
            zoneEl.style.alignItems = 'center';
            zoneEl.style.justifyContent = 'center';
            zoneEl.style.transition = 'transform 0.2s, border 0.2s';
            zoneEl.style.background = 'white';
            zoneEl.style.border = '2px dashed #cbd5e1';
            zoneEl.style.borderRadius = '20px';

            this.enableDrop(zoneEl);
            zonesContainer.appendChild(zoneEl);
        });

        // 2. Render Draggable Items (Bigger!)
        const itemsContainer = document.createElement('div');
        itemsContainer.className = 'sorting-items';
        itemsContainer.style.display = 'flex';
        itemsContainer.style.gap = '40px';
        itemsContainer.style.justifyContent = 'center';
        itemsContainer.style.padding = '40px';
        itemsContainer.style.background = 'rgba(255,255,255,0.5)'; // Slight shelf background
        itemsContainer.style.borderRadius = '30px';
        itemsContainer.style.alignSelf = 'center';

        this.content.items.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'glass-button draggable-item pop-in';
            itemEl.draggable = true;
            itemEl.dataset.type = item.type;
            itemEl.innerHTML = item.content;
            itemEl.style.fontSize = '4rem'; /* Huge icons */
            itemEl.style.padding = '20px';
            itemEl.style.width = '100px';
            itemEl.style.height = '100px';
            itemEl.style.display = 'flex';
            itemEl.style.justifyContent = 'center';
            itemEl.style.alignItems = 'center';
            itemEl.style.cursor = 'grab';
            itemEl.style.background = 'white';
            itemEl.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            itemEl.style.borderRadius = '24px';

            this.enableDrag(itemEl);
            itemsContainer.appendChild(itemEl);
        });

        this.container.appendChild(zonesContainer);
        this.container.appendChild(itemsContainer);
    }

    enableDrag(el) {
        // Desktop Drag
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', el.dataset.type);
            window.draggedElement = el;
            el.style.opacity = '0.4';
        });

        el.addEventListener('dragend', () => {
            el.style.opacity = '1';
            window.draggedElement = null;
        });

        // Touch Drag
        el.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.touchStartX = touch.clientX;
            this.touchStartY = touch.clientY;
            window.draggedElement = el;
            el.style.opacity = '0.5';

            // Create ghost for visual feedback if needed
            this.activeTouchElement = el;
        }, { passive: false });

        el.addEventListener('touchmove', (e) => {
            if (!this.activeTouchElement) return;
            e.preventDefault();
            const touch = e.touches[0];

            // Find underlying element
            const target = document.elementFromPoint(touch.clientX, touch.clientY);
            this.lastTouchTarget = target;

            // Highlight potential zones
            const zones = this.container.querySelectorAll('.drop-zone');
            zones.forEach(z => {
                if (z.contains(target) || z === target) {
                    z.style.transform = 'scale(1.05)';
                    z.style.borderColor = '#fbbf24';
                    z.style.background = '#fef3c7';
                } else {
                    z.style.transform = 'scale(1)';
                    z.style.borderColor = '#cbd5e1';
                    z.style.background = 'white';
                }
            });
        }, { passive: false });

        el.addEventListener('touchend', (e) => {
            if (!this.activeTouchElement) return;
            el.style.opacity = '1';

            const target = this.lastTouchTarget;
            const zone = target ? target.closest('.drop-zone') : null;

            if (zone) {
                const type = el.dataset.type;
                const acceptedTypes = JSON.parse(zone.dataset.accept);
                if (acceptedTypes.includes(type)) {
                    this.handleCorrectDrop(zone);
                } else {
                    this.onFail();
                }
            }

            // Cleanup
            const zones = this.container.querySelectorAll('.drop-zone');
            zones.forEach(z => {
                z.style.transform = 'scale(1)';
                z.style.borderColor = '#cbd5e1';
                z.style.background = 'white';
            });

            this.activeTouchElement = null;
            window.draggedElement = null;
        });
    }

    enableDrop(zone) {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.transform = 'scale(1.05)';
            zone.style.borderColor = '#fbbf24';
            zone.style.background = '#fef3c7';
        });

        zone.addEventListener('dragleave', () => {
            zone.style.transform = 'scale(1)';
            zone.style.borderColor = '#cbd5e1';
            zone.style.background = 'white';
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.transform = 'scale(1)';
            zone.style.borderColor = '#cbd5e1';
            zone.style.background = 'white';

            const type = e.dataTransfer.getData('text/plain');
            const acceptedTypes = JSON.parse(zone.dataset.accept);

            if (acceptedTypes.includes(type)) {
                this.handleCorrectDrop(zone);
            } else {
                this.onFail();
            }
        });
    }

    handleCorrectDrop(zone) {
        const el = window.draggedElement;
        if (el) {
            el.remove();
            const clone = document.createElement('div');
            clone.innerHTML = el.innerHTML;
            clone.style.fontSize = 'clamp(1.5rem, 5vw, 3rem)'; // Responsive icons inside
            clone.classList.add('pop-in');
            zone.appendChild(clone);
            this.placedCount++;
            if (window.SFX) SFX.playClick();
            if (this.placedCount === this.itemCount) {
                setTimeout(() => this.onSuccess(), 500);
            }
        }
    }
}
