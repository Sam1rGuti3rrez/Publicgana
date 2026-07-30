import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "@/theme/colors";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarActiveTintColor: "#FFD166",
        tabBarInactiveTintColor: "#FFFFFF",
      }}
    >

      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",

          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size }}>
              🏠
            </Text>
          ),
        }}
      />


      <Tabs.Screen
        name="campaigns"
        options={{
          title: "Campañas",

          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size }}>
              📢
            </Text>
          ),
        }}
      />


      <Tabs.Screen
        name="earnings"
        options={{
          title: "Ganancias",

          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size }}>
              💰
            </Text>
          ),
        }}
      />


      <Tabs.Screen
        name="profile"
        options={{
          title: "Perfil",

          tabBarIcon: ({ size }) => (
            <Text style={{ fontSize: size }}>
              👤
            </Text>
          ),
        }}
      />

    </Tabs>
  );
}