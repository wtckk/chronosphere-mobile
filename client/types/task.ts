export interface Category {
    id: string;
    name: string;
    color: {
        bg: string;
        text: string;
    };
    icon: string;
    isCustom?: boolean;
}

export interface Task {
    id: string;
    name: string;
    description?: string;
    categoryId: string;
    timerMethod: string;
    totalTimeSpent: number; // in seconds
    isActive: boolean;
    createdAt: number;
    updatedAt: number;
    sessions: TimerSession[];
}

export interface TimerSession {
    id: string;
    taskId: string;
    startTime: number;
    endTime?: number;
    duration: number; // in seconds
    isCompleted: boolean;
    isPaused: boolean;
    pausedAt?: number;
    pauseDuration?: number;
}

export interface TimerState {
    isRunning: boolean;
    isPaused: boolean;
    currentTaskId: string | null;
    currentSessionId: string | null;
    startTime: number | null;
    pauseTime: number | null;
    elapsedTime: number;
    timerMethod: string;
    pomodoroState?: {
        currentSession: number;
        isBreak: boolean;
    };
}

export interface UserStats {
    totalTimeSpent: number;
    tasksCompleted: number;
    sessionsCompleted: number;
    streak: number;
    lastActiveDate: string;
    dailyStats: Record<string, {
        date: string;
        timeSpent: number;
        tasksCompleted: number;
    }>;
    weeklyStats: Record<string, {
        week: string;
        timeSpent: number;
        tasksCompleted: number;
    }>;
    achievements: {
        unlocked: string[];
        progress: Record<string, number>;
    };
}