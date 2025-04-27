import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Task, TimerSession, Category } from '@/types/task';
import { DEFAULT_CATEGORIES } from '@/constants/categories';
import { TIMER_METHODS } from '@/constants/timerMethods';
import { getDayKey, getWeekKey } from '@/utils/timeUtils';
import { categoryColors } from '@/constants/colors';
import { CATEGORY_ICONS } from '@/constants/categories';

interface TaskState {
    tasks: Task[];
    categories: Category[];

    // Task actions
    addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'sessions' | 'totalTimeSpent' | 'isActive'>) => string;
    updateTask: (id: string, updates: Partial<Task>) => void;
    deleteTask: (id: string) => void;

    // Category actions
    addCategory: (category: Omit<Category, 'id'>) => string;
    updateCategory: (id: string, updates: Partial<Category>) => void;
    deleteCategory: (id: string) => void;

    // Timer session actions
    startSession: (taskId: string) => { taskId: string, sessionId: string };
    pauseSession: (sessionId: string) => void;
    resumeSession: (sessionId: string) => void;
    stopSession: (sessionId: string) => void;
    updateSessionDuration: (sessionId: string, duration: number) => void;

    // Stats
    getTotalTimeToday: () => number;
    getCompletedTasksToday: () => number;
    getTasksByDay: (date: Date) => Task[];
    getTimeSpentByDay: (date: Date) => number;
    getTimeSpentByWeek: (date: Date) => Record<string, number>;
    getUsedCategoryIds: () => string[];
    getCustomCategoriesCount: () => number;
}

