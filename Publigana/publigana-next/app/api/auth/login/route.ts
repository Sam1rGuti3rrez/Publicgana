import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import bcrypt from "bcrypt";
import { getPrisma } from "@/app/lib/prisma";
import { getTokenExpiration } from "@/app/lib/jwt";
import {
  ADMIN_SESSION_COOKIE,
  getAdminSessionCookieOptions,
  isTrustedWebOrigin,
  shouldIssueAdminSessionCookie,
} from "@/app/lib/security";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:8081",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function getDatabaseIdentity(databaseName: string) {
  return createHash("sha256").update(databaseName).digest("hex").slice(0, 12);
}

function logAuthDiagnostic(
  event:
    | "body_received"
    | "user_found"
    | "user_not_found"
    | "inactive_user"
    | "bcrypt_match"
    | "password_mismatch"
    | "database_error"
    | "database_identity_verified",
  databaseIdentity?: string,
) {
  console.info("AUTH_DIAGNOSTIC", {
    event,
    ...(databaseIdentity ? { databaseIdentity } : {}),
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    logAuthDiagnostic("body_received");

    const correo = body.correo?.trim();
    const contrasena = body.contrasena;

    if (!correo || !contrasena) {
      return NextResponse.json(
        { error: "Correo y contraseña son obligatorios" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    let prisma;
    let usuario;

    try {
      prisma = getPrisma();
      const [{ databaseName }] = await prisma.$queryRaw<{
        databaseName: string;
      }[]>`SELECT current_database() AS "databaseName"`;
      logAuthDiagnostic(
        "database_identity_verified",
        getDatabaseIdentity(databaseName),
      );

      usuario = await prisma.usuario.findUnique({
        where: {
          correo,
        },
        include: {
          rol: true,
        },
      });
    } catch {
      logAuthDiagnostic("database_error");
      return NextResponse.json(
        { error: "Error interno del servidor" },
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }

    if (!usuario) {
      logAuthDiagnostic("user_not_found");
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        {
          status: 401,
          headers: corsHeaders,
        },
      );
    }

    logAuthDiagnostic("user_found");

    if (!usuario.activo) {
      logAuthDiagnostic("inactive_user");
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        {
          status: 401,
          headers: corsHeaders,
        },
      );
    }

    const passwordValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena,
    );

    if (!passwordValida) {
      logAuthDiagnostic("password_mismatch");
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        {
          status: 401,
          headers: corsHeaders,
        },
      );
    }

    logAuthDiagnostic("bcrypt_match");

    // Validación defensiva: asegurar que el rol existe
    if (!usuario.rol || !usuario.rol.nombre) {
      return NextResponse.json(
        { error: "Usuario sin rol configurado en la base de datos" },
        { status: 500, headers: corsHeaders }
      );
    }

    await prisma.usuario.update({
      where: {
        id: usuario.id,
      },
      data: {
        ultimoAcceso: new Date(),
      },
    });

    const { signAccessToken, signRefreshToken } = await import("@/app/lib/jwt");

    const payload = {
      userId: usuario.id,
      rol: usuario.rol.nombre,
    };

    const accessToken = signAccessToken(payload);

    let refreshToken: string | undefined = undefined;

    try {
      refreshToken = signRefreshToken(payload);
    } catch {
      console.error("No se pudo generar el refresh token");
    }

    const response = NextResponse.json(
      {
        accessToken,
        refreshToken,
        usuario: {
          id: usuario.id,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
          rol: usuario.rol.nombre,
        },
      },
      { headers: corsHeaders },
    );

    if (isTrustedWebOrigin(request)) {
      if (shouldIssueAdminSessionCookie(usuario.rol.nombre, request)) {
        response.cookies.set(
          ADMIN_SESSION_COOKIE,
          accessToken,
          getAdminSessionCookieOptions(getTokenExpiration(accessToken)),
        );
      } else {
        response.cookies.set(
          ADMIN_SESSION_COOKIE,
          "",
          getAdminSessionCookieOptions(new Date(0)),
        );
      }
    }

    return response;
  } catch {
    console.error("Error interno de autenticación");

    return NextResponse.json(
      { error: "Error interno del servidor" },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}