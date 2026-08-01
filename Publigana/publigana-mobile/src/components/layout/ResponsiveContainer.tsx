import { PropsWithChildren } from "react";
import { ScrollView, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { colors } from "@/theme/colors";

interface ResponsiveContainerProps extends PropsWithChildren {
  contentStyle?: StyleProp<ViewStyle>;
  maxWidth?: number;
}

export default function ResponsiveContainer({
  children,
  contentStyle,
  maxWidth = 1040,
}: ResponsiveContainerProps) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.inner, { maxWidth }, contentStyle]}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    alignItems: "center",
  },
  inner: {
    width: "100%",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 120,
  },
});
