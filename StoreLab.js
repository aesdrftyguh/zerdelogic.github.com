class StoreLabTemplate {
    constructor(container, content, onSuccess, onFail) {
        this.container = container;
        this.content = content; // { target: 10, items: [{id, emoji, price}] }
        this.onSuccess = onSuccess;
        this.onFail = onFail;
        this.currentTotal = 0;
        this.basketItems = [];
        this.render();
    }

    render() {
        this.container.innerHTML = '';
        this.container.style.display = 'flex';
        this.container.style.flexDirection = 'column';
        this.container.style.height = '100%';
        this.container.style.padding = '20px';
        this.container.style.gap = '20px';

        // 1. Header / Customer Info
        const header = document.createElement('div');
        header.style.textAlign = 'center';
        header.innerHTML = `
            <div style="font-size: 1.3rem; font-weight: bold; margin-bottom: 5px;">
                Дүкенші: Маған тура <span style="color: var(--primary-color); font-size: 1.8rem;">${this.content.target} тиындық</span> зат беріңіз!
            </div>
        `;

        // 2. Shelf (Source)
        const shelf = document.createElement('div');
        shelf.classList.add('store-shelf');

        this.content.items.forEach(itemData => {
            const item = document.createElement('div');
            item.className = 'store-item pop-in';
            item.style.width = '100px';
            item.style.height = '120px';
            item.style.background = 'white';
            item.style.borderRadius = '20px';
            item.style.display = 'flex';
            item.style.flexDirection = 'column';
            item.style.alignItems = 'center';
            item.style.justifyContent = 'center';
            item.style.cursor = 'grab';
            item.style.boxShadow = '0 8px 20px rgba(0,0,0,0.05)';
            item.style.position = 'relative';

            item.innerHTML = `
                <div style="font-size: 3rem;">${itemData.emoji}</div>
                <div style="background: #fef3c7; color: #d97706; padding: 2px 10px; border-radius: 10px; font-weight: bold; margin-top: 5px;">
                    ${itemData.price} ₸
                </div>
            `;

            this.setupDrag(item, itemData);
            shelf.appendChild(item);
        });

        // 3. Counter Area
        const counterArea = document.createElement('div');
        counterArea.classList.add('store-counter-area');

        const basket = document.createElement('div');
        basket.className = 'basket-zone glass-panel';
        basket.style.width = '100%';
        basket.style.maxWidth = '450px';
        basket.style.height = '180px';
        basket.style.borderRadius = '30px 30px 50px 50px';
        basket.style.border = '4px dashed #94a3b8';
        basket.style.display = 'flex';
        basket.style.flexWrap = 'wrap';
        basket.style.alignContent = 'flex-start';
        basket.style.padding = '20px';
        basket.style.gap = '10px';
        basket.style.background = 'rgba(255, 255, 255, 0.2)';
        basket.style.position = 'relative';
        basket.innerHTML = '<div style="width: 100%; text-align: center; color: #64748b; font-weight: bold; pointer-events: none; opacity: 0.6;">СЕБЕТ (ОСЫНДА САЛ)</div>';

        // Digital Total
        const totalDisplay = document.createElement('div');
        totalDisplay.id = 'basket-total';
        totalDisplay.style.background = '#1e293b';
        totalDisplay.style.color = '#10b981';
        totalDisplay.style.padding = '12px 40px';
        totalDisplay.style.borderRadius = '15px';
        totalDisplay.style.fontSize = '2rem';
        totalDisplay.style.fontFamily = 'monospace';
        totalDisplay.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        totalDisplay.style.border = '2px solid #334155';
        totalDisplay.style.zIndex = '5';
        totalDisplay.textContent = 'ЖИЫНЫ: 0 ₸';

        counterArea.appendChild(basket);
        counterArea.appendChild(totalDisplay);

        this.container.appendChild(header);
        this.container.appendChild(shelf);
        this.container.appendChild(counterArea);

        this.basket = basket;
        this.totalDisplay = totalDisplay;
    }

    setupDrag(el, data) {
        el.addEventListener('mousedown', (e) => this.onDragStart(e, el, data));
        el.addEventListener('touchstart', (e) => this.onDragStart(e, el, data), { passive: false });
    }

    onDragStart(e, el, data) {
        e.preventDefault();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        const rect = el.getBoundingClientRect();
        const containerRect = this.container.getBoundingClientRect();

        const clone = el.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = (rect.left - containerRect.left) + 'px';
        clone.style.top = (rect.top - containerRect.top) + 'px';
        clone.style.zIndex = '1000';
        clone.style.pointerEvents = 'none';
        clone.style.transform = 'scale(1.1)';
        this.container.appendChild(clone);

        if (window.SFX) SFX.playClick();

        const onMove = (me) => {
            const mx = me.touches ? me.touches[0].clientX : me.clientX;
            const my = me.touches ? me.touches[0].clientY : me.clientY;
            clone.style.left = (mx - containerRect.left - 50) + 'px';
            clone.style.top = (my - containerRect.top - 60) + 'px';
        };

        const onEnd = (ee) => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchmove', onMove);
            window.removeEventListener('touchend', onEnd);

            const ex = ee.changedTouches ? ee.changedTouches[0].clientX : ee.clientX;
            const ey = ee.changedTouches ? ee.changedTouches[0].clientY : ee.clientY;

            const target = document.elementFromPoint(ex, ey);
            const basketZone = target ? target.closest('.basket-zone') : null;

            if (basketZone) {
                this.addToBasket(data, clone, containerRect);
            } else {
                clone.style.transition = 'all 0.3s ease-out';
                clone.style.left = (rect.left - containerRect.left) + 'px';
                clone.style.top = (rect.top - containerRect.top) + 'px';
                clone.style.transform = 'scale(0) rotate(20deg)';
                setTimeout(() => clone.remove(), 300);
            }
        };

        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
    }

    addToBasket(data, clone, containerRect) {
        if (this.currentTotal + data.price > this.content.target) {
            // Overlimit
            if (window.SFX) SFX.playError();
            this.updateMascot('😟', 'shake-anim');

            clone.style.transition = 'all 0.5s ease-in';
            clone.style.top = '-200px';
            clone.style.opacity = '0';
            setTimeout(() => clone.remove(), 500);

            // Flash red on total
            this.totalDisplay.style.color = '#ef4444';
            setTimeout(() => this.totalDisplay.style.color = '#10b981', 500);
            return;
        }

        this.currentTotal += data.price;
        this.totalDisplay.textContent = `ЖИЫНЫ: ${this.currentTotal} ₸`;

        // Add visual item to basket
        const basketRect = this.basket.getBoundingClientRect();
        clone.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        clone.style.left = (basketRect.left - containerRect.left + Math.random() * (basketRect.width - 60)) + 'px';
        clone.style.top = (basketRect.top - containerRect.top + Math.random() * (basketRect.height - 60)) + 'px';
        clone.style.transform = 'scale(0.7) rotate(' + (Math.random() * 40 - 20) + 'deg)';
        clone.style.pointerEvents = 'auto';
        clone.style.cursor = 'pointer';

        // Allow removing from basket
        clone.onclick = () => {
            this.currentTotal -= data.price;
            this.totalDisplay.textContent = `ЖИЫНЫ: ${this.currentTotal} ₸`;
            clone.style.transform = 'scale(0)';
            setTimeout(() => clone.remove(), 300);
            if (window.SFX) SFX.playClick();
        };

        if (this.currentTotal === this.content.target) {
            if (window.SFX) SFX.playWin();
            this.updateMascot('🤩', 'happy-anim');
            setTimeout(() => this.onSuccess(), 1000);
        } else {
            this.updateMascot('🧐', 'thinking-anim');
        }
    }

    updateMascot(emoji, anim) {
        const mascotImg = document.querySelector('#mascot-img');
        if (mascotImg) {
            mascotImg.textContent = emoji;
            mascotImg.className = anim;
        }
    }
}
