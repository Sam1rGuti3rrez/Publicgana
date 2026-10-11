import { useMemo } from "react";
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import AppButton from "@/components/buttons/AppButton";
import Card from "@/components/cards/Card";
import StatCard from "@/components/cards/StatCard";
import Badge from "@/components/common/Badge";
import Avatar from "@/components/common/Avatar";
import SectionHeader from "@/components/common/SectionHeader";
import RoleSwitcher from "@/components/common/RoleSwitcher";
import ProgressBar from "@/components/charts/ProgressBar";
import ResponsiveContainer from "@/components/layout/ResponsiveContainer";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";

type EmpresaCampaign = {
  id: number;
  title: string;
  status: "activa" | "pausada";
  reach: number;
  spent: number;
  budgetUsed: number;
};

const COMPANY_NAME = "TechCorp S.A.S";

const ACTIVE_CAMPAIGNS: EmpresaCampaign[] = [
  {
    id: 1,
    title: "Electronica XR 2026",
    status: "activa",
    reach: 234,
    spent: 819000,
    budgetUsed: 72,
  },
  {
    id: 2,
    title: "Gaming Fest 2026",
    status: "activa",
    reach: 148,
    spent: 520000,
    budgetUsed: 49,
  },
];

const PAUSED_CAMPAIGNS: EmpresaCampaign[] = [
  {
    id: 3,
    title: "Moda Verano 2026",
    status: "pausada",
    reach: 89,
    spent: 178000,
    budgetUsed: 30,
  },
];

export default function EmpresaDashboard() {
  const router = useRouter();
  const { devRole, setDevRole } = useAuth();
  const { width } = useWindowDimensions();

  const handleRoleChange = (nextRole: "promotor" | "empresa") => {
    setDevRole(nextRole);
    router.replace(nextRole === "empresa" ? "/empresa/(tabs)" : "/promotor/(tabs)");
  };

  const statColumns = useMemo(() => {
    if (width >= 980) return "31%";
    if (width >= 580) return "48%";
    return "100%";
  }, [width]);

  return (
    <ResponsiveContainer maxWidth={1120} contentStyle={styles.screenPadding}>
      <RoleSwitcher value={devRole} onChange={handleRoleChange} style={styles.roleSwitcher} />

      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <View style={styles.companyBlock}>
            <Text style={styles.kicker}>Portal Empresa</Text>
            <Text style={styles.companyName}>{COMPANY_NAME}</Text>
            <Text style={styles.companySub}>Gestion centralizada de tus campanas.</Text>
          </View>
          <Avatar name={COMPANY_NAME} size={48} />
        </View>

        <View style={styles.headerActions}>
          <AppButton label="Nueva campana" onPress={() => router.push("/empresa/(tabs)/create")} />
        </View>
      </View>

      <SectionHeader
        title="Estadisticas principales"
        subtitle="Visibilidad en tiempo real de rendimiento y ejecucion"
      />

      <View style={styles.statsGrid}>
        <View style={[styles.statSlot, { flexBasis: statColumns }]}>
          <StatCard label="Campanas activas" value="5" accent={colors.info} />
        </View>
        <View style={[styles.statSlot, { flexBasis: statColumns }]}>
          <StatCard label="Invertido del mes" value="$2.4M" accent={colors.secondary} />
        </View>
        <View style={[styles.statSlot, { flexBasis: statColumns }]}>
          <StatCard label="Compartidos" value="1.248" accent={colors.success} />
        </View>
      </View>

      <SectionHeader
        title="Acciones rapidas"
        subtitle="Flujos frecuentes para el equipo de marketing"
      />

      <View style={styles.quickActionsRow}>
        <View style={styles.quickActionSlot}>
          <AppButton
            label="Ver analisis"
            variant="secondary"
            onPress={() => router.push("/empresa/(tabs)/analytics")}
          />
        </View>
        <View style={styles.quickActionSlot}>
          <AppButton
            label="Gestionar campanas"
            variant="secondary"
            onPress={() => router.push("/empresa/(tabs)/campaigns")}
          />
        </View>
      </View>

      <SectionHeader title="Campanas activas" subtitle="Campanas con ejecucion en curso" />
      <View style={styles.stack}>
        {ACTIVE_CAMPAIGNS.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </View>

      <SectionHeader title="Campanas pausadas" subtitle="Listas para reactivarse" />
      <View style={styles.stack}>
        {PAUSED_CAMPAIGNS.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </View>
    </ResponsiveContainer>
  );
}

function CampaignCard({ campaign }: { campaign: EmpresaCampaign }) {
  const tone = campaign.status === "activa" ? "success" : "warning";

  return (
    <Card>
      <View style={styles.campaignHead}>
        <Text style={styles.campaignTitle}>{campaign.title}</Text>
        <Badge label={campaign.status === "activa" ? "Activa" : "Pausada"} tone={tone} />
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>
          Alcance: <Text style={styles.metaStrong}>{campaign.reach} usuarios</Text>
        </Text>
        <Text style={styles.metaText}>
          Gasto: <Text style={styles.metaStrong}>${campaign.spent.toLocaleString("es-CO")}</Text>
        </Text>
      </View>

      <Text style={styles.progressText}>{campaign.budgetUsed}% del presupuesto usado</Text>
      <ProgressBar value={campaign.budgetUsed} color={campaign.status === "activa" ? colors.info : colors.warning} />

      <View style={styles.actionRow}>
        <Pressable style={styles.actionButton}>
          <Ionicons name="create-outline" size={14} color={colors.muted} />
          <Text style={styles.actionText}>Editar</Text>
        </Pressable>
        <Pressable style={styles.actionButton}>
          <Ionicons name={campaign.status === "activa" ? "pause-outline" : "play-outline"} size={14} color={colors.muted} />
          <Text style={styles.actionText}>{campaign.status === "activa" ? "Pausar" : "Reactivar"}</Text>
        </Pressable>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  screenPadding: {
    paddingTop: 18,
  },
  roleSwitcher: {
    marginBottom: 12,
  },
  headerCard: {
    width: "100%",
    backgroundColor: "#102441",
    borderWidth: 1,
    borderColor: "#1D3B63",
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },
  companyBlock: {
    flex: 1,
  },
  kicker: {
    color: colors.info,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  companyName: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  companySub: {
    color: "#76A4D0",
    fontSize: 13,
    marginTop: 3,
  },
  headerActions: {
    marginTop: 14,
  },
  statsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  statSlot: {
    minWidth: 240,
    flexGrow: 1,
  },
  quickActionsRow: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 18,
  },
  quickActionSlot: {
    minWidth: 220,
    flexGrow: 1,
  },
  stack: {
    width: "100%",
    gap: 10,
    marginBottom: 18,
  },
  campaignHead: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 10,
  },
  campaignTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    gap: 14,
    flexWrap: "wrap",
    marginBottom: 10,
  },
  metaText: {
    color: colors.muted,
    fontSize: 12,
  },
  metaStrong: {
    color: colors.textPrimary,
    fontWeight: "700",
  },
  progressText: {
    color: colors.muted,
    fontSize: 11,
    marginBottom: 6,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  actionText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "700",
  },
});
