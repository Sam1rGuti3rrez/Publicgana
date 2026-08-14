import { AxiosError } from "axios";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/context/AuthContext";
import authService from "@/services/auth/authService";
import { colors } from "@/theme/colors";

type ApiErrorBody = {
  message?: string;
  error?: string;
};

export default function LoginScreen() {
  const { login } = useAuth();

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const canSubmit = useMemo(
    () =>
      correo.trim() !== "" &&
      contrasena.trim() !== "" &&
      !loading,
    [correo, contrasena, loading]
  );

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof AxiosError) {
      if (!error.response) {
        return "No se pudo conectar con el servidor.";
      }

      const data = error.response.data as ApiErrorBody;

      return (
        data?.message ??
        data?.error ??
        `Error HTTP ${error.response.status}`
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Error desconocido.";
  };

  const handleLogin = async () => {
    if (!canSubmit) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await authService.login({
        correo: correo.trim(),
        contrasena: contrasena.trim(),
      });

      // Guardar token y actualizar el usuario en AuthContext
      await login(response);

      // Obtener el rol del usuario autenticado
      const role = response.usuario.rol?.toLowerCase();

      // Redirigir según el rol
      if (role === "empresa") {
        router.replace("/empresa/(tabs)");
      } else if (role === "promotor") {
        router.replace("/promotor/(tabs)");
      } else {
        // Ruta general para otros roles
        router.replace("/tabs");
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerBlock}>
            <Text style={styles.title}>Iniciar sesión</Text>

            <Text style={styles.subtitle}>
              Ingresa tus credenciales para continuar.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Correo</Text>

              <TextInput
                value={correo}
                onChangeText={setCorreo}
                placeholder="correo@dominio.com"
                placeholderTextColor={colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Contraseña</Text>

              <TextInput
                value={contrasena}
                onChangeText={setContrasena}
                placeholder="Tu contraseña"
                placeholderTextColor={colors.placeholder}
                secureTextEntry
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
          </View>

          {!!errorMessage && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {errorMessage}
              </Text>
            </View>
          )}

          <Pressable
            onPress={handleLogin}
            disabled={!canSubmit}
            style={[
              styles.submitButton,
              !canSubmit && styles.submitButtonDisabled,
            ]}
          >
            <Text style={styles.submitButtonText}>
              {loading
                ? "Iniciando sesión..."
                : "Iniciar sesión"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/auth/register")}
            style={styles.secondaryAction}
          >
            <Text style={styles.secondaryActionText}>
              ¿No tienes cuenta? Regístrate
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  flex: {
    flex: 1,
  },

  scrollContent: {
    padding: 24,
    flexGrow: 1,
    justifyContent: "center",
  },

  headerBlock: {
    marginBottom: 32,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 8,
  },

  subtitle: {
    color: colors.muted,
    fontSize: 16,
  },

  section: {
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    color: colors.textPrimary,
    marginBottom: 6,
    fontWeight: "500",
  },

  input: {
    backgroundColor: colors.inputBackground,
    color: colors.textPrimary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },

  errorBox: {
    backgroundColor: "#3b1a1a",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  errorText: {
    color: colors.error,
    fontSize: 14,
  },

  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },

  submitButtonDisabled: {
    opacity: 0.55,
  },

  submitButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },

  secondaryAction: {
    alignItems: "center",
    paddingVertical: 8,
  },

  secondaryActionText: {
    color: colors.goldLight,
    fontSize: 14,
    fontWeight: "600",
  },
});