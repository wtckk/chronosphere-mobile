import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { colors, categoryColors } from '@/constants/colors';
import { CATEGORY_ICONS } from '@/constants/categories';
import { useThemeStore } from '@/store/themeStore';
import Button from '@/components/Button';

interface CategoryFormProps {
    initialName?: string;
    initialColor?: { bg: string; text: string };
    initialIcon?: string;
    onSubmit: (name: string, color: { bg: string; text: string }, icon: string) => void;
    onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
                                                              initialName = '',
                                                              initialColor = categoryColors.work,
                                                              initialIcon = Object.values(CATEGORY_ICONS)[0],
                                                              onSubmit,
                                                              onCancel,
                                                          }) => {
    const { colors: themeColors } = useThemeStore();
    const [name, setName] = useState(initialName);
    const [selectedColor, setSelectedColor] = useState(initialColor);
    const [selectedIcon, setSelectedIcon] = useState(initialIcon);

    const colorOptions = Object.values(categoryColors);
    const iconOptions = Object.values(CATEGORY_ICONS);

    const handleSubmit = () => {
        if (!name.trim()) return;
        onSubmit(name.trim(), selectedColor, selectedIcon);
    };

    return (
        <View style={[styles.container, { backgroundColor: themeColors.background }]}>
            <Text style={[styles.title, { color: themeColors.text }]}>
                {initialName ? 'Редактировать категорию' : 'Новая категория'}
            </Text>

            <Text style={[styles.label, { color: themeColors.text }]}>Название</Text>
            <TextInput
                style={[styles.input, { backgroundColor: themeColors.card, color: themeColors.text }]}
                placeholder="Название категории"
                placeholderTextColor={themeColors.textSecondary}
                value={name}
                onChangeText={setName}
            />

            <Text style={[styles.label, { color: themeColors.text }]}>Цвет</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorContainer}>
                {colorOptions.map((color, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.colorOption,
                            { backgroundColor: color.bg },
                            selectedColor.bg === color.bg && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedColor(color)}
                    />
                ))}
            </ScrollView>

            <Text style={[styles.label, { color: themeColors.text }]}>Иконка</Text>
            <ScrollView style={styles.iconScrollView}>
                <View style={styles.iconContainer}>
                    {iconOptions.map((icon, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.iconOption,
                                { backgroundColor: themeColors.card },
                                selectedIcon === icon && { backgroundColor: selectedColor.bg },
                            ]}
                            onPress={() => setSelectedIcon(icon)}
                        >
                            <Text style={styles.iconText}>{icon}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>

            <View style={styles.buttonContainer}>
                <Button
                    title="Отмена"
                    onPress={onCancel}
                    variant="outline"
                    style={styles.cancelButton}
                />
                <Button
                    title={initialName ? 'Сохранить' : 'Создать'}
                    onPress={handleSubmit}
                    disabled={!name.trim()}
                    style={styles.submitButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        borderRadius: 16,
        maxHeight: '80%',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    colorContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },
    selectedOption: {
        borderWidth: 3,
        borderColor: colors.white,
    },
    iconScrollView: {
        maxHeight: 200,
    },
    iconContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
    },
    iconOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
    },
    iconText: {
        fontSize: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    cancelButton: {
        flex: 1,
        marginRight: 8,
    },
    submitButton: {
        flex: 1,
        marginLeft: 8,
    },
});

export default CategoryForm;