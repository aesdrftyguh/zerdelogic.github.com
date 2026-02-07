// Template for "Find the Odd One Out" tasks
class OddOneOutTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { items: [{content, isOdd}] }
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
        this.container.style.padding = '40px';
        this.container.style.boxSizing = 'border-box'; // FIX

        // Create grid of items
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
        grid.style.gap = '30px';
        grid.style.padding = '40px';
        grid.style.background = 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)';
        grid.style.borderRadius = '35px';
        grid.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
        grid.style.border = '3px solid rgba(255,255,255,0.8)';

        this.content.items.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'odd-item pop-in';
            itemEl.innerHTML = item.content;
            itemEl.style.width = '140px';
            itemEl.style.height = '140px';
            itemEl.style.display = 'flex';
            itemEl.style.justifyContent = 'center';
            itemEl.style.alignItems = 'center';
            itemEl.style.fontSize = '5.5rem';
            itemEl.style.borderRadius = '25px';
            itemEl.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)';
            itemEl.style.border = '3px solid #e0e7ff';
            itemEl.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';
            itemEl.style.cursor = 'pointer';
            itemEl.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            itemEl.style.position = 'relative';
            itemEl.style.animationDelay = `${index * 0.1}s`;

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

            // Hover effect
            itemEl.addEventListener('mouseenter', () => {
                SFX.playHover();
                itemEl.style.transform = 'translateY(-8px) scale(1.08)';
                itemEl.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.3)';
                itemEl.style.borderColor = '#6366f1';
            });

            itemEl.addEventListener('mouseleave', () => {
                if (!itemEl.dataset.selected) {
                    itemEl.style.transform = 'translateY(0) scale(1)';
                    itemEl.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';
                    itemEl.style.borderColor = '#e0e7ff';
                }
            });

            // Click handler
            itemEl.addEventListener('click', () => {
                SFX.playClick();
                if (item.isOdd) {
                    this.handleCorrectChoice(itemEl);
                } else {
                    this.handleWrongChoice(itemEl);
                }
            });

            grid.appendChild(itemEl);
        });

        this.container.appendChild(grid);
    }

    handleCorrectChoice(el) {
        // Success animation
        el.style.border = '5px solid #22c55e';
        el.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        el.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.5)';
        el.style.transform = 'scale(1.2)';
        el.dataset.selected = 'true';

        // Disable all items
        document.querySelectorAll('.odd-item').forEach(item => {
            item.style.pointerEvents = 'none';
        });

        setTimeout(() => this.onSuccess(), 800);
    }

    handleWrongChoice(el) {
        // Wrong animation
        el.style.animation = 'shake 0.5s';
        this.onFail();

        setTimeout(() => {
            el.style.animation = '';
        }, 500);
    }
}
