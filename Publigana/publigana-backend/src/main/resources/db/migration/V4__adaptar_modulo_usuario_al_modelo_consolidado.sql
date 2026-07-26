-- Alinea el módulo Usuario con el modelo consolidado de PubliGana.
-- Los usuarios legacy con rol USER pasan a promotor.
INSERT INTO rol (nombre, descripcion, created_at, updated_at)
VALUES
    ('promotor', 'Usuario que participa en campañas compartiendo contenido', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('negocio', 'Usuario que crea y gestiona campañas', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('admin', 'Administrador de la plataforma', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (nombre) DO UPDATE
SET descripcion = EXCLUDED.descripcion,
    updated_at = CURRENT_TIMESTAMP;

UPDATE usuario
SET rol_id = (SELECT id_rol FROM rol WHERE nombre = 'promotor')
WHERE rol_id IN (SELECT id_rol FROM rol WHERE nombre = 'USER');

ALTER TABLE usuario
    ADD COLUMN IF NOT EXISTS foto_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS bio VARCHAR(300);

ALTER TABLE usuario
    ALTER COLUMN apellidos DROP NOT NULL,
    ALTER COLUMN activo SET DEFAULT TRUE,
    ALTER COLUMN created_at SET DEFAULT CURRENT_TIMESTAMP,
    ALTER COLUMN updated_at SET DEFAULT CURRENT_TIMESTAMP;

DO $$
DECLARE
    constraint_name TEXT;
BEGIN
    SELECT con.conname INTO constraint_name
    FROM pg_constraint con
    JOIN pg_attribute att ON att.attrelid = con.conrelid AND att.attnum = ANY (con.conkey)
    WHERE con.conrelid = 'usuario'::regclass
      AND con.contype = 'u'
      AND array_length(con.conkey, 1) = 1
      AND att.attname = 'telefono';
    IF constraint_name IS NOT NULL THEN
        EXECUTE format('ALTER TABLE usuario DROP CONSTRAINT %I', constraint_name);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_usuario_correo ON usuario(correo);
