// Template for Classification tasks (Sorting into categories)
class ClassificationTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { categories: [{name, accepts: []}], items: [{content, category}] }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.correctCount = 0;
        this.totalItems = content.items.length;
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

        const ITEM_SIZE = '100px';
        const ITEM_FONT = '4.5rem';

        // Categories row
        const categoriesRow = document.createElement('div');
        categoriesRow.style.display = 'flex';
        categoriesRow.style.gap = '30px';
        categoriesRow.style.justifyContent = 'center';
        categoriesRow.style.width = '100%';

        this.content.categories.forEach((cat, index) => {
            const categoryBox = document.createElement('div');
            categoryBox.className = 'category-box pop-in';
            // Use ID for logic, fallback to name
            const categoryId = cat.id || cat.name;
            categoryBox.dataset.category = categoryId;

            categoryBox.style.display = 'flex';
            categoryBox.style.flexDirection = 'column';
            categoryBox.style.alignItems = 'center';
            categoryBox.style.gap = '15px';
            categoryBox.style.padding = '25px';
            categoryBox.style.minWidth = '200px';
            categoryBox.style.minHeight = '250px';
            categoryBox.style.borderRadius = '25px';

            // Allow custom colors if provided, else default blue
            if (cat.color) {
                categoryBox.style.background = `${cat.color}20`; // 20 hex = ~12% opacity
                categoryBox.style.border = `3px dashed ${cat.color}`;
                categoryBox.style.boxShadow = `0 8px 20px ${cat.color}30`;
            } else {
                categoryBox.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
                categoryBox.style.border = '3px dashed #38bdf8';
                categoryBox.style.boxShadow = '0 8px 20px rgba(56, 189, 248, 0.15)';
            }

            categoryBox.style.transition = 'all 0.3s ease';
            categoryBox.style.animationDelay = `${index * 0.1}s`;

            const title = document.createElement('div');
            // Support label or name
            title.textContent = cat.label || cat.name;
            title.style.fontSize = '1.3rem';
            title.style.fontWeight = 'bold';
            title.style.color = cat.color || '#0369a1';
            title.style.textAlign = 'center';

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'items-container';
            itemsContainer.style.display = 'flex';
            itemsContainer.style.flexWrap = 'wrap';
            itemsContainer.style.gap = '10px';
            itemsContainer.style.justifyContent = 'center';
            itemsContainer.style.minHeight = '150px';

            categoryBox.appendChild(title);
            categoryBox.appendChild(itemsContainer);

            this.enableDrop(categoryBox, categoryId);
            categoriesRow.appendChild(categoryBox);
        });

        // Items row
        const itemsRow = document.createElement('div');
        itemsRow.style.display = 'flex';
        itemsRow.style.gap = '20px';
        itemsRow.style.justifyContent = 'center';
        itemsRow.style.padding = '25px';
        itemsRow.style.background = 'rgba(255, 255, 255, 0.5)';
        itemsRow.style.borderRadius = '25px';
        itemsRow.style.backdropFilter = 'blur(10px)';
        itemsRow.style.flexWrap = 'wrap';

        this.content.items.forEach((item, index) => {
            const itemEl = document.createElement('div');
            itemEl.className = 'draggable-item pop-in';
            itemEl.draggable = true;
            itemEl.dataset.category = item.category;
            itemEl.innerHTML = item.content;
            itemEl.style.fontSize = ITEM_FONT;
            itemEl.style.width = ITEM_SIZE;
            itemEl.style.height = ITEM_SIZE;
            itemEl.style.display = 'flex';
            itemEl.style.justifyContent = 'center';
            itemEl.style.alignItems = 'center';
            itemEl.style.cursor = 'grab';
            itemEl.style.borderRadius = '20px';
            itemEl.style.background = 'linear-gradient(135deg, #ffffff 0%, #fefefe 100%)';
            itemEl.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
            itemEl.style.border = '3px solid rgba(99, 102, 241, 0.2)';
            itemEl.style.transition = 'all 0.3s ease';
            itemEl.style.animationDelay = `${index * 0.1}s`;

            this.enableDrag(itemEl);
            itemsRow.appendChild(itemEl);
        });

        this.container.appendChild(categoriesRow);
        this.container.appendChild(itemsRow);
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

    enableDrop(categoryBox, categoryName) {
        categoryBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            categoryBox.style.borderColor = '#0ea5e9';
            categoryBox.style.background = 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)';
            categoryBox.style.transform = 'scale(1.05)';
        });

        categoryBox.addEventListener('dragleave', () => {
            categoryBox.style.borderColor = '#38bdf8';
            categoryBox.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
            categoryBox.style.transform = 'scale(1)';
        });

        categoryBox.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggedEl = window.draggedElement;

            if (draggedEl && draggedEl.dataset.category === categoryName) {
                // Correct!
                const itemsContainer = categoryBox.querySelector('.items-container');
                draggedEl.style.width = '80px';
                draggedEl.style.height = '80px';
                draggedEl.style.fontSize = '3.5rem';
                draggedEl.draggable = false;
                draggedEl.style.cursor = 'default';
                draggedEl.style.border = '3px solid #22c55e';
                draggedEl.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
                itemsContainer.appendChild(draggedEl);

                this.correctCount++;

                if (this.correctCount === this.totalItems) {
                    setTimeout(() => this.onSuccess(), 500);
                }
            } else {
                // Wrong!
                this.onFail();
                categoryBox.style.animation = 'shake 0.5s';
                setTimeout(() => {
                    categoryBox.style.animation = '';
                }, 500);
            }

            categoryBox.style.borderColor = '#38bdf8';
            categoryBox.style.background = 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)';
            categoryBox.style.transform = 'scale(1)';
            window.draggedElement = null;
        });
    }
}
