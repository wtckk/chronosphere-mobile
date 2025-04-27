import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '@/types/user';
import { authService } from '@/services/api';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User) => void;
    updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true });
                try {
                    // In a real app with backend integration:
                    // const response = await authService.login({ email, password });
                    // set({ user: response.data.user, isAuthenticated: true, isLoading: false });

                    // For demo purposes without backend:
                    const user = {
                        id: '1',
                        name: email.split('@')[0],
                        email,
                        token: 'demo-token',
                    };

                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    console.error('Login error:', error);
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (name, email, password) => {
                set({ isLoading: true });
                try {
                    // In a real app with backend integration:
                    // const response = await authService.register({ name, email, password });
                    // set({ user: response.data.user, isAuthenticated: true, isLoading: false });

                    // For demo purposes without backend:
                    const user = {
                        id: '1',
                        name,
                        email,
                        token: 'demo-token',
                    };

                    set({ user, isAuthenticated: true, isLoading: false });
                } catch (error) {
                    console.error('Registration error:', error);
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                // In a real app with backend integration:
                // authService.logout().catch(console.error);

                set({ user: null, isAuthenticated: false });
            },

            setUser: (user) => {
                set({ user, isAuthenticated: true });
            },

            updateUserProfile: async (userData) => {
                set({ isLoading: true });
                try {
                    // In a real app with backend integration:
                    // const response = await authService.updateUserProfile(userData);
                    // set({ user: response.data, isLoading: false });

                    // For demo purposes without backend:
                    const currentUser = get().user;
                    if (currentUser) {
                        const updatedUser = { ...currentUser, ...userData, updatedAt: Date.now() };
                        set({ user: updatedUser, isLoading: false });
                    }
                } catch (error) {
                    console.error('Update profile error:', error);
                    set({ isLoading: false });
                    throw error;
                }
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);