CREATE TABLE Interesados(

                      id UUID PRIMARY KEY,

                      nombre VARCHAR(150) NOT NULL,

                      correo VARCHAR(150) NOT NULL UNIQUE,

                      ciudad VARCHAR(100) NOT NULL,

                      tipo_usuario VARCHAR(50) NOT NULL,

                      fecha_registro TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

);