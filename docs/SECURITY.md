# Seguridad

## Estado comprobado

Esta sección distingue controles existentes de riesgos y recomendaciones. No equivale a una auditoría de penetración ni certifica un despliegue seguro.

## Secretos y configuración

| Variable/valor | Uso | Estado |
| --- | --- | --- |
| `DATABASE_URL` | `prisma.config.ts` y adaptador PostgreSQL del cliente Prisma. | Obligatoria para CLI/consultas; no había archivo de entorno ni conexión verificada. |
| `JWT_SECRET` | Firma/verificación de tokens en `app/lib/jwt.ts`. | Obligatoria; se valida durante importación del módulo. |
| URL base móvil | Constante en `publigana-mobile/src/services/api.ts`. | Codificada en fuente, sin variable de entorno observada. |

La web excluye `.env*` en su `.gitignore`. El `.gitignore` de la raíz enumera varios nombres comunes, pero no es una regla amplia para cada variante; la app móvil ignora `.env*.local`. Comprueba `git status --ignored` y las reglas aplicables antes de crear cualquier archivo con secretos. Los valores reales deben permanecer en un gestor de secretos o entorno local excluido; no se registran en esta documentación.

## Autenticación y tokens

- Login compara contraseñas con bcrypt y emite JWT access token (1 hora) y refresh token (7 días), firmados con `JWT_SECRET`.
- El payload incluye `userId` y `rol`; `/api/usuarios/me` verifica el token y consulta que la cuenta siga activa.
- `requireRole` compara el rol actual recuperado de la base para una ruta; hoy se usa explícitamente solo en `/api/test/admin`.
- No se encontró endpoint de refresh, logout del servidor, rotación de refresh tokens ni lista de revocación. El refresh token se genera, pero no hay flujo servidor verificado para renovarlo.
- Móvil guarda tokens nativos con Expo SecureStore; en web usa `localStorage`. El interceptor Axios adjunta el access token a solicitudes.

## Roles y autorización

No hay enum ni catálogo de permisos en el esquema: `Rol.nombre` es texto único. `prisma/seed.ts` crea `ADMIN`, `promotor` y `negocio`; registro admite `promotor`/`negocio` y resuelve la fila sin distinguir mayúsculas. Login devuelve el nombre almacenado tal cual.

El único permiso de rol implementado explícitamente en la API es `ADMIN` para `/api/test/admin`. `/api/usuarios/me` exige identidad válida, pero no rol; `/api/usuarios`, health y leads no exigen autenticación. No se debe inferir un sistema completo de autorización por rol a partir de las áreas visuales de la aplicación.

Existe una diferencia de contrato: tipos móviles y el contexto esperan `PROMOTOR`/`NEGOCIO` en mayúsculas, mientras el seed crea esos nombres en minúsculas. El login móvil enruta comparando exactamente `NEGOCIO`; las diferencias pueden enviar un usuario negocio a la ruta de promotor. Unificar los valores es una recomendación pendiente, no un comportamiento corregido.

## Datos, validación y operaciones sensibles

- Registro hashea la contraseña con bcrypt, costo 10, y usa transacción para usuario y empresa.
- Leads valida campos requeridos, correo con una expresión básica y tipo de usuario por lista permitida.
- Las rutas no usan un validador de esquema común; hay validaciones manuales y cuerpos malformados pueden terminar en 500.
- `GET /api/usuarios` no tiene autenticación y devuelve correos, teléfonos y otros datos de cuentas. Revisar y proteger antes de exponer el servicio.
- Login registra correo, resultado de búsqueda y metadatos como longitud/formato del hash de contraseña. No registra la contraseña en claro en el código inspeccionado, pero conviene retirar estos logs de diagnóstico o limitar/redactar los datos personales.
- `prisma/seed.ts` contiene una credencial fija para un usuario administrador de prueba. No se reproduce aquí. No ejecutes ese seed en un entorno compartido/producción; migrar su secreto a una provisión segura y rotarlo es una recomendación pendiente.
- La API móvil usa HTTP y una URL de red local codificada; producción debe definir un origen HTTPS apropiado. No se verificó TLS de ningún entorno.

## Dependencias y auditoría

La web declara bcrypt, jsonwebtoken, Prisma, adaptador pg y PostgreSQL driver; el móvil incluye Expo SecureStore y Axios. Auditoría ejecutada el 2026-10-09 con `npm audit --omit=dev`:

| Aplicación | Resultado observado |
| --- | --- |
| Web | 0 vulnerabilidades. |
| Móvil | 36 vulnerabilidades: 12 moderadas, 23 altas y 1 crítica. Hay dependencias transitivas de Expo/Metro; algunos arreglos sugeridos por npm requieren cambios mayores. |

No se ejecutó `npm audit fix` ni se alteraron dependencias. Revisa el informe completo con el equipo, confirma versiones compatibles con Expo SDK 57 y planifica actualizaciones no forzadas. No uses `npm audit fix --force` para resolver este informe sin una actualización planificada y pruebas de compatibilidad.

No se encontró suite de pruebas de seguridad, rate limiting, protección contra abuso, CORS global ni verificación de cabeceras/políticas de despliegue. Su ausencia en el código inspeccionado no demuestra cómo configura infraestructura externa.

## Recomendaciones pendientes

1. Proteger `/api/usuarios` con autenticación y autorización, y revisar minimización de datos.
2. Establecer valores canónicos de rol entre seed, API, tipos y navegación móvil.
3. Sustituir la credencial fija del seed; definir provisión, expiración, rotación y refresh/revocación de tokens.
4. Externalizar la URL móvil por entorno y exigir HTTPS fuera de desarrollo.
5. Usar validación declarativa de entrada y límites de intentos/tamaño en endpoints públicos.
6. Eliminar o redactar logs de autenticación antes de producción.
7. Revisar y atender el resultado móvil de 36 vulnerabilidades, volver a ejecutar auditoría y añadir pruebas de autorización con credenciales no productivas.
