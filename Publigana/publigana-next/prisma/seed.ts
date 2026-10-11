import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL no está definida");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({ adapter });

const adminEmail = "admin@publigana.com";
const adminPassword = "Admin123*";

async function main() {
  const adminRole = await prisma.rol.upsert({
    where: { nombre: "ADMIN" },
    update: {
      descripcion: "Administrador del sistema",
      updatedAt: new Date(),
    },
    create: {
      nombre: "ADMIN",
      descripcion: "Administrador del sistema",
    },
  });

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.usuario.upsert({
    where: {
      correo: adminEmail,
    },
    update: {
      nombres: "Administrador",
      apellidos: "Publigana",
      telefono: "3000000000",
      contrasena: passwordHash,
      activo: true,
      rolId: adminRole.idRol,
      updatedAt: new Date(),
    },
    create: {
      nombres: "Administrador",
      apellidos: "Publigana",
      correo: adminEmail,
      telefono: "3000000000",
      contrasena: passwordHash,
      activo: true,
      rolId: adminRole.idRol,
    },
    include: { rol: true },
  });

  const passwordMatches = await bcrypt.compare(adminPassword, admin.contrasena);

  if (!admin.activo || admin.rol.nombre !== "ADMIN" || !passwordMatches) {
    throw new Error("La verificación de la cuenta ADMIN falló");
  }

  console.info("La cuenta ADMIN de desarrollo está configurada y verificada.");
}

main()
  .catch(() => {
    console.error("No se pudo completar o verificar el seed de ADMIN.");
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });