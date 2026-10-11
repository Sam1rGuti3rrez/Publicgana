import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import type { Campaign, CampaignFilter, SocialPlatform } from "@/types";

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 1,
    titulo: "Campaña Nike – Verano 2025",
    empresa: "Nike Colombia",
    descripcion: "Comparte una foto con tus Nike en cualquier red social.",
    plataforma: "instagram",
    recompensa: 35000,
    estado: "ACTIVA",
    participantes: 128,
    cupoMaximo: 200,
    fechaFin: "2025-08-31",
    categoria: "Moda",
  },
  {
    id: 2,
    titulo: "Promo Coca-Cola Zero",
    empresa: "Coca-Cola",
    descripcion: "Publica un video disfrutando tu Coca-Cola Zero.",
    plataforma: "tiktok",
    recompensa: 50000,
    estado: "ACTIVA",
    participantes: 75,
    cupoMaximo: 100,
    fechaFin: "2025-09-15",
    categoria: "Bebidas",
  },
  {
    id: 3,
    titulo: "Lanzamiento Samsung S25",
    empresa: "Samsung Colombia",
    descripcion: "Muestra las funciones del nuevo Samsung S25.",
    plataforma: "youtube",
    recompensa: 120000,
    estado: "ACTIVA",
    participantes: 20,
    cupoMaximo: 50,
    fechaFin: "2025-08-20",
    categoria: "Tecnología",
  },
  {
    id: 4,
    titulo: "McDonald's – Cuarto de Libra",
    empresa: "McDonald's",
    descripcion: "Comparte tu experiencia con el Cuarto de Libra.",
    plataforma: "facebook",
    recompensa: 25000,
    estado: "PAUSADA",
    participantes: 45,
    cupoMaximo: 80,
    fechaFin: "2025-08-10",
    categoria: "Comida",
  },
];

const FILTERS: { label: string; value: CampaignFilter }[] = [
  { label: "Todas", value: "todas" },
  { label: "Activas", value: "activas" },
  { label: "Instagram", value: "instagram" },
  { label: "TikTok", value: "tiktok" },
  { label: "Facebook", value: "facebook" },
];

const PLATFORM_CONFIG: Record<
  SocialPlatform,
  { label: string; icon: React.ComponentProps<typeof Ionicons>["name"]; color: string }
> = {
  instagram: { label: "Instagram", icon: "logo-instagram", color: "#E1306C" },
  facebook:  { label: "Facebook",  icon: "logo-facebook",  color: "#1877F2" },
  tiktok:    { label: "TikTok",    icon: "logo-tiktok",    color: "#FFFFFF" },
  youtube:   { label: "YouTube",   icon: "logo-youtube",   color: "#FF0000" },
  twitter:   { label: "Twitter",   icon: "logo-twitter",   color: "#1DA1F2" },
};

function CampaignCard({ item }: { item: Campaign }) {
  const platform = PLATFORM_CONFIG[item.plataforma];
  const progress = item.participantes / item.cupoMaximo;
  const isActive = item.estado === "ACTIVA";
  const progressPct = Math.min(Math.round(progress * 100), 100);

  return (
    <View style={styles.card}>
      {/* Acento de color de plataforma en el borde izquierdo */}
      <View style={[styles.cardAccent, { backgroundColor: platform.color }]} />

      {/* Encabezado */}
      <View style={styles.cardHeader}>
        <View style={[styles.platformBadge, { backgroundColor: platform.color + "28" }]}>
          <Ionicons name={platform.icon} size={13} color={platform.color} />
          <Text style={[styles.platformLabel, { color: platform.color }]}>
            {platform.label}
          </Text>
        </View>
        <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusPaused]}>
          <View style={[styles.statusDot, { backgroundColor: isActive ? colors.success : colors.warning }]} />
          <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextPaused]}>
            {isActive ? "Activa" : "Pausada"}
          </Text>
        </View>
      </View>

      {/* Contenido */}
      <Text style={styles.cardTitle}>{item.titulo}</Text>
      <Text style={styles.cardCompany}>{item.empresa}</Text>
      <Text style={styles.cardDesc}>{item.descripcion}</Text>

      {/* Progreso con gradiente */}
      <View style={styles.progressSection}>
        <View style={styles.progressMeta}>
          <Text style={styles.progressLabel}>
            <Text style={{ color: colors.textPrimary, fontWeight: "700" }}>
              {item.participantes}
            </Text>{" "}
            / {item.cupoMaximo} participantes
          </Text>
          <Text style={[styles.progressLabel, { color: colors.secondary }]}>
            {progressPct}%
          </Text>
        </View>
        <View style={styles.progressTrack}>
          <LinearGradient
            colors={[colors.primary, colors.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progressPct}%` as any }]}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View>
          <Text style={styles.rewardAmount}>
            ${item.recompensa.toLocaleString("es-CO")}
            <Text style={styles.rewardCurrency}> COP</Text>
          </Text>
          <Text style={styles.rewardLabel}>por publicación</Text>
        </View>
        {isActive && (
          <Pressable style={({ pressed }) => [styles.btnParticipar, pressed && { opacity: 0.8 }]}>
            <Text style={styles.btnParticiparText}>Participar</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.textPrimary} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function Campaigns() {
  const [activeFilter, setActiveFilter] = useState<CampaignFilter>("todas");

  const filtered = MOCK_CAMPAIGNS.filter((c) => {
    if (activeFilter === "todas") return true;
    if (activeFilter === "activas") return c.estado === "ACTIVA";
    return c.plataforma === activeFilter;
  });

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Campañas</Text>
          <Text style={styles.headerSub}>
            {filtered.length} disponibles para ti
          </Text>
        </View>
        <Pressable style={styles.searchBtn}>
          <Ionicons name="search-outline" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      {/* Filtros — wrapper View con padding vertical para evitar clipping */}
      <View style={styles.filtersWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          {FILTERS.map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setActiveFilter(f.value)}
              style={[styles.filterChip, activeFilter === f.value && styles.filterChipActive]}
            >
              <Text style={[styles.filterText, activeFilter === f.value && styles.filterTextActive]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Lista */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <CampaignCard item={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 52,
    paddingBottom: 18,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerSub: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 3,
  },
  searchBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  // Wrapper con padding vertical para que el ScrollView horizontal no clipe las chips
  filtersWrapper: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 50,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primaryLight,
  },
  filterText: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: "600",
  },
  filterTextActive: {
    color: colors.textPrimary,
  },
  list: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  cardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingLeft: 8,
  },
  platformBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 50,
  },
  platformLabel: {
    fontSize: 12,
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
  statusActive: {
    backgroundColor: colors.success + "25",
  },
  statusPaused: {
    backgroundColor: colors.warning + "25",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  statusTextActive: {
    color: colors.success,
  },
  statusTextPaused: {
    color: colors.warning,
  },
  cardTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 3,
    paddingLeft: 8,
  },
  cardCompany: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 8,
    paddingLeft: 8,
  },
  cardDesc: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 16,
    paddingLeft: 8,
  },
  progressSection: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  progressMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    color: colors.muted,
    fontSize: 12,
  },
  progressTrack: {
    height: 7,
    backgroundColor: colors.surface,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 10,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 8,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: 2,
  },
  rewardAmount: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: "900",
  },
  rewardCurrency: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.muted,
  },
  rewardLabel: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 1,
  },
  btnParticipar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 50,
  },
  btnParticiparText: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "700",
  },
});