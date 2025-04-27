import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getDayKey } from '@/utils/timeUtils';

interface StreakState {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string | null;

    // Actions
    checkInToday: () => void;
    resetStreak: () => void;
    getStreakInfo: () => { current: number; longest: number; lastActive: string | null };
}

export const useStreakStore = create<StreakState>()(
    persist(
        (set, get) => ({
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: null,

            checkInToday: () => {
                const today = getDayKey();
                const { lastActiveDate, currentStreak, longestStreak } = get();

                // If first time using the app
                if (!lastActiveDate) {
                    set({
                        currentStreak: 1,
                        longestStreak: 1,
                        lastActiveDate: today,
                    });
                    return;
                }

                // If already checked in today
                if (lastActiveDate === today) {
                    return;
                }

                // Check if yesterday
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayKey = getDayKey(yesterday);

                if (lastActiveDate === yesterdayKey) {
                    // Consecutive day
                    const newStreak = currentStreak + 1;
                    set({
                        currentStreak: newStreak,
                        longestStreak: Math.max(longestStreak, newStreak),
                        lastActiveDate: today,
                    });
                } else {
                    // Streak broken
                    set({
                        currentStreak: 1,
                        lastActiveDate: today,
                    });
                }
            },

            resetStreak: () => {
                set({
                    currentStreak: 0,
                    lastActiveDate: null,
                });
            },

            getStreakInfo: () => {
                const { currentStreak, longestStreak, lastActiveDate } = get();
                return {
                    current: currentStreak,
                    longest: longestStreak,
                    lastActive: lastActiveDate,
                };
            },
        }),
        {
            name: 'streak-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);