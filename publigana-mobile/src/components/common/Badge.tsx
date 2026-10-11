import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

interface BadgeProps {
  label: string;
  tone?: "success" | "warning" | "neutral" | "info";
}

const toneConfig = {
  success: { bg: colors.success + "22", text: colors.success },
  warning: { bg: colors.warning + "22", text: colors.warning },
  neutral: { bg: colors.muted + "22", text: colors.muted },
  info: { bg: colors.info + "22", text: colors.info },
};

export default function Badge({ label, tone = "neutral" }: BadgeProps) {
  const toneStyle = toneConfig[tone];
  return (
    <View style={[styles.badge, { backgroundColor: toneStyle.bg }]}>
      <Text style={[styles.label, { color: toneStyle.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
  },
});
