import { Platform } from 'react-native';
import { useAuthStore } from '@/store/authStore';

// API configuration
export const API_CONFIG = {
    // Use your actual API URL in production
    BASE_URL: 'https://api.timetracker.example.com/v1',
    TIMEOUT: 30000, // 30 seconds
};

// Request headers
export const getHeaders = () => {
    const { user } = useAuthStore.getState();
    const token = user?.token;

    return {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'X-Client-Platform': Platform.OS,
        'X-Client-Version': '1.0.0',
    };
};

// API endpoints
export const ENDPOINTS = {
    // Auth
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH_TOKEN: '/auth/refresh',
    LOGOUT: '/auth/logout',

    // Tasks
    TASKS: '/tasks',
    TASK: (id: string) => `/tasks/${id}`,

    // Timer sessions
    SESSIONS: '/sessions',
    SESSION: (id: string) => `/sessions/${id}`,

    // Categories
    CATEGORIES: '/categories',
    CATEGORY: (id: string) => `/categories/${id}`,

    // Stats
    STATS: '/stats',
    STATS_DAILY: '/stats/daily',
    STATS_WEEKLY: '/stats/weekly',

    // User
    USER_PROFILE: '/user/profile',
    USER_SETTINGS: '/user/settings',
};

// Error messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Ошибка сети. Пожалуйста, проверьте подключение к интернету.',
    SERVER_ERROR: 'Ошибка сервера. Пожалуйста, попробуйте позже.',
    TIMEOUT_ERROR: 'Превышено время ожидания ответа от сервера.',
    UNAUTHORIZED: 'Необходима авторизация. Пожалуйста, войдите снова.',
    FORBIDDEN: 'У вас нет доступа к этому ресурсу.',
    NOT_FOUND: 'Запрашиваемый ресурс не найден.',
    VALIDATION_ERROR: 'Ошибка валидации данных.',
    DEFAULT: 'Произошла ошибка. Пожалуйста, попробуйте позже.',
};