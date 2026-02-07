// Template for "Find What Comes Next" tasks
class NextInSequenceTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { sequence: [...], options: [{content, correct}] }
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
        this.container.style.gap = '80px';
        this.container.style.padding = '40px';
        this.container.style.boxSizing = 'border-box'; // FIX

        const ITEM_SIZE = '120px';
        const ITEM_FONT = '5.5rem';

        // 1. Sequence row with question mark
        const sequenceRow = document.createElement('div');
        sequenceRow.className = 'sequence-row';
        sequenceRow.style.display = 'flex';
        sequenceRow.style.gap = '24px';
        sequenceRow.style.padding = '40px 50px';
        sequenceRow.style.background = 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)';
        sequenceRow.style.borderRadius = '35px';
        sequenceRow.style.boxShadow = '0 15px 40px rgba(0,0,0,0.08)';
        sequenceRow.style.alignItems = 'center';
        sequenceRow.style.border = '3px solid rgba(255,255,255,0.8)';

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
            el.className = 'sequence-item pop-in';
            el.innerHTML = item;
            el.style.background = 'linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)';
            el.style.border = '3px solid #e0e7ff';
            el.style.boxShadow = '0 8px 20px rgba(99, 102, 241, 0.15)';
            el.style.animationDelay = `${index * 0.1}s`;

            sequenceRow.appendChild(el);
        });

        // Add question mark
        const questionMark = document.createElement('div');
        questionMark.style.width = ITEM_SIZE;
        questionMark.style.height = ITEM_SIZE;
        questionMark.style.display = 'flex';
        questionMark.style.justifyContent = 'center';
        questionMark.style.alignItems = 'center';
        questionMark.style.borderRadius = '25px';
        questionMark.style.fontSize = '6rem';
        questionMark.style.fontWeight = 'bold';
        questionMark.innerHTML = '?';
        questionMark.className = 'pop-in';
        questionMark.style.border = '5px dashed #a78bfa';
        questionMark.style.background = 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)';
        questionMark.style.color = '#8b5cf6';
        questionMark.style.animation = 'zonePulse 2s ease-in-out infinite';
        questionMark.style.animationDelay = `${this.content.sequence.length * 0.1}s`;
        sequenceRow.appendChild(questionMark);

        // 2. Options row
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
            itemEl.className = 'option-item pop-in';
            itemEl.innerHTML = opt.content;
            itemEl.style.fontSize = ITEM_FONT;
            itemEl.style.width = ITEM_SIZE;
            itemEl.style.height = ITEM_SIZE;
            itemEl.style.display = 'flex';
            itemEl.style.justifyContent = 'center';
            itemEl.style.alignItems = 'center';
            itemEl.style.cursor = 'pointer';
            itemEl.style.borderRadius = '25px';
            itemEl.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
            itemEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
            itemEl.style.border = '3px solid rgba(99, 102, 241, 0.2)';
            itemEl.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            itemEl.style.animationDelay = `${index * 0.15}s`;
            itemEl.style.position = 'relative';

            // Shine effect
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

            // Hover
            itemEl.addEventListener('mouseenter', () => {
                SFX.playHover();
                itemEl.style.transform = 'translateY(-8px) scale(1.08)';
                itemEl.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.3)';
                itemEl.style.borderColor = '#6366f1';
            });

            itemEl.addEventListener('mouseleave', () => {
                if (!itemEl.dataset.selected) {
                    itemEl.style.transform = 'translateY(0) scale(1)';
                    itemEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
                    itemEl.style.borderColor = 'rgba(99, 102, 241, 0.2)';
                }
            });

            // Click
            itemEl.addEventListener('click', () => {
                SFX.playClick();
                if (opt.correct) {
                    this.handleCorrectChoice(itemEl, questionMark);
                } else {
                    this.handleWrongChoice(itemEl);
                }
            });

            optionsRow.appendChild(itemEl);
        });

        this.container.appendChild(sequenceRow);
        this.container.appendChild(optionsRow);
    }

    handleCorrectChoice(el, questionMark) {
        // Replace question mark with answer
        questionMark.innerHTML = el.innerHTML;
        questionMark.style.border = '5px solid #22c55e';
        questionMark.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        questionMark.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.5)';
        questionMark.style.animation = 'successPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        questionMark.style.color = '#000';

        // Highlight selected
        el.style.border = '5px solid #22c55e';
        el.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        el.style.transform = 'scale(1.1)';
        el.dataset.selected = 'true';

        // Disable all
        document.querySelectorAll('.option-item').forEach(item => {
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
