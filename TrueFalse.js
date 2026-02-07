// Template for True/False tasks
class TrueFalseTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { statement: "...", image: "emoji", isTrue: boolean }
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

        // Statement card
        const statementCard = document.createElement('div');
        statementCard.className = 'pop-in';
        statementCard.style.display = 'flex';
        statementCard.style.flexDirection = 'column';
        statementCard.style.alignItems = 'center';
        statementCard.style.gap = '30px';
        statementCard.style.padding = '40px';
        statementCard.style.background = 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)';
        statementCard.style.borderRadius = '35px';
        statementCard.style.boxShadow = '0 20px 50px rgba(251, 191, 36, 0.3)';
        statementCard.style.border = '4px solid rgba(245, 158, 11, 0.3)';
        statementCard.style.maxWidth = '600px';
        statementCard.style.width = '90%';
        statementCard.style.boxSizing = 'border-box';

        // Image/Emoji
        if (this.content.image) {
            const imageEl = document.createElement('div');
            imageEl.innerHTML = this.content.image;
            imageEl.style.fontSize = '8rem';
            imageEl.style.animation = 'float-anim 3s ease-in-out infinite';
            statementCard.appendChild(imageEl);
        }

        // Statement text
        const statementText = document.createElement('div');
        statementText.textContent = this.content.statement;
        statementText.style.fontSize = '2rem';
        statementText.style.fontWeight = 'bold';
        statementText.style.color = '#92400e';
        statementText.style.textAlign = 'center';
        statementText.style.lineHeight = '1.5';

        statementCard.appendChild(statementText);

        // Buttons row
        const buttonsRow = document.createElement('div');
        buttonsRow.style.display = 'flex';
        buttonsRow.style.gap = '40px';
        buttonsRow.style.justifyContent = 'center';

        // True button
        const trueBtn = this.createButton('ШЫН', '✅', '#22c55e', true);

        // False button
        const falseBtn = this.createButton('ЖАЛҒАН', '❌', '#ef4444', false);

        buttonsRow.appendChild(trueBtn);
        buttonsRow.appendChild(falseBtn);

        this.container.appendChild(statementCard);
        this.container.appendChild(buttonsRow);
    }

    createButton(text, emoji, color, isTrue) {
        const btn = document.createElement('div');
        btn.className = 'true-false-btn pop-in';
        btn.style.display = 'flex';
        btn.style.flexDirection = 'column';
        btn.style.alignItems = 'center';
        btn.style.gap = '15px';
        btn.style.padding = '30px 50px';
        btn.style.cursor = 'pointer';
        btn.style.borderRadius = '30px';
        btn.style.background = `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`;
        btn.style.border = `4px solid ${color}40`;
        btn.style.boxShadow = `0 10px 30px ${color}20`;
        btn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        btn.style.minWidth = '200px';

        // Emoji
        const emojiEl = document.createElement('div');
        emojiEl.innerHTML = emoji;
        emojiEl.style.fontSize = '5rem';

        // Text
        const textEl = document.createElement('div');
        textEl.textContent = text;
        textEl.style.fontSize = '1.8rem';
        textEl.style.fontWeight = 'bold';
        textEl.style.color = color;

        btn.appendChild(emojiEl);
        btn.appendChild(textEl);

        // Hover
        btn.addEventListener('mouseenter', () => {
            SFX.playHover();
            btn.style.transform = 'translateY(-10px) scale(1.05)';
            btn.style.boxShadow = `0 20px 50px ${color}40`;
            btn.style.border = `4px solid ${color}`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0) scale(1)';
            btn.style.boxShadow = `0 10px 30px ${color}20`;
            btn.style.border = `4px solid ${color}40`;
        });

        // Click
        btn.addEventListener('click', () => {
            SFX.playClick();

            const isCorrect = (isTrue && this.content.isTrue) || (!isTrue && !this.content.isTrue);

            if (isCorrect) {
                this.handleCorrectChoice(btn, color);
            } else {
                this.handleWrongChoice(btn);
            }
        });

        return btn;
    }

    handleCorrectChoice(btn, color) {
        btn.style.border = '5px solid #22c55e';
        btn.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        btn.style.boxShadow = '0 0 40px rgba(34, 197, 94, 0.6)';
        btn.style.transform = 'scale(1.15)';

        // Disable all buttons
        document.querySelectorAll('.true-false-btn').forEach(button => {
            button.style.pointerEvents = 'none';
        });

        setTimeout(() => this.onSuccess(), 800);
    }

    handleWrongChoice(btn) {
        btn.style.animation = 'shake 0.5s';
        this.onFail();

        setTimeout(() => {
            btn.style.animation = '';
        }, 500);
    }
}
