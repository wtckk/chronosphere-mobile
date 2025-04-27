import React from 'react';
import { View, StyleSheet, Text, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { colors } from '@/constants/colors';

interface CircularProgressProps {
    size: number;
    strokeWidth: number;
    progress: number;
    children?: React.ReactNode;
    style?: ViewStyle;
    progressColor?: string;
    backgroundColor?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
                                                                      size,
                                                                      strokeWidth,
                                                                      progress,
                                                                      children,
                                                                      style,
                                                                      progressColor = colors.primary,
                                                                      backgroundColor = '#E5E5E5',
                                                                  }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressValue = Math.min(Math.max(progress, 0), 1);
    const strokeDashoffset = circumference * (1 - progressValue);

    return (
        <View style={[styles.container, { width: size, height: size }, style]}>
            <Svg width={size} height={size}>
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={backgroundColor}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                />
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={progressColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    transform={`rotate(-90, ${size / 2}, ${size / 2})`}
                />
            </Svg>
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default CircularProgress;