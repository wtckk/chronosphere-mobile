import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { useTaskStore } from '@/store/taskStore';
import { useThemeStore } from '@/store/themeStore';
import { TIMER_METHODS } from '@/constants/timerMethods';
import Button from '@/components/Button';
import CategoryTag from '@/components/CategoryTag';
import TimerMethodSelector from '@/components/TimerMethodSelector';
import CategoryForm from '@/components/CategoryForm';

export default function CreateTaskScreen() {
    const router = useRouter();
    const { categories, addTask, addCategory } = useTaskStore();
    const { colors } = useThemeStore();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [timerMethod, setTimerMethod] = useState(TIMER_METHODS.REGULAR);
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);

    const handleCreateTask = () => {
        if (!name.trim()) {
            // Show error
            return;
        }

        const taskId = addTask({
            name: name.trim(),
            description: description.trim(),
            categoryId: selectedCategoryId || categories[0].id,
            timerMethod,
        });

        router.push('/');
    };

    const handleCreateCategory = (name: string, color: { bg: string; text: string }, icon: string) => {
        const categoryId = addCategory({ name, color, icon });
        setSelectedCategoryId(categoryId);
        setCategoryModalVisible(false);
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
            <ScrollView style={styles.content}>
                <Text style={[styles.title, { color: colors.text }]}>Новая задача</Text>

                <TimerMethodSelector
                    selectedMethod={timerMethod}
                    onSelect={setTimerMethod}
                />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Категории</Text>
                <View style={styles.categoriesContainer}>
                    <TouchableOpacity
                        style={[styles.addCategoryButton, { backgroundColor: colors.backgroundDark }]}
                        onPress={() => setCategoryModalVisible(true)}
                    >
                        <Plus size={20} color={colors.white} />
                    </TouchableOpacity>

                    {categories.map((category) => (
                        <CategoryTag
                            key={category.id}
                            category={category}
                            selected={category.id === selectedCategoryId}
                            onPress={() => setSelectedCategoryId(category.id)}
                        />
                    ))}
                </View>

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Название</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                    placeholder="Название"
                    placeholderTextColor={colors.textSecondary}
                    value={name}
                    onChangeText={setName}
                />

                <Text style={[styles.sectionTitle, { color: colors.text }]}>Описание (опционально)</Text>
                <TextInput
                    style={[styles.input, styles.textArea, { backgroundColor: colors.card, color: colors.text }]}
                    placeholder="Описание (опционально)"
                    placeholderTextColor={colors.textSecondary}
                    value={description}
                    onChangeText={setDescription}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                />
            </ScrollView>

            <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
                <Button
                    title="Создать"
                    onPress={handleCreateTask}
                    disabled={!name.trim()}
                    style={styles.createButton}
                />
            </View>

            <Modal
                visible={categoryModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setCategoryModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <CategoryForm
                            onSubmit={handleCreateCategory}
                            onCancel={() => setCategoryModalVisible(false)}
                        />
                    </View>
                </View>
            </Modal>
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
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    categoriesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 24,
    },
    addCategoryButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
        marginBottom: 8,
    },
    input: {
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        marginBottom: 24,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    footer: {
        padding: 20,
        borderTopWidth: 1,
    },
    createButton: {
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 16,
        overflow: 'hidden',
    },
});