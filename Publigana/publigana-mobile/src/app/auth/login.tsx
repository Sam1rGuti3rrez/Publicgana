import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { router } from "expo-router";

import AppButton from "@/components/buttons/AppButton";
import { colors } from "@/theme/colors";

export default function LoginScreen() {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.content}>

        <Text style={styles.title}>
          Iniciar sesión
        </Text>

        <Text style={styles.subtitle}>
          Pantalla en construcción
        </Text>

        <AppButton
          label="Crear una cuenta"
          variant="secondary"
          onPress={() => router.push("/auth/register")}
        />

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
  },

  content: {
    padding: 24,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    color: colors.muted,
    marginBottom: 30,
    fontSize: 16,
  },

});