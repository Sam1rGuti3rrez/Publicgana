import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";

interface AppButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "gold";
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export default function AppButton({
  label,
  onPress,
  variant = "primary",
  fullWidth = true,
  loading = false,
  disabled = false,
  style,
}: AppButtonProps) {
  const isPrimary = variant === "primary";
  const isGold = variant === "gold";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : isGold ? styles.gold : styles.secondary,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        pressed && !(disabled || loading) && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.textPrimary : colors.muted} />
      ) : (
        <Text style={[styles.label, isGold ? styles.labelGold : isPrimary ? styles.labelPrimary : styles.labelSecondary]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 14,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  primary: {
    backgroundColor: colors.info,
  },
  secondary: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gold: {
    backgroundColor: colors.gold,
  },
  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.86,
  },
  label: {
    fontSize: 14,
    fontWeight: "700",
  },
  labelPrimary: {
    color: colors.textPrimary,
  },
  labelGold: {
    color: colors.background,
  },
  labelSecondary: {
    color: colors.muted,
  },
});
