CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(150) NOT NULL,
    correo VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100) NOT NULL,
    tipo_usuario VARCHAR(50) NOT NULL,
    fecha_registro TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_leads_correo ON leads(correo);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'interesados'
    ) THEN
        INSERT INTO leads (id, nombre, correo, ciudad, tipo_usuario, fecha_registro)
        SELECT i.id,
               i.nombre,
               i.correo,
               COALESCE(i.ciudad, 'SIN_CIUDAD'),
               COALESCE(i.tipo_usuario, 'NO_DEFINIDO'),
               COALESCE(i.fecha_registro, CURRENT_TIMESTAMP)
        FROM interesados i
        ON CONFLICT (correo) DO NOTHING;
    END IF;
END $$;
