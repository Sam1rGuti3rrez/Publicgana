# Aplicación móvil

## Tecnologías y configuración

`Publigana/publigana-mobile` usa Expo 57.0.24, Expo Router 57.0.22, React Native 0.86.3, React 19.2.3, React DOM 19.2.3 y TypeScript 6.0.3, según las dependencias instaladas. Incluye Axios, React Hook Form, Zod, Expo SecureStore, Expo Image y otros módulos Expo declarados en `package.json`.

`app.json` define orientación vertical, scheme `publiganamobile`, UI automática, salida web estática, typed routes y React Compiler; registra plugins de Expo Router, splash screen, SecureStore, Image y Web Browser. Que una opción exista en configuración no verifica builds nativos en esta máquina.

## Estructura

| Ruta | Responsabilidad observada |
| --- | --- |
| `src/app` | Rutas Expo Router: bienvenida, auth, empresa, promotor y pestañas. |
| `src/components` | Botones, cards, charts, layout, UI común y componentes de promotor. |
| `src/context/AuthContext.tsx` | Usuario, restauración de sesión, login/logout y rol activo de interfaz. |
| `src/services/api.ts` | Axios, URL base codificada, timeout e interceptor de Bearer token. |
| `src/services/auth` | Registro, login y consulta de usuario actual. |
| `src/services/campaign`, `empresa`, `promotor`, `user` | Archivos de servicio presentes pero vacíos. |
| `src/storage/tokenStorage.ts` | Tokens en SecureStore nativo y localStorage web. |
| `src/theme`, `src/types`, `src/hooks` | Tema, tipos y hooks compartidos. |

## Navegación y pantallas

La raíz `/` redirige a `/welcome`. La bienvenida conduce a registro o login. Expo Router organiza autenticación bajo `/auth`, y áreas con pestañas bajo `/promotor/(tabs)` y `/empresa/(tabs)`.

Promotor presenta inicio, campañas, ganancias y perfil. Empresa presenta dashboard, campañas, creación, analítica y perfil. Los paneles inspeccionados contienen valores/campañas estáticos y el formulario de campaña simula guardar con una alerta; no se conectan a servicios de dominio implementados.

El contexto restaura una sesión consultando `GET /api/usuarios/me`, guarda los tokens recibidos al iniciar sesión y los elimina al cerrar. El role switcher cambia el área visible localmente; no es una autorización en backend.

## Comunicación con backend

`src/services/api.ts` define una base HTTP con dirección de red local codificada. Axios agrega `Authorization: Bearer <access token>` si existe. `AuthService` implementa:

- `POST /auth/register`
- `POST /auth/login`
- `GET /usuarios/me`

El backend web expone esas rutas bajo `/api`. El resto de servicios de dominio está vacío y no se confirmó consumo móvil de campañas, leads, empresa, pagos ni métricas reales. Consulta [API](API.md) para contratos y diferencias de roles.

No existe variable Expo pública para la URL base en el código inspeccionado. Para desarrollo, la URL debe ser accesible desde el dispositivo/emulador; la IP actual no se repite en documentación. Externalizarla por ambiente y usar HTTPS en despliegue son tareas pendientes.

## Instalación y ejecución

Desde la raíz Git:

```sh
cd Publigana/publigana-mobile
npm ci
npm start
```

Scripts declarados en `package.json`:

| Script | Comando |
| --- | --- |
| `start` | `npm start` |
| `android` | `npm run android` |
| `web` | `npm run web` |
| `lint` | `npm run lint` |
| `reset-project` | `npm run reset-project` |

No hay scripts `ios`, `build`, `typecheck` o `test` declarados y no se encontraron archivos de test. La disponibilidad de simuladores, Android SDK, Xcode o builds EAS está pendiente de verificar.

## Configuración Expo

Assets e iconos se encuentran bajo `assets/`; `app.json` referencia icono, adaptive icons, favicon y splash. No se encontraron archivos `.env` ni variables `EXPO_PUBLIC_*` en `src`. El `.gitignore` móvil excluye `.env*.local`, además de carpetas Expo/build; revisa las reglas del repositorio antes de agregar secretos. No incluyas secretos en variables públicas empaquetadas en la app.

## Pendientes conocidos

- Unificar el casing y los valores canónicos de rol: tipos/contexto esperan mayúsculas, seed usa valores de promotor/negocio en minúsculas.
- La bienvenida pasa `rol=empresa` en una ruta de registro, mientras el API acepta `negocio`; la pantalla de registro no consume ese parámetro y mantiene su propio estado de selección.
- Cambiar la URL de desarrollo codificada por configuración por ambiente.
- Implementar servicios de dominio antes de describir los paneles de demostración como datos de producción.
- Verificar builds y pruebas en dispositivos y plataformas objetivo.
