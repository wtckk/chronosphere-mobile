import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, CheckCircle } from 'lucide-react-native';
import { useTaskStore } from '@/store/taskStore';
import { formatTimeHMS, getWeekDays, getDayKey, getDayName } from '@/utils/timeUtils';
import { colors } from '@/constants/colors';
import StatsCard from '@/components/StatsCard';
import TimeChart from '@/components/TimeChart';

type ViewMode = 'day' | 'week';

export default function StatsScreen() {
    const { getTotalTimeToday, getCompletedTasksToday, getTimeSpentByDay, getTimeSpentByWeek } = useTaskStore();
    const [viewMode, setViewMode] = useState<ViewMode>('day');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [timeData, setTimeData] = useState<Record<string, number>>({});
    const [labels, setLabels] = useState<string[]>([]);

    useEffect(() => {
        updateChartData();
    }, [viewMode, selectedDate]);

    const updateChartData = () => {
        if (viewMode === 'day') {
            // Show hourly data for the selected day
            const hourlyData: Record<string, number> = {};
            const hourLabels: string[] = [];

            for (let i = 8; i <= 20; i++) {
                const hour = i < 10 ? `0${i}` : `${i}`;
                hourlyData[hour] = Math.random() * 3600; // Mock data
                hourLabels.push(`${i}${i === 8 ? 'am' : i === 12 ? 'pm' : ''}`);
            }

            setTimeData(hourlyData);
            setLabels(hourLabels);
        } else {
            // Show daily data for the selected week
            const weekDays = getWeekDays(selectedDate);
            const dailyData: Record<string, number> = {};
            const dayLabels: string[] = [];

            weekDays.forEach(day => {
                const dayKey = getDayKey(day);
                dailyData[dayKey] = getTimeSpentByDay(day);
                dayLabels.push(getDayName(day, true).toUpperCase().slice(0, 3));
            });

            setTimeData(dailyData);
            setLabels(dayLabels);
        }
    };

    const toggleViewMode = () => {
        setViewMode(viewMode === 'day' ? 'week' : 'day');
    };

    return (
        <SafeAreaView style={styles.container} edges={['bottom']}>
            <ScrollView style={styles.content}>
                <Text style={styles.title}>Статистика</Text>

                <View style={styles.statsCards}>
                    <StatsCard
                        title="Выполнено задач"
                        value={getCompletedTasksToday()}
                        icon={<CheckCircle size={24} color={colors.success} />}
                        style={styles.statsCard}
                        color={colors.success}
                    />

                    <StatsCard
                        title="Общее время"
                        value={formatTimeHMS(getTotalTimeToday())}
                        icon={<Clock size={24} color={colors.primary} />}
                        style={styles.statsCard}
                    />
                </View>

                <View style={styles.chartContainer}>
                    <View style={styles.chartHeader}>
                        <TouchableOpacity
                            style={[
                                styles.viewModeButton,
                                viewMode === 'day' && styles.activeViewMode,
                            ]}
                            onPress={() => setViewMode('day')}
                        >
                            <Text
                                style={[
                                    styles.viewModeText,
                                    viewMode === 'day' && styles.activeViewModeText,
                                ]}
                            >
                                День
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.viewModeButton,
                                viewMode === 'week' && styles.activeViewMode,
                            ]}
                            onPress={() => setViewMode('week')}
                        >
                            <Text
                                style={[
                                    styles.viewModeText,
                                    viewMode === 'week' && styles.activeViewModeText,
                                ]}
                            >
                                Неделя
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TimeChart
                        data={timeData}
                        labels={labels}
                        height={200}
                    />
                </View>

                {viewMode === 'week' && (
                    <View style={styles.calendarContainer}>
                        <View style={styles.calendarHeader}>
                            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
                                <Text key={index} style={styles.calendarHeaderText}>
                                    {day}
                                </Text>
                            ))}
                        </View>

                        <View style={styles.calendarDays}>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                                <TouchableOpacity
                                    key={day}
                                    style={[
                                        styles.calendarDay,
                                        day === 19 && styles.selectedCalendarDay,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.calendarDayText,
                                            day === 19 && styles.selectedCalendarDayText,
                                        ]}
                                    >
                                        {day}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
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
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.text,
        marginBottom: 24,
    },
    statsCards: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    statsCard: {
        flex: 1,
        marginRight: 12,
    },
    chartContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    chartHeader: {
        flexDirection: 'row',
        backgroundColor: colors.grayLight,
        borderRadius: 8,
        marginBottom: 16,
        padding: 4,
    },
    viewModeButton: {
        flex: 1,
        paddingVertical: 8,
        alignItems: 'center',
        borderRadius: 6,
    },
    activeViewMode: {
        backgroundColor: colors.white,
    },
    viewModeText: {
        fontSize: 14,
        color: colors.textSecondary,
    },
    activeViewModeText: {
        color: colors.text,
        fontWeight: '600',
    },
    calendarContainer: {
        backgroundColor: colors.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    calendarHeader: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    calendarHeaderText: {
        flex: 1,
        textAlign: 'center',
        fontSize: 12,
        color: colors.textSecondary,
    },
    calendarDays: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    calendarDay: {
        width: '14.28%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    selectedCalendarDay: {
        backgroundColor: colors.backgroundDark,
        borderRadius: 20,
    },
    calendarDayText: {
        fontSize: 14,
        color: colors.text,
    },
    selectedCalendarDayText: {
        color: colors.white,
        fontWeight: '600',
    },
});