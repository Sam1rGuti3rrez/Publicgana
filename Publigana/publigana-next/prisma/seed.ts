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

async function main() {
  console.log("🌱 Iniciando seed de PubliGana...");

  const roles = [
    {
      nombre: "ADMIN",
      descripcion: "Administrador del sistema",
    },
    {
      nombre: "promotor",
      descripcion:
        "Usuario que participa en campañas compartiendo contenido",
    },
    {
      nombre: "negocio",
      descripcion: "Usuario que crea y gestiona campañas",
    },
  ];

  for (const role of roles) {
    await prisma.rol.upsert({
      where: {
        nombre: role.nombre,
      },
      update: {
        descripcion: role.descripcion,
        updatedAt: new Date(),
      },
      create: {
        nombre: role.nombre,
        descripcion: role.descripcion,
      },
    });
  }

  const adminRole = await prisma.rol.findUnique({
    where: {
      nombre: "ADMIN",
    },
  });

  if (!adminRole) {
    throw new Error("No fue posible obtener el rol ADMIN");
  }

  const passwordHash = await bcrypt.hash("Admin123*", 10);

  await prisma.usuario.upsert({
    where: {
      correo: "admin@publigana.com",
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
      correo: "admin@publigana.com",
      telefono: "3000000000",
      contrasena: passwordHash,
      activo: true,
      rolId: adminRole.idRol,
    },
  });

  console.log("✅ Roles creados/verificados.");
  console.log("✅ Usuario administrador creado/verificado.");
  console.log("📧 admin@publigana.com");
  console.log("🌱 Seed completado.");
}

main()
  .catch((error) => {
    console.error("❌ Error ejecutando seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });