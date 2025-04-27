import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Flame } from 'lucide-react-native';
import { Task } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { useTimerStore } from '@/store/timerStore';
import { useStreakStore } from '@/store/streakStore';
import { useAchievementStore } from '@/store/achievementStore';
import { useThemeStore } from '@/store/themeStore';
import { formatTimeHMS } from '@/utils/timeUtils';
import TaskCard from '@/components/TaskCard';

export default function TasksScreen() {
    const router = useRouter();
    const { tasks, getTotalTimeToday } = useTaskStore();
    const { startTimer } = useTimerStore();
    const { currentStreak, checkInToday } = useStreakStore();
    const { checkAchievements } = useAchievementStore();
    const { colors } = useThemeStore();
    const [totalTime, setTotalTime] = useState(0);

    useEffect(() => {
        // Check in for streak tracking
        checkInToday();

        // Check achievements
        checkAchievements();

        setTotalTime(getTotalTimeToday());

        // Update total time every second
        const interval = setInterval(() => {
            setTotalTime(getTotalTimeToday());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const handleTaskPress = (task: Task) => {
        router.push(`/task/${task.id}`);
    };

    const handlePlayPress = (task: Task) => {
        startTimer(task.id, task.timerMethod);
        router.push(`/timer/${task.id}`);
    };

    const todayTasks = tasks.filter(task => {
        const today = new Date().toISOString().split('T')[0];
        const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
        return taskDate === today;
    });

    const renderHeader = () => (
        <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>Задачи</Text>
            <TouchableOpacity
                style={[styles.streakContainer, { backgroundColor: '#FFEEEE' }]}
                onPress={() => router.push('/achievements')}
            >
                <Flame size={20} color="#FF4D4F" />
                {currentStreak > 0 && (
                    <Text style={styles.streakText}>{currentStreak}</Text>
                )}
            </TouchableOpacity>
        </View>
    );

    // @ts-ignore
    const renderTotalTime = () => (
        <TouchableOpacity
            style={[styles.totalTimeContainer, { backgroundColor: colors.backgroundDark }]}
            onPress={() => router.push('/stats')}
        >
            <Text style={styles.totalTimeText}>{formatTimeHMS(totalTime)}</Text>
            <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
    );

    const renderSectionHeader = (title: string, onPress?: () => void) => (
        <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
            {onPress && (
                <TouchableOpacity onPress={onPress}>
                    <Text style={[styles.seeAllText, { color: colors.primary }]}>Все задачи</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            {renderHeader()}
            {renderTotalTime()}

            <ScrollView style={styles.content}>
                {renderSectionHeader('Сегодня', () => {})}

                {todayTasks.length > 0 ? (
                    todayTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onPress={handleTaskPress}
                            onPlayPress={handlePlayPress}
                        />
                    ))
                ) : (
                    <View style={[styles.emptyContainer, { backgroundColor: colors.card }]}>
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Нет задач на сегодня</Text>
                        <TouchableOpacity
                            style={[styles.createButton, { backgroundColor: colors.primary }]}
                            onPress={() => router.push('/create')}
                        >
                            <Text style={styles.createButtonText}>Создать задачу</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {tasks.length > todayTasks.length && (
                    <>
                        {renderSectionHeader('Все задачи')}
                        {tasks
                            .filter(task => {
                                const today = new Date().toISOString().split('T')[0];
                                const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
                                return taskDate !== today;
                            })
                            .slice(0, 3)
                            .map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onPress={handleTaskPress}
                                    onPlayPress={handlePlayPress}
                                />
                            ))}
                    </>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    streakContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEEEE',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
    },
    streakText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FF4D4F',
        marginLeft: 4,
    },
    totalTimeContainer: {
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 24,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalTimeText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    chevron: {
        fontSize: 24,
        color: '#FFFFFF',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    seeAllText: {
        fontSize: 14,
    },
    emptyContainer: {
        borderRadius: 16,
        padding: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyText: {
        fontSize: 16,
        marginBottom: 16,
    },
    createButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
    },
    createButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});