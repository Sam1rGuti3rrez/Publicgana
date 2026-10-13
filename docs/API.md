# API web

## Alcance

Las rutas se implementan como Route Handlers en `Publigana/publigana-next/app/api`. Los contratos siguientes describen el código actual; no equivalen a una especificación OpenAPI. Las validaciones de cada ruta son manuales.

Las rutas que requieren Bearer esperan un JWT en el header `Authorization`, con esquema `Bearer`. Algunas rutas administrativas aceptan también la cookie web `publigana_admin_session`.

| Método | Ruta | Acceso | Propósito |
| --- | --- | --- | --- |
| `POST`, `OPTIONS` | `/api/auth/register` | Público; OPTIONS es preflight | Crear promotor o usuario negocio con residencia declarada en Colombia. |
| `POST`, `OPTIONS` | `/api/auth/login` | Público; OPTIONS es preflight | Autenticar con correo/contraseña y emitir JWT. |
| `GET` | `/api/auth/session` | ADMIN, Bearer o cookie de sesión | Devolver el perfil administrativo autenticado. |
| `POST` | `/api/auth/logout` | Origen web confiable | Expirar la cookie administrativa. |
| `GET` | `/api/usuarios/me` | Bearer requerido | Devolver el perfil de la cuenta activa; no requiere rol concreto. |
| `GET` | `/api/usuarios` | ADMIN, Bearer o cookie | Listar campos seleccionados de usuarios. |
| `GET` | `/api/health` | Público | Verificar consulta de base de datos. |
| `POST`, `OPTIONS` | `/api/leads` | Público; OPTIONS es preflight | Validar y registrar un lead. |
| `GET` | `/api/municipios` | Público | Entregar departamentos y municipios del catálogo local. |
| `GET` | `/api/test/admin` | ADMIN, Bearer o cookie | Comprobar autorización ADMIN. |

## Registro

### `POST /api/auth/register`

Recibe JSON con `rol`, `correo`, `contrasena`, `telefono`, `countryCode`, `residencyConfirmed`, `departmentCode`, `municipalityCode` y opcional `locality`. Para `promotor` requiere `nombres` y `apellidos`; para `negocio`, `nombreEmpresa` y `nit`.

Valida en servidor: país `CO`, confirmación booleana de residencia, municipio de cinco dígitos perteneciente al departamento del catálogo, localidad textual de hasta 150 caracteres si se informa, rol admitido, campos requeridos y contraseña de mínimo 8 caracteres. La verificación de municipio no usa IP ni demuestra nacionalidad. La contraseña se hashea con bcrypt. La creación del usuario y de la empresa (si aplica) usa una transacción.

| Estado | Caso |
| --- | --- |
| 201 | Usuario registrado; el JSON incluye mensaje y campos seleccionados del usuario. |
| 400 | JSON válido con cuerpo no objeto, declaración/ubicación ausente o inválida, campos faltantes, rol no permitido o contraseña corta. |
| 409 | Correo o NIT ya registrado. |
| 500 | JSON malformado, rol no configurado o fallo interno. |

### `POST /api/auth/login`

Entrada: `{ "correo": "...", "contrasena": "..." }`.

- `200`: `accessToken`, `refreshToken` cuando pudo generarse y perfil resumido.
- `400`: faltan credenciales.
- `401`: usuario inactivo/inexistente o credenciales inválidas.
- `500`: error interno o cuenta sin rol válido.

El access token vence en una hora y el refresh token en siete días. No existe ruta para renovar el token. Desde un `WEB_ORIGIN` confiable, un usuario ADMIN recibe además la cookie de sesión web. El handler expone CORS para el origen fijo `http://localhost:8081` y responde a OPTIONS.

### `GET /api/auth/session` y `POST /api/auth/logout`

`GET /api/auth/session` requiere ADMIN y devuelve `id`, nombres, apellidos, correo y rol (200); errores de autenticación/autorización dan 401/403.

`POST /api/auth/logout` exige origen igual al configurado como `WEB_ORIGIN` (403 si no es confiable), expira la cookie y devuelve `{ "ok": true }`. No revoca JWT ni refresh tokens.

## Leads y catálogo

### `GET /api/municipios`

Devuelve `{ departments, municipalities }` desde el catálogo JSON versionado localmente, con respuesta `Cache-Control: no-store`. Cada municipio incluye código, nombre, código y nombre del departamento. No consulta Neon.

### `POST /api/leads`

Entrada JSON: `{ nombre, correo, ciudad, tipoUsuario, countryCode, residencyConfirmed, departmentCode, municipalityCode, locality? }`.

`tipoUsuario` admite `usuario` o `negocio`. El servidor exige `countryCode: "CO"`, `residencyConfirmed: true`, departamento/municipio válidos y concordantes. Si `ciudad` está incluida, debe coincidir con el nombre oficial normalizado. `locality` es opcional y se limita a 150 caracteres. El correo se normaliza a minúsculas. La fila guarda `country_code`, `municipality_code` y `locality`; la respuesta de éxito no incluye esos tres campos.

| Estado | Caso |
| --- | --- |
| 201 | Devuelve `id`, `nombre`, `correo`, ciudad canónica y `tipoUsuario`. |
| 400 | JSON inválido, declaración o ubicación no válida, datos requeridos incorrectos o correo duplicado detectado antes de crear. |
| 409 | Carrera con restricción única de correo detectada por Prisma. |
| 500 | Fallo interno; el mensaje cliente es genérico. |

La ruta expone CORS `*` para POST/OPTIONS. No requiere token. Las pruebas disponibles para este flujo están en `scripts/leads.test.ts`.

## Perfil y usuarios

### `GET /api/usuarios/me`

Exige Bearer JWT. Consulta el usuario y rol actuales y exige que la cuenta esté activa. Devuelve `id`, nombres, apellidos, correo, teléfono y nombre de rol; 401 si el token o la cuenta no son válidos y 500 ante fallo interno.

### `GET /api/usuarios`

Exige rol ADMIN. Devuelve lista sin caché, ordenada por creación, con id, nombres, apellidos, correo, teléfono, activo, último acceso, rol y fechas. Respuestas de identidad inválida/rol insuficiente: 401/403; fallo interno: 500.

## Salud y prueba de rol

- `GET /api/health`: consulta `Rol.findFirst()`. Devuelve 200 `{ ok: true, database: "connected" }` o 500 `{ ok: false, database: "disconnected" }`. No comprueba compatibilidad total del esquema ni estado de migraciones.
- `GET /api/test/admin`: exige rol ADMIN; 200 devuelve `{ ok: true, message, rol: "ADMIN" }`, 401 si no hay identidad válida y 403 si el rol es insuficiente.

## CORS y límites

CORS se configura por ruta en leads, login y registro; no hay una política global confirmada. Login/registro fijan el origen móvil de desarrollo `http://localhost:8081`, mientras leads permite `*`. No se debe inferir disponibilidad cross-origin para las demás rutas.

No se documentan endpoints de refresh de JWT ni de gestión de campañas, pagos, sorteos o publicaciones. Los endpoints anteriores no han sido objeto de verificación contra una API desplegada en esta actualización.
