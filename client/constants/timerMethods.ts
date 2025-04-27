export const TIMER_METHODS = {
    REGULAR: 'regular',
    POMODORO: 'pomodoro',
    FIVE_MIN: 'fiveMin',
};

export const TIMER_METHOD_SETTINGS = {
    [TIMER_METHODS.REGULAR]: {
        name: 'Обычная',
        description: 'Обычное отслеживание времени без перерывов',
    },
    [TIMER_METHODS.POMODORO]: {
        name: 'Помодоро',
        description: '25 минут работы, 5 минут отдыха',
        workDuration: 25 * 60, // 25 minutes in seconds
        breakDuration: 5 * 60, // 5 minutes in seconds
        longBreakDuration: 15 * 60, // 15 minutes in seconds
        sessionsBeforeLongBreak: 4,
    },
    [TIMER_METHODS.FIVE_MIN]: {
        name: '5 минут',
        description: 'Метод 5 минут для быстрого старта',
        duration: 5 * 60, // 5 minutes in seconds
    },
};