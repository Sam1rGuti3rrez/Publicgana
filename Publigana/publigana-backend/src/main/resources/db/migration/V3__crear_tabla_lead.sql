CREATE TABLE IF NOT EXISTS interesados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100),
    tipo_usuario VARCHAR(50),
    fecha_registro TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_interesados_correo ON interesados(correo);
