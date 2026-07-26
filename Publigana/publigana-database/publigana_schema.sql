-- ============================================================
-- PUBLIGANA - Esquema de base de datos PostgreSQL
-- Modelo consolidado: ER original + ajustes de negocio
-- Mecanismo de recompensa: PAGO GARANTIZADO POR ACCIÓN
-- (se elimina sorteo/ganador; se agrega transaccion y metodo_pago_usuario)
-- ============================================================

-- Extensión necesaria para generar UUIDs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. ROLES Y USUARIOS
-- ============================================================

CREATE TABLE rol (
    id_rol       SERIAL PRIMARY KEY,
    nombre       VARCHAR(50) NOT NULL UNIQUE,          -- 'promotor', 'negocio', 'admin'
    descripcion  VARCHAR(255),
    created_at   TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE TABLE usuario (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombres         VARCHAR(100) NOT NULL,
    apellidos       VARCHAR(100),
    correo          VARCHAR(150) NOT NULL UNIQUE,
    telefono        VARCHAR(20),
    contrasena      VARCHAR(255) NOT NULL,
    activo          BOOLEAN DEFAULT TRUE,
    ultimo_acceso   TIMESTAMP WITHOUT TIME ZONE,
    rol_id          INTEGER NOT NULL REFERENCES rol(id_rol),
    created_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_usuario_rol ON usuario(rol_id);
CREATE INDEX idx_usuario_correo ON usuario(correo);

-- ============================================================
-- 2. CATEGORÍAS
-- ============================================================

-- Categorías de campañas (moda, comida, tech, etc.)
CREATE TABLE categoria (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre       VARCHAR(100) NOT NULL,
    descripcion  VARCHAR(255),
    activo       BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Categorías/rubros de negocios (restaurante, ropa, tecnología, etc.)
CREATE TABLE categoria_empresa (
    id_categoria SERIAL PRIMARY KEY,
    nombre       VARCHAR(255) NOT NULL,
    descripcion  TEXT
);

-- ============================================================
-- 3. EMPRESAS (NEGOCIOS)
-- ============================================================

CREATE TABLE empresa (
    id_empresa      SERIAL PRIMARY KEY,
    nombre          VARCHAR(150) NOT NULL,
    descripcion     TEXT,
    direccion       VARCHAR(255),
    telefono        VARCHAR(20),
    correo          VARCHAR(150),
    logo            VARCHAR(255),
    sitio_web       VARCHAR(255),
    estado          BOOLEAN DEFAULT TRUE,
    fecha_registro  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    id_usuario      UUID NOT NULL REFERENCES usuario(id),
    id_categoria    INTEGER REFERENCES categoria_empresa(id_categoria)
);

CREATE INDEX idx_empresa_usuario ON empresa(id_usuario);
CREATE INDEX idx_empresa_categoria ON empresa(id_categoria);

-- ============================================================
-- 4. REDES SOCIALES
-- ============================================================

CREATE TABLE red_social (
    id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre       VARCHAR(80) NOT NULL,          -- 'Instagram', 'TikTok', 'Facebook'
    descripcion  VARCHAR(255),
    url_base     VARCHAR(255),
    active       BOOLEAN DEFAULT TRUE,
    created_at   TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 5. CAMPAÑAS
-- ============================================================

CREATE TABLE campania (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo         VARCHAR(150) NOT NULL,
    descripcion    VARCHAR(4000),
    bases          VARCHAR(500),                 -- reglas/requisitos de la campaña
    fecha_inicio   TIMESTAMP WITHOUT TIME ZONE,
    fecha_fin      TIMESTAMP WITHOUT TIME ZONE,
    active         BOOLEAN DEFAULT TRUE,
    creador_id     UUID NOT NULL REFERENCES usuario(id),   -- usuario del negocio que crea
    categoria_id   UUID REFERENCES categoria(id),
    created_at     TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at     TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_campania_creador ON campania(creador_id);
CREATE INDEX idx_campania_categoria ON campania(categoria_id);
CREATE INDEX idx_campania_active ON campania(active);

-- Relación N:N entre campañas y redes sociales requeridas
CREATE TABLE campania_red_social (
    campania_id   UUID NOT NULL REFERENCES campania(id) ON DELETE CASCADE,
    red_social_id UUID NOT NULL REFERENCES red_social(id),
    PRIMARY KEY (campania_id, red_social_id)
);

-- ============================================================
-- 6. PREMIOS (monto ofrecido por acción, ligado a la campaña)
-- ============================================================

CREATE TABLE premio (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre               VARCHAR(150) NOT NULL,
    descripcion          VARCHAR(500),
    cantidad_disponible  INTEGER NOT NULL,        -- cupos/meta de participantes
    valor_referencial    NUMERIC(12,2) NOT NULL,  -- monto pagado por acción cumplida
    campania_id          UUID NOT NULL REFERENCES campania(id) ON DELETE CASCADE,
    created_at           TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at           TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_premio_campania ON premio(campania_id);

-- ============================================================
-- 7. PARTICIPACIONES
-- ============================================================

CREATE TABLE participacion (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_participacion   VARCHAR(50) NOT NULL UNIQUE,   -- código único de seguimiento
    estado                 VARCHAR(30) NOT NULL DEFAULT 'pendiente'
                           CHECK (estado IN ('pendiente','aprobada','rechazada','pagada')),
    fecha_participacion    TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    usuario_id             UUID NOT NULL REFERENCES usuario(id),
    campania_id            UUID NOT NULL REFERENCES campania(id),
    created_at             TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at             TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    UNIQUE (usuario_id, campania_id)   -- un usuario participa una sola vez por campaña
);

CREATE INDEX idx_participacion_usuario ON participacion(usuario_id);
CREATE INDEX idx_participacion_campania ON participacion(campania_id);
CREATE INDEX idx_participacion_estado ON participacion(estado);

-- Evidencia de participación (puede haber varias por participación)
CREATE TABLE evidencia_participacion (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo             VARCHAR(50),                  -- 'link', 'captura', 'video'
    url_archivo      VARCHAR(500) NOT NULL,
    descripcion      VARCHAR(500),
    participacion_id UUID NOT NULL REFERENCES participacion(id) ON DELETE CASCADE,
    created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_evidencia_participacion ON evidencia_participacion(participacion_id);

-- ============================================================
-- 8. PAGOS (mecanismo de pago garantizado por acción)
-- ============================================================

-- Método de pago del usuario (dónde se le deposita su recompensa)
CREATE TABLE metodo_pago_usuario (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id       UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    tipo             VARCHAR(50) NOT NULL,          -- 'nequi', 'daviplata', 'bancolombia', etc.
    numero_cuenta    VARCHAR(100) NOT NULL,
    nombre_titular   VARCHAR(150) NOT NULL,
    predeterminado   BOOLEAN DEFAULT TRUE,
    created_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at       TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_metodo_pago_usuario ON metodo_pago_usuario(usuario_id);

-- Transacción/pago real de cada participación aprobada
CREATE TABLE transaccion (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    participacion_id   UUID NOT NULL UNIQUE REFERENCES participacion(id),
    monto              NUMERIC(12,2) NOT NULL,
    estado             VARCHAR(30) NOT NULL DEFAULT 'pendiente'
                       CHECK (estado IN ('pendiente','pagado','fallido')),
    metodo             VARCHAR(50),                  -- copia del método usado al momento del pago
    referencia_pago    VARCHAR(150),                 -- número de comprobante/transacción externa
    fecha_pago         TIMESTAMP WITHOUT TIME ZONE,
    created_at         TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at         TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_transaccion_participacion ON transaccion(participacion_id);
CREATE INDEX idx_transaccion_estado ON transaccion(estado);

-- ============================================================
-- 9. PUBLICACIONES (contenido programado por el negocio)
-- ============================================================

CREATE TABLE publicacion (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contenido           VARCHAR(5000),
    enlace              VARCHAR(500),
    fecha_programada    TIMESTAMP WITHOUT TIME ZONE,
    fecha_publicacion   TIMESTAMP WITHOUT TIME ZONE,
    estado              VARCHAR(30) DEFAULT 'programada'
                        CHECK (estado IN ('programada','publicada','cancelada')),
    empresa_id          INTEGER NOT NULL REFERENCES empresa(id_empresa),
    created_at          TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at          TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_publicacion_empresa ON publicacion(empresa_id);

-- ============================================================
-- 10. NOTIFICACIONES
-- ============================================================

CREATE TABLE notificacion (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usuario_id     UUID NOT NULL REFERENCES usuario(id) ON DELETE CASCADE,
    titulo         VARCHAR(150) NOT NULL,
    mensaje        VARCHAR(2000),
    tipo           VARCHAR(50),                    -- 'campania', 'pago', 'sistema'
    leida          BOOLEAN DEFAULT FALSE,
    fecha_lectura  TIMESTAMP WITHOUT TIME ZONE,
    created_at     TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at     TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notificacion_usuario ON notificacion(usuario_id);
CREATE INDEX idx_notificacion_leida ON notificacion(leida);

-- ============================================================
-- 11. AUDITORÍA
-- ============================================================

CREATE TABLE auditoria (
    id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entidad_afectada       VARCHAR(120) NOT NULL,   -- ej: 'campania', 'participacion'
    entidad_id             UUID,
    accion_realizada       VARCHAR(100) NOT NULL,   -- ej: 'crear', 'aprobar', 'rechazar'
    usuario_responsable_id UUID REFERENCES usuario(id),
    fecha_accion           TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    detalles_cambio        VARCHAR(4000),
    created_at             TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
    updated_at             TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_auditoria_entidad ON auditoria(entidad_afectada, entidad_id);
CREATE INDEX idx_auditoria_usuario ON auditoria(usuario_responsable_id);

-- ============================================================
-- 12. LEADS (captura de interesados durante el soft launch)
-- ============================================================

CREATE TABLE leads (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre          VARCHAR(150) NOT NULL,
    correo          VARCHAR(150) NOT NULL,
    ciudad          VARCHAR(100),
    tipo_usuario    VARCHAR(50),                    -- 'promotor' o 'negocio', interés declarado
    fecha_registro  TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_leads_correo ON leads(correo);

-- ============================================================
-- DATOS INICIALES (seed) — roles y categorías base
-- ============================================================

INSERT INTO rol (nombre, descripcion) VALUES
    ('promotor', 'Usuario que participa en campañas compartiendo contenido'),
    ('negocio',  'Usuario que crea y gestiona campañas'),
    ('admin',    'Administrador de la plataforma');

INSERT INTO categoria (nombre, descripcion) VALUES
    ('Moda', 'Ropa, calzado y accesorios'),
    ('Comida', 'Restaurantes y gastronomía'),
    ('Tecnología', 'Productos y servicios tech'),
    ('Belleza', 'Cosméticos y cuidado personal');

INSERT INTO red_social (nombre, url_base) VALUES
    ('Instagram', 'https://instagram.com'),
    ('TikTok', 'https://tiktok.com'),
    ('Facebook', 'https://facebook.com');

-- ============================================================
-- FIN DEL SCRIPT
-- ============================================================
