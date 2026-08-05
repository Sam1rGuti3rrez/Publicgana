ALTER TABLE IF EXISTS empresa
    ADD COLUMN IF NOT EXISTS nit VARCHAR(50);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'uk_empresa_nit'
          AND conrelid = 'empresa'::regclass
    ) THEN
        ALTER TABLE empresa
            ADD CONSTRAINT uk_empresa_nit UNIQUE (nit);
    END IF;
END $$;
