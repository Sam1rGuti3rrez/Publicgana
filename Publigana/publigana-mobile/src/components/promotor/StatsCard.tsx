import { StyleSheet, Text } from "react-native";

import Card from "@/components/cards/Card";
import { colors } from "@/theme/colors";

interface StatsCardProps {
  label: string;
  value: string;
  accent?: string;
}

export default function StatsCard({ label, value, accent = colors.secondary }: StatsCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={[styles.value, { color: accent }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 108,
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
});
