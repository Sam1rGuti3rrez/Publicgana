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

    // =========================================================
    // DATOS RECIBIDOS
    // =========================================================

    const rol = body.rol?.trim().toLowerCase();

    const nombres = body.nombres?.trim() || null;
    const apellidos = body.apellidos?.trim() || null;

    const nombreEmpresa = body.nombreEmpresa?.trim() || null;
    const nit = body.nit?.trim() || null;

    const correo = body.correo?.trim().toLowerCase();
    const telefono = body.telefono?.trim() || null;

    const contrasena = body.contrasena;

    // =========================================================
    // VALIDACIÓN GENERAL
    // =========================================================

    if (!rol) {
      return NextResponse.json(
        {
          error: "El rol es obligatorio",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    if (!correo || !contrasena) {
      return NextResponse.json(
        {
          error: "Correo y contraseña son obligatorios",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    if (!telefono) {
      return NextResponse.json(
        {
          error: "El teléfono es obligatorio",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    // =========================================================
    // VALIDACIÓN PROMOTOR
    // =========================================================

    if (rol === "promotor") {
      if (!nombres || !apellidos) {
        return NextResponse.json(
          {
            error: "Nombres y apellidos son obligatorios para promotor",
          },
          {
            status: 400,
            headers: corsHeaders,
          },
        );
      }
    }

    // =========================================================
    // VALIDACIÓN NEGOCIO
    // =========================================================

    if (rol === "negocio") {
      if (!nombreEmpresa || !nit) {
        return NextResponse.json(
          {
            error: "Nombre de empresa y NIT son obligatorios para negocio",
          },
          {
            status: 400,
            headers: corsHeaders,
          },
        );
      }
    }

    // =========================================================
    // VALIDAR ROL
    // =========================================================

    if (rol !== "promotor" && rol !== "negocio") {
      return NextResponse.json(
        {
          error: "El rol debe ser promotor o negocio",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    // =========================================================
    // VALIDAR CONTRASEÑA
    // =========================================================

    if (contrasena.length < 8) {
      return NextResponse.json(
        {
          error: "La contraseña debe tener al menos 8 caracteres",
        },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    // =========================================================
    // VALIDAR CORREO EXISTENTE
    // =========================================================

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        correo,
      },
    });

    if (usuarioExistente) {
      return NextResponse.json(
        {
          error: "El correo ya está registrado",
        },
        {
          status: 409,
          headers: corsHeaders,
        },
      );
    }

    // =========================================================
    // BUSCAR ROL
    // =========================================================

    const rolDb = await prisma.rol.findUnique({
      where: {
        nombre: rol,
      },
    });

    if (!rolDb) {
      return NextResponse.json(
        {
          error: `El rol ${rol} no está configurado`,
        },
        {
          status: 500,
          headers: corsHeaders,
        },
      );
    }

    // =========================================================
    // VALIDAR NIT PARA NEGOCIO
    // =========================================================

    if (rol === "negocio") {
      const empresaExistente = await prisma.empresa.findUnique({
        where: {
          nit,
        },
      });

      if (empresaExistente) {
        return NextResponse.json(
          {
            error: "El NIT ya está registrado",
          },
          {
            status: 409,
            headers: corsHeaders,
          },
        );
      }
    }

    // =========================================================
    // ENCRIPTAR CONTRASEÑA
    // =========================================================

    const passwordHash = await bcrypt.hash(contrasena, 10);

    // =========================================================
    // CREAR USUARIO
    // =========================================================

    const usuario = await prisma.$transaction(async (tx) => {
      const nuevoUsuario = await tx.usuario.create({
        data: {
          nombres,
          apellidos,
          correo,
          telefono,
          contrasena: passwordHash,
          activo: true,
          rolId: rolDb.idRol,
        },
        include: {
          rol: true,
        },
      });

      // =======================================================
      // SI ES NEGOCIO, CREAR EMPRESA
      // =======================================================

      if (rol === "negocio") {
        await tx.empresa.create({
          data: {
            nombre: nombreEmpresa,
            nit: nit,
            correo,
            telefono,
            estado: true,
            fechaRegistro: new Date(),
            idUsuario: nuevoUsuario.id,
          },
        });
      }

      return nuevoUsuario;
    });

    // =========================================================
    // RESPUESTA
    // =========================================================

    return NextResponse.json(
      {
        message:
          rol === "negocio"
            ? "Usuario y empresa registrados correctamente"
            : "Usuario registrado correctamente",

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
      {
        error: "Error interno del servidor",
      },
      {
        status: 500,
        headers: corsHeaders,
      },
    );
  }
}