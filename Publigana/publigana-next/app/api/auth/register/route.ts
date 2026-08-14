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

    const nombres = body.nombres?.trim();
    const apellidos = body.apellidos?.trim() || null;
    const correo = body.correo?.trim().toLowerCase();
    const telefono = body.telefono?.trim() || null;
    const contrasena = body.contrasena;

    if (!nombres || !correo || !contrasena) {
      return NextResponse.json(
        { error: "Nombres, correo y contraseña son obligatorios" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    if (contrasena.length < 8) {
      return NextResponse.json(
        { error: "La contraseña debe tener al menos 8 caracteres" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        correo,
      },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        { error: "El correo ya está registrado" },
        {
          status: 409,
          headers: corsHeaders,
        },
      );
    }

    const rolPromotor = await prisma.rol.findUnique({
      where: {
        nombre: "promotor",
      },
    });

    if (!rolPromotor) {
      return NextResponse.json(
        { error: "El rol promotor no está configurado" },
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }

    const passwordHash = await bcrypt.hash(contrasena, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nombres,
        apellidos,
        correo,
        telefono,
        contrasena: passwordHash,
        activo: true,
        rolId: rolPromotor.idRol,
      },
      include: {
        rol: true,
      },
    });

    return NextResponse.json(
      {
        usuario: {
          id: usuario.id,
          nombres: usuario.nombres,
          apellidos: usuario.apellidos,
          correo: usuario.correo,
          telefono: usuario.telefono,
          rol: usuario.rol.nombre,
        },
      },
      {
        status: 201,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error en registro:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}