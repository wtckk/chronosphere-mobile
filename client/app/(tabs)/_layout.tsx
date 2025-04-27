import React from 'react';
import { Tabs } from 'expo-router';
import { Home, BarChart3, User, PlusCircle, Award } from 'lucide-react-native';
import { useThemeStore } from '@/store/themeStore';

export default function TabLayout() {
    const { colors } = useThemeStore();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.textSecondary,
                tabBarStyle: {
                    backgroundColor: colors.card,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
                headerStyle: {
                    backgroundColor: colors.card,
                },
                headerTitleStyle: {
                    fontWeight: '600',
                    fontSize: 18,
                    color: colors.text,
                },
                headerShadowVisible: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Задачи',
                    tabBarLabel: 'Задачи',
                    tabBarIcon: ({ color, size }) => (
                        <Home size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="create"
                options={{
                    title: 'Новая задача',
                    tabBarLabel: 'Добавить',
                    tabBarIcon: ({ color, size }) => (
                        <PlusCircle size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="stats"
                options={{
                    title: 'Статистика',
                    tabBarLabel: 'Статистика',
                    tabBarIcon: ({ color, size }) => (
                        <BarChart3 size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="achievements"
                options={{
                    title: 'Достижения',
                    tabBarLabel: 'Достижения',
                    tabBarIcon: ({ color, size }) => (
                        <Award size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Профиль',
                    tabBarLabel: 'Профиль',
                    tabBarIcon: ({ color, size }) => (
                        <User size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}