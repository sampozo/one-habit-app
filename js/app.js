// One Habit - Core Logic
const app = window.app = {
    habit: null,
    history: [],
    
    init: async () => {
        app.loadData();
        app.renderHome();
        app.renderHistory();
        app.renderStats();
        console.log("OneHabit Initialized");
    },

    loadData: () => {
        const savedHabit = localStorage.getItem('activeHabit');
        const savedHistory = localStorage.getItem('habitHistory');
        
        if (savedHabit) app.habit = JSON.parse(savedHabit);
        if (savedHistory) app.history = JSON.parse(savedHistory);
    },

    saveData: () => {
        localStorage.setItem('activeHabit', JSON.stringify(app.habit));
        localStorage.setItem('habitHistory', JSON.stringify(app.history));
    },

    showScreen: (screenId) => {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(screenId).classList.add('active');
        
        if (screenId === 'home-screen') app.renderHome();
        if (screenId === 'history-screen') app.renderHistory();
        if (screenId === 'stats-screen') app.renderStats();
    },

    saveHabit: (e) => {
        e.preventDefault();
        
        // If there was an active habit, move it to history
        if (app.habit) {
            app.history.push({
                ...app.habit,
                endDate: new Date().toISOString()
            });
        }

        const newHabit = {
            name: document.getElementById('habit-name').value,
            emoji: document.getElementById('habit-icon').value || '✨',
            goal: parseInt(document.getElementById('habit-goal').value),
            reminder: document.getElementById('habit-reminder').value,
            startDate: new Date().toISOString(),
            completions: [] // Array of ISO dates
        };

        app.habit = newHabit;
        app.saveData();
        app.showScreen('home-screen');
        e.target.reset();
    },

    markDone: async () => {
        if (!app.habit) return;

        const today = new Date().toISOString().split('T')[0];
        if (app.habit.completions.includes(today)) return;

        app.habit.completions.push(today);
        app.saveData();
        app.renderHome();

        // Haptics integration
        try {
            if (window.Capacitor && window.Capacitor.Plugins.Haptics) {
                await window.Capacitor.Plugins.Haptics.impact({ style: 'heavy' });
            }
        } catch (e) {
            console.log("Haptics not available");
        }
    },

    calculateStreak: () => {
        if (!app.habit || app.habit.completions.length === 0) return 0;
        
        const sortedDates = [...app.habit.completions].sort((a, b) => new Date(b) - new Date(a));
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0,0,0,0);

        // Check if last completion was today or yesterday
        const lastDate = new Date(sortedDates[0]);
        const diff = (currentDate - lastDate) / (1000 * 60 * 60 * 24);
        
        if (diff > 1) return 0; // Streak broken

        for (let i = 0; i < sortedDates.length; i++) {
            const date = new Date(sortedDates[i]);
            if (i === 0) {
                streak++;
            } else {
                const prevDate = new Date(sortedDates[i-1]);
                const diffDays = (prevDate - date) / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                    streak++;
                } else {
                    break;
                }
            }
        }
        return streak;
    },

    renderHome: () => {
        const noHabit = document.getElementById('no-habit');
        const habitContainer = document.getElementById('active-habit-container');
        
        if (!app.habit) {
            noHabit.classList.remove('hidden');
            habitContainer.classList.add('hidden');
            return;
        }

        noHabit.classList.add('hidden');
        habitContainer.classList.remove('hidden');

        document.getElementById('habit-emoji').innerText = app.habit.emoji;
        document.getElementById('habit-display-name').innerText = app.habit.name;
        document.getElementById('streak-count').innerText = app.calculateStreak();

        // Render monthly progress
        const grid = document.getElementById('monthly-progress');
        grid.innerHTML = '';
        const now = new Date();
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        const today = now.getDate();

        for (let i = 1; i <= daysInMonth; i++) {
            const circle = document.createElement('div');
            circle.className = 'circle';
            
            const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            if (app.habit.completions.includes(dateStr)) {
                circle.classList.add('filled');
            }
            if (i === today) {
                circle.classList.add('today');
            }
            grid.appendChild(circle);
        }

        // Button state
        const completeBtn = document.getElementById('complete-btn');
        const todayStr = new Date().toISOString().split('T')[0];
        if (app.habit.completions.includes(todayStr)) {
            completeBtn.classList.add('done');
            completeBtn.querySelector('.btn-text').innerText = '¡Completado!';
            completeBtn.disabled = true;
        } else {
            completeBtn.classList.remove('done');
            completeBtn.querySelector('.btn-text').innerText = 'Hecho por hoy';
            completeBtn.disabled = false;
        }
    },

    renderStats: () => {
        if (!app.habit) return;
        const now = new Date();
        const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        const daysThisMonth = app.habit.completions.filter(d => d.startsWith(currentMonth)).length;
        
        document.getElementById('total-days-month').innerText = daysThisMonth;
        document.getElementById('best-streak').innerText = app.calculateStreak(); // Simplification
    },

    renderHistory: () => {
        const list = document.getElementById('history-list');
        list.innerHTML = '';
        
        if (app.history.length === 0) {
            list.innerHTML = '<p style="text-align:center; color:rgba(255,255,255,0.3)">Aún no hay historia.</p>';
            return;
        }

        app.history.forEach(h => {
            const item = document.createElement('div');
            item.className = 'glass-card history-item';
            item.innerHTML = `
                <div>
                    <span style="font-size:24px">${h.emoji}</span>
                    <strong style="margin-left:10px">${h.name}</strong>
                </div>
                <div class="mono" style="color:var(--primary)">${h.completions.length} d</div>
            `;
            list.appendChild(item);
        });
    }
};

window.addEventListener('DOMContentLoaded', app.init);
