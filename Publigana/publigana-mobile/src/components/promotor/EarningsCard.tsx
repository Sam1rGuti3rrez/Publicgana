import { StyleSheet, Text, View } from "react-native";

import Card from "@/components/cards/Card";
import { colors } from "@/theme/colors";

interface EarningsCardProps {
  title: string;
  amount: string;
  growthLabel: string;
}

export default function EarningsCard({ title, amount, growthLabel }: EarningsCardProps) {
  return (
    <Card style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>{amount}</Text>
      <View style={styles.growthPill}>
        <Text style={styles.growthText}>{growthLabel}</Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 22,
    paddingVertical: 20,
    paddingHorizontal: 18,
    backgroundColor: "#2D1666",
    borderColor: "#4A2B93",
    gap: 10,
  },
  title: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
  amount: {
    color: colors.textPrimary,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  growthPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: colors.success + "22",
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  growthText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "700",
  },
});
