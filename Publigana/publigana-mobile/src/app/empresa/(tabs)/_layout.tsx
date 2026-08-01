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
      color={focused ? colors.info : colors.muted}
    />
  );
}

export default function EmpresaTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#091428",
          borderTopColor: "#1E3A5F",
          borderTopWidth: 1,
          height: 72,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.info,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "700",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
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
        name="create"
        options={{
          title: "Nueva",
          tabBarIcon: ({ size, focused }) => (
            <TabIcon name="add-circle" focused={focused} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analisis",
          tabBarIcon: ({ size, focused }) => (
            <TabIcon name="analytics" focused={focused} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Empresa",
          tabBarIcon: ({ size, focused }) => (
            <TabIcon name="business" focused={focused} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
