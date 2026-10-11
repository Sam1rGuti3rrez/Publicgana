import { NextResponse } from "next/server";
import { requireRole } from "@/app/lib/auth";

export async function GET(request: Request) {
  const auth = await requireRole(request, "ADMIN");

  if ("response" in auth) {
    return auth.response;
  }

  return NextResponse.json(
    {
      id: auth.usuario.id,
      nombres: auth.usuario.nombres,
      apellidos: auth.usuario.apellidos,
      correo: auth.usuario.correo,
      rol: auth.usuario.rol.nombre,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}