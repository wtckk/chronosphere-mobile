import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import colorSchemes from '@/constants/colors';

export type ThemeType = 'light' | 'dark' | 'system';

interface ThemeState {
    theme: ThemeType;
    isDarkMode: boolean;
    colors: typeof colorSchemes.light;
    setTheme: (theme: ThemeType) => void;
    toggleTheme: () => void;
    updateSystemTheme: (isDark: boolean) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            theme: 'light',
            isDarkMode: false,
            colors: colorSchemes.light,

            setTheme: (theme) => {
                const isDarkMode = theme === 'dark' || (theme === 'system' && get().isDarkMode);
                set({
                    theme,
                    isDarkMode,
                    colors: isDarkMode ? colorSchemes.dark : colorSchemes.light,
                });
            },

            toggleTheme: () => {
                const currentTheme = get().theme;
                const newTheme: ThemeType = currentTheme === 'light' ? 'dark' : 'light';
                get().setTheme(newTheme);
            },

            updateSystemTheme: (isDark) => {
                if (get().theme === 'system') {
                    set({
                        isDarkMode: isDark,
                        colors: isDark ? colorSchemes.dark : colorSchemes.light,
                    });
                }
            },
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);