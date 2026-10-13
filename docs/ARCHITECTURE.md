# Arquitectura

## Áreas del repositorio

| Área | Responsabilidad actual | Grado de implementación |
| --- | --- | --- |
| `Publigana/publigana-next` | Landing, páginas web, Route Handlers, lógica de autenticación y persistencia con Prisma. | Web/API funcionales para registro, leads y acceso administrativo. |
| `Publigana/publigana-mobile` | Aplicación Expo/React Native, navegación, autenticación y áreas de promotor/negocio. | Autenticación conectada; varias vistas de dominio aún usan datos locales o simulados. |
| `Publigana/publigana-database` | SQL y respaldo heredados. | Fuente e historial separados; correspondencia completa con Prisma pendiente. |

No hay un workspace de paquetes en la raíz. Cada aplicación administra sus propias dependencias y scripts.

## Aplicación web y solicitud de leads

La web usa el App Router de Next.js. `app/page.tsx` compone Navbar, Hero, secciones de marketing, formulario de contacto y Footer. El formulario carga el catálogo geográfico desde `GET /api/municipios` y envía el interés a `POST /api/leads`.

Flujo del lead:

```text
Navegador -> Contact.tsx -> POST /api/leads
                         -> lead-registration.ts
                         -> validación de declaración CO y catálogo DIVIPOLA
                         -> getPrisma() / Prisma Client
                         -> PostgreSQL
```

La lógica de validación/persistencia del lead está separada del Route Handler para poder probarla con un repositorio sustituible. La localidad es opcional; no reemplaza la validación por código municipal.

## Registro y persistencia

`POST /api/auth/register` valida los datos en el servidor, exige una declaración confirmada de residencia en Colombia y un departamento/municipio compatible con el catálogo local DIVIPOLA. La contraseña se almacena como hash bcrypt. Para `negocio`, la creación de usuario y empresa se ejecuta en una transacción Prisma. No hay validación por geolocalización IP.

El código de acceso a datos se concentra en `app/lib/prisma.ts`, que instancia Prisma Client con `PrismaPg` y `@prisma/adapter-pg`. El esquema y la configuración del CLI están en `prisma/schema.prisma` y `prisma.config.ts`. La URL la proporciona `DATABASE_URL`.

## Autenticación y autorización

- Login compara la contraseña con bcrypt y emite un access token JWT (1 hora) y un refresh token (7 días).
- La cookie `publigana_admin_session` es `HttpOnly`, `SameSite=Lax` y `Secure` en producción; se emite para usuarios ADMIN cuando la solicitud proviene del `WEB_ORIGIN` confiable.
- Las páginas administrativas verifican ADMIN en el servidor. `GET /api/auth/session`, `GET /api/usuarios` y `GET /api/test/admin` también requieren rol ADMIN mediante el helper de autenticación, aceptando token Bearer o cookie.
- `POST /api/auth/logout` valida el origen confiable y expira la cookie. No invalida JWT emitidos.
- `GET /api/usuarios/me` usa el header Bearer y comprueba que el usuario autenticado sigue activo; no exige rol específico.
- El registro solo permite los roles `promotor` y `negocio`; no hay un catálogo de permisos Prisma. No inferir permisos de backend a partir de la navegación visual móvil.

El refresh token se devuelve al cliente, pero no hay endpoint de renovación implementado en el inventario actual.

## Aplicación móvil

Expo Router organiza las rutas bajo `src/app`; `AuthContext` administra el estado de sesión, `src/services/auth` llama a registro/login/perfil y Axios añade el token disponible. El almacenamiento usa SecureStore en plataformas nativas y `localStorage` en web.

La URL del backend se encuentra codificada en `src/services/api.ts`; no se observó configuración `EXPO_PUBLIC_*`. Los servicios de campañas, empresa, promotor y usuario no constituyen una integración de dominio completa; varias pantallas usan datos de muestra o simulan acciones.

## Funcionalidad que no debe darse por integrada

- Las tarjetas de Usuarios, Empresas, Campañas y Sorteos del dashboard muestran marcadores, no métricas reales.
- No se identificó una API web de gestión de campañas, pagos, sorteos, publicaciones o analítica.
- Los elementos de marketing sobre redes no demuestran publicación o conexión efectiva a proveedores de redes sociales.
- Las operaciones SQL independientes no están sincronizadas de forma demostrada con Prisma.

Consulte [API](API.md), [Base de datos](DATABASE.md), [Seguridad](SECURITY.md) y [Aplicación móvil](MOBILE.md) para detalles y limitaciones.
