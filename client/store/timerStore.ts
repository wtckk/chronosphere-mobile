import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TimerState } from '@/types/task';
import { TIMER_METHODS, TIMER_METHOD_SETTINGS } from '@/constants/timerMethods';
import { useTaskStore } from './taskStore';

interface TimerStoreState extends TimerState {
    startTimer: (taskId: string, timerMethod: string) => void;
    pauseTimer: () => void;
    resumeTimer: () => void;
    stopTimer: () => void;
    resetTimer: () => void;
    updateElapsedTime: (time: number) => void;
    handlePomodoroStateChange: () => void;
}

export const useTimerStore = create<TimerStoreState>()(
    persist(
        (set, get) => ({
            isRunning: false,
            isPaused: false,
            currentTaskId: null,
            currentSessionId: null,
            startTime: null,
            pauseTime: null,
            elapsedTime: 0,
            timerMethod: TIMER_METHODS.REGULAR,
            pomodoroState: {
                currentSession: 1,
                isBreak: false,
            },

            startTimer: (taskId, timerMethod) => {
                const { startSession } = useTaskStore.getState();
                const { sessionId } = startSession(taskId);

                set({
                    isRunning: true,
                    isPaused: false,
                    currentTaskId: taskId,
                    currentSessionId: sessionId,
                    startTime: Date.now(),
                    pauseTime: null,
                    elapsedTime: 0,
                    timerMethod,
                    pomodoroState: {
                        currentSession: 1,
                        isBreak: false,
                    },
                });
            },

            pauseTimer: () => {
                if (!get().isRunning || get().isPaused) return;

                const { pauseSession } = useTaskStore.getState();
                const sessionId = get().currentSessionId;

                if (sessionId) {
                    pauseSession(sessionId);
                }

                set({
                    isPaused: true,
                    pauseTime: Date.now(),
                });
            },

            resumeTimer: () => {
                if (!get().isPaused) return;

                const { resumeSession } = useTaskStore.getState();
                const sessionId = get().currentSessionId;

                if (sessionId) {
                    resumeSession(sessionId);
                }

                set((state) => {
                    const pauseDuration = state.pauseTime ? Date.now() - state.pauseTime : 0;
                    return {
                        isPaused: false,
                        pauseTime: null,
                    };
                });
            },

            stopTimer: () => {
                const { stopSession } = useTaskStore.getState();
                const sessionId = get().currentSessionId;

                if (sessionId) {
                    stopSession(sessionId);
                }

                set({
                    isRunning: false,
                    isPaused: false,
                    currentTaskId: null,
                    currentSessionId: null,
                    startTime: null,
                    pauseTime: null,
                    elapsedTime: 0,
                });
            },

            resetTimer: () => {
                set({
                    isRunning: false,
                    isPaused: false,
                    currentTaskId: null,
                    currentSessionId: null,
                    startTime: null,
                    pauseTime: null,
                    elapsedTime: 0,
                    pomodoroState: {
                        currentSession: 1,
                        isBreak: false,
                    },
                });
            },

            updateElapsedTime: (time) => {
                set({ elapsedTime: time });
            },

            handlePomodoroStateChange: () => {
                const { timerMethod, pomodoroState } = get();

                if (timerMethod !== TIMER_METHODS.POMODORO || !pomodoroState) return;

                const settings = TIMER_METHOD_SETTINGS[TIMER_METHODS.POMODORO];
                const { currentSession, isBreak } = pomodoroState;

                // Default to 4 sessions if sessionsBeforeLongBreak is undefined
                const sessionsBeforeLongBreak = settings.sessionsBeforeLongBreak || 4;

                if (isBreak) {
                    // If we're finishing a break
                    set({
                        pomodoroState: {
                            currentSession: currentSession < sessionsBeforeLongBreak ? currentSession + 1 : 1,
                            isBreak: false,
                        },
                    });
                } else {
                    // If we're finishing a work session
                    const isLongBreak = currentSession === sessionsBeforeLongBreak;

                    set({
                        pomodoroState: {
                            currentSession,
                            isBreak: true,
                        },
                    });
                }
            },
        }),
        {
            name: 'timer-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);