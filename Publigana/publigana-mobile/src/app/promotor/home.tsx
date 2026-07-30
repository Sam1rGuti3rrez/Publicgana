import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import BalanceCard from "@/components/BalanceCard";
import { colors } from "@/theme/colors";

export default function Home() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            Hola 👋
          </Text>

          <Text style={styles.name}>
            Bienvenido a Publigana
          </Text>

          <Text style={styles.subtitle}>
            Gestiona tus campañas y ganancias
          </Text>
        </View>

        <Pressable style={styles.notification}>
          <Text style={styles.notificationIcon}>🔔</Text>
        </Pressable>
      </View>

      {/* Saldo */}

      <BalanceCard />

      {/* Acciones */}

      <Text style={styles.sectionTitle}>
        Acciones rápidas
      </Text>

      <View style={styles.actions}>

        <Pressable style={styles.actionCard}>
          <Text style={styles.actionIcon}>📢</Text>

          <Text style={styles.actionTitle}>
            Campañas
          </Text>

          <Text style={styles.actionText}>
            Explora nuevas oportunidades
          </Text>
        </Pressable>

        <Pressable style={styles.actionCard}>
          <Text style={styles.actionIcon}>💰</Text>

          <Text style={styles.actionTitle}>
            Ganancias
          </Text>

          <Text style={styles.actionText}>
            Consulta tus ingresos
          </Text>
        </Pressable>

      </View>

      {/* Campañas */}

      <Text style={styles.sectionTitle}>
        Campañas disponibles
      </Text>

      <Pressable style={styles.campaignCard}>

        <Text style={styles.company}>
          Nike Colombia
        </Text>

        <Text style={styles.platform}>
          Instagram
        </Text>

        <View style={styles.rewardContainer}>

          <Text style={styles.reward}>
            $35.000 COP
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Activa
            </Text>
          </View>

        </View>

      </Pressable>

      <Pressable style={styles.campaignCard}>

        <Text style={styles.company}>
          McDonald's
        </Text>

        <Text style={styles.platform}>
          TikTok
        </Text>

        <View style={styles.rewardContainer}>

          <Text style={styles.reward}>
            $20.000 COP
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Activa
            </Text>
          </View>

        </View>

      </Pressable>

      <Pressable style={styles.campaignCard}>

        <Text style={styles.company}>
          Adidas
        </Text>

        <Text style={styles.platform}>
          Facebook
        </Text>

        <View style={styles.rewardContainer}>

          <Text style={styles.reward}>
            $50.000 COP
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              Activa
            </Text>
          </View>

        </View>

      </Pressable>

      <View style={{ height: 80 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },

  notification: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },

  notificationIcon: {
    fontSize: 20,
  },

  greeting: {
    color: colors.gray400,
    fontSize: 16,
  },

  name: {
    color: colors.white,
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 4,
  },

  subtitle: {
    color: colors.gray400,
    marginTop: 8,
    fontSize: 15,
  },

  sectionTitle: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 30,
    marginBottom: 15,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  actionCard: {
    width: "48%",
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },

  actionIcon: {
    fontSize: 30,
  },

  actionTitle: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 17,
    marginTop: 14,
  },

  actionText: {
    color: colors.gray400,
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
  },

  campaignCard: {
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  company: {
    color: colors.white,
    fontWeight: "bold",
    fontSize: 18,
  },

  platform: {
    color: colors.gray400,
    marginTop: 8,
  },

  rewardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
  },

  reward: {
    color: colors.success,
    fontWeight: "bold",
    fontSize: 18,
  },

  badge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },

  badgeText: {
    color: colors.white,
    fontWeight: "600",
    fontSize: 12,
  },

});