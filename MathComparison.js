// Template for Math Comparison tasks (Greater, Less, Equal)
class MathComparisonTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { left: {type, value, count}, right: {type, value, count}, answer: '>' }
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
        this.container.style.gap = '50px';
        this.container.style.padding = '40px';

        // Comparison Area
        const comparisonContainer = document.createElement('div');
        comparisonContainer.className = 'pop-in';
        comparisonContainer.style.display = 'flex';
        comparisonContainer.style.alignItems = 'center';
        comparisonContainer.style.justifyContent = 'space-around';
        comparisonContainer.style.width = '100%';
        comparisonContainer.style.maxWidth = '800px';
        comparisonContainer.style.padding = '40px';
        comparisonContainer.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'; // Light green
        comparisonContainer.style.borderRadius = '35px';
        comparisonContainer.style.boxShadow = '0 20px 50px rgba(34, 197, 94, 0.2)';
        comparisonContainer.style.border = '4px solid rgba(34, 197, 94, 0.3)';

        // Left Side
        const leftEl = this.createSide(this.content.left);
        comparisonContainer.appendChild(leftEl);

        // Center Slot (Question Mark)
        const centerSlot = document.createElement('div');
        centerSlot.className = 'comparison-slot';
        centerSlot.textContent = '?';
        centerSlot.style.width = '120px';
        centerSlot.style.height = '120px';
        centerSlot.style.display = 'flex';
        centerSlot.style.justifyContent = 'center';
        centerSlot.style.alignItems = 'center';
        centerSlot.style.fontSize = '5rem';
        centerSlot.style.fontWeight = 'bold';
        centerSlot.style.color = '#ffffff';
        centerSlot.style.background = '#22c55e';
        centerSlot.style.borderRadius = '50%';
        centerSlot.style.boxShadow = '0 10px 25px rgba(34, 197, 94, 0.4)';
        centerSlot.style.animation = 'pulse 2s infinite';
        comparisonContainer.appendChild(centerSlot);

        // Right Side
        const rightEl = this.createSide(this.content.right);
        comparisonContainer.appendChild(rightEl);

        // Options Row
        const optionsRow = document.createElement('div');
        optionsRow.style.display = 'flex';
        optionsRow.style.gap = '40px';
        optionsRow.style.justifyContent = 'center';

        const options = ['>', '=', '<'];

        options.forEach((opt, index) => {
            const btn = document.createElement('div');
            btn.className = 'compare-btn pop-in';
            btn.textContent = opt;
            btn.style.width = '100px';
            btn.style.height = '100px';
            btn.style.display = 'flex';
            btn.style.justifyContent = 'center';
            btn.style.alignItems = 'center';
            btn.style.fontSize = '4.5rem';
            btn.style.fontWeight = 'bold';
            btn.style.borderRadius = '25px';
            btn.style.cursor = 'pointer';
            btn.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
            btn.style.border = '3px solid rgba(34, 197, 94, 0.2)';
            btn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            btn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            btn.style.animationDelay = `${index * 0.15}s`;
            btn.style.color = '#15803d';

            // Hover
            btn.addEventListener('mouseenter', () => {
                SFX.playHover();
                btn.style.transform = 'translateY(-8px) scale(1.1)';
                btn.style.boxShadow = '0 15px 40px rgba(34, 197, 94, 0.3)';
                btn.style.borderColor = '#22c55e';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
                btn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                btn.style.borderColor = 'rgba(34, 197, 94, 0.2)';
            });

            // Click
            btn.addEventListener('click', () => {
                SFX.playClick();
                if (opt === this.content.answer) {
                    this.handleCorrect(btn, centerSlot);
                } else {
                    this.handleWrong(btn);
                }
            });

            optionsRow.appendChild(btn);
        });

        this.container.appendChild(comparisonContainer);
        this.container.appendChild(optionsRow);
    }

    createSide(data) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.gap = '10px';

        if (data.type === 'visual') {
            const visualContainer = document.createElement('div');
            visualContainer.style.display = 'flex';
            visualContainer.style.gap = '5px';
            visualContainer.style.flexWrap = 'wrap';
            visualContainer.style.justifyContent = 'center';
            visualContainer.style.maxWidth = '180px';

            for (let i = 0; i < data.count; i++) {
                const img = document.createElement('div');
                img.innerHTML = data.value;
                img.style.fontSize = '3rem';
                img.style.animation = 'pop-in 0.5s ease forwards';
                img.style.animationDelay = `${i * 0.05}s`;
                visualContainer.appendChild(img);
            }
            container.appendChild(visualContainer);

            const countLabel = document.createElement('div');
            countLabel.textContent = data.count;
            countLabel.style.fontSize = '2rem';
            countLabel.style.fontWeight = 'bold';
            countLabel.style.color = '#15803d';
            container.appendChild(countLabel);

        } else {
            const num = document.createElement('div');
            num.textContent = data.value;
            num.style.fontSize = '5rem';
            num.style.fontWeight = 'bold';
            num.style.color = '#15803d';
            container.appendChild(num);
        }

        return container;
    }

    handleCorrect(btn, centerSlot) {
        centerSlot.textContent = btn.textContent;
        centerSlot.style.animation = 'successPop 0.5s ease-out';
        centerSlot.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        centerSlot.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.6)';

        btn.style.border = '4px solid #22c55e';
        btn.style.background = '#dcfce7';
        btn.style.transform = 'scale(1.1)';

        document.querySelectorAll('.compare-btn').forEach(el => el.style.pointerEvents = 'none');

        setTimeout(() => this.onSuccess(), 1000);
    }

    handleWrong(btn) {
        btn.style.animation = 'shake 0.5s';
        this.onFail();
        setTimeout(() => {
            btn.style.animation = '';
        }, 500);
    }
}
