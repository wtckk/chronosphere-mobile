import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Switch, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LogOut, Settings, Bell, Moon, HelpCircle, Shield, Plus } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { useTaskStore } from '@/store/taskStore';
import { colors } from '@/constants/colors';
import Button from '@/components/Button';
import CategoryForm from '@/components/CategoryForm';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuthStore();
    const { theme, toggleTheme, setTheme } = useThemeStore();
    const { categories, updateCategory, deleteCategory } = useTaskStore();
    const { colors: themeColors } = useThemeStore();

    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);

    const handleLogout = () => {
        logout();
        router.replace('/auth/login');
    };

    const handleThemeToggle = () => {
        toggleTheme();
    };

    const handleEditCategory = (category: any) => {
        setSelectedCategory(category);
        setCategoryModalVisible(true);
    };

    const handleCategorySubmit = (name: string, color: { bg: string; text: string }, icon: string) => {
        if (selectedCategory) {
            updateCategory(selectedCategory.id, { name, color, icon });
        }
        setCategoryModalVisible(false);
        setSelectedCategory(null);
    };

    const customCategories = categories.filter(c => c.isCustom);

    const menuItems = [
        {
            icon: <Bell size={24} color={themeColors.text} />,
            title: 'Уведомления',
            onPress: () => {},
        },
        {
            icon: <Moon size={24} color={themeColors.text} />,
            title: 'Темная тема',
            onPress: handleThemeToggle,
            isSwitch: true,
            value: theme === 'dark',
        },
        {
            icon: <HelpCircle size={24} color={themeColors.text} />,
            title: 'Помощь',
            onPress: () => {},
        },
        {
            icon: <Shield size={24} color={themeColors.text} />,
            title: 'Конфиденциальность',
            onPress: () => {},
        },
    ];

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]} edges={['bottom']}>
            <ScrollView style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.profileInfo}>
                        <View style={[styles.avatarContainer, { backgroundColor: colors.primary }]}>
                            <Text style={styles.avatarText}>{user?.name?.[0] || 'U'}</Text>
                        </View>
                        <View>
                            <Text style={[styles.name, { color: themeColors.text }]}>{user?.name || 'Пользователь'}</Text>
                            <Text style={[styles.email, { color: themeColors.textSecondary }]}>{user?.email || 'user@example.com'}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.menuContainer, { backgroundColor: themeColors.card }]}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.menuItem, { borderBottomColor: themeColors.border }]}
                            onPress={item.onPress}
                        >
                            <View style={[styles.menuIconContainer, { backgroundColor: themeColors.background }]}>{item.icon}</View>
                            <Text style={[styles.menuTitle, { color: themeColors.text }]}>{item.title}</Text>
                            {item.isSwitch ? (
                                <Switch
                                    value={item.value}
                                    onValueChange={item.onPress}
                                    trackColor={{ false: '#767577', true: colors.primary }}
                                    thumbColor={item.value ? colors.primaryLight : '#f4f3f4'}
                                />
                            ) : (
                                <Text style={[styles.menuArrow, { color: themeColors.textSecondary }]}>›</Text>
                            )}
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={[styles.sectionTitle, { color: themeColors.text }]}>Мои категории</Text>

                <View style={[styles.categoriesContainer, { backgroundColor: themeColors.card }]}>
                    {customCategories.length > 0 ? (
                        customCategories.map((category) => (
                            <TouchableOpacity
                                key={category.id}
                                style={[styles.categoryItem, { borderBottomColor: themeColors.border }]}
                                onPress={() => handleEditCategory(category)}
                            >
                                <View style={[styles.categoryIcon, { backgroundColor: category.color.bg }]}>
                                    <Text style={styles.categoryIconText}>{category.icon}</Text>
                                </View>
                                <Text style={[styles.categoryName, { color: themeColors.text }]}>{category.name}</Text>
                                <Text style={[styles.menuArrow, { color: themeColors.textSecondary }]}>›</Text>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View style={styles.emptyCategoriesContainer}>
                            <Text style={[styles.emptyCategoriesText, { color: themeColors.textSecondary }]}>
                                У вас пока нет собственных категорий
                            </Text>
                        </View>
                    )}
                </View>

                <Button
                    title="Выйти"
                    onPress={handleLogout}
                    variant="outline"
                    style={styles.logoutButton}
                    icon={<LogOut size={20} color={colors.primary} style={{ marginRight: 8 }} />}
                />
            </ScrollView>

            <Modal
                visible={categoryModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => {
                    setCategoryModalVisible(false);
                    setSelectedCategory(null);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <CategoryForm
                            initialName={selectedCategory?.name}
                            initialColor={selectedCategory?.color}
                            initialIcon={selectedCategory?.icon}
                            onSubmit={handleCategorySubmit}
                            onCancel={() => {
                                setCategoryModalVisible(false);
                                setSelectedCategory(null);
                            }}
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
    },
    header: {
        padding: 20,
    },
    profileInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 32,
        fontWeight: 'bold',
        color: colors.white,
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
    },
    menuContainer: {
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 24,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    menuIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuTitle: {
        flex: 1,
        fontSize: 16,
    },
    menuArrow: {
        fontSize: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginHorizontal: 20,
        marginBottom: 12,
    },
    categoriesContainer: {
        borderRadius: 16,
        marginHorizontal: 20,
        marginBottom: 24,
        overflow: 'hidden',
    },
    categoryItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
    },
    categoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    categoryIconText: {
        fontSize: 20,
    },
    categoryName: {
        flex: 1,
        fontSize: 16,
    },
    emptyCategoriesContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyCategoriesText: {
        fontSize: 14,
        textAlign: 'center',
    },
    logoutButton: {
        marginHorizontal: 20,
        marginBottom: 20,
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