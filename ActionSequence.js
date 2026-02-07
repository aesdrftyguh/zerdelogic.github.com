// Template for Action Sequence tasks (Order of events)
class ActionSequenceTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { steps: [{content, order}] }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.selectedOrder = [];
        this.render(); // Required by TaskRunner
    }

    render() {
        this.container.style.width = '100%';
        this.container.style.height = 'auto'; // Adapted for flex info footer
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.justifyContent = 'center';
        this.container.style.alignItems = 'center';
        this.container.style.gap = '40px';
        this.container.style.padding = '20px';
        this.container.style.boxSizing = 'border-box';

        const ITEM_SIZE = '100px'; // Smaller to fit
        const ITEM_FONT = '5rem';

        // Instruction
        const instruction = document.createElement('div');
        instruction.textContent = 'Дұрыс ретпен орналастыр!';
        instruction.style.fontSize = '1.8rem';
        instruction.style.fontWeight = 'bold';
        instruction.style.color = '#6366f1';
        instruction.style.textAlign = 'center';

        // Sequence slots (where items will be placed)
        const slotsRow = document.createElement('div');
        slotsRow.style.display = 'flex';
        slotsRow.style.flexWrap = 'wrap'; // Allow wrapping
        slotsRow.style.justifyContent = 'center';
        slotsRow.style.gap = '20px';
        slotsRow.style.padding = '20px';
        slotsRow.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
        slotsRow.style.borderRadius = '30px';
        slotsRow.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';

        this.content.steps.forEach((step, index) => {
            const slot = document.createElement('div');
            slot.className = 'sequence-slot';
            slot.dataset.position = index;
            slot.style.width = ITEM_SIZE;
            slot.style.height = ITEM_SIZE;
            slot.style.display = 'flex';
            slot.style.flexDirection = 'column';
            slot.style.justifyContent = 'center';
            slot.style.alignItems = 'center';
            slot.style.borderRadius = '25px';
            slot.style.border = '3px dashed #38bdf8';
            slot.style.background = 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)';
            slot.style.position = 'relative';
            slot.style.transition = 'all 0.3s ease';

            // Number label
            const label = document.createElement('div');
            label.textContent = index + 1;
            label.style.position = 'absolute';
            label.style.top = '-15px';
            label.style.left = '50%';
            label.style.transform = 'translateX(-50%)';
            label.style.width = '35px';
            label.style.height = '35px';
            label.style.borderRadius = '50%';
            label.style.background = '#3b82f6';
            label.style.color = '#ffffff';
            label.style.display = 'flex';
            label.style.justifyContent = 'center';
            label.style.alignItems = 'center';
            label.style.fontSize = '1.2rem';
            label.style.fontWeight = 'bold';
            label.style.boxShadow = '0 4px 10px rgba(59, 130, 246, 0.4)';

            slot.appendChild(label);
            slotsRow.appendChild(slot);
        });

        // Items to drag (shuffled)
        const itemsRow = document.createElement('div');
        itemsRow.style.display = 'flex';
        itemsRow.style.gap = '25px';
        itemsRow.style.justifyContent = 'center';
        itemsRow.style.padding = '25px';
        itemsRow.style.background = 'rgba(255, 255, 255, 0.5)';
        itemsRow.style.borderRadius = '25px';
        itemsRow.style.backdropFilter = 'blur(10px)';

        // Shuffle steps
        const shuffledSteps = [...this.content.steps].sort(() => Math.random() - 0.5);

        shuffledSteps.forEach((step, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'draggable-step pop-in';
            itemEl.draggable = true;
            itemEl.dataset.order = step.order;
            itemEl.innerHTML = step.content;
            itemEl.style.fontSize = ITEM_FONT;
            itemEl.style.width = ITEM_SIZE;
            itemEl.style.height = ITEM_SIZE;
            itemEl.style.display = 'flex';
            itemEl.style.justifyContent = 'center';
            itemEl.style.alignItems = 'center';
            itemEl.style.cursor = 'grab';
            itemEl.style.borderRadius = '25px';
            itemEl.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
            itemEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
            itemEl.style.border = '3px solid rgba(99, 102, 241, 0.2)';
            itemEl.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
            itemEl.style.animationDelay = `${index * 0.1}s`;

            // Hover
            itemEl.addEventListener('mouseenter', () => {
                SFX.playHover();
                itemEl.style.transform = 'translateY(-5px) scale(1.05)';
                itemEl.style.boxShadow = '0 15px 40px rgba(99, 102, 241, 0.3)';
            });

            itemEl.addEventListener('mouseleave', () => {
                itemEl.style.transform = 'translateY(0) scale(1)';
                itemEl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
            });

            this.enableDrag(itemEl);
            itemsRow.appendChild(itemEl);
        });

        // Append to container first
        this.container.appendChild(instruction);
        this.container.appendChild(slotsRow);
        this.container.appendChild(itemsRow);

        // Enable drop on slots AFTER they're in the DOM
        slotsRow.querySelectorAll('.sequence-slot').forEach(slot => {
            this.enableDrop(slot);
        });
    }

    enableDrag(el) {
        el.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/html', el.innerHTML);
            el.style.opacity = '0.5';
            el.style.cursor = 'grabbing';
            window.draggedElement = el;
            SFX.playClick();
        });

        el.addEventListener('dragend', () => {
            el.style.opacity = '1';
            el.style.cursor = 'grab';
        });
    }

    enableDrop(slot) {
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (!slot.dataset.filled) {
                slot.style.borderColor = '#0ea5e9';
                slot.style.background = 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)';
                slot.style.transform = 'scale(1.05)';
            }
        });

        slot.addEventListener('dragleave', () => {
            slot.style.borderColor = '#38bdf8';
            slot.style.background = 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)';
            slot.style.transform = 'scale(1)';
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedEl = window.draggedElement;

            if (draggedEl && !slot.dataset.filled) {
                const position = parseInt(slot.dataset.position);
                const order = parseInt(draggedEl.dataset.order);

                if (position === order) {
                    // Correct!
                    slot.innerHTML = draggedEl.innerHTML;
                    slot.style.fontSize = '5rem';
                    slot.style.border = '3px solid #22c55e';
                    slot.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
                    slot.style.boxShadow = '0 0 20px rgba(34, 197, 94, 0.3)';
                    slot.dataset.filled = 'true';

                    // Add number label back
                    const label = document.createElement('div');
                    label.textContent = position + 1;
                    label.style.position = 'absolute';
                    label.style.top = '-15px';
                    label.style.left = '50%';
                    label.style.transform = 'translateX(-50%)';
                    label.style.width = '35px';
                    label.style.height = '35px';
                    label.style.borderRadius = '50%';
                    label.style.background = '#22c55e';
                    label.style.color = '#ffffff';
                    label.style.display = 'flex';
                    label.style.justifyContent = 'center';
                    label.style.alignItems = 'center';
                    label.style.fontSize = '1.2rem';
                    label.style.fontWeight = 'bold';
                    label.style.boxShadow = '0 4px 10px rgba(34, 197, 94, 0.4)';
                    slot.appendChild(label);

                    draggedEl.remove();

                    // Check if all filled
                    const allFilled = [...document.querySelectorAll('.sequence-slot')].every(s => s.dataset.filled);
                    if (allFilled) {
                        setTimeout(() => this.onSuccess(), 500);
                    }
                } else {
                    // Wrong!
                    this.onFail();
                    slot.style.animation = 'shake 0.5s';
                    setTimeout(() => {
                        slot.style.animation = '';
                    }, 500);
                }
            }

            slot.style.borderColor = '#38bdf8';
            slot.style.background = 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)';
            slot.style.transform = 'scale(1)';
            window.draggedElement = null;
        });
    }
}
