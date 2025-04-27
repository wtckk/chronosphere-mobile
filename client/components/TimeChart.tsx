import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '@/constants/colors';

interface TimeChartProps {
    data: Record<string, number>;
    labels: string[];
    height?: number;
    showLabels?: boolean;
}

export const TimeChart: React.FC<TimeChartProps> = ({
                                                        data,
                                                        labels,
                                                        height = 200,
                                                        showLabels = true,
                                                    }) => {
    const chartWidth = Dimensions.get('window').width - 48;
    const chartHeight = height - 30; // Leave space for labels

    const values = Object.values(data);
    const maxValue = Math.max(...values, 1) * 1.1; // Add 10% padding

    const getY = (value: number) => {
        return chartHeight - (value / maxValue) * chartHeight;
    };

    const getPath = () => {
        if (values.length === 0) return '';

        const segmentWidth = chartWidth / (values.length - 1);

        let path = `M 0,${getY(values[0])}`;

        for (let i = 1; i < values.length; i++) {
            const x = i * segmentWidth;
            const y = getY(values[i]);

            // Use bezier curves for smoother lines
            const prevX = (i - 1) * segmentWidth;
            const prevY = getY(values[i - 1]);

            const cp1x = prevX + segmentWidth / 3;
            const cp1y = prevY;
            const cp2x = x - segmentWidth / 3;
            const cp2y = y;

            path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x},${y}`;
        }

        return path;
    };

    return (
        <View style={styles.container}>
            <Svg width={chartWidth} height={height}>
                {/* Horizontal grid lines */}
                {[0.25, 0.5, 0.75, 1].map((ratio, index) => {
                    const y = getY(maxValue * ratio);
                    return (
                        <Line
                            key={index}
                            x1={0}
                            y1={y}
                            x2={chartWidth}
                            y2={y}
                            stroke={colors.grayLight}
                            strokeWidth={1}
                            strokeDasharray="5,5"
                        />
                    );
                })}

                {/* Chart line */}
                <Path
                    d={getPath()}
                    fill="none"
                    stroke={colors.primary}
                    strokeWidth={3}
                />

                {/* X-axis labels */}
                {showLabels && labels.map((label, index) => {
                    const x = (index / (labels.length - 1)) * chartWidth;
                    return (
                        <SvgText
                            key={index}
                            x={x}
                            y={height - 5}
                            fontSize={10}
                            fill={colors.textSecondary}
                            textAnchor="middle"
                        >
                            {label}
                        </SvgText>
                    );
                })}
            </Svg>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 16,
    },
});

export default TimeChart;