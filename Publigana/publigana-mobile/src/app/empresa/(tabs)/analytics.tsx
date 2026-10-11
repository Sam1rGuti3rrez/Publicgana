import { StyleSheet, Text, View } from "react-native";

import Card from "@/components/cards/Card";
import StatCard from "@/components/cards/StatCard";
import SectionHeader from "@/components/common/SectionHeader";
import ResponsiveContainer from "@/components/layout/ResponsiveContainer";
import { colors } from "@/theme/colors";

export default function EmpresaAnalytics() {
  return (
    <ResponsiveContainer maxWidth={1120}>
      <SectionHeader title="Analisis" subtitle="Rendimiento general de campanas" />

      <View style={styles.statsRow}>
        <View style={styles.statSlot}>
          <StatCard label="Compartidos" value="1.248" accent={colors.success} />
        </View>
        <View style={styles.statSlot}>
          <StatCard label="Alcance total" value="94K" accent={colors.info} />
        </View>
        <View style={styles.statSlot}>
          <StatCard label="Interaccion" value="4.2%" accent={colors.secondary} />
        </View>
      </View>

      <Card>
        <Text style={styles.blockTitle}>Rendimiento por campana</Text>

        <View style={styles.row}>
          <Text style={styles.left}>Electronica XR 2026</Text>
          <Text style={[styles.right, { color: colors.success }]}>+234 compartidos</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.left}>Moda Verano 2026</Text>
          <Text style={[styles.right, { color: colors.info }]}>+89 compartidos</Text>
        </View>
        <View style={styles.rowLast}>
          <Text style={styles.left}>Gaming Fest 2026</Text>
          <Text style={styles.right}>12 compartidos</Text>
        </View>
      </Card>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  statsRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 14,
  },
  statSlot: {
    minWidth: 220,
    flexGrow: 1,
  },
  blockTitle: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "800",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rowLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    paddingTop: 8,
  },
  left: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  right: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
});
