import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
} from "react-native";

import { colors } from "@/theme/colors";

interface ButtonProps {
    title: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
}

export default function Button({
                                   title,
                                   onPress,
                                   loading = false,
                                   disabled = false,
                               }: ButtonProps) {
    return (
        <TouchableOpacity
            activeOpacity={0.85}
            onPress={onPress}
            disabled={disabled || loading}
              style={[
        styles.button,
        disabled && styles.disabled,
      ]}
        >
            {loading ? (
                <ActivityIndicator color={Colors.background} />
            ) : (
                <Text style={styles.text}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.gold,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.6,
  },
  text: {
    color: colors.background,
    fontWeight: "700",
    fontSize: 17,
  },
});