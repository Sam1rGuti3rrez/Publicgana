import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "@/theme/colors";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

function TabIcon({
  name,
  focused,
  size,
}: {
  name: IoniconName;
  focused: boolean;
  size: number;
}) {
  return (
    <Ionicons
      name={focused ? name : (`${name}-outline` as IoniconName)}
      size={size}
      color={focused ? colors.goldLight : colors.muted}
    />
  );
}

export default function PromotorTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.goldLight,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          tabBarIcon: ({ size, focused }) => (
            <TabIcon name="home" focused={focused} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="campaigns"
        options={{
          title: "Campanas",
          tabBarIcon: ({ size, focused }) => (
            <TabIcon name="megaphone" focused={focused} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="earnings"
        options={{
          title: "Ganancias",
          tabBarIcon: ({ size, focused }) => (
            <TabIcon name="wallet" focused={focused} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",
          tabBarIcon: ({ size, focused }) => (
            <TabIcon name="person" focused={focused} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
