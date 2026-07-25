CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1) Alinear tabla rol con entidad actual
ALTER TABLE IF EXISTS rol
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

UPDATE rol
SET created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, CURRENT_TIMESTAMP)
WHERE created_at IS NULL OR updated_at IS NULL;

ALTER TABLE IF EXISTS rol
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET NOT NULL;

-- 2) Alinear tabla usuario (legacy -> modelo JPA actual)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'usuario' AND column_name = 'password_hash'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'usuario' AND column_name = 'contrasena'
    ) THEN
        ALTER TABLE usuario RENAME COLUMN password_hash TO contrasena;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'usuario' AND column_name = 'estado'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'usuario' AND column_name = 'activo'
    ) THEN
        ALTER TABLE usuario RENAME COLUMN estado TO activo;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'usuario' AND column_name = 'fecha_registro'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'usuario' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE usuario RENAME COLUMN fecha_registro TO created_at;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'usuario' AND column_name = 'id_rol'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'usuario' AND column_name = 'rol_id'
    ) THEN
        ALTER TABLE usuario RENAME COLUMN id_rol TO rol_id;
    END IF;
END $$;

ALTER TABLE IF EXISTS usuario
    ADD COLUMN IF NOT EXISTS id UUID,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS ultimo_acceso TIMESTAMP,
    ADD COLUMN IF NOT EXISTS contrasena VARCHAR(255),
    ADD COLUMN IF NOT EXISTS activo BOOLEAN,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS rol_id INT;

UPDATE usuario
SET id = COALESCE(id, gen_random_uuid()),
    activo = COALESCE(activo, TRUE),
    created_at = COALESCE(created_at, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP)
WHERE id IS NULL
   OR activo IS NULL
   OR created_at IS NULL
   OR updated_at IS NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'uq_usuario_id'
    ) THEN
        ALTER TABLE usuario ADD CONSTRAINT uq_usuario_id UNIQUE (id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_usuario_rol_id'
    ) THEN
        ALTER TABLE usuario
            ADD CONSTRAINT fk_usuario_rol_id
            FOREIGN KEY (rol_id) REFERENCES rol(id_rol);
    END IF;
END $$;

ALTER TABLE IF EXISTS usuario
    ALTER COLUMN id SET NOT NULL,
    ALTER COLUMN nombres SET NOT NULL,
    ALTER COLUMN apellidos SET NOT NULL,
    ALTER COLUMN correo SET NOT NULL,
    ALTER COLUMN contrasena SET NOT NULL,
    ALTER COLUMN activo SET NOT NULL,
    ALTER COLUMN rol_id SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_usuario_rol_id ON usuario(rol_id);

-- 3) Alinear empresa con referencia UUID hacia usuario(id)
ALTER TABLE IF EXISTS empresa
    ADD COLUMN IF NOT EXISTS id_usuario_uuid UUID;

UPDATE empresa e
SET id_usuario_uuid = u.id
FROM usuario u
WHERE e.id_usuario_uuid IS NULL
  AND e.id_usuario IS NOT NULL
  AND u.id_usuario = e.id_usuario;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'empresa' AND column_name = 'id_usuario'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'empresa' AND column_name = 'id_usuario_legacy'
    ) THEN
        ALTER TABLE empresa RENAME COLUMN id_usuario TO id_usuario_legacy;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'empresa' AND column_name = 'id_usuario_uuid'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'empresa' AND column_name = 'id_usuario'
    ) THEN
        ALTER TABLE empresa RENAME COLUMN id_usuario_uuid TO id_usuario;
    END IF;
END $$;

DO $$
DECLARE
    c RECORD;
BEGIN
    FOR c IN
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = 'empresa'
          AND con.contype = 'f'
    LOOP
        EXECUTE format('ALTER TABLE empresa DROP CONSTRAINT IF EXISTS %I', c.conname);
    END LOOP;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_empresa_usuario_uuid'
    ) THEN
        ALTER TABLE empresa
            ADD CONSTRAINT fk_empresa_usuario_uuid
            FOREIGN KEY (id_usuario) REFERENCES usuario(id);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_empresa_categoria'
    ) THEN
        ALTER TABLE empresa
            ADD CONSTRAINT fk_empresa_categoria
            FOREIGN KEY (id_categoria) REFERENCES categoria_empresa(id_categoria);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_empresa_usuario ON empresa(id_usuario);
