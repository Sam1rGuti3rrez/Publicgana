import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppRole } from "@/context/AuthContext";
import { colors } from "@/theme/colors";

interface RoleSwitcherProps {
  value: AppRole;
  onChange: (role: AppRole) => void;
  style?: ViewStyle;
}

export default function RoleSwitcher({ value, onChange, style }: RoleSwitcherProps) {
  const promotorActive = value === "promotor";
  const empresaActive = value === "empresa";

  return (
    <View style={[styles.wrapper, style]}>
      <Pressable
        onPress={() => onChange("promotor")}
        style={[
          styles.option,
          promotorActive && styles.optionActive,
          promotorActive && styles.optionPromotorActive,
        ]}
      >
        <View style={styles.optionContent}>
          <Ionicons
            name="person-circle-outline"
            size={16}
            color={promotorActive ? colors.textPrimary : colors.gray400}
          />
          <Text style={[styles.label, promotorActive && styles.labelActive]}>Influencer / Usuario</Text>
        </View>
      </Pressable>

      <Pressable
        onPress={() => onChange("empresa")}
        style={[
          styles.option,
          empresaActive && styles.optionActive,
          empresaActive && styles.optionEmpresaActive,
        ]}
      >
        <View style={styles.optionContent}>
          <Ionicons
            name="business-outline"
            size={16}
            color={empresaActive ? colors.textPrimary : colors.gray400}
          />
          <Text style={[styles.label, empresaActive && styles.labelActive]}>Portal Empresa</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    marginBottom: 14,
  },
  option: {
    flex: 1,
    minHeight: 36,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  optionActive: {
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  optionPromotorActive: {
    backgroundColor: colors.primary,
  },
  optionEmpresaActive: {
    backgroundColor: colors.info,
  },
  label: {
    color: colors.gray400,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },
  labelActive: {
    color: colors.textPrimary,
  },
});
