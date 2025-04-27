import { categoryColors } from './colors';

export const CATEGORY_ICONS = {
    work: '💼',
    code: '💻',
    reading: '📚',
    sport: '🏋️',
    study: '🎓',
    personal: '🌱',
    music: '🎵',
    art: '🎨',
    travel: '✈️',
    food: '🍽️',
    finance: '💰',
    health: '🏥',
    shopping: '🛒',
    social: '👥',
    gaming: '🎮',
    writing: '✍️',
    meditation: '🧘',
    language: '🗣️',
    movie: '🎬',
    home: '🏠',
};

export const DEFAULT_CATEGORIES = [
    {
        id: 'work',
        name: 'Работа',
        color: categoryColors.work,
        icon: CATEGORY_ICONS.work,
    },
    {
        id: 'code',
        name: 'Код',
        color: categoryColors.code,
        icon: CATEGORY_ICONS.code,
    },
    {
        id: 'reading',
        name: 'Чтение',
        color: categoryColors.reading,
        icon: CATEGORY_ICONS.reading,
    },
    {
        id: 'sport',
        name: 'Спорт',
        color: categoryColors.sport,
        icon: CATEGORY_ICONS.sport,
    },
    {
        id: 'study',
        name: 'Учеба',
        color: categoryColors.study,
        icon: CATEGORY_ICONS.study,
    },
    {
        id: 'personal',
        name: 'Личное',
        color: categoryColors.personal,
        icon: CATEGORY_ICONS.personal,
    },
];