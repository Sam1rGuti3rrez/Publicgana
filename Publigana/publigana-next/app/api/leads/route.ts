import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
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

    const nombre = body.nombre?.trim();
    const correo = body.correo?.trim().toLowerCase();
    const ciudad = body.ciudad?.trim();
    const tipoUsuario = body.tipoUsuario?.trim();

    // Validaciones
    if (!nombre) {
      return NextResponse.json(
        { message: "El nombre es obligatorio" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    if (!correo) {
      return NextResponse.json(
        { message: "El correo es obligatorio" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

    if (!emailValido) {
      return NextResponse.json(
        { message: "El correo no es valido" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    if (!ciudad) {
      return NextResponse.json(
        { message: "La ciudad es obligatoria" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    if (!tipoUsuario) {
      return NextResponse.json(
        { message: "El tipo de usuario es obligatorio" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    if (!["usuario", "negocio"].includes(tipoUsuario)) {
      return NextResponse.json(
        { message: "El tipo de usuario es obligatorio" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    // Verificar si el correo ya existe
    const leadExistente = await prisma.leads.findUnique({
      where: {
        correo,
      },
    });

    if (leadExistente) {
      return NextResponse.json(
        { message: "El correo ya existe" },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    // Crear lead
    const lead = await prisma.leads.create({
      data: {
        id: crypto.randomUUID(),
        nombre,
        correo,
        ciudad,
        tipo_usuario: tipoUsuario,
      },
    });

    return NextResponse.json(
      {
        id: lead.id,
        nombre: lead.nombre,
        correo: lead.correo,
        ciudad: lead.ciudad,
        tipoUsuario: lead.tipo_usuario,
      },
      {
        status: 201,
        headers: corsHeaders,
      },
    );
  } catch (error) {
    console.error("Error en POST /api/leads:", error);

    return NextResponse.json(
      { message: "Error interno del servidor" },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}