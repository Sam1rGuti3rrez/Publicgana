import {ThemeProvider} from "@react-navigation/native";
import {Slot} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {useColorScheme} from "react-native";
import {useEffect, useState} from "react";

import {AuthProvider} from "@/context/AuthContext";
import {darkTheme, lightTheme} from "@/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        /**
         * Próximamente:
         * - Cargar JWT
         * - Obtener usuario
         * - Obtener rol
         */
      } finally {
        setReady(true);
        await SplashScreen.hideAsync();
      }
    }

    bootstrap();
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? darkTheme : lightTheme}
    >
      <AuthProvider>
        <Slot />
      </AuthProvider>
    </ThemeProvider>
  );
}