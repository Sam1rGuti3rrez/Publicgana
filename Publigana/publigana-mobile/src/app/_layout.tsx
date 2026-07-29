import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";

import { AuthProvider } from "@/context/AuthContext";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
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
      <AuthProvider>
        <Slot />
      </AuthProvider>
  );
}