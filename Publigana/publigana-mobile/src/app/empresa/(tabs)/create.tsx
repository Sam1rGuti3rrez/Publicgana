import { Alert, StyleSheet, Text, TextInput, View } from "react-native";

import AppButton from "@/components/buttons/AppButton";
import Card from "@/components/cards/Card";
import SectionHeader from "@/components/common/SectionHeader";
import ResponsiveContainer from "@/components/layout/ResponsiveContainer";
import { colors } from "@/theme/colors";

const fields = [
  "Nombre de la campana",
  "Descripcion",
  "Pago por accion",
  "Presupuesto total",
  "Fecha inicio",
  "Fecha fin",
];

export default function EmpresaCreateCampaign() {
  return (
    <ResponsiveContainer maxWidth={900}>
      <SectionHeader title="Nueva campana" subtitle="Configura tu proxima activacion" />

      <Card style={styles.formCard}>
        {fields.map((field) => (
          <View key={field} style={styles.field}>
            <Text style={styles.label}>{field}</Text>
            <TextInput
              placeholder="Completar..."
              placeholderTextColor={colors.muted}
              style={styles.input}
            />
          </View>
        ))}

        <View style={styles.buttonWrap}>
          <AppButton
            label="Publicar campana"
            onPress={() => Alert.alert("Campana creada", "Tu campana se guardo correctamente")}
          />
        </View>
      </Card>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  formCard: {
    gap: 10,
  },
  field: {
    width: "100%",
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
  input: {
    width: "100%",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.textPrimary,
    fontSize: 13,
  },
  buttonWrap: {
    marginTop: 8,
  },
});
