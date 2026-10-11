import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  isTrustedWebOrigin,
} from "@/app/lib/security";

export async function POST(request: Request) {
  if (!isTrustedWebOrigin(request)) {
    return NextResponse.json({ error: "Origen no permitido" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    "",
    getAdminSessionCookieOptions(new Date(0)),
  );

  return response;
}