CREATE TABLE IF NOT EXISTS auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entidad_afectada VARCHAR(120) NOT NULL,
    entidad_id UUID NOT NULL,
    accion_realizada VARCHAR(50) NOT NULL,
    usuario_responsable_id UUID,
    fecha_accion TIMESTAMP NOT NULL,
    detalles_cambio VARCHAR(4000) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'usuario'
    ) AND NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'fk_auditoria_usuario'
          AND conrelid = 'auditoria'::regclass
    ) THEN
        ALTER TABLE auditoria
            ADD CONSTRAINT fk_auditoria_usuario
            FOREIGN KEY (usuario_responsable_id) REFERENCES usuario(id);
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria(usuario_responsable_id);
