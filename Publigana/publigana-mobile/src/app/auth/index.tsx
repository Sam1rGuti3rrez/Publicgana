import { StyleSheet, Text, View } from "react-native";

import AppButton from "@/components/buttons/AppButton";
import { colors } from "@/theme/colors";

export default function AuthLanding() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autenticacion</Text>
      <Text style={styles.subtitle}>Conecta esta vista al backend Spring Boot para login real.</Text>
      <AppButton label="Continuar" onPress={() => undefined} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    paddingHorizontal: 20,
    gap: 14,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: colors.muted,
    fontSize: 13,
    textAlign: "center",
  },
});
