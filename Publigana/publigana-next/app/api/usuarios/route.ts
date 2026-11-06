import { NextResponse } from "next/server";
import { requirePermission } from "@/app/lib/authorization/authorize";
import { PERMISSIONS } from "@/app/lib/authorization/permissions";
import { getPrisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
  try {
    const auth = await requirePermission(request, PERMISSIONS.USERS_LIST);

    if ("response" in auth) {
      return auth.response;
    }

    const prisma = getPrisma();
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

    return NextResponse.json(usuarios, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    console.error("Error obteniendo usuarios:", error);

    return NextResponse.json(
      { error: "No fue posible obtener los usuarios" },
      { status: 500 },
    );
  }
}