import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { verifyToken } from "@/app/lib/jwt";

export async function GET(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";

    if (!auth.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = auth.replace(/^Bearer\s+/i, "");

    let payload;
    try {
      payload = verifyToken(token);
    } catch (e) {
      console.error("[AUTH ERROR] Token verification failed:", (e as Error).message);
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    // Validación defensiva: asegurar que el payload tiene los campos requeridos
    if (!payload || !payload.userId || !payload.rol) {
      console.error(
        "[AUTH ERROR] Token payload incompleto",
        { hasUserId: !!payload?.userId, hasRol: !!payload?.rol }
      );
      return NextResponse.json(
        { error: "Token incompleto o inválido" },
        { status: 401 }
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: payload.userId },
      include: { rol: true },
    });

    if (!usuario || !usuario.activo) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 401 });
    }

    // Validación defensiva: asegurar que el usuario tiene un rol válido
    if (!usuario.rol || !usuario.rol.nombre) {
      console.error(
        `[AUTH ERROR] Usuario ${usuario.id} no tiene rol válido en BD`,
        { rolData: usuario.rol }
      );
      return NextResponse.json(
        { error: "Usuario sin rol configurado en la base de datos" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      correo: usuario.correo,
      telefono: usuario.telefono,
      rol: usuario.rol.nombre,
    });
  } catch (error) {
    console.error("[ERROR] /usuarios/me:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
