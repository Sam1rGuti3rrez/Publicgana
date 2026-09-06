import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:8081",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const correo = body.correo?.trim();
    const contrasena = body.contrasena;

    console.info("[LOGIN DEBUG] Solicitud recibida", {
      method: request.method,
      endpoint: new URL(request.url).pathname,
      bodyFields: Object.keys(body),
      correo: typeof correo === "string" ? correo : null,
      contrasenaType: typeof contrasena,
      contrasenaLength:
        typeof contrasena === "string" ? contrasena.length : null,
    });

    if (!correo || !contrasena) {
      return NextResponse.json(
        { error: "Correo y contraseña son obligatorios" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        correo,
      },
      include: {
        rol: true,
      },
    });

    console.info("[LOGIN DEBUG] Resultado de búsqueda", {
      correo,
      existe: Boolean(usuario),
      activo: usuario?.activo ?? null,
      tieneRol: Boolean(usuario?.rol),
      rol: usuario?.rol?.nombre ?? null,
      contrasenaType: usuario ? typeof usuario.contrasena : null,
      contrasenaLength: usuario?.contrasena?.length ?? null,
      formatoBcrypt:
        typeof usuario?.contrasena === "string" &&
        /^\$2[aby]?\$\d{2}\$/.test(usuario.contrasena),
      rondasBcrypt:
        typeof usuario?.contrasena === "string"
          ? Number.parseInt(usuario.contrasena.slice(4, 6), 10) || null
          : null,
    });

    if (!usuario || !usuario.activo) {
      console.warn("[LOGIN DEBUG] Rechazo antes de comparar contraseña", {
        correo,
        existe: Boolean(usuario),
        activo: usuario?.activo ?? null,
      });
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
      console.warn("[LOGIN DEBUG] bcrypt.compare devolvió false", {
        correo,
        hashTieneFormatoBcrypt:
          /^\$2[aby]?\$\d{2}\$/.test(usuario.contrasena),
        hashLength: usuario.contrasena.length,
      });
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        {
          status: 401,
          headers: corsHeaders,
        },
      );
    }

    console.info("[LOGIN DEBUG] bcrypt.compare devolvió true", { correo });

    // Validación defensiva: asegurar que el rol existe
    if (!usuario.rol || !usuario.rol.nombre) {
      console.error(
        `[LOGIN ERROR] Usuario ${usuario.id} no tiene rol válido asociado`,
        { rolData: usuario.rol }
      );
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
    } catch (e) {
      console.error("No se pudo generar refreshToken:", e);
    }

    return NextResponse.json(
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
      {
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error en login:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}