# Seguridad: comportamiento y pendientes

Este documento resume controles visibles en el código; no es una auditoría de penetración ni certifica la configuración desplegada.

## Variables y secretos

| Variable | Uso confirmado |
| --- | --- |
| `DATABASE_URL` | Conexión Prisma/pg desde el servidor y configuración CLI. |
| `JWT_SECRET` | Firma y verificación de JWT. |
| `WEB_ORIGIN` | Origen confiable para emitir y cerrar la cookie administrativa. En producción no hay valor por defecto. |

Los valores no deben guardarse en Git, enviarse a logs ni exponerse en reportes. La URL móvil de API está codificada en el cliente, pero no se reproduce aquí. No hay un `.env.example` activo.

## Autenticación y autorización implementadas

- `POST /api/auth/login` comprueba bcrypt y devuelve access JWT de una hora y refresh JWT de siete días. No existe endpoint de refresh ni revocación de tokens.
- La sesión web ADMIN usa la cookie `publigana_admin_session` con `HttpOnly`, `SameSite=Lax` y `Secure` en producción. El login solo la emite para rol ADMIN desde origen confiable (`WEB_ORIGIN`); el logout también valida origen y expira la cookie.
- Las páginas administrativas y `GET /api/auth/session`, `GET /api/usuarios` y `GET /api/test/admin` requieren ADMIN en el servidor.
- `GET /api/usuarios/me` requiere Bearer válido y cuenta activa, sin rol específico.
- Registro público admite `promotor` y `negocio`; el registro no crea cuentas ADMIN.
- El campo `Rol.nombre` es texto, no enum. La comparación de autorización se hace sin distinguir mayúsculas en el helper `requireRole`.

## Validación geográfica y datos

El registro y `POST /api/leads` exigen `countryCode` CO, confirmación explícita de residencia y código de municipio/departamento consistente con el catálogo DIVIPOLA versionado. El servidor no usa IP como prueba de residencia. La localidad adicional es opcional. Las columnas geográficas son nullable en el esquema/migraciones para conservar compatibilidad con filas previas; el requisito se aplica en los flujos de alta.

Las restricciones CHECK en migraciones limitan los códigos cuando no son NULL. El estado actual de las restricciones de la base productiva no se consultó durante esta actualización.

## Pendientes/riesgos respaldados por el código

- `GET /api/usuarios` ahora exige ADMIN, pero devuelve datos de contacto a administradores; mantener el acceso limitado y revisar minimización según necesidades.
- El login registra mensajes de diagnóstico que incluyen correo y metadatos relacionados con contraseñas/hash. No registra la contraseña en claro en la implementación inspeccionada; aun así, revisar/redactar esos logs antes de producción.
- `prisma/seed.ts` contiene una credencial fija para una cuenta ADMIN de desarrollo y escribe mediante upsert. No ejecutarlo en una base compartida/producción; migrar a un bootstrap seguro y rotar cualquier credencial expuesta.
- Se devuelve refresh token, pero no hay endpoint de renovación ni revocación. El logout web solo expira la cookie del navegador.
- CORS se configura por algunas rutas y no se identificó una política global. Leads usa origen `*`; login/registro usan origen de desarrollo codificado.
- La URL móvil usa HTTP y está codificada para desarrollo; producción requiere origen HTTPS y administración por entorno, trabajo que no está implementado en el cliente actual.
- No se identificaron controles de rate limiting en estos handlers.
- La historia Prisma y el estado real de la base no están reconciliados/validados actualmente; véase [Base de datos](DATABASE.md).

No se ha ejecutado un nuevo `npm audit` en esta actualización. Los resultados de auditorías antiguas no se consideran actuales y no se reproducen como estado vigente.
