import { AxiosError } from "axios";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  StatusBar,
} from "react-native";

import authService from "@/services/auth/authService";
import { api } from "@/services/api";
import { colors } from "@/theme/colors";
import type {
  ColombianDepartment,
  ColombianLocationCatalog,
  ColombianMunicipality,
  RegisterRequest,
} from "@/types/auth";

type ApiErrorBody = {
  message?: string;
  error?: string;
};

function isLocationCatalog(
  value: unknown,
): value is ColombianLocationCatalog {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const catalog = value as Record<string, unknown>;

  return (
    Array.isArray(catalog.departments) &&
    catalog.departments.length > 0 &&
    catalog.departments.every(
      (department) =>
        typeof department?.code === "string" &&
        typeof department?.name === "string",
    ) &&
    Array.isArray(catalog.municipalities) &&
    catalog.municipalities.length > 0 &&
    catalog.municipalities.every(
      (municipality) =>
        typeof municipality?.code === "string" &&
        typeof municipality?.name === "string" &&
        typeof municipality?.departmentCode === "string" &&
        typeof municipality?.department === "string",
    )
  );
}

export default function RegisterScreen() {
  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");

  const [nombreEmpresa, setNombreEmpresa] = useState("");
  const [nit, setNit] = useState("");

  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [residencyConfirmed, setResidencyConfirmed] = useState(false);
  const [departmentCode, setDepartmentCode] = useState("");
  const [departmentMenuOpen, setDepartmentMenuOpen] = useState(false);
  const [municipalityCode, setMunicipalityCode] = useState("");
  const [municipalitySearch, setMunicipalitySearch] = useState("");
  const [locality, setLocality] = useState("");
  const [municipalities, setMunicipalities] = useState<ColombianMunicipality[]>(
    [],
  );
  const [departments, setDepartments] = useState<ColombianDepartment[]>([]);
  const [municipalitiesLoading, setMunicipalitiesLoading] = useState(true);
  const [municipalitiesError, setMunicipalitiesError] = useState("");

  const [rol, setRol] = useState<RegisterRequest["rol"]>("promotor");

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let active = true;

    api
      .get<ColombianLocationCatalog>("/municipios")
      .then(({ data }) => {
        if (!isLocationCatalog(data)) {
          throw new Error("La respuesta del catálogo geográfico no es válida.");
        }

        if (active) {
          setMunicipalities(data.municipalities);
          setDepartments(data.departments);
          setMunicipalitiesError("");
        }
      })
      .catch(() => {
        if (active) {
          setMunicipalitiesError(
            "No fue posible cargar los municipios colombianos. Intenta nuevamente más tarde.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setMunicipalitiesLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredMunicipalities = useMemo(() => {
    const query = municipalitySearch.trim().toLocaleLowerCase("es");
    const departmentMunicipalities = municipalities.filter(
      (municipality) => municipality.departmentCode === departmentCode,
    );

    if (!query) {
      return departmentMunicipalities.slice(0, 20);
    }

    return departmentMunicipalities
      .filter((municipality) =>
        `${municipality.name} ${municipality.department}`
          .toLocaleLowerCase("es")
          .includes(query),
      )
      .slice(0, 20);
  }, [departmentCode, municipalities, municipalitySearch]);

  const roleOptions = useMemo(
    () => [
      {
        key: "promotor" as const,
        title: "Promotor",
        description: "Difunde campanas y conecta con negocios.",
      },
      {
        key: "negocio" as const,
        title: "Negocio",
        description: "Publica campanas y recibe solicitudes.",
      },
    ],
    []
  );

  const canSubmit = useMemo(() => {
    if (
      correo.trim() === "" ||
      contrasena.trim() === "" ||
      telefono.trim() === "" ||
      !residencyConfirmed ||
      !departmentCode ||
      !municipalityCode ||
      municipalitiesLoading ||
      loading
    ) {
      return false;
    }

    if (rol === "promotor") {
      return nombres.trim() !== "" && apellidos.trim() !== "";
    }

    if (rol === "negocio") {
      return nombreEmpresa.trim() !== "" && nit.trim() !== "";
    }

    return false;
  }, [
    nombres,
    apellidos,
    nombreEmpresa,
    nit,
    correo,
    contrasena,
    telefono,
    residencyConfirmed,
    departmentCode,
    municipalityCode,
    municipalitiesLoading,
    rol,
    loading,
  ]);

  const getAxiosErrorMessage = (error: unknown): string => {
    if (!error) {
      return "No fue posible registrar el usuario.";
    }

    if (error instanceof AxiosError) {
      if (!error.response) {
        return "No se pudo conectar con el backend.";
      }

      const data = error.response.data as ApiErrorBody;

      if (data?.message) {
        return data.message;
      }

      if (data?.error) {
        return data.error;
      }

      return `Error HTTP ${error.response.status}`;
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Error desconocido.";
  };

  const handleRegister = async () => {
    if (!canSubmit) {
      setErrorMessage("Completa todos los campos antes de continuar.");
      setSuccessMessage("");
      return;
    }

    const payload: RegisterRequest = {
      correo: correo.trim(),
      contrasena: contrasena.trim(),
      telefono: telefono.trim(),
      rol,
      countryCode: "CO",
      residencyConfirmed: true,
      departmentCode,
      municipalityCode,
      locality: locality.trim(),
      ...(rol === "promotor" && {
        nombres: nombres.trim(),
        apellidos: apellidos.trim(),
      }),
      ...(rol === "negocio" && {
        nombreEmpresa: nombreEmpresa.trim(),
        nit: nit.trim(),
      }),
    };

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await authService.register(payload);

      setSuccessMessage("Cuenta creada correctamente.");
      setTimeout(() => router.replace("/auth/login"), 1500);
    } catch (error) {
      setErrorMessage(getAxiosErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    onChangeText: (text: string) => void,
    options?: {
      placeholder?: string;
      keyboardType?: "default" | "email-address" | "phone-pad";
      secureTextEntry?: boolean;
      autoCapitalize?: "none" | "sentences" | "words" | "characters";
    }
  ) => {
    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={options?.placeholder ?? ""}
          placeholderTextColor={colors.placeholder}
          keyboardType={options?.keyboardType ?? "default"}
          secureTextEntry={options?.secureTextEntry ?? false}
          autoCapitalize={options?.autoCapitalize ?? "sentences"}
          style={styles.input}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

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
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>
              Elige tu rol y completa los datos para registrarte.
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tipo de cuenta</Text>
            <View style={styles.roleGrid}>
              {roleOptions.map((option) => {
                const selected = rol === option.key;

                return (
                  <Pressable
                    key={option.key}
                    onPress={() => setRol(option.key)}
                    style={[styles.roleCard, selected && styles.roleCardSelected]}
                  >
                    <Text
                      style={[styles.roleTitle, selected && styles.roleTitleSelected]}
                    >
                      {option.title}
                    </Text>
                    <Text style={styles.roleDescription}>{option.description}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Datos de registro</Text>

            {rol === "promotor" && (
              <>
                {renderInput("Nombres", nombres, setNombres, {
                  placeholder: "Ingresa tus nombres",
                  autoCapitalize: "words",
                })}

                {renderInput("Apellidos", apellidos, setApellidos, {
                  placeholder: "Ingresa tus apellidos",
                  autoCapitalize: "words",
                })}
              </>
            )}

            {rol === "negocio" && (
              <>
                {renderInput("Nombre de empresa", nombreEmpresa, setNombreEmpresa, {
                  placeholder: "Ingresa el nombre del negocio",
                  autoCapitalize: "words",
                })}

                {renderInput("NIT", nit, setNit, {
                  placeholder: "Ingresa el NIT",
                  autoCapitalize: "characters",
                })}
              </>
            )}

            {renderInput("Correo", correo, setCorreo, {
              placeholder: "correo@dominio.com",
              keyboardType: "email-address",
              autoCapitalize: "none",
            })}

            {renderInput("Contrasena", contrasena, setContrasena, {
              placeholder: "Minimo 8 caracteres",
              secureTextEntry: true,
              autoCapitalize: "none",
            })}

            {renderInput("Telefono", telefono, setTelefono, {
              placeholder: "3001234567",
              keyboardType: "phone-pad",
              autoCapitalize: "none",
            })}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Departamento de residencia</Text>
              {municipalitiesLoading ? (
                <Text style={styles.municipalityHint}>
                  Cargando catálogo oficial de departamentos y municipios.
                </Text>
              ) : municipalitiesError ? (
                <Text accessibilityRole="alert" style={styles.municipalityError}>
                  {municipalitiesError}
                </Text>
              ) : (
                <>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ expanded: departmentMenuOpen }}
                    disabled={loading}
                    onPress={() => setDepartmentMenuOpen((open) => !open)}
                    style={styles.input}
                  >
                    <Text style={styles.municipalityOptionText}>
                      {departments.find(
                        (department) => department.code === departmentCode,
                      )?.name ?? "Selecciona un departamento"}
                    </Text>
                  </Pressable>
                  {departmentMenuOpen && (
                    <ScrollView
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                      style={styles.municipalityResults}
                    >
                      {departments.map((department) => (
                        <Pressable
                          key={department.code}
                          accessibilityRole="button"
                          onPress={() => {
                            setDepartmentCode(department.code);
                            setDepartmentMenuOpen(false);
                            setMunicipalityCode("");
                            setMunicipalitySearch("");
                            setLocality("");
                          }}
                          style={[
                            styles.municipalityOption,
                            department.code === departmentCode &&
                              styles.municipalityOptionSelected,
                          ]}
                        >
                          <Text style={styles.municipalityOptionText}>
                            {department.name}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  )}
                </>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Municipio, distrito o cabecera municipal
              </Text>
              {!departmentCode ? (
                <Text style={styles.municipalityHint}>
                  Selecciona primero un departamento.
                </Text>
              ) : municipalitiesLoading ? (
                <Text style={styles.municipalityHint}>
                  Cargando municipios...
                </Text>
              ) : municipalitiesError ? (
                <Text accessibilityRole="alert" style={styles.municipalityError}>
                  {municipalitiesError}
                </Text>
              ) : (
                <>
                  <TextInput
                    value={municipalitySearch}
                    onChangeText={(text) => {
                      setMunicipalitySearch(text);
                      setMunicipalityCode("");
                      setLocality("");
                    }}
                    placeholder="Busca un municipio"
                    placeholderTextColor={colors.placeholder}
                    editable={!loading}
                    autoCapitalize="words"
                    style={styles.input}
                    accessibilityLabel="Buscar municipio colombiano"
                  />
                  {municipalityCode ? (
                    <Text style={styles.municipalityHint}>
                      Municipio seleccionado:{" "}
                      {
                        municipalities.find(
                          (item) => item.code === municipalityCode,
                        )?.name
                      }
                    </Text>
                  ) : (
                    <Text style={styles.municipalityHint}>
                      Selecciona un resultado oficial para continuar.
                    </Text>
                  )}
                  <ScrollView
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    style={styles.municipalityResults}
                  >
                    {filteredMunicipalities.map((municipality) => (
                      <Pressable
                        key={municipality.code}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: municipality.code === municipalityCode,
                        }}
                        onPress={() => {
                          setMunicipalityCode(municipality.code);
                          setMunicipalitySearch(
                            `${municipality.name}, ${municipality.department}`,
                          );
                          setLocality("");
                        }}
                        style={[
                          styles.municipalityOption,
                          municipality.code === municipalityCode &&
                            styles.municipalityOptionSelected,
                        ]}
                      >
                        <Text style={styles.municipalityOptionText}>
                          {municipality.name} — {municipality.department}
                        </Text>
                      </Pressable>
                    ))}
                    {filteredMunicipalities.length === 0 && (
                      <Text style={styles.municipalityHint}>
                        No hay municipios colombianos que coincidan.
                      </Text>
                    )}
                  </ScrollView>
                </>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Ciudad, localidad, corregimiento o vereda (opcional)
              </Text>
              <TextInput
                value={locality}
                onChangeText={setLocality}
                placeholder="Escribe un nombre, si deseas"
                placeholderTextColor={colors.placeholder}
                editable={!loading}
                autoCapitalize="words"
                maxLength={150}
                style={styles.input}
                accessibilityLabel="Ciudad, localidad, corregimiento o vereda, opcional"
                accessibilityHint="Dato complementario; no reemplaza el municipio o distrito seleccionado."
              />
              <Text style={styles.municipalityHint}>
                Es un dato complementario y no reemplaza el municipio o
                distrito seleccionado.
              </Text>
            </View>

            <Pressable
              accessibilityRole="checkbox"
              accessibilityState={{ checked: residencyConfirmed }}
              onPress={() => setResidencyConfirmed((confirmed) => !confirmed)}
              style={styles.residencyConfirmation}
            >
              <View
                style={[
                  styles.checkbox,
                  residencyConfirmed && styles.checkboxSelected,
                ]}
              >
                {residencyConfirmed && <Text style={styles.checkboxMark}>✓</Text>}
              </View>
              <Text style={styles.residencyConfirmationText}>
                Declaro que resido actualmente en Colombia.
              </Text>
            </Pressable>
          </View>

          {!!successMessage && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          {!!errorMessage && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          )}

          <Pressable
            onPress={handleRegister}
            disabled={!canSubmit}
            style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          >
            <Text style={styles.submitButtonText}>
              {loading ? "Creando cuenta..." : "Registrarme"}
            </Text>
          </Pressable>

          <Pressable
            onPress={() => router.push("/auth/login")}
            style={styles.secondaryAction}
          >
            <Text style={styles.secondaryActionText}>
              Ya tengo cuenta, iniciar sesion
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },

  headerBlock: {
    marginBottom: 22,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 6,
  },

  subtitle: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  section: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },

  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 10,
  },

  roleGrid: {
    gap: 10,
  },

  roleCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.card,
  },

  roleCardSelected: {
    borderColor: colors.secondary,
    backgroundColor: "rgba(245, 166, 35, 0.12)",
  },

  roleTitle: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 3,
  },

  roleTitleSelected: {
    color: colors.goldLight,
  },

  roleDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  inputGroup: {
    marginBottom: 12,
  },

  inputLabel: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.inputBackground,
    color: colors.textPrimary,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
  },

  residencyConfirmation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 4,
  },

  checkbox: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 4,
  },

  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  checkboxMark: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "800",
  },

  residencyConfirmationText: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },

  municipalityHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },

  municipalityError: {
    color: colors.error,
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },

  municipalityResults: {
    maxHeight: 180,
    marginTop: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
  },

  municipalityOption: {
    paddingHorizontal: 10,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  municipalityOptionSelected: {
    backgroundColor: "rgba(245, 166, 35, 0.16)",
  },

  municipalityOptionText: {
    color: colors.textPrimary,
    fontSize: 13,
  },

  successBox: {
    backgroundColor: "rgba(34, 197, 94, 0.18)",
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },

  successText: {
    color: colors.success,
    fontSize: 13,
    fontWeight: "600",
  },

  errorBox: {
    backgroundColor: "rgba(239, 68, 68, 0.18)",
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },

  errorText: {
    color: colors.error,
    fontSize: 13,
    fontWeight: "600",
  },

  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 4,
    marginBottom: 8,
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
