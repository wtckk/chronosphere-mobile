import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAchievementStore } from '@/store/achievementStore';
import { useThemeStore } from '@/store/themeStore';
import AchievementCard from '@/components/AchievementCard';

export default function AchievementsScreen() {
    const { getAchievements, checkAchievements } = useAchievementStore();
    const { colors } = useThemeStore();

    useEffect(() => {
        // Check for new achievements when the screen is loaded
        checkAchievements();
    }, []);

    const achievements = getAchievements();
    const unlockedCount = achievements.filter(a => a.unlocked).length;

    // Group achievements by type
    const taskAchievements = achievements.filter(a => a.type === 'task');
    const timeAchievements = achievements.filter(a => a.type === 'time');
    const streakAchievements = achievements.filter(a => a.type === 'streak');
    const categoryAchievements = achievements.filter(a => a.type === 'category');

    const renderSectionHeader = (title: string) => (
        <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <ScrollView style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Достижения</Text>

                <View style={[styles.summaryContainer, { backgroundColor: colors.card }]}>
                    <Text style={[styles.summaryText, { color: colors.text }]}>
                        Разблокировано {unlockedCount} из {achievements.length} достижений
                    </Text>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                { width: `${(unlockedCount / achievements.length) * 100}%` }
                            ]}
                        />
                    </View>
                </View>

                {renderSectionHeader('Задачи')}
                {taskAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                ))}

                {renderSectionHeader('Время')}
                {timeAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                ))}

                {renderSectionHeader('Серии')}
                {streakAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                ))}

                {renderSectionHeader('Категории')}
                {categoryAchievements.map(achievement => (
                    <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    summaryContainer: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    summaryText: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#E5E5E5',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#8A56AC',
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 8,
        marginBottom: 16,
    },
});