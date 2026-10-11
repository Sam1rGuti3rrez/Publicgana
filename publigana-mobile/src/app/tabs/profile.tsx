import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { useAuth } from "@/context/AuthContext";
import type { AuthenticatedUserRole } from "@/types/auth";

interface MenuItem {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  detail?: string;
  color?: string;
  onPress?: () => void;
}

interface RoleConfig {
  label: string;
  sectionTitle: string;
  menuItems: MenuItem[];
  stats: { value: string; label: string; color?: string }[];
}

// Temporary visual data until the API exposes profile metrics and connected networks.
const MOCK_SOCIAL_NETWORKS: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  color: string;
  followers: string;
}[] = [
  { icon: "logo-instagram", label: "Instagram",  color: "#E1306C", followers: "2.4K" },
  { icon: "logo-facebook",  label: "Facebook",   color: "#1877F2", followers: "1.1K" },
  { icon: "logo-tiktok",    label: "TikTok",     color: "#FFFFFF", followers: "8.7K" },
];

const ROLE_CONFIG: Record<AuthenticatedUserRole, RoleConfig> = {
  ADMIN: {
    label: "Administrador",
    sectionTitle: "ADMINISTRACIÓN DE LA PLATAFORMA",
    stats: [
      { value: "47", label: "Publicaciones" },
      { value: "195K", label: "Alcance", color: colors.secondary },
      { value: "4", label: "Redes sociales", color: colors.success },
    ],
    menuItems: [
      { icon: "people-outline", label: "Gestión de usuarios", detail: "Usuarios y permisos" },
      { icon: "megaphone-outline", label: "Gestión de promotores", detail: "Cuentas promotor" },
      { icon: "business-outline", label: "Gestión de negocios", detail: "Cuentas negocio" },
      { icon: "newspaper-outline", label: "Gestión de publicaciones", detail: "Revisión y moderación" },
      { icon: "share-social-outline", label: "Gestión de redes sociales", detail: "Plataformas conectadas" },
      { icon: "bar-chart-outline", label: "Estadísticas generales", detail: "Resumen de la plataforma" },
      { icon: "settings-outline", label: "Configuración", detail: "Parámetros del sistema" },
    ],
  },
  PROMOTOR: {
    label: "Promotor",
    sectionTitle: "REDES SOCIALES CONECTADAS",
    stats: [
      { value: "47", label: "Publicaciones" },
      { value: "$195K", label: "Ganado", color: colors.secondary },
      { value: "4", label: "Redes sociales", color: colors.success },
    ],
    menuItems: [
      { icon: "person-outline", label: "Mi perfil", detail: "Nombre, foto, bio" },
      { icon: "newspaper-outline", label: "Mis publicaciones", detail: "Contenido publicado" },
      { icon: "megaphone-outline", label: "Mis campañas", detail: "Campañas activas" },
      { icon: "share-social-outline", label: "Mis redes sociales", detail: "Cuentas conectadas" },
      { icon: "wallet-outline", label: "Mis ganancias", detail: "Balance y retiros" },
      { icon: "bar-chart-outline", label: "Mis estadísticas", detail: "Rendimiento" },
      { icon: "settings-outline", label: "Configuración", detail: "Preferencias" },
    ],
  },
  NEGOCIO: {
    label: "Negocio",
    sectionTitle: "REDES SOCIALES DEL NEGOCIO",
    stats: [
      { value: "47", label: "Publicaciones" },
      { value: "3", label: "Campañas", color: colors.secondary },
      { value: "4", label: "Redes sociales", color: colors.success },
    ],
    menuItems: [
      { icon: "business-outline", label: "Perfil del negocio", detail: "Información del negocio" },
      { icon: "newspaper-outline", label: "Publicaciones", detail: "Contenido de la marca" },
      { icon: "megaphone-outline", label: "Campañas", detail: "Campañas del negocio" },
      { icon: "share-social-outline", label: "Redes sociales", detail: "Cuentas conectadas" },
      { icon: "bar-chart-outline", label: "Estadísticas", detail: "Rendimiento de campañas" },
      { icon: "create-outline", label: "Gestión de contenido", detail: "Contenido y publicaciones" },
      { icon: "settings-outline", label: "Configuración", detail: "Preferencias" },
    ],
  },
};

