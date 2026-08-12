-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "rol" (
    "id_rol" SERIAL NOT NULL,
    "nombre" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(255),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rol_pkey" PRIMARY KEY ("id_rol")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombres" VARCHAR(100) NOT NULL,
    "apellidos" VARCHAR(100) NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "telefono" VARCHAR(20),
    "contrasena" VARCHAR(255) NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "ultimo_acceso" TIMESTAMP(6),
    "rol_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categoria_empresa" (
    "id_categoria" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(255) NOT NULL,
    "descripcion" TEXT,

    CONSTRAINT "categoria_empresa_pkey" PRIMARY KEY ("id_categoria")
);

-- CreateTable
CREATE TABLE "empresa" (
    "id_empresa" BIGSERIAL NOT NULL,
    "nombre" VARCHAR(150),
    "descripcion" TEXT,
    "direccion" VARCHAR(255),
    "telefono" VARCHAR(20),
    "correo" VARCHAR(150),
    "logo" VARCHAR(255),
    "sitio_web" VARCHAR(255),
    "estado" BOOLEAN,
    "fecha_registro" TIMESTAMP(6),
    "id_usuario" UUID,
    "id_categoria" BIGINT,

    CONSTRAINT "empresa_pkey" PRIMARY KEY ("id_empresa")
);

-- CreateTable
CREATE TABLE "categoria" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" VARCHAR(255),
    "activa" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "red_social" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(80) NOT NULL,
    "descripcion" VARCHAR(255),
    "url_base" VARCHAR(255),
    "activa" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "red_social_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campania" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "titulo" VARCHAR(150) NOT NULL,
    "descripcion" VARCHAR(4000) NOT NULL,
    "bases" VARCHAR(5000),
    "fecha_inicio" TIMESTAMP(6) NOT NULL,
    "fecha_fin" TIMESTAMP(6) NOT NULL,
    "activa" BOOLEAN NOT NULL,
    "creador_id" UUID NOT NULL,
    "categoria_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campania_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campania_red_social" (
    "campania_id" UUID NOT NULL,
    "red_social_id" UUID NOT NULL,

    CONSTRAINT "campania_red_social_pkey" PRIMARY KEY ("campania_id","red_social_id")
);

-- CreateTable
CREATE TABLE "premio" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nombre" VARCHAR(150) NOT NULL,
    "descripcion" VARCHAR(1000),
    "cantidad_disponible" INTEGER NOT NULL,
    "valor_referencial" DECIMAL(12,2),
    "campania_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "premio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participacion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo_participacion" VARCHAR(50) NOT NULL,
    "estado" VARCHAR(30) NOT NULL,
    "fecha_participacion" TIMESTAMP(6) NOT NULL,
    "usuario_id" UUID NOT NULL,
    "campania_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "participacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidencia_participacion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tipo" VARCHAR(50) NOT NULL,
    "url_archivo" VARCHAR(500) NOT NULL,
    "descripcion" VARCHAR(500),
    "participacion_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidencia_participacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sorteo" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "campania_id" UUID NOT NULL,
    "fecha_sorteo" TIMESTAMP(6) NOT NULL,
    "metodo" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sorteo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ganador" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "sorteo_id" UUID NOT NULL,
    "usuario_id" UUID NOT NULL,
    "premio_id" UUID NOT NULL,
    "fecha_seleccion" TIMESTAMP(6) NOT NULL,
    "estado_notificacion" VARCHAR(30) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ganador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario_id" UUID NOT NULL,
    "titulo" VARCHAR(150) NOT NULL,
    "mensaje" VARCHAR(2000) NOT NULL,
    "tipo" VARCHAR(50) NOT NULL,
    "leida" BOOLEAN NOT NULL,
    "fecha_lectura" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditoria" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "entidad_afectada" VARCHAR(120) NOT NULL,
    "entidad_id" UUID NOT NULL,
    "accion_realizada" VARCHAR(50) NOT NULL,
    "usuario_responsable_id" UUID,
    "fecha_accion" TIMESTAMP(6) NOT NULL,
    "detalles_cambio" VARCHAR(4000) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publicacion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "contenido" VARCHAR(5000) NOT NULL,
    "enlace" VARCHAR(500),
    "fecha_programada" TIMESTAMP(6),
    "fecha_publicacion" TIMESTAMP(6),
    "estado" VARCHAR(30) NOT NULL,
    "empresa_id" BIGINT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publicacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rol_nombre_key" ON "rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_correo_key" ON "usuario"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_telefono_key" ON "usuario"("telefono");

-- CreateIndex
CREATE INDEX "idx_usuario_rol_id" ON "usuario"("rol_id");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_empresa_nombre_key" ON "categoria_empresa"("nombre");

-- CreateIndex
CREATE INDEX "idx_empresa_categoria" ON "empresa"("id_categoria");

-- CreateIndex
CREATE INDEX "idx_empresa_usuario" ON "empresa"("id_usuario");

-- CreateIndex
CREATE UNIQUE INDEX "categoria_nombre_key" ON "categoria"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "red_social_nombre_key" ON "red_social"("nombre");

-- CreateIndex
CREATE INDEX "idx_campania_categoria" ON "campania"("categoria_id");

-- CreateIndex
CREATE INDEX "idx_campania_creador" ON "campania"("creador_id");

-- CreateIndex
CREATE INDEX "idx_premio_campania" ON "premio"("campania_id");

-- CreateIndex
CREATE UNIQUE INDEX "participacion_codigo_participacion_key" ON "participacion"("codigo_participacion");

-- CreateIndex
CREATE INDEX "idx_participacion_campania" ON "participacion"("campania_id");

-- CreateIndex
CREATE INDEX "idx_participacion_usuario" ON "participacion"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_evidencia_participacion" ON "evidencia_participacion"("participacion_id");

-- CreateIndex
CREATE UNIQUE INDEX "sorteo_campania_id_key" ON "sorteo"("campania_id");

-- CreateIndex
CREATE INDEX "idx_ganador_premio" ON "ganador"("premio_id");

-- CreateIndex
CREATE INDEX "idx_ganador_sorteo" ON "ganador"("sorteo_id");

-- CreateIndex
CREATE INDEX "idx_ganador_usuario" ON "ganador"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_notificacion_usuario" ON "notificacion"("usuario_id");

-- CreateIndex
CREATE INDEX "idx_auditoria_usuario" ON "auditoria"("usuario_responsable_id");

-- CreateIndex
CREATE INDEX "idx_publicacion_empresa" ON "publicacion"("empresa_id");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "fk_usuario_rol" FOREIGN KEY ("rol_id") REFERENCES "rol"("id_rol") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empresa" ADD CONSTRAINT "fk_empresa_categoria" FOREIGN KEY ("id_categoria") REFERENCES "categoria_empresa"("id_categoria") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "empresa" ADD CONSTRAINT "fk_empresa_usuario" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campania" ADD CONSTRAINT "fk_campania_categoria" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campania" ADD CONSTRAINT "fk_campania_creador" FOREIGN KEY ("creador_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campania_red_social" ADD CONSTRAINT "fk_campania_red_social_campania" FOREIGN KEY ("campania_id") REFERENCES "campania"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campania_red_social" ADD CONSTRAINT "fk_campania_red_social_red_social" FOREIGN KEY ("red_social_id") REFERENCES "red_social"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "premio" ADD CONSTRAINT "fk_premio_campania" FOREIGN KEY ("campania_id") REFERENCES "campania"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participacion" ADD CONSTRAINT "fk_participacion_campania" FOREIGN KEY ("campania_id") REFERENCES "campania"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "participacion" ADD CONSTRAINT "fk_participacion_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "evidencia_participacion" ADD CONSTRAINT "fk_evidencia_participacion" FOREIGN KEY ("participacion_id") REFERENCES "participacion"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sorteo" ADD CONSTRAINT "fk_sorteo_campania" FOREIGN KEY ("campania_id") REFERENCES "campania"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ganador" ADD CONSTRAINT "fk_ganador_premio" FOREIGN KEY ("premio_id") REFERENCES "premio"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ganador" ADD CONSTRAINT "fk_ganador_sorteo" FOREIGN KEY ("sorteo_id") REFERENCES "sorteo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ganador" ADD CONSTRAINT "fk_ganador_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacion" ADD CONSTRAINT "fk_notificacion_usuario" FOREIGN KEY ("usuario_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "auditoria" ADD CONSTRAINT "fk_auditoria_usuario" FOREIGN KEY ("usuario_responsable_id") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "publicacion" ADD CONSTRAINT "fk_publicacion_empresa" FOREIGN KEY ("empresa_id") REFERENCES "empresa"("id_empresa") ON DELETE NO ACTION ON UPDATE NO ACTION;

