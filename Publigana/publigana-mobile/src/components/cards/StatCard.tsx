import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";

import Card from "@/components/cards/Card";
import { colors } from "@/theme/colors";

interface StatCardProps extends PropsWithChildren {
  label: string;
  value: string;
  accent?: string;
}

export default function StatCard({
  label,
  value,
  accent = colors.info,
  children,
}: StatCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
      {children ? <View style={styles.slot}>{children}</View> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 112,
    justifyContent: "center",
    gap: 6,
  },
  value: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  slot: {
    marginTop: 4,
  },
});
