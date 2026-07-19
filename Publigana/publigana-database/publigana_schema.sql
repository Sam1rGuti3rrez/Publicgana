-- publigana_schema.sql
CREATE TABLE rol(
 id_rol SERIAL PRIMARY KEY,
 nombre VARCHAR(50) UNIQUE NOT NULL,
 descripcion VARCHAR(255)
);

CREATE TABLE categoria_empresa(
 id_categoria SERIAL PRIMARY KEY,
 nombre VARCHAR(100) UNIQUE NOT NULL,
 descripcion TEXT
);

CREATE TABLE usuario(
 id_usuario SERIAL PRIMARY KEY,
 nombres VARCHAR(100) NOT NULL,
 apellidos VARCHAR(100) NOT NULL,
 correo VARCHAR(150) UNIQUE NOT NULL,
 telefono VARCHAR(20) UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 estado BOOLEAN DEFAULT TRUE,
 id_rol INT NOT NULL REFERENCES rol(id_rol)
);

CREATE TABLE empresa(
 id_empresa SERIAL PRIMARY KEY,
 nombre VARCHAR(150) NOT NULL,
 descripcion TEXT,
 direccion VARCHAR(255),
 telefono VARCHAR(20),
 correo VARCHAR(150),
 logo VARCHAR(255),
 sitio_web VARCHAR(255),
 estado BOOLEAN DEFAULT TRUE,
 fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
 id_categoria INT NOT NULL REFERENCES categoria_empresa(id_categoria)
);

CREATE TABLE publicacion(
 id_publicacion SERIAL PRIMARY KEY,
 titulo VARCHAR(200) NOT NULL,
 descripcion TEXT,
 imagen VARCHAR(255),
 fecha_inicio TIMESTAMP,
 fecha_fin TIMESTAMP,
 fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 estado BOOLEAN DEFAULT TRUE,
 id_empresa INT NOT NULL REFERENCES empresa(id_empresa)
);

CREATE TABLE comentario(
 id_comentario SERIAL PRIMARY KEY,
 texto TEXT NOT NULL,
 fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 editado BOOLEAN DEFAULT FALSE,
 fecha_actualizacion TIMESTAMP,
 id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
 id_publicacion INT NOT NULL REFERENCES publicacion(id_publicacion)
);

CREATE TABLE interaccion(
 id_interaccion SERIAL PRIMARY KEY,
 tipo VARCHAR(30) NOT NULL,
 fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 id_usuario INT NOT NULL REFERENCES usuario(id_usuario),
 id_publicacion INT NOT NULL REFERENCES publicacion(id_publicacion)
);

CREATE INDEX idx_usuario_rol ON usuario(id_rol);
CREATE INDEX idx_empresa_usuario ON empresa(id_usuario);
CREATE INDEX idx_empresa_categoria ON empresa(id_categoria);
CREATE INDEX idx_publicacion_empresa ON publicacion(id_empresa);
CREATE INDEX idx_comentario_usuario ON comentario(id_usuario);
CREATE INDEX idx_comentario_publicacion ON comentario(id_publicacion);
CREATE INDEX idx_interaccion_usuario ON interaccion(id_usuario);
CREATE INDEX idx_interaccion_publicacion ON interaccion(id_publicacion);