CREATE INDEX IF NOT EXISTS idx_empresa_categoria ON empresa(id_categoria);

-- 4) Alinear publicacion con entidad actual
ALTER TABLE IF EXISTS publicacion
    ADD COLUMN IF NOT EXISTS id UUID,
    ADD COLUMN IF NOT EXISTS contenido VARCHAR(5000),
    ADD COLUMN IF NOT EXISTS enlace VARCHAR(500),
    ADD COLUMN IF NOT EXISTS fecha_programada TIMESTAMP,
    ADD COLUMN IF NOT EXISTS fecha_publicacion TIMESTAMP,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

UPDATE publicacion
SET id = COALESCE(id, gen_random_uuid()),
    contenido = COALESCE(contenido, descripcion, titulo),
    created_at = COALESCE(created_at, fecha_creacion, CURRENT_TIMESTAMP),
    updated_at = COALESCE(updated_at, created_at, CURRENT_TIMESTAMP),
    fecha_programada = COALESCE(fecha_programada, fecha_inicio),
    fecha_publicacion = COALESCE(fecha_publicacion, fecha_fin)
WHERE id IS NULL
   OR contenido IS NULL
   OR created_at IS NULL
   OR updated_at IS NULL
   OR fecha_programada IS NULL
   OR fecha_publicacion IS NULL;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'publicacion' AND column_name = 'id_empresa'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'publicacion' AND column_name = 'empresa_id'
    ) THEN
        ALTER TABLE publicacion RENAME COLUMN id_empresa TO empresa_id;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'publicacion' AND column_name = 'estado'
    ) THEN
        ALTER TABLE publicacion
            ALTER COLUMN estado TYPE VARCHAR(30)
            USING CASE
                WHEN estado::text IN ('t', 'true', '1') THEN 'ACTIVA'
                WHEN estado::text IN ('f', 'false', '0') THEN 'INACTIVA'
                ELSE estado::text
            END;
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_publicacion_id'
    ) THEN
        ALTER TABLE publicacion ADD CONSTRAINT uq_publicacion_id UNIQUE (id);
    END IF;
END $$;

DO $$
DECLARE
    c RECORD;
BEGIN
    FOR c IN
        SELECT con.conname
        FROM pg_constraint con
        JOIN pg_class rel ON rel.oid = con.conrelid
        WHERE rel.relname = 'publicacion'
          AND con.contype = 'f'
    LOOP
        EXECUTE format('ALTER TABLE publicacion DROP CONSTRAINT IF EXISTS %I', c.conname);
    END LOOP;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_publicacion_empresa'
    ) THEN
        ALTER TABLE publicacion
            ADD CONSTRAINT fk_publicacion_empresa
            FOREIGN KEY (empresa_id) REFERENCES empresa(id_empresa);
    END IF;
END $$;

ALTER TABLE IF EXISTS publicacion
    ALTER COLUMN id SET NOT NULL,
    ALTER COLUMN contenido SET NOT NULL,
    ALTER COLUMN estado SET NOT NULL,
    ALTER COLUMN empresa_id SET NOT NULL,
    ALTER COLUMN created_at SET NOT NULL,
    ALTER COLUMN updated_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_publicacion_empresa ON publicacion(empresa_id);

-- 5) Tablas nuevas del modelo actual que no existen en schema legacy
CREATE TABLE IF NOT EXISTS categoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(100) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    activa BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS red_social (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(80) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    url_base VARCHAR(255),
    activa BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS campania (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo VARCHAR(150) NOT NULL,
    descripcion VARCHAR(4000) NOT NULL,
    bases VARCHAR(5000),
    fecha_inicio TIMESTAMP NOT NULL,
    fecha_fin TIMESTAMP NOT NULL,
    activa BOOLEAN NOT NULL,
    creador_id UUID NOT NULL,
    categoria_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_campania_creador FOREIGN KEY (creador_id) REFERENCES usuario(id),
    CONSTRAINT fk_campania_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id)
);

