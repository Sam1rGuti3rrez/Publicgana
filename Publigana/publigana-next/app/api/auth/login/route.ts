import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const correo = body.correo?.trim();
    const contrasena = body.contrasena;

    if (!correo || !contrasena) {
      return NextResponse.json(
        { error: "Correo y contraseña son obligatorios" },
        { status: 400 },
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
        { status: 401 },
      );
    }

    const passwordValida = await bcrypt.compare(
      contrasena,
      usuario.contrasena,
    );

    if (!passwordValida) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 },
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

    return NextResponse.json({
      usuario: {
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        correo: usuario.correo,
        rol: usuario.rol.nombre,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);

    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}