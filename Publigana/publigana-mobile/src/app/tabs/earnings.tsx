import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import type { Earning, BarData } from "@/types";

const { width } = Dimensions.get("window");

const MOCK_BARS: BarData[] = [
  { dia: "L", valor: 12000 },
  { dia: "M", valor: 25000 },
  { dia: "X", valor: 8000  },
  { dia: "J", valor: 45000 },
  { dia: "V", valor: 32000 },
  { dia: "S", valor: 18000 },
  { dia: "D", valor: 55000 },
];

const MOCK_HISTORY: Earning[] = [
  {
    id: 1,
    tipo: "publicacion",
    descripcion: "Publicación compartida – Nike",
    plataforma: "Instagram",
    monto: 35000,
    fecha: "Hoy, 10:30 am",
  },
  {
    id: 2,
    tipo: "video",
    descripcion: "Video promocional – Coca-Cola",
    plataforma: "TikTok",
    monto: 50000,
    fecha: "Ayer, 6:15 pm",
  },
  {
    id: 3,
    tipo: "publicacion",
    descripcion: "Post patrocinado – Samsung",
    plataforma: "Facebook",
    monto: 25000,
    fecha: "Hace 2 días",
  },
  {
    id: 4,
    tipo: "referido",
    descripcion: "Bono por referido",
    plataforma: "App",
    monto: 15000,
    fecha: "Hace 3 días",
  },
];

const TIPO_CONFIG: Record<
  Earning["tipo"],
  { icon: React.ComponentProps<typeof Ionicons>["name"]; color: string }
> = {
  publicacion: { icon: "image-outline",    color: "#E1306C" },
  video:       { icon: "videocam-outline",  color: colors.primary },
  referido:    { icon: "people-outline",    color: colors.success },
  bono:        { icon: "gift-outline",      color: colors.secondary },
};

const maxBar = Math.max(...MOCK_BARS.map((b) => b.valor));
const BAR_MAX_HEIGHT = 70;

function EarningsBar({ data }: { data: BarData[] }) {
  return (
    <View style={barStyles.container}>
      {data.map((item, i) => {
        const height = (item.valor / maxBar) * BAR_MAX_HEIGHT;
        const isMax = item.valor === maxBar;
        return (
          <View key={i} style={barStyles.col}>
            <View
              style={[
                barStyles.bar,
                {
                  height,
                  backgroundColor: isMax ? colors.secondary : colors.primary,
                  opacity: isMax ? 1 : 0.6,
                },
              ]}
            />
            <Text style={barStyles.label}>{item.dia}</Text>
          </View>
        );
      })}
    </View>
  );
}

const barStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    height: BAR_MAX_HEIGHT + 22,
  },
  col: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: "100%",
    borderRadius: 6,
    minHeight: 4,
  },
  label: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 4,
  },
});

function HistoryItem({ item }: { item: Earning }) {
  const config = TIPO_CONFIG[item.tipo];
  return (
    <View style={styles.histItem}>
      <View style={[styles.histIcon, { backgroundColor: config.color + "22" }]}>
        <Ionicons name={config.icon} size={17} color={config.color} />
      </View>
      <View style={styles.histInfo}>
        <Text style={styles.histTitle}>{item.descripcion}</Text>
        <Text style={styles.histMeta}>
          {item.plataforma} · {item.fecha}
        </Text>
      </View>
      <Text style={styles.histAmount}>
        +${item.monto.toLocaleString("es-CO")}
      </Text>
    </View>
  );
}

export default function Earnings() {
  const totalMes = 195000;
  const crecimiento = 12;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ganancias</Text>
        <Text style={styles.headerSub}>Resumen de tus ingresos</Text>
      </View>

      {/* Total card */}
      <View style={styles.totalCard}>
        <View style={styles.totalOverlay} />
        <Text style={styles.totalLabel}>Total del mes</Text>
        <Text style={styles.totalAmount}>
          ${totalMes.toLocaleString("es-CO")} COP
        </Text>
        <View style={styles.growthBadge}>
          <Ionicons name="trending-up-outline" size={13} color={colors.success} />
          <Text style={styles.growthText}>+{crecimiento}% este mes</Text>
        </View>
      </View>

      {/* Mini stats */}
      <View style={styles.miniStats}>
        <View style={styles.miniCard}>
          <Text style={styles.miniValue}>$55.000</Text>
          <Text style={styles.miniLabel}>Esta semana</Text>
        </View>
        <View style={styles.miniCard}>
          <Text style={[styles.miniValue, { color: colors.secondary }]}>$35.000</Text>
          <Text style={styles.miniLabel}>Hoy</Text>
        </View>
        <View style={styles.miniCard}>
          <Text style={[styles.miniValue, { color: colors.success }]}>12</Text>
          <Text style={styles.miniLabel}>Publicaciones</Text>
        </View>
      </View>

      {/* Gráfica semanal */}
      <View style={styles.chartCard}>
        <Text style={styles.sectionLabel}>ESTA SEMANA</Text>
        <EarningsBar data={MOCK_BARS} />
      </View>

      {/* Historial */}
      <Text style={styles.sectionLabel}>HISTORIAL RECIENTE</Text>
      <View style={styles.historyCard}>
        {MOCK_HISTORY.map((item, i) => (
          <View key={item.id}>
            <HistoryItem item={item} />
            {i < MOCK_HISTORY.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 16,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: "800",
  },
  headerSub: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  totalCard: {
    margin: 16,
    borderRadius: 20,
    padding: 22,
    backgroundColor: colors.primary,
    overflow: "hidden",
    position: "relative",
  },
  totalOverlay: {
    position: "absolute",
    right: -20,
    top: -20,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  totalLabel: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
  },
  totalAmount: {
    color: colors.secondary,
    fontSize: 34,
    fontWeight: "900",
    marginVertical: 6,
  },
  growthBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.success + "25",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
  },
  growthText: {
    color: colors.success,
    fontSize: 12,
    fontWeight: "700",
  },
  miniStats: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  miniCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  miniValue: {
    color: colors.primaryLight,
    fontSize: 16,
    fontWeight: "800",
  },
  miniLabel: {
    color: colors.muted,
    fontSize: 10,
    marginTop: 3,
    textAlign: "center",
  },
  chartCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
    marginHorizontal: 16,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  histItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  histIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  histInfo: {
    flex: 1,
  },
  histTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  histMeta: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  histAmount: {
    color: colors.success,
    fontSize: 14,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
});