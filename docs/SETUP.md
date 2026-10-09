# Puesta en marcha

## Requisitos verificados

| Herramienta | Valor comprobado | Observaciones |
| --- | --- | --- |
| Node.js | v24.21.0 en el entorno inspeccionado | Ningún `package.json` declara `engines`; versión mínima compatible pendiente de verificar. |
| npm | 11.19.0 en el entorno inspeccionado | Cada aplicación tiene su propio lockfile. |
| PostgreSQL | Motor configurado en Prisma | Versión, host y base de datos de desarrollo pendientes de verificar. |
| Android/iOS | Dependen del entorno Expo y sus herramientas nativas | No se inspeccionaron SDKs o simuladores instalados. |

Versiones instaladas verificadas en el workspace: Next.js 16.4.0, React/React DOM web 19.2.8, Prisma y Prisma Client 7.10.0, `@prisma/adapter-pg` 7.9.1 y TypeScript web 5.9.3; Expo 57.0.24, Expo Router 57.0.22, React Native 0.86.3, React/React DOM móvil 19.2.3 y TypeScript móvil 6.0.3. Los rangos declarados están en los `package.json` respectivos; `npm ci` usa los lockfiles.

## Instalar dependencias

Desde la raíz Git:

```sh
cd Publigana/publigana-next
npm ci
```

En otra terminal para la aplicación móvil:

```sh
cd Publigana/publigana-mobile
npm ci
```

## Configuración del servidor web

No se encontraron archivos `.env` ni plantillas de entorno en el repositorio. Crea `Publigana/publigana-next/.env` localmente. El `.gitignore` propio de la web excluye `.env*`; no copies secretos a documentación, commits, capturas ni logs.

```dotenv
DATABASE_URL="postgresql://<USUARIO>:<CONTRASENA>@<HOST>:<PUERTO>/<BASE_DE_DATOS>?schema=public"
JWT_SECRET="<SECRETO_ALEATORIO_LARGO>"
```

Sustituye los marcadores por valores proporcionados por quien administra PostgreSQL y genera `JWT_SECRET` con un gestor de secretos o una fuente criptográficamente segura. Los marcadores no son valores de conexión válidos. `DATABASE_URL` usa el formato PostgreSQL consumido por Prisma y `pg`; no se ha identificado una instancia real ni se ha probado la conectividad.

`prisma.config.ts` carga `dotenv/config` y evalúa `env("DATABASE_URL")`; las operaciones del CLI de Prisma, incluida la generación del cliente, requieren esa variable. Next.js requiere `JWT_SECRET` al cargar `app/lib/jwt.ts`. En el estado inspeccionado, el build pasó sin `DATABASE_URL` después de diferir la creación del cliente, pero falló sin `JWT_SECRET` por la validación existente de JWT.

En despliegue, configura ambas variables como secretos del entorno de ejecución. Si Prisma CLI o migraciones se ejecutan en CI/build, configura también `DATABASE_URL` en ese job. No uses URLs ficticias para omitir validaciones.

## PostgreSQL y Prisma

1. Solicita al administrador del entorno el host, puerto, nombre de base, usuario, contraseña, TLS y permisos requeridos. Esos datos están pendientes de verificar.
2. Crea/configura la base PostgreSQL por el procedimiento del equipo. No se documenta aquí un proveedor ni una versión de servidor no comprobados.
3. Guarda la URL en el `.env` local de la aplicación web o en el gestor de secretos del entorno.
4. Desde `Publigana/publigana-next`, con la variable disponible, usa los comandos Prisma que correspondan:

```sh
npx prisma generate
npx prisma migrate dev
```

Para aplicar migraciones ya aprobadas en un entorno de despliegue, Prisma proporciona `npx prisma migrate deploy`. No ejecutes migraciones contra datos existentes sin confirmar el entorno, respaldo y procedimiento del equipo. El CLI no pudo generar el cliente durante esta inspección porque no había `DATABASE_URL`.

El archivo `prisma/seed.ts` existe, pero no se encontró un script npm ni configuración de seed en `prisma.config.ts`; no se documenta una forma de ejecutarlo como flujo soportado. Revisa [Seguridad](SECURITY.md) antes de usarlo: contiene una credencial administrativa fija.

La carpeta `Publigana/publigana-database` mantiene SQL aparte. Su README menciona un nombre de archivo de esquema que no coincide exactamente con el nombre presente. Compara esquema, datos y migraciones antes de elegir una fuente para inicializar una base.

## Ejecutar la web

```sh
cd Publigana/publigana-next
npm run dev
```

Scripts disponibles en `package.json`:

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor Next.js de desarrollo. |
| `npm run build` | Build de producción. Requiere `JWT_SECRET` con el código actual. |
| `npm run start` | Sirve el build ya generado. |
| `npm run lint` | Ejecuta ESLint. |
| `npx tsc --noEmit` | Comprueba TypeScript; es un comando directo, no un script npm. |
| `npx prisma generate` | Genera Prisma Client; requiere `DATABASE_URL` por `prisma.config.ts`. |

No existe script `test` ni se encontraron archivos de pruebas web en la inspección.

## Ejecutar la aplicación móvil

```sh
cd Publigana/publigana-mobile
npm start
```

El script `start` ejecuta `expo start`. También existen `npm run android`, `npm run web` y `npm run lint`. No hay scripts declarados de `ios`, `build` o `test` en el `package.json` móvil.

Antes de probar contra una API local, revisa `src/services/api.ts`: la base URL está codificada directamente y debe apuntar a un host accesible desde el dispositivo/emulador. El proyecto no lee una variable `EXPO_PUBLIC_*` para esa URL.

## Problemas conocidos

| Síntoma | Causa comprobada o probable | Acción |
| --- | --- | --- |
| Prisma CLI indica que no puede resolver `DATABASE_URL`. | `prisma.config.ts` evalúa `env("DATABASE_URL")`; no hay `.env` versionado. | Configura la URL real en el entorno local o CI sin publicarla. |
| Web build indica `JWT_SECRET no está definida`. | `app/lib/jwt.ts` valida la variable durante la importación. | Configura `JWT_SECRET` antes de compilar y ejecutar. |
| Health check devuelve `database: disconnected`. | Falta URL, no hay conectividad o la consulta a `rol` falla. | Revisa el log del servidor sin imprimir la URL y prueba acceso al host con el equipo de base de datos. |
| Móvil no conecta al backend. | La URL está fijada a una IP local de desarrollo. | Configura en código una dirección alcanzable desde ese dispositivo/entorno; la externalización queda pendiente. |
| Registro móvil rechaza o enruta un rol inesperadamente. | El cliente, el seed y el backend tienen diferencias de mayúsculas/nombres en roles. | Consulta [Seguridad](SECURITY.md) y [API](API.md); pendiente unificar contratos. |
