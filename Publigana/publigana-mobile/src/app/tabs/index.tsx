import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import BalanceCard from "@/components/BalanceCard";
import { colors } from "@/theme/colors";
import { useHomeMode } from "@/hooks/useHomeMode";

const STAT_CARDS = [
  {
    icon: "image-outline" as const,
    title: "Publicaciones hoy",
    value: "8",
    color: "#E1306C",
  },
  {
    icon: "wallet-outline" as const,
    title: "Ganado hoy",
    value: "$35.000",
    color: colors.secondary,
  },
];

const ACTIVITY = [
  {
    id: 1,
    icon: "logo-instagram" as const,
    iconColor: "#E1306C",
    title: "Publicación compartida",
    when: "Instagram · Hoy",
    amount: "+$35.000",
  },
  {
    id: 2,
    icon: "logo-facebook" as const,
    iconColor: "#1877F2",
    title: "Video promocional",
    when: "Facebook · Ayer",
    amount: "+$50.000",
  },
];

export default function Home() {
  const { mode, setMode } = useHomeMode();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.logo}>
          Publi<Text style={{ color: colors.secondary }}>gana</Text>
        </Text>
        <Pressable style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* Modo toggle */}
      <View style={styles.switchContainer}>
        <Pressable
          onPress={() => setMode("usuario")}
          style={[styles.switchButton, mode === "usuario" && styles.activeButton]}
        >
          <Ionicons
            name="person-outline"
            size={14}
            color={mode === "usuario" ? colors.background : colors.muted}
            style={{ marginRight: 5 }}
          />
          <Text style={[styles.switchText, mode === "usuario" && styles.activeText]}>
            Influencer
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setMode("empresa")}
          style={[styles.switchButton, mode === "empresa" && styles.activeButton]}
        >
          <Ionicons
            name="business-outline"
            size={14}
            color={mode === "empresa" ? colors.background : colors.muted}
            style={{ marginRight: 5 }}
          />
          <Text style={[styles.switchText, mode === "empresa" && styles.activeText]}>
            Empresa
          </Text>
        </Pressable>
      </View>

      {mode === "usuario" ? <UserView /> : <CompanyView />}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

