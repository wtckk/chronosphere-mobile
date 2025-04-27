import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Achievement } from '@/constants/achievements';
import { colors } from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';

interface AchievementCardProps {
    achievement: Achievement;
    onPress?: () => void;
}

export const AchievementCard: React.FC<AchievementCardProps> = ({
                                                                    achievement,
                                                                    onPress,
                                                                }) => {
    const { colors: themeColors } = useThemeStore();

    const getLevelColor = () => {
        switch (achievement.level) {
            case 'bronze':
                return colors.bronze;
            case 'silver':
                return colors.silver;
            case 'gold':
                return colors.gold;
            case 'platinum':
                return colors.platinum;
            default:
                return colors.primary;
        }
    };

    const getProgressPercentage = () => {
        if (!achievement.progress) return 0;
        const percentage = Math.min((achievement.progress / achievement.requirement) * 100, 100);
        return `${percentage}%`;
    };

    const formatDate = (timestamp?: number) => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        return date.toLocaleDateString('ru-RU');
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: themeColors.card },
                achievement.unlocked && styles.unlockedContainer,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={[styles.iconContainer, { backgroundColor: getLevelColor() + '30' }]}>
                <Text style={styles.icon}>{achievement.icon}</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: themeColors.text }]}>{achievement.title}</Text>
                    <View style={[styles.levelBadge, { backgroundColor: getLevelColor() }]}>
                        <Text style={styles.levelText}>{achievement.level.toUpperCase()}</Text>
                    </View>
                </View>

                <Text style={[styles.description, { color: themeColors.textSecondary }]}>
                    {achievement.description}
                </Text>

                {achievement.unlocked ? (
                    <Text style={[styles.unlockedText, { color: colors.success }]}>
                        Получено {formatDate(achievement.unlockedAt)}
                    </Text>
                ) : (
                    <View style={styles.progressContainer}>
                        <View style={styles.progressBar}>
                            <View
                                style={[
                                    styles.progressFill,
                                    { width: getProgressPercentage(), backgroundColor: getLevelColor() }
                                ]}
                            />
                        </View>
                        <Text style={[styles.progressText, { color: themeColors.textSecondary }]}>
                            {achievement.progress || 0}/{achievement.requirement}
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: colors.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    unlockedContainer: {
        borderWidth: 1,
        borderColor: colors.success + '30',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    icon: {
        fontSize: 24,
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    levelBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 8,
    },
    levelText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: colors.white,
    },
    description: {
        fontSize: 14,
        marginBottom: 8,
    },
    unlockedText: {
        fontSize: 12,
        fontWeight: '500',
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressBar: {
        flex: 1,
        height: 6,
        backgroundColor: colors.grayLight,
        borderRadius: 3,
        overflow: 'hidden',
        marginRight: 8,
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default AchievementCard;