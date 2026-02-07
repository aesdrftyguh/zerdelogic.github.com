class SequenceTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content;
        // content.sequence: [{content:'A'}, {content:'B'}, {content:'A'}, {id:'zone', isZone:true}]
        // content.options: [{id:'o1', content:'B', type:'correct'}, {id:'o2', content:'C', type:'wrong'}]
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.render(); // Required by TaskRunner (see line 44)
    }

    render() {
        this.container.style.width = '100%';
        this.container.style.height = '100%'; // Full height
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
        this.container.style.gap = '80px';
        this.container.style.padding = '40px';
        this.container.style.boxSizing = 'border-box'; // Keeps padding inside 100%

        // Unified size for all items
        const ITEM_SIZE = '120px';
        const ITEM_FONT = '5.5rem';

        // 1. Render The Pattern/Sequence Row with premium design
        const sequenceRow = document.createElement('div');
        sequenceRow.className = 'sequence-row';
        sequenceRow.style.display = 'flex';
        sequenceRow.style.gap = '24px';
        sequenceRow.style.padding = '40px 50px';
        sequenceRow.style.background = 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)';
        sequenceRow.style.borderRadius = '35px';
        sequenceRow.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)';
        sequenceRow.style.alignItems = 'center';
        sequenceRow.style.border = '3px solid rgba(255,255,255,0.8)';
        sequenceRow.style.position = 'relative';

        // Add subtle glow effect
        sequenceRow.style.filter = 'drop-shadow(0 0 20px rgba(102, 126, 234, 0.1))';

        this.content.sequence.forEach((item, index) => {
            const el = document.createElement('div');
            el.style.width = ITEM_SIZE;
            el.style.height = ITEM_SIZE;
            el.style.display = 'flex';
            el.style.justifyContent = 'center';
            el.style.alignItems = 'center';
            el.style.borderRadius = '25px';
            el.style.fontSize = ITEM_FONT;
            el.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            el.style.position = 'relative';

            if (item.isZone) {
                // Drop zone with attractive dashed border - SAME SIZE
                el.className = 'drop-zone pop-in';
                el.style.border = '5px dashed #a78bfa';
                el.style.background = 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)';
                el.style.boxShadow = 'inset 0 2px 8px rgba(167, 139, 250, 0.2)';
                el.dataset.accept = JSON.stringify(item.accept);

                // Add pulsing animation to drop zone
                el.style.animation = 'zonePulse 2s ease-in-out infinite';

                this.enableDrop(el);
            } else {
                // Static item with gradient background - SAME SIZE
                el.className = 'sequence-item pop-in';
                el.innerHTML = item.content;
                el.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)';
                el.style.border = '3px solid #e0e7ff';
                el.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';

                // Add hover effect
                el.addEventListener('mouseenter', () => {
                    el.style.transform = 'translateY(-5px) scale(1.05)';
                    el.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.25)';
                });
                el.addEventListener('mouseleave', () => {
                    el.style.transform = 'translateY(0) scale(1)';
                    el.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';
                });
            }

            // Add stagger animation delay
            el.style.animationDelay = `${index * 0.1}s`;

            sequenceRow.appendChild(el);
        });

        // 2. Render Options Row with card-style design
        const optionsRow = document.createElement('div');
        optionsRow.className = 'options-row';
        optionsRow.style.display = 'flex';
        optionsRow.style.gap = '30px';
        optionsRow.style.justifyContent = 'center';
        optionsRow.style.padding = '20px';
        optionsRow.style.background = 'rgba(255, 255, 255, 0.4)';
        optionsRow.style.borderRadius = '30px';
        optionsRow.style.backdropFilter = 'blur(10px)';

        this.content.options.forEach((opt, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'draggable-item pop-in';
            itemEl.draggable = true;
            itemEl.dataset.type = opt.type;
            itemEl.innerHTML = opt.content;
            itemEl.style.fontSize = ITEM_FONT; // SAME FONT SIZE
            itemEl.style.padding = '0'; // Removed padding to make width/height exact
            itemEl.style.width = ITEM_SIZE; // SAME SIZE AS ZONE
            itemEl.style.height = ITEM_SIZE; // SAME SIZE AS ZONE
            itemEl.style.display = 'flex';
            itemEl.style.justifyContent = 'center';
            itemEl.style.alignItems = 'center';
            itemEl.style.cursor = 'grab';
            itemEl.style.borderRadius = '25px'; // SAME RADIUS
            itemEl.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
            itemEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.8)';
            itemEl.style.border = '3px solid rgba(99, 102, 241, 0.2)';
            itemEl.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            itemEl.style.animationDelay = `${index * 0.15}s`;
            itemEl.style.position = 'relative';

            // Add shine effect
            const shine = document.createElement('div');
            shine.style.position = 'absolute';
            shine.style.top = '0';
            shine.style.left = '0';
            shine.style.right = '0';
            shine.style.height = '50%';
            shine.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)';
            shine.style.borderRadius = '25px 25px 0 0';
            shine.style.pointerEvents = 'none';
            itemEl.appendChild(shine);

            // Hover effects
            itemEl.addEventListener('mouseenter', () => {
                itemEl.style.transform = 'translateY(-8px) scale(1.08)';
                itemEl.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.3)';
                itemEl.style.borderColor = '#6366f1';
            });

            itemEl.addEventListener('mouseleave', () => {
                itemEl.style.transform = 'translateY(0) scale(1)';
                itemEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
                itemEl.style.borderColor = 'rgba(99, 102, 241, 0.2)';
            });

            this.enableDrag(itemEl);
            optionsRow.appendChild(itemEl);
        });

        this.container.appendChild(sequenceRow);
        this.container.appendChild(optionsRow);

        // Add CSS animation for zone pulse
        if (!document.getElementById('sequence-animations')) {
            const style = document.createElement('style');
            style.id = 'sequence-animations';
            style.textContent = `
                @keyframes zonePulse {
                    0%, 100% {
                        border-color: #a78bfa;
                        box-shadow: inset 0 2px 8px rgba(167, 139, 250, 0.2);
                    }
                    50% {
                        border-color: #8b5cf6;
                        box-shadow: inset 0 2px 8px rgba(167, 139, 250, 0.4), 0 0 20px rgba(139, 92, 246, 0.3);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    enableDrag(el) {
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', el.dataset.type);
            e.dataTransfer.effectAllowed = 'move';
            el.style.opacity = '0.5';
            el.style.transform = 'scale(0.9) rotate(5deg)';
            el.style.cursor = 'grabbing';
            window.draggedElement = el;
            SFX.playClick(); // Sound feedback
        });

        el.addEventListener('dragend', (e) => {
            el.style.opacity = '1';
            el.style.transform = 'scale(1) rotate(0deg)';
            el.style.cursor = 'grab';
            window.draggedElement = null;
        });
    }

    enableDrop(zone) {
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
            zone.style.transform = 'scale(1.15)';
            zone.style.borderColor = '#8b5cf6';
            zone.style.background = 'linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%)';
            zone.style.boxShadow = 'inset 0 2px 12px rgba(139, 92, 246, 0.3), 0 0 30px rgba(139, 92, 246, 0.4)';
        });

        zone.addEventListener('dragleave', () => {
            zone.style.transform = 'scale(1)';
            zone.style.borderColor = '#a78bfa';
            zone.style.background = 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)';
            zone.style.boxShadow = 'inset 0 2px 8px rgba(167, 139, 250, 0.2)';
        });

        zone.addEventListener('drop', (e) => {
            e.preventDefault();
            zone.style.transform = 'scale(1)';

            const type = e.dataTransfer.getData('text/plain');
            const acceptedTypes = JSON.parse(zone.dataset.accept);

            if (acceptedTypes.includes(type)) {
                this.handleCorrectDrop(zone);
            } else {
                this.onFail();
                // Reset zone appearance
                zone.style.borderColor = '#a78bfa';
                zone.style.background = 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)';
                zone.style.boxShadow = 'inset 0 2px 8px rgba(167, 139, 250, 0.2)';
            }
        });
    }

    handleCorrectDrop(zone) {
        const el = window.draggedElement;
        if (el) {
            // Success visual with celebration
            zone.innerHTML = el.innerHTML;
            zone.style.border = '5px solid #22c55e';
            zone.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
            zone.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.5), inset 0 2px 12px rgba(34, 197, 94, 0.3)';
            zone.style.animation = 'successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

            // Remove the dragged item with fade out
            el.style.transition = 'all 0.3s ease';
            el.style.opacity = '0';
            el.style.transform = 'scale(0.5)';
            setTimeout(() => el.style.visibility = 'hidden', 300);

            // Add success animation
            if (!document.getElementById('success-pop-animation')) {
                const style = document.createElement('style');
                style.id = 'success-pop-animation';
                style.textContent = `
                    @keyframes successPop {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.2); }
                        100% { transform: scale(1); }
                    }
                `;
                document.head.appendChild(style);
            }

            // Win after animation
            setTimeout(() => this.onSuccess(), 600);
        }
    }
}
