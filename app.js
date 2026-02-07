// Imports removed for file:// compatibility

class App {
    constructor() {
        this.dashboardView = document.getElementById('dashboard');
        this.workspaceView = document.getElementById('workspace');
        this.statsView = document.getElementById('stats');
        this.awardsView = document.getElementById('awards');

        this.navTasks = document.getElementById('nav-tasks');
        this.navStats = document.getElementById('nav-stats');
        this.navAwards = document.getElementById('nav-awards');

        this.backBtn = document.getElementById('btn-back');
        this.categoryCompleteOverlay = document.getElementById('category-complete-overlay');
        this.backToMenuBtn = document.getElementById('btn-back-to-menu');
        this.resetStatsBtn = document.getElementById('btn-reset-stats');

        this.taskRunner = new TaskRunner();

        // Updated Achievements adapted for points, stars and categories
        this.awards = [
            { id: 'first_win', name: 'Алғашқы жеңіс! 🥇', desc: 'Кез келген санатты аяқтаңыз', icon: '🥇', goal: 1, type: 'games' },
            { id: 'point_master', name: 'Ұпай шебері 💎', desc: '1000 ұпай жинаңыз', icon: '💎', goal: 1000, type: 'points' },
            { id: 'star_collector', name: 'Жұлдыз жинаушы ⭐', desc: '100 жұлдыз жинаңыз', icon: '⭐', goal: 100, type: 'stars' },
            { id: 'category_expert', name: 'Санат сарапшысы 🎓', desc: '5 түрлі санатты аяқтаңыз', icon: '🎓', goal: 5, type: 'categories' },
            { id: 'marathon', name: 'Марафоншы 🏃', desc: 'Барлық санаттарды аяқтаңыз', icon: '🏃', goal: 27, type: 'categories' },
            { id: 'logic_fan', name: 'Логика әуесқойы 🧩', desc: '50 тапсырма орындаңыз', icon: '🧩', goal: 50, type: 'points', factor: 50 }, // 50 tasks * 50 pts
            { id: 'perfectionist', name: 'Перфекционист 🎯', desc: '3 санатты қатесіз өт!', icon: '🎯', goal: 3, type: 'games' }, // Proxy for now
            { id: 'speedrun', name: 'Спидраннер ⚡', desc: '10 минут ішінде 5 ойын', icon: '⚡', goal: 5, type: 'games' },
            { id: 'golden_mind', name: 'Алтын зерде 🧠', desc: '500 жұлдыз жинаңыз', icon: '🧠', goal: 500, type: 'stars' },
            { id: 'king', name: 'ZerdeLogic Королі 👑', desc: 'Барлық жетістіктерді аш', icon: '👑', goal: 9, type: 'awards' }
        ];

        this.userProgress = {
            totalStars: 0,
            totalPoints: 0,
            streak: 0,
            completedGames: 0,
            completedCategories: {},
            achievementStats: {
                first_win: 0,
                point_master: 0,
                star_collector: 0,
                category_expert: 0,
                marathon: 0,
                logic_fan: 0,
                perfectionist: 0,
                speedrun: 0,
                golden_mind: 0,
                king: 0
            }
        };

        this.init();
    }

