import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play } from 'lucide-react-native';
import { Task } from '@/types/task';
import { useTaskStore } from '@/store/taskStore';
import { useThemeStore } from '@/store/themeStore';
import { formatTimeHMS } from '@/utils/timeUtils';

interface TaskCardProps {
    task: Task;
    onPress: (task: Task) => void;
    onPlayPress: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onPress, onPlayPress }) => {
    const { categories } = useTaskStore();
    const { colors } = useThemeStore();
    const category = categories.find(c => c.id === task.categoryId);

    // @ts-ignore
    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.card }]}
            onPress={() => onPress(task)}
            activeOpacity={0.7}
        >
            <View style={styles.leftSection}>
                <View
                    style={[
                        styles.categoryIcon,
                        { backgroundColor: category?.color.bg || colors.primary }
                    ]}
                >
                    {category?.icon && (
                        <Text style={styles.categoryIconText}>{category.icon}</Text>
                    )}
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.title, { color: colors.text }]}>{task.name}</Text>
                    {category && (
                        <Text style={[styles.category, { color: colors.textSecondary }]}>{category.name}</Text>
                    )}
                </View>
            </View>

            <View style={styles.rightSection}>
                <Text style={[styles.time, { color: colors.text }]}>{formatTimeHMS(task.totalTimeSpent)}</Text>
                <TouchableOpacity
                    style={[styles.playButton, { backgroundColor: colors.primary }]}
                    onPress={() => onPlayPress(task)}
                >
                    <Play size={20} color={colors.white} />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryIconText: {
        fontSize: 18,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    category: {
        fontSize: 14,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    time: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
    },
    playButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default TaskCard;