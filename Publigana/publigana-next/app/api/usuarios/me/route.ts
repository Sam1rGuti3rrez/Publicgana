import { NextResponse } from "next/server";
import { requirePermission } from "@/app/lib/authorization/authorize";
import { PERMISSIONS } from "@/app/lib/authorization/permissions";

export async function GET(request: Request) {
  try {
    const auth = await requirePermission(request, PERMISSIONS.PROFILE_VIEW_OWN);

    if ("response" in auth) {
      return auth.response;
    }

    const usuario = auth.usuario;

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
