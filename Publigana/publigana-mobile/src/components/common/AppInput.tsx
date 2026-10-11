import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";

import { colors } from "@/theme/colors";

interface AppInputProps extends TextInputProps {
  label: string;
  error?: string;
}

export default function AppInput({
  label,
  error,
  ...props
}: AppInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          error && styles.inputError,
        ]}
        {...props}
      />

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 18,
  },

  label: {
    color: colors.textPrimary,
    marginBottom: 8,
    fontWeight: "600",
    fontSize: 15,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    color: colors.textPrimary,
    fontSize: 16,
  },

  inputError: {
    borderColor: colors.danger,
  },

  error: {
    color: colors.danger,
    marginTop: 6,
    fontSize: 13,
  },
});