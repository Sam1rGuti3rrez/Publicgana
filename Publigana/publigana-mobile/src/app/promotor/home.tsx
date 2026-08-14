import { useMemo } from "react";
import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";

import AppButton from "@/components/buttons/AppButton";
import RoleSwitcher from "@/components/common/RoleSwitcher";
import SectionHeader from "@/components/common/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import ResponsiveContainer from "@/components/layout/ResponsiveContainer";
import CampaignCard, {
  PromotorCampaign,
} from "@/components/promotor/CampaignCard";
import EarningsCard from "@/components/promotor/EarningsCard";
import StatsCard from "@/components/promotor/StatsCard";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/theme/colors";

const DASHBOARD_STATS = [
  {
    id: "active",
    label: "Campanas activas",
    value: "3",
    accent: colors.info,
  },
  {
    id: "pending",
    label: "Tareas pendientes",
    value: "5",
    accent: colors.secondary,
  },
  {
    id: "reach",
    label: "Seguidores alcanzados",
    value: "12.5K",
    accent: colors.success,
  },
];

const AVAILABLE_CAMPAIGNS: PromotorCampaign[] = [
  {
    id: 1,
    company: "Nike Colombia",
    platform: "Instagram",
    reward: "$35.000 COP",
    status: "activa",
  },
  {
    id: 2,
    company: "Samsung LATAM",
    platform: "TikTok",
    reward: "$52.000 COP",
    status: "nueva",
  },
  {
    id: 3,
    company: "Adidas",
    platform: "Facebook",
    reward: "$40.000 COP",
    status: "cerrando",
  },
];

export default function Home() {
  const router = useRouter();

  const {
    user,
    devRole,
    setDevRole,
  } = useAuth();

  const { width } = useWindowDimensions();

  // Nombre del usuario autenticado
  const userName = user?.nombres ?? "Usuario";

  const statBasis = useMemo(() => {
    if (width >= 980) return "31.5%";
    if (width >= 620) return "48%";
    return "100%";
  }, [width]);

  const handleRoleChange = (nextRole: "promotor" | "empresa") => {
    setDevRole(nextRole);

    router.replace(
      nextRole === "empresa"
        ? "/empresa/(tabs)"
        : "/promotor/(tabs)"
    );
  };

  const handleViewCampaign = () => {
    router.push("/promotor/(tabs)/campaigns");
  };

  return (
    <ResponsiveContainer
      maxWidth={980}
      contentStyle={styles.content}
    >
      <RoleSwitcher
        value={devRole}
        onChange={handleRoleChange}
      />

      <View style={styles.headerBlock}>
        <Text style={styles.greeting}>
          Hola, {userName} 👋
        </Text>

        <Text style={styles.subtitle}>
          Listo para ganar mas con tus campanas
        </Text>
      </View>

      <EarningsCard
        title="Ganancias acumuladas"
        amount="$250.000 COP"
        growthLabel="+12% este mes"
      />

      <SectionHeader
        title="Estadisticas"
        subtitle="Resumen de tu rendimiento actual"
      />

      <View style={styles.statsGrid}>
        {DASHBOARD_STATS.map((stat) => (
          <View
            key={stat.id}
            style={[
              styles.statSlot,
              { flexBasis: statBasis },
            ]}
          >
            <StatsCard
              label={stat.label}
              value={stat.value}
              accent={stat.accent}
            />
          </View>
        ))}
      </View>

      <SectionHeader
        title="Campanas disponibles"
        subtitle="Selecciona una campana y comienza a monetizar"
        rightSlot={
          <AppButton
            label="Ver todas"
            variant="secondary"
            fullWidth={false}
            onPress={() =>
              router.push("/promotor/(tabs)/campaigns")
            }
            style={styles.headerButton}
          />
        }
      />

      <View style={styles.campaignStack}>
        {AVAILABLE_CAMPAIGNS.length === 0 ? (
          <EmptyState
            title="No hay campanas por ahora"
            message="Pronto veras nuevas colaboraciones disponibles para tu perfil."
          />
        ) : (
          AVAILABLE_CAMPAIGNS.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onView={handleViewCampaign}
            />
          ))
        )}
      </View>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 18,
    paddingBottom: 42,
    gap: 16,
  },

  headerBlock: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  greeting: {
    color: colors.textPrimary,
    fontSize: 26,
    fontWeight: "800",
  },

  subtitle: {
    color: colors.textSecondary,
    marginTop: 6,
    fontSize: 14,
    fontWeight: "500",
  },

  statsGrid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },

  statSlot: {
    minWidth: 210,
    flexGrow: 1,
  },

  headerButton: {
    minHeight: 40,
    borderRadius: 12,
    paddingHorizontal: 12,
  },

  campaignStack: {
    width: "100%",
    gap: 10,
  },
});