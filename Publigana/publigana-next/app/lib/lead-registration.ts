import { NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import {
  getColombianMunicipality,
  municipalityNameMatches,
} from "@/app/lib/colombian-municipalities";
import { parseOptionalLocationDetail } from "@/app/lib/location-detail";
import { parseColombianResidencyDeclaration } from "@/app/lib/registration-country";
import { getPrisma } from "@/app/lib/prisma";

type LeadCreateData = {
  id: string;
  nombre: string;
  correo: string;
  ciudad: string;
  municipalityCode: string;
  locality: string | null;
  countryCode: "CO";
  tipo_usuario: string;
};

type LeadResponse = Pick<
  LeadCreateData,
  "id" | "nombre" | "correo" | "ciudad" | "tipo_usuario"
>;

export type LeadRepository = {
  leads: {
    findUnique(args: {
      where: { correo: string };
    }): Promise<{ id: string } | null>;
    create(args: { data: LeadCreateData }): Promise<LeadResponse>;
  };
};

const getLeadRepository = (): LeadRepository => {
  const prisma = getPrisma();

  return {
    leads: {
      findUnique: ({ where }) =>
        prisma.leads.findUnique({
          where,
          select: { id: true },
        }),
      create: ({ data }) =>
        prisma.leads.create({
          data,
          select: {
            id: true,
            nombre: true,
            correo: true,
            ciudad: true,
            tipo_usuario: true,
          },
        }),
    },
  };
};

export async function handleLeadPost(
  request: Request,
  corsHeaders: HeadersInit,
  duplicateEmailMessage: string,
  getRepository: () => LeadRepository = getLeadRepository,
) {
  const badRequest = (message: string) =>
    NextResponse.json(
      { message },
      {
        status: 400,
        headers: corsHeaders,
      },
    );

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return badRequest("La solicitud no contiene un JSON válido.");
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return badRequest("La solicitud no es válida.");
  }

  const payload = body as Record<string, unknown>;
  const nombre = typeof payload.nombre === "string" ? payload.nombre.trim() : "";
  const correo =
    typeof payload.correo === "string"
      ? payload.correo.trim().toLowerCase()
      : "";
  const ciudad = typeof payload.ciudad === "string" ? payload.ciudad.trim() : "";
  const municipality = getColombianMunicipality(
    payload.municipalityCode,
    payload.departmentCode,
  );
  const locationDetail = parseOptionalLocationDetail(payload.locality);
  const tipoUsuario =
    typeof payload.tipoUsuario === "string" ? payload.tipoUsuario.trim() : "";
  const countryCode = parseColombianResidencyDeclaration(
    payload.countryCode,
    payload.residencyConfirmed,
  );

  if (!countryCode) {
    return badRequest(
      "Para registrar tu interés, debes confirmar que resides actualmente en Colombia.",
    );
  }

  if (!municipality) {
    return badRequest(
      "Selecciona un departamento y un municipio válidos de Colombia.",
    );
  }

  if (!locationDetail.valid) {
    return badRequest(
      "La localidad debe ser texto de hasta 150 caracteres y no contener caracteres de control.",
    );
  }

  if (payload.ciudad !== undefined && !municipalityNameMatches(ciudad, municipality)) {
    return badRequest(
      "La ciudad no coincide con el municipio colombiano seleccionado.",
    );
  }

  if (!nombre) {
    return badRequest("El nombre es obligatorio");
  }

  if (!correo) {
    return badRequest("El correo es obligatorio");
  }

  const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);

  if (!emailValido) {
    return badRequest("El correo no es valido");
  }

  if (!tipoUsuario) {
    return badRequest("El tipo de usuario es obligatorio");
  }

  if (!["usuario", "negocio"].includes(tipoUsuario)) {
    return badRequest("El tipo de usuario es obligatorio");
  }

  try {
    const repository = getRepository();
    const leadExistente = await repository.leads.findUnique({
      where: { correo },
    });

    if (leadExistente) {
      return NextResponse.json(
        { message: duplicateEmailMessage },
        {
          status: 400,
          headers: corsHeaders,
        },
      );
    }

    const lead = await repository.leads.create({
      data: {
        id: crypto.randomUUID(),
        nombre,
        correo,
        ciudad: municipality.name,
        municipalityCode: municipality.code,
        locality: locationDetail.value,
        countryCode,
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002" &&
      (error.meta?.target === "correo" ||
        (Array.isArray(error.meta?.target) &&
          error.meta.target.includes("correo")))
    ) {
      return NextResponse.json(
        { message: duplicateEmailMessage },
        {
          status: 409,
          headers: corsHeaders,
        },
      );
    }

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
