import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, Timer } from 'lucide-react-native';
import { TIMER_METHODS, TIMER_METHOD_SETTINGS } from '@/constants/timerMethods';
import { useThemeStore } from '@/store/themeStore';

interface TimerMethodSelectorProps {
    selectedMethod: string;
    onSelect: (method: string) => void;
}

export const TimerMethodSelector: React.FC<TimerMethodSelectorProps> = ({
                                                                            selectedMethod,
                                                                            onSelect,
                                                                        }) => {
    const { colors } = useThemeStore();

    // @ts-ignore
    return (
        <View style={[styles.container, { backgroundColor: colors.grayLight }]}>
            <TouchableOpacity
                style={[
                    styles.methodButton,
                    selectedMethod === TIMER_METHODS.REGULAR && [styles.selectedMethod, { backgroundColor: colors.backgroundDark }],
                ]}
                onPress={() => onSelect(TIMER_METHODS.REGULAR)}
            >
                <Text style={[
                    styles.methodText,
                    { color: colors.textSecondary },
                    selectedMethod === TIMER_METHODS.REGULAR && [styles.selectedMethodText, { color: colors.white }],
                ]}>
                    Обычная
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.methodButton,
                    selectedMethod === TIMER_METHODS.POMODORO && [styles.selectedMethod, { backgroundColor: colors.backgroundDark }],
                ]}
                onPress={() => onSelect(TIMER_METHODS.POMODORO)}
            >
                <Text style={[
                    styles.methodText,
                    { color: colors.textSecondary },
                    selectedMethod === TIMER_METHODS.POMODORO && [styles.selectedMethodText, { color: colors.white }],
                ]}>
                    Помодоро
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.methodButton,
                    selectedMethod === TIMER_METHODS.FIVE_MIN && [styles.selectedMethod, { backgroundColor: colors.backgroundDark }],
                ]}
                onPress={() => onSelect(TIMER_METHODS.FIVE_MIN)}
            >
                <Text style={[
                    styles.methodText,
                    { color: colors.textSecondary },
                    selectedMethod === TIMER_METHODS.FIVE_MIN && [styles.selectedMethodText, { color: colors.white }],
                ]}>
                    5 минут
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 24,
        padding: 4,
        marginBottom: 24,
    },
    methodButton: {
        flex: 1,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedMethod: {
        backgroundColor: '#17171F',
    },
    methodText: {
        fontSize: 14,
        fontWeight: '500',
    },
    selectedMethodText: {
        color: '#FFFFFF',
    },
});

export default TimerMethodSelector;