import { StyleSheet, Text, View } from "react-native";

import AppButton from "@/components/buttons/AppButton";
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
      <View style={styles.brandRow}>
        <Text style={styles.brandName}>
          Publi<Text style={styles.brandNameAccent}>Gana</Text>
        </Text>
        <View style={styles.profileMark}>
          <Text style={styles.profileMarkText}>S</Text>
        </View>
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>{amount}</Text>

      <Text style={styles.growthText}>{growthLabel}</Text>

      <AppButton
        label="Retirar dinero"
        variant="gold"
        onPress={() => undefined}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#2D1666",
    borderColor: "#351A73",
    gap: 8,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileMark: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  profileMarkText: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "800",
  },
  brandName: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "800",
  },
  brandNameAccent: {
    color: colors.gold,
  },
  title: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "700",
  },
  amount: {
    color: colors.gold,
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  growthText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "700",
    marginTop: -2,
    marginBottom: 8,
  },
});
