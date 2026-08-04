CREATE TABLE auditoria (
                           id UUID PRIMARY KEY,
                           entidad VARCHAR(100) NOT NULL,
                           accion VARCHAR(50) NOT NULL,
                           fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           detalle TEXT
);