    init() {
        this.renderDashboard();

        // Sound toggle logic
        this.soundBtn = document.getElementById('btn-toggle-sound');
        this.soundIcon = document.getElementById('sound-icon');

        const updateSoundUI = () => {
            if (this.soundIcon) this.soundIcon.textContent = SFX.enabled ? '🔊' : '🔇';
            if (this.soundBtn) this.soundBtn.style.opacity = SFX.enabled ? '1' : '0.6';
        };
        updateSoundUI();

        if (this.soundBtn) {
            this.soundBtn.addEventListener('click', () => {
                const isEnabled = SFX.toggle();
                updateSoundUI();
                if (isEnabled) SFX.playClick();
            });
        }

        this.backBtn.addEventListener('click', () => {
            SFX.playClick();
            this.showDashboard();
        });
        this.backToMenuBtn.addEventListener('click', () => {
            SFX.playClick();
            this.categoryCompleteOverlay.classList.add('hidden');
            this.showDashboard();
        });

        // Global click listener for idle reset
        document.addEventListener('mousedown', () => {
            this.resetIdleTimer();
        }, { once: false });

        // Sidebar Navigation
        this.navTasks.addEventListener('click', () => {
            SFX.playClick();
            this.showDashboard();
        });
        this.navStats.addEventListener('click', () => {
            SFX.playClick();
            this.showStats();
        });
        this.navAwards.addEventListener('click', () => {
            SFX.playClick();
            this.showAwards();
        });

        // Reset Stats Logic
        this.resetStatsBtn.addEventListener('click', () => {
            if (confirm('Барлық статистиканы нөлдеу керек пе?')) {
                this.resetAllStats();
            }
        });

        // Listen for completion
        document.addEventListener('task-complete', (e) => {
            this.handleTaskSuccess(e.detail);
        });

        // Listen for failures
        document.addEventListener('task-fail', () => {
            this.handleTaskFail();
        });
    }

    resetIdleTimer() {
        if (this.idleTimer) clearTimeout(this.idleTimer);
        if (this.mascotImg) {
            this.mascotImg.classList.remove('thinking-anim');
            if (this.mascotImg.textContent === '🧐') this.mascotImg.textContent = '🦊';
        }

        this.idleTimer = setTimeout(() => {
            if (this.workspaceView.classList.contains('active')) {
                if (this.mascotImg) {
                    this.mascotImg.classList.add('thinking-anim');
                    this.mascotImg.textContent = '🧐';
                }
            }
        }, 10000); // 10 seconds idle
    }

    handleTaskSuccess(details) {
        // Star burst from mascot or center
        let burstX = window.innerWidth / 2;
        let burstY = window.innerHeight / 2;

        if (this.mascotImg) {
            const rect = this.mascotImg.getBoundingClientRect();
            burstX = rect.left + rect.width / 2;
            burstY = rect.top + rect.height / 2;

            // Mascot jump and celebrate
            this.mascotImg.textContent = '🤩';
            this.mascotImg.classList.add('happy-anim');

            setTimeout(() => {
                if (this.mascotImg) {
                    this.mascotImg.classList.remove('happy-anim');
                    this.mascotImg.textContent = '🦊';
                }
            }, 2000);
        }

        Confetti.burst(burstX, burstY);
        this.nextTask();
    }

    handleTaskFail() {
        this.mascotImg.textContent = '😟';
        this.mascotImg.classList.add('shake-anim');
        setTimeout(() => {
            if (this.mascotImg) {
                this.mascotImg.classList.remove('shake-anim');
                this.mascotImg.textContent = '🦊';
            }
        }, 1000);

        // Encouraging speech
        const phrases = [
            'Көмектесейін бе?',
            'Қайтадан байқап көр!',
            'Сенің қолыңнан келеді!',
            'Мұқият бол!'
        ];
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        this.mascotBubble.textContent = randomPhrase;
        SFX.speak(randomPhrase);
    }

    resetAllStats() {
        this.userProgress = {
            totalStars: 0,
            totalPoints: 0,
            streak: 0,
            completedGames: 0,
            completedCategories: {},
            achievementStats: {
                first_win: 0,
                point_master: 0,
                star_collector: 0,
                category_expert: 0,
                marathon: 0,
                logic_fan: 0,
                perfectionist: 0,
                speedrun: 0,
                golden_mind: 0,
                king: 0
            }
        };
        this.renderDashboard();
        SFX.playClick();
        alert('Статистика сәтті нөлденді!');
    }

