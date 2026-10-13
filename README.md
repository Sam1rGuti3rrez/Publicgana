# PubliGana

PubliGana es un proyecto en desarrollo para conectar negocios con personas que pueden compartir publicidad en redes sociales. El repositorio contiene una web con API, una aplicación móvil y archivos SQL históricos. La presencia de pantallas o datos de demostración no implica que las funciones de campañas, pagos o sorteos estén integradas de extremo a extremo.

## Aplicaciones

| Área | Ubicación | Tecnologías declaradas |
| --- | --- | --- |
| Web y API | `Publigana/publigana-next` | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Prisma 7 y PostgreSQL. |
| Móvil | `Publigana/publigana-mobile` | Expo 57, Expo Router, React Native 0.86, TypeScript 6 y Axios. |
| SQL histórico | `Publigana/publigana-database` | Archivos de esquema/datos y un respaldo; su equivalencia con Prisma no está verificada. |

Las versiones exactas y rangos se encuentran en los `package.json` y lockfiles de cada aplicación. No existe un `package.json` en la raíz Git.

## Funcionalidad comprobada en el código

- Landing web con explicación del producto, secciones de beneficios y formulario de interés.
- Registro de cuentas `promotor` y `negocio`, validación de residencia declarada en Colombia y municipio DIVIPOLA; el registro de negocio crea una empresa dentro de una transacción.
- Login con bcrypt y JWT; área administrativa protegida por rol `ADMIN` y sesión web mediante cookie.
- Endpoint público para registrar leads, con validación de residencia y ubicación colombiana.
- Aplicación móvil con navegación Expo y flujos de autenticación; varias áreas de promotor/empresa muestran datos de ejemplo y no están conectadas a servicios de dominio completos.
- Las tarjetas del dashboard administrativo son marcadores visuales, no métricas conectadas.

La política geográfica verifica una declaración explícita de residencia y un municipio/departamento colombiano del catálogo; no usa geolocalización por IP como prueba de residencia.

## Estructura

```text
docs/                         Documentación técnica del repositorio
Publigana/publigana-next/     Web, Route Handlers, Prisma y pruebas
Publigana/publigana-mobile/   Aplicación Expo/React Native
Publigana/publigana-database/ Archivos SQL históricos
CHANGELOG.md                  Resumen de cambios del historial Git
```

## Ejecutar localmente

Requisitos prácticos: Node.js y npm compatibles con los lockfiles; la web necesita una base PostgreSQL accesible para las rutas que consultan datos. La versión mínima de Node y un servidor de desarrollo compartido no están fijados en los manifiestos.

Configura `DATABASE_URL` y `JWT_SECRET` en el entorno local de la aplicación web antes de ejecutar la API. `WEB_ORIGIN` permite fijar el origen confiable de la sesión web; consulta [Puesta en marcha](docs/SETUP.md). No publiques valores reales.

```sh
cd Publigana/publigana-next
npm ci
npm run dev
```

La web de desarrollo se sirve normalmente en `http://localhost:3000`.

Para la aplicación móvil:

```sh
cd Publigana/publigana-mobile
npm ci
npm start
```

La URL del backend móvil está definida en el código cliente, no mediante una variable Expo por entorno; deberá ser accesible desde el dispositivo o emulador.

## Comprobaciones disponibles

Desde `Publigana/publigana-next`:

```sh
npm run lint
npx tsc --noEmit
npm run test:leads
npm run test:municipalities
npm run test:location-form
npm run test:register
npm run test:security
npm run build
```

Los scripts npm se definen en `Publigana/publigana-next/package.json`. No hay un script `test` global ni scripts declarados de TypeScript, tests o build en el `package.json` móvil. Véase [Puesta en marcha](docs/SETUP.md) para detalles y precauciones.

## Documentación

- [Índice técnico](docs/README.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Puesta en marcha, entorno y pruebas](docs/SETUP.md)
- [Base de datos, Prisma y migraciones](docs/DATABASE.md)
- [API](docs/API.md)
- [Seguridad](docs/SECURITY.md)
- [Aplicación móvil](docs/MOBILE.md)
- [Decisiones técnicas](docs/DECISIONS.md)
- [Changelog técnico](CHANGELOG.md)

## Estado y precauciones

La base PostgreSQL/Neon usada actualmente por producción no se inspeccionó en esta actualización documental. Diagnósticos previos reportaron discrepancias entre Flyway, migraciones Prisma y el esquema existente; por tanto no se debe ejecutar una migración ni marcarla como aplicada sin confirmar el destino, obtener respaldo y verificar cada efecto. Consulta [Base de datos](docs/DATABASE.md).

No se confirma aquí el estado de despliegue, la configuración actual de Vercel ni la disponibilidad de la base. No hay despliegues ni operaciones de base de datos asociados a esta documentación.
