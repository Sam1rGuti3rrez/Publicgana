import { StyleSheet, Text, View } from "react-native";

import Card from "@/components/cards/Card";
import Badge from "@/components/common/Badge";
import EmptyState from "@/components/common/EmptyState";
import SectionHeader from "@/components/common/SectionHeader";
import ProgressBar from "@/components/charts/ProgressBar";
import ResponsiveContainer from "@/components/layout/ResponsiveContainer";
import { colors } from "@/theme/colors";

const campaigns = [
  {
    id: "1",
    title: "Electronica XR 2026",
    state: "Activa",
    progress: 72,
    budget: "$819.000",
  },
  {
    id: "2",
    title: "Moda Verano 2026",
    state: "Pausada",
    progress: 30,
    budget: "$178.000",
  },
];

export default function EmpresaCampaigns() {
  return (
    <ResponsiveContainer maxWidth={1120}>
      <SectionHeader title="Mis campanas" subtitle="Control de estado y presupuesto" />

      <View style={styles.list}>
        {campaigns.map((item) => (
          <Card key={item.id}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{item.title}</Text>
              <Badge label={item.state} tone={item.state === "Activa" ? "success" : "warning"} />
            </View>
            <Text style={styles.meta}>Presupuesto ejecutado: {item.budget}</Text>
            <Text style={styles.meta}>{item.progress}% del presupuesto usado</Text>
            <View style={styles.progressBox}>
              <ProgressBar
                value={item.progress}
                color={item.state === "Activa" ? colors.info : colors.warning}
              />
            </View>
          </Card>
        ))}
      </View>

      <View style={styles.separator} />

      <EmptyState
        title="Campanas finalizadas"
        message="Aun no hay campanas finalizadas para este periodo."
      />
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    width: "100%",
    gap: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 5,
  },
  progressBox: {
    marginTop: 4,
  },
  separator: {
    height: 16,
  },
});