    renderDashboard() {
        const container = document.getElementById('sections-container');
        container.innerHTML = '';

        // Update Dashboard Stats
        if (document.getElementById('dash-total-points')) {
            document.getElementById('dash-total-points').textContent = this.userProgress.totalPoints;
        }
        if (document.getElementById('dash-total-stars')) {
            document.getElementById('dash-total-stars').textContent = this.userProgress.totalStars;
        }

        SECTIONS.forEach(section => {
            const sectionBlock = document.createElement('div');
            sectionBlock.className = 'section-block';

            sectionBlock.innerHTML = `
                <div class="section-header">
                    <div class="section-icon" style="background-color: ${section.color}">${section.icon}</div>
                    <div class="section-title">${section.title}</div>
                </div>
            `;

            const grid = document.createElement('div');
            grid.className = 'grid-container';

            section.categories.forEach(cat => {
                const card = document.createElement('div');
                card.className = 'category-card';
                const isCompleted = this.userProgress.completedCategories[cat.id];

                card.innerHTML = `
                    <div class="card-icon">${cat.icon}</div>
                    <div class="card-title">${cat.title}</div>
                    ${isCompleted ? '<div class="card-status-check">✅</div>' : ''}
                `;
                card.addEventListener('mouseenter', () => SFX.playHover());
                card.addEventListener('click', () => {
                    SFX.playClick();
                    this.startCategory(cat.id);
                });
                grid.appendChild(card);
            });

            sectionBlock.appendChild(grid);
            container.appendChild(sectionBlock);
        });
    }

    renderStats() {
        const container = document.getElementById('category-progress-container');
        container.innerHTML = '';

        // Update top cards
        document.getElementById('stats-streak').textContent = this.userProgress.streak;
        document.getElementById('stats-total-stars').textContent = this.userProgress.totalStars;
        if (document.getElementById('stats-total-points')) {
            document.getElementById('stats-total-points').textContent = this.userProgress.totalPoints;
        }
        document.getElementById('card-stars').textContent = this.userProgress.totalStars;
        document.getElementById('card-streak').textContent = `${this.userProgress.streak} күн`;
        document.getElementById('card-games').textContent = this.userProgress.completedGames;

        // Render category progress items
        SECTIONS.forEach(section => {
            section.categories.forEach(cat => {
                const isCompleted = this.userProgress.completedCategories[cat.id];
                const progress = isCompleted ? 100 : 0; // Simple binary for now, can be fractional

                const item = document.createElement('div');
                item.className = 'category-progress-item';
                item.innerHTML = `
                    <div class="cat-prog-icon">${cat.icon}</div>
                    <div class="cat-prog-info">
                        <div class="cat-prog-name">${cat.title}</div>
                        <div class="cat-prog-bar">
                            <div class="cat-prog-fill" style="width: 0%"></div>
                        </div>
                    </div>
                    <div class="cat-prog-count">${isCompleted ? '100%' : '0%'}</div>
                `;
                container.appendChild(item);

                // Trigger animation
                setTimeout(() => {
                    const fill = item.querySelector('.cat-prog-fill');
                    if (fill) fill.style.width = `${progress}%`;
                }, 100);
            });
        });
    }

    renderAwards() {
        const container = document.getElementById('awards-container');
        container.innerHTML = '';

        let unlockedCount = 0;

        this.awards.forEach(award => {
            const current = this.userProgress.achievementStats[award.id] || 0;
            const progress = Math.min((current / award.goal) * 100, 100);
            const isLocked = progress < 100;
            if (!isLocked) unlockedCount++;

            const card = document.createElement('div');
            card.className = `award-card ${isLocked ? 'locked' : ''}`;
            card.innerHTML = `
                <div class="award-icon">${award.icon}</div>
                <div class="award-name">${award.name}</div>
                <div class="award-desc">${award.desc}</div>
                <div class="award-progress-container">
                    <div class="award-progress-label">
                        <span>${isLocked ? 'Прогресс' : 'Ашылды!'}</span>
                        <span>${current}/${award.goal}</span>
                    </div>
                    <div class="award-progress-bar">
                        <div class="award-progress-fill" style="width: 0%"></div>
                    </div>
                </div>
            `;
            container.appendChild(card);

            setTimeout(() => {
                const fill = card.querySelector('.award-progress-fill');
                if (fill) fill.style.width = `${progress}%`;
            }, 100);
        });

        document.getElementById('awards-discovered-count').textContent = `${unlockedCount}/${this.awards.length}`;
        document.getElementById('card-awards').textContent = `${unlockedCount}/${this.awards.length}`;
    }