export const useTaskStore = create<TaskState>()(
    persist(
        (set, get) => ({
            tasks: [],
            categories: DEFAULT_CATEGORIES,

            addTask: (taskData) => {
                const id = Date.now().toString();
                const newTask: Task = {
                    id,
                    ...taskData,
                    totalTimeSpent: 0,
                    isActive: false,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    sessions: [],
                };

                set((state) => ({
                    tasks: [...state.tasks, newTask],
                }));

                return id;
            },

            updateTask: (id, updates) => {
                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === id ? { ...task, ...updates, updatedAt: Date.now() } : task
                    ),
                }));
            },

            deleteTask: (id) => {
                set((state) => ({
                    tasks: state.tasks.filter((task) => task.id !== id),
                }));
            },

            addCategory: (categoryData) => {
                const id = Date.now().toString();
                const newCategory: Category = {
                    id,
                    ...categoryData,
                    isCustom: true,
                };

                set((state) => ({
                    categories: [...state.categories, newCategory],
                }));

                return id;
            },

            updateCategory: (id, updates) => {
                set((state) => ({
                    categories: state.categories.map((category) =>
                        category.id === id ? { ...category, ...updates } : category
                    ),
                }));
            },

            deleteCategory: (id) => {
                // Don't allow deleting default categories
                const category = get().categories.find(c => c.id === id);
                if (!category?.isCustom) return;

                set((state) => ({
                    categories: state.categories.filter((category) => category.id !== id),
                }));
            },

            startSession: (taskId) => {
                const sessionId = Date.now().toString();
                const newSession: TimerSession = {
                    id: sessionId,
                    taskId,
                    startTime: Date.now(),
                    duration: 0,
                    isCompleted: false,
                    isPaused: false,
                };

                set((state) => ({
                    tasks: state.tasks.map((task) =>
                        task.id === taskId
                            ? {
                                ...task,
                                isActive: true,
                                sessions: [...task.sessions, newSession],
                            }
                            : task
                    ),
                }));

                return { taskId, sessionId };
            },

            pauseSession: (sessionId) => {
                set((state) => ({
                    tasks: state.tasks.map((task) => {
                        const sessionIndex = task.sessions.findIndex((s) => s.id === sessionId);
                        if (sessionIndex === -1) return task;

                        const updatedSessions = [...task.sessions];
                        updatedSessions[sessionIndex] = {
                            ...updatedSessions[sessionIndex],
                            isPaused: true,
                            pausedAt: Date.now(),
                        };

                        return {
                            ...task,
                            sessions: updatedSessions,
                        };
                    }),
                }));
            },

            resumeSession: (sessionId) => {
                set((state) => ({
                    tasks: state.tasks.map((task) => {
                        const sessionIndex = task.sessions.findIndex((s) => s.id === sessionId);
                        if (sessionIndex === -1) return task;

                        const session = task.sessions[sessionIndex];
                        const pauseDuration = session.pausedAt
                            ? (Date.now() - session.pausedAt)
                            : 0;

                        const updatedSessions = [...task.sessions];
                        updatedSessions[sessionIndex] = {
                            ...session,
                            isPaused: false,
                            pausedAt: undefined,
                            pauseDuration: (session.pauseDuration || 0) + pauseDuration,
                        };

                        return {
                            ...task,
                            sessions: updatedSessions,
                        };
                    }),
                }));
            },

            stopSession: (sessionId) => {
                set((state) => ({
                    tasks: state.tasks.map((task) => {
                        const sessionIndex = task.sessions.findIndex((s) => s.id === sessionId);
                        if (sessionIndex === -1) return task;

                        const session = task.sessions[sessionIndex];
                        const endTime = Date.now();
                        let duration = Math.floor((endTime - session.startTime) / 1000);

                        // Subtract pause duration if any
                        if (session.pauseDuration) {
                            duration -= Math.floor(session.pauseDuration / 1000);
                        }

                        // If paused, calculate duration up to pause time
                        if (session.isPaused && session.pausedAt) {
                            duration = Math.floor((session.pausedAt - session.startTime) / 1000);
                            if (session.pauseDuration) {
                                duration -= Math.floor(session.pauseDuration / 1000);
                            }
                        }

                        const updatedSessions = [...task.sessions];
                        updatedSessions[sessionIndex] = {
                            ...session,
                            endTime,
                            duration,
                            isCompleted: true,
                            isPaused: false,
                        };

                        return {
                            ...task,
                            isActive: false,
                            totalTimeSpent: task.totalTimeSpent + duration,
                            sessions: updatedSessions,
                        };
                    }),
                }));
            },

            updateSessionDuration: (sessionId, duration) => {
                set((state) => ({
                    tasks: state.tasks.map((task) => {
                        const sessionIndex = task.sessions.findIndex((s) => s.id === sessionId);
                        if (sessionIndex === -1) return task;

                        const updatedSessions = [...task.sessions];
                        const oldDuration = updatedSessions[sessionIndex].duration;
                        updatedSessions[sessionIndex] = {
                            ...updatedSessions[sessionIndex],
                            duration,
                        };

                        return {
                            ...task,
                            totalTimeSpent: task.totalTimeSpent - oldDuration + duration,
                            sessions: updatedSessions,
                        };
                    }),
                }));
            },

            getTotalTimeToday: () => {
                const today = getDayKey();
                return get().tasks.reduce((total, task) => {
                    const todaySessions = task.sessions.filter((session) => {
                        const sessionDate = new Date(session.startTime);
                        return getDayKey(sessionDate) === today && session.isCompleted;
                    });

                    const todayTime = todaySessions.reduce((sum, session) => sum + session.duration, 0);
                    return total + todayTime;
                }, 0);
            },

            getCompletedTasksToday: () => {
                const today = getDayKey();
                const tasksWithCompletedSessions = get().tasks.filter((task) => {
                    return task.sessions.some((session) => {
                        const sessionDate = new Date(session.startTime);
                        return getDayKey(sessionDate) === today && session.isCompleted;
                    });
                });

                return tasksWithCompletedSessions.length;
            },

            getTasksByDay: (date) => {
                const dayKey = getDayKey(date);
                return get().tasks.filter((task) => {
                    return task.sessions.some((session) => {
                        const sessionDate = new Date(session.startTime);
                        return getDayKey(sessionDate) === dayKey;
                    });
                });
            },

            getTimeSpentByDay: (date) => {
                const dayKey = getDayKey(date);
                return get().tasks.reduce((total, task) => {
                    const daySessions = task.sessions.filter((session) => {
                        const sessionDate = new Date(session.startTime);
                        return getDayKey(sessionDate) === dayKey && session.isCompleted;
                    });

                    const dayTime = daySessions.reduce((sum, session) => sum + session.duration, 0);
                    return total + dayTime;
                }, 0);
            },

            getTimeSpentByWeek: (date) => {
                const weekDays: Record<string, number> = {};
                const weekStart = new Date(date);
                weekStart.setDate(weekStart.getDate() - weekStart.getDay());

                for (let i = 0; i < 7; i++) {
                    const day = new Date(weekStart);
                    day.setDate(weekStart.getDate() + i);
                    const dayKey = getDayKey(day);
                    weekDays[dayKey] = 0;
                }

                get().tasks.forEach((task) => {
                    task.sessions.forEach((session) => {
                        if (!session.isCompleted) return;

                        const sessionDate = new Date(session.startTime);
                        const dayKey = getDayKey(sessionDate);

                        if (weekDays[dayKey] !== undefined) {
                            weekDays[dayKey] += session.duration;
                        }
                    });
                });

                return weekDays;
            },

            getUsedCategoryIds: () => {
                const categoryIds = new Set<string>();
                get().tasks.forEach(task => {
                    if (task.sessions.some(s => s.isCompleted)) {
                        categoryIds.add(task.categoryId);
                    }
                });
                return Array.from(categoryIds);
            },

            getCustomCategoriesCount: () => {
                return get().categories.filter(c => c.isCustom).length;
            },
        }),
        {
            name: 'task-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);