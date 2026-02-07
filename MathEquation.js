// Template for Math Equation tasks (Addition/Subtraction with visuals)
class MathEquationTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { expression: [{type: 'number'|'visual', value: '...', count: 3}], operator: '+', answer: 5, options: [3, 5, 8] }
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

        // Equation Container
        const equationContainer = document.createElement('div');
        equationContainer.className = 'pop-in';
        equationContainer.style.display = 'flex';
        equationContainer.style.alignItems = 'center';
        equationContainer.style.justifyContent = 'center';
        equationContainer.style.gap = '20px';
        equationContainer.style.padding = '30px';
        equationContainer.style.background = 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)';
        equationContainer.style.borderRadius = '35px';
        equationContainer.style.boxShadow = '0 20px 50px rgba(59, 130, 246, 0.2)';
        equationContainer.style.border = '4px solid rgba(59, 130, 246, 0.3)';
        equationContainer.style.maxWidth = '800px';
        equationContainer.style.width = '90%';
        equationContainer.style.flexWrap = 'wrap';
        equationContainer.style.boxSizing = 'border-box';

        // Render first operand
        const op1 = this.createOperand(this.content.operand1);
        equationContainer.appendChild(op1);

        // Operator
        const operatorEl = document.createElement('div');
        operatorEl.textContent = this.content.operator;
        operatorEl.style.fontSize = '5rem';
        operatorEl.style.fontWeight = 'bold';
        operatorEl.style.color = '#3b82f6';
        operatorEl.style.textShadow = '0 4px 10px rgba(0,0,0,0.1)';
        equationContainer.appendChild(operatorEl);

        // Render second operand
        const op2 = this.createOperand(this.content.operand2);
        equationContainer.appendChild(op2);

        // Equals sign
        const equalsEl = document.createElement('div');
        equalsEl.textContent = '=';
        equalsEl.style.fontSize = '5rem';
        equalsEl.style.fontWeight = 'bold';
        equalsEl.style.color = '#3b82f6';
        equalsEl.style.textShadow = '0 4px 10px rgba(0,0,0,0.1)';
        equationContainer.appendChild(equalsEl);

        // Question mark / Answer slot
        const answerSlot = document.createElement('div');
        answerSlot.className = 'answer-slot';
        answerSlot.textContent = '?';
        answerSlot.style.width = '120px';
        answerSlot.style.height = '120px';
        answerSlot.style.display = 'flex';
        answerSlot.style.justifyContent = 'center';
        answerSlot.style.alignItems = 'center';
        answerSlot.style.fontSize = '5rem';
        answerSlot.style.fontWeight = 'bold';
        answerSlot.style.color = '#ffffff';
        answerSlot.style.background = '#3b82f6';
        answerSlot.style.borderRadius = '25px';
        answerSlot.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.4)';
        answerSlot.style.animation = 'pulse 2s infinite';
        equationContainer.appendChild(answerSlot);

        // Options Row
        const optionsRow = document.createElement('div');
        optionsRow.style.display = 'flex';
        optionsRow.style.gap = '30px';
        optionsRow.style.justifyContent = 'center';
        optionsRow.style.flexWrap = 'wrap';

        this.content.options.forEach((opt, index) => {
            const btn = document.createElement('div');
            btn.className = 'math-option pop-in';
            btn.textContent = opt;
            btn.style.minWidth = '100px';
            btn.style.height = '100px';
            btn.style.padding = '0 30px';
            btn.style.display = 'flex';
            btn.style.justifyContent = 'center';
            btn.style.alignItems = 'center';
            btn.style.fontSize = '5rem'; // Bigger
            btn.style.fontWeight = 'bold';
            btn.style.borderRadius = '25px';
            btn.style.cursor = 'pointer';
            btn.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
            btn.style.border = '3px solid rgba(59, 130, 246, 0.2)';
            btn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            btn.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            btn.style.animationDelay = `${index * 0.15}s`;

            // Hover
            btn.addEventListener('mouseenter', () => {
                SFX.playHover();
                btn.style.transform = 'translateY(-8px) scale(1.08)';
                btn.style.boxShadow = '0 15px 40px rgba(59, 130, 246, 0.3)';
                btn.style.borderColor = '#3b82f6';
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0) scale(1)';
                btn.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                btn.style.borderColor = 'rgba(59, 130, 246, 0.2)';
            });

            // Click
            btn.addEventListener('click', () => {
                SFX.playClick();
                if (opt === this.content.answer) {
                    this.handleCorrect(btn, answerSlot);
                } else {
                    this.handleWrong(btn);
                }
            });

            optionsRow.appendChild(btn);
        });

        this.container.appendChild(equationContainer);
        this.container.appendChild(optionsRow);
    }

    createOperand(data) {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';

        if (data.type === 'visual') {
            // Display images (e.g., 🍎🍎🍎)
            container.style.gap = '5px';
            container.style.flexWrap = 'wrap';
            container.style.maxWidth = '200px';

            for (let i = 0; i < data.count; i++) {
                const img = document.createElement('div');
                img.innerHTML = data.value;
                img.style.fontSize = '3.5rem';
                img.style.animation = 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards';
                img.style.animationDelay = `${i * 0.1}s`;
                container.appendChild(img);
            }

            // Numeric hint below? Optional.
            // Let's add a small number badges
            const badge = document.createElement('div');
            badge.textContent = data.count;
            badge.style.position = 'absolute';
            badge.style.bottom = '-30px';
            badge.style.fontSize = '1.5rem';
            badge.style.fontWeight = 'bold';
            badge.style.color = '#94a3b8';
            // container.appendChild(badge); 
        } else {
            // Just a number
            container.textContent = data.value;
            container.style.fontSize = '5rem';
            container.style.fontWeight = 'bold';
            container.style.color = '#1e293b';
        }

        return container;
    }

    handleCorrect(btn, answerSlot) {
        // Animate answer slot
        answerSlot.textContent = btn.textContent;
        answerSlot.style.animation = 'successPop 0.5s ease-out';
        answerSlot.style.background = 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';
        answerSlot.style.boxShadow = '0 0 30px rgba(34, 197, 94, 0.5)';

        // Highlight button
        btn.style.border = '4px solid #22c55e';
        btn.style.background = '#dcfce7';
        btn.style.transform = 'scale(1.1)';

        // Disable options
        document.querySelectorAll('.math-option').forEach(el => el.style.pointerEvents = 'none');

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
