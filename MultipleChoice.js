// Template for Multiple Choice tasks (Word problems, Geometry, General Quiz)
class MultipleChoiceTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { question: "...", image: "...", options: [{content, correct}] }
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
        this.container.style.gap = '30px';
        this.container.style.padding = '20px';
        this.container.style.boxSizing = 'border-box'; // Fix overflow

        // Question Card
        const questionCard = document.createElement('div');
        questionCard.className = 'pop-in';
        questionCard.style.display = 'flex';
        questionCard.style.flexDirection = 'column';
        questionCard.style.alignItems = 'center';
        questionCard.style.gap = '30px';
        questionCard.style.padding = '30px';
        questionCard.style.background = 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)';
        questionCard.style.borderRadius = '35px';
        questionCard.style.boxShadow = '0 20px 50px rgba(20, 184, 166, 0.2)';
        questionCard.style.border = '4px solid rgba(20, 184, 166, 0.3)';
        questionCard.style.maxWidth = '700px';
        questionCard.style.width = '90%';
        questionCard.style.boxSizing = 'border-box';

        // Image (if present)
        if (this.content.image) {
            const img = document.createElement('div');
            img.innerHTML = this.content.image;
            img.style.fontSize = '7rem';
            img.style.animation = 'float-anim 3s ease-in-out infinite';
            questionCard.appendChild(img);
        }

        // Question Text
        const questionText = document.createElement('div');
        questionText.textContent = this.content.question;
        questionText.style.fontSize = '2rem';
        questionText.style.fontWeight = 'bold';
        questionText.style.color = '#0f766e';
        questionText.style.textAlign = 'center';
        questionText.style.lineHeight = '1.4';
        questionText.style.whiteSpace = 'pre-line'; // Support \n
        questionCard.appendChild(questionText);

        // Options Container
        const optionsContainer = document.createElement('div');
        optionsContainer.style.display = 'flex';
        optionsContainer.style.flexWrap = 'wrap';
        optionsContainer.style.justifyContent = 'center';
        optionsContainer.style.gap = '25px';
        optionsContainer.style.width = '100%';

        this.content.options.forEach((opt, index) => {
            const btn = document.createElement('div');
            btn.className = 'mc-option pop-in';
            btn.innerHTML = opt.content;
            btn.style.minWidth = '150px';
            btn.style.padding = '20px 30px';
            btn.style.display = 'flex';
            btn.style.justifyContent = 'center';
            btn.style.alignItems = 'center';
            btn.style.fontSize = '4rem'; // Increased font size for emojis
            btn.style.fontWeight = 'bold';
            btn.style.borderRadius = '25px';
            btn.style.cursor = 'pointer';
            btn.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
            btn.style.border = '3px solid rgba(20, 184, 166, 0.2)';
            btn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            btn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            btn.style.animationDelay = `${index * 0.1}s`;
            btn.style.textAlign = 'center';

            // Hover
            btn.addEventListener('mouseenter', () => {
                SFX.playHover();
                btn.style.transform = 'translateY(-8px) scale(1.1)'; // More pop
                btn.style.boxShadow = '0 15px 40px rgba(20, 184, 166, 0.3)';
                btn.style.borderColor = '#14b8a6';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
                btn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                btn.style.borderColor = 'rgba(20, 184, 166, 0.2)';
            });

            // Click
            btn.addEventListener('click', () => {
                SFX.playClick();
                if (opt.correct) {
                    this.handleCorrect(btn);
                } else {
                    this.handleWrong(btn);
                }
            });

            optionsContainer.appendChild(btn);
        });

        this.container.appendChild(questionCard);
        this.container.appendChild(optionsContainer);
    }

    handleCorrect(btn) {
        btn.style.border = '4px solid #22c55e';
        btn.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
        btn.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.6)';
        btn.style.transform = 'scale(1.1)';

        document.querySelectorAll('.mc-option').forEach(el => el.style.pointerEvents = 'none');

        setTimeout(() => this.onSuccess(btn), 1000);
    }

    handleWrong(btn) {
        btn.style.animation = 'shake 0.5s';
        this.onFail();
        setTimeout(() => {
            btn.style.animation = '';
        }, 500);
    }
}
