import React from "react";
import {
    TextInput,
    View,
    Text,
    StyleSheet,
} from "react-native";

import { Colors } from "@/theme/colors";

interface InputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    secureTextEntry?: boolean;
    keyboardType?:
        | "default"
        | "email-address"
        | "numeric"
        | "phone-pad";
}

export default function Input({
                                  label,
                                  placeholder,
                                  value,
                                  onChangeText,
                                  secureTextEntry = false,
                                  keyboardType = "default",
                              }: InputProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={Colors.placeholder}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                keyboardType={keyboardType}
                autoCapitalize="none"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 18,
    },

    label: {
        color: Colors.white,
        marginBottom: 8,
        fontWeight: "600",
        fontSize: 15,
    },

    input: {
        height: 56,

        backgroundColor: Colors.inputBackground,

        borderRadius: 14,

        paddingHorizontal: 18,

        color: Colors.white,

        borderWidth: 1,

        borderColor: Colors.border,

        fontSize: 16,
    },
});