function UserView() {
  return (
    <>
      <BalanceCard userName="Brian" />

      {/* Stats */}
      <View style={styles.statsRow}>
        {STAT_CARDS.map((s) => (
          <View key={s.title} style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: s.color + "20" }]}>
              <Ionicons name={s.icon} size={20} color={s.color} />
            </View>
            <Text style={styles.statTitle}>{s.title}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
          </View>
        ))}
      </View>

      {/* Redes conectadas */}
      <Text style={styles.sectionTitle}>Redes conectadas</Text>
      <View style={styles.card}>
        {[
          { icon: "logo-instagram" as const, label: "Instagram", color: "#E1306C" },
          { icon: "logo-facebook"  as const, label: "Facebook",  color: "#1877F2" },
          { icon: "logo-tiktok"    as const, label: "TikTok",    color: "#FFFFFF" },
        ].map((net) => (
          <View key={net.label} style={styles.networkRow}>
            <View style={[styles.networkIcon, { backgroundColor: net.color + "22" }]}>
              <Ionicons name={net.icon} size={16} color={net.color} />
            </View>
            <Text style={styles.networkLabel}>{net.label}</Text>
            <View style={styles.connectedDot} />
          </View>
        ))}

        <View style={styles.rankRow}>
          <Ionicons name="star" size={14} color={colors.secondary} />
          <Text style={styles.rankText}>Rango: Pro</Text>
        </View>
      </View>

      {/* Actividad reciente */}
      <Text style={styles.sectionTitle}>Actividad reciente</Text>
      <View style={styles.card}>
        {ACTIVITY.map((item, i) => (
          <View key={item.id}>
            <View style={styles.activityRow}>
              <View style={[styles.activityIcon, { backgroundColor: item.iconColor + "22" }]}>
                <Ionicons name={item.icon} size={17} color={item.iconColor} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityWhen}>{item.when}</Text>
              </View>
              <Text style={styles.activityAmount}>{item.amount}</Text>
            </View>
            {i < ACTIVITY.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </>
  );
}

function CompanyView() {
  const COMPANY_CAMPAIGNS = [
    {
      id: 1,
      titulo: "Electrónica XR 2026",
      estado: "ACTIVA" as const,
      alcance: 234,
      gasto: 819000,
      progreso: 72,
    },
    {
      id: 2,
      titulo: "Moda Verano 2026",
      estado: "PAUSADA" as const,
      alcance: 89,
      gasto: 178000,
      progreso: 30,
    },
    {
      id: 3,
      titulo: "Gaming Fest 2026",
      estado: "BORRADOR" as const,
      presupuesto: 500000,
      redes: "TikTok, Instagram",
    },
  ];

  const STATUS_CONFIG = {
    ACTIVA:    { label: "Activa",    dot: colors.success, bg: colors.success + "20", text: colors.success },
    PAUSADA:   { label: "Pausada",   dot: colors.warning, bg: colors.warning + "20", text: colors.warning },
    BORRADOR:  { label: "Borrador",  dot: colors.muted,   bg: colors.muted   + "20", text: colors.muted   },
    FINALIZADA:{ label: "Finalizada",dot: colors.info,    bg: colors.info    + "20", text: colors.info    },
  };

  return (
    <>
      {/* Header empresa con KPIs */}
      <LinearGradient
        colors={["#0D1F3A", "#091428"]}
        style={empStyles.header}
      >
        <View style={empStyles.headerTop}>
          <View>
            <Text style={empStyles.headerLogo}>
              Publi<Text style={{ color: colors.info }}>Gana</Text>
              <Text style={empStyles.headerLogoSub}> Empresas</Text>
            </Text>
            <Text style={empStyles.headerWelcome}>Bienvenido, TechCorp S.A.S</Text>
          </View>
          <View style={empStyles.empBadge}>
            <Ionicons name="business" size={12} color={colors.info} />
            <Text style={empStyles.empBadgeText}>Empresa</Text>
          </View>
        </View>

        {/* KPI row */}
        <View style={empStyles.kpiRow}>
          {[
            { value: "5",     label: "Campañas activas", color: colors.info },
            { value: "$2.4M", label: "Invertido mes",    color: colors.secondary },
            { value: "1.248", label: "Compartidos",      color: colors.success },
          ].map((kpi) => (
            <View key={kpi.label} style={empStyles.kpiCard}>
              <Text style={[empStyles.kpiValue, { color: kpi.color }]}>{kpi.value}</Text>
              <Text style={empStyles.kpiLabel}>{kpi.label}</Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      {/* Campañas recientes */}
      <Text style={[styles.sectionTitle, { marginTop: 20 }]}>CAMPAÑAS RECIENTES</Text>

      {COMPANY_CAMPAIGNS.map((camp) => {
        const status = STATUS_CONFIG[camp.estado];
        return (
          <View key={camp.id} style={empStyles.campCard}>
            {/* Título + estado */}
            <View style={empStyles.campTop}>
              <Text style={empStyles.campTitle} numberOfLines={1}>{camp.titulo}</Text>
              <View style={[empStyles.statusBadge, { backgroundColor: status.bg }]}>
                <View style={[empStyles.statusDot, { backgroundColor: status.dot }]} />
                <Text style={[empStyles.statusText, { color: status.text }]}>{status.label}</Text>
              </View>
            </View>

            {/* Meta info */}
            <View style={empStyles.campMeta}>
              {"alcance" in camp && (
                <>
                  <Text style={empStyles.campMetaText}>
                    Alcance: <Text style={empStyles.campMetaStrong}>{camp.alcance} usuarios</Text>
                  </Text>
                  <Text style={empStyles.campMetaText}>
                    Gasto: <Text style={empStyles.campMetaStrong}>
                      ${camp.gasto!.toLocaleString("es-CO")}
                    </Text>
                  </Text>
                </>
              )}
              {"presupuesto" in camp && (
                <>
                  <Text style={empStyles.campMetaText}>
                    Presupuesto: <Text style={empStyles.campMetaStrong}>
                      ${camp.presupuesto!.toLocaleString("es-CO")}
                    </Text>
                  </Text>
                  <Text style={empStyles.campMetaText}>
                    Redes: <Text style={empStyles.campMetaStrong}>{camp.redes}</Text>
                  </Text>
                </>
              )}
            </View>

            {/* Barra de progreso para activas/pausadas */}
            {"progreso" in camp && camp.progreso !== undefined && (
              <View style={empStyles.progressSection}>
                <Text style={empStyles.progressLabel}>{camp.progreso}% del presupuesto usado</Text>
                <View style={empStyles.progressTrack}>
                  <LinearGradient
                    colors={[colors.info, "#60A5FA"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[empStyles.progressFill, { width: `${camp.progreso}%` as any }]}
                  />
                </View>
              </View>
            )}

            {/* Acciones por estado */}
            <View style={empStyles.actions}>
              {camp.estado === "ACTIVA" && (
                <>
                  <Pressable style={empStyles.btnSecondary} onPress={() => Alert.alert("Editar", camp.titulo)}>
                    <Ionicons name="create-outline" size={13} color={colors.muted} />
                    <Text style={empStyles.btnSecondaryText}>Editar</Text>
                  </Pressable>
                  <Pressable style={empStyles.btnSecondary} onPress={() => Alert.alert("Pausar", camp.titulo)}>
                    <Ionicons name="pause-outline" size={13} color={colors.muted} />
                    <Text style={empStyles.btnSecondaryText}>Pausar</Text>
                  </Pressable>
                  <Pressable style={empStyles.btnPrimary} onPress={() => Alert.alert("Stats", camp.titulo)}>
                    <Ionicons name="bar-chart-outline" size={13} color="#fff" />
                    <Text style={empStyles.btnPrimaryText}>Stats</Text>
                  </Pressable>
                </>
              )}
              {camp.estado === "PAUSADA" && (
                <>
                  <Pressable style={empStyles.btnSecondary} onPress={() => Alert.alert("Editar", camp.titulo)}>
                    <Ionicons name="create-outline" size={13} color={colors.muted} />
                    <Text style={empStyles.btnSecondaryText}>Editar</Text>
                  </Pressable>
                  <Pressable style={empStyles.btnPrimary} onPress={() => Alert.alert("Reactivar", camp.titulo)}>
                    <Ionicons name="play-outline" size={13} color="#fff" />
                    <Text style={empStyles.btnPrimaryText}>Reactivar</Text>
                  </Pressable>
                  <Pressable style={empStyles.btnDanger} onPress={() => Alert.alert("Eliminar", "¿Confirmar?")}>
                    <Ionicons name="trash-outline" size={14} color="#F87171" />
                  </Pressable>
                </>
              )}
              {camp.estado === "BORRADOR" && (
                <>
                  <Pressable style={empStyles.btnSecondary} onPress={() => Alert.alert("Continuar", camp.titulo)}>
                    <Ionicons name="create-outline" size={13} color={colors.muted} />
                    <Text style={empStyles.btnSecondaryText}>Continuar</Text>
                  </Pressable>
                  <Pressable style={empStyles.btnPrimary} onPress={() => Alert.alert("Publicar", camp.titulo)}>
                    <Ionicons name="rocket-outline" size={13} color="#fff" />
                    <Text style={empStyles.btnPrimaryText}>Publicar</Text>
                  </Pressable>
                  <Pressable style={empStyles.btnDanger} onPress={() => Alert.alert("Eliminar borrador", "¿Confirmar?")}>
                    <Ionicons name="trash-outline" size={14} color="#F87171" />
                  </Pressable>
                </>
              )}
            </View>
          </View>
        );
      })}

      {/* Nueva campaña */}
      <Pressable
        style={({ pressed }) => [empStyles.newCampBtn, pressed && { opacity: 0.85 }]}
        onPress={() => Alert.alert("Nueva Campaña", "Próximamente")}
      >
        <LinearGradient
          colors={[colors.info, "#60A5FA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={empStyles.newCampGradient}
        >
          <Ionicons name="add-circle-outline" size={20} color="#fff" />
          <Text style={empStyles.newCampText}>Nueva Campaña</Text>
        </LinearGradient>
      </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 52,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchContainer: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 11,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  activeButton: {
    backgroundColor: colors.primary,
  },
  switchText: {
    color: colors.muted,
    fontWeight: "700",
    fontSize: 14,
  },
  activeText: {
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statTitle: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  networkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
  },
  networkIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  networkLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  connectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.success,
  },
  rankRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  rankText: {
    color: colors.secondary,
    fontWeight: "700",
  },
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activityTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  activityWhen: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  activityAmount: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
});

const empStyles = StyleSheet.create({
  header: {
    borderRadius: 20,
    padding: 18,
    marginTop: 4,
    marginBottom: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  headerLogo: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },
  headerLogoSub: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "400",
  },
  headerWelcome: {
    color: "#4A7EAA",
    fontSize: 12,
    marginTop: 3,
  },
  empBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.info + "20",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  empBadgeText: {
    color: colors.info,
    fontSize: 11,
    fontWeight: "700",
  },
  kpiRow: {
    flexDirection: "row",
    gap: 8,
  },
  kpiCard: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  kpiValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  kpiLabel: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 3,
    textAlign: "center",
  },
  campCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  campTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  campTitle: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: "700",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  campMeta: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  campMetaText: {
    color: colors.muted,
    fontSize: 12,
  },
  campMetaStrong: {
    color: colors.textPrimary,
    fontWeight: "700",
  },
  progressSection: {
    marginBottom: 12,
  },
  progressLabel: {
    color: colors.muted,
    fontSize: 11,
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btnPrimary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.info,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  btnSecondary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.border,
  },
  btnSecondaryText: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: "600",
  },
  btnDanger: {
    width: 34,
    height: 34,
    borderRadius: 50,
    backgroundColor: "rgba(248,113,113,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: "auto" as any,
  },
  newCampBtn: {
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 16,
    overflow: "hidden",
  },
  newCampGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 16,
  },
  newCampText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
  },
});