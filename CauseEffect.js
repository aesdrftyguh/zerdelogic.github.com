// Template for Cause and Effect tasks
class CauseEffectTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { pairs: [{cause, effect, correct}] }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.selectedCause = null;
        this.matchedPairs = 0;
        this.totalPairs = content.pairs.length;
        this.render();
    }

    render() {
        this.container.style.width = '100%';
        this.container.style.height = '100%';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
        this.container.style.gap = '60px';
        this.container.style.padding = '40px';

        const ITEM_SIZE = '140px';
        const ITEM_FONT = '5.5rem';

        // Create two columns: Causes and Effects
        const columnsContainer = document.createElement('div');
        columnsContainer.style.display = 'flex';
        columnsContainer.style.gap = '80px';
        columnsContainer.style.alignItems = 'center';

        // Left column: Causes (SHUFFLED!)
        const causesColumn = document.createElement('div');
        causesColumn.style.display = 'flex';
        causesColumn.style.flexDirection = 'column';
        causesColumn.style.gap = '25px';
        causesColumn.style.padding = '30px';
        causesColumn.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
        causesColumn.style.borderRadius = '30px';
        causesColumn.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';

        const causeTitle = document.createElement('div');
        causeTitle.textContent = 'Себеп';
        causeTitle.style.fontSize = '1.5rem';
        causeTitle.style.fontWeight = 'bold';
        causeTitle.style.textAlign = 'center';
        causeTitle.style.color = '#92400e';
        causesColumn.appendChild(causeTitle);

        // Shuffle causes
        const shuffledCauses = [...this.content.pairs].sort(() => Math.random() - 0.5);

        shuffledCauses.forEach((pair, displayIndex) => {
            const originalIndex = this.content.pairs.indexOf(pair);
            const causeEl = this.createItem(pair.cause, ITEM_SIZE, ITEM_FONT, displayIndex, 'cause');
            causeEl.dataset.pairId = originalIndex;
            causeEl.addEventListener('click', () => this.selectCause(causeEl, originalIndex));
            causesColumn.appendChild(causeEl);
        });

        // Arrow
        const arrow = document.createElement('div');
        arrow.innerHTML = '→';
        arrow.style.fontSize = '6rem';
        arrow.style.color = '#8b5cf6';
        arrow.style.fontWeight = 'bold';

        // Right column: Effects (SHUFFLED!)
        const effectsColumn = document.createElement('div');
        effectsColumn.style.display = 'flex';
        effectsColumn.style.flexDirection = 'column';
        effectsColumn.style.gap = '25px';
        effectsColumn.style.padding = '30px';
        effectsColumn.style.background = 'linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)';
        effectsColumn.style.borderRadius = '30px';
        effectsColumn.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';

        const effectTitle = document.createElement('div');
        effectTitle.textContent = 'Салдар';
        effectTitle.style.fontSize = '1.5rem';
        effectTitle.style.fontWeight = 'bold';
        effectTitle.style.textAlign = 'center';
        effectTitle.style.color = '#5b21b6';
        effectsColumn.appendChild(effectTitle);

        // Shuffle effects
        const shuffledEffects = [...this.content.pairs].sort(() => Math.random() - 0.5);

        shuffledEffects.forEach((pair, displayIndex) => {
            const originalIndex = this.content.pairs.indexOf(pair);
            const effectEl = this.createItem(pair.effect, ITEM_SIZE, ITEM_FONT, displayIndex, 'effect');
            effectEl.dataset.pairId = originalIndex;
            effectEl.addEventListener('click', () => this.selectEffect(effectEl, originalIndex));
            effectsColumn.appendChild(effectEl);
        });

        columnsContainer.appendChild(causesColumn);
        columnsContainer.appendChild(arrow);
        columnsContainer.appendChild(effectsColumn);

        this.container.appendChild(columnsContainer);
    }

    createItem(content, size, font, index, type) {
        const el = document.createElement('div');
        el.className = `${type}-item pop-in`;
        el.innerHTML = content;
        el.style.width = size;
        el.style.height = size;
        el.style.display = 'flex';
        el.style.justifyContent = 'center';
        el.style.alignItems = 'center';
        el.style.fontSize = font;
        el.style.borderRadius = '25px';
        el.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
        el.style.border = '3px solid rgba(99, 102, 241, 0.2)';
        el.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
        el.style.cursor = 'pointer';
        el.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        el.style.animationDelay = `${index * 0.1}s`;

        el.addEventListener('mouseenter', () => {
            if (!el.dataset.matched) {
                SFX.playHover();
                el.style.transform = 'translateY(-5px) scale(1.05)';
                el.style.boxShadow = '0 12px 30px rgba(99, 102, 241, 0.25)';
            }
        });

        el.addEventListener('mouseleave', () => {
            if (!el.dataset.selected) {
                el.style.transform = 'translateY(0) scale(1)';
                el.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
            }
        });

        return el;
    }

    selectCause(el, pairId) {
        if (el.dataset.matched) return; // Already matched

        SFX.playClick();
        // Deselect previous
        document.querySelectorAll('.cause-item').forEach(item => {
            if (!item.dataset.matched) {
                item.style.border = '3px solid rgba(99, 102, 241, 0.2)';
                item.dataset.selected = '';
            }
        });

        // Select this
        el.style.border = '5px solid #3b82f6';
        el.dataset.selected = 'true';
        this.selectedCause = pairId;
    }

    selectEffect(el, pairId) {
        if (el.dataset.matched) return; // Already matched

        SFX.playClick();
        if (this.selectedCause === null) {
            // No cause selected yet
            return;
        }

        if (this.selectedCause === pairId) {
            // Correct match!
            this.handleCorrectMatch(el, pairId);
        } else {
            // Wrong match
            this.onFail();
            el.style.animation = 'shake 0.5s';
            setTimeout(() => {
                el.style.animation = '';
            }, 500);
        }
    }

    handleCorrectMatch(effectEl, pairId) {
        const causeEl = document.querySelector(`.cause-item[data-pair-id="${pairId}"][data-selected="true"]`);

        // Success animation
        causeEl.style.border = '5px solid #22c55e';
        causeEl.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        causeEl.style.pointerEvents = 'none';
        causeEl.dataset.matched = 'true';
        causeEl.dataset.selected = '';

        effectEl.style.border = '5px solid #22c55e';
        effectEl.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        effectEl.style.pointerEvents = 'none';
        effectEl.dataset.matched = 'true';

        this.matchedPairs++;
        this.selectedCause = null;

        // Check if all pairs are matched
        if (this.matchedPairs === this.totalPairs) {
            setTimeout(() => this.onSuccess(), 800);
        }
    }
}
