import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ACHIEVEMENTS, Achievement } from '@/constants/achievements';
import { useTaskStore } from './taskStore';
import { useStreakStore } from './streakStore';

interface AchievementState {
    unlockedAchievements: string[];
    achievementProgress: Record<string, number>;

    // Actions
    checkAchievements: () => void;
    unlockAchievement: (id: string) => void;
    updateProgress: (id: string, progress: number) => void;
    getAchievements: () => Achievement[];
    resetAchievements: () => void;
}

export const useAchievementStore = create<AchievementState>()(
    persist(
        (set, get) => ({
            unlockedAchievements: [],
            achievementProgress: {},

            checkAchievements: () => {
                const { tasks } = useTaskStore.getState();
                const { currentStreak } = useStreakStore.getState();
                const { unlockedAchievements, achievementProgress, unlockAchievement, updateProgress } = get();

                // Calculate stats
                const totalTasks = tasks.filter(task =>
                    task.sessions.some(session => session.isCompleted)
                ).length;

                const totalTimeSpent = tasks.reduce((sum, task) => sum + task.totalTimeSpent, 0);

                const usedCategories = new Set(tasks.map(task => task.categoryId)).size;

                const customCategories = useTaskStore.getState().categories
                    .filter(cat => cat.isCustom).length;

                // Check task achievements
                ACHIEVEMENTS.filter(a => a.type === 'task').forEach(achievement => {
                    if (!unlockedAchievements.includes(achievement.id)) {
                        updateProgress(achievement.id, totalTasks);
                        if (totalTasks >= achievement.requirement) {
                            unlockAchievement(achievement.id);
                        }
                    }
                });

                // Check time achievements
                ACHIEVEMENTS.filter(a => a.type === 'time').forEach(achievement => {
                    if (!unlockedAchievements.includes(achievement.id)) {
                        updateProgress(achievement.id, totalTimeSpent);
                        if (totalTimeSpent >= achievement.requirement) {
                            unlockAchievement(achievement.id);
                        }
                    }
                });

                // Check streak achievements
                ACHIEVEMENTS.filter(a => a.type === 'streak').forEach(achievement => {
                    if (!unlockedAchievements.includes(achievement.id)) {
                        updateProgress(achievement.id, currentStreak);
                        if (currentStreak >= achievement.requirement) {
                            unlockAchievement(achievement.id);
                        }
                    }
                });

                // Check category achievements
                ACHIEVEMENTS.filter(a => a.type === 'category' && a.id === 'category_explorer').forEach(achievement => {
                    if (!unlockedAchievements.includes(achievement.id)) {
                        updateProgress(achievement.id, usedCategories);
                        if (usedCategories >= achievement.requirement) {
                            unlockAchievement(achievement.id);
                        }
                    }
                });

                // Check custom category achievements
                ACHIEVEMENTS.filter(a => a.type === 'category' && ['category_master', 'category_guru'].includes(a.id)).forEach(achievement => {
                    if (!unlockedAchievements.includes(achievement.id)) {
                        updateProgress(achievement.id, customCategories);
                        if (customCategories >= achievement.requirement) {
                            unlockAchievement(achievement.id);
                        }
                    }
                });
            },

            unlockAchievement: (id) => {
                set((state) => ({
                    unlockedAchievements: [...state.unlockedAchievements, id],
                }));
            },

            updateProgress: (id, progress) => {
                set((state) => ({
                    achievementProgress: {
                        ...state.achievementProgress,
                        [id]: progress,
                    },
                }));
            },

            getAchievements: () => {
                const { unlockedAchievements, achievementProgress } = get();

                return ACHIEVEMENTS.map(achievement => ({
                    ...achievement,
                    unlocked: unlockedAchievements.includes(achievement.id),
                    progress: achievementProgress[achievement.id] || 0,
                    unlockedAt: unlockedAchievements.includes(achievement.id) ? Date.now() : undefined,
                }));
            },

            resetAchievements: () => {
                set({
                    unlockedAchievements: [],
                    achievementProgress: {},
                });
            },
        }),
        {
            name: 'achievement-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);