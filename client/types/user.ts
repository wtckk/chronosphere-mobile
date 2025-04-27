export interface User {
    id: string;
    name: string;
    email: string;
    token?: string;
    refreshToken?: string;
    avatar?: string;
    createdAt?: number;
    updatedAt?: number;
    settings?: UserSettings;
}

export interface UserSettings {
    theme: 'light' | 'dark' | 'system';
    language: string;
    notifications: {
        enabled: boolean;
        reminderTime?: string;
        dailySummary: boolean;
        weeklyReport: boolean;
    };
    defaultTimerMethod: string;
    defaultCategoryId?: string;
}