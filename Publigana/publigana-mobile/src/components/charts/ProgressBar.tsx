import { StyleSheet, View } from "react-native";

import { colors } from "@/theme/colors";

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
}

export default function ProgressBar({
  value,
  color = colors.info,
  height = 7,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <View style={[styles.track, { height }]}> 
      <View style={[styles.fill, { width: `${clamped}%`, backgroundColor: color }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    backgroundColor: "#2A1757",
    borderRadius: 999,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
});
