import React, { useState } from 'react';
import {
    View,
    TextInput,
    Text,
    StyleSheet,
    TouchableOpacity,
    ViewStyle,
    TextStyle,
    TextInputProps,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface InputProps extends TextInputProps {
    label?: string;
    error?: string;
    icon?: React.ReactNode;
    containerStyle?: ViewStyle;
    labelStyle?: TextStyle;
    inputStyle?: TextStyle;
    errorStyle?: TextStyle;
}

export const Input: React.FC<InputProps> = ({
                                                label,
                                                error,
                                                icon,
                                                containerStyle,
                                                labelStyle,
                                                inputStyle,
                                                errorStyle,
                                                secureTextEntry,
                                                ...rest
                                            }) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <View style={[styles.container, containerStyle]}>
            {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
            <View style={[styles.inputContainer, error && styles.inputError]}>
                {icon && <View style={styles.iconContainer}>{icon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        icon && styles.inputWithIcon,
                        secureTextEntry && styles.inputWithToggle,
                        inputStyle,
                    ]}
                    placeholderTextColor={colors.grayDark}
                    secureTextEntry={secureTextEntry && !isPasswordVisible}
                    {...rest}
                />
                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.toggleButton}
                        onPress={togglePasswordVisibility}
                    >
                        {isPasswordVisible ? (
                            <EyeOff size={20} color={colors.textSecondary} />
                        ) : (
                            <Eye size={20} color={colors.textSecondary} />
                        )}
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text style={[styles.errorText, errorStyle]}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: colors.text,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.grayLight,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: colors.error,
    },
    iconContainer: {
        paddingLeft: 16,
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.text,
    },
    inputWithIcon: {
        paddingLeft: 8,
    },
    inputWithToggle: {
        paddingRight: 48,
    },
    toggleButton: {
        position: 'absolute',
        right: 16,
        height: '100%',
        justifyContent: 'center',
    },
    errorText: {
        color: colors.error,
        fontSize: 14,
        marginTop: 4,
    },
});

export default Input;