-- ==========================================================
-- V7__crear_usuario_admin.sql
-- Crear usuario administrador inicial Publigana
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ==========================================================
-- 1. Crear rol ADMIN si no existe
-- ==========================================================

INSERT INTO rol (
    nombre,
    descripcion,
    created_at,
    updated_at
)
SELECT
    'ADMIN',
    'Administrador del sistema',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
    WHERE NOT EXISTS (
    SELECT 1
    FROM rol
    WHERE nombre = 'ADMIN'
);


-- ==========================================================
-- 2. Crear usuario administrador
-- Usuario:
-- correo: admin@publigana.com
-- password: Admin123*
-- ==========================================================

INSERT INTO usuario (
    id,
    nombres,
    apellidos,
    correo,
    telefono,
    contrasena,
    activo,
    created_at,
    updated_at,
    rol_id
)
SELECT
    gen_random_uuid(),
    'Administrador',
    'Publigana',
    'admin@publigana.com',
    '3000000000',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    TRUE,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP,
    r.id_rol
FROM rol r
WHERE r.nombre = 'ADMIN'
  AND NOT EXISTS (
    SELECT 1
    FROM usuario
    WHERE correo = 'admin@publigana.com'
);


-- ==========================================================
-- 3. Verificación
-- ==========================================================

DO $$
BEGIN

    IF NOT EXISTS (
        SELECT 1
        FROM usuario
        WHERE correo = 'admin@publigana.com'
    ) THEN

        RAISE EXCEPTION
        'No fue posible crear el usuario administrador';

END IF;

END $$;