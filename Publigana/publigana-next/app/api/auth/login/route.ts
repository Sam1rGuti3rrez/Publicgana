import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";
import { signAccessToken, signRefreshToken } from "@/app/lib/jwt";

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

    if (!usuario || !usuario.activo) {
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
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        {
          status: 401,
          headers: corsHeaders,
        },
      );
    }

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