import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Play, Edit2, Trash2 } from 'lucide-react-native';
import { useTaskStore } from '@/store/taskStore';
import { useTimerStore } from '@/store/timerStore';
import { formatTimeHMS } from '@/utils/timeUtils';
import { colors } from '@/constants/colors';
import CategoryTag from '@/components/CategoryTag';

export default function TaskDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const { tasks, categories, deleteTask } = useTaskStore();
    const { startTimer } = useTimerStore();

    const task = tasks.find(t => t.id === id);
    const category = task ? categories.find(c => c.id === task.categoryId) : null;

    const handleStartTimer = () => {
        if (task) {
            startTimer(task.id, task.timerMethod);
            router.push(`/timer/${task.id}`);
        }
    };

    const handleDeleteTask = () => {
        if (task) {
            deleteTask(task.id);
            router.back();
        }
    };

    if (!task || !category) {
        return (
            <View style={styles.container}>
                <Text>Задача не найдена</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: task.name,
                    headerBackTitle: 'Назад',
                }}
            />
            <SafeAreaView style={styles.container} edges={['bottom']}>
                <ScrollView style={styles.content}>
                    <View style={styles.header}>
                        <CategoryTag category={category} />
                        <Text style={styles.totalTime}>
                            Общее время: {formatTimeHMS(task.totalTimeSpent)}
                        </Text>
                    </View>

                    {task.description ? (
                        <View style={styles.descriptionContainer}>
                            <Text style={styles.descriptionTitle}>Описание</Text>
                            <Text style={styles.description}>{task.description}</Text>
                        </View>
                    ) : null}

                    <View style={styles.sessionsContainer}>
                        <Text style={styles.sessionsTitle}>История сессий</Text>

                        {task.sessions.length > 0 ? (
                            task.sessions.map((session, index) => (
                                <View key={session.id} style={styles.sessionItem}>
                                    <View style={styles.sessionInfo}>
                                        <Text style={styles.sessionDate}>
                                            {new Date(session.startTime).toLocaleDateString('ru-RU')}
                                        </Text>
                                        <Text style={styles.sessionTime}>
                                            {new Date(session.startTime).toLocaleTimeString('ru-RU', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Text>
                                    </View>
                                    <Text style={styles.sessionDuration}>
                                        {formatTimeHMS(session.duration)}
                                    </Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.noSessions}>Нет сессий</Text>
                        )}
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={handleDeleteTask}
                    >
                        <Trash2 size={24} color={colors.error} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {}}
                    >
                        <Edit2 size={24} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.startButton}
                        onPress={handleStartTimer}
                    >
                        <Play size={24} color={colors.white} />
                        <Text style={styles.startButtonText}>Начать</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    totalTime: {
        fontSize: 16,
        color: colors.text,
        fontWeight: '500',
    },
    descriptionContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    descriptionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    sessionsContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    sessionsTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 16,
    },
    sessionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: colors.grayLight,
    },
    sessionInfo: {
        flex: 1,
    },
    sessionDate: {
        fontSize: 16,
        color: colors.text,
        marginBottom: 4,
    },
    sessionTime: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    sessionDuration: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.primary,
    },
    noSessions: {
        fontSize: 16,
        color: colors.textSecondary,
        textAlign: 'center',
        paddingVertical: 16,
    },
    footer: {
        flexDirection: 'row',
        padding: 20,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.grayLight,
    },
    deleteButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: colors.error,
    },
    editButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: colors.grayLight,
    },
    startButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: colors.primary,
        borderRadius: 25,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    startButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
    },
});