CREATE TABLE IF NOT EXISTS campania_red_social (
    campania_id UUID NOT NULL,
    red_social_id UUID NOT NULL,
    PRIMARY KEY (campania_id, red_social_id),
    CONSTRAINT fk_campania_red_social_campania FOREIGN KEY (campania_id) REFERENCES campania(id),
    CONSTRAINT fk_campania_red_social_red_social FOREIGN KEY (red_social_id) REFERENCES red_social(id)
);

CREATE TABLE IF NOT EXISTS premio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(150) NOT NULL,
    descripcion VARCHAR(1000),
    cantidad_disponible INT NOT NULL,
    valor_referencial NUMERIC(12,2),
    campania_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_premio_campania FOREIGN KEY (campania_id) REFERENCES campania(id)
);

CREATE TABLE IF NOT EXISTS participacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_participacion VARCHAR(50) NOT NULL UNIQUE,
    estado VARCHAR(30) NOT NULL,
    fecha_participacion TIMESTAMP NOT NULL,
    usuario_id UUID NOT NULL,
    campania_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_participacion_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT fk_participacion_campania FOREIGN KEY (campania_id) REFERENCES campania(id)
);

CREATE TABLE IF NOT EXISTS evidencia_participacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo VARCHAR(50) NOT NULL,
    url_archivo VARCHAR(500) NOT NULL,
    descripcion VARCHAR(500),
    participacion_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_evidencia_participacion FOREIGN KEY (participacion_id) REFERENCES participacion(id)
);

CREATE TABLE IF NOT EXISTS sorteo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campania_id UUID NOT NULL UNIQUE,
    fecha_sorteo TIMESTAMP NOT NULL,
    metodo VARCHAR(100) NOT NULL,
    estado VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sorteo_campania FOREIGN KEY (campania_id) REFERENCES campania(id)
);

CREATE TABLE IF NOT EXISTS ganador (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sorteo_id UUID NOT NULL,
    usuario_id UUID NOT NULL,
    premio_id UUID NOT NULL,
    fecha_seleccion TIMESTAMP NOT NULL,
    estado_notificacion VARCHAR(30) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ganador_sorteo FOREIGN KEY (sorteo_id) REFERENCES sorteo(id),
    CONSTRAINT fk_ganador_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id),
    CONSTRAINT fk_ganador_premio FOREIGN KEY (premio_id) REFERENCES premio(id)
);

CREATE TABLE IF NOT EXISTS notificacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id UUID NOT NULL,
    titulo VARCHAR(150) NOT NULL,
    mensaje VARCHAR(2000) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    leida BOOLEAN NOT NULL,
    fecha_lectura TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notificacion_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id)
);

CREATE TABLE IF NOT EXISTS auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entidad_afectada VARCHAR(120) NOT NULL,
    entidad_id UUID NOT NULL,
    accion_realizada VARCHAR(50) NOT NULL,
    usuario_responsable_id UUID,
    fecha_accion TIMESTAMP NOT NULL,
    detalles_cambio VARCHAR(4000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_auditoria_usuario FOREIGN KEY (usuario_responsable_id) REFERENCES usuario(id)
);

CREATE INDEX IF NOT EXISTS idx_campania_creador ON campania(creador_id);
CREATE INDEX IF NOT EXISTS idx_campania_categoria ON campania(categoria_id);
CREATE INDEX IF NOT EXISTS idx_premio_campania ON premio(campania_id);
CREATE INDEX IF NOT EXISTS idx_participacion_usuario ON participacion(usuario_id);
CREATE INDEX IF NOT EXISTS idx_participacion_campania ON participacion(campania_id);
CREATE INDEX IF NOT EXISTS idx_evidencia_participacion ON evidencia_participacion(participacion_id);
CREATE INDEX IF NOT EXISTS idx_ganador_sorteo ON ganador(sorteo_id);
CREATE INDEX IF NOT EXISTS idx_ganador_usuario ON ganador(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ganador_premio ON ganador(premio_id);
CREATE INDEX IF NOT EXISTS idx_notificacion_usuario ON notificacion(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_responsable_id);

-- 6) Semilla de rol por defecto de registro
INSERT INTO rol (nombre, descripcion, created_at, updated_at)
VALUES ('USER', 'Rol por defecto para usuarios registrados', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (nombre) DO NOTHING;
