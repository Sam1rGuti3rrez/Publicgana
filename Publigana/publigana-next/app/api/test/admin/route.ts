import { NextResponse } from "next/server";
import { requireRole } from "@/app/lib/auth";

export async function GET(request: Request) {
  const auth = await requireRole(request, "ADMIN");

  if ("response" in auth) {
    return auth.response;
  }

  return NextResponse.json({
    ok: true,
    message: "Acceso autorizado",
    rol: "ADMIN",
  });
}
