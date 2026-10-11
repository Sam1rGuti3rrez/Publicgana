/*
  Warnings:

  - A unique constraint covering the columns `[nit]` on the table `empresa` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `publicacion` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nit` to the `empresa` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "usuario_telefono_key";

-- AlterTable
ALTER TABLE "empresa" ADD COLUMN     "nit" VARCHAR(30) NOT NULL;

-- AlterTable
ALTER TABLE "usuario" ADD COLUMN     "bio" VARCHAR(300),
ADD COLUMN     "foto_url" VARCHAR(255),
ALTER COLUMN "apellidos" DROP NOT NULL,
ALTER COLUMN "activo" SET DEFAULT true;

-- CreateTable
CREATE TABLE "flyway_schema_history" (
    "installed_rank" INTEGER NOT NULL,
    "version" VARCHAR(50),
    "description" VARCHAR(200) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "script" VARCHAR(1000) NOT NULL,
    "checksum" INTEGER,
    "installed_by" VARCHAR(100) NOT NULL,
    "installed_on" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "execution_time" INTEGER NOT NULL,
    "success" BOOLEAN NOT NULL,

    CONSTRAINT "flyway_schema_history_pk" PRIMARY KEY ("installed_rank")
);

-- CreateTable
CREATE TABLE "leads" (
    "id" UUID NOT NULL,
    "nombre" VARCHAR(150) NOT NULL,
    "correo" VARCHAR(150) NOT NULL,
    "ciudad" VARCHAR(100) NOT NULL,
    "tipo_usuario" VARCHAR(50) NOT NULL,
    "fecha_registro" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "flyway_schema_history_s_idx" ON "flyway_schema_history"("success");

-- CreateIndex
CREATE UNIQUE INDEX "leads_correo_key" ON "leads"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "empresa_nit_key" ON "empresa"("nit");

-- CreateIndex
CREATE UNIQUE INDEX "uq_publicacion_id" ON "publicacion"("id");

-- CreateIndex
CREATE INDEX "idx_usuario_correo" ON "usuario"("correo");

-- RenameIndex
ALTER INDEX "idx_publicacion_empresa" RENAME TO "idx_empresa_publicacion";
