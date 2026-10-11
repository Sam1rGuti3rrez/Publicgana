import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/theme/colors";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  rightSlot?: ReactNode;
}

export default function SectionHeader({ title, subtitle, rightSlot }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightSlot ? <View>{rightSlot}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  left: {
    flexShrink: 1,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
});
