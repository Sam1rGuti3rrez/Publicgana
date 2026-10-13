# Aplicación móvil

## Tecnologías y estructura

`Publigana/publigana-mobile` usa Expo, Expo Router, React Native, TypeScript, Axios, React Hook Form y Zod, según `package.json`. Las rutas viven en `src/app`; el estado de autenticación está en `src/context/AuthContext.tsx`; API y autenticación están en `src/services`; persistencia de token está en `src/storage/tokenStorage.ts`.

La URL base del backend está definida en `src/services/api.ts`. No se observó variable de entorno Expo para reemplazarla. El valor del código está destinado a desarrollo de red local y no se copia aquí; el dispositivo/emulador debe poder alcanzar el servidor configurado.

## Funcionalidad observada

- Flujo de bienvenida, registro e inicio de sesión.
- Contexto que conserva sesión y consulta `GET /api/usuarios/me`.
- Almacenamiento con SecureStore en nativo y `localStorage` para web.
- Navegación a áreas de promotor y empresa.
- Registro envía datos requeridos de residencia/ubicación y el backend valida país CO, confirmación y municipio.

Las vistas de campaña, ganancias, analítica y empresa contienen datos de muestra o acciones simuladas. Los servicios de campañas, empresa, promotor y usuario existen pero no ofrecen una integración de dominio completa. No afirmar que campañas, pagos, sorteos o métricas sean funcionalidad móvil conectada a PostgreSQL.

## Integración y límites

`AuthService` implementa consumo de registro, login y perfil actual. Axios agrega el access token si existe. La API normaliza los roles de registro a `promotor`/`negocio`, mientras algunos componentes/tipos móviles comparan roles en mayúsculas; el enrutamiento puede ser inconsistente según el valor devuelto por la base. La unificación de roles sigue pendiente.

No se observó configuración de despliegue móvil o URL por entorno. Las pruebas de dispositivo, builds nativos y disponibilidad del servidor no se verificaron en esta actualización.

## Comandos disponibles

Desde `Publigana/publigana-mobile`:

```sh
npm ci
npm start
npm run android
npm run ios
npm run web
npm run lint
```

El manifiesto no declara scripts de pruebas, TypeScript independiente ni build. Véase [Puesta en marcha](SETUP.md) y [API](API.md).
