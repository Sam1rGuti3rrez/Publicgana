# PubliGana Web

Aplicación web y API de PubliGana construida con Next.js App Router, React, TypeScript, Tailwind CSS, Prisma ORM 7 y PostgreSQL.

## Desarrollo local

Desde este directorio:

```sh
npm ci
npm run dev
```

Configura `DATABASE_URL`, `JWT_SECRET` y, para la sesión web administrativa, `WEB_ORIGIN` según la [guía de entorno](../../docs/SETUP.md). No compartas valores reales.

## Scripts

- `npm run lint`
- `npx tsc --noEmit`
- `npm run test:leads`
- `npm run test:municipalities`
- `npm run test:location-form`
- `npm run test:register`
- `npm run test:security`
- `npm run build`

Las definiciones están en `package.json`. No hay script npm genérico `test`.

## Documentación del repositorio

- [Arquitectura](../../docs/ARCHITECTURE.md)
- [API](../../docs/API.md)
- [Base de datos y migraciones](../../docs/DATABASE.md)
- [Seguridad](../../docs/SECURITY.md)
- [Puesta en marcha](../../docs/SETUP.md)

**Base de datos:** las migraciones Flyway/Prisma y el esquema conocido tienen discrepancias pendientes. No ejecutes comandos de migración en un entorno existente sin revisar primero la guía de base de datos y confirmar el destino.
