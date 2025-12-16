// Данные приложения
let balance = 1250;
let habits = [
    {
        id: 1,
        name: '🏃 Бегать 3 раза в неделю',
        stake: 500,
        currentDays: 7,
        targetDays: 21,
        completed: false
    },
    {
        id: 2,
        name: '📚 Читать 30 минут в день',
        stake: 300,
        currentDays: 14,
        targetDays: 30,
        completed: false
    }
];

// Функция для обновления баланса
function updateBalance() {
    document.getElementById('balance').textContent = balance.toLocaleString() + ' ₽';
}

// Функция для добавления денег
function addMoney() {
    const amount = prompt('Введите сумму для пополнения (₽):', '1000');
    
    if (amount && !isNaN(amount) && amount > 0) {
        balance += parseInt(amount);
        updateBalance();
        showMessage(`💰 Баланс пополнен на ${amount} ₽`, 'success');
    }
}

// Функция для выполнения привычки
function completeHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    habit.currentDays++;
    
    if (habit.currentDays >= habit.targetDays) {
        habit.completed = true;
        balance += habit.stake; // Возвращаем деньги
        showMessage(`🎉 Привычка "${habit.name}" выполнена! ${habit.stake} ₽ возвращены.`, 'success');
    } else {
        showMessage(`✅ День засчитан! Осталось ${habit.targetDays - habit.currentDays} дней.`, 'info');
    }
    
    updateBalance();
}

// Функция для провала привычки
function failHabit(habitId) {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    if (confirm(`Вы уверены, что провалили привычку "${habit.name}"? ${habit.stake} ₽ будут переведены на благотворительность.`)) {
        // Здесь можно добавить логику удаления привычки
        showMessage(`💔 Привычка провалена. ${habit.stake} ₽ переведены на благотворительность.`, 'warning');
    }
}

// Функция для создания новой привычки
function createNewHabit() {
    const name = prompt('Введите название новой привычки:', 'Новая привычка');
    const stake = prompt('Введите ставку (₽):', '500');
    
    if (name && stake && !isNaN(stake)) {
        if (balance < parseInt(stake)) {
            showMessage('Недостаточно средств на балансе!', 'error');
            return;
        }
        
        balance -= parseInt(stake);
        updateBalance();
        
        const newHabit = {
            id: habits.length + 1,
            name: name,
            stake: parseInt(stake),
            currentDays: 0,
            targetDays: 30,
            completed: false
        };
        
        habits.push(newHabit);
        showMessage(`🔥 Новая привычка создана! Ставка: ${stake} ₽`, 'success');
    }
}

// Функция для показа сообщений
function showMessage(text, type = 'info') {
    // Создаем элемент сообщения
    const message = document.createElement('div');
    message.textContent = text;
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#FF4081' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        message.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Добавляем стили для анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    updateBalance();
    
    // Добавляем обработчики событий
    document.querySelector('.balance').addEventListener('click', addMoney);
    
    // Находим кнопку "Создать новую привычку" и добавляем обработчик
    const createBtn = document.querySelector('.btn[style*="2196F3"]');
    if (createBtn) {
        createBtn.addEventListener('click', createNewHabit);
    }
    
    showMessage('HabitForge загружен! Нажмите на баланс, чтобы пополнить.', 'info');
});

// Горячие клавиши
document.addEventListener('keydown', function(event) {
    if (event.key === 'n' && event.ctrlKey) {
        event.preventDefault();
        createNewHabit();
    }
    if (event.key === 'a' && event.ctrlKey) {
        event.preventDefault();
        addMoney();
    }
});