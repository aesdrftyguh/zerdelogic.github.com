// Template for Spatial Reasoning tasks (Rotation/Mirror)
class SpatialTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { original, options: [{content, correct, transform}] }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.render();
    }

    render() {
        this.container.classList.add('task-spatial-container');

        const ITEM_SIZE = 'clamp(100px, 20vw, 160px)';
        const ITEM_FONT = 'clamp(4rem, 10vw, 7rem)';

        // Original item with label
        const originalSection = document.createElement('div');
        originalSection.style.display = 'flex';
        originalSection.style.flexDirection = 'column';
        originalSection.style.alignItems = 'center';
        originalSection.style.gap = '20px';

        const label = document.createElement('div');
        label.textContent = 'Түпнұсқа';
        label.style.fontSize = '1.5rem';
        label.style.fontWeight = 'bold';
        label.style.color = '#6366f1';

        const originalItem = document.createElement('div');
        originalItem.className = 'pop-in';
        originalItem.innerHTML = this.content.original;
        originalItem.style.width = ITEM_SIZE;
        originalItem.style.height = ITEM_SIZE;
        originalItem.style.display = 'flex';
        originalItem.style.justifyContent = 'center';
        originalItem.style.alignItems = 'center';
        originalItem.style.fontSize = ITEM_FONT;
        originalItem.style.borderRadius = '30px';
        originalItem.style.background = 'var(--primary-gradient)';
        originalItem.style.boxShadow = '0 15px 40px rgba(245, 158, 11, 0.4)';
        originalItem.style.border = '5px solid #ffffff';
        originalItem.style.color = '#ffffff';

        originalSection.appendChild(label);
        originalSection.appendChild(originalItem);

        // Options row
        const optionsLabel = document.createElement('div');
        optionsLabel.textContent = 'Қайсысы дұрыс?';
        optionsLabel.style.fontSize = '1.5rem';
        optionsLabel.style.fontWeight = 'bold';
        optionsLabel.style.color = '#64748b';

        const optionsRow = document.createElement('div');
        optionsRow.classList.add('spatial-options-row');

        this.content.options.forEach((opt, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'spatial-option pop-in';
            itemEl.innerHTML = opt.content;
            itemEl.style.fontSize = ITEM_FONT;
            itemEl.style.width = ITEM_SIZE;
            itemEl.style.height = ITEM_SIZE;
            itemEl.style.display = 'flex';
            itemEl.style.justifyContent = 'center';
            itemEl.style.alignItems = 'center';
            itemEl.style.cursor = 'pointer';
            itemEl.style.borderRadius = '30px';
            itemEl.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)';
            itemEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
            itemEl.style.border = '3px solid rgba(99, 102, 241, 0.2)';
            itemEl.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            itemEl.style.animationDelay = `${index * 0.15}s`;
            itemEl.style.position = 'relative';

            // Apply transform if specified
            if (opt.transform) {
                itemEl.style.transform = opt.transform;
            }

            // Shine effect
            const shine = document.createElement('div');
            shine.style.position = 'absolute';
            shine.style.top = '0';
            shine.style.left = '0';
            shine.style.right = '0';
            shine.style.height = '50%';
            shine.style.background = 'linear-gradient(180deg, rgba(255,255,255,0.6) 0%, transparent 100%)';
            shine.style.borderRadius = '30px 30px 0 0';
            shine.style.pointerEvents = 'none';
            itemEl.appendChild(shine);

            // Hover
            itemEl.addEventListener('mouseenter', () => {
                SFX.playHover();
                itemEl.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.3)';
                itemEl.style.borderColor = '#6366f1';
            });

            itemEl.addEventListener('mouseleave', () => {
                if (!itemEl.dataset.selected) {
                    itemEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
                    itemEl.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                }
            });

            // Click
            itemEl.addEventListener('click', () => {
                SFX.playClick();
                if (opt.correct) {
                    this.handleCorrectChoice(itemEl);
                } else {
                    this.handleWrongChoice(itemEl);
                }
            });

            optionsRow.appendChild(itemEl);
        });

        this.container.appendChild(originalSection);
        this.container.appendChild(optionsLabel);
        this.container.appendChild(optionsRow);
    }

    handleCorrectChoice(el) {
        el.style.border = '5px solid #22c55e';
        el.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        el.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.5)';
        el.dataset.selected = 'true';

        // Disable all
        document.querySelectorAll('.spatial-option').forEach(item => {
            item.style.pointerEvents = 'none';
        });

        setTimeout(() => this.onSuccess(), 800);
    }

    handleWrongChoice(el) {
        el.style.animation = 'shake 0.5s';
        this.onFail();

        setTimeout(() => {
            el.style.animation = '';
        }, 500);
    }
}
