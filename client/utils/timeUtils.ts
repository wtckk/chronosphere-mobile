export const formatTime = (seconds: number): string => {
    if (seconds < 60) {
        return `${seconds}с`;
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
        return `${hours}ч ${minutes}м`;
    }

    return `${minutes}м ${remainingSeconds}с`;
};

export const formatTimeHMS = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const formatTimeForDisplay = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
        return `${hours}ч ${minutes}м`;
    }

    return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
};

export const formatTimeForTimer = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formattedHours = String(hours).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

export const getDayKey = (date: Date = new Date()): string => {
    return date.toISOString().split('T')[0];
};

export const getWeekKey = (date: Date = new Date()): string => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d.toISOString().split('T')[0];
};

export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
    const dates = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
};

export const getWeekDays = (date: Date = new Date()): Date[] => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < 7; i++) {
        const nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        days.push(nextDay);
    }

    return days;
};

export const getDayName = (date: Date, short: boolean = false): string => {
    const options: Intl.DateTimeFormatOptions = { weekday: short ? 'short' : 'long' };
    return date.toLocaleDateString('ru-RU', options);
};

export const getMonthName = (date: Date, short: boolean = false): string => {
    const options: Intl.DateTimeFormatOptions = { month: short ? 'short' : 'long' };
    return date.toLocaleDateString('ru-RU', options);
};