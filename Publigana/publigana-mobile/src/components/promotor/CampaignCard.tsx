import { StyleSheet, Text, View } from "react-native";

import AppButton from "@/components/buttons/AppButton";
import Card from "@/components/cards/Card";
import Avatar from "@/components/common/Avatar";
import Badge from "@/components/common/Badge";
import { colors } from "@/theme/colors";

export interface PromotorCampaign {
  id: number;
  company: string;
  platform: string;
  reward: string;
  status: "activa" | "nueva" | "cerrando";
}

interface CampaignCardProps {
  campaign: PromotorCampaign;
  onView: (campaign: PromotorCampaign) => void;
}

const STATUS_META = {
  activa: { label: "Activa", tone: "success" as const },
  nueva: { label: "Nueva", tone: "info" as const },
  cerrando: { label: "Cierra pronto", tone: "warning" as const },
};

export default function CampaignCard({ campaign, onView }: CampaignCardProps) {
  const meta = STATUS_META[campaign.status];

  return (
    <Card style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.companyRow}>
          <Avatar name={campaign.company} size={40} />
          <View style={styles.companyMeta}>
            <Text style={styles.company}>{campaign.company}</Text>
            <Text style={styles.platform}>{campaign.platform}</Text>
          </View>
        </View>
        <Badge label={meta.label} tone={meta.tone} />
      </View>

      <View style={styles.bottomRow}>
        <View>
          <Text style={styles.rewardLabel}>Recompensa</Text>
          <Text style={styles.rewardValue}>{campaign.reward}</Text>
        </View>

        <AppButton
          label="Ver campana"
          variant="secondary"
          fullWidth={false}
          onPress={() => onView(campaign)}
          style={styles.cta}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    borderRadius: 20,
    paddingVertical: 14,
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  companyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  companyMeta: {
    flex: 1,
  },
  company: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  platform: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
    flexWrap: "wrap",
  },
  rewardLabel: {
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: "700",
    marginBottom: 2,
  },
  rewardValue: {
    color: colors.success,
    fontSize: 20,
    fontWeight: "800",
  },
  cta: {
    minWidth: 140,
  },
});
