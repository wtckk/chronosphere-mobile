import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Category } from '@/types/task';

interface CategoryTagProps {
    category: Category;
    onPress?: () => void;
    style?: ViewStyle;
    textStyle?: TextStyle;
    selected?: boolean;
}

export const CategoryTag: React.FC<CategoryTagProps> = ({
                                                            category,
                                                            onPress,
                                                            style,
                                                            textStyle,
                                                            selected = false,
                                                        }) => {
    return (
        <TouchableOpacity
            style={[
                styles.container,
                { backgroundColor: category.color.bg },
                selected && styles.selected,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {category.icon && (
                <Text style={styles.icon}>{category.icon}</Text>
            )}
            <Text
                style={[
                    styles.text,
                    { color: category.color.text },
                    textStyle,
                ]}
            >
                {category.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    selected: {
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    icon: {
        fontSize: 16,
        marginRight: 6,
    },
    text: {
        fontSize: 14,
        fontWeight: '500',
    },
});

export default CategoryTag;