export default function Profile() {
  const { logout, user } = useAuth();
  const currentRole = user?.rol ?? "PROMOTOR";
  const roleConfig = ROLE_CONFIG[currentRole];
  const profileName = user
    ? [user.nombres, user.apellidos].filter(Boolean).join(" ") || user.correo
    : "Cargando...";
  const profileInitial = profileName.charAt(0).toUpperCase();
  const menuItems: MenuItem[] = [
    ...roleConfig.menuItems,
    {
      icon: "notifications-outline",
      label: "Notificaciones",
      detail: "Preferencias de avisos",
    },
    {
      icon: "shield-checkmark-outline",
      label: "Seguridad",
      detail: "Contraseña y acceso",
    },
    {
      icon: "help-circle-outline",
      label: "Ayuda y soporte",
    },
    {
      icon: "log-out-outline",
      label: "Cerrar sesión",
      color: colors.danger,
      onPress: () =>
        Alert.alert("Cerrar sesión", "¿Seguro que quieres salir?", [
          { text: "Cancelar", style: "cancel" },
          { text: "Salir", style: "destructive", onPress: logout },
        ]),
    },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar y nombre */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{profileInitial}</Text>
        </View>
        <Text style={styles.profileName}>{profileName}</Text>
        <View style={styles.rankBadge}>
          <Ionicons name="star" size={12} color={colors.secondary} />
          <Text style={styles.rankText}>{roleConfig.label}</Text>
        </View>
        <Text style={styles.profileEmail}>{user?.correo ?? "Restaurando sesión..."}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {roleConfig.stats.map((stat, index) => (
          <View key={stat.label} style={styles.statItem}>
            <Text style={[styles.statValue, stat.color && { color: stat.color }]}>
              {stat.value}
            </Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
            {index < roleConfig.stats.length - 1 && <View style={styles.statDivider} />}
          </View>
        ))}
      </View>

      {/* Redes sociales */}
      <Text style={styles.sectionLabel}>{roleConfig.sectionTitle}</Text>
      <View style={styles.networksCard}>
        {MOCK_SOCIAL_NETWORKS.map((net, i) => (
          <View key={net.label}>
            <View style={styles.networkItem}>
              <View style={[styles.networkIcon, { backgroundColor: net.color + "22" }]}>
                <Ionicons name={net.icon} size={18} color={net.color} />
              </View>
              <View style={styles.networkInfo}>
                <Text style={styles.networkName}>{net.label}</Text>
                <Text style={styles.networkFollowers}>{net.followers} seguidores</Text>
              </View>
              <View style={styles.connectedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={colors.success} />
                <Text style={styles.connectedText}>Conectado</Text>
              </View>
            </View>
            {i < MOCK_SOCIAL_NETWORKS.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Menú */}
      <Text style={styles.sectionLabel}>CONFIGURACIÓN</Text>
      <View style={styles.menuCard}>
        {menuItems.map((item, i) => (
          <View key={item.label}>
            <Pressable
              style={styles.menuItem}
              onPress={item.onPress}
              android_ripple={{ color: colors.border }}
            >
              <View style={[styles.menuIconBox, item.color && { backgroundColor: item.color + "18" }]}>
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={item.color ?? colors.textSecondary}
                />
              </View>
              <Text style={[styles.menuLabel, item.color && { color: item.color }]}>
                {item.label}
              </Text>
              <View style={styles.menuRight}>
                {item.detail && (
                  <Text style={styles.menuDetail}>{item.detail}</Text>
                )}
                {!item.onPress && (
                  <Ionicons name="chevron-forward" size={16} color={colors.muted} />
                )}
              </View>
            </Pressable>
            {i < menuItems.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      <Text style={styles.version}>Publigana v1.0.0</Text>
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
  profileHeader: {
    alignItems: "center",
    paddingTop: 52,
    paddingBottom: 24,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: colors.secondary,
  },
  avatarText: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "800",
  },
  profileName: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: "800",
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.secondary + "20",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
    marginTop: 6,
  },
  rankText: {
    color: colors.secondary,
    fontSize: 12,
    fontWeight: "700",
  },
  profileEmail: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 6,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  statValue: {
    color: colors.primaryLight,
    fontSize: 18,
    fontWeight: "800",
  },
  statLabel: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  sectionLabel: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
    marginTop: 20,
    marginBottom: 10,
    marginHorizontal: 16,
  },
  networksCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  networkItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  networkIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  networkInfo: {
    flex: 1,
  },
  networkName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  networkFollowers: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 1,
  },
  connectedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  connectedText: {
    color: colors.success,
    fontSize: 11,
    fontWeight: "600",
  },
  menuCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  menuRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  menuDetail: {
    color: colors.muted,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: 14,
  },
  version: {
    color: colors.muted,
    fontSize: 12,
    textAlign: "center",
    marginTop: 24,
  },
});