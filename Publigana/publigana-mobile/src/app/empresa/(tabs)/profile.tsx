import { StyleSheet, Text, View } from "react-native";

import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import Card from "@/components/cards/Card";
import SectionHeader from "@/components/common/SectionHeader";
import ResponsiveContainer from "@/components/layout/ResponsiveContainer";
import { colors } from "@/theme/colors";

export default function EmpresaProfile() {
  return (
    <ResponsiveContainer maxWidth={900}>
      <SectionHeader title="Perfil de empresa" subtitle="Informacion principal del anunciante" />

      <Card>
        <View style={styles.top}>
          <Avatar name="TechCorp S.A.S" size={64} />
          <View style={styles.topText}>
            <Text style={styles.name}>TechCorp S.A.S</Text>
            <Text style={styles.email}>marketing@techcorp.co</Text>
            <View style={styles.badgeWrap}>
              <Badge label="Cuenta verificada" tone="info" />
            </View>
          </View>
        </View>

        <View style={styles.metaList}>
          <Text style={styles.metaItem}>Sector: Tecnologia</Text>
          <Text style={styles.metaItem}>Pais: Colombia</Text>
          <Text style={styles.metaItem}>Plan: Growth</Text>
        </View>
      </Card>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  top: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  topText: {
    flex: 1,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: "800",
  },
  email: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  badgeWrap: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  metaList: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 12,
    gap: 8,
  },
  metaItem: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
