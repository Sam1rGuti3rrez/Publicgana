import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET() {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombres: true,
        apellidos: true,
        correo: true,
        telefono: true,
        activo: true,
        ultimoAcceso: true,
        rol: {
          select: {
            idRol: true,
            nombre: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(usuarios);
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);

    return NextResponse.json(
      { error: "No fue posible obtener los usuarios" },
      { status: 500 },
    );
  }
}