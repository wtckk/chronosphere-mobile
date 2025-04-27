import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Pause, Square } from 'lucide-react-native';
import { useTaskStore } from '@/store/taskStore';
import { useTimerStore } from '@/store/timerStore';
import { useThemeStore } from '@/store/themeStore';
import { formatTimeForTimer } from '@/utils/timeUtils';
import { TIMER_METHODS, TIMER_METHOD_SETTINGS } from '@/constants/timerMethods';
import CircularProgress from '@/components/CircularProgress';
import CategoryTag from '@/components/CategoryTag';

export default function TimerScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { tasks, categories } = useTaskStore();
    const {
        isRunning,
        isPaused,
        elapsedTime,
        timerMethod,
        pauseTimer,
        resumeTimer,
        stopTimer,
        updateElapsedTime,
    } = useTimerStore();
    const { colors } = useThemeStore();

    const [progress, setProgress] = useState(0);
    const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

    const task = tasks.find(t => t.id === id);
    const category = task ? categories.find(c => c.id === task.categoryId) : null;

    const startTimeRef = useRef<number>(Date.now());
    const pauseTimeRef = useRef<number | null>(null);
    const totalPauseDurationRef = useRef<number>(0);

    useEffect(() => {
        if (!task) {
            router.replace('/');
            return;
        }

        startTimeRef.current = Date.now();

        // Start the timer
        const interval = setInterval(() => {
            if (isPaused) return;

            const now = Date.now();
            const elapsed = Math.floor((now - startTimeRef.current - totalPauseDurationRef.current) / 1000);
            updateElapsedTime(elapsed);

            // Update progress based on timer method
            if (timerMethod === TIMER_METHODS.POMODORO) {
                const settings = TIMER_METHOD_SETTINGS[TIMER_METHODS.POMODORO];
                const workDuration = settings.workDuration || 25 * 60; // Default to 25 minutes if undefined
                setProgress(elapsed / workDuration);
            } else if (timerMethod === TIMER_METHODS.FIVE_MIN) {
                const settings = TIMER_METHOD_SETTINGS[TIMER_METHODS.FIVE_MIN];
                const duration = settings.duration || 5 * 60; // Default to 5 minutes if undefined
                setProgress(elapsed / duration);
            } else {
                // For regular timer, progress is based on 1 hour (3600 seconds)
                setProgress(Math.min(elapsed / 3600, 1));
            }
        }, 1000);

        setTimerInterval(interval);

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [task, isPaused]);

    const handlePauseResume = () => {
        if (isPaused) {
            const pauseDuration = pauseTimeRef.current ? Date.now() - pauseTimeRef.current : 0;
            totalPauseDurationRef.current += pauseDuration;
            pauseTimeRef.current = null;
            resumeTimer();
        } else {
            pauseTimeRef.current = Date.now();
            pauseTimer();
        }
    };

    const handleStop = () => {
        if (timerInterval) clearInterval(timerInterval);
        stopTimer();
        router.replace('/');
    };

    if (!task || !category) return null;

    // @ts-ignore
    return (
        <>
            <Stack.Screen
                options={{
                    title: '',
                    headerBackTitle: 'Назад',
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.text,
                }}
            />
            <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={[styles.taskName, { color: colors.text }]}>{task.name.toUpperCase()}</Text>
                        <CategoryTag category={category} />
                    </View>

                    <View style={styles.timerContainer}>
                        <CircularProgress
                            size={280}
                            strokeWidth={12}
                            progress={progress}
                            progressColor={colors.primary}
                            backgroundColor={colors.grayLight}
                        >
                            <Text style={[styles.timerText, { color: colors.text }]}>
                                {formatTimeForTimer(elapsedTime)}
                            </Text>
                        </CircularProgress>
                    </View>

                    <View style={styles.controls}>
                        <TouchableOpacity
                            style={[
                                styles.controlButton,
                                isPaused ? styles.resumeButton : styles.pauseButton,
                                { backgroundColor: isPaused ? colors.primary : colors.primary }
                            ]}
                            onPress={handlePauseResume}
                        >
                            {isPaused ? (
                                <Text style={styles.controlButtonText}>Продолжить</Text>
                            ) : (
                                <>
                                    <Pause size={24} color={colors.white} />
                                    <Text style={styles.controlButtonText}>Пауза</Text>
                                </>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.controlButton, styles.stopButton, { backgroundColor: colors.backgroundDark }]}
                            onPress={handleStop}
                        >
                            <Square size={24} color={colors.white} />
                            <Text style={styles.controlButtonText}>Стоп</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    taskName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    timerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 60,
    },
    timerText: {
        fontSize: 48,
        fontWeight: 'bold',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
        gap: 20,
    },
    controlButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 30,
        minWidth: 120,
        gap: 8,
    },
    pauseButton: {
        backgroundColor: '#8A56AC',
    },
    resumeButton: {
        backgroundColor: '#8A56AC',
    },
    stopButton: {
        backgroundColor: '#17171F',
    },
    controlButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});