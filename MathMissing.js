// Template for Math Missing Number tasks
class MathMissingTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { sequence: [1, 2, null, 4], options: [3, 5, 2], correct: 3 }
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
        this.container.style.padding = '20px';
        this.container.style.boxSizing = 'border-box';

        // Sequence Row
        const sequenceContainer = document.createElement('div');
        sequenceContainer.className = 'pop-in';
        sequenceContainer.style.display = 'flex';
        sequenceContainer.style.gap = '20px';
        sequenceContainer.style.padding = '30px';
        sequenceContainer.style.background = 'linear-gradient(135deg, #fefce8 0%, #fef9c3 100%)';
        sequenceContainer.style.borderRadius = '35px';
        sequenceContainer.style.boxShadow = '0 20px 50px rgba(250, 204, 21, 0.2)';
        sequenceContainer.style.border = '4px solid rgba(250, 204, 21, 0.3)';
        sequenceContainer.style.flexWrap = 'wrap';
        sequenceContainer.style.justifyContent = 'center';
        sequenceContainer.style.width = '90%';
        sequenceContainer.style.maxWidth = '700px';
        sequenceContainer.style.boxSizing = 'border-box';

        this.content.sequence.forEach((item, index) => {
            const el = document.createElement('div');
            el.style.width = '100px';
            el.style.height = '100px';
            el.style.display = 'flex';
            el.style.justifyContent = 'center';
            el.style.alignItems = 'center';
            el.style.fontSize = '4.5rem';
            el.style.fontWeight = 'bold';
            el.style.borderRadius = '25px';

            if (item === null) {
                // Missing slot
                el.className = 'missing-slot';
                el.textContent = '?';
                el.style.color = '#ffffff';
                el.style.background = '#eab308';
                el.style.boxShadow = '0 10px 25px rgba(234, 179, 8, 0.4)';
                el.style.border = 'none';
                el.style.animation = 'pulse 2s infinite';
            } else {
                // Number
                el.textContent = item;
                el.style.color = '#854d0e';
                el.style.background = '#fefce8';
                el.style.border = '3px solid rgba(234, 179, 8, 0.2)';
                el.style.boxShadow = '0 8px 15px rgba(0,0,0,0.05)';
            }

            // Animation for appearance
            el.style.animation = `pop-in 0.5s ease forwards ${index * 0.1}s`;
            if (item === null) el.style.animation = 'pulse 2s infinite'; // Override for slot

            sequenceContainer.appendChild(el);
        });

        // Options Row
        const optionsRow = document.createElement('div');
        optionsRow.style.display = 'flex';
        optionsRow.style.gap = '30px';
        optionsRow.style.justifyContent = 'center';

        this.content.options.forEach((opt, index) => {
            const btn = document.createElement('div');
            btn.className = 'missing-option pop-in';
            btn.textContent = opt;
            btn.style.width = '100px';
            btn.style.height = '100px';
            btn.style.display = 'flex';
            btn.style.justifyContent = 'center';
            btn.style.alignItems = 'center';
            btn.style.fontSize = '5rem'; // Bigger
            btn.style.fontWeight = 'bold';
            btn.style.borderRadius = '25px';
            btn.style.cursor = 'pointer';
            btn.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
            btn.style.border = '3px solid rgba(234, 179, 8, 0.2)';
            btn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            btn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            btn.style.animationDelay = `${index * 0.15}s`;
            btn.style.color = '#a16207';

            // Hover
            btn.addEventListener('mouseenter', () => {
                SFX.playHover();
                btn.style.transform = 'translateY(-8px) scale(1.1)';
                btn.style.boxShadow = '0 15px 40px rgba(234, 179, 8, 0.3)';
                btn.style.borderColor = '#eab308';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
                btn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                btn.style.borderColor = 'rgba(234, 179, 8, 0.2)';
            });

            // Click
            btn.addEventListener('click', () => {
                SFX.playClick();
                if (opt === this.content.correct) {
                    this.handleCorrect(btn);
                } else {
                    this.handleWrong(btn);
                }
            });

            optionsRow.appendChild(btn);
        });

        this.container.appendChild(sequenceContainer);
        this.container.appendChild(optionsRow);
    }

    handleCorrect(btn) {
        const missingSlot = document.querySelector('.missing-slot');
        missingSlot.textContent = btn.textContent;
        missingSlot.style.animation = 'successPop 0.5s ease-out';
        missingSlot.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        missingSlot.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.6)';

        btn.style.border = '4px solid #22c55e';
        btn.style.background = '#dcfce7';
        btn.style.transform = 'scale(1.1)';

        document.querySelectorAll('.missing-option').forEach(el => el.style.pointerEvents = 'none');

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
