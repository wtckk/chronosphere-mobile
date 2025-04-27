import { colors } from './colors';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    type: 'task' | 'time' | 'streak' | 'category';
    level: 'bronze' | 'silver' | 'gold' | 'platinum';
    requirement: number;
    reward?: string;
    unlocked?: boolean;
    progress?: number;
    unlockedAt?: number;
}

export const ACHIEVEMENTS: Achievement[] = [
    // Task completion achievements
    {
        id: 'first_task',
        title: 'Первый шаг',
        description: 'Завершите свою первую задачу',
        icon: '🎯',
        type: 'task',
        level: 'bronze',
        requirement: 1,
    },
    {
        id: 'task_master',
        title: 'Мастер задач',
        description: 'Завершите 50 задач',
        icon: '✅',
        type: 'task',
        level: 'silver',
        requirement: 50,
    },
    {
        id: 'task_champion',
        title: 'Чемпион задач',
        description: 'Завершите 200 задач',
        icon: '🏆',
        type: 'task',
        level: 'gold',
        requirement: 200,
    },

    // Time tracking achievements
    {
        id: 'time_tracker',
        title: 'Хронометрист',
        description: 'Отслеживайте 1 час времени',
        icon: '⏱️',
        type: 'time',
        level: 'bronze',
        requirement: 60 * 60, // 1 hour in seconds
    },
    {
        id: 'time_wizard',
        title: 'Волшебник времени',
        description: 'Отслеживайте 10 часов времени',
        icon: '🧙',
        type: 'time',
        level: 'silver',
        requirement: 10 * 60 * 60, // 10 hours in seconds
    },
    {
        id: 'time_lord',
        title: 'Повелитель времени',
        description: 'Отслеживайте 50 часов времени',
        icon: '⌛',
        type: 'time',
        level: 'gold',
        requirement: 50 * 60 * 60, // 50 hours in seconds
    },

    // Streak achievements
    {
        id: 'first_streak',
        title: 'Начало привычки',
        description: 'Используйте приложение 3 дня подряд',
        icon: '🔥',
        type: 'streak',
        level: 'bronze',
        requirement: 3,
    },
    {
        id: 'weekly_streak',
        title: 'Недельная привычка',
        description: 'Используйте приложение 7 дней подряд',
        icon: '📅',
        type: 'streak',
        level: 'silver',
        requirement: 7,
    },
    {
        id: 'monthly_streak',
        title: 'Месячная привычка',
        description: 'Используйте приложение 30 дней подряд',
        icon: '📆',
        type: 'streak',
        level: 'gold',
        requirement: 30,
    },

    // Category achievements
    {
        id: 'category_explorer',
        title: 'Исследователь категорий',
        description: 'Используйте 3 разные категории',
        icon: '🔍',
        type: 'category',
        level: 'bronze',
        requirement: 3,
    },
    {
        id: 'category_master',
        title: 'Мастер категорий',
        description: 'Создайте свою первую категорию',
        icon: '🎨',
        type: 'category',
        level: 'silver',
        requirement: 1,
    },
    {
        id: 'category_guru',
        title: 'Гуру категорий',
        description: 'Создайте 5 своих категорий',
        icon: '🧠',
        type: 'category',
        level: 'gold',
        requirement: 5,
    },
];