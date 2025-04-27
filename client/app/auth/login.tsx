import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Mail, Lock } from 'lucide-react-native';
import { useAuthStore } from '@/store/authStore';
import { colors } from '@/constants/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function LoginScreen() {
    const router = useRouter();
    const { login, isLoading } = useAuthStore();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        try {
            await login(email, password);
            router.replace('/');
        } catch (err) {
            setError('Неверный email или пароль');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Почта</Text>
                <Input
                    placeholder="nikita.shutnikov89@gmail.com"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon={<Mail size={20} color={colors.textSecondary} />}
                />

                <Text style={styles.title}>Пароль</Text>
                <Input
                    placeholder="************"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    icon={<Lock size={20} color={colors.textSecondary} />}
                />

                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                <Button
                    title="Войти"
                    onPress={handleLogin}
                    loading={isLoading}
                    style={styles.loginButton}
                />

                <Text style={styles.orText}>или войти с помощью соцсетей</Text>

                <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.socialButton}>
                        <Image
                            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                            style={styles.socialIcon}
                        />
                        <Text style={styles.socialButtonText}>Продолжить с Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialButton}>
                        <Image
                            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg' }}
                            style={styles.socialIcon}
                        />
                        <Text style={styles.socialButtonText}>Продолжить с Telegram</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        marginBottom: 8,
        color: colors.text,
    },
    errorText: {
        color: colors.error,
        marginBottom: 16,
    },
    loginButton: {
        marginTop: 24,
    },
    orText: {
        textAlign: 'center',
        marginVertical: 24,
        color: colors.textSecondary,
    },
    socialButtons: {
        gap: 16,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: colors.grayLight,
    },
    socialIcon: {
        width: 24,
        height: 24,
        marginRight: 12,
    },
    socialButtonText: {
        fontSize: 16,
        color: colors.text,
    },
});