# API

## Alcance

Las rutas son Route Handlers de `Publigana/publigana-next/app/api`. Los contratos siguientes se extrajeron de las implementaciones actuales, no de una especificación OpenAPI. No se encontraron pruebas automatizadas de estos endpoints. Salvo donde se indica, los handlers no validan un esquema JSON completo; un JSON malformado puede acabar en respuesta 500.

| Método | Ruta | Autenticación/autorización | Operación principal |
| --- | --- | --- | --- |
| `POST` | `/api/auth/register` | Pública | Valida datos, busca rol, comprueba duplicados y crea usuario; para `negocio` crea también empresa en una transacción. |
| `OPTIONS` | `/api/auth/register` | Pública | Preflight CORS. |
| `POST` | `/api/auth/login` | Pública | Busca usuario, compara bcrypt, actualiza último acceso y emite access/refresh tokens. |
| `OPTIONS` | `/api/auth/login` | Pública | Preflight CORS. |
| `GET` | `/api/usuarios/me` | Bearer JWT; verifica usuario activo, sin exigir rol específico. | Devuelve perfil de la cuenta autenticada. |
| `GET` | `/api/usuarios` | No implementada | Devuelve la lista de usuarios con campos personales seleccionados. |
| `GET` | `/api/health` | No implementada | Consulta un rol y reporta estado de conexión. |
| `POST` | `/api/leads` | No implementada | Valida y crea lead. |
| `OPTIONS` | `/api/leads` | Pública | Preflight CORS. |
| `GET` | `/api/test/admin` | Bearer JWT y rol `ADMIN` | Comprueba acceso administrativo y devuelve confirmación. |

## Contratos

### `POST /api/auth/register`

Entrada JSON: `rol`, `correo`, `contrasena`, `telefono`; si `rol` es `promotor`, exige `nombres` y `apellidos`; si es `negocio`, exige `nombreEmpresa` y `nit`. El handler convierte `rol` a minúsculas y permite solo esos dos valores. Requiere contraseña de al menos 8 caracteres. No se documenta validación por formato de teléfono ni política adicional de contraseña.

| Resultado | Estado | Cuerpo observado |
| --- | --- | --- |
| Creado | 201 | `{ message, usuario: { id, nombres, apellidos, correo, telefono, rol } }` |
| Falta campo / rol no permitido / datos de rol | 400 | `{ error }` |
| Correo o NIT duplicado | 409 | `{ error }` |
| Rol no configurado o fallo no controlado | 500 | `{ error }` |

El rol debe existir previamente en `Rol`. Para `negocio`, la creación de usuario y empresa ocurre dentro de `$transaction`.

### `POST /api/auth/login`

Entrada JSON: `correo` y `contrasena`.

| Resultado | Estado | Cuerpo observado |
| --- | --- | --- |
| Autenticado | 200 | `{ accessToken, refreshToken, usuario: { id, nombres, apellidos, correo, rol } }` |
| Faltan credenciales | 400 | `{ error }` |
| Credenciales incorrectas o usuario inactivo | 401 | `{ error: "Credenciales inválidas" }` |
| Rol faltante o error de operación | 500 | `{ error }` |

El access token se firma con expiración de una hora y el refresh token con siete días. No existe ruta de refresh en el inventario actual. Login añade CORS para `http://localhost:8081`, métodos `POST, OPTIONS` y headers `Content-Type, Authorization`.

### `GET /api/usuarios/me`

Requiere `Authorization: Bearer <token>`. Verifica firma y claims `userId`/`rol`, consulta al usuario y exige que esté activo. No compara el rol con una política específica.

| Estado | Condición observada |
| --- | --- |
| 200 | Devuelve `id`, `nombres`, `apellidos`, `correo`, `telefono` y `rol`. |
| 401 | Falta token, token inválido/incompleto o usuario inexistente/inactivo. |
| 500 | Error de base de datos u otro fallo interno. |

### `GET /api/usuarios`

No comprueba token ni rol. Devuelve una lista ordenada por fecha de creación con `id`, nombres, apellidos, correo, teléfono, activo, último acceso, rol (id/nombre) y fechas. Devuelve 200 con el array o 500 con `{ error }`. La falta de autenticación sobre datos personales es un riesgo que debe revisarse antes de producción.

### `GET /api/health`

Sin autenticación. Ejecuta `findFirst` sobre `Rol` y responde `{ ok: true, database: "connected" }` con 200 o `{ ok: false, database: "disconnected" }` con 500. El error detallado solo se registra en el servidor.

### `POST /api/leads`

Entrada JSON: `{ nombre, correo, ciudad, tipoUsuario }`. Normaliza el correo a minúsculas; valida presencia, formato básico de correo y `tipoUsuario` igual a `usuario` o `negocio`. Busca correo duplicado y crea en `leads`.

| Resultado | Estado | Cuerpo observado |
| --- | --- | --- |
| Creado | 201 | `{ id, nombre, correo, ciudad, tipoUsuario }` |
| Campo requerido inválido, formato de correo inválido o duplicado | 400 | `{ message }` |
| Error de base de datos u otro fallo | 500 | `{ message: "Error interno del servidor" }` |

`POST`/`OPTIONS` envían `Access-Control-Allow-Origin: *`, métodos `POST, OPTIONS` y header permitido `Content-Type`. La ruta no requiere autenticación.

### `GET /api/test/admin`

Usa `requireRole(request, "ADMIN")`: exige Bearer JWT válido, usuario activo y que el rol actual de la base coincida con `ADMIN` sin distinguir mayúsculas. Devuelve 200 `{ ok, message, rol }`, 401 para identidad no válida y 403 para rol insuficiente. Errores de acceso a base no se capturan en este handler.

## CORS y errores

CORS solo está configurado explícitamente en leads, login y register. No se encontró una política CORS global. No asumas que el resto de rutas es accesible cross-origin.

Las respuestas 500 suelen ser genéricas para el cliente; revisa logs del servidor con cuidado. Login registra actualmente datos de diagnóstico que incluyen correo y metadatos de contraseña; consulta [Seguridad](SECURITY.md).
