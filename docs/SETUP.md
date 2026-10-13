# Puesta en marcha, configuración y calidad

## Requisitos y ubicación

No hay `package.json` en la raíz Git. Instala y ejecuta cada aplicación desde su propio directorio. Los manifiestos no fijan una versión mínima de Node.js; usa una versión compatible con Next.js/Expo y con los lockfiles presentes. La web requiere PostgreSQL accesible para las operaciones de datos.

## Web Next.js

Desde la raíz del repositorio:

```sh
cd Publigana/publigana-next
npm ci
```

Variables leídas por el código web/Prisma:

| Nombre | Requerida | Uso |
| --- | --- | --- |
| `DATABASE_URL` | Sí para Prisma CLI y consultas a base | URL PostgreSQL; `prisma.config.ts` la lee con `env()` y `app/lib/prisma.ts` la pasa a PrismaPg. |
| `JWT_SECRET` | Sí para cargar el módulo JWT | Firma y verificación de tokens. Debe ser un valor secreto aleatorio gestionado fuera del código. |
| `WEB_ORIGIN` | Recomendada; necesaria para sesión web ADMIN en producción | Origen HTTP(S) confiable de la web. En desarrollo, si no se configura, el código usa `http://localhost:3000`; en producción no hay fallback. |
| `NODE_ENV` | Gestionada por Next.js | Controla, entre otros, la bandera `Secure` de la cookie y el fallback de desarrollo para `WEB_ORIGIN`. No suele configurarse manualmente en un despliegue Next.js. |

No se incluye un `.env.example` versionado. Crea localmente `Publigana/publigana-next/.env` con valores proporcionados/generados para tu entorno; no copies secretos a documentos ni al control de versiones:

```dotenv
DATABASE_URL="postgresql://<USUARIO>:<CONTRASENA>@<HOST>:<PUERTO>/<BASE>?schema=public"
JWT_SECRET="<SECRETO_ALEATORIO>"
WEB_ORIGIN="http://localhost:3000"
```

Los marcadores son ficticios y no son credenciales utilizables. No se debe imprimir el archivo `.env`. `WEB_ORIGIN` en producción debe ser el origen canónico HTTPS que administra el equipo.

### Ejecutar

```sh
npm run dev
```

Los scripts web declarados:

| Comando | Uso |
| --- | --- |
| `npm run dev` | Next.js desarrollo. |
| `npm run build` | Build de producción. |
| `npm run start` | Servir un build generado. |
| `npm run lint` | ESLint. |
| `npm run update:divipola` | Actualizar catálogo DIVIPOLA desde el script del proyecto; requiere revisión del cambio generado. |
| `npm run test:leads` | Pruebas de creación/validación de leads. |
| `npm run test:municipalities` | Pruebas del catálogo municipal. |
| `npm run test:location-form` | Pruebas de estado del formulario de ubicación. |
| `npm run test:register` | Pruebas del flujo de registro. |
| `npm run test:security` | Pruebas de sesión y seguridad web. |

Comprobaciones adicionales:

```sh
npx tsc --noEmit
npx prisma validate
```

Prisma CLI carga `prisma.config.ts`; al acceder a `env("DATABASE_URL")`, puede requerir esa variable incluso para validar/generar. No se ejecuta ni se recomienda ninguna migración automáticamente como parte de la instalación.

## Aplicación móvil

```sh
cd Publigana/publigana-mobile
npm ci
npm start
```

Scripts presentes en el manifiesto móvil: `start`, `reset-project`, `android`, `ios`, `web` y `lint`. No hay scripts declarados de test, typecheck o build. La URL base de API está codificada en `src/services/api.ts`; debe apuntar a un host alcanzable desde el dispositivo/emulador. No se observó una variable Expo pública para esa URL. No incluyas secretos de servidor en el bundle móvil.

## Prisma, migraciones y seed

`prisma.config.ts` declara `prisma/seed.ts`. Prisma Client se genera en `app/generated/prisma`. Antes de usar una base existente, revisa [Base de datos](DATABASE.md): hay discrepancias de historial Flyway/Prisma y diferencias de esquema reportadas. No ejecutes `migrate dev`, `migrate deploy`, `migrate resolve`, `db push` o `migrate reset` contra una base compartida/producción hasta tener un plan probado y autorizado.

El seed incluye una credencial fija de administrador de desarrollo y realiza upserts; no lo ejecutes en un entorno compartido o producción. Debe revisarse y sustituirse antes de recomendar bootstrap de entornos nuevos.

## Despliegue

El repositorio contiene una aplicación Next.js que puede compilarse con `npm run build` y servirse con `npm run start`; esto no confirma un despliegue actual ni el proveedor/configuración efectiva de producción. La configuración de Vercel, dominio, variables y proyecto de base debe confirmarla su administrador antes de desplegar. Configura secretos en el gestor del entorno y no en Git.

## Estado de validación

Los scripts anteriores son comandos disponibles en `package.json`; su presencia no implica que se hayan ejecutado en la actualización documental. No se ejecutaron pruebas, lint, TypeScript ni build para este cambio, que modifica solo documentación. La base de datos, migraciones y el seed no se ejecutaron.
