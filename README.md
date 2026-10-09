# PubliGana

Repositorio del proyecto PubliGana. Contiene una aplicación web Next.js con Route Handlers, una aplicación móvil Expo/React Native y archivos SQL relacionados con PostgreSQL.

## Aplicaciones

| Área | Ubicación | Tecnologías principales comprobadas |
| --- | --- | --- |
| Web/API | `Publigana/publigana-next` | Next.js 16.4.0, React 19.2.8, TypeScript 5, Prisma 7.10.0, PostgreSQL y `@prisma/adapter-pg`. |
| Móvil | `Publigana/publigana-mobile` | Expo 57.0.24, Expo Router 57.0.22, React Native 0.86.3 y TypeScript 6.0.3. |
| SQL | `Publigana/publigana-database` | Scripts SQL y respaldos; su sincronización con migraciones Prisma está pendiente de verificar. |

Las versiones son las instaladas en el entorno inspeccionado. Las dependencias declaradas y lockfiles de cada aplicación son la referencia para instalar.

## Estructura del repositorio

```text
docs/                         Documentación técnica
Publigana/publigana-next/     Aplicación web y API
Publigana/publigana-mobile/   Aplicación móvil
Publigana/publigana-database/ Scripts y respaldos SQL
```

No hay un `package.json` en la raíz Git; instala y ejecuta cada aplicación desde su directorio. No se localizaron archivos de entorno, y esta documentación no incluye credenciales ni una URL real. Configura las variables requeridas según la [guía de puesta en marcha](docs/SETUP.md).

## Documentación

Empieza por el [índice técnico](docs/README.md), que enlaza arquitectura, instalación, esquema de datos, API, seguridad, móvil y decisiones.

El proyecto se encuentra en desarrollo. Roles, permisos y servicios móviles tienen diferencias documentadas; consulta [Seguridad](docs/SECURITY.md) y [Aplicación móvil](docs/MOBILE.md) antes de integrar nuevos flujos.