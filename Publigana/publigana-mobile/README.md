# PubliGana Mobile

Aplicación Expo/React Native de PubliGana. Expo Router proporciona navegación por archivos; la autenticación consume la API web y varias vistas de dominio aún usan datos de ejemplo.

## Inicio local

```sh
npm ci
npm start
```

Scripts disponibles: `start`, `reset-project`, `android`, `ios`, `web` y `lint`. No se declaran scripts de pruebas, typecheck o build.

La base URL del backend está codificada en `src/services/api.ts`; asegúrate de que el valor de desarrollo sea alcanzable desde el dispositivo/emulador. No hay configuración Expo pública por entorno en el código inspeccionado. No incluyas secretos de servidor en la aplicación cliente.

Consulta [documentación móvil](../../docs/MOBILE.md), [API](../../docs/API.md) y [puesta en marcha](../../docs/SETUP.md).
