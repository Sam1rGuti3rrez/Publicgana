import { StyleSheet, Text } from "react-native";

import Card from "@/components/cards/Card";
import { colors } from "@/theme/colors";

interface EmptyStateProps {
  title: string;
  message: string;
}

export default function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: "center",
    gap: 6,
    paddingVertical: 24,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
    maxWidth: 340,
  },
});