    startCategory(categoryId) {
        this.currentCategoryId = categoryId;
        this.currentTasks = TASKS[categoryId];
        if (!this.currentTasks || this.currentTasks.length === 0) {
            alert('Бұл санат уақытша қолжетімсіз. Әзірлену үстінде!');
            return;
        }

        this.currentTaskIndex = 0;
        this.startTask(this.currentTasks[0]);
    }

    startTask(task) {
        this.showWorkspace();
        this.taskRunner.loadTask(task);
        const progress = ((this.currentTaskIndex + 1) / this.currentTasks.length) * 100;
        document.querySelector('.progress-fill').style.width = `${progress}%`;
    }

    nextTask() {
        // Award 50 points per successful task
        this.userProgress.totalPoints += 50;

        this.currentTaskIndex++;
        if (this.currentTaskIndex < this.currentTasks.length) {
            this.startTask(this.currentTasks[this.currentTaskIndex]);
        } else {
            // Category Complete
            this.userProgress.completedCategories[this.currentCategoryId] = true;
            this.userProgress.completedGames++;
            this.userProgress.totalStars += 20;

            // Auto-update Achievements Stats
            const stats = this.userProgress.achievementStats;
            const completedCount = Object.keys(this.userProgress.completedCategories).length;

            stats.first_win = this.userProgress.completedGames;
            stats.point_master = this.userProgress.totalPoints;
            stats.star_collector = this.userProgress.totalStars;
            stats.category_expert = completedCount;
            stats.marathon = completedCount;
            stats.logic_fan = this.userProgress.totalPoints; // Scaled by 50 in render
            stats.perfectionist = this.userProgress.completedGames;
            stats.speedrun = this.userProgress.completedGames;
            stats.golden_mind = this.userProgress.totalStars;

            // King is special (count of other 9 awards)
            let unlockedCount = 0;
            this.awards.forEach(a => {
                if (a.id !== 'king') {
                    const cur = stats[a.id] || 0;
                    if (cur >= a.goal) unlockedCount++;
                }
            });
            stats.king = unlockedCount;

            Confetti.launch();
            SFX.playWin();
            this.categoryCompleteOverlay.classList.remove('hidden');
        }
    }

    showWorkspace() {
        this.switchView('workspace');
    }

    showDashboard() {
        this.renderDashboard();
        this.switchView('dashboard');
        this.updateNavActive('nav-tasks');
    }

    showStats() {
        this.renderStats();
        this.switchView('stats');
        this.updateNavActive('nav-stats');
    }

    showAwards() {
        this.renderAwards();
        this.switchView('awards');
        this.updateNavActive('nav-awards');
    }

    updateNavActive(activeId) {
        const navs = ['nav-tasks', 'nav-stats', 'nav-awards'];
        navs.forEach(id => {
            const el = document.getElementById(id);
            if (id === activeId) el.classList.add('active');
            else el.classList.remove('active');
        });
    }

    switchView(viewId) {
        const views = ['dashboard', 'workspace', 'stats', 'awards'];
        views.forEach(v => {
            const el = document.getElementById(v);
            if (v === viewId) {
                el.classList.remove('hidden');
                el.classList.add('active');
            } else {
                el.classList.add('hidden');
                el.classList.remove('active');
            }
        });

        if (viewId === 'dashboard' || viewId === 'stats' || viewId === 'awards') {
            this.taskRunner.cleanup();
        }
    }
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    new App();
});
