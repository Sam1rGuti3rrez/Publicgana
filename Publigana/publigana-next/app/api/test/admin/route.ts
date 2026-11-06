import { NextResponse } from "next/server";
import { requireRoleAuthorization } from "@/app/lib/authorization/authorize";

export async function GET(request: Request) {
  const auth = await requireRoleAuthorization(request, ["ADMIN"]);

  if ("response" in auth) {
    return auth.response;
  }

  return NextResponse.json({
    ok: true,
    message: "Acceso autorizado",
    rol: "ADMIN",
  });
}
